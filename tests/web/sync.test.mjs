import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
let syncRuntime;
try {
  syncRuntime = require('../../web/sync-runtime.js');
} catch {
  syncRuntime = null;
}

function api() {
  assert.equal(typeof syncRuntime?.create, 'function', 'sync runtime must expose create(options)');
  assert.equal(typeof syncRuntime?.markEntry, 'function', 'sync runtime must expose revision-aware entry marking');
  assert.equal(typeof syncRuntime?.markProfile, 'function', 'sync runtime must expose revision-aware profile marking');
  return syncRuntime;
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function entry(note) {
  return { date: '2026-10-10', note };
}

test('an edit during an in-flight upsert is retained and sent as a second snapshot', async () => {
  const sync = api();
  const pending = { e: {} };
  const entries = [entry('first')];
  const gate = deferred();
  const sent = [];
  let online = true;
  const queue = sync.create({
    pending: () => pending,
    entries: () => entries,
    profile: () => ({}),
    online: () => online,
    putEntry: (value) => { sent.push(value); return sent.length === 1 ? gate.promise : Promise.resolve(); },
    deleteEntry: async () => {},
    putProfile: async () => {},
    save: () => {},
  });

  sync.markEntry(pending, '2026-10-10', 'put');
  const firstFlush = queue.flush();
  entries[0] = entry('second');
  sync.markEntry(pending, '2026-10-10', 'put');
  queue.flush();
  gate.resolve();
  await firstFlush;

  assert.deepEqual(sent, [entry('first'), entry('second')]);
  assert.equal(Object.hasOwn(pending.e, '2026-10-10'), false);
});

test('a delete during an in-flight upsert is preserved and sent after the upsert', async () => {
  const sync = api();
  const pending = { e: {} };
  const entries = [entry('to delete')];
  const gate = deferred();
  const sent = [];
  const queue = sync.create({
    pending: () => pending,
    entries: () => entries,
    profile: () => ({}),
    online: () => true,
    putEntry: (value) => { sent.push(['put', value]); return gate.promise; },
    deleteEntry: (date) => { sent.push(['delete', date]); return Promise.resolve(); },
    putProfile: async () => {},
    save: () => {},
  });

  sync.markEntry(pending, '2026-10-10', 'put');
  const firstFlush = queue.flush();
  entries.length = 0;
  sync.markEntry(pending, '2026-10-10', 'del');
  gate.resolve();
  await firstFlush;

  assert.deepEqual(sent, [['put', entry('to delete')], ['delete', '2026-10-10']]);
  assert.equal(Object.hasOwn(pending.e, '2026-10-10'), false);
});

test('profile edits during an in-flight profile write are retained as a later revision', async () => {
  const sync = api();
  const pending = { e: {} };
  const current = { name: 'first' };
  const gate = deferred();
  const sent = [];
  const queue = sync.create({
    pending: () => pending,
    entries: () => [],
    profile: () => current,
    online: () => true,
    putEntry: async () => {},
    deleteEntry: async () => {},
    putProfile: (value) => { sent.push(value); return sent.length === 1 ? gate.promise : Promise.resolve(); },
    save: () => {},
  });

  sync.markProfile(pending);
  const firstFlush = queue.flush();
  current.name = 'second';
  sync.markProfile(pending);
  gate.resolve();
  await firstFlush;

  assert.deepEqual(sent, [{ name: 'first' }, { name: 'second' }]);
  assert.equal(pending.p, false);
});

test('offline retry, legacy markers, and failed requests retain pending work', async () => {
  const sync = api();
  const pending = { e: { '2026-10-10': 'put' }, p: true };
  const entries = [entry('legacy')];
  let online = false;
  let fail = true;
  const sent = [];
  const queue = sync.create({
    pending: () => pending,
    entries: () => entries,
    profile: () => ({ name: 'legacy profile' }),
    online: () => online,
    putEntry: (value) => { sent.push(value); return fail ? Promise.reject(new Error('offline')) : Promise.resolve(); },
    deleteEntry: async () => {},
    putProfile: async () => {},
    save: () => {},
  });

  await queue.flush();
  assert.deepEqual(sent, []);
  assert.equal(pending.e['2026-10-10'], 'put');
  online = true;
  await queue.flush();
  assert.equal(pending.e['2026-10-10'], 'put');
  fail = false;
  await queue.flush();
  assert.equal(Object.hasOwn(pending.e, '2026-10-10'), false);
  assert.equal(pending.p, false);
  assert.deepEqual(sent, [entry('legacy'), entry('legacy')]);
});

test('server pulls never overwrite pending local edits or resurrect pending deletes', () => {
  const sync = api();
  const merged = sync.mergeEntries(
    [entry('local edit'), { date: '2026-10-11', note: 'local delete pending' }, { date: '2026-10-12', note: 'stale local' }],
    { e: { '2026-10-10': { op: 'put', rev: 2 }, '2026-10-11': { op: 'del', rev: 3 } } },
    [entry('stale server value'), { date: '2026-10-12', note: 'server value' }, { date: '2026-10-13', note: 'new server row' }],
  );

  assert.deepEqual(merged.entries, [
    entry('local edit'),
    { date: '2026-10-11', note: 'local delete pending' },
    { date: '2026-10-12', note: 'server value' },
    { date: '2026-10-13', note: 'new server row' },
  ]);
});
