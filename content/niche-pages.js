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
  'mileiq-alternative': {
    title: 'Free MileIQ Alternative 2026: No Subscription, No App',
    h1: 'Free MileIQ Alternative (2026)',
    description: 'Looking for a MileIQ alternative after the 2026 price hike? This free mileage log generator requires no app, no signup, and no subscription. Instant IRS-ready PDF.',
    keyword: 'mileiq alternative',
    intro: 'MileIQ raised its Unlimited plan from $8.99 to $13.99 a month in 2026, and its free plan still stops at 40 drives a month. If you are looking for a MileIQ alternative that works without a subscription, this free mileage log generator creates IRS-compliant PDFs with no app to install, no account to create, and no monthly fee.',
    tips: [
      'No subscription: MileIQ Unlimited costs $13.99/month ($11.66/month billed annually), this tool is free',
      'No app install: works in any browser on phone, tablet, or computer',
      'No signup: MileIQ requires an account, this tool requires nothing',
      'No drive limit: MileIQ free caps at 40 drives/month, this has no cap',
      'IRS-compliant PDF: same required fields (date, destination, purpose, miles)',
      'Works for all professions: realtors, gig drivers, self-employed, contractors',
      'Your data stays in your browser: no cloud, no privacy concerns',
      'Pro upgrade is a single $9 payment, not a subscription'
    ],
    sections: [
      {
        h: 'Reasons to Look Beyond MileIQ in 2026',
        p: [
          'In 2026, MileIQ raised its Unlimited plan from $8.99 to <strong>$13.99 per month</strong> on monthly billing. Billed annually it is $11.66 per month, about $140 a year. The free tier is limited to 40 drives per month. Prices from mileiq.com/pricing, checked October 7, 2026.',
          'Price is only part of it. MileIQ is a <strong>mobile-only app</strong> that detects drives through your phone\'s location services, which some people do not want running all day. It auto-detects trips but you still classify each one as business or personal: a swipe for every drive. If you forget to swipe for a few days, you end up with a backlog of unclassified trips to sort through.',
          'Some self-employed workers and gig drivers ask a simple question: <strong>do I need to pay about $140 a year for something that still needs a swipe on every drive?</strong> If you can log trips weekly, you do not.'
        ]
      },
      {
        h: 'MileIQ vs This Free Generator: Side by Side',
        p: [
          '<strong>Automatic tracking:</strong> MileIQ uses GPS to auto-detect drives. This generator does not: you enter trips manually. If you want set-and-forget GPS tracking, MileIQ (or TripLog, which offers free unlimited auto-tracking in 2026) is the better fit. But if you are willing to spend 5 minutes per week logging trips, manual entry gives you a record where every entry has a specific business purpose, which is what the IRS looks for.',
          '<strong>Cost:</strong> MileIQ Unlimited costs $13.99/month ($11.66/month billed annually). Everlance Starter costs $8.99/month ($69.99/year). Driversnote Pro costs $11/month. Prices are from each vendor\'s pricing page, checked October 7, 2026. This generator is free, with an optional $9 <em>lifetime</em> Pro upgrade, which costs less than one month of MileIQ.',
          '<strong>Privacy:</strong> MileIQ detects drives through your phone\'s location services and stores trip data in its cloud. This generator stores your data locally in your browser. Nothing is uploaded to any server unless you choose to generate a PDF. If privacy matters to you, this keeps your trip data on your own device.',
          '<strong>Output:</strong> Both produce IRS-compliant mileage reports. MileIQ generates CSV and PDF reports from its dashboard. This generator produces a clean, professional PDF with all four IRS-required fields plus odometer readings and a deduction summary, ready to hand to your CPA or upload to TurboTax.'
        ]
      },
      {
        h: 'Who Should Switch from MileIQ?',
        p: [
          'This alternative is the best fit if you are <strong>cost-conscious</strong> (you do not want to pay about $140 a year for mileage tracking), if you drive a <strong>predictable number of business trips</strong> (and can log them weekly), or if you prefer a <strong>web tool</strong> over a phone app. It works especially well for real estate agents who log showings, gig drivers who track delivery routes, and self-employed professionals with regular client visits.',
          'If you rely heavily on automatic GPS detection because you drive dozens of unpredictable trips per day and never want to open a log, consider TripLog (free unlimited auto-tracking) or Stride (free). But if you want a simple way to build an IRS-ready mileage log without installing anything or creating an account, this is it.'
        ]
      }
    ],
    faq: [
      {
        q: 'Is there a truly free alternative to MileIQ?',
        a: 'Yes. This mileage log generator is completely free with no drive limit, no signup, and no subscription. TripLog also offers free unlimited automatic tracking on its Basic plan, and Stride is free (app-based). MileIQ free tier limits you to 40 drives per month.'
      },
      {
        q: 'How much does MileIQ cost in 2026?',
        a: 'MileIQ Unlimited costs $13.99 per month on monthly billing ($167.88 per year), or $11.66 per month billed annually. That is up from $8.99 a month earlier in 2026. The free plan is limited to 40 drives per month. Prices from mileiq.com/pricing, checked October 7, 2026.'
      },
      {
        q: 'Can I import my MileIQ data into another tracker?',
        a: 'Yes. In MileIQ, go to Reports, create a report with all your mileage data, and export it as a CSV file. You can keep this for your records or import it into another tracking solution. Your historical data belongs to you.'
      },
      {
        q: 'Is a manual mileage log as good as an app for IRS purposes?',
        a: 'Yes. The IRS does not require any specific format or software. A manual log with date, destination, purpose, and miles, kept at or near the time of each trip, is fully compliant. What matters is the content: a specific business purpose on every entry, whether the log came from an app or from this generator.'
      },
      {
        q: 'What is the best free mileage tracker overall?',
        a: 'It depends on your needs. For automatic GPS tracking at no cost, look at the free TripLog Basic plan. For a simple web-based log with no app or signup, use this generator. For a free expense and mileage tracker, look at Stride.'
      }
    ]
  },
  'everlance-alternative': {
    title: 'Free Everlance Alternative 2026: No Monthly Fee',
    h1: 'Free Everlance Alternative (2026)',
    description: 'Looking for an Everlance alternative without a monthly fee? Free mileage log generator with no app, no signup. IRS-compliant PDF in 3 minutes.',
    keyword: 'everlance alternative',
    intro: 'Everlance Starter costs $8.99 a month or $69.99 a year, and its free plan detects 30 trips a month automatically (everlance.com/pricing, checked October 7, 2026). If you just need a simple, IRS-compliant mileage log without paying $69.99 a year, this free generator produces the same output with no app, no account, and no subscription. Enter your trips, download your PDF, and you are done.',
    tips: [
      'Everlance Starter costs $8.99/month ($69.99/year): this tool is free, Pro is a single $9 payment',
      'No app to install: Everlance requires iOS/Android download',
      'No bank sync needed: Everlance connects to your bank, this tool does not',
      'Same IRS-compliant output: date, destination, purpose, miles, deduction',
      'No cloud storage: your data stays in your browser, not on Everlance servers',
      'Works for all tax situations: self-employed, gig, real estate, employee',
      'Generate PDF in 3 minutes: no weekly swiping or trip classification',
      'Canadian kilometre logbook (CRA) and UK HMRC versions included'
    ],
    sections: [
      {
        h: 'Everlance vs This Free Generator',
        p: [
          '<strong>Everlance</strong> is a full-featured mileage and expense tracker with automatic GPS detection, bank account syncing, receipt scanning, and, on its Professional plan, in-app tax filing. It suits people who want everything in one place. The trade-off is cost (Starter is $8.99/month), complexity, and sharing location and bank data with a cloud service if you use those features.',
          'This <strong>free generator</strong> does one thing well: it builds an IRS-compliant mileage log PDF. No GPS, no bank sync, no expense categories: just the four fields the IRS requires (date, destination, purpose, miles) plus a calculated deduction. If you only need a mileage log and not a full financial platform, this is the faster, simpler, and cheaper option.',
          'Both produce IRS-acceptable output. The difference is whether you want a <strong>full financial platform</strong> (Everlance) or a <strong>focused mileage tool</strong> (this generator). Self-employed people who already use QuickBooks, FreshBooks, or a CPA for their finances may only need the mileage log, not another financial app.'
        ]
      }
    ],
    faq: [
      {
        q: 'Is Everlance worth the price in 2026?',
        a: 'Everlance is worth it if you use its full feature set: mileage tracking, expense management, bank syncing, and tax filing. If you only need a mileage log for IRS deductions, a free alternative that produces a comparable PDF saves you the $69.99 a year Starter price.'
      },
      {
        q: 'Can I use this generator for a CRA logbook in Canada?',
        a: 'Yes. The CRA version logs kilometres and calculates your business-use percentage for Form T2125 (self-employed people deduct that share of actual vehicle costs). It also shows the 2026 CRA allowance rates of 73 cents for the first 5,000 km and 67 cents after, which apply to employer allowances.'
      },
      {
        q: 'Can I cancel Everlance and keep my data?',
        a: 'Yes. Export your mileage reports from Everlance before cancelling. You can download CSV or PDF reports from your Everlance dashboard. Once exported, you own that data and can reference it for future tax filings.'
      }
    ]
  }
};

Object.assign(NICHE_PAGES, require('./pages-core.js'));

module.exports = NICHE_PAGES;
