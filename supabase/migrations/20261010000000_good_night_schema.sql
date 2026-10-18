-- Good Night cloud schema. Keep this migration aligned with ../schema.sql.

create table if not exists public.entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  bed text not null check (bed ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  wake text not null check (wake ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  lat smallint not null check (lat between 0 and 1439),
  awk smallint not null check (awk between 0 and 1439),
  in_bed smallint not null check (in_bed between 1 and 1439),
  asleep smallint not null check (asleep between 1 and 1439),
  eff smallint not null check (eff between 0 and 100),
  rating smallint not null default 0 check (rating between 0 and 5),
  mood text not null default '',
  factors jsonb not null default '[]'::jsonb check (jsonb_typeof(factors) = 'array'),
  note text not null default '',
  bed_at timestamptz,
  wake_at timestamptz,
  tz text,
  bed_tz text,
  constraint entries_sleep_math_check check (
    in_bed = asleep + lat + awk
    and eff = round(asleep::numeric * 100 / in_bed)
  ),
  constraint entries_user_date_pk primary key (user_id, date)
);

create table if not exists public.profiles (
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default '',
  goal_min smallint not null default 480 check (goal_min between 120 and 720),
  onboarded boolean not null default false,
  prefs jsonb not null default '{}'::jsonb check (jsonb_typeof(prefs) = 'object'),
  constraint profiles_user_id_pk primary key (user_id)
);

alter table public.entries enable row level security;
alter table public.profiles enable row level security;

revoke all on table public.entries from public, anon, authenticated;
revoke all on table public.profiles from public, anon, authenticated;
grant select, insert, update, delete on table public.entries to authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;

drop policy if exists entries_select_own on public.entries;
create policy entries_select_own on public.entries for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists entries_insert_own on public.entries;
create policy entries_insert_own on public.entries for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists entries_update_own on public.entries;
create policy entries_update_own on public.entries for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists entries_delete_own on public.entries;
create policy entries_delete_own on public.entries for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own on public.profiles for delete to authenticated
  using ((select auth.uid()) = user_id);
