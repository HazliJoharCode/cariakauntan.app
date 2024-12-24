```typescript
import { Scenario } from '@/types/game';

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Understanding Burn Rate",
    description: "Your startup has $100,000 in the bank and monthly expenses of $20,000. What's your burn rate and runway?",
    options: [
      { 
        text: "Burn rate: $20,000/month, Runway: 5 months", 
        correct: true, 
        explanation: "Burn rate is your monthly expenses. Runway is cash divided by burn rate." 
      },
      { 
        text: "Burn rate: $100,000/month, Runway: 20 months", 
        correct: false, 
        explanation: "This calculation is incorrect. Burn rate is your monthly expenses." 
      },
      { 
        text: "Burn rate: $5,000/month, Runway: 20 months", 
        correct: false, 
        explanation: "This would give you a longer runway but isn't based on the actual expenses." 
      }
    ],
    concept: "Burn rate is how quickly a company spends its cash reserves.",
    difficulty: 'easy'
  },
  {
    id: 2,
    title: "Cash Flow Management",
    description: "Your business made $50,000 in sales this month, but customers haven't paid yet. Your bills are due next week. What's your cash flow situation?",
    options: [
      { 
        text: "Positive cash flow because sales are high", 
        correct: false, 
        explanation: "Sales don't equal cash until customers pay." 
      },
      { 
        text: "Negative cash flow despite good sales", 
        correct: true, 
        explanation: "Cash flow depends on actual money received, not just sales made." 
      },
      { 
        text: "Neutral cash flow", 
        correct: false, 
        explanation: "Without actual cash from sales, you can't pay bills, leading to negative cash flow." 
      }
    ],
    concept: "Cash flow is about timing of payments, not just total sales.",
    difficulty: 'medium'
  },
  {
    id: 3,
    title: "Break-even Analysis",
    description: "Your product costs $10 to make and sells for $25. Fixed costs are $1,000 per month. How many units must you sell to break even?",
    options: [
      { 
        text: "40 units", 
        correct: false, 
        explanation: "This doesn't cover your fixed costs." 
      },
      { 
        text: "67 units", 
        correct: true, 
        explanation: "At $15 profit per unit, you need 67 units to cover $1,000 fixed costs." 
      },
      { 
        text: "100 units", 
        correct: false, 
        explanation: "This would give you more profit than needed for break-even." 
      }
    ],
    concept: "Break-even point is where total revenue equals total costs.",
    difficulty: 'hard'
  },
  {
    id: 4,
    title: "Profitability Ratios",
    description: "A company has net income of $50,000 and revenue of $200,000. What's their profit margin?",
    options: [
      { 
        text: "25%", 
        correct: true, 
        explanation: "Profit margin = (Net Income / Revenue) × 100 = (50,000 / 200,000) × 100 = 25%" 
      },
      { 
        text: "40%", 
        correct: false, 
        explanation: "This calculation is incorrect. Remember to divide net income by revenue." 
      },
      { 
        text: "20%", 
        correct: false, 
        explanation: "Check your math: 50,000 / 200,000 = 0.25 or 25%" 
      }
    ],
    concept: "Profit margin shows how much of each sales dollar is converted to profit.",
    difficulty: 'medium'
  },
  {
    id: 5,
    title: "Working Capital",
    description: "A business has current assets of $80,000 and current liabilities of $30,000. What's their working capital ratio?",
    options: [
      { 
        text: "2.67", 
        correct: true, 
        explanation: "Working Capital Ratio = Current Assets / Current Liabilities = 80,000 / 30,000 = 2.67" 
      },
      { 
        text: "50,000", 
        correct: false, 
        explanation: "This is the net working capital (80,000 - 30,000), not the ratio." 
      },
      { 
        text: "1.5", 
        correct: false, 
        explanation: "Check your calculation: 80,000 / 30,000 = 2.67" 
      }
    ],
    concept: "Working capital ratio measures a company's ability to pay short-term obligations.",
    difficulty: 'hard'
  }
];
```