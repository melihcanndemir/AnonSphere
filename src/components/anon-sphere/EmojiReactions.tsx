'use client';

import type { Confession, Emoji } from '@/lib/types';
import { EMOJI_REACTIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addReactionAction } from '@/lib/actions';
import { useConfessionStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useState, useTransition, useEffect } from 'react';

interface EmojiReactionsProps {
  confessionId: string;
  initialReactions: Record<Emoji, number>;
}

export function EmojiReactions({ confessionId, initialReactions }: EmojiReactionsProps) {
  const { toast } = useToast();
  const updateStoreReaction = useConfessionStore((state) => state.updateConfessionReaction);
  const [isPending, startTransition] = useTransition();
  const [optimisticReactions, setOptimisticReactions] = useState(initialReactions);

  useEffect(() => {
    setOptimisticReactions(initialReactions);
  }, [initialReactions]);

  const handleReactionClick = (emoji: Emoji) => {
    setOptimisticReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
    updateStoreReaction(confessionId, emoji);

    startTransition(async () => {
      const result = await addReactionAction(confessionId, emoji);
      if (!result.success) {
        toast({
          title: 'Error',
          description: result.message || 'Failed to add reaction.',
          variant: 'destructive',
        });
        setOptimisticReactions(prev => ({ // Revert optimistic update more accurately
          ...prev,
          [emoji]: Math.max(0, (prev[emoji] || 0) -1), // Revert this specific emoji
        }));
        // The store update will be corrected by revalidatePath eventually
      }
    });
  };

  return (
    <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2 items-center">
      {EMOJI_REACTIONS.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          size="sm"
          onClick={() => handleReactionClick(emoji)}
          disabled={isPending}
          className="px-2 py-1 group"
          aria-label={`React with ${emoji}`}
        >
          <span className="text-lg transition-transform group-hover:scale-125">{emoji}</span>
          <span className={cn(
            "ml-1.5 text-xs font-medium",
            (optimisticReactions[emoji] ?? 0) > 0 ? "text-primary" : "text-muted-foreground"
          )}>
            {optimisticReactions[emoji] || 0}
          </span>
        </Button>
      ))}
    </div>
  );
}

// git
