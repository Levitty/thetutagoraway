// ============================================================================
// GRADE 4 AGRICULTURE AND NUTRITION, STRAND 1: CONSERVATION OF RESOURCES (8 skills).
// Compost manure, drip irrigation, fuels at home, small wild animals that destroy crops.
// Written offline from the KICD design through the curriculum map (curriculum/agriculture/g4.json). The questions test the knowledge
// behind the practical outcomes; the practical half (making compost, setting up a drip bottle, cooking with less fuel, building a
// scarecrow) is a task for the teacher (see docs/qa/agriculture-g4-non-question-outcomes-2026-11-12.md). Every wrong answer names the
// library misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g4_lib.js';

const SO = 'CONSER.SOIL_CONSERVATION.', WA = 'CONSER.WATER_CONSERVATION.', FU = 'CONSER.FUEL_CONSERVATION.', WI = 'CONSER.CONSERVING_WILD_ANIMALS.';

export const FAMILIES = [
  // ---------------------------------------------------------------- COMPOST_MATERIALS
  fam('compost.mat.which', `${SO}COMPOST_MATERIALS`, 'direct', 1, choose([
    Q('Which of these can be used to make compost manure?', 'Banana peelings', ['A polythene bag|CM_ANY', 'An empty tin|CM_ANY', 'A broken bottle|CM_ANY'], 'Peelings rot into manure. Polythene, tins and glass do not rot.'),
    Q('Which of these should NOT go on a compost heap?', 'Plastic bottles', ['Dry grass|CM_ANY', 'Cow dung|CM_ANY', 'Vegetable leaves|CM_ANY'], 'Plastic does not rot and would spoil the manure.'),
    Q('Which one is made by rotting plant remains and dung?', 'Compost manure', ['Fertiliser from the shop|CM_FERT', 'Fertiliser from a factory|CM_FERT', 'Pesticide from the shop|CM_FERT'], 'Compost is made at home. Fertiliser from the shop is made in a factory.'),
    Q('Why are meat bones kept out of the compost heap?', 'They draw rats and flies', ['They make the heap too rich|CM_MEAT', 'They are the best food for the heap|CM_MEAT', 'They turn the heap sour at once|CM_MEAT'], 'Bones and meat smell and draw rats and flies.'),
    Q('Which of these is a good material for compost?', 'Dry maize stalks', ['Old batteries|CM_ANY', 'Cooked fish|CM_MEAT', 'Glass jars|CM_ANY'], 'Crop remains rot well and make good compost.'),
  ], { h: ['Only things that were once plants, and dung, rot into manure.', 'Plastic, tins, glass and cooked food stay out.'], s1: 'Ask: will it rot into manure?' })),
  fam('compost.mat.story', `${SO}COMPOST_MATERIALS`, 'word', 2, choose([
    Q('Baraka clears the school kitchen. Which of these can he put on the compost heap?', 'Potato and cassava peelings', ['A used plastic cup|CM_ANY', 'A cooked chicken bone|CM_MEAT', 'A rusty tin lid|CM_ANY'], 'Raw peelings rot well. Plastic and tins never rot, and bones draw rats.'),
    Q('Njoroge wants to put leftover fried fish on the heap. Why should he not?', 'It will draw rats and flies', ['Fish is the best thing for a heap|CM_MEAT', 'Fish makes the heap too wet|CM_MEAT', 'Fish turns the manure blue|CM_MEAT'], 'Cooked and oily food draws rats and flies.'),
    Q('Wanjiru sweeps up grass, leaves and goat droppings. What can she do with them?', 'Put them on the compost heap', ['Throw them in the river|CM_ANY', 'Burn them with the plastic|CM_ANY', 'Bury them with the tins|CM_ANY'], 'Grass, leaves and droppings rot into good manure.'),
    Q('Mama Achieng says she will buy compost from the shop. What is really sold in a bag at the shop?', 'Fertiliser made in a factory', ['Compost made in a factory|CM_FERT', 'Rotted peelings from the school|CM_FERT', 'Dung from her own farm|CM_FERT'], 'Shop fertiliser is made in a factory. Compost is made at home.'),
    Q('Hassan found pieces of polythene in his compost heap. How did they get there?', 'Someone put them in, and they did not rot', ['The heap made them as it rotted|CM_ANY', 'They are a natural part of manure|CM_ANY', 'Rotting turns waste into plastic|CM_ANY'], 'Polythene does not rot. It must be kept out of the heap.'),
  ], { h: ['Would it rot into manure, or draw pests?', 'Plant remains and dung go in. Plastic, tins, glass and cooked food stay out.'], s1: 'Sort what rots from what does not.' })),
  fam('compost.mat.spot', `${SO}COMPOST_MATERIALS`, 'spot', 3, spot([
    S('Mwangi lists what the class put on the compost heap. Which step has the mistake?', ['Step 1: We put on dry grass.', '!Step 2: We added leaves, peelings and old plastic bags.', 'Step 3: We covered it with a sack.'], 'Plastic bags do not rot. Only leaves, peelings, grass and dung go on.', 'CM_ANY'),
    S('Atieno describes the heap. Which step has the mistake?', ['Step 1: We put leaves at the bottom.', '!Step 2: We added leftover meat and cooked fish.', 'Step 3: We covered it with soil.'], 'Meat and cooked fish draw rats and flies. Leave them out.', 'CM_MEAT'),
    S('Salma lists how the group made compost. Which step has the mistake?', ['Step 1: We chose a shady corner of the garden.', 'Step 2: We put on banana leaves and grass.', '!Step 3: We added tins so the manure would be rich.'], 'Tins do not rot and add nothing. Keep them out.', 'CM_ANY'),
    S('Kiprono tells his friend about compost. Which step has the mistake?', ['Step 1: Compost is made from rotted leaves and dung.', '!Step 2: It is the same as the bag of fertiliser from the shop.', 'Step 3: It makes the soil crumbly.'], 'Compost is made at home from rotted plants and dung. Fertiliser from the shop is made in a factory.', 'CM_FERT'),
    S('Odhiambo says what goes on the heap. Which step has the mistake?', ['Step 1: Cabbage leaves go on.', 'Step 2: Cow dung goes on.', '!Step 3: Cooked meat and bones go on too.'], 'Meat and bones draw rats and flies. Leave them out.', 'CM_MEAT'),
  ], { h: ['Which step puts the wrong thing on the heap?', 'Only plant matter and dung rot into manure.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- COMPOST_MAKING
  fam('compost.make.which', `${SO}COMPOST_MAKING`, 'direct', 1, choose([
    Q('What makes the best compost heap?', 'Dry and fresh materials mixed in layers', ['Only wet peelings pressed into one heap|CK_ONE', 'Only dry sticks with nothing else|CK_ONE', 'Only dung with no leaves or grass|CK_ONE'], 'A mix of dry and fresh material rots best.'),
    Q('What does a compost heap need while it rots?', 'To be kept damp and covered', ['To be kept dry and open to the sun|CK_DRY', 'To be filled with water to the top|CK_DRY', 'To be left uncovered in the rain|CK_DRY'], 'Rotting needs a little moisture and a cover.'),
    Q('When is compost ready to put on the garden?', 'When it is dark, crumbly and smells like soil', ['After one day, when the heap is made|CK_EARLY', 'As soon as the heap is full|CK_EARLY', 'When it still looks like peelings|CK_EARLY'], 'Finished compost is dark and crumbly.'),
    Q('Why is the compost heap covered?', 'To keep the heat and moisture in', ['To stop the heap from rotting|CK_DRY', 'To keep all the air out for good|CK_DRY', 'To make it dry faster|CK_DRY'], 'A cover keeps the heap warm and damp so it rots well.'),
    Q('Why are dry and fresh materials put in layers?', 'Dry ones let in air and fresh ones give moisture', ['Layers make the heap look neat|CK_ONE', 'Only one layer is really needed|CK_ONE', 'Dry ones are the only ones that rot|CK_ONE'], 'Both kinds help the rotting.'),
  ], { h: ['Think about what the rotting needs: air, moisture and a mix.', 'Wait until the compost is dark and crumbly.'], s1: 'Think about what makes waste rot.' })),
  fam('compost.make.story', `${SO}COMPOST_MAKING`, 'word', 2, choose([
    Q('Zawadi\'s heap is dry and nothing has changed for a month. What should she do?', 'Wet it a little and cover it', ['Leave it, it will rot alone|CK_DRY', 'Add only dry sticks|CK_ONE', 'Soak it with a bucket of water|CK_DRY'], 'A heap needs a little water and a cover to rot.'),
    Q('Wafula opens his heap after two days and uses it on his beans. What is wrong?', 'The waste has not rotted yet', ['Nothing, compost is ready at once|CK_EARLY', 'The beans do not need manure|CK_EARLY', 'The heap was too dry|CK_DRY'], 'Waste needs weeks to rot. Wait for dark, crumbly manure.'),
    Q('The class has only fresh peelings. What should they add to the heap?', 'Dry grass and leaves', ['More fresh peelings|CK_ONE', 'Only water|CK_DRY', 'Nothing at all|CK_ONE'], 'Dry material mixed with fresh material makes better compost.'),
    Q('Amina\'s heap smells bad and is full of water after the rains. What went wrong?', 'It was left uncovered and became too wet', ['It was covered well and kept dry|CK_DRY', 'It was left in the sun all day|CK_DRY', 'It had too many leaves|CK_ONE'], 'Too much water makes a heap smelly. Cover it.'),
    Q('Omondi says his compost is ready. How can he tell?', 'It is dark, crumbly and smells like soil', ['It is wet and smelly|CK_EARLY', 'It still has whole peelings in it|CK_EARLY', 'It was made yesterday|CK_EARLY'], 'Ready compost is dark and crumbly.'),
  ], { h: ['Is the heap too dry, too wet or not ready?', 'A good heap is damp, covered and mixed. It is ready when it is dark and crumbly.'], s1: 'Find what the heap is missing.' })),
  fam('compost.make.spot', `${SO}COMPOST_MAKING`, 'spot', 3, spot([
    S('Mwajuma explains how the class made compost. Which step has the mistake?', ['Step 1: We put dry grass at the bottom.', '!Step 2: We left the heap dry and open all year.', 'Step 3: We used the dark manure for the kale.'], 'A heap must be kept a little damp and covered, or it will not rot well.', 'CK_DRY'),
    S('Kamau tells his friends about the heap. Which step has the mistake?', ['Step 1: We put on dry and fresh material in layers.', 'Step 2: We covered it with a sack.', '!Step 3: We used it on the garden after one day.'], 'Waste needs weeks to rot. Wait until it is dark and crumbly.', 'CK_EARLY'),
    S('Njeri describes the heap. Which step has the mistake?', ['Step 1: We chose a shady place.', '!Step 2: We put only wet peelings in one big pile.', 'Step 3: We kept it covered.'], 'Mix dry material with the fresh peelings, in layers.', 'CK_ONE'),
    S('Otieno says how to make compost. Which step has the mistake?', ['Step 1: We made layers of dry and fresh waste.', '!Step 2: We poured water on until it was soaking and smelly.', 'Step 3: We waited for it to turn dark.'], 'The heap should be damp, not soaking. Too much water makes it smelly.', 'CK_DRY'),
    S('Chebet explains when compost is ready. Which step has the mistake?', ['Step 1: We waited for some weeks.', 'Step 2: We looked at the heap.', '!Step 3: It was ready because it still looked like peelings.'], 'Ready compost is dark and crumbly, not like peelings.', 'CK_EARLY'),
  ], { h: ['Which step skips what the heap needs?', 'A heap is mixed, damp, covered, and left until it is dark and crumbly.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- DRIP_MEANING
  fam('drip.mean.which', `${WA}DRIP_MEANING`, 'direct', 1, choose([
    Q('How does drip irrigation give water to a plant?', 'Slowly, drop by drop', ['In one big pour|DM_FAST', 'Like a heavy rain shower|DM_FAST', 'Like a running hosepipe|DM_FAST'], 'Drip irrigation gives water slowly, drop by drop.'),
    Q('Where does the water from a drip system go?', 'Into the soil at the roots', ['Onto the leaves of the plant|DM_LEAVES', 'Onto the whole garden path|DM_LEAVES', 'Into the air above the plant|DM_LEAVES'], 'Roots take up water, so the drip goes beside the roots.'),
    Q('Why does drip irrigation save water?', 'Little is lost and it goes to the roots', ['It uses more water so plants grow faster|DM_WASTE', 'It uses as much as a hosepipe|DM_WASTE', 'It waters the bare ground too|DM_WASTE'], 'Only a small amount is used and it goes where it is needed.'),
    Q('Which of these is drip irrigation?', 'A bottle with a tiny hole beside a plant', ['A bucket poured over the leaves|DM_LEAVES', 'A hosepipe left running all day|DM_FAST', 'A big tank emptied on the garden|DM_FAST'], 'A tiny hole lets the water out drop by drop.'),
    Q('Compared with a watering can, drip irrigation uses what?', 'Less water', ['More water|DM_WASTE', 'The same water every time|DM_WASTE', 'Water from the roof only|DM_WASTE'], 'Drip puts the water only where the plant needs it.'),
  ], { h: ['Think about how slowly the water comes out.', 'The drip goes to the roots, so little water is lost.'], s1: 'Think about where the water goes.' })),
  fam('drip.mean.story', `${WA}DRIP_MEANING`, 'word', 2, choose([
    Q('Mama Wanjiru has little water for her kitchen garden. Which way will save the most water?', 'Drip irrigation beside the plants', ['Pouring a full bucket over the leaves|DM_LEAVES', 'Using a hosepipe at noon|DM_FAST', 'Splashing water over the whole garden|DM_WASTE'], 'Drip puts a small amount of water at the roots.'),
    Q('Kiprop pins a hole in a bottle and watches. What does he see?', 'Water coming out drop by drop', ['Water gushing out fast|DM_FAST', 'Water spraying over the leaves|DM_LEAVES', 'No water at all|DM_FAST'], 'A tiny hole gives a slow drip.'),
    Q('Nyambura says drip irrigation wastes water because it is slow. What is the best reply?', 'The slow drip soaks the roots and little is lost', ['She is right, it uses much more water|DM_WASTE', 'It only waters the path|DM_WASTE', 'It waters the leaves and the sky|DM_LEAVES'], 'A slow drip lets the soil soak up the water.'),
    Q('Why does a drip tube end beside the plant?', 'Because the roots take up the water', ['Because the leaves drink the drip|DM_LEAVES', 'Because the stem needs washing|DM_LEAVES', 'Because it looks tidy|DM_LEAVES'], 'Water must reach the roots.'),
    Q('The school garden is watered by drip. Compared with a bucket, how much water is lost?', 'Very little', ['Much more|DM_WASTE', 'The same|DM_WASTE', 'All of it|DM_WASTE'], 'Little water runs off or dries up with drip irrigation.'),
  ], { h: ['Where does the water go, and how fast?', 'Drip irrigation gives a little water to the roots, slowly.'], s1: 'Compare how much water each way uses.' })),

  // ---------------------------------------------------------------- DRIP_SETUP
  fam('drip.set.which', `${WA}DRIP_SETUP`, 'direct', 1, choose([
    Q('Where should the water container of a simple drip system be put?', 'Higher than the bed, on a stand', ['Lower than the bed, on the ground|DS_LOW', 'In a hole in the ground|DS_LOW', 'Under the plant|DS_LOW'], 'Water runs downhill, so the container must be higher.'),
    Q('How big should the hole in a drip bottle be?', 'Tiny, so the water comes out drop by drop', ['Big, so all the water comes out at once|DS_BIGHOLE', 'As wide as the bottle neck|DS_BIGHOLE', 'Big enough for a finger|DS_BIGHOLE'], 'A tiny hole keeps the drip going for hours.'),
    Q('Where should the end of the drip tube be placed?', 'Next to the plant roots', ['Far from the plant, in the path|DS_FAR', 'At the edge of the garden|DS_FAR', 'Beside the fence|DS_FAR'], 'The water must fall where the roots are.'),
    Q('The drip has stopped. What is the likely cause?', 'The hole is blocked with soil', ['The plant has drunk all the soil|DS_BIGHOLE', 'The container is too high|DS_LOW', 'The roots are too close|DS_FAR'], 'Check the hole and clear it.'),
    Q('What should be done after the bottle is set up?', 'Fill it with water and check the drip', ['Leave it empty for a week|DS_LOW', 'Make a second big hole|DS_BIGHOLE', 'Move it far from the plant|DS_FAR'], 'Fill it and make sure the water is dripping.'),
  ], { h: ['Water runs downhill. The hole is tiny. The drip falls beside the roots.', 'If the drip stops, look for a blocked hole.'], s1: 'Think about how the water flows.' })),
  fam('drip.set.story', `${WA}DRIP_SETUP`, 'word', 2, choose([
    Q('Juma puts a drip bottle on the ground beside his beans, but no water comes out. What is the mistake?', 'The bottle is not higher than the bed', ['The hole is too tiny to work|DS_BIGHOLE', 'The bottle is too close to the roots|DS_FAR', 'The beans do not need water|DS_LOW'], 'Raise the bottle so the water can flow down.'),
    Q('Faith makes a large hole in her drip bottle. What happens?', 'All the water pours out at once', ['The water comes out drop by drop|DS_BIGHOLE', 'The plant gets more water for longer|DS_BIGHOLE', 'The bottle never empties|DS_BIGHOLE'], 'A large hole floods the plant and empties the bottle.'),
    Q('Peter sets the drip tube at the end of the row, far from the kale. What is wrong?', 'The water does not reach the roots', ['The kale likes dry roots|DS_FAR', 'The tube is too short|DS_FAR', 'Nothing, the water will find the roots|DS_FAR'], 'Put the drip end beside each plant.'),
    Q('Amani\'s drip stops after one week. He finds soil in the hole. What should he do?', 'Clear the hole', ['Make the hole bigger|DS_BIGHOLE', 'Move the bottle lower|DS_LOW', 'Stop watering the plant|DS_FAR'], 'A blocked hole must be cleared.'),
    Q('What is the first thing to do when setting up a bottle drip?', 'Make a tiny hole near the bottom or in the cap', ['Make a large hole in the side|DS_BIGHOLE', 'Bury the bottle in the ground|DS_LOW', 'Put the bottle far from the plant|DS_FAR'], 'Start with a tiny hole.'),
  ], { h: ['Is the container high enough, the hole tiny and the end by the roots?', 'Fix the part that is wrong.'], s1: 'Find the part of the system that is wrong.' })),
  fam('drip.set.spot', `${WA}DRIP_SETUP`, 'spot', 3, spot([
    S('Neema explains her drip bottle. Which step has the mistake?', ['Step 1: I made a tiny hole in the bottle.', '!Step 2: I put the bottle on the ground below the plants.', 'Step 3: I filled it with water.'], 'The bottle must stand higher than the bed so the water flows down.', 'DS_LOW'),
    S('Kelvin describes his drip system. Which step has the mistake?', ['Step 1: I put the bottle on a stand.', '!Step 2: I made a big hole so the water comes out fast.', 'Step 3: I put the end beside the plant.'], 'A big hole empties the bottle at once. A tiny hole gives a slow drip.', 'DS_BIGHOLE'),
    S('Mercy tells how she set up the drip. Which step has the mistake?', ['Step 1: I made a tiny hole in the cap.', 'Step 2: I raised the bottle on a stand.', '!Step 3: I put the bottle at the end of the path, far from the plant.'], 'The drip must fall beside the plant roots.', 'DS_FAR'),
    S('Brian explains his drip. Which step has the mistake?', ['Step 1: I filled the bottle.', '!Step 2: I put the dripping end on the leaves.', 'Step 3: I checked the hole.'], 'Roots drink the water, so the drip goes into the soil beside the roots.', 'DM_LEAVES'),
    S('Rose tells how drip saves water. Which step has the mistake?', ['Step 1: The water drips slowly.', 'Step 2: It soaks into the soil.', '!Step 3: It uses more water than a hosepipe.'], 'Drip uses less water because little is lost.', 'DM_WASTE'),
  ], { h: ['Which step puts the container, hole or tube in the wrong place?', 'High container, tiny hole, drip beside the roots.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- FUEL_TYPES
  fam('fuel.type.which', `${FU}FUEL_TYPES`, 'direct', 1, choose([
    Q('Which of these is a fuel used for cooking at home?', 'Cooking gas', ['Petrol|FT_PETROL', 'Diesel|FT_PETROL', 'Engine oil|FT_PETROL'], 'Petrol and diesel are for engines. Gas is used for cooking.'),
    Q('Which of these is a liquid fuel?', 'Paraffin', ['Charcoal|FT_STATE', 'Firewood|FT_STATE', 'Cooking gas|FT_STATE'], 'Paraffin is a liquid. Charcoal and firewood are solids and gas is a gas.'),
    Q('Which list names only fuels used at home?', 'Firewood, charcoal, paraffin and gas', ['Firewood only, every home uses the same|FT_ONE', 'Petrol, diesel and engine oil|FT_PETROL', 'Water, sand and stones|FT_ONE'], 'Homes use many fuels.'),
    Q('Which of these is a solid fuel?', 'Charcoal', ['Paraffin|FT_STATE', 'Cooking gas|FT_STATE', 'Biogas|FT_STATE'], 'Charcoal is a solid. It is made by burning wood slowly.'),
    Q('Which of these is a gas fuel?', 'Biogas', ['Firewood|FT_STATE', 'Charcoal|FT_STATE', 'Paraffin|FT_STATE'], 'Biogas is made from rotting dung and is a gas.'),
  ], { h: ['Think about the form of each fuel: solid, liquid or gas.', 'Petrol and diesel are for engines, not for cooking.'], s1: 'Think about what each fuel is.' })),
  fam('fuel.type.story', `${FU}FUEL_TYPES`, 'word', 2, choose([
    Q('Mama Njoki cooks on a jiko with black lumps from burnt wood. Which fuel is this?', 'Charcoal', ['Paraffin|FT_STATE', 'Petrol|FT_PETROL', 'Cooking gas|FT_STATE'], 'Charcoal is a solid fuel from wood.'),
    Q('Kamande\'s family lights a stove with a liquid from a bottle. What fuel is it?', 'Paraffin', ['Charcoal|FT_STATE', 'Firewood|FT_STATE', 'Biogas|FT_STATE'], 'Paraffin is a liquid fuel.'),
    Q('Otieno says every home cooks with firewood only. What is the best reply?', 'Homes also use charcoal, gas, paraffin and more', ['He is right, only firewood is used|FT_ONE', 'Homes use petrol and diesel too|FT_PETROL', 'Homes cook with water|FT_ONE'], 'Different homes use different fuels.'),
    Q('A shopkeeper in town cooks on a gas cylinder. What kind of fuel is gas?', 'A gas', ['A solid|FT_STATE', 'A liquid|FT_STATE', 'A stone|FT_STATE'], 'Cooking gas is a gas that burns.'),
    Q('Why do we not cook on a jiko with petrol?', 'Petrol catches fire too easily and is for engines', ['Petrol is the best cooking fuel|FT_PETROL', 'Petrol is a solid fuel|FT_STATE', 'Petrol is only used in homes|FT_PETROL'], 'Petrol is a fuel for engines and is dangerous at home.'),
  ], { h: ['Is the fuel a solid, a liquid or a gas?', 'Is it used for cooking at home or in engines?'], s1: 'Think about what the fuel looks like and where it is used.' })),

  // ---------------------------------------------------------------- FUEL_SAVING
  fam('fuel.save.which', `${FU}FUEL_SAVING`, 'direct', 1, choose([
    Q('Which habit saves fuel when boiling beans?', 'Cooking with a lid on the pot', ['Cooking with the lid off so you can watch|FS_OPENLID', 'Cooking with the lid off to let steam out|FS_OPENLID', 'Cooking with the pot open to the wind|FS_OPENLID'], 'A lid keeps the heat in.'),
    Q('The pot is boiling. What should the cook do to save fuel?', 'Make the fire small', ['Add more wood to make a big flame|FS_BIG', 'Pile on more charcoal|FS_BIG', 'Fan the fire harder|FS_BIG'], 'Boiling water does not get hotter, so a big flame wastes fuel.'),
    Q('Which firewood saves the most fuel?', 'Dry wood', ['Wet wood|FS_WET', 'Freshly cut green wood|FS_WET', 'Wood soaked in rain|FS_WET'], 'Dry wood burns well. Wet wood makes smoke.'),
    Q('Why are hard foods such as beans soaked before cooking?', 'They cook faster and use less fuel', ['They need more fuel|FS_BIG', 'It makes the fire bigger|FS_BIG', 'They cook without a fire|FS_OPENLID'], 'Soaked beans soften and cook faster.'),
    Q('Why is food cut into small pieces before cooking?', 'It cooks faster', ['It makes the fire bigger|FS_BIG', 'It uses more fuel|FS_BIG', 'It keeps the lid off|FS_OPENLID'], 'Small pieces cook quickly, so less fuel is used.'),
  ], { h: ['Which habit keeps the heat in or makes the food cook faster?', 'A lid, dry wood, a small fire and small pieces all save fuel.'], s1: 'Think about how not to waste heat.' })),
  fam('fuel.save.story', `${FU}FUEL_SAVING`, 'word', 2, choose([
    Q('Which cook wastes fuel?', 'The one with an open pot on a big fire', ['The one who puts a lid on the pot|FS_OPENLID', 'The one who uses very dry wood|FS_WET', 'The one who cuts food into small bits|FS_BIG'], 'An open pot on a big fire wastes the heat.'),
    Q('Mama Naserian soaks the beans overnight. Why?', 'They cook faster', ['So the fire can be bigger|FS_BIG', 'So she can use wet wood|FS_WET', 'So the lid can stay off|FS_OPENLID'], 'Soaked beans need less time on the fire.'),
    Q('Ali has only wet firewood after the rain. What is the best thing?', 'Dry it in the sun first', ['Use it at once on a big flame|FS_WET', 'Soak it in water again|FS_WET', 'Burn it with the lid off|FS_OPENLID'], 'Dry wood saves fuel.'),
    Q('Grace cooks rice, then uses the same fire to heat water. How does this help?', 'The one fire does two jobs', ['It makes the fire much bigger|FS_BIG', 'It wastes more wood than before|FS_BIG', 'It dries the rice out in the pot|FS_OPENLID'], 'One fire can cook more than one thing.'),
    Q('The sufuria is boiling hard. Peter wants to put on more charcoal. What does his mother say?', 'No, it cannot get any hotter', ['Yes, a bigger fire cooks faster|FS_BIG', 'Yes, take the lid off as well|FS_OPENLID', 'Yes, use some wet charcoal|FS_WET'], 'Boiling water does not get hotter, so keep the fire small.'),
  ], { h: ['Which cook is keeping the heat in?', 'A lid, dry wood and a small fire after boiling save fuel.'], s1: 'Find the cook who wastes heat.' })),
  fam('fuel.save.spot', `${FU}FUEL_SAVING`, 'spot', 3, spot([
    S('Mwende tells how she saves fuel. Which step has the mistake?', ['Step 1: I soak the beans first.', '!Step 2: I take the lid off the pot to let the heat out.', 'Step 3: I keep the fire small once it boils.'], 'A lid keeps the heat in. Cooking with it off wastes fuel.', 'FS_OPENLID'),
    S('Kibet explains his cooking. Which step has the mistake?', ['Step 1: I use dry wood.', 'Step 2: I put a lid on the pot.', '!Step 3: I add more wood when it boils so it cooks faster.'], 'Boiling water does not get hotter. Keep the fire small.', 'FS_BIG'),
    S('Lucy describes lighting the fire. Which step has the mistake?', ['Step 1: I cut the food small.', '!Step 2: I use wet wood because it lasts longer.', 'Step 3: I cover the pot.'], 'Wet wood makes smoke and little heat. Use dry wood.', 'FS_WET'),
    S('Hamisi explains saving fuel. Which step has the mistake?', ['Step 1: I put a lid on the pot.', 'Step 2: I cook the beans and the greens on one fire.', '!Step 3: I make the flame as big as I can.'], 'A big flame wastes fuel once the pot is boiling.', 'FS_BIG'),
    S('Dorcas tells how she cooks. Which step has the mistake?', ['Step 1: I soak the maize.', '!Step 2: I cook with no lid so I can watch it.', 'Step 3: I take the pot off when the food is ready.'], 'A lid saves fuel because it keeps the heat in.', 'FS_OPENLID'),
  ], { h: ['Which step wastes heat?', 'Lid on, dry wood, small fire, food cut small.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- SMALL_PESTS
  fam('pests.small.which', `${WI}SMALL_PESTS`, 'direct', 1, choose([
    Q('Which small animal pecks the grain in a ripening field?', 'A weaver bird', ['A mole|SP_MATCH', 'A bee|SP_BEE', 'A butterfly|SP_BEE'], 'Weaver birds and queleas peck ripening grain.'),
    Q('Which animal digs up roots and tubers under the ground?', 'A mole', ['A weaver bird|SP_MATCH', 'A bee|SP_BEE', 'A butterfly|SP_BEE'], 'Moles tunnel under the soil and eat roots and tubers.'),
    Q('Which small animal does NOT harm the crop?', 'A bee on a bean flower', ['A rat in the maize|SP_BEE', 'A bird in the millet|SP_BEE', 'A squirrel in the maize|SP_BEE'], 'Bees help the flowers to make seed.'),
    Q('Which of these small animals can harm a maize field?', 'Birds, rats and squirrels', ['None, only big animals harm crops|SP_BIG', 'Bees and butterflies|SP_BEE', 'Only the elephant|SP_BIG'], 'Small animals harm crops too because there are many of them.'),
    Q('Rats gnaw maize cobs in a store. What are they?', 'Pests', ['Helpers|SP_BEE', 'Pollinators|SP_BEE', 'Gardeners|SP_BEE'], 'Rats eat and spoil the grain.'),
  ], { h: ['Think about what each animal eats.', 'Birds peck grain. Rats gnaw grain. Moles dig roots. Bees help.'], s1: 'Think about what each animal does.' })),
  fam('pests.small.story', `${WI}SMALL_PESTS`, 'word', 2, choose([
    Q('Wanjiku finds tunnels in her sweet potato bed and the potatoes are chewed. Which animal did it?', 'A mole', ['A weaver bird|SP_MATCH', 'A butterfly|SP_BEE', 'A honey bee|SP_BEE'], 'Moles dig tunnels and eat roots and tubers.'),
    Q('Flocks of small birds fall on the school millet field every morning. What damage do they do?', 'They peck the grain', ['They dig up the roots|SP_MATCH', 'They help the flowers|SP_BEE', 'They do no harm|SP_BIG'], 'Weaver birds and queleas eat the grain.'),
    Q('Mr Kimani says only big animals harm crops. What is the best reply?', 'Small animals such as birds and rats harm crops too', ['He is right, small animals never harm crops|SP_BIG', 'Bees harm crops most|SP_BEE', 'Only moles harm crops|SP_MATCH'], 'Small animals come in great numbers.'),
    Q('A boy sees bees on the pumpkin flowers. His sister says to chase them away. What should he tell her?', 'Bees help the crop, leave them', ['Bees eat the pumpkins|SP_BEE', 'Bees dig up the roots|SP_MATCH', 'Bees spoil the leaves|SP_BEE'], 'Bees carry pollen and help the crop to bear fruit.'),
    Q('Hares nibble the young cabbage seedlings at night. What do they harm?', 'The young vegetable plants', ['The roots under the soil only|SP_MATCH', 'The pollen|SP_BEE', 'Nothing in the garden|SP_BIG'], 'Hares eat young green plants.'),
  ], { h: ['What did the animal do to the crop?', 'Match the animal to the damage. Bees and butterflies help.'], s1: 'Match the damage to the animal.' })),

  // ---------------------------------------------------------------- SCARECROW_MAKE
  fam('scare.make.which', `${WI}SCARECROW_MAKE`, 'direct', 1, choose([
    Q('What is a scarecrow made to do?', 'Scare animals away, not hurt them', ['Kill the animals that come near it|SC_KILL', 'Trap the animals so they stay alive|SC_KILL', 'Feed the animals so they stay away|SC_KILL'], 'A scarecrow only scares animals away.'),
    Q('Why is a scarecrow moved from place to place?', 'Animals get used to it if it never moves', ['It does not need to be moved at all|SC_FIXED', 'It gets tired of standing|SC_FIXED', 'To water the plants|SC_FIXED'], 'Birds soon learn a still scarecrow is harmless.'),
    Q('Where is the best place to stand a scarecrow?', 'In the middle of the crop', ['Hidden in the bush at the edge|SC_HIDDEN', 'Behind the house, out of sight|SC_HIDDEN', 'Under a tree away from the crop|SC_HIDDEN'], 'Birds must see it from far, so it stands in the middle where it can be seen.'),
    Q('Which of these helps a scarecrow scare birds?', 'Old tins that rattle in the wind', ['A heap of grain next to the sticks|SC_KILL', 'A bowl of poison next to the sticks|SC_KILL', 'A trap with sharp wire around it|SC_KILL'], 'Noise and movement scare birds.'),
    Q('What is the frame of a scarecrow often made from?', 'Two sticks in a cross', ['A heavy stone|SC_FIXED', 'A trap|SC_KILL', 'A bag of grain|SC_KILL'], 'Two sticks in a cross make arms and a body.'),
  ], { h: ['A scarecrow scares, it does not hurt.', 'Put it where it can be seen and move it often.'], s1: 'Think about what a scarecrow is for.' })),
  fam('scare.make.story', `${WI}SCARECROW_MAKE`, 'word', 2, choose([
    Q('Odhiambo\'s scarecrow worked for a week. Now birds sit on it. What should he do?', 'Move it and change its clothes', ['Leave it where it is|SC_FIXED', 'Take it down and hide it|SC_HIDDEN', 'Put poison on the grain|SC_KILL'], 'Birds get used to a scarecrow that never changes.'),
    Q('Salome wants to stop birds with poison. Her teacher says a scarecrow is better. Why?', 'A scarecrow scares birds without harming other animals', ['Poison is cheaper than anything|SC_KILL', 'A scarecrow kills birds faster|SC_KILL', 'Poison makes birds come back|SC_KILL'], 'Poison can hurt bees, cats and children.'),
    Q('Karanja puts his scarecrow in the bush by the fence. What is the problem?', 'Birds cannot see it from the sky', ['The bush makes it too tall|SC_HIDDEN', 'The scarecrow will kill the bush|SC_KILL', 'Nothing, it works there|SC_HIDDEN'], 'A scarecrow must stand in the middle of the crop.'),
    Q('The class dresses the scarecrow in an old shirt and a hat. Why?', 'To make it look like a person', ['To keep it warm|SC_FIXED', 'To make it kill the birds|SC_KILL', 'To hide it from the birds|SC_HIDDEN'], 'Birds fear a shape that looks like a person.'),
    Q('A farmer ties strips of cloth that flap in the wind to his scarecrow. How does this help?', 'The moving cloth scares the birds', ['The cloth traps the birds|SC_KILL', 'The cloth feeds the birds|SC_KILL', 'The cloth keeps the scarecrow still|SC_FIXED'], 'Movement scares birds.'),
  ], { h: ['Does the plan scare animals, or hurt them?', 'A scarecrow is seen, moved and noisy.'], s1: 'Think about how animals are scared.' })),
  fam('scare.make.spot', `${WI}SCARECROW_MAKE`, 'spot', 3, spot([
    S('Mutiso explains how the class made a scarecrow. Which step has the mistake?', ['Step 1: We tied two sticks in a cross.', 'Step 2: We put on an old shirt and a hat.', '!Step 3: We left it in the same place all season.'], 'Move the scarecrow often, because birds get used to it.', 'SC_FIXED'),
    S('Beatrice tells her friends about the scarecrow. Which step has the mistake?', ['Step 1: We made it from sticks and old clothes.', '!Step 2: We put poison below it to kill the birds.', 'Step 3: We stood it in the field.'], 'A scarecrow only scares animals away. Poison can harm other animals.', 'SC_KILL'),
    S('Ibrahim describes his scarecrow. Which step has the mistake?', ['Step 1: I made the frame.', '!Step 2: I hid it behind the bushes at the edge.', 'Step 3: I added tins that rattle.'], 'Stand it in the middle of the crop where it can be seen.', 'SC_HIDDEN'),
    S('Anne explains how she keeps birds away. Which step has the mistake?', ['Step 1: I set a scarecrow in the middle.', 'Step 2: I tie shiny strips on it.', '!Step 3: I never move it, so the birds learn to fear it.'], 'Birds learn it is harmless if it never moves.', 'SC_FIXED'),
    S('Tom explains what a scarecrow does. Which step has the mistake?', ['Step 1: It looks like a person.', 'Step 2: It moves in the wind.', '!Step 3: It kills the birds that come close.'], 'A scarecrow scares animals away. It does not kill them.', 'SC_KILL'),
  ], { h: ['Which step makes the scarecrow useless or harmful?', 'Seen, moved often and scaring only.'], s1: 'Check each step against what you know.' })),
];
