# HOREB Free August — Facebook campaign kit

Everything needed to launch in ~10 minutes. Budget: **KSh 500/day × 14 days = KSh 7,000**.
Creatives: `A` (navy constellation, brand-thesis hook) and `B` (light, how-it-works hook) —
Meta's delivery will find the winner.

## The link (use exactly this)

```
https://tutagora.com/horeb?utm_source=facebook&utm_medium=paid&utm_campaign=horeb_free_august
```

## Ads Manager setup — step by step

1. **adsmanager.facebook.com** → Create → Objective: **Traffic** ("send people to a destination").
2. Campaign name: `HOREB Free August`. Leave A/B test + Advantage campaign budget OFF.
3. **Ad set** (one only):
   - Budget: **Daily, KSh 500**. Schedule: start now → end Aug 14 (extend if it's working).
   - Conversion location: Website.
   - **Audience**: Kenya → Nairobi, Kiambu, Mombasa, Nakuru, Eldoret (+25 km each).
     Age **28–45**. All genders.
     Detailed targeting (any of): *Education*, *Parenting*, *Primary education*,
     *Mathematics*, *Homeschooling*. Leave "Advantage detailed targeting" ON (cheap reach).
   - **Placements**: Manual → Facebook Feed, Instagram Feed, Facebook Reels, Instagram
     Reels, Stories. (Uncheck Audience Network + Messenger — junk traffic.)
4. **Ad** (make two, same ad set — duplicate the first, swap image+text):

   **Ad A — poster `horeb-august.png` (navy)**
   - Primary text:
     > No child is bad at maths — they are missing one step. HOREB finds the exact step your child is missing and quietly rebuilds everything that stands on it. Free all of August, on any phone.
   - Headline: `Find your child's missing step`
   - Description: `Free CBC maths check · 15 minutes`
   - Website URL: the UTM link above. CTA button: **Learn more**.

   **Ad B — poster `horeb-august-b.png` (light)**
   - Primary text:
     > In 15 minutes, know exactly where your child stands in maths. A short, friendly check — no marks, no pressure — then HOREB rebuilds the missing steps one at a time. Free all of August. CBC, Grades 1–12.
   - Headline: `Free maths check for your child`
   - Description: `CBC Grades 1–12 · Works on any phone`
   - Same URL + CTA.

5. Payment method: card or M-Pesa under Billing. Publish. Ads go into review (~1–24h).

## The decision rule (day 14)

One number decides: **cost per child who completed the first check.**

- **Under KSh 250** → scale to KSh 1,000/day, add a results-style creative.
- **Over KSh 250 with good click-through** → the ads work, the landing leaks — fix
  tutagora.com/horeb conversion before spending more.
- **Over KSh 250 with weak click-through (<1%)** → creative/audience problem — new hooks.

## Measuring in Supabase (run in SQL editor)

```sql
-- Children who STARTED the first check during the campaign
select count(distinct student_id) as children_started
from response_events
where is_diagnostic = true
  and created_at >= '2026-08-01';

-- New student accounts during the campaign
select count(*) as new_students
from profiles
where created_at >= '2026-08-01';
-- (compare both against the July baseline before spend)
```

Meta reports clicks; Supabase reports activations. Cost per activated child =
spend ÷ children_started (minus the July daily baseline).

## Assets

- `horeb-august.png` — variant A (published organically Jul 29, post id 957008740837358_122117081091071440)
- `horeb-august-b.png` — variant B
- Poster source HTML (re-render/edit anytime): scratchpad `poster/poster.html`, `poster/poster-b.html`
  → render via headless Chrome at 1080×1350.

## Rules (standing)

- No people's faces in ads. No emojis in copy. Brand palettes only (navy constellation / light system).
- Never publish without explicit go.
