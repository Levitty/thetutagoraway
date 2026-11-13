// The family kit for Social Studies Grade 8 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'SOCI.G8.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.socialstudies.g8.js';
import { SIGNED } from './socialstudies_g8_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'socialstudies', grade: 8, prefix: 'SOCI', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'socialstudies8.<tag>'; gen is choose(...), typed(...) or spot(...).
// The outcome letter each family tests when a skill covers several outcomes (the others test the skill's first outcome).
const OC = {
  'sa.se.effects': 'b', 'cs.st.use': 'd', 'cs.st.spot': 'e', 'sc.ev.evidence': 'c', 'sc.ev.spot': 'b', 'sc.cr.why': 'e', 'sc.cr.keep': 'd', 'sc.cr.spot': 'f',
  'ec.sw.legacy': 'b', 'ec.sw.spot': 'b', 'ts.tr.effects': 'c', 'ts.tr.spot': 'b', 'pg.po.kenya': 'c', 'pg.po.spot': 'b', 'dv.dv.use': 'b', 'dv.dv.spot': 'b',
  'dv.pr.refuse': 'd', 'dv.pr.spot': 'd', 'pc.fc.skills': 'c', 'pc.fc.spot': 'b', 'mp.tm.area': 'b', 'mp.tm.spot': 'c', 'wc.cl.regions': 'b', 'wc.cl.spot': 'b',
  'vg.vg.regions': 'b', 'vg.vg.conserve': 'a', 'vg.vg.spot': 'c', 'hs.st.why': 'b', 'hs.st.spot': 'c', 'cn.co.lead': 'c', 'cn.co.spot': 'b',
  'hr.hr.child': 'c', 'hr.hr.protect': 'd', 'hr.hr.spot': 'a', 'cz.cz.harmony': 'c', 'cz.cz.spot': 'b',
};
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `socialstudies8.${tag}`, cs, form, rung, gen, ...((oc || OC[tag]) ? { oc: oc || OC[tag] } : {}) });

// Compact writers (the same cases as choose and spot, with less punctuation). CODE is the misconception without 'M_'.
//   Q(question, right, ['wrong text|CODE', ...], why, extra?)     w('CODE', 'text', 'text') -> several wrongs that reveal one misconception
//   S(question, ['true step', '!false step', ...], fix, 'CODE')   a step that starts with ! is the false one
export const Q = (q, right, wrongs, why, extra) => [q, right, wrongs.map(x => { const [t, c] = x.split('|'); return [t, `M_${c}`]; }), why, ...(extra ? [extra] : [])];
export const w = (code, ...texts) => texts.map(t => `${t}|${code}`);
export const S = (q, steps, fix, code) => [q, steps.map(s => (s.startsWith('!') ? [s.slice(1), false] : [s, true])), fix, `M_${code}`];

// C(code, question, right, [wrong, wrong, wrong], why, extra?): one misconception behind all three wrong answers.
export const C = (code, q, right, wrongs, why, extra) => Q(q, right, w(code, ...wrongs), why, extra);
