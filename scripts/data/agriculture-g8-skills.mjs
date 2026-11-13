// ============================================================================
// AGRICULTURE GRADE 8: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/agriculture/g8.json by scripts/build-agriculture-g8.mjs. KICD's outcomes and rubrics are never touched.
// Each sub-strand has a knowledge outcome (a), hands-on outcomes and an attitude outcome. Only the knowledge outcomes are tested here;
// gardening, constructing, rearing, processing, cooking, sewing and ICT use are practical tasks marked by the teacher.
// Safety: knives, heat, slaughter and live animals are handled only by a teacher or with a teacher present; questions ask for names,
// reasons and order, never the act. Everything is draft until an Agriculture teacher reviews it.
// A skill: [sub-strand key after 'AGRI.G8.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const SC = 'CONSER.SOIL_CONSERVATION_MEASUR', WS = 'CONSER.WATER_HARVESTING_AND_STO', KG = 'FOOD_P.KITCHEN_AND_BACKYARD_GAR', PF = 'FOOD_P.POULTRY_REARING_IN_A_FOL';
const PD = 'FOOD_P.CROP_PEST_AND_DISEASE_CO', AP = 'FOOD_P.PREPARATION_OF_ANIMAL_PR', PA = 'FOOD_P.PRESERVING_ANIMAL_PRODUC', BM = 'FOOD_P.COOKING_PREPARING_A_BALA';
const CK = 'HYGIEN.CLEANING_THE_KITCHEN', SS = 'PRODUC.SEWING_SKILLS_CONSTRUCTI', IW = 'PRODUC.CONSTRUCTING_INNOVATIVE_', IC = 'PRODUC.ICT_SUPPORT_SERVICES';
const FM = ['pick the right answer', 'pick the right answer in a short story', 'find the false step in a learner\'s reason'];
export const SKILLS = [
  [SC, 'SOIL_CONSERVE', 'Name methods of soil conservation', ['a'], [], FM, 'The child names terracing (steps on a slope), contour farming, mulching, cover crops, planting trees and strip cropping, and says they slow water and wind so soil is not carried away.'],
  [WS, 'WATER_STORE', 'Say how harvested water is stored safely for home use', ['a'], ['SOIL_CONSERVE'], FM, 'The child says harvested water is stored in clean covered tanks, drums and jerricans so it stays free of dirt and mosquitoes, and is treated by boiling or a purifier before drinking.'],
  [KG, 'KITCHEN_GARDEN', 'Explain the role of a kitchen and backyard garden', ['a'], [], FM, 'The child says a kitchen garden near the house gives fresh vegetables and herbs, saves money, uses little space and waste water, and grows crops such as sukuma wiki, spinach, onions and tomatoes.'],
  [PF, 'POULTRY_FOLD', 'Describe a fold in poultry rearing', ['a'], [], FM, 'The child says a fold is a light movable pen that is moved to fresh ground, protects birds from predators and rain, spreads manure and keeps the birds clean.'],
  [PD, 'PEST_DISEASE', 'Name pests and diseases of vegetables and how to control them', ['a'], ['KITCHEN_GARDEN'], FM, 'The child names aphids, cutworms and caterpillars as pests and blight, wilt and damping off as diseases of vegetables, and names controls (hand-picking, crop rotation, clean tools and spacing).'],
  [AP, 'FISH_PROCESS', 'Say why and how fresh fish is processed', ['a', 'b'], [], FM, 'The child says fish is scaled, gutted, washed and then dried, salted, smoked or fried so it lasts longer, and that clean hands, tools and water keep it safe; knives are used only with a teacher.'],
  [AP, 'POULTRY_DRESS', 'Say why and how a poultry carcass is dressed', ['a', 'c'], ['FISH_PROCESS'], FM, 'The child says dressing is done after slaughter and bleeding, then scalding, plucking, removing the insides and washing and chilling the carcass, to give clean meat; it is done only with a teacher and kindly.'],
  [PA, 'MILK_PRESERVE', 'Say how milk is preserved at home', ['a', 'c'], [], FM, 'The child says fresh milk is kept longer by boiling, cooling, fermenting (such as into yoghurt or mursik) or drying, and that clean containers and cool storage help.'],
  [PA, 'MEAT_PRESERVE', 'Say how meat is preserved at home', ['a', 'b'], ['MILK_PRESERVE'], FM, 'The child says meat is kept longer by drying, salting, smoking and freezing, which slow or stop germs, and that raw meat must be kept cold and covered.'],
  [BM, 'BALANCED_MEAL', 'Name the food groups and the factors in planning a balanced meal', ['a', 'c'], [], FM, 'The child says a balanced meal has energy foods (ugali, rice), body-building foods (beans, fish, meat), protective foods (vegetables, fruits) and water, and the cost, age, health and the foods in season are considered.'],
  [CK, 'KITCHEN_CLEAN', 'Name routine cleaning practices in a kitchen', ['a'], [], FM, 'The child names washing dishes, wiping surfaces, sweeping, disposing of waste and cleaning the sink every day, and cleaning the cooker and shelves each week, and keeping raw meat apart from vegetables.'],
  [SS, 'SEAMS', 'Name seams used in making household items', ['a'], [], FM, 'The child says a plain seam joins two pieces with a row of stitching, a French seam encloses the raw edges so they do not fray, and that seams are used for pillow cases, curtains and table cloths.'],
  [IW, 'WATERERS', 'Explain the challenges of animal waterers and how an innovative one helps', ['a'], [], FM, 'The child says open troughs get dirty, spill and lose water, and that a waterer made from a bottle or jerrican that lets out only a little water keeps it clean and saves water.'],
  [IC, 'ICT_SERVICES', 'Describe support services reached through ICT', ['a'], [], FM, 'The child names eCitizen, M-Pesa, online lessons, farm advice and weather SMS as services reached through a phone or computer, and says they are used safely with a trusted adult.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_AG8_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('SOIL_CONSERVE', 'SC_TERRACE', 'Thinks terraces speed up erosion.', 'What does terracing do on a slope?', 'Speeds up the water', 'Slows the water and holds soil', 'Terraces slow water and hold soil.'),
  m('SOIL_CONSERVE', 'SC_MULCH', 'Thinks mulch bares the soil.', 'What does mulch do to soil?', 'Leaves it bare', 'Covers and protects it', 'Mulch covers and protects soil.'),
  m('SOIL_CONSERVE', 'SC_CONTOUR', 'Ploughs up and down the slope.', 'How should crops be planted on a slope?', 'Up and down the slope', 'Along the contour', 'Plant along the contour.'),
  m('WATER_STORE', 'WS_COVER', 'Leaves water open.', 'How should stored water be kept?', 'Uncovered', 'In a clean, covered container', 'Keep water covered.'),
  m('WATER_STORE', 'WS_TREAT', 'Drinks harvested water untreated.', 'What should be done before drinking harvested water?', 'Nothing', 'Boil or purify it', 'Boil or purify before drinking.'),
  m('WATER_STORE', 'WS_MOSQUITO', 'Ignores mosquitoes.', 'Why must water tanks be covered?', 'To warm the water', 'To keep out dirt and mosquitoes', 'Covers keep out dirt and mosquitoes.'),
  m('KITCHEN_GARDEN', 'KG_SPACE', 'Thinks it needs a large farm.', 'Where is a kitchen garden kept?', 'On a distant large farm', 'Near the house', 'A kitchen garden is near the house.'),
  m('KITCHEN_GARDEN', 'KG_CROP', 'Names a poor crop.', 'Which crop suits a kitchen garden?', 'Timber trees', 'Sukuma wiki', 'Sukuma wiki suits a kitchen garden.'),
  m('KITCHEN_GARDEN', 'KG_MONEY', 'Thinks it costs more.', 'How does a kitchen garden help a family?', 'It costs a lot more', 'It saves money on vegetables', 'It saves money.'),
  m('POULTRY_FOLD', 'PF_MOVE', 'Thinks the fold stays fixed.', 'What is special about a fold?', 'It is never moved', 'It is moved to fresh ground', 'A fold is moved.'),
  m('POULTRY_FOLD', 'PF_PROTECT', 'Thinks a fold does not protect.', 'What does a fold protect birds from?', 'Nothing', 'Predators and rain', 'A fold protects from predators.'),
  m('POULTRY_FOLD', 'PF_MANURE', 'Thinks manure is wasted.', 'What happens to the manure from a fold?', 'It is wasted', 'It is spread on the ground', 'Manure is spread.'),
  m('PEST_DISEASE', 'PD_PEST', 'Mixes pests and diseases.', 'Which is a pest of vegetables?', 'Blight', 'Aphids', 'Aphids are pests.'),
  m('PEST_DISEASE', 'PD_DISEASE', 'Mixes diseases and pests.', 'Which is a disease of vegetables?', 'Aphids', 'Blight', 'Blight is a disease.'),
  m('PEST_DISEASE', 'PD_CONTROL', 'Names a harmful control.', 'Which helps to control pests?', 'Leaving weeds to grow', 'Crop rotation', 'Crop rotation helps.'),
  m('FISH_PROCESS', 'FP_ORDER', 'Dries fish before gutting.', 'What is done first to fresh fish?', 'Drying it whole', 'Scaling and gutting', 'Scale and gut first.'),
  m('FISH_PROCESS', 'FP_METHOD', 'Names a harmful method.', 'Which makes fish last longer?', 'Leaving it in the sun uncovered', 'Drying or smoking', 'Drying or smoking helps.'),
  m('FISH_PROCESS', 'FP_SAFE', 'Lets children use knives alone.', 'Who uses the knife to gut fish at school?', 'Any learner alone', 'The teacher', 'The teacher uses the knife.'),
  m('POULTRY_DRESS', 'PD_ORDER', 'Plucks before bleeding.', 'Which comes first in dressing a bird?', 'Plucking', 'Slaughter and bleeding', 'Bleeding comes before plucking.'),
  m('POULTRY_DRESS', 'PD_SCALD', 'Skips scalding.', 'What is done to loosen feathers?', 'Scalding in hot water', 'Rubbing with soil', 'Scalding loosens feathers.'),
  m('POULTRY_DRESS', 'PD_SAFE', 'Lets children slaughter.', 'Who slaughters poultry at school?', 'Any learner alone', 'The teacher', 'The teacher does it.'),
  m('MILK_PRESERVE', 'MP_BOIL', 'Thinks raw milk lasts longest.', 'How can milk be kept longer?', 'By leaving it raw in the sun', 'By boiling and cooling it', 'Boil and cool milk.'),
  m('MILK_PRESERVE', 'MP_FERMENT', 'Thinks fermenting spoils milk.', 'Which preserves milk by fermenting?', 'Boiling dry', 'Making yoghurt', 'Yoghurt is fermented milk.'),
  m('MILK_PRESERVE', 'MP_CONTAINER', 'Uses dirty containers.', 'How should milk be stored?', 'In a dirty can', 'In a clean, covered container', 'Use clean covered containers.'),
  m('MEAT_PRESERVE', 'ME_DRY', 'Thinks drying spoils meat.', 'Which method preserves meat?', 'Leaving it wet in the sun', 'Drying it', 'Drying preserves meat.'),
  m('MEAT_PRESERVE', 'ME_COLD', 'Leaves raw meat warm.', 'How should raw meat be kept?', 'Warm and uncovered', 'Cold and covered', 'Keep raw meat cold and covered.'),
  m('MEAT_PRESERVE', 'ME_SALT', 'Thinks salt spoils meat.', 'What does salting do to meat?', 'Spoils it faster', 'Helps it last longer', 'Salting helps meat last.'),
  m('BALANCED_MEAL', 'BM_ENERGY', 'Calls beans an energy food.', 'Which is an energy food?', 'Beans', 'Ugali', 'Ugali gives energy.'),
  m('BALANCED_MEAL', 'BM_PROTEIN', 'Calls ugali body-building.', 'Which is a body-building food?', 'Ugali', 'Beans', 'Beans build the body.'),
  m('BALANCED_MEAL', 'BM_PROTECT', 'Calls sugar protective.', 'Which is a protective food?', 'Sugar', 'Vegetables', 'Vegetables protect the body.'),
  m('KITCHEN_CLEAN', 'KC_DAILY', 'Cleans the kitchen once a year.', 'How often are dishes washed?', 'Once a year', 'Every day', 'Wash dishes every day.'),
  m('KITCHEN_CLEAN', 'KC_RAW', 'Mixes raw meat and vegetables.', 'How should raw meat be kept from vegetables?', 'Mixed together', 'Kept apart', 'Keep raw meat apart.'),
  m('KITCHEN_CLEAN', 'KC_WASTE', 'Leaves waste in the kitchen.', 'What should be done with kitchen waste?', 'Left under the table', 'Disposed of properly', 'Dispose of waste properly.'),
  m('SEAMS', 'SM_PLAIN', 'Gives the wrong description of a plain seam.', 'What is a plain seam?', 'Two edges glued', 'Two pieces joined with a row of stitches', 'A plain seam is one row of stitches.'),
  m('SEAMS', 'SM_FRENCH', 'Says a French seam leaves raw edges.', 'What does a French seam do?', 'Leaves raw edges showing', 'Encloses the raw edges', 'A French seam encloses raw edges.'),
  m('SEAMS', 'SM_USE', 'Gives seams a wrong use.', 'Where are seams used?', 'Only in walls', 'In pillow cases and curtains', 'Seams join cloth items.'),
  m('WATERERS', 'WA_OPEN', 'Thinks open troughs stay clean.', 'What is a problem of open troughs?', 'They stay perfectly clean', 'They get dirty and spill', 'Open troughs get dirty and spill.'),
  m('WATERERS', 'WA_SAVE', 'Thinks innovation wastes water.', 'How does an innovative waterer help?', 'It wastes water', 'It saves water', 'It saves water.'),
  m('WATERERS', 'WA_MATERIAL', 'Names an unsuitable material.', 'Which can make a simple waterer?', 'A heavy stone', 'A clean plastic bottle', 'A clean bottle can be used.'),
  m('ICT_SERVICES', 'IS_SERVICE', 'Names a non-ICT service.', 'Which service is reached through ICT?', 'A bus ride', 'eCitizen', 'eCitizen is an ICT service.'),
  m('ICT_SERVICES', 'IS_WEATHER', 'Thinks weather SMS is useless to farmers.', 'How can a weather SMS help a farmer?', 'It cannot help', 'It tells when rain is likely', 'It helps plan farm work.'),
  m('ICT_SERVICES', 'IS_SAFE', 'Shares passwords.', 'What should you do with your password?', 'Share it', 'Keep it private', 'Keep passwords private.'),
];
