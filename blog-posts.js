// Blog posts — long-form SEO content (1500+ words each)
// Each post targets a specific high-volume keyword cluster

const BLOG_POSTS = {

'how-to-deduct-mileage-on-taxes': {
  title: 'How to Deduct Mileage on Taxes in 2026 (Step-by-Step Guide)',
  description: 'Complete 2026 guide to deducting business mileage on your taxes. Learn the IRS standard mileage rate, what counts as business miles, and how to file Schedule C correctly.',
  keyword: 'how to deduct mileage on taxes',
  date: 'May 2026',
  read: '8 min',
  content: [
    {
      type: 'p',
      text: 'If you drive your personal vehicle for work (whether you are self-employed, a freelancer, an Uber driver, or a real estate agent), you may be missing a large deduction. For 2026 the IRS allows 72.5 cents for every business mile driven January to June and 76 cents from July 1, which means even a modest 10,000 business miles is worth roughly $7,250 to $7,600 in deductions. This guide walks you through exactly how to claim it.'
    },
    {
      type: 'h2',
      text: 'Who can deduct business mileage?'
    },
    {
      type: 'p',
      text: 'The mileage deduction is available to anyone who uses a personal vehicle for business purposes. This includes self-employed individuals filing Schedule C, gig economy drivers (Uber, Lyft, DoorDash, Instacart, Shipt, Amazon Flex), real estate agents, traveling salespeople, home health workers, contractors, and small business owners. As of the 2017 Tax Cuts and Jobs Act, W-2 employees can no longer deduct unreimbursed business mileage on their federal returns, but a few exceptions remain for armed forces reservists, qualifying performing artists, fee-basis state or local government officials, and some educator expenses.'
    },
    {
      type: 'h2',
      text: 'The two methods: standard mileage vs. actual expenses'
    },
    {
      type: 'p',
      text: 'The IRS gives you two ways to calculate your vehicle deduction. The standard mileage rate method multiplies your business miles by the IRS rate (72.5 cents through June 2026, 76 cents from July 1). The actual expenses method tracks every dollar you spend on the vehicle (gas, insurance, maintenance, depreciation, lease payments) and deducts the business-use percentage. For most people, the standard mileage rate is simpler and produces a similar or larger deduction. But if you drive an expensive vehicle with high actual costs, the actual expenses method may save more. You must choose the standard mileage rate in the first year you use the vehicle for business; otherwise you are locked into actual expenses for the life of that vehicle.'
    },
    {
      type: 'h2',
      text: 'What counts as a deductible business mile?'
    },
    {
      type: 'p',
      text: 'A business mile is any mile driven with a clear business purpose. This includes driving to client meetings, between job sites, to pick up supplies, to the post office for shipping, to networking events, and to the bank for business deposits. For rideshare and delivery drivers, every mile from the moment you go online (including driving to a high-demand area) until you go offline counts. What does NOT count: your regular commute from home to a fixed office. The first and last miles of your day to and from a regular workplace are personal commute miles, not business miles. However, if you have a qualifying home office, your home becomes your principal place of business, and trips from there to client locations are deductible.'
    },
    {
      type: 'h2',
      text: 'What records does the IRS require?'
    },
    {
      type: 'p',
      text: 'IRS Publication 463 requires four pieces of information for every business trip: the date, the destination, the business purpose, and the miles driven. You must also record your odometer reading at the start of the year and at the end of the year. Records must be "contemporaneous", meaning you log them at or near the time of the trip, not reconstructed at year-end. A weekly log is considered timely. The records can be kept on paper, in a spreadsheet, in an app, or as a PDF. The IRS does not require any specific format, only that all required information is present.'
    },
    {
      type: 'h2',
      text: 'How to file the deduction (Schedule C, line 9)'
    },
    {
      type: 'p',
      text: 'If you are self-employed, you report your mileage deduction on Schedule C, line 9 ("Car and truck expenses"). Multiply your business miles by the 2026 IRS rate for when they were driven: 72.5 cents January to June, 76 cents from July 1. For example, 6,000 miles before July × $0.725 = $4,350, plus 6,500 miles after × $0.76 = $4,940, for a $9,290 deduction. Add any parking fees and tolls (these are deductible separately on top of the mileage rate). You will also need to fill out Part IV of Schedule C, which asks for the total miles driven during the year, business miles, and personal miles. If you used more than one vehicle, attach a statement with the same information for each.'
    },
    {
      type: 'h2',
      text: 'Common mistakes that trigger audits'
    },
    {
      type: 'p',
      text: 'Vehicle deductions are easy to overstate, so they get a close look. Round numbers (exactly 10,000 miles, exactly 12,000 miles) look estimated rather than logged. Claiming 100% business use of a personal vehicle is rarely credible, since most people have at least some personal use. Claiming more business miles than the vehicle was actually driven (based on odometer readings) cannot be supported. Reconstructing a log at tax time without supporting evidence (calendar entries, client invoices, GPS data) often gets disallowed. The safest approach is to track contemporaneously, log specific destinations and purposes, and keep your odometer readings.'
    },
    {
      type: 'h2',
      text: 'Generate your IRS-ready log in 3 minutes'
    },
    {
      type: 'p',
      text: 'Use the free generator on this site to enter your trips and download an IRS-compliant PDF. It includes every field the IRS requires, calculates your deduction at the 2026 rate automatically, and saves to your browser so you can come back and add trips throughout the year. No signup, no credit card, no app to install.'
    }
  ]
},

'mileage-deduction-vs-actual-expenses': {
  title: 'Standard Mileage Rate vs. Actual Expenses: Which Saves More on Taxes?',
  description: 'Compare the IRS standard mileage rate (76¢/mile from July 2026, 72.5¢ before) to the actual expenses method. Calculate which deduction method puts more money in your pocket.',
  keyword: 'standard mileage vs actual expenses',
  date: 'May 2026',
  read: '7 min',
  content: [
    {
      type: 'p',
      text: 'The IRS lets you deduct vehicle expenses one of two ways: the standard mileage rate (72.5¢ per business mile January to June 2026, 76¢ from July 1) or the actual expenses method (every receipt, prorated by business use). One method takes 30 seconds to calculate. The other can take hours but sometimes saves thousands. Here is how to decide which is right for you.'
    },
    {
      type: 'h2',
      text: 'How the standard mileage rate works'
    },
    {
      type: 'p',
      text: 'You multiply your business miles by the IRS rate: 72.5¢ for 2026 miles through June 30, 76¢ from July 1. That is your deduction. You can also add parking fees and tolls on top. You do not deduct gas, insurance, maintenance, or depreciation separately because the standard rate already bakes those in. The math at the current rate: 12,000 business miles × $0.76 = $9,120 deduction.'
    },
    {
      type: 'h2',
      text: 'How actual expenses works'
    },
    {
      type: 'p',
      text: 'You track every dollar you spend on the vehicle: gas, oil, repairs, tires, insurance, registration, lease payments (or depreciation if owned), and car washes. Then you multiply the total by your business-use percentage. If you drove 20,000 miles total and 12,000 were for business, your business-use percentage is 60%. Your total annual vehicle cost was $9,500. Your deduction: $9,500 × 60% = $5,700.'
    },
    {
      type: 'h2',
      text: 'When standard mileage wins'
    },
    {
      type: 'p',
      text: 'Standard mileage usually wins for fuel-efficient vehicles, older paid-off cars, and high-mileage drivers. The 2026 rates (72.5¢, then 76¢ from July) are generous for cars that cost under 50¢/mile to actually operate. A Honda Civic owner driving 15,000 business miles per year will usually come out ahead with standard mileage. Rideshare and delivery drivers, freelancers using older vehicles, and anyone who drives a lot of miles in a cheap car should default to standard mileage.'
    },
    {
      type: 'h2',
      text: 'When actual expenses wins'
    },
    {
      type: 'p',
      text: 'Actual expenses usually wins for expensive vehicles, low-mileage drivers, and the first year of new car ownership. If you drive a $70,000 SUV for business, your actual depreciation alone in year one can exceed the standard mileage deduction. Real estate agents and consultants who drive luxury cars for client perception often benefit from actual expenses. Drivers who put fewer than 5,000 business miles on an expensive vehicle should run the numbers both ways.'
    },
    {
      type: 'h2',
      text: 'The lock-in rule you must know'
    },
    {
      type: 'p',
      text: 'Here is the trap: if you want the option to use standard mileage on a vehicle later, you MUST use standard mileage in the first year you place that vehicle in business service. Choose actual expenses in year one and you are locked into actual expenses forever for that vehicle. This rule does not apply in reverse: start with standard mileage, and you can switch to actual expenses any future year. For leased vehicles, the rule is stricter: whichever method you choose in year one applies for the entire lease, including renewals.'
    },
    {
      type: 'h2',
      text: 'How to actually decide'
    },
    {
      type: 'p',
      text: 'Run both calculations the first year. Track every receipt for actual expenses, AND log every business mile for standard mileage. At tax time, compare the two and take whichever is larger. After year one, keep tracking miles regardless. Even if you choose actual expenses, your business-use percentage depends on miles driven. Most people simplify after year one by sticking with standard mileage and tracking only miles plus parking and tolls.'
    }
  ]
},

'tax-deductions-for-uber-lyft-drivers': {
  title: 'Tax Deductions for Uber and Lyft Drivers: The 2026 Complete List',
  description: 'Every tax deduction available to Uber and Lyft drivers in 2026: mileage, phone bills, snacks for passengers, car washes, and more. Save thousands at tax time.',
  keyword: 'uber lyft driver tax deductions',
  date: 'May 2026',
  read: '8 min',
  content: [
    {
      type: 'p',
      text: 'Driving for Uber and Lyft makes you a 1099 independent contractor, which means you pay self-employment tax on every dollar earned, but you also get to deduct every legitimate business expense. The biggest deduction by far is mileage, but it is far from the only one. Here is the complete 2026 tax deduction list every rideshare driver should know.'
    },
    {
      type: 'h2',
      text: '1. Mileage (the big one)'
    },
    {
      type: 'p',
      text: 'At 76¢ per business mile (from July 1, 2026; 72.5¢ before), mileage is usually 60-80% of a rideshare driver\'s total deductions. Track every mile from going online to going offline, including drives to busy zones, between trips, to gas stations, and to car washes. A driver logging 30,000 business miles evenly across 2026 deducts about $22,275, often the difference between owing taxes and getting a refund.'
    },
    {
      type: 'h2',
      text: '2. Phone bill (business-use portion)'
    },
    {
      type: 'p',
      text: 'Your phone is required to drive: you cannot accept rides without it. The business-use percentage of your monthly phone bill is deductible. Claim the share you can support, for example by comparing your driving hours with your phone use. If your phone bill is $80/month and you use it 70% for rideshare, that is $56/month or $672/year deductible.'
    },
    {
      type: 'h2',
      text: '3. Phone accessories'
    },
    {
      type: 'p',
      text: 'Phone mounts, car chargers, charging cables, and wireless chargers are 100% deductible if used for rideshare. A new mount and cables every year is $30-50 in deductions.'
    },
    {
      type: 'h2',
      text: '4. Passenger amenities'
    },
    {
      type: 'p',
      text: 'Bottled water, mints, gum, tissues, phone chargers for passengers, and air fresheners are all deductible. If you spend $30-50 a month on amenities, that is $360-600 a year in deductions.'
    },
    {
      type: 'h2',
      text: '5. Car washes and detailing'
    },
    {
      type: 'p',
      text: 'A clean car earns better tips and ratings. Car washes, interior detailing, and vacuuming are all deductible. Weekly $15 car washes add up to $780/year in deductions.'
    },
    {
      type: 'h2',
      text: '6. Tolls and parking'
    },
    {
      type: 'p',
      text: 'Tolls and parking fees are deductible on top of the mileage rate. Use your toll account statement and parking receipts to total these. Airport pickup parking, downtown parking while waiting, and toll bridge crossings all count.'
    },
    {
      type: 'h2',
      text: '7. Health insurance premiums (self-employed)'
    },
    {
      type: 'p',
      text: 'If you are self-employed and not covered by a spouse\'s plan, you can deduct your health insurance premiums above the line on Schedule 1, line 17. This is one of the most underused deductions among gig workers. Up to 100% of your premium can be deducted.'
    },
    {
      type: 'h2',
      text: '8. Subscription services for drivers'
    },
    {
      type: 'p',
      text: 'Mileage tracker apps, dashcam cloud storage, music streaming services used in the car (Spotify, Apple Music), and any business apps you pay for are deductible. Stride Drive, Everlance, Gridwise, Solo, and similar apps all qualify.'
    },
    {
      type: 'h2',
      text: '9. Dashcam (often required, always deductible)'
    },
    {
      type: 'p',
      text: 'A dashcam is increasingly recommended (and in some markets required) for rideshare drivers. The full purchase cost is deductible (typically $80-300), and any cloud storage subscription is also deductible monthly.'
    },
    {
      type: 'h2',
      text: '10. Roadside assistance and AAA membership'
    },
    {
      type: 'p',
      text: 'AAA, Better World Club, or your insurer\'s roadside coverage is deductible for the business-use percentage. If 70% of your driving is rideshare, 70% of your $90 AAA membership is deductible.'
    },
    {
      type: 'h2',
      text: '11. Self-employment tax deduction'
    },
    {
      type: 'p',
      text: 'You can deduct half of your self-employment tax on Schedule 1, line 15. This happens automatically when you fill out Schedule SE. It is not optional, and every driver gets this deduction.'
    },
    {
      type: 'h2',
      text: '12. QBI deduction (up to 20%)'
    },
    {
      type: 'p',
      text: 'The Qualified Business Income deduction lets self-employed drivers deduct up to 20% of their net business income, subject to income limits. For 2026, the wage and property limits only start to apply above $403,500 of taxable income for married couples filing jointly and $201,750 for most other filers (IRS Rev. Proc. 2025-32), so most rideshare drivers can use the simple 20% calculation.'
    },
    {
      type: 'h2',
      text: 'Track everything, all year'
    },
    {
      type: 'p',
      text: 'The biggest mistake drivers make is trying to reconstruct deductions in April. By then, half your evidence is gone. Start a folder for receipts, log every mile contemporaneously, and treat tax tracking like part of the job. The drivers who do this consistently save $5,000-$15,000 per year compared to drivers who do not.'
    }
  ]
}

};

module.exports = BLOG_POSTS;
