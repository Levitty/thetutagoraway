// Rendering engine phase 2: composition (src/draw/compose.js), the layout pass over the slots.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutBoard, placeItem, PAD } from '../src/draw/compose.js';
import { itemStrokes, strokesBox } from '../src/draw/strokes.js';
import { createMockTutor } from '../src/voice-tutor/mockTutor.js';
import { applyStep, emptyBoard, boardSummary } from '../src/voice-tutor/board.js';

const H = 1100;
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

test('a half-slot figure alone in its row takes the whole row, big and centred on the sheet', () => {
  const r = layoutBoard([{ id: 's', cmd: 'shape', slot: 'top_left', kind: 'circle', parts: 4, shaded: 3 }], H).get('s');
  assert.equal(r.x, PAD);
  assert.equal(r.w, 1000 - 2 * PAD);
  assert.ok(r.h >= 500, `tall: ${r.h}`);
  assert.ok(Math.abs(r.y + r.h / 2 - H / 2) < 5, 'centred on the sheet');
});

test('the main figure gets the room; writing above and below takes only what it needs', () => {
  const m = layoutBoard([
    { id: 't', cmd: 'write_text', text: 'Shade the sixths', slot: 'top', size: 'm' },
    { id: 'f', cmd: 'figure', type: 'graph', params: {}, slot: 'middle' },
    { id: 'q', cmd: 'write_math', expr: 'frac(1,3) = frac(?,6)', slot: 'bottom_left', size: 'l' },
  ], H);
  const [t, f, q] = ['t', 'f', 'q'].map((k) => m.get(k));
  assert.ok(f.h > 3 * t.h, 'the figure is the big thing');
  assert.ok(t.y + t.h <= f.y && f.y + f.h <= q.y, 'in reading order, no overlap');
  assert.equal(q.w, 1000 - 2 * PAD, 'maths alone in its row is centred across it');
});

test('a figure beside writing takes 60% of the row', () => {
  const m = layoutBoard([
    { id: 'f', cmd: 'fraction_bar', parts: 4, shaded: 1, slot: 'middle_left' },
    { id: 'w', cmd: 'write_math', expr: 'frac(1,4)', slot: 'middle_right', size: 'l' },
  ], H);
  assert.ok(Math.abs(m.get('f').w / (m.get('f').w + m.get('w').w) - 0.6) < 0.01);
});

test('drawn ink never moves; a new item goes where the ink is not', () => {
  const H2 = 1000;
  const circle = { id: 's', cmd: 'shape', slot: 'top_left', kind: 'circle', parts: 4, shaded: 3, label: false };
  const rect = placeItem([], circle, [], H2);
  const drawn = { ...circle, rect };
  const inkOf = (it) => strokesBox(itemStrokes(it, H2), 6);
  const step = { id: 'm', cmd: 'write_math', expr: 'frac(3,4)', slot: 'top_right', size: 'l' };
  const m = layoutBoard([drawn, step], H2, { inkOf });
  assert.deepEqual(m.get('s'), rect, 'the circle keeps its frame');
  assert.ok(!overlap(m.get('m'), inkOf(drawn)), 'the maths is clear of the circle');
});

test('a turn is composed whole: an item laid out knowing the steps after it', () => {
  const steps = [
    { cmd: 'fraction_bar', id: 'a', parts: 3, shaded: 1, slot: 'top' },
    { cmd: 'fraction_bar', id: 'b', parts: 6, shaded: 2, slot: 'middle' },
    { cmd: 'write_math', id: 'c', expr: 'frac(1,3) = frac(2,6)', slot: 'bottom', size: 'l' },
  ];
  let b = emptyBoard();
  steps.forEach((st, i) => { b = applyStep(b, st, i, H, { place: (s) => placeItem(b.order.map((id) => b.items[id]), s, steps.slice(i + 1), H) }); });
  const all = layoutBoard(steps, H);
  for (const s of steps) assert.deepEqual(b.items[s.id].rect, { ...all.get(s.id), x: Math.round(all.get(s.id).x * 10) / 10, y: Math.round(all.get(s.id).y * 10) / 10, w: Math.round(all.get(s.id).w * 10) / 10, h: Math.round(all.get(s.id).h * 10) / 10 });
  assert.ok(b.items.b.rect.y - (b.items.a.rect.y + b.items.a.rect.h) < 60, 'two bars to compare sit close together');
});

test('the practice lesson, composed on a laptop and a phone: no two drawings overlap, and it uses two figures, one with a goal', async () => {
  for (const HH of [1100, 640]) {
    const tutor = createMockTutor();
    let b = emptyBoard();
    const figures = [];
    for (const [message, answerOf] of [[null], ['3/4', 'w1'], ['both doubled'], ['2', 'g1'], ['9', 'i1']]) {
      const ask = b.ask;
      const r = await tutor.turn({ message: message || '', answer: answerOf && ask ? { seal: ask.seal, response: message } : null, board: boardSummary(b) });
      r.steps.forEach((st, i) => {
        if (st.cmd === 'figure') figures.push(st);
        b = applyStep(b, st, i, HH, { place: (s) => placeItem(b.order.map((id) => b.items[id]), s, r.steps.slice(i + 1), HH, { inkOf: (it) => strokesBox(itemStrokes(it, HH), 6) }) });
        const boxes = b.order.map((id) => ({ id, box: strokesBox(itemStrokes(b.items[id], HH), 0) }));
        for (let x = 0; x < boxes.length; x += 1) for (let y = x + 1; y < boxes.length; y += 1) assert.ok(!overlap(boxes[x].box, boxes[y].box), `${HH}: ${boxes[x].id} and ${boxes[y].id} overlap`);
      });
    }
    assert.ok(figures.length >= 2);
    assert.ok(figures.some((f) => f.goal && f.controls.length));
  }
});
