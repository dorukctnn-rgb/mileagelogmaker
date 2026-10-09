// Mileage reimbursement calculator: prices each trip at the IRS rate in force on its date (or at an
// employer's own rate for business trips), groups the result by rate period, and builds the CSV and the
// hand-over to the log maker. Shared by the browser (window.MLMReimburse) and Node tests (require).
// Rates come from lib/rates.js clientRates(), so the page, the generator and the PDFs use one table.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MLMReimburse = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TYPES = ['business', 'medical', 'moving', 'charity'];
  var LABELS = { business: 'Business', medical: 'Medical', moving: 'Military moving', charity: 'Charity' };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MAX_TRIPS = 200;
  var DAY = 864e5;

  function isDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    var t = Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
    return new Date(t).toISOString().slice(0, 10) === s;
  }
  function addDays(s, n) {
    return new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) + n * DAY).toISOString().slice(0, 10);
  }
  function round2(x) { return Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * 100) / 100; }
  function md(s) { return MONTHS[+s.slice(5, 7) - 1] + ' ' + (+s.slice(8, 10)); }
  function money(n) {
    var parts = Math.abs(n).toFixed(2).split('.');
    return (n < 0 ? '-$' : '$') + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
  }
  function cents(rate) { return String(Math.round(rate * 1000) / 10) + '¢'; }
  function milesText(m) { return (Math.round(m * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }

  // Flatten the IRS table into dated periods with an end date and a label.
  function periods(rates) {
    var list = [];
    Object.keys(rates.irs).sort().forEach(function (year) {
      var ps = rates.irs[year];
      ps.forEach(function (p, i) {
        var to = i + 1 < ps.length ? addDays(ps[i + 1].from, -1) : year + '-12-31';
        var whole = ps.length === 1;
        list.push({
          from: p.from, to: to, year: year,
          label: whole ? year : md(p.from) + ' to ' + md(to) + ', ' + year,
          business: p.business, medical: p.medical, moving: p.moving != null ? p.moving : p.medical, charity: p.charity
        });
      });
    });
    return list;
  }
  function periodFor(list, date) {
    for (var i = 0; i < list.length; i++) if (date >= list[i].from && date <= list[i].to) return list[i];
    return null;
  }

  function cleanTrip(t) {
    t = t || {};
    var miles = typeof t.miles === 'number' ? t.miles : parseFloat(t.miles);
    return {
      date: typeof t.date === 'string' ? t.date.trim() : '',
      miles: isFinite(miles) ? Math.round(miles * 100) / 100 : NaN,
      type: TYPES.indexOf(t.type) >= 0 ? t.type : 'business',
      dest: typeof t.dest === 'string' ? t.dest.replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 120) : '',
      purpose: typeof t.purpose === 'string' ? t.purpose.replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 200) : ''
    };
  }

  // opts = { trips: [{ date, miles, type, dest, purpose }], rates, employerCents }  (employerCents: number or null)
  function compute(opts) {
    var list = periods(opts.rates);
    var first = list[0], last = list[list.length - 1];
    var employer = opts.employerCents != null && isFinite(opts.employerCents) && opts.employerCents > 0 && opts.employerCents <= 500 ? Math.round(opts.employerCents * 100) / 10000 : null;
    var trips = (opts.trips || []).slice(0, MAX_TRIPS).map(cleanTrip);
    var groups = {}, order = [], problems = [], perTrip = [];
    var irsBusiness = { miles: 0, amount: 0 }, employerBusiness = { miles: 0, amount: 0 };

    trips.forEach(function (t, i) {
      var row = { index: i, rate: 0, amount: 0, period: null, source: '', ok: false };
      perTrip.push(row);
      if (!isDate(t.date)) { problems.push({ index: i, field: 'date', message: 'Trip ' + (i + 1) + ': enter the date.' }); return; }
      if (!(t.miles > 0) || t.miles > 100000) { problems.push({ index: i, field: 'miles', message: 'Trip ' + (i + 1) + ': enter the miles.' }); return; }
      var p = periodFor(list, t.date);
      var useEmployer = employer !== null && t.type === 'business';
      if (!p && !useEmployer) {
        problems.push({ index: i, field: 'date', message: t.date > last.to
          ? 'Trip ' + (i + 1) + ': the IRS has not published rates for ' + t.date.slice(0, 4) + ' yet.'
          : 'Trip ' + (i + 1) + ': this calculator has IRS rates from ' + first.from.slice(0, 4) + ' onward.' });
        return;
      }
      var rate = useEmployer ? employer : p[t.type];
      // An employer rate is the same on every date, so those trips form one group.
      var key = useEmployer ? 'employer|business' : p.from + '|' + t.type;
      if (!groups[key]) {
        groups[key] = { key: key, period: useEmployer ? null : p, label: useEmployer ? 'All dates' : p.label, type: t.type, typeLabel: LABELS[t.type], source: useEmployer ? 'employer' : 'irs', rate: rate, miles: 0 };
        order.push(key);
      }
      groups[key].miles += t.miles;
      row.rate = rate; row.amount = round2(t.miles * rate); row.period = p; row.source = useEmployer ? 'employer' : 'irs'; row.ok = true;
      // The comparison with the IRS rate only uses business trips that have a published IRS rate.
      if (useEmployer && p) {
        irsBusiness.miles += t.miles; irsBusiness.amount += t.miles * p.business;
        employerBusiness.miles += t.miles; employerBusiness.amount += t.miles * employer;
      }
    });

    var out = order.map(function (k) { var g = groups[k]; g.miles = Math.round(g.miles * 100) / 100; g.amount = round2(g.miles * g.rate); return g; });
    out.sort(function (a, b) {
      var pa = a.period ? a.period.from : '9999', pb = b.period ? b.period.from : '9999';
      return pa < pb ? -1 : pa > pb ? 1 : TYPES.indexOf(a.type) - TYPES.indexOf(b.type);
    });
    var total = round2(out.reduce(function (s, g) { return s + g.amount; }, 0));
    var miles = Math.round(out.reduce(function (s, g) { return s + g.miles; }, 0) * 100) / 100;
    var res = { trips: trips, groups: out, total: total, miles: miles, problems: problems, perTrip: perTrip, employerRate: employer, periods: list };
    if (employer !== null) {
      res.comparison = { miles: Math.round(irsBusiness.miles * 100) / 100, irs: round2(irsBusiness.amount), employer: round2(employerBusiness.amount) };
      res.comparison.difference = round2(res.comparison.employer - res.comparison.irs);
    }
    return res;
  }

  // CSV of the trips entered, for Excel or Google Sheets. Cells that start like a formula are neutralised.
  function csvCell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function csv(res) {
    var rows = [['Date', 'Type', 'Miles', 'Rate per mile (USD)', 'Amount (USD)', 'Rate used', 'Destination', 'Business purpose']];
    res.trips.forEach(function (t, i) {
      var r = res.perTrip[i];
      rows.push([t.date, LABELS[t.type], isFinite(t.miles) ? t.miles : '', r.ok ? r.rate : '', r.ok ? r.amount.toFixed(2) : '',
        r.ok ? (r.source === 'employer' ? 'Employer rate' : 'IRS ' + r.period.label) : 'Not calculated', t.dest, t.purpose]);
    });
    rows.push([]);
    rows.push(['Summary by rate period']);
    res.groups.forEach(function (g) { rows.push([g.label, g.typeLabel, g.miles, g.rate, g.amount.toFixed(2), g.source === 'employer' ? 'Employer rate' : 'IRS rate']); });
    rows.push(['Total', '', res.miles, '', res.total.toFixed(2)]);
    rows.push([]);
    rows.push(['Period totals use total miles x rate; amounts per trip are rounded to the cent.']);
    return '﻿' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n') + '\r\n';
  }

  // Trips in the shape the log maker stores, for the #prefill= hand-over.
  function logTrips(res) {
    var out = [];
    res.trips.forEach(function (t, i) {
      if (!res.perTrip[i].ok && !(isDate(t.date) && t.miles > 0)) return;
      out.push({ date: t.date, start: '', end: t.dest, purpose: t.purpose, miles: t.miles, type: t.type });
    });
    return out;
  }
  function prefillHash(res) {
    return '#prefill=' + encodeURIComponent(JSON.stringify({ v: 1, trips: logTrips(res) }));
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  // The result panel as HTML: used by the server for the first paint and by the page script.
  function resultHTML(res) {
    var out = '<p class="rb-eyebrow">' + (res.employerRate !== null ? 'Reimbursement at the rates below' : 'Reimbursement at IRS rates') + '</p>' +
      '<p class="rb-big">' + esc(money(res.total)) + '</p>';
    var counted = res.perTrip.filter(function (r) { return r.ok; }).length;
    out += '<p class="rb-sub">' + esc(milesText(res.miles)) + ' miles over ' + counted + (counted === 1 ? ' trip' : ' trips') + '</p>';
    if (res.groups.length) {
      out += '<div class="rb-lines">' + res.groups.map(function (g) {
        var head = g.typeLabel + (g.period ? ', ' + g.period.label : '');
        var how = milesText(g.miles) + ' mi × ' + cents(g.rate) + (g.source === 'employer' ? ' (employer rate)' : '');
        return '<div class="rb-line"><div><strong>' + esc(head) + '</strong><span>' + esc(how) + '</span></div><b>' + esc(money(g.amount)) + '</b></div>';
      }).join('') + '<div class="rb-line rb-total"><div><strong>Total</strong></div><b>' + esc(money(res.total)) + '</b></div></div>';
    }
    if (res.comparison && res.comparison.miles > 0) {
      var d = res.comparison.difference;
      out += '<p class="rb-compare">At the IRS rate these ' + esc(milesText(res.comparison.miles)) + ' business miles come to ' + esc(money(res.comparison.irs)) +
        (Math.abs(d) < 0.005 ? ', the same as your employer’s rate.' : ', so your employer’s rate pays ' + esc(money(Math.abs(d))) + (d < 0 ? ' less.' : ' more.')) + '</p>';
    }
    if (res.problems.length) {
      out += '<ul class="rb-problems">' + res.problems.slice(0, 6).map(function (p) { return '<li>' + esc(p.message) + '</li>'; }).join('') + '</ul>';
    }
    return out;
  }

  return {
    TYPES: TYPES, LABELS: LABELS, MAX_TRIPS: MAX_TRIPS, resultHTML: resultHTML,
    isDate: isDate, addDays: addDays, round2: round2, money: money, cents: cents, milesText: milesText,
    periods: periods, periodFor: periodFor, compute: compute, csv: csv, logTrips: logTrips, prefillHash: prefillHash
  };
});
