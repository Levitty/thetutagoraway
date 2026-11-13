// ============================================================================
// SUBJECT-GRADE ENTRY: Agriculture, Grade 7. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.agriculture.g7.js';
import { FAMILIES as A } from '../families/agriculture_g7_a.js';
import { SIGNED } from '../families/agriculture_g7_signed.js';

export default {
  subject: 'agriculture', grade: 7, prefix: 'AGRI',
  name: 'Agriculture', shortName: 'Agriculture', icon: 'book',
  description: 'Grade 7 Agriculture from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A],                          // add each family file you write: [...A, ...B]
  familyFiles: ['agriculture_g7_a.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'agriculture_g7_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'agriculture7.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'agriculture',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/agriculture.g7.misconceptions.json',
  reviewDoc: 'docs/qa/agriculture-g7-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Agriculture 7',
};
