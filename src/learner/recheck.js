// ============================================================================
// THE RE-CHECK SCHEDULER (12 Nov 2026, docs/learner-model.md section 2, "Re-checks").
//
// A skill that has met the mastered level is re-checked 2, 4 and 8 weeks after
// it first did (the first never sooner than 14 days). A failed re-check puts it
// back to developing (mastery.js). One that is overdue by more than 4 weeks
// reads "Mastered, due a re-check". mastery.js owns those rules and the dates;
// this file only asks it where each skill stands and says which are due, so the
// schedule can never drift from the state a teacher reads.
//
// Pure: a learner's evidence rows in, a schedule out. Nothing here reads the
// database or the clock (pass `now`), and nothing here marks an answer: a
// re-check answer is an ordinary evidence row, flagged so it can be told apart
// (evidence.js recheckRef / isRecheckRow), and mastery.js judges it from its
// date alone.
//
// Mixing rule (practice and homework alike): re-checks are a small share of the
// items, never more than about 1 in 5 (MAX_SHARE).
// ============================================================================
import { RULES, MASTERED_DUE_WORDS, recheckInfo, skillKeyOf, labelFromCode } from './mastery.js';

export { isRecheckRow, recheckRef } from './evidence.js';

const DAY = 86400000;

/** Re-checks are never more than this share of a session's or a homework's items. */
export const MAX_SHARE = 0.2;
/** A class's homework re-checks a skill when this share of the learners with evidence on it have it due (and at least MIN_LEARNERS). */
export const CLASS_SHARE = 0.25;
export const MIN_LEARNERS = 3;

const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10);

/**
 * Every skill that has a re-check waiting, soonest first by how late it is.
 * @param {object[]} rows  one learner's evidence rows (all skills)
 * @param {object} [o]  { now }
 * @returns {{schedule: object[], backToDeveloping: string[]}}
 *   schedule entry: { key, label, skillIds, week, due (YYYY-MM-DD), status 'upcoming'|'due'|'overdue',
 *                     daysLate, word }
 *   week is 2, 4 or 8: the re-check that is next for this skill.
 *   skillIds are the HOREB practice skill ids the evidence on this skill was logged under (a practice session
 *   serves a question by one of these); empty for a school-only skill.
 */
export function recheckSchedule(rows, { now = Date.now() } = {}) {
  const nowMs = now instanceof Date ? now.getTime() : now;
  const evidence = (rows || []).filter((r) => skillKeyOf(r));
  const difficultyKnown = evidence.some((r) => r.difficulty);
  const bySkill = new Map();
  for (const r of evidence) {
    const k = skillKeyOf(r);
    if (!bySkill.has(k)) bySkill.set(k, []);
    bySkill.get(k).push(r);
  }
  const schedule = [];
  const backToDeveloping = [];
  for (const [key, list] of bySkill) {
    const info = recheckInfo(list, { now: nowMs, difficultyKnown });
    if (info.failed) backToDeveloping.push(key);
    if (info.reached == null || info.pending == null) continue;
    const overdue = nowMs > info.pending + RULES.OVERDUE_DAYS * DAY;
    const due = nowMs > info.pending;
    const skillIds = [...new Set(list.filter((r) => r.skill_id && r.skill_id !== key && r.source !== 'school_homework').map((r) => r.skill_id))];
    if (list.some((r) => r.skill_id === key && (r.source || 'practice') === 'practice')) skillIds.unshift(key);
    schedule.push({
      key, label: labelFromCode(key), skillIds: [...new Set(skillIds)],
      week: RULES.RECHECK_WEEKS[info.passed], due: isoDay(info.pending),
      status: overdue ? 'overdue' : due ? 'due' : 'upcoming',
      daysLate: due ? Math.floor((nowMs - info.pending) / DAY) : 0,
      word: overdue ? MASTERED_DUE_WORDS : null,
    });
  }
  const rank = { overdue: 0, due: 1, upcoming: 2 };
  schedule.sort((a, b) => rank[a.status] - rank[b.status] || a.due.localeCompare(b.due) || a.key.localeCompare(b.key));
  return { schedule, backToDeveloping };
}

/** Just the skills due now (due or overdue), most overdue first. */
export const dueRechecks = (rows, opts) => recheckSchedule(rows, opts).schedule.filter((s) => s.status !== 'upcoming');

/** How many of `total` items may be re-checks: a fifth, rounded down (a session or homework of 4 or fewer has none). */
export const recheckSlots = (total) => Math.floor(Math.max(0, Number(total) || 0) * MAX_SHARE + 1e-9);

/**
 * In an open-ended practice session: should the NEXT item be a re-check?
 * @param {number} position  items served so far in the session (0 for the first)
 * @param {number} served    re-checks served so far
 * @param {boolean} anyDue   whether a re-check is waiting
 * True only while re-checks would stay at or under MAX_SHARE of the items including this one:
 * the first is the 5th item, the next the 10th.
 */
export const shouldServeRecheck = ({ position, served, anyDue }) =>
  !!anyDue && (served + 1) / (position + 1) <= MAX_SHARE + 1e-9;

/** The due skill to serve next: most overdue first, skipping any already served this session or the lesson skill itself. */
export const pickRecheck = (due, { served = [], exclude = [], canServe = () => true } = {}) =>
  (due || []).find((d) => !served.includes(d.key) && !exclude.includes(d.key) && canServe(d)) || null;

/**
 * The class's re-checks for a homework: skills that enough of the class has due.
 * @param {Object<string, object[]>} rowsByLearner  learner reference -> that learner's evidence rows
 * @param {object} [o]  { now, max (how many skills at most; default 2), minShare, minLearners }
 * @returns {{cskill: string, due: number, of: number, overdue: number}[]} most learners first
 */
export function classRechecks(rowsByLearner, { now = Date.now(), max = 2, minShare = CLASS_SHARE, minLearners = MIN_LEARNERS } = {}) {
  const have = new Map();   // key -> learners with evidence on it
  const due = new Map();    // key -> { due, overdue }
  for (const rows of Object.values(rowsByLearner || {})) {
    const keys = new Set((rows || []).map(skillKeyOf).filter(Boolean));
    for (const k of keys) have.set(k, (have.get(k) || 0) + 1);
    for (const s of dueRechecks(rows, { now })) {
      const d = due.get(s.key) || { due: 0, overdue: 0 };
      d.due += 1; if (s.status === 'overdue') d.overdue += 1;
      due.set(s.key, d);
    }
  }
  return [...due.entries()]
    .map(([cskill, d]) => ({ cskill, due: d.due, of: have.get(cskill) || d.due, overdue: d.overdue }))
    .filter((c) => c.due >= minLearners && c.due / c.of >= minShare)
    .sort((a, b) => b.due - a.due || b.overdue - a.overdue || a.cskill.localeCompare(b.cskill))
    .slice(0, Math.max(0, max));
}

export default { MAX_SHARE, recheckSchedule, dueRechecks, recheckSlots, shouldServeRecheck, pickRecheck, classRechecks };
