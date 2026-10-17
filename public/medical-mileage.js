// Medical mileage calculator: miles driven for medical care at the IRS standard medical rate for the date
// (2026 has two rates: Notice 2026-10 to June 30, Announcement 2026-11 from July 1), plus parking and tolls,
// compared with actual gas and oil as IRS Publication 502 does, and the part of all medical expenses above
// 7.5% of AGI that Schedule A allows. Rates come from lib/rates.js clientRates(). Shared by the browser
// (window.MLMMedical), the server (first paint) and Node tests. No DOM access here.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MLMMedical = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var AGI_FLOOR = 0.075; // Publication 502: only medical expenses above 7.5% of AGI are deductible on Schedule A.
  var MAX_MILES = 100000, MAX_MONEY = 1e8;

  function round2(x) { return Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * 100) / 100; }
  function money(n) {
    var parts = Math.abs(n).toFixed(2).split('.');
    return (n < 0 ? '-$' : '$') + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
  }
  function cents(rate) { return String(Math.round(rate * 1000) / 10) + '¢'; }
  function milesText(m) { return (Math.round(m * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function md(s) { return MONTHS[+s.slice(5, 7) - 1] + ' ' + (+s.slice(8, 10)); }
  function addDays(s, n) { return new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) + n * 864e5).toISOString().slice(0, 10); }

  // A number typed into the form, or null when the box is empty or not a usable number.
  function amount(v, max) {
    if (v === '' || v == null) return null;
    var n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[$,\s]/g, ''));
    return isFinite(n) && n >= 0 && n <= max ? n : null;
  }

  function years(rates) { return Object.keys(rates.irs).sort().reverse(); }

  // The medical rate periods of one year, e.g. 2026: Jan 1 to Jun 30 and Jul 1 to Dec 31.
  function periods(rates, year) {
    var ps = rates.irs[year] || [];
    return ps.map(function (p, i) {
      var to = i + 1 < ps.length ? addDays(ps[i + 1].from, -1) : year + '-12-31';
      return { from: p.from, to: to, rate: p.medical, label: ps.length === 1 ? year : md(p.from) + ' to ' + md(to) + ', ' + year };
    });
  }

  // opts = { year, miles: [one entry per period], parking, actual, agi, other }
  function compute(opts, rates) {
    var year = rates.irs[opts.year] ? String(opts.year) : years(rates)[0];
    var ps = periods(rates, year);
    var miles = Array.isArray(opts.miles) ? opts.miles : [opts.miles];
    var lines = ps.map(function (p, i) {
      var mi = amount(miles[i], MAX_MILES) || 0;
      return { label: p.label, rate: p.rate, miles: mi, amount: round2(mi * p.rate) };
    });
    var mileage = round2(lines.reduce(function (s, l) { return s + l.amount; }, 0));
    var totalMiles = Math.round(lines.reduce(function (s, l) { return s + l.miles; }, 0) * 100) / 100;
    var parking = amount(opts.parking, MAX_MONEY) || 0;
    var actual = amount(opts.actual, MAX_MONEY);
    var standard = round2(mileage + parking);
    var actualTotal = actual === null ? null : round2(actual + parking);
    var useActual = actualTotal !== null && actualTotal > standard;
    var car = useActual ? actualTotal : standard;
    var res = { year: year, lines: lines, miles: totalMiles, mileage: mileage, parking: parking, standard: standard, actual: actualTotal, method: useActual ? 'actual' : 'standard', car: car, agi: null };
    var agi = amount(opts.agi, MAX_MONEY);
    if (agi !== null && agi > 0) {
      var other = amount(opts.other, MAX_MONEY) || 0;
      var total = round2(car + other);
      var floor = round2(agi * AGI_FLOOR);
      res.agi = agi; res.other = other; res.total = total; res.floor = floor;
      res.deductible = Math.max(0, round2(total - floor));
    }
    return res;
  }

  // The result panel as HTML: used by the server for the first paint and by the page script.
  function resultHTML(res) {
    var out = '<p class="rb-eyebrow">Medical car expenses for ' + esc(res.year) + '</p><p class="rb-big">' + esc(money(res.car)) + '</p>' +
      '<p class="rb-sub">' + esc(res.method === 'actual' ? 'Actual gas and oil, plus parking and tolls: higher than the standard rate this time' : milesText(res.miles) + ' medical miles at the standard rate, plus parking and tolls') + '</p><div class="rb-lines">';
    res.lines.forEach(function (l) {
      out += '<div class="rb-line"><div><strong>' + esc(l.label) + '</strong><span>' + esc(milesText(l.miles) + ' mi × ' + cents(l.rate)) + '</span></div><b>' + esc(money(l.amount)) + '</b></div>';
    });
    out += '<div class="rb-line"><div><strong>Parking and tolls</strong><span>Added under either method</span></div><b>' + esc(money(res.parking)) + '</b></div>' +
      '<div class="rb-line rb-total"><div><strong>Standard rate total</strong></div><b>' + esc(money(res.standard)) + '</b></div>';
    if (res.actual !== null) {
      out += '<div class="rb-line"><div><strong>Actual gas and oil, plus parking and tolls</strong><span>' + (res.method === 'actual' ? 'Higher, so this is the figure to use' : 'Lower, so the standard rate wins') + '</span></div><b>' + esc(money(res.actual)) + '</b></div>';
    }
    out += '</div>';
    if (res.agi !== null) {
      out += '<div class="md-floor"><div class="rb-line"><div><strong>All medical expenses</strong><span>This car total plus ' + esc(money(res.other)) + ' of other medical costs</span></div><b>' + esc(money(res.total)) + '</b></div>' +
        '<div class="rb-line"><div><strong>Less 7.5% of AGI</strong><span>7.5% of ' + esc(money(res.agi)) + '</span></div><b>-' + esc(money(res.floor)) + '</b></div>' +
        '<div class="rb-line rb-total"><div><strong>Deductible on Schedule A</strong><span>' + (res.deductible > 0 ? 'If you itemize' : 'Nothing: the total is under the 7.5% floor') + '</span></div><b>' + esc(money(res.deductible)) + '</b></div></div>';
    }
    return out;
  }

  return { AGI_FLOOR: AGI_FLOOR, years: years, periods: periods, compute: compute, resultHTML: resultHTML, money: money, cents: cents, round2: round2 };
});
