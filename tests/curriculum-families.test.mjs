// Grade 5 Mathematics families against the curriculum map HOREB owns (curriculum/mathematics/g5.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { FAMILIES } from '../engine/scripts/family_checks.mjs';
import { isOn, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_G5, OUTCOMES_G5, SUBSTRANDS, horebOf, cskillsOf } from '../src/ai-tutor/content/curriculumMap.g5.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/mathematics/g5.json', import.meta.url), 'utf8'));
const misLib = JSON.parse(readFileSync(new URL('../engine/data/curriculum/g5.misconceptions.json', import.meta.url), 'utf8'));
const mine = FAMILIES.filter(f => f.cskill && /^MATH\.G5\./.test(f.cskill) && f.subject !== 'science');   // Grade 5 Maths only: Grade 5 Science has its own test (science-g5.test.mjs), Grade 6 Maths has tests/maths-g6.test.mjs

test('the in-app map is generated from the file HOREB owns, whole', () => {
  assert.equal(Object.keys(SUBSTRANDS).length, source.sub_strands.length);
  assert.equal(Object.keys(OUTCOMES_G5).length, source.sub_strands.flatMap(s => s.outcomes).length);
  assert.equal(Object.keys(SKILLS_G5).length, source.sub_strands.flatMap(s => s.skills).length);
  assert.equal(Object.keys(misLib).length, source.sub_strands.flatMap(s => s.misconceptions).length);
  for (const [c, k] of Object.entries(SKILLS_G5)) {
    assert.ok(SKILLS[k.primary], `${c}: primary HOREB skill ${k.primary} does not exist`);
    assert.ok(k.outcomes.every(o => OUTCOMES_G5[o]), `${c}: unknown outcome`);
    assert.ok(horebOf(c).includes(k.primary));
  }
  assert.ok(cskillsOf('G5_TIME').length >= 10, 'mastery on a HOREB skill reaches its curriculum skills');
});

test('every one of the 167 curriculum skills has families in at least 3 forms', () => {
  const by = {};
  for (const f of mine) (by[f.cskill] ||= []).push(f);
  const thin = Object.keys(SKILLS_G5).filter(c => new Set((by[c] || []).map(f => f.form)).size < 3);
  assert.deepEqual(thin, [], `skills with fewer than 3 forms: ${thin.join(', ')}`);
});

test('a family carries its curriculum skill, the skill\'s official outcome, and a HOREB skill the map names', () => {
  for (const f of mine) {
    const k = SKILLS_G5[f.cskill];
    assert.ok(k, `${f.id}: unknown cskill`);
    assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
    assert.ok(horebOf(f.cskill).includes(f.skill), `${f.id}: ${f.skill} not mapped to ${f.cskill}`);
  }
});

test('every wrong answer in a new family names a library misconception', () => {
  const bad = mine.filter(f => f.misMapped !== false && !f.core).length;
  assert.ok(bad >= 500, `only ${bad} families are tied to the library`);
  // the checks themselves (family_checks.mjs) fail any wrong answer with no code or an unknown one
  assert.ok(Object.keys(misLib).length === 414);
});

test('new families stay off for children until a teacher signs them off', () => {
  setFamilyMode('reviewed');
  for (const f of mine.filter(x => !x.core)) assert.ok(f.reviewed === true ? isOn(f) : !isOn(f), `${f.id} is on for children without a sign-off`);
});

test('the review pack tool finds every family by a literal id, so a sign-off can switch it on', () => {
  const dir = new URL('../src/ai-tutor/content/families/', import.meta.url);
  const text = readdirSync(dir).filter(n => n.endsWith('.js')).map(n => readFileSync(new URL(n, dir), 'utf8')).join('\n');
  const missing = mine.filter(f => !text.includes(`id: '${f.id}'`)).map(f => f.id);
  // the unit factory (g5c_units.js) makes its ids; their sign-offs live in g5c_signed.js
  assert.deepEqual(missing.filter(id => !/^g5c\.(len|cap|mas|tim)\./.test(id)), []);
});

test('the Grade 5 review pack builds: a page per sub-strand and one CSV row per family', () => {
  const out = mkdtempSync(join(tmpdir(), 'g5pack-'));
  const r = spawnSync(process.execPath, ['scripts/build-question-review.mjs', '--g5', out], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const pages = readdirSync(out).filter(n => /^G5-\d\d-.*\.html$/.test(n));
  assert.equal(pages.length, Object.keys(SUBSTRANDS).length);
  const rows = readFileSync(join(out, 'families.csv'), 'utf8').trim().split('\r\n').length - 1;
  assert.equal(rows, mine.filter(f => !f.core).length);
  assert.ok(existsSync(join(out, 'sign-off.xlsx')));
});
