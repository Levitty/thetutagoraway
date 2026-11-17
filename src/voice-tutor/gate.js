// ============================================================================
// THE TURN GATE'S ONE TARGETED REWRITE (PLAN_TO_FOUR.md step 3, owner's yes 12 Nov 2026).
//
// Every step the model writes is checked by habits.js before the child hears or sees it (tutorTurn.js). A step that
// passes plays at once, as before. A say that fails is rewritten ONCE by a short model call carrying the reason, the
// sentence and the turn brief; the rewrite is checked again. If it also fails (12 Nov 2026, after run 2026-11-12-1824):
// a hard fault (a sealed answer or the board's count said, the rule said for the child, harder numbers too soon) drops the
// sentence; a soft one (repeat, unanswered) never does: the better of the two sentences is spoken. Stock phrases are noted, never rewritten (P5, run 2026-11-12-1900). The request is small (no playbook, no transcript: about 400 tokens in, 60 out) so the pause
// the child hears on a flagged step stays short; a rewrite that takes longer than REWRITE_TIMEOUT_MS is dropped.
// In tests the model is a fake: nothing here costs money unless a real callModel is passed.
// Pure apart from the call itself.
// ============================================================================
import { cleanText, LIMITS } from './commands.js';
import { HABIT_NAMES } from './habits.js';
import { fenceTeamText, scrubNames } from './guard.js';

export const REWRITE_MAX_TOKENS = 300;
export const REWRITE_TIMEOUT_MS = 4000;
// Off only by the VOICE_TUTOR_GATE=0 setting (session.js), to compare with and without it.
export const GATE_DEFAULT_ON = true;

// The same bytes every time (a short system prompt; too small to cache, and it does not need to be).
export const REWRITE_SYSTEM = `You fix one sentence of HOREB, a maths tutor speaking live to a Kenyan child of about ten. The app found a fault in the sentence and says what it is. Write the sentence again so the fault is gone and the sentence still does its job in the turn.
- Keep it short: one or two sentences, 12 words or fewer each, 30 words at most. Spoken English, fractions in words.
- Never say the answer the child is working on, in any form, nor a count the board will show, nor the rule the child should say. Describe the action and ask for the number ("I cut each half again. How many pieces?").
- If the child asked something or sounded upset, the first sentence answers that, in 15 words or fewer.
- No stock praise ("good question", "thank you for telling me", "well done", "great job"). Praise, if any, is 8 words or fewer and names the child's own step with one of their words.
- No "yes" to an unsure fraction or comparison with no reason: say what you heard, then ask what made them say it. A count needs no reason.
- Never do the child's step: if the child was asked how to cut it or what to shade, do not say you cut or shade it; ask them to say or show it.
- Say only what the board shows (the brief says what is on it). At most one question, at the end.
- Do not repeat what HOREB said in the last turns; say something new that responds to the child.
- Keep the same numbers as the problem the child is on unless the app says moving up is allowed.
Reply with only one JSON object: {"text":"..."}`;

/** The rewrite request: the sentence, why it failed, the child's words and the brief. Small on purpose. */
export function rewriteRequest({ model, text, reasons = [], child = '', brief = [], before = [], names = [] }) {
  const lines = [
    // The child's words fenced (never instructions), and names scrubbed from everything, as in the turn's own request.
    `The child's last words: ${child ? `<child>${fenceTeamText(String(child)).slice(0, 200)}</child>` : '(none: silent, or the lesson is starting)'}`,
    ...(before.length ? [`What HOREB has already said this turn: "${before.join(' ').slice(0, 300)}"`] : []),
    ...brief.slice(0, 8).map((l) => String(l).slice(0, 400)),
    `The sentence: "${String(text).slice(0, LIMITS.say + 20)}"`,
    `What is wrong with it: ${reasons.map((r) => `${HABIT_NAMES[r.habit] || r.habit}: ${r.reason}`).join('; ').slice(0, 600)}`,
  ];
  return {
    model,
    max_tokens: REWRITE_MAX_TOKENS,
    output_config: { effort: 'low' },
    system: [{ type: 'text', text: REWRITE_SYSTEM }],
    messages: [{ role: 'user', content: [{ type: 'text', text: scrubNames(lines.join('\n'), names) }] }],
    stream: true,
  };
}

/** The rewritten sentence from the model's reply, or null: only {"text": "..."}, cleaned and within the say limit. */
export function parseRewrite(raw) {
  const t = String(raw || '').trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
  const at = t.indexOf('{'); const end = t.lastIndexOf('}');
  if (at < 0 || end <= at) return null;
  let o;
  try { o = JSON.parse(t.slice(at, end + 1)); } catch { return null; }
  if (!o || typeof o !== 'object' || typeof o.text !== 'string' || Array.isArray(o.steps)) return null;
  const c = cleanText(o.text).text.trim();
  if (!c || c.length > LIMITS.say) return null;
  return c;
}

/**
 * One rewrite: the model called once, streamed, with a time limit. @returns {{ text: string|null, usage, ms, why?: string }}
 */
export async function rewriteOnce(callModel, req, { timeoutMs = REWRITE_TIMEOUT_MS, now = () => Date.now() } = {}) {
  const t0 = now();
  let buf = '';
  let timer = null;
  try {
    const call = callModel(req, { onText: (x) => { buf += x; } });
    const res = await Promise.race([call, new Promise((r) => { timer = setTimeout(() => r({ timedOut: true }), timeoutMs); })]);
    if (res?.timedOut) { call.catch(() => {}); return { text: null, usage: {}, ms: now() - t0, why: 'timeout' }; }
    if (res?.stop_reason === 'refusal') return { text: null, usage: res.usage || {}, ms: now() - t0, why: 'refusal' };
    return { text: parseRewrite(buf), usage: res?.usage || {}, ms: now() - t0, why: null };
  } catch (e) {
    return { text: null, usage: {}, ms: now() - t0, why: `error: ${String(e?.message || e).slice(0, 80)}` };
  } finally { if (timer) clearTimeout(timer); }
}

/** Token counts added up (the turn's model call and its rewrites are billed as one). */
export const addUsage = (a = {}, b = {}) => {
  const out = { ...a };
  for (const k of ['input_tokens', 'output_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens']) if (b[k]) out[k] = (out[k] || 0) + b[k];
  return out;
};

export default { REWRITE_SYSTEM, rewriteRequest, parseRewrite, rewriteOnce, addUsage, GATE_DEFAULT_ON };
