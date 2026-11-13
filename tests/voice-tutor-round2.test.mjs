// ============================================================================
// ROUND 2 OF THE FREE FIXES (owner, 13 Nov 2026: "yes do the free fixes, then run sonnet vs opus"), after run
// 2026-11-13-1027 (0 of 6 passed; diagnosis 2.0). Each fix is checked here with fakes, no model calls:
//   1 diagnose before anything else: the code's sentence quoting the child, a second ask another way, then a new picture;
//     no either/or holding the reason, no reason said for the child
//   2 words match the board: a cut said and not drawn, shading that is not there, the pieces of a cut never made, and the
//     repeat-gate rewrite that produced "the circle now"
//   3 sound-alike numbers and tentative pointing are answers
//   4 our guards: no orphaned question, no "Name what was right" on a do-not-say-yes press, no assess lost for its id,
//     a right answer said unsure is not partly right
//   5 a question that failed twice on a picture is not asked there again
//   6 the eval runner's tutor model, and the side-by-side comparison
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runTutorTurn, lastQuestionOnly, orphanQ } from '../src/voice-tutor/tutorTurn.js';
import { settingsFrom } from '../src/voice-tutor/session.js';
import { screen } from '../src/ai/safeguarding.js';
import { seal } from '../src/voice-tutor/seal.js';
import { cleanLesson, decide, updateLesson, finalClass, turnBrief, newLesson } from '../src/voice-tutor/orchestrator.js';
import { quoteOf, diagnosisLine, boardMark, explained } from '../src/voice-tutor/diagnosis.js';
import { boardFlagOf, leadingChoiceOf, tellsReasonOf, failedAgainOf, promisesDrawing, defersCut, gaveReason } from '../src/voice-tutor/habits.js';
import { childMove, hearNumbers, numberFits, loneNumberWord } from '../src/voice-tutor/spokenAnswer.js';
import { validateTurn } from '../src/voice-tutor/commands.js';
import { compareCommands, compareTable } from '../scripts/evals/compare-tutors.mjs';
import { tutorLine } from '../scripts/evals/report.mjs';

const F = 'MATH.G5.NUMBER.FRACTIONS.';
const EQ = `${F}EQUIVALENT_FRACTIONS`;
const LIB = Object.fromEntries(Object.entries(JSON.parse(readFileSync(new URL('../engine/data/curriculum/g5.misconceptions.json', import.meta.url), 'utf8'))).filter(([k]) => k.startsWith(F)));
const SECRET = 'test-secret-that-is-long-enough';
const USER = { id: 'u-parent', email: 'tester@example.com' };
const SID = '0b7e4d3c-1111-4222-8333-944455556666';
const settings = settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: 'tester@example.com' }[k]));
const world = () => ({
  usage: [], concerns: [], evidence: [],
  async getChild() { return null; }, async getProgress() { return { skills: {} }; }, async spend() { return { session: 0, day: 0 }; },
  async recordUsage(r) { this.usage.push(r); }, async recordConcern(r) { this.concerns.push(r); }, async recordEvidence(r) { this.evidence.push(r); },
});
const reply = (steps) => ({ stop_reason: 'end_turn', usage: { input_tokens: 4000, output_tokens: 600 }, content: [{ type: 'text', text: JSON.stringify({ steps }) }] });
const raw = (text) => ({ stop_reason: 'end_turn', usage: { input_tokens: 300, output_tokens: 30 }, content: [{ type: 'text', text }] });
const model = (...replies) => {
  const calls = [];
  const fn = async (req, { onText } = {}) => {
    calls.push(req);
    const r = replies[Math.min(calls.length - 1, replies.length - 1)];
    const text = (r.content || []).map((c) => c.text).join('');
    for (let i = 0; i < text.length; i += 17) onText?.(text.slice(i, i + 17));
    return { usage: r.usage, stop_reason: r.stop_reason };
  };
  fn.calls = calls;
  return fn;
};
const turn = (o = {}) => runTutorTurn({ user: USER, settings, lib: LIB, secret: SECRET, safeguard: screen, now: 1_800_000_000_000, db: world(), ...o, body: { session_id: SID, turn_index: 5, board: [], history: [], ...o.body } });
const HAND = { cmd: 'pause_for_child', expect: 'any', max_wait_s: 30, doing: 'answer' };
const say = (text, move = 'Show then hand over') => ({ cmd: 'say', text, move });
const says = (r) => r.body.steps.filter((x) => x.cmd === 'say').map((x) => x.text);
const UNCUT = [{ cmd: 'shape', id: 'c1', kind: 'circle', parts: 1, shaded: 0, slot: 'middle' }];
const HALVES = [{ cmd: 'shape', id: 'c1', kind: 'circle', parts: 2, shaded: 0, slot: 'middle' }];
const sealQ = () => seal({ session: SID, child: 'u-parent', ask: 'q1', skill: EQ, item: { kind: 'typed', cskill: EQ, question: 'How many pieces make one half?', answer: '2', accepts: ['2'], wrong: [{ value: '4', mis: `${EQ}.M_EQUIV_ADDITIVE` }] } }, SECRET, 1_800_000_000_000);
const L = (o = {}) => cleanLesson({ ...newLesson(), stage: 'teach', turns: 4, doing: 'answer', ...o });

// ---------------------------------------------------------------- 1. diagnose before anything else
test('1. the diagnosis is the code\'s: the child\'s own words, how they got it, a second ask another way, never the same words', () => {
  assert.equal(quoteOf('Umm, eight?'), 'eight');
  assert.equal(quoteOf('hmm maybe Whole, umm'), 'whole');
  assert.equal(quoteOf('I don\'t know'), null);
  assert.equal(quoteOf('Is it eight or two?'), null, 'a question back is not quoted');
  assert.equal(diagnosisLine({ quote: 'eight' }), 'You said eight. How did you get eight?');
  assert.equal(diagnosisLine({ quote: '8' }), 'You said eight. How did you get eight?');
  assert.equal(diagnosisLine({ quote: 'eight', attempt: 1, fig: 'bar' }), 'Show me on the bar how you got eight.');
  assert.equal(diagnosisLine({ quote: 'cut it in half' }), 'You said cut it in half. How did you work that out?');
  assert.notEqual(diagnosisLine({ quote: 'eight', recent: ['You said eight. How did you get eight?'] }), 'You said eight. How did you get eight?', 'never the same words twice');
  assert.equal(explained('I counted the lines and there were eight', gaveReason), true);
  assert.equal(explained('dunno', gaveReason), false);
  assert.equal(explained('um...', gaveReason), false);
});

test('1. a wrong answer: the code asks how, then asks again another way, then the picture changes; a reason ends it', () => {
  const wrong = (ask = 'q1') => ({ ask, skill: EQ, correct: false, misconception: null, answer: '8', said: null, canon: null, tentative: true });
  const s0 = L({ rep: 'circle', tried: ['circle'] });
  const d1 = decide(s0, { turnIndex: 5, marked: wrong(), message: 'Umm, eight?', board: HALVES });
  assert.deepEqual([d1.rule, d1.authored, d1.line, d1.with], ['diagnose', true, 'You said eight. How did you get eight?', []]);
  const s1 = updateLesson(s0, { decision: d1, steps: [say(d1.line, 'Diagnose the wrong answer')], judged: finalClass({ marked: wrong() }), marked: wrong(), board: HALVES });
  assert.deepEqual(s1.diag, { q: 'eight', tries: 1 });
  // "I don't know", a word, or silence: the second ask, another way (no new task, no easier question, no either/or).
  for (const ctx of [{ message: 'I don\'t know' }, { message: 'yes' }, { probe: { kind: 'answer_nudge', silent_s: 9 } }]) {
    const d2 = decide(s1, { turnIndex: 6, board: HALVES, ...ctx });
    assert.equal(d2.rule, 'diagnose', JSON.stringify(ctx));
    assert.equal(d2.line, 'Show me on the circle how you got eight.');
  }
  const d2 = decide(s1, { turnIndex: 6, message: 'I don\'t know', board: HALVES });
  const s2 = updateLesson(s1, { decision: d2, steps: [say(d2.line, 'Diagnose the wrong answer')], board: HALVES });
  assert.equal(s2.diag.tries, 2);
  // Two asks and no reason: the representation changes (SCENARIOS 15), never a third ask.
  const d3 = decide(s2, { turnIndex: 7, message: 'no', board: HALVES });
  assert.equal(d3.rule, 'diag-change');
  assert.equal(d3.avoid, 'circle');
  assert.match(d3.reason, /Change the representation \(SCENARIOS 15\)/);
  assert.equal(updateLesson(s2, { decision: d3, steps: [say('Here is a bar.')] }).diag, null);
  // A reason: reteach from it.
  const r = decide(s1, { turnIndex: 6, message: 'I counted all the lines on it', board: HALVES });
  assert.equal(r.rule, 'reteach');
  // A filler is not an attempt: the app waits.
  assert.equal(decide(s1, { turnIndex: 6, message: 'umm' }).rule, 'thinking');
  // Switched off (VOICE_TUTOR_CODE_DIAGNOSIS=0): the model writes it, as before.
  const off = decide(s0, { turnIndex: 5, marked: wrong(), message: 'Umm, eight?', codeDiagnosis: false });
  assert.deepEqual([off.rule, off.authored], ['diagnose', false]);
});

test('1. an answer the board shows wrong is diagnosed before the model; a right one said unsure is not partly right', () => {
  assert.deepEqual(boardMark('Is the circle whole, or is it cut into pieces?', UNCUT, 'hmm maybe Whole, umm'), { kind: 'state', correct: true, said: 'whole', want: 'whole' });
  assert.equal(boardMark('Is the circle whole, or is it cut into pieces?', HALVES, 'whole').correct, false);
  assert.equal(boardMark('How many pieces does the circle have?', HALVES, 'three').correct, false);
  assert.equal(boardMark('If I cut it in the middle, how many pieces will there be?', UNCUT, 'two'), null, 'a "what if" is not on the board');
  const bm = boardMark('Is the circle whole, or is it cut into pieces?', HALVES, 'umm whole');
  const d = decide(L(), { turnIndex: 5, message: 'umm whole', boardMarked: bm, board: HALVES });
  assert.deepEqual([d.rule, d.line], ['diagnose', 'You said whole. How did you work that out?']);
  // Run 2026-11-13-1027, scenario 17 turn 16: "hmm maybe Whole, umm", right, was classed partly_right for its hedging.
  const ok = boardMark('Is the circle whole, or is it cut into pieces?', UNCUT, 'hmm maybe Whole, umm');
  assert.equal(finalClass({ assessment: { class: 'partly_right', evidence: 'x' }, message: 'hmm maybe Whole, umm', boardMarked: ok }).class, 'right_unexplained');
  const sealed = { ask: 'q1', correct: true, answer: 'maybe two', said: 'two', canon: '2', tentative: true };
  assert.equal(finalClass({ assessment: { class: 'partly_right', evidence: 'x' }, marked: sealed, message: 'maybe two' }).class, 'right_unexplained');
  // Partly right stays partly right when the content is partial (a shaky reason), not merely hedged.
  assert.equal(finalClass({ assessment: { class: 'partly_right', evidence: 'x' }, marked: { ...sealed, tentative: false }, message: 'Four eighths, because 4 is half of 8 and 1 is half of 2' }).class, 'partly_right');
});

test('1. end to end: a marked wrong answer is the code\'s sentence, with no model call', async () => {
  const callModel = model(reply([say('Let us try a smaller cut. How many pieces?'), HAND]));
  const r = await turn({ callModel, body: { message: 'Umm, four?', answer: { seal: await sealQ(), response: 'Umm, four?' }, board: HALVES, lesson: L() } });
  assert.equal(callModel.calls.length, 0, 'no model call');
  assert.deepEqual(says(r), ['You said four. How did you get four?']);
  assert.equal(r.body.steps.at(-1).cmd, 'pause_for_child');
  assert.deepEqual([r.body.tester.rule, r.body.lesson.diag], ['diagnose', { q: 'four', tries: 1 }]);
});

test('1. end to end: when the model\'s own judgement reads the answer as wrong, the code diagnoses and nothing else follows', async () => {
  // Run 2026-11-13-1027, scenario 30 turn 16: "Umm, eight?" got "Eight, you said. Let us try a smaller cut. Cut the loaf in the
  // middle: how many pieces is that?" The model's assess came first and said guess_or_no_attempt.
  const callModel = model(reply([{ cmd: 'assess', class: 'guess_or_no_attempt', evidence: 'Umm, eight?' }, say('Eight, you said. Let us try a smaller cut.', 'Smaller-question hint'), { cmd: 'say', text: 'Cut the loaf in the middle: how many pieces is that?' }, HAND]));
  const history = [{ who: 'tutor', text: 'Where would you draw one line on the bar so both pieces are the same size?' }];
  const bar = [{ cmd: 'fraction_bar', id: 'loaf1', parts: 1, shaded: 0, slot: 'bottom' }];
  const r = await turn({ callModel, body: { message: 'Umm, eight?', history, board: bar, lesson: L({ stage: 'warmup' }) } });
  assert.deepEqual(says(r), ['You said eight. How did you get eight?']);
  assert.ok(r.body.guard.includes('diagnose-first'));
  assert.equal(r.body.tester.rule, 'diagnose');
  assert.equal(r.body.tester.judged.class, 'guess_or_no_attempt', 'the model\'s judgement is kept');
  assert.deepEqual(r.body.lesson.diag, { q: 'eight', tries: 1 });
  assert.equal(callModel.calls.length, 1, 'no rewrite, no second call');
  // A right reading lets the model's turn play.
  const fine = model(reply([{ cmd: 'assess', class: 'right_unexplained', evidence: 'two' }, say('Two pieces. Show me where the knife goes.'), HAND]));
  const r2 = await turn({ callModel: fine, body: { message: 'two', history, board: bar, lesson: L({ stage: 'warmup' }) } });
  assert.ok(!r2.body.guard.includes('diagnose-first'));
});

test('1. no either/or that holds the reason, and no reason said for the child, while their reason is owed', () => {
  const ctx = { recentQuestions: ['How did you know it was half?'], child: 'same', childRead: {} };
  assert.match(leadingChoiceOf('Look at the two pieces. Is one piece the same size as the other, or different?', ctx), /a choice that holds the reason/);
  assert.equal(leadingChoiceOf('Is the circle whole, or is it cut?', ctx), null, 'a choice that is not the reason');
  assert.equal(leadingChoiceOf('Is one piece the same size as the other, or different?', { recentQuestions: ['How many pieces?'] }), null, 'no reason owed');
  assert.match(tellsReasonOf('Yes, the two pieces are the same size. That is why each one is a half.', ctx), /says the reason the child was asked for/);
  assert.equal(tellsReasonOf('That is why each one is a half.', { ...ctx, child: 'because both pieces are the same size' }), null, 'the child gave it: saying it back is fine');
});

// ---------------------------------------------------------------- 2. words match the board
test('2. a cut said and not drawn, shading that is not there, and the pieces of a cut never made are caught', () => {
  const s = (text) => ({ cmd: 'say', text });
  assert.match(boardFlagOf(s('Now I will cut it so two friends share it fairly.'), { board: UNCUT }), /says it cuts .* no cut is drawn: the board still shows a whole/);
  assert.equal(boardFlagOf(s('Now I will cut it into two.'), { board: UNCUT }, [], [{ cmd: 'shape', id: 'c1', kind: 'circle', parts: 2, shaded: 0 }]), null, 'the cut that follows the sentence counts');
  assert.equal(boardFlagOf(s('Now I will cut each half again. Before I do, guess: how many pieces will there be?'), { board: HALVES }), null, 'Predict then show: the cut is put off');
  assert.equal(defersCut('Now I will cut each half again. Before I do, guess.'), true);
  assert.match(boardFlagOf(s('When you are back, how many equal pieces does the circle have now?'), { board: HALVES, promised: true }), /a cut that was never drawn/);
  assert.match(boardFlagOf(s('What do you see shaded?'), { board: [] }), /shading that is not on the board/);
  assert.match(boardFlagOf(s('Let us count the pieces.'), { board: UNCUT }), /figure that is not cut/);
  assert.equal(boardFlagOf(s('Is it cut into pieces yet, or still whole?'), { board: UNCUT }), null, 'asking whether it is cut is not a claim');
  assert.equal(boardFlagOf(s('Your half is shaded.'), { board: [{ cmd: 'figure', id: 'f1', type: 'fraction', params: { shape: 'circle', parts: 2, shaded: 0 }, controls: ['shade'] }] }), null, 'the child may have shaded it with the control');
  assert.equal(promisesDrawing('I will not cut it yet.'), null);
});

test('2. end to end: a sentence that does not match the board is rewritten once with the reason, and dropped if the rewrite fails too', async () => {
  const callModel = model(reply([say('Let me draw a chapati. Here it is. Now I will cut it so two friends share it fairly.'), { cmd: 'shape', id: 'c1', kind: 'circle', parts: 1, shaded: 0, slot: 'middle', on: 'chapati' }, say('Is the circle whole, or is it cut into pieces?'), HAND]), raw('{"text":"Now I cut it in two."}'));
  const r = await turn({ callModel, body: { message: 'umm ok', lesson: L() } });
  assert.equal(callModel.calls.length, 2, 'one rewrite');
  assert.match(callModel.calls[1].messages[0].content[0].text, /says what the board does not show: says it cuts/);
  assert.match(callModel.calls[1].messages[0].content[0].text, /On the board now|The board is empty/, 'the rewrite reads what the board shows');
  assert.ok(!says(r).some((t) => /cut it/.test(t)), 'neither the sentence nor its failed rewrite is said');
  assert.equal(says(r).at(-1), 'Is the circle whole, or is it cut into pieces?');
});

test('2. the repeat-gate rewrite path: a rewrite that talks about a cut never drawn is not spoken (run 2026-11-13-1027, scenario 1 turn 11)', async () => {
  const history = [{ who: 'tutor', text: 'Now I will cut each half again. Before I do, guess: how many pieces will there be?', turn: 8 }, { who: 'tutor', text: 'Look at the two halves. If each one is cut in two, how many pieces?', turn: 9 }];
  const callModel = model(reply([say('Go and have some water. Look at the two halves.', 'Bring back an off-topic child'), HAND]), raw('{"text":"When you are back, how many equal pieces does the circle have now?"}'));
  const r = await turn({ callModel, body: { message: 'I\'m thirsty', history, board: HALVES, lesson: L({ promised: 2 }) } });
  assert.equal(callModel.calls.length, 2, 'the repeat was rewritten once');
  assert.ok(!says(r).some((t) => /have now/.test(t)), 'the rewrite\'s "the circle now" is never said');
  assert.match(r.body.tester.kept.join(' '), /kept the model's sentence/);
});

test('2. "What do you see shaded?" after the board is cleared is rewritten, and the turn still ends on a true question', async () => {
  const callModel = model(reply([say('That is okay. Let us do it together.', 'Recover a lost child'), { cmd: 'clear', scope: 'tutor' }, say('What do you see shaded?'), HAND]), raw('{"text":"Which part is shaded?"}'));
  const r = await turn({ callModel, body: { message: 'I don\'t know', board: HALVES, lesson: L() } });
  assert.ok(!says(r).some((t) => /shaded/.test(t)));
  assert.match(says(r).at(-1), /\?$/);
});

// ---------------------------------------------------------------- 3. speech-to-text number words and pointing
test('3. "to", "too", "for", "ate" heard where a number fits are numbers, and answers; "this one?" is an answer', async () => {
  assert.equal(numberFits('What would you do with the knife?'), true);
  assert.equal(numberFits('How many friends share it?'), true);
  assert.equal(numberFits('What do you already know about a half?'), false);
  for (const t of ['Umm, to?', 'too', 'tu?', 'maybe for', 'ate']) assert.equal(loneNumberWord(t), true, t);
  for (const t of ['I want to go', 'me too', 'for two children', 'I ate it']) assert.equal(loneNumberWord(t), false, t);
  assert.equal(childMove(hearNumbers('Umm, to?')), 'tentative');
  assert.equal(childMove('Umm, this one?'), 'tentative');
  assert.equal(childMove('that part?'), 'tentative');
  assert.equal(childMove('What is this one?'), 'question');
  // End to end (run 2026-11-13-1027, scenario 14 turn 3): "Umm, to?" to the knife question is an answer, not a question to HOREB.
  const callModel = model(reply([say('Two, you said.', 'Revoice and build'), HAND]));
  const r = await turn({ callModel, body: { message: 'Umm, to?', history: [{ who: 'tutor', text: 'Picture one chapati and two hungry friends. What would you do with the knife?' }], lesson: L({ stage: 'warmup' }) } });
  assert.notEqual(r.body.tester.rule, 'question');
  assert.match(r.body.tester.heard, /"Umm, to\?" read as "Umm, two\?"/);
  const p = await turn({ callModel: model(reply([say('That one, yes.', 'Revoice and build'), HAND])), body: { message: 'Umm, this one?', board: HALVES, lesson: L() } });
  assert.equal(p.body.tester.rule, 'tentative');
});

// ---------------------------------------------------------------- 4. our guards
test('4. the one-question guard never keeps an orphan: "What happened?" gives way to the question it leans on', async () => {
  assert.equal(orphanQ('What happened?'), true);
  assert.equal(orphanQ('Why?'), true);
  assert.equal(orphanQ('How many are shaded?'), false);
  assert.equal(lastQuestionOnly('Even a small idea is fine. Have you ever shared a mandazi with a friend? What happened?'), 'Even a small idea is fine. Have you ever shared a mandazi with a friend?');
  assert.equal(lastQuestionOnly('How many pieces? How many are shaded?'), 'How many are shaded?');
  // Across two sentences in a turn.
  const r = await turn({ callModel: model(reply([say('Have you ever shared a mandazi with a friend?', 'Wait and nudge'), say('What happened?', 'Wait and nudge'), HAND])), body: { message: 'hmm ok', lesson: L() } });
  assert.deepEqual(says(r), ['Have you ever shared a mandazi with a friend?']);
});

test('4. a do-not-say-yes press requires the press, not "Name what was right"; the code\'s say-back is a Revoice', async () => {
  const s = await seal({ session: SID, child: 'u-parent', ask: 'w1', skill: EQ, item: { kind: 'typed', cskill: EQ, question: 'What fraction is one piece?', answer: '1/2', accepts: ['1/2'], wrong: [] } }, SECRET, 1_800_000_000_000);
  const r = await turn({ callModel: model(reply([say('What made you say half?', 'Press for reasoning'), HAND])), body: { message: 'half', answer: { seal: s, response: 'half' }, board: HALVES, lesson: L() } });
  assert.equal(r.body.tester.rule, 'press');
  assert.ok(!r.body.tester.kept.some((k) => /"Name what was right" was required/.test(k)), r.body.tester.kept.join(' | '));
  assert.ok(!says(r).some((t) => /^yes\b/i.test(t)), 'no yes');
});

test('4. an assess with an unreadable question id keeps its judgement (run 2026-11-13-1027, scenario 3 turn 12: "bad ask id")', async () => {
  const v = validateTurn({ steps: [{ cmd: 'assess', class: 'right_unexplained', evidence: 'Whole', ask: 'whole or cut?' }, say('Whole.'), HAND] });
  assert.equal(v.steps[0].cmd, 'assess');
  assert.equal(v.steps[0].ask, undefined);
  assert.match(v.notes.join(' '), /ask id .* not readable, left out \(the judgement is kept\)/);
  const r = await turn({ callModel: model(reply([{ cmd: 'assess', class: 'right_unexplained', evidence: 'Whole', ask: 'Q 1' }, say('Whole, yes. How could we cut it so two friends share it fairly?'), HAND])), body: { message: 'umm Whole', board: UNCUT, history: [{ who: 'tutor', text: 'Is the circle whole, or is it cut into pieces?' }], lesson: L({ stage: 'warmup' }) } });
  assert.equal(r.body.tester.judged.class, 'right_unexplained');
  assert.ok(!r.body.dropped.some((d) => /bad ask id/.test(d.reason)));
});

// ---------------------------------------------------------------- 5. a question failed twice on a picture
test('5. a question that failed twice on a shape is never asked there again, and the brief says so', () => {
  let s = L({ fig: 'circle:1', step: { kind: 'cut', tries: 1 } });
  s = updateLesson(s, { decision: { rule: 'probe' }, steps: [say('Take your time.', 'Wait and nudge')], probe: { kind: 'answer_nudge' }, board: UNCUT });
  assert.deepEqual(s.failed, ['cut@circle']);
  // A small success on another step resets the tries, but not the failed list (run 2026-11-13-1027, scenario 17).
  s = updateLesson(s, { decision: { rule: 'stage' }, steps: [say('Is it whole?')], judged: { class: 'right_unexplained' }, board: UNCUT });
  assert.deepEqual(s.failed, ['cut@circle']);
  const d = decide(s, { turnIndex: 8, message: 'whole', board: UNCUT });
  assert.match(turnBrief(s, d, { board: UNCUT, skill: EQ, turnIndex: 8 }).join('\n'), /Failed twice on the circle: how to cut it into equal parts\. Never ask that again on the circle/);
  assert.match(failedAgainOf('Now you tell me: where could one straight line go so two children share fairly?', { failed: s.failed, board: UNCUT }), /has failed twice there/);
  assert.equal(failedAgainOf('Where could one straight line go on the bar?', { failed: s.failed, board: [{ cmd: 'fraction_bar', id: 'b1', parts: 1, shaded: 0 }] }), null, 'a new picture is a new chance');
  assert.deepEqual(cleanLesson({ v: 1, failed: ['cut@circle', 'bad', 'x@y z@'] }).failed, ['cut@circle']);
});

test('5. end to end: the question asked a third time on the same circle is rewritten, then dropped', async () => {
  const callModel = model(reply([say('Now you tell me: where could one straight line go so two children share fairly?'), HAND]), raw('{"text":"Where could one straight line go so two children share fairly?"}'));
  const r = await turn({ callModel, body: { message: 'hmm maybe Whole, umm', board: UNCUT, lesson: L({ failed: ['cut@circle'], fig: 'circle:1' }) } });
  assert.equal(callModel.calls.length, 2);
  assert.ok(!says(r).some((t) => /straight line/.test(t)));
});

// ---------------------------------------------------------------- 6. the eval runner's tutor model
test('6. Sonnet against Opus: the same scenarios, turns, child seed and cap, only the tutor model and the folder differ', () => {
  const [a, b] = compareCommands({ scenarios: '1,3,6,14,17,30', cap: 26, name: 'x' });
  assert.deepEqual(a.args, ['--scenarios', '1,3,6,14,17,30', '--cap', '26', '--tutor-model', 'claude-sonnet-5-5', '--run-name', 'x-sonnet', '--seed', '1311']);
  assert.deepEqual(b.args, ['--scenarios', '1,3,6,14,17,30', '--cap', '26', '--tutor-model', 'claude-opus-5-5', '--run-name', 'x-opus', '--seed', '1311']);
  assert.throws(() => compareCommands({ scenarios: '1' }), /required/);
  assert.match(tutorLine({ tutorModel: 'claude-opus-5-5', effort: 'medium', seed: 1311 }), /^claude-opus-5-5 at medium effort \(chosen with --tutor-model;.*seed 1311/);
  assert.match(tutorLine({}), /^claude-sonnet-5-5 at medium effort \(the edge function's settings\)$/);
  const row = (n, avg, pass) => ({ scenario: n, title: `S${n}`, tutor_cost: 0.1, child_cost: 0, judge_cost: 0.05, score: { teaching: 3, diagnosis: 2, naturalness: 3, adapting: 3, curriculum: 4, avg, pass } });
  const t = compareTable([row(1, 3, false)], [row(1, 4.2, true)], { names: ['sonnet', 'opus'] });
  assert.match(t, /\| 1 \| S1 \| 3 \/ 3 \| 2 \/ 2 .*\| 3 \/ 4\.2 \| FAIL \/ PASS \|/);
  assert.match(t, /Passed: 0 of 1 \/ 1 of 1/);
});

test('the Round 2 replay counts what the old tutor did in run 2026-11-13-1027 (free, from the saved transcripts)', async (t) => {
  const dir = '/Users/mutualevity/Desktop/Tutagora/Build/voice-tutor/evals/runs/2026-11-13-1027';
  if (!existsSync(dir)) { t.skip('the saved run is not on this machine'); return; }
  const { replayRound2Run } = await import('../scripts/evals/round2-replay.mjs');
  const r = replayRound2Run(dir).total;
  assert.equal(r.diagnosedBefore, 0, 'the old tutor quoted and asked how for none of them');
  assert.ok(r.codeNow >= 5, 'the code now diagnoses them');
  assert.ok(r.board >= 4, 'the four mismatches the judge named are caught');
  assert.equal(r.soundAlikeAsQuestionNow, 0);
  assert.equal(r.pointingAsQuestionNow, 0);
});
