-- Add is_bot column to site_visits table
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT FALSE;

-- Create login_attempts table for security logging
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT NOT NULL,
  username_attempted TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  user_agent TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);

-- Create index for filtering bots in site_visits
CREATE INDEX IF NOT EXISTS idx_site_visits_is_bot ON site_visits(is_bot);

-- Enable RLS
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert/read login attempts
CREATE POLICY "Service role can manage login_attempts" ON login_attempts
  FOR ALL USING (true) WITH CHECK (true);

