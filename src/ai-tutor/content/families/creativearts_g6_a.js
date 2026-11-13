// ============================================================================
// GRADE 6 CREATIVE ARTS, THEME A: STRING INSTRUMENTS, STIPPLING, COLOUR, PAINTING AND COLLAGE, VOLLEYBALL, RHYTHM AND PRINTING
// (9 skills). Only the knowledge half is tested here. Making, playing, drawing, painting and printing are practical: see
// docs/qa/creativearts-g6-non-question-outcomes-2026-11-13.md. Shapes and signs are described in words (the phone question
// has no picture). Every wrong answer names the library misconception it reveals. All stay reviewed:false until a teacher
// signs them off. Instrument and community facts are for a teacher who knows the community to confirm.
// ============================================================================
import { fam, choose, spot, w, sp } from './creativearts_g6_lib.js';

const SM = 'CREATI.STRING_MUSICAL_INSTRUMEN.', PC = 'CREATI.PAINTING_AND_COLLAGE.', VB = 'CREATI.VOLLEYBALL.', RP = 'CREATI.RHYTHM_AND_PATTERN_MAKIN.';

export const FAMILIES = [
  // ---------------------------------------------------------------- SM.INSTRUMENTS
  fam('sm.id.which', `${SM}INSTRUMENTS`, 'direct', 1, choose([
    ['Which of these four is a string instrument?', 'The nyatiti', [...w('M_SM_WIND_AS_STRING', 'The nzumari'), ...w('M_SM_WIND_AS_STRING', 'The ngoma drum'), ...w('M_SM_WIND_AS_STRING', 'A reed flute')], 'The nyatiti has strings that are plucked, so it is a string instrument.'],
    ['Which instrument below has strings?', 'The litungu', [...w('M_SM_WIND_AS_STRING', 'A siwa horn'), ...w('M_SM_WIND_AS_STRING', 'A tom-tom drum'), ...w('M_SM_WIND_AS_STRING', 'A gourd shaker')], 'The litungu is a lyre with strings.'],
    ['Which of these is NOT a string instrument?', 'The ngoma drum', [...w('M_SM_WIND_AS_STRING', 'The orutu'), ...w('M_SM_WIND_AS_STRING', 'The nyatiti'), ...w('M_SM_WIND_AS_STRING', 'The obokano')], 'The ngoma is hit. The others have strings.'],
    ['A music teacher shows four instruments. Which one is a string instrument?', 'The obokano', [...w('M_SM_WIND_AS_STRING', 'An animal horn'), ...w('M_SM_WIND_AS_STRING', 'A rattle'), ...w('M_SM_WIND_AS_STRING', 'A whistle')], 'The obokano is a large lyre of the Gusii, with strings.'],
    ['Pick the string instrument.', 'The orutu', [...w('M_SM_WIND_AS_STRING', 'The nzumari'), ...w('M_SM_WIND_AS_STRING', 'A drum made from a log'), ...w('M_SM_WIND_AS_STRING', 'A clay whistle')], 'The orutu is a fiddle with a string.'],
  ], { h: ['Ask: how does the player make the sound?', 'String instruments have strings that are plucked or rubbed with a bow.'], s1: 'Find the instrument that has strings.' })),
  fam('sm.id.how', `${SM}INSTRUMENTS`, 'word', 2, choose([
    ['Achieng watches a Luo musician play the orutu. How does he make the sound?', 'He rubs the string with a bow', [...w('M_SM_PLAY', 'He plucks the string with his fingers'), ...w('M_SM_PLAY', 'He blows into it'), ...w('M_SM_PLAY', 'He hits it with a stick')], 'The orutu is a fiddle played with a bow.'],
    ['Otieno hears a musician pluck the eight strings of the nyatiti. What kind of instrument is it?', 'A string instrument', [...w('M_SM_WIND_AS_STRING', 'A wind instrument'), ...w('M_SM_WIND_AS_STRING', 'A drum'), ...w('M_SM_WIND_AS_STRING', 'A shaker')], 'The nyatiti has strings that are plucked.'],
    ['Wanjiru is told the litungu belongs to a western Kenyan community. Which people are they?', 'The Luhya', [...w('M_SM_COMMUNITY', 'The Luo'), ...w('M_SM_COMMUNITY', 'The Maasai'), ...w('M_SM_COMMUNITY', 'The Kamba')], 'The litungu belongs to the Luhya.'],
    ['Kamau is told the nyatiti belongs to the people of the lake. Which people are they?', 'The Luo', [...w('M_SM_COMMUNITY', 'The Luhya'), ...w('M_SM_COMMUNITY', 'The Gusii'), ...w('M_SM_COMMUNITY', 'The Kikuyu')], 'The nyatiti belongs to the Luo.'],
    ['Baraka sees a big lyre played by the Gusii. What is it called?', 'The obokano', [...w('M_SM_COMMUNITY', 'The litungu'), ...w('M_SM_COMMUNITY', 'The orutu'), ...w('M_SM_COMMUNITY', 'The nzumari')], 'The obokano is the large lyre of the Gusii.'],
  ], { h: ['Think about who plays it and how the sound is made.', 'The nyatiti and orutu are Luo, the litungu is Luhya, the obokano is Gusii.'], s1: 'Match the instrument to its community and how it is played.' })),
  fam('sm.id.spot', `${SM}INSTRUMENTS`, 'spot', 3, spot([
    sp('Amina explains how to sort instruments.', ['A string instrument has strings.', 'The nyatiti is a string instrument.', 'The orutu is a wind instrument.'], 2, 'The orutu is a one-string fiddle played with a bow, so it is a string instrument.', 'M_SM_WIND_AS_STRING'),
    sp('Juma explains how the orutu is played.', ['The orutu has one string.', 'It is a Luo instrument.', 'It is plucked with the fingers.'], 2, 'The orutu is played with a bow.', 'M_SM_PLAY'),
    sp('Mwende explains who plays what.', ['The nyatiti is a string instrument.', 'The litungu is a string instrument.', 'The litungu belongs to the Luo.'], 2, 'The litungu belongs to the Luhya.', 'M_SM_COMMUNITY'),
    sp('Kamau explains the nyatiti.', ['The nyatiti has strings.', 'It belongs to the Luo.', 'It is blown with the mouth.'], 2, 'The nyatiti is plucked, not blown.', 'M_SM_PLAY'),
    sp('Nekesa explains the obokano.', ['The obokano is a large lyre.', 'It belongs to the Gusii.', 'It is played by blowing.'], 2, 'The obokano is plucked.', 'M_SM_PLAY'),
  ], { h: ['Check each step against what you know about how the sound is made.', 'Strings are plucked or rubbed with a bow.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SM.PARTS
  fam('sm.pt.job', `${SM}PARTS`, 'direct', 1, choose([
    ['What do the strings of a string instrument do?', 'They shake to make the sound', [...w('M_SP_BODY', 'They make the sound louder'), ...w('M_SP_PEG', 'They tune the instrument'), ...w('M_SP_BODY', 'They hold the instrument up')], 'The strings shake, or vibrate, to make the sound.'],
    ['What does the hollow body of a string instrument do?', 'It makes the sound louder', [...w('M_SP_BODY', 'It makes the strings shake'), ...w('M_SP_PEG', 'It tightens the strings'), ...w('M_SP_BODY', 'It makes the sound softer')], 'The hollow body makes the sound of the strings louder.'],
    ['What are the pegs for?', 'To tighten or loosen the strings to tune them', [...w('M_SP_PEG', 'To pluck the strings'), ...w('M_SP_BODY', 'To make the sound louder'), ...w('M_SP_PEG', 'To hold the bow')], 'The pegs tune the strings.'],
    ['Which string gives a higher sound?', 'A tighter string', [...w('M_SP_TIGHT', 'A looser string'), ...w('M_SP_TIGHT', 'A slacker string'), ...w('M_SP_TIGHT', 'A thicker string left loose')], 'A tighter string gives a higher sound.'],
    ['Which part makes the sound of the orutu begin?', 'The bow rubbing the string', [...w('M_SP_BODY', 'The hollow body'), ...w('M_SP_PEG', 'The pegs'), ...w('M_SP_BODY', 'The wooden neck')], 'The bow rubbing the string makes it shake and sound.'],
  ], { h: ['Ask which part shakes and which part makes the sound bigger.', 'Pegs tune; strings shake; the body makes it louder.'], s1: 'Match the part to its job.' })),
  fam('sm.pt.tune', `${SM}PARTS`, 'why', 2, choose([
    ['A string on the nyatiti sounds too low. What should the player do?', 'Tighten the string with its peg', [...w('M_SP_TIGHT', 'Loosen the string with its peg'), ...w('M_SP_BODY', 'Make the body bigger'), ...w('M_SP_PEG', 'Pluck it harder')], 'A tighter string gives a higher sound.'],
    ['Achieng tightens a string on her instrument. What happens to the sound?', 'It goes higher', [...w('M_SP_TIGHT', 'It goes lower'), ...w('M_SP_BODY', 'It becomes louder only'), ...w('M_SP_PEG', 'It stops')], 'A tighter string gives a higher sound.'],
    ['Why does a litungu have a hollow wooden body?', 'To make the sound louder', [...w('M_SP_BODY', 'To make the strings shake'), ...w('M_SP_PEG', 'To tune the strings'), ...w('M_SP_BODY', 'To make it heavy')], 'The hollow body makes the sound louder.'],
    ['Otieno plucks a string held in the air and then over a tin. What does he notice?', 'It is louder over the tin', [...w('M_SP_BODY', 'It is the same loud'), ...w('M_SP_BODY', 'It is softer over the tin'), ...w('M_SP_BODY', 'It stops over the tin')], 'The hollow tin makes the sound louder, like the body of an instrument.'],
    ['Which part is turned to change the sound of a string?', 'The peg', [...w('M_SP_PEG', 'The body'), ...w('M_SP_PEG', 'The bow'), ...w('M_SP_BODY', 'The bridge')], 'The peg tightens or loosens the string.'],
  ], { h: ['A tighter string gives a higher sound.', 'The body makes the sound louder.'], s1: 'Think about how the part changes the sound.' })),
  fam('sm.pt.spot', `${SM}PARTS`, 'spot', 3, spot([
    sp('Baraka explains how an instrument works.', ['The strings shake to make the sound.', 'The hollow body makes it louder.', 'The pegs make the sound louder.'], 2, 'The pegs tune the strings. The body makes the sound louder.', 'M_SP_PEG'),
    sp('Wanjiru explains tuning.', ['A peg can tighten a string.', 'A tighter string sounds higher.', 'A looser string sounds higher.'], 2, 'A looser string sounds lower.', 'M_SP_TIGHT'),
    sp('Kamau explains the body.', ['The body is hollow.', 'The strings shake.', 'The body makes the strings shake.'], 2, 'The strings shake. The body makes the sound louder.', 'M_SP_BODY'),
    sp('Mwende explains the orutu.', ['The orutu has one string.', 'The bow rubs the string.', 'The string tightens by itself.'], 2, 'The peg tightens the string.', 'M_SP_PEG'),
    sp('Nekesa explains the nyatiti.', ['The nyatiti has strings.', 'Each string can be tuned.', 'A loose string gives a high sound.'], 2, 'A loose string gives a low sound.', 'M_SP_TIGHT'),
  ], { h: ['Check each step against what you know about strings and bodies.', 'Tight is high; the body makes it louder.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SM.STIPPLING
  fam('sm.st.what', `${SM}STIPPLING`, 'direct', 1, choose([
    ['What is stippling?', 'Drawing with many small dots', [...w('M_ST_LINES', 'Drawing with many lines'), ...w('M_ST_SMEAR', 'Smudging ink with a finger'), ...w('M_ST_LINES', 'Drawing with crossing lines')], 'Stippling uses only small dots.'],
    ['Which picture is made by stippling?', 'A drum drawn from thousands of dots', [...w('M_ST_LINES', 'A drum drawn with crossing lines'), ...w('M_ST_SMEAR', 'A drum drawn with smudged charcoal'), ...w('M_ST_LINES', 'A drum drawn with a single line')], 'Stippling builds a picture from dots.'],
    ['How do you make a part of a stippled picture look dark?', 'Put the dots close together', [...w('M_ST_DARK', 'Put the dots far apart'), ...w('M_ST_SMEAR', 'Smudge the dots'), ...w('M_ST_LINES', 'Draw lines over the dots')], 'Dots packed close together look dark.'],
    ['How do you make a part of a stippled picture look light?', 'Put the dots far apart', [...w('M_ST_DARK', 'Put the dots close together'), ...w('M_ST_SMEAR', 'Smudge the dots'), ...w('M_ST_LINES', 'Draw lines over the dots')], 'Dots spaced apart look light.'],
    ['Which tool is best for stippling?', 'A fine pen or pencil that makes dots', [...w('M_ST_SMEAR', 'A finger that smudges'), ...w('M_ST_LINES', 'A ruler for lines'), ...w('M_ST_SMEAR', 'A cloth that wipes')], 'A fine pen makes clear small dots.'],
  ], { h: ['Think of a picture built from dots.', 'Close dots look dark and spaced dots look light.'], s1: 'Remember: stippling is dots.' })),
  fam('sm.st.steps', `${SM}STIPPLING`, 'steps', 2, choose([
    ['Achieng stipples a drum. What does she do first?', 'Draw a light pencil outline', [...w('M_ST_DARK', 'Fill every part with close dots'), ...w('M_ST_SMEAR', 'Smudge the paper with charcoal'), ...w('M_ST_LINES', 'Draw crossing lines')], 'She draws a light outline first and then adds dots.'],
    ['After the light outline, what does she add?', 'Dots with a pen', [...w('M_ST_LINES', 'Lines with a ruler'), ...w('M_ST_SMEAR', 'A wash of paint'), ...w('M_ST_LINES', 'Hatching strokes')], 'Stippling means making dots.'],
    ['Otieno wants a dark shadow under the drum. What does he do?', 'Put more dots close together there', [...w('M_ST_DARK', 'Space the dots far apart there'), ...w('M_ST_SMEAR', 'Smudge the pen with his hand'), ...w('M_ST_LINES', 'Draw one thick line')], 'More close dots make a dark shadow.'],
    ['Wanjiru wants a bright part on the drum. What does she do?', 'Leave few dots there, far apart', [...w('M_ST_DARK', 'Put many close dots there'), ...w('M_ST_SMEAR', 'Smudge the part'), ...w('M_ST_LINES', 'Cross lines over it')], 'Few spaced dots look bright.'],
    ['Which of these is not a part of stippling?', 'Smudging', [...w('M_ST_SMEAR', 'Making dots'), ...w('M_ST_DARK', 'Putting dots close for dark parts'), ...w('M_ST_DARK', 'Putting dots apart for light parts')], 'Stippling does not use smudging.'],
  ], { h: ['Outline first, then dots, close for dark and far for light.', 'Stippling does not use lines or smudges.'], s1: 'Think about what stippling uses and avoids.' })),

  // ---------------------------------------------------------------- PC.COLOUR_WHEEL
  fam('pc.cw.primary', `${PC}COLOUR_WHEEL`, 'direct', 1, choose([
    ['Which of these is a primary colour?', 'Blue', [...w('M_CW_SECONDARY_PRIMARY', 'Green'), ...w('M_CW_SECONDARY_PRIMARY', 'Orange'), ...w('M_CW_SECONDARY_PRIMARY', 'Violet')], 'The primary colours are red, yellow and blue.'],
    ['Which three are the primary colours?', 'Red, yellow and blue', [...w('M_CW_SECONDARY_PRIMARY', 'Red, green and violet'), ...w('M_CW_SECONDARY_PRIMARY', 'Orange, green and violet'), ...w('M_CW_SECONDARY_PRIMARY', 'Blue, orange and yellow')], 'The primary colours cannot be made by mixing.'],
    ['Which colour is a secondary colour?', 'Green', [...w('M_CW_SECONDARY_PRIMARY', 'Red'), ...w('M_CW_SECONDARY_PRIMARY', 'Blue'), ...w('M_CW_SECONDARY_PRIMARY', 'Yellow')], 'Green is made by mixing yellow and blue.'],
    ['Which two colours make orange?', 'Red and yellow', [...w('M_CW_MIX', 'Blue and yellow'), ...w('M_CW_MIX', 'Red and blue'), ...w('M_CW_MIX', 'Blue and green')], 'Red and yellow make orange.'],
    ['Which two colours make violet?', 'Blue and red', [...w('M_CW_MIX', 'Yellow and blue'), ...w('M_CW_MIX', 'Red and yellow'), ...w('M_CW_MIX', 'Green and red')], 'Blue and red make violet.'],
    ['Which two colours make green?', 'Yellow and blue', [...w('M_CW_MIX', 'Red and blue'), ...w('M_CW_MIX', 'Red and yellow'), ...w('M_CW_MIX', 'Orange and blue')], 'Yellow and blue make green.'],
  ], { h: ['Primary colours cannot be made by mixing others.', 'A secondary colour is a mix of two primaries.'], s1: 'Remember red, yellow, blue; then mix two.' })),
  fam('pc.cw.warm', `${PC}COLOUR_WHEEL`, 'word', 2, choose([
    ['Which colour is warm?', 'Orange', [...w('M_CW_WARM', 'Blue'), ...w('M_CW_WARM', 'Green'), ...w('M_CW_WARM', 'Violet')], 'Red, orange and yellow are warm colours.'],
    ['Which colour is cool?', 'Blue', [...w('M_CW_WARM', 'Red'), ...w('M_CW_WARM', 'Orange'), ...w('M_CW_WARM', 'Yellow')], 'Blue, green and violet are cool colours.'],
    ['Achieng wants to paint a hot sun. Which colours fit best?', 'Red, orange and yellow', [...w('M_CW_WARM', 'Blue, green and violet'), ...w('M_CW_WARM', 'Blue and green'), ...w('M_CW_WARM', 'Green and violet')], 'Warm colours remind us of fire and the sun.'],
    ['Otieno wants to paint cool water. Which colours fit best?', 'Blue, green and violet', [...w('M_CW_WARM', 'Red, orange and yellow'), ...w('M_CW_WARM', 'Red and orange'), ...w('M_CW_WARM', 'Orange and yellow')], 'Cool colours remind us of water and sky.'],
    ['A tertiary colour is made by mixing...', 'A primary colour with the secondary colour next to it', [...w('M_CW_MIX', 'Two secondary colours that are opposite'), ...w('M_CW_MIX', 'Black with white'), ...w('M_CW_SECONDARY_PRIMARY', 'Two primary colours')], 'A tertiary colour is a primary mixed with the secondary beside it.'],
  ], { h: ['Warm colours remind us of fire and the sun.', 'Cool colours remind us of water and sky.'], s1: 'Sort by fire or water.' })),
  fam('pc.cw.spot', `${PC}COLOUR_WHEEL`, 'spot', 3, spot([
    sp('Baraka explains the colour wheel.', ['Red, yellow and blue are primary colours.', 'Mixing two primaries gives a secondary colour.', 'Green is a primary colour.'], 2, 'Green is a secondary colour made from yellow and blue.', 'M_CW_SECONDARY_PRIMARY'),
    sp('Wanjiru explains colour mixing.', ['Red and yellow make orange.', 'Yellow and blue make green.', 'Red and blue make green.'], 2, 'Red and blue make violet.', 'M_CW_MIX'),
    sp('Kamau explains warm and cool.', ['Red is warm.', 'Orange is warm.', 'Blue is warm.'], 2, 'Blue is a cool colour.', 'M_CW_WARM'),
    sp('Mwende explains colour groups.', ['Primary colours cannot be made by mixing.', 'Orange is a secondary colour.', 'Yellow is a secondary colour.'], 2, 'Yellow is a primary colour.', 'M_CW_SECONDARY_PRIMARY'),
    sp('Nekesa explains cool colours.', ['Green is cool.', 'Violet is cool.', 'Yellow is cool.'], 2, 'Yellow is a warm colour.', 'M_CW_WARM'),
  ], { h: ['Check each step: primary, secondary, warm, cool.', 'Primary colours are red, yellow and blue.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PC.TECHNIQUES
  fam('pc.tq.what', `${PC}TECHNIQUES`, 'direct', 1, choose([
    ['What is a still life?', 'A painting of objects that do not move', [...w('M_PT_STILL', 'A painting of people running'), ...w('M_PT_STILL', 'A painting of a busy market'), ...w('M_PT_STILL', 'A painting of animals moving')], 'A still life shows objects that stay still, like fruit in a bowl.'],
    ['Which is a good subject for a still life?', 'A bowl of fruit and a jug', [...w('M_PT_STILL', 'Children playing football'), ...w('M_PT_STILL', 'A herd of cattle on the move'), ...w('M_PT_STILL', 'A bus passing')], 'Objects that stay still make a still life.'],
    ['What is a mat used for when a painting is mounted?', 'To make a card border round the painting', [...w('M_PT_MAT', 'To stand on when you paint outdoors'), ...w('M_PT_MAT', 'To cover the floor of the art room'), ...w('M_PT_MAT', 'To dry the paint on a sunny day')], 'A mat is the card border put round a painting for display.'],
    ['How is a collage made?', 'By gluing pieces of paper or cloth on a surface', [...w('M_PT_COLLAGE', 'By drawing with a pencil only'), ...w('M_PT_COLLAGE', 'By painting with one colour'), ...w('M_PT_COLLAGE', 'By carving wood')], 'A collage is pieces of material glued on a surface.'],
    ['Which material can be used in a collage?', 'Scraps of cloth and paper', [...w('M_PT_COLLAGE', 'Only pencils'), ...w('M_PT_COLLAGE', 'Only paint'), ...w('M_PT_COLLAGE', 'Only clay')], 'Collage uses many materials glued on a surface.'],
  ], { h: ['Think about what each word means in art.', 'Still means not moving; mat means a card border; collage means glued pieces.'], s1: 'Remember the meaning of the art word.' })),
  fam('pc.tq.use', `${PC}TECHNIQUES`, 'word', 2, choose([
    ['Achieng wants to display her painting neatly. What should she do?', 'Mount it on a mat so the border frames it', [...w('M_PT_MAT', 'Put it on the floor mat by the door'), ...w('M_PT_MAT', 'Roll it up in a cloth and tie it'), ...w('M_PT_MAT', 'Hide it in a drawer so it stays clean')], 'Mounting with a mat frames the painting.'],
    ['Otieno arranges an orange, a cup and a bottle on a table to paint. What kind of painting will it be?', 'A still life', [...w('M_PT_STILL', 'A collage'), ...w('M_PT_STILL', 'A portrait'), ...w('M_PT_STILL', 'A moving picture')], 'A painting of objects that do not move is a still life.'],
    ['Wanjiru glues bits of coloured paper and cloth into a picture of a market. What is it?', 'A collage', [...w('M_PT_COLLAGE', 'A still life'), ...w('M_PT_COLLAGE', 'A pencil drawing'), ...w('M_PT_COLLAGE', 'A stipple')], 'Gluing materials to make a picture is a collage.'],
    ['Which is the right order for mounting a painting?', 'Dry the painting, fix it to the card, then put the mat border round it', [...w('M_PT_MAT', 'Put the border on, then paint'), ...w('M_PT_MAT', 'Fix it wet, then dry the card'), ...w('M_PT_MAT', 'Mount it before painting')], 'The painting must be dry before it is mounted.'],
    ['What do brush strokes show in a painting?', 'The marks the brush leaves, which can show texture and movement', [...w('M_PT_COLLAGE', 'Pieces of paper glued on'), ...w('M_PT_MAT', 'The card border'), ...w('M_PT_STILL', 'Objects that stay still')], 'Brush strokes are the marks made by the brush.'],
  ], { h: ['Ask what the child did: painted objects, mounted, or glued materials.', 'A mat is the card border.'], s1: 'Match the work to its name.' })),

  // ---------------------------------------------------------------- VB.SKILLS
  fam('vb.sk.rules', `${VB}SKILLS`, 'direct', 1, choose([
    ['How many players are on the court for each volleyball team?', 'Six', [...w('M_VB_FEET', 'Eleven'), ...w('M_VB_FEET', 'Seven'), ...w('M_VB_FEET', 'Nine')], 'A volleyball team has six players on the court.'],
    ['What must a player not do with the ball in volleyball?', 'Catch it and hold it', [...w('M_VB_FEET', 'Hit it with the forearms'), ...w('M_VB_FEET', 'Hit it over the net'), ...w('M_VB_FEET', 'Pass it to a teammate')], 'In volleyball a player hits the ball and never holds it.'],
    ['Which part of the body is used for a dig pass?', 'The joined forearms', [...w('M_VB_DIG', 'The head'), ...w('M_VB_DIG', 'The feet'), ...w('M_VB_DIG', 'The elbows')], 'A dig pass lifts a low ball with the joined forearms.'],
    ['Where is the ball when it is struck in an under-arm serve?', 'Below the waist', [...w('M_VB_SERVE', 'Raised above the head like a mast'), ...w('M_VB_SERVE', 'At the chest'), ...w('M_VB_SERVE', 'Held behind the back, out of the way')], 'In an under-arm serve the ball is struck from below the waist.'],
    ['What is the purpose of a serve?', 'To start the rally by sending the ball over the net', [...w('M_VB_FEET', 'To catch the ball'), ...w('M_VB_SERVE', 'To pass it to the ref'), ...w('M_VB_FEET', 'To end the game')], 'The serve starts each rally.'],
  ], { h: ['Think about the rule: the ball is hit, never held.', 'Under-arm serve: from below the waist. Dig pass: forearms.'], s1: 'Recall the volleyball rule.' })),
  fam('vb.sk.play', `${VB}SKILLS`, 'word', 2, choose([
    ['Achieng\'s team receives a low, fast ball. Which skill does she use?', 'A dig pass with her forearms', [...w('M_VB_DIG', 'A header, like in football'), ...w('M_VB_FEET', 'A catch with both hands'), ...w('M_VB_FEET', 'A kick with the side foot')], 'A dig pass lifts a low ball with the forearms.'],
    ['Otieno starts a rally by tossing the ball and hitting it from below his waist. Which skill is it?', 'An under-arm serve', [...w('M_VB_SERVE', 'An overhead serve'), ...w('M_VB_FEET', 'A dig pass'), ...w('M_VB_FEET', 'A throw-in')], 'An under-arm serve is struck from below the waist.'],
    ['Wanjiru catches the ball and holds it in her hands. What is wrong?', 'In volleyball the ball is hit, never held', [...w('M_VB_FEET', 'Nothing, holding is allowed'), ...w('M_VB_FEET', 'She must kick it'), ...w('M_VB_FEET', 'She must throw it')], 'Holding or catching the ball is a fault.'],
    ['How should the arms be for a good dig pass?', 'Joined together and straight in front', [...w('M_VB_DIG', 'Spread wide apart like a bird\'s wings'), ...w('M_VB_DIG', 'Held behind the back, out of the way'), ...w('M_VB_DIG', 'Raised above the head like a mast')], 'Joined forearms make a flat surface for the ball.'],
    ['Which sentence is true of volleyball?', 'A team has six players and hits the ball over the net', [...w('M_VB_FEET', 'A team has eleven players and kicks the ball'), ...w('M_VB_FEET', 'Players may catch the ball'), ...w('M_VB_FEET', 'The ball must stay on the ground')], 'Six players hit the ball over the net.'],
  ], { h: ['Match the skill to the situation.', 'Dig = forearms; under-arm serve = below the waist.'], s1: 'Think about the way the ball is hit.' })),
  fam('vb.sk.spot', `${VB}SKILLS`, 'spot', 3, spot([
    sp('Baraka explains volleyball.', ['A team has six players.', 'The ball is hit over the net.', 'Players may catch the ball.'], 2, 'In volleyball the ball is never caught or held.', 'M_VB_FEET'),
    sp('Wanjiru explains the dig.', ['A dig pass lifts a low ball.', 'It uses the forearms.', 'It uses the head.'], 2, 'A dig pass uses the joined forearms.', 'M_VB_DIG'),
    sp('Kamau explains the under-arm serve.', ['It starts a rally.', 'The ball goes over the net.', 'The ball is struck above the head.'], 2, 'The ball is struck below the waist.', 'M_VB_SERVE'),
    sp('Mwende explains the rules.', ['The ball may touch the floor in play.', 'A team has six players.', 'Players kick the ball.'], 2, 'Players hit the ball with the hands or arms. They do not kick it.', 'M_VB_FEET'),
    sp('Nekesa explains the dig.', ['The arms are joined.', 'The ball is low.', 'The ball is caught and held.'], 2, 'The ball is lifted, never held.', 'M_VB_FEET'),
  ], { h: ['Check each step against the rules of volleyball.', 'The ball is hit, never held.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- RP.NOTES
  fam('rp.nt.beats', `${RP}NOTES`, 'direct', 1, choose([
    ['How many beats does a crotchet last?', 'One beat', [...w('M_RN_VALUE', 'Two beats'), ...w('M_RN_VALUE', 'Four beats'), ...w('M_RN_VALUE', 'Half a beat')], 'A crotchet lasts one beat.'],
    ['How many beats does a minim last?', 'Two beats', [...w('M_RN_VALUE', 'One beat'), ...w('M_RN_VALUE', 'Four beats'), ...w('M_RN_VALUE', 'Three beats')], 'A minim lasts two beats.'],
    ['How many beats does a semibreve last?', 'Four beats', [...w('M_RN_VALUE', 'Two beats'), ...w('M_RN_VALUE', 'One beat'), ...w('M_RN_VALUE', 'Three beats')], 'A semibreve lasts four beats.'],
    ['How many beats does a quaver last?', 'Half a beat', [...w('M_RN_VALUE', 'One beat'), ...w('M_RN_VALUE', 'Two beats'), ...w('M_RN_VALUE', 'Four beats')], 'Two quavers make one beat.'],
    ['What do you do at a rest?', 'Stay silent for its length', [...w('M_RN_REST', 'Clap one beat'), ...w('M_RN_REST', 'Clap twice'), ...w('M_RN_REST', 'Play the note louder')], 'A rest is a silence of the same length as its note.'],
  ], { h: ['Think: semibreve 4, minim 2, crotchet 1, quaver half.', 'A rest is a silence.'], s1: 'Recall how many beats each lasts.' })),
  fam('rp.nt.bar', `${RP}NOTES`, 'why', 2, choose([
    ['A three-beat bar has a minim and a crotchet. How many beats is that?', 'Three beats', [...w('M_RN_BAR', 'Two beats because there are two notes'), ...w('M_RN_BAR', 'Four beats'), ...w('M_RN_BAR', 'Five beats')], 'A minim is two beats and a crotchet is one: three beats.'],
    ['Which bar adds up to three beats?', 'A minim and a crotchet', [...w('M_RN_BAR', 'Three minims'), ...w('M_RN_BAR', 'A semibreve and a crotchet'), ...w('M_RN_BAR', 'Two minims')], 'Two beats plus one beat is three beats.'],
    ['Which bar adds up to three beats?', 'Three crotchets', [...w('M_RN_BAR', 'Three minims'), ...w('M_RN_BAR', 'A semibreve'), ...w('M_RN_BAR', 'Four crotchets')], 'Three crotchets are three beats.'],
    ['A bar has a crotchet, a crotchet rest and a crotchet. How do you play it?', 'Play, stay silent, play', [...w('M_RN_REST', 'Play, play, play'), ...w('M_RN_REST', 'Play, clap, play'), ...w('M_RN_BAR', 'Stay silent for the whole bar')], 'The rest lasts one beat of silence.'],
    ['What does a three-beat bar add up to?', 'Three beats, whatever notes are in it', [...w('M_RN_BAR', 'Three notes, whatever their length'), ...w('M_RN_BAR', 'Two notes'), ...w('M_RN_BAR', 'Four beats')], 'The beats, not the number of notes, make the bar.'],
  ], { h: ['Add the beats of the notes and rests in the bar.', 'A rest counts as silence for its length.'], s1: 'Add up the beats.' })),

  // ---------------------------------------------------------------- RP.PRINTING
  fam('rp.pr.steps', `${RP}PRINTING`, 'steps', 1, choose([
    ['What is the first step in block printing?', 'Draw and cut the motif on the block', [...w('M_BP_ORDER', 'Press the block on the paper straight away'), ...w('M_BP_ORDER', 'Roll ink on the block before anything else'), ...w('M_BP_ORDER', 'Lift the paper from the table')], 'First draw and cut the motif.'],
    ['Where is the ink put?', 'On the block', [...w('M_BP_INK', 'On the paper'), ...w('M_BP_INK', 'On the table'), ...w('M_BP_INK', 'On your hand')], 'The ink goes on the block.'],
    ['What happens after the block is inked?', 'It is pressed on the paper', [...w('M_BP_ORDER', 'It is cut again with a sharp knife'), ...w('M_BP_ORDER', 'It is thrown away after one print'), ...w('M_BP_ORDER', 'It is painted with a brush')], 'The inked block is pressed on the paper.'],
    ['What is a motif?', 'A single shape used in a design', [...w('M_BP_REPEAT', 'A whole finished pattern'), ...w('M_BP_REPEAT', 'A colour'), ...w('M_BP_REPEAT', 'A tool')], 'A motif is one shape, such as a circle or triangle.'],
    ['Which is a geometrical motif?', 'A triangle', [...w('M_BP_REPEAT', 'A crowd of people'), ...w('M_BP_REPEAT', 'A herd of cattle'), ...w('M_BP_REPEAT', 'A cloud shape drawn freehand')], 'A triangle is a geometrical shape.'],
  ], { h: ['Think of the order: cut, ink, press, lift.', 'The ink goes on the block, not the paper.'], s1: 'Think of the block as a stamp.' })),
  fam('rp.pr.repeat', `${RP}PRINTING`, 'why', 2, choose([
    ['What is a full repeat pattern?', 'The same motif repeated in even rows', [...w('M_BP_REPEAT', 'Different motifs placed at random'), ...w('M_BP_REPEAT', 'One motif printed once'), ...w('M_BP_REPEAT', 'A motif printed in different sizes')], 'A repeat pattern uses one motif again and again in even rows.'],
    ['Achieng prints a triangle in even rows across the paper. What has she made?', 'A repeat pattern', [...w('M_BP_REPEAT', 'A random pattern'), ...w('M_BP_REPEAT', 'A collage'), ...w('M_BP_REPEAT', 'A stipple')], 'Printing one motif in even rows makes a repeat pattern.'],
    ['Otieno prints a circle in different places with no order. Is it a repeat pattern?', 'No, it has no even rows', [...w('M_BP_REPEAT', 'Yes, any printing is a repeat'), ...w('M_BP_REPEAT', 'Yes, because it is a circle'), ...w('M_BP_REPEAT', 'Yes, because he used ink')], 'A repeat pattern needs even rows of the same motif.'],
    ['How can you keep a repeat pattern even?', 'Print each motif the same distance apart', [...w('M_BP_REPEAT', 'Print each motif where you like'), ...w('M_BP_REPEAT', 'Change the motif each time'), ...w('M_BP_INK', 'Use no ink on some prints')], 'Even spacing keeps the pattern regular.'],
    ['Put these in the right order: ink the block, cut the motif, press on paper.', 'Cut the motif, ink the block, press on paper', [...w('M_BP_ORDER', 'Ink the block, cut the motif, press on paper'), ...w('M_BP_ORDER', 'Press on paper, ink the block, cut the motif'), ...w('M_BP_ORDER', 'Press on paper, cut the motif, ink the block')], 'The block must be cut before it can be inked and pressed.'],
  ], { h: ['A repeat pattern uses the same motif in even rows.', 'Order: cut, ink, press.'], s1: 'Check for the same motif and even spacing.' })),
];
