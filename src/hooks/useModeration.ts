import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from './use-toast';

export function useModeration() {
  const [loading, setLoading] = useState(false);

  const togglePin = async (postId: string) => {
    try {
      setLoading(true);
      const { data: post } = await supabase
        .from('forum_posts')
        .select('is_pinned')
        .eq('id', postId)
        .single();

      const { error } = await supabase
        .from('forum_posts')
        .update({ is_pinned: !post?.is_pinned })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: post?.is_pinned ? 'Post unpinned' : 'Post pinned'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (postId: string) => {
    try {
      setLoading(true);
      const { data: post } = await supabase
        .from('forum_posts')
        .select('is_locked')
        .eq('id', postId)
        .single();

      const { error } = await supabase
        .from('forum_posts')
        .update({ is_locked: !post?.is_locked })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: post?.is_locked ? 'Post unlocked' : 'Post locked'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string, reason: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Log moderation action
      await supabase.from('moderation_logs').insert({
        action_type: 'delete_post',
        target_type: 'post',
        target_id: postId,
        reason
      });

      toast({
        title: 'Success',
        description: 'Post deleted successfully'
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hideComment = async (commentId: string, reason: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('forum_comments')
        .update({
          is_hidden: true,
          moderation_reason: reason
        })
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Comment hidden successfully'
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to hide comment',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    togglePin,
    toggleLock,
    deletePost,
    hideComment
  };
}