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
  removeConfession: (confessionId: string) => void;
}

export const useConfessionStore = create<ConfessionState>((set, get) => ({
  confessions: [],
  filter: 'all',
  isInitialized: false,
  initializeConfessions: (initialConfessions) => {
    if (!get().isInitialized) {
      // Sort initial confessions by timestamp descending on initialization
      const sortedInitialConfessions = [...initialConfessions].sort((a,b) => b.timestamp - a.timestamp);
      set({ confessions: sortedInitialConfessions, isInitialized: true });
    }
  },
  addConfession: (confession) =>
    set((state) => ({
      // Ensure new confessions are added and the list remains sorted
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
  removeConfession: (confessionId) =>
    set((state) => ({
      confessions: state.confessions.filter((c) => c.id !== confessionId),
    })),
}));

// git
