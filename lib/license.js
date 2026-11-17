// Pro unlock: every Pro feature is checked server-side. A key is one of two kinds:
//  - a Gumroad license key, checked against the Gumroad license API (no secret is needed; the Gumroad product must have
//    "Generate a unique license key per sale" enabled, otherwise buyers receive no key to enter);
//  - a Paddle Pro key (pp-t-..., lower case, from the Pro link we e-mail or from the checkout on the page), checked with the Worker
//    peak-pay (lib/paddle.js), which asks Paddle whether the purchase is still paid and not refunded.
// Both follow one rule: an answer that says no locks the key out; when the service cannot be reached or fails (a 5xx), a Paddle key
// that was verified before keeps working and a new key is never unlocked.
const paddle = require('./paddle');

const GUMROAD_PRODUCT_ID = 'RTEqc_aX5biwAi3tWb7gxg==';
const GUMROAD_PERMALINK = 'agbyxg';
const VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';
const POSITIVE_TTL_MS = 6 * 60 * 60 * 1000;

// Cache of Gumroad's positive answers only (keyed by license key). A miss always asks Gumroad again.
const cache = new Map();

const PADDLE_KEY = new RegExp(paddle.KEY_FORMAT.source, 'i');
const known = new Set();   // Paddle keys this instance has seen answered "yes", for a moment when the Worker cannot be reached

function cleanKey(key) {
  const k = String(key || '').trim();
  if (PADDLE_KEY.test(k)) return k.toLowerCase();
  return /^[A-Za-z0-9-]{8,64}$/.test(k) ? k : '';
}

// A Paddle Pro key, asked of the Worker: 200 { ok } is a yes; 404 (unknown key), 409 (a key of another product) and 410 (refunded)
// are a no; anything else (a network error, 5xx, 429, an answer we do not expect) means "cannot tell".
async function verifyPaddle(key) {
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now()) return { valid: true, email: '' };
  let res, data;
  try {
    res = await fetch(paddle.WORKER + '/v1/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: paddle.ORIGIN },
      body: JSON.stringify({ key, product: paddle.PRODUCT }),
      signal: AbortSignal.timeout(8000)
    });
    data = await res.json().catch(() => null);
  } catch (e) {
    return known.has(key) ? { valid: true, email: '' } : { valid: false, reason: 'unavailable' };
  }
  if (res.status === 200 && data && data.ok === true) {
    if (known.size > 1000) known.clear();
    known.add(key);
    cache.set(key, { exp: Date.now() + POSITIVE_TTL_MS, email: '' });
    return { valid: true, email: '' };
  }
  if (res.status === 410) { cache.delete(key); known.delete(key); return { valid: false, reason: 'refunded' }; }
  if (res.status === 404 || res.status === 409) { cache.delete(key); known.delete(key); return { valid: false, reason: 'not_found' }; }
  return known.has(key) ? { valid: true, email: '' } : { valid: false, reason: 'unavailable' };
}

async function askGumroad(params) {
  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
    signal: AbortSignal.timeout(8000)
  });
  return res.json();
}

// Returns { valid: boolean, reason?: string, email?: string }
async function verifyLicense(rawKey) {
  const key = cleanKey(rawKey);
  if (!key) return { valid: false, reason: 'format' };
  if (PADDLE_KEY.test(key)) return verifyPaddle(key);

  const hit = cache.get(key);
  if (hit && hit.exp > Date.now()) return { valid: true, email: hit.email };

  let data;
  try {
    data = await askGumroad({ product_id: GUMROAD_PRODUCT_ID, license_key: key, increment_uses_count: 'false' });
    // Older products are addressed by permalink; retry that way if Gumroad rejects the product id.
    if (!data.success && /product/i.test(data.message || '') && !/license/i.test(data.message || '')) {
      data = await askGumroad({ product_permalink: GUMROAD_PERMALINK, license_key: key, increment_uses_count: 'false' });
    }
  } catch (e) {
    return { valid: false, reason: 'unavailable' };
  }

  const p = data && data.purchase;
  const ok = !!(data && data.success === true && p &&
    !p.refunded && !p.chargebacked && !p.disputed &&
    !p.subscription_cancelled_at && !p.subscription_failed_at);
  if (!ok) return { valid: false, reason: data && data.success && p ? 'refunded' : 'not_found' };

  cache.set(key, { exp: Date.now() + POSITIVE_TTL_MS, email: p.email || '' });
  return { valid: true, email: p.email || '' };
}

module.exports = { verifyLicense, cleanKey, GUMROAD_PERMALINK };
