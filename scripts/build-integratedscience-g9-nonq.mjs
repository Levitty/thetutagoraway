// Writes docs/qa/integratedscience-g9-non-question-outcomes-2026-11-13.md. node scripts/build-integratedscience-g9-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|show interest|recognise|value)\b/i;
const P = /^(draw|investigate|apply|construct|determine)\b/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'integratedscience', grade: 9, title: 'Integrated Science Grade 9', prefix: 'INTE.G9.',
  curriculumFile: 'curriculum/integrated_science/g9.json', entryFile: 'src/ai-tutor/content/subjects/integratedscience_g9.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric.',
    P: 'A practical task, diagram or investigation scored with the KICD rubric indicator: drawing electron arrangements and ray diagrams, investigating the conditions for photosynthesis, softening water, constructing food chains and webs. Anything with heat, chemicals or sharp tools needs a teacher present and the school\'s safety rules. Evidence is the learner\'s product or the teacher\'s mark, never a recording of the child. The knowledge half is asked by questions where a family exists.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show an interest or an attitude.',
  },
  notes: ['Kind is assigned from the first verb of the outcome (describe, explain, identify, outline, classify and similar are Q; draw, investigate, apply, construct and determine are P; appreciate, show interest and recognise are A). It is a first sort for the reviewer, not the KICD\'s own tag. Mass-number sums are small whole numbers.',
    'Atom, metals, alloys, water hardness, photosynthesis, digestion, flower, mirror and wave facts are textbook level for Grade 9 and are to be confirmed by an Integrated Science teacher. No experiment is asked of a child as an action.'],
});
