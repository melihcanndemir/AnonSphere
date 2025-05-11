import { Header } from '@/components/anon-sphere/Header';
import { ConfessionForm } from '@/components/anon-sphere/ConfessionForm';
import { SentimentFilter } from '@/components/anon-sphere/SentimentFilter';
import { ConfessionList } from '@/components/anon-sphere/ConfessionList';
import { getAllConfessions } from '@/lib/db';
import type { Confession } from '@/lib/types';

export default async function AnonSpherePage() {
  const initialConfessions: Confession[] = await getAllConfessions();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Whisper Your Thoughts</h2>
          <p className="text-muted-foreground text-center mb-6">Share your anonymous confessions, secrets, or thoughts with the world. Your identity remains a secret.</p>
          <ConfessionForm />
        </div>
        
        <div className="max-w-5xl mx-auto"> {/* Increased max-width for confession list area */}
          <SentimentFilter />
          <ConfessionList initialConfessions={initialConfessions} />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} AnonSphere. All secrets are safe here.
      </footer>
    </div>
  );
}

export const dynamic = 'force-dynamic';

// git
