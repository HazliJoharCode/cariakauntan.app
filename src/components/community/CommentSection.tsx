import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CommentList from './CommentList';
import { useComments } from '@/hooks/useComments';

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
}

export default function CommentSection({ postId, isOpen }: CommentSectionProps) {
  const { user, openAuthDialog } = useAuth();
  const { comments, addComment, loading } = useComments(postId);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    const success = await addComment(newComment);
    if (success) {
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none h-20"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {newComment.length}/500 characters
            </span>
            <Button 
              type="submit" 
              size="sm"
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      ) : (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => openAuthDialog('sign-in')}
        >
          Sign in to comment
        </Button>
      )}

      <CommentList comments={comments} loading={loading} />
    </div>
  );
}