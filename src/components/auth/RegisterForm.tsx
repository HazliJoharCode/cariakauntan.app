import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceProviderForm from './ServiceProviderForm';
import EndUserForm from './EndUserForm';

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [activeTab, setActiveTab] = useState<'end-user' | 'service-provider'>('end-user');

  return (
    <div className="max-h-[70vh] overflow-y-auto px-1">
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="end-user">Individual/Company</TabsTrigger>
          <TabsTrigger value="service-provider">Service Provider</TabsTrigger>
        </TabsList>
        <TabsContent value="end-user">
          <EndUserForm onSuccess={onSuccess} />
        </TabsContent>
        <TabsContent value="service-provider">
          <ServiceProviderForm onSuccess={onSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
}