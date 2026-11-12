// ============================================================================
// ONE TURN OF THE LIVE TUTOR, server side (the voice-tutor edge function).
//
// Written like src/rocket/turn.js: plain JavaScript with the database, the
// model and the secrets passed in, so tests/voice-tutor-turn.test.mjs runs it
// end to end with fakes and the edge function runs the same code.
//
// ORDER MATTERS:
//   1. the switch and the allowlist stub (adult test accounts only until
//      consent, milestone 5); whose child this is;
//   2. SAFEGUARDING on the child's raw words (the shared rules and the welfare rules,
//      guard.js), recorded before anything can return early. A flagged message, or a
//      typed answer, never reaches the model: the tutor answers with care and a
//      trusted-adult line (a crisis ends the lesson), and earlier flagged lines are
//      kept out of the transcript the model reads;
//   3. the child's answer to the last question, marked HERE from the sealed
//      question (the model never marks);
//   4. the child-message guard: personal details and rule-changing never reach
//      the model;
//   5. the caps: US$ per session and per child per day (settings); at a cap
//      the tutor winds down kindly;
//   6. the model, names scrubbed, prefix cached, structured output, STREAMED
//      (owner, 11 Nov 2026): the reply is read step by step as it is written;
//   7. each step, as it completes, is validated (commands.js) and checked:
//      a sentence (or anything written on the board) is checked for the answer
//      against everything said so far in the turn and the questions known so
//      far, and against the safeguarding rules, BEFORE it is sent to be spoken
//      and drawn. A step that fails stops the turn there and the tutor recovers
//      with an authored line. The AI disclosure comes first on turn 1. A turn
//      that runs past MAX_SPOKEN_WORDS is cut and handed back to the child;
//   8. questions sealed, every token and second metered, the end sent.
//
// THE CONVERSATION ENGINE (12 Nov 2026, CONVERSATION_ENGINE_PLAN.md steps 1 to 3):
//   - the lesson state comes from the page (orchestrator.js cleanLesson), the code decides
//     the allowed moves and why (decide), they go in the context, the turn is checked
//     against them (judgeTurn, notes only) and the new state goes back in 'end';
//   - a silence probe (silence.js) is a short turn asked for by the page with its reason;
//   - the model judges the child's answer with the silent `assess`, held to the seal
//     (finalClass); the evidence row is written at the END of the turn with that class:
//     only 'understood' is independent, and a reason that comes later upgrades the row.
//   The tester view gets the class, the rule and the moves in 'end' (tester); the child never sees them.
//
// AFTER THE FIRST TEST-SET RUN (12 Nov 2026, 0 of 30 passed; Tutagora/Build/voice-tutor/evals/runs/2026-11-12-1045):
//   - the child's spoken answer is read and marked by spokenAnswer.js ("one half", "nusu", "two quarters" for 1/2);
//     a question back, "umm" or "I don't know" is not an answer: never marked wrong, the question stays open;
//   - an answer the child has found is no longer hidden (lesson.found), so HOREB can say it back;
//   - after a right answer the first say names it in the child's words (added by the code if the model does not),
//     and the question just answered is never asked again;
//   - a turn that gives the answer inside its own question loses that sentence, and a question whose answer was
//     already said is not asked; neither stops the turn;
//   - when a turn has to be stopped, the tutor recovers in context (recoverLines: what was asked, what the child did),
//     and never asks the child to say it again;
//   - after a care reply the lesson waits: a silence gets an authored line, never the model; a crisis ends it for good;
//   - a probe thinks as hard as any turn (low effort wrote 18 of 21 probes in the wrong shape).
//
// AFTER THE SECOND TEST-SET RUN (12 Nov 2026, runs/2026-11-12-1142, the app issues the judge listed):
//   - an answer said as a question ("Is it four?") is marked, tentative; an answer to the tutor's newer, smaller spoken
//     question (askedOther) is not marked wrong against the sealed one;
//   - the answer-in-question check looks only at sealed answers (a sentence that might give one away waits, with its
//     drawings, for the ask that follows it);
//   - too long is trimmed to the limit keeping the final question (trimToWords), never emptied; a probe ends on a question;
//   - a goodbye ends the lesson (end_session), with no question after it;
//   - a child asked to shade a plain bar or circle is given it with the shade control (shadeOffer);
//   - a question id used before in the lesson is renamed; the code's own sentences are never held to a move tag.
//
// AFTER THE PAID SAMPLE GOT WORSE (12 Nov 2026, runs/2026-11-12-1824: our own layers fought the model). Fewer, better
// rules; the code never makes a turn worse than the model's own:
//   - the gate drops a sentence only for a hard fault (an answer given away, harder numbers too soon); for repeat, stock
//     and unanswered the better of the model's sentence and its rewrite is spoken; overtalk is not in the live gate;
//   - the code's own lines are built from the board as it is (boardFacts: the figure, its parts, its shading) and the open
//     question; the fixed fallbacks ("Look at the circle. Which part is shaded?", "You asked ...") are gone;
//   - a filler alone ("um...") gets no model call: a hand-back, and one "Take your time" after two in a row;
//   - a sound-alike number ("too", "tree") is read as the number when a count is asked for (spokenAnswer.js hearNumbers);
//   - a right answer said unsure is right_unexplained, never a guess (orchestrator.js finalClass);
//   - an offer or a social question is never sealed (commands.js sealable);
//   - the lesson state carries the pace (slow), which the page's silence times double for (silence.js).
//
// AFTER RUN 2026-11-12-1900 (P5, a free fix round: averages 3.0 -> 2.1 -> 2.6). Rules removed or narrowed first:
//   - stock phrases are noted, never rewritten (the opener rewrite made nonsense); a short kind line said again is not a
//     repeat; "Press for reasoning" is not a move of every stage, and the code asks for a reason only where decide allows
//     a press (a fraction, a comparison or a rule, once per idea, never for an unsure child being helped);
//   - one question a turn: a sentence with a question waits for the next; a later question wins (lastQuestionOnly);
//   - the child's own cut or shading is not drawn for them (habits.js childStepOf): the drawing is dropped, the turn
//     hands back on the question that asked for it;
//   - the lesson state carries the step (kind, tries, what is found on the picture, closed questions in a row) and the
//     brief says what the board really shows (orchestrator.js boardTruth).
//
// prepareTurn() does 1 to 5 and either refuses (a status and an error) or
// returns go(emit), which streams the turn as events:
//   { type:'meta', target, prerequisite, marked, picture }
//   { type:'step', step }            in order, each already checked and sealed
//   { type:'end', guard, dropped, notes, cost_usd, spent, voice, model, lesson, tester }
// There is one path: authored replies (guards, caps, no key) stream the same way.
// runTutorTurn() collects the events, for the tests.
// ============================================================================
import { validateTurn, MAX_SPOKEN_WORDS, wordCap, spokenWords, cleanText, doingOf, LIMITS, DRAWN, MARKS } from './commands.js';
import { pickTarget, lessonSkills, allowedMisconceptions, prerequisitesOf } from './fractions.js';
import { wordsIn, preFor, askIsOnPre } from './pacing.js';
import { capCheck } from './session.js';
import { screenChild, screenAll, careTurn, checkTurnText, answerInQuestion, visibleText, MAX_CHILD_CHARS, ANSWER_REPLY, PRIVATE_LINES } from './guard.js';
import { stepParser } from './streamSteps.js';
import { buildRequest, turnContext, MAX_PROBE_WORDS } from './prompt.js';
import { probeBank, bankLines } from './probes.js';
import { markSpoken, canonAnswer, speakAnswer, inWords, hearNumbers, asksForNumber } from './spokenAnswer.js';
import { seal, unseal } from './seal.js';
import { costOf, PRICES } from '../rocket/guide.js';
import { validateSnapshot, imageTokens, CHECK_GAP_MS } from './snapshot.js';
import { speechCost, listenCost, spokenChars } from './providers/voice.js';
import { tutorEvidence } from '../learner/evidence.js';
import { readSkills, openMisconceptions, learnerLines } from '../learner/model.js';
import { readLearner, rememberEvidence, upgradeEvidence, saveLearned, finishLesson } from '../learner/tutorLearning.js';
import { FRACTION_SKILLS, skillName } from './fractions.js';
import { cleanPace } from './childVoice.js';
import { cleanLesson, decide, judgeTurn, updateLesson, finalClass, isIndependent, lessonLines, turnBrief } from './orchestrator.js';
import { stepFlags, endFlags, habitContext, confirms, asksReason, boardClaimOf } from './habits.js';
import { rewriteRequest, rewriteOnce, addUsage } from './gate.js';
import { exampleLines } from './exampleLookup.js';
import { cleanProbe } from './silence.js';

const reply = (status, body) => ({ status, body });
const say = (text) => ({ cmd: 'say', text });
// Every authored hand-back ends on a question to the child: they are answering.
const handBack = { cmd: 'pause_for_child', expect: 'any', max_wait_s: 30, doing: 'answer' };
// A hand-back the code adds (the model did not): what the child is doing is read from the turn, or kept (after a probe).
const handBackAs = (doing = null, steps = []) => ({ ...handBack, doing: doing || doingOf(steps) });

export const OFF_REPLY = 'The live tutor is switched off.';
export const ADULTS_ONLY = 'The live tutor is for adult test accounts only until parent consent is built (milestone 5).';
export const DISCLOSURE = 'Hello. I am HOREB, an AI tutor. I am a computer program, not a person.';
export const NO_PICTURE_TURN = [say('I cannot look at pictures just now.'), say('Please type your answer for me.'), handBack];
// A rough price for one turn before it is made, so a picture is never sent past a cap.
export const TURN_ESTIMATE_USD = 0.02;
// With voice: the tutor's words (about 250 characters a turn) are spoken, and the child's speech heard.
export const VOICE_TURN_CHARS_ESTIMATE = 250;
// The microphone stays open for the whole lesson (12 Nov 2026): the seconds sent since the last turn can be long.
export const MAX_AUDIO_S = 300;
export const LESSON_TITLE_LINE = 'Today we will find fractions that are the same amount.';
// After a crisis the lesson has ended: anything more the page sends gets this, never the model.
export const ENDED_TURN = [say('Our lesson has stopped for today.'), say('Please go and find a grown-up you trust now.'), { cmd: 'end_session', summary: 'The lesson stopped early.' }];
// After a care reply, a silence: the child is not asked anything about what they said, and the lesson waits.
export const CARE_WAIT = [say('I am here, and there is no hurry.'), say('Say when you want to carry on, or we can stop for today.'), { cmd: 'pause_for_child', expect: 'any', max_wait_s: 60, doing: 'talk' }];

/**
 * What the tutor says when a turn has to be stopped (no usable words, the model failed, a sentence failed a hard check),
 * in the context of the lesson: what the code decided, what the child just did, the question still open, the board.
 * It never asks the child to say it again (12 Nov 2026: "Sorry, I lost my words... can you say that again?" was 15% of
 * all turns, and once came straight after a disclosure).
 * Built from facts only (12 Nov 2026, run 2026-11-12-1824: the fixed line "Look at the circle. Which part is shaded?"
 * played in four scenarios when nothing was shaded, and "Look at the half on the board" when nothing was cut): a line
 * about the board says only what the board model holds (boardFacts: the figure, its parts, its shading), the question is
 * the open one (sealed, or the tutor's last spoken one), and where nothing true can be said the child gets the open
 * question alone. `board` is the board as the child sees it now; `safe(line)` says a line gives no hidden answer away.
 * @returns {{ lines: string[], doing: string, end?: object }}
 */
export function recoverLines({ rule = null, probe = null, marked = null, openPrompt = null, lastQuestion = null, saidAny = false, doing = null, message = '', board = [], turnIndex = 0, found = [], ack = 'yes', safe = () => true } = {}) {
  const said = marked?.correct ? marked.said || null : null;
  const yes = marked?.correct && !saidAny ? [said ? (ack === 'revoice' ? `${cap(said)}, you said.` : `Yes, ${said}.`) : 'Yes, that is right.'] : [];
  // The open question: the sealed one, else the tutor's last spoken one. Never one the child has just answered right.
  // A question that points at something the board does not show ("What do you see in the bar?" with no bar) is not repeated.
  const q = [marked?.correct ? null : openPrompt, marked?.correct ? null : lastQuestion].find((x) => x && /\?\s*$/.test(String(x).trim()) && !boardClaimOf(x, board)) || null;
  const facts = boardFacts(board);
  const pick = (xs) => xs[Math.abs(Number(turnIndex) || 0) % xs.length];
  const theirs = childBit(message);
  const fact = factLine(facts, { q, safe });
  const ask = q || 'What do you think?';
  if (probe) {
    const k = probe.kind;
    if (k === 'task_checkin') return { lines: pick([['I can see you are working.', 'Say a word if you want help.'], ['Take your time.', 'Tell me when you are done.'], ['No hurry at all.', 'Tell me when you are done.']]), doing: doing || 'task' };
    if (k === 'answer_smaller' || k === 'talk_again') return { lines: [pick(['That is okay.', 'Here is a smaller step.', 'Let us make it smaller.']), smallerQuestion(facts, q)], doing: doing || 'answer' };
    return { lines: [pick(['Take your time.', 'There is no hurry.', 'I am listening.']), ask], doing: doing || 'answer' };
  }
  switch (rule) {
    case 'open': return { lines: [...(saidAny ? [] : [DISCLOSURE, LESSON_TITLE_LINE]), 'Have you ever shared a chapati with someone?'], doing: 'answer' };
    case 'care-wait': case 'care': return { lines: ['I am listening.', 'Do you want to carry on with our fractions, or stop for today?'], doing: 'talk' };
    case 'care-return': return { lines: ['I am glad you are here.', q ? `Let us carry on gently. ${q}` : 'Shall we carry on gently?'], doing: 'answer' };
    case 'stop': return { lines: [found.length ? `Today you found ${foundList(found)}. Thank you for working with me.` : 'Thank you for working with me today.'], doing: 'talk', end: { cmd: 'end_session', summary: 'The child asked to stop, and the lesson closed early.' } };
    case 'bored': return { lines: ['I hear you.', 'Shall we play a quick guessing game, or stop for today?'], doing: 'talk' };
    case 'close': return { lines: [...(found.length ? [`Today you found ${foundList(found)}.`] : []), 'What is one thing you will remember?'], doing: 'talk' };
    case 'press': return { lines: [...yes, said ? `What made you say ${said}?` : 'How did you know?'], doing: 'answer' };
    case 'fresh-check': case 'move-on': case 'reason': return { lines: [...yes, said ? `Show me ${said} on the board.` : 'Can you show me that on the board?'], doing: 'task' };
    case 'diagnose': case 'change': return { lines: [...(saidAny || !theirs ? [] : [`You said ${theirs}.`]), theirs ? 'Tell me how you got that.' : 'How did you work it out?'], doing: 'answer' };
    case 'thinking': return { lines: ['Take your time.'], doing: doing || 'answer' };
    case 'lost': return { lines: ['That is okay.', smallerQuestion(facts, q)], doing: 'answer' };
    default: return { lines: [...yes, ...(fact ? [fact] : []), ask], doing: 'answer' };
  }
}
const cap = (t) => String(t || '').replace(/^./, (c) => c.toUpperCase());
/**
 * The newest figure on the board as the child sees it: { id, name: circle | bar | grid | shape | number line, parts,
 * shaded } (parts 1 is a whole, not cut), or null when nothing is drawn.
 */
export function boardFacts(board = []) {
  const f = [...(board || [])].reverse().find((b) => b && (['shape', 'fraction_bar', 'number_line'].includes(b.cmd) || (b.cmd === 'figure' && ['fraction', 'numberline'].includes(b.type))));
  if (!f) return null;
  if (f.cmd === 'number_line' || f.type === 'numberline') return { id: f.id, name: 'number line', line: true };
  const p = f.cmd === 'figure' ? f.params || {} : f;
  const name = f.cmd === 'shape' ? (f.kind === 'circle' ? 'circle' : f.kind || 'shape') : f.cmd === 'fraction_bar' ? 'bar' : p.shape === 'circle' ? 'circle' : p.shape === 'grid' ? 'grid' : 'bar';
  const parts = name === 'grid' ? (Number(p.rows) || 0) * (Number(p.cols) || 0) || 1 : Math.max(1, Number(p.parts) || 1);
  const sh = Array.isArray(p.shaded) ? p.shaded.length : Number(p.shaded) || 0;
  return { id: f.id, name, parts, shaded: Math.max(0, Math.min(sh, parts)) };
}
const nw = (n) => inWords(String(n)) || String(n);
// A sentence that is true of the board: the figure whole, or its parts and what is shaded. No counts when the question
// asks for one (they are the child's to find), and only a line that gives no hidden answer away.
const factLine = (facts, { q = null, safe = () => true } = {}) => {
  if (!facts) return null;
  if (facts.line) return 'Look at the number line.';
  const countsOk = !/\b(how many|what fraction|which fraction|how much|count)\b/i.test(String(q || ''));
  let line;
  if (facts.parts <= 1) line = `The ${facts.name} is whole: it is not cut yet.`;
  else if (!countsOk) line = facts.shaded ? `Look at the ${facts.name}.` : `Look at the ${facts.name}: none of it is shaded yet.`;
  else if (!facts.shaded) line = `The ${facts.name} is cut into ${nw(facts.parts)} parts, and none is shaded yet.`;
  else line = `The ${facts.name} has ${nw(facts.parts)} parts, and ${nw(facts.shaded)} ${facts.shaded === 1 ? 'is' : 'are'} shaded.`;
  return safe(line) ? line : `Look at the ${facts.name}.`;
};
// The child's words, short, for a sentence that says them back ("You said two sixths.").
const childBit = (message) => {
  const w = String(message || '').replace(/[?!.]+\s*$/, '').replace(/\s+/g, ' ').trim().split(' ');
  const t = w.slice(0, 6).join(' ').replace(/^(umm*|uh+|hmm+|so|well|oh)[,.\s]+/i, '').toLowerCase();
  return /^[a-z0-9/' ,-]{1,48}$/.test(t) && !/\b(i|you|my|me)\b/.test(t) ? t : null;
};
// A smaller, easier question about what is really on the board (never its answer, never something not there).
const smallerQuestion = (facts, q) => {
  if (!facts) return q && /\?\s*$/.test(q) ? q : 'Which part of it do you know already?';
  if (facts.line) return 'Where does the number line start?';
  if (facts.parts <= 1) return `Is the ${facts.name} whole, or is it cut into pieces?`;
  if (!facts.shaded) return `Can you put your finger on one part of the ${facts.name}?`;
  return 'Can you put your finger on a shaded part?';
};
const foundList = (found) => { const w = found.map((f) => inWords(f) || f).slice(-3); return w.length > 1 ? `${w.slice(0, -1).join(', ')} and ${w[w.length - 1]}` : w[0]; };
const recoverSteps = (r) => [...r.lines.map(say), r.end || { ...handBack, doing: r.doing }];
/** The tutor's last spoken question (the last question in its last turn, from the transcript the page sends), or null. */
export function lastTutorQuestion(history) {
  const h = Array.isArray(history) ? history : [];
  let i = h.length - 1;
  while (i >= 0 && h[i]?.who !== 'tutor') i -= 1;
  for (; i >= 0 && h[i]?.who === 'tutor'; i -= 1) {
    const qs = String(h[i].text || '').split(/(?<=[.!?])\s+/).filter((x) => /\?\s*$/.test(x));
    if (qs.length) return qs[qs.length - 1].trim();
  }
  return null;
}
/** The questions of the tutor's last `n` turns, newest first (a turn is a run of tutor lines between the child's). */
export function recentTutorQuestions(history, n = 3) {
  const h = Array.isArray(history) ? history : [];
  const out = []; let turns = 0; let inTutor = false;
  for (let i = h.length - 1; i >= 0 && turns <= n; i -= 1) {
    if (h[i]?.who !== 'tutor') { inTutor = false; continue; }
    if (!inTutor) { turns += 1; inTutor = true; if (turns > n) break; }
    out.push(...String(h[i].text || '').split(/(?<=[.!?])\s+/).filter((x) => /\?\s*$/.test(x)).reverse());
  }
  return out;
}

export const WIND_DOWN = [
  { cmd: 'set_phase', phase: 'wrapup' },
  say('We have done a lot of good thinking today.'),
  say('That is the end of our time for now. Well done for working so hard.'),
  { cmd: 'end_session', summary: 'The session reached its time or cost limit and closed early.' },
];

const DISCLOSES = /\b(ai|a\.i\.|artificial intelligence|computer program|not a (real )?person|not a human)\b/i;

/**
 * @param {object} a
 * @param {{id:string,email?:string}} a.user
 * @param {object} a.body   { session_id, child_id|null, skill?, message, answer?:{seal,response}, heard?, board, history, elapsed_s, turn_index }
 * @param {object} a.db     getChild, getProgress, spend, recordUsage, recordConcern, recordEvidence (see the fake in the test)
 * @param {Function|null} a.callModel  (request, { onText }) -> Promise<{ usage, stop_reason }>, streaming; null when no API key is set
 * @param {Function|null} a.safeguard  src/ai/safeguarding.js screen
 * @param {object} a.settings  settingsFrom(env)
 * @param {object} a.lib    the misconception library (engine/data/curriculum/g5.misconceptions.json)
 * @param {string} a.secret the seal key (server only)
 * @param {number} [a.now]
 */
export async function prepareTurn({ user, body, db, callModel = null, safeguard = null, settings, lib = {}, secret, now = Date.now() }) {
  if (!user?.id) return reply(401, { error: 'Sign in first.' });
  // 1. Switch, allowlist stub, child.
  if (!settings?.enabled) return reply(403, { error: OFF_REPLY });
  const email = String(user.email || '').toLowerCase();
  if (!email || !settings.allowlist.includes(email)) return reply(403, { error: ADULTS_ONLY });
  const sid = String(body?.session_id || '');
  if (!/^[A-Za-z0-9-]{8,64}$/.test(sid)) return reply(400, { error: 'No session.' });
  let child = null;
  if (body?.child_id) {
    child = await db.getChild(String(body.child_id));
    if (!child || child.parent_id !== user.id) return reply(403, { error: 'That child is not on this account.' });
  }
  const childKey = child ? `${user.id}_c${child.id}` : user.id;
  let message = String(body?.message ?? '').trim().slice(0, MAX_CHILD_CHARS);
  const turnIndex = Math.max(0, Number(body?.turn_index) || 0);

  // 2. Safeguarding, before anything that can return early: the child's message AND a typed answer
  //    (both are words of the child that would otherwise reach the model or the evidence log).
  const answerText = String(body?.answer?.response ?? '').slice(0, MAX_CHILD_CHARS);
  let concern = null;
  // The same words as message and as answer are one concern, recorded once (12 Nov 2026: scenario 29 recorded it twice).
  for (const text of [...new Set([message, answerText])]) {
    if (!text) continue;
    const hit = screenAll(text, safeguard);
    if (hit.tier === 'none') continue;
    if (!concern || (hit.tier === 'crisis' && concern.tier !== 'crisis')) concern = hit;
    // Nothing else stores the child's words in milestone 1, so the snapshot is kept here.
    await db.recordConcern({
      source: 'voice_tutor', source_id: /^[0-9a-f-]{36}$/i.test(sid) ? sid : null, user_id: user.id, learner_id: child?.id || null,
      grade: Number(String(child?.grade ?? '').replace(/\D/g, '')) || null, text_snapshot: text,
      tier: hit.tier, categories: hit.categories, detected_by: 'rule',
      rule_ids: (hit.hits || []).map((h) => h.id), excerpt: (hit.hits || []).map((h) => h.excerpt).join(' | ').slice(0, 1000),
    });
  }

  // 3. The last question, marked from its seal: the page's, or the one the lesson kept because the child did not answer
  //    it last turn (a question back, "umm"). The child's words are read as speech (spokenAnswer.js), not as typing.
  const lesson0 = cleanLesson(body?.lesson);
  let marked = null;
  let open = null;      // the question the child is still working on (its answer stays hidden)
  let question = null;  // that question's item, answered or not (its prompt, for the recovery and the re-ask check)
  let unanswered = null; // { seal } when the child's words were not an answer: the question stays open
  const sealToken = body?.answer?.seal || (message && lesson0.seal) || null;
  const sealed = sealToken && !concern ? await unseal(sealToken, secret, { session: sid, child: childKey, now }) : null;
  // A number word heard as its sound-alike ("too", "tree") is read as the number when a number is being asked for: the
  // sealed question's answer is a number, or one of the tutor's last three turns asked how many (spokenAnswer.js hearNumbers).
  const lastSpokenQ = lastTutorQuestion(body?.history);
  // The counting thread stays open across a few turns of nudges ("How many pieces?" ... "Take your time." ... "tree?").
  const numberOpen = !concern && (recentTutorQuestions(body?.history, 3).some(asksForNumber) || (!!sealed && /^\d+(\/\d+)?$/.test(canonAnswer(sealed.item?.answer))));
  const heardFrom = numberOpen && hearNumbers(message) !== message ? message : null;
  if (heardFrom) message = hearNumbers(message);
  const response = hearNumbers(String((body?.answer?.seal ? body.answer.response : message) ?? '').slice(0, MAX_CHILD_CHARS), { numberOpen });
  if (sealed) {
    const q = sealed;
    question = q.item;
    let r = markSpoken(q.item, response);
    // Not right against the seal, but the tutor's last spoken question was a different, smaller one ("How many pieces
    // is the chapati cut into?" while the sealed question asks for the fraction): the child answered that one, so it
    // is not marked wrong (12 Nov 2026, run 2: right answers to a smaller question were marked wrong and forced Diagnose).
    if (r.attempt && !r.correct && askedOther(body?.history, q.item.question)) r = { ...r, attempt: false, why: 'answered the tutor\'s newer spoken question' };
    if (r.attempt) {
      marked = { ask: q.ask, skill: q.item.cskill || q.skill || null, correct: r.correct, misconception: r.mis || null, answer: response.slice(0, 60), said: r.correct ? speakAnswer(r.said) : null, canon: r.correct ? canonAnswer(q.item.answer) : null, tentative: !!r.tentative };
      if (!r.correct) open = q.item;
    } else { open = q.item; unanswered = { seal: sealToken, why: r.why }; }
  }
  // One row in the learner's evidence log per marked answer, written at the end of the turn with the answer's
  // class (only 'understood' is independent). A right answer whose reason came this turn upgrades its earlier row.
  // Never allowed to fail the turn.
  const recordJudged = async (judged) => {
    try {
      if (marked) {
        const row = tutorEvidence({ userId: user.id, childId: child?.id || null, sid, marked, now, independent: isIndependent(judged?.class) });
        if (row) { await db.recordEvidence(row); rememberEvidence({ sid, userId: user.id, childId: child?.id || null, row }); }
      } else if (judged?.class === 'understood' && lesson0.pending) {
        await upgradeEvidence(db, { sid, userId: user.id, childId: child?.id || null, itemRef: `tutor:${sid}:${lesson0.pending.ask}` });
      }
    } catch (e) { console.error('voice-tutor: evidence', String(e?.message || e).slice(0, 200)); }
  };

  // Where the lesson is.
  // A flagged message gets only the authored care turn below: no model, no further reads.
  const progress = concern ? { skills: {} } : ((await db.getProgress(childKey)) || { skills: {} });
  const learnerData = concern ? { rows: [], profile: null, notes: [] } : await readLearner(db, { sid, userId: user.id, childId: child?.id || null, now });
  const nowMs = now;
  const skillsModel = readSkills(learnerData.rows, FRACTION_SKILLS, { now: nowMs });
  const pick = pickTarget(progress, body?.skill || null, skillsModel);
  const skills = lessonSkills(pick.target);
  const allowedMis = allowedMisconceptions(skills);
  const board = Array.isArray(body?.board) ? body.board.slice(0, 40) : [];
  // Pictures of the child's work this session (the page counts them); a diagnosis may name one.
  const snapshots = Math.max(0, Math.min(999, Number(body?.snapshots_taken) || 0));
  const inkCellsIn = Array.isArray(body?.ink_cells) ? body.ink_cells.slice(0, 6).map(String) : [];
  const vopts = { board, allowedMis, skills, snapshots, inkCells: inkCellsIn };
  // What the child did with the figures on the board they could handle (src/draw/observe.js, written by the
  // page from their taps and drags): only for figures really on the board, plain words only, short. It is the
  // app's account of the child's play, never instructions.
  const handled = new Set(board.filter((b) => b && b.cmd === 'figure' && Array.isArray(b.controls) && b.controls.length).map((b) => b.id));
  const figures = (Array.isArray(body?.figures) ? body.figures : []).filter((f) => f && handled.has(f.id) && typeof f.note === 'string')
    .slice(0, 3).map((f) => ({ id: f.id, note: cleanText(f.note.slice(0, 800)).text.slice(0, 600) }));
  let picture = null; // { id, reason, attached, note } for the reply and the context
  // The voice: the child's speech since the last turn (seconds the microphone sent, as the page
  // measured them, at most 90), and whether the tutor's words will be spoken. Every reply from
  // here on is priced with its speech, guard replies included.
  const voice = body?.voice === true;
  const audioS = Math.max(0, Math.min(MAX_AUDIO_S, Number(body?.audio_in_s) || 0));
  const listenUsd = listenCost(audioS);
  // A silence probe: only when the child sent nothing (no words, no picture).
  const probe = !message && !body?.snapshot ? cleanProbe(body?.probe) : null;
  const elapsedMin = Math.max(0, Number(body?.elapsed_s) || 0) / 60;
  let careEnds = false;
  // The orchestrator's decision for this turn (none for a care turn: that is never a teaching turn).
  // The warm-up's first maths question is on the weakest earlier skill (or the target's nearest one); null when the target has none.
  const pre = preFor({ target: pick.target, prerequisite: pick.prerequisite, prerequisites: prerequisitesOf(pick.target), nameOf: skillName });
  const decision = concern ? null : decide(lesson0, { turnIndex, elapsedMin, sessionMinutes: settings.sessionMinutes || 20, marked, message, probe, question, prerequisite: pick.prerequisite ? skillName(pick.prerequisite) : null, pre, lastQ: lastSpokenQ });
  // Answers the child has found are theirs to hear back: never hidden again (12 Nov 2026: about 20 turns were stopped
  // for HOREB repeating the child's own right answer).
  const found = new Set([...lesson0.found, ...(marked?.canon ? [marked.canon] : [])]);
  const hiddenOk = (it) => !!it && !found.has(canonAnswer(it.answer));
  // The end of every turn: the answer judged and recorded, the lesson state moved on, what the tester sees.
  const closeTurn = async ({ steps, assessment = null, hidden = [], codeNotes = [], fromModel = null }) => {
    const judged = concern ? null : finalClass({ assessment, marked, message });
    await recordJudged(judged);
    // A care reply pauses the lesson; a crisis ends it. The question the child did not answer stays open one more turn.
    // (A silence probe keeps it too: the child is still on that question.)
    const asks = steps.some((x) => x.cmd === 'ask');
    const keepSeal = asks ? null : unanswered ? unanswered.seal : probe ? lesson0.seal : null;
    const lesson = concern ? { ...lesson0, turns: lesson0.turns + 1, care: careEnds ? 'ended' : 'paused', seal: null }
      : updateLesson(lesson0, { decision, steps, judged, marked, probe, elapsedMin, keepSeal, childWords: wordsIn(message), preNeeded: !!pre, thinkS: Number.isFinite(Number(body?.think_s)) && body?.think_s != null ? Number(body.think_s) : null, board });
    // The model's evidence is the child's own words; checked again so no hidden answer rides in it.
    const evidence = judged?.evidence && checkTurnText([{ cmd: 'say', text: judged.evidence }], hidden).ok ? judged.evidence : '';
    const tester = {
      rule: decision?.rule || null, moves: decision?.moves || [], with: decision?.with || [], reason: decision?.reason || null, stageMax: decision?.stageMax || null,
      judged: judged ? { class: judged.class, misconception: judged.misconception, source: judged.source, note: judged.note, evidence } : null,
      kept: [...judgeTurn(decision, steps, { fromModel, authored: !fromModel }), ...codeNotes], probe,
      unanswered: unanswered ? unanswered.why : null,
      ...(heardFrom ? { heard: `"${heardFrom.slice(0, 40)}" read as "${message.slice(0, 40)}": a number was asked for` } : {}),
    };
    return { lesson, tester };
  };
  const meta = () => ({ type: 'meta', target: pick.target, prerequisite: pick.prerequisite, marked, picture: picture && { id: picture.id, used: !!picture.attached, reason: picture.reason, why: picture.why || null } });
  // An authored turn (guards, caps, no key), streamed the same way as the model's.
  const authored = (steps, guard, spent) => ({ status: 200, go: async (emit) => {
    emit(meta());
    const v = validateTurn({ steps }, vopts);
    for (const st of v.steps) emit({ type: 'step', step: await sealAsk(st, []) });
    const voiceUsd = await meterVoice(v.steps);
    const closed = await closeTurn({ steps: v.steps, hidden: [open].filter(Boolean) });
    const ending = v.steps.find((x) => x.cmd === 'end_session');
    if (ending && !concern) await finishLesson({ db, user, child, sid, target: pick.target, summary: ending.summary, lib, now });
    emit({ type: 'end', guard, dropped: v.dropped, notes: v.notes, cost_usd: voiceUsd.usd, spent: spent ? addSpent(spent, voiceUsd.usd) : null, voice: voiceUsd, model: null, ...closed });
  } });
  // The voice's price for what was actually sent: the spoken characters and the child's speech.
  const meterVoice = async (steps) => {
    const chars = voice ? spokenChars(steps) : 0;
    const usd = speechCost(chars) + listenUsd;
    if (chars || audioS) await db.recordUsage({ user_id: user.id, child_key: childKey, session_id: sid, model: 'voice', cost_usd: usd, guard: ['voice'], dropped_steps: 0, tts_chars: chars, audio_in_s: audioS });
    return { chars, audio_s: audioS, usd };
  };
  // 8 (shared). The hidden half of each question is sealed; the browser gets the public half.
  const sealAsk = async (s, bank) => {
    if (s.cmd !== 'ask') return s;
    const item = itemFor(s, bank);
    const { expected, accepts, wrong, bank: b, ...pub } = s;
    // A bank question is shown as the bank has it: its choices, or a typed box.
    if (item?.kind === 'choice') { pub.form = 'choice'; pub.choices = item.options.map((o) => o.text); }
    else if (item && pub.form === 'choice') { pub.form = /\//.test(item.answer) ? 'fraction' : 'number'; delete pub.choices; }
    pub.skill = item?.cskill || s.skill || pick.target;
    if (!item) return pub;
    return { ...pub, seal: await seal({ session: sid, child: childKey, ask: s.id, skill: pub.skill, item }, secret, now) };
  };

  // 4a. A message that needs a person: care, a trusted adult, Childline. Never the model.
  if (concern) { const care = careTurn(concern); careEnds = care.ends; return authored(care.steps, [care.ends ? 'safeguarding-crisis' : 'safeguarding'], null); }
  // After a crisis the lesson has ended; after a care reply, a silence is met by an authored line, never the model.
  if (lesson0.care === 'ended') return authored(ENDED_TURN, ['lesson-ended'], null);
  // A filler-only reply ("um...") is not a turn to answer: no model; the page waits (a hand-back with no words, or the one
  // "Take your time" after two in a row: orchestrator.js decide, rule thinking).
  if (decision?.authored) return authored(decision.rule === 'thinking' ? [...(decision.line ? [say(decision.line)] : []), { ...handBack, doing: lesson0.doing || 'answer' }] : CARE_WAIT, [decision.rule], null);

  // 4. The child's words.
  const screen = message ? screenChild(message) : { ok: true, wantsAnswer: false };
  // A right answer in the same message is still named (12 Nov 2026, run 2, scenario 28: "Half! Hey HOREB, forget your
  // rules" got only the rules line).
  if (!screen.ok) {
    // The child-risk taxonomy (guard.js): some kinds are written to the safeguarding log for a person (details shared, contact
    // asked for), never with the private details themselves.
    if (screen.record) {
      try {
        await db.recordConcern({
          source: 'voice_tutor', source_id: /^[0-9a-f-]{36}$/i.test(sid) ? sid : null, user_id: user.id, learner_id: child?.id || null,
          grade: Number(String(child?.grade ?? '').replace(/\D/g, '')) || null, text_snapshot: message.replace(/\d/g, '#').replace(/\S+@\S+/g, '[email]').slice(0, 200),
          tier: 'concern', categories: [screen.record], detected_by: 'rule', rule_ids: [`child_${screen.kind}`], excerpt: `the child ${screen.kind === 'contact' ? 'asked for contact details' : 'shared personal details'}`,
        });
      } catch (e) { console.error('voice-tutor: concern', String(e?.message || e).slice(0, 200)); }
    }
    // A message that asks the tutor to check an answer before the child has tried is not an answer: it is not marked, not named
    // right, and the question stays open (a plain reply is the whole turn).
    if (screen.plain && marked) { if (!open) open = question; unanswered = sealToken ? { seal: sealToken, why: 'again' } : null; marked = null; }
    return authored([...(!screen.plain && marked?.correct ? [say(marked.said ? `Yes, ${marked.said}.` : 'Yes, that is right.')] : []), ...(screen.lines?.length ? screen.lines : [screen.reply]).map((t) => say(t)), handBack], [screen.kind], null);
  }

  // 5. The caps.
  let spent;
  try { spent = await db.spend({ sessionId: sid, childKey, since: dayStart(now) }); } catch (e) {
    return reply(503, { error: 'The tutor cannot check its spending (has the voice_tutor_usage migration been run?).' });
  }

  // The picture of the child's work, if one came: checked, throttled, and never past a cap.
  let image = null;
  if (body?.snapshot) {
    const snap = validateSnapshot(body.snapshot);
    const id = /^snap-[0-9]{1,3}$/.test(String(body.snapshot.id)) ? body.snapshot.id : null;
    if (snap.error) picture = { id, reason: body.snapshot.reason, attached: false, why: snap.error, note: 'A picture of the child\'s work was taken but could not be read. Say you could not see it, and ask them to write it again, bigger, or to type it.' };
    else if (!snap.strokes) picture = { id, reason: snap.reason, attached: false, why: 'no child writing', note: 'The child asked you to look, but there is no writing of theirs on the board yet. Ask them to write their working first.' };
    else if ((spent.snapshots || 0) >= settings.maxSnapshots) picture = { id, reason: snap.reason, attached: false, why: 'snapshot-cap', note: 'No more pictures this lesson. Ask the child to type what they wrote.' };
    else if (spent.lastSnapshotAt && now - Date.parse(spent.lastSnapshotAt) < CHECK_GAP_MS) picture = { id, reason: snap.reason, attached: false, why: 'snapshot-throttled', note: null };
    else { image = snap; picture = { id: snap.id, reason: snap.reason, attached: true }; }
  }
  // Caps, counting what this turn will cost (its picture and its voice included) before it is made.
  const imageUsd = image ? (imageTokens(image.w, image.h) * (PRICES[settings.model]?.input ?? 2)) / 1e6 : 0;
  const est = TURN_ESTIMATE_USD + imageUsd + listenUsd + (voice ? speechCost(VOICE_TURN_CHARS_ESTIMATE) : 0);
  const cap = capCheck({ sessionUsd: spent.session + est, dayUsd: spent.day + est, turns: turnIndex }, settings);
  if (!cap.ok) return authored(WIND_DOWN, [cap.reason], spent);
  // The question still open (wrong, or not answered yet): the recovery may put it again. Never one answered right.
  const openPrompt = open?.question || null;
  // What a line the code says may rest on: the board as the child sees it now (the turn's own drawings too), the open
  // question (sealed, else the tutor's last spoken one) and a check that the line gives no hidden answer away.
  const safeLine = (line) => checkTurnText([say(line)], [open].filter(hiddenOk)).ok;
  const recoverFacts = (steps = []) => ({ message, board: boardAfter(board, steps), turnIndex, found: [...found], ack: decision?.ack || 'yes', lastQuestion: lastSpokenQ, safe: safeLine });
  const recoverFor = (saidAny, steps = []) => recoverSteps(recoverLines({ rule: decision?.rule, probe, marked, openPrompt, saidAny, doing: probe ? lesson0.doing : null, ...recoverFacts(steps) }));
  if (!callModel) return authored(image ? NO_PICTURE_TURN : screen.wantsAnswer ? [say(ANSWER_REPLY), handBack] : recoverFor(false), ['offline'], spent);

  // 6. The model, streamed.
  const bank = probeBank(skills, `${sid}:${turnIndex}`);
  const names = child?.name ? [{ name: child.name, as: 'the child' }] : [];
  const openMis = openMisconceptions(learnerData.rows, skills, { now: nowMs });
  const learnerCtx = learnerLines({ pick, model: skillsModel, open: openMis, profile: learnerData.profile, notes: learnerData.notes, nameOf: skillName, lib, order: FRACTION_SKILLS });
  // The turn brief (PLAN_TO_FOUR.md step 2): what the child did, what must not be said, answer first, the level gate and
  // the standard the move is judged on, all computed here; after the cache breakpoint, so the system prompt never changes.
  const rawHistory = Array.isArray(body?.history) ? body.history.slice(-40).filter((h) => h && typeof h.text === 'string') : [];
  const brief = turnBrief(lesson0, decision, { message, marked, open: hiddenOk(open) ? open : null, board, history: rawHistory, skill: pick.target, probe, turnIndex, maxWords: probe ? MAX_PROBE_WORDS : null });
  // Matched good-turn examples (step 5): an A/B switch, off unless VOICE_TUTOR_MATCHED_EXAMPLES=1.
  const matched = settings.matchedExamples ? exampleLines({ rule: decision?.rule, cls: decision?.prelim, message, probe }) : [];
  const context = turnContext({
    ...pick, learner: learnerCtx, hasModel: skillsModel.hasEvidence, elapsedMin, turnIndex, phase: body?.phase || null,
    board, marked, heard: typeof body?.heard === 'string' ? body.heard.slice(0, 400) : null, wantsAnswer: screen.wantsAnswer,
    bankLines: bankLines(bank), picture, figures, pace: cleanPace(body?.pace),
    lesson: [...lessonLines(lesson0, decision), ...brief, ...matched], probe, inkCells: inkCellsIn, doing: lesson0.doing,
    unanswered: unanswered && question ? { ask: question.question, why: unanswered.why } : null,
  });
  // Earlier lines the child said that a guard would have stopped are never re-sent to the model.
  const PRIVATE_LINE = PRIVATE_LINES.personal;
  const history = rawHistory
    .map((h) => {
      if (h.who !== 'child') return h;
      const sc = screenChild(h.text);
      if (!sc.ok) return { ...h, text: PRIVATE_LINES[sc.kind] || PRIVATE_LINE };
      return screenAll(h.text, safeguard).tier !== 'none' ? { ...h, text: PRIVATE_LINE } : h;
    });
  // A probe thinks as hard as any turn: at low effort 18 of 21 probes came back in the wrong shape (12 Nov 2026), and
  // probes are a few turns a lesson. The effort is outside the cached prompt either way.
  const request = buildRequest({ model: settings.model, effort: settings.effort, lib, history, message, context, names, image, probe });
  // A picture taken because the child paused may get only a nod.
  const nod = !!image && image.reason === 'idle' && !message;
  // The turn gate (step 3): the facts its checks read (habits.js), the same checks the free yardstick counts with.
  const gateOn = settings.gate !== false && !!decision && !['care', 'care-wait', 'care-return'].includes(decision.rule);
  const hctx = habitContext({
    message, marked, cls: decision?.prelim || null, history: rawHistory, hidden: [open].filter(hiddenOk), found: [...found], board,
    level: { level: lesson0.level || 0, wins: lesson0.wins || 0, stage: lesson0.stage }, closing: ['close', 'stop'].includes(decision?.rule) || lesson0.stage === 'wrapup', example: decision?.rule === 'example',
    solved: lesson0.solved || [],
  });

  // The overtalk check (pacing.js pacingFlags) is NOT in the live gate (12 Nov 2026, run 2026-11-12-1824: its failed rewrites
  // dropped whole steps in all five scenarios); the word budget in the brief and the trim hold the length, and the free
  // yardstick still counts overtalk.
  // Stock phrases are noted, never rewritten (P5, run 2026-11-12-1900: the opener rewrite made "You said yes, so I'm not
  // sure yet" out of a fine sentence, and a probe rewrite talked about a shaded half on an uncut circle). The model's
  // sentence plays. A claim of feelings or a promised secret is not stock talk: it is still rewritten.
  const logOnly = (f) => f.habit === 'stock' && !/^(claims a feeling|promises or invites a secret)/.test(f.reason);
  const flagsOf = (st, sofar, extra) => stepFlags(st, hctx, sofar, { extra }).filter((f) => !logOnly(f));
  const stockOf = (st, sofar, extra) => stepFlags(st, hctx, sofar, { extra }).filter(logOnly);

  return { status: 200, go: async (emit) => {
    emit(meta());
    const sent = [];          // steps sent, in order (validated, checked)
    const raws = [];          // the model's steps as written, for validation in sequence
    let validated = 0;        // how many of the validated steps have been handled
    const dropped = []; const notes = []; const guard = []; const codeNotes = [];
    let gateUsage = {}; const rewrites = []; let levelHeld = false; let ended = false;
    // Answers the child has not found: the open question, then any asked now (never one the child has found).
    const hidden = [open].filter(hiddenOk);
    let closed = false;       // pause_for_child / end_session sent, or the turn was stopped
    let saidAny = false;
    // After a right answer, the first say names it (decide: must). The code says it when the model does not.
    let acked = !(decision?.must || []).includes('Name what was right');
    const learned = { interests: [], helps: [] }; // the silent notes of this turn: saved, never sent to the browser
    let ending = null;
    let assessment = null;    // the model's judgement of the child's answer (assess): kept here, never sent as a step
    const send = async (st) => {
      if (st.cmd === 'assess') { assessment = st; return; }
      if (st.cmd === 'note_interest') { learned.interests.push(st.interest); return; }
      if (st.cmd === 'note_what_helped') { learned.helps.push({ move: st.move, helped: st.helped }); return; }
      if (st.cmd === 'end_session') ending = st;
      if (st.cmd === 'say') saidAny = true;
      const pub = await sealAsk(st, bank); sent.push(st); emit({ type: 'step', step: pub });
    };
    // A sentence the code adds (the disclosure, naming what was right, the question spoken): turn 1 discloses first.
    const speak = async (st) => {
      if (turnIndex === 0 && !saidAny && !DISCLOSES.test(st.text)) await send(say(DISCLOSURE));
      await send(st);
    };
    // Asked: a question has been spoken this turn (one question a turn, P5: the code never adds a second).
    const asked = () => sent.some((x) => x.cmd === 'say' && hasQ(x.text));
    const doingNow = () => (probe ? lesson0.doing : null);
    // The turn stopped: what was said stays said, and the tutor carries on in context (recoverLines).
    const stop = async (why) => {
      if (closed) return;
      if (held) { await release(); if (closed) { guard.push(why); return; } }
      guard.push(why);
      if (screen.wantsAnswer && !saidAny) { closed = true; for (const st of [say(ANSWER_REPLY), handBack]) await send(st); return; }
      if (saidAny && asked()) { closed = true; await send(handBackAs(doingNow() || 'answer', sent)); return; }
      const steps = recoverFor(saidAny, sent);
      closed = true;
      for (const st of steps) await (st.cmd === 'say' ? speak(st) : send(st));
    };
    // The turn ends: a turn that has not asked anything yet (and is not a task) ends on its question.
    const endsHere = () => decision?.rule === 'stop' || (decision?.rule === 'close' && saidAny && !asked() && lesson0.stage === 'wrapup');
    const endStep = () => ({ cmd: 'end_session', summary: decision?.rule === 'stop' ? 'The child asked to stop, and the lesson closed.' : 'The lesson closed.' });
    const finish = async () => {
      if (held) await release();
      if (closed) return;
      // A goodbye is a goodbye: the lesson ends, with no question after it (12 Nov 2026, run 2, scenario 19: "Bye! ... What
      // do you think?"; scenario 30: "What is one thing you will remember?" asked five times).
      if (endsHere()) { closed = true; await send(endStep()); return; }
      const doing = doingNow() || doingOf(sent);
      // The child is asked to shade, but nothing on the board can be shaded by them: the bar or circle is offered with the
      // shade control (12 Nov 2026, run 2, scenario 3: "shade them on the bar in the middle", and the child could not).
      if (!probe && !nod) { const offer = shadeOffer(board, sent, vopts); for (const x of offer) await send(x); if (offer.length) codeNotes.push('the child was asked to shade: the shade control was offered'); }
      await endGate();
      if (!asked() && doing !== 'task') {
        const ask = sent.find((x) => x.cmd === 'ask');
        if (ask && /\?\s*$/.test(ask.prompt)) await speak(say(ask.prompt));
        else if (probe) {
          // A probe always ends on a short question (12 Nov 2026, run 2: a probe cut for length left the child in silence),
          // and never the open question again word for word (step 0): the probe's own fact-built question.
          const r = recoverLines({ probe, openPrompt, doing: lesson0.doing, ...recoverFacts(sent) });
          for (const l of saidAny ? r.lines.filter((x) => /\?\s*$/.test(x)).slice(-1) : r.lines) await speak(say(l));
        } else if (!nod || saidAny) {
          // After the model's own words, only the question to hand back; with nothing said, the whole recovery.
          const r = recoverLines({ rule: decision?.rule, marked, openPrompt, saidAny, ...recoverFacts(sent) });
          for (const l of saidAny ? r.lines.filter((x) => /\?\s*$/.test(x)).slice(-1) : r.lines) await speak(say(l));
        }
      }
      closed = true;
      await send(handBackAs(doingNow(), sent));
    };
    const visible = (steps) => steps.filter((x) => ['say', 'write_text', 'write_math', 'ask'].includes(x.cmd));
    const drop = (st, reason, tag = null) => { dropped.push({ index: raws.length - 1, cmd: st.cmd, reason }); if (tag) guard.push(tag); };
    const samePrompt = (a, b) => !!a && !!b && String(a).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === String(b).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    // Names it: tagged so, or opens with a yes, or opens with the child's own words ("Four pieces, yes.").
    const acknowledges = (st) => st.move === 'Name what was right' || /^(yes|yeah|right|correct|exactly|well done|good|great|nice|brilliant|perfect|that'?s right|that is right|you got it|you are right)\b/i.test(st.text)
      || (!!marked?.said && st.text.toLowerCase().split(/\s+/).slice(0, 5).join(' ').replace(/[^a-z' ]/g, '').includes(marked.said.toLowerCase()));

    // After a hedged or one-word answer (decide: ack 'revoice'), no "yes": the child's words said back, then the reason
    // asked for (PLAN_TO_FOUR.md step 4).
    const revoice = decision?.ack === 'revoice';
    const ackLine = () => (marked?.said ? (revoice ? `${marked.said.replace(/^./, (c) => c.toUpperCase())}, you said.` : `Yes, ${marked.said}.`) : (revoice ? 'You said it.' : 'Yes, that is right.'));
    const noYes = (st) => {
      if (!revoice || !confirms(st.text)) return st;
      const text = st.text.replace(/^\s*(yes|yeah|yep|right|correct|exactly|that'?s right|that is right|good|great|well done|perfect|brilliant)\b[\s,!.]*/i, '').replace(/^./, (c) => c.toUpperCase());
      codeNotes.push('gate: no "yes" to a hedged or one-word answer; the yes was taken off');
      return text ? { ...st, text } : st;
    };

    // THE GATE (step 3, made gentler 12 Nov 2026 after run 2026-11-12-1824, where its dropped steps and the stock lines
    // that replaced them made every scenario worse): the habits checked before the child hears or sees a step the model
    // wrote. The code never makes a sentence worse than the model's own:
    //   - a sealed answer said (giveaway) or harder numbers too soon (level_jump) are HARD faults: one rewrite, and if the
    //     rewrite still has a hard fault the sentence is dropped (a hidden answer: the turn stops and recovers in context);
    //   - repeat, stock and unanswered are SOFT: one rewrite, and the better of the two is spoken (fewer faults, not a
    //     repeat, then the shorter), with a note; a soft fault never drops a sentence.
    // A figure labelled with the answer loses its label; board writing that gives an answer away is dropped. At most
    // MAX_REWRITES rewrites a turn (after that a soft fault is kept and noted).
    const MAX_REWRITES = 2;
    const rewrite = async (st, flags, extra) => {
      if (!callModel || rewrites.length >= MAX_REWRITES) return null;
      const req = rewriteRequest({ model: settings.model, text: st.text, reasons: flags, child: message, brief, names, before: sent.filter((x) => x.cmd === 'say').map((x) => x.text) });
      const r = await rewriteOnce(callModel, req);
      gateUsage = addUsage(gateUsage, r.usage);
      const rec = { habits: [...new Set(flags.map((f) => f.habit))], ok: false, ms: r.ms, why: r.why };
      rewrites.push(rec);
      if (!r.text) return null;
      const st2 = { ...st, text: r.text };
      const flags2 = flagsOf(st2, sent, extra);
      if (flags2.length) rec.why = 'the rewrite failed its checks too'; else rec.ok = true;
      return { st: st2, flags: flags2 };
    };
    const FIGS = ['shape', 'fraction_bar', 'figure'];
    // @returns the step to go on with, or null when it was dropped (or the turn stopped)
    const gate = async (st, extra) => {
      if (st.cmd === 'say') { const stock = stockOf(st, sent, extra); if (stock.length) codeNotes.push(`gate: noted, not rewritten (${stock.map((f) => `stock: ${f.reason}`).join('; ').slice(0, 200)})`); }
      const flags = flagsOf(st, sent, extra);
      if (!flags.length) return st;
      const why = flags.map((f) => `${f.habit}: ${f.reason}`).join('; ').slice(0, 300);
      if (st.cmd === 'say') {
        const fixed = await rewrite(st, flags, extra);
        if (fixed && !fixed.flags.length) { codeNotes.push(`gate: rewritten (${why})`); if (flags.some((f) => f.habit === 'level_jump')) levelHeld = true; return fixed.st; }
        if (hardOf(flags).length) {
          // The hard fault is gone in the rewrite (only a soft one is left): the rewrite is spoken.
          if (fixed && !hardOf(fixed.flags).length) { codeNotes.push(`gate: rewritten (${why}); the rewrite still ${fixed.flags.map((f) => f.habit).join('+')}, kept`); if (flags.some((f) => f.habit === 'level_jump')) levelHeld = true; return fixed.st; }
          if (flags.some((f) => f.habit === 'giveaway' && /hidden answer/.test(f.reason))) { await stop('answer-leak'); return null; }
          if (flags.some((f) => f.habit === 'level_jump')) levelHeld = true;
          drop(st, `gate: ${why}`, flags.some((f) => /inside its own question/.test(f.reason)) ? 'answer-in-question' : 'gate-dropped');
          return null;
        }
        // Soft faults only: the better of the model's sentence and the rewrite, never nothing.
        const pickRewrite = !!fixed && !hardOf(fixed.flags).length && softScore(fixed) < softScore({ st, flags });
        codeNotes.push(`gate: kept the ${pickRewrite ? 'rewrite' : 'model\'s sentence'} (${why})${fixed ? '' : '; no rewrite was made'}`);
        return pickRewrite ? fixed.st : st;
      }
      // The child's own cut or shading drawn for them (P5): the drawing is not made, and the turn hands back there.
      if (flags.some((f) => /^does the child's step/.test(f.reason))) { drop(st, `gate: ${why}`, 'child-step'); await stop('child-step'); return null; }
      if (FIGS.includes(st.cmd) && flags.some((f) => f.habit === 'giveaway')) {
        codeNotes.push(`gate: ${why}; the label was taken off`);
        st = st.cmd === 'figure' ? { ...st, params: { ...st.params, label: false } } : { ...st, label: false };
      } else if (['write_text', 'write_math'].includes(st.cmd) && flags.some((f) => f.habit === 'giveaway')) { drop(st, `gate: ${why}`, 'gate-dropped'); return null; }
      if (flags.some((f) => f.habit === 'level_jump')) {
        // The sentence that brought in harder numbers was rewritten or dropped: its picture and question go with it.
        if (levelHeld && (FIGS.includes(st.cmd) || st.cmd === 'number_line' || st.cmd === 'ask')) { drop(st, `gate: ${why}`, 'gate-level'); return null; }
        codeNotes.push(`gate: ${why} (noted)`);
      }
      return st;
    };
    // The checks only the whole turn answers, once, before the hand-back: "yes" to a hedged answer with no question about
    // the reason gets that question, from the child's own words, when the turn has asked nothing else.
    const endGate = async () => {
      if (ended || !gateOn) return;
      ended = true;
      // After an unsure or one-word right answer the reason is always asked (decide: ack 'revoice'), once.
      const says = sent.filter((x) => x.cmd === 'say');
      if (revoice && !probe && !asked() && !says.some((x) => asksReason(x.text))) {
        await speak({ cmd: 'say', text: marked?.said ? `What made you say ${marked.said}?` : 'What made you say that?', move: 'Press for reasoning' });
        codeNotes.push('gate: an unsure or one-word answer, and no question about the reason: the reason was asked');
      }
      for (const f of endFlags(sent, hctx)) {
        if (f.habit === 'confirm_hedged' && !asked() && !probe && decision?.press) {
          const w = marked?.said || null;
          await speak({ cmd: 'say', text: w ? `What made you say ${w}?` : 'What made you say that?', move: 'Press for reasoning' });
          codeNotes.push(`gate: ${f.reason}; the reason was asked`);
        } else codeNotes.push(`gate: ${f.reason} (noted)`);
      }
    };

    // The answer-in-question check, against the sealed answers only. `extra`: an answer about to be sealed (the next ask).
    const aiqText = (steps) => visibleText(visible(steps)).map((x) => x.text).join(' ');
    const givesAway = (st, extra = []) => {
      const answers = [...hidden.map((h) => h.answer), ...extra];
      const opts = { found: [...found], child: message, answers };
      const hit = answerInQuestion(aiqText([...sent, st]), opts);
      return hit && !answerInQuestion(aiqText(sent), opts) ? hit : null;
    };
    // A sentence that would give the answer away IF the question it asks were sealed with that count waits, with the
    // drawings that follow it, for the next sentence, ask or hand-back: when that is the ask, its answer is known and the
    // check is made against it; anything else, it is said as it was.
    // ONE QUESTION A TURN (P5, run 2026-11-12-1900: "two questions in one turn to a child who is already lost"): a sentence
    // with a question waits, with its drawings, for the next sentence; when that one asks a question too, the earlier
    // question is not said (its other sentences are). Inside one say, only the last question is kept.
    let held = null;
    const mayGiveAway = (st) => st.cmd === 'say' && !!answerInQuestion(aiqText([...sent, st]), { found: [...found], child: message }) && !answerInQuestion(aiqText(sent), { found: [...found], child: message });
    const WAITS = [...DRAWN.filter((c) => c !== 'write_text'), ...MARKS, 'erase', 'clear', 'set_phase', 'record_diagnosis', 'note_interest', 'note_what_helped', 'assess'];
    const release = async (next = null) => {
      if (!held) return;
      let [h, ...rest] = held; held = null;
      const it = next?.cmd === 'ask' ? itemFor(next, bank) : null;
      if (next?.cmd === 'say' && hasQ(next.text) && hasQ(h.text)) {
        const kept = dropQuestions(h.text);
        codeNotes.push(`one question a turn: "${lastQ(h.text).slice(0, 60)}" was not said, a later question was`);
        h = kept ? { ...h, text: kept } : null;
      }
      if (h) await step(h, it && hiddenOk(it) ? [it.answer] : [], true);
      for (const x of rest) await step(x, [], true);
    };
    // Steps the model wrote (the code's own sentences are never held to a move tag).
    const fromModel = new Set();
    const usedIds = new Set(lesson0.asked || []);
    // One step, validated, as it arrives: checked before the child hears or sees anything of it.
    const step = async (st, extra = [], releasing = false) => {
      if (closed) return;
      if (!releasing) {
        fromModel.add(st);
        if (held && WAITS.includes(st.cmd)) {
          // A drawing that does the child's step asked in the held sentence (P5): not drawn; the sentence, its question
          // included, is said as it was, and the turn hands back there.
          if (gateOn && FIGS.includes(st.cmd) && flagsOf(st, [...sent, ...held]).some((f) => /^does the child's step/.test(f.reason))) {
            drop(st, 'gate: does the child\'s step (the question asks the child to do it, and the drawing does it)', 'child-step');
            await release(); if (!closed) await stop('child-step');
            return;
          }
          held.push(st); return;
        }
        if (held) await release(st);
        if (closed) return;
        if (st.cmd === 'say') {
          const one = lastQuestionOnly(st.text);
          if (one !== st.text) { codeNotes.push(`one question a turn: only the last question of "${st.text.slice(0, 60)}" was kept`); const st2 = { ...st, text: one }; fromModel.add(st2); st = st2; }
        }
        if (mayGiveAway(st) || (st.cmd === 'say' && hasQ(st.text))) { held = [st]; return; }
      }
      if (st.cmd === 'ask' && usedIds.has(st.id)) {
        // A question id used before this lesson gets a new one: the evidence row is keyed by it (12 Nov 2026, run 2: "p1q"
        // was reused with a different answer).
        let k = 2; while (usedIds.has(`${st.id.slice(0, 20)}_${k}`)) k += 1;
        const id = `${st.id.slice(0, 20)}_${k}`;
        codeNotes.push(`question id ${st.id} was used before this lesson, so it is ${id}`);
        st = { ...st, id };
      }
      if (st.cmd === 'ask') {
        usedIds.add(st.id);
        // The warm-up's first maths question is on the weakest earlier skill (decide: preFirst): a question on anything else
        // is not asked, and the lesson stays in the warm-up until the right one is.
        if (decision?.preFirst && !probe) {
          const onSkill = itemFor(st, bank)?.cskill || st.skill || pick.target;
          if (!askIsOnPre(pre, { skill: onSkill, prompt: st.prompt })) { drop(st, `warm-up: the first maths question must be on ${decision.preFirst.name}, not ${skillName(onSkill)}`, 'prereq-first'); return; }
        }
        // Never the question the child has just answered right (12 Nov 2026: right answers were re-asked).
        if (decision?.answered && samePrompt(st.prompt, decision.answered.prompt)) { drop(st, 'asks again the question the child has just answered right', 're-ask'); return; }
        const it = itemFor(st, bank);
        if (hiddenOk(it)) {
          // Its answer was already said in this turn ("into four equal pieces" ... "How many pieces?"): not asked, and the turn goes on.
          if (!checkTurnText(visible(sent), [it]).ok) { drop(st, 'its answer was already said in this turn, so it is not asked', 'answer-before-ask'); return; }
          hidden.push(it);
        }
      }
      if (gateOn && fromModel.has(st) && ['say', 'write_text', 'write_math', 'shape', 'fraction_bar', 'figure', 'number_line'].includes(st.cmd)) {
        const g = await gate(st, extra);
        if (!g) return;
        if (g !== st) fromModel.add(g);
        st = g;
      } else if (gateOn && st.cmd === 'ask' && levelHeld) {
        const g = await gate(st, extra);
        if (!g) return;
        st = g;
      }
      if (visible([st]).length) {
        const leak = checkTurnText(visible([...sent, st]), hidden);
        if (!leak.ok) { console.warn('voice-tutor: answer leak', leak.reasons.slice(0, 2)); await stop('answer-leak'); return; }
        const text = st.text || st.prompt || '';
        if (safeguard && text && safeguard(text)?.tier !== 'none') { await stop('unsafe-reply'); return; }
      }
      if (st.cmd === 'say' || st.cmd === 'write_text') {
        // The answer inside its own question, in the same turn: that sentence is not said, and the turn goes on. Only the
        // sealed answers count (the open question's and any asked so far this turn, plus the one the next ask seals).
        const aiq = givesAway(st, extra);
        if (aiq) { drop(st, `gives the answer inside its own question: ${aiq}`, 'answer-in-question'); return; }
      }
      if (st.cmd === 'say') {
        // After a right answer: name it first, in the child's words.
        if (!acked) {
          acked = true;
          st = noYes(st);
          if (!acknowledges(st) || (revoice && confirms(st.text))) { await speak({ cmd: 'say', text: cleanText(ackLine()).text.slice(0, LIMITS.say), move: 'Name what was right' }); codeNotes.push('the code named what was right first: the model\'s first sentence did not'); }
        }
        // Short turns: past the limit the tutor stops talking; a short question at the end of the sentence is kept.
        const limit = probe ? MAX_PROBE_WORDS : turnIndex === 0 ? MAX_SPOKEN_WORDS + 20 : wordCap(turnIndex);
        const disclosure = turnIndex === 0 && !saidAny && !DISCLOSES.test(st.text) ? spokenWords([say(DISCLOSURE)]) : 0;
        if (spokenWords([...sent, st]) + disclosure > limit) {
          // Past the limit the turn ends here, trimmed, never emptied (12 Nov 2026, run 2: whole probes were dropped and
          // the child sat in silence): the sentence's final question is kept, and as many of its first sentences as fit.
          guard.push(probe ? 'too-long-probe' : 'too-long');
          const text = trimToWords(st.text, limit - spokenWords(sent) - disclosure, { mustSay: !saidAny });
          if (text) await speak({ ...st, text });
          await finish();
          return;
        }
        await speak(st);
        return;
      }
      // Handing back having said nothing is not a turn (except a nod after an idle picture). A question on the board that
      // was not said (its sentence was dropped) is said before the hand-back.
      // A goodbye hands nothing back: the lesson ends there (the model wrote a hand-back after its goodbye).
      if (st.cmd === 'pause_for_child' && endsHere()) { closed = true; await send(endStep()); return; }
      if (st.cmd === 'pause_for_child' && !(nod && !saidAny)) {
        const ask = sent.find((x) => x.cmd === 'ask');
        const sayable = ask && /\?\s*$/.test(ask.prompt);
        if (!saidAny && !sayable) { await stop('invalid-turn'); return; }
        if (sayable && !asked()) await speak(say(ask.prompt));
        await endGate();
        if (!probe) { const offer = shadeOffer(board, sent, vopts); for (const x of offer) await send(x); if (offer.length) { st = { ...st, doing: 'task' }; codeNotes.push('the child was asked to shade: the shade control was offered'); } }
      }
      await send(st);
      if (st.cmd === 'pause_for_child' || st.cmd === 'end_session') closed = true;
    };
    const handle = async (raw) => {
      if (closed) return;
      raws.push(raw && !raw.__bad ? raw : { cmd: '__bad' });
      // Validate in sequence: the step as it stands after everything before it. One step may come out as two (an erase
      // that makes room on a full board, then the drawing).
      const v = validateTurn({ steps: raws }, vopts);
      const bad = v.dropped.find((d) => d.index === raws.length - 1);
      if (bad) { dropped.push(raw?.__bad ? { ...bad, reason: `not readable: ${String(raw.__bad).slice(0, 140)}` } : bad); raws.pop(); return; }
      notes.splice(0, notes.length, ...v.notes);
      const fresh = v.steps.slice(validated);
      validated = v.steps.length;
      for (const st of fresh) await step(st);
    };

    let usage = {}; let stopReason = null;
    const parser = stepParser();
    let queue = Promise.resolve();
    try {
      const res = await callModel({ ...request, stream: true }, {
        onText: (t) => { const got = parser.push(t); queue = queue.then(async () => { for (const raw of got) await handle(raw); }); },
      });
      await queue;
      usage = res?.usage || {}; stopReason = res?.stop_reason || null;
    } catch (e) {
      await queue.catch(() => {});
      console.error('voice-tutor: model', String(e?.message || e).slice(0, 200));
      await stop('model-error');
      guard.push(`model-error: ${String(e?.message || e).slice(0, 180)}`); // shown in the tester view
    }
    if (stopReason === 'refusal') await stop('refusal');
    // Nothing usable said: the tutor carries on in context. Said something but did not hand back: hand back.
    if (!closed && !saidAny && !(nod && sent.length === 0)) await stop('invalid-turn');
    await finish();
    // The turn's call and its rewrites, billed as one.
    usage = addUsage(usage, gateUsage);
    const cost = costOf(settings.model, usage);
    if (rewrites.length) codeNotes.push(`gate: ${rewrites.length} rewrite${rewrites.length === 1 ? '' : 's'} (${rewrites.map((r) => `${r.habits.join('+')} ${r.ok ? 'ok' : `failed${r.why ? `: ${r.why}` : ''}`} in ${r.ms} ms`).join(', ')})`);
    await logUsage(db, { user, childKey, sid, settings, cost, meter: usage, guard, dropped: dropped.length, image });
    const voiceUsd = await meterVoice(sent);
    // What the tutor learned about the child, and, at the end of the lesson, the note and the report. Never fails the turn.
    await saveLearned({ db, sid, user, child, learned, now });
    const done = await closeTurn({ steps: sent, assessment, hidden, codeNotes, fromModel });
    if (ending) await finishLesson({ db, user, child, sid, target: pick.target, summary: ending.summary, lib, now });
    emit({ type: 'end', guard, dropped, notes, cost_usd: cost + voiceUsd.usd, spent: addSpent(spent, cost + voiceUsd.usd), voice: voiceUsd, model: settings.model, ...done });
  } };
}

/** The whole turn collected (the tests, and anything that does not stream): { status, body: { steps, ...meta, ...end } }. */
export async function runTutorTurn(args) {
  const t = await prepareTurn(args);
  if (!t.go) return t;
  const body = { steps: [], events: [] };
  await t.go((ev) => {
    body.events.push(ev);
    if (ev.type === 'step') body.steps.push(ev.step);
    else { const { type, ...rest } = ev; Object.assign(body, rest); }
  });
  return { status: 200, body };
}

// ---------------------------------------------------------------- shading offered
const SHADE_ASK = /\b(shade|colour in|color in)\b/i;
const SHADE_SHAPES = { fraction_bar: 'bar', shape: 'circle' };
/** The board as this turn leaves it: the page's board, then the turn's drawings and erasures. */
const boardAfter = (board, steps) => {
  const items = new Map(board.map((b) => [b.id, b]));
  for (const x of steps) {
    if (DRAWN.includes(x.cmd)) items.set(x.id, x);
    else if (x.cmd === 'erase') for (const t of x.targets) items.delete(t);
    else if (x.cmd === 'clear') items.clear();
  }
  return [...items.values()];
};
/**
 * When a turn asks the child to shade and nothing on the board has the shade control, the bar or circle it is about (the
 * one pointed at this turn, else the newest) is redrawn in its place as a fraction figure the child can shade: an erase
 * and a figure, checked as any steps are. [] when there is nothing to offer.
 */
export function shadeOffer(board = [], steps = [], vopts = {}) {
  if (!steps.some((x) => x.cmd === 'say' && SHADE_ASK.test(x.text) && !/\b(I|I'll|I will|let me)\s+(shade|colour|color)\b/i.test(x.text))) return [];
  const now = boardAfter(board, steps);
  if (now.some((b) => b.cmd === 'figure' && (b.controls || []).some((c) => c.startsWith('shade')))) return [];
  const can = (b) => {
    if (!(b.cmd in SHADE_SHAPES) || (b.cmd === 'shape' && b.kind !== 'circle')) return false;
    const sh = b.shaded;
    return Number.isInteger(sh) || (Array.isArray(sh) && sh.every((p, k) => p === k + 1));
  };
  const pointed = [...steps].reverse().map((x) => (MARKS.includes(x.cmd) ? x.target : null)).find((id) => id && now.some((b) => b.id === id && can(b)));
  const target = now.find((b) => b.id === pointed) || [...now].reverse().find(can);
  if (!target) return [];
  const count = (sh) => (Array.isArray(sh) ? sh.length : Number(sh) || 0);
  const params = { shape: SHADE_SHAPES[target.cmd], parts: target.parts, shaded: count(target.shaded), label: false, ...(target.second_bar ? { second: { parts: target.second_bar.parts, shaded: count(target.second_bar.shaded) } } : {}) };
  const offer = [
    { cmd: 'erase', targets: [target.id] },
    { cmd: 'figure', id: target.id, type: 'fraction', params, controls: target.second_bar ? ['shade', 'shade_second'] : ['shade'], slot: target.slot, ...(target.colour ? { colour: target.colour } : {}) },
  ];
  const v = validateTurn({ steps: offer }, { ...vopts, board: now });
  return v.dropped.length ? [] : v.steps;
}

// ---------------------------------------------------------------- the question the child last heard
const Q_KIND = /\b(how many|how much|what fraction|which|what (?:did|do|does|could|can|would|happens)|why|how (?:did|do|can)|is it|is that|is this|are they|more|less|same|bigger|smaller)\b/i;
const kindOfQ = (q) => { const m = Q_KIND.exec(String(q || '')); return m ? m[1].toLowerCase().replace(/^which$/, 'what fraction').replace(/^(more|less|same|bigger|smaller)$/, 'compare') : null; };
const Q_SKIP = new Set(['what', 'how', 'many', 'the', 'and', 'are', 'there', 'this', 'that', 'does', 'did', 'you', 'your', 'now', 'with', 'have', 'has', 'all', 'can', 'tell', 'think', 'make', 'makes', 'look', 'about', 'many', 'into', 'from', 'one', 'two', 'three', 'four']);
const contentOf = (t) => new Set(String(t || '').toLowerCase().replace(/[^a-z0-9/ ]+/g, ' ').split(/\s+/).filter((w) => w.length >= 3 && !Q_SKIP.has(w)));
/**
 * The tutor's last spoken question (in its last turn, from the transcript the page sends) is a different question from
 * the sealed one: another kind ("how many" against "what fraction"), or few words in common.
 */
export function askedOther(history, prompt) {
  const h = Array.isArray(history) ? history : [];
  let i = h.length - 1;
  while (i >= 0 && h[i]?.who !== 'tutor') i -= 1;
  let q = null;
  for (; i >= 0 && h[i]?.who === 'tutor'; i -= 1) {
    const qs = String(h[i].text || '').split(/(?<=[.!?])\s+/).filter((x) => /\?\s*$/.test(x));
    if (qs.length) { q = qs[qs.length - 1]; break; }
  }
  if (!q || !prompt) return false;
  const ka = kindOfQ(q); const kb = kindOfQ(prompt);
  if (ka && kb && ka !== kb) return true;
  const a = contentOf(q); const b = contentOf(prompt);
  if (!a.size || !b.size) return false;
  let shared = 0; for (const w of a) if (b.has(w)) shared += 1;
  return shared / Math.min(a.size, b.size) < 0.5;
}

/**
 * A sentence (a say of one to three sentences) cut to `budget` words: its final question is kept (up to 12 words over,
 * so the child always has something to answer), then as many of its first sentences as fit before it. With no question,
 * the first sentences that fit; when nothing fits and nothing has been said yet (`mustSay`), the first sentence.
 * Returns '' when nothing can be said.
 */
export function trimToWords(text, budget, { mustSay = false } = {}) {
  const sents = String(text || '').split(/(?<=[.!?])\s+/).filter(Boolean);
  const n = (x) => x.split(/\s+/).filter(Boolean).length;
  const last = sents[sents.length - 1] || '';
  const q = /\?\s*$/.test(last) ? last : null;
  const head = q ? sents.slice(0, -1) : sents;
  let left = budget - (q ? n(q) : 0);
  if (q && left < -12) return mustSay ? q : '';
  const kept = [];
  for (const x of head) { if (n(x) > left) break; kept.push(x); left -= n(x); }
  if (q) return [...kept, q].join(' ');
  if (kept.length) return kept.join(' ');
  if (!mustSay || !head.length) return '';
  // Nothing fits and nothing has been said: the first sentence, cut at its last comma within the limit.
  const w = head[0].split(/\s+/).filter(Boolean);
  if (w.length <= Math.max(budget, 4)) return head[0];
  const cut = w.slice(0, Math.max(budget, 4));
  const comma = cut.map((x) => /,$/.test(x)).lastIndexOf(true);
  return `${(comma >= 1 ? cut.slice(0, comma + 1) : cut).join(' ').replace(/[,;:]$/, '')}.`;
}

// One question a turn (P5): the sentences of a say, its questions, and the say with only its last question (or none).
const sentencesIn = (t) => String(t || '').split(/(?<=[.!?])\s+/).filter(Boolean);
const isQs = (x) => /\?\s*$/.test(x);
export const hasQ = (t) => sentencesIn(t).some(isQs);
const lastQ = (t) => sentencesIn(t).filter(isQs).pop() || '';
/** The say with every question but its last taken out. */
export function lastQuestionOnly(text) {
  const ss = sentencesIn(text); const qs = ss.filter(isQs);
  if (qs.length <= 1) return text;
  let n = 0;
  return ss.filter((x) => !isQs(x) || (n += 1) === qs.length).join(' ');
}
/** The say with its questions taken out ('' when it was only questions). */
export const dropQuestions = (text) => sentencesIn(text).filter((x) => !isQs(x)).join(' ');

// The gate's two kinds of fault (above, in prepareTurn): hard ones drop a sentence whose rewrite still has them, soft
// ones never drop anything.
export const HARD_HABITS = ['giveaway', 'level_jump'];
const hardOf = (flags = []) => flags.filter((f) => HARD_HABITS.includes(f.habit));
/** Lower is better: a repeat counts most, then each fault, then the length (words) as the tie-break. */
export const softScore = ({ st, flags = [] }) => (flags.some((f) => f.habit === 'repeat') ? 100 : 0) + 10 * flags.length + Math.min(9, wordsIn(st?.text || '') / 10);

const addSpent = (s, c) => ({ session: (s?.session || 0) + c, day: (s?.day || 0) + c });
export const dayStart = (now) => { const d = new Date(now); d.setUTCHours(0, 0, 0, 0); return d.toISOString(); };

// The picture itself is never stored (milestone 4 decides storage); only that one was sent, and its size.
const logUsage = (db, { user, childKey, sid, settings, cost, meter, guard, dropped, image = null }) => db.recordUsage({
  user_id: user.id, child_key: childKey, session_id: sid, model: settings.model, cost_usd: cost,
  input_tokens: meter.input_tokens ?? 0, output_tokens: meter.output_tokens ?? 0,
  cache_read_tokens: meter.cache_read_input_tokens ?? 0, cache_write_tokens: meter.cache_creation_input_tokens ?? 0,
  guard, dropped_steps: dropped,
  snapshots: image ? 1 : 0, image_tokens: image ? imageTokens(image.w, image.h) : 0,
});

/** The hidden question an `ask` step stands for: a bank item, or one built from the model's own answer and wrong answers. */
export function itemFor(s, bank = []) {
  if (s.bank) {
    const it = bank.find((b) => b.bank === s.bank);
    if (it) return it;
  }
  if (s.form === 'draw' || !s.expected) return null;
  const wrong = (s.wrong || []).filter((w) => w.misconception !== 'other');
  if (s.form === 'choice') {
    const lc = (x) => String(x).trim().toLowerCase();
    return {
      kind: 'choice', cskill: s.skill || null, question: s.prompt, answer: s.expected,
      options: s.choices.map((text, k) => {
        const right = lc(text) === lc(s.expected);
        return { key: 'ABCD'[k], text, right, ...(right ? {} : { mis: wrong.find((w) => lc(w.answer) === lc(text))?.misconception || null }) };
      }),
    };
  }
  return { kind: 'typed', cskill: s.skill || null, question: s.prompt, answer: s.expected, accepts: [s.expected, ...(s.accepts || [])], wrong: wrong.map((w) => ({ value: w.answer, mis: w.misconception })) };
}

export default { prepareTurn, runTutorTurn, itemFor, recoverLines, WIND_DOWN, ENDED_TURN, CARE_WAIT, DISCLOSURE };
