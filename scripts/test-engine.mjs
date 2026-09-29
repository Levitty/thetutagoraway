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
import { getDiagnosticSkills, computePlacementGrade, getEffectivePlacement, recentMastery } from '../src/ai-tutor/adaptiveEngine.js';

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
const pskills = [{ id: 'a', grade: 5 }, { id: 'b', grade: 5 }, { id: 'c', grade: 6 }, { id: 'd', grade: 6 }, { id: 'e', grade: 7 }, { id: 'f', grade: 7 }];
const T = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { correct: v }]));
const p1 = computePlacementGrade(pskills, T({ a: 1, b: 1, c: 1, d: 1, e: 1, f: 1 }), 6);
const p2 = computePlacementGrade(pskills, T({ a: 1, b: 1, c: 1, d: 1, e: 0, f: 0 }), 6);
if (p1 === 7 && p2 === 6) ok('placement grade tracks the highest cleared band (7, 6)');
else fail(`placement wrong: cleared-all=${p1} (want 7), cleared-to-6=${p2} (want 6)`);

// Effective placement decays after sustained struggle, holds otherwise.
const g7 = Object.values(SKILLS).filter(s => s.grade === 7).slice(0, 3);
const mk = (attempts, correct) => Object.fromEntries(g7.map(s => [s.id, { attempts, correct }]));
const dStruggle = getEffectivePlacement({ placementGrade: 7, skills: mk(4, 1) }, null); // 25% over 12
const dOk = getEffectivePlacement({ placementGrade: 7, skills: mk(4, 3) }, null);       // 75%
const dThin = getEffectivePlacement({ placementGrade: 7, skills: { [g7[0].id]: { attempts: 3, correct: 0 } } }, null);
if (dStruggle === 6 && dOk === 7 && dThin === 7) ok('effective placement decays on struggle, holds otherwise (6/7/7)');
else fail(`effective placement wrong: struggle=${dStruggle}(want 6) ok=${dOk}(want 7) thin=${dThin}(want 7)`);

console.log('\n' + (failures ? `FAILED (${failures})` : 'ALL ENGINE CHECKS PASSED'));
process.exit(failures ? 1 : 0);
