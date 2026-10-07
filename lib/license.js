// Pro unlock: every Pro feature is checked server-side against the Gumroad license API.
// No secret is needed. The Gumroad product must have "Generate a unique license key per sale" enabled,
// otherwise buyers receive no key to enter.

const GUMROAD_PRODUCT_ID = 'RTEqc_aX5biwAi3tWb7gxg==';
const GUMROAD_PERMALINK = 'agbyxg';
const VERIFY_URL = 'https://api.gumroad.com/v2/licenses/verify';
const POSITIVE_TTL_MS = 6 * 60 * 60 * 1000;

// Cache of Gumroad's positive answers only (keyed by license key). A miss always asks Gumroad again.
const cache = new Map();

function cleanKey(key) {
  const k = String(key || '').trim();
  return /^[A-Za-z0-9-]{8,64}$/.test(k) ? k : '';
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
