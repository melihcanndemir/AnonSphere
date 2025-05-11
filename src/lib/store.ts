import { create } from 'zustand';
import type { Confession, Sentiment, Emoji } from '@/lib/types';

interface ConfessionState {
  confessions: Confession[];
  filter: Sentiment | 'all';
  isInitialized: boolean;
  initializeConfessions: (initialConfessions: Confession[]) => void;
  addConfession: (confession: Confession) => void;
  updateConfessionReaction: (confessionId: string, emoji: Emoji) => void;
  setFilter: (filter: Sentiment | 'all') => void;
}

export const useConfessionStore = create<ConfessionState>((set, get) => ({
  confessions: [],
  filter: 'all',
  isInitialized: false,
  initializeConfessions: (initialConfessions) => {
    if (!get().isInitialized) {
      set({ confessions: initialConfessions, isInitialized: true });
    }
  },
  addConfession: (confession) =>
    set((state) => ({
      confessions: [confession, ...state.confessions].sort((a,b) => b.timestamp - a.timestamp),
    })),
  updateConfessionReaction: (confessionId, emoji) =>
    set((state) => ({
      confessions: state.confessions.map((c) =>
        c.id === confessionId
          ? { ...c, reactions: { ...c.reactions, [emoji]: (c.reactions[emoji] || 0) + 1 } }
          : c
      ),
    })),
  setFilter: (filter) => set({ filter }),
}));
