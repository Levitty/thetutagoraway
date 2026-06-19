// Audit content quality per skill: real vs fallback problems, worked examples,
// hints, answer variety. Run: node engine/scripts/audit_content.mjs
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');

const { SKILLS } = await import(resolve(root, 'src/ai-tutor/knowledgeGraph.js'));
const { generateProblem } = await import(resolve(root, 'src/ai-tutor/problemGenerators.js'));

const ids = Object.keys(SKILLS);
const isFallback = (p) =>
  p && typeof p.question === 'string' && p.question.startsWith('Practice:') && p.answer === '1';

let real = 0, fallback = 0, errored = 0, withExample = 0, withHint = 0, withSteps = 0, lowVariety = 0;
const fallbackByGrade = {}, fallbackList = [], noExampleReal = [], noVarietyList = [];

for (const id of ids) {
  let p;
  try { p = generateProblem(id); } catch { errored++; continue; }
  const grade = SKILLS[id].grade;
  if (isFallback(p)) {
    fallback++;
    fallbackByGrade[grade] = (fallbackByGrade[grade] || 0) + 1;
    fallbackList.push(id);
    continue;
  }
  real++;
  if (p.workedExample) withExample++; else noExampleReal.push(id);
  if (p.hint) withHint++;
  if (p.steps || p.workedExample?.steps) withSteps++;

  // Variety: generate 8 and count distinct question strings.
  const seen = new Set();
  for (let i = 0; i < 8; i++) {
    try { seen.add(generateProblem(id).question); } catch { /* */ }
  }
  if (seen.size <= 2) { lowVariety++; noVarietyList.push(`${id}(${seen.size})`); }
}

const pct = (n) => `${Math.round((100 * n) / ids.length)}%`;
console.log(`\n=== CONTENT AUDIT (${ids.length} math skills) ===`);
console.log(`Real problems   : ${real}  (${pct(real)})`);
console.log(`FAKE fallback   : ${fallback}  (${pct(fallback)})  <- teach nothing (answer "1")`);
console.log(`Errored         : ${errored}`);
console.log(`\nOf the ${real} real skills:`);
console.log(`  with worked example : ${withExample}  (${Math.round(100*withExample/real)}%)`);
console.log(`  with hint           : ${withHint}  (${Math.round(100*withHint/real)}%)`);
console.log(`  with steps          : ${withSteps}  (${Math.round(100*withSteps/real)}%)`);
console.log(`  LOW variety (≤2/8)  : ${lowVariety}`);

console.log(`\nFallback (fake) skills by grade:`);
for (const g of Object.keys(fallbackByGrade).sort((a,b)=>a-b))
  console.log(`  Grade ${g}: ${fallbackByGrade[g]}`);
console.log(`\nFake-content skill ids (${fallbackList.length}):`);
console.log('  ' + (fallbackList.join(', ') || '(none)'));
console.log(`\nReal skills MISSING a worked example (${noExampleReal.length}):`);
console.log('  ' + (noExampleReal.slice(0, 40).join(', ') || '(none)'));
if (noVarietyList.length) {
  console.log(`\nLow-variety skills (distinct questions / 8 tries):`);
  console.log('  ' + noVarietyList.slice(0, 30).join(', '));
}
