// mark-composition — marks an English composition or Kiswahili insha.
//
// The client sends the piece; we (1) identify the learner from their JWT,
// (2) enforce a daily cap so a runaway loop can't run up the bill, (3) ask
// Claude to mark it against the four-band /20 rubric via a forced tool call
// (so the output is always well-formed JSON, never prose), and (4) store the
// piece + feedback with the service role. The client never writes the score.
//
// Deploy:  supabase functions deploy mark-composition
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const MODEL = "claude-sonnet-5";
const FREE_PER_DAY = 5;
const PRO_PER_DAY = 20;
const MIN_WORDS = 40;
const MAX_WORDS = 1200;

const TYPE_NAMES: Record<string, string> = {
  narrative: "narrative story", descriptive: "descriptive composition", argumentative: "argumentative/discursive composition",
  letter: "letter (formal or informal as the task requires)", ending: "story that must end with (or begin with) a given sentence",
  proverb: "story illustrating a proverb/saying", own: "composition on a topic set by the learner's teacher",
};

const MARK_TOOL = {
  name: "mark",
  description: "Record the marks and feedback for the composition.",
  input_schema: {
    type: "object",
    properties: {
      off_task: { type: "boolean", description: "true only if the text is not a genuine attempt at the task (gibberish, a different task entirely, or copied instructions)." },
      off_task_reason: { type: "string" },
      bands: {
        type: "object",
        properties: {
          content:      { type: "object", properties: { mark: { type: "integer", minimum: 0, maximum: 5 }, note: { type: "string" } }, required: ["mark", "note"] },
          organisation: { type: "object", properties: { mark: { type: "integer", minimum: 0, maximum: 5 }, note: { type: "string" } }, required: ["mark", "note"] },
          language:     { type: "object", properties: { mark: { type: "integer", minimum: 0, maximum: 5 }, note: { type: "string" } }, required: ["mark", "note"] },
          mechanics:    { type: "object", properties: { mark: { type: "integer", minimum: 0, maximum: 5 }, note: { type: "string" } }, required: ["mark", "note"] },
        },
        required: ["content", "organisation", "language", "mechanics"],
      },
      strengths: { type: "array", items: { type: "string" }, description: "2–3 specific things done well, quoting the learner's own words where possible." },
      corrections: {
        type: "array",
        description: "Up to 8 of the most instructive errors. `original` MUST be an exact substring of the learner's text (same spelling, same punctuation) so it can be highlighted.",
        items: {
          type: "object",
          properties: { original: { type: "string" }, better: { type: "string" }, why: { type: "string" } },
          required: ["original", "better", "why"],
        },
      },
      vocabulary: {
        type: "array",
        description: "Up to 5 word upgrades: a plain word the learner used → a more precise one, with the phrase it sits in.",
        items: {
          type: "object",
          properties: { word: { type: "string" }, better: { type: "string" }, where: { type: "string" } },
          required: ["word", "better", "where"],
        },
      },
      next_step: { type: "string", description: "The ONE thing to do differently in the next draft. Concrete, doable in one sitting." },
      summary: { type: "string", description: "Two or three warm, honest sentences to the learner." },
    },
    required: ["off_task", "bands", "strengths", "corrections", "vocabulary", "next_step", "summary"],
  },
};

const systemPrompt = (lang: string, grade: number, type: string, words: [number, number]) => {
  const inSw = lang === "sw";
  const level = grade <= 6 ? "upper primary (CBC Grades 4–6)" : grade <= 9 ? "junior school (CBC Grades 7–9)" : "senior school (KCSE level)";
  return `You are an experienced Kenyan ${inSw ? "Kiswahili" : "English"} teacher marking a learner's ${inSw ? "insha" : "composition"}.
The learner is in Grade ${grade} — ${level}. Mark against what a strong Grade ${grade} learner can do, not against an adult.
Task type: ${TYPE_NAMES[type] ?? type}. Expected length at this level: about ${words[0]}–${words[1]} words.

Rubric — four bands, each 0–5, total /20 (the KCSE creative-writing scale: 16–20 excellent, 11–15 good, 6–10 fair, 1–5 weak):
1. content — answers the task set; ideas developed, not listed; for a story: a real turning point; for an argument: reasons and a counter-point; for a letter: purpose and layout right; for a proverb/given-sentence task: the story genuinely arrives at the meaning/sentence.
2. organisation — beginning, middle, end; paragraphing; each paragraph does one job; links between ideas.
3. language — sentence variety, precise vocabulary, register right for the task, idiom used naturally (not forced).
4. mechanics — tense consistency, agreement (${inSw ? "upatanisho wa kisarufi, ngeli" : "subject–verb"}), spelling, punctuation, capital letters.

How to mark:
- Be honest. A 20 is rare. Most solid work at this level lands 11–15.
- Feedback goes to the learner directly, in ${inSw ? "Kiswahili (sanifu, warm, simple)" : "plain English"}. Speak to them as "you". No jargon they wouldn't know.
- Every band note must point at something in THIS piece — quote their words.
- corrections: pick the errors that teach the most (a repeated tense slip beats a one-off typo). `original` must be copied EXACTLY from the text so it can be highlighted. Keep each to one sentence or phrase.
- Do not rewrite the piece for them. Show the fix and the reason; the next draft is theirs.
- If the text is not a genuine attempt at the task, set off_task = true, give the reason, and still fill the other fields briefly.`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) return json({ error: "marking is not configured yet" }, 503);

    // 1. Who is asking? The JWT the client sent, verified by Supabase.
    const authHeader = req.headers.get("Authorization") ?? "";
    const asUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await asUser.auth.getUser();
    if (authErr || !user) return json({ error: "sign in to get your work marked" }, 401);

    const body = await req.json();
    const language = body.language === "sw" ? "sw" : "en";
    const grade = Math.min(12, Math.max(4, Number(body.grade) || 7));
    const type = String(body.type || "narrative");
    const prompt = String(body.prompt || "").trim().slice(0, 600);
    const title = String(body.title || "").trim().slice(0, 120);
    const text = String(body.body || "").trim();
    const learnerId = body.learner_id ? String(body.learner_id) : null;
    const revisionOf = body.revision_of ? String(body.revision_of) : null;
    const words = text.split(/\s+/).filter(Boolean).length;
    if (!prompt) return json({ error: "missing prompt" }, 400);
    if (words < MIN_WORDS) return json({ error: `write at least ${MIN_WORDS} words first` }, 400);
    if (words > MAX_WORDS) return json({ error: `that's over ${MAX_WORDS} words — trim it down` }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // 2. Daily cap per account (all learners on it share the allowance).
    const since = new Date(Date.now() - 86400000).toISOString();
    const [{ count }, { data: sub }] = await Promise.all([
      admin.from("compositions").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since),
      admin.from("subscriptions").select("pro_until").eq("user_id", user.id).maybeSingle(),
    ]);
    const pro = !!sub?.pro_until && Date.parse(sub.pro_until) > Date.now();
    const cap = pro ? PRO_PER_DAY : FREE_PER_DAY;
    if ((count ?? 0) >= cap) return json({ error: `you've used today's ${cap} markings — come back tomorrow`, capped: true }, 429);

    // 3. Mark it.
    const wordTarget: [number, number] = grade <= 6 ? [120, 220] : grade <= 9 ? [200, 350] : [350, 500];
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2500,
        system: systemPrompt(language, grade, type, wordTarget),
        tools: [MARK_TOOL],
        tool_choice: { type: "tool", name: "mark" },
        messages: [{
          role: "user",
          content: `TASK: ${prompt}\n\nTITLE: ${title || "(none)"}\n\nLEARNER'S TEXT (${words} words):\n\n${text}`,
        }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("anthropic", res.status, detail.slice(0, 400));
      return json({ error: "the marker is busy — try again in a moment" }, 502);
    }
    const out = await res.json();
    const call = (out.content || []).find((c: any) => c.type === "tool_use" && c.name === "mark");
    if (!call?.input) return json({ error: "the marker gave no marks — try again" }, 502);
    const fb = call.input;

    // Only keep corrections that can actually be highlighted.
    fb.corrections = (fb.corrections || []).filter((c: any) => c?.original && text.includes(c.original)).slice(0, 8);
    fb.vocabulary = (fb.vocabulary || []).slice(0, 5);
    const clamp = (n: unknown) => Math.min(5, Math.max(0, Math.round(Number(n) || 0)));
    for (const k of ["content", "organisation", "language", "mechanics"]) fb.bands[k].mark = clamp(fb.bands?.[k]?.mark);
    const score = fb.off_task ? null : fb.bands.content.mark + fb.bands.organisation.mark + fb.bands.language.mark + fb.bands.mechanics.mark;
    fb.model = MODEL;

    // 4. Store, then hand it back.
    const { data: row, error: insErr } = await admin.from("compositions").insert({
      user_id: user.id, learner_id: learnerId, language, grade, type, prompt, title: title || null,
      body: text, word_count: words, score, feedback: fb, revision_of: revisionOf,
    }).select("id, created_at").single();
    if (insErr) { console.error("insert", insErr); return json({ error: insErr.message }, 500); }

    return json({ id: row.id, created_at: row.created_at, score, feedback: fb, remaining: cap - (count ?? 0) - 1 });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});
