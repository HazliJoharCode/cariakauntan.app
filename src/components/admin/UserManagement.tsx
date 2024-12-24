import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, AlertTriangle } from 'lucide-react';
import { useModeration } from '@/hooks/useModeration';
import { supabase } from '@/lib/supabase';
import SuspendUserDialog from './SuspendUserDialog';

export default function UserManagement() {
  const { banUser, unbanUser } = useModeration();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = (user: any) => {
    setSelectedUser(user);
    setShowSuspendDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{user.full_name}</CardTitle>
                <div className="flex items-center gap-2">
                  {user.is_suspended && (
                    <Badge variant="destructive">Suspended</Badge>
                  )}
                  {user.is_banned && (
                    <Badge variant="destructive">Banned</Badge>
                  )}
                  {user.is_moderator && (
                    <Badge variant="default">Moderator</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Email: {user.email}</span>
                    <span>
                      Joined: {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {user.is_banned ? (
                    <Button
                      variant="outline"
                      onClick={() => unbanUser(user.id)}
                    >
                      Unban User
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleSuspend(user)}
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => banUser(user.id)}
                      >
                        Ban User
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showSuspendDialog && selectedUser && (
        <SuspendUserDialog
          user={selectedUser}
          isOpen={showSuspendDialog}
          onClose={() => {
            setShowSuspendDialog(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}