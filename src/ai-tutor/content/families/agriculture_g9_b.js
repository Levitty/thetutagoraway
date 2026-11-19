// ============================================================================
// AGRICULTURE GRADE 9, HYGIENE AND PRODUCTION (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): the other 10 of the 23 skills (cleaning
// waste disposal facilities, disinfecting clothing and articles, grafting, the homemade sun dryer). The app asks the method,
// the order and the reason; cleaning, grafting and building the dryer are marked by the teacher with the KICD rubric. The
// grafting knife and chemical disinfectants are an adult's. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until an Agriculture teacher signs them off.
// ============================================================================
import { T } from './agriculture_g9_lib.js';

const M = (...s) => s.map(x => `M_AG9_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('wf', 'HYGIEN.CLEANING_WASTE_DISPOSAL_.WASTE_FACILITY_WHY', M('WF_DRAIN', 'WF_LID', 'WF_DISEASE', 'WF_SINK'),
    ['Ask what breeds in each dirty facility and what it spreads.', 'Dirty bins, sinks and drains breed flies, mosquitoes, rats and germs that spread cholera, typhoid and malaria; drains block and flood, bins need lids, and fat blocks sinks.'], [
      ['Why must open drains be kept clear?', 'Blocked water breeds mosquitoes', 'Rain cleans them|0', 'They only smell|2', 'Fat keeps them flowing|3'],
      ['Why does a waste bin need a lid?', 'To keep out flies and rats', 'It does not need one|1', 'Rain cleans it|0', 'It only smells|2'],
      ['Which disease can spread from dirty bins and drains?', 'Cholera', 'None, they only smell|2', 'None, rain cleans them|0', 'None if it has no lid|1'],
      ['Why is cooking fat not poured down the sink?', 'It blocks the pipe', 'It washes away|3', 'It cleans the pipe|3', 'Rain clears it|0'],
      ['Which disease do mosquitoes from blocked drains spread?', 'Malaria', 'None, drains self-clean|0', 'Only bad smells|2', 'None if the bin is open|1'],
    ], [
      ['The drain outside Mama Wanjiru\'s house is blocked and holds green water. She says the rain will clean it. What is the risk?', 'Mosquitoes breed there', 'None, rain cleans it|0', 'Only a smell|2', 'The bin lid falls|1'],
      ['Kevin\'s family bin has no lid. Flies swarm over it. Why does it need one?', 'To keep flies and rats out', 'It does not|1', 'Rain will wash it|0', 'Flies cause only smells|2'],
      ['After a cholera case in an estate, the health officer checks the bins and drains. Why?', 'They spread cholera germs', 'They only smell|2', 'Rain cleans them|0', 'Lids are not needed|1'],
      ['Achieng pours used frying oil down the kitchen sink every day. The sink now drains slowly. Why?', 'The fat blocked the pipe', 'Oil washes away|3', 'Rain will clear it|0', 'It only smells|2'],
      ['A school wants to cut malaria cases. Which job helps most?', 'Clearing blocked drains', 'Leaving drains for rain|0', 'Removing bin lids|1', 'Pouring fat in sinks|3'],
    ], [
      ['Kibet explains open drains. ' + STEP, 'Drains carry dirty water away.', 'Rubbish can block them.', 'Rain will always clean a blocked drain.', 'Blocked drains hold water that breeds mosquitoes and floods.', 0],
      ['Halima explains bins. ' + STEP, 'Bins hold kitchen waste.', 'Waste attracts flies and rats.', 'So a bin is fine without a lid.', 'A lid keeps out flies, rats and rain and keeps smells in.', 1],
      ['Ochieng explains disease. ' + STEP, 'Flies land on rubbish.', 'Then they land on food.', 'Dirty bins cause only bad smells, not disease.', 'They spread diseases such as cholera and typhoid.', 2],
      ['Esther explains the sink. ' + STEP, 'She scrapes plates before washing.', 'She washes with soap.', 'She pours the leftover fat down the sink.', 'Fat blocks the pipe; put it in the bin.', 3],
      ['Moses explains typhoid. ' + STEP, 'Typhoid germs live in dirty water and waste.', 'Flies carry germs to food.', 'So clean bins and drains make no difference.', 'Clean bins and drains cut the spread of disease.', 2],
    ]),

  ...T('wc', 'HYGIEN.CLEANING_WASTE_DISPOSAL_.WASTE_FACILITY_CLEAN', M('WC_HANDS', 'WC_WET', 'WC_SILT', 'WC_STRAINER'),
    ['Protect yourself, clean, dry, and take the dirt right away.', 'Wear gloves and an apron, scrub and sun-dry the bin with the lid open, empty the sink strainer, move drain silt well away, and wash your hands after.'], [
      ['What should you wear to clean a waste bin?', 'Gloves and an apron', 'Nothing special|0', 'Bare hands are fine|0', 'Your best clothes|0'],
      ['How is a bin dried after scrubbing?', 'In the sun, lid open', 'Closed while still wet|1', 'In a dark corner, closed|1', 'It need not be dried|1'],
      ['Where is silt from a drain put?', 'Away from the drain, in a safe place', 'On the edge of the drain|2', 'Back in the drain|2', 'On the path beside it|2'],
      ['What is done with a blocked sink strainer?', 'Empty it into the bin and scrub', 'Rinse it only|3', 'Leave it, it clears itself|3', 'Pour fat through it|3'],
      ['What is the last step after cleaning waste facilities?', 'Wash your hands', 'Close the wet bin|1', 'Pile silt by the drain|2', 'Skip the strainer|3'],
    ], [
      ['Kioko empties and scrubs the bin with bare hands and goes straight to eat. What should he do?', 'Wear gloves and wash his hands', 'Nothing, the bin is clean now|0', 'Close the bin wet|1', 'Pile the dirt beside it|2'],
      ['Wairimu scrubs the bin and closes the lid while it is still wet. It smells the next day. What is better?', 'Dry it in the sun, lid open', 'Close it wet again|1', 'Clean it with bare hands|0', 'Leave the strainer full|3'],
      ['Juma shovels drain silt onto the drain\'s edge. After rain the drain is blocked again. Why?', 'Rain washed it back in', 'Silt cannot move|2', 'He wore gloves|0', 'He dried the bin|1'],
      ['Mueni rinses the sink but never empties the strainer. The sink smells. What should she do?', 'Empty the strainer and scrub', 'Rinse it only, as she does|3', 'Pour hot fat in|3', 'Close the bin wet|1'],
      ['A school cleaning day includes bins, sinks and drains. Which plan is right?', 'Gloves, scrub, dry, clear silt', 'Bare hands and wet bins|0', 'Silt on the drain edge|2', 'Rinse sinks only|3'],
    ], [
      ['Brian explains cleaning a bin. ' + STEP, 'He emptied it into the pit.', 'He scrubbed it with soap and water.', 'He did it with bare hands and did not wash after.', 'Wear gloves and an apron and wash hands after.', 0],
      ['Grace explains drying. ' + STEP, 'She scrubbed the bin.', 'She rinsed it.', 'She closed the lid while it was still wet.', 'Dry it in the sun with the lid open.', 1],
      ['Kiprop explains the drain. ' + STEP, 'He removed the rubbish from the drain.', 'He dug out the silt.', 'He left the silt on the edge of the drain.', 'Take silt away from the drain to a safe place.', 2],
      ['Nanjala explains the sink. ' + STEP, 'She scraped food into the bin.', 'She washed the dishes.', 'She only rinses the strainer, never empties it.', 'Empty the strainer into the bin and scrub the sink.', 3],
      ['Daniel explains the order. ' + STEP, 'He put on gloves.', 'He cleaned the bin and the sink.', 'He put the wet bin back with the lid shut.', 'Sun-dry the bin with the lid open first.', 1],
    ]),

  ...T('dm', 'HYGIEN.DISINFECTING_CLOTHING_AN.DISINFECT_METHODS', M('DM_CLEAN', 'DM_BOILALL', 'DM_SUN', 'DM_IRON'),
    ['Germs cannot be seen; choose the method that suits the fabric.', 'Clothing is disinfected by sunlight, salt solution, boiling (white cotton only), diluted disinfectant or ironing; a clean-looking article may still carry germs.'], [
      ['Is an article that looks clean always free of germs?', 'No, germs cannot be seen', 'Yes, it looks clean|0', 'Yes, if it was ironed cold|3', 'Yes, if dried in shade|2'],
      ['Which articles can be boiled to disinfect them?', 'White cotton towels', 'Every article|1', 'Wool sweaters|1', 'Coloured nylon|1'],
      ['How does sunlight help disinfect clothes?', 'Its rays help kill germs', 'It only dries them|2', 'It only fades them|2', 'It removes creases|3'],
      ['How does ironing help disinfect clothes?', 'The heat kills germs and lice eggs', 'It only removes creases|3', 'It only dries them|2', 'It makes them look clean|0'],
      ['Which is a method of disinfecting clothing?', 'Soaking in salt solution', 'Folding it neatly|0', 'Boiling a nylon shirt|1', 'Drying in a dark room|2'],
    ], [
      ['Mama Akoth says her baby\'s towel looks clean, so it needs no disinfecting after a stomach bug. What is true?', 'It may still carry germs', 'Clean-looking is germ-free|0', 'Boil the nylon too|1', 'Sun only dries it|2'],
      ['Wekesa wants to boil his wool school sweater to disinfect it. What is better?', 'Sun or ironing for wool', 'Boil it like everything|1', 'Nothing, it looks clean|0', 'Ironing only removes creases|3'],
      ['Nyokabi dries her washed bedding in the shade because she thinks the sun only dries. What does the sun also do?', 'Helps kill germs', 'Only dries|2', 'Only fades colour|2', 'Removes lice eggs only by ironing|3'],
      ['After a lice outbreak at school, the matron irons the cotton uniforms. Why?', 'Heat kills lice eggs and germs', 'Only to remove creases|3', 'Only to dry them|2', 'They look clean already|0'],
      ['Handkerchiefs used during a cold need disinfecting. They are white cotton. Which method suits them?', 'Boiling', 'Folding them|0', 'Drying in shade|2', 'A cool iron only for creases|3'],
    ], [
      ['Shiru explains disinfecting. ' + STEP, 'Germs cannot be seen.', 'Some clothes carry germs after illness.', 'If a shirt looks clean, it is free of germs.', 'A clean-looking article may still need disinfecting.', 0],
      ['Kamau explains boiling. ' + STEP, 'Boiling kills germs.', 'White cotton can be boiled.', 'So every article can be boiled.', 'Boil white cotton only; use sun or ironing for others.', 1],
      ['Lilian explains sunlight. ' + STEP, 'She hangs clothes in the sun.', 'They dry quickly.', 'The sun only dries; it does not disinfect.', 'The sun\'s rays help kill germs.', 2],
      ['Ouma explains ironing. ' + STEP, 'He irons his cotton shirts.', 'They look neat.', 'Ironing is only for removing creases.', 'The heat also kills germs and lice eggs.', 3],
      ['Zainabu explains choosing a method. ' + STEP, 'Her towels are white cotton.', 'Her jumper is wool.', 'She boils both to be safe.', 'Boil the cotton; use sun or ironing for the wool.', 1],
    ]),

  ...T('dp', 'HYGIEN.DISINFECTING_CLOTHING_AN.DISINFECT_PRACTICE', M('DP_DIRTY', 'DP_STRONG', 'DP_SHORT', 'DP_SHADE'),
    ['Clean first, the right strength, long enough, then full sun.', 'Wash the article clean first, boil white cottons 10 to 15 minutes, use chemical disinfectant only diluted by an adult and rinse it out, and dry in full sun.'], [
      ['What is done before an article is disinfected?', 'Wash it clean first', 'Nothing, disinfect it as it is|0', 'Soak it in neat disinfectant|1', 'Dry it in shade|3'],
      ['How is a chemical disinfectant used?', 'Diluted by an adult, then rinsed out', 'Undiluted, as strong as possible|1', 'On dirty clothes as they are|0', 'For one minute only|2'],
      ['How long are handkerchiefs boiled?', 'About 10 to 15 minutes', 'A minute|2', 'Ten seconds|2', 'Until they look clean|0'],
      ['Where are disinfected articles dried?', 'In full sun where air moves', 'In a damp shaded corner|3', 'Folded while wet|3', 'In a closed cupboard|3'],
      ['What is done with an article after disinfectant?', 'Rinse it out well', 'Leave the neat liquid in|1', 'Store it damp|3', 'Boil it one minute|2'],
    ], [
      ['Imani pours disinfectant on a muddy towel without washing it. What is the problem?', 'Dirt stops the disinfectant working', 'Nothing, it is quicker|0', 'It needed neat disinfectant|1', 'It needed shade|3'],
      ['Odera uses neat disinfectant to make it stronger. His hands burn. What is right?', 'An adult dilutes it as the label says', 'Use it neat, as strong as possible|1', 'Use it on dirty clothes|0', 'Boil for a minute|2'],
      ['Joyce boils the cotton napkins for one minute after a stomach bug. What should she do?', 'Boil about 10 to 15 minutes', 'One minute is enough|2', 'Use neat disinfectant|1', 'Skip washing first|0'],
      ['Kiptoo dries the disinfected bedding in a damp shady corner. It smells musty. What is better?', 'Full sun where air moves', 'A darker corner|3', 'Fold it wet|3', 'Boil it one minute|2'],
      ['A family disinfects bedding after chickenpox. Which plan is right?', 'Wash, disinfect right, dry in sun', 'Neat disinfectant on dirty bedding|1', 'One-minute boil, dry in shade|2', 'Skip washing, fold it|0'],
    ], [
      ['Achieng explains disinfecting a towel. ' + STEP, 'She chose a method for cotton.', 'She planned to dry it in the sun.', 'She disinfected it before washing off the dirt.', 'Wash it clean first, then disinfect.', 0],
      ['Barasa explains chemical disinfectant. ' + STEP, 'An adult reads the label.', 'It is used on washed clothes.', 'It is best undiluted, as strong as possible.', 'It is diluted as the label says, then rinsed out.', 1],
      ['Neema explains boiling. ' + STEP, 'She washed the handkerchiefs.', 'She put them in boiling water.', 'She took them out after one minute.', 'Boil them about 10 to 15 minutes.', 2],
      ['Kimani explains drying. ' + STEP, 'He disinfected the sheets.', 'He rinsed them.', 'He dried them in a damp shaded corner.', 'Dry them in full sun where air moves.', 3],
      ['Salma explains storing. ' + STEP, 'She dried the clothes in full sun.', 'She ironed them.', 'She left the disinfectant in to keep them germ-free.', 'Rinse chemical disinfectant out before drying.', 1],
    ]),

  ...T('gm', 'PRODUC.GRAFTING_IN_PLANTS.GRAFT_MEANING', M('GM_SWAP', 'GM_ANY', 'GM_SEED', 'GM_UNION'),
    ['Name the two parts: the rooted plant below and the shoot from the good plant on top.', 'Grafting joins a scion (shoot or bud from a good plant) to a rootstock (a strong rooted plant) of the same or a close kind; the union is where they grow together.'], [
      ['In grafting, what is the rootstock?', 'The rooted plant below', 'The shoot on top|0', 'The grafting tape|3', 'A seed of the good tree|2'],
      ['What is the scion?', 'A shoot from a good plant', 'The rooted plant below|0', 'The tape round the join|3', 'A seedling of any plant|1'],
      ['Can a mango scion be grafted onto a bean plant?', 'No, they must be related', 'Yes, any plants join|1', 'Yes, if taped well|3', 'Yes, if grown from seed|2'],
      ['What is the union?', 'Where scion and rootstock grow together', 'The grafting tape|3', 'The scion alone|0', 'The seed of the tree|2'],
      ['Why graft instead of planting a seed of a good mango?', 'It fruits sooner, true to type', 'There is no difference|2', 'Any two plants join|1', 'The tape makes it fruit|3'],
    ], [
      ['Njoroge cuts a shoot from his best avocado tree to join to a young seedling. What is the shoot called?', 'The scion', 'The rootstock|0', 'The union|3', 'A seedling|2'],
      ['Akinyi wants to graft an orange scion onto a maize plant. What will happen?', 'It fails; they are not related', 'It grows well like any graft|1', 'It works if taped|3', 'It gives seedless maize|2'],
      ['Wafula plants seeds from his sweetest mango tree. The fruit is different and takes years. What would give the same fruit sooner?', 'Grafting a scion of that tree', 'Planting more of its seeds|2', 'Any plant as rootstock|1', 'More tape|3'],
      ['After grafting, Chebet points at the tape and calls it the union. What is the union?', 'Where the parts grow together', 'The grafting tape itself|3', 'The rooted plant|0', 'The scion|0'],
      ['A farmer has a hardy lemon seedling and a sweet orange tree. Which is the rootstock?', 'The hardy lemon seedling', 'The sweet orange shoot|0', 'The tape|3', 'Any bean plant|1'],
    ], [
      ['Mwangi explains grafting. ' + STEP, 'Grafting joins two plants.', 'The scion comes from a good plant.', 'The rootstock is the shoot on top.', 'The rootstock is the strong rooted plant below.', 0],
      ['Lucy explains which plants. ' + STEP, 'Mango is often grafted.', 'Avocado and citrus are too.', 'Any two plants can be grafted together.', 'They must be the same or a closely related kind.', 1],
      ['Kiprono explains why graft. ' + STEP, 'He has a mango tree with sweet fruit.', 'He wants more trees like it.', 'Its seeds give the same fruit, just as fast.', 'A graft gives the parent\'s fruit exactly and fruits sooner.', 2],
      ['Faith explains the union. ' + STEP, 'She joined a scion to a rootstock.', 'She wrapped the join.', 'The union is the grafting tape.', 'The union is where scion and rootstock grow together.', 3],
      ['Omar explains the parts. ' + STEP, 'The scion gives the good fruit.', 'The rootstock gives roots.', 'He calls the rooted seedling the scion.', 'The rooted seedling is the rootstock.', 0],
    ]),

  ...T('gs', 'PRODUC.GRAFTING_IN_PLANTS.GRAFT_STEPS', M('GS_CAMBIUM', 'GS_BLUNT', 'GS_LOOSE', 'GS_DRY'),
    ['Think about the living green layer, clean cuts, a firm wrap and keeping the scion fresh.', 'An adult makes clean matching cuts with a sharp clean knife, the green cambium layers are fitted together, the graft is wrapped firmly with tape, and the scion is kept fresh.'], [
      ['Which layers must touch in a graft?', 'The green cambium layers', 'Any part of the cuts|0', 'Only the bark|0', 'Only the tape|2'],
      ['Why is a sharp, clean knife used?', 'Clean cuts heal and join', 'Any knife works|1', 'Blunt knives join better|1', 'So the tape can be loose|2'],
      ['How is a graft wrapped?', 'Firmly with grafting tape', 'Loosely|2', 'Not at all|2', 'With a dirty cloth|1'],
      ['What happens if a cut scion is left in the sun?', 'It dies and the graft fails', 'Nothing|3', 'It joins faster|3', 'It needs no tape|2'],
      ['Who makes the grafting cuts at school?', 'An adult, or with an adult beside', 'Any learner alone|1', 'Nobody, cuts are not needed|0', 'Whoever has a blunt knife|1'],
    ], [
      ['Kendi fits her scion onto the rootstock without matching the green layer under the bark. The graft fails. Why?', 'The cambium layers did not meet', 'Any part of the cut joins well|0', 'She wrapped it firmly|2', 'Her knife was clean|1'],
      ['Ali\'s teacher grafts with an old rusty knife. The cut is ragged and the graft rots. What should be used?', 'A sharp, clean knife', 'Any knife works|1', 'A looser wrap|2', 'A scion dried in the sun|3'],
      ['Mary wraps her graft loosely. A week later the scion has dried and come apart. What is right?', 'Wrap it firmly with tape', 'Wrap it even looser|2', 'Use a blunt knife|1', 'Leave the scion in the sun|3'],
      ['Peter cuts his scion in the morning and leaves it on a hot stone until afternoon. What will happen?', 'It dies and the graft fails', 'It joins better when warm|3', 'It needs no wrap|2', 'Any knife works now|1'],
      ['A class grafts mango seedlings with the teacher. Which steps are right?', 'Clean cuts, cambium, firm wrap', 'Ragged cuts, loose wrap|1', 'Any part touching, no tape|0', 'Scion left in the sun|3'],
    ], [
      ['Hassan explains his graft. ' + STEP, 'He chose a healthy rootstock.', 'The teacher made matching cuts.', 'He fitted any part of the cuts together.', 'Fit the green cambium layers together.', 0],
      ['Wanjiku explains the knife. ' + STEP, 'Cuts must be smooth.', 'They must be clean.', 'So any knife will do, blunt or dirty.', 'A sharp, clean knife makes cuts that heal and join.', 1],
      ['Odhiambo explains wrapping. ' + STEP, 'He matched the cambium layers.', 'He held them together.', 'He wrapped them loosely with tape.', 'Wrap firmly so the cuts stay together and dry.', 2],
      ['Rehema explains the scion. ' + STEP, 'She cut a scion from a good mother tree.', 'She would graft it later.', 'She left it lying in the sun meanwhile.', 'Keep the scion fresh and shaded; in the sun it dies.', 3],
      ['Kiptoo explains labelling. ' + STEP, 'He wrapped the graft firmly.', 'He covered the scion top.', 'He matched only the bark, not the green layer.', 'The green cambium layers must touch.', 0],
    ]),

  ...T('gc', 'PRODUC.GRAFTING_IN_PLANTS.GRAFT_CARE', M('GC_SUCKERS', 'GC_TAPE', 'GC_SUN', 'GC_KNOCK'),
    ['Think about what steals the scion\'s food, what protects the union, and when the tape comes off.', 'Water the grafted plant in light shade, remove rootstock shoots below the union, protect it from knocks, and remove the tape once healed, about 6 to 8 weeks.'], [
      ['What is done with shoots growing below the union?', 'Remove them', 'Leave them to grow|0', 'Graft them too|0', 'Wrap them in tape|1'],
      ['When is the grafting tape removed?', 'After about 6 to 8 weeks', 'Never|1', 'The next day|1', 'When the plant is in full sun|2'],
      ['Where is a newly grafted seedling kept?', 'In light shade, watered', 'In full sun, unwatered|2', 'Where goats pass|3', 'With all suckers left on|0'],
      ['Why is the union protected from knocks?', 'It can break before it heals', 'It is strong at once|3', 'The tape protects it for ever|1', 'Suckers protect it|0'],
      ['How do you know the graft has worked?', 'The scion sprouts new leaves', 'The rootstock shoots grow tall|0', 'The tape stays on for ever|1', 'It dries in full sun|2'],
    ], [
      ['Wambui sees shoots growing from the rootstock below the union and leaves them. The scion stops growing. Why?', 'The shoots take the food', 'Shoots help the scion|0', 'The tape came off|1', 'It is in shade|2'],
      ['Two years after grafting, Kibet\'s tape is still on and the stem is choked. When should it have come off?', 'After about 6 to 8 weeks', 'Never|1', 'The first day|1', 'After full sun|2'],
      ['Moraa puts her new grafts in full sun and forgets to water them. They wilt. What is better?', 'Light shade and regular water', 'More sun|2', 'Leave the suckers|0', 'Let goats pass by|3'],
      ['Goats brush past Otieno\'s grafted seedlings. Some unions snap. What should he do?', 'Fence and protect them', 'Nothing, unions are strong|3', 'Leave the tape on for ever|1', 'Put them in full sun|2'],
      ['A school has 20 grafted orange seedlings. Which care plan is right?', 'Shade, water, remove suckers, fence', 'Full sun, no water|2', 'Leave suckers, tape for ever|0', 'Let animals pass|3'],
    ], [
      ['Nekesa explains caring for her graft. ' + STEP, 'She waters it regularly.', 'She keeps it in light shade.', 'She leaves the shoots growing from the rootstock.', 'Remove shoots below the union so the scion gets the food.', 0],
      ['Simon explains the tape. ' + STEP, 'The tape holds the join while it heals.', 'The union heals in a few weeks.', 'So the tape is never removed.', 'Remove it after the union heals, about 6 to 8 weeks.', 1],
      ['Wairimu explains placement. ' + STEP, 'Her graft is new.', 'It needs care.', 'She put it in full sun and did not water it.', 'Keep it in light shade and water it regularly.', 2],
      ['Daudi explains protection. ' + STEP, 'He watched for the scion to sprout.', 'He removed rootstock shoots.', 'He let children brush past it, since unions are strong.', 'A knock can break the union before it heals.', 3],
      ['Zawadi explains success. ' + STEP, 'The scion sprouted leaves.', 'The union healed.', 'She left the rootstock suckers to make the plant bushy.', 'Remove rootstock shoots below the union.', 0],
    ]),

  ...T('gp', 'PRODUC.GRAFTING_IN_PLANTS.GRAFT_PURPOSES', M('GP_REPAIR', 'GP_OLD', 'GP_LOOKS', 'GP_IMPROVE'),
    ['Match the purpose to the problem: repair, beauty, better fruit or new life for an old tree.', 'Grafting repairs damaged trunks (bridge grafting), adds beauty (several colours on one plant), improves fruit (good scion on a hardy rootstock) and rejuvenates old trees (topworking).'], [
      ['A tree trunk is damaged by a mower. What can grafting do?', 'Bridge graft to repair it', 'Nothing, cut it down|0', 'Make it a seed tree|1', 'Only make it pretty|2'],
      ['An old mango gives poor fruit. Which grafting purpose fits?', 'Rejuvenation by topworking', 'Cut it down for a seed|1', 'Nothing can be done|0', 'Only beauty|2'],
      ['Can grafting be used for beauty?', 'Yes, several colours on one rose', 'No, only for fruit|2', 'Only to repair trees|0', 'Only on old trees|1'],
      ['In an improved graft, which part gives the good fruit?', 'The scion', 'The rootstock|3', 'The tape|3', 'The old stump alone|1'],
      ['Why is a hardy rootstock chosen?', 'For strength and disease resistance', 'It gives the good fruit|3', 'It is only for beauty|2', 'Only to repair a trunk|0'],
    ], [
      ['A hare has stripped the bark round Mama Njeri\'s young avocado. She wants to cut it down. What could she do?', 'Bridge graft over the damage', 'Cut it down|0', 'Plant a seed instead|1', 'Graft only for colour|2'],
      ['Mzee Kamau\'s 30-year-old mango gives few, poor fruit. His son says plant a seed. What is a faster way?', 'Topwork a good variety on it', 'Plant a seed|1', 'Cut it down for firewood|0', 'Let the rootstock decide|3'],
      ['A hotel wants one bougainvillea with three flower colours. Is grafting useful here?', 'Yes, for beauty', 'No, only for fruit|2', 'Only to repair it|0', 'Only for old plants|1'],
      ['Faith grafts a sweet orange scion onto a hardy lemon rootstock. Which fruit will she get?', 'Sweet oranges', 'Lemons from the rootstock|3', 'A mix chosen by the tape|3', 'Whatever a seed gives|1'],
      ['A county gives farmers grafted mango seedlings on hardy rootstocks. Which purpose is this?', 'Improvement', 'Only repair|0', 'Only beauty|2', 'Replacing with seedlings|1'],
    ], [
      ['Musa explains repairing trees. ' + STEP, 'His tree trunk was damaged.', 'The tree was otherwise healthy.', 'A damaged trunk means the tree must be cut down.', 'A bridge graft over the damage can repair it.', 0],
      ['Kendi explains old trees. ' + STEP, 'Her orange tree is old.', 'It gives poor fruit.', 'The only way is to cut it down and plant a seed.', 'Topwork it: cut back and graft a good variety on the stump.', 1],
      ['Baraka explains beauty. ' + STEP, 'Grafting improves fruit.', 'It repairs damaged trees.', 'It is never used for beauty.', 'It can give several flower colours on one plant.', 2],
      ['Mercy explains improvement. ' + STEP, 'The rootstock is hardy.', 'The scion comes from a tree with good fruit.', 'The rootstock decides what fruit grows.', 'The scion gives the fruit; the rootstock gives strength.', 3],
      ['Juma appraises a graft. ' + STEP, 'His avocado was grafted for improvement.', 'It fruited in three years.', 'The good fruit came from the rootstock.', 'The good fruit comes from the scion.', 3],
    ]),

  ...T('sd', 'PRODUC.HOMEMADE_SUN_DRYER.SUN_DRYER_DESIGN', M('SD_BLACK', 'SD_HOLES', 'SD_COVER', 'SD_WHY'),
    ['Think about trapping heat and letting moist air out.', 'A sun dryer has a clear cover to let sunlight in, a black inside to absorb heat, air inlets low and outlets high, and mesh trays; it dries faster and cleaner than a mat.'], [
      ['Why is the inside of a sun dryer painted black?', 'Black absorbs more heat', 'It makes no difference|0', 'White is warmer|0', 'To block the sun|2'],
      ['Why does a sun dryer have air holes?', 'Moist air leaves, dry air enters', 'It should be sealed|1', 'To let rain in|1', 'They are not needed|3'],
      ['What cover is used on a sun dryer?', 'Clear polythene or glass', 'A dark sheet that blocks the sun|2', 'A sealed metal lid|1', 'No cover at all|3'],
      ['Why use a sun dryer instead of a mat?', 'It dries faster and cleaner', 'There is no difference|3', 'It keeps food wet|1', 'It needs no sun|2'],
      ['Where are the air outlets placed?', 'High up', 'Nowhere; seal it|1', 'Under a dark cover|2', 'It makes no difference|0'],
    ], [
      ['Atieno paints her dryer white inside to keep it clean. It dries slowly. What should she use?', 'Black paint inside', 'More white paint|0', 'A dark cover|2', 'No air holes|1'],
      ['Wekesa seals his dryer with no holes to keep heat in. The vegetables sweat and stay damp. Why?', 'Moist air cannot escape', 'Sealed is best|1', 'It needs a dark cover|2', 'A mat would be the same|3'],
      ['Mumbi covers her dryer with a black bin bag. The inside stays cool. What is wrong?', 'The cover must be clear', 'Black is best on top|2', 'It needs to be sealed|1', 'No dryer is better|3'],
      ['Ochieng says drying kale on a mat is as good as a dryer. What does the dryer add?', 'Speed, and no dust or flies', 'Nothing|3', 'Wetter kale|1', 'Shade from the sun|2'],
      ['A youth group designs a dryer for sukuma. Which design is right?', 'Clear cover, black inside, vents', 'Dark cover, no vents|2', 'White inside, sealed|0', 'An open mat on soil|3'],
    ], [
      ['Kibet explains his sun dryer. ' + STEP, 'He used a box with mesh trays.', 'He fitted a clear cover.', 'He painted the inside white to keep it clean.', 'Paint it black; black absorbs more heat.', 0],
      ['Wanjiru explains the air holes. ' + STEP, 'Warm air rises.', 'It carries moisture.', 'So the dryer should be sealed with no holes.', 'Inlets low and outlets high let moist air out.', 1],
      ['Omar explains the cover. ' + STEP, 'The cover keeps out dust.', 'It keeps out rain.', 'A dark sheet that blocks the sun is best.', 'A clear cover lets sunlight in to trap heat.', 2],
      ['Grace explains why use a dryer. ' + STEP, 'Mats are cheap.', 'Dryers take time to build.', 'A dryer is no better than a mat.', 'It dries faster and keeps out dust, flies, rain and animals.', 3],
      ['Peter explains the base. ' + STEP, 'He raised the dryer off the ground.', 'He used local materials.', 'He left out the air inlets to keep heat in.', 'Air must enter low and leave high to carry moisture away.', 1],
    ]),

  ...T('su', 'PRODUC.HOMEMADE_SUN_DRYER.SUN_DRYER_USE', M('SU_PILE', 'SU_SHADE', 'SU_CLEAN', 'SU_STORE'),
    ['One thin layer, full sun, clean trays, and store when crisp.', 'Face the dryer to the sun, raised and tilted, load thin slices in one layer, take them out when crisp, store them sealed, and clean the trays between batches.'], [
      ['How are vegetables loaded on the dryer trays?', 'In one thin layer', 'In a thick pile|0', 'In heaps on one side|0', 'Without slicing|0'],
      ['Where is a sun dryer placed?', 'In full sun, raised and tilted', 'In the shade|1', 'Under a tree|1', 'Indoors|1'],
      ['Why are trays cleaned between batches?', 'Old bits grow mould and pests', 'There is no need|2', 'To keep them shaded|1', 'To pile food thicker|0'],
      ['What is done once the vegetables are crisp?', 'Cool and store them sealed', 'Leave them in the dryer for days|3', 'Pile them thicker|0', 'Move the dryer to shade|1'],
      ['Which comes first when using a dryer?', 'Wash and thinly slice', 'Pile them whole|0', 'Place it in shade|1', 'Leave the old bits in|2'],
    ], [
      ['Faith piles her sliced carrots thickly on one tray. After two days the middle is wet. What should she do?', 'Spread them in one thin layer', 'Pile them thicker|0', 'Put the dryer in shade|1', 'Leave them longer, a week|3'],
      ['Kioko puts his dryer under a tree so the vegetables will not burn. They hardly dry. What is better?', 'Full sun, facing the sun', 'Deeper shade|1', 'A thicker pile|0', 'Dirty trays|2'],
      ['Halima never cleans her dryer trays. The next batch of kale goes mouldy. Why?', 'Old bits grew mould', 'Trays need no cleaning|2', 'The dryer was in sun|1', 'The slices were thin|0'],
      ['Moses leaves his crisp dried mangoes in the dryer for a week. They turn soft and dusty. What should he have done?', 'Cooled and sealed them', 'Left them longer|3', 'Piled them up|0', 'Moved the dryer to shade|1'],
      ['A school dries cowpea leaves in its dryer. Which plan is right?', 'Thin layer, full sun, store sealed', 'Thick pile, shade|0', 'Never clean trays|2', 'Leave them in for days|3'],
    ], [
      ['Achieng explains loading the dryer. ' + STEP, 'She washed the vegetables.', 'She sliced them thinly.', 'She piled them thickly on one tray to save time.', 'Spread them in one thin layer with space between.', 0],
      ['Otieno explains placing the dryer. ' + STEP, 'He raised it off the ground.', 'He tilted it.', 'He put it in the shade so the food would not burn.', 'Put it in full sun, facing the sun.', 1],
      ['Lucy explains between batches. ' + STEP, 'She took out the dried slices.', 'She loaded the next batch.', 'She never cleans the trays; there is no need.', 'Clean the trays; old bits grow mould and attract pests.', 2],
      ['Brian explains storing. ' + STEP, 'His spinach was crisp.', 'It was ready.', 'He left it in the dryer for days until needed.', 'Cool it and store it in a sealed, dry container.', 3],
      ['Esther explains turning. ' + STEP, 'She turns the slices once a day.', 'She closes the cover after.', 'She moves the dryer into shade at noon.', 'Keep it in full sun all day.', 1],
    ]),
];
