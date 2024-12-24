import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { services } from '@/data/services';
import VacancyList from '../vacancies/VacancyList';
import MergerListings from './MergerListings';
import { useVacancies } from '@/hooks/useVacancies';

interface ServiceProviderProfileProps {
  profile: {
    full_name: string;
    company_name?: string;
    phone: string;
    services?: string[];
    location?: string;
    availability?: string;
    business_address?: string;
    company_registration_number?: string;
    industry?: string;
    years_experience?: number;
    description?: string;
    verification_status: string;
  } | null;
}

export default function ServiceProviderProfile({ profile }: ServiceProviderProfileProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const { vacancies, refresh: refreshVacancies } = useVacancies(user?.id);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    phone: profile?.phone || '',
    services: profile?.services || [],
    location: profile?.location || '',
    availability: profile?.availability || '',
    business_address: profile?.business_address || '',
    company_registration_number: profile?.company_registration_number || '',
    industry: profile?.industry || '',
    years_experience: profile?.years_experience || 0,
    description: profile?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="vacancies">Vacancies</TabsTrigger>
        <TabsTrigger value="mergers">M&A</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Service Provider Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Existing profile form content */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="vacancies">
        <Card>
          <CardHeader>
            <CardTitle>Job Vacancies</CardTitle>
          </CardHeader>
          <CardContent>
            <VacancyList 
              vacancies={vacancies}
              providerId={user?.id}
              onVacancyChange={refreshVacancies}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="mergers">
        <MergerListings />
      </TabsContent>
    </Tabs>
  );
}