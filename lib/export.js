// Pro exports of the user's logged trips: CSV and Excel (XLSX).
const ExcelJS = require('exceljs');

function headers(region) {
  if (region === 'ca') return ['Date', 'From', 'Destination', 'Business purpose', 'Kilometres', 'Type'];
  return ['Date', 'Start', 'Destination', 'Business purpose', 'Miles', 'Type', 'Rate', 'Amount'];
}

function rows(region, trips, summary) {
  return trips.map((t, i) => {
    const base = [t.date || '', t.start || '', t.end || '', t.purpose || '', parseFloat(t.miles) || 0, t.type || 'business'];
    if (region === 'ca') return base;
    const r = summary.perTrip[i] || { rate: 0, amount: 0 };
    return base.concat([Math.round(r.rate * 10000) / 10000, r.amount]);
  });
}

function csvCell(v) {
  let s = String(v == null ? '' : v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // neutralise spreadsheet formulas
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function buildCsv(region, trips, summary) {
  const out = [headers(region)].concat(rows(region, trips, summary));
  return '﻿' + out.map(r => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

async function buildXlsx(region, trips, summary, userInfo = {}) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'MileageLogMaker.com';
  const ws = wb.addWorksheet(region === 'ca' ? 'Vehicle logbook' : 'Mileage log', { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.addRow(headers(region)).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A2540' } };
  rows(region, trips, summary).forEach(r => {
    const safe = r.map(v => (typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v));
    ws.addRow(safe);
  });
  const widths = region === 'ca' ? [12, 24, 26, 36, 12, 12] : [12, 22, 24, 34, 10, 11, 9, 12];
  widths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
  if (region !== 'ca') {
    ws.getColumn(8).numFmt = (summary.currency === '£' ? '"£"' : '"$"') + '#,##0.00';
  }
  const s = wb.addWorksheet('Summary');
  s.getColumn(1).width = 40; s.getColumn(2).width = 18;
  if (userInfo.name) s.addRow(['Name', userInfo.name]);
  if (userInfo.vehicle) s.addRow(['Vehicle', userInfo.vehicle]);
  if (userInfo.startOdometer) s.addRow(['Odometer at start', userInfo.startOdometer]);
  if (userInfo.endOdometer) s.addRow(['Odometer at end', userInfo.endOdometer]);
  if (region === 'ca') {
    s.addRow(['Business km', summary.totals.business]);
    s.addRow(['Personal km logged', summary.totals.personal]);
    if (summary.odoTotal) s.addRow(['Total km (odometer)', summary.odoTotal]);
    s.addRow(['Business-use %', summary.businessUsePct / 100]).getCell(2).numFmt = '0.0%';
  } else if (region === 'uk') {
    summary.taxYears.forEach(ty => s.addRow([`Tax year ${ty.taxYear}-${String(ty.taxYear + 1).slice(2)} business miles`, ty.miles]));
    s.addRow(['Total at HMRC approved rates (GBP)', summary.total]);
  } else {
    ['business', 'medical', 'charity', 'personal'].forEach(t => s.addRow([`${t[0].toUpperCase() + t.slice(1)} miles`, summary.totals[t]]));
    s.addRow(['Total standard mileage amount (USD)', summary.total]);
  }
  s.getColumn(1).font = { bold: true };
  return wb.xlsx.writeBuffer();
}

module.exports = { buildCsv, buildXlsx };
