// ============================================================================
// NOTHING A CHILD SEES CHANGES BY ACCIDENT.
//
// tests/fixtures/question-snapshot-598b578.json fingerprints, per skill, what
// every skill served at commit 598b578. With only reviewed families on, every
// skill must still match, except the ones listed here, whose content was
// changed on purpose. Adding a skill to CHANGED is a claim that you meant it.
// When a family is marked reviewed, its skill moves into REVIEWED_SO_FAR by
// itself: a skill with a reviewed family is meant to change.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { snapshotSkill } from './helpers/questionSnapshot.mjs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { setFamilyMode, allOnFrom, isOn } from '../src/ai-tutor/content/families/core.js';

const BASE = JSON.parse(readFileSync(new URL('./fixtures/question-snapshot-598b578.json', import.meta.url)));
// The 18 mislabelled skills (engine evaluation, 5 Nov 2026), and their aliases.
export const CHANGED = new Set(['G7_TEMPERATURE', 'G9_APPROX_ERRORS', 'G8_SCALE_DRAWING', 'G6_3D_OBJECTS', 'G6_INEQUALITIES', 'G6_MONEY', 'G6_ANGLE_MEASURE', 'G6_MASS', 'G5_MONEY', 'G4_LETTERS', 'G7_DATA_REPRESENT', 'G8_LINEAR_GRAPHS', 'G8_SURFACE_AREA', 'G8_PROBABILITY_COMBINED', 'G9_SPEED_VELOCITY', 'G9_PROBABILITY_ADV', 'G7_CONSTRUCTIONS', 'G9_CONSTRUCTION']);

test('with only reviewed families on, no other skill serves anything different', () => {
  setFamilyMode('reviewed');
  const reviewed = new Set(FAMILIES.filter(f => f.reviewed === true).map(f => f.skill));
  const moved = Object.keys(SKILLS).filter(id => !CHANGED.has(id) && !reviewed.has(id) && snapshotSkill(id) !== BASE[id]);
  assert.deepEqual(moved, [], `these skills changed without anyone saying so: ${moved.join(', ')}`);
});

test('unreviewed families are off for children, and every switch that turns them on is local', () => {
  setFamilyMode('reviewed');
  assert.deepEqual(FAMILIES.filter(f => f.reviewed === false && !f.core && isOn(f)).map(f => f.id), []);
  assert.equal(allOnFrom({ DEV: false, VITE_HOREB_ALL_FAMILIES: '1' }), false, 'a production build must ignore the switch');
  assert.equal(allOnFrom({ DEV: true }), false);
  assert.equal(allOnFrom(undefined), false);
  assert.equal(allOnFrom({ DEV: true, VITE_HOREB_ALL_FAMILIES: '1' }), true);
});
