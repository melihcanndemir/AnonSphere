'use client';

import { Button } from '@/components/ui/button';
import { useConfessionStore } from '@/lib/store';
import type { Sentiment } from '@/lib/types';
import { ListFilter, Smile, Frown, AlertTriangle, Sparkles } from 'lucide-react';

const sentimentOptions: { label: string; value: Sentiment | 'all'; icon: React.ElementType }[] = [
  { label: 'All', value: 'all', icon: Sparkles },
  { label: 'Positive', value: 'positive', icon: Smile },
  { label: 'Negative', value: 'negative', icon: Frown },
  { label: 'Toxic', value: 'toxic', icon: AlertTriangle },
];

export function SentimentFilter() {
  const { filter, setFilter } = useConfessionStore((state) => ({
    filter: state.filter,
    setFilter: state.setFilter,
  }));

  return (
    <div className="my-6 p-4 bg-card rounded-lg shadow">
      <div className="flex items-center mb-3">
        <ListFilter className="h-5 w-5 mr-2 text-muted-foreground" />
        <h3 className="text-md font-medium text-foreground">Filter by Sentiment</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {sentimentOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(option.value)}
            className="flex items-center gap-1.5"
          >
            <option.icon className={`h-4 w-4 ${filter === option.value ? '' : 'text-muted-foreground'}`} />
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
