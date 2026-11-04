// ============================================================================
// THE ROCKET CHALLENGE'S DATA, from Supabase.
//
// Every read goes through row-level security (supabase/migrations/
// 20261103_rocket_challenge.sql): a family sees its own team, a teacher the
// teams of their school, the organiser everything. The chat is written only by
// the rocket-guide edge function. Same shape as example.js.
// ============================================================================
import { supabase } from '../supabase.js';
import { allChallengeSkills } from './levels.js';

const must = ({ data, error }) => { if (error) throw new Error(error.message); return data; };

const friendly = async (error) => {
  let msg = error?.message || 'Something went wrong';
  try { const j = await error.context?.json(); if (j?.error) msg = j.error; } catch { /* no body */ }
  if (/Failed to send|Failed to fetch|non-2xx|FunctionsFetchError/i.test(msg)) msg = 'HOREB could not be reached. Check the connection and try again.';
  return msg;
};

export const rocketApi = ({ userId, isAdmin = false }) => ({
  isExample: false,
  me: { id: userId, isAdmin },

  async load() {
    const [challenges, teams, staff, children] = await Promise.all([
      supabase.from('rocket_challenges').select('*').order('created_at', { ascending: false }).then(must),
      supabase.from('rocket_teams').select('*').order('name').then(must),
      supabase.from('rocket_school_staff').select('school_id').eq('user_id', userId).then(must),
      supabase.from('children').select('id, name, grade').eq('parent_id', userId).then(({ data }) => data || []),
    ]);
    const ids = teams.map((t) => t.id);
    const empty = Promise.resolve([]);
    const [schools, members, log, messages, flights] = await Promise.all([
      supabase.from('rocket_schools').select('*').order('name').then(must),
      ids.length ? supabase.from('rocket_members').select('*').in('team_id', ids).order('label').then(must) : empty,
      ids.length ? supabase.from('rocket_log').select('*').in('team_id', ids).order('created_at').then(must) : empty,
      ids.length ? supabase.from('rocket_messages').select('id, team_id, level, step, role, kind, author_label, body, created_at').in('team_id', ids).order('created_at').limit(5000).then(must) : empty,
      ids.length ? supabase.from('rocket_flights').select('*').in('team_id', ids).then(must) : empty,
    ]);
    const skills = allChallengeSkills();
    const extra = await Promise.all(teams.map(async (t) => {
      const [maths, spend] = await Promise.all([
        supabase.rpc('rocket_team_maths', { p_team: t.id, p_skills: skills }).then(({ data }) => data || []),
        supabase.rpc('rocket_team_spend', { p_team: t.id }).then(({ data }) => (data && data[0]) || null),
      ]);
      return { maths, spend };
    }));
    return {
      challenge: challenges[0] || null,
      schools,
      staffSchoolIds: staff.map((s) => s.school_id),
      children,
      teams: teams.map((t, i) => ({
        ...t,
        school: schools.find((s) => s.id === t.school_id) || null,
        members: members.filter((m) => m.team_id === t.id),
        log: log.filter((e) => e.team_id === t.id),
        messages: messages.filter((m) => m.team_id === t.id),
        flight: flights.find((f) => f.team_id === t.id) || null,
        ...extra[i],
      })),
    };
  },

  async send(teamId, body) {
    const { data, error } = await supabase.functions.invoke('rocket-guide', { body: { team_id: teamId, ...body } });
    if (error) throw new Error(await friendly(error));
    return data;
  },

  async addLog(teamId, entry, file = null) {
    let photo_path = null;
    if (file) {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5);
      photo_path = `${teamId}/${Date.now()}.${ext}`;
      must(await supabase.storage.from('rocket-photos').upload(photo_path, file, { contentType: file.type }));
    }
    return must(await supabase.from('rocket_log')
      .insert({ ...entry, team_id: teamId, created_by: userId, photo_path })
      .select('*').single());
  },

  async photoUrl(path) {
    if (!path) return null;
    const { data } = await supabase.storage.from('rocket-photos').createSignedUrl(path, 3600);
    return data?.signedUrl || null;
  },

  async openLevel(teamId, level) { must(await supabase.rpc('rocket_open_level', { p_team: teamId, p_level: level })); },
  async requestDeletion(memberId, note) { must(await supabase.rpc('rocket_request_deletion', { p_member: memberId, p_note: note })); },
  async join(code, childId, grade, consent) {
    return must(await supabase.rpc('rocket_join_team', { p_code: code, p_child: childId, p_grade: grade, p_consent: consent }));
  },
  async saveSettings(patch, challengeId) { must(await supabase.from('rocket_challenges').update(patch).eq('id', challengeId)); },
  async recordFlight(teamId, f) {
    must(await supabase.from('rocket_flights').upsert({ team_id: teamId, ...f, recorded_by: userId, recorded_at: new Date().toISOString() }));
  },
  async createTeam({ challengeId, schoolName, schoolId, teamName, teacherEmail }) {
    let sid = schoolId;
    if (!sid) sid = must(await supabase.rpc('rocket_add_school', { p_challenge: challengeId, p_name: schoolName }));
    let teacher = null;
    if (teacherEmail) teacher = must(await supabase.rpc('rocket_add_staff', { p_school: sid, p_email: teacherEmail }));
    const rows = must(await supabase.rpc('rocket_create_team', { p_school: sid, p_name: teamName, p_teacher: teacher }));
    return rows[0];
  },
});

// Is this account on a team? Cheap, and silent if the tables do not exist yet
// (the migration has not been run): the learner home simply shows nothing.
export const rocketTeamsFor = async (userId) => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase.from('rocket_members').select('team_id, child_id, label').eq('account_id', userId);
    if (error) return [];
    return data || [];
  } catch { return []; }
};
