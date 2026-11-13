// ============================================================================
// GRADE 7 SOCIAL STUDIES, PART B: slavery and servitude, the medium of trade, diversity, peaceful coexistence and
// community service learning (12 skills). Written offline from the KICD design through the curriculum map. The history of the
// Indian Ocean slave trade is told as commonly taught, respectfully, and stays "to confirm by a teacher". Options are about the
// same length so the right answer is never the longest. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g7_lib.js';

const SL = 'PEOPLE.SLAVERY_AND_SERVITUDE.', MT = 'PEOPLE.DEVELOPMENTS_IN_MEDIUM_O.', DV = 'PEOPLE.DIVERSITY_AND_INTERPERSO.', PE = 'PEOPLE.PEACEFUL_COEXISTENCE.', CS = 'COMMUN.COMMUNITY_SERVICE_LEARNI.';
const T = (head, rows) => ({ t: { head, rows } });

export const FAMILIES = [
  // ---------------------------------------------------------------- SL_FORMS
  fam('sl.fo.which', `${SL}SL_FORMS`, 'direct', 1, choose([
    Q('Which is true about slavery today?', 'It still exists in forms such as trafficking', w('SL_ONLY_PAST', 'It ended completely long ago', 'It exists only in books', 'It exists only in one country'), 'Slavery has not ended. It takes new forms, such as trafficking and forced labour.'),
    Q('What makes work servitude and not an ordinary job?', 'The person is forced and cannot leave', w('SL_SERVANT_PAID', 'The work is hard and tiring', 'The work is done for long hours', 'The work is done in a home'), 'Servitude means a person has no freedom to leave.'),
    Q('A man works for a lender without pay to clear a debt and cannot leave. What is this?', 'Debt bondage', w('SL_SERVANT_PAID', 'A normal job', 'A school holiday task', 'A paid apprenticeship'), 'Debt bondage is forced work to pay off a debt.'),
    Q('Which is a form of modern slavery?', 'Forcing children to work and giving no pay', w('SL_ONLY_PAST', 'A learner washing plates at home', 'A paid job on a farm', 'A pupil helping in the school garden'), 'Forced child labour takes away freedom and childhood.'),
    Q('What does slavery take away from a person?', 'Freedom and dignity', w('SL_ONLY_PAST', 'Only a person\'s home', 'Only a person\'s food', 'Only a person\'s money'), 'Slavery takes away a person\'s freedom and dignity.'),
  ], { h: ['Servitude means a person is forced and cannot leave.', 'It still exists in new forms today.'], s1: 'Ask: is the person free to leave?' })),
  fam('sl.fo.story', `${SL}SL_FORMS`, 'word', 2, choose([
    Q('Achieng works hard on her uncle\'s farm and is paid and may leave. Is this servitude?', 'No, because she is paid and free to leave', w('SL_SERVANT_PAID', 'Yes, because the work is hard', 'Yes, because she works for her own family', 'Yes, because she works every day'), 'Hard work alone is not servitude. Servitude means no freedom.'),
    Q('A girl is taken to a town, kept in a house and not allowed to leave or go to school. What is this?', 'Forced domestic servitude', w('SL_ONLY_PAST', 'A usual job for children', 'A school programme', 'A paid internship'), 'This is modern slavery. The child has lost her freedom.'),
    Q('Long ago, a family in some areas pledged a child to pay a debt. What did this show?', 'A form of servitude called pledging', w('SL_SERVANT_PAID', 'A way of paying the school fees owed', 'A kind of gift to a friend', 'A kind of holiday'), 'Pledging was a form of servitude to pay a debt.'),
    Q('People are tricked with a promise of jobs abroad and then forced to work. What is this?', 'Human trafficking', w('SL_ONLY_PAST', 'A normal move for work', 'A scholarship', 'A paid holiday'), 'Trafficking is a modern form of slavery.'),
    Q('Why is slavery against human dignity?', 'A person is treated as a thing to be owned', w('SL_ONLY_PAST', 'A person is given too much rest', 'A person earns too much money', 'A person has made too many close friends'), 'Slavery treats people as property.'),
  ], { h: ['Ask whether the person is free to leave and is paid fairly.', 'No freedom means servitude.'], s1: 'Ask: is the person free?' })),

  // ---------------------------------------------------------------- SL_INDIAN
  fam('sl.in.which', `${SL}SL_INDIAN`, 'direct', 1, choose([
    Q('Why were people bought in the Indian Ocean slave trade?', 'To work on plantations and in homes', w('SL_NO_DEMAND', 'Because nobody wanted workers', 'To sell them back at once for the same price', 'To make musical instruments'), 'Captives worked on plantations, in homes and on ships.'),
    Q('Who took part in the Indian Ocean slave trade?', 'Arab and Swahili traders and some leaders', w('SL_ONLY_EUROPE', 'Only traders who sailed from Europe in ships', 'Only the rulers of Egypt', 'Nobody at all'), 'The trade involved traders from Arabia, the coast and inland leaders.'),
    Q('Which crop grown near Zanzibar needed many workers?', 'Cloves', w('SL_NO_DEMAND', 'Tea', 'Pyrethrum', 'Wheat'), 'Clove plantations on Zanzibar needed many workers.'),
    Q('Which wind helped dhows to sail across the Indian Ocean?', 'The monsoon winds', w('SL_ONLY_EUROPE', 'The harmattan', 'The chinook', 'The sirocco'), 'The monsoons carried dhows between Africa and Arabia and India.'),
    Q('Which item was often carried along with captives on the trade routes?', 'Ivory', w('SL_NO_DEMAND', 'Machines from factories', 'Fuel for lamps only', 'Computers'), 'Ivory and captives were carried together.'),
  ], { h: ['Think of who needed workers and what carried the ships.', 'Plantations, homes and ports needed workers.'], s1: 'Think of who needed workers.' })),
  fam('sl.in.story', `${SL}SL_INDIAN`, 'word', 2, choose([
    Q('A learner says the Indian Ocean slave trade was run only by Europeans. What is the correct reply?', 'Traders from Arabia and the coast took part', w('SL_ONLY_EUROPE', 'The learner is correct', 'Only people from Africa took part in it', 'Nobody took part'), 'The Indian Ocean trade was largely run from Arabia and the Swahili coast.'),
    Q('Why did Zanzibar become a centre of the trade?', 'It was a busy port with clove plantations', w('SL_NO_DEMAND', 'It was far away from every trade route', 'It had no ships at all', 'It was cut off by high mountains'), 'Its port and plantations made it a centre.'),
    Q('Why did the trade grow in the 1800s?', 'Plantations needed more workers', w('SL_NO_DEMAND', 'People stopped using ships', 'Plantations closed', 'Traders had no interest'), 'Plantations on the islands and the coast needed workers.'),
    Q('Which routes did traders use to move captives to the coast?', 'Caravan routes from the interior to the coast', w('SL_ONLY_EUROPE', 'Railway lines from Mombasa', 'Air routes from Nairobi', 'Roads built by the colonial government'), 'Caravan routes linked the interior to the coast.'),
    Q('Why were ships called dhows important?', 'They carried goods and people across the ocean', w('SL_ONLY_EUROPE', 'They carried only fish', 'They carried only the soldiers of the rulers', 'They were used on land'), 'Dhows used the monsoon winds to cross the ocean.'),
  ], { h: ['Remember who needed workers and who carried them.', 'Plantations and ports pulled the trade.'], s1: 'Think of demand, routes and traders.' })),

  // ---------------------------------------------------------------- SL_EXTENT
  fam('sl.ex.table', `${SL}SL_EXTENT`, 'table', 1, choose([
    Q('Look at the table. Where did the Indian Ocean trade take captives?', 'To Arabia, India and the islands', w('SL_ATLANTIC_MIX', 'To North and South America and Europe', 'To Australia', 'To Antarctica'), 'The Indian Ocean trade went east and north. The Atlantic trade went to the Americas.',
      T(['Trade', 'Direction'], [['Indian Ocean trade', 'East and north, to Arabia, India, islands'], ['Atlantic trade', 'West, to the Americas']])),
    Q('Which coast was the centre of the Indian Ocean trade?', 'The east coast, with Zanzibar and Kilwa', w('SL_WEST_COAST', 'The west coast', 'The north coast of Egypt and Libya', 'The Sahara'), 'The Indian Ocean trade centred on the east coast.'),
    Q('Which town on the Kenya coast was part of the trade?', 'Mombasa', w('SL_WEST_COAST', 'Kisumu', 'Nakuru', 'Eldoret'), 'Mombasa was a coastal town linked to the trade.'),
    Q('Which was a main destination of the Indian Ocean trade?', 'Arabia', w('SL_ATLANTIC_MIX', 'Brazil', 'Cuba', 'Jamaica'), 'The Indian Ocean trade took captives to Arabia, India and the islands.'),
    Q('Which describes the reach of the trade into the interior?', 'It reached as far as Lake Victoria and the Congo basin', w('SL_WEST_COAST', 'It stayed on the beaches and ports of the coast only', 'It reached only the Sahara desert', 'It reached only the shores of West Africa'), 'Caravans went deep into the interior.'),
  ], { h: ['Which ocean is on the east of Africa?', 'The Indian Ocean trade centred on the east coast.'], s1: 'Think of the ocean and the coast.' })),
  fam('sl.ex.story', `${SL}SL_EXTENT`, 'word', 2, choose([
    Q('A learner says most captives from Kilwa were sent to Brazil. What is wrong?', 'Most Kilwa captives went to Arabia, India and islands', w('SL_ATLANTIC_MIX', 'Nothing is wrong at all', 'They were sent to Egypt and North Africa only', 'They were sent to Europe'), 'Brazil was a destination of the Atlantic trade.'),
    Q('Which island was a centre of the Indian Ocean trade?', 'Zanzibar', w('SL_WEST_COAST', 'Goree', 'Madeira', 'Bioko'), 'Zanzibar was the great centre. Goree is on the west coast.'),
    Q('The Indian Ocean trade reached which sea in the north-east of Africa?', 'The Red Sea', w('SL_WEST_COAST', 'The Mediterranean', 'The Atlantic', 'The Caspian Sea'), 'The Red Sea linked Africa to Arabia.'),
    Q('Which direction did dhows carry captives from East Africa?', 'North and east, across the ocean', w('SL_ATLANTIC_MIX', 'South to the Antarctic', 'West across the whole Atlantic', 'Straight up the Nile'), 'Dhows went north and east.'),
    Q('Which region today was part of the Indian Ocean trade?', 'The Swahili coast of East Africa', w('SL_WEST_COAST', 'The Atlantic coast of Ghana', 'The coast of Senegal', 'The Atlas Mountains of the north'), 'The Swahili coast was a main region.'),
  ], { h: ['Think of the Indian Ocean, not the Atlantic.', 'East coast, then Arabia, India and islands.'], s1: 'Think of the east coast and the ocean.' })),

  // ---------------------------------------------------------------- MT_COMPARE
  fam('mt.co.which', `${MT}MT_COMPARE`, 'direct', 1, choose([
    Q('What is barter trade?', 'Swapping goods for goods', w('MT_BARTER_MONEY', 'Buying goods with coins', 'Buying goods with notes', 'Selling goods on credit'), 'Barter uses no money. Goods are swapped for goods.'),
    Q('What is a problem of barter trade?', 'Both people must want what the other has', w('MT_BARTER_NO_PROBLEM', 'Nothing, it worked perfectly', 'Prices were always the same', 'Goods never went bad'), 'Both people must want the other\'s goods, which is hard.'),
    Q('Why is money easier to use than barter?', 'It is a common measure that all accept', w('MT_BARTER_NO_PROBLEM', 'It is much heavier than all goods', 'It goes bad quickly', 'It cannot be divided'), 'Money is accepted by all and is easy to divide.'),
    Q('Which good would be hard to use in barter because it cannot be divided?', 'A cow, if you need only a small item', w('MT_BARTER_NO_PROBLEM', 'A coin of one shilling', 'A note of one hundred shillings', 'A bank card'), 'A cow cannot be divided to pay for a small item.'),
    Q('Which is true of barter?', 'It was used before coins and notes', w('MT_BARTER_MONEY', 'It always used coins', 'It was invented after banks', 'It is the same as mobile money'), 'Barter came first. Money came later.'),
  ], { h: ['Barter has no money.', 'Ask what Nyambura can do if the seller does not want her maize.'], s1: 'Think about swapping goods without money.' })),
  fam('mt.co.story', `${MT}MT_COMPARE`, 'word', 2, choose([
    Q('Mwangi has maize but wants fish. The fisherman wants cloth, not maize. What is the problem?', 'Their wants do not match', w('MT_BARTER_NO_PROBLEM', 'Maize is too heavy', 'Fish is too cheap', 'There is no problem'), 'In barter each person must want what the other has.'),
    Q('A trader has one goat and wants only a sack of maize. The maize seller says a goat is worth far more. What is the problem?', 'The goat cannot be divided', w('MT_BARTER_NO_PROBLEM', 'Maize cannot be carried', 'The buyer is too rich', 'There is no problem'), 'Barter goods are often hard to divide.'),
    Q('How does money solve the problems of barter?', 'It gives a common value and is easy to carry', w('MT_BARTER_NO_PROBLEM', 'It makes goods heavier', 'It makes people swap more goods each day', 'It makes goods rot'), 'Money measures value and is easy to carry and divide.'),
    Q('A shopper pays 50 shillings for bread and gets change. Is this barter?', 'No, money is used', w('MT_BARTER_MONEY', 'Yes, because goods are given', 'Yes, because she got change', 'Yes, because there is a shop'), 'Barter uses no money.'),
    Q('Which is a good point about barter in rural areas?', 'It can work when people have little cash', w('MT_BARTER_NO_PROBLEM', 'It never has any problems', 'It always gives a fair price', 'It lasts for ever'), 'Barter can help when cash is scarce, but it has limits.'),
  ], { h: ['Ask what each person wants and whether goods can be divided.', 'Money gives a common value.'], s1: 'Think of wants, division and value.' })),

  // ---------------------------------------------------------------- MT_MONEY
  fam('mt.mo.which', `${MT}MT_MONEY`, 'direct', 1, choose([
    Q('Which was used as money before coins in many parts of Africa?', 'Cowrie shells and beads', w('MT_COINS_FIRST', 'Mobile money', 'Bank cards', 'Paper notes'), 'Cowrie shells, beads, salt and iron tools came first.'),
    Q('Which led to the use of money in Africa?', 'Growth of long-distance trade and towns', w('MT_COINS_FIRST', 'The end of all trade', 'The closing of all the ports on the coast', 'The end of towns'), 'More trade and towns made a common measure of value necessary.'),
    Q('Which money did colonial rule bring to East Africa?', 'Rupees and later East African shillings', w('MT_COINS_FIRST', 'Cowrie shells and beads used for trade only', 'Iron hoes and salt only', 'Cattle and goats only'), 'Rupees and later East African shillings were brought by colonial rule.'),
    Q('Which is a good effect of money?', 'It made trade easier and brought wages', w('MT_ALL_GOOD', 'It ended all debts', 'It made every person in Africa rich', 'It stopped taxes'), 'Money made trade easier and allowed wages.'),
    Q('Which is a bad effect of introducing money?', 'Debts and a gap between rich and poor', w('MT_ALL_GOOD', 'None, money only helped all the people', 'It made goods disappear', 'It stopped all trade'), 'Money also brought debt and unequal wealth.'),
  ], { h: ['Before coins people used shells, beads, salt and tools.', 'Money has good and bad effects.'], s1: 'Think of what came before coins.' })),
  fam('mt.mo.story', `${MT}MT_MONEY`, 'word', 2, choose([
    Q('An old trader on the coast used cowrie shells to buy cloth. What was the cowrie shell?', 'A kind of money', w('MT_COINS_FIRST', 'A kind of tax', 'A kind of coin from Europe', 'A kind of gift only'), 'Cowries were accepted as money in many places.'),
    Q('A farmer takes a loan to buy seed and cannot repay it. Which effect of money is this?', 'Debt', w('MT_ALL_GOOD', 'Wages', 'Savings', 'Profit'), 'Money made borrowing possible, and debt can be a problem.'),
    Q('Why did colonial governments want taxes paid in money?', 'To force people to work for wages', w('MT_ALL_GOOD', 'To give people free money', 'To end all trade', 'To close shops'), 'Taxes in money pushed people to earn wages.'),
    Q('Which shows that money made saving possible?', 'Keeping coins in a bank for later', w('MT_COINS_FIRST', 'Storing live cattle in a house', 'Keeping fish for a month', 'Burying maize for a year'), 'Money can be saved without going bad.'),
    Q('Which tells us that money is not always good?', 'Some people became rich while others became poor', w('MT_ALL_GOOD', 'Everyone in the country had the same wealth', 'Nobody used money', 'Banks closed'), 'Money brought inequality.'),
  ], { h: ['Think of what money gave and what it also took.', 'Money has good and bad effects.'], s1: 'Think of good and bad effects.' }), 'c'),

  // ---------------------------------------------------------------- DV_FACTORS
  fam('dv.fa.which', `${DV}DV_FACTORS`, 'direct', 1, choose([
    Q('Which is a factor of human diversity?', 'Age, gender, religion and ability', w('DV_ONLY_TRIBE', 'Only the ethnic group', 'Only the colour of a bag or a shirt', 'Only the village name'), 'People differ in many ways, not only by ethnic group.'),
    Q('How should we treat people who are different from us?', 'With respect, learning from them', w('DV_DIFFERENT_WORSE', 'By avoiding them', 'By laughing at them in front of others', 'By ignoring them'), 'Differences enrich society.'),
    Q('Two classmates speak different languages. What is this a sign of?', 'Diversity in the class', w('DV_ONLY_TRIBE', 'A problem for the school', 'A reason to separate them', 'A fault of one of them'), 'Language is one of the factors of diversity.'),
    Q('Which difference can a person not choose?', 'Age', w('DV_DIFFERENT_WORSE', 'The friends one makes', 'The clothes one wears', 'The games one plays'), 'A person cannot choose their age.'),
    Q('Why is diversity good for a society?', 'It brings many ideas and skills together', w('DV_DIFFERENT_WORSE', 'It makes everyone think the same', 'It makes some groups of people better', 'It ends all quarrels'), 'Different people bring different skills.'),
  ], { h: ['People differ in many ways.', 'Differences enrich society.'], s1: 'Think of ways people differ.' })),
  fam('dv.fa.story', `${DV}DV_FACTORS`, 'word', 2, choose([
    Q('Two girls from the same community differ in religion and ability. What does this show?', 'Diversity exists within one community', w('DV_ONLY_TRIBE', 'Diversity is only between communities', 'They cannot be friends', 'One of them is wrong'), 'People in one community can differ in many ways.'),
    Q('A new boy uses a wheelchair. How should the class treat him?', 'Include him and respect his needs', w('DV_DIFFERENT_WORSE', 'Keep him out of games', 'Ignore him at break', 'Treat him as a burden'), 'Ability or disability is a part of diversity. Include him.'),
    Q('A class has Luo, Kikuyu, Luhya and Kalenjin learners. What is a good use of this diversity?', 'Share foods, songs and stories', w('DV_DIFFERENT_WORSE', 'Make groups by community only', 'Choose the biggest group', 'Ignore the stories'), 'Sharing builds understanding.'),
    Q('Which is NOT a factor of diversity?', 'The number of letters in a name', w('DV_ONLY_TRIBE', 'Gender', 'The religion a person follows', 'Language'), 'Gender, religion and language are factors. Name length is not.'),
    Q('A boy says people who talk differently are lower than him. What is the best reply?', 'Everyone deserves respect', w('DV_DIFFERENT_WORSE', 'You are right', 'Only some deserve respect', 'Language shows worth'), 'We respect all people.'),
  ], { h: ['Think of the many ways people differ.', 'Respect all people.'], s1: 'Think of respect and variety.' })),

  // ---------------------------------------------------------------- DV_SKILLS
  fam('dv.sk.which', `${DV}DV_SKILLS`, 'direct', 1, choose([
    Q('What does it mean to be assertive?', 'To say what you need clearly and respectfully', w('DV_ASSERT_RUDE', 'To be loud and rude', 'To always agree with others', 'To stay silent'), 'Assertive means clear and respectful.'),
    Q('Which shows empathy?', 'Trying to understand how another feels', w('DV_EMPATHY_PITY', 'Looking down on a sad person', 'Laughing at a mistake', 'Walking away from a crying child'), 'Empathy is understanding another\'s feelings.'),
    Q('Which is a desirable personality attribute?', 'Honesty', w('DV_ASSERT_RUDE', 'Jealousy', 'Gossip', 'Bullying'), 'Honesty is desirable. The others are undesirable.'),
    Q('Which is an undesirable personality attribute?', 'Arrogance', w('DV_ASSERT_RUDE', 'Kindness', 'Humility', 'Respect'), 'Arrogance harms relationships.'),
    Q('What is negotiation?', 'Talking to reach an agreement', w('DV_ASSERT_RUDE', 'Shouting until the other gives in', 'Giving up at once', 'Taking by force'), 'Negotiation means talking until both sides agree.'),
  ], { h: ['Assertive is clear and respectful.', 'Empathy means understanding how another feels.'], s1: 'Think of respect and understanding.' })),
  fam('dv.sk.story', `${DV}DV_SKILLS`, 'word', 2, choose([
    Q('Wafula\'s friends want him to skip class. He says no calmly and walks away. Which skill is this?', 'Assertiveness', w('DV_ASSERT_RUDE', 'Rudeness', 'Fear', 'Gossip'), 'He said no clearly and respectfully.'),
    Q('Nyambura sits with a crying classmate and listens. Which skill is this?', 'Empathy', w('DV_EMPATHY_PITY', 'Pity from far away', 'Gossip', 'Ignoring'), 'She tries to understand and comfort.'),
    Q('Two groups both want the football field. They agree to share it by time. Which skill did they use?', 'Negotiation', w('DV_ASSERT_RUDE', 'Bullying', 'Shouting', 'Giving up'), 'They talked and agreed.'),
    Q('A girl spreads rumours about a classmate. Which attribute is this?', 'Gossip, which is undesirable', w('DV_ASSERT_RUDE', 'Honesty, which is desirable', 'Kindness, which is desirable', 'Respect, which is desirable'), 'Gossip hurts and is undesirable.'),
    Q('A boy admits his mistake and apologises. Which attribute shows?', 'Honesty and humility', w('DV_ASSERT_RUDE', 'Arrogance', 'Jealousy', 'Bullying'), 'Admitting a mistake shows honesty and humility.'),
  ], { h: ['Match the action to the skill.', 'Clear and respectful is assertive.'], s1: 'Match the action to the skill.' }), 'c'),

  // ---------------------------------------------------------------- PE_QUALITIES
  fam('pe.qu.which', `${PE}PE_QUALITIES`, 'direct', 1, choose([
    Q('Which is a quality of a peaceful person?', 'Forgiveness', w('PE_REVENGE_FAIR', 'Revenge', 'Anger without end', 'Boasting'), 'A peaceful person forgives.'),
    Q('Why does a peaceful person walk away from a fight?', 'He chooses to solve it peacefully', w('PE_PEACE_WEAK', 'He is afraid of the other boy', 'He is weak', 'He does not care'), 'It takes courage to choose peace.'),
    Q('Someone insulted Otieno. What does a peaceful person do?', 'Tells him calmly how he feels', w('PE_REVENGE_FAIR', 'Insults him back', 'Tells all the others to hate him', 'Hits him'), 'Revenge keeps the quarrel going.'),
    Q('Which is an action of a peaceful person?', 'Listening to both sides of a quarrel', w('PE_PEACE_WEAK', 'Spreading rumours', 'Taking one side without listening', 'Hiding the facts'), 'Listening is a peaceful action.'),
    Q('Which does a peaceful person avoid?', 'Spreading rumours and insults', w('PE_PEACE_WEAK', 'Telling the truth', 'Helping friends', 'Sharing food with other people'), 'Rumours and insults harm peace.'),
  ], { h: ['A peaceful person is strong and calm.', 'Forgiveness and listening build peace.'], s1: 'Think of calm and respectful actions.' })),
  fam('pe.qu.story', `${PE}PE_QUALITIES`, 'word', 2, choose([
    Q('A boy bumps Faith by accident and she falls. She smiles and says it is fine. Which quality is this?', 'Tolerance and forgiveness', w('PE_PEACE_WEAK', 'Weakness', 'Fear', 'Anger'), 'She forgives, which is a quality of a peaceful person.'),
    Q('Two learners quarrel. Mercy listens to both and helps them talk. Which quality is this?', 'Fairness and patience', w('PE_REVENGE_FAIR', 'Revenge', 'Gossip', 'Boasting'), 'She listens and treats both fairly.'),
    Q('A friend says only weak people forgive. What is the best reply?', 'It takes courage to forgive', w('PE_PEACE_WEAK', 'You are right', 'Forgiving is silly and foolish', 'Only children forgive'), 'Forgiveness is strength.'),
    Q('Brian wants to pay back a classmate who tripped him. A peaceful person would tell him to...', 'Speak to the classmate calmly', w('PE_REVENGE_FAIR', 'Trip the classmate back at once', 'Hide the classmate\'s bag', 'Tell lies about him'), 'Revenge leads to more harm.'),
    Q('Which learner shows respect, a quality of peace?', 'One who listens when others speak', w('PE_PEACE_WEAK', 'One who interrupts others all the time', 'One who mocks others', 'One who ignores rules'), 'Listening shows respect.'),
  ], { h: ['Which action calms things down?', 'Peaceful people forgive and listen.'], s1: 'Pick the calm and fair action.' })),

  // ---------------------------------------------------------------- PE_FACTORS
  fam('pe.fa.which', `${PE}PE_FACTORS`, 'direct', 1, choose([
    Q('Which promotes peace in a community?', 'Sharing resources fairly', w('PE_FAIR_SKIP', 'Giving all resources to one group', 'Keeping secrets from others', 'Making the rules for one side only'), 'Fair sharing means less to quarrel about.'),
    Q('Which makes a community more peaceful?', 'Talking and keeping the law', w('PE_ARMS_PEACE', 'Buying more weapons', 'Guarding every house with weapons', 'Hiding from neighbours'), 'Dialogue and law build peace.'),
    Q('Who helps keep peace in a community?', 'Elders, peace committees and leaders', w('PE_ARMS_PEACE', 'Only the people who carry weapons', 'Nobody at all', 'Only strangers'), 'Elders and peace committees help settle disputes.'),
    Q('Which breaks peace in a community?', 'Hate speech and unfair treatment', w('PE_FAIR_SKIP', 'Respect for the law', 'Dialogue between groups', 'Fair sharing of all the resources'), 'Hate and unfairness break peace.'),
    Q('Why does peace matter?', 'People can farm, trade and study safely', w('PE_ARMS_PEACE', 'It makes all the schools close down', 'It stops all work', 'It makes people poorer'), 'Peace lets people live and work safely.'),
  ], { h: ['Think of what makes people feel safe and treated fairly.', 'Fair sharing, dialogue and law.'], s1: 'Think of fairness and safety.' })),
  fam('pe.fa.story', `${PE}PE_FACTORS`, 'word', 2, choose([
    Q('Two villages quarrel over a river. Which helps most to keep peace?', 'Agree on fair turns to use the water', w('PE_FAIR_SKIP', 'Let the stronger village take it all', 'Block the river completely', 'Stop speaking to each other'), 'Fair sharing prevents conflict.'),
    Q('A town has a peace committee. What is its role?', 'To help settle disputes before they grow', w('PE_ARMS_PEACE', 'To store weapons for the whole town', 'To punish without hearing', 'To avoid talking to people'), 'Peace committees help settle disputes.'),
    Q('Two religions live in one town. Which helps peace?', 'Respect for each other\'s beliefs', w('PE_FAIR_SKIP', 'Banning one of the religions', 'Telling both to hide', 'Making one religion win'), 'Tolerance supports peace.'),
    Q('Which leader helps keep peace?', 'One who treats all groups fairly', w('PE_FAIR_SKIP', 'One who helps only his own group', 'One who hides the facts', 'One who ignores all quarrels'), 'Fair leaders keep peace.'),
    Q('Which school activity promotes peace?', 'A peace club that holds discussions', w('PE_ARMS_PEACE', 'A game with fights as prizes', 'A contest to insult others', 'A rule to avoid all talk'), 'Peace clubs teach dialogue.'),
  ], { h: ['Which choice is fair to all?', 'Fair sharing, dialogue and respect.'], s1: 'Pick the fair and calm choice.' })),

  // ---------------------------------------------------------------- PE_RESOLVE
  fam('pe.re.which', `${PE}PE_RESOLVE`, 'direct', 1, choose([
    Q('What is the first step in solving a conflict peacefully?', 'Stay calm and listen to each side', w('PE_SOLVE_FIRST', 'Decide who is guilty', 'Punish the loudest person', 'Hide the problem'), 'First calm down and listen.'),
    Q('What does a mediator do?', 'Helps both sides agree without taking a side', w('PE_TAKE_SIDES', 'Takes the side of the person who asked', 'Punishes both sides', 'Decides alone with no talk'), 'A mediator is neutral.'),
    Q('Which comes after listening to each side?', 'Naming the problem', w('PE_SOLVE_FIRST', 'Shouting at both sides', 'Walking away', 'Choosing a winner at once'), 'Next, name the problem.'),
    Q('Which method makes both sides talk and reach an agreement?', 'Negotiation', w('PE_TAKE_SIDES', 'A fight', 'A shouting match', 'A silent protest'), 'Negotiation means talking until both agree.'),
    Q('Which is NOT a peaceful method of resolving conflict?', 'Violence', w('PE_SOLVE_FIRST', 'Mediation', 'Negotiation', 'Reconciliation'), 'Violence is never a peaceful method.'),
  ], { h: ['Start by staying calm and listening.', 'A mediator is neutral.'], s1: 'Think of the order of steps.' })),
  fam('pe.re.story', `${PE}PE_RESOLVE`, 'word', 2, choose([
    Q('Two learners quarrel over a pen. The teacher listens to both, then asks for ideas. Which method is this?', 'Mediation', w('PE_TAKE_SIDES', 'Punishment at once', 'Ignoring the matter', 'Voting'), 'The teacher helps both sides without taking a side.'),
    Q('Neighbours agree to share a boundary fence cost after a talk. Which method did they use?', 'Negotiation', w('PE_TAKE_SIDES', 'Force', 'Avoidance', 'Rumour'), 'They talked and agreed.'),
    Q('A mediator always sides with the person who brought the case. What is wrong?', 'A mediator must be neutral', w('PE_TAKE_SIDES', 'Nothing is wrong at all', 'Mediators must be rich', 'Mediators must be loud'), 'Neutrality is the key.'),
    Q('After a quarrel two friends say sorry and forgive each other. Which step is this?', 'Reconciliation', w('PE_SOLVE_FIRST', 'Revenge', 'Gossip', 'Avoidance'), 'Reconciliation restores friendship.'),
    Q('Elders hear both sides and give a ruling that both accept. Which method is this?', 'Arbitration', w('PE_TAKE_SIDES', 'Revenge', 'Silence', 'Violence'), 'Arbitration is when a third party decides and both accept.'),
  ], { h: ['Match the story to the method.', 'Mediation helps both agree. Arbitration decides.'], s1: 'Match the story to the method.' })),

  // ---------------------------------------------------------------- CS_MEANING
  fam('cs.me.which', `${CS}CS_MEANING`, 'direct', 1, choose([
    Q('What is community service learning?', 'Learning by serving a real community need', w('CS_JUST_WORK', 'Free work as a punishment', 'A holiday at school', 'A test in class'), 'CSL means learning through serving.'),
    Q('Which is a community need?', 'Clean water for the school', w('CS_NEED_WANT', 'A new game for the class', 'A new bag for each learner', 'A trip to the beach'), 'A need is a gap that the community must fill.'),
    Q('What is a CSL project?', 'A planned activity that meets a community need', w('CS_JUST_WORK', 'A big game played on the school sports day', 'A test on Friday', 'A school holiday'), 'A CSL project serves a real need.'),
    Q('How does CSL help learners?', 'It builds skills and values', w('CS_JUST_WORK', 'It replaces all lessons', 'It gives free marks', 'It ends homework'), 'Learners gain skills and values.'),
    Q('How does CSL help the community?', 'It solves a real problem', w('CS_NEED_WANT', 'It gives nothing to the community', 'It makes work for teachers only', 'It closes the school'), 'The community gains from the project.'),
  ], { h: ['CSL is learning by serving a real need.', 'A need is something the community must have.'], s1: 'Think of serving a real need.' })),
  fam('cs.me.story', `${CS}CS_MEANING`, 'word', 2, choose([
    Q('A class plants trees along a path where a school stream floods. Which need do they meet?', 'Protecting the environment', w('CS_NEED_WANT', 'Having fun in class all day long', 'Winning a prize', 'Getting free time'), 'They protect the land.'),
    Q('Which project meets a real need?', 'Repairing the school water tank', w('CS_NEED_WANT', 'Buying toys for the class', 'Painting the football for fun', 'Planning a long picnic'), 'The tank is a real need.'),
    Q('A learner says CSL is only a punishment. What is a better reply?', 'It is learning by helping the community', w('CS_JUST_WORK', 'It is for learners who misbehave', 'It is a test', 'You are right, it is a punishment'), 'CSL is chosen and planned.'),
    Q('The class cleans the village market. What do learners gain?', 'Teamwork and responsibility', w('CS_JUST_WORK', 'Nothing at all', 'Only free time after school', 'Only money'), 'CSL builds values.'),
    Q('How does CSL strengthen the school and community?', 'They work together on needs', w('CS_JUST_WORK', 'They stay apart from each other', 'They compete', 'They avoid each other'), 'Working together builds bonds.'),
  ], { h: ['Is the project meeting a real need?', 'Real needs, skills and values.'], s1: 'Ask what need the project meets.' }), 'b'),

  // ---------------------------------------------------------------- CS_STEPS
  fam('cs.st.which', `${CS}CS_STEPS`, 'direct', 1, choose([
    Q('What comes first in a CSL project?', 'Identifying the need', w('CS_ACT_FIRST', 'Doing the activity', 'Writing the report', 'Choosing the prize'), 'First find the need.'),
    Q('What is the last step of a CSL project?', 'Report and reflect on what was learnt', w('CS_NO_REPORT', 'Stop and forget it at once for ever', 'Start a new project', 'Spend all the money'), 'Reporting and reflecting is the last step.'),
    Q('What comes after identifying the need?', 'Planning', w('CS_ACT_FIRST', 'Reporting', 'Reflecting', 'Celebrating the finished project'), 'Plan before you act.'),
    Q('What does a good plan name?', 'Tasks, people, time and resources', w('CS_ACT_FIRST', 'Only a date', 'Only the name of the group leader', 'Only the cost'), 'A good plan covers who, what, when and with what.'),
    Q('Why do we reflect after a project?', 'To see what worked and what to improve', w('CS_NO_REPORT', 'To forget what we did', 'To find out who is to blame for it', 'To avoid new projects'), 'Reflection improves the next project.'),
  ], { h: ['Need, plan, act, report and reflect.', 'Find the need first.'], s1: 'Think of the order of steps.' })),
  fam('cs.st.story', `${CS}CS_STEPS`, 'word', 2, choose([
    Q('A class begins to dig a trench before they ask what is needed. What did they skip?', 'Identifying the need and planning', w('CS_ACT_FIRST', 'Reporting', 'Reflecting', 'Celebrating the finished project'), 'They acted before finding the need.'),
    Q('The class has finished planting trees. What is the next step?', 'Report and reflect on it', w('CS_NO_REPORT', 'Forget the project', 'Start digging again', 'Sell the trees'), 'Report and reflect.'),
    Q('Which is the right order?', 'Need, plan, act, report', w('CS_ACT_FIRST', 'Act, need, plan, report', 'Plan, act, report, need', 'Report, act, plan, need'), 'The right order is need, plan, act, report.'),
    Q('A plan lists tasks only. What must be added so that it can work?', 'Time and people for each task', w('CS_ACT_FIRST', 'Nothing is missing', 'A prize', 'A holiday'), 'A plan needs who and when.'),
    Q('The teacher asks what went well and what did not. Which step is this?', 'Reflection', w('CS_NO_REPORT', 'Planning', 'Identifying the need', 'Acting'), 'Reflection looks back at the project.'),
  ], { h: ['Which step has been missed or done?', 'Need, plan, act, report and reflect.'], s1: 'Find the step in the order.' })),
];
