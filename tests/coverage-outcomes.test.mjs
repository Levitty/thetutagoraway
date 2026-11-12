import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

test('outcome coverage counts every official Maths outcome of Grades 1 to 9 once', () => {
  const out = JSON.parse(execFileSync('node', ['scripts/coverage-outcomes.mjs', '--json'], { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' }));
  assert.equal(out.rows.length, 9);
  assert.equal(out.rows.reduce((s, r) => s + r.outcomes, 0), 880);
  for (const r of out.rows) {
    assert.equal(r.noFamily, r.outcomes - r.family);
    assert.equal(r.noSkill, r.outcomes - r.skill);
    assert.ok(r.none <= Math.min(r.noFamily, r.noSkill, r.noMis, r.noWorked));
  }
  assert.equal(out.rows[4].outcomes, 122);
});
