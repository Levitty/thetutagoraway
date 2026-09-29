// ============================================================================
// SUBJECT REGISTRY — Maps each subject to its knowledge graph + generators
// Adding a new subject = adding an entry here + its graph + generator files
// ============================================================================

import { SKILLS, SKILL_COUNT, STRANDS, GRADES, getSkillsByGrade, getSkillsByStrand, getPostRequisites } from './knowledgeGraph.js';
import { generateProblem, generateWorkedExample, kpCount } from './problemGenerators.js';

import { CAMBRIDGE_SKILLS, CAMBRIDGE_SKILL_COUNT, CAMBRIDGE_STRANDS, CAMBRIDGE_STAGES, getCambridgeByStage, getCambridgeByStrand, getCambridgePostRequisites } from './cambridgeKnowledgeGraph.js';
import { cambridgeGenerate, cambridgeGenerateExample } from './cambridgeContent.js';

import { SAT_SKILLS, SAT_SKILL_COUNT, SAT_STRANDS, SAT_BANDS, getSatByBand, getSatByStrand, getSatPostRequisites } from './satKnowledgeGraph.js';
import { satGenerate, satGenerateExample } from './satContent.js';

export const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Mathematics',
    shortName: 'Math',
    emoji: '🧠',
    description: 'Grade 5-12 adaptive math (CBC Kenya + universal)',
    // Syllabus views this subject can be shown through (native is implicit).
    curricula: ['cbc', 'cambridge'],
    skills: SKILLS,
    skillCount: SKILL_COUNT,
    strands: STRANDS,
    grades: GRADES,
    gradeLabel: 'Grade',       // "Grade 5", "Grade 6", etc.
    getByGrade: getSkillsByGrade,
    getByStrand: getSkillsByStrand,
    getPostReqs: getPostRequisites,
    generate: generateProblem,
    generateExample: generateWorkedExample,
    kpCount,
  },
  cambridge: {
    id: 'cambridge',
    name: 'Cambridge Mathematics',
    shortName: 'Cambridge',
    emoji: '🎓',
    description: 'Cambridge Primary → IGCSE 0580 (Core & Extended)',
    skills: CAMBRIDGE_SKILLS,
    skillCount: CAMBRIDGE_SKILL_COUNT,
    strands: CAMBRIDGE_STRANDS,
    grades: CAMBRIDGE_STAGES,
    gradeLabel: 'Stage',       // "Stage 1"…"Stage 11 (IGCSE Extended)"
    getByGrade: getCambridgeByStage,
    getByStrand: getCambridgeByStrand,
    getPostReqs: getCambridgePostRequisites,
    generate: cambridgeGenerate,
    generateExample: cambridgeGenerateExample,
  },
  sat: {
    id: 'sat',
    name: 'SAT Math',
    shortName: 'SAT',
    emoji: '🇺🇸',
    description: 'Digital SAT Math — Algebra, Advanced Math, Data, Geometry',
    skills: SAT_SKILLS,
    skillCount: SAT_SKILL_COUNT,
    strands: SAT_STRANDS,
    grades: SAT_BANDS,
    gradeLabel: 'Band',
    gradeNames: { 1: 'Foundational', 2: 'Core', 3: 'Advanced', 4: 'Hardest' },
    getByGrade: getSatByBand,
    getByStrand: getSatByStrand,
    getPostReqs: getSatPostRequisites,
    generate: satGenerate,
    generateExample: satGenerateExample,
  },
};

export const SUBJECT_LIST = Object.values(SUBJECTS);
export const DEFAULT_SUBJECT = 'math';
