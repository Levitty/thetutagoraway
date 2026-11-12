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
