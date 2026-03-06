-- Add KYC verification columns to tutors table
ALTER TABLE tutors ADD COLUMN IF NOT EXISTS id_document_url TEXT;
ALTER TABLE tutors ADD COLUMN IF NOT EXISTS credential_url TEXT;
ALTER TABLE tutors ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'approved', 'rejected'));
ALTER TABLE tutors ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create storage bucket for tutor documents (run in Supabase dashboard if CLI not available)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('tutor-documents', 'tutor-documents', false);

-- Allow authenticated users to upload to tutor-documents bucket
-- CREATE POLICY "Tutors can upload their own documents" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'tutor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to read their own documents
-- CREATE POLICY "Tutors can read their own documents" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (bucket_id = 'tutor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to read all documents (for verification review)
-- CREATE POLICY "Admins can read all tutor documents" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (bucket_id = 'tutor-documents');
