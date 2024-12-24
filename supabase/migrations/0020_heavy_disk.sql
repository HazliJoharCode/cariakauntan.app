-- Drop all existing rating policies
DROP POLICY IF EXISTS "anyone_can_read_ratings" ON ratings;
DROP POLICY IF EXISTS "authenticated_users_can_rate" ON ratings;
DROP POLICY IF EXISTS "users_can_update_own_ratings" ON ratings;
DROP POLICY IF EXISTS "users_can_delete_own_ratings" ON ratings;

-- Create a single, simple read policy
CREATE POLICY "public_read_ratings"
  ON ratings FOR SELECT
  USING (true);

-- Create a single, comprehensive write policy
CREATE POLICY "authenticated_write_ratings"
  ON ratings
  FOR ALL
  USING (
    -- Must be authenticated and owner of the rating
    auth.uid() = user_id
  )
  WITH CHECK (
    -- Must be authenticated and owner of the rating
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