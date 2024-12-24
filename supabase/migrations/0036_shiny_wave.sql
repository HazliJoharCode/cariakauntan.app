-- Add email column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Update profiles with emails from auth.users
UPDATE profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id
AND profiles.email IS NULL;

-- Add moderator column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_moderator boolean DEFAULT false;

-- Create function to safely update moderator status
CREATE OR REPLACE FUNCTION set_moderator_status(target_email text)
RETURNS void AS $$
BEGIN
  -- Update profiles table
  UPDATE profiles
  SET 
    is_moderator = true,
    updated_at = now()
  WHERE email = target_email;

  -- Update user metadata in auth.users
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{is_moderator}',
    'true'::jsonb
  )
  WHERE email = target_email;
END;
$$ LANGUAGE plpgsql;

-- Set moderator status for specific user
SELECT set_moderator_status('work@hazlijohar.com');

-- Drop the function after use
DROP FUNCTION set_moderator_status;