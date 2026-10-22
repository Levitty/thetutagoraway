// ============================================================================
// IS THE CODE IN THIS REPOSITORY THE CODE THAT IS RUNNING?
//
// The paywall outage was not caused by the two bugs inside verify-subscription.
// It was caused by the shape of the project: the website deploys on every push
// and the edge functions deploy only when somebody remembers. The client was
// changed on 29 September to send { reference, plan }; the function that reads
// it was last touched on 3 August. Seven weeks of disagreement, invisible,
// because the two halves only meet when a real person pays.
//
// This fails the build when a function's source no longer matches the copy
// that was last deployed — which is the question nobody was asking.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { drifted, functionNames, hashOf, deployedRecord } from '../scripts/function-drift.mjs';

test('no edge function has changed since it was last deployed', () => {
  const { changed } = drifted();
  const lines = changed.map(d =>
    `${d.name}: deployed ${d.at?.slice(0, 10) ?? 'unknown'} as ${d.deployed}, repository now ${d.here}`);
  assert.deepEqual(lines, [],
    `\n  The running copy is not this code. Actions -> Deploy edge function:\n    ${lines.join('\n    ')}\n`);
});

test('the two functions a child depends on have a deploy on record', () => {
  // verify-subscription grants the pass a family paid for; mark-composition
  // carries the safeguarding screen. For these two "we do not know what is
  // running" is not an acceptable answer, so they are named rather than left
  // to the general warning.
  const rec = deployedRecord();
  for (const name of ['verify-subscription', 'mark-composition']) {
    assert.ok(rec[name]?.sha, `${name} has never been deployed through the workflow`);
    assert.equal(rec[name].sha, hashOf(name), `${name} has changed since it was deployed`);
  }
});

test('the record only ever names functions that exist', () => {
  // A renamed or deleted function leaving a stale row behind would make the
  // check quietly pass for something that is no longer there.
  const names = new Set(functionNames());
  const ghosts = Object.keys(deployedRecord()).filter(n => !names.has(n));
  assert.deepEqual(ghosts, [], `DEPLOYED.json names functions that no longer exist: ${ghosts.join(', ')}`);
});
