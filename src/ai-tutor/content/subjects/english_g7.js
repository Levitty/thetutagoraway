// ============================================================================
// SUBJECT-GRADE ENTRY: English, Grade 7. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.english.g7.js';
import { FAMILIES as LANG } from '../families/english_g7_lang.js';
import { FAMILIES as WRITE } from '../families/english_g7_write.js';
import { FAMILIES as VOCAB } from '../families/english_g7_vocab.js';
import { FAMILIES as READING } from '../families/english_g7_reading.js';
import { SIGNED } from '../families/english_g7_signed.js';

export default {
  subject: 'english', grade: 7, prefix: 'ENGL', order: 2,
  name: 'English', shortName: 'English', icon: 'book',
  description: 'Grade 7 English from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...LANG, ...WRITE, ...VOCAB, ...READING],
  familyFiles: ['english_g7_lang.js', 'english_g7_write.js', 'english_g7_vocab.js', 'english_g7_reading.js'],
  signed: SIGNED, signedFile: 'english_g7_signed.js',
  checks: 'text',
  idPrefix: 'english7.',          // every family id starts with this
  marker: 'text',                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'english',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/english.g7.misconceptions.json',
  reviewDoc: 'docs/qa/english-g7-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'English 7',
};
