'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Gauge, ChevronDown } from 'lucide-react';
import { getGlobalPlaybackSpeed, setGlobalPlaybackSpeed } from '@/lib/tts/speech';

interface ControlCenterProps {
  children: React.ReactNode;
  title?: string;
  defaultOpen?: boolean;
}

// Section navigator type + context — exported so other components can consume it
export type SectionNavigator = { openSection: (id: string, path?: string) => void };
export const SectionNavigatorContext = createContext<SectionNavigator | null>(null);

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function ControlCenter({
  children,
  title = 'CONTROL CENTER',
  defaultOpen = false,
}: ControlCenterProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [speed, setSpeed] = useState<number>(1);
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setSpeed(getGlobalPlaybackSpeed());
  }, []);

  const handleSpeedChange = (val: number) => {
    setSpeed(val);
    setGlobalPlaybackSpeed(val);
  };

  // Provide openSection to children
  const openSection = (id: string, path?: string) => {
    setIsOpen(true)
    try {
      const base = (path ?? pathname) || '/'
      const target = `${base.replace(/\/$/, '')}#${id}`
      router.push(target)
    } catch (err) {
      // ignore navigation errors
      console.error('openSection failed', err)
    }

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('at-lesson-jump-to-section', {
          detail: { sectionId: id },
        }))
      } catch (err) {
        // ignore event dispatch failures
      }
    }
  }

  return (
    <SectionNavigatorContext.Provider value={{ openSection }}>
      <div
      className={cx(
        'fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 ease-in-out flex shadow-[0_0_30px_rgba(0,0,0,0.8)]',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Toggle Tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-[#101314] border border-r-0 border-white/10 p-2 sm:p-3 rounded-l-xl text-cyan-400 hover:text-cyan-300 transition-colors shadow-[-4px_0_10px_rgba(0,0,0,0.3)]"
        aria-label={isOpen ? 'Close Control Center' : 'Open Control Center'}
      >
        {isOpen ? <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>

      {/* Panel Content */}
      <div className="bg-[#101314] border border-r-0 border-white/10 rounded-l-2xl p-3 sm:p-8 min-w-[200px] sm:min-w-[320px] max-h-[80vh] overflow-y-auto">
        <h3 className="text-white text-center font-mono text-[10px] sm:text-sm tracking-widest font-bold mb-3 sm:mb-6 uppercase">
          {title}
        </h3>
        
        <div className="flex flex-col gap-3 sm:gap-6">
          {/* SPEED CONTROL */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-6 border-b border-white/10">
            <span className="font-mono text-[9px] sm:text-xs tracking-widest text-white/55">SPEED</span>
            <div className="flex items-center gap-1 sm:gap-2 border border-white/10 rounded-lg px-1.5 py-1 sm:px-3 sm:py-2 bg-[#1a1f24] hover:border-cyan-500/30 transition-colors">
              <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/45" />
              <select
                title="Playback Speed"
                className="bg-transparent border-none text-white font-mono text-xs sm:text-sm p-0 focus:ring-0 outline-none cursor-pointer appearance-none pr-6 sm:pr-8"
                value={speed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
              >
                <option value={0.5} className="bg-black">0.5x</option>
                <option value={0.8} className="bg-black">0.8x</option>
                <option value={1} className="bg-black">1.0x</option>
                <option value={1.2} className="bg-black">1.2x</option>
                <option value={1.5} className="bg-black">1.5x</option>
              </select>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 -ml-5 sm:-ml-7 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {children}
          </div>
        </div>
      </div>
    </div>
    </SectionNavigatorContext.Provider>
  );
}

// Hook for consumers to access navigator (may return null if used outside provider)
export function useSectionNavigator() {
  return useContext(SectionNavigatorContext);
}

export default ControlCenter;
