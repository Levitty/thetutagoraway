// Writes docs/qa/cre-g6-non-question-outcomes-2026-11-13.md. node scripts/build-cre-g6-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(desire|appreciate|trust|exercise faith|depend on|emulate|serve god|stand firm|be partakers|live responsibly|read the bible always|recognise the value|acknowledge|utilise|apply|walk with|uphold|respect his|use leisure time responsibly)/i;
const O = /^(recite|retell|narrate|discuss|analyse)/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : O.test(t.trim()) ? 'O' : 'Q');
await writeNonQ({
  subject: 'cre', grade: 6, title: 'Christian Religious Education Grade 6', prefix: 'CRE.G6.',
  curriculumFile: 'curriculum/cre/g6.json', entryFile: 'src/ai-tutor/content/subjects/cre_g6.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check: the child retells the story, recites the creed or discusses in a group and the teacher listens and scores with the observation rubric (PLAN_OBSERVATION_RUBRICS.md); a tapped answer cannot show how a child tells or discusses.',
    P: 'A practical task or portfolio entry scored with the KICD rubric indicator.',
    A: 'Teacher observation over the term or a portfolio entry; values, faith and attitudes are never scored by a tapped answer, and CRE values are for the teacher\'s judgement.',
  },
  notes: ['Kind is assigned from the verb of the outcome (retell, narrate, discuss and recite are O, desire, appreciate, trust, emulate, depend on and the like are A). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'Bible facts asked are those stated in the passages the design names. Nothing denominational: the Ten Commandments are not numbered, nothing is asked on how Communion or baptism is done, the creed is asked only for what its words say. Islamic and Hindu RE are not loaded.',
    'The sensitive units (human sexuality, sanctity of life, alcohol and drugs, early marriage) are written for Grade 6 with a trusted adult always named as the place to turn; a CRE teacher and the child developmental psychology reviewer should read those families first.'],
});
