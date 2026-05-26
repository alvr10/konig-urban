import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from './footer/footer';

interface LegalLayoutProps {
  children: React.ReactNode;
}

export function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text-accent flex flex-col justify-between selection:bg-secondary selection:text-background">
      {/* Simple navigation header */}
      <header className="border-b border-secondary/20 bg-background/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm tracking-wider font-bold text-white hover:text-secondary transition-colors duration-300">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform rotate-180"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          [ VOLVER A LA TIENDA ]
        </Link>
        <Link href="/" className="relative h-10 w-24 block">
          <Image
            src="/svg/konigwhite.svg"
            alt="KONIG Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </header>

      {/* Main container */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-16 md:py-24">
        <div className="border border-secondary/20 bg-primary/10 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm rounded-none">
          {/* Futuristic corner borders */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-secondary"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-secondary"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-secondary"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-secondary"></div>
          
          {children}
        </div>
      </main>

      <Footer isLoading={false} />
    </div>
  );
}
