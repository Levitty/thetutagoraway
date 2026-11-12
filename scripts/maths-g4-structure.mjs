// Grade 4 Maths: per curriculum skill, how many families and how many different structures. Free, local.
//   node scripts/maths-g4-structure.mjs [--short]    lists the skills with fewer than 2 families or fewer than 2 structures
// Skills marked hands_on in the map (draw, collect, make a pattern with cut-outs) are listed apart: a typed answer cannot test them.
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { drawFamily, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_G4 } from '../src/ai-tutor/content/curriculumMap.g4.js';
import { formText, clusterForms } from '../engine/scripts/content_measures.mjs';
setFamilyMode('all');
const warn = console.warn; console.warn = () => {};
const rows = [];
for (const [code, k] of Object.entries(SKILLS_G4)) {
  const fams = FAMILIES.filter(f => f.cskill === code);
  const texts = [];
  for (const f of fams) for (let i = 0; i < 20; i++) { try { texts.push(formText(drawFamily(f).p)); } catch { /* family_checks reports it */ } }
  rows.push({ code: code.replace('MATH.G4.', ''), hands: !!k.hands, families: fams.length, forms: new Set(fams.map(f => f.form)).size, structures: fams.length ? clusterForms(texts).length : 0 });
}
const thin = rows.filter(r => !r.hands && (r.families < 2 || r.structures < 2));
const handsOnly = rows.filter(r => r.hands && r.families === 0);
if (process.argv.includes('--short')) console.log(thin.map(r => `${r.code} f${r.families} s${r.structures}`).join('\n'), `\n-- hands-on, no typed family (${handsOnly.length}): ${handsOnly.map(r => r.code).join(', ')}`);
else console.log(JSON.stringify({ skills: rows.length, thin: thin.length, handsOnly: handsOnly.length, rows }, null, 1));
