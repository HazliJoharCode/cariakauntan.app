import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const endUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  companyName: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password.length >= 8, {
  message: "Password must be at least 8 characters",
  path: ["password"],
});

type EndUserValues = z.infer<typeof endUserSchema>;

export default function EndUserForm({ onSuccess }: { onSuccess: () => void }) {
  const { signUp } = useAuth();
  const [error, setError] = useState<string>();
  
  const form = useForm<EndUserValues>({
    resolver: zodResolver(endUserSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      companyName: '',
      phone: '',
    },
  });

  const onSubmit = async (values: EndUserValues) => {
    try {
      await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        companyName: values.companyName,
        phone: values.phone || '',
        isServiceProvider: false,
      });
      onSuccess();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
        
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    </Form>
  );
}