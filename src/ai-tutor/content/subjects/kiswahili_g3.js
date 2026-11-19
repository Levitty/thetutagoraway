// ============================================================================
// SUBJECT-GRADE ENTRY: Kiswahili, Grade 3. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Mapped 18 Nov 2026 from KICD outcomes only: the map has skills, prerequisites and misconceptions
// (all proposed or draft), and NO question families yet. Every skill is listed in the awaiting list for the family writers.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.kiswahili.g3.js';
import { SIGNED } from '../families/kiswahili_g3_signed.js';
import { AWAITING } from '../families/kiswahili_g3_awaiting.js';

export default {
  subject: 'kiswahili', grade: 3, prefix: 'KISW', order: 3,
  name: 'Kiswahili', shortName: 'Kiswahili', icon: 'book',
  description: 'Grade 3 Kiswahili from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [],                              // none yet: add each family file you write, [...A, ...B]
  familyFiles: [],                           // the same files by name
  signed: SIGNED, signedFile: 'kiswahili_g3_signed.js',
  awaiting: AWAITING,                        // every skill (no family yet): build-kiswahili-grade.mjs writes it
  checks: 'text',
  idPrefix: 'kiswahili3.',
  marker: 'text',
  bank: false,
  curriculumDir: 'kiswahili',
  misconceptionsFile: 'engine/data/curriculum/kiswahili.g3.misconceptions.json',
  precheckLabel: 'Kiswahili 3',
};
