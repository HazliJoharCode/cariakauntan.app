-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can create ratings" ON ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON ratings;

-- Create new simplified policies with proper checks
CREATE POLICY "users_create_ratings"
  ON ratings FOR INSERT
  WITH CHECK (
    -- User must be authenticated and can only rate as themselves
    auth.uid() = user_id
    -- Can only rate verified service providers
    AND EXISTS (
      SELECT 1 FROM profiles provider
      WHERE provider.id = provider_id
      AND provider.user_type = 'service_provider'
      AND provider.verification_status = 'verified'
    )
    -- Cannot rate themselves
    AND auth.uid() != provider_id
    -- One rating per provider
    AND NOT EXISTS (
      SELECT 1 FROM ratings
      WHERE ratings.provider_id = provider_id
      AND ratings.user_id = auth.uid()
    )
  );

CREATE POLICY "users_update_own_ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Can only update own ratings
    auth.uid() = user_id
    -- Provider must still be verified
    AND EXISTS (
      SELECT 1 FROM profiles provider
      WHERE provider.id = provider_id
      AND provider.user_type = 'service_provider'
      AND provider.verification_status = 'verified'
    )
  );