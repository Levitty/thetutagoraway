# New question families and outcome tagging (2026-11-12)

Branch `horeb/2026-11-12-coverage`, from `horeb/2026-11-12-question-gate`. Authored offline by Claude, no paid API call at any point. Nothing here is switched on for children: every new family carries `reviewed: false` (the one switch in `families/core.js`, read at serve time) and `draft: true`. A Kenyan maths teacher decides which ones go live.

## What was added

- **Grades 1 to 3:** 38 existing generator skills were tagged at the sub-strand only. 29 are now tagged to 38 of the design's own outcome codes (12 in Grade 1, 12 in Grade 2, 14 in Grade 3); 9 stay at the sub-strand and are listed below.
- **Grade 6:** 46 new question families across 36 outcomes (the 56 outcomes with nothing were 16 attitude outcomes, 4 hands-on ones and 36 testable ones; all 36 now have a family).
- **Grade 8:** 35 new question families across 26 outcomes (67 had nothing; 26 testable outcomes are now covered).
- Files: `src/ai-tutor/content/families/cov.js` (the small kit), `g6_cov.js`, `g8_cov.js`, joined in `bank.js`. Family ids start `g6c.` and `g8c.`.
- Every family: key computed from the draw and checked a second way (`chk`); wrong answers come only from named mistakes, each with feedback that says what the child believed; at least two hints; a separate worked example is served with every family (`serveFamily`); Kenyan contexts (shillings, metric units, shamba, matatu, SACCO, boda boda, mandazi); no emoji, British spelling, no em dash.
- Exemplars and misconceptions: the misconception library exists for Grade 5 only, so Grades 6 and 8 name the misconception in the feedback text of each wrong answer, not by code. A teacher or the child developmental psychologist should confirm the list in each family before it goes live.

## Grades 1 to 3: skills tagged to design outcomes

Source: `curriculum/mathematics/g1.json`, `g2.json`, `g3.json`. The design's own outcomes are now in `curriculum/outcomes.js` (attitude and "play games on a device" outcomes left out, as for the other grades). The old broad tag stays as outcome `0` ("the sub-strand as a whole") so nothing that pointed at it breaks. A skill is tagged only where its questions clearly test the outcome; the map is `OFFICIAL_G1_3` in `scripts/build-skill-tags.mjs`.

| Skill | Official outcome codes tagged | What the outcomes say |
|---|---|---|
| G1_ADD | NUMBER.ADDITION.c | add 2 single-digit numbers in different situations |
| G1_CAPACITY | MEASUR.CAPACITY.b | compare the capacity of two containers using more than, less than, and same as |
| G1_COUNTING | NUMBER.WHOLE_NUMBERS.a | count numbers forward up to 50 |
| G1_LENGTH | MEASUR.LENGTH.b | compare the length of objects using longer than, shorter than, and same as |
| G1_LINES | GEOMET.LINES.a, GEOMET.LINES.c, GEOMET.LINES.e | identify straight lines in different situations; identify curved lines in different situations; recognise straight and curved lines from real objects in the environment |
| G1_MASS | MEASUR.MASS.b | compare the mass of two objects using heavier than, lighter than, or same as |
| G1_MONEY | MEASUR.MONEY.c | count Kenyan currency coins one at a time |
| G1_SHAPES | GEOMET.SHAPES.a | identify rectangles, triangles, and circles in objects from the environment |
| G1_SUB | NUMBER.SUBTRACTION.c | subtract single digit numbers |
| G1_TIME | MEASUR.TIME.a | identify days of the week |
| G2_ADD | NUMBER.ADDITION.a, NUMBER.ADDITION.b | add a 2 digit number to a 1 digit number without and with regrouping with sum n…; add a 2 digit number to a 2 digit number without and with regrouping, with sum … |
| G2_COUNTING | NUMBER.WHOLE_NUMBERS.a | count numbers forward up to 100 in different situations |
| G2_DIVISION_INTRO | NUMBER.DIVISION.a | represent division as equal sharing up to number 20 by 2 |
| G2_FRACTIONS | NUMBER.FRACTIONS.a, NUMBER.FRACTIONS.b | identify a as part of a whole in different situations; identify a as part of a whole in different situations |
| G2_MULTIPLY_INTRO | NUMBER.MULTIPLICATION.a | represent multiplication as repeated addition using numbers 1, 2, 3, by 2 and 3 |
| G2_PLACE_VALUE | NUMBER.WHOLE_NUMBERS.d | identify the place value of numbers in ones and tens |
| G2_SHAPES | GEOMET.SHAPES.a | identify different shapes in the environment |
| G2_SUB | NUMBER.SUBTRACTION.a, NUMBER.SUBTRACTION.b | subtract a 1 digit number from a 2 digit number without regrouping; subtract a 2 digit number from a 2 digit number without and with regrouping |
| G2_TIME | MEASUR.TIME.f | read time by the hour from the clock face |
| G3_ADD | NUMBER.ADDITION.c, NUMBER.ADDITION.d | add two 3 digit numbers without regrouping; add two 3 digit numbers with single regrouping with sum not exceeding 1000 |
| G3_CAPACITY | MEASUR.CAPACITY.c | subtract capacity in litres |
| G3_COUNTING | NUMBER.WHOLE_NUMBERS.c | identify the place value of numbers up to hundreds |
| G3_DIVIDE | NUMBER.DIVISION.b | divide a 2 digit number by a single digit number without a remainder |
| G3_FRACTIONS | NUMBER.FRACTIONS.a, NUMBER.FRACTIONS.b | identify, and as part of a whole; identify, and as part of a group |
| G3_MASS | MEASUR.MASS.c | subtract mass in kilograms |
| G3_MULTIPLY | NUMBER.MULTIPLICATION.b | multiply a single digit number by a single digit number |
| G3_POSITION | GEOMET.POSITION_AND_DIRECTION.b, GEOMET.POSITION_AND_DIRECTION.c, GEOMET.POSITION_AND_DIRECTION.d | identify the right and left side from a point; turn to the right from a point; turn to the left from a point |
| G3_SUB | NUMBER.SUBTRACTION.c | subtract a 3 digit number from a 3 digit number with single regrouping |
| G3_TIME | MEASUR.TIME.c | read and tell time using the digital clock or analogue clock |

### Grades 1 to 3: left untagged (to confirm with a teacher)

| Skill | Why it stays at the sub-strand |
|---|---|
| G1_PRENUMBER | Asks "what comes next" in number patterns up to 40. The nearest outcome is G1 WHOLE.f (missing numbers in patterns up to 20), but the range goes past 20 and the pre-number outcomes are about sorting and matching objects. |
| G2_LENGTH | Asks "one rope is 30 cm and another 45 cm, how much longer". The G2 outcomes are about measuring with fixed units and the metre; comparing two numbers is not measuring. |
| G2_MASS | Same shape as G2_LENGTH, in kilograms: a subtraction, not a measurement. |
| G2_CAPACITY | Same shape, in litres: a subtraction, not a measurement. |
| G2_MONEY | Change from one price. The G2 outcomes buy up to 3 items without balance and add two denominations; change is a G3 idea (G3 MONEY.g) with three items. |
| G2_LINES | Asks "is this line straight or curved". The G2 outcomes model and draw lines (hands-on). The question is a G1 outcome (identify lines), not G2. |
| G3_LENGTH | Asks metre-centimetre conversions. The G3 outcomes are measuring, adding, subtracting and estimating in metres; no G3 outcome converts to centimetres. |
| G3_MONEY | Profit and loss on a mango. No G3 money outcome is about profit or loss (it is Grade 6). |
| G3_SHAPES | Asks sides and corners of single shapes (hexagon, octagon). The G3 outcomes are about combined shapes made of two shapes. |

Also not tagged, because the skill clearly tests the outcome only in part: G1_COUNTING (WHOLE.b backward from 30 and WHOLE.f missing numbers up to 20: the skill asks "just before" and "between" up to 50), G2_DIVISION_INTRO (DIV.d, divide up to 25 by 4 and 5: the skill uses other divisors and numbers to 50), G2_MULTIPLY_INTRO (MUL.c, multiply by 1 to 5: the skill goes to 10), G2_TIME and G3_TIME month and day questions (G1 outcomes, not G2 or G3).

## Grade 6 new families

| Outcome | Official text | Families | Skill |
|---|---|---|---|
| G6.DATA_H.BAR_GRAPHS.b | represent data from real-life situations using pictographs | `g6c.data.pictograph-symbols`, `g6c.data.pictograph-key` | G6_DATA_COLLECTION |
| G6.DATA_H.BAR_GRAPHS.d | represent data from real-life situations using bar graphs | `g6c.data.bar-squares`, `g6c.data.bar-heights` | G6_DATA_COLLECTION |
| G6.DATA_H.BAR_GRAPHS.e | interpret information from bar graphs | `g6c.data.bar-difference`, `g6c.data.bar-second-highest` | G6_DATA_COLLECTION |
| G6.GEOMET.3_D_OBJECTS.b | identify faces and edges of cylinders in different situations | `g6c.3d.cylinder-parts` | G6_3D_OBJECTS |
| G6.GEOMET.3_D_OBJECTS.c | describe plane figures in 3-D objects in the environment | `g6c.3d.plane-in-solid` | G6_3D_OBJECTS |
| G6.GEOMET.ANGLES.c | work out sum of angles on a straight line in different situations | `g6c.ang.straight-two`, `g6c.ang.straight-three` | G6_ANGLE_PROPERTIES |
| G6.MEASUR.CAPACITY.b | convert litres to millilitres in different situations | `g6c.cap.litres-to-ml` | G6_CAPACITY |
| G6.MEASUR.CAPACITY.c | convert capacity in millilitres to litres in different situations | `g6c.cap.ml-to-litres` | G6_CAPACITY |
| G6.MEASUR.LENGTH.a | use the millimetre (mm) as a unit of measuring length in different situations, | `g6c.len.best-in-mm` | G6_UNIT_CONVERSIONS |
| G6.MEASUR.LENGTH.b | establish the relationship between the millimetre and  centimetre in different situations | `g6c.len.ruler-marks` | G6_UNIT_CONVERSIONS |
| G6.MEASUR.LENGTH.c | convert centimetres and  millimetres to millimetres in different situations | `g6c.len.to-millimetres` | G6_UNIT_CONVERSIONS |
| G6.MEASUR.LENGTH.e | subtract centimetres and  millimetres in different situations | `g6c.len.subtract-cm-mm` | G6_UNIT_CONVERSIONS |
| G6.MEASUR.LENGTH.f | multiply centimetres and millimetres by whole  numbers in real- life situations | `g6c.len.multiply-cm-mm` | G6_UNIT_CONVERSIONS |
| G6.MEASUR.LENGTH.g | divide centimetres and millimetres by whole numbers in real-life situations | `g6c.len.divide-cm-mm` | G6_UNIT_CONVERSIONS |
| G6.MEASUR.LENGTH.i | identify the relationship between circumference and diameter in different situations | `g6c.len.round-the-edge` | G6_UNIT_CONVERSIONS |
| G6.MEASUR.MASS.b | identify items measured in tonnes in real life | `g6c.mass.which-in-tonnes` | G6_MASS |
| G6.MEASUR.MASS.c | identify the relationship between the kilogramme and the tonne | `g6c.mass.sacks-in-tonne` | G6_MASS |
| G6.MEASUR.MASS.d | estimate mass in tonnes in different situations | `g6c.mass.estimate-tonnes` | G6_MASS |
| G6.MEASUR.MASS.f | add tonnes and kilogrammes in real life situations | `g6c.mass.add-tonnes-kg` | G6_MASS |
| G6.MEASUR.MASS.g | subtract tonnes and kilogrames in real-life situations | `g6c.mass.subtract-tonnes-kg` | G6_MASS |
| G6.MEASUR.MASS.h | multiply tonnes and kilogrammes by whole numbers in real-life situations | `g6c.mass.multiply-tonnes-kg` | G6_MASS |
| G6.MEASUR.MASS.i | divide tonnes and kilogrammes by whole numbers in real-life situations | `g6c.mass.divide-tonnes-kg` | G6_MASS |
| G6.MEASUR.MONEY.b | determine buying and selling prices of different items in the community | `g6c.money.selling-price`, `g6c.money.buying-price` | G6_MONEY |
| G6.MEASUR.MONEY.d | calculate loss realised from sales of different items in the community | `g6c.money.loss-amount`, `g6c.money.profit-or-loss` | G6_MONEY |
| G6.MEASUR.TIME.a | identify time in a.m. and p.m. in day-to-day life experiences | `g6c.time.ampm-event` | G6_TIME |
| G6.MEASUR.TIME.b | write time in a.m. and p.m. in day-to-day life | `g6c.time.write-ampm` | G6_TIME |
| G6.MEASUR.TIME.d | convert time from 12h to 24h and 24h to 12h system | `g6c.time.to-24-hour`, `g6c.time.to-12-hour` | G6_TIME |
| G6.NUMBER.DECIMALS.a | identify decimals up to ten thousandths in different situations | `g6c.dec.name-the-place`, `g6c.dec.write-ten-thousandths` | G6_FRACTIONS_DECIMALS |
| G6.NUMBER.DECIMALS.d | convert decimals to percentages and percentages to decimals in different situations | `g6c.dec.to-percent`, `g6c.dec.from-percent` | G6_FRACTIONS_DECIMALS |
| G6.NUMBER.DECIMALS.f | subtract decimals up to 4- decimal places in different situations | `g6c.dec.subtract-four-places` | G6_FRACTIONS_DECIMALS |
| G6.NUMBER.FRACTIONS.b | subtract fractions using LCM in different situations | `g6c.frac.subtract-lcm` | G6_FRACTIONS_SUB |
| G6.NUMBER.FRACTIONS.d | subtract mixed numbers in different situations | `g6c.frac.subtract-mixed` | G6_MIXED_NUMBERS |
| G6.NUMBER.FRACTIONS.h | convert percentage to fractions in different situations | `g6c.frac.percent-to-fraction` | G6_PERCENTAGES_INTRO |
| G6.NUMBER.INEQUALITIES.b | simplify inequalities in one unknown involving real- life situations | `g6c.ineq.simplify-add`, `g6c.ineq.simplify-multiply` | G6_INEQUALITIES |
| G6.NUMBER.WHOLE_NUMBERS.b | use numbers up to millions in symbols in real life | `g6c.whole.symbols-from-parts` | G6_PLACE_VALUE |
| G6.NUMBER.WHOLE_NUMBERS.d | order numbers up to 100,000 in real-life situations | `g6c.whole.order-list` | G6_PLACE_VALUE |

## Grade 8 new families

| Outcome | Official text | Families | Skill |
|---|---|---|---|
| G8.ALGEBR.LINEAR_EQUATIONS.c | solve linear equations in two unknowns by elimination method in real life situations | `g8c.eq.eliminate-subtract`, `g8c.eq.eliminate-add` | G8_SIMULTANEOUS_INTRO |
| G8.DATA_H.DATA_PRESENTATION_AND_IN.d | interpret line graphs of data from real life situations | `g8c.data.line-difference`, `g8c.data.line-fall` | G8_DATA_GRAPHS |
| G8.DATA_H.DATA_PRESENTATION_AND_IN.f | calculate the mean of a set of discrete data from real life situations | `g8c.data.mean-of-scores`, `g8c.data.mean-missing-value` | G6_MEAN |
| G8.DATA_H.DATA_PRESENTATION_AND_IN.g | determine the median of a set of discrete data from real life situations | `g8c.data.median-of-list`, `g8c.data.median-spot-reason` | G8_DATA_GRAPHS |
| G8.DATA_H.PROBABILITY.c | write the experimental probability outcomes in different situations | `g8c.prob.experimental` | G8_PROBABILITY_INTRO |
| G8.DATA_H.PROBABILITY.e | express the probability outcomes in decimals or percentages in different situations | `g8c.prob.fraction-to-decimal`, `g8c.prob.as-percentage` | G8_PROBABILITY_INTRO |
| G8.DATA_H.PROBABILITY.g | recognise events that happen by chance in real life situations | `g8c.prob.by-chance` | G8_PROBABILITY_INTRO |
| G8.GEOMET.COORDINATES_AND_GRAPHS.c | plot points on the Cartesian plane in different situations | `g8c.graph.point-description`, `g8c.graph.point-after-moves` | G8_COORDINATES |
| G8.GEOMET.COORDINATES_AND_GRAPHS.h | apply simultaneous equations in real life situations | `g8c.graph.boda-meet` | G8_LINEAR_GRAPHS |
| G8.GEOMET.SCALE_DRAWING.a | represent length to a given scale in different situations | `g8c.scale.represent-length` | G8_SCALE_DRAWING |
| G8.GEOMET.SCALE_DRAWING.c | convert scale length to actual length in real life situations | `g8c.scale.map-to-actual` | G8_SCALE_DRAWING |
| G8.GEOMET.SCALE_DRAWING.e | write linear scales in statement form in different situations | `g8c.scale.write-statement` | G8_SCALE_FORMS |
| G8.GEOMET.SCALE_DRAWING.f | interpret linear scales in ratio form in different situations | `g8c.scale.ratio-to-ground` | G8_SCALE_FORMS |
| G8.GEOMET.SCALE_DRAWING.g | write linear scales in ratio form in different situations | `g8c.scale.write-ratio` | G8_SCALE_FORMS |
| G8.GEOMET.SCALE_DRAWING.h | convert linear scale from statement form to ratio form and ratio form to statement form i… | `g8c.scale.statement-to-ratio`, `g8c.scale.ratio-to-statement` | G8_SCALE_FORMS |
| G8.NUMBER.DECIMALS.c | convert recurring decimals into fractions in different situations | `g8c.dec.recurring-to-fraction` | G8_RECURRING_DECIMALS |
| G8.NUMBER.DECIMALS.e | express numbers to a required significant figure in real life situations | `g8c.dec.significant-figures` | G8_STANDARD_FORM |
| G8.NUMBER.DECIMALS.f | express numbers in standard form in different situations | `g8c.dec.to-standard-form` | G8_STANDARD_FORM |
| G8.NUMBER.DECIMALS.g | carry out combined operations on decimals in different situations | `g8c.dec.combined-operations` | G8_DECIMALS_COMBINED |
| G8.NUMBER.DECIMALS.h | apply decimals to real life situations | `g8c.dec.shopping-change` | G8_DECIMALS_COMBINED |
| G8.NUMBER.INTEGERS.c | carry out operations of addition and subtraction integers on the number line in real life… | `g8c.int.number-line-lift` | G6_INTEGERS_ADD_SUB |
| G8.NUMBER.RATES_RATIO_PROPORTIONS_.b | work out rates in real life situations | `g8c.rate.per-unit` | G8_RATIO_PROPORTION |
| G8.NUMBER.RATES_RATIO_PROPORTIONS_.d | compare two or more ratios in different situations | `g8c.ratio.compare-two` | G6_RATIOS |
| G8.NUMBER.RATES_RATIO_PROPORTIONS_.h | work out percentage change of given quantities in real life situations | `g8c.pct.change-amount`, `g8c.pct.which-method` | G8_PERCENTAGE_CHANGE |
| G8.NUMBER.RATES_RATIO_PROPORTIONS_.i | identify direct and indirect proportions in real life situations | `g8c.prop.direct-or-inverse` | G8_RATIO_PROPORTION |
| G8.NUMBER.SQUARES_AND_SQUARE_ROOTS.c | work out squares and square roots of numbers using a calculator in different situations | `g8c.sq.root-plot`, `g8c.sq.square-decimal` | G8_SQUARES_TABLES |

## Outcomes deliberately not covered

Grade 6 (20 left of the 56): 16 attitude outcomes ("appreciate use of ..."), and 4 hands-on outcomes a typed or tapped answer cannot test: LINES.b (bisect by construction), LINES.c (construct perpendiculars), ANGLES.e (construct triangles), ANGLES.f (measure interior angles with a protractor).

Grade 8 (41 left of the 67): attitude, IT and "reflect on" outcomes (ALGEBRAIC_EXPRESSIONS.d and e, LINEAR_EQUATIONS.e and f, DATA.h and i, PROBABILITY.f, COMMON_SOLIDS.f and g, COORDINATES_AND_GRAPHS.i and j, SCALE_DRAWING.k and l, INTEGERS.d and e, DECIMALS.i and j, FRACTIONS.c and d, SQUARES.d and e, RATES.k and l, AREA.g, CIRCLES.d and e, MONEY.f and g); hands-on outcomes (DATA.a and c draw graphs, COMMON_SOLIDS.e make models, COORDINATES.a and f draw, CONSTRUCTION.a, d, e, g construct, SCALE.i make scale drawings). AREA.h is garbled in the design text ("recognise use of in real length life situations") and cannot be read as a question; ask KICD or the teacher what it means. LINEAR_EQUATIONS.f ("recognize use of linear equations in real life") and SCALE.l ("recognise the use of scale drawing in maps") read as attitude outcomes and were left out; a teacher may disagree.

## Things found on the way

1. **HOREB's outcome letters drift from the official ones in places.** HOREB ids use "the design's own letter", but some are shifted, so the coverage report counts the wrong official outcome as covered. Examples: Grade 8 DECIMALS `d` is "Standard form" in HOREB but the official `d` is "round off a decimal" (standard form is `f`); Grade 8 RATES `g` is "Percentage increase and decrease" in HOREB but the official `g` is "increase and decrease using ratios" (percentage change is `h`); Grade 6 LENGTH `h` and Grade 6 DATA `c`. The new families use the official letters. The older tags were left as they were; a person should reconcile `curriculum/outcomes.js` with the designs. Grade 6 DATA `b` was "Draw graphs" marked hands-on; it is now "Pictographs from data" (official `b`) and testable.
2. **`scripts/coverage-outcomes.mjs` now counts a worked example for every outcome that has a family**, because every family served carries a separate worked example (`serveFamily`). Before, only generator skills counted. Grades 1 to 3 are read as sub-strand level through outcome `0`, as before. The Grade 1 to 9 totals still add to 880 outcomes.
3. **`skillTags.js` is stale against its generator.** Running `node scripts/build-skill-tags.mjs` now would drop Grade 5 tags that the committed file has (the Grade 5 curriculum-map families carry the official code, not HOREB's). I patched the 38 Grade 1 to 3 lines and the 30 skills that host new families by hand and did not regenerate the file. The generator now ignores family outcomes it does not know, so a future run does not crash.
4. **Bundled edge functions need a rebuild before the next deploy.** The school and voice functions bundle the maths engine, which now includes the new bank and outcome list. Three drift tests fail for that reason (`school-door` build, `voice-tutor-turn`, `voice-tutor-voice`) on top of the two that already failed before this branch (`function-drift`). I was told not to touch `supabase/functions` or the templates, so I did not run `npm run build:school-fn` or `npm run build:voice-tutor-fn`. Children are not affected: the new families are off.
5. **The mixed-number marker.** `accepts()` in `schema.js` adds a space-stripped form of every typed answer, so a typed mixed number "2 3/4" also accepts "23/4" (5.75), and the marker then calls "5 3/4" right. The mixed-number family is therefore a tap question. Typed fractions and typed 4-decimal answers (which the gate refuses for numbers) are written as text.

## Results of the checks

Outcome coverage (`npm run coverage:outcomes`, report `docs/qa/coverage-2026-11-12.md`). F family, S generator skill tagged, M misconception feedback, W worked example, none = none of the four. "Before" is the report at the start of this branch.

| Grade | Outcomes | Before: F / S / M / W / none | After: F / S / M / W / none |
|---|---|---|---|
| 1 | 54 | 0 / 0 / 0 / 0 / 54 | 0 / 12 / 8 / 12 / 42 |
| 2 | 70 | 0 / 0 / 0 / 0 / 70 | 0 / 12 / 9 / 12 / 58 |
| 3 | 74 | 0 / 0 / 0 / 0 / 74 | 0 / 14 / 10 / 14 / 60 |
| 6 | 97 | 33 / 41 / 40 / 27 / 56 | 69 / 77 / 76 / 74 / 20 |
| 8 | 121 | 51 / 54 / 54 / 52 / 67 | 77 / 80 / 79 / 80 / 41 |

All 20 Grade 6 outcomes left with nothing are attitude or hands-on. Grades 1 to 3 have no family at outcome level (the existing Grade 1 to 3 families stay at the sub-strand, outcome `0`). The W column now also counts a family's own worked example (note 2), so the before and after figures for W are not like for like. In S, a skill that hosts a new family is tagged to the family's outcome, as `build-skill-tags.mjs` does for every family; it does not mean the skill's own generator teaches it.

- **Quality gate** (`npm run test:content`): all 253 authored skills pass; failures in what children get today 0; failures with every family on 0; families failing their checks 0. It was run after the last edit.
- **Pre-review checks** (`npm run review:precheck -- --strict`): exit 0, 0 hard failures in 49,590 items. The 81 new families were drawn 60 times each (4,860 items) in a separate run: **all 4,860 clean, zero soft flags** (key, distractors, reading level, ambiguity, units). The 7,734 soft-flagged items left in the file come from older families and generator skills.
- **Family checks** (`scripts/check-family-file.mjs`, 200 draws each): no failures for `g6_cov.js` and `g8_cov.js`; no two families in a skill share a form, and none repeats a form its skill already had (checked several times, because draws are random).
- **`npm test`**: 663 of 668 pass. The 5 failures are all edge-function build or deploy drift: 2 already failed before this branch, 3 more because the bundled functions now contain the bigger bank (note 4). No test about families, tags, outcomes or coverage fails.


## Review list for a Kenyan maths teacher

Please look at every family below and mark it **live**, **change** or **drop**, then send the list to the pack builder (`scripts/build-question-review.mjs`, `scripts/apply-question-review.mjs`). Numbers change on every draw, so one sample draw is shown.

### Questions for the whole set

1. **Level.** Is each family at the right level for the grade (Grade 6 at about 11 years old, Grade 8 at about 13)? The family's `rung` (1 easy, 2 core, 3 hard) is a guess.
2. **Words.** Do the child words match what is taught: "diameter", "circumference", "LCM", "regroup", "tonne", "standard form", "significant figures", "experimental probability", "inverse proportion", "scale in statement form"?
3. **Prices and quantities.** Are the shillings believable for a Kenyan shop or market today? A box of soap at sh 800, a sack of onions at sh 2,500, 3 kg of rice at sh 142.50 a kilogram, boda boda fares of sh 50 plus sh 10 a kilometre are illustrations, not real rates.
4. **Wrong answers.** In every family each wrong answer stands for one named mistake. Does a child really make it? Is any plausible mistake missing?
5. **Marking.** A typed fraction ("7/20") is marked right by value. A typed decimal must be exact. Is that what the school would do?
6. **Method taught.** Subtraction of cm and mm, tonnes and kg is done here by changing to the smaller unit first. If the class is taught to regroup in columns, say so: the hints and the feedback would change.
7. **Circumference.** The cylinder, circle and 22/7 questions use 22/7 for π. Does the school use 22/7 or 3.14 at this grade?

### Family by family

| Id | Outcome | Form, rung | A sample question | Please check |
|---|---|---|---|---|
| `g6c.whole.symbols-from-parts` | G6.NUMBER.WHOLE_NUMBERS.b | direct, 2 | A school in Kitale paid 2 million, 55 thousand and 14 shillings for a new classroom block. Which number in symbols shows the amount? Options: 20,550,140 / 25,514 / 2,055,014 / 2,014,055 | Is "1 million, 91 thousand and 60 shillings" a natural way to say an amount? The three wrong options are the common slips. |
| `g6c.whole.order-list` | G6.NUMBER.WHOLE_NUMBERS.d | word, 2 | Njeri wrote down the number of people who came to four matches: 21,139, 9,338, 7,629, 36,028. Which list puts them in order, from smallest to largest? Options: 36,028 < 21,139 < 9,338 < 7,629 / 21,139 < 36,028 < 7,629 < 9,338 / 7,629 < 9,338 < 21,139 < 36,028 / 7,629 < 21,139 < 9,338 < 36,028 | The wrong lists include sorting by the first digit only (a number with more digits is bigger). Is a four-option list too long for a phone? |
| `g6c.dec.name-the-place` | G6.NUMBER.DECIMALS.a | direct, 1 | A pharmacist's scale shows 2.6428 g. In which place is the digit 8? Options: tenths / hundredths / thousandths / ten-thousandths | Ten-thousandths: do Grade 6 learners meet this name? The question uses a pharmacist's scale. |
| `g6c.dec.write-ten-thousandths` | G6.NUMBER.DECIMALS.a | word, 2 | Zawadi reads 6 ten-thousandths of a gram on a very fine scale. Which decimal shows this? Options: 0.0006 / 0.006 / 0.00006 / 0.06 | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.dec.to-percent` | G6.NUMBER.DECIMALS.d | word, 2 | A water tank on Baraka's shamba is 0.23 full. What percentage of the tank is full? Give the number only. | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.dec.from-percent` | G6.NUMBER.DECIMALS.d | direct, 2 | A shop in Machakos takes 66% off the price of Njeri's school shoes. Write 66% as a decimal. | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g6c.dec.subtract-four-places` | G6.NUMBER.DECIMALS.f | word, 3 | A scientist weighs two samples of soil. The first has a mass of 3.8435 kg and the second 3.0336 kg. How many kilograms heavier is the first sample than the second? | The key is typed as text (4 decimal places). Is "0.0010" accepted for "0.001" in class? |
| `g6c.frac.subtract-lcm` | G6.NUMBER.FRACTIONS.b | word, 2 | Maize grows on 1/3 of Musa's shamba and beans grow on 1/4 of it. What fraction more of the shamba is under maize than under beans? Give the answer in its simplest form. | Answer must be in simplest form. Wrong answers: no change of numerators, numerators and denominators both subtracted, first denominator kept, added. |
| `g6c.frac.subtract-mixed` | G6.NUMBER.FRACTIONS.d | word, 3 | Nyaboke has 9 1/3 m of cloth and uses 2 3/6 m to make a dress. How many metres of cloth are left? Options: 11 5/6 / 7 1/6 / 6 5/6 / 7 5/6 | Tap, not typed (see note 5). The borrowed whole is the point. Is "regroup one whole" the school's wording? |
| `g6c.frac.percent-to-fraction` | G6.NUMBER.FRACTIONS.h | word, 2 | Nyambura scored 16% in a maths test. Write 16% as a fraction in its simplest form. | Answer in simplest form. Check that the wrong "1/15" style answer is a mistake children make. |
| `g6c.ineq.simplify-add` | G6.NUMBER.INEQUALITIES.b | direct, 2 | A hall can hold more than 36 people. 30 people are inside and n more are waiting outside, so n + 30 > 36. Which inequality shows what n can be? Options: n > 36 / n > 66 / n > 6 / n < 6 | Uses "n + 9 > 29" and asks for n alone. Are inequalities written with n or x in class? |
| `g6c.ineq.simplify-multiply` | G6.NUMBER.INEQUALITIES.b | word, 3 | Zawadi buys 6 tickets for a school trip at n shillings each. The total is at most 144 shillings, so 6n ≤ 144. Which inequality shows the price n of one ticket? Options: n ≤ 138 / n ≤ 24 / n ≥ 24 / n ≤ 864 | The price per ticket is the unknown n. The sign never flips here (positive number). |
| `g6c.len.best-in-mm` | G6.MEASUR.LENGTH.a | direct, 1 | Nekesa is learning about units. A millimetre (mm) is a very small unit. Which of these is best measured in millimetres? Options: The distance from Kisumu to Kakamega / The length of an ant / The length of a classroom / The distance from Nairobi to Thika | Distractors name the right unit in their feedback. Is "thickness of a ruler" clearly a millimetre quantity? |
| `g6c.len.ruler-marks` | G6.MEASUR.LENGTH.b | word, 2 | A ruler has a small mark every millimetre. How many millimetre spaces are between the 1 cm mark and the 11 cm mark? | Counts the 1 mm spaces between two centimetre marks. |
| `g6c.len.to-millimetres` | G6.MEASUR.LENGTH.c | direct, 2 | The label on a box of screws says each screw measures 16 cm 7 mm. Write this measurement using millimetres only. | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g6c.len.subtract-cm-mm` | G6.MEASUR.LENGTH.e | word, 3 | Barasa has a ribbon 14 cm 6 mm long. He cuts off 10 cm 9 mm. How many millimetres of ribbon are left? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.len.multiply-cm-mm` | G6.MEASUR.LENGTH.f | word, 3 | Each exercise book on Juma's desk is 2 cm 5 mm thick. He puts 5 of them in one pile. How many millimetres thick is the pile? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.len.divide-cm-mm` | G6.MEASUR.LENGTH.g | word, 3 | Wafula cuts a strip of wire 1 cm 6 mm long into 2 equal pieces. How many millimetres long is each piece? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.len.round-the-edge` | G6.MEASUR.LENGTH.i | direct, 2 | A round water tank has a diameter of 210 cm. A string is tied once round its edge. About how long is the string? Options: about 420 cm / about 660 cm / about 210 cm / about 840 cm | "About" is deliberate (22/7). Options are far enough apart that rounding does not matter. |
| `g6c.cap.litres-to-ml` | G6.MEASUR.CAPACITY.b | direct, 1 | Mutua's jerrican holds 10 litres of water. How many millilitres is that? | Includes half litres (1.5, 2.5, 3.5). |
| `g6c.cap.ml-to-litres` | G6.MEASUR.CAPACITY.c | word, 2 | Njeri sells 8 bottles of milk, 500 ml each. How many litres of milk is that altogether? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.mass.which-in-tonnes` | G6.MEASUR.MASS.b | direct, 1 | Halima is learning about units. A tonne is a very large unit of mass. Which of these is best measured in tonnes? Options: A cooking-oil bottle / A school bag / A lorry full of sand / A bag of sugar | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g6c.mass.sacks-in-tonne` | G6.MEASUR.MASS.c | word, 2 | A lorry can carry 1 tonne. Each sack of cement has a mass of 20 kg. How many sacks can the lorry carry? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.mass.estimate-tonnes` | G6.MEASUR.MASS.d | direct, 2 | Which is the best estimate for the mass of a loaded container at the port? Options: 2,000 tonnes / 200 kg / 20 kg / 20 tonnes | Masses of an elephant, a hippopotamus, a school bus, a tractor and a container are estimates. Are they acceptable at Grade 6? |
| `g6c.mass.add-tonnes-kg` | G6.MEASUR.MASS.f | word, 2 | A grain store receives 3 tonnes 650 kg of rice on Monday and 2 tonnes 350 kg of rice on Tuesday. How many kilograms does it receive in the two days? | The key is the total in kilograms, not "tonnes and kilograms". Would the school want the answer in tonnes and kg? |
| `g6c.mass.subtract-tonnes-kg` | G6.MEASUR.MASS.g | word, 3 | A hardware shop in Machakos receives 5 tonnes 100 kg of cement. Njeri sells 1 tonne 900 kg of it. How many kilograms of cement are left? | Same: answer in kilograms. |
| `g6c.mass.multiply-tonnes-kg` | G6.MEASUR.MASS.h | word, 3 | A truck makes 3 trips to a quarry. Each trip carries 1 tonne 400 kg of sand to Kamau's building site. How many kilograms of sand are delivered in all? | Same: answer in kilograms. |
| `g6c.mass.divide-tonnes-kg` | G6.MEASUR.MASS.i | word, 3 | A load of 9 tonnes 700 kg of sugar is shared equally between 4 shops. What is each shop's share, in kilograms? | Same: answer in kilograms. The numbers are chosen so the division is exact. |
| `g6c.money.selling-price` | G6.MEASUR.MONEY.b | word, 2 | Otieno runs a small shop. A box of chalk costs sh 570 to buy, and he wants sh 300 profit on it. What selling price, in shillings, should be written on the box? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.money.buying-price` | G6.MEASUR.MONEY.b | direct, 3 | Ochieng sold a school bag for sh 880 and made a profit of sh 150. What was the buying price, in shillings? | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g6c.money.loss-amount` | G6.MEASUR.MONEY.d | word, 2 | Akinyi bought a radio for sh 2,390 and sold it for sh 2,210. How much money did she lose, in shillings? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.money.profit-or-loss` | G6.MEASUR.MONEY.d | why, 2 | Nyambura buys 12 mangoes for sh 25 each and sells all of them for sh 35 each. What is the result? Options: A loss of sh 10 / A loss of sh 120 / No profit and no loss / A profit of sh 120 | Is the reason offered the one a teacher would give? |
| `g6c.time.ampm-event` | G6.MEASUR.TIME.a | why, 1 | At Hassan's school, lunch break starts at 1:00. Which way of writing the time is correct? Options: 1:00 a.m. / 1:00 p.m. | Two options only (a.m. or p.m.). "Lunch break starts at 1:00" and "evening news at 9:00" depend on the school day. |
| `g6c.time.write-ampm` | G6.MEASUR.TIME.b | direct, 2 | The match ends at quarter past 8 in the evening. Which is the correct way to write this time? Options: 8:45 p.m. / 8:15 p.m. / 8:15 / 8:15 a.m. | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g6c.time.to-24-hour` | G6.MEASUR.TIME.d | direct, 2 | The clinic closes at 2:00 a.m. Which of these shows the same time on the 24-hour clock? Options: 0200 h / 1000 h / 0230 h / 1400 h | Options are written "1945 h" because the marker treats "07:45" and "19:45" as the same time. Is "1945 h" how the school writes 24-hour time? |
| `g6c.time.to-12-hour` | G6.MEASUR.TIME.d | word, 3 | Zawadi's train ticket says: Departs 2300 h. How would she write this time on a 12-hour clock? Options: 23:00 p.m. / 11:00 a.m. / 13:00 p.m. / 11:00 p.m. | Same form of writing, "1315 h" on a train ticket. |
| `g6c.ang.straight-two` | G6.GEOMET.ANGLES.c | word, 1 | A carpenter fixes a brace to a straight beam. On one side of the brace the angle is 20°. What is the angle on the other side of the brace, on the same straight beam? | A carpenter's brace on a beam. No diagram is shown. Does the school need a drawing here? |
| `g6c.ang.straight-three` | G6.GEOMET.ANGLES.c | direct, 2 | A carpenter fixes two braces to a straight beam, which makes three angles along the beam. Two of the angles are 30° and 40°. Find the third angle, in degrees. | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g6c.3d.cylinder-parts` | G6.GEOMET.3_D_OBJECTS.b | direct, 1 | A tin of milk is shaped like a cylinder. How many corners (vertices) does it have? | Counts flat faces, curved faces, edges and corners of a cylinder. Do learners count the curved edges as 2? |
| `g6c.3d.plane-in-solid` | G6.GEOMET.3_D_OBJECTS.c | direct, 2 | A roof is shaped like a triangular prism. The two ends are flat. What plane figure are they? Options: Circle / Triangle / Rectangle / Square | The biggest face of a matchbox is called a rectangle; a cube face a square. |
| `g6c.data.pictograph-symbols` | G6.DATA_H.BAR_GRAPHS.b | word, 2 | Halima draws a pictograph of learners who walk to school. One whole symbol stands for 20, and a half symbol stands for 10. How many whole symbols should she draw for 110? Count a half symbol as 0.5. | Half symbols count 0.5. Is "How many whole symbols ... count a half as 0.5" clear? |
| `g6c.data.pictograph-key` | G6.DATA_H.BAR_GRAPHS.b | word, 3 | Akinyi will draw a pictograph for 80, 50, 60 learners in three classes. Only whole symbols are allowed, and a row may have at most 10 symbols. How many learners should one symbol stand for? Options: 5 / 10 / 20 / 40 | Exactly one key works on every draw (whole symbols only, at most 10 per row). |
| `g6c.data.bar-squares` | G6.DATA_H.BAR_GRAPHS.d | word, 2 | Achieng is drawing a bar graph of 150 litres of milk sold on Monday. On the vertical axis, one square stands for 50. How many squares tall should the Monday bar be? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g6c.data.bar-heights` | G6.DATA_H.BAR_GRAPHS.d | table, 3 | The table shows the bags of maize a shop sold. A bar graph will use one square for each 10 bags. Which list gives the heights of the bars, in squares? Options: Mon 4, Tue 8, Wed 2, Thu 5 / Mon 8, Tue 4, Wed 3, Thu 5 / Mon 80, Tue 40, Wed 20, Thu 50 / Mon 8, Tue 4, Wed 2, Thu 5 | A table is shown; the options give heights in squares. Draws are for 4 days. |
| `g6c.data.bar-difference` | G6.DATA_H.BAR_GRAPHS.e | graph, 2 | The bar graph shows the eggs a farm collected each day from Monday to Friday. How many more were sold on the busiest day than on the quietest day? | The bar graph is drawn by the app from the draw. |
| `g6c.data.bar-second-highest` | G6.DATA_H.BAR_GRAPHS.e | graph, 3 | The bar graph shows the number of bicycles a repair shop mended each day from Monday to Friday. On which day did it mend the second greatest number of bicycles? Options: Mon / Tue / Thu / Fri | The graph is drawn from the draw. Can it be read exactly (to the tick marks)? |
| `g8c.int.number-line-lift` | G8.NUMBER.INTEGERS.c | word, 2 | A lift in a Nairobi office block is at floor −3. Floors below the ground floor have minus signs. The lift goes down 2 floors. Use a number line. At which floor does it stop? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g8c.dec.recurring-to-fraction` | G8.NUMBER.DECIMALS.c | direct, 3 | A calculator shows 0.3333..., where the digit 3 repeats for ever. Which fraction in its simplest form is equal to this decimal? Options: 1/30 / 1/3 / 1/33 / 3/10 | Recurring digits are shown with "..." and a sentence, because the app cannot set a dot over a digit. Is that acceptable? |
| `g8c.dec.significant-figures` | G8.NUMBER.DECIMALS.e | word, 2 | A trader sold 31.766 kg of beans in a week. Write 31.766 correct to 3 significant figures. | Large whole numbers and decimals; the keys are numbers with at most 3 decimal places. |
| `g8c.dec.to-standard-form` | G8.NUMBER.DECIMALS.f | direct, 2 | In a science book, a shipment of tea is worth 1,300 shillings. Which is this number in standard form? Options: 13 × 10² / 1.3 × 10³ / 1.3 × 10⁻³ / 1.3 × 10² | Powers of ten use superscript characters. Check they read well on a phone. |
| `g8c.dec.combined-operations` | G8.NUMBER.DECIMALS.g | direct, 3 | In a class competition, Wambui must find the value of 2.9 + 5.6 × 4.5. Write the answer as a decimal number. | Order of operations only: brackets, then multiplication. Decimals are tenths. |
| `g8c.dec.shopping-change` | G8.NUMBER.DECIMALS.h | word, 2 | Omondi buys 2 kg of sugar at sh 180 for each. He pays with sh 500. How much change does he get, in shillings? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g8c.sq.root-plot` | G8.NUMBER.SQUARES_AND_SQUARE_ROOTS.c | word, 2 | Achieng's square plot in Thika has an area of 200 m². Use a calculator to find the length of one side, correct to 1 decimal place, in metres. | Uses a calculator; the non-perfect squares ask for 1 decimal place. |
| `g8c.sq.square-decimal` | G8.NUMBER.SQUARES_AND_SQUARE_ROOTS.c | direct, 2 | Zawadi uses a calculator to find the area of a square tile with a side of 8.8 cm. Work out 8.8² in square centimetres. | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g8c.rate.per-unit` | G8.NUMBER.RATES_RATIO_PROPORTIONS_.b | word, 2 | A tank fills with 720 litres of water in 6 minutes. What is the rate in litres per minute? | Four contexts (speed, flow, price per kg, typing speed). |
| `g8c.ratio.compare-two` | G8.NUMBER.RATES_RATIO_PROPORTIONS_.d | why, 3 | In Class 8A the ratio of girls to boys is 4 : 5. In Class 8B it is 3 : 7. In which class are girls the bigger share of the class? Options: Class 8A / The same / Class 8B | Girls : boys in two classes; compare the share that are girls. The "same" answer appears in about a quarter of draws. |
| `g8c.pct.change-amount` | G8.NUMBER.RATES_RATIO_PROPORTIONS_.h | word, 2 | Juma compares prices. Last year a bicycle tyre set cost sh 2,500. This year it costs sh 3,750. Work out the percentage increase in the price. | Percentage increase and decrease from two prices; the result is always a whole percentage. |
| `g8c.pct.which-method` | G8.NUMBER.RATES_RATIO_PROPORTIONS_.h | why, 3 | Naliaka earned sh 6,000 a month and now earns sh 6,300. Which calculation gives the percentage increase? Options: (6,300 − 6,000) ÷ 6,000 × 100 / (6,300 − 6,000) × 100 / 6,300 ÷ 6,000 × 100 / (6,300 − 6,000) ÷ 6,300 × 100 | Is the reason offered the one a teacher would give? |
| `g8c.prop.direct-or-inverse` | G8.NUMBER.RATES_RATIO_PROPORTIONS_.i | direct, 2 | Which kind of relationship is this? The number of exercise books bought and the total cost, when each book costs the same. Options: Direct proportion / Inverse proportion / Neither | Includes some "neither" cases. Are they fair (a learner's birth month and her mark)? |
| `g8c.eq.eliminate-subtract` | G8.ALGEBR.LINEAR_EQUATIONS.c | steps, 3 | Mugambi buys 2 bars of soap and 2 packets of salt for sh 160. On another day he buys 2 bars of soap and 4 packets of salt for sh 200. Solve by elimination. Parts: What is the price of one packet of salt, in shillings? / What is the price of one bar of soap, in shillings? | Two parts, each earning a mark. Soap and salt stand in for any two prices. |
| `g8c.eq.eliminate-add` | G8.ALGEBR.LINEAR_EQUATIONS.c | steps, 3 | A sack of beans and a sack of salt together have a mass of 97 kg. The sack of beans is 13 kg heavier than the sack of salt. Let x be the mass of the beans and y the mass of the salt, so x + y = 97 and x − y = … Parts: What is the mass of the sack of beans, in kg? / What is the mass of the sack of salt, in kg? | Sum and difference of two sack masses. |
| `g8c.data.line-difference` | G8.DATA_H.DATA_PRESENTATION_AND_IN.d | graph, 2 | The line graph shows the price of a kilogram of onions at a market in six weeks. By how many shillings did the price fall between week 1 and week 3? | The graph is drawn from the draw. Can it be read exactly (to the tick marks)? |
| `g8c.data.line-fall` | G8.DATA_H.DATA_PRESENTATION_AND_IN.d | graph, 3 | The line graph shows the number of learners who came to a school club each week for six weeks. Between which two weeks did the number fall? Options: Between week 2 and week 3 / Between week 3 and week 4 / Between week 4 and week 5 / Between week 5 and week 6 | Exactly one fall in the six weeks. |
| `g8c.data.mean-of-scores` | G8.DATA_H.DATA_PRESENTATION_AND_IN.f | word, 2 | Mwangi scored 24, 17, 12, 12, 9, 10 marks in 6 short tests. What is his mean mark? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g8c.data.mean-missing-value` | G8.DATA_H.DATA_PRESENTATION_AND_IN.f | word, 3 | The mean number of eggs a hen laid in 5 days was 12. In 4 of the days it laid 13, 11, 12, 18 eggs. How many eggs did it lay on the other day, for Wanjiru's farm? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g8c.data.median-of-list` | G8.DATA_H.DATA_PRESENTATION_AND_IN.g | word, 2 | Wafula records the number of customers at a kiosk on 5 days: 21, 31, 25, 23, 18. What is the median number of customers? | Odd and even numbers of values; with an even count the median can be a half. |
| `g8c.data.median-spot-reason` | G8.DATA_H.DATA_PRESENTATION_AND_IN.g | why, 3 | Juma finds the median of 17, 10, 25, 24, 29. He says it is 25, the number in the middle of the list. What did he do wrong? Options: He did not put the numbers in order fir… / He should have chosen the biggest number / He should have chosen the number that a… / He should have added the numbers and di… | Tests the one reason why a median goes wrong (list not in order). |
| `g8c.prob.experimental` | G8.DATA_H.PROBABILITY.c | word, 2 | Zawadi tries an experiment 20 times. A seed from a packet is planted and it grows 14 times. What is the experimental probability that it grows? Give the answer as a fraction in its simplest form. | Answer is a fraction in simplest form. |
| `g8c.prob.fraction-to-decimal` | G8.DATA_H.PROBABILITY.e | direct, 2 | The probability that Ochieng's bus is on time is 43/50. Write this probability as a decimal. | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g8c.prob.as-percentage` | G8.DATA_H.PROBABILITY.e | word, 2 | Otieno picks a card from a pack. The probability of picking a red card is 3/10. Express this probability as a percentage. Give the number only. | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g8c.prob.by-chance` | G8.DATA_H.PROBABILITY.g | direct, 1 | Baraka is learning about chance. Which of these events happens by chance, so that no one can be sure of the result? Options: The sun rises tomorrow morning / The next car to pass the school gate is… / Water in a closed bottle stays in the b… / A full 5-litre jerrican holds 5 litres … | The wrong options are events that are certain. Is "a learner aged 12 will be 13 on her next birthday" a fair certain event? |
| `g8c.graph.point-description` | G8.GEOMET.COORDINATES_AND_GRAPHS.c | direct, 2 | On a Cartesian plane, you start at the origin (0, 0). Which describes how to reach the point (3, −4)? Options: 3 right, 4 up / 3 left, 4 down / 4 left, 3 up / 3 right, 4 down | No Cartesian plane is drawn. A teacher may want a picture; the question describes moves from the origin. |
| `g8c.graph.point-after-moves` | G8.GEOMET.COORDINATES_AND_GRAPHS.c | word, 3 | Wafula plots a point on a Cartesian plane. He starts at the origin, moves 2 units right and then 4 units up. What are the coordinates of the point? Options: (4, 2) / (2, 4) / (−2, 4) / (2, −4) | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g8c.graph.boda-meet` | G8.GEOMET.COORDINATES_AND_GRAPHS.h | steps, 3 | Company A charges sh 120 plus sh 13 for each kilometre. Company B charges sh 70 plus sh 23 for each kilometre. On a graph of cost against distance, the two lines meet at a point. Parts: At what distance, in kilometres, do the two companies charg… / What is that cost, in shillings? | Two parts. The lines meet at a whole number of kilometres. |
| `g8c.scale.represent-length` | G8.GEOMET.SCALE_DRAWING.a | table, 2 | A surveyor makes a plan with the scale 1 cm to 2 m. The table shows the real lengths. Which list gives the lengths to draw on the plan? Options: Fence 8 cm, House wall 6 cm, Gate 4 cm / Fence 4 cm, House wall 3 cm, Gate 2 cm / Fence 2 cm, House wall 3 cm, Gate 4 cm / Fence 16 cm, House wall 12 cm, Gate 8 cm | Is the table readable? Is the answer unique? |
| `g8c.scale.map-to-actual` | G8.GEOMET.SCALE_DRAWING.c | word, 2 | Eldoret and Gilgil are 10 cm apart on Mutua's map. The key says that 1 cm stands for 25 km. How far apart are the two towns in real life, in kilometres? | Is the story clear? Are the wrong answers mistakes a child makes? |
| `g8c.scale.write-statement` | G8.GEOMET.SCALE_DRAWING.e | direct, 2 | The road from Thika to Nyeri measures 9 cm on a map and 180 km on the ground. Which sentence gives the scale of the map? Options: 9 cm represents 20 km / 1 cm represents 20 km / 1 cm represents 180 km / 1 cm represents 9 km | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g8c.scale.ratio-to-ground` | G8.GEOMET.SCALE_DRAWING.f | word, 3 | Fatuma's map has a scale of 1 : 10,000. A road is 1 cm long on the map. How many kilometres long is the real road? | Scales from 1 : 10,000 to 1 : 250,000 and the answer in kilometres (can be 0.1 or 2.5). |
| `g8c.scale.write-ratio` | G8.GEOMET.SCALE_DRAWING.g | direct, 3 | On a drawing, a classroom that is really 10 m long is shown by a line 5 cm long. Which is the scale of the drawing as a ratio? Options: 200 : 1 / 1 : 10 / 1 : 200 / 1 : 20 | Drawing length in cm, real length in metres: both are changed to centimetres. |
| `g8c.scale.statement-to-ratio` | G8.GEOMET.SCALE_DRAWING.h | direct, 3 | A map says "1 cm represents 25 km". Which is the scale written as a ratio? Options: 1 : 25,000 / 1 : 25 / 1 : 2,500,000 / 1 : 250,000 | Is exactly one option right? Do the three wrong options look like real mistakes? |
| `g8c.scale.ratio-to-statement` | G8.GEOMET.SCALE_DRAWING.h | word, 3 | A surveyor draws Njeri's plot using the ratio 1 : 500. What length on the ground, in metres, does each centimetre of the drawing stand for? | Is the story clear? Are the wrong answers mistakes a child makes? |

## How to try them yourself

`npm run horeb:try` turns every unreviewed family on under the local dev server only. A production build has the switch off and nothing in the app can turn it on.
