-- Create comment votes table
CREATE TABLE comment_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read comment votes"
  ON comment_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote on comments"
  ON comment_votes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX comment_votes_comment_id_idx ON comment_votes(comment_id);
CREATE INDEX comment_votes_user_id_idx ON comment_votes(user_id);