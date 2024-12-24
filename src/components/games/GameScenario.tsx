```tsx
import { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scenario } from '@/types/game';

interface GameScenarioProps {
  scenario: Scenario;
  onCorrectAnswer: () => void;
  onNext: () => void;
}

export function GameScenario({ scenario, onCorrectAnswer, onNext }: GameScenarioProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    if (scenario.options[optionIndex].correct) {
      onCorrectAnswer();
    }
  };

  const getDifficultyIcon = () => {
    switch (scenario.difficulty) {
      case 'easy':
        return <PiggyBank className="h-5 w-5 text-green-500" />;
      case 'medium':
        return <TrendingUp className="h-5 w-5 text-yellow-500" />;
      case 'hard':
        return <DollarSign className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {getDifficultyIcon()}
          <span className="text-sm text-muted-foreground capitalize">
            {scenario.difficulty}
          </span>
        </div>
        <CardTitle className="text-xl mb-2">{scenario.title}</CardTitle>
        <p className="text-muted-foreground">{scenario.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {scenario.options.map((option, index) => (
            <Button
              key={index}
              variant={
                showExplanation
                  ? option.correct
                    ? "default"
                    : selectedAnswer === index
                    ? "destructive"
                    : "outline"
                  : "outline"
              }
              className={cn(
                "justify-start h-auto py-4 px-6",
                showExplanation && option.correct && "bg-green-500 hover:bg-green-500/90",
                showExplanation && !option.correct && selectedAnswer === index && 
                  "bg-red-500 hover:bg-red-500/90"
              )}
              onClick={() => !showExplanation && handleAnswer(index)}
              disabled={showExplanation}
            >
              {option.text}
            </Button>
          ))}
        </div>

        {showExplanation && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Explanation:</p>
              <p className="text-muted-foreground">
                {scenario.options[selectedAnswer!].explanation}
              </p>
              <p className="text-muted-foreground mt-2">
                <span className="font-medium">Key Concept:</span> {scenario.concept}
              </p>
            </div>
            <Button onClick={onNext} className="w-full">
              Next Scenario
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
```