-- A child's own tablet, without the parent's Google account on it.
--
-- The parent taps "Open on Imani's tablet" and gets a link that works once,
-- for 24 hours. Opening it on the tablet gives the tablet its own anonymous
-- sign-in and links it to that one child. A linked tablet can read and save
-- that child's maths practice and nothing else: no payments, no messages, no
-- other children. The parent can switch a tablet off at any time.
--
-- Needs "Allow anonymous sign-ins" switched on in Supabase
-- (Authentication > Sign In / Providers).

-- Links waiting to be opened (single use, 24 hours).
create table if not exists public.child_links (
  token text primary key,
  parent_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours',
  used_at timestamptz
);
alter table public.child_links enable row level security;
-- No policies: only the two functions below touch this table.

-- Tablets linked to a child.
create table if not exists public.child_devices (
  device_uid uuid primary key references auth.users(id) on delete cascade,
  parent_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.child_devices enable row level security;

drop policy if exists "Parents see and remove their tablets" on public.child_devices;
create policy "Parents see and remove their tablets" on public.child_devices
  for select using (auth.uid() = parent_id);
drop policy if exists "Parents switch off their tablets" on public.child_devices;
create policy "Parents switch off their tablets" on public.child_devices
  for delete using (auth.uid() = parent_id);
drop policy if exists "A tablet sees its own link" on public.child_devices;
create policy "A tablet sees its own link" on public.child_devices
  for select using (auth.uid() = device_uid);

-- Parent: make a link for one of their children.
create or replace function public.create_child_link(p_child uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  t text;
begin
  if auth.uid() is null then raise exception 'signed_out'; end if;
  if not exists (select 1 from children where id = p_child and parent_id = auth.uid()) then
    raise exception 'not_your_child';
  end if;
  -- Old unused links for this child stop working.
  delete from child_links where child_id = p_child and used_at is null;
  t := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  insert into child_links (token, parent_id, child_id) values (t, auth.uid(), p_child);
  return t;
end;
$$;
grant execute on function public.create_child_link(uuid) to authenticated;

-- Tablet (signed in anonymously): open the link once.
create or replace function public.open_child_link(p_token text)
returns table (parent_id uuid, child_id uuid, name text, grade text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  l child_links;
begin
  if auth.uid() is null then raise exception 'signed_out'; end if;
  select * into l from child_links where token = p_token for update;
  if l.token is null then raise exception 'link_not_found'; end if;
  if l.used_at is not null then raise exception 'link_used'; end if;
  if l.expires_at < now() then raise exception 'link_expired'; end if;
  update child_links set used_at = now() where token = p_token;
  insert into child_devices (device_uid, parent_id, child_id)
  values (auth.uid(), l.parent_id, l.child_id)
  on conflict (device_uid) do update set parent_id = excluded.parent_id, child_id = excluded.child_id, created_at = now();
  return query select l.parent_id, c.id, c.name, c.grade from children c where c.id = l.child_id;
end;
$$;
grant execute on function public.open_child_link(text) to authenticated;

-- What a linked tablet may do.
drop policy if exists "Linked tablet: its child's practice" on public.ai_tutor_progress;
create policy "Linked tablet: its child's practice" on public.ai_tutor_progress
  for all
  using (exists (select 1 from child_devices d where d.device_uid = auth.uid()
                 and d.parent_id = ai_tutor_progress.user_id and d.child_id = ai_tutor_progress.learner_id))
  with check (exists (select 1 from child_devices d where d.device_uid = auth.uid()
                 and d.parent_id = ai_tutor_progress.user_id and d.child_id = ai_tutor_progress.learner_id));

drop policy if exists "Linked tablet: its child" on public.children;
create policy "Linked tablet: its child" on public.children
  for select using (exists (select 1 from child_devices d where d.device_uid = auth.uid() and d.child_id = children.id));

drop policy if exists "Linked tablet: the family's pass" on public.subscriptions;
create policy "Linked tablet: the family's pass" on public.subscriptions
  for select using (exists (select 1 from child_devices d where d.device_uid = auth.uid() and d.parent_id = subscriptions.user_id));

drop policy if exists "Linked tablet: practice answers" on public.response_events;
create policy "Linked tablet: practice answers" on public.response_events
  for insert with check (exists (select 1 from child_devices d where d.device_uid = auth.uid()
                 and d.parent_id::text = response_events.student_id::text and d.child_id = response_events.learner_id));
