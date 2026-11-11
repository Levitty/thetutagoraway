// ============================================================================
// MILESTONE 3b: steps out of the model's streamed JSON, the moment each one is
// complete, whatever size the pieces arrive in (src/voice-tutor/streamSteps.js).
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stepParser } from '../src/voice-tutor/streamSteps.js';

const TURN = { steps: [
  { cmd: 'say', text: 'Here is a bar {with braces} and "quotes" and a \\ backslash.' },
  { cmd: 'fraction_bar', id: 'b', parts: 4, shaded: [1, 2], second_bar: { parts: 8, shaded: 4 }, slot: 'top', on: 'bar' },
  { cmd: 'ask', id: 'q', prompt: 'What is [one] half?', form: 'choice', choices: ['1/2', '2/4'], expected: '1/2' },
  { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 },
] };

test('every step comes out whole, in order, for any chunk size', () => {
  const text = JSON.stringify(TURN);
  for (const size of [1, 2, 3, 7, 16, 50, text.length]) {
    const p = stepParser();
    const got = [];
    for (let i = 0; i < text.length; i += size) got.push(...p.push(text.slice(i, i + size)));
    assert.deepEqual(got, TURN.steps, `chunk size ${size}`);
  }
});

test('a step is handed over the moment its closing brace arrives, not at the end of the turn', () => {
  const text = JSON.stringify(TURN);
  const p = stepParser();
  const firstEnd = text.indexOf('backslash."}') + 'backslash."}'.length;
  assert.deepEqual(p.push(text.slice(0, firstEnd - 1)), []);
  assert.deepEqual(p.push(text.slice(firstEnd - 1, firstEnd)), [TURN.steps[0]]);
  assert.equal(p.push(text.slice(firstEnd)).length, 3);
});

test('braces and brackets inside sentences never end a step; whitespace and pretty printing are fine', () => {
  const p = stepParser();
  const got = p.push(JSON.stringify(TURN, null, 2));
  assert.deepEqual(got, TURN.steps);
});

test('a step that is not valid JSON is passed on to be dropped and logged, and the rest still come', () => {
  const p = stepParser();
  const got = p.push('{"steps":[{"cmd":"say","text":"ok"},{"cmd": say},{"cmd":"pause_for_child","expect":"typed","max_wait_s":30}]}');
  assert.equal(got.length, 3);
  assert.equal(got[0].text, 'ok');
  assert.ok(got[1].__bad);
  assert.equal(got[2].cmd, 'pause_for_child');
  // Nothing before the steps array is taken for a step.
  assert.deepEqual(stepParser().push('{"note":{"a":1},"steps":[]}'), []);
});
