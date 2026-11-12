// The family kit for Science and Technology Grade 4 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'SCIE.G4.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.science.g4.js';
import { SIGNED } from './science_g4_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'science', grade: 4, prefix: 'SCIE', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'science4.<tag>'; gen is choose(...), typed(...) or spot(...).
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `science4.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });
// m('M_CODE', 'wrong a', 'wrong b') gives wrong answers that all reveal one misconception: spread it into a case's wrong list.
export const m = (code, ...texts) => texts.map(t => [t, code]);
