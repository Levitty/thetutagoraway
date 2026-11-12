// ============================================================================
// ENGLISH QUESTION FAMILIES: one list per grade, kept apart from the Maths bank (bank.js).
// Nothing here is served to a child yet: every family is reviewed:false, and the engine's skill list
// (knowledgeGraph.js) is Maths. A teacher signs families off from docs/qa/english-g5-2026-11-12.md.
// Checks: engine/scripts/english_checks.mjs (run by the quality gate and tests/english-g5.test.mjs).
// ============================================================================
import { FAMILIES as G5_LANG } from './eng_g5_lang.js';
import { FAMILIES as G5_VOCAB } from './eng_g5_vocab.js';
import { FAMILIES as G5_READING } from './eng_g5_reading.js';

export const ENGLISH_G5 = [...G5_LANG, ...G5_VOCAB, ...G5_READING];
export const ENGLISH_FAMILIES = [...ENGLISH_G5];
