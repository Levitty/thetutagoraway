// ============================================================================
// FREE-CHECK SIMULATION — does the check find the step a child is really
// missing?
//
//   node scripts/simulate-check.mjs            (400 virtual children)
//   node scripts/simulate-check.mjs --n 2000 --full
//
// Replays the free check exactly as AIMastery runs it (grade focus that moves
// up and down, bracketing, 8 to 20 questions, credit propagation, placement,
// missing step) with virtual children who have a true level and hidden gaps.
// Each child answers HOREB's real questions: right answers in children's own
// formats, careless slips, lucky guesses, and "I haven't learned this yet"
// when a skill is truly new. Then HOREB's missing step is compared with the
// truth. The worst outcome is telling a parent their child is missing a skill
// the child actually has.
// ============================================================================

import { SKILLS, getPrerequisiteChain, getPostRequisiteChain } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { propagateCredit, processDiagnosticResults } from '../src/ai-tutor/diagnosticEngine.js';
import { computePlacementGrade } from '../src/ai-tutor/adaptiveEngine.js';
import { findMissingStep } from '../src/site/missingStep.js';

const args = process.argv.slice(2);
const N = Number(args[args.indexOf('--n') + 1]) || 400;
const FULL = args.includes('--full');
const SEED = Number(args[args.indexOf('--seed') + 1]) || 7;
// Defaults match the app. --old replays the check as it was before (no
// confirmation, 8-question minimum) for comparison.
const OLD = args.includes('--old');
const CONFIRM = !OLD;                                       // re-ask a wrong answer once
const MIN = Number(args[args.indexOf('--min') + 1]) || (OLD ? 8 : 12);

// Deterministic randomness for the children (not for the question generators).
let seed = SEED;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pickR = (a) => a[Math.floor(rnd() * a.length)];

const ctx = { skills: SKILLS, getPreChain: (id) => getPrerequisiteChain(id), getPostChain: (id) => getPostRequisiteChain(id) };
const LIST = Object.values(SKILLS).filter(s => Number.isFinite(s.grade));
const DIAG_MIN = MIN, DIAG_MAX = 20;
const gradeSpan = (list) => { const g = list.map(s => s.grade); return [Math.min(...g), Math.max(...g)]; };
const clearedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t >= 0.5;
const failedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t < 0.5;
const pickAt = (list, focus, answeredSet, balances) => {
  const [gmin, gmax] = gradeSpan(list);
  for (let d = 0; d <= gmax - gmin; d++) {
    for (const g of (d === 0 ? [focus] : [focus - d, focus + d])) {
      const cands = list.filter(s => s.grade === g && !answeredSet.has(s.id));
      if (cands.length) {
        cands.sort((a, b) => (b.critical ? 1 : 0) - (a.critical ? 1 : 0) || Math.abs(balances[a.id] || 0) - Math.abs(balances[b.id] || 0));
        return cands[0];
      }
    }
  }
  return null;
};

// ---- a virtual child ---------------------------------------------------------
function makeChild() {
  const declared = 2 + Math.floor(rnd() * 8);                 // Grade 2..9
  const offset = pickR([0, 0, 0, -1, -1, -2, 1]);              // mostly on grade or behind
  const level = Math.max(1, declared + offset);
  const pool = LIST.filter(s => s.grade <= level && s.grade >= level - 3 && s.critical);
  const gaps = new Set();
  const nGaps = pickR([0, 1, 1, 1, 2]);
  for (let i = 0; i < nGaps && pool.length; i++) gaps.add(pickR(pool).id);
  const memo = {};
  const knows = (id) => {
    if (id in memo) return memo[id];
    const s = SKILLS[id];
    memo[id] = false; // cycle guard
    memo[id] = !!s && s.grade <= level && !gaps.has(id) && (s.prerequisites || []).every(p => !SKILLS[p] || knows(p));
    return memo[id];
  };
  return { declared, level, gaps, knows, slip: 0.06, guess: 0.04, honestSkip: 0.7 };
}

const kidType = (p) => {
  const a = String(p.answer).trim();
  const forms = [a, ` ${a}`, `${a}.`];
  if (/^-?\d+$/.test(a) && Math.abs(Number(a)) >= 1000) forms.push(Number(a).toLocaleString('en-US'));
  if (/^[a-z]/i.test(a)) forms.push(a[0].toUpperCase() + a.slice(1));
  return pickR(forms);
};
const wrongType = (p) => {
  const a = String(p.answer).trim();
  if (/^-?\d+$/.test(a)) return String(Number(a) + pickR([-1, 1, 10, -10, 2]));
  return 'I think 7';
};

// ---- one check, exactly as the app runs it ------------------------------------
function runCheck(child) {
  let focus = child.declared, balances = {}, results = {}, perGrade = {};
  const answered = [];
  let current = pickAt(LIST, focus, new Set(), {});
  const markErrors = [];
  let pending = null, asked = 0;      // pending: a wrong answer waiting for its confirming question
  while (current) {
    asked++;
    const p = generateProblem(current.id);
    const known = child.knows(current.id);
    let typed = null, skip = false;
    if (known) typed = rnd() < child.slip ? wrongType(p) : kidType(p);
    else if (rnd() < child.guess) typed = kidType(p);
    else if (rnd() < child.honestSkip) skip = true;
    else typed = wrongType(p);
    const correct = skip ? false : checkAnswerMatch(typed, p);
    if (known && typed === kidType(p) && !correct) markErrors.push(`${current.id}: "${typed}" for ${p.answer}`);
    if (pending && pending.id === current.id) {
      // The confirming question: right means the first was a slip, so the
      // evidence is rebuilt from before it as a right answer; wrong confirms.
      if (correct) {
        balances = propagateCredit(pending.balances, current.id, true, 1.0, ctx);
        results = { ...pending.results, [current.id]: { correct: true, confirmed: true } };
        perGrade = { ...pending.perGrade, [current.grade]: { c: (pending.perGrade[current.grade]?.c || 0) + 1, t: (pending.perGrade[current.grade]?.t || 0) + 1 } };
      }
      pending = null;
    } else {
      const before = { id: current.id, balances, results, perGrade };
      balances = propagateCredit(balances, current.id, correct, 1.0, ctx);
      results = { ...results, [current.id]: { correct, ...(skip ? { skipped: true } : {}) } };
      answered.push(current.id);
      perGrade = { ...perGrade, [current.grade]: { c: (perGrade[current.grade]?.c || 0) + (correct ? 1 : 0), t: (perGrade[current.grade]?.t || 0) + 1 } };
      if (CONFIRM && !correct && !skip) { pending = before; if (asked < DIAG_MAX) continue; }
    }
    const [gmin, gmax] = gradeSpan(LIST);
    if (clearedG(perGrade, focus)) focus = Math.min(gmax, focus + 1);
    else if (failedG(perGrade, focus)) focus = Math.max(gmin, focus - 1);
    let bracketed = false;
    if (answered.length >= DIAG_MIN) for (let g = gmin; g < gmax; g++) if (clearedG(perGrade, g) && failedG(perGrade, g + 1)) bracketed = true;
    const next = pickAt(LIST, focus, new Set(answered), balances);
    if (asked >= DIAG_MAX || !next || bracketed) break;
    current = next;
  }
  const placementGrade = computePlacementGrade(answered.map(id => SKILLS[id]), results, child.declared);
  const progress = { declaredGrade: child.declared, placementGrade, diagnosed: true, skills: processDiagnosticResults(balances, ctx) };
  return { answered, asked, placementGrade, r: findMissingStep(progress), markErrors };
}

// ---- run many children and score the result ------------------------------------
const tally = { children: 0, questions: 0, falseGap: 0, rootFound: 0, realGap: 0, withGaps: 0, placeExact: 0, placeWithin1: 0, noResult: 0, markErrors: 0 };
const examples = { falseGap: [], missedRoot: [], markErrors: [] };
for (let i = 0; i < N; i++) {
  const child = makeChild();
  const { answered, asked, placementGrade, r, markErrors } = runCheck(child);
  tally.children++; tally.questions += asked;
  if (markErrors.length) { tally.markErrors++; if (examples.markErrors.length < 5) examples.markErrors.push(markErrors[0]); }
  if (placementGrade === child.level) tally.placeExact++;
  if (Math.abs(placementGrade - child.level) <= 1) tally.placeWithin1++;
  if (!r.missing) { tally.noResult++; continue; }
  const m = SKILLS[r.missing];
  const childKnows = child.knows(r.missing);
  if (childKnows && !r.allClear) {
    tally.falseGap++;
    if (examples.falseGap.length < 8) examples.falseGap.push(`Grade ${child.declared} child, true level ${child.level}, gaps [${[...child.gaps].join(', ') || 'none'}]: told missing ${r.missing} (G${m.grade}), which they know. Asked: ${answered.join(' ')}`);
  } else if (!childKnows) tally.realGap++;
  if (child.gaps.size) {
    tally.withGaps++;
    // Found the gap if the named step is one of the gaps, or a skill the gap blocks.
    const hit = [...child.gaps].some(g => g === r.missing || getPrerequisiteChain(r.missing).includes(g));
    if (hit) tally.rootFound++;
    else if (examples.missedRoot.length < 6) examples.missedRoot.push(`Grade ${child.declared}, level ${child.level}, gap ${[...child.gaps].map(g => `${g} (G${SKILLS[g].grade})`).join(', ')}: HOREB said ${r.missing} (G${m.grade})${childKnows ? ' (known!)' : ''}`);
  }
}
const pct = (a, b) => (b ? `${Math.round(100 * a / b)}%` : '-');
console.log(`Free-check simulation: ${tally.children} virtual children, ${(tally.questions / tally.children).toFixed(1)} questions each on average.\n`);
console.log(`Missing step is a skill the child really lacks:   ${pct(tally.realGap, tally.children - tally.noResult)}`);
console.log(`FALSE ALARM (told missing a skill they know):     ${pct(tally.falseGap, tally.children - tally.noResult)}  (${tally.falseGap} children)`);
console.log(`Child with hidden gaps: gap (or what it blocks) named: ${pct(tally.rootFound, tally.withGaps)}`);
console.log(`Placement exactly right: ${pct(tally.placeExact, tally.children)} · within one grade: ${pct(tally.placeWithin1, tally.children)}`);
console.log(`No result at all: ${tally.noResult} · checks with a right answer marked wrong: ${tally.markErrors}`);
const show = (t, xs) => { if (xs.length) { console.log(`\n${t}`); for (const x of (FULL ? xs : xs.slice(0, 4))) console.log('  - ' + x); } };
show('False alarms:', examples.falseGap);
show('Gap not named:', examples.missedRoot);
show('Right answers marked wrong during the check:', examples.markErrors);
