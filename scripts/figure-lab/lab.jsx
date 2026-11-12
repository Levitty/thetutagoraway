// The figure lab (rendering engine phase 2): every Grade 5 figure on the real board, composed on
// the sheet the lesson screen gives it at this window's size, fully drawn, some with a child's moves
// played on them. For frame captures (taste_capture) and for looking, never for children.
// Dev server only: http://localhost:5173/scripts/figure-lab/index.html  (?only=3 shows one scene)
import '@fontsource-variable/figtree';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Board, composedItems } from '../../src/voice-tutor/Board.jsx';
import { emptyBoard, applyStep, playFigure } from '../../src/voice-tutor/board.js';
import { validateTurn } from '../../src/voice-tutor/commands.js';
import { roomShape } from '../../src/voice-tutor/layout.js';
import { placeItem } from '../../src/draw/compose.js';
import { itemStrokes, strokesBox } from '../../src/draw/strokes.js';

const fig = (id, type, params, extra = {}) => ({ cmd: 'figure', id, type, params: JSON.stringify(params), slot: 'middle', colour: 'orange', ...extra, ...(extra.goal ? { goal: JSON.stringify(extra.goal) } : {}) });
const SCENES = [
  { name: 'Fraction bars: one third and sixths, the child shading', steps: [
    { cmd: 'write_text', id: 't', text: 'Shade the sixths to match.', slot: 'top', size: 'm' },
    fig('f', 'fraction', { parts: 3, shaded: 1, second: { parts: 6 } }, { controls: ['shade_second'], goal: { kind: 'match' } }),
    { cmd: 'write_math', id: 'm', expr: 'frac(1,3) = frac(?,6)', slot: 'bottom', size: 'l' },
  ], play: [['f', 'shade_second', 1], ['f', 'shade_second', 2]] },
  { name: 'Fraction circles: compare', steps: [
    fig('f', 'fraction', { shape: 'circle', parts: 4, shaded: 3, second: { parts: 8, shaded: 5 } }, { colour: 'blue' }),
    { cmd: 'write_text', id: 't', text: 'Which is more?', slot: 'bottom', size: 'm' },
  ] },
  { name: 'Hundred grid', steps: [
    fig('f', 'fraction', { shape: 'grid', rows: 10, cols: 10, shaded: 37, label: true }, { colour: 'green' }),
    { cmd: 'write_math', id: 'm', expr: '0.37', slot: 'bottom_left', size: 'l' },
    { cmd: 'write_math', id: 'm2', expr: 'frac(37,100)', slot: 'bottom_right', size: 'l' },
  ] },
  { name: 'Number line: decimal jumps, the child jumping on', steps: [
    { cmd: 'write_text', id: 't', text: 'Jump in tenths to 0.7', slot: 'top', size: 'm' },
    fig('f', 'numberline', { from: 0, to: 1, divisions: 10, label_as: 'decimal', jumps: [{ from: 0, to: 0.3 }] }, { controls: ['jump'], goal: { kind: 'land_on', value: 0.7 } }),
  ], play: [['f', 'jump', 0.4], ['f', 'jump', 0.5]] },
  { name: 'Number line: quarters, the marker', steps: [
    fig('f', 'numberline', { from: 0, to: 2, divisions: 8, label_as: 'fraction', labels: 'every' }, { controls: ['marker'], goal: { kind: 'marker_at', value: 1.25 }, colour: 'purple' }),
    { cmd: 'write_math', id: 'm', expr: 'frac(5,4)', slot: 'bottom', size: 'l' },
  ], play: [['f', 'marker', 1.25]] },
  { name: 'Place value: 340 512', steps: [
    { cmd: 'write_math', id: 'm', expr: '340512', slot: 'top', size: 'l' },
    fig('f', 'place_value', { value: 340512, columns: 6 }, { colour: 'blue' }),
  ] },
  { name: 'Place value: the child builds 4 052 with counters', steps: [
    { cmd: 'write_text', id: 't', text: 'Make 4052', slot: 'top', size: 'm' },
    fig('f', 'place_value', { value: 0, columns: 4, show: 'counters' }, { controls: ['set'], goal: { kind: 'shows', value: 4052 } }),
  ], play: [['f', 'set', { col: 0, by: 1 }], ['f', 'set', { col: 0, by: 1 }], ['f', 'set', { col: 0, by: 1 }], ['f', 'set', { col: 0, by: 1 }], ['f', 'set', { col: 2, by: 1 }], ['f', 'set', { col: 2, by: 1 }], ['f', 'set', { col: 2, by: 1 }], ['f', 'set', { col: 2, by: 1 }], ['f', 'set', { col: 2, by: 1 }], ['f', 'set', { col: 3, by: 1 }], ['f', 'set', { col: 3, by: 1 }]] },
  { name: 'Angle: 50 degrees with the protractor', steps: [
    fig('f', 'angle', { degrees: 50, show_value: false }, { colour: 'red' }),
    { cmd: 'write_text', id: 't', text: 'Read from the 0 on the fixed arm.', slot: 'bottom', size: 's' },
  ] },
  { name: 'Angle: base left, the child turning arm and protractor', steps: [
    { cmd: 'write_text', id: 't', text: 'Make 120 degrees', slot: 'top', size: 'm' },
    fig('f', 'angle', { degrees: 30, base: 'left', protractor_turn: 20 }, { controls: ['turn', 'protractor'], goal: { kind: 'angle_is', degrees: 120 } }),
  ], play: [['f', 'protractor', 0], ['f', 'turn', 120]] },
  { name: 'Area: a rectangle 5 by 3 with its sides', steps: [
    fig('f', 'area', { width: 5, height: 3, sides: true, unit: 'cm' }, { colour: 'green' }),
    { cmd: 'write_text', id: 't', text: 'Area = ? square cm', slot: 'bottom', size: 'm' },
  ] },
  { name: 'Area: an L shape, the child counting and tracing', steps: [
    fig('f', 'area', { width: 5, height: 4, cut: { w: 2, h: 2 } }, { controls: ['count', 'trace'], goal: { kind: 'count_all' } }),
  ], play: [1, 2, 3, 4, 5, 6].map((k) => ['f', 'count', k]).concat([['f', 'trace', 'h0.0'], ['f', 'trace', 'h0.1'], ['f', 'trace', 'h0.2']]) },
  { name: 'Graph: points, the child placing one', steps: [
    { cmd: 'write_text', id: 't', text: 'Cups of milk each day', slot: 'top', size: 'm' },
    fig('f', 'graph', { x: { from: 0, to: 6, step: 1, name: 'day' }, y: { from: 0, to: 10, step: 2, name: 'cups' }, points: [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6, label: 'A' }], connect: true }, { controls: ['place'], goal: { kind: 'point_at', x: 4, y: 8 } }),
  ], play: [['f', 'place', [4, 8]]] },
  { name: 'Old slots, composed: a shape alone in top_left, then maths beside it next turn', steps: [
    { cmd: 'shape', id: 's', kind: 'circle', parts: 4, shaded: 3, label: false, slot: 'top_left', colour: 'ink' },
  ], later: [{ cmd: 'write_math', id: 'm', expr: 'frac(3,4)', slot: 'top_right', size: 'l' }] },
];

function build(scene, H) {
  const inkOf = (it) => strokesBox(itemStrokes(it, H), 6) || it.rect;
  let b = emptyBoard();
  const turn = (raw) => {
    const v = validateTurn({ steps: raw }, { board: [...composedItems(b, H).values()] });
    if (v.dropped.length) console.warn(scene.name, v.dropped);
    v.steps.forEach((st, i) => {
      b = applyStep(b, st, 0, H, { place: (s) => placeItem([...composedItems(b, H).values()], s, v.steps.slice(i + 1), H, { inkOf }) });
    });
  };
  turn(scene.steps);
  if (scene.later) turn(scene.later);
  for (const [id, c, val] of scene.play || []) b = playFigure(b, id, c, val, 1);
  return b;
}

function Lab() {
  const w = window.innerWidth; const h = window.innerHeight;
  const { wide, side, boardH } = roomShape(w, h);
  const kind = wide ? 'laptop' : 'phone';
  const sheetW = Math.min(wide ? w - side - 88 : w - 48, h - 120);
  const only = new URLSearchParams(location.search).get('only');
  const list = only != null ? [SCENES[Number(only)]] : SCENES;
  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, fontFamily: 'Figtree Variable, sans-serif' }}>
      {list.map((s) => (
        <div key={s.name} style={{ width: sheetW }}>
          <div style={{ fontSize: 13, color: '#5A5A66', margin: '0 0 6px 2px' }}>{s.name} ({kind}, board 1000 x {boardH})</div>
          <div style={{ width: sheetW, aspectRatio: `1000 / ${boardH}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06)' }}>
            <Board board={build(s, boardH)} now={null} H={boardH} />
          </div>
        </div>
      ))}
    </div>
  );
}
// Print is placed from Figtree's widths: draw once the font is in.
document.fonts.load('650 40px "Figtree Variable"').finally(() => createRoot(document.getElementById('root')).render(<Lab />));
