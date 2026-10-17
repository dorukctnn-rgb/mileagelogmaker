// Mileage reimbursement form: turns a reimbursement result (public/reimburse.js compute()) and the claim
// details into the printable form sheet. Shared by the server (first paint) and the browser (live updates),
// and loaded by Node tests. No DOM access here.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MLMReimburseSheet = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var FIELDS = ['name', 'staffId', 'org', 'approver', 'vehicle', 'periodFrom', 'periodTo'];
  var MAX = { name: 80, staffId: 60, org: 100, approver: 80, vehicle: 80, periodFrom: 10, periodTo: 10 };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function isDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    var t = Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
    return new Date(t).toISOString().slice(0, 10) === s;
  }
  function longDate(s) { return isDate(s) ? MONTHS[+s.slice(5, 7) - 1] + ' ' + (+s.slice(8, 10)) + ', ' + s.slice(0, 4) : ''; }
  function shortDate(s) { return isDate(s) ? s.slice(5, 7) + '/' + s.slice(8, 10) + '/' + s.slice(0, 4) : ''; }

  // Claim details typed into the form, trimmed and length-limited.
  function cleanInfo(info) {
    var out = {};
    info = info || {};
    FIELDS.forEach(function (k) {
      var v = typeof info[k] === 'string' ? info[k].replace(/[\u0000-\u001f\u007f]/g, ' ').trim() : '';
      out[k] = v.slice(0, MAX[k]);
    });
    if (!isDate(out.periodFrom)) out.periodFrom = '';
    if (!isDate(out.periodTo)) out.periodTo = '';
    return out;
  }

  // The trips that made it into the total, in date order.
  function countedTrips(res) {
    var rows = [];
    res.trips.forEach(function (t, i) {
      var r = res.perTrip[i];
      if (r && r.ok) rows.push({ trip: t, row: r });
    });
    rows.sort(function (a, b) { return a.trip.date < b.trip.date ? -1 : a.trip.date > b.trip.date ? 1 : 0; });
    return rows;
  }

  // The claim period: what the person typed, or else the first and last trip dates.
  function period(res, info) {
    var rows = countedTrips(res);
    var from = info.periodFrom || (rows.length ? rows[0].trip.date : '');
    var to = info.periodTo || (rows.length ? rows[rows.length - 1].trip.date : '');
    return { from: from, to: to };
  }

  function rateBasis(res, C) {
    if (res.employerRate !== null) {
      return 'Employer rate of ' + C.cents(res.employerRate) + ' a business mile. Medical, military moving and charity trips at the IRS rate for their date.';
    }
    return 'IRS standard mileage rate for the date of each trip.';
  }

  // C is the reimbursement engine (public/reimburse.js): money, cents, milesText and the type labels.
  function sheetHTML(res, rawInfo, C, opts) {
    var info = cleanInfo(rawInfo);
    opts = opts || {};
    var rows = countedTrips(res);
    var p = period(res, info);
    var blank = '<span class="rf-blank" aria-hidden="true"></span>';
    var val = function (v) { return v ? esc(v) : blank; };
    var periodText = p.from || p.to ? esc(longDate(p.from) || '...') + ' to ' + esc(longDate(p.to) || '...') : blank;

    // The type column only appears when the claim mixes business with medical, moving or charity trips.
    var showType = rows.some(function (x) { return x.trip.type !== 'business'; });
    var cols = showType ? 7 : 6;
    var body = rows.length ? rows.map(function (x) {
      var t = x.trip, r = x.row;
      return '<tr><td class="rf-date">' + esc(shortDate(t.date)) + '</td><td>' + (esc(t.dest) || '&nbsp;') + '</td><td>' + (esc(t.purpose) || '&nbsp;') + '</td>' + (showType ? '<td class="rf-type">' + esc(C.LABELS[t.type]) + '</td>' : '') +
        '<td class="num">' + esc(C.milesText(t.miles)) + '</td><td class="num">' + esc(C.cents(r.rate)) + '</td><td class="num">' + esc(C.money(r.amount)) + '</td></tr>';
    }).join('') : '<tr><td colspan="' + cols + '" class="rf-none">No trips yet. Add a date and the miles for each trip.</td></tr>';

    var groups = res.groups.map(function (g) {
      var head = g.typeLabel + (g.period ? ', ' + g.period.label : ', employer rate');
      return '<tr><td>' + esc(head) + '</td><td class="num">' + esc(C.milesText(g.miles)) + ' mi</td><td class="num">' + esc(C.cents(g.rate)) + '</td><td class="num">' + esc(C.money(g.amount)) + '</td></tr>';
    }).join('');

    var orgText = info.org ? esc(info.org) : 'the organization named above';
    var out = '<div class="rf-head"><div><p class="rf-title">Mileage reimbursement form</p><p class="rf-period">Claim period: ' + periodText + '</p></div>' +
      '<div class="rf-claim"><span>Total claimed</span><strong>' + esc(C.money(res.total)) + '</strong></div></div>' +
      '<dl class="rf-meta">' +
      '<div><dt>Employee or claimant</dt><dd>' + val(info.name) + '</dd></div>' +
      '<div><dt>Employee ID or department</dt><dd>' + val(info.staffId) + '</dd></div>' +
      '<div><dt>Employer or organization</dt><dd>' + val(info.org) + '</dd></div>' +
      '<div><dt>Vehicle</dt><dd>' + val(info.vehicle) + '</dd></div>' +
      '</dl>' +
      '<div class="rf-wrap"><table class="rf-trips"><thead><tr><th>Date</th><th>Destination</th><th>Business purpose</th>' + (showType ? '<th>Type</th>' : '') + '<th class="num">Miles</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead>' +
      '<tbody>' + body + '</tbody>' +
      '<tfoot><tr><td colspan="' + (cols - 3) + '">Total</td><td class="num">' + esc(C.milesText(res.miles)) + '</td><td></td><td class="num">' + esc(C.money(res.total)) + '</td></tr></tfoot></table></div>';
    if (groups) {
      out += '<div class="rf-wrap"><table class="rf-sum"><caption>Rate used for each period</caption><thead><tr><th>Trips</th><th class="num">Miles</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead><tbody>' + groups + '</tbody></table></div>';
    }
    out += '<p class="rf-basis"><strong>Rate basis:</strong> ' + esc(rateBasis(res, C)) + (opts.rateNote ? ' ' + esc(opts.rateNote) : '') + '</p>' +
      '<p class="rf-cert">I certify that the trips above were driven for the purposes shown on behalf of ' + orgText + ', that the miles are correct, and that no one else has paid me for them.</p>' +
      '<div class="rf-sign">' +
      '<div><span class="rf-line"></span><span class="rf-cap">Signature of ' + (info.name ? esc(info.name) : 'employee or claimant') + '</span></div>' +
      '<div><span class="rf-line short"></span><span class="rf-cap">Date</span></div>' +
      '<div><span class="rf-line"></span><span class="rf-cap">Approved by' + (info.approver ? ' ' + esc(info.approver) : '') + '</span></div>' +
      '<div><span class="rf-line short"></span><span class="rf-cap">Date</span></div>' +
      '</div>';
    if (opts.footer) out += '<p class="rf-foot">' + esc(opts.footer) + '</p>';
    return out;
  }

  return { FIELDS: FIELDS, cleanInfo: cleanInfo, countedTrips: countedTrips, period: period, sheetHTML: sheetHTML, longDate: longDate, shortDate: shortDate };
});
