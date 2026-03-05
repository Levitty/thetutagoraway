// ============================================================================
// SUBJECT REGISTRY — Maps each subject to its knowledge graph + generators
// Adding a new subject = adding an entry here + its graph + generator files
// ============================================================================

import { SKILLS, SKILL_COUNT, STRANDS, GRADES, getSkillsByGrade, getSkillsByStrand, getPostRequisites } from './knowledgeGraph.js';
import { generateProblem, generateWorkedExample } from './problemGenerators.js';

import { AFM_SKILLS, AFM_SKILL_COUNT, AFM_STRANDS, AFM_GRADES, getAfmSkillsByGrade, getAfmSkillsByStrand, getAfmPostRequisites } from './afmKnowledgeGraph.js';
import { generateAfmProblem, generateAfmWorkedExample } from './afmProblemGenerators.js';

import { APM_SKILLS, APM_SKILL_COUNT, APM_STRANDS, APM_GRADES, getApmSkillsByGrade, getApmSkillsByStrand, getApmPostRequisites } from './apmKnowledgeGraph.js';
import { generateApmProblem, generateApmWorkedExample } from './apmProblemGenerators.js';

export const SUBJECTS = {
  math: {
    id: 'math',
    name: 'Mathematics',
    shortName: 'Math',
    emoji: '🧠',
    description: 'Grade 5-12 adaptive math (CBC Kenya + universal)',
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
  },
  afm: {
    id: 'afm',
    name: 'Advanced Financial Management',
    shortName: 'AFM',
    emoji: '💹',
    description: 'ACCA P4 — Investment, M&A, Treasury, Risk',
    skills: AFM_SKILLS,
    skillCount: AFM_SKILL_COUNT,
    strands: AFM_STRANDS,
    grades: AFM_GRADES,
    gradeLabel: 'Level',       // "Level 1 (Foundation)", etc.
    gradeNames: { 1: 'Foundation', 2: 'Intermediate', 3: 'Advanced' },
    getByGrade: getAfmSkillsByGrade,
    getByStrand: getAfmSkillsByStrand,
    getPostReqs: getAfmPostRequisites,
    generate: generateAfmProblem,
    generateExample: generateAfmWorkedExample,
  },
  apm: {
    id: 'apm',
    name: 'Advanced Performance Management',
    shortName: 'APM',
    emoji: '📊',
    description: 'ACCA P5 — Strategy, BSC, EVA, Quality, Sectors',
    skills: APM_SKILLS,
    skillCount: APM_SKILL_COUNT,
    strands: APM_STRANDS,
    grades: APM_GRADES,
    gradeLabel: 'Level',
    gradeNames: { 1: 'Foundation', 2: 'Intermediate', 3: 'Advanced' },
    getByGrade: getApmSkillsByGrade,
    getByStrand: getApmSkillsByStrand,
    getPostReqs: getApmPostRequisites,
    generate: generateApmProblem,
    generateExample: generateApmWorkedExample,
  },
};

export const SUBJECT_LIST = Object.values(SUBJECTS);
export const DEFAULT_SUBJECT = 'math';
