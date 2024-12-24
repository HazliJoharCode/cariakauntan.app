import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LicenseType = 'Licensed Auditor' | 'Licensed Accountant' | 'Licensed Tax Agent' | 'Licensed Company Secretary';

const LICENSE_STYLES = {
  'Licensed Auditor': {
    background: 'bg-gradient-to-r from-zinc-50 to-white',
    text: 'text-black',
    icon: 'text-black',
    ring: 'ring-black/5',
    shadow: 'shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]'
  },
  'Licensed Accountant': {
    background: 'bg-gradient-to-r from-white to-zinc-50',
    text: 'text-black',
    icon: 'text-black',
    ring: 'ring-black/5',
    shadow: 'shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]'
  },
  'Licensed Tax Agent': {
    background: 'bg-gradient-to-r from-zinc-50 to-white',
    text: 'text-black',
    icon: 'text-black',
    ring: 'ring-black/5',
    shadow: 'shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]'
  },
  'Licensed Company Secretary': {
    background: 'bg-gradient-to-r from-white to-zinc-50',
    text: 'text-black',
    icon: 'text-black',
    ring: 'ring-black/5',
    shadow: 'shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]'
  }
} as const;

interface LicenseBadgeProps {
  type: LicenseType;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  className?: string;
}

export default function LicenseBadge({ 
  type, 
  verificationStatus = 'verified', 
  className 
}: LicenseBadgeProps) {
  const styles = LICENSE_STYLES[type];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
              'ring-1 ring-inset transition-all duration-200',
              'backdrop-blur-sm backdrop-saturate-200',
              'hover:shadow-lg hover:-translate-y-0.5',
              styles.background,
              styles.text,
              styles.ring,
              styles.shadow,
              verificationStatus === 'pending' && 'opacity-60',
              className
            )}
          >
            <Shield className={cn('h-3.5 w-3.5 shrink-0', styles.icon)} />
            <span className="flex items-center leading-none tracking-tight">
              {type}
              {verificationStatus === 'pending' && (
                <span className="ml-1 opacity-75">(Pending)</span>
              )}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className={cn(
            'text-xs font-medium',
            verificationStatus === 'pending' ? 'text-muted-foreground' : styles.text
          )}
        >
          {verificationStatus === 'pending' 
            ? 'License verification pending'
            : `Verified ${type}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}