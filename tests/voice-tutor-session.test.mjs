// ============================================================================
// SESSION STATE: the mascot's states, the caps, the lesson's target, the
// evidence (never "mastered"), and the scripted tutor's whole lesson.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionReducer, newSession, mascotState, capCheck, settingsFrom, evidenceOf, DEFAULT_SETTINGS } from '../src/voice-tutor/session.js';
import { pickTarget, FRACTION_SKILLS, lessonSkills, allowedMisconceptions, prerequisitesOf } from '../src/voice-tutor/fractions.js';
import { createMockTutor, DEMO_ANSWERS } from '../src/voice-tutor/mockTutor.js';
import { emptyBoard, applyStep, boardSummary } from '../src/voice-tutor/board.js';
import { validateTurn, turnProblems } from '../src/voice-tutor/commands.js';
import { SKILLS_G5 } from '../src/ai-tutor/content/curriculumMap.g5.js';

const F = 'MATH.G5.NUMBER.FRACTIONS.';

test('the mascot: listening, thinking, speaking, following the session', () => {
  let s = newSession({ id: 's1' });
  assert.equal(mascotState(s.status), 'listening');
  s = sessionReducer(s, { type: 'request' });
  assert.equal(mascotState(s.status), 'thinking');
  s = sessionReducer(s, { type: 'turn', steps: [{ cmd: 'set_phase', phase: 'warmup' }, { cmd: 'say', text: 'Hi.' }] });
  assert.equal(mascotState(s.status), 'speaking');
  assert.equal(s.phase, 'warmup');
  s = sessionReducer(s, { type: 'handed_over' });
  assert.equal(mascotState(s.status), 'listening');
  s = sessionReducer(s, { type: 'child_said', text: 'three quarters' });
  assert.equal(s.status, 'thinking');
  assert.equal(s.transcript.at(-1).who, 'child');
  s = sessionReducer(s, { type: 'ended', summary: 'done' });
  assert.equal(sessionReducer(s, { type: 'handed_over' }).status, 'ended');
  assert.equal(sessionReducer(s, { type: 'child_said', text: 'more' }), s);
});

test('caps are settings: US$1.50 a session and US$3 a day by default', () => {
  assert.equal(DEFAULT_SETTINGS.sessionCapUsd, 1.5);
  assert.equal(DEFAULT_SETTINGS.dayCapUsd, 3);
  assert.equal(DEFAULT_SETTINGS.model, 'claude-sonnet-5-5');
  assert.deepEqual(capCheck({ sessionUsd: 1.49, dayUsd: 2.9 }), { ok: true, reason: null });
  assert.equal(capCheck({ sessionUsd: 1.5 }).reason, 'session-cap');
  assert.equal(capCheck({ sessionUsd: 0.2, dayUsd: 3 }).reason, 'day-cap');
  const env = { VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: ' A@x.com, b@y.com ', VOICE_TUTOR_SESSION_CAP_USD: '0.5', VOICE_TUTOR_EFFORT: 'silly' };
  const s = settingsFrom((k) => env[k]);
  assert.equal(s.enabled, true);
  assert.deepEqual(s.allowlist, ['a@x.com', 'b@y.com']);
  assert.equal(s.sessionCapUsd, 0.5);
  assert.equal(s.dayCapUsd, 3);
  assert.equal(s.effort, 'medium', 'medium by default (12 Nov 2026); VOICE_TUTOR_EFFORT=low or high overrides it');
  assert.equal(settingsFrom((k) => ({ VOICE_TUTOR_EFFORT: 'low' }[k])).effort, 'low');
  assert.equal(settingsFrom(() => undefined).enabled, false);
});

test('evidence is added, marked voice-prototype, and never says "mastered"', () => {
  let s = newSession({ id: 's1' });
  s = sessionReducer(s, { type: 'marked', skill: `${F}EQUIVALENT_FRACTIONS`, correct: false, misconception: `${F}EQUIVALENT_FRACTIONS.M_EQUIV_ADDITIVE`, answer: '5/6', askId: 'q1' });
  s = sessionReducer(s, { type: 'marked', skill: `${F}EQUIVALENT_FRACTIONS`, correct: true, misconception: 'ignored when right', answer: '4/6', askId: 'q2' });
  assert.equal(s.evidence.length, 2);
  for (const e of s.evidence) {
    assert.equal(e.source, 'voice-prototype');
    assert.equal('mastered' in e, false);
  }
  assert.equal(s.evidence[1].misconception, null);
  assert.equal('mastered' in evidenceOf({ skill: 'x', correct: true }), false);
});

test('the curriculum map carries prerequisites, and the target is the first fraction skill not held', () => {
  assert.equal(FRACTION_SKILLS.length, 9);
  // Every prerequisite comes before the skill that needs it.
  FRACTION_SKILLS.forEach((c, i) => (SKILLS_G5[c].pre || []).filter((p) => p.startsWith(F)).forEach((p) => assert.ok(FRACTION_SKILLS.indexOf(p) < i, `${p} before ${c}`)));
  assert.deepEqual(prerequisitesOf(`${F}ADD_SAME_DENOMINATOR`), [`${F}SIMPLIFY_FRACTIONS`, `${F}EQUIVALENT_FRACTIONS`]);

  const fresh = pickTarget({ skills: {} });
  assert.equal(fresh.target, `${F}EQUIVALENT_FRACTIONS`);
  assert.equal(fresh.prerequisite, null);

  // EQUIV held, INTRO not: compare-like is next; ADD with a failing SIMPLIFY prerequisite names it.
  const p = { skills: { G5_FRACTIONS_EQUIV: { mastered: true, attempts: 12, correct: 11 }, G5_FRACTIONS_INTRO: { attempts: 6, correct: 2 } } };
  assert.equal(pickTarget(p).target, `${F}COMPARE_LIKE_FRACTIONS`);
  const q = { skills: { G5_FRACTIONS_EQUIV: { attempts: 10, correct: 3 } } };
  const t = pickTarget(q, `${F}ADD_SAME_DENOMINATOR`);
  assert.equal(t.target, `${F}ADD_SAME_DENOMINATOR`);
  assert.equal(t.reason, 'chosen by the tester');
  assert.ok([`${F}SIMPLIFY_FRACTIONS`, `${F}EQUIVALENT_FRACTIONS`].includes(t.prerequisite));
  assert.deepEqual(lessonSkills(`${F}SIMPLIFY_FRACTIONS`), [`${F}SIMPLIFY_FRACTIONS`, `${F}EQUIVALENT_FRACTIONS`]);
  assert.ok(allowedMisconceptions([`${F}EQUIVALENT_FRACTIONS`]).includes(`${F}EQUIVALENT_FRACTIONS.M_EQUIV_ADDITIVE`));
  // Reading mastery never writes it.
  const before = JSON.stringify(q);
  pickTarget(q);
  assert.equal(JSON.stringify(q), before);
});

test('the scripted lesson: every turn valid, the approved shape, a diagnosis before reteaching, no answer shown', async () => {
  const tutor = createMockTutor();
  let board = emptyBoard();
  let ask = null;
  let msg = '';
  const phases = [];
  const turns = [];
  for (let k = 0; k < 10; k++) {
    const r = await tutor.turn({ message: msg, answer: ask && msg ? { seal: ask.seal, response: msg } : null, board: boardSummary(board) });
    turns.push(r);
    assert.deepEqual(r.dropped, [], `turn ${k}`);
    assert.deepEqual(turnProblems(r.steps), [], `turn ${k}`);
    assert.equal(validateTurn({ steps: r.steps.map(({ seal, ...s }) => s) }, { board: boardSummary(board), publicAsk: true }).dropped.length, 0);
    ask = null;
    for (const s of r.steps) {
      if (s.cmd === 'ask') { assert.equal(s.expected, undefined, 'the answer never reaches the page'); ask = s; }
      if (s.cmd === 'set_phase') phases.push(s.phase);
      board = applyStep(board, s, 0);
    }
    assert.deepEqual(board.log, []);
    if (board.ended) break;
    msg = DEMO_ANSWERS[k] || '';
  }
  assert.match(turns[0].steps.find((s) => s.cmd === 'say').text, /AI tutor/);
  assert.deepEqual([...new Set(phases)], ['warmup', 'teach', 'guided', 'independent', 'wrapup']);
  assert.ok(board.ended);
  // The wrong answer (4) got a probe, not a correction; the diagnosis came with evidence.
  const probe = turns.find((t) => t.marked?.answer === '4');
  assert.equal(probe.marked.misconception, `${F}EQUIVALENT_FRACTIONS.M_EQUIV_ADDITIVE`);
  assert.ok(probe.steps.some((s) => s.cmd === 'ask'));
  assert.ok(!probe.steps.some((s) => s.cmd === 'record_diagnosis'));
  assert.equal(board.diagnoses.length, 1);
  assert.match(board.diagnoses[0].evidence, /4 for 1\/3 = \?\/6 and 6 for 2\/4 = \?\/8/);
});

test('the scripted tutor, interrupted, goes back over the same part instead of moving on', async () => {
  const tutor = createMockTutor();
  const first = await tutor.turn({});
  const again = await tutor.turn({ message: 'wait', heard: 'Hello. I am HOREB' });
  assert.deepEqual(again.dropped, []);
  assert.equal(again.steps[0].cmd, 'clear');
  assert.match(again.steps.find((s) => s.cmd === 'say').text, /Let me show that again/);
  assert.deepEqual(again.steps.filter((s) => s.cmd === 'ask').map((s) => s.id), first.steps.filter((s) => s.cmd === 'ask').map((s) => s.id));
  // Then the lesson carries on from where it was.
  const next = await tutor.turn({ message: '3/4', answer: { seal: 'mock:w1', response: '3/4' } });
  assert.equal(next.marked.correct, true);
  assert.ok(next.steps.some((s) => s.cmd === 'set_phase' && s.phase === 'teach'));
});

test('the conversation engine in the session: what the child is doing, the floor on barge-in, each turn\'s guards for the tester', () => {
  let s = newSession({ id: 's1' });
  s = sessionReducer(s, { type: 'request' });
  s = sessionReducer(s, { type: 'turn', steps: [{ cmd: 'say', text: 'Hi.' }] });
  assert.equal(s.status, 'speaking');
  // A real voice over HOREB: it stops, and it is the child's turn.
  assert.equal(sessionReducer(s, { type: 'floor' }).status, 'listening');
  assert.equal(sessionReducer({ ...s, status: 'thinking' }, { type: 'floor' }).status, 'thinking');
  s = sessionReducer(s, { type: 'turn_more', steps: [], guard: ['answer-leak'], tester: { rule: 'press', moves: ['Press for reasoning'] }, probe: 'answer_nudge' });
  assert.deepEqual(s.log, [{ turn: 1, guard: ['answer-leak'], tester: { rule: 'press', moves: ['Press for reasoning'] }, probe: 'answer_nudge' }]);
  s = sessionReducer(s, { type: 'handed_over', doing: 'task' });
  assert.deepEqual([s.status, s.doing], ['listening', 'task']);
});
