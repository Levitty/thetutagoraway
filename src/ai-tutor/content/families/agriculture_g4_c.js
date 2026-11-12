// ============================================================================
// GRADE 4 AGRICULTURE AND NUTRITION, STRAND 2 (SECOND HALF): BALANCED MEAL AND COOKING FOOD (6 skills).
// What a balanced meal is, the three food groups, picking a balanced plate, methods of cooking, choosing a method, kitchen safety.
// The practical halves (cooking food by a method) are tasks for the teacher: see
// docs/qa/agriculture-g4-non-question-outcomes-2026-11-12.md. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g4_lib.js';

const BA = 'FOOD_P.BALANCED_MEAL.', CO = 'FOOD_P.COOKING_FOOD.';

export const FAMILIES = [
  // ---------------------------------------------------------------- MEAL_IMPORTANCE
  fam('meal.imp.which', `${BA}MEAL_IMPORTANCE`, 'direct', 1, choose([
    Q('What makes a meal balanced?', 'It has foods from all the groups', ['It is big enough to fill the stomach|MI_FILL', 'It has a lot of one favourite food|MI_ONE', 'It costs a lot of money|MI_COST'], 'A balanced meal has foods from every group.'),
    Q('Why can a child not live on ugali alone?', 'No single food gives all the body needs', ['Ugali gives everything the body needs|MI_ONE', 'Ugali is too cheap to be good|MI_COST', 'Ugali fills the stomach, so it is enough|MI_FILL'], 'The body needs a mix of foods.'),
    Q('Which family can eat a balanced meal?', 'Any family that mixes foods from all groups', ['Only a rich family that can buy meat|MI_COST', 'Only a family with a big plate|MI_FILL', 'Only a family that eats one food|MI_ONE'], 'Beans, greens and a staple make a balanced meal that costs little.'),
    Q('Why do children need a balanced meal?', 'To grow, play, learn and fight illness', ['To fill the stomach only|MI_FILL', 'To look rich|MI_COST', 'To eat only one food|MI_ONE'], 'A balanced meal helps the body in every way.'),
    Q('Wanjiru ate a very big plate of rice and felt full. Was her meal balanced?', 'Not necessarily, it has only one group', ['Yes, a full stomach means balanced|MI_FILL', 'Yes, rice has everything|MI_ONE', 'Yes, rice is expensive|MI_COST'], 'A big plate of one food is not balanced.'),
  ], { h: ['Think about foods from different groups.', 'A balanced meal mixes foods from all the groups. It need not be big or costly.'], s1: 'Think about what a balanced meal has.' })),
  fam('meal.imp.story', `${BA}MEAL_IMPORTANCE`, 'word', 2, choose([
    Q('Mama Akinyi cooks ugali, ndengu and managu. Why is this a good meal?', 'It has foods from different groups', ['It is a very big meal for everyone|MI_FILL', 'It costs a lot of money to cook|MI_COST', 'It has only one kind of food in it|MI_ONE'], 'Ugali gives energy, ndengu builds the body and managu protects it.'),
    Q('Brian eats only chips every day. What is the problem?', 'Chips alone do not give all the body needs', ['Chips are too expensive|MI_COST', 'Chips fill the stomach, so he is fine|MI_FILL', 'Chips have everything|MI_ONE'], 'One food cannot do everything.'),
    Q('Wambui says a balanced meal is only for rich people. What is the best reply?', 'Beans, greens and ugali can make one', ['She is right, it needs meat and milk|MI_COST', 'Only a very big meal is balanced|MI_FILL', 'One cheap food is enough for all|MI_ONE'], 'Balance is about the mix, not the money.'),
    Q('Teacher says breakfast should be balanced. Which breakfast is the best?', 'Porridge, an egg and a mango', ['A big bowl of porridge only|MI_FILL', 'Two cups of tea|MI_ONE', 'A bottle of soda|MI_ONE'], 'This breakfast has an energy food, a body-building food and a protective food.'),
    Q('Why is it good to eat many kinds of food?', 'Each kind helps in its own way', ['One kind is all the body needs|MI_ONE', 'It makes the meal very expensive|MI_COST', 'It makes the stomach grow bigger|MI_FILL'], 'Different foods give different things.'),
  ], { h: ['Does the meal mix groups?', 'A balanced meal is a mix, not a big plate of one food.'], s1: 'Think about whether the meal has a mix of foods.' })),

  // ---------------------------------------------------------------- GROUPS_SORT
  fam('meal.group.which', `${BA}GROUPS_SORT`, 'direct', 1, choose([
    Q('Ugali gives mainly what?', 'Energy', ['Body building|GS_UGALI', 'Protection from illness|GS_UGALI', 'Water|GS_UGALI'], 'Ugali, rice and chapati are energy-giving foods.'),
    Q('Eggs, fish and beans help the body to do what mainly?', 'Build and repair the body', ['Give energy|GS_MEAT', 'Protect from colds only|GS_MEAT', 'Make the body hot|GS_MEAT'], 'Eggs, fish and beans are body-building foods.'),
    Q('Sukuma wiki and mangoes are which kind of food?', 'Protective', ['Body-building|GS_FRUIT', 'Energy-giving|GS_FRUIT', 'Drinks|GS_FRUIT'], 'Vegetables and fruits are protective foods.'),
    Q('Which of these is an energy-giving food?', 'Rice', ['Beans|GS_MEAT', 'Spinach|GS_FRUIT', 'Fish|GS_MEAT'], 'Rice gives energy.'),
    Q('Which of these is a body-building food?', 'Meat', ['Chapati|GS_UGALI', 'Orange|GS_FRUIT', 'Sweet potato|GS_UGALI'], 'Meat helps the body grow and mend.'),
  ], { h: ['Which job does the food mainly do?', 'Energy: ugali, rice. Body-building: beans, meat, fish, eggs. Protective: vegetables, fruits.'], s1: 'Think about the job the food does.' })),
  fam('meal.group.story', `${BA}GROUPS_SORT`, 'word', 2, choose([
    Q('Kiplagat runs a race. Which food gives him energy?', 'A bowl of ugali', ['A plate of sukuma wiki|GS_FRUIT', 'A boiled egg|GS_MEAT', 'A mango|GS_FRUIT'], 'Ugali is an energy food.'),
    Q('Wanza has a cut on her knee that needs to heal. Which food builds the body to help it mend?', 'Beans', ['Chapati|GS_UGALI', 'Rice|GS_UGALI', 'Sweet potato|GS_UGALI'], 'Beans are body-building.'),
    Q('Mama Njambi tells the children to eat greens and fruit so they do not get ill. What kind of food are they?', 'Protective food', ['Body-building food|GS_FRUIT', 'Energy food|GS_FRUIT', 'Fuel for the stove|GS_FRUIT'], 'Greens and fruits are protective.'),
    Q('Which of these is the odd one out: ugali, rice, chapati, fish?', 'Fish', ['Ugali|GS_UGALI', 'Rice|GS_UGALI', 'Chapati|GS_UGALI'], 'Fish is body-building. The others give energy.'),
    Q('Which of these is the odd one out: milk, eggs, managu, meat?', 'Managu', ['Milk|GS_MEAT', 'Eggs|GS_MEAT', 'Meat|GS_MEAT'], 'Managu is protective. The others build the body.'),
  ], { h: ['What does the body need from this food?', 'Energy foods, body-building foods and protective foods.'], s1: 'Find the group of each food.' })),

  // ---------------------------------------------------------------- MEAL_PICK
  fam('meal.pick.which', `${BA}MEAL_PICK`, 'direct', 1, choose([
    Q('Which plate is a balanced meal?', 'Ugali, beans and sukuma wiki', ['Ugali, rice and chapati|MP_ONE', 'Rice, chapati and bread|MP_ONE', 'Ugali and a bottle of soda|MP_SWEET'], 'It has energy, body-building and protective foods.'),
    Q('A child eats ugali and fish. What is missing?', 'A protective food such as sukuma wiki', ['Nothing is missing|MP_NOVEG', 'A bottle of soda|MP_SWEET', 'More ugali|MP_ONE'], 'Add vegetables or fruit.'),
    Q('Which one makes a meal more balanced?', 'A fruit', ['A bottle of soda|MP_SWEET', 'A sweet|MP_SWEET', 'A biscuit|MP_SWEET'], 'A fruit gives protective food.'),
    Q('A plate has rice, chapati and sweet potato. Which group is missing?', 'Body-building and protective', ['None, it has three foods|MP_ONE', 'Energy|MP_ONE', 'Drinks|MP_SWEET'], 'All three are energy foods.'),
    Q('Which plate has all three groups?', 'Rice, fish and spinach', ['Rice, bread and chapati|MP_ONE', 'Meat, fish and eggs|MP_ONE', 'Cake, sweets and soda|MP_SWEET'], 'It has one food from each group.'),
  ], { h: ['Sort each food into a group. Count the groups.', 'A balanced plate has an energy, a body-building and a protective food.'], s1: 'Name the group of each food on the plate.' })),
  fam('meal.pick.story', `${BA}MEAL_PICK`, 'word', 2, choose([
    Q('Mama Ochieng has rice, beans and spinach for supper. Is it balanced?', 'Yes, it has all three groups', ['No, it needs a soda|MP_SWEET', 'No, it needs more rice|MP_ONE', 'No, vegetables do not count|MP_NOVEG'], 'Rice, beans and spinach cover all three groups.'),
    Q('Hassan\'s lunch is ugali and beans. What should he add to make it balanced?', 'Sukuma wiki or a fruit', ['More ugali|MP_ONE', 'A soda|MP_SWEET', 'A second helping of beans|MP_NOVEG'], 'A protective food is missing.'),
    Q('Faith says soda makes her plate balanced. What is the best reply?', 'Soda gives only sugar, not a food group', ['Soda is a protective food|MP_SWEET', 'Soda is a body-building food|MP_SWEET', 'Soda is an energy and body-building food|MP_SWEET'], 'Soda is not a food group.'),
    Q('Kamau\'s plate is chapati, bread and mandazi. How can he fix it?', 'Add beans and a vegetable', ['Add more bread|MP_ONE', 'Add a sweet|MP_SWEET', 'Add nothing, it is fine|MP_ONE'], 'He needs body-building and protective foods.'),
    Q('Which breakfast is balanced?', 'Porridge, an egg and an orange', ['Porridge and a biscuit|MP_NOVEG', 'Tea, bread and mandazi|MP_ONE', 'A bottle of soda and a sweet|MP_SWEET'], 'This breakfast has all three groups.'),
  ], { h: ['Which groups are on the plate?', 'Add the group that is missing.'], s1: 'Name the group of each food.' })),
  fam('meal.pick.spot', `${BA}MEAL_PICK`, 'spot', 3, spot([
    S('Mercy plans a balanced lunch. Which step has the mistake?', ['Step 1: Ugali gives energy.', 'Step 2: Beans build the body.', '!Step 3: A soda gives the protective food.'], 'Soda gives sugar only. Sukuma wiki or fruit is the protective food.', 'MP_SWEET'),
    S('Kelvin plans supper. Which step has the mistake?', ['Step 1: I will cook rice.', '!Step 2: I will add chapati and bread, so it is balanced.', 'Step 3: I will wash my hands first.'], 'Rice, chapati and bread are all energy foods. Add beans and a vegetable.', 'MP_ONE'),
    S('Anne plans breakfast. Which step has the mistake?', ['Step 1: Porridge gives energy.', 'Step 2: An egg builds the body.', '!Step 3: We do not need a fruit, so the meal is balanced.'], 'A fruit or vegetable gives the protective food.', 'MP_NOVEG'),
    S('Dan says what makes a balanced lunch. Which step has the mistake?', ['Step 1: A balanced meal has an energy food.', '!Step 2: It has only energy foods but a lot of them.', 'Step 3: It has body-building and protective foods.'], 'A balanced meal has all the groups.', 'MP_ONE'),
    S('Rose explains how to fix a plate of ugali and fish. Which step has the mistake?', ['Step 1: Ugali gives energy.', 'Step 2: Fish builds the body.', '!Step 3: Add a biscuit to protect the body.'], 'Add a vegetable or fruit to protect the body.', 'MP_SWEET'),
  ], { h: ['Which step gets a food group wrong?', 'Energy, body-building and protective foods together.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- COOKING_METHODS
  fam('cook.meth.which', `${CO}COOKING_METHODS`, 'direct', 1, choose([
    Q('In steaming, where is the food?', 'Above the water, cooked by the steam', ['Inside the boiling water|CMT_STEAM', 'In hot oil|CMT_STEAM', 'On the fire with no water|CMT_STEAM'], 'The steam cooks the food.'),
    Q('What is used in shallow frying?', 'A little oil in a pan', ['A pot full of oil to cover the food|CMT_FRY', 'No oil at all|CMT_FRY', 'Boiling water|CMT_FRY'], 'Chapati and eggs are shallow fried.'),
    Q('How is a maize cob roasted?', 'Over a fire, with dry heat', ['In a pot of boiling water|CMT_ROAST', 'In a pot of oil|CMT_ROAST', 'Above boiling water|CMT_ROAST'], 'Roasting uses dry heat.'),
    Q('Which method cooks food in bubbling water?', 'Boiling', ['Steaming|CMT_STEAM', 'Roasting|CMT_ROAST', 'Shallow frying|CMT_FRY'], 'Boiling cooks food in bubbling water.'),
    Q('Which of these is cooked by shallow frying?', 'An egg', ['Githeri|CMT_FRY', 'A maize cob over the fire|CMT_FRY', 'Rice in water|CMT_FRY'], 'An egg can be fried in a little oil.'),
  ], { h: ['Think about what the food touches: water, steam, oil or fire.', 'Boiling uses water. Steaming uses steam. Roasting uses dry heat. Shallow frying uses a little oil.'], s1: 'Think about what cooks the food.' })),
  fam('cook.meth.story', `${CO}COOKING_METHODS`, 'word', 2, choose([
    Q('Mama Naliaka cooks githeri in a pot of bubbling water. Which method is this?', 'Boiling', ['Steaming|CMT_STEAM', 'Roasting|CMT_ROAST', 'Shallow frying|CMT_FRY'], 'Githeri is boiled.'),
    Q('Wanyama puts sweet potato on a rack above boiling water and covers it. Which method is this?', 'Steaming', ['Boiling|CMT_STEAM', 'Roasting|CMT_ROAST', 'Shallow frying|CMT_FRY'], 'The steam cooks the food above the water.'),
    Q('A boy roasts maize on a jiko at the roadside. Which method is this?', 'Roasting', ['Boiling|CMT_ROAST', 'Steaming|CMT_ROAST', 'Shallow frying|CMT_ROAST'], 'Roasting uses dry heat.'),
    Q('Auntie Joy pours a spoon of oil in a pan and fries chapati. Which method is this?', 'Shallow frying', ['Boiling|CMT_FRY', 'Roasting|CMT_FRY', 'Steaming|CMT_FRY'], 'Chapati is shallow fried in a little oil.'),
    Q('Peter says shallow frying needs a deep pot full of oil. What is the best reply?', 'Shallow frying uses only a little oil in a pan', ['He is right, the oil must cover the food|CMT_FRY', 'Shallow frying uses no oil|CMT_FRY', 'Shallow frying uses boiling water|CMT_FRY'], 'Shallow frying uses a little oil.'),
  ], { h: ['What does the food touch while cooking?', 'Water, steam, dry heat or a little oil.'], s1: 'Think about what cooks the food.' })),

  // ---------------------------------------------------------------- COOKING_SUIT
  fam('cook.suit.which', `${CO}COOKING_SUIT`, 'direct', 1, choose([
    Q('Which method suits dry beans best?', 'Boiling', ['Shallow frying|CS_FRYALL', 'Roasting on a stick|CS_FRYALL', 'Frying in a pan|CS_FRYALL'], 'Dry beans are hard and need a long time in boiling water.'),
    Q('What is the right cooking time for sukuma wiki?', 'For a short time, until just soft and still green', ['For a very long time until brown|CS_OVER', 'For two hours|CS_OVER', 'Until it turns black|CS_OVER'], 'Overcooked greens lose colour and goodness.'),
    Q('Which food needs the longest time to cook?', 'Dry beans', ['Spinach|CS_SHORT', 'An egg|CS_SHORT', 'Sliced cabbage|CS_SHORT'], 'Hard foods need a long time.'),
    Q('Which method suits a maize cob?', 'Roasting', ['Soaking in cold water|CS_FRYALL', 'Shallow frying in a pan|CS_FRYALL', 'Keeping it in a cold box|CS_FRYALL'], 'A maize cob can be roasted or boiled.'),
    Q('Which method suits an egg?', 'Shallow frying or boiling', ['Roasting on the fire|CS_FRYALL', 'Soaking for hours|CS_SHORT', 'Cooking for two hours|CS_OVER'], 'Eggs are boiled or fried.'),
  ], { h: ['Is the food hard or soft? What does it need?', 'Hard foods are boiled for a long time. Green vegetables are cooked briefly.'], s1: 'Think about how hard the food is.' })),
  fam('cook.suit.story', `${CO}COOKING_SUIT`, 'word', 2, choose([
    Q('Mama Wanjala fries dry beans in a pan and they stay hard. What should she do?', 'Boil them for a long time', ['Fry them longer|CS_FRYALL', 'Roast them over the fire|CS_FRYALL', 'Cook them for a minute|CS_SHORT'], 'Dry beans need boiling.'),
    Q('Joseph boils spinach for an hour. It turns brown and tastes bad. What went wrong?', 'It was cooked for too long', ['It was not cooked enough|CS_OVER', 'It was too fresh|CS_OVER', 'It needed more oil|CS_FRYALL'], 'Cook greens only until soft.'),
    Q('The school cook has beans and spinach to cook for lunch. Which should go on the fire first?', 'The beans', ['The spinach|CS_SHORT', 'Both at once for the same time|CS_SHORT', 'Neither, they are cooked raw|CS_SHORT'], 'Beans take much longer than spinach.'),
    Q('Njeri wants chapati. Which method will she use?', 'Shallow frying', ['Steaming|CS_FRYALL', 'Boiling in a pot|CS_FRYALL', 'Roasting on a stick|CS_FRYALL'], 'Chapati is shallow fried.'),
    Q('Why should green vegetables not be overcooked?', 'They lose their colour and goodness', ['They become too hard|CS_OVER', 'They are safer when overcooked|CS_OVER', 'They become better for you|CS_OVER'], 'Overcooking spoils vegetables.'),
  ], { h: ['Which method suits the food? How long?', 'Hard foods need a long time. Vegetables need a short time.'], s1: 'Think about how hard the food is.' })),

  // ---------------------------------------------------------------- COOKING_SAFE
  fam('cook.safe.which', `${CO}COOKING_SAFE`, 'direct', 1, choose([
    Q('How should the handle of a pot on the stove be turned?', 'Inwards, away from the edge', ['Sticking out, so it is easy to reach|CF_HANDLE', 'Over the edge, towards the door|CF_HANDLE', 'Over the fire|CF_HANDLE'], 'A handle that sticks out can be knocked.'),
    Q('The oil in a pan catches fire. What should be done?', 'Cover it with a lid and call a grown-up', ['Pour water on it|CF_WATERFIRE', 'Throw a cup of water on it|CF_WATERFIRE', 'Fan it hard|CF_WATERFIRE'], 'Water spreads burning oil. A lid puts it out.'),
    Q('The pot is on the fire. What should the cook do?', 'Stay near and watch the pot', ['Go out and play, it will be fine|CF_LEAVE', 'Go to sleep|CF_LEAVE', 'Leave the house|CF_LEAVE'], 'A fire must never be left alone.'),
    Q('What should you do before you start cooking?', 'Wash your hands with soap', ['Wipe your hands on your clothes|CF_LEAVE', 'Nothing, start at once|CF_LEAVE', 'Put on a perfume|CF_LEAVE'], 'Clean hands keep the food clean.'),
    Q('How should a hot pot be held?', 'With a thick cloth', ['With bare hands|CF_HANDLE', 'With wet hands|CF_HANDLE', 'With a plastic bag|CF_HANDLE'], 'A thick dry cloth protects the hands.'),
  ], { h: ['What keeps you safe near the fire?', 'Handle inwards, no water on oil, never leave a fire, cloth for hot pots.'], s1: 'Think about what is dangerous.' })),
  fam('cook.safe.story', `${CO}COOKING_SAFE`, 'word', 2, choose([
    Q('Baby sister is walking in the kitchen. The pot handle sticks out. What should Wangari do?', 'Turn the handle inwards', ['Leave it, it is easy to reach|CF_HANDLE', 'Move the pot to the floor|CF_HANDLE', 'Tell the baby to be careful|CF_HANDLE'], 'A handle that sticks out can be knocked and the food spills.'),
    Q('Oil in Atieno\'s pan flames up. A boy shouts "Water!" What should Atieno do?', 'Put a lid on the pan', ['Throw water on it|CF_WATERFIRE', 'Fan the flames|CF_WATERFIRE', 'Run away and leave it|CF_LEAVE'], 'A lid shuts out the air.'),
    Q('Kimani leaves the beans on the fire and goes to play football. What can happen?', 'The pot can boil dry and burn', ['The beans cook faster|CF_LEAVE', 'The fire goes out and is safe|CF_LEAVE', 'Nothing can happen|CF_LEAVE'], 'A fire must be watched.'),
    Q('Why do we wipe the table and wash the pots after cooking?', 'To keep the kitchen clean and stop pests', ['To make more work|CF_LEAVE', 'To spoil the cloth|CF_LEAVE', 'Because rats like clean tables|CF_LEAVE'], 'A clean kitchen keeps flies and rats away.'),
    Q('Nancy needs to lift a hot sufuria. What should she use?', 'A thick dry cloth', ['Her bare hands|CF_HANDLE', 'A wet cloth|CF_HANDLE', 'Her sleeve only|CF_HANDLE'], 'A wet cloth can let the heat through.'),
  ], { h: ['What could go wrong? What keeps the cook safe?', 'Handle inwards, a lid for an oil fire, never leave a fire.'], s1: 'Think about what is dangerous.' })),
  fam('cook.safe.spot', `${CO}COOKING_SAFE`, 'spot', 3, spot([
    S('Mwanaisha explains how she cooks safely. Which step has the mistake?', ['Step 1: I wash my hands.', '!Step 2: I turn the pot handle outwards to reach it.', 'Step 3: I use a cloth to lift the pot.'], 'Turn the handle inwards, away from the edge.', 'CF_HANDLE'),
    S('Kiprop tells what to do in a kitchen fire. Which step has the mistake?', ['Step 1: I call a grown-up.', '!Step 2: I pour water on the burning oil.', 'Step 3: I cover the pan with a lid.'], 'Water spreads burning oil. Use a lid.', 'CF_WATERFIRE'),
    S('Hellen describes cooking githeri. Which step has the mistake?', ['Step 1: I wash my hands.', 'Step 2: I light the fire with a grown-up.', '!Step 3: I leave the fire alone while the beans boil.'], 'A cooking fire must not be left alone.', 'CF_LEAVE'),
    S('Ian explains how to start cooking. Which step has the mistake?', ['Step 1: I wash my hands with soap.', '!Step 2: I leave the handle sticking out so it is easy to grab.', 'Step 3: I stay near the pot.'], 'A handle that sticks out can be knocked.', 'CF_HANDLE'),
    S('Joy says what to do about an oil fire. Which step has the mistake?', ['Step 1: I stay calm.', 'Step 2: I turn off the heat if I can.', '!Step 3: I throw a bucket of water on the pan.'], 'Cover the pan with a lid instead of using water.', 'CF_WATERFIRE'),
  ], { h: ['Which step is dangerous?', 'Handle inwards, a lid for an oil fire, never leave a fire.'], s1: 'Check each step against what you know.' })),
];
