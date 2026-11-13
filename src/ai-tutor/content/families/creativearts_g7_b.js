// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 7, B (9 skills): handball, recorder factors, storytelling and flipbooks, football, folk songs, beadwork,
// swimming, rope games and the values of clean sport. Written offline. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a teacher signs them off. Only knowledge is asked; performing is marked by the teacher; swimming and
// contact skills are shown by a teacher or lifeguard.
// ============================================================================
import { S } from './creativearts_g7_lib.js';
const HB = 'CREATI.HANDBALL.', DR = 'CREATI.DESCANT_RECORDER.', SA = 'CREATI.STORYTELLING_AND_ANIMATI.', FB = 'CREATI.FOOTBALL.', FS = 'CREATI.KENYAN_FOLK_SONGS.', IC = 'CREATI.INDIGENOUS_KENYAN_CRAFT.', SW = 'CREATI.SWIMMING.', IG = 'CREATI.KENYAN_INDIGENOUS_GAMES.', AN = 'APPREC.ANALYSIS_OF_CREATIVE_ART.';

export const FAMILIES = [
  ...S('hb', HB, 'HANDBALL', ['HB_PLAYERS', 'HB_HANDS', 'HB_STEPS'], ['Handball is played with the hands by seven players.', 'Three steps and three seconds with the ball.'], [
    ['How many players are in a handball team, with the goalkeeper?', 'Seven', 'Eleven', 'Five', 'Fifteen'],
    ['How is handball played?', 'With the hands', 'With the feet only', 'With a racket', 'With a bat'],
    ['How many steps may a player take with the ball?', 'Three', 'Ten', 'Seven', 'None at all'],
    ['What is a jump shot?', 'Throwing at the goal while in the air', 'Kicking the ball low', 'Passing to a team mate', 'Bouncing the ball once'],
    ['Which is dribbling in handball?', 'Bouncing the ball while moving', 'Throwing it into the net', 'Holding it for a minute', 'Kicking it forward'],
  ], [
    ['Achieng bounces the ball as she runs. What is this?', 'Dribbling', 'Passing', 'A jump shot', 'A kick'],
    ['Kamau jumps and throws at the goal. What is this?', 'A jump shot', 'Dribbling', 'A pass', 'A catch'],
    ['A player takes seven steps holding the ball. What is wrong?', 'Only three steps are allowed', 'Nothing, it is allowed', 'Only ten steps are allowed', 'No steps are allowed'],
    ['A chest pass goes from one player to another. What is this?', 'Passing', 'Dribbling', 'A jump shot', 'A tackle'],
    ['A player kicks the ball in handball. What is wrong?', 'It is played with the hands', 'Nothing is wrong', 'Kicking is the main skill', 'Kicking scores two points'],
  ], [
    ['Which step is the mistake?', 'Step 1: Handball has two teams.', 'Step 2: Each team has seven players.', 'Step 3: So a team has eleven players.', 'A team has seven players.', 2],
    ['Which step is the mistake?', 'Step 1: Handball uses a ball.', 'Step 2: Players throw and catch.', 'Step 3: So it is played with the feet.', 'It is played with the hands.', 2],
    ['Which step is the mistake?', 'Step 1: A player may move with the ball.', 'Step 2: Steps are limited.', 'Step 3: So ten steps are allowed.', 'Three steps are allowed.', 2],
    ['Which step is the mistake?', 'Step 1: A jump shot is a throw.', 'Step 2: The thrower jumps first.', 'Step 3: So the thrower stays on the ground.', 'The thrower is in the air.', 2],
    ['Which step is the mistake?', 'Step 1: Dribbling uses the ball.', 'Step 2: The player bounces it.', 'Step 3: So dribbling is kicking.', 'Dribbling is bouncing.', 2],
  ], ['a', 'a']),
  ...S('rc', DR, 'RECORDER_FACTORS', ['RC_FACTOR', 'RC_REST', 'RC_TEMPO'], ['Check the time signature, key, note values, rests, dynamics and tempo.', 'A rest is a silence.'], [
    ['What should you check before playing a melody?', 'The time signature and key', 'The colour of the recorder', 'The length of the room', 'The date'],
    ['What does a rest mean?', 'Be silent for its length', 'Play louder', 'Play faster', 'Repeat the note'],
    ['Which tells how fast to play?', 'Tempo', 'Dynamics', 'Clef', 'Rest'],
    ['Which tells how loud to play?', 'Dynamics', 'Tempo', 'Time signature', 'Key'],
    ['Which shows the number of beats in a bar?', 'Time signature', 'Clef', 'Tempo', 'Dynamics'],
  ], [
    ['Wanjiru sees a quiet sign in the music. What does she do?', 'Plays softly', 'Plays louder', 'Stops forever', 'Plays faster'],
    ['A rest appears for two beats. What should she do?', 'Stay silent for two beats', 'Play louder', 'Repeat the note', 'Play faster'],
    ['The music says fast. Which factor is this?', 'Tempo', 'Dynamics', 'Key', 'Clef'],
    ['Before playing, a learner checks the 2 at the start. What does it show?', 'Beats in a bar', 'Loudness', 'Speed', 'Pitch'],
    ['The music has no sharps or flats in the key. Which key is likely?', 'C major', 'G major', 'D major', 'F major'],
  ], [
    ['Which step is the mistake?', 'Step 1: Music has signs.', 'Step 2: The time signature shows beats.', 'Step 3: So the recorder colour matters most.', 'The signs matter, not the colour.', 2],
    ['Which step is the mistake?', 'Step 1: A rest is shown by a sign.', 'Step 2: It lasts for some beats.', 'Step 3: So we play louder at a rest.', 'We are silent at a rest.', 2],
    ['Which step is the mistake?', 'Step 1: Tempo is about speed.', 'Step 2: Dynamics are about loudness.', 'Step 3: So tempo tells loudness.', 'Dynamics tell loudness.', 2],
    ['Which step is the mistake?', 'Step 1: The clef tells where notes are.', 'Step 2: The time signature tells beats.', 'Step 3: So the clef tells the beats.', 'The time signature tells the beats.', 2],
    ['Which step is the mistake?', 'Step 1: The key shows the notes used.', 'Step 2: C major has no sharps or flats.', 'Step 3: So C major has sharps.', 'C major has none.', 2],
  ], ['a', 'a']),
  ...S('st', SA, 'STORY_TECHNIQUES', ['ST_VOICE', 'ST_FLIP', 'ST_AUDIENCE'], ['Vary your voice and use gestures.', 'A flipbook has many pictures that change a little.'], [
    ['Which is a storytelling technique?', 'Varying the voice', 'Using one flat voice', 'Looking at the floor', 'Whispering all the time'],
    ['What does a good flipbook have?', 'Many pictures that change a little', 'One picture only', 'Only words', 'Pictures with no order'],
    ['How can a storyteller involve the audience?', 'Ask them to join in', 'Never let them speak', 'Hide from them', 'Turn away'],
    ['Which helps a story sound lively?', 'Gestures and facial expressions', 'Standing very still', 'Reading very fast', 'Closing the eyes'],
    ['In a flipbook, where should the drawing be on each page?', 'In about the same place', 'In a different corner each time', 'Outside the page', 'Hidden behind others'],
  ], [
    ['A storyteller speaks in a deep voice for the lion and a thin voice for the hare. What is this?', 'Varying the voice', 'Using one voice', 'Reading aloud', 'Whispering'],
    ['A student draws a ball on 20 pages, each slightly higher. What is this?', 'A flipbook', 'A map', 'A poster', 'A chart'],
    ['A storyteller asks the class to clap with the chorus. What is this?', 'Audience participation', 'Silence', 'A mistake', 'A break'],
    ['A storyteller pauses before the surprise. Why?', 'To build interest', 'To forget the story', 'To end the story', 'To confuse the listeners'],
    ['A flipbook picture jumps around the page. What is wrong?', 'Pictures should stay in the same place', 'Nothing is wrong', 'It makes it smoother', 'It is the best way'],
  ], [
    ['Which step is the mistake?', 'Step 1: Storytellers use their voices.', 'Step 2: They change tone and pitch.', 'Step 3: So a flat voice is best.', 'Varying the voice is best.', 2],
    ['Which step is the mistake?', 'Step 1: A flipbook is a book of drawings.', 'Step 2: Each drawing changes a little.', 'Step 3: So one picture is enough.', 'Many pictures are needed.', 2],
    ['Which step is the mistake?', 'Step 1: Listeners enjoy taking part.', 'Step 2: Storytellers invite them.', 'Step 3: So listeners must stay silent.', 'Listeners may join in.', 2],
    ['Which step is the mistake?', 'Step 1: Gestures add life.', 'Step 2: Facial expressions add feeling.', 'Step 3: So the storyteller should stay still.', 'Gestures help the story.', 2],
    ['Which step is the mistake?', 'Step 1: A flipbook moves when flipped.', 'Step 2: Pictures change slightly.', 'Step 3: So pictures should jump across the page.', 'Pictures should stay in place.', 2],
  ], ['a', 'b']),
  ...S('fb', FB, 'FOOTBALL_SKILLS', ['FS_TRAP', 'FS_DRIBBLE', 'FS_ETCH'], ['Trapping stops the ball; dribbling keeps it close.', 'Crayon etching scratches a top layer.'], [
    ['What is trapping in football?', 'Stopping and controlling the ball', 'Kicking it hard at the goal', 'Passing it across to a friend', 'Throwing it in from the side'],
    ['What is dribbling?', 'Keeping the ball close while moving', 'Passing it to a friend far away', 'Kicking it from a long way off', 'Catching it with both hands'],
    ['How is crayon etching made?', 'By scratching a dark top layer', 'By painting over a page of water', 'By cutting out pieces of paper', 'By folding a page many times'],
    ['What is shooting?', 'Sending the ball at the goal', 'Stopping the ball', 'Keeping the ball close', 'Passing back'],
    ['How many players are in a football team on the field?', 'Eleven', 'Seven', 'Five', 'Fifteen'],
  ], [
    ['Wekesa stops a pass with his foot. What is this skill?', 'Trapping', 'Shooting', 'Dribbling', 'Heading'],
    ['Faith runs with the ball close to her feet. What is this skill?', 'Dribbling', 'Trapping', 'Shooting', 'Passing'],
    ['Otieno kicks the ball at the goal. What is this skill?', 'Shooting', 'Trapping', 'Dribbling', 'Passing'],
    ['A learner colours a page with crayons, covers it in black and scratches a picture. What is this?', 'Crayon etching', 'Painting', 'Collage', 'Sculpture'],
    ['A football team has a goalkeeper. What does the goalkeeper do?', 'Protects the goal', 'Scores in the other goal only', 'Referees the match', 'Sits on the bench'],
  ], [
    ['Which step is the mistake?', 'Step 1: Trapping uses the foot or chest.', 'Step 2: It brings the ball under control.', 'Step 3: So trapping is kicking at the goal.', 'Trapping is stopping the ball.', 2],
    ['Which step is the mistake?', 'Step 1: Dribbling needs control.', 'Step 2: The ball stays close.', 'Step 3: So dribbling is passing.', 'Dribbling keeps the ball close.', 2],
    ['Which step is the mistake?', 'Step 1: Crayon etching has layers.', 'Step 2: A dark layer covers colours.', 'Step 3: So colours are painted over water.', 'The top layer is scratched.', 2],
    ['Which step is the mistake?', 'Step 1: Shooting aims at the goal.', 'Step 2: It is done with power.', 'Step 3: So shooting is stopping the ball.', 'Shooting is sending it at the goal.', 2],
    ['Which step is the mistake?', 'Step 1: A team plays together.', 'Step 2: It has eleven players.', 'Step 3: So it has seven players.', 'It has eleven players.', 2],
  ], ['a', 'b', 'c']),
  ...S('fo', FS, 'FOLK_SONGS', ['FO_LULLABY', 'FO_WORK', 'FO_FUNERAL'], ['A lullaby soothes a baby; a work song is sung at work.', 'A dirge is sung at a funeral.'], [
    ['What is a lullaby for?', 'Putting a baby to sleep', 'Going to war', 'Praising a king', 'Calling cattle'],
    ['When is a work song sung?', 'While working', 'At bedtime', 'At a funeral', 'At a wedding'],
    ['Which song is sung at a funeral?', 'A dirge', 'A wedding song', 'A lullaby', 'A work song'],
    ['Which song is sung at a wedding?', 'A wedding song', 'A dirge', 'A lullaby', 'A war song'],
    ['Which song is sung to mark an initiation?', 'An initiation song', 'A lullaby', 'A dirge', 'A work song'],
  ], [
    ['A mother hums to her baby at night. What kind of song is this?', 'A lullaby', 'A work song', 'A war song', 'A dirge'],
    ['Farmers sing while hoeing the shamba. What kind of song is this?', 'A work song', 'A lullaby', 'A wedding song', 'A dirge'],
    ['Mourners sing sadly at a burial. What kind of song is this?', 'A dirge', 'A wedding song', 'A lullaby', 'A work song'],
    ['A community sings joyful songs as a bride arrives. What kind of song is this?', 'A wedding song', 'A dirge', 'A lullaby', 'A work song'],
    ['Children sing as they play a game. What kind of song is this?', 'A children\'s play song', 'A dirge', 'A war song', 'A funeral song'],
  ], [
    ['Which step is the mistake?', 'Step 1: A lullaby is soft.', 'Step 2: It calms a baby.', 'Step 3: So it is a war song.', 'A lullaby puts a baby to sleep.', 2],
    ['Which step is the mistake?', 'Step 1: A work song has a strong beat.', 'Step 2: It keeps workers together.', 'Step 3: So it is sung at bedtime.', 'It is sung while working.', 2],
    ['Which step is the mistake?', 'Step 1: A dirge is sad.', 'Step 2: It is sung for the dead.', 'Step 3: So it is a wedding song.', 'A dirge is a funeral song.', 2],
    ['Which step is the mistake?', 'Step 1: A wedding song is joyful.', 'Step 2: It celebrates a marriage.', 'Step 3: So it is sung at funerals.', 'It is sung at weddings.', 2],
    ['Which step is the mistake?', 'Step 1: Folk songs belong to communities.', 'Step 2: They are passed on by mouth.', 'Step 3: So they are never sung.', 'They are sung.', 2],
  ], ['a', 'a']),
  ...S('bw', IC, 'BEADWORK', ['BW_MATERIAL', 'BW_FUNCTION', 'BW_TOOL'], ['Beadwork uses beads, thread and a needle.', 'Jewellery shows identity, status and ceremonies.'], [
    ['Which is a material for beadwork?', 'Thread and beads', 'Cement', 'Iron sheets', 'Sand only'],
    ['What does jewellery show in Kenyan communities?', 'Identity, status and ceremonies', 'Nothing at all', 'Only the price', 'Only the weather'],
    ['Which tool is used for beading?', 'A needle', 'A hammer', 'A saw', 'A spade'],
    ['Which material holds the beads together?', 'Thread', 'Water', 'Sand', 'Stone'],
    ['Which is a bead that can be used?', 'A glass bead', 'A brick', 'A nail', 'A coin of iron'],
  ], [
    ['A Maasai girl wears beaded jewellery at a ceremony. What does this show?', 'Her identity and the ceremony', 'Nothing', 'Her height', 'The weather'],
    ['A learner threads beads with a needle. What is she making?', 'Beaded jewellery', 'A clay pot', 'A stool', 'A rope'],
    ['Which of these would you use to make a necklace?', 'Beads and thread', 'Bricks and cement', 'Paper only', 'Sand only'],
    ['Why do some people wear beads?', 'To show identity and for beauty', 'To make noise', 'To hide', 'To avoid work'],
    ['A bracelet is made in the colours of Kenya. What does it show?', 'Patriotism', 'Sadness', 'Weather', 'Hunger'],
  ], [
    ['Which step is the mistake?', 'Step 1: Beadwork uses small beads.', 'Step 2: Thread joins them.', 'Step 3: So cement is the main material.', 'Beads and thread are used.', 2],
    ['Which step is the mistake?', 'Step 1: Jewellery can mark a ceremony.', 'Step 2: It can show identity.', 'Step 3: So it shows nothing at all.', 'It shows identity and status.', 2],
    ['Which step is the mistake?', 'Step 1: Beads are small.', 'Step 2: A needle passes through them.', 'Step 3: So a hammer is used for beading.', 'A needle is used.', 2],
    ['Which step is the mistake?', 'Step 1: Beads can be glass or plastic.', 'Step 2: Local materials are also used.', 'Step 3: So iron nails are beads.', 'Nails are not beads.', 2],
    ['Which step is the mistake?', 'Step 1: Beadwork is an indigenous craft.', 'Step 2: It is passed on in communities.', 'Step 3: So it is not Kenyan.', 'It is a Kenyan craft.', 2],
  ], ['a', 'b']),
  ...S('sm', SW, 'SWIMMING', ['SM_PENCIL', 'SM_BACK', 'SM_SAFETY'], ['A pencil dive enters feet first with a straight body.', 'Swim only with a lifeguard or teacher.'], [
    ['In a pencil dive, how does the body enter the water?', 'Feet first, body straight', 'Head first with arms apart', 'Sideways on the belly', 'Backwards with arms wide'],
    ['In backstroke the swimmer lies on...', 'The back', 'The front', 'The side only', 'The knees'],
    ['When should a learner swim?', 'With a lifeguard or teacher', 'Alone at any time', 'In deep water without help', 'After dark alone'],
    ['What kick is used in backstroke?', 'A flutter kick', 'A scissor kick', 'No kick', 'A jump'],
    ['In a crouch dive, where does the diver start?', 'Crouched on the pool edge', 'Standing on a high board', 'Lying on the pool floor', 'Floating on the back'],
  ], [
    ['A swimmer enters the water feet first with arms by her sides. What is this?', 'A pencil dive', 'A crouch dive', 'A belly flop', 'A backstroke'],
    ['A swimmer lies on his back with alternate arm strokes. What is this?', 'Backstroke', 'Front crawl', 'Breaststroke', 'Butterfly'],
    ['A class wants to swim at a river alone. What should the teacher say?', 'Swim only with a lifeguard at a safe pool', 'Go alone', 'Go after school alone', 'Go without help'],
    ['A swimmer crouches on the pool edge before a dive. What is this?', 'A crouch dive', 'A pencil dive', 'A backstroke', 'A float'],
    ['Why are learners shown a dive by a teacher first?', 'For safety', 'For fun only', 'To save time', 'To win'],
  ], [
    ['Which step is the mistake?', 'Step 1: A pencil dive is a water entry.', 'Step 2: The body is straight.', 'Step 3: So the head enters first with arms apart.', 'The feet enter first.', 2],
    ['Which step is the mistake?', 'Step 1: Backstroke is a stroke.', 'Step 2: The swimmer faces up.', 'Step 3: So the swimmer lies on the front.', 'The swimmer lies on the back.', 2],
    ['Which step is the mistake?', 'Step 1: Water can be dangerous.', 'Step 2: A lifeguard watches.', 'Step 3: So learners may swim alone anytime.', 'Swim only with a lifeguard or teacher.', 2],
    ['Which step is the mistake?', 'Step 1: A crouch dive starts low.', 'Step 2: The diver is on the pool edge.', 'Step 3: So the diver starts on a high board.', 'The diver starts crouched on the edge.', 2],
    ['Which step is the mistake?', 'Step 1: Backstroke uses the legs.', 'Step 2: The legs flutter.', 'Step 3: So the legs stay still.', 'The legs flutter.', 2],
  ], ['a', 'd']),
  ...S('rg', IG, 'ROPE_GAMES', ['RG_NAME', 'RG_BENEFIT', 'RG_SKIP'], ['Rope games include skipping and tug of war.', 'They build fitness and coordination.'], [
    ['Which is a rope game?', 'Tug of war', 'Football', 'Swimming', 'Javelin'],
    ['What do rope games build?', 'Fitness and coordination', 'Weak muscles', 'Laziness', 'Boredom'],
    ['How is rope skipping done?', 'Jumping over the rope', 'Sitting down', 'Standing still', 'Lying flat'],
    ['In tug of war, what do two teams do?', 'Pull a rope in opposite directions', 'Kick a ball', 'Race to the finish', 'Throw the rope far'],
    ['Which helps skipping look good to music?', 'Jumping to the rhythm', 'Jumping with no beat', 'Standing still', 'Skipping silently'],
  ], [
    ['Two teams pull on the ends of a long rope. What game is this?', 'Tug of war', 'Football', 'Handball', 'Swimming'],
    ['A girl jumps over a swinging rope. What game is this?', 'Rope skipping', 'Tug of war', 'Handball', 'Javelin'],
    ['A teacher says rope games help fitness. What does this mean?', 'They keep the body strong and healthy', 'They make people weak', 'They waste time', 'They harm the body'],
    ['A class skips to a drum beat. What does this build?', 'Rhythm and coordination', 'Boredom', 'Weak legs', 'Silence'],
    ['Which game needs teamwork most?', 'Tug of war', 'Skipping alone', 'Running alone', 'Reading alone'],
  ], [
    ['Which step is the mistake?', 'Step 1: Rope games use a rope.', 'Step 2: Tug of war is one.', 'Step 3: So football is a rope game.', 'Tug of war is a rope game.', 2],
    ['Which step is the mistake?', 'Step 1: Rope games need moving.', 'Step 2: They build fitness.', 'Step 3: So they weaken the body.', 'They strengthen the body.', 2],
    ['Which step is the mistake?', 'Step 1: Skipping uses a rope.', 'Step 2: The rope swings.', 'Step 3: So one sits down to skip.', 'One jumps over the rope.', 2],
    ['Which step is the mistake?', 'Step 1: Tug of war has two teams.', 'Step 2: They pull in opposite directions.', 'Step 3: So they push the rope together.', 'They pull.', 2],
    ['Which step is the mistake?', 'Step 1: Music has a beat.', 'Step 2: Skipping can match it.', 'Step 3: So skipping must be silent.', 'Skipping can match a rhythm.', 2],
  ], ['a', 'd']),
  ...S('sv', AN, 'SPORTS_VALUES', ['SV_CHEAT', 'SV_VALUE', 'SV_TEAM'], ['Fair play, honesty and respect are values of sport.', 'Cheating spoils sport.'], [
    ['Which spoils clean sport?', 'Cheating', 'Fair play', 'Teamwork', 'Respect'],
    ['Which is a value of clean sport?', 'Fair play', 'Cheating', 'Bullying', 'Lying'],
    ['What matters in a team game?', 'Teamwork and respect', 'Only winning', 'Only shouting', 'Only one player'],
    ['Which shows respect in sport?', 'Shaking hands after a match', 'Insulting the referee', 'Refusing to play', 'Pushing a player'],
    ['What should you do if you lose a game?', 'Accept it with respect', 'Blame the team', 'Walk away angrily', 'Cheat next time'],
  ], [
    ['A player lies about a foul to win. What is this?', 'Cheating', 'Fair play', 'Teamwork', 'Respect'],
    ['A team shakes hands after a hard match. Which value is this?', 'Respect', 'Cheating', 'Anger', 'Pride'],
    ['A player helps up an opponent who fell. Which value is this?', 'Fair play', 'Cheating', 'Anger', 'Greed'],
    ['A team passes the ball to everyone. Which value is this?', 'Teamwork', 'Selfishness', 'Cheating', 'Pride'],
    ['A player takes a banned drug to win. What does this do to sport?', 'It spoils clean sport', 'It makes sport clean', 'It is allowed', 'It helps teamwork'],
  ], [
    ['Which step is the mistake?', 'Step 1: Sport has rules.', 'Step 2: Players follow them.', 'Step 3: So cheating is part of sport.', 'Cheating spoils sport.', 2],
    ['Which step is the mistake?', 'Step 1: Clean sport has values.', 'Step 2: Fair play is one.', 'Step 3: So cheating is a value.', 'Cheating is not a value.', 2],
    ['Which step is the mistake?', 'Step 1: A team game needs many players.', 'Step 2: They work together.', 'Step 3: So only winning matters.', 'Teamwork and respect matter.', 2],
    ['Which step is the mistake?', 'Step 1: Sport teaches honesty.', 'Step 2: Honest players tell the truth.', 'Step 3: So lying is acceptable.', 'Lying is not acceptable.', 2],
    ['Which step is the mistake?', 'Step 1: Drugs harm players.', 'Step 2: They are banned in sport.', 'Step 3: So drugs help clean sport.', 'Drugs spoil clean sport.', 2],
  ], ['a', 'a']),
];
