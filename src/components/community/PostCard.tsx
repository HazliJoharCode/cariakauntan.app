import { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
    upvotes: number;
    downvotes: number;
    comment_count: number;
    author?: {
      full_name: string;
    } | null;
  };
  onVote: (postId: string, type: 'up' | 'down') => void;
  pendingVote?: 'up' | 'down';
}

export default function PostCard({ post, onVote, pendingVote }: PostCardProps) {
  const { user, openAuthDialog } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const authorName = post.author?.full_name || 'Anonymous User';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{authorName}</span>
              <span>•</span>
              <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <Badge variant="secondary">{post.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant={pendingVote === 'up' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => user ? onVote(post.id, 'up') : openAuthDialog('sign-in')}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm">{post.upvotes || 0}</span>
            </Button>
            <Button
              variant={pendingVote === 'down' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => user ? onVote(post.id, 'down') : openAuthDialog('sign-in')}
              className="flex items-center gap-1"
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="text-sm">{post.downvotes || 0}</span>
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{post.comment_count || 0} Comments</span>
          </Button>
        </div>

        <CommentSection postId={post.id} isOpen={showComments} />
      </CardFooter>
    </Card>
  );
}