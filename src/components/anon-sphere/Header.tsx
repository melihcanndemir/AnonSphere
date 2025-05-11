import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { MessageSquareHeart } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 md:px-8 border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <MessageSquareHeart className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            AnonSphere
          </h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
