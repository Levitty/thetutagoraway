-- ============================================================================
-- STOP ANONYMOUS CALLERS READING EVERY ADDRESS AND PHONE NUMBER
--
-- `profiles` is readable by the public anon key. Anyone with the key — it is
-- in the JavaScript of the website, so that is anyone — can fetch all 147
-- rows, with `email`, `phone`, `role` and `is_admin` on each. Confirmed again
-- on 26 Oct 2026 with a plain curl and no sign-in.
--
-- This does NOT touch a single RLS policy, on purpose. One of those policies
-- is what makes the public tutor directory work, and dropping the wrong one
-- takes the tutor listings offline. Column grants sit on top of RLS: the
-- policies keep deciding WHICH ROWS anon may see, and this decides WHICH
-- COLUMNS. Narrowing the columns cannot break a row the directory needs.
--
-- What the signed-out site actually reads is one query — the tutor directory,
-- `tutors` joined to `profiles` — and it needs the name and the photo. It was
-- also asking for `email` and never displaying it; that was removed from
-- App.jsx in the same commit as this file, so the grant below is enough.
--
-- `authenticated` is untouched. A signed-in teacher still reads their
-- students' names, a family still sees their tutor's address on a booking,
-- and the admin screens are unchanged.
--
-- THIS IS NOT THE WHOLE FIX. Anon can still LIST the 147 names, because the
-- row policy still allows it; it just cannot see the addresses any more. The
-- second half needs the policy list — see 20261026_profiles_rows.sql, which
-- is deliberately not written yet.
--
-- Safe to run more than once. To undo: GRANT SELECT ON public.profiles TO anon;
-- ============================================================================

REVOKE SELECT ON public.profiles FROM anon;

GRANT SELECT (id, full_name, avatar_url, avatar) ON public.profiles TO anon;

-- Check. The first must return rows (the directory still works); the second
-- must fail with "permission denied for column email".
--   select id, full_name, avatar_url from public.profiles limit 1;
--   select email from public.profiles limit 1;
