import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_API_URL = "https://api.resend.com/emails";

interface EmailRequest {
  type: "welcome" | "booking-confirmation" | "lesson-reminder" | "booking-cancelled" | "tutor-under-review" | "tutor-approved" | "tutor-rejected";
  to: string;
  data: Record<string, any>;
}

interface ResendResponse {
  id?: string;
  error?: string;
}

// Email template generator
function generateEmailTemplate(
  type: string,
  data: Record<string, any>
): { subject: string; html: string } {
  const baseStyles = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1f2937;
    line-height: 1.6;
  `;

  const logoBox = `
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
      <span style="color: white; font-size: 24px; font-weight: bold;">T</span>
    </div>
  `;

  const footerStyles = `
    border-top: 1px solid #e5e7eb;
    margin-top: 32px;
    padding-top: 24px;
    color: #6b7280;
    font-size: 14px;
  `;

  switch (type) {
    case "welcome": {
      const { name } = data;
      return {
        subject: "Welcome to Tutagora!",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 8px; padding: 32px; ${baseStyles}">
                  ${logoBox}

                  <h1 style="margin: 0 0 16px 0; font-size: 28px; color: #0f172a;">Welcome to Tutagora!</h1>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Hi ${name},
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    We're excited to have you join Tutagora, your gateway to personalized learning and expert tutoring. Whether you're here to master new skills or share your expertise, you're in the right place.
                  </p>

                  <p style="margin: 0 0 32px 0; font-size: 16px;">
                    Start exploring lessons, connect with tutors, and begin your learning journey today.
                  </p>

                  <a href="https://tutagora.com" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Explore Tutagora</a>

                  <div style="${footerStyles}">
                    <p style="margin: 0 0 8px 0;">Questions? We're here to help!</p>
                    <p style="margin: 0;">Tutagora Support Team</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      };
    }

    case "booking-confirmation": {
      const { studentName, tutorName, subject, date, time, price } = data;
      return {
        subject: "Your Booking is Confirmed!",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 8px; padding: 32px; ${baseStyles}">
                  ${logoBox}

                  <h1 style="margin: 0 0 16px 0; font-size: 28px; color: #0f172a;">Booking Confirmed!</h1>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Hi ${studentName},
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Your lesson has been confirmed. Here are your booking details:
                  </p>

                  <div style="background: #f3f4f6; border-left: 4px solid #10b981; padding: 20px; margin: 24px 0; border-radius: 4px;">
                    <div style="margin-bottom: 16px;">
                      <span style="color: #6b7280; font-weight: 600;">Tutor:</span>
                      <span style="color: #1f2937;">${tutorName}</span>
                    </div>
                    <div style="margin-bottom: 16px;">
                      <span style="color: #6b7280; font-weight: 600;">Subject:</span>
                      <span style="color: #1f2937;">${subject}</span>
                    </div>
                    <div style="margin-bottom: 16px;">
                      <span style="color: #6b7280; font-weight: 600;">Date & Time:</span>
                      <span style="color: #1f2937;">${date} at ${time}</span>
                    </div>
                    <div>
                      <span style="color: #6b7280; font-weight: 600;">Price:</span>
                      <span style="color: #1f2937; font-weight: 600;">${price}</span>
                    </div>
                  </div>

                  <a href="https://tutagora.com/bookings" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0;">View Your Booking</a>

                  <div style="${footerStyles}">
                    <p style="margin: 0 0 8px 0;">Need to reschedule? Visit your bookings page anytime.</p>
                    <p style="margin: 0;">Tutagora Support Team</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      };
    }

    case "lesson-reminder": {
      const { participantName, otherName, subject, time } = data;
      const participantType = data.participantType || "student"; // 'student' or 'tutor'
      const lessonType = participantType === "student" ? "your lesson with" : "your lesson with";

      return {
        subject: `Reminder: Your ${subject} lesson is coming up!`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 8px; padding: 32px; ${baseStyles}">
                  ${logoBox}

                  <h1 style="margin: 0 0 16px 0; font-size: 28px; color: #0f172a;">Lesson Reminder!</h1>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Hi ${participantName},
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Your ${subject} lesson ${lessonType} ${otherName} is starting soon!
                  </p>

                  <div style="background: linear-gradient(135deg, #10b98120 0%, #05966920 100%); border-left: 4px solid #10b981; padding: 20px; margin: 24px 0; border-radius: 4px;">
                    <div style="margin-bottom: 12px;">
                      <span style="color: #6b7280; font-weight: 600;">Subject:</span>
                      <span style="color: #1f2937;">${subject}</span>
                    </div>
                    <div>
                      <span style="color: #6b7280; font-weight: 600;">Starting at:</span>
                      <span style="color: #1f2937; font-weight: 600;">${time}</span>
                    </div>
                  </div>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Make sure you're ready and join on time!
                  </p>

                  <a href="https://tutagora.com/lessons" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Join Lesson</a>

                  <div style="${footerStyles}">
                    <p style="margin: 0;">See you soon!</p>
                    <p style="margin: 8px 0 0 0;">Tutagora Team</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      };
    }

    case "booking-cancelled": {
      const { participantName, otherName, subject, reason } = data;
      return {
        subject: "Your Booking Has Been Cancelled",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 8px; padding: 32px; ${baseStyles}">
                  ${logoBox}

                  <h1 style="margin: 0 0 16px 0; font-size: 28px; color: #0f172a;">Booking Cancelled</h1>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Hi ${participantName},
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    We wanted to let you know that your ${subject} lesson with ${otherName} has been cancelled.
                  </p>

                  ${reason ? `<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #991b1b; font-weight: 600;">Reason:</p>
                    <p style="margin: 8px 0 0 0; color: #7f1d1d;">${reason}</p>
                  </div>` : ""}

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    We hope to see you in another lesson soon. Feel free to browse available tutors and reschedule at your convenience.
                  </p>

                  <a href="https://tutagora.com/tutors" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Find a New Lesson</a>

                  <div style="${footerStyles}">
                    <p style="margin: 0 0 8px 0;">Questions about this cancellation?</p>
                    <p style="margin: 0;">Tutagora Support Team</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      };
    }

    case "tutor-under-review": {
      const { name } = data;
      return {
        subject: "We're Reviewing Your Profile — Tutagora",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 8px; padding: 32px; ${baseStyles}">
                  ${logoBox}

                  <h1 style="margin: 0 0 16px 0; font-size: 28px; color: #0f172a;">Profile Received!</h1>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Hi ${name},
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Thank you for signing up to teach on Tutagora! We've received your profile and documents, and our team is currently reviewing your application.
                  </p>

                  <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-weight: 600;">What happens next?</p>
                    <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #78350f;">
                      <li style="margin-bottom: 8px;">We'll verify your ID and credentials (usually within 24 hours)</li>
                      <li style="margin-bottom: 8px;">You'll receive an email once your profile is approved</li>
                      <li>Once approved, students can find and book lessons with you</li>
                    </ul>
                  </div>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    In the meantime, you can log in to your dashboard to check your verification status.
                  </p>

                  <a href="https://tutagora.com" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Go to Dashboard</a>

                  <div style="${footerStyles}">
                    <p style="margin: 0 0 8px 0;">Questions? Reply to this email anytime.</p>
                    <p style="margin: 0;">Tutagora Team</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      };
    }

    case "tutor-approved": {
      const { name } = data;
      return {
        subject: "You're Approved! Start Teaching on Tutagora",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 8px; padding: 32px; ${baseStyles}">
                  ${logoBox}

                  <h1 style="margin: 0 0 16px 0; font-size: 28px; color: #0f172a;">Congratulations, You're Approved!</h1>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Hi ${name},
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Great news! Your tutor profile has been verified and approved. Your profile is now live and students can find and book lessons with you.
                  </p>

                  <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #065f46; font-weight: 600;">Next steps to get started:</p>
                    <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #064e3b;">
                      <li style="margin-bottom: 8px;">Set your availability so students can book time slots</li>
                      <li style="margin-bottom: 8px;">Share your profile link to attract students</li>
                      <li>Respond promptly to booking requests</li>
                    </ul>
                  </div>

                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                    <strong>Reminder:</strong> Tutagora takes a 15% platform fee on each lesson. Payouts are processed weekly every Friday via M-Pesa.
                  </p>

                  <a href="https://tutagora.com" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; margin-top: 16px;">Go to Your Dashboard</a>

                  <div style="${footerStyles}">
                    <p style="margin: 0 0 8px 0;">Welcome aboard! Let's help students learn.</p>
                    <p style="margin: 0;">Tutagora Team</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      };
    }

    case "tutor-rejected": {
      const { name, reason } = data;
      return {
        subject: "Update Needed on Your Tutagora Profile",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 8px; padding: 32px; ${baseStyles}">
                  ${logoBox}

                  <h1 style="margin: 0 0 16px 0; font-size: 28px; color: #0f172a;">Profile Update Required</h1>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Hi ${name},
                  </p>

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Thank you for your interest in teaching on Tutagora. After reviewing your profile, we need a few updates before we can approve it.
                  </p>

                  ${reason ? `<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #991b1b; font-weight: 600;">Reason:</p>
                    <p style="margin: 8px 0 0 0; color: #7f1d1d;">${reason}</p>
                  </div>` : ""}

                  <p style="margin: 0 0 24px 0; font-size: 16px;">
                    Please log in to your dashboard, update the required information, and resubmit your documents. We'll review your updated profile as soon as possible.
                  </p>

                  <a href="https://tutagora.com" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Update Your Profile</a>

                  <div style="${footerStyles}">
                    <p style="margin: 0 0 8px 0;">Need help? Reply to this email.</p>
                    <p style="margin: 0;">Tutagora Team</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      };
    }

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

// Main request handler
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
