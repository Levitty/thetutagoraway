// ============================================================================
// ADAPTIVE ENGINE — Knowledge frontier, gap detection, learning path
// Based on "The Math Academy Way" methodology
// ============================================================================

import { SKILLS, getPostRequisites, getPrerequisiteChain, getPostRequisiteChain, STRANDS } from './knowledgeGraph.js';

const skillList = Object.values(SKILLS);

// ==================== PREREQUISITE CHECKING ====================

export const prereqsMet = (skillId, progress) => {
  const skill = SKILLS[skillId];
  if (!skill || skill.prerequisites.length === 0) return true;
  return skill.prerequisites.every(pid => {
    const sp = progress.skills[pid];
    return sp?.mastered || (sp?.passed && sp?.attempts >= 3);
  });
};

// ==================== SKILL STATUS ====================

export const getStatus = (skillId, progress) => {
  const sp = progress.skills[skillId];
  if (sp?.mastered) return 'mastered';
  if (sp?.attempts > 0) return 'in_progress';
  return prereqsMet(skillId, progress) ? 'available' : 'locked';
};

// ==================== KNOWLEDGE FRONTIER ====================
// The frontier is the set of skills a student is ready to learn
// (prerequisites met but not yet mastered)

export const getKnowledgeFrontier = (progress) => {
  return skillList.filter(s => {
    const sp = progress.skills[s.id];
    if (sp?.mastered) return false;
    return prereqsMet(s.id, progress);
  });
};

// ==================== GAP DETECTION ====================
// Identifies foundational gaps: student is struggling with a skill
// because prerequisites are weak

export const findGaps = (progress) => {
  const gaps = [];
  const seen = new Set();

  for (const skill of skillList) {
    const sp = progress.skills[skill.id];
    // Student has attempted this skill and is struggling (< 60% accuracy after 3+ attempts)
    if (sp && sp.attempts >= 3 && (sp.correct / sp.attempts) < 0.6) {
      // Check key prerequisites — these are the most likely cause
      const preReqs = skill.keyPrerequisites || skill.prerequisites;
      for (const pid of preReqs) {
        const pp = progress.skills[pid];
        // If prerequisite isn't mastered, it's a gap
        if (!pp?.mastered && !seen.has(pid)) {
          seen.add(pid);
          const preSkill = SKILLS[pid];
          if (!preSkill) continue;

          // Calculate priority: how many skills depend on this gap?
          const dependents = getPostRequisiteChain(pid);
          const priority = (preSkill.critical ? 15 : 5) + dependents.length * 2;

          gaps.push({
            ...preSkill,
            priority,
            reason: `Needed for ${skill.name}`,
            type: 'gap',
            blockedSkills: dependents.length,
          });
        }
      }
    }
  }

  return gaps.sort((a, b) => b.priority - a.priority);
};

// ==================== REVIEW DETECTION ====================
// Skills due for spaced repetition review

export const getReviews = (progress) => {
  const now = Date.now();
  const reviews = [];

  for (const skill of skillList) {
    const sp = progress.skills[skill.id];
    if (!sp?.mastered || !sp.lastPractice) continue;

    const daysSince = (now - new Date(sp.lastPractice).getTime()) / 86400000;
    const repNum = sp.repNum || 0;

    // FIRe-inspired intervals: increases with each successful review
    const baseIntervals = [1, 3, 7, 14, 30, 60, 120, 240];
    const learningSpeed = sp.learningSpeed || 1.0;
    const interval = (baseIntervals[Math.min(repNum, baseIntervals.length - 1)]) / learningSpeed;

    // Memory strength estimation (exponential decay)
    const memoryStrength = Math.exp(-daysSince / Math.max(interval, 1));

    if (memoryStrength < 0.6) {
      reviews.push({
        ...skill,
        daysSince: Math.round(daysSince),
        memoryStrength: Math.round(memoryStrength * 100),
        urgency: 1 - memoryStrength, // Higher = more urgent
        type: 'review',
      });
    }
  }

  return reviews.sort((a, b) => b.urgency - a.urgency);
};

// ==================== NEXT SKILLS TO LEARN ====================
// Prioritized by: critical skills, number of dependents, already started

export const getNextToLearn = (progress) => {
  return skillList
    .filter(s => {
      const sp = progress.skills[s.id];
      return !sp?.mastered && prereqsMet(s.id, progress);
    })
    .map(s => {
      const dependents = getPostRequisites(s.id).length;
      const sp = progress.skills[s.id];
      const inProgress = sp?.attempts > 0 ? 8 : 0;
      const criticalBonus = s.critical ? 12 : 0;
      const gradeProximity = Math.max(0, 8 - Math.abs(s.grade - getEstimatedGradeLevel(progress)));

      return {
        ...s,
        priority: criticalBonus + dependents * 2 + inProgress + gradeProximity,
        type: 'learn',
      };
    })
    .sort((a, b) => b.priority - a.priority);
};

// ==================== RECOMMENDED LEARNING PATH ====================
// Combines gaps, reviews, and new skills into an ordered path
// Following Math Academy's approach: gaps first, then reviews, then new material

export const getRecommendedPath = (progress) => {
  const path = [];
  const seen = new Set();

  // Priority 1: Foundation gaps (targeted remediation)
  const gaps = findGaps(progress);
  for (const g of gaps.slice(0, 3)) {
    if (!seen.has(g.id)) { path.push(g); seen.add(g.id); }
  }

  // Priority 2: Spaced repetition reviews (due items)
  const reviews = getReviews(progress);
  for (const r of reviews.slice(0, 2)) {
    if (!seen.has(r.id)) { path.push(r); seen.add(r.id); }
  }

  // Priority 3: New skills to learn (knowledge frontier)
  const nextSkills = getNextToLearn(progress);

  // Macro-interleaving: pick from different strands
  const strandPicks = {};
  for (const s of nextSkills) {
    if (seen.has(s.id)) continue;
    if (!strandPicks[s.strand]) strandPicks[s.strand] = s;
    if (Object.keys(strandPicks).length >= 3) break;
  }
  for (const s of Object.values(strandPicks)) {
    if (path.length < 8) { path.push(s); seen.add(s.id); }
  }

  // Fill remaining spots
  for (const s of nextSkills) {
    if (path.length >= 8 || seen.has(s.id)) continue;
    path.push(s); seen.add(s.id);
  }

  return path;
};

// ==================== DIAGNOSTIC SKILL SELECTION ====================
// Select skills for diagnostic test using graph compression
// A skill is "covered" if it has progeny and ancestor within 3 edges

export const getDiagnosticSkills = (progress) => {
  // Select representative skills across difficulty levels and strands
  const easy = skillList.filter(s => s.weight <= 2);
  const medium = skillList.filter(s => s.weight > 2 && s.weight <= 4);
  const hard = skillList.filter(s => s.weight > 4 && s.weight <= 6);
  const veryHard = skillList.filter(s => s.weight > 6);

  const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Ensure strand coverage
  const selected = [];
  const usedStrands = new Set();

  // Pick critical skills first (gateway skills)
  const criticals = shuffleArr(skillList.filter(s => s.critical));
  for (const s of criticals.slice(0, 10)) {
    selected.push(s);
    usedStrands.add(s.strand);
  }

  // Fill with balanced difficulty
  const remaining = [
    ...shuffleArr(easy).slice(0, 6),
    ...shuffleArr(medium).slice(0, 10),
    ...shuffleArr(hard).slice(0, 8),
    ...shuffleArr(veryHard).slice(0, 4),
  ].filter(s => !selected.find(sel => sel.id === s.id));

  for (const s of shuffleArr(remaining)) {
    if (selected.length >= 40) break;
    selected.push(s);
  }

  // Sort by difficulty (start easy, get harder — adaptive)
  return selected.sort((a, b) => a.weight - b.weight);
};

// ==================== TARGETED REMEDIATION ====================
// When student fails a KP, find the key prerequisites to remediate

export const getRemediationSkills = (skillId, kpIndex, progress) => {
  const skill = SKILLS[skillId];
  if (!skill) return [];

  // Use key prerequisites for that skill
  const keyPres = skill.keyPrerequisites || skill.prerequisites;

  return keyPres
    .filter(pid => {
      const pp = progress.skills[pid];
      // Only remediate if not fully mastered or has been struggling
      return !pp?.mastered || (pp.attempts > 0 && pp.correct / pp.attempts < 0.8);
    })
    .map(pid => ({
      ...SKILLS[pid],
      type: 'remediation',
      reason: `Foundation for ${skill.name}`,
    }));
};

// ==================== STATISTICS ====================

export const getStats = (progress) => {
  let mastered = 0, total = skillList.length, correct = 0, attempts = 0;
  for (const s of skillList) {
    if (progress.skills[s.id]?.mastered) mastered++;
    correct += progress.skills[s.id]?.correct || 0;
    attempts += progress.skills[s.id]?.attempts || 0;
  }
  return {
    mastered,
    total,
    percent: Math.round((mastered / total) * 100),
    accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    totalAttempts: attempts,
    totalCorrect: correct,
  };
};

export const getStrandStats = (progress) => {
  const strands = {};
  for (const s of skillList) {
    if (!strands[s.strand]) strands[s.strand] = { total: 0, mastered: 0, correct: 0, attempts: 0, skills: [] };
    strands[s.strand].total++;
    strands[s.strand].skills.push(s);
    const sp = progress.skills[s.id];
    if (sp?.mastered) strands[s.strand].mastered++;
    strands[s.strand].correct += sp?.correct || 0;
    strands[s.strand].attempts += sp?.attempts || 0;
  }
  return Object.entries(strands).map(([name, d]) => ({
    name,
    ...d,
    percent: Math.round((d.mastered / d.total) * 100),
    accuracy: d.attempts > 0 ? Math.round((d.correct / d.attempts) * 100) : null,
  }));
};

export const getGradeStats = (progress) => {
  const grades = {};
  for (const s of skillList) {
    if (!grades[s.grade]) grades[s.grade] = { total: 0, mastered: 0 };
    grades[s.grade].total++;
    if (progress.skills[s.id]?.mastered) grades[s.grade].mastered++;
  }
  return Object.entries(grades).map(([grade, d]) => ({
    grade: parseInt(grade),
    ...d,
    percent: Math.round((d.mastered / d.total) * 100),
  })).sort((a, b) => a.grade - b.grade);
};

// Estimate the student's current working grade level
export const getEstimatedGradeLevel = (progress) => {
  const gradeStats = getGradeStats(progress);
  let level = 5;
  for (const gs of gradeStats) {
    if (gs.percent >= 60) level = gs.grade + 1;
    else break;
  }
  return Math.min(level, 12);
};

// ==================== XP SYSTEM ====================

export const calculateXP = (accuracy, estimatedMinutes, isPerfect) => {
  const baseXP = estimatedMinutes || 15;

  if (accuracy >= 1.0) return Math.round(baseXP * 1.5); // Perfect: 150%
  if (accuracy >= 0.9) return Math.round(baseXP * 1.25); // Excellent: 125%
  if (accuracy >= 0.7) return Math.round(baseXP); // Passing: 100%
  return Math.round(baseXP * 0.5); // Below passing: 50%
};

export const getTotalXP = (progress) => {
  return progress.totalXP || 0;
};

export const getLevel = (totalXP) => {
  // Exponential level curve
  const levels = [0, 50, 150, 300, 500, 800, 1200, 1800, 2600, 3600, 5000, 7000, 10000, 14000, 20000];
  let level = 1;
  for (let i = 1; i < levels.length; i++) {
    if (totalXP >= levels[i]) level = i + 1;
    else break;
  }
  const current = levels[level - 1] || 0;
  const next = levels[level] || levels[levels.length - 1] * 1.5;
  return {
    level,
    currentXP: totalXP - current,
    nextLevelXP: next - current,
    progress: Math.min(100, Math.round(((totalXP - current) / (next - current)) * 100)),
  };
};

// ==================== INTERLEAVED REVIEW SELECTION ====================
// Select problems for a review session with micro-interleaving

export const selectReviewProblems = (progress, count = 12) => {
  const reviews = getReviews(progress);
  const masteredSkills = skillList.filter(s => progress.skills[s.id]?.mastered);

  // Prioritize due reviews, then sample from mastered skills
  const selected = [];
  const problemsPerSkill = 3;

  // Due reviews first
  for (const r of reviews) {
    if (selected.length >= count) break;
    for (let i = 0; i < problemsPerSkill && selected.length < count; i++) {
      selected.push(r.id);
    }
  }

  // Fill with random mastered skills (micro-interleaving)
  const shuffled = [...masteredSkills].sort(() => Math.random() - 0.5);
  for (const s of shuffled) {
    if (selected.length >= count) break;
    if (!selected.includes(s.id)) {
      for (let i = 0; i < problemsPerSkill && selected.length < count; i++) {
        selected.push(s.id);
      }
    }
  }

  // Shuffle for interleaving (don't group same-skill problems together)
  return selected.sort(() => Math.random() - 0.5);
};

export default {
  prereqsMet,
  getStatus,
  getKnowledgeFrontier,
  findGaps,
  getReviews,
  getNextToLearn,
  getRecommendedPath,
  getDiagnosticSkills,
  getRemediationSkills,
  getStats,
  getStrandStats,
  getGradeStats,
  getEstimatedGradeLevel,
  calculateXP,
  getTotalXP,
  getLevel,
  selectReviewProblems,
};
