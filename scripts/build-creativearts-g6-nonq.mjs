// Writes docs/qa/creativearts-g6-non-question-outcomes-2026-11-13.md. node scripts/build-creativearts-g6-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(value|appreciate|acknowledge|show interest|desire)/i;
const Q = /^(identify|describe|classify|interpret|discuss|state|name|list|explain|aurally recognise|sing the sol-fa syllables doh to doh1 ascending)/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : Q.test(t.trim()) ? 'Q' : 'P');
await writeNonQ({
  subject: 'creativearts', grade: 6, title: 'Creative Arts Grade 6', prefix: 'CREA.G6.',
  curriculumFile: 'curriculum/creative_arts/g6.json', entryFile: 'src/ai-tutor/content/subjects/creativearts_g6.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'A singing, playing or listening check: the teacher listens and scores with the observation rubric (PLAN_OBSERVATION_RUBRICS.md). Evidence is the sound or the work, never the child: an audio clip with no voice naming anyone, or the teacher\'s four-level mark on the Record of work.',
    P: 'A practical task: the child makes, paints, plays, performs or swims, and the teacher scores it with the KICD rubric indicator. Evidence is a photo of the product or the teacher\'s mark on the Record of work (no recording of children).',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a feeling or a habit.',
  },
  notes: ['Kind is assigned from the verb of the outcome (identify, describe, classify, interpret and discuss are Q; make, paint, mount, compose, improvise, print, weave, perform, play, model and draw are P; value and appreciate are A). It is a first sort for the reviewer, not the KICD\'s own tag. P outcomes whose knowledge half has a family are marked "yes (knowledge half)".',
    'Only the knowledge half of the subject is tested by questions: parts and kinds of instruments, notation and sol-fa, colour words, steps of a technique, rules and safety. The KICD school-based projects (swimming, athletics, volleyball, gymnastics, pottery, weaving, printing, the recorder) stay practical.',
    'Instrument and community facts (nyatiti, orutu, litungu, obokano) and the sol-fa hand signs are for a teacher who knows them to confirm.'],
});
