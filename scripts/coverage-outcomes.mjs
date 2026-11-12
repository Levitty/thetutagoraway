// ============================================================================
// OUTCOME COVERAGE, MATHS GRADES 1 TO 9: free, local, no model calls.
//   npm run coverage:outcomes            writes docs/qa/coverage-<date>.md
//   node scripts/coverage-outcomes.mjs --json   prints the numbers only
//
// For every official outcome in curriculum/mathematics/g<N>.json: does it have a
// question family, a generator skill, misconception feedback, a worked example?
// Links are through the outcome code. HOREB's own outcome list (G5.WHOLE.a) is
// joined to the official codes (MATH.G5.NUMBER.WHOLE_NUMBERS.a) by sub-strand
// code and the design's letter. Grades 1 to 3 are tagged to a sub-strand only,
// not to an outcome: they are shown separately as "sub-strand level".
// Counts and codes only. The coverage is of what exists in the bank, reviewed or
// not: no family is signed off yet, and the report says how many are live.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { OUTCOMES, CBC_SUBSTRANDS } = await import(resolve(root, 'src/ai-tutor/curriculum/outcomes.js'));
const { SKILL_TAGS } = await import(resolve(root, 'src/ai-tutor/curriculum/skillTags.js'));
const { SKILLS } = await import(resolve(root, 'src/ai-tutor/knowledgeGraph.js'));
const { generateProblem } = await import(resolve(root, 'src/ai-tutor/problemGenerators.js'));
const { FAMILIES } = await import(resolve(root, 'src/ai-tutor/content/families/index.js'));
const { drawFamily, setFamilyMode, isOn } = await import(resolve(root, 'src/ai-tutor/content/families/core.js'));
const { SKILLS_G5 } = await import(resolve(root, 'src/ai-tutor/content/curriculumMap.g5.js'));

const JSON_ONLY = process.argv.includes('--json');
const DRAWS = 40;
const DATE = new Date().toISOString().slice(0, 10);

// Sub-strand codes our list spells differently from the design's.
const ALIAS = { 'MATH.G4.ALGEBR.USE_OF_LETTERS': 'MATH.G4.NUMBER.USE_OF_LETTERS', 'MATH.G5.ALGEBR.SIMPLE_EQUATIONS': 'MATH.G5.NUMBER.SIMPLE_EQUATIONS', 'MATH.G5.GEOMET.THREE_DIMENSION_OBJECTS': 'MATH.G5.GEOMET.3_D_OBJECTS', 'MATH.G9.DATA_H.DATA_INTERPRETATION': 'MATH.G9.DATA_H.DATA_INTERPRETATION_GROU' };
const official = (horebId) => { const o = OUTCOMES[horebId]; return o ? `${ALIAS[o.code] || o.code}.${o.letter}` : null; };
const LOOSE = (horebId) => /as the design's sub-strand$/.test(OUTCOMES[horebId]?.text || '');
const ATTITUDE = /^(appreciate|enjoy|value|promote|show (interest|appreciation)|develop (interest|a positive)|have fun|take pride|take interest|use (it|digital|ict) devices)/i;

// ---- the official outcomes ---------------------------------------------------
const grades = {};
for (let g = 1; g <= 9; g++) {
  const j = JSON.parse(readFileSync(resolve(root, `curriculum/mathematics/g${g}.json`), 'utf8'));
  const list = [];
  for (const s of j.sub_strands) for (const o of s.outcomes || []) list.push({ code: o.code, text: o.text, sub: s.sub_strand, strand: s.strand, f: 0, s: 0, m: 0, w: 0, lib: 0, ids: new Set() });
  grades[g] = { list, byCode: new Map(list.map(o => [o.code, o])), subs: j.sub_strands };
}
const subOf = (code) => code.replace(/\.[a-z0-9]+$/, '');
const looseSubs = { f: new Set(), s: new Set() };
const find = (code) => { const g = Number(code.match(/\.G(\d)\./)?.[1]); return grades[g]?.byCode.get(code); };

// ---- what each family and skill carries, by drawing it -----------------------
setFamilyMode('all');
const quiet = console.warn; console.warn = () => {};
const famFacts = (f) => {
  let mis = false;
  for (let i = 0; i < 20 && !mis; i++) { try { mis = (drawFamily(f).p.misconceptions || []).some(m => m.feedback); } catch { /* family_checks reports it */ } }
  return mis;
};
for (const f of FAMILIES) {
  const code = f.outcome.startsWith('MATH.') ? f.outcome : official(f.outcome);
  if (code && LOOSE(f.outcome)) { looseSubs.f.add(subOf(code)); continue; }
  const target = code && find(code);
  if (!target) continue;
  target.f++;
  target.w++;   // every family served carries a separate worked example (serveFamily in core.js)
  if (famFacts(f)) target.m++;
}
const skillFacts = {};
const skillInfo = (id) => skillFacts[id] ||= (() => {
  let mis = false, worked = false;
  for (let i = 0; i < DRAWS && !(mis && worked); i++) {
    let p; try { p = generateProblem(id, { noFamilies: true, level: ['abstract', 'pictorial', 'concrete'][i % 3], kp: i % 2 ? (i >> 1) % 6 : undefined }); } catch { continue; }
    if (!p) continue;
    if ((p.misconceptions || []).some(m => m.feedback)) mis = true;
    if (p.workedExample) worked = true;
  }
  return { mis, worked };
})();
for (const [id, tag] of Object.entries(SKILL_TAGS)) {
  if (!SKILLS[id] || !tag.outcomes || tag.grade > 9) continue;
  const info = skillInfo(id);
  for (const hid of tag.outcomes) {
    const code = official(hid);
    if (code && LOOSE(hid)) { looseSubs.s.add(subOf(code)); continue; }
    const target = code && find(code);
    if (!target) continue;
    target.s++; target.ids.add(id);
    if (info.mis) target.m++;
    if (info.worked) target.w++;
  }
}
console.warn = quiet; setFamilyMode('reviewed');
// Grade 5: the curriculum map's skills name their outcomes directly, and carry a misconception library.
for (const [cs, k] of Object.entries(SKILLS_G5)) for (const code of k.outcomes || []) {
  const t = find(code); if (!t) continue;
  if ((k.mis || []).length) t.lib++;
  for (const hid of k.horeb || []) if (SKILLS[hid]) { t.s += t.ids.has(hid) ? 0 : 1; t.ids.add(hid); const info = skillInfo(hid); if (info.mis) t.m++; if (info.worked) t.w++; }
}

// ---- tally -------------------------------------------------------------------
const attitude = (o) => ATTITUDE.test(o.text.trim());
const rows = [];
const detail = {};
for (let g = 1; g <= 9; g++) {
  const L = grades[g].list;
  const c = (fn) => L.filter(fn).length;
  const strict = g >= 4;
  const r = { grade: g, outcomes: L.length, family: c(o => o.f > 0), skill: c(o => o.s > 0), misfb: c(o => o.m > 0), worked: c(o => o.w > 0), lib: c(o => o.lib > 0),
    none: c(o => !o.f && !o.s && !o.m && !o.w), noFamily: c(o => !o.f), noSkill: c(o => !o.s), noMis: c(o => !o.m), noWorked: c(o => !o.w), attitude: c(attitude),
    looseFamily: c(o => looseSubs.f.has(subOf(o.code))), looseSkill: c(o => looseSubs.s.has(subOf(o.code))), strict };
  rows.push(r); detail[g] = L;
}
const tot = (k) => rows.reduce((s, r) => s + r[k], 0);
const live = FAMILIES.filter(f => f.core || f.reviewed).length;
if (JSON_ONLY) { console.log(JSON.stringify({ date: DATE, rows, families: FAMILIES.length, familiesLive: live }, null, 1)); process.exit(0); }

// ---- the report ----------------------------------------------------------------
const out = [];
const P = (s = '') => out.push(s);
P(`# Outcome coverage, Mathematics Grades 1 to 9 (${DATE})`);
P();
P('Generated by `npm run coverage:outcomes` (`scripts/coverage-outcomes.mjs`). Free and local: no model calls. Counts and outcome codes only.');
P();
P(`Official outcomes come from \`curriculum/mathematics/g<N>.json\`. A **family** is a hand-written question family (${FAMILIES.length} in the bank, ${live} switched on for children, the rest waiting for a teacher). A **generator skill** is a skill in the practice engine tagged to the outcome. **Misconception feedback** means a draw carries a message for a named wrong answer. **Worked example** means the skill draws one. Coverage is of what exists in the bank, signed off or not.`);
P();
P('Grades 1 to 3 are tagged to the sub-strand, not to an outcome, so they show no outcome-level cover here; the last column counts the outcomes whose sub-strand has any family or skill.');
P();
P('## Per grade');
P();
P('| Grade | Outcomes | With a family | With a generator skill | With misconception feedback | With a worked example | With none of the four | Attitude outcomes (no typed question can test) | Sub-strand level: family / skill |');
P('|---|---|---|---|---|---|---|---|---|');
for (const r of rows) P(`| ${r.grade} | ${r.outcomes} | ${r.family} | ${r.skill} | ${r.misfb} | ${r.worked} | ${r.none} | ${r.attitude} | ${r.looseFamily} / ${r.looseSkill} |`);
P(`| **All** | **${tot('outcomes')}** | **${tot('family')}** | **${tot('skill')}** | **${tot('misfb')}** | **${tot('worked')}** | **${tot('none')}** | **${tot('attitude')}** | **${tot('looseFamily')} / ${tot('looseSkill')}** |`);
P();
P('Without, per grade (the same figures turned round):');
P();
P('| Grade | No family | No generator skill | No misconception feedback | No worked example |');
P('|---|---|---|---|---|');
for (const r of rows) P(`| ${r.grade} | ${r.noFamily} | ${r.noSkill} | ${r.noMis} | ${r.noWorked} |`);
P();
P(`Grade 5 only: ${rows[4].lib} of ${rows[4].outcomes} outcomes also have an entry in the curriculum map's misconception library (draft, unreviewed). No other grade has a library.`);
P();
P('## Outcomes by grade');
P();
P('Columns: F family, S generator skill, M misconception feedback, W worked example, L library entry (Grade 5). `.` means none. Outcomes with none of F, S, M, W are listed first.');
for (let g = 1; g <= 9; g++) {
  const L = [...detail[g]].sort((a, b) => (!a.f && !a.s && !a.m && !a.w ? 0 : 1) - (!b.f && !b.s && !b.m && !b.w ? 0 : 1) || a.code.localeCompare(b.code));
  P();
  P(`### Grade ${g} (${L.length} outcomes)`);
  P();
  P('| Outcome | F | S | M | W | L | Outcome text |');
  P('|---|---|---|---|---|---|---|');
  for (const o of L) P(`| ${o.code.replace(`MATH.G${g}.`, '')} | ${o.f || '.'} | ${o.s || '.'} | ${o.m ? 'yes' : '.'} | ${o.w ? 'yes' : '.'} | ${o.lib ? 'yes' : '.'} | ${o.text.replace(/\|/g, '/').slice(0, 110)}${attitude(o) ? ' (attitude)' : ''} |`);
}
writeFileSync(resolve(root, `docs/qa/coverage-${DATE}.md`), out.join('\n') + '\n');
console.log(`written docs/qa/coverage-${DATE}.md`);
console.table(rows.map(({ grade, outcomes, family, skill, misfb, worked, none }) => ({ grade, outcomes, family, skill, misfb, worked, none })));
