-- ============================================================================
-- FIX: infinite recursion in classes <-> class_members RLS policies
--
-- The "Members can read their class" policy on classes queried class_members,
-- and the "Teachers read own class members" policy on class_members queried
-- classes. Each policy's USING check triggered the other's → Postgres aborts
-- with "infinite recursion detected in policy" (42P17). Because reading
-- profiles evaluates a policy that joins both tables, EVERY profiles read
-- errored — breaking the admin dashboard and blanking student names.
--
-- Fix: do the cross-table checks in SECURITY DEFINER helpers that read the
-- tables WITHOUT re-applying RLS, so there is no policy-to-policy cycle.
-- ============================================================================

create or replace function public.is_class_teacher(p_class_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.classes c
    where c.id = p_class_id and c.teacher_id = auth.uid()
  );
$$;

create or replace function public.is_class_member(p_class_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.class_members cm
    where cm.class_id = p_class_id and cm.student_id = auth.uid()
  );
$$;

-- classes: a member may read their class (no longer queries class_members under RLS)
drop policy if exists "Members can read their class" on public.classes;
create policy "Members can read their class"
  on public.classes for select
  using ( public.is_class_member(id) );

-- class_members: a teacher may read/remove members of classes they own
-- (no longer queries classes under RLS)
drop policy if exists "Teachers read own class members" on public.class_members;
create policy "Teachers read own class members"
  on public.class_members for select
  using ( public.is_class_teacher(class_id) );

drop policy if exists "Teachers remove own class members" on public.class_members;
create policy "Teachers remove own class members"
  on public.class_members for delete
  using ( public.is_class_teacher(class_id) );
