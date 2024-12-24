import { supabase } from '../supabase';
import { handleServiceError } from './errorHandling';
import { toast } from '@/hooks/use-toast';

export interface Rating {
  id: string;
  provider_id: string;
  user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export class RatingsService {
  static async getRatings(providerId: string): Promise<Rating[]> {
    try {
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const fetchPromise = supabase
        .from('ratings')
        .select('*, profiles:user_id (full_name)')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ratings:', error);
      // Return empty array as fallback
      return [];
    }
  }

  static async submitRating(
    providerId: string,
    userId: string,
    rating: number,
    review?: string
  ): Promise<boolean> {
    try {
      if (!providerId || !userId) {
        throw new Error('Missing required parameters');
      }

      const { error } = await supabase
        .from('ratings')
        .upsert({
          provider_id: providerId,
          user_id: userId,
          rating,
          review: review?.trim() || null
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Thank you for your feedback!'
      });
      return true;
    } catch (error) {
      handleServiceError(error, 'Rating submission');
      return false;
    }
  }
}