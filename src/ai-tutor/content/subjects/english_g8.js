// ============================================================================
// SUBJECT-GRADE ENTRY: English, Grade 8. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.english.g8.js';
import { FAMILIES as LANG } from '../families/english_g8_lang.js';
import { FAMILIES as WRITE } from '../families/english_g8_write.js';
import { SIGNED } from '../families/english_g8_signed.js';

export default {
  subject: 'english', grade: 8, prefix: 'ENGL',
  name: 'English', shortName: 'English', icon: 'book',
  description: 'Grade 8 English from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...LANG, ...WRITE],                          // add each family file you write: [...A, ...B]
  familyFiles: ['english_g8_lang.js', 'english_g8_write.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'english_g8_signed.js',
  checks: 'text',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'english8.',          // every family id starts with this
  marker: 'text',                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'english',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/english.g8.misconceptions.json',
  reviewDoc: 'docs/qa/english-g8-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'English 8',
};
