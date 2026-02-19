-- Create waitlist table in Supabase
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Grant permissions to anon and authenticated roles
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for waitlist signups)
CREATE POLICY "Allow public inserts"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to read
CREATE POLICY "Allow authenticated reads"
ON public.waitlist
FOR SELECT
TO authenticated
USING (true);
