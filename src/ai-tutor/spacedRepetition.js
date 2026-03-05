// ============================================================================
// FIRe-INSPIRED SPACED REPETITION ENGINE
// Fractional Implicit Repetition model from "The Math Academy Way"
// ============================================================================

import { SKILLS, getPrerequisiteChain } from './knowledgeGraph.js';

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

  // Exponential decay
  return Math.exp(-daysSince / Math.max(adjustedInterval, 0.5));
};

// ==================== REVIEW INTERVAL ====================

export const getNextReviewInterval = (repNum, learningSpeed = 1.0) => {
  const base = BASE_INTERVALS[Math.min(repNum, BASE_INTERVALS.length - 1)];
  return base / learningSpeed;
};

// ==================== LEARNING SPEED ====================
// Adapts based on student's accuracy on this specific skill

export const updateLearningSpeed = (currentSpeed, wasCorrect, attempts) => {
  // Slow adjustment to avoid oscillation
  const adjustment = wasCorrect ? 0.05 : -0.08;
  const newSpeed = Math.max(0.3, Math.min(3.0, currentSpeed + adjustment));
  return Math.round(newSpeed * 100) / 100;
};

// ==================== PROCESS REVIEW RESULT ====================

export const processReviewResult = (skillProgress, wasCorrect, timeTakenMs, expectedTimeMs) => {
  const sp = { ...skillProgress };

  // Update core counters
  sp.attempts = (sp.attempts || 0) + 1;
  sp.correct = (sp.correct || 0) + (wasCorrect ? 1 : 0);
  sp.lastPractice = new Date().toISOString();

  // Time-weighted credit (Math Academy approach)
  let creditWeight = 1.0;
  if (expectedTimeMs && timeTakenMs > expectedTimeMs * 2) {
    // Answer took too long — reduce credit
    creditWeight = Math.max(0.3, expectedTimeMs / timeTakenMs);
  }

  if (wasCorrect) {
    // Successful review: advance repetition count
    const rawDelta = 1.0 * creditWeight;
    sp.repNum = (sp.repNum || 0) + rawDelta;
    sp.learningSpeed = updateLearningSpeed(sp.learningSpeed || 1.0, true, sp.attempts);
    sp.consecutiveFailures = 0;
  } else {
    // Failed review: step back
    const decay = 1.0 + (sp.consecutiveFailures || 0) * 0.5;
    sp.repNum = Math.max(0, (sp.repNum || 0) - decay);
    sp.learningSpeed = updateLearningSpeed(sp.learningSpeed || 1.0, false, sp.attempts);
    sp.consecutiveFailures = (sp.consecutiveFailures || 0) + 1;

    // If severely failing, un-master the skill
    if (sp.consecutiveFailures >= 3) {
      sp.mastered = false;
    }
  }

  return sp;
};

// ==================== IMPLICIT REPETITIONS ====================
// When student practices an advanced skill, prerequisites get partial credit

export const getImplicitRepetitions = (skillId, wasCorrect) => {
  const chain = getPrerequisiteChain(skillId);
  const implicitCredits = {};

  for (const preId of chain) {
    // Discount factor: further prerequisites get less credit
    const depth = getDepth(skillId, preId);
    const discount = Math.max(0.1, 0.4 / depth);

    if (wasCorrect) {
      implicitCredits[preId] = discount;
    } else {
      // Negative implicit credit for post-requisites (not prerequisites)
      // We don't penalize prerequisites for advanced failures
    }
  }

  return implicitCredits;
};

// Helper: calculate depth from skill to prerequisite
const getDepth = (fromId, toId, visited = new Set(), depth = 1) => {
  const skill = SKILLS[fromId];
  if (!skill) return 10;
  if (skill.prerequisites.includes(toId)) return depth;
  visited.add(fromId);

  for (const pre of skill.prerequisites) {
    if (visited.has(pre)) continue;
    const d = getDepth(pre, toId, visited, depth + 1);
    if (d < 10) return d;
  }
  return 10;
};

// ==================== APPLY IMPLICIT CREDIT ====================

export const applyImplicitCredits = (progress, skillId, wasCorrect) => {
  const credits = getImplicitRepetitions(skillId, wasCorrect);
  const updatedSkills = { ...progress.skills };

  for (const [preId, credit] of Object.entries(credits)) {
    const sp = updatedSkills[preId];
    if (!sp?.mastered) continue; // Only apply to mastered skills

    // Check if skill needs review (don't give credit if not due)
    const memory = calculateMemoryStrength(sp);
    if (memory > 0.8) continue; // Not due yet, skip

    // Apply implicit credit
    updatedSkills[preId] = {
      ...sp,
      repNum: (sp.repNum || 0) + credit,
      lastPractice: new Date().toISOString(),
    };
  }

  return updatedSkills;
};

// ==================== REVIEW COMPRESSION ====================
// Select minimum reviews that cover the most due skills via encompassings

export const compressReviews = (dueSkills) => {
  // Sort by number of encompassings (skills that implicitly review others)
  const scored = dueSkills.map(s => {
    const chain = getPrerequisiteChain(s.id);
    const coveredDue = chain.filter(cid => dueSkills.find(d => d.id === cid));
    return { ...s, covers: coveredDue.length };
  }).sort((a, b) => b.covers - a.covers);

  const selected = [];
  const covered = new Set();

  for (const s of scored) {
    if (covered.has(s.id)) continue;
    selected.push(s);
    covered.add(s.id);

    // Mark covered prerequisites
    const chain = getPrerequisiteChain(s.id);
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
