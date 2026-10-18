/* Cache only the same-origin static app shell. Supabase/Auth/Data API traffic is never cached. */
'use strict';

var CACHE_NAME = 'good-night-shell-v1';
var SHELL_ASSETS = [
  './index.html',
  './config-runtime.js',
  './sync-runtime.js',
  './manifest.webmanifest',
  './icons/icon.svg'
];
var CONFIG_URL = new URL('./config.js', self.location.href);
var INDEX_URL = new URL('./index.html', self.location.href);
var APP_BASE_URL = new URL('./', self.location.href);
var SHELL_URLS = SHELL_ASSETS.map(function (asset) { return new URL(asset, self.location.href).href; });

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(SHELL_ASSETS);
  }).then(function () {
    return fetch(CONFIG_URL.href).then(function (response) {
      if (response && response.ok) return caches.open(CACHE_NAME).then(function (cache) {
        return cache.put(CONFIG_URL.href, response.clone());
      });
    }).catch(function () {});
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key.indexOf('good-night-shell-') === 0 && key !== CACHE_NAME;
    }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (/(^|\/)(auth|rest|functions)\/v1(\/|$)/.test(url.pathname)) return;

  var navigation = request.mode === 'navigate' &&
    (url.pathname === APP_BASE_URL.pathname || url.pathname === INDEX_URL.pathname);
  var shellAsset = SHELL_URLS.indexOf(url.href) !== -1;
  var localConfig = url.origin === CONFIG_URL.origin && url.pathname === CONFIG_URL.pathname;
  if (!navigation && !shellAsset && !localConfig) return;

  event.respondWith(fetch(request).then(function (response) {
    if (response && response.ok) {
      return caches.open(CACHE_NAME).then(function (cache) {
        return cache.put(request, response.clone()).catch(function () {});
      }).then(function () { return response; });
    }
    return response;
  }).catch(function () {
    return caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(request).then(function (cached) {
        if (cached) return cached;
        if (navigation) return cache.match(INDEX_URL.href);
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    });
  }));
});
