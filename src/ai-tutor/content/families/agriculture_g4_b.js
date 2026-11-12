// ============================================================================
// GRADE 4 AGRICULTURE AND NUTRITION, STRAND 2 (FIRST HALF): FOOD PRODUCTION PROCESSES (6 skills).
// Sowing tiny seeds, growing fruits, domestic animals and what they give.
// The practical halves (sowing a seedbed, growing a fruit crop) are tasks for the teacher: see
// docs/qa/agriculture-g4-non-question-outcomes-2026-11-12.md. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g4_lib.js';

const SE = 'FOOD_P.DIRECT_SOWING_OF_TINY_SE.', FR = 'FOOD_P.GROWING_FRUITS.', AN = 'FOOD_P.USES_OF_DOMESTIC_ANIMALS.';

export const FAMILIES = [
  // ---------------------------------------------------------------- TINY_SEED_CROPS
  fam('sow.crops.which', `${SE}TINY_SEED_CROPS`, 'direct', 1, choose([
    Q('Which crop is sown straight in the plot from tiny seeds?', 'Carrot', ['Maize|TS_BIGSEED', 'Beans|TS_BIGSEED', 'Sweet potato|TS_CUTTING'], 'Carrot has tiny seeds and is sown where it will grow.'),
    Q('Which crop has a large seed, not a tiny one?', 'Maize', ['Carrot|TS_BIGSEED', 'Spinach|TS_BIGSEED', 'Coriander|TS_BIGSEED'], 'Maize, beans and peas have large seeds.'),
    Q('Which crop is usually started in a nursery and moved later?', 'Cabbage', ['Carrot|TS_NURSERY', 'Spinach|TS_NURSERY', 'Coriander|TS_NURSERY'], 'Cabbage and tomato are started in a nursery.'),
    Q('How is a sweet potato crop usually planted?', 'By planting pieces of vine', ['By sowing tiny seeds|TS_CUTTING', 'By sowing seeds in a nursery|TS_CUTTING', 'By planting a maize seed|TS_BIGSEED'], 'Sweet potato grows from vine cuttings.'),
    Q('Which of these has tiny seeds that are sown straight in the plot?', 'Spinach', ['Beans|TS_BIGSEED', 'Maize|TS_BIGSEED', 'Sweet potato|TS_CUTTING'], 'Spinach seeds are tiny.'),
  ], { h: ['Think about the size of the seed.', 'Carrot, spinach and coriander have tiny seeds and are sown straight in the plot.'], s1: 'Think about the seed and how the crop starts.' })),
  fam('sow.crops.story', `${SE}TINY_SEED_CROPS`, 'word', 2, choose([
    Q('Nyokabi holds a packet of very tiny seeds. Which crop could they be for sowing straight in the plot?', 'Amaranth (terere)', ['Maize|TS_BIGSEED', 'Beans|TS_BIGSEED', 'Sweet potato|TS_CUTTING'], 'Terere has tiny seeds sown straight in the plot.'),
    Q('Mzee Otieno plants maize. How big are the seeds?', 'Large', ['Tiny like dust|TS_BIGSEED', 'Too small to see|TS_BIGSEED', 'The same as carrot seed|TS_BIGSEED'], 'Maize seeds are large.'),
    Q('Wambui wants cabbage. How will her father start it?', 'In a nursery, then move the seedlings', ['Sow the seeds straight in the plot like carrot|TS_NURSERY', 'Plant a vine cutting|TS_CUTTING', 'Sow big seeds like maize|TS_BIGSEED'], 'Cabbage seedlings are moved from a nursery.'),
    Q('Ali is planting carrots and coriander. Which way will he plant them?', 'Sow the tiny seeds where they will grow', ['Plant cuttings from a vine|TS_CUTTING', 'Start them in a nursery first|TS_NURSERY', 'Plant big seeds one by one|TS_BIGSEED'], 'These crops are sown straight in the plot.'),
    Q('The school plants sweet potato. The teacher brings vines. Why?', 'Sweet potato grows from vine cuttings', ['Sweet potato has tiny seeds|TS_CUTTING', 'The vines are the seeds of carrot|TS_CUTTING', 'Vines are sown like maize|TS_BIGSEED'], 'Sweet potato is planted from cuttings.'),
  ], { h: ['Is the seed tiny or large? Is the crop sown straight in the plot?', 'Carrot, spinach, terere and coriander are sown straight. Maize and beans have large seeds.'], s1: 'Think about the seed and how the crop starts.' })),

  // ---------------------------------------------------------------- SEEDBED_SOWING
  fam('sow.bed.which', `${SE}SEEDBED_SOWING`, 'direct', 1, choose([
    Q('How should the soil of a seedbed for tiny seeds be?', 'Fine, like flour', ['Rough, with lumps and stones|SB_COARSE', 'Hard, packed down|SB_COARSE', 'Full of weeds|SB_COARSE'], 'Tiny seeds need fine soil to touch.'),
    Q('At what depth are tiny seeds sown?', 'Very shallow, and covered lightly', ['Deep, as deep as a hand|SB_DEEP', 'As deep as a spade|SB_DEEP', 'Under a thick layer of soil|SB_DEEP'], 'Tiny seeds cannot push up from deep soil.'),
    Q('What should be done when carrot seedlings come up crowded?', 'Thin them so each has room', ['Leave them all, more plants give more carrots|SB_THICK', 'Sow more seeds on top|SB_THICK', 'Water them less|SB_THICK'], 'Crowded plants fight for light, water and food.'),
    Q('Why are tiny seeds mixed with dry sand before sowing?', 'So they spread thinly', ['So they go deeper|SB_DEEP', 'So they become bigger|SB_THICK', 'So they need no water|SB_THICK'], 'Sand helps to spread tiny seeds evenly.'),
    Q('What should be removed from the seedbed before sowing?', 'Stones, lumps and weeds', ['Nothing, the seeds will find a way|SB_COARSE', 'Only the fine soil|SB_COARSE', 'All the water|SB_COARSE'], 'Stones and lumps stop tiny seeds from coming up.'),
  ], { h: ['Tiny seeds are weak. What do they need?', 'Fine soil, very shallow sowing, and room to grow.'], s1: 'Think about what a tiny seed needs.' })),
  fam('sow.bed.story', `${SE}SEEDBED_SOWING`, 'word', 2, choose([
    Q('Naomi sowed carrot seeds deep in a lumpy bed and few came up. What would help next time?', 'Fine soil and very shallow sowing', ['More lumps and deeper sowing|SB_COARSE', 'No water at all|SB_DEEP', 'Sowing thicker without thinning|SB_THICK'], 'Fine soil and shallow sowing help tiny seeds to come up.'),
    Q('Kevin\'s carrot rows are thick with seedlings and the carrots are small. What went wrong?', 'The seedlings were not thinned', ['They were thinned too early|SB_THICK', 'They had too much room|SB_THICK', 'The soil was too fine|SB_COARSE'], 'Crowded seedlings must be thinned.'),
    Q('Rehema digs the seedbed and breaks the lumps. What else should she do before sowing?', 'Take out stones and weeds', ['Leave the stones in to give shade|SB_COARSE', 'Sow at once without any raking|SB_COARSE', 'Pack the soil down very hard|SB_COARSE'], 'The bed should be fine and level, with no stones or weeds.'),
    Q('Maina covers his spinach seeds with a thick layer of soil. What is the problem?', 'The seeds cannot push up', ['The seeds will grow better there|SB_DEEP', 'The soil is much too fine|SB_COARSE', 'The seeds were too big to sow|SB_DEEP'], 'Cover tiny seeds only lightly, because they cannot push up through thick soil.'),
    Q('Lydia mixes coriander seeds with dry sand. Why?', 'To spread them out evenly', ['To make them grow deeper|SB_DEEP', 'To make them grow bigger|SB_THICK', 'To feed the birds|SB_THICK'], 'Sand spreads the seeds.'),
  ], { h: ['What does the bed or the sowing need to be like?', 'Fine soil, shallow sowing, thin seedlings.'], s1: 'Find what the farmer did wrong.' })),
  fam('sow.bed.spot', `${SE}SEEDBED_SOWING`, 'spot', 3, spot([
    S('Achieng explains how she made a seedbed. Which step has the mistake?', ['Step 1: I dug the soil.', '!Step 2: I left the big lumps and stones in the bed.', 'Step 3: I watered gently after sowing.'], 'Break the lumps and take out the stones, so the soil is fine.', 'SB_COARSE'),
    S('Brian tells how he sowed carrots. Which step has the mistake?', ['Step 1: I made the soil fine.', '!Step 2: I buried the seeds deep in the soil.', 'Step 3: I watered gently.'], 'Tiny seeds are sown very shallow.', 'SB_DEEP'),
    S('Carol describes her carrot bed. Which step has the mistake?', ['Step 1: I sowed the seeds in lines.', 'Step 2: The seedlings came up close together.', '!Step 3: I left them all so I would get more carrots.'], 'Thin crowded seedlings so each one has room.', 'SB_THICK'),
    S('Dennis explains the sowing. Which step has the mistake?', ['Step 1: I mixed the seeds with sand.', 'Step 2: I sowed them in a fine bed.', '!Step 3: I covered them with a thick layer of soil.'], 'Cover tiny seeds only lightly.', 'SB_DEEP'),
    S('Esther tells how she prepared the bed. Which step has the mistake?', ['Step 1: I removed the weeds.', '!Step 2: I left the soil rough, since seeds will find a way.', 'Step 3: I made the bed flat.'], 'Tiny seeds need fine soil to touch.', 'SB_COARSE'),
  ], { h: ['Which step is wrong for a tiny seed?', 'Fine soil, very shallow sowing, thin seedlings.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- FRUIT_TYPES
  fam('fruit.type.which', `${FR}FRUIT_TYPES`, 'direct', 1, choose([
    Q('Which fruit does best at the hot coast?', 'Mango', ['Apple|FY_ANYWHERE', 'Plum|FY_ANYWHERE', 'Pear|FY_ANYWHERE'], 'Mango likes the warm coast. Apples need the cool highlands.'),
    Q('Which of these gives a fruit but is not a tall tree?', 'Banana and pawpaw plants', ['None, all fruits come from tall trees|FY_TREE', 'Only mango trees|FY_TREE', 'Only coconut palms|FY_TREE'], 'Fruits grow on trees, vines, bushes and plants.'),
    Q('Which of these is NOT a fruit crop?', 'Cassava', ['Guava|FY_ROOT', 'Orange|FY_ROOT', 'Pineapple|FY_ROOT'], 'Cassava is a root crop.'),
    Q('Which fruit grows well in the cool highlands?', 'Plum', ['Coconut|FY_ANYWHERE', 'Mango|FY_ANYWHERE', 'Pineapple|FY_ANYWHERE'], 'Plums like cool places.'),
    Q('Passion fruit grows on what?', 'A climbing vine', ['A tall tree only|FY_TREE', 'A root under the ground|FY_ROOT', 'A cassava stem|FY_ROOT'], 'Passion fruit is a vine.'),
  ], { h: ['Think about where each fruit grows and what plant gives it.', 'Mango likes warm places. Apple likes cool places. Cassava is a root.'], s1: 'Think about the place and the plant.' })),
  fam('fruit.type.story', `${FR}FRUIT_TYPES`, 'word', 2, choose([
    Q('Mama Mueni lives near Mombasa where it is hot. Which fruit tree should she plant?', 'Mango', ['Apple|FY_ANYWHERE', 'Plum|FY_ANYWHERE', 'Pear|FY_ANYWHERE'], 'Mango does well in the warm coast.'),
    Q('Peter has a small plot. He wants a fruit plant that is not a tall tree. Which can he choose?', 'Banana', ['Mango tree|FY_TREE', 'Coconut palm|FY_TREE', 'Avocado tree|FY_TREE'], 'A banana is a plant, not a tall tree.'),
    Q('Wafula says cassava is a fruit crop because it is sweet. What is the best reply?', 'Cassava is a root crop, not a fruit', ['He is right, cassava is a fruit|FY_ROOT', 'All sweet foods are fruits|FY_ROOT', 'Roots are the fruits of the plant|FY_ROOT'], 'Cassava is a root crop.'),
    Q('The Grade 4 class at a cold highland school wants to grow fruit. Which is a good choice?', 'Plums', ['Coconuts|FY_ANYWHERE', 'Pineapples|FY_ANYWHERE', 'Mangoes at the coast|FY_ANYWHERE'], 'Plums like the cool highlands.'),
    Q('A farmer grows pawpaw, orange and guava. What are these?', 'Fruit crops', ['Root crops|FY_ROOT', 'Tall trees only|FY_TREE', 'Cereals|FY_ROOT'], 'They all give fruits.'),
  ], { h: ['What does the place need? Is the plant a tree or something else?', 'Choose the fruit that suits the weather.'], s1: 'Think about the weather and the plant.' })),

  // ---------------------------------------------------------------- FRUIT_GROWING
  fam('fruit.grow.which', `${FR}FRUIT_GROWING`, 'direct', 1, choose([
    Q('At what depth should a fruit seedling be planted?', 'At the same depth it grew in the bag', ['Deep, with the stem buried|FG_DEEP', 'So the leaves touch the soil|FG_DEEP', 'Half in and half out of the soil|FG_DEEP'], 'A buried stem can rot.'),
    Q('What is mixed with the topsoil in the planting hole?', 'Manure or compost', ['Stones and sand only|FG_NOMANURE', 'Plastic and tins|FG_NOMANURE', 'Nothing at all|FG_NOMANURE'], 'Manure feeds the young plant.'),
    Q('How much space should mango seedlings be given?', 'Far enough for each tree to grow wide', ['As close as possible to save space|FG_CROWD', 'Touching each other|FG_CROWD', 'In one hole together|FG_CROWD'], 'A fruit tree grows big and needs room.'),
    Q('How is a young fruit seedling looked after in dry weather?', 'Water it regularly and put mulch around it', ['Water it once and then stop|FG_DRYSTOP', 'Leave it, the rain will come|FG_DRYSTOP', 'Water it only when it is dead|FG_DRYSTOP'], 'A young plant dries out quickly.'),
    Q('Why is mulch put around a young fruit tree?', 'It keeps the soil moist', ['It makes the tree grow in the dark|FG_DRYSTOP', 'It makes the tree dry|FG_DRYSTOP', 'It keeps the seedling hungry|FG_NOMANURE'], 'Mulch slows how fast the soil dries.'),
  ], { h: ['What does the young plant need to get started?', 'Right depth, manure in the hole, space, and water.'], s1: 'Think about what a young plant needs.' })),
  fam('fruit.grow.story', `${FR}FRUIT_GROWING`, 'word', 2, choose([
    Q('Esther plants a guava seedling and buries its stem deep. What might happen?', 'The stem may rot', ['The tree will grow faster|FG_DEEP', 'The tree will fruit sooner|FG_DEEP', 'Nothing will happen|FG_DEEP'], 'Plant at the depth it grew.'),
    Q('James digs a hole and puts in a pawpaw seedling with only hard soil. What is missing?', 'Manure mixed with the topsoil', ['More stones|FG_NOMANURE', 'A tight cover of soil|FG_DEEP', 'A second seedling|FG_CROWD'], 'Manure helps the roots to grow.'),
    Q('Mama Salome plants five orange seedlings close together to save land. What will happen later?', 'The trees will crowd each other', ['They will all grow big and strong|FG_CROWD', 'They will need no water|FG_DRYSTOP', 'They will make more fruit than ever|FG_CROWD'], 'Trees need room as they grow.'),
    Q('It has not rained for three weeks. Which is best for the new mango seedling?', 'Water it regularly', ['Stop watering, it is hardy|FG_DRYSTOP', 'Water it once more next month|FG_DRYSTOP', 'Dig it up|FG_DEEP'], 'Young plants need regular water.'),
    Q('Aisha spreads dry grass around her avocado seedling but not touching the stem. What does it do?', 'It keeps the soil moist', ['It stops the tree growing|FG_DRYSTOP', 'It feeds the seedling|FG_NOMANURE', 'It keeps the roots dry|FG_DRYSTOP'], 'Mulch keeps the soil moist.'),
  ], { h: ['What did the planter do or not do?', 'Plant at the right depth with manure, space and regular water.'], s1: 'Find what the young plant is missing.' })),
  fam('fruit.grow.spot', `${FR}FRUIT_GROWING`, 'spot', 3, spot([
    S('Mercy explains how she planted a fruit seedling. Which step has the mistake?', ['Step 1: I dug a hole.', '!Step 2: I put the seedling in with the stem buried deep.', 'Step 3: I watered it.'], 'Plant at the same depth it grew in the bag.', 'FG_DEEP'),
    S('Kelvin describes planting a fruit tree. Which step has the mistake?', ['Step 1: I dug a hole.', '!Step 2: I filled it with plain hard soil and nothing else.', 'Step 3: I put mulch around.'], 'Mix the topsoil with manure to feed the young plant.', 'FG_NOMANURE'),
    S('Hannah tells how she planted five seedlings. Which step has the mistake?', ['Step 1: I dug five holes.', '!Step 2: I made them so close they touch.', 'Step 3: I watered them well.'], 'Leave space so each tree can grow wide.', 'FG_CROWD'),
    S('Isaac tells how he looked after the seedling. Which step has the mistake?', ['Step 1: I put mulch around it.', 'Step 2: I watered it on planting day.', '!Step 3: I stopped watering it even in dry weather.'], 'Water regularly in dry weather while the plant is young.', 'FG_DRYSTOP'),
    S('Joy says how she planted a mango. Which step has the mistake?', ['Step 1: I mixed manure with topsoil.', 'Step 2: I firmed the soil.', '!Step 3: I planted it so the stem was buried deep.'], 'Plant at the same depth it grew in the bag.', 'FG_DEEP'),
  ], { h: ['Which step is wrong for a young fruit plant?', 'Right depth, manure in the hole, room to grow, and regular water.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- ANIMAL_TYPES
  fam('animal.type.which', `${AN}ANIMAL_TYPES`, 'direct', 1, choose([
    Q('Which of these is a domestic animal?', 'A goat', ['A zebra|AT_WILD', 'An antelope|AT_WILD', 'A giraffe|AT_WILD'], 'Domestic animals are kept and cared for by people.'),
    Q('Which of these is a domestic animal kept for eggs?', 'A chicken', ['None, birds are not domestic animals|AT_FOUR', 'A wild goose|AT_WILD', 'A zebra|AT_WILD'], 'Chickens are domestic animals called poultry.'),
    Q('Which of these is poultry?', 'A duck', ['A goat|AT_GROUP', 'A sheep|AT_GROUP', 'A cow|AT_GROUP'], 'Poultry are birds kept for eggs and meat.'),
    Q('Which of these animals is livestock?', 'A cow', ['A chicken|AT_GROUP', 'A duck|AT_GROUP', 'A turkey|AT_GROUP'], 'Cattle, goats and sheep are livestock.'),
    Q('Which of these is NOT a domestic animal?', 'A giraffe', ['A donkey|AT_WILD', 'A rabbit|AT_WILD', 'A pig|AT_WILD'], 'Giraffes live wild in parks.'),
  ], { h: ['Who keeps and feeds the animal?', 'Poultry are birds. Livestock are cattle, goats and sheep.'], s1: 'Think about who looks after the animal.' })),
  fam('animal.type.story', `${AN}ANIMAL_TYPES`, 'word', 2, choose([
    Q('A zebra often grazes near the village. Is it a domestic animal?', 'No, it is wild', ['Yes, it is near people|AT_WILD', 'Yes, it is kept at home|AT_WILD', 'Yes, it is like a donkey|AT_WILD'], 'Domestic animals are kept by people.'),
    Q('Mama Wanja keeps hens. Her son says hens are not domestic animals because they have two legs. What is the best reply?', 'Hens are domestic animals called poultry', ['He is right, only four-legged animals count|AT_FOUR', 'Hens are wild birds|AT_WILD', 'Hens are livestock like cattle|AT_GROUP'], 'Domestic animals include birds.'),
    Q('Oluoch keeps a duck. To which group does it belong?', 'Poultry', ['Livestock|AT_GROUP', 'Wild animals|AT_WILD', 'Pets only|AT_GROUP'], 'Ducks are poultry.'),
    Q('Mr Lekishon keeps cattle, goats and sheep. What are these animals called?', 'Livestock', ['Poultry|AT_GROUP', 'Wild animals|AT_WILD', 'Insects|AT_GROUP'], 'Cattle, goats and sheep are livestock.'),
    Q('Some families keep camels and give them water. Are camels domestic animals?', 'Yes, they are kept by people', ['No, they live wild|AT_WILD', 'No, only cows are domestic|AT_FOUR', 'No, they are poultry|AT_GROUP'], 'Camels are domestic when people keep them.'),
  ], { h: ['Who keeps the animal? Which group does it belong to?', 'Livestock are cattle, goats and sheep. Poultry are birds.'], s1: 'Think about who keeps the animal.' })),

  // ---------------------------------------------------------------- ANIMAL_USES
  fam('animal.use.which', `${AN}ANIMAL_USES`, 'direct', 1, choose([
    Q('Which animal gives us wool?', 'A sheep', ['A goat|AU_MIX', 'A cow|AU_MIX', 'A hen|AU_MIX'], 'Sheep give wool.'),
    Q('Which animal gives us eggs?', 'A chicken', ['A cow|AU_MIX', 'A goat|AU_MIX', 'A sheep|AU_MIX'], 'Chickens lay eggs.'),
    Q('Which animal gives us milk, meat and hides?', 'A cow', ['None, an animal gives only one thing|AU_ONE', 'A hen|AU_MIX', 'A bee|AU_MIX'], 'A cow gives milk, meat and hides.'),
    Q('Which animal is used to carry loads?', 'A donkey', ['A hen|AU_WORK', 'A rabbit|AU_WORK', 'A duck|AU_WORK'], 'Donkeys are strong and carry loads.'),
    Q('Which insect gives us honey?', 'A bee', ['A cow|AU_MIX', 'A hen|AU_MIX', 'A goat|AU_MIX'], 'Bees make honey.'),
  ], { h: ['Think about what each animal gives.', 'Sheep give wool, hens give eggs, bees give honey, donkeys carry loads.'], s1: 'Think about what the animal gives.' })),
  fam('animal.use.story', `${AN}ANIMAL_USES`, 'word', 2, choose([
    Q('The Chebet family keeps goats. What do the goats give?', 'Milk and meat', ['Eggs|AU_MIX', 'Wool|AU_MIX', 'Honey|AU_MIX'], 'Goats give milk and meat.'),
    Q('Njuguna says a cow gives only milk. What is the best reply?', 'A cow also gives meat and hides', ['He is right, only milk|AU_ONE', 'A cow gives eggs too|AU_MIX', 'A cow gives honey|AU_MIX'], 'Many animals give more than one thing.'),
    Q('Mama Lemayian loads her goods on an animal to go to the market. Which animal is best?', 'A donkey', ['A hen|AU_WORK', 'A rabbit|AU_WORK', 'A duck|AU_WORK'], 'Donkeys and camels carry loads.'),
    Q('Mr Kariuki uses a pair of oxen to turn the soil. What are they doing?', 'Ploughing', ['Giving eggs|AU_MIX', 'Making honey|AU_MIX', 'Giving wool|AU_MIX'], 'Oxen pull the plough.'),
    Q('Rehema keeps beehives. What will she get?', 'Honey', ['Eggs|AU_MIX', 'Wool|AU_MIX', 'Milk|AU_MIX'], 'Bees make honey.'),
  ], { h: ['What does this animal give or do?', 'Match each animal with what it gives.'], s1: 'Match the animal with its product or work.' })),
];
