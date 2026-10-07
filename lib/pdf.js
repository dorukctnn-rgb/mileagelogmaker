// Builds the downloadable mileage log PDF for US (IRS), Canada (CRA) and UK (HMRC) logs.
const PDFDocument = require('pdfkit');

const NAVY = '#0a2540';
const GREY = '#5b6b80';
const LINE = '#dfe5ee';

function money(cur, n) { return cur + (Math.round(n * 100) / 100).toFixed(2); }
function fmt(n, d) { return (Math.round(n * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function clip(s, n) { s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
// Shortens text with an ellipsis until it fits maxW points in the current font.
function fit(doc, s, maxW) {
  s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  if (doc.widthOfString(s) <= maxW) return s;
  let lo = 0, hi = s.length;
  while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (doc.widthOfString(s.slice(0, mid) + '…') <= maxW) lo = mid; else hi = mid - 1; }
  return s.slice(0, lo).trimEnd() + '…';
}

// Accepts a data URL for a PNG or JPEG under 400 KB and returns a Buffer, else null.
function logoBuffer(dataUrl) {
  const m = /^data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) return null;
  const buf = Buffer.from(m[2], 'base64');
  return buf.length > 0 && buf.length <= 400 * 1024 ? buf : null;
}

const LABELS = {
  us: { title: 'Mileage Log', unit: 'Miles', basis: 'IRS standard mileage rates', amountHead: 'Amount' },
  ca: { title: 'Vehicle Logbook', unit: 'Km', basis: 'CRA logbook format (date, destination, purpose, kilometres)', amountHead: '' },
  uk: { title: 'Business Mileage Log', unit: 'Miles', basis: 'HMRC approved mileage rates', amountHead: 'Amount' }
};

function buildLogPdf(opts, summary) {
  const { region, trips, userInfo = {}, pro, logo } = opts;
  const L = LABELS[region] || LABELS.us;
  const size = region === 'uk' ? 'A4' : 'LETTER';
  const doc = new PDFDocument({ margin: 40, size, bufferPages: true, info: { Title: L.title, Creator: 'MileageLogMaker.com' } });
  const W = doc.page.width, H = doc.page.height, left = 40, right = W - 40, width = right - left;
  const chunks = [];
  doc.on('data', c => chunks.push(c));
  const done = new Promise(resolve => doc.on('end', () => resolve(Buffer.concat(chunks))));

  // Header
  let y = 40;
  const logoBuf = pro ? logoBuffer(logo) : null;
  if (logoBuf) {
    try { doc.image(logoBuf, right - 130, y, { fit: [130, 44], align: 'right' }); } catch (e) { /* unreadable image: skip */ }
  }
  doc.font('Helvetica-Bold').fontSize(20).fillColor(NAVY).text(L.title, left, y);
  y = doc.y + 2;
  let periodText;
  if (region === 'us') periodText = `Tax year ${summary.year}  ·  ${L.basis}`;
  else if (region === 'ca') periodText = `${summary.year} fiscal period  ·  ${L.basis}`;
  else periodText = `${L.basis}  ·  tax years run 6 April to 5 April`;
  doc.font('Helvetica').fontSize(9).fillColor(GREY).text(periodText, left, y);
  y = doc.y + 10;

  const info = [];
  if (userInfo.name) info.push(['Name', clip(userInfo.name, 60)]);
  if (userInfo.vehicle) info.push(['Vehicle', clip(userInfo.vehicle, 60)]);
  if (userInfo.startOdometer) info.push([region === 'ca' ? 'Odometer at start of period' : 'Odometer at start of year', clip(userInfo.startOdometer, 20)]);
  if (userInfo.endOdometer) info.push([region === 'ca' ? 'Odometer at end of period' : 'Odometer at end of year', clip(userInfo.endOdometer, 20)]);
  const s = parseFloat(userInfo.startOdometer), e = parseFloat(userInfo.endOdometer);
  if (s > 0 && e > s) info.push([`Total ${region === 'ca' ? 'kilometres' : 'miles'} driven (odometer)`, fmt(e - s, 0)]);
  doc.fontSize(10);
  info.forEach(([k, v]) => {
    doc.font('Helvetica').fillColor(GREY).text(k + ':', left, y, { continued: true }).font('Helvetica-Bold').fillColor(NAVY).text(' ' + v);
    y = doc.y + 2;
  });
  y += 8;

  // Table
  const cols = region === 'ca'
    ? [['Date', 62], ['From', 100], ['Destination', 110], ['Business purpose', 150], ['Km', 50, 'right'], ['Type', 60]]
    : [['Date', 60], ['Start', 86], ['Destination', 96], ['Business purpose', 120], [L.unit, 46, 'right'], ['Type', 56], [L.amountHead, 68, 'right']];
  const scale = width / cols.reduce((a, c) => a + c[1], 0);
  cols.forEach(c => { c[1] = c[1] * scale; });

  const drawHead = () => {
    doc.rect(left, y, width, 20).fill(NAVY);
    let x = left;
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#ffffff');
    cols.forEach(([h, w, align]) => { doc.text(h, x + 4, y + 6, { width: w - 8, align: align || 'left', lineBreak: false }); x += w; });
    y += 20;
  };
  drawHead();

  const rowH = 17;
  const bottomLimit = H - 70;
  trips.forEach((t, i) => {
    if (y + rowH > bottomLimit) { doc.addPage(); y = 40; drawHead(); }
    if (i % 2 === 0) doc.rect(left, y, width, rowH).fill('#f5f7fb');
    const type = String(t.type || 'business');
    const cells = region === 'ca'
      ? [t.date, t.start, t.end, t.purpose, fmt(parseFloat(t.miles) || 0, 1), type]
      : [t.date, t.start, t.end, t.purpose, fmt(parseFloat(t.miles) || 0, 1), type,
         type === 'personal' ? '-' : money(summary.currency, summary.perTrip[i] ? summary.perTrip[i].amount : 0)];
    let x = left;
    doc.font('Helvetica').fontSize(8).fillColor(NAVY);
    cells.forEach((v, ci) => {
      const [, w, align] = cols[ci];
      doc.text(fit(doc, v, w - 8), x + 4, y + 5, { width: w - 8, align: align || 'left', lineBreak: false, height: 10 });
      x += w;
    });
    y += rowH;
  });
  doc.moveTo(left, y).lineTo(right, y).strokeColor(LINE).stroke();

  // Summary
  y += 16;
  if (y > bottomLimit - 120) { doc.addPage(); y = 40; }
  doc.font('Helvetica-Bold').fontSize(12).fillColor(NAVY).text('Summary', left, y);
  y = doc.y + 6;
  const line = (label, value, bold) => {
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 11.5 : 10).fillColor(NAVY);
    doc.text(label, left, y, { width: width - 160, continued: false });
    doc.text(value, right - 160, y, { width: 160, align: 'right' });
    y = Math.max(doc.y, y + 14) + 2;
  };
  const note = (txt) => { doc.font('Helvetica').fontSize(8).fillColor(GREY).text(txt, left, y, { width }); y = doc.y + 4; };

  if (region === 'us') {
    const T = summary.totals, A = summary.amounts;
    ['business', 'medical', 'charity'].forEach(type => {
      if (!T[type]) return;
      const parts = summary.periods.filter(p => p.miles[type] > 0)
        .map(p => `${fmt(p.miles[type], 1)} mi x $${p[type]}${summary.periods.length > 1 ? (p.from.slice(5) === '01-01' ? ' (before Jul 1)' : ' (from Jul 1)') : ''}`).join(' + ');
      line(`${type[0].toUpperCase() + type.slice(1)}: ${parts}`, money('$', A[type]));
    });
    if (T.personal) line(`Personal: ${fmt(T.personal, 1)} mi (not deductible)`, '-');
    line('Total standard mileage amount', money('$', summary.total), true);
    y += 4;
    note(summary.year === '2026'
      ? '2026 IRS rates: 72.5¢ business / 20.5¢ medical for Jan 1 - Jun 30 (Notice 2026-10); 76¢ / 23.5¢ from Jul 1 (Announcement 2026-11, IRB 2026-29); charity 14¢. Parking fees and tolls for business trips are deductible in addition.'
      : `IRS ${summary.year} rates applied (irs.gov/tax-professionals/standard-mileage-rates). Parking fees and tolls for business trips are deductible in addition.`);
  } else if (region === 'ca') {
    line('Business kilometres', fmt(summary.totals.business, 1) + ' km');
    line('Personal kilometres logged', fmt(summary.totals.personal, 1) + ' km');
    if (summary.odoTotal) line('Total kilometres driven (odometer)', fmt(summary.odoTotal, 0) + ' km');
    line('Business-use percentage', summary.businessUsePct.toFixed(1) + '%', true);
    y += 4;
    note(`Self-employed (T2125): deduct this business-use percentage of your actual vehicle costs (fuel, insurance, licence and registration, maintenance, interest, leasing) plus capital cost allowance. The CRA per-kilometre rates are limits for tax-free employer allowances, not a deduction rate. For reference, a ${summary.year} allowance on ${fmt(summary.totals.business, 0)} business km at ${Math.round(summary.rates[0] * 100)}¢ / ${Math.round(summary.rates[1] * 100)}¢ (${summary.zone}) would be ${money('$', summary.total)}.`);
  } else {
    summary.taxYears.forEach(ty => {
      line(`Tax year ${ty.taxYear}-${String(ty.taxYear + 1).slice(2)}: ${fmt(ty.miles, 1)} business miles`, money('£', ty.amount));
    });
    if (summary.totals.personal) line(`Personal miles logged: ${fmt(summary.totals.personal, 1)}`, '-');
    line('Total at HMRC approved rates', money('£', summary.total), true);
    y += 4;
    note(summary.vehicle === 'car'
      ? 'Cars and vans: 55p per mile for the first 10,000 business miles from the 2026-27 tax year (45p up to 5 April 2026), then 25p. Source: GOV.UK travel - mileage and fuel rates and allowances.'
      : `${summary.vehicle === 'motorcycle' ? 'Motorcycles 24p' : 'Bicycles 20p'} per business mile. Source: GOV.UK travel - mileage and fuel rates and allowances.`);
  }

  // Footer, page numbers and the free-version watermark
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.page.margins.bottom = 0; // writing the footer below the margin must not add a page
    if (!pro) {
      doc.save();
      doc.translate(W / 2, H / 2).rotate(-30);
      doc.font('Helvetica-Bold').fontSize(64).fillColor('#d13438').opacity(0.13)
        .text('FREE VERSION', -300, -32, { width: 600, align: 'center', lineBreak: false });
      doc.restore();
      doc.opacity(1);
    }
    const foot = pro
      ? `Generated with MileageLogMaker.com  ·  Page ${i - range.start + 1} of ${range.count}`
      : `Free version from MileageLogMaker.com. Pro ($9 one-time) removes the watermark.  ·  Page ${i - range.start + 1} of ${range.count}`;
    doc.font('Helvetica').fontSize(8).fillColor(pro ? GREY : '#b42318').opacity(1)
      .text(foot, left, H - 34, { width, align: 'center', lineBreak: false });
  }

  doc.end();
  return done;
}

module.exports = { buildLogPdf, logoBuffer };
