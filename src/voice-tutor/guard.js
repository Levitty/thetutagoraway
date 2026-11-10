// ============================================================================
// THE LIVE TUTOR'S GUARDS, the same pair as the Rocket guide's.
//
//   screenChild(text)    BEFORE the model: a child sharing personal details,
//                        or words trying to change the tutor's rules, never
//                        reach the model; an authored line answers instead.
//                        (Safeguarding, src/ai/safeguarding.js, runs before
//                        this on every message and flags for a person.)
//   checkTurnText(steps, hidden)   AFTER the model: every word the child would
//                        hear or see (say, write_text, write_math, the ask's
//                        prompt and choices) is checked against the hidden
//                        answers with src/ai/replyGuard.js leaksAnswer. A turn
//                        that gives the answer away is not shown.
//
// Names are scrubbed and the child's words fenced with the Rocket guide's own
// scrubNames / fenceTeamText (src/rocket/guard.js). Pure and offline.
// ============================================================================
import { leaksAnswer } from '../ai/replyGuard.js';
import { asksForAnswer } from '../rocket/guard.js';
import { parseMath, mathToText } from './mathExpr.js';

export { scrubNames, fenceTeamText } from '../rocket/guard.js';

export const MAX_CHILD_CHARS = 300;

const norm = (s) => String(s ?? '').toLowerCase().replace(/[’`´]/g, "'").replace(/[^a-z0-9'@.\s]+/g, ' ').replace(/\s+/g, ' ').trim();

const PERSONAL = /\b(my|our) (phone|phone number|number is|mobile|address|house is|home is|estate is|school is called|password|pin|mpesa pin|email)\b|\bi live (in|at|near)\b|\bmy (mum|mom|dad|mother|father)'?s? (phone|number|name is)\b|\b[\w.]+@[\w-]+\.\w+\b/;
const PHONE = /(?:\+?254|\b0)[\s-]?[17]\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/;
const INJECTION = /\b(ignore|forget|disregard) (all |your |the |previous |these )*(rules|instructions|prompt|system)\b|\b(act as|pretend to be|pretend you are|from now on you are|you are now) (a |an |my )?(?!tutor\b|maths tutor\b)\w+|\bsystem prompt\b|\bdeveloper mode\b|\bjailbreak\b/;

export const PERSONAL_REPLY = 'Thank you. You do not need to tell me things like that, so let us keep them private. Let us go back to our fractions.';
export const RULES_REPLY = 'I am your maths tutor, and I keep to the same rules all the time. Let us carry on with our fractions.';
export const ANSWER_REPLY = 'I will not tell you the answer, because you can work it out. Let us take one small step together.';

/**
 * @returns {{ ok:boolean, kind:'personal'|'rules'|null, reply:string, wantsAnswer:boolean }}
 */
export function screenChild(raw) {
  const t = norm(raw);
  const wantsAnswer = asksForAnswer(raw) || /\b(what is|whats|what's|tell me) the answer\b/.test(t);
  if (PERSONAL.test(t) || PHONE.test(String(raw))) return { ok: false, kind: 'personal', reply: PERSONAL_REPLY, wantsAnswer };
  if (INJECTION.test(t)) return { ok: false, kind: 'rules', reply: RULES_REPLY, wantsAnswer };
  return { ok: true, kind: null, reply: '', wantsAnswer };
}

/** Every string the child would hear or see in a turn, with where it came from. */
export const visibleText = (steps) => steps.flatMap((s, i) => {
  if (s.cmd === 'say' || s.cmd === 'write_text') return [{ i, cmd: s.cmd, text: s.text }];
  if (s.cmd === 'write_math') { const p = parseMath(s.expr); return [{ i, cmd: s.cmd, text: p.ok ? mathToText(p.tree) : s.expr }]; }
  if (s.cmd === 'ask') return [{ i, cmd: s.cmd, text: s.prompt }];
  return [];
});

/**
 * `hidden` is [{ answer, accepts, question }]: the answers the child has not
 * found yet (the open question, and any asked in this turn).
 * @returns {{ ok:boolean, reasons:string[] }}
 */
export function checkTurnText(steps, hidden = []) {
  const reasons = [];
  for (const h of hidden) {
    if (!h || h.answer == null || String(h.answer).trim() === '') continue;
    for (const v of visibleText(steps)) {
      const why = leaksAnswer({ answer: String(h.answer), accepts: h.accepts || [], question: h.question || '', reply: v.text });
      if (why) reasons.push(`step ${v.i} (${v.cmd}) ${why}`);
    }
  }
  return { ok: reasons.length === 0, reasons };
}

export default { screenChild, checkTurnText, visibleText, PERSONAL_REPLY, RULES_REPLY, ANSWER_REPLY };
