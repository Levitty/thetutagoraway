// ============================================================================
// GRADE 5 CREATIVE ARTS, THEME D: PUPPETRY, DESCANT RECORDER, SWIMMING AND COUNTING GAMES, APPRECIATION (11 skills).
// Knowledge half only: making puppets, playing, swimming and judging real work are practical or teacher-observed (see the
// non-question outcomes doc). Holes and signs are described in words. Every wrong answer names the library misconception it
// reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, w, sp } from './creativearts_g5_lib.js';

const PP = 'PERFOR.PUPPETRY.', DR = 'PERFOR.DESCANT_RECORDER.', SW = 'PERFOR.SWIMMING.', AP = 'APPREC.ANALYSIS_OF_CREATIVE_ART.';

export const FAMILIES = [
  // ---------------------------------------------------------------- PP.TYPES
  fam('pp.ty.which', `${PP}TYPES`, 'direct', 1, choose([
    ['How is a glove puppet moved?', 'By the hand and fingers inside it', [...w('M_PP_GLOVE_STRING', 'By strings from above'), ...w('M_PP_GLOVE_STRING', 'By long sticks'), ...w('M_PP_SHADOW_GLOVE', 'By a light behind it')], 'The hand inside moves the head and arms.'],
    ['Which puppet fits on a single finger?', 'A finger puppet', [...w('M_PP_GLOVE_FINGER', 'A glove puppet'), ...w('M_PP_GLOVE_STRING', 'A string puppet'), ...w('M_PP_SHADOW_GLOVE', 'A shadow puppet')], 'A finger puppet fits on one finger.'],
    ['Which puppet hangs on strings?', 'A string puppet', [...w('M_PP_GLOVE_STRING', 'A glove puppet'), ...w('M_PP_GLOVE_FINGER', 'A finger puppet'), ...w('M_PP_SHADOW_GLOVE', 'A shadow puppet')], 'A string puppet is moved by strings.'],
    ['Which puppet is seen as a shadow on a lit screen?', 'A shadow puppet', [...w('M_PP_SHADOW_GLOVE', 'A glove puppet'), ...w('M_PP_GLOVE_FINGER', 'A finger puppet'), ...w('M_PP_GLOVE_STRING', 'A string puppet')], 'A shadow puppet is a flat shape behind a light.'],
    ['Which puppet is worn over the whole hand?', 'A glove puppet', [...w('M_PP_GLOVE_FINGER', 'A finger puppet'), ...w('M_PP_GLOVE_STRING', 'A string puppet'), ...w('M_PP_SHADOW_GLOVE', 'A shadow puppet')], 'A glove puppet covers the hand.'],
  ], { h: ['Think how each puppet is held or moved.', 'Glove: hand. Finger: one finger. String: strings. Shadow: light.'], s1: 'Recall the puppet types.' })),
  fam('pp.ty.story', `${PP}TYPES`, 'word', 2, choose([
    ['Njeri puts her hand into a cloth animal and moves its head with her fingers. What is it?', 'A glove puppet', [...w('M_PP_GLOVE_STRING', 'A string puppet'), ...w('M_PP_GLOVE_FINGER', 'A finger puppet'), ...w('M_PP_SHADOW_GLOVE', 'A shadow puppet')], 'The hand moves it, so it is a glove puppet.'],
    ['Otieno makes a tiny puppet that fits only on his thumb. What is it?', 'A finger puppet', [...w('M_PP_GLOVE_FINGER', 'A glove puppet'), ...w('M_PP_GLOVE_STRING', 'A string puppet'), ...w('M_PP_SHADOW_GLOVE', 'A shadow puppet')], 'It fits on one finger.'],
    ['Amina holds a puppet up by strings and makes it dance. What is it?', 'A string puppet', [...w('M_PP_GLOVE_STRING', 'A glove puppet'), ...w('M_PP_GLOVE_FINGER', 'A finger puppet'), ...w('M_PP_SHADOW_GLOVE', 'A shadow puppet')], 'It hangs on strings.'],
    ['Kamau cuts a flat cardboard giraffe and shines a torch on a sheet. What kind of puppet is it?', 'A shadow puppet', [...w('M_PP_SHADOW_GLOVE', 'A glove puppet'), ...w('M_PP_GLOVE_FINGER', 'A finger puppet'), ...w('M_PP_GLOVE_STRING', 'A string puppet')], 'It is seen as a shadow.'],
    ['Zawadi says a glove puppet hangs on strings. What should her teacher say?', 'It is worn on the hand', [...w('M_PP_GLOVE_STRING', 'She is right'), ...w('M_PP_GLOVE_STRING', 'It hangs on sticks'), ...w('M_PP_GLOVE_FINGER', 'It fits on one finger')], 'A glove puppet is worn on the hand.'],
  ], { h: ['Think how each puppet is held or moved.', 'Glove: hand. Finger: one finger. String: strings. Shadow: light.'], s1: 'Match the puppet to the description.' })),
  fam('pp.ty.spot', `${PP}TYPES`, 'spot', 3, spot([
    sp('Wekesa explains puppets. Which step has the mistake?', ['Step 1: A glove puppet is worn on the hand.', 'Step 2: Fingers move the head.', 'Step 3: It hangs on strings.'], 2, 'A string puppet hangs on strings.', 'M_PP_GLOVE_STRING'),
    sp('Chebet explains puppets. Which step has the mistake?', ['Step 1: A finger puppet fits one finger.', 'Step 2: A glove puppet fits one finger only.', 'Step 3: A glove puppet covers the hand.'], 1, 'A glove puppet covers the hand.', 'M_PP_GLOVE_FINGER'),
    sp('Juma explains shadows. Which step has the mistake?', ['Step 1: A light shines on a screen.', 'Step 2: A flat shape is held in front of it.', 'Step 3: He calls it a glove puppet.'], 2, 'It is a shadow puppet.', 'M_PP_SHADOW_GLOVE'),
    sp('Njeri explains movement. Which step has the mistake?', ['Step 1: Her hand goes inside the puppet.', 'Step 2: Her fingers move its arms.', 'Step 3: She says it hangs on strings.'], 2, 'A glove puppet is moved by the hand.', 'M_PP_GLOVE_STRING'),
    sp('Amina names puppets. Which step has the mistake?', ['Step 1: A string puppet has strings.', 'Step 2: A shadow puppet is flat.', 'Step 3: A finger puppet covers the whole hand.'], 2, 'A finger puppet fits on one finger.', 'M_PP_GLOVE_FINGER'),
  ], { h: ['Check each step.', 'Glove: hand. Finger: one finger. String: strings. Shadow: light.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PP.MAKE
  fam('pp.mk.which', `${PP}MAKE`, 'direct', 1, choose([
    ['Which is a recyclable material for a puppet?', 'An old sock', [...w('M_PP_RECYCLE_NEW', 'New cloth from the shop'), ...w('M_PP_RECYCLE_NEW', 'A new toy'), ...w('M_PP_RECYCLE_NEW', 'A new shirt')], 'Recyclable means used things used again.'],
    ['What can be used for a puppet\'s eyes?', 'Bottle tops', [...w('M_PP_RECYCLE_NEW', 'New glass beads from the shop'), ...w('M_PP_RECYCLE_NEW', 'New marbles'), ...w('M_PP_RECYCLE_NEW', 'New buttons bought today')], 'Bottle tops are recyclable.'],
    ['Why must a glove puppet fit the hand?', 'So fingers can move the head and arms', [...w('M_PP_SIZE_NO_FIT', 'It does not need to fit'), ...w('M_PP_SIZE_NO_FIT', 'So it looks big'), ...w('M_PP_SIZE_NO_FIT', 'So it is heavy')], 'It must fit to be moved.'],
    ['How should scissors be used when making a puppet?', 'Carefully, with an adult watching', [...w('M_PP_SHARP_UNSUPERVISED', 'Freely, without help'), ...w('M_PP_SHARP_UNSUPERVISED', 'Quickly, to finish first'), ...w('M_PP_SHARP_UNSUPERVISED', 'While running')], 'Sharp tools need care.'],
    ['Which is a good recyclable material for a puppet\'s body?', 'A paper bag', [...w('M_PP_RECYCLE_NEW', 'A brand new cloth'), ...w('M_PP_RECYCLE_NEW', 'A new plastic toy'), ...w('M_PP_RECYCLE_NEW', 'New wool just bought')], 'Used paper bags can be reused.'],
  ], { h: ['Recyclable means used and used again.', 'The puppet must fit the hand.'], s1: 'Recall how to make a puppet.' })),
  fam('pp.mk.story', `${PP}MAKE`, 'word', 2, choose([
    ['Njeri wants to make a puppet without buying anything. What does she use?', 'Old socks and cardboard', [...w('M_PP_RECYCLE_NEW', 'New cloth she buys'), ...w('M_PP_RECYCLE_NEW', 'New puppets from the shop'), ...w('M_PP_RECYCLE_NEW', 'New wool bought today')], 'Used things are recyclable.'],
    ['Otieno\'s puppet is too big and his fingers cannot reach the arms. What went wrong?', 'It did not fit his hand', [...w('M_PP_SIZE_NO_FIT', 'Nothing, the size is not important'), ...w('M_PP_SIZE_NO_FIT', 'The colour was wrong'), ...w('M_PP_SIZE_NO_FIT', 'The eyes were small')], 'A glove puppet must fit the hand.'],
    ['Amina uses a sharp blade alone to cut cardboard. What should she do?', 'Ask an adult to help', [...w('M_PP_SHARP_UNSUPERVISED', 'Keep going alone'), ...w('M_PP_SHARP_UNSUPERVISED', 'Cut faster'), ...w('M_PP_SHARP_UNSUPERVISED', 'Let a friend cut')], 'An adult must watch.'],
    ['Kamau needs hair for his puppet. Which recyclable material does he use?', 'Old wool or cloth strips', [...w('M_PP_RECYCLE_NEW', 'New wigs from the shop'), ...w('M_PP_RECYCLE_NEW', 'New hair ribbons bought today'), ...w('M_PP_RECYCLE_NEW', 'New nylon rope')], 'Old wool can be reused.'],
    ['Zawadi says recyclable means any new material. What is the right meaning?', 'Used things that are used again', [...w('M_PP_RECYCLE_NEW', 'Anything bought new'), ...w('M_PP_RECYCLE_NEW', 'Anything coloured'), ...w('M_PP_RECYCLE_NEW', 'Anything expensive')], 'Recyclable means used again.'],
  ], { h: ['Recyclable means used and used again.', 'The puppet must fit the hand.'], s1: 'Decide what the puppet maker should do.' })),
  fam('pp.mk.spot', `${PP}MAKE`, 'spot', 3, spot([
    sp('Wekesa plans a puppet. Which step has the mistake?', ['Step 1: He collects old socks.', 'Step 2: He buys new cloth and calls it recyclable.', 'Step 3: He sews the face.'], 1, 'New cloth is not recyclable.', 'M_PP_RECYCLE_NEW'),
    sp('Chebet sizes a puppet. Which step has the mistake?', ['Step 1: She measures her hand.', 'Step 2: She makes the puppet bigger than her hand.', 'Step 3: She says it will work.'], 1, 'It must fit her hand.', 'M_PP_SIZE_NO_FIT'),
    sp('Juma cuts cardboard. Which step has the mistake?', ['Step 1: He draws the shape.', 'Step 2: He cuts it with sharp scissors alone.', 'Step 3: He glues it.'], 1, 'An adult should watch.', 'M_PP_SHARP_UNSUPERVISED'),
    sp('Njeri chooses materials. Which step has the mistake?', ['Step 1: Bottle tops for eyes.', 'Step 2: Old cloth for the body.', 'Step 3: She says new things only are recyclable.'], 2, 'Recyclable means used things used again.', 'M_PP_RECYCLE_NEW'),
    sp('Amina checks the fit. Which step has the mistake?', ['Step 1: She puts her hand in.', 'Step 2: Her fingers cannot move the arms.', 'Step 3: She says the size does not matter.'], 2, 'The puppet must fit so fingers can move it.', 'M_PP_SIZE_NO_FIT'),
  ], { h: ['Check each step.', 'Recyclable means used again. It must fit the hand.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PP.SHOW
  fam('pp.sh.which', `${PP}SHOW`, 'direct', 1, choose([
    ['Which puppet moves when it speaks?', 'Only the speaking puppet', [...w('M_PP_ALL_MOVE', 'All puppets at once'), ...w('M_PP_ALL_MOVE', 'None of them'), ...w('M_PP_ALL_MOVE', 'The biggest puppet')], 'Only the speaker moves.'],
    ['Where do the puppeteers stand?', 'Behind a screen', [...w('M_PP_SHOW_FACE', 'In front of the screen'), ...w('M_PP_SHOW_FACE', 'Among the audience'), ...w('M_PP_SHOW_FACE', 'Beside the audience')], 'A screen hides the puppeteers.'],
    ['What is a topical song?', 'A song about an issue in the community', [...w('M_PP_TOPICAL_ANY', 'Any song we like'), ...w('M_PP_TOPICAL_ANY', 'A song with no words'), ...w('M_PP_TOPICAL_ANY', 'A very old song')], 'It is about an issue people discuss.'],
    ['Which is a topical song theme?', 'Road safety', [...w('M_PP_TOPICAL_ANY', 'A random tune'), ...w('M_PP_TOPICAL_ANY', 'A lullaby with no issue'), ...w('M_PP_TOPICAL_ANY', 'Nothing in particular')], 'Road safety is a community issue.'],
    ['What does each character in a puppet show need?', 'A different voice', [...w('M_PP_ALL_MOVE', 'The same voice as the others'), ...w('M_PP_ALL_MOVE', 'No voice at all'), ...w('M_PP_ALL_MOVE', 'A whisper only')], 'Different voices tell characters apart.'],
  ], { h: ['Think of a show: screen, voices, one speaker moves.', 'A topical song is about a community issue.'], s1: 'Recall what a puppet show needs.' })),
  fam('pp.sh.story', `${PP}SHOW`, 'word', 2, choose([
    ['Njeri\'s two puppets are talking. Which one should move?', 'The one that is speaking', [...w('M_PP_ALL_MOVE', 'Both at once'), ...w('M_PP_ALL_MOVE', 'The one that is quiet'), ...w('M_PP_ALL_MOVE', 'Neither')], 'The speaker moves.'],
    ['Otieno stands in front of the puppet stage. The audience watches him, not the puppets. What should he do?', 'Stand behind the screen', [...w('M_PP_SHOW_FACE', 'Wave to the audience'), ...w('M_PP_SHOW_FACE', 'Stand taller'), ...w('M_PP_SHOW_FACE', 'Speak louder in front')], 'A screen hides the puppeteers.'],
    ['Amina\'s class sings about washing hands to stop sickness. What kind of song is this?', 'A topical song', [...w('M_PP_TOPICAL_ANY', 'A lullaby'), ...w('M_PP_TOPICAL_ANY', 'A counting song'), ...w('M_PP_TOPICAL_ANY', 'A silent song')], 'It is about a community issue.'],
    ['Kamau\'s puppets all use the same voice. How can he improve?', 'Give each a different voice', [...w('M_PP_ALL_MOVE', 'Use the same voice louder'), ...w('M_PP_ALL_MOVE', 'Whisper all lines'), ...w('M_PP_ALL_MOVE', 'Stop talking')], 'Different voices help.'],
    ['Zawadi says a topical song can be about anything. What should her teacher say?', 'It is about an issue in the community', [...w('M_PP_TOPICAL_ANY', 'She is right'), ...w('M_PP_TOPICAL_ANY', 'It has no words'), ...w('M_PP_TOPICAL_ANY', 'It is always sad')], 'It is about a current community issue.'],
  ], { h: ['Think of a show: screen, voices, one speaker moves.', 'A topical song is about a community issue.'], s1: 'Decide what the puppeteer should do.' })),
  fam('pp.sh.spot', `${PP}SHOW`, 'spot', 3, spot([
    sp('Wekesa plans the show. Which step has the mistake?', ['Step 1: He sets up a screen.', 'Step 2: He makes all puppets move together.', 'Step 3: He gives each a voice.'], 1, 'Only the speaking puppet moves.', 'M_PP_ALL_MOVE'),
    sp('Chebet sets the stage. Which step has the mistake?', ['Step 1: She hangs a cloth.', 'Step 2: She stands in front of it.', 'Step 3: She holds the puppet up.'], 1, 'The puppeteer stands behind the screen.', 'M_PP_SHOW_FACE'),
    sp('Juma picks a song. Which step has the mistake?', ['Step 1: The class chooses a song.', 'Step 2: It is about any random tune.', 'Step 3: He calls it topical.'], 2, 'A topical song is about a community issue.', 'M_PP_TOPICAL_ANY'),
    sp('Njeri rehearses. Which step has the mistake?', ['Step 1: Puppet A speaks and moves.', 'Step 2: Puppet B moves as well.', 'Step 3: Puppet B speaks.'], 1, 'Puppet B should be still while A speaks.', 'M_PP_ALL_MOVE'),
    sp('Amina plans. Which step has the mistake?', ['Step 1: Use a screen.', 'Step 2: Stay hidden behind it.', 'Step 3: Step out in front of it.'], 2, 'Stay behind the screen.', 'M_PP_SHOW_FACE'),
  ], { h: ['Check each step.', 'Screen, voices, one speaker moves.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- DR.NOTES
  fam('dr.nt.order', `${DR}NOTES`, 'direct', 1, choose([
    ['Which is the lowest of the notes G, A and B?', 'G', [...w('M_DR_ALPHABET_ORDER', 'A'), ...w('M_DR_ALPHABET_ORDER', 'B'), ...w('M_DR_ALPHABET_ORDER', 'They are all the same')], 'G is the lowest of the three.'],
    ['Which is the right order from lowest to highest?', 'G, A, B, high C, high D', [...w('M_DR_ALPHABET_ORDER', 'A, B, G, high C, high D'), ...w('M_DR_HIGH_C_LOW', 'High C, high D, G, A, B'), ...w('M_DR_ALPHABET_ORDER', 'B, A, G, high D, high C')], 'The order is G A B then high C and D.'],
    ['Which of G, A and B covers the most holes?', 'G', [...w('M_DR_MORE_HOLES_HIGHER', 'B'), ...w('M_DR_MORE_HOLES_HIGHER', 'A'), ...w('M_DR_MORE_HOLES_HIGHER', 'They all cover the same')], 'G covers the thumb and three fingers.'],
    ['Which note is higher than B?', 'High C', [...w('M_DR_HIGH_C_LOW', 'G'), ...w('M_DR_HIGH_C_LOW', 'A'), ...w('M_DR_ALPHABET_ORDER', 'None, B is the highest')], 'High C is above B.'],
    ['What happens when more holes are covered?', 'The note gets lower', [...w('M_DR_MORE_HOLES_HIGHER', 'The note gets higher'), ...w('M_DR_MORE_HOLES_HIGHER', 'The note gets louder'), ...w('M_DR_MORE_HOLES_HIGHER', 'The note stays the same')], 'More holes covered means lower.'],
  ], { h: ['More holes covered, lower note.', 'G lowest of G A B.'], s1: 'Recall the order of notes.' })),
  fam('dr.nt.story', `${DR}NOTES`, 'word', 2, choose([
    ['Njeri plays B, then A, then G. Does her tune go up or down?', 'Down', [...w('M_DR_ALPHABET_ORDER', 'Up'), ...w('M_DR_ALPHABET_ORDER', 'It stays level'), ...w('M_DR_MORE_HOLES_HIGHER', 'It goes up and down')], 'B to A to G gets lower.'],
    ['Otieno uncovers a finger on his recorder. What happens to the note?', 'It gets higher', [...w('M_DR_MORE_HOLES_HIGHER', 'It gets lower'), ...w('M_DR_MORE_HOLES_HIGHER', 'It gets quieter'), ...w('M_DR_MORE_HOLES_HIGHER', 'It stays the same')], 'Fewer covered holes means higher.'],
    ['Amina plays G, A, B. Which note is highest of the three?', 'B', [...w('M_DR_ALPHABET_ORDER', 'G'), ...w('M_DR_ALPHABET_ORDER', 'A'), ...w('M_DR_ALPHABET_ORDER', 'They are equal')], 'B is highest of the three.'],
    ['Kamau thinks high C is lower than G. What should his teacher say?', 'High C is higher than G', [...w('M_DR_HIGH_C_LOW', 'He is right'), ...w('M_DR_HIGH_C_LOW', 'They are the same note'), ...w('M_DR_HIGH_C_LOW', 'It is lower than A')], 'High C is above G, A and B.'],
    ['Zawadi says G is the lowest because it has the fewest holes covered. What is wrong?', 'G covers the most holes', [...w('M_DR_MORE_HOLES_HIGHER', 'Nothing is wrong'), ...w('M_DR_MORE_HOLES_HIGHER', 'G covers no holes'), ...w('M_DR_MORE_HOLES_HIGHER', 'G covers the same as B')], 'G covers the thumb and three fingers.'],
  ], { h: ['More holes covered, lower note.', 'G lowest of G A B.'], s1: 'Decide whether the notes rise or fall.' })),
  fam('dr.nt.spot', `${DR}NOTES`, 'spot', 3, spot([
    sp('Wekesa orders notes. Which step has the mistake?', ['Step 1: G is low.', 'Step 2: B is higher than A.', 'Step 3: A is the lowest because it is first in the alphabet.'], 2, 'G is the lowest of G, A and B.', 'M_DR_ALPHABET_ORDER'),
    sp('Chebet explains holes. Which step has the mistake?', ['Step 1: B covers the thumb and one finger.', 'Step 2: G covers more holes than B.', 'Step 3: So G is higher than B.'], 2, 'More holes covered gives a lower note.', 'M_DR_MORE_HOLES_HIGHER'),
    sp('Juma orders notes. Which step has the mistake?', ['Step 1: G, A, B go up.', 'Step 2: Then comes high C.', 'Step 3: He says high C is lower than G.'], 2, 'High C is above G.', 'M_DR_HIGH_C_LOW'),
    sp('Njeri explains pitch. Which step has the mistake?', ['Step 1: She covers more holes.', 'Step 2: The air column gets longer.', 'Step 3: She says the note gets higher.'], 2, 'A longer air column gives a lower note.', 'M_DR_MORE_HOLES_HIGHER'),
    sp('Amina lists notes. Which step has the mistake?', ['Step 1: G is lowest.', 'Step 2: A is next.', 'Step 3: High D is lower than B.'], 2, 'High D is above B.', 'M_DR_HIGH_C_LOW'),
  ], { h: ['Check each step.', 'More holes covered, lower note.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- DR.TECHNIQUE
  fam('dr.tq.which', `${DR}TECHNIQUE`, 'direct', 1, choose([
    ['How should you blow into a recorder?', 'Gently and steadily', [...w('M_DR_BLOW_HARD', 'As hard as you can'), ...w('M_DR_BLOW_HARD', 'In short, sharp bursts'), ...w('M_DR_BLOW_HARD', 'Not at all')], 'A gentle steady breath gives a clear tone.'],
    ['How should the holes be covered?', 'Fully, with the soft pad of the finger', [...w('M_DR_FINGER_TIPS', 'Partly, with the tip'), ...w('M_DR_FINGER_TIPS', 'With the nail'), ...w('M_DR_FINGER_TIPS', 'With the knuckle')], 'Covering fully stops air leaking.'],
    ['What does tonguing do?', 'Starts each note clearly', [...w('M_DR_NO_TONGUE', 'Nothing'), ...w('M_DR_NO_TONGUE', 'Makes the note louder'), ...w('M_DR_NO_TONGUE', 'Closes the holes')], 'A soft "too" starts each note.'],
    ['What happens if you blow too hard?', 'The note is shrill and squeaky', [...w('M_DR_BLOW_HARD', 'The note is clearer'), ...w('M_DR_BLOW_HARD', 'The note is sweeter'), ...w('M_DR_BLOW_HARD', 'The note is lower')], 'Too hard gives a squeak.'],
    ['What is a good tone like?', 'Clear and smooth', [...w('M_DR_BLOW_HARD', 'Loud and sharp'), ...w('M_DR_FINGER_TIPS', 'Airy and leaking'), ...w('M_DR_NO_TONGUE', 'Muddy and joined')], 'A good tone is clear.'],
  ], { h: ['Gentle breath, full pads, soft tongue.', 'Too hard makes a squeak.'], s1: 'Recall good recorder technique.' })),
  fam('dr.tq.story', `${DR}TECHNIQUE`, 'word', 2, choose([
    ['Njeri\'s recorder squeaks loudly. What should she change?', 'Blow more gently', [...w('M_DR_BLOW_HARD', 'Blow harder'), ...w('M_DR_BLOW_HARD', 'Blow faster'), ...w('M_DR_BLOW_HARD', 'Stop blowing')], 'Gentle breath stops the squeak.'],
    ['Otieno\'s note sounds airy. He uses the tips of his fingers. What should he do?', 'Cover the holes with the finger pads', [...w('M_DR_FINGER_TIPS', 'Use the nails'), ...w('M_DR_FINGER_TIPS', 'Cover half the hole'), ...w('M_DR_FINGER_TIPS', 'Use only the tips harder')], 'Pads cover the holes fully.'],
    ['Amina\'s notes run together. What should she add?', 'Tonguing', [...w('M_DR_NO_TONGUE', 'More breath'), ...w('M_DR_NO_TONGUE', 'Faster fingers'), ...w('M_DR_NO_TONGUE', 'A louder blow')], 'Tonguing separates notes.'],
    ['Kamau thinks a hard blow gives a better tone. What should his teacher say?', 'A gentle steady breath is better', [...w('M_DR_BLOW_HARD', 'He is right'), ...w('M_DR_BLOW_HARD', 'Blow even harder'), ...w('M_DR_BLOW_HARD', 'Blow in short bursts')], 'Gentle is better.'],
    ['Zawadi says tonguing is not needed. What does tonguing do?', 'Starts each note clearly', [...w('M_DR_NO_TONGUE', 'Nothing important'), ...w('M_DR_NO_TONGUE', 'Cools the recorder'), ...w('M_DR_NO_TONGUE', 'Cleans the mouthpiece')], 'It starts each note.'],
  ], { h: ['Gentle breath, full pads, soft tongue.', 'Too hard makes a squeak.'], s1: 'Decide what to change.' })),
  fam('dr.tq.spot', `${DR}TECHNIQUE`, 'spot', 3, spot([
    sp('Wekesa explains playing. Which step has the mistake?', ['Step 1: He holds the recorder up.', 'Step 2: He blows as hard as he can.', 'Step 3: He plays.'], 1, 'Blow gently and steadily.', 'M_DR_BLOW_HARD'),
    sp('Chebet explains fingers. Which step has the mistake?', ['Step 1: She places her fingers.', 'Step 2: She covers holes with the tips.', 'Step 3: She plays.'], 1, 'Use the soft pads.', 'M_DR_FINGER_TIPS'),
    sp('Juma explains notes. Which step has the mistake?', ['Step 1: He plays G.', 'Step 2: He plays A without tonguing.', 'Step 3: He says tonguing is useless.'], 2, 'Tonguing starts each note clearly.', 'M_DR_NO_TONGUE'),
    sp('Njeri fixes a squeak. Which step has the mistake?', ['Step 1: She hears a squeak.', 'Step 2: She blows harder.', 'Step 3: The squeak stays.'], 1, 'Blow more gently.', 'M_DR_BLOW_HARD'),
    sp('Amina checks holes. Which step has the mistake?', ['Step 1: She presses the pads.', 'Step 2: She leaves a gap with her fingertip.', 'Step 3: She says there is no leak.'], 1, 'Cover each hole fully.', 'M_DR_FINGER_TIPS'),
  ], { h: ['Check each step.', 'Gentle breath, full pads, soft tongue.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SW.CRAWL
  fam('sw.cr.which', `${SW}CRAWL`, 'direct', 1, choose([
    ['In front crawl, how do the arms move?', 'One after the other', [...w('M_SW_ARMS_TOGETHER', 'Both together'), ...w('M_SW_ARMS_TOGETHER', 'Both stay still'), ...w('M_SW_ARMS_TOGETHER', 'Only one moves')], 'The arms take turns.'],
    ['How do the legs kick in front crawl?', 'Small quick up-and-down kicks', [...w('M_SW_FROG_KICK', 'Like a frog'), ...w('M_SW_FROG_KICK', 'Big slow circles'), ...w('M_SW_FROG_KICK', 'They stay still')], 'This is a flutter kick.'],
    ['How does the swimmer breathe in?', 'Turns the head to the side', [...w('M_SW_LIFT_HEAD', 'Lifts the head forward'), ...w('M_SW_LIFT_HEAD', 'Stops and stands up'), ...w('M_SW_LIFT_HEAD', 'Sinks the head')], 'The head turns to the side.'],
    ['What does the swimmer do with the breath under water?', 'Breathes out', [...w('M_SW_HOLD_BREATH', 'Holds it'), ...w('M_SW_HOLD_BREATH', 'Breathes in'), ...w('M_SW_HOLD_BREATH', 'Stops breathing')], 'Breathe out in the water.'],
    ['What is the body position in front crawl?', 'Flat on the front, face in the water', [...w('M_SW_LIFT_HEAD', 'Upright with the head up'), ...w('M_SW_LIFT_HEAD', 'On the back'), ...w('M_SW_LIFT_HEAD', 'Curled in a ball')], 'The body lies flat.'],
  ], { h: ['Think of arms, legs and breathing.', 'Alternate arms, flutter kick, side breathing.'], s1: 'Recall the front crawl.' })),
  fam('sw.cr.story', `${SW}CRAWL`, 'word', 2, choose([
    ['Njeri pulls both arms at once in front crawl. What should she change?', 'Pull one arm at a time', [...w('M_SW_ARMS_TOGETHER', 'Pull faster together'), ...w('M_SW_ARMS_TOGETHER', 'Hold both arms still'), ...w('M_SW_ARMS_TOGETHER', 'Use only the legs')], 'Arms alternate.'],
    ['Otieno kicks like a frog in front crawl. What kick should he use?', 'A small, quick flutter kick', [...w('M_SW_FROG_KICK', 'A bigger frog kick'), ...w('M_SW_FROG_KICK', 'A slow circle kick'), ...w('M_SW_FROG_KICK', 'No kick')], 'Use a flutter kick.'],
    ['Amina lifts her head forward to breathe and her legs sink. What is the better way?', 'Turn her head to the side', [...w('M_SW_LIFT_HEAD', 'Lift her head higher'), ...w('M_SW_LIFT_HEAD', 'Stop breathing'), ...w('M_SW_LIFT_HEAD', 'Breathe through her ears')], 'Turn to the side.'],
    ['Kamau holds his breath all the way and gets tired quickly. What should he do?', 'Breathe out in the water', [...w('M_SW_HOLD_BREATH', 'Hold longer'), ...w('M_SW_HOLD_BREATH', 'Swim faster'), ...w('M_SW_HOLD_BREATH', 'Hold his nose')], 'Breathing out helps.'],
    ['Zawadi wants a smooth front crawl. Which body position helps?', 'Flat with her face in the water', [...w('M_SW_LIFT_HEAD', 'Upright with her head up'), ...w('M_SW_LIFT_HEAD', 'Tilted back'), ...w('M_SW_LIFT_HEAD', 'Curled up')], 'A flat body glides.'],
  ], { h: ['Think of arms, legs and breathing.', 'Alternate arms, flutter kick, side breathing.'], s1: 'Decide how to correct the swimmer.' })),
  fam('sw.cr.spot', `${SW}CRAWL`, 'spot', 3, spot([
    sp('Wekesa explains the crawl. Which step has the mistake?', ['Step 1: The body is flat.', 'Step 2: Both arms pull together.', 'Step 3: The legs kick.'], 1, 'The arms pull one after the other.', 'M_SW_ARMS_TOGETHER'),
    sp('Chebet explains the legs. Which step has the mistake?', ['Step 1: The legs are straight.', 'Step 2: They kick like a frog.', 'Step 3: The toes are pointed.'], 1, 'Front crawl uses a flutter kick.', 'M_SW_FROG_KICK'),
    sp('Juma explains breathing. Which step has the mistake?', ['Step 1: Breathe out in the water.', 'Step 2: Lift the head forward to breathe in.', 'Step 3: Keep swimming.'], 1, 'Turn the head to the side.', 'M_SW_LIFT_HEAD'),
    sp('Njeri explains breath. Which step has the mistake?', ['Step 1: Face in the water.', 'Step 2: Hold the breath for the whole length.', 'Step 3: Turn to breathe.'], 1, 'Breathe out in the water.', 'M_SW_HOLD_BREATH'),
    sp('Amina explains arms. Which step has the mistake?', ['Step 1: One arm pulls.', 'Step 2: The other arm swings over.', 'Step 3: Then both arms pull together.'], 2, 'Arms take turns.', 'M_SW_ARMS_TOGETHER'),
  ], { h: ['Check each step.', 'Alternate arms, flutter kick, side breathing.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SW.POOL_SAFETY
  fam('sw.ps.rule', `${SW}POOL_SAFETY`, 'direct', 1, choose([
    ['What should you do on the pool side?', 'Walk', [...w('M_SW_RUN_POOL', 'Run'), ...w('M_SW_RUN_POOL', 'Jump'), ...w('M_SW_RUN_POOL', 'Race')], 'Running can make you slip.'],
    ['When should a learner swim?', 'Only when an adult is watching', [...w('M_SW_SWIM_ALONE', 'Alone, if a good swimmer'), ...w('M_SW_SWIM_ALONE', 'Whenever they like'), ...w('M_SW_SWIM_ALONE', 'When nobody can see')], 'An adult must watch.'],
    ['What should you do before getting in the pool?', 'Shower', [...w('M_SW_NO_SHOWER', 'Jump in'), ...w('M_SW_NO_SHOWER', 'Eat a big meal'), ...w('M_SW_NO_SHOWER', 'Nothing')], 'Showering keeps the pool clean.'],
    ['In which way should you enter water when you cannot tell its depth?', 'Legs first', [...w('M_SW_DIVE_SHALLOW', 'Dive in'), ...w('M_SW_DIVE_SHALLOW', 'Head first'), ...w('M_SW_DIVE_SHALLOW', 'Run and jump')], 'Legs first is safe.'],
    ['Why is the pool kept clean?', 'To keep swimmers healthy', [...w('M_SW_NO_SHOWER', 'To make it colder'), ...w('M_SW_NO_SHOWER', 'To make it deeper'), ...w('M_SW_NO_SHOWER', 'To save water')], 'Clean water prevents sickness.'],
  ], { h: ['Think safe and clean.', 'Walk, shower, adult watching, legs first.'], s1: 'Recall the pool rules.' })),
  fam('sw.ps.story', `${SW}POOL_SAFETY`, 'word', 2, choose([
    ['Njeri wants to race a friend along the wet pool side. What should she do?', 'Walk instead', [...w('M_SW_RUN_POOL', 'Run, she is quick'), ...w('M_SW_RUN_POOL', 'Race slowly'), ...w('M_SW_RUN_POOL', 'Race on tiptoe')], 'Walk on the pool side.'],
    ['Otieno is a strong swimmer and wants to swim when no adult is around. What should he do?', 'Wait for an adult to be there', [...w('M_SW_SWIM_ALONE', 'Swim, he is strong'), ...w('M_SW_SWIM_ALONE', 'Swim in the deep end'), ...w('M_SW_SWIM_ALONE', 'Swim with eyes closed')], 'Never swim alone.'],
    ['Amina arrives late and wants to jump straight in. What should she do first?', 'Take a shower', [...w('M_SW_NO_SHOWER', 'Nothing'), ...w('M_SW_NO_SHOWER', 'Wipe her hands'), ...w('M_SW_NO_SHOWER', 'Eat a snack')], 'Shower first.'],
    ['Kamau cannot tell if the water is shallow or deep. In which way should he get in?', 'Legs first, slowly', [...w('M_SW_DIVE_SHALLOW', 'Dive in'), ...w('M_SW_DIVE_SHALLOW', 'Run and dive'), ...w('M_SW_DIVE_SHALLOW', 'Jump head first')], 'Legs first is safer.'],
    ['Zawadi sees a friend about to push someone in. What should she do?', 'Tell the friend to stop and tell the teacher', [...w('M_SW_RUN_POOL', 'Join in'), ...w('M_SW_RUN_POOL', 'Laugh'), ...w('M_SW_RUN_POOL', 'Look away')], 'Pushing is dangerous.'],
  ], { h: ['Think safe and clean.', 'Walk, shower, adult watching, legs first.'], s1: 'Decide the safe action.' })),
  fam('sw.ps.spot', `${SW}POOL_SAFETY`, 'spot', 3, spot([
    sp('Wekesa plans a swim. Which step has the mistake?', ['Step 1: He showers.', 'Step 2: He runs to the pool.', 'Step 3: He waits for the teacher.'], 1, 'Walk on the pool side.', 'M_SW_RUN_POOL'),
    sp('Chebet plans a swim. Which step has the mistake?', ['Step 1: She goes to the pool.', 'Step 2: She swims alone because she is good.', 'Step 3: She enjoys it.'], 1, 'Swim only when an adult is watching.', 'M_SW_SWIM_ALONE'),
    sp('Juma gets in. Which step has the mistake?', ['Step 1: He changes.', 'Step 2: He skips the shower.', 'Step 3: He gets in.'], 1, 'Shower first.', 'M_SW_NO_SHOWER'),
    sp('Njeri enters the water. Which step has the mistake?', ['Step 1: She does not know the depth.', 'Step 2: She dives in head first.', 'Step 3: She hits the bottom.'], 1, 'Enter legs first.', 'M_SW_DIVE_SHALLOW'),
    sp('Amina walks to the pool. Which step has the mistake?', ['Step 1: She puts on her costume.', 'Step 2: She runs along the wet side.', 'Step 3: She slips.'], 1, 'Walk on the pool side.', 'M_SW_RUN_POOL'),
  ], { h: ['Check each step.', 'Walk, shower, adult watching, legs first.'], s1: 'Find the step that is not safe.' })),

  // ---------------------------------------------------------------- SW.COUNTING_GAMES
  fam('sw.cg.which', `${SW}COUNTING_GAMES`, 'direct', 1, choose([
    ['Which is an indigenous counting game?', 'Bao', [...w('M_SW_CG_NO_COUNT', 'Hide and seek only'), ...w('M_SW_CG_NO_COUNT', 'A race with no counting'), ...w('M_SW_CG_NO_COUNT', 'Tug of war only')], 'Bao uses counting of seeds.'],
    ['What do players do in a counting game?', 'Count seeds, steps or turns', [...w('M_SW_CG_NO_COUNT', 'No counting'), ...w('M_SW_CG_NO_COUNT', 'Only shout'), ...w('M_SW_CG_NO_COUNT', 'Only run')], 'Counting is part of the game.'],
    ['Which counting game moves the whole body?', 'Skipping while counting', [...w('M_SW_CG_ONLY_BOARD', 'Bao only'), ...w('M_SW_CG_ONLY_BOARD', 'Sitting and listening'), ...w('M_SW_CG_ONLY_BOARD', 'Lying still')], 'Skipping builds fitness.'],
    ['What does counting to a rhythm mean?', 'Counting and moving to the beat', [...w('M_SW_CG_RHYTHM_FAST', 'Counting as fast as possible'), ...w('M_SW_CG_RHYTHM_FAST', 'Counting very loudly'), ...w('M_SW_CG_RHYTHM_FAST', 'Counting without moving')], 'Count in time with the beat.'],
    ['What do counting games train?', 'Counting, planning and teamwork', [...w('M_SW_CG_NO_COUNT', 'Only shouting'), ...w('M_SW_CG_ONLY_BOARD', 'Nothing useful'), ...w('M_SW_CG_NO_COUNT', 'Only sleeping')], 'They train mind and body.'],
  ], { h: ['Counting games count something.', 'Some move the body.'], s1: 'Recall counting games.' })),
  fam('sw.cg.story', `${SW}COUNTING_GAMES`, 'word', 2, choose([
    ['Njeri and Achieng play bao with seeds. What are they doing?', 'Counting and planning moves', [...w('M_SW_CG_NO_COUNT', 'Only guessing'), ...w('M_SW_CG_NO_COUNT', 'Running a race'), ...w('M_SW_CG_NO_COUNT', 'Resting')], 'Bao needs counting.'],
    ['Otieno says all counting games are sit-down games. Which game proves him wrong?', 'Skipping and counting jumps', [...w('M_SW_CG_ONLY_BOARD', 'Bao with seeds'), ...w('M_SW_CG_ONLY_BOARD', 'Counting seeds in a heap'), ...w('M_SW_CG_ONLY_BOARD', 'Counting beads on a string')], 'Skipping is a moving game.'],
    ['Amina claps and counts to the beat of a drum. What is she doing?', 'Counting to a rhythm', [...w('M_SW_CG_RHYTHM_FAST', 'Counting as fast as she can'), ...w('M_SW_CG_RHYTHM_FAST', 'Counting silently'), ...w('M_SW_CG_RHYTHM_FAST', 'Counting out of time')], 'Count and move to the beat.'],
    ['Kamau\'s team plays a jumping game and counts the jumps. What does it build besides counting?', 'Fitness and teamwork', [...w('M_SW_CG_ONLY_BOARD', 'Nothing else at all'), ...w('M_SW_CG_ONLY_BOARD', 'Only some tiredness'), ...w('M_SW_CG_NO_COUNT', 'Only a lot of noise')], 'It builds fitness and teamwork.'],
    ['Zawadi says counting is not needed in a counting game. What is the right reply?', 'Counting is part of it', [...w('M_SW_CG_NO_COUNT', 'She is right, it is not'), ...w('M_SW_CG_NO_COUNT', 'Only the winner counts'), ...w('M_SW_CG_NO_COUNT', 'Only the teacher counts')], 'Players count.'],
  ], { h: ['Counting games count something.', 'Some move the body.'], s1: 'Decide what the game is doing.' })),
  fam('sw.cg.spot', `${SW}COUNTING_GAMES`, 'spot', 3, spot([
    sp('Wekesa describes counting games. Which step has the mistake?', ['Step 1: Bao uses seeds.', 'Step 2: Skipping games use counting.', 'Step 3: All counting games are sit-down games.'], 2, 'Some counting games move the body.', 'M_SW_CG_ONLY_BOARD'),
    sp('Chebet describes a game. Which step has the mistake?', ['Step 1: Players take turns.', 'Step 2: They do not count anything.', 'Step 3: They say it is a counting game.'], 1, 'Players count.', 'M_SW_CG_NO_COUNT'),
    sp('Juma explains rhythm. Which step has the mistake?', ['Step 1: A drum beats.', 'Step 2: He counts as fast as possible, ignoring the beat.', 'Step 3: He says he counts to the rhythm.'], 1, 'Count in time with the beat.', 'M_SW_CG_RHYTHM_FAST'),
    sp('Njeri describes fitness. Which step has the mistake?', ['Step 1: Skipping and counting moves the body.', 'Step 2: It builds fitness.', 'Step 3: She says counting games give no exercise.'], 2, 'Some give exercise.', 'M_SW_CG_ONLY_BOARD'),
    sp('Amina describes bao. Which step has the mistake?', ['Step 1: It uses seeds.', 'Step 2: Players count seeds.', 'Step 3: She says counting is not part of it.'], 2, 'Counting is part of bao.', 'M_SW_CG_NO_COUNT'),
  ], { h: ['Check each step.', 'Counting games count; some move the body.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- AP.CRITIQUE
  fam('ap.cq.which', `${AP}CRITIQUE`, 'direct', 1, choose([
    ['Which comment about a painting is the most helpful?', 'I like the bright colours, they show sun', [...w('M_AP_CRIT_VAGUE', 'It is nice and I like it'), ...w('M_AP_CRIT_VAGUE', 'It is good, well done to you'), ...w('M_AP_CRIT_RUDE', 'It is ugly and I dislike it')], 'A helpful comment says what and why.'],
    ['Which comment is polite and helpful?', 'More colour in the corner could help', [...w('M_AP_CRIT_RUDE', 'This is rubbish, throw it away'), ...w('M_AP_CRIT_RUDE', 'Anyone at all could do better'), ...w('M_AP_CRIT_VAGUE', 'Fine, I suppose, it is fine')], 'It gives a kind idea.'],
    ['What should you do with a work on display?', 'Look without touching', [...w('M_AP_CRIT_TOUCH', 'Touch it to feel it'), ...w('M_AP_CRIT_TOUCH', 'Pick it up'), ...w('M_AP_CRIT_TOUCH', 'Rub it')], 'Do not touch others\' work.'],
    ['What can you comment on in an artwork?', 'Materials, colours, shapes', [...w('M_AP_CRIT_VAGUE', 'Only the name of the artist'), ...w('M_AP_CRIT_VAGUE', 'Nothing'), ...w('M_AP_CRIT_RUDE', 'Only what is wrong')], 'Look at what you see.'],
    ['Which words suit a gallery walk?', 'Polite, specific words', [...w('M_AP_CRIT_RUDE', 'Rude and loud words'), ...w('M_AP_CRIT_VAGUE', 'One word, like "nice"'), ...w('M_AP_CRIT_RUDE', 'Jokes on the artist')], 'Be polite and specific.'],
  ], { h: ['Say what you see and why, politely.', 'Do not touch the work.'], s1: 'Recall how to comment on art.' })),
  fam('ap.cq.story', `${AP}CRITIQUE`, 'word', 2, choose([
    ['Njeri sees a classmate\'s mosaic. She wants to say something helpful. What should she say?', 'The seeds make good texture', [...w('M_AP_CRIT_VAGUE', 'It is nice, I think so'), ...w('M_AP_CRIT_RUDE', 'It looks messy to me'), ...w('M_AP_CRIT_VAGUE', 'Okay, it is okay')], 'Name what you see.'],
    ['Otieno thinks a painting is weak. How should he say it?', 'Try darker colours for shadows', [...w('M_AP_CRIT_RUDE', 'It is terrible, really bad'), ...w('M_AP_CRIT_RUDE', 'Who made this awful thing?'), ...w('M_AP_CRIT_VAGUE', 'It is bad, that is all')], 'Give a kind idea.'],
    ['Amina wants to feel the paint on a display. What should she do?', 'Look and not touch', [...w('M_AP_CRIT_TOUCH', 'Touch it gently'), ...w('M_AP_CRIT_TOUCH', 'Pick it up'), ...w('M_AP_CRIT_TOUCH', 'Rub it')], 'Do not touch others\' work.'],
    ['Kamau says "good" about every piece. How can he improve?', 'Say what he likes and why', [...w('M_AP_CRIT_VAGUE', 'Say "good" a lot louder'), ...w('M_AP_CRIT_VAGUE', 'Say nothing at all'), ...w('M_AP_CRIT_VAGUE', 'Say "nice" in its place')], 'Add reasons.'],
    ['Zawadi laughs at a friend\'s puppet. What should her teacher say?', 'Give a polite comment', [...w('M_AP_CRIT_RUDE', 'Laugh even louder'), ...w('M_AP_CRIT_RUDE', 'Nothing, jokes are fine'), ...w('M_AP_CRIT_RUDE', 'Tell the class it is bad')], 'Be respectful.'],
  ], { h: ['Say what you see and why, politely.', 'Do not touch the work.'], s1: 'Decide the best comment or action.' })),
  fam('ap.cq.spot', `${AP}CRITIQUE`, 'spot', 3, spot([
    sp('Wekesa gives feedback. Which step has the mistake?', ['Step 1: He looks at the painting.', 'Step 2: He says "nice" and nothing else.', 'Step 3: He walks on.'], 1, 'Say what you like and why.', 'M_AP_CRIT_VAGUE'),
    sp('Chebet gives feedback. Which step has the mistake?', ['Step 1: She looks.', 'Step 2: She says the work is ugly.', 'Step 3: She walks on.'], 1, 'Use polite words.', 'M_AP_CRIT_RUDE'),
    sp('Juma visits the gallery. Which step has the mistake?', ['Step 1: He walks round.', 'Step 2: He touches a clay model.', 'Step 3: It breaks.'], 1, 'Do not touch others\' work.', 'M_AP_CRIT_TOUCH'),
    sp('Njeri comments. Which step has the mistake?', ['Step 1: She names the colours.', 'Step 2: She says what she likes.', 'Step 3: She adds a rude joke.'], 2, 'Keep comments polite.', 'M_AP_CRIT_RUDE'),
    sp('Amina comments. Which step has the mistake?', ['Step 1: She sees a mosaic.', 'Step 2: She says only "good".', 'Step 3: She gives no reason.'], 1, 'Say what you like and why.', 'M_AP_CRIT_VAGUE'),
  ], { h: ['Check each step.', 'Specific, polite, no touching.'], s1: 'Find the step that is not good practice.' })),

  // ---------------------------------------------------------------- AP.FOLK_TERMS
  fam('ap.ft.word', `${AP}FOLK_TERMS`, 'direct', 1, choose([
    ['Which word means the shape the dancers make?', 'Formation', [...w('M_AP_TERM_FORMATION_COSTUME', 'Costume'), ...w('M_AP_TERM_FORMATION_COSTUME', 'Ornament'), ...w('M_AP_TERM_OCCASION_COMMUNITY', 'Occasion')], 'A formation is a shape.'],
    ['Which word means the group that answers the leader?', 'Chorus', [...w('M_AP_TERM_SOLOIST_CHORUS', 'Soloist'), ...w('M_AP_TERM_SOLOIST_CHORUS', 'Formation'), ...w('M_AP_TERM_SOLOIST_CHORUS', 'Costume')], 'The chorus answers.'],
    ['Which word means when a dance is performed?', 'Occasion', [...w('M_AP_TERM_OCCASION_COMMUNITY', 'Community'), ...w('M_AP_TERM_FORMATION_COSTUME', 'Costume'), ...w('M_AP_TERM_FORMATION_COSTUME', 'Formation')], 'The occasion is when.'],
    ['Which word means the people a dance comes from?', 'Community', [...w('M_AP_TERM_OCCASION_COMMUNITY', 'Occasion'), ...w('M_AP_TERM_SOLOIST_CHORUS', 'Chorus'), ...w('M_AP_TERM_FORMATION_COSTUME', 'Formation')], 'The community is the people.'],
    ['Which word means the clothes dancers wear?', 'Costume', [...w('M_AP_TERM_FORMATION_COSTUME', 'Formation'), ...w('M_AP_TERM_SOLOIST_CHORUS', 'Soloist'), ...w('M_AP_TERM_OCCASION_COMMUNITY', 'Occasion')], 'Clothes are costume.'],
  ], { h: ['Match each word to its meaning.', 'Formation shape, costume clothes, chorus answers.'], s1: 'Recall the words.' })),
  fam('ap.ft.story', `${AP}FOLK_TERMS`, 'word', 2, choose([
    ['Njeri says "the dancers moved from a line into a circle". Which word fits the line and circle?', 'Formations', [...w('M_AP_TERM_FORMATION_COSTUME', 'Costumes'), ...w('M_AP_TERM_FORMATION_COSTUME', 'Ornaments'), ...w('M_AP_TERM_OCCASION_COMMUNITY', 'Occasions')], 'Line and circle are formations.'],
    ['Otieno says "the soloist sang and the chorus ___". Which word fills the gap?', 'Answered', [...w('M_AP_TERM_SOLOIST_CHORUS', 'Led'), ...w('M_AP_TERM_SOLOIST_CHORUS', 'Danced alone'), ...w('M_AP_TERM_SOLOIST_CHORUS', 'Stayed silent')], 'The chorus answers.'],
    ['Amina writes "the dance is performed at weddings". Which word names weddings?', 'Occasion', [...w('M_AP_TERM_OCCASION_COMMUNITY', 'Community'), ...w('M_AP_TERM_FORMATION_COSTUME', 'Costume'), ...w('M_AP_TERM_FORMATION_COSTUME', 'Formation')], 'A wedding is an occasion.'],
    ['Kamau writes "the dance belongs to the Luhya". Which word names the Luhya?', 'Community', [...w('M_AP_TERM_OCCASION_COMMUNITY', 'Occasion'), ...w('M_AP_TERM_SOLOIST_CHORUS', 'Chorus'), ...w('M_AP_TERM_FORMATION_COSTUME', 'Costume')], 'The Luhya are the community.'],
    ['Zawadi says "the dancers wore grass skirts". Which word describes the skirts?', 'Costume', [...w('M_AP_TERM_FORMATION_COSTUME', 'Formation'), ...w('M_AP_TERM_SOLOIST_CHORUS', 'Chorus'), ...w('M_AP_TERM_OCCASION_COMMUNITY', 'Occasion')], 'Clothes are costume.'],
  ], { h: ['Match each word to its meaning.', 'Formation shape, costume clothes, chorus answers.'], s1: 'Choose the word that fits.' })),
  fam('ap.ft.spot', `${AP}FOLK_TERMS`, 'spot', 3, spot([
    sp('Wekesa discusses a dance. Which step has the mistake?', ['Step 1: The dancers made a circle.', 'Step 2: He calls the circle a costume.', 'Step 3: The chorus answered.'], 1, 'A circle is a formation.', 'M_AP_TERM_FORMATION_COSTUME'),
    sp('Chebet discusses a dance. Which step has the mistake?', ['Step 1: One singer led.', 'Step 2: She calls the leader the chorus.', 'Step 3: The group answered.'], 1, 'The leader is the soloist.', 'M_AP_TERM_SOLOIST_CHORUS'),
    sp('Juma discusses a dance. Which step has the mistake?', ['Step 1: It was a wedding.', 'Step 2: He calls the wedding the community.', 'Step 3: The dancers wore beads.'], 1, 'A wedding is the occasion.', 'M_AP_TERM_OCCASION_COMMUNITY'),
    sp('Njeri discusses a dance. Which step has the mistake?', ['Step 1: The dancers wore skirts.', 'Step 2: She calls the skirts formation.', 'Step 3: They sang.'], 1, 'Clothes are costume.', 'M_AP_TERM_FORMATION_COSTUME'),
    sp('Amina discusses a dance. Which step has the mistake?', ['Step 1: The Maasai are the community.', 'Step 2: She says the community is when it is done.', 'Step 3: Ceremonies are occasions.'], 1, 'The community is the people.', 'M_AP_TERM_OCCASION_COMMUNITY'),
  ], { h: ['Check each step.', 'Formation shape, costume clothes, occasion when, community who.'], s1: 'Find the step that uses a word wrongly.' })),

  // ---------------------------------------------------------------- AP.ANTHEM
  fam('ap.an.which', `${AP}ANTHEM`, 'direct', 1, choose([
    ['The East African Community Anthem belongs to which group?', 'The East African Community', [...w('M_AP_ANTHEM_NATIONAL', 'Kenya only'), ...w('M_AP_ANTHEM_NATIONAL', 'One school'), ...w('M_AP_ANTHEM_NATIONAL', 'One county')], 'It belongs to a group of countries.'],
    ['What should you do while the anthem is sung?', 'Stand still and straight', [...w('M_AP_ANTHEM_SIT', 'Sit and talk'), ...w('M_AP_ANTHEM_SIT', 'Walk around'), ...w('M_AP_ANTHEM_SIT', 'Eat a snack')], 'Show respect.'],
    ['Which value does the anthem ask for?', 'Unity and peace', [...w('M_AP_ANTHEM_VALUE', 'Rivalry between countries'), ...w('M_AP_ANTHEM_VALUE', 'Winning at any cost'), ...w('M_AP_ANTHEM_VALUE', 'Keeping apart')], 'It asks for unity, peace and co-operation.'],
    ['Which is Kenya\'s national anthem?', 'Ee Mungu Nguvu Yetu', [...w('M_AP_ANTHEM_NATIONAL', 'The East African Community Anthem'), ...w('M_AP_ANTHEM_NATIONAL', 'A school song'), ...w('M_AP_ANTHEM_NATIONAL', 'A folk song')], 'The EAC anthem is a different song.'],
    ['What is the East African Community?', 'A group of countries working together', [...w('M_AP_ANTHEM_NATIONAL', 'Kenya alone'), ...w('M_AP_ANTHEM_NATIONAL', 'A football team'), ...w('M_AP_ANTHEM_NATIONAL', 'A single town')], 'It is a regional group.'],
  ], { h: ['The anthem is for a group of countries.', 'Stand still, sing or listen, value unity.'], s1: 'Recall the anthem.' })),
  fam('ap.an.story', `${AP}ANTHEM`, 'word', 2, choose([
    ['Njeri\'s class hears the East African Community Anthem at a meeting. What should they do?', 'Stand still and listen in silence', [...w('M_AP_ANTHEM_SIT', 'Sit and chat'), ...w('M_AP_ANTHEM_SIT', 'Clap loudly'), ...w('M_AP_ANTHEM_SIT', 'Walk about')], 'Show respect.'],
    ['Otieno says the anthem is only for Kenya. What should his teacher say?', 'It is for the whole community', [...w('M_AP_ANTHEM_NATIONAL', 'He is right, only for Kenya'), ...w('M_AP_ANTHEM_NATIONAL', 'It is only for the school'), ...w('M_AP_ANTHEM_NATIONAL', 'It is only for sport days')], 'It is for the whole community of countries.'],
    ['Amina reads the anthem\'s words. They ask for peace. Which value is this?', 'Peace', [...w('M_AP_ANTHEM_VALUE', 'Rivalry'), ...w('M_AP_ANTHEM_VALUE', 'Competition'), ...w('M_AP_ANTHEM_VALUE', 'Pride in winning')], 'Peace is a value of the anthem.'],
    ['Kamau mixes up the East African Community Anthem and Kenya\'s national anthem. How can he tell them apart?', 'The first is the community\'s', [...w('M_AP_ANTHEM_NATIONAL', 'They are the same song'), ...w('M_AP_ANTHEM_NATIONAL', 'The first is a school song'), ...w('M_AP_ANTHEM_NATIONAL', 'The second is a folk song')], 'They are different songs.'],
    ['Zawadi sits during the anthem. What should she do instead?', 'Stand still and straight', [...w('M_AP_ANTHEM_SIT', 'Keep sitting'), ...w('M_AP_ANTHEM_SIT', 'Talk quietly'), ...w('M_AP_ANTHEM_SIT', 'Turn her back')], 'Stand to show respect.'],
  ], { h: ['The anthem is for a group of countries.', 'Stand still, sing or listen, value unity.'], s1: 'Decide the respectful action.' })),
  fam('ap.an.spot', `${AP}ANTHEM`, 'spot', 3, spot([
    sp('Wekesa explains the anthem. Which step has the mistake?', ['Step 1: It is the community\'s song.', 'Step 2: He says it is only Kenya\'s national anthem.', 'Step 3: Countries work together.'], 1, 'It belongs to the East African Community.', 'M_AP_ANTHEM_NATIONAL'),
    sp('Chebet explains etiquette. Which step has the mistake?', ['Step 1: The anthem starts.', 'Step 2: She sits and talks.', 'Step 3: It ends.'], 1, 'Stand still and listen.', 'M_AP_ANTHEM_SIT'),
    sp('Juma explains values. Which step has the mistake?', ['Step 1: The anthem asks for peace.', 'Step 2: It asks for unity.', 'Step 3: He says it asks for rivalry.'], 2, 'It asks for unity and peace.', 'M_AP_ANTHEM_VALUE'),
    sp('Njeri explains etiquette. Which step has the mistake?', ['Step 1: She stands.', 'Step 2: She sings or listens.', 'Step 3: She chats with a friend.'], 2, 'Stay silent and respectful.', 'M_AP_ANTHEM_SIT'),
    sp('Amina explains the group. Which step has the mistake?', ['Step 1: The community has several countries.', 'Step 2: They work together.', 'Step 3: She says it is Kenya alone.'], 2, 'It is a group of countries.', 'M_AP_ANTHEM_NATIONAL'),
  ], { h: ['Check each step.', 'Community anthem, stand still, unity and peace.'], s1: 'Find the step that is not true.' })),
];
