// The family kit for Creative Arts Grade 4 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'CREA.G4.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.creativearts.g4.js';
import { SIGNED } from './creativearts_g4_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'creativearts', grade: 4, prefix: 'CREA', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'creativearts4.<tag>'; gen is choose(...), typed(...) or spot(...).
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `creativearts4.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });
// w('M_CODE', 'text', 'text') -> wrong answers that all reveal the same misconception: spread them into a case's list.
export const w = (mis, ...texts) => texts.map(t => [t, mis]);
// sp(question, [step, step, step], index of the false step (0 to 2), fix, 'M_CODE') -> one spot-the-mistake case.
export const sp = (q, steps, bad, fix, mis) => [q, steps.map((s, i) => [s, i !== bad]), fix, mis];
