// The family kit for Creative Arts and Sports Grade 9 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'CREA.G9.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.creativearts.g9.js';
import { SIGNED } from './creativearts_g9_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'creativearts', grade: 9, prefix: 'CREA', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});
export const fam = (tag, cs, form, rung, gen, oc) => sfam({ id: `creativearts9.${tag}`, cs, form, rung, gen, ...(oc ? { oc } : {}) });

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
