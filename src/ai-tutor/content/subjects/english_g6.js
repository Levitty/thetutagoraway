// ============================================================================
// SUBJECT-GRADE ENTRY: English, Grade 6. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.english.g6.js';
import { FAMILIES as LANG } from '../families/english_g6_lang.js';
import { FAMILIES as WRITE } from '../families/english_g6_write.js';
import { FAMILIES as VOCAB } from '../families/english_g6_vocab.js';
import { FAMILIES as READING } from '../families/english_g6_reading.js';
import { FAMILIES as LISTEN } from '../families/english_g6_listening.js';
import { SIGNED } from '../families/english_g6_signed.js';

export default {
  subject: 'english', grade: 6, prefix: 'ENGL', order: 2,
  name: 'English', shortName: 'English', icon: 'book',
  description: 'Grade 6 English from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...LANG, ...WRITE, ...VOCAB, ...READING, ...LISTEN],
  familyFiles: ['english_g6_lang.js', 'english_g6_write.js', 'english_g6_vocab.js', 'english_g6_reading.js', 'english_g6_listening.js'],
  signed: SIGNED, signedFile: 'english_g6_signed.js',
  checks: 'text',
  idPrefix: 'english6.',          // every family id starts with this
  marker: 'text',                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'english',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/english.g6.misconceptions.json',
  reviewDoc: 'docs/qa/english-g6-review-2026-11-12.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'English 6',
};
