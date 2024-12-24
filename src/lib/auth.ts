import { supabase } from './supabase';

export async function isAdmin(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.is_admin || false;
  } catch {
    return false;
  }
}