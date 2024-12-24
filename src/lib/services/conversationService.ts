import { supabase } from '../supabase';
import { ChatContext } from '@/types/chat';
import { getRecommendedAccountants } from '../utils/accountantUtils';

export class ConversationService {
  static async saveToDatabase(userId: string, userMessage: string, assistantResponse: string): Promise<void> {
    try {
      await supabase.from('chat_conversations').insert([
        {
          user_id: userId,
          message: userMessage,
          role: 'user',
          created_at: new Date().toISOString()
        },
        {
          user_id: userId,
          message: assistantResponse,
          role: 'assistant',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  static getFallbackResponse(message: string, context: ChatContext): string {
    const accountants = getRecommendedAccountants(message, context.availableAccountants);
    
    if (accountants.length > 0) {
      return `Based on your query, I recommend speaking with:\n${
        accountants.map(a => `- ${a.name} from ${a.company} (${a.phone})`).join('\n')
      }`;
    }

    return `I can help you find the right accountant for your needs. Could you tell me more about what specific services you're looking for? For example:
- Tax planning and compliance
- Audit services
- Business consulting
- Financial advisory`;
  }
}