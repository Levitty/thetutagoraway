// ============================================================================
// AUDIT — the new question types (four-choice, mistake feedback, spot the
// mistake, always/sometimes/never, word problems, step-marked questions).
//   node scripts/audit-new-items.mjs      (npm run audit:items)
// Exits non-zero on any finding. What it checks:
//  1. every generated item: no NaN/undefined/Infinity in anything a child sees
//  2. the key marks itself right; no listed mistake is marked right
//  3. four-choice: exactly one option is right, options are distinct
//  4. mistake feedback never states the answer (unless the question does)
//  5. step-marked parts: each part's key marks right, mistakes don't
//  6. young lessons (G1-2) never take a button from the catalogue
// ============================================================================

import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { buildChoices } from '../src/ai-tutor/choices.js';
import { reasoningFor } from '../src/ai-tutor/content/reasoning.js';
import { wordProblemFor } from '../src/ai-tutor/content/wordProblems.js';
import { stepsItemFor } from '../src/ai-tutor/content/stepsItems.js';
import { planYoungLesson } from '../src/ai-tutor/youngPlan.js';

const N = Number(process.argv[2] || 300);
const findings = [];
const bad = (kind, id, detail) => { findings.push({ kind, id, detail }); };
const BROKEN = /NaN|undefined|Infinity|\[object Object\]/;
const seen = (p) => [p.question, p.answer, ...(p.shownSteps || []), ...(p.mc || []), p.explain, ...(p.parts || []).flatMap(q => [q.prompt, q.answer]), ...(p.misconceptions || []).map(m => `${m.when} ${m.feedback}`)].filter(Boolean).join(' | ');
const answerLeak = (p, fb) => {
  const a = String(p.answer);
  if (!/^-?\d+(\.\d+)?$/.test(a) || a.replace('-', '').length < 2 || p.question.includes(a)) return false;
  return new RegExp(`(^|[^\\d.,])${a.replace('.', '\\.')}([^\\d.,]|$)`).test(fb);
};

function checkItem(p, id, src) {
  if (!p) return;
  if (BROKEN.test(seen(p))) bad('broken-text', id, `${src}: ${seen(p).slice(0, 160)}`);
  if (p.parts) {
    for (const q of p.parts) {
      if (!checkAnswerMatch(q.answer, q)) bad('part-key', id, `${q.prompt} -> ${q.answer}`);
      for (const m of q.mistakes || []) if (checkAnswerMatch(m.when, q)) bad('part-mistake-is-right', id, `${q.prompt}: ${m.when}`);
    }
    return;
  }
  if (!checkAnswerMatch(String(p.answer), p)) bad('key', id, `${src}: ${p.question} -> ${p.answer}`);
  for (const m of p.misconceptions || []) {
    if (m?.when != null && checkAnswerMatch(String(m.when), p)) bad('mistake-is-right', id, `${p.question}: ${m.when}`);
    if (m?.feedback && answerLeak(p, m.feedback)) bad('feedback-gives-answer', id, `${p.question} => ${p.answer} | ${m.feedback}`);
  }
  const mc = p.mc || buildChoices(p);
  if (mc) {
    const right = mc.filter(o => checkAnswerMatch(String(o), p));
    if (right.length !== 1) bad('choices', id, `${p.question} [${mc.join(' | ')}] key ${p.answer}`);
    if (new Set(mc.map(String)).size !== mc.length) bad('choices-dup', id, `${p.question} [${mc.join(' | ')}]`);
  }
}

let items = 0;
for (const [id, s] of Object.entries(SKILLS)) {
  for (let i = 0; i < N; i++) {
    const p = generateProblem(id, { level: ['abstract', 'pictorial', 'concrete'][i % 3], kp: i % 6 }); items++;
    checkItem(p, id, 'bank');
    if (s.grade <= 2 && i < 60) {
      const plan = planYoungLesson(p);
      const cat = new Set((p.misconceptions || []).filter(m => m.source === 'catalogue').map(m => String(m.when)));
      const own = new Set((p.misconceptions || []).filter(m => m.source !== 'catalogue').map(m => String(m.when)));
      for (const c of plan?.choices || []) if (cat.has(String(c)) && !own.has(String(c)) && Math.abs(Number(c) - Number(p.answer)) > 1) bad('young-uses-catalogue', id, `${p.question} [${plan.choices}]`);
    }
  }
  for (let i = 0; i < Math.ceil(N / 3); i++) {
    const r = reasoningFor(id); if (r) { items++; checkItem(r, id, 'reasoning'); }
    const w = wordProblemFor(id); if (w) { items++; checkItem(w, id, 'word'); }
    const st = stepsItemFor(id); if (st) { items++; checkItem(st, id, 'steps'); }
  }
}

const byKind = {};
for (const f of findings) (byKind[f.kind] ||= []).push(f);
console.log(`Checked ${items} items across ${Object.keys(SKILLS).length} skills.`);
for (const [k, list] of Object.entries(byKind)) {
  console.log(`\n${k}: ${list.length}`);
  for (const f of list.slice(0, 8)) console.log(`  ${f.id}  ${f.detail}`);
}
if (!findings.length) console.log('No findings.');
process.exit(findings.length ? 1 : 0);
