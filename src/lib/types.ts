export type Sentiment = "positive" | "negative" | "toxic";

export const EMOJI_REACTIONS = ['👍', '❤️', '😂', '🤔', '😢', '😠'] as const;
export type Emoji = typeof EMOJI_REACTIONS[number];

export interface Confession {
  id: string;
  text: string;
  sentiment: Sentiment;
  timestamp: number; // Store as Unix timestamp
  reactions: Record<Emoji, number>;
}

// git
