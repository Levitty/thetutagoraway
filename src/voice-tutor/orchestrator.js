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
//
// THE RULES (decide), first match wins:
//   first turn                          Open the lesson
//   after a care reply                  the care frame (no maths; a probe is an authored line, never the model);
//                                       the child says carry on: check they are okay, then back gently
//   near the time limit                 Close the lesson
//   wants to stop, bored                offer a short close or a quick game; the second time, close
//   a silence probe                     Wait and nudge, then Smaller-question hint (silence.js kinds)
//   "I don't know"                      Recover a lost child or Smaller-question hint
//   "umm" (thinking aloud)              Wait and nudge: one short line, no new question
//   a question back                     answer it, then hand the question back (it is not a wrong answer)
//   a wrong answer, second in a row     change the approach: not the same representation again
//     with the same representation
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
import { PHASES, PLAYBOOK_MOVES, ANSWER_CLASSES, DOINGS, DRAWN } from './commands.js';
import { PROBE_KINDS } from './silence.js';
import { soundsLost, childMove, wantsToCarryOn } from './spokenAnswer.js';

export { soundsLost };

export const CLOSE_BEFORE_MIN = 3;          // minutes before the end when the lesson closes
const MAX_CLASSES = 6;
const MAX_TRIED = 6;
const ID_RE = /^[a-z][a-z0-9_]{0,23}$/;
const SKILL_RE = /^[A-Z0-9_.]{3,120}$/;
const REPS = ['bar', 'circle', 'grid', 'shape', 'number line', 'story'];

// Moves that may go with any allowed move (reacting to the child is always right).
export const ALWAYS_WITH = ['Revoice and build', 'Name what was right', 'Celebrate the strategy', 'Bring back an off-topic child'];
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
  found: [], care: null, stops: 0, diagnosing: false, seal: null,
});
const MAX_FOUND = 8;
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
  s.diagnosing = raw.diagnosing === true;
  if (typeof raw.seal === 'string' && SEAL_RE.test(raw.seal)) s.seal = raw.seal;
  return s;
}

// ---------------------------------------------------------------- reading the child
const words = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9'\s/]/g, ' ').split(/\s+/).filter(Boolean);
const REASON = /\b(because|cause|coz|since|so|that'?s why|if|each|both|times|multipl\w*|divid\w*|doubl\w*|half|halves|same|equal|split|cut|shared?|more|less|bigger|smaller|top|bottom|numerator|denominator)\b/i;
/** Did the child give a reason with their answer? A few words that explain, not a bare number. */
export const gaveReason = (text) => words(text).length >= 4 && REASON.test(String(text));
// A question that asks how the child got their answer (the Diagnose move, 12 Nov 2026).
export const ASKS_HOW = /\b(how did you|how do you know|how you got|how you know|how would you|how can you tell|why do you think|why did you|what made you|tell me how|show me how|what did you (do|count|look at)|walk me through)\b/i;

/** What the code can tell about an answer before the model reads it: the seal's mark and whether a reason came with it. */
export function prelimClass({ marked = null, message = '' } = {}) {
  if (!marked) return null;
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
export function stageAllowed(s, { understoodNow = false, closing = false } = {}) {
  if (closing) return 'wrapup';
  const st = s.stage;
  if (st == null) return 'warmup';
  if (st === 'wrapup') return 'wrapup';
  if (st === 'warmup' || st === 'teach') return s.answers >= 1 || understoodNow ? nextStage(st) : st;
  // guided and independent: understood, then a fresh check (two in a row).
  return s.streak + (understoodNow ? 1 : 0) >= 2 ? nextStage(st) : st;
}

/**
 * The moves allowed this turn and why.
 * ctx: { turnIndex, elapsedMin, sessionMinutes, marked, message, probe: {kind}|null, prerequisite }
 * @returns {{ moves:string[], with:string[], rule:string, reason:string, stageMax:string, avoid:string|null, prelim:string|null }}
 */
export function decide(s, ctx = {}) {
  const { turnIndex = 0, elapsedMin = 0, sessionMinutes = 20, marked = null, message = '', probe = null, prerequisite = null, question = null } = ctx;
  const prelim = prelimClass({ marked, message });
  const closing = elapsedMin >= sessionMinutes - CLOSE_BEFORE_MIN;
  const out = (rule, moves, reason, extra = {}) => ({ rule, moves, with: extra.with ?? ALWAYS_WITH.filter((m) => !moves.includes(m)), reason, stageMax: extra.stageMax ?? stageAllowed(s, { understoodNow: prelim === 'understood', closing }), avoid: extra.avoid ?? null, prelim, must: extra.must ?? [], quote: extra.quote ?? null, answered: extra.answered ?? null, authored: extra.authored ?? false });
  if (turnIndex === 0) return out('open', ['Open the lesson'], 'the first turn: greet, say what you will learn today, one easy friendly question', { with: [], stageMax: 'warmup' });
  // After a care reply (12 Nov 2026, scenario 29: a silence probe after a disclosure asked the child to "say that again").
  // The lesson does not go on until the child says so; a probe is an authored line; nothing asks them to repeat it.
  if (s.care === 'paused') {
    if (probe) return out('care-wait', ['Wait and nudge'], 'the child is quiet after a care reply: an authored line that you are there, no maths and no question about what they said', { with: [], authored: true, stageMax: s.stage || 'warmup' });
    if (wantsToCarryOn(message)) return out('care-return', ['Recover a lost child'], 'a moment ago the child said something private and HOREB answered with care; now they want to carry on. First check kindly, in one short sentence, that they are okay. Then go back gently to the last thing they got right, with one easy question. Never mention or ask about what they said', { with: ['Revoice and build', 'Name what was right'], stageMax: s.stage || 'warmup' });
    if (childMove(message) === 'stop') return out('close', ['Close the lesson'], 'the child does not want to carry on after a care reply: close kindly in two short sentences, say a grown-up they trust can help, then end_session. No maths', { with: [], stageMax: 'wrapup' });
    return out('care', ['Revoice and build'], 'the child said something private a moment ago and HOREB answered with care. Stay in the care frame: one or two kind sentences, no maths. Never ask them to repeat or explain what happened. Ask if they want to carry on with our fractions or stop for today', { with: [], stageMax: s.stage || 'warmup' });
  }
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
  if (move === 'filler') return out('thinking', ['Wait and nudge'], 'the child is still thinking aloud ("umm"): one short line such as "Take your time", no new question and no answer, then hand back with the same doing', { with: [] });
  if (move === 'question') return out('question', ['Revoice and build', 'Smaller-question hint', 'Show then hand over'], 'the child asked you a question (it is not an answer, and not wrong): answer it first, briefly and honestly, without giving the answer to your own question; then hand your question back to them', { with: ['Name what was right'] });
  if (marked && WRONG.includes(prelim)) {
    if (s.rep && s.sameFails + 1 >= 2) {
      const left = REPS.filter((r) => r !== 'story' && !s.tried.includes(r));
      return out('change', ['Smaller-question hint', 'Show then hand over', 'Predict then show', 'Recover a lost child'],
        `a second wrong answer in a row with the ${s.rep}: change the approach. Do not use the ${s.rep} again for this idea; try ${left.length ? `a ${left.slice(0, 2).join(' or a ')}` : 'a story with a real thing'}${s.tried.length ? ` (tried so far: ${s.tried.join(', ')})` : ''}`, { avoid: s.rep });
    }
    // Diagnose means finding out what the child is thinking BEFORE any re-teaching (12 Nov 2026: the most common failure).
    const how = `ask ONE question about how they got "${String(marked.answer || '').slice(0, 40)}" (for example "How did you get that?" or "Tell me how you counted"), and nothing else: no explaining, no new picture, no new question to answer, no hint, until you have heard their thinking`;
    return out('diagnose', ['Diagnose the wrong answer'], marked.misconception
      ? `a wrong answer the library reads as ${String(marked.misconception).split('.').pop()} (keep that to yourself): ${how}`
      : `a wrong answer with no library match: ${how}`, { with: ['Revoice and build', 'Name what was right'], must: ['Diagnose the wrong answer'] });
  }
  if (s.diagnosing && message && !marked) return out('reteach', ['Show then hand over', 'Predict then show', 'Count with the child', 'Smaller-question hint'], 'the child has told you how they got their wrong answer: use their words (Revoice and build), record_diagnosis if the cause is clear, then reteach that one idea with a picture where their way does not work, and hand one small step back to them', { with: ['Revoice and build', 'Name what was right'] });
  // After a right answer: name it, with the child's own words, and never ask that question again (12 Nov 2026).
  const right = marked?.correct ? { must: ['Name what was right'], quote: marked.said || marked.answer || null, answered: { ask: marked.ask, prompt: question?.question || null } } : {};
  if (marked && prelim === 'right_unexplained') return out('press', ['Name what was right', 'Press for reasoning'], 'right, but no reason yet: first say yes and name what was right in the child\'s own words, then ask how they knew. It does not count as understood until they give a reason', right);
  if (marked && prelim === 'understood') {
    if (s.streak >= 1) return out('move-on', ['Name what was right', 'Check for understanding', 'Stretch the quick child', 'Show then hand over'], `understood, and the fresh check too: name what was right, then you may move on to ${nextStage(s.stage)}`, right);
    return out('fresh-check', ['Name what was right', 'Check for understanding'], 'understood, with a reason: name what was right in the child\'s own words, then check it once on a fresh example (a new question, not the same one) before moving on', right);
  }
  if (s.pending && message) return out('reason', ['Name what was right', 'Press for reasoning', 'Check for understanding'], 'the child is giving the reason for their right answer: judge it (assess); if it holds, name it and check on a fresh example', { with: ['Revoice and build', 'Celebrate the strategy'] });
  if (s.classes[s.classes.length - 1] === 'missing_prerequisite' && prerequisite) return out('prerequisite', ['Smaller-question hint', 'Show then hand over', 'Count with the child'], `the last answer showed a missing earlier skill: go back to ${prerequisite} with a smaller, earlier step, then return`);
  const st = s.stage || 'warmup';
  return out('stage', STAGE_MOVES[st], `the ${st} part of the lesson`);
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

/** Did the turn keep to the decision? Notes only: the turn still plays. */
export function judgeTurn(decision, steps = []) {
  const notes = [];
  if (!decision) return notes;
  const allowed = new Set([...decision.moves, ...decision.with].map(norm));
  const main = new Set(decision.moves.map(norm));
  const tags = steps.filter((x) => x.cmd === 'say' && x.move).map((x) => x.move);
  for (const t of tags) {
    if (!PLAYBOOK_MOVES.some((m) => norm(m) === norm(t))) notes.push(`move "${t}" is not a playbook move`);
    else if (!allowed.has(norm(t))) notes.push(`move "${t}" was not allowed this turn (${decision.rule}: ${decision.moves.join(', ')})`);
  }
  if (steps.some((x) => x.cmd === 'say') && !tags.some((t) => main.has(norm(t)))) notes.push(`no say was tagged with an allowed move (${decision.moves.join(', ')})`);
  for (const p of steps.filter((x) => x.cmd === 'set_phase')) {
    if (PHASES.indexOf(p.phase) > PHASES.indexOf(decision.stageMax)) notes.push(`set_phase ${p.phase} is ahead of what the lesson allows (${decision.stageMax})`);
  }
  if (decision.avoid && repsOf(steps).includes(decision.avoid)) notes.push(`the ${decision.avoid} was used again after two wrong answers with it`);
  for (const m of decision.must || []) {
    if (!tags.some((t) => norm(t) === norm(m))) notes.push(`"${m}" was required this turn and no say carried it`);
  }
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
export function updateLesson(s0, { decision = null, steps = [], judged = null, marked = null, probe = null, elapsedMin = 0, keepSeal = null } = {}) {
  const s = { ...s0, tried: [...s0.tried], classes: [...s0.classes], found: [...(s0.found || [])] };
  s.turns += 1;
  if (marked?.correct && marked.canon) s.found = [...new Set([...s.found, marked.canon])].slice(-MAX_FOUND);
  if (decision?.rule === 'care-return') s.care = null;
  if (decision?.rule === 'bored') s.stops += 1;
  if (!probe) s.diagnosing = decision?.rule === 'diagnose';
  s.seal = keepSeal || null;
  if (probe) s.probes += 1;
  s.min = Math.round(Math.max(0, elapsedMin) * 10) / 10;
  // The answer to the question before this turn.
  if (marked && s.question && marked.ask === s.question.id) s.question = { ...s.question, attempts: s.question.attempts + 1 };
  const cls = judged?.class || null;
  if (cls) {
    s.classes = [...s.classes, cls].slice(-MAX_CLASSES);
    s.answers += 1;
    if (cls === 'understood') {
      s.streak += 1; s.sameFails = 0; s.prereq = false;
      if (s.pending && (!marked || marked.ask === s.pending.ask || !judged.ask || judged.ask === s.pending.ask)) s.pending = null;
    } else if (cls === 'right_unexplained') {
      if (marked) s.pending = { ask: marked.ask, skill: marked.skill || null };
    } else if (WRONG.includes(cls)) {
      s.streak = 0;
      if (marked && !marked.correct) s.sameFails += 1;
      if (cls === 'missing_prerequisite') s.prereq = true;
    }
  }
  // What this turn did: a new question, a new stage, a new representation, the hints.
  const ask = steps.find((x) => x.cmd === 'ask');
  if (ask) { s.question = { id: ask.id, skill: ask.skill || null, attempts: 0 }; s.hints = 0; }
  s.hints += steps.filter((x) => x.cmd === 'say' && norm(x.move) === norm('Smaller-question hint')).length;
  const phase = [...steps].reverse().find((x) => x.cmd === 'set_phase')?.phase;
  if (phase && phase !== s.stage) { s.stage = phase; s.streak = 0; s.answers = 0; s.tried = []; s.sameFails = 0; }
  const reps = repsOf(steps);
  if (reps.length) {
    // A different picture is a change of approach: the count of wrong answers with the old one starts again.
    if (s.rep && !reps.includes(s.rep)) s.sameFails = 0;
    s.rep = reps[reps.length - 1];
    s.tried = [...new Set([...s.tried, ...reps])].slice(-MAX_TRIED);
  }
  if (cls === 'understood') s.tried = s.rep ? [s.rep] : [];
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

export default { newLesson, cleanLesson, decide, judgeTurn, updateLesson, finalClass, prelimClass, lessonLines, repsOf, gaveReason, soundsLost, stageAllowed, isIndependent, ASKS_HOW };
