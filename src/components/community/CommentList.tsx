import { format } from 'date-fns';
import { User, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCommentVotes } from '@/hooks/useCommentVotes';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  author: {
    full_name: string;
  } | null;
}

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
}

export default function CommentList({ comments, loading }: CommentListProps) {
  const { user, openAuthDialog } = useAuth();
  const { pendingVotes, vote } = useCommentVotes();

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-4">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  const handleVote = (commentId: string, voteType: 'up' | 'down') => {
    if (!user) {
      openAuthDialog('sign-in');
      return;
    }
    vote(commentId, voteType, user.id);
  };

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const pendingVote = pendingVotes[comment.id];

        return (
          <Card key={comment.id}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{comment.author?.full_name || 'Anonymous User'}</span>
                <span>•</span>
                <span>{format(new Date(comment.created_at), 'MMM d, yyyy')}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap mb-2">{comment.content}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant={pendingVote === 'up' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-2 flex items-center gap-1"
                  onClick={() => handleVote(comment.id, 'up')}
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span className="text-xs">{comment.upvotes || 0}</span>
                </Button>
                <Button
                  variant={pendingVote === 'down' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-2 flex items-center gap-1"
                  onClick={() => handleVote(comment.id, 'down')}
                >
                  <ThumbsDown className="h-3 w-3" />
                  <span className="text-xs">{comment.downvotes || 0}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}