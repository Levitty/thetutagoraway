// ============================================================================
// SUBJECT-GRADE ENTRY: English, Grade 3. The one file that wires this subject-grade into HOREB.
// See docs/adding-a-subject.md. Nothing else shared is edited to add or change a subject-grade.
// Added 18 Nov 2026 with the depth map (scripts/build-english-lower.mjs 3): skills, misconceptions and teaching pack only.
// No question family names a Grade 3 skill yet; every skill is marked nofamily, so nothing can be served or set as homework.
// ============================================================================
import { SKILLS, SUBSTRANDS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.english.g3.js';
import { SIGNED } from '../families/english_g3_signed.js';

export default {
  subject: 'english', grade: 3, prefix: 'ENGL', order: 2,
  name: 'English', shortName: 'English', icon: 'book',
  description: 'Grade 3 English from the CBC design',
  map: { skills: SKILLS, substrands: SUBSTRANDS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
  families: [],                              // none yet: add each family file you write, as Grades 4-9 do
  familyFiles: [],
  signed: SIGNED, signedFile: 'english_g3_signed.js',
  checks: 'family',
  idPrefix: 'english3.',
  marker: 'text',
  bank: false,
  curriculumDir: 'english',
  misconceptionsFile: 'engine/data/curriculum/english.g3.misconceptions.json',
  reviewDoc: null,                           // write one with node scripts/build-subject-review-doc.mjs english 3 when families exist
  precheckLabel: 'English 3',
};
