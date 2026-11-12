// ============================================================================
// GRADE 6 SOCIAL STUDIES, STRAND 3A: RESOURCES AND ECONOMIC ACTIVITIES (10 skills).
// Beef farming, fishing and wildlife and tourism in Eastern Africa: factors, places, contribution, challenges and solutions.
// Written offline from the KICD 2024 design through the curriculum map (curriculum/social_studies/g6.json). Map questions are in
// words or a small table. Every wrong answer names the library misconception it reveals. The options of each question are written
// to be about the same length so the right answer is never the longest. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w } from './socialstudies_g6_lib.js';

const BF = 'RESOUR.BEEF_FARMING.', FI = 'RESOUR.FISHING_IN_EASTERN_AFRIC.', WT = 'RESOUR.WILDLIFE_AND_TOURISM_IN_.';
const T = (head, rows) => ({ t: { head, rows } });

export const FAMILIES = [
  // ---------------------------------------------------------------- BF_FACTORS
  fam('bf.fa.which', `${BF}BF_FACTORS`, 'direct', 1, choose([
    Q('Which area suits beef ranching best?', 'Large grassland with enough water', w('BF_RAIN_CROP', 'A small crop farm in a wet highland', 'A thick rain forest with no grass', 'A town with no open land'), 'Beef cattle need large grassland and water.'),
    Q('Why do beef farmers need vets?', 'To control diseases that kill cattle', w('BF_DISEASE_NO', 'To find new grazing for animals', 'To build fences round the farm', 'To sell meat in the market'), 'Diseases such as foot-and-mouth can kill cattle and stop sales.'),
    Q('Which factor helps a ranch earn money from beef?', 'A nearby market and good roads', w('BF_DISEASE_NO', 'A dry area with no water', 'Cattle that are always sick', 'Land that is too small for any herd'), 'Cattle must be moved to markets and meat factories.'),
    Q('Which cattle breed is a beef breed that does well in dry areas of Kenya?', 'The Boran', w('BF_RAIN_CROP', 'The Friesian', 'The Jersey', 'The Ayrshire'), 'The Boran is a beef breed suited to dry areas. The others are dairy breeds.'),
    Q('Which problem makes beef farming harder in a swampy area?', 'Tsetse flies that spread cattle disease', w('BF_DISEASE_NO', 'Too much good grass to eat', 'Too many buyers of meat', 'Too many cold rooms'), 'Tsetse flies carry the disease nagana, which kills cattle.'),
  ], { h: ['Think of what cattle need to eat, drink and stay healthy.', 'Grass, water, health care and a market.'], s1: 'Think about what beef cattle need.' })),
  fam('bf.fa.story', `${BF}BF_FACTORS`, 'word', 2, choose([
    Q('A ranch in Laikipia has wide grassland and boreholes. Why is it good for beef farming?', 'Cattle have grass and water all year', w('BF_RAIN_CROP', 'Crops can grow in the heavy rain', 'The land is too small for the herd', 'The cattle can swim in lakes'), 'Grass and water keep beef cattle healthy.'),
    Q('Two farms have the same land. One has a dip and a vet, and the other has none. Which farm will lose fewer cattle to disease?', 'The farm with a dip and a vet', w('BF_DISEASE_NO', 'The farm with no dip', 'Both lose the same number', 'Neither will lose any'), 'Dips kill ticks and vets treat disease, so fewer animals die.'),
    Q('Rono has 500 acres of dry grassland. Which activity suits it best?', 'Ranching beef cattle', w('BF_RAIN_CROP', 'Growing wet rice crops', 'Growing tea for export', 'Growing flowers under cover'), 'Dry grassland suits ranching, not crops that need heavy rain.'),
    Q('Why does a beef farmer need a road to the market?', 'To carry animals and meat to the buyers', w('BF_DISEASE_NO', 'To keep ticks out of the dip', 'To dig new water pans', 'To grow grass beside the road'), 'Without roads, animals and meat cannot reach buyers.'),
    Q('Which of these makes a good beef farming area?', 'Wide plains with grass and few diseases', w('BF_RAIN_CROP', 'Steep slopes with small farms', 'A dense forest with tall trees', 'A city with no open land'), 'Wide, open grassland with few diseases suits beef cattle.'),
  ], { h: ['Ask what the cattle need to live and sell.', 'Grass, water, health care and market access.'], s1: 'Match the farm to what cattle need.' })),

  // ---------------------------------------------------------------- BF_PLACES
  fam('bf.pl.which', `${BF}BF_PLACES`, 'table', 1, choose([
    Q('Look at the table. Which area is a beef ranching area?', 'Laikipia', w('BF_BEEF_COAST', 'Kericho tea area', 'Kakamega forest', 'Nairobi city centre'), 'Laikipia has wide grassland and many large ranches.',
      T(['Area', 'Main land use'], [['Laikipia', 'Large ranches'], ['Kericho', 'Tea estates'], ['Kakamega', 'Forest and small farms'], ['Nairobi centre', 'Offices and shops']])),
    Q('Which area in Kenya is known for beef ranching?', 'Kajiado', w('BF_BEEF_COAST', 'Kisii highlands', 'The shore of Lake Victoria', 'The Mombasa coast strip'), 'Kajiado has dry grassland where beef cattle are ranched.'),
    Q('Which area of Uganda is called the cattle corridor and is known for beef cattle?', 'The south-west, around Ankole', w('BF_BEEF_COAST', 'The Rwenzori peaks', 'The shores of Lake Victoria', 'The forests of the west'), 'South-western Uganda has the Ankole cattle area.'),
    Q('Which country exports live animals such as camels and goats from its dry lands?', 'Somalia', w('BF_SOMALIA', 'Rwanda', 'Burundi', 'Djibouti'), 'Somalia has many herds and exports live animals through its ports.'),
    Q('Which region of Ethiopia is known for its cattle herds?', 'The Borana lowlands in the south', w('BF_BEEF_COAST', 'The Danakil desert', 'The Lalibela hills', 'The Addis Ababa city streets'), 'The Borana lowlands are famous for cattle herding.'),
  ], { h: ['Think of areas with wide grass and few crops.', 'Dry grasslands, not wet highlands.'], s1: 'Find the area with wide grassland.' })),
  fam('bf.pl.why', `${BF}BF_PLACES`, 'word', 2, choose([
    Q('Why is Kajiado a good place for beef ranching?', 'It has wide grassland and many cattle', w('BF_BEEF_COAST', 'It has heavy rain all year', 'It is covered with thick forest', 'It has only small farms'), 'Dry grasslands suit cattle.'),
    Q('Which of these places is a beef area?', 'Narok', w('BF_BEEF_COAST', 'Kericho', 'Kisumu city', 'Lamu town'), 'Narok has large grassland used for cattle and wildlife.'),
    Q('Somalia is mostly dry, but it earns money from animals. How?', 'It exports live animals from its herds', w('BF_SOMALIA', 'It exports tea and flowers', 'It exports coffee and cotton', 'It exports minerals only'), 'Livestock is a main export of Somalia.'),
    Q('Which part of Tanzania has many cattle herds?', 'The Arusha and Shinyanga areas', w('BF_BEEF_COAST', 'The Zanzibar beaches', 'The Kilimanjaro snow cap', 'The Dar es Salaam harbour'), 'Arusha and Shinyanga are important cattle areas.'),
    Q('Where would a beef farmer in Kenya expect to find the largest ranches?', 'On dry grasslands such as Laikipia', w('BF_BEEF_COAST', 'In the wet tea highlands', 'On small plots near towns', 'On the slopes of Mount Kenya'), 'Large ranches need large areas of dry grassland.'),
  ], { h: ['Which places have wide, dry grassland?', 'Beef cattle are ranched on grassland, not in tea or forest areas.'], s1: 'Link the place to grassland.' })),

  // ---------------------------------------------------------------- BF_ECONOMY
  fam('bf.ec.which', `${BF}BF_ECONOMY`, 'direct', 1, choose([
    Q('What is made from the hides and skins of cattle?', 'Leather goods such as shoes and bags', w('BF_MEAT_ONLY', 'Sugar for sale in the market', 'Cement used for making roads', 'Cooking oil and soap only'), 'Hides and skins are made into leather goods.'),
    Q('Who earns a living from the beef industry?', 'Herders, vets, butchers and factory workers', w('BF_NO_JOBS', 'Only the cooks who work at home', 'Only the owners of the big land', 'Nobody, because it is only for food'), 'Many people earn a living from beef, from the ranch to the shop.'),
    Q('What does a country earn from selling beef and live animals abroad?', 'Foreign exchange', w('BF_MEAT_ONLY', 'Rainfall for crops', 'Timber for houses', 'Fish for the market'), 'Exports bring in foreign money, called foreign exchange.'),
    Q('Which is a contribution of beef farming to a country?', 'Meat for food and income for farmers', w('BF_MEAT_ONLY', 'Free land for all of the people', 'Cheaper cars for the busy towns', 'More rain for the open plains'), 'Beef gives food and income.'),
    Q('Which company in Kenya processes meat at Athi River?', 'The Kenya Meat Commission', w('BF_NO_JOBS', 'The Kenya Power Company', 'The Kenya Railways', 'The Kenya Seed Company'), 'The Kenya Meat Commission processes beef at Athi River.'),
  ], { h: ['Think of every product and person in the beef chain.', 'Meat, leather, jobs and exports.'], s1: 'Think about what beef farming gives.' })),
  fam('bf.ec.story', `${BF}BF_ECONOMY`, 'word', 2, choose([
    Q('A tannery buys hides from ranchers and makes shoes. Which contribution of beef farming is this?', 'Raw materials for industry', w('BF_MEAT_ONLY', 'Meat for food and nothing else', 'Fuel for the lorries on roads', 'Manure for farms nearby'), 'Hides are raw materials for the leather industry.'),
    Q('A rancher hires 12 herders and a driver. What does this show?', 'Beef farming gives jobs', w('BF_NO_JOBS', 'Beef farming gives no jobs', 'Beef farming is only for food', 'Beef farming needs no workers'), 'Ranches employ many workers.'),
    Q('Why does the government like to see beef exports grow?', 'They bring in foreign money for the country', w('BF_MEAT_ONLY', 'They lower the price of tea abroad', 'They make all the cattle disappear', 'They bring snow to the wide plains'), 'Exports earn foreign exchange.'),
    Q('Cow dung from the ranch is spread on the farms nearby. Which contribution is this?', 'Manure that makes the soil richer', w('BF_MEAT_ONLY', 'Hides for use at the leather works', 'Milk for sale in the town', 'Meat for sale at the market'), 'Manure improves the soil.'),
    Q('Why do butchers, drivers and shop owners all gain from beef farming?', 'They earn money handling meat and animals', w('BF_NO_JOBS', 'They do not do any work at all', 'They own all of the cattle', 'They are given free meat by ranchers'), 'Many jobs depend on the beef chain.'),
  ], { h: ['Which part of the beef chain does the story show?', 'Meat, hides, jobs, manure and exports.'], s1: 'Match the story to a contribution.' })),

  // ---------------------------------------------------------------- BF_PROBLEMS
  fam('bf.pr.pair', `${BF}BF_PROBLEMS`, 'direct', 1, choose([
    Q('What helps cattle during a long drought?', 'Water pans, boreholes and hay', w('BF_SOLUTION_SWAP', 'Moving the market closer to farms', 'Sending the vets away for good', 'Dipping them often in the dip'), 'Water and fodder keep cattle alive in a drought.'),
    Q('What helps to control ticks and tick-borne disease?', 'Regular dipping and spraying', w('BF_SOLUTION_SWAP', 'Digging more water pans for cattle', 'Cutting more hay for the dry season', 'Fencing the water to keep cattle out'), 'Dipping kills ticks.'),
    Q('How can overgrazing be reduced?', 'Rotate the grazing and keep fewer cattle', w('BF_GRAZE_MORE', 'Keep more and more cattle on it', 'Burn the grass on it every year', 'Cut down all of the trees near it'), 'Resting the grass and keeping fewer animals protects the land.'),
    Q('What helps to stop cattle rustling?', 'Better security and community patrols', w('BF_SOLUTION_SWAP', 'More dips on all of the cattle farms', 'More water pans on all of the farms', 'Bigger herds for every one of the families'), 'Security and patrols protect herds from thieves.'),
    Q('What helps farmers who cannot reach the meat market?', 'Better roads and marketing cooperatives', w('BF_SOLUTION_SWAP', 'Bigger grazing areas for all cattle', 'More dips on every large ranch', 'Fewer vets to call in the area'), 'Roads and cooperatives help sell animals at better prices.'),
  ], { h: ['Match each problem to the action that solves it.', 'Water for drought, dips for ticks, patrols for thieves.'], s1: 'Match problem and solution.' })),
  fam('bf.pr.problem', `${BF}BF_PROBLEMS`, 'word', 2, choose([
    Q('Cattle in a village are dying from foot-and-mouth disease. What should the farmers do?', 'Vaccinate the animals and call the vet', w('BF_SOLUTION_SWAP', 'Build a new road to the town', 'Dig more boreholes for the animals', 'Plant more grass for the animals'), 'Vaccination and vets control disease.'),
    Q('The grass on a ranch is eaten to the roots. What is the problem?', 'Overgrazing', w('BF_GRAZE_MORE', 'Cattle rustling', 'Tick disease', 'Poor roads'), 'Too many cattle on too little grass cause overgrazing.'),
    Q('A herder sells his cattle cheaply because he has no way to reach the market. Which solution would help?', 'Build roads and form cooperatives', w('BF_SOLUTION_SWAP', 'Dip the cattle more often on farms', 'Dig more water pans for the herds', 'Plant more grass on the grazing land'), 'Roads and cooperatives give better prices.'),
    Q('Why is keeping more and more cattle on the same land not a good solution to hunger?', 'The grass is used up and the land is spoilt', w('BF_GRAZE_MORE', 'It makes cattle healthier and fatter', 'Cattle grow thinner on more grass', 'It brings more rain to the land'), 'Overgrazing spoils the land.'),
    Q('Raiders took 200 cattle from a village. Which action will help stop this?', 'Strong security and peace talks', w('BF_SOLUTION_SWAP', 'More vets to treat the cattle', 'More dips to wash the cattle', 'More hay to feed the cattle'), 'Security and peace talks reduce raids.'),
  ], { h: ['What problem does the story show?', 'Match disease, drought, overgrazing and raids to their answers.'], s1: 'Match the problem with its answer.' })),
  fam('bf.pr.spot', `${BF}BF_PROBLEMS`, 'spot', 3, spot([
    S('Chelimo says dipping cattle helps them during a drought. Which step has the mistake?', ['Step 1: Chelimo sees a drought.', '!Step 2: He says a dip gives cattle water and food.', 'Step 3: He writes dipping.'], 'Water pans, boreholes and hay help in a drought. Dips control ticks.', 'BF_SOLUTION_SWAP'),
    S('Dorothy says more cattle on the land solve overgrazing. Which step has the mistake?', ['Step 1: Dorothy sees bare ground.', '!Step 2: She says more animals will make the grass grow.', 'Step 3: She writes more cattle.'], 'Overgrazing is reduced by rotating grazing and keeping fewer cattle.', 'BF_GRAZE_MORE'),
    S('Sam says boreholes stop cattle diseases. Which step has the mistake?', ['Step 1: Sam knows cattle get diseases.', '!Step 2: He says water prevents every disease.', 'Step 3: He writes boreholes.'], 'Vaccines and dips fight disease. Boreholes give water.', 'BF_SOLUTION_SWAP'),
    S('Linet says burning the grass will cure overgrazing. Which step has the mistake?', ['Step 1: Linet sees dry grass.', '!Step 2: She says fire will make better grass at once.', 'Step 3: She writes burn it.'], 'Resting the land and keeping fewer cattle cure overgrazing.', 'BF_GRAZE_MORE'),
    S('Peter says better roads will stop cattle rustling. Which step has the mistake?', ['Step 1: Peter knows rustling is a problem.', '!Step 2: He says roads will catch the thieves.', 'Step 3: He writes roads.'], 'Security and peace talks help stop rustling. Roads help with markets.', 'BF_SOLUTION_SWAP'),
  ], { h: ['Which step pairs a problem with the wrong solution?', 'Match problem to its own cure.'], s1: 'Check each pair of problem and solution.' })),

  // ---------------------------------------------------------------- FI_GROUNDS
  fam('fi.gr.which', `${FI}FI_GROUNDS`, 'direct', 1, choose([
    Q('Which is a marine fishing ground?', 'The Indian Ocean coast', w('FI_LAKE_SEA', 'Lake Victoria', 'Lake Turkana', 'Lake Albert'), 'Marine fishing happens in the sea, such as the Indian Ocean.'),
    Q('Which is an inland fishing ground?', 'Lake Victoria', w('FI_LAKE_SEA', 'The Indian Ocean', 'The Red Sea', 'The Atlantic Ocean'), 'Inland means on land, in lakes and rivers.'),
    Q('Which fish comes from Lake Victoria?', 'Nile perch', w('FI_FISH_PLACE', 'Tuna', 'Prawns', 'Lobster'), 'Nile perch and tilapia live in the lakes.'),
    Q('Which fish is caught in the Indian Ocean?', 'Tuna', w('FI_FISH_PLACE', 'Nile perch', 'Tilapia', 'Omena'), 'Tuna are sea fish caught in the Indian Ocean.'),
    Q('Which lake is the largest inland fishing ground in Eastern Africa?', 'Lake Victoria', w('FI_LAKE_SEA', 'Lake Naivasha', 'Lake Baringo', 'Lake Kyoga'), 'Lake Victoria is the largest lake in Africa.'),
  ], { h: ['Is the water salty (sea) or fresh (lake)?', 'Marine means from the sea. Inland means in lakes and rivers.'], s1: 'Decide whether the water is the sea or a lake.' })),
  fam('fi.gr.table', `${FI}FI_GROUNDS`, 'table', 2, choose([
    Q('Look at the table. Which country has the longest coast on the Indian Ocean among these?', 'Somalia', w('FI_LAKE_SEA', 'Uganda', 'Rwanda', 'Burundi'), 'Somalia has the longest coast in Africa. The other three have no coast.',
      T(['Country', 'Sea coast'], [['Somalia', 'Very long'], ['Uganda', 'None'], ['Rwanda', 'None'], ['Burundi', 'None']])),
    Q('Which of these countries can fish in the Indian Ocean?', 'Tanzania', w('FI_LAKE_SEA', 'Uganda', 'Rwanda', 'South Sudan'), 'Tanzania has a long coast on the Indian Ocean.'),
    Q('Which two lakes are shared by Uganda?', 'Lake Victoria and Lake Albert', w('FI_LAKE_SEA', 'Lake Turkana and Lake Naivasha', 'Lake Tanganyika and Lake Magadi', 'Lake Baringo and Lake Nakuru'), 'Uganda shares Lake Victoria and Lake Albert with its neighbours.'),
    Q('Which fish comes from Lake Turkana?', 'Nile perch and tilapia', w('FI_FISH_PLACE', 'Tuna and prawns', 'Sardines from the sea', 'Lobster from the reef'), 'Nile perch and tilapia live in Lake Turkana.'),
    Q('Which water body does Djibouti use for marine fishing?', 'The Red Sea and Gulf of Aden', w('FI_LAKE_SEA', 'Lake Victoria', 'Lake Turkana', 'Lake Tanganyika'), 'Djibouti lies on the Gulf of Aden and the Red Sea.'),
  ], { h: ['Which water body is the sea and which is a lake?', 'Landlocked countries fish only in lakes and rivers.'], s1: 'Match the country to its water.' })),

  // ---------------------------------------------------------------- FI_METHODS
  fam('fi.me.which', `${FI}FI_METHODS`, 'direct', 1, choose([
    Q('What is trawling?', 'Dragging a large net behind a boat', w('FI_TRAWL', 'Fishing with a hook and line', 'Catching fish in a basket trap', 'Spearing fish from a canoe'), 'A trawler drags a net along the sea bed.'),
    Q('Which is a modern method of fishing?', 'A trawler with a cold room', w('FI_TRAD_MODERN', 'A basket trap from a canoe', 'A spear from the shore', 'A hand line from a dhow'), 'Modern boats have engines and cold storage.'),
    Q('Which is a traditional method of fishing?', 'Using hooks and lines from a dhow', w('FI_TRAD_MODERN', 'A large trawler with an engine', 'A purse seine with a power block', 'A ship with a freezer'), 'Hooks and lines from small boats are traditional.'),
    Q('What is a gill net?', 'A net that traps fish by their gills', w('FI_TRAWL', 'A large net dragged on the sea bed', 'A cage trap on the shore', 'A line with many hooks'), 'Fish swim in and their gills catch in the mesh.'),
    Q('Why do large fishing ships have cold rooms?', 'To keep the catch fresh until it is sold', w('FI_TRAD_MODERN', 'To warm the fish before selling', 'To dry the nets in the sun', 'To keep the sailors cool'), 'Cold rooms stop fish spoiling.'),
  ], { h: ['Is the boat powered and fitted with cold rooms, or small and simple?', 'Trawl means to drag.'], s1: 'Think about the boat and the gear.' })),
  fam('fi.me.story', `${FI}FI_METHODS`, 'word', 2, choose([
    Q('Fishermen in a dugout canoe drop baskets near the reef. Which method is this?', 'Basket traps, a traditional method', w('FI_TRAD_MODERN', 'Trawling, a modern method', 'Purse seining, a modern method', 'Long lining, a modern method'), 'Basket traps from canoes are traditional.'),
    Q('A big ship drags a huge net along the sea bed. Which method is this?', 'Trawling', w('FI_TRAWL', 'Hand lining', 'Spearing', 'Basket trapping'), 'Dragging a net is trawling.'),
    Q('Which of these gives the biggest catch at one time?', 'A trawler with a large net', w('FI_TRAD_MODERN', 'A hook and line from the shore', 'A spear from a canoe', 'A basket trap by the reef'), 'Large nets and engines bring large catches.'),
    Q('A fisherman sits on a dhow with one hook and line. Which method is this?', 'Hand lining, a traditional method', w('FI_TRAD_MODERN', 'Trawling, a modern method', 'Purse seining, a modern method', 'Drift netting at sea'), 'A single hook and line is simple and traditional.'),
    Q('Which method uses a long line with many hooks set out at sea?', 'Long lining', w('FI_TRAWL', 'Trawling', 'Basket trapping', 'Spearing'), 'A long line carries many hooks along its length.'),
  ], { h: ['Does the story show simple gear or a big powered boat?', 'Trawling means dragging a net.'], s1: 'Match the story to a fishing method.' })),

  // ---------------------------------------------------------------- FI_PROBLEMS
  fam('fi.pr.pair', `${FI}FI_PROBLEMS`, 'direct', 1, choose([
    Q('What helps stop overfishing?', 'Fishing seasons and net-size rules', w('FI_OVER_OK', 'Catching all the fish you can', 'Using smaller and smaller nets', 'Fishing only at night'), 'Rules protect young fish so stocks can recover.'),
    Q('What helps fish keep fresh before sale?', 'Cold rooms and processing plants', w('FI_SOLUTION_MIX', 'Sea patrols from the navy base', 'Licences for all the fishing boats', 'Net-size rules for the lake fishermen'), 'Cold rooms stop fish spoiling.'),
    Q('What helps to stop piracy and illegal fishing by foreign ships?', 'Sea patrols and strong laws', w('FI_SOLUTION_MIX', 'Cold rooms on the shore', 'Larger nets for the boats', 'Better roads to town'), 'Patrols protect fishermen and the fish.'),
    Q('What helps with water hyacinth that blocks fishing on Lake Victoria?', 'Clearing and controlling the weed', w('FI_SOLUTION_MIX', 'Using much smaller nets on it', 'Building more cold rooms on shore', 'Closing the lake to all fishing'), 'Removing the weed opens the water to boats.'),
    Q('What helps local fishermen who have only small canoes?', 'Loans and training for better boats', w('FI_SOLUTION_MIX', 'Sea patrols by the coast guard only', 'Closing the harbour to small boats', 'Higher fish prices in the market only'), 'Loans and training help fishermen catch more safely.'),
  ], { h: ['Match each fishing problem to the action that solves it.', 'Rules for overfishing, cold rooms for spoilage, patrols for piracy.'], s1: 'Match problem and solution.' })),
  fam('fi.pr.story', `${FI}FI_PROBLEMS`, 'word', 2, choose([
    Q('Catches of fish in a lake fall every year because people use very fine nets. What is this problem?', 'Overfishing', w('FI_OVER_OK', 'Piracy', 'Pollution of the sea', 'Water hyacinth'), 'Taking too many fish, including young ones, is overfishing.'),
    Q('Fish are thrown away because they rot before reaching the market. Which solution fits?', 'Cold rooms and fast transport', w('FI_SOLUTION_MIX', 'Sea patrols along the coast', 'Net-size rules for the lake', 'Loans for new boat engines'), 'Cooling and quick transport keep fish fresh.'),
    Q('Foreign trawlers fish illegally in the waters of a coastal country. Which solution fits?', 'Sea patrols and the coast guard', w('FI_SOLUTION_MIX', 'More cold rooms along the shore', 'Smaller nets for all the boats', 'Higher fish prices at the market'), 'Patrols stop illegal fishing.'),
    Q('Why must a fishing season be set when fish are laying eggs?', 'To let the fish breed and keep stocks up', w('FI_OVER_OK', 'To catch more fish all at once', 'To make fish cheaper in the market', 'To drive the fish away from shore'), 'Closed seasons let fish breed.'),
    Q('Oil spills have harmed sea life near a port. Which solution fits?', 'Strict laws and quick clean-up of oil', w('FI_SOLUTION_MIX', 'Using smaller nets in the water', 'Building cold rooms near the port', 'Sending more fishing boats out'), 'Laws and clean-up protect the sea.'),
  ], { h: ['What problem does the story show?', 'Overfishing, spoilage, piracy and pollution have different solutions.'], s1: 'Match the problem with its solution.' }), 'd'),
  fam('fi.pr.spot', `${FI}FI_PROBLEMS`, 'spot', 3, spot([
    S('Daniel says catching as many fish as possible is always good. Which step has the mistake?', ['Step 1: Daniel sees a large catch.', '!Step 2: He says taking all the fish does no harm.', 'Step 3: He writes catch them all.'], 'Overfishing makes fish stocks fall. Rules and seasons protect them.', 'FI_OVER_OK'),
    S('Mwajuma says sea patrols keep fish fresh. Which step has the mistake?', ['Step 1: Mwajuma knows patrols help fishermen.', '!Step 2: She says patrols preserve the catch.', 'Step 3: She writes patrols.'], 'Cold rooms keep fish fresh. Patrols stop piracy and illegal fishing.', 'FI_SOLUTION_MIX'),
    S('Kassim says smaller nets will cure overfishing. Which step has the mistake?', ['Step 1: Kassim sees falling catches.', '!Step 2: He says smaller nets catch fewer young fish.', 'Step 3: He writes smaller nets.'], 'Smaller nets catch young fish and make overfishing worse.', 'FI_OVER_OK'),
    S('Rehema says cold rooms stop pirates. Which step has the mistake?', ['Step 1: Rehema knows pirates attack boats.', '!Step 2: She says a cold room guards the sea.', 'Step 3: She writes cold rooms.'], 'Sea patrols stop pirates. Cold rooms keep fish fresh.', 'FI_SOLUTION_MIX'),
    S('Hamza says fish stocks cannot fall, so fishing rules are pointless. Which step has the mistake?', ['Step 1: Hamza sees full boats today.', '!Step 2: He says fish stocks cannot fall.', 'Step 3: He writes rules are pointless.'], 'Fish stocks can fall when too many are taken.', 'FI_OVER_OK'),
  ], { h: ['Which step pairs a problem with the wrong solution?', 'Rules, cold rooms and patrols each have a different job.'], s1: 'Check each pair of problem and solution.' })),

  // ---------------------------------------------------------------- WT_FACTORS
  fam('wt.fa.which', `${WT}WT_FACTORS`, 'direct', 1, choose([
    Q('Which factor draws tourists to Eastern Africa?', 'Wildlife, beaches and mountains', w('WT_TOURIST_ROADS', 'Closed borders and poor roads', 'Fear and insecurity', 'Lack of hotels'), 'Tourists come to see wildlife, beaches and mountains.'),
    Q('What do airports and hotels do for tourism?', 'Help visitors to arrive and stay', w('WT_TOURIST_ROADS', 'Keep visitors away from parks', 'Take no part in tourism', 'Make travel harder'), 'Transport and hotels make visiting easy.'),
    Q('What does insecurity do to tourism?', 'Frightens tourists away', w('WT_INSECURITY', 'Brings more tourists', 'Makes hotels cheaper to run', 'Improves the roads'), 'Tourists avoid places they think are unsafe.'),
    Q('Which factor helps tourists find a country?', 'Good advertising and marketing', w('WT_TOURIST_ROADS', 'Hiding the parks', 'Closing the airports', 'Charging very high prices'), 'Marketing tells the world what a country offers.'),
    Q('Which is a cultural attraction for tourists?', 'Traditional dances and Swahili heritage', w('WT_TOURIST_ROADS', 'Empty shops and offices', 'Rubbish in the streets', 'Closed museums'), 'Culture and heritage draw visitors.'),
  ], { h: ['What would make a family want to visit?', 'Attractions, safety, transport and hotels.'], s1: 'Think about what makes tourists come.' })),
  fam('wt.fa.story', `${WT}WT_FACTORS`, 'word', 2, choose([
    Q('Visitors cancel trips to a country after fighting breaks out. What factor is at work?', 'Insecurity', w('WT_INSECURITY', 'Good roads', 'Fine weather', 'Many hotels'), 'Insecurity keeps tourists away.'),
    Q('A park has wonderful animals but no road to it. What is the effect?', 'Few tourists can reach it', w('WT_TOURIST_ROADS', 'More tourists reach it', 'It gets famous at once', 'Hotels fill up'), 'Poor roads make access hard.'),
    Q('The government advertises its parks on television abroad. Which factor is this?', 'Marketing', w('WT_TOURIST_ROADS', 'Insecurity', 'Drought', 'Poaching'), 'Marketing attracts visitors.'),
    Q('A lodge near the Mara offers good food, clean rooms and guides. What does this do?', 'Makes tourists stay longer and return', w('WT_TOURIST_ROADS', 'Makes tourists leave quickly', 'Makes the park smaller', 'Keeps all animals away'), 'Good accommodation and service bring return visits.'),
    Q('Why is a pleasant climate good for tourism in Eastern Africa?', 'Visitors enjoy the warm, sunny weather', w('WT_TOURIST_ROADS', 'Visitors dislike sunshine', 'The weather has no effect', 'It keeps animals away'), 'Pleasant weather helps tourism.'),
  ], { h: ['Which factor does the story show?', 'Safety, access, marketing and comfort matter.'], s1: 'Name the factor in the story.' })),

  // ---------------------------------------------------------------- WT_PARKS
  fam('wt.pa.where', `${WT}WT_PARKS`, 'direct', 1, choose([
    Q('In which country is the Serengeti National Park?', 'Tanzania', w('WT_PARK_COUNTRY', 'Kenya', 'Uganda', 'Rwanda'), 'The Serengeti is in northern Tanzania.'),
    Q('In which country is the Maasai Mara National Reserve?', 'Kenya', w('WT_PARK_COUNTRY', 'Tanzania', 'Uganda', 'Ethiopia'), 'The Maasai Mara is in south-western Kenya.'),
    Q('Where can mountain gorillas be seen?', 'Bwindi in Uganda and the Volcanoes Park in Rwanda', w('WT_GORILLA', 'The Maasai Mara in Kenya', 'The Serengeti in Tanzania', 'Amboseli in Kenya'), 'Mountain gorillas live in forests in the mountains.'),
    Q('In which country is Queen Elizabeth National Park?', 'Uganda', w('WT_PARK_COUNTRY', 'Kenya', 'Tanzania', 'Burundi'), 'Queen Elizabeth National Park is in western Uganda.'),
    Q('Which park is famous for elephants against Mount Kilimanjaro?', 'Amboseli', w('WT_PARK_COUNTRY', 'Serengeti', 'Murchison Falls', 'Mikumi'), 'Amboseli in Kenya has a view of Kilimanjaro.'),
  ], { h: ['Place each park in its country.', 'Mara is in Kenya, Serengeti in Tanzania, Bwindi in Uganda.'], s1: 'Match the park to its country.' })),
  fam('wt.pa.table', `${WT}WT_PARKS`, 'table', 2, choose([
    Q('Look at the table. Which park is in Tanzania?', 'Ngorongoro', w('WT_PARK_COUNTRY', 'Tsavo', 'Murchison Falls', 'Akagera'), 'Ngorongoro is in northern Tanzania.',
      T(['Park', 'Known for'], [['Ngorongoro', 'A large crater with animals'], ['Tsavo', 'Red elephants'], ['Murchison Falls', 'A great waterfall'], ['Akagera', 'Lakes and savanna']])),
    Q('Which park is known for a great waterfall on the Nile?', 'Murchison Falls', w('WT_PARK_COUNTRY', 'Amboseli', 'Mikumi', 'Nakuru'), 'Murchison Falls in Uganda is on the River Nile.'),
    Q('The wildebeest migration crosses between which two parks?', 'The Serengeti and the Maasai Mara', w('WT_PARK_COUNTRY', 'Amboseli and Tsavo', 'Mikumi and Ruaha', 'Queen Elizabeth and Bwindi'), 'Wildebeest cross between Tanzania and Kenya.'),
    Q('Which park in Kenya is known for flamingos on its lake?', 'Lake Nakuru', w('WT_PARK_COUNTRY', 'Serengeti', 'Bwindi', 'Mikumi'), 'Lake Nakuru National Park is known for flamingos.'),
    Q('Which country has the Volcanoes National Park?', 'Rwanda', w('WT_GORILLA', 'Kenya', 'Tanzania', 'Somalia'), 'The Volcanoes National Park is in north-west Rwanda.'),
  ], { h: ['Match the park to its country or its animals.', 'Think of the migration across the border.'], s1: 'Match the park to what it is known for.' })),

  // ---------------------------------------------------------------- WT_PROBLEMS
  fam('wt.pr.pair', `${WT}WT_PROBLEMS`, 'direct', 1, choose([
    Q('What helps to stop poaching?', 'Anti-poaching patrols and strong laws', w('WT_SOLUTION_SWAP', 'Opening more hotels near the park', 'Advertising the park on television', 'Building more roads to the parks'), 'Patrols and laws protect wildlife.'),
    Q('What helps when elephants raid farms near a park?', 'Fences and payment for crop damage', w('WT_SOLUTION_SWAP', 'More hotels built inside the park', 'More advertisements shown abroad', 'More airports built in the towns'), 'Fences and compensation reduce conflict.'),
    Q('What does poaching do to tourism?', 'Kills the wildlife tourists come to see', w('WT_POACH_OK', 'Fills the parks with more animals', 'Helps tourism to grow every year', 'Makes more visitors come to the park'), 'Fewer animals means fewer tourists.'),
    Q('What helps when few tourists know a country\'s parks?', 'Advertising and marketing campaigns', w('WT_SOLUTION_SWAP', 'Anti-poaching patrols in the park', 'Fences round the farms near it', 'Stronger laws on the sale of ivory'), 'Marketing makes the parks known.'),
    Q('What helps when roads to a park are rough and slow?', 'Building and repairing the roads', w('WT_SOLUTION_SWAP', 'More marketing posters on the walls', 'Anti-poaching patrols by the rangers', 'Payment for crop damage by animals'), 'Good roads make parks easy to reach.'),
  ], { h: ['Match each tourism problem to the action that solves it.', 'Patrols for poachers, roads for access, marketing for visitors.'], s1: 'Match problem and solution.' })),
  fam('wt.pr.story', `${WT}WT_PROBLEMS`, 'word', 2, choose([
    Q('Rhinos are being killed for their horns in a reserve. Which solution fits?', 'More rangers and tougher laws', w('WT_SOLUTION_SWAP', 'A wider road leading to the park', 'A new advertising poster for visitors', 'A new hotel built beside the gate'), 'Rangers and strong laws protect rhinos.'),
    Q('Villagers lose crops to wild animals and then hate the park. What will help?', 'Compensation and community conservancies', w('WT_SOLUTION_SWAP', 'More advertising of the park abroad', 'More hotels built near the park', 'Better airports in the nearby towns'), 'Sharing benefits with villagers reduces conflict.'),
    Q('A terror attack frightens tourists away. Which solution fits?', 'Better security and honest news about safety', w('WT_SOLUTION_SWAP', 'Anti-poaching rangers in the park only', 'More fences round the farms only', 'Lower prices at the hotels only'), 'Security restores trust.'),
    Q('Drought dries the rivers in a park, and animals die. Which action helps?', 'Dig water points for the animals', w('WT_SOLUTION_SWAP', 'Build more hotels near the park', 'Raise the park entry fees now', 'Advertise the park on the radio'), 'Water points save animals in a drought.'),
    Q('Why do community conservancies help tourism?', 'Local people share income and protect wildlife', w('WT_POACH_OK', 'They stop all visitors from coming in', 'They remove all of the animals', 'They let poachers hunt in peace'), 'People who gain from wildlife protect it.'),
  ], { h: ['What problem does the story show?', 'Poaching, conflict, insecurity and drought each need their own answer.'], s1: 'Match the problem with its solution.' }), 'd'),
  fam('wt.pr.spot', `${WT}WT_PROBLEMS`, 'spot', 3, spot([
    S('Victor says poaching helps tourism because it brings money. Which step has the mistake?', ['Step 1: Victor sees a poacher selling ivory.', '!Step 2: He says the poacher\'s money helps the park.', 'Step 3: He writes poaching helps tourism.'], 'Poaching kills the wildlife tourists come to see.', 'WT_POACH_OK'),
    S('Anita says building roads will stop poaching. Which step has the mistake?', ['Step 1: Anita knows poaching is a problem.', '!Step 2: She says roads will catch poachers.', 'Step 3: She writes roads.'], 'Patrols and strong laws stop poaching. Roads help visitors reach parks.', 'WT_SOLUTION_SWAP'),
    S('Isaac says insecurity brings more tourists. Which step has the mistake?', ['Step 1: Isaac sees armed guards at a hotel.', '!Step 2: He says guards attract visitors.', 'Step 3: He writes more tourists.'], 'Insecurity frightens tourists away.', 'WT_INSECURITY'),
    S('Brenda says advertising will stop human-wildlife conflict. Which step has the mistake?', ['Step 1: Brenda knows animals raid farms.', '!Step 2: She says posters will stop elephants.', 'Step 3: She writes advertising.'], 'Fences and compensation reduce conflict. Advertising brings visitors.', 'WT_SOLUTION_SWAP'),
    S('Charles says killing animals has no effect on tourism. Which step has the mistake?', ['Step 1: Charles sees many animals in the park.', '!Step 2: He says tourists do not care about animals.', 'Step 3: He writes no effect.'], 'Tourists come to see wildlife, so killing animals harms tourism.', 'WT_POACH_OK'),
  ], { h: ['Which step pairs a problem with the wrong solution, or says harm is good?', 'Match problem to its own cure.'], s1: 'Check each pair of problem and solution.' })),
];
