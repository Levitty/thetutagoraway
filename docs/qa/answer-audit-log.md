# HOREB answer audit log

How HOREB marks answers, checked the way children actually type them.
Tool: `node scripts/audit-answers.mjs` (add `--full` for every example,
`--n 120` for more questions per skill, `--skill G6_FRACTIONS_ADD` for one).
Every skill in the Kenyan (CBC) and Cambridge banks, at every level
(concrete, pictorial, abstract) and every sub-step.

## Round 1 (29 Sep, night): 20,400 questions, 124,785 child-typed answers

Found:
- **Wrong answers marked right.** On "4/10 − 3/10" (key 1/10, also shown as
  0.1) a child typing the classic mistake 1/20 was marked correct: the decimal
  key was graded "to one decimal place", and 0.05 rounds to 0.1. Any fraction
  question with a decimal alternative was exposed.
- **Float noise shown to children:** 0.8999999999999999 (binomial mean),
  29.999999999999996 (ratio), 980000.0000000001 (standard form),
  869.9999999999999 (bounds), 128.57142857142858 (7-sided polygon),
  log(14.666666666666666) (log laws). 9 skills.
- **Unanswerable question:** G10 inverse functions asked for f⁻¹(x) AND f⁻¹(k)
  and only accepted one exact sentence.
- **Right answers rejected:** "40 percent", "8600 shillings", "3 hrs", "24 sq cm".
- **Hidden risk:** an algebra key "3m" also accepted a bare "3" (m read as metres).
- **Pointless question:** "3/6 − 3/6".
- Misconception lists that contained the right answer (60 skills). Harmless to
  children (only used as distractors, which already exclude the answer), but
  wrong data.

Fixed:
- A typed fraction, mixed number or whole number is now marked exactly; only a
  typed decimal gets the rounding allowance (3.14159 still right for 3.14).
- Children's unit words accepted after a correct number (percent, shillings,
  bob, hrs, mins, km/h, sq cm, litres, grams...). Only stripped from what the
  child typed, never from a key, so "3m" stays algebra.
- The six noisy generators now produce exact values; the polygon "each angle"
  question only uses polygons with whole-degree angles.
- Inverse function question asks one thing.
- Like-fraction subtraction never subtracts a fraction from itself.
- Safety net on every question: leftover float noise is tidied, and any
  misconception that is marked correct is dropped.
- 10 new regression cases in `scripts/test-engine.mjs`.

## Round 2: 20,400 questions, 118,258 child-typed answers
- Marking: 0 findings (no right answer rejected, no near miss accepted).
- Question quality: 0 broken questions.
- Open: 62 skills repeat a small set of questions (next round).

## Round 3: variety and wrong-topic questions
Found while chasing repetition:
- **Wrong topic.** "Capacity" (Grades 5 and 6) asked about grams and kilograms;
  "Lines" (Grade 6) asked about types of triangles; Grades 4 and 6 "Mass" reused
  the same two Grade 5 questions. These were aliases to other skills.
- **Wrong age (Cambridge subject).** Cambridge Stage 1 "Counting to 100" served
  Grade 5 place value; Stage 2 "Addition" and "Shapes" served Grade 5
  questions (a triangle with angles 139°, 27°, 14° for a 7-year-old).
- **Repetition.** Mass, capacity, length, lines, triangle types, symmetry and
  congruence had 1 to 4 different questions each.
- Children's phrasing of word answers was rejected: "parallel lines",
  "an obtuse angle", "It is scalene", "Right angled".

Fixed:
- New generators with random numbers and Kenyan contexts (jerrycans, maize
  bags, sugar packets, running laps, railway lines, exercise books):
  Grade 4 mass & capacity units, Grade 5 mass, Grade 5 and 6 capacity (litres
  and ml), Grade 6 mass (tonnes), Grade 5 length, Grade 7 length conversions,
  Grade 5 and 6 lines, Grade 5 triangle types (by sides and by angles),
  Grade 6 symmetry (13 shapes, "none" and "infinite" in children's words),
  Grade 8 congruence (SSS, SAS, ASA, AAS, RHS, and why AAA fails).
- Word answers: leading "a/an/the/it is" and trailing "lines/angle/triangle"
  are ignored, and hyphens equal spaces. A wrong word is still wrong.
- Cambridge Stages 1-4 now use Kenyan lower-primary content of the same age;
  mixed topics alternate (Addition & Subtraction; Length, Mass, Time).
- 5 more regression cases (25 marking cases in total).

Round 3 audit: marking 0 findings; 51 skills still repeat (was 62).

## Round 4: the youngest children (Grades 1-4)
Found: clock-time answers only accepted "13:30" or "1:30". Children write
"1.30", "1:30 pm", "1.30 p.m.", "13.30", "half past one", "11 o'clock",
"quarter to twelve". Compass answers rejected "S" for South; day and month
names rejected "Tue", "Sept". Grade 1 time only ever asked "what day comes
after"; Grade 1-3 shapes, length and turns had 3 to 12 different questions.

Fixed:
- Clock times are marked by the time they show, in any of those forms (on a
  12-hour clock, so 13:30 and 1.30 p.m. are the same). A wrong time is wrong.
- Compass letters (N, S, E, W, NE...) and unambiguous short day/month names
  are accepted; "Ma" (March or May?) is not.
- Grade 1-2 time: days before, yesterday/tomorrow, and o'clock from the
  clock hands. Shapes: riddles ("I have 4 equal sides") and everyday objects
  (chapati, door, coin, exercise book, honeycomb), and sides of several
  shapes. Length/mass units: both directions, "which is more", "2 m and 35 cm
  in cm". Turns: clock-hand quarter/half/three-quarter/full turns.
- 12 more regression cases (37 in total).

Round 4 audit: 20,400 questions, 120,172 child-typed answers: marking 0
findings; 45 skills still repeat (was 51).

## Round 5: is the expected answer actually right?
New checks: (1) every question's own "verify" value must be accepted by its
key; (2) for pure calculations ("7385 − 230 = ?", "10 + 8 × 7", "4/5 + 1/2",
"25% of 200", "the mean of 4, 7, 10") the audit works the answer out itself
with exact fractions and the right order of operations and compares.

Found:
- **Right answers marked wrong in trigonometry** (Grade 9, IGCSE): the
  question says "(1 d.p.)" but the key was stored as "13" instead of "13.0",
  so a child typing the more precise 13.02 was marked wrong. The cosine-rule
  question also used cos 30° = 0.866 instead of the calculator value.
- **"Just 1" fractions:** 8 fraction skills sometimes showed 2/2, 5/5, 6/6
  ("4/5 + 2/2", "What is the reciprocal of 6/6?"), about 5% of their
  questions. Unlike subtraction could also give "1/2 − 2/4" = 0.
- All 2,729 calculation questions agreed with the independent answer once
  the audit read "1/4 ÷ 7/2" the way children do (a fraction before ÷).

Fixed:
- Trig answers keep their decimal place ("13.0"); cosine rule uses exact cos.
- Fraction builders keep fractions proper where the skill expects it, never
  n/n, and never subtract equal fractions.

Round 5 audit: 20,400 questions, 119,372 child-typed answers, 2,729 keys
double-checked by calculation: 0 marking findings, 0 wrong keys, 0 broken
questions; 43 skills still repeat.

## Round 6: does the free check find the right missing step?
New tool: `npm run audit:check` (`scripts/simulate-check.mjs`) replays the
free check exactly as the app runs it with virtual children: each has a
true level (on grade, 1-2 grades behind, or ahead) and 0-2 hidden gaps, and
answers HOREB's real questions like a child (right answers in children's
formats, 6% careless slips, 4% lucky guesses, "I haven't learned this yet"
when something is truly new). HOREB's missing step is then compared with the
truth.

Found (600 children, the check as it was):
- **14% false alarms:** the parent was told the child is missing a skill the
  child actually has. Cause: one careless slip. The check stopped after 8
  questions, and a single wrong answer on a lower-grade skill became "the
  missing step".
- Hidden gap named 72% of the time; placement exact 76%, within one grade 89%.

Fixed:
- **Confirm before concluding.** A wrong answer (not "I haven't learned this
  yet") gets one more question on the same skill ("One more like that one.
  Take your time."). Right the second time counts as a slip; wrong twice is
  a gap. Survives a refresh mid-check; "Previous question" still works.
- At least 12 questions before the check can stop (was 8).

Result (800 new children): false alarms **1%** (was 14%); hidden gap named
83% (was 72%); placement exact 85% (was 76%), within one grade 92%; about
14 questions on average (was 8), still a ~10-minute check.

Also: the "A picture to help" panel was dark-theme leftovers (green on grey,
hard to read) and is now light; the answer box hint no longer gets cut off
on phones.

## Round 7: does practice start where the plan says?
The plan page tells the parent "Starting today: <missing step>". The
simulator now also builds HOREB's practice path after each virtual check.

Found (400 children): practice started on the plan's missing step only
**20%** of the time; **50%** of the time it started on a skill the child
already knew, and 13% on a skill the plan had just called "Solid". Cause:
the path led with the *prerequisites* of failed skills (skills the check had
often just passed), not the failed skill itself.

Fixed:
- The practice path leads with the plan's missing step (the same rule as the
  plan page, so they can't disagree) until it is mastered. Applied to both
  HOREB's own path and the server engine's path.
- Finishing a check (or a retake) clears the pinned next skill, so the new
  plan's step takes over.

Result: practice starts on the plan's missing step **100%** (was 20%), on a
skill the child already knows 1% (was 50%).

## Round 8: answers that belong to other questions, senior maths
New audit check: a question that accepts the answer to a DIFFERENT question
of the same skill.

Found:
- **Wrong answers marked right (constructions, Grades 7 and 9):** every
  construction's answer was accepted for every angle ("perpendicular
  bisector", the 90° answer, was right for the 60° question), and the answers
  were phrases no child types exactly ("equilateral triangle construction").
- **"6, 0" read as sixty:** commas were stripped as if they were thousands
  separators, so a coordinate could be marked right for the number 60.
- **"3x²" rejected** when the key was "3x^2" (phones type the ² symbol), in
  every algebra answer with a power.
- **Two-answer questions** ("Solve sin θ = 0.5": 30° and 150°) only accepted
  that exact text; "30, 150", "150 and 30", "θ = 30 or θ = 150" were wrong.
- 13 Grade 10-12 skills had exactly one question (linear programming, normal
  distribution, trig identities, correlation, integration, hypothesis tests,
  parametric equations, proof, exponential graphs, differentiation, binomial).
  Loci, scatter graphs and surface area had 1-5.

Fixed:
- Constructions and loci rewritten with short, checkable answers (bisected
  angles, a goat tied to a peg, which bisector does what). Scatter graphs
  with 10 contexts (matatu speed, rainfall and umbrellas...), including "no
  correlation" and lines of best fit. Surface area: sphere, cylinder, cube,
  cuboid, cone.
- Commas are thousands separators only before exactly three digits.
- Superscript powers (x², x¹⁰) and x**2 read as x^2.
- Answers written as a set ("30° and 150°") match in any order and form;
  coordinates keep their order ("(0, 6)" is still wrong for "(6, 0)").
- The 13 senior skills rebuilt with random values.
- 12 more regression cases (49 in total).

## Round 9: when is a skill "mastered"?
Rule was: at least 6 questions AND 85% of EVERY attempt ever made on the
skill AND the last answer right. Simulated learners who improve as they
practise:

| Learner | Old rule: avg questions / stuck 60+ | New rule |
|---|---|---|
| Already knows it | 7.1 / 0% | 6.5 / 0% |
| Learns fast | 14.4 / 1% | 8.6 / 0% |
| Learns slowly | 40.4 / 29% | 14.4 / 0% |
| Shaky (plateaus ~80%) | 37.9 / 53% | 13.8 / 0% |

Early mistakes while learning counted forever, so the children who most
need help ground through 40+ questions on one skill. The lesson bar also
counted "6 of 6" correct answers while the lesson carried on.

Fixed: mastery is judged on recent answers: 7 of the last 8 right, including
the last 3, after at least 6. Premature mastery is no worse than before
(13% of slow learners vs 10%), and spaced reviews catch what fades. The
lesson bar now counts the same way and stays one short until the last three
are right.

## Round 10: the youngest children's tap-buttons
Grade 1-3 children practise on a screen with big buttons, not a text box. A
tapped button is right only if its label equals the answer exactly.

Found:
- **A Grade 3 time question could never be answered right.** "A lesson
  starts at 11:45 and lasts 2 hours. When does it end?" showed the buttons
  13, 14 and 12 for the answer 13:45 (the screen read "13:45" as the number
  13), so every tap was wrong however well the child knew it. Existing bug,
  hit by every young learner on Grade 3 time.
- The new Grade 1-3 questions from round 4 (o'clock, shape riddles,
  clock-hand turns) and Grade 4 compass and angle questions fell back to a
  typing box, which a 6-year-old can't use well.

Fixed:
- Clock answers get clock buttons (the time and nearby times).
- O'clock questions show "3 o'clock" buttons (typing "3:00" still works);
  shape riddles, turns, compass directions, angle types and mass/capacity
  units all have buttons.
- The button planner moved to `src/ai-tutor/youngPlan.js` so the engine test
  checks it: **the right answer is a button in all 1,620 young-learner
  questions tested**. 2% of Grade 4 questions still type (the shaded-grid
  question, which is answered on the picture).

## Round 11: question types and feedback from the research
Research: `docs/qa/research/` (Cambridge, KPSEA/KJSEA styles, KICD designs,
learning science). Inventory before: 177 of 276 skills never named a mistake,
5 of 85 Grade 4-6 skills ever showed choices, 13-17% of questions were word
problems, nothing was step-marked.

Found on the way:
- **Fraction subtraction could freeze the screen** (in the last merge): the
  "no zero answer" rule redrew one fraction forever for 2/4 − ?/2. Fixed.
- **Mistake feedback written for 483 question types was never shown** in
  practice (only the young buttons used it). Now shown after a wrong try.
- Marking: 0.75 was accepted for "4/5 as a decimal" and 3.66 for 7.4 × 0.5
  (a rounding margin applied to exact keys); "9 metres" for 9 kilometres;
  "8,200,000" rejected (only every other comma read); "4/5" accepted for the
  blank in 4/5 = ?/30. All fixed; 9 new engine tests.
- Six first hints gave the answer away (factor and multiple lists, 120 = 60 +
  60, f'(x) handed over, the proof sum). Rewritten.

Built (cards 1-7 of the preview):
1. Four-choice questions, every wrong option a real mistake (`choices.js`);
   about 1 question in 10, lessons only, never the free check or reviews; a
   choice answer never proves mastery.
2. Common-mistake catalogue (`mistakes.js`): skills naming the mistake went
   from about 1 in 3 to 62 of 85 in Grades 4-6 and 49 of 99 in Grades 7-9.
3. "Teach it back" asks which step the child just did, as a choice.
4. Spot the mistake: 22 builders, Kenyan names, served after 2 right answers.
5. Kenyan word problems with a bar model (10 structures) shown after a wrong
   try; half can be four-choice.
6. Always / sometimes / never: 38 statements.
7. Step-marked questions for Grades 7-9 (12 builders: hire purchase, VAT 16%,
   SACCO interest, matatu speed, water tank, harambee ratio...), one mark per
   part, carry on with the right value after a miss.
Plus read-aloud on every Grade 4+ question. Kiswahili is not done: it needs
translated text checked by a teacher.

Checks: `npm run audit:items` (47,850 items: 0 findings), engine tests pass,
full answer audit re-run.

## Round 12: questions that repeat
The audit flagged skills where 60 questions held fewer than 15 different ones
(some had only 3: "If sin θ = 3/5, find cos θ" with three fractions). A child
practising those sees the same question again within minutes and can learn
the answer, not the method.

Before: 26 skills below 15 different questions in 60, 44 below 20.
After: 1 below 15, 5 below 20.

Fixed in two ways:
- **Wider numbers** where the range was needlessly narrow (circle radius
  2-14, dy/dx = kx with k 2-5, binary up to 15, squares up to 15).
- **New question forms**, which also teach better, since the reverse question
  tests understanding rather than a remembered pattern:
  - logs: log₂(32) = ?, log₂(x) = 5, 2^x = 32, log(1/8)
  - circles: radius or diameter, π = 22/7 with whole answers, circumference
    given → radius, area given → radius (bicycle wheels, tank lids, shamba)
  - squares and roots: 0.3² (children write 0.9), 30², √(4/9), side from area
  - cubes: volume of a box, edge from volume, ∛(−27)
  - indices: 2^0, 2^? = 32, 2^−3
  - Pythagoras: scaled triangles; a matatu's route, a ladder, a shamba diagonal
  - polygons: exterior angles, sides from an exterior or interior angle
  - arrangements: class officers, letters of KENYA, n!; selections: teams,
    handshakes
  - trig: all six ratios from Pythagorean triples, negative values in all
    four quadrants, cleared equations (2sin θ = 1), tan 2θ, period and
    max/min of y = a sin(kx) + d
  - statistics: binomial mean, variance, P(X ≤ 1); a missing probability;
    E(X) from a table
  - partial fractions with any two linear factors; simultaneous equations
    x − y, xy; surds both ways; bases 2 and 5 both ways; prime factors built
    from primes (up to 400) and the reverse
  - congruence with measurements (SSS/SAS/ASA/RHS), matching sides and
    angles; symmetry: rotational order and capital letters; scatter graphs:
    Kenyan contexts, reading a line of best fit, outliers
  - Grade 1-3: coins of 1, 5, 10 and 20 shillings and mixed coins; 12 more
    straight/curved objects (sugarcane, chapati, sufuria); clock-hand turns
    from any quarter. The young lesson screens are unchanged.

The rewritten maths generators were checked by an independent calculation
from the question text (10,000 questions: 0 wrong), and every key marks itself
right. The fact-based ones (congruence, symmetry, constructions, lines) were
checked by reading each fact.

Found on the way:
- E(X) = 2.1 accepted 2.0625, and a space diagonal of 9.90 (shown as "9.9")
  accepted 9.85: the rounding margin again. Exact keys now carry their exact
  value; 2-d.p. keys keep both places.
- The audit expected "9 cm" to be right for "How many metres are in 900 cm?".
  Wrong units are rejected on purpose now, so the audit only tries the unit
  the question asks for.
The 5 still under 20 are small by nature (placing -9 to 9 on a number line,
half and quarter of small numbers for Grade 2, the fixed facts of
constructions and induction).
- Final full audit: the low-variety section is empty. Two more margin gaps
  fixed (a 4-d.p. key written "0.041" accepted 0.0413; "4 laps of 400 m =
  1.6 km" accepted 1.65). Left as is: "12" accepted for "12 o'clock" in
  Grades 1-2, and hints that state a rule whose number happens to be the
  answer (the 68-95-99.7 rule, "the 1s column").

## Round 13: Grade 10-12 mistake feedback
Before: 6 of 54 senior skills ever named a mistake. After: 54 of 54.

Senior mistakes are topic-specific, so they are listed per skill
(`src/ai-tutor/seniorMistakes.js`, 38 skills) or written into the builder
where the exact values are known (differentiate, integrate, definite
integrals, series, further differentiation, substitution, by parts).
Examples of what the child now hears:
- log a + log b written as log(a + b): "Adding logs MULTIPLIES the numbers
  inside."
- the power not brought down, or not reduced, when differentiating; the
  derivative given when asked to integrate
- F(top) only, or F(bottom) − F(top), for a definite integral
- a² + b² for the cosine rule (that is Pythagoras); the wrong sign on 2ab cos C
- sin(A + B) = sin A + sin B; sin 2θ = 2 sin θ
- the 16% tail doubled to 32%; the variance given for the mean
- f(y) given for f⁻¹(y); the x of a minimum given for the minimum value
- a₂₁ for a₁₂; ad + bc for a determinant; A and B swapped in partial fractions
- the 9th term given when the sum of 9 terms was asked
Every wrong answer listed is checked not to be marked right, and feedback
never states the answer (audit:items, 0 findings).
