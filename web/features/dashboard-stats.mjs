export function renderBehaviorStats({ G, goal, esc }, entries) {
  const result = G.behaviorAnalysis(entries, goal);
  const metrics = [result.metrics.caffeineMg, result.metrics.caffeineGapMin, result.metrics.exerciseMinutes, result.metrics.exerciseGapMin, result.metrics.stressLevel];
  const metricHtml = metrics.map((metric) => {
    const value = metric.r === null
      ? (metric.n < metric.minRecords ? 'ยังไม่พอ · ' + metric.n + '/' + metric.minRecords + ' คืน' : 'ข้อมูลไม่มีความแปรผันพอสำหรับคำนวณ')
      : (metric.r > 0 ? 'แนวโน้มเชิงเส้นไปทางคะแนนสูงขึ้น' : metric.r < 0 ? 'แนวโน้มเชิงเส้นไปทางคะแนนต่ำลง' : 'ความสัมพันธ์เชิงเส้นน้อยในชุดข้อมูลนี้') + ' · r = ' + metric.r.toFixed(2) + ' · n = ' + metric.n;
    return '<div class="fx"><b>' + metric.label + '</b><span class="pill" style="margin-left:auto">' + metric.n + ' คืน</span></div><p class="sub" style="margin:4px 0 12px">' + value + '</p>';
  }).join('');
  const intensity = result.intensity.map((group) => {
    const label = { light: 'เบา', moderate: 'ปานกลาง', vigorous: 'หนัก' }[group.level];
    return '<li>' + label + ': ' + (group.n >= 3 ? 'Sleep Score เฉลี่ย ' + group.avgScore + ' จาก ' + group.n + ' คืน' : 'ข้อมูล ' + group.n + ' คืน · ยังไม่สรุปค่าเฉลี่ย (ต้อง 3 คืน)') + '</li>';
  }).join('');
  return '<div class="card"><h2>พฤติกรรมกับ Sleep Score ของคุณ</h2><p class="sub">ใช้ Sleep Score สูตรเดิมเป็นผลลัพธ์ แล้วดูแนวโน้มร่วมกับค่าพฤติกรรมจากทุกคืนที่กรอกไว้</p>' + metricHtml +
    '<h3>ความหนักของการออกกำลังกาย</h3><ul class="dots">' + intensity + '</ul><p class="hint">' + result.disclaimer + '. ค่า r เป็นสถิติเชิงพรรณนา ไม่ใช่ผลทดสอบนัยสำคัญ และอาจเปลี่ยนมากเมื่อจำนวนคืนยังน้อย</p>' +
    '<details><summary>หลักฐานทั่วไปและข้อจำกัด</summary><ul class="dots"><li>ผู้ใหญ่ 18–60 ปีควรนอนอย่างน้อย 7 ชั่วโมงเป็นประจำ; ความต้องการรายบุคคลต่างกัน</li><li>งานทบทวนคาเฟอีนรายงานผลเฉลี่ยในกลุ่มศึกษา ไม่ใช่เกณฑ์หักคะแนนเฉพาะบุคคล และปริมาณคาเฟอีนในกาแฟแปรผันตามชนิด/ขนาด</li><li>งานทบทวนการออกกำลังกายช่วงเย็นไม่พบว่าทุกกรณีทำให้การนอนแย่ลง; การออกกำลังหนักใกล้เวลานอนเป็นกรณีที่ควรตีความอย่างระมัดระวัง</li><li>ความเครียดมีความสัมพันธ์กับปัญหาการนอนในงานสังเคราะห์ข้อมูล แต่ไม่ยืนยันเหตุและผลในผู้ใช้รายใดรายหนึ่ง</li></ul>' +
    '<ul class="dots"><li><a href="https://aasm.org/seven-or-more-hours-of-sleep-per-night-a-health-necessity-for-adults/" target="_blank" rel="noopener">AASM · คำแนะนำชั่วโมงนอนผู้ใหญ่</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/36870101/" target="_blank" rel="noopener">Gardiner et al. · คาเฟอีนและการนอน (systematic review/meta-analysis)</a></li><li><a href="https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much" target="_blank" rel="noopener">FDA · ปริมาณคาเฟอีนแตกต่างตามผลิตภัณฑ์</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/30374942/" target="_blank" rel="noopener">Stutz et al. · การออกกำลังกายช่วงเย็นและการนอน</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/36409327/" target="_blank" rel="noopener">Stress–sleep systematic review/meta-SEM</a></li></ul></details></div>';
}

function renderHome(api) {
  const { G, S, sorted, today, fmtDate, ic, sessionCard, esc, adviceControls, diffTxt, dur, gh, durChart, scoreCard, effInfo, dShort, stars, moodLine, adviceCard } = api;
  const list = sorted(), entry = list[0], date = today(), hour = new Date().getHours();
  const head = '<div class="phead"><div><h1>' + (hour < 11 ? 'เช้านี้ เป็นอย่างไรบ้าง' : 'ภาพรวมการนอนของคุณ') + '</h1><div class="cap">' + fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '</div></div>' + (entry ? '<button class="btn" data-go="log">' + ic('plus') + 'บันทึกการนอน</button>' : '') + '</div>';
  if (!entry) return head + (S.active ? sessionCard() : '<div class="card empty"><div class="bg">' + ic('moon-star') + '</div><h2>ยังไม่มีบันทึกการนอน</h2><p class="hint">เริ่มจากคืนนี้เลย กด "เริ่มนอน" ตอนเข้านอน แล้วกด "ตื่นแล้ว" ตอนตื่น ระบบจะจับเวลาและคำนวณให้ ถ้าลืมกดก็กรอกเวลาย้อนหลังเองได้</p><div class="inl" style="gap:12px;flex-wrap:wrap;justify-content:center"><button class="btn" data-act="sstart">' + ic('moon') + 'เริ่มนอน</button><button class="btn2" data-act="logmanual">' + ic('pencil', 'sm') + 'บันทึกเวลานอน</button></div></div>');
  const previous = list[1];
  let comparison = '';
  if (previous) { const delta = entry.asleep - previous.asleep; comparison = '<div class="' + (delta >= 0 ? 'good' : 'low') + ' inl">' + ic(delta >= 0 ? 'trending-up' : 'trending-down', 'sm') + (delta === 0 ? 'เท่ากับคืนก่อนหน้า' : (delta > 0 ? 'นอนนานกว่า' : 'นอนน้อยกว่า') + 'คืนก่อนหน้า ' + Math.abs(delta) + ' นาที') + '</div>'; }
  const goalPercent = Math.round(entry.asleep / S.goal * 100);
  const insight = G.insights(S.entries, S.goal);
  const visibleTips = G.visibleAdvice(insight.items, S.adviceState, date);
  let tip;
  if (insight.enough && visibleTips.length) { const item = visibleTips[0]; tip = '<div class="card"><h2 class="inl">' + ic('sparkles') + 'คำแนะนำวันนี้</h2><p class="hint" style="margin:0;color:var(--t1)">' + esc(item.title) + '</p><p class="hint" style="margin:0">' + esc(item.act) + '</p>' + adviceControls(item) + '<button class="btn2" data-go="tips">' + ic('chevron-right') + 'ดูคำแนะนำเพิ่มเติม</button></div>'; }
  else if (insight.enough) tip = '<div class="card"><h2 class="inl">' + ic('sparkles') + 'พักคำแนะนำไว้ทั้งหมด</h2><p class="hint">กลับมาแสดงได้ทุกเมื่อในหน้าคำแนะนำ</p><button class="btn2" data-act="restoreAdvice">แสดงคำแนะนำอีกครั้ง</button></div>';
  else tip = '<div class="card"><h2 class="inl">' + ic('sparkles') + 'คำแนะนำ</h2><p class="hint" style="margin:0">บันทึกให้ครบ 7 คืนเพื่อรับคำแนะนำจากข้อมูลของคุณเอง (ตอนนี้ ' + insight.n + ' คืน)</p><div class="pg"><i style="width:' + Math.round(insight.n / 7 * 100) + '%"></i></div></div>';
  const slots = G.windowSlots(S.entries, date, 7), weekEntries = G.present(slots);
  const bedtime = S.goalBed === null || S.goalBed === undefined ? '' : (() => { const value = G.bedVsGoal([entry], S.goalBed); return '<div class="kv"><span class="cap">เข้านอนเทียบเป้า ' + G.fmtT(S.goalBed) + '</span><b class="' + (Math.abs(value.avgDiff) <= value.tol ? 'good' : 'low') + '">' + diffTxt(value.avgDiff) + '</b></div>'; })();
  return head + (S.active ? sessionCard() : '') + adviceCard() + '<div class="g gm"><div class="stack">' +
    '<div class="card"><div class="phead"><h2>การนอน' + (entry.date === date ? 'เมื่อคืน' : 'ล่าสุด') + '</h2><button class="btn2" data-go="day" data-date="' + entry.date + '" style="min-height:38px;padding:4px 16px">' + ic('chevron-right', 'sm') + 'ดูรายละเอียด · ' + fmtDate(entry.date, { day: 'numeric', month: 'short' }) + '</button></div>' +
    '<div class="g g2"><div class="stack" style="gap:12px"><div class="cap">ระยะเวลาหลับจริง</div><div class="big">' + dur(entry.asleep) + '</div><div class="pg"><i style="width:' + Math.min(100, goalPercent) + '%"></i></div><div class="sub" style="display:flex;justify-content:space-between"><span>เป้าหมาย ' + gh(S.goal) + '</span><span>' + goalPercent + '%</span></div>' + comparison + '</div>' +
    '<div><div class="kv"><span class="cap">ประสิทธิภาพการนอน</span><b class="' + effInfo(entry.eff, entry.asleep).cls + '">' + entry.eff + '% · ' + effInfo(entry.eff, entry.asleep).txt + '</b></div>' + (effInfo(entry.eff, entry.asleep).note ? '<div class="sub low" style="padding:0 0 12px;border-bottom:1px solid var(--line)">' + effInfo(entry.eff, entry.asleep).note + '</div>' : '') + '<div class="kv"><span class="cap">เข้านอน → ตื่นนอน</span><b>' + entry.bed + ' → ' + entry.wake + '</b></div>' + bedtime + '<div class="kv"><span class="cap">อยู่บนเตียง</span><b>' + G.fmtDur(entry.inBed) + '</b></div><div class="kv"><span class="cap">เวลาที่เสียไป (หลับช้า + ตื่นกลางดึก)</span><b>' + (entry.lat + entry.awk) + ' นาที</b></div></div></div></div>' +
    '<div class="card"><h2>แนวโน้มรายวัน</h2><div class="cap">ระยะเวลาหลับจริง · 7 วันล่าสุด ' + dShort(slots[0].date) + '–' + dShort(slots[6].date) + ' (' + weekEntries.length + ' คืนที่บันทึก)</div>' + durChart(slots) + '</div></div>' +
    '<div class="stack">' + scoreCard(entry) + '<div class="card"><div class="phead"><div><h2>ความสดชื่นตอนตื่น</h2>' + (entry.rating ? stars(entry.rating) : '<span class="sub">ยังไม่ได้ให้คะแนน</span>') + (moodLine(entry) ? '<div style="margin-top:8px">' + moodLine(entry) + '</div>' : '') + '</div>' + (entry.rating ? '<b style="font-size:26px">' + entry.rating + ' / 5</b>' : '') + '</div></div>' +
    '<div class="card"><div class="kv" style="padding-top:0"><span class="cap inl">' + ic('flame', 'sm') + 'บันทึกต่อเนื่อง</span><b>' + G.streak(S.entries, date) + ' วัน</b></div><div class="kv" style="border:0;padding-bottom:0"><span class="cap inl">' + ic('calendar-days', 'sm') + 'บันทึกทั้งหมด</span><b>' + S.entries.length + ' คืน</b></div></div>' + tip + '</div></div>';
}

function renderHistory(api) {
  const { G, S, today, sorted, histFrom, histList, histFilter, fmtDate, dShort, ic, empty, A, dur, selMode, sel, effInfo, stars, moodLine, selCount } = api;
  const date = today(), all = sorted(), from = histFrom(), list = histList();
  const segments = [['week', 'สัปดาห์'], ['month', 'เดือน'], ['all', 'ทั้งหมด']].map((item) => '<button data-act="seg" data-v="' + item[0] + '" aria-pressed="' + (histFilter === item[0]) + '">' + item[1] + '</button>').join('');
  const range = histFilter === 'all' ? (all.length ? 'ทั้งหมด ' + all.length + ' คืน' : '') : dShort(from) + ' – ' + dShort(date);
  const head = '<div class="phead"><div><h1>ประวัติการนอน</h1><div class="cap">แตะรายการเพื่อดูรายละเอียดของแต่ละคืน</div></div><button class="btn" data-go="log">' + ic('plus') + 'บันทึกคืนใหม่</button></div><div class="phead" style="align-items:center"><div class="seg">' + segments + '</div><span class="pill">' + ic('calendar-days', 'sm') + ' ' + range + '</span></div>';
  if (!list.length) return head + empty('calendar-days', 'ไม่มีบันทึกในช่วงนี้', all.length ? 'ลองเลือกช่วง "ทั้งหมด" หรือบันทึกคืนใหม่' : 'ยังไม่มีบันทึกการนอน', true);
  const avgEfficiency = Math.round(A(list.map((entry) => entry.eff))), avgSleep = Math.round(A(list.map((entry) => entry.asleep)));
  return head + '<div class="g g3"><div class="card stat"><span class="cap">หลับจริงเฉลี่ย</span><span class="v">' + dur(avgSleep) + '</span></div><div class="card stat"><span class="cap">ประสิทธิภาพเฉลี่ย</span><span class="v ' + (avgEfficiency >= 85 ? 'good' : 'low') + '">' + avgEfficiency + '%</span><span class="sub">' + (avgEfficiency >= 85 ? 'ถึงเกณฑ์ 85%' : 'ต่ำกว่าเกณฑ์ 85%') + '</span></div><div class="card stat"><span class="cap">จำนวนบันทึกในช่วงที่เลือก</span><span class="v">' + list.length + ' <span class="sub">คืน</span></span></div></div>' +
    '<div class="card"><div class="phead" style="align-items:center"><h2>บันทึกทั้งหมดในช่วงนี้</h2><div class="inl" style="gap:10px"><span class="pill">' + list.length + ' บันทึก</span>' + (selMode ? '' : '<button class="btn2 sm" data-act="selon" style="min-height:36px;padding:4px 14px">' + ic('list-checks', 'sm') + 'เลือก</button><button class="btn2 sm" data-act="export" style="min-height:36px;padding:4px 14px">' + ic('download', 'sm') + 'ส่งออก CSV</button>') + '</div></div><div><div class="thead"><span>วันที่ตื่นนอน</span><span>ระยะเวลาหลับจริง</span><span>ประสิทธิภาพการนอน</span><span>ความสดชื่น</span><span></span></div>' +
    list.map((entry) => { const selected = !!sel[entry.date]; return '<button class="row' + (selMode && selected ? ' on' : '') + '" ' + (selMode ? 'data-act="selrow" role="checkbox" aria-checked="' + selected + '"' : 'data-go="day"') + ' data-date="' + entry.date + '"><span class="d">' + (selMode ? '<span class="ck2">' + (selected ? ic('check') : '') + '</span>' : ic('moon')) + fmtDate(entry.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) + '</span><span class="c1 n">' + G.fmtDur(entry.asleep) + '</span><span class="c2 ' + (effInfo(entry.eff, entry.asleep).cls === 'good' ? 'good' : G.isShort(entry.asleep, S.goal) ? 'low' : 'cap') + '">' + entry.eff + '% · ' + effInfo(entry.eff, entry.asleep, true).txt + '</span><span class="c3 inl">' + (entry.rating ? stars(entry.rating) + '<span class="sub">' + entry.rating + '/5</span>' : '<span class="sub">–</span>') + (moodLine(entry) ? '<span class="sub inl" style="margin-left:10px">' + moodLine(entry) + '</span>' : '') + '</span><span class="go">' + (selMode ? '' : ic('chevron-right')) + '</span></button>'; }).join('') + '</div></div>' +
    (selMode ? '<div class="selbar"><span class="grow">เลือกแล้ว <b>' + selCount() + '</b> จาก ' + list.length + ' รายการ</span><button class="btn2 sm" data-act="selall">' + (list.every((entry) => sel[entry.date]) ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด') + '</button><button class="btn2 sm" data-act="seloff">ยกเลิก</button><button class="btn del sm" data-act="seldel"' + (selCount() ? '' : ' disabled') + '>' + ic('trash-2', 'sm') + 'ลบที่เลือก (' + selCount() + ')</button></div>' : '');
}

function renderStats(api) {
  const { G, S, sorted, today, fmtDate, ic, A, empty, dur, durChart, effChart, scoreChart, scoreInfo, fxCard, bedGoalCard, printReportHtml } = api;
  const all = sorted(), date = today();
  if (!all.length) return '<div><h1>สถิติการนอน</h1></div>' + empty('chart-column', 'ยังไม่มีข้อมูล', 'บันทึกการนอนก่อน แล้วสถิติจะแสดงที่นี่', true);
  let statsMonth = api.getStatsMonth();
  if (!statsMonth) { statsMonth = date.slice(0, 7); api.setStatsMonth(statsMonth); }
  const month = api.statsMode === 'month';
  const slots = month ? G.monthSlots(S.entries, statsMonth) : G.windowSlots(S.entries, date, 7), entries = G.present(slots), count = entries.length;
  const currentMonth = date.slice(0, 7), parts = statsMonth.split('-');
  const caption = month ? new Date(+parts[0], +parts[1] - 1, 1).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }) : fmtDate(slots[0].date, { day: 'numeric', month: 'short' }) + ' - ' + fmtDate(slots[6].date, { day: 'numeric', month: 'short' });
  const segments = [['week', '7 วันล่าสุด'], ['month', 'รายเดือน']].map((item) => '<button data-act="smode" data-v="' + item[0] + '" aria-pressed="' + (api.statsMode === item[0]) + '">' + item[1] + '</button>').join('');
  const monthNav = month ? '<div class="inl" style="gap:8px"><button class="sb" data-act="mprev" aria-label="เดือนก่อนหน้า">' + ic('chevron-left') + '</button><button class="sb" data-act="mnext" aria-label="เดือนถัดไป"' + (statsMonth >= currentMonth ? ' disabled style="opacity:.35;cursor:not-allowed"' : '') + '>' + ic('chevron-right') + '</button></div>' : '';
  const avgEfficiency = count ? Math.round(A(entries.map((entry) => entry.eff))) : null, avgSleep = count ? Math.round(A(entries.map((entry) => entry.asleep))) : null, avgScore = G.avgScore(entries, S.goal);
  const head = '<div class="phead" style="align-items:center"><div><h1>ดูข้อมูลสถิติการนอนของคุณ</h1><div class="cap">' + caption + ' · บันทึกทั้งหมด ' + count + '/' + slots.length + ' วัน</div></div><div class="inl" style="gap:12px;flex-wrap:wrap">' + monthNav + '<div class="seg">' + segments + '</div><button class="btn2" data-act="printReport">พิมพ์ / บันทึก PDF</button></div></div>';
  const none = count ? '' : '<div class="card"><p class="hint" style="margin:0">' + (month ? 'ไม่มีบันทึกในเดือนนี้' : 'ไม่มีบันทึกใน 7 วันล่าสุด') + '</p></div>';
  const tiles = '<div class="g g3"><div class="card stat"><span class="cap">Sleep Score เฉลี่ย</span><span class="v ' + (avgScore !== null && avgScore >= 70 ? 'good' : avgScore === null ? '' : 'low') + '">' + (avgScore === null ? '–' : avgScore) + '</span><span class="sub">' + (avgScore === null ? '' : G.scoreLabel(avgScore)) + '</span></div>' +
    '<div class="card stat"><span class="cap">หลับจริงเฉลี่ยต่อคืน</span><span class="v">' + (avgSleep === null ? '–' : dur(avgSleep)) + '</span></div>' +
    '<div class="card stat"><span class="cap">ประสิทธิภาพการนอนเฉลี่ย</span><span class="v ' + (avgEfficiency === null ? '' : avgEfficiency >= 85 ? 'good' : 'low') + '">' + (avgEfficiency === null ? '–' : avgEfficiency + '%') + '</span></div></div>';
  const times = '<div class="card"><h2>เวลาเฉลี่ย</h2><div class="kv"><span class="cap">เข้านอนเฉลี่ย</span><b style="font-size:26px">' + (count ? G.bedAvg(entries) : '–') + '</b></div><div class="kv"><span class="cap">ตื่นนอนเฉลี่ย</span><b style="font-size:26px">' + (count ? G.wakeAvg(entries) : '–') + '</b></div></div>';
  return head + tiles + none + renderBehaviorStats(api, S.entries) +
    '<div class="g g2"><div class="card"><h2>ระยะเวลาหลับจริง</h2>' + durChart(slots, month) + '</div><div class="card"><h2>ประสิทธิภาพการนอน</h2>' + effChart(slots, month) + '</div></div>' +
    '<div class="card"><h2>Sleep Score รายวัน</h2>' + scoreChart(slots, month) + scoreInfo() + '</div>' +
    '<div class="g gm">' + fxCard() + '<div class="stack">' + bedGoalCard(entries) + times + '</div></div>' + printReportHtml(S.entries);
}

function renderDay(api) {
  const { G, S, entryOn, param, empty, ic, sorted, A, bedDateOf, optLabel, fmtDate, dur, vs, effInfo, gh, scoreCard, diffTxt, esc, stars, moodLine, behaviorRecordCard } = api;
  const entry = entryOn(param);
  if (!entry) return empty('calendar-days', 'ไม่พบบันทึกของวันที่นี้', 'บันทึกอาจถูกลบไปแล้ว', false).replace('</p>', '</p><button class="btn" data-go="history">' + ic('chevron-left') + 'กลับไปหน้าประวัติ</button>');
  const list = sorted(), index = list.indexOf(entry), newer = list[index - 1], older = list[index + 1];
  const others = list.filter((item) => item !== entry).slice(0, 7), enough = others.length >= 2;
  const avgSleep = enough ? A(others.map((item) => item.asleep)) : NaN, avgEfficiency = enough ? A(others.map((item) => item.eff)) : NaN;
  const total = entry.lat + entry.asleep + entry.awk, percent = (value) => value / total * 100;
  const bedDate = bedDateOf(entry);
  const navButton = (item, direction, label) => item ? '<button class="sb" data-go="day" data-date="' + item.date + '" aria-label="' + label + '">' + ic(direction) + '</button>' : '<button class="sb" disabled aria-label="' + label + '" style="opacity:.35;cursor:not-allowed">' + ic(direction) + '</button>';
  const factors = G.FACTORS.filter((factor) => entry.factors.indexOf(factor.id) > -1);
  return '<div class="phead"><div><button class="btn2" data-go="history" style="min-height:38px;padding:4px 14px;margin-bottom:12px">' + ic('chevron-left', 'sm') + 'ประวัติ</button><h1>' + fmtDate(entry.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '</h1><div class="cap">คืนวันที่ ' + fmtDate(bedDate, { day: 'numeric' }) + ' → ' + fmtDate(entry.date, { day: 'numeric', month: 'long' }) + ' · ' + entry.bed + ' → ' + entry.wake + '</div></div>' +
    '<div class="inl" style="gap:10px">' + navButton(older, 'chevron-left', 'คืนก่อนหน้า') + navButton(newer, 'chevron-right', 'คืนถัดไป') + '<button class="btn2" data-act="edit" data-date="' + entry.date + '">' + ic('pencil', 'sm') + 'แก้ไข</button><button class="btn2 danger" data-act="delday" data-date="' + entry.date + '">' + ic('trash-2', 'sm') + 'ลบ</button></div></div>' +
    '<div class="g gm"><div class="stack"><div class="g g3"><div class="card stat"><span class="cap">หลับจริง</span><span class="v">' + dur(entry.asleep) + '</span>' + vs(entry.asleep, avgSleep, 'นาที', true) + '</div>' +
    '<div class="card stat"><span class="cap">ประสิทธิภาพ</span><span class="v ' + effInfo(entry.eff, entry.asleep).cls + '">' + entry.eff + '%</span><span class="sub' + (effInfo(entry.eff, entry.asleep).note ? ' low' : '') + '">' + (effInfo(entry.eff, entry.asleep).note || effInfo(entry.eff, entry.asleep).txt) + '</span>' + vs(entry.eff, avgEfficiency, 'จุด', true) + '</div>' +
    '<div class="card stat"><span class="cap">อยู่บนเตียง</span><span class="v">' + dur(entry.inBed) + '</span><span class="sub">เป้าหมาย ' + gh(S.goal) + ' · หลับจริง ' + Math.round(entry.asleep / S.goal * 100) + '%</span></div></div>' + scoreCard(entry) +
    (S.goalBed === null || S.goalBed === undefined ? '' : '<div class="card"><div class="kv" style="padding:0;border:0"><span class="cap">เข้านอนเทียบเป้า ' + G.fmtT(S.goalBed) + '</span><b>' + diffTxt(G.bedDiff(entry.bed, S.goalBed)) + '</b></div></div>') +
    (entry.bedAt ? '<div class="card"><span class="cap">เวลาจริงที่บันทึก</span><p class="hint" style="margin:6px 0 0">เริ่มนอน ' + esc(new Date(entry.bedAt).toLocaleString('th-TH')) + (entry.bedTz ? ' (' + esc(entry.bedTz) + ')' : '') + '<br>ตื่น ' + esc(new Date(entry.wakeAt).toLocaleString('th-TH')) + (entry.tz ? ' (' + esc(entry.tz) + ')' : '') + '</p></div>' : '') +
    '<div class="card"><h2>สัดส่วนเวลาบนเตียง</h2><div class="comp" role="img" aria-label="หลับช้า ' + entry.lat + ' นาที หลับจริง ' + entry.asleep + ' นาที ตื่นกลางดึก ' + entry.awk + ' นาที">' +
    (entry.lat ? '<i class="s-lat" style="width:' + percent(entry.lat) + '%"></i>' : '') + '<i class="s-sleep" style="width:' + percent(entry.asleep) + '%"></i>' + (entry.awk ? '<i class="s-awk" style="width:' + percent(entry.awk) + '%"></i>' : '') + '</div>' +
    '<div class="legend"><span><s class="s-lat"></s>หลับช้า ' + entry.lat + ' น. (' + Math.round(percent(entry.lat)) + '%)</span><span><s class="s-sleep"></s>หลับจริง ' + G.fmtDur(entry.asleep) + ' (' + Math.round(percent(entry.asleep)) + '%)</span><span><s class="s-awk"></s>ตื่นกลางดึก ' + entry.awk + ' น. (' + Math.round(percent(entry.awk)) + '%)</span></div></div></div>' +
    '<div class="stack"><div class="card"><div class="phead"><div><h2>ความสดชื่นตอนตื่น</h2>' + (entry.rating ? stars(entry.rating) : '<span class="sub">ไม่ได้ให้คะแนน</span>') + (moodLine(entry) ? '<div style="margin-top:8px">' + moodLine(entry) + '</div>' : '') + '</div>' + (entry.rating ? '<b style="font-size:26px">' + entry.rating + ' / 5</b>' : '') + '</div></div>' +
    '<div class="card"><div class="phead" style="align-items:center"><h2>ปัจจัยของคืนนั้น</h2><span class="pill">' + factors.length + ' จาก ' + G.FACTORS.length + '</span></div><div class="flist">' + G.FACTORS.map((factor) => { const on = entry.factors.indexOf(factor.id) > -1; return '<div class="fr' + (on ? ' on' : '') + '"><span class="inl">' + ic(factor.icon, 'sm') + factor.label + '</span>' + (on ? '<span class="yes">' + ic('check', 'sm') + 'มี</span>' : '<span class="no">ไม่ได้เลือก</span>') + '</div>'; }).join('') + '</div></div>' + behaviorRecordCard(entry) +
    '<div class="card"><h2>บันทึกเพิ่มเติม</h2>' + (entry.note ? '<p style="margin:0;white-space:pre-wrap;line-height:1.7">' + esc(entry.note) + '</p>' : '<p class="hint" style="margin:0">ไม่มีบันทึกเพิ่มเติม</p>') + '</div></div></div>';
}

export function createDashboardStatsFeature(api = {}) {
  const actions = {
    selon: () => { api.selMode = true; api.sel = {}; api.render(); },
    seloff: () => { api.selMode = false; api.sel = {}; api.render(); },
    selrow: (element) => {
      const date = element.dataset.date;
      if (api.sel[date]) delete api.sel[date]; else api.sel[date] = true;
      api.render();
    },
    selall: () => {
      const history = api.histList(), allSelected = history.every((entry) => api.sel[entry.date]);
      api.sel = {};
      if (!allSelected) history.forEach((entry) => { api.sel[entry.date] = true; });
      api.render();
    },
    seldel: () => {
      const dates = Object.keys(api.sel);
      if (!dates.length) return;
      api.confirmBox('ลบ ' + dates.length + ' บันทึก?', 'บันทึกที่เลือกทั้งหมด ' + dates.length + ' คืนจะถูกลบ ย้อนกลับไม่ได้ (ส่งออก CSV สำรองไว้ก่อนได้)', 'ลบ ' + dates.length + ' บันทึก', function () {
        api.removeEntries(dates); api.selMode = false; api.sel = {}; api.render(); api.toast('ลบ ' + dates.length + ' บันทึกแล้ว');
      });
    },
    smode: (element) => { api.statsMode = element.dataset.v; api.render(); },
    mprev: () => { api.statsMonth = api.G.addMonths(api.statsMonth, -1); api.render(); },
    mnext: () => { if (api.statsMonth < api.today().slice(0, 7)) { api.statsMonth = api.G.addMonths(api.statsMonth, 1); api.render(); } },
    fxdetail: (element) => api.fxDetail(element.dataset.id),
    printReport: () => {
      api.document.body.classList.add('printing-report');
      api.window.addEventListener('afterprint', function () { api.document.body.classList.remove('printing-report'); }, { once: true });
      api.window.print();
    },
    seg: (element) => {
      api.histFilter = element.dataset.v;
      const visible = {};
      api.histList().forEach((entry) => { if (api.sel[entry.date]) visible[entry.date] = true; });
      api.sel = visible;
      api.render();
    },
    edit: (element) => { api.draft = api.newDraft(element.dataset.date); api.nav('log', true); },
    export: () => {
      if (!api.S.entries.length) { api.toast('ยังไม่มีข้อมูลให้ส่งออก'); return; }
      const BlobType = api.Blob || Blob, URLApi = api.URL || URL;
      const blob = new BlobType([api.G.csv(api.S.entries, api.S.goal)], { type: 'text/csv;charset=utf-8' });
      const url = URLApi.createObjectURL(blob), link = api.document.createElement('a');
      link.href = url; link.download = 'good-night-' + api.today() + '.csv'; api.document.body.appendChild(link); link.click(); link.remove();
      api.window.setTimeout(function () { URLApi.revokeObjectURL(url); }, 1000);
      api.toast('ส่งออกไฟล์ CSV แล้ว');
    },
    clear: () => {
      if (!api.S.entries.length) { api.toast('ยังไม่มีข้อมูลให้ลบ'); return; }
      api.confirmBox('ลบข้อมูลทั้งหมด?', 'บันทึกทั้งหมด ' + api.S.entries.length + ' คืนจะถูกลบ ย้อนกลับไม่ได้ (ส่งออก CSV สำรองไว้ก่อนได้)', 'ลบทั้งหมด', function () { api.clearEntries(); api.render(); api.toast('ลบข้อมูลทั้งหมดแล้ว'); });
    },
    delday: (element) => api.confirmBox('ลบบันทึกนี้?', 'บันทึกของวันที่ ' + api.fmtDate(element.dataset.date, { day: 'numeric', month: 'long', year: 'numeric' }) + ' จะถูกลบ ย้อนกลับไม่ได้', 'ลบบันทึก', function () { api.removeEntry(element.dataset.date); api.nav('history'); api.toast('ลบบันทึกแล้ว'); }),
  };
  return {
    name: 'dashboard-stats',
    views: {
      home: () => renderHome(api),
      history: () => renderHistory(api),
      stats: () => renderStats(api),
      day: () => renderDay(api),
    },
    components: { behaviorStats: (entries) => renderBehaviorStats(api, entries) },
    actions,
    events: { input: () => false, change: () => false },
  };
}
