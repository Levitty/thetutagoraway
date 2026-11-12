// ============================================================================
// SUBJECT-GRADE ENTRY: English, Grade 5. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS_E5, SUBSTRANDS_E5, OUTCOMES_E5, MIS_FEEDBACK_E5 } from '../curriculumMap.english.g5.js';
import { FAMILIES as LANG } from '../families/eng_g5_lang.js';
import { FAMILIES as VOCAB } from '../families/eng_g5_vocab.js';
import { FAMILIES as READING } from '../families/eng_g5_reading.js';
import { SIGNED_ENGLISH } from '../families/eng_signed.js';

export default {
  subject: 'english', grade: 5, prefix: 'ENGL', order: 2,
  name: 'English', shortName: 'English', icon: 'book',
  description: 'Grade 5 English from the CBC design',
  map: { skills: SKILLS_E5, substrands: SUBSTRANDS_E5, outcomes: OUTCOMES_E5, misFeedback: MIS_FEEDBACK_E5 },
  families: [...LANG, ...VOCAB, ...READING],
  familyFiles: ['eng_g5_lang.js', 'eng_g5_vocab.js', 'eng_g5_reading.js'],
  signed: SIGNED_ENGLISH, signedFile: 'eng_signed.js',
  checks: 'text',
  coverageScript: 'scripts/coverage-english.mjs',   // its own coverage report (routes for what a question cannot test): coverage-outcomes.mjs skips it
  idPrefix: 'eng5.',
  marker: 'text',
  bank: false,
  curriculumDir: 'english',
  misconceptionsFile: null,
  reviewDoc: 'docs/qa/english-g5-2026-11-12.md',
  precheckLabel: 'English 5',
};
