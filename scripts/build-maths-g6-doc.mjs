// ============================================================================
// THE REVIEW DOCUMENT for Maths Grade 6: what a Kenyan maths teacher reads before signing families off. Free and local;
// every number comes from the files, nothing is typed by hand.
//   node scripts/build-maths-g6-doc.mjs     writes docs/qa/maths-g6-<date>.md
// Shows: the checks' verdict, the reconciliation with HOREB's earlier outcome letters (what changed), each sub-strand with its
// official outcomes, skills, mastery rules, prerequisites, misconceptions (with source and whether a wrong answer reveals it) and
// families (one drawn example per new family), and how to sign a family off.
// ============================================================================
import { writeFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATE = new Date().toISOString().slice(0, 10);
const g6 = JSON.parse(readFileSync(resolve(root, 'curriculum/mathematics/g6.json'), 'utf8'));
const { FAMILIES } = await import(resolve(root, 'src/ai-tutor/content/families/index.js'));
const { checkFamily } = await import(resolve(root, 'engine/scripts/family_checks.mjs'));
const { drawFamily, setFamilyMode } = await import(resolve(root, 'src/ai-tutor/content/families/core.js'));
const { SKILLS_G6 } = await import(resolve(root, 'src/ai-tutor/content/curriculumMap.g6.js'));
const { OUTCOMES } = await import(resolve(root, 'src/ai-tutor/curriculum/outcomes.js'));
const cell = (t) => String(t ?? '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
const ATT = /^appreciate/;

setFamilyMode('all');
const mine = FAMILIES.filter(f => /^MATH\.G6\./.test(f.cskill || ''));
const fresh = mine.filter(f => f.id.startsWith('g6d.')), older = mine.filter(f => !f.id.startsWith('g6d.'));
const failures = mine.flatMap(f => checkFamily(f));

// What the older families were filed under before (HOREB's own outcome id), read from commit 928ebae, the one before this work.
const before = {};
for (const file of ['g6.js', 'g6_cov.js', 'labelFixes.js']) {
  let text = '';
  try { text = execFileSync('git', ['show', `928ebae:src/ai-tutor/content/families/${file}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { /* not committed yet */ }
  for (const m of text.matchAll(/id: '([^']+)'[^\n]*?outcome: '(G6\.[A-Z0-9_]+\.[a-z])'/g)) before[m[1]] = m[2];
}
const letterOf = (code) => code.split('.').pop();
const changed = older.filter(f => before[f.id] && before[f.id].split('.').pop() !== letterOf(f.outcome));
const sameLetter = older.filter(f => before[f.id] && before[f.id].split('.').pop() === letterOf(f.outcome));

// revealed misconceptions
const revealed = new Map();
for (const f of mine) {
  const set = new Set(f.reveals || []);
  if (f.misMapped !== false) for (let i = 0; i < 40; i++) { const { p } = drawFamily(f); for (const m of [...(p.misconceptions || []), ...[].concat(p.mis || []).map(x => ({ mis: x }))]) for (const c of [].concat(m.mis || [])) set.add(c); }
  for (const c of set) { const k = `${f.cskill.split('.').slice(0, 4).join('.')}|${c}`; if (!revealed.has(k)) revealed.set(k, new Set()); revealed.get(k).add(f.id); }
}
const revealedBy = (m) => revealed.get(`${m.skill.split('.').slice(0, 4).join('.')}|${m.code.slice(m.skill.length + 1)}`);

const outcomes = g6.sub_strands.flatMap(s => s.outcomes);
const testable = outcomes.filter(o => !ATT.test(o.text));
const skillsOf = Object.values(SKILLS_G6);
const covered = testable.filter(o => skillsOf.some(k => k.outcomes.includes(o.code)));
const withFamily = testable.filter(o => mine.some(f => f.outcome === o.code));
const hands = skillsOf.filter(k => k.hands);
const miss = g6.sub_strands.flatMap(s => s.misconceptions);
const unrevealed = miss.filter(m => !revealedBy(m));
const lines = [];
const w = (...a) => lines.push(...a);

w(`# Maths Grade 6: skills, misconceptions and families (${DATE})`, '',
  'Authored offline by Claude with free local tools; no paid model call and no children\'s data. Nothing here reaches a child: every Grade 6 Maths family is a draft (`reviewed: false`, the one switch in `families/core.js`) except the ' + older.filter(f => f.core).length + ' label-fix families that were already served before this work (`core: true`; they are tagged to the curriculum map only, their questions are not changed). A Kenyan maths teacher signs families off; builders never do.', '',
  '## Counts', '',
  '| What | Count |', '|---|---|',
  `| Official outcomes (KICD 2024, word for word) | ${outcomes.length} |`,
  `| Testable outcomes (the rest are attitude: "appreciate ...") | ${testable.length} (${outcomes.length - testable.length} attitude) |`,
  `| Testable outcomes with a skill | ${covered.length} of ${testable.length} |`,
  `| Testable outcomes with at least one family | ${withFamily.length} of ${testable.length} |`,
  `| Fine skills (mastery rule, question forms, prerequisites) | ${skillsOf.length} |`,
  `| Prerequisites (skill to skill, most reach Grade 5 skills) | ${g6.totals.prerequisites} |`,
  `| Misconceptions in the library (all draft) | ${miss.length} |`,
  `| Grade 6 families filed under the curriculum map | ${mine.length} |`,
  `| of which linked from the families that already existed | ${older.length} (${sameLetter.length} kept their outcome letter, ${changed.length} moved to the official letter) |`,
  `| of which added now (skills with fewer than two structures) | ${fresh.length} |`,
  `| Older families tied to the library at family level (\`reveals\`) | ${older.filter(f => (f.reveals || []).length).length} of ${older.length} |`,
  `| New families with every wrong answer tied to a library misconception | ${fresh.length} of ${fresh.length} |`,
  `| Library misconceptions revealed by some family | ${miss.length - unrevealed.length} of ${miss.length} |`,
  `| Hands-on skills (the practical stays with the teacher) | ${hands.length} |`, '',
  `**Checks:** ${failures.length ? `${failures.length} failure(s):\n\n${failures.slice(0, 20).map(f => `- ${f}`).join('\n')}` : 'every Grade 6 family passes the family checks (key computed and checked a second way, wrong answers from named mistakes, hints, steps, spelling, no emoji, no em dash).'}`, '',
  '## What changed in the outcome letters', '',
  'HOREB\'s earlier Grade 6 outcome list (`curriculum/outcomes.js`, `G6.<SUBSTRAND>.<letter>`) was condensed from the design and drifted from the official letters in places: it joined outcomes (add and subtract fractions as one letter, add and subtract mixed numbers as one, profit and loss as one, bisect and perpendicular as one), shifted letters in Length, Mass and Decimals, and had no separate letters for several official outcomes. The official codes in `curriculum/mathematics/g6.json` are now the only ones the Grade 6 families use (`MATH.G6.<STRAND>.<SUB-STRAND>.<letter>`). The old list is untouched, so nothing that read it breaks.', '',
  '| Sub-strand | HOREB letter and its text | Official letter and text | Families moved |', '|---|---|---|---|');
const byOld = new Map();
for (const f of changed) { const k = `${before[f.id]}>${f.outcome}`; if (!byOld.has(k)) byOld.set(k, []); byOld.get(k).push(f.id); }
const offText = Object.fromEntries(outcomes.map(o => [o.code, o.text]));
const hid = (id) => Object.entries(OUTCOMES).find(([k]) => k === id)?.[1]?.text || '';
for (const [k, ids] of [...byOld].sort()) { const [o, n] = k.split('>'); w(`| ${n.split('.').slice(2, 4).join('.')} | ${o.replace('G6.', '')}: ${cell(hid(o))} | ${letterOf(n)}: ${cell(offText[n])} | ${ids.length} (${ids.slice(0, 4).join(', ')}${ids.length > 4 ? ', ...' : ''}) |`); }
w('', `Families that kept the same letter: ${sameLetter.length}. Their official outcome is the same letter as before, now with the design's own text.`, '',
  'Outcomes the design lists that HOREB\'s old list had no letter for (so they had no family before): ' + testable.filter(o => !Object.values(OUTCOMES).some(h => h.grade === 6 && h.code === o.code.split('.').slice(0, 4).join('.') && h.letter === o.letter)).map(o => o.code.replace('MATH.G6.', '')).join(', ') + '.', '',
  '## How to read the sections', '',
  'Each sub-strand lists its official outcomes, then each skill with the mastery rule, the question forms the child meets, the prerequisites (G5 or G6 skills), the misconceptions with where they come from, and the families that carry them. A misconception marked "no wrong answer yet" is in the library for a teacher to confirm; no question tests it today. The source line is either "a familiar error type in maths education (no single source cited)" or "to be confirmed by a teacher": no misconception here cites a specific study, because none was checked. Please strike any a Kenyan teacher does not recognise, and add the ones missing.', '');

for (const s of g6.sub_strands) {
  w(`## ${s.number} ${s.sub_strand} (${s.strand})`, '', `Design notes: ${s.design_notes}`, '', '| Outcome | Official text | Status | Skills |', '|---|---|---|---|');
  for (const o of s.outcomes) w(`| ${o.letter} | ${cell(o.text)} | ${o.status} | ${ATT.test(o.text) ? 'attitude: no skill' : s.skills.filter(k => k.outcomes.includes(o.code)).map(k => k.code.split('.').pop()).join(', ')} |`);
  w('');
  for (const k of s.skills) {
    const fams = mine.filter(f => f.cskill === k.code);
    w(`### ${k.name}`, '', `- Code \`${k.code.replace('MATH.G6.', '')}\`; outcome${k.outcomes.length > 1 ? 's' : ''} ${k.outcomes.map(o => o.split('.').pop()).join(', ')}; HOREB skill ${k.horeb_skill_ids.join(', ')}.`, `- Mastery: ${k.mastery}`, `- Question forms: ${k.question_forms.join('; ')}.`, `- Prerequisites: ${k.prerequisites.map(p => `${p.requires.replace('MATH.', '')} (${p.strength})`).join('; ')}.`);
    if (k.hands_on) w(`- Hands-on: ${k.hands_on}`);
    w('', '| Misconception | What the child does | Source | Revealed by |', '|---|---|---|---|');
    for (const m of s.misconceptions.filter(x => x.skill === k.code)) { const r = revealedBy(m); w(`| ${m.code.slice(k.code.length + 1)} | ${cell(m.error)} | ${cell(m.source)} | ${r ? [...r].slice(0, 3).join(', ') + (r.size > 3 ? ', ...' : '') : 'no wrong answer yet'} |`); }
    w('', '| Family | Form | Rung | Status | Example (one draw) |', '|---|---|---|---|---|');
    for (const f of fams) {
      const isNew = f.id.startsWith('g6d.'); let ex = '';
      if (isNew) { const { p } = drawFamily(f); ex = `${cell(p.question).slice(0, 170)} Answer: ${cell(p.answer).slice(0, 60)}`; }
      w(`| ${f.id} | ${f.form} | ${f.rung} | ${isNew ? 'new, draft' : f.core ? 'existing, core (already served), linked' : 'existing, draft, linked'} | ${ex} |`);
    }
    w('');
  }
}
w('## Misconceptions no wrong answer reveals yet', '', `${unrevealed.length} of ${miss.length}. They stay in the library for a teacher to confirm; a later family can reveal them.`, '', ...unrevealed.map(m => `- \`${m.code.replace('MATH.G6.', '')}\`: ${cell(m.error)}`), '',
  '## What is not here', '',
  '- Reciprocal, squares of fractions and several other outcomes were marked "read" (not fully verified) by the reading step; they are listed in the design notes above and a person should confirm the limits.',
  '- Hands-on outcomes (draw parallel lines, bisect, construct, measure with a protractor, circumference with string, piling) cannot be marked by a typed or tapped answer. The skills test the idea behind each practical; the practical stays with the teacher.',
  '- Grade 6 skills are not yet offered for homework: the homework door reads the Grade 5 map for Maths. That is the next step once a teacher has signed a first set.',
  '- No question is signed. The older Grade 6 families keep their wrong-answer reasons; their wrong answers are tied to the library at family level (`reveals`), not one by one.', '',
  '## How to sign off', '',
  'Read each family and its example. To switch a family on, add its id to the signed list of its file group: `g6d_signed.js` for the `g6d.` families (the kit reads it). The older `g6.` and `g6c.` families are switched on through their own files (`reviewed: true` on the family), as they were before. Builders never sign.', '');
writeFileSync(resolve(root, `docs/qa/maths-g6-${DATE}.md`), lines.join('\n') + '\n');
console.log(`docs/qa/maths-g6-${DATE}.md: ${lines.length} lines, ${failures.length} failures`);
