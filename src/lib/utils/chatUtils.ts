import { ChatContext } from '@/types/chat';

export function formatChatContext(context: ChatContext): string {
  return `You are an AI assistant for CariAkauntan.ai, a platform connecting users with accountants in Malaysia.

Available Accountants:
${context.availableAccountants.map(a => 
  `- ${a.name} (${a.company}): ${a.services.join(', ')}`
).join('\n')}

User Context:
${Object.entries(context.userContext)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Use this information to provide accurate recommendations and advice. Always suggest specific accountants when relevant.`;
}