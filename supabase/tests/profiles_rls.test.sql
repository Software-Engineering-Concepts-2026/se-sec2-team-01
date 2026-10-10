-- Run with `supabase test db` against a local Supabase test database.
begin;
select plan(14);

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111103', 'good-night-profile-owner@example.test'),
  ('22222222-2222-4222-8222-222222222204', 'good-night-profile-other@example.test');

set local role anon;
select throws_ok($$select * from public.profiles$$, '42501', null, 'anon cannot read profiles');
select throws_ok($$insert into public.profiles (user_id, name) values ('11111111-1111-4111-8111-111111111103', 'other')$$, '42501', null, 'anon cannot insert profiles');
select throws_ok($$update public.profiles set name = 'changed'$$, '42501', null, 'anon cannot update profiles');
select throws_ok($$delete from public.profiles$$, '42501', null, 'anon cannot delete profiles');

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111103';
select results_eq(
  $$insert into public.profiles (user_id, name, goal_min, onboarded, prefs) values ('11111111-1111-4111-8111-111111111103', 'แฟ้ม', 480, true, '{"displayName":"แฟ้ม"}') returning name$$,
  array['แฟ้ม'], 'owner can create their own profile'
);
select is((select count(*) from public.profiles where user_id = '11111111-1111-4111-8111-111111111103'), 1::bigint, 'owner can read their profile');
select results_eq($$update public.profiles set name = 'แฟ้ม updated' where user_id = '11111111-1111-4111-8111-111111111103' returning name$$, array['แฟ้ม updated'], 'owner can update their profile');
select throws_ok($$update public.profiles set user_id = '22222222-2222-4222-8222-222222222204' where user_id = '11111111-1111-4111-8111-111111111103'$$, '42501', null, 'owner cannot reassign a profile to another user');

set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222204';
select throws_ok($$insert into public.profiles (user_id, name) values ('11111111-1111-4111-8111-111111111103', 'stolen')$$, '42501', null, 'another user cannot create a profile for the owner');
select is_empty($$select * from public.profiles where user_id = '11111111-1111-4111-8111-111111111103'$$, 'another user cannot read the profile');
select is_empty($$update public.profiles set name = 'stolen' where user_id = '11111111-1111-4111-8111-111111111103' returning name$$, 'another user cannot update the profile');
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111103';
select is((select name from public.profiles where user_id = '11111111-1111-4111-8111-111111111103'), 'แฟ้ม updated', 'denied update leaves the owner profile intact');
set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222204';
select is_empty($$delete from public.profiles where user_id = '11111111-1111-4111-8111-111111111103' returning name$$, 'another user cannot delete the profile');
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111103';
select results_eq($$delete from public.profiles where user_id = '11111111-1111-4111-8111-111111111103' returning name$$, array['แฟ้ม updated'], 'owner can delete their profile');

select * from finish();
rollback;
