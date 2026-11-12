// ============================================================================
// ENGLISH GRADE 5 FAMILIES: the small kit eng_g5_*.js are written in.
// Authored offline, no model call. Every family is DRAFT: reviewed:false keeps it away from
// children until a Kenyan English teacher signs it off (docs/qa/english-g5-2026-11-12.md).
//
// One authored pool of items serves several families, each a different structure:
//   an item is [text, right, [wrong, 'M_CODE', why?], ..., because]
//   text  with ___   a sentence with a gap: choose it, type it, or find it wrong in a short note
//   text  ''         the options are whole sentences (punctuation): the stem asks which is right
//   text  without ___ a complete question (reference books, proverbs): choose it
//   right may be 'a|b': the first is shown, every one is accepted when typed
// A wrong answer carries the library misconception behind it; the child is told what the
// misconception is (feedback comes from the curriculum map, curriculum/english/g5.json).
// The checks are in engine/scripts/english_checks.mjs.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family } from './core.js';
import { SIGNED_ENGLISH } from './eng_signed.js';   // ids of English families a Kenyan English teacher has signed off
import { person } from './kenya.js';
import { SKILLS_E5, SUBSTRANDS_E5, MIS_FEEDBACK_E5, OUTCOMES_E5 } from '../curriculumMap.english.g5.js';

export { randInt, pick, person };
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// 'GRAMMA.T1.DEMONSTRATIVES' -> the full curriculum skill code.
export const skillCode = (cs) => {
  const [a, b, id] = cs.split('.');
  const hit = Object.keys(SKILLS_E5).filter(c => c.startsWith(`ENGL.G5.${a}.${b}_`) && c.endsWith(`.${id}`));
  if (hit.length !== 1) throw new Error(`no English Grade 5 skill ${cs}`);
  return hit[0];
};
// The letters of a skill's official outcomes, spread over n families: first, second (or first), third (or first).
export const outcomeLetters = (cs, n) => { const L = SKILLS_E5[skillCode(cs)].outcomes.map(o => o.split('.').pop()); return Array.from({ length: n }, (_, i) => L[i] || L[0]); };
// The child-facing feedback of a library misconception: the skill's own, else one in its sub-strand.
export const feedbackOf = (cskill, code) => {
  const own = MIS_FEEDBACK_E5[cskill]?.[code];
  if (own) return own;
  const sub = SKILLS_E5[cskill].sub;
  for (const [c, k] of Object.entries(SKILLS_E5)) if (k.sub === sub && MIS_FEEDBACK_E5[c]?.[code]) return MIS_FEEDBACK_E5[c][code];
  throw new Error(`${cskill}: no misconception ${code} in its sub-strand`);
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
  const k = SKILLS_E5[cskill];
  const letter = oc || k.outcomes[0].split('.').pop();
  const outcome = k.outcomes.find(o => o.endsWith(`.${letter}`));
  if (!outcome) throw new Error(`${d.id}: outcome ${letter} is not on ${cskill}`);
  const draw = () => { const x = gen(cskill); return x && x.options !== null ? x : null; };
  return family({ reviewed: SIGNED_ENGLISH.includes(d.id), draft: !SIGNED_ENGLISH.includes(d.id), subject: 'english', grade: 5, marker: 'text', ...rest, kind, skill: cskill, cskill, outcome, draw, make: x => x, check: () => true });
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
    instruction: 'Type your answer.', hints: [...hints, `The answer starts with "${it.right[0]}".`], steps: [it.because, `The answer is "${it.right}".`], chk: (a) => [it.right, ...it.alt].includes(String(a)) };
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
