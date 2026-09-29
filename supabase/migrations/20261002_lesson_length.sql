-- 30-minute lessons: each booking records its length. Existing bookings were
-- all one hour, so the default keeps them correct.
alter table public.bookings
  add column if not exists duration_minutes integer not null default 60;

do $$ begin
  alter table public.bookings
    add constraint bookings_duration_minutes_check check (duration_minutes in (30, 60));
exception when duplicate_object then null; end $$;
