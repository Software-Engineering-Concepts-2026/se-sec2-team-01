export function applyTheme(theme, documentRef = document) {
  const activeTheme = theme === 'light' ? 'light' : 'dark';
  documentRef.documentElement.dataset.theme = activeTheme;
  const metadata = documentRef.querySelector('meta[name="theme-color"]');
  if (metadata) metadata.content = activeTheme === 'light' ? '#F6F5FB' : '#17142B';
  return activeTheme;
}

export function createThemeFeature(api = {}) {
  return {
    name: 'theme',
    actions: {
      theme() {
        api.S.theme = api.S.theme === 'light' ? 'dark' : 'light';
        api.persistPrefs();
        applyTheme(api.S.theme, api.document || document);
        api.render();
        api.toast(api.S.theme === 'light' ? 'เปิดธีมสว่างแล้ว' : 'เปิดธีมมืดแล้ว');
      },
    },
  };
}
