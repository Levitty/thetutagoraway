// ============================================================================
// SCHOOL HOMEWORK (10 Nov 2026): a teacher in Tuta sets homework from the
// curriculum, and HOREB draws it, child by child, from the question families.
//
// The owner: "a teacher sets good homework in seconds, children get fresh
// questions, marking is automatic, and results land on the skill and the
// misconception." The families and the curriculum map belong to HOREB; Tuta
// only names the curriculum skills (MATH.G5.*), the learners (by reference)
// and the mode, and gets back each child's questions and, later, the results.
//
//   samplesFor()    two sample questions per family, the same every time, for
//                   the teacher to preview before setting (unreviewed families
//                   are allowed for one homework only when a teacher approves)
//   drawSet()       one child's (or one paper version's) questions: seeded, so
//                   the same seed always gives the same questions and two
//                   children never share a seed; skills take turns, forms and
//                   rungs mix, easier rungs first
//   markItem()      right or wrong, the option chosen, and the misconception
//                   the wrong answer reveals (the library's full code)
//   step()          the sitting's rules: one question at a time, in order,
//                   marked at once; leaving the page locks it, as Tuta's own
//                   online homework; a teacher can reopen it
//   resultsFor()    what goes back to Tuta: per learner and per question, right
//                   or wrong, the chosen option, the skill and misconception codes
//
// Pure: no database and no clock of its own (callers pass `now`). The edge
// functions inline it with the family bank (scripts/build-school-practice-fn.mjs).
// ============================================================================
import { FAMILIES } from '../ai-tutor/content/families/index.js';
import { drawFamily } from '../ai-tutor/content/families/core.js';
import { SKILLS_G5 } from '../ai-tutor/content/curriculumMap.g5.js';
import { recheckSlots } from '../learner/recheck.js';
import { publicItem, markItem, step, sittingView, resultsFor } from './homeworkSitting.js';

export { publicItem, markItem, step, sittingView, resultsFor };

export const HW_MIN = 3;
export const HW_MAX = 30;
export const HW_MAX_SKILLS = 12;
const LETTERS = 'ABCDEFGH';

// ---------------------------------------------------------------- seeding
// A string becomes a 32-bit seed (FNV-1a), and mulberry32 turns it into numbers.
export const seedOf = (text) => {
  let h = 0x811c9dc5;
  for (const ch of String(text)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
};
export const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
// The families draw with Math.random. For one draw it is the seeded stream, then
// it is put back: synchronous, so nothing else runs in between.
export const withSeed = (text, fn) => {
  const keep = Math.random;
  Math.random = rng(seedOf(text));
  try { return fn(); } finally { Math.random = keep; }
};

// ---------------------------------------------------------------- the families
// Homework takes the Grade 5 curriculum families (they carry cskill) in the forms a
// phone and a printed page can both show: a typed answer, a choice, a table, or a
// working with one wrong step. Multi-part questions stay in the lesson.
const usable = (f) => !!f.cskill && f.form !== 'steps';
const BY_CSKILL = new Map();
for (const f of FAMILIES) if (usable(f)) { if (!BY_CSKILL.has(f.cskill)) BY_CSKILL.set(f.cskill, []); BY_CSKILL.get(f.cskill).push(f); }
export const familiesForSkill = (cskill) => BY_CSKILL.get(cskill) || [];
export const isCurriculumSkill = (code) => !!SKILLS_G5[code];
export const skillName = (code) => SKILLS_G5[code]?.name || code;
const isReviewed = (f) => f.core === true || f.reviewed === true;

/** The full library code of a family's misconception: the skill's own, else a skill of the same sub-strand that has it. */
export const misCode = (cskill, short) => {
  if (!short) return null;
  if (String(short).startsWith('MATH.')) return short;
  const sk = SKILLS_G5[cskill];
  if (sk?.mis?.includes(short)) return `${cskill}.${short}`;
  for (const [code, s] of Object.entries(SKILLS_G5)) if (s.sub === sk?.sub && s.mis?.includes(short)) return `${code}.${short}`;
  return null;
};

// ---------------------------------------------------------------- one item
const norm = (t) => String(t ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

/** A drawn problem as homework keeps it: everything to show, mark and explain. */
export function toItem(p, n) {
  const base = { n, family_id: p.familyId, cskill: p.cskill, form: p.familyForm, rung: p.rung,
    question: p.question, instruction: p.instruction || '' };
  if (p.model?.type === 'table') base.table = { head: p.model.data.head, rows: p.model.data.rows.map(r => r.cells) };
  if (p.shownSteps) base.steps_shown = p.shownSteps;
  const workMis = misCode(p.cskill, [].concat(p.mis || [])[0]);
  if (p.choices || p.mc) {
    const texts = (p.choices || p.mc).map(String);
    const mis = Object.fromEntries((p.misconceptions || []).map(m => [norm(m.when), m]));
    return { ...base, kind: 'choice', answer: String(p.answer),
      options: texts.map((text, i) => {
        const right = norm(text) === norm(p.answer);
        const m = mis[norm(text)];
        return { key: LETTERS[i], text, right, ...(right ? {} : { mis: m?.mis ? misCode(p.cskill, m.mis) : (p.type === 'spot-mistake' ? workMis : null), why: m?.feedback || '' }) };
      }) };
  }
  return { ...base, kind: 'typed', answer: String(p.answer), accepts: p.accepts || [String(p.answer)],
    wrong: (p.misconceptions || []).map(m => ({ value: String(m.when), why: m.feedback || '', mis: m.mis ? misCode(p.cskill, m.mis) : null })) };
}

/** What Tuta keeps for the worksheet and the key: the question, the right answer, and each wrong answer's misconception. */
export const keyItem = (it) => it && ({ n: it.n, ...(it.recheck ? { recheck: true } : {}), cskill: it.cskill, family_id: it.family_id, form: it.form, rung: it.rung, kind: it.kind,
  question: it.question, instruction: it.instruction, ...(it.table ? { table: it.table } : {}), ...(it.steps_shown ? { steps_shown: it.steps_shown } : {}),
  answer: it.answer,
  ...(it.kind === 'choice' ? { options: it.options.map(o => ({ key: o.key, text: o.text, right: o.right, ...(o.right ? {} : { mis: o.mis || null }) })) }
    : { wrong: (it.wrong || []).filter(w => w.mis).map(w => ({ value: w.value, mis: w.mis })) }) });

// ---------------------------------------------------------------- which families
/**
 * The families a homework may draw from: reviewed ones, and unreviewed ones a teacher approved
 * for this homework after seeing their samples. Returns { ok, families: {cskill: [defs]}, missing: [cskill] }.
 */
export function allowedFamilies(cskills, approvedIds = []) {
  const approved = new Set(approvedIds);
  const families = {}; const missing = [];
  for (const c of cskills) {
    const list = familiesForSkill(c).filter(f => isReviewed(f) || approved.has(f.id));
    if (list.length) families[c] = list; else missing.push(c);
  }
  return { ok: missing.length === 0, families, missing };
}

/** Two samples per family of these skills, the same every time (seeded by the family), for the teacher's preview. */
export function samplesFor(cskills, perFamily = 2) {
  const out = [];
  for (const c of cskills) {
    for (const f of familiesForSkill(c)) {
      const samples = [];
      for (let k = 0; k < perFamily; k++) samples.push(keyItem(toItem(withSeed(`preview:${f.id}:${k}`, () => drawFamily(f).p), k + 1)));
      out.push({ family_id: f.id, cskill: c, form: f.form, rung: f.rung, reviewed: isReviewed(f), samples });
    }
  }
  return out;
}

// ---------------------------------------------------------------- one child's set
/**
 * One set of questions. Skills take turns in the order given; within a skill the families are
 * shuffled by the seed, then taken easiest rung first, a different family each time while any is
 * left, so forms and rungs mix. No question text twice. Then easier rungs first across the set.
 */
function drawCore({ seed, cskills, families, count }) {
  const r = rng(seedOf(`order:${seed}`));
  const queue = {};
  for (const c of cskills) {
    const list = [...(families[c] || [])];
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    list.sort((a, b) => a.rung - b.rung);
    queue[c] = { list, next: 0 };
  }
  const skills = cskills.filter(c => queue[c].list.length);
  const items = []; const seen = new Set();
  for (let slot = 0; items.length < count && slot < count * 4; slot++) {
    const c = skills[slot % skills.length];
    const q = queue[c];
    const f = q.list[q.next % q.list.length]; q.next++;
    let it = null;
    for (let t = 0; t < 4 && !it; t++) {
      const p = withSeed(`${seed}:${slot}:${t}`, () => drawFamily(f).p);
      if (!seen.has(norm(p.question))) it = toItem(p, 0);
    }
    if (!it) continue;
    seen.add(norm(it.question)); items.push(it);
  }
  items.sort((a, b) => a.rung - b.rung);
  // The same family twice in a row reads as a repeat: move the next different one of that rung up.
  for (let i = 1; i < items.length; i++) {
    if (items[i].family_id !== items[i - 1].family_id) continue;
    const j = items.findIndex((x, k) => k > i && x.rung === items[i].rung && x.family_id !== items[i - 1].family_id);
    if (j > 0) [items[i], items[j]] = [items[j], items[i]];
  }
  return items.map((it, i) => ({ ...it, n: i + 1 }));
}

/**
 * drawSet with the class's due re-checks mixed in (12 Nov 2026, learner-model.md "Re-checks"): a fifth of the items at
 * most (recheckSlots) come from `recheck` skills, flagged `recheck: true`, and sit at every fifth place (5th, 10th, ...)
 * so they are mixed in, not blocked at the end. With no `recheck` skills, or under 5 items, it is drawSet unchanged.
 */
export function drawSet({ seed, cskills, families, count, recheck = [] }) {
  const rc = [...new Set(recheck)].filter(c => (families[c] || []).length);
  const slots = rc.length ? Math.min(recheckSlots(count), count - HW_MIN) : 0;
  if (slots < 1) return drawCore({ seed, cskills, families, count });
  const main = drawCore({ seed, cskills, families, count: count - slots });
  const seen = new Set(main.map(it => norm(it.question)));
  const extra = drawCore({ seed: `${seed}:recheck`, cskills: rc, families, count: slots + 3 })
    .filter(it => !seen.has(norm(it.question))).slice(0, slots).map(it => ({ ...it, recheck: true }));
  const items = [...main];
  extra.forEach((it, k) => items.splice(Math.min(items.length, 4 + k * 5), 0, it));
  return items.map((it, i) => ({ ...it, n: i + 1 }));
}

// ---------------------------------------------------------------- a request from Tuta
const REF = /^[A-Z2-9]{8}$/;
const UUID = /^[a-f0-9-]{36}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * A homework_set request, checked: { ok, hw } or { ok: false, error }. One call can carry several homework
 * (the whole grade: one per class), sharing the title, the skills, the count and the mode.
 */
export function cleanHomeworkSet(p) {
  if (!p || typeof p !== 'object') return { ok: false, error: 'No homework given' };
  const title = String(p.title || '').trim().slice(0, 120);
  if (!title) return { ok: false, error: 'A title is needed' };
  const cskills = [...new Set((Array.isArray(p.cskills) ? p.cskills : []).map(String).filter(isCurriculumSkill))].slice(0, HW_MAX_SKILLS);
  if (!cskills.length) return { ok: false, error: 'No curriculum skills given' };
  const count = Math.round(Number(p.count));
  if (!(count >= HW_MIN && count <= HW_MAX)) return { ok: false, error: `Between ${HW_MIN} and ${HW_MAX} questions` };
  const mode = p.mode === 'paper' ? 'paper' : p.mode === 'online' ? 'online' : null;
  if (!mode) return { ok: false, error: 'Online or paper' };
  const versions = mode === 'paper' ? Math.round(Number(p.versions || 0)) : 0;
  if (!(versions === 0 || (versions >= 2 && versions <= 4))) return { ok: false, error: 'Paper is one sheet per child, or 2 to 4 versions' };
  const approved = (Array.isArray(p.approved) ? p.approved : []).filter(a => a && typeof a.family_id === 'string')
    .map(a => ({ family_id: a.family_id.slice(0, 80), by: String(a.by || '').slice(0, 80), at: DATE.test(String(a.at || '').slice(0, 10)) ? String(a.at).slice(0, 25) : null })).slice(0, 200);
  const recheckWanted = [...new Set((Array.isArray(p.recheck_cskills) ? p.recheck_cskills : []).map(String).filter(c => isCurriculumSkill(c) && !cskills.includes(c)))].slice(0, recheckSlots(count));
  const allowed = allowedFamilies(cskills, approved.map(a => a.family_id));
  if (!allowed.ok) return { ok: false, error: 'No reviewed or approved questions for: ' + allowed.missing.map(skillName).join('; '), missing: allowed.missing };
  // A re-check skill with no reviewed or approved question is simply left out: a re-check is never a reason to refuse the homework.
  const rcAllowed = allowedFamilies(recheckWanted, approved.map(a => a.family_id));
  const recheck = recheckWanted.filter(c => rcAllowed.families[c]);
  const list = (Array.isArray(p.homework) ? p.homework : []).slice(0, 20).map(h => ({
    homework_ref: String(h?.homework_ref || ''), learner_refs: [...new Set((Array.isArray(h?.learner_refs) ? h.learner_refs : []).map(String).filter(r => REF.test(r)))].slice(0, 400) }));
  if (!list.length || list.some(h => !UUID.test(h.homework_ref) || !h.learner_refs.length)) return { ok: false, error: 'Each homework needs its reference and its learners' };
  const due = DATE.test(String(p.due_on || '')) ? p.due_on : null;
  return { ok: true, hw: { title, cskills, recheck, count, mode, versions, due_on: due, approved, homework: list }, families: { ...rcAllowed.families, ...allowed.families } };
}

/**
 * Every learner's sitting for one homework: seeded by the homework and the learner (online, or paper per child),
 * or by the homework and the version (paper in 2 to 4 versions, learners taking the versions in turn).
 */
export function sittingsFor(hw, homeworkRef, learnerRefs, families, makeCode) {
  const refs = [...learnerRefs].sort();
  const byVersion = {};
  return refs.map((ref, i) => {
    const version = hw.versions ? (i % hw.versions) + 1 : null;
    const seed = version ? `${homeworkRef}:v${version}` : `${homeworkRef}:${ref}`;
    const items = version ? (byVersion[version] ||= drawSet({ seed, cskills: hw.cskills, families, count: hw.count, recheck: hw.recheck || [] })) : drawSet({ seed, cskills: hw.cskills, families, count: hw.count, recheck: hw.recheck || [] });
    return { learner_ref: ref, code: makeCode(), seed, version, items, answers: [], status: 'issued', mode: hw.mode };
  });
}
