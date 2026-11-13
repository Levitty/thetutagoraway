// ============================================================================
// ENGLISH GRADE 8, READING COMPREHENSION on original short passages and poems (english_g8_passages.js): DRAFT families.
// Two families for each reading skill: the first draws its questions from the first, third (and fifth) passages, the second from the others.
// The passage rides on the problem as `passage: { title, text }` (a UI that shows it must exist before any family is switched on).
// A question has three wrong answers: a small detail (_DETAIL), the opposite (_OPPOSITE) and something not in the text (_NOTSAID).
// Off for children (reviewed:false) until a Kenyan English teacher signs them off.
// ============================================================================
import { eng, mc, feedbackOf, shuffle, pick } from './english_g8_lib.js';
import { PASSAGES, LISTENS } from './english_g8_passages.js';

const showP = (p) => ({ title: p.title, text: p.text });
const rowsFor = (kindOf, types, half) => {
  const ps = PASSAGES.filter(p => (kindOf === 'poem') === (p.kind === 'poem')).filter((_, i) => i % 2 === half);
  return ps.flatMap(p => types.flatMap(t => (p.q[t] || []).map(row => ({ p, row }))));
};
const gen = (id, kindOf, types, half, hints) => (cskill) => {
  const { p, row } = pick(rowsFor(kindOf, types, half));
  const [q, right, w1, w2, w3] = row;
  const codes = ['DETAIL', 'OPPOSITE', 'NOTSAID'].map(s => `M8_${id}_${s}`);
  const options = mc(right, [[w1, feedbackOf(cskill, codes[0]), codes[0]], [w2, feedbackOf(cskill, codes[1]), codes[1]], [w3, feedbackOf(cskill, codes[2]), codes[2]]]);
  if (!options) return null;
  return { passage: showP(p), question: q, options, instruction: 'Read the passage. Then choose the best answer.', hints,
    steps: ['Go back to the passage and find the line that answers the question.', `"${right}" fits what the passage says.`] };
};
// R(tag, SKILL_ID, 'SUB.SKILL', 'story'|'poem', [types], [hint1, hint2], [oc first, oc second])
const R = (tag, id, cs, kindOf, types, hints, ocs) => [0, 1].map(half =>
  eng({ id: `english8.read.${tag}.${half ? 'b' : 'a'}`, kind: `reading-${half ? 'b' : 'a'}`, cs, oc: ocs[half] || ocs[0], form: half ? 'word' : 'direct', rung: half + 1, gen: gen(id, kindOf, types, half, hints) }));
const S = (sub) => `READIN.${sub}`;
// Listening: the script is read aloud and is never shown. The problem carries `listening: { title, script }` and the family needs audio.
const lgen = (id, types, half, hints) => (cskill) => {
  const ps = LISTENS.filter((_, i) => i % 2 === half);
  const { p, row } = pick(ps.flatMap(p => types.flatMap(t => (p.q[t] || []).map(row => ({ p, row })))));
  const [q, right, w1, w2, w3] = row;
  const codes = ['DETAIL', 'OPPOSITE', 'NOTSAID'].map(s => `M8_${id}_${s}`);
  const options = mc(right, [[w1, feedbackOf(cskill, codes[0]), codes[0]], [w2, feedbackOf(cskill, codes[1]), codes[1]], [w3, feedbackOf(cskill, codes[2]), codes[2]]]);
  if (!options) return null;
  return { listening: { title: p.title, script: p.script }, question: q, options, instruction: 'Listen to the talk. Then choose the best answer.', hints,
    steps: ['Think about what you heard and find the part that answers the question.', `"${right}" fits what was said.`] };
};
const L = (tag, id, cs, types, hints, ocs) => [0, 1].map(half =>
  eng({ id: `english8.listen.${tag}.${half ? 'b' : 'a'}`, kind: `listening-${half ? 'b' : 'a'}`, cs, oc: ocs[half] || ocs[0], form: half ? 'word' : 'direct', rung: half + 1, needsAudio: true, gen: lgen(id, types, half, hints) }));
export const FAMILIES = [
  ...R('sequence', 'RS_SEQUENCE', 'READIN.T1_INTENSIVE_READING_SH.RS_SEQUENCE', 'story', ['order', 'fact'], ['Find the first event in the passage, then the next, and so on.', 'Look for time words such as then, after, one day and next.'], ['a']),
  ...R('context', 'RS_CONTEXT', 'READIN.T1_INTENSIVE_READING_SH.RS_CONTEXT', 'story', ['ctx', 'infer'], ['Read the sentence with the word and the sentences around it.', 'Try each meaning in place of the word. Which one fits?'], ['b']),
  ...R('questions', 'RS_QUESTIONS', 'READIN.T1_INTENSIVE_READING_SH.RS_QUESTIONS', 'story', ['fact', 'infer'], ['A direct question has its answer in the passage; an inferential one needs clues.', 'Find the line with the key word of the question.'], ['c']),
  ...R('setting', 'RS_SETTING', 'READIN.T2_INTENSIVE_READING_SH.RS_SETTING', 'story', ['setting', 'order'], ['The setting is the time and the place of the story.', 'Look for place names and time words in the first lines.'], ['a']),
  ...R('characters', 'RS_CHARACTERS', 'READIN.T4_INTENSIVE_READING_SH.RS_CHARACTERS', 'story', ['char', 'infer'], ['Look at what the character says and does.', 'A trait must match the actions, not just the name.'], ['a', 'b']),
  ...R('main', 'RS_MAIN', 'READIN.T6_INTENSIVE_READING_SH.RS_MAIN', 'story', ['main', 'summary'], ['The main idea covers the whole passage, not just one part.', 'A summary keeps the key events in order and leaves out small details.'], ['a', 'b']),
  ...R('lesson', 'RS_LESSON', 'READIN.T11_INTENSIVE_READING_LE.RS_LESSON', 'story', ['lesson', 'main'], ['The lesson is shown by what happens at the end.', 'A lesson is not a detail of the story and not something the story does not teach.'], ['a']),
  ...R('persona', 'RP_PERSONA', 'READIN.T2_INTENSIVE_READING_SI.RP_PERSONA', 'poem', ['persona', 'repeat', 'about'], ['The persona is the voice that speaks in the poem.', 'Repeated words are the same words that come again.'], ['a', 'b']),
  ...R('message', 'RP_MESSAGE', 'READIN.T15_POEMS.RP_MESSAGE', 'poem', ['msg', 'about', 'persona'], ['Ask: what does the poet want me to think or feel?', 'Check the message against the lines of the poem.'], ['a', 'b']),
  ...R('pmain', 'RP_MAIN', 'READIN.T3_INTENSIVE_READING_PO.RP_MAIN', 'poem', ['about', 'image', 'repeat'], ['The main idea is what the whole poem is about.', 'One picture in the poem is only a detail.'], ['b']),
  ...R('keypoints', 'RS_KEYPOINTS', 'READIN.T13_INTENSIVE_READING_CO.RS_KEYPOINTS', 'story', ['main', 'summary'], ['A key point covers what the passage is mostly about.', 'A small detail does not belong in a summary.'], ['a', 'c']),
  ...R('images', 'RS_IMAGES', 'READIN.T12_INTENSIVE_READING_CO.RS_IMAGES', 'story', ['image', 'ctx'], ['Read the words slowly and picture them in your mind.', 'Use all the words in the line together, not just one word.'], ['a', 'b']),
  ...L('main', 'LS_MAIN', 'LISTEN.T7_LISTENING_FOR_DETAIL.LS_MAIN', ['main', 'detail', 'infer'], ['The main idea is what the whole talk is about.', 'One detail is not the main idea.'], ['a', 'b']),
  ...L('cause', 'LS_CAUSE', 'LISTEN.T3_LISTENING_COMPREHENS.LS_CAUSE', ['effect', 'main', 'ctx'], ['A cause is why something happened; an effect is what happened after.', 'For a hard word, listen to the words around it.'], ['a', 'c']),
  ...L('specific', 'LS_SPECIFIC', 'LISTEN.T4_LISTENING_COMPREHENS.LS_SPECIFIC', ['detail', 'infer'], ['Specific information is an exact fact such as a time, a name or a number.', 'Listen again for the key word of the question.'], ['a', 'b']),
];
