// ============================================================================
// THE GATE: "a team must record each test in its design log before HOREB
// helps with the next step". A team's place is worked out from its log, never
// stored, so these tests hold the one function every screen and the edge
// function use.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { teamProgress, mayHelp, validateEntry, logSummary, mathsMastered, judgingInputs } from '../src/rocket/progress.js';
import { LEVELS, PRESSURE_MAX_BAR, JUDGING, allChallengeSkills } from '../src/rocket/levels.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const log = (level, step) => ({ level, step, tested_on: '2026-12-01', what_changed: 'x', result: 'y', learned: 'z', water_ml: 500 });
const everyStep = (upTo) => LEVELS.filter((l) => l.n <= upTo).flatMap((l) => l.steps.map((s) => log(l.n, s.n)));

test('a new team is on level 1, step 1, with only level 1 open', () => {
  const p = teamProgress([]);
  assert.equal(p.level, 1);
  assert.equal(p.step, 1);
  assert.deepEqual(p.levels.map((l) => l.open), [true, false, false, false, false]);
});

test('HOREB will not help with step 2 until step 1 has a logged test', () => {
  assert.deepEqual(mayHelp(teamProgress([]), 1, 2), { ok: false, reason: 'log-first' });
  const p = teamProgress([log(1, 1)]);
  assert.equal(p.step, 2);
  assert.equal(mayHelp(p, 1, 2).ok, true);
  assert.equal(mayHelp(p, 1, 3).reason, 'log-first');
});

test('a level opens only when every step of the one before is logged', () => {
  const almost = everyStep(1).slice(0, -1);
  assert.equal(teamProgress(almost).levels[1].open, false);
  assert.equal(mayHelp(teamProgress(almost), 2, 1).reason, 'closed');
  const p = teamProgress(everyStep(1));
  assert.equal(p.levels[1].open, true);
  assert.equal(p.level, 2);
  assert.equal(p.step, 1);
});

test('a teacher can open a level early (a lab day), without skipping the log for it', () => {
  const p = teamProgress([], { openedLevel: 3 });
  assert.deepEqual(p.levels.map((l) => l.open), [true, true, true, false, false]);
  assert.equal(p.level, 1, 'the team still starts where its log says');
  assert.equal(mayHelp(p, 3, 1).ok, true);
});

test('logging every step of every level finishes the challenge', () => {
  const p = teamProgress(everyStep(5));
  assert.equal(p.finished, true);
  assert.ok(p.levels.every((l) => l.complete));
});

test('the log refuses a pressure over the limit, and asks for the essentials', () => {
  const ok = validateEntry({ ...log(1, 1), pressure_bar: PRESSURE_MAX_BAR });
  assert.equal(ok.ok, true, JSON.stringify(ok.errors));
  const high = validateEntry({ ...log(1, 1), pressure_bar: PRESSURE_MAX_BAR + 0.5 });
  assert.match(high.errors.pressure_bar, /Never above/);
  const empty = validateEntry({ level: 1, step: 1 });
  for (const k of ['tested_on', 'what_changed', 'result', 'learned']) assert.ok(empty.errors[k], `${k} not required`);
});

test('every linked maths skill exists in HOREB, so mastery counts', () => {
  for (const id of allChallengeSkills()) assert.ok(SKILLS[id], `${id} is not a HOREB skill`);
  for (const l of LEVELS) assert.ok(l.skills.length >= 3, `level ${l.n} links too few skills`);
});

test('the maths input counts only linked skills mastered since the start', () => {
  const skills = {
    G6_MEAN: { mastered: true, masteredAt: '2026-12-03T10:00:00Z' },
    G5_CAPACITY: { mastered: true, masteredAt: '2026-10-01T10:00:00Z' },
    G4_ADD: { mastered: true, masteredAt: '2026-12-03T10:00:00Z' },
    G9_TRIG_INTRO: { mastered: false },
  };
  assert.deepEqual(mathsMastered(skills, '2026-12-01'), ['G6_MEAN']);
});

test('judging shows inputs and weights, never a total or a rank', () => {
  assert.equal(JUDGING.reduce((s, j) => s + j.weight, 0), 100);
  const j = judgingInputs({ entries: [log(1, 1)], members: [{ label: 'A', mastered: ['G6_MEAN'] }] });
  assert.equal(j.log.tests, 1);
  assert.equal(j.log.complete, 1);
  assert.ok(!('total' in j) && !('rank' in j) && !('score' in j));
  assert.deepEqual(logSummary([]), { tests: 0, complete: 0, withPhoto: 0, levelsLogged: 0 });
});
