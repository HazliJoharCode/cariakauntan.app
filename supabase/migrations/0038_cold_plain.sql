-- Add moderator-specific columns if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_moderator boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS moderation_notes text;

-- Create moderator access policy
CREATE POLICY "moderator_access"
  ON profiles
  FOR ALL
  USING (
    is_moderator = true 
    AND id = auth.uid()
  );

-- Create function to check if user is moderator
CREATE OR REPLACE FUNCTION is_moderator(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND is_moderator = true
  );
END;
$$ LANGUAGE plpgsql;