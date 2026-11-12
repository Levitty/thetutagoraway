// The subject registry (src/ai-tutor/content/subjects/): adding a subject-grade is adding files, never editing shared ones.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { SUBJECT_GRADES, entryFor, entryOfCskill, allFamilies, bankFamilies, familiesOutsideBank, SUBJECT_ORDER, subjectDef } from '../src/ai-tutor/content/subjects/registry.js';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { GRADE_FAMILIES } from '../src/ai-tutor/content/families/bank.js';
import { ENGLISH_FAMILIES } from '../src/ai-tutor/content/families/english.js';
import { isSigned } from '../src/ai-tutor/content/families/core.js';
import { subjectOfCskill, SUBJECT_IDS, SUBJECT_PREFIXES } from '../src/learner/subject.js';
import { SUBJECT_DEFS, EXTRA_SUBJECTS } from '../src/ai-tutor/subjectPractice.js';

const root = new URL('..', import.meta.url).pathname;

test('the generated registry files are up to date with the entry files', () => {
  const out = execFileSync('node', ['scripts/build-subject-registry.mjs', '--check'], { cwd: root, encoding: 'utf8' });
  assert.match(out, /up to date/);
});

test('Science Grade 5 and English Grade 5 are the registry entries they were, with the same families', () => {
  // Other builders add subject-grades beside these two: the two stay as they were, the list may grow.
  const names = SUBJECT_GRADES.map(e => `${e.subject}_g${e.grade}`);
  for (const n of ['english_g5', 'science_g5']) assert.ok(names.includes(n), `${n} is a registry entry`);
  assert.equal(entryFor('science', 5).families.length, 84);
  assert.equal(entryFor('english', 5).families.length, 114);
  assert.deepEqual(SUBJECT_ORDER.slice(0, 2), ['science', 'english']);
  assert.deepEqual(SUBJECT_IDS.slice(0, 3), ['math', 'science', 'english']);
  for (const [k, v] of Object.entries({ MATH: 'math', SCIE: 'science', ENGL: 'english' })) assert.equal(SUBJECT_PREFIXES[k], v);
  assert.equal(subjectOfCskill('SCIE.G5.X.Y.Z'), 'science');
  assert.equal(subjectOfCskill('ENGL.G5.X.Y.Z'), 'english');
});

test('the bank holds the science families (as before) and not the English ones; English keeps its own list', () => {
  const sci = entryFor('science', 5).families;
  assert.deepEqual(bankFamilies(), sci);
  assert.deepEqual(GRADE_FAMILIES.slice(0, sci.length), sci);   // first in the grade bank, as SCIENCE_G5 was
  assert.equal(FAMILIES.filter(f => f.subject === 'science').length, 84);
  assert.equal(FAMILIES.filter(f => f.subject === 'english').length, 0);
  const outside = familiesOutsideBank();   // every family of an entry that is not in the bank: English, and any subject-grade added since
  for (const f of entryFor('english', 5).families) assert.ok(outside.includes(f), `${f.id} is outside the bank`);
  assert.ok(!outside.some(f => f.subject === 'science'));
  assert.deepEqual(ENGLISH_FAMILIES, entryFor('english', 5).families);
});

test('every entry is complete and every family sits in its own entry', async () => {
  const ids = new Set();
  for (const e of SUBJECT_GRADES) {
    assert.ok(e.families.length > 0, `${e.subject} g${e.grade} has families`);
    for (const f of e.families) {
      assert.ok(!ids.has(f.id), `duplicate family id ${f.id}`);
      ids.add(f.id);
      assert.equal(f.subject, e.subject, f.id);
      assert.equal(entryOfCskill(f.cskill), e, `${f.id} belongs to ${e.subject} g${e.grade}`);
      assert.ok(e.map.skills[f.cskill], `${f.id}: cskill in the map`);
      assert.ok(e.map.outcomes[f.outcome], `${f.id}: outcome in the map`);
    }
    // the declared family files hold exactly the entry's families
    const declared = [];
    for (const file of e.familyFiles) {
      assert.ok(existsSync(new URL(`../src/ai-tutor/content/families/${file}`, import.meta.url)), `${file} exists`);
      declared.push(...(await import(`../src/ai-tutor/content/families/${file}`)).FAMILIES);
    }
    assert.deepEqual(declared.map(f => f.id).sort(), e.families.map(f => f.id).sort(), `${e.subject} g${e.grade}: familyFiles match families`);
  }
  assert.equal(allFamilies().length, ids.size);
});

test('no registry family is on for children while no signed list has an id (the one rule)', () => {
  for (const e of SUBJECT_GRADES) assert.deepEqual(e.signed, [], `${e.signedFile} is empty`);
  assert.equal(allFamilies().filter(isSigned).length, 0);
  for (const s of Object.values(EXTRA_SUBJECTS)) assert.equal(s.skillCount, 0);
});

test('the practice engine reads its subjects from the registry', () => {
  assert.deepEqual(Object.keys(SUBJECT_DEFS).slice(0, 2), ['science', 'english']);
  assert.equal(SUBJECT_DEFS.science.description, 'Grade 5 Science and Technology from the CBC design');
  assert.equal(Object.keys(subjectDef('science').map).length, 33);
  assert.equal(Object.keys(subjectDef('english').map).length, 41);
});

test('the phone-bundle list names every family file and its signed list', async () => {
  const strip = (await import('../src/ai-tutor/content/subjects/strip.generated.js')).default;
  for (const e of SUBJECT_GRADES) for (const f of e.familyFiles) assert.equal(strip[f], e.signedFile);
});
