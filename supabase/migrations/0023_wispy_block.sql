-- Drop all existing policies and triggers
DROP POLICY IF EXISTS "ratings_read_policy" ON ratings;
DROP POLICY IF EXISTS "ratings_write_policy" ON ratings;
DROP POLICY IF EXISTS "ratings_update_policy" ON ratings;
DROP POLICY IF EXISTS "ratings_delete_policy" ON ratings;
DROP TRIGGER IF EXISTS verify_provider_rating ON ratings;
DROP FUNCTION IF EXISTS check_provider_verification();

-- Create simple policies
CREATE POLICY "ratings_read"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "ratings_write"
  ON ratings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a comprehensive verification trigger
CREATE OR REPLACE FUNCTION verify_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user is trying to rate themselves
  IF NEW.user_id = NEW.provider_id THEN
    RAISE EXCEPTION 'Users cannot rate themselves';
  END IF;

  -- Check if provider exists and is verified
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = NEW.provider_id
    AND user_type = 'service_provider'
    AND verification_status = 'verified'
  ) THEN
    RAISE EXCEPTION 'Provider must be verified to receive ratings';
  END IF;

  -- Check rating value
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verify_rating_trigger
  BEFORE INSERT OR UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION verify_rating();