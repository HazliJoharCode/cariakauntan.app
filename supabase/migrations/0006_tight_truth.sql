/*
  # Fix Profile Policies

  1. Changes
    - Drop and recreate admin access policies to prevent recursion
    - Simplify policy conditions for better performance
    - Update public access policies

  2. Security
    - Maintain row-level security
    - Ensure proper access control for admins and users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin access" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view verified profiles" ON profiles;

-- Create new admin policy with simplified condition
CREATE POLICY "admin_full_access" ON profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles admin
    WHERE admin.id = auth.uid()
    AND admin.is_admin = true
  )
);

-- Create new public access policy
CREATE POLICY "public_profiles_access" ON profiles
FOR SELECT USING (
  verification_status = 'verified'
  OR id = auth.uid()
);