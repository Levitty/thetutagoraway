// ============================================================================
// KISWAHILI GRADE 5 FAMILIES: the small kit kiswahili_g5_*.js are written in (modelled on eng_lib.js).
// Authored offline, no model call. Every family is DRAFT: reviewed:false keeps it away from children until
// a native Kiswahili teacher signs it off (docs/qa/kiswahili-g5-review-2026-11-12.md). Every family carries
// native: true, because every item is in Kiswahili sanifu and needs a native speaker's check.
//
// One authored pool of items serves several families, each a different structure:
//   an item is [text, right, [wrong, 'M_CODE', why?], ..., because]
//   text  with ___    a sentence with a gap: choose it, type it, or find it wrong in a short note
//   text  ''          the options are whole sentences: the stem asks which is right
//   text  without ___ a complete question (meanings, parts, kinds of text): choose it
//   right may be 'a|b': the first is shown, every one is accepted when typed
// A wrong answer carries the library misconception behind it; the child is told what the misconception is
// (the line comes from the curriculum map, curriculum/kiswahili/g5.json). The child's instructions are in Kiswahili.
// Answers are marked as words by answerCheckText.js (marker: 'text'): exact words, apart from capital letters.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family } from './core.js';
import { SIGNED } from './kiswahili_g5_signed.js';
import { person } from './kenya.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../curriculumMap.kiswahili.g5.js';

export { randInt, pick, person };
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// 'SARUFI.T1_AINA_ZA_NOMINO.PEKEE' -> 'KISW.G5.SARUFI.T1_AINA_ZA_NOMINO.PEKEE' (checked against the map).
export const skillCode = (cs) => {
  const code = `KISW.G5.${cs}`;
  if (!SKILLS[code]) throw new Error(`no Kiswahili Grade 5 skill ${cs}`);
  return code;
};
// The letters of a skill's own official outcomes (those in its own sub-strand first), spread over n families.
export const outcomeLetters = (cs, n) => {
  const k = SKILLS[skillCode(cs)];
  const L = k.outcomes.filter(o => o.startsWith(`${k.sub}.`)).map(o => o.split('.').pop());
  return Array.from({ length: n }, (_, i) => L[i] || L[0]);
};
// The child-facing line of a library misconception (map.misFeedback is flat: short code -> line).
export const feedbackOf = (cskill, code) => {
  const f = MIS_FEEDBACK[code];
  if (!f || !SKILLS[cskill].mis.includes(code)) {
    // a misconception of another skill in the same sub-strand is allowed (the checks allow it)
    const sub = SKILLS[cskill].sub;
    const near = Object.values(SKILLS).some(k => k.sub === sub && k.mis.includes(code));
    if (!f || !near) throw new Error(`${cskill}: no misconception ${code} in its skill or sub-strand`);
  }
  return f;
};

// A tap question: right text and wrongs [text, why, mis]. Null when two texts match.
export const mc = (right, wrongs) => {
  const texts = [String(right), ...wrongs.map(w => String(w[0]))];
  if (new Set(texts).size !== texts.length) return null;
  return shuffle([{ text: String(right), right: true }, ...wrongs.map(([text, why, mis]) => ({ text: String(text), right: false, why, mis }))]);
};

// ---- the family wrapper ----
export const kw = (d) => {
  const { cs, oc, gen, ...rest } = d;
  const cskill = skillCode(cs);
  const kind = d.kind || ({ choose: 'choose', gap: 'type', spot: 'spot' })[d.id.split('.').pop()];
  if (!kind) throw new Error(`${d.id}: needs a kind`);
  const k = SKILLS[cskill];
  const letter = oc || k.outcomes[0].split('.').pop();
  const outcome = k.outcomes.find(o => o.endsWith(`.${letter}`) && o.startsWith(`${k.sub}.`)) || k.outcomes.find(o => o.endsWith(`.${letter}`));
  if (!outcome || !OUTCOMES[outcome]) throw new Error(`${d.id}: outcome ${letter} is not on ${cskill}`);
  const draw = () => { const x = gen(cskill); return x && x.options !== null ? x : null; };
  const reviewed = SIGNED.includes(d.id);
  return family({ reviewed, draft: !reviewed, native: true, subject: 'kiswahili', grade: 5, marker: 'text', ...rest, kind, skill: cskill, cskill, outcome, draw, make: x => x, check: () => true });
};

// ---- reading an item ----
const parse = (cskill, it) => {
  const last = it[it.length - 1];
  const because = typeof last === 'string' && it.length > 2 ? last : '';
  const wrongs = it.slice(2).filter(Array.isArray).map(([w, code, why]) => [w, code, why || feedbackOf(cskill, code)]);
  const rights = String(it[1]).split('|');
  if (!because) throw new Error(`item "${it[0]}" has no because`);
  return { text: it[0], right: rights[0], alt: rights.slice(1), wrongs, because, label: it.label };
};
export const items = (cskill, pool) => pool.map(it => parse(cskill, it));
const blankOf = (t) => t.includes('___');
export const fillIn = (text, w) => (blankOf(text) ? text.replace('___', w) : w);
const asked = (it, stem) => (it.text === '' ? stem : blankOf(it.text) ? `${stem} "${it.text}"` : it.text);

export const STEM = {
  word: 'Chagua neno linalokamilisha sentensi.',
  sentence: 'Chagua sentensi iliyo sahihi.',
};
// ---- builders: each returns gen(cskill) for kw() ----
// choose: tap one of up to four options.
export const choose = (pool, { stem = STEM.word, hints, n = 3, instruction }) => (cskill) => {
  const list = items(cskill, pool), it = pick(list);
  const options = mc(it.right, shuffle(it.wrongs).slice(0, n).map(([w, code, why]) => [w, why, code]));
  if (!options) return null;
  return { question: asked(it, stem), options, instruction: instruction || 'Chagua jibu sahihi.', hints, steps: [it.because, `Jibu ni "${it.right}".`] };
};
// gap: type the missing word or words. Only for items with a gap.
export const gap = (pool, { stem = 'Andika neno linalokosekana katika sentensi hii:', hints }) => (cskill) => {
  const list = items(cskill, pool.filter(it => blankOf(it[0]))), it = pick(list);
  return { question: `${stem} "${it.text}"`, answer: it.right, accepts: it.alt, wrong: it.wrongs.map(([w, code, why]) => [w, why, code]),
    instruction: 'Andika jibu lako.', hints: [...hints, `Jibu linaanza na herufi "${it.right[0]}".`], steps: [it.because, `Jibu ni "${it.right}".`], chk: (a) => [it.right, ...it.alt].includes(String(a)) };
};
// spot: a child's four sentences, one wrong.
export const spot = (pool, { topic, hints }) => (cskill) => {
  const list = items(cskill, pool.filter(it => it.length > 2));
  const four = shuffle(list).slice(0, 4);
  if (four.length < 4) return null;
  const badAt = randInt(0, 3), bad = four[badAt], [wrong, code] = pick(bad.wrongs);
  const say = (it, w) => (it.label ? `${it.label}: "${fillIn(it.text, w)}"` : fillIn(it.text, w));
  const working = four.map((it, i) => ({ text: say(it, i === badAt ? wrong : it.right), ok: i !== badAt }));
  if (new Set(working.map(w => w.text)).size !== 4) return null;
  const p = person();
  return { question: `${p.name} aliandika sentensi nne ${topic}. Moja ina kosa.`, working, mis: [code],
    fix: `Kosa liko katika Hatua ya ${badAt + 1}, yaani sentensi ya ${badAt + 1}. ${feedbackOf(cskill, code)} ${bad.because}`, steps: [`Sentensi sahihi ni: ${say(bad, bad.right)}`], hints };
};
// One family from a pool, in one call.
export const make = (id, cs, form, rung, gen, extra = {}) => kw({ id, cs, form, rung, gen, ...extra });

// Three families from one pool: choose, type the gap, find the mistake in a child's four sentences.
// tag: when a skill has two pools (two different ways of asking), the second pool's families get a tag so their structures differ.
const kindOf = (name, tag) => (tag ? `${name}-${tag}` : ({ choose: 'choose', gap: 'type', spot: 'spot' })[name]);
export const trio = (key, cs, pool, { stem = STEM.word, hints, topic, rungs = [1, 2, 3], thinOk = false, oc = outcomeLetters(cs, 3), gapStem, tag }) => [
  kw({ id: `kiswahili5.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: rungs[0], kind: kindOf('choose', tag), gen: choose(pool, { stem, hints }) }),
  kw({ id: `kiswahili5.${key}.gap`, cs, oc: oc[1], form: 'direct', rung: rungs[1], thinOk, kind: kindOf('gap', tag), gen: gap(pool, { ...(gapStem ? { stem: gapStem } : {}), hints }) }),
  kw({ id: `kiswahili5.${key}.spot`, cs, oc: oc[2], form: 'spot', rung: rungs[2], kind: kindOf('spot', tag), gen: spot(pool, { topic, hints }) }),
];
// Whole-sentence or whole-question pools (no gap): choose and find the mistake only.
export const duo = (key, cs, pool, { stem = STEM.sentence, hints, topic, oc = outcomeLetters(cs, 2), tag }) => [
  kw({ id: `kiswahili5.${key}.choose`, cs, oc: oc[0], form: 'direct', rung: 1, kind: kindOf('choose', tag), gen: choose(pool, { stem, hints }) }),
  kw({ id: `kiswahili5.${key}.spot`, cs, oc: oc[1], form: 'spot', rung: 3, kind: kindOf('spot', tag), gen: spot(pool, { topic, hints }) }),
];
// One tap family from a pool.
export const one = (key, cs, pool, { stem = STEM.word, hints, oc, rung = 1, tag, n = 3 }) => [
  kw({ id: `kiswahili5.${key}.choose`, cs, oc: oc || outcomeLetters(cs, 1)[0], form: 'direct', rung, kind: kindOf('choose', tag), gen: choose(pool, { stem, hints, n }) }),
];
