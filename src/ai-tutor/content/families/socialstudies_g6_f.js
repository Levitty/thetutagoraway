// ============================================================================
// GRADE 6 SOCIAL STUDIES: SPOT-THE-MISTAKE FAMILIES for the skills whose other families are two tap questions (29 skills).
// Each shows a learner's short working with one false step; the child finds it. Every false step is a library misconception of the
// skill. Written offline from the KICD 2024 design. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, spot, S } from './socialstudies_g6_lib.js';

const PS = 'NATURA.POSITION_AND_SIZE_OF_COU.', LG = 'PEOPLE.LANGUAGE_GROUPS_IN_EASTE.', PD = 'PEOPLE.POPULATION_DISTRIBUTION_.', CS = 'PEOPLE.CULTURE_AND_SOCIAL_ORGAN.', SC = 'PEOPLE.SCHOOL_AND_COMMUNITY.';
const BF = 'RESOUR.BEEF_FARMING.', FI = 'RESOUR.FISHING_IN_EASTERN_AFRIC.', WT = 'RESOUR.WILDLIFE_AND_TOURISM_IN_.', TR = 'RESOUR.TRANSPORT_IN_EASTERN_AFR.', CM = 'RESOUR.COMMUNICATIO_N_IN_EASTER.', MN = 'RESOUR.MINING_IN_EASTERN_AFRICA.';
const TG = 'POLITI.TRADITIONAL_FORMS_OF_GOV.', RC = 'POLITI.REGIONAL_CO_OPERATIONS.', CZ = 'POLITI.CITIZENSHIP.', HR = 'POLITI.HUMAN_RIGHTS.', PC = 'GOVERN.PEACE_AND_CONFLICT_RESOL.', GR = 'GOVERN.GOVERNMENT_REVENUE_AND_E.', PR = 'GOVERN.THE_PREAMBLE_OF_THE_CONS.';
const H = (a, b, s1) => ({ h: [a, b], s1 });
const mk = (name, who, claim, wrongStep, fix, code) => S(`${who} says ${claim}. Which step has the mistake?`, [`Step 1: ${who} thinks about ${name}.`, `!Step 2: ${wrongStep}`, `Step 3: ${who} writes the answer.`], fix, code);

export const FAMILIES = [
  fam('lg.ef.spot', `${LG}LG_EFFECTS`, 'spot', 3, spot([
    mk('settlement', 'Collins', 'settling near other groups never caused quarrels', 'He says neighbours never want the same land.', 'Groups sometimes quarrelled over land, water and pasture.', 'LG_NO_CONFLICT'),
    mk('mixing of groups', 'Lilian', 'after settling together all groups became the same', 'She says mixing makes every custom alike.', 'Groups traded and mixed but kept their own languages and customs.', 'LG_ALL_SAME'),
    mk('trade', 'Hassan', 'settlement had only bad effects', 'He says there was no trade or sharing of skills.', 'Settlement also brought trade, intermarriage and the spread of skills.', 'LG_NO_CONFLICT'),
    mk('languages', 'Grace', 'the Kikuyu and the Maasai now speak one language', 'She says living near each other joins languages.', 'Neighbours learn words from each other, but each group keeps its language.', 'LG_ALL_SAME'),
    mk('land and pasture', 'Peter', 'sharing the same river caused no trouble', 'He says two herds at one river never clash.', 'Competition for water and pasture could lead to quarrels.', 'LG_NO_CONFLICT'),
  ], H('Which step says there was no trouble, or that all groups became alike?', 'Settlement had good and bad effects.', 'Check each step against the effects of settlement.'))),
  fam('pd.fa.spot', `${PD}PD_FACTORS`, 'spot', 3, spot([
    mk('deserts', 'Mercy', 'many people live in deserts because land is cheap', 'She says price of land draws people to dry places.', 'Few people live in deserts because there is too little water and food.', 'PD_PEOPLE_DESERT'),
    mk('mountains', 'Brian', 'people crowd on steep rocky mountain tops', 'He says cool weather matters more than farmland.', 'People crowd on gentle land with fertile soil and rain.', 'PD_MOUNTAIN_TOP'),
    mk('thin population', 'Akinyi', 'a dry plain has a high density of people', 'She says dry land attracts farmers.', 'A dry plain has few people because crops fail there.', 'PD_PEOPLE_DESERT'),
    mk('crowded land', 'Kamau', 'the best place to farm is a rocky steep slope', 'He says steep land is easy to plough.', 'Gentle land with deep soil and rain is best for farming and settling.', 'PD_MOUNTAIN_TOP'),
    mk('swamps', 'Zawadi', 'a swamp with tsetse flies attracts many people', 'She says disease does not keep people away.', 'Disease, swamps and tsetse flies keep people away.', 'PD_PEOPLE_DESERT'),
  ], H('Which step gives a reason that does not draw people?', 'People settle where there is water, soil and safety.', 'Check each step against what attracts people.'))),
  fam('cs.ag.spot', `${CS}CS_AGE`, 'spot', 3, spot([
    mk('age-sets', 'Titus', 'an age-set is any group born in the same month', 'He says birthdays make an age-set.', 'An age-set is a group initiated together.', 'CS_SET_GROUP'),
    mk('warriors', 'Esther', 'the warrior age-set looked after the sick at home', 'She says warriors stayed to nurse patients.', 'Warriors defended the community and its cattle.', 'CS_WARRIOR'),
    mk('age-groups', 'Duncan', 'an age-group is people who were initiated together', 'He says age-group and age-set mean the same.', 'An age-group is people of about the same age. Initiation forms an age-set.', 'CS_SET_GROUP'),
    mk('duties', 'Gladys', 'the main duty of warriors was teaching small children letters', 'She says warriors ran the classes.', 'Warriors defended the community. Elders and parents taught the young.', 'CS_WARRIOR'),
    mk('age-sets', 'Moses', 'a school class is an age-set', 'He says any group of the same age is an age-set.', 'An age-set is formed by initiation and stays together for life.', 'CS_SET_GROUP'),
  ], H('Which step mixes up age-set and age-group, or gives a wrong duty?', 'Age-set: initiated together. Age-group: same stage of life.', 'Check each step against age-sets and their duties.'))),
  fam('sc.wa.spot', `${SC}SC_WAYS`, 'spot', 3, spot([
    mk('collaboration', 'Gilbert', 'teachers marking books alone is the school working with the community', 'He says any school task involves the community.', 'Collaboration needs the community to take part.', 'SC_SCHOOL_ALONE'),
    mk('what a school gives', 'Hellen', 'a school gives the community nothing', 'She says only the community gives.', 'A school lends its hall and field and trains learners who serve.', 'SC_ONE_WAY'),
    mk('working together', 'Abdi', 'a head teacher signing forms is a way of working with the community', 'He says paperwork brings the community in.', 'Working with the community means parents or villagers take part.', 'SC_SCHOOL_ALONE'),
    mk('helping each other', 'Beth', 'only the community helps the school', 'She says the school gives nothing back.', 'The school also serves the community, for example as a polling station.', 'SC_ONE_WAY'),
    mk('collaboration', 'Collins', 'learners sweeping their own classroom is working with the community', 'He says any cleaning counts.', 'No one from the community took part, so it is not collaboration.', 'SC_SCHOOL_ALONE'),
  ], H('Which step says the school works alone, or that only one side gives?', 'Collaboration needs both sides.', 'Check each step against working together.'))),
  fam('sc.be.spot', `${SC}SC_BENEFITS`, 'spot', 3, spot([
    mk('benefits', 'Dan', 'only the school gains from collaboration', 'He says the community gets nothing.', 'The community gains better learners and shared facilities.', 'SC_BENEFIT_ONLY_SCHOOL'),
    mk('keeping it going', 'Everlyne', 'never inviting parents keeps collaboration going', 'She says silence keeps people involved.', 'Open days and meetings keep collaboration going.', 'SC_STRATEGY_STOP'),
    mk('benefits', 'Mark', 'the community gains nothing from a school field it can use', 'He says a shared field has no value.', 'A shared field and hall are a real benefit to the community.', 'SC_BENEFIT_ONLY_SCHOOL'),
    mk('strategies', 'Janet', 'hiding the school budget is a good strategy to sustain support', 'She says parents should not know.', 'Sharing reports and plans keeps parents involved and trusting.', 'SC_STRATEGY_STOP'),
    mk('who gains', 'Hassan', 'collaboration helps teachers but not learners', 'He says learners gain nothing.', 'Learners gain from the extra resources, security and support.', 'SC_BENEFIT_ONLY_SCHOOL'),
  ], H('Which step says only one side gains, or ends collaboration?', 'Both sides gain, and talking keeps it going.', 'Check each step against the benefits.'))),
  fam('bf.fa.spot', `${BF}BF_FACTORS`, 'spot', 3, spot([
    mk('ranching', 'Chelimo', 'beef ranching suits a small crop farm in a wet highland', 'She says cattle need heavy rain and small plots.', 'Beef cattle need large grassland and enough water.', 'BF_RAIN_CROP'),
    mk('vets', 'Dorothy', 'vets are not needed on a beef farm', 'She says cattle never fall sick.', 'Vets control diseases such as foot-and-mouth that kill cattle.', 'BF_DISEASE_NO'),
    mk('a good area', 'Sam', 'the best area for beef is a thick forest', 'He says trees feed cattle.', 'Beef cattle need open grassland.', 'BF_RAIN_CROP'),
    mk('diseases', 'Linet', 'tsetse flies are no problem for cattle', 'She says the flies do not harm animals.', 'Tsetse flies spread a disease that kills cattle.', 'BF_DISEASE_NO'),
    mk('ranches', 'Peter', 'a ranch is best sited on a wet crop-growing slope', 'He says crop land is best for ranching.', 'Ranches need wide grassland, not small crop land.', 'BF_RAIN_CROP'),
  ], H('Which step puts beef cattle in the wrong place or ignores disease?', 'Cattle need grass, water and health care.', 'Check each step against what cattle need.'))),
  fam('bf.pl.spot', `${BF}BF_PLACES`, 'spot', 3, spot([
    mk('Kenyan ranches', 'Victor', 'the main ranching area of Kenya is the tea highlands of Kericho', 'He says tea land is cattle land.', 'Laikipia and Kajiado are the big ranching areas.', 'BF_BEEF_COAST'),
    mk('Somalia', 'Anita', 'Somalia exports no animals because it is dry', 'She says dry land has no herds.', 'Somalia exports live animals from its dry lands.', 'BF_SOMALIA'),
    mk('beef areas', 'Isaac', 'Mombasa island is a main beef ranching area', 'He says the coast strip is good for ranches.', 'Beef areas are on wide grassland such as Laikipia and Kajiado.', 'BF_BEEF_COAST'),
    mk('Somali herds', 'Brenda', 'Somalia earns its money from tea and flowers', 'She says dry land grows tea.', 'Livestock is a main export of Somalia.', 'BF_SOMALIA'),
    mk('grazing land', 'Charles', 'the wet slopes of Mount Kenya are Kenya\'s ranching land', 'He says rainy slopes suit big herds.', 'Mount Kenya\'s slopes are farms. Ranches are on dry grassland.', 'BF_BEEF_COAST'),
  ], H('Which step puts ranching or herds in the wrong place?', 'Beef areas are dry grasslands.', 'Check each step against where beef is raised.'))),
  fam('bf.ec.spot', `${BF}BF_ECONOMY`, 'spot', 3, spot([
    mk('beef', 'Alex', 'beef farming gives only meat', 'He says cattle give nothing else.', 'Beef farming also gives hides, jobs, manure and exports.', 'BF_MEAT_ONLY'),
    mk('jobs', 'Sylvia', 'beef farming gives no jobs', 'She says only the owner works.', 'Herders, vets, butchers and drivers all earn from beef.', 'BF_NO_JOBS'),
    mk('hides', 'Moses', 'hides and skins are thrown away', 'He says only meat is used.', 'Hides and skins are made into leather goods.', 'BF_MEAT_ONLY'),
    mk('workers', 'Irene', 'nobody earns a living from the beef industry', 'She says beef is only for food at home.', 'Many people earn a living from beef, from the ranch to the shop.', 'BF_NO_JOBS'),
    mk('exports', 'Duncan', 'a country earns nothing from selling beef abroad', 'He says exports bring no money.', 'Beef exports earn foreign exchange.', 'BF_MEAT_ONLY'),
  ], H('Which step says beef gives only meat or no jobs?', 'Beef gives meat, hides, jobs, manure and exports.', 'Check each step against what beef farming gives.'))),
  fam('fi.gr.spot', `${FI}FI_GROUNDS`, 'spot', 3, spot([
    mk('fishing grounds', 'Daniel', 'Lake Victoria is a marine fishing ground', 'He says any big water is the sea.', 'Lake Victoria is inland. Marine grounds are in the sea.', 'FI_LAKE_SEA'),
    mk('fish', 'Mwajuma', 'Nile perch comes from the Indian Ocean', 'She says all fish are from the sea.', 'Nile perch lives in lakes such as Victoria and Turkana.', 'FI_FISH_PLACE'),
    mk('marine', 'Kassim', 'Lake Turkana is a marine fishing ground', 'He says a very large lake is marine.', 'Marine means from the sea. Lake Turkana is a lake.', 'FI_LAKE_SEA'),
    mk('sea fish', 'Rehema', 'tuna is caught in Lake Albert', 'She says tuna lives in lakes.', 'Tuna is caught in the sea, such as the Indian Ocean.', 'FI_FISH_PLACE'),
    mk('inland', 'Hamza', 'the Indian Ocean is an inland fishing ground', 'He says the ocean is on land.', 'Inland grounds are lakes and rivers. The ocean is marine.', 'FI_LAKE_SEA'),
  ], H('Which step mixes the sea with a lake or puts a fish in the wrong water?', 'Marine: sea. Inland: lakes and rivers.', 'Check each step against the fishing grounds.'))),
  fam('fi.me.spot', `${FI}FI_METHODS`, 'spot', 3, spot([
    mk('trawling', 'Aisha', 'trawling means fishing with a hook and line', 'She says trawl means a single hook.', 'Trawling is dragging a large net behind a boat.', 'FI_TRAWL'),
    mk('modern fishing', 'Kelvin', 'a basket trap from a canoe is a modern method', 'He says all small boats are modern.', 'Basket traps and canoes are traditional. Trawlers are modern.', 'FI_TRAD_MODERN'),
    mk('nets', 'Brenda', 'a trawl net is thrown from the shore by hand', 'She says a trawl is a hand net.', 'A trawl net is dragged behind a boat.', 'FI_TRAWL'),
    mk('traditional fishing', 'Hassan', 'a ship with a freezer is a traditional method', 'He says freezers belong to old methods.', 'Ships with freezers are modern. Hooks and dhows are traditional.', 'FI_TRAD_MODERN'),
    mk('trawlers', 'Janet', 'trawling means spearing fish from a canoe', 'She says spears and trawls are the same.', 'Trawling drags a net. Spearing is a traditional method.', 'FI_TRAWL'),
  ], H('Which step gives a wrong meaning of trawling, or calls an old method modern?', 'Trawling means dragging a net.', 'Check each step against the fishing methods.'))),
  fam('wt.fa.spot', `${WT}WT_FACTORS`, 'spot', 3, spot([
    mk('tourism', 'Victor', 'tourists do not need roads, airports or hotels', 'He says visitors reach parks without them.', 'Roads, airports and hotels bring visitors in and house them.', 'WT_TOURIST_ROADS'),
    mk('security', 'Anita', 'insecurity brings more tourists', 'She says danger attracts visitors.', 'Insecurity frightens tourists away.', 'WT_INSECURITY'),
    mk('hotels', 'Isaac', 'a park with no hotels will still fill with visitors', 'He says visitors will sleep anywhere.', 'Few tourists will come if they have nowhere to stay.', 'WT_TOURIST_ROADS'),
    mk('safety', 'Brenda', 'tourists visit places where fighting has just started', 'She says war draws tourists.', 'Fighting and insecurity make tourists stay away.', 'WT_INSECURITY'),
    mk('roads', 'Charles', 'a park with a bad road to it gets the most visitors', 'He says rough roads attract tourists.', 'Good roads and airports make a park easy to reach.', 'WT_TOURIST_ROADS'),
  ], H('Which step says tourism does not need transport or safety?', 'Tourists need access, comfort and safety.', 'Check each step against what draws tourists.'))),
  fam('wt.pa.spot', `${WT}WT_PARKS`, 'spot', 3, spot([
    mk('the Serengeti', 'Wekesa', 'the Serengeti National Park is in Kenya', 'He says the wildebeest park is Kenyan.', 'The Serengeti is in Tanzania. The Maasai Mara is in Kenya.', 'WT_PARK_COUNTRY'),
    mk('gorillas', 'Halima', 'mountain gorillas live in the Maasai Mara', 'She says big wildlife lives on the plains.', 'Mountain gorillas live in the forests of Bwindi in Uganda and Volcanoes in Rwanda.', 'WT_GORILLA'),
    mk('the Maasai Mara', 'Kiprop', 'the Maasai Mara is in Tanzania', 'He says the Mara and Serengeti are both in Tanzania.', 'The Maasai Mara is in Kenya, beside the Serengeti.', 'WT_PARK_COUNTRY'),
    mk('gorilla parks', 'Atieno', 'Amboseli is the park of the mountain gorillas', 'She says the park with elephants has gorillas.', 'Amboseli has elephants. Gorillas live in Bwindi and Volcanoes.', 'WT_GORILLA'),
    mk('Queen Elizabeth', 'Baraka', 'Queen Elizabeth National Park is in Kenya', 'He says famous parks are all Kenyan.', 'Queen Elizabeth National Park is in Uganda.', 'WT_PARK_COUNTRY'),
  ], H('Which step puts a park or an animal in the wrong country or place?', 'Mara is in Kenya, Serengeti is in Tanzania.', 'Check each step against the parks.'))),
  fam('tr.pr.spot', `${TR}TR_PROBLEMS`, 'spot', 3, spot([
    mk('border delays', 'Mercy', 'a one-stop border post makes lorries wait longer', 'She says one stop means more checks.', 'A one-stop post lets both countries check once, so crossing is faster.', 'TR_BORDER'),
    mk('crashes', 'Kenneth', 'higher speeds will reduce road crashes', 'He says faster cars crash less.', 'Speed limits and driver training reduce crashes.', 'TR_CRASH_SOLVE'),
    mk('border posts', 'Lucy', 'a one-stop border post is a place where lorries stop at every office', 'She says it has many separate checks.', 'At a one-stop post both countries check once in one place.', 'TR_BORDER'),
    mk('road safety', 'Hussein', 'removing speed limit signs makes roads safer', 'He says signs cause crashes.', 'Speed limits make roads safer.', 'TR_CRASH_SOLVE'),
    mk('delays', 'Wendy', 'adding more checks at the border speeds trade', 'She says more checks make it faster.', 'Fewer, joint checks such as a one-stop post speed trade.', 'TR_BORDER'),
  ], H('Which step says delays or crashes would be solved by the wrong action?', 'One-stop posts cut delays. Limits and training cut crashes.', 'Check each step against the solutions.'))),
  fam('cm.mo.spot', `${CM}CM_MODES`, 'spot', 3, spot([
    mk('drums', 'Aden', 'the drum is a modern way of communicating', 'He says drums need electricity.', 'The drum is traditional. The mobile phone is modern.', 'CM_TRAD_MODERN'),
    mk('letters', 'Grace', 'a letter reaches many people at once', 'She says a letter is mass communication.', 'Radio and television reach many people at once. A letter reaches one.', 'CM_MASS'),
    mk('messengers', 'Hillary', 'a messenger on foot is a modern means of communication', 'He says all human messengers are modern.', 'Messengers are a traditional means.', 'CM_TRAD_MODERN'),
    mk('phone calls', 'Janet', 'a phone call reaches the whole country at once', 'She says a call is mass media.', 'A call is between two people. Radio and television reach the country.', 'CM_MASS'),
    mk('smoke signals', 'Leonard', 'smoke signals are a modern means', 'He says anything with fire is modern.', 'Smoke signals are a traditional means.', 'CM_TRAD_MODERN'),
  ], H('Which step calls a traditional means modern, or a one-to-one means mass media?', 'Drums and messengers are traditional. Radio reaches many.', 'Check each step against the modes.'))),
  fam('cm.pr.spot', `${CM}CM_PROBLEMS`, 'spot', 3, spot([
    mk('power', 'Aden', 'electricity has nothing to do with communication', 'He says phones work without power.', 'Phones, radios and the internet need power.', 'CM_ELEC'),
    mk('theft', 'Grace', 'training in digital skills stops theft of masts', 'She says skills catch thieves.', 'Laws and guards stop theft of masts. Training builds skills.', 'CM_SOLUTION_SWAP'),
    mk('charging', 'Hillary', 'villages with no electricity can use phones without charging', 'He says phones never run down.', 'Phones need charging, so solar points help.', 'CM_ELEC'),
    mk('false news', 'Janet', 'more masts will stop false news', 'She says signal ends rumours.', 'Laws and digital skills deal with false news. Masts bring signal.', 'CM_SOLUTION_SWAP'),
    mk('solutions', 'Leonard', 'lowering the price of data stops cable theft', 'He says cheap data guards cables.', 'Guards and laws protect cables. Lower prices help cost.', 'CM_SOLUTION_SWAP'),
  ], H('Which step pairs a problem with the wrong solution?', 'Match each problem to its own cure.', 'Check each pair of problem and solution.'))),
  fam('mn.mi.spot', `${MN}MN_MINERALS`, 'spot', 3, spot([
    mk('soda ash', 'Vincent', 'soda ash is mined at Lake Naivasha', 'He says all Rift lakes give soda ash.', 'Soda ash is mined at Lake Magadi.', 'MN_MINERAL_PLACE'),
    mk('tanzanite', 'Hannah', 'tanzanite is mined in Kenya', 'She says gems come from the nearest country.', 'Tanzanite is mined only in Tanzania.', 'MN_TANZANITE'),
    mk('minerals', 'Zachary', 'coffee is a mineral', 'He says any export is a mineral.', 'Coffee is a crop. Minerals are dug from the ground.', 'MN_NOT_MINERAL'),
    mk('gold', 'Mercy', 'Geita in Tanzania is famous for soda ash', 'She says Geita is a lake.', 'Geita is famous for gold. Soda ash is at Lake Magadi.', 'MN_MINERAL_PLACE'),
    mk('gems', 'Samuel', 'tanzanite is mined in Uganda', 'He says all coloured gems are Ugandan.', 'Tanzanite is mined only in Tanzania.', 'MN_TANZANITE'),
  ], H('Which step puts a mineral in the wrong place, or calls a crop a mineral?', 'Soda ash: Magadi. Tanzanite: Tanzania.', 'Check each step against the minerals.'))),
  fam('mn.me.spot', `${MN}MN_METHODS`, 'spot', 3, spot([
    mk('limestone', 'Alex', 'limestone is mined in deep shafts', 'He says all minerals need shafts.', 'Limestone is quarried from an open pit near the surface.', 'MN_METHOD_SWAP'),
    mk('panning', 'Sylvia', 'panning means blasting rock with explosives', 'She says panning is a loud method.', 'Panning is washing gravel in water to find mineral bits.', 'MN_PANNING'),
    mk('quarrying', 'Moses', 'a quarry is a deep underground tunnel', 'He says every mine is underground.', 'A quarry is an open pit cut from the surface.', 'MN_METHOD_SWAP'),
    mk('gold panning', 'Irene', 'a pan is a machine that crushes rock', 'She says panning needs a large machine.', 'A pan is a simple dish used to wash gravel.', 'MN_PANNING'),
    mk('shafts', 'Duncan', 'a shaft is used to quarry limestone', 'He says shafts are for stone.', 'Shafts reach deep minerals. Limestone is quarried in open pits.', 'MN_METHOD_SWAP'),
  ], H('Which step gives the wrong method for the mineral?', 'Pit for near the surface, shaft for deep, pan for gravel.', 'Check each step against the methods.'))),
  fam('tg.bu.spot', `${TG}TG_BUGANDA`, 'spot', 3, spot([
    mk('Buganda', 'Henry', 'the ruler of Buganda was called the Ntemi', 'He says the king of Buganda was a Ntemi.', 'The ruler of Buganda was the Kabaka. The Ntemi ruled a Nyamwezi chiefdom.', 'TG_KABAKA'),
    mk('the Katikkiro', 'Prisca', 'the Katikkiro was the village priest', 'She says the title belongs to a priest.', 'The Katikkiro was the Kabaka\'s chief minister.', 'TG_KATIKKIRO'),
    mk('titles', 'Tom', 'the Kabaka was a chief of a small Nyamwezi chiefdom', 'He says Kabaka and Ntemi are the same.', 'The Kabaka ruled the whole kingdom of Buganda.', 'TG_KABAKA'),
    mk('advisers', 'Lydia', 'the Katikkiro was the army leader at the border', 'She says the chief minister led the army.', 'The Katikkiro was the chief minister who helped the Kabaka rule.', 'TG_KATIKKIRO'),
    mk('the king', 'Fred', 'the king of Buganda was called the Katikkiro', 'He says the chief minister was the king.', 'The king was the Kabaka. The Katikkiro was his chief minister.', 'TG_KABAKA'),
  ], H('Which step gives the wrong title or job in Buganda?', 'Kabaka: king. Katikkiro: chief minister. Lukiiko: council.', 'Check each step against the Buganda titles.'))),
  fam('tg.ny.spot', `${TG}TG_NYAMWEZI`, 'spot', 3, spot([
    mk('the Nyamwezi', 'Aisha', 'the Nyamwezi lived in one large kingdom like Buganda', 'She says all of them had one king.', 'The Nyamwezi had many small chiefdoms, each under a Ntemi.', 'TG_NTEMI_KING'),
    mk('a Ntemi', 'Kelvin', 'a Ntemi was voted into office by all the people', 'He says every Ntemi was elected.', 'A Ntemi inherited the position and was advised by elders.', 'TG_NTEMI_CHOSEN'),
    mk('the chiefdoms', 'Brenda', 'one Ntemi ruled all of the Nyamwezi land', 'She says one chief ruled all.', 'Each Ntemi ruled his own small chiefdom.', 'TG_NTEMI_KING'),
    mk('choosing a Ntemi', 'Hassan', 'a Ntemi was chosen by the Kabaka', 'He says Buganda chose Nyamwezi chiefs.', 'A Ntemi inherited his place within his own family.', 'TG_NTEMI_CHOSEN'),
    mk('size', 'Janet', 'the Nyamwezi had one centralised kingdom', 'She says they were one large state.', 'The Nyamwezi lived in many small chiefdoms.', 'TG_NTEMI_KING'),
  ], H('Which step makes the Nyamwezi one kingdom or says a Ntemi was elected?', 'Many small chiefdoms, a Ntemi who inherited.', 'Check each step against the Nyamwezi.'))),
  fam('rc.ob.spot', `${RC}RC_OBJECTIVES`, 'spot', 3, spot([
    mk('the headquarters', 'Collins', 'the EAC headquarters is in Nairobi', 'He says the biggest city holds it.', 'The EAC headquarters is in Arusha, Tanzania.', 'RC_HQ'),
    mk('a customs union', 'Lilian', 'in a customs union each country taxes its partners\' goods', 'She says partners charge each other duty.', 'In a customs union partners trade without duty and share an outside tariff.', 'RC_CUSTOMS'),
    mk('the Secretariat', 'Hassan', 'the EAC Secretariat sits in Kampala', 'He says the Secretariat is in Uganda.', 'The EAC Secretariat is in Arusha.', 'RC_HQ'),
    mk('duty', 'Grace', 'a customs union means goods pay duty every time they cross a border', 'She says borders always tax partners.', 'Partners trade freely without duty inside a customs union.', 'RC_CUSTOMS'),
    mk('the offices', 'Peter', 'the main EAC office is in Kigali', 'He says it is in the smallest capital.', 'The main EAC office is in Arusha.', 'RC_HQ'),
  ], H('Which step gives the wrong headquarters or the wrong meaning of customs union?', 'Arusha is the headquarters.', 'Check each step against the EAC.'))),
  fam('rc.be.spot', `${RC}RC_BENEFITS`, 'spot', 3, spot([
    mk('a common market', 'Dan', 'only the biggest country gains from the EAC', 'He says small partners lose.', 'All members gain a bigger market.', 'RC_BENEFIT_ONE'),
    mk('workers', 'Everlyne', 'people cannot move to work in another EAC country', 'She says the market allows no movement.', 'The common market allows free movement of people, goods and services.', 'RC_NO_MOVE'),
    mk('who gains', 'Mark', 'Rwanda gains nothing from a bigger market', 'He says only large countries benefit.', 'Small countries gain most from a larger market.', 'RC_BENEFIT_ONE'),
    mk('travel', 'Janet', 'a Kenyan cannot do business in Tanzania in the common market', 'She says business stops at the border.', 'The common market lets people set up business across borders.', 'RC_NO_MOVE'),
    mk('trade', 'Hassan', 'only one member gains from shared roads', 'He says shared roads help one country only.', 'Shared roads help all the members trade.', 'RC_BENEFIT_ONE'),
  ], H('Which step says only one country gains, or that people cannot move?', 'All members gain and people can move.', 'Check each step against the benefits.'))),
  fam('rc.pr.spot', `${RC}RC_PROBLEMS`, 'spot', 3, spot([
    mk('border delays', 'Henry', 'singing the anthem at the gate cuts border delays', 'He says songs speed up lorries.', 'One-stop border posts cut delays.', 'RC_PROBLEM_SOLUTION'),
    mk('disputes', 'Prisca', 'a dispute between partner states should be settled by force', 'She says soldiers should decide.', 'Disputes are settled by talks and the EAC Court of Justice.', 'RC_WAR'),
    mk('trade barriers', 'Tom', 'adding more forms to fill in helps trade between partners', 'He says forms speed up trade.', 'Removing non-tariff barriers and fewer checks help trade.', 'RC_PROBLEM_SOLUTION'),
    mk('quarrels', 'Lydia', 'closing the border for ever ends a quarrel', 'She says no contact means no quarrel.', 'Talks and the Court of Justice settle quarrels peacefully.', 'RC_WAR'),
    mk('roads', 'Fred', 'cutting the number of lorries solves poor roads', 'He says fewer lorries mend roads.', 'Building and linking roads and railways helps trade.', 'RC_PROBLEM_SOLUTION'),
  ], H('Which step pairs a problem with the wrong solution, or uses force?', 'Match each EAC problem to its cure.', 'Check each step against the solutions.'))),
  fam('cz.rr.spot', `${CZ}CZ_RIGHTS_RESP`, 'spot', 3, spot([
    mk('duties', 'Gilbert', 'paying taxes is a right of a citizen', 'He says paying is something received.', 'Paying taxes is a responsibility. Free movement is a right.', 'CZ_RIGHT_RESP'),
    mk('voting', 'Hellen', 'a Kenyan citizen can vote at 14 years', 'She says children can vote.', 'A Kenyan citizen can vote at 18.', 'CZ_VOTE_AGE'),
    mk('rights', 'Abdi', 'obeying the law is a right of a citizen', 'He says obeying is something we receive.', 'Obeying the law is a responsibility.', 'CZ_RIGHT_RESP'),
    mk('voting age', 'Beth', 'a Kenyan citizen can vote at 21 years only', 'She says only adults over 21 vote.', 'A Kenyan citizen can vote at 18.', 'CZ_VOTE_AGE'),
    mk('responsibility', 'Collins', 'owning property is a responsibility of a citizen', 'He says owning is a duty.', 'Owning property is a right.', 'CZ_RIGHT_RESP'),
  ], H('Which step sorts a right or duty wrongly, or gives the wrong voting age?', 'Rights are what we may enjoy. Duties are what we must do.', 'Check each step against rights and duties.'))),
  fam('hr.ca.spot', `${HR}HR_CATEGORIES`, 'spot', 3, spot([
    mk('the vote', 'Patrick', 'the right to vote is an economic right', 'He says voting is about money.', 'The right to vote is a political right.', 'HR_CAT_SWAP'),
    mk('school', 'Hellen', 'the right to education is a political right', 'She says school is about politics.', 'Education is a social right.', 'HR_EDU'),
    mk('standing for office', 'Wilfred', 'standing for election is an economic right', 'He says candidates earn money.', 'Standing for election is a political right.', 'HR_CAT_SWAP'),
    mk('health', 'Gloria', 'the right to health care is a political right', 'She says hospitals are political.', 'Health care is a social right.', 'HR_EDU'),
    mk('work', 'Said', 'the right to work is a political right', 'He says jobs are political.', 'The right to work is an economic right.', 'HR_CAT_SWAP'),
  ], H('Which step puts a right in the wrong category?', 'Political: vote. Social: school, health. Economic: work, property.', 'Check each step against the categories.'))),
  fam('pc.ca.spot', `${PC}PC_CAUSES`, 'spot', 3, spot([
    mk('causes', 'Edwin', 'conflicts have no cause and just happen', 'He says there is never a reason.', 'Conflicts have causes such as quarrels over land and water.', 'PC_NO_CAUSE'),
    mk('settling quarrels', 'Lucy', 'fighting is the best way to settle a quarrel', 'She says the winner is right.', 'Quarrels are settled by talking and listening.', 'PC_VIOLENCE_SOLVE'),
    mk('reasons', 'Salim', 'competition for water causes no trouble', 'He says sharing is never a problem.', 'Competition for scarce water and pasture causes conflict.', 'PC_NO_CAUSE'),
    mk('quarrels', 'Dorcas', 'a fight ends a quarrel for ever', 'She says violence ends all trouble.', 'Fighting hurts people and makes the quarrel worse.', 'PC_VIOLENCE_SOLVE'),
    mk('unfairness', 'Joseph', 'unfair sharing of resources has nothing to do with conflict', 'He says people do not mind unfairness.', 'Unfair sharing makes people angry and can cause conflict.', 'PC_NO_CAUSE'),
  ], H('Which step says conflict has no cause, or that fighting is the answer?', 'Conflicts have causes and talk settles them.', 'Check each step against the causes.'))),
  fam('pc.pr.spot', `${PC}PC_PROMOTE`, 'spot', 3, spot([
    mk('peace', 'Christine', 'taking revenge promotes peace', 'She says hitting back ends trouble.', 'Forgiving and talking promote peace.', 'PC_REVENGE'),
    mk('rumours', 'Francis', 'spreading rumours is harmless', 'He says words cannot hurt.', 'Rumours start or increase conflict.', 'PC_RUMOUR'),
    mk('hurt', 'Wilson', 'paying back a wrong with a wrong keeps peace', 'He says an eye for an eye is peace.', 'Revenge brings more conflict. Talking and forgiving bring peace.', 'PC_REVENGE'),
    mk('gossip', 'Ruth', 'telling everyone a story you have not checked helps peace', 'She says sharing news is good.', 'Unchecked stories can start conflict.', 'PC_RUMOUR'),
    mk('revenge', 'Stephen', 'attacking those who hurt you shows love for peace', 'He says strength proves peace.', 'Peaceful people forgive and settle things by talk.', 'PC_REVENGE'),
  ], H('Which step says revenge or rumours help peace?', 'Talk, forgive and check the facts.', 'Check each step against what builds peace.'))),
  fam('gr.so.spot', `${GR}GR_SOURCES`, 'spot', 3, spot([
    mk('taxes', 'Titus', 'a bank loan is a tax', 'He says all money for government is tax.', 'A tax is compulsory and not repaid. A loan must be repaid.', 'GR_LOAN_TAX'),
    mk('collecting tax', 'Rachel', 'the police collect national taxes', 'She says the police take tax from shops.', 'The Kenya Revenue Authority collects national taxes.', 'GR_COLLECTOR'),
    mk('revenue', 'Collins', 'a loan from another country is a tax', 'He says borrowed money is tax.', 'A loan is borrowed and must be repaid. A tax is not repaid.', 'GR_LOAN_TAX'),
    mk('the collector', 'Beatrice', 'the county assembly collects the national income tax', 'She says the assembly collects it.', 'The Kenya Revenue Authority collects national taxes.', 'GR_COLLECTOR'),
    mk('tax', 'Elijah', 'a gift from a friend is a tax', 'He says money from anywhere is tax.', 'A tax is a compulsory payment to the government.', 'GR_LOAN_TAX'),
  ], H('Which step calls a loan or a gift a tax, or names the wrong collector?', 'KRA collects taxes. A loan is repaid.', 'Check each step against the sources of revenue.'))),
  fam('gr.sp.spot', `${GR}GR_SPENDING`, 'spot', 3, spot([
    mk('teachers', 'Allan', 'the county government pays the teachers', 'He says counties run all schools.', 'The national government pays teachers through the Teachers Service Commission.', 'GR_LEVEL_SWAP'),
    mk('taxes', 'Brenda', 'tax money is kept by officials and not spent on services', 'She says tax pays nothing.', 'Tax money pays for roads, schools, hospitals and security.', 'GR_TAX_WASTE'),
    mk('defence', 'Duncan', 'the county government pays for the army', 'He says counties run the defence forces.', 'Defence is paid for by the national government.', 'GR_LEVEL_SWAP'),
    mk('services', 'Janet', 'taxes are not used to build schools', 'She says schools are paid for in other ways.', 'Tax money helps build schools and pay teachers.', 'GR_TAX_WASTE'),
    mk('dispensaries', 'Stephen', 'the national government builds every village dispensary', 'He says county clinics are national.', 'County governments run county health services such as dispensaries.', 'GR_LEVEL_SWAP'),
  ], H('Which step gives the wrong level of government, or says taxes pay for nothing?', 'National: defence, teachers. County: local health, roads.', 'Check each step against who pays for what.'))),
  fam('pr.kw.spot', `${PR}PR_KEYWORDS`, 'spot', 3, spot([
    mk('the preamble', 'Duncan', 'the preamble is the last part of the Constitution', 'He says the opening statement is at the back.', 'The preamble is at the beginning. Pre means before.', 'PR_WHAT'),
    mk('power', 'Janet', 'the President holds the sovereign power in the preamble', 'She says the leader holds the power.', 'The preamble begins with We, the people of Kenya. The people hold sovereign power.', 'PR_SOVEREIGN_WHO'),
    mk('position', 'Moses', 'the preamble comes at the end as a closing note', 'He says every document ends with the preamble.', 'The preamble opens the Constitution.', 'PR_WHAT'),
    mk('who rules', 'Ruth', 'sovereign power belongs to the Parliament of Kenya', 'She says the lawmakers hold all power.', 'The people of Kenya hold the sovereign power.', 'PR_SOVEREIGN_WHO'),
    mk('the preamble', 'Allan', 'the preamble is a list of counties', 'He says it names the 47 counties.', 'The preamble is the opening statement of the aims and values of the Constitution.', 'PR_WHAT'),
  ], H('Which step puts the preamble in the wrong place or gives the wrong holder of power?', 'It opens the Constitution. The people hold sovereign power.', 'Check each step against the preamble.'))),
];
