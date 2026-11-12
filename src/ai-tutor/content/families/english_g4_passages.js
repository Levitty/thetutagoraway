// ============================================================================
// ENGLISH GRADE 4: ORIGINAL SHORT PASSAGES for the reading families. Written by Claude (12 Nov 2026),
// never copied from a textbook. Kenyan names and places. Short sentences for a nine-year-old
// (the check holds the reading level at Flesch-Kincaid 7 or below, no sentence over 22 words; these read at about 3 to 5).
// The design asks for texts of about 300 words: these are shorter, for a phone, and a teacher may ask for longer ones.
// A question entry is [question, right, [wrong, 'M_CODE']..., because, {flags}].
// {t:1} marks a short answer that can also be typed (right may be 'a|b' for accepted forms).
// DRAFT: a Kenyan English teacher reviews every passage before any child sees it.
// ============================================================================
export const PASSAGES = [
  {
    id: 'sick-hen', title: 'The Sick Hen', kind: 'narrative',
    text: 'Wafula lived on a small farm near Kitale. One morning his best hen, Kuku, would not eat. She looked weak and could hardly stand.\n\nWafula ran to tell his father. Father looked at the hen and shook his head. "She is sick," he said. "We must keep her away from the others."\n\nThey made a warm bed in a box and put it in the kitchen. Every day Wafula gave Kuku clean water and soft maize. After one week, Kuku stood up and clucked loudly. Wafula laughed with joy.',
    fact: [
      ['Who told Wafula that the hen was sick.', 'his father|father', ['his teacher', 'M_FACT_WRONG_WHO'], ['his mother', 'M_FACT_WRONG_WHO'], ['his friend', 'M_FACT_WRONG_WHO'], 'Father looked at the hen and said, "She is sick."', { t: 1 }],
      ['Where did they put the hen\'s warm bed.', 'in the kitchen', ['in the barn', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['under a tree', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['in Wafula\'s bedroom', 'M_FACT_NEARBY_DETAIL'], 'They put the box in the kitchen.', { t: 1 }],
      ['What did Wafula give Kuku every day.', 'clean water and soft maize|water and soft maize', ['grass and seeds', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['milk and bread', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['clean water and sand', 'M_FACT_NEARBY_DETAIL'], 'He gave her clean water and soft maize every day.', { t: 1 }],
    ],
    tf: [['Kuku could hardly stand when she was sick.', 'True', 'The first paragraph says she could hardly stand.'], ['The hen got better after one month.', 'False', 'She got better after one week.'], ['Wafula had ten hens.', 'Not stated', 'The passage does not say how many hens he had.']],
    infer: ['Why did Father say the hen must be kept away from the others.', 'So that the others would not get sick too.', ['So that the others could sleep.', 'M_INFER_OVERREACH'], ['So that Kuku could be sold.', 'M_INFER_CONTRADICTS'], ['She is sick.', 'M_INFER_REPEATS_TEXT'], 'Keeping a sick hen apart stops the sickness from spreading.'],
    infer2: ['Wafula cares about his hen.', ['Kuku would not eat.', 'M_INFER_REPEATS_TEXT'], ['Wafula did not mind about Kuku.', 'M_INFER_CONTRADICTS'], ['Wafula is the best farmer in Kitale.', 'M_INFER_OVERREACH'], 'He ran to tell his father and looked after her every day, so he cares.'],
    ctx: ['weak', 'without strength', ['a day of the week', 'M_CTX_LOOKS_LIKE'], ['very strong', 'M_CTX_OPPOSITE'], ['very hungry', 'M_CTX_COMMON_MEANING'], 'She could hardly stand, so she had no strength.'],
    ctxclue: ['weak', 'could hardly stand', 'near Kitale', 'Wafula ran to tell his father', 'soft maize', 'A hen that can hardly stand has no strength.'],
  },
  {
    id: 'grandmother-birthday', title: "Grandmother's Birthday", kind: 'narrative',
    text: 'On Saturday the whole family met at Grandmother\'s home in Kakamega. She was turning seventy years old.\n\nAunt Rose baked a big cake. Uncle Peter brought a goat for the feast, the big meal that everyone would share. The children made cards with colourful pictures.\n\nAt four o\'clock everyone sat in a circle under the mango tree. Grandmother cut the cake and thanked them all. "My heart is full," she said. "I have a loving family."',
    fact: [
      ['Who baked the cake.', 'Aunt Rose|Rose', ['Uncle Peter', 'M_FACT_WRONG_WHO'], ['Grandmother', 'M_FACT_WRONG_WHO'], ['the children', 'M_FACT_WRONG_WHO'], 'Aunt Rose baked a big cake.', { t: 1 }],
      ['How many years old was Grandmother turning.', 'seventy|70', ['sixty', 'M_FACT_NEARBY_DETAIL'], ['seven', 'M_FACT_NEARBY_DETAIL'], ['eighty', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'She was turning seventy years old.', { t: 1 }],
      ['Where did everyone sit at four o\'clock.', 'under the mango tree|under the tree', ['in the kitchen', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['in the house', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['at the church', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'They sat in a circle under the mango tree.', { t: 1 }],
    ],
    tf: [['Uncle Peter brought a goat.', 'True', 'He brought a goat for the feast.'], ['The children baked the cake.', 'False', 'Aunt Rose baked the cake.'], ['Grandmother received a radio as a gift.', 'Not stated', 'The passage does not mention a radio.']],
    infer: ['Why did Grandmother say "My heart is full".', 'She was very happy to have her family with her.', ['She had eaten too much.', 'M_INFER_CONTRADICTS'], ['She wanted to go to bed.', 'M_INFER_OVERREACH'], ['She cut the cake.', 'M_INFER_REPEATS_TEXT'], 'She said she had a loving family, so she was happy.'],
    infer2: ['The family loves Grandmother.', ['Aunt Rose baked a big cake.', 'M_INFER_REPEATS_TEXT'], ['The family did not come to the party.', 'M_INFER_CONTRADICTS'], ['Grandmother is the oldest person in Kenya.', 'M_INFER_OVERREACH'], 'They all came, brought food and made cards, so they love her.'],
    ctx: ['feast', 'a big meal for many people', ['a short rest', 'M_CTX_OPPOSITE'], ['a kind of goat', 'M_CTX_LOOKS_LIKE'], ['a birthday card', 'M_CTX_COMMON_MEANING'], 'The passage says it is a big meal that everyone would share.'],
    ctxclue: ['feast', 'the big meal that everyone would share', 'Aunt Rose baked a big cake', 'in Kakamega', 'the children made cards', 'The words after the comma explain the word feast.'],
  },
  {
    id: 'washing-hands', title: 'Washing Hands', kind: 'information',
    text: 'Germs are tiny living things that make people ill. Washing your hands with soap stops germs from spreading. Mr Otieno, the school nurse, taught Grade 4 how to do it.\n\nFirst, wet your hands with clean water. Next, rub them with soap for twenty seconds. Rinse them well and dry them with a clean cloth.\n\nWash your hands before you eat and after you use the toilet. The school has four taps near the dining hall, and a bar of soap hangs by each one.',
    fact: [
      ['Who taught Grade 4 how to wash hands.', 'Mr Otieno|the school nurse|Mr Otieno, the school nurse', ['their class teacher', 'M_FACT_WRONG_WHO'], ['the headteacher', 'M_FACT_WRONG_WHO'], ['a doctor', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'Mr Otieno, the school nurse, taught Grade 4.', { t: 1 }],
      ['For how many seconds should you rub your hands with soap.', 'twenty|20', ['ten', 'M_FACT_NEARBY_DETAIL'], ['four', 'M_FACT_NEARBY_DETAIL'], ['thirty', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'Rub them with soap for twenty seconds.', { t: 1 }],
      ['When should you wash your hands.', 'before you eat and after you use the toilet', ['only when they look dirty', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['only after school', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['only on Mondays', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'The passage says to wash before you eat and after you use the toilet.'],
    ],
    tf: [['You should wash your hands before you eat.', 'True', 'The third paragraph says so.'], ['The school has ten taps near the dining hall.', 'False', 'The school has four taps near the dining hall.'], ['The parents buy the soap for the school.', 'Not stated', 'The passage does not say who buys the soap.']],
    infer: ['Why must you rub the soap for twenty seconds.', 'So that the germs are washed off well.', ['So that the water is used up.', 'M_INFER_CONTRADICTS'], ['So that the soap gets bigger.', 'M_INFER_OVERREACH'], ['You must rub them with soap.', 'M_INFER_REPEATS_TEXT'], 'Washing for long enough removes the germs.'],
    infer2: ['Washing hands helps people stay healthy.', ['The school has four taps.', 'M_INFER_REPEATS_TEXT'], ['Washing hands makes people ill.', 'M_INFER_CONTRADICTS'], ['Nobody at the school ever gets ill.', 'M_INFER_OVERREACH'], 'It stops germs, which make people ill, from spreading.'],
    ctx: ['germs', 'tiny living things that make people ill', ['the soap on the taps', 'M_CTX_COMMON_MEANING'], ['a kind of cloth', 'M_CTX_LOOKS_LIKE'], ['things that make people well', 'M_CTX_OPPOSITE'], 'The first sentence says what germs are.'],
    ctxclue: ['germs', 'tiny living things that make people ill', 'Mr Otieno, the school nurse', 'four taps near the dining hall', 'dry them with a clean cloth', 'The first sentence explains the word germs.'],
    scan: [
      ['How many taps are near the dining hall.', 'four|4', ['twenty', 'M_SCAN_NEAR_NUMBER'], ['two', 'M_SCAN_NEAR_NUMBER'], ['ten', 'M_SCAN_NEAR_NUMBER'], 'The school has four taps near the dining hall.', { t: 1 }],
      ['What do you rub on your hands.', 'soap', ['a cloth', 'M_SCAN_WRONG_KEYWORD'], ['water', 'M_SCAN_WRONG_KEYWORD'], ['germs', 'M_SCAN_WRONG_KEYWORD'], 'Rub them with soap.', { t: 1 }],
    ],
  },
  {
    id: 'email-aunt', title: 'An Email from Aunt Mercy', kind: 'dialogue',
    text: 'Achieng: Mum, I got an email from Aunt Mercy!\n\nMum: How nice. What does she say?\n\nAchieng: She is coming to Kisumu on Friday. She will arrive by bus at two o\'clock.\n\nMum: Please reply and tell her we will meet her at the bus stage.\n\nAchieng: Shall I send a photo of our new puppy?\n\nMum: Yes, attach it. That means you add the photo to the email. Then read the email again before you press send.',
    fact: [
      ['When will Aunt Mercy arrive.', 'on Friday at two o\'clock|on Friday|Friday', ['on Sunday at two o\'clock', 'M_FACT_NEARBY_DETAIL'], ['on Friday at four o\'clock', 'M_FACT_NEARBY_DETAIL'], ['on Monday morning', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'She will arrive on Friday at two o\'clock.', { t: 1 }],
      ['How will Aunt Mercy travel to Kisumu.', 'by bus', ['by train', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['by boda boda', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['by plane', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'She will arrive by bus.', { t: 1 }],
      ['What does Achieng want to send with the email.', 'a photo of the puppy|a photo', ['a card', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['a letter', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['a map', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'She asks, "Shall I send a photo of our new puppy?"', { t: 1 }],
    ],
    tf: [['Aunt Mercy is coming to Kisumu.', 'True', 'Achieng says so.'], ['Aunt Mercy will arrive on Sunday.', 'False', 'She will arrive on Friday.'], ['Aunt Mercy will stay for two weeks.', 'Not stated', 'The dialogue does not say how long she will stay.']],
    infer: ['Why did Mum say to read the email again before pressing send.', 'To check that the email has no mistakes.', ['To make the puppy sleep.', 'M_INFER_CONTRADICTS'], ['To delete the photo.', 'M_INFER_OVERREACH'], ['You must press send.', 'M_INFER_REPEATS_TEXT'], 'Reading it again helps to find mistakes before it goes.'],
    infer2: ['Achieng is excited about her aunt\'s visit.', ['Aunt Mercy sent an email.', 'M_INFER_REPEATS_TEXT'], ['Achieng does not want her aunt to come.', 'M_INFER_CONTRADICTS'], ['Aunt Mercy is Achieng\'s teacher.', 'M_INFER_OVERREACH'], 'She told Mum at once and wants to send a photo, so she is excited.'],
    ctx: ['attach', 'add a file such as a photo to an email', ['take a file out of an email', 'M_CTX_OPPOSITE'], ['stick a stamp on a letter', 'M_CTX_COMMON_MEANING'], ['read an email again', 'M_CTX_LOOKS_LIKE'], 'Mum explains that it means you add the photo to the email.'],
    ctxclue: ['attach', 'you add the photo to the email', 'she will arrive by bus', 'a new puppy', 'press send', 'Mum says what attach means in the next sentence.'],
  },
  {
    id: 'river-bottles', title: 'The Plastic Bottles', kind: 'narrative',
    text: 'Njoki found a plastic bottle by the river near her school. She picked it up and looked at it. Many bottles lay on the grass, and some floated in the water.\n\nAt school she told her teacher, Mrs Kamau. The next day the class cleaned the river bank. They put the bottles in a sack and took them to a place that recycles plastic. Recycling means turning old plastic into new things.\n\nSoon the river was clean again. Njoki felt proud.',
    fact: [
      ['Who did Njoki tell about the bottles.', 'her teacher|Mrs Kamau|her teacher, Mrs Kamau', ['her mother', 'M_FACT_WRONG_WHO'], ['the headteacher', 'M_FACT_WRONG_WHO'], ['her friend', 'M_FACT_WRONG_WHO'], 'At school she told her teacher, Mrs Kamau.', { t: 1 }],
      ['Where did Njoki find the first bottle.', 'by the river|by the river near her school', ['on the school field', 'M_FACT_NEARBY_DETAIL'], ['at the market', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['in the classroom', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'She found a bottle by the river near her school.', { t: 1 }],
      ['What did the class put the bottles in.', 'a sack', ['a box', 'M_FACT_NEARBY_DETAIL'], ['a bucket', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['a bag', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'They put the bottles in a sack.', { t: 1 }],
    ],
    tf: [['The class cleaned the river bank.', 'True', 'They cleaned it the next day.'], ['The bottles were thrown into the school bin.', 'False', 'They were taken to a place that recycles plastic.'], ['Njoki\'s mother helped to clean the river.', 'Not stated', 'The passage does not mention Njoki\'s mother.']],
    infer: ['Why did Njoki feel proud at the end.', 'She had helped to make the river clean again.', ['She had won a prize.', 'M_INFER_CONTRADICTS'], ['She was the teacher.', 'M_INFER_OVERREACH'], ['She found a plastic bottle.', 'M_INFER_REPEATS_TEXT'], 'Her action led to a clean river.'],
    infer2: ['Njoki cares about her environment.', ['Many bottles lay on the grass.', 'M_INFER_REPEATS_TEXT'], ['Njoki did not mind the dirty river.', 'M_INFER_CONTRADICTS'], ['Njoki is the head of the school.', 'M_INFER_OVERREACH'], 'She told her teacher and helped to clean the river, so she cares.'],
    ctx: ['recycling', 'turning old plastic into new things', ['throwing things away', 'M_CTX_OPPOSITE'], ['riding a bicycle', 'M_CTX_LOOKS_LIKE'], ['cleaning a river', 'M_CTX_COMMON_MEANING'], 'The passage says what recycling means.'],
    ctxclue: ['recycling', 'turning old plastic into new things', 'a sack', 'near her school', 'Mrs Kamau', 'The sentence after the word explains it.'],
  },
  {
    id: 'football-goal', title: 'A Match at Kabiru Primary', kind: 'narrative',
    text: 'On Friday afternoon, Kabiru Primary played a football match against Mwangaza Primary. The referee, Mr Juma, blew the whistle at three o\'clock.\n\nBoth teams played hard. In the second half, Achieng passed the ball to Kamau, and he kicked it into the net. The crowd cheered.\n\nMwangaza tried to score. Wanjiru, the goalkeeper, saved every shot, stopping each ball before it reached the net. Kabiru won by one goal. Both teams shook hands after the match.',
    fact: [
      ['Who was the referee.', 'Mr Juma|Juma', ['Kamau', 'M_FACT_WRONG_WHO'], ['Wanjiru', 'M_FACT_WRONG_WHO'], ['Achieng', 'M_FACT_WRONG_WHO'], 'The referee was Mr Juma.', { t: 1 }],
      ['Who kicked the ball into the net.', 'Kamau', ['Achieng', 'M_FACT_NEARBY_DETAIL'], ['Wanjiru', 'M_FACT_NEARBY_DETAIL'], ['Mr Juma', 'M_FACT_WRONG_WHO'], 'Achieng passed the ball, and Kamau kicked it into the net.', { t: 1 }],
      ['At what time did the match start.', 'three o\'clock|3 o\'clock|at three o\'clock', ['four o\'clock', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['two o\'clock', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['five o\'clock', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'The referee blew the whistle at three o\'clock.', { t: 1 }],
    ],
    tf: [['Kabiru won by one goal.', 'True', 'The last paragraph says so.'], ['Mwangaza scored two goals.', 'False', 'The goalkeeper saved every shot.'], ['It rained during the match.', 'Not stated', 'The passage does not mention rain.']],
    infer: ['Why did the teams shake hands after the match.', 'They showed respect for each other.', ['They wanted to play again at once.', 'M_INFER_OVERREACH'], ['They were angry.', 'M_INFER_CONTRADICTS'], ['Kabiru won by one goal.', 'M_INFER_REPEATS_TEXT'], 'Shaking hands after a game shows good sportsmanship.'],
    infer2: ['Wanjiru was a good goalkeeper.', ['Wanjiru was the goalkeeper.', 'M_INFER_REPEATS_TEXT'], ['Wanjiru let every shot in.', 'M_INFER_CONTRADICTS'], ['Wanjiru will play for Kenya one day.', 'M_INFER_OVERREACH'], 'She saved every shot, so she was good.'],
    ctx: ['saved', 'stopped the ball from going into the net', ['kept money for later', 'M_CTX_COMMON_MEANING'], ['let the ball go in', 'M_CTX_OPPOSITE'], ['kicked the ball far', 'M_CTX_LOOKS_LIKE'], 'The words after the comma explain it.'],
    ctxclue: ['saved', 'stopping each ball before it reached the net', 'Mwangaza tried to score', 'a football match', 'on Friday afternoon', 'The words after the comma explain how she saved the shots.'],
    scan: [
      ['Which school did Kabiru Primary play against.', 'Mwangaza Primary|Mwangaza', ['Kitale Primary', 'M_SCAN_WRONG_KEYWORD'], ['Mwenda Primary', 'M_SCAN_WRONG_KEYWORD'], ['Moi Primary', 'M_SCAN_WRONG_KEYWORD'], 'Kabiru Primary played against Mwangaza Primary.', { t: 1 }],
      ['On which day was the match.', 'Friday', ['Saturday', 'M_SCAN_NEAR_NUMBER'], ['Thursday', 'M_SCAN_NEAR_NUMBER'], ['Monday', 'M_SCAN_NEAR_NUMBER'], 'The match was on Friday afternoon.', { t: 1 }],
    ],
  },
  {
    id: 'baraka-savings', title: "Baraka's Football", kind: 'narrative',
    text: 'Baraka wanted to buy a football. It cost four hundred shillings. He had only fifty shillings in his money box.\n\nMother said, "If you save a little every week, you will reach your goal. A goal is something you work towards." Baraka began to save twenty-five shillings each week. He wrote the amount in a small book.\n\nAfter fourteen weeks he counted his money. He had enough! Baraka bought the football and smiled all the way home.',
    fact: [
      ['How much did the football cost.', 'four hundred shillings|400 shillings|400', ['fifty shillings', 'M_FACT_NEARBY_DETAIL'], ['twenty-five shillings', 'M_FACT_NEARBY_DETAIL'], ['fourteen shillings', 'M_FACT_NEARBY_DETAIL'], 'The football cost four hundred shillings.', { t: 1 }],
      ['Where did Baraka write the amounts he saved.', 'in a small book|in a book', ['on the wall', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['in his money box', 'M_FACT_NEARBY_DETAIL'], ['on his hand', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'He wrote the amount in a small book.', { t: 1 }],
      ['Who told Baraka to save a little every week.', 'his mother|Mother|mother', ['his teacher', 'M_FACT_WRONG_WHO'], ['his father', 'M_FACT_WRONG_WHO'], ['his friend', 'M_FACT_WRONG_WHO'], 'Mother said, "If you save a little every week, you will reach your goal."', { t: 1 }],
    ],
    tf: [['Baraka had fifty shillings at the start.', 'True', 'He had only fifty shillings in his money box.'], ['Baraka bought the football after four weeks.', 'False', 'He saved for fourteen weeks.'], ['Baraka\'s father gave him some of the money.', 'Not stated', 'The passage does not say his father gave him money.']],
    infer: ['Why did Baraka save a little every week.', 'He could not buy the football all at once.', ['He did not want a football.', 'M_INFER_CONTRADICTS'], ['He wanted to give the money to his teacher.', 'M_INFER_OVERREACH'], ['He saved twenty-five shillings each week.', 'M_INFER_REPEATS_TEXT'], 'The football cost more than he had, so he saved week by week.'],
    infer2: ['Baraka is patient.', ['Baraka bought the football.', 'M_INFER_REPEATS_TEXT'], ['Baraka gave up after one week.', 'M_INFER_CONTRADICTS'], ['Baraka is the richest boy in his school.', 'M_INFER_OVERREACH'], 'He kept saving for fourteen weeks until he had enough.'],
    ctx: ['goal', 'something you work towards', ['a place to kick the ball', 'M_CTX_COMMON_MEANING'], ['a small book', 'M_CTX_LOOKS_LIKE'], ['something you give up', 'M_CTX_OPPOSITE'], 'Mother explains it in the next sentence.'],
    ctxclue: ['goal', 'something you work towards', 'save twenty-five shillings each week', 'a small book', 'the money box', 'Mother tells us what a goal is.'],
    scan: [
      ['How many weeks did Baraka save.', 'fourteen|14', ['fifty', 'M_SCAN_NEAR_NUMBER'], ['twenty-five', 'M_SCAN_NEAR_NUMBER'], ['four hundred', 'M_SCAN_NEAR_NUMBER'], 'After fourteen weeks he counted his money.', { t: 1 }],
      ['How much money did Baraka have at the start.', 'fifty shillings|50 shillings|50', ['four hundred shillings', 'M_SCAN_NEAR_NUMBER'], ['twenty-five shillings', 'M_SCAN_NEAR_NUMBER'], ['fourteen shillings', 'M_SCAN_NEAR_NUMBER'], 'He had only fifty shillings in his money box.', { t: 1 }],
    ],
  },
  {
    id: 'stranger-message', title: 'A Message from a Stranger', kind: 'narrative',
    text: 'Amina was playing a game on her father\'s phone when a message came. "Hello, I am a friend of your father. What is your address?" the message said.\n\nAmina did not know the sender. She remembered her teacher\'s words: never share your address with a stranger online. She put the phone down and ran to her father.\n\nHer father read the message and thanked her. "You did the right thing," he said. "I will block the sender, so that he cannot send any more messages."',
    fact: [
      ['What did the message ask for.', 'her address|Amina\'s address|an address', ['her name', 'M_FACT_NEARBY_DETAIL'], ['her school', 'M_FACT_OUTSIDE_KNOWLEDGE'], ['her password', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'The message asked, "What is your address?"', { t: 1 }],
      ['Whose phone was Amina using.', 'her father\'s|her father|father\'s', ['her mother\'s', 'M_FACT_WRONG_WHO'], ['her teacher\'s', 'M_FACT_WRONG_WHO'], ['her own', 'M_FACT_OUTSIDE_KNOWLEDGE'], 'She was playing a game on her father\'s phone.', { t: 1 }],
      ['Who did Amina run to.', 'her father|father', ['her teacher', 'M_FACT_WRONG_WHO'], ['her mother', 'M_FACT_WRONG_WHO'], ['the sender', 'M_FACT_WRONG_WHO'], 'She put the phone down and ran to her father.', { t: 1 }],
    ],
    tf: [['Amina was using her father\'s phone.', 'True', 'The first sentence says so.'], ['Amina told the stranger her address.', 'False', 'She did not answer. She ran to her father.'], ['The sender was a teacher at Amina\'s school.', 'Not stated', 'The passage does not say who the sender was.']],
    infer: ['Why did Amina put the phone down and run to her father.', 'She knew the message was not safe and wanted an adult to know.', ['She wanted to play outside.', 'M_INFER_CONTRADICTS'], ['She wanted to buy a new phone.', 'M_INFER_OVERREACH'], ['A message came.', 'M_INFER_REPEATS_TEXT'], 'She remembered not to share her address and went to a trusted adult.'],
    infer2: ['Amina listens to her teacher.', ['Amina was playing a game.', 'M_INFER_REPEATS_TEXT'], ['Amina forgot her teacher\'s words.', 'M_INFER_CONTRADICTS'], ['Amina is the best player in her school.', 'M_INFER_OVERREACH'], 'She remembered her teacher\'s words and used them.'],
    ctx: ['block', 'stop a person from sending you messages', ['let a person send more messages', 'M_CTX_OPPOSITE'], ['a piece of wood', 'M_CTX_COMMON_MEANING'], ['read a message twice', 'M_CTX_LOOKS_LIKE'], 'The words after the comma explain it.'],
    ctxclue: ['block', 'so that he cannot send any more messages', 'a friend of your father', 'playing a game', 'put the phone down', 'The words after the comma say what blocking does.'],
  },
];

// Visuals written in words and numbers: a notice, a timetable, a price list, a poster. Each line ends with a full stop so the reading check can count it.
// An entry is [question, right, [wrong, 'M_CODE']..., because, {t:1}?].
export const VISUALS = [
  {
    id: 'bus-timetable', title: 'Bus Timetable', text: 'Bus to Kisumu leaves at 8:00 am.\nBus to Eldoret leaves at 10:30 am.\nBus to Nakuru leaves at 1:15 pm.\nBus to Kitale leaves at 4:00 pm.',
    q: [
      ['At what time does the bus to Eldoret leave.', '10:30 am', ['8:00 am', 'M_VIS_WRONG_ROW'], ['1:15 pm', 'M_VIS_WRONG_ROW'], ['4:00 pm', 'M_VIS_WRONG_ROW'], 'The line for Eldoret says 10:30 am.', { t: 1 }],
      ['Which bus leaves last.', 'the bus to Kitale', ['the bus to Kisumu', 'M_VIS_NEARBY_DETAIL'], ['the bus to Nakuru', 'M_VIS_NEARBY_DETAIL'], ['the bus to Eldoret', 'M_VIS_NEARBY_DETAIL'], 'The Kitale bus leaves at 4:00 pm, the latest time.'],
      ['Where does the 1:15 pm bus go.', 'Nakuru', ['Kisumu', 'M_VIS_WRONG_ROW'], ['Eldoret', 'M_VIS_WRONG_ROW'], ['Kitale', 'M_VIS_WRONG_ROW'], 'The line with 1:15 pm says Nakuru.', { t: 1 }],
    ],
    purpose: ['What is this timetable for.', 'to show when the buses leave', ['to sell bus tickets', 'M_VIS_PURPOSE'], ['to show how fast the buses go', 'M_VIS_PURPOSE'], ['to say which bus is the newest', 'M_VIS_PURPOSE'], 'It lists the time each bus leaves.'],
  },
  {
    id: 'clinic-notice', title: 'Kabiru Health Clinic', text: 'The clinic is open Monday to Friday from 8 am to 5 pm.\nThe clinic is closed on Saturday and Sunday.\nChildren get free medicine on Wednesday.\nCall the clinic for help.',
    q: [
      ['On which days is the clinic closed.', 'Saturday and Sunday', ['Monday and Friday', 'M_VIS_NEARBY_DETAIL'], ['Wednesday', 'M_VIS_NEARBY_DETAIL'], ['Friday and Saturday', 'M_VIS_NEARBY_DETAIL'], 'The second line says it is closed on Saturday and Sunday.', { t: 1 }],
      ['When do children get free medicine.', 'on Wednesday|Wednesday', ['on Monday', 'M_VIS_NEARBY_DETAIL'], ['on Saturday', 'M_VIS_NEARBY_DETAIL'], ['on Friday', 'M_VIS_NEARBY_DETAIL'], 'The third line says children get free medicine on Wednesday.', { t: 1 }],
      ['At what time does the clinic open.', '8 am', ['5 pm', 'M_VIS_WRONG_ROW'], ['10 am', 'M_VIS_WRONG_ROW'], ['12 noon', 'M_VIS_WRONG_ROW'], 'It is open from 8 am to 5 pm.', { t: 1 }],
    ],
    purpose: ['What is this notice for.', 'to tell people when the clinic is open', ['to sell medicine', 'M_VIS_PURPOSE'], ['to say who the nurse is', 'M_VIS_PURPOSE'], ['to show the way to the clinic', 'M_VIS_PURPOSE'], 'It gives the opening days and times.'],
  },
  {
    id: 'class-timetable', title: 'Grade 4 Timetable, Monday', text: 'Mathematics is at 8:00.\nEnglish is at 9:00.\nBreak is at 10:00.\nScience is at 10:30.\nKiswahili is at 11:30.\nLunch is at 12:30.',
    q: [
      ['Which lesson is at 10:30.', 'Science', ['English', 'M_VIS_WRONG_ROW'], ['Kiswahili', 'M_VIS_WRONG_ROW'], ['Mathematics', 'M_VIS_WRONG_ROW'], 'The line with 10:30 says Science.', { t: 1 }],
      ['At what time is English.', '9:00', ['8:00', 'M_VIS_WRONG_ROW'], ['10:30', 'M_VIS_WRONG_ROW'], ['11:30', 'M_VIS_WRONG_ROW'], 'The line for English says 9:00.', { t: 1 }],
      ['What comes just after Break.', 'Science', ['Kiswahili', 'M_VIS_NEARBY_DETAIL'], ['English', 'M_VIS_NEARBY_DETAIL'], ['Lunch', 'M_VIS_NEARBY_DETAIL'], 'After 10:00 Break comes 10:30 Science.', { t: 1 }],
    ],
    purpose: ['What is this timetable for.', 'to show the lessons of the day', ['to show the marks of the class', 'M_VIS_PURPOSE'], ['to show who the teachers are', 'M_VIS_PURPOSE'], ['to show the school fees', 'M_VIS_PURPOSE'], 'It lists each lesson and its time.'],
  },
  {
    id: 'price-list', title: 'School Canteen Prices', text: 'Mandazi costs 10 shillings.\nTea costs 20 shillings.\nBoiled egg costs 30 shillings.\nOrange juice costs 50 shillings.',
    q: [
      ['How much does a boiled egg cost.', '30 shillings', ['10 shillings', 'M_VIS_WRONG_ROW'], ['20 shillings', 'M_VIS_WRONG_ROW'], ['50 shillings', 'M_VIS_WRONG_ROW'], 'The line for the boiled egg says 30 shillings.', { t: 1 }],
      ['Which food costs the most.', 'orange juice', ['mandazi', 'M_VIS_NEARBY_DETAIL'], ['tea', 'M_VIS_NEARBY_DETAIL'], ['boiled egg', 'M_VIS_NEARBY_DETAIL'], 'Orange juice costs 50 shillings, the highest price.'],
      ['Which food costs 20 shillings.', 'tea', ['mandazi', 'M_VIS_WRONG_ROW'], ['boiled egg', 'M_VIS_WRONG_ROW'], ['orange juice', 'M_VIS_WRONG_ROW'], 'Tea costs 20 shillings.', { t: 1 }],
    ],
    purpose: ['What is this list for.', 'to show the prices of food', ['to show what is for lunch', 'M_VIS_PURPOSE'], ['to show who sells the food', 'M_VIS_PURPOSE'], ['to show how to cook', 'M_VIS_PURPOSE'], 'It lists each food and its price.'],
  },
  {
    id: 'first-aid-poster', title: 'First Aid for a Small Cut', text: 'Step 1. Wash your hands.\nStep 2. Rinse the cut with clean water.\nStep 3. Cover it with a clean plaster.\nStep 4. Tell a teacher or a parent.',
    q: [
      ['What do you do after you rinse the cut.', 'cover it with a clean plaster', ['wash your hands', 'M_VIS_WRONG_ROW'], ['tell a teacher or a parent', 'M_VIS_WRONG_ROW'], ['rinse it again', 'M_VIS_WRONG_ROW'], 'Step 3 comes after Step 2.', { t: 1 }],
      ['What is Step 1.', 'wash your hands', ['rinse the cut', 'M_VIS_WRONG_ROW'], ['cover it with a plaster', 'M_VIS_WRONG_ROW'], ['tell a parent', 'M_VIS_WRONG_ROW'], 'Step 1 says wash your hands.', { t: 1 }],
      ['Whom do you tell at the end.', 'a teacher or a parent', ['a nurse', 'M_VIS_NEARBY_DETAIL'], ['a friend', 'M_VIS_NEARBY_DETAIL'], ['nobody', 'M_VIS_NEARBY_DETAIL'], 'Step 4 says to tell a teacher or a parent.'],
    ],
    purpose: ['What is this poster for.', 'to show what to do for a small cut', ['to show how to cook a meal', 'M_VIS_PURPOSE'], ['to show the times of lessons', 'M_VIS_PURPOSE'], ['to sell plasters', 'M_VIS_PURPOSE'], 'The title and the steps tell what to do for a small cut.'],
  },
];
