// The family kit for Agriculture and Nutrition Grade 6 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'AGRI.G6.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.agriculture.g6.js';
import { SIGNED } from './agriculture_g6_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'agriculture', grade: 6, prefix: 'AGRI', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'agriculture6.<tag>'; gen is choose(...), typed(...) or spot(...).
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `agriculture6.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });   // oc: the outcome letter this family tests when the skill has several

// Compact writers (the same cases as choose and spot, with less punctuation).
//   Q(question, right, ['wrong text|CODE', ...], why, extra?)   CODE is the misconception without 'M_AG_'
//   S(question, ['true step', '!false step', ...], fix, 'CODE')   a step that starts with ! is the false one
export const Q = (q, right, wrongs, why, extra) => [q, right, wrongs.map(w => { const [t, c] = w.split('|'); return [t, `M_AG_${c}`]; }), why, ...(extra ? [extra] : [])];
export const S = (q, steps, fix, code) => [q, steps.map(s => (s.startsWith('!') ? [s.slice(1), false] : [s, true])), fix, `M_AG_${code}`];
