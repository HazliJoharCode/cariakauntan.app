import { accountants } from '@/data/accountants';

export function getFallbackResponse(message: string, context: any) {
  const lowercaseMessage = message.toLowerCase();
  
  // Tax-related queries
  if (lowercaseMessage.includes('tax') || lowercaseMessage.includes('gst') || lowercaseMessage.includes('sst')) {
    const taxExperts = accountants.filter(a => 
      a.services.includes('Tax Planning') || 
      a.services.includes('GST/SST Advisory')
    ).slice(0, 2);

    return `For tax-related matters, I recommend speaking with:
${taxExperts.map(a => `- ${a.name} from ${a.company} (${a.phone})`).join('\n')}`;
  }

  // Audit-related queries
  if (lowercaseMessage.includes('audit') || lowercaseMessage.includes('financial statement')) {
    const auditExperts = accountants.filter(a => 
      a.services.includes('Audit Services')
    ).slice(0, 2);

    return `For audit services, these professionals can help:
${auditExperts.map(a => `- ${a.name} from ${a.company} (${a.phone})`).join('\n')}`;
  }

  // Business advisory
  if (lowercaseMessage.includes('business') || lowercaseMessage.includes('advisory') || lowercaseMessage.includes('consult')) {
    const advisors = accountants.filter(a => 
      a.services.includes('Business Consulting') || 
      a.services.includes('Financial Advisory')
    ).slice(0, 2);

    return `For business advisory services, consider reaching out to:
${advisors.map(a => `- ${a.name} from ${a.company} (${a.phone})`).join('\n')}`;
  }

  // Default response
  return `I can help you find the right accountant for your needs. Could you tell me more about what specific services you're looking for? For example:
- Tax planning and compliance
- Audit services
- Business consulting
- Financial advisory`;
}