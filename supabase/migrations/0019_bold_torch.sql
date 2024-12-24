-- Drop all existing rating policies
DROP POLICY IF EXISTS "ratings_read" ON ratings;
DROP POLICY IF EXISTS "ratings_insert" ON ratings;
DROP POLICY IF EXISTS "ratings_update" ON ratings;
DROP POLICY IF EXISTS "ratings_delete" ON ratings;

-- Create simplified policies with proper checks
CREATE POLICY "anyone_can_read_ratings"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "authenticated_users_can_rate"
  ON ratings FOR INSERT
  WITH CHECK (
    -- Must be authenticated and rating as themselves
    auth.uid() = user_id
    -- Must be rating a verified service provider
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = provider_id
      AND p.user_type = 'service_provider'
      AND p.verification_status = 'verified'
    )
    -- Cannot rate themselves
    AND auth.uid() != provider_id
  );

CREATE POLICY "users_can_update_own_ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);