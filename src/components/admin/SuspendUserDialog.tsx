import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useModeration } from '@/hooks/useModeration';

interface SuspendUserDialogProps {
  user: {
    id: string;
    full_name: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const SUSPENSION_DURATIONS = [
  { value: '1', label: '1 day' },
  { value: '3', label: '3 days' },
  { value: '7', label: '1 week' },
  { value: '14', label: '2 weeks' },
  { value: '30', label: '1 month' },
];

export default function SuspendUserDialog({ user, isOpen, onClose }: SuspendUserDialogProps) {
  const { suspendUser } = useModeration();
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration || !reason.trim()) return;

    setIsSubmitting(true);
    const success = await suspendUser(user.id, parseInt(duration), reason);
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend User: {user.full_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Suspension Duration</Label>
            <Select value={duration} onValueChange={setDuration} required>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {SUSPENSION_DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this user is being suspended..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !duration || !reason.trim()}>
              {isSubmitting ? 'Suspending...' : 'Suspend User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}