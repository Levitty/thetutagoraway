// ============================================================================
// ACCA APM (Advanced Performance Management / P5) Knowledge Graph
// ACCA P5 Syllabus aligned with Foundation, Intermediate, Advanced tiers
// ============================================================================

// Strand constants
const S = {
  STRATEGY: 'Strategic Planning',
  SYSTEMS: 'Performance Systems',
  MEASUREMENT: 'Performance Measurement',
  QUALITY: 'Quality & Cost Mgmt',
  SECTOR: 'Sector Performance',
};

// Skill builder helper
const skill = (id, name, grade, strand, questionType, opts = {}) => ({
  id,
  name,
  grade,
  strand,
  questionType,
  prerequisites: opts.pre || [],
  keyPrerequisites: opts.keyPre || opts.pre || [],
  encompassings: opts.enc || [],
  weight: opts.w || 3,
  critical: opts.crit || false,
  knowledgePoints: opts.kp || 3,
  masteryThreshold: opts.mt || 0.85,
  minProblems: opts.min || 6,
  estimatedMinutes: opts.mins || 15,
  xpValue: opts.xp || 15,
});

// ============================================================================
// FOUNDATION (Grade 1) — ~20 skills
// ============================================================================

const FOUNDATION = {
  // Strategic Planning Fundamentals
  APM_STRATEGY_INTRO: skill('APM_STRATEGY_INTRO', 'Introduction to Strategy & Strategic Management', 1, S.STRATEGY, 'mixed', { w: 2, min: 5 }),
  APM_MISSION_VISION: skill('APM_MISSION_VISION', 'Mission, Vision & Values', 1, S.STRATEGY, 'mixed', { w: 2, min: 5 }),
  APM_SWOT_ANALYSIS: skill('APM_SWOT_ANALYSIS', 'SWOT Analysis Framework', 1, S.STRATEGY, 'mixed', { pre: ['APM_STRATEGY_INTRO'], w: 3, min: 6 }),
  APM_PESTLE_ANALYSIS: skill('APM_PESTLE_ANALYSIS', 'PESTLE Analysis (Political, Economic, Social, Technological, Legal, Environmental)', 1, S.STRATEGY, 'mixed', { pre: ['APM_STRATEGY_INTRO'], w: 3, min: 6 }),
  APM_PORTERS_FIVE_FORCES: skill('APM_PORTERS_FIVE_FORCES', "Porter's Five Forces Model", 1, S.STRATEGY, 'mixed', { pre: ['APM_PESTLE_ANALYSIS'], w: 3, crit: true, min: 8 }),
  APM_GENERIC_STRATEGIES: skill('APM_GENERIC_STRATEGIES', "Porter's Generic Strategies (Cost Leadership, Differentiation, Focus)", 1, S.STRATEGY, 'mixed', { pre: ['APM_PORTERS_FIVE_FORCES'], w: 3, min: 6 }),
  APM_VALUE_CHAIN: skill('APM_VALUE_CHAIN', "Porter's Value Chain Analysis", 1, S.STRATEGY, 'mixed', { pre: ['APM_GENERIC_STRATEGIES'], w: 4, crit: true, min: 8 }),

  // Management Control Fundamentals
  APM_MANAGEMENT_CONTROL: skill('APM_MANAGEMENT_CONTROL', 'Fundamentals of Management Control Systems', 1, S.SYSTEMS, 'mixed', { w: 2, min: 5 }),
  APM_RESPONSIBILITY_CENTERS: skill('APM_RESPONSIBILITY_CENTERS', 'Types of Responsibility Centers (Cost, Revenue, Profit, Investment)', 1, S.SYSTEMS, 'mixed', { pre: ['APM_MANAGEMENT_CONTROL'], w: 3, crit: true, min: 7 }),
  APM_ORGANIZATIONAL_STRUCTURE: skill('APM_ORGANIZATIONAL_STRUCTURE', 'Organizational Structure & Divisional Autonomy', 1, S.SYSTEMS, 'mixed', { pre: ['APM_RESPONSIBILITY_CENTERS'], w: 2, min: 5 }),

  // Performance Measurement Basics
  APM_PM_INTRO: skill('APM_PM_INTRO', 'Introduction to Performance Measurement', 1, S.MEASUREMENT, 'mixed', { w: 2, min: 5 }),
  APM_KPI_BASICS: skill('APM_KPI_BASICS', 'Key Performance Indicators (KPIs) & Metrics Basics', 1, S.MEASUREMENT, 'mixed', { pre: ['APM_PM_INTRO'], w: 3, min: 6 }),
  APM_FINANCIAL_METRICS: skill('APM_FINANCIAL_METRICS', 'Financial Performance Metrics (ROI, Profit Margin, ROCE)', 1, S.MEASUREMENT, 'calculation', { pre: ['APM_KPI_BASICS'], w: 4, crit: true, min: 8 }),

  // Quality & Cost Fundamentals
  APM_COST_BEHAVIOR: skill('APM_COST_BEHAVIOR', 'Cost Behavior (Fixed, Variable, Mixed)', 1, S.QUALITY, 'calculation', { w: 3, min: 7 }),
  APM_QUALITY_INTRO: skill('APM_QUALITY_INTRO', 'Introduction to Quality Management', 1, S.QUALITY, 'mixed', { w: 2, min: 5 }),
  APM_COST_OF_QUALITY_INTRO: skill('APM_COST_OF_QUALITY_INTRO', 'Cost of Quality Framework Overview', 1, S.QUALITY, 'mixed', { pre: ['APM_QUALITY_INTRO'], w: 2, min: 5 }),

  // Information Systems
  APM_IT_SYSTEMS: skill('APM_IT_SYSTEMS', 'Information Technology Systems & Data Fundamentals', 1, S.SYSTEMS, 'mixed', { w: 2, min: 5 }),
  APM_DATA_QUALITY: skill('APM_DATA_QUALITY', 'Data Quality & Information Governance', 1, S.SYSTEMS, 'mixed', { pre: ['APM_IT_SYSTEMS'], w: 2, min: 5 }),
};

// ============================================================================
// INTERMEDIATE (Grade 2) — ~35 skills
// ============================================================================

const INTERMEDIATE = {
  // Strategic Control Systems
  APM_FEEDBACK_CONTROL: skill('APM_FEEDBACK_CONTROL', 'Feedback Control Systems & Corrective Actions', 2, S.SYSTEMS, 'mixed', { pre: ['APM_MANAGEMENT_CONTROL'], w: 4, crit: true, min: 8 }),
  APM_FEEDFORWARD_CONTROL: skill('APM_FEEDFORWARD_CONTROL', 'Feedforward Control & Preventive Actions', 2, S.SYSTEMS, 'mixed', { pre: ['APM_FEEDBACK_CONTROL'], w: 4, min: 7 }),
  APM_CONTROL_EFFECTIVENESS: skill('APM_CONTROL_EFFECTIVENESS', 'Control Effectiveness & Internal Controls', 2, S.SYSTEMS, 'mixed', { pre: ['APM_FEEDFORWARD_CONTROL'], w: 3, min: 6 }),

  // Balanced Scorecard
  APM_BSC_INTRO: skill('APM_BSC_INTRO', 'Introduction to Balanced Scorecard (BSC)', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_KPI_BASICS', 'APM_FEEDBACK_CONTROL'], w: 4, crit: true, min: 10 }),
  APM_BSC_FINANCIAL: skill('APM_BSC_FINANCIAL', 'Balanced Scorecard: Financial Perspective', 2, S.MEASUREMENT, 'calculation', { pre: ['APM_BSC_INTRO', 'APM_FINANCIAL_METRICS'], w: 4, min: 8 }),
  APM_BSC_CUSTOMER: skill('APM_BSC_CUSTOMER', 'Balanced Scorecard: Customer Perspective', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_BSC_INTRO'], w: 3, min: 6 }),
  APM_BSC_INTERNAL: skill('APM_BSC_INTERNAL', 'Balanced Scorecard: Internal Process Perspective', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_BSC_INTRO'], w: 3, min: 6 }),
  APM_BSC_LEARNING: skill('APM_BSC_LEARNING', 'Balanced Scorecard: Learning & Growth Perspective', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_BSC_INTRO'], w: 3, min: 6 }),
  APM_BSC_CAUSAL: skill('APM_BSC_CAUSAL', 'Balanced Scorecard: Cause-Effect Relationships & Strategy Map', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_BSC_FINANCIAL', 'APM_BSC_CUSTOMER', 'APM_BSC_INTERNAL', 'APM_BSC_LEARNING'], w: 5, crit: true, min: 10 }),

  // Building Block Model
  APM_BUILDING_BLOCKS: skill('APM_BUILDING_BLOCKS', 'Building Block Model (Fitzgerald & Moon)', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_PM_INTRO'], w: 5, crit: true, min: 10 }),
  APM_BUILDING_BLOCKS_COMPETITIVENESS: skill('APM_BUILDING_BLOCKS_COMPETITIVENESS', 'Building Blocks: Competitiveness Measures', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_BUILDING_BLOCKS'], w: 3, min: 6 }),
  APM_BUILDING_BLOCKS_FINANCIAL: skill('APM_BUILDING_BLOCKS_FINANCIAL', 'Building Blocks: Financial Performance', 2, S.MEASUREMENT, 'calculation', { pre: ['APM_BUILDING_BLOCKS'], w: 3, min: 6 }),

  // Performance Pyramid
  APM_PERFORMANCE_PYRAMID: skill('APM_PERFORMANCE_PYRAMID', 'Performance Pyramid Model', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_PM_INTRO', 'APM_VALUE_CHAIN'], w: 4, min: 8 }),

  // Economic Value Added (EVA)
  APM_EVA_CONCEPT: skill('APM_EVA_CONCEPT', 'Economic Value Added (EVA): Concept & Definition', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_FINANCIAL_METRICS'], w: 3, crit: true, min: 6 }),
  APM_NOPAT_CALC: skill('APM_NOPAT_CALC', 'Calculating NOPAT (Net Operating Profit After Tax)', 2, S.MEASUREMENT, 'calculation', { pre: ['APM_EVA_CONCEPT'], w: 4, min: 8 }),
  APM_INVESTED_CAPITAL: skill('APM_INVESTED_CAPITAL', 'Calculating Invested Capital & WACC', 2, S.MEASUREMENT, 'calculation', { pre: ['APM_NOPAT_CALC'], w: 4, crit: true, min: 8 }),
  APM_EVA_CALCULATION: skill('APM_EVA_CALCULATION', 'Economic Value Added (EVA) Calculation', 2, S.MEASUREMENT, 'calculation', { pre: ['APM_INVESTED_CAPITAL'], w: 5, crit: true, min: 10 }),
  APM_EVA_ADJUSTMENTS: skill('APM_EVA_ADJUSTMENTS', 'EVA Adjustments (Accounting, Operating, Strategic)', 2, S.MEASUREMENT, 'calculation', { pre: ['APM_EVA_CALCULATION'], w: 4, min: 8 }),

  // Total Quality Management (TQM)
  APM_TQM_PRINCIPLES: skill('APM_TQM_PRINCIPLES', 'Total Quality Management (TQM) Principles & Philosophy', 2, S.QUALITY, 'mixed', { pre: ['APM_QUALITY_INTRO'], w: 4, crit: true, min: 8 }),
  APM_KAIZEN: skill('APM_KAIZEN', 'Continuous Improvement (Kaizen)', 2, S.QUALITY, 'mixed', { pre: ['APM_TQM_PRINCIPLES'], w: 3, min: 6 }),
  APM_SIX_SIGMA: skill('APM_SIX_SIGMA', 'Six Sigma & DMAIC Methodology', 2, S.QUALITY, 'mixed', { pre: ['APM_TQM_PRINCIPLES'], w: 4, min: 8 }),
  APM_COST_OF_QUALITY: skill('APM_COST_OF_QUALITY', 'Cost of Quality (Prevention, Appraisal, Failure)', 2, S.QUALITY, 'calculation', { pre: ['APM_COST_OF_QUALITY_INTRO', 'APM_TQM_PRINCIPLES'], w: 4, crit: true, min: 8 }),

  // Activity-Based Management
  APM_ABC_BASICS: skill('APM_ABC_BASICS', 'Activity-Based Costing (ABC) Fundamentals', 2, S.QUALITY, 'calculation', { pre: ['APM_COST_BEHAVIOR'], w: 4, crit: true, min: 8 }),
  APM_ABM: skill('APM_ABM', 'Activity-Based Management (ABM) & Cost Driver Analysis', 2, S.QUALITY, 'calculation', { pre: ['APM_ABC_BASICS'], w: 5, crit: true, min: 10 }),

  // Target Costing & Value Engineering
  APM_TARGET_COSTING: skill('APM_TARGET_COSTING', 'Target Costing Methodology', 2, S.QUALITY, 'calculation', { pre: ['APM_ABM'], w: 5, crit: true, min: 10 }),
  APM_VALUE_ENGINEERING: skill('APM_VALUE_ENGINEERING', 'Value Engineering & Value Analysis', 2, S.QUALITY, 'mixed', { pre: ['APM_TARGET_COSTING'], w: 4, min: 8 }),

  // Benchmarking
  APM_BENCHMARKING: skill('APM_BENCHMARKING', 'Benchmarking: Types & Process', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_KPI_BASICS'], w: 4, crit: true, min: 8 }),
  APM_BENCHMARKING_ANALYSIS: skill('APM_BENCHMARKING_ANALYSIS', 'Benchmarking Analysis & Gap Analysis', 2, S.MEASUREMENT, 'mixed', { pre: ['APM_BENCHMARKING'], w: 3, min: 6 }),

  // ERP & Business Intelligence
  APM_ERP_SYSTEMS: skill('APM_ERP_SYSTEMS', 'Enterprise Resource Planning (ERP) Systems', 2, S.SYSTEMS, 'mixed', { pre: ['APM_IT_SYSTEMS'], w: 3, min: 6 }),
  APM_BI_TOOLS: skill('APM_BI_TOOLS', 'Business Intelligence (BI) Tools & Analytics', 2, S.SYSTEMS, 'mixed', { pre: ['APM_ERP_SYSTEMS', 'APM_DATA_QUALITY'], w: 4, min: 8 }),
  APM_DASHBOARDS: skill('APM_DASHBOARDS', 'Dashboards & Reporting Systems', 2, S.SYSTEMS, 'mixed', { pre: ['APM_BI_TOOLS'], w: 3, min: 6 }),

  // Data Analytics & Variance Analysis
  APM_DATA_ANALYTICS: skill('APM_DATA_ANALYTICS', 'Data Analytics Techniques & Interpretation', 2, S.SYSTEMS, 'mixed', { pre: ['APM_BI_TOOLS'], w: 4, min: 8 }),
  APM_VARIANCE_ANALYSIS_ADV: skill('APM_VARIANCE_ANALYSIS_ADV', 'Advanced Variance Analysis (Sales, Material, Labour, Overhead)', 2, S.MEASUREMENT, 'calculation', { pre: ['APM_FINANCIAL_METRICS'], w: 5, crit: true, min: 12 }),

  // Stakeholder Management
  APM_STAKEHOLDER_ANALYSIS: skill('APM_STAKEHOLDER_ANALYSIS', 'Stakeholder Analysis (Mendelow Matrix)', 2, S.STRATEGY, 'mixed', { pre: ['APM_STRATEGY_INTRO'], w: 3, min: 6 }),
  APM_STAKEHOLDER_COMMUNICATION: skill('APM_STAKEHOLDER_COMMUNICATION', 'Stakeholder Communication & Reporting', 2, S.STRATEGY, 'mixed', { pre: ['APM_STAKEHOLDER_ANALYSIS'], w: 3, min: 6 }),
};

// ============================================================================
// ADVANCED (Grade 3) — ~25 skills
// ============================================================================

const ADVANCED = {
  // Balanced Scorecard Applications
  APM_BSC_PRIVATE_SECTOR: skill('APM_BSC_PRIVATE_SECTOR', 'Balanced Scorecard Adaptation to Private Sector Contexts', 3, S.SECTOR, 'mixed', { pre: ['APM_BSC_CAUSAL'], w: 5, min: 10 }),
  APM_BSC_PUBLIC_SECTOR: skill('APM_BSC_PUBLIC_SECTOR', 'Balanced Scorecard Adaptation to Public Sector', 3, S.SECTOR, 'mixed', { pre: ['APM_BSC_CAUSAL'], w: 5, min: 10 }),
  APM_BSC_NFP: skill('APM_BSC_NFP', 'Balanced Scorecard for Not-For-Profit Organizations', 3, S.SECTOR, 'mixed', { pre: ['APM_BSC_CAUSAL'], w: 5, min: 10 }),

  // Value-Based Management
  APM_VALUE_BASED_MGMT: skill('APM_VALUE_BASED_MGMT', 'Value-Based Management & Shareholder Value Creation', 3, S.STRATEGY, 'mixed', { pre: ['APM_EVA_CALCULATION', 'APM_STRATEGY_INTRO'], w: 5, crit: true, min: 10 }),
  APM_STRATEGIC_CONFLICTS: skill('APM_STRATEGIC_CONFLICTS', 'Strategic Conflicts: Short-Term vs Long-Term Performance', 3, S.STRATEGY, 'mixed', { pre: ['APM_VALUE_BASED_MGMT'], w: 4, min: 8 }),

  // Sector-Specific Performance
  APM_PRIVATE_SECTOR_EVAL: skill('APM_PRIVATE_SECTOR_EVAL', 'Performance Evaluation in Private Sector', 3, S.SECTOR, 'mixed', { pre: ['APM_FINANCIAL_METRICS'], w: 4, min: 8 }),
  APM_PUBLIC_SECTOR_VFM: skill('APM_PUBLIC_SECTOR_VFM', 'Public Sector Performance: Value for Money (3Es: Economy, Efficiency, Effectiveness)', 3, S.SECTOR, 'mixed', { pre: ['APM_PM_INTRO'], w: 5, crit: true, min: 10 }),
  APM_REGULATED_SECTOR: skill('APM_REGULATED_SECTOR', 'Performance Metrics in Regulated Industries', 3, S.SECTOR, 'mixed', { pre: ['APM_KPI_BASICS'], w: 4, min: 8 }),
  APM_NFP_MEASUREMENT: skill('APM_NFP_MEASUREMENT', 'Performance Measurement in Not-For-Profit Sector', 3, S.SECTOR, 'mixed', { pre: ['APM_PUBLIC_SECTOR_VFM'], w: 5, min: 10 }),

  // Advanced Data & Analytics
  APM_BIG_DATA: skill('APM_BIG_DATA', 'Big Data & Advanced Analytics in Performance Management', 3, S.SYSTEMS, 'mixed', { pre: ['APM_DATA_ANALYTICS'], w: 5, min: 10 }),
  APM_MACHINE_LEARNING: skill('APM_MACHINE_LEARNING', 'Machine Learning Applications in Performance Management', 3, S.SYSTEMS, 'mixed', { pre: ['APM_BIG_DATA'], w: 6, min: 12 }),
  APM_PREDICTIVE_ANALYTICS: skill('APM_PREDICTIVE_ANALYTICS', 'Predictive Analytics & Forecasting', 3, S.MEASUREMENT, 'mixed', { pre: ['APM_MACHINE_LEARNING'], w: 5, crit: true, min: 10 }),

  // Reporting & Disclosure
  APM_INTEGRATED_REPORTING: skill('APM_INTEGRATED_REPORTING', 'Integrated Reporting Framework (IIRC)', 3, S.MEASUREMENT, 'mixed', { pre: ['APM_BSC_CAUSAL', 'APM_STAKEHOLDER_COMMUNICATION'], w: 5, crit: true, min: 10 }),
  APM_ENVIRONMENTAL_SOCIAL: skill('APM_ENVIRONMENTAL_SOCIAL', 'Environmental, Social & Governance (ESG) Performance Reporting', 3, S.MEASUREMENT, 'mixed', { pre: ['APM_INTEGRATED_REPORTING'], w: 5, min: 10 }),
  APM_SUSTAINABILITY_METRICS: skill('APM_SUSTAINABILITY_METRICS', 'Sustainability Metrics & Non-Financial Reporting', 3, S.MEASUREMENT, 'mixed', { pre: ['APM_ENVIRONMENTAL_SOCIAL'], w: 4, min: 8 }),

  // Advanced BSC & Strategic Issues
  APM_PROFESSIONAL_JUDGMENT: skill('APM_PROFESSIONAL_JUDGMENT', 'Professional Judgment in Performance Management Design', 3, S.MEASUREMENT, 'mixed', { pre: ['APM_BSC_CAUSAL', 'APM_CONTROL_EFFECTIVENESS'], w: 5, crit: true, min: 10 }),
  APM_PM_SYSTEM_DESIGN: skill('APM_PM_SYSTEM_DESIGN', 'Designing Integrated Performance Management Systems', 3, S.MEASUREMENT, 'mixed', { pre: ['APM_PROFESSIONAL_JUDGMENT'], w: 6, crit: true, min: 12 }),

  // Dashboard & Systems Design
  APM_DASHBOARD_DESIGN: skill('APM_DASHBOARD_DESIGN', 'Strategic Dashboard Design & Information Architecture', 3, S.SYSTEMS, 'mixed', { pre: ['APM_DASHBOARDS', 'APM_BSC_CAUSAL'], w: 5, min: 10 }),
  APM_REAL_TIME_SYSTEMS: skill('APM_REAL_TIME_SYSTEMS', 'Real-Time Performance Monitoring Systems', 3, S.SYSTEMS, 'mixed', { pre: ['APM_DASHBOARD_DESIGN'], w: 4, min: 8 }),

  // Transfer Pricing & Divisional Performance
  APM_TRANSFER_PRICING: skill('APM_TRANSFER_PRICING', 'Transfer Pricing Methods & Divisional Autonomy', 3, S.SYSTEMS, 'calculation', { pre: ['APM_RESPONSIBILITY_CENTERS'], w: 5, crit: true, min: 10 }),
  APM_DIVISIONAL_EVALUATION: skill('APM_DIVISIONAL_EVALUATION', 'Divisional Performance Evaluation & Incentive Systems', 3, S.MEASUREMENT, 'calculation', { pre: ['APM_TRANSFER_PRICING'], w: 5, min: 10 }),

  // Strategic & Operational Control
  APM_OPERATIONAL_CONTROL: skill('APM_OPERATIONAL_CONTROL', 'Operational Control vs Strategic Control', 3, S.SYSTEMS, 'mixed', { pre: ['APM_CONTROL_EFFECTIVENESS'], w: 4, min: 8 }),
  APM_CONTINGENCY_PLANNING: skill('APM_CONTINGENCY_PLANNING', 'Contingency Planning & Risk-Based Performance Management', 3, S.STRATEGY, 'mixed', { pre: ['APM_STRATEGIC_CONFLICTS'], w: 4, min: 8 }),

  // Advanced Quality Management
  APM_QUALITY_COSTING_ADV: skill('APM_QUALITY_COSTING_ADV', 'Advanced Quality Costing & Trade-Offs', 3, S.QUALITY, 'calculation', { pre: ['APM_COST_OF_QUALITY'], w: 5, min: 10 }),
  APM_SUPPLY_CHAIN_QUALITY: skill('APM_SUPPLY_CHAIN_QUALITY', 'Quality Management in Supply Chain Context', 3, S.QUALITY, 'mixed', { pre: ['APM_TQM_PRINCIPLES', 'APM_VALUE_CHAIN'], w: 4, min: 8 }),

  // Change Management & Strategic Issues
  APM_CHANGE_MANAGEMENT: skill('APM_CHANGE_MANAGEMENT', 'Change Management & Performance System Implementation', 3, S.STRATEGY, 'mixed', { pre: ['APM_PM_SYSTEM_DESIGN'], w: 5, min: 10 }),
  APM_STRATEGIC_ALIGNMENT: skill('APM_STRATEGIC_ALIGNMENT', 'Strategy Execution & Organizational Alignment', 3, S.STRATEGY, 'mixed', { pre: ['APM_CHANGE_MANAGEMENT', 'APM_VALUE_BASED_MGMT'], w: 5, crit: true, min: 10 }),
};

// ============================================================================
// COMBINED SKILLS MAP
// ============================================================================

export const APM_SKILLS = {
  ...FOUNDATION,
  ...INTERMEDIATE,
  ...ADVANCED,
};

export const APM_SKILL_COUNT = Object.keys(APM_SKILLS).length;

export const APM_STRANDS = [S.STRATEGY, S.SYSTEMS, S.MEASUREMENT, S.QUALITY, S.SECTOR];

export const APM_GRADES = [1, 2, 3];

// Get all skills for a specific grade (Foundation=1, Intermediate=2, Advanced=3)
export const getApmSkillsByGrade = (grade) =>
  Object.values(APM_SKILLS).filter(s => s.grade === grade);

// Get all skills for a specific strand
export const getApmSkillsByStrand = (strand) =>
  Object.values(APM_SKILLS).filter(s => s.strand === strand);

// Get all post-requisites of a skill (skills that depend on it)
export const getApmPostRequisites = (skillId) =>
  Object.values(APM_SKILLS).filter(s => s.prerequisites.includes(skillId));

// Get the full prerequisite chain (all ancestors)
export const getApmPrerequisiteChain = (skillId, visited = new Set()) => {
  if (visited.has(skillId)) return [];
  visited.add(skillId);
  const skill = APM_SKILLS[skillId];
  if (!skill) return [];
  const chain = [...skill.prerequisites];
  for (const pre of skill.prerequisites) {
    chain.push(...getApmPrerequisiteChain(pre, visited));
  }
  return [...new Set(chain)];
};

// Get the full post-requisite chain (all descendants)
export const getApmPostRequisiteChain = (skillId, visited = new Set()) => {
  if (visited.has(skillId)) return [];
  visited.add(skillId);
  const posts = getApmPostRequisites(skillId);
  const chain = posts.map(p => p.id);
  for (const p of posts) {
    chain.push(...getApmPostRequisiteChain(p.id, visited));
  }
  return [...new Set(chain)];
};

export default APM_SKILLS;
