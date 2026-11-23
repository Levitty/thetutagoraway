// ============================================================================
// ADAPTIVE ENGINE — Knowledge frontier, gap detection, learning path
// Based on "The Math Academy Way" methodology
// Subject-agnostic: accepts a ctx parameter { skills, getPostReqs, strands }
// ============================================================================

import { findMissingStep } from '../site/missingStep.js';
import { SKILLS as MATH_SKILLS, getPostRequisites as mathGetPostReqs, getPrerequisiteChain as mathPreChain, getPostRequisiteChain as mathPostChain, STRANDS as MATH_STRANDS } from './knowledgeGraph.js';
import { NATIVE, gradeOf, strandOf, isEnrichment, outsideCurriculum } from './curricula.js';
import { isFluent, calculateMemoryStrength } from './spacedRepetition.js';

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

// A prerequisite is HELD when it was learned and has not been forgotten.
//
// Until Oct 2026 this read the `mastered` boolean alone, which only ever comes
// off through failure: a skill mastered in March and untouched since still
// unlocked everything built on it in September. The time-decayed memory
// strength that the review scheduler already uses now gates too. HOLD_FLOOR is
// below the scheduler's "due for review" line (0.6) on purpose: a fading skill
// gets reviewed first; only a forgotten one stops holding up the skills above.
// A learned skill with no timestamp (older data, implicit credit) cannot decay,
// so it holds — nothing is ever locked by missing data.
export const HOLD_FLOOR = 0.3;
export const isHeld = (sp) => {
  if (!sp) return false;
  const learned = sp.mastered || (sp.passed && sp.attempts >= 3);
  if (!learned) return false;
  if (!sp.lastPractice) return true;
  return calculateMemoryStrength(sp) >= HOLD_FLOOR;
};

// Assumed foundation: a teacher does not quiz a Grade 8 student on counting.
// A prerequisite more than ASSUMED_FOUNDATION_GAP grades below the learner's
// own level counts as met UNLESS she has actually shown struggle on it (tried
// and not mastered). Without this, a fresh senior account's only "learnable"
// skills are the Grade 1 graph roots, and the path marches her up from
// pre-number activities one quick check at a time — which is what a Grade 9
// learner reported: the work was far below her and she could not get past it.
//
// This is deliberately weaker than isHeld: it never claims the skill is
// REMEMBERED, only that it is not worth making her prove. Real struggle
// cancels it, and findGaps still surfaces the skill if she stumbles later.
const ASSUMED_FOUNDATION_GAP = 3;
const learnerLevel = (progress) =>
  progress?.placementGrade ?? progress?.declaredGrade ?? null;
const assumedKnown = (skill, progress) => {
  const lvl = learnerLevel(progress);
  if (lvl == null || !Number.isFinite(skill?.grade)) return false;
  if (skill.grade > lvl - ASSUMED_FOUNDATION_GAP) return false;
  const sp = progress?.skills?.[skill.id];
  return !(sp?.attempts > 0 && !sp.mastered);   // struggle cancels the assumption
};

// The same idea, for the paths that make a learner PRACTISE something they
// already have — review, the review problems themselves, fluency drills.
//
// Why these need a different anchor from assumedKnown. learnerLevel() is
// placementGrade, where the check found them, and for LEARNING that is right:
// a Grade 10 placed at Grade 7 has real gaps at Grade 7 and should be taught
// them. But being placed low must not also mean being DRILLED low. Anchored on
// placement alone, a Grade 10 placed at 8 can be sent a timed rep on Grade 6
// place value — work they last met in primary school — because the write-off
// window slid down with them. For practice the floor is the grade they are IN.
//
// Taking the max of the two keeps the easier case intact: a learner placed
// ABOVE their class keeps the higher anchor.
// The highest grade the learner has actually mastered anything at. Unlike a
// placement, this rises as they work, so anything ceilinged on it advances
// with them instead of freezing at the grade a check found months ago.
const topMasteredGrade = (progress, c) => {
  let top = 0;
  for (const s of c.skillList) {
    // In the learner's own curriculum's grades: CBC puts 35 skills in another
    // grade than the graph does, and every ceiling this feeds is compared in
    // curriculum grades (feedback F10).
    const g = gradeOf(s, c.curriculum);
    if (progress?.skills?.[s.id]?.mastered && Number.isFinite(g)) top = Math.max(top, g);
  }
  return top;
};

// ==================== THE LEARNER'S GRADE ====================
//
// The one answer to "which grade is this learner in?", for every place the
// home page says or acts on it: the profile card, the strand tiles, the plan
// and the reviews. Until Nov 2026 the page used three answers at once — the
// card fell back to the estimate, the tiles skipped their filter when no grade
// was declared (so a Grade 1 was counted against the whole Grade 1-12 graph,
// Algebra and all), and the reviews took the highest grade ever mastered — so
// one account read "Grade 1" on the card beside a Grade 7 review.
//
// The declared grade — the class the learner or parent said they are in — and
// otherwise the estimate, which already takes the placement as its floor and
// walks it on evidence after the check (getEstimatedGradeLevel). The declared
// grade is a floor, not a cap: a Grade 1 placed at Grade 2 who has finished
// Grade 2 is working in Grade 3, and capping them at their class would leave
// them nothing to learn (tests/grade-fit.test.mjs). A learner behind their
// class still reads as the class they are in. Null only for an empty graph.
// In the active curriculum's grades.
export const learnerGrade = (progress, ctx) => {
  const est = getEstimatedGradeLevel(progress || { skills: {} }, ctx);
  const declared = progress?.declaredGrade;
  if (Number.isFinite(declared)) return Number.isFinite(est) ? Math.max(declared, est) : declared;
  return Number.isFinite(est) ? est : null;
};

// A skill above the learner's grade, in the active curriculum's grades.
const aboveGrade = (skill, grade, c) => {
  const g = gradeOf(skill, c.curriculum);
  return Number.isFinite(g) && g > grade;
};

const longSecure = (skill, progress) => {
  const lvl = Math.max(progress?.placementGrade ?? 0, progress?.declaredGrade ?? 0);
  if (!lvl || !Number.isFinite(skill?.grade)) return false;
  if (skill.grade > lvl - ASSUMED_FOUNDATION_GAP) return false;
  const sp = progress?.skills?.[skill.id];
  return !(sp?.attempts > 0 && !sp.mastered);   // struggle cancels it, as above
};

// Fluency drills: never more than one grade below the practice anchor
// (placement or class grade, whichever is higher), in curriculum grades.
const FLUENCY_FLOOR_GAP = 1;
const belowDrillFloor = (skill, progress, c) => {
  const lvl = Math.max(progress?.placementGrade ?? 0, progress?.declaredGrade ?? 0);
  if (!lvl) return false;
  const g = gradeOf(skill, c.curriculum);
  return Number.isFinite(g) && g < lvl - FLUENCY_FLOOR_GAP;
};

export const prereqsMet = (skillId, progress, ctx) => {
  const c = resolveCtx(ctx);
  const skill = c.skills[skillId];
  if (!skill || skill.prerequisites.length === 0) return true;
  return skill.prerequisites.every(pid => isHeld(progress.skills[pid]) || assumedKnown(c.skills[pid], progress));
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

/**
 * Struggling with a skill: poor live accuracy, or an outright diagnostic
 * failure. The diagnostic seeds attempts:1, which an attempts>=3 threshold
 * silently ignores, so without the second clause a freshly-diagnosed gap never
 * surfaces to the student or the teacher.
 *
 * Exported because the class view counts the same thing across a roster, and
 * two definitions of "struggling" that drift apart would have a teacher and a
 * learner looking at different truths.
 */
export const isStruggling = (sp) => !!sp && !!(
  (sp.attempts >= 3 && (sp.correct / sp.attempts) < 0.6)
  || (sp.fromDiagnostic && sp.passed === false)
);

export const findGaps = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const gaps = [];
  const seen = new Set();

  const lvl = learnerLevel(progress);
  for (const skill of c.skillList) {
    const sp = progress.skills[skill.id];
    // A stretch question missed in the check, above where the child placed, is
    // new learning, not a sign that its foundations are missing (feedback F9).
    if (lvl && sp?.fromDiagnostic && !(sp.attempts > 1) && gradeOf(skill, c.curriculum) > lvl) continue;
    if (isStruggling(sp)) {
      const preReqs = skill.keyPrerequisites || skill.prerequisites;
      for (const pid of preReqs) {
        const pp = progress.skills[pid];
        if (!pp?.mastered && !seen.has(pid)) {
          seen.add(pid);
          const preSkill = c.skills[pid];
          if (!preSkill) continue;
          // A foundation above where the child placed has not been taught
          // yet, so it is next to learn, never a gap (feedback F9).
          if (lvl && gradeOf(preSkill, c.curriculum) > lvl) continue;

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

// ==================== THE CLASS, NOT THE CHILD ====================
//
// A teacher opening a roster of thirty-four one at a time learns thirty-four
// separate things and cannot act on any of them before the bell. The same
// data read down the other axis answers the question they actually have:
// WHAT DO I TEACH TOMORROW, AND TO WHOM.
//
// Everything here is already measured per learner. Nothing new is collected.

/**
 * One class's gaps, by skill rather than by child.
 *
 * `learners` is [{ id, name, progress }]. Two different things put a skill on
 * the list, and they are kept apart because they ask for different lessons:
 *
 *   blocked  — a learner is failing something that needs this skill, and has
 *              not mastered this skill. A foundation to go back to.
 *   failing  — the learner is struggling with this skill itself, right now.
 *              Usually the thing that was just taught.
 *
 * A learner can appear under both, for different skills. They are counted once
 * per skill, under the more urgent of the two, because "nine children" has to
 * mean nine children.
 */
export const classGaps = (learners, ctx) => {
  const c = resolveCtx(ctx);
  const bySkill = new Map();

  const note = (skillId, learner, kind, extra = {}) => {
    const skill = c.skills[skillId];
    if (!skill) return;
    let row = bySkill.get(skillId);
    if (!row) {
      row = { id: skillId, name: skill.name, strand: skill.strand, grade: skill.grade,
              critical: !!skill.critical, blockedSkills: 0, blocked: [], failing: [] };
      bySkill.set(skillId, row);
    }
    Object.assign(row, extra);
    // One learner, one entry per skill. "blocked" wins: a foundation they
    // never had explains the failure above it, and is the lesson to teach.
    const other = kind === 'blocked' ? row.failing : row.blocked;
    const i = other.findIndex(l => l.id === learner.id);
    if (i >= 0) { if (kind === 'blocked') other.splice(i, 1); else return; }
    const here = row[kind];
    if (!here.some(l => l.id === learner.id)) here.push({ id: learner.id, name: learner.name });
  };

  for (const l of learners || []) {
    const progress = l?.progress;
    if (!progress?.skills) continue;
    for (const g of findGaps(progress, c)) {
      note(g.id, l, 'blocked', { blockedSkills: g.blockedSkills, reason: g.reason });
    }
    for (const skill of c.skillList) {
      if (isStruggling(progress.skills[skill.id])) note(skill.id, l, 'failing');
    }
  }

  const rows = [...bySkill.values()]
    .map(r => ({ ...r, count: r.blocked.length + r.failing.length }))
    .filter(r => r.count > 0);

  // Most children first. Then the foundation over the symptom, since teaching
  // the foundation is what clears the symptom; then how much it unblocks.
  return rows.sort((a, b) =>
    b.count - a.count
    || b.blocked.length - a.blocked.length
    || (b.critical ? 1 : 0) - (a.critical ? 1 : 0)
    || (b.blockedSkills || 0) - (a.blockedSkills || 0)
    || (a.grade ?? 99) - (b.grade ?? 99));
};

// ==================== REVIEW DETECTION ====================

export const getReviews = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const now = Date.now();
  const reviews = [];

  // The grade the learner is IN — the same number the profile card, the strand
  // tiles and the plan use (learnerGrade). It does two jobs here: it is the
  // ceiling, and it is the frontier the below-grade stretch is measured from.
  //
  // It used to be max(placement ?? declared, highest grade ever mastered).
  // On an account with no declared grade that made a skill mastered long ago
  // in a higher grade the frontier: the owner's own account, read as Grade 1
  // on the card with Grade 1 tiles, opened its evening on "Keep it fresh:
  // Prime Factorization". A skill above the learner's grade is not a review
  // for them — it is work they have not reached, whenever it was once done.
  const grade = learnerGrade(progress, c);

  for (const skill of c.skillList) {
    const sp = progress.skills[skill.id];
    if (!sp?.mastered || !sp.lastPractice) continue;
    if (grade != null && aboveGrade(skill, grade, c)) continue;

    const daysSince = (now - new Date(sp.lastPractice).getTime()) / 86400000;
    const repNum = sp.repNum || 0;
    const baseIntervals = [1, 3, 7, 14, 30, 60, 120, 240];
    const learningSpeed = sp.learningSpeed || 1.0;
    // floor: repNum is fractional (partial credit / 1.5-step decay) and a raw
    // fractional index returns undefined -> NaN -> the skill never comes due.
    const rungIdx = Math.min(Math.max(0, Math.floor(repNum)), baseIntervals.length - 1);
    let interval = baseIntervals[rungIdx] / learningSpeed;

    // A skill the PLACEMENT CHECK credited, never practised since, sitting
    // well below the learner's working level, was consolidated long before
    // this app existed. processDiagnosticResults enters it at rung 2 — the
    // same rung a skill reaches by being ground out to mastery here — so a
    // Grade 5 who sailed through counting to 50 is asked to review it three
    // days later. Stretch the interval by how far below the frontier it sits,
    // so the session is spent on what is actually at risk of fading.
    // getNextToLearn already refuses to offer an assumed-known foundation AS A
    // LESSON ("a Grade 8 student is not sent to Pre-number Activities"). A
    // review is the same claim on the learner's time, so it gets the same
    // answer: don't send a Grade 5 back to counting at all. assumedKnown
    // cancels itself on real struggle, and practisedHere covers the learner
    // who has since worked at it here, so neither is silently written off.
    if (!sp.practisedHere && longSecure(skill, progress)) continue;

    // Between that floor and the frontier, delay rather than exclude: a skill
    // two grades down is plausibly still worth a look, just not on the same
    // three-day rung as genuinely new work.
    const g = gradeOf(skill, c.curriculum);
    const below = (grade != null && Number.isFinite(g)) ? grade - g : 0;
    if (sp.fromDiagnostic && !sp.practisedHere && below >= 2) interval *= 1 + below;

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

  // Urgency first — but every skill credited by one sitting of the check
  // shares a single lastPractice, so their urgencies are EXACTLY equal and
  // the sort collapses to array order, which is ascending grade. That put
  // Grade 1 sorting at the top of a Grade 5's session every evening. Break
  // the tie on the grade instead: among equally-faded skills, the one nearest
  // the learner's level is the one whose fading actually costs them.
  return reviews.sort((a, b) => (b.urgency - a.urgency) || ((b.grade || 0) - (a.grade || 0)));
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
    // The same floor the lesson path and the review queue use. Without it
    // this was the single worst offender in the whole engine: a skill the
    // check credited has no speed history, so it never looks fluent, and
    // getRecommendedPath takes ONE fluency rep for every learner — which
    // meant a Grade 10's path opened with a timed drill on Pre-number
    // Activities. Building automaticity on work a learner finished years
    // ago buys nothing; the point of fluency practice is to free working
    // memory for what they are learning NOW.
    //
    // F4 (21 Oct): that three-grade write-off window was still too wide for
    // a DRILL. A strong Grade 4 placed at Grade 5 got a timed rep on
    // G3_COUNTING in every sitting, a third of their practice two grades
    // below where they placed, and the same at every grade 4-9. A fluency rep
    // comes from the grade they are at or the one just below, in the child's
    // own curriculum (a CBC child's grades, not the graph's). Work practised
    // here (a foundation rebuilt after a real miss) stays drillable.
    if (!sp.practisedHere && belowDrillFloor(skill, progress, c)) continue;
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

// ==================== MASTERY ====================

// A skill is mastered on RECENT evidence: at least `minProblems` answers, the
// last 3 right, and 7 of the last 8 right. (Cumulative accuracy made early
// learning mistakes count forever; see docs/qa/answer-audit-log.md, round 9.)
export const recentMastery = (recent = [], minProblems = 6) => {
  const r = recent.slice(-10);
  return r.length >= minProblems && r.slice(-3).length === 3 && r.slice(-3).every(Boolean)
    && r.slice(-8).filter(Boolean).length >= Math.min(7, r.length - 1);
};

// ==================== NEXT SKILLS TO LEARN ====================

export const getNextToLearn = (progress, ctx) => {
  const c = resolveCtx(ctx);
  const grade = learnerGrade(progress, c);
  return c.skillList
    .filter(s => {
      const sp = progress.skills[s.id];
      if (sp?.mastered || !prereqsMet(s.id, progress, ctx)) return false;
      // An assumed-known foundation is never offered AS A LESSON — a Grade 8
      // student is not sent to "Pre-number Activities". It stays openable from
      // the library, and findGaps still raises it on real struggle.
      if (assumedKnown(s, progress)) return false;
      // The mirror guard: a prerequisite-free skill far ABOVE the learner must
      // not outrank their own work. Twelve skills in the graph have NO
      // prerequisites at all — four of them at Grade 5 — so for those this
      // line is the only thing standing between a Grade 2 and "What type of
      // angle measures 162°?". Two grades of stretch measured from PLACEMENT
      // was not enough: a Grade 2 placed at 3 reached Grade 5 that way.
      //
      // One grade of stretch, measured from what the learner has actually
      // SHOWN — their placement or the highest grade they have mastered,
      // whichever is further. Taking the highest mastered grade is what keeps
      // this from capping anyone: it rises as they master work, so the
      // ceiling rises with them and an advanced learner is never stalled by a
      // placement taken months ago.
      //
      // And never more than that one grade above the grade the learner is IN
      // (learnerGrade), which is what the card and the tiles say. Without
      // this, an account with old high-grade mastery and no declared grade
      // read "Grade 1" on the card while the plan offered Grade 8 work.
      const sg = gradeOf(s, c.curriculum);
      if (Number.isFinite(sg)) {
        const shown = Math.max(learnerLevel(progress) ?? 0, topMasteredGrade(progress, c));
        const ceiling = grade != null ? Math.min(shown || grade, grade) : shown;
        if (ceiling && sg > ceiling + 1) return false;
      }
      return true;
    })
    .map(s => {
      let dependents = 0;
      try { dependents = c.getPostReqs(s.id).length; } catch(e) {}
      const sp = progress.skills[s.id];
      const inProgress = sp?.attempts > 0 ? 8 : 0;
      const criticalBonus = s.critical ? 12 : 0;
      const gradeProximity = Math.max(0, 8 - 2 * Math.abs(gradeOf(s, c.curriculum) - getEstimatedGradeLevel(progress, ctx))) * 2;

      // Work outside the learner's curriculum comes after the curriculum's own
      // (feedback F10). The penalty is larger than every other term added
      // together can make up (12 + 10 + 8 + 16).
      const outside = outsideCurriculum(s, c.curriculum) ? -50 : 0;
      return {
        ...s,
        priority: criticalBonus + Math.min(dependents, 5) * 2 + inProgress + gradeProximity + outside,
        type: 'learn',
      };
    })
    .sort((a, b) => b.priority - a.priority);
};

// ==================== RECOMMENDED LEARNING PATH ====================

// The plan a parent reads after the check names ONE missing step. Practice must
// start there: simulated with virtual children (scripts/simulate-check.mjs),
// the path started on that step only 20% of the time and on a skill the child
// already knew 50% of the time. Applied to whichever engine built the path.
export const leadWithMissingStep = (path, progress, ctx) => {
  if (!progress?.diagnosed || !Array.isArray(path)) return path;
  const c = resolveCtx(ctx);
  let r;
  try { r = findMissingStep(progress, c.skills, c.curriculum); } catch { return path; }
  const id = r?.missing;
  const skill = id && c.skills[id];
  if (!skill || progress.skills?.[id]?.mastered) return path;
  if (path[0]?.id === id) return path;
  const lead = { ...(path.find(p => p.id === id) || skill), type: r.allClear ? 'learn' : 'gap', reason: r.allClear ? 'Next to learn after the check' : 'The missing step from the check' };
  return [lead, ...path.filter(p => p.id !== id)];
};

export const getRecommendedPath = (progress, ctx) => {
  const path = [];
  const seen = new Set();
  const lead = leadWithMissingStep([], progress, ctx)[0];
  if (lead) { path.push(lead); seen.add(lead.id); }

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

// The placement grade is computed in placement.js, from the record of the
// check. It used to live here and walked up from the lowest grade actually
// TESTED, so it could never return anything below the grade the learner
// declared — a Grade 6 entry came back as Grade 11.

// The placement is the diagnostic anchor; this derives the level to SHOW and
// to teach at, recomputed live from practice so it keeps tracking the learner
// after the check. It walks DOWN on sustained struggle and UP once a grade is
// genuinely outgrown. Until Oct 2026 it only ever walked down, so a learner
// who improved stayed pinned at their diagnostic grade until they retook it.
// The stored placementGrade never moves.
// (Former note: the placement acts as a STABLE floor for the displayed level — but a floor
// that's clearly too high shouldn't stick. This derives an "effective"
// placement that walks DOWN from the stored placementGrade while the student
// shows sustained struggle at that grade (enough attempts + low accuracy).
// It's computed live from skill stats, so it recovers naturally as accuracy
// improves; the stored placementGrade stays as the diagnostic anchor.)
export const getEffectivePlacement = (progress, ctx) => {
  const c = resolveCtx(ctx);
  let placement = progress?.placementGrade;
  if (placement == null) return null;

  // Evidence at one grade: how the learner has actually performed on its
  // skills, and how much of the grade they now hold outright.
  const evidenceAt = (g) => {
    let correct = 0, attempts = 0, mastered = 0, total = 0;
    for (const s of c.skillList) {
      if (s.grade !== g) continue;
      total++;
      const sp = progress.skills[s.id];
      if (!sp) continue;
      correct += sp.correct || 0;
      attempts += sp.attempts || 0;
      if (sp.mastered) mastered++;
    }
    return { correct, attempts, mastered, total,
             accuracy: attempts ? correct / attempts : 0,
             held: total ? mastered / total : 0 };
  };

  const grades = c.skillList.map(s => s.grade).filter(Number.isFinite);
  const minGrade = Math.min(...grades), maxGrade = Math.max(...grades);

  // DOWN: the check put them too high. One grade at a time, on real evidence
  // (>= 8 attempts) and clearly poor accuracy. Stops as soon as a grade isn't
  // obviously failing.
  while (placement > minGrade) {
    const { attempts, accuracy } = evidenceAt(placement);
    if (attempts >= 8 && accuracy < 0.45) placement -= 1;
    else break;
  }
  if (placement < (progress.placementGrade ?? placement)) return placement;

  // UP: they have outgrown the check. Deliberately harder to earn than the
  // demotion above — over-placing a learner is the damaging direction, and the
  // whole point of the check is to stop that happening. A grade is outgrown
  // only when they have both practised it properly and actually hold most of
  // it: >= 12 attempts, >= 80% accuracy, and >= 60% of its skills mastered.
  while (placement < maxGrade) {
    const { attempts, accuracy, held } = evidenceAt(placement);
    if (attempts >= 12 && accuracy >= 0.8 && held >= 0.6) placement += 1;
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

/**
 * The strand blocks as the dashboard counts them: against what is IN REACH,
 * not against the whole graph. Numbers holds 108 skills from Grade 1 to Grade
 * 12, so the honest-looking "3 of 108" tells a Grade 5 nothing except that
 * they are nowhere — the denominator is work they are years from meeting.
 * Their own grade and below is the set that means "what I should have by now".
 */
//
// `grade` is learnerGrade(), the number the profile card shows, and grades are
// read in `curriculum` (the active view) as the card's are. A strand with
// nothing in reach is left out: Algebra is not a Grade 1 strand, and a tile
// reading "0 of 0" — or "0 of 42" — tells a Grade 1 child they are failing
// at work they will not meet for years.
export const strandsInReach = (strandStats, progress, grade, curriculum = NATIVE) => (strandStats || []).map((s) => {
  const inReach = grade == null
    ? s.skills
    : s.skills.filter(k => !Number.isFinite(gradeOf(k, curriculum)) || gradeOf(k, curriculum) <= grade);
  const done = inReach.filter(k => progress?.skills?.[k.id]?.mastered).length;
  return { s, done, total: inReach.length, pct: inReach.length ? done / inReach.length : null };
}).filter(b => b.total > 0);

/**
 * The one strand to badge "needs work", or null when no such claim is honest.
 * Three guards, each for a case where the badge would be a lie or just
 * discouraging:
 *   assessed only — a strand the check never reached is unknown, not weak,
 *     and must never be labelled as weak
 *   behind the best by 20 points — on the morning after a diagnostic every
 *     strand sits near the same number, and badging whichever one rounded
 *     lowest is noise
 *   under half — a learner holding 80% of everything has no strand that needs
 *     work, however the five of them rank against each other
 */
export const weakestStrand = (blocks) => {
  const ranked = (blocks || []).filter(b => b.s?.assessed && b.pct != null).sort((a, b) => a.pct - b.pct);
  if (ranked.length < 2) return null;
  if (ranked[0].pct >= 0.5) return null;
  if (ranked[ranked.length - 1].pct - ranked[0].pct < 0.2) return null;
  return ranked[0].s.name;
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

  // The walk above measures COVERAGE — how much of each grade this learner has
  // personally worked through — and it climbs only while each grade is 60%
  // mastered. A diagnostic answers a different question: how far along IS this
  // child? Eight questions can never mark 60% of Grade 1 as mastered, so a
  // freshly-placed Grade 9 student scores as Grade 1 here. The dashboard hid
  // that by flooring the DISPLAYED level, but getNextToLearn ranks by grade
  // proximity to this number, so her next lesson was still Grade 1 work.
  //
  // So the measured placement is a FLOOR here too. getEffectivePlacement
  // already walks that floor back down when a learner shows sustained struggle
  // at it, so a wrong placement still self-corrects — it just no longer starts
  // wrong.
  const placement = getEffectivePlacement(progress, ctx);
  const floor = Number.isFinite(placement) ? placement : null;
  return Math.min(maxGrade, floor != null ? Math.max(level, floor) : level);
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
    // This top-up is where "80 + 3 = ?" reached a Grade 5. getReviews applies
    // a grade floor; this filter did not, so it drew from EVERY mastered
    // skill — and because the floor removed the genuine reviews, the bag was
    // short more often and the unfiltered top-up ran harder. Filtering one
    // and not the other made the symptom worse, not better. Same floor here.
    //
    // Same tie, too: everything the check credited carries one timestamp, so
    // least-recently-practised ties across all of it and the sort falls
    // through to skill-list order, which is ascending grade.
    // And the same ceiling: nothing above the grade the learner is in.
    const grade = learnerGrade(progress, c);
    const filler = c.skillList
      .filter(s => progress.skills[s.id]?.mastered && !inBag.has(s.id))
      .filter(s => grade == null || !aboveGrade(s, grade, c))
      .filter(s => progress.skills[s.id].practisedHere || !longSecure(s, progress))
      .sort((a, b) =>
        (new Date(progress.skills[a.id].lastPractice || 0) - new Date(progress.skills[b.id].lastPractice || 0))
        || ((b.grade || 0) - (a.grade || 0)));
    for (const s of filler) { if (bag.length >= count) break; bag.push(s.id); }
  }

  // Trim to count, keeping urgency order, then interleave so no skill repeats
  // adjacently. (Distinct-skill breadth is preserved because urgent skills lead.)
  return interleaveSkills(bag.slice(0, count));
};

export default {
  prereqsMet,
  isHeld,
  HOLD_FLOOR,
  getStatus,
  getKnowledgeFrontier,
  findGaps,
  getReviews,
  getNextToLearn,
  getRecommendedPath,
  getDiagnosticSkills,
  getEffectivePlacement,
  getRemediationSkills,
  getStats,
  getStrandStats,
  getGradeStats,
  getEstimatedGradeLevel,
  learnerGrade,
  calculateXP,
  getTotalXP,
  getLevel,
  selectReviewProblems,
};
