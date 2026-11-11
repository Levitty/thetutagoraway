-- ============================================================================
-- THE LEARNER HOME: all of one school learner's homework on one page
-- (11 Nov 2026). The owner: "build the learner home for school learners".
--
-- The page tutagora.com/hw/?l=WSL-K7QM2XPA-H3RT opens with the link code Tuta
-- already prints and sends (no new secret); the family app shows the same home
-- for a child the parent linked. Both go through the school-homework edge
-- function (action learner_home), service role only. Nothing new is readable
-- by the app.
--
--   school_home_attempts   wrong link codes, counted two ways, each under a hash
--                          (never the address, never the reference):
--                            per door and learner reference: ten wrong checks an
--                            hour, then that learner's code waits an hour; this is
--                            what stops anyone guessing one learner's check
--                            per network address: 200 an hour, a loose ceiling on
--                            wide scanning (many phones share one address on
--                            Safaricom, so a tight limit would lock out an area)
--   an index on the sittings by learner reference, so one learner's homework
--   is found without reading the others'
--
-- Idempotent: safe to run twice. Needs 20261110_school_homework.sql first.
-- ============================================================================

create table if not exists public.school_home_attempts (
  id      bigserial primary key,
  try_key text not null check (try_key ~ '^[ir][a-z0-9]{1,64}$'),   -- i<address hash> or r<door+reference hash>
  ok      boolean not null,
  at      timestamptz not null default now()
);
create index if not exists idx_school_home_attempts on public.school_home_attempts(try_key, at);
alter table public.school_home_attempts enable row level security;   -- no policies: service role only
revoke all on public.school_home_attempts from anon, authenticated;

create index if not exists idx_school_homework_sittings_learner on public.school_homework_sittings(learner_ref);

comment on table public.school_home_attempts is 'Wrong learner-home link codes, per hashed door+reference (ten an hour) and per hashed network address (200 an hour). Service role only.';
