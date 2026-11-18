// ============================================================================
// SCIENCE AND TECHNOLOGY GRADE 5, depth pass (18 Nov 2026). Grade 5 was authored straight into curriculum/science/g5.json
// (12 Nov 2026), so that file stays the source for its first skills and misconceptions. This script adds the depth pass on top
// (scripts/data/science-depth/g5.mjs through scripts/science-depth.mjs: more prerequisites, misconceptions to four per skill, the
// teaching pack in curriculum/science/teaching/g5/). Idempotent: what an earlier run added is taken off before it is added again.
//   node scripts/build-science-g5.mjs      then  node scripts/build-curriculum-map-science.mjs
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { SUBS } from './data/science-depth/g5.mjs';
import { applyDepth } from './science-depth.mjs';

const path = new URL('../curriculum/science/g5.json', import.meta.url);
const g5 = JSON.parse(readFileSync(path, 'utf8'));
const P = 'SCIE.G5.';
// The depth pass's own misconceptions and prerequisites, so a rebuild starts from the first pass.
export const DEPTH_SHORTS = new Set(SUBS.flatMap(d => (d.mis || []).map(m => m[1])));
const keyCode = new Map(g5.sub_strands.flatMap(s => (s.skills || []).map(k => [k.code.slice(s.code.length + 1), k.code])));
for (const s of g5.sub_strands) {
  const d = SUBS.find(x => `${P}${x.key}` === s.code);
  s.misconceptions = s.misconceptions.filter(m => !DEPTH_SHORTS.has(m.code.slice(m.skill.length + 1)));
  for (const k of s.skills) {
    const added = new Set((d?.pre?.[k.code.slice(s.code.length + 1)] || []).map(([ref]) => (ref.includes('.') ? ref : keyCode.get(ref))));
    k.prerequisites = k.prerequisites.filter(p => !added.has(p.requires));
  }
}
const depth = applyDepth(g5, SUBS, { dir: 'science', grade: 5, prefix: P });
g5.status = g5.status.replace(/; depth pass 18 Nov 2026.*$/, '') + '; depth pass 18 Nov 2026 (two or more prerequisites and four misconceptions per skill, teaching pack in curriculum/science/teaching/g5)';
writeFileSync(path, JSON.stringify(g5, null, 1) + '\n');
console.log(`science g5: ${g5.totals.skills} skills, ${g5.totals.prerequisites} prerequisites, ${g5.totals.misconceptions} misconceptions; depth pass ${depth.subs} of ${depth.of} sub-strands (+${depth.pre} prerequisites, +${depth.mis} misconceptions, ${depth.pack} teaching pack entries)`);
