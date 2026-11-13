// Writes docs/qa/creativearts-g7-non-question-outcomes-2026-11-13.md. node scripts/build-creativearts-g7-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|enjoy|realise|value|recognise)\b/i;
const P = /^(make|draw|paint|compose|carve|decorate|perform|execute|create|sing|play|sight read|write|group|name pitches|analyse a|examine)\b/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'creativearts', grade: 7, title: 'Creative Arts and Sports Grade 7', prefix: 'CREA.G7.',
  curriculumFile: 'curriculum/creative_arts/g7.json', entryFile: 'src/ai-tutor/content/subjects/creativearts_g7.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric.',
    P: 'A practical task scored with the KICD rubric indicator: making, drawing, painting, composing, carving, performing, playing a game or a skill, singing or playing an instrument. A teacher or coach is present for anything that throws, dives or has contact. Evidence is the learner\'s product or the teacher\'s mark, never a recording of the child. The knowledge half is asked by questions where a family exists.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show enjoyment or effort.',
  },
  notes: ['Kind is assigned from the first verb of the outcome (describe, outline, explain, identify, classify and similar are Q; make, draw, paint, compose, carve, perform, execute, create, sing, play, write and name pitches are P; appreciate, enjoy, realise and recognise are A). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'Javelin, swimming, handball and football are shown by a teacher or coach in a safe place; questions ask for names, order and rules only. Music answers (note values, treble staff) are standard staff notation facts, to be confirmed by a music teacher.'],
});
