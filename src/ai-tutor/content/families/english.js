// ============================================================================
// ENGLISH QUESTION FAMILIES: kept apart from the Maths bank (bank.js). The lists now come from the subject registry
// (content/subjects/english_g5.js), which is the one place that names the English files. Names kept for the callers.
// Nothing here is served to a child yet: every family is reviewed:false until a teacher signs it off
// (docs/qa/english-g5-2026-11-12.md). Checks: engine/scripts/english_checks.mjs.
// ============================================================================
import { entryFor, familiesOf } from '../subjects/registry.js';

export const ENGLISH_G5 = entryFor('english', 5).families;
export const ENGLISH_FAMILIES = familiesOf('english');
