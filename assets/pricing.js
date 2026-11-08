/* Vancouver Car Share Calculator — shared pricing engine
 * One source of truth for Evo, Modo and the comparison tool.
 * Works in the browser (window.Pricing) and in Node (module.exports) for testing.
 * Rates last reviewed: November 2026. Update the constants below when rates change.
 */
(function (root) {
  'use strict';

  var TAX_RATE = 0.12;                    // 5% GST + 7% PST
  var PVRT = { amount: 1.5, minHours: 8 }; // Passenger Vehicle Rental Tax: $1.50 for bookings 8h+, then per 24h period

  var EVO = {
    perMin: 0.49,
    perHour: 17.99,
    perDay: 104.99,
    perThreeDays: 264.99,   // evo.ca/rates: "3-day rate ($50 off)"
    perFiveDays: 424.99,    // evo.ca/rates: "5-day rate ($100 off)"
    allAccess: 1.85,
    bcaaDiscount: 0.10
  };

  var MODO = {
    perKm: 0.35,
    hourly: { daily: { plus: 5, monthly: 6 }, large: { plus: 7, monthly: 8 } },
    dayTripper: { daily: 100, large: 135 },   // per 24h, covers time + included km
    includedKm: { plus: 500, monthly: 250 },  // per 24h of booked time
    innovationFee: { ev: 1, gas: 3 },         // per trip
    maxDays: 10
  };

  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function fmt(n) { return n.toFixed(2); }
  function clean(n) { return String(+Number(n).toFixed(2)); }

  // Passenger Vehicle Rental Tax: $1.50 once a booking reaches 8 hours, then each consecutive 24h period.
  function pvrt(hours) {
    return hours >= PVRT.minHours ? round2(Math.ceil(hours / 24) * PVRT.amount) : 0;
  }

  /* ------------------------------------------------------------------ EVO */

  // Cheapest way to cover exactly n whole days using 1-, 3- and 5-day rates.
  function evoDayBlocks(n) {
    var best = [{ cost: 0, one: 0, three: 0, five: 0 }];
    for (var i = 1; i <= n; i++) {
      var opts = [];
      var a = best[i - 1]; opts.push({ cost: a.cost + EVO.perDay, one: a.one + 1, three: a.three, five: a.five });
      if (i >= 3) { var b = best[i - 3]; opts.push({ cost: b.cost + EVO.perThreeDays, one: b.one, three: b.three + 1, five: b.five }); }
      if (i >= 5) { var c = best[i - 5]; opts.push({ cost: c.cost + EVO.perFiveDays, one: c.one, three: c.three, five: c.five + 1 }); }
      best.push(opts.reduce(function (x, y) { return y.cost < x.cost - 1e-9 ? y : x; }));
    }
    return best[n];
  }

  function evoBlockLabel(b) {
    var parts = [];
    if (b.five) parts.push(b.five + ' × 5-day rate ($424.99)');
    if (b.three) parts.push(b.three + ' × 3-day rate ($264.99)');
    if (b.one) parts.push(b.one + ' × day rate ($104.99)');
    return parts.join(' + ');
  }

  // Per-minute charges cap at the hourly rate; each 24h period's accumulated charges cap at the day rate.
  // Multi-day trips use the cheapest mix of 1-, 3- and 5-day rates (an estimate: Evo does not publish how extra hours stack).
  function evoTripCharge(minutes) {
    if (minutes <= 0) return { cost: 0, note: '' };

    var remaining = minutes;
    var days = Math.floor(remaining / 1440);
    remaining -= days * 1440;
    var hours = Math.floor(remaining / 60);
    var leftoverMin = remaining - hours * 60;

    var partial = hours * EVO.perHour;
    var minuteNote = '';
    if (leftoverMin > 0) {
      var perMinuteCost = leftoverMin * EVO.perMin;
      if (perMinuteCost > EVO.perHour) {
        partial += EVO.perHour;
        minuteNote = clean(leftoverMin) + ' min would cost $' + fmt(perMinuteCost) +
          ' at $0.49/min, so it is capped at the $17.99 hourly rate.';
      } else {
        partial += perMinuteCost;
      }
    }

    var dayNote = '';
    if (partial > EVO.perDay) {
      dayNote = '$' + fmt(partial) + ' in hourly charges is capped at the $104.99 daily rate.';
      partial = EVO.perDay;
    }

    var note = dayNote || minuteNote;
    if (days > 0) {
      var blocks = evoDayBlocks(days);
      var cost = blocks.cost + partial;
      var usedBlocks = blocks;
      var rolledUp = false;
      if (partial > 0) {
        var up = evoDayBlocks(days + 1);
        if (up.cost < cost - 1e-9) { cost = up.cost; usedBlocks = up; rolledUp = true; }
      }
      if (rolledUp) {
        return { cost: cost, note: 'Billed as ' + (days + 1) + ' days (' + evoBlockLabel(usedBlocks) + '), which is cheaper than ' +
          days + ' day' + (days > 1 ? 's' : '') + ' plus the extra time.' };
      }
      var label = evoBlockLabel(blocks);
      var multi = blocks.three || blocks.five;
      if (!multi) label = days + ' full day' + (days > 1 ? 's' : '') + ' at $104.99';
      note = note ? label + ', plus ' + note.charAt(0).toLowerCase() + note.slice(1)
                  : label + (partial > 0 ? ', plus the remaining time at hourly and per-minute rates.' : ' applied.');
      return { cost: cost, note: note };
    }
    return { cost: partial, note: note };
  }

  function evoQuote(minutes, opts) {
    opts = opts || {};
    minutes = Math.max(0, Number(minutes) || 0);
    var t = evoTripCharge(minutes);
    var tripBefore = round2(t.cost);
    var discount = opts.bcaa ? round2(tripBefore * EVO.bcaaDiscount) : 0;
    var trip = round2(tripBefore - discount);
    var fee = minutes > 0 ? EVO.allAccess : 0;
    var tax = round2((trip + fee) * TAX_RATE);          // 12% of Trip Charge + All-Access Fee
    var pv = pvrt(minutes / 60);
    var total = round2(trip + fee + tax + pv);           // exact sum of the displayed lines
    return { trip: trip, tripBefore: tripBefore, discount: discount, fee: fee, tax: tax, pvrt: pv, total: total, note: t.note };
  }

  /* ----------------------------------------------------------------- MODO */

  function modoQuote(o) {
    o = o || {};
    var requested = Math.max(0, Number(o.hours) || 0);
    // Modo: 30-minute minimum booking, extended in 15-minute increments.
    var hours = requested > 0 ? Math.max(0.5, Math.ceil(requested * 4 - 1e-9) / 4) : 0;
    var km = Math.max(0, Number(o.km) || 0);
    var plan = o.plan === 'monthly' ? 'monthly' : 'plus';
    var vehicle = o.vehicle === 'large' ? 'large' : 'daily';
    var ev = !!o.ev;

    var rate = MODO.hourly[vehicle][plan];
    var day = MODO.dayTripper[vehicle];
    var inc = MODO.includedKm[plan];

    var empty = {
      mode: 'regular', days: 0, time: 0, dist: 0, fee: 0, tax: 0, pvrt: 0, total: 0,
      regularSub: 0, bestSub: 0, saved: 0, rate: rate, dayRate: day, included: inc,
      timeDetail: '', distDetail: '', note: ''
    };
    if (hours <= 0) return empty;

    function option(mode, days, time, billableKm, timeDetail, distDetail) {
      var t = round2(time), d = round2(billableKm * MODO.perKm);
      return { mode: mode, days: days, time: t, dist: d, sub: round2(t + d), timeDetail: timeDetail, distDetail: distDetail };
    }

    var options = [];
    options.push(option('regular', 0, hours * rate, km,
      clean(hours) + ' h × $' + fmt(rate) + '/hr',
      clean(km) + ' km × $0.35'));

    var full = Math.floor(hours / 24);
    if (full >= 1) {
      var rem = hours - full * 24;
      var billable = Math.max(0, km - full * inc);
      options.push(option('dayTripper', full, full * day + rem * rate, billable,
        full + ' Day Tripper day' + (full > 1 ? 's' : '') + ' × $' + fmt(day) + (rem > 0 ? ' + ' + clean(rem) + ' h × $' + fmt(rate) + '/hr' : ''),
        clean(billable) + ' km beyond ' + (full * inc) + ' km included × $0.35'));
    }

    var days = Math.ceil(hours / 24);
    var billableAll = Math.max(0, km - days * inc);
    options.push(option('dayTripper', days, days * day, billableAll,
      days + ' Day Tripper day' + (days > 1 ? 's' : '') + ' × $' + fmt(day),
      clean(billableAll) + ' km beyond ' + (days * inc) + ' km included × $0.35'));

    var best = options.reduce(function (a, b) { return b.sub < a.sub ? b : a; });
    var regular = options[0];

    var fee = MODO.innovationFee[ev ? 'ev' : 'gas'];
    var tax = round2((best.time + best.dist + fee) * TAX_RATE);   // 12% of time + distance + innovation fee
    var pv = pvrt(hours);
    var total = round2(best.time + best.dist + fee + tax + pv);

    var note = '';
    if (hours > requested + 1e-9) {
      note = 'Billed as ' + clean(hours) + ' h: Modo has a 30-minute minimum booking and extends in 15-minute steps.';
    }
    if (best.mode === 'dayTripper') {
      note = (note ? note + ' ' : '');
      note += 'Day Tripper applied: it covers time and up to ' + (best.days * inc) + ' km, and is cheaper than regular rates.';
    }
    if (hours > MODO.maxDays * 24) {
      note = (note ? note + ' ' : '') + 'Modo bookings run up to ' + MODO.maxDays + ' days; contact Modo for longer trips.';
    }

    return {
      mode: best.mode, days: best.days, time: best.time, dist: best.dist, fee: fee, tax: tax, pvrt: pv, total: total,
      regularSub: regular.sub, bestSub: best.sub, saved: round2(regular.sub - best.sub),
      rate: rate, dayRate: day, included: inc,
      timeDetail: best.timeDetail, distDetail: best.distDetail, note: note
    };
  }

  /* ------------------------------------------------- Evo vs Modo helpers */

  /* Example trips used on the hub and as one-click presets on the compare page.
   * "standing" trips are mostly parked time; "driving" trips are mostly distance. */
  var SCENARIOS = [
    { id: 'errand',   label: 'Quick errand',                  hours: 0.5, km: 5,   kind: 'Short, little driving' },
    { id: 'appt',     label: 'Appointment, car sits parked',  hours: 2,   km: 8,   kind: 'Mostly standing time' },
    { id: 'shop',     label: 'Big shopping run',              hours: 1.5, km: 25,  kind: 'Mixed' },
    { id: 'highway',  label: 'Highway run, nonstop driving',  hours: 1,   km: 80,  kind: 'Short, mostly driving' },
    { id: 'valley',   label: 'Round trip to the Fraser Valley', hours: 3, km: 150, kind: 'Short, lots of kilometres' },
    { id: 'hike',     label: 'Sea-to-Sky hiking day',         hours: 8,   km: 160, kind: 'Long day, moderate distance' },
    { id: 'daytrip',  label: 'Day trip, lots of driving',     hours: 10,  km: 350, kind: 'Long day, high distance' },
    { id: 'whistler', label: 'Whistler or Kelowna-style long day', hours: 12, km: 600, kind: 'Past the Day Tripper km limit' },
    { id: 'roadtrip', label: 'Full 24-hour road trip',        hours: 24,  km: 700, kind: 'Well past the km limit' },
    { id: 'weekend',  label: 'Weekend away (2 days)',         hours: 48,  km: 400, kind: 'Multi-day, parked most of it' },
    { id: 'threeday', label: 'Long weekend (3 days)',         hours: 72,  km: 500, kind: '3-day rate beats Modo' },
    { id: 'airport',  label: 'One-way drop-off at YVR',       hours: 0.5, km: 15,  kind: 'One-way, Modo not possible. Excludes the $5 YVR drop-off fee (waived for BCAA members)', oneWay: true }
  ];

  /* How far can you drive before Modo stops being the cheaper option?
   * Evo's price does not depend on distance, Modo's rises with every km, so there is
   * a single crossover point for a given booking length. */
  function modoBreakEvenKm(hours, modoOpts, evoTotal) {
    hours = Number(hours) || 0;
    if (hours <= 0) return null;
    modoOpts = modoOpts || {};
    var f = function (km) {
      return modoQuote({ hours: hours, km: km, plan: modoOpts.plan, vehicle: modoOpts.vehicle, ev: modoOpts.ev }).total;
    };
    var CAP = 5000;
    if (f(0) >= evoTotal) return { kind: 'evoAlways' };
    if (f(CAP) < evoTotal) return { kind: 'modoAlways' };
    var lo = 0, hi = CAP;
    for (var i = 0; i < 40; i++) {
      var mid = (lo + hi) / 2;
      if (f(mid) < evoTotal) lo = mid; else hi = mid;
    }
    return { kind: 'km', km: Math.floor(lo) };
  }

  var Pricing = {
    TAX_RATE: TAX_RATE, PVRT: PVRT, EVO: EVO, MODO: MODO, SCENARIOS: SCENARIOS,
    round2: round2, evoQuote: evoQuote, modoQuote: modoQuote, pvrt: pvrt, modoBreakEvenKm: modoBreakEvenKm
  };

  root.Pricing = Pricing;
  if (typeof module !== 'undefined' && module.exports) module.exports = Pricing;
})(typeof window !== 'undefined' ? window : globalThis);
