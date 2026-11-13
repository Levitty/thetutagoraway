// ============================================================================
// SUBJECT-GRADE ENTRY: Kiswahili, Grade 6. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.kiswahili.g6.js';
import { FAMILIES as A } from '../families/kiswahili_g6_a.js';
import { FAMILIES as B } from '../families/kiswahili_g6_b.js';
import { FAMILIES as C } from '../families/kiswahili_g6_c.js';
import { FAMILIES as D } from '../families/kiswahili_g6_d.js';
import { FAMILIES as E } from '../families/kiswahili_g6_e.js';
import { FAMILIES as F } from '../families/kiswahili_g6_f.js';
import { SIGNED } from '../families/kiswahili_g6_signed.js';

export default {
  subject: 'kiswahili', grade: 6, prefix: 'KISW', order: 3,
  name: 'Kiswahili', shortName: 'Kiswahili', icon: 'book',
  description: 'Grade 6 Kiswahili from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A, ...B, ...C, ...D, ...E, ...F],                          // add each family file you write: [...A, ...B]
  familyFiles: ['kiswahili_g6_a.js', 'kiswahili_g6_b.js', 'kiswahili_g6_c.js', 'kiswahili_g6_d.js', 'kiswahili_g6_e.js', 'kiswahili_g6_f.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'kiswahili_g6_signed.js',
  checks: 'text',                            // word answers (marker 'text'): checked by english_checks.mjs, which is language-neutral except the reading-level rule (skipped for Kiswahili)
  idPrefix: 'kiswahili6.',          // every family id starts with this
  marker: 'text',                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'kiswahili',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/kiswahili.g6.misconceptions.json',
  reviewDoc: 'docs/qa/kiswahili-g6-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Kiswahili 6',
};
