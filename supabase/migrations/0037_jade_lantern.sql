-- Create function to safely setup moderator
CREATE OR REPLACE FUNCTION setup_moderator()
RETURNS void AS $$
DECLARE
  target_email text := 'work@hazlijohar.com';
BEGIN
  -- Update profiles table
  UPDATE profiles
  SET 
    is_moderator = true,
    updated_at = now()
  WHERE email = target_email;

  -- Update user metadata in auth.users
  UPDATE auth.users
  SET 
    raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{is_moderator}',
      'true'::jsonb
    ),
    raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{full_name}',
      '"System Moderator"'::jsonb
    )
  WHERE email = target_email;

  -- Ensure profile exists
  INSERT INTO profiles (
    id,
    full_name,
    email,
    is_moderator
  )
  SELECT 
    id,
    'System Moderator',
    email,
    true
  FROM auth.users
  WHERE email = target_email
  ON CONFLICT (id) DO UPDATE
  SET 
    is_moderator = true,
    full_name = 'System Moderator';
END;
$$ LANGUAGE plpgsql;

-- Run the setup
SELECT setup_moderator();

-- Drop the function
DROP FUNCTION setup_moderator;