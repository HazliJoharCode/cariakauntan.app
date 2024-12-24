-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own ratings" ON ratings;

-- Create new simplified policy for creating ratings
CREATE POLICY "Users can create ratings"
  ON ratings FOR INSERT
  WITH CHECK (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    -- User can only rate as themselves
    AND auth.uid() = user_id
    -- Can only rate verified service providers
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = provider_id
      AND profiles.user_type = 'service_provider'
      AND profiles.verification_status = 'verified'
    )
    -- Cannot rate themselves
    AND auth.uid() != provider_id
  );