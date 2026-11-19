// ============================================================================
// CREATIVE ARTS AND SPORTS GRADE 7, ANALYSING A FOLK SONG AND A STORYTELLING PERFORMANCE (19 Nov 2026, HOREB_QUESTIONS_PLAN.md):
// the one depth-pass skill awaiting families. The app asks the terms and the evidence; watching and analysing a live performance
// stays with the teacher (KICD rubric). Every wrong answer names the library misconception it reveals. All stay reviewed:false.
// ============================================================================
import { T } from './creativearts_g7_lib.js';

const M = (...s) => s.map(x => `M_CA7_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('an', 'APPREC.ANALYSIS_OF_CREATIVE_ART.ANALYSIS', M('AN_OPINION_ONLY', 'AN_THEME_PLOT', 'AN_TYPE_FROM_TUNE', 'AN_TECHNIQUE_CONTENT'),
    ['Ask what the question wants: the type, the theme or the technique, and what you saw or heard that shows it.', 'Name a song\'s type from its occasion and words; a theme is the big idea, not the events; a technique is how the story is told; back each point with evidence.'], [
      ['Which is an analysis of a folk song, not only an opinion?', 'The soloist and chorus answer each other', 'I liked it very much|0', 'It was a nice song|0', 'It was fast, so it is a dance song|2'],
      ['What is the theme of a story?', 'The big idea or lesson it carries', 'The list of events in the order they happen|1', 'How loud the narrator spoke|3', 'Whether you enjoyed it|0'],
      ['How is the type of a folk song best found?', 'From its occasion and its words', 'Only from how fast it is|2', 'From whether you liked it|0', 'From the events of a story|1'],
      ['Which is a storytelling technique?', 'Changing the voice for each character', 'That the story is about a brave lion|3', 'The hare tricked the hyena|1', 'I enjoyed the story|0'],
      ['Which point about a storytelling performance gives evidence?', 'She paused before the end for suspense', 'It was a good story|0', 'It was about a clever hare|3', 'It was fast, so it was a dance piece|2'],
    ], [
      ['After a harvest song, Wekesa writes: I liked it. What should he add to make it an analysis?', 'What he heard that shows its type', 'Nothing, liking it is enough|0', 'The story of a hare|1', 'Only that it was fast, so a dance song|2'],
      ['In a story, the hare tricks the hyena and escapes. Mumbi is asked the theme. What should she say?', 'Cleverness can beat strength', 'The hare tricked the hyena and ran away|1', 'The narrator used a deep voice|3', 'She liked the ending|0'],
      ['A Luo song is sung while people work in the fields, with a quick beat. Juma calls it a dance song because it is fast. What type is it?', 'A work song', 'A dance song, because it is fast|2', 'It cannot be told, I liked it|0', 'A story about farming|1'],
      ['A narrator makes the audience sing a chorus each time the lion appears. Asked for a technique, Akinyi says: a story about a lion. What is the technique?', 'Audience participation', 'The story is about a lion|3', 'The lion was defeated|1', 'It was enjoyable|0'],
      ['A Kamba song is sung to welcome a newborn baby. What helps Kioko name its type?', 'The occasion: welcoming a baby', 'Only its speed|2', 'Only that he enjoyed it|0', 'The events of a folk tale|1'],
    ], [
      ['Wanjiru analyses a folk song. ' + STEP, 'It is sung by the Kikuyu at a wedding.', 'A soloist leads and the chorus replies.', 'It is very fast, so it must be a dance song.', 'Name the type from the occasion and words, not only the speed.', 2],
      ['Otieno writes about a story. ' + STEP, 'The characters are the tortoise and the birds.', 'The narrator used gestures for flying.', 'The theme is that the tortoise borrowed feathers and fell.', 'That is the plot; the theme is the lesson, such as greed brings a fall.', 1],
      ['Chebet analyses a storyteller. ' + STEP, 'The story is about a greedy hyena.', 'Its lesson is that greed is punished.', 'Her technique was that the story is about a hyena.', 'A technique is how it is told: voice, gesture, pause or audience participation.', 3],
      ['Hassan reviews a folk song. ' + STEP, 'It is a Mijikenda song for a harvest.', 'Drums and shakers keep the beat.', 'My final point is that it was nice, with no reason given.', 'Back each point with something heard or seen.', 0],
      ['Nduta analyses a lullaby. ' + STEP, 'It is sung to put a baby to sleep.', 'It is soft and slow.', 'Its theme is that the mother sang and the baby slept.', 'That is what happens; the message is love and care for the child.', 1],
    ], ['b', 'c', 'b']),
];
