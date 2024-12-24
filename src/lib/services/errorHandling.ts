import { toast } from '@/hooks/use-toast';

export class ServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function handleServiceError(error: unknown, service: string): void {
  console.error(`${service} error:`, error);
  
  let message = 'An unexpected error occurred';
  
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    message = 'Network connection error. Please check your internet connection.';
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast({
    title: `${service} Error`,
    description: message,
    variant: 'destructive'
  });
}

export function handleDatabaseError(error: unknown): void {
  if (error instanceof Error) {
    if (error.message.includes('JWT')) {
      toast({
        title: 'Authentication Error',
        description: 'Please sign in again',
        variant: 'destructive'
      });
      return;
    }
    
    if (error.message.includes('network')) {
      toast({
        title: 'Connection Error',
        description: 'Please check your internet connection',
        variant: 'destructive'
      });
      return;
    }
  }

  toast({
    title: 'Error',
    description: 'An unexpected error occurred',
    variant: 'destructive'
  });
}