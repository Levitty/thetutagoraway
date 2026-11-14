// ============================================================================
// ENGLISH GRADE 6, LISTENING COMPREHENSION on four original scripts: DRAFT families (14 Nov 2026, offline, no model call).
// A teacher or the voice tutor reads a script aloud; it is never shown. The problem carries `listening: { title, script }` and each family
// needs audio (needsAudio: true). Main idea, best title and a specific detail on the skill LISTEN.T1.MAIN_IDEA, which already maps the
// listening outcomes LISTEN.T2.b, T5.a and T11.c. Wrong answers carry the library codes (a detail taken as the main idea, too wide,
// not in the talk). Original text, Kenyan places; none copied or adapted. FLAG: a Kenyan English teacher checks every script before use.
// ============================================================================
import { eng, mc, feedbackOf, shuffle, pick } from './english_g6_lib.js';

export const LISTENS = [
  {
    id: 'market-notice', title: 'A Notice from the Market',
    script: 'Good morning, shoppers. This is a notice from Gikomba Market. From next Monday, the market will open at six in the morning, one hour earlier than now. Traders who sell vegetables should bring their goods before six. The market will close at five in the afternoon, as usual. Please keep the paths clear and put your rubbish in the bins.',
    main: ['What is the main idea of the notice.', 'The market will open one hour earlier from next Monday.', ['Vegetable sellers must bring their goods early.', 'M6_MAIN_DETAIL'], ['Markets are very busy places in many towns.', 'M6_MAIN_TOO_BROAD'], ['The market will move to a new town soon.', 'M6_MAIN_NOT_IN_TEXT'], 'The whole notice is about the earlier opening time.'],
    ttl: ['The Market Opens Earlier', ['Bins for Rubbish at the Gate', 'M6_MAIN_DETAIL'], ['All About Markets in Kenya', 'M6_MAIN_TOO_BROAD'], ['A New Market Is Built Soon', 'M6_MAIN_NOT_IN_TEXT'], 'The notice tells shoppers that the market opens earlier.'],
    detail: [
      ['At what time will the market open from next Monday.', 'six in the morning', ['seven in the morning', 'M_MAIN_DETAIL_FOR_ASKED'], ['five in the afternoon', 'M_MAIN_DETAIL_FOR_ASKED'], ['eight in the morning', 'M_MAIN_DETAIL_FOR_ASKED'], 'The notice says the market opens at six in the morning.'],
      ['What should shoppers put in the bins.', 'their rubbish', ['their coins', 'M_MAIN_DETAIL_FOR_ASKED'], ['their shopping lists', 'M_MAIN_DETAIL_FOR_ASKED'], ['their school books', 'M_MAIN_DETAIL_FOR_ASKED'], 'Shoppers are asked to put their rubbish in the bins.'],
    ],
  },
  {
    id: 'rain-walk', title: 'Wanjiru and the Heavy Rain',
    script: 'Last Saturday, Wanjiru walked to the river to fetch water. Dark clouds gathered, and soon heavy rain began to fall. She ran under a big mango tree, but the wind was strong, so she hurried to her aunt\'s house nearby. Her aunt gave her hot porridge and dry clothes. When the rain stopped, Wanjiru carried the water home safely.',
    main: ['What is the main idea of the story.', 'Wanjiru found shelter from the rain and then went home safely.', ['Wanjiru ran under a big mango tree for a while.', 'M6_MAIN_DETAIL'], ['Rain is always a problem for people who walk far.', 'M6_MAIN_TOO_BROAD'], ['Wanjiru won a prize for carrying water quickly.', 'M6_MAIN_NOT_IN_TEXT'], 'The whole story is about Wanjiru finding shelter and getting home.'],
    ttl: ['Wanjiru and the Heavy Rain', ['The Big Mango Tree by the Road', 'M6_MAIN_DETAIL'], ['Why People Fetch Water Every Day', 'M6_MAIN_TOO_BROAD'], ['Wanjiru Wins a Water Race', 'M6_MAIN_NOT_IN_TEXT'], 'The story is about Wanjiru and the rain that fell.'],
    detail: [
      ['Where did Wanjiru go to fetch water.', 'to the river', ['to the well', 'M_MAIN_DETAIL_FOR_ASKED'], ['to the borehole', 'M_MAIN_DETAIL_FOR_ASKED'], ['to the lake', 'M_MAIN_DETAIL_FOR_ASKED'], 'Wanjiru walked to the river to fetch water.'],
      ['What hot food did her aunt give her.', 'porridge', ['tea', 'M_MAIN_DETAIL_FOR_ASKED'], ['soup', 'M_MAIN_DETAIL_FOR_ASKED'], ['rice', 'M_MAIN_DETAIL_FOR_ASKED'], 'Her aunt gave her hot porridge and dry clothes.'],
    ],
  },
  {
    id: 'county-final', title: 'Sports News on the Radio',
    script: 'Here is the sports news. The Kisumu Under-13 girls\' football team won the county final on Sunday by three goals to one. The captain, Achieng, scored two goals. The coach said the girls practised four times a week. The team will now travel to Nairobi for the national games next month.',
    main: ['What is the main idea of the news.', 'A girls\' team won the county final and will go to the national games.', ['The captain, Achieng, scored two goals on Sunday.', 'M6_MAIN_DETAIL'], ['Football is the most popular sport in schools.', 'M6_MAIN_TOO_BROAD'], ['The girls\' coach was given a new car by the county.', 'M6_MAIN_NOT_IN_TEXT'], 'The news is about the win and the trip to the national games.'],
    ttl: ['Girls\' Team Wins County Final', ['Achieng Scores Two Goals', 'M6_MAIN_DETAIL'], ['Football in Every School', 'M6_MAIN_TOO_BROAD'], ['Coach Wins a New Car', 'M6_MAIN_NOT_IN_TEXT'], 'The news says the girls\' team won the county final.'],
    detail: [
      ['How many goals did Achieng score.', 'two', ['one', 'M_MAIN_DETAIL_FOR_ASKED'], ['three', 'M_MAIN_DETAIL_FOR_ASKED'], ['four', 'M_MAIN_DETAIL_FOR_ASKED'], 'The captain, Achieng, scored two goals.'],
      ['Where will the team travel next month.', 'Nairobi', ['Mombasa', 'M_MAIN_DETAIL_FOR_ASKED'], ['Eldoret', 'M_MAIN_DETAIL_FOR_ASKED'], ['Nakuru', 'M_MAIN_DETAIL_FOR_ASKED'], 'The team will travel to Nairobi for the national games.'],
    ],
  },
  {
    id: 'pencil-holder', title: 'Making a Pencil Holder',
    script: 'Class, today I will tell you how to make a pencil holder from an old tin. First, wash the tin and let it dry. Second, cover it with coloured paper. Third, glue the paper carefully and let it dry. Last, draw a pattern on the paper. You will use it on your desk, and you will help to reduce rubbish.',
    main: ['What is the main idea of the talk.', 'How to make a pencil holder from an old tin.', ['How to wash a tin and let it dry well.', 'M6_MAIN_DETAIL'], ['How to make anything out of waste materials.', 'M6_MAIN_TOO_BROAD'], ['How to build a desk from old wooden boxes.', 'M6_MAIN_NOT_IN_TEXT'], 'The whole talk explains how to make a pencil holder.'],
    ttl: ['Making a Pencil Holder from a Tin', ['Washing and Drying a Tin', 'M6_MAIN_DETAIL'], ['Ideas for Reducing All Rubbish', 'M6_MAIN_TOO_BROAD'], ['Building a Desk for Class', 'M6_MAIN_NOT_IN_TEXT'], 'The talk is about making a pencil holder from a tin.'],
    detail: [
      ['What is the first step.', 'wash the tin', ['cover it with paper', 'M_MAIN_DETAIL_FOR_ASKED'], ['draw a pattern', 'M_MAIN_DETAIL_FOR_ASKED'], ['glue the paper', 'M_MAIN_DETAIL_FOR_ASKED'], 'First, wash the tin and let it dry.'],
      ['What do you do last.', 'draw a pattern', ['wash the tin', 'M_MAIN_DETAIL_FOR_ASKED'], ['cover the tin', 'M_MAIN_DETAIL_FOR_ASKED'], ['glue the paper', 'M_MAIN_DETAIL_FOR_ASKED'], 'Last, draw a pattern on the paper.'],
    ],
  },
];

const Q = { main: null, ttl: 'Which title best fits the talk.', detail: null };
// A listening question to choose: one of the four scripts, one of its entries; the script rides on the problem as `listening`.
const listenChoose = (key, hints) => (cskill) => {
  const { p, e } = pick(LISTENS.flatMap(s => (key === 'detail' ? s.detail : [s[key]]).map(x => ({ p: s, e: x }))));
  const a = [...e], because = a.pop();
  const [q, right, wrongs] = key === 'ttl' ? [Q.ttl, a[0], a.slice(1)] : [a[0], a[1], a.slice(2)];
  const options = mc(right, shuffle(wrongs).slice(0, 3).map(([t, code]) => [t, feedbackOf(cskill, code), code]));
  if (!options) return null;
  return { listening: { title: p.title, script: p.script }, question: q, options, instruction: 'Listen to the talk. Then choose the best answer.', hints, steps: [because, `The answer is "${right}".`] };
};
const H = (a, b) => [a, b];
export const FAMILIES = [
  eng({ id: 'english6.listen.main', kind: 'listen-main-idea', cs: 'LISTEN.T1.MAIN_IDEA', oc: 'b', form: 'word', rung: 2, needsAudio: true, gen: listenChoose('main', H('The main idea covers the whole talk, not just one part.', 'Ask: what was everything you heard mostly about?')) }),
  eng({ id: 'english6.listen.title', kind: 'listen-title', cs: 'LISTEN.T1.MAIN_IDEA', oc: 'a', form: 'word', rung: 2, needsAudio: true, gen: listenChoose('ttl', H('A good title tells what the whole talk is about.', 'A title that names only a detail, or something wider, does not fit.')) }),
  eng({ id: 'english6.listen.detail', kind: 'listen-detail', cs: 'LISTEN.T1.MAIN_IDEA', oc: 'c', form: 'word', rung: 1, needsAudio: true, gen: listenChoose('detail', H('A detail question asks for one exact fact, such as a time, name or thing.', 'Think back to the exact words you heard.')) }),
];
