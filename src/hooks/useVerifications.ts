import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { VerificationRequest } from '@/types/verification';

export function useVerifications() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadVerificationRequests() {
    try {
      const { data, error } = await supabase
        .from('verification_documents')
        .select(`
          id,
          document_url,
          status,
          uploaded_at,
          profile:profiles (
            full_name,
            company_name,
            phone,
            business_address
          )
        `)
        .eq('status', 'pending')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setRequests(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load verification requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerification(id: string, approved: boolean) {
    try {
      const status = approved ? 'verified' : 'rejected';
      
      const { error: docError } = await supabase
        .from('verification_documents')
        .update({ status })
        .eq('id', id);

      if (docError) throw docError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ verification_status: status })
        .eq('id', id);

      if (profileError) throw profileError;

      toast({
        title: 'Success',
        description: `Provider ${approved ? 'approved' : 'rejected'} successfully`,
      });

      loadVerificationRequests();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive',
      });
    }
  }

  return {
    requests,
    loading,
    loadVerificationRequests,
    handleVerification,
  };
}