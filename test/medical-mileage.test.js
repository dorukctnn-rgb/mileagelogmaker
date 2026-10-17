// Hand-computed cases for the medical mileage calculator and the reimbursement form sheet. Run: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../lib/rates.js');
const M = require('../public/medical-mileage.js');
const C = require('../public/reimburse.js');
const S = require('../public/reimburse-sheet.js');

const rates = R.clientRates();

test('Medical rates by period match irs.gov (checked 17 Oct 2026)', () => {
  // IRS standard mileage rates table: 2026 Jul 1 - Dec 31 23.5 (Announcement 2026-11), Jan 1 - Jun 30 20.5 (IR-2025-128), 2025 21, 2024 21.
  assert.deepEqual(M.periods(rates, '2026').map(p => [p.from, p.to, p.rate]), [['2026-01-01', '2026-06-30', 0.205], ['2026-07-01', '2026-12-31', 0.235]]);
  assert.deepEqual(M.periods(rates, '2025').map(p => [p.label, p.rate]), [['2025', 0.21]]);
  assert.deepEqual(M.periods(rates, '2024').map(p => [p.label, p.rate]), [['2024', 0.21]]);
  assert.equal(M.periods(rates, '2026')[1].label, 'July 1 to December 31, 2026');
});

test('Publication 502 (2025) example: 2,800 miles, $430 gas and oil, $100 tolls and parking', () => {
  // Actual: 400 + 30 + 100 = 530. Standard: 2,800 x 0.21 = 588 + 100 = 688. Use the larger, 688.
  const r = M.compute({ year: '2025', miles: [2800], parking: 100, actual: 430 }, rates);
  assert.equal(r.mileage, 588);
  assert.equal(r.standard, 688);
  assert.equal(r.actual, 530);
  assert.equal(r.method, 'standard');
  assert.equal(r.car, 688);
});

test('2026 splits at July 1: 1,400 miles each side', () => {
  // 1,400 x 0.205 = 287.00; 1,400 x 0.235 = 329.00; + 100 parking = 716.00
  const r = M.compute({ year: '2026', miles: [1400, 1400], parking: 100 }, rates);
  assert.deepEqual(r.lines.map(l => l.amount), [287, 329]);
  assert.equal(r.standard, 716);
  assert.equal(r.car, 716);
  assert.equal(r.actual, null);
});

test('Actual costs win when they are higher', () => {
  // standard 100 x 0.205 = 20.50 + 10 = 30.50; actual 45 + 10 = 55
  const r = M.compute({ year: '2026', miles: [100, 0], parking: '10', actual: '45' }, rates);
  assert.equal(r.method, 'actual');
  assert.equal(r.car, 55);
});

test('The 7.5% floor: AGI $60,000, $4,000 other medical, 2026 example driving', () => {
  // total 716 + 4,000 = 4,716; floor 60,000 x 0.075 = 4,500; deductible 216
  const r = M.compute({ year: '2026', miles: [1400, 1400], parking: 100, agi: 60000, other: 4000 }, rates);
  assert.equal(r.total, 4716);
  assert.equal(r.floor, 4500);
  assert.equal(r.deductible, 216);
  const under = M.compute({ year: '2026', miles: [100, 100], agi: 60000, other: 0 }, rates);
  assert.equal(under.deductible, 0);
  assert.equal(M.compute({ year: '2026', miles: [100, 100] }, rates).agi, null);
});

test('Bad input is ignored, not counted', () => {
  const r = M.compute({ year: '1999', miles: ['abc', -5], parking: '-3', actual: '', agi: 'x' }, rates);
  assert.equal(r.year, '2026');
  assert.equal(r.miles, 0);
  assert.equal(r.parking, 0);
  assert.equal(r.actual, null);
  assert.equal(r.agi, null);
  assert.match(M.resultHTML(r), /\$0\.00/);
});

test('Form sheet: trips in date order, totals from the engine, details escaped', () => {
  const trip = (date, miles, extra = {}) => Object.assign({ date, miles, type: 'business', dest: '', purpose: '' }, extra);
  const res = C.compute({ rates, trips: [trip('2026-07-08', 38.5, { dest: 'Supplier <b>', purpose: 'Parts & tools' }), trip('2026-06-22', 42), trip('', 5)] });
  const html = S.sheetHTML(res, { name: 'Jordan <Lee>', org: 'Acme', periodFrom: 'nope' }, C, { footer: 'f' });
  assert.ok(html.indexOf('06/22/2026') < html.indexOf('07/08/2026'), 'June trip first');
  assert.match(html, /Supplier &lt;b&gt;/);
  assert.match(html, /Parts &amp; tools/);
  assert.match(html, /Jordan &lt;Lee&gt;/);
  assert.doesNotMatch(html, /<b>/);
  // 42 x 0.725 = 30.45; 38.5 x 0.76 = 29.26; total 59.71. The dateless trip is left off the sheet.
  assert.match(html, /\$59\.71/);
  assert.equal((html.match(/<tr><td class="rf-date">\d\d\/\d\d\/2026/g) || []).length, 2);
  assert.doesNotMatch(html, /<th>Type<\/th>/, 'all-business claims have no type column');
  const mixed = S.sheetHTML(C.compute({ rates, trips: [trip('2026-02-01', 10), trip('2026-02-02', 4, { type: 'medical' })] }), {}, C);
  assert.match(mixed, /<th>Type<\/th>/);
  assert.match(mixed, /<td class="rf-type">Medical<\/td>/);
  assert.match(mixed, /colspan="4">Total/);
  // An invalid period date falls back to the first and last trip.
  assert.match(html, /June 22, 2026 to July 8, 2026/);
  assert.match(html, /on behalf of Acme/);
});

test('Form sheet with an employer rate says so', () => {
  const res = C.compute({ rates, employerCents: 65, trips: [{ date: '2026-03-01', miles: 10, type: 'business' }] });
  const html = S.sheetHTML(res, {}, C);
  assert.match(html, /Employer rate of 65¢ a business mile/);
  assert.match(html, /\$6\.50/);
  assert.match(html, /on behalf of the organization named above/);
});
