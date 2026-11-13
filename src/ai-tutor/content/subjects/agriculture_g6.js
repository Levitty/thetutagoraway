// ============================================================================
// SUBJECT-GRADE ENTRY: Agriculture and Nutrition, Grade 6. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.agriculture.g6.js';
import { FAMILIES as A } from '../families/agriculture_g6_a.js';
import { FAMILIES as B } from '../families/agriculture_g6_b.js';
import { FAMILIES as C } from '../families/agriculture_g6_c.js';
import { SIGNED } from '../families/agriculture_g6_signed.js';

export default {
  subject: 'agriculture', grade: 6, prefix: 'AGRI',
  name: 'Agriculture and Nutrition', shortName: 'Agriculture and Nutrition', icon: 'book',
  description: 'Grade 6 Agriculture and Nutrition from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A, ...B, ...C],                          // add each family file you write: [...A, ...B]
  familyFiles: ['agriculture_g6_a.js', 'agriculture_g6_b.js', 'agriculture_g6_c.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'agriculture_g6_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'agriculture6.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'agriculture',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/agriculture.g6.misconceptions.json',
  reviewDoc: 'docs/qa/agriculture-g6-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Agriculture and Nutrition 6',
};
