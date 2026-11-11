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
// prepareTurn() does 1 to 5 and either refuses (a status and an error) or
// returns go(emit), which streams the turn as events:
//   { type:'meta', target, prerequisite, marked, picture }
//   { type:'step', step }            in order, each already checked and sealed
//   { type:'end', guard, dropped, notes, cost_usd, spent, voice, model }
// There is one path: authored replies (guards, caps, no key) stream the same way.
// runTutorTurn() collects the events, for the tests.
// ============================================================================
import { validateTurn, MAX_SPOKEN_WORDS, spokenWords } from './commands.js';
import { pickTarget, lessonSkills, allowedMisconceptions } from './fractions.js';
import { capCheck } from './session.js';
import { screenChild, screenAll, careTurn, checkTurnText, MAX_CHILD_CHARS, ANSWER_REPLY } from './guard.js';
import { stepParser } from './streamSteps.js';
import { buildRequest, turnContext } from './prompt.js';
import { probeBank, bankLines, markItem } from './probes.js';
import { seal, unseal } from './seal.js';
import { costOf, PRICES } from '../rocket/guide.js';
import { validateSnapshot, imageTokens, CHECK_GAP_MS } from './snapshot.js';
import { speechCost, listenCost, spokenChars } from './providers/voice.js';
import { tutorEvidence } from '../learner/evidence.js';
import { readSkills, openMisconceptions, learnerLines } from '../learner/model.js';
import { readLearner, rememberEvidence, saveLearned, finishLesson } from '../learner/tutorLearning.js';
import { FRACTION_SKILLS, skillName } from './fractions.js';

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
// When a sentence fails its check mid-turn: what has been said stays said, and the tutor turns it back to the child.
export const RECOVER_TURN = [say('Let me stop there.'), say('Tell me what you think the next step is.'), handBack];
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
  const message = String(body?.message ?? '').trim().slice(0, MAX_CHILD_CHARS);
  const turnIndex = Math.max(0, Number(body?.turn_index) || 0);

  // 2. Safeguarding, before anything that can return early: the child's message AND a typed answer
  //    (both are words of the child that would otherwise reach the model or the evidence log).
  const answerText = String(body?.answer?.response ?? '').slice(0, MAX_CHILD_CHARS);
  let concern = null;
  for (const text of [message, answerText]) {
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

  // 3. The last question, marked from its seal.
  let marked = null;
  let open = null; // the question the child is still working on
  if (body?.answer?.seal && !concern) {
    const q = await unseal(body.answer.seal, secret, { session: sid, child: childKey, now });
    if (q) {
      const r = markItem(q.item, String(body.answer.response ?? '').slice(0, 60));
      marked = { ask: q.ask, skill: q.item.cskill || q.skill || null, correct: r.correct, misconception: r.mis || null, answer: String(body.answer.response ?? '').slice(0, 60) };
      if (!r.correct) open = q.item;
      // One row in the learner's evidence log per marked answer. Never allowed to fail the turn.
      try {
        const row = tutorEvidence({ userId: user.id, childId: child?.id || null, sid, marked, now });
        if (row) { await db.recordEvidence(row); rememberEvidence({ sid, userId: user.id, childId: child?.id || null, row }); }
      } catch (e) { console.error('voice-tutor: evidence', String(e?.message || e).slice(0, 200)); }
    }
  }

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
  let picture = null; // { id, reason, attached, note } for the reply and the context
  // The voice: the child's speech since the last turn (seconds the microphone sent, as the page
  // measured them, at most 90), and whether the tutor's words will be spoken. Every reply from
  // here on is priced with its speech, guard replies included.
  const voice = body?.voice === true;
  const audioS = Math.max(0, Math.min(MAX_AUDIO_S, Number(body?.audio_in_s) || 0));
  const listenUsd = listenCost(audioS);
  const meta = () => ({ type: 'meta', target: pick.target, prerequisite: pick.prerequisite, marked, picture: picture && { id: picture.id, used: !!picture.attached, reason: picture.reason, why: picture.why || null } });
  // An authored turn (guards, caps, no key), streamed the same way as the model's.
  const authored = (steps, guard, spent) => ({ status: 200, go: async (emit) => {
    emit(meta());
    const v = validateTurn({ steps }, vopts);
    for (const st of v.steps) emit({ type: 'step', step: await sealAsk(st, []) });
    const voiceUsd = await meterVoice(v.steps);
    const ending = v.steps.find((x) => x.cmd === 'end_session');
    if (ending && !concern) await finishLesson({ db, user, child, sid, target: pick.target, summary: ending.summary, lib, now });
    emit({ type: 'end', guard, dropped: v.dropped, notes: v.notes, cost_usd: voiceUsd.usd, spent: spent ? addSpent(spent, voiceUsd.usd) : null, voice: voiceUsd, model: null });
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
  if (concern) { const care = careTurn(concern); return authored(care.steps, [care.ends ? 'safeguarding-crisis' : 'safeguarding'], null); }

  // 4. The child's words.
  const screen = message ? screenChild(message) : { ok: true, wantsAnswer: false };
  if (!screen.ok) return authored([say(screen.reply), handBack], [screen.kind], null);

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
  if (!callModel) return authored(image ? NO_PICTURE_TURN : screen.wantsAnswer ? [say(ANSWER_REPLY), handBack] : FALLBACK_TURN, ['offline'], spent);

  // 6. The model, streamed.
  const bank = probeBank(skills, `${sid}:${turnIndex}`);
  const names = child?.name ? [{ name: child.name, as: 'the child' }] : [];
  const openMis = openMisconceptions(learnerData.rows, skills, { now: nowMs });
  const learnerCtx = learnerLines({ pick, model: skillsModel, open: openMis, profile: learnerData.profile, notes: learnerData.notes, nameOf: skillName, lib, order: FRACTION_SKILLS });
  const context = turnContext({
    ...pick, learner: learnerCtx, hasModel: skillsModel.hasEvidence, elapsedMin: Math.max(0, Number(body?.elapsed_s) || 0) / 60, turnIndex, phase: body?.phase || null,
    board, marked, heard: typeof body?.heard === 'string' ? body.heard.slice(0, 400) : null, wantsAnswer: screen.wantsAnswer,
    bankLines: bankLines(bank), picture,
  });
  // Earlier lines the child said that a guard would have stopped are never re-sent to the model.
  const PRIVATE_LINE = '(the child said something private; HOREB answered with care)';
  const history = (Array.isArray(body?.history) ? body.history.slice(-40).filter((h) => h && typeof h.text === 'string') : [])
    .map((h) => (h.who === 'child' && (!screenChild(h.text).ok || screenAll(h.text, safeguard).tier !== 'none') ? { ...h, text: PRIVATE_LINE } : h));
  const request = buildRequest({ model: settings.model, effort: settings.effort, lib, history, message, context, names, image });
  // A picture taken because the child paused may get only a nod.
  const nod = !!image && image.reason === 'idle' && !message;

  return { status: 200, go: async (emit) => {
    emit(meta());
    const sent = [];          // steps sent, in order (validated, checked)
    const raws = [];          // the model's steps as written, for validation in sequence
    const dropped = []; const notes = []; const guard = [];
    const hidden = [open].filter(Boolean); // answers the child has not found: the open question, then any asked now
    let closed = false;       // pause_for_child / end_session sent, or the turn was stopped
    let saidAny = false;
    const learned = { interests: [], helps: [] }; // the silent notes of this turn: saved, never sent to the browser
    let ending = null;
    const send = async (st) => {
      if (st.cmd === 'note_interest') { learned.interests.push(st.interest); return; }
      if (st.cmd === 'note_what_helped') { learned.helps.push({ move: st.move, helped: st.helped }); return; }
      if (st.cmd === 'end_session') ending = st;
      const pub = await sealAsk(st, bank); sent.push(st); emit({ type: 'step', step: pub });
    };
    const stop = async (why) => {
      if (closed) return;
      closed = true; guard.push(why);
      for (const st of (screen.wantsAnswer && !saidAny ? [say(ANSWER_REPLY), handBack] : saidAny ? RECOVER_TURN : FALLBACK_TURN)) await send(st);
    };
    const visible = (steps) => steps.filter((x) => ['say', 'write_text', 'write_math', 'ask'].includes(x.cmd));
    const handle = async (raw) => {
      if (closed) return;
      raws.push(raw && !raw.__bad ? raw : { cmd: '__bad' });
      // Validate in sequence: the step as it stands after everything before it.
      const v = validateTurn({ steps: raws }, vopts);
      const bad = v.dropped.find((d) => d.index === raws.length - 1);
      if (bad) { dropped.push(bad); raws.pop(); return; }
      const st = v.steps[v.steps.length - 1];
      notes.splice(0, notes.length, ...v.notes);
      // The check, before the child hears or sees anything of this step.
      if (st.cmd === 'ask') { const it = itemFor(st, bank); if (it) hidden.push(it); }
      if (visible([st]).length) {
        const leak = checkTurnText(visible([...sent, st]), hidden);
        if (!leak.ok) { console.warn('voice-tutor: answer leak', leak.reasons.slice(0, 2)); await stop('answer-leak'); return; }
        const text = st.text || st.prompt || '';
        if (safeguard && text && safeguard(text)?.tier !== 'none') { await stop('unsafe-reply'); return; }
      }
      if (st.cmd === 'say') {
        // Turn 1: the child is told it is an AI before anything else.
        if (turnIndex === 0 && !saidAny && !DISCLOSES.test(st.text)) await send(say(DISCLOSURE));
        // Short turns: past the limit the tutor stops talking and waits.
        if (spokenWords([...sent, st]) > MAX_SPOKEN_WORDS) { guard.push('too-long'); closed = true; await send(handBack); return; }
        saidAny = true;
      }
      // Handing back having said nothing is not a turn (except a nod after an idle picture).
      if (st.cmd === 'pause_for_child' && !saidAny && !nod) { await stop('invalid-turn'); return; }
      await send(st);
      if (st.cmd === 'pause_for_child' || st.cmd === 'end_session') closed = true;
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
    }
    if (stopReason === 'refusal') await stop('refusal');
    // Nothing usable said: an authored line. Said something but did not hand back: hand back.
    if (!closed && !saidAny && !(nod && sent.length === 0)) await stop('invalid-turn');
    if (!closed) { closed = true; await send(handBack); }
    const cost = costOf(settings.model, usage);
    await logUsage(db, { user, childKey, sid, settings, cost, meter: usage, guard, dropped: dropped.length, image });
    const voiceUsd = await meterVoice(sent);
    // What the tutor learned about the child, and, at the end of the lesson, the note and the report. Never fails the turn.
    await saveLearned({ db, sid, user, child, learned, now });
    if (ending) await finishLesson({ db, user, child, sid, target: pick.target, summary: ending.summary, lib, now });
    emit({ type: 'end', guard, dropped, notes, cost_usd: cost + voiceUsd.usd, spent: addSpent(spent, cost + voiceUsd.usd), voice: voiceUsd, model: settings.model });
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

export default { prepareTurn, runTutorTurn, itemFor, WIND_DOWN, FALLBACK_TURN, RECOVER_TURN, DISCLOSURE };
