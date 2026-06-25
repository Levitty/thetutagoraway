-- Let the admin open tutor verification documents (private tutor-documents
-- bucket). The original KYC setup left this policy commented out, so the
-- admin's "View National ID / Certificate" buttons couldn't generate a signed
-- URL. SELECT on storage.objects (scoped to the bucket) is what createSignedUrl
-- needs. Only the admin is granted; tutors still can't read each other's files.
drop policy if exists "Admin reads tutor documents" on storage.objects;
create policy "Admin reads tutor documents" on storage.objects
  for select using ( bucket_id = 'tutor-documents' and public.is_admin() );
