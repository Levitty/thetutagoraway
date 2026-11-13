// ============================================================================
// GRADE 6 CREATIVE ARTS, THEME B: WEAVING, GYMNASTICS, MELODY (SOL-FA) AND ATHLETICS (JUMPS) (4 skills).
// Knowledge half only: weaving a mat, performing a cartwheel, singing with hand signs and jumping are practical or
// teacher-observed (see the non-question outcomes doc). Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a teacher signs them off. Hand signs are for a music teacher to confirm.
// ============================================================================
import { fam, choose, spot, w, sp } from './creativearts_g6_lib.js';

const WV = 'CREATI.WEAVING.', GY = 'CREATI.GYMNASTICS.', ML = 'CREATI.MELODY.', AT = 'PERFOR.ATHLETICS.';

export const FAMILIES = [
  // ---------------------------------------------------------------- WV.PLAIN_WEAVE
  fam('wv.pw.parts', `${WV}PLAIN_WEAVE`, 'direct', 1, choose([
    ['Which threads are held tight on the loom?', 'The warp', [...w('M_WV_WARP', 'The weft'), ...w('M_WV_WARP', 'The needle'), ...w('M_WV_WARP', 'The knots')], 'The warp is held tight on the loom.'],
    ['Which thread is woven across the warp?', 'The weft', [...w('M_WV_WARP', 'The warp'), ...w('M_WV_WARP', 'The loom'), ...w('M_WV_WARP', 'The card')], 'The weft is woven across the warp.'],
    ['How does a plain weave go?', 'Over one warp thread and under the next', [...w('M_WV_PATTERN', 'Over two warp threads and under two'), ...w('M_WV_PATTERN', 'Over three and under one'), ...w('M_WV_PATTERN', 'Always over')], 'A plain weave goes over one and under one.'],
    ['What is the notched edge of a serrated card loom for?', 'To hold the warp threads in place', [...w('M_WV_WARP', 'To hold the weft only'), ...w('M_WV_WARP', 'To cut the threads'), ...w('M_WV_WARP', 'To dry the mat')], 'The notches hold the warp threads.'],
    ['Which material can be used for weaving a mat?', 'Raffia or sisal', [...w('M_WV_PATTERN', 'Wet clay'), ...w('M_WV_PATTERN', 'Iron wire'), ...w('M_WV_PATTERN', 'Sand')], 'Raffia and sisal are soft strips that can be woven.'],
  ], { h: ['Warp stays; weft travels.', 'Plain weave is over one and under one.'], s1: 'Remember the warp and the weft.' })),
  fam('wv.pw.row', `${WV}PLAIN_WEAVE`, 'word', 2, choose([
    ['How does the second row of a plain weave start?', 'The opposite of the first row', [...w('M_WV_SAME_ROW', 'The same as the first row'), ...w('M_WV_SAME_ROW', 'Over three threads'), ...w('M_WV_SAME_ROW', 'With a knot')], 'The second row goes under where the first went over.'],
    ['Achieng goes over one warp thread. What does she do next?', 'Go under the next one', [...w('M_WV_PATTERN', 'Go over the next one'), ...w('M_WV_PATTERN', 'Go over two more'), ...w('M_WV_PATTERN', 'Stop weaving')], 'Plain weave goes over one and under the next.'],
    ['Otieno weaves two rows the same and the mat comes apart. Why?', 'The rows did not alternate', [...w('M_WV_SAME_ROW', 'The weft was too strong'), ...w('M_WV_WARP', 'The warp was too tight'), ...w('M_WV_PATTERN', 'He went over too many')], 'Rows must alternate so the weaving locks.'],
    ['Wanjiru says the weft is held tight on the loom. Is she right?', 'No, the warp is held tight', [...w('M_WV_WARP', 'Yes, the weft is held tight'), ...w('M_WV_WARP', 'Yes, the weft is the loom'), ...w('M_WV_WARP', 'Yes, both are held tight')], 'The warp is held tight. The weft is woven across.'],
    ['Which tool or part holds the warp on a card loom?', 'The notches in the card', [...w('M_WV_WARP', 'The weft thread'), ...w('M_WV_WARP', 'A hammer'), ...w('M_WV_WARP', 'Glue')], 'The notches hold the warp.'],
  ], { h: ['Rows alternate: over one, under one, then the opposite.', 'The warp is the tight set of threads.'], s1: 'Check the alternate rows.' })),
  fam('wv.pw.spot', `${WV}PLAIN_WEAVE`, 'spot', 3, spot([
    sp('Baraka explains weaving.', ['The warp is held tight on the loom.', 'The weft goes across the warp.', 'The weft is held tight on the loom.'], 2, 'The warp is held tight, not the weft.', 'M_WV_WARP'),
    sp('Wanjiru explains plain weave.', ['It goes over one warp thread.', 'Then it goes under the next one.', 'It goes over two and under two.'], 2, 'Plain weave goes over one and under one.', 'M_WV_PATTERN'),
    sp('Kamau explains the rows.', ['The first row goes over one, under one.', 'The second row goes the opposite way.', 'Every row goes the same way.'], 2, 'The second row does the opposite of the first.', 'M_WV_SAME_ROW'),
    sp('Mwende explains the loom.', ['The card loom has notches.', 'The notches hold the warp.', 'The notches hold the weft only.'], 2, 'The notches hold the warp.', 'M_WV_WARP'),
    sp('Nekesa explains the mat.', ['She uses sisal strips.', 'She weaves over one and under one.', 'She uses the same row each time.'], 2, 'She starts each row the opposite way.', 'M_WV_SAME_ROW'),
  ], { h: ['Check each step: warp tight, weft across, rows alternate.', 'Plain weave is over one, under one.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- GY.CARTWHEEL
  fam('gy.cw.order', `${GY}CARTWHEEL`, 'direct', 1, choose([
    ['In a cartwheel, what touches the ground first?', 'The hands, one after the other', [...w('M_CW_ORDER', 'The feet'), ...w('M_CW_ORDER', 'The head'), ...w('M_CW_ORDER', 'The back')], 'The hands touch first, then the feet.'],
    ['How should the arms be in a cartwheel?', 'Straight', [...w('M_CW_BENT', 'Bent'), ...w('M_CW_BENT', 'Crossed'), ...w('M_CW_BENT', 'Held to the chest')], 'The arms stay straight.'],
    ['What is the order of hands and feet in a cartwheel?', 'Hand, hand, foot, foot', [...w('M_CW_ORDER', 'Foot, foot, hand, hand'), ...w('M_CW_ORDER', 'Hand, foot, hand, foot'), ...w('M_CW_ORDER', 'Foot, hand, foot, hand')], 'Hand, hand, foot, foot.'],
    ['Which describes a cartwheel?', 'A sideways turn over the hands with straight arms and wide legs', [...w('M_CW_ORDER', 'A forward turn on the head'), ...w('M_CW_BENT', 'A bent-arm roll over the shoulders'), ...w('M_CW_ORDER', 'A jump on both feet')], 'A cartwheel is a sideways turn.'],
    ['How should the legs be in a cartwheel?', 'Straight and wide apart', [...w('M_CW_BENT', 'Bent and together'), ...w('M_CW_BENT', 'Tucked under'), ...w('M_CW_BENT', 'Crossed')], 'Straight, wide legs make a neat cartwheel.'],
  ], { h: ['Think: a wheel turns sideways, hands first.', 'Straight arms, straight wide legs.'], s1: 'Picture a wheel turning sideways.' })),
  fam('gy.cw.seq', `${GY}CARTWHEEL`, 'steps', 2, choose([
    ['What is the order of the three-action sequence?', 'Cartwheel, forward roll, swan balance', [...w('M_CW_SEQUENCE', 'Swan balance, cartwheel, forward roll'), ...w('M_CW_SEQUENCE', 'Forward roll, swan balance, cartwheel'), ...w('M_CW_SEQUENCE', 'Swan balance, forward roll, cartwheel')], 'The sequence is cartwheel, forward roll, swan balance.'],
    ['Which is the last action of the sequence?', 'Swan balance', [...w('M_CW_SEQUENCE', 'Cartwheel'), ...w('M_CW_SEQUENCE', 'Forward roll'), ...w('M_CW_SEQUENCE', 'Handstand')], 'The sequence ends with the swan balance.'],
    ['Which is the first action of the sequence?', 'Cartwheel', [...w('M_CW_SEQUENCE', 'Forward roll'), ...w('M_CW_SEQUENCE', 'Swan balance'), ...w('M_CW_SEQUENCE', 'Handstand')], 'The sequence starts with the cartwheel.'],
    ['In a swan balance, what does the gymnast do?', 'Stands on one leg with the other lifted behind and arms out', [...w('M_CW_BENT', 'Sits on the floor with both legs bent'), ...w('M_CW_BENT', 'Stands on both feet with arms down'), ...w('M_CW_BENT', 'Kneels with the head down')], 'The swan balance is on one leg with arms out.'],
    ['In a forward roll, what should the gymnast do with the chin?', 'Tuck it to the chest', [...w('M_CW_BENT', 'Lift it up high'), ...w('M_CW_BENT', 'Turn it to the side'), ...w('M_CW_BENT', 'Press it to the floor')], 'Tuck the chin and round the back.'],
  ], { h: ['The sequence is cartwheel, forward roll, swan balance.', 'A swan balance is on one leg.'], s1: 'Recall the order of the three actions.' })),
  fam('gy.cw.spot', `${GY}CARTWHEEL`, 'spot', 3, spot([
    sp('Baraka explains the cartwheel.', ['It is a sideways turn.', 'The hands touch first.', 'The feet touch first.'], 2, 'The hands touch first, then the feet.', 'M_CW_ORDER'),
    sp('Wanjiru explains the arms.', ['The arms are straight.', 'The legs are straight and wide.', 'The arms are bent at the elbow.'], 2, 'The arms stay straight.', 'M_CW_BENT'),
    sp('Kamau explains the sequence.', ['A cartwheel comes first.', 'A forward roll comes next.', 'A swan balance comes first.'], 2, 'The swan balance comes last.', 'M_CW_SEQUENCE'),
    sp('Mwende explains the hands and feet.', ['Hand, hand, foot, foot.', 'The legs are wide apart.', 'Foot, foot, hand, hand.'], 2, 'The order is hand, hand, foot, foot.', 'M_CW_ORDER'),
    sp('Nekesa explains the sequence.', ['The sequence has three actions.', 'It ends with a swan balance.', 'It starts with the swan balance.'], 2, 'It starts with the cartwheel.', 'M_CW_SEQUENCE'),
  ], { h: ['Check each step: hands first, straight arms, the order of three actions.', 'Cartwheel, forward roll, swan balance.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- ML.SOLFA
  fam('ml.sf.order', `${ML}SOLFA`, 'direct', 1, choose([
    ['Going up, which syllable comes after soh?', 'Lah', [...w('M_ML_ORDER', 'Ti'), ...w('M_ML_ORDER', 'Fah'), ...w('M_ML_ORDER', 'Mi')], 'Going up: doh, re, mi, fah, soh, lah, ti, doh1.'],
    ['Going up, which syllable comes after mi?', 'Fah', [...w('M_ML_ORDER', 'Soh'), ...w('M_ML_ORDER', 'Re'), ...w('M_ML_ORDER', 'Lah')], 'After mi comes fah.'],
    ['Going down from doh1, which syllable comes first?', 'Ti', [...w('M_ML_DOWN', 'Re'), ...w('M_ML_DOWN', 'Doh'), ...w('M_ML_DOWN', 'Lah')], 'Going down from doh1 the order is ti, lah, soh, fah, mi, re, doh.'],
    ['Going down, which syllable comes after soh?', 'Fah', [...w('M_ML_DOWN', 'Lah'), ...w('M_ML_DOWN', 'Ti'), ...w('M_ML_ORDER', 'Mi')], 'After soh going down comes fah.'],
    ['Which sounds higher, doh or doh1?', 'Doh1', [...w('M_ML_DOWN', 'Doh'), ...w('M_ML_DOWN', 'They sound the same'), ...w('M_ML_DOWN', 'It depends on the singer')], 'Doh1 is the higher doh.'],
  ], { h: ['Sing the ladder in your head: doh, re, mi, fah, soh, lah, ti, doh1.', 'Down is the same ladder backwards.'], s1: 'Say the syllables in order.' })),
  fam('ml.sf.sign', `${ML}SOLFA`, 'word', 2, choose([
    ['What is the hand sign for doh?', 'A closed fist', [...w('M_ML_SIGN', 'A finger pointing up'), ...w('M_ML_SIGN', 'A flat hand'), ...w('M_ML_SIGN', 'An open palm up')], 'The sign for doh is a closed fist.'],
    ['What is the hand sign for ti?', 'A finger pointing up', [...w('M_ML_SIGN', 'A closed fist'), ...w('M_ML_SIGN', 'A flat hand'), ...w('M_ML_SIGN', 'Two fingers crossed')], 'The sign for ti is a finger pointing up.'],
    ['Achieng sings doh and then doh1. Which sound is higher?', 'The second one, doh1', [...w('M_ML_DOWN', 'The first one, doh'), ...w('M_ML_DOWN', 'Both are the same'), ...w('M_ML_DOWN', 'Neither, they are quiet')], 'Doh1 is higher than doh.'],
    ['Otieno sings from ti down to doh. How many syllables does he sing in all?', 'Seven', [...w('M_ML_DOWN', 'Eight'), ...w('M_ML_DOWN', 'Six'), ...w('M_ML_DOWN', 'Five')], 'Ti, lah, soh, fah, mi, re, doh is seven syllables.'],
    ['Wanjiru hears a melody go from fah to soh to lah. Is it going up or down?', 'Up', [...w('M_ML_DOWN', 'Down'), ...w('M_ML_DOWN', 'Neither'), ...w('M_ML_DOWN', 'It stays the same')], 'Fah to soh to lah goes up the ladder.'],
  ], { h: ['Doh is a fist; ti is a finger pointing up.', 'Up the ladder means higher sounds.'], s1: 'Think of the ladder and the signs.' }), 'c'),
  fam('ml.sf.spot', `${ML}SOLFA`, 'spot', 3, spot([
    sp('Baraka explains the sol-fa ladder.', ['The ladder goes doh, re, mi.', 'It continues fah, soh, lah.', 'It ends ti, doh1, lah.'], 2, 'The ladder ends lah, ti, doh1.', 'M_ML_ORDER'),
    sp('Wanjiru explains going down.', ['Going down starts from doh1.', 'The next is ti.', 'The next is re.'], 2, 'After ti comes lah.', 'M_ML_DOWN'),
    sp('Kamau explains the signs.', ['Doh has a sign.', 'Doh is a closed fist.', 'Doh is a finger pointing up.'], 2, 'Doh is a closed fist.', 'M_ML_SIGN'),
    sp('Mwende explains pitch.', ['Doh1 is higher than doh.', 'Soh is higher than fah.', 'Re is higher than mi.'], 2, 'Mi is higher than re.', 'M_ML_ORDER'),
    sp('Nekesa explains going up.', ['Going up means higher sounds.', 'After fah comes soh.', 'After soh comes ti.'], 2, 'After soh comes lah.', 'M_ML_ORDER'),
  ], { h: ['Check each step against the ladder.', 'Doh, re, mi, fah, soh, lah, ti, doh1.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- AT.JUMPS
  fam('at.jp.phases', `${AT}JUMPS`, 'steps', 1, choose([
    ['What is the first phase of the long jump?', 'The run-up', [...w('M_AJ_ORDER', 'The landing'), ...w('M_AJ_ORDER', 'The flight'), ...w('M_AJ_ORDER', 'The take-off')], 'The long jump starts with the run-up.'],
    ['In the long jump, how does the athlete take off?', 'From a single foot', [...w('M_AJ_TAKEOFF', 'From both feet together'), ...w('M_AJ_TAKEOFF', 'From the knees'), ...w('M_AJ_TAKEOFF', 'From the heels only')], 'The long jump is taken off from a single foot.'],
    ['What is the order of the long jump phases?', 'Run-up, take-off, flight, landing', [...w('M_AJ_ORDER', 'Take-off, run-up, landing, flight'), ...w('M_AJ_ORDER', 'Landing, flight, take-off, run-up'), ...w('M_AJ_ORDER', 'Flight, run-up, landing, take-off')], 'The phases are run-up, take-off, flight, landing.'],
    ['Where is the long jump measured from?', 'From the take-off line to the nearest mark in the sand', [...w('M_AJ_MEASURE', 'From where the run-up starts'), ...w('M_AJ_MEASURE', 'To the end of the pit'), ...w('M_AJ_MEASURE', 'From the athlete\'s toes to the heel')], 'The jump is measured to the nearest mark.'],
    ['What does the athlete land on in the long jump?', 'A sand pit', [...w('M_AJ_ORDER', 'A mat'), ...w('M_AJ_ORDER', 'The grass'), ...w('M_AJ_ORDER', 'A trampoline')], 'The long jump lands in a sand pit.'],
  ], { h: ['Think of the order: run, take off, fly, land.', 'The athlete takes off from a single foot.'], s1: 'Say the phases in order.' })),
  fam('at.jp.techniques', `${AT}JUMPS`, 'word', 2, choose([
    ['What is the sail technique in the long jump?', 'Holding the legs together and forward in the air', [...w('M_AJ_TAKEOFF', 'Taking off from both feet'), ...w('M_AJ_ORDER', 'Running very fast with the arms down'), ...w('M_AJ_MEASURE', 'Measuring the longest jump')], 'In the sail the athlete holds the legs forward in the air.'],
    ['What is the scissors technique in the high jump?', 'One leg and then the other go over the bar', [...w('M_AJ_TAKEOFF', 'Both legs go over at once'), ...w('M_AJ_ORDER', 'The athlete jumps head first'), ...w('M_AJ_MEASURE', 'The bar is cut in two')], 'The legs go over the bar one after the other like scissors.'],
    ['Where does the high jumper land?', 'On a mat', [...w('M_AJ_ORDER', 'In a sand pit'), ...w('M_AJ_ORDER', 'On the track'), ...w('M_AJ_ORDER', 'In the water')], 'The high jump lands on a mat.'],
    ['How does the high jump run-up approach the bar?', 'From an angle, from the side', [...w('M_AJ_ORDER', 'Straight at the bar from the front'), ...w('M_AJ_ORDER', 'Backwards'), ...w('M_AJ_ORDER', 'From above')], 'The high jump run-up is from an angle.'],
    ['How does the high jumper take off?', 'From a single foot', [...w('M_AJ_TAKEOFF', 'From both feet together'), ...w('M_AJ_TAKEOFF', 'From the knees'), ...w('M_AJ_TAKEOFF', 'From the hands')], 'The high jump takes off from a single foot.'],
  ], { h: ['Sail is in the long jump; scissors is in the high jump.', 'Both jumps take off from a single foot.'], s1: 'Link the technique to its jump.' })),
  fam('at.jp.spot', `${AT}JUMPS`, 'spot', 3, spot([
    sp('Baraka explains the long jump.', ['It starts with a run-up.', 'The athlete takes off from a single foot.', 'The athlete takes off from both feet.'], 2, 'The athlete takes off from a single foot.', 'M_AJ_TAKEOFF'),
    sp('Wanjiru explains the phases.', ['There is a run-up.', 'There is a take-off.', 'Landing comes before the flight.'], 2, 'Flight comes before landing.', 'M_AJ_ORDER'),
    sp('Kamau explains measuring.', ['The jump is measured in metres.', 'The athlete lands in the sand pit.', 'It is measured from where the run-up starts.'], 2, 'It is measured from the take-off line to the nearest mark.', 'M_AJ_MEASURE'),
    sp('Mwende explains the high jump.', ['The run-up is from an angle.', 'The jumper takes off from a single foot.', 'The jumper lands in a sand pit.'], 2, 'The high jumper lands on a mat.', 'M_AJ_ORDER'),
    sp('Nekesa explains the scissors.', ['It is a high jump technique.', 'One leg goes over first.', 'Both feet leave the ground together.'], 2, 'The athlete takes off from a single foot.', 'M_AJ_TAKEOFF'),
  ], { h: ['Check each step against how jumps are done.', 'Take off from a single foot; sail and scissors are different jumps.'], s1: 'Find the step that is not true.' })),
];
