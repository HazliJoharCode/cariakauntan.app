-- Add moderator privileges to specific user
UPDATE profiles
SET is_moderator = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'hazli.johar@cynco.io'
);

-- Ensure user has necessary permissions
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"is_moderator": true}'::jsonb
WHERE email = 'hazli.johar@cynco.io';