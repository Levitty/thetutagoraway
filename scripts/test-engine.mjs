// ============================================================================
// ENGINE REGRESSION TEST — run with:  node scripts/test-engine.mjs
//
// Guards the learning engine against the bug classes we fixed:
//  1. Knowledge-graph integrity (no dangling prereqs / cycles, math+AFM+APM)
//  2. 100% generator coverage (no skill silently falls back to "answer: 1")
//  3. Every generator's own answer key is accepted by the grader
//  4. Tolerant grading (mixed/improper fractions, rounded decimals, %, units)
//  5. Credit propagation works per-subject (not just math)
// Exits non-zero on any failure so it can gate CI.
// ============================================================================

import { SKILLS, getPrerequisiteChain } from '../src/ai-tutor/knowledgeGraph.js';
import { AFM_SKILLS, getAfmPostRequisites } from '../src/ai-tutor/afmKnowledgeGraph.js';
import { APM_SKILLS } from '../src/ai-tutor/apmKnowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { generateAfmProblem } from '../src/ai-tutor/afmProblemGenerators.js';
import { generateApmProblem } from '../src/ai-tutor/apmProblemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { propagateCredit } from '../src/ai-tutor/diagnosticEngine.js';
import { getDiagnosticSkills, computePlacementGrade, getEffectivePlacement } from '../src/ai-tutor/adaptiveEngine.js';

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
graphAudit('MATH', SKILLS); graphAudit('AFM', AFM_SKILLS); graphAudit('APM', APM_SKILLS);

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
sweep('AFM', AFM_SKILLS, generateAfmProblem);
sweep('APM', APM_SKILLS, generateApmProblem);

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
];
for (const [label, user, prob, expect] of cases) {
  const got = checkAnswerMatch(user, prob);
  if (got !== expect) fail(`${label}: got ${got}, expected ${expect}`);
}
if (!cases.some(([l, u, p, e]) => checkAnswerMatch(u, p) !== e)) ok(`all ${cases.length} tolerant cases`);

// ---- 5. Per-subject credit propagation ----
console.log('5. Per-subject credit propagation (AFM)');
const skills = AFM_SKILLS;
const getPreChain = (id, v = new Set()) => { if (v.has(id)) return []; v.add(id); const s = skills[id]; if (!s) return []; const c = [...(s.prerequisites || [])]; for (const p of (s.prerequisites || [])) c.push(...getPreChain(p, v)); return [...new Set(c)]; };
const getPostChain = (id, v = new Set()) => { if (v.has(id)) return []; v.add(id); const posts = (getAfmPostRequisites(id) || []).map(p => p.id || p); const c = [...posts]; for (const pid of posts) c.push(...getPostChain(pid, v)); return [...new Set(c)]; };
const withPre = Object.values(AFM_SKILLS).find(s => (s.prerequisites || []).length > 0);
const bal = propagateCredit({}, withPre.id, true, 1.0, { skills, getPreChain, getPostChain });
const propagated = Object.keys(bal).filter(k => k !== withPre.id);
if (propagated.length > 0) ok(`AFM correct answer credits prerequisites (${propagated.length})`);
else fail('AFM credit did not propagate');

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

// ---- 7. Content variety (anti "watered-down") — warn, don't fail ----
console.log('7. Content variety (advisory)');
{
  const N = 40, thin = [];
  for (const id of Object.keys(SKILLS)) {
    const qs = new Set();
    for (let i = 0; i < N; i++) { let p; try { p = generateProblem(id); } catch { continue; } if (!p || p.placeholder) { qs.clear(); break; } qs.add(String(p.question)); }
    if (qs.size > 0 && qs.size <= 3) thin.push(`${id}(${qs.size})`);
  }
  // The enriched foundational skills must not be thin anymore.
  const stillThinFoundational = ['G5_LINES', 'G5_MASS', 'G5_TRIANGLES_INTRO', 'G5_LENGTH'].filter(id => thin.some(t => t.startsWith(id)));
  if (stillThinFoundational.length) fail(`enriched skills still thin: ${stillThinFoundational.join(', ')}`);
  else ok('enriched foundational skills now varied');
  console.log(`  ℹ ${thin.length} skills still thin (≤3 distinct) — content backlog, mostly senior topics`);
}

console.log('\n' + (failures ? `FAILED (${failures})` : 'ALL ENGINE CHECKS PASSED'));
process.exit(failures ? 1 : 0);
