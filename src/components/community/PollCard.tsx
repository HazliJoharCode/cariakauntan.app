import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { usePoll } from '@/hooks/usePoll';
import { format } from 'date-fns';

interface PollCardProps {
  poll: {
    id: string;
    question: string;
    options: string[];
    closes_at: string;
  };
}

export default function PollCard({ poll }: PollCardProps) {
  const { user, openAuthDialog } = useAuth();
  const { votes, totalVotes, userVote, vote, loading } = usePoll(poll.id);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleVote = async () => {
    if (!user) {
      openAuthDialog('sign-in');
      return;
    }
    if (selectedOption === null) return;
    await vote(selectedOption);
  };

  const isExpired = new Date(poll.closes_at) < new Date();
  const showResults = isExpired || userVote !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{poll.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {poll.options.map((option, index) => {
            const voteCount = votes[index] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

            return (
              <div key={index} className="space-y-2">
                {showResults ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{option}</span>
                      <span className="text-muted-foreground">
                        {voteCount} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ) : (
                  <Button
                    variant={selectedOption === index ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedOption(index)}
                    disabled={loading}
                  >
                    {option}
                  </Button>
                )}
              </div>
            );
          })}

          {!showResults && (
            <Button
              className="w-full"
              disabled={selectedOption === null || loading}
              onClick={handleVote}
            >
              {loading ? 'Voting...' : 'Submit Vote'}
            </Button>
          )}

          <p className="text-sm text-muted-foreground text-center">
            {isExpired ? (
              'Poll ended'
            ) : (
              `Poll closes ${format(new Date(poll.closes_at), 'MMM d, yyyy')}`
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}