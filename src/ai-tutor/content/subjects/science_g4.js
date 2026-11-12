// ============================================================================
// SUBJECT-GRADE ENTRY: Science and Technology, Grade 4. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.science.g4.js';
import { FAMILIES as A } from '../families/science_g4_a.js';
import { FAMILIES as B } from '../families/science_g4_b.js';
import { FAMILIES as C } from '../families/science_g4_c.js';
import { SIGNED } from '../families/science_g4_signed.js';

export default {
  subject: 'science', grade: 4, prefix: 'SCIE', order: 1,
  name: 'Science and Technology', shortName: 'Science and Technology', icon: 'zap',
  description: 'Grade 4 Science and Technology from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A, ...B, ...C],                          // add each family file you write: [...A, ...B]
  familyFiles: ['science_g4_a.js', 'science_g4_b.js', 'science_g4_c.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'science_g4_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'science4.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'science',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/science.g4.misconceptions.json',
  reviewDoc: 'docs/qa/science-g4-review-2026-11-12.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Science and Technology 4',
};
