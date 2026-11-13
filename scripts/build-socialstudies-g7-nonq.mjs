// Writes docs/qa/socialstudies-g7-non-question-outcomes-2026-11-13.md: the outcomes a question cannot fully test, with what each needs.
//   node scripts/build-socialstudies-g7-nonq.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const g7 = JSON.parse(readFileSync(new URL('../curriculum/social_studies/g7.json', import.meta.url), 'utf8'));
const entry = (await import('../src/ai-tutor/content/subjects/socialstudies_g7.js')).default;
const withFamily = new Set(entry.families.map(f => f.outcome));
const P = 'SOCI.G7.';
// P = a practical or product the learner makes, scored with the KICD rubric indicator the outcome carries.
const P_TASK = {
  'NATURA.WEATHER.b': 'Make a rain gauge (a cut plastic bottle with a ruler marked on it) and a wind vane (a straw, a pin and a card arrow on a stick), set them up in the school compound and read them for a week, writing the readings in a table.',
  'PEOPLE.SLAVERY_AND_SERVITUDE.c': 'Sketch a map of Africa and the Indian Ocean, shade the East African coast and the routes inland, and label Zanzibar, Kilwa, Mombasa, Arabia and India. The teacher scores it against the facts the families test.',
  'COMMUN.COMMUNITY_SERVICE_LEARNI.d': 'Carry out one class CSL project (for example clearing litter, planting trees or repairing the compound), keeping to the steps need, plan, act, report and reflect, with a teacher present.',
  'NATURA.EARTH_AND_THE_SOLAR_SYST.d': 'Draw and label a cross-section of the earth (crust, mantle, outer core, inner core) with a thickness and a state (solid or liquid) beside each layer.',
  'POLITI.HUMAN_RIGHTS.d': 'Take one class action for equity and non-discrimination (a poster, a short drama or a classroom rule written together) and report what changed.',
};
const A_RE = /^(appreciate|value|desire|acknowledge|advocate|create awareness|respond appropriately|uphold|take action)\b/i;
const kindOf = (key, text) => (P_TASK[key] ? 'P' : A_RE.test(text) ? 'A' : 'Q');
const rows = []; const n = { Q: 0, A: 0, P: 0 };
for (const s of g7.sub_strands) for (const o of s.outcomes) {
  const key = o.code.slice(P.length); const k = kindOf(key, o.text); n[k]++;
  const hasFam = withFamily.has(o.code);
  const ind = o.indicator ? o.indicator.replace('SOCI.G7.', '') : 'the strand rubric';
  const need = k === 'Q' ? 'Question families.'
    : k === 'A' ? `Teacher observation over the term or a portfolio entry; the KICD indicator for this outcome (${ind}). A tapped answer cannot show a feeling or a habit.`
      : `${P_TASK[key]} Rubric: KICD indicator ${ind}.`;
  rows.push(`| ${key} | ${k} | ${k === 'Q' ? (hasFam ? 'yes' : 'NO') : (hasFam ? 'yes (knowledge half)' : 'no')} | ${o.text} | ${need} |`);
}
const total = n.Q + n.A + n.P, qNo = rows.filter(r => / \| Q \| NO \|/.test(r)).length, withFam = rows.filter(r => / \| (yes|yes \(knowledge half\)) \|/.test(r)).length;
const md = `# Social Studies Grade 7: outcomes a question cannot fully test (13 Nov 2026)

Built from \`curriculum/social_studies/g7.json\` and the registry entry. Outcome text is KICD's. **Q** means a question can test it, **A** an attitude (teacher observation or a portfolio entry), **P** a practical or product (drawn, built or done, scored by the KICD rubrics in the design and planned in PLAN_OBSERVATION_RUBRICS.md). The kind is read from the outcome's verb.

- Outcomes: ${total}. By what tests them best: Q ${n.Q}, A ${n.A}, P ${n.P}.
- Outcomes with at least one question family: ${withFam}. With no family: ${total - withFam}. Q outcomes with no family: ${qNo}.
- A P outcome that has a family: the family tests the knowledge half and the practical half still needs the task below.
- History, origin stories and the accounts of peoples (human origin, the ancient kingdoms, the Indian Ocean slave trade, the scramble and the diasporas) are told as commonly taught and are marked in the library "to confirm by a teacher". The personal-development outcomes (self-exploration, enterprise, community service learning) use the learner's own school and locality.
- Maps are described in words or a small table; the time questions are generated from the rule (15 degrees make one hour, east is ahead).
- The KICD rubrics in the curriculum JSON are untouched.

| Outcome | Kind | Has a family | Outcome text | What it needs |
|---|---|---|---|---|
${rows.join('\n')}
`;
writeFileSync(new URL('../docs/qa/socialstudies-g7-non-question-outcomes-2026-11-13.md', import.meta.url), md);
console.log(`non-question doc: ${total} outcomes, Q ${n.Q} A ${n.A} P ${n.P}, with a family ${withFam}, Q without ${qNo}`);
console.log(rows.filter(r => / \| Q \| NO \|/.test(r)).map(r => r.split('|').slice(1, 5).join('|')).join('\n'));
