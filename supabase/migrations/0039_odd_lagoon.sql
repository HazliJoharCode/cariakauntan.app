-- Update specific user to be moderator
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{is_moderator}',
  'true'
)
WHERE email = 'work@hazlijohar.com';

-- Update profiles table for the same user
UPDATE profiles
SET is_moderator = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'work@hazlijohar.com'
);