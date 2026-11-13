// ============================================================================
// SUBJECT-GRADE ENTRY: Kiswahili, Grade 9. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.kiswahili.g9.js';
import { FAMILIES as A } from '../families/kiswahili_g9_a.js';
import { FAMILIES as B } from '../families/kiswahili_g9_b.js';
import { FAMILIES as RD } from '../families/kiswahili_g9_reading.js';
import { SIGNED } from '../families/kiswahili_g9_signed.js';

export default {
  subject: 'kiswahili', grade: 9, prefix: 'KISW',
  name: 'Kiswahili', shortName: 'Kiswahili', icon: 'book',
  description: 'Grade 9 Kiswahili from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A, ...B, ...RD],                          // add each family file you write: [...A, ...B]
  familyFiles: ['kiswahili_g9_a.js', 'kiswahili_g9_b.js', 'kiswahili_g9_reading.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'kiswahili_g9_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'kiswahili9.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'kiswahili',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/kiswahili.g9.misconceptions.json',
  reviewDoc: 'docs/qa/kiswahili-g9-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Kiswahili 9',
};
