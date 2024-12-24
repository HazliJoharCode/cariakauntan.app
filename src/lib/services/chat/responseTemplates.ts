export const templates = {
  recommendations: (matches: any[]) => {
    const recommendations = matches
      .map(m => `📊 ${m.name} | ${m.company}
• ${m.services.join(' • ')}
📞 ${m.phone}`).join('\n\n');

    return `Top Recommendations:\n\n${recommendations}\n\n📱 Click to contact or view profile`;
  },

  clarification: (topics: string[]) => {
    const questions = {
      service: "Which service do you need?\n• Tax & Compliance\n• Audit Services\n• Business Advisory",
      industry: "Select your industry:\n• Manufacturing\n• Retail\n• Technology\n• Services",
      location: "Preferred location?\n• KL\n• Selangor\n• Penang\n• Johor",
      size: "Business size:\n• SME\n• Medium Enterprise\n• Large Corporation"
    };

    return topics.map(t => questions[t as keyof typeof questions]).join('\n\n');
  },

  noMatch: (intent: any) => `No exact matches for ${intent.service || 'your criteria'}. Options:

1️⃣ Broaden search criteria
2️⃣ Try different location
3️⃣ Explore related services

Reply with your preference (1-3)`,

  welcome: `Welcome! I'll help find the right accountant. What do you need?

🔹 Tax Planning
🔹 Audit Services
🔹 Business Advisory
🔹 Financial Consulting`,

  error: `Service disruption. Options:
1. Try again
2. Browse accountants
3. Contact support`
};