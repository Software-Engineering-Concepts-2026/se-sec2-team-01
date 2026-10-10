import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const manifest = JSON.parse(readFileSync(new URL('../../web/manifest.webmanifest', import.meta.url), 'utf8'));
const workerSource = readFileSync(new URL('../../web/service-worker.js', import.meta.url), 'utf8');

function worker(fetchHandler) {
  const listeners = {};
  const entries = new Map();
  const cache = {
    addAll: async (assets) => { cache.assets = assets; },
    put: async (request, response) => { entries.set(typeof request === 'string' ? request : request.url, response); },
    match: async (request) => entries.get(typeof request === 'string' ? request : request.url),
  };
  const caches = {
    open: async () => cache,
    keys: async () => ['good-night-shell-v0', 'good-night-shell-v1', 'unrelated-cache'],
    delete: async (key) => { caches.deleted.push(key); return true; },
    deleted: [],
  };
  const self = {
    location: { origin: 'https://sleep.example', href: 'https://sleep.example/app/service-worker.js' },
    clients: { claim: async () => {} },
    addEventListener: (name, listener) => { listeners[name] = listener; },
    skipWaiting: async () => {},
  };
  runInNewContext(workerSource, { self, caches, fetch: fetchHandler, URL, Promise, Response });
  return { listeners, cache, caches, self };
}

test('manifest stays relative for static hosting from a subpath and declares a maskable icon', () => {
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.display, 'standalone');
  assert.deepEqual(manifest.icons[0], {
    src: './icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable',
  });
});

test('service worker precaches only app-shell assets and removes only old Good Night caches', async () => {
  const app = worker(async () => new Response('ok'));
  let install;
  app.listeners.install({ waitUntil: (promise) => { install = promise; } });
  await install;
  assert.deepEqual(Array.from(app.cache.assets), [
    './index.html', './config-runtime.js', './sync-runtime.js', './manifest.webmanifest', './icons/icon.svg',
  ]);
  let activate;
  app.listeners.activate({ waitUntil: (promise) => { activate = promise; } });
  await activate;
  assert.deepEqual(app.caches.deleted, ['good-night-shell-v0']);
});

test('service worker caches the generated config during install for the first offline reopen', async () => {
  const configSource = 'window.GN_CONFIG = { mode: "cloud" };';
  const app = worker(async (request) => {
    const url = typeof request === 'string' ? request : request.url;
    return url.endsWith('/config.js') ? new Response(configSource) : new Response('ok');
  });
  let install;
  app.listeners.install({ waitUntil: (promise) => { install = promise; } });
  await install;

  const cachedConfig = await app.cache.match('https://sleep.example/app/config.js');
  assert.equal(await cachedConfig.text(), configSource);

  let responsePromise;
  app.listeners.fetch({
    request: { method: 'GET', url: 'https://sleep.example/app/config.js', mode: 'cors' },
    respondWith: (promise) => { responsePromise = promise; },
  });
  const response = await responsePromise;
  assert.equal(await response.text(), configSource);
});

test('service worker installation still succeeds when no generated config exists', async () => {
  const app = worker(async (request) => {
    const url = typeof request === 'string' ? request : request.url;
    return url.endsWith('/config.js') ? new Response('', { status: 404 }) : new Response('ok');
  });
  let install;
  app.listeners.install({ waitUntil: (promise) => { install = promise; } });

  await assert.doesNotReject(install);
  assert.equal(await app.cache.match('https://sleep.example/app/config.js'), undefined);
});

test('service worker leaves Supabase API and cross-origin requests untouched', () => {
  const app = worker(async () => new Response('must not be called'));
  for (const request of [
    { method: 'GET', url: 'https://project.supabase.co/rest/v1/entries', mode: 'cors' },
    { method: 'GET', url: 'https://sleep.example/app/auth/v1/user', mode: 'navigate' },
    { method: 'GET', url: 'https://sleep.example/app/unlisted', mode: 'navigate' },
    { method: 'POST', url: 'https://sleep.example/app/index.html', mode: 'cors' },
    { method: 'GET', url: 'https://sleep.example/app/api/entries', mode: 'cors' },
  ]) {
    let intercepted = false;
    app.listeners.fetch({ request, respondWith: () => { intercepted = true; } });
    assert.equal(intercepted, false);
  }
});

test('offline app navigation falls back to the cached static shell', async () => {
  const app = worker(async () => { throw new Error('offline'); });
  app.cache.put('https://sleep.example/app/index.html', new Response('cached shell'));
  let responsePromise;
  app.listeners.fetch({
    request: { method: 'GET', url: 'https://sleep.example/app/', mode: 'navigate' },
    respondWith: (promise) => { responsePromise = promise; },
  });
  assert.equal(await (await responsePromise).text(), 'cached shell');
});
