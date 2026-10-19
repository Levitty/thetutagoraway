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

// ---- the figure a learner is given when they have not picked one -----------
const { avatarFor, isAvatarId, AVATARS } = await import('../src/avatars/avatarList.js');

test('every learner has a figure, picked or not', () => {
  // The bug this closes: "no pick" was drawn as an initial in a circle, and
  // almost every account predates the picker — so the six drawn figures were
  // on nobody's screen, and nothing on the screen suggested there were six.
  for (const seed of ['child-1', 'Amani', 'parent-uuid-aaaa', '', null, undefined]) {
    assert.ok(isAvatarId(avatarFor(seed)), `no figure for seed ${JSON.stringify(seed)}`);
  }
});

test('the same learner is given the same figure every time', () => {
  // Otherwise the child opens the app tomorrow as somebody else.
  assert.equal(avatarFor('child-1'), avatarFor('child-1'));
});

test('two children on one account are not given the same figure', () => {
  // Not guaranteed for any two ids, but the switcher chips are where sibling
  // figures appear side by side, so a run of real ids must spread out.
  const ids = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  const got = new Set(ids.map(avatarFor));
  assert.ok(got.size >= Math.min(ids.length, AVATARS.length) - 1,
    `six children drew only ${got.size} distinct figures`);
});
