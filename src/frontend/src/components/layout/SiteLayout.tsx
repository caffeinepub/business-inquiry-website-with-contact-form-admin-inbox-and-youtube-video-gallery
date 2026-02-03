import { Outlet } from '@tanstack/react-router';
import TopNav from './TopNav';
import { SiCaffeine } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/logo.dim_512x192.png" 
                alt="RTRKidd Logo" 
                className="h-8 w-auto"
              />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              © 2026. Built with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> using{' '}
              <a 
                href="https://caffeine.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
              >
                <SiCaffeine className="h-3.5 w-3.5" />
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
