import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const functionSource = readFileSync(new URL('../../supabase/functions/delete-account/index.ts', import.meta.url), 'utf8');
const supabaseConfig = readFileSync(new URL('../../supabase/config.toml', import.meta.url), 'utf8');

let deleteOwnAccount;
let handleDeleteAccount;
try {
  ({ deleteOwnAccount, handleDeleteAccount } = await import('../../supabase/functions/_shared/delete-account.mjs'));
} catch {
  deleteOwnAccount = null;
  handleDeleteAccount = null;
}

function helper() {
  assert.equal(typeof deleteOwnAccount, 'function', 'delete helper must be implemented');
  return deleteOwnAccount;
}

test('account deletion uses only the authenticated user id and returns success', async () => {
  const calls = [];
  const admin = { auth: { admin: { deleteUser: async (id) => { calls.push(id); return { error: null }; } } } };

  const result = await helper()({ id: '11111111-1111-4111-8111-111111111111' }, admin);

  assert.equal(result.status, 204);
  assert.deepEqual(calls, ['11111111-1111-4111-8111-111111111111']);
});

test('account deletion rejects missing identity without calling the admin API', async () => {
  let called = false;
  const admin = { auth: { admin: { deleteUser: async () => { called = true; return { error: null }; } } } };

  const result = await helper()(null, admin);

  assert.equal(result.status, 401);
  assert.equal(called, false);
});

test('a repeated deletion of an already absent user is idempotent', async () => {
  const admin = { auth: { admin: { deleteUser: async () => ({ error: { status: 404, message: 'internal detail' } }) } } };

  const result = await helper()({ id: '11111111-1111-4111-8111-111111111111' }, admin);

  assert.equal(result.status, 204);
});

test('an admin API failure returns a generic error without exposing provider details', async () => {
  const admin = { auth: { admin: { deleteUser: async () => ({ error: { status: 503, message: 'provider secret detail' } }) } } };

  const result = await helper()({ id: '11111111-1111-4111-8111-111111111111' }, admin);

  assert.deepEqual(result, { status: 502, error: 'account_deletion_failed' });
});

test('the endpoint rejects non-POST requests without attempting account deletion', async () => {
  let called = false;
  const result = await handleDeleteAccount({ method: 'GET' }, {
    userClaims: { sub: '11111111-1111-4111-8111-111111111111' },
    supabaseAdmin: { auth: { admin: { deleteUser: async () => { called = true; } } } },
  });

  assert.equal(result.status, 405);
  assert.equal(called, false);
});

test('the endpoint ignores a caller-supplied user id and deletes only the verified claim', async () => {
  let deletedId;
  const result = await handleDeleteAccount({ method: 'POST', json: async () => ({ user_id: '22222222-2222-4222-8222-222222222222' }) }, {
    userClaims: { sub: '11111111-1111-4111-8111-111111111111' },
    supabaseAdmin: { auth: { admin: { deleteUser: async (id) => { deletedId = id; return { error: null }; } } } },
  });

  assert.equal(result.status, 204);
  assert.equal(deletedId, '11111111-1111-4111-8111-111111111111');
});

test('the deployed Edge Function requires Supabase-verified user authentication', () => {
  assert.match(functionSource, /withSupabase\(\{\s*auth:\s*'user'\s*\}/);
  assert.match(functionSource, /handleDeleteAccount\(request, context\)/);
  assert.match(supabaseConfig, /\[functions\.delete-account\]\s*verify_jwt\s*=\s*true/);
});
