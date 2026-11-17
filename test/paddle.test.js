// Tests of the Paddle checkout (run: npm test). No network for the Worker: peak-pay is a fake fetch, the app runs on a free local port.
// 1. lib/license.js takes a Paddle Pro key: checked with the Worker (POST /v1/status, our Origin, product mileagelogmaker), kept in
//    lower case, cached like a Gumroad answer; 404/409/410 are a no; a network error, a 5xx or a 429 keeps a key verified before and
//    never unlocks a new one.
// 2. /verify-pro, /generate-pdf and /export take a Paddle key like a Gumroad key.
// 3. The switch (lib/paddle.js): off, no page loads or mentions peak-pay and no policy header is sent; on (MLM_PADDLE=1, tests
//    only), the Get Pro window loads mlm-pay.js, offers the e-mail box and a buy link that opens Paddle, and the words name
//    Paddle.com as the seller of record.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const paddle = require('../lib/paddle');
const license = require('../lib/license');
const app = require('../server.js');

const ROOT = path.join(__dirname, '..');
const KEY = 'pp-t-' + 'a1b2c3d4e5f6g7h8i9j0k1l2m3' + '-' + '0123456789abcdef01234567';
const keyN = n => 'pp-t-' + String(n).padStart(26, 'k') + '-' + '0123456789abcdef01234567';
const realFetch = globalThis.fetch;
const calls = [];
let answer = () => ({ status: 200, body: { ok: true, plan: 'lifetime' } });

// The Worker (and Gumroad) answer from `answer`; every other address (the app under test) is the real fetch.
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  if (u.startsWith(paddle.WORKER) || u.startsWith('https://api.gumroad.com/')) {
    calls.push({ url: u, init });
    const a = answer(u, init);
    if (a === 'throw') throw new TypeError('fetch failed');
    return new Response(JSON.stringify(a.body || {}), { status: a.status, headers: { 'Content-Type': 'application/json' } });
  }
  return realFetch(url, init);
};
test.after(() => { globalThis.fetch = realFetch; });

let server, port;
test.before(() => new Promise(resolve => { server = app.listen(0, '127.0.0.1', () => { port = server.address().port; resolve(); }); }));
test.after(() => server.close());

const request = (method, p, body) => new Promise((resolve, reject) => {
  const data = body === undefined ? null : Buffer.from(JSON.stringify(body));
  const req = http.request({ port, path: p, method, headers: { host: 'www.mileagelogmaker.com', ...(data ? { 'Content-Type': 'application/json', 'Content-Length': data.length } : {}) } }, res => {
    const chunks = [];
    res.on('data', d => chunks.push(d));
    res.on('end', () => { const buf = Buffer.concat(chunks); resolve({ status: res.statusCode, headers: res.headers, body: buf.toString('utf8'), buf }); });
  });
  req.on('error', reject);
  if (data) req.write(data);
  req.end();
});
const get = p => request('GET', p);

// -- 1. lib/license.js -----------------------------------------------------------------------------------------------------------
test('a Paddle key is checked with peak-pay, with our Origin, as the mileagelogmaker product, and kept in lower case', async () => {
  calls.length = 0;
  answer = () => ({ status: 200, body: { ok: true, plan: 'lifetime' } });
  assert.equal(license.cleanKey(KEY.toUpperCase()), KEY);
  assert.deepEqual(await license.verifyLicense(KEY.toUpperCase()), { valid: true, email: '' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, paddle.WORKER + '/v1/status');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers.Origin, 'https://www.mileagelogmaker.com');
  assert.deepEqual(JSON.parse(calls[0].init.body), { key: KEY, product: 'mileagelogmaker' });
  assert.equal((await license.verifyLicense(KEY)).valid, true);
  assert.equal(calls.length, 1, 'answered from the cache');
});

test('a Paddle key the Worker refuses is a no: 404 unknown, 409 another product, 410 refunded; everything else is "cannot tell"', async () => {
  for (const [n, status, reason] of [[1, 404, 'not_found'], [2, 409, 'not_found'], [3, 410, 'refunded']]) {
    answer = () => ({ status, body: { error: 'x' } });
    assert.deepEqual(await license.verifyLicense(keyN(n)), { valid: false, reason }, String(status));
  }
  for (const [n, a] of [[10, { status: 503 }], [11, { status: 502 }], [12, { status: 429 }], [13, 'throw'], [14, { status: 200, body: {} }], [15, { status: 403 }]]) {
    answer = () => a;
    assert.deepEqual(await license.verifyLicense(keyN(n)), { valid: false, reason: 'unavailable' }, JSON.stringify(a));
  }
});

test('peak-pay down: a new key is never unlocked, a key verified before keeps working, an explicit no locks it out', async (t) => {
  let now = Date.now();
  t.mock.method(Date, 'now', () => now);
  const k = keyN(20);
  answer = () => ({ status: 200, body: { ok: true, plan: 'lifetime' } });
  assert.equal((await license.verifyLicense(k)).valid, true);
  now += 7 * 60 * 60 * 1000;                       // the cached yes has run out
  for (const a of [{ status: 503 }, { status: 429 }, 'throw']) {
    answer = () => a;
    assert.equal((await license.verifyLicense(k)).valid, true, 'kept through ' + JSON.stringify(a));
  }
  assert.equal((await license.verifyLicense(keyN(21))).valid, false, 'a key never seen is not unlocked by an outage');
  answer = () => ({ status: 410, body: { error: 'refunded' } });
  assert.deepEqual(await license.verifyLicense(k), { valid: false, reason: 'refunded' });
  answer = () => ({ status: 503 });
  assert.equal((await license.verifyLicense(k)).valid, false, 'a refunded key is not brought back by an outage');
});

test('Gumroad keys work as before (Gumroad API, never the Worker); a cut Paddle key never reaches the Worker', async () => {
  calls.length = 0;
  answer = u => (u.startsWith('https://api.gumroad.com/') ? { status: 200, body: { success: true, purchase: { email: 'a@b.c' } } } : { status: 500 });
  assert.deepEqual(await license.verifyLicense('ABCD1234-EF567890-12AB34CD-56EF78AB'), { valid: true, email: 'a@b.c' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.gumroad.com/v2/licenses/verify');
  calls.length = 0;
  answer = () => ({ status: 200, body: { success: false } });
  await license.verifyLicense(KEY.slice(0, -3));
  assert.ok(calls.every(c => !c.url.startsWith(paddle.WORKER)), 'a cut key is not a Paddle key');
});

// -- 2. the endpoints ------------------------------------------------------------------------------------------------------------
test('/verify-pro, /generate-pdf and /export take a Paddle key', async () => {
  answer = () => ({ status: 200, body: { ok: true, plan: 'lifetime' } });
  const k = keyN(30);
  assert.deepEqual(JSON.parse((await request('POST', '/verify-pro', { license_key: k })).body), { pro: true });
  const trips = [{ date: '2026-03-02', start: 'Office', end: 'Client', purpose: 'Meeting', miles: 12.5, type: 'business' }];
  const pdf = await request('POST', '/generate-pdf', { region: 'us', year: '2026', trips, license: k });
  assert.equal(pdf.status, 200);
  assert.equal(pdf.headers['x-mlm-pro'], '1');
  const csv = await request('POST', '/export', { region: 'us', year: '2026', trips, license: k, format: 'csv' });
  assert.equal(csv.status, 200);
  answer = () => ({ status: 410, body: { error: 'refunded' } });
  const refunded = keyN(31);
  assert.deepEqual(JSON.parse((await request('POST', '/verify-pro', { license_key: refunded })).body), { pro: false, reason: 'refunded' });
  const free = await request('POST', '/generate-pdf', { region: 'us', year: '2026', trips, license: refunded });
  assert.equal(free.headers['x-mlm-pro'], '0');
  assert.equal((await request('POST', '/export', { region: 'us', year: '2026', trips, license: refunded, format: 'csv' })).status, 402);
});

// -- 3. the switch ---------------------------------------------------------------------------------------------------------------
const PAGES = ['/', '/terms', '/privacy', '/refund', '/mileage-reimbursement-calculator', '/free-mileage-log-template', '/blog', '/irs-mileage-log-requirements', '/cra-mileage-log-template', '/mileage-log-uk', '/mileiq-alternative', '/no-such-page'];
// the legal pages and the pricing section name both resellers; the privacy page also lists Paddle in its table
const RESELLERS = /Paddle\.com and Gumroad/g;

test('switch off: no page loads or mentions peak-pay, Paddle appears only in the resellers wording, and no policy header is sent', { skip: paddle.PADDLE_CHECKOUT && 'the switch is on' }, async () => {
  delete process.env.MLM_PADDLE;
  assert.equal(paddle.enabled(), false);
  for (const p of PAGES) {
    const r = await get(p);
    assert.equal(r.headers['content-security-policy'], undefined, p + ' sends no policy header, as before');
    assert.ok(!/peak-pay|mlm-pay|peakpay|cdn\.paddle\.com|data-buy-pro|ppRestore/i.test(r.body), p + ' loads or mentions peak-pay');
    if (p !== '/privacy') assert.ok(!/paddle/i.test(r.body.replace(RESELLERS, '')), p + ' mentions paddle beyond the resellers wording');
  }
  const home = (await get('/')).body;
  assert.match(home, /Your license key arrives by email after you pay/);
  assert.match(home, /Activate on any device with your license key/);
  assert.match(home, /"url":"https:\/\/dorukctn\.gumroad\.com\/l\/agbyxg"/);
});

test('switch on (tests only): Buy Pro opens Paddle, the e-mail box is in the Get Pro window, the words name Paddle.com', async () => {
  process.env.MLM_PADDLE = '1';
  try {
    assert.equal(paddle.enabled(), true);
    for (const p of PAGES) {
      const r = await get(p);
      const body = r.body;
      assert.match(r.headers['content-security-policy'] || '', /script-src 'self' 'unsafe-inline' https:\/\/cdn\.paddle\.com/, p + ' policy');
      assert.ok(!/profitwell/.test(r.headers['content-security-policy'] || ''));
      if (body.includes('id="proModal"')) assert.equal((body.match(/<script src="\/mlm-pay\.js\?v=\d+" defer><\/script>/g) || []).length, 1, p + ' loads mlm-pay.js once');
      for (const m of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) assert.doesNotThrow(() => JSON.parse(m[1]), p + ' JSON-LD parses');
      assert.ok(!/\bAI\b/.test(body.replace(/<script[\s\S]*?<\/script>/g, '')), p + ' says AI');
    }
    const home = (await get('/')).body;
    assert.match(home, /<a href="https:\/\/dorukctn\.gumroad\.com\/l\/agbyxg" target="_blank" rel="noopener" class="btn" data-buy-pro>Buy Pro, \$9<\/a>/, 'the buy link keeps the Gumroad address as its fallback');
    assert.match(home, /Paddle\.com is the seller of record, the Merchant of Record/);
    assert.match(home, /Pro turns on in this browser right after you pay/);
    assert.ok(!/Your license key arrives by email after you pay|Activate on any device with your license key/.test(home), 'the Gumroad key words are gone from the pricing section');
    assert.match(home, /"url":"https:\/\/www\.mileagelogmaker\.com\/#pricing"/);
    assert.match(home, /id="ppRestore"/);
    assert.match(home, /E-mail my Pro link/);
    assert.match(home, /Bought Pro on Gumroad\? Enter the license key from your Gumroad receipt/);
    assert.match(home, /Paddle\.com is the seller of record\./, 'the Get Pro window');
    const terms = (await get('/terms')).body;
    assert.match(terms, /After you pay, Pro turns on in your browser/);
    assert.match(terms, /Paddle\.com and Gumroad\. They are the Merchant of Record/);
    const privacy = (await get('/privacy')).body;
    assert.match(privacy, /A purchase made with Paddle needs no key typed in/);
    assert.match(privacy, /<td>Cloudflare<\/td>/);
    for (const f of ['/mlm-pay.js', '/assets/peak-pay.js', '/assets/peak-pay.css']) assert.equal((await get(f)).status, 200, f);
  } finally {
    delete process.env.MLM_PADDLE;
  }
});

test('the switch is one constant, and MLM_PADDLE never turns it on in production', () => {
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'paddle.js'), 'utf8');
  assert.equal((src.match(/^const PADDLE_CHECKOUT = (true|false);$/gm) || []).length, 1);
  if (paddle.PADDLE_CHECKOUT) return;
  process.env.MLM_PADDLE = '1';
  process.env.VERCEL_ENV = 'production';
  try { assert.equal(paddle.enabled(), false); } finally { delete process.env.MLM_PADDLE; delete process.env.VERCEL_ENV; }
});

test('the browser files: peak-pay.js is the peak-tools copy with only the refund address changed; mlm-pay.js opens the lifetime plan and stores the key where app.js reads it', () => {
  const pp = fs.readFileSync(path.join(ROOT, 'public', 'assets', 'peak-pay.js'), 'utf8');
  assert.match(pp, /var WORKER = 'https:\/\/peak-pay\.railer-iot\.workers\.dev';/);
  assert.match(pp, /var REFUND = '\/refund';/);
  const m = fs.readFileSync(path.join(ROOT, 'public', 'mlm-pay.js'), 'utf8');
  assert.match(m, /var PRODUCT = 'mileagelogmaker';/);
  assert.match(m, /var PLAN = 'lifetime';/);
  assert.match(m, /product: PRODUCT, plan: PLAN, lang: 'en', page: location\.origin \+ '\/'/);
  assert.match(m, /fetch\('\/verify-pro'/);
  assert.match(m, /var LICENSE = 'mlm_license';/);
  assert.match(m, /history\.replaceState/);
  assert.match(m, /P\.restore\(email, PRODUCT, 'en', location\.origin \+ '\/'\)/);
  const app = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
  assert.match(app, /var license = load\('mlm_license', ''\);/, 'app.js reads the key from the place mlm-pay.js writes it');
  assert.ok(!/Gumroad/.test(app), 'app.js words fit both kinds of key');
  assert.ok(!/\bAI\b/.test(m + pp));
});
