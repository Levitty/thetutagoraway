// ============================================================================
// DIAGNOSTIC PLACEMENT SIMULATION — run: node scripts/sim-diagnostic.mjs
//
// Measures the QUALITY of the grade-anchored diagnostic against simulated
// students, and compares the current linear focus-walk against a bisection
// policy. Metrics per scenario:
//   - questions asked (median)
//   - placement error |placed − true frontier| (mean)
//   - "insulting probe" rate: % of runs that ask ANY question ≥3 grades below
//     the declared grade (the "what comes after 45" moment for a G5 child)
//
// Student model: knows skills at grade ≤ frontier with p=0.92, above with
// p=0.12 (slips and lucky guesses both happen in real life).
// ============================================================================

import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { propagateCredit } from '../src/ai-tutor/diagnosticEngine.js';
import { computePlacementGrade } from '../src/ai-tutor/adaptiveEngine.js';

const DIAG_MIN = 8, DIAG_MAX = 20;
const list = Object.values(SKILLS).filter(s => Number.isFinite(s.grade));
const gmin = Math.min(...list.map(s => s.grade)), gmax = Math.max(...list.map(s => s.grade));

const clearedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t >= 0.5;
const failedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t < 0.5;

const pickAt = (focus, answeredSet, balances, { skipConfident = false } = {}) => {
  for (let d = 0; d <= gmax - gmin; d++) {
    for (const g of (d === 0 ? [focus] : [focus - d, focus + d])) {
      if (g < gmin || g > gmax) continue;
      let cands = list.filter(s => s.grade === g && !answeredSet.has(s.id));
      // evidence-aware: skip skills propagation is already confident about
      if (skipConfident) {
        const unsure = cands.filter(s => Math.abs(balances[s.id] || 0) < 1.5);
        if (unsure.length) cands = unsure;
      }
      if (cands.length) {
        cands.sort((a, b) => (b.critical ? 1 : 0) - (a.critical ? 1 : 0)
          || Math.abs(balances[a.id] || 0) - Math.abs(balances[b.id] || 0));
        return cands[0];
      }
    }
  }
  return null;
};

// ---- policies ---------------------------------------------------------------
// OLD: walk the focus one grade per verdict.
const linearPolicy = () => {
  let focus0;
  return {
    init(declared) { focus0 = declared; return declared; },
    next(focus, perGrade) {
      let f = focus;
      if (clearedG(perGrade, focus)) f = Math.min(gmax, focus + 1);
      else if (failedG(perGrade, focus)) f = Math.max(gmin, focus - 1);
      return { focus: f, bracketed: bracketedLinear(perGrade) };
    },
  };
};
const bracketedLinear = (pg) => {
  for (let g = gmin; g < gmax; g++) if (clearedG(pg, g) && failedG(pg, g + 1)) return true;
  return false;
};

// NEW: bisect between the highest cleared grade and the lowest failed grade.
const bisectPolicy = () => {
  let lo, hi; // lo = highest cleared, hi = lowest failed (invariant lo < hi)
  return {
    init(declared) { lo = gmin - 1; hi = gmax + 1; return declared; },
    next(focus, perGrade) {
      if (clearedG(perGrade, focus)) lo = Math.max(lo, focus);
      else if (failedG(perGrade, focus)) hi = Math.min(hi, focus);
      else return { focus, bracketed: false }; // verdict not in yet — stay
      if (hi - lo <= 1) return { focus, bracketed: true };
      let mid = Math.floor((Math.max(lo, gmin - 1) + Math.min(hi, gmax + 1)) / 2);
      mid = Math.max(gmin, Math.min(gmax, mid));
      return { focus: mid, bracketed: false };
    },
  };
};

// ---- simulation -------------------------------------------------------------
const simulate = (declared, frontier, policyFactory, { skipConfident = false } = {}) => {
  const policy = policyFactory();
  let focus = policy.init(declared);
  let balances = {}, results = {}, perGrade = {};
  const answered = new Set();
  const askedGrades = [];
  let n = 0;
  while (n < DIAG_MAX) {
    const skill = pickAt(focus, answered, balances, { skipConfident });
    if (!skill) break;
    answered.add(skill.id);
    askedGrades.push(skill.grade);
    const p = skill.grade <= frontier ? 0.92 : 0.12;
    const correct = Math.random() < p;
    balances = propagateCredit(balances, skill.id, correct, 1.0);
    results[skill.id] = { correct, timeTaken: 10000 };
    perGrade[skill.grade] = { c: (perGrade[skill.grade]?.c || 0) + (correct ? 1 : 0), t: (perGrade[skill.grade]?.t || 0) + 1 };
    n++;
    const { focus: nf, bracketed } = policy.next(focus, perGrade);
    focus = nf;
    if (bracketed && n >= DIAG_MIN) break;
  }
  const answeredObjs = [...answered].map(id => SKILLS[id]).filter(Boolean);
  const placed = computePlacementGrade(answeredObjs, results, declared);
  return { n, placed, minAsked: Math.min(...askedGrades), askedGrades };
};

const RUNS = 300;
const scenarios = [
  { name: 'G5 solid (frontier 5)', declared: 5, frontier: 5 },
  { name: 'G5 one year behind (frontier 4)', declared: 5, frontier: 4 },
  { name: 'G5 far behind (frontier 2)', declared: 5, frontier: 2 },
  { name: 'G8 solid (frontier 8)', declared: 8, frontier: 8 },
  { name: 'G8 far behind (frontier 4)', declared: 8, frontier: 4 },
  { name: 'G3 ahead (frontier 5)', declared: 3, frontier: 5 },
];

const stats = (arr) => arr.slice().sort((a, b) => a - b)[Math.floor(arr.length / 2)];

// Linear walk but descends TWO grades after a failed verdict when the gap to
// the declared grade is already ≥2 (fast-drop for far-behind students only).
const fastDropPolicy = (declared) => () => ({
  init(d) { return d; },
  next(focus, perGrade) {
    let f = focus;
    if (clearedG(perGrade, focus)) f = Math.min(gmax, focus + 1);
    else if (failedG(perGrade, focus)) f = Math.max(gmin, focus - ((declared - focus) >= 2 ? 2 : 1));
    return { focus: f, bracketed: bracketedLinear(perGrade) };
  },
});

for (const [pname, pf, opts] of [
  ['CURRENT (linear walk)', linearPolicy, {}],
  ['linear + evidence-skip', linearPolicy, { skipConfident: true }],
  ['linear + fast-drop when far below', null, {}],
  ['NEW (bisection + evidence-skip)', bisectPolicy, { skipConfident: true }],
]) {
  console.log(`\n=== ${pname} ===`);
  console.log('scenario'.padEnd(38), 'medQ', 'meanErr', 'insult%', 'minGradeAsked(med)');
  for (const sc of scenarios) {
    const factory = pf || fastDropPolicy(sc.declared);
    const runs = Array.from({ length: RUNS }, () => simulate(sc.declared, sc.frontier, factory, opts));
    const medQ = stats(runs.map(r => r.n));
    const meanErr = (runs.reduce((s, r) => s + Math.abs((r.placed ?? sc.declared) - sc.frontier), 0) / RUNS).toFixed(2);
    const insult = Math.round(100 * runs.filter(r => r.minAsked <= sc.declared - 3).length / RUNS);
    const medMin = stats(runs.map(r => r.minAsked));
    console.log(sc.name.padEnd(38), String(medQ).padEnd(4), String(meanErr).padEnd(7), String(insult).padEnd(7), medMin);
  }
}
