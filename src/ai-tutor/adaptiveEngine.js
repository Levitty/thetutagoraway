// ============================================================================
// ADAPTIVE ENGINE — Knowledge frontier, gap detection, learning path
// Based on "The Math Academy Way" methodology
// Subject-agnostic: accepts a ctx parameter { skills, getPostReqs, strands }
// ============================================================================

import { SKILLS as MATH_SKILLS, getPostRequisites as mathGetPostReqs, getPrerequisiteChain as mathPreChain, getPostRequisiteChain as mathPostChain, STRANDS as MATH_STRANDS } from './knowledgeGraph.js';

// Default context (math) for backward compatibility
const defaultCtx = () => ({
  skills: MATH_SKILLS,
  skillList: Object.values(MATH_SKILLS),
  getPostReqs: mathGetPostReqs,
  getPreChain: mathPreChain,
  getPostChain: mathPostChain,
  strands: MATH_STRANDS,
});

const resolveCtx = (ctx) => {
  if (!ctx) return defaultCtx();
  const skills = ctx.skills || MATH_SKILLS;
  return {
    skills,
    skillList: Object.values(skills),
    getPostReqs: ctx.getPostReqs || mathGetPostReqs,
    getPreChain: ctx.getPreChain || mathPreChain,
    getPostChain: ctx.getPostChain || mathPostChain,
    strands: ctx.strands || MATH_STRANDS,
  };
};

// ==================== PREREQUISITE CHECKING ====================

export const prereqsMet = (skillId, progress, ctx) => {
  const c = resolveCtx(ctx);
  const skill = c.skills[skillId];
  if (!skill || skill.prerequisites.length === 0) return true;
  return skill.prerequisites.every(pid => {
    const sp = progress.skills[pid];
    return sp?.mastered || (sp?.passed && sp?.attempts >= 3);
  });
};

// ==================== SKILL STATUS ====================

export const getStatus = (skillId, progress, ctx) => {
  const sp = progress.skills[skillId];
  if (sp?.mastered) return 'mastered';
  if (sp?.attempts > 0) return 'in_progress';
  return prereqsMet(skillId, progress, ctx) ? 'available' : 'locked';
};

// ==================== KNOWLEDGE FRONTIER ====================

export const getKnowledgeFrontier = (progress, ctx) => {
  const c = resolveCtx(ctx);
  return c.skillList.filter(s => {
    const sp = progress.skills[s.id];
    if (sp?.mastered) return false;
    return prereqsMet(s.id, progress, ctx);
  });
};

// ==================== GAP DETECTION ====================

export const findGaps = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const gaps = [];
  const seen = new Set();

  for (const skill of c.skillList) {
    const sp = progress.skills[skill.id];
    if (sp && sp.attempts >= 3 && (sp.correct / sp.attempts) < 0.6) {
      const preReqs = skill.keyPrerequisites || skill.prerequisites;
      for (const pid of preReqs) {
        const pp = progress.skills[pid];
        if (!pp?.mastered && !seen.has(pid)) {
          seen.add(pid);
          const preSkill = c.skills[pid];
          if (!preSkill) continue;

          let dependentCount = 0;
          try { dependentCount = c.getPostChain(pid).length; } catch(e) { dependentCount = 0; }
          const priority = (preSkill.critical ? 15 : 5) + dependentCount * 2;

          gaps.push({
            ...preSkill,
            priority,
            reason: `Needed for ${skill.name}`,
            type: 'gap',
            blockedSkills: dependentCount,
          });
        }
      }
    }
  }

  return gaps.sort((a, b) => b.priority - a.priority);
};

// ==================== REVIEW DETECTION ====================

export const getReviews = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const now = Date.now();
  const reviews = [];

  for (const skill of c.skillList) {
    const sp = progress.skills[skill.id];
    if (!sp?.mastered || !sp.lastPractice) continue;

    const daysSince = (now - new Date(sp.lastPractice).getTime()) / 86400000;
    const repNum = sp.repNum || 0;
    const baseIntervals = [1, 3, 7, 14, 30, 60, 120, 240];
    const learningSpeed = sp.learningSpeed || 1.0;
    const interval = (baseIntervals[Math.min(repNum, baseIntervals.length - 1)]) / learningSpeed;
    const memoryStrength = Math.exp(-daysSince / Math.max(interval, 1));

    if (memoryStrength < 0.6) {
      reviews.push({
        ...skill,
        daysSince: Math.round(daysSince),
        memoryStrength: Math.round(memoryStrength * 100),
        urgency: 1 - memoryStrength,
        type: 'review',
      });
    }
  }

  return reviews.sort((a, b) => b.urgency - a.urgency);
};

// ==================== NEXT SKILLS TO LEARN ====================

export const getNextToLearn = (progress, ctx) => {
  const c = resolveCtx(ctx);
  return c.skillList
    .filter(s => {
      const sp = progress.skills[s.id];
      return !sp?.mastered && prereqsMet(s.id, progress, ctx);
    })
    .map(s => {
      let dependents = 0;
      try { dependents = c.getPostReqs(s.id).length; } catch(e) {}
      const sp = progress.skills[s.id];
      const inProgress = sp?.attempts > 0 ? 8 : 0;
      const criticalBonus = s.critical ? 12 : 0;
      const gradeProximity = Math.max(0, 8 - Math.abs(s.grade - getEstimatedGradeLevel(progress, ctx)));

      return {
        ...s,
        priority: criticalBonus + dependents * 2 + inProgress + gradeProximity,
        type: 'learn',
      };
    })
    .sort((a, b) => b.priority - a.priority);
};

// ==================== RECOMMENDED LEARNING PATH ====================

export const getRecommendedPath = (progress, ctx) => {
  const path = [];
  const seen = new Set();

  const gaps = findGaps(progress, ctx);
  for (const g of gaps.slice(0, 3)) {
    if (!seen.has(g.id)) { path.push(g); seen.add(g.id); }
  }

  const reviews = getReviews(progress, ctx);
  for (const r of reviews.slice(0, 2)) {
    if (!seen.has(r.id)) { path.push(r); seen.add(r.id); }
  }

  const nextSkills = getNextToLearn(progress, ctx);
  const strandPicks = {};
  for (const s of nextSkills) {
    if (seen.has(s.id)) continue;
    if (!strandPicks[s.strand]) strandPicks[s.strand] = s;
    if (Object.keys(strandPicks).length >= 3) break;
  }
  for (const s of Object.values(strandPicks)) {
    if (path.length < 8) { path.push(s); seen.add(s.id); }
  }

  for (const s of nextSkills) {
    if (path.length >= 8 || seen.has(s.id)) continue;
    path.push(s); seen.add(s.id);
  }

  return path;
};

// ==================== DIAGNOSTIC SKILL SELECTION ====================

export const getDiagnosticSkills = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const easy = c.skillList.filter(s => s.weight <= 2);
  const medium = c.skillList.filter(s => s.weight > 2 && s.weight <= 4);
  const hard = c.skillList.filter(s => s.weight > 4 && s.weight <= 6);
  const veryHard = c.skillList.filter(s => s.weight > 6);

  const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const selected = [];
  const usedStrands = new Set();

  const criticals = shuffleArr(c.skillList.filter(s => s.critical));
  for (const s of criticals.slice(0, 10)) {
    selected.push(s);
    usedStrands.add(s.strand);
  }

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

  return selected.sort((a, b) => a.weight - b.weight);
};

// ==================== TARGETED REMEDIATION ====================

export const getRemediationSkills = (skillId, kpIndex, progress, ctx) => {
  const c = resolveCtx(ctx);
  const skill = c.skills[skillId];
  if (!skill) return [];

  const keyPres = skill.keyPrerequisites || skill.prerequisites;

  return keyPres
    .filter(pid => {
      const pp = progress.skills[pid];
      return !pp?.mastered || (pp.attempts > 0 && pp.correct / pp.attempts < 0.8);
    })
    .map(pid => ({
      ...c.skills[pid],
      type: 'remediation',
      reason: `Foundation for ${skill.name}`,
    }))
    .filter(s => s.id); // filter out undefined skills
};

// ==================== STATISTICS ====================

export const getStats = (progress, ctx) => {
  const c = resolveCtx(ctx);
  let mastered = 0, total = c.skillList.length, correct = 0, attempts = 0;
  for (const s of c.skillList) {
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

export const getStrandStats = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const strands = {};
  for (const s of c.skillList) {
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

export const getGradeStats = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const grades = {};
  for (const s of c.skillList) {
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

export const getEstimatedGradeLevel = (progress, ctx) => {
  const gradeStats = getGradeStats(progress, ctx);
  const c = resolveCtx(ctx);
  const minGrade = c.skillList.reduce((m, s) => Math.min(m, s.grade), Infinity);
  let level = minGrade;
  for (const gs of gradeStats) {
    if (gs.percent >= 60) level = gs.grade + 1;
    else break;
  }
  const maxGrade = c.skillList.reduce((m, s) => Math.max(m, s.grade), 0);
  return Math.min(level, maxGrade);
};

// ==================== XP SYSTEM ====================

export const calculateXP = (accuracy, estimatedMinutes, isPerfect) => {
  const baseXP = estimatedMinutes || 15;
  if (accuracy >= 1.0) return Math.round(baseXP * 1.5);
  if (accuracy >= 0.9) return Math.round(baseXP * 1.25);
  if (accuracy >= 0.7) return Math.round(baseXP);
  return Math.round(baseXP * 0.5);
};

export const getTotalXP = (progress) => {
  return progress.totalXP || 0;
};

export const getLevel = (totalXP) => {
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

export const selectReviewProblems = (progress, count = 12, ctx) => {
  const c = resolveCtx(ctx);
  const reviews = getReviews(progress, ctx);
  const masteredSkills = c.skillList.filter(s => progress.skills[s.id]?.mastered);

  const selected = [];
  const problemsPerSkill = 3;

  for (const r of reviews) {
    if (selected.length >= count) break;
    for (let i = 0; i < problemsPerSkill && selected.length < count; i++) {
      selected.push(r.id);
    }
  }

  const shuffled = [...masteredSkills].sort(() => Math.random() - 0.5);
  for (const s of shuffled) {
    if (selected.length >= count) break;
    if (!selected.includes(s.id)) {
      for (let i = 0; i < problemsPerSkill && selected.length < count; i++) {
        selected.push(s.id);
      }
    }
  }

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
