import { supabase } from '../supabase';
import { ChatAPIService } from './chatAPIService';
import { ConversationService } from './conversationService';
import { ChatContext } from '@/types/chat';

export class ChatService {
  static async generateResponse(message: string, context: ChatContext): Promise<string> {
    try {
      return await ChatAPIService.getResponse(message, context);
    } catch (error) {
      console.error('Error generating response:', error);
      return ConversationService.getFallbackResponse(message, context);
    }
  }

  static async saveConversation(userId: string, userMessage: string, assistantResponse: string): Promise<void> {
    await ConversationService.saveToDatabase(userId, userMessage, assistantResponse);
  }
}