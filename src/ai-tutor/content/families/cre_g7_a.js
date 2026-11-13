// ============================================================================
// CRE GRADE 7, A (8 skills): the value of CRE, the two accounts of creation, stewardship of animals, plants and natural resources, the
// functions, divisions and translation of the Bible. Written offline from the KICD design through the curriculum map. Every wrong answer
// names the library misconception it reveals. All stay reviewed:false until a CRE teacher signs them off. Values and attitudes are not tapped.
// ============================================================================
import { S } from './cre_g7_lib.js';
const OV = 'OVERVI.IMPORTANCE_OF_STUDYING_C.', AC = 'CREATI.ACCOUNTS_OF_CREATION.', ST = 'CREATI.STEWARDSHIP_OVER_CREATIO.', PL = 'CREATI.RESPONSIBILITY_OVER_PLAN.', NR = 'CREATI.USE_OF_NATURAL_RESOURCES.';
const FB = 'THE_BI.FUNCTIONS_OF_THE_BIBLE.', DB = 'THE_BI.DIVISIONS_OF_THE_BIBLE.', TR = 'THE_BI.BIBLE_TRANSLATION.';

export const FAMILIES = [
  ...S('cv', OV, 'CRE_VALUE', ['CV_MARKS', 'CV_CHURCH_ONLY', 'CV_VALUE_MIX'], ['CRE helps us know God and live well.', 'Values are shown everywhere, not only in church.'], [
    ['Why do we learn Christian Religious Education?', 'To grow in good values and know God', 'Only to pass the exams', 'Only to please the teacher', 'Only to read old stories'],
    ['Where should a learner show the values learnt in CRE?', 'At home, at school and in church', 'Only inside the church', 'Only in the CRE class', 'Only on Sundays'],
    ['Which is a value taught in CRE?', 'Honesty', 'Cheating', 'Stealing', 'Laziness'],
    ['Which value helps us live well with others?', 'Respect', 'Pride', 'Anger', 'Greed'],
    ['How does CRE help a learner?', 'It helps the learner live responsibly', 'It helps the learner avoid all work', 'It helps the learner stay away from people', 'It helps the learner win every game'],
  ], [
    ['Achieng returns a lost phone to its owner. Which value does she show?', 'Honesty', 'Cheating', 'Pride', 'Laziness'],
    ['Peter says CRE matters only in church. What can you tell him?', 'Values are lived at home and school too', 'He is right, it is for church only', 'He is right, it is for Sundays only', 'He is right, it is for adults only'],
    ['Wekesa says CRE is only for passing exams. What is a better view?', 'It helps us grow in values and know God', 'It is only for passing exams', 'It is only for marks in school', 'It is for nothing useful'],
    ['A class listens to each other kindly. Which value is this?', 'Respect', 'Anger', 'Greed', 'Pride'],
    ['Mary shares her lunch with a hungry friend. Which value is this?', 'Love and sharing', 'Greed', 'Cheating', 'Pride'],
  ], [
    ['Which step is the mistake?', 'Step 1: CRE teaches values.', 'Step 2: Values are shown in daily life.', 'Step 3: So values are only for the church building.', 'Values are shown at home, school and church.', 1],
    ['Which step is the mistake?', 'Step 1: CRE helps us know God.', 'Step 2: It also helps us grow in values.', 'Step 3: So CRE is only for passing exams.', 'CRE helps us know God and grow in values.', 0],
    ['Which step is the mistake?', 'Step 1: Honesty is telling the truth.', 'Step 2: CRE teaches honesty.', 'Step 3: So cheating is also a value learnt in CRE.', 'Cheating is not a value; honesty is.', 2],
    ['Which step is the mistake?', 'Step 1: Respect is a value.', 'Step 2: It helps people live together.', 'Step 3: So we show it only to our friends.', 'We show respect to everyone.', 1],
    ['Which step is the mistake?', 'Step 1: Responsible living is a CRE aim.', 'Step 2: It means caring for self and others.', 'Step 3: So it means doing only what pleases me.', 'Responsible living means caring for self and others.', 2],
  ], ['a', 'b']),
  ...S('ct', AC, 'CREATION_TWO', ['CT_SEVEN', 'CT_DUST', 'CT_ATTRIBUTE'], ['Genesis 1: six days of work and a day of rest. Genesis 2: man formed from the dust.', 'The accounts show God as powerful and good.'], [
    ['In Genesis 1, how many days did God work before resting?', 'Six days', 'Seven days', 'Five days', 'Ten days'],
    ['In which account is the man formed from the dust?', 'The second account in Genesis 2', 'The first account in Genesis 1', 'Neither account', 'The account of Noah'],
    ['Which attribute of God do the creation accounts show?', 'God is powerful and creator', 'God is weak and distant', 'God is unfair and careless', 'God is unknown to all'],
    ['On which day did God rest in Genesis 1?', 'The seventh day', 'The first day', 'The third day', 'The sixth day'],
    ['Who did God create last in the first account?', 'Human beings', 'Animals', 'Plants', 'Birds'],
  ], [
    ['A teacher says God made light on the first day. Which account is this?', 'The first, in Genesis 1', 'The second, in Genesis 2', 'The account of Noah', 'The account of Moses'],
    ['A learner says God breathed life into the man. Which account is this?', 'The second, in Genesis 2', 'The first, in Genesis 1', 'The account of Abraham', 'The account of David'],
    ['A class lists attributes of God from creation. Which is right?', 'Orderly and powerful', 'Weak and careless', 'Cruel and unfair', 'Unknown and hidden'],
    ['After six days of work, what did God do?', 'Rested on the seventh day', 'Created more on the seventh day', 'Stopped caring for creation', 'Destroyed what He made'],
    ['In Genesis 2, where did God place the man?', 'In the garden of Eden', 'In the desert', 'On a mountain', 'In a city'],
  ], [
    ['Which step is the mistake?', 'Step 1: Genesis 1 tells of creation in days.', 'Step 2: Genesis 1 has six days of work.', 'Step 3: So God worked seven days and did not rest.', 'God worked six days and rested on the seventh.', 0],
    ['Which step is the mistake?', 'Step 1: Genesis 2 tells of the man.', 'Step 2: God formed him from the dust.', 'Step 3: So the man from the dust is in Genesis 1.', 'The man formed from the dust is in Genesis 2.', 1],
    ['Which step is the mistake?', 'Step 1: God created all things.', 'Step 2: This shows His power.', 'Step 3: So God is weak.', 'The accounts show that God is powerful.', 2],
    ['Which step is the mistake?', 'Step 1: Human beings were made in God\'s image.', 'Step 2: This is in the first account.', 'Step 3: So humans were made first of all creatures.', 'Human beings were made last in the first account.', 2],
    ['Which step is the mistake?', 'Step 1: God rested on the seventh day.', 'Step 2: He blessed that day.', 'Step 3: So He created more things on the seventh day.', 'He rested and created no more.', 0],
  ], ['a', 'b', 'c']),
  ...S('sa', ST, 'STEWARD_ANIMALS', ['SA_RULE_HARM', 'SA_PROTECT', 'SA_NOT_MINE'], ['God asked people to care for animals, fish and birds.', 'Creation belongs to God.'], [
    ['What does "rule over the animals" mean?', 'To care for and look after them', 'To harm them as one likes', 'To sell them all at once', 'To ignore them'],
    ['Which protects animals, fish and birds?', 'Keeping rivers and nests safe', 'Polluting the river', 'Burning the forest', 'Hunting without a licence'],
    ['To whom does creation belong?', 'To God, who gave us its care', 'To people, to use as they wish', 'To the strongest person', 'To nobody'],
    ['Which action helps birds?', 'Leaving their nests alone', 'Throwing stones at nests', 'Cutting all the trees', 'Catching chicks for fun'],
    ['Which action helps fish?', 'Keeping the water clean', 'Pouring chemicals in the river', 'Using poison to catch them', 'Dumping rubbish in the lake'],
  ], [
    ['Akinyi sees a bird\'s nest in a tree. What should she do?', 'Leave it so the birds stay safe', 'Throw it down just for fun and play', 'Take the eggs home to cook them', 'Cut down the tree to get at it'],
    ['A fisherman wants to use poison to catch fish. Is this good stewardship?', 'No, it harms the fish and the river', 'Yes, because it saves him some time', 'Yes, because all the fish belong to him', 'Yes, because God allows all ways'],
    ['A boy says animals are his to harm. What can you tell him?', 'God asked us to care for them', 'He is right, they are his', 'He is right, they are for fun', 'He is right, they cannot feel'],
    ['A class cleans a river bank. Why is this good?', 'It protects fish and water life', 'It makes the river more dirty', 'It chases the fish far away', 'It does nothing at all for them'],
    ['A farmer gives his cow shelter and water. What is this?', 'Good care of an animal', 'Wasting money', 'Spoiling the cow', 'Ignoring God\'s word'],
  ], [
    ['Which step is the mistake?', 'Step 1: God gave people care of the animals.', 'Step 2: Ruling means caring for them.', 'Step 3: So we may harm them as we like.', 'Ruling means caring, not harming.', 1],
    ['Which step is the mistake?', 'Step 1: Rivers are home to fish.', 'Step 2: Pollution harms fish.', 'Step 3: So polluting the river protects fish.', 'Keeping rivers clean protects fish.', 2],
    ['Which step is the mistake?', 'Step 1: God created the animals.', 'Step 2: God cares for them.', 'Step 3: So animals belong only to people.', 'Creation belongs to God.', 2],
    ['Which step is the mistake?', 'Step 1: Birds build nests.', 'Step 2: Nests keep eggs safe.', 'Step 3: So we should destroy nests.', 'We should leave nests alone.', 2],
    ['Which step is the mistake?', 'Step 1: Animals need food and shelter.', 'Step 2: Owners can give them.', 'Step 3: So owners may leave animals hungry.', 'Owners should feed and shelter animals.', 0],
  ], ['a', 'b']),
  ...S('sp', PL, 'STEWARD_PLANTS', ['SP_WASTE', 'SP_FOOD', 'SP_INCOME'], ['Plants are for food, and we are to care for the garden.', 'When we cut a tree we plant another.'], [
    ['What should we do after cutting a tree?', 'Plant another tree', 'Plant nothing', 'Cut more trees', 'Burn the stump'],
    ['Why did God give plants?', 'For food and to be cared for', 'Only to look at', 'Only for firewood', 'Only for animals'],
    ['How can caring for crops help a family?', 'It can give food and income', 'It cannot help at all', 'It only wastes time', 'It only brings pests'],
    ['Which action protects the land?', 'Planting trees', 'Cutting all the trees', 'Burning the grass', 'Leaving soil bare'],
    ['Where does the Bible say God put the man to care for plants?', 'In the garden of Eden', 'In the desert', 'On a ship', 'In a city'],
  ], [
    ['Mutua cuts a tree for firewood. What should he do next?', 'Plant a new tree', 'Cut another tree', 'Leave the land bare', 'Burn the rest of the trees'],
    ['A farmer grows maize and sells some. What does this show?', 'Crops give food and income', 'Crops give no use', 'Crops harm the family', 'Crops should not be sold'],
    ['A child says plants are only for looking at. What is a better answer?', 'They give food and care for the land', 'He is right', 'They give only shade', 'They give only noise'],
    ['A school plants trees on its compound. Why is this good?', 'It cares for creation and helps the land', 'It wastes the compound', 'It harms the school', 'It makes the land dry'],
    ['A family grows vegetables in a garden. What does this show?', 'Responsible use of plants', 'Wasting time', 'Harming the soil', 'Ignoring God'],
  ], [
    ['Which step is the mistake?', 'Step 1: Trees give wood and shade.', 'Step 2: People cut trees for use.', 'Step 3: So there is no need to plant more.', 'We plant new trees when we cut old ones.', 2],
    ['Which step is the mistake?', 'Step 1: God gave plants for food.', 'Step 2: People are to care for them.', 'Step 3: So plants are only for decoration.', 'Plants are for food and care.', 2],
    ['Which step is the mistake?', 'Step 1: Crops need care.', 'Step 2: Good care gives a good harvest.', 'Step 3: So crops cannot give income.', 'A good harvest can give income.', 2],
    ['Which step is the mistake?', 'Step 1: Trees hold soil in place.', 'Step 2: Cutting them can cause erosion.', 'Step 3: So cutting more trees prevents erosion.', 'Planting trees prevents erosion.', 2],
    ['Which step is the mistake?', 'Step 1: People were put in the garden to take care of it.', 'Step 2: Care includes planting and watering.', 'Step 3: So care means leaving it alone to dry.', 'Care includes watering and planting.', 2],
  ], ['a', 'c']),
  ...S('ru', NR, 'RESOURCES_USE', ['RU_MISUSE', 'RU_EFFECT', 'RU_GOOD'], ['Careful use protects resources; misuse harms them.', 'Think of what happens to land and water.'], [
    ['Which is a misuse of water?', 'Pouring waste into the river', 'Washing hands', 'Watering crops', 'Drinking clean water'],
    ['Which is an effect of cutting trees without replanting?', 'Soil erosion and drought', 'More rain for ever', 'Better soil', 'More clean water'],
    ['Which is a good use of soil?', 'Planting crops and covering it', 'Leaving it bare', 'Burning it', 'Washing it away'],
    ['Which is a good use of water?', 'Drinking and farming', 'Pouring oil in the river', 'Wasting it at a tap', 'Leaving it to spill'],
    ['What does the Bible teach about natural resources?', 'Use them carefully', 'Waste them freely', 'Ignore them', 'Sell them all'],
  ], [
    ['A factory pours waste into a river. What may happen?', 'People and fish fall sick', 'The river gets cleaner', 'More fish appear', 'The water turns sweet'],
    ['A farmer plants trees on a slope. Why is this good?', 'It stops soil being washed away', 'It makes the soil bare', 'It dries the river', 'It removes the rain'],
    ['A tap is left running all day. What is this?', 'Misuse of water', 'Good use of water', 'Saving water', 'Protecting water'],
    ['Cutting trees with no replanting leads to what?', 'Drought and erosion', 'More rainfall', 'More fruit', 'Cooler weather always'],
    ['A family uses river water to farm and keeps the river clean. What is this?', 'Good use of a resource', 'Misuse of a resource', 'Wasting a resource', 'Harming a resource'],
  ], [
    ['Which step is the mistake?', 'Step 1: Rivers give people water.', 'Step 2: Pollution makes water unsafe.', 'Step 3: So pouring waste in the river is good use.', 'Polluting a river is misuse.', 2],
    ['Which step is the mistake?', 'Step 1: Trees hold the soil.', 'Step 2: Cutting trees without replanting causes erosion.', 'Step 3: So erosion is good for farms.', 'Erosion harms farms.', 2],
    ['Which step is the mistake?', 'Step 1: Soil grows crops.', 'Step 2: Covered soil stays fertile.', 'Step 3: So bare soil is best.', 'Covered soil stays fertile.', 2],
    ['Which step is the mistake?', 'Step 1: Water is limited.', 'Step 2: We should use it carefully.', 'Step 3: So wasting water is fine.', 'We should not waste water.', 2],
    ['Which step is the mistake?', 'Step 1: The Bible calls us to care for creation.', 'Step 2: Resources are God\'s gifts.', 'Step 3: So we may waste them.', 'We should use them carefully.', 2],
  ], ['a', 'b', 'c']),
  ...S('bf', FB, 'BIBLE_FUNCTIONS', ['BF_STORY_ONLY', 'BF_CHURCH_ONLY', 'BF_SERVICE'], ['The Bible teaches, guides and gives hope.', 'Everyone may read the Bible.'], [
    ['What does the Bible do for people?', 'Teaches, guides and gives hope', 'Only tells stories from long ago', 'Only lists rules to be obeyed', 'Only entertains people at church'],
    ['Who may read the Bible?', 'Everyone who wishes to', 'Only church leaders', 'Only old people', 'Only teachers'],
    ['How do Christians use the Bible?', 'In worship, teaching and service', 'They never use it in any way', 'Only on a market day each week', 'Only in the evening after work'],
    ['Which is a use of the Bible in a church service?', 'Reading and teaching from it', 'Selling copies at the church door', 'Hiding it away from the people', 'Throwing it away after the prayer'],
    ['How does the Bible help a person who is sad?', 'It comforts and gives hope', 'It makes them angrier', 'It tells them to hide', 'It does nothing'],
  ], [
    ['Wanjiru reads the Bible each morning for guidance. What does this show?', 'The Bible guides daily life', 'The Bible is only for church', 'The Bible is only a story book', 'The Bible is old news'],
    ['A pastor teaches from the Bible every Sunday. What is the Bible used for?', 'Teaching Christians', 'Selling in church', 'Decoration', 'Passing time'],
    ['A friend says the Bible is only for priests. What can you say?', 'Everyone may read it', 'He is right', 'Only men may read it', 'Only adults may read it'],
    ['A person feels sad and reads Psalms. What does the Bible give?', 'Comfort and hope', 'More sadness', 'Anger', 'Boredom'],
    ['A youth group uses the Bible to plan a service to the poor. What is this?', 'Christian service', 'Wasting time', 'A business', 'A sport'],
  ], [
    ['Which step is the mistake?', 'Step 1: The Bible teaches about God.', 'Step 2: It guides how to live.', 'Step 3: So it is only a book of old stories.', 'It also guides and gives hope.', 2],
    ['Which step is the mistake?', 'Step 1: The Bible is for all people.', 'Step 2: Anyone may read it.', 'Step 3: So only priests may read it.', 'Everyone may read it.', 2],
    ['Which step is the mistake?', 'Step 1: Christians use the Bible in worship.', 'Step 2: They also use it in teaching.', 'Step 3: So they never use it in service.', 'They also use it in service.', 2],
    ['Which step is the mistake?', 'Step 1: The Bible gives hope.', 'Step 2: It comforts those who are sad.', 'Step 3: So it should be kept away from the sad.', 'It comforts them.', 2],
    ['Which step is the mistake?', 'Step 1: God\'s Word inspires service.', 'Step 2: Christians help the needy.', 'Step 3: So service has nothing to do with the Bible.', 'The Bible inspires service.', 2],
  ], ['a', 'b']),
  ...S('bd', DB, 'BIBLE_DIVISIONS', ['BD_NUMBER', 'BD_SORT_OT', 'BD_SORT_NT'], ['The Bible has two divisions: the Old and the New Testament.', 'The Old Testament has 39 books, the New has 27.'], [
    ['How many divisions has the Bible?', 'Two: Old and New Testament', 'Three', 'Four', 'One'],
    ['In which Testament is Genesis?', 'The Old Testament', 'The New Testament', 'Neither', 'Both'],
    ['In which Testament is Matthew?', 'The New Testament', 'The Old Testament', 'Neither', 'Both'],
    ['How many books are in the Old Testament?', '39', '27', '66', '12'],
    ['How many books are in the New Testament?', '27', '39', '66', '12'],
  ], [
    ['A learner opens Psalms. In which Testament is it?', 'The Old Testament', 'The New Testament', 'Neither', 'Both'],
    ['A learner opens Romans. In which Testament is it?', 'The New Testament', 'The Old Testament', 'Neither', 'Both'],
    ['A learner opens Exodus. In which Testament is it?', 'The Old Testament', 'The New Testament', 'Neither', 'Both'],
    ['A learner opens John. In which Testament is it?', 'The New Testament', 'The Old Testament', 'Neither', 'Both'],
    ['A teacher says the Bible has 66 books in all. How are they divided?', '39 in the Old and 27 in the New', '27 in the Old and 39 in the New', '33 in each Testament', '60 in the Old and 6 in the New'],
  ], [
    ['Which step is the mistake?', 'Step 1: The Bible has two divisions.', 'Step 2: They are the Old and the New Testament.', 'Step 3: So the Bible has three divisions.', 'It has two divisions.', 2],
    ['Which step is the mistake?', 'Step 1: Genesis is the first book.', 'Step 2: It is about the beginning.', 'Step 3: So Genesis is in the New Testament.', 'Genesis is in the Old Testament.', 2],
    ['Which step is the mistake?', 'Step 1: Matthew tells of Jesus.', 'Step 2: Jesus came after the Old Testament times.', 'Step 3: So Matthew is in the Old Testament.', 'Matthew is in the New Testament.', 2],
    ['Which step is the mistake?', 'Step 1: The Old Testament has 39 books.', 'Step 2: The New Testament has 27.', 'Step 3: So the Bible has 70 books in all.', 'The Bible has 66 books.', 2],
    ['Which step is the mistake?', 'Step 1: Romans is a letter.', 'Step 2: It was written by Paul.', 'Step 3: So Romans is in the Old Testament.', 'Romans is in the New Testament.', 2],
  ], ['a', 'b']),
  ...S('bt', TR, 'BIBLE_TRANSLATION', ['BT_LANGUAGE', 'BT_WHY', 'BT_EFFECT'], ['The New Testament was first written in Greek.', 'Translation lets people read in their own language.'], [
    ['In which language was most of the New Testament first written?', 'Greek', 'Latin', 'English', 'Kiswahili'],
    ['Why is the Bible translated?', 'So people can read it in their own language', 'To make it harder to read', 'To hide its message', 'To make it shorter'],
    ['Which is an effect of translating the Bible into local languages?', 'More people learn to read and study', 'Fewer people read', 'People forget their language', 'The Bible is lost'],
    ['In which language was most of the Old Testament first written?', 'Hebrew', 'Greek', 'Latin', 'English'],
    ['Which is a version of the Bible used today?', 'The Good News Bible', 'The Atlas', 'The Dictionary', 'The Hymn Book'],
  ], [
    ['A village receives the Bible in its mother tongue. What is the main benefit?', 'People can read and understand it', 'People forget what the Bible says', 'People stop reading altogether', 'People hide it from the others'],
    ['A learner asks why there are many Bible versions. What is a good answer?', 'To help people understand in their language', 'To confuse the readers on purpose', 'To hide the message from them', 'To make the Bible more costly'],
    ['A teacher says the New Testament was first written in Greek. Is this true?', 'Yes', 'No, it was first in English', 'No, it was first in Swahili', 'No, it was first in Latin'],
    ['A community learns to read through a translated Bible. What is this effect?', 'Social and educational benefit', 'Loss of language', 'Loss of faith', 'Loss of work'],
    ['Who translated the Bible into the local language?', 'Translators who knew both languages', 'People who knew neither language', 'Only travellers', 'Only chiefs'],
  ], [
    ['Which step is the mistake?', 'Step 1: The New Testament was written long ago.', 'Step 2: Most of it was written in Greek.', 'Step 3: So it was first written in English.', 'It was first written in Greek.', 2],
    ['Which step is the mistake?', 'Step 1: People speak many languages.', 'Step 2: Translation helps them read the Bible.', 'Step 3: So translation makes the Bible harder to read.', 'Translation makes it easier to read.', 2],
    ['Which step is the mistake?', 'Step 1: Translation helps reading.', 'Step 2: Reading builds education.', 'Step 3: So translation reduces learning.', 'Translation helps learning.', 2],
    ['Which step is the mistake?', 'Step 1: The Old Testament was written mostly in Hebrew.', 'Step 2: It was later translated.', 'Step 3: So it was first written in Greek.', 'Most of it was first in Hebrew.', 2],
    ['Which step is the mistake?', 'Step 1: A translation must keep the meaning.', 'Step 2: Translators study both languages.', 'Step 3: So any person may translate without study.', 'Translators study both languages.', 2],
  ], ['a', 'b', 'c']),
];
