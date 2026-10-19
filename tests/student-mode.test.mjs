// ============================================================================
// STUDENT MODE — what travels with a learner when a tablet is handed over.
//
// The avatar did not. startStudentMode() copied id, name and grade and left
// the figure behind, so HOREB fell back to an initial in a circle — on the one
// screen the child actually uses, and for exactly the child who had chosen a
// figure. Nothing broke, so nothing complained; the avatars were simply never
// seen.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

// studentMode.js reads localStorage at call time, so a plain in-memory stub is
// enough and the module needs no seam of its own.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const { startStudentMode, getStudentMode, endStudentMode } = await import('../src/family/studentMode.js');

test('the figure a child picked travels into student mode', () => {
  store.clear();
  startStudentMode('parent-1', { id: 'child-1', name: 'Amani', grade: 'Grade 5', avatar: 'b3' });
  assert.equal(getStudentMode().avatar, 'b3');
});

test('a child with no figure yet is stored as having none, not as undefined', () => {
  // JSON.stringify drops an undefined value, so the key would vanish and the
  // reading side could not tell "not picked" from "lost in transit".
  store.clear();
  startStudentMode('parent-1', { id: 'child-2', name: 'Baraka', grade: 'Grade 4' });
  const m = getStudentMode();
  assert.ok('avatar' in m, 'the avatar key survives the round trip');
  assert.equal(m.avatar, null);
});

test('the rest of the learner still travels', () => {
  store.clear();
  startStudentMode('parent-1', { id: 'child-3', name: 'Zuri', grade: 'Grade 6', avatar: 'g1' });
  const m = getStudentMode();
  assert.equal(m.parentId, 'parent-1');
  assert.equal(m.learnerId, 'child-3');
  assert.equal(m.name, 'Zuri');
  assert.equal(m.grade, 'Grade 6');
  endStudentMode();
  assert.equal(getStudentMode(), null);
});
