// Dump a hand-reading sample: N questions per CBC grade with hints and worked
// examples.   node qa/sample.mjs [--n 12] [--seed 5]
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { gradeOf } from '../src/ai-tutor/curricula.js';
const args = process.argv.slice(2);
const N = Number(args[args.indexOf('--n') + 1]) || 12;
let seed = Number(args[args.indexOf('--seed') + 1]) || 5;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
for (let g = 4; g <= 9; g++) {
  const ids = Object.values(SKILLS).filter(s => s.curricula?.cbc?.inScope !== false && s.curricula?.cbc && gradeOf(s, 'cbc') === g).map(s => s.id);
  const chosen = [...ids].sort(() => rnd() - 0.5).slice(0, N);
  console.log(`\n=================== CBC GRADE ${g} (${ids.length} skills) ===================`);
  for (const id of chosen) {
    const p = generateProblem(id);
    const fig = ['picture', 'visual', 'model'].filter(k => p[k]).map(k => `${k}:${p[k]?.kind || p[k]?.type || 'yes'}`).join(',');
    console.log(`\n# ${id} — ${SKILLS[id].name}${fig ? `  [figure ${fig}]` : ''}`);
    if (p.instruction) console.log(`  instr: ${p.instruction}`);
    console.log(`  Q: ${p.question}`);
    console.log(`  key: ${p.answer}   accepts: ${JSON.stringify(p.accepts || [])}${p.choices ? `   choices: ${JSON.stringify(p.choices)}` : ''}`);
    for (const h of (p.hints || [p.hint]).filter(Boolean)) console.log(`  hint: ${h}`);
    const we = p.workedExample;
    if (we) console.log(`  worked: ${we.question} | ${(we.steps || []).map(s => typeof s === 'string' ? s : s.text || JSON.stringify(s)).join(' / ')} | = ${we.answer}`);
  }
}
