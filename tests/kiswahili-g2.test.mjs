// Kiswahili Grade 2: skills, misconception library and teaching pack (curriculum/kiswahili/g2.json), mapped 18 Nov 2026 from KICD
// outcomes only. No question families yet: every skill is in the awaiting list. All draft until a native Kiswahili teacher reviews it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { entryFor } from '../src/ai-tutor/content/subjects/registry.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.kiswahili.g2.js';
import { SIGNED } from '../src/ai-tutor/content/families/kiswahili_g2_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/kiswahili/g2.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;
const entry = entryFor('kiswahili', 2);

test('Grade 2: the in-app map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, source.totals.outcomes);
  assert.equal(Object.keys(SKILLS).length, subs.flatMap(s => s.skills).length);
  assert.equal(Object.keys(MIS_FEEDBACK).length, subs.flatMap(s => s.misconceptions).length);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
});

test('Grade 2: the subject entry is wired, has no families yet, lists every skill as awaiting, and nothing is signed', () => {
  assert.ok(entry, 'kiswahili_g2 entry');
  assert.deepEqual(entry.families, []);
  assert.deepEqual(SIGNED, []);
  assert.deepEqual([...entry.awaiting].sort(), Object.keys(SKILLS).sort());
});

test('Grade 2: child-facing lines have no em dash or emoji, and every misconception names its source', () => {
  for (const s of subs) for (const m of s.misconceptions) {
    const all = JSON.stringify(m);
    assert.ok(!/—/.test(all), `${m.code}: em dash`);
    assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all), `${m.code}: emoji`);
  }
});

// The Grade 5 Maths standard for this grade (18 Nov 2026): tests/lib/kiswahili-depth.mjs
import { depthTests } from './lib/kiswahili-depth.mjs';
depthTests(2);
