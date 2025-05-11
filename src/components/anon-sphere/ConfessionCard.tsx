'use client'; // Make this a client component to use EmojiReactions which is client

import type { Confession } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Smile, Frown, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EmojiReactions } from './EmojiReactions';
import { useEffect, useState } from 'react';

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
      return <AlertTriangle className="h-5 w-5 text-orange-500" data-ai-hint="warning sign" />; // Kept orange for distinction
    default:
      return null;
  }
}

export function ConfessionCard({ confession }: ConfessionCardProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(confession.timestamp), { addSuffix: true }));
  }, [confession.timestamp]);

  return (
    <Card className="w-full shadow-lg break-inside-avoid mb-4"> {/* Removed animation classes and isVisible logic for diagnosis */}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>{timeAgo || 'Just now'}</span>
          </div>
          <div className="flex items-center gap-1 p-1.5 bg-muted rounded-md">
            <SentimentIcon sentiment={confession.sentiment} />
            <span className="text-xs font-medium capitalize text-muted-foreground">{confession.sentiment}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Removed text-foreground to inherit from card context */}
        <p className="leading-relaxed whitespace-pre-wrap">{confession.text}</p>
        <EmojiReactions confessionId={confession.id} initialReactions={confession.reactions} />
      </CardContent>
    </Card>
  );
}
