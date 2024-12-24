import { supabase } from '@/lib/supabase';

export class NotificationService {
  static async createNotification({
    userId,
    type,
    title,
    content,
    link
  }: {
    userId: string;
    type: string;
    title: string;
    content: string;
    link?: string;
  }) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          content,
          link
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }

  static async notifyMentionedUsers(content: string, postId: string) {
    // Extract usernames from content (e.g., @username)
    const mentions = content.match(/@[\w-]+/g);
    if (!mentions) return;

    // Get unique usernames
    const usernames = [...new Set(mentions.map(m => m.slice(1)))];

    // Get user IDs for mentioned users
    const { data: users } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('username', usernames);

    if (!users) return;

    // Create notifications
    for (const user of users) {
      await this.createNotification({
        userId: user.id,
        type: 'mention',
        title: 'You were mentioned in a post',
        content: `${user.full_name} mentioned you in a discussion`,
        link: `/community/post/${postId}`
      });
    }
  }
}