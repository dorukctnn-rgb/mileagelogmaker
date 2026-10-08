const express = require('express');
const path = require('path');

const BLOG_POSTS = require('./blog-posts.js');
const NICHE_PAGES = require('./content/niche-pages.js');
const R = require('./lib/rates.js');
const MLMCalc = require('./public/calc.js');
const { verifyLicense } = require('./lib/license.js');
const { buildLogPdf } = require('./lib/pdf.js');
const { buildCsv, buildXlsx } = require('./lib/export.js');

// The live host is www (the apex redirects there). Canonicals, og:url, JSON-LD and the sitemap all use it.
const SITE = 'https://www.mileagelogmaker.com';
const SITE_UPDATED = '2026-10-07';
const GUMROAD_URL = 'https://dorukctn.gumroad.com/l/agbyxg';
const INDEXNOW_KEY = 'aa6a5d532ea7f04d9077914e370757fd';

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// One URL per page. The production vercel.app alias and trailing-slash variants used to answer 200
// with the same HTML; they now 301 to the canonical www URL so Google sees a single address.
const ALIAS_HOSTS = new Set(['mileagelogmaker.vercel.app']);
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const query = req.originalUrl.slice(req.path.length);
  // Strip trailing slashes; collapse leading ones so "//host/" can never become an off-site redirect.
  const cleanPath = req.path.length > 1 ? (req.path.replace(/\/+$/, '') || '/').replace(/^\/{2,}/, '/') : req.path;
  const host = String(req.headers.host || '').toLowerCase();
  if (ALIAS_HOSTS.has(host)) return res.redirect(301, SITE + cleanPath + query);
  if (cleanPath !== req.path) return res.redirect(301, cleanPath + query);
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));
app.use(express.json({ limit: '2mb' }));

app.locals.SITE = SITE;
app.locals.GUMROAD_URL = GUMROAD_URL;
app.locals.R = R;
app.locals.CLIENT_RATES = JSON.stringify(R.clientRates());

// ===== Input cleaning =====
function str(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').slice(0, max); }
function cleanTrips(trips) {
  if (!Array.isArray(trips)) return [];
  return trips.slice(0, 5000).map(t => ({
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(t && t.date)) ? t.date : '',
    start: str(t && t.start, 120),
    end: str(t && t.end, 120),
    purpose: str(t && t.purpose, 200),
    miles: Math.max(0, Math.min(100000, parseFloat(t && t.miles) || 0)),
    type: ['business', 'medical', 'charity', 'personal'].includes(t && t.type) ? t.type : 'business'
  }));
}
function cleanRequest(body) {
  const b = body || {};
  const region = ['us', 'ca', 'uk'].includes(b.region) ? b.region : 'us';
  const trips = cleanTrips(b.trips).map(t => (region !== 'us' && (t.type === 'medical' || t.type === 'charity') ? { ...t, type: 'business' } : t));
  const u = b.userInfo || {};
  const userInfo = { name: str(u.name, 80), vehicle: str(u.vehicle, 80), startOdometer: str(u.startOdometer, 12), endOdometer: str(u.endOdometer, 12) };
  const year = region === 'ca' ? (R.CRA_YEARS.includes(String(b.year)) ? String(b.year) : '2026') : (R.IRS_YEARS.includes(String(b.year)) ? String(b.year) : '2026');
  const zone = b.zone === 'territories' ? 'territories' : 'provinces';
  const vehicle = ['car', 'motorcycle', 'bicycle'].includes(b.vehicle) ? b.vehicle : 'car';
  const summary = MLMCalc.summarize({ region, trips, year, zone, vehicle, startOdo: userInfo.startOdometer, endOdo: userInfo.endOdometer }, R.clientRates());
  return { region, trips, userInfo, year, zone, vehicle, summary, license: b.license, logo: b.logo };
}

// ===== Pro (Gumroad license key, verified server-side on every Pro action) =====
app.post('/verify-pro', async (req, res) => {
  const result = await verifyLicense(req.body && req.body.license_key);
  res.json({ pro: result.valid, reason: result.valid ? undefined : result.reason });
});

// Gumroad ping endpoint kept so an existing ping URL does not error. It never grants access:
// Pro is checked against Gumroad's license API instead of trusting unsigned request bodies.
app.post('/gumroad-webhook', (req, res) => res.send('OK'));

// ===== PDF log =====
app.post('/generate-pdf', async (req, res) => {
  try {
    const r = cleanRequest(req.body);
    if (!r.trips.length) return res.status(400).json({ error: 'No trips provided' });
    const pro = r.license ? (await verifyLicense(r.license)).valid : false;
    const pdf = await buildLogPdf({ region: r.region, trips: r.trips, userInfo: r.userInfo, pro, logo: r.logo }, r.summary);
    const name = r.region === 'ca' ? `vehicle-logbook-${r.year}.pdf` : r.region === 'uk' ? 'hmrc-mileage-log.pdf' : `mileage-log-${r.year}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    res.setHeader('X-MLM-Pro', pro ? '1' : '0');
    res.send(pdf);
  } catch (err) {
    console.error('PDF error:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// ===== Pro export: CSV / Excel =====
app.post('/export', async (req, res) => {
  try {
    const r = cleanRequest(req.body);
    if (!r.trips.length) return res.status(400).json({ error: 'No trips provided' });
    const check = r.license ? await verifyLicense(r.license) : { valid: false };
    if (!check.valid) return res.status(402).json({ error: 'Pro license required', reason: check.reason || 'missing' });
    const base = r.region === 'ca' ? `vehicle-logbook-${r.year}` : r.region === 'uk' ? 'hmrc-mileage-log' : `mileage-log-${r.year}`;
    if (req.body.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${base}.csv"`);
      return res.send(buildCsv(r.region, r.trips, r.summary));
    }
    const buf = await buildXlsx(r.region, r.trips, r.summary, r.userInfo);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${base}.xlsx"`);
    res.send(Buffer.from(buf));
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Export failed' });
  }
});

// ===== Pages =====
const KEY_PAGES = ['irs-mileage-log-requirements', 'free-mileage-log-template', 'mileage-log-self-employed', 'mileage-log-real-estate-agents', 'mileage-log-uber-drivers', 'mileage-log-doordash-drivers', 'cra-mileage-log-template', 'mileage-log-2026-irs-rate'];

function relatedFor(slug, page) {
  const wanted = (page.related || []).concat(KEY_PAGES);
  const seen = new Set([slug]);
  const out = [];
  for (const s of wanted) {
    if (seen.has(s) || !NICHE_PAGES[s]) continue;
    seen.add(s);
    out.push({ slug: s, h1: NICHE_PAGES[s].h1, blurb: NICHE_PAGES[s].blurb || '' });
    if (out.length === 6) break;
  }
  return out;
}

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Free IRS Mileage Log Generator 2026: PDF, No Signup',
    description: 'Free mileage log generator for IRS taxes. Log business, medical and charity trips and download a PDF with the 2026 rates (72.5¢, then 76¢ from July 1) applied by date.',
    canonical: SITE + '/'
  });
});

app.get('/blog', (req, res) => {
  res.render('blog-index', {
    canonical: SITE + '/blog',
    posts: Object.entries(BLOG_POSTS).map(([slug, p]) => ({ slug, ...p }))
  });
});

// Pages retired in October 2026 because Search Console reported them "Crawled - currently not indexed",
// "Discovered - currently not indexed" or unknown: each was a short duplicate of a stronger page.
// Each one now 301s to the page that answers the same search better.
const RETIRED = {
  'mileage-log-generator': '/',
  'mileage-log-2026': '/free-mileage-log-template',
  'irs-mileage-rate-2026-explained': '/mileage-log-2026-irs-rate',
  'forgot-to-track-mileage-what-now': '/forgot-to-track-mileage',
  'mileage-log-lyft-drivers': '/mileage-log-uber-drivers',
  'mileage-log-amazon-flex': '/mileage-log-doordash-drivers',
  'mileage-log-instacart-shoppers': '/mileage-log-doordash-drivers',
  'mileage-log-nurses': '/mileage-log-self-employed',
  'mileage-log-construction-contractors': '/mileage-log-self-employed',
  'mileage-log-therapists': '/mileage-log-self-employed'
};

app.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;
  if (RETIRED[slug]) return res.redirect(301, RETIRED[slug]);
  const page = NICHE_PAGES[slug];
  if (page) {
    return res.render('niche', {
      page, slug, canonical: `${SITE}/${slug}`,
      region: page.region || 'us',
      related: relatedFor(slug, page)
    });
  }
  if (BLOG_POSTS[slug]) {
    return res.render('blog-post', {
      post: BLOG_POSTS[slug], slug, canonical: `${SITE}/${slug}`,
      allPosts: Object.keys(BLOG_POSTS).filter(s => s !== slug).slice(0, 4).map(s => ({ slug: s, title: BLOG_POSTS[s].title }))
    });
  }
  next();
});

// ===== Sitemap / robots =====
app.get('/sitemap.xml', (req, res) => {
  const entries = [['/', SITE_UPDATED], ['/blog', SITE_UPDATED]]
    .concat(Object.keys(NICHE_PAGES).map(s => ['/' + s, NICHE_PAGES[s].updated || SITE_UPDATED]))
    .concat(Object.keys(BLOG_POSTS).map(s => ['/' + s, BLOG_POSTS[s].updated || SITE_UPDATED]));
  const urls = entries.map(([p, d]) => `  <url><loc>${SITE}${p}</loc><lastmod>${d}</lastmod></url>`).join('\n');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /generate-pdf\nDisallow: /export\nDisallow: /verify-pro\n\nSitemap: ${SITE}/sitemap.xml\n`);
});

app.use((req, res) => {
  res.status(404).render('404');
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`MileageLogMaker running on ${PORT}`));
}

module.exports = app;
