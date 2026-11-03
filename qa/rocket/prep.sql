alter table storage.buckets add column if not exists public boolean default false;
grant usage on schema public, auth, storage to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
