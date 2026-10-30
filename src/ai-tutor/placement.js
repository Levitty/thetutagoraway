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
//      five questions across its strands, four right to count. Never more than one grade.
//
// Every function derives its answer from the questions asked so far, so there
// is no phase state to persist and a half-finished test resumes from its
// answers alone. Each record carries `unit` (its sub-strand) and, for a
// follow-up, `probeFor` (the sub-strand whose miss it is chasing).
// ============================================================================
import { gradeOf, strandOf, isEnrichment, NATIVE } from './curricula.js';

export const CLEAR = 0.65;          // share of the declared sweep needed to clear the grade
export const STRETCH_GATE = 0.9;    // share of the sweep needed before a stretch is offered
export const BASE_QUESTIONS = 40;   // the ceiling for most children, confirmations included
export const MAX_QUESTIONS = 50;    // the hard ceiling: a child missing most of their grade (see questionCap)
export const STRUGGLING = 0.5;      // sweep accuracy below which the longer ceiling applies
export const STRETCH_PROBE = 5;     // stretch questions, one per sub-strand of the grade above
// Misses a full five-question stretch may carry and still count. Asking for
// five out of five missed one child in three who really is a grade ahead: a
// single gap anywhere in five strands blocked it. A miss is re-asked first, so
// this is a real miss, and four strands of the grade above still have to hold.
export const STRETCH_MISSES = 1;
const stretchAllowance = (need) => (need >= STRETCH_PROBE ? STRETCH_MISSES : 0);
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
        weight: s.weight || 0,
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
  if (asked.length >= questionCap(asked, declared, pool)) return null;
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
    // After every thread has its first follow-up: go straight for a missing
    // step they share, before spending questions on second and third rungs.
    if (depth === 2) {
      const hunt = huntSharedRoot(asked, pool, byId, start);
      if (hunt) return hunt;
    }
    for (const m of misses) {
      const thread = asked.filter(a => a.probeFor === unitOf(m));
      if (thread.length !== depth - 1) continue;
      const last = thread.length ? thread[thread.length - 1] : m;
      if (last.correct) continue; // found the rung that holds
      const pick = probeBelow(pool, byId, { ...last, unit: unitOf(m) }, answered, balances);
      if (pick) return { ...pick, probeFor: unitOf(m) };
    }
  }

  // 3. A near-flawless sweep earns a short stretch, stopping once it cannot count.
  const gmax = gradesIn(pool).slice(-1)[0];
  if ((accuracy(sweep) ?? 0) >= STRETCH_GATE && start + 1 <= gmax) {
    // One grade, and only one. A climb that let each cleared stretch earn the
    // next (18 Oct) placed a Grade 6 child who knows everything at Grade 12 and
    // showed them surds and logarithms. The ceiling is deliberate: the check
    // places a child in the year above at most, and the daily practice moves
    // them on from there as fast as they show they can go.
    const up = start + 1;
    const stretch = sweepRows(asked, up);
    // One question per sub-strand of the grade above, strands interleaved, so
    // five questions reach every strand. One per STRAND was four questions in
    // CBC, which has four strands, and four-of-four left no room for a miss.
    const units = unitsAt(pool, up);
    const need = Math.min(STRETCH_PROBE, units.length);
    if (stretch.filter(a => !a.correct).length <= stretchAllowance(need) && stretch.length < need) {
      const done = new Set(stretch.map(unitOf));
      for (const u of units) {
        if (done.has(u)) continue;
        const pick = best(pool, pool.filter(s => s.grade === up && unitOf(s) === u && !answered.has(s.id)), balances);
        if (pick) return pick;
      }
    }
  }

  // 4. Settle the headline before it is said. See nextToSettle.
  const settle = nextToSettle(asked, pool);
  return settle ? { ...settle, settle: true } : null;
};

/**
 * The one skill most of the wrong answers stand on, asked directly.
 *
 * A gap deep down — Grade 2 counting, Grade 1 addition — fails nearly every
 * arithmetic question above it. The follow-ups go down one rung at a time, so
 * each thread fails at Grade 4, then Grade 3, and runs out of depth or of
 * questions before reaching Grade 2. Every failure then looks like its own gap,
 * and in simulation such children came out a grade or two low. Asking the
 * shared ancestor directly settles it in one question: wrong, and the misses
 * above it are one gap (see sharedRootsBelow); right, and the next candidate
 * is tried, up to MAX_HUNTS.
 *
 * A candidate stands under at least three wrong answers below the declared
 * grade's sweep, and under nothing the child answered right — answering a
 * skill right is evidence for everything it stands on.
 */
export const MAX_HUNTS = 4;
const huntSharedRoot = (asked, pool, byId, start) => {
  if (asked.filter(a => a.hunt).length >= MAX_HUNTS) return null;
  const answered = new Set(asked.map(a => a.id));
  const wrong = asked.filter(a => !a.correct);
  const vouched = new Set();
  for (const a of asked) if (a.correct) for (const p of ancestors(byId, a.id)) vouched.add(p.id);
  const counts = new Map();
  for (const w of wrong) {
    for (const p of ancestors(byId, w.id)) {
      if (p.grade >= start || answered.has(p.id) || vouched.has(p.id)) continue;
      counts.set(p.id, (counts.get(p.id) || 0) + 1);
    }
  }
  const cands = [...counts.entries()].filter(([, n]) => n >= 3);
  if (!cands.length) return null;
  // Most explanatory first; among equals the highest grade, the nearest rung.
  cands.sort((a, b) => b[1] - a[1] || byId.get(b[0]).grade - byId.get(a[0]).grade || String(a[0]).localeCompare(String(b[0])));
  return { ...byId.get(cands[0][0]), hunt: true };
};

/**
 * The missing step the result page is about to name, if it has not yet been
 * asked a final time. Every miss is already re-asked once; this is a third ask
 * for the ONE miss that becomes the headline.
 *
 * Why: with every miss confirmed, all the false alarms left in simulation were
 * the same thing — a child slipping twice on a skill they know. That is rare
 * per question (about 1 in 300), but a check asks thirty, and the result names
 * the lowest miss it finds, so a double slip below the child's real gap became
 * the headline. A third ask costs one question; a real gap still answers wrong.
 * Right this time and the miss is withdrawn, and the next candidate is settled.
 *
 * The candidate is ranked the way the result page ranks it (missingStep.js): a
 * root miss — nothing wrong beneath it in the record — lowest grade first, then
 * critical, then weight. "I haven't learned this yet" is not re-asked: the
 * child has said so.
 */
export const nextToSettle = (asked, pool) => {
  const byId = new Map(pool.map(s => [s.id, s]));
  const wrong = asked.filter(a => !a.correct);
  const wrongIds = new Set(wrong.map(a => a.id));
  const roots = wrong.filter(a => !ancestors(byId, a.id).some(p => wrongIds.has(p.id)));
  if (!roots.length) return null;
  const rank = (a) => byId.get(a.id) || a;
  const head = [...roots].sort((a, b) =>
    a.grade - b.grade ||
    (rank(b).critical ? 1 : 0) - (rank(a).critical ? 1 : 0) ||
    (rank(b).weight || 0) - (rank(a).weight || 0) ||
    String(a.id).localeCompare(String(b.id)))[0];
  if (head.skipped || head.settled || !byId.has(head.id)) return null;
  return { ...byId.get(head.id), probeFor: head.probeFor };
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
export const roomForAnother = (totalAsked, asked, declared, pool) =>
  totalAsked < questionCap(asked, declared, pool) - 1;

/**
 * How many questions this child's check may run to, confirmations included.
 *
 * Forty for most children. A child who has missed most of their declared
 * grade's sweep gets up to fifty: they miss nearly every topic, each miss is
 * re-asked, and at forty the check ran out before showing that the grade below
 * holds — in simulation a quarter of Grade 4-5 children a grade behind with an
 * early arithmetic gap were placed one grade too low for that reason alone.
 * Only the cap moves; nothing else about their check changes.
 */
export const questionCap = (asked, declared, pool) => {
  if (!asked || !pool) return BASE_QUESTIONS;
  const start = clampGrade(pool, declared);
  if (start == null) return BASE_QUESTIONS;
  const sweep = sweepRows(asked, start);
  if (!sweep.length || sweepRemaining(asked, declared, pool) > 0) return BASE_QUESTIONS;
  return accuracy(sweep) < STRUGGLING ? MAX_QUESTIONS : BASE_QUESTIONS;
};

export const isComplete = (asked, declared, pool) =>
  asked.length >= questionCap(asked, declared, pool) || selectQuestion(asked, declared, pool) == null;

/**
 * What the check asks after an answer: the same skill once more to confirm a
 * fresh miss, a new question while a slot is left, or the final ask on the
 * missing step about to be named. `total` counts every question asked so far,
 * this one included; `record` and `pending` are the state after this answer.
 * Returns { next, confirm, cap }, with next null when the check is over.
 *
 * One skill is asked at most three times: once, once to confirm a miss and
 * once as the final ask. Anything that would serve it again ends the check
 * instead of looping (F21, 25 Oct: a demo run showed one angle question fifty
 * times; a child must never be held on one topic).
 */
export const nextAfterAnswer = ({ skill, total, record, pending, declared, pool, balances = {} }) => {
  const cap = questionCap(record, declared, pool);
  const confirm = !!pending && pending.id === skill?.id && worthConfirming(record)
    && total + sweepRemaining(record, declared, pool) < cap;
  if (confirm) return { next: skill, confirm, cap };
  const fresh = roomForAnother(total, record, declared, pool);
  const next = fresh ? selectQuestion(record, declared, pool, balances)
    : total < cap ? nextToSettle(record, pool) : null;
  const row = next && record.find(r => r.id === next.id);
  // A new question never repeats an asked skill; a final ask happens once.
  const repeat = !!row && (row.settled || (fresh && !next.settle));
  const over = total >= cap || !next || repeat || isComplete(record, declared, pool);
  return { next: over ? null : next, confirm: false, cap };
};

// ---------------------------------------------------------------------------
// The placement itself.
//
// Cleared the declared sweep: the declared grade, or one above it on a full
// stretch with at most STRETCH_MISSES misses. Didn't: walk down the grades the follow-ups reached and
// stop at the first that holds. Grades with no questions are stepped over, not
// taken as the floor — a follow-up goes to what a skill stands on, which can
// be two grades down, and a gap in what was ASKED is not evidence of anything.
// If nothing below holds, the learner sits one under the lowest grade asked.
// ---------------------------------------------------------------------------
// One missing step low down can knock over half a grade. A Grade 5 child who
// never secured Grade 3 multiplication misses Grade 5 multiplication, division,
// area and money — and the follow-ups under each of those all bottom out on
// that same Grade 3 skill. Counted topic by topic that reads as "a grade
// behind", and in simulation it placed 29% of such on-grade children more than
// a grade low, giving them a year of work they can already do. It is one gap,
// and the missing step on the result page is where practice starts anyway.
//
// So: find the ROOT failures — wrong answers with nothing wrong beneath them
// in the record. If at most MAX_SHARED_ROOTS roots, all below the declared
// grade, account for the sweep's misses (each miss stands on one of them), and
// the sweep clears once those misses are set aside, the child is placed on
// their grade. A child genuinely a grade behind does not look like this: their
// follow-ups one grade down come back right, so each miss is its own root at
// the declared grade, and many of them.
export const MAX_SHARED_ROOTS = 2;
const singleRootGap = (asked, sweep, start, pool) => {
  const byId = new Map(pool.map(s => [s.id, s]));
  const wrongIds = new Set(asked.filter(a => !a.correct).map(a => a.id));
  if (!wrongIds.size) return false;
  const anc = new Map();
  const ancOf = (id) => {
    if (!anc.has(id)) anc.set(id, new Set(ancestors(byId, id).map(s => s.id)));
    return anc.get(id);
  };
  const roots = [...wrongIds].filter(id => ![...ancOf(id)].some(p => wrongIds.has(p)));
  if (!roots.length || roots.length > MAX_SHARED_ROOTS) return false;
  if (roots.some(id => (byId.get(id)?.grade ?? start) >= start)) return false;
  // Every root must be shared — standing under at least two sweep misses — so
  // one stray slip low down cannot excuse a grade's worth of misses.
  const misses = sweep.filter(a => !a.correct);
  const under = (root) => misses.filter(m => ancOf(m.id).has(root)).length;
  if (roots.some(r => under(r) < 2)) return false;
  const explained = misses.filter(m => roots.some(r => ancOf(m.id).has(r))).length;
  return (sweep.length - misses.length + explained) / sweep.length >= CLEAR;
};

// The same mistake one grade down. A child working at Grade 4 who is entered
// as Grade 5 misses the sweep, and each miss is followed into Grade 4. The
// follow-ups prefer the most load-bearing skills, which is exactly where a gap
// sits, so one Grade 3 gap failed Grade 4 follow-up after follow-up and the
// child came out at Grade 3: in simulation, 125 of 346 such children in Grades
// 4-5. A follow-up that failed only because it stands on a shared root miss
// below it — and there are at most MAX_SHARED_ROOTS of those under the
// declared grade — says that one step is missing, not that its grade is. It
// counts as holding, and the root is the step the result page names.
const sharedRootsBelow = (asked, start, pool) => {
  const byId = new Map(pool.map(s => [s.id, s]));
  const wrongIds = new Set(asked.filter(a => !a.correct).map(a => a.id));
  const anc = new Map();
  const ancOf = (id) => {
    if (!anc.has(id)) anc.set(id, new Set(ancestors(byId, id).map(s => s.id)));
    return anc.get(id);
  };
  const below = [...wrongIds].filter(id => (byId.get(id)?.grade ?? start) < start
    && ![...ancOf(id)].some(p => wrongIds.has(p)));
  if (!below.length || below.length > MAX_SHARED_ROOTS) return { explains: () => false };
  const shared = below.filter(r => [...wrongIds].filter(id => ancOf(id).has(r)).length >= 2);
  return {
    explains: (rec) => shared.some(r => r !== rec.id
      && (byId.get(r)?.grade ?? rec.grade) < rec.grade && ancOf(rec.id).has(r)),
  };
};

// Has the child cleared the stretch at this grade? One question per
// sub-strand, at most STRETCH_MISSES wrong.
const stretchCleared = (asked, pool, grade) => {
  const need = Math.min(STRETCH_PROBE, unitsAt(pool, grade).length);
  if (!need) return false;
  const rows = sweepRows(asked, grade);
  return rows.length >= need && rows.filter((a) => !a.correct).length <= stretchAllowance(need);
};

export const computePlacement = (asked, declared, pool) => {
  const start = clampGrade(pool, declared);
  if (start == null) return declared ?? null;
  const grades = gradesIn(pool), gmin = grades[0];
  const sweep = sweepRows(asked, start);
  if (!sweep.length) return declared ?? null;

  if (accuracy(sweep) >= CLEAR) {
    // At most one grade above the declared one; see the selector.
    return start + 1 <= grades[grades.length - 1] && stretchCleared(asked, pool, start + 1) ? start + 1 : start;
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
  if (singleRootGap(asked, sweep, start, pool)) return start;
  const roots = sharedRootsBelow(asked, start, pool);
  const holds = [];
  for (const rec of sweep) {
    if (rec.correct) { holds.push(start); continue; }
    const thread = asked.filter(a => a.probeFor === unitOf(rec));
    if (!thread.length) continue;
    const right = thread.find(a => a.correct || roots.explains(a));
    if (right) { holds.push(right.grade); continue; }
    holds.push(Math.min(rec.grade, ...thread.map(a => a.grade)) - 1);
  }
  if (!holds.length) return Math.max(gmin, start - 1);
  holds.sort((a, b) => b - a);
  const at = holds[Math.max(0, Math.ceil(CLEAR * holds.length) - 1)];
  return Math.max(gmin, Math.min(start - 1, at));
};

/**
 * Whether a wrong answer is worth re-asking before it counts as a gap: always.
 *
 * An earlier version skipped the re-ask on SWEEP questions once a child had
 * missed more than a third of the check, to save questions for follow-ups. In
 * simulation that was half of all false alarms: a single careless slip on a
 * topic the child knew went unconfirmed and was named as their missing step.
 * Bringing it back once the final ask (nextToSettle) existed was tried too:
 * false alarms rose from 0% to 3% and placement did not improve, because a
 * child missing most of the sweep runs into the cap either way.
 */
export const worthConfirming = () => true;

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
  CLEAR, STRETCH_GATE, BASE_QUESTIONS, MAX_QUESTIONS, STRUGGLING, questionCap, STRETCH_PROBE, STRETCH_MISSES, MAX_PROBE_DEPTH,
  buildPlacementPool, gradesIn, unitsAt, nextToSettle, nextAfterAnswer, MAX_HUNTS, gradeAccuracy, sweepRemaining, roomForAnother, worthConfirming,
  selectQuestion, isComplete, computePlacement, explainPlacement,
};
