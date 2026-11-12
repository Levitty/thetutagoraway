// The family kit for Science and Technology Grade 6 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'SCIE.G6.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.science.g6.js';
import { SIGNED } from './science_g6_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'science', grade: 6, prefix: 'SCIE', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'science6.<tag>'; gen is choose(...), typed(...) or spot(...).
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `science6.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });
// m('M_CODE', 'wrong a', 'wrong b') gives wrong answers that all reveal one misconception.
export const m = (code, ...texts) => texts.map(t => [t, code]);
// c(question, right, why, ['M_CODE', 'wrong a', 'wrong b'], ['M_OTHER', 'wrong c']) is one tap case.
export const c = (q, right, why, ...groups) => [q, right, groups.flatMap(([code, ...t]) => m(code, ...t)), why];
// sp(question, step 1, step 2, the false step 3, fix, 'M_CODE') is one spot-the-mistake case (steps 1 and 2 are right, step 3 is false).
export const sp = (q, a, b, f, fix, mis) => [q, [[a, true], [b, true], [f, false]], fix, mis];
