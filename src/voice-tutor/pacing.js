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
export const HANDOVER_MOVES = ['Show then hand over', 'Press for reasoning', 'Check for understanding'];

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
