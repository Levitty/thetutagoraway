# Tutor test set (conversation engine plan, step 4; 41 situations since 12 Nov 2026)

Plays the 41 situations in `Tutagora/Build/voice-tutor/evals/SCENARIOS.md` (1 to 30, and 31 to 41 from `training/READING_12NOV.md`) as whole lessons through the REAL server turn
code (`src/voice-tutor/tutorTurn.js`, with the orchestrator state passed back and forth as `VoiceTutor.jsx` does) and the
real model. A pretend child (claude-haiku-5-5, briefed per scenario, see "The pretend child" below) answers; a separate judge (claude-opus-5-5, high effort) scores
the transcript. This calls the API and costs real money. Run it after every change to the tutor.

## Run

    npm run eval:tutor -- --scenarios all                 # all 41, most important first
    npm run eval:tutor -- --scenarios 1,2,9 --max-turns 8
    npm run eval:tutor -- --scenarios 30 --max-turns 12

Options: `--scenarios all|1,2,3`, `--max-turns N` (default 12; each scenario can set its own: 30 gets 24, 31 to 33 get 14, 34 to 40 get 6 to 10, 41 gets 40), `--cap USD` (default 10),
`--concurrency N` (default 3), `--judge MODEL`, `--no-judge`, `--no-patterns`, `--non-improving [N|never]` (the pretend child holds its wrong idea for N turns, default 4, or for ever).

The key is read from `~/.tutagora/anthropic.key` inside the script and never printed or stored.

## The cost cap

The cap is a HARD total across all runs, kept in `evals/runs/ledger.json` (so two runs of $6 cannot both go ahead under a
$10 cap). Before every call the harness checks that the call's likely cost still fits; a scenario is only started if the
remaining budget probably covers it; at the cap the lesson in progress stops and the rest is listed as not run.
To spend more, raise `--cap` (a deliberate act) or reset the ledger file.

Cost of a full run of 41 (estimate, 12 Nov 2026, from run 2's per-scenario costs with the Haiku child): about US$9.5 (range 9 to 10.5): the first 30 about US$6.8 (tutor 4.8, judge 1.9 to 2.2 with the longer rubric, child 0.03, patterns 0.1) and the eleven new ones about US$2.7 (scenarios 34 to 40 are mostly scripted and half their tutor turns are authored replies that call no model; 41 is a 40-turn lesson, about US$0.7 with its judge). The ledger stands at US$16.28 of an US$18 cap, so a full run needs the cap raised (about US$26).

Cost: about US$0.20 to 0.30 a scenario (tutor about $0.01 a turn after the first turn's $0.05 cache write, pretend child
pretend child about $0.002 a turn with Sonnet and about $0.0001 with Haiku, judge about $0.05), so a full run of 30 is about US$7 (measured: US$7.05 on 12 Nov 2026, with the Sonnet child; about US$0.6 less with the Haiku child).
If the judge's reply is ever cut off, re-run just those scenarios and fold them in with
`node scripts/evals/merge-runs.mjs <base run> <re-run>` (about US$0.1 for the patterns paragraph).

## Where results go

`Tutagora/Build/voice-tutor/evals/runs/<YYYY-MM-DD-HHMM>/`
- one markdown transcript per scenario (each tutor turn: words, board actions in brackets, the teaching move, the child's
  reply, the app's marking, the answer class, guard reasons, latency and cost);
- `scores.json` (judge scores, cost, probes fired, guards, safeguarding events);
- `SUMMARY.md` (table, spend, patterns across failures, the judge's worst turns, app issues noticed).

Pass rule (from SCENARIOS.md): every measure at least 3, average at least 4, no answer given away, no safeguarding miss.

## What is simulated, and what is not

Same as the page: request body, lesson state, session reducer (transcript, pace), board reducer, the silence rules
(`silence.js`) on a simulated clock, the real figure controls for shading, the sealed questions and the app's own marking.
Not simulated: audio, echo and barge-in timing (an interruption is the child's message plus what was "heard", cut after
about half the first sentence), the listening layer holding a child who thinks aloud, pictures of the board (the child's
ink and the idle/Check snapshots reach the tutor as plain text), word-level speech timing, and real speech-to-text errors
(scenario 27 uses a rule-based garbling). The pretend child is now a realistic one (below), but it is still a model: see the blind test for how close it gets.

`EVAL_RAW=/path/file` appends the raw model output of every tutor turn to that file (debugging only).

## The rubric (READING_12NOV.md change 2)

The judge (`report.mjs`) now also scores, from the transcript alone: **understanding** (1-5, only from the child's own words; a tutor's
explanation does not count), **appropriate scaffolding** and **appropriate rigour** (1-5, each scored only when the scenario's tag asks for
it: every scenario carries `scaffold`, `rigour` or `both` in `scenarios.mjs`), **over-scaffolding** (a count of tutor turns that did the
child's reasoning or said the key step), and **challenge** (0-5 under teaching: 0 the tutor does all the reasoning, 3 it prompts the key
steps, 5 it demands the child's thinking). Pass rule now: every measure at least 3, average at least 4, no answer given away (a key
intermediate step said for the child counts), no safeguarding miss (claiming feelings or promising a secret counts), the tagged
scaffolding or rigour score at least 3, over-scaffolding in at most 2 turns, challenge at least 2 (3 for a rigour-tagged lesson), and the
child saying at least 1.5 words per tutor turn (not for scripted children).

The child's talk share is counted by the harness, not the judge: the band is 25 to 40% of the words (TeachLM); the old idea of "over 50%"
is gone. A share outside the band is reported in the summary table ("Child talk") but does not fail a lesson by itself, because the pretend
child is capped at a few words a turn; only the floor on words does.

**The "never tell" exit.** The rule against telling has one exit, in both the rubric and the orchestrator (`orchestrator.js`, rule
`example`): after two failed attempts on a changed representation (a bar, then a circle or a number line), ONE worked example is allowed, on
a different question, with the picture, then a similar one is handed back. The judge does not count it as a giveaway or as over-scaffolding;
the turn gate does not flag the steps it shows; the open question's own answer stays hidden. The lesson state carries `changedFails` and
`examples` for it.

## The free yardstick: habit counts (PLAN_TO_FOUR.md step 1, no model calls, US$0)

    npm run eval:habits                       # runs 2026-11-12-1045 and 2026-11-12-1142 (the baseline)
    npm run eval:habits -- 2026-11-12-1142    # one run (a folder under the runs folder, or a path)
    npm run eval:habits -- --spot 10          # also list 10 flagged turns with the reason, for a person to judge
    npm run eval:habits -- --write            # also save HABITS.md in each run's folder
    npm run eval:habits -- --json

`scripts/evals/habits.mjs` reads the saved markdown transcripts and replays each lesson's facts (the sealed answers still
open, the answers found, the board, the level and its successes), then counts per tutor turn the habits the judge failed
in run 2. The checks are `src/voice-tutor/habits.js`: the SAME functions the live turn gate runs (`tutorTurn.js`), so a
count here is what the gate would have caught. Care turns are not counted. It never loads the API key.

From 12 Nov 2026 it also writes (`conversation-stats.mjs`): **drift by turn band** (habit failures in tutor turns 1-10, 11-20 and 21 and over,
and the same lessons early against late), the **TeachLM statistics** (child share of words against the 25 to 40% band, words and questions per
tutor turn, whether the opening asked what the child already knows, whether the earlier skill was checked first), the long lessons by thirds,
and how many giveaways are **key intermediate steps** said for the child ("same bottom number needed", `KEY_STEPS` in `habits.js`; the turn
brief names the skill's own steps as must-not-say) or claims of feelings and promises of secrets. The drift and the counts are measured without
the live gate's new late-lesson rule (the repeat check over four turns after turn 10), so they stay comparable; the report says what the rule adds.
Both baseline runs' `HABITS.md` carry the results.

| Habit | what is counted |
|---|---|
| giveaway | the sealed answer or a form of it, or the count the board shows, said before the question that asks for it; a figure labelled with a fraction the child has not found; the equivalence or the rule said for the child (not in the close) |
| repeat | a sentence nearly the same as the last question or a sentence of the last two tutor turns |
| stock | a stock phrase; praise over 8 words, on an unsure or wrong answer, or reusing none of the child's words; the same first three words as one of the last four turns |
| confirm_hedged | "yes" to an unsure or one-word answer that came with no reason, and no question about the reason in the turn |
| level_jump | harder numbers after fewer than two successes at the level in the guided or independent part (a helped success counts half, an unsure one zero), or harder numbers with no picture for them |
| unanswered | the child asked a question or "why", or sounded upset, and the first sentence (or the second, after a short acknowledgement) does not answer it |

Baseline (12 Nov 2026), turns flagged (scenarios with at least one):

| Habit | run 1 (2026-11-12-1045) | run 2 (2026-11-12-1142) |
|---|---|---|
| giveaway | 19 (14 of 30) | 22 (17 of 30) |
| repeat | 44 (19 of 30) | 44 (14 of 30) |
| stock | 107 (30 of 30) | 74 (23 of 30) |
| confirm_hedged | 20 (10 of 30) | 36 (18 of 30) |
| level_jump | 13 (9 of 30) | 27 (17 of 30) |
| unanswered | 14 (6 of 30) | 12 (4 of 30) |
| any habit | 173 of 392 turns | 161 of 394 turns |

Run 1's stock and repeat counts are mostly the app's own stand-in line ("Sorry, I lost my words... Can you say that
again?"), since removed. The judge's three worst turns per scenario that a check also flags: run 1 37 of 90, run 2 56 of
90. A paid run (`eval:tutor`) happens only when these counts say the habits are gone, and only on the owner's word.

## The pretend child (PLAN_TO_FOUR.md step 6, the part that needs no people)

Why: humans& found that a tutor tested against a generic model as the learner scored much worse than against a realistic one,
because generic models play learners who are right 85% or more of the time. Real learners are wrong on 25 to 30% of checkable
claims and speak in a few messy words. Ours was the tidy generic learner. Files:

| File | What it is |
|---|---|
| `child.mjs` | the child: decisions, the model's instructions, the speech clean-up, mishearing, the leak guard. No network code; the model is passed in, so it is tested offline |
| `child-sheets.mjs` | one knowledge sheet per scenario: what the child knows, is shaky on, does not know, and ONE misconception from the PLAYBOOK.md table (13, 14, 22 and 23 use the mistake their scenario already describes) with a target error rate |
| `realism-report.mjs` | the offline check (below) |
| `blind-test.mjs` | the blind real-versus-pretend test for Ruth, and its scorer |

How a turn works:
1. **The harness decides, the model does not.** For a turn where the tutor asked something checkable (a sealed answer, or a
   question the child can answer), the child is wrong with its misconception if the tutor's words touch the idea and the tutor has
   not yet repaired it; otherwise it is wrong with a probability that follows the target rate (default 0.27; per scenario in
   `child-sheets.mjs`; a running correction keeps a lesson near the target). The model is then told "you get this WRONG, using your
   wrong idea" or "you get this RIGHT: the answer is X", and the length to aim for. It is not left to be clever. About 17% of the
   other turns are a plain "I don't know", something unrelated, or an answer to a different question. Scenarios that are about how
   the child behaves (complains, asks, interrupts, wanders) let the model play that behaviour instead of these.
2. **The misconception is held until repaired.** It stays until the tutor has shown at least two more turns and a picture (three
   different kinds of picture in scenario 15, as its brief says), then the child lets go in a few words of its own ("ohh...").
   This is a rule on what the tutor draws, not a judgement of whether the tutor taught well.
3. **Short, messy speech, in code.** A length is drawn per turn (mostly 1 to 6 words, hard cap 12, per scenario lower or higher);
   lead-in words are dropped so a cut never loses the answer; a share of turns trail off ("..."), start with "umm/ehh", or are
   half-sentences. Mishearing (number words, plural endings: "two" to "too", "eighths" to "eight") is applied to about 12% of
   turns in every scenario and to every turn in scenario 27.
4. **No script leaks.** The model is sent only the brief (`child`) and the sheet, never `expect` or `limit`; the briefs of 22 and 23 no
   longer say what to type; and any reply that repeats five words of the brief or expectation, or names the script, is replaced by "I don't know".
5. **Model.** `claude-haiku-5-5` (priced in `src/rocket/guide.js`), so the child is not the same model as the tutor (Sonnet) or the
   judge (Opus), and costs a twentieth as much. If the API refuses it (404 or 400), the child falls back to `claude-sonnet-5-5` at low
   effort on its own and the result records which model was used (`results/NN.json`, `child.model`). It has not been called yet;
   the first paid run will show whether Haiku keeps to the instructions.
6. `EVAL_CHILD_SEED=N` makes the child's choices repeatable; each result stores its seed, error counts and moves.

### The non-improving child and the move mix (READING_12NOV.md change 4)

The oracle pretend child learns too easily (TutorMoments), so there is an option: `--non-improving` (the wrong idea is held for four turns
after it first shows, however many pictures the tutor draws), `--non-improving 6`, or `--non-improving never`; or per sheet (`persist`,
`noImprove` in `child-sheets.mjs`; scenarios 31 and 32 use 4 and 5). Use it on scenarios 9, 10, 11, 12, 15 and 18, the ones whose
misconception the tutor must change picture for, to test persistence and the "never tell" exit. Scenario 41's child tires (`tires` in its sheet).
The child's stats now carry the move mix (`moveMix`: shares of answer, I don't know, ignore, different question, ack, free; the wrong rate;
the hedge rate; mean words) and `mixDistance` gives the distances to a real sample, ready for the teacher's real answers (Persimmon was
validated on move mix, affect and error-rate distances). The realism report checks the wrong-answer rate at 25 to 30% (the decided rate and the rate as actually said).

### The offline realism report (US$0, no key, no network)

    node scripts/evals/realism-report.mjs            # seed 7, 80 lessons x 12 turns, a fake model, a fixed set of tutor turns
    node scripts/evals/realism-report.mjs --seed 3 --json

It plays 14 scenarios' children against 12 fixed tutor turns, with a fake model that is tidy and wordy on purpose (full
sentences, explanations), then prints and checks the numbers against the targets: wrong-answer rate (25 to 30% in the scenarios with the
default target; 24 to 31% as said), the non-improving option holds its idea at least four turns, what is said agrees with the decision (95%+), 1 to 6 words on 85%+ of turns, none over 12, tidy sentences of
8+ words under 5%, messy turns 30 to 50%, mishearing 5 to 16%, no leaks. It exits 1 if a check fails. It tests the plumbing and the
clean-up, not Haiku's wording; that is what the blind test is for.

### The blind real-versus-pretend test

When the teacher's real pupil answers exist, export the review sheet's "Real pupil answers" tab as CSV to
`Tutagora/Build/voice-tutor/evals/review/real-answers.csv` (columns: No., Question the teacher asked, Pupil's exact words,
Right/wrong/partly, Notes), then:

    node scripts/evals/blind-test.mjs make --live            # 10 real + 10 pretend replies to the same questions, mixed (about US$0.01)
    node scripts/evals/blind-test.mjs make --live --match-labels   # pretend replies right/wrong to match each real one
    # give blind-real-vs-pretend.csv to Ruth; she fills "Real or pretend? (R or P)" and "How sure?"
    node scripts/evals/blind-test.mjs score                  # accuracy, p against chance, and the pretend replies she spotted

`--fake` writes a test sheet with no model call. The key (`blind-key.json`) stays apart from Ruth's sheet. Reading the result:
about 40 to 70% is good (she cannot tell them apart); above 70% the child is still too easy to spot, and the scorer lists the
pretend replies she caught, so the sheets, the speech rules or the model can be changed and the test run again. The pupil
words are the teacher's, kept in the review folder, not in this repository.
