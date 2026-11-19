// The family kit for Integrated Science Grade 8 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'INTE.G8.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.integratedscience.g8.js';
import { SIGNED } from './integratedscience_g8_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'integratedscience', grade: 8, prefix: 'INTE', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'integratedscience8.<tag>'; gen is choose(...), typed(...) or spot(...).
// The outcome letter each family tests when a skill covers several outcomes (the others test the skill's first outcome).
const OC = { 'ec.eu.label': 'e', 'pc.ch.use': 'd', 'cf.ft.stop': 'b', 'ce.cp.compare': 'c', 'ce.cp.spot': 'b', 'mv.do.role': 'c', 'mv.do.spot': 'c',
  'rp.st.help': 'e', 'rp.st.spot': 'e', 'te.fs.sort': 'b', 'te.fs.spot': 'b', 'te.tr.safe': 'd', 'te.tr.spot': 'd', 'pr.pr.use': 'b', 'pr.pr.spot': 'b' };
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `integratedscience8.${tag}`, cs, form, rung, gen, ...((oc || OC[tag]) ? { oc: oc || OC[tag] } : {}) });
// m('M_CODE', 'wrong a', 'wrong b') gives wrong answers that all reveal one misconception.
export const m = (code, ...texts) => texts.map(t => [t, code]);
// c(question, right, why, ['M_CODE', 'wrong a', 'wrong b'], ['M_OTHER', 'wrong c']) is one tap case.
export const c = (q, right, why, ...groups) => [q, right, groups.flatMap(([code, ...t]) => m(code, ...t)), why];
// sp(question, step 1, step 2, the false step, fix, 'M_CODE') is one spot-the-mistake case (steps 1 and 2 are right, the third is false).
// The false step is moved to a place that depends on the question (so it is not always the last); the true steps keep their order.
export const sp = (q, a, b, f, fix, mis) => {
  const pos = [...q].reduce((x, ch) => x + ch.charCodeAt(0), 0) % 3;
  const arr = [[a, true], [b, true]]; arr.splice(pos, 0, [f, false]);
  return [q, arr, fix, mis];
};

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
