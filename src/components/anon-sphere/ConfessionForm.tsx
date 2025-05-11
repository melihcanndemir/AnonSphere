'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useFormState, useFormStatus } from 'react-dom';
import { z } from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitConfessionAction, type SubmitConfessionResult } from '@/lib/actions';
import { Send } from 'lucide-react';

const ConfessionFormSchema = z.object({
  text: z.string().min(5, {
    message: 'Your confession must be at least 5 characters.',
  }).max(1000, {
    message: 'Your confession must not be longer than 1000 characters.',
  }),
});

type ConfessionFormValues = z.infer<typeof ConfessionFormSchema>;

const initialState: SubmitConfessionResult = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Submit Anonymously
        </>
      )}
    </Button>
  );
}

export function ConfessionForm() {
  const { toast } = useToast();
  
  const form = useForm<ConfessionFormValues>({
    resolver: zodResolver(ConfessionFormSchema),
    defaultValues: {
      text: '',
    },
  });

  const [state, formAction] = useFormState(submitConfessionAction, initialState);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        form.reset(); 
      } else {
        toast({
          title: 'Error',
          description: state.message || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    }
    if (state?.errors?.text && Array.isArray(state.errors.text)) {
      form.setError('text', { message: state.errors.text.join(', ') });
    }
  }, [state, toast, form]);


  return (
    <Form {...form}>
      <form
        action={formAction}
        className="space-y-6 bg-card p-6 rounded-lg shadow-md"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Share Your Secret</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your anonymous confession here... be respectful!"
                  className="resize-none min-h-[120px] text-base"
                  {...field}
                  aria-invalid={!!form.formState.errors.text}
                  aria-describedby="text-error"
                />
              </FormControl>
              <FormMessage id="text-error" />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
