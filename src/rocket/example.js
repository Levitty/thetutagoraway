// ============================================================================
// AN EXAMPLE CHALLENGE TO DEMONSTRATE WITH.   EXAMPLE DATA, INVENTED NAMES.
//
// Same rule as src/ai-tutor/demoClass.js: not rows in the database. Invented
// children sitting in production tables beside real ones can never be fully
// taken back, so the example challenge is assembled in the browser, never
// written anywhere, and disappears when the tab closes. Open it with
// /rocket?demo=1 (add &as=parent, &as=teacher or &as=organiser).
//
// What is NOT invented is the behaviour: the gate, the guard and HOREB's
// replies all run the real code (src/rocket/turn.js, with no model, so the
// replies are the authored questions and hints). Every name, school and
// number here is made up and the screen says EXAMPLE DATA throughout.
// ============================================================================
import { runTurn } from './turn.js';
import { screen } from '../ai/safeguarding.js';

const day = (d, h = 16) => new Date(Date.UTC(2026, 11, d, h, 0, 0)).toISOString();

export const EXAMPLE_ME = { parent: 'example-parent-1', teacher: 'example-teacher-1', organiser: 'example-organiser' };

const seed = () => {
  const challenge = {
    id: 'example-challenge', title: 'HOREB Rocket Challenge (example)', status: 'open', is_example: true,
    lab_name: null, starts_on: null, launch_on: null, fee_note: null, prizes_note: null,
    budget_usd_per_learner: 10, daily_messages_per_team: 60,
  };
  const schools = [
    { id: 'ex-s1', name: 'Example Hill School' },
    { id: 'ex-s2', name: 'Example Valley Academy' },
  ];
  const member = (team, label, first, grade, acct, consent) => ({
    id: `${team}-${label}`, team_id: team, label, account_id: acct, child_id: `${team}-${label}-child`,
    first_name: first, grade, consent_at: day(consent, 9), consent_version: 'rocket-2026-v1', deletion_requested_at: null,
  });
  const teams = [
    { id: 'ex-t1', school_id: 'ex-s1', name: 'Team Kestrel', join_code: 'REX4K2', teacher_id: EXAMPLE_ME.teacher, opened_level: 1, created_at: day(1, 8) },
    { id: 'ex-t2', school_id: 'ex-s1', name: 'Team Baobab', join_code: 'REX7B3', teacher_id: EXAMPLE_ME.teacher, opened_level: 1, created_at: day(1, 8) },
    { id: 'ex-t3', school_id: 'ex-s2', name: 'Team Sunbird', join_code: 'REX9S5', teacher_id: 'example-teacher-2', opened_level: 1, created_at: day(1, 8) },
  ];
  const members = [
    member('ex-t1', 'A', 'Zawadi', 7, EXAMPLE_ME.parent, 1),
    member('ex-t1', 'B', 'Jabari', 8, 'example-parent-2', 1),
    member('ex-t2', 'A', 'Neema', 6, 'example-parent-3', 2),
    member('ex-t2', 'B', 'Tumaini', 6, 'example-parent-4', 2),
    member('ex-t3', 'A', 'Imani', 9, 'example-parent-5', 1),
    member('ex-t3', 'B', 'Kito', 8, 'example-parent-6', 3),
  ];
  const entry = (team, level, step, d, f) => ({
    id: `${team}-l${level}s${step}-${d}`, team_id: team, level, step, tested_on: day(d).slice(0, 10), created_at: day(d), member_label: 'A', ...f,
  });
  const log = [
    entry('ex-t1', 1, 1, 2, { what_changed: 'Measured the bottle with a kitchen jug', water_ml: null, pressure_bar: null, result: 'The label says 1.5 litres and the jug agreed: 1,500 ml.', learned: '1 litre is 1,000 ml, so 1.5 litres is 1,500 ml.' }),
    entry('ex-t1', 1, 2, 4, { what_changed: 'One quarter water, then one half', water_ml: 375, pressure_bar: 3, result: 'One quarter went about as high as the house. One half barely left the ground.', learned: 'More water is not always higher. We want to try one third next.' }),
    entry('ex-t1', 1, 3, 5, { what_changed: 'First launch with our checklist', water_ml: 500, pressure_bar: 3.5, result: 'Flew straight up for about 3 seconds and landed in the field.', learned: 'The checklist made us slow down. Everyone stood back.' }),
    entry('ex-t2', 1, 1, 3, { what_changed: 'Read the label and checked it', water_ml: null, pressure_bar: null, result: 'Our bottle is 2 litres, 2,000 ml.', learned: 'The jug only goes to 1 litre so we filled it twice.' }),
    entry('ex-t3', 1, 1, 2, { what_changed: 'Measured', result: '1,500 ml', learned: 'The label was right.', water_ml: null, pressure_bar: null }),
    entry('ex-t3', 1, 2, 3, { what_changed: 'One third water', water_ml: 500, pressure_bar: 4, result: 'Good height, wobbled at the top.', learned: 'One third worked better than half for us.' }),
    entry('ex-t3', 1, 3, 4, { what_changed: 'Checklist launch', water_ml: 500, pressure_bar: 4, result: 'Safe launch, about 4 seconds in the air.', learned: 'Goggles fog up, wipe them first.' }),
    entry('ex-t3', 2, 1, 6, { what_changed: 'Three fins, 120 degrees apart', water_ml: 500, pressure_bar: 4, fins_notes: '3 card fins, 8 cm tall', result: 'Much straighter.', learned: '360 divided by 3 is 120.' }),
    entry('ex-t3', 2, 2, 8, { what_changed: 'Cone from a cut bottle top', water_ml: 500, pressure_bar: 4, nose_notes: 'Plastic cone, taped on, centred', result: 'Straight and a bit higher.', learned: 'We measured both sides of the cone to centre it.' }),
    entry('ex-t3', 2, 3, 9, { what_changed: '40 g of clay in the nose', water_ml: 500, pressure_bar: 4, weight_notes: '40 g clay', result: 'Balance point moved 6 cm forward. Straightest flight yet.', learned: 'Weight at the front keeps it pointing up.' }),
  ];
  const msg = (team, level, step, role, kind, body, d, h, author = null) => ({
    id: `${team}-${level}-${d}-${h}-${role}-${kind}`, team_id: team, level, step, role, kind, body, author_label: author, created_at: new Date(Date.UTC(2026, 11, d, h, role === 'team' ? 0 : 1)).toISOString(), cost_usd: 0,
  });
  const messages = [
    msg('ex-t1', 1, 2, 'horeb', 'reply', 'What do you think will happen if you add more water? And if you add less? How could you test it fairly?', 3, 15),
    msg('ex-t1', 1, 2, 'team', 'ask', 'More water means more push so it goes higher', 3, 16, 'A'),
    msg('ex-t1', 1, 2, 'horeb', 'reply', 'That is a good guess to test. If you add water, what else changes about the rocket? Try two amounts, keep the pressure the same, and compare.', 3, 16),
    msg('ex-t1', 1, 2, 'team', 'ask', 'Can we pump it more to make it fair?', 3, 17, 'B'),
    msg('ex-t1', 1, 2, 'horeb', 'safety', 'Here is the rule on pressure: your adult pumps, reads the gauge, and stops at 5 bar or less, every time. A bottle pushed past that can burst and hurt someone. You may test different pressures under the limit. If you change the pressure, what will you keep the same so the test is fair?', 3, 17),
    msg('ex-t1', 1, 2, 'team', 'stuck', 'We are stuck.', 4, 14, 'A'),
    msg('ex-t1', 1, 2, 'horeb', 'hint', 'Pick a few fractions of the bottle to try, and keep everything else the same each time. Try that, then tell me what you found.', 4, 14),
    msg('ex-t1', 2, 1, 'horeb', 'reply', 'Why do you think arrows and darts have feathers or fins at the back? What might fins do for your rocket?', 6, 15),
    msg('ex-t1', 2, 1, 'team', 'ask', 'They stop it spinning around?', 6, 16, 'B'),
    msg('ex-t1', 2, 1, 'horeb', 'reply', 'Yes, they help it keep pointing one way. If one fin is bigger than the others, what might the rocket do in the air?', 6, 16),
    msg('ex-t1', 2, 1, 'team', 'ask', "what's the best fin shape", 6, 17, 'A'),
    msg('ex-t1', 2, 1, 'horeb', 'fallback', 'I will not give you the answer, because finding it is the challenge, and you can do it. Here is a question instead: what have you tried so far, and what happened?', 6, 17),
    msg('ex-t1', 2, 1, 'team', 'ask', 'We cut 3 fins from a cereal box but they are all different sizes', 7, 15, 'B'),
    msg('ex-t1', 2, 1, 'horeb', 'reply', 'Good that you noticed. If one fin is bigger, it catches more air on that side. How could you make sure all three are the same before you glue them?', 7, 15),
    msg('ex-t1', 2, 1, 'team', 'stuck', 'We are stuck.', 7, 16, 'A'),
    msg('ex-t1', 2, 1, 'horeb', 'hint', 'If one fin is bigger than the others, what might the rocket do in the air? Try that, then tell me what you found.', 7, 16),
    msg('ex-t1', 2, 1, 'team', 'stuck', 'We are stuck.', 7, 17, 'A'),
    msg('ex-t1', 2, 1, 'horeb', 'hint', 'Three fins spaced evenly round a circle: how many degrees apart is each one? Try that, then tell me what you found.', 7, 17),
    msg('ex-t1', 2, 1, 'team', 'ask', '360 divided by 3 is 120 so each fin is 120 degrees from the next', 7, 18, 'A'),
    msg('ex-t1', 2, 1, 'horeb', 'reply', 'Yes, 120 degrees. How will you mark those three places on a round bottle? Measure it, fit the fins, launch, and log what happens.', 7, 18),
  ];
  const flights = [];
  // Linked HOREB skills mastered during the challenge, per learner.
  const maths = {
    'ex-t1': [{ label: 'A', mastered: ['G6_CAPACITY', 'G6_FRACTIONS_MUL'] }, { label: 'B', mastered: ['G6_SYMMETRY'] }],
    'ex-t2': [{ label: 'A', mastered: [] }, { label: 'B', mastered: ['G5_CAPACITY'] }],
    'ex-t3': [{ label: 'A', mastered: ['G6_MEAN', 'G6_ANGLE_MEASURE', 'G9_TRIG_INTRO'] }, { label: 'B', mastered: ['G6_SYMMETRY', 'G6_ANGLE_PROPERTIES'] }],
  };
  return { challenge, schools, teams, members, log, messages, flights, maths, staff: [{ school_id: 'ex-s1', user_id: EXAMPLE_ME.teacher }] };
};

let store = null;
const after = (rows) => {
  const last = rows.reduce((m, r) => (r.created_at > m ? r.created_at : m), new Date().toISOString());
  return new Date(Date.parse(last) + 60000).toISOString();
};
const S = () => (store ||= seed());

const teamBundle = (t) => {
  const s = S();
  return {
    ...t,
    school: s.schools.find((x) => x.id === t.school_id),
    members: s.members.filter((m) => m.team_id === t.id),
    log: s.log.filter((e) => e.team_id === t.id),
    messages: s.messages.filter((m) => m.team_id === t.id).sort((a, b) => a.created_at.localeCompare(b.created_at)),
    flight: s.flights.find((f) => f.team_id === t.id) || null,
    maths: s.maths[t.id] || [],
    spend: { spent_usd: 0, cap_usd: 20 },
  };
};

// The same shape rocketData.js returns, so the screens cannot tell them apart
// (except for the EXAMPLE DATA label, which they always show when isExample).
export const exampleApi = (as = 'learner') => {
  const me = as === 'teacher' ? EXAMPLE_ME.teacher : as === 'organiser' ? EXAMPLE_ME.organiser : EXAMPLE_ME.parent;
  const isAdmin = as === 'organiser';
  const turnDb = {
    async getTeam(id) {
      const t = S().teams.find((x) => x.id === id);
      if (!t) return null;
      const b = teamBundle(t);
      return { team: t, members: b.members, challenge: S().challenge, school: b.school };
    },
    async getLog(id) { return S().log.filter((e) => e.team_id === id); },
    async getMessages(id, level) { return teamBundle({ id }).messages.filter((m) => m.level === level); },
    async insertMessage(row) {
      // The example lives in December 2026, so a new message goes after the
      // latest one rather than at today's date.
      const r = { ...row, id: `ex-m${S().messages.length}-${Date.now()}`, created_at: after(S().messages) };
      S().messages.push(r);
      return r;
    },
    async spend() { return 0; },
    async countToday() { return 0; },
    async recordConcern() { /* the example records nothing */ },
  };
  return {
    isExample: true,
    // The example's own clock: its story happens in early December, so "how
    // long since this team was active" is read against 8 Dec, not today.
    now: day(8, 18),
    me: { id: me, isAdmin },
    async load() {
      const s = S();
      const staffSchools = new Set(s.staff.filter((x) => x.user_id === me).map((x) => x.school_id));
      const visible = s.teams.filter((t) => isAdmin
        || s.members.some((m) => m.team_id === t.id && m.account_id === me)
        || t.teacher_id === me || staffSchools.has(t.school_id));
      return { challenge: s.challenge, schools: s.schools, teams: visible.map(teamBundle), children: [], staffSchoolIds: [...staffSchools] };
    },
    async send(teamId, body) {
      const out = await runTurn({ user: { id: me }, body: { team_id: teamId, ...body }, db: turnDb, safeguard: screen });
      if (out.status !== 200) throw new Error(out.body.error);
      return out.body;
    },
    async addLog(teamId, entry) {
      const r = { ...entry, id: `ex-e${Date.now()}`, team_id: teamId, created_at: after(S().log) };
      S().log.push(r);
      return r;
    },
    async openLevel(teamId, level) { const t = S().teams.find((x) => x.id === teamId); if (t) t.opened_level = level; },
    async requestDeletion(memberId, note) { const m = S().members.find((x) => x.id === memberId); if (m) { m.deletion_requested_at = new Date().toISOString(); m.deletion_note = note; } },
    async saveSettings(patch) { Object.assign(S().challenge, patch); },
    async recordFlight(teamId, f) { const s = S(); s.flights = s.flights.filter((x) => x.team_id !== teamId).concat({ team_id: teamId, ...f }); },
    async join() { throw new Error('Joining is switched off in the example.'); },
    async createTeam() { throw new Error('Creating teams is switched off in the example.'); },
    async photoUrl() { return null; },
  };
};

export const resetExample = () => { store = null; };
