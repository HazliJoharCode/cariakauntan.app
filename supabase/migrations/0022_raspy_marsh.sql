-- Drop all existing rating policies
DROP POLICY IF EXISTS "anyone_can_read_ratings" ON ratings;
DROP POLICY IF EXISTS "authenticated_users_can_insert_ratings" ON ratings;
DROP POLICY IF EXISTS "users_can_update_own_ratings" ON ratings;
DROP POLICY IF EXISTS "users_can_delete_own_ratings" ON ratings;

-- Create a single, simple read policy
CREATE POLICY "ratings_read_policy"
  ON ratings FOR SELECT
  USING (true);

-- Create a single, simple write policy for authenticated users
CREATE POLICY "ratings_write_policy"
  ON ratings 
  FOR INSERT
  WITH CHECK (
    -- Basic authenticated user check
    auth.uid() IS NOT NULL
    -- User can only rate as themselves
    AND auth.uid() = user_id
    -- Cannot rate themselves
    AND auth.uid() != provider_id
  );

-- Create update policy
CREATE POLICY "ratings_update_policy"
  ON ratings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create delete policy
CREATE POLICY "ratings_delete_policy"
  ON ratings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add provider verification check via trigger instead of policy
CREATE OR REPLACE FUNCTION check_provider_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if provider exists and is verified
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = NEW.provider_id
    AND user_type = 'service_provider'
    AND verification_status = 'verified'
  ) THEN
    RAISE EXCEPTION 'Provider must be verified to receive ratings';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS verify_provider_rating ON ratings;

-- Create trigger
CREATE TRIGGER verify_provider_rating
  BEFORE INSERT OR UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION check_provider_verification();