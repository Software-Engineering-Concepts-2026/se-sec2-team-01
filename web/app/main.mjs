import { createFeatureRegistry } from '../feature-registry.mjs';
import { createSleepRecordingFeature, renderAuthPage, renderSessionCard } from '../features/sleep-recording.mjs';
import { createDashboardStatsFeature } from '../features/dashboard-stats.mjs';
import { createTipsSettingsFeature, aiErrorText } from '../features/tips-settings.mjs';
import { createStorage } from '../core/storage.mjs';
import { renderNavigation, renderAccountHeader, routeLabel } from './navigation.mjs';
import { createRouter, parseRouteHash } from './router.mjs';
import { applyTheme, createThemeFeature } from './theme.mjs';
/* Good Night – app UI. Data lives only on this device (localStorage). */
(function () {
  'use strict';
  var G = window.GN, KEY = 'gn.v1';
  var view = document.getElementById('view'), toastEl = document.getElementById('toast');

  /* ---------- storage (per account, on this device only) ---------- */
  var storage = createStorage({
    getItem: function (k) { return localStorage.getItem(k); },
    setItem: function (k, v) { return localStorage.setItem(k, v); },
    removeItem: function (k) { return localStorage.removeItem(k); }
  });
  function rd(k) { return storage.get(k); }
  function wr(k, v) { storage.set(k, v); }
  function rmk(k) { storage.remove(k); }
  var user = null, S = { entries: [], goal: 480 };
  function users() { return rd('gn.users') || []; }
  function loadUser(u) { user = u; var d = rd('gn.data.' + u.id); S = d && Array.isArray(d.entries) ? d : { entries: [], goal: 480 }; if (typeof S.goal !== 'number') S.goal = 480; }
  function save() { if (user) wr('gn.data.' + user.id, S); }

  /* ---------- helpers ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ds(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return ds(new Date()); }
  function addDays(s, n) { var d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return ds(d); }
  function fmtDate(s, o) { return new Date(s + 'T12:00:00').toLocaleDateString('th-TH', o); }
  function dShort(s) { return fmtDate(s, { day: 'numeric', month: 'short' }); }   /* 3 ต.ค. */
  function ic(n, c) { return '<i data-lucide="' + n + '" class="ic ' + (c || '') + '"></i>'; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function stars(n) { var h = ''; for (var i = 1; i <= 5; i++) h += ic('star', i <= n ? 'fill' : ''); return '<span class="stars" role="img" aria-label="ความสดชื่น ' + n + ' จาก 5">' + h + '</span>'; }
  function dur(m) { return Math.floor(m / 60) + '<span class="sub"> ชม. </span>' + pad(Math.round(m % 60)) + '<span class="sub"> น.</span>'; }
  function sorted() { return G.sortDesc(S.entries); }
  function entryOn(d) { return S.entries.filter(function (e) { return e.date === d; })[0]; }
  function A(a) { return G.avg(a); }

  var GMIN = 120, GMAX = 720, tid;   /* sleep-hours goal: 2–12 h */
  function gh(m) { return Math.floor(m / 60) + ' ชม.' + (m % 60 ? ' ' + (m % 60) + ' น.' : ''); }
  function toast(msg) { toastEl.innerHTML = ic('check', 'good') + '<span>' + esc(msg) + '</span>'; try { lucide.createIcons(); } catch (e) {} toastEl.classList.add('show'); clearTimeout(tid); tid = setTimeout(function () { toastEl.classList.remove('show'); }, 2800); }

  function confirmBox(title, msg, okLabel, cb) {
    var ov = document.createElement('div'); ov.className = 'ov';
    ov.innerHTML = '<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dt"><h2 id="dt">' + esc(title) + '</h2><p class="hint" style="margin:0">' + esc(msg) + '</p><div class="actions"><button class="btn2" data-x="no">ยกเลิก</button><button class="btn" data-x="ok" style="background:#B5483F">' + esc(okLabel) + '</button></div></div>';
    ov.addEventListener('click', function (e) { var x = e.target.closest('[data-x]'); if (x || e.target === ov) { ov.remove(); if (x && x.dataset.x === 'ok') cb(); } });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') ov.remove(); });
    document.body.appendChild(ov); ov.querySelector('[data-x=no]').focus();
  }

  /* ---------- routing ---------- */
  var selMode = false, sel = {};
  var route = 'home', param = null, histFilter = 'week', draft = null, deferred = null, statsMode = 'week', statsMonth = null, logMode = 'timer';
  var aiState = { loading: false, error: '', result: null }, aiRequestId = 0;
  var featureMap;
  function createFeatureContext() {
    return {
      G: G, CLOUD: CLOUD, V3: V3, document: document, window: window, Blob: Blob, URL: URL,
      get S() { return S; }, get goal() { return S.goal; }, get user() { return user; },
      get route() { return route; }, get param() { return param; },
      get draft() { return draft; }, set draft(value) { draft = value; },
      get logMode() { return logMode; }, set logMode(value) { logMode = value; },
      get histFilter() { return histFilter; }, set histFilter(value) { histFilter = value; },
      get statsMode() { return statsMode; }, set statsMode(value) { statsMode = value; },
      get statsMonth() { return statsMonth; }, set statsMonth(value) { statsMonth = value; },
      get selMode() { return selMode; }, set selMode(value) { selMode = value; },
      get sel() { return sel; }, set sel(value) { sel = value; },
      get aiState() { return aiState; }, set aiState(value) { aiState = value; },
      get aiRequestId() { return aiRequestId; }, set aiRequestId(value) { aiRequestId = value; },
      get deferred() { return deferred; }, set deferred(value) { deferred = value; },
      get avDraft() { return avDraft; }, set avDraft(value) { avDraft = value; },
      get ageVal() { return ageVal; }, set ageVal(value) { ageVal = value; },
      get ageOpen() { return ageOpen; }, set ageOpen(value) { ageOpen = value; },
      get obGoal() { return obGoal; },
      get authEl() { return authEl; },
      GMIN: GMIN, GMAX: GMAX,
      get HM() { return HM; },
      render: render, nav: nav, toast: toast, confirmBox: confirmBox, persistPrefs: persistPrefs,
      updateLog: updateLog, newDraft: newDraft, draftFromSession: draftFromSession, touchTimes: touchTimes,
      behaviorFields: behaviorFields, spanOf: spanOf, entryOn: entryOn, putEntry: putEntry,
      removeEntry: removeEntry, removeEntries: removeEntries, clearEntries: clearEntries,
      histList: histList, fxDetail: fxDetail, fmtDate: fmtDate, dayDiff: dayDiff, addDays: addDays,
      today: today, tzName: tzName, pend: pend, setGoalBed: setGoalBed, writeHM: writeHM, hmErr: hmErr,
      $i: $i, ageInner: ageInner, recHtml: recHtml, avPreview: avPreview, loadAvatar: loadAvatar,
      commitHM: commitHM, authSync: authSync, cloud: cloud,
      ic: ic, esc: esc, sessionCard: sessionCard, sorted: sorted, dShort: dShort, stars: stars,
      dur: dur, gh: gh, durChart: durChart, effChart: effChart, scoreChart: scoreChart,
      scoreInfo: scoreInfo, scoreCard: scoreCard, effInfo: effInfo, moodLine: moodLine,
      adviceControls: adviceControls, adviceCard: adviceCard, diffTxt: diffTxt, histFrom: histFrom,
      A: A, empty: empty, selCount: selCount, getStatsMonth: function () { return statsMonth; },
      setStatsMonth: function (value) { statsMonth = value; }, fxCard: fxCard, bedGoalCard: bedGoalCard,
      printReportHtml: printReportHtml, bedDateOf: bedDateOf, optLabel: optLabel, vs: vs,
      behaviorRecordCard: behaviorRecordCard, avatarHtml: avatarHtml, dispName: dispName,
      row: row, goalSummary: goalSummary,
      commands: {
        login: function () { (CLOUD ? cloudLogin : localLogin)(); },
        register: function () { (CLOUD ? cloudRegister : localRegister)(); },
        sendreset: sendReset, setpw: setNewPw,
        toreg: function () { showAuth('register'); }, tologin: function () { showAuth('login'); },
        forgot: forgotPassword, goals: openGoals, photo: openPhoto, pfname: openName,
      },
    };
  }
  function resetAiState() { aiRequestId++; aiState = { loading: false, error: '', result: null }; }
  function tzName() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } }
  var router;
  function nav(r, keep, p) { router.navigate(r, keep, p); }
  function render() {
    applyTheme(S.theme, document);
    var api = createFeatureContext();
    var sleepFeature = createSleepRecordingFeature(api);
    var dashboardFeature = createDashboardStatsFeature(api);
    var tipsFeature = createTipsSettingsFeature(api);
    var themeFeature = createThemeFeature(api);
    featureMap = createFeatureRegistry([sleepFeature, dashboardFeature, tipsFeature, themeFeature]);
    view.innerHTML = featureMap.views[route]();
    var navigation = renderNavigation({ route: route, icon: ic });
    document.getElementById('nav').innerHTML = navigation.sideHtml;
    document.getElementById('tabs').innerHTML = navigation.tabsHtml;
    var header = renderAccountHeader({
      route: route,
      todayText: fmtDate(today(), { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }),
      avatarHtml: avatarHtml, displayName: dispName, escapeHtml: esc, icon: ic,
    });
    document.getElementById('crumb').textContent = header.breadcrumb;
    document.getElementById('today').textContent = header.todayText;
    document.getElementById('who').innerHTML = header.accountHtml;
    document.title = header.title;
    try { lucide.createIcons(); } catch (e) {}
    if (route === 'log' && document.getElementById('save')) updateLog();
  }
  router = createRouter({
    getRoute: function () { return route; },
    getParam: function () { return param; },
    setRoute: function (nextRoute, nextParam) { route = nextRoute; param = nextParam; },
    clearOverlays: function () { Array.prototype.forEach.call(document.querySelectorAll('.ov'), function (overlay) { overlay.remove(); }); },
    resetSelection: function () { selMode = false; sel = {}; },
    beginLog: function () { draft = newDraft(); logMode = 'timer'; },
    render: render,
    scrollToTop: function (x, y) { window.scrollTo(x, y); },
    location: location,
    history: history,
  });

  /* ---------- chart (slots = calendar days; a day with no log is { e: null }) ---------- */
  function chart(slots, o) {
    var lines = (o.lines || []).map(function (l) { return '<div class="ln" style="bottom:' + (l.v / o.max * 86).toFixed(1) + '%;border-color:' + l.c + '"></div>'; }).join('');
    var cols = slots.map(function (s, i) {
      var e = s.e;
      if (!e) return '<div class="c"><span class="vl"></span><i class="nil" title="' + dShort(s.date) + ' ไม่มีบันทึก"></i></div>';
      var v = o.val(e);
      return '<div class="c"><span class="vl">' + o.lab(e) + '</span><i class="' + (o.hi(e) ? 'hi' : '') + '" style="--i:' + i + ';height:' + Math.max(3, v / o.max * 86).toFixed(1) + '%" title="' + dShort(s.date) + ' · ' + o.lab(e) + '"></i></div>';
    }).join('');
    var n = slots.length, xl = slots.map(function (s, i) { return '<span>' + (!o.compact || i === 0 || (i + 1) % 5 === 0 ? dShort(s.date) : '') + '</span>'; }).join('');
    var got = slots.filter(function (s) { return s.e; }).length;
    return '<div class="plot' + (o.compact ? ' compact' : '') + '" role="img" aria-label="' + esc(o.name) + ' ' + got + ' คืนจาก ' + n + ' วัน">' + lines + '<div class="cols">' + cols + '</div></div><div class="xl' + (o.compact ? ' compact' : '') + '">' + xl + '</div>' +
      '<div class="legend">' + o.legend + '<span><s class="nil"></s>วันที่ไม่ได้บันทึก</span></div>';
  }
  function maxOf(slots, f) { return Math.max.apply(null, [0].concat(G.present(slots).map(f))); }
  function durChart(slots, compact) {
    var mx = Math.max(S.goal, 420, maxOf(slots, function (e) { return e.asleep; })), lines = [{ v: 420, c: '#6EE7B7' }];
    var lg = '<span><s style="background:#6EE7B7"></s>หลับจริงอย่างน้อย 7 ชม.</span><span><s style="background:#6D5BD0"></s>น้อยกว่า 7 ชม.</span><span><u style="color:#6EE7B7"></u>เส้น 7 ชม.</span>';
    if (S.goal !== 420) { lines.push({ v: S.goal, c: '#B8ACFF' }); lg += '<span><u style="color:#B8ACFF"></u>เป้าหมาย ' + gh(S.goal) + '</span>'; }
    return chart(slots, { name: 'ระยะเวลาหลับจริง', compact: compact, max: mx, val: function (e) { return e.asleep; }, hi: function (e) { return e.asleep >= 420; }, lab: function (e) { return (e.asleep / 60).toFixed(1); }, lines: lines, legend: lg });
  }
  function effChart(slots, compact) {
    return chart(slots, { name: 'ประสิทธิภาพการนอน', compact: compact, max: 100, val: function (e) { return e.eff; }, hi: function (e) { return e.eff >= 85 && !G.isShort(e.asleep, S.goal); }, lab: function (e) { return e.eff + '%'; }, lines: [{ v: 85, c: '#6EE7B7' }],
      legend: '<span><s style="background:#6EE7B7"></s>ถึงเกณฑ์ 85%</span><span><s style="background:#6D5BD0"></s>ต่ำกว่าเกณฑ์</span><span><u style="color:#6EE7B7"></u>เส้น 85%</span>' });
  }
  function scoreChart(slots, compact) {
    return chart(slots, { name: 'Sleep Score', compact: compact, max: 100, val: function (e) { return G.sleepScore(e, S.goal).score; }, hi: function (e) { return G.sleepScore(e, S.goal).score >= 70; }, lab: function (e) { return G.sleepScore(e, S.goal).score; }, lines: [{ v: 70, c: '#6EE7B7' }],
      legend: '<span><s style="background:#6EE7B7"></s>70 ขึ้นไป (ดี)</span><span><s style="background:#6D5BD0"></s>ต่ำกว่า 70</span><span><u style="color:#6EE7B7"></u>เส้น 70</span>' });
  }

  /* ---------- Sleep Score, mood, bedtime goal widgets ---------- */
  function scoreInfo() {
    var w = G.SCORE_W;
    return '<details class="acc"><summary>' + ic('chevron-right', 'chev') + 'Sleep Score คืออะไร</summary><p>คะแนน 0–100 ที่รวมสามอย่างเข้าด้วยกัน: ระยะเวลาหลับจริงเทียบกับเป้าหมายของคุณ (' + w.dur + '%) · ประสิทธิภาพการนอน (' + w.eff + '%) · ความสดชื่นตอนตื่น (' + w.rest + '%) ถ้าคืนไหนไม่ได้ให้คะแนนความสดชื่น จะคิดจากสองส่วนแรกและปรับน้ำหนักให้ครบ 100% แอปยังแสดงประสิทธิภาพและความสดชื่นแยกไว้ด้วยเสมอ</p></details>';
  }
  function scoreParts(s) {
    var row = function (lab, v, c) { return '<div class="fb w"><span>' + lab + '</span><div class="tr"><i style="width:' + (v === null ? 0 : v) + '%;background:' + c + '"></i></div><b>' + (v === null ? '–' : v) + '</b></div>'; };
    return '<div class="stack" style="gap:8px">' + row('ระยะเวลา ' + G.SCORE_W.dur + '%', s.dur, '#B8ACFF') + row('ประสิทธิภาพ ' + G.SCORE_W.eff + '%', s.eff, '#6EE7B7') + row('ความสดชื่น ' + G.SCORE_W.rest + '%', s.rest, '#FCD34D') + '</div>' + (s.hasRest ? '' : '<span class="sub">คืนนี้ไม่ได้ให้คะแนนความสดชื่น จึงไม่นำมาคิด</span>');
  }
  function scoreCard(e) {
    var s = G.sleepScore(e, S.goal);
    return '<div class="card"><div class="phead" style="align-items:center"><h2>Sleep Score</h2><span class="pill">' + G.scoreLabel(s.score) + '</span></div><div class="sc"><b class="' + (s.score >= 70 ? 'good' : 'low') + '">' + s.score + '</b><span class="sub">/ 100</span></div>' + scoreParts(s) + scoreInfo() + '</div>';
  }
  /* efficiency label that never shows "good" for a very short night */
  function effInfo(eff, asleep, short) {
    if (G.isShort(asleep, S.goal)) return { cls: 'low', txt: 'นอนน้อยมาก', note: 'หลับได้ดีระหว่างอยู่บนเตียง แต่ระยะเวลานอนยังน้อย' };
    return eff >= 85 ? { cls: 'good', txt: short ? 'ถึงเกณฑ์' : 'ถึงเกณฑ์ 85%', note: '' } : { cls: 'low', txt: short ? 'ต่ำกว่าเกณฑ์' : 'ต่ำกว่าเกณฑ์ 85%', note: '' };
  }
  function moodLine(e) { var m = G.moodOf(e.mood); return m ? '<span class="inl">' + ic(m.icon, 'sm') + m.label + '</span>' : ''; }
  function diffTxt(d) { return d === 0 ? 'ตรงเป้า' : (d > 0 ? 'ช้ากว่าเป้า ' : 'เร็วกว่าเป้า ') + Math.abs(d) + ' นาที'; }
  function bedGoalCard(es) {
    if (S.goalBed === null || S.goalBed === undefined) return '<div class="card"><h2 class="inl">' + ic('moon') + 'เวลาเข้านอนเป้าหมาย</h2><p class="hint">ยังไม่ได้ตั้งเวลาเข้านอนที่ต้องการ ตั้งแล้วจะเห็นว่าเข้านอนตรงเป้ากี่คืน</p><button class="btn2" data-go="settings">' + ic('target', 'sm') + 'ตั้งเป้าหมาย</button></div>';
    var v = G.bedVsGoal(es, S.goalBed), cur = es.length ? G.bedAvg(es) : null, rows = '';
    rows += '<div class="kv"><span class="cap">เป้าหมาย</span><b>' + G.fmtT(S.goalBed) + '</b></div>';
    rows += '<div class="kv"><span class="cap">เข้านอนเฉลี่ยช่วงนี้</span><b>' + (cur || '–') + '</b></div>';
    if (v) rows += '<div class="kv"><span class="cap">เทียบกับเป้า</span><b class="' + (Math.abs(v.avgDiff) <= v.tol ? 'good' : 'low') + '">' + diffTxt(v.avgDiff) + '</b></div><div class="kv"><span class="cap">คืนที่เข้านอนตรงเป้า (±' + v.tol + ' นาที)</span><b>' + v.within + ' / ' + v.n + ' คืน</b></div>';
    else rows += '<div class="kv"><span class="cap">เทียบกับเป้า</span><b>ยังไม่มีบันทึกในช่วงนี้</b></div>';
    var bl = S.goalBedSince ? 'ตั้งเป้าเมื่อ ' + fmtDate(S.goalBedSince, { day: 'numeric', month: 'short' }) : '';
    return '<div class="card"><h2 class="inl">' + ic('moon') + 'เวลาเข้านอนเทียบเป้าหมาย</h2>' + rows + (bl ? '<span class="sub">' + bl + '</span>' : '') + '</div>';
  }

  function empty(icon, title, text, withBtn) {
    return '<div class="card empty"><div class="bg">' + ic(icon) + '</div><h2>' + title + '</h2><p class="hint">' + text + '</p>' + (withBtn ? '<button class="btn" data-go="log">' + ic('plus') + 'บันทึกการนอน</button>' : '') + '</div>';
  }

  /* ---- เริ่มนอน / ตื่น (US-04, US-05) ---- */
  function elapsedTxt(m) { return Math.floor(m / 60) + ' ชม. ' + pad(m % 60) + ' น.'; }
  function sessionCard() { return renderSessionCard({ G: G, S: S, fmtDate: fmtDate, ic: ic, elapsedTxt: elapsedTxt }); }
  function persistPrefs() { if (CLOUD) window.GNSync.markProfile(pend()); save(); flush(); }
  var PREF_KEYS = ['displayName', 'avatar', 'goalBed', 'goalBedSince', 'reviewDone', 'sugDismissed', 'active', 'consent', 'theme', 'adviceState'];
  function prefsOf(src) { src = src || S; var o = {}; PREF_KEYS.forEach(function (k) { o[k] = src[k] === undefined ? null : src[k]; }); return o; }
  function adviceControls(item) { var id = item.id || item.title; return '<div class="inl" style="gap:8px;flex-wrap:wrap"><button class="btn2 sm" data-act="snoozeAdvice" data-id="' + esc(id) + '">พัก 7 วัน</button><button class="btn2 sm" data-act="dismissAdvice" data-id="' + esc(id) + '">ซ่อนคำแนะนำนี้</button></div>'; }
  setInterval(function () { var el = document.getElementById('sessEl'); if (el && S.active) el.textContent = elapsedTxt(Math.max(0, G.sessionElapsed(S.active, new Date()))); }, 30000);

  /* ---- home ---- */

  /* ---- log ---- */
  function dayDiff(a, b) { return Math.round((new Date(a + 'T12:00:00') - new Date(b + 'T12:00:00')) / 86400000); }
  function deriveBedDate(d) { var b = G.toMin(d.bed), w = G.toMin(d.wake); return (!isNaN(b) && !isNaN(w) && b > w) ? addDays(d.date, -1) : d.date; }
  function bedDateOf(e) { return addDays(e.date, Math.floor((G.toMin(e.wake) - e.inBed) / 1440)); }
  function spanOf(d) { if (d.sessSpan !== undefined) return d.sessSpan; var b = G.toMin(d.bed), w = G.toMin(d.wake); if (isNaN(b) || isNaN(w) || !d.bedDate) return NaN; return dayDiff(d.date, d.bedDate) * 1440 + w - b; }
  function newDraft(date) {
    var last = sorted()[0], ex = date && entryOn(date), d;
    if (ex) { d = { date: ex.date, bed: ex.bed, wake: ex.wake, lat: G.nearest(ex.lat, G.LAT_OPTS), awk: G.nearest(ex.awk, G.AWK_OPTS), rating: ex.rating, mood: ex.mood || '', factors: ex.factors.slice(), note: ex.note || '', behaviorDetails: G.normalizeBehaviorDetails(ex.behaviorDetails), editing: true, keep: { bedAt: ex.bedAt, wakeAt: ex.wakeAt, tz: ex.tz, bedTz: ex.bedTz } }; d.bedDate = bedDateOf(ex); d.bedManual = d.bedDate !== deriveBedDate(d); return d; }
    d = { date: date || today(), bed: last ? last.bed : '23:00', wake: last ? last.wake : '06:30', lat: last ? G.nearest(last.lat, G.LAT_OPTS) : 20, awk: 0, rating: 0, mood: '', factors: [], note: '', behaviorDetails: G.normalizeBehaviorDetails(), editing: false, bedManual: false };
    d.bedDate = deriveBedDate(d); return d;
  }
  function draftFromSession(r) {
    var saved = entryOn(r.date), d = { date: r.date, bed: r.bed, wake: r.wake, bedDate: r.bedDate, bedManual: true, lat: 20, awk: 0, rating: saved ? saved.rating : 0, mood: saved ? saved.mood || '' : '', factors: saved ? saved.factors.slice() : [], note: saved ? saved.note || '' : '', behaviorDetails: G.normalizeBehaviorDetails(saved && saved.behaviorDetails), editing: !!saved, sess: r.extra, sessSpan: r.span, fromSession: r.extra.bedAt };
    return d;
  }
  /* editing times by hand means the recorded timestamps no longer describe this entry */
  function touchTimes() { if (draft) { delete draft.sessSpan; delete draft.sess; delete draft.keep; } }
  function behaviorFields() {
    function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
    return { caffeineMg: val('caffeineMg'), caffeineLastAt: val('caffeineLastAt'), exerciseMinutes: val('exerciseMinutes'),
      exerciseIntensity: val('exerciseIntensity'), exerciseEndAt: val('exerciseEndAt'), stressLevel: val('stressLevel') };
  }
  function updateLog(typing) {
    var d = draft, $ = function (i) { return document.getElementById(i); };
    if (!d.bedManual) d.bedDate = deriveBedDate(d);
    var c = G.calc(d.bed, d.wake, d.lat, d.awk, spanOf(d));
    ['bed', 'wake'].forEach(function (f) {
      var m = G.toMin(d[f]), hI = $(f + 'H'), mI = $(f + 'M');
      if (!isNaN(m) && !(typing && (document.activeElement === hI || document.activeElement === mI))) { hI.value = pad(Math.floor(m / 60)); mI.value = pad(m % 60); }
    });
    $('date').value = d.date; $('date').max = today(); $('bedDate').value = d.bedDate; $('bedDate').max = d.date;
    var bd = d.behaviorDetails || G.normalizeBehaviorDetails();
    [['caffeineMg', bd.caffeineMg], ['caffeineLastAt', bd.caffeineLastAt], ['exerciseMinutes', bd.exerciseMinutes], ['exerciseIntensity', bd.exerciseIntensity], ['exerciseEndAt', bd.exerciseEndAt], ['stressLevel', bd.stressLevel]].forEach(function (pair) { var field = $(pair[0]); if (field && !(typing && document.activeElement === field)) field.value = pair[1] == null ? '' : pair[1]; });
    var behavior = G.normalizeBehaviorDetails({ caffeineMg: $('caffeineMg').value, caffeineLastAt: $('caffeineLastAt').value, exerciseMinutes: $('exerciseMinutes').value, exerciseIntensity: $('exerciseIntensity').value, exerciseEndAt: $('exerciseEndAt').value, stressLevel: $('stressLevel').value });
    var behaviorError = $('behaviorError'); behaviorError.textContent = behavior ? '' : 'ตรวจสอบรายละเอียดพฤติกรรม: คาเฟอีน 0–2,000 มก., ออกกำลังกาย 0–1,440 นาที และความเครียด 1–5';
    if (behavior) d.behaviorDetails = behavior;
    var res = $('res'); res.classList.toggle('err', !c.ok); $('save').disabled = !c.ok || !behavior;
    if (!c.ok) { ['r-dur', 'r-eff', 'r-bed', 'r-lost'].forEach(function (i) { $(i).textContent = '–'; $(i).className = ''; }); $('r-msg').textContent = c.msg; }
    else { $('r-dur').textContent = G.fmtDur(c.asleep); $('r-eff').textContent = c.eff + '%'; var ei = effInfo(c.eff, c.asleep); $('r-eff').className = ei.cls; $('r-bed').textContent = G.fmtDur(c.inBed); $('r-lost').textContent = c.lost + ' นาที'; $('r-msg').textContent = ei.note ? 'นอนน้อยมาก: ' + ei.note : ''; $('r-msg').className = 'sub m' + (ei.note ? ' low' : ''); }
    Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (o) { o.setAttribute('aria-checked', String(+o.dataset.v === d[o.dataset.g])); });
    Array.prototype.forEach.call(document.querySelectorAll('.rt'), function (o) { o.setAttribute('aria-checked', String(+o.dataset.v === d.rating)); });
    Array.prototype.forEach.call(document.querySelectorAll('.chip[data-m]'), function (o) { var on = o.dataset.m === d.mood; o.setAttribute('aria-pressed', String(on)); o.setAttribute('aria-checked', String(on)); });
    Array.prototype.forEach.call(document.querySelectorAll('.chips .chip[data-id]'), function (o) { o.setAttribute('aria-pressed', String(d.factors.indexOf(o.dataset.id) > -1)); });
    try { lucide.createIcons(); } catch (e) {}
  }

  /* ---- history ---- */
  function histFrom() { var t = today(); return histFilter === 'week' ? addDays(t, -6) : histFilter === 'month' ? addDays(t, -29) : '0000-00-00'; }
  function histList() { var from = histFrom(); return sorted().filter(function (e) { return e.date >= from; }); }
  function selCount() { return Object.keys(sel).length; }

  /* ---- stats ---- */
  function fxDetail(id) {
    var f = G.FACTORS.filter(function (x) { return x.id === id; })[0]; if (!f) return;
    var c = G.factorCompare(S.entries, f);
    var li = function (e) { return '<li><button data-go="day" data-date="' + e.date + '"><span>' + fmtDate(e.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) + '</span><span class="inl">' + (e.rating ? stars(e.rating) + '<span class="sub">' + e.rating + '/5</span>' : '<span class="sub">ไม่ได้ให้คะแนน · ไม่นำมาเฉลี่ย</span>') + '</span></button></li>'; };
    var sec = function (title, list, r) { return '<h3 style="font-size:15px;margin:14px 0 4px">' + title + ' · ' + list.length + ' คืน</h3><p class="hint" style="margin:0 0 4px">ให้คะแนนความสดชื่น ' + r.n + ' คืน' + (r.n ? ' · เฉลี่ย ' + r.avg.toFixed(1) + ' / 5' : '') + '</p><ul class="nlist">' + (list.length ? G.sortDesc(list).map(li).join('') : '<li class="hint" style="padding:8px 4px">ไม่มีบันทึก</li>') + '</ul>'; };
    var ov = document.createElement('div'); ov.className = 'ov';
    ov.innerHTML = '<div class="dlg wide" role="dialog" aria-modal="true" aria-labelledby="dt"><h2 id="dt" class="inl">' + ic(f.icon) + esc(f.label) + ' · บันทึกที่ใช้คำนวณ</h2><p class="hint">เฉลี่ยเฉพาะคืนที่ให้คะแนนความสดชื่น แตะรายการเพื่อเปิดรายละเอียดของคืนนั้น</p>' + sec('คืนที่มี' + f.label, c.W, c.rw) + sec('คืนที่ไม่มี' + f.label, c.O, c.ro) + '<div class="actions"><button class="btn2" data-x="no">ปิด</button></div></div>';
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-x]')) ov.remove(); });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') ov.remove(); });
    document.body.appendChild(ov); try { lucide.createIcons(); } catch (e) {} ov.querySelector('[data-x=no]').focus();
  }
  function fxCard() {
    var all = G.FACTORS.map(function (f) { return G.factorCompare(S.entries, f); }), rated = S.entries.filter(function (e) { return e.rating > 0; }).length;
    return '<div class="card"><h2>ปัจจัยกับความสดชื่น</h2><div class="sub">เทียบคะแนนความสดชื่นเฉลี่ยเมื่อมีและไม่มีปัจจัยนั้น จากทุกบันทึก (' + S.entries.length + ' คืน · ให้คะแนน ' + rated + ' คืน) ต้องมีคืนที่ให้คะแนนอย่างน้อย ' + G.factorCompare(S.entries, G.FACTORS[0]).need + ' คืนในแต่ละกลุ่ม</div>' + all.map(function (c) {
      var head = '<div class="inl" style="width:100%">' + ic(c.f.icon, 'sm') + '<b style="font-weight:500">' + c.f.label + '</b>';
      var counts = '<div class="sub">มี ' + c.W.length + ' คืน (ให้คะแนน ' + c.rw.n + ') · ไม่มี ' + c.O.length + ' คืน (ให้คะแนน ' + c.ro.n + ')</div>';
      var btn = '<button class="btn2 sm" data-act="fxdetail" data-id="' + c.f.id + '" style="align-self:flex-start;min-height:36px;padding:4px 14px">' + ic('list', 'sm') + 'ดูบันทึกที่ใช้คำนวณ</button>';
      if (!c.enough) {
        var miss = []; if (c.missWith) miss.push('คืนที่มี' + c.f.label + 'ขาดอีก ' + c.missWith + ' คืน'); if (c.missWithout) miss.push('คืนที่ไม่มีขาดอีก ' + c.missWithout + ' คืน');
        return '<div class="fx">' + head + '<span class="pill warn" style="margin-left:auto">ข้อมูลไม่พอ</span></div>' + counts + '<div class="sub">ยังเปรียบเทียบไม่ได้: ' + miss.join(' · ') + ' (นับเฉพาะคืนที่ให้คะแนน)</div>' + btn + '</div>';
      }
      var dl = c.rw.avg - c.ro.avg;
      return '<div class="fx">' + head + '<span class="delta ' + (dl >= 0 ? 'up' : 'dn') + '">' + (dl >= 0 ? '+' : '') + dl.toFixed(1) + '</span></div>' + counts +
        '<div class="fb"><span>มี</span><div class="tr"><i style="width:' + c.rw.avg / 5 * 100 + '%;background:#B8ACFF"></i></div><b>' + c.rw.avg.toFixed(1) + '</b></div>' +
        '<div class="fb"><span>ไม่มี</span><div class="tr"><i style="width:' + c.ro.avg / 5 * 100 + '%;background:#7C7699"></i></div><b>' + c.ro.avg.toFixed(1) + '</b></div>' + btn + '</div>';
    }).join('') + '</div>';
  }
  function printReportHtml(entries) {
    var rows = G.sortDesc(entries).slice(0, 30).reverse(), intensity = { light: 'เบา', moderate: 'ปานกลาง', vigorous: 'หนัก' };
    var body = rows.map(function (e) {
      var d = G.normalizeBehaviorDetails(e.behaviorDetails) || G.normalizeBehaviorDetails(), score = G.sleepScore(e, S.goal).score;
      return '<tr><td>' + esc(e.date) + '</td><td>' + score + '</td><td>' + G.fmtDur(e.asleep) + '</td><td>' + e.eff + '%</td><td>' + (d.caffeineMg == null ? '—' : d.caffeineMg + ' มก.') + (d.caffeineLastAt ? ' · ' + esc(d.caffeineLastAt) : '') + '</td><td>' + (d.exerciseMinutes == null ? '—' : d.exerciseMinutes + ' นาที') + (d.exerciseIntensity ? ' · ' + intensity[d.exerciseIntensity] : '') + (d.exerciseEndAt ? ' · ' + esc(d.exerciseEndAt) : '') + '</td><td>' + (d.stressLevel == null ? '—' : d.stressLevel + '/5') + '</td></tr>';
    }).join('');
    return '<div id="printReport" class="print-only"><h1>Good Night · รายงานการนอนและพฤติกรรม</h1><p>สร้างเมื่อ ' + esc(today()) + ' · ' + rows.length + ' คืนล่าสุด · เป้าหมายหลับจริง ' + G.fmtDur(S.goal) + '</p><p>Sleep Score ใช้สูตรเดิม: ระยะเวลาหลับจริง 50% + ประสิทธิภาพ 30% + ความสดชื่น 20% (ถ้าไม่มีคะแนนความสดชื่นจะปรับสัดส่วน) พฤติกรรมเป็นข้อมูลประกอบ ไม่เพิ่มหรือลดคะแนนโดยตรง</p><table><thead><tr><th>วันที่ตื่น</th><th>Score</th><th>หลับจริง</th><th>ประสิทธิภาพ</th><th>คาเฟอีน</th><th>ออกกำลังกาย</th><th>เครียด</th></tr></thead><tbody>' + body + '</tbody></table><h2>ข้อจำกัดและแหล่งอ้างอิง</h2><p>รายงานนี้เป็นข้อมูลติดตามตนเอง ไม่ใช่การวินิจฉัยหรือคำแนะนำทางการแพทย์ ความสัมพันธ์ในบันทึกไม่ยืนยันเหตุและผล และผลลัพธ์อาจได้รับอิทธิพลจากปัจจัยอื่น</p><p>AASM: https://aasm.org/seven-or-more-hours-of-sleep-per-night-a-health-necessity-for-adults/ · Caffeine meta-analysis: https://pubmed.ncbi.nlm.nih.gov/36870101/ · FDA: https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much · Evening exercise: https://pubmed.ncbi.nlm.nih.gov/30374942/ · Stress review: https://pubmed.ncbi.nlm.nih.gov/36409327/</p></div>';
  }

  /* ---- tips ---- */
  /* ---- day detail ---- */
  function optLabel(list, v) { var n = G.nearest(v, list); return list.filter(function (o) { return o.value === n; })[0].label; }
  function vs(val, avg, unit, hi) { var d = val - avg; if (!isFinite(avg)) return ''; return '<span class="sub ' + (d === 0 ? '' : (hi ? (d > 0 ? 'good' : 'low') : '')) + '">' + (d === 0 ? 'เท่าค่าเฉลี่ย' : (d > 0 ? '+' : '−') + Math.abs(Math.round(d)) + ' ' + unit + 'จากค่าเฉลี่ยของคืนอื่น') + '</span>'; }
  function behaviorRecordCard(e) {
    var d = G.normalizeBehaviorDetails(e.behaviorDetails) || G.normalizeBehaviorDetails(), intensity = { light: 'เบา', moderate: 'ปานกลาง', vigorous: 'หนัก' };
    var rows = [
      ['คาเฟอีนรวม', d.caffeineMg == null ? '' : d.caffeineMg + ' มก.'],
      ['คาเฟอีนครั้งสุดท้าย', d.caffeineLastAt || ''],
      ['ออกกำลังกาย', d.exerciseMinutes == null ? '' : d.exerciseMinutes + ' นาที' + (d.exerciseIntensity ? ' · ' + intensity[d.exerciseIntensity] : '')],
      ['ออกกำลังกายเสร็จ', d.exerciseEndAt || ''],
      ['ความเครียดที่ประเมินเอง', d.stressLevel == null ? '' : d.stressLevel + ' / 5'],
    ].filter(function (row) { return row[1] !== ''; });
    return '<div class="card"><h2>รายละเอียดพฤติกรรม</h2>' + (rows.length ? '<div class="kv">' + rows.map(function (r) { return '<span class="cap">' + r[0] + '</span><b>' + esc(r[1]) + '</b>'; }).join('') + '</div>' : '<p class="hint">ไม่มีรายละเอียดพฤติกรรมที่บันทึกไว้</p>') + '<p class="sub">ข้อมูลนี้ประกอบการเปรียบเทียบส่วนบุคคล ไม่ได้เปลี่ยน Sleep Score โดยตรง</p></div>';
  }

  /* ---- settings ---- */
  function act(icon, t, s, attrs, extra) { return '<button class="act" ' + attrs + '><span class="aic">' + ic(icon) + '</span><span class="gw"><span class="t">' + t + '</span><span class="sub">' + s + '</span></span>' + (extra || ic('chevron-right')) + '</button>'; }
  function bedGoalField() {
    var has = S.goalBed !== null && S.goalBed !== undefined;
    var note = has ? (S.goalBedSince ? 'ตั้งเป้าเมื่อ ' + fmtDate(S.goalBedSince, { day: 'numeric', month: 'short' }) + ' · ระบบจะสรุปให้หลังครบ 7 วันว่าการนอนดีขึ้นไหม' : '') : 'ยังไม่แน่ใจ? บันทึกครบ 7 คืนแล้วระบบจะแนะนำเวลาที่เหมาะกับคุณ';
    return '<div class="fld"><span class="lbl">เวลาเข้านอนที่ตั้งเป้าไว้ <span class="sub">(ไม่บังคับ)</span></span>' + clockInput('gbed', has ? S.goalBed : null, 'เวลาเข้านอนเป้าหมาย') + (note ? '<span class="sub">' + note + '</span>' : '') + '</div>';
  }
  function setGoalBed(v) {
    if (v === undefined) v = null;
    var cur = S.goalBed === undefined ? null : S.goalBed;
    if (v !== cur) { S.goalBed = v; S.goalBedSince = v === null ? null : today(); S.reviewDone = null; }
    persistPrefs();
  }
  /* ---- bedtime suggestion (after 7 nights) and 7-day follow-up ---- */
  function reviewCard() {
    if (S.goalBed === null || S.goalBed === undefined || !S.goalBedSince || S.reviewDone === S.goalBedSince) return '';
    var r = G.goalReview(S.entries, S.goal, S.goalBed, S.goalBedSince, today()); if (!r) return '';
    var verdict = r.delta === null ? 'ยังไม่มีข้อมูลก่อนตั้งเป้าให้เทียบ' : r.delta >= 3 ? 'การนอนดีขึ้น ทำต่อไปเลย' : r.delta <= -3 ? 'ยังไม่ดีขึ้น ลองปรับเวลาดูไหม' : 'ยังใกล้เคียงเดิม ลองต่ออีกสักสัปดาห์';
    var sg = r.delta !== null && r.delta < 3 ? G.bedSuggest(S.entries, S.goal, S.goalBed) : null;
    return '<div class="card sug"><h2 class="inl">' + ic('sparkles') + 'ผลหลังตั้งเป้าเข้านอน ' + G.fmtT(S.goalBed) + ' มา 7 วัน</h2>' +
      '<p class="hint" style="margin:0;color:var(--t1)">' + verdict + '</p>' +
      '<p class="hint" style="margin:0">Sleep Score เฉลี่ย ' + (r.before === null ? '' : r.before + ' → ') + '<b>' + r.after + '</b>' + (r.delta === null ? '' : ' (' + (r.delta > 0 ? '+' : '') + r.delta + ')') + ' · เข้านอนตรงเป้า ' + r.within + '/' + r.nAfter + ' คืน</p>' +
      (sg ? '<p class="hint" style="margin:0">จากบันทึกล่าสุด คืนที่เข้านอนราว <b>' + sg.bed + '</b> ได้ Sleep Score เฉลี่ย ' + sg.avg + '</p>' : '') +
      '<div class="actions">' + (sg ? '<button class="btn" data-act="sugok" data-v="' + sg.min + '">' + ic('check') + 'เปลี่ยนเป็น ' + sg.bed + '</button>' : '') + '<button class="btn2" data-act="revok">รับทราบ</button></div></div>';
  }
  function suggestCard() {
    if (S.sugDismissed && G.dayDiff(today(), S.sugDismissed) < 7) return '';
    var sg = G.bedSuggest(S.entries, S.goal, S.goalBed === undefined ? null : S.goalBed); if (!sg) return '';
    return '<div class="card sug"><h2 class="inl">' + ic('sparkles') + 'แนะนำเวลาเข้านอนสำหรับคุณ</h2>' +
      '<p class="hint" style="margin:0;color:var(--t1)">จาก ' + sg.nAll + ' คืนล่าสุด คืนที่คุณเข้านอนราว <b>' + sg.bed + '</b> ได้ Sleep Score เฉลี่ย <b>' + sg.avg + '</b> (เฉลี่ยทุกคืน ' + sg.overall + ')</p>' +
      '<p class="hint" style="margin:0">' + (S.goalBed === null || S.goalBed === undefined ? 'ตั้ง ' + sg.bed + ' เป็นเป้าหมายไหม?' : 'เปลี่ยนเป้าจาก ' + G.fmtT(S.goalBed) + ' เป็น ' + sg.bed + ' ไหม?') + ' แล้วระบบจะวิเคราะห์อีกครั้งหลัง 7 วันว่าดีขึ้นจริงไหม</p>' +
      '<div class="actions"><button class="btn" data-act="sugok" data-v="' + sg.min + '">' + ic('check') + 'ตั้งเป็นเป้าหมาย</button><button class="btn2" data-act="sugno">ไม่ใช่ตอนนี้</button></div></div>';
  }
  function adviceCard() { return reviewCard() || suggestCard(); }
  /* ---- settings: one column ---- */
  function dispName() { return (S.displayName || (user && user.name) || '').trim() || 'ผู้ใช้'; }
  function avatarHtml(size) {
    return S.avatar ? '<img class="avimg" src="' + esc(S.avatar) + '" alt="" style="width:' + size + 'px;height:' + size + 'px">' : '<span class="av" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * .42) + 'px">' + esc(dispName().charAt(0).toUpperCase()) + '</span>';
  }
  function modal(inner, opts) {
    opts = opts || {};
    var ov = document.createElement('div'); ov.className = 'ov';
    ov.innerHTML = '<div class="dlg wide" role="dialog" aria-modal="true" aria-labelledby="mt">' + inner + '</div>';
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-x=no]')) ov.remove(); });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') ov.remove(); });
    document.body.appendChild(ov); try { lucide.createIcons(); } catch (e) {}
    var f = ov.querySelector(opts.focus || '[data-x=no]'); if (f) f.focus();
    return ov;
  }
  function goalSummary() { return gh(S.goal) + ' ต่อคืน' + (S.goalBed === null || S.goalBed === undefined ? '' : ' · เข้านอน ' + G.fmtT(S.goalBed)); }
  function openGoals() {
    modal('<div class="lrow"><h2 id="mt" class="inl">' + ic('target') + 'เป้าหมายการนอน</h2>' + ageLink() + '</div>' + ageField() + '<div class="fld"><span class="lbl">ชั่วโมงนอนที่ต้องการต่อคืน</span>' + durInput('goal', S.goal, 'เป้าหมายชั่วโมงนอน') + '</div>' + bedGoalField() +
      '<div class="actions"><button class="btn" data-x="no">' + ic('check') + 'เสร็จสิ้น</button></div>', { focus: '#goalH' });
    var rb = $i('recBox'); if (rb) { rb.innerHTML = recHtml(S.goal); try { lucide.createIcons(); } catch (e) {} }
  }
  function openPrivacy() {
    modal('<h2 id="mt" class="inl">' + ic('shield-check') + 'นโยบายความเป็นส่วนตัว</h2>' + privacyHtml() +
      '<p class="hint" style="margin:8px 0 0">' + (S.consent ? 'คุณให้ความยินยอมเมื่อ ' + esc(new Date(S.consent.at).toLocaleString('th-TH')) : 'ยังไม่มีบันทึกความยินยอม') + '</p>' +
      '<div class="actions"><button class="btn2 danger" data-act="withdraw">' + ic('shield-off', 'sm') + 'ถอนความยินยอม</button><button class="btn" data-x="no">ปิด</button></div>');
  }
  var avDraft;
  function openPhoto() {
    avDraft = S.avatar || '';
    modal('<h2 id="mt">รูปโปรไฟล์</h2><div class="pf"><div id="avPrev">' + avPreview() + '</div><div class="inl" style="gap:10px;flex-wrap:wrap;justify-content:center"><label class="btn2" for="avFile" style="cursor:pointer">' + ic('image', 'sm') + 'เลือกรูป</label><input type="file" id="avFile" accept="image/*" hidden><button type="button" class="btn2" data-act="avdel">ลบรูป</button></div></div><div class="err" id="pfErr" role="alert"></div>' +
      '<div class="actions"><button class="btn2" data-x="no">ยกเลิก</button><button class="btn" data-act="avsave">' + ic('check') + 'บันทึก</button></div>');
  }
  function openName() {
    modal('<h2 id="mt">แก้ไขชื่อ</h2><div class="fld"><label for="pfName">ชื่อที่แสดง</label><input class="inp" id="pfName" maxlength="30" value="' + esc(dispName()) + '"></div><div class="err" id="pfErr" role="alert"></div>' +
      '<div class="actions"><button class="btn2" data-x="no">ยกเลิก</button><button class="btn" data-act="namesave">' + ic('check') + 'บันทึก</button></div>', { focus: '#pfName' });
    var f = $i('pfName'); if (f) f.select();
  }
  function avPreview() { return avDraft ? '<img class="avimg" src="' + esc(avDraft) + '" alt="รูปโปรไฟล์" style="width:96px;height:96px">' : '<span class="av" style="width:96px;height:96px;font-size:40px">' + esc(dispName().charAt(0).toUpperCase()) + '</span>'; }
  /* shrink the picked photo to a 192px square JPEG so it stays small enough to store and sync */
  function loadAvatar(file) {
    if (!file || !/^image\//.test(file.type)) { var e0 = $i('pfErr'); if (e0) e0.textContent = 'เลือกไฟล์รูปภาพ'; return; }
    var rd = new FileReader();
    rd.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(img.width, img.height), c = document.createElement('canvas'); c.width = c.height = 192;
        c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 192, 192);
        avDraft = c.toDataURL('image/jpeg', .85); var p = $i('avPrev'); if (p) p.innerHTML = avPreview();
      };
      img.onerror = function () { var e1 = $i('pfErr'); if (e1) e1.textContent = 'เปิดรูปนี้ไม่ได้ ลองไฟล์อื่น'; };
      img.src = rd.result;
    };
    rd.readAsDataURL(file);
  }
  function row(icon, t, s, attrs, cls) { return '<button class="srow' + (cls ? ' ' + cls : '') + '" ' + attrs + '><span class="aic">' + ic(icon) + '</span><span class="gw"><span class="t">' + t + '</span>' + (s ? '<span class="sub">' + s + '</span>' : '') + '</span>' + ic('chevron-right', 'chev') + '</button>'; }
  /* ---------- editable goal inputs (type, click, or use the arrows) ---------- */
  function durInput(id, total, label) {
    return '<div class="hm"><div class="step"><button type="button" class="sb" data-act="dstep" data-f="' + id + '" data-d="-30" aria-label="' + label + ' ลด 30 นาที">' + ic('minus') + '</button>' +
      '<div class="tp-in" role="group" aria-label="' + label + '"><input class="tpi" id="' + id + 'H" inputmode="numeric" maxlength="2" autocomplete="off" value="' + Math.floor(total / 60) + '" aria-label="ชั่วโมง"><span class="u">ชม.</span><input class="tpi" id="' + id + 'M" inputmode="numeric" maxlength="2" autocomplete="off" value="' + pad(total % 60) + '" aria-label="นาที"><span class="u">น.</span></div>' +
      '<button type="button" class="sb" data-act="dstep" data-f="' + id + '" data-d="30" aria-label="' + label + ' เพิ่ม 30 นาที">' + ic('plus') + '</button></div><div class="sub low" id="' + id + 'Err" role="alert"></div></div>';
  }
  function clockInput(id, v, label) {
    var h = v === null || v === undefined ? '' : pad(Math.floor(v / 60)), m = v === null || v === undefined ? '' : pad(v % 60);
    return '<div class="hm"><div class="step"><button type="button" class="sb" data-act="cstep" data-f="' + id + '" data-d="-15" aria-label="' + label + ' เร็วขึ้น 15 นาที">' + ic('minus') + '</button>' +
      '<div class="tp-in" role="group" aria-label="' + label + ' (24 ชั่วโมง)"><input class="tpi" id="' + id + 'H" inputmode="numeric" maxlength="2" autocomplete="off" placeholder="--" value="' + h + '" aria-label="ชั่วโมง"><span>:</span><input class="tpi" id="' + id + 'M" inputmode="numeric" maxlength="2" autocomplete="off" placeholder="--" value="' + m + '" aria-label="นาที"></div>' +
      '<button type="button" class="sb" data-act="cstep" data-f="' + id + '" data-d="15" aria-label="' + label + ' ช้าลง 15 นาที">' + ic('plus') + '</button></div><button type="button" class="link clr" data-act="cclear" data-f="' + id + '">ล้างค่าเวลาเข้านอน</button></div>';
  }
  function $i(id) { return document.getElementById(id); }
  function writeHM(id, v) {
    var c = HM[id], hI = $i(id + 'H'), mI = $i(id + 'M'); if (!hI || !mI) return;
    if (c.kind === 'dur') { hI.value = Math.floor(v / 60); mI.value = pad(v % 60); }
    else { hI.value = v === null ? '' : pad(Math.floor(v / 60)); mI.value = v === null ? '' : pad(v % 60); }
  }
  function hmErr(id, msg) { var e = $i(id + 'Err'); if (e) e.textContent = msg || ''; }
  var HM = {
    goal: { kind: 'dur', get: function () { return S.goal; }, set: function (v) { setGoal(v); }, page: true },
    ob: { kind: 'dur', get: function () { return obGoal; }, set: function (v) { obGoal = v; obTouched = true; obUpdate(); } },
    gbed: { kind: 'clock', get: function () { return S.goalBed === undefined ? null : S.goalBed; }, set: function (v) { setGoalBed(v); }, page: true },
    obbed: { kind: 'clock', get: function () { return obBed; }, set: function (v) { obBed = v; } }
  };
  function commitHM(id) {
    var c = HM[id], hI = $i(id + 'H'), mI = $i(id + 'M'), v;
    if (!hI || !mI) return;
    if (c.kind === 'dur') {
      var h = hI.value === '' ? Math.floor(c.get() / 60) : +hI.value, m = mI.value === '' ? 0 : +mI.value;
      v = h * 60 + m; var msg = '';
      if (v < GMIN) { v = GMIN; msg = 'เป้าหมายต้องไม่น้อยกว่า ' + GMIN / 60 + ' ชั่วโมง'; } else if (v > GMAX) { v = GMAX; msg = 'เป้าหมายต้องไม่เกิน ' + GMAX / 60 + ' ชั่วโมง'; }
      c.set(v); writeHM(id, v); if (c.page && route === 'settings') render(); hmErr(id, msg);
    } else {
      if (hI.value === '' && mI.value === '') { c.set(null); if (c.page && route === 'settings') render(); return; }
      v = (hI.value === '' ? 0 : +hI.value) * 60 + (mI.value === '' ? 0 : +mI.value); c.set(v); writeHM(id, v); if (c.page && route === 'settings') render();
    }
  }
  function hmHandle(t) {   /* typing in an hour/minute box: digits only, live range hint */
    var m = /^(goal|ob|gbed|obbed)([HM])$/.exec(t.id); if (!m) return false;
    var c = HM[m[1]], v = t.value.replace(/\D/g, '').slice(0, 2);
    if (v.length === 2) { var lim = m[2] === 'H' ? (c.kind === 'dur' ? 12 : 23) : 59; if (+v > lim) v = String(lim); }
    t.value = v;
    if (c.kind === 'dur') {
      var tot = (+$i(m[1] + 'H').value || 0) * 60 + (+$i(m[1] + 'M').value || 0);
      hmErr(m[1], tot < GMIN ? 'เป้าหมายต้องไม่น้อยกว่า ' + GMIN / 60 + ' ชั่วโมง' : '');
    } else if (m[2] === 'H' && v.length === 2) { $i(m[1] + 'M').focus(); $i(m[1] + 'M').select(); }
    return true;
  }

  /* ---------- sync (cloud mode only) ---------- */
  var cloud = window.GNCloud, CLOUD = !!(cloud && cloud.enabled), V3 = !!(window.GN_CONFIG && window.GN_CONFIG.schemaV3), syncEl = document.getElementById('sync');
  function pend() {
    if (!S.pending || typeof S.pending !== 'object') S.pending = { e: {}, p: false };
    if (!S.pending.e || typeof S.pending.e !== 'object') S.pending.e = {};
    if (S.pending.p === undefined) S.pending.p = false;
    return S.pending;
  }
  function pendingCount() { var p = S.pending; return p ? Object.keys(p.e || {}).length + (p.p ? 1 : 0) : 0; }
  function setSync(t, cls) { if (!syncEl) return; syncEl.textContent = CLOUD && user ? t : ''; syncEl.className = 'sync ' + (cls || ''); }
  function syncStatus() {
    if (!CLOUD) return; var n = pendingCount();
    if (!navigator.onLine) setSync(n ? 'ออฟไลน์ · รอซิงก์ ' + n + ' รายการ' : 'ออฟไลน์', 'off');
    else if (n) setSync('รอซิงก์ ' + n + ' รายการ', 'wait'); else setSync('ซิงก์แล้ว', 'ok');
  }
  var syncQueue = window.GNSync.create({
    pending: pend,
    entries: function () { return S.entries; },
    profile: function () { return { name: S.displayName || (user && user.name) || '', goal: S.goal, onboarded: !!S.onboarded, prefs: prefsOf() }; },
    online: function () { return !!user && navigator.onLine; },
    putEntry: function (e) { return cloud.put(e); },
    deleteEntry: function (date) { return cloud.del(date); },
    putProfile: function (p) { return cloud.putProfile(p); },
    save: save,
    onStart: function () { setSync('กำลังซิงก์…', 'wait'); },
    onError: function (e) {
      if (e.status === 401 || e.status === 403) setSync('เซสชันหมดอายุ ออกจากระบบแล้วเข้าใหม่', 'err');
      else if (!e.network) setSync('ซิงก์ไม่สำเร็จ จะลองใหม่', 'err');
    },
    onFinish: syncStatus
  });
  function flush() {
    if (!CLOUD || !user || !navigator.onLine || !pendingCount()) { syncStatus(); return Promise.resolve(false); }
    return syncQueue.flush();
  }
  function pullMerge() {
    if (!CLOUD || !user || !navigator.onLine) return Promise.resolve(false);
    return flush().then(function () { return cloud.pull(); }).then(function (r) {
      var p = pend(), remoteEntries = r.entries;
      if (!V3) remoteEntries = G.preserveLocalBehaviorDetails(S.entries, remoteEntries);
      var merged = window.GNSync.mergeEntries(S.entries, p, remoteEntries), changed = merged.changed;
      S.entries = merged.entries;
      if (r.profile && !p.p) {
        if (S.goal !== r.profile.goal_min || !!S.onboarded !== !!r.profile.onboarded) changed = true; S.goal = r.profile.goal_min; S.onboarded = !!r.profile.onboarded;
        var pr = r.profile.prefs;
        if (pr && typeof pr === 'object') { var rp = prefsOf(pr); if (JSON.stringify(prefsOf()) !== JSON.stringify(rp)) changed = true; PREF_KEYS.forEach(function (k) { S[k] = rp[k]; }); }
      }
      if (changed) resetAiState();
      save(); syncStatus(); return changed;
    }).catch(function () { syncStatus(); return false; });
  }
  function syncAndRefresh() { return pullMerge().then(function (ch) { if (ch && user && document.body.classList.contains('authed') && route !== 'log') render(); return ch; }); }
  window.addEventListener('online', function () { if (user) syncAndRefresh(); });
  window.addEventListener('offline', function () { syncStatus(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && user && document.body.classList.contains('authed')) syncAndRefresh(); });

  /* every change to the data goes through these, so cloud mode can queue it for sync */
  function putEntry(e) { resetAiState(); S.entries = S.entries.filter(function (x) { return x.date !== e.date; }); S.entries.push(e); if (CLOUD) window.GNSync.markEntry(pend(), e.date, 'put'); save(); flush(); }
  function removeEntries(ds) { resetAiState(); var m = {}; ds.forEach(function (d) { m[d] = 1; }); S.entries = S.entries.filter(function (x) { return !m[x.date]; }); if (CLOUD) ds.forEach(function (d) { window.GNSync.markEntry(pend(), d, 'del'); }); save(); flush(); }
  function removeEntry(d) { resetAiState(); S.entries = S.entries.filter(function (x) { return x.date !== d; }); if (CLOUD) window.GNSync.markEntry(pend(), d, 'del'); save(); flush(); }
  function clearEntries() { resetAiState(); var ds = S.entries.map(function (e) { return e.date; }); S.entries = []; if (CLOUD) ds.forEach(function (d) { window.GNSync.markEntry(pend(), d, 'del'); }); save(); flush(); }
  function setGoal(g) { resetAiState(); S.goal = g; if (CLOUD) window.GNSync.markProfile(pend()); save(); flush(); }

  /* ---------- auth ---------- */
  var authEl = document.getElementById('auth'), splashEl = document.getElementById('splash'), authMode = 'login', resetSession = null;
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function rand(n) { var a = new Uint8Array(n); if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a); else for (var i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256); return hex(a); }
  var PW_MIN = 8, CONSENT_V = '2026-10-behavior-details', pendingConsent = null;
  function newConsent() { return { v: CONSENT_V, at: new Date().toISOString() }; }
  function hasConsent() { return !!(S.consent && S.consent.v === CONSENT_V); }
  function cryptoOk() { return !!(window.crypto && crypto.subtle && crypto.getRandomValues); }
  /* plain-JS SHA-256 so sign-up still works where Web Crypto is unavailable (e.g. some browsers opening a local file) */
  var SH = null;
  function ror(x, n) { return (x >>> n) | (x << (32 - n)); }
  function sha256(bytes) {
    if (!SH) { SH = { k: [], h: [] }; var pr = [], n = 2; while (pr.length < 64) { var ok = true; for (var i = 0; i < pr.length; i++) if (n % pr[i] === 0) { ok = false; break; } if (ok) pr.push(n); n++; } pr.forEach(function (p, i) { SH.k[i] = Math.floor((Math.cbrt(p) % 1) * 4294967296) >>> 0; if (i < 8) SH.h[i] = Math.floor((Math.sqrt(p) % 1) * 4294967296) >>> 0; }); }
    var l = bytes.length, pl = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(pl); m.set(bytes); m[l] = 0x80;
    var dv = new DataView(m.buffer); dv.setUint32(pl - 4, (l * 8) >>> 0); dv.setUint32(pl - 8, Math.floor(l * 8 / 4294967296));
    var H = SH.h.slice(), w = new Array(64), i, off;
    for (off = 0; off < pl; off += 64) {
      for (i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (i = 16; i < 64; i++) { var s0 = ror(w[i - 15], 7) ^ ror(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = ror(w[i - 2], 17) ^ ror(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0; }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) { var S1 = ror(e, 6) ^ ror(e, 11) ^ ror(e, 25), ch = (e & f) ^ (~e & g), t1 = (h + S1 + ch + SH.k[i] + w[i]) >>> 0, S0 = ror(a, 2) ^ ror(a, 13) ^ ror(a, 22), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) >>> 0; h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0; }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0; H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    var out = new Uint8Array(32), ov = new DataView(out.buffer); H.forEach(function (x, j) { ov.setUint32(j * 4, x); }); return out;
  }
  function slowHash(pw, salt) {
    var enc = new TextEncoder(), sb = enc.encode(salt), h = sha256(enc.encode(salt + pw));
    for (var i = 0; i < 5000; i++) { var cat = new Uint8Array(h.length + sb.length); cat.set(h); cat.set(sb, h.length); h = sha256(cat); }
    return hex(h);
  }
  function hashPw(pw, salt, alg) {
    if ((alg || 'pbkdf2') === 'sha' || !cryptoOk()) { if ((alg || 'pbkdf2') === 'pbkdf2' && !cryptoOk() && alg) return Promise.reject(new Error('no crypto')); return Promise.resolve(slowHash(pw, salt)); }
    var enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']).then(function (k) {
      return crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 120000, hash: 'SHA-256' }, k, 256);
    }).then(hex);
  }
  function cerr(e) {
    if (e.network) return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่';
    var m = String(e.message || '').toLowerCase();
    if (/invalid login/.test(m)) return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    if (/already registered|already been registered/.test(m)) return 'อีเมลนี้สมัครใช้งานแล้ว ลองเข้าสู่ระบบแทน';
    if (/not confirmed/.test(m)) return 'บัญชียังใช้งานไม่ได้ กรุณาตรวจการตั้งค่าการเข้าสู่ระบบ';
    if (/not authorized|unauthorized/.test(m)) return 'ผู้ให้บริการอีเมลยังไม่อนุญาตผู้รับนี้ ตรวจการตั้งค่า SMTP หรือใช้ที่อยู่อีเมลที่ได้รับอนุญาต';
    if (/password should|at least/.test(m)) return 'รหัสผ่านสั้นเกินไป';
    if (/rate limit|too many/.test(m) || e.status === 429) return 'ลองบ่อยเกินไป รอสักครู่แล้วลองใหม่';
    if (/valid email|invalid email|unable to validate/.test(m)) return 'รูปแบบอีเมลไม่ถูกต้อง';
    return 'ไม่สำเร็จ: ' + e.message;
  }
  function userOf(sn) { return { id: sn.user.id, name: sn.user.name || String(sn.user.email || '').split('@')[0] || 'ผู้ใช้', email: sn.user.email }; }
  function aerr(m) { var e = document.getElementById('err'); if (e) e.textContent = m || ''; }
  var authBusy = false;
  function authValid() {
    var v = function (id) { var e = document.getElementById(id); return e ? e.value : ''; }, ck = document.getElementById('cons');
    if (authMode === 'notice') return true;
    if (authMode === 'forgot') return v('u').trim() !== '';
    if (authMode === 'reset') return v('p') !== '' && v('p2') !== '';
    var ok = v('u').trim() !== '' && v('p') !== '';
    if (authMode === 'register') ok = ok && v('p2') !== '' && !!ck && ck.checked && (!document.getElementById('nm') || v('nm').trim() !== '');
    return ok;
  }
  function authSync() {
    var b = document.getElementById('go'); if (b) b.disabled = authBusy || !authValid();
    var c = authEl.querySelector('[data-act=consentok]'), ck = document.getElementById('cons'); if (c && ck) c.disabled = !ck.checked;
  }
  function busy(on) { authBusy = on; authSync(); }
  function inp(id, lab, type, ac, extra) { return '<div class="fld"><label for="' + id + '">' + lab + '</label><input class="inp" id="' + id + '" type="' + type + '" autocomplete="' + ac + '" ' + (extra || '') + '></div>'; }
  function pwf(id, lab, ac) { return '<div class="fld"><label for="' + id + '">' + lab + '</label><div class="pw"><input class="inp" id="' + id + '" type="password" autocomplete="' + ac + '"><button type="button" class="eye" data-act="eye" data-for="' + id + '" aria-label="แสดงรหัสผ่าน">' + ic('eye') + '</button></div></div>'; }
  function authShell(inner) { return '<div class="auth-card"><div class="brand c"><span class="lg">' + ic('moon') + '</span>Good Night</div>' + inner + '</div>'; }
  function showAuth(mode, msg) {
    document.body.classList.remove('authed'); authEl.hidden = false; authMode = mode || 'login';
    var page = renderAuthPage({ authMode: authMode, msg: msg, CLOUD: CLOUD, PW_MIN: PW_MIN, input: inp, passwordField: pwf, authShell: authShell, ic: ic, esc: esc });
    authEl.innerHTML = page.html; authBusy = false; authSync(); try { lucide.createIcons(); } catch (e) {}
    var f = page.focusId ? document.getElementById(page.focusId) : null; if (f) f.focus();
  }
  function startRoute() {
    var h = location.hash.slice(1), target = parseRouteHash(location.hash);
    if (h === 'login' || h === '' || !target) { route = 'home'; param = null; }
    else { route = target.route; param = target.param; }
    if (route === 'log') draft = newDraft();
    render(); window.scrollTo(0, 0);
  }
  function enter(u, first) {
    resetAiState();
    if (!CLOUD) wr('gn.session', u.id);
    loadUser(u);
    if (!S.consent && u.consent) S.consent = u.consent;
    if (pendingConsent && !S.consent) { S.consent = pendingConsent; if (CLOUD) window.GNSync.markProfile(pend()); }
    pendingConsent = null; save();
    var finish = function () {
      authEl.hidden = true; authEl.innerHTML = '';
      if (!hasConsent()) showConsent(); else if (!S.onboarded) showOnboard(); else { document.body.classList.add('authed'); startRoute(); }
      if (first) toast('สร้างบัญชีแล้ว ยินดีต้อนรับ ' + u.name); syncStatus();
    };
    if (CLOUD && !S.onboarded) {
      Promise.race([pullMerge(), new Promise(function (r) { setTimeout(r, 6000); })]).then(finish);
    } else { finish(); if (CLOUD) syncAndRefresh(); }
  }

  /* privacy notice + consent (ต้องยินยอมก่อนบันทึกข้อมูล) */
  function privacyHtml() {
    var contact = (window.GN_CONFIG && GN_CONFIG.privacyContact) || '';
    return '<div class="priv"><h3>ข้อมูลที่เก็บ</h3><ul><li>บันทึกการนอน: เวลาเข้านอน/ตื่น ระยะเวลาหลับ ความสดชื่น ความรู้สึกตอนตื่น ปัจจัยของคืนนั้น และบันทึกเพิ่มเติมที่คุณพิมพ์</li><li>รายละเอียดพฤติกรรมที่คุณเลือกกรอก: ปริมาณ/เวลาคาเฟอีน ระยะเวลา/ความหนัก/เวลาเสร็จของการออกกำลังกาย และระดับความเครียดที่ประเมินเอง</li><li>เวลาจริงที่กดเริ่มนอน/ตื่น พร้อมเขตเวลาของอุปกรณ์</li><li>' + (CLOUD ? 'อีเมลและชื่อที่ใช้แสดง สำหรับบัญชีของคุณ' : 'ชื่อผู้ใช้ของบัญชีในเครื่องนี้') + '</li><li>เป้าหมายการนอนที่คุณตั้งเอง (อายุที่กรอกเพื่อดูช่วงแนะนำจะไม่ถูกเก็บ)</li></ul>' +
      '<h3>ใช้ทำอะไรและจัดเก็บอย่างไร</h3><p>แสดงสถิติ แนวโน้ม และการเปรียบเทียบข้อมูลพฤติกรรมกับการนอนจากบันทึกของคุณเท่านั้น การเปรียบเทียบเป็นข้อมูลเชิงสังเกต ไม่ยืนยันเหตุและผล และไม่ใช่การวินิจฉัยทางการแพทย์ ' + (CLOUD ? 'เมื่อใช้โหมด Cloud ข้อมูลจะส่งไปยัง Supabase project ที่เชื่อมต่อเพื่อจัดเก็บ; ผู้ดูแล project อาจจัดการข้อมูลได้ตามสิทธิ์ของ project และนโยบายของผู้ให้บริการ แอปจำกัดการเข้าถึงแถวข้อมูลให้บัญชีเจ้าของข้อมูลตาม RLS' : 'เมื่อใช้โหมดในเครื่อง ข้อมูลจะอยู่ใน browser ของอุปกรณ์นี้และไม่ซิงก์ไปอุปกรณ์อื่น') + ' ไม่นำข้อมูลไปใช้โฆษณาหรือขาย</p>' +
      '<h3>สิทธิของคุณ</h3><ul><li>ดูข้อมูลทั้งหมดในแอป และส่งออกเป็น CSV ได้ทุกเมื่อ</li><li>แก้ไขหรือลบบันทึกรายคืนได้</li><li>ถอนความยินยอมได้ในหน้าตั้งค่า > นโยบายความเป็นส่วนตัว การถอนจะลบบัญชีและข้อมูลทั้งหมดของคุณ</li></ul>' +
      '<h3>ติดต่อ</h3><p>' + (contact ? esc(contact) : 'ติดต่อผู้พัฒนาที่ให้บริการแอปนี้แก่คุณ') + '</p></div>';
  }
  function showPrivacy() {
    var ov = document.createElement('div'); ov.className = 'ov'; ov.style.zIndex = 80;
    ov.innerHTML = '<div class="dlg wide" role="dialog" aria-modal="true" aria-labelledby="dt"><h2 id="dt" class="inl">' + ic('shield-check') + 'นโยบายความเป็นส่วนตัว</h2>' + privacyHtml() + '<div class="actions"><button class="btn2" data-x="no">ปิด</button></div></div>';
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-x]')) ov.remove(); });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') ov.remove(); });
    document.body.appendChild(ov); try { lucide.createIcons(); } catch (e) {} ov.querySelector('[data-x=no]').focus();
  }
  function showConsent() {
    document.body.classList.remove('authed'); authEl.hidden = false;
    authEl.innerHTML = authShell('<div class="center-ic">' + ic('shield-check') + '</div><div style="text-align:center"><h1>ก่อนเริ่มบันทึก</h1><p class="cap" style="margin:8px 0 0">ขอความยินยอมในการเก็บข้อมูลการนอนของคุณ</p></div>' + privacyHtml() +
      '<label class="chk" for="cons"><input type="checkbox" id="cons"><span>ฉันยินยอมให้เก็บและใช้ข้อมูลการนอนของฉันตามนโยบายนี้ และถอนความยินยอมได้ทุกเมื่อ</span></label><div class="err" id="err" role="alert"></div>' +
      '<button class="btn block" data-act="consentok" disabled>' + ic('check') + 'ยอมรับและใช้งานต่อ</button><button class="link" data-act="consentno">ไม่ยอมรับ (ออกจากระบบ)</button>');
    try { lucide.createIcons(); } catch (e) {} authSync();
  }
  function doDeleteAccount() {
    if (CLOUD) cloud.deleteAccount().then(function () { rmk('gn.data.' + user.id); logout(true); }).catch(function (e) { toast(e.network ? 'ลบไม่สำเร็จ: เชื่อมต่อเซิร์ฟเวอร์ไม่ได้' : 'ลบบัญชีไม่สำเร็จ ตรวจสอบว่าตั้งค่าฐานข้อมูลครบแล้ว'); });
    else { dropAccount(user); logout(); }
  }

  /* first-run goal setup (age is only used to suggest a range; it is not stored) */
  var obGoal = 480, obBed = null, ageVal = '', obTouched = false;
  function recHtml(goal) {
    var r = G.sleepRec(ageVal);
    if (!String(ageVal).trim()) return '<span class="sub">กรอกอายุเพื่อดูช่วงชั่วโมงนอนที่แนะนำ (ไม่บังคับ)</span>';
    if (!r) return '<span class="sub low">กรอกอายุระหว่าง 6–100 ปี</span>';
    var out = goal < r.min ? '<span class="sub low">เป้าหมายตอนนี้ต่ำกว่าช่วงที่แนะนำสำหรับวัยนี้</span>' : goal > r.max ? '<span class="sub low">เป้าหมายตอนนี้สูงกว่าช่วงที่แนะนำสำหรับวัยนี้</span>' : '<span class="sub good">เป้าหมายตอนนี้อยู่ในช่วงที่แนะนำ</span>';
    return '<span class="inl"><b>' + r.group + '</b></span><span>แนะนำนอนประมาณ <b>' + r.min / 60 + '–' + r.max / 60 + ' ชั่วโมง</b>ต่อคืน</span>' + out +
      '<button type="button" class="btn2 sm" data-act="userec">' + ic('sparkles', 'sm') + 'ใช้ค่าแนะนำ ' + r.mid / 60 + ' ชม.</button><span class="sub">เป็นช่วงแนะนำทั่วไป ไม่ใช่คำแนะนำเฉพาะบุคคล</span>';
  }
  function picksHtml(cur) {
    var r = G.sleepRec(ageVal), list = [];
    if (r) for (var m = r.min; m <= r.max; m += 30) list.push(m); else list = [420, 450, 480, 510, 540];
    return list.map(function (m) { return '<button type="button" class="chip' + (m === cur ? ' on' : '') + '" data-act="obpick" data-v="' + m + '" aria-pressed="' + (m === cur) + '">' + m / 60 + ' ชม.</button>'; }).join('');
  }
  var ageOpen = false;
  function ageInner() {
    if (!ageOpen) return '';
    return '<div class="fld"><label for="age">อายุของคุณ <span class="sub">(ใช้ดูช่วงที่แนะนำเท่านั้น)</span></label><input class="inp" id="age" type="number" inputmode="numeric" min="6" max="100" placeholder="เช่น 21" value="' + esc(ageVal) + '"></div><div class="rec" id="recBox"></div>';
  }
  function ageField() { return '<div id="ageBox" class="fld"' + (ageOpen ? '' : ' hidden') + '>' + ageInner() + '</div>'; }
  function ageLink() { return '<button type="button" class="link" data-act="ageopen" aria-expanded="' + ageOpen + '">ไม่รู้ว่าควรนอนกี่ชั่วโมง?</button>'; }
  function obUpdate() {
    var hf = $i('obH'); if (hf && document.activeElement !== hf && document.activeElement !== $i('obM')) writeHM('ob', obGoal);
    var pk = document.getElementById('picks'); if (pk) pk.innerHTML = picksHtml(obGoal);
    var rb = document.getElementById('recBox'); if (rb) rb.innerHTML = recHtml(obGoal);
    try { lucide.createIcons(); } catch (e) {}
  }
  function showOnboard() {
    obGoal = S.goal || 480; obBed = null; ageOpen = false; obTouched = false; document.body.classList.remove('authed'); authEl.hidden = false;
    authEl.innerHTML = authShell('<div class="center-ic">' + ic('target') + '</div><div style="text-align:center"><h1>ตั้งเป้าหมายการนอน</h1><p class="cap" style="margin:8px 0 0">คุณอยากนอนหลับจริงคืนละกี่ชั่วโมง?</p></div>' +
      '<div class="lrow" style="justify-content:flex-end">' + ageLink() + '</div>' + ageField() +
      '<div class="fld"><span class="lbl">ชั่วโมงนอนที่ต้องการต่อคืน</span>' + durInput('ob', obGoal, 'เป้าหมายชั่วโมงนอน') + '</div>' +
      '<div class="who-list" id="picks" style="justify-content:center;margin:0"></div>' +
      '<div class="fld"><span class="lbl">เวลาเข้านอนที่ตั้งเป้าไว้ <span class="sub">(ไม่บังคับ ปล่อยว่างได้)</span></span>' + clockInput('obbed', obBed, 'เวลาเข้านอนเป้าหมาย') + '</div>' +
      '<p class="hint" style="margin:0;text-align:center">เปลี่ยนได้ทุกเมื่อในหน้าตั้งค่า</p>' +
      '<button class="btn block" data-act="obdone">' + ic('check') + 'เริ่มใช้งาน</button><button class="link" data-act="obskip">ข้ามไปก่อน (ใช้ 8 ชั่วโมง)</button>');
    obUpdate();
  }
  function finishOnboard(goal) {
    S.goal = goal; S.onboarded = true; if (CLOUD) window.GNSync.markProfile(pend()); save(); flush();
    if (obBed !== null && goal !== 'skip') setGoalBed(obBed);
    authEl.hidden = true; authEl.innerHTML = ''; document.body.classList.add('authed'); nav('home'); toast('ตั้งเป้าหมาย ' + gh(goal) + ' ต่อคืนแล้ว');
  }

  /* local-mode accounts (used only when no server is configured) */
  function localRegister() {
    var name = document.getElementById('u').value.trim(), p1 = document.getElementById('p').value, p2 = document.getElementById('p2').value;
    if (name.length < 2 || name.length > 30) return aerr('ชื่อผู้ใช้ต้องยาว 2–30 ตัวอักษร');
    if (users().some(function (x) { return x.name.toLowerCase() === name.toLowerCase(); })) return aerr('มีชื่อผู้ใช้นี้ในเครื่องนี้แล้ว');
    if (p1.length < PW_MIN) return aerr('รหัสผ่านต้องมีอย่างน้อย ' + PW_MIN + ' ตัวอักษร');
    if (window.GNBcrypt && GNBcrypt.tooLong(p1)) return aerr('รหัสผ่านยาวเกินไป (ไม่เกิน 72 ไบต์)');
    if (p1 !== p2) return aerr('รหัสผ่านสองช่องไม่ตรงกัน');
    if (!(document.getElementById('cons') || {}).checked) return aerr('ต้องยอมรับนโยบายความเป็นส่วนตัวก่อนสร้างบัญชี');
    busy(true); aerr('');
    var u = { id: rand(6), name: name, alg: 'bcrypt', consent: newConsent() };
    GNBcrypt.hash(p1, GNBcrypt.COST).then(function (h) {
      u.hash = h; var list = users(); list.push(u); wr('gn.users', list);
      var legacy = rd('gn.v1'); if (legacy && Array.isArray(legacy.entries) && list.length === 1) { wr('gn.data.' + u.id, { entries: legacy.entries, goal: legacy.goal || 480 }); rmk('gn.v1'); }
      enter(u, true);
    }).catch(function () { busy(false); aerr('สร้างบัญชีไม่สำเร็จ ลองใหม่อีกครั้ง'); });
  }
  /* bcrypt accounts verify directly; older PBKDF2/SHA accounts verify the old way and are upgraded to bcrypt on the spot */
  function verifyLocal(u, pw) {
    if (u.alg === 'bcrypt') return GNBcrypt.compare(pw, u.hash);
    return hashPw(pw, u.salt, u.alg || 'pbkdf2').then(function (h) {
      if (h !== u.hash) return false;
      return GNBcrypt.hash(pw, GNBcrypt.COST).then(function (nh) {
        var list = users(); list.forEach(function (x) { if (x.id === u.id) { x.alg = 'bcrypt'; x.hash = nh; delete x.salt; } }); wr('gn.users', list); return true;
      }, function () { return true; });
    });
  }
  function localLogin() {
    var name = document.getElementById('u').value.trim(), pw = document.getElementById('p').value;
    if (!name || !pw) return aerr('กรอกชื่อผู้ใช้และรหัสผ่าน');
    var u = users().filter(function (x) { return x.name.toLowerCase() === name.toLowerCase(); })[0];
    busy(true); aerr('');
    (u ? verifyLocal(u, pw) : GNBcrypt.hash(pw, GNBcrypt.COST).then(function () { return false; })).then(function (ok) {
      if (ok) enter(u); else { busy(false); aerr('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); }
    }).catch(function () { busy(false); aerr('เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง'); });
  }
  function dropAccount(u) {
    wr('gn.users', users().filter(function (x) { return x.id !== u.id; })); rmk('gn.data.' + u.id);
    if (rd('gn.session') === u.id) rmk('gn.session');
  }

  /* cloud accounts */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function cloudRegister() {
    var nm = document.getElementById('nm').value.trim(), em = document.getElementById('u').value.trim(), p1 = document.getElementById('p').value, p2 = document.getElementById('p2').value;
    if (nm.length < 2 || nm.length > 30) return aerr('ชื่อที่ใช้แสดงต้องยาว 2–30 ตัวอักษร');
    if (!EMAIL.test(em)) return aerr('รูปแบบอีเมลไม่ถูกต้อง');
    if (p1.length < PW_MIN) return aerr('รหัสผ่านต้องมีอย่างน้อย ' + PW_MIN + ' ตัวอักษร');
    if (window.GNBcrypt && GNBcrypt.tooLong(p1)) return aerr('รหัสผ่านยาวเกินไป (ไม่เกิน 72 ไบต์)');
    if (p1 !== p2) return aerr('รหัสผ่านสองช่องไม่ตรงกัน');
    if (!(document.getElementById('cons') || {}).checked) return aerr('ต้องยอมรับนโยบายความเป็นส่วนตัวก่อนสร้างบัญชี');
    pendingConsent = newConsent();
    busy(true); aerr('');
    cloud.signUp(nm, em, p1).then(function (r) {
      if (r.session) enter(userOf(r.session), true);
      else { pendingConsent = null; busy(false); aerr('สมัครไม่ได้: ตรวจใน Supabase ว่าปิด Confirm email แล้ว หากอีเมลนี้มีบัญชีอยู่แล้วให้กลับไปเข้าสู่ระบบ'); }
    }).catch(function (e) { busy(false); aerr(cerr(e)); });
  }
  function cloudLogin() {
    var em = document.getElementById('u').value.trim(), pw = document.getElementById('p').value;
    if (!em || !pw) return aerr('กรอกอีเมลและรหัสผ่าน');
    if (!EMAIL.test(em)) return aerr('รูปแบบอีเมลไม่ถูกต้อง');
    busy(true); aerr('');
    cloud.signIn(em, pw).then(function (sn) { enter(userOf(sn)); }).catch(function (e) { busy(false); aerr(cerr(e)); });
  }
  function sendReset() {
    var em = document.getElementById('u').value.trim();
    if (!EMAIL.test(em)) return aerr('รูปแบบอีเมลไม่ถูกต้อง');
    busy(true); aerr('');
    cloud.recover(em).then(function () { showAuth('notice', { title: 'ส่งลิงก์แล้ว', text: 'ถ้ามีบัญชีที่ใช้อีเมล ' + em + ' เราได้ส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้แล้ว (ตรวจในกล่องจดหมายขยะด้วย)' }); }).catch(function (e) { busy(false); aerr(cerr(e)); });
  }
  function setNewPw() {
    var p1 = document.getElementById('p').value, p2 = document.getElementById('p2').value;
    if (p1.length < PW_MIN) return aerr('รหัสผ่านต้องมีอย่างน้อย ' + PW_MIN + ' ตัวอักษร');
    if (window.GNBcrypt && GNBcrypt.tooLong(p1)) return aerr('รหัสผ่านยาวเกินไป (ไม่เกิน 72 ไบต์)');
    if (p1 !== p2) return aerr('รหัสผ่านสองช่องไม่ตรงกัน');
    busy(true); aerr('');
    cloud.updatePassword(p1, resetSession.access_token).then(function () { cloud.setSession(resetSession); toast('ตั้งรหัสผ่านใหม่แล้ว'); enter(userOf(resetSession)); }).catch(function (e) { busy(false); aerr(cerr(e)); });
  }
  function forgotPassword() {
    if (CLOUD) { showAuth('forgot'); return; }
    var name = document.getElementById('u').value.trim();
    var account = users().filter(function (item) { return item.name.toLowerCase() === name.toLowerCase(); })[0];
    if (!account) { aerr('กรอกชื่อผู้ใช้ของบัญชีที่ลืมรหัสผ่านก่อน'); return; }
    confirmBox('ลืมรหัสผ่าน?', 'ข้อมูลอยู่ในเครื่องนี้และไม่มีเซิร์ฟเวอร์ จึงกู้รหัสผ่านไม่ได้ ทางเดียวคือลบบัญชี "' + account.name + '" พร้อมบันทึกทั้งหมด แล้วสมัครใหม่', 'ลบบัญชีนี้', function () { dropAccount(account); showAuth(users().length ? 'login' : 'register'); });
  }

  function logout(force) {
    var done = function () {
      resetAiState();
      if (CLOUD) { var id = user && user.id; cloud.signOut(); if (id) rmk('gn.data.' + id); } else rmk('gn.session');
      user = null; S = { entries: [], goal: 480 }; setSync('', '');
      try { history.replaceState(null, '', '#login'); } catch (e) {}
      showAuth('login');
    };
    if (CLOUD && user && !force && pendingCount()) {
      flush().then(function () {
        if (pendingCount()) confirmBox('มีข้อมูลที่ยังไม่ซิงก์', 'ยังมี ' + pendingCount() + ' รายการที่ยังไม่ถูกส่งขึ้นเซิร์ฟเวอร์ (อาจกำลังออฟไลน์) ถ้าออกจากระบบตอนนี้ ข้อมูลเหล่านี้จะหายไป', 'ออกจากระบบ', done); else done();
      }); return;
    }
    done();
  }
  function boot() {
    if (window.GN_CONFIG_ERROR) {
      document.body.innerHTML = '<main style="max-width:640px;margin:12vh auto;padding:24px"><section class="card" role="alert"><h1>ตั้งค่า Good Night ไม่ครบ</h1><p>' + esc(window.GN_CONFIG_ERROR) + '</p><p>ตั้งค่า URL และ Supabase anon key ใน <code>web/config.js</code> โดยดูตัวอย่างจาก <code>web/config.example.js</code> แล้วโหลดหน้าใหม่</p></section></main>';
      return;
    }
    var fast = matchMedia('(prefers-reduced-motion: reduce)').matches, hashStr = location.hash, special = CLOUD && /access_token=|error_description=|[#&]error=/.test(hashStr), hp = Promise.resolve(null);
    if (special) { hp = cloud.fromHash(hashStr).catch(function () { return { error: 'ลิงก์หมดอายุหรือไม่ถูกต้อง' }; }); try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
    setTimeout(function () {
      splashEl.classList.add('out'); setTimeout(function () { splashEl.hidden = true; }, 450);
      hp.then(function (h) {
        if (h && h.error) { showAuth('login'); aerr(h.error); return; }
        if (h && h.type === 'recovery') { resetSession = h.session; showAuth('reset'); return; }
        if (h && h.session) { cloud.setSession(h.session); enter(userOf(h.session)); return; }
        if (CLOUD) { var sn = cloud.session(); if (sn) enter(userOf(sn)); else showAuth('login'); return; }
        var sid = rd('gn.session'), u = users().filter(function (x) { return x.id === sid; })[0];
        if (u) enter(u); else showAuth(users().length ? 'login' : 'register');
      });
    }, fast ? 300 : 1500);
  }

  /* ---------- app-owned cross-feature actions ---------- */
  function handleCoreAction(action, element) {
    switch (action) {
      case 'logout': logout(); return true;
      case 'delacct': confirmBox('ลบบัญชี ' + user.name + '?', 'บัญชีและบันทึกทั้งหมดจะถูกลบ ย้อนกลับไม่ได้ (ส่งออก CSV สำรองไว้ก่อนได้)', 'ลบบัญชี', doDeleteAccount); return true;
      case 'privacy': if (user && document.body.classList.contains('authed')) openPrivacy(); else showPrivacy(); return true;
      case 'consentok':
        if (!(document.getElementById('cons') || {}).checked) { aerr('ติ๊กช่องยินยอมก่อนจึงจะใช้งานต่อได้'); return true; }
        S.consent = newConsent(); persistPrefs(); authEl.hidden = true; authEl.innerHTML = '';
        if (!S.onboarded) showOnboard(); else { document.body.classList.add('authed'); startRoute(); }
        return true;
      case 'consentno': logout(true); return true;
      case 'withdraw': {
        var overlay = element.closest('.ov'); if (overlay) overlay.remove();
        confirmBox('ถอนความยินยอมและลบข้อมูล?', 'บัญชีและบันทึกทั้งหมดจะถูกลบ เพราะแอปใช้งานโดยไม่มีข้อมูลไม่ได้ ย้อนกลับไม่ได้ (ส่งออก CSV สำรองไว้ก่อนได้)', 'ถอนและลบทั้งหมด', doDeleteAccount);
        return true;
      }
      case 'syncnow':
        toast('กำลังซิงก์…');
        syncAndRefresh().then(function () { render(); toast(navigator.onLine ? 'ซิงก์แล้ว' : 'ออฟไลน์อยู่ จะซิงก์เมื่อมีอินเทอร์เน็ต'); });
        return true;
      case 'obpick': obGoal = +element.dataset.v; obTouched = true; obUpdate(); return true;
      case 'userec': {
        var recommendation = G.sleepRec(ageVal); if (!recommendation) return true;
        if (!authEl.hidden) { obGoal = recommendation.mid; obTouched = true; obUpdate(); }
        else {
          setGoal(recommendation.mid); writeHM('goal', recommendation.mid); hmErr('goal', '');
          var recommendationBox = $i('recBox');
          if (recommendationBox) { recommendationBox.innerHTML = recHtml(S.goal); try { lucide.createIcons(); } catch (e) {} }
          render(); toast('ตั้งเป้าหมาย ' + recommendation.mid / 60 + ' ชั่วโมงต่อคืนแล้ว');
        }
        return true;
      }
      case 'obdone': commitHM('ob'); commitHM('obbed'); finishOnboard(obGoal); return true;
      case 'obskip': obBed = null; finishOnboard(480); return true;
      default: return false;
    }
  }

  function dispatchFeatureEvent(type, event) {
    var handlers = featureMap && featureMap.events[type] || [];
    for (var i = 0; i < handlers.length; i++) if (handlers[i](event)) return true;
    return false;
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-go]');
    if (link) { nav(link.dataset.go, false, link.dataset.date); return; }
    var element = event.target.closest('[data-act]'); if (!element) return;
    var action = element.dataset.act, handler = featureMap && featureMap.actions[action];
    if (typeof handler === 'function') { handler(element, event); return; }
    handleCoreAction(action, element);
  });
  document.addEventListener('focusin', function (ev) { if (ev.target.classList && ev.target.classList.contains('tpi')) try { ev.target.select(); } catch (e) {} });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && ev.target.id === 'pfName') { var ns = document.querySelector('[data-act=namesave]'); if (ns) ns.click(); return; } if (ev.key === 'Enter' && /^(goal|ob|gbed|obbed)[HM]$/.test(ev.target.id)) { ev.target.blur(); return; } if (ev.key === 'Enter' && !authEl.hidden && ev.target.tagName === 'INPUT') { var b = document.getElementById('go'); if (b && !b.disabled) b.click(); } });
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (route === 'settings' && authEl.hidden && dispatchFeatureEvent('input', ev)) return;
    if (t.id === 'age') {
      ageVal = t.value; var rc = G.sleepRec(ageVal);
      if (!authEl.hidden) { if (rc && !obTouched) obGoal = rc.mid; obUpdate(); }
      else { var rb = document.getElementById('recBox'); if (rb) { rb.innerHTML = recHtml(S.goal); try { lucide.createIcons(); } catch (e) {} } }
      return;
    }
    if (hmHandle(t)) return;
    if (!authEl.hidden && authEl.contains(t)) authSync();
    dispatchFeatureEvent('input', ev);
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (dispatchFeatureEvent('change', ev)) return;
    var hm = /^(goal|ob|gbed|obbed)[HM]$/.exec(t.id); if (hm) { var gid = t.id.slice(0, -1); setTimeout(function () { var ae = document.activeElement; if (ae && ae.id && ae.id.slice(0, -1) === gid && /[HM]$/.test(ae.id)) return; commitHM(gid); }, 0); return; }
    if (!authEl.hidden && authEl.contains(t)) authSync();
  });
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (route === 'settings') render(); });
  window.addEventListener('appinstalled', function () { deferred = null; toast('ติดตั้งแอปแล้ว'); });
  window.addEventListener('hashchange', function () { router.syncHash(!!user); });

  /* ---------- start ---------- */
  render();
  boot();
})();
