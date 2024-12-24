-- Create forum categories table
CREATE TABLE forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Insert default categories
INSERT INTO forum_categories (name, description) VALUES
('General Discussion', 'General discussions about accounting and business'),
('Tax & Compliance', 'Discussions about tax regulations and compliance'),
('Business Strategy', 'Strategic business planning and growth'),
('Technology', 'Accounting software and technology solutions'),
('Career Development', 'Career advice and professional development'),
('Industry News', 'Latest news and updates in the accounting industry'),
('Q&A', 'Ask questions and get answers from the community');

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read categories"
  ON forum_categories FOR SELECT
  USING (true);

-- Add category_id to forum_posts
ALTER TABLE forum_posts 
ADD COLUMN category_id uuid REFERENCES forum_categories(id),
ADD COLUMN view_count integer DEFAULT 0,
ADD COLUMN last_activity_at timestamptz DEFAULT now();

-- Create index for better performance
CREATE INDEX forum_posts_category_id_idx ON forum_posts(category_id);