'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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

const DASHBOARD_PATH = '/dashboard';
const SKILL_MENU_PATH = '/skill';
const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
const BOOTSTRAP_EVENT = 'geuwat:tourguide-bootstrap';

export default function TourGuideMount() {
  const pathname = usePathname();
  const { hasSession, loading } = useAuth();
  const [isWidgetBootstrapped, setIsWidgetBootstrapped] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsMobileViewport(event.matches);

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    }

    // Safari fallback
    mediaQueryList.addListener(onChange);
    return () => mediaQueryList.removeListener(onChange);
  }, []);

  useEffect(() => {
    const onBootstrap = () => {
      setIsWidgetBootstrapped(true);
    };

    window.addEventListener(BOOTSTRAP_EVENT, onBootstrap as EventListener);
    return () => window.removeEventListener(BOOTSTRAP_EVENT, onBootstrap as EventListener);
  }, []);

  if (loading || !hasSession) return null;
  if (!pathname || PUBLIC_PATHS.has(pathname)) return null;
  if (pathname === SKILL_MENU_PATH || pathname === `${SKILL_MENU_PATH}/`) return null;
  if (pathname === DASHBOARD_PATH && isMobileViewport) return null;

  if (!isWidgetBootstrapped) {
    return (
      <button
        type="button"
        aria-label="Buka Tour Guide"
        className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+14px)] left-1/2 z-[55] inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-slate-500/60 bg-slate-950/80 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        onClick={() => {
          setIsWidgetBootstrapped(true);
        }}
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
