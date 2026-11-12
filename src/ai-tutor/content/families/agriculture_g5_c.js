// ============================================================================
// GRADE 5 AGRICULTURE AND NUTRITION, STRAND 2 (PART 2): FOOD NUTRIENTS AND COOKING FOOD (6 skills).
// What each nutrient does, which foods are rich in it, nutritional diseases and how to prevent them, dry fat frying and deep frying,
// and safe frying. Written offline from the KICD 2024 design through the curriculum map. The questions test the knowledge behind the
// practical outcome (cooking and serving food); the cooking itself is a teacher task. Every wrong answer names the library
// misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g5_lib.js';

const NU = 'FOOD_P.FOOD_NUTRIENTS.', CO = 'FOOD_P.COOKING_FOOD.';

export const FAMILIES = [
  // ---------------------------------------------------------------- NUTRIENT_FUNCTIONS
  fam('nu.fn.which', `${NU}NUTRIENT_FUNCTIONS`, 'direct', 1, choose([
    Q('Which nutrient builds and repairs the body?', 'Proteins', ['Carbohydrates|NUT_PROT_ENERGY', 'Vitamins|NUT_PROT_ENERGY', 'Water only|NUT_PROT_ENERGY'], 'Proteins build new body parts and repair worn ones.'),
    Q('Which nutrient gives the body most of its energy?', 'Carbohydrates', ['Proteins|NUT_PROT_ENERGY', 'Vitamins|NUT_VIT_ENERGY', 'Minerals|NUT_VIT_ENERGY'], 'Foods such as ugali and rice are rich in carbohydrates, so they give energy.'),
    Q('What do vitamins do in the body?', 'Protect it and keep it healthy', ['Give most of its energy|NUT_VIT_ENERGY', 'Make it taller only|NUT_VIT_ENERGY', 'Make it warmer only|NUT_FAT_BAD'], 'Vitamins protect the body from illness.'),
    Q('What is one job of fats in the body?', 'They store energy and keep it warm', ['They do nothing useful|NUT_FAT_BAD', 'They only make people ill|NUT_FAT_BAD', 'They build the bones only|NUT_FAT_BAD'], 'Fats store energy and keep the body warm. A little is needed.'),
    Q('Which mineral helps to make strong bones and teeth?', 'Calcium', ['Iodine|NUT_VIT_ENERGY', 'Sugar|NUT_VIT_ENERGY', 'Salt|NUT_VIT_ENERGY'], 'Calcium builds bones and teeth. Milk and small fish such as omena have it.'),
  ], { h: ['Each nutrient has its own job.', 'Carbohydrates: energy. Proteins: grow and repair. Vitamins: protect.'], s1: 'Match the nutrient with its job.' })),
  fam('nu.fn.story', `${NU}NUTRIENT_FUNCTIONS`, 'word', 2, choose([
    Q('A growing child needs new muscles. Which nutrient is most needed?', 'Proteins', ['Carbohydrates|NUT_PROT_ENERGY', 'Vitamins|NUT_PROT_ENERGY', 'Fats|NUT_PROT_ENERGY'], 'Proteins build and repair the body.'),
    Q('Wanjiru runs a long race and needs quick energy. Which food nutrient helps her most?', 'Carbohydrates', ['Proteins|NUT_PROT_ENERGY', 'Vitamins|NUT_VIT_ENERGY', 'Minerals|NUT_VIT_ENERGY'], 'Carbohydrates give energy.'),
    Q('Otieno says vitamins give much energy. What is the best reply?', 'They protect the body, but energy comes from carbohydrates', ['He is right, they give the most|NUT_VIT_ENERGY', 'They give energy and nothing else|NUT_VIT_ENERGY', 'They build the muscles of the body|NUT_VIT_ENERGY'], 'Vitamins protect against illness.'),
    Q('Amina says fats are always bad for the body. What is true?', 'A little fat stores energy and keeps us warm', ['Fats are always harmful|NUT_FAT_BAD', 'Fats do the job of vitamins|NUT_FAT_BAD', 'Fats are never found in food|NUT_FAT_BAD'], 'The body needs some fat, though not too much.'),
    Q('A doctor tells a family to eat iron-rich food. Which part of the body needs iron?', 'The blood', ['The hair|NUT_VIT_ENERGY', 'The nails|NUT_VIT_ENERGY', 'The skin only|NUT_VIT_ENERGY'], 'Iron helps blood carry air around the body.'),
  ], { h: ['Which nutrient does this job?', 'Energy: carbohydrates. Growth and repair: proteins. Protection: vitamins.'], s1: 'Match the need with the nutrient.' })),

  // ---------------------------------------------------------------- FOOD_GROUPS
  fam('nu.fg.which', `${NU}FOOD_GROUPS`, 'direct', 1, choose([
    Q('Which group is ugali in?', 'Energy foods (carbohydrates)', ['Body-building foods (proteins)|GRP_FILLING', 'Protective foods (vitamins)|GRP_PLANT_VIT', 'Body-building foods and fats|GRP_FILLING'], 'Ugali is made from maize and is rich in carbohydrates.'),
    Q('Which group is an egg in?', 'Body-building foods (proteins)', ['Energy foods (carbohydrates)|GRP_MILK_ENERGY', 'Protective foods (vitamins)|GRP_MILK_ENERGY', 'Energy foods and fats|GRP_MILK_ENERGY'], 'Eggs, milk, beans and fish are rich in protein.'),
    Q('Which group is sukuma wiki in?', 'Protective foods (vitamins and minerals)', ['Energy foods (carbohydrates)|GRP_PLANT_VIT', 'Body-building foods (proteins)|GRP_PLANT_VIT', 'Energy foods and proteins|GRP_PLANT_VIT'], 'Green leaves are rich in vitamins and minerals.'),
    Q('Which of these is a carbohydrate food?', 'Cassava', ['Mango|GRP_PLANT_VIT', 'Spinach|GRP_PLANT_VIT', 'Oranges|GRP_PLANT_VIT'], 'Cassava, rice and sweet potatoes are energy foods. Mango, spinach and oranges give vitamins.'),
    Q('Which nutrient is cooking oil rich in?', 'Fats', ['Proteins|GRP_BUTTER_PROT', 'Vitamins|GRP_BUTTER_PROT', 'Carbohydrates|GRP_BUTTER_PROT'], 'Cooking oil and butter are fats.'),
  ], { h: ['Think about what each food is mostly made of.', 'Ugali, rice, cassava: energy. Eggs, beans, fish, milk: body-building. Green leaves, fruit: protective.'], s1: 'Think of the main nutrient of the food.' })),
  fam('nu.fg.table', `${NU}FOOD_GROUPS`, 'table', 2, choose([
    Q('Look at the table. Which food gives the body most energy?', 'Ugali', ['Sukuma wiki|GRP_PLANT_VIT', 'Beans|GRP_MILK_ENERGY', 'Eggs|GRP_MILK_ENERGY'], 'Ugali is a carbohydrate food. Sukuma wiki gives vitamins, and beans and eggs give protein.', { t: { head: ['Food', 'Eaten with'], rows: [['Ugali', 'Sukuma wiki'], ['Rice', 'Beans'], ['Chapati', 'Eggs']] } }),
    Q('In the table, which food eaten with rice is rich in protein?', 'Beans', ['Cooking oil|GRP_BUTTER_PROT', 'Cabbage|GRP_PLANT_VIT', 'Ugali|GRP_FILLING'], 'Beans build the body, so they are protein foods.', { t: { head: ['Meal', 'Foods'], rows: [['Lunch', 'Rice, beans, cooking oil'], ['Supper', 'Ugali, cabbage']] } }),
    Q('In the table, which food is rich in protein and builds the body?', 'Fish', ['Ugali|GRP_FILLING', 'Rice|GRP_FILLING', 'Cabbage|GRP_PLANT_VIT'], 'Fish is a protein food. Ugali and rice give energy, and cabbage gives vitamins.', { t: { head: ['Meal', 'Foods'], rows: [['Lunch', 'Rice, cabbage'], ['Supper', 'Ugali, fish, spinach']] } }),
    Q('Which food in the table gives mainly body-building protein?', 'Eggs', ['Sweet potato|GRP_MILK_ENERGY', 'Chapati|GRP_MILK_ENERGY', 'Ugali|GRP_FILLING'], 'Eggs are rich in protein.', { t: { head: ['Food', 'Eaten with'], rows: [['Chapati', 'Eggs'], ['Sweet potato', 'Milk'], ['Ugali', 'Sukuma wiki']] } }),
    Q('Which meal in the table has an energy food, a body-building food and a protective food?', 'Supper', ['Breakfast|GRP_FILLING', 'Neither meal|GRP_FILLING', 'Both of the meals|GRP_FILLING'], 'Supper has ugali for energy, fish for the body and spinach for protection. Breakfast has only energy foods.', { t: { head: ['Meal', 'Foods'], rows: [['Breakfast', 'Tea and bread'], ['Supper', 'Ugali, fish, spinach']] } }),
  ], { h: ['Find the food in the table, then think about its main nutrient.', 'Ugali: energy. Beans, eggs, fish: body-building. Green leaves: protective.'], s1: 'Read the table and sort the foods.' })),

  // ---------------------------------------------------------------- DEFICIENCY_DISEASES
  fam('nu.dd.which', `${NU}DEFICIENCY_DISEASES`, 'direct', 1, choose([
    Q('A child has swollen legs and belly and eats little protein. Which disease is this?', 'Kwashiorkor', ['Marasmus|DIS_SWAP', 'Goitre|DIS_SWAP', 'Anaemia|DIS_SWAP'], 'Kwashiorkor shows swollen legs, face and belly, from too little protein.'),
    Q('A very thin child who has had too little food of all kinds has which disease?', 'Marasmus', ['Kwashiorkor|DIS_SWAP', 'Goitre|DIS_SWAP', 'Anaemia|DIS_SWAP'], 'Marasmus is a wasted, very thin body from too little food overall.'),
    Q('A swelling at the front of the neck can come from too little of which mineral?', 'Iodine', ['Calcium|DIS_CAUSE', 'Iron|DIS_CAUSE', 'Sugar|DIS_CAUSE'], 'Goitre comes from too little iodine.'),
    Q('Pale skin, tiredness and dizziness can come from too little of which mineral?', 'Iron', ['Calcium|DIS_CAUSE', 'Iodine|DIS_CAUSE', 'Salt|DIS_CAUSE'], 'Anaemia comes from too little iron in the blood.'),
    Q('Can a child catch kwashiorkor from a friend?', 'No, it is caused by poor food', ['Yes, by touching|DIS_CATCH', 'Yes, by sharing a cup|DIS_CATCH', 'Yes, by playing together|DIS_CATCH'], 'Lack of a nutrient is not an infection.'),
  ], { h: ['Each disease comes from a lack of something in the food.', 'Kwashiorkor: protein. Marasmus: all food. Goitre: iodine. Anaemia: iron.'], s1: 'Match the signs with what is missing.' })),
  fam('nu.dd.story', `${NU}DEFICIENCY_DISEASES`, 'word', 2, choose([
    Q('At the clinic, a toddler has a swollen belly and thin, pale hair. The family eats mostly maize. Which disease is likely?', 'Kwashiorkor', ['Marasmus|DIS_SWAP', 'Goitre|DIS_SWAP', 'A cold|DIS_CATCH'], 'Too little protein causes kwashiorkor.'),
    Q('During a long drought, a child is very thin and weak because the family had very little food. Which disease is this?', 'Marasmus', ['Kwashiorkor|DIS_SWAP', 'Goitre|DIS_SWAP', 'Anaemia|DIS_SWAP'], 'Marasmus comes from too little food overall.'),
    Q('Mama Wanjiru has a swelling at the front of her neck and lives far from the sea where iodised salt is hard to get. Which problem is this?', 'Goitre', ['Anaemia|DIS_CAUSE', 'Kwashiorkor|DIS_CAUSE', 'Marasmus|DIS_CAUSE'], 'Goitre is caused by too little iodine.'),
    Q('Hassan feels tired, his palms are pale and he eats little meat or green leaves. Which problem could this be?', 'Anaemia', ['Goitre|DIS_CAUSE', 'Marasmus|DIS_CAUSE', 'Kwashiorkor|DIS_CAUSE'], 'Anaemia is from too little iron.'),
    Q('Two sisters share a room. One has anaemia. Will the other catch it?', 'No, it is not a germ illness', ['Yes, by sharing the room|DIS_CATCH', 'Yes, by sharing the bed|DIS_CATCH', 'Yes, by sharing a plate|DIS_CATCH'], 'It comes from a lack of iron, not from germs.'),
  ], { h: ['What is missing from the food?', 'These diseases are not caught from other people.'], s1: 'Match the signs and the food with the disease.' })),

  // ---------------------------------------------------------------- DISEASE_PREVENTION
  fam('nu.dp.which', `${NU}DISEASE_PREVENTION`, 'direct', 1, choose([
    Q('Which salt helps to prevent goitre?', 'Iodised salt', ['Any salt without iodine|PREV_SALT', 'Salt from a rock|PREV_SALT', 'Salt used only for cooking|PREV_SALT'], 'Only iodised salt carries iodine.'),
    Q('Which foods help prevent kwashiorkor?', 'Beans, eggs, fish and milk', ['Only maize|PREV_ONE_FOOD', 'Only sweets and sodas|PREV_ONE_FOOD', 'Only plain ugali|PREV_ONE_FOOD'], 'These are rich in protein.'),
    Q('Which foods help prevent anaemia?', 'Liver, meat and dark green leaves', ['Only sugar and tea|PREV_ONE_FOOD', 'Only white bread|PREV_ONE_FOOD', 'Only sodas|PREV_ONE_FOOD'], 'They contain iron.'),
    Q('Which meal protects a family best from nutritional diseases?', 'Ugali with beans and sukuma wiki', ['Only ugali as much as they want|PREV_ONE_FOOD', 'Only tea and bread|PREV_ONE_FOOD', 'Only a bowl of rice|PREV_ONE_FOOD'], 'A varied meal has all the nutrients.'),
    Q('How is kwashiorkor best prevented?', 'With enough protein foods', ['Only with medicine|PREV_MEDICINE', 'Only with sweet drinks|PREV_MEDICINE', 'Only with bigger plates|PREV_MEDICINE'], 'Good food is the best protection.'),
  ], { h: ['Prevention is a varied meal.', 'Iodised salt, protein foods, iron foods and many kinds of food.'], s1: 'Match the food with the disease it prevents.' })),
  fam('nu.dp.story', `${NU}DISEASE_PREVENTION`, 'word', 2, choose([
    Q('Mama Atieno buys salt for her family. Which should she choose to prevent goitre?', 'Salt marked iodised', ['The cheapest salt of any kind|PREV_SALT', 'Salt in the biggest bag|PREV_SALT', 'Salt with no label|PREV_SALT'], 'The packet should say iodised.'),
    Q('A family can only afford ugali. A health worker advises what?', 'Add beans, eggs or greens when they can', ['Eat much more ugali and nothing else|PREV_ONE_FOOD', 'Take medicine instead of any food|PREV_MEDICINE', 'Drink only tea with every meal|PREV_ONE_FOOD'], 'Beans and greens add protein and vitamins.'),
    Q('Njoroge is often tired and pale. Which meal might help his body?', 'Ugali with liver and managu', ['Ugali on its own with sweet tea|PREV_ONE_FOOD', 'A plate of chips and a soda|PREV_ONE_FOOD', 'White bread with plenty of jam|PREV_ONE_FOOD'], 'Liver and dark green leaves have iron.'),
    Q('A school feeds children githeri with vegetables. Why is this a good meal?', 'It has energy, protein and vitamins', ['It has energy and nothing else|PREV_ONE_FOOD', 'It has protein and nothing else|PREV_ONE_FOOD', 'It has only water and some salt|PREV_ONE_FOOD'], 'Maize and beans with vegetables is a balanced meal.'),
    Q('A mother thinks medicine alone will cure her toddler\'s kwashiorkor. What does the nurse say?', 'Protein foods are also needed', ['Food has no effect on this illness|PREV_MEDICINE', 'Only a long rest will help|PREV_MEDICINE', 'Only a bottle of syrup helps|PREV_MEDICINE'], 'Good food helps the body recover.'),
  ], { h: ['Which food or habit protects the family?', 'A varied diet protects most.'], s1: 'Choose the meal or habit that supplies what is missing.' })),

  // ---------------------------------------------------------------- FRYING_METHODS
  fam('co.fm.which', `${CO}FRYING_METHODS`, 'direct', 1, choose([
    Q('Which method fries food completely covered in hot oil?', 'Deep frying', ['Dry fat frying|FRY_DEEP_LITTLE', 'Shallow frying|FRY_DEEP_LITTLE', 'Boiling in water|FRY_DEEP_LITTLE'], 'In deep frying the food is covered by hot oil.'),
    Q('Sausages are cooked in a pan with no added oil. Which method is this?', 'Dry fat frying', ['Deep frying|FRY_DRY_LOTS', 'Boiling|FRY_DRY_LOTS', 'Baking|FRY_DRY_LOTS'], 'The sausages release their own fat.'),
    Q('Which food is usually deep fried?', 'Mandazi', ['Sausages|FRY_MIX', 'Minced meat|FRY_MIX', 'Bacon|FRY_MIX'], 'Mandazi are fried in deep oil.'),
    Q('Which food is usually cooked by dry fat frying?', 'Minced meat', ['Chips|FRY_MIX', 'Mandazi|FRY_MIX', 'Samosas|FRY_MIX'], 'Minced meat has its own fat.'),
    Q('How much oil does deep frying use?', 'Enough to cover the food', ['A teaspoon in the pan|FRY_DEEP_LITTLE', 'A thin film at the bottom|FRY_DEEP_LITTLE', 'None, the food makes its own|FRY_DRY_LOTS'], 'The food floats in the oil.'),
  ], { h: ['Think about how much oil the method needs.', 'Deep: food covered in oil. Dry fat: food releases its own fat.'], s1: 'Match the method with the oil and the food.' })),
  fam('co.fm.story', `${CO}FRYING_METHODS`, 'word', 2, choose([
    Q('Mama Njeri heats a pan, adds no oil and puts in sausages. Which method is she using?', 'Dry fat frying', ['Deep frying|FRY_DRY_LOTS', 'Steaming|FRY_DRY_LOTS', 'Baking|FRY_DRY_LOTS'], 'The sausages give out their own fat.'),
    Q('At the market, the vendor drops chips into a big pan of hot oil. Which method is this?', 'Deep frying', ['Dry fat frying|FRY_DEEP_LITTLE', 'Steaming|FRY_DEEP_LITTLE', 'Boiling|FRY_DEEP_LITTLE'], 'The chips are covered in oil.'),
    Q('Otieno says mandazi need only a spoonful of oil. What is the best reply?', 'They need enough oil to cover them', ['He is right, a spoon is enough|FRY_DEEP_LITTLE', 'They need no oil at all|FRY_DRY_LOTS', 'They need a drop of water instead|FRY_DEEP_LITTLE'], 'Mandazi are deep fried.'),
    Q('Wanjiku wants to fry bacon. Which method suits it best?', 'Dry fat frying', ['Deep frying in a pot of oil|FRY_MIX', 'Boiling in water|FRY_MIX', 'Baking in water|FRY_MIX'], 'Bacon releases fat as it cooks.'),
    Q('Which of these pairs of food and method is correct?', 'Samosas: deep frying', ['Samosas: dry fat frying|FRY_MIX', 'Sausages: deep frying|FRY_MIX', 'Mince: deep frying|FRY_MIX'], 'Samosas are deep fried. Sausages and mince use their own fat.'),
  ], { h: ['Is the food covered in oil, or cooked in its own fat?', 'Mandazi, chips, samosas: deep. Sausages, mince, bacon: dry fat.'], s1: 'Decide from how much oil the cook uses.' })),

  // ---------------------------------------------------------------- FRYING_SAFETY
  fam('co.fs.which', `${CO}FRYING_SAFETY`, 'direct', 1, choose([
    Q('A pan of oil catches fire. What should you do?', 'Cover it with a lid and turn off the heat', ['Pour water on it|FSAFE_WATER', 'Carry it outside quickly|FSAFE_WATER', 'Blow on it hard|FSAFE_WATER'], 'Water makes burning oil splash and spread. A lid cuts off the air.'),
    Q('Why should food be dry before it goes into hot oil?', 'Water makes the hot oil spit', ['Wet food cooks faster|FSAFE_WET', 'Wet food tastes better|FSAFE_WET', 'Water makes no difference|FSAFE_WET'], 'The spitting oil can burn you.'),
    Q('How full should the pan be for deep frying?', 'No more than half full', ['Right to the top|FSAFE_FULL', 'Filled to the very rim|FSAFE_FULL', 'Almost full for more food|FSAFE_FULL'], 'Oil bubbles up when food goes in.'),
    Q('Hot oil is on the stove and the phone rings. What do you do?', 'Turn off the heat first', ['Go and answer, the oil will wait|FSAFE_LEAVE', 'Leave it on and chat outside|FSAFE_LEAVE', 'Leave it for a few minutes|FSAFE_LEAVE'], 'Never leave hot oil alone.'),
    Q('Which is a good way to serve fried food?', 'Hot, on a clean plate, with clean hands', ['Cold, on a dirty plate|FSAFE_LEAVE', 'On the floor of the kitchen|FSAFE_LEAVE', 'Straight from an uncovered pan|FSAFE_LEAVE'], 'Clean hands and plates keep food safe.'),
  ], { h: ['Think about what could burn or spill.', 'Dry food, half-full pan, lid for a fire, never leave hot oil.'], s1: 'Think about the safe action.' })),
  fam('co.fs.story', `${CO}FRYING_SAFETY`, 'word', 2, choose([
    Q('Baraka sees flames in the frying pan at school. What is the safest action?', 'Cover with a lid and switch off', ['Throw a cup of water on it|FSAFE_WATER', 'Pour a bucket of water over it|FSAFE_WATER', 'Run out to find help first|FSAFE_WATER'], 'Water on burning oil makes it worse.'),
    Q('Njoki washed some fish and puts it straight into hot oil. What happens?', 'The oil spits and can burn her', ['The fish cooks faster and safely|FSAFE_WET', 'The oil goes cold|FSAFE_WET', 'Nothing happens|FSAFE_WET'], 'Dry fish before frying.'),
    Q('Kiprop fills the pan to the top before deep frying. What could go wrong?', 'The oil could bubble over and burn him', ['Nothing, more oil is safer|FSAFE_FULL', 'The food will cook slowly only|FSAFE_FULL', 'The pan will become lighter|FSAFE_FULL'], 'Fill no more than half.'),
    Q('Amina leaves the chips frying to go and talk to a friend. Why is that unsafe?', 'The oil can overheat and catch fire', ['The chips will cook too slowly|FSAFE_LEAVE', 'The pan will get cold|FSAFE_LEAVE', 'It is safe for a short while|FSAFE_LEAVE'], 'Never leave hot oil.'),
    Q('Which is the safest way to put mandazi into hot oil?', 'Lower them in gently, away from your body', ['Throw them in from high up|FSAFE_WET', 'Drop them from a distance, wet|FSAFE_WET', 'Tip a whole tray in at once|FSAFE_FULL'], 'Gentle lowering avoids splashes.'),
  ], { h: ['What could cause a burn?', 'Dry food, half-full pan, never leave, lid for a fire.'], s1: 'Think about the safe step.' })),
  fam('co.fs.spot', `${CO}FRYING_SAFETY`, 'spot', 3, spot([
    S('Mercy explains how she fried mandazi safely. Which step has the mistake?', ['Step 1: I washed my hands and dried the dough.', '!Step 2: I filled the pan to the very top with oil.', 'Step 3: I lowered the mandazi in gently.'], 'Fill the pan no more than half, because oil bubbles up when food goes in.', 'FSAFE_FULL'),
    S('Brian describes a small oil fire. Which step has the mistake?', ['Step 1: I turned off the heat.', '!Step 2: I threw water on the flames.', 'Step 3: I put a lid on the pan.'], 'Never use water on an oil fire. Use a lid.', 'FSAFE_WATER'),
    S('Fatuma explains how she fried fish. Which step has the mistake?', ['Step 1: I heated the oil in a half-full pan.', '!Step 2: I put in the fish straight from the wash water.', 'Step 3: I drained the fish on clean paper.'], 'Dry the fish first, because water makes hot oil spit.', 'FSAFE_WET'),
    S('Peter describes his frying lesson. Which step has the mistake?', ['Step 1: I turned the handle inwards.', 'Step 2: I put in the chips carefully.', '!Step 3: I went to play while the oil was hot.'], 'Never leave hot oil alone.', 'FSAFE_LEAVE'),
    S('Grace explains how she served the food. Which step has the mistake?', ['Step 1: I drained the samosas on clean paper.', 'Step 2: I washed my hands first.', '!Step 3: I put them back into the oil to keep them warm all afternoon.'], 'Serve at once on a clean plate. Oil left on a hot stove is dangerous.', 'FSAFE_LEAVE'),
  ], { h: ['Which step is unsafe?', 'Dry food, half-full pan, lid for a fire, never leave hot oil.'], s1: 'Check each step for safety.' })),
];
