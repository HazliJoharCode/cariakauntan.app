import type { ChatContext } from './types';

export class ChatContextBuilder {
  static build(context: ChatContext): string {
    const { availableAccountants, userContext, previousMessages, userProfile } = context;

    // Build context about available accountants
    const accountantsContext = availableAccountants
      .map(a => `${a.name} (${a.company}): Specializes in ${a.services.join(', ')}`)
      .join('\n');

    // Build user context
    const userContextStr = userContext.industry 
      ? `User is from ${userContext.industry} industry, ${userContext.size || 'size unknown'}`
      : 'No specific user context available';

    // Build conversation history context
    const conversationContext = previousMessages
      .slice(-3) // Last 3 messages for context
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    return `You are an intelligent AI assistant for CariAkauntan.ai, a platform connecting users with accountants in Malaysia.

Your primary goal is to understand user needs and provide expert recommendations for accounting services.

Available Accountants:
${accountantsContext}

User Context:
${userContextStr}

Recent Conversation:
${conversationContext}

Guidelines:
1. Provide specific, actionable recommendations based on user needs
2. Consider user's industry and business context when recommending accountants
3. Explain why each recommendation is suitable for their needs
4. Include relevant service details and contact information
5. Be concise but informative
6. If user needs are unclear, ask relevant follow-up questions

Remember to maintain a professional, knowledgeable tone while being helpful and approachable.`;
  }
}