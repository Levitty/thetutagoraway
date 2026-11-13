// ============================================================================
// GRADE 6 SCIENCE AND TECHNOLOGY, FORCE AND ENERGY (12 skills): Light, Levers as Simple Machines, Slopes as Simple Machines.
// Written offline from the KICD 2024 design through the curriculum map (curriculum/science/g6.json). Every wrong answer names the
// library misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, c, sp } from './science_g6_lib.js';

const LT = 'FORCE_.LIGHT.', LV = 'FORCE_.LEVERS_AS_SIMPLE_MACHINE.', SL = 'FORCE_.SLOPES_AS_SIMPLE_MACHINE.';

export const FAMILIES = [
  // ---------------------------------------------------------------- LIGHT_MATERIALS
  fam('lt.mat.direct', `${LT}LIGHT_MATERIALS`, 'direct', 1, choose([
    c('Clear window glass lets you see a friend on the other side without a blur. What kind of material is it?', 'Transparent', 'Transparent materials let nearly all light through.', ['M_LM_TRANSLUCENT_TRANSPARENT', 'Translucent', 'Opaque'], ['M_LM_GLASS_ALWAYS', 'All glass is opaque']),
    c('Frosted glass lets some light through but you cannot see clearly. What is it?', 'Translucent', 'Translucent materials let some light through.', ['M_LM_TRANSLUCENT_TRANSPARENT', 'Transparent', 'Opaque'], ['M_LM_COLOUR_OPAQUE', 'Coloured']),
    c('A wooden door lets no light through. What is it?', 'Opaque', 'Opaque materials block all light.', ['M_LM_COLOUR_OPAQUE', 'Translucent', 'Transparent'], ['M_LM_GLASS_ALWAYS', 'It depends on the colour']),
    c('A red plastic sheet lets light through and shows a blurred shape. What is it?', 'Translucent', 'Colour does not decide. The amount of light that passes does.', ['M_LM_COLOUR_OPAQUE', 'Opaque, because it is coloured', 'Opaque, because plastic is opaque'], ['M_LM_TRANSLUCENT_TRANSPARENT', 'Transparent']),
    c('Which of these is translucent?', 'Tracing paper', 'It lets some light through.', ['M_LM_GLASS_ALWAYS', 'A brick', 'Thick cardboard'], ['M_LM_TRANSLUCENT_TRANSPARENT', 'Clear water']),
  ], { h: ['Transparent: all through. Translucent: some. Opaque: none.', 'Colour does not decide.'], s1: 'Decide how much light passes through.' })),
  fam('lt.mat.story', `${LT}LIGHT_MATERIALS`, 'word', 2, choose([
    c('Aisha looks at a friend through a clear plastic bag and sees her clearly. What is the bag?', 'Transparent', 'She can see clearly.', ['M_LM_TRANSLUCENT_TRANSPARENT', 'Translucent', 'Opaque'], ['M_LM_COLOUR_OPAQUE', 'Opaque because it is plastic']),
    c('A bathroom window lets in light but nobody can see through it clearly. What is the glass?', 'Translucent', 'It lets some light through only.', ['M_LM_TRANSLUCENT_TRANSPARENT', 'Transparent', 'Opaque'], ['M_LM_GLASS_ALWAYS', 'Opaque']),
    c('Ken says all glass is transparent. Which glass shows he is wrong?', 'Frosted bathroom glass', 'Frosted glass is translucent.', ['M_LM_GLASS_ALWAYS', 'A clear window', 'A clear bottle'], ['M_LM_TRANSLUCENT_TRANSPARENT', 'Clear water']),
    c('Njeri says coloured cellophane is opaque because it is coloured. What can you tell her?', 'It lets light through, so it is not opaque', 'Colour does not decide.', ['M_LM_COLOUR_OPAQUE', 'She is right', 'It is transparent only if it is not coloured'], ['M_LM_TRANSLUCENT_TRANSPARENT', 'It must be transparent']),
    c('A thick wall casts no light to the other side. What kind of material is it?', 'Opaque', 'It blocks all light.', ['M_LM_COLOUR_OPAQUE', 'Translucent', 'Transparent'], ['M_LM_GLASS_ALWAYS', 'Glass']),
  ], { h: ['Think how much light gets through.', 'Colour does not decide.'], s1: 'Decide which kind of material is in the story.' })),
  fam('lt.mat.spot', `${LT}LIGHT_MATERIALS`, 'spot', 3, spot([
    sp('Pete says all coloured things are opaque. Which step has the mistake?', 'Step 1: Pete holds coloured cellophane to a window.', 'Step 2: Light comes through.', 'Step 3: He says it is opaque because it is coloured.', 'Opaque means no light passes through. Colour does not decide.', 'M_LM_COLOUR_OPAQUE'),
    sp('Lisa says frosted glass is transparent. Which step has the mistake?', 'Step 1: Lisa looks at a bathroom window.', 'Step 2: She can see only a blur.', 'Step 3: She says it is transparent.', 'Frosted glass is translucent.', 'M_LM_TRANSLUCENT_TRANSPARENT'),
    sp('Tom says all glass is transparent. Which step has the mistake?', 'Step 1: Tom looks through a clear window.', 'Step 2: He sees clearly.', 'Step 3: He says every kind of glass is the same.', 'Frosted glass is translucent.', 'M_LM_GLASS_ALWAYS'),
    sp('Jane says tissue paper is opaque. Which step has the mistake?', 'Step 1: Jane holds tissue paper to the window.', 'Step 2: Some light comes through.', 'Step 3: She says it is opaque.', 'It is translucent.', 'M_LM_GLASS_ALWAYS'),
    sp('Vic says transparent and translucent mean the same. Which step has the mistake?', 'Step 1: Vic looks through clear glass.', 'Step 2: He looks through frosted glass.', 'Step 3: He says both show things equally clearly.', 'Transparent shows things clearly. Translucent shows a blur.', 'M_LM_TRANSLUCENT_TRANSPARENT'),
  ], { h: ['Which step mixes up the kinds of material?', 'Transparent, translucent, opaque.'], s1: 'Check each step against the kinds of material.' })),

  // ---------------------------------------------------------------- SHADOWS
  fam('lt.sh.direct', `${LT}SHADOWS`, 'direct', 1, choose([
    c('What makes a shadow?', 'An object blocking light', 'A shadow is where light cannot reach.', ['M_SD_MADE_BY_OBJECT', 'The object makes it', 'The ground makes it'], ['M_SD_SIDE', 'The torch makes it']),
    c('A torch is on the left of a ball. On which side does the shadow fall?', 'The right, away from the torch', 'Light travels in straight lines.', ['M_SD_SIDE', 'The left, beside the torch', 'Above the ball'], ['M_SD_SIZE', 'Under the ball']),
    c('What happens to a shadow when the object moves closer to the torch?', 'It becomes larger', 'A closer object blocks more light.', ['M_SD_SIZE', 'It becomes smaller', 'It stays exactly the same'], ['M_SD_MADE_BY_OBJECT', 'It disappears']),
    c('Which of these makes a clear dark shadow?', 'A wooden board', 'An opaque object blocks the light.', ['M_SD_MADE_BY_OBJECT', 'A clear window', 'Clean water'], ['M_SD_SIDE', 'Air']),
    c('What happens to a shadow if the light is switched off?', 'It disappears', 'No light means no shadow.', ['M_SD_MADE_BY_OBJECT', 'It stays because the object makes it', 'It gets darker'], ['M_SD_SIZE', 'It gets bigger']),
  ], { h: ['Light travels in straight lines.', 'An opaque object blocks the light.'], s1: 'Think about the path of the light.' })),
  fam('lt.sh.story', `${LT}SHADOWS`, 'word', 2, choose([
    c('In the afternoon the Sun is in the west. On which side of a tree does the shadow fall?', 'The east side, away from the Sun', 'The shadow is away from the light.', ['M_SD_SIDE', 'The west side', 'Under the tree only, near the trunk'], ['M_SD_MADE_BY_OBJECT', 'The tree makes it']),
    c('Wanjiru moves her hand closer to a torch pointing at the wall. What happens to the shadow?', 'It gets bigger', 'A closer object gives a larger shadow.', ['M_SD_SIZE', 'It gets smaller', 'It stays the same'], ['M_SD_MADE_BY_OBJECT', 'It disappears']),
    c('Ouma says the shadow is a part of him that follows him. What is true?', 'It is the place his body blocks the light', 'Light is blocked.', ['M_SD_MADE_BY_OBJECT', 'He is right', 'It is a part of his clothes that follows him'], ['M_SD_SIDE', 'It is a copy that shines']),
    c('Why is there no shadow on a cloudy day?', 'There is no strong light from one direction', 'A shadow needs a clear light source.', ['M_SD_MADE_BY_OBJECT', 'Objects stop making shadows', 'The shadow is hidden under the grey cloud'], ['M_SD_SIDE', 'The shadow falls upwards']),
    c('A glass window and a wooden door stand in the sun. Which one makes a darker shadow?', 'The wooden door', 'It is opaque.', ['M_SD_MADE_BY_OBJECT', 'The glass window', 'Both the same'], ['M_SD_SIZE', 'The window, because it is bigger']),
  ], { h: ['Light travels in straight lines and an opaque object blocks it.', 'Closer to the light means a bigger shadow.'], s1: 'Draw the light going past the object.' })),
  fam('lt.sh.spot', `${LT}SHADOWS`, 'spot', 3, spot([
    sp('Abdi says the shadow is made by the object. Which step has the mistake?', 'Step 1: Abdi stands in the sun.', 'Step 2: He sees his shadow.', 'Step 3: He says he makes the shadow by himself.', 'The shadow is where he blocks the light.', 'M_SD_MADE_BY_OBJECT'),
    sp('Bea says the shadow is on the same side as the light. Which step has the mistake?', 'Step 1: Bea holds a torch on her left.', 'Step 2: The torch points at a ball.', 'Step 3: She says the shadow falls on her left.', 'The shadow falls away from the light.', 'M_SD_SIDE'),
    sp('Cal says a closer object has a smaller shadow. Which step has the mistake?', 'Step 1: Cal moves a book closer to a torch.', 'Step 2: The shadow changes.', 'Step 3: He says it is smaller.', 'The shadow is larger when the object is closer.', 'M_SD_SIZE'),
    sp('Dee says a clear window gives a dark shadow. Which step has the mistake?', 'Step 1: Dee puts a window in the sun.', 'Step 2: Light goes through.', 'Step 3: She says the shadow is dark.', 'A transparent object does not block the light.', 'M_SD_MADE_BY_OBJECT'),
    sp('Eli says if you move the torch the shadow stays in place. Which step has the mistake?', 'Step 1: Eli moves the torch to the right.', 'Step 2: He keeps the ball in place.', 'Step 3: He says the shadow does not move.', 'The shadow is always away from the light.', 'M_SD_SIDE'),
  ], { h: ['Which step has a wrong idea about shadows?', 'Shadows fall away from the light.'], s1: 'Check each step against how shadows form.' })),

  // ---------------------------------------------------------------- ECLIPSES
  fam('lt.ec.direct', `${LT}ECLIPSES`, 'direct', 1, choose([
    c('What causes a solar eclipse?', 'The Moon moves between the Sun and the Earth', 'The Moon blocks the Sun\'s light.', ['M_EC_CLOUD', 'Thick clouds cover the Sun', 'The night comes early'], ['M_EC_SWAP', 'The Earth is between the Sun and the Moon']),
    c('In a lunar eclipse, which body is in the middle?', 'The Earth', 'The Earth\'s shadow falls on the Moon.', ['M_EC_SWAP', 'The Moon', 'The Sun'], ['M_EC_CLOUD', 'A cloud']),
    c('How can a learner watch a solar eclipse safely?', 'Use a pinhole projector or special eclipse glasses', 'Never look at the Sun.', ['M_EC_SAFE', 'Look straight at it, but only for a short time', 'Look through dark glass'], ['M_EC_CLOUD', 'Look through a cloud']),
    c('In a solar eclipse, whose shadow falls on the Earth?', 'The Moon\'s', 'The Moon blocks the light.', ['M_EC_SWAP', 'The Earth\'s', 'A cloud\'s'], ['M_EC_CLOUD', 'The night\'s']),
    c('In a lunar eclipse, whose shadow falls on the Moon?', 'The Earth\'s', 'The Earth blocks the Sun\'s light.', ['M_EC_SWAP', 'The Sun\'s', 'The Moon\'s'], ['M_EC_CLOUD', 'A cloud\'s']),
  ], { h: ['Solar: Moon in the middle. Lunar: Earth in the middle.', 'Never look at the Sun.'], s1: 'Put the Sun, Moon and Earth in a line.' })),
  fam('lt.ec.story', `${LT}ECLIPSES`, 'word', 2, choose([
    c('At midday the sky turns dark for about three minutes and a round black shape covers the Sun. What is happening?', 'A solar eclipse', 'The Moon covers the Sun.', ['M_EC_CLOUD', 'A thick cloud', 'An early night'], ['M_EC_SWAP', 'A lunar eclipse']),
    c('The full Moon turns dark red at night when the Earth is between it and the Sun. What is this?', 'A lunar eclipse', 'The Earth\'s shadow falls on the Moon.', ['M_EC_SWAP', 'A solar eclipse', 'A cloud'], ['M_EC_CLOUD', 'A storm']),
    c('Njoki wants to look at the eclipse through sunglasses. What should she do?', 'Use a pinhole projector instead', 'Sunglasses are not safe for looking at the Sun.', ['M_EC_SAFE', 'Look through the sunglasses', 'Squint'], ['M_EC_CLOUD', 'Wait for a cloud']),
    c('Ken says eclipses are caused by clouds. What is true?', 'They are caused by the Moon or the Earth blocking light', 'Eclipses are shadows of the Moon or Earth.', ['M_EC_CLOUD', 'He is right', 'Birds cause them'], ['M_EC_SWAP', 'They are caused by the Sun moving across the sky']),
    c('Which sequence is right for a solar eclipse?', 'Sun, Moon, Earth', 'The Moon is in the middle.', ['M_EC_SWAP', 'Sun, Earth, Moon', 'Moon, Sun, Earth'], ['M_EC_CLOUD', 'Cloud, Sun, Earth']),
  ], { h: ['Solar: Sun, Moon, Earth. Lunar: Sun, Earth, Moon.', 'Eclipse viewing needs safe tools.'], s1: 'Decide which body is in the middle.' })),
  fam('lt.ec.spot', `${LT}ECLIPSES`, 'spot', 3, spot([
    sp('Arun says a solar eclipse is caused by clouds. Which step has the mistake?', 'Step 1: Arun sees the sky go dark.', 'Step 2: He remembers clouds.', 'Step 3: He says clouds caused the eclipse.', 'The Moon blocks the Sun.', 'M_EC_CLOUD'),
    sp('Bo says the Moon is in the middle in a lunar eclipse. Which step has the mistake?', 'Step 1: Bo draws the Sun, Earth and Moon.', 'Step 2: He draws them in a line.', 'Step 3: He says the Moon is in the middle.', 'In a lunar eclipse the Earth is in the middle.', 'M_EC_SWAP'),
    sp('Cy says it is safe to look at an eclipse for a short time. Which step has the mistake?', 'Step 1: Cy sees the Sun partly covered.', 'Step 2: It looks less bright.', 'Step 3: He says it is safe to look.', 'Never look at the Sun, even in an eclipse.', 'M_EC_SAFE'),
    sp('Di says the Earth is in the middle in a solar eclipse. Which step has the mistake?', 'Step 1: Di draws a solar eclipse.', 'Step 2: She puts the Sun on the left.', 'Step 3: She puts the Earth in the middle.', 'In a solar eclipse the Moon is in the middle.', 'M_EC_SWAP'),
    sp('Ed says dark sunglasses make eclipse watching safe. Which step has the mistake?', 'Step 1: Ed puts on sunglasses.', 'Step 2: He looks at the Sun.', 'Step 3: He says they protect his eyes.', 'Only special eclipse glasses or a pinhole projector are safe.', 'M_EC_SAFE'),
  ], { h: ['Which step mixes up solar and lunar eclipses or gives unsafe advice?', 'Never look at the Sun.'], s1: 'Check each step against how eclipses form.' })),

  // ---------------------------------------------------------------- MIRROR_RULE
  fam('lt.mr.direct', `${LT}MIRROR_RULE`, 'direct', 1, choose([
    c('A ray hits a plane mirror at 30 degrees to the normal. At what angle to the normal does it leave?', '30 degrees', 'The angle of reflection equals the angle of incidence.', ['M_MR_NOT_EQUAL', '60 degrees', '90 degrees'], ['M_MR_FROM_SURFACE', '120 degrees']),
    c('A ray makes 30 degrees with the mirror surface. What is the angle of incidence?', '60 degrees', 'The normal is at 90 degrees to the surface, so 90 minus 30 is 60.', ['M_MR_FROM_SURFACE', '30 degrees', '120 degrees'], ['M_MR_NOT_EQUAL', '90 degrees']),
    c('What does a plane mirror do to light?', 'It bounces the light off its surface', 'It reflects light.', ['M_MR_ABSORB', 'It absorbs the light', 'It lets all light through'], ['M_MR_NOT_EQUAL', 'It turns the light by 90 degrees']),
    c('From which line are the angles of incidence and reflection measured?', 'The normal', 'The normal is at right angles to the mirror.', ['M_MR_FROM_SURFACE', 'The mirror surface', 'The edge of the frame'], ['M_MR_NOT_EQUAL', 'The ray itself']),
    c('A ray hits a mirror at an angle of incidence of 45 degrees. What is the angle of reflection?', '45 degrees', 'The two angles are equal.', ['M_MR_NOT_EQUAL', '90 degrees', '135 degrees'], ['M_MR_FROM_SURFACE', '30 degrees']),
  ], { h: ['Angle of incidence = angle of reflection.', 'Measure from the normal.'], s1: 'Draw the normal at right angles to the mirror.' })),
  fam('lt.mr.story', `${LT}MIRROR_RULE`, 'word', 2, choose([
    c('Mwajuma shines a torch at a mirror so the ray makes 40 degrees with the normal. At what angle does the reflected ray leave?', '40 degrees', 'Equal angles.', ['M_MR_NOT_EQUAL', '50 degrees', '80 degrees'], ['M_MR_FROM_SURFACE', '140 degrees']),
    c('Ken measures that a ray makes 20 degrees with the mirror surface. What is the angle of incidence?', '70 degrees', '90 minus 20 is 70.', ['M_MR_FROM_SURFACE', '20 degrees', '160 degrees'], ['M_MR_NOT_EQUAL', '40 degrees']),
    c('A learner says the mirror soaks up some of the light. What is true?', 'A plane mirror reflects the light that reaches it', 'It sends the light back.', ['M_MR_ABSORB', 'She is right, it absorbs light', 'It lets light through'], ['M_MR_NOT_EQUAL', 'It makes the light turn by double the angle']),
    c('The reflected ray makes 55 degrees with the normal. What was the angle of incidence?', '55 degrees', 'The two angles are equal.', ['M_MR_NOT_EQUAL', '35 degrees', '110 degrees'], ['M_MR_FROM_SURFACE', '125 degrees']),
    c('Why is a dotted normal line drawn in a ray diagram?', 'To measure the angles from it', 'The angles are measured from the normal.', ['M_MR_FROM_SURFACE', 'To show the mirror surface', 'To show the ray path'], ['M_MR_NOT_EQUAL', 'To make the angles different']),
  ], { h: ['Angles of incidence and reflection are equal.', 'Measure from the normal, not from the mirror.'], s1: 'Find the angle from the normal.' })),
  fam('lt.mr.spot', `${LT}MIRROR_RULE`, 'spot', 3, spot([
    sp('Fay says a ray at 30 degrees to the normal leaves at 60 degrees. Which step has the mistake?', 'Step 1: Fay draws the normal.', 'Step 2: She draws a ray at 30 degrees to it.', 'Step 3: She draws the reflected ray at 60 degrees to the normal.', 'The angle of reflection equals the angle of incidence.', 'M_MR_NOT_EQUAL'),
    sp('Gus says a ray at 30 degrees to the surface has an incidence angle of 30 degrees. Which step has the mistake?', 'Step 1: Gus measures from the mirror surface.', 'Step 2: He gets 30 degrees.', 'Step 3: He says that is the angle of incidence.', 'The angle of incidence is measured from the normal, so it is 60 degrees.', 'M_MR_FROM_SURFACE'),
    sp('Hal says a mirror absorbs light. Which step has the mistake?', 'Step 1: Hal shines a torch at a mirror.', 'Step 2: A spot of light shows on the wall.', 'Step 3: He says the mirror absorbed the light.', 'The mirror reflected the light.', 'M_MR_ABSORB'),
    sp('Ida says the angle of reflection is double the angle of incidence. Which step has the mistake?', 'Step 1: Ida draws a ray at 25 degrees.', 'Step 2: She draws the normal.', 'Step 3: She says the reflected ray is at 50 degrees.', 'Both angles are equal.', 'M_MR_NOT_EQUAL'),
    sp('Jon measures angles from the mirror. Which step has the mistake?', 'Step 1: Jon draws a mirror and a ray.', 'Step 2: He measures from the mirror surface.', 'Step 3: He says this is the angle of incidence.', 'The angle of incidence is measured from the normal.', 'M_MR_FROM_SURFACE'),
  ], { h: ['Which step breaks the law of reflection?', 'Angles are equal and measured from the normal.'], s1: 'Check each step against the law of reflection.' })),

  // ---------------------------------------------------------------- MIRROR_IMAGE
  fam('lt.mi.direct', `${LT}MIRROR_IMAGE`, 'direct', 1, choose([
    c('How big is the image of a pupil in a plane mirror?', 'The same size as the pupil', 'A plane mirror gives an image of the same size.', ['M_MI_SIZE', 'Smaller than the pupil', 'Larger than the pupil'], ['M_MI_UPSIDE', 'Half the size']),
    c('A pupil stands 2 metres in front of a plane mirror. How far behind the mirror is the image?', '2 metres', 'The image is as far behind as the object is in front.', ['M_MI_DISTANCE', '1 metre', '4 metres'], ['M_MI_SIZE', '0 metres, on the mirror']),
    c('What happens to left and right in a plane mirror image?', 'They swap, but the image is upright', 'This is lateral inversion.', ['M_MI_UPSIDE', 'They stay the same and the image is upside down', 'The image is upside down'], ['M_MI_SIZE', 'They stay the same']),
    c('Where does the image in a plane mirror seem to be?', 'Behind the mirror', 'The image appears to be behind the mirror.', ['M_MI_DISTANCE', 'On the surface of the mirror', 'In front of the mirror'], ['M_MI_SIZE', 'Inside the glass']),
    c('Can the image in a plane mirror be caught on a screen?', 'No, it is a virtual image', 'Light does not really reach the image.', ['M_MI_DISTANCE', 'Yes, on a screen behind the mirror', 'Yes, on a screen in front'], ['M_MI_UPSIDE', 'Yes, it is upside down']),
  ], { h: ['The image is the same size and as far behind as the object is in front.', 'Left and right swap.'], s1: 'Think about where the image appears.' })),
  fam('lt.mi.story', `${LT}MIRROR_IMAGE`, 'word', 2, choose([
    c('Aisha stands 3 metres from a mirror. How far is she from her image?', '6 metres', '3 metres to the mirror and 3 behind it.', ['M_MI_DISTANCE', '3 metres', '1.5 metres'], ['M_MI_SIZE', '0 metres']),
    c('A word on a card reads left to right. In a mirror, what happens to the letters?', 'They are swapped left and right, upright', 'Lateral inversion.', ['M_MI_UPSIDE', 'They are turned upside down as well', 'They stay the same'], ['M_MI_SIZE', 'They get smaller']),
    c('Njoki is 1.4 metres tall. How tall is her image?', '1.4 metres', 'The image is the same size.', ['M_MI_SIZE', '0.7 metres', '2.8 metres'], ['M_MI_DISTANCE', '1 metre']),
    c('Ouma steps closer to a mirror. What happens to the distance of his image behind the mirror?', 'It gets smaller by the same amount', 'Image distance equals object distance.', ['M_MI_DISTANCE', 'It stays the same', 'It gets larger'], ['M_MI_SIZE', 'The image gets smaller as he gets closer']),
    c('Ken says his image is upside down. What is true?', 'It is upright, but left and right swap', 'A plane mirror does not turn the image upside down.', ['M_MI_UPSIDE', 'He is right', 'It is turned on its side like a book'], ['M_MI_SIZE', 'It is smaller']),
  ], { h: ['Image: same size, upright, as far behind as the object is in front.', 'Left and right swap.'], s1: 'Use the facts about plane mirror images.' })),
  fam('lt.mi.spot', `${LT}MIRROR_IMAGE`, 'spot', 3, spot([
    sp('Kai says the image is smaller than the object. Which step has the mistake?', 'Step 1: Kai stands before a mirror.', 'Step 2: He sees his image.', 'Step 3: He says it is smaller than he is.', 'The image is the same size.', 'M_MI_SIZE'),
    sp('Lou says the image is on the surface of the mirror. Which step has the mistake?', 'Step 1: Lou touches the glass.', 'Step 2: His image seems to be on the other side.', 'Step 3: He says it is on the glass.', 'The image is as far behind the mirror as the object is in front.', 'M_MI_DISTANCE'),
    sp('Mo says the image is upside down. Which step has the mistake?', 'Step 1: Mo looks at his face in a mirror.', 'Step 2: His head is at the top.', 'Step 3: He says the image is upside down.', 'The image is upright with left and right swapped.', 'M_MI_UPSIDE'),
    sp('Nia says her image is 1 metre behind the mirror when she is 2 metres in front. Which step has the mistake?', 'Step 1: Nia stands 2 metres from the mirror.', 'Step 2: She measures the image.', 'Step 3: She says it is 1 metre behind.', 'It is 2 metres behind.', 'M_MI_DISTANCE'),
    sp('Oz says left and right do not swap. Which step has the mistake?', 'Step 1: Oz raises his right hand.', 'Step 2: The image seems to raise its left.', 'Step 3: He says left and right did not change.', 'Left and right swap in a plane mirror.', 'M_MI_UPSIDE'),
  ], { h: ['Which step has a wrong fact about the image?', 'Same size, upright, left and right swap.'], s1: 'Check each step against image facts.' })),

  // ---------------------------------------------------------------- RAINBOW
  fam('lt.rb.direct', `${LT}RAINBOW`, 'direct', 1, choose([
    c('What is a rainbow?', 'Sunlight split into colours by raindrops', 'Raindrops bend and split sunlight.', ['M_RB_PAINT', 'A solid coloured bridge in the sky', 'A painted arc'], ['M_RB_SUN_FRONT', 'A reflection of the sea']),
    c('Where is the Sun when you see a rainbow?', 'Behind you, with the rain in front', 'The Sun is behind the observer.', ['M_RB_SUN_FRONT', 'In front of you, opposite the rain', 'Directly above'], ['M_RB_PAINT', 'It does not matter']),
    c('Which colour is on the outer edge of a main rainbow?', 'Red', 'Red is on the outside, violet inside.', ['M_RB_COLOUR_ORDER', 'Violet', 'Green'], ['M_RB_PAINT', 'Yellow']),
    c('How many colours are in the rainbow?', 'Seven', 'Red, orange, yellow, green, blue, indigo and violet.', ['M_RB_COLOUR_ORDER', 'Five', 'Three'], ['M_RB_PAINT', 'As many as the rain has']),
    c('Can you reach the end of a rainbow and touch it?', 'No, it is light and not a solid thing', 'A rainbow is light.', ['M_RB_PAINT', 'Yes, it is a solid bridge you can walk on', 'Yes, it is painted on the sky'], ['M_RB_SUN_FRONT', 'Yes, if the Sun is in front']),
  ], { h: ['Raindrops split sunlight into seven colours.', 'The Sun is behind you.'], s1: 'Think of sunlight and raindrops.' })),
  fam('lt.rb.story', `${LT}RAINBOW`, 'word', 2, choose([
    c('Wanjiku sprays water from a hose in the sun and sees a small rainbow. What is happening?', 'Sunlight is split into colours by the water drops', 'Drops of water split light.', ['M_RB_PAINT', 'The water is painted', 'The hose makes colours'], ['M_RB_SUN_FRONT', 'The Sun is shining from the front of the hose']),
    c('After rain the Sun shines from the west. In which direction should Ken look to see a rainbow?', 'East, away from the Sun', 'The Sun must be behind him.', ['M_RB_SUN_FRONT', 'West, towards the Sun', 'Straight up'], ['M_RB_PAINT', 'Any direction']),
    c('A learner says there are only three colours in a rainbow. What is true?', 'There are seven colours', 'Red, orange, yellow, green, blue, indigo, violet.', ['M_RB_COLOUR_ORDER', 'She is right', 'There are five'], ['M_RB_PAINT', 'The colours are paint']),
    c('A child says she will run to the end of the rainbow to find gold. What can you say?', 'A rainbow is light in the air and cannot be reached', 'It moves as she moves.', ['M_RB_PAINT', 'She can touch it at the end', 'It is a solid bridge that she can walk across'], ['M_RB_SUN_FRONT', 'The end is where the Sun is']),
    c('In the rainbow, which colour is next to red?', 'Orange', 'The order is red, orange, yellow...', ['M_RB_COLOUR_ORDER', 'Violet', 'Green'], ['M_RB_PAINT', 'Blue']),
  ], { h: ['A rainbow needs sunlight and raindrops.', 'The Sun is behind you.'], s1: 'Decide how the rainbow forms in the story.' })),
  fam('lt.rb.spot', `${LT}RAINBOW`, 'spot', 3, spot([
    sp('Pam says a rainbow is a solid bridge. Which step has the mistake?', 'Step 1: Pam sees a rainbow after rain.', 'Step 2: It looks like an arc.', 'Step 3: She says it is a solid bridge.', 'A rainbow is light split into colours by drops.', 'M_RB_PAINT'),
    sp('Quin says the Sun is in front when you see a rainbow. Which step has the mistake?', 'Step 1: Quin sees a rainbow after the rain.', 'Step 2: The rain is falling in front of him.', 'Step 3: He says the Sun must be in front of him too.', 'The Sun is behind you.', 'M_RB_SUN_FRONT'),
    sp('Rob says violet is on the outer edge of a main rainbow. Which step has the mistake?', 'Step 1: Rob looks at a rainbow.', 'Step 2: He sees all seven colours.', 'Step 3: He says violet is on the outside.', 'Red is on the outside.', 'M_RB_COLOUR_ORDER'),
    sp('Sue says raindrops have nothing to do with rainbows. Which step has the mistake?', 'Step 1: Sue sees a rainbow.', 'Step 2: It is raining in the distance.', 'Step 3: She says rain is not needed.', 'Raindrops split the light.', 'M_RB_PAINT'),
    sp('Tex says you can see a rainbow with the Sun in front at noon. Which step has the mistake?', 'Step 1: Tex faces the Sun.', 'Step 2: Rain is falling behind him.', 'Step 3: He says he can see the rainbow in front.', 'The Sun must be behind the viewer.', 'M_RB_SUN_FRONT'),
  ], { h: ['Which step has a wrong idea about rainbows?', 'Sun behind you; rain in front.'], s1: 'Check each step against how rainbows form.' })),

  // ---------------------------------------------------------------- LEVER_IDENTIFY
  fam('lv.id.direct', `${LV}LEVER_IDENTIFY`, 'direct', 1, choose([
    c('Which of these is a lever?', 'A pair of pliers', 'Pliers are two levers joined.', ['M_LI_LADDER', 'A ladder', 'A pot'], ['M_LI_MORE_ENERGY', 'A wheel']),
    c('Which of these is a lever?', 'Scissors or tweezers', 'A lever can be short.', ['M_LI_ONLY_LONG', 'Only a long stick or a crowbar', 'Only a very large bar'], ['M_LI_LADDER', 'A rope']),
    c('What does a lever do?', 'Lets a small effort move a big load', 'It makes work easier.', ['M_LI_MORE_ENERGY', 'Gives more energy than we put in', 'Makes energy'], ['M_LI_LADDER', 'Makes the load disappear when you push']),
    c('Which of these is NOT a lever?', 'A ladder', 'A ladder does not turn about a point.', ['M_LI_LADDER', 'A see-saw', 'A wheelbarrow'], ['M_LI_ONLY_LONG', 'A shovel']),
    c('Which kitchen tool is a lever?', 'Tongs', 'Tongs turn about a point.', ['M_LI_LADDER', 'A bowl', 'A plate'], ['M_LI_ONLY_LONG', 'A long rope']),
  ], { h: ['A lever is a bar that turns about a fixed point.', 'Levers can be short or long.'], s1: 'Look for a bar that turns about a point.' })),
  fam('lv.id.story', `${LV}LEVER_IDENTIFY`, 'word', 2, choose([
    c('Wanjiru opens a bottle with an opener. Is the opener a lever?', 'Yes, it turns about a point and makes the job easier', 'A bottle opener is a lever.', ['M_LI_LADDER', 'No, it is only a piece of metal and not a machine', 'No, it is a ladder'], ['M_LI_ONLY_LONG', 'No, it is too short']),
    c('A child says a ladder is a lever because it helps her climb. What can you tell her?', 'A ladder does not turn about a point, so it is not a lever', 'A lever turns about a fixed point.', ['M_LI_LADDER', 'She is right', 'A ladder is a lever of the third class, for climbing'], ['M_LI_MORE_ENERGY', 'It gives her extra energy']),
    c('A farmer uses a long bar to lift a heavy stone. What kind of simple machine is the bar?', 'A lever', 'A bar turning on a point.', ['M_LI_LADDER', 'A ladder', 'A slope'], ['M_LI_ONLY_LONG', 'Not a machine']),
    c('Ouma says only long sticks are levers. Which tool shows he is wrong?', 'Scissors', 'Scissors are short levers.', ['M_LI_ONLY_LONG', 'A crowbar', 'A long pole'], ['M_LI_LADDER', 'A ladder']),
    c('Njoki says a lever gives out extra energy. What is true?', 'It only makes work easier; no extra energy is made', 'Energy is not made by a lever.', ['M_LI_MORE_ENERGY', 'She is right', 'A lever stores up energy and gives it back later'], ['M_LI_LADDER', 'A lever is a ladder']),
  ], { h: ['A lever turns about a fixed point.', 'A lever does not make energy.'], s1: 'Decide if the tool is a bar turning about a point.' })),
  fam('lv.id.spot', `${LV}LEVER_IDENTIFY`, 'spot', 3, spot([
    sp('Ana says a ladder is a lever. Which step has the mistake?', 'Step 1: Ana climbs a ladder.', 'Step 2: It helps her reach the roof.', 'Step 3: She says it is a lever.', 'A ladder does not turn about a point.', 'M_LI_LADDER'),
    sp('Bill says only long bars are levers. Which step has the mistake?', 'Step 1: Bill sees a crowbar.', 'Step 2: He calls it a lever.', 'Step 3: He says a short pair of scissors is not a lever.', 'Scissors are levers too.', 'M_LI_ONLY_LONG'),
    sp('Cora says a lever gives extra energy. Which step has the mistake?', 'Step 1: Cora uses a bar to lift a stone.', 'Step 2: It is easier.', 'Step 3: She says the bar made new energy.', 'A lever only changes the effort needed.', 'M_LI_MORE_ENERGY'),
    sp('Dev says a pot is a lever. Which step has the mistake?', 'Step 1: Dev lifts a pot.', 'Step 2: It has a handle.', 'Step 3: He says the pot is a lever.', 'A pot does not turn about a point.', 'M_LI_LADDER'),
    sp('Eve says tweezers are too small to be levers. Which step has the mistake?', 'Step 1: Eve picks up a crumb with tweezers.', 'Step 2: The tweezers turn about a point.', 'Step 3: She says they are too small to be levers.', 'Size does not decide.', 'M_LI_ONLY_LONG'),
  ], { h: ['Which step has a wrong idea about levers?', 'A lever is a bar turning about a fixed point.'], s1: 'Check each step against what a lever is.' })),

  // ---------------------------------------------------------------- LEVER_PARTS
  fam('lv.pt.direct', `${LV}LEVER_PARTS`, 'direct', 1, choose([
    c('In a wheelbarrow, what is the load?', 'The soil or bricks in the barrow', 'The load is what you move.', ['M_LP_LOAD_EFFORT', 'The person lifting the handles', 'The wheel'], ['M_LP_FULCRUM_HANDLE', 'The handles']),
    c('On a see-saw, where is the fulcrum?', 'At the middle support the plank turns about', 'The fulcrum is the fixed point.', ['M_LP_FULCRUM_HANDLE', 'At the seats', 'At the ends'], ['M_LP_MOVES', 'At the child who is moving up and down']),
    c('What does the fulcrum do while a lever works?', 'It stays fixed', 'The bar turns about it.', ['M_LP_MOVES', 'It moves with the load', 'It moves with the effort'], ['M_LP_LOAD_EFFORT', 'It carries the effort']),
    c('What is the effort?', 'The push or pull we use', 'Effort is what we put in.', ['M_LP_LOAD_EFFORT', 'The object to be moved', 'The fixed point'], ['M_LP_FULCRUM_HANDLE', 'The handle only']),
    c('In scissors, where is the fulcrum?', 'At the screw that joins the blades', 'The blades turn about it.', ['M_LP_FULCRUM_HANDLE', 'At the handles', 'At the tips'], ['M_LP_MOVES', 'It moves along as the scissors cut']),
  ], { h: ['Fulcrum: the fixed point. Effort: what we put in. Load: what we move.', 'The fulcrum stays still.'], s1: 'Find the fixed point first.' })),
  fam('lv.pt.story', `${LV}LEVER_PARTS`, 'word', 2, choose([
    c('Kamau uses a plank on a log to lift a stone. What is the log?', 'The fulcrum', 'The plank turns about the log.', ['M_LP_FULCRUM_HANDLE', 'The effort', 'The load'], ['M_LP_MOVES', 'The moving part']),
    c('In the same job, what is the stone?', 'The load', 'It is what is moved.', ['M_LP_LOAD_EFFORT', 'The effort', 'The fulcrum'], ['M_LP_FULCRUM_HANDLE', 'The handle']),
    c('In the same job, Kamau pushes down on the plank. What is his push?', 'The effort', 'It is what he puts in.', ['M_LP_LOAD_EFFORT', 'The load', 'The fulcrum'], ['M_LP_MOVES', 'The fixed point']),
    c('A learner says the fulcrum is where we hold a tool. What can you tell her?', 'The fulcrum is the fixed point the bar turns about', 'It is not the handle.', ['M_LP_FULCRUM_HANDLE', 'She is right', 'The fulcrum is the load'], ['M_LP_LOAD_EFFORT', 'The fulcrum is the effort that we push with']),
    c('A learner says the fulcrum moves along with the stone. What is true?', 'It stays in place', 'It is fixed.', ['M_LP_MOVES', 'She is right', 'It moves with the effort'], ['M_LP_FULCRUM_HANDLE', 'It is the stone']),
  ], { h: ['The fulcrum is the pivot.', 'Effort in, load out.'], s1: 'Name the part in the story.' })),
  fam('lv.pt.spot', `${LV}LEVER_PARTS`, 'spot', 3, spot([
    sp('Fay says the person is the load in a wheelbarrow. Which step has the mistake?', 'Step 1: Fay watches a man push a wheelbarrow.', 'Step 2: It carries sand.', 'Step 3: She says the man is the load.', 'The sand is the load. The man gives the effort.', 'M_LP_LOAD_EFFORT'),
    sp('Gus says the fulcrum of a see-saw is the seat. Which step has the mistake?', 'Step 1: Gus sits on a see-saw.', 'Step 2: He sees the middle support.', 'Step 3: He says the seat is the fulcrum.', 'The middle support is the fulcrum.', 'M_LP_FULCRUM_HANDLE'),
    sp('Hana says the fulcrum moves with the load. Which step has the mistake?', 'Step 1: Hana lifts a stone with a plank.', 'Step 2: The plank turns.', 'Step 3: She says the pivot moves with the stone.', 'The fulcrum stays fixed.', 'M_LP_MOVES'),
    sp('Ivo says effort is the thing we move. Which step has the mistake?', 'Step 1: Ivo lifts a box with a lever.', 'Step 2: He pushes down.', 'Step 3: He says the box is the effort.', 'The box is the load.', 'M_LP_LOAD_EFFORT'),
    sp('Jay says the fulcrum is the handle of the scissors. Which step has the mistake?', 'Step 1: Jay holds scissors.', 'Step 2: He sees the screw between the blades.', 'Step 3: He says the handle is the fulcrum.', 'The screw is the fulcrum.', 'M_LP_FULCRUM_HANDLE'),
  ], { h: ['Which step names a part wrongly?', 'Fulcrum fixed; effort in; load moved.'], s1: 'Check each step against the parts of a lever.' })),

  // ---------------------------------------------------------------- LEVER_EASIER
  fam('lv.ea.direct', `${LV}LEVER_EASIER`, 'direct', 1, choose([
    c('A learner lifts a stone with a plank. Where should the fulcrum be to need the least effort?', 'Close to the stone', 'The closer the fulcrum is to the load, the less effort.', ['M_LE_FAR_FROM_LOAD', 'Close to the learner\'s hands', 'Far from the stone'], ['M_LE_FREE_WORK', 'It makes no difference']),
    c('On a door, where should a person push to open it more easily?', 'Far from the hinges, at the handle', 'A longer distance from the fulcrum needs less effort.', ['M_LE_SHORT_ARM', 'Close to the hinges', 'On the hinges'], ['M_LE_FREE_WORK', 'Anywhere on the door, the effort is the same']),
    c('What happens to the weight of a load when a lever is used?', 'It stays the same, only the effort is smaller', 'A lever does not change the weight.', ['M_LE_FREE_WORK', 'It gets lighter, so it is easier to lift', 'It disappears'], ['M_LE_SHORT_ARM', 'It doubles']),
    c('What does a lever do?', 'Lets a small effort move a heavy load', 'It trades effort for distance.', ['M_LE_FREE_WORK', 'Makes the load lighter and easier to hold', 'Gives more energy'], ['M_LE_FAR_FROM_LOAD', 'Needs a bigger effort']),
    c('A longer effort arm means what?', 'Less effort is needed', 'Long arm, small effort.', ['M_LE_SHORT_ARM', 'More effort is needed', 'The same effort'], ['M_LE_FAR_FROM_LOAD', 'The load is heavier']),
  ], { h: ['Closer fulcrum to the load: less effort.', 'Push far from the fulcrum.'], s1: 'Think about the distance from the fulcrum.' })),
  fam('lv.ea.story', `${LV}LEVER_EASIER`, 'word', 2, choose([
    c('Okoth has a long crowbar and a heavy rock. To lift the rock with the least effort, where should he put the stone that acts as the pivot?', 'Close to the rock', 'A close fulcrum to the load means less effort.', ['M_LE_FAR_FROM_LOAD', 'Close to his hands', 'Far from the rock'], ['M_LE_FREE_WORK', 'It does not matter']),
    c('Mercy can open a stiff door more easily by pushing where?', 'Far from the hinges', 'A longer arm needs less effort.', ['M_LE_SHORT_ARM', 'Close to the hinges', 'At the hinges'], ['M_LE_FREE_WORK', 'Anywhere']),
    c('Ken says a lever makes a load lighter. What is true?', 'The load keeps its weight; the effort is smaller', 'Weight is not changed.', ['M_LE_FREE_WORK', 'He is right', 'The load loses weight'], ['M_LE_SHORT_ARM', 'The effort gets bigger when a lever is used']),
    c('Atieno moves the fulcrum of a see-saw plank closer to a heavy box. What happens to the effort needed?', 'It becomes smaller', 'Closer to the load means less effort.', ['M_LE_FAR_FROM_LOAD', 'It becomes larger', 'It stays the same'], ['M_LE_FREE_WORK', 'The box becomes lighter']),
    c('A spanner with a long handle loosens a tight nut more easily than a short one. Why?', 'The longer handle is further from the nut and needs less effort', 'The longer arm needs less effort.', ['M_LE_SHORT_ARM', 'The short handle needs less effort because it is closer to the nut', 'The handle makes the nut lighter'], ['M_LE_FREE_WORK', 'The nut loses weight']),
  ], { h: ['Long effort arm: small effort.', 'A lever does not change the weight.'], s1: 'Decide where the effort and fulcrum are.' }), 'd'),
  fam('lv.ea.spot', `${LV}LEVER_EASIER`, 'spot', 3, spot([
    sp('Kai says put the fulcrum near your hands to lift a rock easily. Which step has the mistake?', 'Step 1: Kai puts a plank on a log.', 'Step 2: He puts the log near his hands.', 'Step 3: He says this needs the least effort.', 'The fulcrum should be near the load.', 'M_LE_FAR_FROM_LOAD'),
    sp('Lia says push a door near the hinge to open it easily. Which step has the mistake?', 'Step 1: Lia pushes near the hinge.', 'Step 2: The door is hard to move.', 'Step 3: She says this is the easiest place.', 'Pushing far from the hinge is easier.', 'M_LE_SHORT_ARM'),
    sp('Max says the load gets lighter on a lever. Which step has the mistake?', 'Step 1: Max lifts a box with a lever.', 'Step 2: It feels easy.', 'Step 3: He says the box lost weight.', 'The weight is the same.', 'M_LE_FREE_WORK'),
    sp('Nia says a short wrench is easier than a long one. Which step has the mistake?', 'Step 1: Nia tries a short wrench.', 'Step 2: She tries a long wrench.', 'Step 3: She says the short one needs less effort.', 'The long wrench needs less effort.', 'M_LE_SHORT_ARM'),
    sp('Oko says fulcrum position does not change the effort. Which step has the mistake?', 'Step 1: Oko moves the log under a plank.', 'Step 2: Lifting changes in difficulty.', 'Step 3: He says the position does not matter.', 'Closer to the load needs less effort.', 'M_LE_FAR_FROM_LOAD'),
  ], { h: ['Which step has a wrong idea about how levers make work easier?', 'Push far from the fulcrum.'], s1: 'Check each step against how a lever works.' })),

  // ---------------------------------------------------------------- LEVER_CLASS
  fam('lv.cl.direct', `${LV}LEVER_CLASS`, 'direct', 1, choose([
    c('Which class of lever is a wheelbarrow?', 'Second class', 'The load is in the middle.', ['M_LC_FIRST_ALWAYS', 'First class', 'Third class'], ['M_LC_THIRD_SECOND', 'It has no class']),
    c('Which part is in the middle of a third class lever?', 'The effort', 'Third class: effort in the middle.', ['M_LC_USE_SIZE', 'The fulcrum', 'The load'], ['M_LC_FIRST_ALWAYS', 'Nothing']),
    c('Which class of lever are tweezers?', 'Third class', 'The effort is in the middle.', ['M_LC_THIRD_SECOND', 'Second class', 'First class'], ['M_LC_FIRST_ALWAYS', 'No class']),
    c('Which class of lever is a see-saw?', 'First class', 'The fulcrum is in the middle.', ['M_LC_FIRST_ALWAYS', 'Second class', 'Third class'], ['M_LC_USE_SIZE', 'It depends on its size']),
    c('Which part is in the middle of a second class lever?', 'The load', 'Second class: load in the middle.', ['M_LC_USE_SIZE', 'The fulcrum', 'The effort'], ['M_LC_THIRD_SECOND', 'The handle']),
  ], { h: ['First: fulcrum in the middle. Second: load. Third: effort.', 'Find the part in the middle.'], s1: 'Find which part is in the middle.' })),
  fam('lv.cl.story', `${LV}LEVER_CLASS`, 'word', 2, choose([
    c('A fishing rod has the fulcrum at the handle end, the effort in the middle and the load at the tip. Which class is it?', 'Third class', 'The effort is in the middle.', ['M_LC_THIRD_SECOND', 'Second class', 'First class'], ['M_LC_FIRST_ALWAYS', 'No class']),
    c('A nutcracker has the fulcrum at the hinge, the load (nut) in the middle and the effort at the handles. Which class is it?', 'Second class', 'Load in the middle.', ['M_LC_THIRD_SECOND', 'Third class', 'First class'], ['M_LC_FIRST_ALWAYS', 'No class']),
    c('Scissors have the fulcrum at the screw between the handles and blades. Which class are they?', 'First class', 'Fulcrum in the middle.', ['M_LC_FIRST_ALWAYS', 'Second class', 'Third class'], ['M_LC_USE_SIZE', 'It depends on the size of the scissors']),
    c('A learner decides a lever is first class because it is old. What can you tell her?', 'The class depends on which part is in the middle', 'Not age or size.', ['M_LC_USE_SIZE', 'She is right', 'Old levers are first class'], ['M_LC_FIRST_ALWAYS', 'All levers are first class, whatever their size']),
    c('A bottle opener has the fulcrum at one end, the load (cap) in the middle and the effort at the handle. Which class is it?', 'Second class', 'Load in the middle.', ['M_LC_THIRD_SECOND', 'Third class', 'First class'], ['M_LC_FIRST_ALWAYS', 'No class']),
  ], { h: ['Find the middle part: fulcrum, load or effort.', 'First, second, third.'], s1: 'Name the part in the middle.' })),
  fam('lv.cl.spot', `${LV}LEVER_CLASS`, 'spot', 3, spot([
    sp('Pia says every lever is first class. Which step has the mistake?', 'Step 1: Pia studies a see-saw.', 'Step 2: It is first class.', 'Step 3: She says all levers are first class.', 'There are first, second and third class levers.', 'M_LC_FIRST_ALWAYS'),
    sp('Raj says a lever\'s class depends on its size. Which step has the mistake?', 'Step 1: Raj compares a big and a small lever.', 'Step 2: He sees they differ in size.', 'Step 3: He says size decides the class.', 'The class depends on the part in the middle.', 'M_LC_USE_SIZE'),
    sp('Sol says tweezers are second class. Which step has the mistake?', 'Step 1: Sol squeezes tweezers.', 'Step 2: He sees the effort is in the middle.', 'Step 3: He says they are second class.', 'Effort in the middle makes it third class.', 'M_LC_THIRD_SECOND'),
    sp('Tia says a wheelbarrow is first class. Which step has the mistake?', 'Step 1: Tia studies a wheelbarrow.', 'Step 2: She sees the load is in the middle.', 'Step 3: She says it is first class.', 'Load in the middle is second class.', 'M_LC_FIRST_ALWAYS'),
    sp('Uma says a fishing rod is second class. Which step has the mistake?', 'Step 1: Uma holds a fishing rod.', 'Step 2: Her hand is in the middle.', 'Step 3: She says it is second class.', 'Effort in the middle is third class.', 'M_LC_THIRD_SECOND'),
  ], { h: ['Which step names the wrong class for the part in the middle?', 'Fulcrum 1, load 2, effort 3.'], s1: 'Check each step against the lever classes.' })),

  // ---------------------------------------------------------------- SLOPE_TYPES
  fam('sl.ty.direct', `${SL}SLOPE_TYPES`, 'direct', 1, choose([
    c('Which of these is a slope?', 'A ramp', 'A ramp is a tilted flat surface.', ['M_ST_PULLEY', 'A see-saw', 'A pulley'], ['M_ST_FLAT_ROAD', 'A flat road']),
    c('Which of these is NOT a slope?', 'A flat road on level ground', 'A slope must be tilted.', ['M_ST_FLAT_ROAD', 'A road winding up a hill', 'A staircase'], ['M_ST_PULLEY', 'A ramp']),
    c('Which tool is a slope in the shape of a wedge?', 'An axe', 'A wedge is two slopes joined.', ['M_ST_WEDGE', 'A hammer', 'A rope'], ['M_ST_PULLEY', 'A pulley']),
    c('A plank rests against a lorry so that sacks can be rolled up. What is the plank?', 'A slope', 'It is a tilted surface.', ['M_ST_PULLEY', 'A lever', 'A pulley'], ['M_ST_FLAT_ROAD', 'A flat road']),
    c('Which of these is a slope?', 'A staircase', 'Steps form a slope.', ['M_ST_PULLEY', 'A see-saw', 'A wheel'], ['M_ST_FLAT_ROAD', 'A flat floor']),
  ], { h: ['A slope is a tilted flat surface.', 'An axe is a wedge.'], s1: 'Look for a tilted surface.' })),
  fam('sl.ty.story', `${SL}SLOPE_TYPES`, 'word', 2, choose([
    c('At the clinic a ramp lets wheelchairs reach the door. What simple machine is the ramp?', 'A slope', 'It is a tilted surface.', ['M_ST_PULLEY', 'A pulley', 'A see-saw'], ['M_ST_FLAT_ROAD', 'A flat road']),
    c('Wanjiru chops wood with an axe. What kind of simple machine is the blade?', 'A wedge, which is a kind of slope', 'A wedge is two slopes.', ['M_ST_WEDGE', 'A hammer', 'A pulley'], ['M_ST_PULLEY', 'A lever only, with a long handle']),
    c('A road climbs a hill in many bends. Why?', 'A gentle slope is easier for vehicles', 'It is a slope.', ['M_ST_FLAT_ROAD', 'The road is flat, with no slope at all', 'It is a lever'], ['M_ST_PULLEY', 'It is a pulley']),
    c('Ken says a flat road is a slope. What is true?', 'It must be tilted to be a slope', 'Slopes are tilted.', ['M_ST_FLAT_ROAD', 'He is right', 'Every road is a slope, even a flat one'], ['M_ST_PULLEY', 'A flat road is a pulley']),
    c('Some workers push a handcart up a concrete ramp to a shop door. What is the ramp?', 'A slope', 'A ramp is a tilted surface.', ['M_ST_PULLEY', 'A see-saw', 'A pulley'], ['M_ST_FLAT_ROAD', 'A flat road']),
  ], { h: ['A slope is tilted.', 'A wedge is a slope.'], s1: 'Decide if the object is a tilted surface.' })),
  fam('sl.ty.spot', `${SL}SLOPE_TYPES`, 'spot', 3, spot([
    sp('Val says a see-saw is a slope. Which step has the mistake?', 'Step 1: Val sits on a see-saw.', 'Step 2: It tilts up and down.', 'Step 3: She says it is a slope.', 'A see-saw is a lever.', 'M_ST_PULLEY'),
    sp('Wes says a flat road is a slope. Which step has the mistake?', 'Step 1: Wes walks on a road.', 'Step 2: It is level.', 'Step 3: He says it is a slope.', 'A slope must be tilted.', 'M_ST_FLAT_ROAD'),
    sp('Xia says an axe is not a slope. Which step has the mistake?', 'Step 1: Xia looks at the blade.', 'Step 2: It is thick at the back and thin at the edge.', 'Step 3: She says it is not a slope.', 'An axe is a wedge, a kind of slope.', 'M_ST_WEDGE'),
    sp('Yan says a pulley is a slope. Which step has the mistake?', 'Step 1: Yan pulls a rope over a wheel.', 'Step 2: A load goes up.', 'Step 3: He says the wheel is a slope.', 'A pulley is not a slope.', 'M_ST_PULLEY'),
    sp('Zoe says stairs are not slopes. Which step has the mistake?', 'Step 1: Zoe climbs stairs.', 'Step 2: She goes up gradually.', 'Step 3: She says stairs are not a slope.', 'Stairs are a kind of slope.', 'M_ST_WEDGE'),
  ], { h: ['Which step has a wrong idea about slopes?', 'A slope is tilted; a wedge is two slopes.'], s1: 'Check each step against slopes.' })),

  // ---------------------------------------------------------------- SLOPE_EASIER
  fam('sl.ea.direct', `${SL}SLOPE_EASIER`, 'direct', 1, choose([
    c('Two ramps reach the same height. Which needs the least effort to push a loaded wheelbarrow up?', 'The long, gentle ramp', 'A gentler slope needs less effort.', ['M_SE_STEEP_EASIER', 'The steepest ramp', 'The shortest ramp'], ['M_SE_SHORTER_WAY', 'A ramp the same as a straight lift']),
    c('What happens to the weight of a drum on a ramp?', 'It stays the same, only the push needed is smaller', 'A slope does not change weight.', ['M_SE_LIGHTER', 'It becomes lighter, so it is easier to push', 'It disappears'], ['M_SE_STEEP_EASIER', 'It doubles']),
    c('A load is pushed up a ramp instead of being lifted straight up. What is true of the path it takes?', 'The path along the ramp is longer', 'A ramp is longer than a straight lift.', ['M_SE_SHORTER_WAY', 'The path along the ramp is shorter', 'The path is the same length'], ['M_SE_LIGHTER', 'The load takes no path at all']),
    c('Why is it easier to push a barrel up a ramp than to lift it?', 'The ramp reduces the effort needed', 'Slopes make work easier.', ['M_SE_LIGHTER', 'The ramp makes the barrel lighter', 'The ramp makes the barrel smaller'], ['M_SE_STEEP_EASIER', 'The ramp is steep']),
    c('What is the cost of using a gentler slope?', 'A longer path', 'You travel farther.', ['M_SE_SHORTER_WAY', 'A shorter path', 'A heavier load'], ['M_SE_STEEP_EASIER', 'More effort']),
  ], { h: ['Gentler slope: less effort, longer path.', 'The load does not get lighter.'], s1: 'Think about effort and distance.' })),
  fam('sl.ea.story', `${SL}SLOPE_EASIER`, 'word', 2, choose([
    c('Two planks of different lengths lean against a lorry of the same height. Which plank is easier to roll a drum up?', 'The longer plank', 'A longer slope is gentler.', ['M_SE_STEEP_EASIER', 'The shorter plank', 'Both the same'], ['M_SE_LIGHTER', 'The drum is lighter on the shorter one']),
    c('A porter says a ramp makes the sack lighter. What is true?', 'The sack weighs the same; less push is needed', 'Weight does not change.', ['M_SE_LIGHTER', 'He is right', 'The sack loses weight'], ['M_SE_SHORTER_WAY', 'The sack goes a shorter way up than before']),
    c('Why do roads climbing a mountain wind in bends?', 'A longer, gentler slope is easier to climb', 'Gentler slope, less effort.', ['M_SE_STEEP_EASIER', 'A steep road is easier', 'To make the road shorter and save distance'], ['M_SE_SHORTER_WAY', 'To make the road look pretty']),
    c('Ken says a ramp saves distance. What is true?', 'A ramp is longer than a straight lift', 'The path is longer.', ['M_SE_SHORTER_WAY', 'He is right', 'A ramp is the same'], ['M_SE_LIGHTER', 'The load is lighter when it is on a ramp']),
    c('A farmer wants to load a heavy sack on a lorry with the least effort. What should he use?', 'A long plank as a ramp', 'A longer ramp is gentler.', ['M_SE_STEEP_EASIER', 'A very short, steep plank', 'No ramp'], ['M_SE_LIGHTER', 'A scale']),
  ], { h: ['A longer ramp is gentler.', 'The weight stays the same.'], s1: 'Decide between effort and distance.' })),
  fam('sl.ea.spot', `${SL}SLOPE_EASIER`, 'spot', 3, spot([
    sp('Abe says a steep ramp is easier than a gentle one. Which step has the mistake?', 'Step 1: Abe compares two ramps.', 'Step 2: One is steep and short.', 'Step 3: He says it needs less effort.', 'A gentler slope needs less effort.', 'M_SE_STEEP_EASIER'),
    sp('Bea says a ramp makes a load lighter. Which step has the mistake?', 'Step 1: Bea pushes a box up a ramp.', 'Step 2: It is easier.', 'Step 3: She says the box lost weight.', 'The box weighs the same.', 'M_SE_LIGHTER'),
    sp('Cal says a ramp is shorter than lifting straight up. Which step has the mistake?', 'Step 1: Cal measures the height.', 'Step 2: He measures the ramp.', 'Step 3: He says the ramp is shorter.', 'The ramp is longer.', 'M_SE_SHORTER_WAY'),
    sp('Dee says the load weighs less on the ramp. Which step has the mistake?', 'Step 1: Dee weighs a drum on the ground.', 'Step 2: She puts it on a ramp.', 'Step 3: She says it now weighs less.', 'Weight does not change.', 'M_SE_LIGHTER'),
    sp('Eli says a short steep slope saves effort. Which step has the mistake?', 'Step 1: Eli builds a short steep slope.', 'Step 2: He builds a long gentle slope.', 'Step 3: He says the short one needs less effort.', 'The long gentle slope needs less effort.', 'M_SE_STEEP_EASIER'),
  ], { h: ['Which step has a wrong idea about slopes?', 'Gentler slope: less effort, longer path.'], s1: 'Check each step against how slopes work.' })),
];
