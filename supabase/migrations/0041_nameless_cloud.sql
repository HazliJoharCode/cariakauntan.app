-- Add moderator features
CREATE TABLE moderation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id uuid REFERENCES profiles(id),
  action_type text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only moderators can access logs"
  ON moderation_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_moderator = true
    )
  );

-- Create indexes
CREATE INDEX moderation_logs_moderator_id_idx ON moderation_logs(moderator_id);
CREATE INDEX moderation_logs_target_id_idx ON moderation_logs(target_id);