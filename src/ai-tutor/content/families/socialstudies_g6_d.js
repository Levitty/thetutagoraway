// ============================================================================
// GRADE 6 SOCIAL STUDIES, STRAND 3B AND 4A: TRANSPORT, COMMUNICATION, MINING AND TRADITIONAL GOVERNMENT (10 skills).
// Transport networks and their problems, modes of communication and their problems, minerals, mining methods and effects, and how the
// Buganda and the Nyamwezi were governed. Written offline from the KICD 2024 design through the curriculum map
// (curriculum/social_studies/g6.json). Map questions are in words or a small table. Every wrong answer names the library
// misconception it reveals. The options of each question are about the same length. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w } from './socialstudies_g6_lib.js';

const TR = 'RESOUR.TRANSPORT_IN_EASTERN_AFR.', CM = 'RESOUR.COMMUNICATIO_N_IN_EASTER.', MN = 'RESOUR.MINING_IN_EASTERN_AFRICA.', TG = 'POLITI.TRADITIONAL_FORMS_OF_GOV.';
const T = (head, rows) => ({ t: { head, rows } });

export const FAMILIES = [
  // ---------------------------------------------------------------- TR_NETWORKS
  fam('tr.nw.which', `${TR}TR_NETWORKS`, 'direct', 1, choose([
    Q('In which country is the port of Dar es Salaam?', 'Tanzania', w('TR_PORT_COUNTRY', 'Kenya', 'Uganda', 'Somalia'), 'Dar es Salaam is the main port of Tanzania. Mombasa is the main port of Kenya.'),
    Q('Which port serves landlocked Uganda for most of its imports?', 'Mombasa', w('TR_LANDLOCKED_PORT', 'Kampala', 'Entebbe', 'Jinja'), 'Uganda has no sea coast, so goods come in through Mombasa and Dar es Salaam.'),
    Q('Which mode is best for bulky, heavy goods over a long distance?', 'The railway', w('TR_MODE_LOAD', 'The aeroplane', 'The bicycle', 'The motorcycle'), 'Railways carry heavy loads cheaply over long distances.'),
    Q('Which port serves landlocked Ethiopia?', 'Djibouti', w('TR_LANDLOCKED_PORT', 'Kampala', 'Mogadishu', 'Entebbe'), 'Most of Ethiopia\'s trade goes through the port of Djibouti.'),
    Q('Which pipeline carries oil products from Mombasa to western Kenya?', 'The Kenya Pipeline', w('TR_MODE_LOAD', 'The Great Rift', 'The TAZARA line', 'The Nile pipeline'), 'The Kenya Pipeline carries fuel from Mombasa to Nairobi, Eldoret and Kisumu.'),
  ], { h: ['Think about where the sea ports are and what each mode carries best.', 'Landlocked countries use their neighbours\' ports.'], s1: 'Match the network to its country or job.' })),
  fam('tr.nw.table', `${TR}TR_NETWORKS`, 'table', 2, choose([
    Q('Look at the table. Which is the main port of Kenya?', 'Mombasa', w('TR_PORT_COUNTRY', 'Dar es Salaam', 'Djibouti', 'Kisumu'), 'Mombasa is Kenya\'s main port on the Indian Ocean.',
      T(['Place', 'What it is'], [['Mombasa', 'A port in Kenya'], ['Dar es Salaam', 'A port in Tanzania'], ['Djibouti', 'A port in Djibouti'], ['Kisumu', 'A lake port in Kenya']])),
    Q('Which airport is the main one in Uganda?', 'Entebbe', w('TR_PORT_COUNTRY', 'Bole', 'Jomo Kenyatta', 'Julius Nyerere'), 'Entebbe International Airport serves Kampala.'),
    Q('Which airport serves Addis Ababa?', 'Bole International Airport', w('TR_PORT_COUNTRY', 'Entebbe International Airport', 'Jomo Kenyatta International Airport', 'Julius Nyerere International Airport'), 'Bole is the airport of Addis Ababa and the hub of Ethiopian Airlines.'),
    Q('Which railway links Dar es Salaam to Zambia?', 'The TAZARA railway', w('TR_MODE_LOAD', 'The Uganda Railway', 'The Standard Gauge Railway to Naivasha', 'The Djibouti railway'), 'TAZARA runs from Dar es Salaam to Zambia.'),
    Q('Which road is the Northern Corridor?', 'Mombasa to Nairobi to Kampala', w('TR_PORT_COUNTRY', 'Dar es Salaam to Dodoma to Kigoma', 'Mombasa to Dar es Salaam by the coast', 'Addis Ababa to Djibouti'), 'The Northern Corridor runs from Mombasa through Nairobi to Kampala and on to Kigali.'),
  ], { h: ['Which network joins which places?', 'Northern Corridor: Mombasa to Kampala. Central Corridor: Dar es Salaam inland.'], s1: 'Match the network to its places.' })),
  fam('tr.nw.spot', `${TR}TR_NETWORKS`, 'spot', 3, spot([
    S('Aisha says Dar es Salaam is a port in Kenya. Which step has the mistake?', ['Step 1: Aisha knows Dar es Salaam is a big port.', '!Step 2: She puts it in her own country.', 'Step 3: She writes Kenya.'], 'Dar es Salaam is a port in Tanzania.', 'TR_PORT_COUNTRY'),
    S('Kelvin says heavy goods are best sent by air. Which step has the mistake?', ['Step 1: Kelvin knows air travel is fast.', '!Step 2: He says fast means best for heavy loads.', 'Step 3: He writes air.'], 'Air freight is costly. Railways carry heavy goods cheaply.', 'TR_MODE_LOAD'),
    S('Brenda says Uganda has its own sea port. Which step has the mistake?', ['Step 1: Brenda knows Uganda has Lake Victoria.', '!Step 2: She says a lake port is a sea port.', 'Step 3: She writes Uganda has a sea port.'], 'Uganda is landlocked and uses Mombasa and Dar es Salaam.', 'TR_LANDLOCKED_PORT'),
    S('Hassan says Mombasa is in Tanzania. Which step has the mistake?', ['Step 1: Hassan remembers Mombasa is a coast town.', '!Step 2: He says all coast ports are in Tanzania.', 'Step 3: He writes Tanzania.'], 'Mombasa is Kenya\'s port. Dar es Salaam is Tanzania\'s.', 'TR_PORT_COUNTRY'),
    S('Janet says Ethiopia ships goods through its own sea port. Which step has the mistake?', ['Step 1: Janet knows Ethiopia trades overseas.', '!Step 2: She says it has a coast of its own.', 'Step 3: She writes its own port.'], 'Ethiopia is landlocked and uses Djibouti.', 'TR_LANDLOCKED_PORT'),
  ], { h: ['Which step puts a port in the wrong country, or says a landlocked country has a port?', 'Check the map.'], s1: 'Check each step against the map.' })),

  // ---------------------------------------------------------------- TR_PROBLEMS
  fam('tr.pr.pair', `${TR}TR_PROBLEMS`, 'direct', 1, choose([
    Q('What helps to cut delays at a border post?', 'A one-stop border post where both sides check once', w('TR_BORDER', 'A rule that makes lorries wait for days in a queue', 'A new tax added on every lorry at the gate', 'A longer road to the gate of the next country'), 'At a one-stop border post, officers of both countries check lorries once.'),
    Q('What helps to reduce road crashes?', 'Speed limits, good roads and driver training', w('TR_CRASH_SOLVE', 'Higher speeds for all the cars on the road', 'Fewer signs and no police along the roads', 'Narrow roads with no lines or lights at all'), 'Safe speeds, safe roads and trained drivers reduce crashes.'),
    Q('What helps with potholes and washed-away roads?', 'Regular repair and maintenance of roads', w('TR_CRASH_SOLVE', 'Higher speeds for all the cars on the road', 'More signs for the speed limit on roads', 'Fewer lorries to carry all the goods'), 'Roads must be repaired often, especially after rains.'),
    Q('What helps to stop people stealing railway parts and road signs?', 'Strong laws and guards on the routes', w('TR_BORDER', 'Longer delays at the border posts', 'More potholes on all the main roads', 'Fewer police stations along the way'), 'Laws and guards protect transport equipment.'),
    Q('What helps with traffic jams in big towns like Nairobi?', 'Bypasses and a good commuter railway', w('TR_CRASH_SOLVE', 'More cars in the narrow town streets', 'Fewer roads for all the town traffic', 'Closing every railway line in the area'), 'Bypasses and railways take traffic out of the centre.'),
  ], { h: ['Match each transport problem to the action that solves it.', 'Border delays: one-stop border posts. Crashes: speed limits and training.'], s1: 'Match problem and solution.' })),
  fam('tr.pr.story', `${TR}TR_PROBLEMS`, 'word', 2, choose([
    Q('Lorries from Mombasa wait for two days at the Malaba border. Which solution fits?', 'A one-stop border post that checks lorries only once', w('TR_BORDER', 'A tax that makes the lorries pay twice at the gate', 'A rule that every lorry stops at each office', 'Closing the border to all lorries on market days'), 'A one-stop post lets two countries check goods once.'),
    Q('Many matatus speed and crash on a highway. Which action helps most?', 'Speed limits, police checks and driver training', w('TR_CRASH_SOLVE', 'Taking down all the speed limit signs', 'Building the road narrower than before', 'Allowing the matatus to carry more people'), 'Rules and training make roads safer.'),
    Q('Rain has washed away a bridge on a main road. What should the roads authority do?', 'Repair the bridge and keep it in good order', w('TR_CRASH_SOLVE', 'Let people use the broken bridge as it is', 'Remove all the other bridges as well', 'Raise the price of petrol along the road'), 'Roads and bridges need maintenance.'),
    Q('Thieves keep stealing copper cables from the railway. Which solution fits?', 'Guards, stronger laws and community watch', w('TR_BORDER', 'A new border post with longer delays', 'More potholes on the roads nearby', 'Fewer trains on the railway line'), 'Laws and guards protect the railway.'),
    Q('Why does building the Standard Gauge Railway help trade?', 'It carries heavy goods faster and more cheaply than lorries', w('TR_MODE_LOAD', 'It carries only people and no goods at all', 'It replaces all the roads in the country', 'It costs more than flying goods by plane'), 'Rail moves large loads cheaply, easing the roads.'),
  ], { h: ['What problem does the story show?', 'Border delays, crashes, damage and theft each have different answers.'], s1: 'Match the problem to its solution.' }), 'd'),

  // ---------------------------------------------------------------- CM_MODES
  fam('cm.mo.which', `${CM}CM_MODES`, 'direct', 1, choose([
    Q('Which is a traditional way of communicating?', 'A drum beaten to call a meeting', w('CM_TRAD_MODERN', 'A mobile phone message to a friend', 'An e-mail sent from a laptop computer', 'A television news programme on a channel'), 'Drums, horns and messengers are traditional means.'),
    Q('Which mode reaches many people at the same time?', 'Radio', w('CM_MASS', 'A letter posted to one home', 'A phone call to one friend', 'A note given to one person'), 'Radio and television reach large audiences at once.'),
    Q('Which is a modern means of communication?', 'The internet', w('CM_TRAD_MODERN', 'A smoke signal from a hill top', 'A horn blown at dawn in the village', 'A messenger sent on foot to the next village'), 'The internet is a modern, two-way means.'),
    Q('Which mode lets two people talk to each other even when far apart?', 'A mobile phone call', w('CM_MASS', 'A radio programme from a station', 'A newspaper printed every morning', 'A television news bulletin'), 'A phone call is two-way. Radio and newspapers are one-way.'),
    Q('Which of these carries written news printed on paper?', 'A newspaper', w('CM_MASS', 'A radio station on a hill', 'A television channel in the home', 'A drum in the village square'), 'Newspapers carry printed news.'),
  ], { h: ['Is the means old or new? Does it reach one person or many?', 'Drums are traditional. Radio reaches many.'], s1: 'Decide whether it is traditional or modern.' })),
  fam('cm.mo.story', `${CM}CM_MODES`, 'word', 2, choose([
    Q('A village chief sends a runner to carry news to the next village. Which mode is this?', 'A traditional means, the messenger', w('CM_TRAD_MODERN', 'A modern means, the telephone', 'A modern means, the e-mail', 'A modern means, the radio'), 'Messengers are a traditional means of communication.'),
    Q('The Minister speaks on the radio and every village hears. Which mode is this?', 'Mass communication through radio', w('CM_MASS', 'A private letter to one family', 'A telephone call between two men', 'A message left in a drum'), 'Radio reaches many people at once.'),
    Q('Njeri video-calls her uncle in Kampala from Nairobi. Which mode is this?', 'The internet', w('CM_TRAD_MODERN', 'Smoke signals from a hill', 'A drum sent by the elders', 'A letter by the post office'), 'Video calls use the internet.'),
    Q('A shopkeeper sends money to a farmer by mobile phone using M-Pesa. Which mode is this?', 'A mobile phone', w('CM_TRAD_MODERN', 'A horn blown in the market', 'A drum beaten in the village', 'A newspaper advertisement'), 'Mobile phones also carry money.'),
    Q('Which means is best for telling a whole country about a new law?', 'Radio and television', w('CM_MASS', 'A private letter to each house', 'A phone call to one person', 'A drum in one village'), 'Mass media reach large numbers.'),
  ], { h: ['Is the means traditional or modern?', 'Drums and messengers are traditional. Phones and the internet are modern.'], s1: 'Name the mode in the story.' })),

  // ---------------------------------------------------------------- CM_PROBLEMS
  fam('cm.pr.pair', `${CM}CM_PROBLEMS`, 'direct', 1, choose([
    Q('What helps with weak phone signal in remote villages?', 'Building more masts and towers in the area', w('CM_SOLUTION_SWAP', 'Taking down the masts that are already there', 'Making the airtime very expensive', 'Stopping all the radio programmes'), 'More masts bring signal to remote places.'),
    Q('What helps people who have no electricity to charge phones?', 'Solar charging points in the villages', w('CM_ELEC', 'Closing all the mobile phone shops', 'Banning phones in the whole village', 'Cutting the cables to the next town'), 'Solar power can charge phones where there is no grid.'),
    Q('What helps to stop theft of masts and cables?', 'Strong laws, guards and community watch', w('CM_SOLUTION_SWAP', 'Training the people in digital skills', 'Lowering the price of all the airtime', 'Building more shops near the masts'), 'Laws and guards protect equipment.'),
    Q('What helps people who find airtime and data too costly?', 'Lower taxes and more competition between companies', w('CM_SOLUTION_SWAP', 'A new law that raises the price of phones', 'Fewer companies and fewer choices of phones', 'More taxes on the sale of all data bundles'), 'Competition and lower taxes reduce prices.'),
    Q('What helps people who cannot use computers and phones well?', 'Training in digital skills at school and in the community', w('CM_ELEC', 'Closing the schools that teach computers', 'Banning phones and computers for children', 'Making all the passwords very long'), 'Training builds skills.'),
  ], { h: ['Match each communication problem to the action that solves it.', 'Masts for signal, solar for no power, laws for theft.'], s1: 'Match problem and solution.' })),
  fam('cm.pr.story', `${CM}CM_PROBLEMS`, 'word', 2, choose([
    Q('A village on a hill has no phone signal. What would help?', 'A new mast built on the hill for the village', w('CM_SOLUTION_SWAP', 'A new law that bans phones in the village', 'A shop that sells only airtime', 'A school that closes in the village'), 'A mast gives signal to the village.'),
    Q('Why does a lack of electricity harm communication?', 'Phones, radios and the internet need power to work', w('CM_ELEC', 'Electricity has nothing to do with them', 'Only letters and drums ever need electricity', 'Phones work best when they have no battery'), 'Modern means depend on power.'),
    Q('False news spreads on the phone and causes fear. What helps most?', 'Laws against false news and teaching how to check news', w('CM_SOLUTION_SWAP', 'More masts to spread messages even faster', 'More electricity supplied to all of the homes', 'Lower airtime prices charged to every single person'), 'Laws and digital skills reduce the harm.'),
    Q('Thieves cut cables on a road at night. What would help?', 'Guards, laws and watch groups along the cables', w('CM_SOLUTION_SWAP', 'A training course on how to use the internet', 'More solar panels at each school', 'Lower taxes on all the new phones'), 'Protecting equipment stops the loss.'),
    Q('Fewer people in a poor area can afford data. Which action helps?', 'Cheaper bundles and free community Wi-Fi spots', w('CM_SOLUTION_SWAP', 'Banning the use of data at the school', 'Fewer Wi-Fi spots for the whole community', 'Taxes that raise the price of data bundles'), 'Lower prices and shared Wi-Fi help.'),
  ], { h: ['What problem does the story show?', 'Signal, power, theft, cost and skills each have an answer.'], s1: 'Match the problem to its solution.' }), 'c'),

  // ---------------------------------------------------------------- MN_MINERALS
  fam('mn.mi.which', `${MN}MN_MINERALS`, 'direct', 1, choose([
    Q('Where is soda ash mined in Kenya?', 'Lake Magadi', w('MN_MINERAL_PLACE', 'Lake Naivasha', 'Lake Victoria', 'Lake Turkana'), 'Soda ash is taken from Lake Magadi in the Rift Valley.'),
    Q('Which country mines tanzanite?', 'Tanzania', w('MN_TANZANITE', 'Kenya', 'Uganda', 'Rwanda'), 'Tanzanite is mined only in Tanzania.'),
    Q('Which is a mineral?', 'Limestone', w('MN_NOT_MINERAL', 'Coffee', 'Timber', 'Tea'), 'Limestone is dug from the ground. Coffee, timber and tea are grown.'),
    Q('Which mineral is mined at Geita in Tanzania?', 'Gold', w('MN_MINERAL_PLACE', 'Soda ash', 'Fluorspar', 'Tanzanite'), 'Geita is a famous gold mining area in Tanzania.'),
    Q('Which mineral is taken from the Kerio Valley in Kenya?', 'Fluorspar', w('MN_MINERAL_PLACE', 'Soda ash', 'Gold', 'Diamonds'), 'Fluorspar is mined in the Kerio Valley.'),
  ], { h: ['Is it dug from the ground?', 'Think of the lake, valley or region each mineral is linked with.'], s1: 'Link the mineral to its place.' })),
  fam('mn.mi.table', `${MN}MN_MINERALS`, 'table', 2, choose([
    Q('Look at the table. Which country is known for diamonds?', 'Tanzania', w('MN_MINERAL_PLACE', 'Kenya', 'Uganda', 'Rwanda'), 'Diamonds are mined at Mwadui in Tanzania.',
      T(['Mineral', 'Where found'], [['Diamonds', 'Mwadui, Tanzania'], ['Soda ash', 'Lake Magadi, Kenya'], ['Limestone', 'Tororo, Uganda'], ['Fluorspar', 'Kerio Valley, Kenya']])),
    Q('Which mineral is quarried in Uganda for making cement?', 'Limestone', w('MN_MINERAL_PLACE', 'Soda ash', 'Gold', 'Tanzanite'), 'Uganda quarries limestone for cement at Tororo.'),
    Q('Which of these is the odd one out?', 'Tea', w('MN_NOT_MINERAL', 'Gold', 'Copper', 'Limestone'), 'Tea is grown. The other three are minerals.'),
    Q('Which country mines copper at Kilembe?', 'Uganda', w('MN_MINERAL_PLACE', 'Kenya', 'Tanzania', 'Somalia'), 'Kilembe in western Uganda has copper.'),
    Q('Which mineral is used to make glass and soap and comes from Lake Magadi?', 'Soda ash', w('MN_MINERAL_PLACE', 'Gold', 'Limestone', 'Tanzanite'), 'Soda ash is used in glass, soap and detergents.'),
  ], { h: ['Is it a mineral or a crop? Which place is it linked with?', 'Match the mineral to its country.'], s1: 'Match the mineral to its place.' })),

  // ---------------------------------------------------------------- MN_METHODS
  fam('mn.me.which', `${MN}MN_METHODS`, 'direct', 1, choose([
    Q('How is limestone usually mined?', 'In an open pit or quarry near the surface', w('MN_METHOD_SWAP', 'In a deep shaft under the ground', 'By washing gravel in a pan', 'By pumping brine from a lake'), 'Limestone is quarried from open pits.'),
    Q('What is panning?', 'Washing gravel in water to find mineral bits', w('MN_PANNING', 'Blasting rock with strong explosives', 'Digging a deep shaft under the ground', 'Drilling a hole into an oil field'), 'In panning, heavy mineral bits settle in the pan.'),
    Q('How is soda ash taken from Lake Magadi?', 'By dredging and pumping brine from the lake', w('MN_METHOD_SWAP', 'By digging a shaft deep below the lake', 'By panning in the shallow water', 'By cutting rock in a quarry'), 'Soda ash is dredged and pumped from the salty lake.'),
    Q('Which method uses shafts and tunnels under the ground?', 'Underground mining', w('MN_METHOD_SWAP', 'Open-cast mining', 'Quarrying', 'Panning'), 'Deep minerals such as gold may be reached by shafts.'),
    Q('What is open-cast mining?', 'Digging a pit from the surface', w('MN_METHOD_SWAP', 'Digging a shaft below the ground', 'Washing gravel in a river pan', 'Pumping liquid from a lake'), 'Open-cast mining takes minerals near the surface.'),
  ], { h: ['Is the mineral near the surface or deep down?', 'Pit for near-surface, shaft for deep, pan for river gravel.'], s1: 'Match the method to the mineral.' })),
  fam('mn.me.story', `${MN}MN_METHODS`, 'word', 2, choose([
    Q('A company digs a huge pit to take out limestone for cement. Which method is it?', 'Quarrying, or open-cast mining', w('MN_METHOD_SWAP', 'Underground mining with shafts', 'Panning in a river', 'Pumping from a lake'), 'Digging from the surface is open-cast.'),
    Q('Villagers wash river gravel in shallow pans hoping to find gold. Which method is it?', 'Panning', w('MN_PANNING', 'Blasting with explosives', 'Underground mining', 'Dredging a lake'), 'Panning is a simple way to find alluvial gold.'),
    Q('Miners go down a shaft to reach a gold-bearing reef deep underground. Which method is it?', 'Underground mining', w('MN_METHOD_SWAP', 'Open-cast mining', 'Panning', 'Quarrying'), 'Deep reefs are reached by shafts.'),
    Q('A machine sucks salty liquid from the lake bed and sends it to a plant. Which mineral does it make?', 'Soda ash', w('MN_METHOD_SWAP', 'Gold', 'Limestone', 'Diamonds'), 'At Lake Magadi brine is pumped and dried to make soda ash.'),
    Q('A quarry cuts stone in steps from the side of a hill. Which method is it?', 'Quarrying', w('MN_METHOD_SWAP', 'Underground mining', 'Panning', 'Brine pumping'), 'Quarrying is cutting stone from the surface.'),
  ], { h: ['Where is the mineral found: surface, deep or in water?', 'Choose the method to match.'], s1: 'Match the story to a mining method.' })),

  // ---------------------------------------------------------------- MN_EFFECTS
  fam('mn.ef.which', `${MN}MN_EFFECTS`, 'direct', 1, choose([
    Q('What does open-cast mining leave behind if it is not repaired?', 'Large holes and bare, damaged land', w('MN_NO_HARM', 'Rich green forests everywhere', 'Fertile farmland ready to plant', 'Clean rivers and fresh air'), 'Open pits scar the land.'),
    Q('How can a mined area be repaired?', 'Refill the pits and plant trees', w('MN_REPAIR', 'Leave the pits open and unfenced', 'Cut down the remaining trees', 'Pour waste water into the pits'), 'Refilling and planting help land to recover.'),
    Q('What harm can chemicals such as mercury do in gold mining?', 'Poison the water and the fish', w('MN_NO_HARM', 'Make the water cleaner for all', 'Help the plants to grow faster', 'Do no harm to any life'), 'Chemicals pollute water.'),
    Q('Which place shows a quarry made into a park?', 'Haller Park in Mombasa', w('MN_REPAIR', 'Lake Magadi in the Rift', 'The Mwadui diamond mine', 'The Geita gold mine'), 'Haller Park was once a limestone quarry. Trees and animals now live there.'),
    Q('Which is a good effect of mining?', 'Jobs and income for people and the country', w('MN_NO_HARM', 'Cleaner air and rivers for all', 'More farmland for all the people', 'No change at all to the land'), 'Mining provides jobs and money, though it must be done with care.'),
  ], { h: ['Think of what happens to land, water and people.', 'Holes and pollution are harms. Refilling and planting repair them.'], s1: 'Think about harm and repair.' })),
  fam('mn.ef.story', `${MN}MN_EFFECTS`, 'word', 2, choose([
    Q('A quarry has left deep holes in a field where cattle used to graze. What should the company do?', 'Refill the pits and replant the land', w('MN_REPAIR', 'Leave the holes open to fill with rain', 'Dig more pits in the same field', 'Fence off the field and forget it'), 'Reclaiming land makes it useful again.'),
    Q('A river near a gold mine has turned brown and fish are dying. What is the likely cause?', 'Waste and chemicals from the mine', w('MN_NO_HARM', 'Too many fish eating each other', 'Too much rain falling on the hills', 'Too little sunshine over the water'), 'Mine waste can poison rivers.'),
    Q('Dust from a limestone quarry covers houses nearby. What does this show?', 'Mining can cause air pollution', w('MN_NO_HARM', 'Mining never affects air', 'Mining makes the air cleaner', 'Mining brings the rain'), 'Dust is a harm to people living nearby.'),
    Q('The government says miners must plant trees after they finish. Why?', 'To repair the land they have damaged', w('MN_REPAIR', 'To hide the minerals from others', 'To make the pits deeper', 'To make the soil poorer'), 'Planting helps the land to recover.'),
    Q('Why must mining companies treat waste water before it flows into rivers?', 'So that it does not poison people and animals', w('MN_NO_HARM', 'So that rivers dry up faster', 'So that fish leave the river', 'So that farmers use less water'), 'Treating waste protects water.'),
  ], { h: ['What harm does the story show and how can it be repaired?', 'Holes, dust and poisoned water are harms.'], s1: 'Think about the harm and its repair.' }), 'd'),
  fam('mn.ef.spot', `${MN}MN_EFFECTS`, 'spot', 3, spot([
    S('Alex says mining never harms the land. Which step has the mistake?', ['Step 1: Alex sees the mine bring jobs.', '!Step 2: He says a pit leaves the land unchanged.', 'Step 3: He writes mining does no harm.'], 'Open-cast mining leaves holes and bare land unless it is repaired.', 'MN_NO_HARM'),
    S('Sylvia says the best repair for a mine is to leave the pit open. Which step has the mistake?', ['Step 1: Sylvia sees a finished pit.', '!Step 2: She says an open pit repairs itself.', 'Step 3: She writes leave it open.'], 'Refilling pits and planting trees repair mined land.', 'MN_REPAIR'),
    S('Moses says chemicals from a gold mine make rivers cleaner. Which step has the mistake?', ['Step 1: Moses knows chemicals are used in gold mining.', '!Step 2: He says chemicals clean the water.', 'Step 3: He writes cleaner rivers.'], 'Chemicals such as mercury poison water and fish.', 'MN_NO_HARM'),
    S('Irene says Haller Park shows that quarries can never be repaired. Which step has the mistake?', ['Step 1: Irene hears Haller Park was a quarry.', '!Step 2: She says quarries stay as holes for ever.', 'Step 3: She writes never repaired.'], 'Haller Park was a limestone quarry that was repaired with trees and animals.', 'MN_REPAIR'),
    S('Duncan says dust from a quarry is good for the lungs. Which step has the mistake?', ['Step 1: Duncan lives near a quarry.', '!Step 2: He says dust has no effect on health.', 'Step 3: He writes dust is good.'], 'Dust from mining can harm breathing and health.', 'MN_NO_HARM'),
  ], { h: ['Which step says mining never harms, or that it cannot be repaired?', 'Mining harms land and water but repair is possible.'], s1: 'Check each step against the effects of mining.' })),

  // ---------------------------------------------------------------- TG_BUGANDA
  fam('tg.bu.which', `${TG}TG_BUGANDA`, 'direct', 1, choose([
    Q('What was the ruler of the Buganda kingdom called?', 'The Kabaka', w('TG_KABAKA', 'The Ntemi', 'The Katikkiro', 'The Lukiiko'), 'The Kabaka was the king of Buganda.'),
    Q('Who was the Katikkiro in Buganda?', 'The chief minister who helped the Kabaka', w('TG_KATIKKIRO', 'The village priest of the kingdom', 'The chief of a small clan', 'The army leader at the border'), 'The Katikkiro was the Kabaka\'s chief minister.'),
    Q('What was the Lukiiko in Buganda?', 'The council that advised the Kabaka', w('TG_KATIKKIRO', 'The royal palace on the hill', 'The army of the kingdom', 'The market of the capital'), 'The Lukiiko was the council of chiefs.'),
    Q('How were the chiefs of Buganda placed in their posts?', 'The Kabaka appointed them to areas', w('TG_KABAKA', 'They were elected by all the people', 'They inherited the post from their fathers', 'They were chosen by the Ntemi'), 'In Buganda many chiefs were appointed by the Kabaka.'),
    Q('Buganda was ruled as what kind of state?', 'One large centralised kingdom', w('TG_KABAKA', 'Many small independent chiefdoms', 'A group of equal villages', 'A republic with a president'), 'Buganda was one strong kingdom.'),
  ], { h: ['Recall the title of the ruler, his chief minister and his council.', 'Kabaka, Katikkiro and Lukiiko.'], s1: 'Recall the Buganda titles.' })),
  fam('tg.bu.story', `${TG}TG_BUGANDA`, 'word', 2, choose([
    Q('The Kabaka needs advice on a new law. Who does he turn to first?', 'The Katikkiro and the Lukiiko', w('TG_KABAKA', 'The Ntemi and his elders', 'The village priest alone', 'Visitors from other lands'), 'The Katikkiro and the Lukiiko advised the Kabaka.'),
    Q('A saza chief of Buganda does his work badly. What can the Kabaka do?', 'Remove him and appoint another', w('TG_KABAKA', 'Nothing, because the post is inherited', 'Ask the people to vote him out', 'Leave him there for life'), 'The Kabaka appointed chiefs and could remove them.'),
    Q('Which title belongs to the king of Buganda, not the Nyamwezi?', 'Kabaka', w('TG_KABAKA', 'Ntemi', 'Elder', 'Headman'), 'Kabaka is the Buganda title. Ntemi is Nyamwezi.'),
    Q('Why was Buganda called a centralised kingdom?', 'Power came from one king through appointed chiefs', w('TG_KABAKA', 'Each village ruled itself alone', 'There was no king at all', 'The people ruled in a big meeting'), 'Orders came down from the Kabaka through his chiefs.'),
    Q('Who was at the head of the chiefs and the Lukiiko in Buganda?', 'The Kabaka', w('TG_KABAKA', 'The Ntemi', 'A village elder', 'A trader'), 'The Kabaka was head of all.'),
  ], { h: ['Think of the order of rule: Kabaka, Katikkiro, Lukiiko, chiefs.', 'The Kabaka appointed the chiefs.'], s1: 'Think of who had which job.' })),

  // ---------------------------------------------------------------- TG_NYAMWEZI
  fam('tg.ny.which', `${TG}TG_NYAMWEZI`, 'direct', 1, choose([
    Q('What was the ruler of a Nyamwezi chiefdom called?', 'The Ntemi', w('TG_KABAKA', 'The Kabaka', 'The Katikkiro', 'The Lukiiko'), 'The Ntemi was the chief of a Nyamwezi chiefdom.'),
    Q('How was the Nyamwezi land organised?', 'Many small chiefdoms, each under a Ntemi', w('TG_NTEMI_KING', 'One large kingdom under one king', 'One republic under a president', 'A single clan council for all'), 'There were many small chiefdoms.'),
    Q('How did a person become a Ntemi?', 'By inheriting the position', w('TG_NTEMI_CHOSEN', 'By a vote of all the people', 'By appointment by the Kabaka', 'By winning a race'), 'The Ntemi inherited his position.'),
    Q('Who advised the Ntemi?', 'A council of elders', w('TG_NTEMI_CHOSEN', 'The Lukiiko in Kampala', 'The Katikkiro of Buganda', 'The traders of the coast'), 'Elders advised the Ntemi.'),
    Q('What was a duty of the Ntemi?', 'Judging cases and leading his people', w('TG_NTEMI_KING', 'Ruling all of Tanzania alone', 'Choosing all the other chiefs', 'Collecting taxes for the Kabaka'), 'The Ntemi led and judged his people.'),
  ], { h: ['Recall the title of the Nyamwezi ruler and how he got it.', 'Ntemi, inherited, advised by elders.'], s1: 'Recall the Nyamwezi titles.' })),
  fam('tg.ny.story', `${TG}TG_NYAMWEZI`, 'word', 2, choose([
    Q('When a Ntemi died, who took his place?', 'A person from his family who inherited the post', w('TG_NTEMI_CHOSEN', 'A man chosen by the vote of all', 'A chief appointed by the Kabaka', 'A trader chosen by his wealth'), 'The post passed within the family.'),
    Q('Two men quarrel over land in a Nyamwezi chiefdom. Who settles the case?', 'The Ntemi with his council of elders', w('TG_NTEMI_KING', 'The Kabaka in his palace', 'The Lukiiko in the capital', 'A foreign trader'), 'The Ntemi and elders judged cases.'),
    Q('Why were Nyamwezi chiefdoms small?', 'Each Ntemi ruled only his own area', w('TG_NTEMI_KING', 'One king ruled all of them', 'They were all part of Buganda', 'They had no rulers'), 'Power was spread among many chiefs.'),
    Q('Which title belongs to the Nyamwezi, not Buganda?', 'Ntemi', w('TG_KABAKA', 'Kabaka', 'Katikkiro', 'Lukiiko'), 'Ntemi is the Nyamwezi title.'),
    Q('The Ntemi wants to start a new rule. What should he do first?', 'Consult the council of elders', w('TG_NTEMI_CHOSEN', 'Ask the Kabaka for permission', 'Hold a vote of all people', 'Ignore the elders'), 'Elders advised the Ntemi.'),
  ], { h: ['Think of how a Ntemi got the post and who helped him.', 'Inherited and advised by elders.'], s1: 'Think of the Ntemi\'s position.' })),

  // ---------------------------------------------------------------- TG_COMPARE
  fam('tg.co.which', `${TG}TG_COMPARE`, 'direct', 1, choose([
    Q('What did Buganda and the Nyamwezi have in common?', 'A ruler who was advised by a council', w('TG_NO_COUNCIL', 'No ruler and no council at all', 'A president and a parliament', 'A king chosen by an election'), 'Both rulers had a council.'),
    Q('How did Buganda differ from the Nyamwezi?', 'Buganda was one large centralised kingdom', w('TG_SAME_ALL', 'It was just the same in every way', 'It had no ruler and no council at all', 'It had many small independent chiefdoms'), 'The Nyamwezi had many small chiefdoms.'),
    Q('Which statement is true of the Nyamwezi but NOT of Buganda?', 'They lived in many small independent chiefdoms', w('TG_SAME_ALL', 'They had a Lukiiko council of chiefs', 'They had a king called the Kabaka', 'They had chiefs appointed by one king'), 'Only the Nyamwezi had many small chiefdoms.'),
    Q('Which statement is true of Buganda but NOT of the Nyamwezi?', 'The Kabaka appointed chiefs over areas', w('TG_SAME_ALL', 'A council of elders advised the ruler', 'The ruler was also the judge of cases', 'A Ntemi ruled over each small chiefdom'), 'The Kabaka appointed his chiefs.'),
    Q('Which is true of both systems?', 'The ruler also acted as a judge', w('TG_NO_COUNCIL', 'The ruler was always elected by all', 'The ruler had no advisers', 'The ruler was chosen by foreigners'), 'In both the ruler heard cases.'),
  ], { h: ['Think of ruler, council, size and how chiefs were chosen.', 'Same: ruler and council. Different: size and appointment.'], s1: 'Compare the two systems.' })),
  fam('tg.co.table', `${TG}TG_COMPARE`, 'table', 2, choose([
    Q('Look at the table. Which feature is true of the Nyamwezi only?', 'Many small chiefdoms', w('TG_SAME_ALL', 'A Katikkiro', 'A Lukiiko', 'One large kingdom'), 'The Nyamwezi had many small chiefdoms.',
      T(['Feature', 'Buganda', 'Nyamwezi'], [['Ruler', 'Kabaka', 'Ntemi'], ['Size', 'One large kingdom', 'Many small chiefdoms'], ['Advisers', 'Katikkiro and Lukiiko', 'Council of elders'], ['Chiefs', 'Appointed by the Kabaka', 'Inherited by families']])),
    Q('Which feature is true of Buganda only?', 'The Kabaka appointed the chiefs', w('TG_SAME_ALL', 'A council of elders advised the ruler', 'The ruler was a judge', 'The chief inherited the post'), 'Only the Kabaka appointed chiefs over areas.'),
    Q('Which is a similarity?', 'Both rulers were advised by a council', w('TG_NO_COUNCIL', 'Both rulers had unlimited power alone', 'Both ruled over one large kingdom', 'Both had a Katikkiro'), 'Both had a council.'),
    Q('Which is a difference?', 'Buganda had a chief minister; the Nyamwezi did not', w('TG_SAME_ALL', 'Both had a Kabaka', 'Both had an elected ruler', 'Both lacked advisers'), 'Only Buganda had a Katikkiro.'),
    Q('Why is it wrong to say the two systems were exactly the same?', 'Their size and chiefs differed', w('TG_SAME_ALL', 'They had no rulers', 'They had the same titles', 'They had no councils'), 'Buganda was one large kingdom and the Nyamwezi had many small chiefdoms.'),
  ], { h: ['Compare each row of the table.', 'Look for what is the same and what is different.'], s1: 'Compare the two systems row by row.' })),
  fam('tg.co.spot', `${TG}TG_COMPARE`, 'spot', 3, spot([
    S('Henry says the Buganda and Nyamwezi systems were exactly the same. Which step has the mistake?', ['Step 1: Henry knows both had rulers.', '!Step 2: He says nothing else differed.', 'Step 3: He writes exactly the same.'], 'Buganda was one large kingdom and the Nyamwezi had many small chiefdoms.', 'TG_SAME_ALL'),
    S('Prisca says the Nyamwezi had no council to advise the Ntemi. Which step has the mistake?', ['Step 1: Prisca knows Buganda had a Lukiiko.', '!Step 2: She says only Buganda had advisers.', 'Step 3: She writes no council.'], 'The Ntemi was advised by a council of elders.', 'TG_NO_COUNCIL'),
    S('Tom says the Kabaka and Ntemi were the same title. Which step has the mistake?', ['Step 1: Tom knows both led their people.', '!Step 2: He says both names mean the same ruler.', 'Step 3: He writes the same title.'], 'The Kabaka ruled Buganda. The Ntemi ruled a Nyamwezi chiefdom.', 'TG_KABAKA'),
    S('Lydia says Buganda had no council. Which step has the mistake?', ['Step 1: Lydia knows the Kabaka was powerful.', '!Step 2: She says a powerful king needs no advisers.', 'Step 3: She writes no council.'], 'Buganda had the Lukiiko, a council that advised the Kabaka.', 'TG_NO_COUNCIL'),
    S('Fred says the Nyamwezi were one large kingdom like Buganda. Which step has the mistake?', ['Step 1: Fred knows Buganda was one large kingdom.', '!Step 2: He says the Nyamwezi were the same.', 'Step 3: He writes one large kingdom.'], 'The Nyamwezi lived in many small chiefdoms.', 'TG_NTEMI_KING'),
  ], { h: ['Which step says the two were the same, or says one had no council?', 'They were alike in some ways and different in others.'], s1: 'Check each step against the two systems.' })),
];
