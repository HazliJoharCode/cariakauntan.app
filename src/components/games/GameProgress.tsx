```tsx
import { CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GameProgressProps {
  currentScenario: number;
  totalScenarios: number;
  score: number;
}

export function GameProgress({ currentScenario, totalScenarios, score }: GameProgressProps) {
  const progress = ((currentScenario + 1) / totalScenarios) * 100;

  return (
    <CardHeader className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Scenario {currentScenario + 1} of {totalScenarios}
        </span>
        <span className="text-sm font-medium">
          Score: {score}/{totalScenarios}
        </span>
      </div>
      <Progress value={progress} />
    </CardHeader>
  );
}
```