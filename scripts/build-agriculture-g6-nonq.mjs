// Writes docs/qa/agriculture-g6-non-question-outcomes-2026-11-13.md. node scripts/build-agriculture-g6-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|acknowledge|embrace|adopt|recognise)/i;
const Q = /^(describe|identify|explain|name|list|state)/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : Q.test(t.trim()) ? 'Q' : 'P');
await writeNonQ({
  subject: 'agriculture', grade: 6, title: 'Agriculture and Nutrition Grade 6', prefix: 'AGRI.G6.',
  curriculumFile: 'curriculum/agriculture/g6.json', entryFile: 'src/ai-tutor/content/subjects/agriculture_g6.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric (PLAN_OBSERVATION_RUBRICS.md).',
    P: 'A practical task on the school farm, in the kitchen or in the home-science room (control erosion, prepare a seedbed, set a deterrent, rear small animals, dry produce, cook, wash, remove a stain, crochet, build a moist bed): the teacher watches and scores with the KICD rubric indicator. Evidence is a photo of the product or the teacher\'s mark on the Record of work (no recording of children). Food and fire tasks need an adult present.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a feeling or a habit.',
  },
  notes: ['Kind is assigned from the verb of the outcome (describe, identify and explain are Q; control, prepare, establish, rear, preserve, cook, practise, remove, use and construct are P; appreciate, embrace and adopt are A). It is a first sort for the reviewer, not the KICD\'s own tag. P outcomes whose knowledge half has a family are marked "yes (knowledge half)".',
    'Only the knowledge half of the practical outcomes is tested by questions. The work itself (terraces, seedbeds, deterrents, animals, drying, cooking, laundry, crochet, moist bed gardens) stays with the teacher and the school farm.',
    'Stain treatments, the Kenyan foods named with each cooking method and the deterrents named for each animal are for a teacher of Agriculture and Nutrition to confirm.'],
});
