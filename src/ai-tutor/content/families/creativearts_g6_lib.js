// The family kit for Creative Arts Grade 6 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'CREA.G6.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.creativearts.g6.js';
import { SIGNED } from './creativearts_g6_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'creativearts', grade: 6, prefix: 'CREA', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'creativearts6.<tag>'; gen is choose(...), typed(...) or spot(...).
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `creativearts6.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });
// w('M_CODE', 'text', 'text') -> wrong answers that all reveal the same misconception: spread them into a case's list.
export const w = (mis, ...texts) => texts.map(t => [t, mis]);
// sp(question, [step, step, step], index of the false step (0 to 2), fix, 'M_CODE') -> one spot-the-mistake case.
export const sp = (q, steps, bad, fix, mis) => {
  // the false step is moved to a place that depends on the question (so it is not always the last), the true steps keep their order
  const falseStep = steps[bad], rest = steps.filter((_, i) => i !== bad);
  const pos = [...q].reduce((a, c) => a + c.charCodeAt(0), 0) % steps.length;
  const arr = [...rest]; arr.splice(pos, 0, falseStep);
  return [q, arr.map(s => [s, s !== falseStep]), fix, mis];
};
