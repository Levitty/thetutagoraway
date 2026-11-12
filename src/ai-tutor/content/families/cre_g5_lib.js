// The family kit for Christian Religious Education Grade 5 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'CRES.G5.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.cre.g5.js';
import { SIGNED } from './cre_g5_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'cre', grade: 5, prefix: 'CRES', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A case, written short: C(question, right, why, [wrong, 'M_CODE'], [wrong, 'M_CODE'], [wrong, 'M_CODE']) -> the case choose() takes.
export const C = (q, r, why, ...wrongs) => [q, r, wrongs, why];
