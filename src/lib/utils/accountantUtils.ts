import { Accountant } from '@/types/accountant';

export function getRecommendedAccountants(query: string, accountants: Accountant[]): Accountant[] {
  const lowercaseQuery = query.toLowerCase();
  
  // Tax-related queries
  if (lowercaseQuery.includes('tax') || lowercaseQuery.includes('gst') || lowercaseQuery.includes('sst')) {
    return accountants.filter(a => 
      a.services.includes('Tax Planning') || 
      a.services.includes('GST/SST Advisory')
    ).slice(0, 2);
  }

  // Audit-related queries
  if (lowercaseQuery.includes('audit') || lowercaseQuery.includes('financial statement')) {
    return accountants.filter(a => 
      a.services.includes('Audit Services')
    ).slice(0, 2);
  }

  // Business advisory
  if (lowercaseQuery.includes('business') || lowercaseQuery.includes('advisory') || lowercaseQuery.includes('consult')) {
    return accountants.filter(a => 
      a.services.includes('Business Consulting') || 
      a.services.includes('Financial Advisory')
    ).slice(0, 2);
  }

  return [];
}