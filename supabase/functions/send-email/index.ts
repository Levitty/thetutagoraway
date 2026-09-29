import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_API_URL = "https://api.resend.com/emails";

interface EmailRequest {
  type: "welcome" | "booking-confirmation" | "lesson-reminder" | "booking-cancelled" | "tutor-under-review" | "tutor-approved" | "tutor-rejected" | "tutor-document-reminder";
  to: string;
  data: Record<string, any>;
}

interface ResendResponse {
  id?: string;
  error?: string;
}

// Email templates, on the site's design: a coral band with the tutagora
// wordmark, near-black type, one black button, flat panels. Table layout and
// inline styles so Gmail, Outlook and phone mail apps all render it.
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
const first = (name: unknown) => esc(String(name ?? "").trim().split(/\s+/)[0] || "there");

const INK = "#121117";
const CORAL = "#ff7aac";
const MUTE = "#6c6c78";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const p = (html: string) => `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.55;color:${INK};">${html}</p>`;
const button = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 8px 0;"><tr><td style="background:${INK};border-radius:8px;">
    <a href="${href}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;">${label}</a>
  </td></tr></table>`;
const details = (rows: [string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 22px 0;border-top:2px solid ${INK};">
    ${rows.map(([k, v]) => `<tr><td style="padding:11px 0;border-bottom:1px solid #dcdce2;font-size:14px;color:${MUTE};font-weight:600;width:38%;">${k}</td><td style="padding:11px 0;border-bottom:1px solid #dcdce2;font-size:15px;color:${INK};font-weight:700;">${v}</td></tr>`).join("")}
  </table>`;
const panel = (title: string, items: string[], tone: "soft" | "dark" = "soft") => {
  const bg = tone === "dark" ? INK : "#f4f4f6";
  const fg = tone === "dark" ? "#ffffff" : INK;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px 0;"><tr><td style="background:${bg};border-radius:8px;padding:18px 20px;color:${fg};">
    <div style="font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;opacity:.75;margin-bottom:8px;">${title}</div>
    ${items.map((i) => `<div style="font-size:15px;line-height:1.5;margin:6px 0;">${i}</div>`).join("")}
  </td></tr></table>`;
};

function layout(opts: { kicker: string; title: string; body: string; foot?: string }) {
  const { kicker, title, body, foot = "Questions? Just reply to this email." } = opts;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f4f6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f6;"><tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;font-family:${FONT};">
      <tr><td style="background:${CORAL};padding:26px 28px 28px 28px;">
        <div style="font-size:24px;font-weight:900;letter-spacing:-.04em;color:${INK};">tutagora<span style="display:inline-block;width:8px;height:8px;background:${INK};border-radius:2px;margin-left:3px;vertical-align:top;margin-top:4px;"></span></div>
        <div style="margin-top:22px;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:${INK};">${kicker}</div>
        <div style="margin-top:6px;font-size:30px;line-height:1.08;font-weight:800;letter-spacing:-.03em;color:${INK};">${title}</div>
      </td></tr>
      <tr><td style="padding:28px;">${body}</td></tr>
      <tr><td style="padding:0 28px 28px 28px;">
        <div style="border-top:1px solid #dcdce2;padding-top:18px;font-size:13.5px;line-height:1.55;color:${MUTE};">
          ${foot}<br>Tutagora · Nairobi, Kenya · WhatsApp 0759 240 692
        </div>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function generateEmailTemplate(
  type: string,
  data: Record<string, any>
): { subject: string; html: string } {
  switch (type) {
    case "welcome": {
      const name = first(data.name);
      if (data.role === "tutor") {
        return {
          subject: "Welcome to Tutagora",
          html: layout({
            kicker: "Welcome",
            title: `Karibu, ${name}.`,
            body:
              p("Thanks for signing up to teach on Tutagora.") +
              panel("To go live", [
                "<b>Finish your profile.</b> Subjects, grades, your rate and a short bio.",
                "<b>Upload your documents.</b> Your ID and a teaching certificate or qualification.",
                "<b>We check it.</b> Usually within 24 hours, then families can book you.",
              ]) +
              button("Finish my profile", "https://tutagora.com/dashboard"),
          }),
        };
      }
      return {
        subject: "Welcome to Tutagora",
        html: layout({
          kicker: "Welcome",
          title: `Karibu, ${name}.`,
          body:
            p("Your Tutagora account is ready.") +
            panel("Where to start", [
              "<b>The free maths check.</b> About ten minutes. It finds the exact step your child is missing.",
              "<b>15 minutes a day.</b> Hand over the phone and they practise in their own space. Your PIN to leave.",
              "<b>A tutor for the stuck part.</b> Book a live lesson and pay with M-Pesa.",
            ]) +
            button("Go to my account", "https://tutagora.com/dashboard"),
        }),
      };
    }

    case "booking-confirmation": {
      const { studentName, tutorName, subject, date, time, price, length } = data;
      const rows: [string, string][] = [
        ["Tutor", esc(tutorName)],
        ["Subject", esc(subject)],
        ["When", `${esc(date)}${time ? ` at ${esc(time)}` : ""}`],
      ];
      if (length) rows.push(["Length", esc(length)]);
      rows.push(["Paid", esc(price)]);
      return {
        subject: `Booked: ${subject} with ${tutorName}`,
        html: layout({
          kicker: "Lesson booked",
          title: "You're all set.",
          body:
            p(`Hi ${first(studentName)}, your lesson is confirmed.`) +
            details(rows) +
            p("The lesson happens live inside Tutagora. When it's time, open your account and tap <b>Join</b>.") +
            button("See my lessons", "https://tutagora.com/dashboard"),
          foot: "Need to change the time? Reply to this email or message your tutor in the app.",
        }),
      };
    }

    case "lesson-reminder": {
      const { participantName, otherName, subject, time } = data;
      const now = !time || String(time).toLowerCase() === "now";
      return {
        subject: now ? `Your ${subject} lesson is starting now` : `Reminder: ${subject} lesson at ${time}`,
        html: layout({
          kicker: now ? "Starting now" : "Coming up",
          title: now ? "Your lesson is starting." : `Your lesson is at ${esc(time)}.`,
          body:
            p(`Hi ${first(participantName)}, your ${esc(subject)} lesson with ${esc(otherName)} is ${now ? "starting now" : `at ${esc(time)}`}.`) +
            button("Join the lesson", "https://tutagora.com/dashboard") +
            p(`<span style="color:${MUTE};font-size:14px;">Open Tutagora on a phone or laptop with a good connection, and allow the camera and microphone.</span>`),
        }),
      };
    }

    case "booking-cancelled": {
      const { participantName, otherName, subject, reason } = data;
      return {
        subject: `Cancelled: ${subject} with ${otherName}`,
        html: layout({
          kicker: "Lesson cancelled",
          title: "This lesson won't go ahead.",
          body:
            p(`Hi ${first(participantName)}, your ${esc(subject)} lesson with ${esc(otherName)} has been cancelled.`) +
            (reason ? panel("Reason", [esc(reason)]) : "") +
            p("You can book another time, or choose a different tutor.") +
            button("Find a tutor", "https://tutagora.com/tutors"),
          foot: "Questions about this cancellation? Reply to this email.",
        }),
      };
    }

    case "tutor-under-review": {
      return {
        subject: "We're reviewing your Tutagora profile",
        html: layout({
          kicker: "Application received",
          title: "Thanks. We're checking your profile.",
          body:
            p(`Hi ${first(data.name)}, we've received your application to teach on Tutagora.`) +
            panel("What happens next", [
              "We check your ID and qualifications, usually within 24 hours.",
              "We email you as soon as your profile is approved.",
              "Then families can find you and book lessons.",
            ]) +
            button("Go to my dashboard", "https://tutagora.com/dashboard"),
        }),
      };
    }

    case "tutor-approved": {
      return {
        subject: "You're approved to teach on Tutagora",
        html: layout({
          kicker: "Approved",
          title: `You're in, ${first(data.name)}.`,
          body:
            p("Your profile is checked and live. Families can now find you and book lessons.") +
            panel("Get your first booking", [
              "<b>Open your times.</b> Families can only book the hours you make available.",
              "<b>Finish your profile.</b> A clear photo and a bio that says how you teach.",
              "<b>Reply quickly.</b> Families notice, and it shows in your reviews.",
            ]) +
            p(`<span style="color:${MUTE};font-size:14px;">Tutagora keeps a 15% platform fee on each lesson. Payouts go out every Friday by M-Pesa.</span>`) +
            button("Go to my dashboard", "https://tutagora.com/dashboard"),
        }),
      };
    }

    case "tutor-rejected": {
      const { name, reason } = data;
      return {
        subject: "An update is needed on your Tutagora profile",
        html: layout({
          kicker: "Update needed",
          title: "One more thing before you go live.",
          body:
            p(`Hi ${first(name)}, we couldn't approve your profile yet.`) +
            (reason ? panel("What to fix", [esc(reason)]) : "") +
            p("Update your profile and we'll review it again.") +
            button("Update my profile", "https://tutagora.com/dashboard"),
          foot: "Need help? Reply to this email.",
        }),
      };
    }

    case "tutor-document-reminder": {
      return {
        subject: "Finish your Tutagora application",
        html: layout({
          kicker: "Almost there",
          title: "You're one step from teaching.",
          body:
            p(`Hi ${first(data.name)}, to put your profile live we just need:`) +
            panel("Still to add", [
              "A photo of your national ID or passport",
              "Your teaching certificate or qualification",
              "A short bio so parents get to know you",
            ]) +
            button("Finish my application", "https://tutagora.com/dashboard"),
          foot: "Need a hand? Just reply to this email.",
        }),
      };
    }

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    // Validate API key
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Parse request body
    const body: EmailRequest = await req.json();
    const { type, to, data } = body;

    // Validate required fields
    if (!type || !to || !data) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: type, to, data",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Validate email type
    const validTypes = [
      "welcome",
      "booking-confirmation",
      "lesson-reminder",
      "booking-cancelled",
      "tutor-under-review",
      "tutor-approved",
      "tutor-rejected",
      "tutor-document-reminder",
    ];
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({
          error: `Invalid email type. Must be one of: ${validTypes.join(", ")}`,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Generate email template
    const { subject, html } = generateEmailTemplate(type, data);

    // Call Resend API
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "hello@tutagora.com",
        to,
        subject,
        html,
      }),
    });

    const result: ResendResponse = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      return new Response(
        JSON.stringify({
          error: result.error || "Failed to send email",
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    console.log(`Email sent successfully to ${to} (ID: ${result.id})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        id: result.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error processing email request:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
