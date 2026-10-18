(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.GNRecommendations = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function integer(value, min, max) {
    return Number.isInteger(value) && value >= min && value <= max;
  }

  function time(value) {
    return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  }

  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var parsed = new Date(value + 'T00:00:00Z');
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }

  function behaviorOf(value) {
    var d = value == null ? {} : value;
    if (typeof d !== 'object' || Array.isArray(d)) return null;
    var limits = { caffeineMg: 2000, exerciseMinutes: 1440, stressLevel: 5 }, out = {};
    Object.keys(limits).forEach(function (key) {
      if (!out) return;
      var number = d[key];
      if (number == null || number === '') out[key] = null;
      else if (integer(number, key === 'stressLevel' ? 1 : 0, limits[key])) out[key] = number;
      else out = null;
    });
    if (!out) return null;
    ['caffeineLastAt', 'exerciseEndAt'].forEach(function (key) {
      if (!out) return;
      var value = d[key];
      if (value == null || value === '') out[key] = null;
      else if (time(value)) out[key] = value;
      else out = null;
    });
    if (!out) return null;
    var intensity = d.exerciseIntensity == null || d.exerciseIntensity === '' ? null : d.exerciseIntensity;
    if (intensity !== null && ['light', 'moderate', 'vigorous'].indexOf(intensity) < 0) return null;
    out.exerciseIntensity = intensity;
    return out;
  }

  function nightOf(entry) {
    if (!entry || typeof entry !== 'object' || !validDate(entry.date) ||
        !integer(entry.asleep, 1, 1440) || !integer(entry.eff, 0, 100) ||
        !integer(entry.lat, 0, 90) || !integer(entry.awk, 0, 60) ||
        !integer(entry.rating || 0, 0, 5) || !time(entry.bed) || !time(entry.wake)) return null;
    var behavior = behaviorOf(entry.behaviorDetails);
    if (!behavior) return null;
    return {
      sleepMinutes: entry.asleep,
      efficiencyPercent: entry.eff,
      latencyMinutes: entry.lat,
      awakeMinutes: entry.awk,
      restRating: entry.rating || 0,
      bedtime: entry.bed,
      wakeTime: entry.wake,
      caffeineMg: behavior.caffeineMg,
      caffeineLastAt: behavior.caffeineLastAt,
      exerciseMinutes: behavior.exerciseMinutes,
      exerciseIntensity: behavior.exerciseIntensity,
      exerciseEndAt: behavior.exerciseEndAt,
      stressLevel: behavior.stressLevel,
    };
  }

  function buildPayload(entries, goalMinutes) {
    if (!Array.isArray(entries) || !integer(goalMinutes, 120, 720)) return null;
    var usable = entries.map(function (entry) {
      var night = nightOf(entry);
      return night ? { date: entry.date, night: night } : null;
    }).filter(Boolean).sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    if (usable.length < 7) return null;
    var nights = usable.slice(-14).map(function (item, index) {
      return Object.assign({ nightIndex: index + 1 }, item.night);
    });
    return { goalMinutes: goalMinutes, nights: nights };
  }

  return { buildPayload: buildPayload };
});
