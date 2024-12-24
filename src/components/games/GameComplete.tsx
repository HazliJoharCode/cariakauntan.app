```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface GameCompleteProps {
  score: number;
  totalScenarios: number;
  onRestart: () => void;
}

export function GameComplete({ score, totalScenarios, onRestart }: GameCompleteProps) {
  const getCompletionMessage = () => {
    if (score === totalScenarios) {
      return "Perfect score! You're a financial wizard! 🎉";
    } else if (score >= totalScenarios / 2) {
      return "Good job! Keep learning! 👍";
    }
    return "Keep practicing to improve your score! 💪";
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Game Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-2xl font-bold">
            Your Score: {score}/{totalScenarios}
          </p>
          <p className="text-muted-foreground">
            {getCompletionMessage()}
          </p>
        </div>
        <Button onClick={onRestart} className="w-full">
          Play Again
        </Button>
      </CardContent>
    </Card>
  );
}
```