-- Add moderator privileges to specific user
UPDATE profiles
SET is_moderator = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'hazli.johar@cynco.io'
);