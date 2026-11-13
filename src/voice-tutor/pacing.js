// ============================================================================
// PACING: who does the talking (owner, 12 Nov 2026, from the free yardstick: the child spoke only 23-26% of the words
// against a 25-40% band, 21 of 30 lessons below it). Pure functions; no model, no I/O.
//
//   wordsIn(text)               words as the yardstick counts them (letters or digits)
//   talkShare(s)                the child's share of the words so far, from the lesson state (cw, tw), or null while it is early
//   explainedTurn(steps)        did the tutor explain or show without handing anything to the child (no question, no ask)?
//   handoverMoves(rule)         the moves allowed after an explaining turn: hand over before any further explaining
//   pacingFlags(step, ctx, sofar)   overtalk, a yardstick measure only (12 Nov 2026, run 2026-11-12-1824: in the live gate
//                               its failed rewrites dropped whole steps): when the running share is low, a turn's words
//                               over twice the child's last reply plus 15
//   prereqSkillFor(...)         the warm-up rule: the first maths question is on the weakest prerequisite (earlier skill)
//
// The lesson state carries cw (child words), tw (tutor words), lastCw (the child's last reply, in words) and explain
// (consecutive explaining turns); orchestrator.js updates them, decide() reads them, the brief states them.
// ============================================================================
export const SHARE_FLOOR = 0.25;          // below this the brief says so and the gate holds the turn to the child's own length
export const SHARE_MIN_WORDS = 60;        // the share is not read before this many words have been said in all
export const OVERTALK_BASE = 15;          // a turn may be twice the child's last reply plus this
// No "Press for reasoning" here (P5): a hand-over is a "you try" or a question to answer; decide allows the press where it fits.
export const HANDOVER_MOVES = ['Show then hand over', 'Check for understanding'];

export const wordsIn = (t) => String(t || '').replace(/\.\.\.|…/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/** The child's share of the words so far (0 to 1), or null before SHARE_MIN_WORDS have been said. */
export function talkShare(s) {
  const cw = Number(s?.cw) || 0; const tw = Number(s?.tw) || 0;
  return cw + tw >= SHARE_MIN_WORDS ? cw / (cw + tw) : null;
}
export const shareLow = (s) => { const x = talkShare(s); return x != null && x < SHARE_FLOOR; };
/** The most words one turn may have when the share is low. */
export const overtalkLimit = (lastChildWords = 0) => 2 * (Number(lastChildWords) || 0) + OVERTALK_BASE;

const isQ = (t) => /\?\s*$/.test(String(t || '').trim());
const sentencesOf = (t) => String(t || '').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
// "Okay?", "Does that make sense?", "Is that clear?": a check on the tutor's own talk is not a hand-over.
const EMPTY_CHECK = /^(ok(ay)?|right|yes|alright|does that (make sense|help)|do you (see|understand|get) (it|that|this|why)\??|is that (clear|ok|okay|right)|make sense|got it|can you see (it|that)|see\?)\b/i;
/** A sentence that gives the turn to the child: a question that is not an empty check. */
export const handsOver = (sentence) => isQ(sentence) && !EMPTY_CHECK.test(String(sentence).replace(/^\W+/, ''));

/**
 * The tutor explained or showed this turn: it said something and handed nothing to the child (no ask, no question
 * that asks them to try, tell, or show). Probes, goodbyes and care lines are not explaining.
 */
export function explainedTurn(steps = []) {
  const says = steps.filter((x) => x.cmd === 'say');
  if (!says.length) return false;
  if (steps.some((x) => x.cmd === 'ask' || x.cmd === 'end_session')) return false;
  return !says.some((x) => sentencesOf(x.text).some(handsOver));
}

/** The moves allowed after an explaining turn: a "you try" or "tell me why/how" before any further explaining. */
export function handoverMoves(rule) {
  return ['prerequisite', 'change'].includes(rule) ? [...HANDOVER_MOVES, 'Smaller-question hint'] : [...HANDOVER_MOVES];
}
/** The rules whose own moves explain; after an explaining turn these hand over instead. Never a care, close, probe or diagnose turn. */
export const HANDOVER_RULES = ['stage', 'reteach', 'prerequisite', 'change'];

/** The gate's pacing check on one step: ctx { talk: { low, lastChildWords } }, sofar the steps already said this turn. */
export function pacingFlags(step, ctx = {}, sofar = []) {
  if (!step || step.cmd !== 'say' || !ctx.talk?.low) return [];
  const limit = overtalkLimit(ctx.talk.lastChildWords);
  const words = [...sofar.filter((x) => x.cmd === 'say'), step].reduce((n, x) => n + wordsIn(x.text), 0);
  return words > limit ? [{ habit: 'overtalk', reason: `the child has spoken under ${Math.round(SHARE_FLOOR * 100)}% of the words and their last reply was ${ctx.talk.lastChildWords} words: the turn is ${words} words, over ${limit} (twice their reply plus ${OVERTALK_BASE})` }] : [];
}

/**
 * The warm-up rule (12 Nov 2026): the first maths question is on the weakest prerequisite the context names; when the
 * target has no weak prerequisite, on its nearest fraction prerequisite; when it has none at all (the two root skills),
 * on its foundation, an idea below the map, checked by the words of the question (a heuristic, said so in the report).
 * @returns {{ skill: string|null, name: string, re: RegExp|null } | null}  null: nothing to check first
 */
export const FOUNDATIONS = {
  EQUIVALENT_FRACTIONS: { name: 'equal parts and what a half is', re: /\b(half|halves|equal|same size|fair|share[sd]?|how many (equal )?(parts|pieces)|what fraction)\b/i },
  COMPARE_LIKE_FRACTIONS: { name: 'what a fraction names, parts of a whole', re: /\b(what fraction|how many (equal )?(parts|pieces)|shaded|top number|bottom number|numerator|denominator|half|quarter)\b/i },
};
export function preFor({ target = null, prerequisite = null, prerequisites = [], nameOf = (c) => c } = {}) {
  const skill = prerequisite || prerequisites[0] || null;
  if (skill) return { skill, name: nameOf(skill), re: null };
  const f = FOUNDATIONS[String(target || '').split('.').pop()];
  return f ? { skill: null, name: f.name, re: f.re } : null;
}
/** Is this ask on the skill the warm-up needs? The skill code when there is one, else the words of the question. */
export const askIsOnPre = (pre, { skill = null, prompt = '' } = {}) => !pre || (pre.skill ? skill === pre.skill : pre.re.test(String(prompt)));

// ---------------------------------------------------------------- the step the child is on (12 Nov 2026 evening, P5)
// Run 2026-11-12-1900: the tutor re-counted the same two pieces for whole lessons, asked "whole or cut?" five times in a
// row, and pressed a shy child three times for how they knew a count. The lesson state now carries the step the child is
// on: the kind of the tutor's last question (questionKind), the tries on it, the kinds already found on the picture, and
// the closed (yes-or-no, this-or-that) questions in a row. orchestrator.js decide() reads them, the brief states them.
const KINDS = [
  ['cut', /\b(where|how) (would|will|should|could|can|do|did) (you|we|i) (cut|share|split|divide)\b|\bhow many pieces (do|would|should|will|shall) (i|you|we) cut\b|\bwhat (could|can|should|would) (we|you|i) do\b[^?]*\b(cut|share|fair|pieces|smaller)\b|\bwhat (could|can|should|would) (we|you) do to (it|the \w+)\b|\bhow (do|can|would) (we|you) (share|make) (it|them)? ?(fair|equal)|\bwhere (could|would|should|will|does|do|can) (a|one|the|your|my) (straight )?(line|cut|knife)\b|\bwhere (would|will|does|should|could) (the|a|your) knife go\b|\bwhat would you do with the knife\b|\bshow (me )?where the knife\b/i],
  ['reason', /\b(how did you|how do you know|how you know|how can you tell|how are you sure|how sure|what made you|why|tell me how|what did you (count|look at|do)|show me why)\b/i],
  ['fraction', /\b(what|which) fraction\b|\bas a fraction\b|\bhow many out of\b|\bout of how many\b|\bwhat (do|would) (we|you) call\b|\bwhat is (each|one|that|this) (piece|part)( called)?\b|\bwhat part of\b/i],
  ['compare', /\b(same amount|the same as|more than|less than|bigger|smaller|more|less|equal to|equals|equivalent|make (your|one|the|a) half|fit into)\b|\bhow many (halves|thirds|quarters|fourths|fifths|sixths|eighths|ninths|tenths|twelfths)\b/i],
  ['count_shaded', /\bhow many\b[^?]*\b(shaded|coloured|colored)\b|\bcount (only )?the shaded\b/i],
  ['count_total', /\bhow many\b|\bwhat number\b|\bcount\b/i],
  ['equal', /\b(same size|equal (size|parts|pieces)|fair (share|shares|parts|pieces))\b/i],
  ['state', /\b(whole|cut)\b/i],
  ['notice', /\bwhat do you (see|notice)\b|\btell me what you (see|notice)\b|\bwhat do you think\b/i],
];
/** The kind of a question the tutor asked (one of the KINDS, else 'other'); null for a sentence that is not a question. */
export function questionKind(q) {
  const t = String(q || '').trim();
  if (!/\?\s*$/.test(t)) return null;
  return (KINDS.find(([, re]) => re.test(t)) || ['other'])[0];
}
/** A closed question: yes or no, or this or that ("Is it whole, or cut?"). An invitation to do something ("Can you point...?") is not. */
export const isClosed = (q) => {
  const t = String(q || '').trim().replace(/^\W+/, '');
  if (!/\?\s*$/.test(t)) return false;
  if (/\byes or no\b/i.test(t)) return true;
  if (/^(can|could|will|would) you\b/i.test(t)) return false;
  if (/^(what|how|which|where|why|who|when)\b/i.test(t)) return /,?\s*\bor\b[^,?]{1,30}\?\s*$/.test(t) && /^which\b/i.test(t);
  return /^(is|are|was|were|do|does|did|have|has|shall)\b/i.test(t) || /,?\s+or\s+[^,?]{1,30}\?\s*$/i.test(t) || /\bsay one word\b/i.test(t);
};
/** The question a turn put to the child: its last spoken question, else its ask's prompt; null when it asked nothing. */
export function lastQuestionOf(steps = []) {
  const qs = steps.filter((x) => x.cmd === 'say').flatMap((x) => sentencesOf(x.text)).filter(isQ);
  if (qs.length) return qs[qs.length - 1];
  const a = [...steps].reverse().find((x) => x.cmd === 'ask');
  return a && isQ(a.prompt) ? a.prompt : null;
}
// The steps of a part-whole picture in the order a lesson on equal parts and equivalent fractions climbs them.
export const LADDER = ['state', 'cut', 'count_total', 'count_shaded', 'fraction', 'compare'];
export const STEP_NAMES = {
  state: 'whether the whole is cut yet', cut: 'how to cut it into equal parts', equal: 'whether the parts are equal', count_total: 'how many equal pieces in all',
  count_shaded: 'how many pieces are shaded', fraction: 'the shaded part as a fraction (how many out of how many)', compare: 'whether two fractions are the same amount',
  reason: 'how they knew', notice: 'what they see', other: 'your last question',
};
const NEXT_NAMES = {
  state: 'ask them how to cut it so two people get fair shares', cut: 'ask how many equal pieces it has now', count_total: 'ask how many of the pieces are shaded',
  count_shaded: 'ask for the shaded part as a fraction: how many out of how many', fraction: 'cut each piece again (ask them to predict first), then ask if the shaded amount is the same',
  compare: 'a fresh example, or ask them to say the rule in their own words',
};
/** The next step on the picture: the first rung above everything found (and above the cut, when the picture is cut already). */
export function nextStepOf(solved = [], { cut = false } = {}) {
  const top = Math.max(-1, ...solved.map((k) => LADDER.indexOf(k)), cut ? LADDER.indexOf('cut') : -1);
  const k = LADDER[Math.min(top, LADDER.length - 1)] || null;
  return top < 0 ? null : NEXT_NAMES[k] || null;
}
/**
 * A trivial answer needs no reason (P5): a count, a yes or no, a name ("what do you call it?": "a half"). A fraction,
 * a comparison, an equivalence or a rule is not trivial. `question`: the question it answered; `answer`: its canonical
 * form, when the seal holds one.
 */
export function trivialAnswer({ question = '', answer = null } = {}) {
  const q = String(question || '');
  const kind = questionKind(q);
  if (/\b(call|called|name)\b/i.test(q)) return true;
  // "1/3 = ?/6", "How many quarters make one half?": a number, but the question is about fractions.
  if (FRACTIONISH.test(q) || ['fraction', 'compare'].includes(kind)) return false;
  if (['count_total', 'count_shaded', 'state', 'cut', 'equal'].includes(kind)) return true;
  if (answer != null && String(answer) !== '') return /^(\d+|yes|no|whole|cut|middle)$/i.test(String(answer).trim());
  return true;
}
const FRACTIONISH = /\d+\s*\/\s*\d+|=|\b(half|halves|quarters?|thirds?|fifths?|sixths?|eighths?|tenths?|twelfths?|same amount|equal to|equivalent)\b/i;
