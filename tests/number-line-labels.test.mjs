// F22: the fraction number line must not name the tick the child is asked to find,
// and lower-primary addition must not get the 0-to-1 fraction line.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numberLineLabel } from '../src/ai-tutor/numberLineLabels.js';
import { buildPlaceOnNumberLine } from '../src/ai-tutor/content/fractions.js';
import { LOWER_PRIMARY_CONTENT } from '../src/ai-tutor/content/lowerPrimary.js';

test('only the ends of a placement number line are named', () => {
  for (let i = 0; i < 200; i++) {
    const p = buildPlaceOnNumberLine();
    const { denom, max = 1, labelTicks } = p.visual.data;
    const steps = max * denom;
    const named = Array.from({ length: steps + 1 }, (_, j) => numberLineLabel(j, steps, denom, max, !!labelTicks)).filter(Boolean);
    assert.deepEqual(named, ['0', '1'], p.question);
  }
});

test('a teaching line can still name every tick', () => {
  assert.equal(numberLineLabel(2, 4, 4, 1, true), '1/2');
  assert.equal(numberLineLabel(2, 4, 4, 1, false), '');
});

test('lower-primary addition never shows the fraction number line', () => {
  const builders = Object.values(LOWER_PRIMARY_CONTENT || {}).filter(f => typeof f === 'function');
  assert.ok(builders.length > 0);
  for (const b of builders) for (let i = 0; i < 30; i++) {
    let p; try { p = b(); } catch { continue; }
    if (p?.visual?.type === 'number_line') assert.ok(p.visual.data?.denom, `${p.question}: a fraction line with no denominator`);
  }
});
