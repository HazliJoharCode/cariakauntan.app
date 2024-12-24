import { useState } from 'react';
import { useAuth } from './useAuth';
import { GrokAPI } from '@/lib/services/chat/grokAPI';
import type { ChatMessage, ChatContext } from '@/lib/services/chat/types';
import { accountants } from '@/data/accountants';

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: 'Hello! I\'m here to help you find the right accountant for your needs. What type of service are you looking for?'
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ChatContext['userContext']>({});

  const sendMessage = async (content: string) => {
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsTyping(true);

    try {
      const chatContext: ChatContext = {
        availableAccountants: accountants,
        userContext: context,
        previousMessages: messages,
        userProfile: user
      };

      const { message, error } = await GrokAPI.generateResponse(content, chatContext);
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: message || 'I apologize, but I encountered an error. Please try again.'
      }]);

      if (error) {
        console.error('Chat error:', error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    sendMessage,
    isTyping,
    setContext
  };
}