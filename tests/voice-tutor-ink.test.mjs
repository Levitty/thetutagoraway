// ============================================================================
// MILESTONE 2: the child's ink (layers, eraser, undo), when pictures are
// taken (throttling, none while writing), what a picture may be, and the
// scripted tutor's stub reading of the example drawings.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyInk, inkReducer, strokePath, inkCells, writing, hasInk, CHILD_INK, MAX_UNDO } from '../src/voice-tutor/ink.js';
import { autoSnapDue, checkAllowed, validateSnapshot, imageTokens, IDLE_MS, AUTO_GAP_MS, CHECK_GAP_MS, MAX_PER_SESSION, MAX_BYTES } from '../src/voice-tutor/snapshot.js';
import { emptyBoard, applyStep } from '../src/voice-tutor/board.js';
import { COLOURS, PALETTE as INK, validateTurn, turnProblems } from '../src/voice-tutor/commands.js';
import { createMockTutor, stubVision, DEMO_SCRIPT } from '../src/voice-tutor/mockTutor.js';
import { EXAMPLES, exampleStrokes, handwriting } from '../src/voice-tutor/examples.js';

const run = (ink, ...actions) => actions.reduce((k, a) => inkReducer(k, a), ink);
const line = (x0, y0, x1, y1, t = 0) => [
  { type: 'down', x: x0, y: y0, t, tool: 'pen' },
  ...Array.from({ length: 10 }, (_, i) => ({ type: 'move', x: x0 + ((x1 - x0) * (i + 1)) / 10, y: y0 + ((y1 - y0) * (i + 1)) / 10, t: t + i })),
  { type: 'up', t: t + 20 },
];

test('the pen draws thinned, smooth strokes in the child\'s own colour', () => {
  let k = run(emptyInk(), ...line(100, 100, 300, 100));
  assert.equal(k.strokes.length, 1);
  assert.equal(k.strokes[0].color, CHILD_INK);
  assert.ok(k.strokes[0].points.length >= 2 && k.strokes[0].points.length <= 11);
  // A tiny wobble is not kept as a new point.
  k = run(k, { type: 'down', x: 10, y: 10, t: 1, tool: 'pen' }, { type: 'move', x: 10.5, y: 10.5, t: 2 });
  assert.equal(k.live.points.length, 1);
  assert.equal(writing(k), true);
  k = run(k, { type: 'up', t: 3 });
  assert.equal(writing(k), false);
  assert.match(strokePath([[0, 0], [10, 10], [20, 0], [30, 10]]), /^M0,0 Q10,10 15,5 Q20,0 25,5 L30,10$/);
  assert.match(strokePath([[5, 5]]), /^M5,5/);
  // The child's colour is not one the tutor can use.
  assert.ok(!COLOURS.map((c) => INK[c].toLowerCase()).includes(CHILD_INK.toLowerCase()));
});

test('the eraser removes the child\'s strokes it touches, as one undo step; undo brings them back', () => {
  let k = run(emptyInk(), ...line(100, 100, 300, 100), ...line(100, 300, 300, 300, 50));
  assert.equal(k.strokes.length, 2);
  const v = k.version;
  k = run(k, { type: 'down', x: 200, y: 105, t: 100, tool: 'eraser' }, { type: 'move', x: 200, y: 200, t: 101 }, { type: 'up', t: 102 });
  assert.equal(k.strokes.length, 1);
  assert.equal(k.strokes[0].points[0][1], 300);
  assert.equal(k.version, v + 1);
  k = run(k, { type: 'undo', t: 103 });
  assert.equal(k.strokes.length, 2);
  k = run(k, { type: 'undo', t: 104 }, { type: 'undo', t: 105 });
  assert.equal(k.strokes.length, 0);
  assert.equal(run(k, { type: 'undo', t: 106 }), k, 'nothing left to undo');
  // An eraser sweep that touches nothing is not an undo step; a cancelled sweep restores.
  const k2 = run(emptyInk(), ...line(0, 0, 50, 0));
  const u = k2.undo.length;
  assert.equal(run(k2, { type: 'down', x: 900, y: 600, t: 1, tool: 'eraser' }, { type: 'up', t: 2 }).undo.length, u);
  assert.equal(run(k2, { type: 'down', x: 25, y: 0, t: 1, tool: 'eraser' }, { type: 'cancel' }).strokes.length, 1);
  // Undo history is bounded.
  let many = emptyInk();
  for (let i = 0; i < MAX_UNDO + 10; i += 1) many = run(many, ...line(i, 0, i + 30, 0, i * 30));
  assert.equal(many.undo.length, MAX_UNDO);
});

test('two layers: board commands never touch the child\'s ink, and the child cannot erase the tutor\'s work', () => {
  let b = emptyBoard();
  b = applyStep(b, { cmd: 'fraction_bar', id: 'bar1', parts: 4, shaded: 1, slot: 'top' }, 0);
  b = { ...b, childInk: run(b.childInk, ...line(100, 500, 300, 500)) };
  const ink = b.childInk;
  for (const step of [{ cmd: 'clear', scope: 'tutor' }, { cmd: 'erase', targets: ['bar1'] }, { cmd: 'write_text', id: 't', text: 'hi', slot: 'middle' }]) {
    b = applyStep(b, step, 1);
    assert.equal(b.childInk, ink, step.cmd);
  }
  // The child's eraser works on child ink only: there is no tutor item in it to reach.
  b = applyStep(b, { cmd: 'fraction_bar', id: 'bar2', parts: 2, shaded: 1, slot: 'top' }, 2);
  const after = { ...b, childInk: run(b.childInk, { type: 'down', x: 500, y: 100, t: 3, tool: 'eraser' }, { type: 'up', t: 4 }) };
  assert.deepEqual(after.order, ['t', 'bar2']);
  assert.equal(after.childInk.strokes.length, 1);
  // "clear" by the child clears only their ink, and can be undone.
  const cleared = run(after.childInk, { type: 'clear', t: 5 });
  assert.equal(cleared.strokes.length, 0);
  assert.equal(run(cleared, { type: 'undo', t: 6 }).strokes.length, 1);
});

test('the tutor draws around the child\'s writing when there is room', () => {
  const ink = run(emptyInk(), ...line(600, 500, 800, 520));
  assert.deepEqual(inkCells(ink, 640), ['bottom_right']);
  const v = validateTurn({ steps: [{ cmd: 'write_text', id: 'a', text: 'x', slot: 'bottom_right' }] }, { inkCells: ['bottom_right'] });
  assert.notEqual(v.steps[0].slot, 'bottom_right');
  // A full board still draws (over the child's cell) rather than drop the tutor's work.
  const board = ['top_left', 'top_right', 'middle_left', 'middle_right', 'bottom_left'].map((slot, i) => ({ id: `i${i}`, cmd: 'write_text', text: 'x', slot }));
  const w = validateTurn({ steps: [{ cmd: 'write_text', id: 'b', text: 'y', slot: 'top' }] }, { board, inkCells: ['bottom_right'] });
  assert.equal(w.steps[0].slot, 'bottom_right');
  let b = { ...emptyBoard(), childInk: ink };
  b = applyStep(b, { cmd: 'write_text', id: 'c', text: 'z', slot: 'bottom_right' }, 0, 640);
  assert.notEqual(b.items.c.slot, 'bottom_right');
});

const S = (o = {}) => ({ status: 'listening', writing: false, hasInk: true, inkVersion: 3, snappedVersion: 2, lastInkAt: 0, lastSnapAt: null, count: 0, ...o });

test('the idle picture: after 4 s with no writing, on the child\'s turn, ink changed, not more than one every 10 s', () => {
  assert.equal(autoSnapDue(S(), IDLE_MS - 1), false, 'too soon after the last stroke');
  assert.equal(autoSnapDue(S(), IDLE_MS), true);
  assert.equal(autoSnapDue(S({ writing: true }), 60000), false, 'never while a finger is down');
  assert.equal(autoSnapDue(S({ snappedVersion: 3 }), 60000), false, 'nothing new since the last picture');
  assert.equal(autoSnapDue(S({ status: 'speaking' }), 60000), false, 'not while the tutor talks');
  assert.equal(autoSnapDue(S({ status: 'thinking' }), 60000), false);
  assert.equal(autoSnapDue(S({ hasInk: false }), 60000), false, 'never an empty board');
  assert.equal(autoSnapDue(S({ lastSnapAt: 1000 }), 1000 + AUTO_GAP_MS - 1), false, 'one every 10 s at most');
  assert.equal(autoSnapDue(S({ lastSnapAt: 1000 }), 1000 + AUTO_GAP_MS), true);
  assert.equal(autoSnapDue(S({ count: MAX_PER_SESSION }), 60000), false, '30 a lesson at most');
});

test('Check my work: at once, but not while writing, not twice in 3 s, never an empty board', () => {
  assert.equal(checkAllowed(S({ lastInkAt: 100 }), 200).ok, true, 'no idle wait for a check');
  assert.equal(checkAllowed(S({ writing: true }), 9e9).reason, 'still writing');
  assert.equal(checkAllowed(S({ hasInk: false }), 9e9).reason, 'nothing written yet');
  assert.equal(checkAllowed(S({ lastSnapAt: 0 }), CHECK_GAP_MS - 1).ok, false);
  assert.equal(checkAllowed(S({ lastSnapAt: 0 }), CHECK_GAP_MS).ok, true);
  assert.equal(checkAllowed(S({ status: 'thinking' }), 9e9).ok, false);
});

const JPEG = `/9j/${'A'.repeat(4000)}`;
const pic = (o = {}) => ({ id: 'snap-1', media: 'image/jpeg', data: JPEG, w: 1000, h: 640, reason: 'check', strokes: 3, ...o });

test('a picture is a small jpeg or png of the board, checked before use', () => {
  const ok = validateSnapshot(pic());
  assert.equal(ok.error, undefined);
  assert.equal(ok.w, 1000);
  assert.equal(validateSnapshot(pic({ data: 'A'.repeat(MAX_BYTES + 4) })).error, 'picture too large');
  assert.equal(validateSnapshot(pic({ w: 4000 })).error, 'picture size out of range');
  assert.equal(validateSnapshot(pic({ media: 'image/gif' })).error, 'not a jpeg or png');
  assert.equal(validateSnapshot(pic({ data: 'iVBORw0K' + 'A'.repeat(100) })).error, 'not really a jpeg');
  assert.equal(validateSnapshot(pic({ data: 'not base64!' })).error, 'not base64');
  assert.equal(validateSnapshot(pic({ id: '../x' })).error, 'bad picture id');
  assert.equal(validateSnapshot(null).error, 'no picture');
  // Extra fields (like the scripted mode's example name) do not pass through.
  assert.equal('example' in validateSnapshot(pic({ example: 'adds' })), false);
  assert.equal(imageTokens(1000, 640), 854);
  assert.equal(imageTokens(1000, 1050), 1400);
});

test('a diagnosis may name only a picture this session really took', () => {
  const d = { cmd: 'record_diagnosis', skill: 's', misconception: 'other', confidence: 'high', evidence: 'wrote 1/3 = 4/6', next: 'reteach' };
  assert.equal(validateTurn({ steps: [{ ...d, snapshot: 'snap-2' }] }, { snapshots: 2 }).steps[0].snapshot, 'snap-2');
  assert.match(validateTurn({ steps: [{ ...d, snapshot: 'snap-3' }] }, { snapshots: 2 }).dropped[0].reason, /no picture snap-3/);
  assert.match(validateTurn({ steps: [{ ...d, snapshot: 'photo.jpg' }] }, { snapshots: 2 }).dropped[0].reason, /bad snapshot/);
  // After an idle picture the tutor may only nod; otherwise it must say something.
  const nod = [{ cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 }];
  assert.deepEqual(turnProblems(nod, { nod: true }), []);
  assert.deepEqual(turnProblems(nod), ['the turn says nothing']);
});

test('example drawings are handwriting strokes in the board, and the stub reads only those', () => {
  const strokes = exampleStrokes('adds', 640);
  assert.ok(strokes.length >= 8);
  for (const st of strokes) for (const [x, y] of st) assert.ok(x >= 0 && x <= 1000 && y >= 0 && y <= 640, `${x},${y}`);
  assert.ok(exampleStrokes('adds', 1050, 'middle_left').every((st) => st.every(([x, y]) => x < 500 && y > 350 && y < 700)));
  assert.ok(handwriting('2/4 = 6/8', 0, 0).length > 0);
  assert.deepEqual(stubVision({ strokes: 0 }), { clear: false, blank: true });
  assert.deepEqual(stubVision({ strokes: 4 }), { clear: false, freehand: true }, 'free drawing: honest, not a guess');
  assert.equal(stubVision({ strokes: 3, example: 'scribble' }).clear, false);
  assert.equal(stubVision({ strokes: 9, example: 'adds' }).answer, '4');
  assert.ok(Object.values(EXAMPLES).some((e) => !e.clear));
});

test('the scripted tutor reacts to pictures: unclear asks again, a clear wrong answer is probed, the diagnosis names the picture', async () => {
  const t = createMockTutor();
  const turn = (o) => t.turn({ board: [], ...o });
  await turn({});                                                             // open
  await turn({ message: '3/4', answer: { seal: 'mock:w1', response: '3/4' } }); // teach
  await turn({ message: 'doubled' });                                         // guided: asks g1
  const unclear = await turn({ snapshot: { id: 'snap-1', strokes: 3, example: 'scribble', reason: 'check' }, snapshots_taken: 1 });
  assert.match(unclear.steps.map((s) => s.text).join(' '), /cannot read it clearly.*write it again, bigger, or type/);
  assert.equal(unclear.marked, null);
  const free = await turn({ snapshot: { id: 'snap-2', strokes: 5, reason: 'idle' }, snapshots_taken: 2 });
  assert.match(free.steps[0].text, /can only read the example drawings/, 'never claims to read free writing');
  const seen = await turn({ snapshot: { id: 'snap-3', strokes: 12, example: 'adds', reason: 'idle' }, snapshots_taken: 3 });
  assert.equal(seen.marked.answer, '4');
  assert.match(seen.marked.misconception, /M_EQUIV_ADDITIVE/);
  assert.match(seen.steps[0].text, /I see you wrote 1\/3 = 4\/6/);
  assert.ok(seen.steps.some((s) => s.cmd === 'ask'), 'a probe, not a correction');
  const re = await turn({ snapshot: { id: 'snap-4', strokes: 12, example: 'probe', reason: 'check' }, snapshots_taken: 4 });
  const d = re.steps.find((s) => s.cmd === 'record_diagnosis');
  assert.equal(d.snapshot, 'snap-4');
  assert.match(d.evidence, /on the board, picture snap-3.*on the board, picture snap-4/);
  assert.deepEqual(re.dropped, []);
  assert.ok(DEMO_SCRIPT.some((x) => x.type === 'draw' && x.then === 'wait') && DEMO_SCRIPT.some((x) => x.then === 'check'));
});
