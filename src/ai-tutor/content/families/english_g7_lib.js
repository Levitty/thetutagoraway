// ============================================================================
// ENGLISH GRADE 6 FAMILIES: the small kit english_g7_*.js are written in (the Grade 5 kit, eng_lib.js, on the Grade 7 map).
// Authored offline, no model call. Every family is DRAFT: reviewed:false keeps it away from
// children until a Kenyan English teacher signs it off (docs/qa/english-g7-review-2026-11-13.md).
//
// One authored pool of items serves several families, each a different structure:
//   an item is [text, right, [wrong, 'M_CODE', why?], ..., because]
//   text  with ___   a sentence with a gap: choose it, type it, or find it wrong in a short note
//   text  ''         the options are whole sentences (punctuation): the stem asks which is right
//   text  without ___ a complete question (reference books, proverbs): choose it
//   right may be 'a|b': the first is shown, every one is accepted when typed
// A wrong answer carries the library misconception behind it; the child is told what the misconception is
// (feedback comes from the curriculum map, curriculum/english/g7.json).
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family } from './core.js';
import { SIGNED } from './english_g7_signed.js';   // ids of Grade 7 English families a Kenyan English teacher has signed off
import { person } from './kenya.js';
import { SKILLS, MIS_FEEDBACK, OUTCOMES } from '../curriculumMap.english.g7.js';

export { randInt, pick, person };
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// 'GRAMMA.T1.NOUN_TYPES' -> the full curriculum skill code.
export const skillCode = (cs) => {
  const [a, b, id] = cs.split('.');
  // 'GRAMMA.T1' = the sub-strand ENGL.G7.GRAMMA.T1_*; a longer key ('READIN.T4_INTENSIVE_READING_CL') names one of two sub-strands of a theme.
  const subOk = (c) => { const sub = c.slice(0, c.lastIndexOf('.')); const key = `ENGL.G7.${a}.${b}`; return sub === key || sub.startsWith(`${key}_`) || (b.includes('_') && sub.startsWith(key)); };
  const hit = Object.keys(SKILLS).filter(c => subOk(c) && c.endsWith(`.${id}`));
  if (hit.length !== 1) throw new Error(`no English Grade 7 skill ${cs}`);
  return hit[0];
};
// The letters of a skill's official outcomes, spread over n families: first, second (or first), third (or first).
export const outcomeLetters = (cs, n) => { const L = SKILLS[skillCode(cs)].outcomes.map(o => o.split('.').pop()); return Array.from({ length: n }, (_, i) => L[i] || L[0]); };
// The child-facing feedback of a library misconception.
export const feedbackOf = (cskill, code) => {
  const f = MIS_FEEDBACK[code];
  if (!f) throw new Error(`${cskill}: no misconception ${code}`);
  return f;
};
// A tap question: right text and wrongs [text, why, mis]. Null when two texts match.
export const mc = (right, wrongs) => {
  const texts = [String(right), ...wrongs.map(w => String(w[0]))];
  if (new Set(texts).size !== texts.length) return null;
  return shuffle([{ text: String(right), right: true }, ...wrongs.map(([text, why, mis]) => ({ text: String(text), right: false, why, mis }))]);
};

// ---- the family wrapper ----
export const eng = (d) => {
  const { cs, oc, gen, ...rest } = d;
  const cskill = skillCode(cs);
  const kind = d.kind || ({ choose: 'choose', gap: 'type', spot: 'spot' })[d.id.split('.').pop()];
  if (!kind) throw new Error(`${d.id}: needs a kind`);
  const k = SKILLS[cskill];
  const letter = oc || k.outcomes[0].split('.').pop();
  // one Grade 7 sub-strand (WRITIN.T11) has outcome codes .x1 .x2 .x3 for the letters a, b, c: match the code or the letter
  const outcome = k.outcomes.find(o => o.endsWith(`.${letter}`)) || k.outcomes.find(o => OUTCOMES[o]?.letter === letter);
  if (!outcome) throw new Error(`${d.id}: outcome ${letter} is not on ${cskill}`);
  const draw = () => { const x = gen(cskill); return x && x.options !== null ? x : null; };
  return family({ reviewed: SIGNED.includes(d.id), draft: !SIGNED.includes(d.id), subject: 'english', grade: 7, marker: 'text', ...rest, kind, skill: cskill, cskill, outcome, draw, make: x => x, check: () => true });
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

// ---- builders: each returns gen(cskill) for eng() ----
// choose: tap one of up to four options.
export const choose = (pool, { stem, hints, n = 3, instruction }) => (cskill) => {
  const list = items(cskill, pool), it = pick(list);
  const options = mc(it.right, shuffle(it.wrongs).slice(0, n).map(([w, code, why]) => [w, why, code]));
  if (!options) return null;
  return { question: asked(it, stem), options, instruction: instruction || 'Choose the best answer.', hints, steps: [it.because, `The answer is "${it.right}".`] };
};
// gap: type the missing word or words. Only for items with a gap.
export const gap = (pool, { stem, hints }) => (cskill) => {
  const list = items(cskill, pool.filter(it => blankOf(it[0]))), it = pick(list);
  const many = /\s/.test(it.right);
  return { question: `${stem.replace('{what}', many ? 'words' : 'word')} "${it.text}"`, answer: it.right, accepts: it.alt, wrong: it.wrongs.map(([w, code, why]) => [w, why, code]),
    instruction: 'Type your answer.', hints: [...hints, `The first letter is "${it.right[0]}".`], steps: [it.because, `The answer is "${it.right}".`], chk: (a) => [it.right, ...it.alt].includes(String(a)) };
};
// spot: a child's four sentences, one wrong.
export const spot = (pool, { topic, hints }) => (cskill) => {
  const list = items(cskill, pool.filter(it => it.length > 2));
  const four = shuffle(list).slice(0, 4);
  if (four.length < 4) return null;
  const badAt = randInt(0, 3), bad = four[badAt], [wrong, code] = pick(bad.wrongs);
  const say = (it, w) => (it.label ? `${it.label}: "${fillIn(it.text, w)}"` : fillIn(it.text, w));
  const working = four.map((it, i) => ({ text: say(it, i === badAt ? wrong : it.right), ok: i !== badAt }));
  const p = person();
  return { question: `${p.name} wrote four sentences ${topic}. One of them has a mistake.`, working, mis: [code],
    fix: `Step ${badAt + 1} has the mistake. ${feedbackOf(cskill, code)} ${bad.because}`, steps: [`The correct sentence is: ${say(bad, bad.right)}`], hints };
};
// One family from a pool, in one call.
export const make = (id, cs, form, rung, gen, extra = {}) => eng({ id, cs, form, rung, gen, ...extra });
