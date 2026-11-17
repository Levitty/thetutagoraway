// Rendering engine phase 2: the Grade 5 figures (src/draw/figures.js, figureDraw.js, observe.js),
// the figure command (commands.js) and the child's play on the board (board.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFigure, FIGURE_TYPES, FIGURE, areaCells, areaEdges, numberline, digitsOf, angleKind } from '../src/draw/figures.js';
import { figureStrokes, playStrokes, figureHits, dragValue, figureBox } from '../src/draw/figureDraw.js';
import { startPlay, act, summarise, figureNotes } from '../src/draw/observe.js';
import { itemStrokes, KINDS } from '../src/draw/strokes.js';
import { naturalMs } from '../src/draw/timing.js';
import { parsePath } from '../src/draw/path.js';
import { validateTurn, partsOf, TURN_SCHEMA } from '../src/voice-tutor/commands.js';
import { emptyBoard, applyStep, playFigure, boardSummary } from '../src/voice-tutor/board.js';
import { turnContext, systemPrompt } from '../src/voice-tutor/prompt.js';
import { CHILD_INK } from '../src/voice-tutor/ink.js';

const ONE = {
  fraction: { params: { parts: 3, shaded: 1, second: { parts: 6 } }, controls: ['shade_second'], goal: { kind: 'match' } },
  numberline: { params: { from: 0, to: 1, divisions: 10, label_as: 'decimal', jumps: [{ from: 0, to: 0.3 }] }, controls: ['jump'], goal: { kind: 'land_on', value: 0.7 } },
  place_value: { params: { value: 0, columns: 6, show: 'counters' }, controls: ['set'], goal: { kind: 'shows', value: 40512 } },
  angle: { params: { degrees: 30, base: 'left', protractor_turn: 20 }, controls: ['turn', 'protractor'], goal: { kind: 'angle_is', degrees: 120 } },
  area: { params: { width: 5, height: 4, cut: { w: 2, h: 2 }, sides: true }, controls: ['count', 'trace'], goal: { kind: 'count_all' } },
  graph: { params: { x: { from: 0, to: 6, step: 1, name: 'day' }, y: { from: 0, to: 10, step: 2 }, points: [{ x: 1, y: 2 }] }, controls: ['place'], goal: { kind: 'point_at', x: 4, y: 8 } },
};
const item = (type, extra = {}) => {
  const r = validateFigure({ type, ...ONE[type], ...extra });
  assert.ok(r.ok, `${type}: ${r.error}`);
  return { cmd: 'figure', id: `f_${type}`, slot: 'middle', colour: 'orange', rect: { x: 16, y: 100, w: 968, h: 600 }, ...r.figure };
};

test('every figure type is checked, drawn in stages, one pen-down a stroke, and gives a note', () => {
  assert.deepEqual(FIGURE_TYPES, ['fraction', 'numberline', 'place_value', 'angle', 'area', 'graph']);
  for (const type of FIGURE_TYPES) {
    const it = item(type);
    const st = itemStrokes(it, 1000);
    assert.ok(st.length > 0, type);
    for (const s of st) {
      assert.ok(KINDS.includes(s.kind), `${type}: ${s.kind}`);
      assert.equal(parsePath(s.d).filter((c) => c.c === 'M').length, 1, `${type}: one pen-down`);
    }
    for (let i = 1; i < st.length; i += 1) assert.ok(st[i].phase >= st[i - 1].phase, `${type}: stages in order`);
    assert.ok(naturalMs(st) < 20000, `${type}: drawn in under 20 s`);
    assert.match(summarise(it, null), /has not touched/);
  }
});

test('figure settings are refused whole when wrong, never repaired', () => {
  const bad = [
    { type: 'fraction', params: { parts: 3, shaded: 4 } },
    { type: 'fraction', params: { parts: 13 } },
    { type: 'fraction', params: { parts: 3 }, goal: { kind: 'match' }, controls: ['shade'] },
    { type: 'numberline', params: { from: 1, to: 0 } },
    { type: 'numberline', params: { from: 0, to: 1, divisions: 3, label_as: 'fraction', marker: 2 } },
    { type: 'numberline', params: { from: 0, to: 1, divisions: 4 }, controls: ['marker'], goal: { kind: 'marker_at', value: 0.3 } },
    { type: 'place_value', params: { value: 12345, columns: 4 } },
    { type: 'angle', params: { degrees: 200 } },
    { type: 'angle', params: { protractor: false }, controls: ['protractor'] },
    { type: 'angle', params: {}, goal: { kind: 'aligned' } },
    { type: 'area', params: { width: 3, height: 3, cut: { w: 3, h: 1 } } },
    { type: 'graph', params: { x: { from: 0, to: 30, step: 1 } } },
    { type: 'graph', params: { points: [{ x: 11, y: 1 }] } },
    { type: 'fraction', params: '{"parts":' },
    { type: 'fraction', params: { parts: 2, colourful: true } },
    { type: 'pie_chart', params: {} },
  ];
  for (const b of bad) assert.equal(validateFigure(b).ok, false, JSON.stringify(b));
});

test('the figure command passes the validator with JSON text, is in the schema, and its parts can be counted', () => {
  const steps = [{ cmd: 'figure', id: 'f1', type: 'fraction', params: '{"parts":4,"shaded":3}', slot: 'middle', on: 'bread' },
    { cmd: 'highlight', target: 'f1', part: 4 }, { cmd: 'highlight', target: 'f1', part: 5 }];
  const v = validateTurn({ steps });
  assert.equal(v.steps.length, 2);
  assert.match(v.dropped[0].reason, /part out of range/);
  assert.deepEqual(v.steps[0].params.parts, 4);
  // The browser checks the server's checked step again: records pass as well as JSON text.
  assert.equal(validateTurn({ steps: [v.steps[0]] }).dropped.length, 0);
  assert.equal(partsOf(item('area')), 16);
  assert.equal(partsOf(item('fraction'), 2), 6);
  const schema = TURN_SCHEMA.properties.steps.items.anyOf.find((x) => x.properties.cmd.const === 'figure');
  assert.deepEqual(schema.properties.type.enum, FIGURE_TYPES);
  assert.equal(validateTurn({ steps: [{ cmd: 'figure', id: 'f2', type: 'angle', params: '{"degrees":500}', slot: 'middle' }] }).steps.length, 0);
});

test('a fraction the child shades: only the parts they were given, the app marks the goal, the note says it plainly', () => {
  const it = item('fraction');
  assert.equal(figureHits(it, null, 1000).length, 6, 'every sixth can be tapped, none of the thirds');
  let p = act(it, null, 'shade', 1);
  assert.equal(p, null, 'not a control the tutor gave');
  p = act(it, null, 'shade_second', 1);
  p = act(it, p, 'shade_second', 2);
  assert.equal(p.met, true);
  assert.equal(p.metAt, 2);
  assert.match(summarise(it, p), /shaded part 1 of the second bar, then shaded part 2 of the second bar/);
  assert.match(summarise(it, p), /the same amount as/);
  assert.match(summarise(it, p), /done, first after 2 moves/);
  p = act(it, p, 'shade_second', 2);
  assert.match(summarise(it, p), /undone since/);
  // Their shading is in their own teal; no tutor colour is used for it.
  assert.ok(playStrokes(it, act(it, null, 'shade_second', 3).state, 1000).every((s) => s.colour === CHILD_INK));
  // The thirds' fraction is written; the sixths' is the child's to say.
  assert.equal(figureStrokes(it, 1000).filter((s) => s.unit.startsWith('m2l')).length, 0);
});

test('a number line: the marker snaps to a tick when dragged, jumps go on from the last landing', () => {
  const it = item('numberline');
  let p = act(it, null, 'jump', 0.4);
  p = act(it, p, 'jump', 0.7);
  assert.equal(p.met, true);
  assert.match(summarise(it, p), /jumped from 0.3 to 0.4, then jumped from 0.4 to 0.7/);
  p = act(it, p, 'jump', 0.7);
  assert.equal(p.state.jumps.length, 1, 'a tap on the landing takes the last jump back');
  assert.equal(act(it, p, 'jump', 0.45), p, 'between ticks is not a jump');
  const m = item('numberline', { params: { from: 0, to: 2, divisions: 8, label_as: 'fraction' }, controls: ['marker'], goal: { kind: 'marker_at', value: 1.25 } });
  const hit = figureHits(m, null, 1000)[0];
  assert.equal(hit.drag, true);
  const v = dragValue(m, 'marker', { x: 16 + 56 + (968 - 112) * 0.63, y: 300 }, null, 1000);
  let q = act(m, null, 'marker', v);
  assert.equal(q.state.marker, 1.25);
  for (const x of [1.2, 1.26, 1.3]) q = act(m, q, 'marker', x);
  assert.match(summarise(m, q), /^The child moved the marker to 5\/4\./, 'a drag is one move');
  assert.equal(numberline.label(m.params, 0.75), '3/4');
  assert.equal(numberline.label(m.params, 1), '1');
});

test('place value, angle, area and graph: the child acts within the rules', () => {
  const pv = item('place_value');
  let p = null;
  for (const [col, n] of [[1, 4], [3, 5], [5, 2], [4, 1]]) for (let k = 0; k < n; k += 1) p = act(pv, p, 'set', { col, by: 1 });
  assert.equal(p.met, true);
  assert.equal(act(pv, p, 'set', { col: 0, by: -1 }), p, 'never below 0');
  assert.deepEqual(digitsOf(340512, 6), [3, 4, 0, 5, 1, 2]);
  assert.match(FIGURE.place_value.describe({ value: 340512, columns: 6, show: 'digits' }, startPlay(item('place_value', { params: { value: 340512, columns: 6 }, controls: [], goal: null })).state), /340 512 as digits: 3 hundred thousands, 4 ten thousands, 0 thousands, 5 hundreds, 1 ten, 2 ones/);

  const an = item('angle');
  p = act(an, null, 'protractor', 2);
  assert.equal(p.state.turn, 0, 'snaps onto the fixed arm');
  p = act(an, p, 'turn', 119.6);
  assert.equal(p.state.degrees, 120);
  assert.equal(p.met, true);
  assert.equal(angleKind(90), 'right');
  assert.equal(angleKind(120), 'obtuse');

  const ar = item('area');
  assert.equal(areaCells(ar.params).length, 16);
  assert.equal(areaEdges(ar.params).length, 18);
  p = null;
  for (let k = 1; k <= 16; k += 1) p = act(ar, p, 'count', k);
  assert.equal(p.met, true);
  assert.match(summarise(ar, p), /area 16 square cm, perimeter 18 cm/);

  const gr = item('graph');
  assert.equal(act(gr, null, 'place', [4, 7]), null, 'off a crossing');
  p = act(gr, null, 'place', [4, 8]);
  assert.equal(p.met, true);
});

test('the board keeps the child\'s play apart from the tutor\'s ink, and the notes go with the next turn', () => {
  let b = emptyBoard();
  const v = validateTurn({ steps: [{ cmd: 'figure', id: 'match', type: 'fraction', params: JSON.stringify(ONE.fraction.params), controls: ['shade_second'], goal: JSON.stringify({ kind: 'match' }), slot: 'middle' }] });
  b = applyStep(b, v.steps[0], 0, 1000, { place: () => ({ x: 16, y: 200, w: 968, h: 380 }) });
  assert.deepEqual(b.items.match.rect, { x: 16, y: 200, w: 968, h: 380 });
  assert.equal(boardSummary(b)[0].rect, undefined, 'frames stay in the page');
  const before = b.items.match;
  b = playFigure(b, 'match', 'shade_second', 1, 5);
  b = playFigure(b, 'match', 'shade_second', 2, 6);
  assert.equal(b.items.match, before, 'the tutor\'s ink is not changed');
  const notes = figureNotes(b);
  assert.equal(notes.length, 1);
  assert.match(notes[0].note, /done/);
  assert.equal(playFigure(b, 'nothing', 'shade', 1), b);
  const ctx = turnContext({ target: 'X', board: boardSummary(b), figures: notes });
  assert.match(ctx, /What the child did with match: The child shaded part 1/);
  assert.match(ctx, /match: a fraction bar at middle, cut into 3 equal parts, 1 of 3 shaded; a second bar, cut into 6 equal parts, none shaded beside it \(the child may: shade_second\)/);
  b = applyStep(b, { cmd: 'clear', scope: 'tutor' }, 9);
  assert.deepEqual(b.play, {});
});

test('the prompt says when to use figures and how to teach with them, and its example passes', () => {
  const p = systemPrompt({});
  assert.match(p, /FIGURES \(figure\)/);
  assert.match(p, /Predict first/);
  assert.match(p, /Never show a figure's answer before the child has given it/);
  const ex = JSON.parse(p.match(/Example: (\{"cmd":"figure".*\})\n/)[1]);
  const v = validateTurn({ steps: [ex] });
  assert.equal(v.dropped.length, 0, JSON.stringify(v.dropped));
  assert.ok(figureBox({ ...v.steps[0], rect: { x: 0, y: 0, w: 1000, h: 400 } }, 2, 2, 1000).w > 0);
});
