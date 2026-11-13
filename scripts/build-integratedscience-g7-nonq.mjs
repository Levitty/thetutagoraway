// Writes docs/qa/integratedscience-g7-non-question-outcomes-2026-11-13.md: the outcomes a question cannot fully test, with what each needs.
//   node scripts/build-integratedscience-g7-nonq.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const g7 = JSON.parse(readFileSync(new URL('../curriculum/integrated_science/g7.json', import.meta.url), 'utf8'));
const entry = (await import('../src/ai-tutor/content/subjects/integratedscience_g7.js')).default;
const withFamily = new Set(entry.families.map(f => f.outcome));
const P = 'INTE.G7.';
// P = the learner does or makes something a teacher must see. [rubric indicator, task and safety, what is kept as evidence]
const P_TASK = {
  'SCIENT.LABORATORY_APPARATUS_AND.b': ['1.3', 'Set tasks at stations: read the volume of water in a measuring cylinder at eye level, read a thermometer in cool and warm water, find the mass of an object on a balance, and say how the glassware is washed and put away. A Bunsen burner is lit only by the teacher or with the teacher beside the learner; hot water and glass are handled with a teacher. The teacher watches the handling and listens to the reasons.', 'Teacher checklist per learner; photo of the station set-up, not of the child.'],
  'MIXTUR.MIXTURES.a': ['2.1', 'Separate salt from salt water by evaporation (a saucer in the sun, or heated by the teacher), and the dyes of a felt-tip ink by chromatography on filter paper. Simple distillation of salty water and any sublimation (iodine or ammonium chloride are toxic) are shown by the teacher only, with the class watching from a safe distance; learners say which method fits and why. Nothing is tasted.', 'Teacher checklist; the learner\'s labelled chromatogram or a photo of the dried saucer.'],
  'MIXTUR.ACIDS_BASES_AND_INDICATO.b': ['2.2', 'Prepare an indicator from red cabbage, beetroot or hibiscus: crush, soak in warm (not boiling) water poured by an adult, strain, then test lemon juice, vinegar, soap solution and wood ash solution and record the colours. No strong acids or bases, nothing tasted, hands washed, waste poured away as the teacher directs.', 'Table of colours the learner records; photo of the test tubes or cups, not of the child.'],
  'LIVING.HUMAN_REPRODUCTIVE_SYSTE.d': ['3.2', 'A short written plan (physical, social and emotional challenges, and what the learner would do about each, and who they would ask) marked by the teacher against the strand rubric. The plan is about adolescence in general: no learner is asked to write or share personal details, and the teacher or counsellor reads it privately. The habits behind it are tested by the questions.', 'The written plan, kept private.'],
  'LIVING.HUMAN_EXCRETORY_SYSTEM.d': ['3.4', 'A daily log kept for one week of habits that keep the skin and kidneys healthy (water drunk, washing, clean clothes, little salt, reporting pain when passing urine to an adult), checked by the teacher once a week and marked against the rubric. The habits behind it are tested by the questions.', 'The log sheet.'],
  'FORCE_.ELECTRICAL_ENERGY.b': ['4.2', 'Connect a simple circuit (cell or cells, wires, switch, bulb in a holder), then two bulbs in series and in parallel, and record which bulbs stay lit when one is unscrewed. Low voltage from dry cells only, never the mains and never a socket; wires are not joined to anything but the cells and bulbs. The teacher watches the connecting and listens to the explanation.', 'Teacher checklist; a drawing of each circuit by the learner.'],
  'FORCE_.MAGNETISM.a': ['4.4', 'Demonstrate with bar magnets: the pull on pins and nails, where it is strongest, like poles pushing apart and unlike poles pulling together, and a magnet hanging on a thread settling north and south. Test a set of everyday objects and sort them. Keep magnets away from phones, bank or ID cards and computers.', 'Sorting table and teacher checklist; photo of the sorted objects.'],
};
const IND_NAME = { '1.3': 'use and care for apparatus and instruments', '2.1': 'separate homogeneous mixtures', '2.2': 'identify acids and bases', '3.2': 'develop a plan to manage developmental challenges', '3.4': 'develop and maintain a daily log', '4.2': 'identify electrical appliances (nearest rubric indicator for the circuit work)', '4.4': 'identify the uses of magnets (nearest rubric indicator for the demonstration)' };
const kindOf = (code, text) => {
  const key = code.slice(P.length);
  if (P_TASK[key]) return 'P';
  if (/^(appreciate|show interest|acknowledge|embrace|value)\b/i.test(text)) return 'A';
  return 'Q';
};
const rows = []; const n = { Q: 0, A: 0, P: 0 };
for (const s of g7.sub_strands) for (const o of s.outcomes) {
  const key = o.code.slice(P.length); const k = kindOf(o.code, o.text); n[k]++;
  const hasFam = withFamily.has(o.code);
  let need;
  if (k === 'Q') need = 'Question families.';
  else if (k === 'A') need = 'Teacher observation over the term or a portfolio entry (see PLAN_OBSERVATION_RUBRICS.md); a tapped answer cannot show a feeling or a habit. No photo needed. Rubric: the strand indicators.';
  else { const [ind, task, ev] = P_TASK[key]; need = `${task} Rubric: KICD indicator ${ind} (${IND_NAME[ind]}). Evidence: ${ev}`; }
  rows.push(`| ${key} | ${k} | ${k === 'Q' ? (hasFam ? 'yes' : 'NO') : (hasFam ? 'yes (knowledge half)' : 'no')} | ${o.text} | ${need} |`);
}
const total = n.Q + n.A + n.P;
const qNo = rows.filter(r => / \| Q \| NO \|/.test(r)).length;
const withFam = rows.filter(r => / \| (yes|yes \(knowledge half\)) \|/.test(r)).length;
const md = `# Integrated Science Grade 7: outcomes a question cannot fully test (13 Nov 2026)

Built from \`curriculum/integrated_science/g7.json\` and the registry entry. Outcome text is KICD's. **Q** means a question can test it, **A** an attitude (teacher observation or portfolio), **P** a practical or product: the learner does, connects, prepares, plans or logs something, which only a teacher can see. The kind is read from the outcome's verb. Per PLAN_OBSERVATION_RUBRICS.md a P outcome is a **task** marked by the teacher against the KICD rubric indicator (EE, ME, AE, BE), with an optional photo of the work, not the child.

- Outcomes: ${total}. By what tests them best: Q ${n.Q}, A ${n.A}, P ${n.P}. (SUBJECTS_STRUCTURE.md counts Q 25, P 4, A 9 for this grade; the five practical outcomes of apparatus, separation, indicators, circuits and magnets and the two plan and log products are all counted P here because the verb is do, make or develop.)
- Outcomes with at least one question family: ${withFam}. With no family: ${total - withFam} (all attitude). Q outcomes with no family: ${qNo}.
- A P outcome that has a family: the family tests the knowledge half (which apparatus, why the method fits, what the colour shows, what a circuit needs, which materials are magnetic, which habits protect the skin and kidneys) and the practical half still needs the task below.
- Safety: any task with heat, hot water, steam, glass, chemicals (even household ones), a Bunsen burner, or batteries is done with a teacher. Twelve-year-olds do not light burners, handle boiling water or touch the mains. Nothing is tasted. Strong acids and bases are never used in class by learners.
- Sensitive topic: the reproductive system and adolescence (outcomes a to e of that sub-strand) follow the school's own arrangements for teaching it; the plan is private to the learner and the teacher or counsellor.
- The KICD rubrics in the curriculum JSON are untouched: 4 strand tables, 15 indicators (INTE.G7.RUBRIC.1 to 4).

| Outcome | Kind | Has a family | Outcome text | What it needs |
|---|---|---|---|---|
${rows.join('\n')}
`;
writeFileSync(new URL('../docs/qa/integratedscience-g7-non-question-outcomes-2026-11-13.md', import.meta.url), md);
console.log(`non-question doc: ${total} outcomes, Q ${n.Q} A ${n.A} P ${n.P}, with a family ${withFam}, Q without ${qNo}`);
