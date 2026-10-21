// A class roster is a list of accounts. A parent's children and other
// subjects sit under the parent's user_id, so they must never reach a
// teacher as extra "students" (see src/ai-tutor/classRows.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isOwnMathRow, canJoinClass } from '../src/ai-tutor/classRows.js';

const U = '11111111-2222-3333-4444-555555555555';
const C = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

test("the account holder's own maths row is shown", () => {
  assert.equal(isOwnMathRow({ user_id: U, profile_key: U, learner_id: null }), true);
  assert.equal(isOwnMathRow({ user_id: U }), true); // before profile_key existed
});

test("a parent's child never appears under the parent's account", () => {
  assert.equal(isOwnMathRow({ user_id: U, profile_key: `${U}_c${C}`, learner_id: C }), false);
  assert.equal(isOwnMathRow({ user_id: U, profile_key: `${U}_c${C}`, learner_id: null }), false);
  assert.equal(isOwnMathRow({ user_id: U, profile_key: U, learner_id: C }), false);
});

test('other subjects are not scored as maths', () => {
  assert.equal(isOwnMathRow({ user_id: U, profile_key: `${U}_physics` }), false);
  assert.equal(isOwnMathRow({ user_id: U, profile_key: `${U}_chemistry` }), false);
});

test("the teacher's own row is not a student", () => {
  assert.equal(isOwnMathRow({ user_id: U, profile_key: U }, U), false);
});

test('only someone practising as themselves can join a class', () => {
  assert.equal(canJoinClass({ userId: U, guest: false, activeLearner: null }), true);
  assert.equal(canJoinClass({ userId: U, guest: false, activeLearner: { id: C } }), false);
  assert.equal(canJoinClass({ userId: null, guest: false, activeLearner: null }), false);
  assert.equal(canJoinClass({ userId: U, guest: true, activeLearner: null }), false);
});
