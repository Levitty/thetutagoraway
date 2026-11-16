// Situations 42 to 65 of Tutagora/Build/voice-tutor/evals/SCENARIOS.md (research round 3, 13 Nov 2026 night), as data the
// runner can play. WRITTEN, NOT RUN: running them is a paid call and waits for the owner's yes.
//
// Same shape as scripts/evals/scenarios.mjs on branch horeb/2026-11-13-tutor-four (child, expect, skill, fixed, silent, maxTurns,
// tag, limit; see the field notes at the top of that file), so they can be appended to SCENARIOS there when both branches meet.
// Differences:
//   skill          the FULL curriculum code (not a suffix), because some situations are outside fractions
//   misconception  the library code the pretend child holds (curriculum/mathematics/g5.json), or null
//   moves          the round 3 playbook moves the judge looks for (docs/tutor-training/PLAYBOOK_ROUND3_DRAFT.md)
//   waits          'fractions-only tutor': the live tutor teaches fractions only today; these run once it can open other skills
//
// The child text describes the child, never a script, and the pretend child sees only it (plus its knowledge sheet).
const F = 'MATH.G5.NUMBER.FRACTIONS.';
const R = (n, group, title, expect, child, extra = {}) => ({ n, group, title, expect, child, misconception: null, moves: [], ...extra });
const BEYOND = 'fractions-only tutor';

export const SCENARIOS_ROUND3 = [
  // ---- 42 to 52: the round 3 moves
  R(42, 'Round 3 moves', 'A slip, not a misconception', 'Expect the tutor to name the right plan and ask the child to check the one step that slipped, within one turn; no re-teaching of the idea, no strips or pictures brought in to explain what the child already knows. (R3-1)',
    'You understand equivalent fractions well and explain your method clearly (multiply the top and the bottom by the same number). But you make small times-table slips now and then, for example 3 x 3 = 10. When asked to check a step, you find your slip yourself.',
    { skill: F + 'EQUIVALENT_FRACTIONS', moves: ['R3-1'], tag: 'rigour', maxTurns: 10 }),
  R(43, 'Round 3 moves', 'Has a rule but cannot say it', 'Expect, after one open "how did you get that?", a choice between two real ways ("did you count the pieces, or look at the numbers?") rather than a third open why; the tutor then names the misconception from the child\'s choice and repairs it. (R3-1)',
    'You think 1/6 is bigger than 1/3 because 6 is bigger, but you cannot put it into words. Asked why, you say "I don\'t know, I just know" or shrug. If HOREB offers you a choice of ways, you pick the one that matches what you did.',
    { skill: F + 'COMPARE_LIKE_FRACTIONS', misconception: F + 'COMPARE_LIKE_FRACTIONS.M_COMPARE_BIGGER_DENOMINATOR', moves: ['R3-1'], tag: 'scaffold', maxTurns: 12 }),
  R(44, 'Round 3 moves', 'Half answers', 'Expect "tell me more" or "what else?" once after a half answer, before the tutor adds anything; the key step comes from the child. Fail if the tutor completes the child\'s half answer with the key idea. (R3-2)',
    'You notice things but say only half of what you see: "they are the same", "it got bigger", "more lines". If asked to say more, you add the next part of your thinking. You never give the full reason first time.',
    { skill: F + 'EQUIVALENT_FRACTIONS', moves: ['R3-2'], tag: 'rigour', maxTurns: 12 }),
  R(45, 'Round 3 moves', 'The funnel trap', 'Expect no more than two closed questions in a row (yes or no, one number, this-or-that); the third question asks the child to connect. The child must say the key step (that both numbers are multiplied by the same number). Count the closed questions in a row; more than three fails. (R3-3)',
    'You answer small easy questions correctly ("how many parts?" "four"), but you do not join them up by yourself. If HOREB keeps asking tiny questions, you keep answering them without seeing the big idea. You see the idea only if HOREB asks you to explain what the answers mean.',
    { skill: F + 'EQUIVALENT_FRACTIONS', moves: ['R3-3'], tag: 'both', maxTurns: 14 }),
  R(46, 'Round 3 moves', 'Often wrong, never told so', 'Expect no verdict words at all ("wrong", "no", "not quite", "almost", "close") and no "good" after a wrong answer; each wrong answer gets a named right part and an invitation to check. Count the verdict words; any fails. (R3-4)',
    'You are wrong about half the time on this skill, in different ways each time (once you add the tops and bottoms, once you forget to rename, once you get it right). You are not upset by being wrong.',
    { skill: F + 'ADD_ONE_RENAMING', moves: ['R3-4'], tag: 'both', maxTurns: 14 }),
  R(47, 'Round 3 moves', 'Help goes up, then down', 'Expect the help to rise one step after each failure (nudge, focusing question, new picture, worked example on a different question) and fall after a success; never two steps at once. The lesson ends with one question the child does with no help at all, and only that one is logged as independent. (R3-5)',
    'You fail the first two tries at subtracting with renaming, then get it with a picture, then can do the next one with less help, and the last one alone.',
    { skill: F + 'SUBTRACT_ONE_RENAMING', moves: ['R3-5'], tag: 'scaffold', maxTurns: 16 }),
  R(48, 'Round 3 moves', 'Stuck on one picture', 'Expect a change of representation after two failed tries on the same picture (bar to number line, or to a story with Kenyan objects), not a third explanation on the same bar, louder or longer. (R3-6)',
    'You cannot see equivalence on fraction bars at all: the bars confuse you. You understand at once when it is a story about sharing chapatis, or on a number line.',
    { skill: F + 'EQUIVALENT_FRACTIONS', moves: ['R3-6'], tag: 'scaffold', maxTurns: 14 }),
  R(49, 'Round 3 moves', 'Upset, then the expert', 'Expect the feeling named small (not "it is easy", not "you are clever"), a sure win, then a climb back to the original within a few turns; a worked mistake by a made-up pupil is the strong move here. Fail on "it is easy" or praise for the person. (R3-6, R3-7)',
    'Early in the lesson, after one mistake, you say "I am stupid at fractions, I always get them wrong" and go quiet. You cheer up when you get something right, and you enjoy correcting someone else\'s mistake.',
    { skill: F + 'SUBTRACT_ONE_RENAMING', moves: ['R3-6', 'R3-7'], tag: 'scaffold', maxTurns: 14 }),
  R(50, 'Round 3 moves', 'The floor is missing', 'Expect a quick floor check before teaching, or after the first miss that traces to it; the missing skill (multiplication facts used in renaming) is warmed up at the child\'s level and checked, then the tutor returns to adding fractions. Fail if the tutor tells the facts and carries on. (R3-8)',
    'You understand what fractions are, but you do not know your times tables beyond 5: you count on your fingers and often get 6 x 4 or 3 x 4 wrong. That is why renaming goes wrong for you.',
    { skill: F + 'ADD_ONE_RENAMING', moves: ['R3-8'], tag: 'scaffold', maxTurns: 16 }),
  R(51, 'Round 3 moves', 'Estimate first, then the alarm', 'Expect an estimate before the child calculates ("more than a half, or less?"), and the estimate used to show the child that 2/6 cannot be the sum; the child corrects their own method. (R3-9)',
    'When adding fractions you add tops and bottoms (1/2 + 1/4 = 2/6). You can estimate well if asked ("it is more than a half"), and when your answer does not match your estimate you are puzzled and want to find out why.',
    { skill: F + 'ADD_ONE_RENAMING', misconception: F + 'ADD_ONE_RENAMING.M_RENAME_ADD_DENOMINATORS', moves: ['R3-9'], tag: 'both', maxTurns: 12 }),
  R(52, 'Round 3 moves', 'Confident and wrong, with a bad picture', 'Expect no contradiction: the tutor asks the child to prove it on the board, then asks about the child\'s picture (unequal loaves or unequal parts) until the child sees the problem and changes their mind; the tutor names the good thinking. Fail if the tutor agrees, or simply tells. (R3-10)',
    'You are sure 1/8 of a loaf is more than 1/4 because 8 is bigger, and you say so firmly twice. When asked to draw, you draw the second loaf bigger without noticing. When you notice, you fix it and change your mind.',
    { skill: F + 'COMPARE_LIKE_FRACTIONS', misconception: F + 'COMPARE_LIKE_FRACTIONS.M_COMPARE_BIGGER_DENOMINATOR', moves: ['R3-10'], tag: 'rigour', maxTurns: 12 }),

  // ---- 53 to 59: the fraction misconceptions not yet tested (9 and 10 test bigger denominator and adding tops and bottoms)
  R(53, 'Fraction misconceptions', 'Equivalence by adding', 'Expect the tutor to diagnose from the child\'s words ("I added 3 to both"), show 2/3 and 5/6 on equal strips, and let the child say the multiplying rule.',
    'To make equivalent fractions you add the same number to the top and the bottom (2/3 = 5/6), and you explain it that way.',
    { skill: F + 'EQUIVALENT_FRACTIONS', misconception: F + 'EQUIVALENT_FRACTIONS.M_EQUIV_ADDITIVE', moves: ['R3-1'], tag: 'both', maxTurns: 12 }),
  R(54, 'Fraction misconceptions', 'Changes only the bottom', 'Expect "is 3/8 of a cake the same as 3/4?" or a folding repair, and the child counting the shaded eighths.',
    'You think 3/4 = 3/8 because "the top stays the same", and you only change the bottom number.',
    { skill: F + 'EQUIVALENT_FRACTIONS', misconception: F + 'EQUIVALENT_FRACTIONS.M_EQUIV_ONE_TERM_ONLY', tag: 'both', maxTurns: 12 }),
  R(55, 'Fraction misconceptions', 'Simplifying makes it smaller', 'Expect a comparison on equal bars (2/3 and 8/12) and the child saying it is the same amount with a shorter name.',
    'You simplify correctly but you believe the simplified fraction is a smaller amount ("2/3 is less than 8/12 because the numbers are smaller").',
    { skill: F + 'SIMPLIFY_FRACTIONS', misconception: F + 'SIMPLIFY_FRACTIONS.M_SIMPLIFY_MAKES_SMALLER', tag: 'rigour', maxTurns: 12 }),
  R(56, 'Fraction misconceptions', 'One part short means equal', 'Expect the tutor to point at the missing piece in each strip and let the child compare a missing third with a missing quarter.',
    'You believe 2/3 and 3/4 are equal "because both are one piece away from a whole". You use the same idea for 5/6 and 11/12.',
    { skill: F + 'COMPARE_UNLIKE_FRACTIONS', misconception: F + 'COMPARE_UNLIKE_FRACTIONS.M_COMPARE_GAP_THINKING', tag: 'rigour', maxTurns: 12 }),
  R(57, 'Fraction misconceptions', 'Different wholes', 'Expect the tutor to draw a small and a big whole, and the child to say the wholes must be the same before comparing fractions.',
    'You think half of anything is always more than a quarter of anything, even half a small mandazi against a quarter of a big cake.',
    { skill: F + 'COMPARE_LIKE_FRACTIONS', misconception: F + 'COMPARE_LIKE_FRACTIONS.M_COMPARE_DIFFERENT_WHOLES', tag: 'rigour', maxTurns: 10 }),
  R(58, 'Fraction misconceptions', 'Drops the bottom number', 'Expect "five what?" and the unit said aloud ("two eighths plus three eighths is five eighths"); the child writes the fraction.',
    'When you add fractions with the same bottom number you add the tops and give a whole number: 2/8 + 3/8 = 5. In stories you say "she used 5".',
    { skill: F + 'ADD_SAME_DENOMINATOR', misconception: F + 'ADD_SAME_DENOMINATOR.M_ADD_DROPS_DENOMINATOR', tag: 'scaffold', maxTurns: 10 }),
  R(59, 'Fraction misconceptions', 'Thinks the take-away is impossible', 'Expect the tutor to ask the child to rename first, then compare, and to praise the child for checking whether the take-away was possible.',
    'Asked 1/2 - 3/8, you say "it cannot be done, 3/8 is bigger than 1/2 because 8 is bigger". You can rename halves into eighths if asked.',
    { skill: F + 'SUBTRACT_ONE_RENAMING', misconception: F + 'SUBTRACT_ONE_RENAMING.M_SUB_THINKS_IMPOSSIBLE', moves: ['R3-1'], tag: 'both', maxTurns: 10 }),

  // ---- 60 to 65: other strands (wait until the tutor can open skills beyond fractions)
  R(60, 'Beyond fractions', 'Longer decimal is larger', 'Expect both decimals placed on a metre stick or a 0 to 1 line, and a place value reason ("five tenths against four tenths and a bit") before the answer counts.',
    'You think 0.125 is bigger than 0.5 because 125 is bigger than 5. You read decimals as whole numbers after the point.',
    { skill: 'MATH.G5.NUMBER.DECIMALS.DEC_COMPARE', misconception: 'MATH.G5.NUMBER.DECIMALS.DEC_COMPARE.M_LONGER_IS_LARGER', tag: 'rigour', waits: BEYOND, maxTurns: 12 }),
  R(61, 'Beyond fractions', 'Smaller from larger in subtraction', 'Expect the tutor to ask the child to check by adding back (the check fails), then to repair with exchange on a place value chart or with money notes.',
    'When you subtract big numbers you take the smaller digit from the larger in each column, whichever is on top, so you never exchange. You are quick and confident.',
    { skill: 'MATH.G5.NUMBER.SUBTRACTION.SUB_6DIGIT_REGROUP', misconception: 'MATH.G5.NUMBER.SUBTRACTION.SUB_6DIGIT_REGROUP.M_SMALLER_FROM_LARGER', moves: ['R3-10'], tag: 'both', waits: BEYOND, maxTurns: 12 }),
  R(62, 'Beyond fractions', 'Area as perimeter', 'Expect the tutor to have the child cover the rectangle with 1 cm squares and count them, then link rows times columns; the child says why area uses square units.',
    'For the area of a rectangle you add the sides (7 cm and 5 cm makes 24 cm or 12). You are not sure what area means.',
    { skill: 'MATH.G5.MEASUR.AREA.AREA_RECT_SQUARE_CALC', misconception: 'MATH.G5.MEASUR.AREA.AREA_RECT_SQUARE_CALC.M_AREA_AS_PERIMETER', tag: 'scaffold', waits: BEYOND, maxTurns: 12 }),
  R(63, 'Beyond fractions', 'Converts the wrong way', 'Expect an estimate first ("more grammes or fewer kilogrammes?") and a body benchmark (a bag of sugar is 1 kg), so the child sees 6,000,000 kg is impossible and chooses to divide.',
    'When converting grammes to kilogrammes you always multiply by 1000 (6000 g = 6,000,000 kg). You do not check whether the answer makes sense.',
    { skill: 'MATH.G5.MEASUR.MASS.MASS_CONVERT_G_TO_KG', misconception: 'MATH.G5.MEASUR.MASS.MASS_CONVERT_G_TO_KG.M_CONVERT_WRONG_DIRECTION', moves: ['R3-9'], tag: 'both', waits: BEYOND, maxTurns: 12 }),
  R(64, 'Beyond fractions', 'A minute is 100 seconds', 'Expect the tutor to use a clock face (one full turn of the second hand) or counting along with a stopwatch, and the child to say why time does not regroup at 100.',
    'You think one minute is 100 seconds, so you regroup seconds at 100 when adding times. You know how to read a clock.',
    { skill: 'MATH.G5.MEASUR.TIME.MINUTE_SECOND_RELATION', misconception: 'MATH.G5.MEASUR.TIME.MINUTE_SECOND_RELATION.M_100_SECONDS_IN_MINUTE', tag: 'scaffold', waits: BEYOND, maxTurns: 10 }),
  R(65, 'Beyond fractions', 'Longer arms, bigger angle', 'Expect the same angle drawn with long and short arms, and an estimate against a right angle; the child says the angle is the amount of turn, not the length of the lines.',
    'You think an angle with longer arms is bigger, and you compare angles by how far apart the tips are.',
    { skill: 'MATH.G5.GEOMET.ANGLES.DEGREE_AS_UNIT', misconception: 'MATH.G5.GEOMET.ANGLES.DEGREE_AS_UNIT.M_LONGER_ARMS_BIGGER', tag: 'rigour', waits: BEYOND, maxTurns: 10, limit: 'Needs the board figures for angles (rendering engine phase 2).' }),
];

// The order for a capped paid run: the moves the research says matter most first.
export const PRIORITY_ROUND3 = [45, 42, 52, 49, 47, 50, 51, 43, 44, 46, 48, 53, 56, 59, 54, 55, 57, 58];
