// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 8: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/creative_arts/g8.json by scripts/build-creativearts-g8.mjs. KICD's outcomes and rubrics are never touched.
// Most outcomes are performing, making or playing: they are marked by a teacher and are not tested here. The knowledge halves a tapped
// question can test (roles, verse, fitness, bass staff, 3/4 time, G major, dominance, complementary colours, middle distance, melody,
// netball, fabric decoration, recorder, volleyball, folk dance, basketry, swimming, tagging games, sportsmanship) are built.
// Safety: swimming, running and ball skills are shown by a teacher or coach; questions ask for names, order and rules only.
// Everything is draft until a Creative Arts and Sports teacher reviews it.
// A skill: [sub-strand key after 'CREA.G8.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const RO = 'FOUNDA.ROLES_OF_CREATIVE_ARTS_A', CO = 'FOUNDA.COMPONENTS_OF_CREATIVE_A', DP = 'CREATI.DRAWING_AND_PAINTING', RH = 'CREATI.RHYTHM', MD = 'CREATI.MIDDLE_DISTANCE_RACES_AN';
const ME = 'CREATI.MELODY', NB = 'CREATI.NETBALL', FD = 'CREATI.FABRIC_DECORATION', DR = 'CREATI.DESCANT_RECORDER', VE = 'CREATI.VERSE', VB = 'CREATI.VOLLEYBALL';
const FO = 'CREATI.KENYAN_FOLK_DANCE', BK = 'CREATI.INDIGENOUS_KENYAN_CRAFT_', SW = 'CREATI.SWIMMING', IG = 'CREATI.KENYAN_INDIGENOUS_GAMES', AN = 'APPREC.ANALYSIS_OF_CREATIVE_ART';
const FM = ['pick the right answer', 'pick the right answer in a short story', 'find the false step in a learner\'s reason'];
export const SKILLS = [
  [RO, 'ROLES', 'Describe the roles of Creative Arts and Sports in society', ['a'], [], FM, 'The child names roles (entertainment, passing on culture, keeping people fit and healthy, bringing people together, earning a living) and does not say the arts and sports have no use.'],
  [CO, 'VERSE_ELEMENTS', 'Name the elements of verse', ['a'], [], FM, 'The child names lines, stanzas, rhyme, rhythm and imagery as elements of verse, and says a stanza is a group of lines.'],
  [CO, 'FITNESS_AGILITY', 'Tell endurance from agility', ['b'], [], FM, 'The child says endurance is keeping going for a long time without tiring and agility is changing direction quickly, and names activities for each (long running; zigzag runs).'],
  [CO, 'BASS_STAFF', 'Name pitches on the bass staff', ['c', 'd'], [], FM, 'The child says the lines of the bass staff from the bottom are G B D F A and the spaces are A C E G, and that the bass clef is for low sounds.'],
  [CO, 'TIME_34', 'Group notes in 3/4 time', ['e'], [], FM, 'The child says 3/4 has three crotchet beats in a bar, that a dotted minim fills a bar, and that a minim and a crotchet together make three beats.'],
  [CO, 'G_MAJOR', 'Build the scale of G major', ['f'], ['TIME_34'], FM, 'The child says G major has one sharp, F sharp, and its notes are G A B C D E F-sharp G, starting and ending on G.'],
  [DP, 'DOMINANCE', 'Tell what dominance is in a picture', ['a'], [], FM, 'The child says dominance is the main feature that catches the eye first in a picture, made by size, colour or position, and that other parts are less important.'],
  [DP, 'COMPLEMENTARY', 'Name complementary colours and colour contrast', ['b'], [], FM, 'The child says complementary colours sit opposite each other on the colour wheel (red and green, blue and orange, yellow and violet) and give strong contrast when placed together.'],
  [MD, 'MIDDLE_DISTANCE', 'Describe middle distance races and a montage', ['a', 'c'], [], FM, 'The child says middle distance races include the 800 metres and the 1 500 metres, need pace and endurance, and that a montage is a picture made by combining many pieces or pictures.'],
  [ME, 'MELODY_METHODS', 'Name methods of making a melody', ['a'], [], FM, 'The child says a melody can be made by repeating a short idea, moving by steps and leaps, and by a question phrase answered by an answer phrase, ending on the home note G in G major.'],
  [NB, 'NETBALL', 'Describe passes and footwork in netball', ['a', 'c'], [], FM, 'The child says a netball team has seven players, the passes are chest, bounce, shoulder and overhead, a player may not run with the ball, and may hold it for only three seconds.'],
  [FD, 'FABRIC_DECOR', 'Describe fabric decorating techniques', ['a', 'b', 'c', 'd'], [], FM, 'The child says tie and dye ties parts of cloth before dyeing so those parts keep their colour, pleating folds the cloth, and stencil printing passes colour through a cut-out design.'],
  [DR, 'RECORDER_TECH', 'Explain recorder techniques and performance directions', ['a', 'b'], [], FM, 'The child says the recorder is played by covering holes with finger pads, blowing gently with the tongue shaping each note, and reads p as soft, f as loud and a repeat sign as play again.'],
  [VE, 'VERSE_LANGUAGE', 'Describe language use in verse', ['a'], ['VERSE_ELEMENTS'], FM, 'The child says verse uses simile (like or as), metaphor (one thing is another), repetition and personification to make words vivid.'],
  [VB, 'VOLLEYBALL', 'Describe the overarm serve and volleying', ['a'], [], FM, 'The child says volleyball is played with six players a side over a net, an overarm serve hits the ball with one open hand above the head, a volley is hit with the fingertips overhead, and a team has three touches.'],
  [FO, 'FOLK_DANCES', 'Classify Kenyan folk dances by community', ['a'], [], FM, 'The child links isukuti to the Luhya, adumu (a jumping dance) to the Maasai, chakacha to the Coast and mwomboko to the Kikuyu, and says folk dances keep culture alive.'],
  [BK, 'BASKETRY', 'Describe coil basketry', ['a'], [], FM, 'The child says coil basketry winds a coil of grass or sisal in a spiral and stitches it with thread, and that baskets, trays and mats are made this way.'],
  [SW, 'SWIMMING_STROKES', 'Explain inverted breaststroke and water treading', ['a'], [], FM, 'The child says the inverted breaststroke is done on the back with a frog kick and arms moving together, and water treading keeps the body upright in deep water by moving the legs and arms; swimming is only with a lifeguard.'],
  [IG, 'TAG_GAMES', 'Describe indigenous tagging games', ['a'], [], FM, 'The child says in a tagging game the chaser touches a runner who then becomes the chaser, and that such games build speed, agility and teamwork.'],
  [AN, 'SPORTSMANSHIP', 'Name the spirit of sportsmanship', ['c'], [], FM, 'The child names fair play, honesty, respect for opponents and officials, and accepting defeat gracefully as sportsmanship.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_CA8_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('ROLES', 'RO_USELESS', 'Thinks the arts have no use.', 'What do Creative Arts and Sports do for society?', 'Nothing useful', 'Entertain, keep culture and keep people fit', 'They entertain, keep culture and keep people fit.'),
  m('ROLES', 'RO_HEALTH', 'Leaves out health.', 'Which role do sports play?', 'Making people sick', 'Keeping people fit and healthy', 'Sports keep people fit and healthy.'),
  m('ROLES', 'RO_CULTURE', 'Thinks the arts forget culture.', 'How do songs and dances help a community?', 'They make it forget its past', 'They pass on culture', 'Songs and dances pass on culture.'),
  m('VERSE_ELEMENTS', 'VE_STANZA', 'Calls a stanza a word.', 'What is a stanza?', 'One word', 'A group of lines', 'A stanza is a group of lines.'),
  m('VERSE_ELEMENTS', 'VE_RHYME', 'Says rhyme is the same first sound.', 'What is rhyme?', 'Same beginning sounds', 'Repeated end sounds', 'Rhyme is repeated end sounds.'),
  m('VERSE_ELEMENTS', 'VE_LINE', 'Calls a line the whole poem.', 'What is a line of verse?', 'The whole poem', 'One row of words', 'A line is one row of words.'),
  m('FITNESS_AGILITY', 'FA_AGILITY', 'Mixes agility with endurance.', 'Which is changing direction quickly?', 'Endurance', 'Agility', 'Agility is changing direction quickly.'),
  m('FITNESS_AGILITY', 'FA_ENDURANCE', 'Mixes endurance with agility.', 'Which is lasting a long time without tiring?', 'Agility', 'Endurance', 'Endurance is lasting a long time.'),
  m('FITNESS_AGILITY', 'FA_ACTIVITY', 'Gives the wrong activity.', 'Which activity builds endurance?', 'A single quick jump', 'Long steady running', 'Long running builds endurance.'),
  m('BASS_STAFF', 'BS_LINES', 'Gives the treble lines for the bass staff.', 'What are the lines of the bass staff from the bottom?', 'E G B D F', 'G B D F A', 'The bass lines are G B D F A.'),
  m('BASS_STAFF', 'BS_SPACES', 'Gives the treble spaces for the bass staff.', 'What are the spaces of the bass staff from the bottom?', 'F A C E', 'A C E G', 'The bass spaces are A C E G.'),
  m('BASS_STAFF', 'BS_CLEF', 'Says the bass clef is for high sounds.', 'The bass clef is used for...', 'High sounds', 'Low sounds', 'The bass clef is for low sounds.'),
  m('TIME_34', 'T3_BEATS', 'Gives the wrong beats for a bar.', 'How many crotchet beats are in a bar of 3/4?', '2', '3', 'A bar of 3/4 has three crotchet beats.'),
  m('TIME_34', 'T3_DOTTED', 'Gives the wrong value for a dotted minim.', 'How many beats is a dotted minim?', '2', '3', 'A dotted minim is three beats.'),
  m('TIME_34', 'T3_BAR', 'Gives a wrong full bar.', 'Which fills a bar of 3/4?', 'A minim alone', 'A minim and a crotchet', 'A minim and a crotchet make three beats.'),
  m('G_MAJOR', 'GM_SHARP', 'Puts a flat in G major.', 'G major has one...', 'flat', 'sharp', 'G major has one sharp.'),
  m('G_MAJOR', 'GM_NOTE', 'Names the wrong sharp note.', 'Which note is sharp in G major?', 'B', 'F', 'F is sharp in G major.'),
  m('G_MAJOR', 'GM_HOME', 'Gives the wrong home note.', 'On which note does G major begin and end?', 'C', 'G', 'G major begins and ends on G.'),
  m('DOMINANCE', 'DM_MEANING', 'Says dominance means every part is equal.', 'What is dominance in a picture?', 'Every part is equal', 'The main feature that catches the eye', 'Dominance is the main feature.'),
  m('DOMINANCE', 'DM_HOW', 'Names a way that weakens dominance.', 'Which makes a feature dominant?', 'Making it the smallest and dullest', 'Making it large or bright', 'Size and colour make a feature dominant.'),
  m('DOMINANCE', 'DM_OTHER', 'Thinks other parts are most important.', 'What are the less important parts called?', 'Dominant parts', 'Subordinate parts', 'The less important parts are subordinate.'),
  m('COMPLEMENTARY', 'CP_RED', 'Gives the wrong partner for red.', 'Which colour is complementary to red?', 'Orange', 'Green', 'Red and green are complementary.'),
  m('COMPLEMENTARY', 'CP_BLUE', 'Gives the wrong partner for blue.', 'Which colour is complementary to blue?', 'Green', 'Orange', 'Blue and orange are complementary.'),
  m('COMPLEMENTARY', 'CP_WHEEL', 'Says complementary colours sit side by side.', 'Where do complementary colours sit on the wheel?', 'Side by side', 'Opposite each other', 'Complementary colours sit opposite each other.'),
  m('MIDDLE_DISTANCE', 'MD_RACE', 'Names a sprint as middle distance.', 'Which is a middle distance race?', '100 metres', '800 metres', 'The 800 metres is middle distance.'),
  m('MIDDLE_DISTANCE', 'MD_MONTAGE', 'Thinks a montage is one picture.', 'What is a montage?', 'One plain picture', 'A picture made by combining many pieces', 'A montage combines many pieces.'),
  m('MIDDLE_DISTANCE', 'MD_PACE', 'Thinks middle distance is run at full speed all the way.', 'What do middle distance runners need?', 'Only a fast start', 'Pace and endurance', 'They need pace and endurance.'),
  m('MELODY_METHODS', 'MY_HOME', 'Gives the wrong home note.', 'On which note does a melody in G major end?', 'C', 'G', 'A melody in G major ends on G.'),
  m('MELODY_METHODS', 'MY_ANSWER', 'Thinks an answering phrase repeats exactly.', 'What is an answering phrase?', 'A copy of the opening phrase', 'A phrase that replies to the opening phrase', 'An answering phrase replies to the opening phrase.'),
  m('MELODY_METHODS', 'MY_STEP', 'Thinks only leaps make a melody.', 'How does a melody move?', 'Only by huge leaps', 'By steps and leaps', 'A melody moves by steps and leaps.'),
  m('NETBALL', 'NB_PLAYERS', 'Gives the wrong number of players.', 'How many players are in a netball team?', 'Eleven', 'Seven', 'A netball team has seven players.'),
  m('NETBALL', 'NB_RUN', 'Says players may run with the ball.', 'May a netball player run with the ball?', 'Yes, as far as she likes', 'No, she must pass or shoot', 'A player may not run with the ball.'),
  m('NETBALL', 'NB_SECONDS', 'Gives the wrong time for holding the ball.', 'For how long may a player hold the ball?', 'Ten seconds', 'Three seconds', 'A player may hold the ball for three seconds.'),
  m('FABRIC_DECOR', 'FB_TIE', 'Thinks tie and dye uses no tying.', 'In tie and dye, why is cloth tied?', 'To stop it dyeing evenly everywhere so patterns form', 'To make it smaller for storage', 'Tied parts resist the dye and keep their colour.'),
  m('FABRIC_DECOR', 'FB_STENCIL', 'Mixes stencil with pleating.', 'Which technique uses a cut-out design?', 'Pleating', 'Stencil printing', 'Stencil printing uses a cut-out design.'),
  m('FABRIC_DECOR', 'FB_PLEAT', 'Mixes pleating with stencil.', 'Which technique folds cloth into folds?', 'Stencil printing', 'Pleating', 'Pleating folds cloth.'),
  m('RECORDER_TECH', 'RT_BLOW', 'Says blow hard.', 'How should you blow a descant recorder?', 'As hard as possible', 'Gently and steadily', 'Blow gently and steadily.'),
  m('RECORDER_TECH', 'RT_P', 'Mixes p and f.', 'What does p mean in music?', 'Loud', 'Soft', 'p means soft.'),
  m('RECORDER_TECH', 'RT_REPEAT', 'Says repeat signs mean stop.', 'What does a repeat sign mean?', 'Stop playing', 'Play the section again', 'A repeat sign means play again.'),
  m('VERSE_LANGUAGE', 'VL_SIMILE', 'Mixes simile and metaphor.', 'Which is a simile?', 'The moon is a silver coin', 'as bright as the moon', 'A simile uses like or as.'),
  m('VERSE_LANGUAGE', 'VL_METAPHOR', 'Mixes metaphor and simile.', 'Which is a metaphor?', 'as fast as a cheetah', 'Time is a thief', 'A metaphor says one thing is another.'),
  m('VERSE_LANGUAGE', 'VL_REPEAT', 'Thinks repetition is a fault.', 'Why repeat a line in verse?', 'To make mistakes', 'To stress an idea', 'Repetition stresses an idea.'),
  m('VOLLEYBALL', 'VO_PLAYERS', 'Gives the wrong number of players.', 'How many players are on the court for a volleyball team?', 'Eleven', 'Six', 'A volleyball team has six players on court.'),
  m('VOLLEYBALL', 'VO_SERVE', 'Says the serve is hit with the feet.', 'How is the overarm serve hit?', 'With the feet', 'With one open hand above the head', 'The overarm serve is hit with an open hand.'),
  m('VOLLEYBALL', 'VO_TOUCH', 'Gives the wrong touches.', 'How many touches does a team have before sending the ball over?', 'Ten', 'Three', 'A team has three touches.'),
  m('FOLK_DANCES', 'FD_ISUKUTI', 'Gives the wrong community for isukuti.', 'Which community is known for isukuti?', 'Maasai', 'Luhya', 'Isukuti is a Luhya dance.'),
  m('FOLK_DANCES', 'FD_ADUMU', 'Gives the wrong community for adumu.', 'Which community is known for the jumping dance adumu?', 'Luhya', 'Maasai', 'Adumu is a Maasai jumping dance.'),
  m('FOLK_DANCES', 'FD_CHAKACHA', 'Gives the wrong region for chakacha.', 'Which region is known for chakacha?', 'Highlands', 'Coast', 'Chakacha is from the Coast.'),
  m('BASKETRY', 'BK_COIL', 'Does not know the coil method.', 'What is coil basketry?', 'Weaving straight strips', 'Winding a coil in a spiral and stitching it', 'Coil basketry winds a coil in a spiral.'),
  m('BASKETRY', 'BK_MATERIAL', 'Names an unsuitable material.', 'Which material suits coil baskets?', 'Iron', 'Grass or sisal', 'Grass or sisal is used.'),
  m('BASKETRY', 'BK_ITEM', 'Names a non-basketry item.', 'Which can be made by coiling?', 'A brick', 'A tray', 'A tray can be made by coiling.'),
  m('SWIMMING_STROKES', 'SS_BACK', 'Says inverted breaststroke is on the front.', 'In inverted breaststroke the swimmer lies on...', 'The front', 'The back', 'The swimmer lies on the back.'),
  m('SWIMMING_STROKES', 'SS_TREAD', 'Says treading means lying flat.', 'What is water treading?', 'Lying flat on the water', 'Staying upright in deep water', 'Treading keeps the body upright.'),
  m('SWIMMING_STROKES', 'SS_SAFETY', 'Says swimming alone is fine.', 'When should a learner swim?', 'Alone at any time', 'With a lifeguard or teacher', 'Swim only with a lifeguard or teacher.'),
  m('TAG_GAMES', 'TG_RULE', 'Thinks the chaser never changes.', 'What happens when the chaser touches a runner?', 'Nothing happens', 'The runner becomes the chaser', 'The touched runner becomes the chaser.'),
  m('TAG_GAMES', 'TG_BENEFIT', 'Says tag games make people less fit.', 'What do tagging games build?', 'Weak muscles', 'Speed and agility', 'They build speed and agility.'),
  m('TAG_GAMES', 'TG_KIND', 'Names a non-tag game.', 'Which is a tagging game?', 'Chess', 'A chasing game', 'A chasing game is a tagging game.'),
  m('SPORTSMANSHIP', 'SP_CHEAT', 'Thinks cheating is part of sport.', 'Which shows sportsmanship?', 'Cheating to win', 'Playing fairly', 'Fair play shows sportsmanship.'),
  m('SPORTSMANSHIP', 'SP_DEFEAT', 'Thinks defeat should bring anger.', 'How should a good sport accept defeat?', 'With anger', 'With respect', 'Accept defeat with respect.'),
  m('SPORTSMANSHIP', 'SP_OFFICIAL', 'Thinks officials should be insulted.', 'How should players treat referees?', 'Insult them', 'Respect their decisions', 'Respect the referee.'),
];
