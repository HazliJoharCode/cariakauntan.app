import { supabase } from '@/lib/supabase';

export class BadgeService {
  static async checkAndAwardBadges(userId: string) {
    try {
      // Get user's stats
      const { data: stats } = await supabase.rpc('get_user_stats', { user_id: userId });
      
      // Get all badges
      const { data: badges } = await supabase
        .from('user_badges')
        .select('*');

      if (!badges) return;

      // Check each badge's criteria
      for (const badge of badges) {
        const criteria = badge.criteria as Record<string, number>;
        let qualifies = true;

        // Check if user meets all criteria
        for (const [key, value] of Object.entries(criteria)) {
          if (!stats || stats[key] < value) {
            qualifies = false;
            break;
          }
        }

        if (qualifies) {
          // Check if user already has this badge
          const { data: existing } = await supabase
            .from('user_earned_badges')
            .select('*')
            .eq('user_id', userId)
            .eq('badge_id', badge.id)
            .single();

          // Award badge if not already earned
          if (!existing) {
            await supabase.from('user_earned_badges').insert({
              user_id: userId,
              badge_id: badge.id
            });

            // Create notification
            await supabase.from('notifications').insert({
              user_id: userId,
              type: 'badge_earned',
              title: 'New Badge Earned!',
              content: `You've earned the "${badge.name}" badge: ${badge.description}`
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }
}