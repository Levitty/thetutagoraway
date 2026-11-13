// ============================================================================
// SUBJECT-GRADE ENTRY: Social Studies, Grade 8. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.socialstudies.g8.js';
import { FAMILIES as A } from '../families/socialstudies_g8_a.js';
import { FAMILIES as B } from '../families/socialstudies_g8_b.js';
import { FAMILIES as C } from '../families/socialstudies_g8_c.js';
import { SIGNED } from '../families/socialstudies_g8_signed.js';

export default {
  subject: 'socialstudies', grade: 8, prefix: 'SOCI',
  name: 'Social Studies', shortName: 'Social Studies', icon: 'book',
  description: 'Grade 8 Social Studies from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A, ...B, ...C],                          // add each family file you write: [...A, ...B]
  familyFiles: ['socialstudies_g8_a.js', 'socialstudies_g8_b.js', 'socialstudies_g8_c.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'socialstudies_g8_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'socialstudies8.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'social_studies',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/socialstudies.g8.misconceptions.json',
  reviewDoc: 'docs/qa/socialstudies-g8-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Social Studies 8',
};
