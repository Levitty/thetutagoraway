// Writes docs/qa/pretechnical-g8-non-question-outcomes-2026-11-13.md. node scripts/build-pretechnical-g8-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|acknowledge|embrace|value|recognise)\b/i;
const P = /^(extinguish|secure|construct|draw|create|use|prepare)\b/i;
const classify = (t, sub, code) => (/MARKETING|OF_GOODS/.test(code) && /\.e$/.test(code) ? 'P' : A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'pretechnical', grade: 8, title: 'Pre-Technical Studies Grade 8', prefix: 'PRE_.G8.',
  curriculumFile: 'curriculum/pre_technical/g8.json', entryFile: 'src/ai-tutor/content/subjects/pretechnical_g8.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric (PLAN_OBSERVATION_RUBRICS.md).',
    P: 'A practical task, drawing, written task or observed activity scored by the teacher against the KICD rubric indicator. Extinguishing a fire is shown by the teacher or a fire officer on a small safe fire and only watched by learners. Cutting tools are used only with the teacher present. Drawings are marked on the learner\'s sheet, written tasks (statements, budgets) use made-up figures, and online or device tasks use a school device and a teacher\'s account. Evidence is the learner\'s work, never a photo of a child.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a feeling or a habit.',
  },
  notes: ['Kind is assigned from the verb of the outcome (identify, describe, explain, outline, classify and similar are Q; extinguish, secure, construct, draw, create, use and prepare are P; appreciate, acknowledge, embrace, value and recognise are A). Recognising suitable markets is treated as P because it is a local visit or discussion. It is a first sort for the reviewer, not the KICD\'s own tag. P outcomes whose knowledge half has a family are marked "yes (knowledge half)".',
    'Fire-safety, data-safety, drawing and money statements are written plainly for Grade 8 and are for a teacher to confirm. The questions never ask a child to light or fight a fire.',
    'Sums on scale and dimensions are computed in the question from small whole numbers and carry their units.'],
});
