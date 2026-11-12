// ============================================================================
// SCHOOL EXAM EVIDENCE, the door action `evidence` (12 Nov 2026), step 1 of the
// Learner Intelligence Model (docs/learner-model.md, section 1, "School exams").
//
// Tuta (the school system) sends the marks a teacher entered for exam questions that
// are tagged to an official outcome or sub-strand. Each one becomes one row in the
// learner's evidence log (response_events, source 'school_exam'):
//
//   POST school-practice (signed like every door call, see schoolDoor.js)
//   { action: "evidence", items: [
//       { learner_ref, question_id, outcome_code?, substrand_code?, marks, max_marks,
//         subject?, difficulty?, at? } ] }
//   -> { success: true, received, saved, updated, same, skipped: [{ i, why }] }
//
// What must hold:
//   one row per question mark: item_ref `exam:<question id>`, so the same mark sent again is the row already there
//   a mark the teacher corrected later updates its row (the same observation, put right); never a second row
//   learners are the door's made-up references: no names, admission numbers or phones cross
//   an item with neither an outcome nor a sub-strand code is skipped and reported, never guessed
//   independent is true: an exam is done without help
//
// Pure: the store is passed in (deps.store), so the edge function and the tests run the same code.
// store: examEvidence(doorId, itemRefs) -> rows { id, item_ref, learner_ref, marks, max_marks, outcome_code, substrand_code }
//        insertEvidence(rows), updateEvidence(id, patch)
// ============================================================================
import { DIFFICULTIES } from '../learner/evidence.js';

export const EVIDENCE_MAX_ITEMS = 500;
const REF = /^[A-Z2-9]{8}$/;
const UUID = /^[a-f0-9-]{36}$/i;
const CODE = /^[A-Za-z0-9_.]{3,120}$/;
const SUBJECT = /^[a-z][a-z_]{1,29}$/;

const ok = (body) => ({ status: 200, body: { success: true, ...body } });
const no = (status, error) => ({ status, body: { success: false, error } });
const num = (v) => (typeof v === 'number' || (typeof v === 'string' && /^\d+(\.\d+)?$/.test(v.trim()))) ? Number(v) : NaN;

/** The subject key from a curriculum code: "CRE.G5.CREATI.MY_PURPOSE" -> "cre". Null when it does not look like one. */
export const subjectOfCode = (code) => {
  const k = String(code || '').split('.')[0].toLowerCase();
  return SUBJECT.test(k) ? k : null;
};

/** One item, checked and made into a row, or { why }. Unknown or malformed values are dropped, never passed on. */
export function cleanEvidenceItem(it, door) {
  if (!it || typeof it !== 'object') return { why: 'not an item' };
  const learner = String(it.learner_ref || '');
  if (!REF.test(learner)) return { why: 'learner_ref' };
  const q = String(it.question_id || '').toLowerCase();
  if (!UUID.test(q)) return { why: 'question_id' };
  const outcome = CODE.test(String(it.outcome_code || '')) ? String(it.outcome_code) : null;
  const sub = CODE.test(String(it.substrand_code || '')) ? String(it.substrand_code) : null;
  if (!outcome && !sub) return { why: 'no outcome or sub-strand' };
  const marks = num(it.marks), max = num(it.max_marks);
  if (!(max > 0 && max <= 200)) return { why: 'max_marks' };
  if (!(marks >= 0 && marks <= max)) return { why: 'marks' };
  const at = it.at && !Number.isNaN(Date.parse(it.at)) ? new Date(it.at).toISOString() : null;
  const code = outcome || sub;
  return {
    row: {
      source: 'school_exam', door_id: door.id, learner_ref: learner,
      subject: (SUBJECT.test(String(it.subject || '')) ? it.subject : subjectOfCode(code)) || 'math',
      skill_id: code, outcome_code: outcome, substrand_code: sub, framework: 'cbc',
      difficulty: DIFFICULTIES.includes(it.difficulty) ? it.difficulty : null,
      correct: marks >= max, marks, max_marks: max, independent: true,
      item_ref: `exam:${q}`, client_ts: at, hints_used: 0, attempt_no: 1,
    },
  };
}

/** The `evidence` action. Returns null when the action is not this one. */
export async function doorEvidence(door, p, deps) {
  if (p.action !== 'evidence') return null;
  const items = Array.isArray(p.items) ? p.items : [];
  if (!items.length) return no(400, 'No marks given');
  if (items.length > EVIDENCE_MAX_ITEMS) return no(413, `${EVIDENCE_MAX_ITEMS} marks at most in one call`);
  const skipped = []; const rows = new Map();   // one row per learner and question: the last one sent wins
  items.forEach((it, i) => {
    const c = cleanEvidenceItem(it, door);
    if (c.why) { skipped.push({ i, why: c.why }); return; }
    rows.set(`${c.row.learner_ref}|${c.row.item_ref}`, c.row);
  });
  const { store } = deps;
  const have = rows.size ? await store.examEvidence(door.id, [...new Set([...rows.values()].map(r => r.item_ref))]) : [];
  const byKey = new Map(have.map(h => [`${h.learner_ref}|${h.item_ref}`, h]));
  const fresh = []; let updated = 0, same = 0;
  for (const [key, row] of rows) {
    const h = byKey.get(key);
    if (!h) { fresh.push(row); continue; }
    if (Number(h.marks) === row.marks && Number(h.max_marks) === row.max_marks && (h.outcome_code || null) === row.outcome_code && (h.substrand_code || null) === row.substrand_code) { same++; continue; }
    await store.updateEvidence(h.id, { marks: row.marks, max_marks: row.max_marks, correct: row.correct, outcome_code: row.outcome_code,
      substrand_code: row.substrand_code, skill_id: row.skill_id, difficulty: row.difficulty, ...(row.client_ts ? { client_ts: row.client_ts } : {}) });
    updated++;
  }
  if (fresh.length) await store.insertEvidence(fresh);
  return ok({ received: items.length, saved: fresh.length, updated, same, skipped });
}
