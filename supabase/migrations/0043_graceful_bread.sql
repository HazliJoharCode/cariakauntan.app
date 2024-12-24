-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active listings" ON merger_listings;
DROP POLICY IF EXISTS "Users can manage own listings" ON merger_listings;

-- Create better policies
CREATE POLICY "public_read_listings"
  ON merger_listings FOR SELECT
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = merger_listings.owner_id
      AND profiles.verification_status = 'verified'
    )
  );

CREATE POLICY "owners_manage_listings"
  ON merger_listings
  FOR ALL
  USING (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'service_provider'
      AND profiles.verification_status = 'verified'
    )
  );

-- Add owner_id to new listings automatically
CREATE OR REPLACE FUNCTION set_merger_listing_owner()
RETURNS TRIGGER AS $$
BEGIN
  NEW.owner_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_merger_listing_owner_trigger
  BEFORE INSERT ON merger_listings
  FOR EACH ROW
  EXECUTE FUNCTION set_merger_listing_owner();

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_merger_listing_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_merger_listing_timestamp
  BEFORE UPDATE ON merger_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_merger_listing_timestamp();