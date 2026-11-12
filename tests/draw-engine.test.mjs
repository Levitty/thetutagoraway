// ============================================================================
// THE DRAWING ENGINE (src/draw): every drawn command and mark becomes strokes
// in a teacher's order and direction, handwriting has every glyph it needs,
// strokes take the study's times, and a drawing never runs past the next
// step's word. Also the teaching moves in the commands, the prompt and the
// practice lesson.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GLYPHS, DIGITS, SIGNS, LOWER, UPPER, handwrite, canHandwrite } from '../src/draw/glyphs.js';
import { sample, parsePath, pointAt } from '../src/draw/path.js';
import { itemStrokes, markStrokes, KINDS, PEN } from '../src/draw/strokes.js';
import { layoutStrokes, strokeTimes, strokeMs, SPEED, MIN_MS, MAX_MS, HATCH_EVERY, SLOW, progress } from '../src/draw/timing.js';
import { drawDuration } from '../src/draw/index.js';
import { printWidth, printWords } from '../src/draw/print.js';
import { DRAWN, validateTurn, TURN_SCHEMA } from '../src/voice-tutor/commands.js';
import { buildTimeline } from '../src/voice-tutor/timeline.js';
import { createMockTutor } from '../src/voice-tutor/mockTutor.js';
import { emptyBoard, applyStep, boardSummary } from '../src/voice-tutor/board.js';
import { systemPrompt } from '../src/voice-tutor/prompt.js';

const first = (s) => s.sp.pts[0];
const last = (s) => s.sp.pts[s.sp.pts.length - 1];
const near = (a, b, tol = 1.5) => Math.abs(a - b) <= tol;

// One of each drawn command, as validateTurn leaves it.
const ITEMS = {
  write_text: { cmd: 'write_text', id: 't1', text: 'Mama cuts a cake into 12 equal pieces.', slot: 'top', size: 'm', colour: 'ink' },
  write_math: { cmd: 'write_math', id: 'm1', expr: 'frac(1,3) = frac(?,6)', slot: 'middle', size: 'l', colour: 'ink' },
  fraction_bar: { cmd: 'fraction_bar', id: 'b1', parts: 4, shaded: 2, label: true, slot: 'top', colour: 'blue' },
  shape: { cmd: 'shape', id: 's1', kind: 'circle', parts: 4, shaded: 1, label: true, slot: 'top_left', colour: 'orange' },
  number_line: { cmd: 'number_line', id: 'n1', from: 0, to: 1, divisions: 4, marks: [{ value: 0.75, label: '3/4', style: 'dot' }], jumps: [{ from: 0, to: 0.25 }, { from: 0.25, to: 0.5 }], slot: 'middle' },
  figure: { cmd: 'figure', id: 'f1', type: 'fraction', params: { shape: 'bar', parts: 3, rows: 10, cols: 10, shaded: 1, second: { parts: 6, rows: 10, cols: 10, shaded: 2 }, label: true }, controls: [], goal: null, slot: 'middle', colour: 'orange' },
  plot_points: { cmd: 'plot_points', id: 'p1', x_axis: { from: 0, to: 5, name: 'Day' }, y_axis: { from: 0, to: 5, name: '' }, points: [{ x: 1, y: 1, label: '' }, { x: 2, y: 3, label: 'A' }], connect: true, slot: 'bottom' },
};

test('handwriting has every glyph: digits, signs, small letters and capitals, each pen-down readable and inside its box', () => {
  for (const ch of [...DIGITS, ...SIGNS, ...LOWER, ...UPPER]) {
    const g = GLYPHS[ch];
    assert.ok(g && g.strokes.length >= 1, `glyph ${ch}`);
    for (const d of g.strokes) {
      assert.equal(parsePath(d).filter((c) => c.c === 'M').length, 1, `${ch}: one pen-down per stroke`);
      const s = sample(d, 0.01);
      for (const [x, y] of s.pts) {
        assert.ok(x >= -0.06 && x <= g.w + 0.06, `${ch} x ${x} outside 0..${g.w}`);
        assert.ok(y >= -0.08 && y <= 1.4, `${ch} y ${y} outside the line`);
      }
    }
  }
  assert.ok(canHandwrite('3/4') && canHandwrite('half') && canHandwrite('Day 1'));
  assert.equal(canHandwrite('50%'), false);
});

test('digits are formed the way children are taught', () => {
  const s0 = sample(GLYPHS[0].strokes[0], 0.01);
  assert.ok(near(s0.pts[0][1], 0, 0.01), '0 starts at the top');
  assert.ok(pointAt(s0, 0.1)[0] < s0.pts[0][0], '0 goes round anticlockwise (to the left first)');
  const one = sample(GLYPHS[1].strokes[0], 0.01);
  assert.ok(near(one.pts[one.pts.length - 1][1], 1, 0.01), '1 ends at the bottom of its stroke down');
  assert.equal(GLYPHS[4].strokes.length, 2, '4: down and across, then the stick');
  assert.ok(sample(GLYPHS[4].strokes[1], 0.01).pts[0][1] < 0.1, "4's stick is drawn from the top down");
  assert.equal(GLYPHS[5].strokes.length, 2, '5: down and round, then the hat');
  assert.ok(near(sample(GLYPHS[7].strokes[0], 0.01).pts[0][0], 0, 0.01), '7 starts at the top left');
  const nine = sample(GLYPHS[9].strokes[0], 0.01);
  assert.ok(nine.pts[nine.pts.length - 1][1] > 0.95, '9 is a ball, then its stick down');
  // Letters with a cross or a dot get it last.
  for (const ch of 'ftij') { const st = GLYPHS[ch].strokes; assert.ok(sample(st[st.length - 1], 0.01).len < sample(st[0], 0.01).len, `${ch} cross or dot last`); }
  // handwriting runs left to right, each letter after the one before.
  const hw = handwrite('12', 0, 0, 50);
  assert.ok(sample(hw[hw.length - 1].d).pts[0][0] > sample(hw[0].d).pts[0][0]);
});

test('every drawn command becomes strokes, each one pen-down with a length and a known kind', () => {
  assert.deepEqual(Object.keys(ITEMS).sort(), [...DRAWN].sort());
  for (const [cmd, item] of Object.entries(ITEMS)) {
    const st = itemStrokes(item, 640);
    assert.ok(st.length > 0, cmd);
    for (const s of st) {
      assert.ok(KINDS.includes(s.kind), `${cmd}: kind ${s.kind}`);
      assert.ok(s.len > 0, `${cmd}: length`);
      assert.equal(parsePath(s.d).filter((c) => c.c === 'M').length, 1, `${cmd}: one pen-down`);
    }
    // Stages come in order: outline, cuts, shading, label ...
    for (let i = 1; i < st.length; i += 1) assert.ok(st[i].phase >= st[i - 1].phase, `${cmd}: stages in order`);
    // Same answer every time: strokes are made once from the item alone.
    assert.deepEqual(itemStrokes(item, 640).map((s) => s.d), st.map((s) => s.d));
  }
});

test('a circle is drawn from the top, clockwise, then cut top to bottom and left to right, then shaded inside its part', () => {
  const st = itemStrokes({ ...ITEMS.shape, label: false }, 640);
  const [outline, cut1, cut2] = st;
  assert.equal(outline.kind, 'line');
  assert.ok(first(outline)[1] < Math.min(...outline.sp.pts.map((p) => p[1])) + 1, 'starts at the top');
  assert.ok(pointAt(outline.sp, 0.05)[0] > first(outline)[0], 'goes clockwise (to the right first)');
  assert.ok(near(first(cut1)[0], last(cut1)[0]) && first(cut1)[1] < last(cut1)[1], 'first cut: top to bottom');
  assert.ok(near(first(cut2)[1], last(cut2)[1]) && first(cut2)[0] < last(cut2)[0], 'second cut: left to right');
  const hatch = st.filter((s) => s.kind === 'hatch');
  assert.ok(hatch.length >= 5, 'close shading strokes');
  for (const h of hatch) {
    assert.equal(h.clip.id, 's1-p1');
    assert.ok(first(h)[0] < last(h)[0] && first(h)[1] > last(h)[1], 'lower left to upper right');
    assert.equal(h.width, PEN.hatch);
  }
});

test('a fraction bar: the outline from its top-left corner, the cuts left to right, shading part by part, then its fraction', () => {
  const st = itemStrokes(ITEMS.fraction_bar, 640);
  const o = st[0];
  assert.equal(o.kind, 'line');
  assert.ok(pointAt(o.sp, 0.1)[0] > first(o)[0] && near(pointAt(o.sp, 0.1)[1], first(o)[1]), 'along the top first');
  const cuts = st.filter((s) => s.phase === 1);
  assert.equal(cuts.length, 3);
  for (let i = 1; i < cuts.length; i += 1) assert.ok(first(cuts[i])[0] > first(cuts[i - 1])[0]);
  assert.deepEqual([...new Set(st.filter((s) => s.kind === 'hatch').map((s) => s.clip.id))], ['b1-b0p1', 'b1-b0p2']);
  // The fraction 2/4 beside it: the top number, then the bar, then the bottom number.
  const label = st.filter((s) => s.phase === 3);
  const ys = label.map((s) => s.sp.pts.reduce((a, p) => a + p[1], 0) / s.sp.pts.length);
  assert.ok(ys[0] < ys[1] && ys[1] < ys[ys.length - 1]);
});

test('maths is written left to right; a fraction is its top number, then the bar, then its bottom number', () => {
  const st = itemStrokes({ ...ITEMS.write_math, expr: 'frac(3,4)' }, 640);
  assert.equal(st.length, 4);   // 3 is one stroke, the bar, 4 is two strokes
  assert.ok(Math.max(...st[0].sp.pts.map((p) => p[1])) < first(st[1])[1], '3 above the bar');
  assert.ok(near(first(st[1])[1], last(st[1])[1]) && first(st[1])[0] < last(st[1])[0], 'the bar, left to right');
  assert.ok(Math.min(...st[2].sp.pts.map((p) => p[1])) > first(st[1])[1], '4 below the bar');
  const eq = itemStrokes(ITEMS.write_math, 640);
  assert.ok(eq.some((s) => s.dash), 'the missing number is a dashed box');
  const xs = eq.map((s) => Math.min(...s.sp.pts.map((p) => p[0])));
  assert.ok(xs[xs.length - 1] > xs[0]);
});

test('short labels are handwritten; longer text is Figtree print, word by word, left to right', () => {
  const short = itemStrokes({ ...ITEMS.write_text, text: '3 quarters' }, 640);
  assert.ok(short.every((s) => s.kind === 'write' && !s.print));
  const long = itemStrokes(ITEMS.write_text, 640);
  assert.equal(long.length, 8);
  assert.ok(long.every((s) => s.print));
  for (let i = 1; i < long.length; i += 1) assert.ok(long[i].print.x > long[i - 1].print.x1);
  assert.deepEqual(long.map((s) => s.print.text).join(' '), ITEMS.write_text.text);
  assert.ok(printWidth('Mama', 42) > printWidth('ma', 42));
  assert.equal(printWords('a  b', 0, 10).length, 2);
});

test('a number line: the line left to right, its ticks, its numbers, then the jumps', () => {
  const st = itemStrokes(ITEMS.number_line, 640);
  assert.ok(first(st[0])[0] < last(st[0])[0]);
  assert.equal(st.filter((s) => s.phase === 1).length, 5);
  assert.ok(st.filter((s) => s.phase === 2).every((s) => s.kind === 'write'));
  const jumps = st.filter((s) => s.kind === 'jump');
  assert.equal(jumps.length, 4);   // two arcs, each with its arrow head
  assert.ok(jumps.every((s) => s.colour === '#E08200'));
  assert.ok(st.findIndex((s) => s.kind === 'jump') > st.findIndex((s) => s.phase === 2));
});

test('the marks: a ring, a box, a highlighter, an underline and a drawn arrow', () => {
  const bar = { ...ITEMS.fraction_bar };
  const ring = markStrokes({ cmd: 'highlight', target: 'b1', part: 2, style: 'circle' }, bar, 640);
  assert.equal(ring.length, 1);
  assert.ok(ring[0].kind === 'mark' && ring[0].colour === '#D2383A');
  assert.equal(markStrokes({ cmd: 'highlight', target: 'b1', part: 2, style: 'box' }, bar, 640).length, 1);
  const glow = markStrokes({ cmd: 'highlight', target: 'b1', style: 'glow' }, bar, 640);
  assert.ok(glow.length >= 2 && glow.every((s) => s.highlighter && !s.cap));
  assert.equal(markStrokes({ cmd: 'underline', target: 'm1' }, ITEMS.write_math, 640).length, 1);
  const arrow = markStrokes({ cmd: 'point', target: 'b1', part: 3 }, bar, 640);
  assert.equal(arrow.length, 2);
  assert.ok(first(arrow[0])[0] > last(arrow[0])[0], 'the arrow is drawn towards its target');
});

test('timing: the study speeds, close shading, lifts between strokes, and slow pace', () => {
  const line = { kind: 'line', len: 310, sp: sample('M 0 0 L 310 0') };
  assert.equal(strokeMs(line), (310 / SPEED.line) * 1000);
  assert.equal(SPEED.line, 620); assert.equal(SPEED.write, 330); assert.equal(SPEED.hatch, 2600); assert.equal(SPEED.jump, 520);
  assert.equal(strokeMs({ kind: 'hatch', len: 10 }), MIN_MS);
  assert.equal(strokeMs({ kind: 'line', len: 99999 }), MAX_MS);
  const st = itemStrokes(ITEMS.shape, 640);
  const { times, total } = layoutStrokes(st);
  for (let i = 1; i < st.length; i += 1) {
    assert.ok(times[i].t0 >= times[i - 1].t0, 'in order');
    if (st[i].kind === 'hatch' && st[i - 1].kind === 'hatch') assert.ok(near(times[i].t0 - times[i - 1].t0, HATCH_EVERY, 0.01), 'shading every 45 ms');
    else assert.ok(times[i].t0 > Math.max(...times.slice(0, i).map((t) => t.t1)), 'the pen lifts before the next stroke');
  }
  const slow = layoutStrokes(st, { pace: 'slow' });
  assert.ok(near(slow.total, total * SLOW, 0.5));
  // Squeezed to fit: same order, ends exactly then.
  const fit = strokeTimes(st, { at: 1000, fit: total / 2 });
  assert.ok(near(Math.max(...fit.times.map((t) => t.t1)), 1000 + total / 2, 0.5));
  assert.equal(progress(fit.times[0], 999), 0);
  assert.equal(progress(fit.times[0], 1e9), 1);
});

test('the timeline uses the engine’s times, and a drawing never runs past the next step’s word', () => {
  const fixed = (text) => { const words = text.split(/\s+/).map((word, i) => ({ word, start: i * 400, end: i * 400 + 380 })); return { words, duration: words.length * 400 }; };
  const steps = [
    { cmd: 'say', text: 'Here is a bar cut into four, and now look closely.' },
    { cmd: 'fraction_bar', id: 'b', parts: 4, shaded: 2, label: true, slot: 'top', on: 'bar' },
    { cmd: 'highlight', target: 'b', part: 2, style: 'circle', on: 'look' },
    { cmd: 'write_math', id: 'm', expr: 'frac(1,2)', slot: 'middle', pace: 'slow' },
    { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 },
  ];
  const tl = buildTimeline(steps, { speech: fixed, drawMs: (s) => drawDuration(s, 640) });
  const ev = Object.fromEntries(tl.events.map((e) => [steps[e.i].cmd, e]));
  assert.equal(ev.fraction_bar.natural, drawDuration(steps[1], 640));
  assert.ok(ev.fraction_bar.squeezed);
  assert.equal(ev.fraction_bar.t + ev.fraction_bar.dur, ev.highlight.t);
  assert.ok(!ev.write_math.squeezed);
  assert.ok(near(drawDuration(steps[3], 640), drawDuration({ ...steps[3], pace: undefined }, 640) * SLOW, 1));
});

test("pace 'slow' is the one new field: on drawn steps only, in the validator and the schema", () => {
  const v = validateTurn({ steps: [{ cmd: 'fraction_bar', id: 'b', parts: 4, shaded: 1, slot: 'top', pace: 'slow' }] });
  assert.equal(v.steps[0].pace, 'slow');
  assert.match(validateTurn({ steps: [{ cmd: 'fraction_bar', id: 'b', parts: 4, shaded: 1, slot: 'top', pace: 'fast' }] }).dropped[0].reason, /pace/);
  assert.match(validateTurn({ steps: [{ cmd: 'say', text: 'Hi.' }, { cmd: 'clear', pace: 'slow' }] }).dropped[0].reason, /extra field pace/);
  for (const sch of TURN_SCHEMA.properties.steps.items.anyOf) {
    const cmd = sch.properties.cmd.const;
    assert.equal('pace' in sch.properties, DRAWN.includes(cmd), cmd);
  }
});

// The practice lesson, played through with a child who answers right.
async function lesson(answers) {
  const tutor = createMockTutor();
  let board = emptyBoard();
  const turns = [];
  for (const [msg, ask] of answers) {
    const r = await tutor.turn({ message: msg || '', answer: ask ? { seal: `mock:${ask}`, response: msg } : null, board: boardSummary(board) });
    turns.push(r.steps);
    r.steps.forEach((s, i) => { board = applyStep(board, s, i); });
  }
  return turns;
}

test('the practice lesson counts with the child, draws the answer only after it, and goes slowly at the key idea', async () => {
  const [open, teach] = await lesson([[null], ['3/4', 'w1'], ['The bottom doubled and the top doubled']]);
  // Count together: one ring per spoken number, on that number, and the child says the total.
  const rings = open.filter((s) => s.cmd === 'highlight');
  assert.deepEqual(rings.map((s) => [s.part, s.on]), [[1, 'One'], [2, 'Two']]);
  const eaten = open.find((s) => s.id === 'eaten');
  assert.ok(rings.length < eaten.shaded, 'HOREB does not count them all');
  assert.equal(open[open.length - 1].cmd, 'pause_for_child');
  assert.ok(!open.some((s) => s.cmd === 'write_math' || s.cmd === 'write_text'), 'no answer on the board before the child answers');
  // After the answer: the last ring, and 3/4 written.
  assert.ok(teach.some((s) => s.cmd === 'highlight' && s.part === 3));
  assert.ok(teach.some((s) => s.cmd === 'write_math' && s.expr === 'frac(3,4)'));
  // The key idea, slowly.
  assert.equal(teach.find((s) => s.id === 'quarters').pace, 'slow');
});

test('no drawing in the practice lesson is hurried by more than a tenth, on a laptop or an upright phone', async () => {
  const paths = [
    [[null], ['3/4', 'w1'], ['The bottom doubled'], ['2', 'g1'], ['9', 'i1']],
    [[null], ['1/4', 'w1'], ['no idea'], ['4', 'g1'], ['6', 'p1'], ['3', 'g2'], ['11', 'i1']],
  ];
  for (const path of paths) {
    for (const steps of await lesson(path)) {
      for (const H of [640, 1000]) {
        const tl = buildTimeline(steps, { drawMs: (s) => drawDuration(s, H) });
        for (const e of tl.events) if (e.natural) assert.ok(e.dur >= e.natural * 0.9, `${steps[e.i].id || steps[e.i].cmd} at ${H}: ${e.dur} of ${e.natural} ms`);
      }
    }
  }
});

test('the prompt teaches the moves, and its example turn passes the validator and uses them', () => {
  const p = systemPrompt({});
  assert.match(p, /Count with the child/);
  assert.match(p, /Ask before you show/);
  assert.match(p, /pace "slow"/);
  const ex = JSON.parse(p.match(/\{"steps":.*\}\]\}/)[0]);
  const v = validateTurn(ex);
  assert.equal(v.dropped.length, 0, JSON.stringify(v.dropped));
  assert.ok(v.steps.some((s) => s.pace === 'slow'));
  assert.deepEqual(v.steps.filter((s) => s.cmd === 'highlight').map((s) => s.on), ['One', 'Two']);
});

test('one accent per scene: ink stays ink, the first colour is the accent, and every later colour and mark is drawn in it', async () => {
  const { sceneAccent, withAccent, DEFAULT_ACCENT } = await import('../src/draw/accent.js');
  const { PALETTE } = await import('../src/voice-tutor/commands.js');
  let b = emptyBoard();
  assert.equal(sceneAccent(b), DEFAULT_ACCENT, 'no colour yet: orange');
  b = applyStep(b, { cmd: 'write_math', id: 'm', expr: 'frac(1,2)', slot: 'top_left', colour: 'ink' }, 0);
  assert.equal(sceneAccent(b), DEFAULT_ACCENT, 'ink is not an accent');
  b = applyStep(b, { cmd: 'fraction_bar', id: 'a', parts: 2, shaded: 1, label: true, slot: 'top_right' }, 1);   // blue by default
  b = applyStep(b, { cmd: 'shape', id: 's', kind: 'circle', parts: 4, shaded: 1, slot: 'middle', colour: 'green' }, 2);
  const accent = sceneAccent(b);
  assert.equal(accent, PALETTE.blue, 'the first colour used');
  const used = new Set();
  for (const it of [b.items.m, b.items.a, b.items.s]) for (const s of withAccent(itemStrokes(it, 640), accent)) used.add(s.colour);
  for (const m of [{ cmd: 'highlight', target: 's', part: 1, style: 'circle' }, { cmd: 'highlight', target: 'a', style: 'glow' }, { cmd: 'underline', target: 'm' }, { cmd: 'point', target: 'a' }]) {
    for (const s of withAccent(markStrokes(m, b.items[m.target], 640), accent)) used.add(s.colour);
  }
  for (const s of withAccent(itemStrokes(ITEMS.number_line, 640), accent)) used.add(s.colour);   // jumps and marks too
  assert.deepEqual([...used].sort(), [PALETTE.ink, PALETTE.blue].sort());
  // A clear starts a new scene.
  b = applyStep(b, { cmd: 'clear' }, 3);
  b = applyStep(b, { cmd: 'shape', id: 't', kind: 'square', parts: 2, shaded: 1, slot: 'top', colour: 'purple' }, 4);
  assert.equal(sceneAccent(b), PALETTE.purple);
});

test('the practice lesson and the prompt example keep to ink and one colour per scene', async () => {
  const { itemColour } = await import('../src/draw/accent.js');
  const paths = [
    [[null], ['3/4', 'w1'], ['The bottom doubled'], ['2', 'g1'], ['9', 'i1']],
    [[null], ['1/4', 'w1'], ['no idea'], ['4', 'g1'], ['6', 'p1'], ['3', 'g2'], ['11', 'i1']],
  ];
  const ex = JSON.parse(systemPrompt({}).match(/\{"steps":.*\}\]\}/)[0]).steps;
  for (const turns of [...await Promise.all(paths.map(lesson)), [ex]]) {
    let scene = new Set();
    for (const steps of turns) {
      for (const s of steps) {
        if (s.cmd === 'clear') scene = new Set();
        const c = itemColour(s);
        if (DRAWN.includes(s.cmd) && c && c !== 'ink') scene.add(c);
        assert.ok(scene.size <= 1, `two colours in one scene: ${[...scene]}`);
      }
    }
  }
});
