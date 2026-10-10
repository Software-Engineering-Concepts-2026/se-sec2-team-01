import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const html = readFileSync(new URL('../../web/index.html', import.meta.url), 'utf8');
const marker = '/* Good Night – core logic (no DOM). Works in browser (window.GN) and node. */';
const markerAt = html.indexOf(marker);
assert.notEqual(markerAt, -1, 'the original domain-logic script must remain embedded');
const scriptStart = html.lastIndexOf('<script>', markerAt);
const scriptEnd = html.indexOf('</script>', markerAt);
const coreSource = html.slice(scriptStart + '<script>'.length, scriptEnd);
const window = {};
const module = { exports: {} };
runInNewContext(coreSource, { window, module, Math, Date, Number, String, Array, Object, JSON });
const core = window.GN;

test('sleep calculation remains correct across midnight', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(core.calc('23:00', '07:00', 20, 15))), {
    ok: true, inBed: 480, asleep: 445, eff: 93, lost: 35,
  });
});

test('invalid sleep spans and equal bed/wake times remain rejected', () => {
  assert.equal(core.calc('23:00', '23:00', 0, 0).ok, false);
  assert.equal(core.calc('23:00', '07:00', 10, 470).ok, false);
  assert.equal(core.calc('23:00', '07:00', 10, 0, 1440).ok, false);
});

test('manual entry preserves the model fields used by cloud sync', () => {
  const result = core.makeEntry(
    '2026-10-10', '23:00', '07:00', 20, 15, 4, ['phone'], 'late coffee', undefined,
    { mood: 'calm', bedAt: '2026-10-09T23:00:00Z', wakeAt: '2026-10-10T07:00:00Z', tz: 'Asia/Bangkok', bedTz: 'Asia/Bangkok' },
  );

  assert.deepEqual(JSON.parse(JSON.stringify(result)), {
    date: '2026-10-10', bed: '23:00', wake: '07:00', lat: 20, awk: 15,
    inBed: 480, asleep: 445, eff: 93, rating: 4, factors: ['phone'], note: 'late coffee',
    mood: 'calm', bedAt: '2026-10-09T23:00:00Z', wakeAt: '2026-10-10T07:00:00Z',
    tz: 'Asia/Bangkok', bedTz: 'Asia/Bangkok',
  });
});
