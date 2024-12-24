import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import * as Icons from 'lucide-react';
import { useBadges } from '@/hooks/useBadges';

interface UserBadgesProps {
  userId: string;
}

export default function UserBadges({ userId }: UserBadgesProps) {
  const { badges, loading } = useBadges(userId);

  if (loading || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        const Icon = Icons[badge.icon as keyof typeof Icons] || Icons.Award;

        return (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="secondary"
                  className="flex items-center gap-1 cursor-help"
                >
                  <Icon className="h-3 w-3" />
                  {badge.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p>{badge.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Earned {format(new Date(badge.earned_at!), 'MMM d, yyyy')}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}