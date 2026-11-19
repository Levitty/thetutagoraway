// ============================================================================
// AGRICULTURE AND NUTRITION GRADE 6, THE KNOWLEDGE HALF OF THE PRACTICALS (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): the 6 skills the
// depth pass added (putting up a deterrent, the rabbit hutch, sun-drying, stewing and rubbing-in, removing stains, crochet).
// The app asks which step, order, material or reason; the doing is marked by the teacher with the KICD rubric.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { T } from './agriculture_g6_lib.js';

const M = (...s) => s.map(x => `M_AG6_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('ds', 'CONSER.CONSERVING_WILD_ANIMALS.DETERRENT_SETUP', M('DS_GAPS', 'DS_ONCE', 'DS_LIVE', 'DS_SITE'),
    ['Think about where the animals come in and what they learn over time.', 'Site the deterrent where animals come in, close every gap, check and repair it, and change or move it so animals do not get used to it.'], [
      ['Where is a deterrent put up?', 'Where the animals come in', 'In the middle of the garden|3', 'Next to the house only|3', 'Anywhere, it works the same|1'],
      ['Why must a mesh fence have no gaps at the bottom?', 'Animals push or dig under any gap', 'It does not matter at all|0', 'Gaps let the fence breathe|0', 'Gaps help the hedge grow thick|2'],
      ['Why is a scarecrow moved every few days?', 'So the birds do not get used to it', 'It works for ever in one place|1', 'To keep it in the middle of the farm|3', 'So it can grow into a hedge|2'],
      ['When does a kei apple hedge keep animals out?', 'Once it has grown thick, after a year', 'The same day it is planted|2', 'Only if it has gaps at the bottom|0', 'Only once, then never again|1'],
      ['What is done to a deterrent after it is put up?', 'It is checked and repaired', 'Nothing, it works for ever|1', 'The gaps are made bigger|0', 'It is moved to the middle of the farm|3'],
    ], [
      ['Monkeys come into Kiplagat\'s farm from the forest edge. Where should he hang his noise makers?', 'Along the forest edge', 'In the middle of his maize|3', 'Inside his house|3', 'Anywhere, monkeys hear everywhere|1'],
      ['Porcupines still get under Akinyi\'s mesh fence. What should she check?', 'Gaps at the bottom of the fence', 'Nothing, porcupines cannot dig|0', 'Whether the fence is in the middle|3', 'Whether the hedge was planted today|2'],
      ['Mwangi\'s flashing light kept antelopes away for a month. Now they ignore it. Why?', 'They got used to it; move or change it', 'The light is broken for ever|1', 'Lights never work on animals|1', 'There are gaps in the hedge|0'],
      ['Wanjala plants a sisal hedge today and stops guarding his crop. What will happen?', 'Animals get in before it grows thick', 'The hedge keeps them out today|2', 'The animals get used to the sisal|1', 'The gaps close at once|0'],
      ['A school puts a scarecrow in the middle of its garden, far from where birds land. What is wrong?', 'It is not where the birds come in', 'Nothing, the middle is best|3', 'It needs gaps at the bottom|0', 'It must never be moved|1'],
    ], [
      ['Chebet explains how she fenced her vegetables. ' + STEP, 'She used wire mesh and poles.', 'She dug the poles in firmly.', 'She left a gap along the bottom because it does not matter.', 'Close the bottom; animals push or dig under any gap.', 0],
      ['Otieno explains his scarecrow. ' + STEP, 'He made it from old clothes and sticks.', 'He put it where birds land.', 'He left it in the same place all season because it works for ever.', 'Move or change it so the birds do not get used to it.', 1],
      ['Nyambura explains her live fence. ' + STEP, 'She planted kei apple seedlings close together.', 'She watered them.', 'She removed her old fence the same day, sure the hedge kept goats out.', 'A live fence works only when it has grown thick; protect the crop meanwhile.', 2],
      ['Kamau explains where he put his tins. ' + STEP, 'Baboons come in along the river path.', 'Tins that rattle scare them.', 'So he hung the tins in the middle of the farm.', 'Hang them along the path where the animals come in.', 3],
      ['Rehema explains her checks. ' + STEP, 'She walks round her fence each week.', 'She mends broken wires.', 'Once a fence is up it never needs checking again.', 'Deterrents are checked, repaired and changed when needed.', 1],
    ]),

  ...T('rh', 'FOOD_P.REARING_SMALL_DOMESTIC_A.REARING_HUTCH', M('RH_FLOOR', 'RH_WETGREENS', 'RH_CROWD', 'RH_PARASITE'),
    ['Think about what keeps rabbits dry, fed, safe and healthy.', 'A raised, airy hutch, slightly wilted dry greens and clean water, room for each rabbit, and checking for mites.'], [
      ['Why is a rabbit hutch raised off the ground?', 'To keep it dry and safe from rats', 'It does not need to be raised|0', 'So more rabbits fit inside|2', 'So the greens stay wet|1'],
      ['Which greens should rabbits be fed?', 'Fresh greens, slightly wilted, not wet', 'Greens still wet from the rain|1', 'Leaves that are rotting|1', 'Any wet leaves at all|1'],
      ['Why are many rabbits not kept in one small hutch?', 'Crowded rabbits fight and spread disease', 'Crowding keeps them warm and well|2', 'It saves space and food|2', 'The floor then stays dry|0'],
      ['A rabbit scratches and loses hair. What should be done?', 'Separate it and ask an adult or vet', 'Nothing, rabbits always do that|3', 'Put more rabbits with it|2', 'Give it wet greens|1'],
      ['How often do rabbits need clean water?', 'Always, every day', 'Only when it rains|1', 'Never, greens are enough|1', 'Once a week in a crowded hutch|2'],
    ], [
      ['Peter builds his hutch on the bare ground. Rats get in and the floor stays wet. What should he do?', 'Raise the hutch on legs', 'Keep it on the ground|0', 'Add more rabbits|2', 'Feed wet greens|1'],
      ['After rain, Wairimu feeds her rabbits wet sukuma leaves. What can happen?', 'The rabbits get stomach problems', 'They grow faster on wet leaves|1', 'The hutch floor gets drier|0', 'They stop scratching|3'],
      ['Juma keeps ten rabbits in a hutch made for three. What will happen?', 'They fight and get sick', 'They stay warm and well|2', 'The hutch stays clean|2', 'They need less water|1'],
      ['Nanjala\'s rabbit has bald patches and scratches a lot. What should she do?', 'Separate it and get it treated', 'Ignore it, rabbits do that|3', 'Move it to a crowded hutch|2', 'Put the hutch on the ground|0'],
      ['A school wants healthy rabbits. Which plan is best?', 'A raised hutch with room and water', 'A hutch on the ground to save wood|0', 'All rabbits in one small box|2', 'Wet greens straight after rain|1'],
    ], [
      ['Kioko explains his hutch. ' + STEP, 'He made it airy with wire mesh.', 'He gave it a roof against rain.', 'He set it on the bare ground so it is easy to reach.', 'Raise the hutch to keep it dry and safe from predators.', 0],
      ['Atieno explains feeding. ' + STEP, 'She cuts fresh greens each morning.', 'She gives dry feed too.', 'After rain she feeds the leaves while they are still wet.', 'Wilt greens slightly in the shade; never feed them wet.', 1],
      ['Brian explains space. ' + STEP, 'His rabbits each have room to move.', 'He removes droppings daily.', 'He put all the new rabbits into one small hutch to keep them warm.', 'Crowded rabbits fight and spread disease.', 2],
      ['Mumbi explains health checks. ' + STEP, 'She looks at her rabbits every day.', 'She saw one scratching and losing hair.', 'She left it with the others because rabbits often do that.', 'Check for mites, separate it and ask an adult or vet.', 3],
      ['Omondi explains cleaning. ' + STEP, 'He removes droppings every day.', 'He gives fresh water.', 'He keeps the hutch on the ground so it is easier to sweep.', 'A raised hutch stays dry and safe.', 0],
    ]),

  ...T('dry', 'FOOD_P.PRESERVING_CROP_PRODUCTS.DRYING_STEPS', M('DRY_GROUND', 'DRY_UNEVEN', 'DRY_NIGHT', 'DRY_SOFT'),
    ['Think about dust, damp air and moisture left inside.', 'Cut thin and even, dry on a clean raised rack under a net, take it in at night, and store only when crisp.'], [
      ['Where are slices put to dry in the sun?', 'On a clean raised rack under a net', 'On the bare ground|0', 'On a dusty sack on the floor|0', 'In a closed tin|3'],
      ['Why are mango slices cut evenly?', 'So they all dry at the same time', 'It only looks neater|1', 'So they dry overnight|2', 'So they can be stored soft|3'],
      ['What is done with drying produce at night?', 'Take it in or cover it', 'Leave it out all night|2', 'Spread it on the ground|0', 'Pack it while still soft|3'],
      ['How do you know dried vegetables are ready to store?', 'They are crisp and break easily', 'They have had one day of sun|3', 'They are still soft inside|3', 'They were left out at night|2'],
      ['Why is a net put over drying fruit?', 'To keep flies and dust off', 'To make it dry unevenly|1', 'To keep it out at night|2', 'It is not needed on the ground|0'],
    ], [
      ['Halima spreads her sukuma on a dusty sack on the ground. What is the problem?', 'Dust and dirt get onto it', 'Nothing, it dries faster|0', 'It dries too evenly|1', 'It must be stored soft|3'],
      ['Kibet cuts pumpkin in thick and thin slices. After two days some are still wet. Why?', 'The thick pieces dry more slowly', 'They only look untidy|1', 'He took them in at night|2', 'He used a raised rack|0'],
      ['Wambui leaves her drying tomatoes out overnight. What happens?', 'Damp night air makes them wet again', 'They dry faster at night|2', 'They become crisp|3', 'They get evenly cut|1'],
      ['Ali stores his dried cassava when it is still soft inside. What will happen?', 'It goes mouldy in store', 'It keeps for months|3', 'It dries in the store|3', 'It gets dusty|0'],
      ['Mama Akoth wants her dried kale to keep long. Which plan is best?', 'Dry it until crisp, then seal it', 'Store it after one sunny day|3', 'Dry it on the bare ground|0', 'Leave it out every night|2'],
    ], [
      ['Faith explains how she dried mangoes. ' + STEP, 'She washed and peeled the mangoes.', 'She cut them in thin, even slices.', 'She spread them on the bare ground in the sun.', 'Dry on a clean raised rack covered with a net.', 0],
      ['Musa explains cutting. ' + STEP, 'He chose fresh carrots.', 'He washed them.', 'He cut thick and thin pieces, as size does not matter.', 'Cut evenly so all pieces dry together.', 1],
      ['Lilian explains her evenings. ' + STEP, 'She turns the slices in the day.', 'She keeps the net on.', 'At night she leaves the rack outside to keep drying.', 'Take it in or cover it; night air is damp.', 2],
      ['Daudi explains storing. ' + STEP, 'He dried the vegetables in the sun.', 'He let them cool.', 'He stored them after one day, still soft inside.', 'Store only when crisp and breaking easily.', 3],
      ['Neema explains the net. ' + STEP, 'She put the slices on a raised tray.', 'She covered them with a net.', 'She left them in a heap so they dried faster.', 'Spread them in one even layer so all dry together.', 1],
    ]),

  ...T('cpg6', 'FOOD_P.COOKING_FOOD.COOKING_PRACTICE', M('CP_RUBPALMS', 'CP_OPEN', 'CP_STEWFAST', 'CP_NOSIFT'),
    ['Think about what keeps scones light and a stew tender.', 'Sift the flour, rub in fat lightly with cool fingertips, keep the oven shut, and simmer a stew gently on low heat.'], [
      ['How is fat rubbed into flour for scones?', 'Lightly with cool fingertips', 'With the palms, pressing hard|0', 'With hot hands for a long time|0', 'Without sifting the flour first|3'],
      ['Why is the oven door kept shut while scones bake?', 'Heat escapes and they may sink', 'Opening it helps them cook|1', 'It makes the stew simmer|2', 'It sifts the flour|3'],
      ['How is a stew cooked?', 'On low heat, simmering gently', 'On a high flame to finish fast|2', 'With the lid off on high heat|2', 'Boiled hard until dry|2'],
      ['Why is flour sifted for scones?', 'To remove lumps and add air', 'It is not needed|3', 'To melt the fat|0', 'So the oven can be opened|1'],
      ['What does the flour look like when the fat is rubbed in well?', 'Like fine breadcrumbs', 'Greasy and sticky|0', 'Full of lumps|3', 'Sunk in the middle|1'],
    ], [
      ['Wanjiru rubs the margarine into flour with her palms. It becomes greasy. What should she do?', 'Use cool fingertips lightly', 'Press harder with her palms|0', 'Add unsifted flour|3', 'Open the oven more|1'],
      ['Kevin opens the oven every two minutes to look at his scones. They come out flat. Why?', 'Heat escaped and they sank', 'He did not open it enough|1', 'He simmered them|2', 'He sifted the flour|3'],
      ['Nekesa cooks her beef stew on a very high flame. It is tough and burnt. What should she do?', 'Simmer it on low heat', 'Use an even higher flame|2', 'Leave the lid off on high|2', 'Sift the meat|3'],
      ['Odera pours flour straight from the packet. His scones are heavy and lumpy. What did he skip?', 'Sifting the flour', 'Pressing with his palms|0', 'Opening the oven|1', 'A high flame|2'],
      ['Mama Wanjiku makes a vegetable stew. Which step is right?', 'Cover and simmer it gently', 'Boil fast on high to save time|2', 'Rub the vegetables with her palms|0', 'Open the oven to check it|1'],
    ], [
      ['Achieng explains her scones. ' + STEP, 'She sifted the flour.', 'She cut the fat into small pieces.', 'She rubbed it in with her palms, pressing hard.', 'Rub in lightly with cool fingertips, lifting the flour.', 0],
      ['Barasa explains baking. ' + STEP, 'He shaped the dough.', 'He put it in a hot oven.', 'He opened the door often to help the scones cook.', 'Keep the door shut; heat escapes and they sink.', 1],
      ['Zawadi explains stewing. ' + STEP, 'She fried the onions lightly.', 'She added the meat and a little water.', 'She cooked it on a high flame so it was ready quickly.', 'Simmer a stew gently on low heat.', 2],
      ['Kibet explains mixing. ' + STEP, 'He weighed the flour.', 'He weighed the fat.', 'He skipped sifting because it is not needed.', 'Sift to remove lumps and add air.', 3],
      ['Esther explains a bean stew. ' + STEP, 'She covered the pot.', 'She stirred it now and then.', 'She turned the heat up high to cook it faster.', 'A stew simmers on low heat.', 2],
    ]),

  ...T('ss', 'HYGIEN.LAUNDRY_STAIN_REMOVAL.STAIN_STEPS', M('SS_OUTSIDE', 'SS_SCRAPE', 'SS_IRON', 'SS_SALT'),
    ['Think about how not to spread or set the stain.', 'Treat it fresh, lift off the loose part, work from the outside inwards, use cold salty water for blood, check before ironing.'], [
      ['Which way is a stain rubbed?', 'From the outside edge inwards', 'From the middle outwards|0', 'Round and round in big circles|0', 'With an iron first|2'],
      ['What is done first with wet mud on a shirt?', 'Lift off the loose part', 'Rub it in with water|1', 'Iron it dry|2', 'Soak it in hot water|3'],
      ['Why is a stained cloth not ironed before the stain is gone?', 'Heat sets the stain', 'There is no need to check|2', 'Ironing lifts the stain out|2', 'It spreads it from the middle|0'],
      ['How is a fresh blood stain removed?', 'Soak in cold salty water, then wash', 'Hot water and hard rubbing|3', 'Iron it straight away|2', 'Rub it in from the middle outwards|0'],
      ['When is a stain easiest to remove?', 'While it is fresh', 'After it is ironed|2', 'After it is rubbed in|1', 'After soaking in hot water|3'],
    ], [
      ['Shiru rubs a grass stain from its middle outwards. The stain grows bigger. Why?', 'She spread it outwards', 'She worked from the edge|0', 'She used cold water|3', 'She lifted off the loose part|1'],
      ['Omar rubs wet porridge into his trousers with water. What should he have done first?', 'Scraped off the loose porridge', 'Rubbed harder with water|1', 'Ironed the trousers|2', 'Used hot water|3'],
      ['Mary irons her son\'s shirt without checking the stain. The mark stays for good. Why?', 'The heat set the stain', 'Ironing removes stains|2', 'She worked from the outside|0', 'She scraped it first|1'],
      ['Kioko cut his knee and got blood on his shorts. What should his mother use?', 'Cold salty water', 'Hot water and hard rubbing|3', 'A hot iron|2', 'Rubbing from the middle out|0'],
      ['A school cloth has a fresh grass stain. Which plan is right?', 'Treat it now, from the edge inwards', 'Iron it, then wash|2', 'Rub it in with water|1', 'Rub from the middle outwards|0'],
    ], [
      ['Wangari explains removing a grass stain. ' + STEP, 'She treated it while fresh.', 'She used soap.', 'She rubbed from the middle of the stain outwards.', 'Work from the outside edge towards the middle.', 0],
      ['Kiprono explains removing mud. ' + STEP, 'He waited for the mud to dry a little.', 'He then washed the cloth.', 'Before that he rubbed the wet mud in with water.', 'Scrape or lift off the loose part first.', 1],
      ['Nduta explains finishing. ' + STEP, 'She rinsed the cloth.', 'She dried it.', 'She ironed it before checking the stain was gone.', 'Check first; heat sets a stain.', 2],
      ['Salim explains a blood stain. ' + STEP, 'He treated it while it was fresh.', 'He then washed as usual.', 'First he used hot water and hard rubbing.', 'Soak blood in cold salty water.', 3],
      ['Joy explains the order. ' + STEP, 'She lifted off the loose dirt.', 'She worked from the edge inwards.', 'She ironed the cloth while the stain was still there.', 'Check the stain is gone before ironing.', 2],
    ]),

  ...T('csg6', 'PRODUC.CROCHETING_STITCHES.CROCHET_STEPS', M('CS_TURN', 'CS_COUNT', 'CS_TIGHT', 'CS_CUT'),
    ['Think about the order: slip knot, chain, rows with a turning chain, fasten off.', 'Count the chain, make a turning chain at each row end, keep tension even, and pull the end through the last loop when fastening off.'], [
      ['Why is a turning chain made at the end of a row?', 'To keep the edges straight', 'It is not needed|0', 'To make the stitches tight|2', 'To fasten off the work|3'],
      ['Why is the first chain counted?', 'It sets the width of the article', 'It is not needed|1', 'So the stitches are tighter|2', 'So the end can be cut|3'],
      ['What happens if every stitch is pulled very tight?', 'The hook cannot go in and it curls', 'The work is stronger|2', 'The edges stay straighter|0', 'The width is easier to count|1'],
      ['How is crochet fastened off?', 'Pull the end through the last loop', 'Cut the yarn and leave it loose|3', 'Pull every stitch tight|2', 'Skip the turning chain|0'],
      ['What is made first?', 'A slip knot', 'A turning chain|0', 'The fastening off|3', 'A tight row|2'],
    ], [
      ['Akinyi\'s mat gets narrower at each row. What has she forgotten?', 'The turning chain', 'To pull tighter|2', 'To cut the yarn|3', 'Nothing, mats do that|0'],
      ['Kimani did not count his chain. His table mat is crooked. What should he have done?', 'Counted the chain stitches', 'Pulled each stitch tight|2', 'Cut the end short|3', 'Left out the turning chain|0'],
      ['Moraa pulls every stitch tight. Her hook will not go in and the mat curls. What should she do?', 'Keep the tension even and looser', 'Pull every stitch even tighter|2', 'Stop counting the stitches|1', 'Cut the yarn and leave it|3'],
      ['Ochieng cuts his yarn at the end and leaves it. The mat unravels. What did he miss?', 'Pulling the end through the last loop', 'Pulling every stitch tight|2', 'Counting the chain|1', 'A turning chain|0'],
      ['Rose is making a doily. Which plan is right?', 'Slip knot, count the chain, rows, fasten off', 'Chain without counting, cut and leave|1', 'Tight stitches and no turning chain|2', 'Rows with no turning chain|0'],
    ], [
      ['Wafula explains his crochet. ' + STEP, 'He made a slip knot.', 'He made a chain.', 'At the row ends he skipped the turning chain.', 'Make a turning chain so the edges stay straight.', 0],
      ['Halima explains her start. ' + STEP, 'She held the hook and yarn.', 'She made a slip knot.', 'She made a chain without counting it.', 'Count the chain; it sets the width.', 1],
      ['Peter explains tension. ' + STEP, 'He worked rows of single crochet.', 'He made a turning chain each row.', 'He pulled each stitch as tight as he could.', 'Keep the tension even so the hook goes in.', 2],
      ['Grace explains finishing. ' + STEP, 'She finished the last row.', 'She cut the yarn.', 'She left the cut end without pulling it through.', 'Pull the end through the last loop and weave it in.', 3],
      ['Musa explains his rows. ' + STEP, 'He counted the chain.', 'He kept his tension even.', 'He started each new row without a turning chain.', 'The turning chain lifts the yarn to the next row height.', 0],
    ]),
];
