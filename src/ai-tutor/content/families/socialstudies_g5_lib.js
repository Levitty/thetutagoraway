// The family kit for Social Studies Grade 5 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'SOCI.G5.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.socialstudies.g5.js';
import { SIGNED } from './socialstudies_g5_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'socialstudies', grade: 5, prefix: 'SOCI', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'socialstudies5.<tag>'; gen is choose(...), typed(...) or spot(...).
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `socialstudies5.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });   // oc: the outcome letter this family tests when the skill has several
