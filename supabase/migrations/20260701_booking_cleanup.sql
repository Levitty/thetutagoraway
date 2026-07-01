-- ============================================================================
-- Abandoned-booking cleanup — let a student remove their OWN still-unpaid
-- (pending) booking, so bailing out of the payment step doesn't leave a
-- phantom "pending" lesson behind that looks booked.
--
-- Safe by construction: the policy only permits deleting a row that belongs to
-- the student AND is still 'pending'. A booking that has been paid/confirmed
-- (status = 'confirmed') can never be removed through this path, and the
-- verify-payment edge function (service role) remains the only way a booking
-- becomes confirmed — so this does NOT open any payment bypass.
-- ============================================================================

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students delete own pending bookings" ON bookings;
CREATE POLICY "Students delete own pending bookings"
  ON bookings FOR DELETE
  USING (student_id = auth.uid() AND status = 'pending');
