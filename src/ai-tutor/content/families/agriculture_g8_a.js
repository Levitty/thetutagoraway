// ============================================================================
// AGRICULTURE GRADE 8 (14 skills): soil conservation, water storage, kitchen gardens, poultry folds, pests and diseases, processing fish and
// dressing poultry, preserving milk and meat, balanced meals, kitchen cleaning, seams, waterers, ICT services. Written offline from the KICD
// design through the curriculum map. Every wrong answer names the library misconception it reveals. All stay reviewed:false until an
// Agriculture teacher signs them off. Only knowledge outcomes are asked; slaughter, knives and heat are for a teacher, never a child.
// ============================================================================
import { S } from './agriculture_g8_lib.js';
const SC = 'CONSER.SOIL_CONSERVATION_MEASUR.', WS = 'CONSER.WATER_HARVESTING_AND_STO.', KG = 'FOOD_P.KITCHEN_AND_BACKYARD_GAR.', PF = 'FOOD_P.POULTRY_REARING_IN_A_FOL.';
const PD = 'FOOD_P.CROP_PEST_AND_DISEASE_CO.', AP = 'FOOD_P.PREPARATION_OF_ANIMAL_PR.', PA = 'FOOD_P.PRESERVING_ANIMAL_PRODUC.', BM = 'FOOD_P.COOKING_PREPARING_A_BALA.';
const CK = 'HYGIEN.CLEANING_THE_KITCHEN.', SS = 'PRODUC.SEWING_SKILLS_CONSTRUCTI.', IW = 'PRODUC.CONSTRUCTING_INNOVATIVE_.', IC = 'PRODUC.ICT_SUPPORT_SERVICES.';

export const FAMILIES = [
  ...S('sc', SC, 'SOIL_CONSERVE', ['SC_TERRACE', 'SC_MULCH', 'SC_CONTOUR'], ['Terraces and mulch hold soil; plant along the contour.', 'Conservation slows water and wind.'], [
    ['What does terracing do on a slope?', 'Slows the water and holds the soil', 'Speeds up the water', 'Washes the soil away', 'Dries the slope'],
    ['What does mulch do to soil?', 'Covers and protects it', 'Leaves it bare', 'Burns it', 'Blows it away'],
    ['How should crops be planted on a slope?', 'Along the contour', 'Up and down the slope', 'Against the rain', 'In a pile'],
    ['Which is a way of conserving soil?', 'Planting trees and cover crops', 'Burning the grass', 'Clearing all plants', 'Leaving the soil bare'],
    ['What causes soil erosion on bare land?', 'Running water and wind', 'Planting trees', 'Mulching', 'Terracing'],
  ], [
    ['A farmer builds steps across a steep field. What is this?', 'Terracing', 'Burning', 'Overgrazing', 'Deforestation'],
    ['A farmer spreads dry grass around her crops. What does it do for the soil?', 'Covers and protects it', 'Leaves it bare', 'Burns it', 'Blows it away'],
    ['A farmer plants maize in rows across the slope, not down it. What is this?', 'Contour farming', 'Burning', 'Overgrazing', 'Slash and burn'],
    ['A hillside has no plants and the soil washes away in the rain. What would help?', 'Planting trees and grass', 'Cutting more trees', 'Burning the grass', 'Leaving it bare'],
    ['A farmer plants beans between rows of maize to cover the soil. What is this?', 'Using a cover crop', 'Wasting seed', 'Overgrazing', 'Burning'],
  ], [
    ['Which step is the mistake?', 'Step 1: Terraces are steps on a slope.', 'Step 2: They slow running water.', 'Step 3: So terraces make erosion worse.', 'Terraces reduce erosion.', 2],
    ['Which step is the mistake?', 'Step 1: Mulch covers the soil.', 'Step 2: It holds water in.', 'Step 3: So mulch leaves soil bare.', 'Mulch covers soil.', 2],
    ['Which step is the mistake?', 'Step 1: Water runs down slopes.', 'Step 2: Rows across the slope slow it.', 'Step 3: So rows should go up and down the slope.', 'Rows follow the contour.', 2],
    ['Which step is the mistake?', 'Step 1: Roots hold soil.', 'Step 2: Trees protect the land.', 'Step 3: So cutting all the trees saves soil.', 'Planting trees saves soil.', 2],
    ['Which step is the mistake?', 'Step 1: Bare soil is easily washed away.', 'Step 2: Covering it protects it.', 'Step 3: So we should keep it bare.', 'We should cover it.', 2],
  ], ['a', 'a']),
  ...S('ws', WS, 'WATER_STORE', ['WS_COVER', 'WS_TREAT', 'WS_MOSQUITO'], ['Store water in clean covered containers.', 'Boil or purify water before drinking.'], [
    ['How should stored water be kept?', 'In a clean, covered container', 'Uncovered in the sun', 'In a dirty bucket', 'In an open pit'],
    ['What should be done before drinking harvested water?', 'Boil or purify it', 'Nothing at all', 'Add mud to it', 'Leave it open for a day'],
    ['Why must water tanks be covered?', 'To keep out dirt and mosquitoes', 'To warm the water', 'To make it taste sweet', 'To make it heavy'],
    ['Which container suits storing water at home?', 'A clean tank with a lid', 'A leaking open box', 'A dirty basin', 'A heap of leaves'],
    ['Why wash a water container before filling it?', 'To remove dirt and germs', 'To make it noisy', 'To make it hot', 'To make it small'],
  ], [
    ['A family stores water in an open basin and children play near it. What is wrong?', 'The water can get dirty', 'Nothing is wrong', 'It stays cleaner', 'It becomes safe'],
    ['A school collects roof water in a tank. What should they do before drinking it?', 'Boil or purify it', 'Nothing at all', 'Add mud', 'Leave it open for a day'],
    ['Mosquitoes breed in an uncovered tank. What fixes this?', 'A tight cover', 'More water', 'A hole in the tank', 'Mud in the tank'],
    ['A jerrican of stored water is left with its lid off. What may happen?', 'Dirt and insects get in', 'The water gets cleaner', 'The water turns sweet', 'Nothing may happen'],
    ['A class cleans the tank before the rains. Why?', 'So rain water stays clean', 'So it is noisy', 'So it is hot', 'So it is heavy'],
  ], [
    ['Which step is the mistake?', 'Step 1: Stored water can get dirty.', 'Step 2: A cover keeps it clean.', 'Step 3: So we leave the container open.', 'We keep it covered.', 2],
    ['Which step is the mistake?', 'Step 1: Harvested water may carry germs.', 'Step 2: Boiling kills germs.', 'Step 3: So we drink it untreated.', 'We boil or purify it.', 2],
    ['Which step is the mistake?', 'Step 1: Mosquitoes breed in standing water.', 'Step 2: A cover keeps them out.', 'Step 3: So tanks should be left open.', 'Tanks should be covered.', 2],
    ['Which step is the mistake?', 'Step 1: Containers can hold germs.', 'Step 2: Washing removes them.', 'Step 3: So we never clean them.', 'We clean them before use.', 2],
    ['Which step is the mistake?', 'Step 1: Water is precious.', 'Step 2: Storage saves it for dry times.', 'Step 3: So we waste it.', 'We store it well.', 2],
  ], ['a', 'a']),
  ...S('kg', KG, 'KITCHEN_GARDEN', ['KG_SPACE', 'KG_CROP', 'KG_MONEY'], ['A kitchen garden is near the house and gives fresh vegetables.', 'It saves money.'], [
    ['Where is a kitchen garden kept?', 'Near the house', 'On a distant large farm', 'In the middle of a forest', 'On a rocky mountain'],
    ['Which crop suits a kitchen garden?', 'Sukuma wiki', 'Timber trees', 'Large cotton fields', 'Tall bamboo forests'],
    ['How does a kitchen garden help a family?', 'It saves money on vegetables', 'It costs a lot more', 'It takes all the land', 'It makes food scarce'],
    ['Which crop is often grown in a backyard garden?', 'Spinach', 'Big timber trees', 'Wide wheat fields', 'Large sugar plantations'],
    ['What can be used to water a kitchen garden?', 'Waste water from washing vegetables', 'Used engine oil', 'Strong bleach', 'Sea salt'],
  ], [
    ['A family has a small compound by the kitchen. What garden suits it?', 'A kitchen garden', 'A timber forest', 'A wheat field', 'A cattle ranch'],
    ['Mama wants fresh vegetables for supper. What can she pick from her garden?', 'Sukuma wiki and onions', 'Timber logs', 'Cotton', 'Sugar cane stalks'],
    ['A family stops buying vegetables after starting a garden. What does this show?', 'A kitchen garden saves money', 'A garden costs more', 'A garden wastes land', 'A garden harms food'],
    ['A kitchen garden is near the house. Why is that useful?', 'It is easy to water and watch', 'It is hard to reach', 'It is too far to use', 'It is hidden'],
    ['Peelings are made into compost for the garden. Why?', 'They feed the soil', 'They poison the soil', 'They dry the soil', 'They block the water'],
  ], [
    ['Which step is the mistake?', 'Step 1: Kitchen gardens are small.', 'Step 2: They are near the house.', 'Step 3: So they need a distant large farm.', 'They are near the house.', 2],
    ['Which step is the mistake?', 'Step 1: Kitchen gardens give vegetables.', 'Step 2: Sukuma wiki is one.', 'Step 3: So timber trees suit a kitchen garden.', 'Vegetables suit a kitchen garden.', 2],
    ['Which step is the mistake?', 'Step 1: Home-grown vegetables are free.', 'Step 2: Seeds cost little.', 'Step 3: So a garden costs more than buying.', 'A garden saves money.', 2],
    ['Which step is the mistake?', 'Step 1: Vegetables are eaten fresh.', 'Step 2: Fresh food keeps vitamins.', 'Step 3: So home gardens give no vitamins.', 'They give fresh vitamins.', 2],
    ['Which step is the mistake?', 'Step 1: Waste water can water plants.', 'Step 2: This saves clean water.', 'Step 3: So engine oil can water plants.', 'Only clean waste water is used.', 2],
  ], ['a', 'a']),
  ...S('pf', PF, 'POULTRY_FOLD', ['PF_MOVE', 'PF_PROTECT', 'PF_MANURE'], ['A fold is a light movable pen moved to fresh ground.', 'It protects birds and spreads manure.'], [
    ['What is special about a fold?', 'It is moved to fresh ground', 'It is never moved', 'It is built underground', 'It floats on water'],
    ['What does a fold protect birds from?', 'Predators and rain', 'Nothing at all', 'Only the wind', 'Only the moon'],
    ['What happens to the manure from a fold?', 'It is spread on the ground', 'It is all wasted', 'It is thrown in the river', 'It is burnt'],
    ['Which is a feature of a fold?', 'A light movable frame with wire', 'A thick brick wall', 'A deep pit', 'A tall tower'],
    ['Why move a fold to fresh ground?', 'Birds get fresh pasture and the land is manured evenly', 'To tire the birds', 'To hide the birds', 'To lose the birds'],
  ], [
    ['A farmer moves his poultry pen across the field each day. What is the pen?', 'A fold', 'A fixed house', 'A pit', 'A store'],
    ['A fox cannot reach the hens in the wire pen. What did the fold do?', 'It protected the birds', 'It harmed the birds', 'It did nothing', 'It fed the fox'],
    ['The ground under the fold is richer after a week. Why?', 'Manure was spread', 'Rain washed it', 'Wind blew it', 'Nothing changed'],
    ['A fold has a roof of tin on one side. Why?', 'To give shade and shelter from rain', 'To make noise', 'To attract hawks', 'To hide the sky'],
    ['A farmer leaves the fold on the same spot for months. What is wrong?', 'The ground gets bare and dirty', 'Nothing is wrong', 'The grass grows taller', 'The hens get lost'],
  ], [
    ['Which step is the mistake?', 'Step 1: A fold is light.', 'Step 2: It can be moved.', 'Step 3: So it must stay in one place.', 'It is moved to fresh ground.', 2],
    ['Which step is the mistake?', 'Step 1: Predators hunt poultry.', 'Step 2: A wire fold keeps them out.', 'Step 3: So a fold gives no protection.', 'A fold protects the birds.', 2],
    ['Which step is the mistake?', 'Step 1: Birds drop manure.', 'Step 2: Moving the fold spreads it.', 'Step 3: So the manure is wasted.', 'It feeds the soil.', 2],
    ['Which step is the mistake?', 'Step 1: A fold has a frame.', 'Step 2: Wire covers the sides.', 'Step 3: So it is built of thick brick.', 'It is light and movable.', 2],
    ['Which step is the mistake?', 'Step 1: Birds need clean ground.', 'Step 2: A fold gives fresh ground.', 'Step 3: So it stays on the same spot.', 'It is moved.', 2],
  ], ['a', 'a']),
  ...S('pd', PD, 'PEST_DISEASE', ['PD_PEST', 'PD_DISEASE', 'PD_CONTROL'], ['Aphids and cutworms are pests; blight and wilt are diseases.', 'Crop rotation and clean tools help control them.'], [
    ['Which is a pest of vegetables?', 'Aphids', 'Blight', 'Wilt', 'Mosaic'],
    ['Which is a disease of vegetables?', 'Blight', 'Aphids', 'Cutworms', 'Caterpillars'],
    ['Which helps to control pests?', 'Crop rotation', 'Leaving weeds to grow', 'Planting too close', 'Using dirty tools'],
    ['Which is a pest of cabbage?', 'Caterpillars', 'Blight', 'Wilt', 'Damping off'],
    ['Which is a way to prevent disease spreading?', 'Using clean tools', 'Using dirty tools', 'Planting too close', 'Leaving sick plants'],
  ], [
    ['Tiny green insects suck sap from the leaves of kale. What are they?', 'Aphids', 'Blight', 'Wilt', 'Mosaic'],
    ['Tomato leaves develop dark patches and die. What is this?', 'A disease called blight', 'A pest called aphid', 'A pest called cutworm', 'A pest called weevil'],
    ['A farmer plants beans where tomatoes grew last season. What is this?', 'Crop rotation', 'Overcrowding', 'Burning', 'Wasting land'],
    ['A farmer picks caterpillars off cabbages by hand. What is this?', 'Controlling pests by hand-picking', 'Spreading disease', 'Wasting time', 'Harming the crop'],
    ['A farmer cleans his knife between plants. Why?', 'To stop spreading disease', 'To make it shiny', 'To make it noisy', 'To waste time'],
  ], [
    ['Which step is the mistake?', 'Step 1: Pests are small animals.', 'Step 2: Aphids are one.', 'Step 3: So blight is a pest.', 'Blight is a disease.', 2],
    ['Which step is the mistake?', 'Step 1: Diseases are caused by germs.', 'Step 2: Blight is one.', 'Step 3: So blight is a pest.', 'Blight is a disease.', 2],
    ['Which step is the mistake?', 'Step 1: Crop rotation changes crops.', 'Step 2: It breaks pest cycles.', 'Step 3: So it helps pests.', 'It helps control pests.', 2],
    ['Which step is the mistake?', 'Step 1: Caterpillars eat leaves.', 'Step 2: They can be picked off.', 'Step 3: So we leave them alone.', 'We control them.', 2],
    ['Which step is the mistake?', 'Step 1: Tools can carry germs.', 'Step 2: Cleaning stops the spread.', 'Step 3: So we use dirty tools.', 'We clean the tools.', 2],
  ], ['a', 'a']),
  ...S('fp', AP, 'FISH_PROCESS', ['FP_ORDER', 'FP_METHOD', 'FP_SAFE'], ['Scale, gut and wash fish, then dry, salt, smoke or fry it.', 'The teacher uses the knife.'], [
    ['What is done first to fresh fish?', 'Scaling and gutting', 'Drying it whole', 'Leaving it in the sun', 'Burying it'],
    ['Which makes fish last longer?', 'Drying or smoking', 'Leaving it in the sun uncovered', 'Leaving it in warm water', 'Burying it in soil'],
    ['Who uses the knife to gut fish at school?', 'The teacher', 'Any learner alone', 'A visitor', 'Nobody'],
    ['Why is fish washed after gutting?', 'To remove dirt and blood', 'To make it dry', 'To make it heavy', 'To make it sour'],
    ['Why is fresh fish processed?', 'So it keeps longer and is safe to eat', 'So it spoils faster', 'So it is wasted', 'So it is hidden'],
  ], [
    ['A fisherman has fresh fish at the shore. What does he do first?', 'Scale and gut it', 'Dry it whole', 'Bury it', 'Leave it uncovered'],
    ['A mama hangs cleaned fish in smoke. Why?', 'To make it last longer', 'To make it spoil', 'To make it wet', 'To waste it'],
    ['A class watches a teacher gut a fish. Why does the teacher use the knife?', 'Knives are dangerous for children', 'Teachers like knives', 'Nobody else can see', 'Learners are not interested'],
    ['A trader washes the gutted fish in clean water. Why?', 'To keep it clean and safe', 'To make it noisy', 'To make it spoil', 'To make it small'],
    ['A fish is salted and dried in the sun on a rack. What is this?', 'Preserving fish', 'Wasting fish', 'Hiding fish', 'Losing fish'],
  ], [
    ['Which step is the mistake?', 'Step 1: Fresh fish spoils quickly.', 'Step 2: We scale and gut it first.', 'Step 3: So we dry it whole first.', 'We scale and gut it first.', 2],
    ['Which step is the mistake?', 'Step 1: Germs spoil fish.', 'Step 2: Drying and smoking stop them.', 'Step 3: So leaving it in the sun uncovered is best.', 'Drying or smoking helps.', 2],
    ['Which step is the mistake?', 'Step 1: Knives are sharp.', 'Step 2: Children can get hurt.', 'Step 3: So any learner may gut fish alone.', 'The teacher uses the knife.', 2],
    ['Which step is the mistake?', 'Step 1: Gutted fish has blood and dirt.', 'Step 2: Washing removes them.', 'Step 3: So we do not wash it.', 'We wash it.', 2],
    ['Which step is the mistake?', 'Step 1: Processing makes fish last.', 'Step 2: It also keeps it safe.', 'Step 3: So processing spoils fish.', 'Processing keeps fish safe.', 2],
  ], ['a', 'b']),
  ...S('pd2', AP, 'POULTRY_DRESS', ['PD_ORDER', 'PD_SCALD', 'PD_SAFE'], ['Bleed, scald, pluck, remove the insides, wash and chill.', 'Only the teacher slaughters poultry.'], [
    ['Which comes first in dressing a bird?', 'Slaughter and bleeding', 'Plucking', 'Washing', 'Chilling'],
    ['What is done to loosen feathers?', 'Scalding in hot water', 'Rubbing with soil', 'Drying in the sun', 'Painting'],
    ['Who slaughters poultry at school?', 'The teacher', 'Any learner alone', 'A visitor', 'Nobody'],
    ['What comes after plucking?', 'Removing the insides', 'Bleeding', 'Scalding', 'Feeding'],
    ['Why chill the carcass after washing?', 'To keep the meat fresh', 'To make it hot', 'To make it dirty', 'To make it hard'],
  ], [
    ['A butcher prepares a bird. Which step is first?', 'Slaughter and bleeding', 'Plucking', 'Washing', 'Chilling'],
    ['Feathers are hard to pull off a cold bird. What loosens them?', 'Scalding in hot water', 'Rubbing with soil', 'Drying in the sun', 'Painting'],
    ['A class wants to slaughter a bird alone. What should the teacher say?', 'No, the teacher does it', 'Yes, go ahead', 'Yes, but quickly', 'Yes, with a friend'],
    ['The feathers are off. What is the next step?', 'Removing the insides', 'Bleeding', 'Scalding', 'Feeding'],
    ['A dressed carcass is washed and chilled. What does this keep?', 'The meat fresh and safe', 'The meat hot', 'The meat dirty', 'The meat hard'],
  ], [
    ['Which step is the mistake?', 'Step 1: A bird must be killed first.', 'Step 2: It is bled.', 'Step 3: So we pluck before bleeding.', 'Bleeding comes before plucking.', 2],
    ['Which step is the mistake?', 'Step 1: Feathers cling tightly.', 'Step 2: Hot water loosens them.', 'Step 3: So we rub with soil.', 'We scald in hot water.', 2],
    ['Which step is the mistake?', 'Step 1: Slaughter needs skill.', 'Step 2: It must be done kindly.', 'Step 3: So any learner may do it alone.', 'The teacher does it.', 2],
    ['Which step is the mistake?', 'Step 1: Feathers are removed.', 'Step 2: Insides are then removed.', 'Step 3: So we remove the insides before bleeding.', 'Insides come out after plucking.', 2],
    ['Which step is the mistake?', 'Step 1: Meat spoils at room temperature.', 'Step 2: Chilling keeps it fresh.', 'Step 3: So we leave it in the sun.', 'We chill it.', 2],
  ], ['a', 'c']),
  ...S('mp', PA, 'MILK_PRESERVE', ['MP_BOIL', 'MP_FERMENT', 'MP_CONTAINER'], ['Boil and cool milk, ferment it or dry it.', 'Use clean covered containers.'], [
    ['How can milk be kept longer?', 'By boiling and cooling it', 'By leaving it raw in the sun', 'By leaving the lid off', 'By mixing it with mud'],
    ['Which preserves milk by fermenting?', 'Making yoghurt', 'Boiling it dry', 'Pouring it away', 'Freezing the cow'],
    ['How should milk be stored?', 'In a clean, covered container', 'In a dirty can', 'In an open bowl in the sun', 'In a leaking basket'],
    ['Why is milk boiled?', 'To kill germs', 'To make it sour at once', 'To make it solid', 'To make it blue'],
    ['Where should fresh milk be kept?', 'In a cool place', 'In the hot sun', 'Near the fire', 'On a hot roof'],
  ], [
    ['Mama has extra fresh milk. How can she keep it longer?', 'Boil it and keep it cool', 'Leave it raw in the sun', 'Leave the lid off', 'Mix it with mud'],
    ['A family turns milk into thick sour milk. What is this?', 'Fermenting', 'Wasting', 'Burning', 'Freezing'],
    ['A farmer pours milk into a dirty can. What may happen?', 'It spoils quickly', 'It keeps longer', 'It turns to cheese', 'Nothing happens'],
    ['A mother boils milk before giving it to children. Why?', 'To kill germs', 'To waste fuel', 'To make it dry', 'To make it blue'],
    ['Milk left in the hot sun turns sour. What does this show?', 'Milk must be kept cool', 'Sun keeps milk fresh', 'Milk likes heat', 'Nothing'],
  ], [
    ['Which step is the mistake?', 'Step 1: Fresh milk spoils quickly.', 'Step 2: Boiling kills germs.', 'Step 3: So raw milk in the sun lasts longest.', 'Boil and cool milk.', 2],
    ['Which step is the mistake?', 'Step 1: Yoghurt is made from milk.', 'Step 2: Fermenting keeps it longer.', 'Step 3: So fermenting spoils milk.', 'Fermenting preserves milk.', 2],
    ['Which step is the mistake?', 'Step 1: Germs live in dirt.', 'Step 2: Clean containers keep milk safe.', 'Step 3: So any dirty can will do.', 'Use clean containers.', 2],
    ['Which step is the mistake?', 'Step 1: Milk is rich in food.', 'Step 2: Germs grow in warm milk.', 'Step 3: So keep it in the sun.', 'Keep it cool.', 2],
    ['Which step is the mistake?', 'Step 1: Covers keep out flies.', 'Step 2: Flies carry germs.', 'Step 3: So leave the lid off.', 'Keep it covered.', 2],
  ], ['a', 'c']),
  ...S('me', PA, 'MEAT_PRESERVE', ['ME_DRY', 'ME_COLD', 'ME_SALT'], ['Drying, salting, smoking and freezing keep meat longer.', 'Raw meat is kept cold and covered.'], [
    ['Which method preserves meat?', 'Drying it', 'Leaving it wet in the sun', 'Leaving it in warm water', 'Burying it in soil'],
    ['How should raw meat be kept?', 'Cold and covered', 'Warm and uncovered', 'In the hot sun', 'Next to the stove'],
    ['What does salting do to meat?', 'Helps it last longer', 'Spoils it faster', 'Turns it to stone', 'Makes it grow'],
    ['What does smoking do to meat?', 'Dries it and helps it last', 'Makes it spoil', 'Makes it sweet', 'Makes it blue'],
    ['Why does freezing keep meat?', 'It stops germs growing', 'It speeds up germs', 'It makes germs happy', 'It cooks the meat'],
  ], [
    ['A family cuts meat into strips and hangs them to dry. What is this?', 'Preserving meat', 'Wasting meat', 'Hiding meat', 'Losing meat'],
    ['A shopkeeper keeps raw meat uncovered on a warm counter. What is wrong?', 'It will spoil and attract flies', 'Nothing is wrong', 'It will last longer', 'It will cook'],
    ['A family rubs salt into meat and dries it. Why?', 'To help it last longer', 'To make it spoil', 'To make it hard as stone', 'To waste salt'],
    ['A butcher hangs meat in smoke. What is this?', 'Smoking', 'Boiling', 'Freezing', 'Burying'],
    ['A family stores meat in a fridge freezer. What does this do?', 'Stops germs from growing', 'Speeds up germs', 'Cooks the meat', 'Dries the meat'],
  ], [
    ['Which step is the mistake?', 'Step 1: Germs need water.', 'Step 2: Drying removes water.', 'Step 3: So drying spoils meat.', 'Drying preserves meat.', 2],
    ['Which step is the mistake?', 'Step 1: Warm meat spoils quickly.', 'Step 2: Cold slows germs.', 'Step 3: So raw meat is kept warm.', 'Raw meat is kept cold and covered.', 2],
    ['Which step is the mistake?', 'Step 1: Salt draws water out.', 'Step 2: Germs cannot grow well.', 'Step 3: So salt spoils meat.', 'Salt helps meat last.', 2],
    ['Which step is the mistake?', 'Step 1: Smoke dries meat.', 'Step 2: It also adds flavour.', 'Step 3: So smoking makes meat spoil.', 'Smoking helps preserve meat.', 2],
    ['Which step is the mistake?', 'Step 1: Cold stops germs.', 'Step 2: Freezing is very cold.', 'Step 3: So freezing speeds up germs.', 'Freezing stops germs.', 2],
  ], ['a', 'b']),
  ...S('bm', BM, 'BALANCED_MEAL', ['BM_ENERGY', 'BM_PROTEIN', 'BM_PROTECT'], ['Ugali gives energy; beans build the body; vegetables protect.', 'Plan by cost, age, health and season.'], [
    ['Which is an energy food?', 'Ugali', 'Beans', 'Spinach', 'Fish'],
    ['Which is a body-building food?', 'Beans', 'Ugali', 'Rice', 'Sugar'],
    ['Which is a protective food?', 'Vegetables', 'Sugar', 'Fat', 'Ugali'],
    ['What does a balanced meal contain?', 'Foods from all the groups', 'Only sweets', 'Only ugali', 'Only meat'],
    ['Which should be considered when planning a meal?', 'Cost, age, health and the season', 'Only the colour of the plate', 'Only the day of the week', 'Only the neighbour\'s meal'],
  ], [
    ['A runner needs energy for a race. Which food helps most?', 'Ugali or rice', 'Beans only', 'Spinach only', 'Fish only'],
    ['A child needs to grow strong. Which food builds the body?', 'Beans or fish', 'Ugali only', 'Sugar only', 'Fat only'],
    ['A family wants to stay free from disease. Which food protects the body?', 'Vegetables and fruit', 'Sugar', 'Fat', 'Plain ugali'],
    ['A cook serves ugali, sukuma wiki and beans. What kind of meal is this?', 'A balanced meal', 'An unbalanced meal', 'Only sweets', 'A meal with no food'],
    ['A cook plans a cheap meal using foods in season. What is she considering?', 'Cost and the season', 'Only the plate colour', 'Only the weather', 'Nothing'],
  ], [
    ['Which step is the mistake?', 'Step 1: Ugali is a carbohydrate.', 'Step 2: Carbohydrates give energy.', 'Step 3: So beans give most energy.', 'Ugali gives energy.', 2],
    ['Which step is the mistake?', 'Step 1: Beans are rich in protein.', 'Step 2: Protein builds the body.', 'Step 3: So ugali builds the body.', 'Beans build the body.', 2],
    ['Which step is the mistake?', 'Step 1: Vegetables have vitamins.', 'Step 2: Vitamins protect health.', 'Step 3: So sugar protects health.', 'Vegetables protect the body.', 2],
    ['Which step is the mistake?', 'Step 1: A balanced meal has many groups.', 'Step 2: It supplies all needs.', 'Step 3: So a meal of ugali alone is balanced.', 'It needs all the groups.', 2],
    ['Which step is the mistake?', 'Step 1: Meals are planned for people.', 'Step 2: Age and health matter.', 'Step 3: So cost never matters.', 'Cost matters too.', 2],
  ], ['a', 'c']),
  ...S('kc', CK, 'KITCHEN_CLEAN', ['KC_DAILY', 'KC_RAW', 'KC_WASTE'], ['Wash dishes every day; keep raw meat apart; dispose of waste.', 'Clean the cooker and shelves weekly.'], [
    ['How often are dishes washed?', 'Every day', 'Once a year', 'Once a month', 'Never'],
    ['How should raw meat be kept from vegetables?', 'Kept apart', 'Mixed together', 'On the same board', 'In the same bowl'],
    ['What should be done with kitchen waste?', 'Disposed of properly', 'Left under the table', 'Left to rot indoors', 'Hidden in a cupboard'],
    ['Which surfaces are wiped every day?', 'Tables and worktops', 'The roof', 'The road', 'The farm fence'],
    ['Why is a clean kitchen important?', 'It keeps food safe and healthy', 'It makes food spoil', 'It attracts pests', 'It makes noise'],
  ], [
    ['After supper, dishes pile up for a week. What is wrong?', 'Germs and pests will gather', 'Nothing is wrong', 'They will clean themselves', 'They will be safer'],
    ['A cook chops raw chicken and then salad on the same board without washing. What is wrong?', 'Germs can spread to the salad', 'Nothing is wrong', 'The salad will cook', 'The chicken will clean it'],
    ['A bin overflows in the kitchen. What should be done?', 'Dispose of the waste properly', 'Leave it overflowing', 'Hide it', 'Add more'],
    ['A cook wipes the worktop with soapy water each evening. What is this?', 'Routine cleaning', 'Wasting water', 'A mistake', 'A game'],
    ['A cook cleans the cooker every week. Why?', 'To remove grease and keep the kitchen safe', 'To waste time', 'To make noise', 'To break it'],
  ], [
    ['Which step is the mistake?', 'Step 1: Used dishes hold germs.', 'Step 2: Washing removes them.', 'Step 3: So dishes are washed once a year.', 'Dishes are washed every day.', 2],
    ['Which step is the mistake?', 'Step 1: Raw meat has germs.', 'Step 2: Vegetables are often eaten raw.', 'Step 3: So raw meat and vegetables are mixed.', 'Keep them apart.', 2],
    ['Which step is the mistake?', 'Step 1: Waste attracts pests.', 'Step 2: It must be removed.', 'Step 3: So it is left under the table.', 'It is disposed of properly.', 2],
    ['Which step is the mistake?', 'Step 1: Worktops get dirty.', 'Step 2: Wiping removes dirt.', 'Step 3: So worktops are never wiped.', 'They are wiped daily.', 2],
    ['Which step is the mistake?', 'Step 1: A clean kitchen is safe.', 'Step 2: It keeps pests away.', 'Step 3: So cleanliness attracts pests.', 'Cleanliness keeps pests away.', 2],
  ], ['a', 'a']),
  ...S('sm', SS, 'SEAMS', ['SM_PLAIN', 'SM_FRENCH', 'SM_USE'], ['A plain seam joins two pieces with a row of stitches.', 'A French seam encloses the raw edges.'], [
    ['What is a plain seam?', 'Two pieces joined with a row of stitches', 'Two edges glued together tightly', 'Two pieces tied up with some string', 'A hole cut out of the cloth'],
    ['What does a French seam do?', 'Encloses the raw edges', 'Leaves raw edges showing', 'Cuts the cloth', 'Burns the cloth'],
    ['Where are seams used?', 'In pillow cases and curtains', 'Only in walls', 'Only in bricks', 'Only in roads'],
    ['Why use a French seam on light cloth?', 'It stops the edges fraying', 'It makes holes in the cloth', 'It makes the whole cloth wet', 'It cuts the cloth in pieces'],
    ['What is a seam?', 'A line where cloth pieces are joined', 'A hole in the cloth', 'A kind of button on a shirt', 'A kind of dye for cloth'],
  ], [
    ['A learner stitches two pieces of cloth together with one row. What seam is this?', 'A plain seam', 'A French seam', 'A glued seam', 'A knotted seam'],
    ['A tailor sews a seam that hides the raw edges inside. What seam is this?', 'A French seam', 'A plain seam', 'A glued seam', 'A knotted seam'],
    ['A class makes cushion covers with seams. What are seams used for?', 'Joining cloth in household items', 'Building walls', 'Making roads', 'Painting'],
    ['A thin curtain keeps fraying at the edges. Which seam helps?', 'A French seam', 'No seam', 'A glued edge', 'A knotted edge'],
    ['A learner makes a sample of each seam on scrap cloth. What is she doing?', 'Practising seams', 'Wasting cloth', 'Burning cloth', 'Losing cloth'],
  ], [
    ['Which step is the mistake?', 'Step 1: A plain seam joins two pieces.', 'Step 2: It uses a row of stitches.', 'Step 3: So a plain seam is glued.', 'A plain seam is stitched.', 2],
    ['Which step is the mistake?', 'Step 1: Raw edges fray.', 'Step 2: A French seam hides them.', 'Step 3: So a French seam leaves them showing.', 'It encloses them.', 2],
    ['Which step is the mistake?', 'Step 1: Household items are sewn.', 'Step 2: Seams join the pieces.', 'Step 3: So seams are used in walls.', 'Seams join cloth.', 2],
    ['Which step is the mistake?', 'Step 1: Light cloth frays.', 'Step 2: A French seam prevents it.', 'Step 3: So we need no seam.', 'A suitable seam helps.', 2],
    ['Which step is the mistake?', 'Step 1: Practice improves stitching.', 'Step 2: Samples help.', 'Step 3: So samples are a waste.', 'Samples help.', 2],
  ], ['a', 'a']),
  ...S('wa', IW, 'WATERERS', ['WA_OPEN', 'WA_SAVE', 'WA_MATERIAL'], ['Open troughs get dirty and spill; innovative waterers save water.', 'A clean bottle can make a simple waterer.'], [
    ['What is a problem of open troughs?', 'They get dirty and spill', 'They stay perfectly clean', 'They never spill', 'They make water sweet'],
    ['How does an innovative waterer help?', 'It saves water', 'It wastes water', 'It spoils water', 'It dries water'],
    ['Which can make a simple waterer?', 'A clean plastic bottle', 'A heavy stone', 'A pile of sand', 'A broken glass'],
    ['Why keep animal water clean?', 'To prevent disease', 'To make it sweet', 'To make it hot', 'To make it cold'],
    ['Which is a benefit of a waterer that lets out little water?', 'Less water is wasted', 'More water is wasted', 'The animals go thirsty', 'The water turns dirty'],
  ], [
    ['Hens knock over an open trough and the water spills. What can help?', 'A bottle waterer', 'A bigger trough', 'No water', 'A hole in the trough'],
    ['A farmer makes a waterer from a bottle that releases a little water. What does it do?', 'Saves water', 'Wastes water', 'Spoils water', 'Dries water'],
    ['A learner wants to make a waterer. Which material is suitable?', 'A clean plastic bottle', 'A heavy stone', 'A pile of sand', 'A broken glass'],
    ['Animals get sick from dirty water in an open trough. What fixes this?', 'A covered waterer', 'More dirt', 'No cover', 'A wider trough'],
    ['A waterer keeps the water clean for the chicks. What is the benefit?', 'Fewer diseases', 'More diseases', 'More spills', 'Less drinking'],
  ], [
    ['Which step is the mistake?', 'Step 1: Open troughs are easy to fill.', 'Step 2: Animals foul them.', 'Step 3: So they stay clean.', 'They get dirty.', 2],
    ['Which step is the mistake?', 'Step 1: Water is limited.', 'Step 2: A good waterer saves it.', 'Step 3: So it wastes water.', 'It saves water.', 2],
    ['Which step is the mistake?', 'Step 1: Waterers can be made from waste.', 'Step 2: A bottle can be used.', 'Step 3: So a stone makes a waterer.', 'A clean bottle can be used.', 2],
    ['Which step is the mistake?', 'Step 1: Dirty water carries germs.', 'Step 2: Animals may fall sick.', 'Step 3: So dirty water is fine.', 'Clean water is needed.', 2],
    ['Which step is the mistake?', 'Step 1: Innovation solves problems.', 'Step 2: Waterers use local materials.', 'Step 3: So innovation is a waste.', 'Innovation helps.', 2],
  ], ['a', 'a']),
  ...S('ic', IC, 'ICT_SERVICES', ['IS_SERVICE', 'IS_WEATHER', 'IS_SAFE'], ['eCitizen, M-Pesa and weather SMS are ICT services.', 'Keep passwords private.'], [
    ['Which service is reached through ICT?', 'eCitizen', 'A bus ride', 'A haircut', 'A tea break'],
    ['How can a weather SMS help a farmer?', 'It tells when rain is likely', 'It cannot help', 'It brings the rain', 'It stops the wind'],
    ['What should you do with your password?', 'Keep it private', 'Share it', 'Post it online', 'Sell it'],
    ['Which service sends money by phone?', 'M-Pesa', 'A bicycle', 'A radio', 'A lamp'],
    ['Which can help a learner study online?', 'An online lesson', 'A loud noise', 'A broken book', 'A closed door'],
  ], [
    ['A farmer wants to pay a fee online. Which service can she use?', 'eCitizen', 'A bus ride', 'A haircut', 'A tea break'],
    ['A farmer receives an SMS saying rain is coming tomorrow. How does this help?', 'She can plan farm work', 'It cannot help', 'It brings the rain', 'It stops the wind'],
    ['A friend asks for your password. What should you do?', 'Keep it private', 'Share it', 'Post it', 'Sell it'],
    ['A shopkeeper receives payment by phone. Which service is this?', 'M-Pesa', 'A bicycle', 'A radio', 'A lamp'],
    ['A farmer gets crop advice by phone. What kind of service is this?', 'An ICT support service', 'A bus service', 'A cooking service', 'A building service'],
  ], [
    ['Which step is the mistake?', 'Step 1: ICT services use phones or computers.', 'Step 2: eCitizen is one.', 'Step 3: So a bus ride is an ICT service.', 'eCitizen is an ICT service.', 2],
    ['Which step is the mistake?', 'Step 1: Weather SMS gives forecasts.', 'Step 2: Farmers plan by them.', 'Step 3: So they cannot help farmers.', 'They help plan farm work.', 2],
    ['Which step is the mistake?', 'Step 1: Passwords protect accounts.', 'Step 2: Others could misuse them.', 'Step 3: So we share them freely.', 'We keep them private.', 2],
    ['Which step is the mistake?', 'Step 1: M-Pesa moves money.', 'Step 2: It uses a phone.', 'Step 3: So it is a bicycle.', 'It is a mobile money service.', 2],
    ['Which step is the mistake?', 'Step 1: ICT can give advice.', 'Step 2: A trusted adult can help.', 'Step 3: So children should use it with strangers.', 'Use it safely with a trusted adult.', 2],
  ], ['a', 'a']),
];
