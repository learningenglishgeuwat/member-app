'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/MemberAuthContext';

const TourGuideWidget = dynamic(() => import('./TourGuideWidget'), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+14px)] left-1/2 z-[55] inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-slate-500/60 bg-black/80">
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
const BOOTSTRAP_EVENT = 'geuwat:tourguide-bootstrap';
const RESET_EVENT = 'geuwat:tourguide-reset';

export default function TourGuideMount() {
  const pathname = usePathname();
  const { hasSession, loading } = useAuth();
  const [isWidgetBootstrapped, setIsWidgetBootstrapped] = useState(false);

  useEffect(() => {
    const onBootstrap = () => {
      setIsWidgetBootstrapped(true);
    };
    const onReset = () => {
      setIsWidgetBootstrapped(false);
    };

    window.addEventListener(BOOTSTRAP_EVENT, onBootstrap as EventListener);
    window.addEventListener(RESET_EVENT, onReset as EventListener);
    return () => {
      window.removeEventListener(BOOTSTRAP_EVENT, onBootstrap as EventListener);
      window.removeEventListener(RESET_EVENT, onReset as EventListener);
    };
  }, []);

  if (loading || !hasSession) return null;
  if (!pathname || PUBLIC_PATHS.has(pathname)) return null;
  if (pathname === SKILL_MENU_PATH || pathname === `${SKILL_MENU_PATH}/`) return null;
  
  // Hide TourGuide on dashboard (already in navbar for all screen sizes)
  if (pathname === DASHBOARD_PATH) {
    return null;
  }

  if (!isWidgetBootstrapped) return null;

  return <TourGuideWidget currentPath={pathname} />;
}
