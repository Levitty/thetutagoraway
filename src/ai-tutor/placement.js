// ============================================================================
// PLACEMENT — the "find your level" test.
//
// History, because each version fixed the last one's fault:
//
//   1. A focus-walk that climbed out of the declared grade after two right
//      answers (a Grade 6 entry reached calculus) and had no strand balance
//      (8 of 10 questions were Numbers).
//   2. A top-down sweep asking ONE question per strand. Balanced, but thin:
//      five questions against the 101 skills of Grades 1-5, one of 47 in
//      Numbers. Simulated with virtual children whose gaps can sit anywhere,
//      only 38% of Grade 4-5 children with a gap were asked anything in the
//      gap's own sub-strand, and the result page then called them "solid".
//
// This version sweeps the declared grade ONE QUESTION PER SUB-STRAND — the
// units the KICD design itself divides the year into, so a parent can hold the
// result against the textbook's chapters:
//
//   1. Sweep every sub-strand of the declared grade (19 for CBC Grades 4, 5
//      and 9). Strands are interleaved so the child is not given eight Numbers
//      questions in a row.
//   2. Follow each miss down the ladder: one question from what the missed
//      skill stands on, a grade or more below. Wrong again, and the thread goes
//      one rung further. Every thread gets its first follow-up before any gets
//      its second, so the cap trims the deepest probes, never a whole thread.
//   3. A near-flawless sweep earns a short stretch above the declared grade —
//      one question per strand, all right to count. Never more than one grade.
//
// Every function derives its answer from the questions asked so far, so there
// is no phase state to persist and a half-finished test resumes from its
// answers alone. Each record carries `unit` (its sub-strand) and, for a
// follow-up, `probeFor` (the sub-strand whose miss it is chasing).
// ============================================================================
import { gradeOf, strandOf, isEnrichment, NATIVE } from './curricula.js';

export const CLEAR = 0.65;          // share of the declared sweep needed to clear the grade
export const STRETCH_GATE = 0.9;    // share of the sweep needed before a stretch is offered
export const MAX_QUESTIONS = 30;    // hard ceiling on the whole test, confirmations included
export const STRETCH_PROBE = 5;     // stretch questions, one per strand of the grade above
export const MAX_PROBE_DEPTH = 3;   // how many rungs below a miss a thread may follow

// ---------------------------------------------------------------------------
// The pool. Grades, strands and sub-strands are read through the LEARNER'S
// curriculum, so a CBC child is swept against the CBC design: a skill the
// design puts in a different grade is asked in that grade, and one the design
// leaves out (enrichment) is not asked at all.
// ---------------------------------------------------------------------------
export const buildPlacementPool = (skills, curriculum = NATIVE) =>
  Object.values(skills || {})
    .filter(s => s && Number.isFinite(s.grade) && !isEnrichment(s, curriculum))
    .map(s => {
      const tag = curriculum !== NATIVE ? s.curricula?.[curriculum] : null;
      const strand = strandOf(s, curriculum);
      return {
        id: s.id,
        grade: gradeOf(s, curriculum),
        strand,
        // Untagged skills fall back to their strand, so a grade the design has
        // not been mapped onto still gets a balanced (if coarser) sweep.
        unit: (tag && tag.substrand) || strand,
        critical: !!s.critical,
        prerequisites: s.prerequisites || [],
      };
    })
    .filter(s => Number.isFinite(s.grade));

const unitOf = (s) => s.unit ?? s.strand;

export const gradesIn = (pool) =>
  [...new Set(pool.map(s => s.grade).filter(Number.isFinite))].sort((a, b) => a - b);

const clampGrade = (pool, declared) => {
  const grades = gradesIn(pool);
  if (!grades.length) return null;
  const d = Number.isFinite(declared) ? declared : grades[grades.length - 1];
  return Math.max(grades[0], Math.min(grades[grades.length - 1], d));
};

// How load-bearing a skill is: how many other skills list it as a prerequisite.
const dependantCount = (pool, skillId) =>
  pool.reduce((n, s) => n + ((s.prerequisites || []).includes(skillId) ? 1 : 0), 0);

// Sub-strands at a grade, in asking order. Strands are taken in turn (biggest
// first) so consecutive questions come from different parts of the syllabus;
// within a strand, its biggest sub-strand first. Ties break by name so the
// order is identical on a resume.
export const unitsAt = (pool, grade) => {
  const byStrand = new Map();
  for (const s of pool) {
    if (s.grade !== grade) continue;
    const st = byStrand.get(s.strand) || new Map();
    st.set(unitOf(s), (st.get(unitOf(s)) || 0) + 1);
    byStrand.set(s.strand, st);
  }
  const strands = [...byStrand.entries()]
    .map(([strand, units]) => ({
      strand,
      size: [...units.values()].reduce((a, b) => a + b, 0),
      units: [...units.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).map(([u]) => u),
    }))
    .sort((a, b) => b.size - a.size || String(a.strand).localeCompare(String(b.strand)));
  const out = [];
  for (let i = 0; strands.some(st => i < st.units.length); i++) {
    for (const st of strands) if (i < st.units.length) out.push(st.units[i]);
  }
  return out;
};

const strandsAt = (pool, grade) =>
  [...new Set(pool.filter(s => s.grade === grade).map(s => s.strand))].sort();

// The best question among candidates: the most load-bearing skill, then the one
// the running evidence is least sure about.
const best = (pool, cands, balances = {}) => {
  if (!cands.length) return null;
  return [...cands].sort((a, b) =>
    (b.critical ? 1 : 0) - (a.critical ? 1 : 0) ||
    dependantCount(pool, b.id) - dependantCount(pool, a.id) ||
    Math.abs(balances[a.id] || 0) - Math.abs(balances[b.id] || 0) ||
    String(a.id).localeCompare(String(b.id)))[0];
};

// Everything a skill stands on, nearest first.
const ancestors = (byId, id) => {
  const out = [], seen = new Set([id]);
  let frontier = [id];
  while (frontier.length) {
    const next = [];
    for (const f of frontier) {
      for (const p of byId.get(f)?.prerequisites || []) {
        if (seen.has(p) || !byId.has(p)) continue;
        seen.add(p); out.push(byId.get(p)); next.push(p);
      }
    }
    frontier = next;
  }
  return out;
};

// ---------------------------------------------------------------------------
// Reading the answers so far.
// ---------------------------------------------------------------------------
const accuracy = (rows) => (rows.length ? rows.filter(a => a.correct).length / rows.length : null);
const sweepRows = (asked, grade) => asked.filter(a => a.grade === grade && !a.probeFor);

export const gradeAccuracy = (asked, grade) => accuracy(asked.filter(a => a.grade === grade));

/** Sub-strands of the declared grade not yet asked — the part of the test that must not be squeezed out. */
export const sweepRemaining = (asked, declared, pool) => {
  const start = clampGrade(pool, declared);
  if (start == null) return 0;
  const done = new Set(sweepRows(asked, start).map(unitOf));
  return unitsAt(pool, start).filter(u => !done.has(u)).length;
};

// The next follow-up below a missed record: what it stands on first (the
// nearest prerequisites, highest grade first), then the same sub-strand lower
// down, then the same strand one grade down.
const probeBelow = (pool, byId, rec, answered, balances) => {
  const below = (s) => s.grade < rec.grade && !answered.has(s.id);
  const pre = ancestors(byId, rec.id).filter(below);
  const near = [s => unitOf(s) === rec.unit, s => s.strand === rec.strand, () => true];
  // One rung down first. A follow-up that jumps from a Grade 5 miss to Grade 3
  // leaves Grade 4 unknown, and the placement has to read that cautiously, so
  // in simulation a third of children a grade behind came out two behind. So:
  // what it stands on one grade down, then the same sub-strand one grade down
  // even if the graph does not link them, and only then further.
  //
  // At each rung, stay in the same sub-strand, then the same strand, before
  // reaching across: a missed AREA question is chased into area and
  // measurement, not into whichever arithmetic skill carries the most weight
  // in the graph, which would find a different gap than the one that broke.
  const oneDown = rec.grade - 1;
  for (const n of near) {
    const cands = pre.filter(s => s.grade === oneDown && n(s));
    if (cands.length) return best(pool, cands, balances);
  }
  const sameUnitOneDown = pool.filter(s => below(s) && s.grade === oneDown && unitOf(s) === rec.unit);
  if (sameUnitOneDown.length) return best(pool, sameUnitOneDown, balances);
  for (const n of near) {
    const cands = pre.filter(n);
    if (!cands.length) continue;
    const top = Math.max(...cands.map(s => s.grade));
    return best(pool, cands.filter(s => s.grade === top), balances);
  }
  const sameUnit = pool.filter(s => below(s) && unitOf(s) === rec.unit);
  if (sameUnit.length) {
    const top = Math.max(...sameUnit.map(s => s.grade));
    return best(pool, sameUnit.filter(s => s.grade === top), balances);
  }
  return best(pool, pool.filter(s => below(s) && s.grade === rec.grade - 1 && s.strand === rec.strand), balances);
};

// ---------------------------------------------------------------------------
// The next question. Returns a pool entry (with `probeFor` set on a follow-up),
// or null when the test is finished.
// ---------------------------------------------------------------------------
export const selectQuestion = (asked, declared, pool, balances = {}) => {
  if (asked.length >= MAX_QUESTIONS) return null;
  const start = clampGrade(pool, declared);
  if (start == null) return null;
  const answered = new Set(asked.map(a => a.id));

  // 1. Every sub-strand of the declared grade.
  const sweep = sweepRows(asked, start);
  const sweptUnits = new Set(sweep.map(unitOf));
  for (const u of unitsAt(pool, start)) {
    if (sweptUnits.has(u)) continue;
    const pick = best(pool, pool.filter(s => s.grade === start && unitOf(s) === u && !answered.has(s.id)), balances);
    if (pick) return pick;
  }

  // 2. Follow each miss down the ladder, breadth first.
  const byId = new Map(pool.map(s => [s.id, s]));
  const misses = sweep.filter(a => !a.correct);
  for (let depth = 1; depth <= MAX_PROBE_DEPTH; depth++) {
    for (const m of misses) {
      const thread = asked.filter(a => a.probeFor === unitOf(m));
      if (thread.length !== depth - 1) continue;
      const last = thread.length ? thread[thread.length - 1] : m;
      if (last.correct) continue; // found the rung that holds
      const pick = probeBelow(pool, byId, { ...last, unit: unitOf(m) }, answered, balances);
      if (pick) return { ...pick, probeFor: unitOf(m) };
    }
  }

  // 3. A near-flawless sweep earns a short stretch, stopping at the first miss.
  const gmax = gradesIn(pool).slice(-1)[0];
  if ((accuracy(sweep) ?? 0) >= STRETCH_GATE && start + 1 <= gmax) {
    const up = start + 1;
    const stretch = sweepRows(asked, up);
    const strands = strandsAt(pool, up);
    if (stretch.every(a => a.correct) && stretch.length < Math.min(STRETCH_PROBE, strands.length)) {
      const done = new Set(stretch.map(a => a.strand));
      for (const st of strands) {
        if (done.has(st)) continue;
        const pick = best(pool, pool.filter(s => s.grade === up && s.strand === st && !answered.has(s.id)), balances);
        if (pick) return pick;
      }
    }
  }
  return null;
};

/**
 * Whether there is room to ask one more NEW question, given how many have been
 * asked in total (confirming re-asks included). One slot is always held back,
 * so the last question can still be confirmed if it is answered wrong.
 *
 * Without the reserve, follow-ups — which come last, and sit BELOW the declared
 * grade — were asked in the final slots with no room to re-ask them. A single
 * careless slip there went unconfirmed, and because the result names the
 * LOWEST gap it found, that slip became the headline: in simulation, 16 of 19
 * parents told about a step their child actually had were told it this way.
 */
export const roomForAnother = (totalAsked) => totalAsked < MAX_QUESTIONS - 1;

export const isComplete = (asked, declared, pool) =>
  asked.length >= MAX_QUESTIONS || selectQuestion(asked, declared, pool) == null;

// ---------------------------------------------------------------------------
// The placement itself.
//
// Cleared the declared sweep: the declared grade, or one above it on a full,
// flawless stretch. Didn't: walk down the grades the follow-ups reached and
// stop at the first that holds. Grades with no questions are stepped over, not
// taken as the floor — a follow-up goes to what a skill stands on, which can
// be two grades down, and a gap in what was ASKED is not evidence of anything.
// If nothing below holds, the learner sits one under the lowest grade asked.
// ---------------------------------------------------------------------------
export const computePlacement = (asked, declared, pool) => {
  const start = clampGrade(pool, declared);
  if (start == null) return declared ?? null;
  const grades = gradesIn(pool), gmin = grades[0];
  const sweep = sweepRows(asked, start);
  if (!sweep.length) return declared ?? null;

  if (accuracy(sweep) >= CLEAR) {
    const up = start + 1;
    const stretch = sweepRows(asked, up);
    const need = Math.min(STRETCH_PROBE, strandsAt(pool, up).length);
    return need > 0 && stretch.length >= need && stretch.every(a => a.correct) ? up : start;
  }
  // Each sub-strand of the sweep "holds" at some grade: the declared grade if
  // it was answered right; otherwise the first rung down its follow-ups found
  // right, or one below the lowest rung they failed on if none was. The
  // placement is the highest grade at which CLEAR of them hold.
  //
  // A right follow-up counts at its OWN grade, not one under the miss: a
  // follow-up goes to what a skill stands on, which can be three grades down,
  // and crediting the grades in between would credit work nobody asked about.
  // Placing a little low costs a few easy questions; placing high gives a
  // child work they cannot do.
  //
  // The follow-ups are NOT a sample of the grade below: they chase the threads
  // that failed, by design. An earlier version judged each lower grade by the
  // accuracy of whatever was asked there, so one deep gap — failing six Grade 5
  // sub-strands and every follow-up under them — dragged an on-grade child two
  // grades down. In simulation that put 41% of on-grade children with a gap
  // more than a grade off. Counting per sub-strand keeps one weak area one
  // weak area.
  //
  // A miss the cap left with no follow-up says the thread is below the declared
  // grade and nothing about how far, so it does not vote: counting it as "one
  // grade down" placed children two grades behind one grade too high, because
  // a child missing most of the sweep is exactly the child whose later threads
  // the cap cuts off. The sweep was not cleared, so the result is at most one
  // grade below it whatever the votes say.
  const holds = [];
  for (const rec of sweep) {
    if (rec.correct) { holds.push(start); continue; }
    const thread = asked.filter(a => a.probeFor === unitOf(rec));
    if (!thread.length) continue;
    const right = thread.find(a => a.correct);
    if (right) { holds.push(right.grade); continue; }
    holds.push(Math.min(rec.grade, ...thread.map(a => a.grade)) - 1);
  }
  if (!holds.length) return Math.max(gmin, start - 1);
  holds.sort((a, b) => b - a);
  const at = holds[Math.max(0, Math.ceil(CLEAR * holds.length) - 1)];
  return Math.max(gmin, Math.min(start - 1, at));
};

/**
 * Whether a wrong answer is worth re-asking before it counts as a gap.
 *
 * The re-ask protects a child who knows their grade from being told about a
 * gap they do not have because of one careless slip. For a SWEEP question, a
 * child already missing more than a third of what they have been asked is not
 * slipping, and the miss is followed down regardless; the re-ask would spend a
 * question that could follow another thread to where it holds.
 */
export const worthConfirming = (record) => {
  // A wrong FOLLOW-UP is always re-asked. Follow-ups sit below the declared
  // grade, and the result names the LOWEST gap it finds, so a slip there
  // becomes the headline. Skipping their re-ask for struggling children took
  // the false-alarm rate in simulation from 2% to 13%.
  const last = record[record.length - 1];
  if (last?.probeFor) return true;
  if (record.length < 4) return true;
  return record.filter(r => !r.correct).length / record.length <= 1 / 3;
};

// A plain-language account of what the test concluded, for the result screen.
export const explainPlacement = (asked, declared, pool) => {
  const placement = computePlacement(asked, declared, pool);
  const start = clampGrade(pool, declared);
  const sweep = start == null ? [] : sweepRows(asked, start);
  const byStrand = {};
  for (const a of asked) {
    byStrand[a.strand] ||= { correct: 0, total: 0 };
    byStrand[a.strand].total++;
    if (a.correct) byStrand[a.strand].correct++;
  }
  return {
    placement,
    declared,
    questions: asked.length,
    gradesTested: [...new Set(asked.map(a => a.grade))].sort((a, b) => a - b),
    sweptGrade: start,
    subStrandsSwept: new Set(sweep.map(unitOf)).size,
    subStrandsInGrade: start == null ? 0 : unitsAt(pool, start).length,
    weakSubStrands: [...new Set(sweep.filter(a => !a.correct).map(unitOf))],
    weakStrands: [...new Set(asked.filter(a => !a.correct).map(a => a.strand))],
    stretched: placement > declared,
    behindBy: Number.isFinite(declared) ? Math.max(0, declared - placement) : 0,
    byStrand,
  };
};

export default {
  CLEAR, STRETCH_GATE, MAX_QUESTIONS, STRETCH_PROBE, MAX_PROBE_DEPTH,
  buildPlacementPool, gradesIn, unitsAt, gradeAccuracy, sweepRemaining, roomForAnother, worthConfirming,
  selectQuestion, isComplete, computePlacement, explainPlacement,
};
