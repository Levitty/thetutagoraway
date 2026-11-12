// ============================================================================
// WHICH SUBJECT A CURRICULUM SKILL BELONGS TO (12 Nov 2026).
//
// A curriculum skill code starts with its subject: MATH.G5..., SCIE.G5..., ENGL.G5.... The practice engine, the
// homework door and the learner model all key their rows by that code, so the subject is read from the code and
// nothing is stored twice. One light generated import only: this file is read by the browser, the edge functions and mastery.js alike.
// ============================================================================
// The ids and prefixes are generated from the subject registry (scripts/build-subject-registry.mjs, npm run registry).
import { SUBJECT_IDS, SUBJECT_PREFIXES as PREFIX } from './subjects.generated.js';
export { SUBJECT_IDS, PREFIX as SUBJECT_PREFIXES };

/** a subject id ('math', 'science', 'english', ...) for a curriculum skill code, or null when it is not one (a HOREB skill id such as G5_ADDITION). */
export const subjectOfCskill = (code) => PREFIX[String(code || '').split('.')[0]] || null;

/** The grade in a curriculum skill code (MATH.G5... -> 5), or null. */
export const gradeOfCskill = (code) => { const m = /^[A-Z]{4}\.G(\d+)\./.exec(String(code || '')); return m ? Number(m[1]) : null; };

/** The subject of a family: Maths families carry no subject, the others name theirs. */
export const subjectOfFamily = (f) => f?.subject || 'math';

/** A child's class as the family app keeps it ('Grade 5') as a number, or null for Form 1, University, an adult or nothing. */
export const gradeNumber = (g) => { const m = /^Grade\s+(\d{1,2})$/i.exec(String(g ?? '').trim()); return m ? Number(m[1]) : null; };
