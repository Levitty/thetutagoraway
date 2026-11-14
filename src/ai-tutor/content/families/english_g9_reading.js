// ============================================================================
// ENGLISH GRADE 9, READING AND LISTENING on original passages, poems, play scenes and scripts (english_g9_passages.js): DRAFT families.
// Two families for each skill: the first draws from the first, third (and so on) texts of its group, the second from the others.
// A reading problem carries `passage: { title, text }`; a listening problem carries `listening: { title, script }` and its family needs audio
// (needsAudio: true; the script is read aloud and never shown). Off for children (reviewed:false) until a Kenyan English teacher signs them off.
// A question has three wrong answers: a small detail (_DETAIL), the opposite (_OPPOSITE) and something not in the text (_NOTSAID).
// ============================================================================
import { fam, choose, pick } from './english_g9_lib.js';
import { PASSAGES, LISTENS } from './english_g9_passages.js';

const GROUPS = { prose: (p) => ['argument', 'story', 'information'].includes(p.kind), poem: (p) => p.kind === 'poem', play: (p) => p.kind === 'play' };
const rowsFor = (src, test, types, half) => src.filter(test).filter((_, i) => i % 2 === half).flatMap(p => types.flatMap(t => (p.q[t] || []).map(row => ({ p, row }))));
// A stem that repeats across texts ("What is the main point?") names its text, so each text gives its own distinct question.
const stemFor = (q, p, src) => src.filter(x => Object.values(x.q).some(rs => rs.some(r => r[0] === q))).length > 1 ? `${q.replace(/\?$/, '')} in "${p.title.replace(/[?!.:]+$/, '')}"?` : q;
const mk = (id, src, test, types, half, h, listening) => () => {
  const { p, row } = pick(rowsFor(src, test, types, half));
  const [q0, right, w1, w2, w3] = row;
  const q = stemFor(q0, p, src);
  const wrongs = [[w1, `M_EN9_${id}_DETAIL`], [w2, `M_EN9_${id}_OPPOSITE`], [w3, `M_EN9_${id}_NOTSAID`]];
  const base = choose([[q, right, wrongs, 'Go back to the text and find the line that answers the question.']], { h, instruction: listening ? 'Listen to the talk. Then choose the best answer.' : 'Read the text. Then choose the best answer.', s1: listening ? 'Think about what you heard.' : 'Go back to the text.' })();
  if (!base) return null;
  return { ...base, ...(listening ? { listening: { title: p.title, script: p.script } } : { passage: { title: p.title, text: p.text } }) };
};
// R(tag, SKILL_ID, 'SUB.SKILL_ID', group, [types], [hint1, hint2], [oc first, oc second])
const R = (tag, id, cs, group, types, h, ocs) => [0, 1].map(half =>
  fam(`read.${tag}.${half ? 'b' : 'a'}`, cs, half ? 'word' : 'direct', half + 1, mk(id, group === 'listen' ? LISTENS : PASSAGES, group === 'listen' ? () => true : GROUPS[group], types, half, h, group === 'listen'), ocs[half] || ocs[0], group === 'listen' ? { needsAudio: true } : undefined));
const HP = ['Go back to the text and find the line that answers the question.', 'The answer must be in the text; a small detail, the opposite or something new is wrong.'];
export const FAMILIES = [
  ...R('predict', 'RS_PREDICT', 'READIN.T4_INTENSIVE_READING.RS_PREDICT', 'prose', ['predict', 'order'], ['A good prediction fits the clues and does not go against the text.', 'Look at the last lines for what comes next.'], ['a']),
  ...R('keyevents', 'RS_KEYEVENTS', 'READIN.T4_INTENSIVE_READING.RS_KEYEVENTS', 'prose', ['order', 'summary'], ['Find the first event, then the next, and so on.', 'A summary keeps the key events and leaves out small details.'], ['b']),
  ...R('questions', 'RS_QUESTIONS', 'READIN.T4_INTENSIVE_READING.RS_QUESTIONS', 'prose', ['fact', 'infer', 'ctx'], HP, ['c', 'd']),
  ...R('relate', 'RS_RELATE', 'READIN.T4_INTENSIVE_READING.RS_RELATE', 'prose', ['life', 'main'], ['Ask: where have I seen something like this in real life?', 'The connection must fit what the text says.'], ['e']),
  ...R('context', 'RS_CONTEXT', 'READIN.T3_READING_FOR_INFORMAT.RS_CONTEXT', 'prose', ['ctx', 'infer'], ['Read the sentence with the word and the sentences around it.', 'Try each meaning in place of the word. Which one fits?'], ['a']),
  ...R('connect', 'RS_CONNECT', 'READIN.T3_READING_FOR_INFORMAT.RS_CONNECT', 'prose', ['life', 'main'], ['Link what happens in the text to a real situation.', 'The link must agree with the text.'], ['b']),
  ...R('clues', 'RS_CLUES', 'READIN.T12_INTENSIVE_READING_CO.RS_CLUES', 'prose', ['infer', 'ctx'], ['A clue is a line in the text that points to the answer.', 'A conclusion must be backed by clues, not guessed.'], ['a', 'b']),
  ...R('images', 'RS_IMAGES', 'READIN.T13_INTENSIVE_READING_VI.RS_IMAGES', 'prose', ['image', 'ctx'], ['Read the words slowly and picture them in your mind.', 'Use all the words in the line together.'], ['a']),
  ...R('summary', 'RS_SUMMARY', 'READIN.T14_SUMMARISING_ARGUMENT.RS_SUMMARY', 'prose', ['main', 'summary'], ['The main point covers the whole text.', 'A summary keeps the main points in a sensible order.'], ['a', 'b']),
  ...R('fluency', 'RS_FLUENCY', 'READIN.T15_READING_FLUENCY.RS_FLUENCY', 'prose', ['predict', 'main'], ['A prediction is what will probably happen, from the clues.', 'The message is what the whole text is about.'], ['b']),
  ...R('pstyle', 'RP_STYLE', 'READIN.T2_INTENSIVE_READING_SI.RP_STYLE', 'poem', ['repeat', 'about', 'msg'], ['Repeated words are the same words that come again.', 'Repetition stresses an idea.'], ['a', 'b']),
  ...R('ppov', 'RP_POV', 'READIN.T8_READING_FOR_INTERPRE.RP_POV', 'poem', ['pov', 'persona', 'about'], ['The point of view is whose eyes tell the poem.', 'If the speaker says "I" it is the first person.'], ['a', 'b']),
  ...R('ppersona', 'RP_PERSONA', 'READIN.T8_POETRY_CHARACTERS.RP_PERSONA', 'poem', ['persona', 'pov', 'image'], ['The persona is the voice that speaks in the poem.', 'Other participants are the people or things the speaker talks about.'], ['a', 'b']),
  ...R('sequence', 'PL_SEQUENCE', 'READIN.T2_INTENSIVE_READING_PL.PL_SEQUENCE', 'play', ['order', 'lesson', 'theme'], ['Find the first thing that happens in the scene, then the next.', 'A lesson is shown by what happens at the end.'], ['a', 'b']),
  ...R('characters', 'PL_CHARACTERS', 'READIN.T4_PLAY_IDENTIFICATION_.PL_CHARACTERS', 'play', ['char', 'adverb', 'order'], ['The words in brackets tell how a character speaks.', 'A trait must match what the character says and does.'], ['a', 'c']),
  ...R('themes', 'PL_THEMES', 'READIN.T6_INTENSIVE_READING_PL.PL_THEMES', 'play', ['theme', 'lesson', 'char'], ['A theme is the big idea the scene shows.', 'Ask: what problem do the characters solve, and how?'], ['a', 'b']),
  ...R('relationship', 'PL_RELATIONSHIP', 'READIN.T7_INTENSIVE_READING_PL.PL_RELATIONSHIP', 'play', ['char', 'theme', 'adverb'], ['Look at how characters speak to each other.', 'The stage directions in brackets show feelings.'], ['a', 'b']),
  ...R('lessons', 'PL_LESSONS', 'READIN.T11_GRADE_APPROPRIATE_PL.PL_LESSONS', 'play', ['lesson', 'theme', 'order'], ['The lesson is shown by what happens at the end.', 'A lesson is not a detail of the scene.'], ['a', 'b']),
  ...R('traits', 'PL_TRAITS', 'READIN.T12_PLAY_CHARACTERISATIO.PL_TRAITS', 'play', ['char', 'adverb', 'lesson'], ['Clues to a trait are what a character says and how.', 'Check the trait against the words and the brackets.'], ['a']),
  ...R('structure', 'PL_STRUCTURE', 'READIN.T1_PLAY_STRUCTURE_AND_S.PL_STRUCTURE', 'play', ['setting', 'order', 'theme'], ['The setting is the place and time given at the start.', 'Follow the order of what the characters do.'], ['a', 'b']),
  ...R('lmain', 'LS_MAIN', 'LISTEN.T3_LISTENING_COMPREHENS.LS_MAIN', 'listen', ['main', 'detail', 'infer'], ['The main idea is what the whole talk is about.', 'Listen again for the exact words that answer the question.'], ['a']),
];
