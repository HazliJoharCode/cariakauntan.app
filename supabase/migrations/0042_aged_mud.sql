-- Create merger listings table
CREATE TABLE merger_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  revenue_range text NOT NULL,
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('Full Practice Sale', 'Partial Sale', 'Partnership Opportunity', 'Seeking Practice')),
  confidential boolean DEFAULT true,
  status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'closed')),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  contact_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE merger_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active listings"
  ON merger_listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can manage own listings"
  ON merger_listings
  FOR ALL
  USING (auth.uid() = owner_id);

-- Create indexes
CREATE INDEX merger_listings_status_idx ON merger_listings(status);
CREATE INDEX merger_listings_owner_id_idx ON merger_listings(owner_id);