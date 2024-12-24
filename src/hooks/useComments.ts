import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export function useComments(postId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select(`
          id,
          content,
          created_at,
          author:profiles!author_id (
            full_name
          ),
          votes:comment_votes (
            vote_type
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const processedComments = (data || []).map(comment => ({
        ...comment,
        upvotes: comment.votes?.filter(v => v.vote_type === 'up').length || 0,
        downvotes: comment.votes?.filter(v => v.vote_type === 'down').length || 0
      }));

      setComments(processedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();

    // Set up real-time subscription
    const channel = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'forum_comments',
        filter: `post_id=eq.${postId}`
      }, () => {
        loadComments();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content: content.trim()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    comments,
    loading,
    addComment
  };
}