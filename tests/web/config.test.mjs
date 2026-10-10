import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let runtime;
try {
  runtime = require('../../web/config-runtime.js');
} catch {
  runtime = null;
}

function resolveConfig(config, location) {
  assert.equal(typeof runtime?.resolve, 'function', 'config runtime must expose resolve(config, location)');
  return runtime.resolve(config, location);
}

test('an unconfigured file URL defaults to local-only mode', () => {
  const result = resolveConfig({}, { protocol: 'file:', hostname: '' });

  assert.equal(result.config.mode, 'local');
  assert.equal(result.config.enabled, false);
  assert.equal(result.error, null);
});

test('a hosted page without cloud credentials fails closed', () => {
  const result = resolveConfig({}, { protocol: 'https:', hostname: 'sleep.example' });

  assert.equal(result.config.mode, 'cloud');
  assert.equal(result.config.enabled, false);
  assert.match(result.error, /config|ตั้งค่า/i);
});

test('a configured cloud origin enables Supabase only with HTTPS', () => {
  const result = resolveConfig({
    mode: 'cloud',
    supabaseUrl: 'https://example-project.supabase.co/',
    supabaseAnonKey: 'public-key',
    schemaV2: true,
  }, { protocol: 'https:', hostname: 'sleep.example' });

  assert.equal(result.config.enabled, true);
  assert.equal(result.config.supabaseUrl, 'https://example-project.supabase.co');
  assert.equal(result.config.schemaV2, true);
  assert.equal(result.error, null);
});

test('a hosted cloud config rejects HTTPS origins that are not Supabase project hosts', () => {
  const result = resolveConfig({
    mode: 'cloud', supabaseUrl: 'https://attacker.example', supabaseAnonKey: 'public-key',
  }, { protocol: 'https:', hostname: 'sleep.example' });

  assert.equal(result.config.enabled, false);
  assert.match(result.error, /Supabase project host/i);
});

test('local-only mode cannot be forced on a hosted origin', () => {
  const result = resolveConfig({ mode: 'local' }, { protocol: 'https:', hostname: 'sleep.example' });

  assert.equal(result.config.mode, 'cloud');
  assert.match(result.error, /local|cloud|Supabase/i);
});

test('local Supabase may use HTTP only when both endpoints are loopback', () => {
  const local = resolveConfig({
    mode: 'cloud', supabaseUrl: 'http://127.0.0.1:54321', supabaseAnonKey: 'public-key',
  }, { protocol: 'http:', hostname: 'localhost' });
  const hosted = resolveConfig({
    mode: 'cloud', supabaseUrl: 'http://127.0.0.1:54321', supabaseAnonKey: 'public-key',
  }, { protocol: 'https:', hostname: 'sleep.example' });

  assert.equal(local.config.enabled, true);
  assert.equal(local.error, null);
  assert.equal(hosted.config.enabled, false);
  assert.match(hosted.error, /HTTPS/i);
});

test('a hosted app rejects an HTTPS loopback Supabase endpoint', () => {
  const result = resolveConfig({
    mode: 'cloud', supabaseUrl: 'https://localhost', supabaseAnonKey: 'public-key',
  }, { protocol: 'https:', hostname: 'sleep.example' });

  assert.equal(result.config.enabled, false);
  assert.match(result.error, /loopback|local/i);
});

test('a hosted app served over plain HTTP is rejected even when Supabase uses HTTPS', () => {
  const result = resolveConfig({
    mode: 'cloud', supabaseUrl: 'https://example-project.supabase.co', supabaseAnonKey: 'public-key',
  }, { protocol: 'http:', hostname: 'sleep.example' });

  assert.equal(result.config.enabled, false);
  assert.match(result.error, /HTTPS/i);
});
