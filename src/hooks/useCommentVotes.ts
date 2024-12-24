import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export function useCommentVotes() {
  const [pendingVotes, setPendingVotes] = useState<Record<string, 'up' | 'down'>>({});

  const vote = async (commentId: string, voteType: 'up' | 'down', userId: string) => {
    // Optimistically update UI
    setPendingVotes(prev => ({ ...prev, [commentId]: voteType }));

    try {
      // Delete existing vote if any
      await supabase
        .from('comment_votes')
        .delete()
        .match({ comment_id: commentId, user_id: userId });

      // Insert new vote
      const { error } = await supabase
        .from('comment_votes')
        .insert({
          comment_id: commentId,
          user_id: userId,
          vote_type: voteType
        });

      if (error) throw error;
    } catch (error) {
      // Revert optimistic update on error
      setPendingVotes(prev => {
        const updated = { ...prev };
        delete updated[commentId];
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