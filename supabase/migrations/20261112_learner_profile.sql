-- ============================================================================
-- THE TUTOR THAT KNOWS THE CHILD (12 Nov 2026), step 3 of the Learner
-- Intelligence Model (docs/learner-model.md).
--
--   learner_profile         per learner: interests (at most 8 short words) and what_helps
--                           (a short list of move, helped, at). Context only, never mastery.
--   learner_session_notes   the live tutor notes after a lesson, at most 600 characters.
--                           Conversational memory, DELETED AFTER 90 DAYS: every insert
--                           deletes the notes older than 90 days (a trigger, so it needs no
--                           scheduled job), and the tutor only reads notes from the last 90 days.
--   lesson_reports          the report to the parent after each lesson, shown in the
--                           app under Messages and goals. Parents read and delete their own.
--   lesson_report_settings  the parent may turn the email after each lesson off (default on).
--
-- A learner is a HOREB account child (student_id and learner_id) or a school learner
-- (door_id and learner_ref), the same keys as response_events. learner_key joins them in one text.
-- Profile and notes are written and read by the voice-tutor function with the service role only:
-- no policy, no grant to the app. Idempotent: safe to run twice.
-- Needs 20261110_school_homework.sql and 20261111_learner_evidence.sql first.
-- ============================================================================

create table if not exists public.learner_profile (
  learner_key  text primary key,
  student_id   uuid references auth.users(id) on delete cascade,
  learner_id   uuid references public.children(id) on delete cascade,
  door_id      uuid references public.school_doors(id),
  learner_ref  text,
  interests    text[] not null default '{}',
  what_helps   jsonb not null default '[]'::jsonb,
  updated_at   timestamptz not null default now(),
  constraint learner_profile_who check (student_id is not null or (door_id is not null and learner_ref is not null)),
  constraint learner_profile_interests check (cardinality(interests) <= 8 and array_to_string(interests, ',') ~ '^[a-z ,]*$'),
  constraint learner_profile_helps check (jsonb_typeof(what_helps) = 'array' and jsonb_array_length(what_helps) <= 12)
);
alter table public.learner_profile enable row level security;
revoke all on public.learner_profile from anon, authenticated;

create table if not exists public.learner_session_notes (
  id             uuid primary key default gen_random_uuid(),
  learner_key    text not null,
  student_id     uuid references auth.users(id) on delete cascade,
  learner_id     uuid references public.children(id) on delete cascade,
  door_id        uuid references public.school_doors(id),
  learner_ref    text,
  session_id     uuid,
  notes          text not null,
  open_questions text[] not null default '{}',
  created_at     timestamptz not null default now(),
  constraint learner_session_notes_len check (char_length(notes) <= 600),
  constraint learner_session_notes_open check (cardinality(open_questions) <= 5)
);
create unique index if not exists learner_session_notes_session on public.learner_session_notes (session_id) where session_id is not null;
create index if not exists learner_session_notes_learner on public.learner_session_notes (learner_key, created_at desc);
alter table public.learner_session_notes enable row level security;
revoke all on public.learner_session_notes from anon, authenticated;

-- The 90 day rule: whoever adds a note also clears the old ones.
create or replace function public.learner_session_notes_expire() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.learner_session_notes where created_at < now() - interval '90 days';
  return null;
end;
$$;
drop trigger if exists learner_session_notes_expire on public.learner_session_notes;
create trigger learner_session_notes_expire after insert on public.learner_session_notes
  for each statement execute function public.learner_session_notes_expire();

create table if not exists public.lesson_reports (
  id           uuid primary key default gen_random_uuid(),
  parent_id    uuid not null references auth.users(id) on delete cascade,
  learner_id   uuid references public.children(id) on delete cascade,
  session_id   uuid,
  subject      text not null,
  body         text not null,
  facts        jsonb not null default '{}'::jsonb,
  email_status text check (email_status in ('sent', 'failed', 'skipped')),
  emailed_at   timestamptz,
  created_at   timestamptz not null default now()
);
create unique index if not exists lesson_reports_session on public.lesson_reports (session_id) where session_id is not null;
create index if not exists lesson_reports_parent on public.lesson_reports (parent_id, created_at desc);
alter table public.lesson_reports enable row level security;
drop policy if exists "parents read own lesson reports" on public.lesson_reports;
create policy "parents read own lesson reports" on public.lesson_reports for select using (auth.uid() = parent_id);
drop policy if exists "parents delete own lesson reports" on public.lesson_reports;
create policy "parents delete own lesson reports" on public.lesson_reports for delete using (auth.uid() = parent_id);
revoke insert, update on public.lesson_reports from anon, authenticated;

create table if not exists public.lesson_report_settings (
  parent_id            uuid primary key references auth.users(id) on delete cascade,
  email_lesson_reports boolean not null default true,
  updated_at           timestamptz not null default now()
);
alter table public.lesson_report_settings enable row level security;
drop policy if exists "parents manage own lesson report settings" on public.lesson_report_settings;
create policy "parents manage own lesson report settings" on public.lesson_report_settings for all using (auth.uid() = parent_id) with check (auth.uid() = parent_id);

comment on table public.learner_profile is 'Interests (at most 8 words) and what helped, per learner. Context only. Service role only.';
comment on table public.learner_session_notes is 'Tutor notes after a lesson, 600 characters at most, deleted after 90 days by a trigger. Service role only.';
comment on table public.lesson_reports is 'The plain report to the parent after each live tutor lesson. Parents read and delete their own.';
