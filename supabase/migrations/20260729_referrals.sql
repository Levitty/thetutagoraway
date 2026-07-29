-- ============================================================================
-- REFERRAL ENGINE (Holiday Blitz) — tracked referral codes with an
-- activation gate: a referral only counts when the referred student finishes
-- the diagnostic. Ambassadors are just users with codes and hustle.
-- ============================================================================

-- Every profile gets a short, stable referral code derived from its id.
alter table public.profiles
  add column if not exists referral_code text
  generated always as (substr(replace(id::text, '-', ''), 1, 8)) stored;

create unique index if not exists profiles_referral_code_idx
  on public.profiles (referral_code);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null references public.profiles(id) on delete cascade,
  code text not null,
  activated boolean not null default false,      -- true once diagnostic is completed
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  unique (referred_id)                           -- one referrer per student, ever
);

create index if not exists referrals_referrer_idx on public.referrals (referrer_id);

alter table public.referrals enable row level security;

-- Both sides can see their own referral rows (the referrer sees their count).
create policy referrals_select on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_id);

-- The referred student may flip their own row to activated (post-diagnostic
-- ping from the client). Nothing else is updatable.
create policy referrals_activate on public.referrals for update
  using (auth.uid() = referred_id)
  with check (auth.uid() = referred_id);

-- Rows are created ONLY by the signup trigger below (security definer);
-- no client insert policy on purpose — you cannot forge a referral.

-- Capture: signUp() passes options.data.referred_by_code; when the profile row
-- appears, resolve the code to a referrer and record the edge.
create or replace function public.capture_referral()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ref_code text;
  ref_id uuid;
begin
  select raw_user_meta_data->>'referred_by_code' into ref_code
  from auth.users where id = new.id;

  if ref_code is not null and length(trim(ref_code)) >= 6 then
    select id into ref_id
    from public.profiles
    where referral_code = lower(trim(ref_code)) and id <> new.id
    limit 1;

    if ref_id is not null then
      insert into public.referrals (referrer_id, referred_id, code)
      values (ref_id, new.id, lower(trim(ref_code)))
      on conflict (referred_id) do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_capture_referral on public.profiles;
create trigger trg_capture_referral
  after insert on public.profiles
  for each row execute function public.capture_referral();
