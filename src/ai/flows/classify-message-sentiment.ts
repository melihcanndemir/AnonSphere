// use server'
'use server';

/**
 * @fileOverview Classifies the sentiment of an input message as positive, negative, or toxic.
 *
 * - classifyMessageSentiment - A function that classifies the sentiment of a message.
 * - ClassifyMessageSentimentInput - The input type for the classifyMessageSentiment function.
 * - ClassifyMessageSentimentOutput - The return type for the classifyMessageSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyMessageSentimentInputSchema = z.object({
  message: z.string().describe('The message to classify.'),
});
export type ClassifyMessageSentimentInput = z.infer<typeof ClassifyMessageSentimentInputSchema>;

const ClassifyMessageSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'toxic'])
    .describe('The sentiment of the message.'),
});
export type ClassifyMessageSentimentOutput = z.infer<typeof ClassifyMessageSentimentOutputSchema>;

export async function classifyMessageSentiment(
  input: ClassifyMessageSentimentInput
): Promise<ClassifyMessageSentimentOutput> {
  return classifyMessageSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyMessageSentimentPrompt',
  input: {schema: ClassifyMessageSentimentInputSchema},
  output: {schema: ClassifyMessageSentimentOutputSchema},
  prompt: `Classify the sentiment of the following message as positive, negative, or toxic.\n\nMessage: {{{message}}}`,
});

const classifyMessageSentimentFlow = ai.defineFlow(
  {
    name: 'classifyMessageSentimentFlow',
    inputSchema: ClassifyMessageSentimentInputSchema,
    outputSchema: ClassifyMessageSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
