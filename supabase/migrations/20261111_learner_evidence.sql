-- ============================================================================
-- THE LEARNER EVIDENCE LOG (11 Nov 2026), step 1 of the Learner Intelligence Model
-- (docs/learner-model.md, section 1).
--
-- response_events is already the append-only record of every answered problem
-- for HOREB practice. It becomes the one evidence log for a child across HOREB
-- practice, school homework, school exams and the live tutor, so it is extended
-- here and no second log is built.
--
--   source          practice (what exists), school_homework, school_exam, tutor, visual
--   door_id, learner_ref   a school learner with no HOREB account (a school door and its reference)
--   cskill, outcome_code, substrand_code, framework   curriculum codes, never names
--   difficulty      easy, medium or hard, or null
--   marks, max_marks   marked work (practice and homework are 1 of 1)
--   independent     true when done without help, null when unknown
--   misconception   the library code the wrong answer reveals
--   item_ref        where the row came from, for de-duplication and review
--
-- student_id becomes optional: a row has a HOREB student, or a school learner (door_id and learner_ref).
-- Rights are unchanged: learners insert and read only their own practice rows through the existing policies.
-- School and tutor rows are written by server functions with the service role.
--
-- The backfill turns the school homework answers already given into rows.
-- Idempotent: safe to run twice. Needs 20261110_school_homework.sql first.
-- ============================================================================

alter table public.response_events add column if not exists source text not null default 'practice';
alter table public.response_events add column if not exists door_id uuid references public.school_doors(id);
alter table public.response_events add column if not exists learner_ref text;
alter table public.response_events add column if not exists cskill text;
alter table public.response_events add column if not exists outcome_code text;
alter table public.response_events add column if not exists substrand_code text;
alter table public.response_events add column if not exists framework text not null default 'cbc';
alter table public.response_events add column if not exists difficulty text;
alter table public.response_events add column if not exists marks numeric;
alter table public.response_events add column if not exists max_marks numeric;
alter table public.response_events add column if not exists independent boolean;
alter table public.response_events add column if not exists misconception text;
alter table public.response_events add column if not exists item_ref text;

alter table public.response_events drop constraint if exists response_events_source_check;
alter table public.response_events add constraint response_events_source_check
  check (source in ('practice', 'school_homework', 'school_exam', 'tutor', 'visual'));

alter table public.response_events drop constraint if exists response_events_difficulty_check;
alter table public.response_events add constraint response_events_difficulty_check
  check (difficulty is null or difficulty in ('easy', 'medium', 'hard'));

-- A row belongs to a HOREB student, or to a school learner.
alter table public.response_events alter column student_id drop not null;
alter table public.response_events drop constraint if exists response_events_learner_check;
alter table public.response_events add constraint response_events_learner_check
  check (student_id is not null or (door_id is not null and learner_ref is not null));

-- Every observation is in the log once: the same item for the same learner cannot be written twice.
create unique index if not exists response_events_evidence_once
  on public.response_events (source, item_ref, coalesce(student_id::text, door_id::text || ':' || learner_ref))
  where item_ref is not null;

-- Reading the evidence of one school learner, newest first. A HOREB student is already read through idx_response_events_learner.
create index if not exists idx_response_events_school_learner
  on public.response_events (door_id, learner_ref, created_at desc)
  where door_id is not null;

-- The school homework answers already given, one row each.
insert into public.response_events
  (source, door_id, learner_ref, subject, skill_id, cskill, correct, misconception, independent,
   marks, max_marks, item_ref, submitted_value, client_ts, hints_used, attempt_no)
select
  'school_homework', h.door_id, s.learner_ref, 'math', i.item ->> 'cskill', i.item ->> 'cskill',
  coalesce((a.ans ->> 'correct')::boolean, false), nullif(a.ans ->> 'mis', ''), true,
  case when coalesce((a.ans ->> 'correct')::boolean, false) then 1 else 0 end, 1, 'hw:' || s.homework_id::text || ':' || (a.ans ->> 'n'), nullif(a.ans ->> 'chosen', ''),
  (a.ans ->> 'at')::timestamptz, 0, 1
from public.school_homework_sittings s
join public.school_homework h on h.id = s.homework_id
cross join lateral jsonb_array_elements(s.answers) as a(ans)
cross join lateral (select s.items -> ((a.ans ->> 'n')::int - 1) as item) as i
where jsonb_typeof(s.answers) = 'array'
  and jsonb_typeof(s.items) = 'array'
  and (a.ans ->> 'n') ~ '^[0-9]+$'
  and i.item ->> 'cskill' is not null
on conflict do nothing;
