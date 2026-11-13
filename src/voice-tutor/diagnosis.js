// ============================================================================
// DIAGNOSE BEFORE ANYTHING ELSE (Round 2 of the free fixes, owner's yes 13 Nov 2026: "yes do the free fixes, then run
// sonnet vs opus"). Run 2026-11-13-1027 scored diagnosis 2.0, the lowest measure: "The child said 'eight' after already
// saying 'two' twice. The tutor never asks where 'eight' came from." The model was told to diagnose; it moved on, made
// the question easier or offered an either/or instead.
//
// So the diagnosis is the code's, not the model's:
//   - a wrong, partly right, unclear or guessed answer gets ONE sentence built here, quoting the child's own words
//     ("You said eight. How did you get eight?"), and nothing else: no new task, no easier question, no either/or;
//   - the second attempt asks in another way ("What did you count to get eight?", "Show me on the circle how you got it");
//   - when the child gives a reason, the tutor reteaches from it (orchestrator.js, rule reteach); after two attempts with no
//     reason, the representation changes (SCENARIOS.md 15; rule diag-change);
//   - an answer the code can check against the board ("Is the circle whole, or is it cut?" with an uncut circle) is marked
//     here (boardMark), so a wrong one is diagnosed before the model is called, and a right one said unsure is not
//     classed partly right for its hedging.
// Pure. Tested in tests/voice-tutor-round2.test.mjs.
// ============================================================================
import { readAnswer, childMove, inWords } from './spokenAnswer.js';

export const DIAG_CLASSES = ['partly_right', 'misconception', 'missing_prerequisite', 'guess_or_no_attempt'];
export const DIAG_TRIES = 2; // diagnosis attempts before the representation changes

const LEAD = /^(?:[\s,.!?…'"-]*(?:um+|uh+|hmm+|mm+|er+m?|eh+|a+h+|oh+|so|well|ok(?:ay)?|maybe|perhaps|probably|i think|i guess|is it|it is|it'?s|its|i'?m not sure|not sure|wait)\b)*[\s,.!?…'"-]*/i;
const TAIL = /(?:[\s,.!?…'"-]+(?:um+|uh+|hmm+|mm+|er+m?|eh+|i think|maybe))*[\s,.!?…'"-]*$/i;

/**
 * The child's own words to quote back: the answer part, fillers and hedges off, at most six words; null when there is
 * nothing to quote (a question, "I don't know", fillers, something about themselves).
 */
export function quoteOf(message) {
  const raw = String(message || '').trim();
  if (!raw) return null;
  const mv = childMove(raw);
  if (['filler', 'lost', 'stop', 'question'].includes(mv)) return null;
  const body = raw.replace(LEAD, '').replace(TAIL, '').replace(/\s+/g, ' ').trim();
  if (!body || /\b(i|i'm|im|me|my|you|your)\b/i.test(body)) return null;
  const w = body.split(' ');
  if (w.length > 6) {
    const f = readAnswer(body).found.find((x) => !x.negated);
    return f ? f.words.toLowerCase() : null;
  }
  const t = body.toLowerCase();
  return /^[a-z0-9/' ,-]{1,48}$/.test(t) ? t : null;
}
const isNumberish = (q) => q.split(' ').length <= 3 && (readAnswer(q).found.some((f) => ['number', 'fraction'].includes(f.kind)) || /^\d/.test(q));
const spoken = (q) => (/^\d+(\/\d+)?$/.test(q) ? inWords(q) || q : q);

/**
 * The diagnosis sentence: `attempt` 0 is the first ask, 1 the second (another way). `fig`: the picture on the board
 * ("circle"), or null. `recent`: sentences said lately, so the same words are never said twice (tutorTurn.js freshLines).
 */
export function diagnosisLine({ quote = null, attempt = 0, fig = null, recent = [] } = {}) {
  const q = quote ? spoken(quote) : null;
  const num = !!q && isNumberish(q);
  const first = q
    ? (num ? [`You said ${q}. How did you get ${q}?`, `${cap(q)}, you said. Tell me how you got ${q}.`] : [`You said ${q}. How did you work that out?`, `${cap(q)}, you said. Tell me how you thought of that.`])
    : ['Tell me how you worked that out.', 'How did you get that?'];
  const second = q
    ? (num
      ? [fig ? `Show me on the ${fig} how you got ${q}.` : `What did you count to get ${q}?`, `What did you count to get ${q}?`, `Walk me through how you got ${q}.`]
      : [fig ? `Show me on the ${fig} what you mean by ${q}.` : `What were you thinking when you said ${q}?`, `What were you thinking when you said ${q}?`])
    : [fig ? `Show me on the ${fig} how you worked it out.` : 'What were you thinking about just then?'];
  const seen = new Set((recent || []).map(norm));
  const pool = attempt >= 1 ? [...second, ...first] : [...first, ...second];
  return pool.find((x) => !seen.has(norm(x))) || pool[0];
}
const norm = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const cap = (t) => String(t || '').replace(/^./, (c) => c.toUpperCase());

/** Did the child explain (a reply to "how did you get it" that is more than a word or two, and not "I don't know")? */
export function explained(message, gaveReason = () => false) {
  const raw = String(message || '').trim();
  if (!raw || ['filler', 'lost', 'stop'].includes(childMove(raw))) return false;
  if (gaveReason(raw)) return true;
  const words = raw.replace(LEAD, '').split(/\s+/).filter((w) => w && !/^(um+|uh+|hmm+|so|well|maybe|ok|okay)$/i.test(w));
  return words.length >= 3;
}

// ---------------------------------------------------------------- answers the code can check against the board
// A question about the picture now on the board, whose answer the board itself holds. Never a "what if" ("If I cut it in
// the middle, how many pieces will there be?"): only what is there now.
const WHOLE_OR_CUT = /\b(whole|not cut)\b[^?]*\bor\b[^?]*\bcut\b|\bcut\b[^?]*\bor\b[^?]*\b(whole|not cut)\b/i;
const CUT_YET = /\bis (it|the \w+) cut( yet| into (pieces|parts))?\b[^?]*\?/i;
const HOW_MANY_PARTS = /\bhow many (equal )?(pieces|parts)\b(?![^?]*\b(shaded|coloured|colored)\b)/i;
const HOW_MANY_SHADED = /\bhow many\b[^?]*\b(shaded|coloured|colored)\b/i;
const WHAT_IF = /\b(if|will|would|could|after|when (i|we|you) cut|going to|guess)\b/i;
const FIGS = ['shape', 'fraction_bar', 'figure'];
const partsOf = (b) => (b.cmd === 'figure' ? Number(b.params?.parts) || (Number(b.params?.rows) * Number(b.params?.cols)) || 1 : Number(b.parts) || 1);
const shadedOf = (b) => { const sh = b.cmd === 'figure' ? b.params?.shaded : b.shaded; return Array.isArray(sh) ? sh.length : Number(sh) || 0; };

/**
 * The child's answer marked from the board, or null when the question is not one the board answers:
 * { correct, said, want, kind: 'state' | 'count_total' | 'count_shaded' }.
 */
export function boardMark(question, board = [], message = '') {
  const q = String(question || '').trim();
  if (!/\?\s*$/.test(q)) return null;
  const figs = (board || []).filter((b) => b && FIGS.includes(b.cmd));
  if (figs.length !== 1) return null; // one picture, so "the circle" is not in doubt
  const fig = figs[0];
  const parts = partsOf(fig); const shaded = shadedOf(fig);
  const m = String(message || '').toLowerCase();
  if (!m.trim() || ['filler', 'lost', 'question', 'stop'].includes(childMove(message))) return null;
  const nums = readAnswer(message).found.filter((f) => f.kind === 'number' && !f.negated).map((f) => Number(f.value));
  if (WHOLE_OR_CUT.test(q)) {
    const saysWhole = /\b(whole|not cut|one piece|full)\b/.test(m); const saysCut = /\b(cut|pieces|parts|halves|two)\b/.test(m) && !/\bnot cut\b/.test(m);
    if (saysWhole === saysCut) return null;
    return { kind: 'state', correct: saysWhole === (parts <= 1), said: saysWhole ? 'whole' : 'cut', want: parts <= 1 ? 'whole' : 'cut' };
  }
  if (CUT_YET.test(q) && !WHAT_IF.test(q)) {
    const yes = /\b(yes|yeah|yep|it is|cut)\b/.test(m) && !/\b(no|not)\b/.test(m); const no = /\b(no|nope|not)\b/.test(m);
    if (yes === no) return null;
    return { kind: 'state', correct: yes === (parts > 1), said: yes ? 'yes' : 'no', want: parts > 1 ? 'yes' : 'no' };
  }
  if (WHAT_IF.test(q.replace(/\bhow many\b/i, ''))) return null;
  if (nums.length !== 1) return null;
  if (HOW_MANY_SHADED.test(q)) return { kind: 'count_shaded', correct: nums[0] === shaded, said: inWords(String(nums[0])) || String(nums[0]), want: shaded };
  if (HOW_MANY_PARTS.test(q)) return { kind: 'count_total', correct: nums[0] === parts, said: inWords(String(nums[0])) || String(nums[0]), want: parts };
  return null;
}

export default { DIAG_CLASSES, DIAG_TRIES, quoteOf, diagnosisLine, explained, boardMark };
