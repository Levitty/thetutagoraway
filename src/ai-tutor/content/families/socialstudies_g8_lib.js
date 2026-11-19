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

// T(tag, 'SUB.SKILL', ['M_CODE', ...], [hint1, hint2], directRows, storyRows, spotRows, oc?)  (19 Nov 2026, the depth-pass skills)
// A direct or story row is [question, right, 'wrong|i', 'wrong|i', 'wrong|i', why?]: i is the index in the codes of the misconception
// that wrong answer reveals, so every wrong option names its own. why (default: the second hint) is the reason shown.
// A spot row is [question, true step, true step, false step, fix, i]; the false step moves place with the question.
// oc is one outcome letter for all three families, or [direct, story, spot] letters.
export const T = (tag, cs, codes, h, direct, story, spots, oc) => {
  const o = [].concat(oc || []);
  const ocOf = (i) => (o.length > 1 ? o[i] : o[0]);
  const code = (i) => codes[i] || (() => { throw new Error(`${tag}: no misconception ${i}`); })();
  const cases = (rows) => rows.map(([q, r, ...w]) => {
    const why = w.length > 3 && !w[w.length - 1].includes('|') ? w.pop() : h[1];
    return [q, r, w.map(x => { const [t, i] = x.split('|'); return [t, code(Number(i))]; }), why];
  });
  const spotCase = ([q, a, b, f, fix, i]) => {
    const st = [[a, true], [b, true]];
    st.splice([...q].reduce((x, ch) => x + ch.charCodeAt(0), 0) % 3, 0, [f, false]);
    return [q, st, fix, code(i)];
  };
  const hint = { h, s1: h[0] };
  return [
    fam(`${tag}.direct`, cs, 'direct', 1, choose(cases(direct), hint), ocOf(0)),
    fam(`${tag}.story`, cs, 'word', 2, choose(cases(story), hint), ocOf(1)),
    fam(`${tag}.spot`, cs, 'spot', 3, spot(spots.map(spotCase), hint), ocOf(2)),
  ];
};
