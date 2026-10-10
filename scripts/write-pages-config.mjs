import { writeFile } from 'node:fs/promises';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const publishableKey = (process.env.SUPABASE_PUBLISHABLE_KEY || '').trim();
const outputPath = process.env.GN_CONFIG_OUTPUT || 'web/config.js';

if (!supabaseUrl || !publishableKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in GitHub Actions variables.');
}

let parsedUrl;
try {
  parsedUrl = new URL(supabaseUrl);
} catch {
  throw new Error('SUPABASE_URL must be a valid HTTPS project URL.');
}

if (
  parsedUrl.protocol !== 'https:' ||
  parsedUrl.username ||
  parsedUrl.password ||
  parsedUrl.pathname !== '/' ||
  parsedUrl.search ||
  parsedUrl.hash
) {
  throw new Error('SUPABASE_URL must be an HTTPS project origin without credentials, path, query, or fragment.');
}

if (!publishableKey.startsWith('sb_publishable_')) {
  throw new Error('SUPABASE_PUBLISHABLE_KEY must be a browser-safe sb_publishable_ key, not a secret key.');
}

const config = {
  mode: 'cloud',
  supabaseUrl: parsedUrl.origin,
  supabaseAnonKey: publishableKey,
  schemaV2: true,
  privacyContact: ''
};

await writeFile(outputPath, `window.GN_CONFIG = ${JSON.stringify(config, null, 2)};\n`, 'utf8');
