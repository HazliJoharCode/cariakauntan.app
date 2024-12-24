-- Add moderator column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_moderator boolean DEFAULT false;

-- Add moderator privileges to specific user by ID
UPDATE profiles
SET is_moderator = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'hazli.johar@cynco.io'
);

-- Update app metadata for moderator
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{is_moderator}',
  'true'
)
WHERE email = 'hazli.johar@cynco.io';