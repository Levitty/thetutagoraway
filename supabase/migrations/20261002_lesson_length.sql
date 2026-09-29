-- Lesson length. Lessons are one hour by default. A tutor can choose to also
-- offer 30-minute lessons (at half their hourly rate).

-- 1) Each booking records its length. Existing bookings were all one hour.
alter table public.bookings
  add column if not exists duration_minutes integer not null default 60;

do $$ begin
  alter table public.bookings
    add constraint bookings_duration_minutes_check check (duration_minutes in (30, 60));
exception when duplicate_object then null; end $$;

-- 2) Each tutor chooses whether to offer 30 minutes. Off unless they turn it on.
alter table public.tutors
  add column if not exists offers_30_min boolean not null default false;
