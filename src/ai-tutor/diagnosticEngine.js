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

// ==================== ADAPTIVE QUESTION SELECTION ====================

export const selectNextQuestion = (balances, availableSkills, answeredSkills, ctx) => {
  const skills = ctx?.skills || MATH_SKILLS;
  const unanswered = availableSkills.filter(s => !answeredSkills.has(s.id));
  if (unanswered.length === 0) return null;

  const scored = unanswered.map(s => {
    const confidence = Math.abs(balances[s.id] || 0);
    const strandBonus = getStrandCoverage(answeredSkills, s.strand, skills);
    return {
      skill: s,
      score: -confidence + strandBonus,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.skill || unanswered[0];
};

const getStrandCoverage = (answered, strand, skills) => {
  const strandCount = [...answered].filter(id => skills[id]?.strand === strand).length;
  return Math.max(0, 3 - strandCount);
};

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
  selectNextQuestion,
  processDiagnosticResults,
  detectConflicts,
};
