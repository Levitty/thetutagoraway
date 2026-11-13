// The family kit for Christian Religious Education Grade 4 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'CRES.G4.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.cre.g4.js';
import { SIGNED } from './cre_g4_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'cre', grade: 4, prefix: 'CRES', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A case, written short: C(question, right, why, [wrong, 'M_CODE'], ...) -> the case choose() takes.
export const C = (q, r, why, ...wrongs) => [q, r, wrongs, why];
// A misconception-code helper: const u = w('M_C4_UNIQ_'); u('wrong text', 'BETTER') -> ['wrong text', 'M_C4_UNIQ_BETTER'].
export const w = (prefix) => (text, code) => [text, prefix + code];
// A family, written short: F(id, skill, form, rung, kind, [hint1, hint2], cases, outcomeLetter?).
export const F = (id, cs, form, rung, kind, h, cases, oc) => sfam({ id: `cre4.${id}`, cs, oc, form, rung, kind, gen: choose(cases, { h }) });
