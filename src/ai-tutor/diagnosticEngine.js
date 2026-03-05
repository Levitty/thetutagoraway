// ============================================================================
// DIAGNOSTIC ENGINE — Adaptive placement with credit propagation
// Based on "The Math Academy Way" diagnostic approach
// ============================================================================

import { SKILLS, getPrerequisiteChain, getPostRequisiteChain } from './knowledgeGraph.js';

// ==================== CREDIT PROPAGATION ====================
// When student answers correctly, credit flows UP to prerequisites
// When student answers incorrectly, negative credit flows DOWN to post-requisites

export const propagateCredit = (balances, skillId, correct, weight = 1.0) => {
  const newBalances = { ...balances };

  // Update the answered skill itself
  newBalances[skillId] = (newBalances[skillId] || 0) + (correct ? weight : -weight);

  if (correct) {
    // Positive credit propagates UP to prerequisites (if I know advanced, I likely know basics)
    const prereqs = getPrerequisiteChain(skillId);
    for (const preId of prereqs) {
      const discount = 0.6; // Diminishing credit for distant prerequisites
      newBalances[preId] = (newBalances[preId] || 0) + weight * discount;
    }
  } else {
    // Negative credit propagates DOWN to post-requisites (if I fail basics, likely fail advanced)
    const postReqs = getPostRequisiteChain(skillId);
    for (const postId of postReqs) {
      const discount = 0.5;
      newBalances[postId] = (newBalances[postId] || 0) - weight * discount;
    }
  }

  return newBalances;
};

// ==================== TIME-WEIGHTED SCORING ====================
// If answer takes too long, reduce credit weight (Math Academy approach)

export const getTimeWeight = (timeTakenMs, expectedMs = 30000) => {
  if (timeTakenMs <= expectedMs) return 1.0;
  if (timeTakenMs <= expectedMs * 2) return 0.7;
  if (timeTakenMs <= expectedMs * 3) return 0.4;
  return 0.2;
};

// ==================== ADAPTIVE QUESTION SELECTION ====================
// Choose next diagnostic question based on current confidence levels

export const selectNextQuestion = (balances, availableSkills, answeredSkills) => {
  const unanswered = availableSkills.filter(s => !answeredSkills.has(s.id));
  if (unanswered.length === 0) return null;

  // Priority: skills with lowest absolute confidence (most uncertain)
  // But also consider coverage across strands and grades
  const scored = unanswered.map(s => {
    const confidence = Math.abs(balances[s.id] || 0);
    const strandBonus = getStrandCoverage(answeredSkills, s.strand);
    const gradeBias = 0; // Could add adaptive difficulty here

    return {
      skill: s,
      score: -confidence + strandBonus, // Lower confidence = higher priority
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.skill || unanswered[0];
};

// Helper: bonus for underrepresented strands
const getStrandCoverage = (answered, strand) => {
  const strandCount = [...answered].filter(id => SKILLS[id]?.strand === strand).length;
  return Math.max(0, 3 - strandCount); // Bonus if strand has < 3 questions
};

// ==================== PROCESS DIAGNOSTIC RESULTS ====================
// Convert plus-minus balances into initial progress state

export const processDiagnosticResults = (balances) => {
  const skills = {};

  for (const [skillId, balance] of Object.entries(balances)) {
    if (!SKILLS[skillId]) continue;
    const skill = SKILLS[skillId];

    if (balance > 0.5) {
      // Student likely knows this skill
      skills[skillId] = {
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
      // Student likely doesn't know this — mark as needs learning
      skills[skillId] = {
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
    // Skills with near-zero balance: uncertain, leave unassessed
  }

  return skills;
};

// ==================== CONFLICT DETECTION ====================
// Detect when student gets advanced skill right but prerequisite wrong

export const detectConflicts = (balances, results) => {
  const conflicts = [];

  for (const [skillId, result] of Object.entries(results)) {
    if (!result.correct) continue;
    const skill = SKILLS[skillId];
    if (!skill) continue;

    for (const preId of skill.prerequisites) {
      const preResult = results[preId];
      if (preResult && !preResult.correct) {
        conflicts.push({
          advancedSkill: skillId,
          prerequisite: preId,
          type: 'prerequisite-postrequisite',
          message: `Got ${skill.name} right but struggled with prerequisite ${SKILLS[preId]?.name}`,
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
