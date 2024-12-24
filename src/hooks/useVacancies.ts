import { useState, useEffect } from 'react';
import { VacancyService, type Vacancy } from '@/lib/services/vacancyService';
import { toast } from './use-toast';

export function useVacancies(providerId?: string) {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadVacancies() {
      try {
        setLoading(true);
        setError(null);
        const data = await VacancyService.getVacancies(providerId);
        if (mounted) {
          setVacancies(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load vacancies'));
          toast({
            title: 'Error',
            description: 'Failed to load vacancies. Please try again.',
            variant: 'destructive'
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadVacancies();

    return () => {
      mounted = false;
    };
  }, [providerId]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await VacancyService.getVacancies(providerId);
      setVacancies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh vacancies'));
      toast({
        title: 'Error',
        description: 'Failed to refresh vacancies',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    vacancies,
    loading,
    error,
    refresh
  };
}