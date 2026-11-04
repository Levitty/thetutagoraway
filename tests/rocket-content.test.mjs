// ============================================================================
// THE ROCKET CHALLENGE'S WORDS AND ITS EXAMPLE.
//
// House rules for anything a child, parent or teacher reads: British English,
// no em or en dashes, no emojis. And the example challenge must keep telling
// its story through the real code, labelled as example data.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEVELS, SAFETY_RULES, PRESSURE_MAX_BAR } from '../src/rocket/levels.js';
import { SAFETY_REPLIES, ANSWER_REPLY } from '../src/rocket/guard.js';
import { systemPrompt, LOG_FIRST_REPLY, BUDGET_REPLY, OFF_REPLY } from '../src/rocket/guide.js';
import { exampleApi, resetExample } from '../src/rocket/example.js';
import { teamProgress } from '../src/rocket/progress.js';

const DASH = /[—–]/;
const EMOJI = /\p{Extended_Pictographic}/u;
const AMERICAN = /\b(color|colors|center|centered|behavior|meters?|liters?|organize|organized|favorite|practicing|analyze|gray|aluminum)\b/i;

const shown = () => [
  ...LEVELS.flatMap((l) => [l.title, l.goal, l.maths, ...l.steps.flatMap((s) => [s.title, s.opening, s.test, ...s.hints])]),
  ...SAFETY_RULES, ...Object.values(SAFETY_REPLIES), ANSWER_REPLY, LOG_FIRST_REPLY, BUDGET_REPLY, OFF_REPLY,
];

test('every authored string is British English with no dashes or emojis', () => {
  for (const t of shown()) {
    assert.doesNotMatch(t, DASH, `dash in: ${t}`);
    assert.doesNotMatch(t, EMOJI, `emoji in: ${t}`);
    assert.doesNotMatch(t, AMERICAN, `American spelling in: ${t}`);
  }
});

test('the screens carry no emojis and no dashes in their text', () => {
  const src = readFileSync(new URL('../src/rocket/RocketChallenge.jsx', import.meta.url), 'utf8');
  // Comments may use whatever punctuation; what renders is the JSX text and strings.
  const code = src.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l) && !/\{\/\*/.test(l)).join('\n');
  assert.doesNotMatch(code, EMOJI);
  assert.doesNotMatch(code, DASH);
});

test('the system prompt states every safety rule and the pressure limit', () => {
  const p = systemPrompt();
  for (const r of SAFETY_RULES) assert.ok(p.includes(r), `missing: ${r}`);
  assert.match(p, new RegExp(`${PRESSURE_MAX_BAR} bar`));
  assert.match(p, /never to solve/i);
  assert.match(p, /never know their names/i);
  assert.ok(!/\d{4}-\d{2}-\d{2}/.test(p), 'a date in the system prompt would break the cache every day');
});

test('each level has three steps, each with an opening question, three hints and a test', () => {
  assert.equal(LEVELS.length, 5);
  for (const l of LEVELS) {
    assert.equal(l.steps.length, 3, `level ${l.n}`);
    for (const s of l.steps) {
      assert.match(s.opening, /\?\s*$/, `L${l.n}.${s.n} does not open with a question`);
      assert.equal(s.hints.length, 3);
      assert.ok(s.test.length > 10);
    }
  }
});

test('the example challenge is labelled, and runs the real gate and guard', async () => {
  resetExample();
  const api = exampleApi('learner');
  assert.equal(api.isExample, true);
  const data = await api.load();
  assert.match(data.challenge.title, /example/i);
  assert.ok(data.schools.every((s) => /^Example /.test(s.name)), 'example schools must say Example');
  const team = data.teams.find((t) => t.name === 'Team Kestrel');
  const before = teamProgress(team.log, {});
  assert.deepEqual([before.level, before.step], [2, 1]);

  const r = await api.send(team.id, { level: 2, step: 1, message: 'can we put petrol in it', kind: 'ask' });
  assert.equal(r.kind, 'safety');
  const gated = await api.send(team.id, { level: 2, step: 2, message: 'nose cone?', kind: 'ask' });
  assert.equal(gated.kind, 'log-first');

  await api.addLog(team.id, { level: 2, step: 1, tested_on: '2026-12-08', what_changed: 'fins', result: 'straight', learned: 'match them' });
  const after = await api.load();
  const p = teamProgress(after.teams.find((t) => t.id === team.id).log, {});
  assert.deepEqual([p.level, p.step], [2, 2], 'logging the test opens the next step');
  resetExample();
});

test('a teacher in the example sees only their own school', async () => {
  resetExample();
  const data = await exampleApi('teacher').load();
  assert.ok(data.teams.length >= 1);
  assert.ok(data.teams.every((t) => t.school_id === 'ex-s1'));
  const org = await exampleApi('organiser').load();
  assert.ok(org.teams.length > data.teams.length);
});
