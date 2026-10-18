/* Good Night – tiny Supabase client (auth + data) using plain fetch. No external library. */
(function (root) {
  'use strict';
  var C = root.GN_CONFIG || {};
  var url = String(C.supabaseUrl || '').replace(/\/+$/, ''), key = C.supabaseAnonKey || '';
  var enabled = C.enabled === true, SK = 'gn.cloud', sess = null;

  function lsGet() { try { return JSON.parse(localStorage.getItem(SK)); } catch (e) { return null; } }
  function lsSet(s) { try { if (s) localStorage.setItem(SK, JSON.stringify(s)); else localStorage.removeItem(SK); } catch (e) {} }
  sess = enabled ? lsGet() : null;

  function req(path, o) {
    o = o || {};
    var tok = o.token === undefined ? (sess && sess.access_token) : o.token;
    var h = { apikey: key, 'Content-Type': 'application/json', Authorization: 'Bearer ' + (tok || key) };
    if (o.prefer) h.Prefer = o.prefer;
    return fetch(url + path, { method: o.method || 'GET', headers: h, body: o.body !== undefined ? JSON.stringify(o.body) : undefined }).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) {
          var er = new Error((j && (j.msg || j.message || j.error_description || j.error)) || ('HTTP ' + r.status));
          er.status = r.status; er.code = j && (j.error_code || j.code); throw er;
        }
        return j;
      });
    }, function () { var er = new Error('network'); er.network = true; throw er; });
  }
  function toSession(j) {
    if (!j || !j.access_token || !j.user) return null;
    var um = j.user.user_metadata || {};
    return { access_token: j.access_token, refresh_token: j.refresh_token,
      expires_at: j.expires_at || (Math.floor(Date.now() / 1000) + (j.expires_in || 3600)),
      user: { id: j.user.id, email: j.user.email, name: um.name || '' } };
  }
  function keep(s) { sess = s; lsSet(s); return s; }

  function signUp(name, email, pw) {
    return req('/auth/v1/signup', { method: 'POST', token: null, body: { email: email, password: pw, data: { name: name } } }).then(function (j) {
      var s = toSession(j); if (s) keep(s); return { session: s };
    });
  }
  function signIn(email, pw) {
    return req('/auth/v1/token?grant_type=password', { method: 'POST', token: null, body: { email: email, password: pw } }).then(function (j) { return keep(toSession(j)); });
  }
  function refresh() {
    if (!sess || !sess.refresh_token) return Promise.reject(new Error('no session'));
    return req('/auth/v1/token?grant_type=refresh_token', { method: 'POST', token: null, body: { refresh_token: sess.refresh_token } }).then(function (j) { return keep(toSession(j)); });
  }
  function ensure() {
    if (!sess) return Promise.reject(new Error('no session'));
    if (sess.expires_at - Math.floor(Date.now() / 1000) > 60) return Promise.resolve(sess);
    return refresh();
  }
  function signOut() { var t = sess && sess.access_token; keep(null); if (t) req('/auth/v1/logout', { method: 'POST', token: t }).catch(function () {}); }
  function recover(email) { return req('/auth/v1/recover', { method: 'POST', token: null, body: { email: email } }); }
  function updatePassword(pw, token) { return req('/auth/v1/user', { method: 'PUT', token: token, body: { password: pw } }); }

  /* Password recovery links come back as #access_token=...&type=recovery. */
  function fromHash(hash) {
    var q = {}; String(hash || '').replace(/^#/, '').split('&').forEach(function (p) { var i = p.indexOf('='); if (i > 0) q[p.slice(0, i)] = decodeURIComponent(p.slice(i + 1).replace(/\+/g, ' ')); });
    if (q.type !== 'recovery') return Promise.resolve(null);
    if (q.error_description || q.error) return Promise.resolve({ error: q.error_description || q.error });
    if (!q.access_token) return Promise.resolve(null);
    return req('/auth/v1/user', { token: q.access_token }).then(function (u) {
      var s = toSession({ access_token: q.access_token, refresh_token: q.refresh_token, expires_in: +q.expires_in || 3600, user: u });
      return { type: 'recovery', session: s };
    });
  }

  var V2 = !!C.schemaV2;   /* true after applying the base cloud schema */
  var V3 = !!C.schemaV3;   /* true only after applying the behavior_details migration */
  function rowOf(e) { var r = { user_id: sess.user.id, date: e.date, bed: e.bed, wake: e.wake, lat: e.lat, awk: e.awk, in_bed: e.inBed, asleep: e.asleep, eff: e.eff, rating: e.rating || 0, factors: e.factors || [], note: e.note || '' };
    if (V2) { r.mood = e.mood || ''; r.bed_at = e.bedAt || null; r.wake_at = e.wakeAt || null; r.tz = e.tz || null; r.bed_tz = e.bedTz || null; }
    if (V3) r.behavior_details = e.behaviorDetails || {};
    return r; }
  function entryOf(r) { var e = { date: r.date, bed: r.bed, wake: r.wake, lat: r.lat, awk: r.awk, inBed: r.in_bed, asleep: r.asleep, eff: r.eff, rating: r.rating || 0, factors: r.factors || [], note: r.note || '', mood: r.mood || '' };
    e.behaviorDetails = r.behavior_details || {};
    if (r.bed_at) { e.bedAt = r.bed_at; e.wakeAt = r.wake_at || ''; e.tz = r.tz || ''; e.bedTz = r.bed_tz || ''; } return e; }

  function pull() {
    return ensure().then(function () {
      return Promise.all([req('/rest/v1/entries?select=date,bed,wake,lat,awk,in_bed,asleep,eff,rating,factors,note' + (V2 ? ',mood,bed_at,wake_at,tz,bed_tz' : '') + (V3 ? ',behavior_details' : '') + '&order=date.desc&limit=5000'), req('/rest/v1/profiles?select=name,goal_min,onboarded' + (V2 ? ',prefs' : '') + '&limit=1')]);
    }).then(function (a) { return { entries: (a[0] || []).map(entryOf), profile: (a[1] || [])[0] || null }; });
  }
  function put(e) {
    return ensure().then(function () { return req('/rest/v1/entries?on_conflict=user_id,date', { method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: [rowOf(e)] }); });
  }
  function del(date) { return ensure().then(function () { return req('/rest/v1/entries?date=eq.' + encodeURIComponent(date), { method: 'DELETE' }); }); }
  function putProfile(p) { return ensure().then(function () { return req('/rest/v1/profiles?on_conflict=user_id', { method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: [V2 ? { user_id: sess.user.id, name: p.name || '', goal_min: p.goal, onboarded: !!p.onboarded, prefs: p.prefs || {} } : { user_id: sess.user.id, name: p.name || '', goal_min: p.goal, onboarded: !!p.onboarded }] }); }); }
  function deleteAccount() { return ensure().then(function () { return req('/functions/v1/delete-account', { method: 'POST', body: {} }); }).then(function () { keep(null); }); }
  function aiRecommendations(payload) { return ensure().then(function () { return req('/functions/v1/ai-recommendations', { method: 'POST', body: payload }); }); }

  root.GNCloud = { enabled: enabled, session: function () { return sess; }, setSession: keep, signUp: signUp, signIn: signIn, signOut: signOut, recover: recover, updatePassword: updatePassword, fromHash: fromHash, pull: pull, put: put, del: del, putProfile: putProfile, deleteAccount: deleteAccount, aiRecommendations: aiRecommendations, ensure: ensure };
})(typeof window !== 'undefined' ? window : globalThis);
