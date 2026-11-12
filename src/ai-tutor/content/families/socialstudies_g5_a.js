// ============================================================================
// GRADE 5 SOCIAL STUDIES, STRAND 1: NATURAL AND BUILT ENVIRONMENTS (11 skills).
// Maps, Kenya's position, physical features, weather and climate, historic built environments.
// Written offline from the KICD 2024 design through the curriculum map (curriculum/social_studies/g5.json). Map questions are in
// words or a small described table. Every wrong answer names the library misconception it reveals. All stay reviewed:false until
// a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot } from './socialstudies_g5_lib.js';

const EM = 'NATURA.ELEMENTS_OF_A_MAP.', LP = 'NATURA.LOCATION_POSITION_AND_SI.', PF = 'NATURA.MAIN_PHYSICAL_FEATURES_I.', WC = 'NATURA.WEATHER_AND_CLIMATE.', BE = 'NATURA.THE_BUILT_ENVIRONMENTS.';

export const FAMILIES = [
  // ---------------------------------------------------------------- MAP_ELEMENTS
  fam('map.el.which', `${EM}MAP_ELEMENTS`, 'direct', 1, choose([
    ['Which part of a map turns a map distance into a ground distance?', 'The scale', [['The key', 'M_EM_SCALE_KEY'], ['The frame', 'M_EM_FRAME_TITLE'], ['The compass', 'M_EM_COMPASS_ROLE']], 'The scale turns a distance on the map into a distance on the ground.'],
    ['Which part of a map tells you what each symbol means?', 'The key', [['The scale', 'M_EM_SCALE_KEY'], ['The title', 'M_EM_FRAME_TITLE'], ['The compass', 'M_EM_COMPASS_ROLE']], 'The key lists the symbols and says what each one stands for.'],
    ['Which part of a map shows the direction north?', 'The compass', [['The scale', 'M_EM_SCALE_KEY'], ['The key', 'M_EM_SCALE_KEY'], ['The title', 'M_EM_FRAME_TITLE']], 'The compass shows north, south, east and west on the map.'],
    ['Which part of a map tells you what the map is about?', 'The title', [['The frame', 'M_EM_FRAME_TITLE'], ['The scale', 'M_EM_SCALE_KEY'], ['The compass', 'M_EM_COMPASS_ROLE']], 'The title names the map, for example "Map of Kenya".'],
    ['Which part of a map is the line drawn around the edge?', 'The frame', [['The title', 'M_EM_FRAME_TITLE'], ['The key', 'M_EM_SCALE_KEY'], ['The scale', 'M_EM_SCALE_KEY']], 'The frame is the border that holds the whole map.'],
  ], { h: ['Think about the job each part of a map does.', 'Title: name. Frame: border. Scale: distance. Compass: direction. Key: symbols.'], s1: 'A map has five parts: title, frame, scale, compass and key.' })),
  fam('map.el.story', `${EM}MAP_ELEMENTS`, 'word', 2, choose([
    ['Njeri wants to know what a small blue line on her sketch map means. Where should she look?', 'In the key', [['At the scale', 'M_EM_SCALE_KEY'], ['At the frame', 'M_EM_FRAME_TITLE'], ['At the compass', 'M_EM_COMPASS_ROLE']], 'The key explains each colour and symbol used on the map.'],
    ['Otieno must find how far his school is from the market on a map. Which part helps him?', 'The scale', [['The key', 'M_EM_SCALE_KEY'], ['The title', 'M_EM_FRAME_TITLE'], ['The compass', 'M_EM_COMPASS_ROLE']], 'The scale tells how long the real distance is for each centimetre on the map.'],
    ['A teacher asks which way is north on a wall map. The learners look at one part. Which part is it?', 'The compass', [['The key', 'M_EM_SCALE_KEY'], ['The scale', 'M_EM_SCALE_KEY'], ['The frame', 'M_EM_FRAME_TITLE']], 'The compass shows direction, so it shows which way is north.'],
    ['Amina draws a sketch map of her school. She writes "Map of Our School" at the top. What did she add?', 'A title', [['A frame', 'M_EM_FRAME_TITLE'], ['A key', 'M_EM_SCALE_KEY'], ['A scale', 'M_EM_SCALE_KEY']], 'A title tells the reader what the map shows.'],
    ['Baraka draws a neat line round the edge of his map. What is this line called?', 'The frame', [['The title', 'M_EM_FRAME_TITLE'], ['The scale', 'M_EM_SCALE_KEY'], ['The key', 'M_EM_SCALE_KEY']], 'The frame is the border round the map.'],
  ], { h: ['Which part of the map answers the learner\'s question?', 'Direction, distance and symbols each have their own part.'], s1: 'Match what the learner needs with the part of the map that gives it.' })),

  // ---------------------------------------------------------------- MAP_READING
  fam('map.rd.key', `${EM}MAP_READING`, 'table', 1, choose([
    ['A sketch map has this key. What does the symbol "+" stand for on the map?', 'A clinic', [['A church', 'M_EM_SYMBOL_GUESS'], ['A road', 'M_EM_SYMBOL_GUESS'], ['A river', 'M_EM_SYMBOL_GUESS']], 'The key says "+" is a clinic. We always read the key, not guess from the look.',
      { t: { head: ['Symbol', 'Meaning'], rows: [['+', 'Clinic'], ['T', 'Church'], ['Blue line', 'River'], ['Black line', 'Road']] } }],
    ['Look at the key of a school map. What does the blue line stand for?', 'A river', [['A road', 'M_EM_SYMBOL_GUESS'], ['A fence', 'M_EM_SYMBOL_GUESS'], ['A railway', 'M_EM_SYMBOL_GUESS']], 'The key says the blue line is a river.',
      { t: { head: ['Symbol', 'Meaning'], rows: [['Blue line', 'River'], ['Black line', 'Road'], ['Green patch', 'Forest'], ['Red square', 'School']] } }],
    ['In this key, a green patch is used on the map. What does it stand for?', 'A forest', [['A lake', 'M_EM_SYMBOL_GUESS'], ['A market', 'M_EM_SYMBOL_GUESS'], ['A town', 'M_EM_SYMBOL_GUESS']], 'The key shows the green patch is a forest.',
      { t: { head: ['Symbol', 'Meaning'], rows: [['Green patch', 'Forest'], ['Blue patch', 'Lake'], ['Red square', 'School'], ['Black dot', 'Market']] } }],
    ['A map of a village uses a triangle for a church. Which sentence is right?', 'The triangle stands for a church', [['The triangle stands for a tent', 'M_EM_SYMBOL_GUESS'], ['The triangle stands for a hill', 'M_EM_SYMBOL_GUESS'], ['The triangle stands for a school', 'M_EM_SYMBOL_GUESS']], 'The key decides what a symbol means, not how it looks.'],
    ['The key of a map shows a black dot for a market. What does the black dot stand for?', 'A market', [['A school', 'M_EM_SYMBOL_GUESS'], ['A well', 'M_EM_SYMBOL_GUESS'], ['A farm', 'M_EM_SYMBOL_GUESS']], 'The key says a black dot is a market.',
      { t: { head: ['Symbol', 'Meaning'], rows: [['Black dot', 'Market'], ['Red square', 'School'], ['Blue line', 'River'], ['Green patch', 'Forest']] } }],
  ], { h: ['Read the key. It says what each symbol means.', 'Do not guess a symbol from how it looks.'], s1: 'Find the symbol in the key and read its meaning.' })),
  fam('map.rd.scale', `${EM}MAP_READING`, 'word', 2, choose([
    ['A map says 1 cm stands for 10 km. Two towns are 4 cm apart. How far apart are they on the ground?', '40 km', [['4 km', 'M_EM_SCALE_IGNORE'], ['14 km', 'M_EM_SCALE_IGNORE'], ['400 km', 'M_EM_SCALE_IGNORE']], 'Each centimetre is 10 km, so 4 cm is 4 times 10 km, which is 40 km.'],
    ['On a map, 1 cm stands for 5 km. A learner measures 6 cm between two schools. How far apart are the schools on the ground?', '30 km', [['6 km', 'M_EM_SCALE_IGNORE'], ['11 km', 'M_EM_SCALE_IGNORE'], ['300 km', 'M_EM_SCALE_IGNORE']], '6 cm times 5 km is 30 km.'],
    ['The scale of a map says 1 cm stands for 20 km. The distance on the map from Nairobi to Nakuru is 3 cm. What is the distance on the ground?', '60 km', [['3 km', 'M_EM_SCALE_IGNORE'], ['23 km', 'M_EM_SCALE_IGNORE'], ['600 km', 'M_EM_SCALE_IGNORE']], '3 cm times 20 km is 60 km.'],
    ['A map has the scale 1 cm to 2 km. Achieng\'s home is 7 cm from the river on the map. How far is it on the ground?', '14 km', [['7 km', 'M_EM_SCALE_IGNORE'], ['9 km', 'M_EM_SCALE_IGNORE'], ['140 km', 'M_EM_SCALE_IGNORE']], '7 cm times 2 km is 14 km.'],
    ['On a map of Kenya, 1 cm stands for 50 km. Two lakes are 5 cm apart. How far apart are the lakes on the ground?', '250 km', [['5 km', 'M_EM_SCALE_IGNORE'], ['55 km', 'M_EM_SCALE_IGNORE'], ['2,500 km', 'M_EM_SCALE_IGNORE']], '5 cm times 50 km is 250 km.'],
  ], { h: ['Find how many kilometres 1 cm stands for.', 'Multiply the centimetres on the map by that number.'], s1: 'Use the scale: ground distance is map distance times the scale.' })),

  // ---------------------------------------------------------------- NEIGHBOURS
  fam('nb.which', `${LP}NEIGHBOURS`, 'direct', 1, choose([
    ['Which country shares a border with Kenya?', 'Uganda', [['Rwanda', 'M_LP_NEAR_NOT_BORDER'], ['Zambia', 'M_LP_NEAR_NOT_BORDER'], ['Burundi', 'M_LP_NEAR_NOT_BORDER']], 'Uganda lies on the western border of Kenya. Rwanda, Zambia and Burundi do not touch Kenya.'],
    ['Which country is a neighbour of Kenya in the north?', 'Ethiopia', [['Rwanda', 'M_LP_NEAR_NOT_BORDER'], ['Burundi', 'M_LP_NEAR_NOT_BORDER'], ['The Indian Ocean', 'M_LP_OCEAN_AS_COUNTRY']], 'Ethiopia shares the northern border with Kenya.'],
    ['Which country borders Kenya to the south?', 'Tanzania', [['Zambia', 'M_LP_NEAR_NOT_BORDER'], ['Rwanda', 'M_LP_NEAR_NOT_BORDER'], ['The Indian Ocean', 'M_LP_OCEAN_AS_COUNTRY']], 'Tanzania lies to the south of Kenya.'],
    ['Which one of these is a country that shares a border with Kenya?', 'Somalia', [['The Indian Ocean', 'M_LP_OCEAN_AS_COUNTRY'], ['Burundi', 'M_LP_NEAR_NOT_BORDER'], ['Zambia', 'M_LP_NEAR_NOT_BORDER']], 'Somalia is on the east side of Kenya. The ocean is water, not a country.'],
    ['Which country lies to the north-west of Kenya and shares a border?', 'South Sudan', [['Rwanda', 'M_LP_NEAR_NOT_BORDER'], ['The Indian Ocean', 'M_LP_OCEAN_AS_COUNTRY'], ['Burundi', 'M_LP_NEAR_NOT_BORDER']], 'South Sudan is Kenya\'s north-western neighbour.'],
  ], { h: ['Kenya has five neighbours on land: Ethiopia, South Sudan, Uganda, Tanzania and Somalia.', 'The Indian Ocean is water, not a country.'], s1: 'Check whether the country touches Kenya at a border line.' })),
  fam('nb.list', `${LP}NEIGHBOURS`, 'word', 2, choose([
    ['Zawadi lists the countries that share a border with Kenya. Whose list is right?', 'Ethiopia, Uganda, Tanzania, Somalia, South Sudan', [['Ethiopia, Uganda, Rwanda, Somalia, South Sudan', 'M_LP_NEAR_NOT_BORDER'], ['Ethiopia, Uganda, Tanzania, Somalia, Zambia', 'M_LP_NEAR_NOT_BORDER'], ['Ethiopia, Indian Ocean, Tanzania, Somalia, South Sudan', 'M_LP_OCEAN_AS_COUNTRY']], 'The five countries are Ethiopia, South Sudan, Uganda, Tanzania and Somalia.'],
    ['A class makes a poster of Kenya\'s neighbours. Which list should they put on the poster?', 'Uganda, Tanzania, Somalia, Ethiopia, South Sudan', [['Uganda, Tanzania, Rwanda, Ethiopia, Burundi', 'M_LP_NEAR_NOT_BORDER'], ['Uganda, Zambia, Somalia, Ethiopia, South Sudan', 'M_LP_NEAR_NOT_BORDER'], ['Uganda, Tanzania, Somalia, Indian Ocean, Ethiopia', 'M_LP_OCEAN_AS_COUNTRY']], 'Only these five touch Kenya\'s land border.'],
    ['Which is a country that is in East Africa but does not share a border with Kenya?', 'Rwanda', [['Uganda', 'M_LP_NEAR_NOT_BORDER'], ['Tanzania', 'M_LP_NEAR_NOT_BORDER'], ['Somalia', 'M_LP_NEAR_NOT_BORDER']], 'Rwanda is in East Africa, but Uganda and Tanzania lie between it and Kenya.'],
    ['Halima counts four countries that touch Kenya. Which country did she leave out? She named Uganda, Tanzania, Ethiopia and Somalia.', 'South Sudan', [['Rwanda', 'M_LP_NEAR_NOT_BORDER'], ['Burundi', 'M_LP_NEAR_NOT_BORDER'], ['The Indian Ocean', 'M_LP_OCEAN_AS_COUNTRY']], 'South Sudan is the fifth neighbour, in the north-west.'],
    ['A learner says the Indian Ocean is a neighbour of Kenya. What should the teacher say?', 'It is water along the coast, not a country', [['It is a country in the east', 'M_LP_OCEAN_AS_COUNTRY'], ['It is a country in the south', 'M_LP_OCEAN_AS_COUNTRY'], ['It is a country in the north', 'M_LP_OCEAN_AS_COUNTRY']], 'The Indian Ocean is the water that touches the south-east coast. It has no government.'],
  ], { h: ['Which countries touch Kenya at a border line on land?', 'Rwanda, Burundi and Zambia are near, but do not touch Kenya.'], s1: 'Count only countries that share a border with Kenya.' })),

  // ---------------------------------------------------------------- NEIGHBOUR_DIRECTIONS
  fam('nd.which', `${LP}NEIGHBOUR_DIRECTIONS`, 'direct', 1, choose([
    ['In which direction from Kenya does Uganda lie?', 'West', [['East', 'M_LP_EAST_WEST_SWAP'], ['North', 'M_LP_NORTH_SOUTH_SWAP'], ['South', 'M_LP_NORTH_SOUTH_SWAP']], 'Uganda lies to the west of Kenya.'],
    ['In which direction from Kenya does Somalia lie?', 'East', [['West', 'M_LP_EAST_WEST_SWAP'], ['North', 'M_LP_NORTH_SOUTH_SWAP'], ['South', 'M_LP_NORTH_SOUTH_SWAP']], 'Somalia is east of Kenya.'],
    ['In which direction from Kenya does Tanzania lie?', 'South', [['North', 'M_LP_NORTH_SOUTH_SWAP'], ['East', 'M_LP_EAST_WEST_SWAP'], ['West', 'M_LP_EAST_WEST_SWAP']], 'Tanzania lies south of Kenya.'],
    ['In which direction from Kenya does Ethiopia lie?', 'North', [['South', 'M_LP_NORTH_SOUTH_SWAP'], ['West', 'M_LP_EAST_WEST_SWAP'], ['East', 'M_LP_EAST_WEST_SWAP']], 'Ethiopia lies north of Kenya.'],
    ['Kenya\'s coast is on the Indian Ocean. In which direction from Kenya does the ocean lie?', 'South-east', [['North-west', 'M_LP_EAST_WEST_SWAP'], ['North-east', 'M_LP_NORTH_SOUTH_SWAP'], ['South-west', 'M_LP_EAST_WEST_SWAP']], 'The Indian Ocean lies to the south-east of Kenya.'],
  ], { h: ['Think of a map of Kenya with north at the top.', 'The Indian Ocean is on the east side. Lake Victoria is on the west side.'], s1: 'Place Kenya in the middle and find the neighbour on the map.' })),
  fam('nd.turn', `${LP}NEIGHBOUR_DIRECTIONS`, 'word', 2, choose([
    ['Uganda is to the west of Kenya. Which way must you go from Uganda to reach Kenya?', 'East', [['West', 'M_LP_EAST_WEST_SWAP'], ['North', 'M_LP_NORTH_SOUTH_SWAP'], ['South', 'M_LP_NORTH_SOUTH_SWAP']], 'If Uganda is west of Kenya, then Kenya is east of Uganda.'],
    ['Tanzania is to the south of Kenya. Which way must you go from Tanzania to reach Kenya?', 'North', [['South', 'M_LP_NORTH_SOUTH_SWAP'], ['East', 'M_LP_EAST_WEST_SWAP'], ['West', 'M_LP_EAST_WEST_SWAP']], 'If Tanzania is south of Kenya, then Kenya is north of Tanzania.'],
    ['Amina travels from Kenya to Ethiopia by road. Which way does she go?', 'North', [['South', 'M_LP_NORTH_SOUTH_SWAP'], ['East', 'M_LP_EAST_WEST_SWAP'], ['West', 'M_LP_EAST_WEST_SWAP']], 'Ethiopia is north of Kenya, so she travels north.'],
    ['Mutua crosses the border from Busia into Uganda. Which way is he going?', 'West', [['East', 'M_LP_EAST_WEST_SWAP'], ['South', 'M_LP_NORTH_SOUTH_SWAP'], ['North', 'M_LP_NORTH_SOUTH_SWAP']], 'Uganda lies west of Kenya, so he travels west.'],
    ['Wanjiru drives from Namanga in Kenya to Arusha in Tanzania. Which way does she drive?', 'South', [['North', 'M_LP_NORTH_SOUTH_SWAP'], ['East', 'M_LP_EAST_WEST_SWAP'], ['West', 'M_LP_EAST_WEST_SWAP']], 'Tanzania is south of Kenya, so she travels south.'],
  ], { h: ['Opposite directions: north and south, east and west.', 'Draw Kenya and the neighbour, then turn the arrow round.'], s1: 'Find the direction, then turn it round if the question asks for the other country.' })),

  // ---------------------------------------------------------------- FEATURE_NAMES
  fam('pf.type', `${PF}FEATURE_NAMES`, 'direct', 1, choose([
    ['What kind of feature is Lake Turkana?', 'A lake', [['A river', 'M_PF_TYPE_MIX'], ['A mountain', 'M_PF_TYPE_MIX'], ['A valley', 'M_PF_TYPE_MIX']], 'Lake Turkana is a large body of water with land around it.'],
    ['What kind of feature is the Tana River?', 'A river', [['A lake', 'M_PF_TYPE_MIX'], ['A mountain', 'M_PF_TYPE_MIX'], ['An ocean', 'M_PF_TYPE_MIX']], 'The Tana is a river that flows to the Indian Ocean.'],
    ['What kind of feature is Mount Elgon?', 'A mountain', [['A lake', 'M_PF_TYPE_MIX'], ['A valley', 'M_PF_TYPE_MIX'], ['A river', 'M_PF_TYPE_MIX']], 'Mount Elgon is a mountain on the border with Uganda.'],
    ['Which is the highest mountain in Kenya?', 'Mount Kenya', [['Mount Kilimanjaro', 'M_PF_KILIMANJARO'], ['Mount Elgon', 'M_PF_KILIMANJARO'], ['The Aberdare Range', 'M_PF_KILIMANJARO']], 'Mount Kenya is the highest in Kenya. Mount Kilimanjaro is in Tanzania.'],
    ['Which of these is a lake in Kenya?', 'Lake Naivasha', [['Tana', 'M_PF_TYPE_MIX'], ['Aberdare', 'M_PF_TYPE_MIX'], ['Elgon', 'M_PF_TYPE_MIX']], 'Lake Naivasha is in the Rift Valley. The Tana is a river, and the Aberdare and Elgon are mountains.'],
  ], { h: ['Think about whether the water stands still or flows.', 'Lakes hold water, rivers flow, mountains are high ground.'], s1: 'Find what kind of feature the name tells you.' })),
  fam('pf.spot', `${PF}FEATURE_NAMES`, 'spot', 3, spot([
    ['Juma says Mount Kilimanjaro is the highest mountain in Kenya. Which step has the mistake?', [['Step 1: Juma has seen Kilimanjaro from Amboseli.', true], ['Step 2: He decides the mountain must be inside Kenya.', false], ['Step 3: He writes that it is the highest in Kenya.', true]], 'Mount Kilimanjaro stands in Tanzania. Mount Kenya, at 5,199 metres, is Kenya\'s highest mountain.', 'M_PF_KILIMANJARO'],
    ['Chebet says Lake Turkana is a river. Which step has the mistake?', [['Step 1: Chebet reads the name Lake Turkana.', true], ['Step 2: She decides that all water in Kenya flows.', false], ['Step 3: She writes that it is a river.', true]], 'A lake is water with land all round it. Lake Turkana is a lake, not a river.', 'M_PF_TYPE_MIX'],
    ['Otieno says the Tana is a lake because it has much water. Which step has the mistake?', [['Step 1: Otieno sees that the Tana has a lot of water.', true], ['Step 2: He decides that a lot of water means a lake.', false], ['Step 3: He writes that the Tana is a lake.', true]], 'The Tana flows in a line to the Indian Ocean, so it is a river.', 'M_PF_TYPE_MIX'],
    ['Wanjiru says Mount Elgon is a lake. Which step has the mistake?', [['Step 1: Wanjiru finds Mount Elgon on the map.', true], ['Step 2: She decides every Kenyan feature with a name is a lake.', false], ['Step 3: She writes that it is a lake.', true]], 'The word "Mount" tells us it is a mountain. Lakes have the word "Lake".', 'M_PF_TYPE_MIX'],
  ], { h: ['Which step says something that is not true?', 'Use the word in the name: Lake, River or Mount.'], s1: 'Check each step against what you know about Kenya\'s features.' })),

  // ---------------------------------------------------------------- FEATURE_WHERE
  fam('pw.where', `${PF}FEATURE_WHERE`, 'direct', 1, choose([
    ['In which part of Kenya is Lake Victoria?', 'The west', [['The east', 'M_PF_REGION_MIX'], ['The north-east', 'M_PF_REGION_MIX'], ['The south-east', 'M_PF_REGION_MIX']], 'Lake Victoria lies in the west, shared with Uganda and Tanzania.'],
    ['In which part of Kenya is Lake Turkana?', 'The north-west', [['The south', 'M_PF_REGION_MIX'], ['The south-east', 'M_PF_REGION_MIX'], ['The centre', 'M_PF_REGION_MIX']], 'Lake Turkana is in the dry north-west.'],
    ['Where is Mount Kenya?', 'In the central highlands', [['On the coast', 'M_PF_REGION_MIX'], ['In the far west', 'M_PF_REGION_MIX'], ['In the north-east', 'M_PF_REGION_MIX']], 'Mount Kenya stands in the central highlands, on the equator.'],
    ['Where is the Indian Ocean coast of Kenya?', 'In the south-east', [['In the west', 'M_PF_REGION_MIX'], ['In the north-west', 'M_PF_REGION_MIX'], ['In the centre', 'M_PF_REGION_MIX']], 'The coast is in the south-east, along the Indian Ocean.'],
    ['In which direction does the Great Rift Valley run through Kenya?', 'North to south', [['East to west', 'M_PF_RIFT_DIRECTION'], ['Along the coast', 'M_PF_RIFT_DIRECTION'], ['South-east to north-west', 'M_PF_RIFT_DIRECTION']], 'The Rift Valley runs north to south, from Lake Turkana towards Lake Magadi.'],
  ], { h: ['Link each feature to a neighbour or a side of Kenya.', 'Lake Victoria is next to Uganda. The ocean is on the east side.'], s1: 'Picture a map of Kenya and find the feature.' })),
  fam('pw.table', `${PF}FEATURE_WHERE`, 'table', 2, choose([
    ['Read the table of places in Kenya. Which feature is in the central highlands?', 'Mount Kenya', [['Lake Victoria', 'M_PF_REGION_MIX'], ['Lake Turkana', 'M_PF_REGION_MIX'], ['The Indian Ocean', 'M_PF_REGION_MIX']], 'Mount Kenya is in the central highlands.',
      { t: { head: ['Feature', 'Part of Kenya'], rows: [['Mount Kenya', 'Central highlands'], ['Lake Victoria', 'West'], ['Lake Turkana', 'North-west'], ['Indian Ocean', 'South-east coast']] } }],
    ['The table lists four features of Kenya. Which one lies on the coast?', 'The Indian Ocean', [['Mount Elgon', 'M_PF_REGION_MIX'], ['Lake Victoria', 'M_PF_REGION_MIX'], ['Mount Kenya', 'M_PF_REGION_MIX']], 'The Indian Ocean touches the south-east coast.',
      { t: { head: ['Feature', 'Part of Kenya'], rows: [['Mount Elgon', 'West, on the Uganda border'], ['Lake Victoria', 'West'], ['Mount Kenya', 'Central highlands'], ['Indian Ocean', 'South-east coast']] } }],
    ['A learner records where she saw features on a map. Which feature is in the north-west?', 'Lake Turkana', [['Lake Victoria', 'M_PF_REGION_MIX'], ['Mount Kenya', 'M_PF_REGION_MIX'], ['The Indian Ocean', 'M_PF_REGION_MIX']], 'Lake Turkana is in the north-west, in a dry area.',
      { t: { head: ['Feature', 'Part of Kenya'], rows: [['Lake Turkana', 'North-west'], ['Lake Victoria', 'West'], ['Mount Kenya', 'Central highlands'], ['Indian Ocean', 'South-east coast']] } }],
    ['The table names four features. Which one is a lake on the western border?', 'Lake Victoria', [['Lake Turkana', 'M_PF_REGION_MIX'], ['Mount Kenya', 'M_PF_REGION_MIX'], ['Mount Elgon', 'M_PF_REGION_MIX']], 'Lake Victoria is in the west of Kenya.',
      { t: { head: ['Feature', 'Kind', 'Part of Kenya'], rows: [['Lake Victoria', 'Lake', 'West'], ['Lake Turkana', 'Lake', 'North-west'], ['Mount Kenya', 'Mountain', 'Central highlands'], ['Mount Elgon', 'Mountain', 'West, on the Uganda border']] } }],
    ['The Rift Valley runs through many Kenyan lakes. Which lake in the table is on the Rift Valley floor in the south?', 'Lake Magadi', [['Lake Victoria', 'M_PF_RIFT_DIRECTION'], ['Lake Turkana', 'M_PF_REGION_MIX'], ['Lake Naivasha', 'M_PF_REGION_MIX']], 'Lake Magadi lies in the southern Rift Valley near the Tanzania border.',
      { t: { head: ['Lake', 'Part of the Rift Valley'], rows: [['Lake Turkana', 'North'], ['Lake Naivasha', 'Middle'], ['Lake Magadi', 'South'], ['Lake Victoria', 'Outside the Rift Valley, in the west']] } }],
  ], { h: ['Read the row that has the part of Kenya in the question.', 'Check the second column of the table.'], s1: 'Read each row of the table.' })),

  // ---------------------------------------------------------------- WEATHER_ELEMENTS
  fam('we.inst', `${WC}WEATHER_ELEMENTS`, 'direct', 1, choose([
    ['Which instrument measures the amount of rain that falls?', 'A rain gauge', [['A thermometer', 'M_WC_INSTRUMENT_MIX'], ['A wind vane', 'M_WC_INSTRUMENT_MIX'], ['A compass', 'M_WC_INSTRUMENT_MIX']], 'A rain gauge collects rain so we can measure it.'],
    ['Which instrument measures temperature?', 'A thermometer', [['A rain gauge', 'M_WC_INSTRUMENT_MIX'], ['A wind vane', 'M_WC_INSTRUMENT_MIX'], ['A ruler', 'M_WC_INSTRUMENT_MIX']], 'A thermometer shows how hot or cold the air is.'],
    ['Which instrument shows the direction the wind is blowing from?', 'A wind vane', [['A thermometer', 'M_WC_INSTRUMENT_MIX'], ['A rain gauge', 'M_WC_INSTRUMENT_MIX'], ['A clock', 'M_WC_INSTRUMENT_MIX']], 'A wind vane points to where the wind is coming from.'],
    ['Which of these is an element of weather?', 'Rainfall', [['Soil', 'M_WC_INSTRUMENT_MIX'], ['Rocks', 'M_WC_INSTRUMENT_MIX'], ['Rivers', 'M_WC_INSTRUMENT_MIX']], 'Rainfall, temperature, wind, cloud cover and sunshine are elements of weather.'],
    ['Which element of weather is measured in degrees Celsius?', 'Temperature', [['Rainfall', 'M_WC_INSTRUMENT_MIX'], ['Wind', 'M_WC_INSTRUMENT_MIX'], ['Cloud cover', 'M_WC_INSTRUMENT_MIX']], 'Temperature is measured in degrees Celsius with a thermometer.'],
  ], { h: ['Think about what each instrument is built to measure.', 'Rain gauge: rain. Thermometer: temperature. Wind vane: wind direction.'], s1: 'Match each instrument to the element it measures.' })),
  fam('we.wc', `${WC}WEATHER_ELEMENTS`, 'why', 2, choose([
    ['Which statement is about weather and not climate?', 'It rained in Kisumu this morning.', [['Mombasa is hot and humid for most of the year.', 'M_WC_WEATHER_CLIMATE'], ['Turkana gets little rain every year.', 'M_WC_WEATHER_CLIMATE'], ['Nyeri is cool for most of the year.', 'M_WC_WEATHER_CLIMATE']], 'Weather is the condition of one day or one moment. This morning\'s rain is weather.'],
    ['Which statement is about climate?', 'Lodwar is hot and dry all year.', [['It is windy in Lodwar today.', 'M_WC_WEATHER_CLIMATE'], ['It is cloudy in Nyeri now.', 'M_WC_WEATHER_CLIMATE'], ['It rained in Mombasa last night.', 'M_WC_WEATHER_CLIMATE']], 'Climate is the usual pattern over many years. Being hot and dry all year is climate.'],
    ['Wanjiru says it is a sunny day. Is she talking about weather or climate?', 'Weather', [['Climate', 'M_WC_WEATHER_CLIMATE'], ['Both', 'M_WC_WEATHER_CLIMATE'], ['Neither', 'M_WC_WEATHER_CLIMATE']], 'A sunny day is weather. It is the condition of one day.'],
    ['A farmer in Kericho says the area has rain nearly every month. Is he talking about weather or climate?', 'Climate', [['Weather', 'M_WC_WEATHER_CLIMATE'], ['Both', 'M_WC_WEATHER_CLIMATE'], ['Neither', 'M_WC_WEATHER_CLIMATE']], 'Rain nearly every month is a long-term pattern, so it is climate.'],
    ['How long do we record the weather of a place before we can describe its climate?', 'Many years', [['One day', 'M_WC_WEATHER_CLIMATE'], ['One hour', 'M_WC_WEATHER_CLIMATE'], ['One week', 'M_WC_WEATHER_CLIMATE']], 'Climate comes from weather records of many years, not a short time.'],
  ], { h: ['Weather is for a short time. Climate is for a long time.', 'Ask how long the statement covers: a day or many years.'], s1: 'Decide whether the statement covers a short time or many years.' })),

  // ---------------------------------------------------------------- CLIMATE_REGION_PLACES
  fam('cp.where', `${WC}CLIMATE_REGION_PLACES`, 'direct', 1, choose([
    ['Which part of Kenya has an arid climate with very little rain?', 'The north, around Turkana', [['The Mount Kenya area', 'M_WC_REGION_MIX'], ['The Lake Victoria area', 'M_WC_REGION_MIX'], ['The coast around Mombasa', 'M_WC_COAST_DRY']], 'The north is arid, with very little rain.'],
    ['Which place has a hot, humid climate with plenty of rain?', 'Mombasa on the coast', [['Lodwar in the north-west', 'M_WC_COAST_DRY'], ['Wajir in the north-east', 'M_WC_COAST_DRY'], ['Nyeri in the highlands', 'M_WC_REGION_MIX']], 'Mombasa is hot and humid.'],
    ['Which place has a cool climate because it is high up?', 'Nyeri near Mount Kenya', [['Mombasa on the coast', 'M_WC_REGION_MIX'], ['Lodwar in the north-west', 'M_WC_REGION_MIX'], ['Mandera in the north-east', 'M_WC_REGION_MIX']], 'The highlands near Mount Kenya are high and cool.'],
    ['Which area is warm with rain through most of the year?', 'Around Lake Victoria', [['Marsabit', 'M_WC_REGION_MIX'], ['Turkana', 'M_WC_REGION_MIX'], ['Wajir', 'M_WC_REGION_MIX']], 'The Lake Victoria area is warm and gets rain in most months.'],
    ['In which part of Kenya is the climate hot and dry, with little rain?', 'The north-east, around Mandera', [['The central highlands', 'M_WC_REGION_MIX'], ['The Lake Victoria basin', 'M_WC_REGION_MIX'], ['The coast', 'M_WC_COAST_DRY']], 'Mandera and Wajir in the north-east are arid.'],
  ], { h: ['The north and east are dry. The coast is humid. The highlands are cool.', 'High places are cool, even near the equator.'], s1: 'Match the climate to the part of Kenya.' })),
  fam('cp.table', `${WC}CLIMATE_REGION_PLACES`, 'table', 2, choose([
    ['A table shows rain in four towns. Which town is in the arid north?', 'Lodwar', [['Mombasa', 'M_WC_COAST_DRY'], ['Nyeri', 'M_WC_REGION_MIX'], ['Kisumu', 'M_WC_REGION_MIX']], 'Lodwar has the least rain. It is in the arid north-west.',
      { t: { head: ['Town', 'Rain in a year'], rows: [['Lodwar', 'Very little'], ['Mombasa', 'Plenty'], ['Nyeri', 'Plenty'], ['Kisumu', 'Plenty']] } }],
    ['Look at the table of towns. Which town is cool and high up?', 'Nyeri', [['Mombasa', 'M_WC_REGION_MIX'], ['Lodwar', 'M_WC_REGION_MIX'], ['Wajir', 'M_WC_REGION_MIX']], 'Nyeri is in the highlands, so it is cool.',
      { t: { head: ['Town', 'Temperature'], rows: [['Nyeri', 'Cool'], ['Mombasa', 'Hot'], ['Lodwar', 'Very hot'], ['Wajir', 'Very hot']] } }],
    ['The table gives facts about four places. Which place is hot and humid?', 'Mombasa', [['Lodwar', 'M_WC_COAST_DRY'], ['Nyeri', 'M_WC_REGION_MIX'], ['Wajir', 'M_WC_COAST_DRY']], 'Mombasa is hot with moist air.',
      { t: { head: ['Place', 'Air'], rows: [['Mombasa', 'Hot and damp'], ['Lodwar', 'Hot and dry'], ['Nyeri', 'Cool and fresh'], ['Wajir', 'Hot and dry']] } }],
    ['The table lists the climate of four areas. Which area is around Lake Victoria?', 'Area C', [['Area A', 'M_WC_REGION_MIX'], ['Area B', 'M_WC_REGION_MIX'], ['Area D', 'M_WC_REGION_MIX']], 'Area C is warm with rain in most months, like the Lake Victoria area.',
      { t: { head: ['Area', 'Climate'], rows: [['Area A', 'Hot and dry, very little rain'], ['Area B', 'Cool, high up'], ['Area C', 'Warm, rain in most months'], ['Area D', 'Hot and damp, on the coast']] } }],
    ['Which town in the table is in the dry north-east?', 'Mandera', [['Mombasa', 'M_WC_COAST_DRY'], ['Kericho', 'M_WC_REGION_MIX'], ['Kisumu', 'M_WC_REGION_MIX']], 'Mandera is in the north-east, where rain is very little.',
      { t: { head: ['Town', 'Rain'], rows: [['Mandera', 'Very little'], ['Kericho', 'Plenty, most of the year'], ['Kisumu', 'Plenty'], ['Mombasa', 'Plenty']] } }],
  ], { h: ['Read the row with the clue in the question.', 'Little rain means arid. Cool means high up.'], s1: 'Read each row of the table.' })),

  // ---------------------------------------------------------------- CLIMATE_REGION_TRAITS
  fam('ct.trait', `${WC}CLIMATE_REGION_TRAITS`, 'direct', 1, choose([
    ['Which description fits the climate of the coast?', 'Hot and humid with plenty of rain', [['Hot and dry with little rain', 'M_WC_COAST_DRY'], ['Cool with frost at night', 'M_WC_EQUATOR_HOT'], ['Cold all year', 'M_WC_EQUATOR_HOT']], 'The coast is hot and humid.'],
    ['Which description fits the arid north of Kenya?', 'Hot with very little rain', [['Cool with plenty of rain', 'M_WC_HUMID_DRY'], ['Hot and damp all year', 'M_WC_HUMID_DRY'], ['Cold and wet', 'M_WC_EQUATOR_HOT']], 'The north is hot and dry.'],
    ['Which description fits the highlands around Mount Kenya?', 'Cool with reliable rain', [['Very hot and dry', 'M_WC_EQUATOR_HOT'], ['Hot and humid', 'M_WC_HUMID_DRY'], ['Hot with no rain', 'M_WC_EQUATOR_HOT']], 'The highlands are cool, with reliable rain.'],
    ['What does it mean when the air at the coast is humid?', 'It has a lot of water vapour', [['It is very dry', 'M_WC_HUMID_DRY'], ['It is very cold', 'M_WC_HUMID_DRY'], ['It has no wind', 'M_WC_HUMID_DRY']], 'Humid means a lot of water vapour in the air.'],
    ['Which description fits the Lake Victoria area?', 'Warm with rain in most months', [['Very dry all year', 'M_WC_HUMID_DRY'], ['Cold with snow', 'M_WC_EQUATOR_HOT'], ['Hot with almost no rain', 'M_WC_HUMID_DRY']], 'The Lake Victoria area is warm and gets rain in most months.'],
  ], { h: ['Think about the temperature and the rainfall of each region.', 'Humid means damp air.'], s1: 'Match the description to the region.' })),
  fam('ct.why', `${WC}CLIMATE_REGION_TRAITS`, 'why', 2, choose([
    ['Mount Kenya is on the equator but has snow at the top. Why is it cold there?', 'The air gets cooler as you go higher', [['It is not really on the equator', 'M_WC_EQUATOR_HOT'], ['The sun does not shine there', 'M_WC_EQUATOR_HOT'], ['It is near the sea', 'M_WC_EQUATOR_HOT']], 'Air gets cooler with height, even on the equator.'],
    ['Nyeri is high up. Why is it cooler than Mombasa on the coast?', 'High places have cooler air', [['Nyeri is nearer the sea', 'M_WC_EQUATOR_HOT'], ['Nyeri is far from the equator', 'M_WC_EQUATOR_HOT'], ['Nyeri has no sun', 'M_WC_EQUATOR_HOT']], 'Nyeri is high above sea level, so the air is cooler.'],
    ['Njeri says the coast feels sticky because the air is humid. What does humid mean?', 'The air holds a lot of water vapour', [['The air is very dry', 'M_WC_HUMID_DRY'], ['The wind is strong', 'M_WC_HUMID_DRY'], ['The air is cold', 'M_WC_HUMID_DRY']], 'Humid air holds a lot of water vapour, so it feels damp and sticky.'],
    ['Why can farmers near Mount Kenya grow crops that need steady rain?', 'The highlands get reliable rain', [['The highlands are very dry', 'M_WC_HUMID_DRY'], ['The highlands are hot all year', 'M_WC_EQUATOR_HOT'], ['The highlands get no wind', 'M_WC_HUMID_DRY']], 'The highlands have reliable rain, which suits many crops.'],
    ['Why is farming hard in Turkana?', 'There is very little rain', [['There is too much rain', 'M_WC_HUMID_DRY'], ['The air is very cold', 'M_WC_EQUATOR_HOT'], ['It is humid all year', 'M_WC_HUMID_DRY']], 'Turkana is arid, so crops lack water.'],
  ], { h: ['Think about height, rain and heat.', 'The higher you go, the cooler the air.'], s1: 'Think of what makes the place hot, cool, wet or dry.' })),

  // ---------------------------------------------------------------- HISTORIC_SITES
  fam('hs.which', `${BE}HISTORIC_SITES`, 'direct', 1, choose([
    ['Which of these is a historic built environment in Kenya?', 'Fort Jesus', [['Mount Kenya', 'M_BE_NATURAL_AS_BUILT'], ['Lake Victoria', 'M_BE_NATURAL_AS_BUILT'], ['The Tana River', 'M_BE_NATURAL_AS_BUILT']], 'Fort Jesus was built by people long ago. The others were made by nature.'],
    ['In which town is Fort Jesus?', 'Mombasa', [['Lamu', 'M_BE_PLACE_MIX'], ['Kisumu', 'M_BE_PLACE_MIX'], ['Nairobi', 'M_BE_PLACE_MIX']], 'Fort Jesus is in Mombasa, built by the Portuguese.'],
    ['Which historic site is an old town on an island, with houses of coral stone?', 'Lamu Old Town', [['Fort Jesus', 'M_BE_PLACE_MIX'], ['Gedi Ruins', 'M_BE_PLACE_MIX'], ['Nairobi National Museum', 'M_BE_PLACE_MIX']], 'Lamu Old Town is on Lamu Island.'],
    ['Which historic site is a ruined Swahili town in the forest near Malindi?', 'The Gedi Ruins', [['Fort Jesus', 'M_BE_PLACE_MIX'], ['Lamu Old Town', 'M_BE_PLACE_MIX'], ['Mount Elgon', 'M_BE_NATURAL_AS_BUILT']], 'The Gedi Ruins are the remains of a Swahili town near Malindi.'],
    ['Which of these is a built historic site and not a natural feature?', 'Thimlich Ohinga', [['Lake Turkana', 'M_BE_NATURAL_AS_BUILT'], ['Mount Elgon', 'M_BE_NATURAL_AS_BUILT'], ['The Aberdare Range', 'M_BE_NATURAL_AS_BUILT']], 'Thimlich Ohinga in Migori is an old stone enclosure built by people.'],
  ], { h: ['Was it built by people, or made by nature?', 'Fort Jesus, Lamu, Gedi and Thimlich Ohinga were built by people.'], s1: 'Decide whether people built it long ago.' })),
  fam('hs.table', `${BE}HISTORIC_SITES`, 'table', 2, choose([
    ['Read the table of historic sites. Which site is in Migori County?', 'Thimlich Ohinga', [['Fort Jesus', 'M_BE_PLACE_MIX'], ['Gedi Ruins', 'M_BE_PLACE_MIX'], ['Lamu Old Town', 'M_BE_PLACE_MIX']], 'Thimlich Ohinga is in Migori.',
      { t: { head: ['Site', 'Place'], rows: [['Fort Jesus', 'Mombasa'], ['Lamu Old Town', 'Lamu Island'], ['Gedi Ruins', 'Near Malindi'], ['Thimlich Ohinga', 'Migori']] } }],
    ['Which site in the table is found in Mombasa?', 'Fort Jesus', [['Lamu Old Town', 'M_BE_PLACE_MIX'], ['Thimlich Ohinga', 'M_BE_PLACE_MIX'], ['Gedi Ruins', 'M_BE_PLACE_MIX']], 'Fort Jesus is in Mombasa.',
      { t: { head: ['Site', 'Place'], rows: [['Fort Jesus', 'Mombasa'], ['Lamu Old Town', 'Lamu Island'], ['Gedi Ruins', 'Near Malindi'], ['Thimlich Ohinga', 'Migori']] } }],
    ['The table shows four places. Which one is a historic built environment?', 'Place C', [['Place A', 'M_BE_NATURAL_AS_BUILT'], ['Place B', 'M_BE_NATURAL_AS_BUILT'], ['Place D', 'M_BE_NATURAL_AS_BUILT']], 'Place C is an old fort built by people. The others are natural features.',
      { t: { head: ['Place', 'What it is'], rows: [['Place A', 'A mountain with snow'], ['Place B', 'A large lake'], ['Place C', 'An old fort with stone walls'], ['Place D', 'A river']] } }],
    ['The table lists four sites. Which one is a ruined Swahili town?', 'Gedi Ruins', [['Fort Jesus', 'M_BE_PLACE_MIX'], ['Lamu Old Town', 'M_BE_PLACE_MIX'], ['Thimlich Ohinga', 'M_BE_PLACE_MIX']], 'The Gedi Ruins are the remains of a Swahili town.',
      { t: { head: ['Site', 'What it is'], rows: [['Fort Jesus', 'Fort built by the Portuguese'], ['Lamu Old Town', 'Town still lived in'], ['Gedi Ruins', 'Ruined Swahili town'], ['Thimlich Ohinga', 'Stone enclosure']] } }],
    ['A learner sorts places. Which one belongs in the "built by people long ago" column?', 'Lamu Old Town', [['Mount Kenya', 'M_BE_NATURAL_AS_BUILT'], ['Lake Naivasha', 'M_BE_NATURAL_AS_BUILT'], ['The Rift Valley', 'M_BE_NATURAL_AS_BUILT']], 'Lamu Old Town was built by people. The others are natural.',
      { t: { head: ['Place', 'Kind'], rows: [['Mount Kenya', 'Mountain'], ['Lake Naivasha', 'Lake'], ['Lamu Old Town', 'Old town'], ['Rift Valley', 'Valley']] } }],
  ], { h: ['Read the row that matches the question.', 'A fort, a town and a wall are built by people.'], s1: 'Read each row of the table.' }), 'b'),

  // ---------------------------------------------------------------- CONSERVATION
  fam('cv.act', `${BE}CONSERVATION`, 'direct', 1, choose([
    ['Which action helps to conserve an old fort?', 'Repair it carefully', [['Pull it down to build a new one', 'M_BE_KEEP_OUT'], ['Write names on the walls', 'M_BE_TOUCH_TAKE'], ['Take small stones home', 'M_BE_TOUCH_TAKE']], 'Careful repair keeps the fort standing for the future.'],
    ['What should a visitor do at a historic site?', 'Follow the rules and leave things as they are', [['Climb on the old walls', 'M_BE_TOUCH_TAKE'], ['Take a small piece as a souvenir', 'M_BE_TOUCH_TAKE'], ['Write a name on the wall', 'M_BE_TOUCH_TAKE']], 'Visitors help conserve a site by following the rules.'],
    ['Why do people keep historic buildings?', 'They show how people lived long ago', [['They are useless old things', 'M_BE_KEEP_OUT'], ['They should be pulled down', 'M_BE_KEEP_OUT'], ['They only belong to the tourists', 'M_BE_KEEP_OUT']], 'Historic buildings are part of our cultural heritage.'],
    ['Which is a good way to help others value a historic site?', 'Teach people about its history', [['Keep it secret', 'M_BE_KEEP_OUT'], ['Let people damage it', 'M_BE_TOUCH_TAKE'], ['Close it forever', 'M_BE_KEEP_OUT']], 'People who know the history care more about the place.'],
    ['You see a visitor breaking a piece off an old wall. What is the best thing to do?', 'Tell a guide or a teacher', [['Join in', 'M_BE_TOUCH_TAKE'], ['Say nothing, it is only a stone', 'M_BE_TOUCH_TAKE'], ['Take a piece too', 'M_BE_TOUCH_TAKE']], 'Telling a guide helps protect the site.'],
  ], { h: ['Which action keeps the site for the next generation?', 'Small damage by many people adds up.'], s1: 'Choose the action that protects the site for the future.' })),
  fam('cv.story', `${BE}CONSERVATION`, 'word', 2, choose([
    ['A class visits the Gedi Ruins. Amina wants to carve her name in a wall. What should the teacher say?', 'No, it harms the old wall', [['Go ahead, it is only one name', 'M_BE_TOUCH_TAKE'], ['Go ahead, the ruins are old', 'M_BE_KEEP_OUT'], ['Do it quickly so no one sees', 'M_BE_TOUCH_TAKE']], 'Carving damages the wall. Heritage must be kept as it is.'],
    ['Kiprono finds a loose old stone at a historic site and puts it in his bag. What should he do?', 'Put it back and tell the guide', [['Keep it, it is only a stone', 'M_BE_TOUCH_TAKE'], ['Sell it to a visitor', 'M_BE_TOUCH_TAKE'], ['Throw it away', 'M_BE_TOUCH_TAKE']], 'Every stone is part of the site. We leave them where they are.'],
    ['A town wants more space and plans to pull down an old fort. Which idea best protects the fort?', 'Build the new houses elsewhere', [['Pull the fort down', 'M_BE_KEEP_OUT'], ['Let the fort fall in time', 'M_BE_KEEP_OUT'], ['Cover the fort with sheets', 'M_BE_KEEP_OUT']], 'The fort cannot be rebuilt once lost, so new houses go elsewhere.'],
    ['A school club wants to protect the Fort Jesus walls. Which is the best plan?', 'Explain the rules to visitors', [['Keep everyone away for ever', 'M_BE_KEEP_OUT'], ['Let visitors climb on the walls', 'M_BE_TOUCH_TAKE'], ['Remove the old stones', 'M_BE_TOUCH_TAKE']], 'Rules and care protect the fort while visitors still learn from it.'],
    ['Why do guides at Lamu Old Town ask visitors not to touch the old carved doors?', 'Touching slowly wears them away', [['The doors are not important at all', 'M_BE_KEEP_OUT'], ['The doors are brand new and strong', 'M_BE_KEEP_OUT'], ['Visitors are not allowed to see them', 'M_BE_KEEP_OUT']], 'Many hands can slowly damage old wood and carving.'],
  ], { h: ['Which choice keeps the site safe for later generations?', 'One small act by many people can ruin an old site.'], s1: 'Think what keeps the site safe for the future.' })),
];
