// ============================================================================
// THE MISCONCEPTION LAYER
//
// The content carries ~300 authored misconception messages — "if she answers
// 360 − a − b she has confused the triangle rule with angles at a point". Until
// this layer existed the lesson never consulted them: it ran only a generic
// arithmetic diagnoser, so every one of those messages was dead weight.
//
// These tests hold two things: that the matcher actually fires on real
// generated content (not just on hand-made fixtures), and that a pattern is
// only named when it is genuinely a habit rather than one hard topic.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  matchMisconception, classifyMisconception, recordMisconception, topPatterns, TAXONOMY,
} from '../src/ai-tutor/misconceptions.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

test('an anticipated wrong answer is matched and tagged', () => {
  const problem = {
    answer: '53',
    misconceptions: [{ when: '307', feedback: 'Triangle angles sum to 180°, not 360°.' }],
  };
  const hit = matchMisconception(problem, '307');
  assert.ok(hit, 'the authored wrong answer should be recognised');
  assert.match(hit.feedback, /180/);
  assert.ok(TAXONOMY[hit.tag], `tag ${hit.tag} should be in the taxonomy`);
});

test('a merely wrong answer is not force-fitted to a misconception', () => {
  const problem = {
    answer: '53',
    misconceptions: [{ when: '307', feedback: 'Triangle angles sum to 180°, not 360°.' }],
  };
  assert.equal(matchMisconception(problem, '41'), null);
  assert.equal(matchMisconception({ answer: '5' }, '3'), null, 'no misconceptions authored → no match');
});

test('matching tolerates how a child actually types', () => {
  const problem = { answer: '10', misconceptions: [{ when: '2√5', feedback: 'You left it unsimplified.' }] };
  assert.ok(matchMisconception(problem, '2root5'), 'typed words should still match the authored surd');
});

test('the same error in different topics gets the same tag', () => {
  // This is the whole point: one habit, not three unrelated weak skills.
  const a = classifyMisconception('Sign slip — subtract the coordinates in the SAME order on top and bottom.');
  const b = classifyMisconception('Check the sign — negatives are to the LEFT of zero.');
  assert.equal(a, 'sign-error');
  assert.equal(b, 'sign-error');
});

test('a pattern is named only when it is a habit, not one hard topic', () => {
  let p = {};
  // Three slips, all in the SAME skill — that is a hard topic, not a habit.
  for (let i = 0; i < 3; i++) p = recordMisconception(p, 'sign-error', 'G6_INTEGERS_ADD_SUB');
  assert.deepEqual(topPatterns(p), [], 'one skill should not raise a pattern');

  // The same error in a second topic makes it a habit.
  p = recordMisconception(p, 'sign-error', 'G8_GRADIENT');
  const found = topPatterns(p);
  assert.equal(found.length, 1);
  assert.equal(found[0].tag, 'sign-error');
  assert.equal(found[0].count, 4);
  assert.equal(found[0].skillCount, 2);
  assert.ok(found[0].advice.length > 0, 'a named pattern must come with what to do about it');
});

test('the profile never grows without bound', () => {
  let p = {};
  for (let i = 0; i < 50; i++) p = recordMisconception(p, 'sign-error', `SKILL_${i}`);
  assert.ok(p['sign-error'].skills.length <= 12, 'skill list should be capped');
  assert.equal(p['sign-error'].n, 50, 'the count itself still tells the truth');
});

// The load-bearing test: does this fire on the REAL content, or only on
// fixtures? Every authored misconception's `when` value is, by construction,
// a wrong answer a student might give — so feeding it back must match.
test('authored misconceptions fire on real generated problems', () => {
  let checked = 0, matched = 0;
  const untagged = new Set();
  for (const id of Object.keys(SKILLS)) {
    let p;
    try { p = generateProblem(id); } catch { continue; }
    for (const m of p?.misconceptions || []) {
      if (m?.when == null) continue;
      checked++;
      const hit = matchMisconception(p, m.when);
      if (hit) {
        matched++;
        if (!TAXONOMY[hit.tag]) untagged.add(hit.tag);
      }
    }
  }
  assert.ok(checked > 100, `expected plenty of authored misconceptions, saw ${checked}`);
  assert.equal(matched, checked, `${checked - matched} authored misconceptions would never fire`);
  assert.deepEqual([...untagged], [], 'every fired misconception must land in the taxonomy');
});
