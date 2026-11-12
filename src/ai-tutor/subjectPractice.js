// ============================================================================
// PRACTICE FOR MORE THAN ONE SUBJECT (12 Nov 2026).
//
// HOREB's practice engine was Maths only. A subject is now an entry in subjects.js, and Science and English are built
// here from their curriculum maps and their question families, in the same shape as the Maths knowledge graph, so
// the adaptive engine, spaced repetition and the practice screen run on them unchanged.
//
//   skills       keyed by the curriculum skill code (SCIE.G5..., ENGL.G5...), which is also the `cskill` every question
//                and every evidence row carries, so mastery.js reads a subject's rows exactly as it reads Maths rows.
//   the graph    holds only skills that have at least one signed-off family. A skill nobody has signed off does not
//                exist for a child, and a prerequisite nobody has signed off does not hold a child back.
//   generate     draws from the signed families of that skill alone. THE ONE RULE (families/core.js isSigned): a
//                family a person has not signed off is never served to a child. With none signed it returns null.
//
// Nothing here touches the Maths path: generateProblem in problemGenerators.js is not read for these subjects, and
// the Maths subject is not built here. Today every list of signed ids is empty, so every graph is empty and no
// subject is offered (subjectsForGrade is empty).
// ============================================================================
import { FAMILIES, eligible } from './content/families/index.js';
import { ENGLISH_FAMILIES } from './content/families/english.js';
import { isOn, serveFamily } from './content/families/core.js';
import { SKILLS_SCI_G5, SUBSTRANDS_SCI_G5 } from './content/curriculumMap.science.g5.js';
import { SKILLS_E5, SUBSTRANDS_E5 } from './content/curriculumMap.english.g5.js';
import { gradeOfCskill } from '../learner/subject.js';

/** The subjects beyond Maths: what each is called, its curriculum map, and its families. */
export const SUBJECT_DEFS = {
  science: {
    id: 'science', name: 'Science and Technology', shortName: 'Science', icon: 'zap',
    description: 'Grade 5 Science and Technology from the CBC design',
    map: SKILLS_SCI_G5, substrands: SUBSTRANDS_SCI_G5,
    families: () => FAMILIES.filter(f => f.subject === 'science'),
  },
  english: {
    id: 'english', name: 'English', shortName: 'English', icon: 'book',
    description: 'Grade 5 English from the CBC design',
    map: SKILLS_E5, substrands: SUBSTRANDS_E5,
    families: () => ENGLISH_FAMILIES,
  },
};

const ESTIMATE = { minProblems: 5, estimatedMinutes: 10, xpValue: 15, weight: 3, masteryThreshold: 0.85, knowledgePoints: 1 };

/**
 * One subject in the shape of an entry in subjects.js. `served` says which families a child may be given (the signed
 * ones; tests pass their own), `families` is the list to read (tests pass copies).
 */
export function makeSubject(def, { served = isOn, families = def.families() } = {}) {
  const byCskill = new Map();
  for (const f of families) {
    if (!f.cskill) continue;
    if (!byCskill.has(f.cskill)) byCskill.set(f.cskill, []);
    byCskill.get(f.cskill).push(f);
  }
  const servedOf = (code) => (byCskill.get(code) || []).filter(served);
  const live = Object.keys(def.map).filter(code => servedOf(code).length);
  const liveSet = new Set(live);

  const skills = {};
  for (const code of live) {
    const k = def.map[code];
    const pre = (k.pre || []).filter(p => liveSet.has(p));
    skills[code] = {
      id: code, name: k.name, grade: gradeOfCskill(code) ?? 5, strand: def.substrands[k.sub]?.strand || def.name,
      substrand: def.substrands[k.sub]?.name || '', prerequisites: pre, keyPrerequisites: pre, encompassings: [], critical: false,
      curricula: null, ...ESTIMATE,
    };
  }
  const list = Object.values(skills);
  const strands = [...new Set(list.map(s => s.strand))];
  const grades = [...new Set(list.map(s => s.grade))].sort((a, b) => a - b);

  // A question for a skill: one signed family, with the same rung and form rules the Maths families follow. A subject
  // has no generator of its own to fall back on, so the easiest usable rung is served when the rules would leave none.
  const decks = new Map();
  const next = (skillId, pool) => {
    let deck = decks.get(skillId);
    if (!deck || !deck.length || deck.some(f => !pool.includes(f))) {
      deck = [...pool];
      for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
      decks.set(skillId, deck);
    }
    return deck.pop();
  };
  const generate = (skillId, opts = {}) => {
    const on = servedOf(skillId);
    if (!on.length) return null;
    let pool = on.filter(f => eligible(f, opts));
    if (!pool.length) {
      const usable = on.filter(f => f.form !== 'spot' && f.form !== 'steps');
      const base = usable.length ? usable : on;
      const low = Math.min(...base.map(f => f.rung));
      pool = base.filter(f => f.rung === low);
    }
    return serveFamily(next(skillId, pool));
  };

  return {
    id: def.id, name: def.name, shortName: def.shortName, icon: def.icon, description: def.description,
    subjectGroup: def.id, curricula: [],
    skills, skillCount: list.length, strands, grades, gradeLabel: 'Grade',
    getByGrade: (g) => list.filter(s => s.grade === g),
    getByStrand: (s) => list.filter(x => x.strand === s),
    getPostReqs: (id) => list.filter(s => s.prerequisites.includes(id)),
    generate,
    generateExample: (id) => generate(id)?.workedExample || null,
    kpCount: () => 1,
    // The grades at which a child could be given this subject today: those with at least one signed family.
    servedGrades: grades,
  };
}

/** The extra subjects, built from the signed lists as they stand. Empty graphs while nothing is signed. */
export const EXTRA_SUBJECTS = Object.fromEntries(Object.entries(SUBJECT_DEFS).map(([id, def]) => [id, makeSubject(def)]));

/** Which extra subjects a child of this grade may be offered: only those with at least one signed family at that grade. */
export const subjectsForGrade = (grade, subjects = EXTRA_SUBJECTS) => {
  const g = Number(grade);
  if (!Number.isFinite(g)) return [];
  return Object.values(subjects).filter(s => s.servedGrades.includes(g));
};
