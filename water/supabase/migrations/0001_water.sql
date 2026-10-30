-- ============================================================================
-- WATER METER BILLING — schema and rules.
--
-- THE RULE THAT SHAPES ALL OF THIS: tenants have no accounts. They open a
-- page, type a meter number and pay. So every tenant-facing read happens in
-- the edge function with the service role, and the anon key can read NOTHING
-- here. Not a single table, not a single column.
--
-- That is not caution for its own sake. The sibling tutoring project shipped a
-- `profiles` table the anon key could read, and for weeks anyone holding the
-- key that ships inside the website's own JavaScript could fetch 147 names,
-- email addresses and phone numbers. This schema is built so that mistake has
-- nowhere to happen: there is no permissive policy to get wrong, because anon
-- is granted nothing at all.
--
-- Admins are told apart by the email on their sign-in, checked by a function —
-- never by a column on a row they can edit. The same project had a profiles
-- row with an `is_admin` boolean that any signed-in user could set on
-- themselves, which opened every lesson chat in the system.
--
-- Idempotent: safe to run more than once.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Who may administer. Email from the verified JWT, matched against a list that
-- lives in the database and that users cannot write to.
-- ---------------------------------------------------------------------------
create table if not exists public.water_admins (
  email text primary key,
  added_at timestamptz not null default now()
);

-- Seed yourself. Change this address before running if it is not yours.
insert into public.water_admins (email)
values ('mutualevy@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_water_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.water_admins a
    where a.email = lower(coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- Meters. One row per physical meter; the tenant of record lives here.
-- `meter_no` is the NORMALISED form (see src/meters.js) — uppercase, no
-- separators, no leading zeros — so "00412", "412" and " 412 " are one meter
-- and cannot become three records that split one tenant's payments.
-- ---------------------------------------------------------------------------
create table if not exists public.meters (
  id          uuid primary key default gen_random_uuid(),
  meter_no    text not null unique,
  house       text not null,
  tenant_name text,
  phone       text,
  active      boolean not null default true,
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists meters_active_idx on public.meters (active) where active;

-- ---------------------------------------------------------------------------
-- Bills. One per meter per period. The amount is in WHOLE SHILLINGS; Paystack
-- talks in cents and the conversion happens in one place (see payment.js), not
-- scattered through the code where a factor of 100 goes missing.
-- ---------------------------------------------------------------------------
create table if not exists public.bills (
  id          uuid primary key default gen_random_uuid(),
  meter_id    uuid not null references public.meters(id) on delete cascade,
  period      text not null,                       -- '2026-10'
  amount_kes  integer not null check (amount_kes > 0),
  reading     numeric,                             -- optional, for the tenant's record
  prev_reading numeric,
  paid_at     timestamptz,
  created_at  timestamptz not null default now(),
  unique (meter_id, period)
);
-- The open bill for a meter is the oldest unpaid one. Indexed because every
-- single tenant lookup runs this query.
create index if not exists bills_open_idx on public.bills (meter_id, period) where paid_at is null;

-- ---------------------------------------------------------------------------
-- Payments. The REFERENCE IS THE PRIMARY KEY, which is the replay guard: one
-- Paystack reference can only ever produce one payment row, so asking the
-- verify endpoint twice (which the client does, on purpose, because M-Pesa
-- settles late) cannot credit a bill twice.
--
-- The row is written BEFORE Paystack opens, with the meter and the expected
-- amount already decided server-side. Verification then compares what Paystack
-- reports against THIS row — never against anything the browser sends. That is
-- what stops a stranger posting someone else's reference with their own meter.
-- ---------------------------------------------------------------------------
create table if not exists public.water_payments (
  reference    text primary key,
  meter_id     uuid not null references public.meters(id),
  bill_id      uuid references public.bills(id),
  amount_kes   integer not null check (amount_kes > 0),   -- expected, at start
  paid_kes     integer,                                   -- actual, from Paystack
  overpaid_kes integer not null default 0,
  status       text not null default 'pending'
               check (status in ('pending','paid','failed','abandoned')),
  channel      text,
  paid_at      timestamptz,
  paystack     jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists water_payments_meter_idx on public.water_payments (meter_id, created_at desc);
create index if not exists water_payments_status_idx on public.water_payments (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Lookup throttle. Anyone can type any number, so the lookup endpoint is an
-- enumeration oracle: walk 1..9999 and you have the estate's tenant list. The
-- name is masked to initials in the function, and this caps how fast a
-- stranger can walk the range at all.
-- ---------------------------------------------------------------------------
create table if not exists public.lookup_hits (
  ip       text not null,
  minute   timestamptz not null,
  hits     integer not null default 1,
  primary key (ip, minute)
);
create index if not exists lookup_hits_minute_idx on public.lookup_hits (minute);

-- Count this lookup and say how many that IP has made this minute. One
-- statement, so two simultaneous lookups cannot both read "1" and let a
-- scraper through at twice the rate. Old rows are swept as we go: this table
-- is a rate limiter, not a log, and keeping it is keeping visitors' IPs.
create or replace function public.bump_lookup(p_ip text, p_minute timestamptz)
returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  insert into public.lookup_hits as l (ip, minute, hits)
  values (p_ip, p_minute, 1)
  on conflict (ip, minute) do update set hits = l.hits + 1
  returning l.hits into n;
  delete from public.lookup_hits where minute < now() - interval '1 hour';
  return n;
end $$;

-- ---------------------------------------------------------------------------
-- RLS. Everything on, and anon is granted nothing.
--
-- There is deliberately NO policy for anon on any table. The tenant flow does
-- not need one: it goes through the edge function, which uses the service role
-- and bypasses RLS. A policy here would be a hole with no purpose.
-- ---------------------------------------------------------------------------
alter table public.meters         enable row level security;
alter table public.bills          enable row level security;
alter table public.water_payments enable row level security;
alter table public.lookup_hits    enable row level security;
alter table public.water_admins   enable row level security;

revoke all on public.meters, public.bills, public.water_payments,
               public.lookup_hits, public.water_admins from anon;

do $$
declare t text;
begin
  foreach t in array array['meters','bills','water_payments','lookup_hits','water_admins'] loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_all', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_water_admin()) with check (public.is_water_admin())',
      t || '_admin_all', t);
  end loop;
end $$;

-- Check: run these as an admin and as a signed-out visitor. The first should
-- return rows for you; from the anon key every one of them must fail.
--   select count(*) from public.meters;
--   select count(*) from public.water_payments;
