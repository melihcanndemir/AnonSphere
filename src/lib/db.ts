import type { Confession, Sentiment, Emoji } from '@/lib/types';
import crypto from 'crypto';

// In-memory store for demo purposes
let confessions: Confession[] = [
  {
    id: crypto.randomUUID(),
    text: 'I secretly love pineapple on pizza!',
    sentiment: 'positive',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    reactions: { '👍': 5, '❤️': 2, '😂': 10, '🤔': 1, '😢': 0, '😠': 1 },
  },
  {
    id: crypto.randomUUID(),
    text: 'Sometimes I feel like nobody understands me.',
    sentiment: 'negative',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    reactions: { '👍': 1, '❤️': 3, '😂': 0, '🤔': 2, '😢': 6, '😠': 0 },
  },
  {
    id: crypto.randomUUID(),
    text: 'This is a placeholder for a toxic message that would be filtered by default.',
    sentiment: 'toxic',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    reactions: { '👍': 0, '❤️': 0, '😂': 0, '🤔': 1, '😢': 2, '😠': 5 },
  }
];

export async function getAllConfessions(): Promise<Confession[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...confessions].sort((a, b) => b.timestamp - a.timestamp);
}

export async function addConfession(text: string, sentiment: Sentiment): Promise<Confession> {
  const newConfession: Confession = {
    id: crypto.randomUUID(),
    text,
    sentiment,
    timestamp: Date.now(),
    reactions: { '👍': 0, '❤️': 0, '😂': 0, '🤔': 0, '😢': 0, '😠': 0 },
  };
  confessions.unshift(newConfession); // Add to the beginning for chronological order
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  return newConfession;
}

export async function getConfessionById(id: string): Promise<Confession | undefined> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 20));
  return confessions.find(c => c.id === id);
}

export async function addReactionToConfession(id: string, emoji: Emoji): Promise<Confession | undefined> {
  const confession = confessions.find(c => c.id === id);
  if (confession) {
    confession.reactions[emoji] = (confession.reactions[emoji] || 0) + 1;
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 20));
    return { ...confession }; // Return a new object to trigger updates
  }
  return undefined;
}
