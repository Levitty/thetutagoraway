// Writes docs/qa/agriculture-g8-non-question-outcomes-2026-11-13.md. node scripts/build-agriculture-g8-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(adopt|appreciate|embrace|demonstrate|show|uphold|acknowledge)\b/i;
const P = /^(control|construct|conserve|plant|determine|prepare|carry out|cook|launder|knit|add value|make|take part|establish|rear|process|dress|preserve|use|design|access)\b/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'agriculture', grade: 8, title: 'Agriculture Grade 8', prefix: 'AGRI.G8.',
  curriculumFile: 'curriculum/agriculture/g8.json', entryFile: 'src/ai-tutor/content/subjects/agriculture_g8.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric.',
    P: 'A hands-on task scored with the KICD rubric indicator: gardening, constructing, cooking, laundering, knitting or making a product. Heat, sharp tools, chemicals and strong soap ingredients are handled only by a teacher or with a teacher present. Evidence is the learner\'s product or the teacher\'s mark, never a recording of the child. The knowledge half is asked by questions where a family exists.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a habit or an attitude.',
  },
  notes: ['Kind is assigned from the first verb of the outcome (explain, describe, identify and similar are Q; control, construct, conserve, plant, prepare, cook, launder, knit and make are P; adopt, appreciate and embrace are A). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'Heat, chemicals and caustic soap ingredients are never asked of a child as an action; questions ask for names and reasons only. Facts are to be confirmed by an Agriculture teacher.'],
});
