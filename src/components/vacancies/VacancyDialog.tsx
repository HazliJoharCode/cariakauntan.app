import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { VacancyService, type Vacancy } from '@/lib/services/vacancyService';
import { addDays } from 'date-fns';

const vacancySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  contact_info: z.string().email('Must be a valid email address'),
  external_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  expires_at: z.string()
});

type VacancyFormValues = z.infer<typeof vacancySchema>;

interface VacancyDialogProps {
  vacancy?: Vacancy | null;
  providerId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VacancyDialog({ 
  vacancy, 
  providerId, 
  isOpen, 
  onClose, 
  onSuccess 
}: VacancyDialogProps) {
  const form = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      title: vacancy?.title || '',
      description: vacancy?.description || '',
      contact_info: vacancy?.contact_info || '',
      external_url: vacancy?.external_url || '',
      expires_at: vacancy?.expires_at || addDays(new Date(), 30).toISOString().split('T')[0]
    }
  });

  const onSubmit = async (values: VacancyFormValues) => {
    if (!providerId) return;

    const vacancyData = {
      ...values,
      provider_id: providerId,
      is_active: true,
      external_url: values.external_url || null,
      expires_at: new Date(values.expires_at).toISOString()
    };

    let success;
    if (vacancy) {
      success = await VacancyService.updateVacancy(vacancy.id, vacancyData);
    } else {
      success = await VacancyService.createVacancy(vacancyData);
    }

    if (success) {
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {vacancy ? 'Edit Vacancy' : 'Post New Vacancy'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Junior Accountant" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe the role, requirements, and any other relevant details"
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="hr@company.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="external_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application URL (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://careers.company.com/apply" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" min={new Date().toISOString().split('T')[0]} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {vacancy ? 'Update' : 'Post'} Vacancy
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}