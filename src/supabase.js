import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dlqbiayaqjucxsvbesms.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscWJpYXlhcWp1Y3hzdmJlc21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzAwODQsImV4cCI6MjA4NzY0NjA4NH0.Gt35lWc5--fYiJbnX7VJafSDb9jNWwM5Ml93UhvaRqA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
