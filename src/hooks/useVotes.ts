import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export function useVotes() {
  const [pendingVotes, setPendingVotes] = useState<Record<string, 'up' | 'down'>>({});

  const vote = async (postId: string, voteType: 'up' | 'down', userId: string) => {
    // Optimistically update UI
    setPendingVotes(prev => ({ ...prev, [postId]: voteType }));

    try {
      // First try to delete any existing vote
      await supabase
        .from('forum_votes')
        .delete()
        .match({ post_id: postId, user_id: userId });

      // Then insert the new vote
      const { error } = await supabase
        .from('forum_votes')
        .insert({
          post_id: postId,
          user_id: userId,
          vote_type: voteType
        });

      if (error) throw error;
    } catch (error) {
      // Revert optimistic update on error
      setPendingVotes(prev => {
        const updated = { ...prev };
        delete updated[postId];
        return updated;
      });
      
      toast({
        title: 'Error',
        description: 'Failed to register vote',
        variant: 'destructive',
      });
    }
  };

  return {
    pendingVotes,
    vote
  };
}