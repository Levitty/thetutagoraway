# Blind review, Mathematics Grade 4, the new families (13 Nov 2026)

Reviewer: Claude (blind pass; no author notes read first). These are the 127 generated families whose ids start `g4c.` (number, measures, geometry, data). A generator makes a different item each time, so I drew two different items from every family (254 items) and checked the key by hand, the wrong-answer feedback, the story and its numbers, reading level and Kenyan context. This reads the generator output, not every possible draw; the arithmetic and the "exactly one right option" checks run over 200 draws in the test suite. Nothing is signed off; every family stays `reviewed: false`. No paid calls.

## Counts

| Verdict | Families |
|---|---|
| Keep as written | 110 |
| Fix (made in the generator) | 17 |
| Drop (set aside) | 0 |

Misconception library (`g4.misconceptions.json`): I marked the 171 entries these families use (the other 74 belong to older families and are untouched).

| Mark | Entries |
|---|---|
| Common in the literature (source named) | 36 |
| Plausible, to confirm by a teacher | 129 |
| Doubtful (reason named) | 6 |

## Fixes made

| Family | What was wrong | Fix |
|---|---|---|
| time.dur.lesson | "Starts 9:30 a.m. and ends 12:15 a.m." (it ends after noon, and the draw could print 13:15 a.m.) | End time now in 12-hour form with p.m. after noon |
| time.est.event | "Which time is the most sensible for going to bed?": 8:00 p.m. was also sensible (and 7:00 a.m. for getting up) | Wrong times must now be at least four hours from the right time |
| pv.zero-gap | "Which place is the digit 4 in?" when the number has two 4s (30,464) | Numbers now have no repeated digit |
| frac.group.what | "6 learners in a pen" (a pen is for animals) and "1 of them are" | "Out of 6 learners, 1 is in the choir" |
| dec.notation.read | "Kamau's weight as 0.16 kg on a toy" | "the mass of a toy as 0.16 kg" |
| dec.place.zero | A pencil of 6.04 dm (60 cm); dm is not used in Kenyan primary | "a leaf as 6.04 cm" |
| len.conv.to-m | A door frame 955 cm tall | "the school flagpole" |
| len.perim.rect | A notice board 20 cm by 16 cm | "a greeting card" |
| len.perim.square | A square mat or cloth with sides of 39 m | garden, compound, plot, playing field |
| mas.compare | "The big sponge has a mass of 3 kg" (a sponge is light) | "bag of cotton wool", "bag of feathers" |
| time.conv.to-min, time.dur.to-min | A film, football match, church service or exam of 8 or 9 hours | Journeys and a clinic visit |
| time.est.shadow | "3:00 p.m.." (two full stops) | Fixed |
| fig.id.object | "A flag flown from a pole" keyed triangle, but the Kenyan flag is a rectangle | "a triangular pennant on a bicycle" |
| data.mat.tally | "1 bundles of five" | bundle or bundles |
| div.rem.left-over | Feedback mentioned bags and bag sizes in a story about sharing pencils among learners | Wording now fits the story |
| cap.read.scale | Feedback said "water level" when the liquid was cooking oil or paraffin | "liquid level" |

## Teacher-only questions

See `TEACHER_QUESTIONS_13NOV.md` under Mathematics Grade 4. Short list: whether centimetre-and-metre conversions are expected both ways at this grade, which wording the class uses for a quarter turn and for tally bundles, the clock-face use of IIII, and whether 24-hour times (13:15) are taught in Grade 4.

## Misconceptions marked doubtful

M_DATA_WRONG_TOOL, M_TIME_WEEK_NOT_7, M_ROMAN_IIII_FOR_4, M_EVEN_MEANS_BIG, M_CAP_ADD_OMIT_UNIT, M_MASS_ADD_OMIT_UNIT. Trap options and habits that are unlikely to be held as ideas.
