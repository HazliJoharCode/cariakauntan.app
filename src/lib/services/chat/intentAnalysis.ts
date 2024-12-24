interface Intent {
  service?: string;
  industry?: string;
  size?: string;
  location?: string;
  needsClarification: boolean;
  unclear: string[];
}

export function analyzeUserIntent(message: string): Intent {
  const lowercase = message.toLowerCase();
  const intent: Intent = {
    needsClarification: false,
    unclear: []
  };

  // Service detection
  if (lowercase.includes('tax')) {
    intent.service = 'Tax Planning';
  } else if (lowercase.includes('audit')) {
    intent.service = 'Audit Services';
  } else if (lowercase.includes('advisory') || lowercase.includes('consult')) {
    intent.service = 'Business Consulting';
  } else {
    intent.unclear.push('service');
  }

  // Industry detection
  const industries = ['manufacturing', 'retail', 'technology', 'construction', 'services'];
  const foundIndustry = industries.find(i => lowercase.includes(i));
  if (foundIndustry) {
    intent.industry = foundIndustry;
  }

  // Size detection
  if (lowercase.includes('small') || lowercase.includes('sme')) {
    intent.size = 'small';
  } else if (lowercase.includes('medium')) {
    intent.size = 'medium';
  } else if (lowercase.includes('large')) {
    intent.size = 'large';
  }

  // Location detection
  const locations = ['kl', 'kuala lumpur', 'selangor', 'penang', 'johor'];
  const foundLocation = locations.find(l => lowercase.includes(l));
  if (foundLocation) {
    intent.location = foundLocation;
  }

  // Check if clarification needed
  intent.needsClarification = intent.unclear.length > 0;

  return intent;
}