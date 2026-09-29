-- Lesson chat is kept for 30 days, so a complaint about a lesson can be
-- looked into, then deleted automatically. Only the family who booked the
-- lesson, its tutor, and Tutagora admins can read it.

create table if not exists public.lesson_messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_name text,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists lesson_messages_booking_idx on public.lesson_messages (booking_id, created_at);

-- Is the signed-in person the family or the tutor of this lesson?
create or replace function public.is_lesson_member(p_booking uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.bookings b
    left join public.tutors t on t.id = b.tutor_id
    where b.id = p_booking and (b.student_id = auth.uid() or t.user_id = auth.uid())
  );
$$;

alter table public.lesson_messages enable row level security;

drop policy if exists "lesson chat: members and admins read" on public.lesson_messages;
create policy "lesson chat: members and admins read" on public.lesson_messages
  for select using (
    public.is_lesson_member(booking_id)
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

drop policy if exists "lesson chat: members write as themselves" on public.lesson_messages;
create policy "lesson chat: members write as themselves" on public.lesson_messages
  for insert with check (sender_id = auth.uid() and public.is_lesson_member(booking_id));
-- No update or delete: messages can't be changed after they're sent.

-- Delete chat older than 30 days, every night at 03:17 UTC.
create extension if not exists pg_cron;
select cron.schedule(
  'delete-old-lesson-chat',
  '17 3 * * *',
  $$delete from public.lesson_messages where created_at < now() - interval '30 days'$$
);
