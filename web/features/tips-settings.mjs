export function aiErrorText(error) {
  const messages = {
    ai_not_configured: 'บริการ AI ยังไม่ได้ตั้งค่าฝั่งเซิร์ฟเวอร์',
    ai_unavailable: 'บริการ AI ขัดข้องชั่วคราว คำแนะนำจากระบบเดิมยังใช้ได้',
    invalid_ai_response: 'AI ส่งผลลัพธ์ที่อ่านไม่ได้ ลองใหม่ภายหลัง',
    unauthorized: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
    invalid_request: 'ข้อมูลสรุปไม่ครบหรือไม่ถูกต้อง',
  };
  if (error && error.network) return 'เชื่อมต่อบริการ AI ไม่สำเร็จ คำแนะนำจากระบบเดิมยังใช้ได้';
  return messages[error && error.message] || 'ขอคำแนะนำ AI ไม่สำเร็จ คำแนะนำจากระบบเดิมยังใช้ได้';
}

export function renderAiRecommendationPanel({ CLOUD, user, window: appWindow, S, aiState, esc, ic }) {
  if (!CLOUD || !user) return '';
  if (!appWindow.GNRecommendations || !appWindow.GNRecommendations.buildPayload(S.entries, S.goal)) return '';
  const result = aiState.result;
  const output = result ? '<div class="focus" style="margin-top:16px"><span class="cap">สร้างโดย AI · ไม่ใช่คำแนะนำทางการแพทย์</span><h3>' + esc(result.title) + '</h3><p class="hint" style="margin:0">' + esc(result.evidence) + '</p><div class="todo"><span>' + esc(result.action) + '</span></div></div>' : '';
  const loading = aiState.loading ? '<p class="hint" role="status">กำลังวิเคราะห์ข้อมูลการนอนของคุณ…</p>' : '';
  const failure = aiState.error ? '<p class="hint low" role="alert">' + esc(aiState.error) + '</p>' : '';
  return '<div class="card" aria-live="polite" aria-busy="' + (aiState.loading ? 'true' : 'false') + '"><div class="phead"><div><h2 class="inl">' + ic('sparkles') + 'คำแนะนำจาก AI</h2><div class="cap">ขอคำแนะนำใหม่ได้เมื่อพร้อม</div></div></div>' +
    '<p class="hint" style="margin:0">เมื่อกด จะส่งสรุปข้อมูลการนอนและพฤติกรรมย้อนหลัง 7–14 คืน ได้แก่ ระยะเวลาหลับ ประสิทธิภาพ เวลากว่าจะหลับและเวลาตื่นระหว่างคืน คะแนนความสดชื่น เวลาเข้านอน/ตื่น คาเฟอีน การออกกำลังกาย ความเครียด และเป้าหมายการนอน ไปยัง KKU GenAI เพื่อสร้างคำแนะนำ โดยไม่ส่งชื่อ อีเมล วันที่จริง หรือข้อความบันทึกส่วนตัว</p>' +
    '<button class="btn" data-act="generateAiRecommendation"' + (aiState.loading ? ' disabled' : '') + '>' + ic('sparkles') + (aiState.loading ? 'กำลังสร้างคำแนะนำ…' : (result ? 'สร้างคำแนะนำใหม่' : 'สร้างคำแนะนำด้วย AI')) + '</button>' + loading + failure + output + '</div>';
}

function renderTipsPage({ G, S, empty, ic, esc, adviceControls, today, aiPanel }) {
  const insights = G.insights(S.entries, S.goal);
  const head = '<div><h1>ค่อยๆ สร้างคืนที่ดีขึ้น</h1><div class="cap">วิเคราะห์จากบันทึกของคุณ ' + insights.n + ' คืน</div></div>';
  const disclaimer = '<div class="card note"><h2 class="inl low">' + ic('shield-alert') + 'ไม่ใช่การวินิจฉัย</h2><p class="hint" style="margin:0">เป็นคำแนะนำทั่วไปจากบันทึกของคุณ ไม่ใช่การวินิจฉัยทางการแพทย์ ควรปรึกษาแพทย์หากมีอาการต่อไปนี้</p><ul class="dots"><li>ง่วงมากผิดปกติระหว่างวัน</li><li>นอนกรนเสียงดัง หรือมีช่วงหยุดหายใจ</li><li>นอนไม่หลับต่อเนื่องเกิน 3 สัปดาห์</li></ul></div>';
  if (!insights.enough) return head + empty('flask-conical', 'ข้อมูลยังไม่พอสำหรับคำแนะนำ', 'บันทึกให้ครบ 7 คืนก่อน แล้วเราจะแนะนำจากข้อมูลของคุณ (ตอนนี้ ' + insights.n + ' คืน)', true).replace('</p>', '</p><div class="pg" style="width:100%;max-width:320px"><i style="width:' + Math.round(insights.n / 7 * 100) + '%"></i></div>') + disclaimer;
  const ai = aiPanel();
  const advice = G.visibleAdvice(insights.items, S.adviceState, today());
  if (!advice.length) return head + ai + '<div class="card"><p class="hint">คุณพักหรือซ่อนคำแนะนำทั้งหมดไว้</p><button class="btn2" data-act="restoreAdvice">แสดงคำแนะนำอีกครั้ง</button></div>' + disclaimer;
  const focus = advice[0], rest = advice.slice(1);
  return head + ai + '<div class="card focus"><span class="cap">สิ่งที่ควรโฟกัสตอนนี้</span><h2 style="font-size:20px">' + esc(focus.title) + '</h2><p class="hint" style="margin:0;color:var(--t1)">' + esc(focus.ev) + '</p><div class="todo">' + ic('lightbulb', 'sm') + '<span>' + esc(focus.act) + '</span></div><span class="tag">' + focus.conf + '</span>' + adviceControls(focus) + '</div>' +
    (rest.length ? '<h2>ปัจจัยการนอนของคุณ</h2><div class="g g3">' + rest.map((item) => '<div class="card ins ' + item.tone + '"><div class="ih"><span class="aic">' + ic(item.icon) + '</span><span class="t">' + esc(item.title) + '</span></div><p class="hint" style="margin:0">' + esc(item.ev) + '</p><div class="todo">' + ic('lightbulb', 'sm') + '<span>' + esc(item.act) + '</span></div><span class="tag">' + item.conf + '</span>' + adviceControls(item) + '</div>').join('') + '</div>' : '') + disclaimer;
}

function renderSettingsPage({ avatarHtml, ic, esc, dispName, user, row, goalSummary, S }) {
  return '<div><h1>ตั้งค่า</h1></div><div class="setcol">' +
    '<div class="card pfcard"><button class="pfav" data-act="photo" aria-label="เปลี่ยนรูปโปรไฟล์">' + avatarHtml(88) + '<span class="pfedit">' + ic('pencil', 'sm') + '</span></button><div class="pfname">' + esc(dispName()) + '<button class="pfnbtn" data-act="pfname" aria-label="แก้ไขชื่อ">' + ic('pencil', 'sm') + '</button></div>' + (user && user.email ? '<div class="sub">' + esc(user.email) + '</div>' : '') + '</div>' +
    '<div class="card slist">' + row('target', 'เป้าหมาย', goalSummary(), 'data-act="goals"') + row('sun-moon', 'ธีมสี', S.theme === 'light' ? 'โหมดสว่าง · แตะเพื่อเปลี่ยน' : 'โหมดมืด · แตะเพื่อเปลี่ยน', 'data-act="theme"') + row('shield-check', 'นโยบายความเป็นส่วนตัว', 'อ่านนโยบายและจัดการความยินยอม', 'data-act="privacy"') + '</div>' +
    '<div class="card slist">' + row('log-out', 'ออกจากระบบ', '', 'data-act="logout"') + row('user-x', 'ลบบัญชีผู้ใช้', 'ลบบัญชีและบันทึกทั้งหมด', 'data-act="delacct"', 'danger') + '</div></div>';
}

export function createTipsSettingsFeature(api = {}) {
  const actions = {
    dstep: (element) => {
      const control = api.HM[element.dataset.f];
      const value = Math.max(api.GMIN, Math.min(api.GMAX, control.get() + (+element.dataset.d)));
      control.set(value); api.writeHM(element.dataset.f, value); api.hmErr(element.dataset.f, '');
      if (control.page && api.route === 'settings') api.render();
    },
    cstep: (element) => {
      const control = api.HM[element.dataset.f], current = control.get();
      const value = current === null || current === undefined ? 23 * 60 : (((current + (+element.dataset.d)) % 1440) + 1440) % 1440;
      control.set(value); api.writeHM(element.dataset.f, value);
      if (control.page && api.route === 'settings') api.render();
    },
    cclear: (element) => {
      const control = api.HM[element.dataset.f];
      control.set(null); api.writeHM(element.dataset.f, null);
      if (control.page && api.route === 'settings') api.render();
    },
    ageopen: (element) => {
      api.ageOpen = !api.ageOpen;
      element.setAttribute('aria-expanded', String(api.ageOpen));
      const box = api.$i('ageBox');
      if (box) {
        box.hidden = !api.ageOpen; box.innerHTML = api.ageInner();
        const age = api.$i('age'); if (age) age.focus();
        const recommendations = api.$i('recBox');
        if (recommendations) recommendations.innerHTML = api.recHtml(api.route === 'settings' ? api.S.goal : api.obGoal);
        try { api.window.lucide.createIcons(); } catch {}
      }
    },
    sugok: (element) => { api.setGoalBed(+element.dataset.v); api.render(); api.toast('ตั้งเป้าเข้านอน ' + api.G.fmtT(+element.dataset.v) + ' แล้ว · จะสรุปผลให้หลัง 7 วัน'); },
    sugno: () => { api.S.sugDismissed = api.today(); api.persistPrefs(); api.render(); },
    revok: () => { api.S.reviewDone = api.S.goalBedSince; api.persistPrefs(); api.render(); },
    goals: (element, event) => api.commands?.goals?.(element, event),
    photo: (element, event) => api.commands?.photo?.(element, event),
    pfname: (element, event) => api.commands?.pfname?.(element, event),
    avdel: () => { api.avDraft = ''; const preview = api.$i('avPrev'); if (preview) preview.innerHTML = api.avPreview(); },
    avsave: (element) => {
      api.S.avatar = api.avDraft || null; api.persistPrefs();
      const overlay = element.closest('.ov'); if (overlay) overlay.remove();
      api.render(); api.toast('บันทึกรูปโปรไฟล์แล้ว');
    },
    namesave: (element) => {
      const name = (api.$i('pfName') || {}).value || '';
      const normalized = name.trim();
      if (normalized.length < 1 || normalized.length > 30) { api.$i('pfErr').textContent = 'ชื่อต้องยาว 1–30 ตัวอักษร'; return; }
      api.S.displayName = normalized; api.persistPrefs();
      const overlay = element.closest('.ov'); if (overlay) overlay.remove();
      api.render(); api.toast('บันทึกชื่อแล้ว');
    },
    snoozeAdvice: (element) => updateAdvice(api, element, 'snooze'),
    dismissAdvice: (element) => updateAdvice(api, element, 'dismiss'),
    restoreAdvice: () => { api.S.adviceState = {}; api.persistPrefs(); api.render(); api.toast('แสดงคำแนะนำทั้งหมดแล้ว'); },
    generateAiRecommendation: () => {
      if (api.aiState.loading || !api.CLOUD || !api.user) return;
      const payload = api.window.GNRecommendations && api.window.GNRecommendations.buildPayload(api.S.entries, api.S.goal);
      if (!payload) { api.aiState = { loading: false, error: 'ข้อมูลสรุปไม่ครบหรือไม่ถูกต้อง', result: null }; api.render(); return; }
      const requestId = api.aiRequestId + 1;
      api.aiRequestId = requestId;
      api.aiState = { loading: true, error: '', result: null };
      api.render();
      Promise.resolve().then(() => api.cloud.aiRecommendations(payload)).then((result) => {
        if (requestId !== api.aiRequestId) return;
        if (!result || ['title', 'evidence', 'action'].some((key) => typeof result[key] !== 'string' || !result[key].trim())) throw new Error('invalid_ai_response');
        api.aiState = { loading: false, error: '', result };
        if (api.route === 'tips' && api.user) api.render();
      }).catch((error) => {
        if (requestId !== api.aiRequestId) return;
        api.aiState = { loading: false, error: aiErrorText(error), result: null };
        if (api.route === 'tips' && api.user) api.render();
      });
    },
    install: () => {
      if (!api.deferred) return;
      api.deferred.prompt();
      api.deferred.userChoice.then(() => { api.deferred = null; api.render(); });
    },
  };

  function updateAdvice(context, element, kind) {
    context.S.adviceState = context.G.adviceStateAfter(context.S.adviceState, element.dataset.id, kind, context.today());
    context.persistPrefs(); context.render();
    context.toast(kind === 'snooze' ? 'พักคำแนะนำนี้ 7 วันแล้ว' : 'ซ่อนคำแนะนำนี้แล้ว');
  }

  function handleInput(event) {
    if (api.route !== 'settings' || !api.authEl.hidden || event.target.id !== 'age') return false;
    api.ageVal = event.target.value;
    const recommendation = api.G.sleepRec(api.ageVal), box = api.document.getElementById('recBox');
    if (box) { box.innerHTML = api.recHtml(api.S.goal); try { api.window.lucide.createIcons(); } catch {} }
    return !!recommendation || !!box;
  }

  function handleChange(event) {
    const target = event.target;
    if (target.id === 'avFile') { api.loadAvatar(target.files && target.files[0]); return true; }
    if (api.route !== 'settings' || !api.authEl.hidden) return false;
    const match = /^(goal|gbed)[HM]$/.exec(target.id);
    if (!match) return false;
    const group = target.id.slice(0, -1);
    api.window.setTimeout(function () {
      const active = api.document.activeElement;
      if (active && active.id && active.id.slice(0, -1) === group && /[HM]$/.test(active.id)) return;
      api.commitHM(group);
    }, 0);
    return true;
  }

  return {
    name: 'tips-settings',
    views: {
      tips: () => renderTipsPage({ ...api, aiPanel: () => renderAiRecommendationPanel(api) }),
      settings: () => renderSettingsPage(api),
    },
    components: { aiPanel: renderAiRecommendationPanel },
    actions,
    events: { input: handleInput, change: handleChange },
  };
}
