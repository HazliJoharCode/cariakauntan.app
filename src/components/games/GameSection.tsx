```tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon } from 'lucide-react';
import AccountingGame from './AccountingGame';

export default function GameSection() {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowGame(false)}
          className="mb-4"
        >
          ← Back to Community
        </Button>
        <AccountingGame />
      </div>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">AccountingQuest</h3>
          <p className="text-sm text-muted-foreground">
            Learn accounting concepts through an interactive game! Test your knowledge of burn rate, cash flow, and more.
          </p>
        </div>
        <Button onClick={() => setShowGame(true)} size="lg" className="hidden sm:flex">
          <GamepadIcon className="mr-2 h-5 w-5" />
          Play Now
        </Button>
      </div>
      <Button onClick={() => setShowGame(true)} className="w-full mt-4 sm:hidden">
        <GamepadIcon className="mr-2 h-5 w-5" />
        Play Now
      </Button>
    </Card>
  );
}
```