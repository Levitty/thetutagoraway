// ============================================================================
// THE BOARD COMMAND LIST: every command passes when right, and bad input is
// dropped (and logged), never drawn. src/voice-tutor/commands.js runs on the
// server before a turn leaves and in the browser before anything is drawn.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTurn, turnProblems, COMMANDS, TURN_SCHEMA, MAX_BOARD_ITEMS, resolveSlot, cleanText, doingOf, ANSWER_CLASSES, DOINGS, repairStep, boardLines, describeItem, freeSlots } from '../src/voice-tutor/commands.js';
import { REPLY_FORM } from '../src/voice-tutor/prompt.js';
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

// One good example of each of the 21 commands (figure: rendering engine phase 2; note_interest and note_what_helped: the learner
// profile; assess: the conversation engine, 12 Nov 2026).
const GOOD = {
  say: { cmd: 'say', text: 'Here is a chapati cut into four equal pieces.' },
  write_text: { cmd: 'write_text', id: 't1', text: 'Mama cuts a cake.', slot: 'bottom_right', size: 'm', colour: 'green', on: 'chapati', delay_ms: 200 },
  write_math: { cmd: 'write_math', id: 'm2', expr: 'frac(1,2) = frac(2×1, 2×2)', slot: 'bottom_right' },
  fraction_bar: { cmd: 'fraction_bar', id: 'b9', parts: 6, shaded: [1, 3], second_bar: { parts: 3, shaded: 1 }, label: true, slot: 'bottom_right' },
  number_line: { cmd: 'number_line', id: 'n9', from: 0, to: 2, divisions: 4, marks: [{ value: 0.5, label: 'half', style: 'arrow' }], jumps: [{ from: 0, to: 0.5 }], slot: 'bottom_right' },
  shape: { cmd: 'shape', id: 's9', kind: 'circle', parts: 8, shaded: 3, label: true, slot: 'bottom_right' },
  figure: { cmd: 'figure', id: 'f9', type: 'fraction', params: '{"parts":3,"shaded":1,"second":{"parts":6}}', controls: ['shade_second'], goal: '{"kind":"match"}', slot: 'bottom_right', on: 'chapati' },
  plot_points: { cmd: 'plot_points', id: 'p9', x_axis: { from: 0, to: 10, name: 'Day' }, y_axis: { from: 0, to: 20 }, points: [{ x: 1, y: 2 }, { x: 2, y: 4 }], connect: true, slot: 'bottom_right' },
  highlight: { cmd: 'highlight', target: 'bar1', part: 3, style: 'glow', on: 'three' },
  underline: { cmd: 'underline', target: 'm1', range: [0, 4] },
  point: { cmd: 'point', target: 'bar2', bar: 2, part: 6 },
  erase: { cmd: 'erase', targets: ['bar1', 'm1'] },
  clear: { cmd: 'clear' },
  ask: { cmd: 'ask', id: 'q1', prompt: 'One third is how many sixths?', form: 'number', expected: '2', wrong: [{ answer: '4', misconception: ADD }] },
  set_phase: { cmd: 'set_phase', phase: 'teach' },
  record_diagnosis: { cmd: 'record_diagnosis', skill: EQ, misconception: ADD, confidence: 'high', evidence: 'Wrote 4 for 1/3 = ?/6 and 6 for 2/4 = ?/8.', next: 'reteach' },
  note_interest: { cmd: 'note_interest', interest: 'football' },
  note_what_helped: { cmd: 'note_what_helped', move: 'drawing it', helped: true },
  assess: { cmd: 'assess', class: 'misconception', misconception: ADD, evidence: 'said 4 sixths: added 3 to top and bottom', ask: 'q1' },
  pause_for_child: { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30, doing: 'answer' },
  end_session: { cmd: 'end_session', summary: 'Worked on equivalent fractions.' },
};

test('the list has exactly the 21 approved commands, and each one passes when right', () => {
  assert.equal(COMMANDS.length, 21);
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
  // Sentences are not counted to drop a say (the turn's word limit keeps turns short): a counting line is kept, and noted.
  const counted = validateTurn({ steps: [{ cmd: 'say', text: 'One. Two. Three. Four.' }] });
  assert.equal(counted.steps[0].text, 'One. Two. Three. Four.');
  assert.match(counted.notes.join(' '), /4 sentences/);
});

test('an obvious slip in a step\'s shape is mended, and noted; anything unclear is still dropped', () => {
  // The first test-set run (12 Nov 2026): 70 sentences written as {"cmd":"say","say":"..."}, 10 steps with no cmd.
  for (const alias of ['say', 'sentence', 'words']) {
    const v = validateTurn({ steps: [{ cmd: 'say', [alias]: 'Take your time.', move: 'Wait and nudge' }] });
    assert.deepEqual(v.steps, [{ cmd: 'say', text: 'Take your time.', move: 'Wait and nudge' }], alias);
    assert.match(v.notes.join(' '), new RegExp(`"${alias}" read as text`));
  }
  assert.deepEqual(validateTurn({ steps: [{ say: 'Look at the bar.' }] }).steps, [{ cmd: 'say', text: 'Look at the bar.' }]);
  assert.deepEqual(validateTurn({ steps: [{ text: 'Look at the bar.', move: 'Revoice and build' }] }).steps, [{ cmd: 'say', text: 'Look at the bar.', move: 'Revoice and build' }]);
  // The same words twice, or an empty one: the alias is left out. Different words: "text" is kept and the alias left out
  // (12 Nov 2026, run 2: 42 says were dropped as "extra field say").
  assert.equal(validateTurn({ steps: [{ cmd: 'say', text: 'Hi.', say: 'Hi.' }] }).steps[0].text, 'Hi.');
  assert.equal(validateTurn({ steps: [{ cmd: 'say', text: 'Hi.', say: '' }] }).steps[0].text, 'Hi.');
  const both = validateTurn({ steps: [{ cmd: 'say', text: 'Hi.', say: 'Something else.' }] });
  assert.deepEqual(both.steps, [{ cmd: 'say', text: 'Hi.' }]);
  assert.match(both.notes.join(' '), /said something else; text kept/);
  // Harmless extras (a say on a silent step, an id or a timing on a say, a note): left out, the step kept.
  assert.deepEqual(ok({ cmd: 'assess', class: 'understood', evidence: 'said four', say: 'Well done.' }), { cmd: 'assess', class: 'understood', evidence: 'said four' });
  assert.deepEqual(ok({ cmd: 'say', text: 'Look.', id: 's1', on: 'x', delay_ms: 20, note: 'calm' }), { cmd: 'say', text: 'Look.' });
  assert.equal(ok({ cmd: 'pause_for_child', expect: 'any', max_wait_s: 30, doing: 'answer', text: 'What do you think?' }).doing, 'answer');
  // Timing that a drawing command does not take is still not harmless.
  no({ cmd: 'clear', pace: 'slow' }, {}, /extra field pace/);
  // A question's prompt and answer, a judgement's class, a hand-back's defaults.
  assert.deepEqual(repairStep({ cmd: 'ask', id: 'q', question: 'How many?', form: 'number', answer: '4' }), { cmd: 'ask', id: 'q', form: 'number', prompt: 'How many?', expected: '4' });
  assert.equal(ok({ cmd: 'assess', assess: 'understood', evidence: 'said four' }).class, 'understood');
  no({ cmd: 'assess', assess: 'clever', evidence: 'x' }, {}, /extra field assess/);
  assert.deepEqual(ok({ cmd: 'pause_for_child', doing: 'answer' }), { cmd: 'pause_for_child', expect: 'any', max_wait_s: 30, doing: 'answer' });
  // Never mended: a step with no cmd that is not plainly a say, or an unknown command.
  no({ shaded: 2, parts: 4 }, {}, /unknown command/);
  no({ cmd: 'speak', text: 'Hi.' }, {}, /unknown command/);
});

test('values out of range are dropped', () => {
  no({ cmd: 'fraction_bar', id: 'b', parts: 13, shaded: 1, slot: 'top' }, {}, /1 to 12/);
  no({ cmd: 'fraction_bar', id: 'b', parts: 4, shaded: 5, slot: 'top' }, {}, /count out of range/);
  no({ cmd: 'fraction_bar', id: 'b', parts: 4, shaded: [0, 2], slot: 'top' }, {}, /part out of range/);
  no({ cmd: 'fraction_bar', id: 'b', parts: 4, shaded: [2, 2], slot: 'top' }, {}, /twice/);
  // A whole is one part (12 Nov 2026, run 2: "Here is a chapati" with no chapati, 11 times).
  assert.equal(ok({ cmd: 'shape', id: 's', kind: 'circle', parts: 1, shaded: 0, slot: 'top' }).parts, 1);
  no({ cmd: 'shape', id: 's', kind: 'circle', parts: 0, shaded: 0, slot: 'top' }, {}, /1 to 12/);
  no({ cmd: 'number_line', id: 'n', from: 0, to: 13, divisions: 2, slot: 'top' }, {}, /0 to 12/);
  no({ cmd: 'number_line', id: 'n', from: 3, to: 1, divisions: 2, slot: 'top' }, {}, /from < to/);
  no({ cmd: 'number_line', id: 'n', from: 0, to: 12, divisions: 12, slot: 'top' }, {}, /too many ticks/);
  no({ cmd: 'number_line', id: 'n', from: 0, to: 1, divisions: 2, marks: [{ value: 2 }], slot: 'top' }, {}, /off the line/);
  no({ cmd: 'number_line', id: 'n', from: 0, to: 1, divisions: 2, marks: Array(9).fill({ value: 0 }), slot: 'top' }, {}, /8 marks/);
  no({ cmd: 'plot_points', id: 'p', x_axis: { from: 0, to: 30 }, y_axis: { from: 0, to: 5 }, points: [{ x: 1, y: 1 }], slot: 'top' }, {}, /20 whole steps/);
  no({ cmd: 'plot_points', id: 'p', x_axis: { from: 0, to: 5 }, y_axis: { from: 0, to: 5 }, points: Array(13).fill({ x: 1, y: 1 }), slot: 'top' }, {}, /1 to 12 points/);
  no({ cmd: 'pause_for_child', expect: 'typed', max_wait_s: 90 }, {}, /5 to 60/);
  no({ ...GOOD.write_text, delay_ms: 5000 }, {}, /delay_ms/);
  // Too many or too few choices, with the answer given: asked as a word or number answer, so the seal still has it
  // (12 Nov 2026, run 2). With no answer it is still dropped.
  assert.deepEqual(['form', 'choices', 'expected'].map((k) => ok({ cmd: 'ask', id: 'q', prompt: 'Pick', form: 'choice', choices: ['a', 'b', 'c', 'd', 'e'], expected: 'a' })[k]), ['word', undefined, 'a']);
  assert.equal(ok({ cmd: 'ask', id: 'q', prompt: 'Which?', form: 'choice', choices: ['3/4'], expected: '3/4' }).form, 'fraction');
  no({ cmd: 'ask', id: 'q', prompt: 'Pick', form: 'choice', choices: ['a', 'b', 'c', 'd', 'e'] }, {}, /2 to 4/);
  // More accepted forms than the limit: the first eight are kept.
  const many = ok({ cmd: 'ask', id: 'q', prompt: 'How many?', form: 'number', expected: '4', accepts: ['4', 'four', 'four pieces', '4 pieces', 'four parts', '4 parts', 'four equal pieces', 'nne', 'four quarters'] });
  assert.equal(many.accepts.length, 8);
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
  // 30 items at most, whatever the slots: the oldest goes to make room.
  const many = Array.from({ length: MAX_BOARD_ITEMS }, (_, k) => ({ id: `i${k}`, cmd: 'write_text', text: 'x' }));
  assert.deepEqual(validateTurn({ steps: [{ cmd: 'write_text', id: 'z', text: 'z', slot: 'top' }] }, { board: many }).steps.map((x) => x.targets || x.id), [['i0'], 'z']);
});

test('a full board makes room: the slot asked for first, then the oldest, never what this turn uses', () => {
  // The first test-set run (12 Nov 2026): 19 drawings dropped for "no free slot" while the words pointed at them.
  const full = [
    { id: 'title', cmd: 'write_text', text: 'Today: same amount', slot: 'top' },
    { id: 'chap1', cmd: 'shape', kind: 'circle', parts: 2, shaded: 0, slot: 'middle' },
    { id: 'bar1', cmd: 'fraction_bar', parts: 4, shaded: 2, slot: 'bottom' },
  ];
  // The item in the wanted slot is replaced, with the erase as a step before the drawing, on the same word.
  const v = validateTurn({ steps: [{ cmd: 'say', text: 'Now I cut each half again.' }, { cmd: 'shape', id: 'chap2', kind: 'circle', parts: 4, shaded: 0, slot: 'middle', on: 'cut' }] }, { board: full });
  assert.deepEqual(v.dropped, []);
  assert.deepEqual(v.steps.slice(1), [{ cmd: 'erase', targets: ['chap1'], on: 'cut' }, { ...v.steps[2], id: 'chap2', slot: 'middle' }]);
  assert.match(v.notes.join(' '), /chap2: the board was full, so chap1 was erased to make room/);
  // An item this turn pointed at is kept; the oldest unused one goes instead.
  const w = validateTurn({ steps: [{ cmd: 'point', target: 'chap1' }, { cmd: 'fraction_bar', id: 'b2', parts: 8, shaded: 0, slot: 'middle' }] }, { board: full });
  assert.deepEqual(w.steps[1], { cmd: 'erase', targets: ['title'] });
  assert.equal(w.steps[2].slot, 'top');
  // Everything in use this turn: dropped, as before, and the board is left as it was.
  const x = validateTurn({ steps: [{ cmd: 'point', target: 'title' }, { cmd: 'point', target: 'chap1' }, { cmd: 'point', target: 'bar1' }, { cmd: 'write_text', id: 'n', text: 'n', slot: 'top' }, { cmd: 'highlight', target: 'bar1' }] }, { board: full });
  assert.match(x.dropped[0].reason, /no free slot/);
  assert.deepEqual(x.steps.map((s) => s.cmd), ['point', 'point', 'point', 'highlight']);
  // The page's own board takes the erase and then the drawing.
  let b = emptyBoard();
  for (const it of full) b = applyStep(b, { ...it }, 1);
  for (const st of v.steps) b = applyStep(b, st, 2);
  assert.deepEqual(b.order, ['title', 'bar1', 'chap2']);
  assert.deepEqual(b.log, []);
});

test('the tutor is told what each board item really shows, and which slots are free', () => {
  assert.equal(describeItem({ id: 'chap1', cmd: 'shape', kind: 'circle', parts: 2, shaded: 0, slot: 'middle' }), 'chap1: a circle at middle, cut into 2 equal parts, none shaded');
  assert.equal(describeItem({ id: 'b', cmd: 'fraction_bar', parts: 8, shaded: [1, 2, 3, 4], slot: 'bottom', second_bar: { parts: 2, shaded: 1 } }), 'b: a bar at bottom, cut into 8 equal parts, 4 of 8 shaded (parts 1, 2, 3, 4); under it a second bar, cut into 2 equal parts, 1 of 2 shaded');
  assert.equal(describeItem({ id: 't', cmd: 'write_text', text: 'Today: halves', slot: 'top' }), 't: the words "Today: halves" at top');
  assert.equal(describeItem({ id: 'f', cmd: 'figure', type: 'fraction', params: { shape: 'bar', parts: 3, shaded: 1, second: { parts: 6, shaded: 0 } }, controls: ['shade_second'], slot: 'middle' }), 'f: a fraction bar at middle, cut into 3 equal parts, 1 of 3 shaded; a second bar, cut into 6 equal parts, none shaded beside it (the child may: shade_second)');
  assert.deepEqual(freeSlots([{ id: 'a', cmd: 'write_text', slot: 'top' }, { id: 'b', cmd: 'shape', slot: 'middle_left' }]), ['middle_right', 'bottom']);
  assert.deepEqual(freeSlots([], ['bottom_left']), ['top', 'middle', 'bottom_right']);
  const lines = boardLines([{ id: 'a', cmd: 'write_text', text: 'x', slot: 'top' }, { id: 'b', cmd: 'shape', kind: 'circle', parts: 4, shaded: 0, slot: 'middle' }, { id: 'c', cmd: 'shape', kind: 'circle', parts: 2, shaded: 1, slot: 'bottom' }]);
  assert.match(lines[0], /^Board now \(what the child sees\): a: the words "x" at top; b: a circle at middle, cut into 4 equal parts, none shaded; c: a circle at bottom, cut into 2 equal parts, 1 of 2 shaded\.$/);
  assert.match(lines.at(-1), /Free slots: none\. A new drawing erases the oldest items/);
  assert.deepEqual(boardLines([]), ['Board now (what the child sees): empty.', 'Free slots: top, middle, bottom.']);
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

// ---------------------------------------------------------------- the conversation engine (12 Nov 2026)
test('assess: the answer\'s class, checked; a misconception code only with class misconception, and only an allowed one', () => {
  const opts = { allowedMis: [ADD], skills: [EQ] };
  assert.deepEqual(ANSWER_CLASSES, ['understood', 'right_unexplained', 'partly_right', 'misconception', 'missing_prerequisite', 'guess_or_no_attempt']);
  for (const c of ANSWER_CLASSES.filter((x) => x !== 'misconception')) assert.equal(ok({ cmd: 'assess', class: c, evidence: 'said two quarters' }, opts).class, c);
  assert.equal(ok({ cmd: 'assess', class: 'misconception', misconception: ADD, evidence: 'added 3 to both' }, opts).misconception, ADD);
  no({ cmd: 'assess', class: 'clever', evidence: 'x' }, opts, /class must be one of/);
  no({ cmd: 'assess', class: 'misconception', evidence: 'x' }, opts, /needs its code/);
  no({ cmd: 'assess', class: 'misconception', misconception: `${EQ}.M_MADE_UP`, evidence: 'x' }, opts, /not on the allowed list/);
  no({ cmd: 'assess', class: 'understood', misconception: ADD, evidence: 'x' }, opts, /only with class misconception/);
  // Silent text too long is cut, never the step (12 Nov 2026, run 2: 12 end_session steps dropped for a long summary).
  assert.equal(ok({ cmd: 'assess', class: 'understood', evidence: 'x '.repeat(100) }, opts).evidence.length <= 160, true);
  const end = validateTurn({ steps: [{ cmd: 'end_session', summary: `${'The child shaded halves well. '.repeat(14)}` }] });
  assert.equal(end.steps.length, 1); assert.ok(end.steps[0].summary.length <= 300); assert.match(end.steps[0].summary, /\.$/);
  assert.match(end.notes.join(' '), /summary: longer than 300, cut/);
  no({ cmd: 'assess', class: 'understood', evidence: 'x', ask: 'Q 1' }, opts, /bad ask id/);
  no({ cmd: 'assess', class: 'understood', evidence: 'x', confidence: 'high' }, opts, /extra field/);
  // One a turn, and it is silent: a turn that only assesses and hands back is a nod, never "says nothing" twice.
  const v = validateTurn({ steps: [{ cmd: 'assess', class: 'understood', evidence: 'a' }, { cmd: 'assess', class: 'understood', evidence: 'b' }, GOOD.say, GOOD.pause_for_child] }, opts);
  assert.match(v.dropped[0].reason, /one assessment a turn/);
});

test('pause_for_child carries what the child is now doing; left out, it is read from the turn', () => {
  assert.deepEqual(DOINGS, ['answer', 'task', 'talk']);
  for (const d of DOINGS) assert.equal(ok({ cmd: 'pause_for_child', expect: 'any', max_wait_s: 30, doing: d }).doing, d);
  no({ cmd: 'pause_for_child', expect: 'any', max_wait_s: 30, doing: 'sleep' }, {}, /doing must be one of/);
  const read = (steps) => validateTurn({ steps: [...steps, { cmd: 'pause_for_child', expect: 'any', max_wait_s: 30 }] }).steps.at(-1).doing;
  assert.equal(read([GOOD.say, GOOD.ask]), 'answer');
  assert.equal(read([{ cmd: 'say', text: 'What do you notice?' }]), 'answer');
  assert.equal(read([{ cmd: 'say', text: 'Shade the sixths to match.' }, GOOD.figure]), 'task');
  assert.equal(read([{ cmd: 'say', text: 'Tell me about your day.' }]), 'talk');
  assert.equal(doingOf([]), 'talk');
  // The reply form the model reads lists it, from the same schema.
  assert.match(REPLY_FORM, /- pause_for_child: expect: [a-z|]+, max_wait_s: integer, doing\?: answer\|task\|talk/);
  assert.match(REPLY_FORM, /- assess: class: understood\|right_unexplained\|partly_right\|misconception\|missing_prerequisite\|guess_or_no_attempt, misconception\?: string, evidence: string, ask\?: string/);
});
