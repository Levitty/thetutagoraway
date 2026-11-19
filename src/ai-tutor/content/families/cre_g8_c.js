// ============================================================================
// CRE GRADE 8, THE FOUR DEPTH-PASS SKILLS AWAITING FAMILIES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): sin and temptation today
// (James 1:13-15; 1 John 2:16; 1 Corinthians 10:13; Matthew 26:41), covenants today (2 Corinthians 6:14-17; Exodus 23:32;
// Matthew 5:37; 1 John 4:1), teenage pregnancy, and threats to the sacredness of life.
// CHILD SAFETY, FOR THE TEACHER FIRST: the pregnancy and life-threat families never blame a victim of abuse, never describe
// methods, and always point to a trusted adult, a counsellor or Childline Kenya (116, free). A CRE teacher and the school
// counsellor confirm every line before any child sees it. Verses follow the NIV and GNT used in Kenyan schools.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false.
// ============================================================================
import { T } from './cre_g8_lib.js';

const M = (...s) => s.map(x => `M_CR8_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('st', 'CREATI.ORIGIN_AND_CONSEQUENCES_.SIN_TODAY', M('ST_GOD_TEMPTS', 'ST_DEVIL_ONLY', 'ST_NO_WAY_OUT', 'ST_TEMPTED_SINNED'),
    ['Read what the verse says about where temptation comes from and what God gives.', 'God tempts no one; each person is tempted by his own desire and is responsible; God gives a way out; being tempted is not sin, giving in is.'], [
      ['According to James 1:13, does God tempt anyone?', 'No, God tempts no one', 'Yes, to see if we fall|0', 'Only the devil decides for us|1', 'Yes, temptation is already sin|3'],
      ['James 1:14 says a person is tempted by what?', 'His own evil desire', 'God, to test him|0', 'The devil alone, so he is not to blame|1', 'Nothing he can resist|2'],
      ['What does 1 Corinthians 10:13 promise about temptation?', 'God gives a way out', 'Some cannot be resisted|2', 'God sends it to make us fall|0', 'Being tempted is already sin|3'],
      ['Jesus was tempted in the wilderness. Did he sin?', 'No; sin is giving in', 'Yes, being tempted is sin|3', 'Yes, God made him fall|0', 'He could not resist|2'],
      ['Which is a cause of sin today named in 1 John 2:16?', 'The desire of the eyes', 'God tempting people|0', 'Only the devil, never the person|1', 'Being tempted at all|3'],
    ], [
      ['Brian\'s friends dare him to steal from a kiosk. He says God put the temptation there. What does James 1:13 teach?', 'God tempts no one', 'God tempts to test us|0', 'The devil made him, so it is not his fault|1', 'He cannot resist it|2'],
      ['Wanjiru copied in an exam and says the devil made her do it. What does the Bible teach?', 'She chose, and she is responsible', 'The devil is fully to blame|1', 'God tempted her|0', 'Nobody can resist an exam|2'],
      ['Otieno says the pull to watch bad videos is too strong for him to resist. Which life skill and verse help?', 'Self-control; God gives a way out', 'None; it cannot be resisted|2', 'God sent it to test him|0', 'He has already sinned by being tempted|3'],
      ['Mercy feels tempted to lie to her mother and thinks she has already sinned, so she may as well lie. What is true?', 'Being tempted is not sin', 'Yes, she has already sinned|3', 'God tempted her|0', 'The devil is fully to blame|1'],
      ['Before the class trip, Kiprop knows some boys will bring alcohol. What does Matthew 26:41 tell him to do?', 'Watch and pray', 'Give in, it cannot be resisted|2', 'Blame the devil afterwards|1', 'Accept that God is testing him|0'],
    ], [
      ['Grace explains James 1:13-15. ' + STEP, 'Temptation comes to everyone.', 'Each person is tempted by his own desire.', 'God sends temptations to make people fall.', 'God tempts no one (James 1:13).', 0],
      ['Kevin explains who is to blame for sin. ' + STEP, 'The devil tempts people.', 'People still choose what they do.', 'So the devil is fully to blame and the person is not.', 'Each person is responsible for his choice.', 1],
      ['Atieno explains 1 Corinthians 10:13. ' + STEP, 'Temptation comes to all people.', 'God is faithful.', 'Some temptations are too strong, so giving in cannot be helped.', 'God gives a way out so we can stand.', 2],
      ['Daniel explains temptation and sin. ' + STEP, 'Jesus was tempted in the wilderness.', 'He answered with the word of God.', 'Being tempted is already a sin.', 'Jesus was tempted and did not sin; sin is giving in.', 3],
      ['Neema explains overcoming temptation. ' + STEP, 'She keeps good company.', 'She prays and stays watchful.', 'If she is tempted, she says God is testing her to fall.', 'God tempts no one; he helps us stand.', 0],
    ], ['c', 'd', 'c']),

  ...T('ct', 'THE_BI.ABRAHAMIC_COVENANT.COVENANTS_TODAY', M('CT_ALL_GOOD', 'CT_NOT_COVENANT', 'CT_SECRET_SAFE', 'CT_DISCERN_FEELING'),
    ['Ask whether the agreement is open, keeps God\'s law and harms no one.', 'Covenants today include marriage and work contracts; an ungodly covenant is secret, goes against God\'s law, controls or harms; test it by God\'s word and ask trusted, godly adults.'], [
      ['Which is a covenant in modern life?', 'Marriage vows', 'None, covenants were only in the Bible|1', 'A secret oath to a gang|0', 'A promise judged by excitement|3'],
      ['Which is a mark of an ungodly covenant?', 'It must be kept secret, even from parents', 'It is open and others know about it|2', 'It is a signed work contract|1', 'It keeps God\'s law|0'],
      ['How is a covenant tested, as 1 John 4:1 teaches?', 'Against God\'s word, with godly advice', 'By how much money it brings|3', 'By whether both people agreed|0', 'By keeping it secret|2'],
      ['Is every agreement good if both people agree?', 'No, not if it breaks God\'s law', 'Yes, agreeing makes it good|0', 'Yes, if it is secret|2', 'Yes, if it feels exciting|3'],
      ['Which is a covenant at work?', 'A signed employment contract', 'There are none today|1', 'An oath of total obedience to a boss|0', 'A deal judged by profit alone|3'],
    ], [
      ['A group at a youth camp asks Musa to swear a secret oath of total obedience to its leader. He agreed. Is it a good covenant?', 'No, it is ungodly', 'Yes, he agreed, so it is good|0', 'Yes, secrets keep it safe|2', 'Yes, if it pays well|3'],
      ['Wambui says covenants ended with Abraham and Moses. What can you tell her?', 'Marriage and contracts are covenants today', 'She is right, there are none|1', 'Only secret oaths are covenants|2', 'Only exciting deals count|3'],
      ['A man offers Juma money to join a group whose meetings he must hide from his parents and church. What warning sign is this?', 'The covenant must be kept secret', 'It is open and others know|2', 'Every agreement is good|0', 'It brings money, so it is fine|3'],
      ['Achieng is offered a deal that promises quick riches. Her friend says it must be good because it feels exciting. How should she judge it?', 'Test it by God\'s word and ask godly adults', 'By how exciting it feels|3', 'By whether she agrees|0', 'By keeping it secret|2'],
      ['A couple make their wedding vows before God and the church. Why is this covenant important?', 'It binds them to love and be faithful', 'It is not a covenant today|1', 'It matters only if kept secret|2', 'It matters only if it brings money|3'],
    ], [
      ['Peter explains covenants today. ' + STEP, 'God made covenants with Noah and Abraham.', 'A covenant is a binding agreement.', 'So there are no covenants in modern life.', 'Marriage vows and work contracts are covenants today.', 1],
      ['Faith explains a covenant offered to her. ' + STEP, 'A group asked her to swear loyalty.', 'She agreed to it.', 'Because she agreed, the covenant is good.', 'Agreeing does not make it good if it breaks God\'s law.', 0],
      ['Kamau explains secret oaths. ' + STEP, 'The group wanted him to swear an oath.', 'They said nobody must know.', 'Secret covenants are safer because no one can interfere.', 'Secrecy, even from parents and church, marks an ungodly covenant.', 2],
      ['Nekesa explains discerning a covenant. ' + STEP, 'She read 1 John 4:1 about testing spirits.', 'She talked to her pastor.', 'She decided it was good because it felt exciting.', 'Test it by God\'s word and godly advice, not by feelings.', 3],
      ['Ouma explains Matthew 5:37. ' + STEP, 'Jesus said let your yes be yes.', 'An honest person keeps promises openly.', 'So secret oaths are the best kind of promise.', 'Open, honest promises are godly; secret oaths are a warning sign.', 2],
    ], ['a', 'e', 'f']),

  ...T('tpg', 'CHRIST.HUMAN_SEXUALITY_RESPONSI.TEEN_PREGNANCY', M('TP_GIRL_FAULT', 'TP_GIFTS_HARMLESS', 'TP_ONCE_SAFE', 'TP_NO_FUTURE'),
    ['Think about everyone involved, what gifts can hide, and the help a young person can get.', 'Both people are responsible and an adult who takes advantage commits a crime; gifts from older people can be exploitation; it can happen the first time; a girl can return to school with support.'], [
      ['Who is responsible for a teenage pregnancy?', 'Both people involved', 'Only the girl|0', 'Nobody at all|0', 'Only the girl\'s parents|0'],
      ['How can gifts from an older person lead to teenage pregnancy?', 'The giver may expect sex in return', 'They cannot; gifts are only kindness|1', 'Gifts protect the girl|1', 'Only the girl is to blame|0'],
      ['Can pregnancy happen the first time?', 'Yes, it can', 'No, never the first time|2', 'Only after many times|2', 'Only if a gift was given|1'],
      ['A girl in Grade 8 becomes pregnant. Can she continue her education?', 'Yes, she can return to school', 'No, her life is over|3', 'No, only the boy may|0', 'Only if she hides it|3'],
      ['Which is a cause of teenage pregnancy today?', 'Older people giving gifts for sex', 'Going to school|1', 'Reading the Bible|1', 'Talking to a counsellor|3'],
    ], [
      ['In a class debate, Kevin says only the girl is to blame when a schoolgirl becomes pregnant. What is the fairer view?', 'Both are responsible', 'Only the girl is to blame for it|0', 'Gifts make it her fault|1', 'It cannot happen the first time|2'],
      ['A man at the matatu stage keeps buying Akinyi airtime and chips. Her friend says it is only kindness. What should Akinyi think?', 'He may expect sex; tell a trusted adult', 'It is only kindness|1', 'Only she would be to blame|0', 'Nothing can happen the first time|2'],
      ['A boy tells Mary nothing can happen the first time. What is true?', 'Pregnancy and infection can happen', 'He is right, the first time is safe|2', 'Only gifts cause pregnancy|1', 'Only she is responsible|0'],
      ['Zawadi, in Grade 8, is pregnant and says her future is over. What can her church and family tell her?', 'She can return to school with support', 'Her life and schooling are over|3', 'It was only her fault|0', 'Gifts will solve it|1'],
      ['Which consequence of irresponsible sexual behaviour can follow a single act?', 'HIV or another infection', 'None, the first time is safe|2', 'None, if a gift was given|1', 'Only the girl is affected|0'],
    ], [
      ['Joy explains a cause of teenage pregnancy. ' + STEP, 'Poverty can push some girls to accept gifts.', 'An older person may expect sex for them.', 'So the girl alone is to blame.', 'Both are responsible; an adult who exploits a child commits a crime.', 0],
      ['Kibet explains gifts. ' + STEP, 'Some older people give students money.', 'They may expect something in return.', 'But gifts are always only kindness.', 'Gifts for sex are exploitation; tell a trusted adult.', 1],
      ['Wairimu explains risks. ' + STEP, 'Sex before marriage carries risks.', 'Pregnancy and infections are two of them.', 'They cannot happen the first time.', 'Pregnancy and infection can happen the first time.', 2],
      ['Omar explains the future of a pregnant girl. ' + STEP, 'She faces many challenges.', 'Her family and church should support her.', 'She can never go back to school.', 'The school re-entry policy lets her return.', 3],
      ['Lucy explains how to avoid it. ' + STEP, 'Keep good company.', 'Refuse gifts that come with demands.', 'Only girls need to take care, since they alone are to blame.', 'Boys and girls are both responsible for their choices.', 0],
    ], ['b', 'c', 'b']),

  ...T('lt', 'CHRIST.SACREDNESS_OF_LIFE.LIFE_THREATS', M('LT_TALK_HARM', 'LT_WEAK_PEOPLE', 'LT_ABORTION_NO_EFFECT', 'LT_ONLY_MURDER'),
    ['Think about what protects life and who can help. Help is always there: a trusted adult, a counsellor or Childline 116.', 'Listen and tell a trusted adult at once; hopeless feelings can come to anyone and can be helped; unsafe abortion harms health and mind; the right to life is violated by murder, mob justice, suicide and reckless driving too.'], [
      ['A friend says she feels like ending her life. What do you do?', 'Listen and tell a trusted adult at once', 'Say nothing and change the subject|0', 'Tell her only weak people feel that|1', 'Keep it secret for ever|0'],
      ['Do strong believers ever feel hopeless?', 'Yes, as Elijah did; help is there', 'No, only weak people do|1', 'No, faith stops all such feelings|1', 'Only if they talk about it|0'],
      ['Which can follow an unsafe abortion?', 'Serious health risks and lasting trauma', 'There are no consequences|2', 'Only a short headache|2', 'Nothing, if kept secret|2'],
      ['Which violates the right to life?', 'Mob justice', 'Only murder, nothing else|3', 'Seeking help early|0', 'Talking to a counsellor|0'],
      ['Which value helps uphold the sacredness of life?', 'Empathy', 'Silence about a friend\'s pain|0', 'Thinking only the weak struggle|1', 'Believing nothing follows harm|2'],
    ], [
      ['After failing an exam, Kioko tells Baraka he does not want to live. Baraka is afraid to talk about it. What should he do?', 'Listen and tell a trusted adult now', 'Change the subject quickly|0', 'Tell him only weak boys say that|1', 'Wait and say nothing|0'],
      ['Wanjiku feels hopeless and thinks a good Christian should never feel this way. What can the class tell her?', 'Elijah felt this too; God cares, get help', 'Only weak people feel so|1', 'Keep it to herself|0', 'It will have no effect|2'],
      ['A frightened pregnant girl hears that an unsafe abortion has no after-effects. What is true?', 'It can cause serious harm and trauma', 'There are no effects|2', 'Only murder harms life|3', 'Saying nothing is best|0'],
      ['A crowd beats a suspected thief at the market. A learner says only murder violates the right to life. What is true?', 'Mob justice also violates it', 'Only murder does|3', 'It has no effect|2', 'Only weak people are harmed|1'],
      ['A matatu driver overtakes on a blind corner. Which right does reckless driving threaten?', 'The right to life', 'None, only murder counts|3', 'None, nothing follows|2', 'Only weak passengers\' rights|1'],
    ], [
      ['Shiru explains helping a friend. ' + STEP, 'Her friend said she wanted to die.', 'Shiru took it seriously.', 'She said nothing to anyone, so as not to put ideas in her head.', 'Listen and tell a trusted adult or counsellor at once.', 0],
      ['Juma explains hopeless feelings. ' + STEP, 'Elijah once asked God to take his life.', 'God cared for him and gave him rest and food.', 'So only weak people ever feel hopeless.', 'Anyone can feel this; it can be helped.', 1],
      ['Halima explains abortion. ' + STEP, 'Some girls fear shame or rejection.', 'Some are pressured by others.', 'An unsafe abortion has no effects afterwards.', 'It carries serious health risks, even death, and lasting trauma.', 2],
      ['Otieno explains the right to life. ' + STEP, 'Life is a gift from God.', 'The law protects the right to life.', 'Only murder violates the right to life.', 'Mob justice, suicide, unsafe abortion and reckless driving also violate it.', 3],
      ['Mumbi explains upholding life. ' + STEP, 'She shows empathy to friends in pain.', 'She knows Childline 116 is free.', 'If a friend says she wants to die, Mumbi keeps it secret.', 'Tell a trusted adult at once; this is not a secret to keep.', 0],
    ], ['f', 'g', 'd']),
];
