// Writes docs/qa/agriculture-g4-non-question-outcomes-2026-11-12.md: the outcomes a question cannot fully test, with what each needs.
//   node scripts/build-agriculture-g4-nonq.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const g4 = JSON.parse(readFileSync(new URL('../curriculum/agriculture/g4.json', import.meta.url), 'utf8'));
const entry = (await import('../src/ai-tutor/content/subjects/agriculture_g4.js')).default;
const withFamily = new Set(entry.families.map(f => f.outcome));
const P = 'AGRI.G4.';
// Q = a question can test it; P = a practical or product; A = an attitude. Read from the outcome's verb (as in docs/qa/agriculture-g5-non-question-outcomes).
const P_TASK = {
  'CONSER.SOIL_CONSERVATION.b': ['1.2', 'Make a compost heap or pit with a group at school or home: layers of dry and fresh plant waste with a little soil, kept damp and covered, turned now and then; each learner names one thing that goes in and one that stays out and says when it will be ready.', 'Photo of the heap with its layers and cover, and of the learner\'s labelled drawing.'],
  'CONSER.WATER_CONSERVATION.b': ['1.2', 'Set up a bottle or tube drip beside a plant or a bed (tiny hole, container higher than the bed, drip end beside the roots), fill it and check it twice in the week; the learner says what to do if the drip stops.', 'Photo of the bottle in place beside the plant, and of the learner\'s plan.'],
  'CONSER.FUEL_CONSERVATION.b': ['1.2', 'Cook one simple food (for example boiled eggs, githeri or rice) at school or home using the fuel-saving habits (lid on, food cut small, hard food soaked, dry wood, small fire after boiling) with a grown-up, and tick each habit on a checklist.', 'Photo of the covered pot on the fire or stove (no faces), and of the signed checklist.'],
  'CONSER.CONSERVING_WILD_ANIMALS.b': ['1.2', 'Make a scarecrow from two sticks, old clothes, a hat and rattling or flapping things and stand it in the middle of a school plot; move it each week and note what happens.', 'Photo of the scarecrow in place and of the notes on moving it.'],
  'FOOD_P.DIRECT_SOWING_OF_TINY_SE.b': ['2.2', 'Prepare a small seedbed (fine soil, stones and lumps out, flat), mix carrot, spinach or coriander seed with dry sand, sow it in lines very shallow, cover lightly, water gently and thin the seedlings when they crowd; the teacher checks each step.', 'Photo of the finished bed at sowing and again when the seedlings show.'],
  'FOOD_P.DIRECT_SOWING_OF_TINY_SE.c': ['2.2', 'Adopt direct sowing: each learner sows and looks after one row of a tiny-seed crop on the school plot or at home for the term and keeps a care log. This is a habit and a choice, so it is seen over the term, not tested.', 'Photo of the row at three weeks and of the care log.'],
  'FOOD_P.GROWING_FRUITS.b': ['2.2', 'Plant a fruit seedling suited to the locality (for example pawpaw, banana, guava or mango) in a hole with manure mixed in, at the right depth, with mulch and regular water, and care for it for a term.', 'Photo of the seedling at planting and at week 4, and of the care log.'],
  'FOOD_P.COOKING_FOOD.b': ['2.2', 'Cook one food by boiling (for example githeri or eggs) and one by shallow frying (for example chapati or an egg) with a teacher or parent, keeping to the safety steps (handle inwards, a lid for an oil fire, never leave the fire); serve it on a clean plate.', 'Photo of the finished food on a clean plate (no faces), and of the safety checklist.'],
  'HYGIEN.PERSONAL_HYGIENE.b': ['3.2', 'Wash hands properly in front of the teacher (wet, soap, rub all parts including under the nails for a short song, rinse, dry on a clean cloth), and keep a one-week chart of bathing, brushing teeth and nails at home and school.', 'Photo of the class handwashing point and of the learner\'s chart (no faces).'],
  'HYGIEN.DOMESTIC_HYGIENE.b': ['3.2', 'Clean a classroom corner or a model room in the right order (windows, dust, sweep, mop) with the right tools, and wash cups and plates before greasy pots.', 'Photo of the cleaned corner and of the tools laid out in order.'],
  'HYGIEN.CLEANING_PERSONAL_PROTEC.b': ['3.2', 'Clean and dry a protective item (apron, gumboots or gloves) by the steps (remove dirt, wash with soap and water, rinse, dry fully, store clean and dry).', 'Photo of the item drying and of the learner\'s step card.'],
  'PRODUC.MAKING_TACKING_STITCHES.b': ['4.1', 'Make an item (a small bag, a cushion cover or a sample card) by tacking, then stitching beside the tacking and pulling the tacking out, with long loose stitches in a thread that shows. The teacher checks the choice of stitch, evenness and firmness.', 'Photo of the sample card or item before and after the tacking is out.'],
};
const IND_NAME = { '1.2': 'conserve the four resources', '2.2': 'carry out food production processes', '3.2': 'apply health practices', '4.1': 'use tacking stitches in making an item' };
const A_INDICATOR = { CONSER: '1.3 responsibility in conservation', FOOD_P: '2.3 integrity in food production', HYGIEN: '3.3 responsibility in hygiene', PRODUC: '4.2 working in unity' };
const kindOf = (code, text) => {
  const key = code.slice(P.length);
  if (P_TASK[key]) return 'P';
  if (/^(appreciate|embrace|adopt|value|realise|desire)\b/i.test(text)) return 'A';
  return 'Q';
};
const rows = []; const n = { Q: 0, A: 0, P: 0 };
for (const s of g4.sub_strands) for (const o of s.outcomes) {
  const key = o.code.slice(P.length); const k = kindOf(o.code, o.text); n[k]++;
  const hasFam = withFamily.has(o.code);
  let need;
  if (k === 'Q') need = 'Question families.';
  else if (k === 'A') need = `Teacher observation over the term or a portfolio entry; the KICD indicator for values in this strand (${A_INDICATOR[key.split('.')[0]]}). A tapped answer cannot show a feeling or a habit. No photo needed.`;
  else { const [ind, task, photo] = P_TASK[key]; need = `${task} Rubric: KICD indicator ${ind} (${IND_NAME[ind]}), and the values indicator for the strand when the teacher watches how the learner copes. Photo evidence: ${photo} Part of the KNEC school-based assessment pool for Agriculture.`; }
  rows.push(`| ${key} | ${k} | ${k === 'Q' ? (hasFam ? 'yes' : 'NO') : (hasFam ? 'yes (knowledge half)' : 'no')} | ${o.text} | ${need} |`);
}
const total = n.Q + n.A + n.P;
const qNo = rows.filter(r => / \| Q \| NO \|/.test(r)).length;
const withFam = rows.filter(r => / \| (yes|yes \(knowledge half\)) \|/.test(r)).length;
const md = `# Agriculture and Nutrition Grade 4: outcomes a question cannot fully test (12 Nov 2026)

Built from \`curriculum/agriculture/g4.json\` and the registry entry. Outcome text is KICD's. **Q** means a question can test it, **A** an attitude (teacher observation or portfolio), **P** a practical or product: the learner makes, grows, cooks, cleans, sews or sets up something, which only a teacher can see. The kind is read from the outcome's verb. Per PLAN_OBSERVATION_RUBRICS.md a P outcome is a **task** marked by the teacher against the KICD rubric indicator (EE, ME, AE, BE), with an optional **photo of the work, not the child** as evidence. Agriculture is one of the learning areas for which KNEC sets school-based assessment projects and practicals at Grade 4 and 5, so each P task below can double as an SBA task once the KNEC tool is seen (the criteria and marks come from the KNEC scoring guide, not from this table).

- Outcomes: ${total}. By what tests them best: Q ${n.Q}, A ${n.A}, P ${n.P} (${Math.round(100 * n.P / total)} percent practical at this grade; about 42 percent across Grades 4 to 9).
- Outcomes with at least one question family: ${withFam}. With no family: ${total - withFam}. Q outcomes with no family: ${qNo}.
- A P outcome that has a family: the family tests the knowledge half (for example, which materials go on the compost heap, where the drip bottle stands, which stitch is tacking) and the practical half still needs the task below. A family may cover the knowledge half only.
- Setting and safety: every practical that uses a fire, a stove, oil or a spray is done with a teacher or parent. Nine-year-olds do not light fires or handle hot oil alone.
- The KICD rubrics in the curriculum JSON are untouched: 4 strand tables, 11 indicators (AGRI.G4.RUBRIC.1 to 4).

| Outcome | Kind | Has a family | Outcome text | What it needs |
|---|---|---|---|---|
${rows.join('\n')}
`;
writeFileSync(new URL('../docs/qa/agriculture-g4-non-question-outcomes-2026-11-12.md', import.meta.url), md);
console.log(`non-question doc: ${total} outcomes, Q ${n.Q} A ${n.A} P ${n.P}, with a family ${withFam}, Q without ${qNo}`);
