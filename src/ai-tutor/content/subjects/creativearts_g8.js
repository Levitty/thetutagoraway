// ============================================================================
// SUBJECT-GRADE ENTRY: Creative Arts and Sports, Grade 8. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.creativearts.g8.js';
import { FAMILIES as A } from '../families/creativearts_g8_a.js';
import { SIGNED } from '../families/creativearts_g8_signed.js';

export default {
  subject: 'creativearts', grade: 8, prefix: 'CREA',
  name: 'Creative Arts and Sports', shortName: 'Creative Arts and Sports', icon: 'book',
  description: 'Grade 8 Creative Arts and Sports from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A],                          // add each family file you write: [...A, ...B]
  familyFiles: ['creativearts_g8_a.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'creativearts_g8_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'creativearts8.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'creative_arts',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/creativearts.g8.misconceptions.json',
  reviewDoc: 'docs/qa/creativearts-g8-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Creative Arts and Sports 8',
};
