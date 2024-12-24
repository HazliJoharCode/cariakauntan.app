-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON ratings;
DROP POLICY IF EXISTS "Users can create their own ratings" ON ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON ratings;

-- Create new policies with improved conditions
CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (
    -- User must be authenticated and can only rate as themselves
    auth.uid() = user_id 
    -- Can only rate verified service providers
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = provider_id
      AND user_type = 'service_provider'
      AND verification_status = 'verified'
    )
    -- Cannot rate themselves
    AND auth.uid() != provider_id
  );

CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = provider_id
      AND user_type = 'service_provider'
      AND verification_status = 'verified'
    )
  );

CREATE POLICY "Users can delete their own ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'ratings' 
    AND indexname = 'ratings_provider_id_idx'
  ) THEN
    CREATE INDEX ratings_provider_id_idx ON ratings(provider_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'ratings' 
    AND indexname = 'ratings_user_id_idx'
  ) THEN
    CREATE INDEX ratings_user_id_idx ON ratings(user_id);
  END IF;
END $$;