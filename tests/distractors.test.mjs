// The distractor checker (scripts/check-distractors.mjs) runs with the tests: no code the library cannot
// resolve, and no family flagged that is not already in the baseline. Fix a family, then update the baseline.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('wrong options: every code resolves, and no new family shares codes, tags a near miss or has a thin reason', () => {
  const r = spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/check-distractors.mjs', import.meta.url)), '--quiet', '--draws', '20'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
