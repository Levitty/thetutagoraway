// ============================================================================
// DIAGNOSTIC ENGINE — Adaptive placement with credit propagation
// Based on "The Math Academy Way" diagnostic approach
// Subject-agnostic: accepts optional ctx parameter
// ============================================================================

import { SKILLS as MATH_SKILLS, getPrerequisiteChain as mathPreChain, getPostRequisiteChain as mathPostChain } from './knowledgeGraph.js';

// ==================== CREDIT PROPAGATION ====================

export const propagateCredit = (balances, skillId, correct, weight = 1.0, ctx) => {
  const getPreChain = ctx?.getPreChain || mathPreChain;
  const getPostChain = ctx?.getPostChain || mathPostChain;
  const newBalances = { ...balances };

  newBalances[skillId] = (newBalances[skillId] || 0) + (correct ? weight : -weight);

  if (correct) {
    let prereqs;
    try { prereqs = getPreChain(skillId); } catch(e) { prereqs = []; }
    for (const preId of prereqs) {
      const discount = 0.6;
      newBalances[preId] = (newBalances[preId] || 0) + weight * discount;
    }
  } else {
    let postReqs;
    try { postReqs = getPostChain(skillId); } catch(e) { postReqs = []; }
    for (const postId of postReqs) {
      const discount = 0.5;
      newBalances[postId] = (newBalances[postId] || 0) - weight * discount;
    }
  }

  return newBalances;
};

// ==================== TIME-WEIGHTED SCORING ====================

export const getTimeWeight = (timeTakenMs, expectedMs = 30000) => {
  if (timeTakenMs <= expectedMs) return 1.0;
  if (timeTakenMs <= expectedMs * 2) return 0.7;
  if (timeTakenMs <= expectedMs * 3) return 0.4;
  return 0.2;
};

// Question selection for the check lives in placement.js, which sweeps the
// declared grade across every strand before stepping down a grade. A
// strand-balancing selector used to live here and was never called by the
// app — the check was in fact 98% Numbers questions. Don't add a second
// selector here.

// ==================== PROCESS DIAGNOSTIC RESULTS ====================

export const processDiagnosticResults = (balances, ctx) => {
  const skills = ctx?.skills || MATH_SKILLS;
  const result = {};

  for (const [skillId, balance] of Object.entries(balances)) {
    if (!skills[skillId]) continue;

    if (balance > 0.5) {
      result[skillId] = {
        attempts: Math.round(Math.abs(balance)),
        correct: Math.round(Math.abs(balance)),
        mastered: balance > 1.5,
        passed: true,
        repNum: balance > 1.5 ? 2 : 1,
        learningSpeed: 1.0,
        lastPractice: new Date().toISOString(),
        fromDiagnostic: true,
        consecutiveFailures: 0,
      };
    } else if (balance < -0.3) {
      result[skillId] = {
        attempts: 1,
        correct: 0,
        mastered: false,
        passed: false,
        repNum: 0,
        learningSpeed: 1.0,
        lastPractice: null,
        fromDiagnostic: true,
        consecutiveFailures: 0,
      };
    }
  }

  return result;
};

// ==================== CONFLICT DETECTION ====================

export const detectConflicts = (balances, results, ctx) => {
  const skills = ctx?.skills || MATH_SKILLS;
  const conflicts = [];

  for (const [skillId, result] of Object.entries(results)) {
    if (!result.correct) continue;
    const skill = skills[skillId];
    if (!skill) continue;

    for (const preId of skill.prerequisites) {
      const preResult = results[preId];
      if (preResult && !preResult.correct) {
        conflicts.push({
          advancedSkill: skillId,
          prerequisite: preId,
          type: 'prerequisite-postrequisite',
          message: `Got ${skill.name} right but struggled with prerequisite ${skills[preId]?.name}`,
        });
      }
    }
  }

  return conflicts;
};

export default {
  propagateCredit,
  getTimeWeight,
  processDiagnosticResults,
  detectConflicts,
};
