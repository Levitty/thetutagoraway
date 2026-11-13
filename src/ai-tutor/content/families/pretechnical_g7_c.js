// ============================================================================
// GRADE 7 PRE-TECHNICAL STUDIES, ENTREPRENEURSHIP (8 skills): Introduction to Entrepreneurship, Production Unit and Financial Goals,
// with simple savings, cost and profit sums (money works out in code, never typed by hand). Written offline from the KICD 2024 design
// through the curriculum map. Every wrong answer names the library misconception it reveals. All stay reviewed:false until a
// teacher signs them off. Kenyan businesses: mama mboga, jua kali, posho mill, salon, cybercafe, M-Pesa agent.
// ============================================================================
import { fam, choose, spot, c, sp } from './pretechnical_g7_lib.js';

const EN = 'ENTREP.INTRODUCTION_TO_ENTREPRE.', UN = 'ENTREP.UNIT.', FG = 'ENTREP.FINANCIAL_GOALS.';
const sh = (n) => `${n.toLocaleString('en-GB')} shillings`;

// ---- simple sums, computed
const WEEKS = [['Zawadi', 'school shoes', 1200, 100], ['Kamau', 'a football', 900, 150], ['Wanjiru', 'a school bag', 1500, 250], ['Otieno', 'a phone cover', 600, 50], ['Njeri', 'a school uniform', 2400, 300]];
const weekCases = WEEKS.map(([n, item, goal, wk]) => c(
  `${n} wants to buy ${item} for ${sh(goal)}. ${n} saves ${sh(wk)} every week. How many weeks will it take?`,
  `${goal / wk} weeks`, `Divide the goal by the weekly saving: ${goal} divided by ${wk} is ${goal / wk}.`,
  ['M_FN_ADD_WEEKS', `${goal + wk} weeks`, `${goal - wk} weeks`]));
const PROFIT1 = [['Wafula', 'a loaf of bread', 50, 60], ['Atieno', 'a bar of soap', 80, 100], ['Baraka', 'a packet of groundnuts', 15, 25], ['Wanjiru', 'a cabbage', 30, 45], ['Kiprop', 'a bunch of sukuma', 10, 20]];
const profit1Cases = PROFIT1.map(([n, item, b, s]) => c(
  `${n} buys ${item} for ${sh(b)} and sells it for ${sh(s)}. What is the profit on one?`,
  sh(s - b), `Profit is selling price minus buying price: ${s} minus ${b} is ${s - b}.`,
  ['M_FN_SELL_PROFIT', sh(s), sh(s + b)], ['M_FN_BUY_SELL', `a loss of ${sh(s - b)}`]));
const TOTAL = [['Wafula', 'loaves of bread', 20, 50, 60], ['Atieno', 'bars of soap', 10, 80, 100], ['Baraka', 'packets of groundnuts', 30, 15, 25], ['Wanjiru', 'cabbages', 12, 30, 45], ['Kiprop', 'bunches of sukuma', 25, 10, 20]];
const totalCases = TOTAL.map(([n, items, q, b, s]) => c(
  `${n} buys ${q} ${items} at ${sh(b)} each and sells them all at ${sh(s)} each. What is the total profit?`,
  sh(q * (s - b)), `Profit on one is ${s - b}, and ${q} sold gives ${q} times ${s - b}, which is ${q * (s - b)}.`,
  ['M_FN_ONE_ITEM', sh(s - b), sh(s)], ['M_FN_SELL_PROFIT', sh(q * s)]));

export const FAMILIES = [
  // ---------------------------------------------------------------- ENT_MEANING
  fam('en.mea.direct', `${EN}ENT_MEANING`, 'direct', 1, choose([
    c('Who is an entrepreneur?', 'Someone who starts a business', 'An entrepreneur sees a need or chance and takes the risk of a business.', ['M_EM_ALL_WORKERS', 'Anyone who has a job', 'Anyone who works for a salary'], ['M_EM_RICH_ONLY', 'Only a rich person']),
    c('Who can start a small business?', 'Anyone with an idea and a plan', 'Many businesses start small, such as a mandazi stall.', ['M_EM_RICH_ONLY', 'Only rich people', 'Only adults with a large shop'], ['M_EM_ALL_WORKERS', 'Only people with a job']),
    c('How does a posho mill help its community?', 'It makes jobs, grinds maize and pays taxes', 'Businesses help the whole community.', ['M_EM_OWNER_ONLY', 'Only the owner gains', 'It helps nobody but the owner'], ['M_EM_RICH_ONLY', 'It helps only the rich']),
    c('Which of these is an entrepreneur?', 'A woman who starts a mandazi stall', 'She starts and runs a business.', ['M_EM_ALL_WORKERS', 'A bus conductor paid a salary', 'A teacher paid a salary'], ['M_EM_RICH_ONLY', 'A person with a bank full of money']),
    c('Why does entrepreneurship matter in a community?', 'It makes jobs and goods', 'Businesses give work and things people need.', ['M_EM_OWNER_ONLY', 'It matters only to the owner', 'It matters only to the bank'], ['M_EM_ALL_WORKERS', 'It matters only to workers']),
  ], { h: ['An entrepreneur starts and runs a business and takes the risk.', 'Businesses make jobs, goods and services, and pay taxes.'], s1: 'Think about what an entrepreneur does.' })),
  fam('en.mea.story', `${EN}ENT_MEANING`, 'word', 2, choose([
    c('Mama Atieno sees that her estate has no place to buy fresh milk, so she starts a milk kiosk. What is she?', 'An entrepreneur', 'She saw a need and started a business.', ['M_EM_ALL_WORKERS', 'An employee', 'A customer'], ['M_EM_RICH_ONLY', 'A rich person']),
    c('Baraka says only rich people can be entrepreneurs. What is a good reply?', 'Many start small with a good idea', 'Small businesses grow over time.', ['M_EM_RICH_ONLY', 'He is right, you need a lot of money', 'He is right, only banks start businesses'], ['M_EM_ALL_WORKERS', 'Only workers can be']),
    c('A salon in a village employs three young women and pays a county licence. How does it help the community?', 'It gives jobs and a service', 'A business helps more than the owner.', ['M_EM_OWNER_ONLY', 'It helps only the owner', 'It does not help anyone'], ['M_EM_RICH_ONLY', 'It helps only the rich']),
    c('Njeri works for a salary at a bank. Her friend runs her own shop. Who is the entrepreneur?', 'Her friend, with her own shop', 'An entrepreneur starts and runs a business.', ['M_EM_ALL_WORKERS', 'Njeri, because she works', 'Both, because both work'], ['M_EM_RICH_ONLY', 'Neither, they are not rich']),
    c('Otieno says a business helps only its owner. What does a posho mill also do?', 'It gives work and grinds maize', 'The community gains too.', ['M_EM_OWNER_ONLY', 'Nothing else', 'It only brings noise'], ['M_EM_ALL_WORKERS', 'It makes every person an owner']),
  ], { h: ['Who starts and runs the business?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide who the entrepreneur is and who gains.' })),
  fam('en.mea.spot', `${EN}ENT_MEANING`, 'spot', 3, spot([
    sp('Juma says every worker is an entrepreneur. Which step has the mistake?', 'Step 1: Juma knows a conductor works on a bus.', 'Step 2: The conductor gets a salary.', 'Step 3: He says the conductor is an entrepreneur.', 'An entrepreneur starts and runs a business. A conductor works for someone else.', 'M_EM_ALL_WORKERS'),
    sp('Lucy says only rich people can start a business. Which step has the mistake?', 'Step 1: Lucy sees a mandazi stall.', 'Step 2: It was started with a little money.', 'Step 3: She says only rich people can start one.', 'Anyone with an idea and a plan can start small.', 'M_EM_RICH_ONLY'),
    sp('Samuel says a business helps only the owner. Which step has the mistake?', 'Step 1: Samuel sees a posho mill.', 'Step 2: It employs two workers and grinds maize for the village.', 'Step 3: He says only the owner gains.', 'Workers and the village gain too.', 'M_EM_OWNER_ONLY'),
    sp('Eunice says an employee is an entrepreneur. Which step has the mistake?', 'Step 1: Eunice has a friend who is a nurse.', 'Step 2: The nurse is paid a salary.', 'Step 3: She says the nurse runs a business.', 'A nurse paid a salary works for someone else.', 'M_EM_ALL_WORKERS'),
    sp('Peter says only big firms are entrepreneurs. Which step has the mistake?', 'Step 1: Peter sees a big supermarket.', 'Step 2: He sees a girl selling eggs at the stage.', 'Step 3: He says the girl is not an entrepreneur.', 'She started and runs a small business, so she is an entrepreneur.', 'M_EM_RICH_ONLY'),
  ], { h: ['Which step says something that is not true?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against what an entrepreneur is.' })),

  // ---------------------------------------------------------------- ENT_QUALITIES
  fam('en.qua.direct', `${EN}ENT_QUALITIES`, 'direct', 1, choose([
    c('What is a calculated risk?', 'A risk taken after counting the cost', 'A good entrepreneur thinks first.', ['M_EQ_GAMBLE', 'Spending everything and hoping', 'A risk taken by luck'], ['M_EQ_LUCK', 'A risk that always works']),
    c('A first batch of soap did not sell. What does a determined entrepreneur do?', 'Find out why and try again', 'A determined person learns from failure.', ['M_EQ_GIVE_UP', 'Give up', 'Blame the customers and stop'], ['M_EQ_LUCK', 'Wait for luck']),
    c('Why does a business succeed?', 'Hard work, honesty and good planning', 'Effort and planning matter more than luck.', ['M_EQ_LUCK', 'Only luck', 'Only by chance'], ['M_EQ_CHEAT', 'By cheating customers']),
    c('A shopkeeper adds water to milk. Which quality is missing?', 'Honesty', 'Customers do not return after being cheated.', ['M_EQ_CHEAT', 'Creativity', 'Hard work'], ['M_EQ_GAMBLE', 'Risk-taking']),
    c('Which is a quality of a good entrepreneur?', 'Creativity and hard work', 'These help a business grow.', ['M_EQ_LUCK', 'Luck', 'Spending without planning'], ['M_EQ_GIVE_UP', 'Giving up at the first problem']),
  ], { h: ['Creative, hardworking, honest, determined, good at communicating, confident, counts the cost.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about the quality the person shows.' })),
  fam('en.qua.story', `${EN}ENT_QUALITIES`, 'word', 2, choose([
    c('Wanjiru designs new beaded earrings each month. Which quality does she show?', 'Creativity', 'She makes new ideas.', ['M_EQ_LUCK', 'Luck', 'Risk-taking only'], ['M_EQ_GAMBLE', 'A lucky guess']),
    c('Otieno\'s tomato stall fails in the rains. He studies why and moves the stall under a roof. Which quality?', 'Determination', 'He does not give up.', ['M_EQ_GIVE_UP', 'Giving up', 'Laziness'], ['M_EQ_LUCK', 'Luck']),
    c('Baraka puts all his savings in a business he has not researched. What is this?', 'A reckless guess, not a calculated risk', 'A calculated risk needs planning first.', ['M_EQ_GAMBLE', 'A calculated risk', 'The best way to succeed'], ['M_EQ_LUCK', 'A sure thing']),
    c('A hawker gives short change when customers do not count. Which quality is missing?', 'Honesty', 'Cheating loses customers.', ['M_EQ_CHEAT', 'Cleverness', 'Hard work'], ['M_EQ_GAMBLE', 'Risk-taking']),
    c('Njeri says she will succeed only if she is lucky. What is wrong?', 'Planning and hard work matter more than luck', 'Luck helps but effort decides.', ['M_EQ_LUCK', 'Nothing, success is only luck', 'Nothing, work does not matter'], ['M_EQ_GIVE_UP', 'She should quit now']),
  ], { h: ['What does the person do, and what quality is that?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide which quality is shown.' })),
  fam('en.qua.spot', `${EN}ENT_QUALITIES`, 'spot', 3, spot([
    sp('Juma says taking risks means being reckless. Which step has the mistake?', 'Step 1: Juma hears that entrepreneurs take risks.', 'Step 2: He knows some businesses fail.', 'Step 3: He says risk-taking means spending everything and hoping.', 'A good entrepreneur takes calculated risks after counting the cost.', 'M_EQ_GAMBLE'),
    sp('Lucy says a good entrepreneur gives up after the first failure. Which step has the mistake?', 'Step 1: Lucy sees a stall that lost money.', 'Step 2: The owner learns the reason.', 'Step 3: She says a good entrepreneur should give up.', 'A determined entrepreneur learns and tries again.', 'M_EQ_GIVE_UP'),
    sp('Samuel says success in business is only luck. Which step has the mistake?', 'Step 1: Samuel sees a busy shop.', 'Step 2: The owner opens early and keeps neat records.', 'Step 3: He says she is successful only by luck.', 'Hard work and planning matter most.', 'M_EQ_LUCK'),
    sp('Eunice says cheating customers is clever. Which step has the mistake?', 'Step 1: Eunice sees a seller add water to milk.', 'Step 2: The customers find out.', 'Step 3: She says this was clever business.', 'Cheating loses customers. Honesty keeps them.', 'M_EQ_CHEAT'),
    sp('Peter says an entrepreneur never counts the cost. Which step has the mistake?', 'Step 1: Peter sees a trader buy a lot of stock.', 'Step 2: He did not check if people will buy it.', 'Step 3: He says counting the cost is not needed.', 'A calculated risk counts the cost first.', 'M_EQ_GAMBLE'),
  ], { h: ['Which step is not true about entrepreneurs?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the qualities.' })),

  // ---------------------------------------------------------------- ENT_IDEAS
  fam('en.ide.direct', `${EN}ENT_IDEAS`, 'direct', 1, choose([
    c('What comes first when starting a business?', 'A good idea that meets a need', 'Money can start small.', ['M_EI_CAPITAL_FIRST', 'A lot of money', 'A big shop'], ['M_EI_NEW_ONLY', 'An idea nobody has ever had']),
    c('Can a business idea come from improving another business?', 'Yes, you can improve what others do', 'Better service or quality can be an idea.', ['M_EI_NEW_ONLY', 'No, it must be new', 'No, that is stealing'], ['M_EI_COPY_EXACT', 'Yes, by copying it exactly']),
    c('A kiosk next door sells airtime and does well. What is a good idea?', 'Look for a need not yet met', 'A second identical kiosk shares the same customers.', ['M_EI_COPY_EXACT', 'Copy it exactly beside it', 'Sell airtime at the same price next to it'], ['M_EI_CAPITAL_FIRST', 'Wait until you have a lot of money']),
    c('What can old tyres become in a business?', 'Sandals, flower pots or farm buckets', 'Waste can be reused into products.', ['M_EI_WASTE', 'Nothing, they are rubbish', 'Only something to burn'], ['M_EI_NEW_ONLY', 'Nothing new']),
    c('Which is a source of a business idea?', 'A problem in your community', 'A need is a chance for a business.', ['M_EI_CAPITAL_FIRST', 'A bag of money', 'A shop with no customers'], ['M_EI_NEW_ONLY', 'Something that does not exist anywhere']),
  ], { h: ['Ideas come from skills, needs, other businesses, waste, media and family.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about where ideas come from.' })),
  fam('en.ide.story', `${EN}ENT_IDEAS`, 'word', 2, choose([
    c('Atieno sees that her village has no place to charge phones. She starts a charging kiosk. Where did the idea come from?', 'A need in her community', 'A problem is a chance for a business.', ['M_EI_CAPITAL_FIRST', 'A lot of money', 'Copying another kiosk exactly'], ['M_EI_NEW_ONLY', 'An idea nobody had before']),
    c('Baraka turns old sacks into school bags and sells them. Where did the idea come from?', 'Reusing waste', 'Waste can be turned into products.', ['M_EI_WASTE', 'Rubbish cannot be used', 'Buying new cloth only'], ['M_EI_NEW_ONLY', 'An idea nobody else had']),
    c('Wanjiru says she cannot start a business because she has no money yet. What can she do first?', 'Find an idea and start small', 'Many start small and grow.', ['M_EI_CAPITAL_FIRST', 'Wait until she has a lot of money', 'Give up the idea'], ['M_EI_COPY_EXACT', 'Open exactly beside a big shop']),
    c('Otieno sees that a juice seller has long queues and starts a faster service. Where did the idea come from?', 'Improving what another business does', 'Better service can be an idea.', ['M_EI_NEW_ONLY', 'Nowhere, it is not an idea', 'A new idea no one has ever had'], ['M_EI_COPY_EXACT', 'Copying the juice seller exactly']),
    c('Njeri is good at braiding hair and starts a salon. What is the source of her idea?', 'Her own skill', 'Skills and hobbies are sources of ideas.', ['M_EI_CAPITAL_FIRST', 'Money', 'Copying a salon exactly'], ['M_EI_NEW_ONLY', 'An idea no one has had']),
  ], { h: ['Where did the idea start?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide the source of the idea.' })),
  fam('en.ide.spot', `${EN}ENT_IDEAS`, 'spot', 3, spot([
    sp('Juma says a business needs big money before it has an idea. Which step has the mistake?', 'Step 1: Juma sees a small stall.', 'Step 2: It started with a little money.', 'Step 3: He says money must come before an idea.', 'A good idea that meets a need comes first. Money can start small.', 'M_EI_CAPITAL_FIRST'),
    sp('Lucy says an idea must be completely new. Which step has the mistake?', 'Step 1: Lucy sees a shop with faster service.', 'Step 2: It improves on others.', 'Step 3: She says this is not a real idea.', 'Improving what others do is a good source of ideas.', 'M_EI_NEW_ONLY'),
    sp('Samuel says copying a neighbour exactly is a good idea. Which step has the mistake?', 'Step 1: Samuel sees a busy kiosk.', 'Step 2: He plans one next door selling the same things.', 'Step 3: He says this will bring many new customers.', 'It shares the same customers. Look for a need not yet met.', 'M_EI_COPY_EXACT'),
    sp('Eunice says waste has no use in business. Which step has the mistake?', 'Step 1: Eunice sees old tyres on a heap.', 'Step 2: A jua kali worker makes sandals from them.', 'Step 3: She says waste cannot make a business.', 'Waste can be reused into products that sell.', 'M_EI_WASTE'),
    sp('Peter says only ideas from far away work. Which step has the mistake?', 'Step 1: Peter sees a local need for phone charging.', 'Step 2: A kiosk fills it.', 'Step 3: He says local needs are not a source of ideas.', 'Needs in the community are a good source of ideas.', 'M_EI_NEW_ONLY'),
  ], { h: ['Which step says something not true about business ideas?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the sources of ideas.' })),

  // ---------------------------------------------------------------- UNIT_LOCATION
  fam('un.loc.direct', `${UN}UNIT_LOCATION`, 'direct', 1, choose([
    c('Where is a posho mill best placed?', 'Near homes that grow maize, with power', 'Customers and power matter most.', ['M_UL_TOWN_ALWAYS', 'In the town centre', 'Far from any home'], ['M_UL_ANYWHERE', 'Anywhere will do']),
    c('A site has cheap rent but no customers pass. What may happen?', 'The business may fail', 'Customers matter more than rent.', ['M_UL_CHEAP_ONLY', 'The business does well', 'Cheap rent guarantees success'], ['M_UL_ANYWHERE', 'Nothing, place never matters']),
    c('Does the place matter to a salon?', 'Yes, near customers and with power and water', 'A salon needs customers, power and water.', ['M_UL_ANYWHERE', 'No, anywhere will do', 'No, only the price matters'], ['M_UL_TOWN_ALWAYS', 'Only the town centre is any good']),
    c('Which is a factor in choosing where to place a welding workshop?', 'Nearness to customers and to power', 'Welding needs power and customers.', ['M_UL_CHEAP_ONLY', 'Only the cost of the rent', 'Only the colour of the building'], ['M_UL_TOWN_ALWAYS', 'It must be in town']),
    c('Why is a cybercafe placed near a school or market?', 'Many customers pass by', 'Customers are the first factor.', ['M_UL_ANYWHERE', 'It does not matter where it is', 'Because rent is cheapest there'], ['M_UL_TOWN_ALWAYS', 'All cybercafes must be in a city']),
  ], { h: ['Think of customers, raw materials, roads, power, water, safety, rent and the law.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about what the business needs.' })),
  fam('un.loc.story', `${UN}UNIT_LOCATION`, 'word', 2, choose([
    c('Atieno wants to open a barber shop. Which site is best?', 'A busy stage with power', 'Customers and power matter.', ['M_UL_CHEAP_ONLY', 'A quiet field with the cheapest rent', 'A site with no electricity'], ['M_UL_ANYWHERE', 'Any place will do']),
    c('A maize farmer starts a posho mill in the town centre, 15 kilometres from the maize farms. What is the problem?', 'Customers and maize are far away', 'Place matters for a mill.', ['M_UL_TOWN_ALWAYS', 'None, town is always best', 'Nothing, a mill does well anywhere'], ['M_UL_ANYWHERE', 'None, the place never matters']),
    c('Baraka chooses a shop site only because the rent is low. No customers pass. What went wrong?', 'He ignored customers', 'Cheap rent does not bring customers.', ['M_UL_CHEAP_ONLY', 'Nothing, low rent is enough', 'He should have chosen lower rent'], ['M_UL_ANYWHERE', 'Nothing, place does not matter']),
    c('Wanjiru wants a vegetable stall. Which site is best?', 'Beside a market where people shop', 'Customers come to markets.', ['M_UL_ANYWHERE', 'Any quiet corner', 'A back lane'], ['M_UL_CHEAP_ONLY', 'The cheapest corner far from people']),
    c('Otieno builds a welding workshop with no power nearby. What is the problem?', 'A welder needs power', 'Power is a factor for welding.', ['M_UL_ANYWHERE', 'None, a welder needs no power', 'None, any site will do'], ['M_UL_CHEAP_ONLY', 'The rent was too high']),
  ], { h: ['What does this business need nearby?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide what the site must have.' })),
  fam('un.loc.spot', `${UN}UNIT_LOCATION`, 'spot', 3, spot([
    sp('Juma says the town centre is always the best place. Which step has the mistake?', 'Step 1: Juma wants to start a posho mill.', 'Step 2: The maize farms are far from town.', 'Step 3: He says the town centre is still best.', 'A posho mill is best near its customers and power.', 'M_UL_TOWN_ALWAYS'),
    sp('Lucy says cheap rent is the only thing to think about. Which step has the mistake?', 'Step 1: Lucy finds a shop with cheap rent.', 'Step 2: No customers walk past.', 'Step 3: She says she will do well anyway.', 'Customers, power and safety matter too.', 'M_UL_CHEAP_ONLY'),
    sp('Samuel says a salon can be anywhere. Which step has the mistake?', 'Step 1: Samuel opens a salon far from homes.', 'Step 2: There is no water or power.', 'Step 3: He says place makes no difference.', 'A salon needs customers, water and power.', 'M_UL_ANYWHERE'),
    sp('Eunice says a barber shop needs no customers nearby. Which step has the mistake?', 'Step 1: Eunice opens a barber shop in an empty lane.', 'Step 2: No one passes.', 'Step 3: She says the place does not matter.', 'Customers nearby are the first factor.', 'M_UL_ANYWHERE'),
    sp('Peter says rent is the only factor for a cybercafe. Which step has the mistake?', 'Step 1: Peter finds cheap rent in a quiet area.', 'Step 2: Power often goes off there.', 'Step 3: He says rent is all that matters.', 'Power and customers matter too.', 'M_UL_CHEAP_ONLY'),
  ], { h: ['Which step ignores a factor that matters?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the factors of location.' })),

  // ---------------------------------------------------------------- UNIT_SIZE
  fam('un.siz.direct', `${UN}UNIT_SIZE`, 'direct', 1, choose([
    c('Is a big workshop always better than a small one?', 'No, it depends on capital and market', 'Size should match what the business can support.', ['M_US_BIGGER_BETTER', 'Yes, always', 'Yes, bigger earns more every time'], ['M_US_WISH_ONLY', 'It depends only on the owner\'s wish']),
    c('What limits the size of a business?', 'Capital, market, skills and the law', 'Many factors limit size.', ['M_US_WISH_ONLY', 'Only what the owner wants', 'Only the owner\'s dream'], ['M_US_BIGGER_BETTER', 'Nothing, it can grow without limit']),
    c('A village has 20 families. How big a bakery fits?', 'A small one', 'The market is small.', ['M_US_NO_MARKET', 'A very big one', 'A factory'], ['M_US_BIGGER_BETTER', 'The biggest possible']),
    c('Which is a factor that decides the size of a production unit?', 'The size of the market', 'A business sells only what customers buy.', ['M_US_NO_MARKET', 'The colour of the sign', 'The owner\'s age'], ['M_US_WISH_ONLY', 'What the owner dreams']),
    c('Why can starting small be wise?', 'It costs less and lets you learn', 'Small starts lower the risk.', ['M_US_BIGGER_BETTER', 'It is never wise, bigger is better', 'It always earns less'], ['M_US_WISH_ONLY', 'Because dreams are small']),
  ], { h: ['Size depends on capital, market, raw materials, labour, machines, space, management and the law.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about what limits the size.' })),
  fam('un.siz.story', `${UN}UNIT_SIZE`, 'word', 2, choose([
    c('Atieno has 5,000 shillings and wants to open a factory with ten machines. What is the problem?', 'Her capital is too small for that size', 'Capital limits size.', ['M_US_WISH_ONLY', 'None, size depends on what she wants', 'None, she can start big anyway'], ['M_US_BIGGER_BETTER', 'It is too small, she needs more machines']),
    c('Baraka opens a very big bakery in a village of 20 families. After a month most bread is left. What went wrong?', 'The market was too small for the size', 'Customers decide how much can be sold.', ['M_US_NO_MARKET', 'Nothing, big is always better', 'He did not make enough bread'], ['M_US_BIGGER_BETTER', 'He should have built an even bigger bakery']),
    c('Wanjiru starts with one sewing machine and adds another when orders grow. Why is this sensible?', 'Her size grows with her market and capital', 'She grows as customers and money allow.', ['M_US_BIGGER_BETTER', 'It is not sensible, she should start big', 'It is not sensible, small is bad'], ['M_US_WISH_ONLY', 'She did what she wished']),
    c('Otieno says a business can be any size he wants. What is wrong?', 'Capital, market and skills limit the size', 'Wishes do not pay for machines.', ['M_US_WISH_ONLY', 'Nothing, he decides alone', 'Nothing, size has no limits'], ['M_US_BIGGER_BETTER', 'He should wish for a bigger one']),
    c('Njeri has few skills in managing workers. Which size is best to start with?', 'A small one she can manage', 'Management skill limits size.', ['M_US_BIGGER_BETTER', 'A very big one with many workers', 'The biggest in town'], ['M_US_NO_MARKET', 'Whatever the market was last year']),
  ], { h: ['What does the business have: money, customers, skills?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide what limits the size.' })),
  fam('un.siz.spot', `${UN}UNIT_SIZE`, 'spot', 3, spot([
    sp('Juma says a bigger business is always better. Which step has the mistake?', 'Step 1: Juma sees a big workshop with no orders.', 'Step 2: The owner pays rent and wages.', 'Step 3: He says bigger is always better.', 'Size should match capital, market and skills.', 'M_US_BIGGER_BETTER'),
    sp('Lucy says size depends only on the owner\'s wish. Which step has the mistake?', 'Step 1: Lucy wants a huge shop.', 'Step 2: She has little money.', 'Step 3: She says her wish is enough.', 'Capital, market and skills also limit size.', 'M_US_WISH_ONLY'),
    sp('Samuel says the market does not matter. Which step has the mistake?', 'Step 1: Samuel opens a big bakery in a small village.', 'Step 2: Few people buy.', 'Step 3: He says the size of the market has nothing to do with it.', 'The market limits how much can be sold.', 'M_US_NO_MARKET'),
    sp('Eunice says a small start is a mistake. Which step has the mistake?', 'Step 1: Eunice sees a small stall.', 'Step 2: It lets the owner learn.', 'Step 3: She says starting small is always bad.', 'Starting small costs less and lowers the risk.', 'M_US_BIGGER_BETTER'),
    sp('Peter says capital does not limit size. Which step has the mistake?', 'Step 1: Peter has only 2,000 shillings.', 'Step 2: He wants ten machines.', 'Step 3: He says capital does not matter.', 'Capital limits the size of a business.', 'M_US_WISH_ONLY'),
  ], { h: ['Which step ignores a factor that limits size?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the factors of size.' })),

  // ---------------------------------------------------------------- FIN_GOALS
  fam('fg.goa.direct', `${FG}FIN_GOALS`, 'direct', 1, choose([
    c('Who needs financial goals?', 'Everyone who handles money', 'Even a little money is helped by a goal.', ['M_FI_RICH_ONLY', 'Only rich people', 'Only adults with a bank account'], ['M_FI_WISH', 'Only people with big wishes']),
    c('What makes a goal different from a wish?', 'A goal has a plan and a date', 'A wish says "I want"; a goal says how and when.', ['M_FI_WISH', 'Nothing, they are the same', 'A goal is bigger'], ['M_FI_RICH_ONLY', 'A goal costs more']),
    c('A learner has little money. What comes first?', 'School shoes, a need', 'Needs come before wants.', ['M_FI_WANTS_FIRST', 'A new game, a want', 'A toy'], ['M_FI_NO_TIME', 'Whatever comes first in the shop']),
    c('Which factors decide how soon a goal can be reached?', 'Income, cost and time', 'More time means smaller savings each week.', ['M_FI_NO_TIME', 'The colour of the notebook', 'The name of the shop'], ['M_FI_WANTS_FIRST', 'The newest wants']),
    c('Why do people set financial goals?', 'To plan, save and avoid wasting money', 'Goals give direction.', ['M_FI_WISH', 'To make wishes come true by wishing', 'Only to look wise'], ['M_FI_RICH_ONLY', 'Because they are rich']),
  ], { h: ['Goals give direction. They think of income, needs, cost and time.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about why and how goals are set.' })),
  fam('fg.goa.story', `${FG}FIN_GOALS`, 'word', 2, choose([
    c('Atieno says she wants a bicycle one day. Zawadi says she will save 200 shillings a week for 20 weeks to buy one. Whose is the goal?', 'Zawadi\'s, because it has a plan and a time', 'A goal has a plan and a date.', ['M_FI_WISH', 'Atieno\'s, because she wants it more', 'Both are the same'], ['M_FI_RICH_ONLY', 'Neither, they are not rich']),
    c('Baraka has 300 shillings. A friend wants him to buy a game, but his shoes are torn. What should come first?', 'The shoes, a need', 'Needs come before wants.', ['M_FI_WANTS_FIRST', 'The game, because it is fun', 'The game, because the friend asked'], ['M_FI_NO_TIME', 'Whichever is cheapest']),
    c('Wanjiru thinks only rich people set goals. What can you tell her?', 'Anyone who handles money can set a goal', 'A child saving for a shoe has a goal.', ['M_FI_RICH_ONLY', 'She is right, only rich people', 'She is right, you need a bank'], ['M_FI_WISH', 'Goals are just wishes']),
    c('Otieno wants to save 1,200 shillings but has not thought about how long it will take. What is missing?', 'The time, how long it will take', 'Time and income decide the weekly saving.', ['M_FI_NO_TIME', 'Nothing, time does not matter', 'Nothing, the amount is enough'], ['M_FI_WISH', 'Only a wish']),
    c('Njeri\'s goal helps her to stop wasting money on sweets. What does a goal do?', 'It gives direction and stops waste', 'A goal shows where the money should go.', ['M_FI_WISH', 'Nothing, it is only a wish', 'It makes sweets cheaper'], ['M_FI_RICH_ONLY', 'It makes her rich at once']),
  ], { h: ['Does it have a plan, an amount and a time?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide what makes it a goal.' }), 'b'),
  fam('fg.goa.spot', `${FG}FIN_GOALS`, 'spot', 3, spot([
    sp('Juma says financial goals are only for rich people. Which step has the mistake?', 'Step 1: Juma sees a child saving for a pen.', 'Step 2: She puts aside 10 shillings a day.', 'Step 3: He says she has no goal because she is not rich.', 'Everyone who handles money gains from a goal.', 'M_FI_RICH_ONLY'),
    sp('Lucy says a goal is the same as a wish. Which step has the mistake?', 'Step 1: Lucy wishes for a phone.', 'Step 2: Her friend plans to save for one by December.', 'Step 3: Lucy says both are the same.', 'A goal has a plan and a date. A wish does not.', 'M_FI_WISH'),
    sp('Samuel says wants come before needs. Which step has the mistake?', 'Step 1: Samuel has little money.', 'Step 2: His school shoes are torn.', 'Step 3: He says a new game must come first.', 'Needs come before wants when money is limited.', 'M_FI_WANTS_FIRST'),
    sp('Eunice says time has nothing to do with a saving goal. Which step has the mistake?', 'Step 1: Eunice wants to save 1,200 shillings.', 'Step 2: She saves 100 shillings a week.', 'Step 3: She says time makes no difference to when she reaches it.', 'Income and time decide how soon the goal is reached.', 'M_FI_NO_TIME'),
    sp('Peter says goals are only wishes. Which step has the mistake?', 'Step 1: Peter sees a plan to save 50 shillings a week.', 'Step 2: It will buy a bag in 10 weeks.', 'Step 3: He says it is only a wish.', 'It has an amount and a date, so it is a goal.', 'M_FI_WISH'),
  ], { h: ['Which step says something not true about financial goals?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against what a goal is.' })),

  // ---------------------------------------------------------------- FIN_SMART
  fam('fg.smt.direct', `${FG}FIN_SMART`, 'direct', 1, choose([
    c('What does the A in SMART stand for?', 'Achievable', 'SMART: Specific, Measurable, Achievable, Realistic, Time-bound.', ['M_SM_LETTERS', 'Ambitious', 'Amazing'], ['M_SM_NUMBER_ENOUGH', 'Amount']),
    c('Which is a SMART goal?', 'Save 1,200 shillings in 12 weeks by saving 100 shillings a week', 'It names an amount, a way and a date.', ['M_SM_VAGUE', 'Save more money', 'Be rich one day'], ['M_SM_NUMBER_ENOUGH', 'Save 1 million shillings from 100 shillings a week']),
    c('What does the T in SMART stand for?', 'Time-bound', 'A SMART goal has a date.', ['M_SM_LETTERS', 'Tough', 'Tricky'], ['M_SM_VAGUE', 'Tomorrow']),
    c('Which goal is NOT SMART?', 'Save more money', 'It has no amount and no date.', ['M_SM_VAGUE', 'Save 600 shillings in 6 weeks', 'Save 50 shillings a week for 10 weeks'], ['M_SM_NUMBER_ENOUGH', 'Save 500 shillings in 5 weeks']),
    c('A learner with 100 shillings a week aims to save 1 million shillings in a month. Is it SMART?', 'No, it is not realistic', 'A number is not enough: the goal must also be achievable.', ['M_SM_NUMBER_ENOUGH', 'Yes, it has a number', 'Yes, it has a date'], ['M_SM_VAGUE', 'Yes, it is specific']),
  ], { h: ['SMART: Specific, Measurable, Achievable, Realistic, Time-bound.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about which letters the goal meets.' })),
  fam('fg.smt.story', `${FG}FIN_SMART`, 'word', 2, choose([
    c('Atieno\'s goal is "I will save some money". Which part is missing?', 'An amount and a date', 'A SMART goal names how much and by when.', ['M_SM_VAGUE', 'Nothing, it is a good goal', 'Only the colour'], ['M_SM_LETTERS', 'The ambition']),
    c('Baraka\'s goal is "Save 1,800 shillings in 18 weeks by saving 100 shillings a week". Is it SMART?', 'Yes, it has an amount, a way and a date', 'It is specific, measurable and time-bound, and 100 a week is realistic.', ['M_SM_VAGUE', 'No, it is too specific', 'No, it has too many numbers'], ['M_SM_NUMBER_ENOUGH', 'It is only a number']),
    c('Wanjiru earns 200 shillings a week from mandazi. Her goal is to buy a 5 million shilling plot in a month. What is wrong?', 'It is not realistic for her income', 'A goal must be achievable and realistic.', ['M_SM_NUMBER_ENOUGH', 'Nothing, it has a number and a date', 'Nothing, big goals are best'], ['M_SM_VAGUE', 'It is not specific']),
    c('Otieno says SMART means Simple, Make, Achieve, Reward, Try. What is wrong?', 'The letters are Specific, Measurable, Achievable, Realistic, Time-bound', 'SMART has set meanings.', ['M_SM_LETTERS', 'Nothing, those are the words', 'The letters are the same, in another order'], ['M_SM_VAGUE', 'There are no set words']),
    c('Njeri\'s goal: "Save 3,000 shillings by 31 March by putting aside 250 shillings a week". Which letter is the date?', 'T, time-bound', 'The date makes it time-bound.', ['M_SM_LETTERS', 'S, specific', 'A, ambitious'], ['M_SM_VAGUE', 'M, many']),
  ], { h: ['Does the goal have an amount, a way and a date, and is it realistic?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Check each SMART letter.' })),
  fam('fg.smt.spot', `${FG}FIN_SMART`, 'spot', 3, spot([
    sp('Juma says "save more money" is a SMART goal. Which step has the mistake?', 'Step 1: Juma writes "save more money".', 'Step 2: It has no amount.', 'Step 3: He says it is SMART.', 'A SMART goal names an amount, a way and a date.', 'M_SM_VAGUE'),
    sp('Lucy says any goal with a number is SMART. Which step has the mistake?', 'Step 1: Lucy earns 100 shillings a week.', 'Step 2: Her goal is to save 1 million in a month.', 'Step 3: She says it is SMART because it has a number.', 'It is not realistic. A SMART goal must be achievable.', 'M_SM_NUMBER_ENOUGH'),
    sp('Samuel says A in SMART is for Ambitious. Which step has the mistake?', 'Step 1: Samuel learns SMART.', 'Step 2: He remembers S, M, A, R, T.', 'Step 3: He says A stands for Ambitious.', 'A stands for Achievable.', 'M_SM_LETTERS'),
    sp('Eunice says a goal needs no date. Which step has the mistake?', 'Step 1: Eunice writes "Save 600 shillings".', 'Step 2: She gives no date.', 'Step 3: She says it is SMART.', 'A SMART goal is time-bound: it needs a date.', 'M_SM_VAGUE'),
    sp('Peter says a big number makes a goal SMART. Which step has the mistake?', 'Step 1: Peter earns 50 shillings a week.', 'Step 2: He sets a goal of 500,000 shillings in a week.', 'Step 3: He says the big number makes it SMART.', 'It is not achievable or realistic, so it is not SMART.', 'M_SM_NUMBER_ENOUGH'),
  ], { h: ['Which step says something not true about SMART goals?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against SMART.' })),

  // ---------------------------------------------------------------- FIN_NUMBERS
  fam('fg.num.weeks', `${FG}FIN_NUMBERS`, 'direct', 1, choose(weekCases, { h: ['Divide the goal by the amount saved each week.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Work out how many times the weekly saving fits into the goal.' })),
  fam('fg.num.profit', `${FG}FIN_NUMBERS`, 'word', 2, choose([...profit1Cases, ...totalCases], { h: ['Profit on one is selling price minus buying price. Total profit is that times the number sold.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Work out the profit step by step.' })),
  fam('fg.num.spot', `${FG}FIN_NUMBERS`, 'spot', 3, spot([
    sp('Juma buys a bag for 400 shillings and sells it for 500. He says the profit is 500 shillings. Which step has the mistake?', 'Step 1: The buying price is 400 shillings.', 'Step 2: The selling price is 500 shillings.', 'Step 3: He says the profit is 500 shillings.', 'Profit is selling price minus buying price, which is 100 shillings.', 'M_FN_SELL_PROFIT'),
    sp('Lucy wants to save 1,200 shillings at 100 shillings a week. She says it takes 1,300 weeks. Which step has the mistake?', 'Step 1: The goal is 1,200 shillings.', 'Step 2: She saves 100 shillings a week.', 'Step 3: She adds 1,200 and 100 to get 1,300 weeks.', 'Divide 1,200 by 100 to get 12 weeks.', 'M_FN_ADD_WEEKS'),
    sp('Samuel earns 10 shillings profit on each of 20 loaves. He says the total profit is 10 shillings. Which step has the mistake?', 'Step 1: The profit on one loaf is 10 shillings.', 'Step 2: He sells 20 loaves.', 'Step 3: He says the total profit is 10 shillings.', 'Multiply 10 by 20 to get 200 shillings.', 'M_FN_ONE_ITEM'),
    sp('Eunice buys for 60 and sells for 75. She says the profit is minus 15 shillings. Which step has the mistake?', 'Step 1: The buying price is 60 shillings.', 'Step 2: The selling price is 75 shillings.', 'Step 3: She subtracts 75 from 60 and gets minus 15.', 'Subtract the buying price from the selling price: 75 minus 60 is 15 shillings profit.', 'M_FN_BUY_SELL'),
    sp('Peter sells 30 packets and makes 5 shillings profit on each. He says 30 shillings. Which step has the mistake?', 'Step 1: He sells 30 packets.', 'Step 2: He makes 5 shillings on each.', 'Step 3: He says the total profit is 30 shillings.', 'Multiply 5 by 30 to get 150 shillings.', 'M_FN_ONE_ITEM'),
  ], { h: ['Which step does the sum wrongly?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Redo each step.' })),
];
