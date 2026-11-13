// Writes docs/qa/pretechnical-g9-non-question-outcomes-2026-11-13.md. node scripts/build-pretechnical-g9-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|acknowledge|embrace|value|desire)\b/i;
const P = /^(observe|handle|choose|sketch|draw|create|use|dispose|select|make|utilise|fill in|care)\b/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'pretechnical', grade: 9, title: 'Pre-Technical Studies Grade 9', prefix: 'PRE_.G9.',
  curriculumFile: 'curriculum/pre_technical/g9.json', entryFile: 'src/ai-tutor/content/subjects/pretechnical_g9.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric.',
    P: 'A practical task, drawing, project or written task scored with the KICD rubric indicator. Working on raised platforms, handling hazardous substances and using holding and driving tools are done only with a teacher present and the school\'s safety rules; the teacher shows, learners watch and say the steps. Drawings are marked on the learner\'s sheet, business plans use made-up figures, and device tasks use a school device and a teacher\'s account. Evidence is the learner\'s work, never a photo of a child.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show an attitude.',
  },
  notes: ['Kind is assigned from the first verb of the outcome (identify, describe, explain, classify, analyse and similar are Q; observe, handle, choose, sketch, draw, create, use, dispose, select, make, utilise and fill in are P; appreciate, acknowledge and embrace are A). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'Safety, tax and finance statements (VAT, PAYE, customs duty, SACCOs, eCitizen) are for a Pre-Technical teacher to confirm. No task with height, substances or tools is asked of a child as an action.'],
});
