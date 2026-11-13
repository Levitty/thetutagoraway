// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 9, B (8 skills): holding tools, driving tools, project steps, financial institutions and services, government in
// business, taxes, business plans. Written offline. Every wrong answer names the library misconception it reveals. All stay reviewed:false
// until a CBC Pre-Technical teacher signs them off. Tools are used only with a teacher; tax and finance facts are to be confirmed.
// ============================================================================
import { S } from './pretechnical_g9_lib.js';
const HT = 'TOOLS_.HOLDING_TOOLS.', DT = 'TOOLS_.DRIVING_TOOLS.', PJ = 'TOOLS_.PROJECT.', FS = 'ENTREP.FINANCIAL_SERVICES.', GB = 'ENTREP.GOVERNMENT_AND_BUSINESS.', BP = 'ENTREP.BUSINESS_PLAN.';

export const FAMILIES = [
  ...S('ht', HT, 'HOLDING_TOOLS', ['HT_VICE', 'HT_CLAMP', 'HT_CARE'], ['A vice and a clamp hold the work still.', 'Clean and oil tools after use.'], [
    ['What does a bench vice do?', 'Holds the work still', 'Drives nails', 'Cuts wood', 'Measures length'],
    ['Which is a holding tool?', 'G-clamp', 'Hammer', 'Saw', 'Tape measure'],
    ['How should holding tools be cared for?', 'Cleaned and oiled', 'Left dirty in the rain', 'Dropped on the floor', 'Hidden in soil'],
    ['Which holding tool is used to hold hot metal?', 'Tongs', 'Hammer', 'Saw', 'Plane'],
    ['Why hold wood in a vice while sawing?', 'To keep it still and safe', 'To make it noisy', 'To make it wet', 'To make it bend'],
  ], [
    ['A learner must cut a plank. Which tool should hold it still?', 'A bench vice', 'A hammer', 'A screwdriver', 'A spanner'],
    ['A teacher joins two pieces of wood while glue dries. Which tool holds them?', 'A G-clamp', 'A hammer', 'A saw', 'A plane'],
    ['A tool is left to rust in the rain. What was missed?', 'Cleaning and oiling it', 'Throwing it away', 'Painting it red', 'Hiding it'],
    ['A smith lifts a hot rod from the fire. Which tool does he use?', 'Tongs', 'A hammer', 'A saw', 'A tape'],
    ['A small piece of metal is held while filing. Which tool is used?', 'A hand vice', 'A hammer', 'A spanner', 'A plane'],
  ], [
    ['Which step is the mistake?', 'Step 1: Work must not move while cutting.', 'Step 2: A vice holds it.', 'Step 3: So a vice drives nails.', 'A vice holds the work.', 2],
    ['Which step is the mistake?', 'Step 1: A G-clamp has a screw.', 'Step 2: It presses pieces together.', 'Step 3: So it is a driving tool.', 'It is a holding tool.', 2],
    ['Which step is the mistake?', 'Step 1: Steel tools can rust.', 'Step 2: Oil protects them.', 'Step 3: So we leave them dirty.', 'We clean and oil them.', 2],
    ['Which step is the mistake?', 'Step 1: Hot metal burns.', 'Step 2: Tongs keep hands away.', 'Step 3: So we hold hot metal with bare hands.', 'We use tongs.', 2],
    ['Which step is the mistake?', 'Step 1: Holding tools make work safe.', 'Step 2: Work stays still.', 'Step 3: So we need no holding tools.', 'Holding tools are useful.', 2],
  ], ['a', 'b']),
  ...S('dt', DT, 'DRIVING_TOOLS', ['DT_HAMMER', 'DT_SCREWDRIVER', 'DT_SPANNER'], ['A hammer drives nails; a screwdriver drives screws; a spanner turns nuts and bolts.', 'Match the tool to the job.'], [
    ['What does a hammer drive?', 'Nails', 'Screws', 'Nuts', 'Bolts'],
    ['A cross-head screw needs...', 'A cross-head screwdriver', 'A flat screwdriver only', 'A hammer', 'A saw'],
    ['What does a spanner turn?', 'Nuts and bolts', 'Nails', 'Wood', 'Paint'],
    ['What does a mallet drive?', 'A chisel', 'A nut', 'A bolt', 'A screw'],
    ['Which tool drives a screw?', 'Screwdriver', 'Hammer', 'Plane', 'Saw'],
  ], [
    ['A learner must fix a nail into a plank. Which tool does she use?', 'A hammer', 'A screwdriver', 'A spanner', 'A saw'],
    ['A learner has a screw with a flat slot. Which tool fits?', 'A flat screwdriver', 'A hammer', 'A spanner', 'A saw'],
    ['A cyclist must tighten a nut on a wheel. Which tool does he use?', 'A spanner', 'A hammer', 'A plane', 'A saw'],
    ['A carpenter taps a chisel gently. Which tool does she use?', 'A mallet', 'A saw', 'A spanner', 'A tape'],
    ['A hammer is left in the rain and gets rusty. How should tools be cared for?', 'Cleaned, dried and stored safely', 'Left outside', 'Painted wet', 'Dropped in a pit'],
  ], [
    ['Which step is the mistake?', 'Step 1: A hammer has a heavy head.', 'Step 2: It drives nails.', 'Step 3: So it drives screws.', 'A hammer drives nails.', 2],
    ['Which step is the mistake?', 'Step 1: Screws have heads of different shapes.', 'Step 2: The driver must fit.', 'Step 3: So any screwdriver fits any screw.', 'Match the driver to the screw head.', 2],
    ['Which step is the mistake?', 'Step 1: A spanner grips a nut.', 'Step 2: It turns the nut.', 'Step 3: So a spanner drives nails.', 'A spanner turns nuts and bolts.', 2],
    ['Which step is the mistake?', 'Step 1: A mallet is soft-faced.', 'Step 2: It drives chisels.', 'Step 3: So a mallet cuts wood.', 'A mallet drives a chisel.', 2],
    ['Which step is the mistake?', 'Step 1: Tools wear out.', 'Step 2: Care makes them last.', 'Step 3: So we leave them in the rain.', 'We clean and store them.', 2],
  ], ['a', 'b']),
  ...S('pj', PJ, 'PROJECT_STEPS', ['PJ_FIRST', 'PJ_TEST', 'PJ_MATERIAL'], ['Identify a problem, select an item, plan, make, test, report.', 'Use locally available materials.'], [
    ['What is the first step of a project?', 'Identify a problem', 'Make the item', 'Sell the item', 'Test the item'],
    ['What comes after making the item?', 'Testing it', 'Throwing it away', 'Hiding it', 'Forgetting it'],
    ['Which materials are best for a school project?', 'Locally available ones', 'Only costly imported ones', 'Only stolen ones', 'Only dangerous ones'],
    ['What comes just before making the item?', 'Planning', 'Testing', 'Reporting', 'Selling'],
    ['Why test an item?', 'To see if it solves the problem', 'To spoil it', 'To hide it', 'To throw it away'],
  ], [
    ['A class sees that litter fills their school compound. What is the first step in a project?', 'Identify the problem', 'Make a bin', 'Test the bin', 'Report the result'],
    ['The class has made a rubbish bin. What should they do next?', 'Test it', 'Throw it away', 'Hide it', 'Forget it'],
    ['A class makes a chair from old crates and wood offcuts. What kind of materials are these?', 'Local, available materials', 'Costly imported materials', 'Stolen materials', 'No materials'],
    ['The class decides to make a bin. What is this step?', 'Selecting an item', 'Testing', 'Reporting', 'Selling'],
    ['The class writes what they learnt. Which step is this?', 'Reporting', 'Planning', 'Identifying the problem', 'Making'],
  ], [
    ['Which step is the mistake?', 'Step 1: A project solves a problem.', 'Step 2: The problem is found first.', 'Step 3: So we start by making the item.', 'We start by identifying the problem.', 2],
    ['Which step is the mistake?', 'Step 1: The item is made.', 'Step 2: We check it works.', 'Step 3: So we skip testing.', 'We test the item.', 2],
    ['Which step is the mistake?', 'Step 1: Materials cost money.', 'Step 2: Local materials are easy to find.', 'Step 3: So only imported materials are allowed.', 'Local materials are best.', 2],
    ['Which step is the mistake?', 'Step 1: We plan before making.', 'Step 2: A plan lists steps and materials.', 'Step 3: So planning comes after making.', 'Planning comes before making.', 2],
    ['Which step is the mistake?', 'Step 1: A report shares what we learnt.', 'Step 2: It comes at the end.', 'Step 3: So it comes first.', 'It comes last.', 2],
  ], ['a', 'b']),
  ...S('ft', FS, 'FIN_TYPES', ['FT_NAME', 'FT_CENTRAL', 'FT_INSURE'], ['Banks, SACCOs, microfinance institutions and insurance companies are financial institutions.', 'The Central Bank supervises banks.'], [
    ['Which is a financial institution?', 'A SACCO', 'A butcher', 'A tailor', 'A kiosk'],
    ['What does the Central Bank of Kenya do?', 'Supervises banks', 'Sells goods', 'Grows crops', 'Repairs roads'],
    ['Which gives cover against loss?', 'An insurance company', 'A commercial bank', 'A shop', 'A school'],
    ['Which is a financial institution?', 'A microfinance institution', 'A bakery', 'A garage', 'A cinema'],
    ['Which is a commercial bank?', 'A bank that takes savings and gives loans', 'A shop that sells bread', 'A school that teaches', 'A farm that grows maize'],
  ], [
    ['A group of workers save together and lend to each other. What is it?', 'A SACCO', 'A butcher', 'A tailor', 'A kiosk'],
    ['Which body keeps an eye on all the banks in Kenya?', 'The Central Bank of Kenya', 'A shop', 'A farm', 'A school'],
    ['A farmer insures his cows against disease. Which institution does he use?', 'An insurance company', 'A bakery', 'A garage', 'A cinema'],
    ['A small trader takes a small loan from a lender that serves the poor. What is it?', 'A microfinance institution', 'A bakery', 'A garage', 'A cinema'],
    ['A person sends money by phone. Which provider does this?', 'A mobile money provider', 'A butcher', 'A tailor', 'A kiosk'],
  ], [
    ['Which step is the mistake?', 'Step 1: Financial institutions handle money.', 'Step 2: A SACCO is one.', 'Step 3: So a butcher is one.', 'A butcher is not a financial institution.', 2],
    ['Which step is the mistake?', 'Step 1: The Central Bank is a regulator.', 'Step 2: It supervises banks.', 'Step 3: So it sells goods.', 'It supervises banks.', 2],
    ['Which step is the mistake?', 'Step 1: Insurance covers loss.', 'Step 2: A company provides it.', 'Step 3: So a bank provides insurance only.', 'An insurance company provides cover.', 2],
    ['Which step is the mistake?', 'Step 1: Microfinance serves small traders.', 'Step 2: It gives small loans.', 'Step 3: So it is a bakery.', 'It is a financial institution.', 2],
    ['Which step is the mistake?', 'Step 1: Mobile money moves cash.', 'Step 2: It uses phones.', 'Step 3: So it is not a financial service.', 'It is a financial service.', 2],
  ], ['a', 'b']),
  ...S('fv', FS, 'FIN_SERVICES', ['FV_LOAN', 'FV_SAVE', 'FV_SERVICE'], ['A loan is repaid with interest.', 'Savings are kept for planned needs.'], [
    ['What must be done with a loan?', 'Repay it with interest', 'Never repay it', 'Give it away', 'Lose it'],
    ['What are savings for?', 'To keep for planned needs', 'To spend at once', 'To hide from the owner', 'To throw away'],
    ['Which is a service of a bank?', 'Keeping savings', 'Selling cattle', 'Cooking food', 'Making shoes'],
    ['What is interest on a loan?', 'An extra amount paid for borrowing', 'A gift from the bank', 'A free present', 'A kind of tax only'],
    ['Which is a service of an insurance company?', 'Giving cover against loss', 'Selling bread', 'Teaching classes', 'Fixing cars'],
  ], [
    ['Achieng takes a loan to buy a sewing machine. What must she do?', 'Repay it with interest', 'Never repay it', 'Give the machine away', 'Forget about it'],
    ['Wekesa earns money and wants to buy a bicycle next year. What should he do?', 'Save for it', 'Spend it all at once', 'Hide it in a river', 'Give it away'],
    ['A trader keeps her shop money safely at a bank. Which service is this?', 'Savings', 'A loan', 'Insurance', 'Tax'],
    ['A farmer pays a small amount each month so a loss is covered. Which service is this?', 'Insurance', 'A loan', 'Savings only', 'Tax'],
    ['A learner says a loan is free money. What can you tell her?', 'It must be repaid with interest', 'She is right', 'It is a gift', 'It is a prize'],
  ], [
    ['Which step is the mistake?', 'Step 1: A loan is borrowed money.', 'Step 2: It is repaid with interest.', 'Step 3: So a loan need not be repaid.', 'A loan must be repaid.', 2],
    ['Which step is the mistake?', 'Step 1: Savings build up over time.', 'Step 2: They help with planned needs.', 'Step 3: So savings should be spent at once.', 'Savings are for planned needs.', 2],
    ['Which step is the mistake?', 'Step 1: Banks offer services.', 'Step 2: Keeping savings is one.', 'Step 3: So selling cattle is a bank service.', 'Banks keep savings.', 2],
    ['Which step is the mistake?', 'Step 1: Interest is an extra amount.', 'Step 2: Borrowers pay it.', 'Step 3: So the bank pays it to the borrower.', 'The borrower pays interest.', 2],
    ['Which step is the mistake?', 'Step 1: Insurance covers loss.', 'Step 2: A premium is paid.', 'Step 3: So insurance is free for ever.', 'A premium is paid.', 2],
  ], ['c', 'c']),
  ...S('gv', GB, 'GOV_BUSINESS', ['GV_PROTECT', 'GV_LICENCE', 'GV_HELP'], ['Government protects customers, collects tax and sets standards.', 'Businesses need a licence.'], [
    ['Why does government regulate business?', 'To protect customers', 'To harm business', 'To close all shops', 'To waste time'],
    ['What do businesses need to operate legally?', 'A licence', 'No licence at all', 'A rumour', 'A secret'],
    ['How does government help business?', 'By providing roads and power', 'By closing roads', 'By cutting power for ever', 'By banning trade'],
    ['Which is a reason for government involvement in business?', 'To collect taxes', 'To spoil goods', 'To raise fears', 'To waste money'],
    ['Why does government set standards?', 'So goods are safe and good quality', 'So goods are unsafe to use at home', 'So goods are costly for everyone', 'So goods are hidden from buyers'],
  ], [
    ['A shop sells expired food. How does government protect customers?', 'It inspects shops and punishes this', 'It ignores the problem completely', 'It praises the shop for selling', 'It sells more expired food itself'],
    ['A trader opens a business without a licence. What is the problem?', 'He is breaking the law', 'Nothing is wrong', 'He is being clever', 'He is helping the government'],
    ['A new road makes it easy to bring goods to market. Who helped the business?', 'The government', 'Nobody', 'A rumour', 'The weather only'],
    ['A business pays tax every year. Why does government collect tax?', 'To pay for public services', 'To hide it away in a vault', 'To waste it on parties', 'To burn it in a big fire'],
    ['A bakery meets the standard set by the bureau. What does this show?', 'The bread is safe and of good quality', 'The bread is unsafe for eating', 'The bread is hidden from buyers', 'The bread is stolen from a shop'],
  ], [
    ['Which step is the mistake?', 'Step 1: Customers can be cheated.', 'Step 2: Government makes rules.', 'Step 3: So rules are meant to harm business.', 'Rules protect customers.', 2],
    ['Which step is the mistake?', 'Step 1: Businesses must register.', 'Step 2: They get a licence.', 'Step 3: So they need no licence.', 'They need a licence.', 2],
    ['Which step is the mistake?', 'Step 1: Roads help trade.', 'Step 2: Government builds roads.', 'Step 3: So government hinders business with roads.', 'Roads help business.', 2],
    ['Which step is the mistake?', 'Step 1: Government needs money.', 'Step 2: It collects taxes.', 'Step 3: So taxes are kept by officials.', 'Taxes pay for public services.', 2],
    ['Which step is the mistake?', 'Step 1: Standards protect users.', 'Step 2: Government sets them.', 'Step 3: So standards are optional for all.', 'Businesses must follow standards.', 2],
  ], ['a', 'b']),
  ...S('tx', GB, 'TAXES', ['TX_VAT', 'TX_USE', 'TX_EGOV'], ['VAT is Value Added Tax; taxes pay for public services.', 'eCitizen is an e-Government service.'], [
    ['What does VAT stand for?', 'Value Added Tax', 'Very Added Tax', 'Valued Added Trade', 'Value And Trade'],
    ['What are taxes used for?', 'Public services', 'Private spending only', 'Throwing away', 'Burning'],
    ['Which is an e-Government service?', 'eCitizen', 'A shop', 'A kiosk', 'A bus stage'],
    ['Which is a tax on a worker\'s income?', 'PAYE', 'VAT', 'Customs duty', 'Excise duty'],
    ['Which tax is paid on goods brought from another country?', 'Customs duty', 'PAYE', 'Land rates only', 'Parking fees only'],
  ], [
    ['A shop adds VAT to the price of goods. What does VAT mean?', 'Value Added Tax', 'Very Added Tax', 'Valued Added Trade', 'Value And Trade'],
    ['Taxes build roads and schools. What does this show?', 'Taxes pay for public services', 'Taxes are wasted', 'Taxes are hidden', 'Taxes are burnt'],
    ['A trader registers her business online. Which service does she use?', 'eCitizen', 'A kiosk', 'A bus stage', 'A shop'],
    ['A worker has tax deducted from his salary each month. Which tax is it?', 'PAYE', 'VAT', 'Customs duty', 'Excise duty'],
    ['Goods are imported through the port and taxed. Which tax is this?', 'Customs duty', 'PAYE', 'Land rates only', 'Parking fees only'],
  ], [
    ['Which step is the mistake?', 'Step 1: VAT is added to goods.', 'Step 2: Its full name is Value Added Tax.', 'Step 3: So VAT means Very Added Tax.', 'VAT is Value Added Tax.', 2],
    ['Which step is the mistake?', 'Step 1: Government collects taxes.', 'Step 2: It spends them on services.', 'Step 3: So taxes are for private spending.', 'Taxes pay for public services.', 2],
    ['Which step is the mistake?', 'Step 1: e-Government uses the internet.', 'Step 2: eCitizen is an example.', 'Step 3: So a kiosk is an e-Government service.', 'eCitizen is an e-Government service.', 2],
    ['Which step is the mistake?', 'Step 1: PAYE is paid from salary.', 'Step 2: It is an income tax.', 'Step 3: So PAYE is a tax on goods from abroad.', 'Customs duty is on imports.', 2],
    ['Which step is the mistake?', 'Step 1: Businesses should follow tax rules.', 'Step 2: Paying tax is lawful.', 'Step 3: So hiding sales is acceptable.', 'Businesses must pay the right tax.', 2],
  ], ['c', 'd']),
  ...S('bp', BP, 'BUSINESS_PLAN', ['BPL_IMPORT', 'BPL_PART', 'BPL_MONEY'], ['A business plan guides the owner and helps get a loan.', 'The money plan shows costs and income.'], [
    ['Why write a business plan?', 'It guides the owner and helps get a loan', 'It is a waste of time', 'It hides the business', 'It stops sales'],
    ['Which is a component of a business plan?', 'The market', 'A football score', 'A weather report', 'A song'],
    ['Which part shows costs and income?', 'The money plan', 'The title page', 'The date', 'The cover'],
    ['Which part describes the customers?', 'The market', 'The money plan', 'The date', 'The cover'],
    ['Which part says how the goods will be promoted?', 'The marketing plan', 'The money plan', 'The date', 'The cover'],
  ], [
    ['A bank asks to see a business plan before giving a loan. Why?', 'It shows the business is well planned', 'It is a waste of time', 'It hides the business', 'It stops sales'],
    ['A learner lists her customers and competitors in her plan. Which part is this?', 'The market', 'The money plan', 'The date', 'The cover'],
    ['A learner estimates start-up costs and expected sales. Which part is this?', 'The money plan', 'The title page', 'The date', 'The cover'],
    ['A learner plans posters and radio adverts. Which part is this?', 'The marketing plan', 'The money plan', 'The date', 'The cover'],
    ['A learner says a plan is a waste of time. What can you tell her?', 'It guides the owner and measures progress', 'She is right', 'It stops sales', 'It hides the business'],
  ], [
    ['Which step is the mistake?', 'Step 1: A plan guides the owner.', 'Step 2: It helps to get a loan.', 'Step 3: So a plan is a waste of time.', 'A plan is useful.', 2],
    ['Which step is the mistake?', 'Step 1: A plan has components.', 'Step 2: The market is one.', 'Step 3: So a football score is a component.', 'A football score is not a component.', 2],
    ['Which step is the mistake?', 'Step 1: The money plan shows costs.', 'Step 2: It shows expected income.', 'Step 3: So it is the title page.', 'It is a part of the plan.', 2],
    ['Which step is the mistake?', 'Step 1: A marketing plan promotes goods.', 'Step 2: It may use posters.', 'Step 3: So it has nothing to do with customers.', 'It targets customers.', 2],
    ['Which step is the mistake?', 'Step 1: Progress needs measuring.', 'Step 2: A plan sets goals.', 'Step 3: So a plan cannot measure progress.', 'A plan helps measure progress.', 2],
  ], ['a', 'b']),
];
