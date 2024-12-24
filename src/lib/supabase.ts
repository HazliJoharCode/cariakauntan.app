import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { handleDatabaseError } from './services/errorHandling';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'cariakauntan-web'
    }
  },
  db: {
    schema: 'public'
  },
  // Add retries for better reliability
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add error handling wrapper
export async function supabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    if (error) throw error;
    if (!data) throw new Error('No data returned');
    return data;
  } catch (error) {
    handleDatabaseError(error);
    throw error;
  }
}