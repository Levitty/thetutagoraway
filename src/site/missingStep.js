// Turns a finished HOREB diagnostic into the one thing a parent needs to hear:
// the lowest skill their child is missing, what it rests on, and what rests on
// it. Pure, so it can be tested without the app.
import { SKILLS } from '../ai-tutor/knowledgeGraph.js';
import { NATIVE, gradeOf, outsideCurriculum } from '../ai-tutor/curricula.js';

const passed = (sp) => !!sp && sp.passed === true;
const failed = (sp) => !!sp && sp.fromDiagnostic === true && sp.passed === false;

// Names like "Adding Fractions (Unlike Denominators)" read better in sentence
// case on the result page: "Adding fractions (unlike denominators)".
export const plainName = (name = '') =>
  name.replace(/(^|[\s(])([A-Z])([a-z]+)/g, (m, pre, first, rest, offset) =>
    offset === 0 ? m : pre + first.toLowerCase() + rest);

export function findMissingStep(progress, skills = SKILLS, curriculum = progress?.curriculum) {
  const sk = progress?.skills || {};
  const declared = Number(progress?.declaredGrade) || null;
  const placement = Number(progress?.placementGrade) || null;

  if (!Object.keys(sk).length) return { missing: null, solid: [], next: [], otherGaps: [], placement, declared, allClear: false };

  // A gap is a skill at or below where the child placed. A stretch question
  // missed ABOVE it is the next thing to learn, not something missing: a child
  // who cleared Grade 9 and missed the one Grade 10 probe was being told their
  // missing step was Grade 10 sequences (feedback F9). Grades are read in the
  // child's own curriculum.
  const curr = curriculum || NATIVE;
  const level = placement || declared;
  const failedAll = Object.keys(sk).filter(id => skills[id] && failed(sk[id]));
  const above = (id) => level != null && gradeOf(skills[id], curr) > level;
  const gaps = failedAll.filter(id => !above(id));
  const stretch = failedAll.filter(above).sort((a, b) => gradeOf(skills[a], curr) - gradeOf(skills[b], curr));
  // A root gap is a missing skill whose own prerequisites aren't missing:
  // that's where the ladder actually breaks.
  const roots = gaps.filter(id => !(skills[id].prerequisites || []).some(p => gaps.includes(p)));
  const pool = roots.length ? roots : gaps;
  const ranked = [...pool].sort((a, b) => {
    const A = skills[a], B = skills[b];
    const gA = gradeOf(A, curr), gB = gradeOf(B, curr);
    if (gA !== gB) return gA - gB;
    if (!!B.critical !== !!A.critical) return B.critical ? 1 : -1;
    return (skills[b].weight || 0) - (skills[a].weight || 0);
  });

  let missing = ranked[0] || null;
  let allClear = false;
  // Nothing failed: the next step is what they reached for and missed, or else
  // the first not-yet-passed skill just above where they placed. The child's
  // own curriculum comes first in both: a strong CBC Grade 8 child who missed
  // one Grade 10 vectors probe was led with vectors for every sitting, past
  // all of CBC Grade 9 (feedback F10).
  if (!missing) {
    allClear = true;
    const from = (placement || declared || 1) + 1;
    const openFrom = (g) => Object.values(skills)
      .filter(s => gradeOf(s, curr) >= g && !passed(sk[s.id]) && (s.prerequisites || []).every(p => passed(sk[p]) || !skills[p]))
      .sort((a, b) => gradeOf(a, curr) - gradeOf(b, curr) || (b.critical ? 1 : 0) - (a.critical ? 1 : 0))
      .map(s => s.id);
    const inside = (id) => !outsideCurriculum(skills[id], curr);
    const open = openFrom(from);
    // Placed at the curriculum's last grade, nothing in it lies above: the
    // grade's own unpassed work comes before anything outside the curriculum.
    missing = stretch.find(inside) || open.find(inside) || openFrom(from - 1).find(inside) || stretch[0] || open[0] || null;
  }
  if (!missing) return { missing: null, solid: [], next: [], otherGaps: [], placement, declared, allClear };

  const m = skills[missing];
  let solid = (m.prerequisites || []).filter(p => skills[p] && passed(sk[p])).slice(0, 3);
  // Its own prerequisites weren't asked: show the strongest nearby skills instead.
  if (!solid.length) {
    solid = Object.keys(sk).filter(id => skills[id] && passed(sk[id]) && skills[id].grade <= m.grade)
      .sort((a, b) => skills[b].grade - skills[a].grade).slice(0, 3);
  }
  const next = Object.values(skills)
    .filter(s => (s.prerequisites || []).includes(missing))
    .sort((a, b) => Math.abs(a.grade - (declared || a.grade)) - Math.abs(b.grade - (declared || b.grade)) || a.grade - b.grade)
    .slice(0, 2).map(s => s.id);
  const otherGaps = ranked.filter(id => id !== missing);

  return { missing, solid, next, otherGaps, placement, declared, allClear };
}

export const skillLabel = (id, skills = SKILLS) => {
  const s = skills[id];
  return s ? { id, name: plainName(s.name), grade: s.grade } : null;
};
