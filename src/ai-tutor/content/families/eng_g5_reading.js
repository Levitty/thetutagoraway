// ============================================================================
// ENGLISH GRADE 5, READING COMPREHENSION on original short passages (eng_g5_passages.js): DRAFT families.
// Each draw picks a passage and one of its authored questions. The passage rides on the problem as
// `passage: { title, text }` (a UI that shows it is still to be built before any family is switched on).
// Wrong answers carry the library misconception behind them; feedback comes from the curriculum map.
// Off for children (reviewed:false) until a Kenyan English teacher signs them off.
// ============================================================================
import { eng, mc, feedbackOf, shuffle, pick, randInt } from './eng_lib.js';
import { PASSAGES } from './eng_g5_passages.js';

const QTEXT = {
  ctx: (w) => `In the passage, what does the word "${w}" mean.`,
  ctxclue: (w) => `Which words in the passage help you to understand the word "${w}".`,
  clue: (p) => `Which sentence from the passage is the best clue for this prediction: "${p}".`,
  ttl: () => 'Which title best fits the passage.',
  sum: () => 'Which is the best summary of the passage.',
  infer2: () => 'Which of these can you work out from the passage, even though it is not written in it.',
};
const RAW_CODE = { ctxclue: 'M_CTX_WRONG_CLUE', clue: 'M_PRED_NO_CLUE' };
const LEAD_RIGHT = new Set(['ttl', 'sum', 'infer2']);   // [right, ...wrongs, because]: the question is fixed

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
const LISTY = new Set(['who', 'fact', 'tf', 'scan']);
const entriesOf = (key) => PASSAGES.flatMap(p => (p[key] ? (LISTY.has(key) ? p[key] : [p[key]]).map(e => ({ p, e })) : []));
const showP = (p) => ({ title: p.title, text: p.text });

const optionsOf = (cskill, n, wrongs, right) => mc(right, shuffle(wrongs).slice(0, 3).map(([t, code]) => [t, feedbackOf(cskill, code), code]));
// A passage question to choose.
const passChoose = (key, { hints, typedOnly = false }) => (cskill) => {
  const { p, e } = pick(entriesOf(key).filter(x => !typedOnly || norm(key, x.e).flags.t));
  const n = norm(key, e), options = optionsOf(cskill, 3, n.wrongs, n.right.split('|')[0]);
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
// Put four events in order: options are lists of letters.
const orderGen = (cskill) => {
  const p = pick(PASSAGES.filter(x => x.order));
  const ev = p.order;
  let show; do { show = shuffle(ev.map((t, i) => i)); } while (show.every((v, i) => v === i));
  const letter = (idx) => 'ABCD'[show.indexOf(idx)];
  const seq = (arr) => arr.map(letter).join(', ');
  const base = [0, 1, 2, 3];
  const right = seq(base), reversed = seq([...base].reverse());
  const i = randInt(0, 2), sw = [...base]; [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
  const rot = seq([3, 0, 1, 2]);
  const options = mc(right, [[reversed, feedbackOf(cskill, 'M_ELEM_ORDER_REVERSED'), 'M_ELEM_ORDER_REVERSED'], [seq(sw), feedbackOf(cskill, 'M_ELEM_ORDER_SWAPPED'), 'M_ELEM_ORDER_SWAPPED'], [rot, feedbackOf(cskill, 'M_ELEM_ORDER_REVERSED'), 'M_ELEM_ORDER_REVERSED']]);
  if (!options) return null;
  const list = show.map((idx, k) => `${'ABCD'[k]} ${ev[idx]}`).join(' ');
  return { passage: showP(p), question: `These four events from the story are mixed up. Which list shows the order in which they happened. ${list}`, options, fixedOrder: false, instruction: 'Read the passage. Then choose the best answer.',
    hints: ['Find the first event in the passage, then the next, and so on.', 'Look for time words such as then, after, later and soon.'], steps: [`In the story the events happen in this order: ${ev.map((t, k) => `${k + 1}. ${t}`).join(' ')}`, `Written as letters this is ${right}.`], chk: () => seq(base) === right };
};

const H = (a, b) => [a, b];
export const FAMILIES = [
  eng({ id: 'eng5.elem.choose', cs: 'READIN.T2.STORY_ELEMENTS', oc: 'a', form: 'word', rung: 1, gen: passChoose('who', { hints: H('Find the sentence in the passage that names the person or place.', 'A character is a person or animal that acts. A place is where the story happens.') }) }),
  eng({ id: 'eng5.elem.type', kind: 'type-short', cs: 'READIN.T2.STORY_ELEMENTS', oc: 'a', form: 'word', rung: 2, gen: passType('who', { hints: H('Find the sentence in the passage that names the person.', 'Write only the name or the short answer.') }) }),
  eng({ id: 'eng5.elem.order', kind: 'order-events', cs: 'READIN.T2.STORY_ELEMENTS', oc: 'a', form: 'steps', rung: 2, gen: orderGen }),
  eng({ id: 'eng5.predict.choose', kind: 'choose-prediction', cs: 'READIN.T2.PREDICT', oc: 'b', form: 'word', rung: 2, gen: passChoose('predict', { hints: H('Read the last lines again. Which clue points to what comes next?', 'A good prediction is not told yet, and does not go against the story.') }) }),
  eng({ id: 'eng5.predict.clue', kind: 'choose-clue', cs: 'READIN.T2.PREDICT', oc: 'b', form: 'why', rung: 3, gen: passChoose('clue', { hints: H('A clue is a sentence from the passage that points to the prediction.', 'Ask: which sentence makes this prediction likely?') }) }),
  eng({ id: 'eng5.fact.choose', cs: 'READIN.T2.FACTUAL_QUESTIONS', oc: 'c', form: 'word', rung: 1, gen: passChoose('fact', { hints: H('The answer is written in the passage. Find the sentence that answers the question.', 'Check that your answer matches what the question asks, not just a word in it.') }) }),
  eng({ id: 'eng5.fact.type', kind: 'type-short', cs: 'READIN.T2.FACTUAL_QUESTIONS', oc: 'c', form: 'word', rung: 2, gen: passType('fact', { hints: H('The answer is written in the passage. Find the sentence that answers the question.', 'Write only the short answer.') }) }),
  eng({ id: 'eng5.fact.tfn', kind: 'true-false-not-stated', cs: 'READIN.T2.FACTUAL_QUESTIONS', oc: 'c', form: 'word', rung: 2, gen: tfn({ hints: H('Find the sentence in the passage about this. Does it say the same, say something different, or say nothing?', 'True: the passage says it. False: the passage says something different. Not stated: the passage does not say.') }) }),
  eng({ id: 'eng5.infer.choose', cs: 'READIN.T2.INFERENCE_QUESTIONS', oc: 'c', form: 'why', rung: 2, gen: passChoose('infer', { hints: H('The passage does not say the answer outright. Look for clues.', 'Ask: what do the clues in the passage show?') }) }),
  eng({ id: 'eng5.infer.worked-out', kind: 'choose-inference', cs: 'READIN.T2.INFERENCE_QUESTIONS', oc: 'c', form: 'why', rung: 3, gen: passChoose('infer2', { hints: H('Something worked out is not written in the passage, but the clues show it.', 'A sentence copied from the passage is stated, not worked out. A claim the passage goes against, or has no clue for, is not a good inference.') }) }),
  eng({ id: 'eng5.ctx.meaning', kind: 'choose-meaning', cs: 'READIN.T2.CONTEXT_CLUES', oc: 'd', form: 'word', rung: 2, gen: passChoose('ctx', { hints: H('Read the sentence with the word, and the sentences around it.', 'Try each meaning in place of the word. Which one fits?') }) }),
  eng({ id: 'eng5.ctx.clue', kind: 'choose-clue', cs: 'READIN.T2.CONTEXT_CLUES', oc: 'd', form: 'why', rung: 3, gen: passChoose('ctxclue', { hints: H('A clue is a group of words that tells more about the hard word.', 'Ask: which words explain what the word means?') }) }),
  eng({ id: 'eng5.main.idea', kind: 'choose-main-idea', cs: 'READIN.T9.MAIN_IDEA', oc: 'a', form: 'word', rung: 2, gen: passChoose('main', { hints: H('The main idea covers the whole passage, not just one part.', 'Ask: what is every paragraph mostly about?') }) }),
  eng({ id: 'eng5.main.title', kind: 'choose-title', cs: 'READIN.T9.MAIN_IDEA', oc: 'a', form: 'word', rung: 2, gen: passChoose('ttl', { hints: H('A good title tells what the whole passage is about.', 'A title that names only a detail, or something not in the passage, is not the best.') }) }),
  eng({ id: 'eng5.sum.best', kind: 'choose-summary', cs: 'READIN.T9.SUMMARISE', oc: 'c', form: 'word', rung: 3, gen: passChoose('sum', { hints: H('A summary is short and keeps the main points in order.', 'Leave out small details and your own opinion.') }) }),
  eng({ id: 'eng5.sum.leave', kind: 'choose-detail', cs: 'READIN.T9.SUMMARISE', oc: 'c', form: 'word', rung: 3, gen: passChoose('leave', { hints: H('A main point tells what happens or what the passage is about.', 'A small detail adds colour but the story still makes sense without it.') }) }),
  eng({ id: 'eng5.scan.choose', kind: 'choose-scan', cs: 'READIN.T5.SCAN_SKIM', oc: 'b', form: 'word', rung: 1, gen: passChoose('scan', { hints: H('Look for the key word of the question, then read only that line.', 'Do not read every word. Scan for the number, time or name you need.') }) }),
  eng({ id: 'eng5.scan.type', kind: 'type-scan', cs: 'READIN.T5.SCAN_SKIM', oc: 'b', form: 'word', rung: 2, gen: passType('scan', { hints: H('Look for the key word of the question, then read only that line.', 'Write the detail exactly as it appears.') }) }),
  eng({ id: 'eng5.skim.gist', kind: 'choose-gist', cs: 'READIN.T5.SCAN_SKIM', oc: 'c', form: 'word', rung: 1, gen: passChoose('skim', { hints: H('Read the title and the first lines quickly.', 'Ask: what is the whole text about, not just one detail?') }) }),
];
