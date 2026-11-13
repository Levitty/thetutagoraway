// Writes docs/qa/socialstudies-g8-non-question-outcomes-2026-11-13.md. node scripts/build-socialstudies-g8-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|desire|recognise|show empathy|exhibit|demonstrate assertiveness|value|acknowledge)/i;
const P = /^(implement|design|plan|report|share|create awareness|apply|assess their|manage|exhibit social|build healthy|develop reasons|show how|illustrate strategies|demonstrate ways)/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'socialstudies', grade: 8, title: 'Social Studies Grade 8', prefix: 'SOCI.G8.',
  curriculumFile: 'curriculum/social_studies/g8.json', entryFile: 'src/ai-tutor/content/subjects/socialstudies_g8.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric (PLAN_OBSERVATION_RUBRICS.md).',
    P: 'A project, task or portfolio entry scored with the KICD rubric indicator: the community service learning project (identify, design, plan, implement, report), a map task with the topographical sheet, an awareness campaign, a group role play or a class action. Evidence is a photo of the product or the teacher\'s mark on the Record of work (no recording of children).',
    A: 'Teacher observation over the term or a portfolio entry; attitudes, empathy and values are never scored by a tapped answer.',
  },
  notes: ['Kind is assigned from the verb of the outcome (describe, explain, identify, outline, explore, examine and illustrate are Q; implement, design, plan, report, apply, assess and manage are P; appreciate, desire, recognise, show empathy and exhibit are A). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'The people and history units are told as commonly taught and are marked "to confirm by a teacher": human origin and early humans, the Swahili city-states, the Trans-Saharan trade, historical sites. Figures (the 2019 census, the 6.5 degrees per 1000 metres) are rounded.',
    'The map area questions give a count of 1 km squares; real topographical sheets and the marginal information are practical work with the sheet in hand.'],
});
