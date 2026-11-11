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
//   2. SAFEGUARDING on the child's raw words, recorded before anything can
//      return early;
//   3. the child's answer to the last question, marked HERE from the sealed
//      question (the model never marks);
//   4. the child-message guard: personal details and rule-changing never reach
//      the model;
//   5. the caps: US$ per session and per child per day (settings); at a cap
//      the tutor winds down kindly;
//   6. the model, names scrubbed, prefix cached, structured output;
//   7. every step validated (commands.js), the turn checked for answer leaks
//      (guard.js) and the AI disclosure on turn 1; one retry with the reasons,
//      then an authored line;
//   8. questions sealed, cost metered, the turn returned.
// ============================================================================
import { validateTurn, turnProblems, MAX_SPOKEN_WORDS } from './commands.js';
import { pickTarget, lessonSkills, allowedMisconceptions } from './fractions.js';
import { capCheck } from './session.js';
import { screenChild, checkTurnText, MAX_CHILD_CHARS, ANSWER_REPLY } from './guard.js';
import { buildRequest, turnContext } from './prompt.js';
import { probeBank, bankLines, markItem } from './probes.js';
import { seal, unseal } from './seal.js';
import { costOf, PRICES } from '../rocket/guide.js';
import { validateSnapshot, imageTokens, CHECK_GAP_MS } from './snapshot.js';
import { speechCost, listenCost, spokenChars } from './providers/voice.js';

const reply = (status, body) => ({ status, body });
const say = (text) => ({ cmd: 'say', text });
const handBack = { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 };

export const OFF_REPLY = 'The live tutor is switched off.';
export const ADULTS_ONLY = 'The live tutor is for adult test accounts only until parent consent is built (milestone 5).';
export const DISCLOSURE = 'Hello. I am HOREB, an AI tutor. I am a computer program, not a person.';
export const NO_PICTURE_TURN = [say('I cannot look at pictures just now.'), say('Please type your answer for me.'), { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 }];
// A rough price for one turn before it is made, so a picture is never sent past a cap.
export const TURN_ESTIMATE_USD = 0.02;
// With voice: the tutor's words (about 250 characters a turn) are spoken, and the child's speech heard.
export const VOICE_TURN_CHARS_ESTIMATE = 250;
export const MAX_AUDIO_S = 90;
export const FALLBACK_TURN = [say('Let me think about that a different way.'), say('Tell me what you think the first step is.'), handBack];
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
 * @param {object} a.db     getChild, getProgress, spend, recordUsage, recordConcern (see the fake in the test)
 * @param {Function|null} a.callModel  null when no API key is set
 * @param {Function|null} a.safeguard  src/ai/safeguarding.js screen
 * @param {object} a.settings  settingsFrom(env)
 * @param {object} a.lib    the misconception library (engine/data/curriculum/g5.misconceptions.json)
 * @param {string} a.secret the seal key (server only)
 * @param {number} [a.now]
 */
export async function runTutorTurn({ user, body, db, callModel = null, safeguard = null, settings, lib = {}, secret, now = Date.now() }) {
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
  const message = String(body?.message ?? '').trim().slice(0, MAX_CHILD_CHARS);
  const turnIndex = Math.max(0, Number(body?.turn_index) || 0);

  // 2. Safeguarding, before anything that can return early.
  if (message && safeguard) {
    const hit = safeguard(message);
    if (hit && hit.tier !== 'none') {
      // Nothing else stores the child's words in milestone 1, so the snapshot is kept here.
      await db.recordConcern({
        source: 'voice_tutor', source_id: /^[0-9a-f-]{36}$/i.test(sid) ? sid : null, user_id: user.id, learner_id: child?.id || null,
        grade: Number(String(child?.grade ?? '').replace(/\D/g, '')) || null, text_snapshot: message,
        tier: hit.tier, categories: hit.categories, detected_by: 'rule',
        rule_ids: (hit.hits || []).map((h) => h.id), excerpt: (hit.hits || []).map((h) => h.excerpt).join(' | ').slice(0, 1000),
      });
    }
  }

  // 3. The last question, marked from its seal.
  let marked = null;
  let open = null; // the question the child is still working on
  if (body?.answer?.seal) {
    const q = await unseal(body.answer.seal, secret, { session: sid, child: childKey, now });
    if (q) {
      const r = markItem(q.item, String(body.answer.response ?? '').slice(0, 60));
      marked = { ask: q.ask, skill: q.item.cskill || q.skill || null, correct: r.correct, misconception: r.mis || null, answer: String(body.answer.response ?? '').slice(0, 60) };
      if (!r.correct) open = q.item;
    }
  }

  // Where the lesson is.
  const progress = (await db.getProgress(childKey)) || { skills: {} };
  const pick = pickTarget(progress, body?.skill || null);
  const skills = lessonSkills(pick.target);
  const allowedMis = allowedMisconceptions(skills);
  const board = Array.isArray(body?.board) ? body.board.slice(0, 40) : [];
  // Pictures of the child's work this session (the page counts them); a diagnosis may name one.
  const snapshots = Math.max(0, Math.min(999, Number(body?.snapshots_taken) || 0));
  const inkCellsIn = Array.isArray(body?.ink_cells) ? body.ink_cells.slice(0, 6).map(String) : [];
  const vopts = { board, allowedMis, skills, snapshots, inkCells: inkCellsIn };
  let picture = null; // { id, reason, attached, note } for the reply and the context
  // The voice: the child's speech since the last turn (seconds the microphone sent, as the page
  // measured them, at most 90), and whether the tutor's words will be spoken. Every reply from
  // here on is priced with its speech, guard replies included.
  const voice = body?.voice === true;
  const audioS = Math.max(0, Math.min(MAX_AUDIO_S, Number(body?.audio_in_s) || 0));
  const listenUsd = listenCost(audioS);
  const voiceMeter = { voice, audioS, listenUsd };
  const out = async (steps, extra = {}) => {
    const v = validateTurn({ steps }, vopts);
    if (voiceMeter) {
      const chars = voiceMeter.voice ? spokenChars(v.steps) : 0;
      const usd = speechCost(chars) + voiceMeter.listenUsd;
      if (chars || voiceMeter.audioS) await db.recordUsage({ user_id: user.id, child_key: childKey, session_id: sid, model: 'voice', cost_usd: usd, guard: ['voice'], dropped_steps: 0, tts_chars: chars, audio_in_s: voiceMeter.audioS });
      extra = { ...extra, cost: (extra.cost || 0) + usd, spent: extra.spent ? addSpent(extra.spent, usd) : extra.spent, voice: { chars, audio_s: voiceMeter.audioS, usd } };
    }
    return reply(200, { steps: await sealAsks(v.steps, extra.bank || []), dropped: extra.dropped || v.dropped, notes: extra.notes || v.notes, marked, target: pick.target, prerequisite: pick.prerequisite, guard: extra.guard || [], cost_usd: extra.cost || 0, spent: extra.spent || null, model: extra.model || null, picture: picture && { id: picture.id, used: !!picture.attached, reason: picture.reason, why: picture.why || null }, voice: extra.voice || null });
  };
  // 8 (shared). The hidden half of each question is sealed; the browser gets the public half.
  const sealAsks = async (steps, bank) => Promise.all(steps.map(async (s) => {
    if (s.cmd !== 'ask') return s;
    const item = itemFor(s, bank);
    const { expected, accepts, wrong, bank: b, ...pub } = s;
    // A bank question is shown as the bank has it: its choices, or a typed box.
    if (item?.kind === 'choice') { pub.form = 'choice'; pub.choices = item.options.map((o) => o.text); }
    else if (item && pub.form === 'choice') { pub.form = /\//.test(item.answer) ? 'fraction' : 'number'; delete pub.choices; }
    pub.skill = item?.cskill || s.skill || pick.target;
    if (!item) return pub;
    return { ...pub, seal: await seal({ session: sid, child: childKey, ask: s.id, skill: pub.skill, item }, secret, now) };
  }));

  // 4. The child's words.
  const screen = message ? screenChild(message) : { ok: true, wantsAnswer: false };
  if (!screen.ok) return out([say(screen.reply), handBack], { guard: [screen.kind] });

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
  if (!cap.ok) return out(WIND_DOWN, { guard: [cap.reason], spent });
  if (!callModel) return out(image ? NO_PICTURE_TURN : screen.wantsAnswer ? [say(ANSWER_REPLY), handBack] : FALLBACK_TURN, { guard: ['offline'], spent });

  // 6. The model.
  const bank = probeBank(skills, `${sid}:${turnIndex}`);
  const names = child?.name ? [{ name: child.name, as: 'the child' }] : [];
  const context = turnContext({
    ...pick, elapsedMin: Math.max(0, Number(body?.elapsed_s) || 0) / 60, turnIndex, phase: body?.phase || null,
    board, marked, heard: typeof body?.heard === 'string' ? body.heard.slice(0, 400) : null, wantsAnswer: screen.wantsAnswer,
    bankLines: bankLines(bank), picture,
  });
  const history = Array.isArray(body?.history) ? body.history.slice(-40).filter((h) => h && typeof h.text === 'string') : [];
  const base = { model: settings.model, effort: settings.effort, lib, history, message, context, names, image };
  // A picture taken because the child paused may get only a nod.
  const nod = !!image && image.reason === 'idle' && !message;

  let cost = 0;
  const meter = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
  const attempt = async (retry) => {
    const res = await callModel(buildRequest({ ...base, retry }));
    const u = res?.usage || {};
    for (const k of Object.keys(meter)) meter[k] += u[k] || 0;
    cost += costOf(settings.model, u);
    if (res?.stop_reason === 'refusal') return { refused: true };
    const text = (res?.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    let raw = null;
    try { raw = JSON.parse(text); } catch { return { text, reasons: ['the reply was not valid JSON'] }; }
    const v = validateTurn(raw, vopts);
    const reasons = [...v.dropped.map((d) => `step ${d.index} (${d.cmd}) dropped: ${d.reason}`), ...turnProblems(v.steps, { nod, maxWords: MAX_SPOKEN_WORDS })];
    // 7. The answer guard: the open question, and any asked now.
    const hidden = [open, ...v.steps.filter((s) => s.cmd === 'ask').map((s) => itemFor(s, bank))].filter(Boolean);
    const leak = checkTurnText(v.steps, hidden);
    if (!leak.ok) reasons.push(...leak.reasons.map((r) => `${r}: never give the answer`));
    // The child is told it is an AI on turn 1, whatever the model wrote.
    if (turnIndex === 0 && !v.steps.some((s) => s.cmd === 'say' && DISCLOSES.test(s.text))) {
      if (v.steps.length < 12) v.steps.unshift(say(DISCLOSURE));
      else { const k = v.steps.findIndex((s) => s.cmd === 'say'); v.steps[k] = say(DISCLOSURE); }
    }
    return { text, v, reasons, leaked: !leak.ok, fatal: !leak.ok || turnProblems(v.steps, { nod, maxWords: MAX_SPOKEN_WORDS }).length > 0 };
  };

  let r;
  const guard = [];
  try {
    r = await attempt(null);
    if (!r.refused && r.reasons?.length) {
      guard.push('retried');
      const again = await attempt({ previous: r.text || '', reasons: r.reasons.slice(0, 8) });
      // Keep the first if the retry is worse; a turn with only dropped decoration is still usable.
      r = again.refused ? again : (!again.fatal || r.fatal ? again : r);
    }
  } catch (e) {
    await logUsage(db, { user, childKey, sid, settings, cost, meter, guard: [...guard, 'model-error'], dropped: 0, image });
    return out(FALLBACK_TURN, { guard: [...guard, 'model-error'], cost, spent: addSpent(spent, cost) });
  }
  if (r.refused) guard.push('refusal');
  const usable = r.v && !r.fatal;
  if (!usable && !r.refused) guard.push(r.leaked ? 'answer-leak' : 'invalid-turn');
  const steps = usable ? r.v.steps : (screen.wantsAnswer ? [say(ANSWER_REPLY), handBack] : FALLBACK_TURN);
  await logUsage(db, { user, childKey, sid, settings, cost, meter, guard, dropped: r.v?.dropped.length || 0, image });
  const body2 = await out(steps, { bank, guard, cost, spent: addSpent(spent, cost), model: settings.model, dropped: r.v?.dropped || [], notes: r.v?.notes || [] });
  return body2;
}

const addSpent = (s, c) => ({ session: (s?.session || 0) + c, day: (s?.day || 0) + c });
export const dayStart = (now) => { const d = new Date(now); d.setUTCHours(0, 0, 0, 0); return d.toISOString(); };

// The picture itself is never stored (milestone 4 decides storage); only that one was sent, and its size.
const logUsage = (db, { user, childKey, sid, settings, cost, meter, guard, dropped, image = null }) => db.recordUsage({
  user_id: user.id, child_key: childKey, session_id: sid, model: settings.model, cost_usd: cost,
  input_tokens: meter.input_tokens, output_tokens: meter.output_tokens,
  cache_read_tokens: meter.cache_read_input_tokens, cache_write_tokens: meter.cache_creation_input_tokens,
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

export default { runTutorTurn, itemFor, WIND_DOWN, FALLBACK_TURN, DISCLOSURE };
