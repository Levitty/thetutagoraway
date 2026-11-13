// The family kit for Social Studies Grade 7 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'SOCI.G7.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.socialstudies.g7.js';
import { SIGNED } from './socialstudies_g7_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'socialstudies', grade: 7, prefix: 'SOCI', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'socialstudies7.<tag>'; gen is choose(...), typed(...) or spot(...).
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `socialstudies7.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });   // oc: the outcome letter this family tests when the skill has several

// Compact writers (the same cases as choose and spot, with less punctuation). CODE is the misconception without 'M_'.
//   Q(question, right, ['wrong text|CODE', ...], why, extra?)     w('CODE', 'text', 'text') -> several wrongs that reveal one misconception
//   S(question, ['true step', '!false step', ...], fix, 'CODE')   a step that starts with ! is the false one
export const Q = (q, right, wrongs, why, extra) => [q, right, wrongs.map(x => { const [t, c] = x.split('|'); return [t, `M_${c}`]; }), why, ...(extra ? [extra] : [])];
export const w = (code, ...texts) => texts.map(t => `${t}|${code}`);
export const S = (q, steps, fix, code) => [q, steps.map(s => (s.startsWith('!') ? [s.slice(1), false] : [s, true])), fix, `M_${code}`];

// C(code, question, right, [wrong, wrong, wrong], why, extra?): one misconception behind all three wrong answers.
export const C = (code, q, right, wrongs, why, extra) => Q(q, right, w(code, ...wrongs), why, extra);
