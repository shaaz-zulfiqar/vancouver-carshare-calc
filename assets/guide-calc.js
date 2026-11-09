/* Small Evo trip calculator used by the Evo guide pages.
   Needs window.Pricing and a #guideCalc element with data-* options. */
(function () {
  var host = document.getElementById('guideCalc');
  if (!host || !window.Pricing) return;
  var P = window.Pricing;
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return '$' + n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

  var minMinutes = parseFloat(host.getAttribute('data-min-minutes')) || 0;
  var extraLabel = host.getAttribute('data-extra-label') || '';
  var extraAmount = parseFloat(host.getAttribute('data-extra-amount')) || 0;
  var unit = host.getAttribute('data-unit') || 'min';
  var presets = JSON.parse(host.getAttribute('data-presets') || '[]'); // [[minutes, label], ...]

  var input = $('gcValue'), bcaa = $('gcBcaa');
  var UNITS = { min: 1, hr: 60, day: 1440 };

  function minutes() {
    var v = parseFloat(input.value);
    if (isNaN(v) || v < 0) v = 0;
    return v * UNITS[unit];
  }

  function paintUnits() {
    ['min', 'hr', 'day'].forEach(function (u) {
      var b = $('gcUnit-' + u);
      b.className = 'px-4 py-1.5 rounded-md text-sm font-semibold font-display transition ' + (unit === u ? 'bg-evo text-black' : 'text-slate-400 hover:text-white');
    });
  }

  function render() {
    var m = minutes();
    var billed = Math.max(m, minMinutes);
    var q = P.evoQuote(billed, { bcaa: bcaa.checked });
    var extra = 0;
    if (extraAmount > 0) extra = bcaa.checked ? 0 : extraAmount;

    $('gcTrip').textContent = fmt(q.trip);
    $('gcFee').textContent = fmt(q.fee);
    $('gcTax').textContent = fmt(q.tax);
    var pv = $('gcPvrtRow');
    if (q.pvrt > 0) { pv.classList.remove('hidden'); $('gcPvrt').textContent = fmt(q.pvrt); } else pv.classList.add('hidden');
    var dn = $('gcDiscount');
    if (q.discount > 0) { dn.textContent = 'Includes 10% BCAA discount (–' + fmt(q.discount) + ')'; dn.classList.remove('hidden'); } else dn.classList.add('hidden');

    var er = $('gcExtraRow');
    if (er) {
      $('gcExtraLabel').textContent = extraLabel + (bcaa.checked ? ' (waived for BCAA members)' : '');
      $('gcExtra').textContent = fmt(extra);
    }
    $('gcTotal').textContent = fmt(q.total + extra);

    var notes = [];
    if (minMinutes && m < minMinutes) notes.push('Evo Return bookings start at 1 hour, so this is priced as 1 hour.');
    if (q.note) notes.push(q.note);
    $('gcNote').textContent = notes.join(' ');
  }

  function setUnit(next) {
    var mins = minutes();
    unit = next;
    var v = mins / UNITS[unit];
    input.value = +(v.toFixed(2));
    input.step = unit === 'min' ? 1 : 0.5;
    paintUnits(); render();
  }

  $('gcPresets').innerHTML = presets.map(function (p) {
    return '<button type="button" data-m="' + p[0] + '" class="text-xs px-3 py-1.5 rounded-full border border-line text-slate-300 hover:border-evo hover:text-evo transition">' + p[1] + '</button>';
  }).join('');
  $('gcPresets').querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () {
      input.value = +((parseFloat(b.getAttribute('data-m')) / UNITS[unit]).toFixed(2));
      render();
    });
  });

  ['min', 'hr', 'day'].forEach(function (u) { $('gcUnit-' + u).addEventListener('click', function () { setUnit(u); }); });
  input.addEventListener('input', render);
  bcaa.addEventListener('change', render);

  var start = parseFloat(host.getAttribute('data-start-minutes')) || 30;
  input.value = +((start / UNITS[unit]).toFixed(2));
  input.step = unit === 'min' ? 1 : 0.5;
  paintUnits(); render();
})();
