const RATE_LABELS = ['แย่มาก', 'ไม่ค่อย', 'พอใช้', 'สดชื่น', 'สดชื่นมาก'];

export function renderAuthPage({ authMode, msg, CLOUD, PW_MIN, input, passwordField, authShell, ic, esc }) {
  const register = authMode === 'register', forgot = authMode === 'forgot', reset = authMode === 'reset';
  if (authMode === 'notice') {
    return {
      html: authShell('<div class="center-ic">' + ic('mail-check') + '</div><div style="text-align:center"><h1>' + esc(msg.title) + '</h1><p class="cap" style="margin:8px 0 0">' + esc(msg.text) + '</p></div>' +
        '<button class="btn block" data-act="tologin">' + ic('log-in') + 'กลับไปหน้าเข้าสู่ระบบ</button>'),
      focusId: null,
    };
  }
  const title = reset ? 'ตั้งรหัสผ่านใหม่' : forgot ? 'ลืมรหัสผ่าน' : register ? 'สร้างบัญชี' : 'ยินดีต้อนรับกลับมา';
  const subtitle = reset ? 'ตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ' : forgot ? 'กรอกอีเมล เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้' : register ? 'สร้างบัญชีเพื่อเริ่มบันทึกการนอน' + (CLOUD ? ' ข้อมูลจะตามคุณไปทุกเครื่อง · ใช้อีเมลรูปแบบถูกต้องสำหรับทดสอบได้ ไม่ต้องยืนยันอีเมล (การกู้รหัสผ่านต้องใช้อีเมลที่เข้าถึงได้)' : '') : 'เข้าสู่ระบบเพื่อดูบันทึกการนอนของคุณ';
  let fields = '';
  if (reset) fields = passwordField('p', 'รหัสผ่านใหม่', 'new-password') + passwordField('p2', 'ยืนยันรหัสผ่านใหม่', 'new-password');
  else if (forgot) fields = input('u', 'อีเมล', 'email', 'email', 'inputmode="email" autocapitalize="none" spellcheck="false"');
  else {
    if (register && CLOUD) fields += input('nm', 'ชื่อที่ใช้แสดง', 'text', 'name');
    fields += CLOUD ? input('u', 'อีเมล', 'email', 'username', 'inputmode="email" autocapitalize="none" spellcheck="false"') : input('u', 'ชื่อผู้ใช้', 'text', 'username', 'autocapitalize="none" spellcheck="false"');
    fields += passwordField('p', 'รหัสผ่าน', register ? 'new-password' : 'current-password') + (register ? passwordField('p2', 'ยืนยันรหัสผ่าน', 'new-password') + '<div class="sub">รหัสผ่านอย่างน้อย ' + PW_MIN + ' ตัวอักษร</div><label class="chk" for="cons"><input type="checkbox" id="cons"><span>ฉันได้อ่านและยอมรับ <button type="button" class="link" data-act="privacy">นโยบายความเป็นส่วนตัว</button> และยินยอมให้เก็บและใช้ข้อมูลการนอนของฉันตามนั้น ถอนความยินยอมได้ทุกเมื่อในหน้าตั้งค่า</span></label>' : '');
  }
  const action = reset ? 'setpw' : forgot ? 'sendreset' : register ? 'register' : 'login';
  const actionLabel = reset ? 'บันทึกรหัสผ่านใหม่' : forgot ? 'ส่งลิงก์ตั้งรหัสผ่านใหม่' : register ? 'สร้างบัญชี' : 'เข้าสู่ระบบ';
  const actionIcon = reset ? 'key-round' : forgot ? 'send' : register ? 'user-plus' : 'log-in';
  const switchLink = reset ? '' : '<div class="sep"></div><div class="cap" style="text-align:center">' + (authMode === 'login' ? 'ยังไม่มีบัญชี? <button class="link" data-act="toreg">สมัครใช้งาน</button>' : 'มีบัญชีอยู่แล้ว? <button class="link" data-act="tologin">เข้าสู่ระบบ</button>') + '</div>';
  return {
    html: authShell('<div><h1>' + title + '</h1><p class="cap" style="margin:6px 0 0">' + subtitle + '</p></div>' + fields + '<div class="err" id="err" role="alert"></div>' +
      '<button class="btn block" id="go" data-act="' + action + '">' + ic(actionIcon) + actionLabel + '</button>' + switchLink),
    focusId: register && CLOUD ? 'nm' : reset ? 'p' : 'u',
  };
}

function options(group, list, selected, ic) {
  return '<div class="opts" role="radiogroup">' + list.map((option) =>
    '<button type="button" class="opt" role="radio" data-act="opt" data-g="' + group + '" data-v="' + option.value + '" aria-checked="' + (option.value === selected) + '"><b>' + ic(option.icon, 'sm') + option.label + '</b><span class="sub">' + option.sub + '</span></button>'
  ).join('') + '</div>';
}

function timePicker(field, icon, label, dateId, dateLabel, ic) {
  return '<div class="tp"><span class="lbl">' + ic(icon) + label + '</span>' +
    '<div class="fld"><label class="sub" for="' + dateId + '">' + dateLabel + '</label><input class="dtin" id="' + dateId + '" type="date"></div>' +
    '<div class="tp-row"><button type="button" class="sb" data-act="tstep" data-f="' + field + '" data-d="-15" aria-label="' + label + ' ลด 15 นาที">' + ic('minus') + '</button>' +
    '<div class="tp-in" role="group" aria-label="' + label + ' (24 ชั่วโมง)"><input class="tpi" id="' + field + 'H" inputmode="numeric" maxlength="2" autocomplete="off" aria-label="ชั่วโมง"><span>:</span><input class="tpi" id="' + field + 'M" inputmode="numeric" maxlength="2" autocomplete="off" aria-label="นาที"></div>' +
    '<button type="button" class="sb" data-act="tstep" data-f="' + field + '" data-d="15" aria-label="' + label + ' เพิ่ม 15 นาที">' + ic('plus') + '</button></div></div>';
}

function logModeSwitch(current) {
  return '<div class="segwrap"><div class="seg" role="group" aria-label="วิธีบันทึก">' + [['timer', 'จับเวลา'], ['manual', 'กรอกเวลา']].map((item) =>
    '<button data-act="logmode" data-v="' + item[0] + '" aria-pressed="' + (current === item[0]) + '">' + item[1] + '</button>'
  ).join('') + '</div></div>';
}

export function renderSessionCard({ G, S, fmtDate, ic, elapsedTxt }) {
  const active = S.active;
  if (!active || !active.startAt) return '<div class="card sess"><div class="row2"><div><h2 class="inl">' + ic('moon') + 'พร้อมนอนแล้วหรือยัง</h2><p class="hint" style="margin:4px 0 0">กด "เริ่มนอน" ตอนเข้านอน แล้วกด "ตื่นแล้ว" ตอนตื่น ระบบจะคำนวณเวลาให้ และเก็บเวลาจริงพร้อมเขตเวลา</p></div><button class="btn" data-act="sstart">' + ic('moon') + 'เริ่มนอน</button></div></div>';
  const elapsed = G.sessionElapsed(active, new Date());
  const stale = elapsed >= G.STALE_MIN;
  return '<div class="card sess on"><div class="row2"><div><h2 class="inl">' + ic('moon-star') + 'กำลังนอนอยู่</h2><p class="hint" style="margin:4px 0 0">เริ่มเมื่อ ' + active.bed + ' น. (' + fmtDate(active.bedDate, { day: 'numeric', month: 'short' }) + ') · ผ่านมา <b id="sessEl">' + elapsedTxt(Math.max(0, elapsed)) + '</b></p>' +
    (stale ? '<p class="hint low" style="margin:6px 0 0">session นี้เริ่มมานานแล้ว ถ้าลืมกดตื่น ให้ตรวจเวลาตื่นในหน้าบันทึก หรือยกเลิก</p>' : '<p class="hint" style="margin:6px 0 0">รีเฟรชหน้าหรือปิดแอปได้ เวลาเริ่มจะไม่หาย</p>') + '</div>' +
    '<div class="inl" style="gap:10px"><button class="btn2" data-act="scancel">ยกเลิก</button><button class="btn" data-act="swake">' + ic('sun') + 'ตื่นแล้ว</button></div></div></div>';
}

export function renderSleepLog({ G, draft, logMode, CLOUD, V3, esc, ic, sessionCard }) {
  const d = draft;
  const behavior = d.behaviorDetails || G.normalizeBehaviorDetails();
  const mode = d.editing || d.fromSession ? 'manual' : logMode;
  if (mode === 'timer') return '<div><h1>บันทึกการนอน</h1><div class="cap">เลือกวิธีบันทึก: จับเวลา หรือกรอกเวลา</div></div>' + logModeSwitch('timer') + sessionCard() +
    '<p class="hint">ลืมกดเริ่มนอน? เลือก "กรอกเวลา" เพื่อบันทึกย้อนหลังได้</p>';
  return '<div><h1>' + (d.editing ? 'แก้ไขบันทึกการนอน' : 'บันทึกการนอน') + '</h1>' + (d.fromSession ? '<div class="cap">จากการกดเริ่มนอน/ตื่น · เวลาบนเตียงบันทึกอัตโนมัติแล้ว · ตรวจค่าหลับช้า 20 นาที/ตื่นกลางดึก 0 นาที และปรับให้ตรงกับจริงได้' + (d.editing ? ' · <span class="low">อัปเดตเวลาในบันทึกเดิม โดยเก็บคะแนน ความรู้สึก และพฤติกรรมไว้</span>' : '') + '</div>' : '') + '</div>' + (d.editing || d.fromSession ? '' : logModeSwitch('manual')) +
    '<div class="g gl"><div class="stack">' +
    '<div class="card"><h2>เข้านอนและตื่นเมื่อไหร่</h2><div class="g g2">' + timePicker('bed', 'moon', 'เข้านอน', 'bedDate', 'วันที่เข้านอน', ic) + timePicker('wake', 'sun', 'ตื่นนอน', 'date', 'วันที่ตื่นนอน', ic) + '</div></div>' +
    '<div class="card"><h2>การนอนหลับเป็นอย่างไรบ้าง</h2><div class="fld"><span class="lbl">ใช้เวลาหลับนานเท่าไหร่</span>' + options('lat', G.LAT_OPTS, d.lat, ic) + '</div><div class="fld"><span class="lbl">ตื่นกลางดึกหรือไม่</span>' + options('awk', G.AWK_OPTS, d.awk, ic) + '</div></div>' +
    '<div class="card"><h2>ตื่นมา สดชื่นแค่ไหน <span class="sub">(ไม่บังคับ)</span></h2><div class="rates" role="radiogroup">' + RATE_LABELS.map((label, index) => '<button type="button" class="rt" role="radio" data-act="rate" data-v="' + (index + 1) + '" aria-checked="false"><b>' + (index + 1) + '</b><span>' + label + '</span></button>').join('') + '</div></div>' +
    '<div class="card"><h2>ตื่นมารู้สึกอย่างไร <span class="sub">(ไม่บังคับ)</span></h2><div class="chips moods" role="radiogroup" aria-label="ความรู้สึกตอนตื่น">' + G.MOODS.map((mood) => '<button type="button" class="chip" role="radio" data-act="mood" data-m="' + mood.id + '" aria-checked="false" aria-pressed="false">' + ic(mood.icon, 'sm') + mood.label + ic('check', 'sm ck') + '</button>').join('') + '</div></div>' +
    '<div class="card"><h2>เมื่อคืน มีปัจจัยอะไรบ้าง <span class="sub">(เลือกได้หลายข้อ)</span></h2><div class="chips">' + G.FACTORS.map((factor) => '<button type="button" class="chip" data-act="chip" data-id="' + factor.id + '" aria-pressed="false">' + ic(factor.icon, 'sm') + factor.label + ic('check', 'sm ck') + '</button>').join('') + '</div></div>' +
    '<div class="card"><h2>รายละเอียดพฤติกรรมก่อนนอน <span class="sub">(ไม่บังคับ)</span></h2><p class="hint" style="margin:0 0 14px">รายละเอียดเหล่านี้ใช้เปรียบเทียบกับบันทึกการนอนของคุณ ไม่ได้เพิ่มหรือลด Sleep Score โดยตรง</p>' +
    (CLOUD && !V3 ? '<p class="hint low" role="status">รายละเอียดนี้จะซิงก์ไป Supabase หลังเพิ่ม migration behavior_details และเปิด schemaV3 ใน config เท่านั้น ตอนนี้ยังบันทึกในเครื่องนี้ได้</p>' : '') +
    '<div class="g g2"><div class="fld"><label for="caffeineMg">คาเฟอีนรวมก่อนนอน (มิลลิกรัม)</label><input class="inp" id="caffeineMg" type="number" min="0" max="2000" step="1" inputmode="numeric" placeholder="เช่น 214" value="' + (behavior.caffeineMg == null ? '' : behavior.caffeineMg) + '"><span class="sub">ใส่ค่าจากฉลากหรือประมาณการ ปริมาณคาเฟอีนของกาแฟแต่ละแก้วต่างกัน</span></div>' +
    '<div class="fld"><label for="caffeineLastAt">เวลาดื่มคาเฟอีนครั้งสุดท้าย</label><input class="inp" id="caffeineLastAt" type="time" value="' + esc(behavior.caffeineLastAt || '') + '"><span class="sub">กรอกเมื่อรับคาเฟอีนมากกว่า 0 มก.</span></div>' +
    '<div class="fld"><label for="exerciseMinutes">ออกกำลังกายนาน (นาที)</label><input class="inp" id="exerciseMinutes" type="number" min="0" max="1440" step="1" inputmode="numeric" placeholder="เช่น 120" value="' + (behavior.exerciseMinutes == null ? '' : behavior.exerciseMinutes) + '"></div>' +
    '<div class="fld"><label for="exerciseIntensity">ความหนักของการออกกำลังกาย</label><select class="inp" id="exerciseIntensity"><option value="">ไม่ระบุ</option><option value="light">เบา</option><option value="moderate">ปานกลาง</option><option value="vigorous">หนัก</option></select></div>' +
    '<div class="fld"><label for="exerciseEndAt">เวลาออกกำลังกายเสร็จ</label><input class="inp" id="exerciseEndAt" type="time" value="' + esc(behavior.exerciseEndAt || '') + '"></div>' +
    '<div class="fld"><label for="stressLevel">ระดับความเครียดที่รู้สึก (1–5)</label><select class="inp" id="stressLevel"><option value="">ไม่ระบุ</option><option value="1">1 · น้อยมาก</option><option value="2">2 · น้อย</option><option value="3">3 · ปานกลาง</option><option value="4">4 · มาก</option><option value="5">5 · มากมาก</option></select><span class="sub">เป็นการประเมินตนเอง ไม่ใช่การวัดทางคลินิก</span></div></div><p class="sub low" id="behaviorError" role="alert"></p></div>' +
    '<div class="card"><h2>บันทึกเพิ่มเติม <span class="sub">(ไม่บังคับ)</span></h2><textarea class="ta" id="note" placeholder="เช่น ตื่นกลางดึก 1 ครั้ง หรือสิ่งที่อยากจำไว้">' + esc(d.note) + '</textarea></div></div>' +
    '<div class="stack sticky"><div class="card"><h2>สรุปของคืนนี้</h2><div class="res" id="res"><div class="x"><span class="sub">ระยะเวลาหลับจริง</span><b id="r-dur">–</b></div><div class="x"><span class="sub">ประสิทธิภาพ</span><b id="r-eff">–</b></div><div class="x"><span class="sub">อยู่บนเตียง</span><b id="r-bed">–</b></div><div class="x"><span class="sub">เวลาที่เสียไป</span><b id="r-lost">–</b></div><span class="sub m" id="r-msg"></span></div>' +
    '<div class="actions col"><button class="btn" id="save" data-act="save">' + ic('check') + (d.editing ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล') + '</button><button class="btn2" data-act="cancel">ยกเลิก</button>' + (d.editing ? '<button class="btn2 danger" data-act="del">' + ic('trash-2') + 'ลบบันทึกนี้</button>' : '') + '</div></div></div></div>';
}

const BEHAVIOR_FIELDS = /^(caffeineMg|caffeineLastAt|exerciseMinutes|exerciseIntensity|exerciseEndAt|stressLevel)$/;

function authCommand(api, name, element, event) {
  const command = api.commands && api.commands[name];
  if (typeof command === 'function') return command(element, event);
}

function handleSleepInput(api, event) {
  if (api.route !== 'log' || !api.draft) return false;
  const target = event.target;
  const time = /^(bed|wake)([HM])$/.exec(target.id);
  if (time) {
    let value = target.value.replace(/\D/g, '').slice(0, 2);
    if (value.length === 2) {
      const limit = time[2] === 'H' ? 23 : 59;
      if (+value > limit) value = String(limit);
    }
    target.value = value;
    const hour = api.document.getElementById(time[1] + 'H').value;
    const minute = api.document.getElementById(time[1] + 'M').value;
    if (hour !== '' && minute !== '') {
      api.touchTimes();
      api.draft[time[1]] = api.G.fmtT(Math.min(23, +hour) * 60 + Math.min(59, +minute));
      api.updateLog(true);
    }
    if (time[2] === 'H' && value.length === 2) {
      const minuteField = api.document.getElementById(time[1] + 'M');
      minuteField.focus();
      minuteField.select();
    }
    return true;
  }
  if (target.id === 'note') {
    api.draft.note = target.value;
    return true;
  }
  if (BEHAVIOR_FIELDS.test(target.id)) {
    api.updateLog(true);
    return true;
  }
  return false;
}

function handleSleepChange(api, event) {
  const target = event.target;
  if (BEHAVIOR_FIELDS.test(target.id)) {
    api.updateLog();
    return true;
  }
  if (api.route !== 'log' || !api.draft) return false;
  if (/^(bed|wake)[HM]$/.test(target.id)) {
    api.updateLog();
    return true;
  }
  if (target.id === 'bedDate' && target.value) {
    api.touchTimes();
    api.draft.bedDate = target.value;
    api.draft.bedManual = true;
    api.updateLog();
    return true;
  }
  if (target.id === 'date' && target.value) {
    api.touchTimes();
    if (target.value !== api.draft.date && api.entryOn(target.value)) {
      api.draft = api.newDraft(target.value);
    } else {
      const delta = api.dayDiff(target.value, api.draft.date);
      api.draft.date = target.value;
      api.draft.editing = !!api.entryOn(target.value);
      if (api.draft.bedManual) api.draft.bedDate = api.addDays(api.draft.bedDate, delta);
    }
    api.render();
    return true;
  }
  return false;
}

export function createSleepRecordingFeature(api = {}) {
  const actions = {
    opt: (element) => { api.draft[element.dataset.g] = +element.dataset.v; api.updateLog(); },
    rate: (element) => { const value = +element.dataset.v; api.draft.rating = api.draft.rating === value ? 0 : value; api.updateLog(); },
    mood: (element) => { api.draft.mood = api.draft.mood === element.dataset.m ? '' : element.dataset.m; api.updateLog(); },
    sstart: () => {
      const result = api.G.startSession(api.S.active, new Date(), api.tzName());
      if (!result.ok) { api.toast('กำลังนอนอยู่แล้ว (เริ่มเมื่อ ' + result.active.bed + ' น.)'); api.render(); return; }
      api.S.active = result.active;
      api.persistPrefs();
      api.render();
      api.toast('เริ่มนับการนอนแล้ว · ' + result.active.bed + ' น. ราตรีสวัสดิ์');
    },
    swake: () => {
      const result = api.G.finishSession(api.S.active, new Date(), api.tzName());
      if (!result.ok) {
        if (result.reason === 'toolong') api.confirmBox('session นานเกิน 24 ชั่วโมง', 'เริ่มนอนไว้เมื่อ ' + (api.S.active ? api.S.active.bed + ' น. วันที่ ' + api.fmtDate(api.S.active.bedDate, { day: 'numeric', month: 'long' }) : '') + ' ซึ่งนานเกินไปที่จะเป็นการนอนคืนเดียว ยกเลิก session นี้แล้วบันทึกเวลาเองแทนไหม', 'ยกเลิก session', function () { api.S.active = null; api.persistPrefs(); api.draft = api.newDraft(); api.nav('log', true); });
        else if (result.reason === 'negative') api.toast('เวลาตื่นอยู่ก่อนเวลาเริ่มนอน ตรวจสอบนาฬิกาเครื่องแล้วลองใหม่');
        else { api.S.active = null; api.render(); }
        return;
      }
      let entry = api.G.makeEntry(result.date, result.bed, result.wake, result.latency, 0, 0, [], '', result.span, result.extra);
      if (!entry) { api.toast('บันทึกเวลาอัตโนมัติไม่สำเร็จ ลองกรอกเวลาเอง'); return; }
      entry = api.G.mergeSessionEntry(entry, api.entryOn(result.date));
      if (api.S.active && api.S.active.startAt === result.extra.bedAt) {
        api.S.active = null;
        if (api.CLOUD) api.window.GNSync.markProfile(api.pend());
      }
      api.putEntry(entry);
      api.draft = api.draftFromSession(result);
      api.nav('log', true);
      api.toast('บันทึกเวลาเข้านอนและตื่นให้อัตโนมัติแล้ว · เติมพฤติกรรมได้ก่อนนอนถัดไป');
    },
    scancel: () => api.confirmBox('ยกเลิกการนับการนอน?', 'เวลาเริ่มนอนที่บันทึกไว้จะถูกทิ้ง (ยังบันทึกเวลาเองในหน้าบันทึกได้)', 'ยกเลิก session', function () { api.S.active = null; api.persistPrefs(); api.render(); api.toast('ยกเลิกแล้ว'); }),
    logmode: (element) => { api.logMode = element.dataset.v; if (!api.draft || api.draft.editing) api.draft = api.newDraft(); api.render(); },
    logmanual: () => { api.draft = api.newDraft(); api.logMode = 'manual'; api.nav('log', true); },
    chip: (element) => { const index = api.draft.factors.indexOf(element.dataset.id); if (index > -1) api.draft.factors.splice(index, 1); else api.draft.factors.push(element.dataset.id); api.updateLog(); },
    cancel: () => api.nav(api.S.entries.length ? 'history' : 'home'),
    save: () => {
      const source = api.draft.sess || api.draft.keep || {};
      const extra = { mood: api.draft.mood, behaviorDetails: api.behaviorFields(), bedAt: source.bedAt, wakeAt: source.wakeAt, tz: source.tz, bedTz: source.bedTz };
      const entry = api.G.makeEntry(api.draft.date, api.draft.bed, api.draft.wake, api.draft.lat, api.draft.awk, api.draft.rating, api.draft.factors.slice(), api.draft.note.trim(), api.spanOf(api.draft), extra);
      if (!entry) return;
      if (api.draft.fromSession && api.S.active && api.S.active.startAt === api.draft.fromSession) {
        api.S.active = null;
        if (api.CLOUD) api.window.GNSync.markProfile(api.pend());
      }
      api.putEntry(entry);
      const detailsSavedLocally = Object.keys(entry.behaviorDetails || {}).some((key) => entry.behaviorDetails[key] !== null && entry.behaviorDetails[key] !== '');
      api.nav('home');
      api.toast(api.CLOUD && !api.V3 && detailsSavedLocally ? 'บันทึกในเครื่องแล้ว · รายละเอียดพฤติกรรมยังไม่ซิงก์กับ Supabase' : 'บันทึกแล้ว · หลับจริง ' + api.G.fmtDur(entry.asleep) + ' · ประสิทธิภาพ ' + entry.eff + '%');
    },
    del: () => api.confirmBox('ลบบันทึกนี้?', 'บันทึกของวันที่ ' + api.fmtDate(api.draft.date, { day: 'numeric', month: 'long', year: 'numeric' }) + ' จะถูกลบ ย้อนกลับไม่ได้', 'ลบบันทึก', function () { api.removeEntry(api.draft.date); api.nav('history'); api.toast('ลบบันทึกแล้ว'); }),
    tstep: (element) => { api.touchTimes(); const field = element.dataset.f; const minutes = (api.G.toMin(api.draft[field]) + (+element.dataset.d) + 1440) % 1440; api.draft[field] = api.G.fmtT(minutes); api.updateLog(); },
    login: (element, event) => authCommand(api, 'login', element, event),
    register: (element, event) => authCommand(api, 'register', element, event),
    sendreset: (element, event) => authCommand(api, 'sendreset', element, event),
    setpw: (element, event) => authCommand(api, 'setpw', element, event),
    toreg: (element, event) => authCommand(api, 'toreg', element, event),
    tologin: (element, event) => authCommand(api, 'tologin', element, event),
    forgot: (element, event) => authCommand(api, 'forgot', element, event),
    pick: (element) => { const username = api.document.getElementById('u'); username.value = element.dataset.n; api.document.getElementById('p').focus(); },
    eye: (element) => {
      const field = api.document.getElementById(element.dataset.for), visible = field.type === 'password';
      field.type = visible ? 'text' : 'password';
      element.innerHTML = api.ic(visible ? 'eye-off' : 'eye');
      element.setAttribute('aria-label', visible ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน');
      try { api.window.lucide.createIcons(); } catch {}
    },
  };
  return {
    name: 'sleep-recording',
    views: { log: () => renderSleepLog(api) },
    components: { sessionCard: (context) => renderSessionCard(context) },
    actions,
    events: {
      input: (event) => handleSleepInput(api, event),
      change: (event) => handleSleepChange(api, event),
    },
  };
}
