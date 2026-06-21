// ============================================================================
// CURRICULUM REGISTRY — syllabus overlay for the math knowledge graph.
//
// A skill stays single-source-of-truth in knowledgeGraph.js and gains an
// optional `curricula` overlay, e.g.
//   curricula: {
//     cbc:       { grade: 7, strand: 'Measurements', substrand: '...', inScope: true },
//     cambridge: { stage: 8, strand: 'Geometry and Measure', refs: ['8Gg.06'], inScope: true },
//   }
// These helpers read the ACTIVE curriculum's view, falling back to the skill's
// native grade/strand when there is no tag — so the engine/UI behave exactly as
// before until Phase 2/3 tagging is added. See docs/curriculum-alignment.md.
// ============================================================================

export const NATIVE = 'native';

export const CURRICULA = {
  native: {
    id: 'native',
    name: 'Default (Grade 5–12)',
    shortName: 'Default',
    bandLabel: 'Grade',
    bands: [5, 6, 7, 8, 9, 10, 11, 12],
  },
  cbc: {
    id: 'cbc',
    name: 'CBC / CBE — Junior School',
    shortName: 'CBC/CBE',
    bandLabel: 'Grade',
    bands: [7, 8, 9],
    strands: ['Numbers', 'Algebra', 'Measurements', 'Geometry', 'Data Handling'],
  },
  cambridge: {
    id: 'cambridge',
    name: 'Cambridge Lower Secondary',
    shortName: 'Cambridge',
    bandLabel: 'Stage',
    bands: [7, 8, 9],
    strands: ['Number', 'Algebra', 'Geometry and Measure', 'Statistics and Probability'],
  },
};

export const getCurriculum = (id) => CURRICULA[id] || CURRICULA.native;

// The curricula a subject offers (native is always first). A subject declares
// extra views via `subject.curricula = ['cbc', 'cambridge']` in subjects.js.
export const curriculaForSubject = (subject) =>
  [NATIVE, ...((subject && subject.curricula) || [])].map(getCurriculum);

// The overlay tag for a skill under the active curriculum (null for native /
// untagged skills). The band field is `grade` for CBC and `stage` for Cambridge.
const tagOf = (skill, curr) =>
  curr && curr !== NATIVE ? (skill && skill.curricula && skill.curricula[curr]) : null;

// Effective band (grade/stage) for the active curriculum; falls back to native.
export const gradeOf = (skill, curr) => {
  const t = tagOf(skill, curr);
  if (t && t.grade != null) return t.grade;
  if (t && t.stage != null) return t.stage;
  return skill.grade;
};

// Effective strand for the active curriculum; falls back to native strand.
export const strandOf = (skill, curr) => {
  const t = tagOf(skill, curr);
  return t && t.strand ? t.strand : skill.strand;
};

// A skill is "enrichment" when it is explicitly tagged out of the active
// curriculum's scope. Untagged skills are treated as in-scope (no badge) so the
// view isn't covered in badges before Phase 2/3 tagging lands.
export const isEnrichment = (skill, curr) => {
  const t = tagOf(skill, curr);
  return !!t && t.inScope === false;
};

// Display label for a band, e.g. "Grade 7" / "Stage 8 — Intermediate".
export const bandLabel = (curr, grade, gradeNames) => {
  const c = getCurriculum(curr);
  const base = `${c.bandLabel} ${grade}`;
  return gradeNames && gradeNames[grade] ? `${base} — ${gradeNames[grade]}` : base;
};

export default CURRICULA;
