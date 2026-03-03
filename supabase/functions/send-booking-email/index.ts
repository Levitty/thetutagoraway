// Supabase Edge Function: send-booking-email
// This function sends email notifications when a booking is made

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      tutorEmail,
      tutorName,
      studentEmail,
      studentName,
      subject,
      lessonDate,
      lessonTime,
      bookingId,
    } = await req.json();

    // Email to Tutor
    if (tutorEmail && RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Tutagora <notifications@tutagora.com>",
          to: tutorEmail,
          subject: `📅 New Booking: ${subject} lesson with ${studentName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Lesson Booked!</h1>
              </div>
              <div style="padding: 30px; background: #f8fafc;">
                <p style="font-size: 18px;">Hi ${tutorName.split(' ')[0]},</p>
                <p>Great news! <strong>${studentName}</strong> has booked a lesson with you.</p>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <h3 style="margin-top: 0; color: #10b981;">Lesson Details</h3>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Date:</strong> ${lessonDate}</p>
                  <p><strong>Time:</strong> ${lessonTime}</p>
                  <p><strong>Student:</strong> ${studentName}</p>
                </div>
                
                <p>Log in to your dashboard to view more details and join the lesson when it's time.</p>
                
                <a href="https://thetutagoraway.vercel.app" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 10px;">
                  Go to Dashboard
                </a>
              </div>
              <div style="padding: 20px; text-align: center; color: #64748b; font-size: 14px;">
                <p>Tutagora - Kenya's Leading Online Tutoring Platform</p>
              </div>
            </div>
          `,
        }),
      });
    }

    // Email to Student
    if (studentEmail && RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Tutagora <notifications@tutagora.com>",
          to: studentEmail,
          subject: `✅ Booking Confirmed: ${subject} with ${tutorName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
              </div>
              <div style="padding: 30px; background: #f8fafc;">
                <p style="font-size: 18px;">Hi ${studentName.split(' ')[0]},</p>
                <p>Your lesson has been successfully booked!</p>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
                  <h3 style="margin-top: 0; color: #10b981;">Lesson Details</h3>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Date:</strong> ${lessonDate}</p>
                  <p><strong>Time:</strong> ${lessonTime}</p>
                  <p><strong>Tutor:</strong> ${tutorName}</p>
                </div>
                
                <p>When it's time for your lesson, log in to your dashboard and click "Join Lesson" to start your video session.</p>
                
                <a href="https://thetutagoraway.vercel.app" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 10px;">
                  View My Bookings
                </a>
                
                <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
                  Need to reschedule? Contact your tutor through the messaging feature in your dashboard.
                </p>
              </div>
              <div style="padding: 20px; text-align: center; color: #64748b; font-size: 14px;">
                <p>Tutagora - Kenya's Leading Online Tutoring Platform</p>
              </div>
            </div>
          `,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
