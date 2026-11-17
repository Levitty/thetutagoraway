// Grade 7 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g7.json): skills, prerequisites,
// misconceptions, the question families filed under them and the teaching pack. Everything here is draft: a family nobody
// has signed off reaches no child. A sub-strand counts as done once it has skills; the others are listed by the last test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILIES } from '../engine/scripts/family_checks.mjs';
import { SKILLS_G7, OUTCOMES_G7, SUBSTRANDS_G7, horebOf7 } from '../src/ai-tutor/content/curriculumMap.g7.js';
import { SKILLS_G6 } from '../src/ai-tutor/content/curriculumMap.g6.js';
import { SKILLS_G5 } from '../src/ai-tutor/content/curriculumMap.g5.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { buildPack, renderData, loadSources } from '../scripts/build-teaching-pack.mjs';
import { teachingFor } from '../src/voice-tutor/teachingPack.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/mathematics/g7.json', import.meta.url), 'utf8'));
const lib = JSON.parse(readFileSync(new URL('../engine/data/curriculum/g7.misconceptions.json', import.meta.url), 'utf8'));
const done = source.sub_strands.filter(s => s.skills.length);
const mine = FAMILIES.filter(f => /^MATH\.G7\./.test(f.cskill || ''));
const NOT_TESTED = /^(appreciate|reflect on|promote use|recogni[sz]e use|use IT|recogni[sz]e temperature)/;

test('the in-app map is generated from the file HOREB owns, whole', () => {
  assert.equal(Object.keys(SUBSTRANDS_G7).length, source.sub_strands.length);
  assert.equal(Object.keys(OUTCOMES_G7).length, 117);
  assert.equal(Object.keys(SKILLS_G7).length, source.totals.skills);
  assert.equal(Object.keys(lib).length, source.totals.misconceptions);
  for (const [c, k] of Object.entries(SKILLS_G7)) {
    assert.ok(SKILLS[k.primary], `${c}: HOREB skill ${k.primary} does not exist`);
    assert.ok(k.outcomes.every(o => OUTCOMES_G7[o]), `${c}: unknown outcome`);
    assert.ok(horebOf7(c).includes(k.primary));
    for (const p of k.pre) assert.ok(SKILLS_G7[p] || SKILLS_G6[p] || SKILLS_G5[p], `${c}: unknown prerequisite ${p}`);
  }
});

test('every testable official outcome of a finished sub-strand has a skill; only attitude outcomes are left out', () => {
  for (const s of done) {
    const covered = new Set(s.skills.flatMap(k => k.outcomes));
    const left = s.outcomes.filter(o => !covered.has(o.code) && !NOT_TESTED.test(o.text));
    assert.deepEqual(left.map(o => o.code), [], `${s.code}: outcomes with no skill`);
  }
});

test('every skill has a mastery rule, question forms, prerequisites that reach Grade 6 or 5, and at least two misconceptions', () => {
  let down = 0;
  for (const s of done) for (const k of s.skills) {
    assert.ok(k.mastery.length > 60 && k.question_forms.length >= 3, `${k.code}: thin`);
    assert.ok(k.prerequisites.length >= 1 && k.prerequisites.every(p => p.status === 'proposed' && p.reason.length > 10), `${k.code}: prerequisites`);
    assert.ok(s.misconceptions.filter(m => m.skill === k.code).length >= 2, `${k.code}: fewer than 2 misconceptions`);
    assert.equal(k.status, 'proposed');
    if (k.prerequisites.some(p => /^MATH\.G[56]\./.test(p.requires))) down++;
  }
  assert.ok(down >= done.reduce((n, s) => n + s.skills.length, 0) * 0.6, 'most skills reach down to Grade 5 or 6');
});

test('every misconception has all its fields, a source line, and is a draft', () => {
  for (const m of Object.values(lib)) {
    assert.ok(/to be confirmed by a teacher|to confirm by a teacher|^widely reported|literature/i.test(m.source), `${m.error.slice(0, 40)}: no source line`);
    assert.equal(m.status, 'draft');
    assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer && m.cause && m.reveals && m.help && m.error);
    assert.notEqual(m.example.wrong_answer, m.example.correct_answer);
  }
});

test('a Grade 7 family carries its curriculum skill, an official outcome of that skill, and a HOREB skill the map names', () => {
  assert.ok(mine.length >= 13, `only ${mine.length} Grade 7 families are filed under the curriculum map`);
  for (const f of mine) {
    const k = SKILLS_G7[f.cskill];
    assert.ok(k, `${f.id}: unknown cskill ${f.cskill}`);
    assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
    assert.ok(horebOf7(f.cskill).includes(f.skill), `${f.id}: HOREB skill ${f.skill} is not mapped to ${f.cskill}`);
    assert.equal(f.reviewed, false, `${f.id}: nobody has signed this off`);
  }
});

test('no Grade 7 family is left under an old outcome code in a finished sub-strand', () => {
  // the segment after g7. in a family id names its sub-strand
  const SEG = { whole: 'WHOLE_NUMBERS', factors: 'FACTORS', frac: 'FRACTIONS', dec: 'DECIMALS', sq: 'SQUARES_AND_SQUARE_ROOTS', expr: 'ALGEBRAIC_EXPRESSIONS', eq: 'LINEAR_EQUATIONS', ineq: 'LINEAR_INEQUALITIES', pyth: 'PYTHAGOREAN_RELATIONSHIP', length: 'LENGTH', area: 'AREA', vol: 'VOLUME_AND_CAPACITY', speed: 'TIME_DISTANCE_AND_SPEED', temp: 'TEMPERATURE', money: 'MONEY', angles: 'ANGLES', construct: 'GEOMETRICAL_CONSTRUCTION', data: 'DATA_HANDLING' };
  const left = FAMILIES.filter(f => /^g7\./.test(f.id) && !f.cskill).map(f => f.id.split('.')[1]);
  const inDone = left.filter(k => SEG[k] && done.some(s => s.code.endsWith('.' + SEG[k])));
  assert.deepEqual([...new Set(inDone)], []);
});

test('the Grade 7 teaching pack covers every skill and every library misconception of a finished sub-strand', () => {
  const packed = new Set(loadSources(7).flatMap(s => s.skills.flatMap(e => e.misconceptions.map(m => m.code))));
  for (const s of done) {
    for (const k of s.skills) assert.ok(teachingFor(k.code), `no pack entry for ${k.code}`);
    for (const m of s.misconceptions) assert.ok(packed.has(m.code), `no reveal question and repair for ${m.code}`);
  }
});

test('the generated Grade 7 teaching pack matches the JSON (run node scripts/build-teaching-pack.mjs)', () => {
  const onDisk = readFileSync(new URL('../src/voice-tutor/teachingPackData.g7.js', import.meta.url), 'utf8');
  assert.equal(onDisk, renderData(buildPack(7), 7), 'teachingPackData.g7.js is stale');
});
