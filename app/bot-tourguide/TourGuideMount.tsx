'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/MemberAuthContext';

const TourGuideWidget = dynamic(() => import('./TourGuideWidget'), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+14px)] left-1/2 z-[55] inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-slate-500/60 bg-slate-950/80">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300/80 border-t-transparent" />
    </div>
  ),
});

const PUBLIC_PATHS = new Set([
  '/login',
  '/device-pairing',
  '/forgot-password',
  '/reset-password',
]);

export default function TourGuideMount() {
  const pathname = usePathname();
  const { hasSession, loading } = useAuth();
  const [isWidgetBootstrapped, setIsWidgetBootstrapped] = useState(false);

  if (loading || !hasSession) return null;
  if (!pathname || PUBLIC_PATHS.has(pathname)) return null;

  if (!isWidgetBootstrapped) {
    return (
      <button
        type="button"
        aria-label="Buka Tour Guide"
        className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+14px)] left-1/2 z-[55] inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-slate-500/60 bg-slate-950/80 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        onClick={() => setIsWidgetBootstrapped(true)}
      >
        <Image
          src="/Kepala.png"
          alt="Tour Guide"
          width={48}
          height={48}
          className="h-11 w-11 rounded-full object-cover opacity-85 grayscale saturate-50 brightness-90"
        />
      </button>
    );
  }

  return <TourGuideWidget currentPath={pathname} />;
}
