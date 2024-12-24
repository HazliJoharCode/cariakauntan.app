-- Drop all existing rating policies
DROP POLICY IF EXISTS "ratings_policy" ON ratings;
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON ratings;

-- Create separate policies for different operations
CREATE POLICY "ratings_read"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "ratings_insert"
  ON ratings FOR INSERT
  WITH CHECK (
    -- Must be authenticated
    auth.uid() IS NOT NULL
    -- Can only rate as themselves
    AND auth.uid() = user_id
    -- Provider must exist and be verified
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = provider_id
      AND user_type = 'service_provider'
      AND verification_status = 'verified'
    )
    -- Cannot rate themselves
    AND auth.uid() != provider_id
  );

CREATE POLICY "ratings_update"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Can only update own ratings
    auth.uid() = user_id
    -- Provider must still be verified
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = provider_id
      AND user_type = 'service_provider'
      AND verification_status = 'verified'
    )
  );

CREATE POLICY "ratings_delete"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);