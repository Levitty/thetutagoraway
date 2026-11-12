// ============================================================================
// ENGLISH GRADE 4, READING COMPREHENSION on original short passages (english_g4_passages.js): DRAFT families.
// Each draw picks a passage and one of its authored questions. The passage rides on the problem as
// `passage: { title, text }` (a UI that shows it is still to be built before any family is switched on).
// Wrong answers carry the library misconception behind them; feedback comes from the curriculum map.
// Off for children (reviewed:false) until a Kenyan English teacher signs them off.
// ============================================================================
import { eng, mc, feedbackOf, shuffle, pick } from './english_g4_lib.js';
import { PASSAGES, VISUALS } from './english_g4_passages.js';

const id = (k, s) => `english4.${k}.${s}`;
const QTEXT = {
  ctx: (w) => `In the passage, what does the word "${w}" mean.`,
  ctxclue: (w) => `Which words in the passage help you to understand the word "${w}".`,
  infer2: () => 'Which of these can you work out from the passage, even though it is not written in it.',
};
const RAW_CODE = { ctxclue: 'M_CTX_WRONG_CLUE' };
const LEAD_RIGHT = new Set(['infer2']);   // [right, ...wrongs, because]: the question is fixed

// An authored entry -> { q, right, wrongs: [[text, code]], because, flags }
const norm = (key, e) => {
  const a = [...e];
  const flags = a.length && !Array.isArray(a[a.length - 1]) && typeof a[a.length - 1] === 'object' ? a.pop() : {};
  const because = a.pop();
  if (key === 'ctx') return { q: QTEXT.ctx(a[0]), right: a[1], wrongs: a.slice(2), because, flags };
  if (RAW_CODE[key]) return { q: QTEXT[key](a[0]), right: a[1], wrongs: a.slice(2).map(t => [t, RAW_CODE[key]]), because, flags };
  if (LEAD_RIGHT.has(key)) return { q: QTEXT[key](), right: a[0], wrongs: a.slice(1), because, flags };
  return { q: a[0], right: a[1], wrongs: a.slice(2), because, flags };
};
const LISTY = new Set(['fact', 'tf', 'scan']);
const entriesOf = (key) => PASSAGES.flatMap(p => (p[key] ? (LISTY.has(key) ? p[key] : [p[key]]).map(e => ({ p, e })) : []));
const showP = (p) => ({ title: p.title, text: p.text });

const optionsOf = (cskill, wrongs, right) => mc(right, shuffle(wrongs).slice(0, 3).map(([t, code]) => [t, feedbackOf(cskill, code), code]));
// A passage question to choose.
const passChoose = (key, { hints }) => (cskill) => {
  const { p, e } = pick(entriesOf(key));
  const n = norm(key, e), options = optionsOf(cskill, n.wrongs, n.right.split('|')[0]);
  if (!options) return null;
  return { passage: showP(p), question: n.q, options, instruction: 'Read the passage. Then choose the best answer.', hints, steps: [n.because, `The answer is "${n.right.split('|')[0]}".`] };
};
// A short answer to type (entries flagged t:1), the other answers named as mistakes.
const passType = (key, { hints }) => (cskill) => {
  const { p, e } = pick(entriesOf(key).filter(x => norm(key, x.e).flags.t));
  const n = norm(key, e), [shown, ...alt] = n.right.split('|');
  return { passage: showP(p), question: n.q, answer: shown, accepts: alt, wrong: n.wrongs.map(([t, code]) => [t, feedbackOf(cskill, code), code]), instruction: 'Read the passage. Then type a short answer.', hints: [...hints, `The answer starts with "${shown[0]}".`], steps: [n.because, `The answer is "${shown}".`], chk: (a) => [shown, ...alt].includes(String(a)) };
};
// True, false or not stated.
const TF_WRONG = { True: [['False', 'M_FACT_MISSES_STATED'], ['Not stated', 'M_FACT_MISSES_STATED']], False: [['True', 'M_FACT_FALSE_AS_TRUE'], ['Not stated', 'M_FACT_FALSE_AS_NOT_STATED']], 'Not stated': [['True', 'M_FACT_NOT_STATED_AS_TRUE'], ['False', 'M_FACT_NOT_STATED_AS_TRUE']] };
const tfn = ({ hints }) => (cskill) => {
  const { p, e } = pick(entriesOf('tf'));
  const [statement, ans, because] = e;
  const options = mc(ans, TF_WRONG[ans].map(([t, code]) => [t, feedbackOf(cskill, code), code]));
  if (!options) return null;
  return { passage: showP(p), question: `Is this true, false or not stated in the passage: "${statement}"`, options, fixedOrder: true, instruction: 'Read the passage. Then choose the best answer.', hints, steps: [because, `The answer is "${ans}".`] };
};

// A notice, timetable or poster written in words and numbers.
const visual = (kind, { hints }) => (cskill) => {
  const v = pick(VISUALS);
  const e = kind === 'purpose' ? v.purpose : pick(v.q.filter(x => kind !== 'type' || (x[x.length - 1] && x[x.length - 1].t)));
  const n = norm('vis', e);
  if (kind === 'type') {
    const [shown, ...alt] = n.right.split('|');
    return { passage: { title: v.title, text: v.text }, question: n.q, answer: shown, accepts: alt, wrong: n.wrongs.map(([t, code]) => [t, feedbackOf(cskill, code), code]), instruction: 'Read the notice. Then type a short answer.', hints: [...hints, `The answer starts with "${shown[0]}".`], steps: [n.because, `The answer is "${shown}".`], chk: (a) => [shown, ...alt].includes(String(a)) };
  }
  const options = optionsOf(cskill, n.wrongs, n.right.split('|')[0]);
  if (!options) return null;
  return { passage: { title: v.title, text: v.text }, question: n.q, options, instruction: 'Read the notice. Then choose the best answer.', hints, steps: [n.because, `The answer is "${n.right.split('|')[0]}".`] };
};

const H = (a, b) => [a, b];
export const FAMILIES = [
  eng({ id: id('fact', 'choose'), cs: 'READIN.T2.FACTUAL_QUESTIONS', oc: 'b', form: 'word', rung: 1, gen: passChoose('fact', { hints: H('The answer is written in the passage. Find the sentence that answers the question.', 'Check that your answer matches what the question asks, not just a word in it.') }) }),
  eng({ id: id('fact', 'type'), kind: 'type-short', cs: 'READIN.T2.FACTUAL_QUESTIONS', oc: 'b', form: 'word', rung: 2, gen: passType('fact', { hints: H('The answer is written in the passage. Find the sentence that answers the question.', 'Write only the short answer.') }) }),
  eng({ id: id('fact', 'tfn'), kind: 'true-false-not-stated', cs: 'READIN.T2.FACTUAL_QUESTIONS', oc: 'b', form: 'word', rung: 2, gen: tfn({ hints: H('Find the sentence in the passage about this. Does it say the same, say something different, or say nothing?', 'True: the passage says it. False: the passage says something different. Not stated: the passage does not say.') }) }),
  eng({ id: id('infer', 'choose'), cs: 'READIN.T2.INFERENCE_QUESTIONS', oc: 'b', form: 'why', rung: 2, gen: passChoose('infer', { hints: H('The passage does not say the answer outright. Look for clues.', 'Ask: what do the clues in the passage show?') }) }),
  eng({ id: id('infer', 'worked-out'), kind: 'choose-inference', cs: 'READIN.T2.INFERENCE_QUESTIONS', oc: 'b', form: 'why', rung: 3, gen: passChoose('infer2', { hints: H('Something worked out is not written in the passage, but the clues show it.', 'A sentence copied from the passage is stated, not worked out. A claim the passage goes against, or has no clue for, is not a good inference.') }) }),
  eng({ id: id('ctx', 'meaning'), kind: 'choose-meaning', cs: 'READIN.T2.CONTEXT_CLUES', oc: 'b', form: 'word', rung: 2, gen: passChoose('ctx', { hints: H('Read the sentence with the word, and the sentences around it.', 'Try each meaning in place of the word. Which one fits?') }) }),
  eng({ id: id('ctx', 'clue'), kind: 'choose-clue', cs: 'READIN.T2.CONTEXT_CLUES', oc: 'b', form: 'why', rung: 3, gen: passChoose('ctxclue', { hints: H('A clue is a group of words that tells more about the hard word.', 'Ask: which words explain what the word means?') }) }),
  eng({ id: id('visual', 'choose'), kind: 'choose-detail', cs: 'READIN.T4.VISUALS', oc: 'a', form: 'word', rung: 1, gen: visual('choose', { hints: H('Find the line that answers the question.', 'Read across the line to the time, price or name you need.') }) }),
  eng({ id: id('visual', 'type'), kind: 'type-short', cs: 'READIN.T4.VISUALS', oc: 'a', form: 'word', rung: 2, gen: visual('type', { hints: H('Find the line that answers the question.', 'Write the detail exactly as it appears.') }) }),
  eng({ id: id('visual', 'purpose'), kind: 'choose-purpose', cs: 'READIN.T4.VISUALS', oc: 'b', form: 'why', rung: 2, gen: visual('purpose', { hints: H('Read the title and the first line.', 'Ask: why was this written, and who will use it?') }) }),
  eng({ id: id('scan', 'choose'), kind: 'choose-scan', cs: 'READIN.T5.SCAN_FOR_DETAIL', oc: 'c', form: 'word', rung: 1, gen: passChoose('scan', { hints: H('Look for the key word of the question, then read only that line.', 'Do not read every word. Scan for the number, time or name you need.') }) }),
  eng({ id: id('scan', 'type'), kind: 'type-scan', cs: 'READIN.T5.SCAN_FOR_DETAIL', oc: 'c', form: 'word', rung: 2, gen: passType('scan', { hints: H('Look for the key word of the question, then read only that line.', 'Write the detail exactly as it appears.') }) }),
];
