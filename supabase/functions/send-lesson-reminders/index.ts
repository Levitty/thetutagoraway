// send-lesson-reminders — fires "your lesson is starting soon" to both the
// student and the tutor at the scheduled time. This is the piece that was
// missing: nobody was reminded when the booked time came.
//
// Run it on a schedule (every ~5 min) with Supabase's pg_cron:
//   select cron.schedule('lesson-reminders', '*/5 * * * *', $$
//     select net.http_post(
//       url    := 'https://<project>.functions.supabase.co/send-lesson-reminders',
//       headers:= jsonb_build_object('Authorization','Bearer <service-role-key>')
//     ) $$);
//
// Delivery goes through send-push, so reminders only actually reach a phone
// once APNs is configured (Apple Developer account). Until then this runs
// harmlessly and marks bookings reminded.
//
// Deploy: supabase functions deploy send-lesson-reminders

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = new Date();
    // Reminder window: lessons starting in the next 0–15 minutes.
    const soon = new Date(now.getTime() + 15 * 60000);

    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, subject, lesson_date, start_time, student_id, tutor_id, reminded_at, status, tutors(user_id, profiles(full_name))")
      .eq("status", "confirmed")
      .is("reminded_at", null);

    let sent = 0;
    for (const b of bookings || []) {
      if (!b.lesson_date || !b.start_time) continue;
      const start = new Date(`${b.lesson_date}T${b.start_time}`);
      if (isNaN(start.getTime())) continue;
      // Only within the window (and not already long past).
      if (start < now || start > soon) continue;

      const mins = Math.max(1, Math.round((start.getTime() - now.getTime()) / 60000));
      const subject = b.subject || "lesson";
      const tutorUserId = (b as any).tutors?.user_id;
      const tutorName = (b as any).tutors?.profiles?.full_name || "your tutor";

      const push = (user_id: string, title: string, body: string) =>
        supabase.functions.invoke("send-push", { body: { user_id, title, body, route: "dashboard" } })
          .catch(() => {});

      const jobs: Promise<unknown>[] = [];
      if (b.student_id) jobs.push(push(b.student_id, `${subject} lesson in ${mins} min`, `Your lesson with ${tutorName} is about to start.`));
      if (tutorUserId) jobs.push(push(tutorUserId, `${subject} lesson in ${mins} min`, `Your student is waiting soon — get ready.`));
      await Promise.all(jobs);

      await supabase.from("bookings").update({ reminded_at: now.toISOString() }).eq("id", b.id);
      sent++;
    }

    return new Response(JSON.stringify({ reminded: sent }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
