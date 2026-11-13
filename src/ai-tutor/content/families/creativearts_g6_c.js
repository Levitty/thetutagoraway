// ============================================================================
// GRADE 6 CREATIVE ARTS, THEME C: DESCANT RECORDER, ENSEMBLES, POTTERY (SLAB), SWIMMING (BREASTSTROKE) AND APPRECIATION (6 skills).
// Knowledge half only: playing, modelling, swimming and judging real work are practical or teacher-observed (see the non-question
// outcomes doc). Holes and signs are described in words. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a teacher signs them off. Instrument and craft facts are for a teacher to confirm.
// ============================================================================
import { fam, choose, spot, w, sp } from './creativearts_g6_lib.js';

const DR = 'PERFOR.DESCANT_RECORDER.', EN = 'PERFOR.INDIGENOUS_KENYAN_INSTRU.', PT = 'PERFOR.INDIGENOUS_KENYAN_CRAFT_.', SW = 'PERFOR.SWIMMING.', AP = 'APPREC.ANALYSIS_OF_CREATIVE_ART.';

export const FAMILIES = [
  // ---------------------------------------------------------------- DR.TECHNIQUE
  fam('dr.tq.hold', `${DR}TECHNIQUE`, 'direct', 1, choose([
    ['Which hand is on the top holes of a descant recorder?', 'The left hand', [...w('M_DR_HAND', 'The right hand'), ...w('M_DR_HAND', 'Both hands'), ...w('M_DR_HAND', 'Neither hand')], 'The left hand is on the top holes and the right hand below.'],
    ['How should you blow into the recorder?', 'Gently and steadily', [...w('M_DR_BLOW', 'As hard as you can'), ...w('M_DR_BLOW', 'In short loud bursts'), ...w('M_DR_BLOW', 'With puffed cheeks')], 'Gentle, steady breath gives a clear sound.'],
    ['How should the finger pads cover the holes?', 'Fully, with the pads', [...w('M_DR_HOLE', 'Partly, with the tips'), ...w('M_DR_HOLE', 'With the nails'), ...w('M_DR_HOLE', 'Not at all')], 'Cover the holes fully with the finger pads.'],
    ['What is the thumb of the left hand for?', 'It covers the hole at the back', [...w('M_DR_HAND', 'It holds the mouthpiece'), ...w('M_DR_HAND', 'It covers the first front hole'), ...w('M_DR_HAND', 'It does nothing')], 'The left thumb covers the back hole.'],
    ['Which word do you whisper with the tongue to start each note?', '"Too"', [...w('M_DR_BLOW', '"Hah"'), ...w('M_DR_BLOW', '"Sss"'), ...w('M_DR_BLOW', '"Mmm"')], 'Tonguing "too" starts each note clearly.'],
  ], { h: ['Think of the left hand on top, finger pads full, a gentle breath.', 'Start each note with "too".'], s1: 'Picture how to hold and blow.' })),
  fam('dr.tq.sound', `${DR}TECHNIQUE`, 'word', 2, choose([
    ['Achieng\'s recorder squeaks. What is the most likely cause?', 'She is blowing too hard', [...w('M_DR_BLOW', 'She is blowing too gently'), ...w('M_DR_HAND', 'She has the left hand on top'), ...w('M_DR_HOLE', 'She has covered the holes fully')], 'Blowing too hard makes a squeak.'],
    ['Otieno hears air leaking and a weak sound. What should he check?', 'That his finger pads cover the holes fully', [...w('M_DR_HOLE', 'That his tips cover the holes partly'), ...w('M_DR_BLOW', 'That he blows as hard as he can'), ...w('M_DR_HAND', 'That he swaps hands')], 'Air escapes through holes that are not fully covered.'],
    ['What happens to the sound when more holes are covered?', 'It gets lower', [...w('M_DR_HOLE', 'It gets higher'), ...w('M_DR_BLOW', 'It gets louder'), ...w('M_DR_HAND', 'It stops')], 'Covering more holes lengthens the air column and lowers the sound.'],
    ['Wanjiru wants to play the Kenya National Anthem. How does it begin?', '"Ee Mungu nguvu yetu"', [...w('M_DR_BLOW', '"Harambee, harambee"'), ...w('M_DR_BLOW', '"Tusimame imara"'), ...w('M_DR_BLOW', '"Wimbo wa taifa"')], 'The anthem begins "Ee Mungu nguvu yetu".'],
    ['Which is the right way to sit when playing the recorder?', 'Sit tall and hold it out from the body', [...w('M_DR_BLOW', 'Slouch and hold it close to the chest'), ...w('M_DR_HAND', 'Lie down'), ...w('M_DR_BLOW', 'Bend over the recorder')], 'A tall posture helps steady breath.'],
  ], { h: ['Squeaks come from blowing too hard or leaking holes.', 'More holes covered gives a lower sound.'], s1: 'Think of what changes the sound.' })),
  fam('dr.tq.spot', `${DR}TECHNIQUE`, 'spot', 3, spot([
    sp('Baraka explains the recorder.', ['The left hand is on the top holes.', 'The thumb covers the back hole.', 'The right hand is on the top holes.'], 2, 'The left hand is on the top holes.', 'M_DR_HAND'),
    sp('Wanjiru explains blowing.', ['Blow gently and steadily.', 'Tongue each note with "too".', 'Blow as hard as you can.'], 2, 'Blow gently, because a hard breath makes a squeak.', 'M_DR_BLOW'),
    sp('Kamau explains the holes.', ['Cover the holes with the finger pads.', 'Cover them fully.', 'Cover them partly so air can escape.'], 2, 'Cover the holes fully.', 'M_DR_HOLE'),
    sp('Mwende explains the notes.', ['More holes covered gives a lower sound.', 'The anthem begins "Ee Mungu nguvu yetu".', 'The right hand is on top.'], 2, 'The left hand is on top.', 'M_DR_HAND'),
    sp('Nekesa explains the sound.', ['A gentle breath gives a clear sound.', 'Pads cover the holes fully.', 'A hard breath gives a clear sound.'], 2, 'A hard breath gives a squeak.', 'M_DR_BLOW'),
  ], { h: ['Check each step: left hand on top, full pads, a gentle breath.', 'A hard breath makes a squeak.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- EN.ENSEMBLE
  fam('en.es.kinds', `${EN}ENSEMBLE`, 'direct', 1, choose([
    ['The nyatiti belongs to which kind of instrument?', 'String', [...w('M_EN_CAT', 'Wind'), ...w('M_EN_CAT', 'Percussion'), ...w('M_EN_CAT', 'Keyboard')], 'The nyatiti has strings.'],
    ['The ngoma drum belongs to which kind of instrument?', 'Percussion', [...w('M_EN_CAT', 'String'), ...w('M_EN_CAT', 'Wind'), ...w('M_EN_CAT', 'Keyboard')], 'The ngoma is hit, so it is percussion.'],
    ['The nzumari belongs to which kind of instrument?', 'Wind', [...w('M_EN_CAT', 'String'), ...w('M_EN_CAT', 'Percussion'), ...w('M_EN_CAT', 'Keyboard')], 'The nzumari is blown, so it is a wind instrument.'],
    ['Which group is a percussion ensemble?', 'Drums, rattles and shakers', [...w('M_EN_CAT', 'Flutes and horns'), ...w('M_EN_CAT', 'Orutu and nyatiti'), ...w('M_EN_CAT', 'Recorders only')], 'Drums, rattles and shakers are percussion.'],
    ['Which group is a wind ensemble?', 'Flutes and horns', [...w('M_EN_CAT', 'Drums and rattles'), ...w('M_EN_CAT', 'Orutu and litungu'), ...w('M_EN_CAT', 'Shakers and gourds')], 'Flutes and horns are blown.'],
  ], { h: ['Sort by how the sound is made.', 'Hit or shaken is percussion, blown is wind, plucked or bowed is string.'], s1: 'Ask how the sound is made.' })),
  fam('en.es.play', `${EN}ENSEMBLE`, 'why', 2, choose([
    ['What should players keep together in an ensemble?', 'A steady beat', [...w('M_EN_SOLO', 'Nothing, each plays his own beat'), ...w('M_EN_SOLO', 'The loudest sound'), ...w('M_EN_SOLO', 'A different speed each')], 'Players in an ensemble keep a steady beat together.'],
    ['What should an ensemble player do about loudness?', 'Balance the loudness with the others', [...w('M_EN_LOUD', 'Play as loud as possible'), ...w('M_EN_LOUD', 'Play very softly all the time'), ...w('M_EN_LOUD', 'Play louder than the leader')], 'Balance lets all the players be heard.'],
    ['Why do players listen to each other?', 'To play together and keep in time', [...w('M_EN_SOLO', 'To copy the loudest player'), ...w('M_EN_SOLO', 'To find mistakes to laugh at'), ...w('M_EN_LOUD', 'To drown the others out')], 'Listening helps players stay together.'],
    ['Achieng\'s drum is too loud and the nyatiti cannot be heard. What should she do?', 'Play more softly', [...w('M_EN_LOUD', 'Play even louder'), ...w('M_EN_SOLO', 'Stop playing for ever'), ...w('M_EN_SOLO', 'Play a different beat')], 'Balance means each instrument can be heard.'],
    ['How should players start and stop in an ensemble?', 'Together, following the leader', [...w('M_EN_SOLO', 'Whenever each wants'), ...w('M_EN_SOLO', 'One after another'), ...w('M_EN_LOUD', 'The loudest first')], 'Starting and stopping together keeps the music tidy.'],
  ], { h: ['A good ensemble player keeps the beat, listens, balances and follows the leader.', 'Louder does not mean better.'], s1: 'Think about the group, not one player.' }), 'b'),
  fam('en.es.spot', `${EN}ENSEMBLE`, 'spot', 3, spot([
    sp('Baraka explains instrument kinds.', ['Drums are percussion.', 'The nzumari is a wind instrument.', 'The nyatiti is a wind instrument.'], 2, 'The nyatiti is a string instrument.', 'M_EN_CAT'),
    sp('Wanjiru explains playing together.', ['Players listen to each other.', 'They keep a steady beat.', 'Each player plays his own beat.'], 2, 'Players keep a steady beat together.', 'M_EN_SOLO'),
    sp('Kamau explains loudness.', ['Players balance their loudness.', 'The leader helps them start together.', 'Each player plays as loudly as possible.'], 2, 'Players balance their loudness so all can be heard.', 'M_EN_LOUD'),
    sp('Mwende explains the kinds.', ['Flutes and horns are wind.', 'Shakers are percussion.', 'Drums are string instruments.'], 2, 'Drums are percussion.', 'M_EN_CAT'),
    sp('Nekesa explains an ensemble.', ['An ensemble can be of one kind.', 'It can be mixed.', 'Each player ignores the others.'], 2, 'Players listen to each other.', 'M_EN_SOLO'),
  ], { h: ['Check each step: how the sound is made, a steady beat, balance.', 'Players listen to each other.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PT.SLAB
  fam('pt.sl.steps', `${PT}SLAB`, 'steps', 1, choose([
    ['What is a slab in pottery?', 'A flat sheet of clay', [...w('M_PS_COIL', 'A long coil of clay'), ...w('M_PS_COIL', 'A ball of clay'), ...w('M_PS_COIL', 'A pinched pot')], 'A slab is rolled flat to an even thickness.'],
    ['What is the first step of the slab technique?', 'Roll the clay flat', [...w('M_PS_COIL', 'Roll the clay into coils'), ...w('M_PS_JOIN', 'Press the pieces together'), ...w('M_PS_DRY', 'Dry the vase in the sun')], 'First the clay is rolled into a flat slab.'],
    ['How do you join two slabs?', 'Scratch the edges, wet them with slip and press', [...w('M_PS_JOIN', 'Press them together dry'), ...w('M_PS_JOIN', 'Tie them with string'), ...w('M_PS_JOIN', 'Glue them with paper glue')], 'Scoring and slip hold the pieces together.'],
    ['What is slip?', 'Clay mixed with water', [...w('M_PS_JOIN', 'A tool for rolling'), ...w('M_PS_JOIN', 'A kind of glue from a shop'), ...w('M_PS_JOIN', 'A dry clay powder')], 'Slip is clay and water, used like glue.'],
    ['How should a clay item be dried?', 'Slowly in the shade', [...w('M_PS_DRY', 'Quickly in the hot sun'), ...w('M_PS_DRY', 'Near a fire at once'), ...w('M_PS_DRY', 'In the rain')], 'Clay dried too fast cracks.'],
  ], { h: ['Think: roll, cut, score, join, dry slowly.', 'Slip is clay and water.'], s1: 'Recall the steps of the slab technique.' })),
  fam('pt.sl.make', `${PT}SLAB`, 'word', 2, choose([
    ['Achieng is making a vase from slabs. She has cut a rectangle. What does she do next?', 'Roll it into a cylinder and join the edges', [...w('M_PS_COIL', 'Roll the clay into coils'), ...w('M_PS_JOIN', 'Dry it at once'), ...w('M_PS_DRY', 'Put it in the sun')], 'The rectangle is rolled into a cylinder and the edges joined with slip.'],
    ['Otieno\'s joined pieces fall apart. What did he forget?', 'To score the edges and use slip', [...w('M_PS_JOIN', 'To dry the clay in the sun'), ...w('M_PS_COIL', 'To make a coil'), ...w('M_PS_DRY', 'To fire the clay in the sun')], 'Scoring and slip are needed to join pieces.'],
    ['Wanjiru\'s tile cracked while drying. What most likely happened?', 'It dried too fast', [...w('M_PS_DRY', 'It dried too slowly'), ...w('M_PS_JOIN', 'It was joined with slip'), ...w('M_PS_COIL', 'It was made with coils')], 'Clay dried too fast cracks.'],
    ['How can a clay vase be decorated?', 'By cutting lines or pressing patterns into it', [...w('M_PS_COIL', 'By rolling it into a ball'), ...w('M_PS_DRY', 'By leaving it in the sun'), ...w('M_PS_JOIN', 'By gluing it with paper')], 'Incising and impressing decorate clay.'],
    ['Which item can be made using the slab technique?', 'A vase or a tray', [...w('M_PS_COIL', 'A coil snake'), ...w('M_PS_COIL', 'A bead'), ...w('M_PS_COIL', 'A clay ball')], 'Flat sheets can make a vase or a tray.'],
  ], { h: ['Slabs are flat sheets; they are scored and joined with slip.', 'Dry clay slowly.'], s1: 'Think of the steps and what each does.' })),
  fam('pt.sl.spot', `${PT}SLAB`, 'spot', 3, spot([
    sp('Baraka explains the slab technique.', ['A slab is a flat sheet of clay.', 'It is rolled to an even thickness.', 'A slab is a long coil of clay.'], 2, 'A slab is a flat sheet, not a coil.', 'M_PS_COIL'),
    sp('Wanjiru explains joining.', ['Scratch the edges.', 'Wet them with slip.', 'Press them together dry.'], 2, 'Wet the edges with slip before pressing.', 'M_PS_JOIN'),
    sp('Kamau explains drying.', ['Dry the clay slowly.', 'Keep it in the shade.', 'Dry it quickly in the hot sun.'], 2, 'Dry it slowly, because fast drying cracks clay.', 'M_PS_DRY'),
    sp('Mwende explains slip.', ['Slip is clay and water.', 'It is used to join pieces.', 'Slip is a tool for rolling.'], 2, 'Slip is clay mixed with water.', 'M_PS_JOIN'),
    sp('Nekesa explains making a vase.', ['Roll a slab.', 'Cut a rectangle.', 'Roll long coils.'], 2, 'A slab vase is made from flat slabs, not coils.', 'M_PS_COIL'),
  ], { h: ['Check each step: flat slab, score, slip, dry slowly.', 'Slip is clay and water.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SW.BREASTSTROKE
  fam('sw.bs.body', `${SW}BREASTSTROKE`, 'direct', 1, choose([
    ['How does the body lie in breaststroke?', 'Flat and face down', [...w('M_SW_BACK', 'On the back'), ...w('M_SW_BACK', 'Standing upright'), ...w('M_SW_BACK', 'On one side')], 'In breaststroke the body lies flat and face down.'],
    ['What kind of kick is used in breaststroke?', 'A frog kick', [...w('M_SW_KICK', 'A flutter kick up and down'), ...w('M_SW_KICK', 'A scissor kick'), ...w('M_SW_KICK', 'No kick')], 'The frog kick brings the knees up, turns the feet out and kicks back and together.'],
    ['How do the arms move in breaststroke?', 'They sweep out, in and forward', [...w('M_SW_KICK', 'They circle like a windmill'), ...w('M_SW_KICK', 'They stay still at the sides'), ...w('M_SW_KICK', 'They flap up and down')], 'The arms sweep out, in and forward.'],
    ['When does the swimmer breathe?', 'At the end of the arm pull, by lifting the head', [...w('M_SW_BACK', 'Never during the stroke'), ...w('M_SW_BACK', 'Only when stopped at the wall'), ...w('M_SW_BACK', 'While kicking only')], 'The head lifts to breathe at the end of the arm pull.'],
    ['Which stroke is swum on the back?', 'Backstroke', [...w('M_SW_BACK', 'Breaststroke'), ...w('M_SW_BACK', 'The crawl'), ...w('M_SW_BACK', 'Butterfly')], 'Backstroke is swum on the back. Breaststroke is face down.'],
  ], { h: ['Picture a frog swimming: face down, arms out and in, a frog kick.', 'Breaststroke is not swum on the back.'], s1: 'Picture the stroke.' })),
  fam('sw.bs.safety', `${SW}BREASTSTROKE`, 'why', 2, choose([
    ['When may a child swim?', 'Only with a trained adult watching', [...w('M_SW_SAFETY', 'Alone, if he swims very well'), ...w('M_SW_SAFETY', 'With a friend but with no adult near'), ...w('M_SW_SAFETY', 'At any time he likes in any place')], 'A child swims only with a trained adult watching.'],
    ['Achieng can swim well. Her friends want to swim in a river with no adult. What should she do?', 'Say no and swim only where an adult watches', [...w('M_SW_SAFETY', 'Go because she swims well enough'), ...w('M_SW_SAFETY', 'Go but stay near the bank of the river'), ...w('M_SW_SAFETY', 'Go and teach the others how to swim')], 'Skill does not make a river safe.'],
    ['Otieno is kicking his legs up and down in breaststroke. What is wrong?', 'Breaststroke uses a frog kick', [...w('M_SW_KICK', 'Nothing, that is the kick'), ...w('M_SW_KICK', 'He should not kick at all'), ...w('M_SW_BACK', 'He should lie on his back')], 'Up and down is a flutter kick, not a frog kick.'],
    ['Wanjiru is swimming on her back and says it is breaststroke. What is wrong?', 'Breaststroke is swum face down', [...w('M_SW_BACK', 'Nothing, breaststroke is on the back'), ...w('M_SW_BACK', 'She should stand up'), ...w('M_SW_KICK', 'She should use a flutter kick')], 'Breaststroke is face down.'],
    ['Why is a glide useful in breaststroke?', 'It lets the swimmer rest and move forward after the kick', [...w('M_SW_KICK', 'It makes the swimmer sink'), ...w('M_SW_BACK', 'It is the time to breathe in only'), ...w('M_SW_KICK', 'It has no use')], 'The glide uses the push of the kick.'],
  ], { h: ['Breaststroke is face down with a frog kick.', 'A child swims only with a trained adult watching.'], s1: 'Think about technique and safety.' })),
  fam('sw.bs.spot', `${SW}BREASTSTROKE`, 'spot', 3, spot([
    sp('Baraka explains breaststroke.', ['The body lies flat.', 'The face is down.', 'The swimmer lies on the back.'], 2, 'Breaststroke is swum face down.', 'M_SW_BACK'),
    sp('Wanjiru explains the legs.', ['The knees bend.', 'The feet turn out.', 'The legs kick up and down.'], 2, 'The legs kick back and together, like a frog.', 'M_SW_KICK'),
    sp('Kamau explains safety.', ['Swim where an adult watches.', 'Learn from a trained teacher.', 'Swim alone if you are strong.'], 2, 'A child swims only with a trained adult watching.', 'M_SW_SAFETY'),
    sp('Mwende explains the arms.', ['The arms sweep out.', 'Then they sweep in.', 'Then they circle like a windmill.'], 2, 'The arms sweep forward after they come in.', 'M_SW_KICK'),
    sp('Nekesa explains the stroke.', ['It uses a frog kick.', 'The head lifts to breathe.', 'It is swum on the back.'], 2, 'It is swum face down.', 'M_SW_BACK'),
  ], { h: ['Check each step: face down, a frog kick, a trained adult.', 'The legs kick back and together.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- AP.ELEMENTS
  fam('ap.el.names', `${AP}ELEMENTS`, 'direct', 1, choose([
    ['What is tempo?', 'How fast or slow the music is', [...w('M_AE_TEMPO', 'How loud or soft the music is'), ...w('M_AE_PITCH', 'How high or low a sound is'), ...w('M_AE_TEMPO', 'The words of the song')], 'Tempo is how fast or slow.'],
    ['What is pitch?', 'How high or low a sound is', [...w('M_AE_PITCH', 'How loud a sound is'), ...w('M_AE_TEMPO', 'How fast the music is'), ...w('M_AE_PITCH', 'The tune of the song')], 'Pitch is how high or low.'],
    ['What are dynamics?', 'How loud or soft the music is', [...w('M_AE_TEMPO', 'How fast or slow the music is'), ...w('M_AE_PITCH', 'How high or low the music is'), ...w('M_AE_TEMPO', 'How many singers there are')], 'Dynamics is how loud or soft.'],
    ['What is rhythm?', 'The pattern of long and short sounds', [...w('M_AE_TEMPO', 'The speed of the music'), ...w('M_AE_PITCH', 'How high the notes are'), ...w('M_AE_MESSAGE', 'What the words teach')], 'Rhythm is the pattern of long and short sounds.'],
    ['What is a melody?', 'The tune', [...w('M_AE_MESSAGE', 'The words only'), ...w('M_AE_TEMPO', 'The speed'), ...w('M_AE_PITCH', 'The loudness')], 'The melody is the tune of the song.'],
  ], { h: ['Tempo is speed, pitch is high or low, dynamics is loud or soft.', 'Rhythm is long and short sounds.'], s1: 'Recall each element.' })),
  fam('ap.el.message', `${AP}ELEMENTS`, 'why', 2, choose([
    ['What is the message of a song?', 'What the words teach or say', [...w('M_AE_MESSAGE', 'The tune'), ...w('M_AE_MESSAGE', 'The beat'), ...w('M_AE_MESSAGE', 'The name of the singer')], 'The message is what the words teach or say.'],
    ['A song says, "Let us work together to keep our rivers clean." What is its message?', 'We should work together to care for the environment', [...w('M_AE_MESSAGE', 'The tune is slow and the singing soft'), ...w('M_AE_TEMPO', 'The song is loud and fast from start to end'), ...w('M_AE_PITCH', 'The song is high and bright all through')], 'The words carry the message.'],
    ['A song goes quickly and loudly. Which two elements are these?', 'Tempo (fast) and dynamics (loud)', [...w('M_AE_TEMPO', 'Pitch (fast) and rhythm (loud)'), ...w('M_AE_PITCH', 'Melody (fast) and pitch (loud)'), ...w('M_AE_TEMPO', 'Dynamics (fast) and tempo (loud)')], 'Fast is tempo and loud is dynamics.'],
    ['A song starts low and ends high. Which element changed?', 'Pitch', [...w('M_AE_PITCH', 'Tempo'), ...w('M_AE_PITCH', 'Dynamics'), ...w('M_AE_PITCH', 'Message')], 'Pitch is how high or low.'],
    ['Which is a message a song might carry?', 'Be kind and respect others', [...w('M_AE_MESSAGE', 'Fah, soh, lah and the rest of the ladder'), ...w('M_AE_MESSAGE', 'Play it softly at the end of the song'), ...w('M_AE_MESSAGE', 'Clap on every beat in the chorus')], 'A message is a lesson in the words.'],
  ], { h: ['The message is in the words; the elements are in the music.', 'Fast is tempo; loud is dynamics; high is pitch.'], s1: 'Separate the words from the music.' }), 'c'),
  fam('ap.el.spot', `${AP}ELEMENTS`, 'spot', 3, spot([
    sp('Baraka explains the elements.', ['Tempo is how fast or slow.', 'Dynamics is how loud or soft.', 'Tempo is how loud or soft.'], 2, 'Tempo is speed. Dynamics is loudness.', 'M_AE_TEMPO'),
    sp('Wanjiru explains pitch.', ['Pitch is how high or low a sound is.', 'A high note has a high pitch.', 'Pitch is how loud a sound is.'], 2, 'Pitch is how high or low.', 'M_AE_PITCH'),
    sp('Kamau explains the message.', ['A song has words.', 'The words can teach a lesson.', 'The message is the tune.'], 2, 'The message is what the words teach.', 'M_AE_MESSAGE'),
    sp('Mwende explains rhythm.', ['Rhythm is a pattern of sounds.', 'It has long and short sounds.', 'It is how high the notes are.'], 2, 'Pitch is how high the notes are.', 'M_AE_PITCH'),
    sp('Nekesa explains a melody.', ['A melody is a tune.', 'It has high and low notes.', 'A melody is how fast the music is.'], 2, 'Tempo is how fast the music is.', 'M_AE_TEMPO'),
  ], { h: ['Check each step: tempo speed, pitch high or low, dynamics loud or soft.', 'The message is in the words.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- AP.CATALOGUE
  fam('ap.ct.what', `${AP}CATALOGUE`, 'direct', 1, choose([
    ['What is a catalogue of an exhibition?', 'A list of the artworks with details', [...w('M_AC_STORY', 'A story about the life of the artist'), ...w('M_AC_STORY', 'A picture of the hall where it is shown'), ...w('M_AC_STORY', 'A bill for the paint and the frames')], 'A catalogue lists the artworks with details.'],
    ['Why is a catalogue made?', 'To help visitors find and understand the works', [...w('M_AC_PURPOSE', 'To keep the artworks secret from visitors'), ...w('M_AC_PURPOSE', 'To hide the prices of the artworks'), ...w('M_AC_PURPOSE', 'For the teacher alone to read')], 'A catalogue guides the visitors.'],
    ['Which detail belongs in a catalogue entry?', 'The title and the artist', [...w('M_AC_ENTRY', 'The visitor\'s name'), ...w('M_AC_ENTRY', 'The weather that day'), ...w('M_AC_ENTRY', 'The cost of the paint brush')], 'An entry gives the title and the artist.'],
    ['Which detail also belongs in a catalogue entry?', 'The material and the size', [...w('M_AC_ENTRY', 'The visitor\'s phone number'), ...w('M_AC_ENTRY', 'What the artist ate'), ...w('M_AC_ENTRY', 'The name of the school bus')], 'An entry names the material and size of the work.'],
    ['How are entries usually arranged?', 'In order, with a number for each work', [...w('M_AC_PURPOSE', 'At random, in any order at all'), ...w('M_AC_PURPOSE', 'By the age of the visitors who come'), ...w('M_AC_PURPOSE', 'By the colour of the frames on the wall')], 'Numbers help visitors match an entry to a work.'],
  ], { h: ['A catalogue is a list that helps visitors.', 'An entry gives a number, title, artist, material and size.'], s1: 'Think about who the catalogue is for.' })),
  fam('ap.ct.use', `${AP}CATALOGUE`, 'word', 2, choose([
    ['Achieng visits the school exhibition and wants to know who made a painting. Where does she look?', 'In the catalogue entry for that painting', [...w('M_AC_PURPOSE', 'On the floor near the painting'), ...w('M_AC_STORY', 'In a story about the life of the artist'), ...w('M_AC_ENTRY', 'In the visitor book at the door')], 'The entry names the artist.'],
    ['Otieno writes a catalogue entry for his collage. What should he include?', 'A number, the title, his name, the materials and the size', [...w('M_AC_ENTRY', 'The names of the visitors who came'), ...w('M_AC_ENTRY', 'What he ate that day at school'), ...w('M_AC_STORY', 'A long story about his week at school')], 'These are the details of an entry.'],
    ['Wanjiru says, "A catalogue is a story about the artist." Is she right?', 'No, it is a list of the artworks and their details', [...w('M_AC_STORY', 'Yes, it is a long story about the artist'), ...w('M_AC_STORY', 'Yes, because it has the artist\'s name'), ...w('M_AC_STORY', 'Yes, it is a poem about the works')], 'A catalogue lists the works.'],
    ['Which of these is NOT in a catalogue entry?', 'The visitor\'s name', [...w('M_AC_ENTRY', 'The title'), ...w('M_AC_ENTRY', 'The artist'), ...w('M_AC_ENTRY', 'The material')], 'The visitor\'s name is not part of an entry.'],
    ['Why does each entry have a number?', 'So visitors can match it to the artwork', [...w('M_AC_PURPOSE', 'To count the visitors at the door'), ...w('M_AC_PURPOSE', 'To show the price of the work only'), ...w('M_AC_PURPOSE', 'To hide the title from the visitors')], 'The number matches an entry to a work.'],
  ], { h: ['A catalogue lists the works for visitors.', 'The visitor\'s name is not part of an entry.'], s1: 'Think about what visitors need.' })),
  fam('ap.ct.spot', `${AP}CATALOGUE`, 'spot', 3, spot([
    sp('Baraka explains a catalogue.', ['A catalogue is a list.', 'It lists the artworks.', 'It is a story about the artist.'], 2, 'A catalogue is a list, not a story.', 'M_AC_STORY'),
    sp('Wanjiru explains an entry.', ['An entry gives the title.', 'It gives the artist.', 'It gives the visitor\'s name.'], 2, 'An entry does not give the visitor\'s name.', 'M_AC_ENTRY'),
    sp('Kamau explains why.', ['It helps visitors find the works.', 'It helps them understand the works.', 'It keeps the works secret.'], 2, 'A catalogue helps visitors, it does not hide the works.', 'M_AC_PURPOSE'),
    sp('Mwende explains the numbers.', ['Each work has a number.', 'The number matches the entry.', 'The number is the visitor\'s age.'], 2, 'The number matches the entry to the work.', 'M_AC_ENTRY'),
    sp('Nekesa explains the details.', ['An entry gives the material.', 'It gives the size.', 'It gives the weather.'], 2, 'An entry does not give the weather.', 'M_AC_ENTRY'),
  ], { h: ['Check each step: a list, details of the work, for visitors.', 'The visitor\'s name is not in an entry.'], s1: 'Find the step that is not true.' })),
];
