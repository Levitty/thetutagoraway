// ============================================================================
// ADAPTIVE ENGINE — Knowledge frontier, gap detection, learning path
// Based on "The Math Academy Way" methodology
// Subject-agnostic: accepts a ctx parameter { skills, getPostReqs, strands }
// ============================================================================

import { SKILLS as MATH_SKILLS, getPostRequisites as mathGetPostReqs, getPrerequisiteChain as mathPreChain, getPostRequisiteChain as mathPostChain, STRANDS as MATH_STRANDS } from './knowledgeGraph.js';
import { NATIVE, gradeOf, strandOf, isEnrichment } from './curricula.js';
import { isFluent } from './spacedRepetition.js';

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
    // Active syllabus view. Grade/strand reads route through curricula.js with a
    // fallback to native, so this is a no-op until skills carry curriculum tags.
    curriculum: ctx.curriculum || NATIVE,
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
    // Struggling = poor live accuracy OR an outright diagnostic failure — the
    // diagnostic seeds attempts:1, which the >=3 threshold silently ignored,
    // so freshly-diagnosed gaps never surfaced to the student or the teacher.
    const diagnosticFail = sp?.fromDiagnostic && sp?.passed === false;
    if (sp && ((sp.attempts >= 3 && (sp.correct / sp.attempts) < 0.6) || diagnosticFail)) {
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

// ==================== FLUENCY PRACTICE (AUTOMATICITY) ====================
// Skills the student has mastered but can't yet do FAST — practising these to
// automaticity frees working memory for harder skills.
export const getFluencyPractice = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const out = [];
  for (const skill of c.skillList) {
    const sp = progress.skills[skill.id];
    if (!sp?.mastered || isFluent(sp)) continue;
    out.push({
      ...skill,
      type: 'fluency',
      reason: 'Build speed — you know it, now make it automatic',
      fluentReps: sp.fluentReps || 0,
    });
  }
  // Least-fluent first.
  return out.sort((a, b) => (a.fluentReps || 0) - (b.fluentReps || 0));
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
      const gradeProximity = Math.max(0, 8 - Math.abs(gradeOf(s, c.curriculum) - getEstimatedGradeLevel(progress, ctx)));

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

  // One automaticity rep — a mastered-but-slow skill to speed up.
  const fluency = getFluencyPractice(progress, ctx);
  if (fluency.length && !seen.has(fluency[0].id)) { path.push(fluency[0]); seen.add(fluency[0].id); }

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

const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Breadth-first fallback (no declared grade): sample across all difficulty
// bands and let credit propagation infer the rest. (Original behaviour.)
const getBreadthDiagnosticSkills = (c) => {
  const easy = c.skillList.filter(s => s.weight <= 2);
  const medium = c.skillList.filter(s => s.weight > 2 && s.weight <= 4);
  const hard = c.skillList.filter(s => s.weight > 4 && s.weight <= 6);
  const veryHard = c.skillList.filter(s => s.weight > 6);

  const selected = [];
  const criticals = shuffleArr(c.skillList.filter(s => s.critical));
  for (const s of criticals.slice(0, 10)) selected.push(s);

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

// Grade-anchored diagnostic: anchor at the student's declared class, then probe
// the prerequisite grades below (to surface the foundation gaps that block them)
// and a little above (to find the ceiling / acceleration). Shorter and far more
// relevant than a blind sweep; credit propagation fills in everything untested.
export const getDiagnosticSkills = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const target = progress?.declaredGrade;
  if (target == null) return getBreadthDiagnosticSkills(c);

  // Anchor on the skill's native grade/level (always present, works for every
  // subject); the chosen curriculum still scopes mastery views elsewhere.
  const gradeFor = (s) => s.grade;
  const band = c.skillList.filter(s => {
    const g = gradeFor(s);
    return Number.isFinite(g) && g >= target - 3 && g <= target + 1;
  });
  if (band.length < 8) return getBreadthDiagnosticSkills(c);

  // How many to test at each grade — emphasise the student's class and the
  // immediate prerequisites; lighter on deep prereqs and the ceiling probe.
  // Tuned for a firmer ~20-question read (was ~14) so placement is more reliable.
  const wantFor = (g) => {
    const d = g - target;
    if (d === 0) return 7;    // at grade
    if (d === -1) return 5;   // one below
    if (d === -2) return 4;
    if (d === -3) return 2;   // deep prerequisite
    if (d === 1) return 3;    // ceiling probe
    return 0;
  };

  const selected = [];
  const has = (id) => selected.some(s => s.id === id);
  for (let g = target - 3; g <= target + 1; g++) {
    const atGrade = band.filter(s => gradeFor(s) === g);
    // Prefer critical (load-bearing) skills, then fill with others.
    const ordered = [...shuffleArr(atGrade.filter(s => s.critical)), ...shuffleArr(atGrade.filter(s => !s.critical))];
    let added = 0;
    for (const s of ordered) {
      if (added >= wantFor(g)) break;
      if (!has(s.id)) { selected.push(s); added++; }
    }
  }

  // Top up toward a firm minimum. When the band is thin at the low end (e.g. a
  // Grade-6 student, whose grade 3–4 prerequisites don't exist in the graph),
  // the per-grade quotas can't reach ~20, so backfill nearest-to-grade first.
  const MIN_QUESTIONS = 18;
  if (selected.length < MIN_QUESTIONS) {
    const nearest = shuffleArr(band).sort((a, b) => Math.abs(gradeFor(a) - target) - Math.abs(gradeFor(b) - target));
    for (const s of nearest) {
      if (selected.length >= MIN_QUESTIONS) break;
      if (!has(s.id)) selected.push(s);
    }
  }

  // Order foundation → grade → ceiling so accessible questions come first and
  // gaps surface bottom-up.
  return selected.sort((a, b) => gradeFor(a) - gradeFor(b));
};

// ==================== PLACEMENT (STABLE LEVEL) ====================

// The grade a finished diagnostic places the student at: the highest grade band
// they cleared (≥50% correct), walking up from the foundation. Persisted so the
// displayed "level" stays stable instead of falling back to the conservative
// mastery-count estimate whenever the ability engine is unreachable.
export const computePlacementGrade = (skills, results, declaredGrade = null) => {
  const byGrade = {};
  for (const s of skills || []) {
    const r = results?.[s.id];
    if (!r) continue;
    const g = s.grade;
    if (!byGrade[g]) byGrade[g] = { correct: 0, total: 0 };
    byGrade[g].total++;
    if (r.correct) byGrade[g].correct++;
  }
  const grades = Object.keys(byGrade).map(Number).sort((a, b) => a - b);
  if (!grades.length) return declaredGrade;
  let placement = grades[0];
  for (const g of grades) {
    if (byGrade[g].correct / byGrade[g].total >= 0.5) placement = g; // cleared this grade
    else break; // first grade they don't clear caps the placement
  }
  return placement;
};

// The placement acts as a STABLE floor for the displayed level — but a floor
// that's clearly too high shouldn't stick. This derives an "effective"
// placement that walks DOWN from the stored placementGrade while the student
// shows sustained struggle at that grade (enough attempts + low accuracy).
// It's computed live from skill stats, so it recovers naturally as accuracy
// improves; the stored placementGrade stays as the diagnostic anchor.
export const getEffectivePlacement = (progress, ctx) => {
  const c = resolveCtx(ctx);
  let placement = progress?.placementGrade;
  if (placement == null) return null;

  const gradeAccuracy = (g) => {
    let correct = 0, attempts = 0;
    for (const s of c.skillList) {
      if (s.grade !== g) continue;
      const sp = progress.skills[s.id];
      if (sp) { correct += sp.correct || 0; attempts += sp.attempts || 0; }
    }
    return { correct, attempts };
  };

  const minGrade = c.skillList.reduce((m, s) => Math.min(m, s.grade), Infinity);
  // Demote one grade at a time: needs real evidence (≥8 attempts at that grade)
  // AND poor accuracy (<45%). Stops as soon as a grade isn't clearly failing.
  while (placement > minGrade) {
    const { correct, attempts } = gradeAccuracy(placement);
    if (attempts >= 8 && correct / attempts < 0.45) placement -= 1;
    else break;
  }
  return placement;
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

// excludeEnrichment: when true, skills out of the active curriculum's scope
// (enrichment) are dropped from the denominator so in-scope progress isn't
// diluted. Defaults false to preserve every existing caller's behaviour.
export const getStats = (progress, ctx, { excludeEnrichment = false } = {}) => {
  const c = resolveCtx(ctx);
  let mastered = 0, total = 0, correct = 0, attempts = 0, enrichment = 0;
  for (const s of c.skillList) {
    if (excludeEnrichment && isEnrichment(s, c.curriculum)) { enrichment++; continue; }
    total++;
    if (progress.skills[s.id]?.mastered) mastered++;
    correct += progress.skills[s.id]?.correct || 0;
    attempts += progress.skills[s.id]?.attempts || 0;
  }
  return {
    mastered,
    total,
    enrichment,
    percent: total > 0 ? Math.round((mastered / total) * 100) : 0,
    accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    totalAttempts: attempts,
    totalCorrect: correct,
  };
};

export const getStrandStats = (progress, ctx, { excludeEnrichment = false } = {}) => {
  const c = resolveCtx(ctx);
  const strands = {};
  for (const s of c.skillList) {
    if (excludeEnrichment && isEnrichment(s, c.curriculum)) continue;
    const strand = strandOf(s, c.curriculum);
    if (!strands[strand]) strands[strand] = { total: 0, mastered: 0, correct: 0, attempts: 0, skills: [] };
    strands[strand].total++;
    strands[strand].skills.push(s);
    const sp = progress.skills[s.id];
    if (sp?.mastered) strands[strand].mastered++;
    strands[strand].correct += sp?.correct || 0;
    strands[strand].attempts += sp?.attempts || 0;
  }
  return Object.entries(strands).map(([name, d]) => ({
    name,
    ...d,
    percent: d.total > 0 ? Math.round((d.mastered / d.total) * 100) : 0,
    accuracy: d.attempts > 0 ? Math.round((d.correct / d.attempts) * 100) : null,
    assessed: d.attempts > 0,
  }));
};

export const getGradeStats = (progress, ctx, { excludeEnrichment = false } = {}) => {
  const c = resolveCtx(ctx);
  const grades = {};
  for (const s of c.skillList) {
    const enr = isEnrichment(s, c.curriculum);
    if (excludeEnrichment && enr) continue;
    const grade = gradeOf(s, c.curriculum);
    if (!grades[grade]) grades[grade] = { total: 0, mastered: 0, enrichment: 0 };
    grades[grade].total++;
    if (enr) grades[grade].enrichment++;
    if (progress.skills[s.id]?.mastered) grades[grade].mastered++;
  }
  return Object.entries(grades).map(([grade, d]) => ({
    grade: parseInt(grade),
    ...d,
    percent: d.total > 0 ? Math.round((d.mastered / d.total) * 100) : 0,
  })).sort((a, b) => a.grade - b.grade);
};

export const getEstimatedGradeLevel = (progress, ctx) => {
  const gradeStats = getGradeStats(progress, ctx);
  const c = resolveCtx(ctx);
  const minGrade = c.skillList.reduce((m, s) => Math.min(m, gradeOf(s, c.curriculum)), Infinity);
  let level = minGrade;
  for (const gs of gradeStats) {
    if (gs.percent >= 60) level = gs.grade + 1;
    else break;
  }
  const maxGrade = c.skillList.reduce((m, s) => Math.max(m, gradeOf(s, c.curriculum)), 0);
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

// Proper unbiased shuffle (Array.sort(()=>Math.random()-0.5) is NOT uniform).
const fisherYates = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// Interleave a multiset of skill ids so the SAME skill is never adjacent when it
// can be avoided (spaced/interleaved practice beats blocked — the whole point of
// review). Greedy: always place the skill with the most remaining that isn't the
// one we just placed.
const interleaveSkills = (ids) => {
  const counts = {};
  ids.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  const out = []; let last = null;
  while (out.length < ids.length) {
    const cands = Object.keys(counts).filter(k => counts[k] > 0).sort((a, b) => counts[b] - counts[a]);
    const pick = cands.find(k => k !== last) ?? cands[0];
    if (pick == null) break;
    out.push(pick); counts[pick]--; last = pick;
  }
  return out;
};

// Build a spaced, interleaved review set. Spreads across as MANY distinct skills
// as possible (retention comes from breadth + spacing, not drilling one skill),
// double-weights the most-forgotten, and never blocks the same skill back-to-back.
export const selectReviewProblems = (progress, count = 12, ctx) => {
  const c = resolveCtx(ctx);
  const reviews = getReviews(progress, ctx);   // already sorted by urgency (most overdue first)

  const bag = [];
  // 1) Due reviews: the most-forgotten (urgency > 0.5, i.e. memory < ~50%) get
  //    two problems; mildly-due skills get one. Widens coverage vs the old 3-each.
  for (const r of reviews) {
    const reps = r.urgency > 0.5 ? 2 : 1;
    for (let i = 0; i < reps; i++) bag.push(r.id);
  }
  // 2) Not enough due? Top up with mastered skills that haven't been reviewed,
  //    least-recently-practised first, one each — keeps everything warm.
  if (bag.length < count) {
    const inBag = new Set(bag);
    const filler = c.skillList
      .filter(s => progress.skills[s.id]?.mastered && !inBag.has(s.id))
      .sort((a, b) => new Date(progress.skills[a.id].lastPractice || 0) - new Date(progress.skills[b.id].lastPractice || 0));
    for (const s of filler) { if (bag.length >= count) break; bag.push(s.id); }
  }

  // Trim to count, keeping urgency order, then interleave so no skill repeats
  // adjacently. (Distinct-skill breadth is preserved because urgent skills lead.)
  return interleaveSkills(bag.slice(0, count));
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
  computePlacementGrade,
  getEffectivePlacement,
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
