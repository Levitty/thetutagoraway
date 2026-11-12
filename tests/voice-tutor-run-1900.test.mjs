// ============================================================================
// REGRESSIONS FROM THE PAID RUN 2026-11-12-1900 (Tutagora/Build/voice-tutor/evals/runs/2026-11-12-1900, averages 3.0 ->
// 2.1 -> 2.6), each one the exact situation from a transcript, played through the live turn with a fake model (US$0).
// The judge found: loops on trivial counts, "how did you know?" three times on counts for a shy child, yes/no questions
// over and over, no change of picture when the child was stuck, the child's cut done for them, two questions in one
// turn, a stock-opener rewrite that made nonsense, a right "one over two" not recognised, and words that did not match
// the board. The fix round (USAGE_PLAN_NEXT_50.md P5) removed or narrowed rules first; these tests hold the result.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runTutorTurn, lastQuestionOnly } from '../src/voice-tutor/tutorTurn.js';
import { settingsFrom } from '../src/voice-tutor/session.js';
import { screen } from '../src/ai/safeguarding.js';
import { seal } from '../src/voice-tutor/seal.js';
import { newLesson, cleanLesson, updateLesson, decide, turnBrief, judgeTurn, whyNoPress, boardTruth } from '../src/voice-tutor/orchestrator.js';
import { childMove, hearNumbers, markSpoken } from '../src/voice-tutor/spokenAnswer.js';
import { questionKind, isClosed, trivialAnswer, nextStepOf } from '../src/voice-tutor/pacing.js';
import { stepFlags, habitContext, actionAsked } from '../src/voice-tutor/habits.js';

const F = 'MATH.G5.NUMBER.FRACTIONS.';
const EQ = `${F}EQUIVALENT_FRACTIONS`;
const LIB = Object.fromEntries(Object.entries(JSON.parse(readFileSync(new URL('../engine/data/curriculum/g5.misconceptions.json', import.meta.url), 'utf8'))).filter(([k]) => k.startsWith(F)));
const SECRET = 'test-secret-that-is-long-enough';
const USER = { id: 'u-parent', email: 'tester@example.com' };
const SID = '0b7e4d3c-1111-4222-8333-944455556666';
const NOW = 1_800_000_000_000;
const settings = settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: 'tester@example.com' }[k]));
const world = () => ({ usage: [], evidence: [], async getChild() { return null; }, async getProgress() { return { skills: {} }; }, async spend() { return { session: 0, day: 0 }; }, async recordUsage(r) { this.usage.push(r); }, async recordConcern() {}, async recordEvidence(r) { this.evidence.push(r); } });
const turnReply = (steps) => ({ usage: { input_tokens: 4000, output_tokens: 600 }, text: JSON.stringify({ steps }) });
const rewriteReply = (text) => ({ usage: { input_tokens: 400, output_tokens: 40 }, text: JSON.stringify({ text }) });
const model = (...replies) => {
  const calls = [];
  const fn = async (req, { onText } = {}) => {
    calls.push(req);
    const r = replies[Math.min(calls.length - 1, replies.length - 1)];
    for (let i = 0; i < r.text.length; i += 13) onText?.(r.text.slice(i, i + 13));
    return { usage: r.usage, stop_reason: 'end_turn' };
  };
  fn.calls = calls;
  return fn;
};
const say = (text, move) => ({ cmd: 'say', text, ...(move ? { move } : {}) });
const HAND = { cmd: 'pause_for_child', expect: 'any', max_wait_s: 30, doing: 'answer' };
const lesson = (o = {}) => ({ v: 1, stage: 'teach', doing: 'answer', turns: 6, ...o });
const turn = (o = {}) => runTutorTurn({ user: USER, settings, lib: LIB, secret: SECRET, safeguard: screen, now: NOW, db: o.db || world(), callModel: o.callModel, body: { session_id: SID, turn_index: 6, board: [], history: [], ...o.body } });
const texts = (r) => r.body.steps.filter((x) => x.cmd === 'say').map((x) => x.text);
const questions = (r) => texts(r).flatMap((t) => t.split(/(?<=[.!?])\s+/)).filter((x) => /\?\s*$/.test(x));
const sealed = (ask, question, answer) => seal({ session: SID, child: USER.id, ask, skill: EQ, item: { kind: 'typed', cskill: EQ, question, answer, accepts: [answer], wrong: [] } }, SECRET, NOW);
const TITLE = { id: 't1', cmd: 'write_text', text: 'Today: fractions that are the same amount', slot: 'top' };
const UNCUT = [TITLE, { id: 's1', cmd: 'shape', kind: 'circle', parts: 1, shaded: 0, slot: 'middle' }];
const HALF = [TITLE, { id: 's1', cmd: 'shape', kind: 'circle', parts: 2, shaded: 1, slot: 'middle' }];
const brief = (callModel) => callModel.calls[0].messages[0].content[0].text;

// ---------------------------------------------------------------- 1. press for reasoning: narrowed
test('1900 scenario 1 turns 9 and 15: a shy child\'s unsure right count after a nudge is named and built on, never "how did you know?"', async () => {
  const s = await sealed('q1', 'How many equal pieces is the chapati cut into?', '2');
  const callModel = model(turnReply([say('Yes, two pieces. Now look at the shaded part.', 'Name what was right'), say('How many are shaded?', 'Count with the child'), HAND]));
  const r = await turn({ callModel, body: { message: 'hmm Two?...', answer: { seal: s, response: 'hmm Two?...' }, board: HALF, lesson: lesson({ lastProbe: true }) } });
  assert.equal(r.body.tester.rule, 'advance');
  assert.match(brief(callModel), /No "how did you know" or "what made you say" this turn: a count or a name needs no reason/);
  assert.doesNotMatch(texts(r).join(' '), /what made you|how did you know/i, 'the code adds no reason question');
  assert.deepEqual(texts(r), ['Yes, two pieces. Now look at the shaded part.', 'How many are shaded?']);
  assert.equal(r.body.lesson.pending, null, 'a count is not left waiting for a reason');
  // The model pressing anyway is noted for the tester.
  const r2 = await turn({ callModel: model(turnReply([say('Two, you said. What made you say two?', 'Revoice and build'), HAND])), body: { message: 'hmm Two?...', answer: { seal: s, response: 'hmm Two?...' }, board: HALF, lesson: lesson({ lastProbe: true }) } });
  assert.match(r2.body.tester.kept.join(' '), /asked how the child knew where the decision said not to/);
});

test('1900 scenario 1 turn 9: "hmm Two?..." is an answer said unsure, not a question to HOREB', () => {
  assert.equal(childMove('hmm Two?...'), 'tentative');
  assert.equal(childMove('Umm, three?'), 'tentative');
});

test('1900 scenario 17 turns 9 to 14: a slow child\'s right count is not pressed, and the reason rule never asks twice', () => {
  const s = { ...newLesson(), stage: 'warmup', turns: 8, slow: true };
  const marked = { ask: 'q1', skill: EQ, correct: true, answer: 'Umm, two', said: 'two', canon: '2' };
  const d = decide(s, { turnIndex: 8, marked, message: 'Umm, two', question: { question: 'How many equal pieces is the chapati cut into?', answer: '2' } });
  assert.equal(d.rule, 'advance');
  assert.ok(!d.moves.includes('Press for reasoning'));
  // Pressed once on a fraction, the child's reply (or none) moves the lesson on: no second press.
  const p = { ...s, slow: false, pending: { ask: 'q2', skill: EQ } };
  const r = decide(p, { turnIndex: 9, message: 'Umm, I see' });
  assert.equal(r.rule, 'reason');
  assert.ok(!r.moves.includes('Press for reasoning'));
  assert.equal(updateLesson(p, { decision: r, steps: [say('You see the two parts. How many are shaded?')] }).pending, null);
});

test('1900 scenario 30 turns 17 and 22: "one half" is pressed once, never again on the same idea; an unsure child after "I don\'t know" is not pressed', () => {
  const marked = { ask: 'q2', skill: EQ, correct: true, answer: 'Umm, one half...', said: 'one half', canon: '1/2' };
  const q = { question: 'Say it as a fraction.', answer: '1/2' };
  assert.equal(decide({ ...newLesson(), stage: 'teach', turns: 20 }, { turnIndex: 21, marked, message: 'Umm, one half...', question: q }).rule, 'press');
  const again = decide({ ...newLesson(), stage: 'teach', turns: 21, pressed: ['1/2'] }, { turnIndex: 21, marked, message: 'Umm, one half...', question: q });
  assert.equal(again.rule, 'advance');
  assert.match(again.reason, /you have asked how they knew this already/);
  // Turn 17: "maybe Umm, one half?" straight after "umm I don't know": unsure and being helped.
  const helped = decide({ ...newLesson(), stage: 'teach', turns: 16, classes: ['guess_or_no_attempt'], step: { kind: 'count_total', tries: 1 } }, { turnIndex: 16, marked: { ...marked, tentative: true }, message: 'maybe Umm, one half?', question: q });
  assert.equal(helped.rule, 'advance');
  assert.match(helped.reason, /unsure and is being helped/);
  assert.equal(whyNoPress(newLesson(), { trivial: false }), null);
});

test('what needs no reason: a count, a yes, a name; a fraction, a comparison or an equivalence does', () => {
  assert.equal(trivialAnswer({ question: 'How many equal pieces is the chapati cut into?', answer: '2' }), true);
  assert.equal(trivialAnswer({ question: 'What do you call the first piece?', answer: '1/2' }), true);
  assert.equal(trivialAnswer({ question: 'Is it one whole chapati, yes or no?', answer: 'yes' }), true);
  assert.equal(trivialAnswer({ question: 'What fraction of the mandazi is shaded?', answer: '1/2' }), false);
  assert.equal(trivialAnswer({ question: '1/3 = ?/6', answer: '2' }), false);
  assert.equal(trivialAnswer({ question: 'How many quarters make one half?', answer: '2' }), false);
  assert.equal(trivialAnswer({ question: 'Is two quarters the same amount as one half?', answer: 'yes' }), false);
});

// ---------------------------------------------------------------- 2. progress: the step, stuck, closed questions
test('1900 scenario 30 turns 11 to 16: a count found on the picture is not asked again; the next step is named', async () => {
  // Turn 12 found the pieces ("Two, umm"); turn 15 asked "How many equal pieces is the mandazi cut into?" again.
  const L = lesson({ fig: 'circle:2', solved: ['count_total', 'equal'], step: { kind: 'equal', tries: 0 } });
  const callModel = model(
    turnReply([say('Same size, you said.', 'Revoice and build'), say('How many equal pieces is the mandazi cut into?', 'Count with the child'), HAND]),
    rewriteReply('How many of the pieces are shaded?'),
  );
  const r = await turn({ callModel, body: { message: 'Yes, same size', board: HALF, lesson: L, history: [{ who: 'tutor', text: 'Is it the same size as the other piece?' }] } });
  assert.match(brief(callModel), /Already found on this picture: how many equal pieces in all; whether the parts are equal\. Do not ask those again\. The next step: ask how many of the pieces are shaded/);
  assert.equal(callModel.calls.length, 2, 'the re-ask is rewritten');
  assert.match(callModel.calls[1].messages[0].content[0].text, /asks again what the child has already found on this picture/);
  assert.deepEqual(texts(r), ['Same size, you said.', 'How many of the pieces are shaded?']);
});

test('the lesson state tracks the step: its kind and tries, what is found on the picture, a new picture starts again', () => {
  const ask = (q) => [say(q), HAND];
  let s = cleanLesson({ v: 1, stage: 'teach', turns: 5 });
  // The tutor asks how many pieces; the child is silent twice (two probes); then right.
  s = updateLesson(s, { decision: decide(s, { turnIndex: 5, message: 'ok' }), steps: ask('How many equal pieces is the chapati cut into?'), board: HALF });
  assert.deepEqual([s.step, s.fig, s.solved], [{ kind: 'count_total', tries: 0 }, 'circle:2', []]);
  s = updateLesson(s, { decision: decide(s, { turnIndex: 6, probe: { kind: 'answer_nudge' } }), probe: { kind: 'answer_nudge' }, steps: ask('Count the pieces. How many?'), board: HALF });
  assert.deepEqual(s.step, { kind: 'count_total', tries: 1 });
  s = updateLesson(s, { decision: decide(s, { turnIndex: 7, probe: { kind: 'answer_smaller' } }), probe: { kind: 'answer_smaller' }, steps: [say('No hurry.'), HAND], board: HALF });
  assert.deepEqual(s.step, { kind: 'count_total', tries: 2 });
  s = updateLesson(s, { decision: decide(s, { turnIndex: 8, message: 'two' }), judged: { class: 'right_unexplained' }, steps: ask('Yes, two. How many are shaded?'), board: HALF });
  assert.deepEqual([s.solved, s.step], [['count_total'], { kind: 'count_shaded', tries: 0 }]);
  // A new picture (each half cut again): the list of what is found starts again.
  s = updateLesson(s, { decision: decide(s, { turnIndex: 9, message: 'one' }), judged: { class: 'right_unexplained' }, steps: [say('Now I cut each half again.'), { cmd: 'shape', id: 's4', kind: 'circle', parts: 4, shaded: 2, slot: 'bottom' }, say('How many pieces now?'), HAND], board: HALF });
  assert.deepEqual([s.fig, s.solved], ['circle:4', []]);
  assert.equal(nextStepOf(['count_total'], { cut: true }), 'ask how many of the pieces are shaded');
});

test('1900 scenario 6 turns 10 to 22: after two non-answers on one kind of question it is shown another way; never the same kind a third time', () => {
  const s = { ...newLesson(), stage: 'warmup', turns: 14, step: { kind: 'state', tries: 2 }, closedRun: 2 };
  const d = decide(s, { turnIndex: 14, probe: { kind: 'answer_smaller', silent_s: 26 } });
  assert.deepEqual(d.stuck, { kind: 'state', tries: 2 });
  assert.match(d.reason, /another way \(a bar instead of a circle, folding a paper, a short story/);
  assert.ok(d.moves.includes('Smaller-question hint') && d.moves.includes('Show then hand over'));
  const b = turnBrief(s, d, { probe: { kind: 'answer_smaller', silent_s: 26 }, board: UNCUT, turnIndex: 14 }).join('\n');
  assert.match(b, /Stuck: 2 tries on whether the whole is cut yet/);
  assert.match(b, /Your last question was a yes-or-no or this-or-that question/);
  // The model asking "whole or cut?" again is noted: a closed question again, and the same kind a third time.
  const notes = judgeTurn(d, [say('Is the circle cut into pieces, or whole?', 'Smaller-question hint'), HAND]).join(' ');
  assert.match(notes, /a closed question again/);
  assert.match(notes, /the same kind of question a third time/);
  // A task check-in is not a stuck step: the child is working.
  assert.equal(decide(s, { turnIndex: 14, probe: { kind: 'task_checkin', silent_s: 45 } }).stuck, null);
});

test('question kinds and closed questions, from the 1900 transcripts', () => {
  assert.equal(questionKind('How many equal pieces is the chapati cut into?'), 'count_total');
  assert.equal(questionKind('How many are shaded?'), 'count_shaded');
  assert.equal(questionKind('What fraction of the mandazi is it?'), 'fraction');
  assert.equal(questionKind('Where would you cut it, in the middle or near the edge?'), 'cut');
  assert.equal(questionKind('What made you say two?'), 'reason');
  assert.equal(questionKind('Say one word: whole or cut?'), 'state');
  assert.equal(questionKind('Look at the circle.'), null);
  assert.equal(isClosed('Is it one whole chapati, yes or no?'), true);
  assert.equal(isClosed('Is the circle cut into pieces, or whole?'), true);
  assert.equal(isClosed('Can you put your finger on a shaded part?'), false);
  assert.equal(isClosed('How many pieces?'), false);
});

// ---------------------------------------------------------------- 3. one question a turn
test('1900 scenario 14 turn 13: two questions in one turn: only the last is said', async () => {
  const callModel = model(turnReply([
    say('Let us look at the picture again. How many equal pieces is this chapati cut into?', 'Recover a lost child'),
    { cmd: 'highlight', target: 's1', part: 1, style: 'circle', on: 'picture' },
    say('Point to the other piece. What number is it?', 'Smaller-question hint'), HAND,
  ]));
  const r = await turn({ callModel, body: { message: 'I don\'t know', board: HALF, lesson: lesson() } });
  assert.deepEqual(questions(r), ['What number is it?']);
  assert.deepEqual(texts(r), ['Let us look at the picture again.', 'Point to the other piece. What number is it?']);
  assert.ok(r.body.steps.some((x) => x.cmd === 'highlight'), 'its drawing still plays');
  assert.match(r.body.tester.kept.join(' '), /one question a turn/);
  // Inside one say, the last question is kept.
  assert.equal(lastQuestionOnly('Count them with me. How many are there? How many are shaded?'), 'Count them with me. How many are shaded?');
  assert.equal(lastQuestionOnly('How many pieces?'), 'How many pieces?');
});

test('1900 scenario 30 turn 16: the code never adds a question to a turn that has asked one', async () => {
  const callModel = model(turnReply([say('Let us look together. How many equal pieces is it cut into?', 'Recover a lost child'), say('I point at one piece. You point at the next.', 'Count with the child'), HAND]));
  const r = await turn({ callModel, body: { message: 'umm I don\'t know', board: HALF, lesson: lesson() } });
  assert.equal(questions(r).length, 1, texts(r).join(' | '));
});

// ---------------------------------------------------------------- 4. the child's own step
test('1900 scenario 6 turn 22: the tutor asks how to cut it and draws it cut in the same turn: the drawing is not made', async () => {
  const callModel = model(turnReply([
    say('Take your time. Look at the chapati. What could we do to cut it into smaller pieces?', 'Recover a lost child'),
    { cmd: 'shape', id: 's2', kind: 'circle', parts: 2, shaded: 0, slot: 'bottom', on: 'cut' },
    say('How many?'), HAND,
  ]));
  const r = await turn({ callModel, body: { probe: { kind: 'answer_smaller', silent_s: 25 }, board: UNCUT, lesson: lesson({ stage: 'warmup' }) } });
  assert.ok(!r.body.steps.some((x) => x.id === 's2'), 'no cut circle');
  assert.deepEqual(texts(r), ['Take your time. Look at the chapati. What could we do to cut it into smaller pieces?']);
  assert.ok(r.body.guard.includes('child-step'));
  assert.equal(r.body.steps.at(-1).cmd, 'pause_for_child');
});

test('1900 scenario 14 turn 11: "I draw one line down the middle" after asking where the child would cut: rewritten, and the cut is not drawn', async () => {
  const history = [{ who: 'tutor', text: 'That is fine. Think of two hands holding this chapati. Where would you cut it, in the middle or near the edge?' }, { who: 'child', text: 'um...' }, { who: 'tutor', text: 'It is fine to guess. Just say a number, or point to where you would cut.' }];
  const callModel = model(
    turnReply([say('That is okay. Let us do it together. I draw one line down the middle of the chapati.', 'Recover a lost child'), { cmd: 'shape', id: 'chap2', kind: 'circle', parts: 2, shaded: 0, slot: 'bottom', on: 'one line' }, say('Are they the same size?'), HAND]),
    rewriteReply('Let us do it together. Show me with your finger: where does the line go?'),
  );
  const r = await turn({ callModel, body: { probe: { kind: 'answer_smaller', silent_s: 24 }, history, board: UNCUT, lesson: lesson({ stage: 'warmup' }) } });
  const req = callModel.calls[1].messages[0].content[0].text;
  assert.match(req, /does the child's step: the question asks them to cut it/);
  assert.match(req, /On the board now: s1: a whole circle at middle, not cut into parts, nothing shaded/, 'the rewrite reads the board too');
  assert.ok(!r.body.steps.some((x) => x.id === 'chap2'));
  assert.deepEqual(texts(r), ['Let us do it together. Show me with your finger: where does the line go?']);
  // When the child has said how to cut it, drawing it their way is fine (scenario 1 turn 6: "Two" pieces).
  const ctx = habitContext({ message: 'In the middle', history, board: UNCUT, level: { level: 0, wins: 0, stage: 'warmup' } });
  assert.deepEqual(stepFlags({ cmd: 'shape', id: 'c2', kind: 'circle', parts: 2, shaded: 0 }, ctx, []), []);
  assert.equal(actionAsked('What could you do to it so two friends get fair shares?'), 'cut');
  assert.equal(actionAsked('How many pieces?'), null);
});

// ---------------------------------------------------------------- 5. the stock rewrite is gone
test('1900 scenario 6 turn 8: a stock sentence is never rewritten (it made "You said yes, so I\'m not sure yet"): the model\'s sentence plays', async () => {
  const callModel = model(turnReply([say('Good, so we will use one.', 'Revoice and build'), { cmd: 'shape', id: 's1', kind: 'circle', parts: 1, shaded: 0, slot: 'middle', on: 'use one' }, say('Here is a chapati. Is it cut, or whole?', 'Smaller-question hint'), HAND]), rewriteReply('You said yes, so I\'m not sure yet.'));
  const r = await turn({ callModel, body: { message: 'yes', lesson: lesson({ stage: 'warmup' }), history: [{ who: 'tutor', text: 'Do you like chapati, yes or no?' }] } });
  assert.equal(callModel.calls.length, 1, 'no rewrite call');
  assert.equal(texts(r)[0], 'Good, so we will use one.');
  assert.doesNotMatch(texts(r).join(' '), /not sure yet/);
  assert.match(r.body.tester.kept.join(' '), /gate: noted, not rewritten \(stock/);
});

test('1900 scenario 1 turn 7: a repeated opener is noted only; "That is okay" plays as the model wrote it', async () => {
  const history = [{ who: 'tutor', text: 'That is okay, there is no hurry. Maybe at home? Tell me about it.', turn: 3 }, { who: 'tutor', text: 'That is okay. Let us make it smaller. How many pieces?', turn: 4 }, { who: 'child', text: 'Two' }, { who: 'tutor', text: 'Two pieces, you said. What fraction is one piece?', turn: 6 }];
  const callModel = model(turnReply([say('That is okay. Look at the shaded piece.', 'Wait and nudge'), say('How many equal pieces is the whole chapati cut into?'), HAND]));
  const r = await turn({ callModel, body: { probe: { kind: 'answer_nudge', silent_s: 16 }, history, board: HALF, lesson: lesson() } });
  assert.equal(callModel.calls.length, 1);
  assert.equal(texts(r)[0], 'That is okay. Look at the shaded piece.');
});

// ---------------------------------------------------------------- 6. right answers in more forms
test('1900 scenario 30 turn 10: "won over too, umm" is the right "one over two", marked, and HOREB may say it back', async () => {
  const s = await sealed('q1', 'What fraction of the mandazi is shaded?', '1/2');
  const callModel = model(turnReply([say('One over two, you said. One half.', 'Name what was right'), say('What made you say one over two?', 'Press for reasoning'), HAND]));
  const r = await turn({ callModel, body: { message: 'won over too, umm', answer: { seal: s, response: 'won over too, umm' }, board: HALF, lesson: lesson(), history: [{ who: 'tutor', text: 'Look at the shaded piece. What fraction of the mandazi is it?' }] } });
  assert.equal(r.body.marked.correct, true);
  assert.equal(callModel.calls.length, 1, 'the echo of the child\'s own answer is not a giveaway');
  assert.deepEqual(texts(r), ['One over two, you said. One half.', 'What made you say one over two?']);
  const item = { kind: 'typed', question: 'What fraction is shaded?', answer: '1/2', accepts: ['1/2'], wrong: [] };
  for (const said of ['one over two', 'one out of two', 'a half', 'half of it', 'won over too, umm', 'one over too', 'won half']) {
    assert.equal(markSpoken(item, hearNumbers(said, { numberOpen: true })).correct, true, said);
  }
  assert.equal(hearNumbers('Umm, won by won', { numberOpen: true }), 'Umm, won by won', 'counting one by one is not a fraction');
});

// ---------------------------------------------------------------- 7. the board's truth
test('1900 scenario 30 turn 6: the context and the brief say exactly what is drawn (whole or cut, parts, shaded)', async () => {
  assert.equal(boardTruth(UNCUT), 'On the board now: s1: a whole circle at middle, not cut into parts, nothing shaded. Say only what is there: a whole is not cut, and nothing is shaded unless it says so.');
  assert.match(boardTruth(HALF), /s1: a circle at middle, cut into 2 equal parts, 1 of 2 shaded/);
  assert.match(boardTruth([{ id: 'f', cmd: 'figure', type: 'fraction', params: { shape: 'bar', parts: 1, shaded: 0 } }]), /a whole fraction bar, not cut into parts/);
  assert.match(boardTruth([{ id: 'b', cmd: 'fraction_bar', parts: 1, shaded: 0 }]), /a whole bar, not cut into parts/);
  assert.match(boardTruth([]), /The board is empty/);
  const callModel = model(turnReply([say('Take your time. Look at the mandazi.', 'Wait and nudge'), say('Where would you cut it?'), HAND]));
  await turn({ callModel, body: { probe: { kind: 'answer_nudge', silent_s: 8 }, board: UNCUT, lesson: lesson({ stage: 'warmup' }) } });
  assert.match(brief(callModel), /Turn brief[^\n]*\n- On the board now: s1: a whole circle at middle, not cut into parts, nothing shaded/);
});

test('1900 scenario 30 turn 31: "two out of four" said while the child is still asked for the fraction is a giveaway (no seal needed); the child\'s own "one half" is not', async () => {
  const board = [TITLE, { id: 's3', cmd: 'shape', kind: 'circle', parts: 2, shaded: 1, slot: 'bottom' }, { id: 's4', cmd: 'shape', kind: 'circle', parts: 4, shaded: 2, slot: 'middle' }];
  const history = [
    { who: 'child', text: 'Umm, one half...' },
    { who: 'tutor', text: 'Two shaded, one by one, you counted. Now say it as a fraction: how many shaded out of how many pieces?', turn: 28 },
    { who: 'child', text: 'maybe Four, umm' },
    { who: 'tutor', text: 'You sound unsure about four. What made you think of four?', turn: 29 },
    { who: 'tutor', text: 'That is okay, take your time. Point at the shaded pieces in the middle circle. How many are there?', turn: 30 },
  ];
  const ctx = habitContext({ message: 'Umm, two shaded...', history, board, level: { level: 0, wins: 0, stage: 'guided' } });
  const flags = stepFlags(say('Two shaded, you said. Four pieces in all. Write it as a fraction on the board with your pencil: two out of four.'), ctx, []);
  assert.match(flags.map((f) => f.reason).join(' '), /"two out of four" is said while the child is still asked for it/);
  assert.deepEqual(stepFlags(say('Two shaded, you said. Four pieces in all. Write it as a fraction on the board.'), ctx, []), []);
  const callModel = model(
    turnReply([say('Two shaded, you said. Four pieces in all. Write it as a fraction on the board with your pencil: two out of four.', 'Show then hand over'), { ...HAND, doing: 'task' }]),
    rewriteReply('Two shaded, four pieces in all. Write it as a fraction with your pencil.'),
  );
  const r = await turn({ callModel, body: { message: 'Umm, two shaded...', history, board, lesson: lesson({ stage: 'guided', found: ['1/2'] }) } });
  assert.doesNotMatch(texts(r).join(' '), /two out of four/);
});
