-- Drop existing policies and triggers
DROP POLICY IF EXISTS "ratings_read" ON ratings;
DROP POLICY IF EXISTS "ratings_write" ON ratings;
DROP TRIGGER IF EXISTS verify_rating_trigger ON ratings;
DROP FUNCTION IF EXISTS verify_rating();

-- Create simple read policy
CREATE POLICY "anyone_can_read"
  ON ratings FOR SELECT
  USING (true);

-- Create simple write policy
CREATE POLICY "authenticated_can_write"
  ON ratings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create simple verification trigger
CREATE OR REPLACE FUNCTION check_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Basic validation
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Invalid rating value';
  END IF;

  -- Self-rating check
  IF NEW.user_id = NEW.provider_id THEN
    RAISE EXCEPTION 'Cannot rate yourself';
  END IF;

  -- Provider verification check
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = NEW.provider_id
    AND verification_status = 'verified'
  ) THEN
    RAISE EXCEPTION 'Provider not verified';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_rating_trigger
  BEFORE INSERT OR UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION check_rating();