import { supabase } from '@/lib/supabase';
import { NotificationService } from './notificationService';

export class ModerationService {
  static async checkContent(content: string, type: 'post' | 'comment'): Promise<{
    isAllowed: boolean;
    reason?: string;
  }> {
    try {
      // Get active moderation rules
      const { data: rules } = await supabase
        .from('moderation_rules')
        .select('*')
        .eq('is_active', true)
        .eq('rule_type', 'content');

      if (!rules) return { isAllowed: true };

      for (const rule of rules) {
        const conditions = rule.conditions as any;

        // Check for spam patterns
        if (conditions.patterns) {
          const matches = conditions.patterns.filter((pattern: string) => {
            const regex = new RegExp(pattern, 'i');
            return regex.test(content);
          });

          if (matches.length >= (conditions.min_matches || 1)) {
            return {
              isAllowed: false,
              reason: `Content matches ${matches.length} spam patterns`
            };
          }
        }

        // Check for toxic words
        if (conditions.toxic_words) {
          const matches = conditions.toxic_words.filter((word: string) =>
            content.toLowerCase().includes(word.toLowerCase())
          );

          if (matches.length > 0) {
            return {
              isAllowed: false,
              reason: 'Content contains inappropriate language'
            };
          }
        }
      }

      return { isAllowed: true };
    } catch (error) {
      console.error('Error checking content:', error);
      return { isAllowed: true }; // Fail open to avoid blocking legitimate content
    }
  }

  static async checkUserBehavior(userId: string): Promise<{
    isAllowed: boolean;
    reason?: string;
  }> {
    try {
      // Get behavior rules
      const { data: rules } = await supabase
        .from('moderation_rules')
        .select('*')
        .eq('is_active', true)
        .eq('rule_type', 'behavior');

      if (!rules) return { isAllowed: true };

      for (const rule of rules) {
        const conditions = rule.conditions as any;

        // Check rapid posting
        if (conditions.time_window && conditions.max_posts) {
          const timeAgo = new Date();
          timeAgo.setSeconds(timeAgo.getSeconds() - conditions.time_window);

          const { count } = await supabase
            .from('forum_posts')
            .select('id', { count: 'exact' })
            .eq('author_id', userId)
            .gte('created_at', timeAgo.toISOString());

          if (count && count >= conditions.max_posts) {
            return {
              isAllowed: false,
              reason: 'You are posting too frequently. Please wait a few minutes.'
            };
          }
        }
      }

      return { isAllowed: true };
    } catch (error) {
      console.error('Error checking user behavior:', error);
      return { isAllowed: true };
    }
  }

  static async logAction(action: {
    userId: string;
    actionType: string;
    contentType: string;
    contentId?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      await supabase.from('user_activity_logs').insert({
        user_id: action.userId,
        action_type: action.actionType,
        content_type: action.contentType,
        content_id: action.contentId,
        metadata: action.metadata
      });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }

  static async logModerationAction(action: {
    ruleId?: string;
    contentType: string;
    contentId: string;
    actionTaken: string;
    metadata?: Record<string, any>;
  }) {
    try {
      await supabase.from('moderation_actions').insert({
        rule_id: action.ruleId,
        content_type: action.contentType,
        content_id: action.contentId,
        action_taken: action.actionTaken,
        metadata: action.metadata
      });
    } catch (error) {
      console.error('Error logging moderation action:', error);
    }
  }

  static async notifyModerators(notification: {
    title: string;
    content: string;
    contentType: string;
    contentId: string;
  }) {
    try {
      const { data: moderators } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_moderator', true);

      if (!moderators) return;

      for (const moderator of moderators) {
        await NotificationService.createNotification({
          userId: moderator.id,
          type: 'moderation_alert',
          title: notification.title,
          content: notification.content,
          link: `/admin/moderate/${notification.contentType}/${notification.contentId}`
        });
      }
    } catch (error) {
      console.error('Error notifying moderators:', error);
    }
  }
}