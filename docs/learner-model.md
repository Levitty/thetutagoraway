# The Learner Intelligence Model

Agreed with the owner on 11 Nov 2026. It follows section 9 of the Tutagora vision. HOREB owns it, and the school system (Tuta) sends its evidence to HOREB.

## Principles
1. **One record per learner, owned by HOREB.** A child is one person across HOREB practice, school homework, school exams and the live tutor.
2. **Evidence is the record.** Every observation is one row in an append-only log, and every other piece of data is worked out from it.
   - Nothing is updated or deleted, so it can be recalculated and explained to a teacher at any time.
3. **Neutral to framework and country.** Evidence names curriculum codes (skill, outcome, sub-strand), never Kenyan names in code.
   - A new country brings its curriculum and its concept bindings, and the model works unchanged.
4. **Rules a teacher can read first; statistics later.**
   - The five states come from written rules: `src/learner/mastery.js`, one rule set, with tests.
   - Knowledge tracing comes only once the evidence is rich enough to calibrate it.
5. **Academic memory is separate from conversational memory.**
   - Only academic memory decides mastery.
   - Conversational memory (tutor session notes, open questions) is context only, and is deleted after 90 days.

## 1. The evidence log: `response_events`, extended
`response_events` is already "the append-only system of record for every answered problem" for HOREB practice (migration 20260617). It already records:
- correctness, time, hints used, attempts, and whether it was a diagnostic or review question;
- the learner, the session, and a client event id for de-duplication.

So we extend it rather than build a second log.

New columns (one migration, idempotent):
| column | meaning |
|---|---|
| `source` | `practice` (default, what exists), `school_homework`, `school_exam`, `tutor`, `visual` |
| `door_id`, `learner_ref` | a school learner without a HOREB account (school_learner_links joins them to a child profile when a parent links) |
| `cskill` | curriculum skill code (`MATH.G5.NUMBER.FRACTIONS.ADD_SAME_DENOM`), when known |
| `outcome_code` | official outcome code, when known (an exam question tagged to one; a skill's outcomes otherwise) |
| `substrand_code` | sub-strand code, when that is all that is known |
| `framework` | `cbc` today |
| `difficulty` | `easy`, `medium`, `hard`, or null |
| `marks`, `max_marks` | for marked work (an exam question); practice and homework are 1 of 1 |
| `independent` | true when done without help (no hints, first attempt, not a tutor-guided step); null when unknown |
| `misconception` | the library code the wrong answer reveals, when known |
| `item_ref` | where it came from (`hw:<homework>:<n>`, `exam:<question>`, `tutor:<session>:<ask>`) for de-duplication and review |

- `student_id` becomes nullable. A check requires either `student_id`, or both `door_id` and `learner_ref`.
- Existing readers (teacher dashboard, struggles) keep working, because they filter on `student_id`.
- Rows that only the server writes (school, tutor) are written with the service role. Learners still insert only their own practice rows (RLS unchanged).
- A unique index on (`source`, `item_ref`, learner) keeps every observation in the log once.

### Writers (step 1)
- **HOREB practice:** `src/ai-tutor/telemetry.js` adds `source: 'practice'`, plus `cskill` and `difficulty` where the item carries them.
- **School homework:** when a sitting is answered (the `school-homework` function), one row per answer, carrying cskill, correctness, the misconception, `independent: true`, and `item_ref` `hw:<id>:<n>`.
  - A backfill turns the sittings already answered into rows.
- **School exams:** Tuta sends question marks for questions tagged to an outcome or sub-strand through a new signed door action (`evidence`). Each one gives one row with marks and max_marks, `item_ref` `exam:<question id>`.
  - Tuta keeps its own copy for its pages; HOREB's log is the learner record.
- **Live tutor:** each answer the server marks gives one row, `source: 'tutor'`, written at the end of the turn with the answer's class (src/voice-tutor/orchestrator.js, 12 Nov 2026). `independent: true` only when the answer was judged **understood** (right, with the child's own reason); every other class, including a right answer with no reason yet, is `independent: false`. When the reason comes on a later turn and is judged understood, the same row is updated to `independent: true` (no second row).
  - The class is the tutor model's `assess`, held to the seal: where the seal marks the answer wrong it can never be understood.
  - A visual goal met gives a `visual` row, weak evidence.

## 2. The five states: `src/learner/mastery.js`, pure
Per learner, per skill (and rolled up to outcome and sub-strand):

| state | rule (draft; the CBC teacher reviewer and the psychology graduate sign it off) |
|---|---|
| not yet assessed | no evidence |
| not enough evidence | fewer than 4 marks of evidence, or only easy items |
| emerging | under 50% of the marks right, or right mostly with help |
| developing | 50% or more right independently in the last 30 days, but not yet on medium or hard items, or not yet re-checked |
| mastered | at least 80% right independently on recent evidence that includes medium or hard items, AND right again on a re-check at least 14 days after first reaching it |

- Recent evidence counts more than old evidence. The newest 10 marks on the skill decide.
- Help lowers the weight of an item. An item done with help counts toward "emerging" only.
- **Re-checks:** a mastered skill is re-checked at 2, 4 and 8 weeks.
  - A failed re-check returns it to developing.
  - A re-check that is overdue by more than 4 weeks shows "mastered, due a re-check".
- Every state carries the evidence it rests on, as row ids, so a teacher can see why.

## 3. Misconceptions, interventions, conversation
- **Misconceptions:** counted from the log's `misconception` field, grouped across skills by the library's categories (`src/ai-tutor/misconceptions.js`). A misconception is "resolved" when the same skill is answered right three times after it was last seen.
- **Interventions:** `learner_interventions` (step 3) records a tutor lesson, homework set, or reteach on a skill, and the state before and after.
- **Conversational memory:** `learner_session_notes` (step 3) holds short notes and open questions per tutor session, deleted after 90 days.

## 4. Readers (step 3; old copies removed, not kept alongside)
- The live tutor picks its target from the states.
- The teacher home, report card comments and parent reports show the states in words.
  - Parents see the same five states as teachers, in plain words.
- The homework generator ticks the developing skills.
- `ai_tutor_progress` (the per-skill counters) stays until every reader has moved, then is worked out from the log.

## Order
1. Extend the log and its writers, plus the school homework backfill. No screen changes.
2. `mastery.js` with tests, and one teacher view of a learner's states, with the evidence behind each.
3. The readers move to the states. Interventions and session notes.
4. Retention re-checks scheduled into practice and homework.
5. Knowledge tracing, once the data supports it.

## 5. A tutor that knows the child (12 Nov 2026)
- **Readers.** `src/learner/model.js` reads the five states for the fraction skills from the evidence log (one read a lesson, cached; `src/learner/tutorLearning.js`). `pickTarget` takes the states when there is evidence and falls back to HOREB progress per skill when there is none. The tutor's context carries short lines: mastered, developing, the gap blocking the target, open misconceptions (a wrong answer not followed by two right ones), interests, what helped, last lesson's note.
  - "Secure" (draft, the tutor's own): mastered, or developing with 3 of the newest 4 marks right. It only decides what to teach next; it never sets mastery.
- **Profile.** `learner_profile` (interests, at most 8 plain words; what_helps from a fixed list of moves) and `learner_session_notes` (600 characters, deleted after 90 days by a trigger on insert, and not read past 90 days). The tutor writes them with two silent commands, `note_interest` and `note_what_helped`; the server validates, merges and saves them, and never sends them to the browser.
- **Report.** At `end_session` the server builds a plain report from the evidence (never the transcript), stores it in `lesson_reports` (shown on Messages and goals) and emails the account holder through Resend unless `lesson_report_settings.email_lesson_reports` is false. A lesson with no answers gets none.
- **Safeguarding.** `guard.js` screenWelfare adds bullying, sexual content, violence and weapons, danger now and more self-harm phrasings (Kenyan English, Kiswahili) to the shared rules. A flagged message or typed answer is recorded for a person (safeguarding_events, emailed to SAFEGUARDING_EMAIL), never reaches the model, and gets an authored care reply with a trusted adult and Childline Kenya 116; a crisis ends the lesson. Earlier flagged lines are replaced in the transcript the model reads. Nothing about a concern is ever in a parent report, evidence row or note.
