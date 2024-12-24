import { BadgeCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function VerifiedBadge() {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center justify-center">
            <BadgeCheck className="h-4 w-4 md:h-5 md:w-5 text-primary fill-primary/10 animate-in fade-in duration-300" />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          sideOffset={5} 
          className="bg-primary text-primary-foreground font-medium"
        >
          <p className="text-xs">Verified Professional</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}