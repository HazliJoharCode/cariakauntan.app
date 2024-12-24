import { Accountant } from '@/types/accountant';

interface MatchResult extends Accountant {
  matchReason: string;
  score: number;
}

export function matchAccountants(intent: any, accountants: Accountant[]): MatchResult[] {
  return accountants
    .map(accountant => {
      let score = 0;
      let reasons = [];

      // Service match
      if (intent.service && accountant.services.includes(intent.service)) {
        score += 5;
        reasons.push(`specializes in ${intent.service}`);
      }

      // Location match
      if (intent.location && accountant.location.toLowerCase().includes(intent.location)) {
        score += 3;
        reasons.push(`located in ${intent.location}`);
      }

      // Additional services bonus
      const relevantServices = accountant.services.filter(s => 
        s !== intent.service && isRelevantService(s, intent)
      );
      if (relevantServices.length > 0) {
        score += relevantServices.length;
        reasons.push(`offers complementary services: ${relevantServices.join(', ')}`);
      }

      return {
        ...accountant,
        matchReason: reasons.join('; '),
        score
      };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score);
}

function isRelevantService(service: string, intent: any): boolean {
  const serviceGroups = {
    'Tax Planning': ['GST/SST Advisory', 'Financial Advisory'],
    'Audit Services': ['Financial Advisory', 'Risk Management'],
    'Business Consulting': ['Financial Advisory', 'Digital Transformation']
  };

  return intent.service && serviceGroups[intent.service as keyof typeof serviceGroups]?.includes(service);
}