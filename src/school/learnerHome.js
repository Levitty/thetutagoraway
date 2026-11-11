// ============================================================================
// THE LEARNER HOME (11 Nov 2026): one page per school learner with all their
// homework from the school, what they have got and what to practise next, and
// a streak of days with homework done. The owner: "build the learner home for
// school learners".
//
// Two doors, one answer (the same payload, drawn by learnerHomeView.js):
//   { action: 'learner_home', link: 'WSL-K7QM2XPA-H3RT' }
//        no account: the link code Tuta already prints and sends. The check is
//        verified with the door's secret; ten wrong checks an hour on one learner
//        reference, and a loose 200 an hour per network address (shared on Safaricom).
//   { action: 'learner_home', child: '<uuid>' }   with the parent's sign-in
//        the family app: a child the parent linked (school_learner_links).
//
// Only this learner's sittings, at this school, are read. HOREB has no names,
// so the payload has none: titles the teacher typed, the school's name, counts,
// dates and curriculum skill names.
//
// deps: { store, now: () => ms, ipKey: string (a hash of the address), userId: async () => uuid|null }
// store: homeDoor(code), homeSittings(doorId, learnerRef) -> [{ sitting, homework }],
//        homeTries(key, sinceIso) -> wrong tries, homeTry(key, ok, atIso), childLink(userId, childId) -> { door, learner_ref } | null
// ============================================================================
import { parseLinkCode, linkCheck } from './schoolDoor.js';
import { SKILLS_G5, SUBSTRANDS } from '../ai-tutor/content/curriculumMap.g5.js';

export const HOME_TRIES_PER_HOUR = 10;        // wrong checks on one door and learner reference
export const HOME_TRIES_PER_IP_HOUR = 200;    // wrong codes from one network address

/** The key a learner's wrong tries are counted under: a hash, so the table holds no reference. */
const refKeyOf = async (door, ref) => {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`learner-home-ref:${door}:${ref}`));
  return 'r' + Array.from(new Uint8Array(d)).slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NAIROBI = 3 * 3600 * 1000;   // East Africa Time, no daylight saving
export const dayOf = (ms) => new Date(ms + NAIROBI).toISOString().slice(0, 10);
const dayMs = (d) => Date.parse(d + 'T00:00:00Z');
const addDays = (d, n) => new Date(dayMs(d) + n * 86400000).toISOString().slice(0, 10);

const ok = (body) => ({ status: 200, body: { success: true, ...body } });
const no = (status, error) => ({ status, body: { success: false, error } });
const WRONG = 'This link is not right. Ask the school to send it again.';

const sameText = (a, b) => {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};

// What counts as "got it" from homework alone: at least four answers on the skill, and of the
// latest five, four or more right. Anything answered but not yet there is "practise next".
export const MASTERY_MIN = 4;
const LATEST = 5;

/** Skill name and topic in the curriculum's own words. */
const skillOf = (code) => {
  const s = SKILLS_G5[code];
  return { code, name: s?.name || code, topic: SUBSTRANDS[s?.sub]?.name || '' };
};

/**
 * The home, from this learner's sittings: [{ sitting, homework }] where homework is
 * { title, mode, due_on, created_at } and sitting is a school_homework_sittings row.
 */
export function buildHome(school, rows, now) {
  const today = dayOf(now);
  const todo = []; const done = [];
  const bySkill = new Map(); const days = new Set(); const windows = [];
  for (const { sitting: s, homework: h } of rows || []) {
    const items = s.items || []; const answers = s.answers || [];
    const right = answers.filter(a => a.correct).length;
    const base = { title: h.title, due_on: h.due_on || null, set_on: h.created_at ? dayOf(Date.parse(h.created_at)) : null, total: items.length };
    for (const a of answers) {
      if (a.at) days.add(dayOf(Date.parse(a.at)));
      const code = items[a.n - 1]?.cskill; if (!code) continue;
      if (!bySkill.has(code)) bySkill.set(code, []);
      bySkill.get(code).push({ at: a.at || '', correct: !!a.correct });
    }
    if (h.mode === 'paper') {
      // HOREB does not see paper answers (the teacher marks them in Tuta): shown only while it is due.
      if (!h.due_on || h.due_on >= today) todo.push({ ...base, status: 'paper', answered: 0 });
      continue;
    }
    if (s.status === 'submitted') { done.push({ ...base, status: 'submitted', right, answered: answers.length, finished_on: s.finished_at ? dayOf(Date.parse(s.finished_at)) : null }); continue; }
    // Open homework long past its date moves to the done list as not handed in.
    if (h.due_on && h.due_on < addDays(today, -14)) { done.push({ ...base, status: 'missed', answered: answers.length }); continue; }
    todo.push({ ...base, status: s.status, answered: answers.length, code: s.code, ...(s.status === 'locked' ? { lock_question: s.lock_question || answers.length + 1 } : {}) });
  }
  for (const { sitting: s, homework: h } of rows || []) {
    // When this homework could be done online: from the day it was set to its due date, or until it was handed in or locked.
    if (h.mode === 'paper' || !h.created_at) continue;
    const ended = s.finished_at || s.locked_at;
    windows.push({ from: dayOf(Date.parse(h.created_at)), to: [h.due_on, ended ? dayOf(Date.parse(ended)) : null].filter(Boolean).sort()[0] || today });
  }
  // What to do first: something started, then by due date (soonest, overdue first), undated last; locked and paper after.
  const rank = (t) => t.status === 'started' ? 0 : t.status === 'issued' ? 1 : t.status === 'locked' ? 2 : 3;
  todo.sort((a, b) => rank(a) - rank(b) || (a.due_on || '9999').localeCompare(b.due_on || '9999') || (a.set_on || '').localeCompare(b.set_on || ''));
  done.sort((a, b) => (b.finished_on || b.due_on || '').localeCompare(a.finished_on || a.due_on || ''));

  const mastered = []; const practise = [];
  for (const [code, list] of bySkill) {
    list.sort((a, b) => a.at.localeCompare(b.at));
    const latest = list.slice(-LATEST); const r = latest.filter(x => x.correct).length;
    if (list.length >= MASTERY_MIN && r >= 4) mastered.push({ ...skillOf(code), last: list[list.length - 1].at });
    else practise.push({ ...skillOf(code), right: list.filter(x => x.correct).length, of: list.length, last: list[list.length - 1].at });
  }
  mastered.sort((a, b) => b.last.localeCompare(a.last));
  // Practise next: the weakest first (share right), then the most recent.
  practise.sort((a, b) => a.right / a.of - b.right / b.of || b.last.localeCompare(a.last));

  // Streak: days with homework done, counted back from today. A day when nothing was open for this learner
  // (a weekend, a holiday, the teacher set nothing) is skipped, never a break. Only a day when homework was
  // open and none was done breaks it; today is not over, so today never breaks it.
  const open = (x) => windows.some(w => w.from <= x && x <= w.to);
  const first = [...windows.map(w => w.from), ...days].sort()[0] || today;
  let streak = 0;
  for (let d = today; d >= first; d = addDays(d, -1)) {
    if (days.has(d)) streak++;
    else if (open(d) && d !== today) break;
  }
  const week = Array.from({ length: 7 }, (_, i) => { const x = addDays(today, i - 6); return { day: x, done: days.has(x), open: open(x) }; });

  const strip = ({ last, ...x }) => x;
  return {
    school, today, todo, done: done.slice(0, 12),
    mastered: mastered.slice(0, 8).map(strip), practise: practise.slice(0, 3).map(strip),
    streak: { days: streak, today: days.has(today), open_today: open(today), week },
  };
}

export async function learnerHome(p, deps) {
  const { store } = deps;
  // The family app: the parent's sign-in, one of their linked children.
  if (p.child !== undefined) {
    if (!UUID.test(String(p.child))) return no(400, 'Which child?');
    const uid = deps.userId ? await deps.userId() : null;
    if (!uid) return no(401, 'Sign in first.');
    const link = await store.childLink(uid, String(p.child));
    if (!link) return ok({ linked: false });
    return ok({ linked: true, home: buildHome(link.door.name, await store.homeSittings(link.door.id, link.learner_ref), deps.now()) });
  }
  // No account: the link code is the key.
  // Two limits on wrong codes. Per learner: ten wrong checks an hour on one door and reference, which is what
  // stops anyone guessing one learner's check. Per network address: a loose ceiling against wide scanning,
  // loose because many phones share one address (Safaricom).
  const ipKey = 'i' + String(deps.ipKey || 'unknown').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
  const since = new Date(deps.now() - 3600 * 1000).toISOString();
  const at = new Date(deps.now()).toISOString();
  const busy = no(429, 'Too many tries. Wait an hour, or ask the school to send the link again.');
  if (await store.homeTries(ipKey, since) >= HOME_TRIES_PER_IP_HOUR) return busy;
  const c = parseLinkCode(p.link);
  if (!c) { await store.homeTry(ipKey, false, at); return no(404, WRONG); }
  const refKey = await refKeyOf(c.door, c.ref);
  if (await store.homeTries(refKey, since) >= HOME_TRIES_PER_HOUR) return busy;
  const door = await store.homeDoor(c.door);
  if (!door || !sameText(await linkCheck(door.secret, door.code, c.ref), c.check)) {
    await store.homeTry(ipKey, false, at);
    await store.homeTry(refKey, false, at);
    return no(404, WRONG);
  }
  return ok({ linked: true, home: buildHome(door.name, await store.homeSittings(door.id, c.ref), deps.now()) });
}
