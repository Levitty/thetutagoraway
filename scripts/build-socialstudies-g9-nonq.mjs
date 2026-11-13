// Writes docs/qa/socialstudies-g9-non-question-outcomes-2026-11-13.md. node scripts/build-socialstudies-g9-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(appreciate|acknowledge|embrace|desire|value|recognise|exhibit|cultivate)\b/i;
const P = /^(design|construct|choose|use|apply|plan|implement|write|participate|develop|illustrate|determine|use creative|enumerate)\b/i;
const classify = (t) => (A.test(t.trim()) ? 'A' : P.test(t.trim()) ? 'P' : 'Q');
await writeNonQ({
  subject: 'socialstudies', grade: 9, title: 'Social Studies Grade 9', prefix: 'SOCI.G9.',
  curriculumFile: 'curriculum/social_studies/g9.json', entryFile: 'src/ai-tutor/content/subjects/socialstudies_g9.js', classify,
  needs: {
    W: 'Composition marking by the teacher with the KICD rubric indicator.',
    O: 'An oral check scored by the teacher with the observation rubric.',
    P: 'A practical task, map or diagram, design, project, plan or report scored with the KICD rubric indicator: designing solutions, drawing pyramids and cross-sections, community service learning, taking part in civic activities. Evidence is the learner\'s product or the teacher\'s mark, never a recording of the child. The knowledge half is asked by questions where a family exists.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a value or an attitude.',
  },
  notes: ['Kind is assigned from the first verb of the outcome (explain, identify, describe, examine, outline and similar are Q; design, construct, apply, implement, write, participate and similar are P; appreciate, value, embrace and similar are A). It is a first sort for the reviewer, not the KICD\'s own tag.',
    'Facts (Aswan, Kariba, the 2010 Constitution, Chapter 4, the three pathways) are those taught in Kenyan schools, to be confirmed by a Social Studies teacher. Political content is limited to the structure of the Constitution and elections, with no party or person named.'],
});
