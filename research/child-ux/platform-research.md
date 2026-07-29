# How the best platforms do it — benchmark research

Deep research (Jul 2026) into the feedback/remediation/practice loops of Math Academy,
Khan Academy, Duolingo, IXL, Khanmigo/Synthesis, plus the learning-science literature.
Full sources inline. Used to drive the HOREB gap analysis in
[build-backlog.md](build-backlog.md).

---

## Per-platform highlights

### Math Academy
- Every lesson opens with a worked example, then short scaffolded questions (worked-example effect, Rosenshine).
- **FIRe**: wrong answers flow credit *backward* through the prerequisite graph, correct advanced answers flow *forward* — slashing review burden. (HOREB's propagateCredit is this family.)
- **XP ≈ focused minutes**, with calibrated penalties for rushing/gaming: adversarial students' pass rates jumped <50% → >90%.
- Wrong answers require reading the fully worked solution before moving on.
- **Users hate:** total loss of autonomy; timed diagnostic marks slow-but-correct as failure; conservative placement dumps redundant review. Text-dense, adult-feeling.

### Khan Academy
- Four mastery levels; **"Mastered" is only earnable on a later, mixed unit test** — never in the same session.
- Mastery Challenges: 6 questions over 3 skills, locked for 12h — spacing+interleaving as game mechanic.
- **Using a hint marks the question wrong** (keeps hints honest).
- **Hint-abuse lesson:** any hint chain that ends in the literal answer gets farmed; students harvest hints then retake identical questions. Fix: hints scaffold *process*, and numbers regenerate on retry.
- **Users hate:** "leveling down" — one slip on a long test demotes Mastered and demands a full retest. Decay is right; the penalty grain is wrong.

### Duolingo
- Half-Life Regression: per-learner forgetting curves schedule review (~45% better recall prediction, +12% engagement).
- Tiny sessions (2–5 min) that interleave new + review.
- **Emotionally safe wrong-answer feedback** — gentle, instant, never blames the learner.
- Streaks + Streak Freeze (forgiveness ≈ +48% D7 retention). Gamification's job: get them to *show up* so spacing can work.
- **Trap:** streak optimization decouples from learning — easy lessons protect streaks without teaching.

### IXL — the canonical anti-pattern
- SmartScore *subtracts visible points* on wrong answers, and subtracts MORE near the goal (90–99 "Challenge Zone").
- Result: fear of mistakes, rushing, tears, ~1.2/5 Trustpilot. **Never ship visible score loss on errors.**

### Khanmigo / Synthesis
- Socratic by construction — the engineering effort goes into NOT answering; graded hints grounded in the current exercise.
- Synthesis: adapts to the *reasoning* behind the wrong answer, warm voice, reframes instead of marking wrong.
- **Trap:** Socratic-only frustrates stuck novices (expertise reversal) — teach first, question later.

## Learning-science quick hits
- Retrieval practice & spacing: the two highest-utility techniques known (Dunlosky 2013).
- Interleaving: mixed practice ≈ doubles delayed-test performance vs blocked (Rohrer RCT).
- Worked-example effect + expertise reversal: novices need examples; the same examples *hurt* proficient learners → fade per learner.
- Productive struggle belongs *after* initial instruction, on transfer — never as first contact.
- Rosenshine: target ~80% success during guided practice.

## The 10 practices a wrong-answer/practice loop should follow
1. Target ~80% success in practice.
2. A wrong answer triggers *teaching* (worked solution / misconception diagnosis), not just scoring.
3. Hints scaffold process, never reveal the answer; regenerate numbers on retry.
4. Never subtract visible points; charge decay invisibly in the scheduler.
5. Certify mastery only on a delayed, mixed-skills check.
6. Schedule review by predicted forgetting; propagate credit through the graph.
7. Interleave old skills into every session.
8. Fade scaffolding per learner.
9. Reward effort-time and process, not just correctness streaks.
10. Wrong-answer tone: safe, specific, the app takes the blame.

## Synthesis for HOREB
Math Academy's **engine** (graph + FIRe + worked examples + effort-XP), wearing Duolingo's
**skin** (short sessions, forgiving streaks, blame-free feedback), with Khan's
**certification** (mastery via delayed mixed checks) and Synthesis's **voice** for young
learners — while treating IXL's SmartScore as the list of what never to ship.
