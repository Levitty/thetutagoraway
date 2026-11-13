// ============================================================================
// ENGLISH GRADE 9: ORIGINAL PASSAGES, POEMS, PLAY SCENES AND LISTENING SCRIPTS for the reading families. Written by Claude (13 Nov 2026),
// never copied or adapted from a textbook, a published story, a poem or a play. Kenyan names and places. Short sentences for a fourteen or
// fifteen-year-old. Question types, two of each: a prose passage has order, ctx, fact, infer, predict, main, summary, life, image;
// a poem has persona, repeat, about, msg, pov, image; a play scene has char, order, theme, lesson, adverb, setting.
// A row is [question, right, wrong (a small detail), wrong (the opposite), wrong (not in the text)]; the three wrong answers always run in
// that order so the library codes _DETAIL, _OPPOSITE and _NOTSAID fit every type. DRAFT: a Kenyan English teacher checks every text.
// ============================================================================
export const PASSAGES = [
  {
    id: 'phones', title: 'Should Learners Carry Phones to School?', kind: 'argument',
    text: 'Many parents in our town believe that a phone helps a child to stay safe. A learner can call home if the bus is late, and a parent can find out where the child is. These are strong reasons.\n\nHowever, teachers have a different view. They say that phones disturb lessons, because some learners send messages instead of listening. In addition, a lost or stolen phone can cause trouble and tears.\n\nIn my opinion, a school should find a middle path. Learners could hand in their phones at the gate each morning and collect them at the end of the day. In this way safety is kept, and lessons are not disturbed.',
    q: {
      order: [
        ['Which part of the argument comes first?', 'the reasons that parents give for phones', 'the writer\'s own opinion', 'the idea of handing phones in at the gate', 'the problem of stolen phones'],
        ['Which part of the argument comes last?', 'the writer\'s suggestion of a middle path', 'the parents\' reasons', 'the teachers\' view', 'the problem of phones that are lost on the road'],
      ],
      ctx: [
        ['In the passage, what does the word "disturb" mean?', 'interrupt and spoil', 'help and improve', 'buy and sell', 'keep and protect'],
        ['In the passage, what does the phrase "middle path" mean?', 'a plan that gives each side part of what it wants', 'a road through the town', 'a plan that ignores both sides', 'a punishment given to every learner who owns a phone'],
      ],
      fact: [
        ['Why do some parents want learners to have phones?', 'so a child can call home', 'so the child can play games', 'so the child can sell things', 'so the child can skip lessons'],
        ['What do teachers say phones do in lessons?', 'distract learners from listening', 'help learners to listen', 'make lessons shorter', 'make learners read more books in class'],
      ],
      infer: [
        ['What does the writer think about the two sides?', 'Both sides have good points.', 'Only parents are right.', 'Only teachers are right.', 'The writer agrees with nobody here.'],
        ['Why does the writer suggest handing in phones at the gate?', 'It keeps phones safe.', 'It makes the school gate busy.', 'It punishes all learners.', 'It makes parents angry.'],
      ],
      predict: [
        ['What would the writer probably argue next?', 'how the school could collect', 'why phones should be banned for ever', 'how to make phones cheaper', 'why teachers should leave the school'],
        ['How will many parents probably respond to the middle path?', 'They may agree.', 'They will refuse all rules.', 'They will leave the town.', 'They will buy more phones.'],
      ],
      main: [
        ['What is the main idea of the passage?', 'A school should keep phones safe at the gate so safety and lessons are both protected.', 'Phones are expensive for most families to buy.', 'Parents are always right about learners and phones.', 'Learners should have longer breaks in which they may phone home at will.'],
        ['Which title best fits the passage?', 'A Middle Path for Phones at School', 'The Price of a Phone in Town', 'Teachers Leave the School for Ever', 'A Lost Bus on the Road'],
      ],
      summary: [
        ['Which is the best summary of the passage?', 'Parents want phones for safety.', 'Parents and teachers agree that phones should be banned.', 'The writer says phones should be sold at school.', 'The writer says learners should stay home.'],
        ['Which sentence is a key idea for a summary?', 'The writer suggests.', 'A lost phone can cause tears.', 'The bus can be late.', 'Parents live in town.'],
      ],
      life: [
        ['How can you connect this passage to real life?', 'Many schools must balance safety with learning.', 'Phones are never used at home or at school.', 'All schools have been closed by the council.', 'Teachers do not use phones to speak to parents.'],
        ['What could a learner do after reading this passage?', 'Think about a fair rule.', 'Ignore every rule.', 'Hide a phone in class.', 'Stop going to school.'],
      ],
      image: [
        ['What picture do the words "lost or stolen phone can cause trouble and tears" give you?', 'a learner upset', 'a learner laughing with friends', 'a teacher giving prizes', 'a bus arriving on time'],
        ['Which line helps you picture a disturbed lesson?', 'Some learners send messages instead of listening.', 'Many parents believe that a phone helps a child.', 'Learners could hand in their phones.', 'A learner can call home.'],
      ],
    },
  },
  {
    id: 'last-bus', title: 'The Last Bus to Eldoret', kind: 'story',
    text: 'Wangari had run all the way to the stage, but the last bus to Eldoret was already pulling away. She stood with her heavy bag and fought back tears. It was getting dark, and she had no money for a hotel.\n\nAn old woman sitting on a bench looked up. "You are late, my child," she said gently. "Come, you can sleep at my house tonight. In the morning I shall take you to the first bus." Wangari hesitated. Her mother had always told her to be careful with strangers.\n\nThen she noticed the woman wore the badge of a church group. Wangari took a deep breath and followed her. The next morning she reached Eldoret safely and sent the old woman a letter of thanks. She also decided that one day she would help a stranger, too.',
    q: {
      order: [
        ['Which event happened first in the story?', 'Wangari missed the last bus.', 'The old woman offered her a bed.', 'Wangari noticed the church badge.', 'Wangari wrote a letter of thanks.'],
        ['Which event happened last in the story?', 'Wangari decided she would help a stranger one day.', 'The old woman spoke gently.', 'Wangari hesitated.', 'Wangari gave away her heavy bag to a stranger at the stage.'],
      ],
      ctx: [
        ['In the passage, what does the word "hesitated" mean?', 'paused because she was not sure', 'ran away quickly', 'shouted loudly', 'sang a song to herself in a loud voice'],
        ['In the passage, what does the word "badge" mean?', 'a small sign showing', 'a kind of bag', 'a piece of bread', 'a ticket for a bus'],
      ],
      fact: [
        ['Where was Wangari trying to go?', 'Eldoret', 'Nairobi', 'Mombasa', 'Kisumu'],
        ['What did the old woman offer Wangari?', 'a place to sleep', 'money for a hotel', 'a ticket to Nairobi', 'a job in the town'],
      ],
      infer: [
        ['Why did Wangari hesitate to follow the old woman?', 'Her mother had warned her.', 'She did not like old people.', 'She wanted to miss the bus.', 'She had already found a hotel.'],
        ['Why did Wangari follow the old woman in the end?', 'She saw the church badge.', 'She was forced.', 'She was bored.', 'She wanted to see the town.'],
      ],
      predict: [
        ['What will Wangari probably do when she sees someone in need years later?', 'help them as she was helped', 'ignore them and walk away', 'run away from them', 'laugh at them and leave'],
        ['What will the old woman probably feel when she receives the letter?', 'happy that her kindness was valued', 'angry about the letter she received', 'sad about the bus that left', 'worried about the church group'],
      ],
      main: [
        ['What is the main idea of the passage?', 'A kind stranger helps a girl who missed the last bus, and the girl learns to help others.', 'Buses leave Eldoret at night for the coast.', 'Girls should never travel anywhere alone.', 'A girl loses her heavy bag and a driver gives her free tickets for a year.'],
        ['Which title best fits the passage?', 'A Kind Stranger at the Bus Stage', 'The Bus That Never Came Home', 'A Hotel in Eldoret Town', 'The Church Choir Sings'],
      ],
      summary: [
        ['Which is the best summary of the passage?', 'Wangari missed the last bus.', 'Wangari stayed at the stage all night.', 'The old woman took Wangari to a hotel.', 'Wangari refused help and walked to Eldoret.'],
        ['Which sentence is a key idea for a summary?', 'An old woman offered Wangari shelter and a ride to the first bus.', 'Wangari carried a heavy bag.', 'It was getting dark.', 'Wangari bought a ticket from the old woman and travelled to Eldoret by night.'],
      ],
      life: [
        ['How can you connect this story to real life?', 'We should be careful with strangers, but kindness exists and is worth sharing.', 'No stranger is ever kind to a traveller.', 'Buses are always on time in every town.', 'Church groups always give strangers money, so no traveller needs to plan.'],
        ['What can you learn from Wangari\'s thanks?', 'We should thank people who help us.', 'Letters of thanks are a waste of time.', 'Helpers always expect to be paid money.', 'Strangers should always be ignored.'],
      ],
      image: [
        ['What picture do the words "fought back tears" give you?', 'a girl trying not to cry', 'a girl laughing', 'a girl running a race', 'a girl asleep'],
        ['Which line helps you picture the old woman\'s kindness?', '"You are late.', 'Wangari had run all the way.', 'It was getting dark.', 'She had no money for a hotel.'],
      ],
    },
  },
  {
    id: 'village-shop', title: 'Mama Njoki\'s Shop', kind: 'information',
    text: 'Mama Njoki runs a small shop in a village near Nyeri. Ten years ago she sold only sugar, tea leaves and soap, and her customers had to carry cash to pay.\n\nToday she also helps neighbours to send and receive money with a mobile phone. A farmer can now pay for seed without walking to town, and a son in Nairobi can send school fees to his mother in seconds. Mama Njoki earns a small fee for each service.\n\nShe has also learnt to keep her records on her phone. In the evening she checks what she has sold and what she must order. Her business has grown, and she has employed a young assistant from the village.',
    q: {
      order: [
        ['Which happened first in Mama Njoki\'s shop?', 'She sold only sugar, tea leaves and soap.', 'She employed an assistant.', 'She learnt to keep records on her phone.', 'She began to help neighbours send money.'],
        ['Which happened last in the passage?', 'She employed a young assistant from the village.', 'She sold sugar and soap.', 'Customers carried cash to pay.', 'She moved her shop from the village to a big town.'],
      ],
      ctx: [
        ['In the passage, what does the word "employed" mean?', 'gave a job to', 'sold goods to', 'taught a lesson to', 'sent money to'],
        ['In the passage, what does the word "records" mean?', 'notes of what is sold', 'songs on a radio', 'a kind of shop', 'a list of villages'],
      ],
      fact: [
        ['What does Mama Njoki earn for each money service?', 'a small fee', 'a free bag of sugar', 'nothing', 'a large prize'],
        ['Where does the son who sends school fees live?', 'Nairobi', 'Nyeri', 'Mombasa', 'Eldoret'],
      ],
      infer: [
        ['Why has Mama Njoki\'s business grown?', 'She offers new services.', 'She sells only sugar.', 'She closes early.', 'She has no customers.'],
        ['What does the passage show about Mama Njoki?', 'She learns new things.', 'She dislikes change.', 'She is afraid of phones.', 'She wants to move to Nairobi.'],
      ],
      predict: [
        ['What will Mama Njoki probably do if her business keeps growing?', 'employ more helpers or add more services', 'close her shop for good', 'sell only soap and sugar', 'move her shop to Nairobi and close it here'],
        ['What will probably happen to neighbours who need to pay for seed?', 'They will keep using her service instead of walking to town.', 'They will stop farming for ever.', 'They will refuse to pay for seed.', 'They will ask her to stop all services and sell only soap.'],
      ],
      main: [
        ['What is the main idea of the passage?', 'Mama Njoki uses a phone.', 'Shops sell sugar and soap.', 'Farmers need seed.', 'Nairobi is a big city.'],
        ['Which title best fits the passage?', 'A Village Shop Grows with the Phone', 'Sugar and Tea Leaves for Sale', 'A Son in Nairobi Sends Money', 'A Shopkeeper Who Moves to Nairobi'],
      ],
      summary: [
        ['Which is the best summary of the passage?', 'Mama Njoki now helps neighbours send money by phone and keeps records on it, so her shop has grown and she has an assistant.', 'Mama Njoki still sells only sugar.', 'Mama Njoki moved her shop to Nairobi.', 'Mama Njoki sells sugar, tea leaves and soap to neighbours who pay in cash, and she closes her shop early every evening.'],
        ['Which sentence is a key idea for a summary?', 'She helps neighbours send.', 'She sells soap.', 'The shop is near Nyeri.', 'Her assistant is young.'],
      ],
      life: [
        ['How can you connect this passage to real life?', 'Many small businesses use phones for payments and records.', 'No business uses a phone for payments.', 'Shops never change what they sell.', 'Most small shops in villages have closed and moved to the big towns.'],
        ['What can a young person learn from Mama Njoki?', 'New skills can help a small business.', 'Change is always bad.', 'Businesses should never keep records.', 'Customers should never be helped.'],
      ],
      image: [
        ['What picture do the words "send school fees to his mother in seconds" give you?', 'money moving quickly from one place to another', 'a long walk to the bank', 'a closed shop', 'a family carrying heavy sacks to the town on foot'],
        ['Which line helps you picture Mama Njoki\'s evening work?', 'In the evening she checks what she has sold and what she must order.', 'Ten years ago she sold only sugar.', 'She earns a small fee.', 'Her business has grown, and she has employed a young assistant.'],
      ],
    },
  },
  {
    id: 'debate', title: 'The Quiet Boy and the Debate', kind: 'story',
    text: 'Baraka was the quietest boy in Form Two. When the teacher asked a question, he looked down at his desk. His friends said, "Baraka, you know the answers! Why do you never speak?"\n\nOne Monday, Mr Otieno announced a school debate. "Who will speak for our class?" he asked. Nobody moved. Then, to everyone\'s surprise, Baraka raised his hand. His knees shook, but he stood up.\n\nHe had prepared well. He spoke slowly about the need for clean water in the school, and he used facts that he had collected from the borehole committee. When he sat down, the hall was quiet for a moment, and then everybody clapped. Baraka smiled shyly. He had found his voice.',
    q: {
      order: [
        ['Which event happened first in the story?', 'Baraka\'s friends asked why he never spoke.', 'Mr Otieno announced a debate.', 'Baraka raised his hand.', 'Baraka walked slowly to the school hall alone.'],
        ['Which event happened last in the story?', 'Baraka smiled shyly.', 'Nobody moved when the teacher asked.', 'Baraka\'s knees shook.', 'The teacher announced the debate.'],
      ],
      ctx: [
        ['In the passage, what does the word "announced" mean?', 'told everyone publicly', 'hid from everyone', 'forgot about', 'argued with'],
        ['In the passage, what does the word "borehole" mean?', 'a deep hole drilled', 'a small shop', 'a type of school desk', 'a book about water'],
      ],
      fact: [
        ['What was the topic of Baraka\'s speech?', 'the need for clean water in the school', 'the price of books', 'a football match', 'the need for a new football field at the school'],
        ['Who announced the debate?', 'Mr Otieno', 'the head teacher', 'Baraka', 'a visitor'],
      ],
      infer: [
        ['Why did Baraka\'s knees shake?', 'He was nervous about speaking.', 'He was cold.', 'He was angry.', 'He was angry about the heavy rain.'],
        ['What does the passage show about Baraka?', 'He is shy but capable when he prepares.', 'He is lazy.', 'He dislikes his friends.', 'He is bold but never prepares his work.'],
      ],
      predict: [
        ['What will Baraka probably do after the debate?', 'speak up more often in class', 'never speak in public again', 'leave school at the end of term', 'stop studying for the exams'],
        ['How will his friends probably treat him now?', 'with greater respect', 'with anger', 'with silence for ever', 'with no interest'],
      ],
      main: [
        ['What is the main idea of the passage?', 'A shy boy prepares well.', 'A school has a borehole.', 'A teacher likes debates.', 'Boys are quiet in Form Two.'],
        ['Which title best fits the passage?', 'Baraka Finds His Voice', 'The Borehole Committee', 'A Quiet Monday', 'The Teacher\'s Question'],
      ],
      summary: [
        ['Which is the best summary of the passage?', 'Quiet Baraka volunteers for a debate.', 'Baraka refuses to join the debate.', 'Baraka loses the debate and cries.', 'The teacher gives the speech.'],
        ['Which sentence is a key idea for a summary?', 'Baraka prepared well.', 'His knees shook.', 'He looked at his desk.', 'The hall was quiet for a moment.'],
      ],
      life: [
        ['How can you connect this story to real life?', 'Preparation can help a shy person.', 'Shy people should never speak.', 'Debates are never useful.', 'Teachers should not ask questions.'],
        ['What can you learn from Baraka\'s facts?', 'A speaker is stronger when he uses facts.', 'Facts do not matter in a speech.', 'Speeches should always be very short.', 'A speaker should shout to win.'],
      ],
      image: [
        ['What picture do the words "his knees shook, but he stood up" give you?', 'a nervous boy bravely getting to his feet', 'a boy running away', 'a boy asleep', 'a proud boy running out of the school hall'],
        ['Which line helps you picture the hall after the speech?', 'The hall was quiet for a moment.', 'Baraka was the quietest boy.', 'Mr Otieno announced a debate.', 'He had prepared well.'],
      ],
    },
  },
  {
    id: 'poem-night', title: 'The Street Light', kind: 'poem',
    text: 'I stand at the corner, tall and alone,\nWatching the night with my yellow stone.\nThe buses go past with a roar and a sigh,\nAnd the moon is my friend in the black of the sky.\n\nI see the late workers come walking home,\nTheir shadows grow long on the road and the loam.\nI whisper, "Take care," as they pass me by,\nAnd I light up their way till the sun climbs high.\n\nI stand at the corner, tall and alone,\nBut the whole town is mine, and I am its own.',
    q: {
      persona: [
        ['Who is speaking in the poem?', 'a street light', 'a bus driver', 'a late worker', 'the moon'],
        ['Who are the other participants in the poem?', 'the late workers and the buses', 'the farmers and the cattle', 'the teachers and learners', 'the tired children and the cattle'],
      ],
      repeat: [
        ['Which line is repeated at the beginning and the end?', 'I stand at the corner, tall and alone,', 'I light up their way till the sun climbs high.', 'The buses go past with a roar and a sigh,', 'I see the late workers come walking home,'],
        ['What is the effect of repeating "I stand at the corner, tall and alone"?', 'It shows how the light stays in one place all night.', 'It shows that the light is moving about the town.', 'It shows that the light is broken and dark.', 'It shows that there are many lights along the road.'],
      ],
      about: [
        ['What is the poem about?', 'a street light', 'a bus race', 'the end of the school day', 'a broken lamp'],
        ['What does the street light do for the workers?', 'It lights their way home.', 'It chases them away.', 'It sells them food.', 'It makes them late.'],
      ],
      msg: [
        ['What message does the poem give?', 'Even a quiet, lonely helper can care for a whole town.', 'Only the noisy things in a town really matter.', 'Night is always a frightening time for people.', 'Only the loudest things in a town can ever help its people.'],
        ['Why does the street light say "Take care"?', 'It cares about the people who pass.', 'It wants them to leave the road.', 'It is angry with the workers.', 'It wants some money from them.'],
      ],
      pov: [
        ['From whose point of view is the poem told?', 'the street light, in the first person', 'a worker, in the first person', 'the moon, in the third person', 'a bus driver, in the third person'],
        ['How can you tell the poem uses the first person?', 'The speaker says "I".', 'The speaker says "they" only.', 'The speaker says "you" only.', 'There is no speaker.'],
      ],
      image: [
        ['What picture do the words "my yellow stone" give you?', 'a glowing yellow lamp', 'a heavy rock', 'a golden coin', 'a yellow flower'],
        ['Which line helps you picture the workers\' tiredness?', 'Their shadows grow long on the road and the loam.', 'The moon is my friend.', 'The buses go past.', 'The moon is my friend in the black of the sky.'],
      ],
    },
  },
  {
    id: 'poem-river', title: 'The River Remembers', kind: 'poem',
    text: 'I am the river, old and slow,\nI remember the paths where the cattle go.\nI remember the children who splashed in my bend,\nAnd the old women singing from morning to end.\n\nI am the river, old and slow,\nI carry the rain to the fields below.\nI am quiet in drought and loud in the storm,\nBut I keep every secret both cool and warm.\n\nI am the river, old and slow,\nTake care of me, and I shall flow.',
    q: {
      persona: [
        ['Who is speaking in the poem?', 'the river', 'a child', 'an old woman', 'a farmer'],
        ['Who are the other participants in the poem?', 'the cattle, the children', 'the buses and the workers', 'the teachers and the doctors', 'the soldiers and the kings'],
      ],
      repeat: [
        ['Which line is repeated at the start of every stanza?', 'I am the river, old and slow,', 'I remember the paths where the cattle go.', 'I carry the rain to the fields below.', 'Take care of me, and I shall flow.'],
        ['What is the effect of repeating "I am the river, old and slow"?', 'It stresses who is speaking.', 'It shows that the river has dried up.', 'It shows that the river is angry.', 'It shows that there are many rivers.'],
      ],
      about: [
        ['What is the poem about?', 'a river that remembers the people', 'a flood that destroys a town', 'a boat on the sea', 'a flood that washes away the whole village'],
        ['What does the river carry to the fields?', 'the rain', 'the cattle', 'the children', 'the stones'],
      ],
      msg: [
        ['What message does the poem give?', 'We should take care of the river.', 'Rivers are always dangerous.', 'Rivers belong to no one.', 'We should stay away from water.'],
        ['Why does the river say "Take care of me, and I shall flow"?', 'It shows that people must protect it for it to continue giving.', 'It is warning people to leave the village at once.', 'It is asking the people for gifts of food and money.', 'It is asking the people to build a boat for the river.'],
      ],
      pov: [
        ['From whose point of view is the poem told?', 'the river, in the first person', 'a child, in the first person', 'a farmer, in the third person', 'a narrator, in the third person'],
        ['How can you tell the poem uses the first person?', 'The speaker says "I".', 'The speaker says "they" only.', 'The speaker says "we" only.', 'There is no speaker.'],
      ],
      image: [
        ['What picture do the words "children who splashed in my bend" give you?', 'happy children playing in the water', 'children asleep', 'children at school', 'cattle drinking quietly at the river bend'],
        ['Which line helps you hear the river\'s moods?', 'I am quiet in drought and loud in the storm,', 'I am the river, old and slow,', 'I remember the paths where the cattle go.', 'Take care of me, and I shall flow.'],
      ],
    },
  },
  {
    id: 'play-meeting', title: 'The Village Meeting (a scene)', kind: 'play',
    text: 'SETTING: A shady tree in Kimana village, late afternoon. Villagers sit on stones and logs.\n\nCHAIRMAN MZEE ODHIAMBO: (calmly) Friends, the borehole has broken again.\nMAMA ADHIAMBO: (angrily) Again! My children walk three hours for water!\nJUMA: (eagerly) Let us each give fifty shillings and mend it today.\nOLD KAMAU: (slowly) Fifty shillings is too much for some of us.\nMZEE ODHIAMBO: (kindly) Then those who cannot pay may bring sand and stones instead.\nMAMA ADHIAMBO: (warmly) That is fair. I will bring sand tomorrow.\nJUMA: (cheerfully) And I will bring the tools.\n\nThe villagers nod and begin to stand. The sun sets behind them.',
    q: {
      char: [
        ['Which word best describes Mzee Odhiambo?', 'fair and calm', 'angry and rude', 'lazy and careless', 'selfish and proud'],
        ['Which character is the angriest at the start of the scene?', 'Mama Adhiambo', 'Juma', 'Old Kamau', 'Mzee Odhiambo'],
      ],
      order: [
        ['Which event happens first in the scene?', 'Mzee Odhiambo says the borehole has broken.', 'Juma offers to bring the tools.', 'The villagers begin to stand.', 'Old Kamau says fifty shillings is too much.'],
        ['Which event happens last in the scene?', 'The villagers nod and begin to stand.', 'Mama Adhiambo complains about the walk.', 'Juma suggests giving fifty shillings.', 'Mzee Odhiambo calls the meeting.'],
      ],
      theme: [
        ['Which theme does the scene show?', 'working together', 'winning a competition', 'a love story', 'a journey abroad'],
        ['What does the solution about sand and stones show?', 'fairness to people who cannot pay money', 'that money is not needed', 'that the borehole is not important', 'that the villagers do not agree'],
      ],
      lesson: [
        ['What lesson does the scene teach?', 'A community can solve its problems when everyone gives what they can.', 'Only rich people should pay.', 'Problems should be ignored.', 'A village should wait for the government to repair every borehole for it.'],
        ['What can we learn from Mzee Odhiambo\'s answer to Old Kamau?', 'Leaders should find fair ways for everyone.', 'Leaders should force everyone to pay.', 'Leaders should avoid meetings.', 'Leaders should never listen to the elders.'],
      ],
      adverb: [
        ['How does Mama Adhiambo speak when she says "Again!"?', 'angrily', 'warmly', 'slowly', 'cheerfully'],
        ['How does Mzee Odhiambo speak when he offers sand and stones?', 'kindly', 'angrily', 'eagerly', 'slowly'],
      ],
      setting: [
        ['Where does the scene take place?', 'under a shady tree in Kimana village', 'in a classroom', 'in a hospital', 'inside a large room in a town hall by the road'],
        ['At what time of day does the scene end?', 'at sunset', 'at sunrise', 'at noon', 'at midnight'],
      ],
    },
  },
  {
    id: 'play-phone', title: 'The Lost Phone (a scene)', kind: 'play',
    text: 'SETTING: The sitting room of the Mutuku family, evening. Njeri is searching under the cushions.\n\nNJERI: (anxiously) Where is it? Mum\'s phone was here a minute ago!\nKIOKO: (lazily) Maybe it is in your bag.\nNJERI: (sharply) I have looked in my bag twice, Kioko.\nKIOKO: (slowly, with a smile) Perhaps it is in your hand.\nNJERI: (embarrassed) Oh! It is. I was holding it all the time.\nMUM: (entering, gently) Have you found it?\nNJERI: (shyly) Yes, Mum. I am sorry for the fuss.\nMUM: (warmly) Never mind. Next time, look in your hand first.\n\nThey all laugh as the lights go down.',
    q: {
      char: [
        ['Which word best describes Njeri at the start of the scene?', 'worried', 'calm', 'sleepy', 'proud'],
        ['Which character teases Njeri gently?', 'Kioko', 'Mum', 'a neighbour', 'a teacher'],
      ],
      order: [
        ['Which event happens first in the scene?', 'Njeri searches under the cushions.', 'Njeri finds the phone in her hand.', 'Mum enters the room.', 'They all laugh.'],
        ['Which event happens last in the scene?', 'They all laugh as the lights go down.', 'Kioko suggests the bag.', 'Njeri looks in her bag twice.', 'They all go to bed as the moon rises.'],
      ],
      theme: [
        ['Which theme does the scene show?', 'a small mistake', 'a dangerous journey', 'a school exam', 'a business problem'],
        ['What does Mum\'s warm answer show?', 'a forgiving, loving family', 'an angry family', 'a family in trouble', 'a family that cannot laugh'],
      ],
      lesson: [
        ['What lesson does the scene teach?', 'Calm down and check carefully before you worry.', 'Never use a phone.', 'Always blame others.', 'Always blame a brother or a sister before searching.'],
        ['What can we learn from Mum\'s words "look in your hand first"?', 'Simple things are easy to overlook.', 'Phones should be hidden.', 'Children should not hold phones.', 'Mum is angry.'],
      ],
      adverb: [
        ['How does Njeri speak when she says "Where is it?"', 'anxiously', 'lazily', 'warmly', 'slowly'],
        ['How does Kioko speak at first?', 'lazily', 'sharply', 'shyly', 'anxiously'],
      ],
      setting: [
        ['Where does the scene take place?', 'in the sitting room of the Mutuku family', 'in a classroom', 'in a shop', 'in the kitchen of a house near the market'],
        ['At what time of day does the scene take place?', 'in the evening', 'in the morning', 'at noon', 'at midnight'],
      ],
    },
  },
];

export const LISTENS = [
  {
    id: 'read-daily', title: 'Why Learners Should Read Every Day', kind: 'listening',
    script: 'Good afternoon, everyone. Today I shall argue that every learner should read for at least twenty minutes each day. First, reading builds vocabulary. A learner who meets new words in stories will use them in speech and in writing. Second, reading improves concentration. When you follow a long story, your mind learns to stay with one idea. Third, reading is cheap. A library card costs very little, and a good book can be shared with friends. Some people say they have no time. However, twenty minutes is shorter than most tea breaks. For these reasons, I urge you to open a book tonight. Thank you.',
    q: {
      main: [
        ['What is the main idea of the talk?', 'Every learner should read.', 'Libraries should be closed.', 'Books are expensive.', 'Tea breaks are too long.'],
        ['Which title best fits the talk?', 'Read for Twenty Minutes a Day', 'The Price of Books', 'A Library Card', 'Read Every Day for Four Hours at Night'],
      ],
      detail: [
        ['How long should a learner read each day, according to the speaker?', 'at least twenty minutes', 'two hours', 'five minutes', 'one hour'],
        ['What does the speaker say reading builds?', 'vocabulary', 'muscles', 'houses', 'roads'],
      ],
      infer: [
        ['What does the speaker want the audience to do?', 'start reading tonight', 'stop reading', 'sell their books', 'skip school'],
        ['Why does the speaker mention tea breaks?', 'to show that twenty minutes is a short time', 'to say that tea is cheap', 'to say that tea breaks should end', 'to say that learners drink too much tea'],
      ],
      ctx: [
        ['In the talk, what does the word "concentration" mean?', 'the ability to keep your mind on one thing', 'a kind of drink', 'a place to read', 'the action of moving quickly from one place to another'],
        ['In the talk, what does the word "urge" mean?', 'strongly encourage', 'tell to leave', 'ask for money', 'refuse'],
      ],
      effect: [
        ['According to the speaker, what happens when you meet new words in stories?', 'You use them in speech.', 'You forget them.', 'You stop reading.', 'You become tired.'],
        ['According to the speaker, what does following a long story teach your mind?', 'to stay with one idea', 'to forget quickly', 'to sleep', 'to hurry'],
      ],
    },
  },
  {
    id: 'plastic-bags', title: 'Plastic Bags and Our Town', kind: 'listening',
    script: 'Listen to this short report. In our town, shopkeepers give out thousands of plastic bags every week. After use, many of the bags are thrown on the road. When the rains come, they are carried into the drains and block the water. As a result, the road floods and the mosquitoes breed in the standing water. The town council has now asked shops to sell strong cloth bags instead. Shoppers who bring their own bags will pay less. The council believes that within one year the drains will be cleaner and the town healthier.',
    q: {
      main: [
        ['What is the main idea of the report?', 'Plastic bags block drains.', 'Shops sell cloth.', 'Mosquitoes like rain.', 'The council sells drains.'],
        ['Which title best fits the report?', 'Cloth Bags Instead of Plastic', 'A Flood in the Shop', 'Mosquitoes of the Town', 'Plastic Bags for Every Shopper in Town'],
      ],
      detail: [
        ['What have shopkeepers been giving out?', 'plastic bags', 'cloth bags', 'free food', 'rain coats'],
        ['What will shoppers who bring their own bags do?', 'pay less', 'pay more', 'pay nothing', 'wait longer'],
      ],
      infer: [
        ['What does the council hope to achieve?', 'cleaner drains', 'more shops', 'more plastic', 'less rain'],
        ['Why will shoppers probably start to bring their own bags?', 'They will save money.', 'They dislike shopkeepers.', 'They want to throw bags away.', 'They enjoy floods.'],
      ],
      ctx: [
        ['In the report, what does the word "block" mean?', 'stop the flow of', 'start the flow of', 'carry away', 'clean'],
        ['In the report, what does the word "breed" mean?', 'produce young ones', 'wash away', 'run away', 'fall asleep'],
      ],
      effect: [
        ['What happens when plastic bags block the drains?', 'The road floods.', 'The road dries.', 'The shops close.', 'The rain stops.'],
        ['What happens in the standing water?', 'Mosquitoes breed.', 'Fish grow.', 'Bags disappear.', 'Roads are mended.'],
      ],
    },
  },
  {
    id: 'old-market', title: 'Should We Keep the Old Market?', kind: 'listening',
    script: 'Good evening. Tonight we discuss whether to keep the old market or to build a new one. Those who want to keep it say that it is close to the bus stage, and that traders have worked there for many years. However, others say that the old market is crowded and has no clean toilets. The new site would have wide paths, a roof and clean water. Some traders fear that they would lose their customers on the new site. The chairman suggests a compromise: build the new market near the old one, and let traders move in stages. We shall vote at the end of the month.',
    q: {
      main: [
        ['What is the main idea of the talk?', 'People are discussing whether.', 'The market sells clean water.', 'The bus stage is closing.', 'Traders have no customers.'],
        ['Which title best fits the talk?', 'The Old Market or a New One?', 'Clean Water for the Bus', 'The Chairman\'s Holiday', 'A New Hospital for the Whole Town'],
      ],
      detail: [
        ['When will the vote be held?', 'at the end of the month', 'tomorrow', 'next year', 'tonight'],
        ['What does the new site have?', 'wide paths, a roof', 'a bus stage', 'a school', 'a hospital'],
      ],
      infer: [
        ['Why do some traders fear moving?', 'They worry they might lose customers.', 'They want less work.', 'They dislike roofs.', 'They worry that the roof might fall down soon.'],
        ['What does the chairman\'s plan show?', 'He wants a fair solution.', 'He dislikes traders.', 'He wants to close the market.', 'He wants to avoid a vote.'],
      ],
      ctx: [
        ['In the talk, what does the word "compromise" mean?', 'a plan in which each side gives up something', 'a loud argument', 'a type of market', 'a quiet vote taken by only the oldest traders'],
        ['In the talk, what does the word "stages" mean in "move in stages"?', 'a few at a time', 'all at once', 'never', 'in the night'],
      ],
      effect: [
        ['Why do some people want to keep the old market?', 'It is close to the bus stage and traders have worked there for years.', 'It has clean toilets.', 'It is very new.', 'It has wide paths, a roof and clean water for all traders.'],
        ['Why do others want a new market?', 'The old one is crowded.', 'It is too small a price.', 'It is on a hill.', 'It is too quiet.'],
      ],
    },
  },
];
