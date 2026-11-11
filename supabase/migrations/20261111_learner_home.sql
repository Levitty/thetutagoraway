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
--   school_home_attempts   wrong link codes, per network address (a hash, never
--                          the address), so codes cannot be guessed: ten wrong
--                          an hour and nothing is checked for an hour, as
--                          link_school_learner does for parents
--   an index on the sittings by learner reference, so one learner's homework
--   is found without reading the others'
--
-- Idempotent: safe to run twice. Needs 20261110_school_homework.sql first.
-- ============================================================================

create table if not exists public.school_home_attempts (
  id      bigserial primary key,
  ip_key  text not null check (ip_key ~ '^[a-z0-9]{1,64}$'),
  ok      boolean not null,
  at      timestamptz not null default now()
);
create index if not exists idx_school_home_attempts on public.school_home_attempts(ip_key, at);
alter table public.school_home_attempts enable row level security;   -- no policies: service role only
revoke all on public.school_home_attempts from anon, authenticated;

create index if not exists idx_school_homework_sittings_learner on public.school_homework_sittings(learner_ref);

comment on table public.school_home_attempts is 'Wrong learner-home link codes per hashed network address, for the limit of ten an hour. Service role only.';
