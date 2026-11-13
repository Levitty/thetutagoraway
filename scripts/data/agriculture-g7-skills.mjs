// ============================================================================
// AGRICULTURE GRADE 7: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/agriculture/g7.json by scripts/build-agriculture-g7.mjs. KICD's outcomes and rubrics are never touched.
// Each sub-strand has a knowledge outcome (a), a hands-on outcome (b) and an attitude outcome (c). Only the knowledge outcomes are tested
// here; gardening, constructing, cooking, laundering, knitting and soap making are practical tasks marked by the teacher.
// Safety: heat, sharp tools, chemicals and caustic soap ingredients are handled only by a teacher; questions ask for names and reasons.
// Everything is draft until an Agriculture teacher reviews it.
// A skill: [sub-strand key after 'AGRI.G7.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const SP = 'CONSER.CONTROLLING_SOIL_POLLUTI', WR = 'CONSER.CONSTRUCTING_WATER_RETEN', FN = 'CONSER.CONSERVING_FOOD_NUTRIENT', GT = 'CONSER.GROWING_TREES';
const CE = 'FOOD_P.CROP_ESTABLISHMENT', CM = 'FOOD_P.SELECTED_CROP_MANAGEMENT', AP = 'FOOD_P.PREPARING_ANIMAL_PRODUCT', CF = 'FOOD_P.COOKING_FOOD';
const HA = 'HYGIEN.HYGIENE_IN_REARING_ANIMA', LL = 'HYGIEN.LAUNDRY_LOOSE_COLOURED_I';
const KS = 'PRODUC.KNITTING_SKILLS', FG = 'PRODUC.CONSTRUCTING_FRAMED_SUSP', VA = 'PRODUC.ADDING_VALUE_TO_CROP_PRO', HS = 'PRODUC.MAKING_HOMEMADE_SOAP';
const FM = ['pick the right answer', 'pick the right answer in a short story', 'find the false step in a learner\'s reason'];
export const SKILLS = [
  [SP, 'SOIL_POLLUTION', 'Name causes of soil pollution and ways to control it', ['a', 'b'], [], FM, 'The child names causes (too much fertiliser or pesticide, dumped polythene and plastic, oil spills, dumped rubbish) and controls (reduce, reuse and recycle waste, use manure, dispose of waste properly), and does not say pollution helps the soil.'],
  [WR, 'RUNOFF', 'Say how surface run-off is used and kept in gardening', ['a', 'b'], ['SOIL_POLLUTION'], FM, 'The child says surface run-off is water flowing over the ground, which can be trapped in trenches, terraces, water pans and zai pits and used for the garden, and that mulch and ridges slow it.'],
  [FN, 'NUTRIENT_KEEP', 'Name ways of keeping vitamins and minerals in vegetables', ['a'], [], FM, 'The child says to wash vegetables before cutting, cook them for a short time in little water with a lid on, not to peel thickly, to use the cooking water and to eat some raw, and does not say long boiling keeps vitamins.'],
  [GT, 'TREES_IMPORTANCE', 'Say why trees matter to the environment', ['a'], [], FM, 'The child says trees give oxygen, bring rain, hold soil against erosion, give shade and shelter and wood and fruit, and make homes for birds, and do not dry up the land.'],
  [CE, 'TILTH', 'Match the tilth to the planting material', ['a'], [], FM, 'The child says small seeds such as carrot and onion need a fine tilth, medium seeds such as beans and maize need a medium tilth and tubers and cuttings such as sweet potato need a coarse tilth.'],
  [CM, 'CROP_PRACTICES', 'Name management practices for crops and what each does', ['a'], ['TILTH'], FM, 'The child names weeding (removes competition), thinning (removes extra seedlings), gapping (replaces seeds that did not grow), mulching (keeps water), pruning, staking and earthing up, and says each helps the crop grow.'],
  [AP, 'ANIMAL_PRODUCTS', 'Say how animal products are prepared safely', ['a'], ['SOIL_POLLUTION'], FM, 'The child says milk is boiled or pasteurised, eggs and meat are cooked well, hands and tools are washed, and products are kept cool and covered, and that raw milk can carry germs.'],
  [CF, 'COOKING_METHODS', 'Name methods of cooking and the food each suits', ['a'], ['NUTRIENT_KEEP'], FM, 'The child names boiling (in water), steaming (over steam), frying (in oil), roasting (dry heat), baking (in an oven) and stewing (slow, with liquid), and gives an example food for each; hot cooking is done only with an adult.'],
  [HA, 'ANIMAL_HYGIENE', 'Name hygiene practices in rearing animals', ['a'], ['ANIMAL_PRODUCTS'], FM, 'The child names cleaning the house and removing dung, clean water and feed, vaccination, dipping or spraying, deworming, separating sick animals and washing hands after handling, and says they prevent disease.'],
  [LL, 'LAUNDRY_COLOURS', 'Say how to launder a loose-coloured article', ['a'], [], FM, 'The child says to wash loose-coloured articles separately, in cold water, quickly, rinse well and dry in the shade, and not to soak them long or wash them with white clothes.'],
  [KS, 'KNITTING', 'Name the stitches and tools used in knitting', ['a'], [], FM, 'The child names knitting needles and yarn, casting on and casting off, and the knit stitch and purl stitch, and says alternating knit and purl rows makes stocking stitch.'],
  [FG, 'FRAMED_GARDEN', 'Describe a framed suspended garden and its advantages', ['a'], ['TREES_IMPORTANCE'], FM, 'The child says a framed suspended garden is a frame that holds containers of soil above the ground, saves space and suits small compounds, and needs soil with manure, drainage and regular watering.'],
  [VA, 'VALUE_ADDITION', 'Name ways of adding value to crop produce', ['a'], ['CROP_PRACTICES'], FM, 'The child says value is added by cleaning, sorting, drying, grinding into flour, packaging and processing, such as tomato into sauce and mango into juice, so the produce sells for more.'],
  [HS, 'SOAP_FORMS', 'Name the forms of soap used at home', ['a'], [], FM, 'The child names bar, liquid, powder and paste soap, says soap removes dirt and germs when used with water, and says that making soap involves strong chemicals and heat and is done only with a teacher.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_AG7_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('SOIL_POLLUTION', 'SP_GOOD', 'Thinks more fertiliser is always good.', 'What can too much fertiliser do to the soil?', 'Make it healthier', 'Pollute and harm it', 'Too much fertiliser pollutes the soil.'),
  m('SOIL_POLLUTION', 'SP_PLASTIC', 'Thinks buried polythene is harmless.', 'Why is polythene a problem in the soil?', 'It feeds the plants', 'It does not rot and blocks water', 'Polythene does not rot and blocks water and roots.'),
  m('SOIL_POLLUTION', 'SP_CONTROL', 'Names a harmful control.', 'Which helps to control soil pollution?', 'Burning plastic on the farm', 'Reducing and recycling waste', 'Reduce, reuse and recycle waste.'),
  m('RUNOFF', 'RO_WASTE', 'Thinks run-off is only waste.', 'What can be done with surface run-off?', 'Nothing, it is useless', 'Trap it and use it in the garden', 'Run-off can be trapped and used.'),
  m('RUNOFF', 'RO_STRUCTURE', 'Names a non-structure.', 'Which traps run-off?', 'A bare path', 'A trench or a water pan', 'Trenches and water pans trap run-off.'),
  m('RUNOFF', 'RO_MULCH', 'Thinks mulch speeds up run-off.', 'What does mulch do to run-off?', 'Speeds it up', 'Slows it down', 'Mulch slows run-off and keeps water.'),
  m('NUTRIENT_KEEP', 'NK_LONG', 'Thinks long boiling is good.', 'How should vegetables be cooked to keep vitamins?', 'Boil them for a long time', 'Cook them a short time with a lid', 'Short cooking keeps the vitamins.'),
  m('NUTRIENT_KEEP', 'NK_WATER', 'Throws away the cooking water.', 'What should be done with the cooking water?', 'Throw it away at once', 'Use it, for example in soup', 'The water holds minerals; use it.'),
  m('NUTRIENT_KEEP', 'NK_WASH', 'Cuts before washing.', 'When should vegetables be washed?', 'After they are cut up small', 'Before they are cut', 'Wash before cutting to avoid losing vitamins.'),
  m('TREES_IMPORTANCE', 'TI_DRY', 'Thinks trees dry up the land.', 'What do trees do to the land?', 'Dry it up', 'Help hold the soil and bring rain', 'Trees hold soil and help rain.'),
  m('TREES_IMPORTANCE', 'TI_GAS', 'Gives the wrong gas.', 'Which gas do trees give out?', 'Smoke', 'Oxygen', 'Trees give out oxygen.'),
  m('TREES_IMPORTANCE', 'TI_USE', 'Thinks trees are useful only as firewood.', 'What else do trees give?', 'Only firewood', 'Shade, fruit, timber and shelter', 'Trees give shade, fruit, timber and shelter.'),
  m('TILTH', 'TL_SMALL', 'Gives a coarse tilth for small seeds.', 'Which tilth suits small seeds like carrot?', 'Coarse tilth', 'Fine tilth', 'Small seeds need a fine tilth.'),
  m('TILTH', 'TL_TUBER', 'Gives a fine tilth for tubers.', 'Which tilth suits sweet potato cuttings?', 'Fine tilth', 'Coarse tilth', 'Tubers and cuttings suit a coarse tilth.'),
  m('TILTH', 'TL_MEDIUM', 'Gives the wrong tilth for maize.', 'Which tilth suits maize and beans?', 'Fine tilth', 'Medium tilth', 'Maize and beans suit a medium tilth.'),
  m('CROP_PRACTICES', 'CP_WEED', 'Says weeds help the crop.', 'Why is weeding done?', 'Weeds help the crop grow', 'To remove competition for water and food', 'Weeds compete with crops.'),
  m('CROP_PRACTICES', 'CP_THIN', 'Mixes thinning and gapping.', 'What is thinning?', 'Replacing seeds that failed', 'Removing extra seedlings', 'Thinning removes extra seedlings.'),
  m('CROP_PRACTICES', 'CP_GAP', 'Mixes gapping and thinning.', 'What is gapping?', 'Removing extra seedlings', 'Replacing seeds that did not grow', 'Gapping replaces seeds that did not grow.'),
  m('ANIMAL_PRODUCTS', 'AP_RAW', 'Thinks raw milk is always safe.', 'What should be done to milk before drinking?', 'Nothing, raw is safest', 'Boil or pasteurise it', 'Boil or pasteurise milk to kill germs.'),
  m('ANIMAL_PRODUCTS', 'AP_HANDS', 'Skips handwashing.', 'What should be done before handling meat?', 'Nothing at all', 'Wash hands and tools', 'Wash hands and tools first.'),
  m('ANIMAL_PRODUCTS', 'AP_COOL', 'Leaves products in the sun.', 'How should fresh milk be kept?', 'In the hot sun', 'Cool and covered', 'Keep milk cool and covered.'),
  m('COOKING_METHODS', 'CK_STEAM', 'Mixes steaming and boiling.', 'What is steaming?', 'Cooking in oil', 'Cooking over the steam of boiling water', 'Steaming cooks food over steam.'),
  m('COOKING_METHODS', 'CK_FRY', 'Mixes frying and baking.', 'What is frying?', 'Cooking in an oven', 'Cooking in hot oil', 'Frying cooks food in hot oil.'),
  m('COOKING_METHODS', 'CK_BAKE', 'Mixes baking and boiling.', 'Which method uses an oven?', 'Boiling', 'Baking', 'Baking uses an oven.'),
  m('ANIMAL_HYGIENE', 'AH_DUNG', 'Leaves dung in the house.', 'What should be done to the animals\' house?', 'Leave the dung inside', 'Clean it and remove the dung', 'Clean the house and remove dung.'),
  m('ANIMAL_HYGIENE', 'AH_WATER', 'Gives dirty water.', 'What water should animals drink?', 'Any dirty water', 'Clean water', 'Give clean water.'),
  m('ANIMAL_HYGIENE', 'AH_SICK', 'Keeps the sick with the healthy.', 'What should be done with a sick animal?', 'Keep it with the others', 'Separate it from the others', 'Separate sick animals.'),
  m('LAUNDRY_COLOURS', 'LC_WHITE', 'Washes coloured with white.', 'How should a loose-coloured shirt be washed?', 'With white clothes', 'Separately', 'Wash loose colours separately.'),
  m('LAUNDRY_COLOURS', 'LC_SOAK', 'Soaks for long.', 'How long should a loose-coloured shirt be soaked?', 'For a whole day', 'Not for long', 'Do not soak loose colours long.'),
  m('LAUNDRY_COLOURS', 'LC_DRY', 'Dries in the hot sun.', 'Where should loose-coloured clothes dry?', 'In the hot sun', 'In the shade', 'Dry loose colours in the shade.'),
  m('KNITTING', 'KN_TOOL', 'Names the wrong tool.', 'Which tools are used for knitting?', 'A hammer and nails', 'Needles and yarn', 'Knitting uses needles and yarn.'),
  m('KNITTING', 'KN_STITCH', 'Names a wrong stitch.', 'Which is a knitting stitch?', 'Purl stitch', 'Brick stitch', 'Knit and purl are knitting stitches.'),
  m('KNITTING', 'KN_CAST', 'Mixes casting on and off.', 'What is casting on?', 'Finishing the knitting', 'Making the first row of stitches', 'Casting on makes the first stitches.'),
  m('FRAMED_GARDEN', 'FG_SPACE', 'Thinks it needs a big field.', 'Why use a suspended garden?', 'It needs a big field', 'It saves space', 'A suspended garden saves space.'),
  m('FRAMED_GARDEN', 'FG_DRAIN', 'Forgets drainage.', 'What must the containers have?', 'No holes at all', 'Holes for drainage', 'Containers need drainage holes.'),
  m('FRAMED_GARDEN', 'FG_SOIL', 'Fills with only sand.', 'What should the soil mixture have?', 'Only sand', 'Soil and manure', 'Use soil mixed with manure.'),
  m('VALUE_ADDITION', 'VA_RAW', 'Thinks raw produce sells best.', 'How does value addition help a farmer?', 'It lowers the price', 'It raises the selling price', 'Value addition raises the price.'),
  m('VALUE_ADDITION', 'VA_EXAMPLE', 'Gives a non-example.', 'Which is value addition?', 'Leaving mangoes to rot', 'Making mangoes into juice', 'Making juice adds value.'),
  m('VALUE_ADDITION', 'VA_STEPS', 'Skips cleaning and sorting.', 'What comes first in preparing produce for sale?', 'Selling it dirty', 'Cleaning and sorting', 'Clean and sort first.'),
  m('SOAP_FORMS', 'SF_FORM', 'Names a non-form.', 'Which is a form of soap?', 'Brick', 'Bar', 'Soap comes as bar, liquid, powder or paste.'),
  m('SOAP_FORMS', 'SF_USE', 'Thinks soap needs no water.', 'What does soap do with water?', 'Adds dirt', 'Removes dirt and germs', 'Soap with water removes dirt and germs.'),
  m('SOAP_FORMS', 'SF_SAFE', 'Thinks children may handle caustic chemicals.', 'Who handles strong soap chemicals?', 'Any child alone', 'The teacher only', 'Strong chemicals are handled by the teacher only.'),
];
