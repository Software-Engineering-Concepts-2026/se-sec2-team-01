-- Run with `supabase test db` against a local Supabase test database.
begin;
select plan(14);

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111101', 'good-night-owner@example.test'),
  ('22222222-2222-4222-8222-222222222202', 'good-night-other@example.test');

set local role anon;
select throws_ok($$select * from public.entries$$, '42501', null, 'anon cannot read entries');
select throws_ok($$insert into public.entries (user_id, date, bed, wake, lat, awk, in_bed, asleep, eff) values ('11111111-1111-4111-8111-111111111101', '2099-01-01', '23:00', '07:00', 10, 0, 480, 470, 98)$$, '42501', null, 'anon cannot insert entries');
select throws_ok($$update public.entries set note = 'changed'$$, '42501', null, 'anon cannot update entries');
select throws_ok($$delete from public.entries$$, '42501', null, 'anon cannot delete entries');

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111101';
select results_eq(
  $$insert into public.entries (user_id, date, bed, wake, lat, awk, in_bed, asleep, eff, rating, factors, note) values ('11111111-1111-4111-8111-111111111101', '2099-01-01', '23:00', '07:00', 10, 0, 480, 470, 98, 4, '["phone"]', 'owner entry') returning note$$,
  array['owner entry'], 'owner can create their own entry'
);
select is((select count(*) from public.entries where user_id = '11111111-1111-4111-8111-111111111101'), 1::bigint, 'owner can read their entry');
select results_eq($$update public.entries set note = 'updated by owner' where date = '2099-01-01' returning note$$, array['updated by owner'], 'owner can update their entry');
select throws_ok($$update public.entries set user_id = '22222222-2222-4222-8222-222222222202' where date = '2099-01-01'$$, '42501', null, 'owner cannot reassign an entry to another user');

set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222202';
select throws_ok($$insert into public.entries (user_id, date, bed, wake, lat, awk, in_bed, asleep, eff) values ('11111111-1111-4111-8111-111111111101', '2099-01-02', '23:00', '07:00', 10, 0, 480, 470, 98)$$, '42501', null, 'another user cannot create an entry for the owner');
select is_empty($$select * from public.entries where date = '2099-01-01'$$, 'another user cannot read the entry');
select is_empty($$update public.entries set note = 'stolen' where date = '2099-01-01' returning note$$, 'another user cannot update the entry');
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111101';
select is((select note from public.entries where date = '2099-01-01'), 'updated by owner', 'denied update leaves the owner entry intact');
set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222202';
select is_empty($$delete from public.entries where date = '2099-01-01' returning note$$, 'another user cannot delete the entry');
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111101';
select results_eq($$delete from public.entries where date = '2099-01-01' returning note$$, array['updated by owner'], 'owner can delete their entry');

select * from finish();
rollback;
