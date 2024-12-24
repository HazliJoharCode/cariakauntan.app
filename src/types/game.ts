```typescript
export interface Scenario {
  id: number;
  title: string;
  description: string;
  options: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
```