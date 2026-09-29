-- Lesson notes: at the end of a lesson the whiteboard pages are saved as
-- pictures, so parents can see what was covered. Private files, readable
-- only by that lesson's family, its tutor and Tutagora admins. The family
-- can delete them. Files live in the "lesson-notes" bucket under
-- <booking id>/page-<n>.jpg.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lesson-notes', 'lesson-notes', false, 3145728, array['image/jpeg'])
on conflict (id) do nothing;

-- Is the signed-in person the family or tutor of the lesson a file belongs to?
-- (Needs is_lesson_member from 20261004_lesson_chat.sql.)
create or replace function public.lesson_member_for_path(p_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return public.is_lesson_member(split_part(p_name, '/', 1)::uuid);
exception when others then
  return false;
end;
$$;

create or replace function public.lesson_family_for_path(p_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (select 1 from public.bookings b where b.id = split_part(p_name, '/', 1)::uuid and b.student_id = auth.uid());
exception when others then
  return false;
end;
$$;

drop policy if exists "lesson notes: members and admins read" on storage.objects;
create policy "lesson notes: members and admins read" on storage.objects
  for select using (
    bucket_id = 'lesson-notes' and (
      public.lesson_member_for_path(name)
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
    )
  );

drop policy if exists "lesson notes: members save" on storage.objects;
create policy "lesson notes: members save" on storage.objects
  for insert with check (bucket_id = 'lesson-notes' and public.lesson_member_for_path(name));

drop policy if exists "lesson notes: members update" on storage.objects;
create policy "lesson notes: members update" on storage.objects
  for update using (bucket_id = 'lesson-notes' and public.lesson_member_for_path(name));

drop policy if exists "lesson notes: family deletes" on storage.objects;
create policy "lesson notes: family deletes" on storage.objects
  for delete using (bucket_id = 'lesson-notes' and public.lesson_family_for_path(name));
