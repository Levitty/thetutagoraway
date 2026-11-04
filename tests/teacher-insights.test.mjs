// The teacher screens' findings: grouping by missing step, the sources and
// "how sure" lines, and the three versions of one piece of practice.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS } from '../src/ai-tutor/subjects.js';
import { demoSchool } from '../src/ai-tutor/demoClass.js';
import { demoStudents, demoClasses, demoMembers } from '../src/ai-tutor/demoClass.js';
import {
  recordEvidence, evidenceFor, missingStepGroups, classHeadline, homeSuggestion,
  practiceVersions, practiceRows, groupPattern,
} from '../src/ai-tutor/teacherInsights.js';
import { assignmentStruggles } from '../src/ai-tutor/struggles.js';
import { rowToProgress } from '../src/ai-tutor/classView.js';

const ctx = { skills: SUBJECTS.math.skills, getPostReqs: SUBJECTS.math.getPostReqs };
const school = demoSchool();
const classOf = (id) => {
  const ids = new Set(school.members.filter(m => m.class_id === id).map(m => m.student_id));
  return school.students.filter(s => ids.has(s.userId))
    .map(s => ({ id: s.userId, name: s.name, progress: s.progress, updatedAt: s.updatedAt }));
};
const G6 = 'demo-class-grade-6';

test('evidence: practice and free check are told apart, never invented', () => {
  assert.equal(recordEvidence({ attempts: 5, correct: 1 }), 'practice');
  assert.equal(recordEvidence({ attempts: 1, correct: 0, fromDiagnostic: true, passed: false }), 'check');
  assert.equal(recordEvidence({ attempts: 5, correct: 5, mastered: true }), null);
  assert.equal(recordEvidence(undefined), null);
  const e = evidenceFor([
    { progress: { skills: { A: { attempts: 4, correct: 1 } } }, skillIds: ['A'] },
    { progress: { skills: { A: { attempts: 1, correct: 0, fromDiagnostic: true, passed: false } } }, skillIds: ['A'] },
  ]);
  assert.equal(e.source, 'Free check and practice');
  assert.match(e.sure, /1 with 3 or more tries under 60% right; 1 wrong in the free check/);
  const none = evidenceFor([{ progress: { skills: {} }, skillIds: ['A'] }]);
  assert.equal(none.source, null);
  assert.equal(none.sure, null);
});

test('one class grouped by missing step: every learner once, foundations first', () => {
  const ls = classOf(G6);
  const groups = missingStepGroups(ls, ctx);
  const placed = groups.flatMap(g => g.learners.map(l => l.id));
  assert.equal(placed.length, ls.length);
  assert.equal(new Set(placed).size, ls.length);
  assert.equal(groups[0].kind, 'foundation');
  assert.equal(groups[0].skill.id, 'G5_FRACTIONS_EQUIV');
  assert.equal(groups[0].learners.length, 9);
  assert.ok(groups[0].above.some(s => s.id === 'G6_FRACTIONS_ADD'));
  assert.equal(groups[0].evidence.source, 'Practice');
  const s = groups.find(g => g.kind === 'struggling');
  assert.equal(s.skill.id, 'G6_FRACTIONS_ADD');
  assert.equal(s.learners.length, 3);
  assert.equal(groups[groups.length - 1].kind, 'clear');
  assert.equal(groups[groups.length - 1].learners.length, 19);
});

test('quiet learners are marked inside their group', () => {
  const groups = missingStepGroups(classOf(G6), ctx);
  const quiet = groups.flatMap(g => g.learners).filter(l => l.quiet);
  assert.equal(quiet.length, 2);
});

test('class headline: the skill, the line, the reason and its source', () => {
  const h = classHeadline(classOf(G6), ctx);
  assert.equal(h.skill.id, 'G6_FRACTIONS_ADD');
  assert.equal(h.line, '12 of 31 are getting it wrong.');
  assert.match(h.reason, /^9 of the 12 never mastered Equivalent Fractions \(Grade 5\)/);
  assert.equal(h.evidence.source, 'Practice');
  assert.equal(h.foundation.id, 'G5_FRACTIONS_EQUIV');
  assert.equal(h.foundation.ids.length, 9);
  assert.equal(classHeadline([], ctx), null);
});

test('home suggestion picks the largest missing foundation across classes', () => {
  const classes = school.classes.map(c => ({ id: c.id, name: c.name, headline: classHeadline(classOf(c.id), ctx) }));
  const s = homeSuggestion(classes);
  assert.equal(s.classId, G6);
  assert.equal(s.skill.id, 'G5_FRACTIONS_EQUIV');
  assert.equal(s.ids.length, 9);
  assert.equal(s.above.id, 'G6_FRACTIONS_ADD');
});

test('three versions: support, core, stretch, everyone once, real graph steps', () => {
  const ls = classOf(G6);
  const v = practiceVersions(ls, 'G6_FRACTIONS_ADD', ctx);
  assert.deepEqual(v.map(x => x.kind), ['support', 'core', 'stretch']);
  assert.equal(v[0].skill.id, 'G5_FRACTIONS_EQUIV');
  assert.ok(ctx.skills.G6_FRACTIONS_ADD.prerequisites.includes(v[0].skill.id));
  const posts = ctx.getPostReqs('G6_FRACTIONS_ADD').map(p => (typeof p === 'string' ? p : p.id));
  assert.ok(posts.includes(v[2].skill.id));
  const ids = v.flatMap(x => x.learnerIds);
  assert.equal(ids.length, ls.length);
  assert.equal(new Set(ids).size, ls.length);
  assert.deepEqual(v.map(x => x.learnerIds.length), [9, 17, 5]);
  assert.deepEqual(practiceVersions(ls, 'NOT_A_SKILL', ctx), []);
});

test('setting the versions writes one chosen-learner assignment per version', () => {
  const v = practiceVersions(classOf(G6), 'G6_FRACTIONS_ADD', ctx);
  const rows = practiceRows(v, { classId: G6, teacherId: 't1', dueOn: '2026-11-06' });
  assert.equal(rows.length, 3);
  for (const [i, r] of rows.entries()) {
    assert.equal(r.class_id, G6);
    assert.equal(r.teacher_id, 't1');
    assert.equal(r.due_on, '2026-11-06');
    assert.deepEqual(r.skill_ids, [v[i].skill.id]);
    assert.deepEqual(r.student_ids, v[i].learnerIds);
    assert.equal(r.title, v[i].skill.name);
  }
  assert.deepEqual(practiceRows([{ skill: { id: 'X', name: 'X' }, learnerIds: [] }], { classId: G6 }), []);
});

test('the wrong answers give the group a pattern from what HOREB noticed', () => {
  const ls = classOf(G6);
  const ids = missingStepGroups(ls, ctx)[0].learners.map(l => l.id);
  const r = assignmentStruggles({ skill_ids: ['G6_FRACTIONS_ADD'], student_ids: ids, created_at: null }, ls, school.events, { skills: ctx.skills });
  const p = groupPattern(r);
  assert.equal(p.label, 'Fraction procedures applied wrongly');
  assert.equal(p.of, 9);
  assert.ok(p.learners >= 1 && p.learners <= 9);
  assert.ok(p.examples.length >= 1);
  assert.equal(groupPattern({ learners: [] }), null);
});

test('rowToProgress keeps what HOREB noticed about wrong answers', () => {
  const p = rowToProgress({ progress: { skills: {}, misconceptions: { 'fraction-procedure': { n: 2 } } } });
  assert.deepEqual(p.misconceptions, { 'fraction-procedure': { n: 2 } });
  assert.equal(rowToProgress({}).misconceptions, null);
});

test('the original demo class is unchanged inside the demo school', () => {
  assert.equal(school.classes.filter(c => c.id === demoClasses()[0].id).length, 1);
  assert.equal(school.members.filter(m => m.class_id === demoClasses()[0].id).length, demoMembers().length);
  assert.ok(demoStudents().every(s => school.students.some(x => x.userId === s.userId)));
});
