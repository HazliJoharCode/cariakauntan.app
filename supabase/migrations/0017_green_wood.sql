-- Drop existing problematic policies
DROP POLICY IF EXISTS "users_create_ratings" ON ratings;
DROP POLICY IF EXISTS "users_update_own_ratings" ON ratings;

-- Create new simplified policy for ratings
CREATE POLICY "ratings_policy"
  ON ratings
  AS PERMISSIVE
  FOR ALL
  USING (
    CASE
      -- Anyone can read ratings
      WHEN current_setting('role') = 'authenticated' AND 
           current_setting('request.method') = 'GET' THEN true
      
      -- Users can only create/update ratings for verified providers
      WHEN current_setting('role') = 'authenticated' AND
           auth.uid() = user_id AND
           EXISTS (
             SELECT 1 FROM profiles
             WHERE id = provider_id
             AND user_type = 'service_provider'
             AND verification_status = 'verified'
           ) AND
           auth.uid() != provider_id THEN true
      
      ELSE false
    END
  );