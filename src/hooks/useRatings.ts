import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { RatingsService, type Rating } from '@/lib/services/ratingsService';
import { toast } from './use-toast';

export function useRatings(providerId: string) {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState<Rating | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRatings() {
      if (!providerId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await RatingsService.getRatings(providerId);
        
        if (mounted) {
          setRatings(data);
          
          if (data.length > 0) {
            const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
            setAverageRating(Math.round(avg * 10) / 10);
            setTotalRatings(data.length);
          }

          if (user) {
            const userRating = data.find(r => r.user_id === user.id);
            setUserRating(userRating || null);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load ratings'));
          // Don't show error toast for expected development errors
          if (!(err instanceof Error && err.message === 'Failed to fetch')) {
            toast({
              title: 'Error',
              description: 'Failed to load ratings',
              variant: 'destructive'
            });
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRatings();

    return () => {
      mounted = false;
    };
  }, [providerId, user]);

  return {
    ratings,
    loading,
    error,
    averageRating,
    totalRatings,
    userRating
  };
}