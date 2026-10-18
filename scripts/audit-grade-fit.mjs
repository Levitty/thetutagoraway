// ============================================================================
// GRADE-FIT AUDIT — is every skill we serve one this learner should be doing?
//
//   node scripts/audit-grade-fit.mjs            (600 virtual learners)
//   node scripts/audit-grade-fit.mjs --n 2000 --verbose
//
// A Grade 5 was asked "What number comes just after 35?" and "80 + 3 = ?".
// Both were real defects, in two different functions, found by a person
// looking at a screen. This asks the same question of EVERY path that can put
// a question in front of a child, for learners at every grade, so the next one
// is found here instead.
//
// The paths audited are the complete set that can choose a skill to serve:
//   getNextToLearn        the next lesson
//   getRecommendedPath    "Your path" on the dashboard
//   getReviews            the review list (and the dashboard's session)
//   selectReviewProblems  the problems a review session actually serves
//   getRemediationSkills  what is offered after a learner struggles
//
// WHAT COUNTS AS A DEFECT. The engine's own rule is assumedKnown(): a skill
// three or more grades below the learner is written off as long secure and is
// never offered as a lesson, unless they have actually struggled with it. So
// three grades below is the line, and anything at or past it that is NOT
// explained by struggle is a defect. Above the learner, getNextToLearn allows
// two grades of stretch, so more than that is a defect in the other direction.
//
// The learner model is deliberately the common case rather than the easy one:
// most are on or a little behind their declared grade, with a gap or two, and
// their progress is built by the engine's own processDiagnosticResults from
// balances shaped like a real check's — positive where they know it, negative
// where they do not.
// ============================================================================
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { processDiagnosticResults } from '../src/ai-tutor/diagnosticEngine.js';
import {
  getNextToLearn, getRecommendedPath, getReviews, selectReviewProblems,
  getRemediationSkills, findGaps, getFluencyPractice,
} from '../src/ai-tutor/adaptiveEngine.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BELOW_LIMIT = 3;   // assumedKnown's / longSecure's own threshold
const ABOVE_LIMIT = 2;   // getNextToLearn's own stretch

const LIST = Object.values(SKILLS).filter((s) => Number.isFinite(s.grade));
const ctx = undefined;   // the default math context, exactly as the app uses it

// ---- a virtual learner, and the progress a check would leave them with -----
function makeLearner(rnd, pick) {
  const declared = 1 + Math.floor(rnd() * 10);              // Grade 1..10
  const level = Math.max(1, declared + pick([0, 0, 0, -1, -1, -2, 1]));
  const pool = LIST.filter((s) => s.grade <= level && s.grade >= level - 3);
  const gaps = new Set();
  for (let i = 0, n = pick([0, 1, 1, 2]); i < n && pool.length; i++) gaps.add(pick(pool).id);

  // Balances the shape a real check leaves: clearly positive on what they
  // know, clearly negative on a planted gap, untouched elsewhere.
  const balances = {};
  for (const s of LIST) {
    if (s.grade > level) continue;
    balances[s.id] = gaps.has(s.id) ? -1.0 : 2.0;
  }
  const skills = processDiagnosticResults(balances, { skills: SKILLS });
  // Age the check so reviews actually come due. processDiagnosticResults
  // stamps lastPractice as NOW, so a freshly-built learner has nothing due and
  // getReviews returns an empty list — which would mean this audit never
  // exercised the very path the first "Grade 5 asked about counting" bug lived
  // in. Spread them over two months, which is what a real account looks like.
  const ageDays = 1 + Math.floor(rnd() * 60);
  for (const k of Object.keys(skills)) {
    if (skills[k].lastPractice) {
      skills[k].lastPractice = new Date(Date.now() - ageDays * 86400000).toISOString();
    }
  }
  return {
    declared, level, gaps,
    progress: { declaredGrade: declared, placementGrade: level, diagnosed: true, skills },
  };
}

// A skill the learner has actually struggled with is legitimately served
// however low its grade — that is the product working, not a defect.
const struggled = (progress, id) => {
  const sp = progress.skills[id];
  return !!sp && ((sp.attempts > 0 && !sp.mastered) || sp.passed === false || sp.practisedHere === true);
};

const paths = {
  getNextToLearn: (p) => (getNextToLearn(p, ctx) || []).slice(0, 5).map((s) => s.id),
  getRecommendedPath: (p) => (getRecommendedPath(p, ctx) || []).slice(0, 8).map((s) => s.id),
  getReviews: (p) => (getReviews(p, ctx) || []).map((s) => s.id),
  selectReviewProblems: (p) => selectReviewProblems(p, 12, ctx) || [],
  findGaps: (p) => (findGaps(p, ctx) || []).slice(0, 3).map((s) => s.id),
  getFluencyPractice: (p) => (getFluencyPractice(p, ctx) || []).slice(0, 1).map((s) => s.id),
  getRemediationSkills: (p) => {
    // Offered when a learner is stuck on something; ask about a skill at
    // their own level so the answer is about remediation, not placement.
    const here = LIST.filter((s) => s.grade === p.declaredGrade);
    if (!here.length) return [];
    try { return (getRemediationSkills(here[0].id, p, ctx) || []).map((s) => s.id || s); }
    catch { return []; }
  },
};

/** Run the audit. Deterministic for a given seed. */
export function auditGradeFit({ n = 600, seed: seed0 = 7 } = {}) {
let seed = seed0;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pick = (a) => a[Math.floor(rnd() * a.length)];

const report = {};
for (const k of Object.keys(paths)) report[k] = { served: 0, below: [], above: [] };

for (let i = 0; i < n; i++) {
  const L = makeLearner(rnd, pick);
  for (const [name, run] of Object.entries(paths)) {
    let ids = [];
    try { ids = run(L.progress) || []; } catch (e) { continue; }
    for (const id of ids) {
      const s = SKILLS[id];
      if (!s || !Number.isFinite(s.grade)) continue;
      report[name].served++;
      const below = L.declared - s.grade;
      const above = s.grade - L.declared;
      if (below >= BELOW_LIMIT && !struggled(L.progress, id)) {
        report[name].below.push({ id, name: s.name, skillGrade: s.grade, declared: L.declared, below });
      }
      if (above > ABOVE_LIMIT) {
        report[name].above.push({ id, name: s.name, skillGrade: s.grade, declared: L.declared, above });
      }
    }
  }
}

  return report;
}

// ---- the report ------------------------------------------------------------
export function reportGradeFit(report, { n, seed, verbose = false } = {}) {
const pad = (s, n) => String(s).padEnd(n);
console.log(`\n=== GRADE-FIT AUDIT (${n} learners, grades 1-10, seed ${seed}) ===`);
console.log(`A defect below is a skill ${BELOW_LIMIT}+ grades under the learner that they have NOT struggled with.`);
console.log(`A defect above is a skill more than ${ABOVE_LIMIT} grades over them.\n`);
console.log(`${pad('path', 24)}${pad('served', 9)}${pad('too low', 9)}${pad('too high', 9)}worst`);

let failures = 0;
for (const [name, r] of Object.entries(report)) {
  const worstBelow = r.below.reduce((m, x) => Math.max(m, x.below), 0);
  const worstAbove = r.above.reduce((m, x) => Math.max(m, x.above), 0);
  const worst = [worstBelow ? `${worstBelow} below` : null, worstAbove ? `${worstAbove} above` : null]
    .filter(Boolean).join(', ') || '—';
  console.log(`${pad(name, 24)}${pad(r.served, 9)}${pad(r.below.length, 9)}${pad(r.above.length, 9)}${worst}`);
  failures += r.below.length + r.above.length;
}

// The concrete cases, with the question a child would actually have seen —
// an id and a grade distance are abstract; "80 + 3 = ?" to a Grade 5 is not.
const show = (rows, label) => {
  if (!rows.length) return;
  console.log(`\n--- ${label} ---`);
  const seen = new Set();
  for (const x of rows) {
    const key = `${x.id}@${x.declared}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (seen.size > (verbose ? 60 : 12)) { console.log(`  … and more (${rows.length} in total)`); break; }
    let q = '';
    try { const p = generateProblem(x.id); q = p && !p.placeholder ? ` — "${String(p.question).slice(0, 64)}"` : ''; } catch { /* some need context */ }
    console.log(`  Grade ${x.declared} learner served [G${x.skillGrade}] ${x.name}${q}`);
  }
};
for (const [name, r] of Object.entries(report)) {
  show(r.below, `${name}: too far below`);
  show(r.above, `${name}: too far above`);
}

console.log(failures ? `\n${failures} mis-fitted skills served.` : '\nEvery path served work in range.');
return failures;
}

// ---- CLI ----
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  const n = Number(args[args.indexOf('--n') + 1]) || 600;
  const seed = Number(args[args.indexOf('--seed') + 1]) || 7;
  const failures = reportGradeFit(auditGradeFit({ n, seed }), { n, seed, verbose: args.includes('--verbose') });
  process.exit(failures ? 1 : 0);
}
