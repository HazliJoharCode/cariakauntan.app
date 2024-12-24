import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Vacancy } from '@/lib/services/vacancyService';
import VacancyDialog from './VacancyDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VacancyListProps {
  vacancies: Vacancy[];
  providerId?: string;
  onVacancyChange?: () => void;
}

export default function VacancyList({ vacancies, providerId, onVacancyChange }: VacancyListProps) {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const isProvider = providerId === user?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Current Openings</h2>
        {isProvider && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post Vacancy
          </Button>
        )}
      </div>

      <Alert>
        <AlertDescription>
          We are not a recruitment agency. All job postings are provided by third parties. 
          Please contact the respective employer directly for any job applications or inquiries.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {vacancies.map((vacancy) => (
          <Card key={vacancy.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{vacancy.title}</CardTitle>
                  <CardDescription>
                    {vacancy.provider?.company_name || vacancy.provider?.full_name}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    if (vacancy.external_url) {
                      window.open(vacancy.external_url, '_blank');
                    } else {
                      window.location.href = `mailto:${vacancy.contact_info}`;
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {vacancy.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Posted {format(new Date(vacancy.created_at), 'MMM d, yyyy')}</span>
                  <span>Expires {format(new Date(vacancy.expires_at), 'MMM d, yyyy')}</span>
                </div>
                {isProvider && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedVacancy(vacancy);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {vacancies.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No current openings available.
            </CardContent>
          </Card>
        )}
      </div>

      <VacancyDialog
        vacancy={selectedVacancy}
        providerId={providerId}
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedVacancy(null);
        }}
        onSuccess={() => {
          setDialogOpen(false);
          setSelectedVacancy(null);
          onVacancyChange?.();
        }}
      />
    </div>
  );
}