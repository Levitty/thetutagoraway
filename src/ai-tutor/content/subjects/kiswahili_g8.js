// ============================================================================
// SUBJECT-GRADE ENTRY: Kiswahili, Grade 8. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.kiswahili.g8.js';
import { FAMILIES as A } from '../families/kiswahili_g8_a.js';
import { FAMILIES as B } from '../families/kiswahili_g8_b.js';
import { FAMILIES as RD } from '../families/kiswahili_g8_reading.js';
import { SIGNED } from '../families/kiswahili_g8_signed.js';

export default {
  subject: 'kiswahili', grade: 8, prefix: 'KISW',
  name: 'Kiswahili', shortName: 'Kiswahili', icon: 'book',
  description: 'Grade 8 Kiswahili from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A, ...B, ...RD],                          // add each family file you write: [...A, ...B]
  familyFiles: ['kiswahili_g8_a.js', 'kiswahili_g8_b.js', 'kiswahili_g8_reading.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'kiswahili_g8_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'kiswahili8.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'kiswahili',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/kiswahili.g8.misconceptions.json',
  reviewDoc: 'docs/qa/kiswahili-g8-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Kiswahili 8',
};
