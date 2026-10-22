// ============================================================================
// THE DEMO MUST STILL TELL ITS STORY
//
// The demo class exists to show one thing: three children failing three
// DIFFERENT skills, for one shared reason. That finding is produced by the
// live engine from these answer histories, which means a change to the engine
// or to the knowledge graph could quietly dismantle it — and nobody would know
// until it was on a screen in front of a room.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { demoStudents, demoClasses, demoMembers, demoAssignments } from '../src/ai-tutor/demoClass.js';
import { classGaps } from '../src/ai-tutor/adaptiveEngine.js';
import { assignmentRoster } from '../src/ai-tutor/assignments.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const learners = () => demoStudents().map(s => ({ id: s.userId, name: s.name, progress: s.progress }));

test('the shared foundation is still what leads the board', () => {
  const rows = classGaps(learners());
  assert.ok(rows.length, 'the demo class produced no gaps at all');
  assert.equal(rows[0].id, 'G4_PLACE_VALUE',
    `the demo leads with ${rows[0].id}, not the shared foundation it was built to show`);
  assert.equal(rows[0].count, 3, `${rows[0].count} children on the top row, not three`);
  assert.deepEqual(
    [...rows[0].blocked, ...rows[0].failing].map(l => l.name).sort(),
    ['Amani Otieno', 'Baraka Kimani', 'Chipo Wanjiru'],
  );
});

test('the three are failing three different skills, which is the point', () => {
  const three = demoStudents().filter(s => /Amani|Baraka|Chipo/.test(s.name));
  const failing = three.map(s =>
    Object.entries(s.progress.skills).filter(([, v]) => !v.mastered).map(([k]) => k).sort().join());
  assert.equal(new Set(failing).size, 3, 'the three children are stuck on the same skill, so the demo shows nothing');
});

test('the class is not a wall of red', () => {
  // A roster where everybody is failing persuades nobody. There must be
  // somebody doing well and somebody ahead.
  const all = demoStudents();
  const strong = all.filter(s => Object.values(s.progress.skills).filter(v => v.mastered).length > 60);
  assert.ok(strong.length >= 3, `only ${strong.length} children are doing well`);
});

test('every skill the demo names is a real skill', () => {
  for (const s of demoStudents()) {
    for (const id of Object.keys(s.progress.skills)) {
      assert.ok(SKILLS[id], `${s.name} has progress on ${id}, which is not a skill`);
    }
  }
  for (const a of demoAssignments()) {
    for (const id of a.skill_ids) assert.ok(SKILLS[id], `assignment "${a.title}" names ${id}, which is not a skill`);
  }
});

test('the work set is partly done, so the three groups all have somebody in them', () => {
  const roster = assignmentRoster(demoAssignments()[0], learners());
  assert.ok(roster.done.length > 0, 'nobody has finished the set work');
  assert.ok(roster.notStarted.length > 0, 'everybody has finished it, so there is nothing to show');
});

test('the roster and the class line up', () => {
  const ids = new Set(demoStudents().map(s => s.userId));
  const cls = demoClasses()[0].id;
  for (const m of demoMembers()) {
    assert.equal(m.class_id, cls);
    assert.ok(ids.has(m.student_id), `${m.student_id} is in the class but not on the roster`);
  }
  assert.equal(demoMembers().length, ids.size);
});
