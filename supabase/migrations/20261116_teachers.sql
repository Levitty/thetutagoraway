-- ============================================================================
-- HOREB FOR ANY TEACHER, step 1 (owner, 16 Nov 2026; plan in Tuta Workspace/Plans/
-- PLAN_16NOV_horeb_independent_teachers.html). A teacher signs up on their own with
-- email or Google and gets a dashboard that is theirs, not their school's.
--
--   profiles.role 'teacher'  beside parent, student, tutor. Tutors sell lessons on the
--                            marketplace; teachers teach their own class.
--   teacher_profiles         the five things a teacher tells us at sign-up: the school they
--                            say they teach at (it opens nothing of that school's), county,
--                            grades, subjects, and a TSC number if they choose to give it.
--   teacher_save_profile()   writes the teacher's own row and makes the account a teacher
--                            (only from a new learner or parent account with no children,
--                            bookings or classes, so nobody is moved by accident).
--
-- Teachers in Tuta schools never see this: they sign in through their school.
-- Idempotent: safe to run twice.
-- ============================================================================

-- If profiles.role has a CHECK constraint, widen it to allow 'teacher'.
do $$
declare r record;
begin
  for r in select conname, pg_get_constraintdef(oid) as def from pg_constraint
            where conrelid = 'public.profiles'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%role%'
  loop
    if r.def not ilike '%teacher%' then
      execute format('alter table public.profiles drop constraint %I', r.conname);
      execute 'alter table public.profiles add constraint profiles_role_check check (role in (''student'', ''parent'', ''tutor'', ''teacher'', ''tablet'', ''admin''))';
    end if;
  end loop;
end $$;

create table if not exists public.teacher_profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  school_name  text not null,
  county       text not null,
  grades       int[] not null default '{}',
  subjects     text[] not null default '{}',
  tsc_number   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint teacher_profiles_school check (char_length(btrim(school_name)) between 2 and 120),
  constraint teacher_profiles_county check (char_length(btrim(county)) between 2 and 40),
  constraint teacher_profiles_grades check (cardinality(grades) between 1 and 12 and grades <@ array[1,2,3,4,5,6,7,8,9,10,11,12]),
  constraint teacher_profiles_subjects check (cardinality(subjects) between 1 and 12),
  constraint teacher_profiles_tsc check (tsc_number is null or tsc_number ~ '^[0-9]{4,10}$')
);
comment on table public.teacher_profiles is 'An independent HOREB teacher: the school they say they teach at, county, grades, subjects, optional TSC number (20261116)';
comment on column public.teacher_profiles.school_name is 'What the teacher told us. Gives no access to that school; counted for the leads list.';

alter table public.teacher_profiles enable row level security;
revoke all on public.teacher_profiles from anon;
grant select on public.teacher_profiles to authenticated;

drop policy if exists "Teachers read their own profile" on public.teacher_profiles;
create policy "Teachers read their own profile" on public.teacher_profiles
  for select using (user_id = auth.uid());
-- Writes go through teacher_save_profile only (no insert or update policy).

create or replace function public.teacher_save_profile(
  p_school   text,
  p_county   text,
  p_grades   int[],
  p_subjects text[],
  p_tsc      text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid  uuid := auth.uid();
  v_role text;
  v_tsc  text := nullif(regexp_replace(coalesce(p_tsc, ''), '\s', '', 'g'), '');
begin
  if v_uid is null then return jsonb_build_object('success', false, 'error', 'Sign in first.'); end if;
  select role into v_role from profiles where id = v_uid;
  if v_role is null then return jsonb_build_object('success', false, 'error', 'Your account is still being set up. Try again in a moment.'); end if;
  if v_role not in ('teacher', 'student', 'parent') then
    return jsonb_build_object('success', false, 'error', 'This account is a ' || v_role || ' account. Use another email to sign up as a teacher.');
  end if;
  if v_role <> 'teacher' and (
       exists (select 1 from children where parent_id = v_uid)
    or exists (select 1 from bookings where student_id = v_uid)
    or exists (select 1 from class_members where student_id = v_uid)) then
    return jsonb_build_object('success', false, 'error', 'This account already has children, lessons or classes on it. Sign up as a teacher with another email.');
  end if;
  if v_tsc is not null and v_tsc !~ '^[0-9]{4,10}$' then
    return jsonb_build_object('success', false, 'error', 'A TSC number is digits only. Leave it empty if you prefer.');
  end if;

  insert into teacher_profiles (user_id, school_name, county, grades, subjects, tsc_number)
  values (v_uid, btrim(p_school), btrim(p_county), coalesce(p_grades, '{}'), coalesce(p_subjects, '{}'), v_tsc)
  on conflict (user_id) do update set school_name = excluded.school_name, county = excluded.county,
    grades = excluded.grades, subjects = excluded.subjects, tsc_number = excluded.tsc_number, updated_at = now();

  if v_role <> 'teacher' then update profiles set role = 'teacher' where id = v_uid; end if;
  return jsonb_build_object('success', true);
exception
  when check_violation then
    return jsonb_build_object('success', false, 'error', 'Check the school name, county, grades and subjects: each one is needed.');
end $$;

revoke all on function public.teacher_save_profile(text, text, int[], text[], text) from public, anon;
grant execute on function public.teacher_save_profile(text, text, int[], text[], text) to authenticated;
