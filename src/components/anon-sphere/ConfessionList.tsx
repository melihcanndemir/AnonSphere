'use client';

import { useEffect, useMemo } from 'react';
import { useConfessionStore } from '@/lib/store';
import type { Confession } from '@/lib/types';
import { ConfessionCard } from './ConfessionCard';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


interface ConfessionListProps {
  initialConfessions: Confession[];
}

export function ConfessionList({ initialConfessions }: ConfessionListProps) {
  const { confessions, filter, initializeConfessions, isInitialized } = useConfessionStore((state) => ({
    confessions: state.confessions,
    filter: state.filter,
    initializeConfessions: state.initializeConfessions,
    isInitialized: state.isInitialized,
  }));

  useEffect(() => {
    // Initialize store only once on the client with server-fetched data
    if (typeof window !== 'undefined' && !isInitialized) {
      initializeConfessions(initialConfessions);
    }
  }, [initialConfessions, initializeConfessions, isInitialized]);
  
  const filteredConfessions = useMemo(() => {
    if (!isInitialized) return []; 
    return confessions.filter((confession) => {
      if (filter === 'all') return true;
      return confession.sentiment === filter;
    });
  }, [confessions, filter, isInitialized]);

  // Handle loading state before Zustand store is initialized on client
  if (!isInitialized && typeof window !== 'undefined') {
    return (
      <div className="space-y-4 columns-1 md:columns-2 lg:columns-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }
  // If still not initialized (e.g. server render before client hydration), can show initial data directly or skeletons
  if (!isInitialized && typeof window === 'undefined') {
     const serverFiltered = initialConfessions.filter(c => filter === 'all' || c.sentiment === filter);
     if (serverFiltered.length === 0) {
       // Fallback content for SSR if no confessions match (though filter is client-side)
        return <NoConfessionsMessage filter={filter} isInitial={true} />;
     }
     return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {serverFiltered.map((confession, index) => (
             <ConfessionCard key={confession.id || index} confession={confession} />
          ))}
        </div>
     );
  }


  if (filteredConfessions.length === 0) {
    return <NoConfessionsMessage filter={filter} />;
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
      {filteredConfessions.map((confession, index) => (
         <ConfessionCard key={confession.id || index} confession={confession} />
      ))}
    </div>
  );
}

function NoConfessionsMessage({ filter, isInitial = false }: { filter: string, isInitial?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-card rounded-lg shadow">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">No Confessions Found</h3>
      <p className="text-muted-foreground">
        {isInitial && filter === 'all' ? "Be the first to share a secret!" : 
         filter === 'all'
          ? "No secrets shared yet. Be the first!"
          : `No confessions match the "${filter}" filter. Try a different one!`}
      </p>
    </div>
  );
}


function CardSkeleton() {
  return (
    <div className="bg-card p-4 rounded-lg shadow w-full break-inside-avoid mb-4">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-3" />
      <div className="flex gap-2 mt-3 pt-3 border-t">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-12" />
        ))}
      </div>
    </div>
  );
}
