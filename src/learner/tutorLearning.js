// ============================================================================
// WHAT THE LIVE TUTOR READS AND KEEPS ABOUT A CHILD (11 Nov 2026).
//
// The server side of "a tutor that knows the child", called by
// src/voice-tutor/tutorTurn.js with the database passed in (so the tests run it
// with fakes, and the edge function runs the same code):
//
//   readLearner(db, ...)      ONE read for the child (evidence rows, profile, last
//                             session notes), cached for the lesson, so a turn adds no read
//                             after the first; today's HOREB progress is the fallback
//   rememberEvidence(...)     the answer marked this turn goes in the cached rows too
//   upgradeEvidence(...)      a right answer whose reason came later becomes independent evidence
//   saveLearned(...)          the tutor's silent note_interest / note_what_helped, merged and saved
//   finishLesson(...)         at end_session: the lesson's note (kept 90 days), the report to
//                             the parent (stored for the app, emailed if allowed)
//
// Every function here is allowed to fail without failing the turn: a child is never
// left without an answer because a note could not be saved.
// ============================================================================
import { readSkills, openMisconceptions } from './model.js';
import { mergeInterests, mergeWhatHelps } from './profile.js';
import { buildLessonReport } from './report.js';
import { FRACTION_SKILLS, skillName } from '../voice-tutor/fractions.js';

export const TTL_MS = 45 * 60 * 1000;
export const NOTE_DAYS = 90;
const MAX_CACHED = 200;
const cache = new Map();
const keyOf = (sid, userId, childId) => `${sid}|${userId}|${childId || ''}`;
const empty = () => ({ rows: [], profile: null, notes: [] });

/** For tests: forget everything cached. */
export const clearLearnerCache = () => cache.clear();

export async function readLearner(db, { sid, userId, childId = null, now = Date.now() }) {
  const k = keyOf(sid, userId, childId);
  const hit = cache.get(k);
  if (hit && now - hit.at < TTL_MS) return hit.data;
  let data = empty();
  if (typeof db.getLearner === 'function') {
    try {
      const got = await db.getLearner({ userId, childId, since: new Date(now - NOTE_DAYS * 86400000).toISOString() });
      data = { rows: got?.rows || [], profile: got?.profile || null, notes: got?.notes || [] };
    } catch (e) { console.error('voice-tutor: learner read', String(e?.message || e).slice(0, 200)); }
  }
  cache.set(k, { at: now, data });
  if (cache.size > MAX_CACHED) for (const old of [...cache.keys()].slice(0, cache.size - MAX_CACHED)) cache.delete(old);
  return data;
}

/** The answer marked this turn, added to the cached rows (when a lesson is already cached). */
export function rememberEvidence({ sid, userId, childId = null, row }) {
  const hit = cache.get(keyOf(sid, userId, childId));
  if (!hit || !row) return;
  if (row.item_ref && hit.data.rows.some((r) => r.item_ref === row.item_ref)) return;
  hit.data.rows.push({ ...row, created_at: row.client_ts });
}

/**
 * A right answer whose reason came later (the orchestrator's 'understood'): its row becomes independent
 * evidence, in the log and in the cached rows. Never fails the turn.
 */
export async function upgradeEvidence(db, { sid, userId, childId = null, itemRef }) {
  if (!itemRef || typeof db.upgradeEvidence !== 'function') return false;
  try {
    await db.upgradeEvidence({ userId, childId, itemRef });
    const hit = cache.get(keyOf(sid, userId, childId));
    for (const r of hit?.data.rows || []) if (r.item_ref === itemRef && r.correct) r.independent = true;
    return true;
  } catch (e) { console.error('voice-tutor: evidence upgrade', String(e?.message || e).slice(0, 200)); return false; }
}

/**
 * Merge this turn's silent notes into the stored profile.
 * @param {{interests:string[], helps:{move:string, helped:boolean}[]}} learned
 */
export async function saveLearned({ db, sid, user, child, learned, now = Date.now() }) {
  if (!learned || (!learned.interests.length && !learned.helps.length)) return null;
  if (typeof db.saveProfile !== 'function') return null;
  try {
    const data = await readLearner(db, { sid, userId: user.id, childId: child?.id || null, now });
    const profile = {
      interests: mergeInterests(data.profile?.interests, learned.interests, { names: [child?.name] }),
      what_helps: mergeWhatHelps(data.profile?.what_helps, learned.helps, now),
    };
    await db.saveProfile({ userId: user.id, childId: child?.id || null, ...profile });
    data.profile = { ...(data.profile || {}), ...profile };
    return profile;
  } catch (e) { console.error('voice-tutor: profile save', String(e?.message || e).slice(0, 200)); return null; }
}

const phrase = (lib, code) => String(lib?.[code]?.error || '').replace(/\s+/g, ' ').slice(0, 90);

/**
 * The lesson is over: keep its note, build the report, store it, email it if allowed.
 * @returns {Promise<{ report:object|null, emailed:boolean }>}
 */
export async function finishLesson({ db, user, child, sid, target, summary = '', lib = {}, now = Date.now() }) {
  const out = { report: null, emailed: false };
  try {
    const data = await readLearner(db, { sid, userId: user.id, childId: child?.id || null, now });
    const mine = data.rows.filter((r) => String(r.item_ref || '').startsWith(`tutor:${sid}:`));
    if (!mine.length) return out; // nothing was answered: no report, no note
    const model = readSkills(data.rows, FRACTION_SKILLS, { now });
    const open = openMisconceptions(data.rows, FRACTION_SKILLS, { now });
    const date = new Date(now).toISOString().slice(0, 10);
    const report = buildLessonReport({ childName: child?.name, rows: mine, target, model, open, profile: data.profile, nameOf: skillName, lib, date });
    out.report = report;

    // The note for the next lesson: conversational memory, deleted after 90 days (the table's rule and the read's filter).
    const gaps = open.slice(0, 3).map((o) => `${skillName(o.skill)}: ${phrase(lib, o.code)}`.slice(0, 120));
    if (typeof db.saveNote === 'function') {
      await db.saveNote({ userId: user.id, childId: child?.id || null, sessionId: /^[0-9a-f-]{36}$/i.test(sid) ? sid : null, notes: String(summary || '').slice(0, 600), openQuestions: gaps });
    }
    let saved = null;
    if (typeof db.saveReport === 'function') {
      saved = await db.saveReport({ parentId: user.id, learnerId: child?.id || null, sessionId: /^[0-9a-f-]{36}$/i.test(sid) ? sid : null, subject: report.subject, body: report.text, facts: report.facts });
    }
    // Email: once per lesson (a report already stored is not sent twice), only to the account's own address, only if the parent has not turned it off.
    if (saved && saved.fresh !== false && user.email && typeof db.sendEmail === 'function') {
      const prefs = typeof db.getReportPrefs === 'function' ? await db.getReportPrefs(user.id) : null;
      if (prefs?.email_lesson_reports !== false) {
        const ok = await db.sendEmail({ to: user.email, subject: report.subject, html: report.html, text: report.text });
        out.emailed = ok === true;
        if (typeof db.markReportEmailed === 'function' && saved.id) await db.markReportEmailed(saved.id, ok ? 'sent' : ok === null ? 'skipped' : 'failed');
      }
    }
  } catch (e) { console.error('voice-tutor: finish lesson', String(e?.message || e).slice(0, 200)); }
  return out;
}

export default { readLearner, rememberEvidence, upgradeEvidence, saveLearned, finishLesson, clearLearnerCache };
