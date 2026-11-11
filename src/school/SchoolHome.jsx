// The learner home inside the family app (11 Nov 2026): a child the parent linked to their school sees all
// their school homework, beside their own plan. The same drawing as the page with no account
// (/hw/?l=..., learnerHomeView.js), from the same edge function (school-homework, action learner_home),
// with the parent's sign-in in place of the code. Nothing shows for a child who is not linked.
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase.js';
import { homeHtml, HOME_CSS } from './learnerHomeView.js';

// The homework page is HOREB's site; inside the phone app (not http) it is opened on tutagora.com.
const hwBase = () => (typeof window !== 'undefined' && /^https?:$/.test(window.location.protocol) ? window.location.origin : 'https://tutagora.com');

export function SchoolHome({ childId, tick = 0 }) {
  const [home, setHome] = useState(null);
  useEffect(() => {
    let live = true;
    setHome(null);
    if (!childId) return undefined;
    // Only a linked child asks the function: the parent can read their own children's links.
    supabase.from('school_learner_links').select('id').eq('child_id', childId).limit(1)
      .then(({ data, error }) => {
        if (error || !data?.length) return null;
        return supabase.functions.invoke('school-homework', { body: { action: 'learner_home', child: childId } });
      })
      .then((r) => { if (live && r?.data?.success && r.data.linked) setHome(r.data.home); })
      .then(undefined, () => {});
    return () => { live = false; };
  }, [childId, tick]);
  if (!home) return null;
  return (
    <div className="bg-[#F4F2EC] rounded-3xl p-4">
      <style>{HOME_CSS}</style>
      <div dangerouslySetInnerHTML={{ __html: homeHtml(home, { hwBase: hwBase(), inApp: true }) }} />
    </div>
  );
}
