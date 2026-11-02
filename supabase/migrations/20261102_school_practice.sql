-- ============================================================================
-- SCHOOL PRACTICE: a school's exam results set HOREB practice at home.
--
-- The owner, 2 Nov 2026: "it needs to connect directly with HOREB." A teacher in
-- Tuta (the school system, its own database) sees that twelve learners lost the
-- marks on adding unlike fractions, and with one action sets them HOREB practice
-- on those skills, to do at home on the family phone. Later Tuta asks whether
-- they mastered them.
--
-- The narrowest door that does it, following the leave door between Tuta and
-- HR (a shared secret held by one school, one named job):
--
--   1. A school door. The owner makes one per school here, in the SQL editor:
--        select public.create_school_door('WSL', 'Whitestar Academy Langata');
--      It returns the secret once; it is pasted into Tuta, Settings, Academic.
--      Nothing in the app can read it (service role only).
--
--   2. Linking a child, with the parent's consent. Tuta prints a slip per learner
--      with a code, WSL-K7QM2XPA-H3RT: the door, the learner's reference in Tuta
--      (random, not the admission number, not a name) and a check made with the
--      door's secret. The parent types it on their child's profile in HOREB;
--      link_school_learner() checks it here and links that child to that
--      reference. Ten tries an hour per parent. The school never learns the
--      parent's account or the child's name in HOREB; HOREB never learns the
--      learner's name in Tuta.
--
--   3. Practice and progress cross only in the edge function school-practice,
--      called by Tuta's server with a signature made with the door's secret:
--        assign   a practice reference, a title, HOREB skill ids, learner refs, due date
--        status   for those practices: per learner ref, linked or not, and which of
--                 the skills are mastered, and when
--      No names, no phones, no marks cross.
--
--   4. The child sees the school's practice beside their own plan:
--      my_school_practice(child) returns the practice set for that child.
--
-- Subject: HOREB's maths now; skill ids are text, so English skills slot in.
-- Idempotent: safe to run twice. Needs pgcrypto (on in every Supabase project,
-- in the extensions schema).
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.school_doors (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique check (code ~ '^[A-Z]{2,6}$'),
  name        text not null,
  secret      text not null check (length(secret) >= 40),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.school_doors enable row level security;   -- no policies: service role only
revoke all on public.school_doors from anon, authenticated;

create table if not exists public.school_learner_links (
  id           uuid primary key default gen_random_uuid(),
  door_id      uuid not null references public.school_doors(id) on delete cascade,
  learner_ref  text not null check (learner_ref ~ '^[A-Z2-9]{8}$'),
  parent_id    uuid not null references auth.users(id) on delete cascade,
  child_id     uuid not null references public.children(id) on delete cascade,
  linked_at    timestamptz not null default now(),
  unique (door_id, learner_ref),
  unique (door_id, child_id)
);
create index if not exists idx_school_learner_links_child on public.school_learner_links(child_id);
alter table public.school_learner_links enable row level security;
drop policy if exists "Parents read their children's school links" on public.school_learner_links;
create policy "Parents read their children's school links" on public.school_learner_links
  for select using (parent_id = auth.uid());

create table if not exists public.school_practice (
  id            uuid primary key default gen_random_uuid(),
  door_id       uuid not null references public.school_doors(id) on delete cascade,
  practice_ref  text not null check (practice_ref ~ '^[a-f0-9-]{36}$'),
  title         text not null check (length(trim(title)) between 1 and 120),
  skill_ids     text[] not null check (cardinality(skill_ids) between 1 and 20),
  learner_refs  text[] not null check (cardinality(learner_refs) between 1 and 300),
  due_on        date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (door_id, practice_ref)
);
create index if not exists idx_school_practice_refs on public.school_practice using gin (learner_refs);
alter table public.school_practice enable row level security;   -- read through my_school_practice()
revoke all on public.school_practice from anon, authenticated;

create table if not exists public.school_link_attempts (
  id         bigserial primary key,
  parent_id  uuid not null,
  ok         boolean not null,
  at         timestamptz not null default now()
);
create index if not exists idx_school_link_attempts on public.school_link_attempts(parent_id, at);
alter table public.school_link_attempts enable row level security;
revoke all on public.school_link_attempts from anon, authenticated;

-- The check on a link code: four characters from the door's secret.
-- Must match Tuta's horebLinkCheck() and src/school/schoolDoor.js linkCheck().
create or replace function public.school_link_check(p_secret text, p_door text, p_ref text)
returns text language sql immutable set search_path = '' as $$
  select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', (get_byte(h, i) % 31) + 1, 1), '' order by i)
    from (select extensions.hmac(convert_to('link:' || p_door || ':' || p_ref, 'UTF8'), convert_to(p_secret, 'UTF8'), 'sha256') as h) x,
         generate_series(0, 3) as i;
$$;
revoke all on function public.school_link_check(text, text, text) from public, anon, authenticated;

-- Made by the owner in the SQL editor; returns the secret once.
create or replace function public.create_school_door(p_code text, p_name text)
returns text language plpgsql security definer set search_path = '' as $$
declare v_secret text := encode(extensions.gen_random_bytes(32), 'hex');
begin
  insert into public.school_doors (code, name, secret) values (upper(trim(p_code)), trim(p_name), v_secret);
  return v_secret;
end;
$$;
revoke all on function public.create_school_door(text, text) from public, anon, authenticated;

-- A parent links one of their children with the code on the school's slip.
create or replace function public.link_school_learner(p_child uuid, p_code text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  v_door public.school_doors%rowtype;
  v_ref text; v_chk text; v_tries int;
begin
  if auth.uid() is null then return jsonb_build_object('success', false, 'error', 'Sign in first.'); end if;
  if not exists (select 1 from public.children c where c.id = p_child and c.parent_id = auth.uid()) then
    return jsonb_build_object('success', false, 'error', 'Pick one of your own children.');
  end if;
  select count(*) into v_tries from public.school_link_attempts a where a.parent_id = auth.uid() and a.at > now() - interval '1 hour' and not a.ok;
  if v_tries >= 10 then return jsonb_build_object('success', false, 'error', 'Too many tries. Wait an hour, or ask the school for the slip again.'); end if;
  -- DOOR (2 to 6 letters) + REF (8) + CHECK (4), dashes optional.
  if length(v_code) < 14 or length(v_code) > 18 then
    insert into public.school_link_attempts (parent_id, ok) values (auth.uid(), false);
    return jsonb_build_object('success', false, 'error', 'That code is not complete. It looks like WSL-K7QM2XPA-H3RT.');
  end if;
  v_chk := right(v_code, 4); v_ref := left(right(v_code, 12), 8);
  select * into v_door from public.school_doors d where d.code = left(v_code, length(v_code) - 12) and d.active;
  if v_door.id is null or public.school_link_check(v_door.secret, v_door.code, v_ref) <> v_chk then
    insert into public.school_link_attempts (parent_id, ok) values (auth.uid(), false);
    return jsonb_build_object('success', false, 'error', 'That code does not match. Check it against the slip from the school.');
  end if;
  insert into public.school_link_attempts (parent_id, ok) values (auth.uid(), true);
  -- One child per learner reference, one reference per child at a school: the latest link wins.
  delete from public.school_learner_links l where l.door_id = v_door.id and (l.learner_ref = v_ref or l.child_id = p_child);
  insert into public.school_learner_links (door_id, learner_ref, parent_id, child_id) values (v_door.id, v_ref, auth.uid(), p_child);
  return jsonb_build_object('success', true, 'school', v_door.name);
end;
$$;
revoke all on function public.link_school_learner(uuid, text) from public, anon;
grant execute on function public.link_school_learner(uuid, text) to authenticated;

create or replace function public.unlink_school_learner(p_child uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  delete from public.school_learner_links l where l.child_id = p_child and l.parent_id = auth.uid();
  return jsonb_build_object('success', true);
end;
$$;
revoke all on function public.unlink_school_learner(uuid) from public, anon;
grant execute on function public.unlink_school_learner(uuid) to authenticated;

-- The school's practice for one of the caller's children (the same shape as assignments).
create or replace function public.my_school_practice(p_child uuid)
returns table (id text, title text, skill_ids text[], due_on date, school text)
language sql stable security definer set search_path = '' as $$
  select 'school:' || p.practice_ref, p.title, p.skill_ids, p.due_on, d.name
    from public.school_learner_links l
    join public.school_doors d on d.id = l.door_id and d.active
    join public.school_practice p on p.door_id = l.door_id and l.learner_ref = any (p.learner_refs)
   where l.child_id = p_child and l.parent_id = auth.uid()
     and (p.due_on is null or p.due_on > current_date - 60)
   order by p.due_on nulls last, p.created_at desc
   limit 20;
$$;
revoke all on function public.my_school_practice(uuid) from public, anon;
grant execute on function public.my_school_practice(uuid) to authenticated;

comment on table public.school_doors is 'One per school using Tuta. Its secret signs the school-practice edge function and checks link codes. Service role only.';
comment on table public.school_learner_links is 'A parent''s child linked to a learner reference at a school (consent: the parent typed the slip''s code).';
comment on table public.school_practice is 'HOREB practice a school set from its exam results: skills and learner references only, no names.';
