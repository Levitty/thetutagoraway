// ============================================================================
// WHERE THEY STRUGGLED — one assignment, read from the answers already logged.
//
// An assignment is a set of skills and "done" means mastered (assignments.js).
// That says who has finished. It does not say why the others have not, and
// that is the question a teacher asks next. The answer is already recorded:
// every answered question lands in response_events (telemetry.js) with what
// the child typed and what was expected. Nothing new is stored to build this;
// it is a reading of the log, scoped to the learners and skills of one piece of
// work, from the moment it was set.
//
// What it produces, for the teacher:
//   per learner and per skill  attempts, accuracy, mastered, the wrong answers
//   the skill most missed      where the class went wrong most often
//   the learners stuck         many tries, low accuracy, still not mastered
//   a next step for each       the answer pattern's advice when there is one,
//                              and the five-minute move for the skill
//
// Pure: rows in, a summary out. No clock, no database.
// ============================================================================

import { assignedLearners } from './assignments.js';
import { fiveMinuteMove } from './teacherMoves.js';
import { TAXONOMY } from './misconceptions.js';

// Stuck = tried properly, mostly wrong, still not mastered. Four tries is
// enough to rule out a bad first go; under half right rules out a child who
// is nearly there and needs only more practice.
export const STUCK_MIN_ATTEMPTS = 4;
export const STUCK_MAX_ACCURACY = 50;

// ---- reading one wrong answer ----------------------------------------------

const clean = (v) => String(v ?? '').trim();
const toNum = (v) => {
  const t = clean(v).replace(/[,\s]/g, '').replace(/[−–]/g, '-');
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null;
};
const toFrac = (v) => {
  const m = clean(v).replace(/\s/g, '').match(/^(-?\d+)\/(-?\d+)$/);
  return m && Number(m[2]) !== 0 ? [Number(m[1]), Number(m[2])] : null;
};
const digitsOf = (n) => String(Math.abs(n)).replace('.', '');
const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

const PATTERNS = {
  sign: { label: 'Wrong sign', advice: TAXONOMY['sign-error'].advice },
  'power-of-ten': { label: 'Out by ten, a hundred or a thousand', advice: TAXONOMY['place-value'].advice },
  'dropped-zero': { label: 'Left out a zero', advice: 'Build the number on a place-value chart first. An empty column still needs its zero written in.' },
  'digits-swapped': { label: 'Right digits, wrong places', advice: TAXONOMY['place-value'].advice },
  'carry-slip': { label: 'A carry or borrow slipped in one column', advice: 'Work two on paper in columns, saying each carry or borrow aloud before writing it down.' },
  'off-by-one': { label: 'Off by one', advice: 'A counting slip more than a misunderstanding. Ask them to check each answer once, out loud, before they submit it.' },
  flipped: { label: 'Turned the fraction upside down', advice: TAXONOMY['fraction-procedure'].advice },
  format: { label: 'Right value, written another way', advice: 'Show them the form the question wants (whole number, fraction, unit) before they start.' },
  repeated: { label: 'Gave the same wrong answer again and again', advice: 'A fixed idea, not a slip. Ask them how they got that answer: the reason is the thing to fix.' },
  skipping: { label: 'Says they have not learned this yet', advice: 'Teach it before setting it again: do one together first, then let them try one alone.' },
};

/**
 * What kind of wrong answer this is, when the numbers say so plainly. Null
 * when they do not: a guess at a pattern is worse than no pattern, because a
 * teacher will act on it.
 */
export const answerPattern = (submitted, expected) => {
  const s = clean(submitted), e = clean(expected);
  if (!s || !e || s === e) return null;
  const sn = toNum(s), en = toNum(e);
  if (sn != null && en != null && !near(sn, en)) {
    if (en !== 0 && near(sn, -en)) return 'sign';
    if (en !== 0 && sn !== 0) {
      const r = sn / en;
      if ([10, 100, 1000, 0.1, 0.01, 0.001].some(p => near(r, p))) return 'power-of-ten';
    }
    const ds = digitsOf(sn), de = digitsOf(en);
    if (de.includes('0') && de.replace(/0/g, '') === ds.replace(/0/g, '') && ds.length < de.length) return 'dropped-zero';
    if (ds.length === de.length && ds.length > 1 && [...ds].sort().join('') === [...de].sort().join('')) return 'digits-swapped';
    const d = Math.abs(sn - en);
    if (Number.isInteger(sn) && Number.isInteger(en)) {
      if (d === 1) return 'off-by-one';
      if ([10, 100, 1000, 10000].includes(d)) return 'carry-slip';
    }
    return null;
  }
  const sf = toFrac(s), ef = toFrac(e);
  if (sf && ef && sf[0] * ef[0] === sf[1] * ef[1] && sf[0] * ef[1] !== sf[1] * ef[0]) return 'flipped';
  if (s.replace(/\s+/g, '').toLowerCase() === e.replace(/\s+/g, '').toLowerCase()) return 'format';
  return null;
};

export const patternInfo = (id) => (PATTERNS[id] ? { id, ...PATTERNS[id] } : null);

// ---- one learner, one skill -------------------------------------------------

const when = (r) => Date.parse(r.client_ts || r.created_at || '') || 0;

/**
 * Everything one learner did on one skill. `rows` are that learner's events
 * for that skill only. `skill` is the progress entry, for mastery and, when
 * there are no events at all, for the counts.
 */
export const learnerSkill = (rows, skill, misconceptions, skillId) => {
  const answered = rows.filter(r => !r.skipped);
  const skipped = rows.length - answered.length;
  const correct = answered.filter(r => r.correct).length;
  const attempts = answered.length;
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : null;

  // The wrong answers, grouped: the same wrong answer three times is one
  // finding, not three.
  const groups = new Map();
  for (const r of answered.filter(x => !x.correct).sort((a, b) => when(b) - when(a))) {
    const key = `${clean(r.submitted_value)}\u0000${clean(r.expected_value)}`;
    const g = groups.get(key) || { submitted: clean(r.submitted_value), expected: clean(r.expected_value), n: 0 };
    g.n += 1;
    groups.set(key, g);
  }
  const wrong = [...groups.values()].filter(g => g.submitted || g.expected)
    .sort((a, b) => b.n - a.n);

  // The pattern: the commonest one across the wrong answers, else a repeated
  // wrong answer, else what HOREB already noticed on this skill, else skipping.
  const tally = new Map();
  for (const g of wrong) {
    const p = answerPattern(g.submitted, g.expected);
    if (p) tally.set(p, (tally.get(p) || 0) + g.n);
  }
  let pattern = null;
  const top = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] >= 2) pattern = { ...patternInfo(top[0]), n: top[1] };
  else if (wrong[0]?.n >= 2) pattern = { ...patternInfo('repeated'), n: wrong[0].n };
  else if (top) pattern = { ...patternInfo(top[0]), n: top[1] };
  else {
    const seen = Object.entries(misconceptions || {})
      .filter(([tag, v]) => TAXONOMY[tag] && (v?.skills || []).includes(skillId))
      .sort((a, b) => (b[1].n || 0) - (a[1].n || 0))[0];
    if (seen) pattern = { id: seen[0], label: TAXONOMY[seen[0]].label, advice: TAXONOMY[seen[0]].advice, n: seen[1].n || 0 };
    else if (skipped >= 2 && attempts < 2) pattern = { ...patternInfo('skipping'), n: skipped };
  }

  // Right and wrong in the order they happened, last twelve: a run of red
  // that turns green is a child learning; red all the way along is not.
  const trail = [...answered].sort((a, b) => when(a) - when(b)).slice(-12).map(r => !!r.correct);

  const hints = answered.length
    ? Math.round((answered.reduce((t, r) => t + (r.hints_used || 0), 0) / answered.length) * 10) / 10
    : 0;

  return {
    attempts, correct, skipped, accuracy,
    mastered: !!skill?.mastered,
    hints,
    trail,
    wrong: wrong.slice(0, 3),
    // Every distinct wrong answer, for spotting one the class shares.
    wrongAll: wrong,
    wrongCount: attempts - correct,
    pattern,
  };
};

const stateOf = (c) => {
  if (c.mastered) return 'mastered';
  if (c.attempts >= STUCK_MIN_ATTEMPTS && (c.accuracy ?? 0) < STUCK_MAX_ACCURACY) return 'stuck';
  if (c.attempts > 0 || c.skipped > 0) return 'working';
  return 'untouched';
};

// ---- one assignment ---------------------------------------------------------

/**
 * @param assignment  { skill_ids, student_ids?, created_at? }
 * @param learners    the class: [{ id, name, progress }]
 * @param events      response_events rows for those learners (any skills,
 *                    any time — this narrows them)
 * @param opts.skills the knowledge graph's skills by id, for names and strands
 */
export const assignmentStruggles = (assignment, learners, events, { skills = {} } = {}) => {
  const skillIds = (assignment?.skill_ids || []).filter(Boolean);
  const cohort = assignedLearners(assignment, learners);
  const ids = new Set(cohort.map(l => l.id));
  const set = new Set(skillIds);
  const since = Date.parse(assignment?.created_at || '') || 0;

  // Answers by these learners, on these skills, since the work was set. A
  // child's own account only: rows with a learner_id belong to a parent's
  // roster child, who cannot be in a class.
  const rows = (events || []).filter(r =>
    ids.has(r.student_id) && set.has(r.skill_id) && !r.learner_id
    && (!since || (Date.parse(r.created_at || r.client_ts || '') || 0) >= since));

  // With no answers logged at all (telemetry not reaching the server, or work
  // set a minute ago) fall back to the counts HOREB keeps per skill, and say
  // so: lifetime counts are a weaker reading than answers since the work was set.
  const source = rows.length ? 'answers' : 'progress';

  const byKey = new Map();
  for (const r of rows) {
    const k = `${r.student_id}|${r.skill_id}`;
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(r);
  }

  const learnerRows = cohort.map(l => {
    const ps = l.progress?.skills || {};
    const cells = skillIds.map(sid => {
      let c;
      if (source === 'answers') {
        c = learnerSkill(byKey.get(`${l.id}|${sid}`) || [], ps[sid], l.progress?.misconceptions, sid);
      } else {
        const p = ps[sid] || {};
        const attempts = p.attempts || 0, correct = p.correct || 0;
        c = {
          attempts, correct, skipped: 0,
          accuracy: attempts ? Math.round((correct / attempts) * 100) : null,
          mastered: !!p.mastered, hints: 0, trail: [], wrong: [], wrongAll: [], wrongCount: attempts - correct,
          pattern: learnerSkill([], p, l.progress?.misconceptions, sid).pattern,
        };
      }
      return { skillId: sid, ...c, state: stateOf(c) };
    });
    const states = cells.map(c => c.state);
    const status = states.length && states.every(s => s === 'mastered') ? 'done'
      : states.includes('stuck') ? 'stuck'
      : states.some(s => s !== 'untouched') ? 'working'
      : 'untouched';
    return { id: l.id, name: l.name, cells, status };
  });

  // ---- per skill, across the learners --------------------------------------
  const skillRows = skillIds.map((sid, i) => {
    const sk = skills[sid] || {};
    const cells = learnerRows.map(r => r.cells[i]);
    const attempts = cells.reduce((t, c) => t + c.attempts, 0);
    const correct = cells.reduce((t, c) => t + c.correct, 0);
    // The wrong answer most of them gave, if more than one child gave it: that
    // is a class-wide misconception, and the most useful line on the page.
    const shared = new Map();
    learnerRows.forEach(r => {
      for (const w of r.cells[i].wrongAll) {
        const k = `${w.submitted}\u0000${w.expected}`;
        const g = shared.get(k) || { submitted: w.submitted, expected: w.expected, n: 0, learners: [] };
        g.n += w.n;
        g.learners.push(r.name);
        shared.set(k, g);
      }
    });
    const commonWrong = [...shared.values()].filter(g => g.learners.length >= 2)
      .sort((a, b) => b.learners.length - a.learners.length || b.n - a.n)[0] || null;
    return {
      id: sid,
      name: sk.name || sid,
      strand: sk.strand || null,
      grade: sk.grade ?? null,
      attempts, correct,
      wrongCount: attempts - correct,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : null,
      mastered: cells.filter(c => c.mastered).length,
      stuck: cells.filter(c => c.state === 'stuck').length,
      untouched: cells.filter(c => c.state === 'untouched').length,
      assigned: cells.length,
      commonWrong,
    };
  });

  const missed = skillRows.filter(s => s.wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount || (a.accuracy ?? 101) - (b.accuracy ?? 101));
  const mostMissed = missed[0] || null;

  // ---- the learners to sit with --------------------------------------------
  const stuck = learnerRows.filter(r => r.status === 'stuck').map(r => {
    const worst = r.cells
      .map((c, i) => ({ ...c, skill: skillRows[i] }))
      .filter(c => c.state === 'stuck')
      .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0) || b.attempts - a.attempts)[0];
    const move = fiveMinuteMove({ id: worst.skillId, strand: worst.skill.strand });
    return {
      id: r.id,
      name: r.name,
      skillId: worst.skillId,
      skillName: worst.skill.name,
      strand: worst.skill.strand,
      attempts: worst.attempts,
      accuracy: worst.accuracy ?? 0,
      wrong: worst.wrong,
      trail: worst.trail,
      pattern: worst.pattern,
      // The pattern's advice is about THIS child's mistake; the move is about
      // the skill. When there is a pattern it leads.
      step: worst.pattern?.advice || move,
      move,
      stuckOn: r.cells.filter(c => c.state === 'stuck').length,
    };
  }).sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts
    || String(a.name).localeCompare(String(b.name)));

  // Stuck first, then working, then not started, then done: the order a
  // teacher would walk the room in.
  const ORDER = { stuck: 0, working: 1, untouched: 2, done: 3 };
  learnerRows.sort((a, b) => ORDER[a.status] - ORDER[b.status] || String(a.name).localeCompare(String(b.name)));

  const count = (s) => learnerRows.filter(r => r.status === s).length;
  return {
    source,
    answers: rows.length,
    skills: skillRows,
    learners: learnerRows,
    mostMissed,
    stuck,
    counts: { assigned: learnerRows.length, done: count('done'), stuck: count('stuck'), working: count('working'), untouched: count('untouched') },
  };
};
