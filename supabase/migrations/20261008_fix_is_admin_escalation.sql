-- ============================================================================
-- SECURITY FIX: users could make themselves admin.
--
-- Any signed-in user could set profiles.is_admin = true on their own row (the
-- "update own profile" rule allows every column). Two rules trusted that
-- column, so that user could then read EVERY lesson chat (lesson_messages)
-- and EVERY lesson's whiteboard notes (storage bucket lesson-notes).
--
-- The fix:
--   1. Both rules now use public.is_admin(), which checks the signed-in email
--      against the allowlist, not a column users can edit.
--   2. Users can no longer change is_admin, on insert or update. Only the SQL
--      editor or the service role can.
--   3. Everyone except the owner is set back to is_admin = false.
--
-- Safe to run more than once.
-- ============================================================================

-- 1. Lesson chat: members, or a real admin by email.
drop policy if exists "lesson chat: members and admins read" on public.lesson_messages;
create policy "lesson chat: members and admins read" on public.lesson_messages
  for select using (
    public.is_lesson_member(booking_id)
    or public.is_admin()
  );

-- 1. Lesson notes: members, or a real admin by email.
drop policy if exists "lesson notes: members and admins read" on storage.objects;
create policy "lesson notes: members and admins read" on storage.objects
  for select using (
    bucket_id = 'lesson-notes' and (
      public.lesson_member_for_path(name)
      or public.is_admin()
    )
  );

-- 2. Signed-in users (and visitors) cannot set or change is_admin.
create or replace function public.protect_is_admin()
returns trigger
language plpgsql
as $$
begin
  if current_user in ('authenticated', 'anon') then
    if tg_op = 'INSERT' then
      new.is_admin := false;
    elsif new.is_admin is distinct from old.is_admin then
      new.is_admin := old.is_admin;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_is_admin on public.profiles;
create trigger protect_is_admin
  before insert or update on public.profiles
  for each row execute function public.protect_is_admin();

-- 3. Only the owner keeps the flag.
update public.profiles
   set is_admin = false
 where is_admin
   and lower(coalesce(email, '')) <> 'mutualevy@gmail.com';

-- Check: this should list only the owner, or nothing.
select id, email, is_admin from public.profiles where is_admin;
