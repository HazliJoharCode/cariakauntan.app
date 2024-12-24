import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  revenue_range: z.string().min(1, 'Revenue range is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['Full Practice Sale', 'Partial Sale', 'Partnership Opportunity', 'Seeking Practice']),
  contact_info: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(8, 'Valid phone number required'),
    preferred_contact: z.enum(['email', 'phone'])
  })
});

type ListingFormValues = z.infer<typeof listingSchema>;

interface MergerListingFormProps {
  onSuccess: () => void;
  existingListing?: any;
}

// Change to default export
export default function MergerListingForm({ onSuccess, existingListing }: MergerListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: existingListing || {
      title: '',
      description: '',
      revenue_range: '',
      location: '',
      type: 'Full Practice Sale',
      contact_info: {
        email: '',
        phone: '',
        preferred_contact: 'email'
      }
    }
  });

  const onSubmit = async (values: ListingFormValues) => {
    try {
      setIsSubmitting(true);
      
      const { error } = existingListing 
        ? await supabase
            .from('merger_listings')
            .update(values)
            .eq('id', existingListing.id)
        : await supabase
            .from('merger_listings')
            .insert([values]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: existingListing 
          ? 'Listing updated successfully'
          : 'Listing created successfully'
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to save listing. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields remain the same */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Established Tax Practice in KL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rest of the form fields... */}
        
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : existingListing ? 'Update Listing' : 'Create Listing'}
          </Button>
        </div>
      </form>
    </Form>
  );
}