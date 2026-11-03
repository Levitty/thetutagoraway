// ============================================================================
// WHERE A TEAM IS, AND WHAT HOREB MAY HELP WITH NEXT.
//
// The rule from the outline: "a team must record each test in its design log
// before HOREB helps with the next step". So a team's place is never stored:
// it is worked out here from its log, by one function the screens, the edge
// function and the tests all share.
//
//   - A step is done when the log has a test for it.
//   - The current step is the first step of the current level not yet done.
//   - A level opens when every step of the level before it is done, or when
//     the team's teacher or the organiser opens it (a lab day, for example).
//   - HOREB helps with the current step only. Asking about a later one gets
//     "log your test first".
//
// Pure, no imports beyond the level data.
// ============================================================================
import { LEVELS, PRESSURE_MAX_BAR, JUDGING, allChallengeSkills } from './levels.js';

const doneSet = (entries, level) => new Set(
  (entries || []).filter((e) => Number(e.level) === level && e.step != null).map((e) => Number(e.step)),
);

/**
 * @param {Array<{level:number, step:number}>} entries  the team's design log
 * @param {{ openedLevel?: number }} [team]            teacher/organiser override
 */
export const teamProgress = (entries = [], team = {}) => {
  const levels = LEVELS.map((l) => {
    const done = doneSet(entries, l.n);
    const stepsDone = l.steps.filter((s) => done.has(s.n)).length;
    return { n: l.n, stepsDone, total: l.steps.length, complete: stepsDone === l.steps.length };
  });
  const opened = Math.max(1, Math.min(LEVELS.length, Number(team.openedLevel) || 1));
  // Level n is open if level n-1 is complete or the override reaches it.
  let open = 1;
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i - 1].complete || levels[i].n <= opened) open = levels[i].n; else break;
  }
  for (const l of levels) l.open = l.n <= open;
  // Current level: the first open level not complete, else the last one.
  const cur = levels.find((l) => l.open && !l.complete) || levels[levels.length - 1];
  const def = LEVELS.find((l) => l.n === cur.n);
  const done = doneSet(entries, cur.n);
  const step = def.steps.find((s) => !done.has(s.n))?.n ?? null;
  const finished = levels.every((l) => l.complete);
  return { levels, level: cur.n, step, finished };
};

/** The step of `level` HOREB may help with now, or null if the level is closed or done. */
export const helpableStep = (progress, level) => {
  const l = progress.levels.find((x) => x.n === Number(level));
  if (!l || !l.open) return null;
  if (l.n === progress.level) return progress.step;
  return null; // a completed earlier level: the team may read back, not ask for more
};

/**
 * May HOREB help this team with (level, step)? Returns { ok, reason }.
 * reason: 'closed' (level not open) | 'log-first' (an earlier step has no test) |
 *         'done' (this step is already logged; the next one is where help is).
 */
export const mayHelp = (progress, level, step) => {
  const l = progress.levels.find((x) => x.n === Number(level));
  if (!l || !l.open) return { ok: false, reason: 'closed' };
  if (l.complete) return { ok: true, reason: 'review' };
  const want = Number(step) || progress.step;
  if (Number(level) !== progress.level) return { ok: true, reason: 'review' };
  if (want > progress.step) return { ok: false, reason: 'log-first' };
  return { ok: true, reason: want < progress.step ? 'review' : 'current' };
};

// ---------------------------------------------------------------- the log
export const LOG_FIELDS = [
  { key: 'tested_on', label: 'Date', type: 'date', required: true },
  { key: 'what_changed', label: 'What we changed', type: 'text', required: true },
  { key: 'water_ml', label: 'Water (ml)', type: 'number', min: 0, max: 5000 },
  { key: 'pressure_bar', label: 'Pressure on the gauge (bar)', type: 'number', min: 0, max: PRESSURE_MAX_BAR, step: 0.5 },
  { key: 'fins_notes', label: 'Fins', type: 'text' },
  { key: 'nose_notes', label: 'Nose cone', type: 'text' },
  { key: 'weight_notes', label: 'Weight', type: 'text' },
  { key: 'result', label: 'What happened (what we measured)', type: 'text', required: true },
  { key: 'learned', label: 'What we learned', type: 'text', required: true },
];

/** @returns {{ ok: boolean, errors: Record<string,string> }} */
export const validateEntry = (e = {}) => {
  const errors = {};
  for (const f of LOG_FIELDS) {
    const v = e[f.key];
    const empty = v == null || String(v).trim() === '';
    if (f.required && empty) { errors[f.key] = 'Fill this in.'; continue; }
    if (f.type === 'number' && !empty) {
      const n = Number(v);
      if (!Number.isFinite(n) || n < f.min) errors[f.key] = 'Write a number.';
      else if (f.key === 'pressure_bar' && n > PRESSURE_MAX_BAR) errors[f.key] = `Never above ${PRESSURE_MAX_BAR} bar. Check the gauge with your adult.`;
      else if (n > f.max) errors[f.key] = `That is more than ${f.max}. Check the number.`;
    }
  }
  if (!Number(e.level) || e.step == null) errors.step = 'Choose the step this test is for.';
  return { ok: Object.keys(errors).length === 0, errors };
};

// How complete a log is, as an input for the judges (not a mark). Counts tests,
// and how many of them have every field the outline asks for.
export const logSummary = (entries = []) => {
  const want = ['tested_on', 'what_changed', 'result', 'learned'];
  const full = entries.filter((e) => want.every((k) => String(e[k] ?? '').trim()) && (e.water_ml != null || e.pressure_bar != null));
  return {
    tests: entries.length,
    complete: full.length,
    withPhoto: entries.filter((e) => e.photo_path).length,
    levelsLogged: new Set(entries.map((e) => Number(e.level))).size,
  };
};

// ------------------------------------------------------------- the maths
/**
 * Linked skills a learner mastered on HOREB since the challenge started.
 * `skills` is HOREB's progress.skills; `since` an ISO date (or null: count
 * every mastered linked skill, and say so on screen).
 */
export const mathsMastered = (skills = {}, since = null) => {
  const ids = allChallengeSkills();
  const t0 = since ? Date.parse(since) : null;
  return ids.filter((id) => {
    const s = skills[id];
    if (!s?.mastered) return false;
    if (t0 == null) return true;
    return s.masteredAt && Date.parse(s.masteredAt) >= t0;
  });
};

/**
 * The judging inputs for one team, never a total and never a rank.
 * `flight` is what the organiser records on launch day.
 */
export const judgingInputs = ({ entries = [], members = [], flight = null }) => ({
  weights: JUDGING,
  flight: flight ? {
    height_m: flight.height_m ?? null,
    method: flight.method || null,
    landing: flight.landing || null,
  } : null,
  log: logSummary(entries),
  maths: members.map((m) => ({ member: m.label, mastered: m.mastered || [] })),
});

export default { teamProgress, helpableStep, mayHelp, validateEntry, logSummary, mathsMastered, judgingInputs, LOG_FIELDS };
