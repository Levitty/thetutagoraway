// ============================================================================
// SUBJECT-GRADE ENTRY: English, Grade 4. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.english.g4.js';
import { FAMILIES as LANG } from '../families/english_g4_lang.js';
import { FAMILIES as WRITE } from '../families/english_g4_write.js';
import { FAMILIES as VOCAB } from '../families/english_g4_vocab.js';
import { FAMILIES as READING } from '../families/english_g4_reading.js';
import { SIGNED } from '../families/english_g4_signed.js';

export default {
  subject: 'english', grade: 4, prefix: 'ENGL', order: 2,
  name: 'English', shortName: 'English', icon: 'book',
  description: 'Grade 4 English from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...LANG, ...WRITE, ...VOCAB, ...READING],
  familyFiles: ['english_g4_lang.js', 'english_g4_write.js', 'english_g4_vocab.js', 'english_g4_reading.js'],
  signed: SIGNED, signedFile: 'english_g4_signed.js',
  checks: 'text',
  coverageScript: 'scripts/coverage-english-g4.mjs',   // its own coverage report (routes for what a question cannot test): coverage-outcomes.mjs skips it
  idPrefix: 'english4.',
  marker: 'text',
  bank: false,
  curriculumDir: 'english',
  misconceptionsFile: 'engine/data/curriculum/english.g4.misconceptions.json',
  reviewDoc: 'docs/qa/english-g4-review-2026-11-12.md',
  precheckLabel: 'English 4',
};
