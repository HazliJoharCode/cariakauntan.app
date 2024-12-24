/*
  # Fix Profile Policies

  1. Changes
    - Remove recursive profile policies
    - Add simplified admin and user policies
    - Fix infinite recursion issue

  2. Security
    - Maintain RLS protection
    - Ensure proper access control
*/

-- Drop all existing profile policies to start fresh
DROP POLICY IF EXISTS "admin_manage_profiles" ON profiles;
DROP POLICY IF EXISTS "users_view_own_and_verified_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_full_access" ON profiles;
DROP POLICY IF EXISTS "public_profiles_access" ON profiles;

-- Create new simplified admin policy using a direct check
CREATE POLICY "admin_access_policy"
  ON profiles
  FOR ALL
  USING (
    is_admin = true 
    AND id = auth.uid()
  );

-- Create policy for users to view verified profiles and their own profile
CREATE POLICY "user_view_policy"
  ON profiles
  FOR SELECT
  USING (
    verification_status = 'verified'
    OR id = auth.uid()
  );

-- Create policy for users to update their own profile
CREATE POLICY "user_update_policy"
  ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Create policy for users to insert their own profile
CREATE POLICY "user_insert_policy"
  ON profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());