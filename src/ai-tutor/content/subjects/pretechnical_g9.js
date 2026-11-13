// ============================================================================
// SUBJECT-GRADE ENTRY: Pre-Technical Studies, Grade 9. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.pretechnical.g9.js';
import { FAMILIES as A } from '../families/pretechnical_g9_a.js';
import { FAMILIES as B } from '../families/pretechnical_g9_b.js';
import { SIGNED } from '../families/pretechnical_g9_signed.js';

export default {
  subject: 'pretechnical', grade: 9, prefix: 'PRET',
  name: 'Pre-Technical Studies', shortName: 'Pre-Technical Studies', icon: 'book',
  description: 'Grade 9 Pre-Technical Studies from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A, ...B],                          // add each family file you write: [...A, ...B]
  familyFiles: ['pretechnical_g9_a.js', 'pretechnical_g9_b.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'pretechnical_g9_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'pretechnical9.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'pre_technical',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/pretechnical.g9.misconceptions.json',
  reviewDoc: 'docs/qa/pretechnical-g9-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'Pre-Technical Studies 9',
};
