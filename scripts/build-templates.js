// Generates the free downloadable templates in public/templates (run: npm run build:templates).
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const R = require('../lib/rates.js');

const OUT = path.join(__dirname, '..', 'public', 'templates');
fs.mkdirSync(OUT, { recursive: true });

const NAVY = 'FF0A2540', LIGHT = 'FFF1F4F9', INPUT = 'FFFFFDF2';
const ROWS = 400;
const FIRST = 7, LAST = FIRST + ROWS - 1;
const thin = { style: 'thin', color: { argb: 'FFD5DCE6' } };
const box = { top: thin, left: thin, bottom: thin, right: thin };

function title(ws, text, cols) {
  ws.mergeCells(1, 1, 1, cols);
  const c = ws.getCell(1, 1);
  c.value = text;
  c.font = { bold: true, size: 16, color: { argb: NAVY } };
  ws.getRow(1).height = 24;
}
function label(ws, addr, text) { const c = ws.getCell(addr); c.value = text; c.font = { bold: true, color: { argb: 'FF425466' } }; }
function input(ws, addr, numFmt) { const c = ws.getCell(addr); c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } }; c.border = box; if (numFmt) c.numFmt = numFmt; }
function header(ws, row, names, widths) {
  const r = ws.getRow(row);
  names.forEach((n, i) => {
    const c = r.getCell(i + 1);
    c.value = n;
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    c.alignment = { vertical: 'middle', wrapText: true };
    ws.getColumn(i + 1).width = widths[i];
  });
  r.height = 30;
}
function listValidation(ws, col, list) {
  for (let r = FIRST; r <= LAST; r++) {
    ws.getCell(`${col}${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${list.join(',')}"`] };
  }
}
function printSetup(ws, lastCol) {
  ws.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 1, printTitlesRow: '6:6',
    margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 } };
  ws.headerFooter.oddFooter = '&LMileageLogMaker.com free template&RPage &P of &N';
  ws.views = [{ state: 'frozen', ySplit: 6 }];
  ws.autoFilter = { from: { row: 6, column: 1 }, to: { row: 6, column: lastCol } };
}
function sourcesSheet(wb, lines) {
  const s = wb.addWorksheet('Rates and sources');
  s.getColumn(1).width = 60; s.getColumn(2).width = 90;
  s.addRow(['Rates and rules used in this template']).font = { bold: true, size: 14 };
  s.addRow([`Last checked against the official sources on ${R.LAST_CHECKED_TEXT}.`]);
  s.addRow([]);
  lines.forEach(l => {
    const row = s.addRow([l[0], l[1] ? { text: l[1], hyperlink: l[1] } : '']);
    if (l[1]) row.getCell(2).font = { color: { argb: 'FF635BFF' }, underline: true };
  });
  s.addRow([]);
  s.addRow(['Made with MileageLogMaker.com. General information, not tax advice.']);
}

// Rate formula for a US row: business rate by date for 2026, medical/charity where relevant.
const usRate = (r, typeCol, dateCol, milesCol) =>
  `IF(OR(${dateCol}${r}="",${milesCol}${r}=""),"",IF(${typeCol}${r}="Personal",0,IF(${typeCol}${r}="Medical",IF(${dateCol}${r}>=DATE(2026,7,1),0.235,0.205),IF(${typeCol}${r}="Charity",0.14,IF(${dateCol}${r}>=DATE(2026,7,1),0.76,0.725)))))`;
const bizOnlyRate = (zeroTypes) => (r, typeCol, dateCol, milesCol) =>
  `IF(OR(${dateCol}${r}="",${milesCol}${r}=""),"",IF(OR(${zeroTypes.map(z => `${typeCol}${r}="${z}"`).join(',')}),0,IF(${dateCol}${r}>=DATE(2026,7,1),0.76,0.725)))`;

const IRS_SOURCE_LINES = [
  ['2026 business rate: 72.5 cents (Jan 1 - Jun 30), 76 cents (from Jul 1)', R.SOURCES.irsRates.url],
  ['2026 medical/moving: 20.5 cents, then 23.5 cents from Jul 1; charity 14 cents', R.SOURCES.irsMidyear.url],
  ['Records to keep: date, destination, business purpose, miles; total miles for the year (Pub. 463, ch. 5)', R.SOURCES.pub463.url],
  ['A log kept weekly counts as a timely kept record (Pub. 463)', R.SOURCES.pub463.url]
];

async function usWorkbook(file, opts) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'MileageLogMaker.com';
  wb.calcProperties.fullCalcOnLoad = true;
  const ws = wb.addWorksheet('Mileage log');
  const names = opts.columns.map(c => c[0]);
  const widths = opts.columns.map(c => c[1]);
  const L = names.length;
  title(ws, opts.title, L);
  label(ws, 'A2', 'Name'); input(ws, 'B2'); ws.mergeCells('B2:C2');
  label(ws, 'D2', 'Vehicle'); input(ws, 'E2'); ws.mergeCells('E2:F2');
  label(ws, 'A3', 'Odometer Jan 1'); input(ws, 'B3', '#,##0');
  label(ws, 'D3', 'Odometer Dec 31'); input(ws, 'E3', '#,##0');
  label(ws, 'G3', 'Total miles'); ws.getCell('H3').value = { formula: 'IF(AND(ISNUMBER(B3),ISNUMBER(E3),E3>B3),E3-B3,"")' }; ws.getCell('H3').numFmt = '#,##0';
  label(ws, 'A4', 'Date placed in service for business'); input(ws, 'D4', 'mm/dd/yyyy');
  ws.getCell('F4').value = 'Yellow cells are for you to fill in. Miles fill in from the odometer columns; you can also type miles directly.';
  ws.getCell('F4').font = { italic: true, color: { argb: 'FF56657A' } };
  header(ws, 6, names, widths);
  const col = k => String.fromCharCode(65 + opts.columns.findIndex(c => c[2] === k));
  for (let r = FIRST; r <= LAST; r++) {
    ws.getCell(`${col('date')}${r}`).numFmt = 'mm/dd/yyyy';
    ws.getCell(`${col('miles')}${r}`).value = { formula: `IF(AND(ISNUMBER(${col('odoStart')}${r}),ISNUMBER(${col('odoEnd')}${r}),${col('odoEnd')}${r}>${col('odoStart')}${r}),${col('odoEnd')}${r}-${col('odoStart')}${r},"")` };
    ws.getCell(`${col('rate')}${r}`).value = { formula: (opts.rateKind === 'us' ? usRate : bizOnlyRate(opts.zeroTypes))(r, col('type'), col('date'), col('miles')) };
    ws.getCell(`${col('amount')}${r}`).value = { formula: `IF(OR(${col('miles')}${r}="",${col('rate')}${r}=""),"",ROUND(${col('miles')}${r}*${col('rate')}${r},2))` };
    ws.getCell(`${col('rate')}${r}`).numFmt = '$0.000';
    ws.getCell(`${col('amount')}${r}`).numFmt = '$#,##0.00';
    if (col('tolls') !== '@') ws.getCell(`${col('tolls')}${r}`).numFmt = '$#,##0.00';
    ['odoStart', 'odoEnd', 'miles'].forEach(k => { ws.getCell(`${col(k)}${r}`).numFmt = '#,##0.0'; });
    if (r % 2 === 0) for (let c = 1; c <= L; c++) ws.getRow(r).getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } };
  }
  listValidation(ws, col('type'), opts.types);
  if (opts.platformCol) listValidation(ws, col('platform'), ['Uber', 'Lyft', 'DoorDash', 'Uber Eats', 'Grubhub', 'Instacart', 'Amazon Flex', 'Other']);
  printSetup(ws, L);

  // Summary
  const s = wb.addWorksheet('Summary');
  s.getColumn(1).width = 46; s.getColumn(2).width = 18; s.getColumn(3).width = 70;
  s.addRow([opts.title + ': summary']).font = { bold: true, size: 14 };
  s.addRow([]);
  const rng = k => `'Mileage log'!$${col(k)}$${FIRST}:$${col(k)}$${LAST}`;
  // Business miles = all dated miles minus the non-business types.
  const nonBiz = opts.rateKind === 'us' ? ['Medical', 'Charity', 'Personal'] : opts.zeroTypes;
  const biz = (extra) => `SUMIFS(${rng('miles')},${rng('date')},"<>"${extra || ''})` + nonBiz.map(z => `-SUMIFS(${rng('miles')},${rng('type')},"${z}"${extra || ''})`).join('');
  const before = `,${rng('date')},"<"&DATE(2026,7,1)`, after = `,${rng('date')},">="&DATE(2026,7,1)`;
  const rows = [
    ['Business miles', biz(), '#,##0.0', opts.rateKind === 'us' ? 'Rows with no type are counted as business.' : 'Everything except ' + nonBiz.join(' and ') + ' rows.'],
    ['  of which before July 1, 2026', biz(before), '#,##0.0', 'Rate 72.5 cents'],
    ['  of which from July 1, 2026', biz(after), '#,##0.0', 'Rate 76 cents']
  ];
  if (opts.rateKind === 'us') {
    rows.push(['Medical miles', `SUMIFS(${rng('miles')},${rng('type')},"Medical")`, '#,##0.0', '20.5 cents before Jul 1, 23.5 cents from Jul 1 (deductible only as an itemized medical expense)']);
    rows.push(['Charity miles', `SUMIFS(${rng('miles')},${rng('type')},"Charity")`, '#,##0.0', '14 cents']);
  }
  rows.push(['Standard mileage amount', `SUM(${rng('amount')})`, '$#,##0.00', 'Miles x the IRS rate for the date driven']);
  if (col('tolls') !== '@') rows.push(['Business parking and tolls', `SUM(${rng('tolls')})`, '$#,##0.00', 'Deductible on top of the standard mileage rate']);
  rows.push(['Total miles driven (odometer)', `'Mileage log'!H3`, '#,##0', 'From the odometer readings at the top of the log']);
  rows.push(['Business-use percentage', `IFERROR(B3/B${2 + rows.length},"")`, '0.0%', 'Business miles / total miles']);
  rows.forEach((row, i) => {
    const r = s.addRow([row[0], null, row[3]]);
    r.getCell(2).value = { formula: row[1] };
    r.getCell(2).numFmt = row[2];
    r.getCell(3).font = { color: { argb: 'FF56657A' } };
    if (i === 0) r.font = { bold: true };
  });
  s.addRow([]);
  s.addRow(['Self-employed: report car expenses on Schedule C, line 9, and complete Part IV (business, commuting and other miles).']);

  // Example sheet
  const ex = wb.addWorksheet('Example');
  ex.addRow(names).font = { bold: true };
  opts.example.forEach(row => ex.addRow(row));
  names.forEach((n, i) => { ex.getColumn(i + 1).width = widths[i]; });
  ex.addRow([]);
  ex.addRow(['Write a specific business purpose for each trip, not just "work".']);

  sourcesSheet(wb, IRS_SOURCE_LINES);
  await wb.xlsx.writeFile(path.join(OUT, file));
}

async function craWorkbook(file) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'MileageLogMaker.com';
  wb.calcProperties.fullCalcOnLoad = true;
  const ws = wb.addWorksheet('Logbook');
  const cols = [['Date', 12], ['From', 22], ['Destination', 28], ['Purpose', 36], ['Odometer start', 13], ['Odometer end', 13], ['Kilometres', 12], ['Business or personal', 14]];
  title(ws, 'Vehicle logbook (CRA)', cols.length);
  label(ws, 'A2', 'Name'); input(ws, 'B2'); ws.mergeCells('B2:C2');
  label(ws, 'D2', 'Vehicle'); input(ws, 'E2'); ws.mergeCells('E2:F2');
  label(ws, 'A3', 'Odometer at start of period'); input(ws, 'C3', '#,##0');
  label(ws, 'D3', 'Odometer at end of period'); input(ws, 'E3', '#,##0');
  label(ws, 'F3', 'Total km'); ws.getCell('G3').value = { formula: 'IF(AND(ISNUMBER(C3),ISNUMBER(E3),E3>C3),E3-C3,"")' }; ws.getCell('G3').numFmt = '#,##0';
  label(ws, 'A4', 'Fiscal period'); input(ws, 'C4'); ws.getCell('C4').value = '2026-01-01 to 2026-12-31';
  ws.getCell('D4').value = 'If you change vehicles, note the date and odometer reading when you buy, sell or trade.';
  ws.getCell('D4').font = { italic: true, color: { argb: 'FF56657A' } };
  header(ws, 6, cols.map(c => c[0]), cols.map(c => c[1]));
  for (let r = FIRST; r <= LAST; r++) {
    ws.getCell(`A${r}`).numFmt = 'yyyy-mm-dd';
    ws.getCell(`G${r}`).value = { formula: `IF(AND(ISNUMBER(E${r}),ISNUMBER(F${r}),F${r}>E${r}),F${r}-E${r},"")` };
    ['E', 'F', 'G'].forEach(c => { ws.getCell(`${c}${r}`).numFmt = '#,##0.0'; });
    if (r % 2 === 0) for (let c = 1; c <= cols.length; c++) ws.getRow(r).getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } };
  }
  listValidation(ws, 'H', ['Business', 'Personal']);
  printSetup(ws, cols.length);
  const km = `Logbook!$G$${FIRST}:$G$${LAST}`, type = `Logbook!$H$${FIRST}:$H$${LAST}`, date = `Logbook!$A$${FIRST}:$A$${LAST}`;

  const s = wb.addWorksheet('Summary');
  s.getColumn(1).width = 44; s.getColumn(2).width = 16; s.getColumn(3).width = 70;
  s.addRow(['Logbook summary']).font = { bold: true, size: 14 };
  s.addRow([]);
  const add = (labelText, formula, fmt, note) => { const r = s.addRow([labelText, null, note || '']); r.getCell(2).value = { formula }; r.getCell(2).numFmt = fmt; r.getCell(3).font = { color: { argb: 'FF56657A' } }; return r.number; };
  const bizRow = add('Business kilometres', `SUMIFS(${km},${type},"Business")+SUMIFS(${km},${type},"=",${date},"<>")`, '#,##0.0', 'Rows with no type are counted as business');
  add('Personal kilometres logged', `SUMIFS(${km},${type},"Personal")`, '#,##0.0');
  const totRow = add('Total kilometres (odometer)', 'Logbook!G3', '#,##0', 'From the odometer readings at the top of the logbook');
  const pctRow = add('Business-use percentage', `IFERROR(B${bizRow}/B${totRow},"")`, '0.0%', 'Business km / total km. Self-employed: apply this to actual vehicle costs.');

  const e = wb.addWorksheet('Expenses (T2125)');
  e.getColumn(1).width = 52; e.getColumn(2).width = 16; e.getColumn(3).width = 60;
  e.addRow(['Motor vehicle expenses for Form T2125']).font = { bold: true, size: 14 };
  e.addRow(['Enter the full-year amounts. The deductible part is your business-use percentage.']);
  e.addRow([]);
  const items = [['Fuel and oil'], ['Electricity (zero-emission vehicle)'], ['Insurance'], ['Licence and registration'], ['Maintenance and repairs'],
    ['Interest on money borrowed to buy the vehicle', 'For loans from Jan 1, 2026: limit $350 a month'], ['Leasing costs', 'For leases from Jan 1, 2026: limit $1,100 a month before tax'], ['Other (parking for business, etc.)']];
  const firstItem = e.rowCount + 1;
  items.forEach(it => { const r = e.addRow([it[0], null, it[1] || '']); r.getCell(2).numFmt = '$#,##0.00'; r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } }; r.getCell(2).border = box; });
  const lastItem = e.rowCount;
  const t = e.addRow(['Total vehicle expenses', null]); t.getCell(2).value = { formula: `SUM(B${firstItem}:B${lastItem})` }; t.getCell(2).numFmt = '$#,##0.00'; t.font = { bold: true };
  const p = e.addRow(['Business-use percentage (from Summary)', null]); p.getCell(2).value = { formula: `Summary!B${pctRow}` }; p.getCell(2).numFmt = '0.0%';
  const d = e.addRow(['Deductible vehicle expenses', null, 'Plus capital cost allowance, calculated separately']); d.getCell(2).value = { formula: `IFERROR(B${t.number}*B${p.number},"")` }; d.getCell(2).numFmt = '$#,##0.00'; d.font = { bold: true };

  const sm = wb.addWorksheet('Simplified logbook');
  sm.getColumn(1).width = 60; sm.getColumn(2).width = 14; sm.getColumn(3).width = 60;
  sm.addRow(['Simplified logbook (after a full base year)']).font = { bold: true, size: 14 };
  sm.addRow(['(sample period % / base year same-period %) x base year annual % = annual business use']);
  sm.addRow([]);
  const in1 = sm.addRow(['Base year: annual business use', 0.49]); const in2 = sm.addRow(['Base year: business use in the same 3 months', 0.46]); const in3 = sm.addRow(['This year: business use in the 3-month sample', 0.51]);
  [in1, in2, in3].forEach(r => { r.getCell(2).numFmt = '0.0%'; r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } }; r.getCell(2).border = box; });
  const res = sm.addRow(['Calculated annual business use', null]); res.getCell(2).value = { formula: `IFERROR(B${in3.number}/B${in2.number}*B${in1.number},"")` }; res.getCell(2).numFmt = '0.0%'; res.font = { bold: true };
  const chk = sm.addRow(['Within 10% of the base year?', null, 'Compared in percentage points, consistent with the CRA example (49%, 46%, 51% gives 54%)']);
  chk.getCell(2).value = { formula: `IF(B${res.number}="","",IF(ABS(B${res.number}-B${in1.number})<=0.1,"Yes","No: keep full records"))` };

  const a = wb.addWorksheet('Allowance (employer)');
  a.getColumn(1).width = 52; a.getColumn(2).width = 16; a.getColumn(3).width = 60;
  a.addRow(['Reasonable per-km allowance check (employers)']).font = { bold: true, size: 14 };
  a.addRow(['The CRA per-km rates set the limit for tax-free allowances to employees. They are not a deduction for self-employed people.']);
  a.addRow([]);
  const k = a.addRow(['Business kilometres', null]); k.getCell(2).value = { formula: `Summary!B${bizRow}` }; k.getCell(2).numFmt = '#,##0';
  const r1 = a.addRow(['Rate for the first 5,000 km', R.CRA['2026'].provinces[0], 'Provinces 2026: $0.73 (territories $0.77)']);
  const r2 = a.addRow(['Rate for each km after 5,000', R.CRA['2026'].provinces[1], 'Provinces 2026: $0.67 (territories $0.71)']);
  [r1, r2].forEach(r => { r.getCell(2).numFmt = '$0.00'; r.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT } }; });
  const al = a.addRow(['Allowance at these rates', null]); al.getCell(2).value = { formula: `MIN(B${k.number},5000)*B${r1.number}+MAX(B${k.number}-5000,0)*B${r2.number}` }; al.getCell(2).numFmt = '$#,##0.00'; al.font = { bold: true };

  sourcesSheet(wb, [
    ['Logbook: date, destination, purpose, km per business trip; odometer at start and end of the fiscal period', R.SOURCES.craRecords.url],
    ['Simplified logbook: full base year, then a 3-month sample within 10%', R.SOURCES.craRecords.url],
    ['Self-employed: business-use % of actual vehicle expenses', R.SOURCES.craSelfEmployed.url],
    ['2026 allowance rates: 73 cents first 5,000 km, 67 cents after (territories 77 / 71)', R.SOURCES.craAllowance.url],
    ['2026 limits: CCA $39,000; ZEV $61,000; interest $350/month; lease $1,100/month', R.SOURCES.craFinance2026.url],
    ['Keep records for six years from the end of the last tax year they relate to', R.SOURCES.craRetention.url]
  ]);
  await wb.xlsx.writeFile(path.join(OUT, file));
}

function pdfTemplate(file, opts) {
  return new Promise(resolve => {
    const doc = new PDFDocument({ size: 'LETTER', layout: 'landscape', margin: 36, info: { Title: opts.title, Creator: 'MileageLogMaker.com' } });
    const out = fs.createWriteStream(path.join(OUT, file));
    doc.pipe(out);
    const W = doc.page.width, left = 36, width = W - 72;
    for (let page = 0; page < 2; page++) {
      if (page) doc.addPage();
      doc.page.margins.bottom = 0;
      doc.font('Helvetica-Bold').fontSize(17).fillColor('#0a2540').text(opts.title, left, 32);
      doc.font('Helvetica').fontSize(8.5).fillColor('#56657a').text(opts.subtitle, left, 53);
      let y = 72;
      doc.font('Helvetica').fontSize(9).fillColor('#0a2540');
      let x = left;
      opts.fields.forEach(([lab, w]) => {
        doc.text(lab, x, y, { lineBreak: false });
        const lw = doc.widthOfString(lab) + 4;
        doc.moveTo(x + lw, y + 10).lineTo(x + w - 10, y + 10).strokeColor('#9aa7b8').lineWidth(0.6).stroke();
        x += w;
      });
      y += 24;
      const total = opts.columns.reduce((a, c) => a + c[1], 0);
      const cols = opts.columns.map(c => [c[0], c[1] * width / total]);
      const HEAD = 26;
      doc.rect(left, y, width, HEAD).fill('#0a2540');
      x = left;
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#ffffff');
      cols.forEach(([h, w]) => { const lines = doc.widthOfString(h) > w - 8 ? 2 : 1; doc.text(h, x + 4, y + (lines === 2 ? 4 : 9), { width: w - 8, height: 20 }); x += w; });
      y += HEAD;
      const rowH = 19;
      for (let i = 0; i < opts.rows; i++) {
        if (i % 2 === 1) doc.rect(left, y, width, rowH).fill('#f5f7fb');
        doc.moveTo(left, y + rowH).lineTo(left + width, y + rowH).strokeColor('#dfe5ee').lineWidth(0.5).stroke();
        y += rowH;
      }
      x = left;
      cols.forEach(([, w], i) => { if (i) doc.moveTo(x, y - rowH * opts.rows - HEAD).lineTo(x, y).strokeColor('#dfe5ee').lineWidth(0.5).stroke(); x += w; });
      doc.rect(left, y - rowH * opts.rows - HEAD, width, rowH * opts.rows + HEAD).strokeColor('#b9c4d3').lineWidth(0.8).stroke();
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#0a2540').text('Page total: ____________', left, y + 8, { width, align: 'right', lineBreak: false });
      doc.font('Helvetica').fontSize(7.5).fillColor('#56657a').text(opts.footer, left, y + 24, { width, lineBreak: true });
      doc.text(`Free template from MileageLogMaker.com  ·  Rates and rules checked ${R.LAST_CHECKED_TEXT}  ·  Page ${page + 1} of 2`, left, 592, { width, align: 'center', lineBreak: false });
    }
    doc.end();
    out.on('finish', resolve);
  });
}

(async () => {
  const usCols = [['Date', 12, 'date'], ['Start', 20, 'start'], ['Destination', 26, 'dest'], ['Business purpose', 34, 'purpose'], ['Odometer start', 12, 'odoStart'], ['Odometer end', 12, 'odoEnd'], ['Miles', 9, 'miles'], ['Type', 11, 'type'], ['Rate', 9, 'rate'], ['Amount', 11, 'amount'], ['Parking & tolls', 12, 'tolls']];
  await usWorkbook('mileage-log-template-2026.xlsx', {
    title: 'Mileage Log 2026', columns: usCols, rateKind: 'us', types: ['Business', 'Medical', 'Charity', 'Personal'],
    example: [
      ['07/06/2026', 'Home office', 'Acme Dental, 410 Pine St', 'Quarterly bookkeeping review with client', 48210, 48224, 14, 'Business', 0.76, 10.64, ''],
      ['07/06/2026', 'Acme Dental', 'Office Depot, N Lamar Blvd', 'Printer toner for the business', 48224, 48228, 4, 'Business', 0.76, 3.04, ''],
      ['07/09/2026', 'Home office', 'County permits office', 'File permit for Hill St client project', 48301, 48319, 18, 'Business', 0.76, 13.68, 6.00],
      ['07/10/2026', 'Home', 'Riverside Hospital', 'Medical appointment', 48340, 48349.5, 9.5, 'Medical', 0.235, 2.23, '']
    ]
  });
  const reCols = [['Date', 12, 'date'], ['Start', 18, 'start'], ['Property address / destination', 28, 'dest'], ['Client or MLS #', 18, 'client'], ['Purpose', 20, 'type'], ['Odometer start', 12, 'odoStart'], ['Odometer end', 12, 'odoEnd'], ['Miles', 9, 'miles'], ['Rate', 9, 'rate'], ['Amount', 11, 'amount'], ['Parking & tolls', 12, 'tolls']];
  await usWorkbook('real-estate-mileage-log-template.xlsx', {
    title: 'Real Estate Mileage Log 2026', columns: reCols, rateKind: 'biz', zeroTypes: ['Personal'],
    types: ['Showing', 'Listing appointment', 'Open house', 'Broker tour', 'Inspection or appraisal', 'Closing', 'Business errand', 'Personal'],
    example: [
      ['07/11/2026', 'Home office', '123 Oak St', 'Johnson / MLS 4471825', 'Showing', 40112, 40120.6, 8.6, 0.76, 6.54, ''],
      ['07/11/2026', '123 Oak St', '47 Birch Ln', 'Johnson / MLS 4470032', 'Showing', 40120.6, 40124.5, 3.9, 0.76, 2.96, ''],
      ['07/11/2026', '47 Birch Ln', 'Hilltop Title Co.', 'Ramirez', 'Closing', 40124.5, 40130.7, 6.2, 0.76, 4.71, 4.00]
    ]
  });
  const rsCols = [['Date', 12, 'date'], ['Platform', 13, 'platform'], ['Area / purpose', 34, 'purpose'], ['Odometer out', 13, 'odoStart'], ['Odometer in', 13, 'odoEnd'], ['Miles', 9, 'miles'], ['App-reported miles', 12, 'app'], ['Type', 16, 'type'], ['Rate', 9, 'rate'], ['Amount', 11, 'amount'], ['Parking & tolls', 12, 'tolls']];
  await usWorkbook('rideshare-delivery-mileage-log-template.xlsx', {
    title: 'Rideshare & Delivery Mileage Log 2026', columns: rsCols, rateKind: 'biz', platformCol: true, zeroTypes: ['Home to zone / back', 'Personal'],
    types: ['Business', 'Home to zone / back', 'Personal'],
    example: [
      ['07/17/2026', 'Uber', 'Rides and waiting for requests, downtown and airport', 61204, 61331, 127, 118, 'Business', 0.76, 96.52, 7.50],
      ['07/18/2026', 'DoorDash', 'Home to midtown zone (check commuting rules)', 61331, 61337, 6, '', 'Home to zone / back', 0, 0, ''],
      ['07/18/2026', 'DoorDash', 'Dinner dash: deliveries and waiting for orders, midtown', 61337, 61390, 53, '', 'Business', 0.76, 40.28, '']
    ]
  });
  await craWorkbook('cra-vehicle-logbook-template.xlsx');

  const footUS = 'Record each business trip at or near the time (a weekly log counts). Note odometer readings on Jan 1 and Dec 31. 2026 IRS rates: 72.5¢ per business mile Jan 1 - Jun 30, 76¢ from Jul 1; medical 20.5¢ / 23.5¢; charity 14¢. Business parking and tolls are deductible on top. Sources: IRS Pub. 463, irs.gov/tax-professionals/standard-mileage-rates.';
  await pdfTemplate('mileage-log-template-2026.pdf', {
    title: 'Mileage Log 2026', subtitle: 'For IRS standard mileage or actual expense records. One line per business trip.',
    fields: [['Name', 200], ['Vehicle', 200], ['Odometer Jan 1', 160], ['Odometer Dec 31', 160]],
    columns: [['Date', 9], ['Start', 17], ['Destination', 20], ['Business purpose', 28], ['Odometer start', 11], ['Odometer end', 11], ['Miles', 8], ['Type (B/M/C/P)', 9], ['Parking & tolls', 10]],
    rows: 21, footer: footUS
  });
  await pdfTemplate('real-estate-mileage-log-template.pdf', {
    title: 'Real Estate Mileage Log 2026', subtitle: 'Showings, listing appointments, open houses, inspections, closings. One line per trip.',
    fields: [['Agent', 200], ['Vehicle', 200], ['Odometer Jan 1', 160], ['Odometer Dec 31', 160]],
    columns: [['Date', 9], ['From', 15], ['Property address / destination', 24], ['Client or MLS #', 16], ['Purpose', 16], ['Odometer start', 11], ['Odometer end', 11], ['Miles', 8], ['Parking & tolls', 10]],
    rows: 21, footer: footUS
  });
  await pdfTemplate('rideshare-delivery-mileage-log-template.pdf', {
    title: 'Rideshare & Delivery Mileage Log 2026', subtitle: 'One line per shift. Note home-to-zone miles separately: commuting rules decide whether they count.',
    fields: [['Driver', 200], ['Vehicle', 200], ['Odometer Jan 1', 160], ['Odometer Dec 31', 160]],
    columns: [['Date', 9], ['Platform', 11], ['Area / purpose', 30], ['Odometer out', 11], ['Odometer in', 11], ['Shift miles', 9], ['App miles', 9], ['Home to zone miles', 10], ['Parking & tolls', 10]],
    rows: 21, footer: footUS
  });
  await pdfTemplate('cra-vehicle-logbook-template.pdf', {
    title: 'Vehicle Logbook (CRA)', subtitle: 'Record the date, destination, purpose and kilometres of each business trip, and the odometer at the start and end of the fiscal period.',
    fields: [['Name', 170], ['Vehicle', 170], ['Odometer start of period', 190], ['Odometer end of period', 190]],
    columns: [['Date', 9], ['From', 16], ['Destination', 22], ['Purpose', 28], ['Odometer start', 11], ['Odometer end', 11], ['Km', 8], ['Business / personal', 11]],
    rows: 21, footer: 'Business-use % = business km / total km. Self-employed people deduct that share of actual vehicle expenses on Form T2125. 2026 CRA allowance rates (employer allowances): 73¢ first 5,000 km, 67¢ after (territories 77¢ / 71¢). Keep records for six years. Sources: canada.ca motor vehicle records; automobile allowance rates.'
  });
  console.log('Templates written to', OUT, fs.readdirSync(OUT));
})().catch(e => { console.error(e); process.exit(1); });
