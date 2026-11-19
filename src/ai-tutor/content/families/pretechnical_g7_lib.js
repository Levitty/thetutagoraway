// The family kit for Pre-Technical Studies Grade 7 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'PRET.G7.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.pretechnical.g7.js';
import { SIGNED } from './pretechnical_g7_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'pretechnical', grade: 7, prefix: 'PRET', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});

// A family in one line: fam(tag, 'SUB.SKILL', form, rung, gen, oc?). The id is 'pretechnical7.<tag>'; gen is choose(...), typed(...) or spot(...).
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `pretechnical7.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });
// m('M_CODE', 'wrong a', 'wrong b') gives wrong answers that all reveal one misconception.
export const m = (code, ...texts) => texts.map(t => [t, code]);
// c(question, right, why, ['M_CODE', 'wrong a', 'wrong b'], ['M_OTHER', 'wrong c']) is one tap case.
export const c = (q, right, why, ...groups) => [q, right, groups.flatMap(([code, ...t]) => m(code, ...t)), why];
// sp(question, step 1, step 2, the false step 3, fix, 'M_CODE') is one spot-the-mistake case (steps 1 and 2 are right, step 3 is false).
export const sp = (q, a, b, f, fix, mis) => [q, [[a, true], [b, true], [f, false]], fix, mis];

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
