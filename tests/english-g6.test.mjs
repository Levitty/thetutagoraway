// English Grade 6: skills, misconception library and question families (curriculum/english/g6.json).
// All draft and off for children until a Kenyan English teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { textFailures } from '../engine/scripts/english_checks.mjs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.english.g6.js';
import entry from '../src/ai-tutor/content/subjects/english_g6.js';
import { SIGNED } from '../src/ai-tutor/content/families/english_g6_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/english/g6.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;

test('the in-app map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 194);
  assert.equal(source.totals.outcomes, 194);
  assert.equal(Object.keys(SKILLS).length, subs.flatMap(s => s.skills).length);
  assert.equal(Object.keys(MIS_FEEDBACK).length, subs.flatMap(s => s.misconceptions).length);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
  assert.ok(Array.isArray(source.rubrics) || source.rubrics, 'KICD rubrics kept');
});

test('skills are proposed, misconceptions are draft, and every field a reviewer needs is there', () => {
  for (const s of subs) {
    for (const k of s.skills) {
      assert.equal(k.status, 'proposed');
      assert.ok(k.mastery && k.question_forms.length >= 2, `${k.code}: mastery or forms missing`);
      for (const p of k.prerequisites) assert.ok(p.kind === 'outcome' || p.requires.startsWith('ENGL.G5.') || SKILLS[p.requires], `${k.code}: unknown prerequisite ${p.requires}`);
    }
    for (const m of s.misconceptions) {
      assert.equal(m.status, 'draft');
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(m[f] && String(m[f]).length > 5, `${m.code}: ${f} missing`);
      assert.ok(!/—/.test(JSON.stringify(m)), `${m.code}: em dash`);
    }
  }
});

test('every skill has two structures, every family passes its checks, and none is signed', () => {
  const bad = textFailures(60).filter(x => x.startsWith('english6.') || x.startsWith('ENGL.G6.'));
  assert.deepEqual(bad, [], `\n${bad.slice(0, 30).join('\n')}\n`);
  assert.deepEqual(SIGNED, []);
  assert.ok(entry.families.every(f => f.reviewed === false && f.id.startsWith('english6.')));
  const covered = new Set(entry.families.map(f => f.cskill));
  for (const c of Object.keys(SKILLS)) assert.ok(covered.has(c), `${c}: no family`);
});
