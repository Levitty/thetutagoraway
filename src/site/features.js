// Switches for features that depend on something outside this repo.

// 30-minute lessons need the updated verify-payment edge function deployed in
// Supabase (it checks the half-price amount). Until then the old function
// treats a 30-minute payment as underpaid and the booking never confirms, so
// the tutor switch, the booking option and all 30-minute wording stay hidden.
// Flip to true once verify-payment is redeployed.
export const HALF_HOUR_LESSONS = false;
