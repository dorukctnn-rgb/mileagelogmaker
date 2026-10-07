// Official mileage rates used by the generator, the templates and the page copy.
// Every figure was checked against the government source listed in SOURCES on LAST_CHECKED.

const LAST_CHECKED = '2026-10-07';
const LAST_CHECKED_TEXT = 'October 7, 2026';

// IRS optional standard mileage rates (dollars per mile).
// 2026 changed mid-year: Notice 2026-10 (Jan 1 - Jun 30), Announcement 2026-11 in IRB 2026-29 (from Jul 1).
const IRS = {
  '2024': [{ from: '2024-01-01', business: 0.67, medical: 0.21, charity: 0.14 }],
  '2025': [{ from: '2025-01-01', business: 0.70, medical: 0.21, charity: 0.14 }],
  '2026': [
    { from: '2026-01-01', business: 0.725, medical: 0.205, charity: 0.14 },
    { from: '2026-07-01', business: 0.76, medical: 0.235, charity: 0.14 }
  ]
};
const IRS_YEARS = Object.keys(IRS);
const IRS_CURRENT = IRS['2026'][1];
const IRS_RATE_CHANGE_2026 = '2026-07-01';

function irsPeriod(year, date) {
  const periods = IRS[year] || IRS['2026'];
  let p = periods[0];
  for (const cand of periods) if (String(date || '') >= cand.from) p = cand;
  return p;
}

function irsRate(year, date, type) {
  if (type === 'personal') return 0;
  return irsPeriod(year, date)[type] || 0;
}

// CRA reasonable per-kilometre allowance rates (employer allowances to employees).
// Self-employed people do not deduct a per-km rate: they deduct actual costs x business-use %.
const CRA = {
  '2025': { provinces: [0.72, 0.66], territories: [0.76, 0.70] },
  '2026': { provinces: [0.73, 0.67], territories: [0.77, 0.71] }
};
const CRA_YEARS = Object.keys(CRA);

// HMRC approved mileage rates (pounds per business mile). The car/van rate for the first
// 10,000 miles rose from 45p to 55p for the 2026 to 2027 tax year (from 6 April 2026).
const HMRC = {
  car: { firstBefore2026: 0.45, firstFrom2026: 0.55, over: 0.25, threshold: 10000 },
  motorcycle: 0.24,
  bicycle: 0.20
};

// UK tax year that a date falls in, as its starting calendar year (6 April to 5 April).
function ukTaxYearStart(date) {
  const d = String(date || '');
  const y = parseInt(d.slice(0, 4), 10);
  if (!y) return null;
  return d.slice(5) >= '04-06' ? y : y - 1;
}

const IRS_HISTORY = [
  ['2026 (Jul 1 - Dec 31)', 76, 23.5, 14], ['2026 (Jan 1 - Jun 30)', 72.5, 20.5, 14],
  ['2025', 70, 21, 14], ['2024', 67, 21, 14], ['2023', 65.5, 22, 14],
  ['2022 (Jul 1 - Dec 31)', 62.5, 22, 14], ['2022 (Jan 1 - Jun 30)', 58.5, 18, 14],
  ['2021', 56, 16, 14], ['2020', 57.5, 17, 14], ['2019', 58, 20, 14], ['2018', 54.5, 18, 14],
  ['2017', 53.5, 17, 14], ['2016', 54, 19, 14], ['2015', 57.5, 23, 14], ['2014', 56, 23.5, 14],
  ['2013', 56.5, 24, 14], ['2012', 55.5, 23, 14], ['2011 (Jul 1 - Dec 31)', 55.5, 23.5, 14],
  ['2011 (Jan 1 - Jun 30)', 51, 19, 14]
];

const SOURCES = {
  irsRates: { label: 'IRS: Standard mileage rates (all years)', url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates' },
  irsNews2026: { label: 'IRS news release IR-2025-128 (2026 rates, Dec. 29, 2025)', url: 'https://www.irs.gov/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents' },
  irsNotice: { label: 'IRS Notice 2026-10 (rates from Jan. 1, 2026)', url: 'https://www.irs.gov/pub/irs-drop/n-26-10.pdf' },
  irsMidyear: { label: 'IRS Announcement 2026-11, Internal Revenue Bulletin 2026-29 (rates from July 1, 2026)', url: 'https://www.irs.gov/irb/2026-29_irb' },
  pub463: { label: 'IRS Publication 463, chapter 5: Recordkeeping', url: 'https://www.irs.gov/publications/p463' },
  irsPenalty: { label: 'IRS: Accuracy-related penalty', url: 'https://www.irs.gov/payments/accuracy-related-penalty' },
  irsSE: { label: 'IRS: Self-employment tax', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
  irsScheduleC: { label: 'IRS: Schedule C (Form 1040) and instructions', url: 'https://www.irs.gov/forms-pubs/about-schedule-c-form-1040' },
  usc274: { label: '26 U.S.C. 274(d): substantiation required for listed property such as cars', url: 'https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section274&num=0&edition=prelim' },
  uberTax: { label: 'Uber: Tax information for drivers (online miles)', url: 'https://www.uber.com/us/en/drive/tax-information/' },
  ukRecords: { label: 'GOV.UK: How long to keep your business records', url: 'https://www.gov.uk/self-employed-records/how-long-to-keep-your-records' },
  craAllowance: { label: 'CRA: Automobile allowance rates (2026 and 2025)', url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/benefits-allowances/automobile/automobile-motor-vehicle-allowances.html' },
  craFinance2026: { label: 'Department of Finance Canada: 2026 automobile limits and rates (Jan. 14, 2026)', url: 'https://www.canada.ca/en/department-finance/news/2026/01/government-announces-the-2026-automobile-deduction-limits-and-expense-benefit-rates-for-businesses.html' },
  craRecords: { label: 'CRA: Motor vehicle records (logbook and simplified logbook)', url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/business-expenses/motor-vehicle-expenses/motor-vehicle-records.html' },
  craSelfEmployed: { label: 'CRA: Motor vehicle expenses for self-employed people', url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/small-businesses-self-employed-income/business-income-tax-reporting/business-expenses/motor-vehicle-expenses.html' },
  craRetention: { label: 'CRA: How long to keep your records', url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/keeping-records/where-keep-your-records-long-request-permission-destroy-them-early.html' },
  hmrcRates: { label: 'GOV.UK: Travel - mileage and fuel rates and allowances', url: 'https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances/travel-mileage-and-fuel-rates-and-allowances' },
  hmrcSimplified: { label: 'GOV.UK: Simplified expenses for vehicles', url: 'https://www.gov.uk/simpler-income-tax-simplified-expenses/vehicles' }
};

// Small payload the browser needs to calculate the live summary.
function clientRates() {
  return { irs: IRS, irsYears: IRS_YEARS, cra: CRA, craYears: CRA_YEARS, hmrc: HMRC };
}

module.exports = {
  LAST_CHECKED, LAST_CHECKED_TEXT, IRS, IRS_YEARS, IRS_CURRENT, IRS_RATE_CHANGE_2026, irsPeriod, irsRate,
  CRA, CRA_YEARS, HMRC, ukTaxYearStart, IRS_HISTORY, SOURCES, clientRates
};
