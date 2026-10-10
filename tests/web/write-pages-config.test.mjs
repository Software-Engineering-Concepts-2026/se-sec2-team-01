import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const writerPath = fileURLToPath(new URL('../../scripts/write-pages-config.mjs', import.meta.url));

function runWriter(outputPath, overrides = {}) {
  return spawnSync(process.execPath, [writerPath], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GN_CONFIG_OUTPUT: outputPath,
      SUPABASE_URL: '',
      SUPABASE_PUBLISHABLE_KEY: '',
      ...overrides
    }
  });
}

test('generates cloud config from a public Supabase key', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'good-night-pages-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const outputPath = join(directory, 'config.js');

  const result = runWriter(outputPath, {
    SUPABASE_URL: 'https://example.supabase.co/',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test-key'
  });

  assert.equal(result.status, 0, result.stderr);
  const window = {};
  vm.runInNewContext(readFileSync(outputPath, 'utf8'), { window });
  assert.equal(window.GN_CONFIG.mode, 'cloud');
  assert.equal(window.GN_CONFIG.supabaseUrl, 'https://example.supabase.co');
  assert.equal(window.GN_CONFIG.supabaseAnonKey, 'sb_publishable_test-key');
  assert.equal(window.GN_CONFIG.schemaV2, true);
});

test('rejects missing settings, non-HTTPS URLs, and non-publishable keys', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'good-night-pages-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));

  const invalidInputs = [
    {},
    { SUPABASE_URL: 'http://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test-key' },
    { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'sb_secret_test-key' }
  ];

  for (const [index, overrides] of invalidInputs.entries()) {
    const outputPath = join(directory, `config-${index}.js`);
    const result = runWriter(outputPath, overrides);
    assert.notEqual(result.status, 0);
    assert.equal(existsSync(outputPath), false);
  }
});
