-- ============================================================================
-- SIGN IN TO HOREB FROM WHATSAPP (4 Nov 2026)
--
-- A parent or tutor messages the Tutagora WhatsApp line "HOREB login" and gets
-- a link that opens their own parent home, once, for ten minutes. The edge
-- function wa-sign-in makes and takes the links; nobody else touches these
-- tables (RLS on, no policies, no grants to anon or authenticated).
--
--   wa_sign_in_links  one row per link: only the SHA-256 of the token, the
--                     account, a keyed hash of the phone (for 3 an hour) and its
--                     last 3 digits, and the door call that made it (a replayed
--                     call makes nothing).
--   wa_sign_in_log    every issue, refusal and use (the audit log for this).
--
-- Run once in the SQL editor. Safe to run again.
-- ============================================================================

create table if not exists public.wa_sign_in_links (
  id          uuid primary key default gen_random_uuid(),
  token_hash  text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  profile_id  uuid not null references auth.users(id) on delete cascade,
  phone_hash  text not null,
  phone_tail  text check (phone_tail is null or phone_tail ~ '^[0-9]{3}$'),
  request_sig text not null unique,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null check (expires_at <= created_at + interval '10 minutes'),
  used_at     timestamptz
);
create index if not exists wa_sign_in_links_phone on public.wa_sign_in_links (phone_hash, created_at desc);
create index if not exists wa_sign_in_links_day on public.wa_sign_in_links (created_at desc);
alter table public.wa_sign_in_links enable row level security;
revoke all on public.wa_sign_in_links from public, anon, authenticated;
grant all on public.wa_sign_in_links to service_role;

-- A used link stays used; a link cannot move to another account or be lengthened.
create or replace function public.wa_sign_in_links_guard() returns trigger
language plpgsql set search_path = public as $$
begin
  if old.used_at is not null and new.used_at is distinct from old.used_at then
    raise exception 'a used sign-in link cannot be reused';
  end if;
  if new.token_hash <> old.token_hash or new.profile_id <> old.profile_id or new.expires_at > old.expires_at then
    raise exception 'a sign-in link cannot be moved to another account or lengthened';
  end if;
  return new;
end $$;
drop trigger if exists wa_sign_in_links_guard on public.wa_sign_in_links;
create trigger wa_sign_in_links_guard before update on public.wa_sign_in_links
  for each row execute function public.wa_sign_in_links_guard();

create table if not exists public.wa_sign_in_log (
  id         bigint generated always as identity primary key,
  at         timestamptz not null default now(),
  action     text not null check (action in ('issued', 'refused', 'used')),
  ok         boolean not null,
  why        text,
  phone_tail text,
  profile_id uuid
);
create index if not exists wa_sign_in_log_at on public.wa_sign_in_log (at desc);
alter table public.wa_sign_in_log enable row level security;
revoke all on public.wa_sign_in_log from public, anon, authenticated;
grant all on public.wa_sign_in_log to service_role;

-- Append-only, like every log worth keeping.
create or replace function public.wa_sign_in_log_append_only() returns trigger
language plpgsql as $$ begin raise exception 'wa_sign_in_log is append-only'; end $$;
drop trigger if exists wa_sign_in_log_append_only on public.wa_sign_in_log;
create trigger wa_sign_in_log_append_only before update or delete on public.wa_sign_in_log
  for each row execute function public.wa_sign_in_log_append_only();

-- Check: both must return a count (0 the first time).
--   select count(*) from public.wa_sign_in_links;
--   select count(*) from public.wa_sign_in_log;
