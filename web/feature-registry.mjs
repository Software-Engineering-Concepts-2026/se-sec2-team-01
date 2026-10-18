/** Combine feature-owned route and action maps and fail fast on ownership collisions. */
export function createFeatureRegistry(features) {
  const views = Object.create(null);
  const actions = Object.create(null);
  const components = Object.create(null);
  const events = { input: [], change: [] };

  for (const feature of features) {
    for (const [route, render] of Object.entries(feature.views || {})) {
      if (Object.hasOwn(views, route)) throw new Error(`duplicate view: ${route}`);
      views[route] = render;
    }
    for (const [action, handle] of Object.entries(feature.actions || {})) {
      if (Object.hasOwn(actions, action)) throw new Error(`duplicate action: ${action}`);
      actions[action] = handle;
    }
    for (const [name, component] of Object.entries(feature.components || {})) {
      if (Object.hasOwn(components, name)) throw new Error(`duplicate component: ${name}`);
      components[name] = component;
    }
    for (const [event, handle] of Object.entries(feature.events || {})) {
      if (!Object.hasOwn(events, event)) throw new Error(`unsupported feature event: ${event}`);
      if (typeof handle !== 'function') throw new TypeError(`${feature.name || 'feature'} ${event} handler must be a function`);
      events[event].push(handle);
    }
  }

  return { views, actions, components, events };
}
