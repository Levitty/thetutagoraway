// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 9, GAMES, MEDIA, CRAFTS AND APPRECIATION (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): the other 13
// of the 26 skills (rugby, photography viewpoints, F major on the recorder, play scripts, basketball, logos, coil pottery, twill
// weaving, the standing dive and butterfly, indigenous board games, analysing a play and a solo song, ethics in sport, critique).
// Playing, diving, weaving, potting and designing are performed and marked by the teacher or coach with the KICD rubric; diving
// is only into deep water with a lifeguard. Every wrong answer names the library misconception it reveals. All stay reviewed:false.
// ============================================================================
import { T } from './creativearts_g9_lib.js';

const M = (...s) => s.map(x => `M_CA9_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('ru', 'CREATI.RUGBY.RUGBY', M('RU_FORWARD_PASS', 'RU_SPIN_POP', 'RU_DROP_PLACE', 'RU_LOOK_BALL'),
    ['Think about the direction of the pass, the distance to the catcher, and where the ball is kicked from.', 'In rugby the ball is passed only sideways or backwards; a spin pass goes long and fast, a pop pass is a soft lift to a close team mate; a place kick is off a tee, a drop kick off the bounce; look at the catcher.'], [
      ['Which way may a rugby ball be passed?', 'Sideways or backwards', 'Forward|0', 'Any direction|0', 'Only straight up|0'],
      ['Which pass suits a team mate running right beside you?', 'A pop pass', 'A spin pass|1', 'A forward pass|0', 'A drop kick|2'],
      ['What is a kick off a kicking tee called?', 'A place kick', 'A drop kick|2', 'A pop pass|1', 'A spin kick|2'],
      ['Where do you look when passing?', 'At the catcher\'s hands', 'At the ball in your hands|3', 'At the ground|3', 'At the referee|3'],
      ['Which pass sends the ball long and fast?', 'The spin pass', 'The pop pass|1', 'The forward pass|0', 'The place kick|2'],
    ], [
      ['Kibet throws the ball forward to a team mate who scores. The referee blows the whistle. Why?', 'A forward pass is not allowed', 'The pass was too soft|1', 'He kicked off a tee|2', 'He looked at the catcher|3'],
      ['Wanjiru\'s team mate runs close at her shoulder. She throws a hard spin pass and it is dropped. What pass suits better?', 'A pop pass', 'A harder spin pass|1', 'A forward pass|0', 'A drop kick|2'],
      ['A player drops the ball and kicks it as it bounces. Odhiambo calls it a place kick. What is it?', 'A drop kick', 'A place kick|2', 'A pop pass|1', 'A forward pass|0'],
      ['Mutua stares at the ball as he passes and it goes wide. What should he watch?', 'The catcher\'s hands', 'The ball itself|3', 'His own feet|3', 'The crowd|3'],
      ['A winger is 15 m away across the field. Which pass reaches him best?', 'A spin pass', 'A pop pass|1', 'A forward pass|0', 'A place kick|2'],
    ], [
      ['Grace explains passing. ' + STEP, 'She holds the ball in two hands.', 'She looks at the catcher.', 'She passes the ball forward to gain ground.', 'Pass only sideways or backwards.', 0],
      ['Juma explains the pop pass. ' + STEP, 'His team mate is running close.', 'He needs a short, soft pass.', 'He chooses a long spin pass.', 'A close team mate needs a pop pass.', 1],
      ['Esther explains kicks. ' + STEP, 'The kicker places the ball on a tee.', 'She kicks it at the posts.', 'This is called a drop kick.', 'A kick off a tee is a place kick.', 2],
      ['Moses explains aiming. ' + STEP, 'He swings his arms across his body.', 'He follows through.', 'He keeps his eyes on the ball in his hands.', 'Look at the target, the catcher\'s hands.', 3],
      ['Nekesa explains a drop kick. ' + STEP, 'She drops the ball.', 'She kicks it as it bounces.', 'This is a place kick.', 'Kicking off the bounce is a drop kick.', 2],
    ]),

  ...T('vp', 'CREATI.PHOTOGRAPHY.VIEWPOINTS', M('VP_WORM_DOWN', 'VP_BIRD_EFFECT', 'VP_NORMAL', 'VP_ZOOM'),
    ['Ask where the camera is: high, level or low.', 'A bird\'s eye view is high looking down (the subject looks small), eye level looks natural, and a worm\'s eye view is low looking up (tall and powerful); zooming does not change the viewpoint.'], [
      ['Where is the camera for a worm\'s eye view?', 'Low, looking up', 'High, looking down|0', 'At eye level|2', 'Zoomed in|3'],
      ['How does a bird\'s eye view make a subject look?', 'Small', 'Tall and powerful|1', 'Natural|2', 'Closer, as when zoomed|3'],
      ['When is the normal (eye-level) viewpoint used?', 'To make the subject look natural', 'Never, it is the worst|2', 'To make it look small|1', 'Only when zooming|3'],
      ['Does zooming in change the viewpoint?', 'No, the camera stays put', 'Yes|3', 'Yes, it makes it high|0', 'Yes, it makes it small|1'],
      ['Which viewpoint makes a building look tall and powerful?', 'Worm\'s eye view', 'Bird\'s eye view|1', 'Eye level|2', 'A zoom|3'],
    ], [
      ['Kioko lies on the ground and points the camera up at a tall tree. Which viewpoint is this?', 'Worm\'s eye view', 'Bird\'s eye view|0', 'Normal view|2', 'A zoom view|3'],
      ['Faith photographs a crowd from the top of a building. Her brother says the people will look powerful. What is true?', 'They will look small', 'They will look powerful|1', 'They will look natural|2', 'Nothing changes|3'],
      ['Ali wants a passport-style photo of his friend that looks natural. Which viewpoint suits?', 'Eye level', 'From high above|1', 'From the ground|0', 'None, eye level is the worst|2'],
      ['Mwende zooms in on a goat from where she stands and says she changed the viewpoint. What is true?', 'The viewpoint is the same', 'It is now a worm\'s eye view|0', 'It is now a bird\'s eye view|1', 'It is now natural|2'],
      ['A newspaper wants a picture that makes the new national champion look strong. Which viewpoint?', 'Worm\'s eye view', 'Bird\'s eye view|1', 'Eye level only|2', 'A zoom from far|3'],
    ], [
      ['Wekesa explains a worm\'s eye view. ' + STEP, 'It is named after a worm on the ground.', 'The camera is near the ground.', 'It looks down on the subject.', 'It looks up at the subject.', 0],
      ['Achieng explains a bird\'s eye view. ' + STEP, 'The camera is high.', 'It looks down.', 'It makes the subject look tall and powerful.', 'It makes the subject look small.', 1],
      ['Kamau explains eye level. ' + STEP, 'The camera is level with the subject.', 'It shows things as we see them.', 'It is the worst viewpoint and never used.', 'It is used when the subject should look natural.', 2],
      ['Lucy explains zooming. ' + STEP, 'She stands in one place.', 'She zooms in on a flower.', 'Zooming changed her viewpoint.', 'The viewpoint is where the camera is; it did not move.', 3],
      ['Daniel explains a sports photo. ' + STEP, 'He crouched low by the track.', 'He pointed the camera up.', 'He calls it a bird\'s eye view.', 'Low, looking up, is a worm\'s eye view.', 0],
    ]),

  ...T('ff', 'CREATI.DESCANT_RECORDER.F_FINGERING', M('FF_B_FOR_BFLAT', 'FF_LOW_F_LEFT', 'FF_IGNORE_KEY', 'FF_BLOW_LOW'),
    ['Read the key signature first, then think which holes and how hard to blow.', 'F major on the recorder is F G A B-flat C D E F; low F uses the left hand and most right-hand holes, blown very gently; B flat has its own cross-fingering, and the flat in the key signature applies to every B.'], [
      ['How is B flat fingered on the descant recorder?', 'With its own cross-fingering', 'With the B fingering|0', 'With low F|1', 'Any way, blown hard|3'],
      ['Which hands cover holes for low F?', 'The left hand and most of the right', 'Only the left hand|1', 'Only the right hand|1', 'No holes|1'],
      ['How is low F blown?', 'Very gently', 'Hard|3', 'As hard as possible|3', 'With the B fingering|0'],
      ['A piece has one flat in the key signature. Which note do you play for every B?', 'B flat', 'B|2', 'Only the first B flat|2', 'C|2'],
      ['Which notes make the F major scale on the recorder?', 'F G A B-flat C D E F', 'F G A B C D E F|2', 'F G A B-flat C D E C|2', 'Only left-hand notes|1'],
    ], [
      ['Nyokabi plays the B in an F major tune with her usual B fingering. It sounds wrong. What should she do?', 'Use the B flat cross-fingering', 'Keep the B fingering|0', 'Blow harder|3', 'Use the left hand only|1'],
      ['Kiprop plays low F with only his left hand. The note is wrong. What is needed?', 'Most right-hand holes too', 'Only the left hand|1', 'The B fingering|0', 'Blowing harder|3'],
      ['Mary\'s low F squeaks. What is the likely cause?', 'She is blowing too hard', 'She uses both hands|1', 'She reads the flat|2', 'She uses cross-fingering|0'],
      ['Omar sight reads a tune in F major and plays every B natural. What did he miss?', 'The flat in the key signature', 'The B fingering|0', 'Using only the left hand|1', 'Blowing harder|3'],
      ['Before playing an F major scale, which check helps most?', 'Read the key signature: B flat', 'Plan to blow low F hard|3', 'Plan left hand only|1', 'Use the B fingering for B flat|0'],
    ], [
      ['Shiru plays F major. ' + STEP, 'She starts on low F.', 'She plays G and A.', 'She plays the B with the B fingering.', 'B flat has its own cross-fingering.', 0],
      ['Peter plays low F. ' + STEP, 'He covers the thumb hole.', 'He covers all the left-hand holes.', 'He leaves the right hand off the recorder.', 'Low F needs most right-hand holes too.', 1],
      ['Atieno reads a piece. ' + STEP, 'She sees one flat in the key signature.', 'She starts to play.', 'She plays every B as B natural.', 'The flat makes every B a B flat.', 2],
      ['Kevin plays low notes. ' + STEP, 'He covers the holes fully.', 'He keeps his fingers flat on the holes.', 'He blows hard for low F.', 'Blow very gently for low notes.', 3],
      ['Wairimu plays the scale down. ' + STEP, 'She plays F, E, D, C.', 'Next comes B flat.', 'She uses the fingering for B.', 'Use the B flat cross-fingering.', 0],
    ]),

  ...T('sf', 'CREATI.PLAY.SCRIPT_FORMAT', M('SF_QUOTES', 'SF_DIRECTIONS_PLAIN', 'SF_NO_CAST', 'SF_SCENE_ACT'),
    ['Picture the page of a script: what comes first, how speech is set out, and how directions look.', 'A script has a title, a cast list, acts made of scenes, the character\'s name before each speech with no quotation marks, and stage directions in brackets or italics.'], [
      ['How is dialogue written in a play script?', 'After the name, no quotation marks', 'In quotation marks, like a story|0', 'In brackets|1', 'Before the cast list|2'],
      ['How are stage directions set out?', 'In brackets or italics', 'As ordinary lines|1', 'In quotation marks|0', 'In the cast list|2'],
      ['What comes near the start of a script, before the dialogue?', 'The cast list', 'The first line of dialogue only|2', 'The last scene|3', 'Stage directions as speech|1'],
      ['Which is bigger in a play?', 'An act, made of scenes', 'A scene, made of acts|3', 'They are the same|3', 'A line of dialogue|0'],
      ['Who reads stage directions aloud on stage?', 'No one; they are acted', 'The actors, like dialogue|1', 'The narrator, in quotes|0', 'The cast list|2'],
    ], [
      ['Achieng writes her script like a story: "I am late," said Baraka. How should it be set out?', 'BARAKA: I am late.', 'As she wrote it|0', 'In brackets|1', 'In the cast list|2'],
      ['Ochieng writes "Mama enters slowly" as a normal line of dialogue. How should it look?', 'In brackets or italics', 'As a normal line|1', 'In quotation marks|0', 'At the top as a scene|3'],
      ['Wambui\'s script starts straight with the first speech. What is missing?', 'The cast list', 'Nothing|2', 'Quotation marks|0', 'A scene bigger than the act|3'],
      ['Brian says Scene 2 is bigger than Act 1. What is true?', 'An act is made of scenes', 'He is right|3', 'They are the same|3', 'Scenes are in brackets|1'],
      ['A drama club types its script. Which layout is right?', 'Title, cast list, Act 1 Scene 1, NAME: speech', 'Speech in quotes like a story|0', 'Directions as plain lines|1', 'No cast list|2'],
    ], [
      ['Kioko explains dialogue. ' + STEP, 'Each speech starts with a name.', 'A colon follows the name.', 'The words spoken go in quotation marks.', 'Script dialogue has no quotation marks.', 0],
      ['Halima explains directions. ' + STEP, 'Directions tell actors what to do.', 'They are not spoken.', 'They are written as ordinary lines like speech.', 'Write them in brackets or italics.', 1],
      ['Musa explains the start of a script. ' + STEP, 'It has a title.', 'It names the setting.', 'It begins with the first line of dialogue, with no cast list.', 'A cast list of characters comes first.', 2],
      ['Rose explains acts and scenes. ' + STEP, 'A play can have acts.', 'Each part has a number.', 'A scene is bigger than an act.', 'An act is bigger and is made of scenes.', 3],
      ['Daudi writes a scene. ' + STEP, 'He writes ACT 1, SCENE 1.', 'He writes MAMA: Where were you?', 'He writes the next speech in quotation marks.', 'Each speech follows the name with no quotation marks.', 0],
    ]),

  ...T('bb', 'CREATI.BASKETBALL_AND_LOGO_DESI.BASKETBALL', M('BB_TRAVEL', 'BB_DOUBLE', 'BB_HIGH_LOW', 'BB_PASS_CHOICE'),
    ['Think about the rules for moving with the ball, and the defender in the way.', 'A player may not walk with the ball (travelling) or dribble, stop and dribble again (double dribble); dribble low near a defender, high in open space; pass overhead over raised arms.'], [
      ['What is walking with the ball without dribbling called?', 'Travelling', 'A double dribble|1', 'A bounce pass|3', 'A low dribble|2'],
      ['What is dribbling, stopping, then dribbling again called?', 'A double dribble', 'Travelling|0', 'A high dribble|2', 'A chest pass|3'],
      ['Which dribble is used near a defender?', 'A low dribble', 'A high dribble|2', 'Walking with the ball|0', 'A double dribble|1'],
      ['Which pass goes over a defender\'s raised arms?', 'The overhead pass', 'The chest pass|3', 'A low dribble|2', 'Walking it there|0'],
      ['Which dribble is used for speed in open space?', 'A high dribble', 'A low dribble|2', 'A double dribble|1', 'Walking with the ball|0'],
    ], [
      ['Kiptoo catches the ball and takes three steps without bouncing it. The referee blows. Why?', 'Travelling', 'A double dribble|1', 'A bad chest pass|3', 'A high dribble|2'],
      ['Wanjiku dribbles, holds the ball, then starts dribbling again. What is the call?', 'Double dribble', 'Travelling|0', 'A good low dribble|2', 'An overhead pass|3'],
      ['A defender closes in on Hassan. He keeps a high dribble and loses the ball. What is better?', 'A low dribble', 'A higher dribble|2', 'Walking with it|0', 'Dribble, stop, dribble|1'],
      ['A tall defender stands with arms up between Achieng and her team mate. Which pass suits?', 'An overhead pass', 'A chest pass|3', 'Walking past him|0', 'A double dribble|1'],
      ['Odera has an open court in front of him on a fast break. Which dribble suits?', 'A high dribble', 'A low dribble|2', 'Stopping and restarting|1', 'Walking with the ball|0'],
    ], [
      ['Grace explains moving with the ball. ' + STEP, 'She catches a pass.', 'She wants to move towards the basket.', 'She walks with the ball without dribbling.', 'That is travelling; she must dribble to move.', 0],
      ['Barasa explains dribbling. ' + STEP, 'He dribbles up the court.', 'He stops and holds the ball.', 'He starts dribbling again.', 'That is a double dribble; he must pass or shoot.', 1],
      ['Lilian explains protecting the ball. ' + STEP, 'A defender is close.', 'She keeps her body between them.', 'She uses a high dribble.', 'Use a low dribble near a defender.', 2],
      ['Ouma explains passing. ' + STEP, 'His team mate is behind a defender.', 'The defender\'s arms are raised.', 'He chooses a chest pass.', 'Use an overhead pass over raised arms.', 3],
      ['Joy explains the bounce pass. ' + STEP, 'It bounces once before the catcher.', 'It goes under a defender\'s arms.', 'After catching, she walks with the ball to shoot.', 'Walking with the ball is travelling.', 0],
    ], ['a', 'b', 'a']),

  ...T('lg', 'CREATI.BASKETBALL_AND_LOGO_DESI.LOGO', M('LG_DETAIL', 'LG_MANY_COLOURS', 'LG_NO_MEANING', 'LG_COPY'),
    ['A logo must be seen and remembered at a glance.', 'A good team logo is simple, easy to recognise, uses few colours, works small and large, is linked to the team\'s name or spirit, and is the team\'s own design.'], [
      ['What makes a good team logo?', 'Simple and easy to recognise', 'Detailed, with many pictures|0', 'As many colours as possible|1', 'Copied from a famous team|3'],
      ['How many colours does a good logo use?', 'A few, often two or three', 'As many as possible|1', 'Every colour on the wheel|1', 'Any, if detailed|0'],
      ['What should a team logo show?', 'Something linked to the team', 'Any picture you like|2', 'A famous team\'s logo|3', 'Lots of tiny details|0'],
      ['May a school team copy a famous club\'s logo?', 'No, design your own', 'Yes|3', 'Yes, with more colours|1', 'Yes, with more detail|0'],
      ['Why must a logo work when small?', 'It goes on shirts and badges', 'Detail matters most|0', 'Colour count matters most|1', 'It need not mean anything|2'],
    ], [
      ['Kendi\'s logo for the Lions has a full jungle scene with twenty animals. What is the problem?', 'It is too detailed to recognise', 'Nothing, more is better|0', 'It needs more colours|1', 'It should copy a club|3'],
      ['Moses uses ten colours in his logo. On a black-and-white printout it is a mess. What is better?', 'Two or three colours', 'Even more colours|1', 'More detail|0', 'A copied logo|3'],
      ['The Eagles team picks a picture of a cup of tea as its logo. What is wrong?', 'It has no link to the team', 'Nothing, any picture works|2', 'It needs more colours|1', 'It should be more detailed|0'],
      ['Nanjala traces a famous football club\'s badge for her school team. What should she do?', 'Design her own', 'Keep the copy|3', 'Add more colours|1', 'Add more detail|0'],
      ['A class designs a logo for the school\'s Cheetahs team. Which plan is best?', 'A simple cheetah, two colours', 'A full savannah scene|0', 'Ten bright colours|1', 'A copied club badge|3'],
    ], [
      ['Kibet explains his logo. ' + STEP, 'His team is the Sharks.', 'He chose a shark shape.', 'He filled it with tiny waves and fish details.', 'Keep it simple so it is easy to recognise.', 0],
      ['Akinyi explains colours. ' + STEP, 'She chose blue for her team.', 'She chose white too.', 'She then added eight more colours to make it bright.', 'Use a few colours, often two or three.', 1],
      ['Wafula explains meaning. ' + STEP, 'His team is called the Rhinos.', 'He wants people to remember it.', 'He chose a star, as any picture will do.', 'Choose something linked to the team, like a rhino.', 2],
      ['Mueni explains her design. ' + STEP, 'She studied many logos.', 'She liked a famous club badge.', 'She copied it for her team.', 'Design your own logo.', 3],
      ['Salim explains size. ' + STEP, 'The logo will go on shirts.', 'It must work small.', 'He adds lots of fine detail to make it rich.', 'Fine detail is lost when small; keep it simple.', 0],
    ]),

  ...T('cp', 'CREATI.INDIGENOUS_KENYAN_CRAFTS.COIL_POTTERY', M('CP_NO_WEDGE', 'CP_UNEVEN', 'CP_NO_SLIP', 'CP_DRY_SUN'),
    ['Think about air in the clay, even walls, strong joins and slow drying.', 'Wedge the clay to remove air, roll coils of even thickness, score and join each coil with slip, smooth the inside, and dry the pot slowly in the shade.'], [
      ['Why is clay wedged before coiling?', 'To remove air bubbles', 'It is not needed|0', 'To make coils uneven|1', 'To dry it in the sun|3'],
      ['Why are coils rolled to the same thickness?', 'So walls are even and do not crack', 'It does not matter|1', 'So no slip is needed|2', 'So it dries in the sun|3'],
      ['How are coils joined?', 'Score and join with slip', 'Just press them together|2', 'Leave gaps between them|2', 'Dry each coil first|3'],
      ['Where is a coil pot dried?', 'Slowly in the shade', 'In hot sun|3', 'Over a fire straight away|3', 'Wet in a closed box|0'],
      ['When is a coil pot decorated by incising?', 'When slightly dry', 'While soaking wet|3', 'After it is fully dry and hard|3', 'Before wedging|0'],
    ], [
      ['Wanjiru skips wedging her clay. Her pot cracks when it dries. Why?', 'Air was left in the clay', 'Wedging does not matter|0', 'Her coils were even|1', 'She used slip|2'],
      ['Kioko rolls some thick coils and some thin ones. His pot cracks at the thin parts. What is better?', 'Coils of even thickness', 'Thinner coils still|1', 'No slip|2', 'Drying in the sun|3'],
      ['Mumbi presses her coils together with no scoring. They come apart as the pot dries. What should she do?', 'Score and join with slip', 'Press harder|2', 'Skip wedging|0', 'Dry it in the sun|3'],
      ['Otieno puts his new pot in the hot sun to dry by evening. It cracks. What should he do?', 'Dry it slowly in the shade', 'Use hotter sun to dry it faster|3', 'Skip the slip|2', 'Make coils uneven|1'],
      ['A class makes coil pots like the Luo nyungu. Which order is right?', 'Wedge, coil, slip, shade-dry', 'Roll any coils, press, sun-dry|1', 'No wedging, no slip|0', 'Sun-dry, then join|3'],
    ], [
      ['Faith explains preparing clay. ' + STEP, 'She removed stones and grass.', 'She kneaded the clay.', 'She skipped wedging as it is not needed.', 'Wedge to remove air bubbles so the pot does not crack.', 0],
      ['Brian explains coils. ' + STEP, 'He rolled coils on the table.', 'He built the wall coil by coil.', 'He made them all different thicknesses.', 'Roll coils of even thickness.', 1],
      ['Nekesa explains joining. ' + STEP, 'She placed one coil on another.', 'She smoothed the inside.', 'She just pressed them together with no slip.', 'Score and join each coil with slip.', 2],
      ['Daniel explains drying. ' + STEP, 'He decorated the pot when slightly dry.', 'He wanted it dry fast.', 'He left it in the hot sun.', 'Dry it slowly in the shade.', 3],
      ['Halima explains her pot. ' + STEP, 'She wedged the clay.', 'She rolled even coils.', 'She pressed them together without scoring.', 'Score the coils and join them with slip.', 2],
    ]),

  ...T('tw', 'CREATI.INDIGENOUS_KENYAN_CRAFTS.TWILL', M('TW_PLAIN', 'TW_NO_SHIFT', 'TW_WARP_WEFT', 'TW_LOOSE_WARP'),
    ['Name the threads first: warp on the frame, weft woven across.', 'A frame loom holds the warp tight; in 2/1 twill the weft goes over two warp threads and under one, moving one thread along each row to make diagonal lines.'], [
      ['What is the 2/1 twill pattern?', 'Over two, under one', 'Over one, under one|0', 'Over three, under three|0', 'Under two, over two|0'],
      ['What makes the diagonal lines in twill?', 'Each row moves one thread along', 'Every row starts in the same place|1', 'Over one, under one|0', 'A loose warp|3'],
      ['What are the threads stretched on the frame called?', 'The warp', 'The weft|2', 'The twill|2', 'The loom|2'],
      ['Why is the warp kept tight?', 'So the weave is even', 'It does not matter|3', 'So the weft is the warp|2', 'So no diagonal forms|1'],
      ['What is over one, under one called?', 'Plain weave', '2/1 twill|0', 'A loose warp|3', 'A diagonal twill|1'],
    ], [
      ['Achieng weaves over one, under one and calls it 2/1 twill. What has she made?', 'A plain weave', 'A 2/1 twill|0', 'A diagonal twill|1', 'A warp|2'],
      ['Kevin starts every row of his twill in the same place. No diagonal appears. What should he do?', 'Move one thread along each row', 'Start in the same place|1', 'Weave over one, under one|0', 'Loosen the warp|3'],
      ['The teacher tells Wambui to tighten her warp. Which threads should she tighten?', 'Those wound on the frame', 'Those she weaves across|2', 'The diagonal lines|1', 'The rows of plain weave|0'],
      ['Juma\'s warp is loose and his fabric sags and puckers. What is better?', 'Tie the warp tight', 'Loosen it more|3', 'Call it the weft|2', 'Weave over one, under one|0'],
      ['A class makes a small mat on frame looms. Which plan is right?', 'Tight warp, over two under one, shift each row', 'Loose warp, any pattern|3', 'Over one under one, same start|0', 'Weft on the frame|2'],
    ], [
      ['Kimani explains 2/1 twill. ' + STEP, 'He set up a frame loom.', 'He tied the warp tight.', 'He wove over one, under one.', '2/1 twill is over two, under one.', 0],
      ['Esther explains the diagonal. ' + STEP, 'She wove over two, under one.', 'She finished the first row.', 'She started the next row in the same place.', 'Move one warp thread along each row.', 1],
      ['Ali explains the loom. ' + STEP, 'The frame holds threads tight.', 'Thread is woven across them.', 'The threads on the frame are the weft.', 'The threads on the frame are the warp.', 2],
      ['Rose explains setting up. ' + STEP, 'She made a frame from sticks.', 'She wound the warp round it.', 'She left the warp loose, as it does not matter.', 'Keep the warp tight so the weave is even.', 3],
      ['Peter explains his weaving. ' + STEP, 'His warp is tight.', 'He moves along one thread each row.', 'His weft goes over one and under one.', 'For 2/1 twill, go over two and under one.', 0],
    ], ['c', 'd', 'd']),

  ...T('db', 'CREATI.SWIMMING.DIVE_BUTTERFLY', M('DB_SHALLOW', 'DB_FEET_FIRST', 'DB_ARMS_ALTERNATE', 'DB_FROG_KICK'),
    ['Safety first: deep water and a lifeguard; then think what enters first and how arms and legs move.', 'A standing dive enters hands first, arms over the head, only into deep water with a lifeguard; in butterfly both arms move together and the legs do a dolphin kick together.'], [
      ['Where is a standing dive safe?', 'Only into deep water, with a lifeguard', 'Anywhere in the pool|0', 'In the shallow end|0', 'Off any rock|0'],
      ['What enters the water first in a standing dive?', 'The hands, arms over the head', 'The feet|1', 'The knees|1', 'The back|1'],
      ['How do the arms move in butterfly?', 'Together', 'One after another|2', 'Only one arm|2', 'Held still|2'],
      ['Which kick is used in butterfly?', 'The dolphin kick, legs together', 'The frog kick|3', 'A flutter kick, one leg at a time|3', 'No kick|3'],
      ['How is the body held in butterfly?', 'Flat and wave-like', 'Upright, with a frog kick|3', 'Arms alternating|2', 'Feet first|1'],
    ], [
      ['At the shallow end, Kiprop wants to try a standing dive. What should his coach say?', 'Only in deep water, with a lifeguard', 'Go ahead, anywhere in the pool|0', 'Dive feet first there|1', 'Use a frog kick|3'],
      ['Mwende jumps in feet first and calls it a standing dive. How should a dive enter?', 'Hands first, arms up', 'Feet first, as he did|1', 'Knees first|1', 'In the shallow end|0'],
      ['Kibet swims butterfly moving one arm and then the other. What is right?', 'Both arms together', 'One after another|2', 'One arm only|2', 'A frog kick|3'],
      ['Zainabu uses a frog kick in her butterfly. What kick belongs to butterfly?', 'The dolphin kick', 'The frog kick|3', 'A walking kick|3', 'Alternate arms|2'],
      ['A school gala includes a dive start. Which safety rule comes first?', 'Deep water and a lifeguard', 'Any depth of water is fine|0', 'Feet first is safest|1', 'Arms one at a time|2'],
    ], [
      ['Wanjiru explains the standing dive. ' + STEP, 'She curls her toes over the edge.', 'She stretches her arms over her head.', 'She dives into the shallow end.', 'Dive only into deep water with a lifeguard.', 0],
      ['Odhiambo explains entry. ' + STEP, 'He bends at the hips.', 'He pushes off.', 'He enters the water feet first.', 'Enter hands first, arms over the head.', 1],
      ['Mercy explains butterfly arms. ' + STEP, 'Her body is flat and wave-like.', 'She breathes forward.', 'Her arms move one after the other.', 'In butterfly both arms move together.', 2],
      ['Barasa explains butterfly legs. ' + STEP, 'His arms move together over the water.', 'He keeps his body wave-like.', 'His legs do a frog kick.', 'Use the dolphin kick, legs together.', 3],
      ['Joyce explains pool safety. ' + STEP, 'A lifeguard is on duty.', 'She checks the depth sign.', 'She dives where the sign says shallow.', 'Dive only where the water is deep.', 0],
    ]),

  ...T('bg', 'CREATI.KENYAN_INDIGENOUS_GAMES_.BOARD_GAMES', M('BG_CHESS', 'BG_LUCK', 'BG_BENEFIT', 'BG_SOW_SKIP'),
    ['Think of games of sowing seeds in pits, played on boards or in the ground.', 'Bao and other sowing games are indigenous Kenyan board games: seeds are sown one by one into the next pits and captured; they build counting, planning, patience and mental health.'], [
      ['Which is an indigenous Kenyan board game?', 'Bao', 'Chess|0', 'Draughts|0', 'Snakes and ladders|0'],
      ['Does bao depend only on luck?', 'No, it needs counting and planning', 'Yes, only luck|1', 'Yes, like a dice game|1', 'It has no rules|3'],
      ['What can board games like bao build?', 'Counting and planning', 'Nothing, you sit still|2', 'Only luck|1', 'Only running speed|2'],
      ['How are seeds sown in bao?', 'One seed in each pit in turn', 'As many as you like in one pit|3', 'All in the first pit|3', 'Thrown at random|1'],
      ['Where can sowing games be played?', 'On a board or in pits in the ground', 'Only on a chessboard|0', 'Only on a computer|0', 'Only with dice|1'],
    ], [
      ['Wekesa lists chess as an indigenous Kenyan board game. Which game fits better?', 'Bao', 'Chess, as he said|0', 'Draughts|0', 'Ludo|0'],
      ['Moraa says bao is just luck. How would a good player answer?', 'It needs counting and planning', 'She is right, it is luck|1', 'It needs no thinking|2', 'Drop many seeds at once|3'],
      ['A teacher says board games waste time because learners sit still. What benefit could you name?', 'They build patience and planning', 'None, because they sit still|2', 'They are only luck|1', 'They are foreign games|0'],
      ['Kendi drops three seeds into one pit on her turn. What is the rule?', 'One seed in each pit in turn', 'As many as she likes in one pit|3', 'All into the last pit|3', 'Any, it is luck|1'],
      ['During a games day, elders show learners a game of seeds in holes dug in the ground. What is it?', 'An indigenous sowing game', 'Chess|0', 'A game of pure luck|1', 'A game with no benefit|2'],
    ], [
      ['Atieno explains Kenyan board games. ' + STEP, 'Many communities play sowing games.', 'They use seeds and pits.', 'Chess is one of these indigenous games.', 'Bao and other sowing games are indigenous; chess is not.', 0],
      ['Kamau explains bao. ' + STEP, 'Players take turns.', 'They capture seeds.', 'Winning depends only on luck.', 'Winning needs counting and planning ahead.', 1],
      ['Lucy explains benefits. ' + STEP, 'Bao is played sitting down.', 'Players talk and laugh.', 'So it has no benefit at all.', 'It builds counting, planning, patience and social time.', 2],
      ['Ochieng explains sowing. ' + STEP, 'He picks up the seeds from a pit.', 'He moves along the row.', 'He drops several seeds into one pit.', 'Drop one seed into each pit in turn.', 3],
      ['Neema explains capturing. ' + STEP, 'She sows one seed per pit.', 'She plans which pit to start from.', 'She says planning does not matter because it is luck.', 'Planning ahead decides the game.', 1],
    ]),

  ...T('pa', 'APPREC.ANALYSIS_OF_CREATIVE_ART.PERFORMANCE_ANALYSIS', M('PA_OPINION', 'PA_DICTION', 'PA_ACCOMPANIMENT', 'PA_AUDIENCE'),
    ['Use the right term and back it with something seen or heard.', 'Analyse a play by theme, setting, conflict, voice and body, props, costume and audience involvement; a solo song by melody, dynamics, tempo, diction (clear words), message and accompaniment.'], [
      ['Which is an analysis of a play, not only an opinion?', 'His shaking voice showed fear', 'It was nice and well acted|0', 'I enjoyed every part of it|0', 'Only the costumes|3'],
      ['What is diction in singing?', 'How clearly words are said', 'How loud the singing is|1', 'How fast it is|1', 'Who plays the guitar|2'],
      ['Can a solo vocal piece have accompaniment?', 'Yes, with instruments', 'No, solo means alone|2', 'Only if loud|1', 'Only in a play|3'],
      ['Which point about a play is often left out?', 'How actors involve the audience', 'Only the costumes, which matter most|3', 'That it was nice|0', 'How loud the songs were|1'],
      ['Which is a feature of a solo song to analyse?', 'Its dynamics', 'That it was nice|0', 'Only the costumes|3', 'That solo means no instruments|2'],
    ], [
      ['After a play, Wanjiku writes only: it was nice. What should she add?', 'Evidence of how it was acted', 'Nothing more is needed|0', 'How loud the songs were|1', 'Only the costumes|3'],
      ['Kibet says the soloist had good diction because she sang loudly. What is diction?', 'How clear her words were', 'How loud she sang|1', 'The guitar part|2', 'The audience part|3'],
      ['A soloist sings with a guitar. Halima says it is not a solo because there is a guitar. What is true?', 'It is an accompanied solo', 'It is not a solo at all|2', 'It is a play|3', 'Diction means loudness|1'],
      ['In a play, actors walk into the crowd and ask questions. Otieno writes only about costumes. What has he missed?', 'Audience involvement', 'Nothing|3', 'That it was nice|0', 'The loudness|1'],
      ['A singer gets softer at the sad part of a song. Which element is Faith noticing?', 'Dynamics', 'Diction as loudness|1', 'A play costume|3', 'Only her opinion|0'],
    ], [
      ['Kevin analyses a play. ' + STEP, 'The theme is honesty.', 'The conflict is between father and son.', 'My last point: it was nice.', 'Back each point with evidence, such as the actor\'s voice.', 0],
      ['Nduta analyses a song. ' + STEP, 'The tempo was slow.', 'The message was about hope.', 'Her diction was good because she sang loudly.', 'Diction is how clearly the words are pronounced.', 1],
      ['Musa analyses a solo. ' + STEP, 'One singer performed.', 'A pianist played along.', 'So it was not a solo vocal piece.', 'A solo can be accompanied by instruments.', 2],
      ['Grace analyses a play. ' + STEP, 'She noted the setting.', 'She noted the props.', 'She said only the costumes are worth analysing.', 'Theme, conflict, voice, props and audience involvement count too.', 3],
      ['Daudi analyses a song. ' + STEP, 'The melody rose at the chorus.', 'The guitar kept a steady beat.', 'The song was nice, and that is my analysis.', 'Give evidence for each point, not only an opinion.', 0],
    ], ['a', 'c', 'a']),

  ...T('se', 'APPREC.ANALYSIS_OF_CREATIVE_ART.SPORTS_ETHICS', M('SE_DOPING_OK_SMALL', 'SE_AGE_CHEAT', 'SE_MATCH_FIXING', 'SE_DOPING_ONLY_HEALTH'),
    ['Ask whether it is fair to everyone else in the game.', 'Ethical sport means no doping (any banned substance is cheating and harms health), honest age, no match fixing, respect and fair play.'], [
      ['Is a small amount of a banned drug acceptable in sport?', 'No, any amount is doping', 'Yes, if it is small|0', 'Yes, if it helps|0', 'Yes, if unhealthy only|3'],
      ['Why is lying about age to play in a younger group wrong?', 'It cheats younger players', 'It is harmless|1', 'It helps the team win|1', 'It is a private choice|2'],
      ['What is losing a match on purpose for money?', 'Match fixing', 'A private choice|2', 'Fair play|2', 'Doping|0'],
      ['Why is doping banned?', 'It is cheating and harms health', 'Only because it is unhealthy|3', 'It is fine in small amounts|0', 'It is a private choice|2'],
      ['Which is an ethical practice in sport?', 'Respecting officials', 'Lying about age|1', 'Fixing matches|2', 'Small doses of banned drugs|0'],
    ], [
      ['An athlete says one small pill of a banned drug will not count. What is true?', 'Any banned substance is doping', 'Small amounts are fine|0', 'It is only unhealthy|3', 'It is his choice|2'],
      ['A 16-year-old plays in an under-13 league to help his team win. What is wrong?', 'It cheats younger players', 'Nothing, it helps|1', 'It is doping|0', 'It is his own choice|2'],
      ['A goalkeeper lets in goals on purpose after taking money. He says it is his choice. What is it?', 'Match fixing that cheats everyone', 'His private choice|2', 'A small doping case|0', 'Only bad for health|3'],
      ['Faith says doping is banned only because it is unhealthy. What else makes it wrong?', 'It is cheating', 'Nothing else|3', 'It is fine in small doses|0', 'It is about age|1'],
      ['A school sports day wants fair play. Which rule fits?', 'Check ages honestly', 'Allow small doses|0', 'Let teams fix results|2', 'Ignore age|1'],
    ], [
      ['Brian explains doping. ' + STEP, 'Doping uses banned substances.', 'It is against the rules.', 'A small amount is acceptable.', 'Any banned substance is doping.', 0],
      ['Kendi explains age. ' + STEP, 'Age groups keep games fair.', 'Younger players are smaller.', 'Lying about age is harmless if it helps the team.', 'It is cheating and unfair to younger players.', 1],
      ['Ouma explains match fixing. ' + STEP, 'Fans pay to watch a fair game.', 'Teams should try to win.', 'Losing on purpose for money is a private choice.', 'It is match fixing and cheats everyone.', 2],
      ['Wairimu explains why doping is banned. ' + STEP, 'Doping can harm the heart.', 'It gives an unfair advantage.', 'It is banned only because it is unhealthy.', 'It is cheating as well as harmful.', 3],
      ['Salim explains fair play. ' + STEP, 'He shakes hands with opponents.', 'He respects the referee.', 'He thinks a tiny dose of a banned drug is fair.', 'Any banned substance is doping and unfair.', 0],
    ]),

  ...T('cq', 'APPREC.ANALYSIS_OF_CREATIVE_ART.CRITIQUE', M('CQ_JUDGE_FIRST', 'CQ_NO_REASON', 'CQ_ARTIST_PERSON', 'CQ_INTERPRET_DESCRIBE'),
    ['Follow the four steps: describe, analyse, interpret, judge.', 'A critique describes what is seen, analyses the elements and principles, interprets the meaning and judges with reasons, about the work, not the artist as a person.'], [
      ['What is the first step of a critique?', 'Describe what you see', 'Say if it is good or bad|0', 'Talk about the artist\'s character|2', 'Give the meaning first|3'],
      ['How is an artwork judged in a critique?', 'With reasons from the work', 'It is bad, with no reason|1', 'By whether the artist is nice|2', 'By listing what is in it|3'],
      ['What does a critique comment on?', 'The artwork itself', 'The artist as a person|2', 'Only good or bad|1', 'Only what is in it|3'],
      ['What is interpreting an artwork?', 'Saying what it means', 'Listing what is in it|3', 'Saying it is bad|1', 'Judging the artist|2'],
      ['Which is the last step of a critique?', 'Judge, with reasons', 'Describe what is seen|0', 'Talk about the artist|2', 'List the objects|3'],
    ], [
      ['At an exhibition, Juma begins: this painting is ugly. What should come first?', 'A description of what he sees', 'His judgement of it|0', 'The artist\'s character|2', 'The meaning|3'],
      ['Shiru writes: it is bad. What is missing?', 'A reason from the artwork', 'Nothing|1', 'The artist\'s age|2', 'A list of objects|3'],
      ['Kioko says the sculpture is poor because he dislikes the sculptor. What is wrong?', 'He judged the person', 'Nothing is wrong|2', 'He gave reasons|1', 'He described first|0'],
      ['Asked what a painting means, Mumbi lists a woman, a pot and a tree. What should she do?', 'Say what it expresses', 'Keep listing|3', 'Judge it as bad|1', 'Talk about the painter|2'],
      ['A class critiques a mural. Which order is right?', 'Describe, analyse, interpret, judge', 'Judge first, then describe it|0', 'Judge with no reasons|1', 'Talk about the artist only|2'],
    ], [
      ['Kevin critiques a painting. ' + STEP, 'He looked closely at it.', 'He planned four steps.', 'He started by saying it was good or bad.', 'Start by describing what you see.', 0],
      ['Nekesa judges a sculpture. ' + STEP, 'She described it.', 'She analysed its shapes.', 'She judged it as bad with no reason.', 'Give a reason, such as how the shapes draw the eye.', 1],
      ['Peter critiques a drawing. ' + STEP, 'He described the lines.', 'He analysed the balance.', 'He said the artist is not a nice person.', 'Comment on the artwork, not the artist as a person.', 2],
      ['Atieno interprets a photo. ' + STEP, 'She described a child at a window.', 'She analysed the dark colours.', 'For the meaning, she listed the objects again.', 'Say what the work means or expresses, such as longing.', 3],
      ['Lilian judges a mural. ' + STEP, 'She described and analysed it.', 'She interpreted its message of unity.', 'She judged it simply as beautiful, with no reason.', 'Judge with reasons from the work.', 1],
    ]),
];
