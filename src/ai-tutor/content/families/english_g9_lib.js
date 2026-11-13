// The family kit for English Grade 9 (shared kit: subject_kit.js). sfam({ id, cs, form, rung, gen }) builds a family;
// cs is the skill code without 'ENGL.G9.'. choose, typed and spot write the gen(): see subject_kit.js.
import { makeKit, pick, shuffle, tbl } from './subject_kit.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.english.g9.js';
import { SIGNED } from './english_g9_signed.js';

export { pick, shuffle, tbl };
export const { choose, typed, spot, sfam } = makeKit({
  subject: 'english', grade: 9, prefix: 'ENGL', signed: SIGNED,
  map: { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK },
});
export const fam = (tag, cs, form, rung, gen, oc, extra) => sfam({ id: `english9.${tag}`, cs, form, rung, gen, marker: 'text', ...(oc ? { oc } : {}), ...(extra || {}) });
export const m = (code, ...texts) => texts.map(t => [t, code]);
export const c = (q, right, why, ...groups) => [q, right, groups.flatMap(([code, ...t]) => m(code, ...t)), why];
export const sp = (q, a, b, f, fix, mis) => [q, [[a, true], [b, true], [f, false]], fix, mis];

// S(tag, 'SUB.', 'SKILL', ['SUFFIX', ...], [hint1, hint2], directRows, storyRows, spotRows, oc?)
// A direct or story row is [question, right, wrong for code 1, wrong for code 2, wrong for code 3]; the second hint is the reason shown.
// A spot row is [question, true step 1, true step 2, the false step 3, fix, index of the misconception it shows].
// oc is a letter or [story letter, spot letter, direct letter] to spread the official outcomes over the families.
export const S = (tag, sub, skill, codes, h, direct, story, spots, oc) => {
  const mc = (i) => `M_EN9_${codes[i]}`;
  const cases = (rows) => rows.map(([q, r, ...w]) => c(q, r, h[1], ...w.map((t, i) => [mc(i % codes.length), t])));
  const hint = { h, s1: h[0] };
  return [
    fam(`${tag}.direct`, `${sub}${skill}`, 'direct', 1, choose(cases(direct), hint), [].concat(oc || [])[2]),
    fam(`${tag}.story`, `${sub}${skill}`, 'word', 2, choose(cases(story), hint), [].concat(oc || [])[0]),
    fam(`${tag}.spot`, `${sub}${skill}`, 'spot', 3, spot(spots.map(([q, a, b, f, fix, i]) => sp(`${a} ${q}`, a, b, f, fix, mc(i))), hint), [].concat(oc || [])[1]),
  ];
};
