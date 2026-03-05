// ============================================================================
// TUTAGORA KNOWLEDGE GRAPH — ACCA Advanced Financial Management (AFM/P4)
// Difficulty tiers: Foundation (1), Intermediate (2), Advanced (3)
// ============================================================================

// Strand constants
const S = {
  IA: 'Investment Appraisal',
  AM: 'Acquisitions & Mergers',
  CR: 'Corporate Reconstruction',
  TR: 'Treasury & Risk',
  CC: 'Cost of Capital',
};

// Skill builder helper
const skill = (id, name, grade, strand, opts = {}) => ({
  id,
  name,
  grade,
  strand,
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
  questionType: opts.qt || 'calculation',
});

// ============================================================================
// FOUNDATION (Grade 1) — Cost of Capital & Time Value Basics (~25 skills)
// ============================================================================

const FOUNDATION = {
  // Cost of Capital Fundamentals
  AFM_COST_OF_EQUITY_INTRO: skill('AFM_COST_OF_EQUITY_INTRO', 'Cost of Equity Fundamentals', 1, S.CC, { w: 3, qt: 'calculation', min: 7, crit: true }),
  AFM_CAPM_INTRO: skill('AFM_CAPM_INTRO', 'CAPM Model Introduction', 1, S.CC, { w: 3, qt: 'calculation', min: 7, crit: true }),
  AFM_BETA_BASICS: skill('AFM_BETA_BASICS', 'Beta: Concept & Measurement', 1, S.CC, { pre: ['AFM_CAPM_INTRO'], w: 3, qt: 'calculation', min: 6, crit: true }),
  AFM_RISK_PREMIUM: skill('AFM_RISK_PREMIUM', 'Market Risk Premium & Required Return', 1, S.CC, { pre: ['AFM_CAPM_INTRO'], w: 2, qt: 'calculation' }),
  AFM_COST_OF_DEBT: skill('AFM_COST_OF_DEBT', 'Cost of Debt & YTM', 1, S.CC, { w: 3, qt: 'calculation', crit: true }),
  AFM_PREFERENCE_SHARES: skill('AFM_PREFERENCE_SHARES', 'Cost of Preference Shares', 1, S.CC, { pre: ['AFM_COST_OF_EQUITY_INTRO'], w: 2, qt: 'calculation' }),
  AFM_WACC_BASICS: skill('AFM_WACC_BASICS', 'WACC Calculation (Basic)', 1, S.CC, { pre: ['AFM_COST_OF_EQUITY_INTRO', 'AFM_COST_OF_DEBT'], w: 4, qt: 'calculation', min: 8, crit: true }),
  AFM_TAX_SHIELD: skill('AFM_TAX_SHIELD', 'Tax Shield on Debt', 1, S.CC, { pre: ['AFM_WACC_BASICS'], w: 2, qt: 'calculation' }),

  // Time Value of Money & NPV Foundation
  AFM_TVM_INTRO: skill('AFM_TVM_INTRO', 'Time Value of Money Basics', 1, S.IA, { w: 3, qt: 'calculation', crit: true }),
  AFM_NPV_FUNDAMENTALS: skill('AFM_NPV_FUNDAMENTALS', 'NPV Concept & Calculation', 1, S.IA, { pre: ['AFM_TVM_INTRO'], w: 4, qt: 'calculation', min: 8, crit: true }),
  AFM_DISCOUNT_RATE: skill('AFM_DISCOUNT_RATE', 'Selecting Appropriate Discount Rates', 1, S.IA, { pre: ['AFM_NPV_FUNDAMENTALS', 'AFM_WACC_BASICS'], w: 3, qt: 'mixed' }),
  AFM_IRR_BASICS: skill('AFM_IRR_BASICS', 'IRR Calculation & Interpretation', 1, S.IA, { pre: ['AFM_NPV_FUNDAMENTALS'], w: 3, qt: 'calculation', crit: true }),
  AFM_PAYBACK_PERIOD: skill('AFM_PAYBACK_PERIOD', 'Payback Period Method', 1, S.IA, { pre: ['AFM_NPV_FUNDAMENTALS'], w: 2, qt: 'calculation' }),
  AFM_PROFITABILITY_INDEX: skill('AFM_PROFITABILITY_INDEX', 'Profitability Index', 1, S.IA, { pre: ['AFM_NPV_FUNDAMENTALS'], w: 2, qt: 'calculation' }),

  // Financial Statement Analysis Basics
  AFM_FINANCIAL_RATIOS_INTRO: skill('AFM_FINANCIAL_RATIOS_INTRO', 'Financial Ratios Analysis', 1, S.CR, { w: 2, qt: 'calculation' }),
  AFM_LIQUIDITY_ANALYSIS: skill('AFM_LIQUIDITY_ANALYSIS', 'Liquidity & Working Capital Analysis', 1, S.CR, { pre: ['AFM_FINANCIAL_RATIOS_INTRO'], w: 2, qt: 'calculation' }),
  AFM_SOLVENCY_ANALYSIS: skill('AFM_SOLVENCY_ANALYSIS', 'Solvency & Leverage Analysis', 1, S.CR, { pre: ['AFM_FINANCIAL_RATIOS_INTRO'], w: 2, qt: 'calculation' }),
  AFM_PROFITABILITY_ANALYSIS: skill('AFM_PROFITABILITY_ANALYSIS', 'Profitability Ratios', 1, S.CR, { pre: ['AFM_FINANCIAL_RATIOS_INTRO'], w: 2, qt: 'calculation' }),

  // Corporate Governance & Ethics
  AFM_GOVERNANCE_INTRO: skill('AFM_GOVERNANCE_INTRO', 'Corporate Governance Principles', 1, S.CR, { w: 1, qt: 'mcq' }),
  AFM_ETHICAL_FRAMEWORK: skill('AFM_ETHICAL_FRAMEWORK', 'Ethical Framework for Accountants', 1, S.CR, { pre: ['AFM_GOVERNANCE_INTRO'], w: 1, qt: 'mcq' }),
  AFM_AGENCY_THEORY: skill('AFM_AGENCY_THEORY', 'Agency Theory & Stakeholder Interests', 1, S.CR, { w: 2, qt: 'mcq' }),
  AFM_STAKEHOLDER_ANALYSIS: skill('AFM_STAKEHOLDER_ANALYSIS', 'Stakeholder Analysis & Theory', 1, S.CR, { w: 2, qt: 'mixed' }),

  // Treasury Basics
  AFM_TREASURY_INTRO: skill('AFM_TREASURY_INTRO', 'Treasury Function Overview', 1, S.TR, { w: 1, qt: 'mcq' }),
  AFM_MONEY_MARKET_INTRO: skill('AFM_MONEY_MARKET_INTRO', 'Money Market Instruments', 1, S.TR, { pre: ['AFM_TREASURY_INTRO'], w: 2, qt: 'calculation' }),
};

// ============================================================================
// INTERMEDIATE (Grade 2) — Advanced Valuation & Risk (~35 skills)
// ============================================================================

const INTERMEDIATE = {
  // Cost of Capital Advanced
  AFM_CAPM_ADVANCED: skill('AFM_CAPM_ADVANCED', 'CAPM Advanced Applications', 2, S.CC, { pre: ['AFM_CAPM_INTRO', 'AFM_BETA_BASICS'], w: 4, qt: 'calculation', min: 8, crit: true }),
  AFM_UNGEARING_GEARING: skill('AFM_UNGEARING_GEARING', 'Ungearing & Regearing Beta', 2, S.CC, { pre: ['AFM_BETA_BASICS', 'AFM_WACC_BASICS'], w: 4, qt: 'calculation', crit: true }),
  AFM_WACC_ADVANCED: skill('AFM_WACC_ADVANCED', 'WACC Advanced Calculations', 2, S.CC, { pre: ['AFM_WACC_BASICS', 'AFM_UNGEARING_GEARING'], w: 4, qt: 'calculation', min: 8, crit: true }),
  AFM_FLOTATION_COSTS: skill('AFM_FLOTATION_COSTS', 'Flotation Costs in WACC', 2, S.CC, { pre: ['AFM_WACC_ADVANCED'], w: 2, qt: 'calculation' }),
  AFM_DIVIDEND_GROWTH_MODEL: skill('AFM_DIVIDEND_GROWTH_MODEL', 'Dividend Growth Model (DGM)', 2, S.CC, { pre: ['AFM_COST_OF_EQUITY_INTRO'], w: 3, qt: 'calculation' }),
  AFM_COST_OF_EQUITY_ADV: skill('AFM_COST_OF_EQUITY_ADV', 'Multi-Factor Cost of Equity Models', 2, S.CC, { pre: ['AFM_CAPM_ADVANCED'], w: 3, qt: 'calculation' }),

  // NPV & Investment Appraisal Advanced
  AFM_NPV_SENSITIVITY: skill('AFM_NPV_SENSITIVITY', 'Sensitivity Analysis', 2, S.IA, { pre: ['AFM_NPV_FUNDAMENTALS', 'AFM_DISCOUNT_RATE'], w: 4, qt: 'calculation', crit: true }),
  AFM_NPV_SCENARIO: skill('AFM_NPV_SCENARIO', 'Scenario Analysis', 2, S.IA, { pre: ['AFM_NPV_SENSITIVITY'], w: 3, qt: 'mixed', crit: true }),
  AFM_NPV_SIMULATION: skill('AFM_NPV_SIMULATION', 'Simulation & Probability Analysis', 2, S.IA, { pre: ['AFM_NPV_SCENARIO'], w: 4, qt: 'calculation' }),
  AFM_EVA_ANALYSIS: skill('AFM_EVA_ANALYSIS', 'Economic Value Added (EVA)', 2, S.IA, { pre: ['AFM_NPV_FUNDAMENTALS', 'AFM_WACC_ADVANCED'], w: 3, qt: 'calculation' }),
  AFM_MONTE_CARLO: skill('AFM_MONTE_CARLO', 'Monte Carlo Simulation for Investment Risk', 2, S.IA, { pre: ['AFM_NPV_SIMULATION'], w: 4, qt: 'calculation' }),

  // Real Options
  AFM_REAL_OPTIONS_INTRO: skill('AFM_REAL_OPTIONS_INTRO', 'Real Options Theory', 2, S.IA, { pre: ['AFM_NPV_FUNDAMENTALS'], w: 3, qt: 'mixed', crit: true }),
  AFM_EXPANSION_OPTIONS: skill('AFM_EXPANSION_OPTIONS', 'Expansion & Abandonment Options', 2, S.IA, { pre: ['AFM_REAL_OPTIONS_INTRO'], w: 3, qt: 'calculation' }),
  AFM_TIMING_OPTIONS: skill('AFM_TIMING_OPTIONS', 'Timing & Flexibility Options', 2, S.IA, { pre: ['AFM_EXPANSION_OPTIONS'], w: 3, qt: 'mixed' }),

  // Business Valuation
  AFM_ASSET_VALUATION: skill('AFM_ASSET_VALUATION', 'Asset-Based Valuation', 2, S.AM, { pre: ['AFM_FINANCIAL_RATIOS_INTRO'], w: 2, qt: 'calculation' }),
  AFM_PE_MULTIPLE: skill('AFM_PE_MULTIPLE', 'P/E Multiple Valuation', 2, S.AM, { pre: ['AFM_PROFITABILITY_ANALYSIS'], w: 3, qt: 'calculation' }),
  AFM_DCF_VALUATION: skill('AFM_DCF_VALUATION', 'DCF Business Valuation', 2, S.AM, { pre: ['AFM_NPV_FUNDAMENTALS', 'AFM_WACC_ADVANCED'], w: 5, qt: 'calculation', crit: true, min: 10 }),
  AFM_DIVIDEND_VALUATION: skill('AFM_DIVIDEND_VALUATION', 'Dividend-Based Valuation', 2, S.AM, { pre: ['AFM_DIVIDEND_GROWTH_MODEL'], w: 2, qt: 'calculation' }),

  // M&A Strategy
  AFM_MA_STRATEGY: skill('AFM_MA_STRATEGY', 'M&A Strategic Rationale', 2, S.AM, { w: 2, qt: 'mcq' }),
  AFM_SYNERGY_TYPES: skill('AFM_SYNERGY_TYPES', 'Types of Synergies', 2, S.AM, { pre: ['AFM_MA_STRATEGY'], w: 3, qt: 'mixed' }),
  AFM_SYNERGY_VALUATION: skill('AFM_SYNERGY_VALUATION', 'Synergy Valuation & Quantification', 2, S.AM, { pre: ['AFM_SYNERGY_TYPES', 'AFM_DCF_VALUATION'], w: 4, qt: 'calculation', crit: true }),
  AFM_FINANCING_ACQUISITION: skill('AFM_FINANCING_ACQUISITION', 'Financing Acquisition Strategies', 2, S.AM, { pre: ['AFM_MA_STRATEGY', 'AFM_WACC_ADVANCED'], w: 4, qt: 'mixed', crit: true }),
  AFM_BIDDING_STRATEGY: skill('AFM_BIDDING_STRATEGY', 'Bidding & Offer Strategy', 2, S.AM, { pre: ['AFM_DCF_VALUATION', 'AFM_SYNERGY_VALUATION'], w: 3, qt: 'mixed' }),

  // Financial Distress
  AFM_FINANCIAL_DISTRESS: skill('AFM_FINANCIAL_DISTRESS', 'Indicators of Financial Distress', 2, S.CR, { pre: ['AFM_SOLVENCY_ANALYSIS', 'AFM_LIQUIDITY_ANALYSIS'], w: 3, qt: 'mixed' }),
  AFM_BANKRUPTCY_MODELS: skill('AFM_BANKRUPTCY_MODELS', 'Bankruptcy Prediction Models (Altman Z-Score)', 2, S.CR, { pre: ['AFM_FINANCIAL_DISTRESS'], w: 3, qt: 'calculation' }),
  AFM_RESTRUCTURING: skill('AFM_RESTRUCTURING', 'Corporate Restructuring & Turnaround', 2, S.CR, { pre: ['AFM_FINANCIAL_DISTRESS', 'AFM_BANKRUPTCY_MODELS'], w: 3, qt: 'mixed' }),

  // Hedging Instruments - Forwards & Futures
  AFM_FORWARD_CONTRACTS: skill('AFM_FORWARD_CONTRACTS', 'Forward Contracts Fundamentals', 2, S.TR, { pre: ['AFM_MONEY_MARKET_INTRO'], w: 3, qt: 'calculation', crit: true }),
  AFM_MONEY_MARKET_HEDGE: skill('AFM_MONEY_MARKET_HEDGE', 'Money Market Hedges', 2, S.TR, { pre: ['AFM_FORWARD_CONTRACTS'], w: 2, qt: 'calculation' }),
  AFM_CURRENCY_FUTURES: skill('AFM_CURRENCY_FUTURES', 'Currency Futures Contracts', 2, S.TR, { pre: ['AFM_FORWARD_CONTRACTS'], w: 3, qt: 'calculation' }),
  AFM_INTEREST_RATE_FUTURES: skill('AFM_INTEREST_RATE_FUTURES', 'Interest Rate Futures', 2, S.TR, { pre: ['AFM_FORWARD_CONTRACTS'], w: 3, qt: 'calculation', crit: true }),

  // Options
  AFM_CURRENCY_OPTIONS: skill('AFM_CURRENCY_OPTIONS', 'Currency Options for Hedging', 2, S.TR, { pre: ['AFM_FORWARD_CONTRACTS'], w: 4, qt: 'calculation', crit: true }),
  AFM_INTEREST_RATE_OPTIONS: skill('AFM_INTEREST_RATE_OPTIONS', 'Interest Rate Options (Caps, Floors, Collars)', 2, S.TR, { pre: ['AFM_INTEREST_RATE_FUTURES'], w: 3, qt: 'calculation' }),
  AFM_OPTION_VALUATION: skill('AFM_OPTION_VALUATION', 'Option Valuation Models (Binomial, Black-Scholes)', 2, S.TR, { pre: ['AFM_CURRENCY_OPTIONS', 'AFM_INTEREST_RATE_OPTIONS'], w: 4, qt: 'calculation' }),

  // Swaps
  AFM_INTEREST_RATE_SWAPS: skill('AFM_INTEREST_RATE_SWAPS', 'Interest Rate Swaps', 2, S.TR, { pre: ['AFM_INTEREST_RATE_FUTURES'], w: 4, qt: 'calculation', crit: true }),
  AFM_CURRENCY_SWAPS: skill('AFM_CURRENCY_SWAPS', 'Currency Swaps', 2, S.TR, { pre: ['AFM_CURRENCY_FUTURES', 'AFM_INTEREST_RATE_SWAPS'], w: 4, qt: 'calculation' }),
  AFM_SWAP_VALUATION: skill('AFM_SWAP_VALUATION', 'Swap Valuation & Pricing', 2, S.TR, { pre: ['AFM_INTEREST_RATE_SWAPS', 'AFM_CURRENCY_SWAPS'], w: 4, qt: 'calculation' }),
};

// ============================================================================
// ADVANCED (Grade 3) — Complex Scenarios & Strategy (~25 skills)
// ============================================================================

const ADVANCED = {
  // International Investment
  AFM_INTERNATIONAL_INVESTMENT: skill('AFM_INTERNATIONAL_INVESTMENT', 'International Investment Appraisal', 3, S.IA, { pre: ['AFM_DCF_VALUATION', 'AFM_CURRENCY_FUTURES'], w: 5, qt: 'calculation', crit: true, min: 10 }),
  AFM_POLITICAL_COUNTRY_RISK: skill('AFM_POLITICAL_COUNTRY_RISK', 'Political & Country Risk Assessment', 3, S.IA, { pre: ['AFM_INTERNATIONAL_INVESTMENT'], w: 3, qt: 'mixed' }),
  AFM_TRANSFER_PRICING: skill('AFM_TRANSFER_PRICING', 'Transfer Pricing in Multinationals', 3, S.IA, { pre: ['AFM_INTERNATIONAL_INVESTMENT'], w: 3, qt: 'mixed' }),
  AFM_FOREIGN_CURRENCY_ANALYSIS: skill('AFM_FOREIGN_CURRENCY_ANALYSIS', 'Foreign Currency Analysis & Forecasting', 3, S.IA, { pre: ['AFM_INTERNATIONAL_INVESTMENT', 'AFM_CURRENCY_OPTIONS'], w: 4, qt: 'mixed' }),

  // Complex M&A
  AFM_COMPLEX_VALUATION_MA: skill('AFM_COMPLEX_VALUATION_MA', 'Complex Business Valuation in M&A Context', 3, S.AM, { pre: ['AFM_DCF_VALUATION', 'AFM_SYNERGY_VALUATION'], w: 5, qt: 'calculation', crit: true }),
  AFM_EARN_OUT_PROVISIONS: skill('AFM_EARN_OUT_PROVISIONS', 'Earn-Out Provisions & Contingent Payments', 3, S.AM, { pre: ['AFM_COMPLEX_VALUATION_MA'], w: 3, qt: 'calculation' }),
  AFM_HOSTILE_TAKEOVERS: skill('AFM_HOSTILE_TAKEOVERS', 'Hostile Takeovers & Defense Strategies', 3, S.AM, { pre: ['AFM_BIDDING_STRATEGY'], w: 3, qt: 'mixed' }),
  AFM_DUE_DILIGENCE: skill('AFM_DUE_DILIGENCE', 'Due Diligence & Risk Assessment', 3, S.AM, { pre: ['AFM_COMPLEX_VALUATION_MA', 'AFM_FINANCIAL_DISTRESS'], w: 4, qt: 'mixed', crit: true }),

  // Corporate Reconstruction Advanced
  AFM_MBO_MBI: skill('AFM_MBO_MBI', 'Management Buyouts & Buyins (MBO/MBI)', 3, S.CR, { pre: ['AFM_RESTRUCTURING', 'AFM_FINANCING_ACQUISITION'], w: 4, qt: 'mixed', crit: true }),
  AFM_LEVERAGED_BUYOUT: skill('AFM_LEVERAGED_BUYOUT', 'Leveraged Buyout (LBO) Analysis', 3, S.CR, { pre: ['AFM_MBO_MBI'], w: 4, qt: 'calculation' }),
  AFM_DEMERGERS: skill('AFM_DEMERGERS', 'Demergers & Spin-Offs', 3, S.CR, { pre: ['AFM_DCF_VALUATION', 'AFM_RESTRUCTURING'], w: 3, qt: 'mixed' }),
  AFM_JOINT_VENTURES: skill('AFM_JOINT_VENTURES', 'Joint Ventures & Strategic Alliances', 3, S.CR, { pre: ['AFM_SYNERGY_TYPES', 'AFM_DCF_VALUATION'], w: 3, qt: 'mixed' }),
  AFM_CONSOLIDATED_STATEMENTS: skill('AFM_CONSOLIDATED_STATEMENTS', 'Consolidated Financial Statements Analysis', 3, S.CR, { pre: ['AFM_PROFITABILITY_ANALYSIS', 'AFM_SOLVENCY_ANALYSIS'], w: 2, qt: 'calculation' }),

  // Complex Hedging Strategies
  AFM_HEDGE_EFFECTIVENESS: skill('AFM_HEDGE_EFFECTIVENESS', 'Hedge Effectiveness & Accounting Treatment', 3, S.TR, { pre: ['AFM_INTEREST_RATE_SWAPS', 'AFM_CURRENCY_SWAPS'], w: 3, qt: 'mixed' }),
  AFM_CROSS_CURRENCY_SWAPS: skill('AFM_CROSS_CURRENCY_SWAPS', 'Cross-Currency Swaps', 3, S.TR, { pre: ['AFM_CURRENCY_SWAPS'], w: 4, qt: 'calculation', crit: true }),
  AFM_COMPLEX_HEDGING: skill('AFM_COMPLEX_HEDGING', 'Complex Multi-Instrument Hedging Strategies', 3, S.TR, { pre: ['AFM_CROSS_CURRENCY_SWAPS', 'AFM_OPTION_VALUATION', 'AFM_SWAP_VALUATION'], w: 5, qt: 'mixed', crit: true, min: 10 }),
  AFM_EMBEDDED_DERIVATIVES: skill('AFM_EMBEDDED_DERIVATIVES', 'Embedded Derivatives & Hybrid Instruments', 3, S.TR, { pre: ['AFM_COMPLEX_HEDGING'], w: 3, qt: 'mixed' }),

  // Risk Measurement & Management
  AFM_VAR_CALCULATION: skill('AFM_VAR_CALCULATION', 'Value at Risk (VaR) Calculation', 3, S.TR, { pre: ['AFM_COMPLEX_HEDGING'], w: 4, qt: 'calculation', crit: true }),
  AFM_EXPECTED_SHORTFALL: skill('AFM_EXPECTED_SHORTFALL', 'Expected Shortfall & Tail Risk', 3, S.TR, { pre: ['AFM_VAR_CALCULATION'], w: 3, qt: 'calculation' }),
  AFM_STRESS_TESTING: skill('AFM_STRESS_TESTING', 'Stress Testing & Scenario Modeling', 3, S.TR, { pre: ['AFM_VAR_CALCULATION'], w: 3, qt: 'mixed' }),
  AFM_CREDIT_RISK: skill('AFM_CREDIT_RISK', 'Credit Risk Assessment & Management', 3, S.TR, { pre: ['AFM_DUE_DILIGENCE'], w: 3, qt: 'mixed' }),
  AFM_OPERATIONAL_RISK: skill('AFM_OPERATIONAL_RISK', 'Operational Risk Identification & Mitigation', 3, S.TR, { w: 2, qt: 'mixed' }),

  // Treasury Function & Strategy
  AFM_TREASURY_STRATEGY: skill('AFM_TREASURY_STRATEGY', 'Treasury Function & Strategic Planning', 3, S.TR, { pre: ['AFM_VAR_CALCULATION', 'AFM_COMPLEX_HEDGING'], w: 4, qt: 'mixed', crit: true }),
  AFM_LIQUIDITY_MANAGEMENT: skill('AFM_LIQUIDITY_MANAGEMENT', 'Liquidity Risk Management', 3, S.TR, { pre: ['AFM_TREASURY_STRATEGY'], w: 3, qt: 'mixed' }),
  AFM_FUNDING_STRATEGIES: skill('AFM_FUNDING_STRATEGIES', 'Optimal Funding Strategies & Debt Management', 3, S.TR, { pre: ['AFM_TREASURY_STRATEGY', 'AFM_WACC_ADVANCED'], w: 4, qt: 'mixed' }),

  // Professional Judgment & Decision Making
  AFM_PROFESSIONAL_JUDGMENT: skill('AFM_PROFESSIONAL_JUDGMENT', 'Professional Judgment in Complex Scenarios', 3, S.AM, { pre: ['AFM_DUE_DILIGENCE', 'AFM_ETHICAL_FRAMEWORK'], w: 3, qt: 'mixed' }),
  AFM_STAKEHOLDER_MANAGEMENT: skill('AFM_STAKEHOLDER_MANAGEMENT', 'Stakeholder Management in M&A & Reconstruction', 3, S.AM, { pre: ['AFM_STAKEHOLDER_ANALYSIS', 'AFM_PROFESSIONAL_JUDGMENT'], w: 2, qt: 'mixed' }),
};

// ============================================================================
// COMBINED SKILLS MAP
// ============================================================================

export const AFM_SKILLS = {
  ...FOUNDATION,
  ...INTERMEDIATE,
  ...ADVANCED,
};

export const AFM_SKILL_COUNT = Object.keys(AFM_SKILLS).length;

export const AFM_STRANDS = [S.IA, S.AM, S.CR, S.TR, S.CC];

export const AFM_GRADES = [1, 2, 3];

// Get all skills for a specific difficulty tier (grade 1 = Foundation, 2 = Intermediate, 3 = Advanced)
export const getAfmSkillsByGrade = (grade) =>
  Object.values(AFM_SKILLS).filter(s => s.grade === grade);

// Get all skills for a specific strand
export const getAfmSkillsByStrand = (strand) =>
  Object.values(AFM_SKILLS).filter(s => s.strand === strand);

// Get all post-requisites of a skill (skills that depend on it)
export const getAfmPostRequisites = (skillId) =>
  Object.values(AFM_SKILLS).filter(s => s.prerequisites.includes(skillId));

// Get the full prerequisite chain (all ancestors)
export const getAfmPrerequisiteChain = (skillId, visited = new Set()) => {
  if (visited.has(skillId)) return [];
  visited.add(skillId);
  const skill = AFM_SKILLS[skillId];
  if (!skill) return [];
  const chain = [...skill.prerequisites];
  for (const pre of skill.prerequisites) {
    chain.push(...getAfmPrerequisiteChain(pre, visited));
  }
  return [...new Set(chain)];
};

// Get the full post-requisite chain (all descendants)
export const getAfmPostRequisiteChain = (skillId, visited = new Set()) => {
  if (visited.has(skillId)) return [];
  visited.add(skillId);
  const posts = getAfmPostRequisites(skillId);
  const chain = posts.map(p => p.id);
  for (const p of posts) {
    chain.push(...getAfmPostRequisiteChain(p.id, visited));
  }
  return [...new Set(chain)];
};

export default AFM_SKILLS;
