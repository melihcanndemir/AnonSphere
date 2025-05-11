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
      return <Smile className="h-5 w-5 text-green-500" data-ai-hint="happy face" />;
    case 'negative':
      return <Frown className="h-5 w-5 text-red-500" data-ai-hint="sad face" />;
    case 'toxic':
      return <AlertTriangle className="h-5 w-5 text-orange-500" data-ai-hint="warning sign" />;
    default:
      return null;
  }
}

export function ConfessionCard({ confession }: ConfessionCardProps) {
  // State to manage timeAgo to prevent hydration mismatch
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(confession.timestamp), { addSuffix: true }));
  }, [confession.timestamp]);

  // Animation on mount
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Card className={`w-full shadow-lg break-inside-avoid mb-4 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>{timeAgo || 'Just now'}</span> {/* Fallback for initial render */}
          </div>
          <div className="flex items-center gap-1 p-1.5 bg-muted rounded-md">
            <SentimentIcon sentiment={confession.sentiment} />
            <span className="text-xs font-medium capitalize text-muted-foreground">{confession.sentiment}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{confession.text}</p>
        <EmojiReactions confessionId={confession.id} initialReactions={confession.reactions} />
      </CardContent>
    </Card>
  );
}
