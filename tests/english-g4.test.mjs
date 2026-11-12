// English Grade 4: skills, misconception library and question families (curriculum/english/g4.json).
// All draft and off for children until a Kenyan English teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { textFailures, checkTextForms } from '../engine/scripts/english_checks.mjs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.english.g4.js';
import { entryFor } from '../src/ai-tutor/content/subjects/registry.js';
import { isOn, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { PASSAGES, VISUALS } from '../src/ai-tutor/content/families/english_g4_passages.js';
import { SIGNED } from '../src/ai-tutor/content/families/english_g4_signed.js';
import { readingStats } from '../scripts/lib/item-precheck.mjs';
import { routeOf } from '../scripts/data/english-g4-routes.mjs';

const source = JSON.parse(readFileSync(new URL('../curriculum/english/g4.json', import.meta.url), 'utf8'));
const g3 = JSON.parse(readFileSync(new URL('../curriculum/english/g3.json', import.meta.url), 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/english/g5.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;
const entry = entryFor('english', 4);
const G3_OUT = new Set(g3.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const G5_SKILLS = new Set(g5.sub_strands.flatMap(s => (s.skills || []).map(k => k.code)));

test('the in-app map is generated from the file HOREB owns, and the official outcomes and KICD rubrics are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 177);
  assert.equal(Object.keys(SKILLS).length, subs.flatMap(s => s.skills).length);
  assert.equal(Object.keys(MIS_FEEDBACK).length, subs.flatMap(s => s.misconceptions).length);
  assert.equal(source.totals.outcomes, 177);
  assert.equal(source.totals.skills, Object.keys(SKILLS).length);
  assert.equal(source.totals.misconceptions, subs.flatMap(s => s.misconceptions).length);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
  assert.equal(source.rubrics.length, 3);
  for (const r of source.rubrics) assert.ok(r.indicators.length >= 3 && r.indicators.every(i => i.levels.EE && i.levels.ME && i.levels.AE && i.levels.BE), `${r.code}: rubric changed`);
});

test('skills reach back to Grade 3 English and forward to Grade 5 English, and the library has the fields a reviewer needs', () => {
  let toG3 = 0, toG5 = 0;
  for (const s of subs) {
    for (const k of s.skills) {
      assert.equal(k.status, 'proposed');
      assert.ok(k.mastery && k.question_forms.length >= 2 && k.thinking.length, `${k.code}: mastery, forms or thinking missing`);
      assert.ok(k.outcomes.length && k.outcomes.every(o => OUTCOMES[o]), `${k.code}: unknown outcome`);
      for (const p of k.prerequisites) {
        if (p.kind === 'outcome') { assert.ok(G3_OUT.has(p.requires), `${k.code}: ${p.requires} is not a Grade 3 outcome`); toG3++; } else assert.ok(SKILLS[p.requires], `${k.code}: unknown prerequisite ${p.requires}`);
      }
      for (const c of k.leads_to) { assert.ok(G5_SKILLS.has(c), `${k.code}: ${c} is not a Grade 5 skill`); toG5++; }
      assert.ok((SKILLS[k.code].mis || []).length >= 2, `${k.code}: fewer than two library entries`);
    }
    for (const m of s.misconceptions) {
      assert.equal(m.status, 'draft');
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(m[f] && String(m[f]).length > 5, `${m.code}: ${f} missing`);
      assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer, `${m.code}: example incomplete`);
      assert.ok(!/—/.test(JSON.stringify(m)), `${m.code}: em dash`);
    }
  }
  assert.ok(toG3 >= 40 && toG5 >= 30, `prerequisites to Grade 3 (${toG3}) and leads_to Grade 5 (${toG5})`);
});

test('every English Grade 4 skill has families in at least two different structures, and every family passes its checks', () => {
  assert.deepEqual(checkTextForms(entry.families, entry.map.skills), []);
  const fails = textFailures(60).filter(x => x.startsWith('english4.'));
  assert.deepEqual(fails, [], `\n${fails.slice(0, 40).join('\n')}\n`);
});

test('English Grade 4 families are text-marked, named english4., off for children and out of the Maths bank', () => {
  setFamilyMode('reviewed');
  assert.deepEqual(SIGNED, []);
  for (const f of entry.families) {
    assert.ok(f.id.startsWith('english4.') && f.marker === 'text' && f.grade === 4 && f.subject === 'english');
    assert.ok(f.reviewed === false && f.draft === true && isOn(f) === false, `${f.id} is on for children without a sign-off`);
    assert.ok(f.cskill.startsWith('ENGL.G4.'));
  }
  assert.ok(!FAMILIES.some(f => String(f.id).startsWith('english4.')));
});

test('the passages are original, short and readable by a nine-year-old', () => {
  assert.ok(PASSAGES.length >= 8 && VISUALS.length >= 5);
  for (const p of [...PASSAGES, ...VISUALS]) {
    const s = readingStats(p.text);
    assert.ok(s.fk <= 6 && s.longest <= 22, `${p.id}: grade ${s.fk.toFixed(1)}, longest sentence ${s.longest}`);
    assert.ok(p.text.length <= 1100, `${p.id}: too long for a phone`);
    assert.ok(!/—/.test(p.text));
  }
});

test('outcomes a question cannot test are routed to composition marking, a voice check, a teacher or attitude', () => {
  const o = (text, strand = 'Writing', sub_strand = 'Creative Writing (Theme 5)') => routeOf({ text }, { strand, sub_strand });
  assert.equal(o('create a narrative composition of about 60-80 words for self-expression'), 'composition');
  assert.equal(o('write a diary in the right format for effective communication', 'Writing', 'Guided Composition (Theme 12: Clean environment)'), 'composition');
  assert.equal(o('write legibly and neatly in print script for clarity of communication', 'Writing', 'Mechanics of Writing: Handwriting (Theme 3)'), 'teacher');
  assert.equal(o('pronounce words with the target sounds accurately', 'Listening and Speaking', 'Pronunciation (Theme 2)'), 'voice');
  assert.equal(o('read a text of about 300 words accurately, at the right speed and with expression', 'Reading', 'Reading Fluency (Theme 8)'), 'voice');
  assert.equal(o('realise the importance of filling forms correctly', 'Writing', 'Functional writing (Theme 1)'), 'attitude');
});
