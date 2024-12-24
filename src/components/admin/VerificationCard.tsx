import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { VerificationRequest } from "@/types/verification";

interface VerificationCardProps {
  request: VerificationRequest;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export default function VerificationCard({ request, onApprove, onReject }: VerificationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{request.profile.full_name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {request.profile.company_name}
          </p>
        </div>
        <Badge>{request.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">
              {request.profile.business_address}
            </p>
            <p className="text-sm text-muted-foreground">
              Phone: {request.profile.phone}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(request.document_url)}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Certificate
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => onApprove(request.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(request.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}