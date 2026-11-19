// ============================================================================
// CRE GRADE 7, MONEY, WEALTH AND TRUE RICHES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): the one depth-pass skill of the Gambling
// sub-strand awaiting families. Scriptures as KICD names them: 1 Timothy 6:10 and 6:17-19; Proverbs 13:11 and 28:20-22;
// Ephesians 4:28; Matthew 6:19-21; Hebrews 13:5. Wording follows the common English Bibles used in Kenyan schools (NIV, GNT);
// a CRE teacher confirms each verse. Every wrong answer names the library misconception it reveals. All stay reviewed:false.
// ============================================================================
import { T } from './cre_g7_lib.js';

const M = (...s) => s.map(x => `M_CR7_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('mr', 'CHRIST.GAMBLING.MONEY_RICHES', M('MR_MONEY_EVIL', 'MR_QUICK_RICH', 'MR_TREASURE_BANK', 'MR_THIEF_KEEP'),
    ['Read what the verse warns against, and what it asks a person to do.', 'The love of money, not money, is a root of evil; honest money grows little by little; work and share; be content; true riches are good deeds stored in heaven.'], [
      ['According to 1 Timothy 6:10, what is a root of all kinds of evil?', 'The love of money', 'Money itself|0', 'Saving money in a bank|2', 'Working for wages|3'],
      ['What does Proverbs 13:11 say about money gathered little by little?', 'It grows', 'It is too slow to be worth it|1', 'It is evil because it is money|0', 'It should be kept only in a bank|2'],
      ['In Matthew 6:19-21, what are treasures in heaven?', 'Good deeds and a life given to God', 'Money kept safe in a bank account|2', 'Riches won quickly by luck or betting|1', 'Having no money at all|0'],
      ['What does Ephesians 4:28 ask a person who used to steal to do?', 'Work honestly and share with the needy', 'Only stop stealing|3', 'Give away all money because it is evil|0', 'Try to get rich quickly|1'],
      ['What does Hebrews 13:5 teach about money?', 'Be content with what you have', 'Get rich as fast as you can|1', 'Money must never be touched|0', 'Store it all on earth|2'],
    ], [
      ['Kevin wins money from a betting app and says God has blessed him with quick riches. Which verse warns him?', 'Proverbs 28:20, the one eager to get rich', 'None, quick money is always a blessing|1', 'Matthew 6, put it in a bank|2', 'Ephesians 4:28, only stop stealing|3'],
      ['Wanjiru says a Christian should have no money at all, because money is evil. How would you correct her?', 'Loving money is the problem, not money', 'She is right, money itself is evil|0', 'Money is good only if won by luck|1', 'Money is safe once it is in a bank|2'],
      ['Mzee Otieno says his treasures in heaven are the savings in his account. What does Jesus mean instead?', 'Being rich in good deeds and giving', 'Money saved in a bank account|2', 'Owning no money at all, ever|0', 'Winning a big jackpot|1'],
      ['Musa used to steal chickens. Now he has stopped. What more does Ephesians 4:28 ask of him?', 'To work and share with those in need', 'Nothing more, stopping is enough for him|3', 'To give up money as evil|0', 'To bet to get rich quickly|1'],
      ['Achieng saves a little from her mandazi business every week. What does Proverbs 13:11 say will happen?', 'Her money will grow', 'It is wasted effort, too slow|1', 'It will make her evil|0', 'It only counts if kept in a bank|2'],
    ], [
      ['Faith explains 1 Timothy 6:10 to her class. ' + STEP, 'The verse speaks of money.', 'It warns about loving money.', 'So money itself is evil and a Christian should have none.', 'The love of money is a root of evil; money itself is not.', 0],
      ['Brian explains Proverbs 13:11. ' + STEP, 'Dishonest money dwindles away.', 'Money gathered little by little grows.', 'So saving slowly is wasted effort, and betting is better.', 'Honest saving little by little makes money grow.', 1],
      ['Grace explains Matthew 6:19-21. ' + STEP, 'Moths and thieves can destroy earthly riches.', 'Jesus says store treasures in heaven.', 'Treasures in heaven means money kept safely in a bank.', 'Treasures in heaven are good deeds and a life given to God.', 2],
      ['Peter explains Ephesians 4:28. ' + STEP, 'A thief must stop stealing.', 'He must work with his own hands.', 'After that he owes nothing to anyone else.', 'He works so that he has something to share with the needy.', 3],
      ['Nekesa explains 1 Timothy 6:17-19. ' + STEP, 'The rich should not hope in wealth.', 'They should hope in God.', 'Being rich in good deeds means having a lot of money saved.', 'Being rich in good deeds means doing good, being generous and sharing.', 2],
    ], ['c', 'e', 'c']),
];
