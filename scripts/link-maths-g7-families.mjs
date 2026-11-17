// One-off, kept for the record (17 Nov 2026): files the Grade 7 Maths families (g7_num_alg.js, g7_measure.js, g7_geo_data.js) under
// their curriculum skill and official outcome, and gives each wrong option the misconception it reveals.
//   node scripts/link-maths-g7-families.mjs [sub-strand key]
// A link is  familyId: [skill suffix, outcome letter, wrong-option codes, mis for a working]  (scripts/data/maths-g7/<sub>.mjs, `links`).
//   - `outcome: 'G7.X.l'` becomes the design's code and `cskill` is added (the HOREB `skill` stays: the practice engine uses it).
//   - codes are appended as the third element of each `[value, why]` in the family's `wrong: [...]` arrays, in order; a flat list serves
//     one array, a list of lists serves several (parts). Use 'SLIP' for a counting slip, null to leave one alone.
//   - a find-the-mistake working gets `mis: <code or expression>` before its `fix:`.
// Idempotent: a family that already has a cskill is skipped.
import { readFileSync, writeFileSync } from 'node:fs';
import { SUBS } from './data/maths-g7/index.mjs';
const DIR = new URL('../src/ai-tutor/content/families/', import.meta.url);
const FILES = ['g7_num_alg.js', 'g7_measure.js', 'g7_geo_data.js', 'gaps.js', 'labelFixes.js'];
const only = process.argv[2];
const src = Object.fromEntries(FILES.map(f => [f, readFileSync(new URL(f, DIR), 'utf8')]));
const problems = []; let done = 0, skipped = 0;
// the end index of the balanced bracket that opens at i
const close = (s, i) => { let d = 0, q = null; for (let k = i; k < s.length; k++) { const c = s[k]; if (q) { if (c === '\\') k++; else if (c === q) q = null; else if (q === '`' && c === '$' && s[k + 1] === '{') { const e = close(s, k + 1); k = e; } continue; } if (c === "'" || c === '"' || c === '`') q = c; else if (c === '[' || c === '(' || c === '{') d++; else if (c === ']' || c === ')' || c === '}') { d--; if (d === 0) return k; } } return -1; };
const topLevel = (s, from, to) => { const out = []; for (let k = from + 1; k < to; k++) { if (s[k] === '[') { const e = close(s, k); out.push([k, e]); k = e; } else if (s[k] === "'" || s[k] === '"' || s[k] === '`') { const q = s[k]; for (k++; k < to && s[k] !== q; k++) if (s[k] === '\\') k++; } } return out; };

for (const d of SUBS) {
  if (only && d.key !== only) continue;
  for (const [id, [cs, letter, codes, mis]] of Object.entries(d.links || {})) {
    const file = FILES.find(f => src[f].includes(`id: '${id}'`));
    if (!file) { problems.push(`${id}: not found`); continue; }
    let s = src[file];
    const start = s.indexOf(`fam({ id: '${id}'`);
    let end = s.indexOf('\n  fam({ id:', start + 10); if (end < 0) end = s.length;
    let block = s.slice(start, end);
    if (/cskill:/.test(block.slice(0, 300))) { skipped++; continue; }
    const m = /outcome: 'G7\.[A-Z_]+\.([a-z])'/.exec(block.slice(0, 300));
    if (!m) { problems.push(`${id}: no old outcome`); continue; }
    block = block.replace(m[0], `outcome: 'MATH.G7.${d.key}.${letter}', cskill: 'MATH.G7.${d.key}.${cs}'`);
    // wrong options
    if (codes) {
      const lists = Array.isArray(codes[0]) ? codes : [codes];
      let at = 0, n = 0, bad = false;
      const re = /wrong: \[/g; let hit;
      const edits = [];
      while ((hit = re.exec(block))) {
        const open = hit.index + 'wrong: '.length, shut = close(block, open);
        const items = topLevel(block, open, shut);
        if (!items.length) continue;     // wrong: []
        const list = lists[Math.min(n, lists.length - 1)]; n++;
        if (list.length !== items.length) { problems.push(`${id}: wrong array ${n} has ${items.length} options, ${list.length} codes`); bad = true; break; }
        items.forEach(([a, b], i) => { if (list[i]) edits.push([b, `, '${list[i]}'`]); });
      }
      if (bad) continue;
      if (!n) { problems.push(`${id}: no wrong: [..] array (options or other form): edit by hand`); continue; }
      for (const [pos, text] of edits.sort((x, y) => y[0] - x[0])) block = block.slice(0, pos) + text + block.slice(pos);
    }
    if (mis) {
      const expr = /^[A-Z_]+$/.test(mis) ? `'${mis}'` : mis;
      const i = block.indexOf('fix:');
      if (i < 0) { problems.push(`${id}: no fix: for mis`); continue; }
      block = block.slice(0, i) + `mis: ${expr},\n        ` + block.slice(i);
    }
    src[file] = s.slice(0, start) + block + s.slice(end); done++;
  }
}
for (const f of FILES) writeFileSync(new URL(f, DIR), src[f]);
console.log(`linked ${done}, already linked ${skipped}`); for (const p of problems) console.log('PROBLEM ' + p);
