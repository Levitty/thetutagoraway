// Quick look while writing families:  node scripts/g5c-try.mjs <file> [id-substring] [draws]
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { drawFamily } from '../src/ai-tutor/content/families/core.js';
import { checkFamily } from '../engine/scripts/family_checks.mjs';
const [file, only, n = '1'] = process.argv.slice(2);
const { FAMILIES } = await import(pathToFileURL(resolve(file)).href);
for (const f of FAMILIES.filter(f => !only || f.id.includes(only))) {
  try {
    for (let i = 0; i < Number(n); i++) {
      const { p } = drawFamily(f);
      console.log(`\n[${f.id}] ${f.form} r${f.rung}\n  Q: ${p.question}${p.parts ? '\n  Parts: ' + p.parts.map(q => `${q.prompt} => ${q.answer} (wrong ${q.mistakes.map(m => m.when).join('|')})`).join(' || ') : ''}${p.shownSteps ? '\n  Working: ' + p.shownSteps.join(' / ') + '\n  Fix: ' + p.explain : ''}${p.choices ? '\n  Options: ' + p.choices.join(' | ') + '\n  Right: ' + p.answer : ''}${!p.choices && !p.parts && !p.shownSteps ? `\n  A: ${p.answer}  wrong: ${(p.misconceptions || []).map(m => m.when).join(' | ')}` : ''}`);
    }
    const bad = checkFamily(f, 200); if (bad.length) console.log('  FAIL:', bad.slice(0, 4).join('\n        '));
  } catch (e) { console.log(`\n[${f.id}] THREW ${e.message.split('\n')[0]}`); }
}
