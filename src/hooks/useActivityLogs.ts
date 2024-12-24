import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from './use-toast';

export function useActivityLogs(userId?: string) {
  const [logs, setLogs] = useState<Array<{
    id: string;
    action_type: string;
    content_type: string;
    content_id?: string;
    metadata: Record<string, any>;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('user_activity_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLogs(data || []);
      } catch (error) {
        console.error('Error loading activity logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load activity logs',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [userId]);

  return { logs, loading };
}