/*
  # Fix infinite recursion in admin policies

  1. Changes
    - Remove recursive admin policy
    - Add proper admin access control
    - Fix profile policies
*/

-- Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update verification status" ON profiles;

-- Create new admin policies using a more efficient approach
CREATE POLICY "Admin access" ON profiles
FOR ALL USING (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users
    WHERE id IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  )
);

-- Update the public profiles policy to be more specific
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (verification_status = 'verified' OR auth.uid() = id);