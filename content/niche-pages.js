// SEO landing pages rendered by views/niche.ejs. Facts last checked against official sources on 2026-10-07.

const RATES = require('../lib/rates.js');

const NICHE_PAGES = {
  'mileage-log-2026-irs-rate': {
    title: '2026 IRS Mileage Rate: 76¢ From July 1, 72.5¢ Before',
    h1: '2026 IRS Mileage Rate: 72.5¢, Then 76¢ From July 1',
    description: 'The IRS mileage rate is 76¢ per business mile from July 1, 2026 and 72.5¢ for January to June. Medical 23.5¢ (20.5¢ before), charity 14¢. Free log applies both.',
    keyword: '2026 irs mileage rate',
    sources: ['irsRates', 'irsNews2026', 'irsNotice', 'irsMidyear'],
    intro: 'The IRS changed the 2026 standard mileage rate in the middle of the year. Miles driven from January 1 to June 30, 2026 use Notice 2026-10: 72.5 cents per business mile and 20.5 cents per medical or moving mile. For miles driven on or after July 1, 2026, Announcement 2026-11 (Internal Revenue Bulletin 2026-29) raised the business rate to 76 cents and the medical and moving rate to 23.5 cents. The charity rate stays at 14 cents. This generator applies the correct rate to each trip based on its date.',
    tips: [
      'Business: 72.5¢/mile Jan 1 to Jun 30, 76¢/mile from Jul 1, 2026',
      'Medical and moving: 20.5¢/mile Jan 1 to Jun 30, 23.5¢/mile from Jul 1',
      'Charity: 14¢/mile all year (set by statute, unchanged since 1998)',
      'Moving applies only to active-duty military and eligible intelligence community members',
      'Split your 2026 log at July 1 so each trip gets the right rate'
    ],
    sections: [
      {
        h: 'Why the IRS changed the rate mid-year',
        p: [
          'The business rate is based on the fixed and variable costs of running a car. The medical and moving rate uses only variable costs such as fuel. When fuel costs rise sharply, the IRS can issue a mid-year update, as it did in July 2022. The July 2026 increase is the second mid-year change in five years.',
          'Mid-year changes only affect miles driven after the effective date. Trips from the first half of 2026 keep the 72.5¢ rate; you do not recalculate them.'
        ]
      },
      {
        h: 'How to calculate a 2026 deduction with two rates',
        p: [
          'Total your business miles for January 1 to June 30 and multiply by $0.725. Total your business miles from July 1 onward and multiply by $0.76. Add the two results. Example: 6,000 miles before July 1 = $4,350, plus 7,000 miles after = $5,320, for a total deduction of <strong>$9,670</strong>.',
          'Medical miles work the same way at 20.5¢ and 23.5¢. Charity miles are 14¢ for the whole year.',
          'For employer reimbursements at the IRS rate, Announcement 2026-11 applies 76¢ to travel on or after July 1, 2026; earlier trips keep 72.5¢ even when they are paid later. The <a href="/mileage-reimbursement-calculator">mileage reimbursement calculator</a> splits a list of trips at that date and also takes an employer\'s own rate. Reimbursements up to the IRS rate are generally tax-free under an accountable plan.'
        ]
      }
    ],
    faq: [
      { q: 'What is the IRS mileage rate for 2026?', a: 'For business driving, 72.5 cents per mile from January 1 to June 30, 2026, and 76 cents per mile from July 1, 2026. Medical and moving: 20.5 cents, then 23.5 cents from July 1. Charitable: 14 cents all year.' },
      { q: 'Does the 76 cent rate apply to the whole of 2026?', a: 'No. It applies only to miles driven on or after July 1, 2026. Miles driven earlier in 2026 use 72.5 cents.' },
      { q: 'Where did the IRS announce the July 2026 change?', a: 'In Announcement 2026-11, published in Internal Revenue Bulletin 2026-29 on July 13, 2026. The original 2026 rates came from Notice 2026-10 (news release IR-2025-128, December 29, 2025).' },
      { q: 'Did the charity mileage rate change?', a: 'No. The charitable rate is set by law at 14 cents per mile and did not change.' }
    ]
  },
  'forgot-to-track-mileage': {
    title: 'Forgot to Track Mileage? How to Rebuild Your Log',
    h1: 'Forgot to Track Mileage? Here is What to Do',
    description: 'Did not track your business miles? How to rebuild a mileage log from calendars, app trip histories and receipts, what the IRS accepts, and a free log generator.',
    keyword: 'forgot to track mileage',
    intro: 'You are not the first person to reach tax season without a mileage log, and you will not be the last. Publication 463 lets you support missing records with your own detailed written statement plus corroborating evidence such as calendars, invoices and platform trip histories. A rebuilt log is weaker than one kept at the time, so be specific and conservative. This page walks you through exactly how to rebuild a defensible log from the records you already have, then generate it as an IRS-ready PDF for free. No app download. No signup. No subscription.',
    tips: [
      'Check Google Maps Timeline on your phone (if location history was on) for past trips',
      'Export Uber/Lyft/DoorDash trip summaries from your driver tax dashboard',
      'Scan calendar appointments for client visits and meetings',
      'Use bank/credit card statements showing gas, tolls, and travel expenses',
      'Find odometer readings on oil change receipts near Jan 1 and Dec 31',
      'Once you have evidence, enter trips into the generator above and download a PDF'
    ]
  },
  'irs-mileage-rate-history': {
    updated: '2026-10-07',
    title: 'IRS Mileage Rate History 2011-2026: Every Rate by Year',
    h1: 'IRS Mileage Rate History',
    blurb: 'Business, medical and charity rates since 2011',
    description: 'IRS standard mileage rates for every year from 2011 to 2026, including the mid-year changes in 2011, 2022 and July 2026. Business, medical/moving and charity rates.',
    keyword: 'irs mileage rate history',
    intro: 'The IRS changed the standard mileage rate in the middle of the year three times since 2011: July 2011, July 2022 and July 2026. The table lists every business, medical or moving, and charity rate from 2011 to 2026, as published on irs.gov. Use the rate for the period in which you drove, which matters when you amend an older return or rebuild a past log.',
    sources: ['irsRates', 'irsNotice', 'irsMidyear'],
    related: ['mileage-log-2026-irs-rate', 'irs-mileage-log-requirements', 'forgot-to-track-mileage', 'free-mileage-log-template', 'mileage-log-self-employed'],
    sections: [
      {
        h: 'Standard mileage rates by year (cents per mile)',
        id: 'table',
        html: '<div class="table-wrap"><table class="data"><thead><tr><th>Period</th><th class="num">Business</th><th class="num">Medical or moving</th><th class="num">Charity</th></tr></thead><tbody>' +
          RATES.IRS_HISTORY.map(r => '<tr><td>' + r[0] + '</td><td class="num">' + r[1] + '</td><td class="num">' + r[2] + '</td><td class="num">' + r[3] + '</td></tr>').join('') +
          '</tbody></table></div><p>Moving rates apply only to active-duty members of the Armed Forces moving under orders and, from 2026, certain members of the intelligence community. The charity rate is fixed by law at 14 cents.</p>' +
          '<p>To price trips from 2024 to 2026 at the rate for each trip date, use the <a href="/mileage-reimbursement-calculator">mileage reimbursement calculator</a>.</p>'
      }
    ],
    tips: [
      '2026: 72.5¢ business for Jan 1 to Jun 30, 76¢ from Jul 1',
      '2025: 70¢ business, 21¢ medical, 14¢ charity',
      '2024: 67¢ business, 21¢ medical, 14¢ charity',
      '2022: 58.5¢ for Jan to Jun, 62.5¢ for Jul to Dec',
      'Use the rate for the date driven, not the date you file'
    ]
  },
  // Competitor prices and plan limits below were read on each vendor's own page on 2026-10-09.
  // Re-check every figure on the linked page before changing a date here.
  'mileiq-alternative': {
    updated: '2026-10-09',
    layout: 'article',
    title: 'MileIQ Alternatives 2026: Current Prices and Free Options',
    h1: 'MileIQ alternatives: what MileIQ costs now, and what to use instead',
    badge: 'Prices checked on each vendor\'s own site on October 9, 2026',
    description: 'MileIQ Unlimited is $13.99 a month or $11.66 billed annually; the free plan stops at 40 drives. TripLog, Everlance and Driversnote prices, checked October 9, 2026.',
    keyword: 'mileiq alternative',
    ctaLabel: 'Create a free mileage log',
    leadHtml: 'MileIQ Unlimited costs <strong>$13.99 a month</strong>, or <strong>$11.66 a month billed annually</strong> ($139.92 a year), and the free plan stops at <strong>40 drives a month</strong> (<a href="https://mileiq.com/pricing" target="_blank" rel="noopener">mileiq.com/pricing</a>, checked October 9, 2026). Below are the prices and free-plan limits of the main alternatives, read from each vendor\'s own pricing page on the same day, and a plain answer to whether you need an app at all.',
    sources: ['pub463', 'irsRates'],
    extraSources: [
      { label: 'MileIQ: Pricing (Free and Unlimited plans)', url: 'https://mileiq.com/pricing' },
      { label: 'MileIQ: Automatic classification by Work Hours or by swipe', url: 'https://mileiq.com/' },
      { label: 'MileIQ Help Center: How to request a Monthly Report (PDF and CSV)', url: 'https://support.mileiq.com/hc/en-us/articles/203801449-How-to-request-a-Monthly-Report' },
      { label: 'TripLog: Pricing (Basic, Premium and the 7-day pass)', url: 'https://www.triplog.net/pricing' },
      { label: 'Everlance: Pricing and plan comparison', url: 'https://www.everlance.com/pricing' },
      { label: 'Driversnote: Pricing', url: 'https://www.driversnote.com/pricing' }
    ],
    checkedNote: 'Competitor prices and plan limits were read on each vendor\'s own pricing or help page on October 9, 2026. Vendors change prices, so check the linked page before you buy.',
    related: ['everlance-alternative', 'irs-mileage-log-requirements', 'free-mileage-log-template', 'mileage-log-uber-drivers', 'mileage-log-self-employed', 'forgot-to-track-mileage'],
    sectionsBefore: [
      {
        h: 'MileIQ and the alternatives, side by side',
        id: 'compare',
        html: '<div class="table-wrap"><table class="data"><thead><tr><th>App</th><th>Free plan</th><th>Paid plan, as listed</th><th>Automatic tracking</th></tr></thead><tbody>' +
          '<tr><td><strong>MileIQ</strong></td><td>40 drives a month</td><td>Unlimited: $13.99 a month, or $11.66 a month billed annually</td><td>Yes. You classify each drive with a swipe, or MileIQ classifies by your Work Hours</td></tr>' +
          '<tr><td><strong>TripLog</strong></td><td>Basic: unlimited automatic GPS tracking. Downloading the annual report uses a 7-day pass; one pass a calendar year is free, from January 1</td><td>Premium: $4.99 a month, paid annually as $59.99</td><td>Yes</td></tr>' +
          '<tr><td><strong>Everlance</strong></td><td>Basic: 30 automatically tracked trips a month, unlimited manual trips. CSV and PDF exports are not in Basic</td><td>Starter: $10.99 a month or $89.99 a year</td><td>Yes</td></tr>' +
          '<tr><td><strong>Driversnote</strong></td><td>Up to 15 trips a month</td><td>Pro: 11 USD a month, before tax</td><td>Yes</td></tr>' +
          '<tr><td><strong>MileageLogMaker</strong> (this site)</td><td>Unlimited trips; the PDF carries a light &ldquo;Free version&rdquo; watermark</td><td>Pro: $9 once (no watermark, Excel and CSV export, your logo)</td><td>No. You enter trips yourself</td></tr>' +
          '</tbody><caption>Prices in US dollars as shown on each vendor\'s pricing page on October 9, 2026. Links are under Sources.</caption></table></div>'
      },
      {
        h: 'What a year costs',
        p: [
          'Paid monthly, MileIQ Unlimited comes to <strong>$167.88</strong> a year (12 &times; $13.99); billed annually it is <strong>$139.92</strong>. Everlance Starter is $89.99 a year and TripLog Premium $59.99 a year. Driversnote lists Pro at 11 USD a month before tax. MileageLogMaker Pro is a single $9 payment, and the free version has no trip limit.',
          'The cheapest automatic option is TripLog\'s free Basic plan, which its pricing page lists with unlimited automatic GPS tracking. If you want a phone to log trips for you without paying, try that before paying for MileIQ.'
        ]
      }
    ],
    tipsHeading: 'Before you switch from MileIQ',
    tips: [
      'Download PDF and CSV reports for every month of this tax year (steps below)',
      'Write down your odometer reading on the day you switch',
      'Note the switch date in both records so no trip is logged twice',
      'Keep the old reports with your tax return'
    ],
    sections: [
      {
        h: 'Do you need automatic tracking?',
        p: [
          'Automatic tracking earns its price when you make many short trips you would otherwise forget: rideshare or delivery shifts, or a day of site visits. If that is you, keep an automatic tracker, and compare TripLog\'s free plan with MileIQ before you pay.',
          'If your business driving is regular (the same clients, a weekly route, a few trips a week), an app adds little. The IRS does not require an app or a particular format. It asks for the date, destination, business purpose and miles of each trip, plus your total miles for the year, recorded at or near the time, and Publication 463 accepts a log kept on a weekly basis. The full list is in <a href="/irs-mileage-log-requirements">IRS mileage log requirements</a>.',
          'The IRS does not approve or certify mileage apps or templates. &ldquo;IRS-compliant&rdquo; on any product, this one included, means the log records the elements Publication 463 asks for.'
        ]
      },
      {
        h: 'Moving your MileIQ history before you cancel',
        p: [
          'MileIQ\'s help center describes two ways to get your drives out as files. <strong>In the app</strong>, tap the Share/Send button and choose a month; MileIQ emails you links to PDF and CSV versions of that month\'s report. <strong>On the web</strong>, sign in at dashboard.mileiq.com, open the Reports tab, select Create Report, choose the date range and drive types, then download the CSV or PDF from Archived Reports.',
          'Do this for every month you will claim, and keep the files with your return. If you continue the year with another log, start it on the day after your last MileIQ drive.'
        ]
      },
      {
        h: 'What MileIQ does well',
        p: [
          'MileIQ detects drives automatically. You classify each one as business or personal with a swipe, or let it classify drives for you based on Work Hours you set, and reports come as PDF and CSV from the app or the web dashboard. For someone with many unplanned trips, that saves real effort. The question is whether it is worth $139.92 a year to you when TripLog\'s free plan also tracks automatically.'
        ]
      },
      {
        h: 'Where this generator fits, and where it does not',
        p: [
          'MileageLogMaker is a log generator, not a tracker. You enter your trips and it builds a PDF with the date, destination, purpose and miles of each trip, the year\'s totals and the deduction at the IRS rate for each trip\'s date (72.5&cent; a mile to June 30, 2026, then 76&cent; from July 1). There is no app, no account and no trip limit. Trips are kept in your browser and sent to our server only to build the PDF, which is not stored.',
          'It will not notice a drive you forget to enter, so it suits regular, predictable driving. The free PDF carries a light &ldquo;Free version&rdquo; watermark; Pro is a single $9 payment that removes it and adds Excel and CSV export and your logo.'
        ]
      }
    ],
    faq: [
      {
        q: 'How much does MileIQ cost in 2026?',
        a: 'MileIQ Unlimited is $13.99 a month billed monthly, or $11.66 a month billed annually ($139.92 a year). The free plan includes automatic tracking and reports for up to 40 drives a month. Prices from mileiq.com/pricing, checked October 9, 2026.'
      },
      {
        q: 'Is there a free MileIQ alternative with automatic tracking?',
        a: 'Yes. TripLog lists its Basic plan as free forever with unlimited automatic GPS tracking; downloading the annual report uses a 7-day pass, and one pass each calendar year is free from January 1. Everlance\'s free plan tracks 30 trips a month automatically and Driversnote\'s covers 15 trips a month (all checked October 9, 2026).'
      },
      {
        q: 'How do I export my MileIQ data?',
        a: 'In the MileIQ app, tap Share/Send and choose a month to get PDF and CSV links by email. On dashboard.mileiq.com, open Reports, select Create Report, then download the CSV or PDF under Archived Reports. Source: MileIQ help center, checked October 9, 2026.'
      },
      {
        q: 'Is a manual mileage log as good as an app for the IRS?',
        a: 'Yes, if it holds the required details: the date, destination, business purpose and miles of each trip and your total miles for the year, recorded at or near the time. Publication 463 accepts a log kept on a weekly basis. The IRS does not certify any app or template.'
      }
    ]
  },
  'everlance-alternative': {
    updated: '2026-10-09',
    layout: 'article',
    title: 'Everlance Alternatives 2026: Prices Checked, Free Options',
    h1: 'Everlance alternatives: what each plan costs and what to use instead',
    badge: 'Prices checked on each vendor\'s own site on October 9, 2026',
    description: 'Everlance Starter is $89.99 a year or $10.99 a month; the free plan tracks 30 trips a month and has no CSV or PDF export. Alternatives priced October 9, 2026.',
    keyword: 'everlance alternative',
    ctaLabel: 'Create a free mileage log',
    leadHtml: 'Everlance has three plans for individuals: <strong>Basic</strong> (free, 30 automatically tracked trips a month), <strong>Starter</strong> ($89.99 a year or $10.99 a month) and <strong>Professional</strong> ($119.99 a year or $19.99 a month), according to <a href="https://www.everlance.com/pricing" target="_blank" rel="noopener">everlance.com/pricing</a> on October 9, 2026. The right alternative depends on which part of Everlance you actually use: the mileage log, the expense tracking or the tax filing.',
    sources: ['pub463', 'irsRates'],
    extraSources: [
      { label: 'Everlance: Pricing, plan comparison and FAQ', url: 'https://www.everlance.com/pricing' },
      { label: 'Everlance: How its automatic mileage tracker detects drives', url: 'https://www.everlance.com/mileage-tracker' },
      { label: 'TripLog: Pricing (Basic, Premium and the 7-day pass)', url: 'https://www.triplog.net/pricing' },
      { label: 'MileIQ: Pricing', url: 'https://mileiq.com/pricing' },
      { label: 'Driversnote: Pricing', url: 'https://www.driversnote.com/pricing' }
    ],
    checkedNote: 'Competitor prices and plan features were read on each vendor\'s own page on October 9, 2026. Vendors change plans, so check the linked page before you buy.',
    related: ['mileiq-alternative', 'irs-mileage-log-requirements', 'free-mileage-log-template', 'mileage-log-self-employed', 'mileage-log-doordash-drivers', 'cra-mileage-log-template'],
    sectionsBefore: [
      {
        h: 'What each Everlance plan includes',
        id: 'plans',
        html: '<div class="table-wrap"><table class="data"><thead><tr><th>Feature</th><th>Basic</th><th>Starter</th><th>Professional</th></tr></thead><tbody>' +
          '<tr><td>Price</td><td>$0</td><td>$89.99 a year or $10.99 a month</td><td>$119.99 a year or $19.99 a month</td></tr>' +
          '<tr><td>Automatic trip detection</td><td>30 trips a month</td><td>Unlimited</td><td>Unlimited</td></tr>' +
          '<tr><td>Manual trips</td><td>Unlimited</td><td>Included</td><td>Included</td></tr>' +
          '<tr><td>IRS-compliant mileage logs, web dashboard</td><td>Included</td><td>Included</td><td>Included</td></tr>' +
          '<tr><td>CSV and PDF exports</td><td>Not included</td><td>Included</td><td>Included</td></tr>' +
          '<tr><td>Bank and credit card integration</td><td>Not included</td><td>Not included</td><td>Included</td></tr>' +
          '<tr><td>Tax filing and $1 million audit defense</td><td>Not included</td><td>Not included</td><td>Included</td></tr>' +
          '<tr><td>Support</td><td>Email</td><td>Email, phone, chat</td><td>Email, phone, chat, live training</td></tr>' +
          '</tbody><caption>From the plan comparison on everlance.com/pricing, October 9, 2026.</caption></table></div>'
      },
      {
        h: 'Alternatives for the part you actually use',
        id: 'alternatives',
        html: '<div class="table-wrap"><table class="data fit"><thead><tr><th>If you use Everlance for</th><th>Alternatives, with prices checked October 9, 2026</th></tr></thead><tbody>' +
          '<tr><td>Automatic mileage tracking only</td><td><strong>TripLog</strong> Basic: free, unlimited automatic GPS tracking; the annual report download uses a 7-day pass, one of which is free each calendar year. <strong>MileIQ</strong>: free for 40 drives a month, Unlimited $11.66 a month billed annually. <strong>Driversnote</strong>: free for 15 trips a month, Pro 11 USD a month before tax.</td></tr>' +
          '<tr><td>A mileage log for regular, predictable trips</td><td><strong>MileageLogMaker</strong> (this site): free, no app or account, unlimited trips; Pro $9 once.</td></tr>' +
          '<tr><td>Mileage plus expenses</td><td><strong>TripLog</strong> Premium: $59.99 a year, which TripLog lists with automatic expense tracking and unlimited reporting.</td></tr>' +
          '<tr><td>Tax filing and audit defense</td><td>Everlance Professional bundles these. If a preparer or tax software already files your return, the mileage log may be the only part you need from an app.</td></tr>' +
          '</tbody></table></div>'
      }
    ],
    tipsHeading: 'Before you leave Everlance',
    tips: [
      'Export CSV and PDF reports for the whole tax year while Starter or Professional is active',
      'On a trial, cancel before the 7 days end (Everlance says by phone)',
      'Write down your odometer reading on the day you switch',
      'Check that your new log has the date, destination, purpose and miles of every trip'
    ],
    sections: [
      {
        h: 'The detail on Everlance\'s free plan',
        p: [
          'Everlance Basic tracks 30 trips a month automatically and lets you add unlimited trips by hand. Its plan comparison lists IRS-compliant mileage logs and the web dashboard on every plan, but CSV and PDF exports only on Starter and Professional. If you need a file to hand to an accountant or attach to a reimbursement claim, check that before relying on the free plan.',
          'Automatic detection runs on your phone: Everlance says it uses the phone\'s GPS and motion sensors to detect when a drive starts and ends.'
        ]
      },
      {
        h: 'Before you cancel: export your trips',
        p: [
          'Because exports sit in the paid plans, download your CSV and PDF reports for the whole tax year while Starter or Professional is still active, and keep them with your return.',
          'On a free trial, Everlance\'s FAQ says to call to cancel before the 7 days end, that it emails a reminder two days before the trial finishes, and that you can carry on with the free Basic plan with your previously recorded trips and transactions.'
        ]
      },
      {
        h: 'When Everlance is the better choice',
        p: [
          'If you want income, expenses and mileage in one app with bank and card feeds, or you want tax filing and audit defense bundled, Everlance Professional covers jobs a mileage log cannot. Even Basic includes receipt photo capture. A mileage-only tool is the cheaper choice only when mileage is the part you use.'
        ]
      },
      {
        h: 'Where this generator fits',
        p: [
          'MileageLogMaker does one job: the mileage log. You enter each trip\'s date, destination, purpose and miles, and download a PDF with the year\'s totals and the deduction at the IRS rate for each trip\'s date. A Canadian version builds a CRA kilometre logbook and a UK version an HMRC log, each with its own rates.',
          'Nothing tracks in the background, so it suits drivers whose trips are regular enough to log once a week. The free PDF has a light &ldquo;Free version&rdquo; watermark; Pro ($9, paid once) removes it and adds Excel and CSV export.'
        ]
      }
    ],
    faq: [
      {
        q: 'How much does Everlance cost in 2026?',
        a: 'Basic is free with 30 automatically tracked trips a month. Starter is $89.99 a year or $10.99 a month. Professional is $119.99 a year or $19.99 a month and adds automatic expense tracking, tax filing and $1 million audit defense. Prices from everlance.com/pricing, checked October 9, 2026.'
      },
      {
        q: 'Does the free Everlance plan include exports?',
        a: 'Not according to its plan comparison: CSV and PDF exports are listed under Starter and Professional only. Basic does include IRS-compliant mileage logs and the web dashboard.'
      },
      {
        q: 'Which apps compete with Everlance for individual drivers?',
        a: 'MileIQ, TripLog and Driversnote all offer automatic mileage tracking with a free tier: 40 drives a month, unlimited tracking, and 15 trips a month respectively (checked October 9, 2026). For a log without an app, a generator like this one works if your trips are regular.'
      },
      {
        q: 'How do I cancel an Everlance trial?',
        a: 'Everlance\'s FAQ says to call to cancel before the 7-day trial ends, that it emails a reminder two days before, and that you can keep using the free Basic plan with your recorded trips and transactions.'
      }
    ]
  }
};

Object.assign(NICHE_PAGES, require('./pages-core.js'));

module.exports = NICHE_PAGES;
