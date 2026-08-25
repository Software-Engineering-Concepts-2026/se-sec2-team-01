/* ===================================================================
   Good Night — หน้าภาพรวม (Dashboard) — dashboard.js
   =================================================================== */

/* ---------------- ข้อมูลผู้ใช้ / บริบท ---------------- */
const profile = {
  name: 'รักษ์ดี',
  age: 22,
  targetBedtime: 23.5, // 23:30
  checkedInToday: false,
};

const factorMeta = {
  caffeine: { label: 'ดื่มกาแฟ/คาเฟอีนหลังบ่าย', icon: 'coffee', weight: -5 },
  screen:   { label: 'ใช้หน้าจอก่อนนอน',          icon: 'smartphone', weight: -5 },
  exercise: { label: 'ออกกำลังกายวันนี้',          icon: 'footprints', weight: 5 },
  stress:   { label: 'รู้สึกเครียด/คิดมาก',        icon: 'brain', weight: -5 },
};

/* เจ็ดคืนล่าสุด (ข้อมูลตัวอย่าง) */
const nights = [
  { day:'จ',  date:'1 ก.ค. 2569', bedtime:'23:20', wake:'06:50', quality:4, factors:['exercise'], note:'' },
  { day:'อ',  date:'2 ก.ค. 2569', bedtime:'00:10', wake:'06:40', quality:3, factors:['screen'],   note:'เล่นมือถือก่อนนอนนานไปหน่อย' },
  { day:'พ',  date:'3 ก.ค. 2569', bedtime:'23:50', wake:'06:30', quality:2, factors:['stress','screen'], note:'คิดเรื่องงานพรุ่งนี้ นอนไม่ค่อยหลับ' },
  { day:'พฤ', date:'4 ก.ค. 2569', bedtime:'23:15', wake:'06:40', quality:4, factors:[], note:'' },
  { day:'ศ',  date:'5 ก.ค. 2569', bedtime:'01:05', wake:'08:30', quality:3, factors:['caffeine'], note:'' },
  { day:'ส',  date:'6 ก.ค. 2569', bedtime:'00:20', wake:'07:10', quality:5, factors:['exercise'], note:'หลับสบายไม่มีอะไรรบกวน' },
  { day:'อา', date:'7 ก.ค. 2569', bedtime:'23:40', wake:'06:50', quality:4, factors:['exercise'], note:'รู้สึกสดชื่นกว่าปกติ' },
];

let selectedIndex = nights.length - 1;

/* ---------------- ฟังก์ชันเวลา / คะแนน ---------------- */
function timeToDecimal(t){ const [h,m] = t.split(':').map(Number); return h + m/60; }

function sleepHours(bedtime, wake){
  let b = timeToDecimal(bedtime), w = timeToDecimal(wake);
  if (w <= b) w += 24;
  return w - b;
}

function recommendedHours(age){
  if (age < 6)  return [10,13];
  if (age < 13) return [9,11];
  if (age < 18) return [8,10];
  if (age < 26) return [7,9];
  if (age < 65) return [7,9];
  return [7,8];
}

function computeScore(n){
  const [lo,hi] = recommendedHours(profile.age);
  const dur = sleepHours(n.bedtime, n.wake);
  const mid = (lo+hi)/2;
  const durationScore = Math.max(0, Math.min(30, Math.round(30 - Math.abs(dur-mid)*10)));
  const feelingScore = Math.round((n.quality/5)*35);
  let factorScore = 15;
  n.factors.forEach(f => { if (factorMeta[f]) factorScore += factorMeta[f].weight; });
  factorScore = Math.max(0, Math.min(20, factorScore));
  const bedDec = timeToDecimal(n.bedtime);
  let diff = Math.abs(bedDec - profile.targetBedtime);
  if (diff > 12) diff = 24 - diff;
  const consistencyScore = Math.max(0, Math.min(15, Math.round(15 - diff*10)));
  const total = Math.max(0, Math.min(100, durationScore+feelingScore+factorScore+consistencyScore));
  return { total, durationScore, feelingScore, factorScore, consistencyScore, dur };
}

function scoreLabel(total){
  if (total >= 85) return 'ดีเยี่ยม';
  if (total >= 70) return 'ดี';
  if (total >= 50) return 'พอใช้';
  return 'ควรปรับปรุง';
}

function avgScore(){
  const total = nights.reduce((a,n) => a + computeScore(n).total, 0);
  return Math.round(total / nights.length);
}

function avgTime(field){
  let sinSum = 0, cosSum = 0;
  nights.forEach(n => {
    const v = timeToDecimal(n[field]);
    const theta = (v/24) * 2 * Math.PI;
    sinSum += Math.sin(theta);
    cosSum += Math.cos(theta);
  });
  let theta = Math.atan2(sinSum, cosSum);
  if (theta < 0) theta += 2*Math.PI;
  const v = (theta/(2*Math.PI)) * 24;
  const totalMin = Math.round(v*60) % 1440;
  const h = Math.floor(totalMin/60), m = totalMin % 60;
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
}

function li(name, size=18, extra=''){
  return `<i data-lucide="${name}" width="${size}" height="${size}" ${extra}></i>`;
}

/* ---------------- ส่วนเรนเดอร์ ---------------- */
function scoreRing(total, size=152){
  const r = 54, c = 2*Math.PI*r;
  const off = c - (c*total/100);
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 128 128">
    <circle cx="64" cy="64" r="${r}" fill="none" stroke="var(--line)" stroke-width="10"/>
    <circle cx="64" cy="64" r="${r}" fill="none" stroke="#A6B4FB" stroke-width="10"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}"
      transform="rotate(-90 64 64)" style="transition:stroke-dashoffset .5s ease"/>
    <text x="64" y="60" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="30" fill="#EEF0FB">${total}</text>
    <text x="64" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#9BA3C9">${scoreLabel(total)}</text>
  </svg>`;
}

function renderHeader(){
  document.getElementById('greeting').textContent = `สวัสดีตอนเช้า, ${profile.name}`;
  const opts = { day:'numeric', month:'long', year:'numeric' };
  document.getElementById('today-date').textContent =
    new Intl.DateTimeFormat('th-TH-u-ca-buddhist', opts).format(new Date());
}

function renderScore(){
  const latest = nights[nights.length-1];
  const sc = computeScore(latest);
  document.getElementById('score-label').textContent =
    profile.checkedInToday ? 'คะแนนคุณภาพการนอนคืนนี้' : `คะแนนล่าสุด · ${latest.date}`;
  document.getElementById('score-ring').innerHTML = scoreRing(sc.total);
  document.getElementById('score-word').textContent = scoreLabel(sc.total);
}

function renderNudge(){
  const nudge = document.getElementById('nudge-card');
  nudge.style.display = profile.checkedInToday ? 'none' : 'flex';
}

function renderStats(){
  document.getElementById('stat-avg').textContent = `${avgScore()}/100`;
  document.getElementById('stat-streak').textContent = `${nights.length + (profile.checkedInToday?1:0)} วัน`;
  document.getElementById('stat-bedtime').textContent = avgTime('bedtime');
  document.getElementById('stat-wake').textContent = avgTime('wake');
  document.getElementById('streak-days').textContent = `${nights.length + (profile.checkedInToday?1:0)} วัน`;
}

function renderChart(){
  const wrap = document.getElementById('chart-bars');
  wrap.innerHTML = nights.map((n,i) => {
    const s = computeScore(n).total;
    const h = Math.max(6, Math.round(s*0.9));
    return `
    <button class="chart-col ${i===selectedIndex?'selected':''}" data-idx="${i}">
      <div class="chart-bar" style="height:${h}px"></div>
      <span class="chart-day">${n.day}</span>
    </button>`;
  }).join('');
}

function renderDetail(){
  const n = nights[selectedIndex];
  const sc = computeScore(n);
  const tags = n.factors.length
    ? n.factors.map(f => `<span class="tag ${factorMeta[f].weight<0?'warn':'good'}">${li(factorMeta[f].icon,12)} ${factorMeta[f].label}</span>`).join('')
    : `<span class="tag good">${li('check',12)} ไม่มีปัจจัยรบกวน</span>`;

  document.getElementById('detail-card').innerHTML = `
    <div class="night-detail">
      <div class="night-detail-head">
        <p class="label-sm">${n.date}</p>
        <span class="num score">${sc.total}<span style="font-size:12px;color:var(--text-muted)">/100</span></span>
      </div>
      <div class="night-detail-row">${li('moon',15)} เข้านอน ${n.bedtime} → ตื่น ${n.wake} (${sc.dur.toFixed(1)} ชม.)</div>
      <div class="night-detail-row">${li('smile',15)} ความรู้สึกตอนตื่น ${n.quality}/5</div>
      ${n.note ? `<div class="night-detail-row">${li('sticky-note',15)} ${n.note}</div>` : ''}
      <div class="night-tags">${tags}</div>
    </div>`;

  if (window.lucide) lucide.createIcons({ attrs:{ 'stroke-width':1.6 } });
}

function renderInsights(){
  const screenNights = nights.filter(n => n.factors.includes('screen'));
  const exerciseNights = nights.filter(n => n.factors.includes('exercise'));
  const rows = [];

  if (screenNights.length){
    const avgS = Math.round(screenNights.reduce((a,n)=>a+computeScore(n).total,0)/screenNights.length);
    rows.push({ icon:'smartphone', color:'var(--coral)',
      text:`คืนที่คุณใช้หน้าจอก่อนนอน คะแนนเฉลี่ยอยู่ที่ ${avgS}/100 ต่ำกว่าคืนอื่นอย่างชัดเจน` });
  }
  if (exerciseNights.length){
    const avgE = Math.round(exerciseNights.reduce((a,n)=>a+computeScore(n).total,0)/exerciseNights.length);
    rows.push({ icon:'footprints', color:'var(--aurora)',
      text:`วันที่ออกกำลังกาย คุณได้คะแนนคุณภาพการนอนเฉลี่ย ${avgE}/100 สูงกว่าปกติเกือบทุกครั้ง` });
  }
  if (!rows.length){
    rows.push({ icon:'sparkles', color:'var(--lavender)', text:'บันทึกต่อเนื่องอีกสักหน่อย ระบบจะเริ่มเห็นแพทเทิร์นจากปัจจัยที่คุณติดตาม' });
  }

  document.getElementById('insights').innerHTML = rows.map(r => `
    <div class="insight-row">
      ${li(r.icon,16,`style="color:${r.color};flex-shrink:0;margin-top:2px"`)}
      <p>${r.text}</p>
    </div>`).join('');
}

/* ---------------- toast แจ้งเตือน ---------------- */
let toastTimer = null;
function showToast(text){
  const t = document.getElementById('toast');
  document.getElementById('toast-text').textContent = text;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------------- ผูก Event ---------------- */
function bindEvents(){
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.nav;
      if (target === 'home') return;
      document.querySelectorAll('.snav-item').forEach(b => b.classList.toggle('active', b.dataset.nav === target));
      showToast(`หน้า "${btn.textContent.trim()}" จะเชื่อมต่อในระบบจริงต่อไป`);
      setTimeout(() => {
        document.querySelectorAll('.snav-item').forEach(b => b.classList.toggle('active', b.dataset.nav === 'home'));
      }, 1600);
    });
  });

  document.getElementById('chart-bars').addEventListener('click', (e) => {
    const col = e.target.closest('.chart-col');
    if (!col) return;
    selectedIndex = parseInt(col.dataset.idx, 10);
    renderChart();
    renderDetail();
  });

  document.getElementById('refresh-btn').addEventListener('click', (e) => {
    e.currentTarget.style.transform = 'rotate(360deg)';
    e.currentTarget.style.transition = 'transform .5s ease';
    setTimeout(() => { e.currentTarget.style.transform = ''; }, 500);
    renderAll();
    showToast('อัปเดตข้อมูลล่าสุดแล้ว');
  });
}

function renderAll(){
  renderHeader();
  renderScore();
  renderNudge();
  renderStats();
  renderChart();
  renderDetail();
  renderInsights();
  if (window.lucide) lucide.createIcons({ attrs:{ 'stroke-width':1.6 } });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  bindEvents();
});