import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from './use-toast';

export function usePoll(pollId: string) {
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_poll_votes')
        .select('option_index')
        .eq('poll_id', pollId);

      if (error) throw error;

      // Count votes for each option
      const voteCounts: Record<number, number> = {};
      data.forEach(vote => {
        voteCounts[vote.option_index] = (voteCounts[vote.option_index] || 0) + 1;
      });

      setVotes(voteCounts);
      setTotalVotes(data.length);
    } catch (error) {
      console.error('Error loading poll votes:', error);
    }
  };

  const loadUserVote = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_poll_votes')
        .select('option_index')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserVote(data?.option_index ?? null);
    } catch (error) {
      console.error('Error loading user vote:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVotes();

    // Subscribe to vote changes
    const channel = supabase
      .channel('poll_votes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'forum_poll_votes',
        filter: `poll_id=eq.${pollId}`
      }, () => {
        loadVotes();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [pollId]);

  useEffect(() => {
    const { data: { user } } = supabase.auth.getUser();
    if (user) {
      loadUserVote(user.id);
    } else {
      setLoading(false);
    }
  }, [pollId]);

  const vote = async (optionIndex: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('forum_poll_votes')
        .insert({
          poll_id: pollId,
          option_index: optionIndex
        });

      if (error) throw error;

      setUserVote(optionIndex);
      await loadVotes();
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    votes,
    totalVotes,
    userVote,
    loading,
    vote
  };
}