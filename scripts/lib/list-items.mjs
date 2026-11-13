// Writes docs/qa/<subject>-g<N>-items-for-native-speaker-<date>.md: every distinct question a subject-grade's families can draw,
// for a native speaker or subject teacher to read (key after =>, wrong options after x, the feedback a child reads).
//   node scripts/lib/list-items.mjs <subject> <grade> [draws]
import { writeFileSync } from 'node:fs';
const [subject, gradeArg, drawsArg] = process.argv.slice(2);
const grade = Number(gradeArg), draws = Number(drawsArg || 240);
const { entryFor } = await import('../../src/ai-tutor/content/subjects/registry.js');
const { drawFamily, setFamilyMode } = await import('../../src/ai-tutor/content/families/core.js');
setFamilyMode('all');
const entry = entryFor(subject, grade);
const cell = (t) => String(t ?? '').replace(/\s+/g, ' ').trim();
let total = 0, out = '';
for (const f of entry.families) {
  if (f.form === 'spot' || f.kind === 'spot' || String(f.kind).startsWith('spot')) continue;   // re-uses the sentences of the choose and gap families
  const seen = new Map();
  for (let i = 0; i < draws; i++) {
    let p; try { ({ p } = drawFamily(f)); } catch { continue; }
    if (!p || p.working) continue;   // spot-the-mistake families re-use the sentences of the pool they share with the choose and gap families
    const opts = p.options || [];
    const right = opts.find(o => o.right);
    const key = `${p.question}|${p.answer ?? right?.text ?? ''}`;
    if (seen.has(key)) continue;
    const wrongs = opts.filter(o => !o.right).map(o => cell(o.text)).join(' / ');
    const ans = p.answer ?? right?.text ?? (p.working ? `(find step ${p.working.findIndex(w => !w.ok) + 1})` : '');
    if (f.kind === 'order-events' && seen.size >= 4) continue;
    seen.set(key, `- ${p.passage ? `[${cell(p.passage.title)}] ` : ''}${cell(p.question)} => ${cell(ans)}${wrongs ? `  x  ${wrongs}` : ''}  | ${cell((p.steps || [])[0] || p.fix || '')}`);
  }
  total += seen.size;
  out += `\n## ${f.id}\n\n${[...seen.values()].join('\n')}\n`;
}
const date = '2026-11-13';
const md = `# ${entry.name} Grade ${grade}: every draft item, for a native speaker or subject teacher (${date})

Generated from the registry entry by \`scripts/lib/list-items.mjs\` (each family drawn ${draws} times, distinct questions kept; spot-the-mistake families are left out because they re-use the sentences of the choose and gap families). Each line: the stem, the keyed answer after "=>", the wrong options after "x", then the first line of the feedback a child reads. A "___" is the gap. Please mark any line where the key is wrong, a wrong option is also acceptable, the language is unnatural for a Kenyan learner of this grade, or the word is too hard. Nothing here is signed off; every family is \`reviewed: false\`.

Distinct items listed: ${total}
${out}`;
const file = `docs/qa/${subject}-g${grade}-items-for-native-speaker-${date}.md`;
writeFileSync(new URL(`../../${file}`, import.meta.url), md);
console.log(`${file}: ${total} distinct items over ${entry.families.length} families`);
