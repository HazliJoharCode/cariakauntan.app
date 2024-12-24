-- Add parent_id to forum_comments for threaded replies
ALTER TABLE forum_comments 
ADD COLUMN parent_id uuid REFERENCES forum_comments(id) ON DELETE CASCADE,
ADD COLUMN reply_count integer DEFAULT 0;

-- Create function to update reply counts
CREATE OR REPLACE FUNCTION update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE forum_comments
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE forum_comments
    SET reply_count = reply_count - 1
    WHERE id = OLD.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reply count
CREATE TRIGGER update_comment_reply_count
  AFTER INSERT OR DELETE ON forum_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_reply_count();

-- Add indexes
CREATE INDEX forum_comments_parent_id_idx ON forum_comments(parent_id);