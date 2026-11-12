// ============================================================================
// GRADE 5 CREATIVE ARTS, THEME B: PAINTING AND MOSAIC, MELODY AND ROUNDERS KNOWLEDGE (10 skills).
// Knowledge half only: painting, singing, composing, carving and playing are practical (see the non-question outcomes doc).
// Melodies are written as sol-fa letters and hand signs are described in words. Every wrong answer names the library
// misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, w, sp } from './creativearts_g5_lib.js';

const PM = 'CREATI.PAINTING_AND_MOSAIC.', ML = 'CREATI.MELODY.', RD = 'CREATI.ROUNDERS.';

export const FAMILIES = [
  // ---------------------------------------------------------------- PM.COLOUR_WHEEL
  fam('pm.cw.primary', `${PM}COLOUR_WHEEL`, 'direct', 1, choose([
    ['Which of these is a primary colour?', 'Blue', [...w('M_PM_GREEN_PRIMARY', 'Green'), ...w('M_PM_ORANGE_PRIMARY', 'Orange'), ...w('M_PM_ORANGE_PRIMARY', 'Purple')], 'Blue is a primary colour. It cannot be made by mixing.'],
    ['Which three colours are the primary colours?', 'Red, yellow and blue', [...w('M_PM_GREEN_PRIMARY', 'Red, green and blue'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'Black, white and red'), ...w('M_PM_ORANGE_PRIMARY', 'Orange, green and purple')], 'The primary colours are red, yellow and blue.'],
    ['Which of these is a secondary colour?', 'Green', [...w('M_PM_GREEN_PRIMARY', 'Red'), ...w('M_PM_GREEN_PRIMARY', 'Yellow'), ...w('M_PM_GREEN_PRIMARY', 'Blue')], 'Green is made from blue and yellow, so it is secondary.'],
    ['Which of these is a secondary colour?', 'Orange', [...w('M_PM_ORANGE_PRIMARY', 'Yellow'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'Black'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'White')], 'Orange is made from red and yellow.'],
    ['Which statement about primary colours is true?', 'They cannot be made by mixing other colours', [...w('M_PM_SECONDARY_MAKES_PRIMARY', 'Red can be made from orange and yellow'), ...w('M_PM_SECONDARY_MAKES_PRIMARY', 'Blue can be made from green and purple'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'Black and white are primary colours')], 'Primary colours are the starting colours.'],
  ], { h: ['Think about which colours can be made by mixing.', 'Red, yellow and blue are primary. The others are made from them.'], s1: 'Recall the primary colours.' })),
  fam('pm.cw.story', `${PM}COLOUR_WHEEL`, 'word', 2, choose([
    ['Njeri has only three paints: red, yellow and blue. Her teacher calls them by one name. What is it?', 'Primary colours', [...w('M_PM_SECONDARY_MAKES_PRIMARY', 'Secondary colours'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'Dark colours'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'Basic black')], 'Red, yellow and blue are the primary colours.'],
    ['Otieno says green is a primary colour because leaves are green. What should his teacher say?', 'Green is secondary: it is made from blue and yellow', [...w('M_PM_GREEN_PRIMARY', 'He is right, leaves are green'), ...w('M_PM_GREEN_PRIMARY', 'Green is primary because it is common'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'Green is made from black and white')], 'Green is made by mixing, so it is secondary.'],
    ['Amina wants to paint orange but has none. Which colour group does orange belong to?', 'Secondary colours', [...w('M_PM_ORANGE_PRIMARY', 'Primary colours'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'Neutral colours'), ...w('M_PM_ORANGE_PRIMARY', 'Basic colours')], 'Orange is made from two primaries.'],
    ['Kamau asks if he can mix red from other paints. What is the answer?', 'No, red is a primary colour', [...w('M_PM_SECONDARY_MAKES_PRIMARY', 'Yes, by mixing orange and yellow'), ...w('M_PM_SECONDARY_MAKES_PRIMARY', 'Yes, by mixing purple and white'), ...w('M_PM_SECONDARY_MAKES_PRIMARY', 'Yes, by mixing green and blue')], 'Primary colours cannot be made.'],
    ['Zawadi lists colours on the wheel. Which pair of her list are both secondary?', 'Orange and purple', [...w('M_PM_ORANGE_PRIMARY', 'Orange and red'), ...w('M_PM_GREEN_PRIMARY', 'Green and blue'), ...w('M_PM_BLACK_WHITE_PRIMARY', 'Black and white')], 'Orange and purple are both made by mixing.'],
  ], { h: ['Which colours can be made?', 'Primary: red, yellow, blue.'], s1: 'Sort the colours into made and not made.' })),
  fam('pm.cw.spot', `${PM}COLOUR_WHEEL`, 'spot', 3, spot([
    sp('Njeri sorts colours. Which step has the mistake?', ['Step 1: Red is primary.', 'Step 2: Yellow is primary.', 'Step 3: Green is primary.'], 2, 'Green is secondary. It is made from blue and yellow.', 'M_PM_GREEN_PRIMARY'),
    sp('Wekesa lists the primary colours. Which step has the mistake?', ['Step 1: He writes red.', 'Step 2: He writes blue.', 'Step 3: He writes black.'], 2, 'Black is not a primary colour. Yellow is.', 'M_PM_BLACK_WHITE_PRIMARY'),
    sp('Chebet explains mixing. Which step has the mistake?', ['Step 1: Orange is made from red and yellow.', 'Step 2: She says red can be made from orange.', 'Step 3: She says primary colours start the wheel.'], 1, 'Red cannot be made by mixing.', 'M_PM_SECONDARY_MAKES_PRIMARY'),
    sp('Juma sorts colours. Which step has the mistake?', ['Step 1: Purple is secondary.', 'Step 2: Green is secondary.', 'Step 3: Orange is primary.'], 2, 'Orange is secondary.', 'M_PM_ORANGE_PRIMARY'),
    sp('Amina names colours. Which step has the mistake?', ['Step 1: Blue is primary.', 'Step 2: She says white is a primary colour.', 'Step 3: Yellow is primary.'], 1, 'White is not a primary colour.', 'M_PM_BLACK_WHITE_PRIMARY'),
  ], { h: ['Check each step against red, yellow and blue.', 'Secondary colours are made.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PM.MIXING
  fam('pm.mx.pair', `${PM}MIXING`, 'direct', 1, choose([
    ['Which two colours make orange?', 'Red and yellow', [...w('M_PM_MIX_RY_GREEN', 'Blue and yellow'), ...w('M_PM_MIX_BY_PURPLE', 'Red and blue'), ...w('M_PM_MIX_BROWN', 'Blue and red and yellow')], 'Red and yellow make orange.'],
    ['Which two colours make green?', 'Blue and yellow', [...w('M_PM_MIX_RY_GREEN', 'Red and yellow'), ...w('M_PM_MIX_BY_PURPLE', 'Red and blue'), ...w('M_PM_MIX_BROWN', 'Red and white')], 'Blue and yellow make green.'],
    ['Which two colours make purple?', 'Red and blue', [...w('M_PM_MIX_BY_PURPLE', 'Blue and yellow'), ...w('M_PM_MIX_RY_GREEN', 'Red and yellow'), ...w('M_PM_MIX_BROWN', 'Black and white')], 'Red and blue make purple.'],
    ['What colour do red and yellow make when mixed?', 'Orange', [...w('M_PM_MIX_RY_GREEN', 'Green'), ...w('M_PM_MIX_BY_PURPLE', 'Purple'), ...w('M_PM_MIX_BROWN', 'Brown')], 'Red and yellow make orange.'],
    ['What colour do blue and yellow make when mixed?', 'Green', [...w('M_PM_MIX_BY_PURPLE', 'Purple'), ...w('M_PM_MIX_RY_GREEN', 'Orange'), ...w('M_PM_MIX_BROWN', 'Brown')], 'Blue and yellow make green.'],
  ], { h: ['Try each pair on paper in your mind.', 'Red + yellow = orange, blue + yellow = green, red + blue = purple.'], s1: 'Recall the three mixes.' })),
  fam('pm.mx.story', `${PM}MIXING`, 'word', 2, choose([
    ['Achieng wants to paint a green mango leaf but has only blue and yellow paint. What should she do?', 'Mix blue and yellow', [...w('M_PM_MIX_RY_GREEN', 'Mix red and yellow'), ...w('M_PM_MIX_BY_PURPLE', 'Mix red and blue'), ...w('M_PM_MIX_BROWN', 'Mix all three')], 'Blue and yellow make green.'],
    ['Baraka paints a Kenyan sunset using red and yellow. What colour appears where they mix?', 'Orange', [...w('M_PM_MIX_RY_GREEN', 'Green'), ...w('M_PM_MIX_BY_PURPLE', 'Purple'), ...w('M_PM_MIX_BROWN', 'Brown')], 'Red and yellow make orange.'],
    ['Wanjiru mixes red and blue to paint a jacaranda flower. What colour is it?', 'Purple', [...w('M_PM_MIX_BY_PURPLE', 'Green'), ...w('M_PM_MIX_RY_GREEN', 'Orange'), ...w('M_PM_MIX_BROWN', 'Brown')], 'Red and blue make purple.'],
    ['Kiprop mixes only red and blue and gets a muddy brown. His teacher says clean purple is possible. What is the likely cause?', 'He added other colours too', [...w('M_PM_MIX_BROWN', 'Red and blue always make brown'), ...w('M_PM_MIX_BROWN', 'Purple needs black'), ...w('M_PM_MIX_BROWN', 'Purple needs white')], 'Two clean primaries give a clean secondary.'],
    ['Mwikali needs orange for a pumpkin. Which pair of paints does she pick?', 'Red and yellow', [...w('M_PM_MIX_RY_GREEN', 'Blue and yellow'), ...w('M_PM_MIX_BY_PURPLE', 'Red and blue'), ...w('M_PM_MIX_BROWN', 'Black and yellow')], 'Red and yellow make orange.'],
  ], { h: ['Which pair makes the colour needed?', 'Red + yellow = orange, blue + yellow = green, red + blue = purple.'], s1: 'Decide which colour is needed.' })),
  fam('pm.mx.spot', `${PM}MIXING`, 'spot', 3, spot([
    sp('Njeri explains mixing. Which step has the mistake?', ['Step 1: She takes red and yellow.', 'Step 2: She mixes them.', 'Step 3: She says they make green.'], 2, 'Red and yellow make orange.', 'M_PM_MIX_RY_GREEN'),
    sp('Otieno explains purple. Which step has the mistake?', ['Step 1: He takes blue and yellow.', 'Step 2: He mixes them.', 'Step 3: He says they make purple.'], 2, 'Blue and yellow make green. Red and blue make purple.', 'M_PM_MIX_BY_PURPLE'),
    sp('Amina mixes red and blue. Which step has the mistake?', ['Step 1: She mixes red and blue.', 'Step 2: She says every mix makes brown.', 'Step 3: She gets purple.'], 1, 'Two primaries make a clean secondary colour.', 'M_PM_MIX_BROWN'),
    sp('Chebet mixes blue and yellow. Which step has the mistake?', ['Step 1: She puts blue on the palette.', 'Step 2: She adds yellow.', 'Step 3: She says the mix is orange.'], 2, 'Blue and yellow make green.', 'M_PM_MIX_RY_GREEN'),
    sp('Kamau mixes colours. Which step has the mistake?', ['Step 1: Red and yellow give orange.', 'Step 2: Blue and yellow give purple.', 'Step 3: Red and blue give purple.'], 1, 'Blue and yellow give green.', 'M_PM_MIX_BY_PURPLE'),
  ], { h: ['Check each pair.', 'Red + yellow = orange, blue + yellow = green, red + blue = purple.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PM.WASH
  fam('pm.wa.which', `${PM}WASH`, 'direct', 1, choose([
    ['What kind of paint is used for a wash?', 'Thin, watery paint', [...w('M_PM_WASH_THICK', 'Thick paint from the tube'), ...w('M_PM_WASH_THICK', 'Dry powder'), ...w('M_PM_WASH_THICK', 'Wax')], 'A wash is thin, watery paint.'],
    ['Which brush suits a wash over a large sky?', 'A large soft brush', [...w('M_PM_WASH_SMALL_BRUSH', 'The smallest thin brush'), ...w('M_PM_WASH_SMALL_BRUSH', 'A pencil'), ...w('M_PM_WASH_SMALL_BRUSH', 'A toothpick')], 'A large brush spreads a wash evenly.'],
    ['In a wash scenery, what is painted last?', 'The small details', [...w('M_PM_WASH_DETAIL_FIRST', 'The sky'), ...w('M_PM_WASH_DETAIL_FIRST', 'The large background'), ...w('M_PM_WASH_DETAIL_FIRST', 'The first light colour')], 'Details go on last, after the wash has dried.'],
    ['Which area is usually painted first in a scenery wash?', 'The large light sky', [...w('M_PM_WASH_DETAIL_FIRST', 'The small birds'), ...w('M_PM_WASH_DETAIL_FIRST', 'The tiny leaves'), ...w('M_PM_WASH_DETAIL_FIRST', 'The fine outlines')], 'Large light areas go first.'],
    ['Why is a wash made with plenty of water?', 'So the colour spreads smoothly and softly', [...w('M_PM_WASH_THICK', 'So the colour is as strong as possible'), ...w('M_PM_WASH_THICK', 'So the paint stays in lumps'), ...w('M_PM_WASH_THICK', 'So it dries instantly')], 'Water makes the colour thin and smooth.'],
  ], { h: ['Think: thin paint, big brush, light first.', 'Details come last.'], s1: 'Recall how a wash is done.' })),
  fam('pm.wa.story', `${PM}WASH`, 'word', 2, choose([
    ['Njeri paints the sky of a Rift Valley scene. She wants a soft, even blue. What should she do?', 'Add plenty of water to the paint', [...w('M_PM_WASH_THICK', 'Use the paint thick'), ...w('M_PM_WASH_SMALL_BRUSH', 'Use a tiny brush'), ...w('M_PM_WASH_DETAIL_FIRST', 'Paint the birds first')], 'A wash is thin and watery.'],
    ['Otieno paints tiny birds first, then the sky. The birds smudge. What should he have done?', 'Painted the sky first and let it dry', [...w('M_PM_WASH_DETAIL_FIRST', 'Painted the birds even smaller'), ...w('M_PM_WASH_THICK', 'Used thicker paint'), ...w('M_PM_WASH_SMALL_BRUSH', 'Used a smaller brush')], 'Wash first, details last.'],
    ['Amina must cover a big sheet with a pale colour quickly. Which brush should she choose?', 'A large flat brush', [...w('M_PM_WASH_SMALL_BRUSH', 'A thin pointed brush'), ...w('M_PM_WASH_SMALL_BRUSH', 'A matchstick'), ...w('M_PM_WASH_SMALL_BRUSH', 'Her fingernail')], 'A large brush covers a big area quickly.'],
    ['Kiprop paints hills in a wash. The first layer is still wet. When should he add the small trees?', 'After the wash has dried', [...w('M_PM_WASH_DETAIL_FIRST', 'Straight away'), ...w('M_PM_WASH_DETAIL_FIRST', 'Before painting the hills'), ...w('M_PM_WASH_THICK', 'Never, trees need thick paint at once')], 'Details go on after the wash dries.'],
    ['Chebet mixes paint for a wash. Which mix is correct?', 'A little paint in a lot of water', [...w('M_PM_WASH_THICK', 'A lot of paint with a drop of water'), ...w('M_PM_WASH_THICK', 'Paint with no water'), ...w('M_PM_WASH_THICK', 'Paint mixed with sand')], 'A wash has plenty of water.'],
  ], { h: ['Thin paint, big brush, details last.', 'Let the wash dry first.'], s1: 'Decide what a good wash needs.' })),
  fam('pm.wa.spot', `${PM}WASH`, 'spot', 3, spot([
    sp('Njeri explains a wash. Which step has the mistake?', ['Step 1: She takes a large brush.', 'Step 2: She uses thick paint with no water.', 'Step 3: She spreads it over the sky.'], 1, 'A wash uses thin, watery paint.', 'M_PM_WASH_THICK'),
    sp('Wekesa paints a scenery. Which step has the mistake?', ['Step 1: He paints the tiny birds.', 'Step 2: He paints the sky.', 'Step 3: He paints the hills.'], 0, 'Paint the large areas first and add details last.', 'M_PM_WASH_DETAIL_FIRST'),
    sp('Amina chooses a brush for the sky. Which step has the mistake?', ['Step 1: The sky is large.', 'Step 2: She picks the smallest brush.', 'Step 3: She paints it slowly.'], 1, 'A large brush suits a wash.', 'M_PM_WASH_SMALL_BRUSH'),
    sp('Kamau paints a wash. Which step has the mistake?', ['Step 1: He paints the sky.', 'Step 2: He lets it dry.', 'Step 3: He uses thick paint for the sky.'], 2, 'A wash is thin, watery paint.', 'M_PM_WASH_THICK'),
    sp('Zawadi plans her scenery. Which step has the mistake?', ['Step 1: Large light areas first.', 'Step 2: Small details last.', 'Step 3: She paints fine lines before the sky.'], 2, 'Details come last.', 'M_PM_WASH_DETAIL_FIRST'),
  ], { h: ['Check each step.', 'Thin paint, big brush, light first, details last.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PM.MOSAIC
  fam('pm.mo.which', `${PM}MOSAIC`, 'direct', 1, choose([
    ['How is a mosaic picture made?', 'By sticking small pieces close together', [...w('M_PM_MOSAIC_PAINTED', 'By painting tiny dots'), ...w('M_PM_MOSAIC_PAINTED', 'By drawing with a pencil'), ...w('M_PM_MOSAIC_OVERLAP', 'By stacking pieces on top of each other')], 'A mosaic is made of many small pieces.'],
    ['Which material suits a mosaic?', 'Coloured paper pieces', [...w('M_PM_MOSAIC_PAINTED', 'Wet paint only'), ...w('M_PM_MOSAIC_PAINTED', 'Water only'), ...w('M_PM_MOSAIC_PAINTED', 'Smoke')], 'Paper bits, seeds and bottle tops can be used.'],
    ['How should the pieces be placed in a mosaic?', 'Side by side with small gaps', [...w('M_PM_MOSAIC_OVERLAP', 'On top of each other'), ...w('M_PM_MOSAIC_OVERLAP', 'Far apart'), ...w('M_PM_MOSAIC_OVERLAP', 'In one large lump')], 'Pieces sit side by side with small gaps.'],
    ['What should be done before sticking pieces for a mosaic?', 'Draw the design on the board', [...w('M_PM_MOSAIC_NO_PLAN', 'Glue the whole board'), ...w('M_PM_MOSAIC_NO_PLAN', 'Start sticking at once'), ...w('M_PM_MOSAIC_NO_PLAN', 'Cut one big piece')], 'Plan the design first.'],
    ['How much glue should be spread at a time?', 'A small area', [...w('M_PM_MOSAIC_NO_PLAN', 'The whole board at once'), ...w('M_PM_MOSAIC_NO_PLAN', 'None at all'), ...w('M_PM_MOSAIC_NO_PLAN', 'The pieces only, in a pile')], 'Glue small areas so it does not dry first.'],
  ], { h: ['Think: small pieces, a plan, small gaps.', 'Glue a little at a time.'], s1: 'Recall how a mosaic is made.' })),
  fam('pm.mo.story', `${PM}MOSAIC`, 'word', 2, choose([
    ['Njeri wants to make a mosaic of a lion. She has seeds, bottle tops and old magazines. What is the first thing she should do?', 'Draw the lion on a board', [...w('M_PM_MOSAIC_NO_PLAN', 'Glue the whole board'), ...w('M_PM_MOSAIC_NO_PLAN', 'Stick pieces in random places'), ...w('M_PM_MOSAIC_PAINTED', 'Paint tiny dots')], 'Draw the design first.'],
    ['Otieno puts pieces on top of one another and the picture bumps up. What went wrong?', 'The pieces should sit side by side', [...w('M_PM_MOSAIC_OVERLAP', 'He used too little glue'), ...w('M_PM_MOSAIC_OVERLAP', 'The pieces were too small'), ...w('M_PM_MOSAIC_PAINTED', 'He did not paint them')], 'Mosaic pieces sit side by side with small gaps.'],
    ['Amina asks if a mosaic is a painting of dots. What is the answer?', 'No, it is stuck pieces', [...w('M_PM_MOSAIC_PAINTED', 'Yes, it is painted dots'), ...w('M_PM_MOSAIC_PAINTED', 'Yes, it is drawn with a pen'), ...w('M_PM_MOSAIC_PAINTED', 'Yes, it is printed with ink')], 'A mosaic is made of small stuck pieces.'],
    ['Kamau spreads glue over the whole board and the glue dries before he finishes. What should he do next time?', 'Glue a small area at a time', [...w('M_PM_MOSAIC_NO_PLAN', 'Use more glue'), ...w('M_PM_MOSAIC_NO_PLAN', 'Skip the glue'), ...w('M_PM_MOSAIC_NO_PLAN', 'Glue the back of the board')], 'Small areas keep the glue wet.'],
    ['Zawadi picks things for a mosaic. Which set suits it?', 'Seeds, paper and bottle tops', [...w('M_PM_MOSAIC_PAINTED', 'Wet paint and some water'), ...w('M_PM_MOSAIC_PAINTED', 'Chalk dust and some air'), ...w('M_PM_MOSAIC_PAINTED', 'Smoke and some steam')], 'These are small pieces that can be stuck.'],
  ], { h: ['Think: small pieces, a plan, small gaps.', 'Glue a little at a time.'], s1: 'Decide what a mosaic needs.' })),
  fam('pm.mo.spot', `${PM}MOSAIC`, 'spot', 3, spot([
    sp('Wekesa explains mosaics. Which step has the mistake?', ['Step 1: He draws the design.', 'Step 2: He paints tiny dots.', 'Step 3: He calls it a mosaic.'], 1, 'A mosaic is made of stuck pieces, not painted dots.', 'M_PM_MOSAIC_PAINTED'),
    sp('Chebet explains the pieces. Which step has the mistake?', ['Step 1: She cuts small pieces.', 'Step 2: She stacks them on top of each other.', 'Step 3: She glues them.'], 1, 'Pieces sit side by side with small gaps.', 'M_PM_MOSAIC_OVERLAP'),
    sp('Juma begins a mosaic. Which step has the mistake?', ['Step 1: He gets seeds and paper.', 'Step 2: He starts sticking without a design.', 'Step 3: He glues a small area.'], 1, 'Draw the design first.', 'M_PM_MOSAIC_NO_PLAN'),
    sp('Njeri plans the mosaic. Which step has the mistake?', ['Step 1: She draws the design.', 'Step 2: She glues the whole board at once.', 'Step 3: She sticks pieces.'], 1, 'Glue a small area at a time.', 'M_PM_MOSAIC_NO_PLAN'),
    sp('Amina describes a mosaic. Which step has the mistake?', ['Step 1: It is made of small pieces.', 'Step 2: The pieces are stuck on a surface.', 'Step 3: The pieces overlap each other completely.'], 2, 'Small gaps are left between pieces.', 'M_PM_MOSAIC_OVERLAP'),
  ], { h: ['Check each step.', 'Small pieces, a plan, small gaps.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- ML.SOLFA
  fam('ml.sf.order', `${ML}SOLFA`, 'direct', 1, choose([
    ['Which is the right order going up?', 'd r m f s', [...w('M_ML_ORDER_SCRAMBLED', 'd m r f s'), ...w('M_ML_DOWN_UP_SAME', 's f m r d'), ...w('M_ML_ORDER_SCRAMBLED', 'd r f m s')], 'Going up the order is d r m f s.'],
    ['Which of d r m f s is the highest sound?', 's', [...w('M_ML_FIRST_HIGHEST', 'd'), ...w('M_ML_FIRST_HIGHEST', 'r'), ...w('M_ML_FIRST_HIGHEST', 'm')], 's is the highest of the five.'],
    ['Which of d r m f s is the lowest sound?', 'd', [...w('M_ML_FIRST_HIGHEST', 's'), ...w('M_ML_FIRST_HIGHEST', 'f'), ...w('M_ML_FIRST_HIGHEST', 'm')], 'd is the lowest of the five.'],
    ['Which syllable comes straight after m when going up?', 'f', [...w('M_ML_ORDER_SCRAMBLED', 'r'), ...w('M_ML_ORDER_SCRAMBLED', 's'), ...w('M_ML_ORDER_SCRAMBLED', 'd')], 'The order is d r m f s.'],
    ['Which is the order going down from s?', 's f m r d', [...w('M_ML_DOWN_UP_SAME', 'd r m f s'), ...w('M_ML_ORDER_SCRAMBLED', 's m f r d'), ...w('M_ML_ORDER_SCRAMBLED', 's f r m d')], 'Going down it is s f m r d.'],
  ], { h: ['Think of steps going up a ladder.', 'd r m f s going up.'], s1: 'Recall the order of the syllables.' })),
  fam('ml.sf.story', `${ML}SOLFA`, 'word', 2, choose([
    ['Njeri sings d r m f s with her voice rising. Which note is she singing last?', 's, the highest', [...w('M_ML_FIRST_HIGHEST', 'd, the highest'), ...w('M_ML_FIRST_HIGHEST', 'r, the lowest'), ...w('M_ML_ORDER_SCRAMBLED', 'f, the highest')], 's is the last and highest.'],
    ['Otieno sings from s down to d. Which syllable does he sing second?', 'f', [...w('M_ML_DOWN_UP_SAME', 'r'), ...w('M_ML_DOWN_UP_SAME', 'd'), ...w('M_ML_ORDER_SCRAMBLED', 'm')], 'Going down: s then f.'],
    ['Amina says d is the highest because we sing it first. Is she right?', 'No, d is the lowest', [...w('M_ML_FIRST_HIGHEST', 'Yes, first is highest'), ...w('M_ML_FIRST_HIGHEST', 'Yes, because it is a capital letter'), ...w('M_ML_FIRST_HIGHEST', 'Yes, d and s are the same')], 'The first sound sung going up is the lowest.'],
    ['Kamau climbs three steps from d. Which syllable is he on?', 'f', [...w('M_ML_ORDER_SCRAMBLED', 'm'), ...w('M_ML_ORDER_SCRAMBLED', 's'), ...w('M_ML_ORDER_SCRAMBLED', 'r')], 'd, then r, m, f: three steps up is f.'],
    ['Wanjiru sings d r m f s. A friend sings the same order going down. Is that right?', 'No, going down is s f m r d', [...w('M_ML_DOWN_UP_SAME', 'Yes, the order never changes'), ...w('M_ML_DOWN_UP_SAME', 'Yes, d r m f s both ways'), ...w('M_ML_FIRST_HIGHEST', 'No, going down is d m f r s')], 'Going down reverses the order.'],
  ], { h: ['Picture a ladder from low to high.', 'Down is the reverse of up.'], s1: 'Decide which direction the voice moves.' })),
  fam('ml.sf.spot', `${ML}SOLFA`, 'spot', 3, spot([
    sp('Njeri explains the pitches. Which step has the mistake?', ['Step 1: She sings d r m f s.', 'Step 2: She says d is the highest sound.', 'Step 3: She says s is the highest sound.'], 1, 'd is the lowest and s the highest.', 'M_ML_FIRST_HIGHEST'),
    sp('Otieno writes the order. Which step has the mistake?', ['Step 1: He writes d.', 'Step 2: He writes m next.', 'Step 3: He writes r, f, s.'], 1, 'The order is d r m f s.', 'M_ML_ORDER_SCRAMBLED'),
    sp('Amina sings down. Which step has the mistake?', ['Step 1: She starts at s.', 'Step 2: She sings d r m f s again.', 'Step 3: She says she went down.'], 1, 'Going down is s f m r d.', 'M_ML_DOWN_UP_SAME'),
    sp('Kamau sorts the syllables. Which step has the mistake?', ['Step 1: d is lowest.', 'Step 2: s is highest.', 'Step 3: He says d is higher than f.'], 2, 'f is higher than d.', 'M_ML_FIRST_HIGHEST'),
    sp('Zawadi sings a ladder. Which step has the mistake?', ['Step 1: d r m.', 'Step 2: s f.', 'Step 3: She says the order going up is d r f m s.'], 2, 'Going up it is d r m f s.', 'M_ML_ORDER_SCRAMBLED'),
  ], { h: ['Check each step.', 'd lowest, s highest.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- ML.SIGNS
  fam('ml.sg.which', `${ML}SIGNS`, 'direct', 1, choose([
    ['Which syllable is shown by a thumb pointing down?', 'f', [...w('M_ML_SIGN_FA_UP', 'm'), ...w('M_ML_SIGN_FA_UP', 'd'), ...w('M_ML_SIGN_FA_UP', 's')], 'The thumb pointing down is f.'],
    ['How does the hand look for d?', 'A closed fist held low', [...w('M_ML_SIGN_D_OPEN', 'An open flat hand'), ...w('M_ML_SIGN_D_OPEN', 'A thumb pointing down'), ...w('M_ML_SIGN_SAME_HEIGHT', 'A hand held high')], 'd is a closed fist held low.'],
    ['As the sound goes from d up to s, how does the hand move?', 'It goes higher', [...w('M_ML_SIGN_SAME_HEIGHT', 'It stays at the same height'), ...w('M_ML_SIGN_SAME_HEIGHT', 'It goes lower'), ...w('M_ML_SIGN_SAME_HEIGHT', 'It leaves the body')], 'The hand rises with the pitch.'],
    ['Which syllable is a flat hand with the palm down?', 'm', [...w('M_ML_SIGN_FA_UP', 'f'), ...w('M_ML_SIGN_D_OPEN', 'd'), ...w('M_ML_SIGN_FA_UP', 'r')], 'm is a flat hand with the palm down.'],
    ['Which sign is held lowest?', 'd', [...w('M_ML_SIGN_SAME_HEIGHT', 's'), ...w('M_ML_SIGN_SAME_HEIGHT', 'f'), ...w('M_ML_SIGN_SAME_HEIGHT', 'm')], 'd is the lowest note, so its sign is held lowest.'],
  ], { h: ['Think of shape and height.', 'd fist low, f thumb down, hand rises with pitch.'], s1: 'Recall the signs.' })),
  fam('ml.sg.story', `${ML}SIGNS`, 'word', 2, choose([
    ['Njeri\'s teacher shows a thumb pointing down. Which note should the class sing?', 'f', [...w('M_ML_SIGN_FA_UP', 'd'), ...w('M_ML_SIGN_FA_UP', 'r'), ...w('M_ML_SIGN_FA_UP', 's')], 'The thumb down means f.'],
    ['Otieno\'s teacher shows a closed fist at waist height. Which note is it?', 'd', [...w('M_ML_SIGN_D_OPEN', 'm'), ...w('M_ML_SIGN_D_OPEN', 's'), ...w('M_ML_SIGN_D_OPEN', 'f')], 'A closed fist low is d.'],
    ['The teacher\'s hand rises step by step as the class sings. What does the rising hand show?', 'The notes are getting higher', [...w('M_ML_SIGN_SAME_HEIGHT', 'The class is getting louder'), ...w('M_ML_SIGN_SAME_HEIGHT', 'The class should stop'), ...w('M_ML_SIGN_SAME_HEIGHT', 'The notes stay the same')], 'The hand height follows the pitch.'],
    ['Amina sees a flat hand, palm down, at chest height. Which note is shown?', 'm', [...w('M_ML_SIGN_FA_UP', 'f'), ...w('M_ML_SIGN_D_OPEN', 'd'), ...w('M_ML_SIGN_FA_UP', 's')], 'A flat palm down is m.'],
    ['Kamau thinks every hand sign is shown at the same height. His teacher disagrees. Who is right?', 'The teacher: the hand goes higher with the pitch', [...w('M_ML_SIGN_SAME_HEIGHT', 'Kamau: all at the same height'), ...w('M_ML_SIGN_SAME_HEIGHT', 'Neither of them'), ...w('M_ML_SIGN_SAME_HEIGHT', 'Both of them')], 'Height shows pitch.'],
  ], { h: ['Think of shape and height.', 'Fist d, thumb down f, hand rises with pitch.'], s1: 'Decide which sign matches.' })),
  fam('ml.sg.spot', `${ML}SIGNS`, 'spot', 3, spot([
    sp('Njeri explains the signs. Which step has the mistake?', ['Step 1: d is a fist.', 'Step 2: f is a thumb pointing up.', 'Step 3: The hand rises with pitch.'], 1, 'f is a thumb pointing down.', 'M_ML_SIGN_FA_UP'),
    sp('Wekesa explains d. Which step has the mistake?', ['Step 1: He holds his hand low.', 'Step 2: He opens it flat.', 'Step 3: He says it is d.'], 1, 'd is a closed fist.', 'M_ML_SIGN_D_OPEN'),
    sp('Chebet explains height. Which step has the mistake?', ['Step 1: d is low.', 'Step 2: s is high.', 'Step 3: All signs are at the same height.'], 2, 'The hand rises as the pitch rises.', 'M_ML_SIGN_SAME_HEIGHT'),
    sp('Juma shows the signs. Which step has the mistake?', ['Step 1: Fist for d.', 'Step 2: Flat palm down for m.', 'Step 3: Thumb up for f.'], 2, 'f is a thumb pointing down.', 'M_ML_SIGN_FA_UP'),
    sp('Amina teaches d. Which step has the mistake?', ['Step 1: She holds her hand low.', 'Step 2: She makes an open hand for d.', 'Step 3: She says the class should sing d.'], 1, 'The sign for d is a closed fist.', 'M_ML_SIGN_D_OPEN'),
  ], { h: ['Check each step.', 'Fist d, thumb down f.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- ML.TECHNIQUES
  fam('ml.tq.name', `${ML}TECHNIQUES`, 'direct', 1, choose([
    ['A melody goes d r m. Which technique is used?', 'Stepwise motion', [...w('M_ML_STEP_LEAP', 'A narrow leap'), ...w('M_ML_REPEAT_NEW', 'Repetition of a pitch'), ...w('M_ML_END_SHORT', 'Ending on a short note')], 'Each note is next to the last: steps.'],
    ['A melody goes d m. Which technique is used?', 'A narrow leap', [...w('M_ML_STEP_LEAP', 'Stepwise motion'), ...w('M_ML_REPEAT_NEW', 'Repetition of a pitch'), ...w('M_ML_END_SHORT', 'A quick ending')], 'd to m skips r: a narrow leap.'],
    ['A melody goes s s s. Which technique is used?', 'Repetition of a pitch', [...w('M_ML_REPEAT_NEW', 'Stepwise motion'), ...w('M_ML_STEP_LEAP', 'A narrow leap'), ...w('M_ML_REPEAT_NEW', 'A new pitch each time')], 'The same pitch is sung again.'],
    ['How does a good melody usually end?', 'On a long note', [...w('M_ML_END_SHORT', 'On a short quick note'), ...w('M_ML_END_SHORT', 'On a rest only'), ...w('M_ML_END_SHORT', 'In the middle of a phrase')], 'A long note makes it sound finished.'],
    ['A melody goes m f s. Which technique is used?', 'Stepwise motion', [...w('M_ML_STEP_LEAP', 'A narrow leap'), ...w('M_ML_REPEAT_NEW', 'Repetition of a pitch'), ...w('M_ML_END_SHORT', 'Ending short')], 'Each note moves to the next syllable.'],
  ], { h: ['Is the next note next door, skipped, or the same?', 'Step, leap or repeat.'], s1: 'Look at how the notes move.' })),
  fam('ml.tq.story', `${ML}TECHNIQUES`, 'word', 2, choose([
    ['Njeri writes d m for her tune. Her friend calls it stepwise. Which word is better?', 'Narrow leap', [...w('M_ML_STEP_LEAP', 'Stepwise motion'), ...w('M_ML_REPEAT_NEW', 'Repetition'), ...w('M_ML_END_SHORT', 'Short ending')], 'Skipping r makes a narrow leap.'],
    ['Otieno writes m m m f m. What does the start of his tune use?', 'Repetition of a pitch', [...w('M_ML_REPEAT_NEW', 'Stepwise motion'), ...w('M_ML_STEP_LEAP', 'A narrow leap'), ...w('M_ML_REPEAT_NEW', 'Three new pitches')], 'm is repeated.'],
    ['Amina wants her tune to sound finished. How should she end it?', 'With a long note', [...w('M_ML_END_SHORT', 'With a short fast note'), ...w('M_ML_END_SHORT', 'With three quick notes'), ...w('M_ML_END_SHORT', 'In the middle of a phrase')], 'A long final note sounds finished.'],
    ['Kamau writes d r m f. His teacher says it is all one technique. Which?', 'Stepwise motion', [...w('M_ML_STEP_LEAP', 'Narrow leaps'), ...w('M_ML_REPEAT_NEW', 'Repetition'), ...w('M_ML_END_SHORT', 'Ending on a long note')], 'Each note is the next syllable.'],
    ['Zawadi writes r f in her tune. Which technique does she use between r and f?', 'A narrow leap', [...w('M_ML_STEP_LEAP', 'Stepwise motion'), ...w('M_ML_REPEAT_NEW', 'Repetition of a pitch'), ...w('M_ML_END_SHORT', 'A short ending')], 'r to f skips m.'],
  ], { h: ['Is the next note next door, skipped, or the same?', 'Step, leap or repeat.'], s1: 'Look at how the notes move.' })),
  fam('ml.tq.spot', `${ML}TECHNIQUES`, 'spot', 3, spot([
    sp('Njeri describes d m. Which step has the mistake?', ['Step 1: She sings d.', 'Step 2: She sings m.', 'Step 3: She says this is stepwise motion.'], 2, 'Skipping r is a narrow leap.', 'M_ML_STEP_LEAP'),
    sp('Wekesa describes m m. Which step has the mistake?', ['Step 1: The first note is m.', 'Step 2: The second note is m.', 'Step 3: He says each is a new pitch.'], 2, 'The same pitch twice is repetition.', 'M_ML_REPEAT_NEW'),
    sp('Chebet plans an ending. Which step has the mistake?', ['Step 1: She writes her tune.', 'Step 2: She ends on a short quick note.', 'Step 3: She says it sounds finished.'], 1, 'End on a long note.', 'M_ML_END_SHORT'),
    sp('Juma labels r f. Which step has the mistake?', ['Step 1: r is the second syllable.', 'Step 2: f is the fourth syllable.', 'Step 3: He calls it a step.'], 2, 'It skips m, so it is a narrow leap.', 'M_ML_STEP_LEAP'),
    sp('Amina labels s s s. Which step has the mistake?', ['Step 1: It is the same note.', 'Step 2: She sings it three times.', 'Step 3: She says it is a new pitch each time.'], 2, 'It is repetition of a pitch.', 'M_ML_REPEAT_NEW'),
  ], { h: ['Check each step.', 'Step, leap, repeat, long ending.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- RD.BAT
  fam('rd.bt.part', `${RD}BAT`, 'direct', 1, choose([
    ['Which part of a rounders bat hits the ball?', 'The head', [...w('M_RD_HEAD_HANDLE', 'The handle'), ...w('M_RD_KNOB_HITS', 'The knob'), ...w('M_RD_HEAD_HANDLE', 'The grip')], 'The head is the hitting part.'],
    ['Which part of the bat is held in the hand?', 'The handle and grip', [...w('M_RD_HEAD_HANDLE', 'The head'), ...w('M_RD_KNOB_HITS', 'The knob only'), ...w('M_RD_HEAD_HANDLE', 'The tip of the head')], 'The handle and grip are held.'],
    ['What does the knob at the end of the handle do?', 'Stops the bat slipping out of the hand', [...w('M_RD_KNOB_HITS', 'Hits the ball'), ...w('M_RD_KNOB_HITS', 'Makes the bat longer'), ...w('M_RD_KNOB_HITS', 'Measures the swing')], 'The knob helps the grip.'],
    ['What shape is a rounders bat?', 'Rounded and smooth', [...w('M_RD_CRICKET_FLAT', 'Flat like a cricket bat'), ...w('M_RD_CRICKET_FLAT', 'Square with sharp edges'), ...w('M_RD_CRICKET_FLAT', 'Pointed like a spear')], 'A rounders bat is rounded all round.'],
    ['Which part of a rounders bat is the thickest?', 'The head', [...w('M_RD_HEAD_HANDLE', 'The handle'), ...w('M_RD_KNOB_HITS', 'The knob'), ...w('M_RD_HEAD_HANDLE', 'The grip')], 'The head is the thicker hitting part.'],
  ], { h: ['Think: head hits, handle holds, knob stops slipping.', 'Rounded and smooth.'], s1: 'Name each part by its job.' })),
  fam('rd.bt.story', `${RD}BAT`, 'word', 2, choose([
    ['Njeri holds her rounders bat. Which part is she gripping?', 'The handle', [...w('M_RD_HEAD_HANDLE', 'The head'), ...w('M_RD_KNOB_HITS', 'The knob only'), ...w('M_RD_HEAD_HANDLE', 'The tip')], 'The handle is held.'],
    ['Otieno hits the ball with part of his bat. Which part?', 'The head', [...w('M_RD_HEAD_HANDLE', 'The handle'), ...w('M_RD_KNOB_HITS', 'The knob'), ...w('M_RD_HEAD_HANDLE', 'The grip')], 'The head hits the ball.'],
    ['Amina\'s bat keeps slipping from her hand. Which part helps stop this?', 'The knob', [...w('M_RD_KNOB_HITS', 'The head'), ...w('M_RD_HEAD_HANDLE', 'The tip of the head'), ...w('M_RD_CRICKET_FLAT', 'A flat face')], 'The knob helps the grip.'],
    ['Kamau says a rounders bat is flat like the cricket bat at his school. What should his teacher say?', 'A rounders bat is rounded', [...w('M_RD_CRICKET_FLAT', 'He is right'), ...w('M_RD_CRICKET_FLAT', 'It is flat on one side only'), ...w('M_RD_CRICKET_FLAT', 'It has sharp corners')], 'It is rounded and smooth.'],
    ['Zawadi says the head of the bat is where you hold it. Is she right?', 'No, the head hits the ball', [...w('M_RD_HEAD_HANDLE', 'Yes, you hold the head'), ...w('M_RD_HEAD_HANDLE', 'Yes, the head is the handle'), ...w('M_RD_KNOB_HITS', 'No, the knob hits the ball')], 'The head hits and the handle is held.'],
  ], { h: ['Think: head hits, handle holds, knob stops slipping.', 'Rounded and smooth.'], s1: 'Name each part by its job.' })),
  fam('rd.bt.spot', `${RD}BAT`, 'spot', 3, spot([
    sp('Wekesa describes the bat. Which step has the mistake?', ['Step 1: He holds the handle.', 'Step 2: He says the handle hits the ball.', 'Step 3: He swings.'], 1, 'The head hits the ball.', 'M_RD_HEAD_HANDLE'),
    sp('Chebet describes the knob. Which step has the mistake?', ['Step 1: The knob is at the end of the handle.', 'Step 2: She says it hits the ball.', 'Step 3: She says it helps the grip.'], 1, 'The knob stops the bat slipping.', 'M_RD_KNOB_HITS'),
    sp('Juma describes the bat shape. Which step has the mistake?', ['Step 1: He sees the bat.', 'Step 2: He says it is flat like a cricket bat.', 'Step 3: He swings it.'], 1, 'A rounders bat is rounded.', 'M_RD_CRICKET_FLAT'),
    sp('Njeri names the parts. Which step has the mistake?', ['Step 1: Knob at the end.', 'Step 2: Head hits the ball.', 'Step 3: She says the head is the part held.'], 2, 'The handle is held.', 'M_RD_HEAD_HANDLE'),
    sp('Amina explains the grip. Which step has the mistake?', ['Step 1: She holds the grip.', 'Step 2: She says the knob is for hitting.', 'Step 3: She hits with the head.'], 1, 'The knob stops slipping.', 'M_RD_KNOB_HITS'),
  ], { h: ['Check each step.', 'Head hits, handle holds.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- RD.CARVING
  fam('rd.cv.tool', `${RD}CARVING`, 'direct', 1, choose([
    ['Which tool makes a carved bat smooth?', 'Sandpaper', [...w('M_RD_SANDPAPER_CUTS', 'A saw'), ...w('M_RD_SANDPAPER_CUTS', 'A hammer'), ...w('M_RD_SANDPAPER_CUTS', 'A spoon')], 'Sandpaper smooths the wood.'],
    ['Which tool cuts the wood to length?', 'A saw', [...w('M_RD_SANDPAPER_CUTS', 'Sandpaper'), ...w('M_RD_SANDPAPER_CUTS', 'A brush'), ...w('M_RD_SANDPAPER_CUTS', 'A cloth')], 'A saw cuts wood.'],
    ['Which is the safe way to carve?', 'Cut away from your body', [...w('M_RD_CUT_TOWARD_BODY', 'Cut towards your body'), ...w('M_RD_CUT_TOWARD_BODY', 'Cut towards your friend'), ...w('M_RD_CUT_TOWARD_BODY', 'Cut with your eyes closed')], 'A slip will then miss you.'],
    ['Which wood suits a bat?', 'Dry hardwood', [...w('M_RD_FRESH_WOOD', 'Fresh wet wood'), ...w('M_RD_FRESH_WOOD', 'Soft green wood'), ...w('M_RD_FRESH_WOOD', 'A wet banana stem')], 'Dry hardwood is strong and does not crack.'],
    ['Why should the wood be held steady while carving?', 'So the tool does not slip', [...w('M_RD_CUT_TOWARD_BODY', 'So the wood stays cold'), ...w('M_RD_CUT_TOWARD_BODY', 'So it sings'), ...w('M_RD_CUT_TOWARD_BODY', 'So it dries')], 'A steady piece is safer.'],
  ], { h: ['Think: saw cuts, sandpaper smooths, cut away from you.', 'Dry hardwood.'], s1: 'Match tools to jobs.' })),
  fam('rd.cv.story', `${RD}CARVING`, 'word', 2, choose([
    ['Njeri wants her bat handle smooth so it does not give her splinters. What does she use?', 'Sandpaper', [...w('M_RD_SANDPAPER_CUTS', 'A saw'), ...w('M_RD_SANDPAPER_CUTS', 'A stone'), ...w('M_RD_SANDPAPER_CUTS', 'A hammer')], 'Sandpaper smooths.'],
    ['Otieno starts carving towards his stomach. His teacher stops him. What should he do?', 'Carve away from his body', [...w('M_RD_CUT_TOWARD_BODY', 'Carve faster'), ...w('M_RD_CUT_TOWARD_BODY', 'Carve towards his leg'), ...w('M_RD_CUT_TOWARD_BODY', 'Close his eyes')], 'Cut away from the body.'],
    ['Amina finds a freshly cut green branch. Is it good for a bat?', 'No, it will crack as it dries', [...w('M_RD_FRESH_WOOD', 'Yes, fresh wood is best'), ...w('M_RD_FRESH_WOOD', 'Yes, it is soft'), ...w('M_RD_FRESH_WOOD', 'Yes, it is heavy')], 'Use dry hardwood.'],
    ['Kamau must shorten a long piece of wood. Which tool does he ask for?', 'A saw', [...w('M_RD_SANDPAPER_CUTS', 'Sandpaper'), ...w('M_RD_SANDPAPER_CUTS', 'A comb'), ...w('M_RD_SANDPAPER_CUTS', 'A ruler')], 'A saw cuts.'],
    ['Zawadi carves with an adult watching. Why is this a good idea?', 'Tools can slip and hurt', [...w('M_RD_CUT_TOWARD_BODY', 'The wood is shy'), ...w('M_RD_CUT_TOWARD_BODY', 'It makes carving faster'), ...w('M_RD_CUT_TOWARD_BODY', 'It cools the wood')], 'An adult keeps carving safe.'],
  ], { h: ['Saw cuts, sandpaper smooths, cut away from you.', 'Dry hardwood.'], s1: 'Decide what the job needs.' })),
  fam('rd.cv.spot', `${RD}CARVING`, 'spot', 3, spot([
    sp('Wekesa explains carving. Which step has the mistake?', ['Step 1: He picks dry hardwood.', 'Step 2: He cuts towards his body.', 'Step 3: He sands it smooth.'], 1, 'Always cut away from your body.', 'M_RD_CUT_TOWARD_BODY'),
    sp('Chebet explains tools. Which step has the mistake?', ['Step 1: A saw cuts to length.', 'Step 2: She says sandpaper cuts to length.', 'Step 3: Sandpaper smooths.'], 1, 'A saw cuts. Sandpaper smooths.', 'M_RD_SANDPAPER_CUTS'),
    sp('Juma picks wood. Which step has the mistake?', ['Step 1: He wants a strong bat.', 'Step 2: He picks fresh green wood.', 'Step 3: He starts carving.'], 1, 'Fresh wood bends and cracks. Use dry hardwood.', 'M_RD_FRESH_WOOD'),
    sp('Amina plans carving. Which step has the mistake?', ['Step 1: Saw to length.', 'Step 2: Shape the head.', 'Step 3: Use a saw to smooth the surface.'], 2, 'Sandpaper smooths the surface.', 'M_RD_SANDPAPER_CUTS'),
    sp('Njeri sets up. Which step has the mistake?', ['Step 1: She holds the wood steady.', 'Step 2: She carves towards herself.', 'Step 3: An adult watches.'], 1, 'Carve away from the body.', 'M_RD_CUT_TOWARD_BODY'),
  ], { h: ['Check each step.', 'Saw cuts, sandpaper smooths, cut away.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- RD.SAFETY
  fam('rd.sf.rule', `${RD}SAFETY`, 'direct', 1, choose([
    ['Which of these is the safety rule for the bat once the ball is hit?', 'Put it down and run', [...w('M_RD_THROW_BAT', 'Throw it away and run'), ...w('M_RD_THROW_BAT', 'Swing it as they run'), ...w('M_RD_THROW_BAT', 'Hit the ground with it')], 'Never throw the bat.'],
    ['Which is the safety rule about where waiting players stand?', 'Well away from the batter', [...w('M_RD_STAND_CLOSE', 'Close beside the batter'), ...w('M_RD_STAND_CLOSE', 'Just behind the batter'), ...w('M_RD_STAND_CLOSE', 'In front of the batter')], 'Stay away from the swing.'],
    ['Which is the safety rule for bowling the ball?', 'Underarm', [...w('M_RD_BOWL_AT_PERSON', 'Hard at the batter\'s body'), ...w('M_RD_BOWL_AT_PERSON', 'Overarm as fast as possible'), ...w('M_RD_BOWL_AT_PERSON', 'At the head')], 'Underarm to the batter is safe.'],
    ['Which is the safety rule about swinging the bat?', 'When nobody is close', [...w('M_RD_STAND_CLOSE', 'When friends are beside you'), ...w('M_RD_THROW_BAT', 'Any time you like'), ...w('M_RD_STAND_CLOSE', 'When a friend is walking past')], 'Swing only when the space is clear.'],
    ['Which is the safety rule for throwing at the base?', 'Throw it to a base, not at a person', [...w('M_RD_BOWL_AT_PERSON', 'Throw it hard at a runner'), ...w('M_RD_BOWL_AT_PERSON', 'Throw it at the batter\'s legs'), ...w('M_RD_BOWL_AT_PERSON', 'Kick it at others')], 'Never throw hard at a person.'],
  ], { h: ['Think about who could be hurt.', 'Put down the bat, stay away, bowl underarm.'], s1: 'Picture the game and who is near.' })),
  fam('rd.sf.story', `${RD}SAFETY`, 'word', 2, choose([
    ['In a school rounders match, Njeri smacks the ball past the fielders and sets off for first post with the bat still in her hand. What is the safe thing for her to do with it?', 'Drop it safely and run', [...w('M_RD_THROW_BAT', 'Throw it over her shoulder'), ...w('M_RD_THROW_BAT', 'Carry it and swing it'), ...w('M_RD_THROW_BAT', 'Throw it to a friend')], 'Put the bat down.'],
    ['Otieno is waiting for his turn to bat and wants a closer look at the next swing. Which spot is the safe one for him?', 'Well back, behind the line', [...w('M_RD_STAND_CLOSE', 'Right beside the batter'), ...w('M_RD_STAND_CLOSE', 'One step from the bat'), ...w('M_RD_STAND_CLOSE', 'In front of the post')], 'Stay clear of the bat.'],
    ['Amina is picked as the bowler for her team and the batter is ready. What does she do with the ball?', 'Underarm to the batter', [...w('M_RD_BOWL_AT_PERSON', 'Hard at the batter\'s body'), ...w('M_RD_BOWL_AT_PERSON', 'Overarm as hard as she can'), ...w('M_RD_BOWL_AT_PERSON', 'At the batter\'s head')], 'Bowl underarm.'],
    ['Kamau practises swings while friends stand next to him. What should he do?', 'Ask them to move back first', [...w('M_RD_STAND_CLOSE', 'Swing harder'), ...w('M_RD_STAND_CLOSE', 'Swing slowly beside them'), ...w('M_RD_STAND_CLOSE', 'Swing with his eyes closed')], 'Clear the space first.'],
    ['Zawadi wants to get a runner out. What is the safe way?', 'Throw the ball to the base', [...w('M_RD_BOWL_AT_PERSON', 'Throw it hard at the runner'), ...w('M_RD_BOWL_AT_PERSON', 'Throw it at the runner\'s head'), ...w('M_RD_BOWL_AT_PERSON', 'Run into the runner')], 'Aim at the base, not at the person.'],
  ], { h: ['Think about who could be hurt.', 'Put down the bat, stay away, bowl underarm.'], s1: 'Decide the safe action.' })),
  fam('rd.sf.spot', `${RD}SAFETY`, 'spot', 3, spot([
    sp('Wekesa explains batting. Which step has the mistake?', ['Step 1: He hits the ball.', 'Step 2: He throws the bat away.', 'Step 3: He runs.'], 1, 'Put the bat down and never throw it.', 'M_RD_THROW_BAT'),
    sp('Chebet explains fielding. Which step has the mistake?', ['Step 1: She waits for her turn.', 'Step 2: She stands right next to the batter.', 'Step 3: She watches the ball.'], 1, 'Stand well away from the batter.', 'M_RD_STAND_CLOSE'),
    sp('Juma explains bowling. Which step has the mistake?', ['Step 1: He faces the batter.', 'Step 2: He throws hard at the batter\'s body.', 'Step 3: He watches.'], 1, 'Bowl underarm to the batter.', 'M_RD_BOWL_AT_PERSON'),
    sp('Amina describes warm-up. Which step has the mistake?', ['Step 1: She checks the space is clear.', 'Step 2: She tells friends to move back.', 'Step 3: She throws the bat when she finishes.'], 2, 'Never throw the bat.', 'M_RD_THROW_BAT'),
    sp('Njeri describes the batting post. Which step has the mistake?', ['Step 1: One batter stands there.', 'Step 2: Others stand behind the line.', 'Step 3: A friend stands beside the batter to watch.'], 2, 'Stay well away from the batter.', 'M_RD_STAND_CLOSE'),
  ], { h: ['Check each step.', 'Put down the bat, stay away, bowl underarm.'], s1: 'Find the step that is not safe.' })),
];
