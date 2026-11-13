// ============================================================================
// ENGLISH GRADE 8: ORIGINAL SHORT PASSAGES AND POEMS for the reading families. Written by Claude (13 Nov 2026), never copied or adapted from a
// textbook, a published story or a known poem. Kenyan names and places. Short sentences for a thirteen or fourteen-year-old.
// A prose passage has these question types, two of each: order, ctx, fact, infer, char, main, summary, lesson, setting, image.
// A poem has: persona, repeat, about, msg, image. A row is [question, right, wrong (a small detail), wrong (the opposite), wrong (not in the text)].
// The three wrong answers are always in that order, so the library codes (_DETAIL, _OPPOSITE, _NOTSAID) fit every type.
// DRAFT: a Kenyan English teacher reviews every passage before any child sees it.
// ============================================================================
export const PASSAGES = [
  {
    id: 'mandazi', title: 'The Boy Who Sold Mandazi', kind: 'story',
    text: 'Otieno was thirteen and lived in a small house near Kisumu. Every afternoon, when school ended, he carried a basket of mandazi to the bus stage and sold them to passengers.\n\nSome boys laughed at him. "Why do you sell food like a woman?" they asked. Otieno only smiled and counted his coins. The money paid for his books and his exam fees.\n\nOne day his teacher, Mrs Akinyi, saw him asleep at his desk. After class she asked what was wrong. Otieno told her the truth. The next week she asked the school to give him a small bursary. Otieno still sold mandazi on Saturdays, but now he had time to study every evening.',
    q: {
      order: [
        ['Which event happened first in the story?', 'Otieno sold mandazi at the bus stage after school.', 'Mrs Akinyi asked the school for a bursary.', 'Otieno fell asleep at his desk.', 'Otieno bought new books with the bursary.'],
        ['Which event happened last in the story?', 'Otieno had time to study every evening.', 'Some boys laughed at Otieno.', 'Otieno fell asleep at his desk.', 'Otieno bought a bus.'],
      ],
      ctx: [
        ['In the passage, what does the word "bursary" mean?', 'money given to help a learner pay for school', 'a basket for carrying food', 'a long holiday from school', 'a prize for the best runner'],
        ['In the passage, what does the word "passengers" mean?', 'people travelling on a bus', 'people who sell food', 'teachers at a school', 'people who laugh at others'],
      ],
      fact: [
        ['Where did Otieno sell the mandazi?', 'at the bus stage', 'at the school gate', 'at the market in Nairobi', 'at the church'],
        ['Who noticed Otieno asleep at his desk?', 'Mrs Akinyi', 'a bus driver', 'his mother', 'the head teacher'],
      ],
      infer: [
        ['Why was Otieno asleep at his desk?', 'He was tired from selling mandazi after school.', 'He did not like his lessons.', 'He had been given too many books.', 'He had stayed up to watch a match.'],
        ['What does the passage show about Otieno?', 'He worked hard so he could stay in school.', 'He was ashamed of his work.', 'He cared only about money.', 'He wanted to leave school.'],
      ],
      char: [
        ['Which word best describes Otieno?', 'hard-working', 'lazy', 'selfish', 'unkind'],
        ['Which line shows that Otieno did not let the laughing stop him?', 'Otieno only smiled and counted his coins.', 'Otieno was thirteen.', 'He lived near Kisumu.', 'He carried a basket.'],
      ],
      main: [
        ['What is the main idea of the passage?', 'A boy sells mandazi to pay for school and gets help from his teacher.', 'A boy lives near Kisumu.', 'A boy hates his classmates.', 'A teacher sells mandazi.'],
        ['Which title best fits the passage?', 'Otieno and the Mandazi Basket', 'Buses of Kisumu', 'Mrs Akinyi\'s Holiday', 'A Day at the Stadium'],
      ],
      summary: [
        ['Which is the best summary of the passage?', 'Otieno sells mandazi to pay for school; his teacher notices he is tired and helps him get a bursary.', 'Otieno sells mandazi on Saturdays only.', 'Otieno stops school and sells mandazi every day.', 'Mrs Akinyi sells mandazi and gives the money to Otieno.'],
        ['Which sentence is a key idea for a summary?', 'Mrs Akinyi helped Otieno get a bursary.', 'Otieno carried a basket.', 'Some boys laughed.', 'Otieno was thirteen.'],
      ],
      lesson: [
        ['What lesson does the story teach?', 'Honest work is nothing to be ashamed of, and people will help those who tell the truth.', 'Boys should not sell food.', 'Teachers should sell mandazi.', 'School is not important.'],
        ['What can we learn from Otieno telling his teacher the truth?', 'Telling the truth can bring help.', 'Telling the truth brings trouble.', 'Teachers dislike honest pupils.', 'It is better to sleep in class.'],
      ],
      setting: [
        ['Where does the story take place?', 'near Kisumu', 'in Nairobi', 'in a village in Kitui', 'in Mombasa'],
        ['When does Otieno sell the mandazi?', 'after school in the afternoon', 'early in the morning', 'at midnight', 'during the long holiday'],
      ],
      image: [
        ['What picture do the words "carried a basket of mandazi to the bus stage" give you?', 'a boy walking with a heavy basket to a busy place', 'a boy sleeping under a tree', 'a boy running away from school', 'a boy cooking at home'],
        ['Which line helps you picture Otieno\'s tiredness?', 'Mrs Akinyi saw him asleep at his desk.', 'Otieno was thirteen and lived near Kisumu.', 'The money paid for his books.', 'Some boys laughed at him.'],
      ],
    },
  },
  {
    id: 'bridge', title: 'The Bridge at Mto Mkubwa', kind: 'story',
    text: 'In the rainy season the river near Kathonzweni village rose very high. The children could not cross to school, and many stayed at home for weeks.\n\nOne evening Mzee Kimeu called the village together. "We cannot make the rain stop," he said, "but we can build a bridge." Some people laughed. Others said it was too hard.\n\nThe next morning, however, women brought poles, men brought stones and the children carried sand in small buckets. After nine days a strong footbridge crossed the river. When the first child walked over it to school, the whole village clapped.',
    q: {
      order: [
        ['Which event happened first in the story?', 'The river rose and children could not cross to school.', 'Mzee Kimeu called the village together.', 'The villagers brought poles and stones.', 'The first child crossed the bridge.'],
        ['Which event happened last in the story?', 'The first child walked over the bridge and the village clapped.', 'The river rose very high.', 'Some people said it was too hard.', 'Mzee Kimeu spoke to the people.'],
      ],
      ctx: [
        ['In the passage, what does the word "footbridge" mean?', 'a narrow bridge for people to walk across', 'a bridge for lorries', 'a pair of shoes', 'a kind of boat'],
        ['In the passage, what does the word "called" mean in "called the village together"?', 'asked people to come together', 'shouted at people to go away', 'sold something to the village', 'gave names to people'],
      ],
      fact: [
        ['How many days did it take to build the bridge?', 'nine days', 'one week', 'one month', 'three days'],
        ['What did the children carry?', 'sand in small buckets', 'poles on their heads', 'stones in bags', 'water in gourds'],
      ],
      infer: [
        ['Why did the villagers clap when the first child crossed?', 'They were proud that their work had succeeded.', 'They wanted the child to hurry.', 'They were angry with the child.', 'They did not like the bridge.'],
        ['What does the passage show about Mzee Kimeu?', 'He is a wise leader who encourages people to act.', 'He is afraid of the river.', 'He dislikes children.', 'He wants to stop the rain.'],
      ],
      char: [
        ['Which word best describes Mzee Kimeu?', 'determined', 'careless', 'selfish', 'frightened'],
        ['Which line shows that the villagers worked together?', 'Women brought poles, men brought stones and children carried sand.', 'The river rose very high.', 'Some people laughed.', 'Children stayed at home for weeks.'],
      ],
      main: [
        ['What is the main idea of the passage?', 'The villagers work together to build a bridge so the children can go to school.', 'A river rises in the rainy season.', 'Mzee Kimeu is an old man.', 'Children like to carry sand.'],
        ['Which title best fits the passage?', 'The Village Builds a Bridge', 'Rain in Kathonzweni', 'A Boat on the River', 'The Old Man\'s Holiday'],
      ],
      summary: [
        ['Which is the best summary of the passage?', 'A river kept children from school, so the village built a footbridge together in nine days.', 'Mzee Kimeu stopped the rain.', 'The villagers argued and did nothing.', 'The children crossed in boats.'],
        ['Which sentence is a key idea for a summary?', 'The whole village built a bridge so children could cross to school.', 'The children carried buckets.', 'Some people laughed.', 'Mzee Kimeu called the village.'],
      ],
      lesson: [
        ['What lesson does the story teach?', 'People can solve big problems when they work together.', 'Rain is always harmful.', 'Old men should do all the work.', 'Children should never carry sand.'],
        ['What can we learn from the villagers?', 'A hard task is easier when everyone helps.', 'A hard task should be left alone.', 'Only men can build bridges.', 'It is wrong to laugh.'],
      ],
      setting: [
        ['Where does the story take place?', 'in Kathonzweni village', 'in Nairobi', 'on the coast', 'in a town on a lake'],
        ['In which season does the story begin?', 'the rainy season', 'the dry season', 'the cold season', 'the harvest season'],
      ],
      image: [
        ['What picture do the words "women brought poles, men brought stones" give you?', 'a busy crowd all helping with the work', 'a quiet empty river', 'a village asleep', 'a market with food'],
        ['Which line helps you picture the high river?', 'The river rose very high.', 'Mzee Kimeu called the village together.', 'The first child walked over it.', 'The villagers clapped.'],
      ],
    },
  },
  {
    id: 'seeds', title: 'Grandmother\'s Seeds', kind: 'story',
    text: 'Nyambura\'s grandmother kept a small gourd of maize seeds on a shelf in her kitchen. Every year she kept the best seeds for the next planting.\n\nOne year the rains failed. The crops in the village dried up and the families had no seed left. Grandmother opened her gourd. "Take these," she told her neighbours. "We shall plant together."\n\nNyambura worried that there would not be enough for their own shamba. "A seed shared grows twice," said Grandmother. When the rains returned, every farm in the village was green. At harvest time the neighbours came back with sacks of maize to thank her.',
    q: {
      order: [
        ['Which event happened first in the story?', 'Grandmother kept the best seeds in a gourd.', 'The rains failed.', 'Grandmother gave seed to her neighbours.', 'The neighbours brought sacks of maize.'],
        ['Which event happened last in the story?', 'The neighbours came with sacks of maize to thank her.', 'The rains failed.', 'Grandmother opened her gourd.', 'Nyambura worried about their shamba.'],
      ],
      ctx: [
        ['In the passage, what does the word "shamba" mean?', 'a small farm', 'a kitchen shelf', 'a bag of seeds', 'a village market'],
        ['In the passage, what does the word "harvest" mean?', 'the time when crops are gathered', 'the time when seeds are planted', 'a long dry season', 'a gift for a neighbour'],
      ],
      fact: [
        ['Where did Grandmother keep the seeds?', 'in a gourd on a shelf', 'in a box under the bed', 'in a sack in the shamba', 'in a bucket by the door'],
        ['What did the neighbours bring at harvest time?', 'sacks of maize', 'new seeds', 'goats', 'money'],
      ],
      infer: [
        ['Why did Nyambura worry?', 'She thought their own farm might not have enough seed.', 'She did not like her neighbours.', 'She wanted to leave the village.', 'She was afraid of the rain.'],
        ['What does the passage show about Grandmother?', 'She is generous and wise.', 'She is selfish.', 'She is careless.', 'She is afraid of her neighbours.'],
      ],
      char: [
        ['Which word best describes Grandmother?', 'generous', 'greedy', 'lazy', 'rude'],
        ['Which line shows that Grandmother is generous?', '"Take these," she told her neighbours.', 'Grandmother kept a small gourd.', 'The rains failed.', 'Nyambura worried.'],
      ],
      main: [
        ['What is the main idea of the passage?', 'Grandmother shares her seeds in a drought and the village is rewarded.', 'A gourd is kept on a shelf.', 'The rains fail every year.', 'Nyambura worries about seed.'],
        ['Which title best fits the passage?', 'A Seed Shared Grows Twice', 'The Gourd on the Shelf', 'The Day the Rain Failed', 'Nyambura Leaves the Village'],
      ],
      summary: [
        ['Which is the best summary of the passage?', 'When the rains failed, Grandmother shared her seed with neighbours, and later the whole village had a harvest and thanked her.', 'Grandmother kept her seed and sold it.', 'The rains failed and everyone left.', 'Nyambura planted alone.'],
        ['Which sentence is a key idea for a summary?', 'Grandmother shared her seeds with the neighbours.', 'The gourd was on a shelf.', 'Nyambura worried.', 'The kitchen was small.'],
      ],
      lesson: [
        ['What lesson does the story teach?', 'Sharing in hard times helps everyone.', 'Keep all you have for yourself.', 'Seeds are not important.', 'Rain always comes on time.'],
        ['What does "A seed shared grows twice" mean?', 'Sharing brings a greater reward.', 'Seeds should be hidden.', 'Seeds grow only in gourds.', 'Planting twice is wrong.'],
      ],
      setting: [
        ['Where were the seeds kept?', 'in Grandmother\'s kitchen', 'in the church', 'at the school', 'in the market'],
        ['What was happening to the village when Grandmother opened her gourd?', 'The rains had failed and crops had dried up.', 'There was a flood.', 'There was a festival.', 'There was a war.'],
      ],
      image: [
        ['What picture do the words "every farm in the village was green" give you?', 'fields full of healthy young plants', 'dry brown fields', 'empty roads', 'a market of seeds'],
        ['Which line helps you picture the drought?', 'The crops in the village dried up.', 'Grandmother kept a small gourd.', 'Nyambura worried.', 'The neighbours thanked her.'],
      ],
    },
  },
  {
    id: 'gikomba', title: 'Dawn at the Market', kind: 'description',
    text: 'Before the sun rises, the market in the town is already awake. Lorries growl through the gate and men carry sacks of potatoes on their backs. The air smells of fresh coriander and wood smoke.\n\nMama Wanza arranges her tomatoes in neat red pyramids. Her hands move quickly, because the first buyers arrive early. A boy shouts, "Sukuma! Sukuma wiki, five shillings a bunch!" Somewhere a radio plays a happy song.\n\nBy seven o\'clock the aisles are full of people, bargaining and laughing. Mama Wanza wipes her forehead and smiles. Another busy day has begun.',
    q: {
      order: [
        ['Which event happens first in the passage?', 'Lorries and men with sacks arrive at the gate.', 'The aisles fill with people.', 'Mama Wanza wipes her forehead.', 'A boy shouts about sukuma wiki.'],
        ['Which event happens last in the passage?', 'Mama Wanza smiles as the busy day begins.', 'The lorries growl through the gate.', 'Mama Wanza arranges her tomatoes.', 'A radio plays a song.'],
      ],
      ctx: [
        ['In the passage, what does the word "bargaining" mean?', 'discussing a price to agree on it', 'throwing goods away', 'carrying heavy sacks', 'cooking food'],
        ['In the passage, what does the word "aisles" mean?', 'the paths between stalls', 'the roofs of the stalls', 'the shops outside', 'the lorries at the gate'],
      ],
      fact: [
        ['What does Mama Wanza sell?', 'tomatoes', 'potatoes', 'coriander', 'maize'],
        ['How much is a bunch of sukuma wiki?', 'five shillings', 'ten shillings', 'one shilling', 'fifty shillings'],
      ],
      infer: [
        ['Why do Mama Wanza\'s hands move quickly?', 'The first buyers come early and she wants to be ready.', 'She is angry with the buyers.', 'She wants to close the stall.', 'She is afraid of the lorries.'],
        ['What does the passage show about the market?', 'It is a busy and lively place.', 'It is quiet and empty.', 'It is closed early.', 'It is dangerous.'],
      ],
      char: [
        ['Which word best describes Mama Wanza?', 'hard-working', 'lazy', 'unfriendly', 'careless'],
        ['Which line shows that Mama Wanza is hard-working?', 'Her hands move quickly, because the first buyers arrive early.', 'The market is already awake.', 'A radio plays a song.', 'The air smells of coriander.'],
      ],
      main: [
        ['What is the main idea of the passage?', 'It describes a busy market at dawn and Mama Wanza starting her day.', 'It tells how to grow tomatoes.', 'It explains how lorries work.', 'It describes a school morning.'],
        ['Which title best fits the passage?', 'A Busy Dawn at the Market', 'Growing Sukuma Wiki', 'A Lorry Breaks Down', 'The Radio Song'],
      ],
      summary: [
        ['Which is the best summary of the passage?', 'The market wakes up before sunrise, and Mama Wanza prepares her stall as the aisles fill with buyers.', 'Mama Wanza sells all her tomatoes at midnight.', 'The market is closed in the morning.', 'A boy sells radios in the market.'],
        ['Which sentence is a key idea for a summary?', 'The market is busy early in the morning.', 'The boy sells sukuma wiki.', 'A radio plays a song.', 'Mama Wanza has red tomatoes.'],
      ],
      lesson: [
        ['What does the passage suggest about starting early?', 'People who start early are ready for the day.', 'Mornings are a waste of time.', 'Markets should open at noon.', 'Buyers dislike early mornings.'],
        ['Why does the writer end with "Another busy day has begun"?', 'to show that the day\'s work is only starting', 'to show that the market is closed', 'to show that Mama Wanza is angry', 'to show that the day is ending'],
      ],
      setting: [
        ['Where does the passage take place?', 'in a town market', 'in a classroom', 'in a village church', 'on a bus'],
        ['At what time of day does the passage begin?', 'before sunrise', 'at noon', 'in the evening', 'at midnight'],
      ],
      image: [
        ['What picture do the words "neat red pyramids" give you?', 'tomatoes piled carefully in tidy heaps', 'tomatoes thrown on the ground', 'tomatoes in a basket', 'tomatoes being cooked'],
        ['Which line helps you picture the smell of the market?', 'The air smells of fresh coriander and wood smoke.', 'Mama Wanza wipes her forehead.', 'A boy shouts.', 'By seven o\'clock the aisles are full.'],
      ],
    },
  },
  {
    id: 'poem-drum', title: 'The Drum Speaks', kind: 'poem',
    text: 'I am the drum, I am the drum,\nI beat when the harvest has come.\nBoom, boom, I call the farmers in,\nBoom, boom, let the dancing begin.\n\nI am the drum, I am the drum,\nI beat when the lost one has come.\nBoom, boom, I tell the village, "Greet!"\nBoom, boom, the children run to meet.\n\nI am the drum, I am the drum,\nI keep the heartbeat of our home.\nBoom, boom, I carry joy to all,\nBoom, boom, I answer every call.',
    q: {
      persona: [
        ['Who is speaking in the poem?', 'the drum', 'a farmer', 'a child', 'the village'],
        ['Who is the persona of the poem?', 'a drum that calls the village together', 'a dancer who loves the harvest', 'a child lost in the village', 'a farmer who sells drums'],
      ],
      repeat: [
        ['Which line is repeated at the start of every stanza?', 'I am the drum, I am the drum,', 'Boom, boom, I carry joy to all,', 'I beat when the harvest has come.', 'Boom, boom, let the dancing begin.'],
        ['Which words are repeated in the poem to copy the sound of the drum?', 'Boom, boom', 'I am', 'the village', 'the children'],
      ],
      about: [
        ['What is the poem about?', 'how a drum calls and joins the village in its happy times', 'how to make a drum', 'a farmer who loses his drum', 'a village that has no music'],
        ['What does the drum do in the poem?', 'It brings the people together.', 'It scares the children.', 'It stops the dancing.', 'It breaks in the rain.'],
      ],
      msg: [
        ['What message does the poem give?', 'Music and drums bring people together in joy.', 'Drums are loud and annoying.', 'Only farmers can play drums.', 'Villages should be silent.'],
        ['Why does the poet repeat "I am the drum"?', 'to stress who is speaking and how important the drum is', 'to fill the page', 'to show that the drum is broken', 'to show that the drum is afraid'],
      ],
      image: [
        ['What picture do the words "the children run to meet" give you?', 'happy children hurrying towards someone', 'children asleep', 'children at school', 'children afraid'],
        ['Which line helps you hear the drum?', 'Boom, boom, I call the farmers in,', 'I keep the heartbeat of our home.', 'I beat when the lost one has come.', 'I carry joy to all.'],
      ],
    },
  },
  {
    id: 'poem-hands', title: 'My Mother\'s Hands', kind: 'poem',
    text: 'My mother\'s hands are rough and strong,\nThey have been working all day long.\nThey plant the seed, they stir the stew,\nThey hold me close when I am blue.\n\nMy mother\'s hands are rough and wise,\nThey close my books, they dry my eyes.\nThey wave me off at the school gate,\nThey wait for me when I am late.\n\nMy mother\'s hands are rough and kind,\nThe best of all the hands I find.\nWhen I am big I hope to be\nAs strong and loving as she.',
    q: {
      persona: [
        ['Who is speaking in the poem?', 'a child talking about his or her mother', 'a mother talking to a teacher', 'a farmer talking about seeds', 'a teacher talking about school'],
        ['Who is the poem mostly about?', 'the speaker\'s mother', 'the speaker\'s teacher', 'a farmer', 'a doctor'],
      ],
      repeat: [
        ['Which words are repeated at the start of every stanza?', 'My mother\'s hands are rough', 'They have been working', 'They plant the seed', 'When I am big'],
        ['Why does the poet repeat the word "hands"?', 'to show how much the mother\'s hands do for the child', 'to count the fingers', 'to rhyme with every line', 'to show that the poet is tired'],
      ],
      about: [
        ['What is the poem about?', 'the love and hard work shown by a mother\'s hands', 'how to plant seeds', 'a long journey to school', 'a sick child in hospital'],
        ['Which job do the mother\'s hands do in the poem?', 'dry the child\'s eyes', 'build a house', 'drive a bus', 'write a letter'],
      ],
      msg: [
        ['What message does the poem give?', 'We should value the hard work and love of our parents.', 'Rough hands are ugly.', 'Mothers should not work.', 'Children should work all day.'],
        ['What does the speaker want when he or she is big?', 'to be as strong and loving as the mother', 'to have soft hands', 'to leave home', 'to stop going to school'],
      ],
      image: [
        ['What picture do the words "rough and strong" give you?', 'hands toughened by hard work', 'smooth and soft hands', 'tiny hands', 'cold hands'],
        ['Which line helps you picture the mother waiting?', 'They wait for me when I am late.', 'They plant the seed.', 'They stir the pot.', 'They close my books.'],
      ],
    },
  },
];

// ============================================================================
// LISTENING SCRIPTS: read aloud by a teacher or by the voice tutor; the child does NOT see the text. Every family on these needs audio
// (needsAudio: true). Original, Kenyan settings, short sentences. Question types, two of each: main, detail, effect, infer, ctx.
// Row: [question, right, wrong (a small detail), wrong (the opposite), wrong (not said)]. DRAFT: a Kenyan English teacher checks every script.
// ============================================================================
export const LISTENS = [
  {
    id: 'late-bus', title: 'Why the Bus Was Late', kind: 'listening',
    script: 'Listen carefully. Last Tuesday the bus from Machakos to Nairobi was two hours late. The night before, heavy rain had fallen on the hills. By morning the water had covered the road near the river, so the driver, Mr Mwangi, had to wait. He did not want to drive through deep water because it could damage the engine. At nine o\'clock the water went down and the bus set off slowly. Because of the delay, many passengers missed their appointments. Mr Mwangi apologised to them and promised to leave earlier the next time it rains.',
    q: {
      main: [
        ['What is the main idea of the talk?', 'Heavy rain made the bus late.', 'Mr Mwangi lives in Machakos.', 'Buses are cheap in Kenya.', 'Passengers love long journeys.'],
        ['Which title best fits the talk?', 'The Late Bus After the Rain', 'A New Engine for the Bus', 'The Hills of Machakos', 'A Bus Race to Nairobi'],
      ],
      detail: [
        ['How late was the bus?', 'two hours', 'ten minutes', 'one day', 'half an hour'],
        ['At what time did the water go down?', 'nine o\'clock', 'six o\'clock', 'noon', 'midnight'],
      ],
      effect: [
        ['Why did the driver have to wait?', 'The water covered the road near the river.', 'The bus had no fuel.', 'The passengers were late.', 'The road was dry.'],
        ['What happened to many passengers because of the delay?', 'They missed their appointments.', 'They got free tickets.', 'They reached early.', 'They changed buses.'],
      ],
      infer: [
        ['What does the talk show about Mr Mwangi?', 'He is a careful driver who cares about his passengers.', 'He does not care about the engine.', 'He is always late.', 'He dislikes rain.'],
        ['What will Mr Mwangi probably do the next time it rains?', 'Leave earlier.', 'Stay at home for a week.', 'Drive faster.', 'Sell the bus.'],
      ],
      ctx: [
        ['In the talk, what does the word "delay" mean?', 'waiting longer than expected', 'a quick journey', 'a kind of engine', 'a road sign'],
        ['In the talk, what does the word "apologised" mean?', 'said sorry', 'shouted at', 'thanked', 'ignored'],
      ],
    },
  },
  {
    id: 'sports-notice', title: 'A Notice at Assembly', kind: 'listening',
    script: 'Good morning, learners. Please listen to this notice. Our sports day will not be on Friday as planned. The field is still wet after the rain, and it is not safe to run on it. Sports day will now be on Monday. Everyone must bring a water bottle and wear sports shoes. Parents are welcome to come and cheer for their children. The events will begin at nine o\'clock and end at noon. Mrs Wambui, the games teacher, will give the prizes. Thank you for listening.',
    q: {
      main: [
        ['What is the main idea of the notice?', 'Sports day has been moved to Monday.', 'The field is a new one.', 'Prizes are free.', 'Parents must not come.'],
        ['Which title best fits the notice?', 'Sports Day Moves to Monday', 'A New Sports Shoe', 'Rain on the Roof', 'The Games Teacher\'s Holiday'],
      ],
      detail: [
        ['At what time will the events begin?', 'nine o\'clock', 'eight o\'clock', 'noon', 'two o\'clock'],
        ['Who will give the prizes?', 'Mrs Wambui', 'the head teacher', 'a parent', 'the school driver'],
      ],
      effect: [
        ['Why was sports day moved?', 'The field was still wet after the rain.', 'The teachers were away.', 'The prizes had not arrived.', 'The learners were ill.'],
        ['What must the learners bring?', 'a water bottle and sports shoes', 'a lunch box and a hat', 'a book and a pen', 'a ball and a rope'],
      ],
      infer: [
        ['What does the notice show about the school?', 'It cares about the safety of its learners.', 'It does not like sports.', 'It dislikes parents.', 'It never has sports days.'],
        ['What will probably happen on Monday?', 'The learners will take part in sports.', 'The school will be closed.', 'It will be a test day.', 'The field will be dug up.'],
      ],
      ctx: [
        ['In the notice, what does the word "events" mean?', 'the races and games of the day', 'the prizes for winners', 'the teachers\' names', 'the shoes of the learners'],
        ['In the notice, what does the word "welcome" mean in "Parents are welcome"?', 'allowed and happily invited', 'told to leave', 'forbidden', 'asked to pay'],
      ],
    },
  },
  {
    id: 'mango-talk', title: 'A Talk About Mangoes', kind: 'listening',
    script: 'Today I shall tell you about the mango tree. The mango grows well in warm places such as the coast of Kenya. Farmers plant the young trees at the start of the rains. After about four years the tree gives its first fruit. Mangoes are rich in vitamins, so doctors say they help us stay healthy. Many families sell the extra fruit at the roadside to earn money. However, if mangoes are not picked in time, they fall and rot. For this reason, farmers pick them early in the morning and carry them carefully to the market.',
    q: {
      main: [
        ['What is the main idea of the talk?', 'The mango tree grows well in warm places and gives healthy fruit that farmers sell.', 'Mangoes are red.', 'Roadsides are busy.', 'Doctors plant mangoes.'],
        ['Which title best fits the talk?', 'All About the Mango Tree', 'Doctors at the Coast', 'A Road to the Market', 'The Rainy Season'],
      ],
      detail: [
        ['After about how many years does the tree give its first fruit?', 'four years', 'one year', 'ten years', 'two months'],
        ['When do farmers plant the young trees?', 'at the start of the rains', 'in the dry season', 'at midnight', 'after the harvest'],
      ],
      effect: [
        ['Why do doctors say mangoes help us stay healthy?', 'They are rich in vitamins.', 'They are very sweet.', 'They are large.', 'They are cheap.'],
        ['What happens to mangoes that are not picked in time?', 'They fall and rot.', 'They grow bigger.', 'They turn into trees.', 'They become sweeter.'],
      ],
      infer: [
        ['What does the talk show about farmers?', 'They take care to protect their fruit.', 'They do not care about their fruit.', 'They dislike the market.', 'They plant mangoes in snow.'],
        ['Why do farmers pick mangoes early in the morning?', 'to save them before they fall and rot', 'because the market is closed', 'because doctors ask them to', 'because the sun is too weak'],
      ],
      ctx: [
        ['In the talk, what does the word "vitamins" mean?', 'substances in food that keep the body healthy', 'a kind of fruit tree', 'a type of market', 'a road sign'],
        ['In the talk, what does the word "extra" mean in "the extra fruit"?', 'more than the family needs', 'less than the family needs', 'the best fruit', 'the smallest fruit'],
      ],
    },
  },
];
