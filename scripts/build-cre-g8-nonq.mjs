// Writes docs/qa/cre-g8-non-question-outcomes-2026-11-13.md. node scripts/build-cre-g8-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|value|desire|acknowledge|take part|pray|exercise|uphold|respect)\b/i;
const P = /^(apply|practise|practice|conserve|choose|utilize|utilise|compile|recommend|read the scriptures|narrate|demonstrate|model|propose|establish|originate|evaluate|exemplify)\b/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'cre', grade: 8, title: 'CRE Grade 8', prefix: 'CRE.G8.',
  curriculumFile: 'curriculum/cre/g8.json', entryFile: 'src/ai-tutor/content/subjects/cre_g8.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric (PLAN_OBSERVATION_RUBRICS.md).',
    P: 'A practical task, written plan, discussion or portfolio entry scored with the KICD rubric indicator: applying values, practising stewardship, choosing and planting a crop, recommending solutions, narrating a story aloud. Private matters (home life, personal struggles) are never asked of a child. Evidence is the product or the teacher\'s mark, never a recording of children.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a feeling, a faith or a habit. Never scored by a tap.',
  },
  notes: ['Kind is assigned from the verb of the outcome (identify, explain, describe, discuss, outline and similar are Q; apply, practise, conserve, choose, utilise, compile, recommend, narrate are P; appreciate, value, desire, acknowledge, pray and take part are A). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'Bible facts are those of the named passages; nothing denominational is asked (no claims on how Communion works or how baptism is done). Sensitive topics (human sexuality, drugs, gambling, social media) ask for knowledge and safe responses only and always name a trusted adult. All are to be confirmed by a CRE teacher who knows the school\'s tradition.'],
});
