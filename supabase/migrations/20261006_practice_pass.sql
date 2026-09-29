-- Paid practice: one free week per family account, then a pass bought
-- by the week (KES 100) or the month (KES 350).
--
-- The free week lives in the same subscriptions row as a paid pass
-- (plan = 'trial'), so each account gets it once. Paid passes are
-- recorded by their Paystack reference, so one payment can only ever be
-- used once.

create table if not exists public.subscription_payments (
  reference text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('week', 'month')),
  amount_kes integer not null,
  days integer not null,
  created_at timestamptz not null default now()
);
alter table public.subscription_payments enable row level security;
-- No policies: only the verify-subscription function (service role) writes
-- or reads this table.

-- Start this account's free week (once ever). Returns the subscription row.
create or replace function public.start_free_week()
returns public.subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.subscriptions;
begin
  if auth.uid() is null then
    raise exception 'signed_out';
  end if;
  insert into public.subscriptions (user_id, pro_until, plan, updated_at)
  values (auth.uid(), now() + interval '7 days', 'trial', now())
  on conflict (user_id) do nothing;
  select * into row from public.subscriptions where user_id = auth.uid();
  return row;
end;
$$;

grant execute on function public.start_free_week() to authenticated;
