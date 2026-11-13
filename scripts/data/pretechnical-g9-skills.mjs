// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 9: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/pre_technical/g9.json by scripts/build-pretechnical-g9.mjs. KICD's outcomes and rubrics are never touched.
// KICD's outcome codes begin 'PRE_.G9.'; the skill codes of this subject-grade begin 'PRET.G9.' (the registry needs four capitals).
// Built: the knowledge outcomes (safety on raised platforms, hazardous substances, talents, oblique projection, wood, waste, holding and
// driving tools, projects, financial institutions, government in business, business plans) that a tapped question can test. Working at
// height, handling substances, using tools, drawing, making and filling in a plan are practical and marked by the teacher.
// Safety: raised platforms, hazardous substances and tools are used only with a teacher; questions ask for names, reasons and order.
// Everything is draft until a CBC Pre-Technical teacher reviews it. Safety, tax and finance statements are to be confirmed by a teacher.
// A skill: [sub-strand key after 'PRE_.G9.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const RP = 'FOUNDA.SAFETY_ON_RAISED_PLATFOR', HZ = 'FOUNDA.HANDLING_HAZARDOUS_SUBST', SE = 'FOUNDA.SELF_EXPLORATION_AND_CAR';
const OB = 'COMMUN.OBLIQUE_PROJECTION', VP = 'COMMUN.VISUAL_PROGRAMMING', WD = 'MATERI.WOOD', WS = 'MATERI.HANDLING_WASTE_MATERIALS';
const HT = 'TOOLS_.HOLDING_TOOLS', DT = 'TOOLS_.DRIVING_TOOLS', PJ = 'TOOLS_.PROJECT', FS = 'ENTREP.FINANCIAL_SERVICES', GB = 'ENTREP.GOVERNMENT_AND_BUSINESS', BP = 'ENTREP.BUSINESS_PLAN';
const FM = ['pick the right answer', 'pick the right answer in a short story', 'find the false step in a learner\'s reason'];
export const SKILLS = [
  [RP, 'RAISED_PLATFORMS', 'Name raised platforms and the risks of working on them', ['a', 'b'], [], FM, 'The child names ladders, step ladders, scaffolds and platforms, and the risks (falling, things falling on people below, a platform giving way), and says work at height is done only with a teacher or a trained adult and a helper.'],
  [HZ, 'HAZARD_CLASSIFY', 'Name and classify hazardous substances', ['a', 'b'], [], FM, 'The child names hazardous substances at home and school (petrol, paraffin, bleach, acids, pesticides) and classifies them as flammable (catches fire), corrosive (eats away), toxic (poisons) or irritant, using the label.'],
  [HZ, 'HAZARD_HANDLING', 'Describe safe ways of handling hazardous substances', ['c'], ['HAZARD_CLASSIFY'], FM, 'The child says to read the label, keep them in their own labelled containers out of reach of young children, never mix them, never eat or drink near them, wear gloves, use them in fresh air, and ask a teacher or adult for anything dangerous.'],
  [SE, 'TALENTS', 'Relate talents to careers and tell ethical from unethical use', ['a', 'b', 'c'], [], FM, 'The child says talents grow by practice and guidance, links a talent to careers (drawing to design, running to athletics, kindness to nursing), and tells ethical use (honesty, fair play) from unethical (cheating, using a talent to harm).'],
  [OB, 'OBLIQUE', 'Describe oblique projection', ['a'], [], FM, 'The child says in oblique drawing the front face is drawn true shape and the depth is shown by sloping lines, usually at 45 degrees, and that in cabinet projection the depth is drawn half size while in cavalier it is full size.'],
  [VP, 'VISUAL_APPS', 'Name application areas of visual programming', ['a'], [], FM, 'The child names games, animations, simple phone apps, quizzes and controlling a device as uses of visual programming, and says blocks are joined so that the problem is solved step by step.'],
  [WD, 'WOOD_TYPES', 'Classify wood and match types to uses', ['a', 'c'], [], FM, 'The child says hardwoods (mahogany, mvule, teak) come from broad-leaved trees that grow slowly, softwoods (pine, cypress) come from cone-bearing trees that grow faster, and manufactured boards (plywood, blockboard, chipboard) are made from wood layers or chips, and matches furniture, doors and building to them.'],
  [WD, 'WOOD_PREP', 'Describe the preparation of wood for use', ['b'], ['WOOD_TYPES'], FM, 'The child says logs are sawn into planks, the planks are seasoned (dried) so they do not warp or rot, then planed smooth and treated with a preservative or varnish.'],
  [WS, 'WASTE', 'Name and handle waste materials safely', ['a', 'b', 'c'], [], FM, 'The child names organic, plastic, metal, glass, paper and electronic waste, says to sort it, reduce, reuse and recycle, compost organic waste, and never burn plastic or leave sharp or hazardous waste where people can touch it.'],
  [HT, 'HOLDING_TOOLS', 'Name holding tools and choose one for a task', ['a', 'b', 'd'], [], FM, 'The child names the bench vice, G-clamp, hand vice, pliers and tongs, and says holding tools keep the work still so it can be cut or drilled safely, and that they are cleaned and oiled after use.'],
  [DT, 'DRIVING_TOOLS', 'Name driving tools and choose one for a task', ['a', 'b', 'd'], [], FM, 'The child says a hammer drives nails, a mallet drives chisels, a screwdriver drives screws (flat or cross head to match the screw), and a spanner turns nuts and bolts, and that tools are kept clean and stored safely.'],
  [PJ, 'PROJECT_STEPS', 'Put the steps of a project in order', ['a', 'b'], [], FM, 'The child says a project starts by identifying a problem, then selecting an item to make, planning, making it from local materials, testing it and reporting what was learnt.'],
  [FS, 'FIN_TYPES', 'Name and classify financial institutions in Kenya', ['a', 'b'], [], FM, 'The child names commercial banks, microfinance institutions, SACCOs, insurance companies and mobile money providers as financial institutions, and says the Central Bank of Kenya supervises the banks.'],
  [FS, 'FIN_SERVICES', 'Name the services financial institutions offer', ['c'], ['FIN_TYPES'], FM, 'The child names savings, loans, insurance, money transfer and payments as services, and says a loan must be repaid with interest and savings should be kept for planned needs.'],
  [GB, 'GOV_BUSINESS', 'Say why and how government is involved in business', ['a', 'b'], [], FM, 'The child says government protects customers, collects tax, sets standards and licences, and helps business with roads, power and training, and that businesses must follow the law.'],
  [GB, 'TAXES', 'Name types of taxes and e-Government services', ['c', 'd'], ['GOV_BUSINESS'], FM, 'The child names income tax (PAYE), value added tax (VAT), customs duty and excise duty, says taxes pay for public services, and names eCitizen and the KRA online service as e-Government services.'],
  [BP, 'BUSINESS_PLAN', 'Name the importance and components of a business plan', ['a', 'b'], [], FM, 'The child says a business plan guides the owner, helps to get a loan and measures progress, and names the business idea, the market, the marketing plan, the people and the money plan (costs and expected income) as components.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_PT9_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('RAISED_PLATFORMS', 'RP_SAFE', 'Thinks climbing alone is safe.', 'Who should work on a raised platform?', 'A learner alone', 'A trained adult with a helper', 'Work at height needs a trained adult and a helper.'),
  m('RAISED_PLATFORMS', 'RP_RISK', 'Names the wrong risk.', 'Which is a risk of working at height?', 'Getting a cold', 'Falling', 'Falling is the main risk at height.'),
  m('RAISED_PLATFORMS', 'RP_TYPE', 'Names a non-platform.', 'Which is a raised platform?', 'A flat floor', 'A scaffold', 'A scaffold is a raised platform.'),
  m('HAZARD_CLASSIFY', 'HC_FLAMMABLE', 'Mixes flammable and corrosive.', 'Which word means catches fire easily?', 'Corrosive', 'Flammable', 'Flammable means catches fire easily.'),
  m('HAZARD_CLASSIFY', 'HC_CORROSIVE', 'Mixes corrosive and toxic.', 'Which word means eats away skin and metal?', 'Toxic', 'Corrosive', 'Corrosive substances eat away skin and metal.'),
  m('HAZARD_CLASSIFY', 'HC_PETROL', 'Calls petrol safe.', 'How is petrol classified?', 'Safe', 'Flammable', 'Petrol is flammable.'),
  m('HAZARD_HANDLING', 'HH_LABEL', 'Ignores labels.', 'What should you do before using a substance?', 'Open it at once', 'Read the label', 'Read the label first.'),
  m('HAZARD_HANDLING', 'HH_MIX', 'Mixes cleaners to be stronger.', 'What should you do with two cleaners?', 'Mix them to be stronger', 'Never mix them', 'Never mix cleaners.'),
  m('HAZARD_HANDLING', 'HH_STORE', 'Stores in a drink bottle.', 'How should paraffin be stored?', 'In a drink bottle on the table', 'In a labelled container out of reach', 'Store in a labelled container out of reach.'),
  m('TALENTS', 'TA_GROW', 'Thinks talents need no practice.', 'How do talents grow?', 'Without any effort', 'By practice and guidance', 'Talents grow by practice and guidance.'),
  m('TALENTS', 'TA_ETHIC', 'Calls cheating ethical.', 'Which is an ethical use of a talent?', 'Cheating to win', 'Playing fairly', 'Fair play is ethical.'),
  m('TALENTS', 'TA_CAREER', 'Links a wrong career.', 'Which career links to a talent for drawing?', 'Driver', 'Designer', 'Drawing links to design careers.'),
  m('OBLIQUE', 'OB_FRONT', 'Draws the front face distorted.', 'In oblique drawing the front face is drawn...', 'At an angle and distorted', 'True shape', 'The front face is true shape.'),
  m('OBLIQUE', 'OB_ANGLE', 'Gives the wrong angle.', 'At what angle are depth lines usually drawn?', '90 degrees', '45 degrees', 'Depth lines are usually at 45 degrees.'),
  m('OBLIQUE', 'OB_CABINET', 'Mixes cabinet and cavalier.', 'In cabinet projection the depth is...', 'Full size', 'Half size', 'In cabinet the depth is half size.'),
  m('VISUAL_APPS', 'VA_USE', 'Names a non-use.', 'Which can be made with visual programming?', 'A brick wall', 'A simple game', 'Games and apps can be made.'),
  m('VISUAL_APPS', 'VA_BLOCK', 'Thinks it needs only typing.', 'How is a program built in visual programming?', 'By typing every line', 'By joining blocks', 'Blocks are joined.'),
  m('VISUAL_APPS', 'VA_SOLVE', 'Thinks it solves nothing.', 'What can a visual program do?', 'Nothing useful', 'Solve a problem step by step', 'It solves problems step by step.'),
  m('WOOD_TYPES', 'WT_HARD', 'Calls pine a hardwood.', 'Which is a hardwood?', 'Pine', 'Mahogany', 'Mahogany is a hardwood.'),
  m('WOOD_TYPES', 'WT_SOFT', 'Calls mvule a softwood.', 'Which is a softwood?', 'Mvule', 'Pine', 'Pine is a softwood.'),
  m('WOOD_TYPES', 'WT_BOARD', 'Calls plywood solid wood.', 'What is plywood?', 'One solid plank', 'A board of glued wood layers', 'Plywood is made of glued layers.'),
  m('WOOD_PREP', 'WP_SEASON', 'Skips seasoning.', 'Why is timber seasoned?', 'To make it wet', 'To dry it so it does not warp', 'Seasoning dries timber.'),
  m('WOOD_PREP', 'WP_ORDER', 'Plans before sawing.', 'Which comes first in preparing wood?', 'Varnishing', 'Sawing the log into planks', 'Logs are sawn first.'),
  m('WOOD_PREP', 'WP_TREAT', 'Thinks treating spoils wood.', 'Why is wood treated with a preservative?', 'To make it rot', 'To protect it from rot and insects', 'Preservatives protect wood.'),
  m('WASTE', 'WS_BURN', 'Thinks burning plastic is fine.', 'What should be done with plastic waste?', 'Burn it', 'Sort and recycle it', 'Do not burn plastic.'),
  m('WASTE', 'WS_ORGANIC', 'Throws organic waste away.', 'What can be done with kitchen peelings?', 'Burn them', 'Make compost', 'Peelings make compost.'),
  m('WASTE', 'WS_SHARP', 'Leaves sharp waste out.', 'How should broken glass be handled?', 'Left on the path', 'Wrapped and disposed of safely', 'Wrap broken glass and dispose of it safely.'),
  m('HOLDING_TOOLS', 'HT_VICE', 'Gives the vice the wrong job.', 'What does a bench vice do?', 'Drives nails', 'Holds the work still', 'A vice holds the work.'),
  m('HOLDING_TOOLS', 'HT_CLAMP', 'Names a non-holding tool.', 'Which is a holding tool?', 'Hammer', 'G-clamp', 'A G-clamp is a holding tool.'),
  m('HOLDING_TOOLS', 'HT_CARE', 'Leaves tools dirty.', 'How should holding tools be cared for?', 'Left dirty in the rain', 'Cleaned and oiled', 'Clean and oil tools.'),
  m('DRIVING_TOOLS', 'DT_HAMMER', 'Says a hammer drives screws.', 'What does a hammer drive?', 'Screws', 'Nails', 'A hammer drives nails.'),
  m('DRIVING_TOOLS', 'DT_SCREWDRIVER', 'Uses the wrong screwdriver head.', 'A cross-head screw needs...', 'A flat screwdriver', 'A cross-head screwdriver', 'Match the screwdriver to the screw head.'),
  m('DRIVING_TOOLS', 'DT_SPANNER', 'Says a spanner drives nails.', 'What does a spanner turn?', 'Nails', 'Nuts and bolts', 'A spanner turns nuts and bolts.'),
  m('PROJECT_STEPS', 'PJ_FIRST', 'Starts by making.', 'What is the first step of a project?', 'Make the item', 'Identify a problem', 'Start by identifying a problem.'),
  m('PROJECT_STEPS', 'PJ_TEST', 'Skips testing.', 'What comes after making the item?', 'Throwing it away', 'Testing it', 'Test the item.'),
  m('PROJECT_STEPS', 'PJ_MATERIAL', 'Says only bought materials.', 'Which materials are best for a school project?', 'Only costly imported ones', 'Locally available ones', 'Use local materials.'),
  m('FIN_TYPES', 'FT_NAME', 'Names a non-institution.', 'Which is a financial institution?', 'A butcher', 'A SACCO', 'A SACCO is a financial institution.'),
  m('FIN_TYPES', 'FT_CENTRAL', 'Gives the wrong job of the Central Bank.', 'What does the Central Bank of Kenya do?', 'Sells goods', 'Supervises banks', 'It supervises banks.'),
  m('FIN_TYPES', 'FT_INSURE', 'Calls insurance a bank.', 'Which gives cover against loss?', 'A commercial bank', 'An insurance company', 'Insurance companies give cover.'),
  m('FIN_SERVICES', 'FV_LOAN', 'Thinks a loan is free.', 'What must be done with a loan?', 'Never repay it', 'Repay it with interest', 'A loan is repaid with interest.'),
  m('FIN_SERVICES', 'FV_SAVE', 'Thinks savings should be spent at once.', 'What are savings for?', 'To spend at once', 'To keep for planned needs', 'Savings are for planned needs.'),
  m('FIN_SERVICES', 'FV_SERVICE', 'Names a non-service.', 'Which is a service of a bank?', 'Selling cattle', 'Keeping savings', 'Banks keep savings.'),
  m('GOV_BUSINESS', 'GV_PROTECT', 'Thinks government harms business only.', 'Why does government regulate business?', 'To harm business', 'To protect customers', 'Regulation protects customers.'),
  m('GOV_BUSINESS', 'GV_LICENCE', 'Thinks licences are unnecessary.', 'What do businesses need to operate legally?', 'No licence at all', 'A licence', 'Businesses need a licence.'),
  m('GOV_BUSINESS', 'GV_HELP', 'Names a non-help.', 'How does government help business?', 'By closing roads', 'By providing roads and power', 'Government provides roads and power.'),
  m('TAXES', 'TX_VAT', 'Gives the wrong tax name.', 'What does VAT stand for?', 'Very Added Tax', 'Value Added Tax', 'VAT is Value Added Tax.'),
  m('TAXES', 'TX_USE', 'Says taxes are kept by officials.', 'What are taxes used for?', 'Private spending', 'Public services', 'Taxes pay for public services.'),
  m('TAXES', 'TX_EGOV', 'Names a non-e-Government service.', 'Which is an e-Government service?', 'A shop', 'eCitizen', 'eCitizen is an e-Government service.'),
  m('BUSINESS_PLAN', 'BPL_IMPORT', 'Says a plan is a waste of time.', 'Why write a business plan?', 'It is a waste of time', 'It guides the owner and helps get a loan', 'A plan guides the owner.'),
  m('BUSINESS_PLAN', 'BPL_PART', 'Names a non-component.', 'Which is a component of a business plan?', 'A football score', 'The market', 'The market is a component.'),
  m('BUSINESS_PLAN', 'BPL_MONEY', 'Leaves money out.', 'Which part shows costs and income?', 'The title page', 'The money plan', 'The money plan shows costs and income.'),
];
