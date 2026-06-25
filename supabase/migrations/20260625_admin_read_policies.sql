-- ============================================================================
-- ADMIN READ ACCESS
-- The app authorises the admin only client-side (ADMIN_EMAILS in App.jsx), so
-- the database itself has no notion of an admin. With per-user RLS (each user
-- reads only their own row), the admin dashboard's queries on profiles/tutors/
-- bookings/payments come back empty even though signups exist.
--
-- This adds an is_admin() helper (checks the JWT email against the allowlist)
-- and SELECT policies that let the admin read everything. RLS policies are
-- OR-ed, so existing "users read their own row" policies keep working — this
-- only ADDS admin visibility, it does not loosen anything for normal users.
--
-- Keep the email list here in sync with ADMIN_EMAILS in src/App.jsx.
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in (
    'mutualevy@gmail.com'
  );
$$;

-- profiles -------------------------------------------------------------------
drop policy if exists "Admin reads all profiles" on public.profiles;
create policy "Admin reads all profiles" on public.profiles
  for select using ( public.is_admin() );

-- tutors ---------------------------------------------------------------------
drop policy if exists "Admin reads all tutors" on public.tutors;
create policy "Admin reads all tutors" on public.tutors
  for select using ( public.is_admin() );

-- bookings -------------------------------------------------------------------
drop policy if exists "Admin reads all bookings" on public.bookings;
create policy "Admin reads all bookings" on public.bookings
  for select using ( public.is_admin() );

-- payments -------------------------------------------------------------------
drop policy if exists "Admin reads all payments" on public.payments;
create policy "Admin reads all payments" on public.payments
  for select using ( public.is_admin() );
