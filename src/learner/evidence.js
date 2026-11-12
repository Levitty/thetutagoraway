// ============================================================================
// LEARNER EVIDENCE: the rows each writer puts in response_events (11 Nov 2026).
//
// One log for a child across HOREB practice, school homework and the live tutor
// (migration 20261111_learner_evidence.sql, docs/learner-model.md section 1).
// Pure: these functions only build the row. Each writer sends it its own way
// (the browser for practice, the service role for school and tutor rows), and
// nothing here is ever allowed to fail the learner's answer.
//
// skill_id is NOT NULL on the table (it holds HOREB's own skill ids for practice).
// School and tutor items carry curriculum skill codes only, so the code is
// written to skill_id as well as cskill until mastery.js reads cskill alone.
// ============================================================================

import { subjectOfCskill, SUBJECT_PREFIXES } from './subject.js';
// An outcome code of a subject beyond Maths (SCIE., ENGL., ...): from the subject registry.
const OUTCOME_PREFIX = new RegExp(`^(${Object.keys(SUBJECT_PREFIXES).filter(k => k !== 'MATH').join('|')})\\.`);

export const SOURCES = ['practice', 'school_homework', 'school_exam', 'tutor', 'visual'];
export const DIFFICULTIES = ['easy', 'medium', 'hard'];

/**
 * Re-check answers are ordinary evidence rows (mastery.js judges them by date alone), flagged in item_ref so they can
 * be told apart and counted: practice 'recheck:<event id>', homework 'hw:<homework>:<n>:recheck'. No new column.
 */
export const recheckRef = (eventId) => `recheck:${eventId}`;
export const isRecheckRow = (r) => /^recheck:/.test(r?.item_ref || '') || /^hw:.+:recheck$/.test(r?.item_ref || '');

/** What a HOREB practice row adds to the base row: its source, and the curriculum skill and difficulty when the item has them. */
export function practiceEvidence(ev) {
  const out = { source: 'practice' };
  if (typeof ev?.cskill === 'string' && ev.cskill) out.cskill = ev.cskill.slice(0, 120);
  if (DIFFICULTIES.includes(ev?.difficulty)) out.difficulty = ev.difficulty;
  // Science and English items also name the official outcome they test, so the roll-up by outcome works as it does for exams.
  // A Maths practice row is written exactly as before.
  if (typeof ev?.outcome === 'string' && OUTCOME_PREFIX.test(ev.outcome) && subjectOfCskill(ev.cskill) === subjectOfCskill(ev.outcome)) out.outcome_code = ev.outcome.slice(0, 120);
  return out;
}

/**
 * One answered homework question as a row, or null when the item has no curriculum skill.
 * @param {object} a
 * @param {object} a.homework   school_homework row (id, door_id)
 * @param {object} a.sitting    school_homework_sittings row (learner_ref, items)
 * @param {object} a.answer     { n, chosen, correct, mis, at } as the sitting keeps it
 */
export function homeworkEvidence({ homework, sitting, answer }) {
  const item = (sitting?.items || [])[Number(answer?.n) - 1];
  if (!item?.cskill || !homework?.door_id || !sitting?.learner_ref) return null;
  return {
    source: 'school_homework', door_id: homework.door_id, learner_ref: sitting.learner_ref,
    subject: subjectOfCskill(item.cskill) || 'math', skill_id: item.cskill, cskill: item.cskill,
    correct: !!answer.correct, misconception: answer.mis || null, independent: true, marks: answer.correct ? 1 : 0, max_marks: 1,
    item_ref: `hw:${sitting.homework_id || homework.id}:${answer.n}${item.recheck ? ':recheck' : ''}`,
    submitted_value: answer.chosen ? String(answer.chosen).slice(0, 500) : null,
    client_ts: answer.at || null, hints_used: 0, attempt_no: 1,
  };
}

/**
 * One answer the live tutor marked from its seal, as a row, or null when the question had no curriculum skill.
 * independent is false: the tutor is guiding while the child answers.
 * @param {object} a
 * @param {string} a.userId     the parent's auth id (student_id)
 * @param {string|null} a.childId   the child on that account, null when the account holder answered
 * @param {string} a.sid        the tutor session id
 * @param {object} a.marked     { ask, skill, correct, misconception, answer } from the turn
 * @param {number} a.now        ms
 */
export function tutorEvidence({ userId, childId = null, sid, marked, now }) {
  if (!userId || !sid || !marked?.skill || marked.ask == null) return null;
  return {
    source: 'tutor', student_id: userId, ...(childId ? { learner_id: childId } : {}),
    ...(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sid) ? { session_id: sid } : {}),
    subject: 'math', skill_id: marked.skill, cskill: marked.skill,
    correct: !!marked.correct, misconception: marked.misconception || null, independent: false, marks: marked.correct ? 1 : 0, max_marks: 1,
    item_ref: `tutor:${sid}:${marked.ask}`,
    submitted_value: marked.answer ? String(marked.answer).slice(0, 500) : null,
    client_ts: new Date(now ?? Date.now()).toISOString(), hints_used: 0, attempt_no: 1,
  };
}
