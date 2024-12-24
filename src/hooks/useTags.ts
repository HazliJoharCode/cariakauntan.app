import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from './use-toast';

export function useTags() {
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const { data, error } = await supabase
          .from('forum_tags')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setTags(data || []);
      } catch (error) {
        console.error('Error loading tags:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tags',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  return { tags, loading };
}