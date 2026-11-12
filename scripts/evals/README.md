# Tutor test set (conversation engine plan, step 4)

Plays the 30 situations in `Tutagora/Build/voice-tutor/evals/SCENARIOS.md` as whole lessons through the REAL server turn
code (`src/voice-tutor/tutorTurn.js`, with the orchestrator state passed back and forth as `VoiceTutor.jsx` does) and the
real model. A pretend child (Claude, briefed per scenario) answers; a separate judge (claude-opus-5-5, high effort) scores
the transcript. This calls the API and costs real money. Run it after every change to the tutor.

## Run

    npm run eval:tutor -- --scenarios all                 # all 30, most important first
    npm run eval:tutor -- --scenarios 1,2,9 --max-turns 8
    npm run eval:tutor -- --scenarios 30 --max-turns 12

Options: `--scenarios all|1,2,3`, `--max-turns N` (default 12, scenario 30 gets 24), `--cap USD` (default 10),
`--concurrency N` (default 3), `--judge MODEL`, `--no-judge`, `--no-patterns`.

The key is read from `~/.tutagora/anthropic.key` inside the script and never printed or stored.

## The cost cap

The cap is a HARD total across all runs, kept in `evals/runs/ledger.json` (so two runs of $6 cannot both go ahead under a
$10 cap). Before every call the harness checks that the call's likely cost still fits; a scenario is only started if the
remaining budget probably covers it; at the cap the lesson in progress stops and the rest is listed as not run.
To spend more, raise `--cap` (a deliberate act) or reset the ledger file.

Cost: about US$0.20 to 0.30 a scenario (tutor about $0.01 a turn after the first turn's $0.05 cache write, pretend child
about $0.002 a turn, judge about $0.05), so a full run of 30 is about US$7 (measured: US$7.05 on 12 Nov 2026).
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
(scenario 27 uses a rule-based garbling). The pretend child is a model and is wordier and tidier than a real ten-year-old.

`EVAL_RAW=/path/file` appends the raw model output of every tutor turn to that file (debugging only).

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
