// ============================================================================
// APM PROBLEM GENERATORS — Every APM skill gets a generator
// Each returns { question, answer, accepts?, hint?, workedExample? }
// workedExample: { problem, steps[], solution } for KP-based lessons
// ============================================================================

import { APM_SKILLS } from './apmKnowledgeGraph.js';

// ==================== HELPERS ====================
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, dp) => Number(n.toFixed(dp));
const formatCurrency = (n) => `$${roundTo(n, 2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatPercent = (n) => `${roundTo(n, 2)}%`;

const makeWorkedExample = (problem, steps, solution) => ({ problem, steps, solution });

// ==================== GENERATORS ====================

const generators = {
  // ======================== FOUNDATION (Grade 1) ========================

  APM_STRATEGY_INTRO: () => {
    const q = pick([
      { question: 'What is the primary purpose of strategic management?', answer: 'To align organizational resources with long-term objectives', hint: 'Strategic management involves planning and positioning the organization for sustainable success' },
      { question: 'Which of the following best defines strategy?\n\nA) Day-to-day operational decisions\nB) Long-term plan to create competitive advantage\nC) Financial reporting process\nD) Human resources policy', answer: 'B', hint: 'Strategy is about positioning for sustainable competitive advantage' },
      { question: 'Name one key difference between strategy and tactics.', answer: 'Strategy is long-term and organization-wide; tactics are short-term and specific', hint: 'Strategy sets the direction; tactics implement the plan' },
    ]);
    if (typeof q.answer === 'string' && q.answer.length === 1) {
      return {
        question: q.question,
        answer: q.answer,
        hint: q.hint,
        workedExample: makeWorkedExample(
          'What is the primary focus of strategic planning?',
          ['Strategic planning involves setting long-term direction', 'It defines organizational mission, vision, and objectives', 'It aligns resources with external opportunities and threats'],
          'Setting long-term direction and competitive positioning'
        )
      };
    }
    return q;
  },

  APM_MISSION_VISION: () => {
    const types = ['mission', 'vision', 'values'];
    const selected = pick(types);
    const defs = {
      mission: 'What the organization does currently and why it exists',
      vision: 'What the organization aspires to become in the future',
      values: 'Core principles that guide organizational behavior and decision-making',
    };
    const options = [
      { label: 'A', text: selected === 'mission' ? defs.mission : defs.vision },
      { label: 'B', text: selected === 'vision' ? defs.vision : defs.mission },
      { label: 'C', text: defs.values },
      { label: 'D', text: 'Short-term sales targets' },
    ];
    shuffle(options);
    const correctLabel = options.find(o => o.text === defs[selected]).label;
    return {
      question: `Which of the following best describes an organization's ${selected}?\n\nA) ${options[0].text}\nB) ${options[1].text}\nC) ${options[2].text}\nD) ${options[3].text}`,
      answer: correctLabel,
      hint: `${selected.charAt(0).toUpperCase() + selected.slice(1)}: ${defs[selected]}`
    };
  },

  APM_SWOT_ANALYSIS: () => {
    const elements = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'];
    const q = pick([
      { question: 'Which SWOT element is an internal positive factor?', answer: 'A', opt: ['Strengths', 'Opportunities', 'Threats', 'Weaknesses'] },
      { question: 'Which SWOT element represents external negative factors?', answer: 'D', opt: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'] },
      { question: 'In SWOT analysis, which element involves market gaps a company could exploit?', answer: 'B', opt: ['Strengths', 'Opportunities', 'Weaknesses', 'Threats'] },
    ]);
    return {
      question: `${q.question}\n\nA) ${q.opt[0]}\nB) ${q.opt[1]}\nC) ${q.opt[2]}\nD) ${q.opt[3]}`,
      answer: q.answer,
      hint: 'SWOT: Strengths & Weaknesses (Internal), Opportunities & Threats (External)'
    };
  },

  APM_PESTLE_ANALYSIS: () => {
    const factors = [
      { factor: 'Political', example: 'Government regulations', answer: 'A' },
      { factor: 'Economic', example: 'Interest rates and inflation', answer: 'B' },
      { factor: 'Social', example: 'Consumer preferences and demographics', answer: 'C' },
      { factor: 'Technological', example: 'Automation and innovation', answer: 'D' },
    ];
    const selected = pick(factors);
    return {
      question: `Which PESTLE factor does the following example belong to: "${selected.example}"?\n\nA) ${factors[0].factor}\nB) ${factors[1].factor}\nC) ${factors[2].factor}\nD) ${factors[3].factor}`,
      answer: selected.answer,
      hint: `PESTLE: Political, Economic, Social, Technological, Legal, Environmental`
    };
  },

  APM_PORTERS_FIVE_FORCES: () => {
    const forces = [
      { force: 'Supplier power', desc: 'Ability of suppliers to control prices' },
      { force: 'Buyer power', desc: 'Ability of customers to control prices' },
      { force: 'Competitive rivalry', desc: 'Intensity of competition among existing firms' },
      { force: 'Threat of new entrants', desc: 'Ease with which new competitors can enter' },
      { force: 'Threat of substitutes', desc: 'Availability of alternative products or services' },
    ];
    const s = pick(forces);
    return {
      question: `In Porter's Five Forces, which force relates to: "${s.desc}"?\n\nA) ${forces[0].force}\nB) ${forces[1].force}\nC) ${forces[2].force}\nD) ${forces[3].force}\nE) ${forces[4].force}`,
      answer: String.fromCharCode(65 + forces.indexOf(s)),
      hint: `The Five Forces: supplier power, buyer power, rivalry, new entrants, substitutes`
    };
  },

  APM_GENERIC_STRATEGIES: () => {
    const strategies = [
      { name: 'Cost Leadership', desc: 'Lowest cost producer to compete on price' },
      { name: 'Differentiation', desc: 'Unique product/service features' },
      { name: 'Focus', desc: 'Serving a specific market segment' },
    ];
    const s = pick(strategies);
    const options = shuffle(strategies.map(st => st.name));
    const answer = String.fromCharCode(65 + options.indexOf(s.name));
    return {
      question: `Which generic strategy is described as: "${s.desc}"?\n\nA) ${options[0]}\nB) ${options[1]}\nC) ${options[2]}`,
      answer,
      hint: `Porter's Generic Strategies: Cost Leadership, Differentiation, Focus`
    };
  },

  APM_VALUE_CHAIN: () => {
    const activities = [
      { activity: 'Inbound Logistics', type: 'Primary' },
      { activity: 'Operations', type: 'Primary' },
      { activity: 'Outbound Logistics', type: 'Primary' },
      { activity: 'Marketing & Sales', type: 'Primary' },
      { activity: 'Service', type: 'Primary' },
      { activity: 'Procurement', type: 'Support' },
      { activity: 'Human Resource Management', type: 'Support' },
      { activity: 'Technology Development', type: 'Support' },
      { activity: 'Firm Infrastructure', type: 'Support' },
    ];
    const a = pick(activities);
    return {
      question: `In Porter's Value Chain, is "${a.activity}" a primary or support activity?`,
      answer: a.type,
      hint: `Primary activities: inbound logistics, operations, outbound logistics, marketing, service. Support: procurement, HR, technology, infrastructure.`
    };
  },

  APM_MANAGEMENT_CONTROL: () => {
    return {
      question: 'What is the primary objective of management control systems?\n\nA) To punish poor performance\nB) To ensure organizational strategy is implemented effectively\nC) To replace human judgment\nD) To maximize short-term profits only',
      answer: 'B',
      hint: 'Management control systems are designed to align actions with strategy and organizational objectives',
      workedExample: makeWorkedExample(
        'Define management control systems and their role',
        ['Management control systems monitor organizational performance', 'They compare actual results against planned objectives', 'They enable corrective actions to implement strategy'],
        'Systems that ensure strategy implementation and organizational alignment'
      )
    };
  },

  APM_RESPONSIBILITY_CENTERS: () => {
    const centers = [
      { type: 'Cost Center', desc: 'Manager responsible for controlling costs' },
      { type: 'Revenue Center', desc: 'Manager responsible for generating revenue' },
      { type: 'Profit Center', desc: 'Manager responsible for revenues and costs' },
      { type: 'Investment Center', desc: 'Manager responsible for profitability and asset utilization' },
    ];
    const c = pick(centers);
    const options = shuffle(centers.map(ct => ct.type));
    const answer = String.fromCharCode(65 + options.indexOf(c.type));
    return {
      question: `Which responsibility center is described as: "${c.desc}"?\n\nA) ${options[0]}\nB) ${options[1]}\nC) ${options[2]}\nD) ${options[3]}`,
      answer,
      hint: `Responsibility centers: Cost, Revenue, Profit, Investment`
    };
  },

  APM_ORGANIZATIONAL_STRUCTURE: () => {
    return {
      question: 'What is the primary advantage of decentralized organizational structures?\n\nA) Reduced communication costs\nB) Faster decision-making and greater divisional autonomy\nC) Elimination of organizational conflict\nD) Guaranteed profit maximization',
      answer: 'B',
      hint: 'Decentralization allows divisions to respond quickly to local market conditions'
    };
  },

  APM_PM_INTRO: () => {
    return {
      question: 'What is performance measurement primarily used for?\n\nA) To control employee behavior only\nB) To assess whether organizational objectives are being achieved\nC) To replace strategic planning\nD) To eliminate decision-making',
      answer: 'B',
      hint: 'Performance measurement tracks progress toward strategic objectives'
    };
  },

  APM_KPI_BASICS: () => {
    const kpis = [
      'Customer satisfaction score',
      'Revenue growth percentage',
      'Employee retention rate',
      'Return on Investment (ROI)',
      'Product defect rate',
    ];
    const selected = pick(kpis);
    return {
      question: `Is "${selected}" a Key Performance Indicator (KPI)?`,
      answer: 'Yes',
      hint: 'KPIs are measurable metrics that indicate progress toward strategic objectives'
    };
  },

  APM_FINANCIAL_METRICS: () => {
    const revenue = rand(500000, 2000000);
    const profit = roundTo(revenue * 0.15, 0);
    const capitalEmployed = rand(1000000, 5000000);
    const roce = roundTo((profit / capitalEmployed) * 100, 2);
    return {
      question: `A company has profit of ${formatCurrency(profit)} and capital employed of ${formatCurrency(capitalEmployed)}. Calculate ROCE (Return on Capital Employed).`,
      answer: `${roce}%`,
      accepts: [`${roce}%`, roce.toString()],
      workedExample: makeWorkedExample(
        `Calculate ROCE given profit = ${formatCurrency(100000)} and capital employed = ${formatCurrency(500000)}`,
        ['ROCE = Profit / Capital Employed × 100%', `ROCE = ${formatCurrency(100000)} / ${formatCurrency(500000)} × 100%`, 'ROCE = 0.20 × 100% = 20%'],
        '20%'
      )
    };
  },

  APM_COST_BEHAVIOR: () => {
    const types = ['Fixed', 'Variable', 'Mixed'];
    const scenarios = [
      { desc: 'Salary of a manager', answer: 'Fixed' },
      { desc: 'Raw materials cost that increases with production volume', answer: 'Variable' },
      { desc: 'Electricity bill with a base charge plus usage charges', answer: 'Mixed' },
    ];
    const s = pick(scenarios);
    return {
      question: `Classify the following cost as Fixed, Variable, or Mixed: "${s.desc}"`,
      answer: s.answer,
      hint: `Fixed: constant regardless of volume. Variable: changes with volume. Mixed: has both fixed and variable components.`
    };
  },

  APM_QUALITY_INTRO: () => {
    return {
      question: 'What does quality management primarily focus on?\n\nA) Only reducing defects\nB) Meeting customer expectations and requirements consistently\nC) Increasing production speed\nD) Reducing employee wages',
      answer: 'B',
      hint: 'Quality management is about consistently meeting or exceeding customer expectations'
    };
  },

  APM_COST_OF_QUALITY_INTRO: () => {
    return {
      question: 'The Cost of Quality framework includes prevention, appraisal, and failure costs. Which category includes the cost of inspections?\n\nA) Prevention costs\nB) Appraisal costs\nC) Internal failure costs\nD) External failure costs',
      answer: 'B',
      hint: 'Appraisal costs = costs of identifying defects (inspections, testing). Prevention = avoiding defects. Failure = cost of defects found.'
    };
  },

  APM_IT_SYSTEMS: () => {
    return {
      question: 'Which of the following is a primary function of IT systems in performance management?\n\nA) To replace managers\nB) To collect, process, and report performance data\nC) To eliminate the need for strategy\nD) To guarantee profit',
      answer: 'B',
      hint: 'IT systems support performance management by enabling data collection, analysis, and reporting'
    };
  },

  APM_DATA_QUALITY: () => {
    return {
      question: 'Why is data quality critical in performance management systems?\n\nA) To make decisions look professional\nB) To ensure accurate performance metrics and reliable decision-making\nC) To increase IT costs\nD) To simplify reporting only',
      answer: 'B',
      hint: 'Poor data quality leads to incorrect performance assessments and flawed decisions'
    };
  },

  // ======================== INTERMEDIATE (Grade 2) ========================

  APM_FEEDBACK_CONTROL: () => {
    return {
      question: 'What is feedback control in management systems?\n\nA) Controlling employees through criticism\nB) Comparing actual results to planned objectives and taking corrective action\nC) Ignoring performance problems\nD) Only reporting positive results',
      answer: 'B',
      hint: 'Feedback control is reactive: measure results, compare to plan, take corrective action',
      workedExample: makeWorkedExample(
        'Explain feedback control with an example',
        ['Actual profit = $1.2M, Target = $1.5M', 'Variance identified: $300k shortfall', 'Corrective actions implemented: reduce costs, increase sales efforts'],
        'Feedback control identifies variances and enables corrective actions'
      )
    };
  },

  APM_FEEDFORWARD_CONTROL: () => {
    return {
      question: 'How does feedforward control differ from feedback control?\n\nA) It ignores problems\nB) It prevents problems before they occur rather than correcting after the fact\nC) It is more expensive\nD) It requires no monitoring',
      answer: 'B',
      hint: 'Feedforward is proactive prevention; feedback is reactive correction'
    };
  },

  APM_CONTROL_EFFECTIVENESS: () => {
    return {
      question: 'What are the characteristics of effective internal controls?\n\nA) Cost, Authorization, Accountability\nB) Compliance with laws only\nC) Preventive measures only\nD) No employee discretion',
      answer: 'A',
      hint: 'Effective controls are cost-effective, have clear authorization, and establish accountability'
    };
  },

  APM_BSC_INTRO: () => {
    return {
      question: 'The Balanced Scorecard framework includes four perspectives. Which of the following is NOT one of them?\n\nA) Financial Perspective\nB) Customer Perspective\nC) Marketing Perspective\nD) Learning & Growth Perspective',
      answer: 'C',
      hint: 'BSC perspectives: Financial, Customer, Internal Process, Learning & Growth',
      workedExample: makeWorkedExample(
        'List the four Balanced Scorecard perspectives',
        [
          '1. Financial: How do we create shareholder value? (Profitability, ROI, EVA)',
          '2. Customer: How do customers perceive us? (Satisfaction, market share, retention)',
          '3. Internal Process: What processes must we excel at? (Quality, efficiency, innovation)',
          '4. Learning & Growth: How do we enable improvement? (Employee skills, culture, systems)'
        ],
        'Financial, Customer, Internal Process, Learning & Growth'
      )
    };
  },

  APM_BSC_FINANCIAL: () => {
    const eps = rand(2, 8);
    const profit = rand(1000000, 5000000);
    const shareholders = rand(100000000, 500000000);
    const roi = roundTo((profit / shareholders) * 100, 2);
    return {
      question: `Calculate ROI given Net Profit = ${formatCurrency(profit)} and Shareholders' Equity = ${formatCurrency(shareholders)}.`,
      answer: `${roi}%`,
      accepts: [`${roi}%`, roi.toString()],
      hint: 'ROI = (Net Profit / Shareholders Equity) × 100%'
    };
  },

  APM_BSC_CUSTOMER: () => {
    return {
      question: 'Which Balanced Scorecard metric measures the percentage of customers who make repeat purchases?\n\nA) Customer Acquisition Rate\nB) Customer Retention Rate\nC) Market Share\nD) Customer Complaints',
      answer: 'B',
      hint: 'Customer Retention Rate = customers retained / customers at start of period'
    };
  },

  APM_BSC_INTERNAL: () => {
    return {
      question: 'In the BSC Internal Process perspective, which metric measures how well a company produces without defects?\n\nA) Cycle time\nB) Defect rate\nC) Throughput\nD) Waste percentage',
      answer: 'B',
      hint: 'Defect rate measures quality of internal processes'
    };
  },

  APM_BSC_LEARNING: () => {
    return {
      question: 'Which of the following is an example of a Learning & Growth perspective KPI?\n\nA) Revenue per employee\nB) Employee training hours\nC) Staff turnover rate\nD) All of the above',
      answer: 'D',
      hint: 'Learning & Growth metrics track human capital, organizational learning, and culture'
    };
  },

  APM_BSC_CAUSAL: () => {
    return {
      question: 'In Balanced Scorecard cause-effect relationships, how does improved employee training (Learning & Growth) lead to financial success?\n\nA) It directly increases share price\nB) Better trained employees → improved internal processes → higher quality → customer satisfaction → increased revenue\nC) It requires no other improvements\nD) It guarantees profit',
      answer: 'B',
      hint: 'BSC strategy maps show how improvements cascade through perspectives',
      workedExample: makeWorkedExample(
        'Demonstrate a BSC cause-effect chain',
        [
          'Learning & Growth: Invest in employee training on new technology',
          'Internal Process: Employees use new skills to improve production efficiency',
          'Customer: Faster delivery and better quality → higher customer satisfaction',
          'Financial: Satisfied customers → repeat business → increased revenue and profit'
        ],
        'Improvements in lower perspectives drive financial results'
      )
    };
  },

  APM_BUILDING_BLOCKS: () => {
    return {
      question: 'The Building Block Model (Fitzgerald & Moon) includes six dimensions. Which of the following is one of them?\n\nA) Competitiveness\nB) Marketing Effectiveness\nC) Employee Morale\nD) Shareholder Activism',
      answer: 'A',
      hint: 'Building Blocks: Competitiveness, Financial Performance, Quality of Service, Flexibility, Resource Utilization, Innovation'
    };
  },

  APM_BUILDING_BLOCKS_COMPETITIVENESS: () => {
    return {
      question: 'In the Building Block Model, which competitiveness measure tracks how quickly a company responds to market changes?\n\nA) Market share\nB) Flexibility\nC) Innovation rate\nD) Customer loyalty',
      answer: 'B',
      hint: 'Flexibility in the Building Block model relates to adaptability and response time'
    };
  },

  APM_BUILDING_BLOCKS_FINANCIAL: () => {
    const assets = rand(1000000, 10000000);
    const profit = roundTo(assets * 0.12, 0);
    const roa = roundTo((profit / assets) * 100, 2);
    return {
      question: `Calculate Return on Assets (ROA) given Net Profit = ${formatCurrency(profit)} and Total Assets = ${formatCurrency(assets)}.`,
      answer: `${roa}%`,
      accepts: [`${roa}%`, roa.toString()],
      hint: 'ROA = (Net Profit / Total Assets) × 100%'
    };
  },

  APM_PERFORMANCE_PYRAMID: () => {
    return {
      question: 'The Performance Pyramid model has strategic objectives at the top, which then cascade down into what levels?\n\nA) Only financial metrics\nB) Critical success factors, key performance indicators, and operational measures\nC) Only customer metrics\nD) Only employee metrics',
      answer: 'B',
      hint: 'Pyramid cascades: Strategy → CSF → KPI → Operational Measures'
    };
  },

  APM_EVA_CONCEPT: () => {
    return {
      question: 'Economic Value Added (EVA) measures:\n\nA) Accounting profit only\nB) The profit generated after deducting the cost of capital invested\nC) Revenue minus costs\nD) Cash flow only',
      answer: 'B',
      hint: 'EVA = NOPAT - (Invested Capital × WACC). It shows true economic profit.',
      workedExample: makeWorkedExample(
        'Understand EVA concept',
        [
          'EVA measures economic profit, not just accounting profit',
          'EVA = Net Operating Profit After Tax (NOPAT) - (Invested Capital × WACC)',
          'If EVA > 0: company created value beyond cost of capital',
          'If EVA < 0: company destroyed shareholder value'
        ],
        'EVA is the excess profit after covering the cost of capital'
      )
    };
  },

  APM_NOPAT_CALC: () => {
    const revenue = rand(5000000, 20000000);
    const operatingProfit = roundTo(revenue * 0.15, 0);
    const taxRate = pick([20, 25, 30]);
    const nopat = roundTo(operatingProfit * (1 - taxRate / 100), 0);
    return {
      question: `Calculate NOPAT given Operating Profit = ${formatCurrency(operatingProfit)} and Tax Rate = ${taxRate}%.`,
      answer: formatCurrency(nopat),
      accepts: [formatCurrency(nopat), nopat.toString(), formatCurrency(operatingProfit * (1 - taxRate / 100))],
      hint: 'NOPAT = Operating Profit × (1 - Tax Rate)',
      workedExample: makeWorkedExample(
        `Calculate NOPAT for Operating Profit = ${formatCurrency(1000000)}, Tax Rate = 20%`,
        ['NOPAT = Operating Profit × (1 - Tax Rate)', `NOPAT = ${formatCurrency(1000000)} × (1 - 0.20)`, `NOPAT = ${formatCurrency(1000000)} × 0.80 = ${formatCurrency(800000)}`],
        formatCurrency(800000)
      )
    };
  },

  APM_INVESTED_CAPITAL: () => {
    const equity = rand(5000000, 15000000);
    const debt = roundTo(equity * 0.4, 0);
    const totalCapital = equity + debt;
    const debtCost = pick([5, 6, 7]);
    const equityCost = pick([12, 15, 18]);
    const debtWeight = roundTo(debt / totalCapital, 3);
    const equityWeight = roundTo(equity / totalCapital, 3);
    const wacc = roundTo(debtWeight * debtCost + equityWeight * equityCost, 2);
    return {
      question: `Calculate WACC given: Debt = ${formatCurrency(debt)}, Equity = ${formatCurrency(equity)}, Cost of Debt = ${debtCost}%, Cost of Equity = ${equityCost}%.`,
      answer: formatPercent(wacc),
      accepts: [formatPercent(wacc), `${wacc}%`, wacc.toString()],
      hint: 'WACC = (Debt/Total Capital × Cost of Debt) + (Equity/Total Capital × Cost of Equity)',
    };
  },

  APM_EVA_CALCULATION: () => {
    const nopat = rand(500000, 2000000);
    const investedCapital = rand(5000000, 20000000);
    const wacc = pick([8, 9, 10, 11, 12]);
    const capitalCharge = roundTo(investedCapital * (wacc / 100), 0);
    const eva = nopat - capitalCharge;
    return {
      question: `Calculate EVA given NOPAT = ${formatCurrency(nopat)}, Invested Capital = ${formatCurrency(investedCapital)}, WACC = ${wacc}%.`,
      answer: formatCurrency(eva),
      accepts: [formatCurrency(eva), eva.toString()],
      hint: 'EVA = NOPAT - (Invested Capital × WACC)',
      workedExample: makeWorkedExample(
        `Calculate EVA for NOPAT = ${formatCurrency(1000000)}, Invested Capital = ${formatCurrency(10000000)}, WACC = 10%`,
        ['EVA = NOPAT - (Invested Capital × WACC)', `Capital Charge = ${formatCurrency(10000000)} × 10% = ${formatCurrency(1000000)}`, `EVA = ${formatCurrency(1000000)} - ${formatCurrency(1000000)} = ${formatCurrency(0)}`],
        formatCurrency(0)
      )
    };
  },

  APM_EVA_ADJUSTMENTS: () => {
    const adjustmentType = pick(['Capitalization of R&D', 'Operating Lease Adjustment', 'LIFO Reserve Adjustment']);
    return {
      question: `Which of the following is an EVA adjustment reason: Adding back capitalized R&D that accounting expensed?\n\nA) Accounting adjustments for quality of earnings\nB) Operating adjustments for true economic costs\nC) Strategic adjustments for long-term value\nD) Tax adjustments for compliance`,
      answer: 'A',
      hint: 'EVA adjustments convert accounting profit to economic profit by correcting accounting distortions'
    };
  },

  APM_TQM_PRINCIPLES: () => {
    return {
      question: 'Which of the following is NOT a core principle of Total Quality Management (TQM)?\n\nA) Continuous improvement\nB) Customer focus\nC) Employee involvement\nD) Profit maximization at any cost',
      answer: 'D',
      hint: 'TQM principles: continuous improvement, customer focus, employee involvement, systematic approach, leadership commitment'
    };
  },

  APM_KAIZEN: () => {
    return {
      question: 'What does Kaizen emphasize in continuous improvement?\n\nA) Large, infrequent changes\nB) Small, incremental improvements made continuously by all employees\nC) Only management-led improvements\nD) Cost reduction only',
      answer: 'B',
      hint: 'Kaizen = continuous improvement through small daily changes involving everyone'
    };
  },

  APM_SIX_SIGMA: () => {
    return {
      question: 'In Six Sigma, DMAIC stands for:\n\nA) Define, Manage, Analyze, Improve, Control\nB) Design, Measure, Analyze, Improve, Check\nC) Define, Measure, Analyze, Improve, Control\nD) Develop, Monitor, Assess, Implement, Certify',
      answer: 'C',
      hint: 'DMAIC: Define problem, Measure current state, Analyze root causes, Improve process, Control new process'
    };
  },

  APM_COST_OF_QUALITY: () => {
    const prevention = rand(50000, 200000);
    const appraisal = rand(100000, 300000);
    const internalFailure = rand(150000, 500000);
    const externalFailure = rand(200000, 800000);
    const totalCoq = prevention + appraisal + internalFailure + externalFailure;
    const revenue = rand(5000000, 15000000);
    const coqPercent = roundTo((totalCoq / revenue) * 100, 2);
    return {
      question: `Calculate Cost of Quality as % of revenue given: Prevention = ${formatCurrency(prevention)}, Appraisal = ${formatCurrency(appraisal)}, Internal Failure = ${formatCurrency(internalFailure)}, External Failure = ${formatCurrency(externalFailure)}, Revenue = ${formatCurrency(revenue)}.`,
      answer: formatPercent(coqPercent),
      accepts: [formatPercent(coqPercent), `${coqPercent}%`, coqPercent.toString()],
      hint: 'Cost of Quality % = (Total CoQ / Revenue) × 100%'
    };
  },

  APM_ABC_BASICS: () => {
    const totalOH = rand(500000, 2000000);
    const productA_units = rand(10000, 50000);
    const productB_units = rand(5000, 30000);
    const productA_activities = rand(5000, 15000);
    const productB_activities = rand(3000, 10000);
    const totalActivities = productA_activities + productB_activities;
    const costPerActivity = roundTo(totalOH / totalActivities, 2);
    const productA_oh = roundTo(productA_activities * costPerActivity, 0);
    const productA_costPerUnit = roundTo(productA_oh / productA_units, 2);
    return {
      question: `Using ABC: Total Overhead = ${formatCurrency(totalOH)}, Product A = ${productA_activities} activities, Product B = ${productB_activities} activities. Calculate Product A's overhead cost per unit (units = ${productA_units}).`,
      answer: formatCurrency(productA_costPerUnit),
      accepts: [formatCurrency(productA_costPerUnit), productA_costPerUnit.toString()],
      hint: 'ABC steps: 1) Identify cost drivers, 2) Calculate cost per driver, 3) Allocate to products'
    };
  },

  APM_ABM: () => {
    return {
      question: 'Activity-Based Management (ABM) uses cost driver information primarily to:\n\nA) Only calculate product costs\nB) Manage activities and improve profitability through cost reduction\nC) Increase production volume\nD) Eliminate quality control',
      answer: 'B',
      hint: 'ABM uses ABC data to manage activities, reduce non-value-added costs, and improve efficiency'
    };
  },

  APM_TARGET_COSTING: () => {
    const sellingPrice = rand(100, 500);
    const targetProfit = roundTo(sellingPrice * 0.30, 2);
    const targetCost = roundTo(sellingPrice - targetProfit, 2);
    return {
      question: `Using Target Costing: Market selling price = ${formatCurrency(sellingPrice)}, Target profit margin = 30%. Calculate the target cost.`,
      answer: formatCurrency(targetCost),
      accepts: [formatCurrency(targetCost), targetCost.toString()],
      hint: 'Target Cost = Selling Price - Target Profit',
      workedExample: makeWorkedExample(
        `Calculate target cost for selling price = ${formatCurrency(100)}, target profit = 20%`,
        ['Target Cost = Selling Price - Target Profit', `Target Profit = ${formatCurrency(100)} × 20% = ${formatCurrency(20)}`, `Target Cost = ${formatCurrency(100)} - ${formatCurrency(20)} = ${formatCurrency(80)}`],
        formatCurrency(80)
      )
    };
  },

  APM_VALUE_ENGINEERING: () => {
    return {
      question: 'Value Engineering aims to:\n\nA) Reduce costs while maintaining or improving functionality\nB) Eliminate all optional features\nC) Reduce quality to lower cost\nD) Only focus on luxury features',
      answer: 'A',
      hint: 'Value Engineering balances cost reduction with maintaining or enhancing value to customers'
    };
  },

  APM_BENCHMARKING: () => {
    return {
      question: 'Which type of benchmarking compares your process against best-in-class competitors in the same industry?\n\nA) Internal benchmarking\nB) Competitive benchmarking\nC) Functional benchmarking\nD) Generic benchmarking',
      answer: 'B',
      hint: 'Benchmarking types: Internal (within organization), Competitive (same industry), Functional (same function, different industry), Generic (any best practice)'
    };
  },

  APM_BENCHMARKING_ANALYSIS: () => {
    const ourCost = rand(100, 500);
    const bestPractice = roundTo(ourCost * 0.75, 2);
    const gap = roundTo(ourCost - bestPractice, 2);
    const gapPercent = roundTo((gap / ourCost) * 100, 2);
    return {
      question: `Calculate the benchmarking gap: Your process cost = ${formatCurrency(ourCost)}, Best practice cost = ${formatCurrency(bestPractice)}. What is the gap percentage?`,
      answer: formatPercent(gapPercent),
      accepts: [formatPercent(gapPercent), `${gapPercent}%`, gapPercent.toString()],
      hint: 'Gap % = ((Your Cost - Best Practice Cost) / Your Cost) × 100%'
    };
  },

  APM_ERP_SYSTEMS: () => {
    return {
      question: 'What is the primary benefit of Enterprise Resource Planning (ERP) systems in performance management?\n\nA) To eliminate employee roles\nB) To integrate data across all business functions for unified reporting\nC) To replace strategic planning\nD) To guarantee profit',
      answer: 'B',
      hint: 'ERP systems integrate data from sales, operations, finance, HR enabling comprehensive performance analysis'
    };
  },

  APM_BI_TOOLS: () => {
    return {
      question: 'Business Intelligence (BI) tools primarily enable:\n\nA) Manual data entry only\nB) Data analysis, visualization, and predictive insights for decision-making\nC) Elimination of reporting\nD) Cost increases only',
      answer: 'B',
      hint: 'BI tools: extract, transform, analyze data; create visualizations; support decision-making'
    };
  },

  APM_DASHBOARDS: () => {
    return {
      question: 'An effective performance dashboard should include:\n\nA) All available data\nB) Only financial metrics\nC) Key metrics aligned to strategy, presented clearly with trend information\nD) Only historical data',
      answer: 'C',
      hint: 'Effective dashboards: focused on KPIs, clear visualization, actionable insights, current and trend data'
    };
  },

  APM_DATA_ANALYTICS: () => {
    return {
      question: 'What does trend analysis in data analytics reveal?\n\nA) Only today\'s performance\nB) Patterns over time that indicate performance direction\nC) Nothing useful\nD) Only past data',
      answer: 'B',
      hint: 'Trend analysis identifies patterns over time: improving, declining, or stable'
    };
  },

  APM_VARIANCE_ANALYSIS_ADV: () => {
    const standardCost = rand(50, 200);
    const actualCost = rand(40, 180);
    const units = rand(1000, 5000);
    const variance = roundTo((actualCost - standardCost) * units, 0);
    const varPercent = roundTo(((actualCost - standardCost) / standardCost) * 100, 2);
    return {
      question: `Calculate cost variance: Standard cost per unit = ${formatCurrency(standardCost)}, Actual cost per unit = ${formatCurrency(actualCost)}, Units produced = ${units}. Express variance as total amount and percentage.`,
      answer: `${formatCurrency(variance)} (${varPercent}% ${variance < 0 ? 'favorable' : 'unfavorable'})`,
      accepts: [formatCurrency(variance), variance.toString()],
      hint: 'Variance = (Actual - Standard) × Quantity. Negative = favorable, Positive = unfavorable'
    };
  },

  APM_STAKEHOLDER_ANALYSIS: () => {
    return {
      question: 'In Mendelow\'s Stakeholder Analysis, which quadrant represents stakeholders with HIGH power and HIGH interest?\n\nA) Manage closely\nB) Keep satisfied\nC) Monitor\nD) Keep informed',
      answer: 'A',
      hint: 'Mendelow Matrix: High power/High interest = Manage Closely, High power/Low interest = Keep Satisfied, Low power/High interest = Keep Informed, Low power/Low interest = Monitor'
    };
  },

  APM_STAKEHOLDER_COMMUNICATION: () => {
    return {
      question: 'Effective stakeholder communication in performance reporting should:\n\nA) Only provide financial data\nB) Use tailored messages and channels appropriate to each stakeholder group\nC) Be as complex as possible\nD) Avoid transparent reporting',
      answer: 'B',
      hint: 'Different stakeholders need different information: investors want ROI, employees want career growth, customers want quality'
    };
  },

  // ======================== ADVANCED (Grade 3) ========================

  APM_BSC_PRIVATE_SECTOR: () => {
    return {
      question: 'In adapting BSC to private sector manufacturing companies, which perspective typically receives most emphasis?\n\nA) Learning & Growth only\nB) Financial perspective, with emphasis on ROI and shareholder value\nC) Customer perspective only\nD) All perspectives equally regardless of strategy',
      answer: 'B',
      hint: 'Private sector BSC emphasizes financial performance and shareholder value creation'
    };
  },

  APM_BSC_PUBLIC_SECTOR: () => {
    return {
      question: 'When adapting BSC for public sector organizations, what is the primary modification?\n\nA) Remove financial perspective\nB) Replace financial perspective with stakeholder value and service delivery outcomes\nC) Only use customer perspective\nD) Eliminate performance measurement',
      answer: 'B',
      hint: 'Public sector BSC emphasizes service outcomes, stakeholder value, and accountability vs. profit'
    };
  },

  APM_BSC_NFP: () => {
    return {
      question: 'For Not-For-Profit organizations using BSC, which perspective becomes most critical?\n\nA) Financial (profitability)\nB) Customer (donor satisfaction and mission impact)\nC) Learning & Growth only\nD) Internal Process only',
      answer: 'B',
      hint: 'NFP BSC focuses on mission achievement, donor/stakeholder satisfaction, and impact rather than profit'
    };
  },

  APM_VALUE_BASED_MGMT: () => {
    return {
      question: 'What is the core principle of Value-Based Management?\n\nA) Maximizing short-term profits\nB) Making decisions to maximize shareholder value creation\nC) Eliminating costs\nD) Ignoring risks',
      answer: 'B',
      hint: 'Value-Based Management aligns all strategic and operational decisions with creating shareholder value',
      workedExample: makeWorkedExample(
        'Apply Value-Based Management to an investment decision',
        [
          'Project A: NPV = $2M, increases risk slightly',
          'Project B: NPV = $1M, very low risk',
          'VBM analysis: Project A creates more shareholder value despite higher risk',
          'Decision: Accept Project A as it maximizes shareholder value'
        ],
        'VBM focuses on maximizing shareholder value, not just profits'
      )
    };
  },

  APM_STRATEGIC_CONFLICTS: () => {
    return {
      question: 'Which strategic conflict is MOST critical for management control systems?\n\nA) Between profit and revenue\nB) Between short-term performance and long-term value creation\nC) Between customers and suppliers\nD) Between products and services',
      answer: 'B',
      hint: 'Management must balance pressure for short-term results with long-term strategic investments'
    };
  },

  APM_PRIVATE_SECTOR_EVAL: () => {
    return {
      question: 'In private sector performance evaluation, which metric is most emphasized?\n\nA) Customer satisfaction only\nB) Market share only\nC) Profitability and shareholder return measures (ROI, EPS, EVA)\nD) Employee satisfaction',
      answer: 'C',
      hint: 'Private sector evaluation emphasizes financial returns and profitability metrics'
    };
  },

  APM_PUBLIC_SECTOR_VFM: () => {
    return {
      question: 'The 3Es framework for public sector Value for Money includes Economy, Efficiency, and Effectiveness. What does Effectiveness measure?\n\nA) Cost minimization\nB) Output per input\nC) Whether objectives were achieved\nD) Employee satisfaction',
      answer: 'C',
      hint: 'Economy = spending wisely, Efficiency = output per input, Effectiveness = achieving objectives'
    };
  },

  APM_REGULATED_SECTOR: () => {
    return {
      question: 'In regulated industries (utilities, banking), which performance metric is often constrained by regulation?\n\nA) Profitability (capped returns)\nB) Service quality standards\nC) Environmental compliance\nD) All of the above',
      answer: 'D',
      hint: 'Regulated sectors face constraints on pricing, returns, quality standards, and compliance'
    };
  },

  APM_NFP_MEASUREMENT: () => {
    return {
      question: 'Performance measurement in NFP organizations should prioritize:\n\nA) Profit maximization\nB) Mission achievement, impact measurement, and stakeholder satisfaction\nC) Cost reduction only\nD) Minimizing activities',
      answer: 'B',
      hint: 'NFP performance measurement focuses on mission accomplishment and social impact'
    };
  },

  APM_BIG_DATA: () => {
    return {
      question: 'How can Big Data improve performance management?\n\nA) It eliminates the need for strategy\nB) It enables analysis of large datasets to identify patterns and insights for better decision-making\nC) It increases complexity only\nD) It guarantees profit',
      answer: 'B',
      hint: 'Big Data analytics can reveal patterns, predict trends, and support data-driven performance management'
    };
  },

  APM_MACHINE_LEARNING: () => {
    return {
      question: 'Which is a realistic application of Machine Learning in performance management?\n\nA) Predicting customer churn based on behavior patterns\nB) Eliminating all human judgment\nC) Guaranteeing profit\nD) Replacing strategy completely',
      answer: 'A',
      hint: 'ML applications: predictive analytics, pattern recognition, anomaly detection, demand forecasting'
    };
  },

  APM_PREDICTIVE_ANALYTICS: () => {
    return {
      question: 'What is the primary value of predictive analytics in performance management?\n\nA) Describing past performance only\nB) Forecasting future performance to enable proactive management\nC) Eliminating uncertainty\nD) Replacing operational metrics',
      answer: 'B',
      hint: 'Predictive analytics forecasts future outcomes enabling proactive decision-making'
    };
  },

  APM_INTEGRATED_REPORTING: () => {
    return {
      question: 'Integrated Reporting (IIRC) framework combines:\n\nA) Only financial information\nB) Financial and non-financial information (social, environmental, governance) to show how organization creates value\nC) Only environmental data\nD) Only governance data',
      answer: 'B',
      hint: 'Integrated Reporting shows comprehensive value creation: financial, social, environmental, governance'
    };
  },

  APM_ENVIRONMENTAL_SOCIAL: () => {
    return {
      question: 'Environmental, Social, and Governance (ESG) performance reporting is increasingly important because:\n\nA) It looks good only\nB) Stakeholders demand transparency on sustainability and ethical practices; it impacts long-term value\nC) It is legally unnecessary\nD) It reduces profitability',
      answer: 'B',
      hint: 'ESG reporting addresses stakeholder concerns and reflects long-term sustainability risks'
    };
  },

  APM_SUSTAINABILITY_METRICS: () => {
    return {
      question: 'Which metric would be appropriate for measuring sustainability performance?\n\nA) Carbon emissions per unit produced\nB) Water consumption per liter\nC) Waste recycling percentage\nD) All of the above',
      answer: 'D',
      hint: 'Sustainability metrics cover carbon, water, waste, energy, supply chain, and social impact'
    };
  },

  APM_PROFESSIONAL_JUDGMENT: () => {
    return {
      question: 'When designing performance management systems, professional judgment is essential because:\n\nA) Systems can be completely formula-based\nB) Quantitative metrics alone cannot capture all important aspects; judgment balances metrics with context\nC) Only financial experts matter\nD) No one else understands the organization',
      answer: 'B',
      hint: 'Professional judgment integrates metrics, context, stakeholder needs, and strategic priorities'
    };
  },

  APM_PM_SYSTEM_DESIGN: () => {
    return {
      question: 'An integrated performance management system design should include:\n\nA) Only financial metrics\nB) Strategy definition, metric selection, data systems, feedback mechanisms, and continuous improvement\nC) Only operational metrics\nD) No integration necessary',
      answer: 'B',
      hint: 'Integrated PM systems align strategy, metrics, data, and feedback across all organization levels'
    };
  },

  APM_DASHBOARD_DESIGN: () => {
    return {
      question: 'Strategic dashboard design principles include:\n\nA) Maximum data density\nB) Focus on KPIs, clear hierarchy, visual clarity, actionable insights, user-specific views\nC) Only static reports\nD) No visualization needed',
      answer: 'B',
      hint: 'Effective dashboards: focused on critical metrics, visually clear, interactive, aligned to user needs'
    };
  },

  APM_REAL_TIME_SYSTEMS: () => {
    return {
      question: 'What is the primary advantage of real-time performance monitoring?\n\nA) Eliminates all uncertainty\nB) Enables rapid response to emerging issues rather than discovering problems in retrospective reporting\nC) Reduces data collection\nD) Costs less than periodic reporting',
      answer: 'B',
      hint: 'Real-time monitoring enables proactive management vs. reactive correction'
    };
  },

  APM_TRANSFER_PRICING: () => {
    const transferPrice = rand(50, 150);
    const cost = roundTo(transferPrice * 0.6, 2);
    const sellingPrice = roundTo(transferPrice * 1.4, 2);
    const division1_profit = roundTo(transferPrice - cost, 2);
    const division2_profit = roundTo(sellingPrice - transferPrice, 2);
    return {
      question: `Calculate divisional profits using transfer pricing: Internal transfer price = ${formatCurrency(transferPrice)}, Division 1 cost = ${formatCurrency(cost)}, Division 2 selling price = ${formatCurrency(sellingPrice)}. What is Division 1 profit and Division 2 profit?`,
      answer: `D1: ${formatCurrency(division1_profit)}, D2: ${formatCurrency(division2_profit)}`,
      accepts: [formatCurrency(division1_profit), division1_profit.toString()],
      hint: 'Transfer Price must be set to motivate divisional performance while optimizing company profit'
    };
  },

  APM_DIVISIONAL_EVALUATION: () => {
    const divisionProfit = rand(500000, 2000000);
    const assetsEmployed = rand(5000000, 15000000);
    const roi = roundTo((divisionProfit / assetsEmployed) * 100, 2);
    return {
      question: `Calculate divisional ROI: Division profit = ${formatCurrency(divisionProfit)}, Assets employed = ${formatCurrency(assetsEmployed)}.`,
      answer: `${roi}%`,
      accepts: [`${roi}%`, roi.toString()],
      hint: 'Divisional ROI = (Divisional Profit / Assets Employed) × 100%'
    };
  },

  APM_OPERATIONAL_CONTROL: () => {
    return {
      question: 'What is the key difference between operational and strategic control?\n\nA) No difference\nB) Operational: day-to-day efficiency and compliance; Strategic: long-term direction and competitive positioning\nC) Only operational control matters\nD) Only strategic control matters',
      answer: 'B',
      hint: 'Operational control focuses on execution; Strategic control focuses on market position and competitive advantage'
    };
  },

  APM_CONTINGENCY_PLANNING: () => {
    return {
      question: 'Contingency planning in performance management addresses:\n\nA) Only normal scenarios\nB) Potential risks and uncertainties with alternative strategies and performance metrics\nC) Eliminating all risks\nD) Ignoring worst cases',
      answer: 'B',
      hint: 'Contingency planning prepares alternative strategies and metrics for different scenarios'
    };
  },

  APM_QUALITY_COSTING_ADV: () => {
    const currentDefects = rand(2, 5);
    const costPerDefect = rand(5000, 15000);
    const preventionInvestment = rand(100000, 500000);
    const reducedDefects = roundTo(currentDefects * 0.5, 1);
    const defectCostSavings = roundTo((currentDefects - reducedDefects) * costPerDefect, 0);
    const netBenefit = roundTo(defectCostSavings - preventionInvestment, 0);
    return {
      question: `Quality costing trade-off: Current defects = ${currentDefects}%, cost per defect = ${formatCurrency(costPerDefect)}, prevention investment = ${formatCurrency(preventionInvestment)}. If investment reduces defects to ${reducedDefects}%, calculate net benefit.`,
      answer: formatCurrency(netBenefit),
      accepts: [formatCurrency(netBenefit), netBenefit.toString()],
      hint: 'Net Benefit = Defect Cost Savings - Prevention Investment'
    };
  },

  APM_SUPPLY_CHAIN_QUALITY: () => {
    return {
      question: 'Quality management in supply chain context should focus on:\n\nA) Only internal quality\nB) Supplier quality, process integration, and end-to-end quality from suppliers to customers\nC) Eliminating supplier relationships\nD) Cost reduction only',
      answer: 'B',
      hint: 'Supply chain quality requires coordinated management from raw materials through customer delivery'
    };
  },

  APM_CHANGE_MANAGEMENT: () => {
    return {
      question: 'In implementing new performance management systems, change management is critical because:\n\nA) Technical systems work automatically\nB) People and processes must adapt; communication, training, and stakeholder buy-in determine success\nC) No change needed\nD) Change always fails',
      answer: 'B',
      hint: 'Change management addresses resistance, builds capability, and ensures system adoption'
    };
  },

  APM_STRATEGIC_ALIGNMENT: () => {
    return {
      question: 'Strategic alignment in performance management means:\n\nA) All metrics are the same\nB) Organizational objectives, systems, processes, and people behaviors are coordinated to execute strategy\nC) No coordination needed\nD) Strategy is irrelevant',
      answer: 'B',
      hint: 'Strategic alignment ensures everything points toward organizational objectives',
      workedExample: makeWorkedExample(
        'Demonstrate strategic alignment',
        [
          'Strategy: Become cost leader in market',
          'Organizational objectives: Reduce cost 15% in 2 years',
          'Performance metrics: Cost per unit, waste percentage, efficiency ratios',
          'Systems: Process improvement initiatives, incentives tied to cost reduction',
          'People: Training on lean methods, rewards for ideas',
          'Result: Entire organization focused on achieving strategy'
        ],
        'Strategic alignment coordinates all elements toward strategy execution'
      )
    };
  },
};

// ==================== MAIN EXPORT ====================

export const generateApmProblem = (skillId) => {
  const gen = generators[skillId];
  if (!gen) {
    const skill = APM_SKILLS[skillId];
    return { question: `Practice: ${skill?.name || skillId}`, answer: '1', hint: 'Answer 1 to continue' };
  }
  try {
    return gen();
  } catch (e) {
    console.warn(`APM Problem generator error for ${skillId}:`, e);
    return { question: `Practice: ${APM_SKILLS[skillId]?.name || skillId}`, answer: '1' };
  }
};

// Generate a worked example for a specific skill
export const generateApmWorkedExample = (skillId) => {
  const problem = generateApmProblem(skillId);
  return problem.workedExample || null;
};

export default generateApmProblem;
