import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useActivityLogs } from '@/hooks/useActivityLogs';

interface ActivityLogsProps {
  userId: string;
}

const ACTION_COLORS = {
  post_created: 'bg-green-100 text-green-800',
  post_deleted: 'bg-red-100 text-red-800',
  comment_created: 'bg-blue-100 text-blue-800',
  comment_deleted: 'bg-orange-100 text-orange-800',
  vote_cast: 'bg-purple-100 text-purple-800',
  report_submitted: 'bg-yellow-100 text-yellow-800'
};

export default function ActivityLogs({ userId }: ActivityLogsProps) {
  const { logs, loading } = useActivityLogs(userId);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No activity logs found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {log.action_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
              <Badge
                className={ACTION_COLORS[log.action_type as keyof typeof ACTION_COLORS]}
              >
                {log.content_type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
              </div>
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <pre className="text-sm bg-muted p-2 rounded-md overflow-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}