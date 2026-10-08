// ============================================================================
// PLACEMENT SIMULATION — run: node scripts/sim-placement.mjs
//
// Compares the new sweep placement against the old focus-walk on the three
// faults a teacher found in one sitting:
//   1. OVERSHOOT   — questions asked ABOVE the declared grade (a Grade 6 entry
//                    that reaches calculus).
//   2. STRANDS     — how many of the 5 strands the test actually touches, and
//                    how lopsided it is toward Numbers.
//   3. PLACEMENT   — |placed − true frontier|, and how often placement lands
//                    above the declared grade.
//
// Student model: answers a skill at or below their frontier correctly with
// p=0.92, above it with p=0.12 — slips and lucky guesses both happen.
// ============================================================================

import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { propagateCredit } from '../src/ai-tutor/diagnosticEngine.js';
import { selectQuestion, computePlacement, MAX_QUESTIONS } from '../src/ai-tutor/placement.js';

const pool = Object.values(SKILLS).filter(s => Number.isFinite(s.grade));
const gmin = Math.min(...pool.map(s => s.grade)), gmax = Math.max(...pool.map(s => s.grade));
const answer = (grade, frontier) => Math.random() < (grade <= frontier ? 0.92 : 0.12);

// ---- OLD: focus-walk ------------------------------------------------------
// The historical baseline, kept here (and nowhere else) so the comparison is
// reproducible. This is the code that shipped until Oct 2026; note that it
// starts the placement at the lowest grade actually TESTED, which is why a
// Grade 6 entry that was never asked anything below Grade 6 could only ever
// come back as Grade 6 or higher.
const oldPlacement = (skills, results, declared) => {
  const byGrade = {};
  for (const s of skills || []) {
    const r = results?.[s.id];
    if (!r) continue;
    byGrade[s.grade] ||= { correct: 0, total: 0 };
    byGrade[s.grade].total++;
    if (r.correct) byGrade[s.grade].correct++;
  }
  const grades = Object.keys(byGrade).map(Number).sort((a, b) => a - b);
  if (!grades.length) return declared;
  let placement = grades[0];
  for (const g of grades) {
    if (byGrade[g].correct / byGrade[g].total >= 0.5) placement = g;
    else break;
  }
  return placement;
};
const OLD_MIN = 8, OLD_MAX = 20;
const clearedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t >= 0.5;
const failedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t < 0.5;
const pickAt = (focus, answeredSet, balances) => {
  for (let d = 0; d <= gmax - gmin; d++) {
    for (const g of (d === 0 ? [focus] : [focus - d, focus + d])) {
      const cands = pool.filter(s => s.grade === g && !answeredSet.has(s.id));
      if (cands.length) {
        cands.sort((a, b) => (b.critical ? 1 : 0) - (a.critical ? 1 : 0)
          || Math.abs(balances[a.id] || 0) - Math.abs(balances[b.id] || 0));
        return cands[0];
      }
    }
  }
  return null;
};
const runOld = (declared, frontier) => {
  let focus = declared, balances = {}, perGrade = {}, results = {}, asked = [];
  const seen = new Set();
  while (asked.length < OLD_MAX) {
    const skill = pickAt(focus, seen, balances);
    if (!skill) break;
    const correct = answer(skill.grade, frontier);
    seen.add(skill.id);
    asked.push({ grade: skill.grade, strand: skill.strand, correct });
    balances = propagateCredit(balances, skill.id, correct, 1.0);
    results[skill.id] = { correct };
    perGrade[skill.grade] = { c: (perGrade[skill.grade]?.c || 0) + (correct ? 1 : 0), t: (perGrade[skill.grade]?.t || 0) + 1 };
    if (clearedG(perGrade, focus)) focus = Math.min(gmax, focus + 1);
    else if (failedG(perGrade, focus)) focus = Math.max(gmin, focus - 1);
    let bracketed = false;
    if (asked.length >= OLD_MIN) for (let g = gmin; g < gmax; g++) if (clearedG(perGrade, g) && failedG(perGrade, g + 1)) bracketed = true;
    if (bracketed) break;
  }
  const objs = [...seen].map(id => SKILLS[id]).filter(Boolean);
  return { asked, placed: oldPlacement(objs, results, declared) };
};

// ---- NEW: sweep -----------------------------------------------------------
const runNew = (declared, frontier) => {
  const asked = [];
  let balances = {};
  while (asked.length < MAX_QUESTIONS) {
    const skill = selectQuestion(asked, declared, pool, balances);
    if (!skill) break;
    const correct = answer(skill.grade, frontier);
    asked.push({ id: skill.id, grade: skill.grade, strand: skill.strand, correct });
    balances = propagateCredit(balances, skill.id, correct, 1.0);
  }
  return { asked, placed: computePlacement(asked, declared, pool) };
};

// ---- measure --------------------------------------------------------------
const RUNS = 400;
const scenarios = [
  ['G6 solid', 6, 6], ['G6 one year behind', 6, 5], ['G6 three years behind', 6, 3],
  ['G6 teacher (can do G9)', 6, 9], ['G9 solid', 9, 9], ['G9 two years behind', 9, 7],
  ['G4 solid', 4, 4], ['G11 solid', 11, 11],
  ['G9 five years behind', 9, 4], ['G8 at G2 level', 8, 2],
];
const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;

const measure = (run, declared, frontier) => {
  const over = [], strands = [], numbersShare = [], err = [], qs = [], above = [], maxAbove = [];
  for (let i = 0; i < RUNS; i++) {
    const { asked, placed } = run(declared, frontier);
    const aboveQs = asked.filter(a => a.grade > declared);
    over.push(aboveQs.length);
    maxAbove.push(aboveQs.length ? Math.max(...aboveQs.map(a => a.grade)) - declared : 0);
    strands.push(new Set(asked.map(a => a.strand)).size);
    numbersShare.push(asked.filter(a => a.strand === 'Numbers').length / asked.length);
    err.push(Math.abs(placed - Math.min(frontier, declared + 1)));
    qs.push(asked.length);
    above.push(placed > declared ? 1 : 0);
  }
  return {
    q: med(qs), overQ: mean(over).toFixed(1), maxOver: Math.max(...maxAbove),
    strands: mean(strands).toFixed(1), numbers: (mean(numbersShare) * 100).toFixed(0) + '%',
    err: mean(err).toFixed(2), aboveRate: (mean(above) * 100).toFixed(0) + '%',
  };
};

const pad = (s, n) => String(s).padEnd(n);
console.log('\nOVERSHOOT = questions asked above the declared grade · MAX+ = highest grade above declared reached');
console.log('STRANDS = distinct strands touched (of 5) · NUM% = share of questions that were Numbers');
console.log('ERR = |placed − true level| · ABOVE = runs placing above the declared grade\n');
console.log(pad('SCENARIO', 26) + pad('ENGINE', 7) + pad('Qs', 5) + pad('OVERSHOOT', 11) + pad('MAX+', 6) + pad('STRANDS', 9) + pad('NUM%', 7) + pad('ERR', 7) + 'ABOVE');
console.log('-'.repeat(90));
for (const [name, declared, frontier] of scenarios) {
  for (const [label, run] of [['old', runOld], ['new', runNew]]) {
    const m = measure(run, declared, frontier);
    console.log(pad(label === 'old' ? name : '', 26) + pad(label, 7) + pad(m.q, 5) +
      pad(m.overQ, 11) + pad('+' + m.maxOver, 6) + pad(m.strands + '/5', 9) + pad(m.numbers, 7) + pad(m.err, 7) + m.aboveRate);
  }
  console.log('');
}
