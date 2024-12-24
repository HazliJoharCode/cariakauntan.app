/*
  # Add Vacancy Listings

  1. New Tables
    - `vacancies`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `contact_info` (text)
      - `external_url` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `is_active` (boolean)

  2. Security
    - Enable RLS
    - Add policies for read/write access
*/

-- Create vacancies table
CREATE TABLE vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  contact_info text NOT NULL,
  external_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  
  CONSTRAINT valid_dates CHECK (expires_at > created_at)
);

-- Enable RLS
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active vacancies"
  ON vacancies FOR SELECT
  USING (is_active = true AND expires_at > now());

CREATE POLICY "Verified providers can manage own vacancies"
  ON vacancies
  FOR ALL
  USING (
    auth.uid() = provider_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'service_provider'
      AND verification_status = 'verified'
    )
  );

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_vacancy_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp update
CREATE TRIGGER update_vacancy_timestamp
  BEFORE UPDATE ON vacancies
  FOR EACH ROW
  EXECUTE FUNCTION update_vacancy_timestamp();