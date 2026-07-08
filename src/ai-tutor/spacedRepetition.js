// ============================================================================
// FIRe-INSPIRED SPACED REPETITION ENGINE
// Fractional Implicit Repetition model from "The Math Academy Way"
// Subject-agnostic: functions that need skill data accept optional ctx
// ============================================================================

import { SKILLS as MATH_SKILLS, getPrerequisiteChain as mathPreChain } from './knowledgeGraph.js';

// Base intervals in days for each repetition level
const BASE_INTERVALS = [1, 3, 7, 14, 30, 60, 120, 240, 365];

// ==================== MEMORY STRENGTH ====================

export const calculateMemoryStrength = (skillProgress) => {
  if (!skillProgress?.lastPractice) return 0;

  const daysSince = (Date.now() - new Date(skillProgress.lastPractice).getTime()) / 86400000;
  const repNum = skillProgress.repNum || 0;
  const learningSpeed = skillProgress.learningSpeed || 1.0;

  const baseInterval = BASE_INTERVALS[Math.min(repNum, BASE_INTERVALS.length - 1)];
  const adjustedInterval = baseInterval / learningSpeed;

  return Math.exp(-daysSince / Math.max(adjustedInterval, 0.5));
};

// ==================== REVIEW INTERVAL ====================

export const getNextReviewInterval = (repNum, learningSpeed = 1.0) => {
  const base = BASE_INTERVALS[Math.min(repNum, BASE_INTERVALS.length - 1)];
  return base / learningSpeed;
};

// ==================== LEARNING SPEED ====================

export const updateLearningSpeed = (currentSpeed, wasCorrect, attempts) => {
  const adjustment = wasCorrect ? 0.05 : -0.08;
  const newSpeed = Math.max(0.3, Math.min(3.0, currentSpeed + adjustment));
  return Math.round(newSpeed * 100) / 100;
};

// ==================== PROCESS REVIEW RESULT ====================

export const processReviewResult = (skillProgress, wasCorrect, timeTakenMs, expectedTimeMs) => {
  const sp = { ...skillProgress };

  sp.attempts = (sp.attempts || 0) + 1;
  sp.correct = (sp.correct || 0) + (wasCorrect ? 1 : 0);
  sp.lastPractice = new Date().toISOString();

  let creditWeight = 1.0;
  if (expectedTimeMs && timeTakenMs > expectedTimeMs * 2) {
    creditWeight = Math.max(0.3, expectedTimeMs / timeTakenMs);
  }

  if (wasCorrect) {
    const rawDelta = 1.0 * creditWeight;
    sp.repNum = (sp.repNum || 0) + rawDelta;
    sp.learningSpeed = updateLearningSpeed(sp.learningSpeed || 1.0, true, sp.attempts);
    sp.consecutiveFailures = 0;
  } else {
    const decay = 1.0 + (sp.consecutiveFailures || 0) * 0.5;
    sp.repNum = Math.max(0, (sp.repNum || 0) - decay);
    sp.learningSpeed = updateLearningSpeed(sp.learningSpeed || 1.0, false, sp.attempts);
    sp.consecutiveFailures = (sp.consecutiveFailures || 0) + 1;

    if (sp.consecutiveFailures >= 3) {
      sp.mastered = false;
    }
  }

  return sp;
};

// ==================== IMPLICIT REPETITIONS ====================
// When student practices an advanced skill, prerequisites get partial credit

export const getImplicitRepetitions = (skillId, wasCorrect, ctx) => {
  const skills = ctx?.skills || MATH_SKILLS;
  const getPreChain = ctx?.getPreChain || mathPreChain;

  let chain;
  try { chain = getPreChain(skillId); } catch(e) { chain = []; }
  const implicitCredits = {};

  for (const preId of chain) {
    const depth = getDepth(skillId, preId, skills);
    const discount = Math.max(0.1, 0.4 / depth);

    if (wasCorrect) {
      implicitCredits[preId] = discount;
    }
  }

  return implicitCredits;
};

// Helper: calculate depth from skill to prerequisite
const getDepth = (fromId, toId, skills, visited = new Set(), depth = 1) => {
  const skill = skills[fromId];
  if (!skill) return 10;
  if (skill.prerequisites.includes(toId)) return depth;
  visited.add(fromId);

  for (const pre of skill.prerequisites) {
    if (visited.has(pre)) continue;
    const d = getDepth(pre, toId, skills, visited, depth + 1);
    if (d < 10) return d;
  }
  return 10;
};

// ==================== APPLY IMPLICIT CREDIT ====================

export const applyImplicitCredits = (progress, skillId, wasCorrect, ctx) => {
  // Implicit repetitions come from CORRECTLY exercising an advanced skill — that
  // is when its prerequisites were genuinely used. A wrong answer implies nothing.
  if (!wasCorrect) return { ...progress.skills };

  const credits = getImplicitRepetitions(skillId, wasCorrect, ctx);
  const updatedSkills = { ...progress.skills };
  const now = new Date().toISOString();

  for (const [preId, credit] of Object.entries(credits)) {
    const sp = updatedSkills[preId];
    // Never conjure mastery from nothing: a prerequisite the student has never
    // touched can't be credited by an advanced solve (that was the old false-
    // mastery risk). But BOTH mastered AND in-progress prerequisites should
    // benefit — this is the FIRe move that was previously skipped for in-progress
    // skills, leaving the implicit-review engine mostly inert.
    if (!sp) continue;

    if (sp.mastered) {
      // Refresh the spaced-repetition schedule, unless the memory is already strong.
      if (calculateMemoryStrength(sp) > 0.85) continue;
      updatedSkills[preId] = { ...sp, repNum: (sp.repNum || 0) + credit, lastPractice: now };
    } else if ((sp.attempts || 0) > 0) {
      // In-progress prerequisite: the advanced solve IS practice — nudge it
      // forward (schedule + a fractional correct toward mastery evidence).
      updatedSkills[preId] = {
        ...sp,
        repNum: (sp.repNum || 0) + credit,
        impCorrect: (sp.impCorrect || 0) + credit, // fractional implicit credit
        lastPractice: now,
      };
    }
  }

  return updatedSkills;
};

// ==================== REVIEW COMPRESSION ====================

export const compressReviews = (dueSkills, ctx) => {
  const getPreChain = ctx?.getPreChain || mathPreChain;

  const scored = dueSkills.map(s => {
    let chain;
    try { chain = getPreChain(s.id); } catch(e) { chain = []; }
    const coveredDue = chain.filter(cid => dueSkills.find(d => d.id === cid));
    return { ...s, covers: coveredDue.length };
  }).sort((a, b) => b.covers - a.covers);

  const selected = [];
  const covered = new Set();

  for (const s of scored) {
    if (covered.has(s.id)) continue;
    selected.push(s);
    covered.add(s.id);

    let chain;
    try { chain = getPreChain(s.id); } catch(e) { chain = []; }
    chain.forEach(cid => covered.add(cid));
  }

  return selected;
};

export default {
  calculateMemoryStrength,
  getNextReviewInterval,
  updateLearningSpeed,
  processReviewResult,
  getImplicitRepetitions,
  applyImplicitCredits,
  compressReviews,
};
