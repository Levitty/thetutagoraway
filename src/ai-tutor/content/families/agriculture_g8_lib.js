// The family kit for Agriculture Grade 8 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'AGRI.G8.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.agriculture.g8.js';
import { SIGNED } from './agriculture_g8_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'agriculture', grade: 8, prefix: 'AGRI', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `agriculture8.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });
export const m = (code, ...texts) => texts.map(t => [t, code]);
export const c = (q, right, why, ...groups) => [q, right, groups.flatMap(([code, ...t]) => m(code, ...t)), why];
export const sp = (q, a, b, f, fix, mis) => [q, [[a, true], [b, true], [f, false]], fix, mis];

// S(tag, 'SUB.', 'SKILL', ['SUFFIX', ...], [hint1, hint2], directRows, storyRows, spotRows, oc?)
// A direct or story row is [question, right, wrong for code 1, wrong for code 2, wrong for code 3]; the second hint is the reason shown.
// A spot row is [question, true step 1, true step 2, the false step 3, fix, index of the misconception it shows].
// oc is a letter or [story letter, spot letter, direct letter] to spread the official outcomes over the families.
export const S = (tag, sub, skill, codes, h, direct, story, spots, oc) => {
  const mc = (i) => `M_AG8_${codes[i]}`;
  const cases = (rows) => rows.map(([q, r, ...w]) => c(q, r, h[1], ...w.map((t, i) => [mc(i % codes.length), t])));
  const hint = { h, s1: h[0] };
  return [
    fam(`${tag}.direct`, `${sub}${skill}`, 'direct', 1, choose(cases(direct), hint), [].concat(oc || [])[2]),
    fam(`${tag}.story`, `${sub}${skill}`, 'word', 2, choose(cases(story), hint), [].concat(oc || [])[0]),
    fam(`${tag}.spot`, `${sub}${skill}`, 'spot', 3, spot(spots.map(([q, a, b, f, fix, i]) => sp(`${a} ${q}`, a, b, f, fix, mc(i))), hint), [].concat(oc || [])[1]),
  ];
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
