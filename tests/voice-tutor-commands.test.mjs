// ============================================================================
// THE BOARD COMMAND LIST: every command passes when right, and bad input is
// dropped (and logged), never drawn. src/voice-tutor/commands.js runs on the
// server before a turn leaves and in the browser before anything is drawn.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTurn, turnProblems, COMMANDS, TURN_SCHEMA, MAX_BOARD_ITEMS, resolveSlot, cleanText } from '../src/voice-tutor/commands.js';
import { parseMath, layoutMath, mathToText } from '../src/voice-tutor/mathExpr.js';
import { emptyBoard, applyStep, boardSummary } from '../src/voice-tutor/board.js';

const EQ = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const ADD = `${EQ}.M_EQUIV_ADDITIVE`;
const one = (step, opts = {}) => validateTurn({ steps: [step] }, opts);
const ok = (step, opts) => { const v = one(step, opts); assert.equal(v.dropped.length, 0, JSON.stringify(v.dropped)); return v.steps[0]; };
const no = (step, opts, why) => { const v = one(step, opts); assert.equal(v.steps.length, 0, `should drop: ${JSON.stringify(step)}`); if (why) assert.match(v.dropped[0].reason, why); return v.dropped[0]; };
const onBoard = [
  { id: 'bar1', cmd: 'fraction_bar', parts: 4, shaded: 3, slot: 'top' },
  { id: 'bar2', cmd: 'fraction_bar', parts: 3, shaded: 1, second_bar: { parts: 6, shaded: 2 }, slot: 'middle_left' },
  { id: 'm1', cmd: 'write_math', expr: 'frac(3,4)', slot: 'middle_right' },
  { id: 'nl', cmd: 'number_line', from: 0, to: 1, divisions: 4, marks: [{ value: 0.75, label: '3/4', style: 'dot' }], jumps: [], slot: 'bottom_left' },
];

// One good example of each of the 17 commands.
const GOOD = {
  say: { cmd: 'say', text: 'Here is a chapati cut into four equal pieces.' },
  write_text: { cmd: 'write_text', id: 't1', text: 'Mama cuts a cake.', slot: 'bottom_right', size: 'm', colour: 'green', on: 'chapati', delay_ms: 200 },
  write_math: { cmd: 'write_math', id: 'm2', expr: 'frac(1,2) = frac(2×1, 2×2)', slot: 'bottom_right' },
  fraction_bar: { cmd: 'fraction_bar', id: 'b9', parts: 6, shaded: [1, 3], second_bar: { parts: 3, shaded: 1 }, label: true, slot: 'bottom_right' },
  number_line: { cmd: 'number_line', id: 'n9', from: 0, to: 2, divisions: 4, marks: [{ value: 0.5, label: 'half', style: 'arrow' }], jumps: [{ from: 0, to: 0.5 }], slot: 'bottom_right' },
  shape: { cmd: 'shape', id: 's9', kind: 'circle', parts: 8, shaded: 3, label: true, slot: 'bottom_right' },
  plot_points: { cmd: 'plot_points', id: 'p9', x_axis: { from: 0, to: 10, name: 'Day' }, y_axis: { from: 0, to: 20 }, points: [{ x: 1, y: 2 }, { x: 2, y: 4 }], connect: true, slot: 'bottom_right' },
  highlight: { cmd: 'highlight', target: 'bar1', part: 3, style: 'glow', on: 'three' },
  underline: { cmd: 'underline', target: 'm1', range: [0, 4] },
  point: { cmd: 'point', target: 'bar2', bar: 2, part: 6 },
  erase: { cmd: 'erase', targets: ['bar1', 'm1'] },
  clear: { cmd: 'clear' },
  ask: { cmd: 'ask', id: 'q1', prompt: 'One third is how many sixths?', form: 'number', expected: '2', wrong: [{ answer: '4', misconception: ADD }] },
  set_phase: { cmd: 'set_phase', phase: 'teach' },
  record_diagnosis: { cmd: 'record_diagnosis', skill: EQ, misconception: ADD, confidence: 'high', evidence: 'Wrote 4 for 1/3 = ?/6 and 6 for 2/4 = ?/8.', next: 'reteach' },
  pause_for_child: { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 },
  end_session: { cmd: 'end_session', summary: 'Worked on equivalent fractions.' },
};

test('the list has exactly the 17 approved commands, and each one passes when right', () => {
  assert.equal(COMMANDS.length, 17);
  assert.deepEqual(Object.keys(GOOD).sort(), [...COMMANDS].sort());
  for (const s of Object.values(GOOD)) ok(s, { board: onBoard, allowedMis: [ADD], skills: [EQ] });
});

test('the schema the model fills names every command, and closes every object', () => {
  const names = TURN_SCHEMA.properties.steps.items.anyOf.map((x) => x.properties.cmd.const);
  assert.deepEqual(names.sort(), [...COMMANDS].sort());
  const walk = (o) => { if (o && typeof o === 'object') { if (o.type === 'object') assert.equal(o.additionalProperties, false); Object.values(o).forEach(walk); } };
  walk(TURN_SCHEMA);
  // Structured outputs do not take ranges or lengths; they live in the validator.
  assert.doesNotMatch(JSON.stringify(TURN_SCHEMA), /minimum|maximum|maxLength|minLength/);
});

test('unknown commands, extra fields and wrong types are dropped', () => {
  no({ cmd: 'run_js', code: 'alert(1)' }, {}, /unknown command/);
  no({ cmd: 'say', text: 'Hi', html: '<b>x</b>' }, {}, /extra field html/);
  no({ cmd: 'say', text: 42 }, {}, /not text/);
  no({ cmd: 'fraction_bar', id: 'b', parts: '4', shaded: 1, slot: 'top' }, {}, /parts/);
  no({ cmd: 'shape', id: 's', kind: 'hexagon', parts: 4, shaded: 1, slot: 'top' }, {}, /kind/);
  no({ cmd: 'write_text', id: 'w', text: 'Hi', slot: 'corner' }, {}, /slot/);
  no({ cmd: 'say' }, {}, /missing text/);
  no(null, {}, /not an object/);
  no({ cmd: 'write_text', id: 'Bad Id!', text: 'Hi', slot: 'top' }, {}, /bad id/);
  no({ cmd: 'say', text: 'x' + 'a'.repeat(220) }, {}, /longer than 220/);
  no({ cmd: 'say', text: 'One. Two. Three. Four.' }, {}, /three sentences/);
});

test('values out of range are dropped', () => {
  no({ cmd: 'fraction_bar', id: 'b', parts: 13, shaded: 1, slot: 'top' }, {}, /1 to 12/);
  no({ cmd: 'fraction_bar', id: 'b', parts: 4, shaded: 5, slot: 'top' }, {}, /count out of range/);
  no({ cmd: 'fraction_bar', id: 'b', parts: 4, shaded: [0, 2], slot: 'top' }, {}, /part out of range/);
  no({ cmd: 'fraction_bar', id: 'b', parts: 4, shaded: [2, 2], slot: 'top' }, {}, /twice/);
  no({ cmd: 'shape', id: 's', kind: 'circle', parts: 1, shaded: 0, slot: 'top' }, {}, /2 to 12/);
  no({ cmd: 'number_line', id: 'n', from: 0, to: 13, divisions: 2, slot: 'top' }, {}, /0 to 12/);
  no({ cmd: 'number_line', id: 'n', from: 3, to: 1, divisions: 2, slot: 'top' }, {}, /from < to/);
  no({ cmd: 'number_line', id: 'n', from: 0, to: 12, divisions: 12, slot: 'top' }, {}, /too many ticks/);
  no({ cmd: 'number_line', id: 'n', from: 0, to: 1, divisions: 2, marks: [{ value: 2 }], slot: 'top' }, {}, /off the line/);
  no({ cmd: 'number_line', id: 'n', from: 0, to: 1, divisions: 2, marks: Array(9).fill({ value: 0 }), slot: 'top' }, {}, /8 marks/);
  no({ cmd: 'plot_points', id: 'p', x_axis: { from: 0, to: 30 }, y_axis: { from: 0, to: 5 }, points: [{ x: 1, y: 1 }], slot: 'top' }, {}, /20 whole steps/);
  no({ cmd: 'plot_points', id: 'p', x_axis: { from: 0, to: 5 }, y_axis: { from: 0, to: 5 }, points: Array(13).fill({ x: 1, y: 1 }), slot: 'top' }, {}, /1 to 12 points/);
  no({ cmd: 'pause_for_child', expect: 'typed', max_wait_s: 90 }, {}, /5 to 60/);
  no({ ...GOOD.write_text, delay_ms: 5000 }, {}, /delay_ms/);
  no({ cmd: 'ask', id: 'q', prompt: 'Pick', form: 'choice', choices: ['a', 'b', 'c', 'd', 'e'], expected: 'a' }, {}, /2 to 4/);
  no({ cmd: 'ask', id: 'q', prompt: 'Pick', form: 'choice', choices: ['a', 'b'], expected: 'c' }, {}, /not one of the choices/);
});

test('maths: our grammar only, never LaTeX or markup', () => {
  for (const e of ['3/4', 'frac(3,4) = frac(?,12)', 'mixed(1,3,4) + frac(1,4)', '2^3 × (4 + 1)', 'frac(2×3, 4×3) < 1']) assert.equal(parseMath(e).ok, true, e);
  for (const e of ['\\frac{3}{4}', '<script>', 'frac(3)', 'frac(1,2', 'mixed(1,frac(1,2),3)', 'x = y + z', '', 'frac(frac(frac(frac(1,2),2),2),2)']) assert.equal(parseMath(e).ok, false, e);
  no({ cmd: 'write_math', id: 'm', expr: '\\frac{3}{4}', slot: 'top' }, {}, /LaTeX/);
  no({ cmd: 'write_math', id: 'm', expr: '1+'.repeat(41), slot: 'top' }, {}, /too long/);
  const t = parseMath('frac(1,2) = frac(?,4)').tree;
  assert.equal(mathToText(t), '1/2 = ?/4');
  const l = layoutMath(t);
  assert.ok(l.box.w > 0 && l.box.a > 0 && l.box.d > 0);
});

test('markup is stripped and characters outside the whitelist are removed, and logged', () => {
  assert.equal(cleanText('<b>Hello</b> there').text, 'Hello there');
  const c = cleanText('Well done 🎉 — great');
  assert.equal(c.text, 'Well done , great');
  assert.ok(c.removed >= 1);
  const v = one({ cmd: 'say', text: 'Well done 🎉' });
  assert.equal(v.steps[0].text, 'Well done');
  assert.match(v.notes[0], /removed/);
});

test('ids must exist before they are pointed at, and a new id must be new', () => {
  no({ cmd: 'highlight', target: 'ghost' }, { board: onBoard }, /not on the board/);
  no({ cmd: 'erase', targets: ['ghost'] }, { board: onBoard }, /not on the board/);
  no({ cmd: 'fraction_bar', id: 'bar1', parts: 2, shaded: 1, slot: 'bottom_right' }, { board: onBoard }, /already on the board/);
  no({ cmd: 'highlight', target: 'bar1', part: 5 }, { board: onBoard }, /part out of range/);
  no({ cmd: 'point', target: 'bar1', bar: 2 }, { board: onBoard }, /second bar/);
  no({ cmd: 'underline', target: 'bar1' }, { board: onBoard }, /text or maths/);
  no({ cmd: 'underline', target: 'm1', range: [0, 99] }, { board: onBoard }, /out of bounds/);
  // Within a turn: drawn first, then pointed at, is fine; the other way round is not.
  const v = validateTurn({ steps: [{ cmd: 'highlight', target: 'x' }, { cmd: 'write_text', id: 'x', text: 'hi', slot: 'top' }, { cmd: 'highlight', target: 'x' }] });
  assert.deepEqual(v.steps.map((s) => s.cmd), ['write_text', 'highlight']);
  assert.equal(v.dropped[0].index, 0);
});

test('misconceptions must be on the allowed list for the skill, or "other"', () => {
  const opts = { allowedMis: [ADD], skills: [EQ] };
  no({ ...GOOD.record_diagnosis, misconception: `${EQ}.M_MADE_UP` }, opts, /not on the allowed list/);
  no({ ...GOOD.record_diagnosis, skill: 'MATH.G5.NUMBER.DECIMALS.DEC_COMPARE' }, opts, /not a lesson skill/);
  ok({ ...GOOD.record_diagnosis, misconception: 'other' }, opts);
  no({ ...GOOD.record_diagnosis, evidence: '' }, opts, /empty/);
  no({ ...GOOD.ask, wrong: [{ answer: '4', misconception: 'M_WHATEVER' }] }, opts, /allowed list/);
});

test('slots stop overlap: a taken slot moves to a free one, a full board refuses', () => {
  const v = validateTurn({ steps: [
    { cmd: 'write_text', id: 'a', text: 'a', slot: 'top' },
    { cmd: 'write_text', id: 'b', text: 'b', slot: 'top' },
    { cmd: 'write_text', id: 'c', text: 'c', slot: 'top_left' },
  ] });
  assert.deepEqual(v.steps.map((s) => s.slot), ['top', 'middle', 'bottom_left']);
  assert.equal(resolveSlot(new Set(['top_left', 'top_right', 'middle_left', 'middle_right', 'bottom_left', 'bottom_right']), 'top'), null);
  const full = validateTurn({ steps: ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id) => ({ cmd: 'write_text', id, text: id, slot: 'top_left' })) });
  assert.equal(full.steps.length, 6);
  assert.match(full.dropped[0].reason, /no free slot/);
  // 30 items at most, whatever the slots.
  const many = Array.from({ length: MAX_BOARD_ITEMS }, (_, k) => ({ id: `i${k}`, cmd: 'write_text', text: 'x' }));
  no({ cmd: 'write_text', id: 'z', text: 'z', slot: 'top' }, { board: many }, /board is full/);
});

test('a turn: at most 12 steps, one question, and nothing after it is handed to the child', () => {
  const says = Array.from({ length: 14 }, (_, k) => ({ cmd: 'say', text: `Line ${k}.` }));
  const v = validateTurn({ steps: says });
  assert.equal(v.steps.length, 12);
  assert.equal(v.dropped.length, 2);
  const w = validateTurn({ steps: [GOOD.say, GOOD.pause_for_child, GOOD.say] });
  assert.equal(w.steps.length, 2);
  assert.match(w.dropped[0].reason, /handed to the child/);
  const two = validateTurn({ steps: [GOOD.ask, { ...GOOD.ask, id: 'q2' }] });
  assert.match(two.dropped[0].reason, /one question/);
  assert.deepEqual(turnProblems([GOOD.say]), ['the turn does not end with pause_for_child or end_session']);
  assert.deepEqual(turnProblems([GOOD.pause_for_child]), ['the turn says nothing']);
  assert.deepEqual(turnProblems([GOOD.say, GOOD.pause_for_child]), []);
  assert.equal(validateTurn({ nope: 1 }).dropped[0].reason, 'the turn has no list of steps');
});

test('the browser checks the public half of a question: no answer, and a seal is not a field', () => {
  const pub = { cmd: 'ask', id: 'q1', prompt: 'One third is how many sixths?', form: 'number' };
  no(pub, {}, /expected answer missing/);
  ok(pub, { publicAsk: true });
});

test('the board: clear wipes tutor ink only, after a snapshot; the child\'s ink is never touched', () => {
  let b = emptyBoard();
  b = { ...b, childInk: [{ stroke: [[1, 2], [3, 4]] }] };
  b = applyStep(b, { cmd: 'fraction_bar', id: 'bar1', parts: 4, shaded: 1, slot: 'top' }, 100);
  b = applyStep(b, { cmd: 'highlight', target: 'bar1', part: 1, style: 'glow' }, 200);
  b = applyStep(b, { cmd: 'point', target: 'bar1' }, 300);
  b = applyStep(b, { cmd: 'clear', scope: 'tutor' }, 400);
  assert.equal(b.order.length, 0);
  assert.equal(b.marks.length, 0);
  assert.equal(b.pointer, null);
  assert.equal(b.snapshots.length, 1);
  assert.deepEqual(b.childInk, [{ stroke: [[1, 2], [3, 4]] }]);
  // The browser's board refuses what is not there, and logs it.
  b = applyStep(b, { cmd: 'highlight', target: 'bar1' }, 500);
  assert.match(b.log[0].reason, /not on the board/);
  // An ask on the board never carries the hidden answer.
  b = applyStep(b, { ...GOOD.ask }, 600);
  assert.equal(b.ask.expected, undefined);
  assert.equal(b.ask.wrong, undefined);
  assert.deepEqual(boardSummary(applyStep(emptyBoard(), GOOD.shape, 1)).map((x) => x.id), ['s9']);
});
