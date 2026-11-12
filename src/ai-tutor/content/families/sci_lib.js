// ============================================================================
// GRADE 5 SCIENCE AND TECHNOLOGY FAMILIES: the kit the sci_g5_*.js files are written in. The kit itself is the shared
// one for any subject-grade (subject_kit.js); this file only says which subject-grade it is. Same shape as Grade 5 Maths
// (g5c_lib.js), generalised for a subject whose answers are words, not numbers: see subject_kit.js for how to write a gen().
// reviewed is false until a teacher signs the family off (sci_signed.js); the one switch is in core.js, as for Maths.
// ============================================================================
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS_SCI_G5, OUTCOMES_SCI_G5, MIS_FEEDBACK } from '../curriculumMap.science.g5.js';
import { SIGNED_SCIENCE } from './sci_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'science', grade: 5, prefix: 'SCIE', signed: SIGNED_SCIENCE,
  map: { skills: SKILLS_SCI_G5, outcomes: OUTCOMES_SCI_G5, misFeedback: MIS_FEEDBACK },
});
