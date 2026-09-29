# Sunday report: setup

Parents opt in on **Goals and messages** (phone number, WhatsApp or SMS, consent).
Every Sunday at 18:00 Kenya time the `weekly-report` function builds one message per
child and sends it. Until a sending provider is set up, reports are built and stored
but not sent, and the "Send me a test now" button says sending isn't switched on yet.

## 1. Database (once)

Run `supabase/migrations/20261001_weekly_reports.sql` in **SQL Editor**.

## 2. Choose how messages are sent

Set these under **Edge Functions → Secrets**. Set one provider or both. A parent who
chose WhatsApp gets SMS instead when only SMS is set up.

### SMS through Africa's Talking (quickest to start)

| Secret | Value |
|---|---|
| `AT_USERNAME` | your Africa's Talking username (`sandbox` while testing) |
| `AT_API_KEY` | the API key from the Africa's Talking dashboard |
| `AT_SENDER_ID` | optional: an approved sender name such as `TUTAGORA` |

A full report is about 300–450 characters, so it is billed as 2–3 SMS.

### WhatsApp through Twilio

| Secret | Value |
|---|---|
| `TWILIO_ACCOUNT_SID` | from the Twilio console |
| `TWILIO_AUTH_TOKEN` | from the Twilio console |
| `TWILIO_WHATSAPP_FROM` | your WhatsApp sender number, for example `+2547…` |
| `TWILIO_CONTENT_SID` | the approved template's SID (starts with `HX`) |

WhatsApp only lets a business message someone first with a **pre-approved
template**. Create a Content Template in Twilio (category: Utility) with this body and
submit it for approval:

```
Weekly update from Tutagora: {{1}} practised maths {{2}}. New skills mastered: {{3}}. Finding hard: {{4}}. Weekly goal: {{5}}. See more and send a message at tutagora.com/family
```

The function fills the five blanks. Without `TWILIO_CONTENT_SID` it sends the plain
text instead, which WhatsApp only delivers when the parent has messaged your number in
the last 24 hours (useful for testing with your own phone).

## 3. Deploy the function

**Edge Functions → Deploy a new function → Via editor**, name it `weekly-report`, and
paste the whole of `supabase/functions/weekly-report/index.ts`. (Or with the CLI:
`supabase functions deploy weekly-report`.)

Then add one more secret, **`REPORT_CRON_SECRET`**: any long random password. The
schedule sends it so that nobody else can trigger a mass send.

Test it: on **Goals and messages**, save your own number and tap **Send me a test now**.

## 4. Schedule it (every Sunday 18:00 Kenya time)

In **Database → Extensions**, turn on `pg_cron` and `pg_net`. Then run
`supabase/sql/schedule-weekly-report.sql` in **SQL Editor**, after replacing
`PASTE_YOUR_REPORT_CRON_SECRET` with the same value as the `REPORT_CRON_SECRET` secret.

To stop the schedule: `select cron.unschedule('tutagora-weekly-report');`

## Changing the message

The text is written in `src/family/weeklyReport.js` (the in-app preview uses the same
file). After changing it, run `npm run build:report-fn` to regenerate the function and
deploy it again. If you change the WhatsApp wording, the template needs approving again.
