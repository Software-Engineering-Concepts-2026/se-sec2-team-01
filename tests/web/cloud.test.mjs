import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const html = readFileSync(new URL('../../web/index.html', import.meta.url), 'utf8');
const marker = '/* Good Night – tiny Supabase client (auth + data) using plain fetch. No external library. */';

function loadCloud(fetchHandler) {
  const markerAt = html.indexOf(marker);
  assert.notEqual(markerAt, -1, 'Supabase client script must be present');
  const scriptStart = html.lastIndexOf('<script>', markerAt);
  const scriptEnd = html.indexOf('</script>', markerAt);
  const code = html.slice(scriptStart + '<script>'.length, scriptEnd);
  const values = new Map([['gn.cloud', JSON.stringify({
    access_token: 'user-session-token',
    refresh_token: 'refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: { id: 'user-123', email: 'sleep@example.test', name: 'แฟ้ม' },
  })]]);
  const localStorage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const window = {
    GN_CONFIG: {
      mode: 'cloud',
      supabaseUrl: 'https://project.supabase.co',
      supabaseAnonKey: 'public-test-key',
      enabled: true,
      schemaV2: true,
    },
  };
  runInNewContext(code, {
    window,
    localStorage,
    fetch: fetchHandler,
    module: { exports: {} },
    Response,
    Date,
    JSON,
    Promise,
    encodeURIComponent,
  });
  return { cloud: window.GNCloud, values };
}

test('cloud account deletion calls the authenticated Edge Function and clears session only after success', async () => {
  const requests = [];
  const { cloud, values } = loadCloud(async (url, options) => {
    requests.push({ url, options });
    return new Response(null, { status: 204 });
  });

  await cloud.deleteAccount();

  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, 'https://project.supabase.co/functions/v1/delete-account');
  assert.equal(requests[0].options.headers.Authorization, 'Bearer user-session-token');
  assert.equal(requests[0].options.headers.apikey, 'public-test-key');
  assert.equal(values.has('gn.cloud'), false);
});

test('a failed account deletion keeps the signed-in session available for retry', async () => {
  const { cloud, values } = loadCloud(async () => new Response('{"error":"delete failed"}', { status: 500 }));

  await assert.rejects(cloud.deleteAccount(), /delete failed/);
  assert.equal(JSON.parse(values.get('gn.cloud')).access_token, 'user-session-token');
});

test('sleep upsert maps the app model to the version-two database columns', async () => {
  let request;
  const { cloud } = loadCloud(async (url, options) => {
    request = { url, options };
    return new Response(null, { status: 201 });
  });

  await cloud.put({
    date: '2026-10-10', bed: '23:00', wake: '07:00', lat: 20, awk: 15,
    inBed: 480, asleep: 445, eff: 93, rating: 4, mood: 'calm',
    factors: ['phone'], note: 'test', bedAt: '2026-10-09T23:00:00Z',
    wakeAt: '2026-10-10T07:00:00Z', tz: 'Asia/Bangkok', bedTz: 'Asia/Bangkok',
  });

  assert.equal(request.url, 'https://project.supabase.co/rest/v1/entries?on_conflict=user_id,date');
  assert.deepEqual(JSON.parse(request.options.body), [{
    user_id: 'user-123', date: '2026-10-10', bed: '23:00', wake: '07:00',
    lat: 20, awk: 15, in_bed: 480, asleep: 445, eff: 93, rating: 4,
    factors: ['phone'], note: 'test', mood: 'calm', bed_at: '2026-10-09T23:00:00Z',
    wake_at: '2026-10-10T07:00:00Z', tz: 'Asia/Bangkok', bed_tz: 'Asia/Bangkok',
  }]);
});
