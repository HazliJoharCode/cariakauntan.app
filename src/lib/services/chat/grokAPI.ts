import { GROK_CONFIG } from './config';
import { ChatError, APIError } from './errors';
import { ResponseFormatter } from './responseFormatter';
import type { ChatMessage, ChatResponse, ChatContext } from './types';
import { ChatContextBuilder } from './contextBuilder';

export class GrokAPI {
  private static apiKey = import.meta.env.VITE_XAI_API_KEY;

  static async generateResponse(message: string, context: ChatContext): Promise<ChatResponse> {
    if (!this.apiKey) {
      return {
        message: ResponseFormatter.format('error', null),
        error: 'API key not configured'
      };
    }

    try {
      const formattedContext = ChatContextBuilder.build(context);
      
      const response = await fetch(`${GROK_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: GROK_CONFIG.model,
          messages: [
            { role: 'system', content: formattedContext },
            { role: 'user', content: message }
          ],
          temperature: GROK_CONFIG.temperature,
          stream: GROK_CONFIG.stream
        })
      });

      if (!response.ok) {
        throw new APIError('API request failed', response.status);
      }

      const data = await response.json();
      return { 
        message: this.processResponse(data.choices[0].message.content, context),
        metadata: {
          model: data.model,
          usage: data.usage
        }
      };
    } catch (error) {
      console.error('Grok API error:', error);
      return { 
        message: ResponseFormatter.format('error', null),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static processResponse(content: string, context: ChatContext): string {
    // Extract key information and format it
    const matches = this.extractRecommendations(content, context);
    if (matches.length > 0) {
      return ResponseFormatter.format('recommendations', matches);
    }

    // Check if clarification needed
    if (content.toLowerCase().includes('could you') || content.toLowerCase().includes('please specify')) {
      return ResponseFormatter.format('clarification', ['service', 'industry']);
    }

    return content;
  }

  private static extractRecommendations(content: string, context: ChatContext): any[] {
    // Extract accountant recommendations from API response
    const matches = context.availableAccountants.filter(accountant =>
      content.toLowerCase().includes(accountant.name.toLowerCase())
    );

    return matches.slice(0, 2);
  }
}