// ============================================================================
// ENGLISH GRADE 7, READING COMPREHENSION on original short passages and poems (english_g7_passages.js): DRAFT families.
// Each draw picks a passage and one of its authored questions. The passage rides on the problem as
// `passage: { title, text }` (a UI that shows it is still to be built before any family is switched on).
// Wrong answers carry the library misconception behind them; feedback comes from the curriculum map.
// Off for children (reviewed:false) until a Kenyan English teacher signs them off.
// ============================================================================
import { eng, choose, mc, feedbackOf, shuffle, pick, randInt, outcomeLetters } from './english_g7_lib.js';
import { PASSAGES } from './english_g7_passages.js';

const QTEXT = {
  ctx: (w) => `In the passage, what does the word "${w}" mean.`,
  ctxclue: (w) => `Which words in the passage help you to understand the word "${w}".`,
  clue: (p) => `Which sentence from the passage is the best clue for this prediction: "${p}".`,
  ttl: () => 'Which title best fits the passage.',
  sum: () => 'Which is the best summary of the passage.',
  infer2: () => 'Which of these can you work out from the passage, even though it is not written in it.',
};
const RAW_CODE = { ctxclue: 'M7_CX_WRONG_CLUE', clue: 'M7_PD_WRONG_CLUE' };
const LEAD_RIGHT = new Set(['ttl', 'sum', 'infer2']);   // [right, ...wrongs, because]: the question is fixed
const LISTY = new Set(['who', 'minor', 'hero', 'fact', 'tf', 'detail', 'img', 'imgline', 'keyidea', 'rhyme', 'repeat', 'stanza', 'subj', 'msg', 'pline']);

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
const TF_WRONG = { True: [['False', 'M7_FQ_MISSES_STATED'], ['Not stated', 'M7_FQ_MISSES_STATED']], False: [['True', 'M7_FQ_FALSE_AS_TRUE'], ['Not stated', 'M7_FQ_FALSE_AS_NOT_STATED']], 'Not stated': [['True', 'M7_FQ_NOT_STATED_AS_TRUE'], ['False', 'M7_FQ_NOT_STATED_AS_TRUE']] };
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
  const right = seq(base);
  const i = randInt(0, 2), sw = [...base]; [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
  const options = mc(right, [[seq([...base].reverse()), feedbackOf(cskill, 'M7_SO_REVERSED'), 'M7_SO_REVERSED'], [seq(sw), feedbackOf(cskill, 'M7_SO_SWAPPED'), 'M7_SO_SWAPPED'], [seq([3, 0, 1, 2]), feedbackOf(cskill, 'M7_SO_ROTATED'), 'M7_SO_ROTATED']]);
  if (!options) return null;
  const list = show.map((idx, k) => `${'ABCD'[k]} ${ev[idx]}`).join(' ');
  return { passage: showP(p), question: `These four events from the story are mixed up. Which list shows the order in which they happened. ${list}`, options, fixedOrder: false, instruction: 'Read the passage. Then choose the best answer.',
    hints: ['Find the first event in the passage, then the next, and so on.', 'Look for time words such as then, after, later and soon.'], steps: [`In the story the events happen in this order: ${ev.map((t, k) => `${k + 1}. ${t}`).join(' ')}`, `Written as letters this is ${right}.`], chk: () => true };
};
// Which event came first or last: made from the order of events of each passage.
const firstLast = (which, { hints }) => (cskill) => {
  const p = pick(PASSAGES.filter(x => x.order)), ev = p.order;
  const right = which === 'first' ? ev[0] : ev[3];
  const wrongs = which === 'first' ? [[ev[3], 'M7_SO_REVERSED'], [ev[1], 'M7_SO_SWAPPED'], [ev[2], 'M7_SO_ROTATED']] : [[ev[0], 'M7_SO_REVERSED'], [ev[2], 'M7_SO_SWAPPED'], [ev[1], 'M7_SO_ROTATED']];
  const options = mc(right, wrongs.map(([t, code]) => [t, feedbackOf(cskill, code), code]));
  if (!options) return null;
  return { passage: showP(p), question: `Which of these events happened ${which === 'first' ? 'first' : 'last'} in the story.`, options, instruction: 'Read the passage. Then choose the best answer.', hints, steps: [`In the story the events happen in this order: ${ev.map((t, k) => `${k + 1}. ${t}`).join(' ')}`, `The answer is "${right}".`] };
};
// Poem or prose: a small pool.
const I = (text, right, wrongs, because) => [text, right, ...wrongs, because];
const PF = [
  I('Which of these is a poem.', 'Sun on the hills, sun on the river, / light in the morning, light for ever.', [['Our class went to the farm. We saw cows and goats.', 'M7_PST_PROSE'], ['The market opens at six. Traders arrive early.', 'M7_PST_PROSE'], ['Please bring a pen and a ruler on Monday.', 'M7_PST_PROSE']], 'A poem is set in short lines with rhythm and rhyme. The others are sentences in prose.'),
  I('Which of these is written in prose.', 'The children walked to school and talked about the football match.', [['Rain on the roof, rain on the road, / rain on the old man\'s load.', 'M7_PST_PROSE'], ['Hear the drum, hear the song, / dance all day, dance along.', 'M7_PST_PROSE'], ['Moon in the sky, stars so bright, / shine on me through the night.', 'M7_PST_PROSE']], 'Prose is written in ordinary sentences. The others are short lines with rhyme, so they are poems.'),
  I('Which of these is a poem.', 'Hear the drum, hear the song, / dance all day, dance along.', [['Mama bought rice and sugar at the market.', 'M7_PST_PROSE'], ['The bus leaves at six and arrives at noon.', 'M7_PST_PROSE'], ['Learners must wear their uniform every day.', 'M7_PST_PROSE']], 'A poem has short lines that rhyme: song and along.'),
  I('Which of these is written in prose.', 'Atieno opened the door and saw her grandmother waiting.', [['Moon in the sky, stars so bright, / shine on me through the night.', 'M7_PST_PROSE'], ['Rain on the roof, rain on the road, / rain on the old man\'s load.', 'M7_PST_PROSE'], ['Hear the drum, hear the song, / dance all day, dance along.', 'M7_PST_PROSE']], 'It is an ordinary sentence in prose. The others have short lines that rhyme.'),
  I('Which of these is a poem.', 'Moon in the sky, stars so bright, / shine on me through the night.', [['The moon rose slowly over the hills.', 'M7_PST_PROSE'], ['Kamau is tired because he walked far.', 'M7_PST_PROSE'], ['The shop sells bread and milk.', 'M7_PST_PROSE']], 'A poem has short lines with a rhyme: bright and night.'),
  I('Which of these is a poem.', 'Rain on the roof, rain on the road, / rain on the old man\'s load.', [['The rain stopped before noon.', 'M7_PST_PROSE'], ['The old man carried a heavy load.', 'M7_PST_PROSE'], ['It rained on Saturday.', 'M7_PST_PROSE']], 'A poem has short lines, repeated words and a rhyme: road and load.'),
];
const pfGen = (hints) => choose(PF, { stem: 'Choose.', hints });

const H = (a, b) => [a, b];
const E = (id, kind, cs, oc, form, rung, gen) => eng({ id: `english7.${id}`, kind, cs, oc, form, rung, gen });
export const FAMILIES = [
  // character roles, traits, predictions
  E('roles.main', 'choose-main-character', 'READIN.T4_INTENSIVE_READING_CL.CHARACTER_ROLES', 'a', 'word', 1, passChoose('who', { hints: H('The main character is the one the story is mostly about.', 'A character is a person or an animal that acts. A place is the setting.') })),
  E('roles.type', 'type-short', 'READIN.T4_INTENSIVE_READING_CL.CHARACTER_ROLES', 'a', 'word', 2, passType('who', { hints: H('Find the character who does most in the story.', 'Write only the name.') })),
  E('roles.minor', 'choose-minor-character', 'READIN.T4_INTENSIVE_READING_CL.CHARACTER_ROLES', 'b', 'why', 2, passChoose('minor', { hints: H('A minor character helps the story but does not play the main part.', 'The main character is not a minor one.') })),
  E('trait.choose', 'choose-trait', 'READIN.T4_INTENSIVE_READING_CL.CHARACTER_TRAITS', 'b', 'why', 2, passChoose('char', { hints: H('Look at what the character says and does.', 'The trait must match the actions, not just the name.') })),
  E('trait.evidence', 'choose-evidence', 'READIN.T4_INTENSIVE_READING_CL.CHARACTER_TRAITS', 'b', 'why', 3, passChoose('charev', { hints: H('Evidence is something the character does or says that shows the trait.', 'A line about where the character lives or what time it is does not show a trait.') })),
  E('predict.choose', 'choose-prediction', 'READIN.T4_INTENSIVE_READING_CL.PREDICT', 'c', 'word', 2, passChoose('predict', { hints: H('Read the last lines again. Which clue points to what comes next?', 'A good prediction is not told yet, and does not go against the story.') })),
  E('predict.clue', 'choose-clue', 'READIN.T4_INTENSIVE_READING_CL.PREDICT', 'c', 'why', 3, passChoose('clue', { hints: H('A clue is a sentence from the passage that points to the prediction.', 'Ask: which sentence makes this prediction likely?') })),
  // order of events
  E('order.events', 'order-events', 'READIN.T9_INTENSIVE.STORY_ORDER', 'a', 'steps', 2, orderGen),
  E('order.first', 'first-event', 'READIN.T9_INTENSIVE.STORY_ORDER', 'a', 'word', 1, firstLast('first', { hints: H('The first event is the one that begins the story.', 'An event near the end of the story does not come first.') })),
  E('order.last', 'last-event', 'READIN.T9_INTENSIVE.STORY_ORDER', 'a', 'word', 2, firstLast('last', { hints: H('The last event is the one that closes the story.', 'An event near the beginning does not come last.') })),
  // hero and lesson
  E('moral.hero', 'choose-heroic-quality', 'READIN.T5_INTENSIVE.MORAL_LESSON', 'a', 'why', 2, passChoose('hero', { hints: H('A hero is brave, clever or kind and acts to help others.', 'Being rich, big or old does not make a hero.') })),
  E('moral.lesson', 'choose-lesson', 'READIN.T5_INTENSIVE.MORAL_LESSON', 'b', 'why', 3, passChoose('moral', { hints: H('The lesson is shown by what happens at the end.', 'A lesson is not a detail of the story and not something the story does not teach.') })),
  // poems
  E('poem.form', 'poem-or-prose', 'READIN.T3_INTENSIVE_READING_PO.POEM_STRUCTURE', 'a', 'word', 1, pfGen(H('A poem is set in short lines, with rhythm and often rhyme.', 'Prose is written in ordinary sentences.'))),
  E('poem.rhyme', 'choose-rhyme', 'READIN.T3_INTENSIVE_READING_PO.POEM_STRUCTURE', 'a', 'word', 2, passChoose('rhyme', { hints: H('Rhyming words sound alike at the end. Say them aloud.', 'Look at the last words of the lines.') })),
  E('poem.refrain', 'choose-refrain', 'READIN.T3_INTENSIVE_READING_PO.POEM_STRUCTURE', 'b', 'word', 2, passChoose('repeat', { hints: H('A repeated line is the same words again.', 'Look for the words that come back in the poem.') })),
  E('poem.stanza', 'choose-stanza', 'READIN.T3_INTENSIVE_READING_PO.POEM_STRUCTURE', 'b', 'word', 1, passChoose('stanza', { hints: H('A stanza is a group of lines, like a paragraph.', 'Count the groups separated by a gap, not the lines.') })),
  E('poem.stanzatype', 'type-short', 'READIN.T3_INTENSIVE_READING_PO.POEM_STRUCTURE', 'b', 'word', 2, passType('stanza', { hints: H('A stanza is a group of lines. Count the groups.', 'Write the answer in words.') })),
  E('poemmean.subject', 'choose-subject', 'READIN.T15_POETRY.POEM_MEANING', 'a', 'word', 1, passChoose('subj', { hints: H('The subject is what the whole poem is about.', 'One picture in the poem is only a detail.') })),
  E('poemmean.message', 'choose-message', 'READIN.T15_POETRY.POEM_MEANING', 'b', 'why', 2, passChoose('msg', { hints: H('Ask: what does the poet want me to think or feel?', 'Check the message against the lines.') })),
  E('poemmean.line', 'choose-line-meaning', 'READIN.T15_POETRY.POEM_MEANING', 'b', 'why', 3, passChoose('pline', { hints: H('Poets use words in new ways. Do not read the line word for word.', 'Ask what the picture in the line shows.') })),
  // comprehension on passages and poems
  E('main.idea', 'choose-main-idea', 'READIN.T13_INTENSIVE.MAIN_IDEA', 'a', 'word', 2, passChoose('main', { hints: H('The main idea covers the whole passage, not just one part.', 'Ask: what is every paragraph mostly about?') })),
  E('main.title', 'choose-title', 'READIN.T13_INTENSIVE.MAIN_IDEA', 'a', 'word', 2, passChoose('ttl', { hints: H('A good title tells what the whole passage is about.', 'A title that names only a detail, or something not in the passage, is not the best.') })),
  E('main.detail', 'choose-detail', 'READIN.T13_INTENSIVE.MAIN_IDEA', 'a', 'word', 1, passChoose('detail', { hints: H('A detail question asks for one exact fact, such as a time, name or thing.', 'Find the line with the key word of the question.') })),
  E('sum.choose', 'choose-summary', 'READIN.T13_INTENSIVE.SUMMARY', 'b', 'why', 2, passChoose('sum', { hints: H('A summary has the key ideas in a few words and in the right order.', 'It is not one detail, not a copy of the opening and has nothing new in it.') })),
  E('sum.key', 'choose-key-idea', 'READIN.T13_INTENSIVE.SUMMARY', 'b', 'why', 3, passChoose('keyidea', { hints: H('A key idea covers what the passage is mostly about.', 'A small detail does not belong in a summary.') })),
  E('image.picture', 'choose-picture', 'READIN.T13_INTENSIVE.IMAGERY', 'c', 'word', 2, passChoose('img', { hints: H('Read the words slowly and picture them in your mind.', 'Use all the words in the line together, not just one word.') })),
  E('image.line', 'choose-line', 'READIN.T13_INTENSIVE.IMAGERY', 'c', 'why', 3, passChoose('imgline', { hints: H('Look for the line with colours, sounds or movement for what the question asks.', 'A line that only states a fact does not paint a picture.') })),
  E('ctx.meaning', 'choose-meaning', 'READIN.T13_INTENSIVE.CONTEXT_CLUES', 'd', 'word', 2, passChoose('ctx', { hints: H('Read the sentence with the word, and the sentences around it.', 'Try each meaning in place of the word. Which one fits?') })),
  E('ctx.clue', 'choose-clue', 'READIN.T13_INTENSIVE.CONTEXT_CLUES', 'd', 'why', 3, passChoose('ctxclue', { hints: H('A clue is a group of words that tells more about the hard word.', 'Ask: which words explain what the word means?') })),
  E('fact.choose', 'choose', 'READIN.T13_INTENSIVE.FACTUAL_QUESTIONS', 'e', 'word', 1, passChoose('fact', { hints: H('The answer is written in the passage. Find the sentence that answers the question.', 'Check that your answer matches what the question asks, not just a word in it.') })),
  E('fact.type', 'type-short', 'READIN.T13_INTENSIVE.FACTUAL_QUESTIONS', 'e', 'word', 2, passType('fact', { hints: H('The answer is written in the passage. Find the sentence that answers the question.', 'Write only the short answer.') })),
  E('fact.tfn', 'true-false-not-stated', 'READIN.T13_INTENSIVE.FACTUAL_QUESTIONS', 'e', 'word', 2, tfn({ hints: H('Find the sentence in the passage about this. Does it say the same, say something different, or say nothing?', 'True: the passage says it. False: the passage says something different. Not stated: the passage does not say.') })),
  E('infer.choose', 'choose-inference', 'READIN.T13_INTENSIVE.INFERENCE_QUESTIONS', 'e', 'why', 2, passChoose('infer', { hints: H('The passage does not say the answer outright. Look for clues.', 'Ask: what do the clues in the passage show?') })),
  E('infer.worked', 'choose-worked-out', 'READIN.T13_INTENSIVE.INFERENCE_QUESTIONS', 'e', 'why', 3, passChoose('infer2', { hints: H('Something worked out is not written in the passage, but the clues show it.', 'A sentence copied from the passage is stated, not worked out. A claim the passage goes against, or has no clue for, is not a good inference.') })),
];
