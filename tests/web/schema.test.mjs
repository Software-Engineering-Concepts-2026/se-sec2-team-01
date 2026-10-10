import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const schema = readFileSync(new URL('../../supabase/schema.sql', import.meta.url), 'utf8');

for (const [table, columns] of Object.entries({
  entries: ['date', 'bed', 'wake', 'lat', 'awk', 'in_bed', 'asleep', 'eff', 'rating', 'mood', 'factors', 'note', 'bed_at', 'wake_at', 'tz', 'bed_tz'],
  profiles: ['name', 'goal_min', 'onboarded', 'prefs'],
})) {
  test(`${table} schema matches the fields used by GNCloud and applies owner-only CRUD`, () => {
    const createTable = schema.match(new RegExp(`create table if not exists public\\.${table}\\s*\\(([\\s\\S]*?)\\n\\);`, 'i'))?.[1];
    assert.ok(createTable, `public.${table} must be declared`);
    for (const column of columns) {
      assert.match(createTable, new RegExp(`\\b${column}\\b`, 'i'), `public.${table}.${column} must exist`);
    }
    assert.match(createTable, /user_id\s+uuid\s+not null\s+references\s+auth\.users\s*\(id\)\s+on delete cascade/i);
    assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
    assert.match(schema, new RegExp(`revoke all on table public\\.${table} from public, anon, authenticated`, 'i'));
    assert.match(schema, new RegExp(`grant select, insert, update, delete on table public\\.${table} to authenticated`, 'i'));

    const policies = [...schema.matchAll(new RegExp(`create policy\\s+(?:\\\"[^\\\"]+\\\"|[\\w]+)\\s+on public\\.${table} for (select|insert|update|delete)\\s+to authenticated\\s+([\\s\\S]*?);`, 'gi'))];
    assert.deepEqual(policies.map((match) => match[1].toLowerCase()).sort(), ['delete', 'insert', 'select', 'update']);
    assert.match(policies.find((match) => match[1].toLowerCase() === 'insert')[2], /with check\s*\(\s*\(select auth\.uid\(\)\)\s*=\s*user_id\s*\)/i);
    assert.match(policies.find((match) => match[1].toLowerCase() === 'update')[2], /using\s*\(\s*\(select auth\.uid\(\)\)\s*=\s*user_id\s*\)[\s\S]*with check\s*\(\s*\(select auth\.uid\(\)\)\s*=\s*user_id\s*\)/i);
  });
}

test('sleep entries are unique by owner and sleep date for PostgREST upserts', () => {
  assert.match(schema, /primary key\s*\(\s*user_id\s*,\s*date\s*\)/i);
});

test('the local Supabase migration matches the documented schema file', () => {
  const migration = readFileSync(new URL('../../supabase/migrations/20261010000000_good_night_schema.sql', import.meta.url), 'utf8');
  const executableSql = (source) => source.split(/\r?\n/).filter((line) => !line.trim().startsWith('--')).join('\n').trim();
  assert.equal(executableSql(migration), executableSql(schema));
});

test('pgTAP RLS suites cover both tables and cross-user isolation', () => {
  for (const table of ['entries', 'profiles']) {
    const sql = readFileSync(new URL(`../../supabase/tests/${table}_rls.test.sql`, import.meta.url), 'utf8');
    const planned = Number(sql.match(/select plan\((\d+)\)/i)?.[1]);
    const assertions = [...sql.matchAll(/^select\s+(?:throws_ok|results_eq|is_empty|is)\s*\(/gim)].length;
    assert.equal(planned, assertions, `${table} pgTAP plan must match its assertion count`);
    assert.match(sql, /set local role authenticated/i);
    assert.match(sql, /request\.jwt\.claim\.sub/i);
    assert.match(sql, /another user/i);
    assert.match(sql, /rollback/i);
  }
});
