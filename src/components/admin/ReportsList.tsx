import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useModeration } from '@/hooks/useModeration';
import { supabase } from '@/lib/supabase';

export default function ReportsList() {
  const { resolveReport } = useModeration();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
    
    // Subscribe to new reports
    const channel = supabase
      .channel('reports')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'forum_reports'
      }, () => {
        loadReports();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_reports')
        .select(`
          *,
          reporter:profiles!reporter_id (full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: string, action: 'approve' | 'reject') => {
    setProcessingId(reportId);
    await resolveReport(reportId, action, moderatorNotes);
    setProcessingId(null);
    setModeratorNotes('');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No pending reports
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Report #{report.id.slice(0, 8)}
                </CardTitle>
                <Badge>{report.content_type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Reported by: {report.reporter?.full_name}</span>
                    <span>
                      {format(new Date(report.created_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Reason: </span>
                    <span>{report.reason}</span>
                  </div>
                  {report.details && (
                    <div>
                      <span className="font-medium">Details: </span>
                      <span>{report.details}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add moderator notes..."
                    value={moderatorNotes}
                    onChange={(e) => setModeratorNotes(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleResolve(report.id, 'approve')}
                      disabled={processingId === report.id}
                    >
                      Take Action
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleResolve(report.id, 'reject')}
                      disabled={processingId === report.id}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}