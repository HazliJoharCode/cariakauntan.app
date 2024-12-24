import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

export default function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn(
      'flex gap-2',
      isUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn(
        'rounded-lg p-3 max-w-[80%] text-sm',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
        'whitespace-pre-wrap break-words'
      )}>
        {isTyping ? (
          <div className="flex gap-1">
            <span className="animate-bounce">·</span>
            <span className="animate-bounce delay-100">·</span>
            <span className="animate-bounce delay-200">·</span>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}