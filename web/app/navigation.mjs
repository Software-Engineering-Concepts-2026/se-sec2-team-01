export const TABS = [
  ['home', 'house', 'หน้าหลัก'],
  ['log', 'moon', 'บันทึกการนอน'],
  ['history', 'calendar-days', 'ประวัติ'],
  ['stats', 'chart-column', 'สถิติ'],
  ['tips', 'sparkles', 'คำแนะนำ'],
  ['settings', 'settings', 'ตั้งค่า'],
];

const SHORT = { log: 'บันทึก' };

export function routeLabel(route) {
  if (route === 'day') return 'ประวัติ  /  รายละเอียด';
  return TABS.find(([name]) => name === route)?.[2];
}

function navItems(className, route, icon, short) {
  return TABS.map(([name, symbol, label]) => {
    const active = name === route || (route === 'day' && name === 'history');
    return '<button class="' + className + '" data-go="' + name + '"' +
      (active ? ' aria-current="page"' : '') + '>' + icon(symbol) + (short ? (SHORT[name] || label) : label) + '</button>';
  }).join('');
}

export function renderNavigation({ route, icon }) {
  return {
    sideHtml: navItems('nv', route, icon, false),
    tabsHtml: navItems('tab', route, icon, true),
  };
}

export function renderAccountHeader({ route, todayText, avatarHtml, displayName, escapeHtml, icon }) {
  return {
    breadcrumb: 'Good Night  /  ' + routeLabel(route),
    todayText,
    accountHtml: avatarHtml(34) + '<span class="nm">' + escapeHtml(displayName()) +
      '</span><button class="sb sm" data-act="logout" aria-label="ออกจากระบบ">' + icon('log-out') + '</button>',
    title: routeLabel(route) + ' · Good Night',
  };
}
