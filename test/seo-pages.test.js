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
  for (const needle of ['# MileageLogMaker', '72.5 cents', '76 cents', '/free-mileage-log-template', '/irs-mileage-rate-history', '/forgot-to-track-mileage']) {
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
  for (const slug of ['free-mileage-log-template', 'irs-mileage-rate-history', 'forgot-to-track-mileage', 'mileage-log-canada', 'mileage-log-grubhub-drivers', 'how-to-deduct-mileage-on-taxes', 'mileage-deduction-vs-actual-expenses', 'tax-deductions-for-uber-lyft-drivers', 'medical-mileage-deduction']) {
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

test('no page this work touched mentions the word AI', async () => {
  for (const slug of ['free-mileage-log-template', 'irs-mileage-rate-history', 'forgot-to-track-mileage', 'mileage-log-grubhub-drivers', 'blog', 'how-to-deduct-mileage-on-taxes']) {
    const r = await get('/' + slug);
    assert.ok(!/\bAI\b/.test(text(r.body)), slug);
  }
});
