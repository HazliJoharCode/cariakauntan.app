import { ChatContext } from './types';
import { accountants } from '@/data/accountants';

export function getFallbackResponse(message: string, context: ChatContext): string {
  const query = message.toLowerCase();
  let matchedAccountants = [];

  // Match based on keywords
  if (query.includes('tax') || query.includes('gst')) {
    matchedAccountants = accountants.filter(a => 
      a.services.includes('Tax Planning') || 
      a.services.includes('GST/SST Advisory')
    );
  } else if (query.includes('audit')) {
    matchedAccountants = accountants.filter(a => 
      a.services.includes('Audit Services')
    );
  } else if (query.includes('advisory') || query.includes('consulting')) {
    matchedAccountants = accountants.filter(a => 
      a.services.includes('Business Consulting') || 
      a.services.includes('Financial Advisory')
    );
  }

  if (matchedAccountants.length > 0) {
    const recommendations = matchedAccountants
      .slice(0, 2)
      .map(a => `- ${a.name} from ${a.company}\n  Services: ${a.services.join(', ')}\n  Contact: ${a.phone}`)
      .join('\n\n');

    return `Based on your query, I recommend these professionals:\n\n${recommendations}`;
  }

  return `I can help you find the right accountant for your needs. Could you please specify what type of service you're looking for? For example:
- Tax planning and compliance
- Audit services
- Business consulting
- Financial advisory`;
}