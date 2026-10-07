// Mileage calculations shared by the browser (window.MLMCalc) and the server (require).
// Rates are passed in (see lib/rates.js clientRates()) so there is one source of truth.
(function (root) {
  function num(v) { var n = parseFloat(v); return isFinite(n) && n > 0 ? n : 0; }
  function round2(n) { return Math.round(n * 100) / 100; }

  function irsPeriod(rates, year, date) {
    var periods = rates.irs[year] || rates.irs['2026'];
    var p = periods[0];
    for (var i = 0; i < periods.length; i++) if (String(date || '') >= periods[i].from) p = periods[i];
    return p;
  }

  function ukTaxYearStart(date) {
    var d = String(date || '');
    var y = parseInt(d.slice(0, 4), 10);
    if (!y) return null;
    return d.slice(5) >= '04-06' ? y : y - 1;
  }

  // Indexes of trips sorted by date (stable), so thresholds apply in driving order.
  function dateOrder(trips) {
    return trips.map(function (t, i) { return i; }).sort(function (a, b) {
      var da = String(trips[a].date || ''), db = String(trips[b].date || '');
      return da < db ? -1 : da > db ? 1 : a - b;
    });
  }

  function summarizeUS(trips, rates, year) {
    var types = ['business', 'medical', 'charity', 'personal'];
    var totals = {}, amounts = {};
    types.forEach(function (t) { totals[t] = 0; amounts[t] = 0; });
    var periods = (rates.irs[year] || rates.irs['2026']).map(function (p) {
      return { from: p.from, business: p.business, medical: p.medical, charity: p.charity, miles: { business: 0, medical: 0, charity: 0 } };
    });
    var perTrip = trips.map(function (t) {
      var type = types.indexOf(t.type) >= 0 ? t.type : 'business';
      var miles = num(t.miles);
      var p = irsPeriod(rates, year, t.date);
      var rate = type === 'personal' ? 0 : p[type];
      totals[type] += miles;
      amounts[type] += miles * rate;
      if (type !== 'personal') {
        for (var i = periods.length - 1; i >= 0; i--) {
          if (String(t.date || '') >= periods[i].from || i === 0) { periods[i].miles[type] += miles; break; }
        }
      }
      return { rate: rate, amount: round2(miles * rate) };
    });
    var total = amounts.business + amounts.medical + amounts.charity;
    return { region: 'us', unit: 'mi', currency: '$', year: year, totals: totals, amounts: amounts, periods: periods, perTrip: perTrip, total: round2(total) };
  }

  function summarizeCA(trips, rates, year, zone, startOdo, endOdo) {
    var r = (rates.cra[year] || rates.cra['2026'])[zone === 'territories' ? 'territories' : 'provinces'];
    var business = 0, personal = 0;
    var perTrip = new Array(trips.length);
    dateOrder(trips).forEach(function (i) {
      var t = trips[i], km = num(t.miles);
      if (t.type === 'personal') { personal += km; perTrip[i] = { rate: 0, amount: 0 }; return; }
      var first = Math.max(0, Math.min(km, 5000 - business));
      var rest = km - first;
      var amount = first * r[0] + rest * r[1];
      business += km;
      perTrip[i] = { rate: km ? amount / km : r[0], amount: round2(amount) };
    });
    var odoTotal = num(endOdo) > num(startOdo) && num(startOdo) > 0 ? num(endOdo) - num(startOdo) : 0;
    var denominator = odoTotal || (business + personal);
    var pct = denominator ? (business / denominator) * 100 : 0;
    var allowance = Math.min(business, 5000) * r[0] + Math.max(0, business - 5000) * r[1];
    return {
      region: 'ca', unit: 'km', currency: '$', year: year, zone: zone === 'territories' ? 'territories' : 'provinces', rates: r,
      totals: { business: business, personal: personal }, odoTotal: odoTotal, businessUsePct: Math.round(pct * 10) / 10,
      perTrip: perTrip, total: round2(allowance)
    };
  }

  function summarizeUK(trips, rates, vehicle) {
    var h = rates.hmrc, v = vehicle === 'motorcycle' || vehicle === 'bicycle' ? vehicle : 'car';
    var byYear = {}, business = 0, personal = 0, total = 0;
    var perTrip = new Array(trips.length);
    dateOrder(trips).forEach(function (i) {
      var t = trips[i], miles = num(t.miles);
      if (t.type === 'personal') { personal += miles; perTrip[i] = { rate: 0, amount: 0 }; return; }
      var ty = ukTaxYearStart(t.date) || 0;
      var y = byYear[ty] || (byYear[ty] = { taxYear: ty, miles: 0, amount: 0 });
      var amount;
      if (v === 'car') {
        var firstRate = ty >= 2026 ? h.car.firstFrom2026 : h.car.firstBefore2026;
        var first = Math.max(0, Math.min(miles, h.car.threshold - y.miles));
        amount = first * firstRate + (miles - first) * h.car.over;
      } else {
        amount = miles * h[v];
      }
      y.miles += miles; y.amount += amount; business += miles; total += amount;
      perTrip[i] = { rate: miles ? amount / miles : 0, amount: round2(amount) };
    });
    var years = Object.keys(byYear).sort().map(function (k) { var y = byYear[k]; y.amount = round2(y.amount); return y; });
    return { region: 'uk', unit: 'mi', currency: '£', vehicle: v, totals: { business: business, personal: personal }, taxYears: years, perTrip: perTrip, total: round2(total) };
  }

  function summarize(opts, rates) {
    var trips = Array.isArray(opts.trips) ? opts.trips : [];
    if (opts.region === 'ca') return summarizeCA(trips, rates, String(opts.year || '2026'), opts.zone, opts.startOdo, opts.endOdo);
    if (opts.region === 'uk') return summarizeUK(trips, rates, opts.vehicle);
    return summarizeUS(trips, rates, String(opts.year || '2026'));
  }

  var api = { summarize: summarize, ukTaxYearStart: ukTaxYearStart, round2: round2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MLMCalc = api;
})(this);
