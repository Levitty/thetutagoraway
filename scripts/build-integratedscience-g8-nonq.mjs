// Writes docs/qa/integratedscience-g8-non-question-outcomes-2026-11-13.md. node scripts/build-integratedscience-g8-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|acknowledge|desire|value)/i;
const P = /^(demonstrate|develop a plan|develop)/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'integratedscience', grade: 8, title: 'Integrated Science Grade 8', prefix: 'INTE.G8.',
  curriculumFile: 'curriculum/integrated_science/g8.json', entryFile: 'src/ai-tutor/content/subjects/integratedscience_g8.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric (PLAN_OBSERVATION_RUBRICS.md).',
    P: 'A practical task or a written plan scored with the KICD rubric indicator: demonstrating diffusion and osmosis, simple energy transformations and pressure, observing cells under the microscope, and a plan to manage the challenges of the menstrual cycle. Anything with a flame, hot water, mains electricity or chemicals needs an adult present and the school\'s safety rules. Evidence is a photo of the product or the teacher\'s mark on the Record of work (no recording of children).',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a feeling or a habit.',
  },
  notes: ['Kind is assigned from the verb of the outcome (describe, explain, outline, identify, classify, assign and determine are Q; demonstrate and develop are P; appreciate is A). It is a first sort for the reviewer, not the KICD\'s own tag. P outcomes whose knowledge half has a family are marked "yes (knowledge half)".',
    'Medical and safety statements (the menstrual cycle, STIs and their prevention, fire classes and extinguishers) are written plainly for Grade 8 and are for a teacher or a health worker to confirm. The questions name a trusted adult or a health worker as the place to turn and never ask a child to light or fight a fire.',
    'Word equations, symbols and the magnification sum are tested by tapped options (Mathematics-style numbers are computed in the question).'],
});
