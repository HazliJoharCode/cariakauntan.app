-- Add moderator column if it doesn't exist (idempotent)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_moderator boolean DEFAULT false;

-- Create function to safely update moderator status
CREATE OR REPLACE FUNCTION set_moderator_status(user_email text, should_be_moderator boolean)
RETURNS void AS $$
BEGIN
  -- Update profiles table
  UPDATE profiles
  SET is_moderator = should_be_moderator
  WHERE id IN (
    SELECT id FROM auth.users
    WHERE email = user_email
  );

  -- Update user metadata
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{is_moderator}',
    CASE WHEN should_be_moderator THEN 'true' ELSE 'false' END::jsonb
  )
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Set moderator status for specific user
SELECT set_moderator_status('hazli.johar@cynco.io', true);

-- Drop the function after use
DROP FUNCTION set_moderator_status;