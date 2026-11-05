// Check one file of question families before it joins the bank, and print a
// sample of each to read:  node scripts/check-family-file.mjs <file> [--quiet]
// The file exports `FAMILIES`, an array.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkFamily } from '../engine/scripts/family_checks.mjs';
import { drawFamily } from '../src/ai-tutor/content/families/core.js';
import { formText, sameForm, textOf } from '../engine/scripts/content_measures.mjs';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { OUTCOMES } from '../src/ai-tutor/curriculum/outcomes.js';

const file = process.argv[2];
const quiet = process.argv.includes('--quiet');
const { FAMILIES } = await import(pathToFileURL(resolve(file)).href);
const fails = [];
const ids = new Set();
for (const f of FAMILIES) {
  if (ids.has(f.id)) fails.push(`${f.id}: duplicate id`);
  ids.add(f.id);
  fails.push(...checkFamily(f, 200));
}
console.warn = () => {};
const reps = FAMILIES.map(f => { try { return { f, t: formText(drawFamily(f).p) }; } catch { return { f, t: '' }; } });
const skills = [...new Set(FAMILIES.map(f => f.skill))];
const base = Object.fromEntries(skills.map(id => { const set = new Set(); for (let i = 0; i < 40; i++) { const p = generateProblem(id, { noFamilies: false, kp: i % 4 }); if (p && !p.familyId) set.add(formText(p)); } return [id, [...set]]; }));
for (let i = 0; i < reps.length; i++) {
  for (let j = i + 1; j < reps.length; j++) if (reps[i].f.skill === reps[j].f.skill && sameForm(reps[i].t, reps[j].t)) fails.push(`${reps[i].f.id}: same form as ${reps[j].f.id}. Change how it asks, or drop one.`);
  for (const b of base[reps[i].f.skill] || []) if (sameForm(reps[i].t, b)) { fails.push(`${reps[i].f.id}: repeats a form ${reps[i].f.skill} already has: "${b.slice(0, 70)}"`); break; }
}
const count = (k) => { const c = {}; FAMILIES.forEach(f => { c[f[k]] = (c[f[k]] || 0) + 1; }); return c; };
console.log(`${FAMILIES.length} families. Forms ${JSON.stringify(count('form'))}. Rungs ${JSON.stringify(count('rung'))}.`);
console.log(`Outcomes touched: ${new Set(FAMILIES.map(f => f.outcome)).size}. Skills touched: ${skills.length}.`);
console.log(fails.length ? `\nFAILS (${fails.length}):\n  ${fails.slice(0, 60).join('\n  ')}` : '\nNo failures.');
if (!quiet) {
  for (const f of FAMILIES) {
    try {
      const { p } = drawFamily(f);
      console.log(`\n[${f.id}] ${f.skill} ${f.outcome} rung ${f.rung} ${f.form}\n  Q: ${p.question}${p.parts ? '\n  Parts: ' + p.parts.map(q => `${q.prompt} => ${q.answer}`).join(' | ') : ''}${p.shownSteps ? '\n  Working: ' + p.shownSteps.join(' / ') : ''}${p.choices ? '\n  Options: ' + p.choices.join(' | ') : ''}\n  A: ${p.answer}`);
    } catch (e) { console.log(`\n[${f.id}] threw ${e.message}`); }
  }
}
process.exit(fails.length ? 1 : 0);
