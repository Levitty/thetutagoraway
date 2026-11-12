// One-off (kept for the record): files the Grade 4 families written before the curriculum map (g4.js, labelFixes.js) under
// the official skill and outcome. Adds cskill, the official outcome code, misMapped: false and reveals beside the HOREB skill.
//   node scripts/build-curriculum-map-g4.mjs   then   node scripts/link-maths-g4-families.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { LINKS } from './data/maths-g4-links.mjs';
import { SKILLS_G4 } from '../src/ai-tutor/content/curriculumMap.g4.js';
const DIR = new URL('../src/ai-tutor/content/families/', import.meta.url);
let done = 0; const left = new Set(Object.keys(LINKS));
for (const fn of ['g4.js', 'labelFixes.js']) {
  let s = readFileSync(new URL(fn, DIR), 'utf8');
  for (const [id, [cs, letter, reveals]] of Object.entries(LINKS)) {
    const code = `MATH.G4.${cs}`, sk = SKILLS_G4[code];
    if (!sk) throw new Error(`no skill ${code}`);
    const outcome = sk.outcomes.find(o => o.endsWith(`.${letter}`));
    if (!outcome) throw new Error(`${id}: outcome ${letter} is not on ${code}`);
    for (const r of reveals) if (!sk.mis.includes(r) && !Object.values(SKILLS_G4).some(k => k.sub === sk.sub && k.mis.includes(r))) throw new Error(`${id}: ${r} is not a misconception of ${code}'s sub-strand`);
    const re = new RegExp(`(id: '${id.replace(/[.]/g, '\\.')}',[^\\n]*?)outcome: '[^']+'`);
    if (!re.test(s) || new RegExp(`id: '${id.replace(/[.]/g, '\\.')}',[^\\n]*?cskill: `).test(s)) continue;   // idempotent: skip a family already linked
    s = s.replace(re, `$1cskill: '${code}', outcome: '${outcome}', misMapped: false, reveals: [${reveals.map(r => `'${r}'`).join(', ')}]`);
    left.delete(id); done++;
  }
  writeFileSync(new URL(fn, DIR), s);
}
console.log(`linked ${done}; not found: ${[...left].join(', ') || 'none'}`);
