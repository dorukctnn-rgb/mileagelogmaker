// Rewritten landing pages for the main search clusters (Search Console, Oct 2026).
// Facts checked on 2026-10-07 against irs.gov, canada.ca and gov.uk (see lib/rates.js SOURCES).

const T = {
  usXlsx: { href: '/templates/mileage-log-template-2026.xlsx', fmt: 'XLSX', title: 'Mileage log template 2026', sub: 'Excel or Google Sheets. Miles from odometer, IRS rate by date.' },
  usPdf: { href: '/templates/mileage-log-template-2026.pdf', fmt: 'PDF', title: 'Printable mileage log', sub: 'Letter size, 21 trips per page, two pages.' },
  reXlsx: { href: '/templates/real-estate-mileage-log-template.xlsx', fmt: 'XLSX', title: 'Real estate mileage log', sub: 'Property address, MLS # and client columns.' },
  rePdf: { href: '/templates/real-estate-mileage-log-template.pdf', fmt: 'PDF', title: 'Printable real estate log', sub: 'For showings, listings, open houses, closings.' },
  rsXlsx: { href: '/templates/rideshare-delivery-mileage-log-template.xlsx', fmt: 'XLSX', title: 'Rideshare and delivery log', sub: 'One row per shift: odometer out and in, app miles.' },
  rsPdf: { href: '/templates/rideshare-delivery-mileage-log-template.pdf', fmt: 'PDF', title: 'Printable shift log', sub: 'Keep it in the car, fill in at each shift.' },
  craXlsx: { href: '/templates/cra-vehicle-logbook-template.xlsx', fmt: 'XLSX', title: 'CRA vehicle logbook (Excel)', sub: 'Kilometres, business-use %, expenses, simplified logbook.' },
  craPdf: { href: '/templates/cra-vehicle-logbook-template.pdf', fmt: 'PDF', title: 'Printable CRA logbook', sub: 'Letter size, odometer and km columns.' }
};

const UPDATED = '2026-10-07';

module.exports = {
  'irs-mileage-log-requirements': {
    updated: UPDATED,
    layout: 'article',
    title: 'IRS Mileage Log Requirements (2026) + Sample Log',
    h1: 'IRS Mileage Log Requirements',
    blurb: 'What a compliant log must record, with a sample',
    description: 'What the IRS requires in a mileage log: date, destination, business purpose, miles and total annual miles, kept at or near the time. Sample log, free template and generator.',
    keyword: 'irs mileage log requirements',
    leadHtml: 'To deduct car expenses, the IRS expects a written record of each business trip: the <strong>date</strong>, your <strong>destination</strong>, the <strong>business purpose</strong> and the <strong>miles driven</strong>, plus the <strong>total miles</strong> you drove the car in the year. The record should be made at or near the time, and a log updated weekly counts.',
    ctaLabel: 'Create an IRS-ready log',
    purposePlaceholder: 'Client meeting: Q3 review with Acme Dental',
    sources: ['pub463', 'usc274', 'irsScheduleC', 'irsPenalty', 'irsRates', 'irsMidyear'],
    related: ['free-mileage-log-template', 'mileage-log-self-employed', 'forgot-to-track-mileage', 'mileage-log-2026-irs-rate', 'mileage-log-real-estate-agents', 'mileage-log-uber-drivers'],
    answerHtml: '<p><strong>Short answer:</strong> there is no official IRS mileage log form. Any log is acceptable (paper, spreadsheet, app or PDF) if it shows, for every business use of the car, the date, the business destination, the business purpose and the miles, and you also know the car\'s total miles for the year. Car expenses fall under the strict substantiation rules of section 274(d) of the tax code, so estimates are not enough.</p>',
    sectionsBefore: [
      {
        h: 'What the IRS requires in a mileage log',
        id: 'required-fields',
        p: ['IRS Publication 463, chapter 5, lists the elements you have to prove for car expenses (Table 5-1). Turned into a log, that means these fields:'],
        html: '<div class="table-wrap"><table class="data"><thead><tr><th>What to record</th><th>How often</th><th>Why the IRS asks for it</th></tr></thead><tbody>' +
          '<tr><td><strong>Date</strong> of the trip</td><td>Every trip</td><td>"Time" element: the date the car was used for business</td></tr>' +
          '<tr><td><strong>Destination</strong> (business stop, city or area)</td><td>Every trip</td><td>"Place" element: your business destination</td></tr>' +
          '<tr><td><strong>Business purpose</strong></td><td>Every trip</td><td>Shows the trip was for your trade or business, not personal</td></tr>' +
          '<tr><td><strong>Miles</strong> for that business use</td><td>Every trip</td><td>"Amount" element for the standard mileage rate</td></tr>' +
          '<tr><td><strong>Total miles</strong> driven in the year (odometer on Jan 1 and Dec 31)</td><td>Once a year</td><td>Lets the IRS check your business-use share; Schedule C Part IV asks for it</td></tr>' +
          '<tr><td><strong>Date the car was placed in service</strong> for business</td><td>Once per car</td><td>Required on Schedule C Part IV and Form 4562</td></tr>' +
          '<tr><td>Parking fees and tolls for business trips</td><td>When paid</td><td>Deductible on top of the standard mileage rate; keep receipts</td></tr>' +
          '</tbody></table></div>' +
          '<p>Odometer readings for every single trip are not required. The trip mileage is. Many people still note start and end odometer readings per trip because it makes the miles easy to prove, and the IRS example log in Publication 463 (Table 5-2, "Daily Business Mileage and Expense Log") has columns for them.</p>'
      },
      {
        h: 'When you have to write it down: "timely kept" records',
        id: 'contemporaneous',
        p: [
          'The IRS asks you to record the details "at or near the time" of the trip. You do not have to write each trip down the same day: Publication 463 says a log kept <strong>on a weekly basis</strong> that accounts for the week\'s use counts as a timely kept record.',
          'A log reconstructed months later is weaker evidence. If you missed some trips, you can still support them with your own detailed statement plus other evidence (calendar entries, invoices, delivery records), but that is harder than showing a log. See <a href="/forgot-to-track-mileage">what to do if you forgot to track mileage</a>.',
          '<strong>Sampling is allowed.</strong> You can keep an adequate record for part of the year (for example the first week of each month) and use it for the whole year, if you can show the sample periods are representative of your normal use.',
          '<strong>Regular routes are simpler.</strong> If the business purpose is clear from the circumstances, such as a sales or delivery route, Publication 463 lets you record the route length once and then log the date of each trip and your total miles for the year.'
        ]
      }
    ],
    sample: {
      h: 'Sample IRS mileage log',
      intro: 'This is what a compliant log looks like in practice. The columns follow the IRS example log in Publication 463; the year summary at the bottom is the part people most often forget.',
      head: ['Date', 'Start', 'Destination', 'Business purpose', 'Odometer start', 'Odometer end', 'Miles', 'Parking / tolls'],
      num: [4, 5, 6, 7],
      rows: [
        ['07/06/2026', 'Home office', 'Acme Dental, 410 Pine St, Austin', 'Quarterly bookkeeping review with client', '48,210', '48,224', '14', ''],
        ['07/06/2026', 'Acme Dental', 'Office Depot, N Lamar Blvd', 'Printer toner for the business', '48,224', '48,228', '4', ''],
        ['07/06/2026', 'Office Depot', 'Home office', 'Return to office', '48,228', '48,239', '11', ''],
        ['07/09/2026', 'Home office', 'Travis County permits office', 'File permit for Hill St client project', '48,301', '48,319', '18', '$6.00'],
        ['07/09/2026', 'Permits office', 'Home office', 'Return to office', '48,319', '48,337', '18', '']
      ],
      foot: ['Week total', '', '', '', '', '', '65', '$6.00'],
      caption: 'Year summary to keep with the log: odometer Jan 1, 2026: 41,050; Dec 31, 2026: 56,890; total 15,840 miles; business 9,420 miles (59.5%). 2026 trips before July 1 use 72.5¢ per mile, trips from July 1 use 76¢.'
    },
    templatesHeading: 'Free IRS mileage log templates',
    templatesIntro: 'Prefer to fill in a file? Both templates have every column above. The Excel version works out miles from the odometer and applies 72.5¢ or 76¢ by date.',
    templates: [T.usXlsx, T.usPdf],
    tipsHeading: 'IRS mileage log checklist',
    tips: [
      'Date, destination, business purpose and miles for every business trip',
      'Odometer reading on January 1 and December 31 (or when you start and stop using the car)',
      'A specific purpose ("site visit, Hill St remodel"), not just "business" or "work"',
      'Updated at least weekly, not rebuilt at tax time',
      'Commuting from home to your regular workplace logged as personal, not business',
      'Parking and toll receipts for business trips kept with the log',
      'Kept for at least 3 years after you file, longer if the car is depreciated'
    ],
    sections: [
      {
        h: 'Is there an IRS-approved or IRS-compliant mileage log?',
        id: 'irs-approved',
        p: [
          'The IRS does not approve or certify mileage logs, apps or templates. Its own example log in Publication 463 is marked "This is not an official Internal Revenue form." When a product calls itself "IRS-approved", it means the log records the elements the IRS asks for, nothing more.',
          'So the test for an "IRS-compliant" log is simple: could someone read it and see, trip by trip, when you drove, where, why, and how far, and could you show your total miles for the year? A paper notebook, a spreadsheet, a GPS app export and a PDF from this generator can all pass that test. An app export with blank purposes or a single annual estimate cannot.'
        ]
      },
      {
        h: 'What happens if you don\'t have a mileage log',
        id: 'no-log',
        p: [
          'Cars are "listed property", so section 274(d) of the tax code requires you to substantiate the expense with adequate records or sufficient evidence. The usual rule that lets a court estimate a deduction does not apply to these expenses. In practice, an examiner can disallow the whole mileage deduction when there is no log.',
          'You would then owe the extra tax plus interest, and the IRS can add a 20% accuracy-related penalty on the underpayment caused by negligence or a substantial understatement. Schedule C even asks directly, in Part IV, whether you have evidence to support the deduction and whether that evidence is written.',
          'If you are missing records for this year, start a proper log today and rebuild the past months from calendars, invoices and map history as carefully as you can.'
        ]
      },
      {
        h: 'How long to keep your mileage log',
        p: [
          'Keep the log and receipts for at least <strong>3 years from the date you file</strong> the return that claims the deduction (a return filed early counts as filed on the due date). If you depreciate the car under the actual expense method, keep business-use records for every year of the recovery period.'
        ]
      },
      {
        h: 'Standard mileage rate or actual expenses: you need the log either way',
        p: [
          'With the <strong>standard mileage rate</strong> you multiply business miles by the IRS rate: for 2026, 72.5¢ for miles driven January 1 to June 30 and 76¢ from July 1. With <strong>actual expenses</strong> you deduct the business share of gas, insurance, repairs and depreciation, and the business share comes from your log (business miles divided by total miles).',
          'If you want the standard rate for a car you own, choose it in the first year the car is used for business. For a leased car, you must keep using it for the whole lease. See <a href="/mileage-log-2026-irs-rate">the 2026 rate change</a> and <a href="/mileage-deduction-vs-actual-expenses">standard rate vs actual expenses</a>.'
        ]
      }
    ],
    faq: [
      { q: 'What are the IRS requirements for a mileage log?', a: 'For each business trip: the date, the business destination, the business purpose and the miles driven. For the year: the total miles you drove the car (odometer readings at the start and end of the year) and the date the car was placed in service for business. Record trips at or near the time; a weekly log counts as timely.' },
      { q: 'Is there an IRS-approved mileage log?', a: 'No. The IRS does not approve or certify any log, template or app. Its example log in Publication 463 is labeled "not an official Internal Revenue form." Any format is acceptable if it records the required elements.' },
      { q: 'Do I need odometer readings for every trip?', a: 'No. The IRS needs the miles for each business use and the total miles for the year. Odometer readings at the start and end of the year are the usual way to prove total miles. Per-trip readings are optional but make your miles easy to verify.' },
      { q: 'How often do I have to update my mileage log?', a: 'At or near the time of each trip. Publication 463 says a log maintained on a weekly basis that accounts for use during the week is considered a timely kept record.' },
      { q: 'Can I use a mileage tracking app or a spreadsheet?', a: 'Yes, as long as each business trip ends up with a date, destination, purpose and miles. GPS apps record date and distance automatically, but you still have to add the business purpose.' },
      { q: 'What happens if I get audited without a mileage log?', a: 'Car expenses must be substantiated under section 274(d), so the deduction can be disallowed. You would owe the tax plus interest, and possibly a 20% accuracy-related penalty. Calendars, invoices and other records can support a partial reconstruction, but they are weaker than a log kept at the time.' },
      { q: 'How long should I keep my mileage log?', a: 'At least 3 years from the date you filed the return that claims the deduction. If you depreciate the vehicle, keep business-use records for each year of the recovery period.' },
      { q: 'Do I need a mileage log if I use actual expenses instead of the standard rate?', a: 'Yes. Your deductible share of actual costs is your business miles divided by your total miles, and the log is how you prove both numbers.' }
    ]
  },

  'mileage-log-self-employed': {
    updated: UPDATED,
    title: 'Self-Employed Mileage Log: Free Printable Template 2026',
    h1: 'Mileage Log for Self-Employed People',
    blurb: 'Schedule C mileage, home office trips, template',
    description: 'Free printable mileage log template for self-employed people and freelancers, plus an online mileage log creator that applies the 2026 IRS rates for Schedule C.',
    keyword: 'self employed mileage log',
    leadHtml: 'If you are self-employed, business miles go on <strong>Schedule C, line 9</strong>, and the IRS expects a log to back them up. Download the printable template below, or use the mileage log creator to build a PDF with the 2026 rates applied automatically: 72.5¢ a mile before July 1, 76¢ from July 1.',
    purposePlaceholder: 'Client meeting: website kickoff with Bloom Bakery',
    sources: ['pub463', 'irsScheduleC', 'irsRates', 'irsMidyear'],
    related: ['irs-mileage-log-requirements', 'free-mileage-log-template', 'mileage-log-real-estate-agents', 'mileage-log-uber-drivers', 'mileage-log-construction-contractors', 'forgot-to-track-mileage'],
    answerHtml: '<p><strong>What you need:</strong> one row per business trip with the date, destination, business purpose and miles, plus your odometer at the start and end of the year. Fill it in at least weekly. At tax time, total your business miles, multiply by the IRS rate for when they were driven, and enter the result on Schedule C line 9. Schedule C Part IV also asks for your business, commuting and other miles, and whether you have written evidence.</p>',
    sample: {
      h: 'Example: a freelancer\'s week',
      head: ['Date', 'Destination', 'Business purpose', 'Miles', 'Rate', 'Amount'],
      num: [3, 4, 5],
      rows: [
        ['06/29/2026', 'Bloom Bakery, 22 Elm St', 'Website kickoff meeting', '16.4', '$0.725', '$11.89'],
        ['06/30/2026', 'UPS Store, Main St', 'Ship signed contracts to client', '5.2', '$0.725', '$3.77'],
        ['07/01/2026', 'Coworking space, 5th Ave', 'Client workshop (rented room)', '12.0', '$0.76', '$9.12'],
        ['07/02/2026', 'Bank of the West, Oak Rd', 'Deposit client checks', '3.1', '$0.76', '$2.36']
      ],
      foot: ['Total', '', '', '36.7', '', '$27.14'],
      caption: 'Each row is round-trip from a home office that is the principal place of business. The July 1 rate change splits this week across two rates.'
    },
    templatesHeading: 'Printable mileage log template for self-employed people',
    templatesIntro: 'The Excel file adds up miles and the deduction for you. The PDF is for a clipboard or glovebox; transfer the totals to Schedule C at year end.',
    templates: [T.usXlsx, T.usPdf],
    tipsHeading: 'What counts as business mileage when you work for yourself',
    tips: [
      'Trips to clients, customers and job sites',
      'Trips between two work locations on the same day',
      'Errands for the business: supplies, post office, bank deposits',
      'Trips to temporary work locations if you have a regular place of business elsewhere',
      'With a home office that is your principal place of business: trips from home to other work locations',
      'Not deductible: commuting from home to your regular office or shop'
    ],
    sections: [
      {
        h: 'Can self-employed people claim mileage from home to work?',
        id: 'home-to-work',
        p: [
          'It depends on where your business is based. Driving between your home and your <strong>main or regular place of work</strong> is personal commuting, even when you are self-employed and even if you take business calls on the way.',
          'But if your <strong>home office qualifies as your principal place of business</strong>, Publication 463 lets you deduct daily trips between home and another work location in the same business, whether that location is temporary or regular and however far it is. Many freelancers, consultants and tradespeople who run the business from home qualify; IRS Publication 587 explains the test.',
          'If you rent an office or workshop and drive there every day, that drive is commuting. Trips from the office to clients are business.'
        ]
      },
      {
        h: 'Using the mileage log creator',
        p: [
          'Add trips as you go (the list is saved in your browser), then click "Download PDF log" whenever you need a copy for your records or your accountant. Choose the tax year: for 2026 each trip gets 72.5¢ or 76¢ depending on its date, and the PDF shows both subtotals so the math is easy to check.',
          'If you use the <strong>actual expense method</strong> instead, the log still matters: enter personal trips too, or your odometer readings, and use the business-use share of total miles to split costs like fuel and insurance.',
          'Mileage is one line of Schedule C. If part of your self-employment income comes from Etsy, the platform fees are a second deductible line, and they sit in twelve separate monthly CSV statements. The free <a href="https://peakappsstudio.com/etsy-tax-summary/" rel="noopener">Etsy tax summary</a> reads those statements in your browser and totals the year\'s sales, refunds and every fee.'
        ]
      },
      {
        h: 'What the deduction is worth',
        p: [
          'The standard mileage amount reduces your Schedule C profit, so it lowers both self-employment tax (15.3% on 92.35% of net earnings) and income tax. For example, 8,000 business miles driven evenly through 2026 is 4,000 x $0.725 + 4,000 x $0.76 = <strong>$5,940</strong>. Business parking fees and tolls are deductible on top of that.'
        ]
      }
    ],
    faq: [
      { q: 'Do self-employed people need a mileage log?', a: 'Yes. To deduct car expenses on Schedule C you need records showing the date, destination, business purpose and miles of each business trip, plus total miles for the year. Schedule C Part IV asks whether you have written evidence.' },
      { q: 'Can self-employed people claim mileage from home to work?', a: 'Not to a regular office or shop: that is commuting. If your home office is your principal place of business, trips from home to other work locations in the same business are deductible.' },
      { q: 'Is there a printable mileage log template for self-employed people?', a: 'Yes. The free PDF on this page prints on letter paper with date, start, destination, purpose, odometer and miles columns. The Excel version calculates miles and the 2026 deduction by date.' },
      { q: 'What is the best mileage tracker for self-employed people?', a: 'The one you will keep up to date. GPS apps capture distance automatically but usually charge a subscription and still need a business purpose for each trip. A weekly log in a template or this free generator works if you note trips in your calendar as you go.' },
      { q: 'Where does the mileage deduction go on my tax return?', a: 'On Schedule C (Form 1040), line 9, car and truck expenses. You also complete Part IV with the date the vehicle was placed in service and your business, commuting and other miles.' }
    ]
  },

  'mileage-log-real-estate-agents': {
    updated: UPDATED,
    title: 'Real Estate Agent Mileage Log Template (Excel & PDF)',
    h1: 'Mileage Log for Real Estate Agents',
    blurb: 'Showings, listings, open houses: template + deduction',
    description: 'Free real estate mileage log template (Excel and printable PDF) with property address and client columns, plus what driving agents can deduct at the 2026 IRS rates.',
    keyword: 'real estate mileage log template',
    leadHtml: 'Showings, listing appointments, open houses, inspections and closings all add up. Download the real estate mileage log template below or log trips online, and the 2026 IRS rate is applied by date: 72.5¢ a mile before July 1, 76¢ from July 1.',
    purposePlaceholder: 'Showing: 123 Oak St with the Johnsons (MLS 4471825)',
    sources: ['pub463', 'irsScheduleC', 'irsRates', 'irsMidyear'],
    related: ['mileage-log-self-employed', 'irs-mileage-log-requirements', 'free-mileage-log-template', 'mileage-log-2026-irs-rate', 'mileage-deduction-vs-actual-expenses', 'forgot-to-track-mileage'],
    answerHtml: '<p><strong>For agents paid on commission as independent contractors</strong>, driving for your real estate business is deductible on Schedule C: showings, listing appointments, open houses, broker tours, inspections, appraisals and closings. Each trip needs the date, destination, business purpose and miles. Put the property address or MLS number in the purpose so the trip matches your showing records.</p>',
    templatesHeading: 'Real estate mileage log template',
    templatesIntro: 'Columns for date, start, property address, MLS number or client, purpose, odometer and miles. The Excel version totals miles and applies the 2026 rate by date.',
    templates: [T.reXlsx, T.rePdf, T.usXlsx],
    sample: {
      h: 'Example real estate mileage log',
      head: ['Date', 'From', 'To (property / place)', 'Client or MLS #', 'Purpose', 'Miles'],
      num: [5],
      rows: [
        ['07/11/2026', 'Home office', '123 Oak St', 'Johnson / MLS 4471825', 'Showing', '8.6'],
        ['07/11/2026', '123 Oak St', '47 Birch Ln', 'Johnson / MLS 4470032', 'Showing', '3.9'],
        ['07/11/2026', '47 Birch Ln', 'Hilltop Title Co.', 'Ramirez closing', 'Closing', '6.2'],
        ['07/12/2026', 'Home office', '9 Lake View Dr', 'Chen listing', 'Open house, set up signs', '11.4'],
        ['07/12/2026', '9 Lake View Dr', 'Home office', 'Chen listing', 'Return from open house', '11.4']
      ],
      foot: ['Total', '', '', '', '', '41.5'],
      caption: 'At 76¢ a mile (trips from July 1, 2026) these 41.5 miles are worth $31.54. Your showing-service and MLS history back up each row.'
    },
    tipsHeading: 'Driving real estate agents can usually deduct',
    tips: [
      'Showings, including between properties on a showing tour',
      'Listing appointments and listing presentations',
      'Open houses, including sign and lockbox runs',
      'Broker tours and MLS caravans',
      'Inspections, appraisals, final walk-throughs and closings',
      'Trips to the title company, attorney or lender for a deal',
      'Not deductible: driving from home to your brokerage office if that office is your regular workplace'
    ],
    sections: [
      {
        h: 'Commuting to the brokerage vs working from home',
        p: [
          'Driving between your home and your regular place of work is commuting, which the IRS never allows. For an agent who works out of the brokerage office every day, the first trip from home to the office and the last trip home are personal.',
          'If your <strong>home office qualifies as your principal place of business</strong>, Publication 463 lets you deduct daily trips between home and other work locations in the same business, so a drive from home to a showing counts. Trips between two business stops, such as one showing to the next or the office to a closing, are deductible either way.'
        ]
      },
      {
        h: 'Mileage deductions for real estate agents: how to calculate it',
        id: 'deduction',
        p: [
          'Total your business miles for the year, split at July 1 for 2026, and multiply: miles before July 1 x $0.725, miles from July 1 x $0.76. For example, 6,000 miles in each half of 2026 is $4,350 + $4,560 = <strong>$8,910</strong>. Add business parking and tolls. The total goes on Schedule C line 9.',
          'The alternative is the actual expense method: the business share of fuel, insurance, repairs, lease payments and depreciation. It can be larger for an expensive vehicle, but it needs every receipt and the same mileage log to prove the business share. If you own the car and want the standard rate, choose it in the first year you use the car for business.',
          'Most licensed agents paid on commission under a written contract are treated as independent contractors (statutory nonemployees) and file Schedule C. If you are a salaried W-2 employee of a brokerage, unreimbursed mileage is not deductible on your federal return; ask about reimbursement under an accountable plan instead.'
        ]
      },
      {
        h: 'How to track showing mileage without an app subscription',
        p: [
          'Most agents already have a record of where they went: the showing schedule, the MLS showing history, the calendar and closing statements. The easiest workflow is to copy those into your log once a week. Publication 463 treats a weekly log as timely, and the showing records corroborate it.',
          'GPS apps capture the distance automatically but still need you to tag each trip with a purpose, and they usually cost a monthly fee. A template or this generator does the job if you keep the weekly habit.',
          'How many miles does an agent drive? There is no official figure; it depends on your market, how spread out your listings are and how many buyers you show. Your own log is the only number the IRS will accept.'
        ]
      }
    ],
    faq: [
      { q: 'Can real estate agents deduct mileage?', a: 'Yes, if you are self-employed (most commission agents are). Business driving such as showings, listing appointments, open houses, inspections and closings is deductible on Schedule C, line 9, at the standard mileage rate or as actual expenses.' },
      { q: 'Is driving to showings tax deductible?', a: 'Yes. Trips to and between showings are business trips. The trip from home is deductible if your home office is your principal place of business; if you normally start at the brokerage office, the home-to-office leg is commuting.' },
      { q: 'What should a real estate mileage log include?', a: 'Date, starting point, destination (property address), the business purpose (showing, listing appointment, closing) and miles. Adding the client name or MLS number makes each trip easy to match with your showing records.' },
      { q: 'What is the mileage rate for real estate agents in 2026?', a: 'The same IRS standard rate as other businesses: 72.5 cents per mile for business driving from January 1 to June 30, 2026, and 76 cents per mile from July 1, 2026.' },
      { q: 'What is the best mileage tracker for real estate agents?', a: 'The one you will keep current. Apps record distance automatically but need a purpose for each trip and usually a subscription. A weekly log built from your showing schedule, in a template or this free generator, is just as valid.' },
      { q: 'Do I need to track personal miles too?', a: 'With the standard rate you only deduct business miles, but you should know your total miles for the year (odometer readings on January 1 and December 31). Schedule C Part IV asks for business, commuting and other miles.' }
    ]
  },

  'mileage-log-uber-drivers': {
    updated: UPDATED,
    title: 'Rideshare Mileage Log for Taxes: Uber & Lyft (Free)',
    h1: 'Rideshare Mileage Log for Uber and Lyft Drivers',
    blurb: 'Online miles, offline miles and a shift log template',
    description: 'Free rideshare mileage log for Uber and Lyft taxes: what your tax summary\'s online miles cover, what else to log, a per-shift template and the 2026 IRS rates.',
    keyword: 'rideshare mileage log',
    leadHtml: 'Uber\'s tax summary lists your <strong>online miles</strong>, but it is not a mileage log and it does not see the miles you drive with the app off. Keep a simple per-shift log, download the template, or enter shifts below and get a PDF with the 2026 IRS rates applied: 72.5¢ a mile before July 1, 76¢ from July 1.',
    purposePlaceholder: 'Uber shift: rides and waiting for requests, downtown',
    sources: ['pub463', 'uberTax', 'irsRates', 'irsMidyear', 'irsSE'],
    related: ['mileage-log-lyft-drivers', 'mileage-log-doordash-drivers', 'tax-deductions-for-uber-lyft-drivers', 'irs-mileage-log-requirements', 'mileage-log-amazon-flex', 'forgot-to-track-mileage'],
    answerHtml: '<p><strong>How to log rideshare miles:</strong> one row per shift is enough. Write the date, the odometer when you leave and when you get back, the area you drove and the purpose ("Uber: rides and waiting for requests"). Publication 463 lets you record an uninterrupted stretch of business use as a single entry. Keep the app\'s tax summary and trip history as backup.</p>',
    templatesHeading: 'Rideshare mileage log template',
    templatesIntro: 'One row per shift: date, platform, odometer out and in, total shift miles, the app\'s online miles and notes. Works for Uber, Lyft and delivery apps.',
    templates: [T.rsXlsx, T.rsPdf],
    sample: {
      h: 'Example rideshare shift log',
      head: ['Date', 'Platform', 'Area / purpose', 'Odometer out', 'Odometer in', 'Shift miles', 'App online miles'],
      num: [3, 4, 5, 6],
      rows: [
        ['07/17/2026', 'Uber', 'Rides and waiting for requests, downtown and airport', '61,204', '61,331', '127', '118'],
        ['07/18/2026', 'Lyft', 'Rides and waiting for requests, east side', '61,331', '61,402', '71', '64'],
        ['07/19/2026', 'Uber', 'Airport runs, repositioning between rides', '61,450', '61,598', '148', '139']
      ],
      foot: ['Total', '', '', '', '', '346', '321'],
      caption: 'The gap between shift miles and app online miles is mostly driving to the first request and home after the last one. See the commuting note below before deducting it.'
    },
    tipsHeading: 'What the online miles in your Uber tax summary include',
    tips: [
      'Miles while waiting for your next ride or delivery',
      'Miles driven to the pickup address',
      'Miles on the trip itself',
      'Not included: miles with the app off, such as driving to the area where you go online or home after your last trip'
    ],
    sections: [
      {
        h: 'Which rideshare miles can you deduct?',
        p: [
          'Online miles (waiting, driving to pickups and on-trip) are business miles for a rideshare driver, and they are the bulk of most drivers\' deduction. Trips for the business with the app off also count: driving to a car wash or oil change for the car you drive for Uber, or to a required vehicle inspection.',
          'The drive from home to the place you start accepting rides, and home again at the end, is the gray area. The IRS commuting rules depend on whether you have a regular place of business; if you do not, Publication 463 says you can generally only deduct trips to a temporary work location outside your metropolitan area. If your home office is your principal place of business for the rideshare work, trips from home are business. Log these miles separately so you or your preparer can decide, rather than mixing them into online miles.'
        ]
      },
      {
        h: 'Uber mileage log for taxes: turning the log into a deduction',
        p: [
          'Add up business miles for the year, split at July 1 for 2026, and multiply by the IRS rate: miles before July 1 x $0.725, miles from July 1 x $0.76. For example, 9,000 miles in each half of 2026 is $6,525 + $6,840 = <strong>$13,365</strong>. Business parking and tolls you paid yourself are deductible on top. Report it on Schedule C line 9.',
          'The standard rate already covers gas, maintenance, insurance and depreciation, so you cannot also deduct those. Phone costs, the business share of your data plan and supplies for riders are separate deductions.',
          'Because the deduction lowers self-employment tax (15.3% on 92.35% of net earnings) as well as income tax, each mile you fail to log costs more than your income tax bracket suggests.'
        ]
      }
    ],
    faq: [
      { q: 'Is Uber\'s tax summary a mileage log?', a: 'No. It is a useful record of your online miles (waiting, en route to pickups and on trip), but it does not list dates, destinations and purposes per trip, and it does not include miles you drive with the app off. Keep your own log and use the summary as backup.' },
      { q: 'What is the best way to keep a rideshare mileage log?', a: 'One row per shift: date, odometer out, odometer in, area and purpose. Publication 463 allows a single record for uninterrupted business use. Add separate rows for business errands with the app off.' },
      { q: 'Can I deduct the miles from home to my first ride?', a: 'It depends on the commuting rules. If you have no regular place of business, trips from home within your metro area are generally not deductible; if your home is your principal place of business, they are. Log them separately and decide with your preparer.' },
      { q: 'What mileage rate do Uber and Lyft drivers use for 2026?', a: 'The IRS standard mileage rate: 72.5 cents per mile for miles driven January 1 to June 30, 2026, and 76 cents per mile from July 1, 2026.' },
      { q: 'Can I deduct gas and the standard mileage rate?', a: 'No. The standard mileage rate replaces gas, maintenance, insurance and depreciation. You can deduct business parking and tolls on top of it.' }
    ]
  },

  'mileage-log-doordash-drivers': {
    updated: UPDATED,
    title: 'DoorDash Mileage Log & Deduction Calculator (2026)',
    h1: 'DoorDash Mileage Log and Deduction Calculator',
    blurb: 'Calculator, example log and what delivery miles count',
    description: 'Free DoorDash mileage deduction calculator with the 2026 IRS rates, an example dash log, a printable delivery mileage template and a free log generator.',
    keyword: 'doordash mileage deduction calculator',
    leadHtml: 'Work out what your delivery miles are worth, then keep the log that proves them. The calculator uses the 2026 IRS rates (72.5¢ a mile before July 1, 76¢ from July 1). The same log works for Uber Eats, Grubhub, Instacart and Amazon Flex.',
    calculator: 'delivery',
    calcFirst: true,
    purposePlaceholder: 'DoorDash: deliveries and waiting for orders, midtown',
    sources: ['irsRates', 'irsMidyear', 'irsSE', 'pub463'],
    related: ['mileage-log-grubhub-drivers', 'mileage-log-uber-drivers', 'mileage-log-instacart-shoppers', 'mileage-log-amazon-flex', 'irs-mileage-log-requirements', 'tax-deductions-for-uber-lyft-drivers'],
    templatesHeading: 'Delivery driver mileage log template',
    templatesIntro: 'One row per dash: date, platform, odometer out and in, total miles, the app\'s figure and notes.',
    templates: [T.rsXlsx, T.rsPdf],
    sample: {
      h: 'DoorDash mileage log example',
      head: ['Date', 'Platform', 'Area / purpose', 'Odometer out', 'Odometer in', 'Miles'],
      num: [3, 4, 5],
      rows: [
        ['07/20/2026', 'DoorDash', 'Dinner dash: deliveries and waiting for orders, midtown', '33,018', '33,071', '53'],
        ['07/21/2026', 'Grubhub', 'Lunch block: deliveries, north zone', '33,071', '33,105', '34'],
        ['07/22/2026', 'DoorDash', 'Car wash and oil change for delivery car', '33,140', '33,146', '6']
      ],
      foot: ['Total', '', '', '', '', '93'],
      caption: '93 miles x 76¢ = $70.68 of deduction for these three entries (all after July 1, 2026).'
    },
    tipsHeading: 'Delivery miles to log',
    tips: [
      'Miles while dashing: driving to restaurants, to customers and between orders',
      'Miles spent repositioning or waiting for orders while active',
      'Business errands for the delivery car: car wash, oil change, inspection',
      'Separately: home to your first pickup zone and back (commuting rules decide these)',
      'Keep app earnings summaries and screenshots as backup for the dates'
    ],
    sections: [
      {
        h: 'Does DoorDash or Grubhub track mileage for you?',
        p: [
          'Do not rely on any delivery app\'s mileage figure as your log. Whatever number an app shows covers only time it knows you were working, and it is not a record with dates, destinations and purposes. A one-line-per-dash log with odometer readings takes a minute and covers everything.',
          'If you drive for more than one app in a shift, one row for the shift is fine; note both platforms. Publication 463 lets you record an uninterrupted stretch of business driving as a single entry.'
        ]
      },
      {
        h: 'Standard mileage rate vs actual expenses for delivery drivers',
        p: [
          'Most delivery drivers use the standard rate because it is simple and generous for an economical car: the rate already covers fuel, maintenance, insurance and depreciation. You can deduct business parking and tolls on top of it, but not gas.',
          'Whichever method you use, the mileage log is what the IRS asks for if your deduction is questioned. For more on the rules, see <a href="/irs-mileage-log-requirements">IRS mileage log requirements</a>.'
        ]
      }
    ],
    faq: [
      { q: 'How do I calculate my DoorDash mileage deduction?', a: 'Multiply your business miles by the IRS rate for when you drove them. For 2026: miles from January 1 to June 30 x $0.725, plus miles from July 1 x $0.76. For 2025 it is miles x $0.70. Enter the total on Schedule C line 9.' },
      { q: 'How much tax does the mileage deduction save a Dasher?', a: 'Roughly the deduction x 92.35% x 15.3% in self-employment tax, plus the deduction x your income tax bracket. In the 12% bracket that is about 26 cents of tax for every dollar of deduction, before state tax. The calculator above does the math.' },
      { q: 'Can I deduct miles driven to my first delivery?', a: 'It depends on the commuting rules. If you have no regular place of business, trips from home within your metro area are generally treated as commuting; if your home office is your principal place of business, trips from home are business. Log them separately.' },
      { q: 'What should a DoorDash mileage log include?', a: 'For each dash: the date, the area you worked, the purpose (deliveries for DoorDash), odometer readings or miles, and any business errands. Keep your earnings summaries as backup.' },
      { q: 'Is there a free mileage tracker for DoorDash?', a: 'Yes. This generator is free with no signup: enter each dash and download a PDF. The free PDF has a light watermark; Pro ($9 one-time) removes it.' }
    ]
  },

  'mileage-log-grubhub-drivers': {
    updated: UPDATED,
    title: 'Grubhub Mileage Tracker & Log for Taxes (Free, 2026)',
    h1: 'Grubhub Mileage Tracker and Log',
    blurb: 'Track delivery miles and estimate the deduction',
    description: 'Free Grubhub mileage tracker and log: record each delivery block, estimate your deduction at the 2026 IRS rates and download a PDF or printable template.',
    keyword: 'grubhub mileage tracker',
    leadHtml: 'Grubhub drivers are independent contractors, so delivery miles are a Schedule C deduction at the IRS rate: 72.5¢ a mile before July 1, 2026 and 76¢ from July 1. Track each block below, or print the template and keep it in the car.',
    calculator: 'delivery',
    calcFirst: true,
    calcHeading: 'Grubhub mileage deduction calculator',
    purposePlaceholder: 'Grubhub block: deliveries, north zone',
    sources: ['irsRates', 'irsMidyear', 'irsSE', 'pub463'],
    related: ['mileage-log-doordash-drivers', 'mileage-log-uber-drivers', 'mileage-log-instacart-shoppers', 'mileage-log-amazon-flex', 'irs-mileage-log-requirements', 'free-mileage-log-template'],
    templates: [T.rsXlsx, T.rsPdf],
    templatesHeading: 'Printable delivery mileage log',
    tipsHeading: 'Grubhub miles to track',
    tips: [
      'Miles during a block: to restaurants, to customers and between orders',
      'Repositioning while you are available for orders',
      'Business errands for the delivery car',
      'Separately: home to your delivery zone and back (commuting rules decide these)',
      'Keep weekly earnings statements as backup for the dates'
    ],
    sections: [
      {
        h: 'Does Grubhub track mileage?',
        p: [
          'Do not count on the app as your mileage record. Whatever mileage a delivery app reports is not a log with dates, destinations and purposes, and it cannot see driving while you are offline. Record odometer readings at the start and end of each block; it takes seconds and covers everything.'
        ]
      }
    ],
    faq: [
      { q: 'Does Grubhub give drivers a mileage report?', a: 'Treat any app figure as backup only. The IRS wants a log with dates, destinations, purposes and miles, which you keep yourself.' },
      { q: 'What mileage rate do Grubhub drivers use?', a: 'The IRS standard mileage rate: 72.5 cents per mile from January 1 to June 30, 2026, and 76 cents per mile from July 1, 2026 (70 cents for 2025).' },
      { q: 'Can I deduct gas as a Grubhub driver?', a: 'Not if you use the standard mileage rate, which already includes fuel. With the actual expense method you deduct the business share of gas, repairs and insurance instead.' }
    ]
  },

  'cra-mileage-log-template': {
    updated: UPDATED,
    layout: 'article',
    title: 'CRA Mileage Log Book Template 2026 (Free PDF & Excel)',
    h1: 'CRA Mileage Log Book Template',
    blurb: 'Free kilometre logbook: Excel, PDF or online',
    description: 'Free CRA mileage log book template in Excel and printable PDF: date, destination, purpose, kilometres, odometer, business-use % and a simplified logbook calculator.',
    keyword: 'cra mileage log book template',
    region: 'ca',
    badge: 'Matches the CRA logbook rules, checked October 2026',
    leadHtml: 'A CRA vehicle logbook records the <strong>date</strong>, <strong>destination</strong>, <strong>purpose</strong> and <strong>kilometres</strong> of every business trip, plus your odometer at the start and end of the year. Download the free template, or fill it in online and download a PDF that works out your business-use percentage.',
    ctaLabel: 'Fill in the logbook online',
    purposePlaceholder: 'Client site visit: install for Maple Dental',
    calculator: 'cra-simplified',
    sources: ['craRecords', 'craSelfEmployed', 'craAllowance', 'craFinance2026', 'craRetention'],
    related: ['mileage-log-canada', 'free-mileage-log-template', 'irs-mileage-log-requirements', 'mileage-log-uk', 'mileage-log-self-employed', 'forgot-to-track-mileage'],
    answerHtml: '<p><strong>Is there an official CRA mileage log form?</strong> No. The CRA does not prescribe a form; it lists what your logbook must record. Any paper book, spreadsheet or PDF with those details is acceptable. The templates below have every field the CRA mentions.</p>',
    templatesHeading: 'Download the CRA logbook template',
    templatesIntro: 'The Excel file has four tabs: the logbook (km from odometer readings, business-use %), a vehicle expense sheet for Form T2125, the simplified logbook calculator and an allowance check for employers. The PDF is a printable kilometre log book.',
    templates: [T.craXlsx, T.craPdf],
    sample: {
      h: 'Example CRA logbook entries',
      head: ['Date', 'From', 'Destination', 'Purpose', 'Odometer start', 'Odometer end', 'Km'],
      num: [4, 5, 6],
      rows: [
        ['2026-03-02', 'Home office', 'Maple Dental, 88 King St W, Toronto', 'Software install and staff training', '52,310', '52,335', '25'],
        ['2026-03-02', 'Maple Dental', 'Home office', 'Return from client', '52,335', '52,360', '25'],
        ['2026-03-05', 'Home office', 'Staples, Yonge St', 'Printer paper and toner for business', '52,401', '52,409', '8']
      ],
      foot: ['Total', '', '', '', '', '', '58'],
      caption: 'Year summary: odometer Jan 1: 48,900; Dec 31: 70,400; total 21,500 km; business 9,890 km = 46.0% business use.'
    },
    sectionsBefore: [
      {
        h: 'What the CRA requires in a vehicle logbook',
        id: 'requirements',
        p: ['From the CRA\'s motor vehicle records page:'],
        html: '<ul><li>For each business trip: the <strong>date</strong>, the <strong>destination</strong>, the <strong>purpose</strong> and the <strong>number of kilometres</strong> you drive.</li>' +
          '<li>The <strong>odometer reading</strong> of each vehicle at the start and end of the fiscal period (January 1 and December 31 for most sole proprietors).</li>' +
          '<li>If you change vehicles during the year: the <strong>dates</strong> and the <strong>odometer readings</strong> when you buy, sell or trade.</li>' +
          '<li>Receipts for the vehicle expenses you claim.</li></ul>'
      }
    ],
    tipsHeading: 'Before you file',
    tips: [
      'Total business kilometres and total kilometres (odometer) for the year',
      'Business-use % = business km / total km',
      'Receipts for fuel, insurance, licence and registration, repairs, interest or lease',
      'Self-employed: claim on Form T2125; employees: Form T777 with a signed T2200',
      'Keep the logbook and receipts for six years from the end of the tax year'
    ],
    sections: [
      {
        h: 'Full logbook or simplified logbook?',
        id: 'simplified',
        p: [
          'A <strong>full logbook</strong> covers every business trip for the whole year. It is the safest record and it is required for your first year (the base year) if you want to use the simplified method later.',
          'The <strong>simplified logbook</strong>: after one complete year of logbook records (the base year), you can keep a logbook for a representative <strong>three-month period</strong> in later years and scale it with the formula in the calculator above, as long as the result stays within 10% of the base year. If it moves by more than 10%, the sample only supports those three months and you need records for the rest of the year or a new base year.'
        ]
      },
      {
        h: 'How the logbook is used on your return',
        p: [
          '<strong>Self-employed (Form T2125):</strong> you deduct the business-use share of your actual vehicle costs, for example (business km / total km) x total expenses, plus capital cost allowance. Self-employed people do not deduct a per-kilometre rate.',
          '<strong>Employees (Form T777):</strong> if your employer requires you to pay your own vehicle costs and signs Form T2200, you claim the employment-use share of your expenses on T777, minus any non-taxable allowance.',
          '<strong>Allowances:</strong> the CRA\'s reasonable per-kilometre rates for 2026 are 73¢ for the first 5,000 km and 67¢ after that (77¢ and 71¢ in Yukon, the Northwest Territories and Nunavut). They set the limit for tax-free allowances an employer pays, and employers will want a logbook to pay them. More detail on <a href="/mileage-log-canada">CRA mileage rules and rates</a>.'
        ]
      }
    ],
    faq: [
      { q: 'Is there an official CRA mileage log template?', a: 'No. The CRA does not publish a mandatory logbook form. It requires the date, destination, purpose and kilometres of each business trip, and odometer readings at the start and end of the fiscal period. Any template that records these is acceptable.' },
      { q: 'Can I keep my CRA logbook in Excel?', a: 'Yes. A spreadsheet is fine as long as it records the required details and you keep it with your receipts. The free Excel template on this page calculates kilometres and your business-use percentage.' },
      { q: 'What is the simplified logbook rule?', a: 'After a full 12-month base year, you can log a representative three-month period in later years. Annual business use = (sample period % / base year same-period %) x base year annual %. It must stay within 10% of the base year.' },
      { q: 'What is the CRA mileage rate for 2026?', a: 'The reasonable per-kilometre allowance rates for 2026 are 73 cents for the first 5,000 km and 67 cents for each additional km (77 and 71 cents in the territories). They apply to employer allowances, not to self-employed deductions.' },
      { q: 'How long do I keep my vehicle logbook?', a: 'Generally six years from the end of the last tax year the records relate to.' }
    ]
  },

  'mileage-log-canada': {
    updated: UPDATED,
    title: 'CRA Mileage Log 2026: Rules, Rates and How to Claim',
    h1: 'CRA Mileage Log: What to Record and How to Claim',
    blurb: '2026 rates, T2125 vs T777, allowances',
    description: 'How the CRA mileage log works in 2026: what to record, how self-employed people and employees claim vehicle expenses, the 73¢/67¢ allowance rates and a free online logbook.',
    keyword: 'cra mileage log',
    region: 'ca',
    leadHtml: 'Whether you are self-employed or an employee using your own car, the CRA bases your vehicle claim on a <strong>logbook</strong> of business trips. Here is what to record, how the log turns into a deduction, and the 2026 allowance rates. Log trips below and download a PDF with your business-use percentage, or get the <a href="/cra-mileage-log-template">printable CRA template</a>.',
    purposePlaceholder: 'Client meeting: quarterly review at Northwind Ltd',
    sources: ['craRecords', 'craSelfEmployed', 'craAllowance', 'craFinance2026', 'craRetention'],
    related: ['cra-mileage-log-template', 'mileage-log-uk', 'irs-mileage-log-requirements', 'mileage-log-self-employed', 'free-mileage-log-template', 'forgot-to-track-mileage'],
    answerHtml: '<p><strong>In short:</strong> record the date, destination, purpose and kilometres of every business trip, and your odometer at the start and end of the year. Self-employed people deduct the business-use share of actual vehicle costs on T2125. Employees with a signed T2200 claim on T777. The 73¢/67¢ per-km rates are for employer allowances.</p>',
    sections: [
      {
        h: 'CRA automobile allowance rates 2026 and 2025',
        id: 'rates',
        html: '<div class="table-wrap"><table class="data"><thead><tr><th>Year</th><th>Region</th><th class="num">First 5,000 km</th><th class="num">Each km after</th></tr></thead><tbody>' +
          '<tr><td>2026</td><td>Provinces</td><td class="num">$0.73</td><td class="num">$0.67</td></tr>' +
          '<tr><td>2026</td><td>Yukon, NWT, Nunavut</td><td class="num">$0.77</td><td class="num">$0.71</td></tr>' +
          '<tr><td>2025</td><td>Provinces</td><td class="num">$0.72</td><td class="num">$0.66</td></tr>' +
          '<tr><td>2025</td><td>Yukon, NWT, Nunavut</td><td class="num">$0.76</td><td class="num">$0.70</td></tr>' +
          '</tbody></table></div>' +
          '<p>These are the reasonable per-kilometre rates the CRA uses for tax-free allowances that employers pay employees. They are not a deduction rate for self-employed people.</p>'
      },
      {
        h: 'Self-employed: business-use percentage of actual costs',
        p: [
          'On Form T2125 you deduct (business km / total km) x your total vehicle expenses: fuel and oil, electricity for a zero-emission vehicle, insurance, licence and registration, maintenance and repairs, interest on the car loan and leasing costs. Capital cost allowance is calculated separately.',
          'Example: 9,890 business km out of 21,500 total km is 46.0%. If your vehicle costs for the year were $9,200, you deduct 46.0% x $9,200 = <strong>$4,232</strong>, plus the business share of capital cost allowance.',
          'For 2026 the limits are $39,000 (before tax) for capital cost allowance on passenger vehicles bought on or after January 1, 2026, $61,000 for zero-emission vehicles, $350 a month for interest on new car loans and $1,100 a month for new leases.'
        ]
      },
      {
        h: 'Employees: T777 and T2200',
        p: [
          'If your employment contract requires you to pay your own vehicle expenses and your employer signs Form T2200, you can claim the employment-use share of your costs on Form T777. Your logbook shows that share. Any non-taxable allowance you received reduces or rules out the claim.'
        ]
      },
      {
        h: 'Keeping the log for less than a full year',
        p: [
          'After one full base year, the CRA accepts a three-month sample logbook in later years if your business use stays within 10% of the base year. The <a href="/cra-mileage-log-template#simplified-logbook">simplified logbook calculator</a> does the formula for you.'
        ]
      }
    ],
    faq: [
      { q: 'What does the CRA require in a mileage log?', a: 'For each business trip: date, destination, purpose and kilometres. For each vehicle: odometer readings at the start and end of the fiscal period, and the dates and readings when you buy, sell or trade a vehicle.' },
      { q: 'Can self-employed people use the CRA per-kilometre rate?', a: 'No. Self-employed people deduct the business-use share of actual vehicle expenses on Form T2125. The per-kilometre rates (73 and 67 cents for 2026) apply to allowances employers pay to employees.' },
      { q: 'What is the CRA mileage rate for 2026?', a: '73 cents per km for the first 5,000 km and 67 cents per km after that in the provinces; 77 and 71 cents in Yukon, the Northwest Territories and Nunavut.' },
      { q: 'Where can I get a CRA mileage log book template?', a: 'Download the free Excel or printable PDF CRA logbook template, which also includes a business-use % calculation and the simplified logbook formula.' }
    ]
  },

  'mileage-log-uk': {
    updated: UPDATED,
    title: 'HMRC Mileage Log: Free Generator with 55p Rate (2026-27)',
    h1: 'UK Mileage Log for HMRC',
    blurb: '55p / 25p approved mileage rates',
    description: 'Free HMRC mileage log generator. Uses the approved mileage rates: 55p a mile for the first 10,000 business miles from 6 April 2026 (45p before), then 25p.',
    keyword: 'hmrc mileage log',
    region: 'uk',
    leadHtml: 'From the 2026 to 2027 tax year, HMRC\'s approved mileage rate for cars and vans is <strong>55p a mile</strong> for the first 10,000 business miles (it was 45p up to 5 April 2026), then 25p. Log your journeys below and download a PDF that applies the right rate by date and tax year.',
    purposePlaceholder: 'Site survey for client, Leeds',
    sources: ['hmrcRates', 'hmrcSimplified', 'ukRecords'],
    related: ['cra-mileage-log-template', 'mileage-log-canada', 'irs-mileage-log-requirements', 'free-mileage-log-template', 'mileage-log-self-employed', 'forgot-to-track-mileage'],
    sections: [
      {
        h: 'HMRC approved mileage rates',
        html: '<div class="table-wrap"><table class="data"><thead><tr><th>Vehicle</th><th class="num">First 10,000 business miles</th><th class="num">Over 10,000</th></tr></thead><tbody>' +
          '<tr><td>Cars and vans, from 6 April 2026 (2026-27)</td><td class="num">55p</td><td class="num">25p</td></tr>' +
          '<tr><td>Cars and vans, 2011-12 to 2025-26</td><td class="num">45p</td><td class="num">25p</td></tr>' +
          '<tr><td>Motorcycles</td><td class="num">24p</td><td class="num">24p</td></tr>' +
          '<tr><td>Bicycles</td><td class="num">20p</td><td class="num">20p</td></tr>' +
          '</tbody></table></div>' +
          '<p>Employers can pay up to these amounts tax-free (approved mileage allowance payments). If your employer pays less, you can claim tax relief on the difference. Self-employed people can use the same flat rates for cars, goods vehicles and motorcycles under simplified expenses (bicycles are not included there).</p>'
      },
      {
        h: 'What to record for each journey',
        p: [
          'Record the date, where you started and finished, the business reason and the miles for each business journey, and keep your total business miles for each tax year (6 April to 5 April) so you know when the 10,000-mile threshold is reached.',
          'Self-employed people must keep records for at least 5 years after the 31 January submission deadline of the relevant tax year.'
        ]
      }
    ],
    tipsHeading: 'Quick reference',
    tips: [
      'Cars and vans: 55p for the first 10,000 business miles in 2026-27, then 25p',
      'Up to 5 April 2026 the first-10,000 rate was 45p',
      'Motorcycles 24p and bicycles 20p per business mile',
      'The 10,000-mile threshold resets each tax year on 6 April',
      'Once you use simplified expenses for a vehicle, you keep using them for that vehicle'
    ],
    faq: [
      { q: 'What is the HMRC mileage rate for 2026-27?', a: '55p per mile for the first 10,000 business miles in a car or van and 25p per mile after that. Motorcycles are 24p and bicycles 20p.' },
      { q: 'Was the HMRC mileage rate 45p?', a: 'Yes, 45p applied to the first 10,000 business miles from the 2011-12 tax year up to 5 April 2026. From 6 April 2026 it is 55p.' },
      { q: 'How long do I keep my mileage records?', a: 'If you are self-employed, at least 5 years after the 31 January submission deadline of the relevant tax year.' }
    ]
  },

  'free-mileage-log-template': {
    updated: UPDATED,
    title: 'Free Mileage Log Template 2026 (Excel & Printable PDF)',
    h1: 'Free Mileage Log Template',
    blurb: 'Excel and printable PDF templates',
    description: 'Free mileage log templates: Excel with formulas for the 2026 IRS rates and printable PDFs for general business, real estate, rideshare and delivery, and CRA logbooks.',
    keyword: 'free mileage log template',
    layout: 'article',
    leadHtml: 'Download a blank mileage log in Excel or as a printable PDF. Every template has the columns the IRS asks for (date, destination, business purpose, miles) plus odometer readings. Rather type than print? The free generator builds the same log as a PDF.',
    ctaLabel: 'Use the online generator',
    sources: ['pub463', 'irsRates', 'irsMidyear', 'craRecords'],
    related: ['irs-mileage-log-requirements', 'mileage-log-self-employed', 'mileage-log-real-estate-agents', 'mileage-log-uber-drivers', 'cra-mileage-log-template', 'mileage-log-doordash-drivers'],
    templatesHeading: 'All free templates',
    templates: [T.usXlsx, T.usPdf, T.reXlsx, T.rePdf, T.rsXlsx, T.rsPdf, T.craXlsx, T.craPdf],
    sectionsBefore: [
      {
        h: 'Which template should I use?',
        html: '<ul><li><strong>General / self-employed:</strong> one row per trip with odometer columns. The Excel version applies 72.5¢ or 76¢ by date for 2026.</li>' +
          '<li><strong>Real estate agents:</strong> adds property address and client or MLS number.</li>' +
          '<li><strong>Rideshare and delivery:</strong> one row per shift with odometer out and in, plus the app\'s mileage figure.</li>' +
          '<li><strong>Canada:</strong> a CRA kilometre logbook with business-use %, an expense sheet and the simplified logbook formula.</li></ul>'
      }
    ],
    tipsHeading: 'Fill it in so it holds up',
    tips: [
      'Write the specific business purpose, not just "work"',
      'Note odometer readings on January 1 and December 31',
      'Update it at least weekly; a weekly log counts as timely',
      'Keep parking and toll receipts with the log',
      'Keep the log for at least 3 years after you file'
    ],
    sections: [],
    faq: [
      { q: 'Is a printed mileage log acceptable to the IRS?', a: 'Yes. The IRS does not require any particular format. A handwritten log is fine if it records the date, destination, business purpose and miles for each trip, kept at or near the time.' },
      { q: 'Does the Excel template work in Google Sheets?', a: 'Yes. Upload the .xlsx file to Google Drive and open it with Google Sheets; the formulas carry over.' },
      { q: 'Do the templates cost anything?', a: 'No. The templates and the online generator are free. Pro ($9 one-time) only adds a watermark-free PDF, Excel/CSV export of your logged trips and your logo.' }
    ]
  }
};
