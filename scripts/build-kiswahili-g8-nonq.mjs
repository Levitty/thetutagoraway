// Writes docs/qa/kiswahili-g8-non-question-outcomes-2026-11-13.md. node scripts/build-kiswahili-g8-nonq.mjs
import { writeNonQ } from './lib/nonq.mjs';
const A = /^(kuchangamkia|kufurahia|kuonea fahari|kuthamini|kuvutiwa|kuthamini)/i;
const O = /^(kujadili|kuwasilisha|kuigiza|kuimba|kughani|kusimulia|kuzungumza|kutoa|kutamka|kujibu|kusoma kwa)/i;
const W = /^(kuandika|kutunga|kufupisha)/i;
const classify = (t, sub, code) => {
  const x = t.trim();
  if (A.test(x)) return 'A';
  if (/KUSIKI\./.test(code) && !/kutambua|kueleza|kubainisha/i.test(x.split(' ')[0])) return 'O';
  if (O.test(x)) return 'O';
  if (W.test(x)) return 'W';
  if (/^kutumia/i.test(x) && /KUANDI\./.test(code)) return 'W';
  return 'Q';
};
await writeNonQ({
  subject: 'kiswahili', grade: 8, title: 'Kiswahili Grade 8', prefix: 'KISW.G8.',
  curriculumFile: 'curriculum/kiswahili/g8.json', entryFile: 'src/ai-tutor/content/subjects/kiswahili_g8.js', classify,
  needs: {
    W: 'Composition or written task marked by the teacher against the KICD rubric indicator (a letter, an essay, a summary or a sentence the learner writes).',
    O: 'An oral or listening check scored by the teacher with the observation rubric (PLAN_OBSERVATION_RUBRICS.md): listening and speaking tasks, songs, recitation and role play.',
    P: 'A practical task scored with the KICD rubric indicator.',
    A: 'Teacher observation over the term or a portfolio entry; a tapped answer cannot show a feeling or a habit.',
  },
  notes: ['Kind is assigned from the first verb of the outcome (kutambua, kueleza and kubainisha are Q; kuandika, kutunga and kufupisha are W; kujadili, kuwasilisha and the listening and speaking outcomes are O; kuchangamkia, kufurahia and kuonea fahari are A). It is a first sort for the reviewer, not the KICD\'s own tag. Reading comprehension and listening need passages or recordings and are not built here.',
    'This build covers grammar (sarufi), punctuation, letter-writing knowledge, tanzu za fasihi and ufupisho: 21 skills. The 39 other sub-strands (kusikiliza, kusoma, kuandika of compositions, most oral work) are for a later pass with passages.'],
});
