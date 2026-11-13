// ============================================================================
// GRADE 6 AGRICULTURE AND NUTRITION, PART B: FOOD PRODUCTION AND HYGIENE (4 skills).
// Rearing rabbits and chickens, drying and storing crop produce, cooking methods, body cleanliness. Written offline from the
// KICD 2024 design. The questions test the knowledge behind the practical outcomes; rearing, drying, cooking and washing are
// tasks for the teacher (see docs/qa/agriculture-g6-non-question-outcomes-2026-11-13.md). Every wrong answer names the
// library misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g6_lib.js';

const SM = 'FOOD_P.REARING_SMALL_DOMESTIC_A.', PS = 'FOOD_P.PRESERVING_CROP_PRODUCTS.', CK = 'FOOD_P.COOKING_FOOD.', GM = 'HYGIEN.GOOD_GROOMING.';

export const FAMILIES = [
  // ---------------------------------------------------------------- SMALL_ANIMALS
  fam('sm.sa.routine', `${SM}SMALL_ANIMALS`, 'direct', 1, choose([
    Q('How often do rabbits and chickens need clean water?', 'Every day, fresh and clean', ['Only when they look thirsty|SA_WATER', 'Once a week|SA_WATER', 'Never, they get it from food|SA_WATER'], 'Animals need clean water every day.'),
    Q('How should the animal house be kept?', 'Clean and dry, with the droppings removed often', ['Wet and left for weeks without cleaning it|SA_DIRTY', 'Dirty on purpose so that it keeps the animals warm|SA_DIRTY', 'Closed tight with no air coming in at all|SA_DIRTY'], 'A clean, dry house helps the animals stay healthy.'),
    Q('A chicken looks sick. What should you do?', 'Separate it and tell the teacher or the animal health worker', ['Leave it with the others and say nothing to anyone at all|SA_SICK', 'Give it any medicine that is found at home|SA_SICK', 'Hide it from the teacher so it is not taken away|SA_SICK'], 'A sick animal is separated and an adult is told.'),
    Q('Which job is done every day?', 'Feeding and giving clean water', ['Changing the roof|SA_DIRTY', 'Building a new house|SA_DIRTY', 'Selling the animals|SA_DIRTY'], 'Feeding and water are daily jobs.'),
    Q('Why are records kept?', 'To know the feed, health and growth of the animals', ['To fill a book|SA_SICK', 'To show visitors|SA_SICK', 'For no reason|SA_SICK'], 'Records help the farmer see problems and plan.'),
  ], { h: ['Think of the daily routine: feed, water, clean, check.', 'A sick animal is separated.'], s1: 'Recall the routine jobs.' })),
  fam('sm.sa.care', `${SM}SMALL_ANIMALS`, 'word', 2, choose([
    Q('Achieng finds the rabbit water dish empty at noon. What should she do?', 'Fill it with clean water now', ['Wait until evening|SA_WATER', 'Give it dirty water|SA_WATER', 'Leave it, rabbits do not need water|SA_WATER'], 'Water must always be available and clean.'),
    Q('Otieno finds the chicken house wet and smelly. What should he do?', 'Remove the wet bedding and put in dry bedding', ['Leave it wet because it warms the hens at night|SA_DIRTY', 'Pour more water in to wash the smell away|SA_DIRTY', 'Close the door and leave it until next week|SA_DIRTY'], 'A wet house causes disease.'),
    Q('Wanjiru sees a hen that does not eat and stands alone. What should she do?', 'Tell the teacher and separate the hen', ['Leave it with the flock|SA_SICK', 'Give it mouldy food|SA_SICK', 'Ignore it|SA_SICK'], 'A sick animal can pass disease to the others.'),
    Q('What should the animals be fed?', 'Proper feed for their kind, in the right amount', ['Any scraps from the plate, even bad ones|SA_WATER', 'Only grass and leaves for a hen every day|SA_WATER', 'Food left out in the rain for days|SA_DIRTY'], 'Each animal needs the right feed.'),
    Q('Which is a sign of a healthy chicken?', 'Bright eyes, clean feathers and eating well', ['Dull eyes and a drooping head|SA_SICK', 'Staying alone in a corner|SA_SICK', 'Not eating|SA_SICK'], 'A healthy chicken is bright and active.'),
  ], { h: ['Clean water, a clean dry house and telling an adult are the routine.', 'A sick animal is separated.'], s1: 'Think about what the animal needs.' })),
  fam('sm.sa.spot', `${SM}SMALL_ANIMALS`, 'spot', 3, spot([
    S('Baraka explains rabbit care.', ['Rabbits need clean water every day.', '!Rabbits get all the water from their food.', 'Their house is kept dry.'], 'Rabbits need clean water every day.', 'SA_WATER'),
    S('Wanjiru explains the animal house.', ['The house is cleaned often.', '!The droppings are left for weeks.', 'The bedding is kept dry.'], 'The droppings are removed often.', 'SA_DIRTY'),
    S('Kamau explains a sick animal.', ['A sick animal is separated.', '!The teacher is not told.', 'An adult checks the animal.'], 'An adult is told.', 'SA_SICK'),
    S('Mwende explains the daily jobs.', ['Feed in the morning.', 'Check each animal.', '!Water only when the animal is thirsty.'], 'Clean water is given every day.', 'SA_WATER'),
    S('Nekesa explains hygiene.', ['A wet house causes disease.', '!A dirty house keeps animals warm and well.', 'Dry bedding helps.'], 'A clean dry house keeps animals healthy.', 'SA_DIRTY'),
  ], { h: ['Check each step against the daily routine.', 'Clean water, a clean house and an adult for a sick animal.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PRESERVE
  fam('ps.pr.steps', `${PS}PRESERVE`, 'steps', 1, choose([
    Q('When may dried maize be stored?', 'When it is fully dry and hard', ['When it is still damp|PR_WET', 'The moment it is picked|PR_WET', 'After one hour in the sun|PR_WET'], 'Damp food grows mould. Store only dry food.'),
    Q('Where should dry produce be stored?', 'In a clean closed container, off the floor', ['On the floor in an open sack|PR_FLOOR', 'Beside a wet wall|PR_FLOOR', 'In the open compound|PR_FLOOR'], 'A closed container off the floor keeps pests and damp out.'),
    Q('Why does dry food keep longer?', 'Germs and moulds need water to grow', ['The sun makes it harmless for ever|PR_WHY', 'Dry food has no germs at all|PR_WHY', 'Dry food is too hard to rot|PR_WHY'], 'Without water, germs and moulds cannot grow.'),
    Q('What is the first step in drying vegetables?', 'Sort and wash them', ['Spread them in the rain|PR_WET', 'Store them in a bag|PR_WET', 'Cook them for an hour|PR_WET'], 'Sort out bad pieces and wash first.'),
    Q('Where should food be spread to dry?', 'Thin on a clean raised tray in the sun', ['In a heap on the ground|PR_FLOOR', 'Under a dripping roof|PR_FLOOR', 'In a closed bag|PR_FLOOR'], 'A clean raised tray lets air reach all sides.'),
  ], { h: ['Dry first, then store; keep it off the floor.', 'Moulds need water to grow.'], s1: 'Think about water and the floor.' })),
  fam('ps.pr.why', `${PS}PRESERVE`, 'why', 2, choose([
    Q('Achieng stores damp beans in a sack. What may happen?', 'They grow mould and spoil', ['They stay fresh for a year|PR_WET', 'They grow bigger|PR_WET', 'Nothing will change|PR_WET'], 'Damp food grows mould.'),
    Q('Otieno leaves his sack of maize on the wet floor. What may happen?', 'The grain becomes damp and may be eaten by pests', ['The grain stays dry and safe from the pests|PR_FLOOR', 'The grain grows bigger in the damp sack|PR_FLOOR', 'Nothing will happen to it however long it stays|PR_FLOOR'], 'The floor is damp and pests reach the sack.'),
    Q('Wanjiru dries mangoes in the sun and covers them with a net. Why?', 'To keep out dust and flies', ['To make them damp|PR_WET', 'To make them heavier|PR_WET', 'To keep the sun away|PR_WHY'], 'A cover keeps the food clean while it dries.'),
    Q('How can you tell dried food is ready to store?', 'It is crisp or hard and has no moisture', ['It is soft and damp when you press it|PR_WET', 'It smells sour and a little like mould|PR_WET', 'It is sticky and clings to the fingers|PR_WET'], 'Dry food is crisp or hard.'),
    Q('Why must the container be closed?', 'To keep out moisture, dust and pests', ['To make the food hot inside the container|PR_WHY', 'To make the food grow while it is stored|PR_WHY', 'To keep the sun in so the food stays warm|PR_WHY'], 'A closed container protects the food.'),
  ], { h: ['Dry food in a closed container off the floor keeps best.', 'Water spoils stored food.'], s1: 'Think about what spoils stored food.' })),
  fam('ps.pr.spot', `${PS}PRESERVE`, 'spot', 3, spot([
    S('Baraka explains drying.', ['Sort and wash the food.', '!Store it while it is still damp.', 'Spread it thin on a tray.'], 'Food must be fully dry before it is stored.', 'PR_WET'),
    S('Wanjiru explains storing.', ['Use a clean container.', '!Put the sack on the floor.', 'Close the container.'], 'The container is kept off the floor.', 'PR_FLOOR'),
    S('Kamau explains why drying works.', ['Moulds need water.', '!The sun kills them for ever.', 'Dry food keeps longer.'], 'Dry food keeps because germs and moulds need water.', 'PR_WHY'),
    S('Mwende explains the tray.', ['The tray is clean.', 'The tray is raised.', '!The food is piled in a heap.'], 'The food is spread thin so it dries.', 'PR_WET'),
    S('Nekesa explains pests.', ['A closed container keeps pests out.', '!A sack on the wet ground is safe.', 'Dry food is stored in a dry place.'], 'The ground is damp and pests reach the sack.', 'PR_FLOOR'),
  ], { h: ['Check each step: dry, clean, closed and off the floor.', 'Moulds need water.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- COOKING_METHODS
  fam('ck.cm.method', `${CK}COOKING_METHODS`, 'direct', 1, choose([
    Q('Which method cooks food in oil?', 'Frying', ['Boiling|CK_MIX', 'Steaming|CK_MIX', 'Roasting|CK_MIX'], 'Frying cooks in oil. Boiling cooks in water.'),
    Q('Which method cooks food in water?', 'Boiling', ['Frying|CK_MIX', 'Roasting|CK_MIX', 'Baking|CK_MIX'], 'Boiling cooks in water.'),
    Q('In steaming, what cooks the food?', 'The steam above the water', ['The boiling water the food sits in|CK_STEAM', 'The oil in the pan|CK_STEAM', 'The sun|CK_STEAM'], 'Steamed food sits above the water and is cooked by the steam.'),
    Q('Which method is used for githeri?', 'Boiling', ['Roasting|CK_FOOD', 'Deep frying|CK_FOOD', 'Baking|CK_FOOD'], 'Githeri is boiled in water.'),
    Q('Which method is used for mandazi?', 'Deep frying', ['Boiling|CK_FOOD', 'Steaming|CK_FOOD', 'Roasting|CK_FOOD'], 'Mandazi are cooked in deep hot oil.'),
  ], { h: ['Each method uses something: water, steam, oil or dry heat.', 'Githeri is boiled and mandazi are fried.'], s1: 'Match the method to what it uses.' })),
  fam('ck.cm.food', `${CK}COOKING_METHODS`, 'word', 2, choose([
    Q('Achieng roasts maize on a charcoal fire. Which method is it?', 'Roasting', ['Boiling|CK_MIX', 'Frying|CK_MIX', 'Steaming|CK_MIX'], 'Roasting uses dry heat from a fire.'),
    Q('Otieno cooks chapati in a little oil on a pan. Which method is it?', 'Shallow frying', ['Boiling|CK_MIX', 'Steaming|CK_MIX', 'Roasting|CK_MIX'], 'A little oil in a pan is shallow frying.'),
    Q('Wanjiru puts sweet potatoes in a basket over boiling water. Which method is it?', 'Steaming', ['Boiling|CK_STEAM', 'Frying|CK_MIX', 'Roasting|CK_MIX'], 'Food above boiling water is steamed.'),
    Q('Which food is usually boiled?', 'Ugali', ['Mandazi|CK_FOOD', 'Roast maize|CK_FOOD', 'Chapati|CK_FOOD'], 'Ugali is cooked in boiling water.'),
    Q('Which method needs oil?', 'Frying', ['Boiling|CK_MIX', 'Steaming|CK_MIX', 'Boiling eggs|CK_MIX'], 'Frying needs oil.'),
  ], { h: ['Name what the food sits in: water, steam, oil or dry heat.', 'Roasting is dry heat.'], s1: 'Think about what the food cooks in.' })),
  fam('ck.cm.spot', `${CK}COOKING_METHODS`, 'spot', 3, spot([
    S('Baraka explains cooking.', ['Boiling cooks in water.', '!Frying cooks in water.', 'Roasting uses dry heat.'], 'Frying cooks in oil.', 'CK_MIX'),
    S('Wanjiru explains foods.', ['Githeri is boiled.', '!Mandazi are boiled.', 'Maize can be roasted.'], 'Mandazi are fried in oil.', 'CK_FOOD'),
    S('Kamau explains steaming.', ['Steaming uses steam.', '!The food sits in the water.', 'The food sits above the water.'], 'Steamed food sits above the water.', 'CK_STEAM'),
    S('Mwende explains the methods.', ['Boiling uses water.', 'Steaming uses steam.', '!Roasting uses a lot of water.'], 'Roasting uses dry heat.', 'CK_MIX'),
    S('Nekesa explains meals.', ['Ugali is cooked in boiling water.', '!Chapati is boiled.', 'Chapati is fried.'], 'Chapati is fried in a little oil.', 'CK_FOOD'),
  ], { h: ['Check each step against what each method uses.', 'Water, steam, oil, dry heat.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- BODY_CLEANLINESS
  fam('gm.bc.practice', `${GM}BODY_CLEANLINESS`, 'direct', 1, choose([
    Q('How should hands be washed?', 'With soap and water, after the toilet and before eating', ['With water only, quickly|BC_SOAP', 'Only on Sundays|BC_SOAP', 'With a dry cloth|BC_SOAP'], 'Soap lifts the germs off.'),
    Q('How often should teeth be brushed?', 'Twice a day', ['Once a week|BC_TEETH', 'Only when they hurt|BC_TEETH', 'Once a month|BC_TEETH'], 'Brush the teeth twice a day.'),
    Q('Which item should not be shared?', 'A toothbrush', ['A school desk|BC_SHARE', 'A football|BC_SHARE', 'A textbook|BC_SHARE'], 'A toothbrush is personal.'),
    Q('How often should a child bathe with soap?', 'Every day', ['Once a month|BC_SOAP', 'Only when dirty|BC_SOAP', 'Once a week|BC_SOAP'], 'A daily bath keeps the body clean.'),
    Q('What should be done to the nails?', 'Keep them short and clean', ['Let them grow long|BC_SOAP', 'Bite them|BC_SOAP', 'Paint them only|BC_SOAP'], 'Short, clean nails do not hold germs.'),
  ], { h: ['Soap, daily baths, brushing twice a day, short nails.', 'Personal items are not shared.'], s1: 'Recall the grooming habits.' })),
  fam('gm.bc.why', `${GM}BODY_CLEANLINESS`, 'why', 2, choose([
    Q('Why do we wash hands with soap?', 'Soap lifts germs off the skin', ['It makes the hands smell nice only|BC_SOAP', 'It dries the hands|BC_SOAP', 'It is the school rule only|BC_SOAP'], 'Soap removes germs.'),
    Q('Achieng uses her friend\'s toothbrush. What is wrong?', 'Germs pass from one mouth to another', ['Nothing at all, because good friends share things|BC_SHARE', 'The brush is too small for her mouth|BC_SHARE', 'It saves money for the whole family|BC_SHARE'], 'A toothbrush is personal.'),
    Q('Otieno brushes his teeth once a week. What may happen?', 'His teeth may decay and smell', ['His teeth get stronger the less he brushes|BC_TEETH', 'Nothing will happen to it however long it stays|BC_TEETH', 'His teeth become whiter without brushing|BC_TEETH'], 'Brushing twice a day removes food and germs.'),
    Q('Wanjiru bathes daily but wears the same dirty uniform. What is wrong?', 'Dirty clothes still carry germs and smell', ['Nothing is wrong, since the bath is enough|BC_SOAP', 'The uniform is clean because it was washed once|BC_SOAP', 'Clothes never carry germs, only skin does|BC_SOAP'], 'Clean clothes are part of good grooming.'),
    Q('Why do we keep towels and combs personal?', 'To stop germs and lice passing on', ['To keep them new and tidy for longer|BC_SHARE', 'Because they cost a lot of money to buy|BC_SHARE', 'Because it is an old custom in the school|BC_SHARE'], 'Germs and lice spread on shared items.'),
  ], { h: ['Cleanliness stops germs and smell.', 'Personal items are not shared.'], s1: 'Think about germs.' })),
  fam('gm.bc.spot', `${GM}BODY_CLEANLINESS`, 'spot', 3, spot([
    S('Baraka explains washing hands.', ['Hands are washed with soap.', '!Water alone is enough.', 'Hands are washed before eating.'], 'Soap lifts germs that water alone leaves.', 'BC_SOAP'),
    S('Wanjiru explains teeth.', ['Brush the teeth.', '!Brush them once a week.', 'Brush twice a day.'], 'Teeth are brushed twice a day.', 'BC_TEETH'),
    S('Kamau explains sharing.', ['A comb is personal.', '!A towel can be shared by everyone.', 'A toothbrush is personal.'], 'A towel is personal too.', 'BC_SHARE'),
    S('Mwende explains grooming.', ['Bathe every day.', '!Wash the hands only once a week.', 'Wear clean clothes.'], 'Hands are washed often, with soap.', 'BC_SOAP'),
    S('Nekesa explains cleanliness.', ['Keep the nails short.', '!Share a toothbrush with a friend.', 'Wash the hair.'], 'A toothbrush is never shared.', 'BC_SHARE'),
  ], { h: ['Check each step against good grooming habits.', 'Soap, twice a day, not shared.'], s1: 'Find the step that is not true.' })),
];
