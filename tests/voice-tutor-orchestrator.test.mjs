// ============================================================================
// THE ORCHESTRATOR (conversation engine steps 2 and 3, 12 Nov 2026): the lesson state, the
// rules that decide the allowed moves and why, the check of what the model did, and the
// answer's class held to the seal (src/voice-tutor/orchestrator.js).
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  newLesson, cleanLesson, decide, judgeTurn, updateLesson, finalClass, prelimClass, lessonLines, repsOf, gaveReason, soundsLost, stageAllowed, isIndependent,
} from '../src/voice-tutor/orchestrator.js';
import { PLAYBOOK_MOVES } from '../src/voice-tutor/commands.js';

const F = 'MATH.G5.NUMBER.FRACTIONS.';
const EQ = `${F}EQUIVALENT_FRACTIONS`;
const ADD = `${EQ}.M_EQUIV_ADDITIVE`;
const wrong = (ask = 'q1', mis = ADD) => ({ ask, skill: EQ, correct: false, misconception: mis, answer: '4' });
const right = (ask = 'q1') => ({ ask, skill: EQ, correct: true, misconception: null, answer: '2' });
// A right answer worth a reason (P5): a fraction, not a count.
const half = (ask = 'q1') => ({ ask, skill: EQ, correct: true, misconception: null, answer: 'one half', said: 'one half', canon: '1/2' });
const at = (o = {}) => ({ ...newLesson(), stage: 'guided', turns: 5, ...o });
const bar = { cmd: 'fraction_bar', id: 'b1', parts: 4, shaded: 1, slot: 'middle' };
const line = { cmd: 'number_line', id: 'n1', from: 0, to: 1, divisions: 4, slot: 'middle' };
const say = (text, move) => ({ cmd: 'say', text, ...(move ? { move } : {}) });

test('every move the rules allow is a playbook move', () => {
  const cases = [
    decide(newLesson(), { turnIndex: 0 }),
    decide(at(), { turnIndex: 5, elapsedMin: 18 }),
    decide(at(), { turnIndex: 5, probe: { kind: 'answer_nudge' } }),
    decide(at(), { turnIndex: 5, probe: { kind: 'answer_smaller' } }),
    decide(at(), { turnIndex: 5, probe: { kind: 'task_checkin' } }),
    decide(at(), { turnIndex: 5, message: 'I don\'t know' }),
    decide(at(), { turnIndex: 5, marked: wrong() }),
    decide(at({ rep: 'bar', sameFails: 1, tried: ['bar'] }), { turnIndex: 5, marked: wrong() }),
    decide(at(), { turnIndex: 5, marked: right(), message: '2' }),
    decide(at(), { turnIndex: 5, marked: right(), message: 'two because each half is cut into two' }),
    decide(at({ streak: 1 }), { turnIndex: 5, marked: right(), message: 'two because each half is cut into two' }),
    decide(at({ pending: { ask: 'q1', skill: EQ } }), { turnIndex: 5, message: 'because the bottom doubled' }),
    decide(at({ classes: ['missing_prerequisite'] }), { turnIndex: 5, message: 'ok', prerequisite: 'Equal parts' }),
    decide(at({ stage: 'teach' }), { turnIndex: 5, message: 'ok' }),
  ];
  for (const d of cases) for (const m of [...d.moves, ...d.with]) assert.ok(PLAYBOOK_MOVES.includes(m), `${d.rule}: ${m}`);
});

test('the first turn opens the lesson; near the time limit it closes', () => {
  const open = decide(newLesson(), { turnIndex: 0 });
  assert.deepEqual([open.rule, open.moves, open.stageMax], ['open', ['Open the lesson'], 'warmup']);
  const close = decide(at(), { turnIndex: 30, elapsedMin: 17.2, sessionMinutes: 20, marked: wrong() });
  assert.deepEqual([close.rule, close.moves, close.stageMax], ['close', ['Close the lesson'], 'wrapup']);
  assert.match(close.reason, /17 of 20 minutes/);
  assert.equal(decide(at(), { turnIndex: 30, elapsedMin: 16.9 }).rule, 'stage');
});

test('a silence probe allows only the nudge it is for', () => {
  assert.deepEqual(decide(at(), { turnIndex: 4, probe: { kind: 'answer_nudge' } }).moves, ['Wait and nudge']);
  assert.deepEqual(decide(at(), { turnIndex: 4, probe: { kind: 'answer_smaller' } }).moves, ['Smaller-question hint', 'Recover a lost child']);
  const t = decide(at(), { turnIndex: 4, probe: { kind: 'task_checkin' } });
  assert.match(t.reason, /do not do it for them/);
  assert.deepEqual(t.with, [], 'a probe is short: nothing alongside');
});

test('a wrong answer: diagnose first; a second wrong answer with the same picture: change the approach', () => {
  const d1 = decide(at({ rep: 'bar', tried: ['bar'] }), { turnIndex: 5, marked: wrong() });
  assert.deepEqual([d1.rule, d1.moves], ['diagnose', ['Diagnose the wrong answer']]);
  assert.match(d1.reason, /M_EQUIV_ADDITIVE/);
  // The state after that turn (which still used the bar): one wrong answer with it.
  const s1 = updateLesson(at({ rep: 'bar', tried: ['bar'] }), { decision: d1, steps: [say('How did you get four?', 'Diagnose the wrong answer'), bar], judged: finalClass({ marked: wrong() }), marked: wrong() });
  assert.equal(s1.sameFails, 1);
  // Round 2: the diagnosis is the code's and waits for a reason. A second wrong answer instead is a failed ask: the code
  // asks again, another way; a third, and the representation changes (diag-change).
  assert.deepEqual(s1.diag, { q: '4', tries: 1 });
  const ask2 = decide(s1, { turnIndex: 6, marked: wrong('q2'), message: 'six' });
  assert.deepEqual([ask2.rule, ask2.authored, ask2.diagQuote], ['diagnose', true, 'six']);
  assert.notEqual(ask2.line, d1.line, 'the second ask is another way');
  const s1b = updateLesson(s1, { decision: ask2, steps: [say(ask2.line, 'Diagnose the wrong answer')], judged: finalClass({ marked: wrong('q2') }), marked: wrong('q2') });
  const dc = decide(s1b, { turnIndex: 7, marked: wrong('q3'), message: 'seven' });
  assert.equal(dc.rule, 'diag-change');
  assert.equal(dc.avoid, 'bar');
  // With the diagnosis answered (the child said how), the older rule holds: a second wrong answer with the same picture changes it.
  const d2 = decide({ ...s1, diag: null }, { turnIndex: 6, marked: wrong('q2') });
  assert.equal(d2.rule, 'change');
  assert.equal(d2.avoid, 'bar');
  assert.match(d2.reason, /Do not use the bar again/);
  assert.match(d2.reason, /tried so far: bar/);
  // Using the bar again is noted (the turn still plays); a number line is a change and starts the count again.
  assert.match(judgeTurn(d2, [say('Look at the bar again.', 'Smaller-question hint'), { ...bar, id: 'b2' }]).join(' '), /bar was used again/);
  const s2 = updateLesson(s1, { decision: d2, steps: [say('Here is a number line.', 'Show then hand over'), line], judged: finalClass({ marked: wrong('q2') }), marked: wrong('q2') });
  assert.equal(s2.rep, 'number line');
  assert.equal(s2.sameFails, 0, 'a different picture is a new approach');
  assert.deepEqual(s2.tried, ['bar', 'number line']);
});

test('a right fraction with no reason is pressed for its reason before it counts; a count is not (P5)', () => {
  assert.equal(gaveReason('2'), false);
  assert.equal(gaveReason('two because each half is cut into two'), true);
  // A count needs no reason: yes, and the next step; nothing waits for a reason.
  const c = decide(at(), { turnIndex: 5, marked: right(), message: '2' });
  assert.equal(c.rule, 'advance');
  assert.match(c.reason, /No "how did you know" \(a count or a name needs no reason\)/);
  assert.equal(updateLesson(at(), { decision: c, steps: [say('Yes, two. How many are shaded?', 'Name what was right')], judged: finalClass({ marked: right(), message: '2' }), marked: right() }).pending, null);
  const d = decide(at(), { turnIndex: 5, marked: half(), message: 'one half' });
  // Round 2: a one-word or unsure right answer is said back (Revoice), never a yes; the move the turn must carry is the press.
  assert.deepEqual([d.rule, d.moves, d.prelim, d.must, d.ack], ['press', ['Revoice and build', 'Press for reasoning'], 'right_unexplained', ['Press for reasoning'], 'revoice']);
  const s = updateLesson(at(), { decision: d, steps: [say('How did you know?', 'Press for reasoning')], judged: finalClass({ marked: half(), message: 'one half' }), marked: half() });
  assert.deepEqual(s.pressed, ['1/2'], 'pressed once on this idea');
  assert.equal(decide(s, { turnIndex: 7, marked: half('q3'), message: 'one half' }).rule, 'advance', 'never twice on one idea');
  assert.deepEqual(s.pending, { ask: 'q1', skill: EQ });
  assert.equal(s.streak, 0, 'not understood yet');
  // The child gives the reason: the rule says judge it.
  const r = decide(s, { turnIndex: 6, message: 'because the bottom doubled and so did the top' });
  assert.equal(r.rule, 'reason');
  assert.ok(!r.moves.includes('Press for reasoning'), 'the reason is asked for once');
  const s2 = updateLesson(s, { decision: r, steps: [say('Yes, both doubled.', 'Name what was right')], judged: finalClass({ assessment: { class: 'understood', evidence: 'both doubled' } }) });
  assert.equal(s2.pending, null);
  assert.equal(s2.streak, 1);
  // Declined ("I just knew"): the lesson moves on all the same.
  const s3 = updateLesson(s, { decision: decide(s, { turnIndex: 6, message: 'I just knew' }), steps: [say('You just knew. Now cut each half again: how many pieces?')], judged: finalClass({ assessment: { class: 'right_unexplained', evidence: 'just knew' } }) });
  assert.equal(s3.pending, null);
});

test('understood, then a fresh check, allows the next stage; not before', () => {
  const said = 'two because each half is cut into two';
  const d1 = decide(at(), { turnIndex: 5, marked: right(), message: said });
  assert.deepEqual([d1.rule, d1.moves, d1.stageMax], ['fresh-check', ['Name what was right', 'Check for understanding'], 'guided']);
  assert.match(judgeTurn(d1, [say('Now on your own.'), { cmd: 'set_phase', phase: 'independent' }]).join(' '), /ahead of what the lesson allows/);
  const s1 = updateLesson(at(), { decision: d1, steps: [say('Here is a new one.', 'Check for understanding'), { cmd: 'ask', id: 'q2', prompt: '1/3 = ?/6', form: 'number' }], judged: finalClass({ marked: right(), message: said }), marked: right() });
  assert.equal(s1.streak, 1);
  assert.equal(s1.question.id, 'q2');
  const d2 = decide(s1, { turnIndex: 6, marked: right('q2'), message: said });
  assert.equal(d2.rule, 'move-on');
  assert.equal(d2.stageMax, 'independent');
  assert.deepEqual(judgeTurn(d2, [say('Yes, two sixths.', 'Name what was right'), say('You are ready.', 'Check for understanding'), { cmd: 'set_phase', phase: 'independent' }]), []);
  // Warm-up and teach move on once the child has answered at all.
  assert.equal(stageAllowed({ ...newLesson(), stage: 'warmup', answers: 0 }), 'warmup');
  assert.equal(stageAllowed({ ...newLesson(), stage: 'warmup', answers: 1 }), 'teach');
  assert.equal(stageAllowed({ ...newLesson(), stage: 'teach', answers: 1 }), 'guided');
});

test('a missing earlier skill sends the lesson back to the prerequisite; "I don\'t know" lowers the question', () => {
  const d = decide(at({ classes: ['missing_prerequisite'] }), { turnIndex: 7, message: 'ok', prerequisite: 'Equal parts of a whole' });
  assert.equal(d.rule, 'prerequisite');
  assert.match(d.reason, /Equal parts of a whole/);
  assert.equal(soundsLost('I dont know'), true);
  assert.equal(soundsLost('sijui'), true);
  assert.equal(soundsLost('I know it is two'), false);
  assert.deepEqual(decide(at(), { turnIndex: 7, message: 'i don\'t know' }).moves, ['Recover a lost child', 'Smaller-question hint']);
});

test('the turn is checked against the decision: notes only, and they name what was off', () => {
  const d = decide(at(), { turnIndex: 5, marked: half(), message: 'one half because two quarters fit' });
  // After a right answer, Name what was right is required: a turn that skips it is noted.
  assert.equal(d.rule, 'fresh-check');
  assert.deepEqual(judgeTurn(d, [say('Now try this one.', 'Check for understanding'), { cmd: 'pause_for_child' }]), ['"Name what was right" was required this turn and no say carried it']);
  assert.deepEqual(judgeTurn(d, [say('Yes, two.', 'Name what was right'), say('Is three sixths the same?', 'Check for understanding')]), []);
  // Round 2: a press on a one-word answer requires the press, not a yes (run 2026-11-13-1027, scenario 6 turn 10).
  const p1 = decide(at(), { turnIndex: 5, marked: half(), message: 'half' });
  assert.deepEqual(judgeTurn(p1, [say('Half, you said. What made you say half?', 'Press for reasoning')]), []);
  const off = judgeTurn(d, [say('Next one.', 'Stretch the quick child')]);
  assert.match(off.join(' '), /"Stretch the quick child" was not allowed this turn \(fresh-check: Name what was right, Check for understanding\)/);
  assert.match(off.join(' '), /no say was tagged with an allowed move/);
  assert.match(judgeTurn(d, [say('Hmm.', 'Dance')]).join(' '), /not a playbook move/);
  assert.deepEqual(judgeTurn(null, [say('x')]), []);
});

test('the answer\'s class: the model judges the reasoning, the seal holds it to right and wrong', () => {
  assert.equal(prelimClass({ marked: null }), null);
  assert.equal(prelimClass({ marked: right(), message: '2' }), 'right_unexplained');
  assert.equal(prelimClass({ marked: wrong() }), 'misconception');
  assert.equal(prelimClass({ marked: wrong('q1', null) }), 'partly_right');
  // The model said understood, the seal said wrong: never understood.
  const held = finalClass({ assessment: { class: 'understood', evidence: 'x' }, marked: wrong() });
  assert.deepEqual([held.class, held.misconception, held.source], ['misconception', ADD, 'model']);
  assert.match(held.note, /seal marked the answer wrong/);
  assert.equal(finalClass({ assessment: { class: 'right_unexplained', evidence: 'x' }, marked: wrong('q1', null) }).class, 'partly_right');
  // Right, with a misconception for a reason: partly right.
  assert.equal(finalClass({ assessment: { class: 'misconception', misconception: ADD, evidence: 'x' }, marked: right() }).class, 'partly_right');
  // A right answer said unsure is an answer, never a guess (12 Nov 2026, run 2026-11-12-1824: "one half?" and "Half,
  // umm..." were classed guess_or_no_attempt): right_unexplained, with a note.
  const unsure = finalClass({ assessment: { class: 'guess_or_no_attempt', evidence: 'said "maybe 2?"' }, marked: { ...right(), tentative: true } });
  assert.equal(unsure.class, 'right_unexplained');
  assert.match(unsure.note, /seal marked the answer right \(said unsure\)/);
  // No assessment: the code's own reading.
  assert.deepEqual([finalClass({ marked: right(), message: '2' }).class, finalClass({ marked: right(), message: '2' }).source], ['right_unexplained', 'code']);
  assert.equal(finalClass({}), null);
  // Only understood is independent evidence.
  assert.deepEqual(['understood', 'right_unexplained', 'partly_right', 'misconception'].map(isIndependent), [true, false, false, false]);
});

test('the lesson state from the page is cleaned: every field checked, nothing else kept', () => {
  assert.deepEqual(cleanLesson(null), newLesson());
  assert.deepEqual(cleanLesson({ v: 2, stage: 'teach' }), newLesson());
  const c = cleanLesson({ v: 1, stage: 'teach', doing: 'task', question: { id: 'q1', skill: EQ, attempts: 2, x: 1 }, tried: ['bar', 'laser', 'bar'], rep: 'bar', sameFails: 1, hints: 99, classes: ['understood', 'clever'], streak: 1, pending: { ask: 'DROP TABLE' }, prereq: 'yes', turns: 4, min: 3.33, evil: '<script>' });
  assert.equal(c.stage, 'teach');
  assert.deepEqual(c.question, { id: 'q1', skill: EQ, attempts: 2 });
  assert.deepEqual(c.tried, ['bar']);
  assert.equal(c.hints, 0, 'out of range: dropped');
  assert.deepEqual(c.classes, ['understood']);
  assert.equal(c.pending, null);
  assert.equal(c.prereq, false);
  assert.equal(c.min, 3.3);
  assert.equal('evil' in c, false);
});

test('the model reads the state and the allowed moves in plain lines', () => {
  const s = at({ question: { id: 'q2', skill: EQ, attempts: 1 }, tried: ['bar'], classes: ['misconception'], doing: 'answer' });
  const d = decide(s, { turnIndex: 6, marked: wrong('q2') });
  const lines = lessonLines(s, d).join('\n');
  assert.match(lines, /stage guided; the child is now answering a question; question q2, 1 attempt so far/);
  // Round 2: the diagnosis is the code's sentence, so nothing goes alongside it.
  assert.match(lines, /Allowed moves this turn: Diagnose the wrong answer\. Why: .*the code asks ONE question/);
  assert.match(lines, /Tag the say that carries your move/);
  assert.deepEqual(repsOf([{ cmd: 'shape', kind: 'circle' }, { cmd: 'figure', type: 'fraction', params: { shape: 'grid' } }, { cmd: 'figure', type: 'numberline' }, { cmd: 'say' }]), ['circle', 'grid', 'number line']);
});

test('updateLesson: stage, question, hints and what the child is doing move with the turn', () => {
  const s0 = newLesson();
  const s1 = updateLesson(s0, { steps: [{ cmd: 'set_phase', phase: 'warmup' }, say('Hello.', 'Open the lesson'), { cmd: 'pause_for_child', doing: 'talk' }], elapsedMin: 0.5 });
  assert.deepEqual([s1.stage, s1.doing, s1.turns, s1.min], ['warmup', 'talk', 1, 0.5]);
  const s2 = updateLesson(s1, { steps: [say('Try this.', 'Smaller-question hint'), { cmd: 'ask', id: 'q1', prompt: 'p', form: 'number' }, { cmd: 'pause_for_child', doing: 'answer' }], probe: { kind: 'talk_nudge' } });
  assert.deepEqual([s2.question.id, s2.hints, s2.probes, s2.doing], ['q1', 1, 1, 'answer']);
  const s3 = updateLesson(s2, { steps: [say('Look again.', 'Smaller-question hint')], judged: finalClass({ marked: wrong() }), marked: wrong() });
  assert.deepEqual([s3.question.attempts, s3.hints, s3.classes], [1, 2, ['misconception']]);
});

// ---------------------------------------------------------------- the first test-set run (12 Nov 2026)
test('after a right answer: name it in the child\'s words, and never ask that question again', () => {
  const marked = { ...right(), said: 'two sixths' };
  const d = decide(at(), { turnIndex: 5, marked, message: 'two sixths, because each third is cut in two', question: { question: 'One third is how many sixths?' } });
  assert.deepEqual([d.must, d.quote, d.answered], [['Name what was right'], 'two sixths', { ask: 'q1', prompt: 'One third is how many sixths?' }]);
  const lines = lessonLines(at({ found: ['2/6'] }), d).join('\n');
  assert.match(lines, /Answers the child has already found \(you may say them back now\): 2\/6/);
  assert.match(lines, /Your first say is Name what was right: yes, and the child's own words \("two sixths"\)/);
  assert.match(lines, /answered question q1: never ask it again/);
  // The answer the child found is remembered (no longer hidden), at most eight.
  const s = updateLesson(at({ found: ['1/2'] }), { decision: d, steps: [], marked: { ...marked, canon: '2/6' } });
  assert.deepEqual(s.found, ['1/2', '2/6']);
  assert.equal(updateLesson(at(), { marked: { ...wrong(), canon: '4' } }).found.length, 0, 'a wrong answer is not found');
});

test('a wrong answer: Diagnose is one question about how they got it, before any teaching; skipping it is noted', () => {
  const d = decide(at(), { turnIndex: 5, marked: wrong() });
  // Round 2: the code says the diagnosis itself, quoting the child, and nothing goes with it.
  assert.deepEqual([d.rule, d.moves, d.with, d.must, d.authored], ['diagnose', ['Diagnose the wrong answer'], [], ['Diagnose the wrong answer'], true]);
  assert.match(d.reason, /the code asks ONE question about how they got "4", and nothing else/);
  assert.equal(d.line, 'You said four. How did you get four?');
  assert.deepEqual(judgeTurn(d, [say('Four, you said. How did you get four?', 'Diagnose the wrong answer')]), []);
  const told = judgeTurn(d, [say('Not quite. Look, it is two.', 'Diagnose the wrong answer'), bar, { cmd: 'ask', id: 'q2', prompt: 'How many?', form: 'number' }]);
  assert.match(told.join(' '), /did not ask how the child got their answer/);
  assert.match(told.join(' '), /taught \(a new picture or question\) before hearing/);
  // The child explains: the next turn reteaches that one idea (and the flag clears).
  const s = updateLesson(at(), { decision: d, steps: [say('How did you get four?', 'Diagnose the wrong answer')], judged: finalClass({ marked: wrong() }), marked: wrong() });
  assert.equal(s.diagnosing, true);
  const r = decide(s, { turnIndex: 6, message: 'I added three to the top and the bottom' });
  assert.equal(r.rule, 'reteach');
  assert.equal(updateLesson(s, { decision: r, steps: [] }).diagnosing, false);
});

test('a question back, "umm" and "I don\'t know" are not wrong answers: each has its own rule', () => {
  assert.equal(decide(at(), { turnIndex: 5, message: 'Wait, why do you cut it again?' }).rule, 'question');
  assert.match(decide(at(), { turnIndex: 5, message: 'why?' }).reason, /not an answer, and not wrong.*hand your question back/);
  const t = decide(at(), { turnIndex: 5, message: 'umm...' });
  assert.deepEqual([t.rule, t.moves, t.with], ['thinking', ['Wait and nudge'], []]);
  assert.equal(decide(at(), { turnIndex: 5, message: 'sijui' }).rule, 'lost');
});

test('a bored child who wants to stop: a short close or a quick change, never the lesson again; the second time, close', () => {
  const d = decide(at(), { turnIndex: 6, message: 'This is boring. I want to stop.' });
  assert.equal(d.rule, 'bored');
  assert.deepEqual(d.moves, ['Close the lesson', 'Predict then show']);
  assert.equal(d.stageMax, 'wrapup');
  assert.match(d.reason, /never repeat the lesson.*quick two-minute game.*stopping for today/);
  const s = updateLesson(at(), { decision: d, steps: [] });
  assert.equal(s.stops, 1);
  const d2 = decide(s, { turnIndex: 7, message: 'can we stop now' });
  assert.deepEqual([d2.rule, d2.moves], ['stop', ['Close the lesson']]);
  assert.equal(decide(at(), { turnIndex: 6, message: 'nimechoka, nataka kucheza' }).rule, 'bored');
  // Even with an answer in it, a wish to stop is heard.
  assert.equal(decide(at(), { turnIndex: 6, marked: wrong(), message: 'four. i am bored' }).rule, 'bored');
});

test('after a care reply the lesson waits: no model for a silence, a kind check when the child carries on', () => {
  const s = at({ care: 'paused' });
  const p = decide(s, { turnIndex: 6, probe: { kind: 'talk_nudge' } });
  assert.deepEqual([p.rule, p.authored], ['care-wait', true]);
  const c = decide(s, { turnIndex: 6, message: 'ok, I want to carry on' });
  assert.equal(c.rule, 'care-return');
  assert.match(c.reason, /check kindly.*that they are okay.*Never mention or ask about what they said/);
  assert.equal(updateLesson(s, { decision: c, steps: [] }).care, null, 'back in the lesson');
  const k = decide(s, { turnIndex: 6, message: 'he does it a lot' });
  assert.equal(k.rule, 'care');
  assert.match(k.reason, /no maths\. Never ask them to repeat or explain what happened/);
  assert.equal(updateLesson(s, { decision: k, steps: [] }).care, 'paused', 'still in the care frame');
  assert.equal(decide(s, { turnIndex: 6, message: 'I want to stop' }).rule, 'close');
});

test('the new lesson fields are cleaned like the rest', () => {
  const sealed = `${'a'.repeat(16)}.${'b'.repeat(100)}`;
  const c = cleanLesson({ v: 1, found: ['1/2', '4', '<b>', 'x'.repeat(41), '1/2'], care: 'paused', stops: 2, diagnosing: true, seal: sealed });
  assert.deepEqual([c.found, c.care, c.stops, c.diagnosing, c.seal], [['1/2', '4'], 'paused', 2, true, sealed]);
  const d = cleanLesson({ v: 1, care: 'party', stops: -1, diagnosing: 'yes', seal: 'not a seal' });
  assert.deepEqual([d.care, d.stops, d.diagnosing, d.seal], [null, 0, false, null]);
  assert.equal(updateLesson(at({ seal: sealed }), { steps: [] }).seal, null, 'a kept seal lasts one turn unless kept again');
  assert.equal(updateLesson(at(), { steps: [], keepSeal: sealed }).seal, sealed);
});

// ---------------------------------------------------------------- the second test-set run (2026-11-12-1142)
test('good moves are allowed in every stage; only stage moves are held to the stage; a tag on any say counts', () => {
  const warm = decide(at({ stage: 'warmup' }), { turnIndex: 3, message: 'yes I shared one' });
  assert.equal(warm.rule, 'stage');
  // Press for reasoning is no longer a move of every stage (P5): only where decide allows it.
  assert.match(judgeTurn(warm, [say('You shared it.'), say('How do you know they were the same?', 'Press for reasoning')]).join(' '), /"Press for reasoning" was not allowed/);
  assert.deepEqual(judgeTurn(warm, [say('You shared it.', 'Revoice and build'), say('How many pieces did you cut?', 'Count with the child')]), [], 'a tag on the second say counts');
  assert.deepEqual(judgeTurn(warm, [say('Yes, two pieces.', 'Name what was right')]), []);
  assert.deepEqual(judgeTurn(warm, [say('Take your time.', 'Wait and nudge')]), []);
  assert.match(judgeTurn(warm, [say('Now a harder one.', 'Stretch the quick child')]).join(' '), /not allowed this turn/);
  // The code's own sentences, and authored turns, are never held to a tag.
  const code = say('Yes, four pieces.');
  assert.deepEqual(judgeTurn(warm, [code, { cmd: 'pause_for_child' }], { fromModel: new Set() }), []);
  assert.deepEqual(judgeTurn(warm, [say('I am here.')], { authored: true }), []);
  // A care turn needs no tag; it is not a teaching turn, so the general moves are not added there.
  const care = decide(at({ care: 'paused' }), { turnIndex: 6, message: 'ok' });
  assert.deepEqual(judgeTurn(care, [say('I am glad you are here.')]), []);
  assert.match(judgeTurn(care, [say('How did you know?', 'Press for reasoning')]).join(' '), /not allowed/);
});

test('an answer said as a question is an answer: a count is said back and built on; a fraction is pressed once', () => {
  const d = decide(at({ stage: 'warmup' }), { turnIndex: 3, message: 'umm... so... maybe four pieces?' });
  assert.equal(d.rule, 'tentative');
  assert.ok(!d.moves.includes('Press for reasoning'), 'a count needs no reason (P5)');
  const f = decide(at({ stage: 'warmup' }), { turnIndex: 3, message: 'maybe one half?', lastQ: 'What fraction is shaded?' });
  assert.ok(f.moves.includes('Press for reasoning'));
  const p = decide(at(), { turnIndex: 3, marked: { ...right(), tentative: true }, message: 'umm... so... it is... one half?' });
  assert.equal(p.rule, 'press');
  assert.match(p.reason, /how sure they are/);
  assert.equal(gaveReason('umm... so... it is... one half?'), false, 'fillers and the answer are not a reason');
  assert.equal(gaveReason('umm... so... maybe it is the same amount?'), false);
  assert.equal(gaveReason('umm... because... the two small pieces... fit into one big half?'), true);
  assert.equal(decide(at({ pending: { ask: 'q1', skill: EQ } }), { turnIndex: 5, message: 'umm... because... the two small pieces fit into one big half?' }).rule, 'reason', 'a reason said as a question is a reason');
});

test('the lesson moves on by itself when the child has earned it, never past what is allowed, and closes on a goodbye', () => {
  const s0 = { ...newLesson(), stage: 'warmup', turns: 2 };
  const d = decide(s0, { turnIndex: 2, marked: right(), message: '2' });
  const s1 = updateLesson(s0, { decision: d, steps: [say('Yes, two.', 'Name what was right')], judged: finalClass({ marked: right(), message: '2' }), marked: right() });
  assert.equal(s1.stage, 'teach', 'out of the warm-up after a right answer');
  const d2 = decide(s1, { turnIndex: 3, marked: right('q2'), message: '2' });
  const s2 = updateLesson(s1, { decision: d2, steps: [say('Yes.', 'Name what was right')], judged: finalClass({ marked: right('q2'), message: '2' }), marked: right('q2') });
  assert.equal(s2.stage, 'teach', 'the teach part needs an answer understood');
  const said = 'two because each half is cut into two';
  const d3 = decide(s2, { turnIndex: 4, marked: right('q3'), message: said });
  const s3 = updateLesson(s2, { decision: d3, steps: [say('Yes.', 'Name what was right')], judged: finalClass({ marked: right('q3'), message: said }), marked: right('q3') });
  assert.equal(s3.stage, 'guided');
  // The model's set_phase is held to what is allowed.
  const s4 = updateLesson(s3, { decision: decide(s3, { turnIndex: 5, message: 'ok' }), steps: [{ cmd: 'set_phase', phase: 'wrapup' }, say('Done.')] });
  assert.equal(s4.stage, 'guided');
  // A lesson whose first turn set no phase is in the warm-up.
  assert.equal(updateLesson(newLesson(), { decision: decide(newLesson(), { turnIndex: 0 }), steps: [say('Hello.', 'Open the lesson')] }).stage, 'warmup');
  // Asked to stop twice: the wrap-up; a goodbye in the wrap-up is let go.
  const stop = decide(at({ stops: 1 }), { turnIndex: 6, message: 'I want to stop' });
  assert.equal(updateLesson(at({ stops: 1 }), { decision: stop, steps: [say('Well done today.', 'Close the lesson')] }).stage, 'wrapup');
  assert.equal(decide(at({ stage: 'wrapup' }), { turnIndex: 7, message: 'Bye HOREB, I am going to play now!' }).rule, 'stop');
  // The question ids of the lesson are kept, so a reused one can be renamed.
  const s5 = updateLesson(s0, { steps: [{ cmd: 'ask', id: 'p1q', prompt: 'x?', form: 'number' }] });
  assert.deepEqual(cleanLesson(JSON.parse(JSON.stringify(s5))).asked, ['p1q']);
});

test('a wrong answer the child has already explained is retaught from their way, not diagnosed again', () => {
  const d = decide(at(), { turnIndex: 8, marked: wrong(), message: 'Um, I added the bottoms. Six plus twelve is eighteen. And one plus one is two.' });
  assert.equal(d.rule, 'reteach');
  assert.match(d.reason, /already said how they got it/);
  assert.equal(decide(at(), { turnIndex: 8, marked: wrong(), message: 'four' }).rule, 'diagnose');
});

// ---------------------------------------------------------------- the "never tell" exit (READING_12NOV.md change 2)
test('the never-tell exit: after two failed attempts on a changed picture, ONE worked example is allowed, then back to the child', () => {
  // wrong with the bar, then wrong with the bar again: change; a number line is drawn; then two wrong answers on it.
  let s = at({ rep: 'bar', tried: ['bar'] });
  // Round 2 diagnoses first and waits for a reason; this test is about the exit, so each diagnosis counts as answered.
  const step = (state0, steps, m, ask) => {
    const state = { ...state0, diag: null };
    const d = decide(state, { turnIndex: 6, marked: m });
    return { d, s: updateLesson(state, { decision: d, steps, judged: finalClass({ marked: m }), marked: m }) };
  };
  let r = step(s, [say('How did you get four?', 'Diagnose the wrong answer'), bar], wrong('q1'));
  assert.equal(r.d.rule, 'diagnose'); assert.equal(r.s.changedFails, 0, 'one picture only: nothing changed yet');
  r = step(r.s, [say('Here is a number line.', 'Show then hand over'), line], wrong('q2'));
  assert.equal(r.d.rule, 'change');
  assert.deepEqual(r.s.tried, ['bar', 'number line']);
  r = step(r.s, [say('Where is one half?', 'Smaller-question hint')], wrong('q3'));
  assert.notEqual(r.d.rule, 'example', 'the first failure on the changed picture is not enough');
  assert.equal(r.s.changedFails, 1);
  r = step(r.s, [say('Watch me work a different one. Take two thirds and one third on this bar.', 'Show then hand over')], wrong('q4'));
  assert.equal(r.d.rule, 'example');
  assert.deepEqual(r.d.moves, ['Show then hand over', 'Count with the child']);
  assert.match(r.d.reason, /ONE worked example, on a DIFFERENT question/);
  assert.match(r.d.reason, /never the open question's own answer/);
  assert.equal(r.s.examples, 1);
  assert.equal(r.s.changedFails, 0, 'the count starts again after the example');
  // One example, not a habit: while it is used up the rules go on as before; understanding clears it.
  const again = decide({ ...r.s, changedFails: 1 }, { turnIndex: 8, marked: wrong('q5') });
  assert.notEqual(again.rule, 'example');
  const learned = updateLesson(r.s, { decision: decide(r.s, { turnIndex: 8, marked: right('q6'), message: 'two because each half is cut into two' }), steps: [say('Yes.', 'Name what was right')], judged: finalClass({ marked: right('q6'), message: 'two because each half is cut into two' }), marked: right('q6') });
  assert.equal(learned.examples, 0);
  assert.equal(learned.changedFails, 0);
  // The turn that plays the example is a legal teaching turn.
  assert.deepEqual(judgeTurn(r.d, [say('Watch how this one goes.', 'Show then hand over'), bar]), []);
});

test('the lesson state keeps the exit counters, checked on the way in', () => {
  const s = cleanLesson({ v: 1, changedFails: 1, examples: 1 });
  assert.equal(s.changedFails, 1); assert.equal(s.examples, 1);
  const bad = cleanLesson({ v: 1, changedFails: 99, examples: -2 });
  assert.equal(bad.changedFails, 0); assert.equal(bad.examples, 0);
  assert.equal(newLesson().changedFails, 0);
});
