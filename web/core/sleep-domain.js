/* Good Night – core logic (no DOM). Works in browser (window.GN) and node. */
(function (root) {
  'use strict';
  var DAY = 1440;

  var FACTORS = [
    { id: 'caffeine', label: 'คาเฟอีน', icon: 'coffee', positive: false },
    { id: 'phone', label: 'เล่นมือถือ', icon: 'smartphone', positive: false },
    { id: 'exercise', label: 'ออกกำลังกาย', icon: 'dumbbell', positive: true },
    { id: 'stress', label: 'เครียด', icon: 'brain', positive: false },
    { id: 'lateMeal', label: 'มื้อดึก', icon: 'utensils', positive: false },
    { id: 'alcohol', label: 'แอลกอฮอล์', icon: 'wine', positive: false }
  ];
  var ACTIONS = {
    caffeine: 'ลองงดคาเฟอีนหลัง 14:00 สัก 1 สัปดาห์',
    phone: 'ลองวางมือถือก่อนนอน 30 นาที',
    exercise: 'คงการออกกำลังกายไว้ต่อไป',
    stress: 'ลองหาเวลาผ่อนคลายก่อนนอน เช่น หายใจลึกๆ หรือเขียนระบายความคิด',
    lateMeal: 'ลองกินมื้อสุดท้ายให้ห่างจากเวลานอนอย่างน้อย 2–3 ชั่วโมง',
    alcohol: 'ลองงดแอลกอฮอล์ในคืนที่ต้องการพักผ่อนเต็มที่'
  };

  /* preset answers -> minutes (approximation chosen by the user) */
  var LAT_OPTS = [
    { label: 'แป๊บเดียว', sub: 'หัวถึงหมอนก็หลับ', value: 5, icon: 'zap' },
    { label: 'ปกติ', sub: 'ไม่นานมาก', value: 20, icon: 'smile' },
    { label: 'นานหน่อย', sub: 'พลิกตัวอยู่พักใหญ่', value: 45, icon: 'hourglass' },
    { label: 'หลับยาก', sub: 'นอนตาสว่างนาน', value: 90, icon: 'cloud-moon' }
  ];
  var AWK_OPTS = [
    { label: 'ไม่ตื่นเลย', sub: 'หลับยาวตลอดคืน', value: 0, icon: 'bed' },
    { label: 'เข้าห้องน้ำ', sub: 'ตื่นสั้นๆ แล้วหลับต่อ', value: 10, icon: 'door-open' },
    { label: 'ตื่นพักใหญ่', sub: 'กว่าจะกลับไปหลับ', value: 30, icon: 'eye' },
    { label: 'ตาค้าง', sub: 'ตื่นนานมาก', value: 60, icon: 'eye-off' }
  ];
  function nearest(v, opts) {
    var best = opts[0];
    opts.forEach(function (o) { if (Math.abs(o.value - v) < Math.abs(best.value - v)) best = o; });
    return best.value;
  }

  /* general sleep-duration ranges by age (National Sleep Foundation guidance); not personal medical advice */
  function sleepRec(age) {
    age = parseInt(age, 10);
    if (!(age >= 6 && age <= 100)) return null;
    var r = age <= 13 ? [9, 11, 'เด็กวัยเรียน (6–13 ปี)'] : age <= 17 ? [8, 10, 'วัยรุ่น (14–17 ปี)'] : age <= 64 ? [7, 9, 'ผู้ใหญ่ (18–64 ปี)'] : [7, 8, 'ผู้สูงอายุ (65 ปีขึ้นไป)'];
    return { min: r[0] * 60, max: r[1] * 60, mid: Math.round((r[0] + r[1]) / 2 * 2) / 2 * 60, group: r[2] };
  }

  function toMin(t) {
    var a = String(t || '').split(':');
    if (a.length < 2 || a[0] === '' || a[1] === '') return NaN;
    var h = +a[0], m = +a[1];
    return isNaN(h) || isNaN(m) ? NaN : h * 60 + m;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtT(m) { m = ((Math.round(m) % DAY) + DAY) % DAY; return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function fmtDur(m) { m = Math.round(m); return Math.floor(m / 60) + ' ชม. ' + pad(m % 60) + ' น.'; }
  function avg(a) { return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : 0; }
  function sd(a) { if (a.length < 2) return 0; var m = avg(a); return Math.sqrt(avg(a.map(function (x) { return (x - m) * (x - m); }))); }

  /* sleep numbers from what the user typed */
  function calc(bed, wake, lat, awk, span) {
    var b = toMin(bed), w = toMin(wake);
    lat = +lat || 0; awk = +awk || 0;
    if (isNaN(b) || isNaN(w)) return { ok: false, msg: 'กรอกเวลาเข้านอนและตื่นนอนให้ครบ' };
    var inBed;
    if (span !== undefined && span !== null && !isNaN(span)) {
      if (span <= 0) return { ok: false, msg: 'เวลาตื่นต้องอยู่หลังเวลาเข้านอน ตรวจสอบวันที่และเวลาอีกครั้ง' };
      if (span >= DAY) return { ok: false, msg: 'เวลาบนเตียงนานเกิน 24 ชั่วโมง ตรวจสอบวันที่อีกครั้ง' };
      inBed = span;
    } else {
      inBed = (w - b + DAY) % DAY;
      if (inBed === 0) return { ok: false, msg: 'เวลาเข้านอนและตื่นนอนต้องไม่เท่ากัน' };
    }
    if (lat + awk >= inBed) return { ok: false, msg: 'เวลาหลับช้ารวมตื่นกลางดึกต้องน้อยกว่าเวลาบนเตียง (' + fmtDur(inBed) + ')', inBed: inBed };
    var asleep = inBed - lat - awk;
    return { ok: true, inBed: inBed, asleep: asleep, eff: Math.round(asleep / inBed * 100), lost: lat + awk };
  }

  /* bedtime as minutes after 18:00, so 23:30 and 00:30 average sensibly */
  function bedNorm(t) { return (toMin(t) - 1080 + DAY) % DAY; }
  function bedAvg(entries) { return fmtT(avg(entries.map(function (e) { return bedNorm(e.bed); })) + 1080); }
  function wakeAvg(entries) { return fmtT(avg(entries.map(function (e) { return toMin(e.wake); }))); }

  function sortDesc(entries) { return entries.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }); }

  function ratedAvg(list) {
    var r = list.filter(function (e) { return e.rating > 0; }).map(function (e) { return e.rating; });
    return { n: r.length, avg: avg(r) };
  }
  var MIN_PER_GROUP = 3;
  function factorCompare(entries, f) {
    var W = entries.filter(function (e) { return e.factors.indexOf(f.id) > -1; });
    var O = entries.filter(function (e) { return e.factors.indexOf(f.id) < 0; });
    var rw = ratedAvg(W), ro = ratedAvg(O);
    return { f: f, W: W, O: O, rw: rw, ro: ro, need: MIN_PER_GROUP, enough: rw.n >= MIN_PER_GROUP && ro.n >= MIN_PER_GROUP, missWith: Math.max(0, MIN_PER_GROUP - rw.n), missWithout: Math.max(0, MIN_PER_GROUP - ro.n) };
  }
  function adviceStateAfter(state, key, action, date) {
    var next = {};
    Object.keys(state || {}).forEach(function (k) { next[k] = state[k]; });
    if (!key) return next;
    if (action === 'dismiss') next[key] = { dismissed: true };
    else if (action === 'snooze') next[key] = { until: addDays(date, 7) };
    else delete next[key];
    return next;
  }
  function visibleAdvice(items, state, date) {
    state = state || {};
    return items.filter(function (item) {
      var pref = state[item.id || item.title];
      return !pref || (!pref.dismissed && (!pref.until || pref.until <= date));
    });
  }

  var MIN_BEHAVIOR_RECORDS = 7;
  function behaviorAnalysis(entries, goal) {
    var metrics = {}, specs = [
      { key: 'caffeineMg', label: 'คาเฟอีนรวม', unit: 'มก.', value: function (e) { return e.caffeineMg; } },
      { key: 'caffeineGapMin', label: 'ช่วงจากคาเฟอีนแก้วสุดท้ายถึงเข้านอน', unit: 'นาที', value: function (e) { return e.caffeineMg > 0 && e.caffeineLastAt ? (toMin(e.bed) - toMin(e.caffeineLastAt) + DAY) % DAY : null; } },
      { key: 'exerciseMinutes', label: 'เวลาออกกำลังกาย', unit: 'นาที', value: function (e) { return e.exerciseMinutes; } },
      { key: 'exerciseGapMin', label: 'ช่วงจากออกกำลังกายเสร็จถึงเข้านอน', unit: 'นาที', value: function (e) { return e.exerciseMinutes > 0 && e.exerciseEndAt ? (toMin(e.bed) - toMin(e.exerciseEndAt) + DAY) % DAY : null; } },
      { key: 'stressLevel', label: 'ระดับความเครียดที่ผู้ใช้ประเมิน', unit: 'ระดับ', value: function (e) { return e.stressLevel; } },
    ];
    specs.forEach(function (spec) {
      var pairs = [];
      entries.forEach(function (entry) {
        var d = entry.behaviorDetails || {}, x = spec.value(Object.assign({ bed: entry.bed }, d));
        if (typeof x === 'number' && isFinite(x)) pairs.push({ x: x, y: sleepScore(entry, goal).score });
      });
      var r = null;
      if (pairs.length >= MIN_BEHAVIOR_RECORDS) {
        var mx = avg(pairs.map(function (p) { return p.x; })), my = avg(pairs.map(function (p) { return p.y; }));
        var cov = 0, vx = 0, vy = 0;
        pairs.forEach(function (p) { var dx = p.x - mx, dy = p.y - my; cov += dx * dy; vx += dx * dx; vy += dy * dy; });
        if (vx > 0 && vy > 0) r = Math.round(cov / Math.sqrt(vx * vy) * 100) / 100;
      }
      metrics[spec.key] = { label: spec.label, unit: spec.unit, n: pairs.length, r: r, minRecords: MIN_BEHAVIOR_RECORDS };
    });
    var intensity = ['light', 'moderate', 'vigorous'].map(function (level) {
      var group = entries.filter(function (e) { var d = e.behaviorDetails || {}; return d.exerciseMinutes > 0 && d.exerciseIntensity === level; });
      return { level: level, n: group.length, avgScore: group.length ? avgScore(group, goal) : null };
    });
    return { metrics: metrics, intensity: intensity, minRecords: MIN_BEHAVIOR_RECORDS,
      disclaimer: 'เปรียบเทียบเชิงสังเกตจากบันทึกของคุณเอง ไม่ใช่หลักฐานว่าเป็นเหตุและผล และไม่ใช้ปรับ Sleep Score' };
  }

  /* rule-based insights – every statement is computed from the user's own logs */
  function insights(entries, goal) {
    var n = entries.length;
    if (n < 7) return { enough: false, n: n, items: [] };
    var conf = n >= 14 ? 'ข้อมูลพอสมควร' : 'ข้อมูลเริ่มต้น';
    var items = [];

    var beds = entries.map(function (e) { return bedNorm(e.bed); });
    var s = Math.round(sd(beds));
    if (s >= 40) {
      var mid = avg(beds);
      var early = entries.filter(function (e) { return bedNorm(e.bed) <= mid; });
      var late = entries.filter(function (e) { return bedNorm(e.bed) > mid; });
      var ev = 'เวลาเข้านอนของคุณแกว่งประมาณ ±' + s + ' นาที';
      if (early.length >= 3 && late.length >= 3) {
        var ee = Math.round(avg(early.map(function (e) { return e.eff; }))), le = Math.round(avg(late.map(function (e) { return e.eff; })));
        if (ee - le >= 3) ev += ' คืนที่เข้านอนเร็วกว่าค่าเฉลี่ย (' + bedAvg(entries) + ') ประสิทธิภาพเฉลี่ย ' + ee + '% เทียบกับ ' + le + '%';
      }
      items.push({ tone: 'warn', icon: 'moon', title: 'เข้านอนให้ตรงเวลามากขึ้น', ev: ev, act: 'ลองตั้งเวลาเข้านอนให้ใกล้เคียง ' + bedAvg(entries) + ' อย่างน้อย 4 คืนในสัปดาห์', conf: conf, score: 100 });
    }

    var avgAsleep = Math.round(avg(entries.map(function (e) { return e.asleep; })));
    if (avgAsleep < 420) {
      items.push({ tone: 'warn', icon: 'clock', title: 'ระยะเวลาการนอนยังน้อยกว่า 7 ชั่วโมง', ev: 'หลับจริงเฉลี่ย ' + fmtDur(avgAsleep) + ' ต่อคืน เป้าหมายของคุณคือ ' + fmtDur(goal), act: 'ลองเข้านอนเร็วขึ้นทีละ 15 นาที', conf: conf, score: 90 });
    }

    var avgEff = Math.round(avg(entries.map(function (e) { return e.eff; })));
    if (avgEff < 85) {
      var al = Math.round(avg(entries.map(function (e) { return e.lat; }))), aa = Math.round(avg(entries.map(function (e) { return e.awk; })));
      var main = al >= aa ? 'หลับช้า (เฉลี่ย ' + al + ' นาที)' : 'ตื่นกลางดึก (เฉลี่ย ' + aa + ' นาที)';
      items.push({ tone: 'warn', icon: 'gauge', title: 'ประสิทธิภาพการนอนต่ำกว่า 85%', ev: 'ประสิทธิภาพเฉลี่ย ' + avgEff + '% เวลาที่เสียไปส่วนใหญ่มาจาก' + main, act: al >= aa ? 'ลองกิจวัตรผ่อนคลายก่อนนอน และไม่นอนบนเตียงถ้ายังไม่ง่วง' : 'ลองดูปัจจัยด้านล่างว่าคืนที่ตื่นบ่อยตรงกับอะไร', conf: conf, score: 80 });
    }

    FACTORS.forEach(function (f) {
      var c = factorCompare(entries, f);
      if (!c.enough) return;
      var d = c.rw.avg - c.ro.avg;
      if (Math.abs(d) >= 0.5) {
        var good = f.positive ? d > 0 : d > 0;
        items.push({
          tone: good ? 'good' : 'warn', icon: f.icon,
          title: good ? f.label + 'สัมพันธ์กับความสดชื่นที่สูงขึ้น' : f.label + 'สัมพันธ์กับความสดชื่นที่ต่ำลง',
          ev: 'คืนที่เลือก' + f.label + ' ความสดชื่นเฉลี่ย ' + c.rw.avg.toFixed(1) + ' เทียบกับ ' + c.ro.avg.toFixed(1) + ' (' + c.W.length + ' คืน เทียบ ' + c.O.length + ' คืน)',
          act: good ? 'คงไว้ต่อไป' : ACTIONS[f.id], conf: c.W.length >= 7 && c.O.length >= 7 ? 'ข้อมูลพอสมควร' : 'ข้อมูลเริ่มต้น',
          score: Math.abs(d) * 10 + (good ? 0 : 5)
        });
      }
      if (f.id === 'phone') {
        var wl = avg(c.W.map(function (e) { return e.lat; })), ol = avg(c.O.map(function (e) { return e.lat; }));
        if (c.W.length >= 3 && c.O.length >= 3 && wl - ol >= 8) {
          items.push({ tone: 'warn', icon: 'smartphone', title: 'เล่นมือถือก่อนนอนสัมพันธ์กับการหลับช้าลง', ev: 'เวลาหลับช้าเฉลี่ย ' + Math.round(wl) + ' นาที เทียบกับ ' + Math.round(ol) + ' นาทีในคืนที่ไม่ได้เล่น', act: ACTIONS.phone, conf: conf, score: (wl - ol) });
        }
      }
    });

    items.sort(function (a, b) { return b.score - a.score; });
    if (!items.length) items.push({ tone: 'good', icon: 'sparkles', title: 'ภาพรวมการนอนของคุณอยู่ในเกณฑ์ดี', ev: 'หลับจริงเฉลี่ย ' + fmtDur(avgAsleep) + ' ประสิทธิภาพเฉลี่ย ' + avgEff + '%', act: 'รักษารูปแบบนี้ไว้ และบันทึกต่อเนื่องเพื่อดูแนวโน้ม', conf: conf, score: 0 });
    return { enough: true, n: n, items: items };
  }

  function streak(entries, today) {
    var dates = {}; entries.forEach(function (e) { dates[e.date] = 1; });
    var d = new Date(today + 'T12:00:00'), k = 0;
    if (!dates[today]) d.setDate(d.getDate() - 1);   // today not logged yet: count from yesterday
    for (;;) {
      var s = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      if (!dates[s]) break; k++; d.setDate(d.getDate() - 1);
    }
    return k;
  }

  function csv(entries, goal) {
    var head = ['วันที่ตื่น', 'เข้านอน', 'ตื่นนอน', 'หลับช้า(นาที)', 'ตื่นกลางดึก(นาที)', 'เวลาบนเตียง(นาที)', 'หลับจริง(นาที)', 'ประสิทธิภาพ(%)', 'ความสดชื่น(1-5)', 'ความรู้สึก', 'Sleep Score', 'ปัจจัย', 'บันทึก', 'เริ่มนอน(UTC)', 'ตื่น(UTC)', 'เขตเวลา', 'คาเฟอีนรวม(มก.)', 'คาเฟอีนครั้งสุดท้าย', 'ออกกำลังกาย(นาที)', 'ความหนัก', 'เวลาออกกำลังกายเสร็จ', 'ความเครียด(1-5)'];
    var rows = sortDesc(entries).reverse().map(function (e) {
      var d = e.behaviorDetails || {};
      return [e.date, e.bed, e.wake, e.lat, e.awk, e.inBed, e.asleep, e.eff, e.rating || '', (moodOf(e.mood) || {}).label || '', sleepScore(e, goal || 480).score, e.factors.map(function (id) { var f = FACTORS.filter(function (x) { return x.id === id; })[0]; return f ? f.label : id; }).join(' / '), e.note || '', e.bedAt || '', e.wakeAt || '', e.tz || '', d.caffeineMg == null ? '' : d.caffeineMg, d.caffeineLastAt || '', d.exerciseMinutes == null ? '' : d.exerciseMinutes, d.exerciseIntensity || '', d.exerciseEndAt || '', d.stressLevel == null ? '' : d.stressLevel];
    });
    return '\ufeff' + [head].concat(rows).map(function (r) {
      return r.map(function (c) { c = String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(',');
    }).join('\r\n');
  }

  function normalizeBehaviorDetails(value) {
    if (value === null || value === undefined) value = {};
    if (typeof value !== 'object' || Array.isArray(value)) return null;
    var out = {}, numberFields = { caffeineMg: 2000, exerciseMinutes: 1440, stressLevel: 5 };
    Object.keys(numberFields).forEach(function (key) {
      if (!out) return;
      var raw = value[key];
      if (raw === '' || raw === null || raw === undefined) { out[key] = null; return; }
      var n = Number(raw), min = key === 'stressLevel' ? 1 : 0;
      if (!Number.isInteger(n) || n < min || n > numberFields[key]) { out = null; return; }
      out[key] = n;
    });
    if (!out) return null;
    ['caffeineLastAt', 'exerciseEndAt'].forEach(function (key) {
      if (!out) return;
      var raw = value[key];
      if (raw === '' || raw === null || raw === undefined) { out[key] = null; return; }
      var text = String(raw);
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) { out = null; return; }
      out[key] = text;
    });
    if (!out) return null;
    var intensity = value.exerciseIntensity || null;
    if (intensity !== null && ['light', 'moderate', 'vigorous'].indexOf(intensity) < 0) return null;
    out.exerciseIntensity = intensity;
    return out;
  }
  function mergeSessionEntry(sessionEntry, existing) {
    if (!existing) return sessionEntry;
    var merged = Object.assign({}, sessionEntry, {
      rating: existing.rating || 0, mood: existing.mood || '',
      factors: Array.isArray(existing.factors) ? existing.factors.slice() : [], note: existing.note || '',
      behaviorDetails: normalizeBehaviorDetails(existing.behaviorDetails),
    });
    return merged;
  }
  function preserveLocalBehaviorDetails(localEntries, remoteEntries) {
    var localByDate = {};
    (localEntries || []).forEach(function (entry) { localByDate[entry.date] = entry; });
    return (remoteEntries || []).map(function (remote) {
      var local = localByDate[remote.date];
      var details = local && normalizeBehaviorDetails(local.behaviorDetails);
      return details ? Object.assign({}, remote, { behaviorDetails: details }) : remote;
    });
  }

  function makeEntry(date, bed, wake, lat, awk, rating, factors, note, span, extra) {
    var c = calc(bed, wake, lat, awk, span);
    if (!c.ok) return null;
    var behaviorDetails = normalizeBehaviorDetails(extra && extra.behaviorDetails);
    if (!behaviorDetails) return null;
    var en = { date: date, bed: bed, wake: wake, lat: +lat || 0, awk: +awk || 0, inBed: c.inBed, asleep: c.asleep, eff: c.eff, rating: rating || 0, factors: factors || [], note: note || '', mood: (extra && extra.mood) || '', behaviorDetails: behaviorDetails };
    if (extra && extra.bedAt) { en.bedAt = extra.bedAt; en.wakeAt = extra.wakeAt || ''; en.tz = extra.tz || ''; en.bedTz = extra.bedTz || ''; }
    return en;
  }


  /* ---------- mood (US-06) ---------- */
  var MOODS = [
    { id: 'energized', label: 'มีพลัง', icon: 'zap' },
    { id: 'calm', label: 'สงบ ผ่อนคลาย', icon: 'leaf' },
    { id: 'neutral', label: 'เฉยๆ', icon: 'meh' },
    { id: 'tired', label: 'ยังเพลีย', icon: 'battery-low' },
    { id: 'irritable', label: 'หงุดหงิด', icon: 'angry' },
    { id: 'anxious', label: 'กังวล', icon: 'cloud-lightning' }
  ];
  function moodOf(id) { return MOODS.filter(function (m) { return m.id === id; })[0] || null; }

  /* ---------- Sleep Score (0–100) ----------
     = 50% ระยะเวลาหลับจริงเทียบเป้าหมาย (สูงสุด 100) + 30% ประสิทธิภาพการนอน + 20% ความสดชื่นตอนตื่น (1→0, 5→100)
     ถ้าคืนนั้นไม่ได้ให้คะแนนความสดชื่น จะคำนวณจากสองส่วนแรกและปรับน้ำหนักให้รวมเป็น 100% */
  var SCORE_W = { dur: 50, eff: 30, rest: 20 };
  function sleepScore(e, goal) {
    goal = goal > 0 ? goal : 480;
    var dur = Math.min(1, e.asleep / goal) * 100, eff = Math.max(0, Math.min(100, e.eff));
    var rest = e.rating > 0 ? (e.rating - 1) / 4 * 100 : null, w = SCORE_W;
    var tot = w.dur + w.eff + (rest === null ? 0 : w.rest);
    var s = (dur * w.dur + eff * w.eff + (rest === null ? 0 : rest * w.rest)) / tot;
    return { score: Math.round(s), dur: Math.round(dur), eff: Math.round(eff), rest: rest === null ? null : Math.round(rest), hasRest: rest !== null };
  }
  /* นอนน้อยมาก: หลับจริงต่ำกว่า 4 ชม. หรือต่ำกว่าครึ่งของเป้าหมาย — ประสิทธิภาพสูงในคืนแบบนี้ไม่ได้แปลว่านอนดี */
  var SHORT_MIN = 240;
  function isShort(asleep, goal) { return asleep < SHORT_MIN || asleep < (goal > 0 ? goal : 480) / 2; }
  function scoreLabel(s) { return s >= 85 ? 'ดีมาก' : s >= 70 ? 'ดี' : s >= 50 ? 'พอใช้' : 'ควรปรับปรุง'; }
  function avgScore(entries, goal) { return entries.length ? Math.round(avg(entries.map(function (e) { return sleepScore(e, goal).score; }))) : null; }

  /* ---------- date windows (ช่วง 7 วันจริง / รายเดือน) ---------- */
  function addDays(s, n) { var d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function byDate(entries) { var by = {}; entries.forEach(function (e) { by[e.date] = e; }); return by; }
  /* n calendar days ending on `end`; days with no log are { e: null } so charts keep real spacing */
  function windowSlots(entries, end, n) {
    var by = byDate(entries), out = [];
    for (var i = n - 1; i >= 0; i--) { var d = addDays(end, -i); out.push({ date: d, e: by[d] || null }); }
    return out;
  }
  function addMonths(ym, n) { var p = ym.split('-'), d = new Date(+p[0], +p[1] - 1 + n, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
  function monthSlots(entries, ym) {
    var p = ym.split('-'), days = new Date(+p[0], +p[1], 0).getDate(), by = byDate(entries), out = [];
    for (var i = 1; i <= days; i++) { var d = ym + '-' + pad(i); out.push({ date: d, e: by[d] || null }); }
    return out;
  }
  function present(slots) { return slots.filter(function (s) { return s.e; }).map(function (s) { return s.e; }); }

  /* ---------- เริ่มนอน / ตื่น (US-04, US-05) ---------- */
  var STALE_MIN = 20 * 60;
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function hm(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  /* ไม่เริ่มซ้ำ: ถ้ามี session ค้างอยู่แล้ว จะไม่สร้างใหม่ */
  function startSession(active, now, tz) {
    if (active && active.startAt) return { ok: false, reason: 'active', active: active };
    return { ok: true, active: { startAt: now.toISOString(), tz: tz || '', tzOffset: -now.getTimezoneOffset(), bed: hm(now), bedDate: ymd(now) } };
  }
  function sessionElapsed(active, now) {
    if (!active || !active.startAt) return 0;
    var elapsed = now - new Date(active.startAt), minutes = Math.round(elapsed / 60000);
    return elapsed > 0 ? Math.max(1, minutes) : minutes;
  }
  /* ระยะเวลานับจาก timestamp จริง จึงถูกต้องแม้ข้ามเที่ยงคืนหรือเปลี่ยนเขตเวลา */
  function finishSession(active, now, tz) {
    if (!active || !active.startAt) return { ok: false, reason: 'none' };
    var span = sessionElapsed(active, now);
    if (span <= 0) return { ok: false, reason: 'negative', span: span };
    if (span >= DAY) return { ok: false, reason: 'toolong', span: span };
    return { ok: true, span: span, latency: span < 21 ? 0 : 20, stale: span >= STALE_MIN, date: ymd(now), bed: active.bed, bedDate: active.bedDate, wake: hm(now),
      extra: { bedAt: active.startAt, wakeAt: now.toISOString(), tz: tz || '', bedTz: active.tz || '' } };
  }

  /* ---------- เป้าหมายเวลาเข้านอน (US-01) ---------- */
  function bedDiff(bed, goalBed) { var d = toMin(bed) - goalBed; return ((((d + DAY / 2) % DAY) + DAY) % DAY) - DAY / 2; }   // + = เข้านอนช้ากว่าเป้า
  function bedBaseline(entries) { var l = sortDesc(entries).slice(0, 14); return l.length >= 3 ? { bed: bedAvg(l), n: l.length } : null; }
  function bedVsGoal(entries, goalBed, tol) {
    if (goalBed === null || goalBed === undefined || !entries.length) return null;
    tol = tol === undefined ? 30 : tol;
    var diffs = entries.map(function (e) { return bedDiff(e.bed, goalBed); });
    return { n: diffs.length, avgDiff: Math.round(avg(diffs)), within: diffs.filter(function (d) { return Math.abs(d) <= tol; }).length, tol: tol };
  }

  /* ---------- bedtime suggestion + 7-day review ---------- */
  function dayDiff(a, b) { return Math.round((new Date(a + 'T12:00:00') - new Date(b + 'T12:00:00')) / 86400000); }
  /* best 30-minute bedtime window by average Sleep Score over the latest 30 nights (needs 7+ nights, 2+ nights in the window) */
  function bedSuggest(entries, goal, goalBed) {
    if (entries.length < 7) return null;
    var es = sortDesc(entries).slice(0, 30), bins = {}, best = null;
    es.forEach(function (e) { var k = Math.round(bedNorm(e.bed) / 30) * 30; (bins[k] = bins[k] || []).push(sleepScore(e, goal).score); });
    Object.keys(bins).forEach(function (k) { var a = bins[k]; if (a.length < 2) return; var m = avg(a); if (!best || m > best.avg) best = { norm: +k, avg: m, n: a.length }; });
    if (!best) return null;
    var overall = avg(es.map(function (e) { return sleepScore(e, goal).score; }));
    if (best.avg - overall < 3) return null;                                   // no time clearly better than usual
    var bed = fmtT(best.norm + 1080);
    if (goalBed !== null && goalBed !== undefined && Math.abs(bedDiff(bed, goalBed)) < 30) return null;   // already the goal
    return { bed: bed, min: toMin(bed), avg: Math.round(best.avg), n: best.n, overall: Math.round(overall), nAll: es.length };
  }
  /* 7+ days after setting a bedtime goal: Sleep Score before vs after, and how often the goal was met */
  function goalReview(entries, goal, goalBed, since, today) {
    if (!since || dayDiff(today, since) < 7) return null;
    var after = entries.filter(function (e) { return e.date >= since; });
    if (after.length < 3) return null;
    var before = sortDesc(entries.filter(function (e) { return e.date < since; })).slice(0, 14);
    var a = avgScore(after, goal), b = before.length >= 3 ? avgScore(before, goal) : null, v = bedVsGoal(after, goalBed);
    return { after: a, before: b, delta: b === null ? null : a - b, nAfter: after.length, nBefore: before.length, within: v ? v.within : 0 };
  }

  root.GN = { dayDiff: dayDiff, bedSuggest: bedSuggest, goalReview: goalReview, isShort: isShort, SHORT_MIN: SHORT_MIN, MOODS: MOODS, moodOf: moodOf, sleepScore: sleepScore, scoreLabel: scoreLabel, avgScore: avgScore, SCORE_W: SCORE_W, addDays: addDays, windowSlots: windowSlots, addMonths: addMonths, monthSlots: monthSlots, present: present, startSession: startSession, finishSession: finishSession, sessionElapsed: sessionElapsed, STALE_MIN: STALE_MIN, bedDiff: bedDiff, bedBaseline: bedBaseline, bedVsGoal: bedVsGoal, bedNorm: bedNorm, sleepRec: sleepRec, LAT_OPTS: LAT_OPTS, AWK_OPTS: AWK_OPTS, nearest: nearest, FACTORS: FACTORS, toMin: toMin, fmtT: fmtT, fmtDur: fmtDur, avg: avg, calc: calc, bedAvg: bedAvg, wakeAvg: wakeAvg, sortDesc: sortDesc, ratedAvg: ratedAvg, factorCompare: factorCompare, adviceStateAfter: adviceStateAfter, visibleAdvice: visibleAdvice, behaviorAnalysis: behaviorAnalysis, MIN_BEHAVIOR_RECORDS: MIN_BEHAVIOR_RECORDS, normalizeBehaviorDetails: normalizeBehaviorDetails, mergeSessionEntry: mergeSessionEntry, preserveLocalBehaviorDetails: preserveLocalBehaviorDetails, insights: insights, streak: streak, csv: csv, makeEntry: makeEntry };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.GN;
})(typeof window !== 'undefined' ? window : globalThis);
