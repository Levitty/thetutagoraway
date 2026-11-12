// One-off (kept for the record): files the Grade 6 families written before the curriculum map (g6.js, g6_cov.js) under
// the official skill and outcome. Adds cskill, the official outcome code, misMapped: false and reveals beside the HOREB skill.
//   node scripts/link-maths-g6-families.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { LINKS } from './data/maths-g6-links.mjs';
import { SKILLS_G6 } from '../src/ai-tutor/content/curriculumMap.g6.js';
const DIR = new URL('../src/ai-tutor/content/families/', import.meta.url);
let done = 0; const left = new Set(Object.keys(LINKS));
for (const fn of ['g6.js', 'g6_cov.js', 'labelFixes.js']) {
  let s = readFileSync(new URL(fn, DIR), 'utf8');
  for (const [id, [cs, letter, reveals]] of Object.entries(LINKS)) {
    const code = `MATH.G6.${cs}`, sk = SKILLS_G6[code];
    if (!sk) throw new Error(`no skill ${code}`);
    const outcome = sk.outcomes.find(o => o.endsWith(`.${letter}`));
    if (!outcome) throw new Error(`${id}: outcome ${letter} is not on ${code}`);
    for (const r of reveals) if (!sk.mis.includes(r) && !Object.values(SKILLS_G6).some(k => k.sub === sk.sub && k.mis.includes(r))) throw new Error(`${id}: ${r} is not a misconception of ${code}'s sub-strand`);
    const re = new RegExp(`(id: '${id.replace(/[.]/g, '\\.')}',[^\\n]*?)outcome: '[^']+'`);
    if (!re.test(s) || new RegExp(`id: '${id.replace(/[.]/g, '\\.')}',[^\\n]*?cskill: `).test(s)) continue;   // idempotent: skip a family already linked
    s = s.replace(re, `$1cskill: '${code}', outcome: '${outcome}', misMapped: false, reveals: [${reveals.map(r => `'${r}'`).join(', ')}]`);
    left.delete(id); done++;
  }
  writeFileSync(new URL(fn, DIR), s);
}
console.log(`linked ${done}; not found: ${[...left].join(', ') || 'none'}`);
