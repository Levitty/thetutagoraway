// Switch on what a person signed off:  node scripts/apply-question-review.mjs <sign-off.xlsx> [--dry]
// Writes `reviewed: true` onto each family marked OK, in the content itself.
// Change and Drop are listed for whoever fixes them; nothing else is touched.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { readXlsx } from './lib/xlsx.mjs';

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/apply-question-review.mjs <sign-off.xlsx> [--dry]'); process.exit(2); }
const dry = process.argv.includes('--dry');
const [head, ...rows] = readXlsx(readFileSync(file));
const col = (n) => head.indexOf(n);
const DIR = new URL('../src/ai-tutor/content/families/', import.meta.url);
const sources = Object.fromEntries(readdirSync(DIR).filter(f => /^(g\d.*|gaps|labelFixes)\.js$/.test(f)).map(f => [f, readFileSync(new URL(f, DIR), 'utf8')]));
const on = [], later = [], missing = [];
for (const r of rows) {
  const id = r[col('Family')], decision = String(r[col('Decision')] || '').trim().toLowerCase();
  if (!id || !decision) continue;
  if (decision !== 'ok') { later.push(`${id}: ${decision}${r[col('Comment')] ? `: ${r[col('Comment')]}` : ''}`); continue; }
  const needle = new RegExp(`id: '${id.replace(/[.]/g, '\\.')}'(,\\s*reviewed: true)?`);
  const name = Object.keys(sources).find(f => needle.test(sources[f]));
  if (!name) { missing.push(id); continue; }
  sources[name] = sources[name].replace(needle, `id: '${id}', reviewed: true`);
  on.push(id);
}
if (!dry) for (const [f, text] of Object.entries(sources)) writeFileSync(new URL(f, DIR), text);
console.log(`${dry ? 'Would switch on' : 'Switched on'} ${on.length} families.`);
if (later.length) console.log(`\nTo fix or drop (${later.length}):\n  ${later.join('\n  ')}`);
if (missing.length) console.log(`\nNot found (${missing.length}): ${missing.join(', ')}`);
if (!dry) console.log('\nNow run: npm test && npm run test:content');
