import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ReportsList from '@/components/admin/ReportsList';
import UserManagement from '@/components/admin/UserManagement';
import { useAuth } from '@/hooks/useAuth';

export default function ModeratorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reports');

  // Check if user is work@hazlijohar.com
  const isModerator = user?.email === 'work@hazlijohar.com';

  if (!isModerator) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Moderator Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <ReportsList />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}