import { useState } from 'react';
import { Shield, Flag, Pin, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useModeration } from '@/hooks/useModeration';
import { toast } from '@/hooks/use-toast';

interface ModeratorToolsProps {
  postId: string;
  isPinned: boolean;
  isLocked: boolean;
}

export default function ModeratorTools({ postId, isPinned, isLocked }: ModeratorToolsProps) {
  const { togglePin, toggleLock, deletePost } = useModeration();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for deletion',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const success = await deletePost(postId, deleteReason);
    setIsSubmitting(false);
    
    if (success) {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => togglePin(postId)}
        className="flex items-center gap-1"
      >
        <Pin className={`h-4 w-4 ${isPinned ? 'fill-primary' : ''}`} />
        {isPinned ? 'Unpin' : 'Pin'}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => toggleLock(postId)}
        className="flex items-center gap-1"
      >
        <Lock className={`h-4 w-4 ${isLocked ? 'fill-primary' : ''}`} />
        {isLocked ? 'Unlock' : 'Lock'}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        className="flex items-center gap-1 text-destructive"
      >
        <Shield className="h-4 w-4" />
        Delete
      </Button>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Please provide a reason for deletion..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete Post'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}