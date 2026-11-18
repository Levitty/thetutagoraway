// Files one grade's Maths question families under their curriculum skill and official outcome, and gives each wrong option
// the misconception it reveals. Kept for the record and re-runnable (idempotent).
//   node scripts/link-maths-families.mjs 7|8 [sub-strand key]
//   Grade 7 (17 Nov 2026): g7_num_alg.js, g7_measure.js, g7_geo_data.js, gaps.js, labelFixes.js
//   Grade 8 (18 Nov 2026): g8_num_alg.js, g8_measure_geo.js, g8_cov.js, gaps.js, labelFixes.js
//   Grade 9 (18 Nov 2026): g9_num_alg.js, g9_measure.js, g9_geo_data.js, gaps.js, labelFixes.js
//   Grade 4 (18 Nov 2026): g4.js, labelFixes.js. These 61 older families were filed at family level on 12 Nov 2026
//     (scripts/link-maths-g4-families.mjs, now the old command for this one). A family already filed with `misMapped: false` is
//     retagged when its link now names codes, options or a working's mis: the family-level tie is removed and each wrong answer
//     gets its own code. A link with only reveals (6th) keeps the family-level tie. (The 127 g4c_*.js families are written with
//     their codes and need no link.)
// One linker for both grades (18 Nov 2026): scripts/link-maths-g7-families.mjs is kept as the old command.
// A link is  familyId: [skill suffix, outcome letter, wrong-option codes, mis for a working, options, reveals]
// (scripts/data/maths-g<grade>/<sub>.mjs, `links`).
//   - `outcome: 'G7.X.l'` becomes the design's code and `cskill` is added (the HOREB `skill` stays: the practice engine uses it).
//   - codes are appended as the third element of each `[value, why]` in the family's `wrong: [...]` arrays, in order; a flat list serves
//     one array, a list of lists serves several (parts). Use 'SLIP' for a counting slip, null to leave one alone.
//   - options (5th): [[text inside an option's why, code]] puts mis on that option of a choice question.
//   - a find-the-mistake working gets `mis: <code or expression>` before its `fix:`.
//   - reveals (6th, Grade 8): a family whose wrong answers are built in a form the tool cannot tag one by one (the coverage kit's
//     `cov(...)`, options made by `mc`) is tied at family level instead, as Grade 6's coverage families are:
//     `misMapped: false, reveals: [codes]`.
// Idempotent: a family that already has a cskill is skipped.
import { readFileSync, writeFileSync } from 'node:fs';
const GRADE = Number(process.argv[2]);
const FILES = { 4: ['g4.js', 'labelFixes.js'], 7: ['g7_num_alg.js', 'g7_measure.js', 'g7_geo_data.js', 'gaps.js', 'labelFixes.js'], 8: ['g8_num_alg.js', 'g8_measure_geo.js', 'g8_cov.js', 'gaps.js', 'labelFixes.js'], 9: ['g9_num_alg.js', 'g9_measure.js', 'g9_geo_data.js', 'gaps.js', 'labelFixes.js'] }[GRADE];
if (!FILES) { console.error('usage: node scripts/link-maths-families.mjs 4|7|8|9 [sub-strand key]'); process.exit(1); }
const { SUBS } = await import(`./data/maths-g${GRADE}/index.mjs`);
const DIR = new URL('../src/ai-tutor/content/families/', import.meta.url);
const only = process.argv[3];
const src = Object.fromEntries(FILES.map(f => [f, readFileSync(new URL(f, DIR), 'utf8')]));
const problems = []; let done = 0, skipped = 0;
// the end index of the balanced bracket that opens at i
const close = (s, i) => { let d = 0, q = null; for (let k = i; k < s.length; k++) { const c = s[k]; if (q) { if (c === '\\') k++; else if (c === q) q = null; else if (q === '`' && c === '$' && s[k + 1] === '{') { const e = close(s, k + 1); k = e; } continue; } if (c === "'" || c === '"' || c === '`') q = c; else if (c === '[' || c === '(' || c === '{') d++; else if (c === ']' || c === ')' || c === '}') { d--; if (d === 0) return k; } } return -1; };
const topLevel = (s, from, to) => { const out = []; for (let k = from + 1; k < to; k++) { if (s[k] === '[') { const e = close(s, k); out.push([k, e]); k = e; } else if (s[k] === "'" || s[k] === '"' || s[k] === '`') { const q = s[k]; for (k++; k < to && s[k] !== q; k++) if (s[k] === '\\') k++; } } return out; };

for (const d of SUBS) {
  if (only && d.key !== only) continue;
  for (const [id, [cs, letter, codes, mis, opts, reveals]] of Object.entries(d.links || {})) {
    const file = FILES.find(f => src[f].includes(`id: '${id}'`));
    if (!file) { problems.push(`${id}: not found`); continue; }
    let s = src[file];
    const startRe = new RegExp(`(fam|fx|cov)\\(\\{ id: '${id.replace(/\./g, '\\.')}'`); const sm = startRe.exec(s); const start = sm ? sm.index : -1;
    const nextRe = /\n  (fam|fx|cov)\(\{ id:/g; nextRe.lastIndex = start + 10; const nm = nextRe.exec(s); let end = nm ? nm.index : s.length;
    let block = s.slice(start, end);
    if (/cskill:/.test(block.slice(0, 400))) {
      // already filed: retag a family-level tie when the link now ties the wrong answers one by one
      if (!/misMapped: false/.test(block.slice(0, 400))) { skipped++; continue; }
      if (!(codes || opts || mis)) {
        // still family level: the reveals are brought up to the link's (a family filed with reveals: [] names one now)
        const want = reveals ? `reveals: ${JSON.stringify(reveals).replace(/"/g, "'").replace(/,/g, ', ')}` : null;
        const have = /reveals: \[[^\]]*\]/.exec(block.slice(0, 400));
        if (!want || !have || have[0] === want) { skipped++; continue; }
        src[file] = s.slice(0, start) + block.replace(have[0], want) + s.slice(end); done++; continue;
      }
      block = block.replace(/, misMapped: false, reveals: \[[^\]]*\]/, '');
    } else {
    const m = new RegExp(`outcome: 'G${GRADE}\\.[A-Z_]+\\.([a-z])'`).exec(block.slice(0, 300));
    if (!m) { problems.push(`${id}: no old outcome`); continue; }
    block = block.replace(m[0], `outcome: 'MATH.G${GRADE}.${d.key}.${letter}', cskill: 'MATH.G${GRADE}.${d.key}.${cs}'` + (reveals ? `, misMapped: false, reveals: ${JSON.stringify(reveals).replace(/"/g, "'").replace(/,/g, ', ')}` : ''));
    }
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
    // options: [[a piece of an option's `why`, code]]: the code goes on that option as `mis`
    for (const [bit, code] of opts || []) {
      const at = block.indexOf(bit);
      if (at < 0) { problems.push(`${id}: option text "${bit}" not found`); continue; }
      const m2 = /(`|')\s*\}/.exec(block.slice(at));
      if (!m2) { problems.push(`${id}: no end of option for "${bit}"`); continue; }
      const pos = at + m2.index + 1;
      block = block.slice(0, pos) + `, mis: '${code}'` + block.slice(pos);
    }
    if (mis) {
      const expr = /^[A-Z0-9_]+$/.test(mis) ? `'${mis}'` : mis;
      // fix: written out, or the shorthand `working, fix,` (Grade 9's spot families): mis goes just before it
      const i = block.indexOf('fix:'), j = block.search(/\bfix,/);
      if (i < 0 && j < 0) { problems.push(`${id}: no fix: for mis`); continue; }
      block = i >= 0 ? block.slice(0, i) + `mis: ${expr},\n        ` + block.slice(i) : block.slice(0, j) + `mis: ${expr}, ` + block.slice(j);
    }
    src[file] = s.slice(0, start) + block + s.slice(end); done++;
  }
}
for (const f of FILES) writeFileSync(new URL(f, DIR), src[f]);
console.log(`linked ${done}, already linked ${skipped}`); for (const p of problems) console.log('PROBLEM ' + p);
