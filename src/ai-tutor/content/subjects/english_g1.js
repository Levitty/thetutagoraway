// ============================================================================
// SUBJECT-GRADE ENTRY: English, Grade 1. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// Added 18 Nov 2026 with the depth map (scripts/build-english-lower.mjs 1): skills, misconceptions and teaching pack only.
// No question family names a Grade 1 skill yet; every skill is marked nofamily, so nothing can be served or set as homework.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.english.g1.js';
import { SIGNED } from '../families/english_g1_signed.js';

export default {
  subject: 'english', grade: 1, prefix: 'ENGL', order: 2,
  name: 'English', shortName: 'English', icon: 'book',
  description: 'Grade 1 English from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [],                              // none yet: add each family file you write, as Grades 4-9 do
  familyFiles: [],
  signed: SIGNED, signedFile: 'english_g1_signed.js',
  checks: 'family',
  idPrefix: 'english1.',
  marker: 'text',
  bank: false,
  curriculumDir: 'english',
  misconceptionsFile: 'engine/data/curriculum/english.g1.misconceptions.json',
  reviewDoc: null,                           // write one with node scripts/build-subject-review-doc.mjs english 1 when families exist
  precheckLabel: 'English 1',
};
