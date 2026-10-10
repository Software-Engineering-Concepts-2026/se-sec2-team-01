(function (root) {
  'use strict';

  function isLoopback(hostname) {
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]';
  }

  function isLocalLocation(location) {
    return location.protocol === 'file:' || isLoopback(location.hostname);
  }

  function resolve(input, location) {
    var source = input && typeof input === 'object' ? input : {};
    var local = isLocalLocation(location || {});
    var requested = source.mode;
    var mode = local ? (requested === 'cloud' ? 'cloud' : 'local') : 'cloud';
    var supabaseUrl = String(source.supabaseUrl || '').trim().replace(/\/+$/, '');
    var supabaseAnonKey = String(source.supabaseAnonKey || '').trim();
    var error = null;

    if (requested && requested !== 'local' && requested !== 'cloud') {
      error = 'GN_CONFIG.mode must be either "local" or "cloud".';
    } else if (!local && requested === 'local') {
      error = 'Hosted Good Night requires cloud mode; local-only mode is limited to local development.';
    } else if (!local && location && location.protocol !== 'https:') {
      error = 'Hosted Good Night must use HTTPS so login tokens are protected in transit.';
    }

    var enabled = false;
    if (!error && mode === 'cloud') {
      if (!supabaseUrl || !supabaseAnonKey) {
        error = 'Set the Supabase URL and anon key in web/config.js before using Good Night on a hosted website.';
      } else {
        try {
          var parsed = new URL(supabaseUrl);
          var localSupabase = isLoopback(parsed.hostname);
          if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
            error = 'GN_CONFIG.supabaseUrl must be the Supabase project origin without credentials, path, query, or fragment.';
          } else if (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:' && localSupabase)) {
            error = 'Supabase must use HTTPS except when both the app and local Supabase run on loopback.';
          } else {
            enabled = true;
          }
        } catch (_error) {
          error = 'GN_CONFIG.supabaseUrl must be a valid HTTPS URL.';
        }
      }
    }

    return {
      config: {
        mode: mode,
        supabaseUrl: supabaseUrl,
        supabaseAnonKey: supabaseAnonKey,
        schemaV2: source.schemaV2 === true,
        privacyContact: String(source.privacyContact || ''),
        enabled: enabled
      },
      error: error
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { resolve: resolve, isLocalLocation: isLocalLocation };
  if (root && root.document && root.location) {
    var result = resolve(root.GN_CONFIG, root.location);
    root.GN_CONFIG = result.config;
    root.GN_CONFIG_ERROR = result.error;
  }
})(typeof window !== 'undefined' ? window : globalThis);
