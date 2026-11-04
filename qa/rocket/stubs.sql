create or replace function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(auth.jwt() ->> 'sub', '')::uuid $$;
do $$ begin if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated; end if; end $$;
create table if not exists public.profiles (id uuid primary key references auth.users(id), full_name text, role text, email text);
create table if not exists public.children (id uuid primary key default gen_random_uuid(), parent_id uuid not null references auth.users(id), name text not null, grade text);
create table if not exists public.ai_tutor_progress (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), progress jsonb not null default '{}', profile_key text unique, learner_id uuid);
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) in ('mutualevy@gmail.com'); $$;
