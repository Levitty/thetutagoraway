// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 7, A (10 skills): categories, elements of a story, components of fitness, note values, treble pitches,
// balance, colour temperature, rhythm factors, javelin, melody qualities. Written offline from the KICD design through the curriculum map.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until a teacher signs them off. Only knowledge is
// asked; making, performing and throwing are marked by the teacher.
// ============================================================================
import { S } from './creativearts_g7_lib.js';
const IN = 'FOUNDA.INTRODUCTION_TO_CREATIVE.', CO = 'FOUNDA.COMPONENTS_OF_CREATIVE_A.', DP = 'CREATI.DRAWING_AND_PAINTING.', RH = 'CREATI.RHYTHM.', JS = 'CREATI.JAVELIN_AND_SCULPTURE.', ME = 'CREATI.MELODY.';

export const FAMILIES = [
  ...S('cc', IN, 'CA_CATEGORIES', ['CC_ONE_ONLY', 'CC_SPORT', 'CC_ARTS'], ['The categories work together.', 'Art and craft, music, sports and performing arts.'], [
    ['How do music and dance relate?', 'They often work together', 'They never go together', 'They are the same thing', 'They cannot be mixed'],
    ['Which is a category of Creative Arts and Sports?', 'Physical education and sports', 'Mathematics lessons', 'Science lessons', 'Language lessons'],
    ['Which is art and craft?', 'Making a collage', 'Playing football', 'Singing a hymn', 'Running a race'],
    ['Which is music?', 'Singing a song together', 'Making a clay pot', 'Throwing a javelin', 'Painting a picture'],
    ['Which is physical education and sports?', 'Playing handball', 'Drawing a picture', 'Carving a stool', 'Writing a poem'],
  ], [
    ['A school show has a song, a dance and a short play together. What does this show?', 'The categories work together', 'The categories never mix', 'Only one category is allowed', 'Arts are not related'],
    ['Wanjiru makes a collage for the school hall. Which category is this?', 'Art and craft', 'Music', 'Sports', 'Dance'],
    ['Kamau plays handball on the field. Which category is this?', 'Physical education and sports', 'Art and craft', 'Music', 'Drama'],
    ['A choir sings at the assembly. Which category is this?', 'Music', 'Art and craft', 'Sports', 'Painting'],
    ['A class acts a story with costumes. Which category is this?', 'Performing arts', 'Sports only', 'Mathematics', 'Science'],
  ], [
    ['Which step is the mistake?', 'Step 1: Music has rhythm.', 'Step 2: Dance also has rhythm.', 'Step 3: So music and dance can never be used together.', 'They often work together.', 2],
    ['Which step is the mistake?', 'Step 1: Creative Arts includes drawing.', 'Step 2: It also includes music.', 'Step 3: So sports is not part of it.', 'Physical education and sports is a category.', 2],
    ['Which step is the mistake?', 'Step 1: A collage is made by gluing pieces.', 'Step 2: It is a work of art.', 'Step 3: So it belongs to sports.', 'A collage is art and craft.', 2],
    ['Which step is the mistake?', 'Step 1: A play uses acting.', 'Step 2: It may use songs too.', 'Step 3: So songs cannot be in a play.', 'Songs can be in a play.', 2],
    ['Which step is the mistake?', 'Step 1: The categories are linked.', 'Step 2: Each helps the others.', 'Step 3: So they must be kept apart.', 'They work together.', 2],
  ], ['a', 'b']),
  ...S('se', CO, 'STORY_ELEMENTS', ['SE_SETTING', 'SE_CHARACTER', 'SE_PLOT'], ['Setting is where and when; characters are who.', 'Plot is the order of events.'], [
    ['What is the setting of a story?', 'Where and when it happens', 'The people in it', 'The title of the story', 'The lesson learnt'],
    ['Who are the characters?', 'The people or animals in the story', 'The place of the story', 'The order of events', 'The title'],
    ['What is the plot?', 'The order of events', 'The title of the story', 'The place where it happens', 'The name of the writer'],
    ['Which is an element of a story?', 'Characters', 'A ruler', 'A drum', 'A goal post'],
    ['In "A village at night", which is the setting?', 'A village at night', 'The villagers', 'The writer', 'The reader'],
  ], [
    ['A story is set in a market in the morning. What is this?', 'The setting', 'The plot', 'The character', 'The title'],
    ['Achieng and a hare are in the story. What are they?', 'Characters', 'Settings', 'Plots', 'Titles'],
    ['A story tells first a problem, then a search, then a solution. What is this order?', 'The plot', 'The setting', 'The character', 'The title'],
    ['Which element tells where a story happens?', 'Setting', 'Plot', 'Character', 'Title'],
    ['Which element tells who is in a story?', 'Characters', 'Setting', 'Plot', 'Time'],
  ], [
    ['Which step is the mistake?', 'Step 1: A story has elements.', 'Step 2: Setting is one of them.', 'Step 3: So setting is the people in the story.', 'Setting is where and when it happens.', 2],
    ['Which step is the mistake?', 'Step 1: Characters take part in a story.', 'Step 2: They may be people or animals.', 'Step 3: So characters are the place.', 'Characters are the people or animals.', 2],
    ['Which step is the mistake?', 'Step 1: A plot has a beginning.', 'Step 2: It has a middle and end.', 'Step 3: So the plot is the title.', 'The plot is the order of events.', 2],
    ['Which step is the mistake?', 'Step 1: Theme is the main idea.', 'Step 2: A story can teach a lesson.', 'Step 3: So theme is the setting.', 'Theme is the main idea.', 2],
    ['Which step is the mistake?', 'Step 1: The setting includes time.', 'Step 2: It includes place.', 'Step 3: So setting is only a person.', 'Setting is place and time.', 2],
  ], ['a', 'a']),
  ...S('fc', CO, 'FITNESS_COMPONENTS', ['FC_AGILITY', 'FC_FLEX', 'FC_ENDURANCE'], ['Match each word with what it means.', 'Agility is changing direction quickly.'], [
    ['Which is the ability to change direction quickly?', 'Agility', 'Flexibility', 'Strength', 'Endurance'],
    ['Which is the range of movement at a joint?', 'Flexibility', 'Strength', 'Speed', 'Balance'],
    ['Which is lasting a long time without tiring?', 'Endurance', 'Speed', 'Power', 'Agility'],
    ['Which is a health-related component of fitness?', 'Flexibility', 'Reaction time', 'Skill', 'Luck'],
    ['Which is a skill-related component of fitness?', 'Balance', 'Body composition', 'Muscular strength', 'Eating'],
  ], [
    ['A footballer changes direction fast to avoid a tackle. Which component is this?', 'Agility', 'Flexibility', 'Strength', 'Endurance'],
    ['A gymnast bends and stretches far. Which component is this?', 'Flexibility', 'Strength', 'Speed', 'Balance'],
    ['A runner keeps going for a long time. Which component is this?', 'Endurance', 'Speed', 'Power', 'Agility'],
    ['A learner lifts a heavy bucket. Which component is this?', 'Muscular strength', 'Flexibility', 'Balance', 'Agility'],
    ['A girl stands on one leg for a long time. Which component is this?', 'Balance', 'Endurance', 'Strength', 'Speed'],
  ], [
    ['Which step is the mistake?', 'Step 1: Agility helps in football.', 'Step 2: It is changing direction quickly.', 'Step 3: So agility is the range of movement at a joint.', 'Flexibility is the range of movement.', 2],
    ['Which step is the mistake?', 'Step 1: Flexibility is stretching.', 'Step 2: It is the range of movement.', 'Step 3: So flexibility is strength.', 'Flexibility is not strength.', 2],
    ['Which step is the mistake?', 'Step 1: Endurance is lasting long.', 'Step 2: A long-distance runner needs it.', 'Step 3: So endurance is speed.', 'Endurance is not speed.', 2],
    ['Which step is the mistake?', 'Step 1: Strength lifts weight.', 'Step 2: It is a health-related component.', 'Step 3: So strength is changing direction quickly.', 'That is agility.', 2],
    ['Which step is the mistake?', 'Step 1: Balance keeps the body steady.', 'Step 2: It is a skill-related component.', 'Step 3: So balance is a health-related component only.', 'Balance is skill-related.', 2],
  ], ['b', 'b']),
  ...S('nv', CO, 'NOTE_VALUES', ['NV_MINIM', 'NV_SEMIBREVE', 'NV_BAR'], ['Semibreve 4, minim 2, crotchet 1, quaver half a beat.', 'A bar in 2 time holds 2 crotchet beats.'], [
    ['How many beats is a minim?', '2', '1', '4', '3'],
    ['How many beats is a semibreve?', '4', '2', '1', '3'],
    ['In 2 time, a bar holds how many crotchet beats?', '2', '4', '1', '3'],
    ['How many beats is a crotchet?', '1', '2', '4', '3'],
    ['How many beats is a quaver?', 'Half a beat', 'One beat', 'Two beats', 'Four beats'],
  ], [
    ['A bar in 2 time has a minim. Is the bar full?', 'Yes, a minim is 2 beats', 'No, a minim is 1 beat', 'No, it needs a semibreve', 'No, it needs 4 beats'],
    ['A bar in 2 time has two crotchets. What is the total?', '2 beats', '4 beats', '1 beat', '3 beats'],
    ['Which note lasts the longest?', 'Semibreve', 'Minim', 'Crotchet', 'Quaver'],
    ['A bar in 2 time has one crotchet and two quavers. What is the total?', '2 beats', '3 beats', '1 beat', '4 beats'],
    ['Which note is worth 2 beats?', 'Minim', 'Crotchet', 'Quaver', 'Semibreve'],
  ], [
    ['Which step is the mistake?', 'Step 1: A crotchet is 1 beat.', 'Step 2: Two crotchets are 2 beats.', 'Step 3: So a minim is 1 beat.', 'A minim is 2 beats.', 2],
    ['Which step is the mistake?', 'Step 1: A minim is 2 beats.', 'Step 2: A semibreve is longer.', 'Step 3: So a semibreve is 2 beats.', 'A semibreve is 4 beats.', 2],
    ['Which step is the mistake?', 'Step 1: 2 time has two beats in a bar.', 'Step 2: Each beat is a crotchet.', 'Step 3: So a bar holds 4 crotchets.', 'A bar holds 2 crotchets.', 2],
    ['Which step is the mistake?', 'Step 1: A quaver is short.', 'Step 2: Two quavers make one crotchet.', 'Step 3: So a quaver is one beat.', 'A quaver is half a beat.', 2],
    ['Which step is the mistake?', 'Step 1: Notes in a bar add up.', 'Step 2: The total fits the time signature.', 'Step 3: So any total is fine.', 'The total must fit the time signature.', 2],
  ], ['c', 'e']),
  ...S('tp', CO, 'TREBLE_PITCHES', ['TP_LINES', 'TP_SPACES', 'TP_FIRST'], ['Lines: E G B D F. Spaces: F A C E.', 'The bottom line is E.'], [
    ['What are the lines of the treble staff from the bottom?', 'E G B D F', 'F A C E', 'C D E F G', 'A B C D E'],
    ['What are the spaces of the treble staff from the bottom?', 'F A C E', 'E G B D F', 'C D E F G', 'A B C D E'],
    ['Which note is on the bottom line of the treble staff?', 'E', 'F', 'G', 'C'],
    ['Which note is in the first space of the treble staff?', 'F', 'E', 'G', 'A'],
    ['Which note is on the top line of the treble staff?', 'F', 'E', 'G', 'A'],
  ], [
    ['A note sits on the second line of the treble staff. Which note is it?', 'G', 'F', 'A', 'E'],
    ['A note sits in the third space of the treble staff. Which note is it?', 'C', 'E', 'A', 'F'],
    ['A note sits in the top space of the treble staff. Which note is it?', 'E', 'F', 'G', 'C'],
    ['A note sits on the middle line of the treble staff. Which note is it?', 'B', 'G', 'D', 'F'],
    ['A note sits on the fourth line of the treble staff. Which note is it?', 'D', 'B', 'F', 'G'],
  ], [
    ['Which step is the mistake?', 'Step 1: The treble staff has five lines.', 'Step 2: Lines are named from the bottom.', 'Step 3: So the lines are F A C E.', 'The lines are E G B D F.', 2],
    ['Which step is the mistake?', 'Step 1: The treble staff has four spaces.', 'Step 2: They are named from the bottom.', 'Step 3: So the spaces are E G B D F.', 'The spaces are F A C E.', 2],
    ['Which step is the mistake?', 'Step 1: Notes are named by place.', 'Step 2: The bottom line is the first line.', 'Step 3: So the bottom line is F.', 'The bottom line is E.', 2],
    ['Which step is the mistake?', 'Step 1: Spaces come between lines.', 'Step 2: The first space is above the bottom line.', 'Step 3: So the first space is E.', 'The first space is F.', 2],
    ['Which step is the mistake?', 'Step 1: There are five lines.', 'Step 2: The top line is the fifth.', 'Step 3: So the top line is E.', 'The top line is F.', 2],
  ], ['d', 'd']),
  ...S('bl', DP, 'BALANCE', ['BL_SYM', 'BL_MEANING', 'BL_RADIAL'], ['Balance is the even spread of visual weight.', 'Symmetrical means both sides alike.'], [
    ['What is symmetrical balance?', 'Both sides are alike', 'Both sides are different', 'Only one side is used', 'The picture has no centre'],
    ['What is balance in a picture?', 'Spreading visual weight evenly', 'Making all colours the same', 'Using only one shape', 'Leaving the page blank'],
    ['What is radial balance?', 'Items spread from the centre', 'Items in a straight line', 'Items only on one side', 'Items only at the top'],
    ['What is asymmetrical balance?', 'Different sides with equal weight', 'Both sides exactly alike', 'No balance at all', 'Only one object'],
    ['Which picture shows symmetrical balance?', 'A butterfly with matching wings', 'A tree on one side only', 'A single dot in a corner', 'A rough scribble'],
  ], [
    ['A drawing of a butterfly has matching wings. Which balance is this?', 'Symmetrical', 'Asymmetrical', 'Radial', 'None'],
    ['A flower has petals spreading from the centre. Which balance is this?', 'Radial', 'Symmetrical', 'Asymmetrical', 'None'],
    ['A picture has a big tree on the left and three small houses on the right. Which balance is this?', 'Asymmetrical', 'Symmetrical', 'Radial', 'None'],
    ['A picture has all its objects on one side. What is wrong?', 'It is not balanced', 'It is balanced', 'It is symmetrical', 'It is radial'],
    ['Why do artists balance a picture?', 'So it looks steady and pleasing', 'So it looks messy', 'So it looks empty', 'So it looks one-sided'],
  ], [
    ['Which step is the mistake?', 'Step 1: Balance is about weight in a picture.', 'Step 2: Symmetrical balance has equal sides.', 'Step 3: So both sides are different.', 'Symmetrical means both sides alike.', 2],
    ['Which step is the mistake?', 'Step 1: Balance spreads visual weight.', 'Step 2: It makes a picture steady.', 'Step 3: So balance means one colour.', 'Balance is spreading weight evenly.', 2],
    ['Which step is the mistake?', 'Step 1: Radial balance starts at the centre.', 'Step 2: Parts spread outward.', 'Step 3: So radial balance is a straight line.', 'Radial spreads from the centre.', 2],
    ['Which step is the mistake?', 'Step 1: Asymmetrical balance has different sides.', 'Step 2: The sides have equal weight.', 'Step 3: So the sides are exactly alike.', 'The sides are different.', 2],
    ['Which step is the mistake?', 'Step 1: A balanced picture looks steady.', 'Step 2: An unbalanced one looks lopsided.', 'Step 3: So lopsided is better.', 'Balanced is steadier.', 2],
  ], ['a', 'a']),
  ...S('ct', DP, 'COLOUR_TEMP', ['CT_WARM', 'CT_COOL', 'CT_FEEL'], ['Warm: red, orange, yellow. Cool: blue, green, violet.', 'Warm colours remind us of sun and fire.'], [
    ['Which is a warm colour?', 'Orange', 'Blue', 'Green', 'Violet'],
    ['Which is a cool colour?', 'Blue', 'Red', 'Orange', 'Yellow'],
    ['Which colours remind us of the sun and fire?', 'Warm colours', 'Cool colours', 'Grey only', 'White only'],
    ['Which colours remind us of water and sky?', 'Cool colours', 'Warm colours', 'Red only', 'Orange only'],
    ['Which group has only warm colours?', 'Red, orange, yellow', 'Blue, green, violet', 'Blue, red, green', 'Green, yellow, blue'],
  ], [
    ['A painter paints a sunset in red and orange. Which temperature is this?', 'Warm colours', 'Cool colours', 'No colour', 'Grey colours'],
    ['A painter paints a lake in blue and green. Which temperature is this?', 'Cool colours', 'Warm colours', 'No colour', 'Hot colours'],
    ['Which colour would you use for a hot desert sun?', 'Yellow', 'Blue', 'Violet', 'Green'],
    ['Which colour would you use for a cold river?', 'Blue', 'Red', 'Orange', 'Yellow'],
    ['A scenery of fire and sunshine needs which colours?', 'Warm colours', 'Cool colours', 'Only white', 'Only black'],
  ], [
    ['Which step is the mistake?', 'Step 1: Red, orange and yellow are warm.', 'Step 2: Blue is a cool colour.', 'Step 3: So blue is a warm colour.', 'Blue is cool.', 2],
    ['Which step is the mistake?', 'Step 1: Cool colours include blue.', 'Step 2: They include green and violet.', 'Step 3: So red is cool.', 'Red is warm.', 2],
    ['Which step is the mistake?', 'Step 1: Warm colours look like fire.', 'Step 2: Cool colours look like water.', 'Step 3: So warm colours look like water.', 'Warm colours look like fire.', 2],
    ['Which step is the mistake?', 'Step 1: A sunset is warm.', 'Step 2: We paint it in red and orange.', 'Step 3: So we paint it in blue only.', 'We use warm colours.', 2],
    ['Which step is the mistake?', 'Step 1: A lake looks cool.', 'Step 2: We paint it in blue.', 'Step 3: So we paint it in red.', 'We use cool colours.', 2],
  ], ['c', 'c']),
  ...S('rf', RH, 'RHYTHM_FACTORS', ['RF_BEATS', 'RF_FACTOR', 'RF_BARS'], ['The notes in each bar add up to the time signature.', 'Time signature, bars and note values.'], [
    ['In 2 time, the notes in a bar must add up to...', 'Two crotchet beats', 'Any number of beats', 'Four beats', 'Six beats'],
    ['Which is a factor in making a rhythm?', 'The time signature', 'The colour of paper', 'The size of the room', 'The weather'],
    ['How many bars are in a four-bar pattern?', 'Four', 'Two', 'Six', 'Eight'],
    ['Which sign shows how many beats are in a bar?', 'The time signature', 'The clef', 'The title', 'The writer'],
    ['What must a composer check in each bar?', 'That the beats add up', 'That all notes are quavers', 'That all notes are long', 'That there are no rests'],
  ], [
    ['Wanjiru writes 2 time with a minim and a crotchet in one bar. What is wrong?', 'The bar has three beats, too many', 'The bar is correct', 'The bar has one beat', 'The bar needs a semibreve'],
    ['A rhythm pattern has four bars of 2 time. How many crotchet beats in all?', 'Eight', 'Four', 'Two', 'Six'],
    ['A composer wants a pattern in 2 time. What does the 2 stand for?', 'Two beats in a bar', 'Two bars', 'Two rests', 'Two notes only'],
    ['Which helps to build a rhythm pattern?', 'Using different note values', 'Using one colour', 'Using only silence', 'Using only words'],
    ['A bar of 2 time needs one more beat after a crotchet. What can be added?', 'Another crotchet', 'A semibreve', 'A minim', 'Two minims'],
  ], [
    ['Which step is the mistake?', 'Step 1: A bar in 2 time has two beats.', 'Step 2: The notes must fill them.', 'Step 3: So any total is fine.', 'The beats must add up.', 2],
    ['Which step is the mistake?', 'Step 1: A rhythm uses note values.', 'Step 2: It uses a time signature.', 'Step 3: So the colour of paper decides it.', 'Paper colour is no factor.', 2],
    ['Which step is the mistake?', 'Step 1: A pattern has bars.', 'Step 2: A four-bar pattern has four.', 'Step 3: So it has two bars.', 'It has four bars.', 2],
    ['Which step is the mistake?', 'Step 1: The time signature is at the start.', 'Step 2: It shows beats per bar.', 'Step 3: So it shows the title.', 'It shows beats per bar.', 2],
    ['Which step is the mistake?', 'Step 1: Rests are silences.', 'Step 2: They count as beats.', 'Step 3: So rests are not counted.', 'Rests are counted.', 2],
  ], ['a', 'a']),
  ...S('jv', JS, 'JAVELIN', ['JV_MATERIAL', 'JV_PHASE', 'JV_SAFETY'], ['Soft wood is carved; throws are in a cleared field with a teacher.', 'Grip and carry, approach, cross-step, delivery, recovery.'], [
    ['Which material suits carving a javelin?', 'Soft wood', 'Iron', 'Glass', 'Cement'],
    ['Which phase comes first in a javelin throw?', 'Grip and carry', 'Delivery', 'Recovery', 'Cross-step'],
    ['Where is a javelin thrown?', 'In a cleared field with a teacher', 'Among people in a crowd', 'In a classroom', 'In a corridor'],
    ['Which phase comes last in a javelin throw?', 'Recovery', 'Grip and carry', 'Approach run', 'Cross-step'],
    ['Which phase is the release of the javelin?', 'Delivery', 'Grip', 'Approach run', 'Carry'],
  ], [
    ['A class wants to carve a javelin. Which material do they choose?', 'Soft wood or bamboo', 'Iron', 'Plastic bags', 'Cement'],
    ['Before the approach run the thrower holds the javelin above the shoulder. What is this?', 'Grip and carry', 'Delivery', 'Recovery', 'Cross-step'],
    ['The javelin leaves the hand. Which phase is this?', 'Delivery', 'Grip and carry', 'Approach run', 'Cross-step'],
    ['After the throw the thrower stops safely. Which phase is this?', 'Recovery', 'Delivery', 'Grip', 'Approach run'],
    ['A learner wants to throw in a crowded corridor. What should the teacher say?', 'No, throw only in a cleared field', 'Yes, it is fine', 'Yes, if it is quick', 'Yes, with a friend'],
  ], [
    ['Which step is the mistake?', 'Step 1: A javelin is carved from wood.', 'Step 2: Soft wood is easy to carve.', 'Step 3: So iron is best to carve.', 'Soft wood or bamboo is carved.', 2],
    ['Which step is the mistake?', 'Step 1: A throw has phases.', 'Step 2: The grip comes before the run.', 'Step 3: So delivery comes first.', 'Grip and carry come first.', 2],
    ['Which step is the mistake?', 'Step 1: Javelins are sharp.', 'Step 2: They are dangerous in a crowd.', 'Step 3: So throw among people.', 'Throw only in a cleared field with a teacher.', 2],
    ['Which step is the mistake?', 'Step 1: Delivery is the release.', 'Step 2: It follows the cross-step.', 'Step 3: So it comes before the grip.', 'Delivery comes after the run.', 2],
    ['Which step is the mistake?', 'Step 1: Recovery is the last phase.', 'Step 2: The thrower stays balanced.', 'Step 3: So recovery is the first phase.', 'Recovery is last.', 2],
  ], ['a', 'd']),
  ...S('mq', ME, 'MELODY_QUALITIES', ['MQ_HOME', 'MQ_SHAPE', 'MQ_REPEAT'], ['A melody in C major ends on C.', 'A good melody has a clear shape and repeated phrases.'], [
    ['On which note does a melody in C major usually end?', 'C', 'G', 'F', 'A'],
    ['Which is a quality of a good melody?', 'A clear shape with steps and leaps', 'No pattern at all', 'Only one repeated note', 'Random notes with no order'],
    ['Why repeat a phrase in a melody?', 'To make it easy to remember', 'To make it harder to sing', 'To make it longer for no reason', 'To hide the tune'],
    ['Which melody is easiest to sing?', 'One with steps and a clear shape', 'One with huge random leaps', 'One with no end', 'One with no rhythm'],
    ['Which scale has no sharps or flats?', 'C major', 'G major', 'F major', 'D major'],
  ], [
    ['A learner composes a tune in C major. Which note should it end on?', 'C', 'D', 'F', 'B'],
    ['A tune goes up by steps, then down, and repeats. What quality is this?', 'A clear shape', 'No pattern', 'Noise', 'Silence'],
    ['A song repeats its first phrase at the end. Why?', 'It makes the song easy to remember', 'It makes the song impossible', 'It stops the song', 'It hides the tune'],
    ['A teacher says a melody should be singable. What does this mean?', 'It should be easy for voices', 'It should be very hard', 'It should have no notes', 'It should be only drums'],
    ['Which of these is the home note of C major?', 'C', 'D', 'E', 'F'],
  ], [
    ['Which step is the mistake?', 'Step 1: A melody in C major has a home note.', 'Step 2: The home note is C.', 'Step 3: So the melody should end on G.', 'It should end on C.', 2],
    ['Which step is the mistake?', 'Step 1: A good melody has a shape.', 'Step 2: It moves by steps and leaps.', 'Step 3: So it should have no pattern.', 'It should have a clear pattern.', 2],
    ['Which step is the mistake?', 'Step 1: Repetition helps memory.', 'Step 2: A phrase can be repeated.', 'Step 3: So repetition makes it harder to sing.', 'Repetition makes it easy to remember.', 2],
    ['Which step is the mistake?', 'Step 1: C major has no sharps or flats.', 'Step 2: Its notes are C D E F G A B.', 'Step 3: So C major has one sharp.', 'C major has none.', 2],
    ['Which step is the mistake?', 'Step 1: A melody has pitch and rhythm.', 'Step 2: Both shape the tune.', 'Step 3: So rhythm is not part of a melody.', 'Rhythm is part of a melody.', 2],
  ], ['a', 'a']),
];
