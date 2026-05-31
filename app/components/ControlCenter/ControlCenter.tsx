'use client';

import React, { useState, createContext, useContext } from 'react';
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
  const [speed, setSpeed] = useState<number>(() => getGlobalPlaybackSpeed());
  const router = useRouter()
  const pathname = usePathname()

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
      } catch {
        // ignore event dispatch failures
      }
    }
  }

  return (
    <SectionNavigatorContext.Provider value={{ openSection }}>
      <div
      className={cx(
        'fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 ease-in-out flex shadow-[0_0_20px_rgba(0,0,0,0.8)]',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Toggle Tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-[#101314] border border-r-0 border-white/10 p-1 sm:p-1.5 rounded-l-md text-cyan-400 hover:text-cyan-300 transition-colors shadow-[-4px_0_10px_rgba(0,0,0,0.3)]"
        aria-label={isOpen ? 'Close Control Center' : 'Open Control Center'}
      >
        {isOpen ? <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
      </button>

      {/* Panel Content */}
      <div className="bg-[#101314] border border-r-0 border-white/10 rounded-l-lg p-1.5 sm:p-3 min-w-[120px] sm:min-w-[165px] max-h-[80vh] overflow-y-auto">
        <h3 className="text-white text-center font-mono text-[8px] sm:text-[10px] tracking-widest font-bold mb-1.5 sm:mb-2.5 uppercase">
          {title}
        </h3>
        
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* SPEED CONTROL */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 pb-1.5 sm:pb-2.5 border-b border-white/10">
            <span className="font-mono text-[7px] sm:text-[8.5px] tracking-wider text-white/45">SPEED</span>
            <div className="flex items-center gap-0.5 sm:gap-1 border border-white/10 rounded px-0.5 py-0 sm:px-1 sm:py-0.5 bg-[#1a1f24] hover:border-cyan-500/30 transition-colors">
              <Gauge className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/45" />
              <select
                title="Playback Speed"
                className="bg-transparent border-none text-white font-mono text-[7.5px] sm:text-[8.5px] p-0 focus:ring-0 outline-none cursor-pointer appearance-none pr-3.5 sm:pr-4.5"
                value={speed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
              >
                <option value={0.5} className="bg-black">0.5x</option>
                <option value={0.8} className="bg-black">0.8x</option>
                <option value={1} className="bg-black">1.0x</option>
                <option value={1.2} className="bg-black">1.2x</option>
                <option value={1.5} className="bg-black">1.5x</option>
              </select>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/40 -ml-2.5 sm:-ml-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2">
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
