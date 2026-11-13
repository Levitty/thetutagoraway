// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 7: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/creative_arts/g7.json by scripts/build-creativearts-g7.mjs. KICD's outcomes and rubrics are never touched.
// Most outcomes are performing, making or playing: they are marked by a teacher and are not tested here. The knowledge halves that a
// tapped question can test (elements of a story, components of fitness, note values and pitches on the treble staff, balance, colour
// temperature, javelin, handball, football, swimming, folk songs, beadwork, rope games, sports values) are built.
// Safety: throwing, diving and contact skills are shown by a teacher or coach; questions ask only for names, order and rules.
// Everything is draft until a Creative Arts and Sports teacher reviews it.
// A skill: [sub-strand key after 'CREA.G7.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const IN = 'FOUNDA.INTRODUCTION_TO_CREATIVE', CO = 'FOUNDA.COMPONENTS_OF_CREATIVE_A', DP = 'CREATI.DRAWING_AND_PAINTING', RH = 'CREATI.RHYTHM', JS = 'CREATI.JAVELIN_AND_SCULPTURE';
const ME = 'CREATI.MELODY', HB = 'CREATI.HANDBALL', DR = 'CREATI.DESCANT_RECORDER', SA = 'CREATI.STORYTELLING_AND_ANIMATI', FB = 'CREATI.FOOTBALL';
const FS = 'CREATI.KENYAN_FOLK_SONGS', IC = 'CREATI.INDIGENOUS_KENYAN_CRAFT', SW = 'CREATI.SWIMMING', IG = 'CREATI.KENYAN_INDIGENOUS_GAMES', AN = 'APPREC.ANALYSIS_OF_CREATIVE_ART';
const FM = ['pick the right answer', 'pick the right answer in a short story', 'find the false step in a learner\'s reason'];
export const SKILLS = [
  [IN, 'CA_CATEGORIES', 'Name the categories of Creative Arts and Sports and how they relate', ['a', 'b'], [], FM, 'The child names the categories (art and craft, music, physical education and sports, and performing arts such as drama and dance) and says they work together, for example music with dance and drama.'],
  [CO, 'STORY_ELEMENTS', 'Name the elements of a story', ['a'], [], FM, 'The child names characters, setting, plot and theme as elements of a story, and says the setting is where and when it happens.'],
  [CO, 'FITNESS_COMPONENTS', 'Name the components of fitness', ['b'], [], FM, 'The child names health-related components (cardiovascular endurance, muscular strength, muscular endurance, flexibility, body composition) and skill-related ones (agility, balance, coordination, power, speed, reaction time).'],
  [CO, 'NOTE_VALUES', 'Read note values and group notes in 2 time', ['c', 'e'], [], FM, 'The child says a semibreve is 4 beats, a minim 2, a crotchet 1 and a quaver half a beat, and that a bar in 2 time (two crotchet beats) holds the value of two crotchets.'],
  [CO, 'TREBLE_PITCHES', 'Name pitches on the treble staff', ['d'], ['NOTE_VALUES'], FM, 'The child says the lines of the treble staff from the bottom are E G B D F and the spaces are F A C E, and names a note by its place.'],
  [DP, 'BALANCE', 'Tell how balance works in a picture', ['a'], [], FM, 'The child says balance is the even spread of visual weight in a picture, and names symmetrical (both sides alike), asymmetrical (different but equal in weight) and radial (spreading from the centre) balance.'],
  [DP, 'COLOUR_TEMP', 'Tell warm colours from cool colours', ['c'], [], FM, 'The child says red, orange and yellow are warm colours (like fire and sun) and blue, green and violet are cool (like water and sky), and says warm colours seem to come forward.'],
  [RH, 'RHYTHM_FACTORS', 'Name the factors in making a rhythm in simple time', ['a'], ['NOTE_VALUES'], FM, 'The child says a rhythm pattern depends on the time signature, the number of bars, the note values and rests, and that the beats in each bar must add up.'],
  [JS, 'JAVELIN', 'Name materials for carving and the phases of a javelin throw', ['a', 'd'], [], FM, 'The child names carving materials (soft wood, bamboo) and the throwing phases in order (grip and carry, approach run, cross-step, delivery, recovery), and says a javelin is thrown only with a teacher in a cleared field.'],
  [ME, 'MELODY_QUALITIES', 'Name the qualities of a good melody in C major', ['a'], ['NOTE_VALUES'], FM, 'The child says a good melody has a clear shape, uses steps and some leaps, repeats a phrase, and ends on the home note C in C major.'],
  [HB, 'HANDBALL', 'Describe passing, dribbling and the jump shot in handball', ['a'], [], FM, 'The child says handball is played with the hands, a team has seven players with one goalkeeper, a player may take three steps and hold the ball for three seconds, dribbles by bouncing, and in a jump shot throws while in the air.'],
  [DR, 'RECORDER_FACTORS', 'Name the factors for reading a melody on the recorder', ['a'], ['NOTE_VALUES', 'TREBLE_PITCHES'], FM, 'The child names the clef, key signature, time signature, note values, rests, dynamics and tempo as things to check before playing.'],
  [SA, 'STORY_TECHNIQUES', 'Name the techniques of storytelling and the qualities of a good flipbook', ['a', 'b'], ['STORY_ELEMENTS'], FM, 'The child names voice variation, gestures, facial expression, pauses and audience participation, and says a good flipbook has many drawings that change a little each time, in the same place on each page.'],
  [FB, 'FOOTBALL_SKILLS', 'Name football skills and how crayon etching is made', ['a', 'b', 'c', 'd'], [], FM, 'The child says trapping stops and controls the ball, dribbling keeps the ball close while moving, shooting sends it at the goal, a team has eleven players, and crayon etching scratches a top dark layer to show colours beneath.'],
  [FS, 'FOLK_SONGS', 'Classify folk songs in Kenyan communities', ['a'], [], FM, 'The child names kinds of folk songs (lullabies, work songs, wedding songs, initiation songs, war songs, funeral songs, children\'s play songs) and what each is sung for.'],
  [IC, 'BEADWORK', 'Say what jewellery is for and name materials for beadwork', ['a', 'b'], [], FM, 'The child says jewellery decorates, shows identity and status, and marks ceremonies, and names materials for beadwork (beads, thread, wire, needle, leather).'],
  [SW, 'SWIMMING', 'Describe water entry and the backstroke', ['a', 'd'], [], FM, 'The child says water entry may be feet first or by a dive, that in a pencil dive the body is straight with feet first, that in a crouch dive the body is crouched on the pool edge, and that in backstroke the swimmer lies on the back with alternate arm strokes and a flutter kick; swimming is only with a lifeguard.'],
  [IG, 'ROPE_GAMES', 'Name indigenous rope games and their benefits', ['a', 'd'], [], FM, 'The child names rope skipping, tug of war and rope jumping, and says rope games build fitness, coordination and teamwork.'],
  [AN, 'SPORTS_VALUES', 'Name the values of clean sports', ['a'], [], FM, 'The child names fair play, honesty, respect, teamwork and discipline as the spirit of clean sport, and says cheating and drugs spoil sport.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_CA7_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('CA_CATEGORIES', 'CC_ONE_ONLY', 'Thinks the categories are separate.', 'How do music and dance relate?', 'They never go together', 'They often work together', 'Music and dance often work together.'),
  m('CA_CATEGORIES', 'CC_SPORT', 'Leaves sports out of the arts.', 'Which is a category of Creative Arts and Sports?', 'Mathematics', 'Physical education and sports', 'Physical education and sports is a category.'),
  m('CA_CATEGORIES', 'CC_ARTS', 'Thinks only painting is art.', 'Which is art and craft?', 'Playing football', 'Making a collage', 'A collage is art and craft.'),
  m('STORY_ELEMENTS', 'SE_SETTING', 'Says setting is the people.', 'What is the setting of a story?', 'The people in it', 'Where and when it happens', 'The setting is the place and time.'),
  m('STORY_ELEMENTS', 'SE_CHARACTER', 'Says characters are the place.', 'Who are the characters?', 'The place of the story', 'The people or animals in it', 'Characters are the people or animals in the story.'),
  m('STORY_ELEMENTS', 'SE_PLOT', 'Says plot is the title.', 'What is the plot?', 'The title of the story', 'The order of events', 'The plot is the order of events.'),
  m('FITNESS_COMPONENTS', 'FC_AGILITY', 'Mixes agility with flexibility.', 'Which is the ability to change direction quickly?', 'Flexibility', 'Agility', 'Agility is changing direction quickly.'),
  m('FITNESS_COMPONENTS', 'FC_FLEX', 'Mixes flexibility with strength.', 'Which is the range of movement at a joint?', 'Strength', 'Flexibility', 'Flexibility is the range of movement at a joint.'),
  m('FITNESS_COMPONENTS', 'FC_ENDURANCE', 'Mixes endurance with speed.', 'Which is lasting a long time without tiring?', 'Speed', 'Endurance', 'Endurance is lasting a long time without tiring.'),
  m('NOTE_VALUES', 'NV_MINIM', 'Gives the wrong beats for a minim.', 'How many beats is a minim?', '1', '2', 'A minim is 2 beats.'),
  m('NOTE_VALUES', 'NV_SEMIBREVE', 'Gives the wrong beats for a semibreve.', 'How many beats is a semibreve?', '2', '4', 'A semibreve is 4 beats.'),
  m('NOTE_VALUES', 'NV_BAR', 'Gives the wrong total for a bar in 2 time.', 'In 2 time, a bar holds how many crotchet beats?', '4', '2', 'A bar in 2 time holds 2 crotchet beats.'),
  m('TREBLE_PITCHES', 'TP_LINES', 'Gives the spaces for the lines.', 'What are the lines of the treble staff from the bottom?', 'F A C E', 'E G B D F', 'The lines are E G B D F.'),
  m('TREBLE_PITCHES', 'TP_SPACES', 'Gives the lines for the spaces.', 'What are the spaces of the treble staff from the bottom?', 'E G B D F', 'F A C E', 'The spaces are F A C E.'),
  m('TREBLE_PITCHES', 'TP_FIRST', 'Names the wrong first line.', 'Which note is on the bottom line of the treble staff?', 'F', 'E', 'The bottom line is E.'),
  m('BALANCE', 'BL_SYM', 'Does not know symmetrical.', 'What is symmetrical balance?', 'Both sides are different', 'Both sides are alike', 'Symmetrical balance has both sides alike.'),
  m('BALANCE', 'BL_MEANING', 'Thinks balance is about size only.', 'What is balance in a picture?', 'Making everything the same colour', 'Spreading visual weight evenly', 'Balance is the even spread of visual weight.'),
  m('BALANCE', 'BL_RADIAL', 'Does not know radial.', 'What is radial balance?', 'Items spread from the centre', 'Items in a straight line', 'Radial balance spreads from the centre.'),
  m('COLOUR_TEMP', 'CT_WARM', 'Puts blue among warm colours.', 'Which is a warm colour?', 'Blue', 'Orange', 'Red, orange and yellow are warm.'),
  m('COLOUR_TEMP', 'CT_COOL', 'Puts red among cool colours.', 'Which is a cool colour?', 'Red', 'Blue', 'Blue, green and violet are cool.'),
  m('COLOUR_TEMP', 'CT_FEEL', 'Mixes the feeling of warm and cool.', 'Which colours remind us of the sun and fire?', 'Cool colours', 'Warm colours', 'Warm colours remind us of sun and fire.'),
  m('RHYTHM_FACTORS', 'RF_BEATS', 'Thinks beats need not add up.', 'In a bar of 2 time, the notes must add up to...', 'Any number of beats', 'Two crotchet beats', 'The notes in each bar add up to the time signature.'),
  m('RHYTHM_FACTORS', 'RF_FACTOR', 'Names a non-factor.', 'Which is a factor in making a rhythm?', 'The colour of the paper', 'The time signature', 'The time signature is a factor.'),
  m('RHYTHM_FACTORS', 'RF_BARS', 'Gives the wrong count of bars.', 'How many bars are in a four-bar pattern?', 'Two', 'Four', 'A four-bar pattern has four bars.'),
  m('JAVELIN', 'JV_MATERIAL', 'Names an unsuitable carving material.', 'Which material suits carving a javelin?', 'Iron', 'Soft wood', 'Soft wood or bamboo is carved.'),
  m('JAVELIN', 'JV_PHASE', 'Puts delivery before approach.', 'Which phase comes first in a javelin throw?', 'Delivery', 'Grip and carry', 'The grip and carry come first, then the approach run.'),
  m('JAVELIN', 'JV_SAFETY', 'Says a javelin may be thrown anywhere.', 'Where is a javelin thrown?', 'Anywhere among people', 'Only in a cleared field with a teacher', 'A javelin is thrown only in a cleared field with a teacher.'),
  m('MELODY_QUALITIES', 'MQ_HOME', 'Ends a melody on any note.', 'On which note does a melody in C major end?', 'G', 'C', 'A melody in C major ends on C.'),
  m('MELODY_QUALITIES', 'MQ_SHAPE', 'Thinks a melody has no shape.', 'Which is a quality of a good melody?', 'No pattern at all', 'A clear shape with steps and leaps', 'A good melody has a clear shape.'),
  m('MELODY_QUALITIES', 'MQ_REPEAT', 'Thinks repetition is wrong.', 'Why repeat a phrase in a melody?', 'To make it harder to sing', 'To make it easy to remember', 'Repetition makes a melody easy to remember.'),
  m('HANDBALL', 'HB_PLAYERS', 'Gives the wrong number of players.', 'How many players are in a handball team, with the goalkeeper?', 'Eleven', 'Seven', 'A handball team has seven players.'),
  m('HANDBALL', 'HB_HANDS', 'Says handball is played with the feet.', 'How is handball played?', 'With the feet', 'With the hands', 'Handball is played with the hands.'),
  m('HANDBALL', 'HB_STEPS', 'Gives the wrong number of steps.', 'How many steps may a player take with the ball?', 'Ten', 'Three', 'A player may take three steps with the ball.'),
  m('RECORDER_FACTORS', 'RC_FACTOR', 'Names a non-factor.', 'What should you check before playing a melody?', 'The colour of the recorder', 'The time signature and key', 'Check the time signature and key.'),
  m('RECORDER_FACTORS', 'RC_REST', 'Says a rest means play louder.', 'What does a rest mean?', 'Play louder', 'Be silent for its length', 'A rest is a silence.'),
  m('RECORDER_FACTORS', 'RC_TEMPO', 'Mixes tempo and dynamics.', 'Which tells how fast to play?', 'Dynamics', 'Tempo', 'Tempo tells how fast to play.'),
  m('STORY_TECHNIQUES', 'ST_VOICE', 'Thinks a storyteller must keep one flat voice.', 'Which is a storytelling technique?', 'Using one flat voice', 'Varying the voice', 'Storytellers vary their voice.'),
  m('STORY_TECHNIQUES', 'ST_FLIP', 'Says a flipbook has one picture.', 'What does a good flipbook have?', 'One picture', 'Many pictures that change a little', 'A flipbook has many pictures that change a little each time.'),
  m('STORY_TECHNIQUES', 'ST_AUDIENCE', 'Thinks the audience must stay silent.', 'How can a storyteller involve the audience?', 'Never let them speak', 'Ask them to join in', 'Storytellers invite the audience to join in.'),
  m('FOOTBALL_SKILLS', 'FS_TRAP', 'Mixes trapping and shooting.', 'What is trapping?', 'Kicking at the goal', 'Stopping and controlling the ball', 'Trapping is stopping and controlling the ball.'),
  m('FOOTBALL_SKILLS', 'FS_DRIBBLE', 'Says dribbling is passing.', 'What is dribbling?', 'Passing to a friend', 'Keeping the ball close while moving', 'Dribbling keeps the ball close while moving.'),
  m('FOOTBALL_SKILLS', 'FS_ETCH', 'Does not know crayon etching.', 'How is crayon etching made?', 'By painting over water', 'By scratching a dark top layer', 'Crayon etching scratches a top layer to show colours.'),
  m('FOLK_SONGS', 'FO_LULLABY', 'Says a lullaby is a war song.', 'What is a lullaby for?', 'Going to war', 'Putting a baby to sleep', 'A lullaby puts a baby to sleep.'),
  m('FOLK_SONGS', 'FO_WORK', 'Says a work song is for sleeping.', 'When is a work song sung?', 'At bedtime', 'While working', 'A work song is sung while working.'),
  m('FOLK_SONGS', 'FO_FUNERAL', 'Mixes funeral with wedding songs.', 'Which song is sung at a funeral?', 'A wedding song', 'A dirge', 'A dirge is a funeral song.'),
  m('BEADWORK', 'BW_MATERIAL', 'Names an unsuitable material.', 'Which is a material for beadwork?', 'Cement', 'Thread and beads', 'Beadwork uses beads and thread.'),
  m('BEADWORK', 'BW_FUNCTION', 'Says jewellery only decorates.', 'What does jewellery show in Kenyan communities?', 'Nothing at all', 'Identity, status and ceremonies', 'Jewellery shows identity, status and ceremonies.'),
  m('BEADWORK', 'BW_TOOL', 'Names a wrong tool.', 'Which tool is used for beading?', 'A hammer', 'A needle', 'A needle is used for beading.'),
  m('SWIMMING', 'SM_PENCIL', 'Mixes pencil dive and crouch dive.', 'In a pencil dive, how does the body enter the water?', 'Head first with arms apart', 'Feet first, body straight', 'In a pencil dive the body is straight, feet first.'),
  m('SWIMMING', 'SM_BACK', 'Says backstroke is on the front.', 'In backstroke the swimmer lies on...', 'The front', 'The back', 'In backstroke the swimmer lies on the back.'),
  m('SWIMMING', 'SM_SAFETY', 'Says swimming alone is fine.', 'When should a learner swim?', 'Alone at any time', 'With a lifeguard or teacher', 'Swim only with a lifeguard or teacher.'),
  m('ROPE_GAMES', 'RG_NAME', 'Names a non-rope game.', 'Which is a rope game?', 'Football', 'Tug of war', 'Tug of war is a rope game.'),
  m('ROPE_GAMES', 'RG_BENEFIT', 'Says rope games make people less fit.', 'What do rope games build?', 'Weak muscles', 'Fitness and coordination', 'Rope games build fitness and coordination.'),
  m('ROPE_GAMES', 'RG_SKIP', 'Says skipping is done sitting.', 'How is rope skipping done?', 'Sitting down', 'Jumping over the rope', 'In skipping one jumps over the rope.'),
  m('SPORTS_VALUES', 'SV_CHEAT', 'Thinks cheating is part of sport.', 'Which spoils clean sport?', 'Fair play', 'Cheating', 'Cheating spoils sport.'),
  m('SPORTS_VALUES', 'SV_VALUE', 'Names a bad value.', 'Which is a value of clean sport?', 'Cheating', 'Fair play', 'Fair play is a value of clean sport.'),
  m('SPORTS_VALUES', 'SV_TEAM', 'Thinks only winning matters.', 'What matters in a team game?', 'Only winning', 'Teamwork and respect', 'Teamwork and respect matter in a team game.'),
];
