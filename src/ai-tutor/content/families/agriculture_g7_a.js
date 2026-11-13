// ============================================================================
// AGRICULTURE GRADE 7 (14 skills): soil pollution, run-off, keeping nutrients in vegetables, trees, tilth, crop management, animal
// products, cooking methods, animal hygiene, laundering loose colours, knitting, framed suspended gardens, value addition, soap forms.
// Written offline from the KICD design through the curriculum map. Every wrong answer names the library misconception it reveals. All stay
// reviewed:false until an Agriculture teacher signs them off. Only the knowledge outcomes are asked; practical work is marked by the teacher.
// ============================================================================
import { S } from './agriculture_g7_lib.js';
const SP = 'CONSER.CONTROLLING_SOIL_POLLUTI.', WR = 'CONSER.CONSTRUCTING_WATER_RETEN.', FN = 'CONSER.CONSERVING_FOOD_NUTRIENT.', GT = 'CONSER.GROWING_TREES.';
const CE = 'FOOD_P.CROP_ESTABLISHMENT.', CM = 'FOOD_P.SELECTED_CROP_MANAGEMENT.', AP = 'FOOD_P.PREPARING_ANIMAL_PRODUCT.', CF = 'FOOD_P.COOKING_FOOD.';
const HA = 'HYGIEN.HYGIENE_IN_REARING_ANIMA.', LL = 'HYGIEN.LAUNDRY_LOOSE_COLOURED_I.';
const KS = 'PRODUC.KNITTING_SKILLS.', FG = 'PRODUC.CONSTRUCTING_FRAMED_SUSP.', VA = 'PRODUC.ADDING_VALUE_TO_CROP_PRO.', HS = 'PRODUC.MAKING_HOMEMADE_SOAP.';

export const FAMILIES = [
  ...S('sp', SP, 'SOIL_POLLUTION', ['SP_GOOD', 'SP_PLASTIC', 'SP_CONTROL'], ['Too much fertiliser, plastic and dumped waste pollute soil.', 'Reduce, reuse and recycle waste.'], [
    ['What can too much fertiliser do to the soil?', 'Pollute and harm it', 'Make it much healthier', 'Turn it into rich water', 'Make it grow by itself'],
    ['Why is polythene a problem in the soil?', 'It does not rot and blocks water', 'It feeds the plants well', 'It makes the soil sweeter', 'It rots in a single day'],
    ['Which helps to control soil pollution?', 'Reducing and recycling waste', 'Burning plastic on the farm', 'Burying all the rubbish at once', 'Spraying more chemicals'],
    ['Which is a cause of soil pollution?', 'Dumping rubbish on the land', 'Planting trees on the land', 'Using compost on the land', 'Mulching the garden bed'],
    ['Which can pollute the soil?', 'Spilt oil from a machine', 'Rain falling on the farm', 'Shade from a tree', 'Manure used in small amounts'],
  ], [
    ['Wekesa pours used engine oil on his garden. What happens?', 'The soil is polluted', 'The soil becomes healthier', 'The plants grow faster', 'The oil turns to manure'],
    ['A farmer buries polythene bags in the shamba. What is the problem?', 'They do not rot and block water', 'They feed the crops very well', 'They make the soil soft and rich', 'They disappear within a week'],
    ['A school sorts waste and makes compost. What does this do?', 'It helps control soil pollution', 'It pollutes the soil even more', 'It wastes the rubbish and the time', 'It harms the crops in the garden'],
    ['A farmer sprays far too much pesticide. What can happen?', 'The soil and water are polluted', 'The soil is made healthier', 'The crops always grow better', 'The insects become friends'],
    ['A family reuses bottles instead of throwing them away. Why is this good?', 'It reduces waste on the land', 'It spoils the soil', 'It costs more money', 'It causes pollution'],
  ], [
    ['Which step is the mistake?', 'Step 1: Fertiliser feeds crops.', 'Step 2: Too much of it is harmful.', 'Step 3: So more fertiliser always makes the soil healthier.', 'Too much fertiliser pollutes the soil.', 0],
    ['Which step is the mistake?', 'Step 1: Polythene is made of plastic.', 'Step 2: Plastic does not rot easily.', 'Step 3: So buried polythene feeds the plants.', 'Polythene does not rot and blocks water.', 1],
    ['Which step is the mistake?', 'Step 1: Waste can pollute soil.', 'Step 2: We should reduce and reuse it.', 'Step 3: So we should burn plastic on the farm.', 'We reduce and recycle waste.', 2],
    ['Which step is the mistake?', 'Step 1: Oil spills harm the land.', 'Step 2: They pollute the soil.', 'Step 3: So spilt oil is good for crops.', 'Spilt oil pollutes the soil.', 0],
    ['Which step is the mistake?', 'Step 1: Compost is made from plant waste.', 'Step 2: It feeds the soil.', 'Step 3: So compost pollutes the soil.', 'Compost helps the soil.', 2],
  ], ['a', 'b']),
  ...S('ro', WR, 'RUNOFF', ['RO_WASTE', 'RO_STRUCTURE', 'RO_MULCH'], ['Run-off can be trapped and used in the garden.', 'Mulch slows run-off down.'], [
    ['What can be done with surface run-off?', 'Trap it and use it in the garden', 'Nothing, because it is useless', 'Pour it back on the road again', 'Burn it together with the waste'],
    ['Which traps run-off?', 'A trench or a water pan', 'A bare path on a slope', 'A flat rock in the sun', 'A dry heap of sand'],
    ['What does mulch do to run-off?', 'Slows it down', 'Speeds it up', 'Turns it into soil', 'Makes it disappear'],
    ['What is surface run-off?', 'Water flowing over the ground', 'Water deep under the ground', 'Water inside a tank', 'Water inside a plant'],
    ['Which is a use of run-off in gardening?', 'Watering the crops', 'Burning the weeds', 'Drying the seeds', 'Painting the fence'],
  ], [
    ['Rain flows down a slope and floods the road. What can a farmer do?', 'Dig a trench to trap the water', 'Leave it to run away', 'Cover the road with soil', 'Block the garden'],
    ['A farmer digs a zai pit to hold water for maize. What is this?', 'A water retention structure', 'A pit for dumping waste', 'A hole for burying rubbish', 'A well that is always dry'],
    ['A farmer covers the soil with dry grass. What does it do to run-off?', 'Slows it and keeps water', 'Speeds it up', 'Makes it dirty', 'Stops all rain'],
    ['A school collects roof water in a tank. What is this?', 'Using run-off for the garden', 'Wasting water in the school', 'Polluting the water of the school', 'Drying up the water supply'],
    ['A farmer plants on ridges across the slope. Why?', 'To slow the water down', 'To speed the water up', 'To dry the soil', 'To spoil the crop'],
  ], [
    ['Which step is the mistake?', 'Step 1: Rain makes surface run-off.', 'Step 2: The water flows downhill.', 'Step 3: So run-off cannot be used in the garden.', 'Run-off can be trapped and used.', 0],
    ['Which step is the mistake?', 'Step 1: A trench can hold water.', 'Step 2: A water pan also holds water.', 'Step 3: So a bare path traps run-off.', 'A bare path does not trap run-off.', 1],
    ['Which step is the mistake?', 'Step 1: Mulch covers the soil.', 'Step 2: It protects the soil.', 'Step 3: So mulch makes run-off faster.', 'Mulch slows run-off.', 2],
    ['Which step is the mistake?', 'Step 1: Run-off flows over the ground.', 'Step 2: It can carry soil away.', 'Step 3: So it is always harmless.', 'It can erode the soil.', 2],
    ['Which step is the mistake?', 'Step 1: A tank collects water.', 'Step 2: The water can be used later.', 'Step 3: So tanks waste water.', 'Tanks save water.', 2],
  ], ['a', 'b']),
  ...S('nk', FN, 'NUTRIENT_KEEP', ['NK_LONG', 'NK_WATER', 'NK_WASH'], ['Cook vegetables briefly with a lid and little water.', 'Wash before cutting.'], [
    ['How should vegetables be cooked to keep vitamins?', 'A short time with a lid', 'A long time with no lid', 'For a whole afternoon', 'In a lot of open water'],
    ['What should be done with the cooking water?', 'Use it, for example in soup', 'Throw it away at once outside', 'Pour it out on the road', 'Leave it standing to go bad'],
    ['When should vegetables be washed?', 'Before they are cut', 'After they are cut up small', 'After they are cooked', 'Never at all'],
    ['Which keeps vitamins best?', 'Eating some vegetables raw', 'Boiling them until soft and grey', 'Frying them for an hour', 'Soaking them for a day'],
    ['How should vegetables be peeled to keep minerals?', 'Thinly', 'As thickly as possible', 'Cut off the whole outside', 'Not washed first'],
  ], [
    ['Achieng boils sukuma wiki for an hour. What is lost?', 'Many vitamins', 'Nothing at all', 'Only the colour of the pot', 'The salt only'],
    ['Njeri throws away the water from boiled cabbage. What does she lose?', 'Some minerals and vitamins', 'Nothing at all is lost', 'Only some of the heat', 'Only some of the smell'],
    ['Peter cuts spinach into small pieces and then washes it. What is the problem?', 'Vitamins wash away', 'Nothing is wrong', 'The spinach grows again', 'The knife gets dirty'],
    ['Mama steams carrots for five minutes with the lid on. Why is this good?', 'It keeps vitamins and minerals', 'It destroys all the vitamins', 'It wastes the carrots a lot', 'It makes them raw and hard'],
    ['A family eats tomato kachumbari fresh. What does this keep?', 'Vitamins that cooking could lose', 'No vitamins', 'Only salt', 'Only water'],
  ], [
    ['Which step is the mistake?', 'Step 1: Vegetables have vitamins.', 'Step 2: Heat can destroy some vitamins.', 'Step 3: So long boiling keeps them all.', 'Short cooking keeps vitamins.', 0],
    ['Which step is the mistake?', 'Step 1: Minerals dissolve in water.', 'Step 2: Cooking water holds minerals.', 'Step 3: So we should throw the water away.', 'We should use the cooking water.', 2],
    ['Which step is the mistake?', 'Step 1: Washing removes dirt.', 'Step 2: Cut pieces lose vitamins in water.', 'Step 3: So we cut first and then wash.', 'We wash before cutting.', 2],
    ['Which step is the mistake?', 'Step 1: Peeling removes the outer layer.', 'Step 2: Minerals lie near the skin.', 'Step 3: So thick peeling keeps minerals.', 'Peel thinly.', 2],
    ['Which step is the mistake?', 'Step 1: A lid keeps steam in.', 'Step 2: Food cooks faster.', 'Step 3: So a lid destroys vitamins.', 'A lid helps keep vitamins.', 2],
  ], ['a', 'a']),
  ...S('ti', GT, 'TREES_IMPORTANCE', ['TI_DRY', 'TI_GAS', 'TI_USE'], ['Trees give oxygen, shade, wood and fruit and hold the soil.', 'Trees help rain and give homes to birds.'], [
    ['What do trees do for the land?', 'Help hold the soil and bring rain', 'Dry up the land', 'Make the land bare', 'Spoil the water'],
    ['Which gas do trees give out?', 'Oxygen', 'Smoke', 'Petrol fumes', 'Dust only'],
    ['What else do trees give besides firewood?', 'Shade, fruit and timber', 'Only firewood', 'Nothing else at all', 'Only shade at night'],
    ['How do tree roots help the soil?', 'They hold it and prevent erosion', 'They wash it away', 'They make it dry', 'They poison it'],
    ['Where do many birds make homes?', 'In trees', 'In the deep sea', 'In bare rocks', 'In cold rivers'],
  ], [
    ['A hillside has no trees and soil washes away. What would help?', 'Planting trees', 'Cutting more trees', 'Leaving it bare', 'Burning the grass'],
    ['A school plants trees for shade. Which use of trees is this?', 'Giving shade', 'Making smoke', 'Drying the land', 'Spoiling the air'],
    ['A farmer plants fruit trees on his plot. What do they give?', 'Fruit, shade and income', 'Only shade', 'Nothing useful', 'Only smoke'],
    ['A village cuts all its trees and the rain falls less. What does this show?', 'Trees help bring rain', 'Trees stop the rain', 'Trees do not matter', 'Rain needs no trees'],
    ['Birds sing in a tree beside the school. What does the tree give them?', 'A home', 'A cage', 'Smoke', 'Nothing'],
  ], [
    ['Which step is the mistake?', 'Step 1: Trees have roots.', 'Step 2: Roots hold the soil.', 'Step 3: So trees dry up the land.', 'Trees hold soil and help rain.', 2],
    ['Which step is the mistake?', 'Step 1: Trees take in carbon dioxide.', 'Step 2: They give out a gas we breathe.', 'Step 3: So trees give out smoke.', 'Trees give out oxygen.', 2],
    ['Which step is the mistake?', 'Step 1: Trees give wood.', 'Step 2: They give fruit and shade.', 'Step 3: So trees are useful only as firewood.', 'Trees have many uses.', 2],
    ['Which step is the mistake?', 'Step 1: Bare land erodes.', 'Step 2: Trees protect land.', 'Step 3: So cut more trees to stop erosion.', 'Plant trees to stop erosion.', 2],
    ['Which step is the mistake?', 'Step 1: Birds need shelter.', 'Step 2: Trees provide it.', 'Step 3: So trees harm birds.', 'Trees give birds homes.', 2],
  ], ['a', 'a']),
  ...S('tl', CE, 'TILTH', ['TL_SMALL', 'TL_TUBER', 'TL_MEDIUM'], ['Small seeds need fine tilth; big seeds and tubers need coarser tilth.', 'Maize and beans need medium tilth.'], [
    ['Which tilth suits small seeds like carrot?', 'Fine tilth', 'Coarse tilth', 'Rocky tilth', 'No tilth at all'],
    ['Which tilth suits sweet potato cuttings?', 'Coarse tilth', 'Fine tilth', 'Powder-fine tilth', 'Wet mud only'],
    ['Which tilth suits maize and beans?', 'Medium tilth', 'Fine tilth', 'Coarse tilth', 'No tilth at all'],
    ['What is tilth?', 'The fineness of the soil after preparing it', 'The colour of the soil', 'The smell of the soil', 'The depth of a well'],
    ['Why do small seeds need fine tilth?', 'So they can be covered and sprout', 'So they can hide from birds', 'So they dry quickly', 'So they stay in the sun'],
  ], [
    ['Wanjiru plants onion seeds. What tilth does she prepare?', 'Fine tilth', 'Coarse tilth', 'Rocky tilth', 'No tilth'],
    ['Kamau plants cassava cuttings. What tilth does he prepare?', 'Coarse tilth', 'Fine tilth', 'Powder-fine tilth', 'Wet mud only'],
    ['Amina plants maize. What tilth does she prepare?', 'Medium tilth', 'Fine tilth', 'Coarse tilth', 'No tilth'],
    ['A farmer breaks big clods into fine soil for carrot seeds. Why?', 'Small seeds need fine tilth', 'Carrots like clods', 'Fine soil is only for show', 'Big clods help carrots'],
    ['A farmer leaves large lumps for sweet potato vines. Is this suitable?', 'Yes, they need coarse tilth', 'No, they need fine tilth', 'No, they need no soil', 'No, they need water only'],
  ], [
    ['Which step is the mistake?', 'Step 1: Carrot seeds are very small.', 'Step 2: They need soil that covers them well.', 'Step 3: So they need coarse tilth.', 'They need fine tilth.', 0],
    ['Which step is the mistake?', 'Step 1: Sweet potato uses vines.', 'Step 2: They are not tiny seeds.', 'Step 3: So they need fine tilth.', 'They need coarse tilth.', 1],
    ['Which step is the mistake?', 'Step 1: Maize seeds are medium sized.', 'Step 2: They need medium tilth.', 'Step 3: So maize needs fine tilth.', 'Maize needs medium tilth.', 2],
    ['Which step is the mistake?', 'Step 1: Tilth is soil fineness.', 'Step 2: It depends on the crop.', 'Step 3: So all crops need the same tilth.', 'Tilth depends on the planting material.', 2],
    ['Which step is the mistake?', 'Step 1: Seed size differs.', 'Step 2: Tilth suits the seed.', 'Step 3: So tiny seeds need big clods.', 'Tiny seeds need fine tilth.', 0],
  ], ['a', 'a']),
  ...S('cp', CM, 'CROP_PRACTICES', ['CP_WEED', 'CP_THIN', 'CP_GAP'], ['Weeding removes competition; thinning removes extra seedlings.', 'Gapping replaces seeds that did not grow.'], [
    ['Why is weeding done?', 'To remove competition for water', 'Because weeds help the crop grow better', 'To give weeds much more space', 'To make the whole field untidy'],
    ['What is thinning?', 'Removing extra seedlings', 'Replacing seeds that failed', 'Adding more manure', 'Watering twice a day'],
    ['What is gapping?', 'Replacing seeds that did not grow', 'Removing extra seedlings from rows', 'Cutting the whole crop short', 'Digging a trench round the plot'],
    ['What does mulching do?', 'Keeps water in the soil', 'Dries the soil', 'Spreads the weeds', 'Burns the roots'],
    ['What is earthing up?', 'Heaping soil round the plant base', 'Digging up all of the plants', 'Removing the soil from the roots', 'Watering the roots with a can'],
  ], [
    ['Weeds are growing around Achieng\'s beans. What should she do?', 'Weed the plot', 'Leave the weeds alone', 'Add more weeds', 'Cut the beans'],
    ['Five maize seedlings came up in one hole. What is the job to remove the extras?', 'Thinning', 'Gapping', 'Mulching', 'Pruning'],
    ['Some seeds did not come up, leaving empty spots. What is the job to fill them?', 'Gapping', 'Thinning', 'Mulching', 'Weeding'],
    ['A farmer covers the soil with dry grass to save water. What is this?', 'Mulching', 'Gapping', 'Thinning', 'Pruning'],
    ['A farmer ties tomato plants to sticks. What is this?', 'Staking', 'Thinning', 'Gapping', 'Mulching'],
  ], [
    ['Which step is the mistake?', 'Step 1: Weeds grow among crops.', 'Step 2: They take water and food.', 'Step 3: So weeds help the crop grow.', 'Weeds compete with crops.', 0],
    ['Which step is the mistake?', 'Step 1: Too many seedlings crowd each other.', 'Step 2: Extra ones are removed.', 'Step 3: So thinning means replacing seeds.', 'Thinning removes extra seedlings.', 2],
    ['Which step is the mistake?', 'Step 1: Some seeds fail to grow.', 'Step 2: Gaps appear.', 'Step 3: So gapping removes seedlings.', 'Gapping replaces failed seeds.', 2],
    ['Which step is the mistake?', 'Step 1: Mulch covers the soil.', 'Step 2: It keeps the soil moist.', 'Step 3: So mulch dries the soil.', 'Mulch keeps water.', 2],
    ['Which step is the mistake?', 'Step 1: Staking supports climbing crops.', 'Step 2: Tomatoes can be staked.', 'Step 3: So staking is for maize only.', 'Staking supports tomatoes and beans.', 2],
  ], ['a', 'a']),
  ...S('ap', AP, 'ANIMAL_PRODUCTS', ['AP_RAW', 'AP_HANDS', 'AP_COOL'], ['Boil milk, cook eggs and meat well, wash hands, keep cool.', 'Raw milk can carry germs.'], [
    ['What should be done to milk before drinking?', 'Boil or pasteurise it', 'Nothing, raw is safest', 'Add cold water to it', 'Leave it in the sun'],
    ['What should be done before handling meat?', 'Wash hands and tools', 'Nothing at all', 'Rub hands in the soil', 'Wipe hands on clothes'],
    ['How should fresh milk be kept?', 'Cool and covered', 'In the hot sun', 'Open on the table', 'Near the rubbish'],
    ['How should eggs be prepared to be safe?', 'Cooked well', 'Eaten raw always', 'Left in the sun', 'Kept dirty'],
    ['Why is milk boiled?', 'To kill germs', 'To make it cold', 'To make it sour', 'To make it a solid'],
  ], [
    ['Mama buys milk from a neighbour. What should she do first?', 'Boil it', 'Drink it raw at once', 'Add sugar and drink', 'Leave it in the sun'],
    ['A butcher handles meat with dirty hands. What may happen?', 'Germs may spread to the meat', 'Nothing at all', 'The meat gets sweeter', 'The meat grows'],
    ['A family leaves milk uncovered on the table all day. What may happen?', 'It spoils and may carry germs', 'It becomes much safer to drink', 'It becomes a cheese by itself', 'It stays fresh for a whole week'],
    ['A cook boils eggs for ten minutes. Why?', 'To cook them well and make them safe', 'To make them rotten after a day', 'To make them cold and hard again', 'To make them dirty on the outside'],
    ['A shop keeps fish in the hot sun. What is the danger?', 'It spoils and can make people sick', 'It gets fresher in the sun', 'It turns into good meat', 'Nothing is wrong with it'],
  ], [
    ['Which step is the mistake?', 'Step 1: Milk can carry germs.', 'Step 2: Boiling kills germs.', 'Step 3: So raw milk is always safest.', 'Boil milk to make it safe.', 2],
    ['Which step is the mistake?', 'Step 1: Hands can carry germs.', 'Step 2: Washing removes germs.', 'Step 3: So hands need not be washed before handling meat.', 'Wash hands and tools first.', 2],
    ['Which step is the mistake?', 'Step 1: Heat helps germs grow.', 'Step 2: Milk spoils in heat.', 'Step 3: So milk is kept in the sun.', 'Keep milk cool and covered.', 2],
    ['Which step is the mistake?', 'Step 1: Eggs can carry germs.', 'Step 2: Cooking kills them.', 'Step 3: So eggs are eaten raw to be safe.', 'Cook eggs well.', 2],
    ['Which step is the mistake?', 'Step 1: Meat spoils quickly.', 'Step 2: It is kept cool.', 'Step 3: So it is left in the sun.', 'Keep meat cool.', 2],
  ], ['a', 'a']),
  ...S('cf', CF, 'COOKING_METHODS', ['CK_STEAM', 'CK_FRY', 'CK_BAKE'], ['Boiling is in water, steaming over steam, frying in oil, baking in an oven.', 'Hot cooking is done with an adult.'], [
    ['What is steaming?', 'Cooking over the steam of boiling water', 'Cooking in hot oil', 'Cooking in an oven', 'Cooking on open coals'],
    ['What is frying?', 'Cooking in hot oil', 'Cooking in an oven', 'Cooking in steam', 'Cooking in cold water'],
    ['Which method uses an oven?', 'Baking', 'Boiling', 'Steaming', 'Frying'],
    ['What is boiling?', 'Cooking in water that bubbles', 'Cooking in oil', 'Cooking in an oven', 'Cooking in the sun'],
    ['What is roasting?', 'Cooking with dry heat', 'Cooking in deep water', 'Cooking in steam', 'Cooking in cold oil'],
  ], [
    ['Mama cooks rice in bubbling water. Which method is this?', 'Boiling', 'Frying', 'Baking', 'Roasting'],
    ['A cook makes chips in hot oil. Which method is this?', 'Frying', 'Boiling', 'Baking', 'Steaming'],
    ['A baker cooks bread in an oven. Which method is this?', 'Baking', 'Boiling', 'Frying', 'Steaming'],
    ['A cook puts food over steam in a covered pot. Which method is this?', 'Steaming', 'Frying', 'Baking', 'Roasting'],
    ['A family roasts maize on a jiko. Which method is this?', 'Roasting', 'Boiling', 'Steaming', 'Baking'],
  ], [
    ['Which step is the mistake?', 'Step 1: Steaming uses steam.', 'Step 2: The food sits above the water.', 'Step 3: So steaming uses hot oil.', 'Steaming uses steam.', 1],
    ['Which step is the mistake?', 'Step 1: Frying uses oil.', 'Step 2: The oil is hot.', 'Step 3: So frying uses an oven.', 'Frying uses hot oil.', 1],
    ['Which step is the mistake?', 'Step 1: Baking uses an oven.', 'Step 2: Bread is baked.', 'Step 3: So baking uses boiling water.', 'Baking uses an oven.', 2],
    ['Which step is the mistake?', 'Step 1: Boiling needs water.', 'Step 2: The water bubbles.', 'Step 3: So boiling uses no water.', 'Boiling uses water.', 2],
    ['Which step is the mistake?', 'Step 1: Hot cooking is dangerous.', 'Step 2: Learners need help.', 'Step 3: So children cook alone with hot oil.', 'An adult must be present.', 2],
  ], ['a', 'a']),
  ...S('ah', HA, 'ANIMAL_HYGIENE', ['AH_DUNG', 'AH_WATER', 'AH_SICK'], ['Clean the house, give clean water and separate sick animals.', 'Hygiene prevents disease.'], [
    ['What should be done to the animals\' house?', 'Clean it and remove the dung', 'Leave the dung inside it', 'Keep it dark and wet always', 'Fill it up with old rubbish'],
    ['What water should animals drink?', 'Clean water', 'Any dirty water', 'Water with dung in it', 'Muddy water only'],
    ['What should be done with a sick animal?', 'Separate it from the others', 'Keep it with the others', 'Let it eat with the healthy', 'Leave it near the water'],
    ['Why are animals dipped or sprayed?', 'To kill ticks and other pests', 'To make them wet all over', 'To make them grow very fat', 'To make them sleep all day'],
    ['Why wash hands after handling animals?', 'To prevent the spread of disease', 'To make hands dry', 'To save water', 'To make the animals clean'],
  ], [
    ['A farmer never cleans the cow shed. What may happen?', 'The cows get diseases', 'The cows get stronger', 'The cows give more milk', 'Nothing happens'],
    ['Hens drink from a dirty bucket. What is the problem?', 'They may fall sick', 'They grow faster', 'They lay more eggs', 'They become clean'],
    ['One goat coughs and others are fine. What should the farmer do?', 'Separate the sick goat', 'Mix it with the others', 'Feed it more', 'Ignore it'],
    ['A farmer sprays his cattle each week. What does this prevent?', 'Tick-borne disease', 'Rain', 'Growth', 'Milk'],
    ['A child washes hands after feeding the chickens. Why?', 'To stay free of germs', 'To dry them', 'To waste water', 'To wake the hens'],
  ], [
    ['Which step is the mistake?', 'Step 1: Dung attracts flies.', 'Step 2: Flies carry germs.', 'Step 3: So dung should stay in the house.', 'Remove dung and clean the house.', 0],
    ['Which step is the mistake?', 'Step 1: Animals need water.', 'Step 2: Dirty water carries germs.', 'Step 3: So any water is fine.', 'Give clean water.', 2],
    ['Which step is the mistake?', 'Step 1: Sick animals spread disease.', 'Step 2: Healthy animals can catch it.', 'Step 3: So keep them together.', 'Separate sick animals.', 2],
    ['Which step is the mistake?', 'Step 1: Ticks carry disease.', 'Step 2: Dipping kills ticks.', 'Step 3: So dipping is useless.', 'Dipping prevents tick diseases.', 2],
    ['Which step is the mistake?', 'Step 1: Hands touch animals.', 'Step 2: Germs can stay on hands.', 'Step 3: So handwashing is not needed.', 'Wash hands after handling animals.', 2],
  ], ['a', 'a']),
  ...S('lc', LL, 'LAUNDRY_COLOURS', ['LC_WHITE', 'LC_SOAK', 'LC_DRY'], ['Wash loose colours separately, quickly, and dry in the shade.', 'Do not soak them long.'], [
    ['How should a loose-coloured shirt be washed?', 'Separately', 'With white clothes', 'With a big pile of clothes', 'With hot water for hours'],
    ['How long should a loose-coloured shirt be soaked?', 'Not for long', 'For a whole day', 'Overnight in hot water', 'For a week'],
    ['Where should loose-coloured clothes dry?', 'In the shade', 'In the hot sun', 'On the hot roof', 'Near a hot fire'],
    ['What water suits loose colours?', 'Cold water', 'Boiling water', 'Very hot water', 'Water with bleach'],
    ['What should be done after washing loose colours?', 'Rinse them well', 'Leave the soap in', 'Soak them again', 'Wring with bleach'],
  ], [
    ['A red shirt loses colour in water. How should Achieng wash it?', 'Separately and quickly', 'With the white shirts', 'Soaked for hours', 'In hot water'],
    ['Juma soaks a blue uniform overnight. What may happen?', 'The colour runs and fades', 'It becomes brighter', 'It dries itself', 'It shrinks to fit'],
    ['A green blouse is dried in strong sunshine. What may happen?', 'The colour fades', 'It becomes brighter', 'It becomes new', 'It stays wet'],
    ['A washed white shirt turns pink. What was the mistake?', 'It was washed with a red loose-colour article', 'It was washed alone', 'It was dried in the shade', 'It was rinsed well'],
    ['Why is cold water better for loose colours?', 'Heat makes colours run more', 'Cold water is cleaner', 'Cold water is cheaper', 'Hot water is dangerous'],
  ], [
    ['Which step is the mistake?', 'Step 1: Loose colours run in water.', 'Step 2: They can stain other clothes.', 'Step 3: So wash them with white clothes.', 'Wash loose colours separately.', 2],
    ['Which step is the mistake?', 'Step 1: Long soaking makes colour run.', 'Step 2: Washing should be quick.', 'Step 3: So soak loose colours for a day.', 'Do not soak long.', 2],
    ['Which step is the mistake?', 'Step 1: Sun fades colours.', 'Step 2: Shade protects them.', 'Step 3: So dry them in the hot sun.', 'Dry in the shade.', 2],
    ['Which step is the mistake?', 'Step 1: Hot water makes colours run.', 'Step 2: Cold water is safer.', 'Step 3: So use boiling water.', 'Use cold water.', 2],
    ['Which step is the mistake?', 'Step 1: Soap left in clothes harms colour.', 'Step 2: Rinsing removes soap.', 'Step 3: So do not rinse.', 'Rinse well.', 2],
  ], ['a', 'a']),
  ...S('kn', KS, 'KNITTING', ['KN_TOOL', 'KN_STITCH', 'KN_CAST'], ['Knitting uses needles and yarn, with knit and purl stitches.', 'Casting on makes the first stitches.'], [
    ['Which tools are used for knitting?', 'Needles and yarn', 'A hammer and nails', 'A saw and a plane', 'A hoe and a panga'],
    ['Which is a knitting stitch?', 'Purl stitch', 'Brick stitch', 'Nail stitch', 'Saw stitch'],
    ['What is casting on?', 'Making the first row of stitches', 'Finishing the knitting for good', 'Cutting the yarn into pieces', 'Washing the wool in a basin'],
    ['What is casting off?', 'Finishing the edge of the knitting', 'Starting the knitting on needles', 'Winding the wool into a ball', 'Changing the colour of the wool'],
    ['Which stitches make stocking stitch?', 'Alternate knit and purl rows', 'Only brick stitches', 'Only nail stitches', 'Only casting on'],
  ], [
    ['Wanjiru takes needles and yarn to make a scarf. What is she doing?', 'Knitting', 'Carving', 'Digging', 'Welding'],
    ['Kamau makes the first loops on the needle. What is this called?', 'Casting on', 'Casting off', 'Purling', 'Cutting'],
    ['Amina finishes the last row and secures the edge. What is this called?', 'Casting off', 'Casting on', 'Purling', 'Winding'],
    ['A knitter knits one row and purls the next. What pattern is this?', 'Stocking stitch', 'Brick stitch', 'Nail stitch', 'Cast stitch'],
    ['A learner asks for a tool for knitting a sweater. What should she get?', 'Knitting needles', 'A hammer', 'A spade', 'A saw'],
  ], [
    ['Which step is the mistake?', 'Step 1: Knitting makes cloth from yarn.', 'Step 2: It uses needles.', 'Step 3: So it uses a hammer and nails.', 'Knitting uses needles and yarn.', 2],
    ['Which step is the mistake?', 'Step 1: Knit and purl are stitches.', 'Step 2: They make patterns.', 'Step 3: So brick stitch is a knitting stitch.', 'Knit and purl are knitting stitches.', 2],
    ['Which step is the mistake?', 'Step 1: Knitting starts with loops.', 'Step 2: The first row is cast on.', 'Step 3: So casting on is finishing.', 'Casting on makes the first stitches.', 2],
    ['Which step is the mistake?', 'Step 1: Casting off ends the work.', 'Step 2: It secures the edge.', 'Step 3: So casting off starts the work.', 'Casting off finishes.', 2],
    ['Which step is the mistake?', 'Step 1: Stocking stitch alternates rows.', 'Step 2: One row is knit and one is purl.', 'Step 3: So all rows are cast on.', 'Rows alternate knit and purl.', 2],
  ], ['a', 'a']),
  ...S('fg', FG, 'FRAMED_GARDEN', ['FG_SPACE', 'FG_DRAIN', 'FG_SOIL'], ['A suspended garden saves space and needs drainage and rich soil.', 'It is useful in small compounds.'], [
    ['Why use a suspended garden?', 'It saves space', 'It needs a big field', 'It needs a lot of land', 'It grows only trees'],
    ['What must the containers have?', 'Holes for drainage', 'No holes at all', 'A tight lid', 'No soil'],
    ['What should the soil mixture have?', 'Soil and manure', 'Only sand', 'Only stones', 'Only water'],
    ['Which crop suits a suspended garden?', 'Spinach or sukuma wiki', 'Big maize for a whole field', 'Tall timber trees', 'Large pumpkin vines on the ground'],
    ['What holds the containers in a framed garden?', 'A strong frame', 'A bag of sand', 'A heap of leaves', 'A wet cloth'],
  ], [
    ['A family has a very small compound. What garden helps?', 'A framed suspended garden', 'A big maize field', 'A pond', 'A forest'],
    ['A farmer finds water standing in the sacks. What is missing?', 'Drainage holes', 'More water', 'More sand only', 'A lid'],
    ['A learner fills sacks with only sand. What is wrong?', 'They need soil with manure', 'Nothing, sand is best', 'They need only stones', 'They need only water'],
    ['A school grows sukuma wiki in hanging sacks. Why is this good?', 'It saves space and gives vegetables', 'It wastes space', 'It spoils the crop', 'It needs more land'],
    ['A farmer waters the hanging containers every day. Why?', 'The soil dries quickly', 'They never need water', 'Water spoils the frame', 'The frame needs water'],
  ], [
    ['Which step is the mistake?', 'Step 1: Containers hang above the ground.', 'Step 2: They use little ground.', 'Step 3: So they need a big field.', 'They save space.', 2],
    ['Which step is the mistake?', 'Step 1: Plants need water.', 'Step 2: Extra water must drain.', 'Step 3: So containers need no holes.', 'Containers need drainage holes.', 1],
    ['Which step is the mistake?', 'Step 1: Plants need food from soil.', 'Step 2: Manure adds food.', 'Step 3: So fill with sand only.', 'Use soil mixed with manure.', 2],
    ['Which step is the mistake?', 'Step 1: A frame holds the containers.', 'Step 2: It must be strong.', 'Step 3: So any weak stick will do.', 'The frame must be strong.', 2],
    ['Which step is the mistake?', 'Step 1: Containers dry out fast.', 'Step 2: They need regular watering.', 'Step 3: So they never need water.', 'They need regular watering.', 2],
  ], ['a', 'a']),
  ...S('va', VA, 'VALUE_ADDITION', ['VA_RAW', 'VA_EXAMPLE', 'VA_STEPS'], ['Cleaning, sorting, drying, grinding and packing add value.', 'Value addition raises the price.'], [
    ['How does value addition help a farmer?', 'It raises the selling price', 'It lowers the price', 'It makes the crop rot', 'It wastes the produce'],
    ['Which is value addition?', 'Making mangoes into juice', 'Leaving mangoes to rot', 'Throwing mangoes away', 'Eating mangoes alone'],
    ['What comes first in preparing produce for sale?', 'Cleaning and sorting', 'Selling it dirty', 'Mixing good and bad', 'Leaving it in the sun'],
    ['Which adds value to maize?', 'Grinding it into flour and packing', 'Leaving it in the field', 'Burning the cobs', 'Soaking it for weeks'],
    ['Which adds value to tomatoes?', 'Making them into sauce', 'Leaving them to spoil', 'Selling them rotten', 'Burying them'],
  ], [
    ['A farmer packs clean, sorted eggs in trays. What does this do?', 'It adds value and a better price', 'It lowers the price', 'It spoils the eggs', 'It wastes time'],
    ['A woman dries and grinds cassava into flour. What is this?', 'Value addition', 'Wasting cassava', 'Burning cassava', 'Losing cassava'],
    ['A farmer sells muddy, mixed potatoes. What could add value?', 'Washing and sorting them', 'Adding more mud', 'Mixing more bad ones', 'Hiding them'],
    ['A group makes jam from extra fruit. Why is this good?', 'It adds value and saves the fruit', 'It wastes the fruit', 'It spoils the fruit', 'It lowers income'],
    ['Packing milk in clean sealed packets is part of what?', 'Value addition', 'Wasting milk', 'Spoiling milk', 'Hiding milk'],
  ], [
    ['Which step is the mistake?', 'Step 1: Processed produce looks better.', 'Step 2: Buyers pay more for it.', 'Step 3: So value addition lowers the price.', 'Value addition raises the price.', 2],
    ['Which step is the mistake?', 'Step 1: Juice comes from fruit.', 'Step 2: It lasts longer.', 'Step 3: So making juice wastes the fruit.', 'Making juice adds value.', 2],
    ['Which step is the mistake?', 'Step 1: Produce must be clean.', 'Step 2: It should be sorted.', 'Step 3: So sell it dirty and mixed.', 'Clean and sort first.', 2],
    ['Which step is the mistake?', 'Step 1: Flour comes from grain.', 'Step 2: Packed flour sells well.', 'Step 3: So leave grain unprocessed to earn more.', 'Processing adds value.', 2],
    ['Which step is the mistake?', 'Step 1: Drying keeps produce longer.', 'Step 2: Dried produce can be sold later.', 'Step 3: So drying wastes produce.', 'Drying adds value.', 2],
  ], ['a', 'a']),
  ...S('hs', HS, 'SOAP_FORMS', ['SF_FORM', 'SF_USE', 'SF_SAFE'], ['Soap comes as bar, liquid, powder or paste.', 'Strong soap chemicals are handled by the teacher only.'], [
    ['Which is a form of soap?', 'Bar', 'Brick', 'Rope', 'Stone'],
    ['What does soap do with water?', 'Removes dirt and germs', 'Adds dirt', 'Makes things dirtier', 'Does nothing'],
    ['Who handles strong soap chemicals?', 'The teacher only', 'Any child alone', 'Any visitor', 'No one'],
    ['Which is a liquid soap use?', 'Washing hands at a basin', 'Building a wall', 'Painting a gate', 'Fuelling a lamp'],
    ['Which is a powder soap use?', 'Washing clothes', 'Cooking food', 'Planting seeds', 'Feeding animals'],
  ], [
    ['A family buys soap in a long block. Which form is this?', 'Bar soap', 'Liquid soap', 'Powder soap', 'Paste soap'],
    ['A school uses soap from a pump bottle. Which form is this?', 'Liquid soap', 'Bar soap', 'Powder soap', 'Paste soap'],
    ['Mama washes clothes with a soap that is poured from a packet. Which form is this?', 'Powder soap', 'Bar soap', 'Liquid soap', 'Paste soap'],
    ['A learner wants to make soap using strong chemicals. What should she do?', 'Do it only with the teacher', 'Do it alone at home', 'Do it with friends alone', 'Use any chemical'],
    ['Why do we wash hands with soap and water?', 'To remove dirt and germs', 'To make them dirty', 'To make them wet only', 'To waste water'],
  ], [
    ['Which step is the mistake?', 'Step 1: Soap comes in more than one form.', 'Step 2: Bar and liquid are two.', 'Step 3: So brick is a form of soap.', 'Soap comes as bar, liquid, powder or paste.', 2],
    ['Which step is the mistake?', 'Step 1: Soap loosens dirt.', 'Step 2: Water rinses it away.', 'Step 3: So soap adds dirt.', 'Soap removes dirt and germs.', 2],
    ['Which step is the mistake?', 'Step 1: Some soap ingredients are strong.', 'Step 2: They can burn skin.', 'Step 3: So any child may handle them alone.', 'Only the teacher handles them.', 2],
    ['Which step is the mistake?', 'Step 1: Powder soap is used for clothes.', 'Step 2: It is mixed with water.', 'Step 3: So powder soap is for cooking.', 'Powder soap is for washing.', 2],
    ['Which step is the mistake?', 'Step 1: Handwashing stops disease.', 'Step 2: It needs soap and water.', 'Step 3: So water alone is always enough.', 'Soap and water remove germs.', 2],
  ], ['a', 'a']),
];
