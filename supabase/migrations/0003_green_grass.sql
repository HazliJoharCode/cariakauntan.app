/*
  # Add Admin Functionality

  1. New Columns
    - Add `is_admin` to profiles table for admin role management
  
  2. Security
    - Add RLS policies for admin access to profiles and verification documents
*/

-- Add admin column to profiles
ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;

-- Admin RLS Policies
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

CREATE POLICY "Admins can update verification status"
  ON profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

CREATE POLICY "Admins can view all documents"
  ON verification_documents
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

CREATE POLICY "Admins can update documents"
  ON verification_documents
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );