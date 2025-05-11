'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addConfession as dbAddConfession, addReactionToConfession as dbAddReaction } from '@/lib/db';
import { classifyMessageSentiment } from '@/ai/flows/classify-message-sentiment';
import type { Emoji, Sentiment } from '@/lib/types';

const ConfessionSchema = z.object({
  text: z.string().min(5, 'Confession must be at least 5 characters long.').max(1000, 'Confession must be at most 1000 characters long.'),
});

export interface SubmitConfessionResult {
  success: boolean;
  message?: string;
  confessionId?: string;
  errors?: { text?: string[] };
}

export async function submitConfessionAction(prevState: SubmitConfessionResult | undefined, formData: FormData): Promise<SubmitConfessionResult> {
  const validatedFields = ConfessionSchema.safeParse({
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed."
    };
  }

  const { text } = validatedFields.data;

  try {
    const sentimentResult = await classifyMessageSentiment({ message: text });
    const sentiment = sentimentResult.sentiment as Sentiment; // Ensure type compatibility

    const newConfession = await dbAddConfession(text, sentiment);
    revalidatePath('/'); // Revalidate the page to show the new confession
    return { success: true, message: 'Confession submitted!', confessionId: newConfession.id };
  } catch (error) {
    console.error('Error submitting confession:', error);
    return { success: false, message: 'Failed to submit confession. Please try again.' };
  }
}


export interface AddReactionResult {
  success: boolean;
  message?: string;
}

export async function addReactionAction(confessionId: string, emoji: Emoji): Promise<AddReactionResult> {
  if (!confessionId || !emoji) {
    return { success: false, message: 'Invalid input for reaction.' };
  }
  try {
    const updatedConfession = await dbAddReaction(confessionId, emoji);
    if (!updatedConfession) {
      return { success: false, message: 'Confession not found.' };
    }
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error adding reaction:', error);
    return { success: false, message: 'Failed to add reaction.' };
  }
}
