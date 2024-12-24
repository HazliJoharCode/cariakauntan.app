import { useState } from 'react';
import { toast } from './use-toast';

export function useAuthError() {
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = (error: any) => {
    let message = 'An unexpected error occurred';

    // Handle specific Supabase auth errors
    if (typeof error === 'object' && error !== null) {
      switch (error.message) {
        case 'Invalid login credentials':
          message = 'Invalid email or password';
          break;
        case 'Email not confirmed':
          message = 'Please confirm your email address';
          break;
        case 'Email rate limit exceeded':
          message = 'Too many attempts. Please try again later';
          break;
        case 'Password should be at least 6 characters':
          message = 'Password must be at least 6 characters';
          break;
        default:
          if (error.message.includes('already registered')) {
            message = 'This email is already registered';
          }
      }
    }

    setError(message);
    toast({
      title: 'Authentication Error',
      description: message,
      variant: 'destructive',
    });

    return message;
  };

  const clearError = () => setError(null);

  return {
    error,
    setError,
    handleAuthError,
    clearError,
  };
}