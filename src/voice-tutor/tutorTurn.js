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
// prepareTurn() does 1 to 5 and either refuses (a status and an error) or
// returns go(emit), which streams the turn as events:
//   { type:'meta', target, prerequisite, marked, picture }
//   { type:'step', step }            in order, each already checked and sealed
//   { type:'end', guard, dropped, notes, cost_usd, spent, voice, model, lesson, tester }
// There is one path: authored replies (guards, caps, no key) stream the same way.
// runTutorTurn() collects the events, for the tests.
// ============================================================================
import { validateTurn, MAX_SPOKEN_WORDS, spokenWords, cleanText, doingOf, LIMITS } from './commands.js';
import { pickTarget, lessonSkills, allowedMisconceptions } from './fractions.js';
import { capCheck } from './session.js';
import { screenChild, screenAll, careTurn, checkTurnText, answerInQuestion, visibleText, MAX_CHILD_CHARS, ANSWER_REPLY } from './guard.js';
import { stepParser } from './streamSteps.js';
import { buildRequest, turnContext, MAX_PROBE_WORDS } from './prompt.js';
import { probeBank, bankLines } from './probes.js';
import { markSpoken, canonAnswer, speakAnswer } from './spokenAnswer.js';
import { seal, unseal } from './seal.js';
import { costOf, PRICES } from '../rocket/guide.js';
import { validateSnapshot, imageTokens, CHECK_GAP_MS } from './snapshot.js';
import { speechCost, listenCost, spokenChars } from './providers/voice.js';
import { tutorEvidence } from '../learner/evidence.js';
import { readSkills, openMisconceptions, learnerLines } from '../learner/model.js';
import { readLearner, rememberEvidence, upgradeEvidence, saveLearned, finishLesson } from '../learner/tutorLearning.js';
import { FRACTION_SKILLS, skillName } from './fractions.js';
import { cleanPace } from './childVoice.js';
import { cleanLesson, decide, judgeTurn, updateLesson, finalClass, isIndependent, lessonLines } from './orchestrator.js';
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
 * What the tutor says when a turn has to be stopped (no usable words, the model failed, a sentence failed its check),
 * in the context of the lesson: what the code decided, what the child just did, the question still open.
 * It never asks the child to say it again (12 Nov 2026: "Sorry, I lost my words... can you say that again?" was 15% of
 * all turns, and once came straight after a disclosure). `saidAny`: the tutor has already spoken this turn.
 * @returns {{ lines: string[], doing: string, end?: object }}
 */
export function recoverLines({ rule = null, probe = null, marked = null, openPrompt = null, saidAny = false, doing = null } = {}) {
  const yes = marked?.correct && !saidAny ? [marked.said ? `Yes, ${marked.said}.` : 'Yes, that is right.'] : [];
  const again = openPrompt && /\?\s*$/.test(openPrompt) ? openPrompt : null;
  if (probe) {
    const k = probe.kind;
    if (k === 'task_checkin') return { lines: ['Take your time.', 'Tell me when you are done.'], doing: doing || 'task' };
    if (k === 'answer_smaller' || k === 'talk_again') return { lines: ['Take your time.', 'Look at the board. What do you notice?'], doing: doing || 'answer' };
    return { lines: ['Take your time. A guess is fine.'], doing: doing || 'answer' };
  }
  switch (rule) {
    case 'open': return { lines: [...(saidAny ? [] : [DISCLOSURE, LESSON_TITLE_LINE]), 'Have you ever shared a chapati with someone?'], doing: 'answer' };
    case 'care-wait': case 'care': return { lines: ['Thank you. I am listening.', 'Do you want to carry on with our fractions, or stop for today?'], doing: 'talk' };
    case 'care-return': return { lines: ['I am glad you are here.', 'Let us carry on gently. Look at the board. What do you see?'], doing: 'answer' };
    case 'stop': return { lines: ['Thank you for working with me today. You did some good thinking.'], doing: 'talk', end: { cmd: 'end_session', summary: 'The child asked to stop, and the lesson closed early.' } };
    case 'bored': return { lines: ['I hear you.', 'Shall we play a quick guessing game, or stop for today?'], doing: 'talk' };
    case 'close': return { lines: ['We did some good thinking today.', 'What is one thing you will remember?'], doing: 'talk' };
    case 'press': return { lines: [...yes, 'How did you know?'], doing: 'answer' };
    case 'fresh-check': case 'move-on': case 'reason': return { lines: [...yes, 'Can you show me that on the board?'], doing: 'task' };
    case 'diagnose': case 'change': return { lines: [...(saidAny ? [] : ['Thank you for telling me.']), 'How did you get that?'], doing: 'answer' };
    case 'thinking': return { lines: ['Take your time.'], doing: doing || 'answer' };
    case 'lost': return { lines: ['That is okay. Let us take a smaller step.', 'Look at the board. What do you see?'], doing: 'answer' };
    case 'question': return again ? { lines: ['That is a good question. Let us take it slowly.', again], doing: 'answer' } : { lines: ['That is a good question.', 'Look at the board with me. What do you notice?'], doing: 'answer' };
    default: return again ? { lines: [...yes, saidAny ? again : `Let me ask you again. ${again}`], doing: 'answer' } : { lines: [...yes, 'What do you think?'], doing: 'answer' };
  }
}
const recoverSteps = (r) => [...r.lines.map(say), r.end || { ...handBack, doing: r.doing }];

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
  const response = String((body?.answer?.seal ? body.answer.response : message) ?? '').slice(0, MAX_CHILD_CHARS);
  if (sealToken && !concern) {
    const q = await unseal(sealToken, secret, { session: sid, child: childKey, now });
    if (q) {
      question = q.item;
      const r = markSpoken(q.item, response);
      if (r.attempt) {
        marked = { ask: q.ask, skill: q.item.cskill || q.skill || null, correct: r.correct, misconception: r.mis || null, answer: response.slice(0, 60), said: r.correct ? speakAnswer(r.said) : null, canon: r.correct ? canonAnswer(q.item.answer) : null };
        if (!r.correct) open = q.item;
      } else { open = q.item; unanswered = { seal: sealToken, why: r.why }; }
    }
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
  const decision = concern ? null : decide(lesson0, { turnIndex, elapsedMin, sessionMinutes: settings.sessionMinutes || 20, marked, message, probe, question, prerequisite: pick.prerequisite ? skillName(pick.prerequisite) : null });
  // Answers the child has found are theirs to hear back: never hidden again (12 Nov 2026: about 20 turns were stopped
  // for HOREB repeating the child's own right answer).
  const found = new Set([...lesson0.found, ...(marked?.canon ? [marked.canon] : [])]);
  const hiddenOk = (it) => !!it && !found.has(canonAnswer(it.answer));
  // The end of every turn: the answer judged and recorded, the lesson state moved on, what the tester sees.
  const closeTurn = async ({ steps, assessment = null, hidden = [], codeNotes = [] }) => {
    const judged = concern ? null : finalClass({ assessment, marked, message });
    await recordJudged(judged);
    // A care reply pauses the lesson; a crisis ends it. The question the child did not answer stays open one more turn.
    // (A silence probe keeps it too: the child is still on that question.)
    const asks = steps.some((x) => x.cmd === 'ask');
    const keepSeal = asks ? null : unanswered ? unanswered.seal : probe ? lesson0.seal : null;
    const lesson = concern ? { ...lesson0, turns: lesson0.turns + 1, care: careEnds ? 'ended' : 'paused', seal: null }
      : updateLesson(lesson0, { decision, steps, judged, marked, probe, elapsedMin, keepSeal });
    // The model's evidence is the child's own words; checked again so no hidden answer rides in it.
    const evidence = judged?.evidence && checkTurnText([{ cmd: 'say', text: judged.evidence }], hidden).ok ? judged.evidence : '';
    const tester = {
      rule: decision?.rule || null, moves: decision?.moves || [], with: decision?.with || [], reason: decision?.reason || null, stageMax: decision?.stageMax || null,
      judged: judged ? { class: judged.class, misconception: judged.misconception, source: judged.source, note: judged.note, evidence } : null,
      kept: [...judgeTurn(decision, steps), ...codeNotes], probe,
      unanswered: unanswered ? unanswered.why : null,
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
  if (decision?.authored) return authored(CARE_WAIT, [decision.rule], null);

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
  // The question still open (wrong, or not answered yet): the recovery may put it again. Never one answered right.
  const openPrompt = open?.question || null;
  const recoverFor = (saidAny) => recoverSteps(recoverLines({ rule: decision?.rule, probe, marked, openPrompt, saidAny, doing: probe ? lesson0.doing : null }));
  if (!callModel) return authored(image ? NO_PICTURE_TURN : screen.wantsAnswer ? [say(ANSWER_REPLY), handBack] : recoverFor(false), ['offline'], spent);

  // 6. The model, streamed.
  const bank = probeBank(skills, `${sid}:${turnIndex}`);
  const names = child?.name ? [{ name: child.name, as: 'the child' }] : [];
  const openMis = openMisconceptions(learnerData.rows, skills, { now: nowMs });
  const learnerCtx = learnerLines({ pick, model: skillsModel, open: openMis, profile: learnerData.profile, notes: learnerData.notes, nameOf: skillName, lib, order: FRACTION_SKILLS });
  const context = turnContext({
    ...pick, learner: learnerCtx, hasModel: skillsModel.hasEvidence, elapsedMin, turnIndex, phase: body?.phase || null,
    board, marked, heard: typeof body?.heard === 'string' ? body.heard.slice(0, 400) : null, wantsAnswer: screen.wantsAnswer,
    bankLines: bankLines(bank), picture, figures, pace: cleanPace(body?.pace),
    lesson: lessonLines(lesson0, decision), probe, inkCells: inkCellsIn, doing: lesson0.doing,
    unanswered: unanswered && question ? { ask: question.question, why: unanswered.why } : null,
  });
  // Earlier lines the child said that a guard would have stopped are never re-sent to the model.
  const PRIVATE_LINE = '(the child said something private; HOREB answered with care)';
  const history = (Array.isArray(body?.history) ? body.history.slice(-40).filter((h) => h && typeof h.text === 'string') : [])
    .map((h) => (h.who === 'child' && (!screenChild(h.text).ok || screenAll(h.text, safeguard).tier !== 'none') ? { ...h, text: PRIVATE_LINE } : h));
  // A probe thinks as hard as any turn: at low effort 18 of 21 probes came back in the wrong shape (12 Nov 2026), and
  // probes are a few turns a lesson. The effort is outside the cached prompt either way.
  const request = buildRequest({ model: settings.model, effort: settings.effort, lib, history, message, context, names, image, probe });
  // A picture taken because the child paused may get only a nod.
  const nod = !!image && image.reason === 'idle' && !message;

  return { status: 200, go: async (emit) => {
    emit(meta());
    const sent = [];          // steps sent, in order (validated, checked)
    const raws = [];          // the model's steps as written, for validation in sequence
    let validated = 0;        // how many of the validated steps have been handled
    const dropped = []; const notes = []; const guard = []; const codeNotes = [];
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
    const lastSay = () => [...sent].reverse().find((x) => x.cmd === 'say');
    const asked = () => /\?\s*$/.test(lastSay()?.text || '');
    const doingNow = () => (probe ? lesson0.doing : null);
    // The turn stopped: what was said stays said, and the tutor carries on in context (recoverLines).
    const stop = async (why) => {
      if (closed) return;
      guard.push(why);
      if (screen.wantsAnswer && !saidAny) { closed = true; for (const st of [say(ANSWER_REPLY), handBack]) await send(st); return; }
      if (saidAny && asked()) { closed = true; await send(handBackAs(doingNow() || 'answer', sent)); return; }
      const steps = recoverFor(saidAny);
      closed = true;
      for (const st of steps) await (st.cmd === 'say' ? speak(st) : send(st));
    };
    // The turn ends: a turn that has not asked anything yet (and is not a task) ends on its question.
    const finish = async () => {
      if (closed) return;
      if (!probe && !asked() && doingOf(sent) !== 'task') {
        const ask = sent.find((x) => x.cmd === 'ask');
        if (ask && /\?\s*$/.test(ask.prompt)) await speak(say(ask.prompt));
        else if (!nod || saidAny) { const r = recoverLines({ rule: decision?.rule, marked, openPrompt, saidAny }); for (const l of r.lines) await speak(say(l)); }
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

    // One step, validated, as it arrives: checked before the child hears or sees anything of it.
    const step = async (st) => {
      if (closed) return;
      if (st.cmd === 'ask') {
        // Never the question the child has just answered right (12 Nov 2026: right answers were re-asked).
        if (decision?.answered && samePrompt(st.prompt, decision.answered.prompt)) { drop(st, 'asks again the question the child has just answered right', 're-ask'); return; }
        const it = itemFor(st, bank);
        if (hiddenOk(it)) {
          // Its answer was already said in this turn ("into four equal pieces" ... "How many pieces?"): not asked, and the turn goes on.
          if (!checkTurnText(visible(sent), [it]).ok) { drop(st, 'its answer was already said in this turn, so it is not asked', 'answer-before-ask'); return; }
          hidden.push(it);
        }
      }
      if (visible([st]).length) {
        const leak = checkTurnText(visible([...sent, st]), hidden);
        if (!leak.ok) { console.warn('voice-tutor: answer leak', leak.reasons.slice(0, 2)); await stop('answer-leak'); return; }
        const text = st.text || st.prompt || '';
        if (safeguard && text && safeguard(text)?.tier !== 'none') { await stop('unsafe-reply'); return; }
      }
      if (st.cmd === 'say' || st.cmd === 'write_text') {
        // The answer inside its own question, in the same turn: that sentence is not said, and the turn goes on.
        const aiq = answerInQuestion(visibleText(visible([...sent, st])).map((x) => x.text).join(' '), { found: [...found], child: message });
        if (aiq && !answerInQuestion(visibleText(visible(sent)).map((x) => x.text).join(' '), { found: [...found], child: message })) { drop(st, `gives the answer inside its own question: ${aiq}`, 'answer-in-question'); return; }
      }
      if (st.cmd === 'say') {
        // After a right answer: name it first, in the child's words.
        if (!acked) {
          acked = true;
          if (!acknowledges(st)) { await speak({ cmd: 'say', text: cleanText(marked?.said ? `Yes, ${marked.said}.` : 'Yes, that is right.').text.slice(0, LIMITS.say), move: 'Name what was right' }); codeNotes.push('the code named what was right first: the model\'s first sentence did not'); }
        }
        // Short turns: past the limit the tutor stops talking; a short question at the end of the sentence is kept.
        const limit = probe ? MAX_PROBE_WORDS : turnIndex === 0 ? MAX_SPOKEN_WORDS + 20 : MAX_SPOKEN_WORDS;
        if (spokenWords([...sent, st]) + (turnIndex === 0 && !saidAny && !DISCLOSES.test(st.text) ? spokenWords([say(DISCLOSURE)]) : 0) > limit) {
          guard.push(probe ? 'too-long-probe' : 'too-long');
          const q = st.text.split(/(?<=[.!?])\s+/).filter(Boolean).at(-1);
          if (!probe && /\?\s*$/.test(q) && q !== st.text && spokenWords([...sent, say(q)]) <= limit + 12) await speak({ ...st, text: q });
          await finish();
          return;
        }
        await speak(st);
        return;
      }
      // Handing back having said nothing is not a turn (except a nod after an idle picture). A question on the board that
      // was not said (its sentence was dropped) is said before the hand-back.
      if (st.cmd === 'pause_for_child' && !(nod && !saidAny)) {
        const ask = sent.find((x) => x.cmd === 'ask');
        const sayable = ask && /\?\s*$/.test(ask.prompt);
        if (!saidAny && !sayable) { await stop('invalid-turn'); return; }
        if (sayable && !asked()) await speak(say(ask.prompt));
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
    const cost = costOf(settings.model, usage);
    await logUsage(db, { user, childKey, sid, settings, cost, meter: usage, guard, dropped: dropped.length, image });
    const voiceUsd = await meterVoice(sent);
    // What the tutor learned about the child, and, at the end of the lesson, the note and the report. Never fails the turn.
    await saveLearned({ db, sid, user, child, learned, now });
    const done = await closeTurn({ steps: sent, assessment, hidden, codeNotes });
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
