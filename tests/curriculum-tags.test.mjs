// Every skill is tagged once, to outcomes that exist, in the shared terms Tuta uses.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { SKILL_TAGS, PROMISED } from '../src/ai-tutor/curriculum/skillTags.js';
import { OUTCOMES, CBC_SUBSTRANDS } from '../src/ai-tutor/curriculum/outcomes.js';

const MIGRATION_215 = new Set(JSON.parse(readFileSync(new URL('./fixtures/migration215-substrand-codes.json', import.meta.url))));

test('every skill has a tag, and every tagged outcome exists', () => {
  for (const id of Object.keys(SKILLS)) {
    const t = SKILL_TAGS[id];
    assert.ok(t, `${id} has no tag`);
    if (t.status === 'unverified' && t.note === 'senior' || t.status === 'outside-design') { assert.ok(t.code && t.topic, `${id} needs a topic and code`); continue; }
    assert.ok(t.outcomes?.length, `${id} has no outcomes`);
    for (const o of t.outcomes) assert.ok(OUTCOMES[o], `${id}: unknown outcome ${o}`);
  }
});

test('promised outcomes exist', () => {
  for (const [id, list] of Object.entries(PROMISED)) for (const o of list) assert.ok(OUTCOMES[o], `${id}: ${o}`);
});

test('sub-strand codes are built the same way as Tuta migration 215', () => {
  const ours = CBC_SUBSTRANDS.map(s => s.code);
  const shared = ours.filter(c => MIGRATION_215.has(c));
  assert.ok(shared.length > 60, `only ${shared.length} codes match migration 215`);
});
