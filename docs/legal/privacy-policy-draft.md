# Privacy Policy: draft for review

**Status:** draft, not live. Written 30 September 2026 from what the app's code
actually does. Items in [square brackets] need a fact from Tutagora.
Sections marked **LAWYER** need a Kenyan data-protection lawyer's check
before this goes live.

**Before publishing, the app itself must be fixed** so this policy is true
(see "Code changes needed" at the end). Publishing the deletion promise in
section 7 before the code does it would be a false statement.

---

## Privacy Policy

Last updated: [date of publishing]

### 1. Who we are

Tutagora Ltd ("Tutagora", "we", "us") runs tutagora.com and the Tutagora
apps. We decide how your personal data is used, which makes us the data
controller under Kenya's Data Protection Act, 2019. We are registered with
the Office of the Data Protection Commissioner (ODPC) as a data controller,
registration number [ODPC number]. **LAWYER:** confirm registration, since
processing children's data makes registration mandatory.

Contact: hello@tutagora.com | +254 759 240 692 | Nairobi, Kenya

### 2. The data we collect

**Parents and guardians**
- Name, email address, password (stored hashed), and profile photo if you add one.
- Phone number, only if you turn on the Sunday report.
- Payment records: amount, reference and plan. We never see your M-Pesa PIN or full card number; Paystack handles those.
- Messages you send to tutors, and notes you send to your child in the app.

**Children (learners)**
We collect as little as we can about children:
- first name and grade, entered by the parent (we do not ask for date of birth)
- practice progress: which skills are mastered, answers right or wrong, time taken, hints used, streaks and badges
- compositions and insha your child writes, with the mark and feedback
- during a live lesson: the lesson chat and whiteboard notes; audio and video pass through our video provider and are not recorded.

**Tutors**
Name, email, phone number, bio, qualifications, subjects, rate and availability; national ID and certificates (for verification); earnings and verification status.

**Teachers and schools**
Class name and join code. A teacher can see the names and practice progress of learners who join their class.

**On your device**
We do not use cookies for tracking or advertising. The site stores a few
things on your device so it works: your sign-in, practice progress (a copy),
a draft essay, and the settings for a child's own tablet. **Keep this
sentence true:** if Google Analytics or Microsoft Clarity is added, this
section must change the same day.

### 3. How we use it, and why we may

| What we do | Legal basis |
|---|---|
| Run your account, lessons, practice and bookings | Contract with you |
| Take payments and keep payment records | Contract; legal duty (tax records) |
| Verify tutors' identity and qualifications | Consent; legitimate interest in keeping children safe |
| Create and run a child's profile | The parent's or guardian's consent |
| Mark compositions with AI | The parent's consent |
| Send the Sunday report by WhatsApp or SMS | Your opt-in consent, which you can withdraw at any time |
| Flag a possible safeguarding concern in a child's writing | Legitimate interest and the child's vital interests |
| Keep the platform secure and improve it | Legitimate interest |

We do not sell personal data, show advertising, or use children's data for marketing.

### 4. Who we share it with

These service providers process data for us, only for the purpose shown:

| Provider | What they receive | Why | Where |
|---|---|---|---|
| Supabase | All account and learning data | Database, sign-in, file storage | [region of the Supabase project] |
| Paystack | Payer email, amount, payment reference | M-Pesa and card payments | Nigeria / global |
| Resend | Name, email, lesson details | Emails (welcome, bookings, reminders) | USA |
| Agora | Live audio and video during lessons | Video lessons | Global |
| Anthropic | The text of a composition, its task, grade and language. **Not** the child's name or email | AI marking | USA |
| Twilio | Parent's phone number, the Sunday report | WhatsApp delivery | USA |
| Africa's Talking | Parent's phone number, the Sunday report | SMS delivery | Kenya |
| Apple | Device token, lesson title, tutor's name | App notifications (iPhone) | USA |
| Google | Your Google account name and email, if you sign in with Google | Sign-in | USA |
| Render | Practice answers and skill levels. **No** name or account id | Choosing the next question | [region] |

People on Tutagora who see your data:
- A **tutor** sees the name, grade and focus note of a learner they are booked to teach.
- A **teacher** sees the names and progress of learners in their class.
- A **parent** sees their own children's progress.

### 5. Data sent outside Kenya

Several providers above are outside Kenya. We send data abroad only to
providers with safeguards required by the Data Protection Act, 2019
(sections 48 to 50) and only for the purposes above. **LAWYER:** confirm the
basis for each transfer, and whether children's data needs the parent's
separate consent to be transferred.

### 6. How long we keep it

- **Account data:** for as long as the account is open.
- **When an account is deleted:** within 30 days we erase the account, every child profile under it, their practice records, compositions, messages and the Sunday report phone number.
- **Payment records:** kept for 7 years because tax law requires it.
- **Tutor verification documents:** deleted within 30 days of account deletion or rejection.
- **Removing a child:** a parent can remove a child at any time, which erases that child's profile and records.

### 7. Your rights

Under Part IV of the Data Protection Act, 2019, you may:
- see a copy of your data, and take it with you
- correct it
- have it deleted
- object to how it is used
- withdraw consent at any time.

A parent or guardian exercises these rights for their child. Use account
settings or email hello@tutagora.com. We reply within 30 days.

### 8. Keeping it safe

We use:
- hashed passwords
- database rules so each account reaches only its own data
- private storage with time-limited links for documents
- filtering that stops phone numbers and emails being passed in chat.

### 9. Children

Tutagora is used by children from Grade 1 (about six years old) to Grade 12.

- **Profiles:** a child's profile is created by a parent or guardian, who agrees to it on the child's behalf. Children do not need an email address. A child's own tablet is linked by the parent, for that one child.
- **Learning only:** we use children's data only to teach them and report their progress to their parent, tutor or teacher.
- **No advertising or profiling:** there is no advertising, and no profiling for any other purpose.
- **Writing:** when we mark a child's writing with AI, we send the writing only, never the child's name.
- **Safeguarding:** if a child's writing suggests they may be at risk, our team is alerted so a person can decide what to do.

**LAWYER:** check this section against section 33 of the Act (processing
children's data), including how parental consent is verified.

### 10. Complaints

You may complain to the Office of the Data Protection Commissioner at
complaints@odpc.go.ke or odpc.go.ke. Please also tell us, so we can put it right.

### 11. Changes

We will tell you by email or a notice in the app before any important change takes effect.

---

## What changed from the current policy, and why

1. **Children (section 9).** The old policy said "aged 13 and above", but the app teaches Grade 1 children. It now describes what really happens.
2. **Parents.** They are now a named group. The old policy knew only "student or tutor".
3. **Providers (section 4).** Seven were missing: Anthropic, Twilio, Africa's Talking, Apple, Google sign-in, Render and ui-avatars. ui-avatars is left out of the draft on purpose; see code change 3 below.
4. **Payments.** M-Pesa is now mentioned. The old policy said cards only.
5. **Who inside Tutagora sees what.** Tutors and teachers seeing learner data was not disclosed before.
6. **"Continued use means acceptance" is removed.** For a service used by children, relying on silence for important changes is weak.
7. **Deletion (section 6)** now names children's data, and the code must be made to match (below).

## Code changes needed before this can go live

These were found by checking the code. They are the difference between the
policy being true or false.

1. **Account deletion is incomplete.** Today, deleting an account does not remove:
   - the sign-in record (the email stays)
   - child profiles and their compositions and answer logs
   - bookings and lesson chat
   - the Sunday-report phone number. A deleted parent **could keep receiving Sunday reports.** This one is urgent.

   Fix: delete server-side, removing the sign-in record, which clears most tables automatically, and remove the rest explicitly.
2. **Removing one child** leaves their compositions and answer logs behind. Fix: delete them too.
3. **ui-avatars.com** receives a child's name in a link to draw a letter avatar. Fix: draw initials in the app instead. The fix is small, and a child's name should not go to a third party for decoration.
4. **Data export** misses child profiles, compositions, answer logs, Sunday-report settings and lesson chat. Fix: include them.
5. **No parental consent step when adding a child.** Fix: add a required "I am this child's parent or guardian and agree to this policy" checkbox, recorded with the date.
6. **Google sign-up** has no consent checkbox, only a line of text. Fix: ask **LAWYER** whether that is enough.
