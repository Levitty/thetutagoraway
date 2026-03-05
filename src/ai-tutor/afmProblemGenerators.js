// ============================================================================
// AFM PROBLEM GENERATORS — ACCA Advanced Financial Management (P4)
// Every skill gets a generator returning { question, answer, accepts?, hint?, workedExample? }
// workedExample: { problem, steps[], solution } for KP-based lessons
// ============================================================================

import { AFM_SKILLS } from './afmKnowledgeGraph.js';

// ==================== HELPERS ====================
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, dp) => Number(n.toFixed(dp));
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Weighted random choice (for MCQ answer positions)
const weightedPick = (items, weights) => {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
};

const makeWorkedExample = (problem, steps, solution) => ({ problem, steps, solution });

// ==================== GENERATORS ====================

const generators = {
  // ======================== FOUNDATION (Grade 1) ========================

  AFM_COST_OF_EQUITY_INTRO: () => {
    const rf = roundTo(rand(25, 40) / 10, 2); // Risk-free rate 2.5% - 4.0%
    const rm = roundTo(rand(80, 120) / 10, 2); // Market return 8% - 12%
    const beta = roundTo(rand(80, 150) / 100, 2); // Beta 0.8 - 1.5
    const ke = roundTo(rf + beta * (rm - rf), 2);
    return {
      question: `Calculate the cost of equity using CAPM. Risk-free rate = ${rf.toFixed(1)}%, Market return = ${rm.toFixed(1)}%, Beta = ${beta.toFixed(2)}.`,
      answer: ke.toFixed(2),
      accepts: [ke.toFixed(2), `${ke.toFixed(2)}%`, ke.toString()],
      hint: 'Cost of Equity = Rf + β(Rm - Rf)',
      workedExample: makeWorkedExample(
        'Calculate cost of equity: Rf = 3%, Rm = 10%, β = 1.2',
        ['Cost of Equity = Rf + β(Rm - Rf)', 'Cost of Equity = 3% + 1.2(10% - 3%)', 'Cost of Equity = 3% + 1.2 × 7%', 'Cost of Equity = 3% + 8.4% = 11.4%'],
        '11.4%'
      )
    };
  },

  AFM_CAPM_INTRO: () => {
    const rf = roundTo(rand(25, 40) / 10, 2);
    const marketPremium = roundTo(rand(50, 80) / 10, 2);
    const beta = roundTo(rand(80, 120) / 100, 2);
    const ke = roundTo(rf + beta * marketPremium, 2);
    return {
      question: `Using CAPM: Risk-free rate = ${rf.toFixed(1)}%, Market risk premium = ${marketPremium.toFixed(1)}%, Beta = ${beta.toFixed(2)}. What is the required return?`,
      answer: ke.toFixed(2),
      accepts: [ke.toFixed(2), `${ke.toFixed(2)}%`],
      hint: 'Required Return = Risk-free Rate + (Beta × Market Risk Premium)'
    };
  },

  AFM_BETA_BASICS: () => {
    const equity = rand(40, 80); // Market cap
    const debt = rand(20, 50);
    const beta_equity = roundTo(rand(90, 130) / 100, 2);
    const beta_ungeared = roundTo(beta_equity / (1 + (debt / equity) * 0.75), 2); // Simplified
    return {
      question: `A company has equity value £${equity}M, debt £${debt}M, and levered beta ${beta_equity.toFixed(2)}. Calculate ungeared beta (assume tax = 25%).`,
      answer: beta_ungeared.toFixed(2),
      accepts: [beta_ungeared.toFixed(2), beta_ungeared.toString()],
      hint: 'Ungeared Beta = Levered Beta / [1 + (1-Tax) × (Debt/Equity)]'
    };
  },

  AFM_RISK_PREMIUM: () => {
    const rm = roundTo(rand(90, 110) / 10, 2);
    const rf = roundTo(rand(25, 35) / 10, 2);
    const premium = roundTo(rm - rf, 2);
    return {
      question: `Market return is ${rm.toFixed(1)}%, risk-free rate is ${rf.toFixed(1)}%. What is the market risk premium?`,
      answer: premium.toFixed(2),
      accepts: [premium.toFixed(2), `${premium.toFixed(2)}%`],
      hint: 'Market Risk Premium = Market Return - Risk-Free Rate'
    };
  },

  AFM_COST_OF_DEBT: () => {
    const ytm = roundTo(rand(30, 60) / 10, 2); // YTM 3% - 6%
    const tax = rand(15, 35);
    const kd_after = roundTo(ytm * (1 - tax / 100), 2);
    return {
      question: `A bond has YTM of ${ytm.toFixed(1)}%. Tax rate is ${tax}%. Calculate after-tax cost of debt.`,
      answer: kd_after.toFixed(2),
      accepts: [kd_after.toFixed(2), `${kd_after.toFixed(2)}%`],
      hint: 'After-tax Cost of Debt = YTM × (1 - Tax Rate)',
      workedExample: makeWorkedExample(
        'YTM = 5%, Tax = 20%. Calculate after-tax cost of debt.',
        ['After-tax Cost = 5% × (1 - 0.20)', 'After-tax Cost = 5% × 0.80 = 4%'],
        '4%'
      )
    };
  },

  AFM_PREFERENCE_SHARES: () => {
    const dividend = rand(40, 80);
    const marketPrice = rand(800, 1200);
    const kp = roundTo((dividend / marketPrice) * 100, 2);
    return {
      question: `Preference share dividend = £${dividend}, market price = £${marketPrice}. Calculate cost of preference shares.`,
      answer: kp.toFixed(2),
      accepts: [kp.toFixed(2), `${kp.toFixed(2)}%`],
      hint: 'Cost of Preference Shares = Annual Dividend / Market Price'
    };
  },

  AFM_WACC_BASICS: () => {
    const equity = rand(50, 100);
    const debt = rand(20, 60);
    const total = equity + debt;
    const we = roundTo((equity / total) * 100, 1);
    const wd = roundTo((debt / total) * 100, 1);
    const ke = roundTo(rand(80, 120) / 10, 2);
    const kd = roundTo(rand(30, 60) / 10, 2);
    const tax = 25;
    const wacc = roundTo((we / 100) * ke + (wd / 100) * kd * (1 - tax / 100), 2);
    return {
      question: `WACC calculation: Equity = £${equity}M, Debt = £${debt}M. Cost of equity = ${ke.toFixed(1)}%, Cost of debt = ${kd.toFixed(1)}%, Tax = ${tax}%. Calculate WACC.`,
      answer: wacc.toFixed(2),
      accepts: [wacc.toFixed(2), `${wacc.toFixed(2)}%`],
      hint: 'WACC = (E/V)×Ke + (D/V)×Kd×(1-Tax)',
      workedExample: makeWorkedExample(
        'Equity = £60M, Debt = £40M, Ke = 12%, Kd = 6%, Tax = 25%',
        ['V = 60 + 40 = £100M', 'E/V = 60/100 = 0.6, D/V = 40/100 = 0.4', 'After-tax Kd = 6% × (1 - 0.25) = 4.5%', 'WACC = 0.6 × 12% + 0.4 × 4.5% = 7.2% + 1.8% = 9%'],
        '9%'
      )
    };
  },

  AFM_TAX_SHIELD: () => {
    const debt = rand(50, 150);
    const kd = roundTo(rand(40, 70) / 10, 2);
    const tax = rand(20, 30);
    const shield = roundTo((debt * kd * tax) / 100, 2);
    return {
      question: `Debt = £${debt}M, Cost of debt = ${kd.toFixed(1)}%, Tax rate = ${tax}%. What is the annual tax shield?`,
      answer: shield.toFixed(2),
      accepts: [shield.toFixed(2), `£${shield.toFixed(2)}M`],
      hint: 'Tax Shield = Debt × Cost of Debt × Tax Rate'
    };
  },

  AFM_TVM_INTRO: () => {
    const pv = rand(5000, 20000);
    const rate = rand(30, 80) / 10;
    const years = rand(3, 8);
    const fv = roundTo(pv * Math.pow(1 + rate / 100, years), 2);
    return {
      question: `Principal = £${pv}, interest rate = ${rate.toFixed(1)}%, years = ${years}. Calculate future value.`,
      answer: roundTo(fv, 0).toString(),
      accepts: [roundTo(fv, 0).toString(), roundTo(fv, 2).toString()],
      hint: 'FV = PV × (1 + r)ⁿ',
      workedExample: makeWorkedExample(
        'PV = £10,000, r = 5%, n = 4 years',
        ['FV = 10,000 × (1.05)⁴', 'FV = 10,000 × 1.2155 = £12,155'],
        '12155'
      )
    };
  },

  AFM_NPV_FUNDAMENTALS: () => {
    const cf0 = -rand(100, 300);
    const cf1 = rand(50, 150);
    const cf2 = rand(60, 160);
    const cf3 = rand(70, 170);
    const discount = rand(80, 120) / 10;
    const r = 1 + discount / 100;
    const npv = roundTo(cf0 + cf1 / r + cf2 / (r * r) + cf3 / (r * r * r), 2);
    return {
      question: `Calculate NPV. Initial investment = £${Math.abs(cf0)}000. Cash flows: Year 1 = £${cf1}000, Year 2 = £${cf2}000, Year 3 = £${cf3}000. Discount rate = ${discount.toFixed(1)}%.`,
      answer: npv.toFixed(0),
      accepts: [npv.toFixed(0), npv.toFixed(2)],
      hint: 'NPV = CF₀ + CF₁/(1+r) + CF₂/(1+r)² + ...',
      workedExample: makeWorkedExample(
        'Initial cost = £100,000. CFs: Y1=£60,000, Y2=£50,000. r=10%',
        ['PV(Y1) = 60,000 / 1.1 = £54,545', 'PV(Y2) = 50,000 / 1.21 = £41,322', 'NPV = -100,000 + 54,545 + 41,322 = -£4,133 (negative = reject)'],
        '-4133'
      )
    };
  },

  AFM_DISCOUNT_RATE: () => {
    const scenario = rand(0, 2);
    const rates = [
      {
        q: 'A company invests in a new production facility with similar risk to existing operations. Should discount rate be WACC, cost of equity, or cost of debt?',
        a: 'WACC'
      },
      {
        q: 'A project is 100% equity-financed. Which rate should be used for NPV calculation?',
        a: 'Cost of equity'
      },
      {
        q: 'A risk-free government bond investment. Which discount rate?',
        a: 'Risk-free rate'
      }
    ];
    const q = rates[scenario];
    return {
      question: q.q,
      answer: q.a,
      hint: 'Discount rate should match the risk profile of cash flows'
    };
  },

  AFM_IRR_BASICS: () => {
    const cf0 = -rand(100, 250);
    const cf1 = rand(60, 140);
    const cf2 = rand(70, 150);
    return {
      question: `Estimate IRR using trial and error. Initial investment = £${Math.abs(cf0)}000. Year 1 = £${cf1}000, Year 2 = £${cf2}000. Is IRR closer to 10%, 15%, or 20%?`,
      answer: '15%',
      accepts: ['15%', '15', 'b'],
      hint: 'IRR is the discount rate where NPV = 0. Try different rates.'
    };
  },

  AFM_PAYBACK_PERIOD: () => {
    const cf0 = rand(100, 250);
    const cf1 = rand(40, 80);
    const cf2 = rand(50, 90);
    const cf3 = rand(60, 100);
    const cumulative2 = cf1 + cf2;
    const payback = cumulative2 >= cf0 ? 2 : roundTo(2 + (cf0 - cumulative2) / cf3, 2);
    return {
      question: `Payback period. Investment = £${cf0}000. CFs: Y1=£${cf1}000, Y2=£${cf2}000, Y3=£${cf3}000. Calculate payback period.`,
      answer: payback.toFixed(2),
      accepts: [payback.toFixed(2), payback.toString()],
      hint: 'Payback = Time to recover initial investment'
    };
  },

  AFM_PROFITABILITY_INDEX: () => {
    const cf0 = rand(100, 250);
    const cf1 = rand(60, 120);
    const cf2 = rand(70, 130);
    const cf3 = rand(80, 140);
    const discount = 10;
    const r = 1.1;
    const pv_inflows = roundTo(cf1 / r + cf2 / (r * r) + cf3 / (r * r * r), 0);
    const pi = roundTo(pv_inflows / cf0, 2);
    return {
      question: `Initial investment = £${cf0}000. PV of inflows = £${pv_inflows}000. Calculate profitability index.`,
      answer: pi.toFixed(2),
      accepts: [pi.toFixed(2), pi.toString()],
      hint: 'Profitability Index = PV of Inflows / Initial Investment'
    };
  },

  AFM_FINANCIAL_RATIOS_INTRO: () => {
    const scenario = rand(0, 2);
    const ratios = [
      { q: 'Revenue = £500M, Total Assets = £400M. Calculate asset turnover.', a: '1.25' },
      { q: 'Net Profit = £80M, Revenue = £400M. Calculate profit margin.', a: '20%' },
      { q: 'EBIT = £100M, Interest = £20M. Calculate interest coverage.', a: '5' }
    ];
    const r = ratios[scenario];
    return {
      question: r.q,
      answer: r.a,
      hint: 'Ratios analyze financial performance and efficiency'
    };
  },

  AFM_LIQUIDITY_ANALYSIS: () => {
    const ca = rand(400, 800);
    const cl = rand(200, 400);
    const inventory = rand(100, 250);
    const current = roundTo(ca / cl, 2);
    const quick = roundTo((ca - inventory) / cl, 2);
    return {
      question: `Current assets = £${ca}M, Current liabilities = £${cl}M, Inventory = £${inventory}M. Calculate current ratio and quick ratio.`,
      answer: `Current: ${current.toFixed(2)}, Quick: ${quick.toFixed(2)}`,
      accepts: [`${current.toFixed(2)}, ${quick.toFixed(2)}`],
      hint: 'Current Ratio = CA/CL, Quick Ratio = (CA - Inventory) / CL'
    };
  },

  AFM_SOLVENCY_ANALYSIS: () => {
    const debt = rand(200, 500);
    const equity = rand(300, 700);
    const total = debt + equity;
    const debtRatio = roundTo((debt / total) * 100, 1);
    const debtEquity = roundTo(debt / equity, 2);
    return {
      question: `Total debt = £${debt}M, Equity = £${equity}M. Calculate debt ratio and debt-to-equity ratio.`,
      answer: `Debt ratio: ${debtRatio.toFixed(1)}%, D/E: ${debtEquity.toFixed(2)}`,
      hint: 'Debt Ratio = Debt / Total Assets, D/E = Debt / Equity'
    };
  },

  AFM_PROFITABILITY_ANALYSIS: () => {
    const ni = rand(50, 150);
    const equity = rand(500, 1500);
    const assets = rand(800, 2000);
    const roe = roundTo((ni / equity) * 100, 1);
    const roa = roundTo((ni / assets) * 100, 1);
    return {
      question: `Net income = £${ni}M, Equity = £${equity}M, Total assets = £${assets}M. Calculate ROE and ROA.`,
      answer: `ROE: ${roe.toFixed(1)}%, ROA: ${roa.toFixed(1)}%`,
      hint: 'ROE = Net Income / Equity, ROA = Net Income / Total Assets'
    };
  },

  AFM_GOVERNANCE_INTRO: () => {
    const options = [
      { q: 'What is the primary purpose of corporate governance?', opts: 'A) Maximize shareholder wealth\nB) Ensure management accountability\nC) Reduce operational costs\nD) Minimize tax burden', ans: 'B' },
      { q: 'Which body is responsible for setting corporate governance standards?', opts: 'A) Internal audit\nB) Board of directors\nC) Finance team\nD) External auditors', ans: 'B' }
    ];
    const o = pick(options);
    return {
      question: `${o.q}\n\n${o.opts}`,
      answer: o.ans,
      hint: 'Corporate governance is about accountability, transparency, and ethical conduct'
    };
  },

  AFM_ETHICAL_FRAMEWORK: () => {
    return {
      question: 'Which of the following is NOT a pillar of ACCA\'s ethical framework?\n\nA) Integrity\nB) Professionalism\nC) Confidentiality\nD) Profitability',
      answer: 'D',
      hint: 'The five pillars are: Integrity, Objectivity, Professional Competence, Confidentiality, Professional Behavior'
    };
  },

  AFM_AGENCY_THEORY: () => {
    return {
      question: 'Agency theory addresses the conflict between whom?\n\nA) Managers and employees\nB) Managers (agents) and shareholders (principals)\nC) Creditors and debtors\nD) Suppliers and customers',
      answer: 'B',
      hint: 'Agency costs arise when management interests diverge from shareholder interests'
    };
  },

  AFM_STAKEHOLDER_ANALYSIS: () => {
    const scenario = rand(0, 1);
    if (scenario === 0) {
      return {
        question: 'In M&A, list three key stakeholder groups that should be considered in the analysis.',
        answer: 'Shareholders, employees, creditors',
        accepts: ['Shareholders, employees, creditors', 'Shareholders, employees, customers', 'Any three valid groups']
      };
    } else {
      return {
        question: 'Which stakeholder group typically has the highest priority in UK corporate decision-making?\n\nA) Employees\nB) Shareholders\nC) Environment\nD) Government',
        answer: 'B',
        hint: 'While other stakeholders matter, shareholder primacy remains dominant in UK law'
      };
    }
  },

  AFM_TREASURY_INTRO: () => {
    return {
      question: 'What is the PRIMARY objective of the treasury function?\n\nA) Maximize profits\nB) Manage liquidity and financial risks\nC) Reduce taxes\nD) Increase revenue',
      answer: 'B',
      hint: 'Treasury manages cash, funding, and hedging of financial risks'
    };
  },

  AFM_MONEY_MARKET_INTRO: () => {
    const rate = roundTo(rand(20, 40) / 10, 2);
    const principal = rand(1000, 5000);
    const days = rand(30, 180);
    const interest = roundTo((principal * rate * days) / (360 * 100), 2);
    return {
      question: `Treasury bill: Principal = £${principal}000, rate = ${rate.toFixed(1)}%, term = ${days} days. Calculate interest.`,
      answer: interest.toFixed(2),
      accepts: [interest.toFixed(2), `£${interest.toFixed(2)}000`],
      hint: 'Interest = Principal × Rate × (Days / 360)'
    };
  },

  // ======================== INTERMEDIATE (Grade 2) ========================

  AFM_CAPM_ADVANCED: () => {
    const rf = roundTo(rand(25, 35) / 10, 2);
    const rm = roundTo(rand(90, 110) / 10, 2);
    const beta = roundTo(rand(100, 150) / 100, 2);
    const company = rand(1, 3);
    let factor = 1;
    if (company === 2) factor = 1.3; // Small cap premium
    const adjusted_ke = roundTo(rf + (beta * factor) * (rm - rf), 2);
    return {
      question: `CAPM with size adjustment. Rf = ${rf.toFixed(1)}%, Rm = ${rm.toFixed(1)}%, β = ${beta.toFixed(2)}. Small-cap premium factor = ${factor}. Calculate adjusted Ke.`,
      answer: adjusted_ke.toFixed(2),
      accepts: [adjusted_ke.toFixed(2), `${adjusted_ke.toFixed(2)}%`],
      hint: 'Adjusted Ke = Rf + (β × Size Factor) × (Rm - Rf)'
    };
  },

  AFM_UNGEARING_GEARING: () => {
    const levered_beta = roundTo(rand(110, 160) / 100, 2);
    const debt_equity = roundTo(rand(30, 70) / 100, 2);
    const tax = 25;
    const unlevered_beta = roundTo(levered_beta / (1 + (1 - tax / 100) * debt_equity), 2);
    const new_de = roundTo(rand(40, 80) / 100, 2);
    const new_levered = roundTo(unlevered_beta * (1 + (1 - tax / 100) * new_de), 2);
    return {
      question: `Ungear then regear beta. Current β = ${levered_beta.toFixed(2)}, D/E = ${debt_equity.toFixed(2)}, Tax = ${tax}%. If acquiring company has D/E = ${new_de.toFixed(2)}, what is new levered β?`,
      answer: new_levered.toFixed(2),
      accepts: [new_levered.toFixed(2)],
      hint: 'Unlevered β = β_lev / [1 + (1-T)(D/E)], then Relevered β = β_unlev × [1 + (1-T)(D/E)_new]',
      workedExample: makeWorkedExample(
        'β_lev = 1.4, D/E = 0.5, Tax = 20%. New D/E = 0.8',
        ['Unlevered β = 1.4 / [1 + 0.8 × 0.5] = 1.4 / 1.4 = 1.0', 'Relevered β = 1.0 × [1 + 0.8 × 0.8] = 1.0 × 1.64 = 1.64'],
        '1.64'
      )
    };
  },

  AFM_WACC_ADVANCED: () => {
    const equity = rand(100, 300);
    const debt = rand(50, 150);
    const total = equity + debt;
    const ke = roundTo(rand(100, 150) / 10, 2);
    const kd = roundTo(rand(40, 80) / 10, 2);
    const tax = rand(15, 30);
    const flotation = roundTo(rand(10, 30) / 10, 2);
    const we = equity / total;
    const wd = debt / total;
    const wacc_base = roundTo(we * ke + wd * kd * (1 - tax / 100), 2);
    const wacc_adjusted = roundTo(wacc_base + (we * flotation / 100), 2);
    return {
      question: `WACC with flotation costs. E = £${equity}M, D = £${debt}M, Ke = ${ke.toFixed(1)}%, Kd = ${kd.toFixed(1)}%, Tax = ${tax}%, Flotation cost = ${flotation.toFixed(1)}%. Calculate adjusted WACC.`,
      answer: wacc_adjusted.toFixed(2),
      accepts: [wacc_adjusted.toFixed(2), `${wacc_adjusted.toFixed(2)}%`],
      hint: 'WACC = (E/V)×Ke + (D/V)×Kd×(1-T) + Flotation adjustment'
    };
  },

  AFM_FLOTATION_COSTS: () => {
    const issue_size = rand(50, 200);
    const flotation_percent = rand(2, 8);
    const flotation_cost = roundTo((issue_size * flotation_percent) / 100, 2);
    return {
      question: `New equity issue = £${issue_size}M. Flotation costs = ${flotation_percent}%. Calculate flotation cost.`,
      answer: flotation_cost.toFixed(2),
      accepts: [flotation_cost.toFixed(2), `£${flotation_cost.toFixed(2)}M`],
      hint: 'Flotation Cost = Issue Size × Flotation Rate'
    };
  },

  AFM_DIVIDEND_GROWTH_MODEL: () => {
    const d0 = roundTo(rand(20, 60) / 100, 2);
    const g = roundTo(rand(30, 60) / 10, 2);
    const r = roundTo(rand(80, 130) / 10, 2);
    const d1 = roundTo(d0 * (1 + g / 100), 2);
    const pe = roundTo(d1 / ((r - g) / 100), 2);
    return {
      question: `DGM: Latest dividend = £${d0.toFixed(2)}, growth rate = ${g.toFixed(1)}%, required return = ${r.toFixed(1)}%. Calculate equity value per share.`,
      answer: pe.toFixed(2),
      accepts: [pe.toFixed(2), `£${pe.toFixed(2)}`],
      hint: 'P₀ = D₁ / (r - g), where D₁ = D₀(1 + g)',
      workedExample: makeWorkedExample(
        'D₀ = £0.50, g = 5%, r = 10%',
        ['D₁ = 0.50 × 1.05 = £0.525', 'P₀ = 0.525 / (0.10 - 0.05) = 0.525 / 0.05 = £10.50'],
        '10.50'
      )
    };
  },

  AFM_COST_OF_EQUITY_ADV: () => {
    const rf = roundTo(rand(25, 35) / 10, 2);
    const rm = roundTo(rand(90, 110) / 10, 2);
    const beta = roundTo(rand(90, 140) / 100, 2);
    const size_premium = roundTo(rand(10, 30) / 10, 2);
    const country_premium = roundTo(rand(10, 30) / 10, 2);
    const ke = roundTo(rf + beta * (rm - rf) + size_premium + country_premium, 2);
    return {
      question: `Multi-factor model: Rf = ${rf.toFixed(1)}%, Rm = ${rm.toFixed(1)}%, β = ${beta.toFixed(2)}, Size premium = ${size_premium.toFixed(1)}%, Country premium = ${country_premium.toFixed(1)}%. Calculate Ke.`,
      answer: ke.toFixed(2),
      accepts: [ke.toFixed(2), `${ke.toFixed(2)}%`],
      hint: 'Ke = Rf + β(Rm - Rf) + Size Premium + Country Premium'
    };
  },

  AFM_NPV_SENSITIVITY: () => {
    const base_npv = rand(50, 200);
    const revenue_sensitivity = roundTo(rand(10, 30) / 10, 2);
    const change = 10;
    const new_npv = roundTo(base_npv - (base_npv * revenue_sensitivity * change) / 100, 2);
    return {
      question: `Base case NPV = £${base_npv}M. Revenue has sensitivity of ${revenue_sensitivity.toFixed(2)}. If revenue falls 10%, what is new NPV?`,
      answer: new_npv.toFixed(2),
      accepts: [new_npv.toFixed(2), `£${new_npv.toFixed(2)}M`],
      hint: 'Change in NPV = Base NPV × Sensitivity × % Change'
    };
  },

  AFM_NPV_SCENARIO: () => {
    const optimistic_npv = rand(150, 300);
    const base_npv = rand(50, 150);
    const pessimistic_npv = rand(-100, 50);
    const expected_npv = roundTo((optimistic_npv * 0.25 + base_npv * 0.5 + pessimistic_npv * 0.25), 0);
    return {
      question: `Scenario analysis: Optimistic NPV = £${optimistic_npv}M (25% prob), Base = £${base_npv}M (50%), Pessimistic = £${pessimistic_npv}M (25%). Calculate expected NPV.`,
      answer: expected_npv.toString(),
      accepts: [expected_npv.toString(), roundTo(expected_npv, 2).toString()],
      hint: 'Expected NPV = Σ(NPV × Probability)'
    };
  },

  AFM_NPV_SIMULATION: () => {
    const variables = ['revenue', 'costs', 'discount rate'];
    const selected = pick(variables);
    return {
      question: `Monte Carlo simulation: Which variable would have the greatest impact on project NPV: ${selected} or project life?`,
      answer: 'Discount rate',
      hint: 'Discount rate (or project life) typically has highest sensitivity in NPV'
    };
  },

  AFM_EVA_ANALYSIS: () => {
    const nopat = rand(100, 300);
    const invested_capital = rand(500, 1500);
    const wacc = roundTo(rand(70, 100) / 10, 2);
    const eva = roundTo(nopat - (invested_capital * wacc) / 100, 0);
    return {
      question: `EVA calculation: NOPAT = £${nopat}M, Invested Capital = £${invested_capital}M, WACC = ${wacc.toFixed(1)}%. Calculate EVA.`,
      answer: eva.toString(),
      accepts: [eva.toString()],
      hint: 'EVA = NOPAT - (Invested Capital × WACC)',
      workedExample: makeWorkedExample(
        'NOPAT = £80M, Capital = £500M, WACC = 10%',
        ['Cost of Capital = 500M × 10% = £50M', 'EVA = 80M - 50M = £30M'],
        '30'
      )
    };
  },

  AFM_MONTE_CARLO: () => {
    return {
      question: 'What is the key advantage of Monte Carlo simulation over sensitivity analysis?\n\nA) It is faster\nB) It considers probability distributions for multiple variables simultaneously\nC) It requires fewer assumptions\nD) It always produces accurate results',
      answer: 'B',
      hint: 'Monte Carlo samples from probability distributions to model complex interactions'
    };
  },

  AFM_REAL_OPTIONS_INTRO: () => {
    return {
      question: 'A project has an NPV of -£50M at current market conditions but value may increase if oil prices rise. This illustrates:\n\nA) Abandonment option\nB) Expansion option\nC) Waiting option\nD) Switching option',
      answer: 'C',
      hint: 'The waiting option has value when future uncertainty is high'
    };
  },

  AFM_EXPANSION_OPTIONS: () => {
    const phase1_npv = rand(50, 150);
    const phase2_value = rand(200, 400);
    const total_value = phase1_npv + phase2_value;
    return {
      question: `Phase 1 NPV = £${phase1_npv}M. If successful, Phase 2 can generate additional value of £${phase2_value}M. Expansion option value is reflected in higher total value of:`,
      answer: roundTo(phase1_npv + phase2_value, 0).toString(),
      hint: 'Real options add value beyond traditional DCF by allowing management flexibility'
    };
  },

  AFM_TIMING_OPTIONS: () => {
    const npv_now = rand(-50, 50);
    const npv_future = rand(100, 200);
    return {
      question: `If NPV of investing now is £${npv_now}M but expected NPV in 2 years is £${npv_future}M, waiting has value. Should the firm wait?`,
      answer: 'Yes' + (npv_future > npv_now * 1.2 ? ' - waiting adds value' : ''),
      hint: 'Timing options involve waiting for better conditions'
    };
  },

  AFM_ASSET_VALUATION: () => {
    const assets = rand(500, 1500);
    const liabilities = rand(200, 600);
    const equity = assets - liabilities;
    return {
      question: `Asset-based valuation: Total assets = £${assets}M, Liabilities = £${liabilities}M. Calculate equity value.`,
      answer: equity.toString(),
      accepts: [equity.toString(), `£${equity}M`],
      hint: 'Asset Value = Assets - Liabilities'
    };
  },

  AFM_PE_MULTIPLE: () => {
    const eps = roundTo(rand(30, 80) / 100, 2);
    const pe = rand(12, 20);
    const fair_value = roundTo(eps * pe, 2);
    return {
      question: `P/E Multiple valuation: EPS = £${eps.toFixed(2)}, Peer P/E ratio = ${pe}x. Calculate fair value per share.`,
      answer: fair_value.toFixed(2),
      accepts: [fair_value.toFixed(2), `£${fair_value.toFixed(2)}`],
      hint: 'Fair Value = EPS × P/E Multiple',
      workedExample: makeWorkedExample(
        'EPS = £0.75, Comparable P/E = 16x',
        ['Fair Value = 0.75 × 16 = £12.00'],
        '12.00'
      )
    };
  },

  AFM_DCF_VALUATION: () => {
    const fcf1 = rand(50, 150);
    const fcf2 = rand(60, 160);
    const fcf3 = rand(70, 170);
    const fcf4 = rand(80, 180);
    const fcf5 = rand(90, 190);
    const growth = rand(20, 40) / 10;
    const wacc = rand(70, 100) / 10;
    const terminal_value = roundTo((fcf5 * (1 + growth / 100)) / ((wacc - growth) / 100), 0);
    const r = 1 + wacc / 100;
    const pv_fcf = roundTo(fcf1 / r + fcf2 / (r * r) + fcf3 / (r * r * r) + fcf4 / (r * r * r * r) + fcf5 / (r * r * r * r * r), 0);
    const pv_terminal = roundTo(terminal_value / (r * r * r * r * r), 0);
    const enterprise_value = pv_fcf + pv_terminal;
    return {
      question: `DCF Valuation: FCF Y1-5: £${fcf1}M, £${fcf2}M, £${fcf3}M, £${fcf4}M, £${fcf5}M. Perpetual growth = ${growth.toFixed(1)}%, WACC = ${wacc.toFixed(1)}%. Calculate enterprise value.`,
      answer: enterprise_value.toString(),
      accepts: [enterprise_value.toString()],
      hint: 'EV = Σ[FCF / (1+WACC)ⁿ] + Terminal Value / (1+WACC)ⁿ',
      workedExample: makeWorkedExample(
        'FCF = £100M/year, g = 3%, WACC = 8%, 5-year explicit period',
        ['Terminal Value = 100 × 1.03 / (0.08 - 0.03) = £2,060M', 'PV(Terminal) = 2,060 / 1.08⁵ = £1,401M', 'Enterprise Value ≈ PV(FCFs) + PV(Terminal)'],
        '~1500'
      )
    };
  },

  AFM_DIVIDEND_VALUATION: () => {
    const d1 = roundTo(rand(20, 60) / 100, 2);
    const g = roundTo(rand(25, 45) / 10, 2);
    const ke = roundTo(rand(100, 140) / 10, 2);
    const value = roundTo(d1 / ((ke - g) / 100), 2);
    return {
      question: `Dividend discount model: D1 = £${d1.toFixed(2)}, g = ${g.toFixed(1)}%, Ke = ${ke.toFixed(1)}%. Calculate value.`,
      answer: value.toFixed(2),
      accepts: [value.toFixed(2), `£${value.toFixed(2)}`],
      hint: 'V = D1 / (Ke - g)'
    };
  },

  AFM_MA_STRATEGY: () => {
    const strategies = [
      { q: 'What is the PRIMARY strategic reason for horizontal integration?\n\nA) Eliminate competition and gain market power\nB) Improve operational efficiency\nC) Access new markets\nD) Reduce supply chain risk', a: 'A' },
      { q: 'Vertical integration typically aims to:\n\nA) Reduce costs through economies of scale\nB) Control supply chain and improve margins\nC) Diversify risk\nD) Increase shareholder diversity', a: 'B' }
    ];
    const s = pick(strategies);
    return {
      question: s.q,
      answer: s.a,
      hint: 'M&A strategy depends on market position and value creation opportunities'
    };
  },

  AFM_SYNERGY_TYPES: () => {
    const scenario = rand(0, 2);
    if (scenario === 0) {
      return {
        question: 'Which is a REVENUE synergy?\n\nA) Reduced COGS through combined purchasing\nB) Cross-selling to combined customer base\nC) Eliminated duplicate management\nD) Consolidated head office',
        answer: 'B'
      };
    } else if (scenario === 1) {
      return {
        question: 'Which is a COST synergy?\n\nA) New market access\nB) Increased pricing power\nC) Consolidated head office saving £50M\nD) Cross-selling opportunities',
        answer: 'C'
      };
    } else {
      return {
        question: 'What is financial synergy in M&A?\n\nA) Improved working capital management\nB) Lower tax burden\nC) Better financing costs\nD) All of the above',
        answer: 'D'
      };
    }
  },

  AFM_SYNERGY_VALUATION: () => {
    const revenue_synergy = rand(20, 60);
    const cost_synergy = rand(30, 80);
    const tax = 25;
    const total_synergy_pv = roundTo((revenue_synergy + cost_synergy) * (1 - tax / 100) * 8, 0);
    return {
      question: `M&A synergies: Revenue synergy £${revenue_synergy}M, Cost synergy £${cost_synergy}M annually. Tax = ${tax}%, 8-year evaluation period. Calculate PV of synergies.`,
      answer: total_synergy_pv.toString(),
      accepts: [total_synergy_pv.toString()],
      hint: 'Synergy Value ≈ Annual Synergies × (1 - Tax) × Period'
    };
  },

  AFM_FINANCING_ACQUISITION: () => {
    const target_value = rand(200, 500);
    const cash_offer = roundTo(target_value * 0.4, 0);
    const shares_value = roundTo(target_value * 0.6, 0);
    return {
      question: `Mixed acquisition financing: 40% cash (£${cash_offer}M), 60% shares (£${shares_value}M). Which offers better EPS accretion?`,
      answer: 'Share offer',
      hint: 'All-share deals typically provide better EPS accretion for acquirer'
    };
  },

  AFM_BIDDING_STRATEGY: () => {
    const stand_alone = rand(300, 500);
    const synergies = rand(100, 250);
    const max_bid = roundTo(stand_alone + synergies, 0);
    return {
      question: `Bidding strategy: Target stand-alone value = £${stand_alone}M, estimated synergies = £${synergies}M. Maximum bid price should be approximately:`,
      answer: max_bid.toString(),
      accepts: [max_bid.toString(), `£${max_bid}M`],
      hint: 'Max bid = Target value + Share of synergies'
    };
  },

  AFM_FINANCIAL_DISTRESS: () => {
    const indicators = [
      { q: 'Which ratio most directly indicates financial distress?\n\nA) High current ratio\nB) Declining interest coverage\nC) High profit margin\nD) High asset turnover', a: 'B' },
      { q: 'A company has negative free cash flow for 3 consecutive years. This signals:\n\nA) Temporary cash shortage\nB) Potential financial distress\nC) High profitability\nD) Strong growth investment', a: 'B' }
    ];
    const i = pick(indicators);
    return {
      question: i.q,
      answer: i.a,
      hint: 'Financial distress indicators: declining coverage, negative cash, increasing leverage'
    };
  },

  AFM_BANKRUPTCY_MODELS: () => {
    const z_score = roundTo(rand(15, 35) / 10, 2);
    let risk;
    if (z_score < 1.81) risk = 'High bankruptcy risk';
    else if (z_score < 2.99) risk = 'Grey zone';
    else risk = 'Low bankruptcy risk';
    return {
      question: `Altman Z-Score calculation results in Z = ${z_score.toFixed(2)}. What is the bankruptcy risk classification?`,
      answer: risk,
      hint: 'Z < 1.81: High risk, 1.81-2.99: Grey, Z > 2.99: Low risk'
    };
  },

  AFM_RESTRUCTURING: () => {
    return {
      question: 'Corporate restructuring to address financial distress typically involves:\n\nA) Debt refinancing and asset disposal\nB) Operational improvements\nC) Management changes\nD) All of the above',
      answer: 'D',
      hint: 'Turnaround strategies are holistic and multi-faceted'
    };
  },

  AFM_FORWARD_CONTRACTS: () => {
    const spot = roundTo(rand(120, 200) / 100, 4);
    const forward_points = roundTo(rand(50, 150) / 10000, 4);
    const forward_rate = roundTo(spot + forward_points, 4);
    const contract_size = rand(100, 500);
    const gain_loss = roundTo((forward_rate - spot) * contract_size * 100000, 0);
    return {
      question: `Forward contract: Spot rate = £${spot.toFixed(4)}/USD, Forward points = +${forward_points.toFixed(4)}, Contract = ${contract_size}m USD. Calculate 6-month forward rate.`,
      answer: forward_rate.toFixed(4),
      accepts: [forward_rate.toFixed(4)],
      hint: 'Forward Rate = Spot Rate + Forward Points'
    };
  },

  AFM_MONEY_MARKET_HEDGE: () => {
    const amount_usd = rand(10, 50);
    const spot = roundTo(rand(130, 160) / 100, 4);
    const gbp_equivalent = roundTo(amount_usd / spot, 2);
    const uk_rate = roundTo(rand(40, 60) / 10, 2);
    const us_rate = roundTo(rand(30, 50) / 10, 2);
    return {
      question: `MMH: Receivable = $${amount_usd}M in 6 months. Spot = £${spot.toFixed(4)}/USD, UK rate = ${uk_rate.toFixed(1)}%, US rate = ${us_rate.toFixed(1)}%. Borrow in USD or GBP?`,
      answer: 'Borrow in USD',
      hint: 'Borrow in currency of future receipt to naturally hedge'
    };
  },

  AFM_CURRENCY_FUTURES: () => {
    const spot = roundTo(rand(130, 160) / 100, 4);
    const futures = roundTo(spot - rand(50, 150) / 10000, 4);
    const contract_size = 62500;
    const number_contracts = rand(5, 20);
    const hedge_value = roundTo(futures * contract_size * number_contracts, 0);
    return {
      question: `Futures hedge: Spot = £${spot.toFixed(4)}/USD, Futures = £${futures.toFixed(4)}/USD, Contracts = ${number_contracts} (each 62,500 USD). Hedged value = ?`,
      answer: roundTo(hedge_value / 1000000, 0).toString(),
      accepts: [roundTo(hedge_value / 1000000, 0).toString(), `£${roundTo(hedge_value / 1000000, 0)}M`],
      hint: 'Hedged Value = Futures Rate × Contract Size × Number'
    };
  },

  AFM_INTEREST_RATE_FUTURES: () => {
    const contract_value = 100000;
    const current_yield = roundTo(rand(35, 55) / 10, 2);
    const expected_yield = roundTo(rand(40, 60) / 10, 2);
    const yield_change = roundTo(current_yield - expected_yield, 2);
    const contracts = Math.abs(rand(5, 20));
    const basis_point_value = roundTo(contract_value * yield_change / 100, 0);
    return {
      question: `IRF hedge: Bond yield expected to rise from ${current_yield.toFixed(1)}% to ${expected_yield.toFixed(1)}%. Sell ${contracts} contracts to protect position. Basis point value per contract?`,
      answer: roundTo(basis_point_value / contracts, 0).toString(),
      hint: 'IRF loss = Yield change × Contract value / 100'
    };
  },

  AFM_CURRENCY_OPTIONS: () => {
    const call_premium = roundTo(rand(10, 30) / 10000, 4);
    const strike = roundTo(rand(130, 160) / 100, 4);
    const spot = roundTo(strike + rand(20, 50) / 10000, 4);
    const amount = rand(10, 50);
    const exercise_gain = roundTo((spot - strike) * amount * 100000, 0);
    const net_gain = roundTo(exercise_gain - (call_premium * amount * 100000), 0);
    return {
      question: `Currency call option: Strike = £${strike.toFixed(4)}/USD, Premium = £${call_premium.toFixed(4)}, Amount = $${amount}M, Spot at maturity = £${spot.toFixed(4)}/USD. Net gain if exercised?`,
      answer: roundTo(net_gain / 1000000, 2).toString(),
      accepts: [roundTo(net_gain / 1000000, 2).toString()],
      hint: 'Net Gain = (Spot - Strike) × Amount - (Premium × Amount)'
    };
  },

  AFM_INTEREST_RATE_OPTIONS: () => {
    const cap_rate = roundTo(rand(40, 60) / 10, 2);
    const current_rate = roundTo(rand(35, 55) / 10, 2);
    const principal = rand(50, 200);
    const year_1_protection = current_rate > cap_rate ? roundTo((current_rate - cap_rate) * principal / 100, 1) : 0;
    return {
      question: `Interest rate cap: Cap rate = ${cap_rate.toFixed(1)}%, Current rate = ${current_rate.toFixed(1)}%, Principal = £${principal}M. Year 1 cap payoff?`,
      answer: year_1_protection.toFixed(1),
      accepts: [year_1_protection.toFixed(1), `£${year_1_protection.toFixed(1)}M`],
      hint: 'Cap payoff = max(0, Actual Rate - Cap Rate) × Principal'
    };
  },

  AFM_OPTION_VALUATION: () => {
    const stock_price = rand(80, 120);
    const exercise = rand(80, 120);
    const intrinsic = Math.max(0, stock_price - exercise);
    const time_value = roundTo(rand(10, 30) / 10, 2);
    const option_value = roundTo(intrinsic + time_value, 2);
    return {
      question: `Option pricing: Stock = £${stock_price}, Exercise = £${exercise}, Intrinsic = £${intrinsic}, Time value ≈ £${time_value.toFixed(1)}. Call option value?`,
      answer: option_value.toFixed(2),
      accepts: [option_value.toFixed(2), `£${option_value.toFixed(2)}`],
      hint: 'Option Value = Intrinsic Value + Time Value'
    };
  },

  AFM_INTEREST_RATE_SWAPS: () => {
    const fixed_rate = roundTo(rand(35, 55) / 10, 2);
    const floating_rate = roundTo(rand(30, 50) / 10, 2);
    const principal = rand(50, 200);
    const year_1_fixed = roundTo(fixed_rate * principal / 100, 2);
    const year_1_floating = roundTo(floating_rate * principal / 100, 2);
    const spread = roundTo(year_1_floating - year_1_fixed, 2);
    return {
      question: `IRS: Fixed = ${fixed_rate.toFixed(1)}%, Floating = ${floating_rate.toFixed(1)}%, Principal = £${principal}M. Year 1 net cash flow for payer of fixed?`,
      answer: roundTo(-spread, 2).toString(),
      accepts: [roundTo(-spread, 2).toString()],
      hint: 'Fixed-rate payer receives spread if floating > fixed'
    };
  },

  AFM_CURRENCY_SWAPS: () => {
    const gbp_rate = roundTo(rand(35, 55) / 10, 2);
    const usd_rate = roundTo(rand(30, 50) / 10, 2);
    const gbp_principal = rand(50, 150);
    const exchange_rate = roundTo(rand(130, 160) / 100, 4);
    const usd_principal = roundTo(gbp_principal * exchange_rate, 0);
    const gbp_interest = roundTo(gbp_principal * gbp_rate / 100, 2);
    const usd_interest = roundTo(usd_principal * usd_rate / 100, 0);
    return {
      question: `Currency swap: GBP £${gbp_principal}M at ${gbp_rate.toFixed(1)}%, USD $${usd_principal}M at ${usd_rate.toFixed(1)}%. Year 1 GBP interest payment?`,
      answer: gbp_interest.toFixed(2),
      accepts: [gbp_interest.toFixed(2), `£${gbp_interest.toFixed(2)}M`],
      hint: 'Currency swap exchanges principal and interest in different currencies'
    };
  },

  AFM_SWAP_VALUATION: () => {
    const fixed_rate = roundTo(rand(35, 55) / 10, 2);
    const market_fixed = roundTo(rand(35, 55) / 10, 2);
    const principal = rand(100, 300);
    const years = 5;
    const rate_diff = roundTo(fixed_rate - market_fixed, 2);
    const swap_value = roundTo((rate_diff * principal * years) / 100, 2);
    return {
      question: `Swap valuation: Swap fixed rate = ${fixed_rate.toFixed(1)}%, Market fixed = ${market_fixed.toFixed(1)}%, Principal = £${principal}M, 5 years. Approximate swap value?`,
      answer: swap_value.toFixed(2),
      accepts: [swap_value.toFixed(2)],
      hint: 'Swap Value ≈ (Rate Difference × Principal × Remaining Term) / 100'
    };
  },

  // ======================== ADVANCED (Grade 3) ========================

  AFM_INTERNATIONAL_INVESTMENT: () => {
    const fcf_home = rand(50, 150);
    const fcf_foreign = rand(40, 120);
    const spot_rate = roundTo(rand(130, 160) / 100, 4);
    const expected_rate = roundTo(spot_rate * (1 + rand(-5, 5) / 100), 4);
    const fcf_home_currency = roundTo(fcf_foreign / expected_rate * 1000000, 0);
    const total_fcf = fcf_home + fcf_home_currency / 1000000;
    return {
      question: `International investment: Home market FCF = £${fcf_home}M, Foreign FCF = ${fcf_foreign}m local currency, Spot = £${spot_rate.toFixed(4)}, Expected = £${expected_rate.toFixed(4)}. Estimate home currency FCF.`,
      answer: roundTo(fcf_home + fcf_foreign / expected_rate, 0).toString(),
      hint: 'Convert foreign currency to home currency using expected exchange rate'
    };
  },

  AFM_POLITICAL_COUNTRY_RISK: () => {
    return {
      question: 'Which methods are used to assess country risk in international investment?\n\nA) Sovereign credit ratings\nB) Political risk indices\nC) Interest rate spreads on government bonds\nD) All of the above',
      answer: 'D',
      hint: 'Country risk assessment uses multiple data sources'
    };
  },

  AFM_TRANSFER_PRICING: () => {
    const production_cost = rand(80, 120);
    const market_price = rand(100, 150);
    const tax_country_1 = 30;
    const tax_country_2 = 15;
    const profit_allocation = rand(40, 60);
    return {
      question: `Transfer pricing: Cost = £${production_cost}, Market = £${market_price}, Tax rates: High = ${tax_country_1}%, Low = ${tax_country_2}%. To minimize global tax, set transfer price to:`,
      answer: 'Market price',
      hint: 'OECD guidelines require arm\'s length transfer pricing'
    };
  },

  AFM_FOREIGN_CURRENCY_ANALYSIS: () => {
    const current_rate = roundTo(rand(130, 160) / 100, 4);
    const interest_diff = roundTo(rand(-2, 2) / 100, 4);
    const forecast_rate = roundTo(current_rate * (1 + interest_diff), 4);
    return {
      question: `Currency forecasting: Spot = £${current_rate.toFixed(4)}/USD, Interest rate differential = ${(interest_diff * 100).toFixed(1)}%. Expected 6-month forward using IRP?`,
      answer: forecast_rate.toFixed(4),
      accepts: [forecast_rate.toFixed(4)],
      hint: 'Interest Rate Parity: Forward = Spot × (1 + domestic rate) / (1 + foreign rate)'
    };
  },

  AFM_COMPLEX_VALUATION_MA: () => {
    const dcf_value = rand(400, 600);
    const synergies = rand(100, 250);
    const discount_synergies = roundTo(synergies * 0.5, 0);
    const adjusted_value = dcf_value + discount_synergies;
    return {
      question: `M&A valuation: DCF value = £${dcf_value}M, Synergies identified = £${synergies}M. After 50% risk discount, total valuation = ?`,
      answer: adjusted_value.toString(),
      accepts: [adjusted_value.toString()],
      hint: 'Acquisition price = Target value + (Synergies × Risk factor)'
    };
  },

  AFM_EARN_OUT_PROVISIONS: () => {
    const base_price = rand(200, 400);
    const max_earnout = rand(50, 150);
    const performance_target = rand(20, 40);
    const actual_performance = rand(15, 45);
    const earnout_payment = roundTo((actual_performance / performance_target) * max_earnout, 0);
    const total_consideration = base_price + earnout_payment;
    return {
      question: `Earn-out: Base price = £${base_price}M, Max earn-out = £${max_earnout}M, Target performance = £${performance_target}M, Actual = £${actual_performance}M. Total consideration?`,
      answer: total_consideration.toString(),
      accepts: [total_consideration.toString()],
      hint: 'Total = Base price + (Actual / Target × Max Earn-out)'
    };
  },

  AFM_HOSTILE_TAKEOVERS: () => {
    return {
      question: 'Common defence strategies against hostile takeovers include:\n\nA) Poison pills\nB) Golden parachutes\nC) White knights\nD) All of the above',
      answer: 'D',
      hint: 'Hostile defence involves multiple defensive tactics'
    };
  },

  AFM_DUE_DILIGENCE: () => {
    return {
      question: 'Due diligence in M&A typically covers:\n\nA) Financial statements and tax compliance\nB) Legal and regulatory status\nC) Operational and commercial assessment\nD) All of the above',
      answer: 'D',
      hint: 'Comprehensive due diligence reduces acquisition risk'
    };
  },

  AFM_MBO_MBI: () => {
    const company_value = rand(200, 500);
    const equity_investment = roundTo(company_value * 0.2, 0);
    const debt_financing = roundTo(company_value * 0.8, 0);
    const leverage_ratio = roundTo(debt_financing / equity_investment, 2);
    return {
      question: `MBO financing: Company value = £${company_value}M. 20% equity, 80% debt. Debt/Equity ratio = ?`,
      answer: leverage_ratio.toFixed(2),
      accepts: [leverage_ratio.toFixed(2)],
      hint: 'MBOs typically use high leverage to minimize management equity'
    };
  },

  AFM_LEVERAGED_BUYOUT: () => {
    const purchase_price = rand(300, 600);
    const ebitda = roundTo(purchase_price * 0.15, 0);
    const debt_multiple = 4.5;
    const debt_capacity = roundTo(ebitda * debt_multiple, 0);
    const equity_required = roundTo(purchase_price - debt_capacity, 0);
    return {
      question: `LBO: Purchase = £${purchase_price}M, EBITDA = £${ebitda}M. Lender allows 4.5x debt/EBITDA. Equity required?`,
      answer: equity_required.toString(),
      accepts: [equity_required.toString()],
      hint: 'Equity = Purchase Price - (Debt Capacity / Multiple)'
    };
  },

  AFM_DEMERGERS: () => {
    return {
      question: 'A demerger separates a company\'s divisions. Which is NOT a common reason?\n\nA) Unlock shareholder value\nB) Enable independent operations\nC) Focus management expertise\nD) Reduce total company risk',
      answer: 'D',
      hint: 'Demergers create value through separation and focused strategy'
    };
  },

  AFM_JOINT_VENTURES: () => {
    const company_a_value = rand(100, 300);
    const company_b_value = rand(150, 350);
    const jv_investment = rand(50, 150);
    const expected_return = roundTo(jv_investment * 1.5, 0);
    return {
      question: `JV analysis: Partner A invests £${company_a_value}M, Partner B invests £${company_b_value}M in JV. Expect total value = £${expected_return}M. Is JV positive?`,
      answer: 'Yes' + (expected_return > company_a_value + company_b_value ? ' - value creation' : '')
    };
  },

  AFM_CONSOLIDATED_STATEMENTS: () => {
    const parent_equity = rand(500, 1000);
    const subsidiary_equity = rand(200, 500);
    const ownership = rand(50, 100);
    const consolidated_equity = roundTo(parent_equity + (subsidiary_equity * ownership / 100), 0);
    return {
      question: `Consolidation: Parent equity = £${parent_equity}M, Subsidiary = £${subsidiary_equity}M, Ownership = ${ownership}%. Consolidated equity (100% method)?`,
      answer: roundTo(parent_equity + subsidiary_equity, 0).toString(),
      hint: 'Consolidated equity includes 100% of subsidiary assets and liabilities'
    };
  },

  AFM_HEDGE_EFFECTIVENESS: () => {
    return {
      question: 'For a hedge to qualify for hedge accounting, effectiveness must be:\n\nA) Between 80% - 125%\nB) Exactly 100%\nC) Above 90%\nD) Below 80%',
      answer: 'A',
      hint: 'IAS 39/IFRS 9 requires 80-125% effectiveness for hedge accounting'
    };
  },

  AFM_CROSS_CURRENCY_SWAPS: () => {
    const gbp_principal = rand(50, 150);
    const gbp_rate = roundTo(rand(35, 55) / 10, 2);
    const exchange_rate = roundTo(rand(130, 160) / 100, 4);
    const usd_principal = roundTo(gbp_principal * exchange_rate, 0);
    const usd_rate = roundTo(rand(30, 50) / 10, 2);
    const gbp_interest_year1 = roundTo(gbp_principal * gbp_rate / 100, 2);
    const usd_interest_year1 = roundTo(usd_principal * usd_rate / 100, 0);
    return {
      question: `XCS: Exchange £${gbp_principal}M for $${usd_principal}M. GBP interest = ${gbp_rate.toFixed(1)}%, USD = ${usd_rate.toFixed(1)}%. Year 1 GBP cash flow?`,
      answer: gbp_interest_year1.toFixed(2),
      accepts: [gbp_interest_year1.toFixed(2)],
      hint: 'XCS combines currency exchange with interest rate swap'
    };
  },

  AFM_COMPLEX_HEDGING: () => {
    const strategies = [
      { q: 'A company needs to hedge both currency and interest rate risk. Best approach?\n\nA) Sequential hedging\nB) Combined collar + swap\nC) Staggered hedges\nD) All effective depending on cost/benefit', a: 'D' },
      { q: 'Multi-instrument hedging typically uses:\n\nA) Only forwards\nB) Mix of forwards, swaps, options\nC) Only options\nD) Only swaps', a: 'B' }
    ];
    const s = pick(strategies);
    return {
      question: s.q,
      answer: s.a,
      hint: 'Complex hedges match multiple risk exposures'
    };
  },

  AFM_EMBEDDED_DERIVATIVES: () => {
    return {
      question: 'An embedded derivative must be separated if:\n\nA) It is clearly separable from the host contract\nB) The risks are not closely related\nC) Fair value can be reliably measured\nD) All of the above',
      answer: 'D',
      hint: 'IFRS 9 requires separation of embedded derivatives meeting all three conditions'
    };
  },

  AFM_VAR_CALCULATION: () => {
    const portfolio_value = rand(100, 500);
    const daily_volatility = roundTo(rand(10, 30) / 1000, 4);
    const confidence = 1.645; // 95% confidence
    const var_amount = roundTo(portfolio_value * daily_volatility * confidence, 2);
    return {
      question: `VaR (95% confidence): Portfolio = £${portfolio_value}M, Daily volatility = ${(daily_volatility * 100).toFixed(2)}%. Daily VaR ≈?`,
      answer: var_amount.toFixed(2),
      accepts: [var_amount.toFixed(2), `£${var_amount.toFixed(2)}M`],
      hint: 'VaR = Portfolio × Volatility × Z-score (95% = 1.645)'
    };
  },

  AFM_EXPECTED_SHORTFALL: () => {
    const var_amount = rand(5, 20);
    const expected_loss_given_breach = roundTo(var_amount * 1.25, 2);
    return {
      question: `ES calculation: VaR (95%) = £${var_amount}M, Expected loss when breached ≈ £${expected_loss_given_breach.toFixed(1)}M. ES = ?`,
      answer: expected_loss_given_breach.toFixed(2),
      accepts: [expected_loss_given_breach.toFixed(2)],
      hint: 'Expected Shortfall = Average loss beyond VaR threshold'
    };
  },

  AFM_STRESS_TESTING: () => {
    const base_portfolio = rand(100, 500);
    const market_shock = rand(-20, -5);
    const portfolio_loss = roundTo((base_portfolio * Math.abs(market_shock)) / 100, 0);
    return {
      question: `Stress test: Portfolio £${base_portfolio}M. Market falls ${Math.abs(market_shock)}%. Portfolio loss = ?`,
      answer: portfolio_loss.toString(),
      accepts: [portfolio_loss.toString(), `-£${portfolio_loss}M`],
      hint: 'Stress testing models portfolio response to extreme scenarios'
    };
  },

  AFM_CREDIT_RISK: () => {
    return {
      question: 'Credit risk in treasury includes:\n\nA) Counterparty default risk\nB) Settlement risk\nC) Exposure management\nD) All of the above',
      answer: 'D',
      hint: 'Treasury manages multiple dimensions of credit risk'
    };
  },

  AFM_OPERATIONAL_RISK: () => {
    return {
      question: 'Operational risk typically arises from:\n\nA) System failures\nB) Process errors\nC) Fraud and misconduct\nD) All of the above',
      answer: 'D',
      hint: 'Operational risk includes people, processes, and systems'
    };
  },

  AFM_TREASURY_STRATEGY: () => {
    return {
      question: 'Treasury strategic objectives typically include:\n\nA) Optimize funding costs\nB) Manage liquidity\nC) Hedge financial risks\nD) All of the above',
      answer: 'D',
      hint: 'Treasury strategy balances cost, liquidity, and risk'
    };
  },

  AFM_LIQUIDITY_MANAGEMENT: () => {
    const cash_inflows = rand(100, 300);
    const cash_outflows = rand(80, 250);
    const minimum_balance = rand(30, 80);
    const operating_balance = roundTo(cash_inflows - cash_outflows, 0);
    const required_balance = roundTo(operating_balance + minimum_balance, 0);
    return {
      question: `Liquidity: Inflows £${cash_inflows}M, Outflows £${cash_outflows}M, Min balance required £${minimum_balance}M. Total required balance?`,
      answer: required_balance.toString(),
      accepts: [required_balance.toString()],
      hint: 'Required balance = Operating balance + Minimum buffer'
    };
  },

  AFM_FUNDING_STRATEGIES: () => {
    return {
      question: 'Optimal debt structure typically balances:\n\nA) Cost of capital minimization\nB) Financial flexibility\nC) Debt covenant compliance\nD) All of the above',
      answer: 'D',
      hint: 'Funding strategy is multi-dimensional optimization'
    };
  },

  AFM_PROFESSIONAL_JUDGMENT: () => {
    return {
      question: 'When applying professional judgment to complex M&A valuations, accountants must prioritize:\n\nA) Shareholder value maximization only\nB) All stakeholder interests within ethical frameworks\nC) Cost minimization\nD) Tax efficiency',
      answer: 'B',
      hint: 'Professional judgment requires ethical consideration of multiple perspectives'
    };
  },

  AFM_STAKEHOLDER_MANAGEMENT: () => {
    return {
      question: 'In M&A, stakeholder communication is critical to:\n\nA) Secure employee commitment\nB) Maintain customer relationships\nC) Build market confidence\nD) All of the above',
      answer: 'D',
      hint: 'Successful M&A requires effective stakeholder engagement'
    };
  }
};

// ==================== MAIN EXPORT ====================

export const generateAfmProblem = (skillId) => {
  const gen = generators[skillId];
  if (!gen) {
    const skill = AFM_SKILLS[skillId];
    return {
      question: `Practice: ${skill?.name || skillId}`,
      answer: '1',
      hint: 'Answer 1 to continue'
    };
  }
  try {
    return gen();
  } catch (e) {
    console.warn(`Problem generator error for ${skillId}:`, e);
    return {
      question: `Practice: ${AFM_SKILLS[skillId]?.name || skillId}`,
      answer: '1'
    };
  }
};

// Generate a worked example for a specific skill
export const generateAfmWorkedExample = (skillId) => {
  const problem = generateAfmProblem(skillId);
  return problem.workedExample || null;
};

export default generators;
