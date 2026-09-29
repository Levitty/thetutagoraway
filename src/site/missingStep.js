// Turns a finished HOREB diagnostic into the one thing a parent needs to hear:
// the lowest skill their child is missing, what it rests on, and what rests on
// it. Pure, so it can be tested without the app.
import { SKILLS } from '../ai-tutor/knowledgeGraph.js';

const passed = (sp) => !!sp && sp.passed === true;
const failed = (sp) => !!sp && sp.fromDiagnostic === true && sp.passed === false;

// Names like "Adding Fractions (Unlike Denominators)" read better in sentence
// case on the result page: "Adding fractions (unlike denominators)".
export const plainName = (name = '') =>
  name.replace(/(^|[\s(])([A-Z])([a-z]+)/g, (m, pre, first, rest, offset) =>
    offset === 0 ? m : pre + first.toLowerCase() + rest);

export function findMissingStep(progress, skills = SKILLS) {
  const sk = progress?.skills || {};
  const declared = Number(progress?.declaredGrade) || null;
  const placement = Number(progress?.placementGrade) || null;

  if (!Object.keys(sk).length) return { missing: null, solid: [], next: [], otherGaps: [], placement, declared, allClear: false };

  const gaps = Object.keys(sk).filter(id => skills[id] && failed(sk[id]));
  // A root gap is a missing skill whose own prerequisites aren't missing:
  // that's where the ladder actually breaks.
  const roots = gaps.filter(id => !(skills[id].prerequisites || []).some(p => gaps.includes(p)));
  const pool = roots.length ? roots : gaps;
  const ranked = [...pool].sort((a, b) => {
    const A = skills[a], B = skills[b];
    if (A.grade !== B.grade) return A.grade - B.grade;
    if (!!B.critical !== !!A.critical) return B.critical ? 1 : -1;
    return (skills[b].weight || 0) - (skills[a].weight || 0);
  });

  let missing = ranked[0] || null;
  let allClear = false;
  // Nothing failed: the next step is the first not-yet-passed skill just above
  // where they placed.
  if (!missing) {
    allClear = true;
    const from = (placement || declared || 1) + 1;
    missing = Object.values(skills)
      .filter(s => s.grade >= from && !passed(sk[s.id]) && (s.prerequisites || []).every(p => passed(sk[p]) || !skills[p]))
      .sort((a, b) => a.grade - b.grade || (b.critical ? 1 : 0) - (a.critical ? 1 : 0))[0]?.id || null;
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
