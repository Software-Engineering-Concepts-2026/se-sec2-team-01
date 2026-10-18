export const ROUTES = ['home', 'log', 'history', 'stats', 'tips', 'settings', 'day'];

export function parseRouteHash(hash) {
  const route = String(hash || '').replace(/^#/, '');
  if (route.startsWith('day/')) return { route: 'day', param: route.slice(4) };
  if (ROUTES.includes(route) && route !== 'day') return { route, param: null };
  return null;
}

export function createRouter({
  getRoute,
  getParam,
  setRoute,
  clearOverlays = () => {},
  resetSelection = () => {},
  beginLog = () => {},
  render = () => {},
  scrollToTop = () => {},
  location = window.location,
  history = window.history,
}) {
  function navigate(route, keepDraft, param) {
    clearOverlays();
    if (route !== getRoute()) resetSelection();
    const routeParam = param || null;
    setRoute(route, routeParam);
    const hash = '#' + (route === 'day' ? 'day/' + routeParam : route);
    if (location.hash !== hash) {
      try { history.replaceState(null, '', hash); } catch { location.hash = hash; }
    }
    if (route === 'log' && !keepDraft) beginLog();
    render();
    scrollToTop(0, 0);
  }

  function syncHash(isAuthenticated) {
    if (!isAuthenticated) return false;
    const target = parseRouteHash(location.hash);
    if (!target) return false;
    if (target.route !== getRoute() || (target.route === 'day' && target.param !== getParam())) {
      navigate(target.route, false, target.param);
    }
    return true;
  }

  return { navigate, syncHash };
}
