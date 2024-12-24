/*
  # Add rating system tables
  
  1. New Tables
    - `ratings`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, references profiles)
      - `user_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `review` (text)
      - `created_at` (timestamp)
    
  2. Security
    - Enable RLS on ratings table
    - Add policies for authenticated users
*/

CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(provider_id, user_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

-- Allow authenticated users to create ratings
CREATE POLICY "Users can create their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = provider_id
      AND user_type = 'service_provider'
    )
  );

-- Allow users to update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own ratings
CREATE POLICY "Users can delete their own ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);