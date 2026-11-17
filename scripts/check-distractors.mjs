// ============================================================================
// CHECK DISTRACTORS (17 Nov 2026): free, local, no AI. Draws every Grade 5 and Grade 7
// curriculum family many times, exactly as homework does (toItem), and counts
// wrong options that would tell the learner record something untrue:
//   (a) shared    two or more wrong options in one question carry the same code
//   (b) nearmiss  a wrong answer one or two off the right one (a slip) carries a code
//   (c) reason    a wrong option with no reason, or a generic one ("Check your working")
//   (d) unmapped  a code misCode cannot resolve to the library (EXIT 1 always)
// A wrong answer marked 'SLIP' is counted wrong and carries no code, so it is
// never reported under (a) or (b).
//
//   node scripts/check-distractors.mjs                 summary + per-family list
//   node scripts/check-distractors.mjs --draws 80      draws per family (default 40)
//   node scripts/check-distractors.mjs --family g5c.eq.mean.pick
//   node scripts/check-distractors.mjs --update-baseline   write the current counts
//   node scripts/check-distractors.mjs --baseline path.json
// Fails (exit 1) on any (d), and when a family not in the baseline is flagged
// under (a), (b) or (c). Fixing families only ever lowers the baseline.
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { drawFamily } from '../src/ai-tutor/content/families/core.js';
import { withSeed, misCode, isSlip } from '../src/school/homework.js';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes(k);
const DRAWS = Number(arg('--draws', 40));
const ONLY = arg('--family', null);
const BASE = arg('--baseline', fileURLToPath(new URL('./distractor-baseline.json', import.meta.url)));
const METRICS = ['shared', 'nearmiss', 'reason'];

const GENERIC = /^(check|recheck|try again|look again|read again|work it out|think again|have another look)\b/i;
const words = (t) => String(t || '').trim().split(/\s+/).filter(Boolean).length;
export const thinReason = (why) => { const t = String(why || '').trim(); return !t || GENERIC.test(t) || words(t) < 5; };

const num = (t) => { const s = String(t).replace(/,/g, '').trim(); return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null; };
// A slip is a miscount of one or two. Only whole numbers can be that: 3.04 beside 3.4 is a place-value idea, not a slip (18 Nov 2026).
const isInt = (v) => Number.isInteger(v);

const families = FAMILIES.filter(f => f.cskill && /^g(5c|7)\./.test(String(f.id)) && (!ONLY || f.id === ONLY));
const found = {}; // familyId -> { shared: Set(examples), nearmiss: ..., reason: ..., unmapped: ... }
const bump = (id, metric, example) => { ((found[id] ||= { shared: new Set(), nearmiss: new Set(), reason: new Set(), unmapped: new Set() })[metric]).add(example); };

for (const f of families) {
  for (let k = 0; k < DRAWS; k++) {
    let p; try { p = withSeed(`check:${f.id}:${k}`, () => drawFamily(f).p); } catch { continue; }
    const ans = num(p.answer);
    const wrongs = (p.misconceptions || []).filter(m => m && m.when != null);
    // (d) every code in the family must resolve
    for (const m of wrongs) if (m.mis && !isSlip(m.mis) && !misCode(p.cskill, m.mis)) bump(f.id, 'unmapped', String(m.mis));
    for (const m of [].concat(p.mis || [])) if (m && !isSlip(m) && !misCode(p.cskill, m)) bump(f.id, 'unmapped', String(m));
    // (c) reasons, only on wrong answers the family wrote
    for (const m of wrongs) if (thinReason(m.feedback)) bump(f.id, 'reason', `${m.when}: ${String(m.feedback || '(none)').slice(0, 50)}`);
    // (a) shared codes in one question
    const byCode = {};
    for (const m of wrongs) { const c = m.mis && !isSlip(m.mis) ? misCode(p.cskill, m.mis) : null; if (c) (byCode[c] ||= []).push(m.when); }
    for (const [c, list] of Object.entries(byCode)) if (list.length >= 2) bump(f.id, 'shared', `${c.split('.').pop()} x${list.length}`);
    // (b) near misses carrying a code
    if (ans !== null) for (const m of wrongs) {
      const v = num(m.when); if (v === null || !m.mis || isSlip(m.mis)) continue;
      if (isInt(v) && isInt(ans) && Math.abs(v - ans) <= 2 && Math.abs(v - ans) > 0) bump(f.id, 'nearmiss', `${m.when} vs ${p.answer} (${String(m.mis).slice(0, 40)})`);
    }
  }
}

const flagged = (metric) => Object.keys(found).filter(id => found[id][metric].size).sort();
const summary = Object.fromEntries([...METRICS, 'unmapped'].map(m => [m, flagged(m)]));
console.log(`Distractor check: ${families.length} Grade 5 and Grade 7 families, ${DRAWS} draws each`);
console.log('  (a) families with 2+ wrong options sharing a code ........ ' + summary.shared.length);
console.log('  (b) families with a near-miss answer carrying a code ..... ' + summary.nearmiss.length);
console.log('  (c) families with an empty or generic wrong-option reason  ' + summary.reason.length);
console.log('  (d) families with a code the library cannot resolve ...... ' + summary.unmapped.length);
if (flag('--quiet') === false) {
  for (const id of Object.keys(found).sort()) {
    const row = found[id]; const bits = [];
    for (const m of [...METRICS, 'unmapped']) if (row[m].size) bits.push(`${m}: ${[...row[m]].slice(0, 2).join(' | ')}`);
    if (bits.length) console.log(`  ${id}  ${bits.join('  //  ')}`);
  }
}

if (flag('--update-baseline')) {
  writeFileSync(BASE, JSON.stringify({ note: 'Families flagged today by scripts/check-distractors.mjs. Fix a family, then rerun with --update-baseline. It may only shrink.', draws: DRAWS, counts: Object.fromEntries(METRICS.map(m => [m, summary[m].length])), families: Object.fromEntries(METRICS.map(m => [m, summary[m]])) }, null, 1) + '\n');
  console.log('Baseline written: ' + BASE);
  process.exit(summary.unmapped.length ? 1 : 0);
}

let fail = summary.unmapped.length > 0;
if (fail) console.log('FAIL: codes the library cannot resolve: ' + summary.unmapped.join(', '));
if (!ONLY && existsSync(BASE)) {
  const b = JSON.parse(readFileSync(BASE, 'utf8'));
  for (const m of METRICS) {
    const had = new Set(b.families?.[m] || []);
    const fresh = summary[m].filter(id => !had.has(id));
    if (fresh.length) { fail = true; console.log(`FAIL (${m}): new families over the baseline: ${fresh.join(', ')}`); }
  }
} else if (!ONLY) console.log('No baseline file; run with --update-baseline to create one.');
process.exit(fail ? 1 : 0);
