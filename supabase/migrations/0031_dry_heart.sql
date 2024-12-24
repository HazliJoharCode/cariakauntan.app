-- Add moderator role to profiles
ALTER TABLE profiles 
ADD COLUMN is_moderator boolean DEFAULT false,
ADD COLUMN is_banned boolean DEFAULT false,
ADD COLUMN is_suspended boolean DEFAULT false,
ADD COLUMN suspension_end_at timestamptz,
ADD COLUMN reputation_score integer DEFAULT 0,
ADD COLUMN activity_score integer DEFAULT 0,
ADD COLUMN last_reputation_update timestamptz;

-- Create activity logs table
CREATE TABLE user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  content_type text NOT NULL,
  content_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create moderation rules table
CREATE TABLE moderation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  rule_type text NOT NULL,
  conditions jsonb NOT NULL,
  actions jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create moderation actions log
CREATE TABLE moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES moderation_rules(id) ON DELETE SET NULL,
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  action_taken text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Moderators can view all activity logs"
  ON user_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_moderator = true
    )
  );

CREATE POLICY "Users can view own activity logs"
  ON user_activity_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Only moderators can manage moderation rules"
  ON moderation_rules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_moderator = true
    )
  );

CREATE POLICY "Moderators can view moderation actions"
  ON moderation_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_moderator = true
    )
  );

-- Create indexes
CREATE INDEX user_activity_logs_user_id_idx ON user_activity_logs(user_id);
CREATE INDEX user_activity_logs_action_type_idx ON user_activity_logs(action_type);
CREATE INDEX moderation_actions_content_id_idx ON moderation_actions(content_id);
CREATE INDEX moderation_actions_rule_id_idx ON moderation_actions(rule_id);

-- Insert default moderation rules
INSERT INTO moderation_rules (name, description, rule_type, conditions, actions) VALUES
(
  'Spam Detection',
  'Detects and flags potential spam content',
  'content',
  '{
    "patterns": [
      "\\b(buy|sell|discount)\\b.*\\b(now|today|limited)\\b",
      "\\b(click|visit|check)\\b.*\\b(here|now|www)\\b",
      "\\b(free|cheap|guarantee)\\b.*\\b(shipping|delivery|worldwide)\\b"
    ],
    "min_matches": 2
  }',
  '{
    "flag": true,
    "notify_moderators": true,
    "auto_hide": true
  }'
),
(
  'Toxic Language',
  'Detects and moderates toxic or offensive content',
  'content',
  '{
    "toxic_words": [
      "offensive",
      "inappropriate",
      "harmful"
    ],
    "severity_threshold": 0.8
  }',
  '{
    "flag": true,
    "notify_moderators": true,
    "warn_user": true
  }'
),
(
  'Rapid Posting',
  'Prevents spam by limiting post frequency',
  'behavior',
  '{
    "time_window": 300,
    "max_posts": 5
  }',
  '{
    "block_action": true,
    "notify_user": true
  }'
);

-- Create function to update reputation scores
CREATE OR REPLACE FUNCTION update_user_reputation()
RETURNS TRIGGER AS $$
BEGIN
  -- Update reputation based on various factors
  WITH user_stats AS (
    SELECT
      p.id,
      COUNT(DISTINCT fp.id) as post_count,
      COUNT(DISTINCT fc.id) as comment_count,
      COALESCE(SUM(CASE WHEN fv.vote_type = 'up' THEN 1 ELSE -1 END), 0) as vote_score
    FROM profiles p
    LEFT JOIN forum_posts fp ON p.id = fp.author_id
    LEFT JOIN forum_comments fc ON p.id = fc.author_id
    LEFT JOIN forum_votes fv ON fp.id = fv.post_id
    WHERE p.id = NEW.author_id
    GROUP BY p.id
  )
  UPDATE profiles
  SET 
    reputation_score = (
      (SELECT post_count * 10 + comment_count * 5 + vote_score * 2 FROM user_stats)
    ),
    activity_score = (
      (SELECT post_count + comment_count FROM user_stats)
    ),
    last_reputation_update = now()
  WHERE id = NEW.author_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for reputation updates
CREATE TRIGGER update_reputation_on_post
  AFTER INSERT OR DELETE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_reputation();

CREATE TRIGGER update_reputation_on_comment
  AFTER INSERT OR DELETE ON forum_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_user_reputation();

CREATE TRIGGER update_reputation_on_vote
  AFTER INSERT OR DELETE ON forum_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_user_reputation();