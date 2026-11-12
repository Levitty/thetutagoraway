// ============================================================================
// MORE THAN ONE SUBJECT IN PRACTICE (12 Nov 2026): Maths, Science and English.
//
// What must hold:
//   Maths is untouched: the same subject entries, the same skills, the same marker
//   ONE RULE: a family nobody has signed off is never served to a child, in any subject
//   nothing is signed today, so no subject is offered and no science or english skill can be set as homework
//   signing a family in turns on its skill, its subject and its homework, and nothing else
//   English answers are marked as words (answerCheckText.js), Maths as before
//   a comprehension item shows its passage on the practice screen and the homework phone page
//   evidence rows carry the subject's own curriculum codes, and mastery.js reads them unchanged
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SUBJECTS, SUBJECT_LIST, subjectsForGrade } from '../src/ai-tutor/subjects.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { SUBJECT_DEFS, makeSubject, EXTRA_SUBJECTS } from '../src/ai-tutor/subjectPractice.js';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { ENGLISH_FAMILIES } from '../src/ai-tutor/content/families/english.js';
import { isOn, isSigned, setFamilyMode, familyMode } from '../src/ai-tutor/content/families/core.js';
import { SIGNED_SCIENCE } from '../src/ai-tutor/content/families/sci_signed.js';
import { SIGNED_ENGLISH } from '../src/ai-tutor/content/families/eng_signed.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { checkTextAnswer } from '../src/ai-tutor/answerCheckText.js';
import { subjectOfCskill, gradeNumber } from '../src/learner/subject.js';
import { practiceEvidence, homeworkEvidence } from '../src/learner/evidence.js';
import { learnerMastery, skillState } from '../src/learner/mastery.js';
import { isCurriculumSkill, allowedFamilies, cleanHomeworkSet, drawSet, familiesForSkill, toItem, publicItem, keyItem, markItem, samplesFor, skillName } from '../src/school/homework.js';
import { buildHome } from '../src/school/learnerHome.js';
import { drawFamily } from '../src/ai-tutor/content/families/core.js';
import { passageParagraphs } from '../src/ai-tutor/passage.js';

const sciFams = FAMILIES.filter(f => f.subject === 'science');
const withMode = (mode, fn) => { const keep = familyMode(); setFamilyMode(mode); try { return fn(); } finally { setFamilyMode(keep); } };
const signed = (list, ids) => list.map(f => (ids.includes(f.id) ? { ...f, reviewed: true } : f));

test('Maths is unchanged: the same three subjects in the picker, the same graph', () => {
  assert.deepEqual(SUBJECT_LIST.map(s => s.id), ['math', 'cambridge', 'sat']);
  assert.equal(SUBJECTS.math.skills, SKILLS);
  assert.equal(subjectOfCskill('MATH.G5.NUMBER.WHOLE_NUMBERS.PLACE_VALUE_HTH'), 'math');
  assert.equal(subjectOfCskill('G5_ADDITION'), null);
  assert.equal(subjectOfCskill('SCIE.G5.LIVING.X.Y'), 'science');
  assert.equal(subjectOfCskill('ENGL.G5.READIN.X.Y'), 'english');
  assert.equal(gradeNumber('Grade 5'), 5); assert.equal(gradeNumber('Form 2'), null); assert.equal(gradeNumber(null), null);
});

test('nothing is signed today: both lists are empty, every graph is empty, no subject is offered to any grade', () => {
  assert.deepEqual(SIGNED_SCIENCE, []);
  assert.deepEqual(SIGNED_ENGLISH, []);
  assert.ok(sciFams.length >= 80 && ENGLISH_FAMILIES.length >= 100);
  for (const f of [...sciFams, ...ENGLISH_FAMILIES]) assert.ok(!isSigned(f), `${f.id} is signed`);
  for (const id of ['science', 'english']) {
    assert.equal(EXTRA_SUBJECTS[id].skillCount, withMode('reviewed', () => EXTRA_SUBJECTS[id].skillCount));
  }
  withMode('reviewed', () => {
    for (const g of [1, 2, 3, 4, 5, 6, 7, 8, 9]) assert.deepEqual(subjectsForGrade(g), []);
    assert.equal(makeSubject(SUBJECT_DEFS.science).skillCount, 0);
    assert.equal(makeSubject(SUBJECT_DEFS.english).skillCount, 0);
  });
});

test('ONE RULE: an unsigned family is never served to a child, in Science or English', () => {
  withMode('reviewed', () => {
    for (const [id, def] of Object.entries(SUBJECT_DEFS)) {
      const sub = makeSubject(def);
      for (const f of def.families()) assert.equal(sub.generate(f.cskill, { lesson: true, correctSoFar: 8 }), null, `${f.id} was served unsigned`);
      // Sign one family of each skill: only that one is ever drawn, and only that skill exists.
      const list = def.families();
      const one = list.find(f => f.cskill && list.filter(x => x.cskill === f.cskill).length > 1);
      const live = makeSubject(def, { families: signed(list, [one.id]) });
      assert.deepEqual(Object.keys(live.skills), [one.cskill], id);
      for (let i = 0; i < 60; i++) {
        const p = live.generate(one.cskill, { lesson: true, correctSoFar: 8 });
        assert.equal(p.familyId, one.id, `${id}: a sibling that is not signed was served`);
        assert.equal(p.cskill, one.cskill);
      }
      const other = list.find(f => f.cskill !== one.cskill);
      assert.equal(live.generate(other.cskill), null, `${id}: a skill with nothing signed was served`);
    }
  });
});

test('a signed family turns on its subject for its grade only, with a graph the engine can run on', () => {
  withMode('reviewed', () => {
    const list = SUBJECT_DEFS.science.families();
    const picked = list.filter(f => f.cskill && f.cskill.startsWith('SCIE.G5.') && f.rung === 1).slice(0, 4);   // Grade 4 Science (12 Nov 2026) has its own entry and is not signed
    const sci = makeSubject(SUBJECT_DEFS.science, { families: signed(list, picked.map(f => f.id)) });
    assert.ok(sci.skillCount >= 1);
    for (const s of Object.values(sci.skills)) {
      assert.ok(s.id.startsWith('SCIE.G5.') && s.grade === 5 && s.strand && Array.isArray(s.prerequisites));
      for (const p of s.prerequisites) assert.ok(sci.skills[p], 'a prerequisite nobody has signed off must not hold a child back');
    }
    assert.deepEqual(subjectsForGrade(5, { science: sci }).map(s => s.id), ['science']);
    assert.deepEqual(subjectsForGrade(4, { science: sci }), []);
    assert.deepEqual(subjectsForGrade(null, { science: sci }), []);
    const id = Object.keys(sci.skills)[0];
    assert.equal(sci.getByGrade(5).length, sci.skillCount);
    assert.ok(sci.getPostReqs(id).every(s => s.prerequisites.includes(id)));
    const p = sci.generate(id);
    assert.equal(p.cskill, id);
    assert.ok(p.workedExample);
  });
});

test('the practice picker adds a subject only for a grade that has a signed family', () => {
  const src = readFileSync(new URL('../src/ai-tutor/AIMastery.jsx', import.meta.url), 'utf8');
  assert.match(src, /\[\.\.\.SUBJECT_LIST, \.\.\.subjectsForGrade\(/);
  assert.match(src, /<PassageCard passage=\{problem\.passage\} \/>/);
});

test('Marking: English by words, Maths as before', () => {
  const eng = (answer, accepts) => ({ marker: 'text', answer, accepts: accepts || [answer] });
  // "few" is not "a few": the Maths marker drops a leading "a", the English one does not.
  assert.equal(checkAnswerMatch('few', { answer: 'a few', accepts: ['a few'] }), true, 'the Maths marker is lenient with a');
  assert.equal(checkAnswerMatch('few', eng('a few')), false);
  assert.equal(checkAnswerMatch('a few', eng('a few')), true);
  // Missing quotation marks.
  const quoted = 'Amina said, "I am ready."';
  assert.equal(checkAnswerMatch('Amina said, I am ready.', eng(quoted)), false);
  assert.equal(checkAnswerMatch(quoted, eng(quoted)), true);
  // Word order: "taller than", not "than taller".
  assert.equal(checkAnswerMatch('than taller', eng('taller than')), false);
  assert.equal(checkAnswerMatch('Taller than', eng('taller than')), true);
  // A tapped option is matched exactly, capital letters and punctuation included.
  assert.equal(checkAnswerMatch('the nile', { marker: 'text', answer: 'The Nile', choices: ['The Nile', 'the nile'] }), false);
  assert.equal(checkAnswerMatch('The Nile', { marker: 'text', answer: 'The Nile', choices: ['The Nile', 'the nile'] }), true);
  assert.equal(checkTextAnswer('few', eng('a few')), false);
  // Every English family marks itself as text, no Maths or Science family does.
  assert.ok(ENGLISH_FAMILIES.every(f => f.marker === 'text'));
  assert.ok(FAMILIES.every(f => f.marker !== 'text'));
});

test('Marking in the homework door: an English item is marked by answerCheckText, a Maths item by answerCheck', () => {
  const base = { n: 1, kind: 'typed', question: 'q', answer: 'a few', accepts: ['a few'], wrong: [] };
  assert.equal(markItem({ ...base, marker: 'text' }, 'few').correct, false);
  assert.equal(markItem({ ...base, marker: 'text' }, 'A few').correct, true);
  assert.equal(markItem(base, 'few').correct, true, 'Maths item, no marker: unchanged');
  const choice = { n: 1, kind: 'choice', marker: 'text', answer: 'The Nile', options: [{ key: 'A', text: 'The Nile', right: true }, { key: 'B', text: 'the Nile', right: false, mis: 'ENGL.G5.X.Y.M_Z' }] };
  assert.equal(markItem(choice, 'the Nile').correct, false);
  assert.equal(markItem(choice, 'the Nile').mis, 'ENGL.G5.X.Y.M_Z');
  assert.equal(markItem(choice, 'A').correct, true);
});

test('Passages: a comprehension item carries its passage to the practice screen and the homework item', () => {
  const read = ENGLISH_FAMILIES.filter(f => f.id.includes('read') || /passage|comprehens/i.test(f.cskill));
  let p = null;
  for (const f of ENGLISH_FAMILIES) { for (let i = 0; i < 6 && !p; i++) { const d = drawFamily(f).p; if (d.passage) p = d; } if (p) break; }
  assert.ok(p, 'no English family draws a passage');
  assert.ok(p.passage.title && p.passage.text.length > 80);
  assert.equal(p.marker, 'text');
  const it = toItem(p, 1);
  assert.deepEqual(it.passage, p.passage);
  assert.equal(it.marker, 'text');
  assert.deepEqual(publicItem(it).passage, p.passage, 'the phone is sent the passage');
  assert.ok(!('answer' in publicItem(it)), 'and never the answer');
  assert.deepEqual(keyItem(it).passage, p.passage);
  assert.ok(passageParagraphs(p.passage.text).length >= 2);
  // A Maths item has no passage and no marker, so nothing is added to it.
  const maths = FAMILIES.find(f => f.cskill?.startsWith('MATH.G5.') && f.form === 'direct');
  const m = toItem(drawFamily(maths).p, 1);
  assert.ok(!('passage' in m) && !('marker' in m) && !('skill_name' in m));
  const page = readFileSync(new URL('../public/hw/index.html', import.meta.url), 'utf8');
  assert.match(page, /passage\(it\.passage\)/);
  assert.match(page, /\.passage p \{[^}]*font-size: 17px/);
  assert.ok(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(readFileSync(new URL('../src/ai-tutor/PassageCard.jsx', import.meta.url), 'utf8')), 'no emojis');
});

test('Homework: no science or english skill can be set while nothing is signed', () => {
  for (const f of [...sciFams, ...ENGLISH_FAMILIES]) assert.equal(isCurriculumSkill(f.cskill), false, f.cskill);
  assert.equal(isCurriculumSkill('MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS'), true);
  assert.equal(isCurriculumSkill('SCIE.G5.NOT.A.SKILL'), false);
  const r = cleanHomeworkSet({ title: 'T', cskills: [sciFams[0].cskill, ENGLISH_FAMILIES[0].cskill], count: 5, mode: 'online', homework: [] });
  assert.equal(r.ok, false);
});

test('Homework: signing a family in makes its skill reachable, and only the signed families are drawn', () => {
  for (const list of [sciFams, ENGLISH_FAMILIES]) {
    const f = list.find(x => x.form === 'direct');
    const unsigned = list.find(x => x.cskill === f.cskill && x.id !== f.id);
    f.reviewed = true;
    try {
      assert.equal(isCurriculumSkill(f.cskill), true);
      assert.ok(skillName(f.cskill) !== f.cskill);
      // A teacher's approval of a draft does not reach a Science or English child: signed off or not at all.
      const a = allowedFamilies([f.cskill], [unsigned.id]);
      assert.deepEqual(a.families[f.cskill].map(x => x.id), [f.id]);
      assert.ok(samplesFor([f.cskill]).every(s => s.reviewed));
      const set = drawSet({ seed: 'x:ABCDEFGH', cskills: [f.cskill], families: a.families, count: 6 });
      assert.ok(set.length >= 3 && set.every(it => it.family_id === f.id && it.cskill === f.cskill));
      assert.ok(set.every(it => it.skill_name && it.topic));
      const c = cleanHomeworkSet({ title: 'T', cskills: [f.cskill], count: 5, mode: 'online', homework: [{ homework_ref: 'a'.repeat(8) + '-aaaa-aaaa-aaaa-' + 'a'.repeat(12), learner_refs: ['ABCDEFGH'] }] });
      assert.equal(c.ok, true, c.error);
      assert.deepEqual(Object.keys(c.families), [f.cskill]);
      // The learner home names the skill from the item.
      const sitting = { status: 'submitted', items: set.slice(0, 4), answers: set.slice(0, 4).map((it, i) => ({ n: i + 1, correct: true, at: `2026-11-1${i}T08:00:00Z` })), code: 'X', finished_at: '2026-11-13T08:00:00Z' };
      const home = buildHome('School', [{ sitting, homework: { title: 'H', mode: 'online', created_at: '2026-11-10T00:00:00Z' } }], Date.parse('2026-11-14T08:00:00Z'));
      assert.equal(home.mastered[0].name, skillName(f.cskill));
    } finally { f.reviewed = false; }
    assert.equal(isCurriculumSkill(f.cskill), false, 'switched off again');
  }
});

test('Evidence rows carry the subject and the curriculum code, and mastery.js reads them unchanged', () => {
  const code = sciFams[0].cskill;
  assert.deepEqual(practiceEvidence({ cskill: code }), { source: 'practice', cskill: code });
  assert.deepEqual(practiceEvidence({ cskill: code, outcome: sciFams[0].outcome, difficulty: 'easy' }), { source: 'practice', cskill: code, difficulty: 'easy', outcome_code: sciFams[0].outcome });
  // A Maths row is written exactly as before, even though Maths families carry an outcome too.
  assert.deepEqual(practiceEvidence({ cskill: 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS', outcome: 'MATH.G5.NUMBER.FRACTIONS.a' }), { source: 'practice', cskill: 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS' });
  const hw = { id: 'h', door_id: 'd' };
  const row = (cskill) => homeworkEvidence({ homework: hw, sitting: { learner_ref: 'ABCDEFGH', homework_id: 'h', items: [{ cskill }] }, answer: { n: 1, correct: true, at: '2026-11-12T08:00:00Z' } });
  assert.equal(row(code).subject, 'science');
  assert.equal(row(ENGLISH_FAMILIES[0].cskill).subject, 'english');
  assert.equal(row('MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS').subject, 'math');
  // Rows of a science skill are judged on that skill's code, as Maths rows are.
  const now = Date.parse('2026-11-12T12:00:00Z');
  const rows = [1, 2, 3, 4, 5].map(i => ({ cskill: code, skill_id: code, correct: true, independent: true, difficulty: 'medium', marks: 1, max_marks: 1, source: 'practice', created_at: `2026-11-0${i}T08:00:00Z` }));
  const m = learnerMastery(rows, { now });
  assert.equal(m.skills.length, 1);
  assert.equal(m.skills[0].key, code);
  assert.equal(m.skills[0].state, skillState(rows, { now }).state);
  assert.ok(m.substrands[0].code.startsWith('SCIE.G5.'));
});

test('the adaptive engine runs on a subject graph: next skill, path, frontier, answers recorded under the curriculum code', async () => {
  const { getNextToLearn, getKnowledgeFrontier, getRecommendedPath } = await import('../src/ai-tutor/adaptiveEngine.js');
  withMode('reviewed', () => {
    const list = SUBJECT_DEFS.science.families();
    const ids = list.filter(f => f.rung <= 2).map(f => f.id);
    const sci = makeSubject(SUBJECT_DEFS.science, { families: signed(list, ids) });
    const getPreChain = (id, seen = new Set()) => { if (seen.has(id)) return []; seen.add(id); const s = sci.skills[id]; return s ? [...new Set([...s.prerequisites, ...s.prerequisites.flatMap(p => getPreChain(p, seen))])] : []; };
    const ctx = { skills: sci.skills, getPostReqs: sci.getPostReqs, getPreChain, getPostChain: () => [] };
    const progress = { skills: {}, declaredGrade: 5 };
    const frontier = getKnowledgeFrontier(progress, ctx);
    assert.ok(frontier.length >= 1, 'a child with nothing done has somewhere to start');
    assert.ok(frontier.every(s => sci.skills[s.id || s]));
    const next = getNextToLearn(progress, ctx);
    assert.ok(Array.isArray(next) && next.length >= 1 && next.every(n => sci.skills[n.id]), 'next skills are the subject\'s own');
    assert.ok(Array.isArray(getRecommendedPath(progress, ctx)));
    const p = sci.generate(frontier[0].id || frontier[0]);
    assert.ok(p.question && p.cskill === (frontier[0].id || frontier[0]));
  });
});
