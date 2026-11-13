// ============================================================================
// GRADE 6 AGRICULTURE AND NUTRITION, PART C: STAIN REMOVAL, CROCHET AND THE MOIST BED GARDEN (3 skills).
// Written offline from the KICD 2024 design. The questions test the knowledge behind the practical outcomes; removing a stain,
// crocheting and building the garden are tasks for the teacher (see docs/qa/agriculture-g6-non-question-outcomes-2026-11-13.md).
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g6_lib.js';

const LS = 'HYGIEN.LAUNDRY_STAIN_REMOVAL.', CR = 'PRODUC.CROCHETING_STITCHES.', MB = 'PRODUC.CONSTRUCTING_MOIST_BED_G.';

export const FAMILIES = [
  // ---------------------------------------------------------------- STAINS
  fam('ls.st.treat', `${LS}STAINS`, 'direct', 1, choose([
    Q('How should a fresh blood stain be treated first?', 'Cold water and soap', ['Hot water|ST_BLOOD', 'Boiling water|ST_BLOOD', 'Hot soapy water|ST_BLOOD'], 'Hot water sets a blood stain. Use cold water and soap.'),
    Q('How is a grease stain on clothes treated?', 'Soap and warm water', ['Cold water only|ST_MATCH', 'Rubbing with dry cloth only|ST_MATCH', 'Leaving it in the sun|ST_MATCH'], 'Grease needs soap and warm water to break it down.'),
    Q('What should you do with a dried mud stain?', 'Let it dry, brush it off, then wash', ['Rub it wet at once|ST_RUB', 'Pour hot water on it|ST_MATCH', 'Cover it with soap and leave it|ST_MATCH'], 'Brush off dry mud before washing so it does not smear.'),
    Q('How should a stain be treated?', 'Gently, from the outside to the middle', ['Rub it hard in a circle|ST_RUB', 'Scrub it with a stone|ST_RUB', 'Pull the cloth hard|ST_RUB'], 'Rubbing hard spreads the stain. Work gently from the outside in.'),
    Q('Which stain is usually removed with lemon juice, salt and sun?', 'A rust stain', ['A blood stain|ST_MATCH', 'A grease stain|ST_MATCH', 'A mud stain|ST_MATCH'], 'Lemon juice and salt with sun help to lift rust.'),
  ], { h: ['Match the stain to the treatment.', 'Cold water for blood; soap and warm water for grease; do not rub hard.'], s1: 'Think about the kind of stain.' })),
  fam('ls.st.name', `${LS}STAINS`, 'word', 2, choose([
    Q('Achieng spills tea on her white shirt. What should she do first?', 'Rinse it at once and wash with soap', ['Leave it to dry first|ST_MATCH', 'Rub it with a dry cloth|ST_RUB', 'Wash it in hot oil|ST_MATCH'], 'Rinsing early helps tea come out.'),
    Q('Otieno cuts his knee and blood gets on his shorts. How should he clean them?', 'Soak in cold water and wash with soap', ['Soak in hot water|ST_BLOOD', 'Boil them at once|ST_BLOOD', 'Rub with a hot iron|ST_BLOOD'], 'Hot water would set the stain.'),
    Q('Wanjiru gets oil from the kitchen on her dress. What should she use?', 'Soap and warm water', ['Cold water only|ST_MATCH', 'Salt and no water|ST_MATCH', 'Dry brush only|ST_MATCH'], 'Warm soapy water lifts oil.'),
    Q('A child rubs a fresh ink stain hard. What happens?', 'The stain spreads', ['The stain disappears at once|ST_RUB', 'The cloth becomes whiter|ST_RUB', 'Nothing happens|ST_RUB'], 'Hard rubbing spreads a stain.'),
    Q('Which is the right order for treating mud on a shirt?', 'Dry, brush off, then wash', ['Wash, then brush while wet|ST_RUB', 'Brush while wet, then dry|ST_RUB', 'Iron it, then wash|ST_MATCH'], 'Wet mud smears into the cloth.'),
  ], { h: ['Treat the stain gently and match the treatment to the stain.', 'Hot water sets blood.'], s1: 'Think about what the stain is.' })),
  fam('ls.st.spot', `${LS}STAINS`, 'spot', 3, spot([
    S('Baraka removes a blood stain.', ['He soaks the cloth in cold water.', '!He pours hot water on it.', 'He washes it with soap.'], 'Hot water sets blood. Use cold water.', 'ST_BLOOD'),
    S('Wanjiru removes a stain.', ['She works from the outside in.', '!She rubs hard in a circle.', 'She rinses the cloth.'], 'Hard rubbing spreads the stain.', 'ST_RUB'),
    S('Kamau removes grease.', ['He uses soap.', '!He uses cold water only.', 'He uses warm water.'], 'Grease needs soap and warm water.', 'ST_MATCH'),
    S('Mwende removes mud.', ['She lets the mud dry.', '!She rubs the wet mud at once.', 'She brushes it off.'], 'Brush off dry mud before washing.', 'ST_RUB'),
    S('Nekesa treats a stain.', ['She finds the kind of stain.', 'She picks the right treatment.', '!She pours hot water on every stain.'], 'Hot water sets some stains. Match the treatment to the stain.', 'ST_BLOOD'),
  ], { h: ['Check each step: gentle, the right treatment, not hot water on blood.', 'Brush dry mud first.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- CROCHET
  fam('cr.cs.tool', `${CR}CROCHET`, 'direct', 1, choose([
    Q('What is used to crochet?', 'One crochet hook and yarn', ['Two knitting needles|CR_NEEDLE', 'A needle and thread|CR_NEEDLE', 'A pair of scissors|CR_NEEDLE'], 'Crocheting uses one hook and yarn.'),
    Q('Which stitch is the base of a crocheted piece?', 'The chain stitch', ['Double crochet|CR_STITCH', 'Single crochet|CR_STITCH', 'Slip stitch|CR_STITCH'], 'The chain stitch begins every piece.'),
    Q('Which stitch is taller?', 'Double crochet', ['Single crochet|CR_HEIGHT', 'Chain stitch|CR_HEIGHT', 'Slip stitch|CR_HEIGHT'], 'Double crochet is taller than single crochet.'),
    Q('Which is a household article that can be crocheted?', 'A table mat', ['A metal pot|CR_NEEDLE', 'A plastic bucket|CR_NEEDLE', 'A glass cup|CR_NEEDLE'], 'Yarn can make mats, doilies, coasters and small bags.'),
    Q('Which stitch is used to join the ends of a chain into a ring?', 'Slip stitch', ['Double crochet|CR_STITCH', 'Single crochet|CR_STITCH', 'Treble crochet|CR_STITCH'], 'The slip stitch joins.'),
  ], { h: ['Crocheting uses one hook and yarn.', 'Chain first; double is taller than single.'], s1: 'Think about the tool and the stitches.' })),
  fam('cr.cs.order', `${CR}CROCHET`, 'steps', 2, choose([
    Q('Achieng starts a table mat. What does she make first?', 'A row of chain stitches', ['A row of double crochet|CR_STITCH', 'A row of single crochet|CR_STITCH', 'A row of slip stitches|CR_STITCH'], 'The chain stitch is the base.'),
    Q('Otieno wants a taller row on his mat. Which stitch should he use?', 'Double crochet', ['Single crochet|CR_HEIGHT', 'Chain stitch|CR_HEIGHT', 'Slip stitch|CR_HEIGHT'], 'Double crochet is taller.'),
    Q('Wanjiru picks up two knitting needles to crochet. What is wrong?', 'Crocheting uses one hook', ['Nothing, two needles are right|CR_NEEDLE', 'She needs three needles|CR_NEEDLE', 'She needs a pin|CR_NEEDLE'], 'Crochet uses a hook.'),
    Q('Which stitch makes a shorter row than double crochet?', 'Single crochet', ['Double crochet|CR_HEIGHT', 'Treble crochet|CR_HEIGHT', 'Triple stitch|CR_HEIGHT'], 'Single crochet is shorter.'),
    Q('What is crocheting?', 'Making cloth from yarn with a hook and stitches', ['Making cloth with two needles|CR_NEEDLE', 'Weaving on a loom|CR_NEEDLE', 'Sewing with a machine|CR_NEEDLE'], 'Crocheting uses a hook and loops of yarn.'),
  ], { h: ['Chain stitch comes first; double crochet is taller.', 'One hook, not two needles.'], s1: 'Think about stitches in order of height.' })),
  fam('cr.cs.spot', `${CR}CROCHET`, 'spot', 3, spot([
    S('Baraka explains crocheting.', ['It uses yarn.', '!It uses two knitting needles.', 'It uses a hook.'], 'Crocheting uses one hook.', 'CR_NEEDLE'),
    S('Wanjiru explains the base.', ['A chain is made first.', '!Double crochet is made first.', 'Then the rows are added.'], 'The chain stitch is the base.', 'CR_STITCH'),
    S('Kamau explains the stitches.', ['Single crochet is short.', '!Single crochet is taller than double crochet.', 'Double crochet is tall.'], 'Double crochet is taller.', 'CR_HEIGHT'),
    S('Mwende explains the tool.', ['The hook has a hook at one end.', '!She uses two hooks at the same time.', 'She pulls loops of yarn through.'], 'Crocheting uses one hook.', 'CR_NEEDLE'),
    S('Nekesa explains the mat.', ['She starts with a chain.', 'She adds rows of stitches.', '!She starts with a double crochet.'], 'She starts with a chain.', 'CR_STITCH'),
  ], { h: ['Check each step: one hook, a chain first, double is taller.', 'Single crochet is shorter than double.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- MOIST BED
  fam('mb.gd.what', `${MB}MOIST_BED`, 'direct', 1, choose([
    Q('What is a moist bed garden?', 'A sunken bed that holds water', ['A raised bed above the ground|MB_RAISED', 'A bed made on a roof|MB_RAISED', 'A bed with no soil|MB_RAISED'], 'A moist bed garden is sunken with layers that hold water.'),
    Q('What goes on top of a moist bed garden?', 'Mulch such as dry grass', ['Nothing, the bed is left empty to dry|MB_NOMULCH', 'Stones only, all the way to the top|MB_NOMULCH', 'Plastic bags|MB_NOMULCH'], 'Mulch on top keeps the water in.'),
    Q('Which crop can grow in a moist bed garden?', 'Kale or spinach', ['A tall tree|MB_RAISED', 'A cactus|MB_RAISED', 'A stone|MB_RAISED'], 'Vegetables like kale and spinach do well in moist beds.'),
    Q('Why is a moist bed garden useful?', 'Vegetables can grow in dry times', ['It needs no water at all|MB_NOMULCH', 'It makes rain fall|MB_NOMULCH', 'It grows without soil|MB_NOMULCH'], 'The bed holds water, so crops grow in dry times.'),
    Q('Where should a moist bed garden be built?', 'Near a source of water, such as the kitchen', ['Far from any water|MB_ORDER', 'On a rocky hill top|MB_ORDER', 'In a place no one visits|MB_ORDER'], 'A moist bed is easy to water near the kitchen or tap.'),
  ], { h: ['A moist bed is sunken, layered and mulched.', 'It is built near water.'], s1: 'Think about how it holds water.' })),
  fam('mb.gd.steps', `${MB}MOIST_BED`, 'steps', 2, choose([
    Q('What comes first in building a moist bed garden?', 'Choose a site near water and dig', ['Plant the seedlings straight into the hard ground|MB_ORDER', 'Water the bed until it is wet through|MB_ORDER', 'Spread the mulch over the bare ground|MB_ORDER'], 'First choose the site and dig the bed.'),
    Q('After digging, what goes into the bed?', 'Layers of dry plant matter and manure, then topsoil', ['Stones only, all the way to the top|MB_ORDER', 'Nothing, the bed is left empty to dry|MB_ORDER', 'Plastic sheets to stop the water|MB_ORDER'], 'The layers hold water and feed the crop.'),
    Q('What is done after the topsoil is added?', 'Plant the seedlings and mulch', ['Dig again and make the bed deeper|MB_ORDER', 'Leave it bare and wait for the rain|MB_NOMULCH', 'Remove the layers and start over|MB_ORDER'], 'Then plant and cover with mulch.'),
    Q('Achieng finishes planting her moist bed. What should she do last?', 'Add mulch and water the bed', ['Leave it bare and wait for the rain|MB_NOMULCH', 'Dig it up and plant elsewhere|MB_ORDER', 'Pour out the water from the bed|MB_ORDER'], 'Mulch and water complete the bed.'),
    Q('Otieno makes a raised bed and calls it a moist bed garden. What is wrong?', 'A moist bed garden is sunken, not raised', ['Nothing at all, they are the same thing|MB_RAISED', 'It needs a roof to keep the rain off|MB_RAISED', 'It needs a wall to hold the soil in|MB_RAISED'], 'A moist bed garden is sunken.'),
  ], { h: ['Site, dig, layers, topsoil, plant, mulch, water.', 'It is sunken, not raised.'], s1: 'Put the steps in order.' })),
  fam('mb.gd.spot', `${MB}MOIST_BED`, 'spot', 3, spot([
    S('Baraka explains a moist bed.', ['It is a sunken bed.', '!It is a raised bed.', 'It holds water.'], 'A moist bed garden is sunken.', 'MB_RAISED'),
    S('Wanjiru builds a moist bed.', ['She digs the bed.', '!She plants before she digs.', 'She adds layers.'], 'She digs first and plants last.', 'MB_ORDER'),
    S('Kamau finishes his moist bed.', ['He plants kale.', '!He leaves the soil bare.', 'He waters it.'], 'He should add mulch to keep the water in.', 'MB_NOMULCH'),
    S('Mwende explains the layers.', ['Dry plant matter goes at the bottom.', 'Manure goes above it.', '!Mulch goes at the bottom.'], 'Mulch goes on top.', 'MB_NOMULCH'),
    S('Nekesa explains the site.', ['Build it near water.', '!Build it far from water.', 'It should be easy to reach.'], 'A moist bed is built near water.', 'MB_ORDER'),
  ], { h: ['Check each step: sunken, layers, mulch on top, near water.', 'Dig first, plant last.'], s1: 'Find the step that is not true.' })),
];
