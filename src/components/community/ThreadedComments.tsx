import { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CommentReply from './CommentReply';
import { useAuth } from '@/hooks/useAuth';
import { useCommentVotes } from '@/hooks/useCommentVotes';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  reply_count: number;
  author: {
    full_name: string;
  } | null;
  replies?: Comment[];
}

interface ThreadedCommentsProps {
  comments: Comment[];
  onReply: (content: string, parentId: string) => Promise<boolean>;
}

export default function ThreadedComments({ comments, onReply }: ThreadedCommentsProps) {
  const { user, openAuthDialog } = useAuth();
  const { pendingVotes, vote } = useCommentVotes();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  const toggleThread = (commentId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (expandedThreads.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedThreads(newExpanded);
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const isExpanded = expandedThreads.has(comment.id);
    const hasReplies = comment.reply_count > 0;
    const isThreaded = depth > 0;

    return (
      <div key={comment.id} className={cn("space-y-2", isThreaded && "ml-6 pt-2")}>
        <Card>
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
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => user ? setReplyingTo(comment.id) : openAuthDialog('sign-in')}
              >
                Reply
              </Button>
              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => toggleThread(comment.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {replyingTo === comment.id && (
          <div className="ml-6">
            <CommentReply
              parentId={comment.id}
              onSubmit={onReply}
              onCancel={() => setReplyingTo(null)}
            />
          </div>
        )}

        {hasReplies && isExpanded && comment.replies?.map(reply => renderComment(reply, depth + 1))}
      </div>
    );
  };

  // Organize comments into threads
  const threads = comments.filter(c => !c.parent_id);
  const replies = comments.filter(c => c.parent_id);
  
  // Add replies to their parent comments
  threads.forEach(thread => {
    thread.replies = replies.filter(reply => reply.parent_id === thread.id);
  });

  return (
    <div className="space-y-4">
      {threads.map(comment => renderComment(comment))}
    </div>
  );
}