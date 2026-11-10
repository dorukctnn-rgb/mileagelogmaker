// SEO landing pages rendered by views/niche.ejs. Facts last checked against official sources on 2026-10-07.

const RATES = require('../lib/rates.js');

const NICHE_PAGES = {
  'mileage-log-2026-irs-rate': {
    updated: RATES.REVIEWED,
    updatedText: RATES.REVIEWED_TEXT,
    updatedNote: 'The rates were compared with the IRS rate table that day',
    checkedNote: 'The IRS rate table (page updated July 28, 2026) was compared with every rate on this page on ' + RATES.REVIEWED_TEXT + '.',
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
    updated: RATES.REVIEWED,
    updatedText: RATES.REVIEWED_TEXT,
    updatedNote: 'Publication 463 and the IRS penalty page were re-read on irs.gov that day',
    checkedNote: 'Publication 463 (chapter 5) and the IRS accuracy-related penalty page were re-read on irs.gov on ' + RATES.REVIEWED_TEXT + '; the IRS rate table was compared the same day.',
    layout: 'article',
    title: 'Forgot to Track Mileage? What to Do Now (Rebuild a Log)',
    h1: 'Forgot to Track Mileage? What to Do Now',
    cardTitle: 'Forgot to Track Mileage? Here is What to Do', // keeps the related-card text on existing pages unchanged
    description: 'Forgot to track mileage? What the IRS accepts when a log is missing, which records rebuild each trip, and a free generator that applies the right rate.',
    keyword: 'forgot to track mileage',
    sources: ['pub463', 'irsRates', 'usc274', 'irsPenalty'],
    related: ['free-mileage-log-template', 'irs-mileage-log-requirements', 'irs-mileage-rate-history', 'mileage-log-self-employed', 'mileage-log-uber-drivers', 'mileage-log-doordash-drivers'],
    leadHtml: 'You are not the first person to reach tax season without a mileage log. Publication 463 lets you support missing records with a specific statement plus other evidence, such as calendars, invoices and platform trip histories. A rebuilt log is weaker than one kept at the time, so be specific and conservative. Below: what the IRS accepts, where each fact comes from, and how to rebuild the log step by step.',
    answerHtml: '<p><strong>You may still claim mileage if you can support each trip.</strong> Without a complete log, the IRS asks for your own specific written or oral statement plus other evidence that backs it up, such as calendars, invoices, bank records and app trip histories (Publication 463, chapter 5). Rebuild the log now, label it as reconstructed, and keep the evidence with it.</p>',
    sectionsBefore: [
      {
        h: 'What does the IRS accept when you have no log?',
        id: 'accepted',
        p: [
          'Publication 463 says that if you do not have complete records to prove an element of an expense, you must prove it with your own written or oral statement containing specific information, and other supporting evidence that is sufficient to establish the element. For the date and place of a trip, that evidence must be direct or documentary: receipts, invoices, platform records or written statements from people who know. For the business purpose, circumstantial evidence can do. The publication gives an example: the nature of your work, such as making deliveries, is circumstantial evidence that you used the car for business.',
          'The same publication says to record each use "at or near the time" and that a timely kept record "has more value than a statement prepared later". A log kept weekly counts as timely. Car expenses are covered by the strict substantiation rule in section 274(d) of the tax code, so round-number guesses are the one thing a rebuilt log cannot be built on.'
        ]
      },
      {
        h: 'Where can each fact in a rebuilt log come from?',
        id: 'sources',
        html: '<div class="table-wrap"><table class="data"><thead><tr><th>What the log needs</th><th>Evidence you can gather now</th></tr></thead><tbody>' +
          '<tr><td><strong>Date of each trip</strong></td><td>Calendar entries, dated invoices and job tickets, appointment emails, rideshare or delivery trip histories, toll and parking receipts</td></tr>' +
          '<tr><td><strong>Destination</strong></td><td>Client and supplier addresses on invoices, meeting invitations, your phone\'s location history if it was switched on</td></tr>' +
          '<tr><td><strong>Business purpose</strong></td><td>The invoice or email for the job; the nature of your work is accepted as circumstantial evidence of purpose</td></tr>' +
          '<tr><td><strong>Miles for each trip</strong></td><td>The route distance from a mapping tool for each documented address, checked against odometer readings</td></tr>' +
          '<tr><td><strong>Total miles for the year</strong></td><td>Odometer readings on oil-change, inspection and tire receipts near January 1 and December 31, or a dated photo of the dashboard</td></tr>' +
          '</tbody><caption>Elements as listed in IRS Publication 463, Table 5-1, for car expenses. Evidence column: examples, not an IRS list.</caption></table></div>'
      },
      {
        h: 'How do you rebuild a mileage log, step by step?',
        id: 'steps',
        html: '<ol><li><strong>Fix the odometer anchors.</strong> Find the readings closest to January 1 and today on service receipts, inspection reports or photos. The gap is your total miles for the period.</li>' +
          '<li><strong>List the business days.</strong> Work through your calendar, invoices, bank and card statements (fuel, tolls, parking) and platform earnings statements.</li>' +
          '<li><strong>Write one line per trip.</strong> Date, destination, business purpose and the miles for the route you actually drove, from a mapping tool.</li>' +
          '<li><strong>Cross-check.</strong> The business miles must fit inside the odometer total, and the pattern should match your fuel purchases and service intervals.</li>' +
          '<li><strong>Label it honestly.</strong> Write "Reconstructed on [date] from calendar, invoices and platform records" at the top and keep the evidence in one folder with the log.</li>' +
          '<li><strong>Keep a weekly log from today.</strong> A log that accounts for each week counts as timely kept.</li></ol>' +
          '<p>Enter the trips into the generator below and it applies the IRS rate for each trip\'s date: 72.5¢ for January 1 to June 30, 2026 and 76¢ from July 1 (earlier years are in the <a href="/irs-mileage-rate-history">rate history</a>). Prefer paper? Download a blank log from the <a href="/free-mileage-log-template">free mileage log templates</a>.</p>'
      },
      {
        h: 'What should you not do?',
        id: 'avoid',
        p: [
          'Do not fill in round numbers, add trips you cannot support, or date entries as if you wrote them at the time. The IRS adds an accuracy-related penalty of 20% of the part of an underpayment caused by negligence or a substantial understatement (IRS, accuracy-related penalty), and a deduction the records do not support is the usual cause.',
          'If you have good records for only some weeks, Publication 463 allows sampling: an adequate record for part of the year can prove the business use for the whole year, but only if other evidence shows that those weeks are representative of the rest.'
        ]
      }
    ],
    tips: [
      'Check Google Maps Timeline on your phone (if location history was on) for past trips',
      'Export Uber, Lyft and DoorDash trip summaries from your driver tax dashboard',
      'Scan calendar appointments for client visits and meetings',
      'Use bank and card statements showing gas, tolls and parking',
      'Find odometer readings on oil-change receipts near January 1 and December 31',
      'Once you have the evidence, enter the trips into the generator below and download a PDF'
    ],
    sections: [],
    faq: [
      { q: 'Can I still deduct mileage if I did not keep a log?', a: 'You can claim it if you can support it. Publication 463 says that with incomplete records you must prove each element with your own specific statement plus other supporting evidence. Rebuild the trips from calendars, invoices, bank records and platform histories, and keep that evidence.' },
      { q: 'Is a mileage log written after the fact acceptable?', a: 'Publication 463 says a record made at or near the time has more value than a later statement, but it also lets you prove the details with a statement and supporting evidence when records are incomplete. Label a rebuilt log as reconstructed and never date entries as if they were written at the time.' },
      { q: 'Do rideshare and delivery app histories count as a mileage log?', a: 'Treat them as evidence of dates and places, not as the log itself. They do not show the business purpose of every drive, the miles between jobs or your total miles for the year.' },
      { q: 'What mileage rate do I use for a rebuilt log?', a: 'The rate for the date of each trip: 72.5 cents per business mile from January 1 to June 30, 2026 and 76 cents from July 1, 2026; 70 cents for 2025 and 67 cents for 2024.' },
      { q: 'How do I prove my total miles for the year?', a: 'With odometer readings: oil-change, inspection or tire receipts close to January 1 and December 31, or a dated photo of the dashboard. Publication 463 lists the total miles for the year among the facts to record.' }
    ]
  },
  'irs-mileage-rate-history': {
    updated: RATES.REVIEWED,
    updatedText: RATES.REVIEWED_TEXT,
    updatedNote: 'Every rate in the table was compared with the IRS rate table that day',
    layout: 'article',
    title: 'IRS Mileage Rate History 2011-2026: Every Rate by Year',
    h1: 'IRS Mileage Rate History',
    blurb: 'Business, medical and charity rates since 2011',
    description: 'IRS standard mileage rates for every year from 2011 to 2026, with the mid-year changes of 2011, 2022 and July 2026: business, medical or moving, charity.',
    keyword: 'irs mileage rate history',
    intro: 'The IRS changed the standard mileage rate in the middle of the year three times since 2011: July 2011, July 2022 and July 2026. The table lists every business, medical or moving, and charity rate from 2011 to 2026, as published on irs.gov. Use the rate for the period in which you drove, which matters when you amend an older return or rebuild a past log.',
    answerHtml: '<p><strong>The IRS business mileage rate was 76¢ a mile from July 1, 2026 (72.5¢ before), 70¢ in 2025, 67¢ in 2024 and 65.5¢ in 2023.</strong> Medical and moving miles are 23.5¢ from July 1, 2026 (20.5¢ before); the charity rate stays at 14¢. Use the rate for the year you drove, not the year you file.</p>',
    sources: ['irsRates', 'irsNotice', 'irsMidyear'],
    extraSources: [
      { label: 'IR-2024-312, December 19, 2024 (2025 rates)', url: 'https://www.irs.gov/newsroom/irs-increases-the-standard-mileage-rate-for-business-use-in-2025-key-rate-increases-3-cents-to-70-cents-per-mile' },
      { label: 'IR-2023-239, December 14, 2023 (2024 rates)', url: 'https://www.irs.gov/newsroom/irs-issues-standard-mileage-rates-for-2024-mileage-rate-increases-to-67-cents-a-mile-up-1-point-5-cents-from-2023' },
      { label: 'IR-2022-234, December 29, 2022 (2023 rates)', url: 'https://www.irs.gov/newsroom/irs-issues-standard-mileage-rates-for-2023-business-use-increases-3-cents-per-mile' }
    ],
    checkedNote: 'The rate table was compared line by line with the IRS table (page updated July 28, 2026) on ' + RATES.REVIEWED_TEXT + '. The 2027 rates had not been announced.',
    related: ['mileage-log-2026-irs-rate', 'irs-mileage-log-requirements', 'forgot-to-track-mileage', 'free-mileage-log-template', 'mileage-log-self-employed'],
    sectionsBefore: [
      {
        h: 'Standard mileage rates by year (cents per mile)',
        id: 'table',
        html: '<div class="table-wrap"><table class="data"><thead><tr><th>Period</th><th class="num">Business</th><th class="num">Medical or moving</th><th class="num">Charity</th></tr></thead><tbody>' +
          RATES.IRS_HISTORY.map(r => '<tr><td>' + r[0] + '</td><td class="num">' + r[1] + '</td><td class="num">' + r[2] + '</td><td class="num">' + r[3] + '</td></tr>').join('') +
          '</tbody><caption>Source: IRS, standard mileage rates for all years, read on ' + RATES.REVIEWED_TEXT + '.</caption></table></div><p>Moving rates apply only to active-duty members of the Armed Forces moving under orders and, from 2026, certain members of the intelligence community. The charity rate is fixed by law at 14 cents.</p>' +
          '<p>To price trips from 2024 to 2026 at the rate for each trip date, use the <a href="/mileage-reimbursement-calculator">mileage reimbursement calculator</a>. The current year is explained on the <a href="/mileage-log-2026-irs-rate">2026 IRS mileage rate</a> page, and medical trips on the <a href="/medical-mileage-deduction">medical mileage rate</a> page.</p>'
      }
    ],
    tips: [
      '2026: 72.5¢ business for Jan 1 to Jun 30, 76¢ from Jul 1',
      '2025: 70¢ business, 21¢ medical, 14¢ charity',
      '2024: 67¢ business, 21¢ medical, 14¢ charity',
      '2022: 58.5¢ for Jan to Jun, 62.5¢ for Jul to Dec',
      'Use the rate for the date driven, not the date you file'
    ],
    sections: [],
    faq: [
      { q: 'What was the IRS mileage rate in 2025?', a: 'For business driving, 70 cents a mile for the whole of 2025. The medical and moving rate was 21 cents and the charity rate 14 cents (IR-2024-312).' },
      { q: 'What was the IRS mileage rate in 2024?', a: 'For business driving, 67 cents a mile. The medical and moving rate was 21 cents and the charity rate 14 cents (IR-2023-239).' },
      { q: 'What was the IRS mileage rate in 2023?', a: 'For business driving, 65.5 cents a mile; medical and moving 22 cents; charity 14 cents (IR-2022-234).' },
      { q: 'What was the IRS mileage rate in 2022?', a: 'It changed in July: 58.5 cents a business mile from January 1 to June 30 and 62.5 cents from July 1 to December 31. Medical and moving were 18 cents, then 22 cents.' },
      { q: 'Which IRS mileage rate applies to the first half of 2026?', a: '72.5 cents a business mile for driving from January 1 to June 30, 2026 (Notice 2026-10), 20.5 cents for medical and moving, and 14 cents for charity. From July 1, 2026 the business rate is 76 cents and the medical and moving rate 23.5 cents.' },
      { q: 'When does the IRS announce the next year\'s mileage rate?', a: 'In each of the last five years between December 14 and December 29. The 2027 rates had not been announced on ' + RATES.REVIEWED_TEXT + '.' },
      { q: 'Does the charity mileage rate ever change?', a: 'Not by IRS announcement: it is set by law at 14 cents a mile and is the same in every year in the table.' }
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
