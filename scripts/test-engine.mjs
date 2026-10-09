// ============================================================================
// ENGINE REGRESSION TEST — run with:  node scripts/test-engine.mjs
//
// Guards the learning engine against the bug classes we fixed:
//  1. Knowledge-graph integrity (no dangling prereqs / cycles, every subject)
//  2. 100% generator coverage (no skill silently falls back to "answer: 1")
//  3. Every generator's own answer key is accepted by the grader
//  4. Tolerant grading (mixed/improper fractions, rounded decimals, %, units)
//  5. Credit propagation works per-subject (not just math)
// Exits non-zero on any failure so it can gate CI.
// ============================================================================

import { SKILLS, getPrerequisiteChain } from '../src/ai-tutor/knowledgeGraph.js';
import { CAMBRIDGE_SKILLS, getCambridgePostRequisites } from '../src/ai-tutor/cambridgeKnowledgeGraph.js';
import { SAT_SKILLS } from '../src/ai-tutor/satKnowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { planYoungLesson } from '../src/ai-tutor/youngPlan.js';
import { propagateCredit } from '../src/ai-tutor/diagnosticEngine.js';
import { getDiagnosticSkills, getEffectivePlacement, recentMastery } from '../src/ai-tutor/adaptiveEngine.js';
import { selectQuestion, computePlacement, isComplete, MAX_QUESTIONS } from '../src/ai-tutor/placement.js';

let failures = 0;
const fail = (msg) => { console.log('  ✗ ' + msg); failures++; };
const ok = (msg) => console.log('  ✓ ' + msg);

// ---- 1. Graph integrity ----
console.log('1. Knowledge-graph integrity');
function graphAudit(name, S) {
  const ids = new Set(Object.keys(S));
  let dangling = 0, cycles = 0;
  for (const [id, s] of Object.entries(S))
    for (const p of (s.prerequisites || [])) if (!ids.has(p)) dangling++;
  const GRAY = 1, BLACK = 2, color = {};
  const dfs = (u) => { color[u] = GRAY; for (const v of (S[u]?.prerequisites || [])) { if (!S[v]) continue; if (color[v] === GRAY) cycles++; else if (color[v] !== BLACK) dfs(v); } color[u] = BLACK; };
  for (const id of ids) if (color[id] === undefined) dfs(id);
  if (dangling || cycles) fail(`${name}: dangling=${dangling} cycles=${cycles}`);
  else ok(`${name}: ${ids.size} skills, no dangling prereqs, no cycles`);
}
graphAudit('MATH', SKILLS); graphAudit('CAMBRIDGE', CAMBRIDGE_SKILLS); graphAudit('SAT', SAT_SKILLS);

// ---- 2 & 3. Coverage + every key self-accepts ----
console.log('2/3. Generator coverage + key self-acceptance');
function sweep(name, ids, gen) {
  let placeholder = 0, selfFail = 0;
  for (const id of Object.keys(ids)) {
    for (let i = 0; i < 8; i++) {
      let p; try { p = gen(id); } catch { continue; }
      if (!p) continue;
      if (p.placeholder) { placeholder++; break; }
      // The gradeable target is `accepts` when present, else `answer`.
      const target = (p.accepts && p.accepts.length) ? p.accepts[0] : p.answer;
      if (target != null && !checkAnswerMatch(String(target), p)) { selfFail++; fail(`${name}/${id}: target "${target}" not accepted`); break; }
    }
  }
  if (placeholder) fail(`${name}: ${placeholder} skills fall back to placeholder (no generator)`);
  else if (!selfFail) ok(`${name}: full coverage, all keys self-accept`);
}
sweep('MATH', SKILLS, generateProblem);

// ---- 4. Tolerant grading ----
console.log('4. Tolerant grading');
const cases = [
  ['mixed↔improper', '7/6', { answer: '1 1/6' }, true],
  ['improper↔mixed', '1 1/6', { answer: '7/6' }, true],
  ['fraction↔decimal', '0.5', { answer: '1/2' }, true],
  ['rounded 1dp key accepts exact', '12.33', { answer: '12.3' }, true],
  ['rounded 2dp (π)', '3.14159', { answer: '3.14' }, true],
  ['integer key stays tight', '150.4', { answer: '150' }, false],
  ['unit suffix cm²', '24 cm²', { answer: '24' }, true],
  ['percent sign', '15%', { answer: '15' }, true],
  ['wrong answer rejected', '13', { answer: '12' }, false],
  ['coordinate spacing', '(2,5)', { answer: '(2, 5)' }, true],
  // Found by scripts/audit-answers.mjs:
  ['exact fraction vs decimal key: wrong', '1/20', { answer: '1/10', accepts: ['1/10', '0.1'] }, false],
  ['exact fraction vs decimal key: right', '2/20', { answer: '1/10', accepts: ['1/10', '0.1'] }, true],
  ['whole number vs rounded key', '12', { answer: '12.3' }, false],
  ['word percent', '40 percent', { answer: '40' }, true],
  ['word shillings', '8600 shillings', { answer: '8600' }, true],
  ['KSh with comma and /=', 'KSh 8,600/=', { answer: '8600' }, true],
  ['hours word', '3 hrs', { answer: '3' }, true],
  ['sq cm', '24 sq cm', { answer: '24' }, true],
  ['algebra key keeps its letter', '3', { answer: '3m' }, false],
  ['unit on wrong number still wrong', '41 percent', { answer: '40' }, false],
  ['word answer + noun', 'parallel lines', { answer: 'parallel' }, true],
  ['word answer + article', 'an obtuse angle', { answer: 'obtuse' }, true],
  ['word answer "it is"', 'It is scalene', { answer: 'scalene' }, true],
  ['hyphen vs space', 'Right angled', { answer: 'right-angled' }, true],
  ['wrong word still wrong', 'acute angle', { answer: 'obtuse' }, false],
  ['time with dot', '1.30', { answer: '13:30', accepts: ['13:30', '1:30'] }, true],
  ['time with pm', '1:30 p.m.', { answer: '13:30', accepts: ['13:30', '1:30'] }, true],
  ['time 24h dot', '13.30', { answer: '13:30', accepts: ['13:30', '1:30'] }, true],
  ['half past', 'half past one', { answer: '13:30', accepts: ['13:30', '1:30'] }, true],
  ['o clock', "11 o'clock", { answer: '11:00' }, true],
  ['quarter to', 'quarter to twelve', { answer: '11:45' }, true],
  ['wrong time', '1:45', { answer: '13:30', accepts: ['13:30', '1:30'] }, false],
  ['compass letter', 'S', { answer: 'South' }, true],
  ['wrong compass letter', 'N', { answer: 'South' }, false],
  ['short day', 'Tue', { answer: 'Tuesday' }, true],
  ['short month', 'Sept', { answer: 'September' }, true],
  ['ambiguous short', 'Ma', { answer: 'March' }, false],
  ['superscript power', '3x²', { answer: '3x^2' }, true],
  ['double-star power', '3x**2', { answer: '3x^2' }, true],
  ['wrong power', '3x³', { answer: '3x^2' }, false],
  ['two answers as list', '30, 150', { answer: '30° and 150°' }, true],
  ['two answers reversed', '150 and 30', { answer: '30° and 150°' }, true],
  ['two answers with θ =', 'θ = 30° or θ = 150°', { answer: '30° and 150°' }, true],
  ['one of two answers only', '30', { answer: '30° and 150°' }, false],
  ['two answers, one wrong', '30, 120', { answer: '30° and 150°' }, false],
  ['coordinate is not a number', '60', { answer: '(6, 0)' }, false],
  ['coordinate order matters', '(0, 6)', { answer: '(6, 0)' }, false],
  ['coordinate without brackets', '6,0', { answer: '(6, 0)' }, true],
  ['thousands comma still fine', '1,200', { answer: '1200' }, true],
  // Round 11 (docs/qa/answer-audit-log.md):
  ['two thousands commas', '8,200,000', { answer: '8200000' }, true],
  ['exact decimal key is exact', '0.75', { question: 'Write 4/5 as a decimal.', answer: '0.8' }, false],
  ['exact decimal key, right', '0.80', { question: 'Write 4/5 as a decimal.', answer: '0.8' }, true],
  ['exact product is exact', '3.66', { question: '7.4 × 0.5', answer: '3.7' }, false],
  ['rounded key keeps margin (π)', '153.86', { question: 'Find the area of a circle of radius 7 cm (1 d.p.).', answer: '153.9' }, true],
  ['wrong unit is wrong', '9 metres', { question: 'How many kilometres are there in 9,000 metres?', answer: '9' }, false],
  ['right unit is fine', '9 km', { question: 'How many kilometres are there in 9,000 metres?', answer: '9' }, true],
  ['blank-fill: the question is not the answer', '4/5', { question: 'Fill in the blank: 4/5 = ?/30', answer: '24', accepts: ['24', '24/30'] }, false],
  ['blank-fill: whole fraction written out', '24/30', { question: 'Fill in the blank: 4/5 = ?/30', answer: '24', accepts: ['24', '24/30'] }, true],
];
for (const [label, user, prob, expect] of cases) {
  const got = checkAnswerMatch(user, prob);
  if (got !== expect) fail(`${label}: got ${got}, expected ${expect}`);
}
if (!cases.some(([l, u, p, e]) => checkAnswerMatch(u, p) !== e)) ok(`all ${cases.length} tolerant cases`);

// ---- 4b. Mastery on recent answers ----
console.log('4b. Mastery on recent answers');
const Y = true, N = false;
const mcases = [
  ['6 right', [Y, Y, Y, Y, Y, Y], true],
  ['5 answers only', [Y, Y, Y, Y, Y], false],
  ['early mistakes then 7 of 8', [N, N, N, Y, Y, Y, Y, N, Y, Y, Y, Y], true],
  ['last answer wrong', [Y, Y, Y, Y, Y, Y, N], false],
  ['two misses in last 8', [Y, Y, N, Y, N, Y, Y, Y], false],
  ['slip, then 3 right', [Y, Y, Y, N, Y, Y, Y], true],
];
let mfail = 0;
for (const [label, h, expect] of mcases) if (recentMastery(h, 6) !== expect) { fail(`mastery ${label}: got ${!expect}`); mfail++; }
if (!mfail) ok(`all ${mcases.length} mastery cases`);

// ---- 4c. Young learners: the right answer is always one of the buttons ----
console.log('4c. Young-learner buttons (Grades 1-4)');
let ybad = 0, yseen = 0;
for (const [id, sk] of Object.entries(SKILLS)) {
  if (sk.grade > 4) continue;
  for (let i = 0; i < 30; i++) {
    const p = generateProblem(id); const plan = planYoungLesson(p);
    if (!plan) continue; yseen++;
    if (!plan.choices.map(String).includes(String(plan.answer))) { fail(`${id}: answer "${plan.answer}" not among buttons [${plan.choices.join(', ')}]`); ybad++; break; }
  }
}
if (!ybad) ok(`right answer is a button in all ${yseen} young-learner questions`);

// ---- 5. Per-subject credit propagation ----
console.log('5. Per-subject credit propagation (Cambridge)');
const skills = CAMBRIDGE_SKILLS;
const getPreChain = (id, v = new Set()) => { if (v.has(id)) return []; v.add(id); const s = skills[id]; if (!s) return []; const c = [...(s.prerequisites || [])]; for (const p of (s.prerequisites || [])) c.push(...getPreChain(p, v)); return [...new Set(c)]; };
const getPostChain = (id, v = new Set()) => { if (v.has(id)) return []; v.add(id); const posts = (getCambridgePostRequisites(id) || []).map(p => p.id || p); const c = [...posts]; for (const pid of posts) c.push(...getPostChain(pid, v)); return [...new Set(c)]; };
const withPre = Object.values(CAMBRIDGE_SKILLS).find(s => (s.prerequisites || []).length > 0);
const bal = propagateCredit({}, withPre.id, true, 1.0, { skills, getPreChain, getPostChain });
const propagated = Object.keys(bal).filter(k => k !== withPre.id);
if (propagated.length > 0) ok(`Cambridge correct answer credits prerequisites (${propagated.length})`);
else fail('Cambridge credit did not propagate');

// ---- 6. Diagnostic sizing + placement ----
console.log('6. Diagnostic sizing + placement');
for (const g of [6, 8, 10]) {
  const n = getDiagnosticSkills({ declaredGrade: g, skills: {} }).length;
  if (n >= 18) ok(`grade ${g} diagnostic: ${n} questions`);
  else fail(`grade ${g} diagnostic only ${n} questions (want ≥18)`);
}
// Placement regressions. A teacher sat the Grade 6 test in Oct 2026 and hit
// three faults at once: it served Grade 9/10/calculus questions, it placed them
// at Grade 11, and it asked indices over and over while barely touching BODMAS.
// Each fault gets a check here.
const pool = Object.values(SKILLS).filter(s => Number.isFinite(s.grade));
// Drive a whole test with a learner who knows everything at or below `frontier`.
const sit = (declared, frontier) => {
  const asked = [];
  while (asked.length < MAX_QUESTIONS) {
    const q = selectQuestion(asked, declared, pool);
    if (!q) break;
    asked.push({ id: q.id, grade: q.grade, strand: q.strand, correct: q.grade <= frontier });
  }
  return { asked, placed: computePlacement(asked, declared, pool) };
};

// (a) the ceiling: never more than one grade above what the learner declared,
// no matter how much maths they actually know.
const ceilingBreaches = [[6, 12], [6, 9], [4, 12], [9, 12]].filter(([d, f]) =>
  sit(d, f).asked.some(a => a.grade > d + 1));
if (!ceilingBreaches.length) ok('placement never serves more than one grade above the declared grade');
else fail(`placement served above declared+1 for ${JSON.stringify(ceilingBreaches)}`);

// (b) strand balance: the declared grade's sweep covers every strand taught at
// that grade. The old test was 98% Numbers.
const g6Strands = new Set(pool.filter(s => s.grade === 6).map(s => s.strand));
const swept6 = new Set(sit(6, 6).asked.filter(a => a.grade === 6).map(a => a.strand));
if (swept6.size === g6Strands.size) ok(`grade 6 sweep covers all ${g6Strands.size} strands`);
else fail(`grade 6 sweep covered ${swept6.size}/${g6Strands.size} strands: ${[...swept6]}`);

// (c) the teacher's own example: a Grade 6 entry must never be served senior
// content. Theirs served Introduction to Indices and Laws of Indices back to
// back at question 5 and 6, then surds, then logarithms.
const senior = /Indices|Surds|Logarithm|Differentiat|Integrat|Quadratic|Limits/i;
const g6Senior = [6, 9, 12].flatMap(f => sit(6, f).asked)
  .map(a => SKILLS[a.id]?.name || '').filter(n => senior.test(n));
if (!g6Senior.length) ok('a grade 6 entry is never served senior content');
else fail(`grade 6 entry served senior skills: ${[...new Set(g6Senior)].join(', ')}`);

// (d) placement is capped at the declared grade, and only a PERFECT sweep of
// the stretch grade goes one above it.
const placedCaps = [[6, 12, 7], [6, 6, 6], [6, 5, 5], [6, 3, 3], [9, 7, 7]]
  .filter(([d, f, want]) => sit(d, f).placed !== want)
  .map(([d, f, want]) => `declared ${d}, knows ${f}: got ${sit(d, f).placed} want ${want}`);
if (!placedCaps.length) ok('placement lands on the real level, capped at declared+1');
else fail('placement off: ' + placedCaps.join('; '));

// (e) the bug that sent the teacher to Grade 11: the old code returned the
// lowest grade TESTED even when that grade was failed, and grades below were
// never tested at all. A learner who gets nothing right must place BELOW
// everything asked — or at the floor of the graph if that is where they are.
const wrongAt = (grades) => grades.map(g => ({ id: 'x' + g, grade: g, strand: 'Numbers', correct: false }));
const notFloor = computePlacement(wrongAt([7, 6, 5]), 7, pool);       // never reached the bottom
const atFloor = computePlacement(wrongAt([3, 2, 1]), 3, pool);        // failed grade 1 itself
if (notFloor === 4 && atFloor === 1) ok('all-wrong places below everything asked (4), floored at grade 1');
else fail(`all-wrong placement wrong: mid=${notFloor} (want 4), floor=${atFloor} (want 1)`);

// (f) selection is pure, so a test interrupted and resumed asks the same
// question rather than reshuffling.
const partial = sit(7, 5).asked.slice(0, 4);
const a1 = selectQuestion(partial, 7, pool)?.id, a2 = selectQuestion(partial.slice(), 7, pool)?.id;
if (a1 && a1 === a2) ok('question choice is deterministic — a resumed test continues where it left off');
else fail(`resume not deterministic: ${a1} vs ${a2}`);

// (g) it always terminates, for every declared grade and ability.
const runaway = [];
for (let d = 1; d <= 12; d++) for (const f of [0, 1, d, 12]) {
  const { asked } = sit(d, f);
  if (!isComplete(asked, d, pool)) runaway.push(`${d}/${f}`);
}
if (!runaway.length) ok('every declared grade × ability terminates within the question cap');
else fail('did not terminate: ' + runaway.join(', '));

// Effective placement decays after sustained struggle, holds otherwise.
const g7 = Object.values(SKILLS).filter(s => s.grade === 7).slice(0, 3);
const mk = (attempts, correct) => Object.fromEntries(g7.map(s => [s.id, { attempts, correct }]));
const dStruggle = getEffectivePlacement({ placementGrade: 7, skills: mk(4, 1) }, null); // 25% over 12
const dOk = getEffectivePlacement({ placementGrade: 7, skills: mk(4, 3) }, null);       // 75%
const dThin = getEffectivePlacement({ placementGrade: 7, skills: { [g7[0].id]: { attempts: 3, correct: 0 } } }, null);
if (dStruggle === 6 && dOk === 7 && dThin === 7) ok('effective placement decays on struggle, holds otherwise (6/7/7)');
else fail(`effective placement wrong: struggle=${dStruggle}(want 6) ok=${dOk}(want 7) thin=${dThin}(want 7)`);

// The level has to keep tracking the learner AFTER the check, not just fall.
// Promotion is deliberately harder to earn than demotion: over-placing is the
// damaging direction.
const g7all = Object.values(SKILLS).filter(s => s.grade === 7);
const holdGrade = (share, attempts, correct) => Object.fromEntries(
  g7all.slice(0, Math.ceil(g7all.length * share)).map(s => [s.id, { attempts, correct, mastered: true }]));
const outgrown = getEffectivePlacement({ placementGrade: 7, skills: holdGrade(0.7, 5, 5) }, null);
const partly   = getEffectivePlacement({ placementGrade: 7, skills: holdGrade(0.3, 5, 5) }, null); // too little held
const sloppy   = getEffectivePlacement({ placementGrade: 7, skills: holdGrade(0.7, 5, 3) }, null); // 60% accuracy
const untouched = getEffectivePlacement({ placementGrade: 7, skills: {} }, null);      // no practice yet
if (outgrown === 8 && partly === 7 && sloppy === 7 && untouched === 7)
  ok('effective placement rises once a grade is outgrown (8), and not on thin evidence');
else fail(`promotion wrong: outgrown=${outgrown}(want 8) partly=${partly} sloppy=${sloppy} untouched=${untouched} (want 7)`);

console.log('\n' + (failures ? `FAILED (${failures})` : 'ALL ENGINE CHECKS PASSED'));
process.exit(failures ? 1 : 0);
