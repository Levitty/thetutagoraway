# Mathematics Grades 2 and 3: review pack for the new families (2026-11-19)

These 29 families cover the nine Grade 2 and Grade 3 skills whose HOREB skill (G2_MASS, G2_LINES, G3_MASS) had no question family at all. Written offline, no model was called. Every family is a **draft, off for children** (`reviewed: false`) until a Kenyan maths teacher signs it off here. They are `young: true`: read aloud, a whole number to type or at most three short options.

Each wrong answer or wrong option names one misconception from the map (`curriculum/mathematics/g2.json`, `g3.json`); `SLIP` marks a counting slip with no misconception. One sample draw per family is shown; a family makes a different item each time (names, objects, numbers). `node scripts/check-family-file.mjs` passes on both files.

The beam balance work itself (making a balance, holding to estimate, drawing with a ruler, modelling with sticks and clay) is done in class; see `maths-g2-g3-non-question-outcomes-2026-11-19.md`.

**For the reviewer, please check:**
- Grade 2 lines: the options describe lines in words (there is no picture yet). A drawn line would be better; say if any item needs one.
- `g2c.mass.kg.short` and `g2c.mass.kg.sold-by` have two options only (form "why"). Say if a third named mistake is worth adding.
- `g3c.mass.est.sensible` and `g3c.mass.est.five`: are the masses believable (school bag of books about 3 kg, big pumpkin about 4 kg)?
- `g3c.mass.sub.lighter` offers "0 kg" for taking the larger from the smaller (the map's own example for M_KSUB_ORDER).

Tick a family to sign it off, or write the fix beside it.

## Grade 2 (18 families, `src/ai-tutor/content/families/g2c_cov.js`)

| Family | Skill | Outcome | Form | Rung | Sample question | Key | Wrong answers and the misconception each names |
|---|---|---|---|---|---|---|---|
| g2c.mass.fixed.level | MEASUR.MASS.MEASURE_FIXED_MASS | a | word | 1 | Amina is weighing an exercise book with bottle tops. 6 tops are not enough: the exercise book still sinks. She keeps adding tops. When the beam is level, she has put on 9. How heavy is the exercise book, in bottle tops? | 9 | 6 (M_FM_NOT_LEVEL); 10 (SLIP) |
| g2c.mass.fixed.down-side | MEASUR.MASS.MEASURE_FIXED_MASS | a | direct | 1 | A cup and 8 bottle tops sit in the two pans. The cup sinks lower. What can we say? | The cup is heavier than 8 tops | The cup is 8 tops (M_FM_NOT_LEVEL); The cup is lighter than 8 tops (M_FM_UP_IS_HEAVY) |
| g2c.mass.fixed.heavier-unit | MEASUR.MASS.MEASURE_FIXED_MASS | a | why | 2 | A packet of salt balances 10 bottle tops. Mutua now uses stones instead. Each stone is heavier than a bottle top. How many stones will balance the packet of salt? | Fewer than 10 | Exactly 10 (M_FM_MIXED_UNITS); More than 10 (M_FM_HEAVIER_UNIT_MORE) |
| g2c.mass.fixed.same-units | MEASUR.MASS.MEASURE_FIXED_MASS | a | why | 2 | Ochieng balances a book with 6 stones. The stones are all different sizes. He says, "It is 6 stones heavy." Fatuma says that is not a fair measure. Is Fatuma right? | Yes, the stones are not all the same | No, 6 stones balance it (M_FM_MIXED_UNITS) |
| g2c.mass.kg.short | MEASUR.MASS.KNOW_KILOGRAM | b | why | 1 | A shopkeeper writes a sign: 3 kilograms of maize flour. Which is the short way to write kilograms on the sign? | kg | kgs (M_KK_WRITES_KILO_WRONG) |
| g2c.mass.kg.same-kg | MEASUR.MASS.KNOW_KILOGRAM | b | why | 2 | One bag has 1 kg of beans. Another bag has 1 kg of cotton wool. Which bag is heavier? | They are the same | The beans (M_KK_FEATHER_KG); The cotton wool (M_KK_BIG_IS_KG) |
| g2c.mass.kg.big-box | MEASUR.MASS.KNOW_KILOGRAM | b | word | 1 | Achieng holds a big empty carton in one hand and a 1 kg packet of rice in the other. Is the big empty carton heavier than 1 kg? | No, it is lighter than 1 kg | Yes, it is bigger (M_KK_BIG_IS_KG) |
| g2c.mass.kg.sold-by | MEASUR.MASS.KNOW_KILOGRAM | b | why | 1 | Asha goes to the market. Which of these does she buy by the kilogram? | Maize flour | Milk to drink (M_KK_UNIT_MIX) |
| g2c.mass.inkg.read | MEASUR.MASS.MEASURE_IN_KG | c | word | 1 | Hassan weighs 6 potatoes against 1 kg masses. When he tries 3 masses, the masses sink. When he tries 2 masses, both pans hang level. How many kilograms do the potatoes weigh? | 2 | 6 (M_MKG_COUNTS_ITEMS); 3 (M_MKG_READS_TIPPED) |
| g2c.mass.inkg.heaviest | MEASUR.MASS.MEASURE_IN_KG | c | direct | 2 | Wanjiru weighs three things on a beam balance with 1 kg masses. A pumpkin balances 3 masses. A bag of maize balances 4 masses. A jerrycan of water balances 5 masses. Which is the heaviest? | A jerrycan of water | A pumpkin (M_MKG_HEAVIER_LESS); They are the same: one thing each (M_MKG_COUNTS_ITEMS) |
| g2c.lines.straight.slanting | GEOMET.LINES.STRAIGHT_LINES | b | why | 1 | Chebet uses a ruler to draw a line from the bottom left corner of her page to the top right corner. The line is slanting. Is it a straight line? | Yes, it does not bend | No, it is slanting (M_SL_SLANT_NOT_STRAIGHT) |
| g2c.lines.straight.zigzag | GEOMET.LINES.STRAIGHT_LINES | a | why | 2 | Otieno makes a zigzag with 3 sticks on the floor. Cherono says, "That is a curved line." Is Cherono right? | No, it is straight lines joined | Yes, it is curved (M_SL_BROKEN_IS_CURVED) |
| g2c.lines.straight.wobbly | GEOMET.LINES.STRAIGHT_LINES | b | word | 1 | Akinyi draws a line without a ruler. When she lays a ruler next to it, the line wobbles away from the ruler's edge in places. Is it a straight line? | No, it wobbles | Yes, it is almost straight (M_SL_WOBBLY_OK) |
| g2c.lines.straight.ruler-slips | GEOMET.LINES.STRAIGHT_LINES | b | steps | 2 | Otieno draws a line with a ruler. At the end the line bends a little. What went wrong? | The ruler moved | Nothing went wrong (M_SL_RULER_SLIPS); The line is slanting (M_SL_SLANT_NOT_STRAIGHT) |
| g2c.lines.curved.plate | GEOMET.LINES.CURVED_LINES | c | direct | 1 | Asha puts a crayon on paper and traces round a round tray. Has she drawn a line? | Yes, a curved line | No, a line must be straight (M_CL_CIRCLE_NOT_LINE) |
| g2c.lines.curved.corner | GEOMET.LINES.CURVED_LINES | c | word | 1 | Njeri points at the corner of a book and says it is a curve. Is the corner of a book a curve? | No, two straight edges meet | Yes, the line turns (M_CL_CORNER_IS_CURVE) |
| g2c.lines.curved.rainbow | GEOMET.LINES.CURVED_LINES | d | steps | 2 | Wanjiru wants to draw a rainbow with a curved line. How should she draw it? | Freehand | As a zigzag (M_SL_BROKEN_IS_CURVED); With a ruler (M_CL_RULER_FOR_CURVE) |
| g2c.lines.curved.road | GEOMET.LINES.CURVED_LINES | c | why | 2 | On Achieng's map, the stream round the market bends gently, a little at a time. What kind of line shows it? | A curved line | A straight line (M_CL_WAVY_STRAIGHT) |

## Grade 3 (11 families, `src/ai-tutor/content/families/g3c_cov.js`)

| Family | Skill | Outcome | Form | Rung | Sample question | Key | Wrong answers and the misconception each names |
|---|---|---|---|---|---|---|---|
| g3c.mass.kg.level | MEASUR.MASS.MEASURE_KG | a | word | 1 | Kiprono has a bag of 9 pawpaws. He puts 1 kg masses in the other pan. With 4 masses on, the masses' pan drops. He takes one off and the beam is level. What is the mass of the bag in kilograms? | 3 | 4 (M_MASS_NOT_LEVEL); 9 (M_MASS_COUNTS_PANS) |
| g3c.mass.kg.up-side | MEASUR.MASS.MEASURE_KG | a | direct | 1 | On a beam balance, the pan with the box of books rises up. The pan with 5 kg of masses goes down. Which is heavier? | The 5 kg of masses | The box of books (M_MASS_HIGH_SIDE_HEAVY); They are the same, 5 kg each (M_MASS_NOT_LEVEL) |
| g3c.mass.kg.big-small | MEASUR.MASS.MEASURE_KG | a | why | 2 | Nyambura weighs a big bundle of dry grass. It balances 2 kg. Naliaka weighs a small bag of sand. It also balances 2 kg. Nyambura says the big bundle of dry grass is heavier because it is bigger. Is she right? | No, both are 2 kg | Yes, it is bigger (M_MASS_BIGGER_IS_HEAVIER) |
| g3c.mass.add.shopping | MEASUR.MASS.ADD_KG | b | word | 2 | Muthoni's father takes two sacks to the posho mill. One sack of maize is 39 kg. The other is 34 kg. What is the total mass of the two sacks in kg? | 73 | 63 (M_KADD_CARRY); 5 (M_KADD_SUBTRACTS); 2 (M_KADD_COUNTS_ITEMS) |
| g3c.mass.add.basket | MEASUR.MASS.ADD_KG | b | direct | 1 | A basket holds 4 kg of tomatoes and 7 kg of carrots. How heavy are they all together? | 11 kg | 3 kg (M_KADD_SUBTRACTS); 2 kg (M_KADD_COUNTS_ITEMS) |
| g3c.mass.sub.heavier | MEASUR.MASS.SUBTRACT_KG | c | word | 2 | Juma's goat has a mass of 52 kg. His dog has a mass of 17 kg. By how many kilograms is the goat heavier than the dog? | 35 | 45 (M_KSUB_SMALLER_FROM_LARGER); 69 (M_KSUB_ADDS_HEAVIER) |
| g3c.mass.sub.left | MEASUR.MASS.SUBTRACT_KG | c | steps | 2 | Mama Hassan has a 25 kg sack of sugar in her shop. She sells 9 kg of it. How many kilograms of sugar are left in the sack? | 16 | 9 (M_KSUB_GIVES_USED); 24 (M_KSUB_SMALLER_FROM_LARGER) |
| g3c.mass.sub.lighter | MEASUR.MASS.SUBTRACT_KG | c | direct | 1 | The bucket of sand is 3 kg. The bucket of stones is 10 kg. How much lighter is the bucket of sand? | 7 kg | 0 kg (M_KSUB_ORDER); 13 kg (M_KSUB_ADDS_HEAVIER) |
| g3c.mass.est.sensible | MEASUR.MASS.ESTIMATE_KG | d | direct | 1 | Which is a sensible estimate for the mass of a school bag full of books? | About 3 kg | About 100 kg (M_KEST_NO_BENCHMARK); Less than 1 kg (M_KEST_MORE_LESS_SWAP) |
| g3c.mass.est.five | MEASUR.MASS.ESTIMATE_KG | d | why | 1 | Is a cup more or less than 5 kg? | Less than 5 kg | More than 5 kg (M_KEST_MORE_LESS_SWAP) |
| g3c.mass.est.close | MEASUR.MASS.ESTIMATE_KG | d | word | 2 | Halima holds a bunch of bananas and estimates it is 3 kg. On the beam balance it is 2 kg. Was 3 kg a good estimate? | Yes, it was close | No, it was not exact (M_KEST_MUST_BE_EXACT) |
