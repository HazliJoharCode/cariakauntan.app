import { supabase } from '../supabase';
import { handleServiceError } from './errorHandling';
import { toast } from '@/hooks/use-toast';

export interface Vacancy {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  contact_info: string;
  external_url?: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  is_active: boolean;
  provider?: {
    full_name: string;
    company_name: string;
  };
}

export class VacancyService {
  static async getVacancies(providerId?: string): Promise<Vacancy[]> {
    try {
      let query = supabase
        .from('vacancies')
        .select(`
          *,
          provider:profiles!provider_id (
            full_name,
            company_name
          )
        `)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (providerId) {
        query = query.eq('provider_id', providerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleServiceError(error, 'Vacancies');
      return [];
    }
  }

  static async createVacancy(vacancy: Omit<Vacancy, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vacancies')
        .insert(vacancy);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vacancy posted successfully'
      });
      return true;
    } catch (error) {
      handleServiceError(error, 'Vacancy creation');
      return false;
    }
  }

  static async updateVacancy(id: string, updates: Partial<Vacancy>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vacancies')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vacancy updated successfully'
      });
      return true;
    } catch (error) {
      handleServiceError(error, 'Vacancy update');
      return false;
    }
  }
}