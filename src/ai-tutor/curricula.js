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
    name: 'Kenya CBC — full path (Grade 1–12)',
    shortName: 'CBC · Grade 1–12',
    bandLabel: 'Grade',
    bands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  cbc: {
    id: 'cbc',
    name: 'CBC/CBE — Junior School syllabus only (Grade 7–9)',
    shortName: 'Junior School 7–9',
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

// ---------------------------------------------------------- school systems
// What a family actually says out loud is "she's in CBC" or "she's at a
// Cambridge school" — nobody picks a syllabus *view*. So that is the question
// we ask, once, at the start; the views above are what it resolves to.
export const SYSTEMS = [
  { id: 'kenya',     label: 'Kenyan CBC',  note: 'CBC / CBE — the KICD syllabus' },
  { id: 'cambridge', label: 'Cambridge',   note: 'Cambridge Lower Secondary' },
];

// The system is the student's choice and it is what decides what she sees.
// Her grade only picks WHICH of that system's designs applies: KICD publishes
// a Junior School design covering Grades 7–9, so a Grade 7–9 CBC learner is
// taught that; above and below it the full Kenyan path is the Kenyan path.
export const resolveView = (system, grade) => {
  if (system === 'cambridge') return 'cambridge';
  if (system === 'kenya') return (grade >= 7 && grade <= 9) ? 'cbc' : NATIVE;
  return NATIVE;
};

// Which system a view belongs to — so the chip stays lit after a view switch.
export const systemOf = (view) => (view === 'cambridge' ? 'cambridge' : 'kenya');

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
