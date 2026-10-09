// Hand-computed cases for the mileage reimbursement calculator. Run: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../lib/rates.js');
const C = require('../public/reimburse.js');
const MLMCalc = require('../public/calc.js');

const rates = R.clientRates();
const trip = (date, miles, type = 'business', extra = {}) => Object.assign({ date, miles, type, dest: '', purpose: '' }, extra);

test('IRS rates by period match irs.gov (checked 8 Oct 2026)', () => {
  const p = C.periods(rates);
  const byFrom = Object.fromEntries(p.map(x => [x.from, x]));
  assert.deepEqual([byFrom['2026-07-01'].business, byFrom['2026-07-01'].medical, byFrom['2026-07-01'].moving, byFrom['2026-07-01'].charity], [0.76, 0.235, 0.235, 0.14]); // Announcement 2026-11
  assert.deepEqual([byFrom['2026-01-01'].business, byFrom['2026-01-01'].medical, byFrom['2026-01-01'].moving, byFrom['2026-01-01'].charity], [0.725, 0.205, 0.205, 0.14]); // Notice 2026-10
  assert.deepEqual([byFrom['2025-01-01'].business, byFrom['2025-01-01'].medical], [0.70, 0.21]); // IR-2024-312
  assert.deepEqual([byFrom['2024-01-01'].business, byFrom['2024-01-01'].medical], [0.67, 0.21]); // IR-2023-239
  assert.equal(byFrom['2026-01-01'].to, '2026-06-30');
  assert.equal(byFrom['2026-07-01'].to, '2026-12-31');
  assert.equal(byFrom['2026-01-01'].label, 'Jan 1 to Jun 30, 2026');
  assert.equal(byFrom['2025-01-01'].label, '2025');
});

test('Trips on each side of July 1, 2026 get their own rate', () => {
  // 42 + 18.5 = 60.5 mi x 0.725 = 43.8625 -> 43.86; 38.5 mi x 0.76 = 29.26; total 73.12
  const r = C.compute({ rates, trips: [trip('2026-06-22', 42), trip('2026-06-29', 18.5), trip('2026-07-08', 38.5)] });
  assert.equal(r.groups.length, 2);
  assert.deepEqual(r.groups.map(g => [g.period.from, g.miles, g.rate, g.amount]), [['2026-01-01', 60.5, 0.725, 43.86], ['2026-07-01', 38.5, 0.76, 29.26]]);
  assert.equal(r.total, 73.12);
  assert.equal(r.miles, 99);
  assert.deepEqual(r.problems, []);
});

test('June 30 and July 1 are the edges', () => {
  const r = C.compute({ rates, trips: [trip('2026-06-30', 100), trip('2026-07-01', 100)] });
  assert.deepEqual(r.groups.map(g => g.amount), [72.5, 76]);
  assert.equal(r.total, 148.5);
});

test('The 13,000-mile worked example: 6,000 before July 1 and 7,000 after', () => {
  const r = C.compute({ rates, trips: [trip('2026-03-15', 6000), trip('2026-09-15', 7000)] });
  assert.equal(r.total, 9670); // 4,350 + 5,320
  const e = C.compute({ rates, employerCents: 65, trips: [trip('2026-03-15', 6000), trip('2026-09-15', 7000)] });
  assert.equal(e.total, 8450); // 13,000 x 0.65
  assert.deepEqual(e.comparison, { miles: 13000, irs: 9670, employer: 8450, difference: -1220 });
});

test('Medical, military moving and charity use their own IRS rates', () => {
  // medical 10 x 0.205 = 2.05; moving 20 x 0.235 = 4.70; charity 30 x 0.14 = 4.20
  const r = C.compute({ rates, trips: [trip('2026-02-01', 10, 'medical'), trip('2026-08-01', 20, 'moving'), trip('2026-08-02', 30, 'charity')] });
  assert.deepEqual(r.groups.map(g => [g.type, g.rate, g.amount]), [['medical', 0.205, 2.05], ['moving', 0.235, 4.7], ['charity', 0.14, 4.2]]);
  assert.equal(r.total, 10.95);
});

test('An employer rate applies to business trips only, on any date', () => {
  const r = C.compute({ rates, employerCents: 58.5, trips: [trip('2026-05-01', 100), trip('2027-02-01', 10), trip('2026-05-02', 10, 'medical')] });
  // business 110 mi x 0.585 = 64.35 (the 2027 trip is fine at an employer rate); medical 10 x 0.205 = 2.05
  assert.deepEqual(r.groups.map(g => [g.type, g.source, g.miles, g.amount]), [['medical', 'irs', 10, 2.05], ['business', 'employer', 110, 64.35]]);
  assert.equal(r.total, 66.4);
  // the comparison only counts business miles with a published IRS rate: 100 x 0.725 = 72.50 vs 100 x 0.585 = 58.50
  assert.deepEqual(r.comparison, { miles: 100, irs: 72.5, employer: 58.5, difference: -14 });
});

test('Rounding: period totals come from total miles, CSV rows are rounded per trip', () => {
  // 3 trips of 0.7 mi at 0.725: per trip 0.5075 -> 0.51 each; period 2.1 x 0.725 = 1.5225 -> 1.52
  const r = C.compute({ rates, trips: [trip('2026-01-05', 0.7), trip('2026-01-06', 0.7), trip('2026-01-07', 0.7)] });
  assert.equal(r.total, 1.52);
  assert.deepEqual(r.perTrip.map(p => p.amount), [0.51, 0.51, 0.51]);
});

test('Dates without a published rate and bad rows are reported, not counted', () => {
  const r = C.compute({ rates, trips: [trip('2027-01-04', 10), trip('2023-12-31', 10), trip('2026-02-30', 10), trip('2026-02-03', 0), trip('2026-02-04', 5)] });
  assert.equal(r.total, 3.63); // only 5 mi x 0.725 = 3.625 -> 3.63
  assert.deepEqual(r.problems.map(p => [p.index, p.field]), [[0, 'date'], [1, 'date'], [2, 'date'], [3, 'miles']]);
  assert.match(r.problems[0].message, /not published rates for 2027/);
  assert.match(r.problems[1].message, /from 2024 onward/);
});

test('CSV: one row per trip, summary, and formula cells neutralised', () => {
  const r = C.compute({ rates, trips: [trip('2026-06-22', 42, 'business', { dest: '=HYPERLINK("x")', purpose: 'Install, then "training"' }), trip('2026-07-08', 38.5)] });
  const csv = C.csv(r);
  const lines = csv.replace(/^﻿/, '').trim().split('\r\n');
  assert.equal(lines[0], 'Date,Type,Miles,Rate per mile (USD),Amount (USD),Rate used,Destination,Business purpose');
  assert.equal(lines[1], '2026-06-22,Business,42,0.725,30.45,"IRS Jan 1 to Jun 30, 2026","\'=HYPERLINK(""x"")","Install, then ""training"""');
  assert.equal(lines[2], '2026-07-08,Business,38.5,0.76,29.26,"IRS Jul 1 to Dec 31, 2026",,');
  assert.ok(lines.includes('Total,,80.5,,59.71'));
});

test('Hand-over to the log maker keeps the trip fields and survives a round trip', () => {
  const r = C.compute({ rates, trips: [trip('2026-07-08', 38.5, 'business', { dest: 'Supplier, 22 Oak Ave', purpose: 'Parts' }), trip('', 4)] });
  const t = C.logTrips(r);
  assert.deepEqual(t, [{ date: '2026-07-08', start: '', end: 'Supplier, 22 Oak Ave', purpose: 'Parts', miles: 38.5, type: 'business' }]);
  const hash = C.prefillHash(r);
  assert.ok(hash.startsWith('#prefill='));
  assert.deepEqual(JSON.parse(decodeURIComponent(hash.slice(9))), { v: 1, trips: t });
});

test('The log maker summary prices military moving trips too', () => {
  const s = MLMCalc.summarize({ region: 'us', year: '2026', trips: [{ date: '2026-08-01', miles: 20, type: 'moving' }, { date: '2026-03-01', miles: 10, type: 'moving' }] }, rates);
  assert.equal(s.totals.moving, 30);
  assert.equal(Math.round(s.amounts.moving * 100) / 100, 6.75); // 20 x 0.235 + 10 x 0.205
  assert.equal(s.total, 6.75);
});
