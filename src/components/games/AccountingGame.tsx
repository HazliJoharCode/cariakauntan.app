```tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { GameScenario } from './GameScenario';
import { GameComplete } from './GameComplete';
import { GameProgress } from './GameProgress';
import { scenarios } from '@/data/gameScenarios';

export default function AccountingGame() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const handleCorrectAnswer = () => {
    setScore(score + 1);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setGameComplete(true);
    }
  };

  const restartGame = () => {
    setCurrentScenario(0);
    setScore(0);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <GameComplete 
        score={score} 
        totalScenarios={scenarios.length} 
        onRestart={restartGame} 
      />
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <GameProgress 
        currentScenario={currentScenario} 
        totalScenarios={scenarios.length}
        score={score}
      />
      <GameScenario
        scenario={scenarios[currentScenario]}
        onCorrectAnswer={handleCorrectAnswer}
        onNext={nextScenario}
      />
    </Card>
  );
}
```