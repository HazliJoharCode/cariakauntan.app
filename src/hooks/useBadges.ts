import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from './use-toast';

export function useBadges(userId?: string) {
  const [badges, setBadges] = useState<Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earned_at?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('user_badges')
          .select(`
            id,
            name,
            description,
            icon,
            earned:user_earned_badges!inner(earned_at)
          `)
          .eq('earned.user_id', userId)
          .order('name');

        if (error) throw error;
        setBadges(data || []);
      } catch (error) {
        console.error('Error loading badges:', error);
        toast({
          title: 'Error',
          description: 'Failed to load badges',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [userId]);

  return { badges, loading };
}