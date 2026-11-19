// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 9, FOUNDATIONS, PICTURES, RHYTHM, ATHLETICS AND MELODY (19 Nov 2026, HOREB_QUESTIONS_PLAN.md):
// the first 13 of the 26 skills mapped on 18 Nov. Written offline from the KICD design through the curriculum map. The app asks
// the terms, the order and the reason; drawing, painting, singing, playing and every sports skill are performed and marked by the
// teacher with the KICD rubric. Music answers are standard staff-notation facts for a music teacher to confirm. Every wrong
// answer names the library misconception it reveals. All stay reviewed:false.
// ============================================================================
import { T } from './creativearts_g9_lib.js';

const M = (...s) => s.map(x => `M_CA9_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('cr', 'FOUNDA.CAREERS_IN_CREATIVE_ARTS.CAREERS', M('CR_ONLY_PERFORMER', 'CR_NO_MONEY', 'CR_AREA_MIX', 'CR_ENTERPRISE_JOB'),
    ['Think beyond the stage: who works behind it, and who runs a business.', 'Creative Arts and Sports have many careers (sound engineer, referee, set designer, physiotherapist, photographer) and can earn a living; entrepreneurship is starting your own business.'], [
      ['Which is a career in Creative Arts and Sports that is not performing?', 'Sound engineer', 'Only being a famous singer|0', 'There are none besides performing|0', 'None; it is only a hobby|1'],
      ['Can a person earn a steady living in the arts or sport?', 'Yes, at events and in media', 'No, it is only a hobby|1', 'Only if very famous|0', 'Only by working for a company|3'],
      ['Which area does a physiotherapist belong to?', 'Physical education and sports', 'Music|2', 'Theatre|2', 'Visual arts|2'],
      ['What is entrepreneurship in the creative arts?', 'Starting your own business', 'Working for a big company|3', 'Only performing on stage|0', 'Doing art as a hobby|1'],
      ['Which career belongs to theatre?', 'Set designer', 'Physiotherapist|2', 'Referee|2', 'Sound engineer only|0'],
    ], [
      ['Wanjiru loves sport but is not a fast runner. She thinks there is no career for her. Which could suit her?', 'Referee or coach', 'Only a famous athlete|0', 'None, sport is a hobby|1', 'A music teacher, in sport|2'],
      ['Kibet\'s parents say painting cannot pay. Which shows it can?', 'He sells portraits at events', 'It is only a hobby|1', 'Only famous painters earn|0', 'He must work for a company|3'],
      ['Mueni starts taking photos at weddings and is paid for it. What is this?', 'An entrepreneurial opportunity', 'A job only at a big company|3', 'Not a career, just fun|1', 'Only a performing career|0'],
      ['A careers chart lists a physiotherapist under music. Where should it go?', 'Physical education and sports', 'Music, as listed|2', 'Theatre|2', 'Visual arts|2'],
      ['Odhiambo wants to work in music but does not sing. Which career could suit him?', 'Sound engineer', 'Only a lead singer|0', 'None, music is a hobby|1', 'A physiotherapist in music|2'],
    ], [
      ['Achieng explains careers. ' + STEP, 'Singers and actors perform.', 'Athletes compete.', 'These performing careers are the only ones.', 'There are many more, such as sound engineers and referees.', 0],
      ['Brian explains earning a living. ' + STEP, 'People pay for art at events.', 'Businesses hire designers.', 'Still, the arts and sport cannot pay a steady living.', 'They can earn a living at events, for businesses and in media.', 1],
      ['Faith sorts careers by area. ' + STEP, 'A graphic designer is in visual arts.', 'A sound engineer is in music.', 'A physiotherapist is in music.', 'A physiotherapist is in physical education and sports.', 2],
      ['Juma explains entrepreneurship. ' + STEP, 'He makes beaded crafts.', 'He sells them at the market.', 'Entrepreneurship means working for a big company.', 'It means starting your own business, like his craft stall.', 3],
      ['Neema explains theatre careers. ' + STEP, 'Actors perform on stage.', 'Directors guide them.', 'Nobody else works in theatre.', 'Set designers and others work behind the stage.', 0],
    ], ['a', 'b', 'a']),

  ...T('pe', 'FOUNDA.COMPONENTS_OF_CREATIVE_A.PLAY_ELEMENTS', M('PE_CONFLICT_FIGHT', 'PE_RESOLUTION_START', 'PE_THEME_PLOT', 'PE_DIRECTIONS_SPOKEN'),
    ['Name the part of the play the question asks for.', 'Conflict is the problem the characters face; the resolution settles it near the end; the theme is the main idea; stage directions are acted, not spoken.'], [
      ['What is conflict in a play?', 'The problem the characters face', 'A fight with blows|0', 'The happy ending|1', 'The list of events|2'],
      ['Where does the resolution come in a play?', 'Near the end', 'At the start|1', 'Before the conflict|1', 'In the stage directions|3'],
      ['What is the theme of a play?', 'The main idea, such as honesty', 'What happens first, then next|2', 'A fight on stage|0', 'The words in brackets|3'],
      ['Are stage directions spoken by the actors?', 'No, they are acted', 'Yes, they are read aloud|3', 'Yes, by the narrator|3', 'Only in the resolution|1'],
      ['Which element is where and when the play happens?', 'The setting', 'The conflict, a fight|0', 'The resolution, at the start|1', 'The theme, the events|2'],
    ], [
      ['In a play, a girl must choose between telling the truth and protecting her friend. Kioko says there is no conflict because nobody fights. What is the conflict?', 'Her hard choice', 'There is none|0', 'The ending|1', 'The list of scenes|2'],
      ['Wambui says the resolution of her class play is the first scene. When is it?', 'Near the end', 'In the first scene|1', 'In the stage directions|3', 'In the middle fight|0'],
      ['Asked for the theme of a play about a boy who returns a lost wallet, Musa tells the whole story. What is the theme?', 'Honesty', 'The boy finds a wallet, then returns it|2', 'A fight over the wallet|0', 'The last scene|1'],
      ['During rehearsal, Halima reads aloud "(she walks to the door)". What should she do?', 'Walk to the door', 'Keep reading it aloud|3', 'Start a fight|0', 'Skip to the ending|1'],
      ['A play is set in a busy matatu stage in Nairobi at dusk. Which element is this?', 'The setting', 'The conflict|0', 'The theme|2', 'The resolution|1'],
    ], [
      ['Otieno explains conflict. ' + STEP, 'Every play has a problem.', 'The characters struggle with it.', 'So conflict always means a physical fight.', 'Conflict is the struggle or problem, not only a fight.', 0],
      ['Grace explains plot order. ' + STEP, 'The play opens with the setting.', 'The conflict builds.', 'The resolution comes at the start.', 'The resolution comes near the end, when the conflict is settled.', 1],
      ['Kevin explains theme. ' + STEP, 'The play is about two brothers.', 'One forgives the other.', 'The theme is: they quarrel, then make up.', 'That is the plot; the theme is forgiveness.', 2],
      ['Lucy explains stage directions. ' + STEP, 'They are written in brackets.', 'They tell actors what to do.', 'The actors speak them aloud.', 'They are acted, not spoken.', 3],
      ['Peter explains dialogue. ' + STEP, 'Dialogue is what characters say.', 'It shows their feelings.', 'Stage directions are also spoken dialogue.', 'Stage directions are acted, not spoken.', 3],
    ]),

  ...T('fp', 'FOUNDA.COMPONENTS_OF_CREATIVE_A.FITNESS_POWER', M('FP_POWER_STRENGTH', 'FP_REACTION_SPEED', 'FP_ACTIVITY', 'FP_START_REACTION'),
    ['Power is strength used fast; reaction time is how quickly you respond to a signal.', 'Power is strength used quickly (jumps, shot put); reaction time is how fast the body responds to a signal (a sprint start, a dropped ruler).'], [
      ['What is power in fitness?', 'Strength used quickly', 'The same as strength|0', 'How fast you run|1', 'Running for a long time|2'],
      ['What is reaction time?', 'How quickly you respond to a signal', 'How fast you run|1', 'How strong you are|0', 'How long you can jog|2'],
      ['Which activity trains power?', 'Standing long jumps', 'A long, slow jog|2', 'Walking for an hour|2', 'Waiting for a signal|3'],
      ['What does a sprint start train?', 'Reaction time', 'Endurance|3', 'Only strength|0', 'How fast you jog|1'],
      ['Which test measures reaction time?', 'Catching a dropped ruler', 'A long jog|2', 'Lifting a heavy bag slowly|0', 'Running a full lap|1'],
    ], [
      ['Kiprop can lift heavy bags slowly but jumps only a short way. Which component does he lack?', 'Power', 'Strength|0', 'Reaction time, his speed|1', 'Endurance from jogging|2'],
      ['Mwende is a fast runner but always leaves the blocks late. Which component should she train?', 'Reaction time', 'Running speed only|1', 'Endurance|3', 'Slow strength|0'],
      ['A coach wants to build power for the volleyball team. Which drill fits?', 'Vertical jumps', 'A 5 km jog|2', 'Slow walking|2', 'A long rest|3'],
      ['In PE, Wekesa catches a ruler dropped by his partner. What is being tested?', 'Reaction time', 'Endurance|3', 'Running speed|1', 'Strength|0'],
      ['A shot putter trains to push the shot fast and far. Which component is this?', 'Power', 'Only strength|0', 'Reaction to a gun|1', 'Endurance|3'],
    ], [
      ['Atieno explains power. ' + STEP, 'Strength is how much force you can make.', 'Power uses that force.', 'So power is the same as strength.', 'Power is strength used quickly.', 0],
      ['Kamau explains reaction time. ' + STEP, 'The starter fires the gun.', 'Runners leave the blocks.', 'Reaction time is how fast you run the race.', 'It is how quickly the body responds to the signal.', 1],
      ['Esther plans power training. ' + STEP, 'She wants to jump further.', 'She needs power.', 'She chooses a long, slow jog.', 'Standing long jumps or vertical jumps train power.', 2],
      ['Baraka explains a sprint start. ' + STEP, 'He crouches in the blocks.', 'He waits for the gun.', 'This trains his endurance.', 'A sprint start trains reaction time.', 3],
      ['Joy explains her jumps. ' + STEP, 'Jumping needs force.', 'It must be quick.', 'So jumping trains reaction time, not power.', 'Quick force is power.', 0],
    ]),

  ...T('gs', 'FOUNDA.COMPONENTS_OF_CREATIVE_A.GRAND_STAVE', M('GS_MIDDLE_C_TWO', 'GS_BASS_AS_TREBLE', 'GS_BRACE', 'GS_HIGH_LOW'),
    ['Name the clef first, then count the lines and spaces from the bottom.', 'The grand stave joins the treble and bass staves with a brace; treble lines are E G B D F, bass lines G B D F A; middle C sits on a ledger line between them; the bass staff holds the low notes.'], [
      ['Which note is on the bottom line of the bass staff?', 'G', 'E|1', 'F|1', 'C|0'],
      ['How many different middle Cs are on the grand stave?', 'One note, written from either staff', 'Two different notes|0', 'Three notes|0', 'None|3'],
      ['What does the brace on a grand stave show?', 'The staves are played together', 'Two different songs|2', 'A repeat|2', 'The high notes only|3'],
      ['Which staff holds the low notes?', 'The bass staff', 'The treble staff|3', 'Neither|3', 'Both are the same|0'],
      ['What are the line notes of the bass staff, bottom to top?', 'G B D F A', 'E G B D F|1', 'F A C E|1', 'C E G B D|0'],
    ], [
      ['Achieng reads the bottom line of the bass staff as E. What is it?', 'G', 'E, as she said|1', 'F|1', 'Middle C|0'],
      ['Ochieng sees middle C written below the treble staff and above the bass staff. He thinks they are two notes. What is true?', 'They are the same note', 'They are different|0', 'One is high, one low|3', 'They are from two songs|2'],
      ['A piano piece has two staves joined by a brace. Wairimu thinks they are two songs. What is true?', 'They are played together', 'Two different songs|2', 'Only the treble is played|3', 'The bass is played after|2'],
      ['Kioko wants to write a deep drum-like melody. Which staff should he use?', 'The bass staff', 'The treble staff|3', 'A staff with no clef|1', 'Any staff, it is all one|0'],
      ['Mary names the top line of the bass staff F. What is it?', 'A', 'F|1', 'E|1', 'C|0'],
    ], [
      ['Hassan reads the bass staff. ' + STEP, 'He saw the bass clef.', 'He found the bottom line.', 'He named it E, as on the treble staff.', 'The bottom line of the bass staff is G.', 1],
      ['Zawadi explains middle C. ' + STEP, 'It sits on a ledger line.', 'It can be written from either staff.', 'So there are two different middle Cs.', 'It is the same note, written from either staff.', 0],
      ['Kevin explains the grand stave. ' + STEP, 'It has a treble staff on top.', 'It has a bass staff below.', 'The brace joins two different songs.', 'The brace shows the staves are played together.', 2],
      ['Rose explains high and low. ' + STEP, 'The treble staff is on top.', 'The bass staff is below.', 'The bass staff is for the high notes.', 'The bass staff is for the low notes.', 3],
      ['Daudi names the bass spaces. ' + STEP, 'The bass staff has four spaces.', 'He counts from the bottom.', 'He names them F A C E, as on the treble.', 'The bass spaces are A C E G.', 1],
    ]),

  ...T('t4', 'FOUNDA.COMPONENTS_OF_CREATIVE_A.TIME_44', M('T4_DOT_DOUBLE', 'T4_TIE_DIFFERENT', 'T4_FIVE_BEATS', 'T4_ACCENT_ALL'),
    ['Count each bar to four, and remember what a dot and a tie add.', 'Four-four has four crotchet beats a bar (beat 1 strong, beat 3 medium); a dot adds half the note\'s value; a tie joins two notes of the same pitch.'], [
      ['How many beats does a dotted crotchet last?', 'One and a half', 'Two|0', 'Three|0', 'One|0'],
      ['Can a tie join two notes of different pitch?', 'No, only the same pitch', 'Yes, any two notes|1', 'Yes, if in one bar|1', 'Only across five beats|2'],
      ['How many crotchet beats are in a bar of four-four?', 'Four', 'Five|2', 'Three|2', 'It can change|2'],
      ['Which beats are stressed in four-four?', 'Beat 1 strongest, beat 3 medium', 'All four equally|3', 'Beat 4 strongest|3', 'Only beat 2|3'],
      ['How many beats does a dotted minim last?', 'Three', 'Four|0', 'Two and a half|0', 'Five|2'],
    ], [
      ['In a bar of four-four, Kiptoo writes a dotted minim and a minim. How many beats is that?', 'Five; the bar is wrong', 'Four; it is right|2', 'Six, since a dot doubles|0', 'Three|0'],
      ['Wanjiku ties a G to an A. What is wrong?', 'A tie joins notes of the same pitch', 'Nothing, any notes tie|1', 'The bar has five beats|2', 'Every beat is stressed|3'],
      ['Moses claps four-four with every beat equally loud. How should it sound?', 'Strong, weak, medium, weak', 'All four equal|3', 'Weak, weak, weak, strong|3', 'Five even claps|2'],
      ['Nanjala fills beats 1 and 2 of a bar with a dotted crotchet and a quaver. Is that right?', 'Yes, 1.5 + 0.5 = 2', 'No, a dot doubles the note|0', 'No, they must be tied|1', 'No, beat 2 must be strong|3'],
      ['A bar has a dotted crotchet, a quaver and a minim. Is it a full bar of four-four?', 'Yes, 1.5 + 0.5 + 2 = 4', 'No, a dot doubles it|0', 'No, it has five beats|2', 'Only if tied to a new pitch|1'],
    ], [
      ['Ali works out a dotted crotchet. ' + STEP, 'A crotchet is one beat.', 'A dot adds to it.', 'A dot doubles it, so it is two beats.', 'A dot adds half: one and a half beats.', 0],
      ['Grace explains ties. ' + STEP, 'A tie is a curved line.', 'It joins two notes into one sound.', 'It can join a C to a D.', 'A tie joins two notes of the same pitch.', 1],
      ['Kibet checks a bar. ' + STEP, 'The time is four-four.', 'He wrote a minim, a crotchet and a minim.', 'That is four beats, so the bar is full.', 'It is five beats; take one beat away.', 2],
      ['Mumbi explains stress. ' + STEP, 'Four-four has four beats.', 'They are crotchets.', 'All four beats are stressed equally.', 'Beat 1 is strongest and beat 3 medium.', 3],
      ['Otieno works out a dotted minim. ' + STEP, 'A minim is two beats.', 'A dot adds to it.', 'So a dotted minim is four beats.', 'A dot adds half: three beats.', 0],
    ]),

  ...T('fmj', 'FOUNDA.COMPONENTS_OF_CREATIVE_A.F_MAJOR', M('FM_SHARP', 'FM_WHICH_FLAT', 'FM_HOME', 'FM_FLAT_ONCE'),
    ['F major has one flat; find which note it is and where the scale starts and ends.', 'F major is F G A B-flat C D E F: one flat (B flat), starting and ending on F, and every B in the piece is flattened.'], [
      ['Which sign is in the key signature of F major?', 'One flat', 'One sharp|0', 'Two sharps|0', 'No sign|0'],
      ['Which note is flattened in F major?', 'B', 'E|1', 'A|1', 'F|1'],
      ['On which note does the F major scale end?', 'F', 'C|2', 'B flat|2', 'E|2'],
      ['Which Bs are flattened in a piece in F major?', 'Every B', 'Only the first one|3', 'Only Bs in bar 1|3', 'None|0'],
      ['Which is the scale of F major?', 'F G A B-flat C D E F', 'F G A B C D E F|1', 'F G A B-flat C D E C|2', 'F G A-sharp B C D E F|0'],
    ], [
      ['Atieno writes the F major key signature with a sharp. What should it have?', 'A flat', 'A sharp, as she wrote|0', 'Two sharps|0', 'Nothing|0'],
      ['Kevin flattens the E in his F major scale. Which note should be flattened?', 'B', 'E, as he did|1', 'A|1', 'C|1'],
      ['Wairimu\'s F major scale stops on C. Where should it end?', 'On F', 'On C, as she did|2', 'On B flat|2', 'On E|2'],
      ['In a song in F major, Juma flattens the first B but plays the later Bs natural. What is right?', 'Every B is B flat', 'Only the first is flat|3', 'No B is flat|0', 'Only Bs on beat 1|3'],
      ['A melody uses F G A B-flat C D E. Which key is it most likely in?', 'F major', 'A key with a sharp|0', 'A key with E flat|1', 'A key ending on C|2'],
    ], [
      ['Faith builds F major. ' + STEP, 'She starts on F.', 'She writes the notes up to F.', 'She adds a sharp to the B.', 'F major has a flat, B flat.', 0],
      ['Brian explains the key signature. ' + STEP, 'F major has one flat.', 'The flat is on one note.', 'The flat note is E.', 'The flat note is B.', 1],
      ['Lilian writes the scale. ' + STEP, 'She starts on F.', 'She writes F G A B-flat C D E.', 'She ends on C.', 'The scale ends on F, its home note.', 2],
      ['Omar plays a piece in F major. ' + STEP, 'He reads the key signature.', 'He sees one flat on B.', 'He flattens only the first B.', 'Every B in the piece is flattened.', 3],
      ['Nekesa checks her scale. ' + STEP, 'It runs F G A.', 'Then it has B.', 'Plain B is right in F major.', 'It must be B flat.', 1],
    ]),

  ...T('hm', 'CREATI.DRAWING_AND_PAINTING.HARMONY', M('HM_ALL_SAME', 'HM_CONTRAST', 'HM_DOMINANCE', 'HM_REPEAT_BAD'),
    ['Do the parts look as if they belong together?', 'Harmony (unity) is when the parts of a picture belong together, made by repeating similar colours, shapes, lines or textures; it is not contrast or dominance.'], [
      ['What is harmony in a picture?', 'The parts look as if they belong', 'Every part is exactly the same|0', 'One feature stands out|2', 'Strong clashing colours|1'],
      ['Which colours help show harmony?', 'Yellow and orange', 'Red and green|1', 'Black and white|1', 'Blue and orange|1'],
      ['When one feature stands out, which principle is it?', 'Dominance', 'Harmony|2', 'Unity|2', 'Repetition|3'],
      ['How is harmony made?', 'Repeat similar shapes or colours', 'Never repeat any shape|3', 'Make every part identical|0', 'Use clashing colours|1'],
      ['Must every part be the same colour for harmony?', 'No, only similar enough', 'Yes, all the same|0', 'Yes, and one must stand out|2', 'Yes, with no repeats|3'],
    ], [
      ['Achieng paints a market scene in warm browns, oranges and yellows with repeated round baskets. What principle does it show?', 'Harmony', 'Dominance|2', 'Contrast|1', 'No principle|3'],
      ['Kioko uses bright red and green side by side and calls it harmony. What is it?', 'Contrast', 'Harmony|1', 'Unity|1', 'Dominance only|2'],
      ['In Mwende\'s poster, one huge red sun stands out from everything. Which principle is this?', 'Dominance', 'Harmony|2', 'Unity|0', 'Repetition|3'],
      ['Brian\'s teacher asks for harmony. He avoids repeating any shape. What should he do?', 'Repeat similar shapes', 'Avoid repeats|3', 'Make it all one colour|0', 'Use clashing colours|1'],
      ['Wambui paints every leaf in a tree exactly the same size and colour. Is this needed for harmony?', 'No, similar is enough', 'Yes, all must match|0', 'Yes, plus one stand-out|2', 'No, use clashing colours|1'],
    ], [
      ['Kibet explains harmony. ' + STEP, 'Harmony means parts belong together.', 'It is also called unity.', 'So every part must be exactly the same.', 'Parts are similar enough to belong, not identical.', 0],
      ['Zainabu chooses colours. ' + STEP, 'She wants a calm, unified picture.', 'She picks colours for harmony.', 'She picks red and green.', 'Similar colours, such as yellow and orange, give harmony.', 1],
      ['Juma explains principles. ' + STEP, 'Contrast puts opposites together.', 'Harmony makes parts belong.', 'Harmony is when one feature stands out.', 'One feature standing out is dominance.', 2],
      ['Esther designs a pattern. ' + STEP, 'She wants harmony.', 'She uses similar colours.', 'She never repeats a shape, as it is boring.', 'Repeating similar shapes builds harmony.', 3],
      ['Peter explains texture. ' + STEP, 'Repeated textures can unite a picture.', 'Similar lines can too.', 'Harmony needs strong clashing colours.', 'Clashing colours give contrast, not harmony.', 1],
    ]),

  ...T('an', 'CREATI.DRAWING_AND_PAINTING.ANALOGOUS', M('AN_OPPOSITE', 'AN_PAIR', 'AN_ANY_THREE', 'AN_MOOD'),
    ['Find the colours on the wheel: are they side by side or across?', 'Analogous colours sit next to each other on the colour wheel (yellow, yellow-orange, orange) and give a calm, harmonious effect; complementary colours sit opposite.'], [
      ['Where do analogous colours sit on the colour wheel?', 'Next to each other', 'Opposite each other|0', 'Anywhere on the wheel|2', 'Spread out evenly|2'],
      ['Which set is analogous?', 'Blue, blue-green, green', 'Blue and orange|1', 'Red, yellow, blue|2', 'Red and green|1'],
      ['What effect do analogous colours give?', 'Calm and harmonious', 'Loud and clashing|3', 'Strong contrast|0', 'No effect|2'],
      ['Are red, yellow and blue analogous?', 'No, they are primaries, far apart', 'Yes, any three are|2', 'Yes, they are opposite|0', 'Yes, they clash|3'],
      ['Which colour sits between yellow and orange?', 'Yellow-orange', 'Blue|1', 'Violet, opposite|0', 'Any colour|2'],
    ], [
      ['Faith paints a sunset in yellow, yellow-orange and orange. What colour scheme is it?', 'Analogous', 'Complementary|0', 'Any three colours|2', 'Clashing|3'],
      ['Odera picks blue and orange as analogous. What are they?', 'Complementary, opposite', 'Analogous|1', 'Next to each other|1', 'Calm and close|3'],
      ['Wanjiku says red, yellow and blue are analogous because there are three. What are they?', 'The primaries, spread apart', 'Analogous|2', 'Next to each other|2', 'Opposite pairs|0'],
      ['Moraa wants a calm painting of a forest. Which colours suit?', 'Green, blue-green, blue', 'Red and green|0', 'Any three colours|2', 'Loud clashing colours|3'],
      ['Kibet says analogous colours look loud and clashing. What is true?', 'They look calm and harmonious', 'He is right|3', 'They are opposite|0', 'Any colours do that|2'],
    ], [
      ['Otieno explains analogous colours. ' + STEP, 'The colour wheel shows colours in order.', 'Some colours are close together.', 'Analogous colours sit opposite each other.', 'Analogous colours sit next to each other.', 0],
      ['Lucy chooses an analogous set. ' + STEP, 'She looks at the colour wheel.', 'She starts with blue.', 'She adds orange.', 'Orange is opposite; add blue-green and green.', 1],
      ['Kamau explains. ' + STEP, 'Analogous colours sit together.', 'He picks three colours.', 'Any three colours are analogous.', 'Only neighbours on the wheel are analogous.', 2],
      ['Halima explains mood. ' + STEP, 'She used yellow and orange.', 'They sit side by side.', 'They give a loud, clashing effect.', 'Analogous colours are calm and harmonious.', 3],
      ['Daniel explains complementary colours. ' + STEP, 'Complementary colours are opposite.', 'Red and green are an example.', 'So red and green are analogous too.', 'Analogous colours are neighbours, not opposites.', 0],
    ]),

  ...T('ne', 'CREATI.RHYTHM.NOTE_EXTENSION', M('NE_DOTTED_EVEN', 'NE_TIE_SOUND_TWICE', 'NE_DOT_REST', 'NE_NO_EFFECT'),
    ['A dot or a tie makes a note last longer; listen for long, then short.', 'A dot lengthens a note by half its value and a tie holds one sound across two notes; this gives long-short patterns and moves the stress.'], [
      ['How is a dotted crotchet followed by a quaver clapped?', 'Long, then short', 'Two even notes|0', 'Short, then long|0', 'With a silence after the dot|2'],
      ['How many times is a tied note sounded?', 'Once, held for both', 'Twice|1', 'Three times|1', 'Not at all|2'],
      ['What does a dot after a note do?', 'Makes it longer by half', 'Adds a short silence|2', 'Makes it shorter|2', 'Sounds it twice|1'],
      ['Does note extension change the feel of a rhythm?', 'Yes, long-short and moved stress', 'No|3', 'Only the speed|3', 'Only if sounded twice|1'],
      ['What often follows a dotted crotchet in a beat pattern?', 'A quaver', 'A silence from the dot|2', 'An even crotchet|0', 'The same note sounded again|1'],
    ], [
      ['In choir, Wekesa sings every syllable of a dotted line the same length. What should he change?', 'Hold dotted notes, cut quavers short', 'Nothing, even is right|0', 'Sing the quavers longer|0', 'Stop for a rest at each dot|2'],
      ['Nekesa plays two tied minims on the recorder by tonguing twice. What is right?', 'One sound held for both', 'Two sounds, as she did|1', 'A silence between|2', 'No change in feel|3'],
      ['Ali reads the dot after a note as a short rest. What does it mean?', 'The note lasts longer', 'A short rest|2', 'Play it twice|1', 'Nothing changes|3'],
      ['A song changes from even crotchets to dotted rhythms. Zawadi says the feel is the same. What is true?', 'It feels bouncier, long-short', 'It is the same|3', 'It gets silent gaps|2', 'Notes are played twice|1'],
      ['A drummer plays a dotted pattern for a lively dance. What does the dotting add?', 'A long-short swing', 'Even notes|0', 'Silences|2', 'Nothing|3'],
    ], [
      ['Kiprono claps a pattern. ' + STEP, 'He sees a dotted crotchet and a quaver.', 'Together they make two beats.', 'He claps them as two even notes.', 'Clap long, then short.', 0],
      ['Mumbi plays a tie. ' + STEP, 'Two notes are joined by a curve.', 'They are the same pitch.', 'She sounds each note separately.', 'Sound it once and hold it for both values.', 1],
      ['Baraka reads a dotted note. ' + STEP, 'He sees a minim with a dot.', 'He knows a dot changes the length.', 'He adds a short silence after it.', 'The dot makes the note longer by half its value.', 2],
      ['Esther explains rhythm. ' + STEP, 'Dots and ties lengthen notes.', 'They change the pattern.', 'But they do not change the feel of the rhythm.', 'They give long-short patterns and move the stress.', 3],
      ['Joy explains a tied crotchet and quaver. ' + STEP, 'The tie joins them.', 'Together they last one and a half beats.', 'The quaver is sounded again separately.', 'A tied note is sounded once.', 1],
    ]),

  ...T('tj', 'CREATI.ATHLETICS_AND_MOSAIC.TRIPLE_JUMP', M('TJ_HOP_OTHER_FOOT', 'TJ_ORDER', 'TJ_BIG_HOP', 'TJ_MEASURE'),
    ['Hop, step, jump: think which foot lands each time and where the jump is measured from.', 'Approach, then hop (land on the take-off foot), step (land on the other foot) and jump into the pit; balance the three phases; measure from the take-off board.'], [
      ['In which order are the phases of the triple jump?', 'Hop, step, jump', 'Jump, step, hop|1', 'Step, hop, jump|1', 'Jump, hop, step|1'],
      ['On which foot does the hop land?', 'The take-off foot', 'The other foot|0', 'Both feet|0', 'Either, it does not matter|0'],
      ['How big should the hop be?', 'Balanced with the step and jump', 'As big as possible|2', 'Bigger than the jump|2', 'Tiny, it does not count|1'],
      ['Where is the triple jump measured from?', 'The take-off board', 'Where the jump phase starts|3', 'The start of the run|3', 'Where the step lands|3'],
      ['Where does the jump phase end?', 'In the pit on both feet', 'On the take-off foot|0', 'On the board|3', 'With another hop|1'],
    ], [
      ['Kevin takes off on his right foot and lands his hop on his left. What is wrong?', 'The hop lands on the take-off foot', 'Nothing, any foot is fine|0', 'The order is wrong|1', 'The measure is wrong|3'],
      ['Shiru does a huge hop and then has no energy for the jump. What should she do?', 'Balance the three phases', 'Hop even bigger|2', 'Change the order|1', 'Measure from the hop|3'],
      ['Odhiambo\'s friend measures his jump from where the last jump began. Where should it be measured from?', 'The take-off board', 'From the last jump|3', 'From the step|3', 'From the run-up start|3'],
      ['A Grade 9 learner explains the triple jump as jump, step, hop. What is the right order?', 'Hop, step, jump', 'Jump, step, hop|1', 'Step, jump, hop|1', 'Hop, jump, step|1'],
      ['Mutua\'s step lands on the same foot as his hop. What is right?', 'The step lands on the other foot', 'The same foot again|0', 'Both feet|2', 'It does not matter|3'],
    ], [
      ['Kamau explains the triple jump. ' + STEP, 'He runs up fast.', 'He takes off from the board on his left foot.', 'He lands his hop on his right foot.', 'The hop lands on the same foot he took off from.', 0],
      ['Atieno explains the phases. ' + STEP, 'The approach run builds speed.', 'Then come three phases.', 'They are jump, step, hop.', 'They are hop, step, jump.', 1],
      ['Brian explains effort. ' + STEP, 'He wants a long total distance.', 'He has three phases.', 'He puts all his effort into a huge hop.', 'Balance the phases so energy is left for the jump.', 2],
      ['Nduta measures a jump. ' + STEP, 'The jumper lands in the pit.', 'She finds the nearest mark.', 'She measures from where the jump phase started.', 'Measure from the take-off board.', 3],
      ['Salim explains landing. ' + STEP, 'The hop lands on the take-off foot.', 'The step lands on the other foot.', 'The jump lands on the take-off foot again.', 'The jump ends in the pit on both feet.', 0],
    ]),

  ...T('ld', 'CREATI.ATHLETICS_AND_MOSAIC.LONG_DISTANCE', M('LD_800', 'LD_FAST_START', 'LD_LONG_STRIDE', 'LD_NO_WATER'),
    ['Think of the distance and what keeps a runner going to the end.', 'Long distance races are the 5 000 m, 10 000 m, marathon and cross-country; run at an even pace with a short relaxed stride, sip water at water points, and finish with a kick.'], [
      ['Which is a long distance race?', '10 000 m', '800 m|0', '100 m|0', '400 m|0'],
      ['How is a long distance race started?', 'At an even pace you can keep', 'As fast as possible|1', 'With long bounding strides|2', 'With no plan|1'],
      ['Which stride suits a long race?', 'Short and relaxed', 'Long and bounding|2', 'Sprinting strides|1', 'Any, it does not matter|2'],
      ['Should a marathon runner drink water during the race?', 'Yes, small sips at water points', 'No, it slows them|3', 'Only after the finish|3', 'Only at the start|3'],
      ['Which is a long distance event?', 'Cross-country', '800 m|0', 'A 100 m sprint|0', 'Long jump|0'],
    ], [
      ['Wafula enters the 800 m and calls it a long distance race. What is it?', 'A middle distance race', 'Long distance|0', 'A marathon|0', 'Cross-country|0'],
      ['In a 5 000 m race, Chebet sprints the first lap and then cannot finish. What should she do?', 'Run at an even pace', 'Sprint harder at the start|1', 'Take longer strides|2', 'Skip water|3'],
      ['Kibet uses long bounding strides in the 10 000 m and tires fast. What is better?', 'A short, economical stride', 'Longer strides|2', 'A sprint start|1', 'No water at all|3'],
      ['A runner refuses water in a hot marathon, saying it slows him. What is true?', 'Small sips help him', 'He is right|3', 'He should sprint more|1', 'He should bound more|2'],
      ['Kenyan marathon runners often run each kilometre in almost the same time. Why?', 'An even pace saves energy', 'They start as fast as possible|1', 'Long strides are best|2', 'They avoid water|3'],
    ], [
      ['Mercy explains long distance races. ' + STEP, 'The marathon is long distance.', 'The 10 000 m is long distance.', 'The 800 m is long distance too.', 'The 800 m is a middle distance race.', 0],
      ['Kiptoo explains pace. ' + STEP, 'A long race needs energy to the end.', 'Pacing saves energy.', 'So he starts as fast as he can.', 'Start at an even pace you can keep.', 1],
      ['Wanjiku explains her stride. ' + STEP, 'She keeps her arms relaxed.', 'She breathes steadily.', 'She uses long bounding strides.', 'Use a short, relaxed, economical stride.', 2],
      ['Ouma explains water. ' + STEP, 'Long races are tiring.', 'The body loses water in sweat.', 'Runners should not drink during the race.', 'Small sips at water points help.', 3],
      ['Rehema explains the finish. ' + STEP, 'She runs at an even pace.', 'She saves a finishing kick.', 'She sprints the whole first half.', 'Keep an even pace until the finishing kick.', 1],
    ]),

  ...T('ms', 'CREATI.ATHLETICS_AND_MOSAIC.MOSAIC', M('MS_PAINT', 'MS_RANDOM', 'MS_MIXED_MATERIALS', 'MS_BIG_PIECES'),
    ['A mosaic is built from small pieces placed to a plan.', 'A mosaic is made of small pieces (tesserae) of one material, placed close together with small even gaps, following a planned design.'], [
      ['How is a mosaic made?', 'By placing small pieces', 'By painting small dots|0', 'By mixing any materials|2', 'With a few big pieces|3'],
      ['What is done before pieces are placed?', 'Sketch the design', 'Nothing; place them anywhere|1', 'Paint dots|0', 'Mix many materials|2'],
      ['How many kinds of material does a mosaic usually use?', 'One kind, in many colours', 'Many kinds, like a collage|2', 'Paint only|0', 'A few big pieces|3'],
      ['Why are small pieces used?', 'They show shape and detail', 'They are cheaper to buy|3', 'They are painted|0', 'They need no plan|1'],
      ['What are the small pieces of a mosaic called?', 'Tesserae', 'Painted dots|0', 'Collage scraps|2', 'Big tiles|3'],
    ], [
      ['Kendi paints her picture in small coloured dots and calls it a mosaic. What is it?', 'A painting, not a mosaic', 'A mosaic|0', 'A collage|2', 'A big-piece mosaic|3'],
      ['Musa sticks seeds down anywhere with no plan. The picture is unclear. What should he do?', 'Sketch and plan first', 'Place them anywhere|1', 'Add paint dots|0', 'Use bigger pieces|3'],
      ['Nanjala mixes seeds, buttons, cloth and paper in one picture. What is she making?', 'A collage, not a mosaic', 'A mosaic|2', 'A painting|0', 'A big-piece mosaic|3'],
      ['Ali uses six big pieces of tile for a portrait. The face has no detail. What is better?', 'Many small pieces', 'Bigger pieces|3', 'Painting the face|0', 'No plan|1'],
      ['A class makes a mosaic of a lion from coloured eggshells. Which plan is right?', 'Sketch, then small pieces, even gaps', 'Big pieces, no plan|3', 'Paint dots, mix materials|0', 'Place them anywhere|1'],
    ], [
      ['Achieng explains a mosaic. ' + STEP, 'A mosaic is a picture.', 'It shows shapes with colour.', 'It is made by painting small dots.', 'It is made by placing small pieces close together.', 0],
      ['Kevin explains planning. ' + STEP, 'He chose seeds of three colours.', 'He prepared the glue.', 'He placed the seeds anywhere, with no plan.', 'Sketch the design and plan the colours first.', 1],
      ['Grace explains materials. ' + STEP, 'She chose bottle tops.', 'She sorted them by colour.', 'She added cloth and paper scraps like a collage.', 'A mosaic uses one kind of material in different colours.', 2],
      ['Peter explains piece size. ' + STEP, 'He planned a face.', 'He chose stones.', 'He used a few big stones to save time.', 'Small pieces show shape and detail.', 3],
      ['Lilian explains gaps. ' + STEP, 'She placed pieces close together.', 'She left small even gaps.', 'She then painted dots between them.', 'The gaps stay as grout lines; it is not painted.', 0],
    ]),

  ...T('va', 'CREATI.MELODY.VARIATION', M('VA_EXACT_COPY', 'VA_ALL_NEW', 'VA_ONLY_PITCH', 'VA_END_ANYWHERE'),
    ['A variation keeps the phrase recognisable but changes something.', 'Variation repeats a phrase with a change in some pitches, the rhythm, or by moving it higher or lower (sequence); too much change loses the link; a melody in F major ends on F.'], [
      ['What is a variation of a phrase?', 'The phrase, changed a little', 'An exact copy|0', 'A completely new phrase|1', 'A phrase ending anywhere|3'],
      ['What happens if every note is changed?', 'The link to it is lost', 'It is a good variation|1', 'It is an exact copy|0', 'Only pitch can change|2'],
      ['Besides pitch, what can be varied?', 'The rhythm', 'Nothing|2', 'Only the key signature|2', 'The ending note only|3'],
      ['On which note does a melody in F major usually end?', 'F', 'C|3', 'B flat|3', 'Any note|3'],
      ['What is a sequence?', 'The phrase moved up or down', 'An exact repeat of it|0', 'All new notes|1', 'Only a pitch change|2'],
    ], [
      ['Wanjiru repeats her opening phrase note for note and calls it a variation. What is it?', 'An exact repeat', 'A variation|0', 'A sequence|2', 'A new melody|1'],
      ['Kibet changes every note of his phrase. Listeners cannot hear the link. What went wrong?', 'Too much was changed', 'Nothing, it is a variation|1', 'Too little was changed|0', 'He changed the rhythm|2'],
      ['Mwende keeps the pitches but changes the rhythm of her phrase. Is this a variation?', 'Yes, rhythm can be varied', 'No, only pitch can change|2', 'No, it is a copy|0', 'No, it is all new|1'],
      ['Odera\'s melody in F major ends on C and sounds unfinished. Where should it end?', 'On F', 'On C|3', 'On E|3', 'Anywhere|3'],
      ['Faith moves her whole phrase two steps higher and plays it again. What is this?', 'A sequence, a kind of variation', 'An exact copy|0', 'A new tune|1', 'Not a variation|2'],
    ], [
      ['Otieno explains variation. ' + STEP, 'He wrote a four-bar phrase.', 'He repeated it.', 'He kept every note the same and called it a variation.', 'A variation repeats the phrase with a change.', 0],
      ['Halima explains her answer phrase. ' + STEP, 'Her opening phrase is simple.', 'She wants an answering phrase.', 'She changed every single note.', 'Change only some notes so the link stays.', 1],
      ['Musa explains ways to vary. ' + STEP, 'Pitches can be changed.', 'He wants more ideas.', 'Only pitches can ever be varied.', 'Rhythm can change, or it can move higher or lower.', 2],
      ['Lucy finishes her melody. ' + STEP, 'It is in F major.', 'It uses variation.', 'It ends on C.', 'A melody in F major ends on F.', 3],
      ['Daudi explains a sequence. ' + STEP, 'He plays his phrase.', 'He plays it again a step higher.', 'This is an exact copy, not a variation.', 'Moving it higher is a sequence, a kind of variation.', 0],
    ]),
];
