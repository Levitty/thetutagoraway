// ============================================================================
// THE ORCHESTRATOR: the lesson's teaching decisions, in code (step 2 of the conversation
// engine, owner's yes 12 Nov 2026). Before this the model ran the lesson from one big prompt.
// Now the code holds the lesson state and decides which teaching moves are allowed next, and
// why; the model picks one of them and writes the words and the board.
//
// THE LESSON STATE travels with the turns: the page sends it with each request, the server
// cleans it (cleanLesson), decides (decide), checks what the model did (judgeTurn), updates it
// (updateLesson) and returns it in the turn's 'end' event. No table: the browser already
// carries the transcript, and nothing here is trusted beyond its shape (the seal still marks).
//   stage        warmup | teach | guided | independent | wrapup (null before the first turn)
//   doing        what the child is doing now (answer | task | talk), from the last hand-over
//   question     { id, skill, attempts } the question the child is on
//   tried        the representations used on the current idea (bar, circle, number line, ...)
//   rep          the representation used last; sameFails: wrong answers in a row with it
//   hints        smaller-question hints given on the current question
//   classes      the last answers' classes (commands.js ANSWER_CLASSES), newest last
//   streak       'understood' answers in a row at this stage; answers: answers at this stage
//   pending      { ask, skill } a right answer still waiting for its reason
//   prereq       gone back to the earlier skill
//   turns, probes, min (time used, minutes)
//   found        the answers the child has found (canonAnswer forms): no longer hidden, so HOREB may say them back
//   care         'paused' after a care reply (the child said something that needs a person), 'ended' after a crisis
//   stops        times the child has said they want to stop
//   diagnosing   the last turn asked how the child got a wrong answer
//   seal         the open question's seal, kept when the child did not answer it (a question back, "umm")
//   asked        the question ids used this lesson: a reused id is renamed (its evidence row would be overwritten)
//   level        the numbers the child is on (the biggest denominator of the problem: 2 halves, 4 quarters, ...); 0 before
//   changedFails wrong answers since the representation was changed on this idea (two pictures tried or more): after two,
//                one worked example is allowed (READING_12NOV.md change 2, the "never tell" exit; MathDial)
//   examples     worked examples given on this idea (one is allowed; reset when the child understands)
//   fillers      the child's filler-only replies ("um...") in a row since they last said something; tyt: "Take your time"
//                has been said since then (once at most)
//   lastProbe    the turn before was a silence probe (still true across filler-only replies)
//   slow         the pace state for the silences: the child answers slowly but correctly (a right answer after a silence
//                probe, or after thinking 8 s or more), until a wrong answer; the page doubles its silence times (silence.js)
//   wins         successes at that level: understood 1, a bare right answer a half, a hedged one 0; a helped one half that
//                (PLAN_TO_FOUR.md step 2: one more success at the same level before moving up, habits.js nextLevel)
//
// THE RULES (decide), first match wins:
//   first turn                          Open the lesson
//   after a care reply                  the care frame (no maths; a probe is an authored line, never the model);
//                                       the child says carry on: check they are okay, then back gently
//   near the time limit                 Close the lesson
//   wants to stop, bored                offer a short close or a quick game; the second time, close
//   a silence probe                     Wait and nudge, then Smaller-question hint (silence.js kinds)
//   "I don't know"                      Recover a lost child or Smaller-question hint
//   "umm" alone (filler only)           not a turn to answer: no model call; the app waits (a hand-back with no words); after
//                                       two filler-only replies, one "Take your time" at most, never a loop
//   an answer said as a question        an answer (tentative): say it back, then ask how sure they are, how they know
//   a question back                     answer it, then hand the question back (it is not a wrong answer)
//   a wrong answer, second on a changed  the "never tell" exit: ONE worked example, on a different question, with the picture,
//     representation                     then a similar one handed back (the open answer is still never said)
//   a wrong answer, second in a row     change the approach: not the same representation again
//     with the same representation
//   a wrong answer, with how they got it reteach from their way (asking how again is not diagnosing)
//   a wrong answer                      Diagnose the wrong answer: ONE question about how they got it, nothing else
//   the child explains a wrong answer   reteach that one idea
//   right, no reason given              Name what was right, then Press for reasoning
//   understood, once                    Name what was right, then Check for understanding on a fresh example
//   understood, then the fresh check    move on: the next stage is allowed
//   answering "how did you know"        judge the reason, Name what was right, check
//   the last answer: missing earlier    go back to the prerequisite
//     skill
//   otherwise                           the stage's own moves
// After any right answer the decision carries `must` (Name what was right, with the child's own words in `quote`)
// and `answered` (that question is never asked again); tutorTurn.js holds the turn to both.
//
// Pure. Tested in tests/voice-tutor-orchestrator.test.mjs.
// ============================================================================
import { PHASES, PLAYBOOK_MOVES, ANSWER_CLASSES, DOINGS, DRAWN, MAX_SPOKEN_WORDS, wordCap } from './commands.js';
import { wordsIn, talkShare, shareLow, overtalkLimit, explainedTurn, handoverMoves, HANDOVER_RULES } from './pacing.js';
import { PROBE_KINDS } from './silence.js';
import { soundsLost, childMove, wantsToCarryOn, canonAnswer, inWords } from './spokenAnswer.js';
import { gaveReason, readChild, nextLevel, WINS_TO_MOVE_UP, boardAfter, keyStepsFor } from './habits.js';
import { fenceTeamText } from './guard.js';

export { soundsLost };

export const WORKED_EXAMPLE_AFTER = 2; // wrong answers on a changed representation before one worked example is allowed
export const CLOSE_BEFORE_MIN = 3;          // minutes before the end when the lesson closes
const MAX_CLASSES = 6;
const MAX_TRIED = 6;
const ID_RE = /^[a-z][a-z0-9_]{0,23}$/;
const SKILL_RE = /^[A-Z0-9_.]{3,120}$/;
const REPS = ['bar', 'circle', 'grid', 'shape', 'number line', 'story'];

// Moves that may go with any allowed move (reacting to the child is always right).
export const ALWAYS_WITH = ['Revoice and build', 'Name what was right', 'Celebrate the strategy', 'Bring back an off-topic child'];
// Moves a good tutor may make in any stage of the lesson (12 Nov 2026, run 2: "Press for reasoning" and "Name what was
// right" were flagged as not allowed in the warm-up). Only the stage-specific moves are held to the stage. A turn tagged
// with one of these is on plan, except in the turns that are not teaching (STRICT).
export const GENERAL = ['Revoice and build', 'Name what was right', 'Press for reasoning', 'Wait and nudge', 'Smaller-question hint', 'Check for understanding', 'Celebrate the strategy'];
const STRICT = ['care', 'care-wait', 'care-return', 'stop', 'open'];
const STAGE_MOVES = {
  warmup: ['Revoice and build', 'Predict then show', 'Count with the child', 'Smaller-question hint'],
  teach: ['Show then hand over', 'Predict then show', 'Count with the child', 'Revoice and build'],
  guided: ['Show then hand over', 'Count with the child', 'Smaller-question hint', 'Predict then show', 'Check for understanding'],
  independent: ['Check for understanding', 'Stretch the quick child', 'Show then hand over'],
  wrapup: ['Close the lesson'],
};
const PROBE_MOVES = {
  answer_nudge: ['Wait and nudge'],
  answer_smaller: ['Smaller-question hint', 'Recover a lost child'],
  task_checkin: ['Wait and nudge'],
  talk_nudge: ['Wait and nudge', 'Revoice and build'],
  talk_again: ['Smaller-question hint', 'Wait and nudge'],
};
const WRONG = ['partly_right', 'misconception', 'missing_prerequisite', 'guess_or_no_attempt'];

export const newLesson = () => ({
  v: 1, stage: null, doing: null, question: null, tried: [], rep: null, sameFails: 0, hints: 0,
  classes: [], streak: 0, answers: 0, pending: null, prereq: false, turns: 0, probes: 0, min: 0,
  found: [], care: null, stops: 0, diagnosing: false, seal: null, asked: [], level: 0, wins: 0, changedFails: 0, examples: 0,
  cw: 0, tw: 0, lastCw: 0, explain: 0, pre: null,
  fillers: 0, tyt: false, lastProbe: false, slow: false,
});
// The warm-up's first maths question (owner, 12 Nov 2026): 'ask' = it must be asked, 'asked' = waiting for the child's answer, 'done' = answered (right or wrong); null = nothing to check first.
const PRE_STATES = ['ask', 'asked', 'done'];
export const PRE_GIVE_UP_TURNS = 5;  // a lesson that has not got its first prerequisite question out by now carries on (the model is not left to deadlock the lesson)
const MAX_FOUND = 8;
const MAX_ASKED = 24;
const CARE = ['paused', 'ended'];
const SEAL_RE = /^[A-Za-z0-9_-]{8,40}\.[A-Za-z0-9_-]{16,5000}$/;

const int = (v, lo, hi, d = 0) => (Number.isInteger(v) && v >= lo && v <= hi ? v : d);
/** The lesson state as the server accepts it from the page: every field checked, anything else dropped. */
export function cleanLesson(raw) {
  const s = newLesson();
  if (!raw || typeof raw !== 'object' || raw.v !== 1) return s;
  if (PHASES.includes(raw.stage)) s.stage = raw.stage;
  if (DOINGS.includes(raw.doing)) s.doing = raw.doing;
  const q = raw.question;
  if (q && typeof q === 'object' && ID_RE.test(String(q.id))) s.question = { id: q.id, skill: SKILL_RE.test(String(q.skill)) ? q.skill : null, attempts: int(q.attempts, 0, 50) };
  if (Array.isArray(raw.tried)) s.tried = [...new Set(raw.tried.filter((x) => REPS.includes(x)))].slice(-MAX_TRIED);
  if (REPS.includes(raw.rep)) s.rep = raw.rep;
  s.sameFails = int(raw.sameFails, 0, 20);
  s.hints = int(raw.hints, 0, 50);
  if (Array.isArray(raw.classes)) s.classes = raw.classes.filter((c) => ANSWER_CLASSES.includes(c)).slice(-MAX_CLASSES);
  s.streak = int(raw.streak, 0, 50);
  s.answers = int(raw.answers, 0, 200);
  const p = raw.pending;
  if (p && typeof p === 'object' && ID_RE.test(String(p.ask))) s.pending = { ask: p.ask, skill: SKILL_RE.test(String(p.skill)) ? p.skill : null };
  s.prereq = raw.prereq === true;
  s.turns = int(raw.turns, 0, 500);
  s.probes = int(raw.probes, 0, 500);
  s.min = Number.isFinite(raw.min) && raw.min >= 0 && raw.min < 600 ? Math.round(raw.min * 10) / 10 : 0;
  if (Array.isArray(raw.found)) s.found = [...new Set(raw.found.filter((x) => typeof x === 'string' && x.length > 0 && x.length <= 40 && /^[a-z0-9/ '-]+$/.test(x)))].slice(-MAX_FOUND);
  if (CARE.includes(raw.care)) s.care = raw.care;
  s.stops = int(raw.stops, 0, 20);
  s.cw = int(raw.cw, 0, 50000); s.tw = int(raw.tw, 0, 50000); s.lastCw = int(raw.lastCw, 0, 500); s.explain = int(raw.explain, 0, 50);
  if (PRE_STATES.includes(raw.pre)) s.pre = raw.pre;
  s.fillers = int(raw.fillers, 0, 20); s.tyt = raw.tyt === true; s.lastProbe = raw.lastProbe === true; s.slow = raw.slow === true;
  s.diagnosing = raw.diagnosing === true;
  if (typeof raw.seal === 'string' && SEAL_RE.test(raw.seal)) s.seal = raw.seal;
  if (Array.isArray(raw.asked)) s.asked = [...new Set(raw.asked.filter((x) => typeof x === 'string' && ID_RE.test(x)))].slice(-MAX_ASKED);
  s.level = int(raw.level, 0, 24);
  s.wins = Number.isFinite(raw.wins) && raw.wins >= 0 && raw.wins <= 10 ? Math.round(raw.wins * 4) / 4 : 0;
  s.changedFails = int(raw.changedFails, 0, 20);
  s.examples = int(raw.examples, 0, 5);
  return s;
}

// ---------------------------------------------------------------- reading the child
const words = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9'\s/]/g, ' ').split(/\s+/).filter(Boolean);
/**
 * Did the child give a reason with their answer? A few words that explain, beyond the answer itself and the fillers
 * (12 Nov 2026, run 2: "umm... so... it is... one half?" counted as a reason, for "so" and "half"). In habits.js, which
 * the turn gate shares.
 */
export { gaveReason };
// A question that asks how the child got their answer (the Diagnose move, 12 Nov 2026).
export const ASKS_HOW = /\b(how did you|how do you know|how you got|how you know|how would you|how can you tell|why do you think|why did you|what made you|tell me how|show me how|what did you (do|count|look at)|walk me through)\b/i;

/** What the code can tell about an answer before the model reads it: the seal's mark and whether a reason came with it. */
export function prelimClass({ marked = null, message = '' } = {}) {
  if (!marked) return null;
  // A right answer said tentatively ("Is it one half?") is never understood without a reason.
  if (marked.correct) return gaveReason(message) ? 'understood' : 'right_unexplained';
  return marked.misconception ? 'misconception' : 'partly_right';
}

/**
 * The answer's class for the evidence and the next turn: the model's own judgement (assess), held to
 * what the seal says. Where the seal says wrong, the answer can never be understood (or right).
 * @returns {{ class, misconception, evidence, source: 'model'|'code', note: string|null } | null}
 */
export function finalClass({ assessment = null, marked = null, message = '' } = {}) {
  const prelim = prelimClass({ marked, message });
  if (!assessment) return prelim ? { class: prelim, misconception: prelim === 'misconception' ? marked.misconception : null, evidence: '', source: 'code', note: null } : null;
  let cls = assessment.class; let mis = assessment.misconception || null; let note = null;
  if (marked && !marked.correct && (cls === 'understood' || cls === 'right_unexplained')) {
    const to = marked.misconception ? 'misconception' : 'partly_right';
    note = `assess said ${cls}, but the seal marked the answer wrong: read as ${to}`;
    cls = to; mis = to === 'misconception' ? marked.misconception : null;
  } else if (marked && marked.correct && cls === 'guess_or_no_attempt') {
    // A right answer said unsure ("one half?", "maybe two") is an answer: right_unexplained, never a guess (12 Nov 2026,
    // run 2026-11-12-1824, scenarios 1 and 17).
    note = `assess said guess_or_no_attempt, but the seal marked the answer right${marked.tentative ? ' (said unsure)' : ''}: read as right_unexplained`;
    cls = 'right_unexplained'; mis = null;
  } else if (marked && marked.correct && (cls === 'misconception' || cls === 'missing_prerequisite')) {
    note = `assess said ${cls}, but the seal marked the answer right: read as partly_right (right answer, shaky reason)`;
    cls = 'partly_right'; mis = null;
  }
  if (cls === 'misconception' && !mis) mis = marked?.misconception || null;
  return { class: cls, misconception: cls === 'misconception' ? mis : null, evidence: assessment.evidence || '', ask: assessment.ask || null, source: 'model', note };
}
export const isIndependent = (cls) => cls === 'understood';

// ---------------------------------------------------------------- the stages
const nextStage = (stage) => (stage == null ? 'warmup' : PHASES[Math.min(PHASES.length - 1, PHASES.indexOf(stage) + 1)]);
/** The furthest stage the lesson may be in after this turn (going back is always allowed). */
export function stageAllowed(s, { understoodNow = false, closing = false, preNow = false } = {}) {
  if (closing) return 'wrapup';
  const st = s.stage;
  if (st == null) return 'warmup';
  if (st === 'wrapup') return 'wrapup';
  // The teach part waits for the warm-up's first question (the weakest earlier skill) to be answered, right or wrong.
  if (st === 'warmup' && (s.pre === 'ask' || (s.pre === 'asked' && !preNow))) return st;
  if (st === 'warmup' || st === 'teach') return s.answers >= 1 || understoodNow ? nextStage(st) : st;
  // guided and independent: understood, then a fresh check (two in a row).
  return s.streak + (understoodNow ? 1 : 0) >= 2 ? nextStage(st) : st;
}

/**
 * The moves allowed this turn and why.
 * ctx: { turnIndex, elapsedMin, sessionMinutes, marked, message, probe: {kind}|null, prerequisite }
 * @returns {{ moves:string[], with:string[], rule:string, reason:string, stageMax:string, avoid:string|null, prelim:string|null }}
 */
function decideCore(s, ctx = {}) {
  const { turnIndex = 0, elapsedMin = 0, sessionMinutes = 20, marked = null, message = '', probe = null, prerequisite = null, question = null } = ctx;
  const prelim = prelimClass({ marked, message });
  const closing = elapsedMin >= sessionMinutes - CLOSE_BEFORE_MIN;
  const out = (rule, moves, reason, extra = {}) => ({ rule, moves, with: extra.with ?? ALWAYS_WITH.filter((m) => !moves.includes(m)), reason, stageMax: extra.stageMax ?? stageAllowed(s, { understoodNow: prelim === 'understood', closing, preNow: !!marked }), avoid: extra.avoid ?? null, prelim, must: extra.must ?? [], quote: extra.quote ?? null, answered: extra.answered ?? null, authored: extra.authored ?? false, line: extra.line ?? null, ack: extra.ack ?? (extra.must?.includes('Name what was right') ? 'yes' : null) });
  if (turnIndex === 0) return out('open', ['Open the lesson'], 'the first turn: greet, say what you will learn today, one easy friendly question', { with: [], stageMax: 'warmup' });
  // After a care reply (12 Nov 2026, scenario 29: a silence probe after a disclosure asked the child to "say that again").
  // The lesson does not go on until the child says so; a probe is an authored line; nothing asks them to repeat it.
  if (s.care === 'paused') {
    if (probe) return out('care-wait', ['Wait and nudge'], 'the child is quiet after a care reply: an authored line that you are there, no maths and no question about what they said', { with: [], authored: true, stageMax: s.stage || 'warmup' });
    if (wantsToCarryOn(message)) return out('care-return', ['Recover a lost child'], 'a moment ago the child said something private and HOREB answered with care; now they want to carry on. First check kindly, in one short sentence, that they are okay. Then go back gently to the last thing they got right, with one easy question. Never mention or ask about what they said', { with: ['Revoice and build', 'Name what was right'], stageMax: s.stage || 'warmup' });
    if (childMove(message) === 'stop') return out('close', ['Close the lesson'], 'the child does not want to carry on after a care reply: close kindly in two short sentences, say a grown-up they trust can help, then end_session. No maths', { with: [], stageMax: 'wrapup' });
    return out('care', ['Revoice and build'], 'the child said something private a moment ago and HOREB answered with care. Stay in the care frame: one or two kind sentences, no maths. Never ask them to repeat or explain what happened. Ask if they want to carry on with our fractions or stop for today', { with: [], stageMax: s.stage || 'warmup' });
  }
  // In the wrap-up, a child saying goodbye or asking to go is let go (12 Nov 2026, run 2, scenario 19: nine turns of goodbyes).
  if ((closing || s.stage === 'wrapup') && childMove(message) === 'stop') return out('stop', ['Close the lesson'], 'the lesson is closing and the child is saying goodbye: one short kind goodbye, then end_session. No question', { with: ['Name what was right', 'Celebrate the strategy'], stageMax: 'wrapup' });
  if (closing || s.stage === 'wrapup') return out('close', ['Close the lesson'], closing ? `${Math.round(elapsedMin)} of ${sessionMinutes} minutes used: close the lesson now` : 'the lesson is in its wrap-up', { with: ['Name what was right', 'Celebrate the strategy'], stageMax: 'wrapup' });
  // A bored child who wants to stop (scenario 19): never the same lesson again. A short close, or one quick change.
  const move = marked ? null : childMove(message);
  if (move === 'stop' || (marked && childMove(message) === 'stop')) {
    if (s.stops >= 1) return out('stop', ['Close the lesson'], 'the child has asked to stop again: close the lesson now, kindly, in two short sentences (one thing they did well today), then end_session', { with: ['Name what was right', 'Celebrate the strategy'], stageMax: 'wrapup' });
    return out('bored', ['Close the lesson', 'Predict then show'], 'the child says they are bored or want to stop. Do not carry on with the same task and never repeat the lesson. Say you hear them in a few words, then offer one choice: a quick two-minute game (for example: guess how many pieces before I cut the chapati) or stopping for today. If they choose to stop, close the lesson', { with: ['Revoice and build', 'Name what was right'], stageMax: 'wrapup' });
  }
  if (probe && PROBE_KINDS.includes(probe.kind)) {
    const why = {
      answer_nudge: 'the child is silent after your question: one short kind nudge, no answer, no new question',
      answer_smaller: 'still silent after a nudge: make the question smaller and easier, no answer',
      task_checkin: 'the child has been on the board task a long while: one gentle check-in ("tell me when you are done"), do not do it for them',
      talk_nudge: 'the child is quiet: one gentle line inviting them to say what they think',
      talk_again: 'still quiet: offer a smaller, easier way in',
    }[probe.kind];
    return out('probe', PROBE_MOVES[probe.kind], why, { with: [] });
  }
  if (move === 'lost' || (soundsLost(message) && !marked)) return out('lost', ['Recover a lost child', 'Smaller-question hint'], 'the child says they do not know: lower the question, go back to the last thing they got right');
  // Fillers alone ("um...", "eh", "so") are not a turn to answer (12 Nov 2026, run 2026-11-12-1824: the thinking rule
  // fired on every "um..." and locked the tutor in nudge loops). No model call: the app hands back and waits, until the
  // child says something or the silence rules fire. After two filler-only replies in a row, one "Take your time", once.
  if (move === 'filler') {
    const n = (s.fillers || 0) + 1;
    const line = n >= 2 && !s.tyt ? 'Take your time.' : null;
    return out('thinking', ['Wait and nudge'], `the child is thinking aloud (filler ${n} in a row): the app waits${line ? ', with one "Take your time"' : ' with no words'}`, { with: [], authored: true, line, stageMax: s.stage || 'warmup' });
  }
  // An answer said as a question with no open question to mark it against ("maybe four pieces?"): an answer, said tentatively.
  if (move === 'tentative') return out('tentative', ['Revoice and build', 'Press for reasoning', 'Name what was right'], 'the child gave an answer, said as a question ("maybe four?"): it is an answer, not a question to you. Say back what they said in a few words; if it is right, say so; then ask how sure they are, or how they know. Do not answer it for them', { with: ['Celebrate the strategy'] });
  if (move === 'question') return out('question', ['Revoice and build', 'Smaller-question hint', 'Show then hand over'], 'the child asked you a question (it is not an answer, and not wrong): answer it first, briefly and honestly, without giving the answer to your own question; then hand your question back to them', { with: ['Name what was right'] });
  if (marked && WRONG.includes(prelim)) {
    // The "never tell" exit (READING_12NOV.md change 2): two failed attempts on a changed representation. One worked example
    // is allowed, on a different question, then the child tries a similar one; it is not a giveaway.
    if (s.tried.length >= 2 && s.changedFails + 1 >= WORKED_EXAMPLE_AFTER && (s.examples || 0) < 1) {
      return out('example', ['Show then hand over', 'Count with the child'],
        `the child has been wrong ${WORKED_EXAMPLE_AFTER} times on a picture you changed (tried so far: ${s.tried.join(', ')}). The "never tell" rule has an exit now: show ONE worked example, on a DIFFERENT question with different numbers (never the open question's own answer), with a picture, working it aloud one step at a time and naming each step. Then hand a similar new question back to them. Do not say you are giving the answer; say you will show how one goes`, { with: ['Revoice and build', 'Name what was right'], avoid: null });
    }
    if (s.rep && s.sameFails + 1 >= 2) {
      const left = REPS.filter((r) => r !== 'story' && !s.tried.includes(r));
      return out('change', ['Smaller-question hint', 'Show then hand over', 'Predict then show', 'Recover a lost child'],
        `a second wrong answer in a row with the ${s.rep}: change the approach. Do not use the ${s.rep} again for this idea; try ${left.length ? `a ${left.slice(0, 2).join(' or a ')}` : 'a story with a real thing'}${s.tried.length ? ` (tried so far: ${s.tried.join(', ')})` : ''}`, { avoid: s.rep });
    }
    // The child has already said how they got it ("I added the bottoms, six plus twelve is eighteen"): asking how again
    // is not diagnosing (12 Nov 2026, run 2, scenario 10): their way is known, so the reteach starts from it.
    if (gaveReason(message)) return out('reteach', ['Show then hand over', 'Predict then show', 'Count with the child', 'Smaller-question hint'], `a wrong answer, and the child has already said how they got it ("${String(message).slice(0, 80)}"): use their words (Revoice and build), record_diagnosis if the cause is clear, then reteach that one idea with a picture where their way does not work, and hand one small step back to them`, { with: ['Revoice and build', 'Name what was right'] });
    // Diagnose means finding out what the child is thinking BEFORE any re-teaching (12 Nov 2026: the most common failure).
    const how = `ask ONE question about how they got "${String(marked.answer || '').slice(0, 40)}" (for example "How did you get that?" or "Tell me how you counted"), and nothing else: no explaining, no new picture, no new question to answer, no hint, until you have heard their thinking`;
    return out('diagnose', ['Diagnose the wrong answer'], marked.misconception
      ? `a wrong answer the library reads as ${String(marked.misconception).split('.').pop()} (keep that to yourself): ${how}`
      : `a wrong answer with no library match: ${how}`, { with: ['Revoice and build', 'Name what was right'], must: ['Diagnose the wrong answer'] });
  }
  if (s.diagnosing && message && !marked) return out('reteach', ['Show then hand over', 'Predict then show', 'Count with the child', 'Smaller-question hint'], 'the child has told you how they got their wrong answer: use their words (Revoice and build), record_diagnosis if the cause is clear, then reteach that one idea with a picture where their way does not work, and hand one small step back to them', { with: ['Revoice and build', 'Name what was right'] });
  // After a right answer: name it, with the child's own words, and never ask that question again (12 Nov 2026).
  const right = marked?.correct ? { must: ['Name what was right'], quote: marked.said || marked.answer || null, answered: { ask: marked.ask, prompt: question?.question || null } } : {};
  // No "yes" to a hedged or one-word answer (PLAN_TO_FOUR.md step 4): say what you heard, then ask what made them say it.
  if (marked && prelim === 'right_unexplained') {
    const cr = readChild(message, { marked });
    if (cr.hedged || cr.oneWord) return out('press', ['Name what was right', 'Press for reasoning'], `right, but ${cr.hedged ? 'said unsure' : 'one word'} and no reason yet: do not say yes yet. Say back what you heard in the child's own words ("${String(marked.said || marked.answer || '').slice(0, 30)}, you said"), then ask what made them say it${cr.hedged ? ' and how sure they are' : ''}. It does not count as understood until they give a reason`, { ...right, ack: 'revoice' });
    return out('press', ['Name what was right', 'Press for reasoning'], 'right, but no reason yet: name what was right in the child\'s own words, then ask how they knew. It does not count as understood until they give a reason', right);
  }
  if (marked && prelim === 'understood') {
    if (s.streak >= 1) return out('move-on', ['Name what was right', 'Check for understanding', 'Stretch the quick child', 'Show then hand over'], `understood, and the fresh check too: name what was right, then you may move on to ${nextStage(s.stage)}`, right);
    return out('fresh-check', ['Name what was right', 'Check for understanding'], 'understood, with a reason: name what was right in the child\'s own words, then check it once on a fresh example (a new question, not the same one) before moving on', right);
  }
  if (s.pending && message) return out('reason', ['Name what was right', 'Press for reasoning', 'Check for understanding'], 'the child is giving the reason for their right answer: judge it (assess); if it holds, name it and check on a fresh example', { with: ['Revoice and build', 'Celebrate the strategy'] });
  if (s.classes[s.classes.length - 1] === 'missing_prerequisite' && prerequisite) return out('prerequisite', ['Smaller-question hint', 'Show then hand over', 'Count with the child'], `the last answer showed a missing earlier skill: go back to ${prerequisite} with a smaller, earlier step, then return`);
  const st = s.stage || 'warmup';
  return out('stage', STAGE_MOVES[st], `the ${st} part of the lesson`);
}

const PRE_RULES = ['stage', 'question', 'lost', 'tentative', 'reteach', 'change', 'prerequisite'];
/**
 * The moves allowed this turn and why: the stage rules (decideCore), then two pacing rules (12 Nov 2026):
 *  - after a turn that explained or showed and asked nothing, the next turn hands over first (a "you try" or "tell me why/how");
 *  - in the warm-up, until the child has answered it, the first maths question is on the weakest earlier skill.
 * ctx adds { pre: { skill, name } | null } (pacing.js preFor). The result carries `handover` and `preFirst: { skill, name } | null`.
 */
export function decide(s, ctx = {}) {
  const d = { ...decideCore(s, ctx), handover: false, preFirst: null };
  if ((s.explain || 0) >= 1 && HANDOVER_RULES.includes(d.rule)) {
    d.moves = handoverMoves(d.rule);
    d.with = ALWAYS_WITH.filter((m) => !d.moves.includes(m));
    d.handover = true;
    d.reason = `${d.reason}. But your last ${s.explain > 1 ? `${s.explain} turns explained or showed` : 'turn explained or showed'} and asked the child nothing: this turn hands over first, a "you try" or a "tell me why or how", before any more explaining`;
  }
  if (s.pre === 'ask' && ctx.pre && (s.stage == null || s.stage === 'warmup') && PRE_RULES.includes(d.rule) && (ctx.turnIndex || 0) >= 1) {
    d.preFirst = { skill: ctx.pre.skill || null, name: ctx.pre.name };
    d.reason = `${d.reason}. The first maths question is on the earlier skill (${d.preFirst.name}), and the target idea waits until the child has answered it`;
  }
  return d;
}

// ---------------------------------------------------------------- what the model did
/** The representations a turn drew: a bar, a circle, a number line, ... */
export function repsOf(steps = []) {
  const out = [];
  for (const x of steps) {
    if (x.cmd === 'fraction_bar') out.push('bar');
    else if (x.cmd === 'shape') out.push(x.kind === 'circle' ? 'circle' : 'shape');
    else if (x.cmd === 'number_line') out.push('number line');
    else if (x.cmd === 'figure' && x.type === 'fraction') out.push(['bar', 'circle', 'grid'].includes(x.params?.shape) ? x.params.shape : 'bar');
    else if (x.cmd === 'figure' && x.type === 'numberline') out.push('number line');
  }
  return [...new Set(out)];
}
const norm = (m) => String(m || '').trim().toLowerCase();

/**
 * Did the turn keep to the decision? Notes only: the turn still plays.
 * `fromModel`: the steps the model wrote (a Set). Sentences the code said (naming what was right, a recovery, an authored
 * line) are never held to a move tag. `authored`: the whole turn was the code's.
 */
export function judgeTurn(decision, steps = [], { fromModel = null, authored = false } = {}) {
  const notes = [];
  if (!decision) return notes;
  const strict = STRICT.includes(decision.rule);
  const allowed = new Set([...decision.moves, ...decision.with, ...(strict ? [] : GENERAL)].map(norm));
  const says = steps.filter((x) => x.cmd === 'say' && (!fromModel || fromModel.has(x)));
  const tags = says.filter((x) => x.move).map((x) => x.move);
  for (const t of tags) {
    if (!PLAYBOOK_MOVES.some((m) => norm(m) === norm(t))) notes.push(`move "${t}" is not a playbook move`);
    else if (!allowed.has(norm(t))) notes.push(`move "${t}" was not allowed this turn (${decision.rule}: ${decision.moves.join(', ')})`);
  }
  // On plan when any say (not only the first) carries an allowed move. Care turns and the code's own lines need no tag.
  const careTurn = ['care', 'care-wait', 'care-return'].includes(decision.rule);
  if (!authored && !careTurn && says.length && !tags.some((t) => allowed.has(norm(t)))) notes.push(`no say was tagged with an allowed move (${decision.moves.join(', ')})`);
  for (const p of steps.filter((x) => x.cmd === 'set_phase')) {
    if (PHASES.indexOf(p.phase) > PHASES.indexOf(decision.stageMax)) notes.push(`set_phase ${p.phase} is ahead of what the lesson allows (${decision.stageMax})`);
  }
  if (decision.avoid && repsOf(steps).includes(decision.avoid)) notes.push(`the ${decision.avoid} was used again after two wrong answers with it`);
  const allTags = steps.filter((x) => x.cmd === 'say' && x.move).map((x) => x.move);
  for (const m of authored ? [] : decision.must || []) {
    if (!allTags.some((t) => norm(t) === norm(m))) notes.push(`"${m}" was required this turn and no say carried it`);
  }
  if (decision.handover && !authored && says.length && explainedTurn(steps)) notes.push('this turn was to hand over (a "you try" or "tell me why or how") and it explained again without asking the child anything');
  if (decision.rule === 'diagnose') {
    const says = steps.filter((x) => x.cmd === 'say');
    if (!says.some((x) => ASKS_HOW.test(x.text))) notes.push('the diagnose turn did not ask how the child got their answer');
    if (steps.some((x) => x.cmd === 'ask' || (DRAWN.includes(x.cmd) && x.cmd !== 'write_text'))) notes.push('the diagnose turn taught (a new picture or question) before hearing how the child got their answer');
  }
  return notes;
}

/**
 * The state after the turn.
 * t: { decision, steps (sent), judged: finalClass() | null, marked, probe, elapsedMin }
 */
export const SLOW_THINK_S = 8; // a reply after this long thinking (or after a silence probe) is a slow one
export function updateLesson(s0, { decision = null, steps = [], judged = null, marked = null, probe = null, elapsedMin = 0, keepSeal = null, childWords = 0, preNeeded = false, thinkS = null } = {}) {
  const s = { ...s0, tried: [...s0.tried], classes: [...s0.classes], found: [...(s0.found || [])] };
  s.turns += 1;
  // Who talks: words said so far by each side, the child's last reply, and the tutor's turns in a row that explained
  // or showed without handing over (pacing.js). A silent probe counts the tutor's words but is not an explaining turn.
  s.cw = Math.min(50000, (s0.cw || 0) + (probe ? 0 : childWords));
  s.tw = Math.min(50000, (s0.tw || 0) + steps.filter((x) => x.cmd === 'say').reduce((n, x) => n + wordsIn(x.text), 0));
  s.lastCw = Math.min(500, childWords);
  if (!probe && steps.some((x) => x.cmd === 'say') && !['care', 'care-wait', 'care-return', 'close', 'stop', 'open', 'thinking'].includes(decision?.rule)) s.explain = explainedTurn(steps) ? Math.min(50, (s0.explain || 0) + 1) : 0;
  // The warm-up's first maths question: required from the hello on, asked once, answered once (right or wrong; wrong
  // sends the lesson down the earlier-skill path).
  if (s0.turns === 0 && preNeeded && s.pre == null) s.pre = 'ask';
  if (s.pre === 'asked' && marked) { s.pre = 'done'; if (!marked.correct) s.prereq = true; }
  if (s.pre === 'ask' && s0.turns >= 1 && !probe && steps.some((x) => x.cmd === 'ask')) s.pre = 'asked';
  if (s.pre === 'ask' && s.turns >= PRE_GIVE_UP_TURNS) s.pre = 'done';
  if (marked?.correct && marked.canon) s.found = [...new Set([...s.found, marked.canon])].slice(-MAX_FOUND);
  if (decision?.rule === 'care-return') s.care = null;
  if (decision?.rule === 'bored') s.stops += 1;
  if (decision?.rule === 'example') s.examples = (s.examples || 0) + 1;
  if (!probe && decision?.rule !== 'thinking') s.diagnosing = decision?.rule === 'diagnose';
  s.seal = keepSeal || null;
  if (probe) s.probes += 1;
  // Fillers in a row, and the one "Take your time" (decide: thinking). Anything the child says starts the count again.
  if (decision?.rule === 'thinking') { s.fillers = Math.min(20, (s0.fillers || 0) + 1); if (decision.line) s.tyt = true; }
  else if (!probe && childWords > 0) { s.fillers = 0; s.tyt = false; }
  // The pace state for the silences: a right answer that came slowly (after a probe, or after SLOW_THINK_S of thinking)
  // makes the page wait twice as long before its next nudge; a wrong answer ends it.
  const slowReply = !!s0.lastProbe || (Number.isFinite(thinkS) && thinkS >= SLOW_THINK_S);
  const rightNow = !!marked?.correct || (!marked && ['understood', 'right_unexplained'].includes(judged?.class));
  if (!probe && decision?.rule !== 'thinking') {
    if (marked && !marked.correct) s.slow = false;
    else if (rightNow && slowReply) s.slow = true;
  }
  s.lastProbe = probe ? true : decision?.rule === 'thinking' ? !!s0.lastProbe : false;
  s.min = Math.round(Math.max(0, elapsedMin) * 10) / 10;
  // The answer to the question before this turn.
  if (marked && s.question && marked.ask === s.question.id) s.question = { ...s.question, attempts: s.question.attempts + 1 };
  const cls = judged?.class || null;
  if (cls) {
    s.classes = [...s.classes, cls].slice(-MAX_CLASSES);
    s.answers += 1;
    if (cls === 'understood') {
      s.streak += 1; s.sameFails = 0; s.prereq = false; s.changedFails = 0; s.examples = 0;
      if (s.pending && (!marked || marked.ask === s.pending.ask || !judged.ask || judged.ask === s.pending.ask)) s.pending = null;
    } else if (cls === 'right_unexplained') {
      if (marked) s.pending = { ask: marked.ask, skill: marked.skill || null };
    } else if (WRONG.includes(cls)) {
      s.streak = 0;
      if (marked && !marked.correct) { s.sameFails += 1; if (s.tried.length >= 2) s.changedFails = Math.min(20, (s.changedFails || 0) + 1); }
      if (cls === 'missing_prerequisite') s.prereq = true;
    }
  }
  // The worked example answers the failures so far (this turn's wrong answer included): the count starts again.
  if (decision?.rule === 'example') s.changedFails = 0;
  // What this turn did: a new question, a new stage, a new representation, the hints.
  const ask = steps.find((x) => x.cmd === 'ask');
  if (ask) { s.question = { id: ask.id, skill: ask.skill || null, attempts: 0 }; s.hints = 0; s.asked = [...new Set([...(s.asked || []), ask.id])].slice(-MAX_ASKED); }
  s.hints += steps.filter((x) => x.cmd === 'say' && norm(x.move) === norm('Smaller-question hint')).length;
  // The stage (12 Nov 2026, run 2: the model rarely sets it, so several lessons never left the warm-up and every turn was
  // judged as a warm-up turn). The model's set_phase, never past what the lesson allows; otherwise the code moves the
  // lesson on itself when the child has earned it: out of the warm-up after a right answer, out of the teach part after
  // an answer understood, and through guided to independent as stageAllowed says. Never into the wrap-up by itself
  // (time and the model close a lesson); a close or a goodbye puts it there.
  const order = (x) => PHASES.indexOf(x);
  const asked = [...steps].reverse().find((x) => x.cmd === 'set_phase')?.phase;
  // What is allowed now, counting this turn's answer (the decision was made before it was counted).
  const max = [decision?.stageMax, s.stage != null ? stageAllowed(s) : null].filter(Boolean).sort((a, b) => order(b) - order(a))[0] || null;
  let phase = asked && max && order(asked) > order(max) ? max : asked;
  if (!phase && max && s.stage && order(max) > order(s.stage) && order(max) <= order('independent')) {
    const earned = s.stage === 'warmup' ? cls === 'understood' || cls === 'right_unexplained' : cls === 'understood';
    if (earned) phase = max;
  }
  if (!phase && s.stage == null && steps.length) phase = 'warmup';
  if (['stop', 'close'].includes(decision?.rule) || steps.some((x) => x.cmd === 'end_session')) phase = 'wrapup';
  if (phase && phase !== s.stage) { s.stage = phase; s.streak = 0; s.answers = 0; s.tried = []; s.sameFails = 0; s.changedFails = 0; s.examples = 0; }
  const reps = repsOf(steps);
  if (reps.length) {
    // A different picture is a change of approach: the count of wrong answers with the old one starts again.
    if (s.rep && !reps.includes(s.rep)) s.sameFails = 0;
    s.rep = reps[reps.length - 1];
    s.tried = [...new Set([...s.tried, ...reps])].slice(-MAX_TRIED);
  }
  if (cls === 'understood') s.tried = s.rep ? [s.rep] : [];
  // The level and its successes (habits.js nextLevel): the answer counted at the level it was given on, then this turn's
  // numbers; a success after a hint counts half.
  const lv = nextLevel({ level: s0.level || 0, wins: s0.wins || 0 }, { correct: !!marked?.correct, cls, hedged: !!marked?.tentative, helped: (s0.hints || 0) > 0, steps });
  s.level = lv.level; s.wins = lv.wins;
  const hand = [...steps].reverse().find((x) => x.cmd === 'pause_for_child');
  if (hand?.doing) s.doing = hand.doing;
  return s;
}

/** The lines the model reads about the lesson (turnContext, after the cache breakpoint). */
export function lessonLines(s, d) {
  const lines = [];
  lines.push(`Lesson state: stage ${s.stage || 'not started'}; the child is now ${s.doing ? { answer: 'answering a question', task: 'doing a task on the board', talk: 'talking freely' }[s.doing] : 'starting'}${s.question ? `; question ${s.question.id}, ${s.question.attempts} attempt${s.question.attempts === 1 ? '' : 's'} so far` : ''}; hints given ${s.hints}${s.tried.length ? `; tried on this idea: ${s.tried.join(', ')}` : ''}${s.classes.length ? `; last answers: ${s.classes.slice(-3).join(', ')}` : ''}${s.pending ? `; question ${s.pending.ask} was right but has no reason yet` : ''}.`);
  if (s.found?.length) lines.push(`Answers the child has already found (you may say them back now): ${s.found.join(', ')}.`);
  if (d) {
    lines.push(`Allowed moves this turn: ${d.moves.join(', ')}${d.with.length ? ` (and alongside: ${d.with.join(', ')})` : ''}. Why: ${d.reason}.`);
    if (d.must?.includes('Name what was right')) lines.push(`Your first say is Name what was right: yes, and the child's own words${d.quote ? ` ("${String(d.quote).slice(0, 60)}")` : ''}, tagged "Name what was right".${d.answered ? ` The child has answered question ${d.answered.ask}: never ask it again; a fresh check is a new question.` : ''}`);
    lines.push(`Tag the say that carries your move with "move": one of the allowed moves. The furthest stage allowed after this turn: ${d.stageMax}.`);
  }
  return lines;
}

// ---------------------------------------------------------------- the turn brief (PLAN_TO_FOUR.md step 2)
// The standard each measure is judged on, at 4 and 5 (Tutagora/Build/voice-tutor/training/FINDINGS_TO_FOUR.md section 5).
// The &Tutor lesson: the cheapest big gain is telling the model the standard it is judged on. The brief carries the
// anchor for the measure the allowed move serves, and naturalness, which every turn is judged on.
export const ANCHORS = {
  teaching: 'Teaching (the child does the thinking; the answer is not in the question). 4: child "same", you: "Same. What could you do to the bar to show me?" 5: "Before I shade, guess. Which is more, three quarters or three eighths?" then, after the reason, "Say that as a rule for your friend."',
  diagnosis: 'Diagnosis (find why before correcting; a guess does not count). 4: child "two sixths" for a half plus a quarter, you: "Tell me how you got the two and the six." 5: child "one plus one is two, two plus four is six", you: "You added the tops, and added the bottoms. Is two sixths more or less than the half we started with?"',
  naturalness: 'Naturalness. 4: child "why do we cut each half again?", you: "To get the same amount in smaller pieces. How many pieces will that make?" 5: child "ni four, na two shaded", you: "Two shaded, four in all. Show me where the nusu is." (their own word, short, then a pause)',
  adapting: 'Adapting. 4: after two wrong answers on a bar: "Let us try a number line. Where would one half go between nought and one?" 5: child "too fast", you: "Thank you, I will slow down. I will draw it again, big." The next problem is easier and the picture stays.',
  curriculum: 'Curriculum. 4: "Four times three is twelve. So what do we multiply the top by?" 5: as 4, with the picture before the numbers, "bottom number" before "denominator", a Kenyan whole, and fractions said so they cannot be misheard ("three over four").',
};
const MEASURE_OF = {
  'Diagnose the wrong answer': 'diagnosis', 'Press for reasoning': 'diagnosis',
  'Show then hand over': 'teaching', 'Count with the child': 'teaching', 'Predict then show': 'teaching', 'Smaller-question hint': 'teaching', 'Check for understanding': 'teaching', 'Name what was right': 'teaching',
  'Revoice and build': 'naturalness', 'Wait and nudge': 'naturalness', 'Bring back an off-topic child': 'naturalness', 'Open the lesson': 'naturalness', 'Close the lesson': 'naturalness', 'Celebrate the strategy': 'naturalness',
  'Recover a lost child': 'adapting', 'Stretch the quick child': 'adapting',
};
// The rule the child should say themselves, by skill (the last part of its code).
const RULES = {
  EQUIVALENT_FRACTIONS: 'that the two fractions are the same amount, or that the top and bottom are multiplied by the same number',
  SIMPLIFY_FRACTIONS: 'that the top and bottom are divided by the same number',
  COMPARE_LIKE_FRACTIONS: 'that with the same bottom number, the bigger top number is more',
  COMPARE_UNLIKE_FRACTIONS: 'that more pieces in the whole means smaller pieces',
  ORDER_FRACTIONS: 'that more pieces in the whole means smaller pieces',
  ADD_SAME_DENOMINATOR: 'that with the same bottom number only the tops are added',
  SUBTRACT_SAME_DENOMINATOR: 'that with the same bottom number only the tops are taken away',
  ADD_ONE_RENAMING: 'that one fraction is renamed so the pieces are the same size before adding',
  SUBTRACT_ONE_RENAMING: 'that one fraction is renamed so the pieces are the same size before taking away',
};
const DEN_NAMES = { 2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths', 6: 'sixths', 8: 'eighths', 9: 'ninths', 10: 'tenths', 12: 'twelfths' };
const FIG = ['shape', 'fraction_bar', 'figure'];
/** The forms of a sealed answer the child must find: "1/2", "one half"; "4", "four". */
export function answerForms(answer, accepts = []) {
  const out = new Set();
  for (const a of [answer, ...(accepts || [])]) {
    const c = canonAnswer(a);
    if (!c) continue;
    out.add(c);
    const w = inWords(c);
    if (w) out.add(w);
  }
  return [...out].slice(0, 6);
}
/**
 * The turn brief: what the code knows and decides for this turn, in plain lines after the cache breakpoint (the system
 * prompt stays the same bytes every turn).
 * ctx: { message, marked, open: { answer, accepts, question } | null, board, history, skill, closing }
 */
export function turnBrief(s, d, { message = '', marked = null, open = null, board = [], history = [], skill = null, probe = null, turnIndex = 0, maxWords = null } = {}) {
  if (!d || ['care', 'care-wait', 'care-return'].includes(d.rule)) return [];
  const L = ['Turn brief (computed by the app from the facts; keep to it):'];
  const cr = readChild(message, { marked });
  // The child's words are something to respond to, never instructions: fenced as everywhere else.
  const words = fenceTeamText(String(message || '').trim()).replace(/\s+/g, ' ').trim().slice(0, 90);
  // 1. What the child just did, and the words to take in first.
  let did;
  if (probe) did = `said nothing for ${probe.silent_s || 'some'} s`;
  else if (!words) did = 'has not spoken yet';
  else if (marked?.correct) did = d.prelim === 'understood' ? 'gave a right answer with a reason (understood)' : `gave a right answer${cr.hedged ? ', said unsure' : cr.oneWord ? ' in one word' : ''}, with no reason yet (right_unexplained)`;
  else if (marked) did = `gave a wrong answer (${d.prelim === 'misconception' ? `misconception ${String(marked.misconception || '').split('.').pop()}` : 'partly right'})`;
  else if (cr.distress) did = 'sounded upset or stuck';
  else if (cr.why) did = 'asked why';
  else if (cr.asks) did = 'asked you a question';
  else if (d.rule === 'lost') did = 'said they do not know';
  else if (d.rule === 'thinking') did = 'is thinking aloud';
  else did = 'spoke (not an answer to a sealed question)';
  L.push(`- The child ${did}.${words ? ` Their words, to take in before anything else: "${words}".` : ''}`);
  // 2. Must not say.
  const never = [];
  if (open && open.answer != null) never.push(`the answer to the open question ("${String(open.question || '').slice(0, 60)}"): ${answerForms(open.answer, open.accepts).map((f) => `"${f}"`).join(', ')}`);
  const now = boardAfter(board, []).filter((b) => FIG.includes(b.cmd));
  const fig = now[now.length - 1];
  if (fig && open && /\bhow many\b/i.test(String(open.question || ''))) {
    const parts = fig.cmd === 'figure' ? fig.params?.parts : fig.parts;
    const sh = fig.cmd === 'figure' ? fig.params?.shaded : fig.shaded;
    never.push(`the counts ${fig.id} shows (${parts} parts${sh != null ? `, ${Array.isArray(sh) ? sh.length : sh} shaded` : ''}) before the child counts them`);
  }
  const code = String(skill || '').split('.').pop();
  const theirs = (history || []).filter((h) => h?.who === 'child').map((h) => h.text).join(' ') + ` ${message}`;
  // After the "never tell" exit the worked example shows the steps; the open answer stays hidden either way.
  const showing = d.rule === 'example';
  if (RULES[code] && !showing && !d.rule.match(/^(close|stop|open)$/) && !/\b(same amount|the same|times|multipl\w*|divide\w*|smaller pieces)\b/i.test(theirs)) never.push(`the rule the child should say themselves: ${RULES[code]}`);
  // The key steps between the question and its answer (READING_12NOV.md change 1: SafeTutors counts them as disclosure).
  if (!showing && !d.rule.match(/^(close|stop|open)$/)) {
    const steps = keyStepsFor(skill).filter((k) => !k.said.test(theirs));
    if (steps.length) never.push(`the key steps the child should find (saying one for them is telling): ${steps.map((k) => k.say).join('; ')}`);
  }
  if (never.length) L.push(`- Must not say (nor show on the board, nor put in a label or a question): ${never.join('; ')}.`);
  // 3. Answer first.
  if (cr.asks || cr.why || cr.distress) L.push(`- Answer first: your first sentence answers ${cr.distress ? 'how the child feels (name it small, make the next step easier)' : 'their question'}, in 15 words or fewer, before anything else. Then hand the thinking back.`);
  // 4. The level gate.
  if (s.level) {
    const ok = (s.wins || 0) >= WINS_TO_MOVE_UP || !['guided', 'independent'].includes(s.stage);
    L.push(`- Level: the child is on ${DEN_NAMES[s.level] || `${s.level} parts`}, with ${s.wins || 0} of ${WINS_TO_MOVE_UP} successes there (a helped success counts half, an unsure one zero). Harder numbers: ${ok ? 'allowed' : 'not yet; one more success at this level first'}. Never remove the picture and change the numbers in the same turn.`);
  }
  // 5. No "yes" before a reason.
  if (d.ack === 'revoice') L.push('- No "yes" yet: say back what you heard, then ask what made them say it.');
  // 5b. Pacing (12 Nov 2026): the word budget, the hand-over after explaining, the child's share of the talk, the warm-up's first question.
  const budget = maxWords || (turnIndex === 0 ? MAX_SPOKEN_WORDS + 20 : wordCap(turnIndex));
  L.push(`- Word budget this turn: at most ${budget} words in all, then wait for the child. Every word over is cut, and the question at the end is what is kept.`);
  if (d.handover) L.push(`- Hand over first: your last ${s.explain > 1 ? `${s.explain} turns explained or showed` : 'turn explained or showed'} and asked the child nothing. This turn asks them to try the next step, or to tell you why or how, before you explain anything more.`);
  if (shareLow(s)) L.push(`- The child has spoken only ${Math.round(100 * talkShare(s))}% of the words so far (a good lesson is 25 to 40%). Keep this turn to ${overtalkLimit(s.lastCw)} words at most (twice their last reply plus 15), and give them the thinking and the talking.`);
  if (d.preFirst) L.push(`- Warm-up rule: your first maths question is on the earlier skill "${d.preFirst.name}": ${d.preFirst.skill ? `write ask.skill as "${d.preFirst.skill}"` : 'a question about that idea, with no picture of the target'}. Do not start on the target idea until the child has answered it, right or wrong.`);
  // 6. The standard for the allowed move.
  const main = d.moves.find((x) => !['Name what was right', 'Revoice and build'].includes(x)) || d.moves[0];
  const m = MEASURE_OF[main] || 'teaching';
  L.push(`- The standard you are judged on for ${main}: ${ANCHORS[m]}`);
  if (m !== 'naturalness') L.push(`- And every turn: ${ANCHORS.naturalness}`);
  return L;
}

export default { newLesson, cleanLesson, decide, turnBrief, answerForms, ANCHORS, judgeTurn, updateLesson, finalClass, prelimClass, lessonLines, repsOf, gaveReason, soundsLost, stageAllowed, isIndependent, ASKS_HOW };
