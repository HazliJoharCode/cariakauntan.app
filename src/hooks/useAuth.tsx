import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import AuthDialog from '@/components/auth/AuthDialog';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    fullName: string;
    isServiceProvider: boolean;
    companyName?: string;
    phone: string;
    additionalData?: Record<string, any>;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  openAuthDialog: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.session) {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      }
    } catch (error: any) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Invalid email or password');
      }
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async ({
    email,
    password,
    fullName,
    isServiceProvider,
    companyName,
    phone,
    additionalData = {},
  }: {
    email: string;
    password: string;
    fullName: string;
    isServiceProvider: boolean;
    companyName?: string;
    phone: string;
    additionalData?: Record<string, any>;
  }) => {
    try {
      const { error: signUpError, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
            is_service_provider: isServiceProvider,
            company_name: companyName,
            phone,
          }
        }
      });
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        throw signUpError;
      }

      if (!data.user) {
        throw new Error('Failed to create user account');
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        user_type: isServiceProvider ? 'service_provider' : 'end_user',
        company_name: companyName,
        phone,
        verification_status: isServiceProvider ? 'pending' : 'verified',
        ...additionalData,
      });

      if (profileError) throw profileError;

      toast({
        title: "Account created!",
        description: isServiceProvider 
          ? "Welcome to CariAkauntan.ai! Your account is pending verification."
          : "Welcome to CariAkauntan.ai!",
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message.includes('already registered')) {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const openAuthDialog = () => {
    setAuthDialogOpen(true);
  };

  // Don't render until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, openAuthDialog }}>
      {children}
      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}