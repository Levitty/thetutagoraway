// ============================================================================
// SOCIAL STUDIES GRADE 8, THE TWO DEPTH-PASS SKILLS AWAITING FAMILIES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): climate change
// and its effects, and communicating effectively on human rights issues. Every wrong answer names the library misconception it
// reveals. Reporting lines (teacher, chief, children's office, Childline 116, KNCHR) are for the teacher to confirm.
// All stay reviewed:false until a Social Studies teacher signs them off.
// ============================================================================
import { T } from './socialstudies_g8_lib.js';

const M = (...s) => s.map(x => `M_G8_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('cc', 'NATURA.WEATHER_AND_CLIMATE.CLIMATE_CHANGE', M('CC_WEATHER_SAME', 'CC_TREES_CAUSE', 'CC_FARMERS_NONE', 'CC_NOTHING_TO_DO'),
    ['Think about the usual weather over many years, what causes the change, and who feels it.', 'Climate change is a long-term change in the usual weather, caused by burning fuels and cutting forests; it dries rivers and fails crops; planting trees, saving energy and harvesting water help.'], [
      ['What is climate change?', 'A change in the usual weather over many years', 'One very hot day|0', 'A single heavy storm|0', 'Planting many trees|1'],
      ['Which is a cause of climate change?', 'Cutting down forests', 'Planting trees|1', 'Harvesting rain water|3', 'One cold morning|0'],
      ['How can climate change affect farmers?', 'Crops fail and pasture is lost', 'It does not affect them|2', 'It always brings better harvests|2', 'Only city people feel it|2'],
      ['What can a learner do about climate change?', 'Plant trees and save energy', 'Nothing at all|3', 'Burn more charcoal|1', 'Wait for one cool day|0'],
      ['Which is an effect of climate change in Kenya?', 'Longer droughts in the north', 'Planting more trees|1', 'Nothing changes for herders|2', 'One rainy afternoon|0'],
    ], [
      ['It rains heavily in Kisumu for one afternoon. Odhiambo says this is climate change. Is he right?', 'No, one storm is weather', 'Yes, any storm is climate change|0', 'Yes, because trees caused it|1', 'It does not matter to anyone|2'],
      ['A school club plants 500 trees. A learner says this will make climate change worse. What is true?', 'Trees help reduce it', 'Trees cause climate change|1', 'Nothing a club does helps|3', 'One planting is the same as weather|0'],
      ['Herders in Turkana find the dry seasons are getting longer and the pasture is gone. Which effect is this?', 'Climate change affecting livelihoods', 'It cannot affect herders|2', 'A single hot day|0', 'Caused by planting trees|1'],
      ['Wanjiku says one person can do nothing about climate change. What could she do?', 'Harvest water and save energy at home', 'Nothing at all|3', 'Cut trees for charcoal|1', 'Wait for one rainy day|0'],
      ['Rain in Machakos no longer comes when farmers expect it. Which response helps them most?', 'Plant drought-resistant crops', 'Do nothing, it does not affect them|2', 'Cut the hillside trees|1', 'Hope it is one bad day|0'],
    ], [
      ['Kibet explains climate change. ' + STEP, 'Weather is the condition of the air on a day.', 'Climate is the usual weather over many years.', 'So one very hot day means the climate has changed.', 'Climate change is a long-term change, not one day.', 0],
      ['Achieng explains causes. ' + STEP, 'Burning fuels adds gases to the air.', 'Cutting forests also adds to it.', 'Planting trees is another cause.', 'Trees take in carbon dioxide and help reduce it.', 1],
      ['Musa explains effects. ' + STEP, 'Rivers dry up in long droughts.', 'Floods are heavier in some places.', 'Farmers are not affected.', 'Crops fail and animals lose pasture.', 2],
      ['Faith explains responses. ' + STEP, 'Climate change is a big problem.', 'Countries make plans to fight it.', 'So individuals can do nothing.', 'People can plant trees, save energy and harvest water.', 3],
      ['Juma explains a county plan. ' + STEP, 'The county gives drought-resistant seed.', 'It warns farmers early of drought.', 'It also clears the forest on the hills to farm more.', 'Clearing forests adds to climate change; keep and plant trees.', 1],
    ], ['e', 'd', 'd']),

  ...T('hc', 'POLITI.HUMAN_RIGHTS.HR_COMMUNICATE', M('HC_RUMOUR', 'HC_SHOUT', 'HC_NO_FOLLOWUP', 'HC_WRONG_CHANNEL'),
    ['Think about facts first, the right person to tell, how you speak, and what happens after.', 'Get the facts, tell someone who can act (a teacher, the chief, the children\'s office, Childline 116), speak calmly with evidence, listen, and follow up.'], [
      ['What is the first step in raising a human rights issue?', 'Get the facts', 'Spread it as a rumour|0', 'Shout at the people involved|1', 'Tell a friend who keeps secrets|3'],
      ['How should you speak when raising a rights issue?', 'Clearly and calmly, with the facts', 'Shout and threaten|1', 'Through village gossip|0', 'Say nothing after reporting|2'],
      ['A child is being kept out of school to work. Who can act on it?', 'The chief or the children\'s office', 'A friend who keeps secrets|3', 'Everyone at the market, as gossip|0', 'Nobody after one report|2'],
      ['What do you do after reporting a rights issue?', 'Follow up politely', 'Forget it|2', 'Shout until they act|1', 'Tell it as a rumour|0'],
      ['Which free number can a child call about abuse?', 'Childline 116', 'A secret friend\'s phone|3', 'The village gossip|0', 'No one, it is finished once said|2'],
    ], [
      ['Kioko hears that a neighbour\'s child is beaten every day. He wants to tell the whole village as gossip. What is better?', 'Tell a teacher the facts', 'Spread it in the village|0', 'Shout at the neighbour|1', 'Tell only a secret friend|3'],
      ['At a baraza, Wekesa shouts and threatens the chief about a land issue. Nobody listens. What should he do?', 'Speak calmly, with facts', 'Shout louder|1', 'Spread rumours instead|0', 'Give up and forget it|2'],
      ['Mumbi reported a child labour case to the children\'s office a month ago. Nothing has happened. What should she do?', 'Follow it up politely', 'Forget about it|2', 'Shout at the office staff|1', 'Tell it as gossip|0'],
      ['Zainabu is being harassed by an adult. She tells only her best friend, who promises to keep it secret. What is better?', 'Tell a trusted adult', 'Keep it with her friend|3', 'Post rumours online|0', 'Shout at the adult|1'],
      ['A class wants to raise the issue of a broken school toilet that girls cannot use. Which order is right?', 'Facts, office, calm, follow up', 'Shout first, facts later|1', 'Gossip, then forget it|0', 'Tell a secret friend only|3'],
    ], [
      ['Brian explains how he raised a rights issue. ' + STEP, 'He found out the facts.', 'He went to the head teacher.', 'He shouted and threatened so she would listen.', 'Speak clearly and calmly with the facts.', 1],
      ['Wairimu explains reporting. ' + STEP, 'A girl was married off at 14.', 'Wairimu knew it was wrong.', 'She told everyone in the village as gossip.', 'Tell a teacher, the chief or the children\'s office.', 0],
      ['Omar explains the last step. ' + STEP, 'He reported the issue to the chief.', 'The chief listened.', 'After that he forgot about it.', 'Follow up politely or go to another office.', 2],
      ['Lilian explains choosing who to tell. ' + STEP, 'A boy in her estate is not allowed to go to school.', 'She wanted to help.', 'She told a classmate who keeps secrets.', 'Tell someone who can act: a teacher, the chief or 116.', 3],
      ['Daudi explains the steps. ' + STEP, 'Get the facts.', 'Choose the right person or office.', 'Once it is reported, the job is finished.', 'Listen to the reply and follow up.', 2],
    ]),
];
