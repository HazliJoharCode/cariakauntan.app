-- Drop existing policies
DROP POLICY IF EXISTS "public_read_ratings" ON ratings;
DROP POLICY IF EXISTS "authenticated_write_ratings" ON ratings;

-- Create separate, clear policies for each operation
CREATE POLICY "anyone_can_read_ratings"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "authenticated_users_can_insert_ratings"
  ON ratings FOR INSERT
  WITH CHECK (
    -- Must be authenticated
    auth.uid() IS NOT NULL
    -- Can only create ratings as themselves
    AND auth.uid() = user_id
    -- Must be rating a verified service provider
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = provider_id
      AND p.user_type = 'service_provider'
      AND p.verification_status = 'verified'
      -- Cannot rate themselves
      AND p.id != auth.uid()
    )
  );

CREATE POLICY "users_can_update_own_ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Can only update own ratings
    auth.uid() = user_id
    -- Provider must still be verified
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = provider_id
      AND p.user_type = 'service_provider'
      AND p.verification_status = 'verified'
    )
  );

CREATE POLICY "users_can_delete_own_ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);