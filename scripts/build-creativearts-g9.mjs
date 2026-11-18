// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 9 (18 Nov 2026): the file HOREB owns (curriculum/creative_arts/g9.json) had the KICD outcomes,
// learning experiences and rubrics only. This merges the skills of scripts/data/creativearts-g9-skills.mjs, then the depth pass
// (scripts/data/creativearts-depth/g9.mjs through scripts/science-depth.mjs): prerequisites, four misconceptions per skill, the
// teaching pack (curriculum/creative_arts/teaching/g9/) and the practical outcomes marked by the teacher with the KICD rubric.
//   node scripts/build-creativearts-g9.mjs   then   npm run subject:map -- creativearts 9 --dir creative_arts --title "Creative Arts and Sports"
// Idempotent. Official outcomes and sub-strand text are never touched. Skills 'proposed', misconceptions 'draft'.
// No question families exist yet, so there is no subject entry (src/ai-tutor/content/subjects/) for Grade 9.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS } from './data/creativearts-g9-skills.mjs';
import { FM } from './data/creativearts-g9-skills.mjs';
import { SUBS as DEPTH } from './data/creativearts-depth/g9.mjs';
import { applyRubric } from './data/creativearts-depth/lib.mjs';
import { applyDepth } from './science-depth.mjs';
const path = new URL('../curriculum/creative_arts/g9.json', import.meta.url);
const g = JSON.parse(readFileSync(path, 'utf8'));
const P = 'CREA.G9.';
for (const s of g.sub_strands) { s.skills = []; s.misconceptions = []; }
const seen = new Set();
for (const [subKey, id, name, letters, mastery] of SKILLS) {
  const sub = g.sub_strands.find(x => x.code === `${P}${subKey}`); if (!sub) throw new Error(`no sub-strand ${subKey}`);
  if (seen.has(id)) throw new Error(`duplicate skill ${id}`); seen.add(id);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.code === `${sub.code}.${l}`); if (!o) throw new Error(`${id}: no outcome ${l}`); return o.code; });
  sub.skills.push({ code: `${sub.code}.${id}`, name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: FM, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites: [], status: 'proposed' });
}
const nRubric = applyRubric(g, DEPTH, P);
const depth = applyDepth(g, DEPTH, { dir: 'creative_arts', grade: 9, prefix: P, derive: true, title: 'Creative Arts and Sports' });
g.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 18 Nov 2026, depth pass: two or more prerequisites and four misconceptions per skill, practical outcomes marked by the teacher with the KICD rubric, teaching pack in curriculum/creative_arts/teaching/g9), awaiting a Creative Arts and Sports teacher's review";
writeFileSync(path, JSON.stringify(g, null, 1) + '\n');
console.log(`creative arts g9: ${g.totals.skills} skills, ${g.totals.prerequisites} prerequisites, ${g.totals.misconceptions} misconceptions; depth pass ${depth.subs} of ${depth.of} sub-strands (${depth.pack} teaching pack entries, ${nRubric} practical outcomes to the teacher's rubric)`);
