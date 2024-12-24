import { ChatContext, ChatMessage } from './types';
import { analyzeUserIntent } from './intentAnalysis';
import { matchAccountants } from './accountantMatcher';

export class ResponseGenerator {
  static generateResponse(message: string, context: ChatContext): string {
    // Analyze user intent
    const intent = analyzeUserIntent(message);
    
    if (intent.needsClarification) {
      return this.generateClarifyingQuestion(intent.unclear);
    }

    // Match accountants based on intent
    const matches = matchAccountants(intent, context.availableAccountants);
    
    if (matches.length === 0) {
      return this.generateNoMatchResponse(intent);
    }

    return this.formatRecommendations(matches, intent);
  }

  private static generateClarifyingQuestion(unclear: string[]): string {
    const questions = {
      industry: "What industry is your business in?",
      size: "What's the size of your business?",
      service: "What specific accounting services are you looking for?",
      location: "Which area in Malaysia are you located in?"
    };

    const relevantQuestions = unclear
      .map(u => questions[u as keyof typeof questions])
      .filter(Boolean);

    return `To better assist you, could you please provide more information?\n\n${
      relevantQuestions.join('\n')
    }`;
  }

  private static generateNoMatchResponse(intent: any): string {
    return `I understand you're looking for ${intent.service} services. While I don't have an exact match, I can suggest some alternatives:

1. Consider broadening your criteria
2. Look for accountants with complementary services
3. Let me know if you'd like to explore different options

What would you prefer?`;
  }

  private static formatRecommendations(matches: any[], intent: any): string {
    const recommendations = matches
      .slice(0, 2)
      .map(m => `• ${m.name} from ${m.company}
  - Specializes in: ${m.services.join(', ')}
  - Why recommended: ${m.matchReason}
  - Contact: ${m.phone}`
      )
      .join('\n\n');

    return `Based on your needs for ${intent.service}, here are my top recommendations:\n\n${
      recommendations
    }\n\nWould you like more details about any of these accountants?`;
  }
}