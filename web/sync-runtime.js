(function (root) {
  'use strict';

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function nextRevision(pending) {
    pending._rev = (Number.isSafeInteger(pending._rev) && pending._rev >= 0 ? pending._rev : 0) + 1;
    return pending._rev;
  }

  function markEntry(pending, date, operation) {
    if (!pending.e || typeof pending.e !== 'object') pending.e = {};
    pending.e[date] = { op: operation, rev: nextRevision(pending) };
  }

  function markProfile(pending) {
    pending.p = { rev: nextRevision(pending) };
  }

  function operationOf(marker) {
    return typeof marker === 'string' ? marker : marker && marker.op;
  }

  function markerMatches(current, expected) {
    if (current === expected) return true;
    return !!current && !!expected && typeof current === 'object' && typeof expected === 'object' &&
      current.rev === expected.rev && current.op === expected.op;
  }

  function snapshot(pending, entries, profile) {
    var byDate = {};
    (entries || []).forEach(function (entry) { byDate[entry.date] = entry; });
    var ops = Object.keys(pending.e || {}).map(function (date) {
      var marker = pending.e[date];
      var operation = operationOf(marker);
      if (operation !== 'put' && operation !== 'del') return null;
      return { date: date, marker: clone(marker), operation: operation, entry: clone(byDate[date]) };
    }).filter(Boolean);
    return {
      entries: ops,
      profile: pending.p ? { marker: clone(pending.p), value: clone(profile || {}) } : null
    };
  }

  function pendingCount(pending) {
    return Object.keys(pending.e || {}).length + (pending.p ? 1 : 0);
  }

  function mergeEntries(localEntries, pending, remoteEntries) {
    var local = (localEntries || []).slice();
    var dirty = pending && pending.e || {};
    var remote = {};
    (remoteEntries || []).forEach(function (entry) { remote[entry.date] = entry; });
    var changed = false;
    Object.keys(remote).forEach(function (date) {
      if (dirty[date]) return;
      var current = local.find(function (entry) { return entry.date === date; });
      if (!current || JSON.stringify(current) !== JSON.stringify(remote[date])) {
        local = local.filter(function (entry) { return entry.date !== date; });
        local.push(clone(remote[date]));
        changed = true;
      }
    });
    local = local.filter(function (entry) {
      if (!remote[entry.date] && !dirty[entry.date]) { changed = true; return false; }
      return true;
    });
    return { entries: local, changed: changed };
  }

  function create(options) {
    var inflight = null;

    function flush() {
      if (inflight) return inflight;
      var pending = options.pending();
      if (!options.online() || !pending || !pendingCount(pending)) return Promise.resolve(false);

      var sent = snapshot(pending, options.entries(), options.profile());
      if (!sent.entries.length && !sent.profile) return Promise.resolve(false);
      if (options.onStart) options.onStart();

      var chain = Promise.resolve();
      sent.entries.forEach(function (operation) {
        chain = chain.then(function () {
          if (operation.operation === 'del' || !operation.entry) return options.deleteEntry(operation.date);
          return options.putEntry(operation.entry);
        }).then(function () {
          var latest = options.pending();
          if (latest && latest.e && markerMatches(latest.e[operation.date], operation.marker)) {
            delete latest.e[operation.date];
            options.save();
          }
        });
      });

      if (sent.profile) {
        chain = chain.then(function () { return options.putProfile(sent.profile.value); }).then(function () {
          var latest = options.pending();
          if (latest && markerMatches(latest.p, sent.profile.marker)) {
            latest.p = false;
            options.save();
          }
        });
      }

      var failed = false;
      inflight = chain.catch(function (error) {
        failed = true;
        if (options.onError) options.onError(error);
      }).then(function () {
        inflight = null;
        if (!failed && options.online() && pendingCount(options.pending())) return flush();
        if (options.onFinish) options.onFinish();
        return !failed;
      });
      return inflight;
    }

    return { flush: flush };
  }

  var api = { create: create, markEntry: markEntry, markProfile: markProfile, mergeEntries: mergeEntries, pendingCount: pendingCount };
  root.GNSync = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
