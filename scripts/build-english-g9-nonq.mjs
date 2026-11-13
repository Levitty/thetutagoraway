// Writes docs/qa/english-g9-non-question-outcomes-2026-11-13.md. node scripts/build-english-g9-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(acknowledge|appreciate|value|advocate|enjoy|embrace|take pride|desire)\b/i;
const W = /^(write|create|compose|construct|make notes|correct|punctuate|summari[sz]e|rewrite|use|convert|apply|spell)\b/i;
const classify = (t, sub, code) => {
  const x = t.trim();
  if (A.test(x)) return 'A';
  if (/\.LISTEN\./.test(code) && !/^(identify|distinguish|recognise)/i.test(x)) return 'O';
  if (/\.READIN\.T\d+_(INTENSIVE|PLAY|EXTENSIVE|READING_FLUENCY)/.test(code) && /^(read|perform|act|dramati)/i.test(x)) return 'O';
  if (W.test(x)) return 'W';
  return 'Q';
};
await writeNonQ({
  subject: 'english', grade: 9, title: 'English Grade 9', prefix: 'ENGL.G9.',
  curriculumFile: 'curriculum/english/g9.json', entryFile: 'src/ai-tutor/content/subjects/english_g9.js', classify,
  needs: {
    W: 'Composition or written task marked by the teacher with the KICD rubric indicator: sentences, paragraphs, letters, summaries, notes and corrections written by the learner. The knowledge half is asked by questions where a family exists.',
    O: 'An oral or listening check scored by the teacher with the observation rubric (PLAN_OBSERVATION_RUBRICS.md): listening, speaking, reading aloud, drama and poetry performance.',
    P: 'A practical task scored with the KICD rubric indicator.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show an attitude.',
  },
  notes: ['Kind is assigned from the first verb of the outcome (identify, describe, distinguish, recognise and similar are Q; write, create, use, convert and spell are W; listening and speaking outcomes are O; appreciate, acknowledge and value are A). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'This build covers the grammar sub-strands and the mechanics, paragraph, letter, narrative and poetry knowledge: 22 skills. Reading comprehension on passages, plays and poems needs Grade 9 passages that are not built yet, so many Q outcomes have no family: they are listed in the table as NO.'],
});
