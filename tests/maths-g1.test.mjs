// Grade 1 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g1.json), mapped on 18 Nov 2026 to the depth
// standard of Grades 4 to 9. The checks are shared with Grades 2 and 3 (tests/lib/maths-lower-grade.mjs). Below Grade 1 the
// prerequisites name pre-primary readiness skills (MATH.PP2.READINESS.*) that g1.json defines under `readiness`; Grade 2's name
// these Grade 1 skills.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lowerGradeTests } from './lib/maths-lower-grade.mjs';
import { READINESS } from '../scripts/data/maths-g1/index.mjs';

await lowerGradeTests({ grade: 1, subs: 11, linked: 13, perOption: 7, hands: ['GEOMET.LINES.DRAW_LINES'], sqlFile: '20261124_maths_g1_skills_misconceptions.sql' });

test('Grade 1: the pre-primary readiness skills are defined once in g1.json, each used, and none is a curriculum skill row', () => {
  const g1 = JSON.parse(readFileSync(new URL('../curriculum/mathematics/g1.json', import.meta.url), 'utf8'));
  assert.deepEqual(g1.readiness.map(r => r.code), READINESS.map(r => `MATH.PP2.READINESS.${r.code}`));
  assert.ok(g1.readiness.every(r => r.name && r.what.length > 30 && r.status === 'proposed'));
  const used = new Set(g1.sub_strands.flatMap(s => s.skills.flatMap(k => k.prerequisites.map(p => p.requires))));
  assert.deepEqual(g1.readiness.filter(r => !used.has(r.code)).map(r => r.code), [], 'a readiness skill no Grade 1 skill needs');
  const reaching = g1.sub_strands.flatMap(s => s.skills).filter(k => k.prerequisites.some(p => p.requires.startsWith('MATH.PP2.')));
  assert.ok(reaching.length >= 15, `only ${reaching.length} Grade 1 skills reach down to pre-primary`);
  const sql = readFileSync(new URL('../supabase/migrations/20261124_maths_g1_skills_misconceptions.sql', import.meta.url), 'utf8');
  assert.ok(!/INSERT INTO public\.curriculum_skills [^\n]*'MATH\.PP2\./.test(sql), 'a readiness skill is loaded as a Grade 1 skill');
});
