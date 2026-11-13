// Writes docs/qa/kiswahili-g4-routes-2026-11-13.md: every Grade 4 Kiswahili outcome that no question family carries,
// with the way it is assessed instead (composition marking, a speaking or reading-aloud check, a practical task, teacher observation).
//   node scripts/build-kiswahili-g4-routes.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const g4 = JSON.parse(readFileSync(new URL('../curriculum/kiswahili/g4.json', import.meta.url), 'utf8'));
const entry = (await import('../src/ai-tutor/content/subjects/kiswahili_g4.js')).default;
const withFamily = new Set(entry.families.map(f => f.outcome));
const inSkill = new Map(g4.sub_strands.flatMap(s => (s.skills || []).flatMap(k => k.outcomes.map(o => [o, k.code.replace('KISW.G4.', '')]))));
const P = 'KISW.G4.';

const ROUTE = {
  W: 'Composition marking: HOREB insha marker out of 20 (waits for its native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece. The kinds and parts of the text are tested by the questions of the skill AINA_ZA_INSHA or BARUA.',
  Wshort: 'A short piece of composing (tongue-twisters): a teacher with the KICD rubric, spoken or written. No question can test it.',
  Oear: 'Listening check: a teacher says the sounds and the learner points or repeats (a voice tool later). On paper the syllables cannot be heard.',
  Ospeak: 'Speaking check: teacher observation in the lesson (PLAN_OBSERVATION_RUBRICS.md) or an oral task, with the KICD rubric; a voice tool later.',
  Oread: 'Reading aloud: the teacher listens to the learner read and scores pronunciation, voice, speed or signs with the KICD rubric; a voice tool later. What a fluent reader does is tested by the questions of the skill UFASAHA_VIPENGELE.',
  Plibrary: 'Choosing and reading texts: teacher observation, a reading log or a portfolio entry. Understanding a story or an article is tested by the reading skills.',
  Pdigital: 'Using a digital device and a safe site: a practical task with a teacher watching. The safe steps are tested by the questions of the skill USALAMA_DIJITALI.',
  Pcomputer: 'Using a computer (open, type, save): a practical task with a teacher watching. The parts of a computer are tested by the questions of the skill SEHEMU_TARAKILISHI.',
  A: 'Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model.',
  Qnone: 'A question can test it, but no family is tagged to this letter: the skill below carries it (the meaning is asked through its other families). A teacher may add a direct family.',
};
const A_RE = /^(kuchangamkia|kufurahia|kuthamini|kuonea fahari|kujenga mazoea)/;
const kindOf = (key, text) => {
  const [strand, sub, letter] = [key.split('.')[0], key.split('.')[1], key.split('.')[2]];
  if (A_RE.test(text)) return ['A', 'A'];
  if (/^kuandika (insha|barua)/.test(text)) return ['W', 'W'];
  if (/^kuunda vitanzandimi/.test(text)) return ['W', 'Wshort'];
  if (strand === 'KUANDI' && sub.startsWith('T3_') && ['b', 'c', 'e'].includes(letter)) return ['P', 'Pcomputer'];
  if (strand === 'KUANDI' && /^kujadili/.test(text)) return ['O', 'Ospeak'];
  if (strand === 'KUSOMA' && (sub.startsWith('T4_') || sub.startsWith('T10_')) && /(kufungua|kusakura|kutumia vifaa)/.test(text)) return ['P', 'Pdigital'];
  if (strand === 'KUSOMA' && sub.startsWith('T10_') && letter === 'd') return ['P', 'Pdigital'];
  if (strand === 'KUSOMA' && (sub.startsWith('T7_') || sub.startsWith('T9_'))) return ['P', 'Plibrary'];
  if (strand === 'KUSOMA' && /^kusoma (kifungu|shairi|mchezo)/.test(text)) return ['O', 'Oread'];
  if (strand === 'KUSIKI' && sub.startsWith('T1_') && letter === 'a') return ['O', 'Oear'];
  if (strand === 'KUSIKI') return ['O', 'Ospeak'];
  return ['Q', 'Qnone'];
};
const rows = []; const n = { Q: 0, W: 0, O: 0, P: 0, A: 0 }, carried = { Q: 0 };
const route = {};
for (const s of g4.sub_strands) for (const o of s.outcomes) {
  const key = o.code.slice(P.length);
  if (withFamily.has(o.code)) { n.Q++; carried.Q++; continue; }
  const [k, r] = kindOf(key, o.text);
  n[k]++; route[r] = (route[r] || 0) + 1;
  rows.push(`| ${key} | ${k} | ${o.text} | ${ROUTE[r]}${k === 'Q' ? ` Skill: ${inSkill.get(o.code) || 'none yet'}.` : ''} |`);
}
const total = Object.values(n).reduce((a, b) => a + b, 0);
const md = `# Kiswahili Grade 4: outcomes no question family carries, and how each is assessed (13 Nov 2026)

Built from \`curriculum/kiswahili/g4.json\` and the registry entry. Outcome text is KICD's. Every outcome below needs something other than a tapped or typed question, except the few marked **Q**, which a question can test and which have a skill but no family tagged to that letter.

- Official outcomes: ${total}. Carried by at least one question family: ${carried.Q}. Not carried: ${rows.length}.
- Not carried, by what they need: Q ${n.Q - carried.Q}, W (writing) ${n.W}, O (speaking, listening, reading aloud) ${n.O}, P (practical or library) ${n.P}, A (attitude) ${n.A}.
- Routes: ${Object.entries(route).map(([r, c]) => `${r} ${c}`).join(', ')}.
- A family tags one outcome letter, but a recognition family often serves the whole skill. The skills list outcomes in other sub-strands that repeat (the design repeats insha, barua and fluency in several themes): those are in the skill, and the families of the skill test them.
- Insha and barua are composition: the HOREB insha marker (out of 20) exists for Grade 4 up and waits for its native-speaker review; it is not in Tuta.
- The KICD rubrics in \`curriculum/kiswahili/g4.json\` (four strand rubrics) are untouched.

| Outcome | Kind | Outcome text | Route |
|---|---|---|---|
${rows.join('\n')}
`;
writeFileSync(new URL('../docs/qa/kiswahili-g4-routes-2026-11-13.md', import.meta.url), md);
console.log(`routes doc: ${total} outcomes, ${carried.Q} with a family, ${rows.length} without: Q ${n.Q - carried.Q} W ${n.W} O ${n.O} P ${n.P} A ${n.A}`);
console.log(JSON.stringify(route));
