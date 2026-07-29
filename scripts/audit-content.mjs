// ============================================================================
// PEDAGOGICAL CONTENT AUDIT — run with:  node scripts/audit-content.mjs
//
// Guards the *teaching quality* of generated content, catching the bug classes
// found in live child-testing (research/child-ux/findings.md):
//  F11/F12: "full working" steps that don't match the problem's own numbers
//  F14:     comparison questions whose choices omit the compared numbers
//  F1/F2:   problems with no specific hint (fall back to one canned line)
//  plus:    remediation engine consistency (steps end at the right answer;
//           diagnoser never fires on a correct answer; never throws)
//
// Samples every math skill's generator N times. Exits non-zero on hard fails;
// prints coverage stats for soft gaps (missing hints) without failing CI.
// ============================================================================

import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem, generateWorkedExample } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { parseArithmetic, computeSteps, diagnoseError } from '../src/ai-tutor/remediation.js';

const N = 30; // samples per skill
let failures = 0;
const fail = (msg) => { console.log('  ✗ ' + msg); failures++; };
const ok = (msg) => console.log('  ✓ ' + msg);

const lastNumber = (s) => {
  const m = String(s).match(/-?\d+(?:\.\d+)?(?!.*\d)/);
  return m ? m[0] : null;
};

// ---- 1. Solution steps must belong to their own problem ---------------------
console.log('1. Solution steps match their own problem (F11 class)');
{
  let checked = 0, bad = 0; const badList = [];
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < N; i++) {
      const p = generateProblem(id);
      if (!p || p.placeholder) continue;
      const steps = p.solutionSteps || p.solution?.steps?.map(s => (typeof s === 'string' ? s : `${s.text || ''} ${s.expr || ''}`));
      if (!steps || !steps.length) continue;
      checked++;
      // The final step (or the solution answer) should land on the problem's answer.
      const tail = steps[steps.length - 1] + ' ' + (p.solution?.answer ?? '');
      const ansNum = lastNumber(p.answer);
      if (ansNum != null && !tail.includes(ansNum) && !checkAnswerMatch(String(lastNumber(tail) ?? ''), p)) {
        bad++;
        if (badList.length < 5) badList.push(`${id}: "${p.question}" ans=${p.answer} but steps end "${steps[steps.length - 1]}"`);
      }
    }
  }
  if (bad) { fail(`${bad}/${checked} sampled step-sets do not land on their own answer`); badList.forEach(b => console.log('      ' + b)); }
  else ok(`${checked} step-sets all land on their own problem's answer`);
}

// ---- 2. Comparison choices contain the compared numbers (F14 class) ---------
console.log('2. Comparison problems offer the numbers being compared');
{
  let checked = 0, bad = 0; const badList = [];
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < N; i++) {
      const p = generateProblem(id);
      if (!p || p.placeholder) continue;
      const m = String(p.question || '').match(/(?:bigger|greater|smaller|larger)[^0-9]*(\d+)\s+or\s+(\d+)/i);
      if (!m) continue;
      checked++;
      if (Array.isArray(p.choices)) {
        const set = p.choices.map(String);
        if (!set.includes(m[1]) || !set.includes(m[2])) { bad++; if (badList.length < 5) badList.push(`${id}: "${p.question}" choices=[${set}]`); }
      } else {
        // no explicit choices: young mode would synthesise near-misses — that's the F14 bug
        bad++; if (badList.length < 5) badList.push(`${id}: "${p.question}" has NO choices array (young mode would invent near-misses)`);
      }
    }
  }
  if (bad) { fail(`${bad}/${checked} comparison problems missing proper choices`); badList.forEach(b => console.log('      ' + b)); }
  else ok(`${checked} comparison problems all carry their own numbers as choices`);
}

// ---- 3. Remediation engine consistency --------------------------------------
console.log('3. Remediation engine (computeSteps / diagnoseError)');
{
  let arith = 0, stepBad = 0, diagFalse = 0, threw = 0; const badList = [];
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < N; i++) {
      const p = generateProblem(id);
      if (!p || p.placeholder) continue;
      let parsed;
      try { parsed = parseArithmetic(p.question); } catch (e) { threw++; continue; }
      if (!parsed) continue;
      arith++;
      try {
        const steps = computeSteps(p);
        if (steps && steps.length) {
          const tailNum = lastNumber(steps[steps.length - 1]);
          // integer-answer problems: computed steps must end at the real answer
          if (/^-?\d+$/.test(String(p.answer).trim()) && tailNum !== String(p.answer).trim()) {
            stepBad++;
            if (badList.length < 5) badList.push(`${id}: "${p.question}" ans=${p.answer} computeSteps ends ${tailNum}`);
          }
        }
        // Diagnoser must NEVER call a correct answer a mistake.
        if (diagnoseError(p, p.answer) !== null) {
          diagFalse++;
          if (badList.length < 5) badList.push(`${id}: diagnoseError fired on the CORRECT answer for "${p.question}"`);
        }
        // And must never throw on junk.
        diagnoseError(p, 'abc'); diagnoseError(p, ''); diagnoseError(p, 999999);
      } catch (e) { threw++; if (badList.length < 5) badList.push(`${id}: threw ${e.message}`); }
    }
  }
  if (stepBad || diagFalse || threw) {
    fail(`arith=${arith}: wrong-ending steps=${stepBad}, false diagnoses=${diagFalse}, throws=${threw}`);
    badList.forEach(b => console.log('      ' + b));
  } else ok(`${arith} arithmetic problems: steps end correctly, no false diagnoses, no throws`);
}

// ---- 4. Worked examples are self-consistent ---------------------------------
console.log('4. Worked examples land on their own solution');
{
  let checked = 0, bad = 0, threw = 0; const badList = [];
  for (const id of Object.keys(SKILLS)) {
    let we;
    try { we = generateWorkedExample(id); } catch (e) { threw++; continue; }
    if (!we || !we.steps?.length || we.solution == null) continue;
    checked++;
    const solNum = lastNumber(we.solution);
    const joined = we.steps.join(' ');
    if (solNum != null && !joined.includes(solNum) && lastNumber(we.steps[we.steps.length - 1]) !== solNum) {
      bad++; if (badList.length < 5) badList.push(`${id}: solution=${we.solution} never appears in steps`);
    }
  }
  if (bad || threw) { fail(`${bad}/${checked} worked examples inconsistent, ${threw} threw`); badList.forEach(b => console.log('      ' + b)); }
  else ok(`${checked} worked examples all reach their stated solution`);
}

// ---- 5. Hint coverage (soft — reported, not failed) -------------------------
console.log('5. Hint coverage (soft): problems that would fall back to a canned line');
{
  const bySkill = {};
  for (const id of Object.keys(SKILLS)) {
    let miss = 0, total = 0;
    for (let i = 0; i < N; i++) {
      const p = generateProblem(id);
      if (!p || p.placeholder) continue;
      total++;
      const hasSpecific = !!(p.hint || p.hints?.length || p.solutionSteps?.length || p.solution?.steps?.length || parseArithmetic(p.question));
      if (!hasSpecific) miss++;
    }
    if (total && miss / total > 0.5) bySkill[id] = Math.round((miss / total) * 100);
  }
  const worst = Object.entries(bySkill).sort((a, b) => b[1] - a[1]);
  if (worst.length) {
    console.log(`  · ${worst.length} skills mostly lack a specific hint (would show the canned line):`);
    worst.slice(0, 15).forEach(([id, pct]) => console.log(`      ${id} (${SKILLS[id]?.grade ?? '?'}): ${pct}% of problems`));
    if (worst.length > 15) console.log(`      … and ${worst.length - 15} more`);
  } else ok('every skill has specific hints/steps for most problems');
}

console.log(failures ? `\nFAILURES: ${failures}` : '\nAll hard checks passed.');
process.exit(failures ? 1 : 0);
