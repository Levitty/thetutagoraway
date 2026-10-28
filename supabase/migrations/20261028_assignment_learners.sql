-- ============================================================================
-- ASSIGNMENTS FOR CHOSEN LEARNERS — "these four, not the whole class".
--
-- Until now an assignment was set for a whole class. A teacher who has just
-- been shown that four children share one gap wants to set the work for those
-- four, and nobody else should see it on their screen.
--
--   student_ids  null      the whole class (every assignment made before this)
--                uuid[]    only these learners, each of whom must be in the class
--
-- Still one table and still no submissions: done = mastered, read from
-- ai_tutor_progress, and "where they struggled" is read from response_events,
-- which teachers can already read for their own enrolled learners.
--
-- Idempotent: safe to run twice.
-- ============================================================================

alter table public.assignments
  add column if not exists student_ids uuid[];

-- An empty list would be work set for nobody; a list of hundreds is a class.
alter table public.assignments drop constraint if exists assignments_student_ids_size;
alter table public.assignments add constraint assignments_student_ids_size
  check (student_ids is null or cardinality(student_ids) between 1 and 200);

comment on column public.assignments.student_ids is
  'null = the whole class. Otherwise only these learners (auth user ids), each a member of class_id.';

create index if not exists idx_assignments_student_ids
  on public.assignments using gin (student_ids);

-- Every named learner must be in the class the work is set for. Done in a
-- SECURITY DEFINER helper, like is_class_teacher(), so the policy below does
-- not query class_members under RLS (the recursion fixed on 25 Jun).
create or replace function public.learners_in_class(p_class_id uuid, p_ids uuid[])
returns boolean language sql stable security definer set search_path = '' as $$
  select p_ids is null
      or not exists (
        select 1 from unnest(p_ids) as s(id)
        where not exists (
          select 1 from public.class_members cm
          where cm.class_id = p_class_id and cm.student_id = s.id
        )
      );
$$;

revoke all on function public.learners_in_class(uuid, uuid[]) from public;
grant execute on function public.learners_in_class(uuid, uuid[]) to authenticated;

-- Teachers manage work for classes they own, and may only name learners who
-- are in that class. Without the second check a teacher could put a child
-- from another school's class on an assignment and then read the result.
drop policy if exists "Teachers manage assignments for own classes" on public.assignments;
create policy "Teachers manage assignments for own classes" on public.assignments
  for all
  using (public.is_class_teacher(class_id))
  with check (
    public.is_class_teacher(class_id)
    and public.learners_in_class(class_id, student_ids)
  );

-- A learner reads work set for their whole class, or work that names them.
-- Work set for other children in the same class stays invisible to them.
drop policy if exists "Students read their class assignments" on public.assignments;
create policy "Students read their class assignments" on public.assignments
  for select
  using (
    public.is_class_member(class_id)
    and (student_ids is null or auth.uid() = any (student_ids))
  );

comment on table public.assignments is
  'Work a teacher sets for a class or for chosen learners in it (student_ids). Completion is NOT stored here: it is read from ai_tutor_progress, where done means the skill is mastered.';
