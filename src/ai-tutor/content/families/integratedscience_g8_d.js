// ============================================================================
// INTEGRATED SCIENCE GRADE 8, THE TWO DEPTH-PASS SKILLS AWAITING FAMILIES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): predicting
// diffusion and osmosis demonstrations, and a plan to manage the challenges of the menstrual cycle. The demonstrations are done
// in class and marked by the teacher (KICD rubric); the app asks the prediction and the reason. The menstrual-cycle family is
// plain, practical and shame-free, and always names a trusted adult or the school nurse; a teacher confirms it first.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false.
// ============================================================================
import { T } from './integratedscience_g8_lib.js';

const M = (...s) => s.map(x => `M_G8_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('dd', 'LIVING.MOVEMENT_OF_MATERIALS_IN.DIFFUSION_OSMOSIS_DEMO', M('DD_SALT_INTO_POTATO', 'DD_STIRRING_NEEDED', 'DD_RAISIN_SHRINKS', 'DD_HOT_SLOWER'),
    ['Ask what moves: particles spreading out, or water crossing a membrane, and which way.', 'Particles spread from where there are many to where there are few, faster when hot; water moves by osmosis into the more concentrated side, so salty water draws water out.'], [
      ['A drop of dye is put in a beaker of still water. What happens over time?', 'The colour spreads until even', 'It stays as a drop at the bottom|1', 'It spreads only if stirred|1', 'It goes back into the dropper|1'],
      ['Why does a potato strip go soft in salty water?', 'Water moves out of it by osmosis', 'Salt went into it and softened it|0', 'The salt water was stirred|1', 'It swells with water|2'],
      ['A raisin is soaked in plain water overnight. What happens?', 'It swells', 'It shrinks|2', 'It stays the same|2', 'It goes soft because salt enters|0'],
      ['Dye is dropped into a hot glass and a cold glass. Where does it spread faster?', 'The hot glass', 'The cold glass|3', 'The same in both|3', 'In neither, without stirring|1'],
      ['Potato strips are put in plain water. What happens to them?', 'They get firm and longer', 'They shrink and go soft|2', 'Salt goes in and softens them|0', 'Nothing, until stirred|1'],
    ], [
      ['Achieng sprays perfume at the front of the classroom. Soon learners at the back smell it. Why?', 'The particles spread out', 'Someone stirred the air|1', 'It moves faster in the cold|3', 'Water carried it by osmosis|0'],
      ['Kamau puts one potato strip in salty water and one in plain water. After an hour, which is soft and shorter?', 'The one in salty water', 'The one in plain water|2', 'Both, as salt went into both|0', 'Neither, without stirring|1'],
      ['Mama Wanjiru soaks dry beans overnight before cooking. In the morning they are bigger. Why?', 'Water moved into them', 'They shrank in the water|2', 'Salt went into the beans|0', 'Someone stirred the pot|1'],
      ['Otieno puts a crystal of potassium permanganate in cold water and another in hot water. Which turns purple all through first?', 'The hot water', 'The cold water|3', 'Neither, unless stirred|1', 'Both at the same time|3'],
      ['Wekesa says the salt soaked into the potato and made it soft. How would you explain it instead?', 'Water left the potato', 'He is right, salt went in|0', 'The potato swelled|2', 'The water was stirred|1'],
    ], [
      ['Faith explains the dye demonstration. ' + STEP, 'She dropped dye into still water.', 'She did not stir it.', 'She predicted it would stay as a drop because nothing stirred it.', 'The particles spread on their own until the colour is even.', 1],
      ['Kibet explains the potato in salt water. ' + STEP, 'The strip went soft and shorter.', 'This is osmosis.', 'Salt moved into the potato and made it soft.', 'Water moved out of the potato into the salty water.', 0],
      ['Nekesa explains the raisin. ' + STEP, 'A raisin is dried fruit.', 'Its skin acts as a membrane.', 'In plain water it shrinks.', 'Water moves into it, so it swells.', 2],
      ['Juma explains hot and cold water. ' + STEP, 'Particles are always moving.', 'Dye spreads by diffusion.', 'It spreads faster in cold water.', 'It spreads faster in hot water; particles move faster.', 3],
      ['Rehema explains a fair test. ' + STEP, 'She used strips of the same size.', 'She used the same potato.', 'The strip in salty water went soft because salt soaked in.', 'It went soft because water left it by osmosis.', 0],
    ]),

  ...T('mm', 'LIVING.REPRODUCTION_IN_HUMAN_BE.MENSTRUAL_MANAGE', M('MM_STAY_HOME', 'MM_ONE_PAD_DAY', 'MM_SEVERE_NORMAL', 'MM_SECRET'),
    ['Think about staying clean and comfortable, staying in school, and who can help.', 'Change a pad every four to six hours, bathe daily, carry a spare, keep going to school, talk to a trusted adult or the school nurse, and see a health worker for severe pain or very heavy bleeding.'], [
      ['How often is a sanitary pad changed?', 'Every four to six hours', 'Once a day|1', 'Once in two days|1', 'Only at bedtime|1'],
      ['A girl\'s period starts at school. What should she do?', 'Use a pad and carry on with school', 'Go home for the whole week|0', 'Tell no one at all|3', 'Use one pad all day|1'],
      ['Pain is so strong that a girl cannot walk. What should she do?', 'See a health worker', 'Nothing, all periods are painful|2', 'Stay home and tell no one|3', 'Use one pad all day|1'],
      ['Who can a girl talk to about her period?', 'A parent or the school nurse', 'No one, it must stay secret|3', 'Only her classmates|3', 'Nobody until it stops|0'],
      ['Which belongs in a plan for the days of a period?', 'A spare pad in the school bag', 'Missing school every month|0', 'One pad for the whole day|1', 'Ignoring very heavy bleeding|2'],
    ], [
      ['Amina\'s period starts during a maths lesson and she has no pad. What is a good plan?', 'Ask the school nurse for a pad', 'Go home and stay away for a week|0', 'Tell nobody and wait|3', 'Use one pad all day tomorrow|1'],
      ['Mercy uses one pad from morning until night to save pads. What is the problem?', 'Change it every four to six hours', 'Nothing, once a day is fine|1', 'She should stay at home|0', 'She must keep it secret|3'],
      ['Wanjiku bleeds so heavily that she soaks a pad every hour and feels dizzy. What should she do?', 'See a health worker', 'Nothing, it is normal|2', 'Stay home and tell no one|3', 'Use one pad for the day|1'],
      ['Esther thinks she must miss school every month during her period. What can she do instead?', 'Carry pads and keep going to school', 'Stay home for the week|0', 'Keep it secret from all adults|3', 'Ignore any severe pain|2'],
      ['Some boys tease a girl about her period. Who should she tell?', 'A trusted adult such as a teacher', 'No one, it must stay secret|3', 'She should stay home instead|0', 'Nobody, teasing is normal|2'],
    ], [
      ['Halima explains her plan. ' + STEP, 'She keeps a spare pad in her bag.', 'She bathes every day.', 'She changes her pad only once a day.', 'Change it every four to six hours.', 1],
      ['Nyokabi explains missing school. ' + STEP, 'Her period started on Monday.', 'She had cramps.', 'So she stayed home for the whole week.', 'Use a pad, rest if needed and keep going to school.', 0],
      ['Zainabu explains severe pain. ' + STEP, 'Some cramps are common.', 'A warm drink and rest help.', 'Pain that stops her walking is normal too.', 'Severe pain or very heavy bleeding needs a health worker.', 2],
      ['Joyce explains who to talk to. ' + STEP, 'Periods are a normal part of growing up.', 'She had questions.', 'She decided she must never talk to any adult about it.', 'Talk to a trusted adult: a parent, the nurse or a female teacher.', 3],
      ['Rose explains staying clean. ' + STEP, 'She uses a clean pad or cloth.', 'She washes her hands after changing.', 'She keeps one pad on all day to save money.', 'Change every four to six hours, or more often if heavy.', 1],
    ]),
];
