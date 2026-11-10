-- ============================================================================
-- SCHOOL HOMEWORK: a teacher in Tuta sets homework from the curriculum, HOREB
-- draws each child's questions from the families and marks them (10 Nov 2026).
--
-- The owner: "a teacher sets good homework in seconds, children get fresh
-- questions, marking is automatic, and results land on the skill and the
-- misconception." Grade 5 Mathematics first.
--
--   school_homework           one homework a school's Tuta set through its door
--                             (school-practice function, signed): the curriculum
--                             skills, how many questions, online or paper, and
--                             the families a teacher approved for it (who, when)
--   school_homework_sittings  one per learner reference: the code that is the
--                             child's key (no login for the pilot), the seed the
--                             questions were drawn with, the questions with their
--                             answers and misconception codes, and the answers
--                             given, one at a time, marked at once; locks when
--                             the child leaves the page
--   school_doors.results_url  where the results go: the school's Tuta, signed
--                             with the door's secret, e.g.
--                             https://mgt.whitestarschools.com/api/horeb/homework-results
--
-- Only learner references, codes and curriculum codes cross. Never a name.
-- Service role only: the two edge functions read and write; nothing in the app.
-- Idempotent: safe to run twice. Needs 20261102_school_practice.sql first.
-- ============================================================================

alter table public.school_doors add column if not exists results_url text
  check (results_url is null or results_url ~ '^https://[a-z0-9.-]+/api/horeb/homework-results$');

create table if not exists public.school_homework (
  id            uuid primary key default gen_random_uuid(),
  door_id       uuid not null references public.school_doors(id) on delete cascade,
  homework_ref  uuid not null,
  title         text not null check (length(title) between 1 and 120),
  mode          text not null check (mode in ('online', 'paper')),
  cskills       text[] not null check (cardinality(cskills) between 1 and 12),
  count         int not null check (count between 3 and 30),
  versions      int not null default 0 check (versions = 0 or versions between 2 and 4),
  due_on        date,
  approved      jsonb not null default '[]'::jsonb,   -- [{family_id, by, at}]: unreviewed families a teacher approved for this homework
  created_at    timestamptz not null default now(),
  unique (door_id, homework_ref)
);

create table if not exists public.school_homework_sittings (
  id            uuid primary key default gen_random_uuid(),
  homework_id   uuid not null references public.school_homework(id) on delete cascade,
  learner_ref   text not null check (learner_ref ~ '^[A-Z2-9]{8}$'),
  code          text not null unique check (code ~ '^[A-Z2-9]{10}$'),
  seed          text not null,
  version       int,
  items         jsonb not null,                        -- the questions, with answers and misconception codes (never sent to the phone)
  answers       jsonb not null default '[]'::jsonb,    -- [{n, chosen, correct, mis, at}]
  status        text not null default 'issued' check (status in ('issued', 'started', 'submitted', 'locked')),
  started_at    timestamptz,
  finished_at   timestamptz,
  locked_at     timestamptz,
  lock_reason   text,
  lock_question int,
  reopen_count  int not null default 0,
  pushed_at     timestamptz,
  updated_at    timestamptz not null default now(),
  unique (homework_id, learner_ref)
);

alter table public.school_homework enable row level security;            -- no policies: service role only
alter table public.school_homework_sittings enable row level security;
revoke all on public.school_homework, public.school_homework_sittings from anon, authenticated;
