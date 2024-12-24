-- Add tags support
CREATE TABLE forum_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE forum_post_tags (
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES forum_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Add user badges
CREATE TABLE user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL,
  criteria jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_earned_badges (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES user_badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

-- Add notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  link text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add polls
CREATE TABLE forum_polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  closes_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE forum_poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES forum_polls(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  option_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Add pinned posts support
ALTER TABLE forum_posts 
ADD COLUMN is_pinned boolean DEFAULT false,
ADD COLUMN is_locked boolean DEFAULT false;

-- Add moderation features
CREATE TABLE forum_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  moderator_notes text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Enable RLS
ALTER TABLE forum_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earned_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read tags"
  ON forum_tags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read post tags"
  ON forum_post_tags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read badges"
  ON user_badges FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read earned badges"
  ON user_earned_badges FOR SELECT
  USING (true);

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read polls"
  ON forum_polls FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote in polls"
  ON forum_poll_votes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can report content"
  ON forum_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Create indexes
CREATE INDEX forum_post_tags_post_id_idx ON forum_post_tags(post_id);
CREATE INDEX forum_post_tags_tag_id_idx ON forum_post_tags(tag_id);
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX forum_polls_post_id_idx ON forum_polls(post_id);
CREATE INDEX forum_poll_votes_poll_id_idx ON forum_poll_votes(poll_id);
CREATE INDEX forum_poll_votes_user_id_idx ON forum_poll_votes(user_id);
CREATE INDEX forum_reports_content_id_idx ON forum_reports(content_id);

-- Insert default badges
INSERT INTO user_badges (name, description, icon, criteria) VALUES
('First Post', 'Created your first discussion', 'MessageSquare', '{"posts": 1}'),
('Top Contributor', 'Created 50 or more discussions', 'Award', '{"posts": 50}'),
('Helpful Member', 'Received 100 upvotes', 'ThumbsUp', '{"upvotes": 100}'),
('Discussion Starter', 'Started 10 discussions with 5+ replies each', 'Messages', '{"discussions": 10, "min_replies": 5}');