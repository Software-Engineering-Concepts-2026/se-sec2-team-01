import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import test from 'node:test';

const htmlPath = new URL('../../web/index.html', import.meta.url);
const html = readFileSync(htmlPath, 'utf8');

test('any inline JavaScript in the shipped HTML parses', () => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  const inline = scripts.filter((match) => !/\bsrc\s*=/.test(match[1]) && match[2].trim());
  for (const [index, script] of inline.entries()) {
    assert.doesNotThrow(() => new Script(script[2], { filename: `web/index.html inline script ${index + 1}` }));
  }
});

test('modular app entry point and local module and stylesheet assets resolve', () => {
  const moduleScripts = [...html.matchAll(/<script\b([^>]*)>/gi)]
    .filter(([, attributes]) => /\btype=["']module["']/i.test(attributes))
    .map(([, attributes]) => attributes.match(/\bsrc=["']([^"'#?]+)["']/i)?.[1])
    .filter(Boolean);
  const stylesheets = [...html.matchAll(/<link\b([^>]*)>/gi)]
    .filter(([, attributes]) => /\brel=["']stylesheet["']/i.test(attributes))
    .map(([, attributes]) => attributes.match(/\bhref=["']([^"'#?]+)["']/i)?.[1])
    .filter(Boolean);

  assert.ok(moduleScripts.includes('./app/main.mjs'), 'the modular app entry point should be loaded');
  assert.ok(stylesheets.includes('./styles.css'), 'the application stylesheet should be loaded');
  for (const path of [...moduleScripts, ...stylesheets]) {
    assert.equal(existsSync(new URL(`../../web/${path.replace(/^\.\//, '')}`, import.meta.url)), true, `${path} should exist`);
  }
});

test('local script, manifest, service worker and icon references resolve under web/', () => {
  const paths = [];
  for (const match of html.matchAll(/\b(?:src|href)="(\.\/[^"#?]+)"/g)) {
    paths.push(match[1]);
  }
  for (const path of new Set([...paths.filter((item) => item !== './config.js'), './service-worker.js'])) {
    assert.equal(existsSync(new URL(`../../web/${path.slice(2)}`, import.meta.url)), true, `${path} should exist`);
  }
});
