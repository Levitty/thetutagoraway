// ============================================================================
// GRADE 5 AGRICULTURE AND NUTRITION, STRAND 2 (PART 1): FOOD PRODUCTION PROCESSES (7 skills).
// Growing vegetables (nursery, transplanting), uses of domestic animals, preserving cereals and pulses.
// Written offline from the KICD 2024 design through the curriculum map (curriculum/agriculture/g5.json). The questions test the
// knowledge behind the practical outcomes (making a nursery, preserving grain); the practical half is a teacher task. Every wrong
// answer names the library misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g5_lib.js';

const VE = 'FOOD_P.GROWING_VEGETABLES.', AN = 'FOOD_P.USES_OF_DOMESTIC_ANIMALS.', PR = 'FOOD_P.PRESERVATION_OF_CEREALS_.';

export const FAMILIES = [
  // ---------------------------------------------------------------- VEG_PRACTICES
  fam('veg.pr.which', `${VE}VEG_PRACTICES`, 'direct', 1, choose([
    Q('Which of these is done first when growing kale?', 'Preparing the land and adding manure', ['Transplanting the seedlings to the field|VEG_ORDER', 'Harvesting the first leaves for sale|VEG_ORDER', 'Weeding between the rows of kale|VEG_ORDER'], 'The land is prepared before anything is sown or planted.'),
    Q('Which is the correct order of practices for vegetables?', 'Make a nursery, sow, transplant, harvest', ['Transplant, make a nursery, sow, harvest|VEG_ORDER', 'Harvest, sow, make a nursery, transplant|VEG_ORDER', 'Sow, harvest, transplant, make a nursery|VEG_ORDER'], 'You sow in the nursery first, then transplant the seedlings, then harvest.'),
    Q('Which job is done after transplanting kale?', 'Weeding, mulching and checking for pests', ['Nothing, only water is needed later|VEG_WATER_ONLY', 'Nothing, as the crop grows alone|VEG_WATER_ONLY', 'Only sowing seeds in the nursery|VEG_ORDER'], 'Vegetables need weeding, mulching and protection from pests as well as water.'),
    Q('Why are vegetables weeded?', 'Weeds take water and food from the crop', ['Weeds make the crop grow faster|VEG_WATER_ONLY', 'Weeds keep the soil damp for it|VEG_WATER_ONLY', 'Weeds are only there to look bad|VEG_WATER_ONLY'], 'Weeds compete with the vegetables for water, light and food.'),
    Q('Which of these is a gardening practice in growing vegetables?', 'Controlling pests such as aphids', ['Selling the leaves in town only|VEG_WATER_ONLY', 'Cooking the leaves at night|VEG_WATER_ONLY', 'Buying a new school bag|VEG_WATER_ONLY'], 'Pest control keeps the plants healthy. Selling and cooking come after harvest.'),
  ], { h: ['Think of the story of a vegetable from land to harvest.', 'Prepare, sow in the nursery, transplant, care for, harvest.'], s1: 'Put the practices in the order the garden needs them.' })),
  fam('veg.pr.story', `${VE}VEG_PRACTICES`, 'word', 2, choose([
    Q('Wanjiku has a new plot for sukuma wiki. What should she do first?', 'Dig the plot and mix in manure', ['Transplant seedlings into hard ground|VEG_ORDER', 'Pick the leaves and take them home|VEG_ORDER', 'Spread mulch on the unprepared plot|VEG_ORDER'], 'The soil must be prepared before planting.'),
    Q('Kiprop says growing vegetables is only sowing and watering. What did he leave out?', 'Weeding, mulching and controlling pests', ['Nothing at all, he is right|VEG_WATER_ONLY', 'Only the cooking of the leaves|VEG_WATER_ONLY', 'Only the buying of the seeds|VEG_WATER_ONLY'], 'These practices protect the crop as it grows.'),
    Q('The class made a nursery and the seeds have grown into small plants. What is the next practice?', 'Transplanting the seedlings', ['Sowing the seeds again|VEG_ORDER', 'Harvesting the seedlings|VEG_ORDER', 'Preparing the land for the first time|VEG_ORDER'], 'Seedlings are moved to the prepared field after the nursery.'),
    Q('Halima\'s tomatoes are small and a thick bed of weeds covers the plot. Which practice was missed?', 'Weeding', ['Sowing in a nursery|VEG_WATER_ONLY', 'Transplanting at noon|VEG_ORDER', 'Harvesting early|VEG_ORDER'], 'Weeds take water and food from the crop.'),
    Q('Which is the right order of three jobs in a school vegetable garden?', 'Prepare the land, transplant, weed', ['Weed, transplant, prepare the land|VEG_ORDER', 'Transplant, prepare the land, weed|VEG_ORDER', 'Harvest, weed, prepare the land|VEG_ORDER'], 'You cannot weed or transplant a plot that has not been prepared.'),
  ], { h: ['What stage is the garden in now?', 'Prepare, nursery, transplant, care, harvest.'], s1: 'Place the job in the story of the crop.' })),

  // ---------------------------------------------------------------- NURSERY_BED
  fam('veg.nur.which', `${VE}NURSERY_BED`, 'direct', 1, choose([
    Q('Why is the soil of a nursery bed broken into fine crumbs?', 'Tiny seeds and shoots need fine soil', ['Big lumps hold the seeds in place|NURS_COARSE', 'Lumps are better for tiny seeds|NURS_COARSE', 'Fine soil is only for looks|NURS_COARSE'], 'A fine bed lets tiny seeds touch soil and shoots push up easily.'),
    Q('How deep are tiny kale seeds covered?', 'Very thinly with fine soil', ['About ten centimetres of soil|NURS_DEEP', 'Under a thick layer of soil|NURS_DEEP', 'As deep as the length of a hand|NURS_DEEP'], 'Tiny seeds are sown shallow. A deep seed cannot push through.'),
    Q('How is a nursery bed watered?', 'Lightly, morning and evening', ['Heavily until water stands|NURS_FLOOD', 'Once a week with a full bucket|NURS_FLOOD', 'Never until the seeds sprout|NURS_FLOOD'], 'Seeds and seedlings rot in standing water, but they must not dry out.'),
    Q('About how wide is a raised nursery bed, so a learner can reach the middle?', 'About one metre wide', ['About five metres wide|NURS_COARSE', 'About ten metres wide|NURS_COARSE', 'As wide as the whole school|NURS_COARSE'], 'A bed one metre wide can be reached from both sides without walking on it.'),
    Q('Which seeds are sown in a nursery bed?', 'Tiny seeds such as kale and cabbage', ['Large seeds such as maize cobs|NURS_COARSE', 'Pumpkin stems from last year|NURS_COARSE', 'Sweet potato vines only|NURS_COARSE'], 'Tiny seeds need the care of a nursery before they are moved to the field.'),
  ], { h: ['Think about how a tiny seed and its shoot grow.', 'Fine soil, shallow sowing, light watering, good drainage.'], s1: 'Think about what a tiny seed needs.' })),
  fam('veg.nur.story', `${VE}NURSERY_BED`, 'word', 2, choose([
    Q('Mutua leaves big lumps in his nursery bed. What will happen to the tiny seeds?', 'Many will not touch soil and will not sprout', ['They will all grow better|NURS_COARSE', 'They will grow into big plants|NURS_COARSE', 'Nothing will change at all|NURS_COARSE'], 'Tiny seeds need fine soil around them.'),
    Q('Atieno buries her tomato seeds a hand deep. Weeks later nothing has come up. Why?', 'The seeds were too deep to push through', ['They were not buried deep enough|NURS_DEEP', 'They needed to be under rocks|NURS_DEEP', 'Tomato seeds never sprout|NURS_DEEP'], 'Tiny seeds are covered very thinly.'),
    Q('Njeri pours a bucket of water on her nursery every hour and the seeds rot. What did she do wrong?', 'She flooded the bed', ['She gave the bed too little water|NURS_FLOOD', 'She watered at the wrong season|NURS_FLOOD', 'She made the soil too fine|NURS_COARSE'], 'Seeds rot in standing water. Water lightly twice a day.'),
    Q('The class makes a nursery for cabbage. Which plan is best?', 'A raised, fine bed, shallow rows, light watering', ['A rough bed with deep holes and heavy watering|NURS_COARSE', 'A flooded hollow with large lumps|NURS_FLOOD', 'A hard bed with big stones on top|NURS_COARSE'], 'The nursery needs fine soil, shallow sowing and good drainage.'),
    Q('Why does the class cover the sown nursery with dry grass until the seeds sprout?', 'It keeps the soil moist and the sun off', ['It pushes the seeds deeper into the soil|NURS_DEEP', 'It keeps the seeds from ever sprouting|NURS_FLOOD', 'It makes the soil dry and hard|NURS_COARSE'], 'The cover keeps the soil damp. It is removed once seedlings appear.'),
  ], { h: ['What did the learner do to the bed or the seed?', 'Fine bed, shallow seed, light water.'], s1: 'Match the result with the mistake.' })),

  // ---------------------------------------------------------------- SEEDLING_CARE
  fam('veg.sc.which', `${VE}SEEDLING_CARE`, 'direct', 1, choose([
    Q('When is the best time to transplant seedlings?', 'In the evening or on a cloudy day', ['At midday in the hot sun|TRANS_NOON', 'At noon on a bright day|TRANS_NOON', 'Just after lunch in strong heat|TRANS_NOON'], 'Hot midday sun scorches new transplants.'),
    Q('What should be done to the nursery before lifting seedlings?', 'Water the bed so seedlings lift with soil', ['Leave it dry so the soil falls off|TRANS_DRY', 'Let it dry for a week first|TRANS_DRY', 'Pull them out roughly by the leaves|TRANS_DRY'], 'Wet soil stays on the roots so they are not torn.'),
    Q('What is done straight after transplanting?', 'Firm the soil and water the seedlings', ['Leave them with no water at all|TRANS_NOWATER', 'Pull a few out to check roots|TRANS_NOWATER', 'Leave them alone until harvest|TRANS_NOWATER'], 'Firming and watering help roots settle.'),
    Q('About how old are seedlings when they are ready to transplant?', 'About four to six weeks old', ['About one day old|TRANS_DRY', 'About two years old|TRANS_DRY', 'As soon as they sprout|TRANS_DRY'], 'They are ready when they have several true leaves and are a little hand tall.'),
    Q('A seedling dies after transplanting. What do farmers do?', 'Replace it with a new seedling', ['Leave the gap empty for ever|TRANS_NOWATER', 'Dig up the whole bed|TRANS_NOWATER', 'Pour acid on the gap|TRANS_NOWATER'], 'Replacing dead seedlings is called gap filling.'),
  ], { h: ['Think about how to keep the roots and leaves from drying out.', 'Water the nursery, lift gently, plant in the evening, water and shade.'], s1: 'Think about how the seedling stays alive.' })),
  fam('veg.sc.story', `${VE}SEEDLING_CARE`, 'word', 2, choose([
    Q('Otieno transplants his cabbage at noon and the leaves are limp by evening. What should he do next time?', 'Transplant in the evening or on a cloudy day', ['Transplant at noon again, in the hot sun|TRANS_NOON', 'Transplant only when the sun is hottest|TRANS_NOON', 'Take away all the water from them|TRANS_NOWATER'], 'Cool, cloudy weather lets seedlings settle.'),
    Q('Kamau pulls seedlings out of the dry nursery and their roots are bare. What would be better?', 'Water the nursery first and lift with soil', ['Pull the seedlings harder and faster|TRANS_DRY', 'Shake off all the soil from the roots|TRANS_DRY', 'Cut off the roots before planting|TRANS_DRY'], 'Soil on the roots protects them.'),
    Q('Wanjiru transplanted her tomatoes this morning. What should she do for the next few days?', 'Water and shade them, then weed and mulch', ['Do nothing at all until harvest time|TRANS_NOWATER', 'Dig them up to look at the roots|TRANS_NOWATER', 'Move them into the strong sun|TRANS_NOON'], 'New transplants need water and shade at first.'),
    Q('A learner says seedlings can be moved as soon as they sprout. What is the best reply?', 'Wait about four to six weeks', ['Yes, move them at once today|TRANS_DRY', 'Wait until they bear ripe seeds|TRANS_DRY', 'Wait for two whole years first|TRANS_DRY'], 'Seedlings need a few true leaves and strong roots first.'),
    Q('Two of Mwangi\'s transplants die in the first week. What should he do?', 'Plant new seedlings in the gaps', ['Leave the gaps empty|TRANS_NOWATER', 'Dig up the whole bed again|TRANS_NOWATER', 'Water the empty gaps only|TRANS_NOWATER'], 'Replacing dead plants is called gap filling.'),
  ], { h: ['What did the learner do wrong, or leave out?', 'Water first, lift with soil, evening planting, water and shade.'], s1: 'Match the care with what the seedling needs.' })),
  fam('veg.sc.spot', `${VE}SEEDLING_CARE`, 'spot', 3, spot([
    S('Mercy explains how the class transplanted kale. Which step has the mistake?', ['Step 1: We watered the nursery bed.', 'Step 2: We lifted the seedlings with soil on the roots.', '!Step 3: We planted them at noon in the hot sun.'], 'Transplant in the evening or on a cloudy day, when the sun will not scorch them.', 'TRANS_NOON'),
    S('Brian tells how he moved the seedlings. Which step has the mistake?', ['Step 1: I left the nursery bed dry.', '!Step 2: I pulled the seedlings out and shook off all the soil.', 'Step 3: I planted them in the evening.'], 'Water the bed first and keep soil on the roots so they are not torn.', 'TRANS_DRY'),
    S('Fatuma describes what happened after planting. Which step has the mistake?', ['Step 1: We planted the seedlings in prepared holes.', 'Step 2: We firmed the soil around them.', '!Step 3: We did not water them, so the roots could dry in peace.'], 'Water the seedlings after planting and shade them for a few days.', 'TRANS_NOWATER'),
    S('Peter describes his transplanting day. Which step has the mistake?', ['Step 1: I chose a cloudy afternoon.', '!Step 2: I moved the seedlings the day after they sprouted.', 'Step 3: I watered them after planting.'], 'Seedlings need about four to six weeks and several true leaves first.', 'TRANS_DRY'),
    S('Grace explains the care of the seedlings. Which step has the mistake?', ['Step 1: We shaded the seedlings for a few days.', 'Step 2: We weeded around them.', '!Step 3: When two seedlings died we left the gaps empty.'], 'Replace dead seedlings with new ones. This is called gap filling.', 'TRANS_NOWATER'),
  ], { h: ['Which step harms the seedling?', 'Water first, lift with soil, plant in the evening, firm, water and shade.'], s1: 'Check each step against what a seedling needs.' })),

  // ---------------------------------------------------------------- ANIMAL_PRODUCTS
  fam('an.pr.which', `${AN}ANIMAL_PRODUCTS`, 'direct', 1, choose([
    Q('Which animal gives wool?', 'A sheep', ['A goat|PROD_WOOL', 'A cow|PROD_WOOL', 'A hen|PROD_WOOL'], 'Wool is cut from sheep. Goats give meat, milk and skins.'),
    Q('Which bird lays the eggs that families eat?', 'The hen', ['The cockerel|PROD_COCK', 'The cock in the compound|PROD_COCK', 'Every bird in the flock|PROD_COCK'], 'Only hens lay eggs.'),
    Q('Which of these does not give milk to the family?', 'A hen', ['A cow|PROD_MILK_ALL', 'A goat|PROD_MILK_ALL', 'A camel|PROD_MILK_ALL'], 'Cows, goats and camels give milk. Hens give eggs.'),
    Q('Which food do bees give?', 'Honey', ['Milk|PROD_MILK_ALL', 'Eggs|PROD_COCK', 'Wool|PROD_WOOL'], 'Bees make honey that people harvest from hives.'),
    Q('Which animal gives pork?', 'A pig', ['A sheep|PROD_WOOL', 'A hen|PROD_COCK', 'A camel|PROD_MILK_ALL'], 'Pork is the meat of a pig.'),
  ], { h: ['Think about the food or product each animal gives.', 'Sheep: wool. Hen: eggs. Cow, goat, camel: milk. Bee: honey.'], s1: 'Match the animal to its product.' })),
  fam('an.pr.story', `${AN}ANIMAL_PRODUCTS`, 'word', 2, choose([
    Q('Wafula collects eggs each morning from the compound. Which birds laid them?', 'The hens', ['The cocks|PROD_COCK', 'The cockerels|PROD_COCK', 'All the chicks|PROD_COCK'], 'Hens lay eggs. Cocks do not.'),
    Q('A shepherd sells wool at the market. Which animals give the wool?', 'Sheep', ['Goats|PROD_WOOL', 'Cattle|PROD_WOOL', 'Camels|PROD_WOOL'], 'Wool grows on sheep.'),
    Q('In Turkana, a family drinks milk from the herd every morning. Which of these animals could give it?', 'A camel or a goat', ['A hen|PROD_MILK_ALL', 'A rabbit|PROD_MILK_ALL', 'A donkey in town|PROD_MILK_ALL'], 'Camels and goats are milked in dry areas.'),
    Q('Mama Njeri keeps beehives at the edge of her shamba. What food does she harvest?', 'Honey', ['Milk|PROD_MILK_ALL', 'Eggs|PROD_COCK', 'Wool|PROD_WOOL'], 'Bees make honey.'),
    Q('A school wants cheap meat from a small animal kept in a hutch. Which one fits?', 'A rabbit', ['A cow|PROD_MILK_ALL', 'A camel|PROD_MILK_ALL', 'A bee|PROD_MILK_ALL'], 'Rabbits are small and kept in hutches for meat.'),
  ], { h: ['What does each animal give?', 'Sheep give wool, hens give eggs, cows give milk, bees give honey.'], s1: 'Match the story with the animal.' })),

  // ---------------------------------------------------------------- ANIMAL_USES
  fam('an.use.which', `${AN}ANIMAL_USES`, 'direct', 1, choose([
    Q('Why does a farmer keep oxen?', 'To pull the plough and the cart', ['Only for meat on Sundays|USE_FOOD_ONLY', 'Only for milk in the morning|USE_FOOD_ONLY', 'Only for their feathers|USE_FOOD_ONLY'], 'Oxen do work as well as give meat.'),
    Q('What is the main use of a donkey on many farms?', 'To carry loads and pull a cart', ['To give milk for the family tea|USE_DONKEY', 'To give wool for jerseys|USE_DONKEY', 'To lay eggs for sale|USE_DONKEY'], 'Donkeys carry loads and pull carts.'),
    Q('How can cow dung help a vegetable garden?', 'It rots into manure that feeds the soil', ['It cannot help, as it is only waste|USE_DUNG', 'It is useless to all kinds of plants|USE_DUNG', 'It only attracts flies to the plot|USE_DUNG'], 'Dung rots into manure.'),
    Q('Which animal is used to carry goods across dry land in northern Kenya?', 'A camel', ['A hen|USE_FOOD_ONLY', 'A rabbit|USE_FOOD_ONLY', 'A pig|USE_FOOD_ONLY'], 'Camels cross dry land with loads and give milk.'),
    Q('What do hides and skins from cattle and goats become?', 'Leather, drums and sandals', ['Wool for warm blankets|USE_FOOD_ONLY', 'Milk for small babies|USE_FOOD_ONLY', 'Eggs for the market|USE_FOOD_ONLY'], 'Hides and skins are made into leather items.'),
  ], { h: ['Animals give work and materials as well as food.', 'Oxen plough, donkeys carry, dung is manure, hides become leather.'], s1: 'Think of all that an animal gives.' })),
  fam('an.use.story', `${AN}ANIMAL_USES`, 'word', 2, choose([
    Q('Mzee Kimani has no tractor. How does he plough his field?', 'With a pair of oxen', ['With hens from the compound|USE_FOOD_ONLY', 'With rabbits from the hutch|USE_FOOD_ONLY', 'With bees from the hive|USE_FOOD_ONLY'], 'Oxen pull the plough.'),
    Q('Wangari fetches water and firewood with her animal each day. Which animal helps her?', 'A donkey', ['A hen|USE_DONKEY', 'A rabbit|USE_DONKEY', 'A pig|USE_DONKEY'], 'A donkey carries loads.'),
    Q('Njeri spreads cow dung on her kale beds. What does it do?', 'It feeds the soil as it rots', ['It is waste and only smells|USE_DUNG', 'It keeps the kale from growing|USE_DUNG', 'It makes the kale taste bitter|USE_DUNG'], 'Dung becomes manure that feeds the soil.'),
    Q('Ali says animals are kept only to be eaten. What can his teacher show him?', 'Oxen ploughing and donkeys carrying loads', ['Hens that only lay eggs in the dark|USE_FOOD_ONLY', 'Cows that give people no use at all|USE_FOOD_ONLY', 'Goats that never give any milk or meat|USE_FOOD_ONLY'], 'Many animals do work.'),
    Q('A farmer\'s goat dies. What can be made from its skin?', 'A drum or a sandal', ['A bag of flour|USE_FOOD_ONLY', 'A bottle of milk|USE_FOOD_ONLY', 'A basket of eggs|USE_FOOD_ONLY'], 'Skins are made into leather items and drums.'),
  ], { h: ['What does the animal do besides give food?', 'Work, manure and hides are uses too.'], s1: 'Match the job with the animal.' })),

  // ---------------------------------------------------------------- PRESERVE_METHODS
  fam('pr.me.which', `${PR}PRESERVE_METHODS`, 'direct', 1, choose([
    Q('Which is a way of preserving maize at home?', 'Dry it in the sun then store it', ['Soak it in water for days|PRES_WATER', 'Leave it in the rain to keep fresh|PRES_WATER', 'Wash it and store it wet|PRES_WET'], 'Dry grain keeps well. Wet grain grows mould.'),
    Q('Why must grain be dried before storing?', 'Damp grain grows mould and rots', ['Damp grain stays fresher|PRES_WET', 'Damp grain tastes sweeter|PRES_WET', 'Dry grain is heavier to carry|PRES_WET'], 'Moisture lets mould and weevils spoil grain.'),
    Q('What is wood ash used for in storing beans?', 'It fills the gaps and keeps weevils away', ['It makes the beans cook faster|PRES_SACK', 'It adds salt to the beans|PRES_SACK', 'It makes the beans grow|PRES_SACK'], 'Dry ash is mixed with the beans to protect them.'),
    Q('Which container keeps weevils out of stored beans?', 'A tightly sealed tin or drum', ['An open basket|PRES_SACK', 'A torn sack|PRES_SACK', 'A cloth with holes|PRES_SACK'], 'An airtight container stops air and insects.'),
    Q('Which of these is a pulse?', 'Green grams', ['Maize|PRES_WATER', 'Rice|PRES_WATER', 'Sorghum|PRES_WATER'], 'Beans, green grams and cowpeas are pulses. Maize, rice and sorghum are cereals.'),
  ], { h: ['Grain keeps when it is dry and kept from air and insects.', 'Sun drying, ash and sealed containers keep grain safe.'], s1: 'Think about what spoils grain.' })),
  fam('pr.me.story', `${PR}PRESERVE_METHODS`, 'word', 2, choose([
    Q('Nafula has harvested beans. How can she keep them for the next planting?', 'Dry them well and seal them in a container', ['Soak them in water|PRES_WATER', 'Leave them in the rain|PRES_WATER', 'Store them while still wet|PRES_WET'], 'Dry beans keep for months in a sealed container.'),
    Q('Otieno stores damp maize in a sack. Two weeks later it smells bad. Why?', 'The damp grain grew mould', ['The sack was too dry|PRES_WET', 'The grain grew roots|PRES_WET', 'The sack was too clean|PRES_WET'], 'Damp grain grows mould.'),
    Q('Mama Njoki mixes dry wood ash with her cowpeas. What does the ash do?', 'It keeps weevils away', ['It makes the cowpeas sweet|PRES_SACK', 'It makes them cook faster|PRES_SACK', 'It makes the sack lighter|PRES_SACK'], 'Ash protects the pulses from insects.'),
    Q('Baraka keeps his millet in an open basket and finds weevils inside. What would be better?', 'A sealed container', ['A bigger open basket|PRES_SACK', 'A basket with more holes|PRES_SACK', 'A basket in the rain|PRES_WATER'], 'Sealed containers keep insects out.'),
    Q('Which is NOT a way of preserving cereals at home?', 'Washing them and leaving them wet', ['Sun drying them|PRES_WATER', 'Mixing them with ash|PRES_WATER', 'Sealing them in a tin|PRES_WATER'], 'Wet grain spoils.'),
  ], { h: ['Dry, protected from air and insects.', 'Never store wet grain.'], s1: 'Pick the method that keeps the grain safe.' })),

  // ---------------------------------------------------------------- PRESERVE_PRACTICE
  fam('pr.pa.which', `${PR}PRESERVE_PRACTICE`, 'direct', 1, choose([
    Q('Maize is just harvested and still damp. What should be done before it is sealed in a tin?', 'Dry it in the sun until it is hard', ['Seal it at once while damp|PRACT_SEAL_EARLY', 'Pour water on it first|PRACT_SEAL_EARLY', 'Keep it damp for a week|PRACT_SEAL_EARLY'], 'Sealing damp grain traps the moisture and it grows mould.'),
    Q('How can you test that grains are dry?', 'Bite one and it cracks', ['It feels a bit soft|PRACT_DRYNESS', 'It looks yellow|PRACT_DRYNESS', 'It is warm from the sun|PRACT_DRYNESS'], 'A dry grain is hard and cracks when bitten.'),
    Q('Where should sacks of grain be kept?', 'On a raised platform away from the wall', ['On the bare floor beside the wall|PRACT_GROUND', 'Against a damp wall on the floor|PRACT_GROUND', 'Under a leaking roof|PRACT_GROUND'], 'Floors and walls let in damp and rats.'),
    Q('On what should grain be spread to dry in the sun?', 'A clean mat or tarpaulin', ['The muddy ground|PRACT_GROUND', 'The bare road|PRACT_GROUND', 'A wet cloth|PRACT_SEAL_EARLY'], 'A clean surface keeps stones and soil out.'),
    Q('Why should stored grain be checked often?', 'To find damp, mould or pests early', ['To make the grain heavier|PRACT_DRYNESS', 'To make it sweeter|PRACT_DRYNESS', 'To make it grow|PRACT_DRYNESS'], 'Finding problems early saves the rest.'),
  ], { h: ['Dry first, then store, off the floor, and check.', 'Bite test: dry grain cracks.'], s1: 'Think about what keeps damp and pests away.' })),
  fam('pr.pa.story', `${PR}PRESERVE_PRACTICE`, 'word', 2, choose([
    Q('Chebet has beans drying on a mat. How can she tell they are ready to store?', 'A bean cracks when she bites it', ['They have turned a new colour|PRACT_DRYNESS', 'The sun has set|PRACT_DRYNESS', 'They feel slightly soft|PRACT_DRYNESS'], 'Dry beans are hard.'),
    Q('Kamau puts the sacks of maize on the floor against the wall. What may happen?', 'Damp and rats may get in', ['Nothing, it is the best place|PRACT_GROUND', 'The sacks will get heavier|PRACT_GROUND', 'The maize will grow|PRACT_GROUND'], 'A raised platform away from the wall is better.'),
    Q('Wangui closes her tin of damp beans tightly and puts it away. What is likely?', 'The beans will grow mould', ['The beans will keep for years|PRACT_SEAL_EARLY', 'The beans will dry by themselves|PRACT_SEAL_EARLY', 'The beans will turn to ash|PRACT_SEAL_EARLY'], 'Seal only fully dry beans.'),
    Q('The school stores maize for porridge. What is the best plan?', 'Dry it, use clean sacks on a platform and check often', ['Store it damp on the floor|PRACT_GROUND', 'Seal damp maize in drums|PRACT_SEAL_EARLY', 'Leave it in the rain|PRACT_SEAL_EARLY'], 'Dry, raised and checked.'),
    Q('Otieno finds mould on some stored maize. What should he do?', 'Remove the bad grain and dry the rest again', ['Eat it all at once|PRACT_DRYNESS', 'Add water to the maize|PRACT_SEAL_EARLY', 'Seal it tighter|PRACT_SEAL_EARLY'], 'Mouldy grain can make people ill. Remove it and do not eat it or feed it to animals.'),
  ], { h: ['Where does the damp or the pest get in?', 'Dry grain, raised sacks, clean mat, check often.'], s1: 'Find what spoiled or would spoil the grain.' })),
];
