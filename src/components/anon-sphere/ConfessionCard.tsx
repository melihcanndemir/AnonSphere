'use client';

import type { Confession } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Smile, Frown, AlertTriangle, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EmojiReactions } from './EmojiReactions';
import { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteConfessionAction } from '@/lib/actions';
import { useConfessionStore } from '@/lib/store';

interface ConfessionCardProps {
  confession: Confession;
}

function SentimentIcon({ sentiment }: { sentiment: Confession['sentiment'] }) {
  switch (sentiment) {
    case 'positive':
      return <Smile className="h-5 w-5 text-primary" data-ai-hint="happy face" />;
    case 'negative':
      return <Frown className="h-5 w-5 text-destructive" data-ai-hint="sad face" />;
    case 'toxic':
      return <AlertTriangle className="h-5 w-5 text-orange-500" data-ai-hint="warning sign" />;
    default:
      return null;
  }
}

export function ConfessionCard({ confession }: ConfessionCardProps) {
  const [timeAgo, setTimeAgo] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const removeConfessionFromStore = useConfessionStore((state) => state.removeConfession);

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(confession.timestamp), { addSuffix: true }));
  }, [confession.timestamp]);

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteConfessionAction(confession.id);
      if (result.success) {
        toast({
          title: 'Deleted!',
          description: result.message || 'Confession removed successfully.',
        });
        removeConfessionFromStore(confession.id); // Optimistic update or sync store
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete confession.',
          variant: 'destructive',
        });
      }
      setIsAlertOpen(false);
    });
  };

  return (
    <Card className="w-full shadow-lg break-inside-avoid mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start"> {/* items-start to align delete button properly if it wraps */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>{timeAgo || 'Just now'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-1 p-1.5 bg-muted rounded-md">
              <SentimentIcon sentiment={confession.sentiment} />
              <span className="text-xs font-medium capitalize text-muted-foreground">{confession.sentiment}</span>
            </div>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete confession</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this confession.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                    {isPending ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed whitespace-pre-wrap">{confession.text}</p>
        <EmojiReactions confessionId={confession.id} initialReactions={confession.reactions} />
      </CardContent>
    </Card>
  );
}

// git
