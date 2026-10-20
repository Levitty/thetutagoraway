-- ============================================================================
-- ASSIGNMENTS — "master these skills by Friday".
--
-- One table, and deliberately only one. There is no submissions table and no
-- write path from a student, because an assignment sets SKILLS and "done"
-- means MASTERED — which ai_tutor_progress already records for every learner.
-- Completion is read from there.
--
-- Two things follow, both worth having:
--   a teacher sees real mastery, not "opened it and clicked through"
--   there is one record of what a child knows, so nothing can disagree
--
-- It also means a child needs no new permission to "submit" anything: they
-- practise as they always do, and the assignment is a lens over it.
-- ============================================================================

create table if not exists assignments (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references classes(id) on delete cascade,
  teacher_id  uuid not null references auth.users(id) on delete cascade,
  title       text not null check (length(trim(title)) between 1 and 120),
  -- Skill ids from the knowledge graph (e.g. G4_PLACE_VALUE). Text rather than
  -- a foreign key on purpose: the graph lives in the app and is versioned with
  -- it, so a renamed skill must not be able to delete a teacher's assignment.
  skill_ids   text[] not null check (cardinality(skill_ids) between 1 and 20),
  due_on      date,
  created_at  timestamptz not null default now()
);

create index if not exists idx_assignments_class on assignments(class_id);

alter table assignments enable row level security;

-- A teacher manages assignments for classes they own. The WITH CHECK on
-- class ownership is the part that matters: without it, a teacher could set
-- work for somebody else's class by passing its id.
drop policy if exists "Teachers manage assignments for own classes" on assignments;
create policy "Teachers manage assignments for own classes" on assignments
  for all
  using (exists (
    select 1 from classes c where c.id = assignments.class_id and c.teacher_id = auth.uid()
  ))
  with check (exists (
    select 1 from classes c where c.id = assignments.class_id and c.teacher_id = auth.uid()
  ));

-- A student reads the work set for a class they are actually in, and cannot
-- write to it at all — there is nothing for them to write.
drop policy if exists "Students read their class assignments" on assignments;
create policy "Students read their class assignments" on assignments
  for select
  using (exists (
    select 1 from class_members cm
    where cm.class_id = assignments.class_id and cm.student_id = auth.uid()
  ));

comment on table assignments is
  'Work a teacher sets for a class. Completion is NOT stored here — it is read from ai_tutor_progress, where done means the skill is mastered.';
