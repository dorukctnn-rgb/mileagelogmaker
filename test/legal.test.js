// The public pages a payment provider's website review reads: terms, privacy and refund policy, the pricing section and the footer.
// Run: npm test
const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server.js');

let server, port;
const get = (p) => new Promise((resolve, reject) => {
  http.get({ port, path: p, headers: { host: 'www.mileagelogmaker.com' } }, (res) => {
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => resolve({ status: res.statusCode, body }));
  }).on('error', reject);
});
test.before(() => new Promise((resolve) => { server = app.listen(0, () => { port = server.address().port; resolve(); }); }));
test.after(() => server.close());

const plain = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

test('terms, privacy and refund policy answer 200', async () => {
  for (const p of ['/terms', '/privacy', '/refund']) assert.strictEqual((await get(p)).status, 200, p);
});

test('refund policy: business name, contact, 14 days, price, Paddle.com as Merchant of Record', async () => {
  const t = plain((await get('/refund')).body);
  for (const need of ['Refund policy', 'Peak Apps Studio', 'info@peakappsstudio.com', '14 days', '$9', 'paid once', 'Paddle.com', 'Merchant of Record', 'sales tax/VAT', 'license key stops working'])
    assert.ok(t.includes(need), 'refund page lacks: ' + need);
});

test('terms and privacy name the resellers, the business and the refund policy', async () => {
  for (const p of ['/terms', '/privacy']) {
    const r = await get(p);
    const t = plain(r.body);
    assert.ok(t.includes('Paddle'), p + ' does not name Paddle');
    assert.ok(t.includes('Peak Apps Studio'), p + ' lacks the business name');
    assert.ok(r.body.includes('href="/refund"'), p + ' does not link /refund');
  }
  assert.ok(plain((await get('/terms')).body).includes('Merchant of Record'));
});

test('home page: the pricing section shows the product, the price and the reseller; every footer links the policies and the contact address', async () => {
  for (const p of ['/', '/mileage-reimbursement-calculator', '/free-mileage-log-template', '/blog']) {
    const html = (await get(p)).body;
    for (const href of ['/privacy', '/terms', '/refund', 'mailto:info@peakappsstudio.com']) assert.ok(html.includes('href="' + href + '"'), p + ' footer lacks ' + href);
  }
  const html = (await get('/')).body;
  const t = plain(html);
  assert.ok(html.includes('id="pricing"'));
  assert.ok(/Pro/.test(t) && /\$9/.test(t) && /one-time/.test(t), 'product, price and period');
  assert.ok(t.includes('Paddle.com') && t.includes('Merchant of Record'), 'reseller wording in the pricing section');
});

test('the refund page is in the sitemap and llms.txt', async () => {
  assert.ok((await get('/sitemap.xml')).body.includes('<loc>https://www.mileagelogmaker.com/refund</loc>'));
  assert.ok((await get('/llms.txt')).body.includes('https://www.mileagelogmaker.com/refund'));
});

test('no generative-tool wording on the pages a payment review reads', async () => {
  const bad = /\bAI\b|artificial intelligence|generative|ChatGPT|OpenAI|machine learning|\bLLM\b/i;
  for (const p of ['/', '/terms', '/privacy', '/refund']) assert.ok(!bad.test(plain((await get(p)).body)), p + ' mentions an AI term');
});
