// ============================================================================
// SUBJECT-GRADE ENTRY: Christian Religious Education, Grade 4. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.cre.g4.js';
import { FAMILIES as A } from '../families/cre_g4_a.js';
import { FAMILIES as B } from '../families/cre_g4_b.js';
import { FAMILIES as Cc } from '../families/cre_g4_c.js';
import { FAMILIES as D } from '../families/cre_g4_d.js';
import { SIGNED } from '../families/cre_g4_signed.js';

export default {
  subject: 'cre', grade: 4, prefix: 'CRES',
  name: 'Christian Religious Education', shortName: 'CRE', icon: 'book',
  description: 'Grade 4 Christian Religious Education from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [...A, ...B, ...Cc, ...D],                          // add each family file you write: [...A, ...B]
  familyFiles: ['cre_g4_a.js', 'cre_g4_b.js', 'cre_g4_c.js', 'cre_g4_d.js'],              // the same files by name (a phone build drops them while nothing is signed)
  signed: SIGNED, signedFile: 'cre_g4_signed.js',
  checks: 'family',                          // 'family' = the shared family checks; 'text' = word-answer checks (english_checks.mjs)
  idPrefix: 'cre4.',          // every family id starts with this
  marker: null,                            // 'text' when answers are marked as words by answerCheckText.js
  bank: false,                               // true only to also list the families in the shared bank (FAMILIES): Science G5 only
  curriculumDir: 'cre',                   // curriculum/<dir>/g<N>.json
  misconceptionsFile: 'engine/data/curriculum/cre.g4.misconceptions.json',
  reviewDoc: 'docs/qa/cre-g4-review-2026-11-13.md',   // the pack a teacher reads: node scripts/build-subject-review-doc.mjs <subject> <grade> writes docs/qa/<subject>-g<N>-review-<date>.md
  precheckLabel: 'CRE 4',
};
