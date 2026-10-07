// MileageLogMaker browser app: trip list, live summary, PDF download, Pro activation and exports.
(function () {
  var RATES = window.MLM_RATES;
  var gen = document.getElementById('generator');
  var region = gen ? gen.getAttribute('data-region') : 'us';
  var STORE = region === 'us' ? 'mileage_trips' : 'mileage_trips_' + region;
  var unit = region === 'ca' ? 'km' : 'mi';
  var cur = region === 'uk' ? '£' : '$';

  function $(id) { return document.getElementById(id); }
  function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return cur + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function n1(n) { return (Math.round(n * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }

  var trips = load(STORE, []);
  if (!Array.isArray(trips)) trips = [];
  var license = load('mlm_license', '');
  var logoData = '';
  try { localStorage.removeItem('pro_email'); } catch (e) {} // old email-based unlock, no longer accepted

  function val(id) { var el = $(id); return el ? el.value : ''; }
  function opts() {
    return {
      region: region, trips: trips, year: val('taxYear') || '2026', zone: val('zone'), vehicle: val('vehicleType'),
      startOdo: val('startOdo'), endOdo: val('endOdo')
    };
  }
  function userInfo() {
    return { name: val('userName'), vehicle: val('userVehicle'), startOdometer: val('startOdo'), endOdometer: val('endOdo') };
  }

  function render() {
    if (!gen) return;
    $('tripCount').textContent = trips.length;
    var list = $('tripList');
    if (!trips.length) {
      list.innerHTML = '<div class="empty">No trips yet. Add one, or try the sample trips.</div>';
    } else {
      list.innerHTML = trips.map(function (t, i) {
        return '<div class="trip-item"><div class="info"><strong>' + esc(t.date) + ': ' + esc(t.start || '?') + ' to ' + esc(t.end || '?') + '</strong>' +
          '<span>' + esc(t.purpose || 'No purpose entered') + ', ' + esc(t.type) + '</span></div>' +
          '<div class="miles">' + esc(t.miles) + ' ' + unit + '</div>' +
          '<button type="button" class="btn-danger" aria-label="Remove trip" onclick="MLM.removeTrip(' + i + ')">&times;</button></div>';
      }).join('');
    }
    var s = window.MLMCalc.summarize(opts(), RATES);
    var rows = [];
    if (region === 'us') {
      rows.push(['Business', n1(s.totals.business) + ' mi, ' + money(s.amounts.business)]);
      rows.push(['Medical', n1(s.totals.medical) + ' mi, ' + money(s.amounts.medical)]);
      rows.push(['Charity', n1(s.totals.charity) + ' mi, ' + money(s.amounts.charity)]);
      $('summary').innerHTML = '<h3>Standard mileage deduction</h3>' + rows.map(function (r) {
        return '<div class="summary-row"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('') + '<div class="summary-row total"><span>Total</span><span>' + money(s.total) + '</span></div>' +
        '<p class="fine">' + (s.year === '2026' ? 'Each 2026 trip uses 72.5¢ (before July 1) or 76¢ (from July 1) per business mile.' : 'IRS ' + s.year + ' rates applied.') + ' Parking and tolls are deductible on top.</p>';
    } else if (region === 'ca') {
      $('summary').innerHTML = '<h3>Logbook summary</h3>' +
        '<div class="summary-row"><span>Business km</span><span>' + n1(s.totals.business) + '</span></div>' +
        '<div class="summary-row"><span>Personal km logged</span><span>' + n1(s.totals.personal) + '</span></div>' +
        (s.odoTotal ? '<div class="summary-row"><span>Total km (odometer)</span><span>' + n1(s.odoTotal) + '</span></div>' : '') +
        '<div class="summary-row total"><span>Business use</span><span>' + s.businessUsePct.toFixed(1) + '%</span></div>' +
        '<p class="fine">Self-employed: deduct this share of your actual vehicle costs on T2125. Employer allowance at CRA ' + s.year + ' rates for these km: ' + money(s.total) + '.</p>';
    } else {
      $('summary').innerHTML = '<h3>HMRC approved mileage</h3>' +
        '<div class="summary-row"><span>Business miles</span><span>' + n1(s.totals.business) + '</span></div>' +
        s.taxYears.map(function (y) { return '<div class="summary-row"><span>Tax year ' + y.taxYear + '-' + String(y.taxYear + 1).slice(2) + '</span><span>' + money(y.amount) + '</span></div>'; }).join('') +
        '<div class="summary-row total"><span>Total</span><span>' + money(s.total) + '</span></div>' +
        '<p class="fine">Cars and vans: 55p a mile for the first 10,000 business miles from 6 April 2026 (45p before), then 25p.</p>';
    }
    var sb = $('sampleBtn'); if (sb) sb.style.display = trips.length ? 'none' : '';
    updateProUI();
  }

  function addTrip() {
    var t = { date: val('tripDate'), start: val('tripStart').trim(), end: val('tripEnd').trim(), purpose: val('tripPurpose').trim(), miles: parseFloat(val('tripMiles')) || 0, type: val('tripType') || 'business' };
    if (!t.date || !t.miles) { alert('Enter at least a date and the distance.'); return; }
    trips.push(t); store(STORE, trips); render();
    ['tripStart', 'tripEnd', 'tripPurpose', 'tripMiles'].forEach(function (id) { $(id).value = ''; });
    $('tripMiles').focus();
  }
  function removeTrip(i) { trips.splice(i, 1); store(STORE, trips); render(); }

  var SAMPLES = {
    us: [
      { date: '2026-07-06', start: 'Home office', end: 'Acme Dental, 410 Pine St', purpose: 'Client meeting: Q3 bookkeeping review', miles: 14.2, type: 'business' },
      { date: '2026-07-06', start: 'Acme Dental', end: 'Office Depot, Main St', purpose: 'Buy printer toner for business', miles: 3.8, type: 'business' },
      { date: '2026-07-08', start: 'Home office', end: 'Riverside Hospital', purpose: 'Medical appointment', miles: 9.5, type: 'medical' }
    ],
    ca: [
      { date: '2026-03-02', start: 'Home office', end: 'Client site, 88 King St W', purpose: 'Install and training for client', miles: 24.6, type: 'business' },
      { date: '2026-03-02', start: 'Client site', end: 'Home office', purpose: 'Return from client site', miles: 24.6, type: 'business' },
      { date: '2026-03-04', start: 'Home', end: 'Grocery store', purpose: 'Personal', miles: 6.1, type: 'personal' }
    ],
    uk: [
      { date: '2026-05-11', start: 'Home office', end: 'Client, 14 High St, Leeds', purpose: 'Site survey for client', miles: 18.4, type: 'business' },
      { date: '2026-05-11', start: 'Client, Leeds', end: 'Home office', purpose: 'Return from site survey', miles: 18.4, type: 'business' }
    ]
  };
  function loadSample() { trips = SAMPLES[region].map(function (t) { return Object.assign({}, t); }); store(STORE, trips); render(); }

  function busy(btn, on, label) { if (!btn) return; btn.disabled = on; if (label) btn.textContent = label; }
  function download(blob, name) {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }
  function payload(extra) {
    var o = opts();
    return Object.assign({ region: region, trips: trips, userInfo: userInfo(), year: o.year, zone: o.zone, vehicle: o.vehicle, license: license || undefined }, extra || {});
  }
  function fileName(ext) {
    var y = val('taxYear') || '2026';
    return (region === 'ca' ? 'vehicle-logbook-' + y : region === 'uk' ? 'hmrc-mileage-log' : 'mileage-log-' + y) + '.' + ext;
  }

  function generatePDF() {
    if (!trips.length) {
      alert('Add at least one trip first (or click "Try with sample trips").');
      var d = $('tripDate'); if (d) d.focus();
      return;
    }
    var btn = $('generateBtn');
    busy(btn, true, 'Building your PDF...');
    fetch('/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload({ logo: license ? logoData : undefined })) })
      .then(function (r) {
        if (!r.ok) throw new Error('pdf');
        var wasPro = r.headers.get('X-MLM-Pro') === '1';
        return r.blob().then(function (b) {
          download(b, fileName('pdf'));
          if (license && !wasPro) alert('Your Pro key could not be confirmed with Gumroad just now, so this PDF has the free watermark. Try again in a minute, or re-enter the key under Get Pro.');
          return wasPro || !!license;
        });
      })
      .then(function (wasPro) { if (!wasPro && trips.length >= 5) setTimeout(openPro, 1200); })
      .catch(function () { alert('The PDF could not be created. Please try again.'); })
      .then(function () { busy(btn, false, 'Download PDF log'); });
  }

  function exportFile(format) {
    if (!license) { openPro(); return; }
    if (!trips.length) { alert('Add at least one trip first.'); return; }
    fetch('/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload({ format: format })) })
      .then(function (r) {
        if (r.status === 402) {
          return r.json().then(function (d) {
            if (d.reason === 'unavailable') alert('Gumroad could not confirm your key just now. Please try again in a minute.');
            else { license = ''; store('mlm_license', ''); updateProUI(); openPro(); }
            throw new Error('license');
          });
        }
        if (!r.ok) throw new Error('export');
        return r.blob();
      })
      .then(function (b) { download(b, fileName(format)); })
      .catch(function (e) { if (e.message !== 'license') alert('Export failed. Please try again.'); });
  }

  function setLogo(input) {
    if (!license) { input.value = ''; openPro(); return; }
    var f = input.files && input.files[0];
    if (!f) return;
    if (!/^image\/(png|jpeg)$/.test(f.type) || f.size > 300 * 1024) { alert('Use a PNG or JPG logo under 300 KB.'); input.value = ''; return; }
    var reader = new FileReader();
    reader.onload = function () { logoData = reader.result; $('logoName').textContent = f.name + ' will appear on your PDF'; };
    reader.readAsDataURL(f);
  }

  function openPro() { var m = $('proModal'); if (m) m.classList.add('active'); }
  function closePro() { var m = $('proModal'); if (m) m.classList.remove('active'); var s = $('licenseStatus'); if (s) s.textContent = ''; }

  function verifyLicense() {
    var key = val('licenseKey').trim(), status = $('licenseStatus');
    if (!key) { status.textContent = 'Paste the license key from your Gumroad receipt.'; status.className = 'modal-status error'; return; }
    status.textContent = 'Checking with Gumroad...'; status.className = 'modal-status';
    fetch('/verify-pro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ license_key: key }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.pro) {
          license = key; store('mlm_license', key);
          status.textContent = 'Pro is active on this device.'; status.className = 'modal-status success';
          updateProUI(); setTimeout(closePro, 1200);
        } else {
          status.className = 'modal-status error';
          status.textContent = d.reason === 'refunded' ? 'This purchase was refunded, so the key is no longer active.'
            : d.reason === 'unavailable' ? 'Gumroad could not be reached. Please try again in a minute.'
            : 'That key was not found for MileageLogMaker Pro. Check for typos or copy it again from your receipt.';
        }
      })
      .catch(function () { status.textContent = 'Connection error. Please try again.'; status.className = 'modal-status error'; });
  }

  function updateProUI() {
    var btn = $('navProBtn');
    if (btn) {
      if (license) { btn.textContent = 'Pro active'; btn.classList.add('is-pro'); }
      else { btn.textContent = 'Get Pro $9'; btn.classList.remove('is-pro'); }
    }
    var note = $('freeNote'); if (note) note.style.display = license ? 'none' : '';
    var pill = $('proPill'); if (pill) pill.textContent = license ? 'Active' : '$9';
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePro(); });
  var modal = $('proModal');
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closePro(); });
  ['taxYear', 'zone', 'vehicleType', 'startOdo', 'endOdo'].forEach(function (id) { var el = $(id); if (el) el.addEventListener('change', render); });
  if (gen) {
    var d = $('tripDate'); if (d && !d.value) { try { d.valueAsDate = new Date(); } catch (e) {} }
    $('tripMiles').addEventListener('keydown', function (e) { if (e.key === 'Enter') addTrip(); });
  }

  window.MLM = { addTrip: addTrip, removeTrip: removeTrip, loadSample: loadSample, generatePDF: generatePDF, exportFile: exportFile, setLogo: setLogo, openPro: openPro, closePro: closePro, verifyLicense: verifyLicense };
  render();
  updateProUI();
})();
