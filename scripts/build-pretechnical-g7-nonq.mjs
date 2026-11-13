// Writes docs/qa/pretechnical-g7-non-question-outcomes-2026-11-13.md: the outcomes a question cannot fully test, with what each needs.
//   node scripts/build-pretechnical-g7-nonq.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const g7 = JSON.parse(readFileSync(new URL('../curriculum/pre_technical/g7.json', import.meta.url), 'utf8'));
const entry = (await import('../src/ai-tutor/content/subjects/pretechnical_g7.js')).default;
const withFamily = new Set(entry.families.map(f => f.outcome));
const P = 'PRE_.G7.';
// P = the learner does or makes something a teacher must see. [rubric indicator, task and safety, what is kept as evidence]
const P_TASK = {
  'FOUNDA.SAFETY_IN_THE_IMMEDIATE_.c': ['1.1', 'Observe safe habits over the term: tidy bench, protective clothing on, tools returned, hair tied back, a role play of a slip, a small fire (sand bucket, no flame lit by learners) and an unknown friend request. Anything with heat, power or a sharp tool is done with a teacher. The teacher ticks a checklist each lesson and listens to the reasons given.', 'Teacher checklist per learner; a photo of the tidy bench, not of the child.'],
  'FOUNDA.COMPUTER_CONCEPTS.c': ['1.2', 'Set a task on a school computer: switch on, open a word-processing or drawing program, type a short title, save the file with a name, close and switch off. The teacher watches the steps. No personal account or password of the learner is used.', 'Teacher checklist; the saved file name (a screenshot of the screen, not of the child).'],
  'COMMUN.INTRODUCTION_TO_DRAWING.c': ['2.1', 'Print the capital letters and the numbers 0 to 9 on a ruled sheet with light guidelines: upright, the same height, even spacing, one stroke weight. Marked against the rubric by the teacher.', 'The learner\'s lettering sheet.'],
  'COMMUN.INTRODUCTION_TO_DRAWING.d': ['2.1', 'Draw a sheet of the four line types with a pencil and ruler: thick continuous, thin continuous, dashed and chain. The knowledge of what each line is for is tested by the questions; the drawing of the lines is marked on the sheet.', 'The learner\'s drawing sheet.'],
  'COMMUN.INTRODUCTION_TO_DRAWING.e': ['2.1', 'Sketch the symbols and abbreviations on a sheet and use three of them on a simple drawing of a pipe or a washer. The meanings are tested by the questions; the sketching is marked on the sheet.', 'The learner\'s drawing sheet.'],
  'COMMUN.FREE_HAND_SKETCHING.c': ['2.1', 'Sketch straight lines (horizontal, vertical, slanted) and curves free-hand with a pencil, no ruler, light lines first. Marked on the sheet by the teacher against the rubric.', 'The learner\'s sketch sheet.'],
  'COMMUN.FREE_HAND_SKETCHING.d': ['2.1', 'Sketch a square, a rectangle, a triangle and a circle free-hand (box and hand compass methods), then one everyday object made from them (a cup, a gate, a stool). Marked against rubric indicator 2.1 (sketch 2D shapes free-hand).', 'The learner\'s sketch sheet.'],
  'COMMUN.ICT_TOOLS_IN_COMMUNICATI.c': ['2.1', 'Send and receive a short message with a school device or a class tool (an email or a chat on a teacher\'s account), or join a class call. No learner account, phone number or personal contact is entered. The teacher watches and marks the steps and the polite wording.', 'Teacher checklist; the message text without names.'],
  'TOOLS_.MEASURING_AND_MARKING_OU.c': ['4.1', 'Measure and mark out a piece of card or soft timber to a given plan: length with a steel rule or tape, a right angle with a try-square, a line with a pencil or marking gauge, a circle with a divider. A scriber, dot punch or marking knife is used only under the teacher\'s eye and never on a learner\'s own. The teacher watches the handling and checks the work.', 'Teacher checklist; photo of the marked-out piece, not of the child.'],
  'TOOLS_.COMPUTER_HARDWARE.b': ['4.1', 'At stations: type a short line with the keyboard, move and click with the mouse, print one page, and save a file to a storage device. The teacher watches the handling and the order of the steps.', 'Teacher checklist; the printed page.'],
};
const IND_NAME = { '1.1': 'explain the role of Pre-Technical Studies and observe safety', '1.2': 'use a computer to perform tasks', '2.1': 'explain drawing, sketch 2D shapes free-hand, use ICT tools to communicate', '4.1': 'use measuring and marking out tools; use hardware devices' };
// Outcomes that a question tests, but where the learner also produces something a teacher marks.
const HALF = { 'ENTREP.FINANCIAL_GOALS.c': 'The questions test recognising a SMART goal and the sums. The learner also writes one SMART goal of their own (an amount, a way, a date): a written product marked against rubric indicator 5.1 and kept private. Teacher or counsellor reads it; no family finances are asked about.', 'TOOLS_.MEASURING_AND_MARKING_OU.d': 'The questions test how to care for tools. Care is also observed at the end of every lesson: wiped, oiled, points covered, returned. Teacher checklist.', 'MATERI.INTRODUCTION_TO_MATERIAL.b': 'The questions test sorting. The class also sorts real local materials (a nail, a stone, a bottle, a piece of wood) and says why; observed by the teacher.', 'MATERI.METALLIC_MATERIALS.b': 'The questions test the properties. Learners also test a magnet, a cold spoon in warm water and a low-voltage cell-and-bulb circuit (never mains); hot metal and heat only with a teacher.', 'MATERI.NON_METALLIC_MATERIALS.c': 'The questions test the properties. Learners also examine small samples (colour, texture, hardness); any flame or heat test is shown by the teacher at a safe distance, never by learners.' };
const kindOf = (key, text) => {
  if (P_TASK[key]) return 'P';
  if (/^(appreciate|show interest|acknowledge|embrace|value|recognise)\b/i.test(text) || /financial discipline/i.test(text)) return 'A';
  return 'Q';
};
const rows = []; const n = { Q: 0, A: 0, P: 0 };
for (const s of g7.sub_strands) for (const o of s.outcomes) {
  const key = o.code.slice(P.length); const k = kindOf(key, o.text); n[k]++;
  const hasFam = withFamily.has(o.code);
  let need;
  if (k === 'Q') need = HALF[key] ? `Question families. ${HALF[key]}` : 'Question families.';
  else if (k === 'A') need = 'Teacher observation over the term or a portfolio entry (see PLAN_OBSERVATION_RUBRICS.md); a tapped answer cannot show a feeling or a habit. No photo needed. Rubric: the strand indicators.';
  else { const [ind, task, ev] = P_TASK[key]; need = `${task} Rubric: KICD indicator ${ind} (${IND_NAME[ind]}). Evidence: ${ev}`; }
  rows.push(`| ${key} | ${k} | ${k === 'Q' ? (hasFam ? 'yes' : 'NO') : (hasFam ? 'yes (knowledge half)' : 'no')} | ${o.text.replace(/\|/g, '/').slice(0, 140)} | ${need} |`);
}
const total = n.Q + n.A + n.P;
const qNo = rows.filter(r => / \| Q \| NO \|/.test(r)).length;
const withFam = rows.filter(r => / \| (yes|yes \(knowledge half\)) \|/.test(r)).length;
const md = `# Pre-Technical Studies Grade 7: outcomes a question cannot fully test (13 Nov 2026)

Built from \`curriculum/pre_technical/g7.json\` and the registry entry. Outcome text is KICD's. **Q** means a question can test it, **A** an attitude (teacher observation or portfolio), **P** hands-on work: the learner makes, draws, sketches, measures, uses a tool or a device, or observes safety, which only a teacher can see. The kind is read from the outcome's verb. Per PLAN_OBSERVATION_RUBRICS.md a P outcome is a **task** marked by the teacher against the KICD rubric indicator (EE, ME, AE, BE), with an optional photo of the work, not the child.

- Outcomes: ${total}. By what tests them best: Q ${n.Q}, A ${n.A}, P ${n.P}. (SUBJECTS_STRUCTURE.md counts Q 31, P 14, A 13 for this grade; this build counts the outcomes whose verb is do, draw, sketch, use or observe as P, and the three drawing and sketching outcomes with a knowledge half as P too.)
- Outcomes with at least one question family: ${withFam}. With no family: ${total - withFam}. Q outcomes with no family: ${qNo}.
- A P outcome that has a family: the family tests the knowledge half (what each line type shows, what each symbol means) and the practical half still needs the task below.
- Safety: any task with heat, power, a sharp tool (scriber, dot punch, marking knife, saw, drill) or hot metal is done with a teacher. Twelve-year-olds do not light flames, use machines or handle hot metal on their own. Low-voltage cells only, never the mains. Online tasks use a school device and a teacher's account, never a child's own account, phone number or password.
- Evidence is the learner's work (a sheet, a piece, a file name), never a photo of a child.
- Natural or synthetic is asked only for clear cases (wood, stone, cotton, wool, sisal; plastics, nylon). Whether paper, glass, cement and ceramics are called natural or synthetic is a teacher decision, not asked.
- Making and projects the KICD design describes (a model, a poster, a business visit) are portfolio or observed tasks; they are not tested by tapped questions.
- The KICD rubrics in the curriculum JSON are untouched: 5 strand tables, 6 indicators (PRE_.G7.RUBRIC.1 to 5).

| Outcome | Kind | Has a family | Outcome text | What it needs |
|---|---|---|---|---|
${rows.join('\n')}
`;
writeFileSync(new URL('../docs/qa/pretechnical-g7-non-question-outcomes-2026-11-13.md', import.meta.url), md);
console.log(`non-question doc: ${total} outcomes, Q ${n.Q} A ${n.A} P ${n.P}, with a family ${withFam}, Q without ${qNo}`);
