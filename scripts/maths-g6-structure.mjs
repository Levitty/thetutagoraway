// Grade 6 Maths: per curriculum skill, how many families and how many different structures. Free, local.
//   node scripts/maths-g6-structure.mjs [--short]    lists the skills with fewer than 2 families or fewer than 2 structures
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { drawFamily, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_G6 } from '../src/ai-tutor/content/curriculumMap.g6.js';
import { formText, clusterForms } from '../engine/scripts/content_measures.mjs';
setFamilyMode('all');
const rows = [];
for (const [code, k] of Object.entries(SKILLS_G6)) {
  const fams = FAMILIES.filter(f => f.cskill === code);
  const texts = [];
  for (const f of fams) for (let i = 0; i < 20; i++) texts.push(formText(drawFamily(f).p));
  rows.push({ code: code.replace('MATH.G6.', ''), families: fams.length, forms: new Set(fams.map(f => f.form)).size, structures: fams.length ? clusterForms(texts).length : 0 });
}
const thin = rows.filter(r => r.families < 2 || r.structures < 2);
if (process.argv.includes('--short')) console.log(thin.map(r => `${r.code} f${r.families} s${r.structures}`).join('\n'));
else console.log(JSON.stringify({ skills: rows.length, thin: thin.length, rows }, null, 1));
