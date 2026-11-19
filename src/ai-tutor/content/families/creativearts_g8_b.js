// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 8, THE TWO DEPTH-PASS SKILLS AWAITING FAMILIES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md):
// three-four time, and analysing a verse performance and a Kenyan folk dance. Clapping, singing and dancing stay with the
// teacher (KICD rubric); the app asks the beats, the terms and the evidence. Every wrong answer names the library misconception
// it reveals. All stay reviewed:false until a Creative Arts teacher signs them off.
// ============================================================================
import { T } from './creativearts_g8_lib.js';

const M = (...s) => s.map(x => `M_CA8_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('tf', 'CREATI.RHYTHM.THREE_FOUR', M('TF_STRONG_LAST', 'TF_MARCH', 'TF_BAR_COUNT', 'TF_TOP_NUMBER'),
    ['Count the crotchet beats in each bar and say which one is strong.', 'Three-four time has three crotchet beats in every bar, the first one strong (STRONG weak weak); it suits a waltz, and a dotted minim fills a bar.'], [
      ['How many crotchet beats are in each bar of three-four time?', 'Three', 'Four|3', 'Two|3', 'It can change from bar to bar|2'],
      ['Which beat of a three-four bar is strong?', 'The first', 'The third|0', 'The second|0', 'All three equally|0'],
      ['Which dance suits three-four time?', 'A waltz', 'A march|1', 'A military parade step|1', 'A two-step march|1'],
      ['In three-four time, what does the lower 4 tell you?', 'The beat is a crotchet', 'There are four beats in a bar|3', 'The fourth beat is strong|0', 'Bars can have four or three beats|2'],
      ['Which single note fills a whole bar of three-four?', 'A dotted minim', 'A semibreve of four beats|3', 'A crotchet|2', 'A minim of two beats|2'],
    ], [
      ['Nyokabi claps a three-four song and stresses the last beat of each bar. How should she clap it?', 'Strong on the first beat', 'Strong on the third beat|0', 'Strong on every beat|0', 'Four claps a bar|3'],
      ['The school band wants a three-four tune for marching on Madaraka Day. What will the music teacher say?', 'Three-four suits a waltz, not a march', 'It is the best time for a march|1', 'Only the third beat is strong|0', 'It has four beats a bar|3'],
      ['Kamau writes a four-bar rhythm in three-four. His bars have 3, 4, 3 and 2 beats. What is wrong?', 'Every bar must have three beats', 'Nothing, bars can change|2', 'The last beat must be strong|0', 'Each bar needs four beats|3'],
      ['Achieng sees 3 over 4 and says there are four beats in each bar. What does it mean?', 'Three crotchet beats in each bar', 'Four beats in each bar|3', 'Strong on the fourth beat|0', 'A march rhythm|1'],
      ['A choir sings a slow waltz-like lullaby. The conductor counts ONE two three. Which time is it?', 'Three-four time', 'Four-four march time|1', 'Time with the stress on three|0', 'Time where bars can change|2'],
    ], [
      ['Wekesa explains three-four time. ' + STEP, 'There are three beats in a bar.', 'Each beat is a crotchet.', 'The strong beat is the third.', 'The first beat of each bar is strong.', 0],
      ['Mwende explains where three-four is used. ' + STEP, 'It has a STRONG weak weak pattern.', 'It sways like a waltz.', 'So it is best for a march.', 'It suits a waltz; marches use two or four beats.', 1],
      ['Ali checks his rhythm. ' + STEP, 'He wrote it in three-four.', 'Bar 1 has three beats.', 'Bar 2 may have four beats, since bars can change.', 'Every bar in three-four has three beats.', 2],
      ['Esther reads a time signature. ' + STEP, 'The time signature is 3 over 4.', 'The lower 4 means the beat is a crotchet.', 'The top number is the note value.', 'The top 3 is the number of beats in each bar.', 3],
      ['Kibet fills a bar. ' + STEP, 'A bar of three-four holds three crotchets.', 'A dotted minim lasts three beats.', 'So a semibreve also fits one bar.', 'A semibreve has four beats; it is too long.', 2],
    ]),

  ...T('an8', 'APPREC.ANALYSIS_OF_CREATIVE_ART.ANALYSIS', M('AN_OPINION_ONLY', 'AN_FORMATION_COSTUME', 'AN_MESSAGE_TOPIC', 'AN_COMMUNITY_GUESS'),
    ['Use the right term, and back it with something seen or heard.', 'Analysis gives evidence, not only praise; a circle of dancers is a formation, not a costume; a message is what the verse says about its topic; a community is named from steps, songs, instruments, language and occasion together.'], [
      ['Which is an analysis of a verse performance?', 'The repeated line stresses the message', 'It was good and I enjoyed it a lot|0', 'Its topic is trees and rivers|2', 'The dancers wore green|1'],
      ['Dancers stand in a circle. What is the circle called?', 'Their formation', 'Their costume|1', 'Their props|1', 'Their message|2'],
      ['A verse is about trees. What is its message?', 'We must plant and protect trees', 'Trees, the topic of the verse|2', 'It was a good verse|0', 'The dancers wore green|1'],
      ['How is a folk dance\'s community best identified?', 'From its steps, songs and occasion', 'From the colour of the costume only|3', 'From whether it was good|0', 'From the dancers\' formation alone|1'],
      ['Which is a language feature in a verse?', 'A simile, as strong as a lion', 'The circle the dancers make|1', 'A red costume|3', 'It was nice|0'],
    ], [
      ['After a verse on drought, Kendi writes: It was good. What should she add?', 'Evidence, such as the repeated line', 'Nothing, saying it was good is enough|0', 'That its topic is water|2', 'The colour of the costume|3'],
      ['Grade 8 watch the Isukuti dance. Otieno writes that the dancers\' costume was a big circle. Which term should he use?', 'Formation', 'Costume|1', 'Message|2', 'Community|3'],
      ['A verse is called Our River. Asked for its message, Wambui writes: a river. What is a better answer?', 'We must keep our river clean', 'A river, its topic|2', 'It was good|0', 'They wore blue|3'],
      ['Dancers wear red shukas, and Juma says it must be a Maasai dance. How should he decide?', 'From steps, songs and occasion', 'From the red colour alone|3', 'From whether he liked it|0', 'From the circle shape alone|1'],
      ['A verse says "my mother is a candle in the dark". Which feature should Halima name?', 'A metaphor', 'A costume|1', 'The topic only|2', 'It was lovely|0'],
    ], [
      ['Faith analyses a verse. ' + STEP, 'Its topic is clean water.', 'The line we need water is repeated.', 'My last point is simply that it was good.', 'Back each point with evidence, not only praise.', 0],
      ['Kioko analyses a dance. ' + STEP, 'It is performed at a harvest.', 'Drums keep the beat.', 'The dancers\' costume is a moving circle.', 'The circle is the formation; the costume is what they wear.', 1],
      ['Rehema writes about a verse. ' + STEP, 'The reciter used gestures.', 'She changed her voice for the sad part.', 'The message of the verse is trees.', 'Trees is the topic; the message is we must plant and protect them.', 2],
      ['Daudi identifies a dance. ' + STEP, 'He watched the steps.', 'He listened to the song.', 'He named the community from the costume colour only.', 'Use the steps, songs, instruments, language and occasion together.', 3],
      ['Joy analyses a verse. ' + STEP, 'It uses the simile as tall as a tree.', 'It repeats one line for stress.', 'Its message is simply the word hope.', 'A message is a statement, such as never give up hope.', 2],
    ], ['b', 'd', 'b']),
];
