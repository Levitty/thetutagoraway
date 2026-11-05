// Who sees what. The frame draws the menu; these rules are the product's promise
// that each person gets only what they need and a tutor's world stays a tutor's.
import test from 'node:test';
import assert from 'node:assert/strict';
import { menuFor, personKind, allItems, barItems, teachingMenu } from '../src/shell/menus.js';
import { TOKENS, TAILWIND_COLOURS } from '../src/shell/tokens.mjs';

const ids = (m) => allItems(m).map(i => i.id);

test('a tutor is never offered Find a tutor, and has one home', () => {
  const m = menuFor({ kind: 'tutor', approved: true });
  assert.ok(!ids(m).includes('tutors'));
  assert.ok(!ids(m).includes('home'));
  assert.equal(ids(m).filter(i => i === 'overview').length, 1);
  for (const id of ['schedule', 'students', 'groupClasses', 'earnings', 'classes', 'practice', 'rocket', 'profile', 'settings', 'signout']) assert.ok(ids(m).includes(id), id);
});

test('the review gate: tutoring stays locked until approved, the same four sections as before', () => {
  const locked = allItems(menuFor({ kind: 'tutor', approved: false })).filter(i => i.locked).map(i => i.id).sort();
  assert.deepEqual(locked, ['earnings', 'groupClasses', 'schedule', 'students']);
  assert.equal(allItems(menuFor({ kind: 'tutor', approved: true })).filter(i => i.locked).length, 0);
});

test('a parent gets no tutor, teacher or tool items unless they run a class', () => {
  const m = menuFor({ kind: 'parent' });
  for (const id of ['schedule', 'earnings', 'classes', 'practice', 'spreadsheet', 'admin']) assert.ok(!ids(m).includes(id), id);
  assert.ok(ids(menuFor({ kind: 'parent', hasClasses: true })).includes('classes'));
});

test('Admin appears only for an admin', () => {
  for (const kind of ['parent', 'learner', 'tutor']) {
    assert.ok(!ids(menuFor({ kind })).includes('admin'), kind);
    assert.ok(ids(menuFor({ kind, isAdmin: true })).includes('admin'), kind);
  }
});

test('the phone bar never holds more than five places', () => {
  for (const who of [{ kind: 'parent' }, { kind: 'learner' }, { kind: 'tutor', approved: true }, { kind: 'parent', hasClasses: true, isAdmin: true }]) {
    const { named, rest } = barItems(menuFor(who));
    assert.ok(named.length + (rest.length ? 1 : 0) <= 5, JSON.stringify(who));
  }
});

test('a learner\'s account has one home: the practice board', () => {
  const home = allItems(menuFor({ kind: 'learner' }))[0];
  assert.equal(home.page, 'ai');
});

test('account types map to menus', () => {
  assert.equal(personKind({ role: 'tutor' }, 'parent'), 'tutor');
  assert.equal(personKind({ role: 'student' }, 'student'), 'learner');
  assert.equal(personKind({ role: 'student' }, 'parent'), 'parent');
  assert.equal(personKind({ role: 'student' }, null), 'parent');
});

test('the signed-out teacher demo has only the teaching items', () => {
  assert.deepEqual(ids(teachingMenu()), ['classes', 'practice', 'rocket']);
});

test('tokens: the approved values, shared with Tuta on purpose', () => {
  const approved = { ground: '#ECEEF8', card: '#FFFFFF', tile: '#F4F5FB', ink: '#16161A', line: '#E2E4F0', dash: '#C5C8DC', violet: '#4318D1', lime: '#DCFF72', 'violet-tint': '#ECE8FF', 'green-tint': '#E2F5E8', 'amber-tint': '#FFF0D4' };
  for (const [k, v] of Object.entries(approved)) assert.equal(TOKENS[k], v, k);
  assert.equal(TAILWIND_COLOURS.slate[900], TOKENS.ink);
  assert.equal(TAILWIND_COLOURS.slate[100], TOKENS.ground);
});
