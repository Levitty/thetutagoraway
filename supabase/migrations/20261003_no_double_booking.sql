-- Stop two families booking the same tutor at the same time.
--
-- A slot is taken by a confirmed (paid) booking, or by a pending one made in
-- the last 20 minutes (someone is paying for it right now). Older pending
-- bookings are abandoned checkouts and don't block anyone.

-- 1) The rule, checked by the database on every new booking.
create or replace function public.prevent_double_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.bookings b
    where b.tutor_id = new.tutor_id
      and b.lesson_date::date = new.lesson_date::date
      and left(b.start_time::text, 5) = left(new.start_time::text, 5)
      and b.id is distinct from new.id
      and (b.status = 'confirmed'
           or (b.status = 'pending' and b.created_at > now() - interval '20 minutes'))
  ) then
    raise exception 'slot_taken' using errcode = 'P0001',
      hint = 'This tutor was just booked at that time. Please pick another time.';
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_no_double_booking on public.bookings;
create trigger bookings_no_double_booking
  before insert on public.bookings
  for each row execute function public.prevent_double_booking();

-- 2) Which of a tutor's times are taken, so the booking page can hide them.
-- Returns only dates and times, never who booked.
create or replace function public.taken_slots(p_tutor text, p_from date, p_to date)
returns table (lesson_date date, start_time time)
language sql
stable
security definer
set search_path = public
as $$
  select b.lesson_date::date, left(b.start_time::text, 5)::time
  from public.bookings b
  where b.tutor_id::text = p_tutor
    and b.lesson_date::date between p_from and p_to
    and (b.status = 'confirmed'
         or (b.status = 'pending' and b.created_at > now() - interval '20 minutes'));
$$;

grant execute on function public.taken_slots(text, date, date) to anon, authenticated;
