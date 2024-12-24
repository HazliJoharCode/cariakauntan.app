import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useVerifications } from '@/hooks/useVerifications';
import VerificationCard from '@/components/admin/VerificationCard';

export default function Verifications() {
  const { requests, loading, loadVerificationRequests, handleVerification } = useVerifications();

  useEffect(() => {
    loadVerificationRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Verifications</h1>
      
      <div className="grid gap-4">
        {requests.map((request) => (
          <VerificationCard
            key={request.id}
            request={request}
            onApprove={(id) => handleVerification(id, true)}
            onReject={(id) => handleVerification(id, false)}
          />
        ))}

        {requests.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No pending verification requests
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}