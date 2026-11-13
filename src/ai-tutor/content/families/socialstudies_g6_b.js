// ============================================================================
// GRADE 6 SOCIAL STUDIES, STRAND 2: PEOPLE AND SOCIAL ORGANISATION (11 skills).
// Language groups and their migration, population distribution and density, age-groups, age-sets and clans, school and community.
// Written offline from the KICD 2024 design through the curriculum map (curriculum/social_studies/g6.json). Origins of the groups are
// the account the design follows; historians differ on details, so the library marks them for a teacher to confirm. Figures are rounded.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w } from './socialstudies_g6_lib.js';

const LG = 'PEOPLE.LANGUAGE_GROUPS_IN_EASTE.', PD = 'PEOPLE.POPULATION_DISTRIBUTION_.', CS = 'PEOPLE.CULTURE_AND_SOCIAL_ORGAN.', SC = 'PEOPLE.SCHOOL_AND_COMMUNITY.';
const T = (head, rows) => ({ t: { head, rows } });

export const FAMILIES = [
  // ---------------------------------------------------------------- LG_CLASSIFY
  fam('lg.cl.which', `${LG}LG_CLASSIFY`, 'direct', 1, choose([
    Q('Which language group do the Luo belong to?', 'Nilotic', w('LG_GROUP_SWAP', 'Bantu', 'Cushitic', 'Semitic'), 'The Luo, Acholi, Dinka and Nuer belong to the Nilotic group.'),
    Q('Which language group do the Baganda belong to?', 'Bantu', w('LG_GROUP_SWAP', 'Nilotic', 'Cushitic', 'Semitic'), 'The Baganda, Nyamwezi, Chagga and Kikuyu belong to the Bantu group.'),
    Q('Which language group do the Somali belong to?', 'Cushitic', w('LG_SOMALI', 'Bantu', 'Nilotic', 'Semitic'), 'The Somali, Oromo and Afar belong to the Cushitic group.'),
    Q('Which language group do the Maasai belong to?', 'Nilotic', w('LG_GROUP_SWAP', 'Bantu', 'Cushitic', 'Semitic'), 'The Maasai speak a Nilotic language, though they live near Bantu neighbours.'),
    Q('Which language group do the Nyamwezi belong to?', 'Bantu', w('LG_GROUP_SWAP', 'Nilotic', 'Cushitic', 'Semitic'), 'The Nyamwezi of Tanzania belong to the Bantu group.'),
  ], { h: ['Think of the language each community speaks.', 'Bantu, Nilotic and Cushitic are the three groups.'], s1: 'Link the community to its language group.' })),
  fam('lg.cl.list', `${LG}LG_CLASSIFY`, 'word', 2, choose([
    Q('Which list has only Nilotic communities?', 'Luo, Acholi, Turkana', w('LG_GROUP_SWAP', 'Luo, Kikuyu, Turkana', 'Luo, Somali, Maasai', 'Acholi, Baganda, Dinka'), 'The Luo, Acholi and Turkana are all Nilotic.'),
    Q('Which list has only Bantu communities?', 'Chagga, Kikuyu, Baganda', w('LG_GROUP_SWAP', 'Chagga, Luo, Baganda', 'Kikuyu, Maasai, Baganda', 'Chagga, Somali, Kikuyu'), 'The Chagga, Kikuyu and Baganda are all Bantu.'),
    Q('Which list has only Cushitic communities?', 'Somali, Oromo, Afar', w('LG_SOMALI', 'Somali, Luo, Afar', 'Oromo, Kikuyu, Afar', 'Somali, Maasai, Oromo'), 'The Somali, Oromo and Afar are all Cushitic.'),
    Q('The Maasai are Plain Nilotes. Which other community is a Plain Nilote?', 'Turkana', w('LG_SUBGROUP', 'Kalenjin', 'Luo', 'Kikuyu'), 'The Maasai, Turkana and Karamojong are Plain Nilotes.'),
    Q('The Luo are River-Lake Nilotes. Which other community is a River-Lake Nilote?', 'Acholi', w('LG_SUBGROUP', 'Maasai', 'Turkana', 'Kalenjin'), 'The Luo, Acholi, Dinka and Nuer are River-Lake Nilotes.'),
  ], { h: ['Check each community in the list.', 'One wrong name makes the whole list wrong.'], s1: 'Check every name in the list.' })),
  fam('lg.cl.spot', `${LG}LG_CLASSIFY`, 'spot', 3, spot([
    S('Mercy says the Luo are Bantu because they live near the Luhya. Which step has the mistake?', ['Step 1: Mercy knows the Luo live near Bantu people.', '!Step 2: She sorts people by where they live, not by language.', 'Step 3: She writes Bantu.'], 'The Luo speak a Nilotic language. Neighbours can belong to different groups.', 'LG_GROUP_SWAP'),
    S('Hussein says the Somali are Nilotic. Which step has the mistake?', ['Step 1: Hussein knows the Somali herd camels.', '!Step 2: He thinks all herders are Nilotic.', 'Step 3: He writes Nilotic.'], 'The Somali are Cushitic. Herding does not decide the language group.', 'LG_SOMALI'),
    S('Jacob says the Kalenjin are Plain Nilotes. Which step has the mistake?', ['Step 1: Jacob knows the Kalenjin are Nilotic.', '!Step 2: He says all Nilotes are Plain Nilotes.', 'Step 3: He writes Plain Nilotes.'], 'The Kalenjin are Highland Nilotes. The Maasai and Turkana are Plain Nilotes.', 'LG_SUBGROUP'),
    S('Anne says the Maasai are Bantu because they live in Kenya with Bantu neighbours. Which step has the mistake?', ['Step 1: Anne knows the Maasai live among Bantu people.', '!Step 2: She says living nearby makes them Bantu.', 'Step 3: She writes Bantu.'], 'The Maasai speak a Nilotic language.', 'LG_GROUP_SWAP'),
    S('Nelson says the Oromo are Bantu. Which step has the mistake?', ['Step 1: Nelson knows the Oromo live in Ethiopia.', '!Step 2: He thinks all Africans in the east are Bantu.', 'Step 3: He writes Bantu.'], 'The Oromo are Cushitic.', 'LG_SOMALI'),
  ], { h: ['Which step sorts a community by place instead of by language?', 'The groups are about language.'], s1: 'Check each step against the language group.' })),

  // ---------------------------------------------------------------- LG_REASONS_ROUTES
  fam('lg.rr.reason', `${LG}LG_REASONS_ROUTES`, 'direct', 1, choose([
    Q('Why did many groups move to new lands?', 'To look for pasture, water and fertile land', w('LG_NO_REASON', 'To avoid learning any new languages', 'To go on a holiday just for fun', 'To visit their relatives once every year'), 'People moved to find food, water and pasture, and to escape drought and war.'),
    Q('A herding community moves because its cattle are dying in a drought. What kind of reason is this?', 'Looking for pasture and water', w('LG_NO_REASON', 'Looking for work in a city', 'Looking for tourists', 'Looking for a school'), 'Drought pushes herders to look for pasture and water.'),
    Q('Which of these is a reason why people migrated long ago?', 'Escape from war and disease', w('LG_NO_REASON', 'Wish to see foreign films', 'Wish to buy new clothes', 'Wish to win a race'), 'War, famine and disease have forced people to move.'),
    Q('Why might a crowded community send some families to new land?', 'Land became crowded and short', w('LG_NO_REASON', 'The rain fell on every farm', 'Food was plentiful for all', 'The roads were very good'), 'When land is too crowded, some families move to find more.'),
    Q('Which reason fits a group that moved to find animals to hunt?', 'Search for trade and hunting grounds', w('LG_NO_REASON', 'Fear of a very good harvest', 'Wish to be alone for the rest of life', 'No need to eat for many months'), 'Some groups moved to find hunting grounds and trade.'),
  ], { h: ['Think of what a family needs to live.', 'Food, water, safety and land.'], s1: 'Think of what people needed.' })),
  fam('lg.rr.origin', `${LG}LG_REASONS_ROUTES`, 'table', 2, choose([
    Q('Where did the Bantu come from?', 'The Congo Basin', w('LG_BANTU_ORIGIN', 'The Ethiopian highlands', 'The Nile in South Sudan', 'The Indian Ocean'), 'The Bantu came from the Congo Basin and moved east and south.',
      T(['Group', 'Where they came from'], [['Bantu', 'The Congo Basin'], ['Nilotes', 'The Nile in South Sudan'], ['Cushites', 'The Horn of Africa']])),
    Q('Where did the Nilotes come from?', 'The Nile region in South Sudan', w('LG_BANTU_ORIGIN', 'The Congo Basin', 'The Ethiopian highlands', 'The Indian Ocean coast'), 'The Nilotes came from the Nile region of South Sudan and moved south.'),
    Q('Where did the Cushites come from?', 'The Horn of Africa and Ethiopian highlands', w('LG_BANTU_ORIGIN', 'The Congo Basin', 'The Nile in South Sudan', 'The Rift Valley floor'), 'The Cushites came from the north, in the Horn of Africa, and moved south.'),
    Q('Which way did the Cushites move into Kenya?', 'South, from Ethiopia', w('LG_CUSH_DIRECTION', 'North, from Tanzania', 'West, from Uganda', 'East, from the ocean'), 'The Cushites came from Ethiopia in the north and moved south.'),
    Q('Which way did the Bantu move from the Congo Basin?', 'East and south', w('LG_CUSH_DIRECTION', 'North into Egypt', 'West into the sea', 'Back to the Nile'), 'The Bantu moved east and south from the Congo Basin.'),
  ], { h: ['Recall the homeland of each group.', 'Cushites: Ethiopia. Nilotes: South Sudan. Bantu: Congo Basin.'], s1: 'Match the group to its homeland and direction.' }), 'c'),
  fam('lg.rr.spot', `${LG}LG_REASONS_ROUTES`, 'spot', 3, spot([
    S('Cecil says the Bantu came from Ethiopia. Which step has the mistake?', ['Step 1: Cecil knows some groups came from Ethiopia.', '!Step 2: He puts all groups in Ethiopia.', 'Step 3: He writes Ethiopia for the Bantu.'], 'The Cushites came from Ethiopia. The Bantu came from the Congo Basin.', 'LG_BANTU_ORIGIN'),
    S('Phoebe says the Cushites moved north into Kenya. Which step has the mistake?', ['Step 1: Phoebe finds Kenya and Ethiopia on a map.', '!Step 2: She puts Ethiopia south of Kenya.', 'Step 3: She writes the Cushites moved north.'], 'Ethiopia is north of Kenya, so the Cushites moved south.', 'LG_CUSH_DIRECTION'),
    S('Brian says people moved only for fun. Which step has the mistake?', ['Step 1: Brian thinks of people travelling.', '!Step 2: He says travel is always for pleasure.', 'Step 3: He writes only for fun.'], 'People moved to find pasture, water and land, and to escape drought, war and disease.', 'LG_NO_REASON'),
    S('Mwanaisha says the Nilotes came from the Congo Basin. Which step has the mistake?', ['Step 1: Mwanaisha knows the Bantu came from the Congo.', '!Step 2: She says all groups came from there.', 'Step 3: She writes Congo Basin.'], 'The Nilotes came from the Nile region of South Sudan.', 'LG_BANTU_ORIGIN'),
    S('Kevin says herders move when the grass is plentiful. Which step has the mistake?', ['Step 1: Kevin knows herders move often.', '!Step 2: He says they move when food is plentiful.', 'Step 3: He writes plentiful.'], 'Herders move when pasture and water are short.', 'LG_NO_REASON'),
  ], { h: ['Which step gives a wrong homeland or a wrong reason?', 'Check the homeland and direction.'], s1: 'Check each step against the homelands.' })),

  // ---------------------------------------------------------------- LG_EFFECTS
  fam('lg.ef.which', `${LG}LG_EFFECTS`, 'direct', 1, choose([
    Q('Which is an effect of groups settling near each other?', 'They traded and some families intermarried', w('LG_ALL_SAME', 'They stopped speaking to each other', 'They never met one another again', 'They all became exactly the same'), 'Neighbours traded, married and shared ideas, but each group kept its own identity.'),
    Q('Which is a bad effect of migration and settlement?', 'Quarrels over land and pasture', w('LG_NO_CONFLICT', 'A greater supply of food', 'New farming skills spread', 'More trade between people'), 'Settlement could cause quarrels when groups wanted the same land.'),
    Q('Which is a good effect of migration and settlement?', 'New skills such as iron working spread', w('LG_NO_CONFLICT', 'Wars over cattle and water holes', 'Land disputes between two groups', 'Families lost their homes and herds'), 'Groups shared skills such as iron working and new crops.'),
    Q('What spread because groups moved and met?', 'Languages, customs and farming methods', w('LG_ALL_SAME', 'Nothing at all was shared', 'Only one language everywhere', 'Only one set of customs for all'), 'Moving groups carried their languages and customs with them.'),
    Q('Which is an effect of settlement?', 'New villages and towns grew up', w('LG_NO_CONFLICT', 'The people all went home', 'All the land became empty', 'No one lived anywhere'), 'Settlers built new villages and the population grew.'),
  ], { h: ['Think of good and bad effects when people meet.', 'Trade, marriage and sharing skills; also quarrels over land.'], s1: 'Think of what happens when groups meet.' })),
  fam('lg.ef.story', `${LG}LG_EFFECTS`, 'word', 2, choose([
    Q('Bantu farmers settled near Nilotic herders. Farmers gave grain and herders gave milk. What is this called?', 'Trade', w('LG_NO_CONFLICT', 'A quarrel over land', 'A migration', 'A drought'), 'Exchange of goods is trade, a good effect of settling near each other.'),
    Q('Two groups both wanted the same river for their cattle. What effect of settlement is this?', 'A quarrel over water', w('LG_NO_CONFLICT', 'Trade', 'Intermarriage', 'Sharing of skills'), 'Groups sometimes quarrelled over water and pasture.'),
    Q('A Kalenjin man marries a Luhya woman. What effect of settlement is this?', 'Intermarriage', w('LG_ALL_SAME', 'A quarrel over land', 'A drought', 'A famine'), 'People of different groups married and mixed.'),
    Q('Some Maasai learn Swahili to trade with coastal people. Which effect is this?', 'Languages and customs spread', w('LG_ALL_SAME', 'All groups became one', 'The Maasai language disappeared', 'Trade stopped'), 'People learned each other\'s languages to trade.'),
    Q('After many years Kikuyu and Maasai still speak different languages. What does this show?', 'Groups mixed but kept their own identity', w('LG_ALL_SAME', 'The groups never met', 'The groups became the same', 'The groups were enemies'), 'Groups traded and mixed but did not all become the same.'),
  ], { h: ['Is the effect good or bad for the groups?', 'Trade, marriage and sharing are good. Quarrels over land are bad.'], s1: 'Decide which effect the story shows.' })),

  // ---------------------------------------------------------------- PD_FACTORS
  fam('pd.fa.which', `${PD}PD_FACTORS`, 'direct', 1, choose([
    Q('Why do few people live in a desert?', 'It is too dry to farm or find water', w('PD_PEOPLE_DESERT', 'Land is too cheap there', 'The land is too crowded', 'There are too many schools'), 'People need water and food, which are hard to find in a desert.'),
    Q('Which place is more likely to be crowded?', 'Gentle land with fertile soil and rain', w('PD_MOUNTAIN_TOP', 'A steep, rocky mountain top', 'A hot, dry desert plain', 'A swamp full of mosquitoes'), 'Gentle, fertile land with rain supports many farmers.'),
    Q('Which factor attracts many people to a town?', 'Jobs and industries', w('PD_PEOPLE_DESERT', 'Empty land and silence', 'Long droughts', 'Poor roads'), 'People move to places with jobs and industries.'),
    Q('Why do few people live in thick forest?', 'It is hard to clear and to farm', w('PD_MOUNTAIN_TOP', 'It is too cool for the people', 'It has too many farms', 'It has too many roads'), 'Thick forest is hard to clear, so few people settle there.'),
    Q('Which factor keeps people away from an area?', 'Insecurity and war', w('PD_PEOPLE_DESERT', 'Peace and good roads', 'Fertile soil and rain', 'Large markets'), 'People leave unsafe areas.'),
  ], { h: ['Think of what a family needs: water, food, safety and jobs.', 'Fertile, gentle, wet and peaceful places attract people.'], s1: 'Think of what draws people or keeps them away.' })),
  fam('pd.fa.story', `${PD}PD_FACTORS`, 'word', 2, choose([
    Q('A highland area has deep soil, good rain and a railway. Many people live there. Which factor is NOT part of the reason?', 'A hot, dry desert', w('PD_PEOPLE_DESERT', 'Deep soil', 'Good rain', 'A railway'), 'Soil, rain and transport attract people. A desert does not.'),
    Q('Few people live near the Danakil desert. Which factor explains this?', 'Extreme heat and very little water', w('PD_PEOPLE_DESERT', 'Rich soil and plenty of rain', 'A large and busy sea port', 'Many jobs in town offices'), 'Extreme heat and lack of water keep people away.'),
    Q('A farmer moves from the steep, rocky hills to gentle land beside a river. Why?', 'Gentle land and water are better for farming', w('PD_MOUNTAIN_TOP', 'Rivers have no fish to eat', 'Steep rocky hills are better for farming', 'The hills are too warm for crops'), 'Gentle land and water make farming easier.'),
    Q('Why do many people settle near Lake Victoria?', 'Fertile soil, rain and fish', w('PD_PEOPLE_DESERT', 'It has no water for the farms', 'It is dry, empty and very cold', 'It is far away from every road'), 'Rain, soil and fish support many people.'),
    Q('Which area would you expect to be thinly populated?', 'A swamp with tsetse flies', w('PD_MOUNTAIN_TOP', 'A plain with rich soil and rain', 'A busy port city', 'A large town with industries'), 'Tsetse flies carry disease and keep people and cattle away.'),
  ], { h: ['Which factor helps or harms living in the place?', 'Water, soil, health and safety matter.'], s1: 'Think about what helps or harms life there.' })),

  // ---------------------------------------------------------------- PD_AREAS
  fam('pd.ar.table', `${PD}PD_AREAS`, 'table', 1, choose([
    Q('Look at the table. Which country has the highest population density?', 'Rwanda', w('PD_RWANDA_EMPTY', 'Somalia', 'South Sudan', 'Tanzania'), 'Rwanda has the most people for each square kilometre.',
      T(['Country', 'People for each square kilometre (about)'], [['Rwanda', '500'], ['Tanzania', '70'], ['Somalia', '30'], ['South Sudan', '20']])),
    Q('Which country has the lowest population density?', 'South Sudan', w('PD_RWANDA_EMPTY', 'Uganda', 'Kenya', 'Burundi'), 'South Sudan has the fewest people for each square kilometre.',
      T(['Country', 'People for each square kilometre (about)'], [['Burundi', '450'], ['Uganda', '200'], ['Kenya', '90'], ['South Sudan', '20']])),
    Q('Which country is more crowded than Kenya?', 'Uganda', w('PD_DENSITY_TOTAL', 'Somalia', 'Tanzania', 'South Sudan'), 'Uganda has about 200 people for each square kilometre, more than Kenya\'s 90.',
      T(['Country', 'People for each square kilometre (about)'], [['Uganda', '200'], ['Tanzania', '70'], ['Somalia', '30'], ['South Sudan', '20']])),
    Q('Density is the number of people for what?', 'Each square kilometre of land', w('PD_DENSITY_TOTAL', 'The whole country', 'Each family', 'Each town'), 'Density is the number of people for each square kilometre.'),
    Q('Which small country is one of the most crowded?', 'Rwanda', w('PD_RWANDA_EMPTY', 'Somalia', 'Ethiopia', 'South Sudan'), 'Rwanda is small, with many people on its land.'),
  ], { h: ['Compare the numbers in the column.', 'The biggest number means the most crowded.'], s1: 'Compare the people for each square kilometre.' })),
  fam('pd.ar.where', `${PD}PD_AREAS`, 'word', 2, choose([
    Q('Which area of Eastern Africa is thinly populated?', 'Northern Kenya and the Somali lowlands', w('PD_RWANDA_EMPTY', 'The Lake Victoria basin', 'The Kenyan highlands', 'The city of Nairobi'), 'Dry lowlands support few people.'),
    Q('Which area of Eastern Africa is densely populated?', 'The Lake Victoria basin', w('PD_RWANDA_EMPTY', 'The Danakil desert', 'The swamps of South Sudan', 'Northern Kenya'), 'Fertile land and rain near the lake support many people.'),
    Q('Which city is one of the most crowded places in Eastern Africa?', 'Dar es Salaam', w('PD_RWANDA_EMPTY', 'A desert village', 'A forest camp', 'A mountain top'), 'Big cities such as Dar es Salaam, Nairobi and Kampala are densely populated.'),
    Q('Which of these is densely populated?', 'The highlands of Ethiopia', w('PD_RWANDA_EMPTY', 'The Ogaden lowlands', 'The Danakil desert', 'The Sudd swamps'), 'The highlands have cool weather and good rain.'),
    Q('Which of these is thinly populated?', 'The Danakil desert', w('PD_RWANDA_EMPTY', 'Kigali city', 'The Lake Victoria shore', 'Nairobi city'), 'The Danakil desert is extremely hot and dry.'),
  ], { h: ['Think about water, soil and jobs.', 'Crowded: fertile highlands, lake shores and big cities.'], s1: 'Match the area to crowded or thin.' })),
  fam('pd.ar.spot', `${PD}PD_AREAS`, 'spot', 3, spot([
    S('Edwin says the country with the most people always has the highest density. Which step has the mistake?', ['Step 1: Edwin knows Ethiopia has many people.', '!Step 2: He says density is the same as total people.', 'Step 3: He writes Ethiopia has the highest density.'], 'Density is people for each square kilometre. Rwanda has fewer people but a higher density.', 'PD_DENSITY_TOTAL'),
    S('Lucy says Rwanda has few people because it is small. Which step has the mistake?', ['Step 1: Lucy sees that Rwanda is small.', '!Step 2: She says small countries have few people for their land.', 'Step 3: She writes Rwanda is thinly populated.'], 'Rwanda has many people on a small land, so its density is high.', 'PD_RWANDA_EMPTY'),
    S('Salim says northern Kenya is densely populated because it is large. Which step has the mistake?', ['Step 1: Salim sees a large area on the map.', '!Step 2: He says a large area means many people.', 'Step 3: He writes densely populated.'], 'Northern Kenya is large but dry, so it has few people for each square kilometre.', 'PD_DENSITY_TOTAL'),
    S('Dorcas says density is the number of people in the whole country. Which step has the mistake?', ['Step 1: Dorcas reads the word density.', '!Step 2: She counts all the people in the country.', 'Step 3: She writes the total.'], 'Density is the number of people for each square kilometre.', 'PD_DENSITY_TOTAL'),
    S('Joseph says Burundi is thinly populated because it is a small country. Which step has the mistake?', ['Step 1: Joseph finds Burundi on the map.', '!Step 2: He says small means few people.', 'Step 3: He writes thinly populated.'], 'Burundi has many people on a small land, so its density is high.', 'PD_RWANDA_EMPTY'),
  ], { h: ['Which step mixes density with size or total people?', 'Density is people for each square kilometre.'], s1: 'Check each step against the meaning of density.' })),

  // ---------------------------------------------------------------- PD_EFFECTS
  fam('pd.ef.which', `${PD}PD_EFFECTS`, 'direct', 1, choose([
    Q('What happens to farms when families grow large in a crowded area?', 'Farms are divided into smaller plots', w('PD_MORE_LAND', 'Farms get larger and larger each year', 'Farms stay the same size for each child', 'Farms are no longer needed by anyone'), 'Land is shared among more children, so plots get smaller.'),
    Q('What pressure does a crowded area put on schools and hospitals?', 'They have too many people to serve', w('PD_SERVICES', 'They have too few learners to teach', 'They have empty rooms and spare beds', 'They have too little work for staff'), 'Large numbers crowd classes and clinics.'),
    Q('Which is an effect of high population density?', 'Unemployment and a shortage of jobs', w('PD_MORE_LAND', 'Cheap and empty land for everybody', 'Fewer people living in the big towns', 'Plenty of free land for all families'), 'With many people, jobs and land become short.'),
    Q('Which is an effect of high population density on the environment?', 'Forests are cut for farms and fuel', w('PD_MORE_LAND', 'Forests grow back on their own', 'Soil becomes richer each year', 'Rivers become cleaner'), 'More people need land and fuel, so forests shrink.'),
    Q('Which is a possible good effect of high density?', 'A large market and many workers', w('PD_SERVICES', 'More empty land for farming', 'Less need for schools', 'Fewer jobs for all'), 'Many people can mean a large market and a supply of workers.'),
  ], { h: ['Think what happens when there are many people for little land.', 'Land, food, jobs and services become short.'], s1: 'Think about land, jobs and services.' })),
  fam('pd.ef.story', `${PD}PD_EFFECTS`, 'word', 2, choose([
    Q('Mzee Kimani has 2 acres and 5 sons. When he dies, each son gets a small piece. What effect of high density is this?', 'Land is divided into small plots', w('PD_MORE_LAND', 'Land becomes cheaper for the family', 'Land is not needed by the sons', 'Land becomes larger for each son'), 'Shared among many heirs, plots shrink.'),
    Q('A school with 40 desks has 90 learners. What does this show?', 'Pressure on services in a crowded area', w('PD_SERVICES', 'A low population density in the area', 'Little demand for education in the town', 'Too few learners to fill the school'), 'Large numbers put pressure on schools.'),
    Q('Why are many people in a crowded town living in slums?', 'There are too few houses for the people', w('PD_MORE_LAND', 'Houses are free for all to take', 'There is too much empty space to use', 'Nobody wants to live in a house'), 'Housing is short when many people crowd into a town.'),
    Q('Why might food be short in a crowded area?', 'Farms are small and many mouths must be fed', w('PD_MORE_LAND', 'Soil is free for all to take', 'Very few people need to eat food', 'Farms are very large for each family'), 'Small plots may not feed many people.'),
    Q('Why does a crowded town have more traffic jams and pollution?', 'Many people and vehicles use the same space', w('PD_SERVICES', 'There are no cars in the town', 'The roads are far too wide', 'Very few people use the roads'), 'Crowding increases traffic and pollution.'),
  ], { h: ['What happens when more people share the same land or services?', 'Pressure builds.'], s1: 'Think about land, houses and services.' })),
  fam('pd.ef.spot', `${PD}PD_EFFECTS`, 'spot', 3, spot([
    S('Christine says high density means plenty of land for everyone. Which step has the mistake?', ['Step 1: Christine knows many people live in the area.', '!Step 2: She says many people means more land each.', 'Step 3: She writes plenty of land.'], 'More people on the same land means less land for each person.', 'PD_MORE_LAND'),
    S('Francis says a crowded area has too few learners for its schools. Which step has the mistake?', ['Step 1: Francis sees a school in a crowded town.', '!Step 2: He says crowded means empty classrooms.', 'Step 3: He writes too few learners.'], 'Crowded areas often have too many learners for the school.', 'PD_SERVICES'),
    S('Wilson says farms grow bigger when families grow larger. Which step has the mistake?', ['Step 1: Wilson sees families grow.', '!Step 2: He says land grows with the family.', 'Step 3: He writes bigger farms.'], 'Land does not grow, so it is divided into smaller plots.', 'PD_MORE_LAND'),
    S('Ruth says hospitals in crowded areas have too little work. Which step has the mistake?', ['Step 1: Ruth thinks of a busy town.', '!Step 2: She says many people means few patients.', 'Step 3: She writes too little work.'], 'Many people mean many patients, so hospitals are under pressure.', 'PD_SERVICES'),
    S('Stephen says unemployment falls when a town gets more crowded. Which step has the mistake?', ['Step 1: Stephen sees many people moving to town.', '!Step 2: He says jobs grow as fast as people.', 'Step 3: He writes unemployment falls.'], 'Jobs do not grow as fast as people, so unemployment can rise.', 'PD_SERVICES'),
  ], { h: ['Which step says crowding makes things easier?', 'Crowding puts pressure on land and services.'], s1: 'Check each step against what crowding does.' })),

  // ---------------------------------------------------------------- CS_AGE
  fam('cs.ag.which', `${CS}CS_AGE`, 'direct', 1, choose([
    Q('What makes a group of young people an age-set?', 'They were initiated together', w('CS_SET_GROUP', 'They were born in the same month', 'They are in the same class', 'They live in the same village'), 'An age-set is formed by those initiated together, and it stays together for life.'),
    Q('What is an age-group?', 'People of about the same age with the same roles', w('CS_SET_GROUP', 'People who were initiated all together', 'People who belong to one single clan', 'People who share one single home'), 'An age-group is people at the same stage of life, such as youth or elders.'),
    Q('What was a main duty of the warrior age-set?', 'Defending the community and its cattle', w('CS_WARRIOR', 'Looking after the sick at home', 'Teaching small children their letters', 'Keeping the shops of the village'), 'Warriors guarded the community, the herds and the land.'),
    Q('Who usually made the decisions for the community in the age system?', 'The elders', w('CS_WARRIOR', 'The youngest children', 'The warriors alone', 'Visitors from other lands'), 'Elders were respected for wisdom and led decisions.'),
    Q('Which is a duty of an age-set apart from defence?', 'Building and communal work', w('CS_WARRIOR', 'Selling goods in markets abroad', 'Running a bank in the village', 'Printing the village newspaper'), 'Age-sets also did building, herding and other work for the community.'),
  ], { h: ['Think of how people in the group were joined together.', 'Age-set: initiated together. Age-group: same life stage.'], s1: 'Recall what makes an age-set and what it did.' })),
  fam('cs.ag.story', `${CS}CS_AGE`, 'word', 2, choose([
    Q('A group of boys were initiated in the same season and became warriors together. What are they?', 'An age-set', w('CS_SET_GROUP', 'An age-group only', 'A clan', 'A school class'), 'Those initiated together form an age-set.'),
    Q('All the unmarried youths of a village do the community\'s heavy work. What are they?', 'An age-group', w('CS_SET_GROUP', 'An age-set', 'A clan', 'A family'), 'People of the same life stage form an age-group.'),
    Q('Why were age-sets important to a community?', 'They defended it and did communal work', w('CS_WARRIOR', 'They ran the shops and the markets', 'They taught only the girls of the village', 'They collected taxes for the king'), 'Age-sets supplied defence and labour.'),
    Q('Which person is in the same age-set as Kamau?', 'Someone initiated in the same year as Kamau', w('CS_SET_GROUP', 'Someone born in the same month as Kamau', 'Someone from the same school as Kamau', 'Someone with the same name as Kamau'), 'An age-set is formed by initiation together.'),
    Q('What happens to an age-set as its members grow old?', 'It stays a group for life and moves to the next stage', w('CS_SET_GROUP', 'It breaks up as soon as they marry', 'It turns into a clan of one family', 'It is forgotten by the elders'), 'An age-set stays together for life and moves up through stages.'),
  ], { h: ['Was the group joined by initiation or only by age?', 'Initiation joins an age-set.'], s1: 'Decide whether initiation joined them.' })),

  // ---------------------------------------------------------------- CS_CLAN
  fam('cs.cl.which', `${CS}CS_CLAN`, 'direct', 1, choose([
    Q('What is a clan?', 'Many families who trace descent from one ancestor', w('CS_CLAN_FAMILY', 'One family living in one home', 'All people of one village', 'A group of friends at school'), 'A clan is many families from a common ancestor.'),
    Q('Who could a person marry in a clan system?', 'Someone from a different clan', w('CS_MARRY_CLAN', 'Someone from the same clan', 'Only a cousin', 'Only a neighbour'), 'Clan members are like family, so people marry outside the clan.'),
    Q('Which is a function of a clan?', 'Settling disputes through the elders', w('CS_CLAN_FAMILY', 'Collecting taxes for the state', 'Running a school bus', 'Printing money'), 'Clan elders settled disputes and kept order.'),
    Q('Which job of a clan concerned land held in common?', 'Looking after clan land', w('CS_CLAN_FAMILY', 'Building the national road', 'Running a shop', 'Flying planes'), 'Clans looked after land held in common.'),
    Q('Which function of a clan helps a family at a funeral?', 'Helping members in need, such as at a funeral', w('CS_CLAN_FAMILY', 'Throwing out poor members', 'Charging members a fee', 'Closing the village'), 'Clan members help each other in need.'),
  ], { h: ['Think of what the clan did for its people.', 'Marriage rules, land, disputes and help in need.'], s1: 'Recall what a clan is and does.' })),
  fam('cs.cl.story', `${CS}CS_CLAN`, 'word', 2, choose([
    Q('Wanjiku\'s clan elders meet to settle a quarrel between two neighbours. Which function of a clan is this?', 'Settling disputes', w('CS_CLAN_FAMILY', 'Regulating marriage', 'Looking after land', 'Educating the young'), 'Elders settled disputes among clan members.'),
    Q('Odera wants to marry. The elders say he must choose a wife from another clan. Which function is this?', 'Guiding marriage', w('CS_MARRY_CLAN', 'Settling a dispute', 'Defending the land', 'Collecting taxes'), 'Clans guided marriage so members married outside the clan.'),
    Q('When Mama Nyokabi died, her clan cooked for the mourners and shared the cost. Which function is this?', 'Helping members in need', w('CS_CLAN_FAMILY', 'Guiding marriage', 'Settling disputes', 'Choosing a king'), 'Clan members supported each other at funerals.'),
    Q('Why is one family not a clan?', 'A clan has many families from a common ancestor', w('CS_CLAN_FAMILY', 'A family has no ancestor', 'A clan has only two people', 'A clan is a school'), 'A clan is far bigger than one family.'),
    Q('A clan story tells how the first ancestor settled the land. Which function does the story serve?', 'Passing on history and customs', w('CS_CLAN_FAMILY', 'Guiding marriage', 'Collecting fines', 'Defending cattle'), 'Clan stories pass on history and customs.'),
  ], { h: ['Which job of the clan does the story show?', 'Marriage, disputes, land and help.'], s1: 'Match the story to a clan function.' })),
  fam('cs.cl.spot', `${CS}CS_CLAN`, 'spot', 3, spot([
    S('Titus says clan members should marry within their own clan. Which step has the mistake?', ['Step 1: Titus knows clan members are close.', '!Step 2: He says being close means they should marry.', 'Step 3: He writes marry within the clan.'], 'Clan members are like brothers and sisters, so they marry outside the clan.', 'CS_MARRY_CLAN'),
    S('Esther says a clan is one family. Which step has the mistake?', ['Step 1: Esther thinks of her own family.', '!Step 2: She says a clan is the same size.', 'Step 3: She writes one family.'], 'A clan is many families with a common ancestor.', 'CS_CLAN_FAMILY'),
    S('Duncan says a clan has no part in settling quarrels. Which step has the mistake?', ['Step 1: Duncan sees a modern court.', '!Step 2: He says only courts settle quarrels.', 'Step 3: He writes the clan has no part.'], 'Clan elders settled disputes in traditional society.', 'CS_CLAN_FAMILY'),
    S('Gladys says clans were made of people who just lived close by. Which step has the mistake?', ['Step 1: Gladys thinks of neighbours.', '!Step 2: She says neighbours form a clan.', 'Step 3: She writes lived close by.'], 'A clan is formed by descent from one ancestor, not by living close by.', 'CS_CLAN_FAMILY'),
    S('Moses says a man can marry a woman from his own clan. Which step has the mistake?', ['Step 1: Moses meets a woman he likes.', '!Step 2: He says clan does not matter for marriage.', 'Step 3: He writes he can marry her.'], 'Many clan systems forbid marriage within the clan.', 'CS_MARRY_CLAN'),
  ], { h: ['Which step gives a wrong idea of clan or marriage?', 'A clan has one ancestor and members marry outside.'], s1: 'Check each step against what a clan is.' })),

  // ---------------------------------------------------------------- CS_PRESERVE
  fam('cs.pr.which', `${CS}CS_PRESERVE`, 'direct', 1, choose([
    Q('Which custom should be preserved?', 'Respect for elders', w('CS_ALL_BAD', 'None, they are all old-fashioned', 'Only those about money', 'Only those from towns'), 'Respect for elders is a value worth keeping.'),
    Q('Which custom should NOT be preserved?', 'Marrying girls off early and keeping them from school', w('CS_ALL_GOOD', 'Respect for elders', 'Helping neighbours', 'Telling folktales'), 'Practices that harm people, such as early marriage, should be left behind.'),
    Q('Which is a good aspect of African traditional culture?', 'Community work and helping neighbours', w('CS_ALL_BAD', 'Making girls leave school early', 'Fighting over cattle', 'Staying away from others'), 'Community work and sharing keep society strong.'),
    Q('Which is a good aspect of African traditional culture?', 'Folktales, songs and proverbs', w('CS_ALL_BAD', 'Fear of every stranger', 'Refusing medicine', 'Shouting at children'), 'Stories, songs and proverbs teach values.'),
    Q('Which should be preserved?', 'Hospitality to visitors', w('CS_ALL_BAD', 'Harm to children', 'Hatred of strangers', 'Refusing to share'), 'Welcoming visitors is a good tradition.'),
  ], { h: ['Does the custom help people or harm them?', 'Keep what is good. Leave what harms.'], s1: 'Decide whether the custom helps or harms.' })),
  fam('cs.pr.story', `${CS}CS_PRESERVE`, 'word', 2, choose([
    Q('Akinyi\'s grandmother tells proverbs that teach honesty. Should this be kept?', 'Yes, it teaches good values', w('CS_ALL_BAD', 'No, it is old-fashioned', 'No, proverbs have no use', 'No, only books teach'), 'Proverbs teach values and should be kept.'),
    Q('A village elder says a girl should leave school to be married. What should the learners say?', 'Girls have a right to learn', w('CS_ALL_GOOD', 'Girls must obey whatever the elders say', 'Every custom of the past should be kept', 'Elders are always right in every matter'), 'Practices that harm children are not to be kept.'),
    Q('Which is the best reason to preserve traditional dances and songs?', 'They hold our history and bring people together', w('CS_ALL_BAD', 'They are loud and well liked', 'They are old and so must stay', 'They cost nothing to the village'), 'Songs and dances keep history and unity.'),
    Q('Why should families keep eating millet porridge and local vegetables?', 'They are healthy and part of our heritage', w('CS_ALL_BAD', 'They are cheap and very old', 'They are free for everyone to take', 'They are the only food that exists'), 'Traditional foods are healthy and part of our heritage.'),
    Q('Which custom helps keep peace in a village?', 'Elders settling a quarrel fairly', w('CS_ALL_GOOD', 'Revenge taken by the strongest man', 'Fighting over land and boundaries', 'Silence about the wrongs of others'), 'Fair settlement by elders helps keep peace.'),
  ], { h: ['Does the custom teach a good value or harm someone?', 'Choose the one that helps people.'], s1: 'Weigh help against harm.' })),
  fam('cs.pr.spot', `${CS}CS_PRESERVE`, 'spot', 3, spot([
    S('Gilbert says every traditional custom should be kept. Which step has the mistake?', ['Step 1: Gilbert values tradition.', '!Step 2: He says all customs are good.', 'Step 3: He writes keep them all.'], 'Customs that harm people, such as early marriage, should not be kept.', 'CS_ALL_GOOD'),
    S('Hellen says all traditional culture is old-fashioned and should be dropped. Which step has the mistake?', ['Step 1: Hellen sees new things in town.', '!Step 2: She says old means bad.', 'Step 3: She writes drop it all.'], 'Good customs such as respect for elders and community work should be kept.', 'CS_ALL_BAD'),
    S('Abdi says early marriage of girls is part of culture so it should be preserved. Which step has the mistake?', ['Step 1: Abdi knows early marriage is a custom.', '!Step 2: He says all customs help people.', 'Step 3: He writes preserve it.'], 'Early marriage harms girls and takes away their right to learn.', 'CS_ALL_GOOD'),
    S('Beth says folktales should be dropped because they are old. Which step has the mistake?', ['Step 1: Beth likes new films.', '!Step 2: She says old stories teach nothing.', 'Step 3: She writes drop folktales.'], 'Folktales teach values and keep history.', 'CS_ALL_BAD'),
    S('Collins says respect for elders should end because times have changed. Which step has the mistake?', ['Step 1: Collins sees modern life.', '!Step 2: He says new times mean no need for respect.', 'Step 3: He writes end it.'], 'Respect for elders is a good value in any time.', 'CS_ALL_BAD'),
  ], { h: ['Which step keeps a harmful custom or drops a good one?', 'Judge each custom by whether it helps or harms.'], s1: 'Check each step for help or harm.' })),

  // ---------------------------------------------------------------- SC_WAYS
  fam('sc.wa.which', `${SC}SC_WAYS`, 'direct', 1, choose([
    Q('Which is an example of the school working with the community?', 'Parents help to build a classroom', w('SC_SCHOOL_ALONE', 'Teachers mark books alone', 'A teacher plans a test', 'The head teacher reads a report alone'), 'Collaboration means the school and community work together.'),
    Q('Which is a way the community helps the school?', 'Giving land, labour or funds', w('SC_ONE_WAY', 'Doing nothing for the school', 'Locking the school gate', 'Blocking the school road'), 'Communities help with land, labour and funds.'),
    Q('Which is a way the school helps the community?', 'Letting people use its hall and field', w('SC_ONE_WAY', 'Selling the school field for cash', 'Closing the gate to everyone', 'Giving nothing back to anyone'), 'Schools lend halls and fields for community events.'),
    Q('Which meeting brings parents and teachers together?', 'The Parents and Teachers Association meeting', w('SC_SCHOOL_ALONE', 'A sports committee of teachers only', 'A staff meeting of the teachers', 'A meeting of the school prefects'), 'Parents and teachers meet to plan for the school.'),
    Q('Which is an example of working together?', 'Learners and villagers plant trees at the school', w('SC_SCHOOL_ALONE', 'The head teacher signs the forms', 'A teacher writes a lesson plan', 'Learners sweep their own classroom'), 'Tree planting with villagers involves the community.'),
  ], { h: ['Does the community take part?', 'Collaboration needs both the school and the community.'], s1: 'Check whether the community takes part.' })),
  fam('sc.wa.story', `${SC}SC_WAYS`, 'word', 2, choose([
    Q('Mr Barasa, a nurse, visits the school to give a talk on health. Which way is this?', 'A visiting speaker from the community', w('SC_SCHOOL_ALONE', 'A teachers-only meeting', 'A school trip', 'A school assembly'), 'Community members can visit the school as resource persons.'),
    Q('A school field is used for a polling station during elections. What does this show?', 'The school helps the community', w('SC_ONE_WAY', 'The community harms the school', 'The school is closed', 'Nobody uses it'), 'Schools serve the community, for example as polling stations.'),
    Q('A chief and parents donate a plot for a new school kitchen. Which way is this?', 'The community gives land to the school', w('SC_ONE_WAY', 'The school gives land away', 'The chief teaches', 'The parents run the school alone'), 'Land donation is a way the community supports the school.'),
    Q('Learners clean the village market on Saturday. Which way is this?', 'The school serves the community', w('SC_ONE_WAY', 'The community serves the school', 'It is a school test', 'It is a holiday'), 'Learners can serve the community through clean-ups.'),
    Q('Which of these is NOT a way the school and community work together?', 'A teacher marks tests at home', w('SC_SCHOOL_ALONE', 'Parents attend an open day', 'A clinic uses the school hall', 'Farmers donate food for a school feeding programme'), 'Marking tests alone does not involve the community.'),
  ], { h: ['Who took part, the school, the community or both?', 'Look for two parties working together.'], s1: 'Decide who took part.' })),

  // ---------------------------------------------------------------- SC_BENEFITS
  fam('sc.be.which', `${SC}SC_BENEFITS`, 'direct', 1, choose([
    Q('Who gains when the school and community collaborate?', 'Both the school and the community', w('SC_BENEFIT_ONLY_SCHOOL', 'Only the teachers of the school', 'Only the local shops and traders', 'Only the school and nobody else'), 'Both gain from working together.'),
    Q('Which is a benefit to the school?', 'It gets extra resources, security and support', w('SC_BENEFIT_ONLY_SCHOOL', 'It is closed down by the community', 'It has fewer learners to teach', 'It becomes larger than the whole town'), 'Community support brings resources and security.'),
    Q('Which is a benefit to the community?', 'Educated learners and shared facilities', w('SC_BENEFIT_ONLY_SCHOOL', 'No need for health services at all', 'Loss of the land of the school', 'Fewer jobs for the adults of the area'), 'The community gains educated children and shared halls and fields.'),
    Q('Which strategy keeps collaboration going?', 'Holding open days and regular meetings', w('SC_STRATEGY_STOP', 'Hiding the school plans from parents', 'Locking the gate against visitors', 'Never inviting parents to the school'), 'Open days and meetings keep communication alive.'),
    Q('Which strategy keeps collaboration going?', 'Thanking and recognising helpers', w('SC_STRATEGY_STOP', 'Ignoring helpers', 'Blaming helpers', 'Forgetting helpers'), 'Recognition keeps people willing to help.'),
  ], { h: ['Think about who benefits and what keeps people involved.', 'Both sides gain. Talking and thanking keep it going.'], s1: 'Think about both sides.' })),
  fam('sc.be.story', `${SC}SC_BENEFITS`, 'word', 2, choose([
    Q('Villagers help clear the school field, and the school lets them use it for a football match. Who benefits?', 'The school and the villagers', w('SC_BENEFIT_ONLY_SCHOOL', 'Only the villagers who cleared it', 'Nobody gains anything at all', 'Only the school and its learners'), 'Both sides gain.'),
    Q('Parents rarely visit the school and the school wants more support. Which strategy should it use?', 'Hold an open day and share progress reports', w('SC_STRATEGY_STOP', 'Stop sending any reports to homes', 'Close the gate to every visitor', 'Move the school far from the village'), 'Open days and reports bring parents in.'),
    Q('Why should a school keep telling parents about its plans?', 'So they stay involved and help', w('SC_STRATEGY_STOP', 'So that they argue with teachers', 'So that they stay away from school', 'So that they forget about the school'), 'Information keeps parents involved.'),
    Q('A school has no fence and goats enter. The community builds a fence. What benefit does the school gain?', 'A safe, protected compound', w('SC_BENEFIT_ONLY_SCHOOL', 'More goats on the school field', 'A much smaller school compound', 'Less land for the learners to use'), 'A fence protects the school.'),
    Q('Which is a strategy for sustaining collaboration?', 'Joint projects such as tree planting', w('SC_STRATEGY_STOP', 'Working alone on every project', 'Never asking for help', 'Hiding the budget'), 'Joint projects keep both sides working together.'),
  ], { h: ['Who gains and what keeps the partners working together?', 'Talk, share and thank.'], s1: 'Think about who gains and how to keep it going.' }), 'c'),
];
