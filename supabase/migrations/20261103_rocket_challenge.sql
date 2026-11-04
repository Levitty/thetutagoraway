-- ============================================================================
-- HOREB ROCKET CHALLENGE: project mode.                      3 November 2026
--
-- Teams of two learners (Grades 6 to 9) from sponsoring schools build a water
-- rocket over about four weeks. HOREB guides them in a chat per level; every
-- test goes in the team's design log; the next step's help needs a logged
-- test (worked out from the log by src/rocket/progress.js, never stored).
--
-- Who sees what:
--   family     the account a learner uses (a parent's account for a child
--              profile, or the learner's own login): their team's chat, log
--              and members. Writes the log. Gives consent when joining.
--   staff      the team's teacher and every staff member added to its school:
--              all teams of that school, read-only, and may open a level.
--   organiser  public.is_admin(): everything, and the launch-day results.
-- Chat messages are written ONLY by the rocket-guide edge function (service
-- role), so a client cannot put words in HOREB's mouth or skip the guard.
--
-- Privacy:
--   * consent is recorded per learner (consent_at, consent_by) before the
--     learner is on a team; joining without it is refused;
--   * first names live here for teachers and parents to read; they are never
--     sent to the model (the edge function scrubs them, see src/rocket/guard.js);
--   * a parent can ask for deletion (rocket_request_deletion); the organiser
--     carries it out with rocket_erase_member after the challenge.
--
-- Safe to run more than once. Changes no existing table.
-- ============================================================================

-- ---------------------------------------------------------------- tables
create table if not exists rocket_challenges (
  id                     uuid primary key default gen_random_uuid(),
  title                  text not null,
  status                 text not null default 'draft',   -- draft | open | closed
  -- Not decided yet (owner, 3 Nov 2026). Null shows as "To be confirmed".
  lab_name               text,
  starts_on              date,
  launch_on              date,
  fee_note               text,
  prizes_note            text,
  -- Cost. The outline budgets about US$5 to 15 per learner for the whole
  -- challenge; a team's cap is this times its number of learners.
  budget_usd_per_learner numeric not null default 10,
  daily_messages_per_team int not null default 60,
  created_at             timestamptz not null default now()
);

create table if not exists rocket_schools (
  id           uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references rocket_challenges(id) on delete cascade,
  name         text not null,
  created_at   timestamptz not null default now()
);

create table if not exists rocket_school_staff (
  school_id  uuid not null references rocket_schools(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (school_id, user_id)
);

create table if not exists rocket_teams (
  id           uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references rocket_challenges(id) on delete cascade,
  school_id    uuid not null references rocket_schools(id) on delete cascade,
  name         text not null,
  join_code    text not null unique,
  teacher_id   uuid references auth.users(id) on delete set null,
  opened_level int not null default 1 check (opened_level between 1 and 5),
  created_at   timestamptz not null default now()
);
create index if not exists rocket_teams_school on rocket_teams(school_id);

create table if not exists rocket_members (
  id                    uuid primary key default gen_random_uuid(),
  team_id               uuid not null references rocket_teams(id) on delete cascade,
  label                 text not null check (label in ('A', 'B')),
  account_id            uuid not null references auth.users(id) on delete cascade,
  child_id              uuid references children(id) on delete cascade,
  first_name            text not null,
  grade                 int not null check (grade between 6 and 9),
  consent_at            timestamptz not null,
  consent_by            uuid not null references auth.users(id) on delete cascade,
  consent_version       text not null,
  deletion_requested_at timestamptz,
  deletion_note         text,
  created_at            timestamptz not null default now(),
  unique (team_id, label)
);
create unique index if not exists rocket_members_one_seat
  on rocket_members(team_id, account_id, coalesce(child_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists rocket_members_account on rocket_members(account_id);

create table if not exists rocket_log (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references rocket_teams(id) on delete cascade,
  level        int not null check (level between 1 and 5),
  step         int not null check (step between 1 and 5),
  member_label text check (member_label in ('A', 'B')),
  tested_on    date not null,
  what_changed text not null,
  water_ml     numeric check (water_ml is null or (water_ml >= 0 and water_ml <= 5000)),
  -- The hard limit, in the database as well as the form.
  pressure_bar numeric check (pressure_bar is null or (pressure_bar >= 0 and pressure_bar <= 5)),
  fins_notes   text,
  nose_notes   text,
  weight_notes text,
  result       text not null,
  learned      text not null,
  photo_path   text,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists rocket_log_team on rocket_log(team_id, level, step);

create table if not exists rocket_messages (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references rocket_teams(id) on delete cascade,
  level        int not null,
  step         int,
  role         text not null check (role in ('team', 'horeb')),
  -- team: ask | stuck.   horeb: reply | hint | safety | log-first | budget | fallback
  kind         text not null,
  author_label text,
  body         text not null,
  guard        text[] not null default '{}',
  model        text,
  input_tokens int, output_tokens int, cache_read_tokens int, cache_write_tokens int,
  cost_usd     numeric not null default 0,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists rocket_messages_team on rocket_messages(team_id, level, created_at);

-- Launch day, recorded by the organiser.
create table if not exists rocket_flights (
  team_id     uuid primary key references rocket_teams(id) on delete cascade,
  height_m    numeric,
  method      text,          -- clinometer | altimeter | other
  landing     text,
  notes       text,
  recorded_by uuid references auth.users(id) on delete set null,
  recorded_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- helpers
create or replace function public.rocket_is_family(p_team uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from rocket_members m where m.team_id = p_team and m.account_id = auth.uid());
$$;

create or replace function public.rocket_is_staff(p_team uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from rocket_teams t
    where t.id = p_team and (
      t.teacher_id = auth.uid()
      or exists (select 1 from rocket_school_staff s where s.school_id = t.school_id and s.user_id = auth.uid())
    )
  );
$$;

create or replace function public.rocket_can_read(p_team uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or public.rocket_is_family(p_team) or public.rocket_is_staff(p_team);
$$;

-- ---------------------------------------------------------------- RLS
alter table rocket_challenges   enable row level security;
alter table rocket_schools      enable row level security;
alter table rocket_school_staff enable row level security;
alter table rocket_teams        enable row level security;
alter table rocket_members      enable row level security;
alter table rocket_log          enable row level security;
alter table rocket_messages     enable row level security;
alter table rocket_flights      enable row level security;

drop policy if exists "rocket challenges: signed in read" on rocket_challenges;
create policy "rocket challenges: signed in read" on rocket_challenges
  for select using (auth.uid() is not null);
drop policy if exists "rocket challenges: organiser writes" on rocket_challenges;
create policy "rocket challenges: organiser writes" on rocket_challenges
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "rocket schools: read" on rocket_schools;
create policy "rocket schools: read" on rocket_schools
  for select using (
    public.is_admin()
    or exists (select 1 from rocket_school_staff s where s.school_id = rocket_schools.id and s.user_id = auth.uid())
    or exists (select 1 from rocket_teams t where t.school_id = rocket_schools.id and public.rocket_can_read(t.id))
  );
drop policy if exists "rocket schools: organiser writes" on rocket_schools;
create policy "rocket schools: organiser writes" on rocket_schools
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "rocket staff: read own or organiser" on rocket_school_staff;
create policy "rocket staff: read own or organiser" on rocket_school_staff
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "rocket staff: organiser writes" on rocket_school_staff;
create policy "rocket staff: organiser writes" on rocket_school_staff
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "rocket teams: read" on rocket_teams;
create policy "rocket teams: read" on rocket_teams
  for select using (public.rocket_can_read(id));
drop policy if exists "rocket teams: organiser writes" on rocket_teams;
create policy "rocket teams: organiser writes" on rocket_teams
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "rocket members: read" on rocket_members;
create policy "rocket members: read" on rocket_members
  for select using (public.rocket_can_read(team_id));

drop policy if exists "rocket log: read" on rocket_log;
create policy "rocket log: read" on rocket_log
  for select using (public.rocket_can_read(team_id));
drop policy if exists "rocket log: family or staff add" on rocket_log;
create policy "rocket log: family or staff add" on rocket_log
  for insert with check (
    created_by = auth.uid()
    and (public.rocket_is_family(team_id) or public.rocket_is_staff(team_id) or public.is_admin())
  );
drop policy if exists "rocket log: author corrects" on rocket_log;
create policy "rocket log: author corrects" on rocket_log
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

drop policy if exists "rocket messages: read" on rocket_messages;
create policy "rocket messages: read" on rocket_messages
  for select using (public.rocket_can_read(team_id));
-- No insert/update/delete policy: only the edge function (service role) writes.

drop policy if exists "rocket flights: read" on rocket_flights;
create policy "rocket flights: read" on rocket_flights
  for select using (public.rocket_can_read(team_id));
drop policy if exists "rocket flights: organiser writes" on rocket_flights;
create policy "rocket flights: organiser writes" on rocket_flights
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- photos
-- Private bucket. Path: <team id>/<file>. Optional in the log.
insert into storage.buckets (id, name, public)
values ('rocket-photos', 'rocket-photos', false)
on conflict (id) do nothing;

drop policy if exists "rocket photos: read" on storage.objects;
create policy "rocket photos: read" on storage.objects
  for select using (
    bucket_id = 'rocket-photos'
    and public.rocket_can_read(nullif(split_part(name, '/', 1), '')::uuid)
  );
drop policy if exists "rocket photos: family or staff upload" on storage.objects;
create policy "rocket photos: family or staff upload" on storage.objects
  for insert with check (
    bucket_id = 'rocket-photos'
    and (
      public.rocket_is_family(nullif(split_part(name, '/', 1), '')::uuid)
      or public.rocket_is_staff(nullif(split_part(name, '/', 1), '')::uuid)
    )
  );

-- ---------------------------------------------------------------- joining
-- A parent (or a learner with their own login) joins a team with its code.
-- Consent is part of joining: no consent, no seat.
create or replace function public.rocket_join_team(p_code text, p_child uuid, p_grade int, p_consent boolean)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_team  uuid;
  v_name  text;
  v_label text;
  v_id    uuid;
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  if p_consent is distinct from true then
    raise exception 'A parent or guardian must agree before a learner joins';
  end if;
  if p_grade is null or p_grade < 6 or p_grade > 9 then
    raise exception 'The challenge is for Grades 6 to 9';
  end if;

  select t.id into v_team from rocket_teams t where t.join_code = upper(trim(p_code));
  if v_team is null then raise exception 'That team code is not right'; end if;

  if p_child is not null then
    select split_part(trim(c.name), ' ', 1) into v_name from children c where c.id = p_child and c.parent_id = auth.uid();
    if v_name is null then raise exception 'That child is not on your account'; end if;
  else
    select split_part(trim(coalesce(p.full_name, 'Learner')), ' ', 1) into v_name from profiles p where p.id = auth.uid();
    v_name := coalesce(v_name, 'Learner');
  end if;

  -- Already on this team: nothing to do.
  select m.id into v_id from rocket_members m
   where m.team_id = v_team and m.account_id = auth.uid()
     and coalesce(m.child_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_child, '00000000-0000-0000-0000-000000000000'::uuid);
  if v_id is not null then return v_team; end if;

  -- One team per learner in a challenge.
  if exists (
    select 1 from rocket_members m join rocket_teams t on t.id = m.team_id
     where t.challenge_id = (select challenge_id from rocket_teams where id = v_team)
       and m.account_id = auth.uid()
       and coalesce(m.child_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_child, '00000000-0000-0000-0000-000000000000'::uuid)
  ) then
    raise exception 'This learner is already on a team';
  end if;

  -- Lock the team row so two families joining at once cannot both take seat B.
  perform 1 from rocket_teams where id = v_team for update;
  select case
           when not exists (select 1 from rocket_members where team_id = v_team and label = 'A') then 'A'
           when not exists (select 1 from rocket_members where team_id = v_team and label = 'B') then 'B'
         end into v_label;
  if v_label is null then raise exception 'This team already has two learners'; end if;

  insert into rocket_members (team_id, label, account_id, child_id, first_name, grade, consent_at, consent_by, consent_version)
  values (v_team, v_label, auth.uid(), p_child, v_name, p_grade, now(), auth.uid(), 'rocket-2026-v1');
  return v_team;
end;
$$;

-- A parent asks for their child's challenge data to be removed.
create or replace function public.rocket_request_deletion(p_member uuid, p_note text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update rocket_members
     set deletion_requested_at = coalesce(deletion_requested_at, now()),
         deletion_note = left(coalesce(p_note, ''), 500)
   where id = p_member and account_id = auth.uid();
  if not found then raise exception 'Only the parent of this learner can ask'; end if;
end;
$$;

-- A teacher (or the organiser) opens a level early, for example on a lab day.
create or replace function public.rocket_open_level(p_team uuid, p_level int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not (public.rocket_is_staff(p_team) or public.is_admin()) then raise exception 'Not your team'; end if;
  update rocket_teams set opened_level = greatest(1, least(5, p_level)) where id = p_team;
end;
$$;

-- The maths part of judging: which of the challenge's linked skills each
-- learner mastered on HOREB since the challenge started. Skill ids only,
-- never answers.
create or replace function public.rocket_team_maths(p_team uuid, p_skills text[])
returns table (label text, mastered text[])
language plpgsql stable security definer set search_path = public as $$
declare
  v_since timestamptz;
begin
  if not public.rocket_can_read(p_team) then raise exception 'Not your team'; end if;
  if coalesce(array_length(p_skills, 1), 0) > 60 then raise exception 'Too many skills'; end if;
  select coalesce(c.starts_on::timestamptz, t.created_at) into v_since
    from rocket_teams t join rocket_challenges c on c.id = t.challenge_id where t.id = p_team;
  return query
    select m.label,
           coalesce(array(
             select k from jsonb_each(coalesce(p.progress -> 'skills', '{}'::jsonb)) as s(k, v)
              where k = any(p_skills)
                and (v ->> 'mastered')::boolean is true
                and (v ->> 'masteredAt') is not null
                and (v ->> 'masteredAt')::timestamptz >= v_since
           ), '{}')
      from rocket_members m
      left join ai_tutor_progress p
        on p.profile_key = case when m.child_id is null then m.account_id::text
                                else m.account_id::text || '_c' || m.child_id::text end
     where m.team_id = p_team
     order by m.label;
end;
$$;

-- What a team has spent on HOREB's chat, against its cap.
create or replace function public.rocket_team_spend(p_team uuid)
returns table (spent_usd numeric, cap_usd numeric, messages_today int)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.rocket_can_read(p_team) then raise exception 'Not your team'; end if;
  return query
    select coalesce((select sum(cost_usd) from rocket_messages where team_id = p_team), 0),
           (select c.budget_usd_per_learner * greatest(1, (select count(*) from rocket_members where team_id = p_team))
              from rocket_teams t join rocket_challenges c on c.id = t.challenge_id where t.id = p_team),
           (select count(*)::int from rocket_messages where team_id = p_team and role = 'team' and created_at >= date_trunc('day', now()));
end;
$$;

-- ---------------------------------------------------------------- organiser
create or replace function public.rocket_add_school(p_challenge uuid, p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not public.is_admin() then raise exception 'Organiser only'; end if;
  insert into rocket_schools (challenge_id, name) values (p_challenge, trim(p_name)) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.rocket_add_staff(p_school uuid, p_email text)
returns uuid language plpgsql security definer set search_path = public, auth as $$
declare v_user uuid;
begin
  if not public.is_admin() then raise exception 'Organiser only'; end if;
  select u.id into v_user from auth.users u where lower(u.email) = lower(trim(p_email));
  if v_user is null then raise exception 'No account with that email yet: ask the teacher to sign up first'; end if;
  insert into rocket_school_staff (school_id, user_id) values (p_school, v_user) on conflict do nothing;
  return v_user;
end;
$$;

create or replace function public.rocket_create_team(p_school uuid, p_name text, p_teacher uuid default null)
returns table (id uuid, join_code text)
language plpgsql security definer set search_path = public as $$
declare v_code text; v_id uuid; v_challenge uuid;
begin
  if not public.is_admin() then raise exception 'Organiser only'; end if;
  select s.challenge_id into v_challenge from rocket_schools s where s.id = p_school;
  if v_challenge is null then raise exception 'No such school'; end if;
  loop
    -- No 0/O or 1/I, so a code read out over the phone is typed right.
    v_code := 'R' || translate(upper(substring(md5(random()::text) from 1 for 5)), '01', '23');
    begin
      insert into rocket_teams (challenge_id, school_id, name, join_code, teacher_id)
      values (v_challenge, p_school, trim(p_name), v_code, p_teacher)
      returning rocket_teams.id into v_id;
      exit;
    exception when unique_violation then
    end;
  end loop;
  return query select v_id, v_code;
end;
$$;

-- Carry out a parent's deletion request: the learner's own words in the chat
-- and their log entries are replaced, and their seat and consent removed.
-- HOREB's replies stay, because the other learner's work depends on them;
-- they never contained a name (names are scrubbed before the model).
create or replace function public.rocket_erase_member(p_member uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_team uuid; v_label text;
begin
  if not public.is_admin() then raise exception 'Organiser only'; end if;
  select team_id, label into v_team, v_label from rocket_members where id = p_member;
  if v_team is null then raise exception 'No such learner'; end if;
  update rocket_messages set body = '[Removed at a parent''s request]', guard = '{}'
   where team_id = v_team and role = 'team' and author_label = v_label;
  update rocket_log set what_changed = '[Removed at a parent''s request]', result = '[Removed]', learned = '[Removed]',
         fins_notes = null, nose_notes = null, weight_notes = null, photo_path = null
   where team_id = v_team and member_label = v_label;
  delete from rocket_members where id = p_member;
end;
$$;

grant execute on function public.rocket_is_family(uuid) to authenticated;
grant execute on function public.rocket_is_staff(uuid) to authenticated;
grant execute on function public.rocket_can_read(uuid) to authenticated;
grant execute on function public.rocket_join_team(text, uuid, int, boolean) to authenticated;
grant execute on function public.rocket_request_deletion(uuid, text) to authenticated;
grant execute on function public.rocket_open_level(uuid, int) to authenticated;
grant execute on function public.rocket_team_maths(uuid, text[]) to authenticated;
grant execute on function public.rocket_team_spend(uuid) to authenticated;
grant execute on function public.rocket_add_school(uuid, text) to authenticated;
grant execute on function public.rocket_add_staff(uuid, text) to authenticated;
grant execute on function public.rocket_create_team(uuid, text, uuid) to authenticated;
grant execute on function public.rocket_erase_member(uuid) to authenticated;

-- ---------------------------------------------------------------- the challenge
-- One row for December 2026. Everything undecided is left empty on purpose
-- and shows as "To be confirmed" in the app until the organiser fills it.
insert into rocket_challenges (id, title, status)
values ('7c0c0e2a-0000-4000-8000-000000002026', 'HOREB Rocket Challenge, December 2026', 'draft')
on conflict (id) do nothing;
