/*
  # Registration System Schema

  1. New Tables
    - `service_provider_details`
      - Stores additional details for service providers
      - Links to profiles table via foreign key
    - `verification_requests`
      - Tracks verification status of service providers
      - Stores uploaded document references

  2. Changes
    - Add new columns to profiles table
    - Add verification status tracking

  3. Security
    - RLS policies for secure access
    - File storage policies
*/

-- Add new columns to profiles
ALTER TABLE profiles 
ADD COLUMN user_type text NOT NULL DEFAULT 'end_user',
ADD COLUMN company_registration_number text,
ADD COLUMN business_address text,
ADD COLUMN industry text,
ADD COLUMN years_experience integer,
ADD COLUMN description text,
ADD COLUMN business_type text,
ADD COLUMN verification_status text DEFAULT 'pending',
ADD CONSTRAINT valid_user_type CHECK (user_type IN ('service_provider', 'end_user'));

-- Create table for verification documents
CREATE TABLE verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  status text DEFAULT 'pending',
  admin_notes text
);

-- Enable RLS
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verification_documents
CREATE POLICY "Users can view own documents"
  ON verification_documents
  FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can upload own documents"
  ON verification_documents
  FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Storage bucket for certificates
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', false);

-- Storage policies
CREATE POLICY "Users can upload own certificates"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'certificates' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read own certificates"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'certificates' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );