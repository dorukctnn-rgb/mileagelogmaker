const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server.js');

let server, port;
const get = (p) => new Promise((resolve, reject) => {
  http.get({ port, path: p, headers: { host: 'www.mileagelogmaker.com' } }, (res) => {
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
  }).on('error', reject);
});

test.before(() => new Promise((resolve) => { server = app.listen(0, () => { port = server.address().port; resolve(); }); }));
test.after(() => server.close());

const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
const jsonld = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

test('llms.txt is served as plain text and names the tool, the rates and the guides', async () => {
  const r = await get('/llms.txt');
  assert.strictEqual(r.status, 200);
  assert.match(r.headers['content-type'], /text\/plain/);
  for (const needle of ['# MileageLogMaker', '72.5 cents', '76 cents', '/free-mileage-log-template', '/irs-mileage-rate-history', '/forgot-to-track-mileage', '/mileage-log-lyft-drivers', '/mileage-log-instacart-shoppers']) {
    assert.ok(r.body.includes(needle), needle);
  }
  assert.ok(!/\bAI\b/.test(r.body));
});

test('sitemap uses the www host and carries the 10 Nov 2026 lastmod on the reworked pages', async () => {
  const r = await get('/sitemap.xml');
  assert.ok(!/<loc>http:/.test(r.body));
  for (const slug of ['free-mileage-log-template', 'irs-mileage-rate-history', 'forgot-to-track-mileage', 'medical-mileage-deduction', 'blog', 'how-to-deduct-mileage-on-taxes']) {
    assert.ok(r.body.includes(`<loc>https://www.mileagelogmaker.com/${slug}</loc><lastmod>2026-11-10</lastmod>`), slug);
  }
});

test('reworked pages open with a direct answer, show an update date and expose FAQPage data', async () => {
  for (const slug of ['free-mileage-log-template', 'irs-mileage-rate-history', 'forgot-to-track-mileage']) {
    const r = await get('/' + slug);
    assert.strictEqual(r.status, 200, slug);
    assert.match(r.body, /<div class="answer">/, slug + ' answer block');
    assert.match(r.body, /<p class="updated-line">Updated <time datetime="2026-11-10">November 10, 2026<\/time>/, slug + ' updated line');
    const graph = jsonld(r.body).flatMap((d) => d['@graph'] || [d]);
    assert.ok(graph.some((n) => n['@type'] === 'FAQPage' && n.mainEntity.length >= 4), slug + ' FAQPage');
    assert.ok(graph.some((n) => n.dateModified === '2026-11-10'), slug + ' dateModified');
    // The answer sits above the generator, not below it.
    assert.ok(r.body.indexOf('class="answer"') < r.body.indexOf('id="generator"'), slug + ' answer above the tool');
  }
});

test('the rate history table comes before the trip tool and every IRS year is in it', async () => {
  const r = await get('/irs-mileage-rate-history');
  assert.ok(r.body.indexOf('<table class="data">') < r.body.indexOf('id="generator"'));
  for (const y of ['2026 (Jul 1 - Dec 31)', '2025', '2024', '2023', '2011 (Jan 1 - Jun 30)']) assert.ok(r.body.includes(y), y);
});

test('forgot-to-track-mileage is a real guide, not a stub', async () => {
  const r = await get('/forgot-to-track-mileage');
  const article = r.body.slice(r.body.indexOf('class="answer"'), r.body.indexOf('id="generator"'));
  assert.ok(text(article).split(/\s+/).filter(Boolean).length > 450);
  assert.ok(r.body.includes('Publication 463'));
});

test('blog posts show the answer block, FAQ and update line', async () => {
  const r = await get('/how-to-deduct-mileage-on-taxes');
  assert.match(r.body, /Short answer:/);
  assert.match(r.body, /<details class="faq-item">/);
  assert.match(r.body, /Updated <time datetime="2026-11-10">/);
  assert.ok(jsonld(r.body).flatMap((d) => d['@graph'] || [d]).some((n) => n['@type'] === 'FAQPage'));
});

test('the blog index has CollectionPage + ItemList data and links the reworked guides', async () => {
  const r = await get('/blog');
  const graph = jsonld(r.body).flatMap((d) => d['@graph'] || [d]);
  assert.ok(graph.some((n) => n['@type'] === 'CollectionPage'));
  const list = graph.find((n) => n['@type'] === 'ItemList');
  assert.ok(list && list.itemListElement.length >= 9);
  for (const href of ['/irs-mileage-rate-history', '/mileage-log-2026-irs-rate', '/free-mileage-log-template', '/forgot-to-track-mileage']) {
    assert.ok(r.body.includes(`href="${href}"`), href);
  }
});

test('titles stay under 61 characters and descriptions under 161 on the pages this work touched', async () => {
  for (const slug of ['free-mileage-log-template', 'irs-mileage-rate-history', 'forgot-to-track-mileage', 'mileage-log-canada', 'mileage-log-grubhub-drivers', 'mileage-log-lyft-drivers', 'mileage-log-instacart-shoppers', 'how-to-deduct-mileage-on-taxes', 'mileage-deduction-vs-actual-expenses', 'tax-deductions-for-uber-lyft-drivers', 'medical-mileage-deduction']) {
    const r = await get('/' + slug);
    const title = r.body.match(/<title>([^<]*)<\/title>/)[1].replace(/&amp;/g, '&');
    const desc = r.body.match(/<meta name="description" content="([^"]*)"/)[1].replace(/&amp;/g, '&');
    assert.ok(title.length <= 60, `${slug} title ${title.length}`);
    assert.ok(desc.length <= 160, `${slug} description ${desc.length}`);
  }
});

test('related cards on existing pages keep the old link text for the reworked forgot-to-track page', async () => {
  const r = await get('/mileage-log-self-employed');
  assert.ok(r.body.includes('<strong>Forgot to Track Mileage? Here is What to Do</strong>'));
});

// 17 Nov 2026: Lyft and Instacart pages. Lyft queries had been landing on the Uber page; both slugs were retired redirects before.
const DRIVER_PAGES = {
  'mileage-log-lyft-drivers': ['mileage-log-uber-drivers', 'mileage-log-grubhub-drivers', 'mileage-log-doordash-drivers', 'irs-mileage-log-requirements', 'forgot-to-track-mileage', 'free-mileage-log-template', 'tax-deductions-for-uber-lyft-drivers'],
  'mileage-log-instacart-shoppers': ['mileage-log-uber-drivers', 'mileage-log-grubhub-drivers', 'mileage-log-doordash-drivers', 'irs-mileage-log-requirements', 'forgot-to-track-mileage', 'free-mileage-log-template']
};
const articleOf = (html) => html.slice(html.indexOf('id="sample"'), html.indexOf('class="sources"'));

test('the Lyft and Instacart pages answer 200 without a redirect and are in the sitemap', async () => {
  const sm = await get('/sitemap.xml');
  for (const slug of Object.keys(DRIVER_PAGES)) {
    const r = await get('/' + slug);
    assert.strictEqual(r.status, 200, slug);
    assert.ok(sm.body.includes(`<loc>https://www.mileagelogmaker.com/${slug}</loc><lastmod>2026-11-17</lastmod>`), slug + ' sitemap');
  }
});

test('the Lyft and Instacart pages have one H1, a canonical, three or more H2s, FAQPage data and real copy', async () => {
  for (const slug of Object.keys(DRIVER_PAGES)) {
    const r = await get('/' + slug);
    assert.strictEqual((r.body.match(/<h1[\s>]/g) || []).length, 1, slug + ' h1');
    assert.ok(r.body.includes(`<link rel="canonical" href="https://www.mileagelogmaker.com/${slug}">`), slug + ' canonical');
    assert.ok((r.body.match(/<h2[\s>]/g) || []).length >= 3, slug + ' h2');
    const graph = jsonld(r.body).flatMap((d) => d['@graph'] || [d]);
    const faq = graph.find((n) => n['@type'] === 'FAQPage');
    assert.ok(faq && faq.mainEntity.length >= 4 && faq.mainEntity.length <= 5, slug + ' FAQPage');
    for (const q of faq.mainEntity) assert.ok(r.body.includes('<summary>' + q.name.replace(/&/g, '&amp;')), slug + ' FAQ question is on the page');
    assert.ok(text(articleOf(r.body)).split(/\s+/).filter(Boolean).length > 700, slug + ' words');
    assert.ok(/Example figures/.test(r.body), slug + ' labels its example figures');
    assert.ok(r.body.includes('72.5') && r.body.includes('76'), slug + ' names both 2026 rates');
  }
});

test('the Lyft and Instacart pages link the sibling pages in running text', async () => {
  for (const [slug, links] of Object.entries(DRIVER_PAGES)) {
    const article = articleOf((await get('/' + slug)).body);
    for (const l of links) assert.ok(article.includes(`href="/${l}"`), slug + ' links ' + l);
  }
});

test('the existing driver pages link the new pages in their running text', async () => {
  const both = ['mileage-log-lyft-drivers', 'mileage-log-instacart-shoppers'];
  for (const slug of ['mileage-log-grubhub-drivers', 'mileage-log-doordash-drivers', 'mileage-log-uber-drivers', 'tax-deductions-for-uber-lyft-drivers', 'free-mileage-log-template']) {
    const html = (await get('/' + slug)).body;
    const cut = html.indexOf('<section class="related">');
    const body = html.slice(0, cut > 0 ? cut : html.indexOf('<footer'));
    for (const l of both) assert.ok(body.includes(`href="/${l}"`), slug + ' links ' + l);
  }
  // Related cards: the pages that already named the new slugs now show them.
  for (const slug of ['mileage-log-doordash-drivers', 'mileage-log-grubhub-drivers']) {
    const html = (await get('/' + slug)).body;
    assert.ok(html.slice(html.indexOf('<section class="related">')).includes('href="/mileage-log-instacart-shoppers"'), slug + ' related card');
  }
});

test('the worked deduction examples on the new pages match the IRS rates in lib/rates.js', async () => {
  const R = require('../lib/rates.js');
  const [h1, h2] = R.IRS['2026'];
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const lyft = (await get('/mileage-log-lyft-drivers')).body;
  assert.ok(lyft.includes(money(4200 * h1.business + 5100 * h2.business)), 'Lyft worked example');
  assert.ok(lyft.includes(money(448 * h2.business)), 'Lyft sample log deduction');
  assert.ok(lyft.includes(money(64 * h1.business + 65 * h2.business)), 'Lyft midnight split');
  const insta = (await get('/mileage-log-instacart-shoppers')).body;
  assert.ok(insta.includes(money(3750 * h1.business + 3750 * h2.business)), 'Instacart worked example');
  assert.ok(insta.includes(money(100 * h2.business)), 'Instacart sample log deduction');
});

test('the Lyft and Instacart sample logs add up and the odometer readings only go up', async () => {
  for (const slug of Object.keys(DRIVER_PAGES)) {
    const html = (await get('/' + slug)).body;
    const start = html.indexOf('id="sample"');
    const table = html.slice(start, html.indexOf('</table>', start));
    const rows = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => [...m[1].matchAll(/<t[dh][^>]*>([^<]*)<\/t[dh]>/g)].map((c) => c[1]));
    const num = (s) => parseFloat(String(s).replace(/,/g, ''));
    const body = rows.slice(1, -1), foot = rows[rows.length - 1];
    let sum = 0, last = 0;
    for (const r of body) {
      const out = num(r[r.length - 3]), inn = num(r[r.length - 2]), miles = num(r[r.length - 1]);
      assert.strictEqual(inn - out, miles, slug + ' row ' + r.join('|'));
      assert.ok(out >= last, slug + ' odometer goes up at ' + r.join('|'));
      last = inn; sum += miles;
    }
    assert.strictEqual(num(foot[foot.length - 1]), sum, slug + ' total');
  }
});

test('no page this work touched mentions the word AI', async () => {
  for (const slug of ['free-mileage-log-template', 'irs-mileage-rate-history', 'forgot-to-track-mileage', 'mileage-log-grubhub-drivers', 'mileage-log-lyft-drivers', 'mileage-log-instacart-shoppers', 'blog', 'how-to-deduct-mileage-on-taxes']) {
    const r = await get('/' + slug);
    assert.ok(!/\bAI\b/.test(text(r.body)), slug);
  }
});
