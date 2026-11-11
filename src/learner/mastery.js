// ============================================================================
// THE FIVE STATES (11 Nov 2026, docs/learner-model.md section 2).
//
// Pure: a learner's evidence rows in, one state per skill out, rolled up to
// outcome and sub-strand. Every state carries the ids of the evidence rows it
// rests on and one plain sentence a teacher can read. Rules a teacher can read
// first; statistics later. No curriculum names live here, only codes.
//
// DRAFT RULES. The CBC teacher reviewer and the psychology graduate sign them
// off (Tuta Workspace/LEARNER_MODEL_RULES_FOR_REVIEW.md). Every number is a
// named constant in RULES below, so a change of mind is one edit and a test.
//
// Words used:
//   a "mark"  is one marked item, one evidence row (a homework answer, a practice
//             answer, one exam question). Its weight is marks / max_marks, else 1 or 0.
//   "help"    is independent === false, or any hint used. An item with help counts
//             toward "emerging" only: it adds nothing toward developing or mastered.
//             independent === null (unknown) with no hints counts as independent.
// ============================================================================

export const STATES = ['not_assessed', 'not_enough', 'emerging', 'developing', 'mastered'];

/** The words teachers and parents see: the same five. */
export const STATE_WORDS = {
  not_assessed: 'Not yet assessed',
  not_enough: 'Not enough evidence',
  emerging: 'Emerging',
  developing: 'Developing',
  mastered: 'Mastered',
};
export const MASTERED_DUE_WORDS = 'Mastered, due a re-check';

export const RULES = {
  /** The newest this many marks on a skill decide its state. */
  WINDOW: 10,
  /** Fewer marks than this is "not enough evidence". */
  MIN_MARKS: 4,
  /** For every state except mastered, only marks this recent count. */
  RECENT_DAYS: 30,
  /** Share of the newest marks right without help: under this is emerging. */
  EMERGING_BELOW: 0.5,
  /** Share of the newest marks right without help: this or more is mastered-level. */
  MASTERED_FROM: 0.8,
  /** An item counts as "right" (for the medium/hard count) at this share of its marks. */
  ITEM_RIGHT_FROM: 0.5,
  /** Mastered needs this many medium or hard items right without help in the window. */
  MIN_HARD_RIGHT: 2,
  /** When no item in the evidence has a difficulty (a stated assumption): this many unaided marks in the window instead. */
  MIN_INDEPENDENT_WHEN_DIFFICULTY_UNKNOWN: 8,
  /** The first re-check is at least this many days after first reaching the threshold. */
  FIRST_RECHECK_DAYS: 14,
  /** Re-checks fall due this many weeks after first reaching the threshold. */
  RECHECK_WEEKS: [2, 4, 8],
  /** A re-check is judged on the first this-many marks on or after its due date. */
  RECHECK_BATCH: 5,
  /** A re-check's marks must fall within this many days of its first mark (one sitting, not weeks of practice). */
  RECHECK_SPAN_DAYS: 3,
  /** A re-check needs at least this many marks to be judged. */
  MIN_RECHECK_MARKS: 2,
  /** Share right without help that passes a re-check. */
  RECHECK_PASS_FROM: 0.8,
  /** A re-check overdue by more than this many days shows "mastered, due a re-check". */
  OVERDUE_DAYS: 28,
};

const DAY = 86400000;

// ---------------------------------------------------------------- rows
const timeOf = (r) => {
  const t = Date.parse(r?.created_at || r?.client_ts || '');
  return Number.isFinite(t) ? t : null;
};
export const skillKeyOf = (r) => r?.cskill || r?.skill_id || null;
export const isHelped = (r) => r?.independent === false || Number(r?.hints_used) > 0;
const scoreOf = (r) => {
  const max = Number(r?.max_marks);
  if (max > 0) return Math.max(0, Math.min(1, Number(r.marks ?? (r.correct ? max : 0)) / max));
  return r?.correct ? 1 : 0;
};
/** What a mark adds toward developing and mastered: its score, unless it had help. */
const unaided = (r) => (isHelped(r) ? 0 : scoreOf(r));
const isHard = (r) => r?.difficulty === 'medium' || r?.difficulty === 'hard';

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const pct = (x) => `${Math.round(x * 100)}%`;
const dateWords = (ms) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });

/** "MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS" -> "Equivalent Fractions"; "G5_ADDITION" -> "Addition". */
export const labelFromCode = (code) => {
  if (!code) return 'Unnamed skill';
  const tail = String(code).split('.').pop().replace(/^G\d+_/, '');
  return tail.toLowerCase().split('_').filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ') || String(code);
};

/** The sub-strand of a curriculum skill code: the first four parts of SUBJECT.GRADE.STRAND.SUBSTRAND.SKILL. */
export const substrandFromCode = (code) => {
  const parts = String(code || '').split('.');
  return parts.length >= 5 ? parts.slice(0, 4).join('.') : null;
};

// ---------------------------------------------------------------- the window
const summarise = (win) => {
  const n = win.length;
  const aided = win.reduce((s, r) => s + unaided(r), 0);
  const independent = win.filter((r) => !isHelped(r));
  const hardRight = win.filter((r) => isHard(r) && !isHelped(r) && scoreOf(r) >= RULES.ITEM_RIGHT_FROM).length;
  const rightAny = win.filter((r) => scoreOf(r) >= RULES.ITEM_RIGHT_FROM).length;
  return {
    n, rate: n ? aided / n : 0, independentCount: independent.length, hardRight, rightAny,
    helped: win.filter(isHelped).length,
    hardItems: win.filter(isHard).length,
    onlyEasy: n > 0 && win.every((r) => r.difficulty === 'easy'),
  };
};

/** Has this window the evidence for the mastered level (before any re-check)? */
const meetsMastered = (win, difficultyKnown) => {
  const s = summarise(win);
  if (s.n < RULES.MIN_MARKS || s.rate < RULES.MASTERED_FROM) return false;
  return difficultyKnown ? s.hardRight >= RULES.MIN_HARD_RIGHT : s.independentCount >= RULES.MIN_INDEPENDENT_WHEN_DIFFICULTY_UNKNOWN;
};

// ---------------------------------------------------------------- the re-check timeline
/**
 * Walk the marks oldest to newest: when did the learner first meet the mastered
 * level, and did each re-check (2, 4, 8 weeks after) hold?
 */
function walk(asc, difficultyKnown) {
  const times = asc.map(timeOf);
  let pos = 0;
  let reached = null;       // { at, ids, idx }
  let passed = [];          // [{ week, due, ids, at }]
  let failed = null;        // { week, due, ids, lastIdx }
  let pending = null;       // the next re-check's due date once reached
  while (pos < asc.length) {
    if (!reached) {
      const win = asc.slice(Math.max(0, pos - RULES.WINDOW + 1), pos + 1);
      if (meetsMastered(win, difficultyKnown)) reached = { at: times[pos], ids: win.map((r) => r._id), idx: pos };
      pos += 1;
      continue;
    }
    const k = passed.length;
    if (k >= RULES.RECHECK_WEEKS.length) break;
    const due = reached.at + Math.max(RULES.RECHECK_WEEKS[k] * 7, k === 0 ? RULES.FIRST_RECHECK_DAYS : 0) * DAY;
    const batch = [];
    for (let j = pos; j < asc.length && batch.length < RULES.RECHECK_BATCH; j += 1) {
      if (times[j] < due) continue;
      if (batch.length && times[j] - times[batch[0]] > RULES.RECHECK_SPAN_DAYS * DAY) break;
      batch.push(j);
    }
    if (batch.length < RULES.MIN_RECHECK_MARKS) break;
    const rows = batch.map((j) => asc[j]);
    const rate = rows.reduce((s, r) => s + unaided(r), 0) / rows.length;
    const last = batch[batch.length - 1];
    if (rate >= RULES.RECHECK_PASS_FROM) {
      passed.push({ week: RULES.RECHECK_WEEKS[k], due, ids: rows.map((r) => r._id), at: times[last] });
    } else {
      failed = { week: RULES.RECHECK_WEEKS[k], due, ids: rows.map((r) => r._id), lastIdx: last };
      reached = null; passed = [];
    }
    pos = last + 1;
  }
  if (reached) {
    const k = passed.length;
    pending = k < RULES.RECHECK_WEEKS.length
      ? reached.at + Math.max(RULES.RECHECK_WEEKS[k] * 7, k === 0 ? RULES.FIRST_RECHECK_DAYS : 0) * DAY : null;
  }
  return { reached, passed, failed, pending };
}

// ---------------------------------------------------------------- one skill
/**
 * The state of one skill.
 * @param {object[]} rows  one learner's evidence rows for ONE skill (response_events shape)
 * @param {object}  [o]
 * @param {number|Date} [o.now]
 * @param {boolean} [o.difficultyKnown]  whether any item in the learner's whole evidence has a difficulty
 */
export function skillState(rows, { now = Date.now(), difficultyKnown } = {}) {
  const nowMs = now instanceof Date ? now.getTime() : now;
  const all = (rows || []).map((r, i) => ({ ...r, _id: r.id ?? r.item_ref ?? `row-${i}`, _t: timeOf(r) }))
    .filter((r) => r._t != null && r._t <= nowMs)
    .sort((a, b) => a._t - b._t);
  const dk = difficultyKnown ?? all.some((r) => r.difficulty);
  const base = { difficultyKnown: dk, marks: all.length };

  if (!all.length) {
    return { ...base, state: 'not_assessed', word: STATE_WORDS.not_assessed, dueRecheck: false, evidenceIds: [],
      reason: 'Nothing has been answered on this skill yet.' };
  }

  const w = walk(all, dk);
  const newest = all.slice(-RULES.WINDOW);

  // MASTERED: met the level, and held on at least one re-check.
  if (w.reached && w.passed.length >= 1) {
    const last = w.passed[w.passed.length - 1];
    const next = w.pending;
    const overdue = next != null && nowMs > next + RULES.OVERDUE_DAYS * DAY;
    const due = next != null && nowMs > next;
    const checks = `${plural(w.passed.length, 'time', 'times')} (last on ${dateWords(last.at)})`;
    const win = all.filter((r) => w.reached.ids.includes(r._id));
    const s = summarise(win);
    const lead = `${Math.round(s.rate * s.n)} of ${s.n} answers were right without help when it was first reached${dk ? `, ${plural(s.hardRight, 'medium or hard question', 'medium or hard questions')} among them` : ''}`;
    const tail = next == null
      ? `and it held when re-checked ${checks}, so all re-checks are done`
      : overdue ? `and it held when re-checked ${checks}, but the next re-check was due on ${dateWords(next)} and is now well overdue`
      : due ? `and it held when re-checked ${checks}, and the next re-check is due now`
      : `and it held when re-checked ${checks}, with the next due on ${dateWords(next)}`;
    return {
      ...base, state: 'mastered', word: overdue ? MASTERED_DUE_WORDS : STATE_WORDS.mastered,
      dueRecheck: overdue, recheckDue: due, nextRecheck: next ? new Date(next).toISOString().slice(0, 10) : null,
      recheckPassed: w.passed.length, firstReachedAt: new Date(w.reached.at).toISOString().slice(0, 10),
      evidenceIds: [...w.reached.ids, ...w.passed.flatMap((p) => p.ids)],
      reason: `${lead}, ${tail}.`,
    };
  }

  // EVERYTHING ELSE reads only the recent marks.
  const recent = all.filter((r) => nowMs - r._t <= RULES.RECENT_DAYS * DAY).slice(-RULES.WINDOW);
  const daysAgo = Math.floor((nowMs - all[all.length - 1]._t) / DAY);
  if (!recent.length) {
    return { ...base, state: 'not_enough', word: STATE_WORDS.not_enough, dueRecheck: false, evidenceIds: newest.map((r) => r._id),
      reason: `Nothing has been answered in the last ${RULES.RECENT_DAYS} days; the last answer was ${plural(daysAgo, 'day', 'days')} ago.` };
  }
  const s = summarise(recent);
  const ids = recent.map((r) => r._id);
  const right = Math.round(s.rate * s.n);

  // A failed re-check puts a once-reached skill back at developing, whatever the recent count says.
  const failedHere = w.failed && !w.reached && newest.some((r) => w.failed.ids.includes(r._id));
  if (failedHere) {
    return { ...base, state: 'developing', word: STATE_WORDS.developing, dueRecheck: false, evidenceIds: [...new Set([...w.failed.ids, ...ids])],
      reason: `It slipped back at the ${w.failed.week}-week re-check, with ${right} of the last ${s.n} answers right without help.` };
  }
  if (s.n < RULES.MIN_MARKS) {
    return { ...base, state: 'not_enough', word: STATE_WORDS.not_enough, dueRecheck: false, evidenceIds: ids,
      reason: `There ${s.n === 1 ? 'is' : 'are'} only ${plural(s.n, 'answer', 'answers')} in the last ${RULES.RECENT_DAYS} days, and at least ${RULES.MIN_MARKS} are needed.` };
  }
  if (s.onlyEasy && s.rate >= RULES.EMERGING_BELOW) {
    return { ...base, state: 'not_enough', word: STATE_WORDS.not_enough, dueRecheck: false, evidenceIds: ids,
      reason: `All ${s.n} questions so far were easy ones, so there is no sign yet of how they cope with harder ones.` };
  }
  if (s.rate < RULES.EMERGING_BELOW) {
    const rightWithHelp = recent.filter((r) => isHelped(r) && scoreOf(r) >= RULES.ITEM_RIGHT_FROM).length;
    const reason = rightWithHelp * 2 > s.rightAny && rightWithHelp > 0
      ? `Of the last ${s.n} answers, ${rightWithHelp} were right only with help and ${right} on their own.`
      : `Only ${right} of the last ${s.n} answers were right without help.`;
    return { ...base, state: 'emerging', word: STATE_WORDS.emerging, dueRecheck: false, evidenceIds: ids, reason };
  }

  // DEVELOPING: 50% or more right unaided, but not mastered (or not yet re-checked).
  const need = [];
  if (s.rate < RULES.MASTERED_FROM) need.push(`${pct(RULES.MASTERED_FROM)} right without help`);
  if (dk && s.hardRight < RULES.MIN_HARD_RIGHT) need.push(`${RULES.MIN_HARD_RIGHT} medium or hard questions right without help`);
  if (!dk && s.independentCount < RULES.MIN_INDEPENDENT_WHEN_DIFFICULTY_UNKNOWN) need.push(`${RULES.MIN_INDEPENDENT_WHEN_DIFFICULTY_UNKNOWN} answers without help (question difficulty is not recorded)`);
  let reason;
  if (w.reached && !w.passed.length) {
    reason = `${right} of the last ${s.n} answers were right without help; the level was reached on ${dateWords(w.reached.at)} and a re-check from ${dateWords(w.pending)} will confirm it.`;
  } else if (need.length) {
    reason = `${right} of the last ${s.n} answers were right without help; mastered needs ${need.join(' and ')}.`;
  } else {
    reason = `${right} of the last ${s.n} answers were right without help.`;
  }
  return { ...base, state: 'developing', word: STATE_WORDS.developing, dueRecheck: false, evidenceIds: ids, reason };
}

// ---------------------------------------------------------------- roll-up
const ORDER = { emerging: 1, developing: 2, mastered: 3 };

/**
 * ROLL-UP RULE (stated, tested): a group is only as strong as its weakest skill.
 *  - skills not yet assessed are left out (they are named in the reason);
 *  - no skill with evidence: not yet assessed; every skill "not enough": not enough;
 *  - otherwise the weakest of emerging / developing / mastered;
 *  - a skill still "not enough evidence" holds the group at developing at most.
 * A group is therefore mastered only when every skill with evidence in it is mastered.
 */
export function rollUp(skills, { labelOf = labelFromCode } = {}) {
  const have = skills.filter((s) => s.state !== 'not_assessed');
  const missing = skills.length - have.length;
  const nameOf = (s) => labelOf(s.key);
  const skip = missing ? ` (${plural(missing, 'skill', 'skills')} not yet assessed)` : '';
  if (!have.length) return { state: 'not_assessed', word: STATE_WORDS.not_assessed, evidenceIds: [], reason: 'Nothing has been answered on these skills yet.' };
  const graded = have.filter((s) => ORDER[s.state]);
  if (!graded.length) {
    return { state: 'not_enough', word: STATE_WORDS.not_enough, evidenceIds: have.flatMap((s) => s.evidenceIds),
      reason: `None of the ${plural(have.length, 'skill', 'skills')} has enough evidence yet${skip}.` };
  }
  const weakest = graded.reduce((a, b) => (ORDER[b.state] < ORDER[a.state] ? b : a));
  let state = weakest.state;
  const unproven = have.length - graded.length;
  if (unproven && ORDER[state] > ORDER.developing) state = 'developing';
  const deciding = graded.filter((s) => s.state === weakest.state);
  const mastered = graded.filter((s) => s.state === 'mastered').length;
  const reason = state === 'mastered'
    ? `All ${plural(graded.length, 'skill', 'skills')} with evidence are mastered${skip}.`
    : unproven && weakest.state === 'mastered'
      ? `${mastered} of ${have.length} skills are mastered, but ${plural(unproven, 'skill has', 'skills have')} not enough evidence yet${skip}.`
      : `${mastered} of ${have.length} skills are mastered; the weakest ${deciding.length === 1 ? 'is' : 'are'} ${deciding.slice(0, 3).map(nameOf).join(', ')}, ${weakest.state}${skip}.`;
  return {
    state, word: state === 'mastered' && graded.some((s) => s.dueRecheck) ? MASTERED_DUE_WORDS : STATE_WORDS[state],
    evidenceIds: deciding.flatMap((s) => s.evidenceIds), reason,
  };
}

// ---------------------------------------------------------------- everything for one learner
/**
 * All of a learner's evidence in, every skill's state out, with outcome and sub-strand roll-ups.
 * @param {object[]} rows  one learner's response_events rows
 * @param {object} [o]  { now, labelOf }
 * @returns {{skills: object[], outcomes: object[], substrands: object[], difficultyKnown: boolean, assumptions: string[]}}
 */
export function learnerMastery(rows, { now = Date.now(), labelOf = labelFromCode } = {}) {
  const evidence = (rows || []).filter((r) => skillKeyOf(r));
  const difficultyKnown = evidence.some((r) => r.difficulty);
  const assumptions = [];
  if (evidence.length && !difficultyKnown) {
    assumptions.push(`No item in this learner's evidence records a difficulty, so mastered asks for ${RULES.MIN_INDEPENDENT_WHEN_DIFFICULTY_UNKNOWN} or more answers without help in the newest ${RULES.WINDOW} instead of medium or hard questions.`);
  }
  const bySkill = new Map();
  for (const r of evidence) {
    const k = skillKeyOf(r);
    if (!bySkill.has(k)) bySkill.set(k, []);
    bySkill.get(k).push(r);
  }
  const newestFirst = (a, b) => (timeOf(b) ?? 0) - (timeOf(a) ?? 0);
  const skills = [...bySkill.entries()].map(([key, list]) => {
    const st = skillState(list, { now, difficultyKnown });
    const sorted = [...list].sort(newestFirst);
    const outcome = sorted.find((r) => r.outcome_code)?.outcome_code || null;
    const substrand = sorted.find((r) => r.substrand_code)?.substrand_code || substrandFromCode(key);
    return { key, label: labelOf(key), outcome, substrand, ...st };
  }).sort((a, b) => a.key.localeCompare(b.key));

  const group = (field) => {
    const m = new Map();
    for (const s of skills) {
      const g = s[field];
      if (!g) continue;
      if (!m.has(g)) m.set(g, []);
      m.get(g).push(s);
    }
    return [...m.entries()].map(([code, list]) => ({ code, skillKeys: list.map((s) => s.key), ...rollUp(list, { labelOf }) }))
      .sort((a, b) => a.code.localeCompare(b.code));
  };
  return { skills, outcomes: group('outcome'), substrands: group('substrand'), difficultyKnown, assumptions };
}

export default { STATES, STATE_WORDS, RULES, skillState, learnerMastery, rollUp, labelFromCode, substrandFromCode };
