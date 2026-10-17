// Mileage reimbursement form page: claim details, trip rows, the live form sheet, print, CSV and the
// hand-over to the log maker. Everything runs in the browser and is kept in this browser's localStorage only.
(function () {
  'use strict';
  var C = window.MLMReimburse, S = window.MLMReimburseSheet, RATES = window.MLM_RATES;
  var form = document.getElementById('rfForm');
  if (!C || !S || !RATES || !form) return;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'mlm_reimburse_form_v1';
  var CALC_KEY = 'mlm_reimburse_v1';
  var rowsEl = $('tripRows');
  var FOOTER = $('rfSheet').getAttribute('data-footer') || '';
  var NOTE = $('rfSheet').getAttribute('data-rate-note') || '';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function read(k) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v && Array.isArray(v.trips) ? v : null; } catch (e) { return null; } }
  function save(state) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function today() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }

  function rowHTML(t, i) {
    var opts = C.TYPES.map(function (k) { return '<option value="' + k + '"' + (k === t.type ? ' selected' : '') + '>' + esc(C.LABELS[k]) + '</option>'; }).join('');
    return '<div class="trip-row" data-i="' + i + '">' +
      '<div><span class="lbl">Date</span><input type="date" name="date" aria-label="Date" value="' + esc(t.date) + '"></div>' +
      '<div><span class="lbl">Miles</span><input type="number" name="miles" aria-label="Miles" min="0" step="0.1" inputmode="decimal" value="' + esc(t.miles == null || isNaN(t.miles) ? '' : t.miles) + '"></div>' +
      '<div><span class="lbl">Type</span><select name="type" aria-label="Type">' + opts + '</select></div>' +
      '<div class="f-dest"><span class="lbl">Destination</span><input type="text" name="dest" aria-label="Destination" maxlength="120" value="' + esc(t.dest) + '"></div>' +
      '<div class="f-purpose"><span class="lbl">Business purpose</span><input type="text" name="purpose" aria-label="Business purpose" maxlength="200" value="' + esc(t.purpose) + '"></div>' +
      '<button type="button" class="del" aria-label="Remove trip">&times;<span> Remove</span></button></div>';
  }
  function readRows() {
    return Array.prototype.map.call(rowsEl.querySelectorAll('.trip-row'), function (row) {
      var v = function (n) { var el = row.querySelector('[name="' + n + '"]'); return el ? el.value : ''; };
      return { date: v('date'), miles: v('miles') === '' ? NaN : parseFloat(v('miles')), type: v('type'), dest: v('dest'), purpose: v('purpose') };
    });
  }
  function drawRows(trips) { rowsEl.innerHTML = trips.map(rowHTML).join(''); }
  function readInfo() {
    var info = {};
    S.FIELDS.forEach(function (k) { var el = $('rf_' + k); info[k] = el ? el.value : ''; });
    return info;
  }
  function mode() { var el = form.querySelector('input[name="rateMode"]:checked'); return el ? el.value : 'irs'; }
  function employerCents() { var n = parseFloat($('empCents').value); return mode() === 'employer' && isFinite(n) && n > 0 ? n : null; }

  var last = null;
  function update() {
    var trips = readRows();
    $('empWrap').hidden = mode() !== 'employer';
    var res = C.compute({ trips: trips, rates: RATES, employerCents: employerCents() });
    last = res;
    $('rfSheet').innerHTML = S.sheetHTML(res, readInfo(), C, { footer: FOOTER, rateNote: res.employerRate === null ? NOTE : '' });
    var probs = $('rfProblems');
    probs.innerHTML = res.problems.slice(0, 6).map(function (p) { return '<li>' + esc(p.message) + '</li>'; }).join('');
    probs.hidden = !res.problems.length;
    Array.prototype.forEach.call(rowsEl.querySelectorAll('.trip-row'), function (row, i) {
      ['date', 'miles'].forEach(function (n) {
        var el = row.querySelector('[name="' + n + '"]');
        var bad = res.problems.some(function (p) { return p.index === i && p.field === n; });
        if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
      });
    });
    var log = $('rfLog');
    if (C.logTrips(res).length) { log.href = '/' + C.prefillHash(res); log.removeAttribute('aria-disabled'); }
    else { log.href = '#form'; log.setAttribute('aria-disabled', 'true'); }
    $('addTrip').disabled = trips.length >= C.MAX_TRIPS;
    save({ trips: trips, mode: mode(), employerCents: $('empCents').value, info: readInfo() });
  }

  function addTrip() {
    var trips = readRows();
    if (trips.length >= C.MAX_TRIPS) return;
    var prev = trips[trips.length - 1];
    trips.push({ date: prev && C.isDate(prev.date) ? prev.date : today(), miles: NaN, type: prev ? prev.type : 'business', dest: '', purpose: '' });
    drawRows(trips);
    update();
    var rows = rowsEl.querySelectorAll('.trip-row');
    var miles = rows[rows.length - 1].querySelector('[name="miles"]');
    if (miles) miles.focus();
  }

  rowsEl.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.del') : null;
    if (!btn) return;
    var trips = readRows();
    trips.splice(Array.prototype.indexOf.call(rowsEl.children, btn.closest('.trip-row')), 1);
    if (!trips.length) trips.push({ date: today(), miles: NaN, type: 'business', dest: '', purpose: '' });
    drawRows(trips);
    update();
  });
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  $('addTrip').addEventListener('click', addTrip);
  $('clearTrips').addEventListener('click', function () {
    drawRows([{ date: today(), miles: NaN, type: 'business', dest: '', purpose: '' }]);
    update();
    var m = rowsEl.querySelector('[name="miles"]'); if (m) m.focus();
  });
  $('rfPrint').addEventListener('click', function () {
    update();
    if (window.gtag) try { window.gtag('event', 'reimburse_form_print'); } catch (err) {}
    window.print();
  });
  $('rfCsv').addEventListener('click', function () {
    if (!last) return;
    var blob = new Blob([C.csv(last)], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'mileage-reimbursement-form-' + today() + '.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  });
  $('rfLog').addEventListener('click', function (e) { if (this.getAttribute('aria-disabled') === 'true') e.preventDefault(); });

  // Bring back this browser's last form. Coming from the calculator's link (?from=calculator), or on a first
  // visit, the trips come from the reimbursement calculator; the claim details always come from this form.
  var own = read(KEY), calc = read(CALC_KEY);
  var fromCalc = /(^|[?&])from=calculator(&|$)/.test(location.search.slice(1)) && calc && calc.trips.length;
  var saved = fromCalc ? calc : (own || calc);
  if (saved && saved.trips.length) {
    drawRows(saved.trips.slice(0, C.MAX_TRIPS));
    if (saved.mode === 'employer') { var r = form.querySelector('input[name="rateMode"][value="employer"]'); if (r) r.checked = true; }
    if (saved.employerCents) $('empCents').value = String(saved.employerCents).slice(0, 8);
  }
  if (own && own.info) S.FIELDS.forEach(function (k) { var el = $('rf_' + k); if (el && typeof own.info[k] === 'string') el.value = own.info[k].slice(0, 120); });
  update();
})();
