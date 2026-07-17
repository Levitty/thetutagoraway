-- ============================================================================
-- Close the free-enrolment hole: enroll_in_group_class() is callable from the
-- browser (GRANTed to authenticated) and never verified payment — so any
-- student could enrol in a PAID class by calling the RPC with p_amount = 0.
--
-- Fix: the RPC now enrols ONLY free classes. Paid classes must go through the
-- verify-payment edge function, which checks the Paystack reference + amount
-- with the service role and inserts the enrolment directly. The capacity race
-- protection (FOR UPDATE) is preserved for the free path.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enroll_in_group_class(
  p_class     UUID,
  p_reference TEXT DEFAULT NULL,
  p_amount    NUMERIC DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_max      INT;
  v_status   TEXT;
  v_price    NUMERIC;
  v_count    INT;
  v_existing UUID;
  v_id       UUID;
BEGIN
  SELECT max_students, status, price_per_student
    INTO v_max, v_status, v_price
  FROM group_classes WHERE id = p_class FOR UPDATE;

  IF v_max IS NULL THEN
    RAISE EXCEPTION 'Class not found';
  END IF;
  IF v_status <> 'open' THEN
    RAISE EXCEPTION 'This class is not open for enrolment';
  END IF;

  -- Paid classes are enrolled ONLY by the verify-payment edge function (which
  -- confirms the Paystack payment with the service role). The browser cannot
  -- self-enrol into a paid class.
  IF COALESCE(v_price, 0) > 0 THEN
    RAISE EXCEPTION 'Paid classes must be enrolled through payment verification';
  END IF;

  -- Already enrolled? Return the existing row, idempotently.
  SELECT id INTO v_existing
  FROM group_class_enrollments
  WHERE group_class_id = p_class AND student_id = auth.uid();
  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  SELECT count(*) INTO v_count
  FROM group_class_enrollments WHERE group_class_id = p_class;
  IF v_count >= v_max THEN
    RAISE EXCEPTION 'This class is full';
  END IF;

  INSERT INTO group_class_enrollments (group_class_id, student_id, payment_reference, amount_paid)
  VALUES (p_class, auth.uid(), p_reference, 0)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.enroll_in_group_class(UUID, TEXT, NUMERIC) TO authenticated;
