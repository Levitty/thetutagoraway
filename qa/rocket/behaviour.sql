\set ON_ERROR_STOP 0
-- users: parent1 (two kids), parent2, teacher, stranger, admin
insert into auth.users (id, email) values
 ('11111111-1111-4111-8111-111111111111','p1@example.test'),
 ('22222222-2222-4222-8222-222222222222','p2@example.test'),
 ('33333333-3333-4333-8333-333333333333','t@example.test'),
 ('44444444-4444-4444-8444-444444444444','x@example.test'),
 ('55555555-5555-4555-8555-555555555555','mutualevy@gmail.com') on conflict do nothing;
insert into children (id, parent_id, name, grade) values
 ('aaaaaaaa-0000-4000-8000-000000000001','11111111-1111-4111-8111-111111111111','Example Kid One','Grade 7'),
 ('aaaaaaaa-0000-4000-8000-000000000002','22222222-2222-4222-8222-222222222222','Example Kid Two','Grade 8') on conflict do nothing;
insert into ai_tutor_progress (user_id, profile_key, progress) values
 ('11111111-1111-4111-8111-111111111111','11111111-1111-4111-8111-111111111111_caaaaaaaa-0000-4000-8000-000000000001',
  '{"skills":{"G6_MEAN":{"mastered":true,"masteredAt":"2030-01-01T00:00:00Z"},"G5_CAPACITY":{"mastered":true,"masteredAt":"2020-01-01T00:00:00Z"},"G4_ADD":{"mastered":true,"masteredAt":"2030-01-01T00:00:00Z"}}}') on conflict do nothing;

-- organiser sets up
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"55555555-5555-4555-8555-555555555555","email":"mutualevy@gmail.com"}', false);
select rocket_add_school('7c0c0e2a-0000-4000-8000-000000002026', 'Example School') as school \gset
select rocket_add_staff(:'school', 't@example.test');
select id as team, join_code as code from rocket_create_team(:'school', 'Team Example') \gset
\echo code :code

-- parent1 joins without consent: refused
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","email":"p1@example.test"}', false);
select rocket_join_team(:'code', 'aaaaaaaa-0000-4000-8000-000000000001', 7, false) as expect_refused;
-- someone else's child: refused
select rocket_join_team(:'code', 'aaaaaaaa-0000-4000-8000-000000000002', 7, true) as expect_refused;
-- grade 5: refused
select rocket_join_team(:'code', 'aaaaaaaa-0000-4000-8000-000000000001', 5, true) as expect_refused;
select rocket_join_team(:'code', 'aaaaaaaa-0000-4000-8000-000000000001', 7, true) as joined;
select label, first_name, consent_version from rocket_members;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","email":"p2@example.test"}', false);
select rocket_join_team(lower(:'code'), 'aaaaaaaa-0000-4000-8000-000000000002', 8, true) as joined2;
-- third seat: parent1 own account
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","email":"p1@example.test"}', false);
select rocket_join_team(:'code', null, 8, true) as expect_full;

-- parent1 logs a test; over-pressure refused by check
insert into rocket_log (team_id, level, step, tested_on, what_changed, result, learned, created_by, pressure_bar)
 values (:'team', 1, 1, '2026-12-01', 'x', 'y', 'z', '11111111-1111-4111-8111-111111111111', 6) ;
insert into rocket_log (team_id, level, step, tested_on, what_changed, result, learned, created_by, pressure_bar)
 values (:'team', 1, 1, '2026-12-01', 'measured', 'held 1500 ml', 'label right', '11111111-1111-4111-8111-111111111111', 0);
-- parent1 cannot write a HOREB message
insert into rocket_messages (team_id, level, role, kind, body) values (:'team', 1, 'horeb', 'reply', 'fake') ;
select count(*) as p1_sees_log from rocket_log;
select * from rocket_team_maths(:'team', array['G6_MEAN','G5_CAPACITY']);
select * from rocket_team_spend(:'team');

-- stranger sees nothing, cannot join-read
select set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-8444-444444444444","email":"x@example.test"}', false);
select (select count(*) from rocket_teams) teams, (select count(*) from rocket_members) members, (select count(*) from rocket_log) log;
select * from rocket_team_maths(:'team', array['G6_MEAN']) ;
select rocket_open_level(:'team', 3) as expect_refused;

-- teacher sees the team and opens level 2
select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","email":"t@example.test"}', false);
select (select count(*) from rocket_teams) teams, (select count(*) from rocket_members) members, (select count(*) from rocket_log) log;
select rocket_open_level(:'team', 2);
select opened_level from rocket_teams;
-- teacher cannot request deletion for a child
select id as m1 from rocket_members where label = 'A' \gset
select rocket_request_deletion(:'m1', 'no') as expect_refused;

-- parent1 asks for deletion; organiser erases
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","email":"p1@example.test"}', false);
update rocket_log set member_label = 'A';
select rocket_request_deletion(:'m1', 'after the challenge');
select set_config('request.jwt.claims', '{"sub":"55555555-5555-4555-8555-555555555555","email":"mutualevy@gmail.com"}', false);
select label, deletion_requested_at is not null as asked from rocket_members order by label;
select rocket_erase_member(:'m1');
select label from rocket_members;
select what_changed, result from rocket_log;
reset role;
