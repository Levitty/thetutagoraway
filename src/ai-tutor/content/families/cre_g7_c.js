// ============================================================================
// CRE GRADE 7, C (5 skills): human sexuality, marriage and family, alcohol and drug abuse, gambling and social media. Written offline.
// Sensitive topics: knowledge and safe, caring responses only, never details; every unsafe case points to a trusted adult. Every wrong
// answer names the library misconception it reveals. All stay reviewed:false until a CRE teacher signs them off.
// ============================================================================
import { S } from './cre_g7_lib.js';
const HS = 'CHRIST.HUMAN_SEXUALITY.', MF = 'CHRIST.CHRISTIAN_MARRIAGE_AND_F.', AD = 'CHRIST.ALCOHOL_DRUGS_AND_SUBSTA.', GA = 'CHRIST.GAMBLING.', SM = 'CHRIST.SOCIAL_MEDIA.';

export const FAMILIES = [
  ...S('sb', HS, 'SEXUALITY_BASICS', ['SB_SHAME', 'SB_HEALTHY', 'SB_PART'], ['Tell a trusted adult if you feel unsafe.', 'Healthy relationships have respect and honesty.'], [
    ['What should a child do if someone makes them feel unsafe?', 'Tell a trusted adult', 'Keep it a secret', 'Say nothing for ever', 'Hide from everyone'],
    ['Which is part of a healthy relationship?', 'Respect and honesty', 'Pressure', 'Secrets that hurt', 'Insults'],
    ['What is human sexuality?', 'Part of who we are as male and female', 'Only the body parts', 'A shameful secret', 'A game'],
    ['Which shows an unhealthy relationship?', 'Being forced or insulted', 'Being respected', 'Being listened to', 'Being treated kindly'],
    ['Who is a trusted adult?', 'A parent, teacher or pastor you trust', 'A stranger you met online last week', 'Anyone who asks you to keep secrets', 'Anyone who gives you gifts and money'],
  ], [
    ['A friend pressures Ann to keep a secret that makes her uneasy. What should Ann do?', 'Tell a trusted adult', 'Keep the secret', 'Pressure someone else', 'Run away'],
    ['A boy says insulting words to a girl at school. What kind of relationship is this?', 'An unhealthy one', 'A healthy one', 'A kind one', 'A respectful one'],
    ['Which words describe a healthy friendship?', 'Respect, honesty and trust', 'Force and secrecy', 'Pressure and insults', 'Fear and silence'],
    ['A learner says sexuality is only about the body. What is a better answer?', 'It is part of who we are as male and female', 'He is right, it is only about the body', 'It is a joke to laugh at in class', 'It is a secret to never speak of'],
    ['A child feels afraid after a touch that was not right. What should she do?', 'Tell a parent or teacher she trusts', 'Say nothing and keep it to herself', 'Blame herself for what happened', 'Hide it from everyone she knows'],
  ], [
    ['Which step is the mistake?', 'Step 1: A child may feel unsafe.', 'Step 2: A trusted adult can help.', 'Step 3: So the child should keep it secret.', 'The child should tell a trusted adult.', 2],
    ['Which step is the mistake?', 'Step 1: Healthy relationships have respect.', 'Step 2: They also have honesty.', 'Step 3: So pressure is part of them.', 'Pressure is not healthy.', 2],
    ['Which step is the mistake?', 'Step 1: We are made male and female.', 'Step 2: Sexuality is part of who we are.', 'Step 3: So it is only the body.', 'It is part of who we are.', 2],
    ['Which step is the mistake?', 'Step 1: Unhealthy relationships hurt.', 'Step 2: Force and insults are signs.', 'Step 3: So we should stay and say nothing.', 'We should tell a trusted adult.', 2],
    ['Which step is the mistake?', 'Step 1: A trusted adult listens.', 'Step 2: Parents and teachers can be trusted.', 'Step 3: So any stranger online can be trusted.', 'Strangers online are not trusted.', 2],
  ], ['a', 'b', 'c']),
  ...S('mf', MF, 'MARRIAGE_FAMILY', ['MF_GENESIS', 'MF_VALUE', 'MF_LASTING'], ['Genesis 2:24: a man is joined to his wife and they become one.', 'Love and forgiveness keep a family stable.'], [
    ['What does Genesis 2:24 say a man does?', 'Is joined to his wife', 'Leaves his wife', 'Ignores his wife', 'Sends away his wife'],
    ['Which value keeps a family stable?', 'Love and forgiveness', 'Selfishness', 'Anger', 'Lies'],
    ['How did God plan marriage?', 'To be a lasting union', 'To last a short time', 'To last one year', 'To be a game'],
    ['Which helps a family live well together?', 'Sharing duties', 'Refusing to help', 'Shouting', 'Staying silent'],
    ['Who started the family, according to the Bible?', 'God', 'Kings', 'Soldiers', 'Merchants'],
  ], [
    ['A family forgives a member who made a mistake. Which value is this?', 'Forgiveness', 'Anger', 'Pride', 'Selfishness'],
    ['A couple promise to stay together for life. What does the Bible say of marriage?', 'It is meant to last', 'It is meant for a day', 'It is a game', 'It is a job'],
    ['A family shares the work at home. What does this show?', 'Cooperation', 'Laziness', 'Selfishness', 'Anger'],
    ['A learner says the Bible does not speak about families. What can you say?', 'It teaches about marriage and family', 'He is right', 'It is silent', 'It only speaks about kings'],
    ['A family prays together and respects each other. What does this build?', 'A stable family', 'A weak family', 'A hungry family', 'A lonely family'],
  ], [
    ['Which step is the mistake?', 'Step 1: Genesis 2:24 speaks of marriage.', 'Step 2: A man is joined to his wife.', 'Step 3: So he leaves her.', 'He is joined to his wife.', 2],
    ['Which step is the mistake?', 'Step 1: Families have problems.', 'Step 2: Forgiveness helps.', 'Step 3: So anger keeps families stable.', 'Forgiveness keeps families stable.', 2],
    ['Which step is the mistake?', 'Step 1: God planned marriage.', 'Step 2: It is a union.', 'Step 3: So it should be short.', 'It is meant to last.', 2],
    ['Which step is the mistake?', 'Step 1: Family members have duties.', 'Step 2: They should share them.', 'Step 3: So one person does everything.', 'Duties are shared.', 2],
    ['Which step is the mistake?', 'Step 1: The family is sacred.', 'Step 2: God ordained it.', 'Step 3: So it should not be respected.', 'It should be respected.', 2],
  ], ['a', 'b', 'c']),
  ...S('da', AD, 'DRUGS_ABUSE', ['DA_DRUG', 'DA_EFFECT', 'DA_REFUSE'], ['Bhang, alcohol, miraa and tobacco are abused.', 'Refuse and tell a trusted adult.'], [
    ['Which is a drug abused by young people?', 'Bhang', 'Water', 'Milk', 'Tea'],
    ['Which is an effect of drug abuse?', 'Poor health and school work', 'Better health', 'More friends always', 'Better sleep always'],
    ['What should you do if a friend offers drugs?', 'Refuse and tell a trusted adult', 'Take them to fit in', 'Hide them', 'Share them'],
    ['Why do some young people try drugs?', 'Peer pressure', 'Good advice', 'Healthy food', 'Exercise'],
    ['Which is a substance often abused?', 'Alcohol', 'Water', 'Maize', 'Milk'],
  ], [
    ['A classmate offers Peter a cigarette. What should he do?', 'Refuse and tell a trusted adult', 'Accept to be liked', 'Hide it', 'Share it'],
    ['A father spends money on alcohol and the family goes hungry. What effect is this?', 'Family suffering', 'Family wealth', 'Family joy', 'Family health'],
    ['Why is drug abuse dangerous?', 'It harms health and school work', 'It makes you stronger in every way', 'It makes you smarter at your lessons', 'It saves money for the whole family'],
    ['A learner says drugs are harmless. What can you say?', 'They harm the body and family', 'He is right, they harm no one', 'They are healthy for the whole body', 'They help a learner do well at school'],
    ['Where can a young person get help to stay drug-free?', 'From a parent, teacher or pastor', 'From the dealer who sells the drugs', 'From a stranger met on the road', 'From a friend who uses drugs too'],
  ], [
    ['Which step is the mistake?', 'Step 1: Friends may offer drugs.', 'Step 2: Refusing is hard but right.', 'Step 3: So we should accept to fit in.', 'We should refuse.', 2],
    ['Which step is the mistake?', 'Step 1: Drugs affect health.', 'Step 2: They also affect school work.', 'Step 3: So they improve health.', 'They harm health.', 2],
    ['Which step is the mistake?', 'Step 1: Young people face pressure.', 'Step 2: A trusted adult can help.', 'Step 3: So we should keep it hidden.', 'We should tell a trusted adult.', 2],
    ['Which step is the mistake?', 'Step 1: Alcohol is abused.', 'Step 2: It harms families.', 'Step 3: So it is safe for children.', 'It is not safe for children.', 2],
    ['Which step is the mistake?', 'Step 1: Bhang is an illegal drug.', 'Step 2: It harms the mind.', 'Step 3: So it is a good gift.', 'It is harmful.', 2],
  ], ['a', 'b', 'c']),
  ...S('gm', GA, 'GAMBLING', ['GM_TYPE', 'GM_EFFECT', 'GM_WEALTH'], ['Betting money on a game is gambling.', '1 Timothy 6:10 warns about the love of money.'], [
    ['Which is gambling?', 'Betting on a game', 'Farming', 'Teaching', 'Cooking'],
    ['Which is an effect of gambling?', 'Debt and family quarrels', 'Savings grow', 'Peace at home', 'More friends always'],
    ['What does 1 Timothy 6:10 warn about?', 'The love of money', 'Working hard', 'Giving to the poor', 'Planting crops'],
    ['Why do some people gamble?', 'They want quick money', 'They want exercise', 'They want to study', 'They want to sleep'],
    ['What does the Bible teach about work?', 'Earn money honestly', 'Win money by tricks', 'Never work', 'Steal when poor'],
  ], [
    ['A man bets his salary on a football match. What is this?', 'Gambling', 'Farming', 'Saving', 'Giving'],
    ['A family loses its rent money to betting. What is the effect?', 'Debt and quarrels', 'More money', 'Better health', 'Peace'],
    ['A teacher reads "the love of money is a root of all kinds of evil". Where is this?', '1 Timothy 6:10', 'Genesis 1:1', 'John 3:16', 'Psalm 23'],
    ['A friend says gambling is a quick way to get rich. What can you say?', 'It often leads to debt', 'He is right', 'It always pays', 'It is a job'],
    ['A farmer works hard and sells his crops honestly. What does this show?', 'True riches come with honest work', 'Gambling is better', 'Work is useless', 'Money is everything'],
  ], [
    ['Which step is the mistake?', 'Step 1: Betting is gambling.', 'Step 2: It can lead to debt.', 'Step 3: So it always makes people rich.', 'It often leads to debt.', 2],
    ['Which step is the mistake?', 'Step 1: Gambling hurts families.', 'Step 2: It causes quarrels.', 'Step 3: So it brings peace at home.', 'It causes quarrels.', 2],
    ['Which step is the mistake?', 'Step 1: The Bible speaks about money.', 'Step 2: It warns about loving money.', 'Step 3: So it says money is the root of true happiness.', 'It warns about the love of money.', 2],
    ['Which step is the mistake?', 'Step 1: People want quick money.', 'Step 2: Some turn to betting.', 'Step 3: So betting is honest work.', 'Betting is not honest work.', 2],
    ['Which step is the mistake?', 'Step 1: True riches are more than money.', 'Step 2: Faith and family matter.', 'Step 3: So money alone is the true riches.', 'True riches are not money alone.', 2],
  ], ['a', 'b', 'd']),
  ...S('sm', SM, 'SOCIAL_MEDIA', ['SM_PLATFORM', 'SM_BULLY', 'SM_PRIVATE'], ['WhatsApp, Facebook, TikTok and YouTube are platforms.', 'Save the message and tell a trusted adult about bullying.'], [
    ['Which is a social media platform?', 'WhatsApp', 'A calculator', 'A ruler', 'A book'],
    ['What should you do about cyberbullying?', 'Save it and tell a trusted adult', 'Reply with insults', 'Join in', 'Delete everything and say nothing'],
    ['Which is responsible use of social media?', 'Keeping private information safe', 'Sharing others\' pictures freely', 'Posting hurtful words', 'Sharing passwords'],
    ['Which is misuse of social media?', 'Spreading false news', 'Sharing kind words', 'Keeping time limits', 'Protecting privacy'],
    ['Which habit is responsible?', 'Using kind words online', 'Posting in anger', 'Sharing a friend\'s secrets', 'Chatting all night'],
  ], [
    ['Someone sends Amina insulting messages. What should she do?', 'Save them and tell a trusted adult', 'Insult them back in the same way', 'Join the group that sends them', 'Ignore it for ever and say nothing'],
    ['A learner posts a classmate\'s picture to mock them. What is this?', 'Cyberbullying', 'Kindness', 'Sharing', 'Respect'],
    ['A friend asks for your password. What should you do?', 'Keep it private', 'Give it', 'Post it', 'Sell it'],
    ['False news spreads on a group chat. What is a good response?', 'Check before sharing', 'Share to all', 'Add to it', 'Believe it all'],
    ['A youth uses social media for a Bible study group. What is this?', 'Responsible use', 'Misuse', 'Waste', 'Bullying'],
  ], [
    ['Which step is the mistake?', 'Step 1: WhatsApp is a platform.', 'Step 2: It is used to chat.', 'Step 3: So a calculator is a platform too.', 'A calculator is not a platform.', 2],
    ['Which step is the mistake?', 'Step 1: Cyberbullying hurts.', 'Step 2: A trusted adult can help.', 'Step 3: So we should reply with insults.', 'We should save it and tell a trusted adult.', 2],
    ['Which step is the mistake?', 'Step 1: Private information is personal.', 'Step 2: It should be protected.', 'Step 3: So we may share it freely.', 'We keep it private.', 2],
    ['Which step is the mistake?', 'Step 1: False news can spread fast.', 'Step 2: It can hurt people.', 'Step 3: So we should share it quickly.', 'We should check before sharing.', 2],
    ['Which step is the mistake?', 'Step 1: Social media can be used well.', 'Step 2: Kind words help.', 'Step 3: So any post is fine.', 'We choose kind words.', 2],
  ], ['a', 'b', 'c', 'd']),
];
