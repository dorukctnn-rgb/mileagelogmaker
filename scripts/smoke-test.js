// Smoke test: renders every page, checks SEO basics and internal links, and exercises the PDF/Pro endpoints.
// Usage: node scripts/smoke-test.js [baseUrl]   (without baseUrl it starts the app locally)
const assert = require('assert');

(async () => {
  let base = process.argv[2];
  let server;
  if (!base) {
    const app = require('../server.js');
    server = app.listen(0);
    base = `http://127.0.0.1:${server.address().port}`;
  }
  const SITE = 'https://www.mileagelogmaker.com';
  const failures = [];
  const check = (cond, msg) => { if (!cond) failures.push(msg); };

  const sm = await (await fetch(base + '/sitemap.xml')).text();
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  check(locs.length >= 18, 'sitemap has too few URLs: ' + locs.length);
  check(locs.every(u => u.startsWith(SITE)), 'sitemap URL not on www host');
  check((sm.match(/<lastmod>/g) || []).length === locs.length, 'sitemap lastmod missing');
  const robots = await (await fetch(base + '/robots.txt')).text();
  check(robots.includes(`Sitemap: ${SITE}/sitemap.xml`), 'robots sitemap line');

  const links = new Set();
  const titles = new Map();
  for (const loc of locs) {
    const path = loc.replace(SITE, '') || '/';
    const res = await fetch(base + path);
    const html = await res.text();
    check(res.status === 200, `${path} status ${res.status}`);
    const title = (/<title>([^<]*)<\/title>/.exec(html) || [])[1] || '';
    const canonical = (/<link rel="canonical" href="([^"]+)"/.exec(html) || [])[1];
    const ogUrl = (/<meta property="og:url" content="([^"]+)"/.exec(html) || [])[1];
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    const desc = (/<meta name="description" content="([^"]*)"/.exec(html) || [])[1] || '';
    check(canonical === loc || (path === '/' && canonical === SITE + '/'), `${path} canonical ${canonical}`);
    check(ogUrl === canonical, `${path} og:url ${ogUrl}`);
    check(h1s === 1, `${path} has ${h1s} h1`);
    check(title.length > 10 && title.length <= 70, `${path} title length ${title.length}: ${title}`);
    check(desc.length >= 70 && desc.length <= 175, `${path} description length ${desc.length}`);
    check(!/mileagelogmaker\.com(?!\.)/.test(html.replace(/www\.mileagelogmaker\.com/g, '').replace(/MileageLogMaker\.com/g, '')) , `${path} references apex host`);
    if (titles.has(title)) failures.push(`${path} duplicate title with ${titles.get(title)}`);
    titles.set(title, path);
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch (e) { failures.push(`${path} invalid JSON-LD: ${e.message}`); }
    }
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) links.add(m[1]);
    console.log(res.status, path, '|', title, `(${title.length})`);
  }
  for (const l of links) {
    const r = await fetch(base + l, { method: 'GET' });
    check(r.status === 200, `internal link ${l} -> ${r.status}`);
  }
  console.log(`checked ${links.size} internal links`);

  // Unknown page is a real 404
  check((await fetch(base + '/no-such-page')).status === 404, '404 status');

  // One URL per page: retired duplicates and trailing-slash variants 301 to the canonical path
  const redirects = {
    '/mileage-log-generator': '/', '/mileage-log-2026': '/free-mileage-log-template',
    '/mileage-log-lyft-drivers': '/mileage-log-uber-drivers', '/forgot-to-track-mileage-what-now': '/forgot-to-track-mileage',
    '/irs-mileage-log-requirements/': '/irs-mileage-log-requirements', '/blog/?utm_source=x': '/blog?utm_source=x',
    '//example.com/': '/example.com'
  };
  for (const [from, to] of Object.entries(redirects)) {
    const r = await fetch(base + from, { redirect: 'manual' });
    check(r.status === 301 && r.headers.get('location') === to, `${from} should 301 to ${to}, got ${r.status} ${r.headers.get('location')}`);
    check(!locs.includes(SITE + from), `${from} is retired but still in the sitemap`);
  }

  // PDF generation (free) works for all regions and is watermarked
  const trips = [{ date: '2026-06-30', start: 'A', end: 'B', purpose: 'Client', miles: 10, type: 'business' }, { date: '2026-07-01', start: 'B', end: 'A', purpose: 'Client', miles: 20, type: 'business' }];
  for (const region of ['us', 'ca', 'uk']) {
    const r = await fetch(base + '/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ region, trips, year: '2026' }) });
    const buf = Buffer.from(await r.arrayBuffer());
    check(r.status === 200 && buf.slice(0, 4).toString() === '%PDF', `${region} pdf failed`);
    check(r.headers.get('x-mlm-pro') === '0', `${region} pdf should be free`);
  }
  // Pro cannot be unlocked without a valid Gumroad license
  const fake = await (await fetch(base + '/verify-pro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ license_key: 'FAKE1234-FAKE1234-FAKE1234-FAKE1234' }) })).json();
  check(fake.pro === false, 'fake license accepted');
  const legacy = await (await fetch(base + '/verify-pro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'someone@example.com' }) })).json();
  check(legacy.pro === false, 'email unlock still works');
  await fetch(base + '/gumroad-webhook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'attacker@example.com', sale_id: 'x' }) });
  const pdfFake = await fetch(base + '/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trips, license: 'FAKE1234-FAKE1234-FAKE1234-FAKE1234', userInfo: { email: 'attacker@example.com' } }) });
  check(pdfFake.headers.get('x-mlm-pro') === '0', 'fake license removed watermark');
  const exp = await fetch(base + '/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trips, format: 'xlsx', license: 'FAKE1234-FAKE1234-FAKE1234-FAKE1234' }) });
  check(exp.status === 402, 'export without valid license should be 402, got ' + exp.status);
  console.log('verify-pro fake key ->', JSON.stringify(fake), '| export ->', exp.status);

  if (server) server.close();
  if (failures.length) { console.error('\nFAILURES:\n' + failures.join('\n')); process.exit(1); }
  console.log('\nAll checks passed');
})().catch(e => { console.error(e); process.exit(1); });
