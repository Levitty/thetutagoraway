// ============================================================================
// GRADE 7 SOCIAL STUDIES, PART G: spot-the-mistake families (24 skills). A learner's short working has three steps and exactly one
// is false; the child finds it. Every false step is a library misconception of its skill. Written offline from the KICD design;
// history is told as commonly taught and stays "to confirm by a teacher". All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, spot, S } from './socialstudies_g7_lib.js';

const SE = 'SOCIAL.SELF_EXPLORATION.', EO = 'SOCIAL.ENTREPRENEURIAL_OPPORTUN.', EC = 'PEOPLE.EARLY_CIVILISATION.', SL = 'PEOPLE.SLAVERY_AND_SERVITUDE.', MT = 'PEOPLE.DEVELOPMENTS_IN_MEDIUM_O.', DV = 'PEOPLE.DIVERSITY_AND_INTERPERSO.', PE = 'PEOPLE.PEACEFUL_COEXISTENCE.', CS = 'COMMUN.COMMUNITY_SERVICE_LEARNI.';
const HI = 'NATURA.HISTORICAL_INFORMATION.', EA = 'NATURA.HISTORICAL_DEVELOPMENT_O.', MM = 'NATURA.MAPS_AND_MAP_WORK.', ES = 'NATURA.EARTH_AND_THE_SOLAR_SYST.', WE = 'NATURA.WEATHER.', FW = 'NATURA.FIELDWORK.';
const PD = 'POLITI.POLITICAL_DEVELOPMENT_IN.', CK = 'POLITI.THE_CONSTITUTION_OF_KENY.', HR = 'POLITI.HUMAN_RIGHTS.', CZ = 'POLITI.CITIZENSHIP.';

// SP(code, who, topic, false step, fix): a three-step working with one false step (the second).
const SP = (code, who, topic, bad, fix) => S(`${who} answers a question on ${topic}. Which step has the mistake?`, [`Step 1: ${who} reads the question carefully.`, `!Step 2: ${bad}`, `Step 3: ${who} writes the answer down.`], fix, code);
const HINT = { h: ['Check each step against what you know.', 'Only one step is false.'], s1: 'Check each step in turn.' };

export const FAMILIES = [
  fam('se.em.spot', `${SE}SE_EMOTIONS`, 'spot', 3, spot([
    SP('SE_ANGER_BAD', 'Amani', 'managing anger', 'Amani says anger is wrong and should never be felt.', 'Anger is a normal feeling. We learn to manage what we do with it.'),
    SP('SE_REVENGE', 'Brenda', 'a broken pencil', 'Brenda says she should break her friend\'s pencil too.', 'Hitting back makes things worse. Breathe, calm down and talk.'),
    SP('SE_REVENGE', 'Charles', 'being teased', 'Charles says the best way to stop teasing is to shout and push.', 'Shouting and pushing make a quarrel bigger. Walk away and tell a teacher.'),
    SP('SE_ANGER_BAD', 'Dorcas', 'feeling afraid before a test', 'Dorcas says she should hide her fear and never tell anyone.', 'Fear is normal. Sharing it with someone you trust helps.'),
    SP('SE_REVENGE', 'Evans', 'losing a match', 'Evans says it is fine to kick the ball away in anger.', 'Kicking the ball away hurts the game. Calm down and congratulate the winners.'),
  ], HINT)),
  fam('eo.op.spot', `${EO}EO_OPPORTUNITY`, 'spot', 3, spot([
    SP('EO_CAPITAL_ONLY', 'Faith', 'starting a business', 'Faith says a business needs only a lot of money.', 'A business begins with a need that people have and a plan, as well as money.'),
    SP('EO_SOCIAL_PROFIT', 'Gideon', 'social entrepreneurs', 'Gideon says a social entrepreneur only wants the most profit.', 'A social entrepreneur earns by solving a community problem.'),
    SP('EO_CAPITAL_ONLY', 'Halima', 'a snack stall', 'Halima says she can open a stall without checking that people want snacks.', 'Check that customers need the product before you spend money.'),
    SP('EO_SOCIAL_PROFIT', 'Ian', 'a water project', 'Ian says a social enterprise must never earn any money.', 'A social enterprise earns money while it solves a community problem.'),
    SP('EO_CAPITAL_ONLY', 'Joy', 'a poultry plan', 'Joy says no plan is needed if she buys many hens.', 'A plan is needed so that the business can last.'),
  ], HINT)),
  fam('ec.fa.spot', `${EC}EC_FACTORS`, 'spot', 3, spot([
    SP('EC_NILE_EVERY', 'Kamau', 'Great Zimbabwe', 'Kamau says Great Zimbabwe grew because of the Nile floods.', 'Great Zimbabwe grew from cattle, gold and trade. The Nile is in Egypt.'),
    SP('EC_WHITE_BUILT', 'Lucy', 'the stone walls of Great Zimbabwe', 'Lucy says visitors from other lands built the walls.', 'The walls were built by the ancestors of the Shona. A teacher should confirm.'),
    SP('EC_NILE_EVERY', 'Moses', 'the Kingdom of Kongo', 'Moses says Kongo grew on the yearly floods of the Nile.', 'Kongo grew on the Congo River area, farming, metal work and trade.'),
    SP('EC_WHITE_BUILT', 'Naomi', 'African kingdoms', 'Naomi says Africans could not have built a great stone city.', 'Africans built Great Zimbabwe. The evidence shows it.'),
    SP('EC_NILE_EVERY', 'Omondi', 'ancient Egypt', 'Omondi says Egypt grew because of cattle and gold at Zimbabwe.', 'Egypt grew on the fertile Nile valley.'),
  ], HINT)),
  fam('ec.co.spot', `${EC}EC_CONTRIB`, 'spot', 3, spot([
    SP('EC_MIX_GIFT', 'Pendo', 'hieroglyphs', 'Pendo says Great Zimbabwe gave the world hieroglyphs.', 'Hieroglyphs and papyrus came from ancient Egypt.'),
    SP('EC_NO_GIFT', 'Quentin', 'ancient African kingdoms', 'Quentin says they gave the world nothing.', 'Writing, a calendar and metal work from Africa are still used today.'),
    SP('EC_MIX_GIFT', 'Rose', 'dry stone walls', 'Rose says ancient Egypt is famous for stone walls built without mortar.', 'Great Zimbabwe is famous for its stone walls.'),
    SP('EC_MIX_GIFT', 'Sam', 'copper and iron work', 'Sam says Great Zimbabwe was famed for copper crosses and cloth.', 'Kongo was famed for metal work and cloth.'),
    SP('EC_NO_GIFT', 'Tabitha', 'the 365-day calendar', 'Tabitha says it has no link with ancient Africa.', 'The Egyptians made a calendar of 365 days.'),
  ], HINT)),
  fam('sl.fo.spot', `${SL}SL_FORMS`, 'spot', 3, spot([
    SP('SL_ONLY_PAST', 'Umi', 'slavery today', 'Umi says slavery ended completely long ago.', 'Slavery still exists in forms such as trafficking and forced labour.'),
    SP('SL_SERVANT_PAID', 'Victor', 'servitude', 'Victor says any hard job is servitude.', 'Servitude means a person is forced and cannot leave. Hard work that is chosen is not servitude.'),
    SP('SL_ONLY_PAST', 'Wanjiku', 'child labour', 'Wanjiku says child labour is not a kind of slavery today.', 'Forced child labour takes away freedom, so it is a modern form of slavery.'),
    SP('SL_SERVANT_PAID', 'Xavier', 'a paid farm job', 'Xavier says a paid job where a worker may leave is servitude.', 'A person who is paid and free to leave is not in servitude.'),
    SP('SL_ONLY_PAST', 'Yusuf', 'trafficking', 'Yusuf says trafficking happens only in books about the past.', 'Trafficking exists today and is a modern form of slavery.'),
  ], HINT)),
  fam('sl.in.spot', `${SL}SL_INDIAN`, 'spot', 3, spot([
    SP('SL_ONLY_EUROPE', 'Zawadi', 'the Indian Ocean slave trade', 'Zawadi says it was run only by Europeans.', 'Traders from Arabia and the coast and some inland leaders took part.'),
    SP('SL_NO_DEMAND', 'Aisha', 'why captives were bought', 'Aisha says they were bought to be eaten.', 'Captives were bought to work on plantations, in homes and on ships.'),
    SP('SL_ONLY_EUROPE', 'Baraka', 'the trade routes', 'Baraka says the traders used railways built by Europeans.', 'Caravans carried captives to the coast and dhows carried them across the ocean.'),
    SP('SL_NO_DEMAND', 'Cheptoo', 'Zanzibar', 'Cheptoo says Zanzibar needed no workers.', 'Clove plantations on Zanzibar needed many workers.'),
    SP('SL_ONLY_EUROPE', 'Daudi', 'the winds', 'Daudi says European steamships carried the dhows.', 'Dhows sailed with the monsoon winds.'),
  ], HINT)),
  fam('mt.co.spot', `${MT}MT_COMPARE`, 'spot', 3, spot([
    SP('MT_BARTER_MONEY', 'Esther', 'barter', 'Esther says barter means buying goods with coins.', 'Barter is swapping goods for goods with no money.'),
    SP('MT_BARTER_NO_PROBLEM', 'Felix', 'barter', 'Felix says barter never had any problems.', 'Barter needs both people to want what the other has, which is hard.'),
    SP('MT_BARTER_MONEY', 'Grace', 'a fish and maize swap', 'Grace says a fish for maize swap is a sale with money.', 'It is barter because goods are swapped and no money is used.'),
    SP('MT_BARTER_NO_PROBLEM', 'Hassan', 'swapping a goat', 'Hassan says a goat can be divided easily to pay for small things.', 'A goat cannot be divided, which is a problem of barter.'),
    SP('MT_BARTER_NO_PROBLEM', 'Irene', 'money', 'Irene says money is not needed because barter works perfectly.', 'Money is a common measure of value that all accept.'),
  ], HINT)),
  fam('mt.mo.spot', `${MT}MT_MONEY`, 'spot', 3, spot([
    SP('MT_COINS_FIRST', 'Jelani', 'early money', 'Jelani says coins were the first money in Africa.', 'Cowrie shells, beads, salt and iron tools were used before coins.'),
    SP('MT_ALL_GOOD', 'Kendi', 'the effects of money', 'Kendi says money brought only good effects.', 'Money also brought debt and a gap between rich and poor.'),
    SP('MT_COINS_FIRST', 'Linet', 'cowrie shells', 'Linet says cowrie shells were never used as money.', 'Cowrie shells were accepted as money in many places.'),
    SP('MT_ALL_GOOD', 'Mark', 'a farmer\'s loan', 'Mark says a loan can never cause trouble.', 'A loan that cannot be repaid becomes a debt.'),
    SP('MT_ALL_GOOD', 'Nelima', 'taxes in money', 'Nelima says taxes in money never changed how people lived.', 'Taxes in money pushed many people to earn wages.'),
  ], HINT)),
  fam('dv.sk.spot', `${DV}DV_SKILLS`, 'spot', 3, spot([
    SP('DV_ASSERT_RUDE', 'Odhiambo', 'assertiveness', 'Odhiambo says being assertive means being loud and rude.', 'Assertive means saying what you need clearly and respectfully.'),
    SP('DV_EMPATHY_PITY', 'Purity', 'empathy', 'Purity says empathy means feeling sorry and doing nothing.', 'Empathy is trying to understand how another feels and responding kindly.'),
    SP('DV_ASSERT_RUDE', 'Quincy', 'saying no to a friend', 'Quincy says the best way to say no is to shout.', 'You can say no calmly and firmly without shouting.'),
    SP('DV_EMPATHY_PITY', 'Rehema', 'a crying classmate', 'Rehema says the empathetic thing is to laugh and walk away.', 'Sit with the classmate, listen and comfort her.'),
    SP('DV_ASSERT_RUDE', 'Stephen', 'negotiation', 'Stephen says negotiation means shouting until the other gives in.', 'Negotiation means talking until both sides agree.'),
  ], HINT)),
  fam('pe.re.spot', `${PE}PE_RESOLVE`, 'spot', 3, spot([
    SP('PE_TAKE_SIDES', 'Titus', 'a mediator', 'Titus says a mediator takes the side of the person who asked.', 'A mediator is neutral and helps both sides agree.'),
    SP('PE_SOLVE_FIRST', 'Ursula', 'solving a quarrel', 'Ursula says the first step is to decide who is guilty.', 'First stay calm and listen to each side.'),
    SP('PE_TAKE_SIDES', 'Vincent', 'a village dispute', 'Vincent says the mediator should tell the other side they are wrong at once.', 'A mediator listens to both sides without taking a side.'),
    SP('PE_SOLVE_FIRST', 'Wambui', 'a quarrel over a pen', 'Wambui says the teacher should punish the loudest learner first.', 'The teacher should listen to both learners first.'),
    SP('PE_SOLVE_FIRST', 'Yohana', 'peaceful steps', 'Yohana says solutions come before listening.', 'Listening comes first, then naming the problem, then solutions.'),
  ], HINT)),
  fam('cs.st.spot', `${CS}CS_STEPS`, 'spot', 3, spot([
    SP('CS_ACT_FIRST', 'Zainab', 'a CSL project', 'Zainab says the first step is to start the activity.', 'The first step is to identify the need.'),
    SP('CS_NO_REPORT', 'Abel', 'the end of a project', 'Abel says the project is over when the work is done, with no report.', 'The class should report and reflect on what was learnt.'),
    SP('CS_ACT_FIRST', 'Beatrice', 'planting trees', 'Beatrice says the class can plant before checking what the school needs.', 'First find the need, then plan, then plant.'),
    SP('CS_NO_REPORT', 'Collins', 'reflection', 'Collins says reflection is a waste of time.', 'Reflection shows what worked and what to improve.'),
    SP('CS_ACT_FIRST', 'Diana', 'the order of steps', 'Diana says the order is act, need, plan, report.', 'The order is need, plan, act, report.'),
  ], HINT)),
  fam('hi.so.spot', `${HI}HI_SOURCES`, 'spot', 3, spot([
    SP('HI_ONLY_BOOKS', 'Edwin', 'sources of history', 'Edwin says history comes only from books.', 'History comes from oral stories, objects, buildings, writings and pictures.'),
    SP('HI_ARCH_ORAL', 'Florence', 'old pots dug from the ground', 'Florence says old pots are an oral source.', 'Things dug from the ground are archaeological sources.'),
    SP('HI_ONLY_BOOKS', 'George', 'elders\' stories', 'George says elders\' stories are not a source of history.', 'Oral stories are an important source of history.'),
    SP('HI_ARCH_ORAL', 'Hellen', 'a song about a clan\'s journey', 'Hellen says the song is an archaeological source.', 'A song is an oral source.'),
    SP('HI_ONLY_BOOKS', 'Isaac', 'fossils', 'Isaac says fossils tell us nothing about the past.', 'Fossils are archaeological sources that tell us about the past.'),
  ], HINT)),
  fam('hi.pr.spot', `${HI}HI_PRIMARY`, 'spot', 3, spot([
    SP('HI_NEW_PRIMARY', 'Jackline', 'a 2024 textbook on the Berlin Conference', 'Jackline says the textbook is a primary source.', 'The author was not there, so it is a secondary source.'),
    SP('HI_PHOTO_SECONDARY', 'Kevin', 'a soldier\'s diary from a war', 'Kevin says the diary is a secondary source.', 'The soldier wrote it at the time, so it is primary.'),
    SP('HI_NEW_PRIMARY', 'Lilian', 'a documentary made last year', 'Lilian says the documentary is primary.', 'It was made later by people who were not there, so it is secondary.'),
    SP('HI_PHOTO_SECONDARY', 'Martin', 'a photograph taken in 1963', 'Martin says an old photograph is secondary because it is old.', 'A photograph taken at the time is primary.'),
    SP('HI_NEW_PRIMARY', 'Nancy', 'an old book', 'Nancy says an old book is always primary.', 'It depends on whether the author was there.'),
  ], HINT)),
  fam('ea.ni.spot', `${EA}EA_NILE`, 'spot', 3, spot([
    SP('EA_FLOOD_BAD', 'Oscar', 'the Nile flood', 'Oscar says the flood only destroyed farms.', 'The flood left rich silt that made the soil fertile.'),
    SP('EA_NO_SURPLUS', 'Pauline', 'a food surplus', 'Pauline says a food surplus changed nothing.', 'A surplus fed scribes, builders and traders.'),
    SP('EA_FLOOD_BAD', 'Rashid', 'farmers waiting for the flood', 'Rashid says farmers feared the flood and wanted it to stop.', 'Farmers welcomed the flood for its rich silt.'),
    SP('EA_NO_SURPLUS', 'Sylvia', 'scribes', 'Sylvia says scribes grew the wheat.', 'Scribes kept records. Farmers grew the wheat.'),
    SP('EA_NO_SURPLUS', 'Tom', 'towns', 'Tom says towns grew with no extra food.', 'Extra food let people become builders and traders in towns.'),
  ], HINT)),
  fam('mm.fe.spot', `${MM}MM_FEATURES`, 'spot', 3, spot([
    SP('MM_KENYA_HIGHEST', 'Ugo', 'the highest mountain in Africa', 'Ugo says Mount Kenya is the highest.', 'Kilimanjaro in Tanzania is the highest. Mount Kenya is second.'),
    SP('MM_SAHARA_COLD', 'Violet', 'the largest hot desert', 'Violet says the Kalahari is the largest hot desert.', 'The Sahara is the largest hot desert.'),
    SP('MM_KENYA_HIGHEST', 'Wilson', 'the largest lake in Africa', 'Wilson says Lake Turkana is the largest.', 'Lake Victoria is the largest lake in Africa.'),
    SP('MM_SAHARA_COLD', 'Yvonne', 'the longest river', 'Yvonne says the Congo is the longest river.', 'The Nile is the longest river in Africa.'),
    SP('MM_SAHARA_COLD', 'Zack', 'the Sahara', 'Zack says the Sahara is in the south of Africa.', 'The Sahara is in the north of Africa.'),
  ], HINT)),
  fam('es.st.spot', `${ES}ES_STRUCTURE`, 'spot', 3, spot([
    SP('ES_CRUST_THICK', 'Alice', 'the layers of the earth', 'Alice says the crust is the thickest layer.', 'The crust is the thinnest layer.'),
    SP('ES_CORE_COLD', 'Bernard', 'the inner core', 'Bernard says the inner core is cold and hollow.', 'The inner core is solid and very hot.'),
    SP('ES_CRUST_THICK', 'Carol', 'where people live', 'Carol says people live on the mantle.', 'People live on the crust.'),
    SP('ES_CORE_COLD', 'Dennis', 'the core', 'Dennis says the core is made of ice.', 'The core is mostly iron and nickel and is very hot.'),
    SP('ES_CRUST_THICK', 'Elsie', 'the order of layers', 'Elsie says the mantle is above the crust.', 'The crust is on top, then the mantle, outer core and inner core.'),
  ], HINT)),
  fam('we.el.spot', `${WE}WE_ELEMENTS`, 'spot', 3, spot([
    SP('WE_TEMP_BAROMETER', 'Fred', 'weather instruments', 'Fred says a barometer measures temperature.', 'A thermometer measures temperature. A barometer measures air pressure.'),
    SP('WE_WEATHER_CLIMATE', 'Gloria', 'the climate of Nairobi', 'Gloria says one sunny day tells the climate of Nairobi.', 'Climate is the pattern of weather over many years.'),
    SP('WE_TEMP_BAROMETER', 'Henry', 'wind speed', 'Henry says a wind vane measures wind speed.', 'An anemometer measures speed. A wind vane shows direction.'),
    SP('WE_WEATHER_CLIMATE', 'Imani', 'weather and climate', 'Imani says weather and climate mean the same.', 'Weather is short term. Climate is the long-term pattern.'),
    SP('WE_TEMP_BAROMETER', 'Jonah', 'rainfall', 'Jonah says a hygrometer measures rainfall.', 'A rain gauge measures rainfall. A hygrometer measures humidity.'),
  ], HINT)),
  fam('fw.me.spot', `${FW}FW_METHODS`, 'spot', 3, spot([
    SP('FW_QUESTION_OBS', 'Kate', 'counting vehicles', 'Kate says counting vehicles at a gate is an interview.', 'Counting what we see is observation.'),
    SP('FW_OPINION_OBS', 'Leo', 'the views of drivers', 'Leo says observation alone shows what drivers think.', 'Opinions must be asked for, with an interview or a questionnaire.'),
    SP('FW_OPINION_OBS', 'Mary', 'a road study', 'Mary says you can see why drivers speed just by watching.', 'To know why, ask the drivers.'),
    SP('FW_QUESTION_OBS', 'Nick', 'a questionnaire', 'Nick says a questionnaire is a single spoken question.', 'A questionnaire is a set of written questions.'),
    SP('FW_QUESTION_OBS', 'Olive', 'a focus group', 'Olive says a focus group is one person counting cars.', 'A focus group is a small group talking about a topic.'),
  ], HINT)),
  fam('pd.be.spot', `${PD}PD_BERLIN`, 'spot', 3, spot([
    SP('PD_BERLIN_DIVIDED', 'Paul', 'the Berlin Conference', 'Paul says every African border was drawn at Berlin.', 'Berlin set the rules for claiming land. Borders were drawn after.'),
    SP('PD_BERLIN_AFRICANS', 'Queen', 'who attended', 'Queen says African chiefs attended and voted.', 'No African leaders were invited to Berlin.'),
    SP('PD_BERLIN_DIVIDED', 'Ronald', 'the aim of the conference', 'Ronald says Berlin gave Africa its independence.', 'Berlin set rules for European powers to claim African land.'),
    SP('PD_BERLIN_AFRICANS', 'Sharon', 'the host', 'Sharon says the host was an African king.', 'Germany hosted the conference under Bismarck.'),
    SP('PD_BERLIN_DIVIDED', 'Thomas', 'effective occupation', 'Thomas says a power could claim land just by writing its name.', 'Effective occupation meant real control of the land.'),
  ], HINT)),
  fam('pd.im.spot', `${PD}PD_IMPLICATIONS`, 'spot', 3, spot([
    SP('PD_ALL_GOOD', 'Ursula', 'colonial rule', 'Ursula says colonial rule brought only benefits.', 'It took land and independence, and some roads served colonial interests.'),
    SP('PD_BORDERS_FAIR', 'Victor', 'colonial borders', 'Victor says borders kept every community together.', 'Borders split some communities and joined others.'),
    SP('PD_ALL_GOOD', 'Winnie', 'railways', 'Winnie says railways were built mainly to serve African farmers.', 'Railways mainly carried raw materials to the ports for the colonial economy.'),
    SP('PD_BORDERS_FAIR', 'Xolani', 'a divided community', 'Xolani says a border cannot split a people.', 'Many peoples were split by colonial borders.'),
    SP('PD_ALL_GOOD', 'Yasmin', 'colonial taxes', 'Yasmin says taxes helped Africans become richer.', 'Taxes in money pushed many people to work for wages or grow cash crops.'),
  ], HINT)),
  fam('ck.up.spot', `${CK}CK_UPHOLD`, 'spot', 3, spot([
    SP('CK_BRIBE_OK', 'Zephania', 'a small bribe', 'Zephania says a small bribe does not hurt the Constitution.', 'Even a small bribe breaks the rule of law and integrity.'),
    SP('CK_ONLY_LEADERS', 'Agnes', 'who must protect the Constitution', 'Agnes says only leaders must protect it.', 'Every citizen must protect the Constitution.'),
    SP('CK_BRIBE_OK', 'Brian', 'a police officer', 'Brian says it is fine to give a bribe to avoid a fine.', 'Giving a bribe breaks the law and the national values.'),
    SP('CK_ONLY_LEADERS', 'Clara', 'learners', 'Clara says learners have no part in upholding the Constitution.', 'Learners uphold it by respecting rights and obeying rules.'),
    SP('CK_BRIBE_OK', 'Dan', 'a court order', 'Dan says a court order may be ignored if it is inconvenient.', 'Obeying the courts upholds the rule of law.'),
  ], HINT)),
  fam('hr.eq.spot', `${HR}HR_EQUITY`, 'spot', 3, spot([
    SP('HR_EQUAL_EQUITY', 'Elijah', 'equity', 'Elijah says equity means everyone gets exactly the same.', 'Equity means everyone gets what is fair for their need.'),
    SP('HR_EARNED', 'Fiona', 'human rights', 'Fiona says rights are earned by good behaviour.', 'Human rights belong to everyone and cannot be earned or taken away.'),
    SP('HR_EQUAL_EQUITY', 'Gabriel', 'a learner who cannot see the board', 'Gabriel says she should sit at the back like everyone else.', 'Equity gives her a seat near the front.'),
    SP('HR_EARNED', 'Hope', 'a child who steals', 'Hope says such a child loses all rights.', 'Human rights cannot be taken away.'),
    SP('HR_EARNED', 'Ivy', 'who has rights', 'Ivy says only adults have human rights.', 'Human rights belong to every person, including children.'),
  ], HINT)),
  fam('cz.gl.spot', `${CZ}CZ_GLOBAL`, 'spot', 3, spot([
    SP('CZ_GLOBAL_ALL_GOOD', 'Joseph', 'globalisation', 'Joseph says globalisation has only good effects.', 'It can also harm local culture and firms.'),
    SP('CZ_GLOBAL_ONLINE', 'Karen', 'what globalisation is', 'Karen says globalisation means only the internet.', 'It includes trade, travel, money and the internet.'),
    SP('CZ_GLOBAL_ALL_GOOD', 'Lawrence', 'cheap imports', 'Lawrence says cheap imports never hurt local weavers.', 'Cheap imports can make local firms lose customers.'),
    SP('CZ_GLOBAL_ONLINE', 'Maria', 'the links between countries', 'Maria says trade and travel are not part of globalisation.', 'Trade, travel and money also link countries.'),
    SP('CZ_GLOBAL_ALL_GOOD', 'Noah', 'the spread of disease', 'Noah says globalisation can never spread disease.', 'Quick travel can spread disease across the world.'),
  ], HINT)),
];
