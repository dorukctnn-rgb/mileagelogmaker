// Medical mileage page: reads the calculator form, shows the result, remembers the inputs in this browser only.
(function () {
  'use strict';
  var M = window.MLMMedical, RATES = window.MLM_RATES;
  var form = document.getElementById('mdForm');
  if (!M || !RATES || !form) return;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'mlm_medical_v1';
  var IDS = ['mdYear', 'mdMiles0', 'mdMiles1', 'mdParking', 'mdActual', 'mdAgi', 'mdOther'];

  function labels() {
    var ps = M.periods(RATES, $('mdYear').value);
    $('mdMilesLabel0').textContent = ps.length > 1 ? 'Medical miles, ' + ps[0].label : 'Medical miles in ' + ps[0].label;
    if (ps[1]) $('mdMilesLabel1').textContent = 'Medical miles, ' + ps[1].label;
    $('mdMilesWrap1').hidden = ps.length < 2;
  }
  function update() {
    labels();
    var two = !$('mdMilesWrap1').hidden;
    var res = M.compute({
      year: $('mdYear').value,
      miles: two ? [$('mdMiles0').value, $('mdMiles1').value] : [$('mdMiles0').value],
      parking: $('mdParking').value, actual: $('mdActual').value, agi: $('mdAgi').value, other: $('mdOther').value
    }, RATES);
    $('mdResult').innerHTML = M.resultHTML(res);
    var state = {};
    IDS.forEach(function (id) { state[id] = $(id).value; });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) IDS.forEach(function (id) {
      if (typeof saved[id] !== 'string') return;
      if (id === 'mdYear' && !$('mdYear').querySelector('option[value="' + saved[id].replace(/[^0-9]/g, '') + '"]')) return;
      $(id).value = saved[id].slice(0, 14);
    });
  } catch (e) {}
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  update();
})();
