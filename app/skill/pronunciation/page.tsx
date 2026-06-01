'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LOCKED_TOPIC_IDS, TOPIC_ROUTES, TOPICS } from './constants';
import './pronunciation.css';
import Background from './components/Background';
import TopicCard from './components/TopicCard';
import BackButton from '../components/BackButton';
import Sidebar from '../components/skillSidebar/SkillSidebar';
import { Info, ChevronLeft, ChevronRight, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TopicDetailTheme = {
  detailBorderLeft: string;
  detailBorder: string;
  hintBg: string;
  hintBorder: string;
  hintIcon: string;
  hintKicker: string;
};

// NOTE: Keep these as explicit strings so Tailwind can pick them up.
// "phonetic" intentionally falls back to fuchsia (ignore per request).
const TOPIC_DETAIL_THEMES: Record<string, TopicDetailTheme> = {
  alphabet: {
    detailBorderLeft: 'border-l-blue-700',
    detailBorder: 'border-blue-700/30',
    hintBg: 'bg-blue-950/40',
    hintBorder: 'border-blue-700/30',
    hintIcon: 'text-blue-500',
    hintKicker: 'text-blue-400',
  },
  stressing: {
    detailBorderLeft: 'border-l-orange-500',
    detailBorder: 'border-orange-500/30',
    hintBg: 'bg-orange-900/30',
    hintBorder: 'border-orange-500/30',
    hintIcon: 'text-orange-400',
    hintKicker: 'text-orange-300',
  },
  intonation: {
    detailBorderLeft: 'border-l-pink-500',
    detailBorder: 'border-pink-500/30',
    hintBg: 'bg-pink-900/30',
    hintBorder: 'border-pink-500/30',
    hintIcon: 'text-pink-400',
    hintKicker: 'text-pink-300',
  },
  'final-sound': {
    detailBorderLeft: 'border-l-lime-400',
    detailBorder: 'border-lime-400/30',
    hintBg: 'bg-lime-950/40',
    hintBorder: 'border-lime-400/30',
    hintIcon: 'text-lime-400',
    hintKicker: 'text-lime-300',
  },
  'american-t': {
    detailBorderLeft: 'border-l-[#0b4aa6]',
    detailBorder: 'border-[#0b4aa6]/30',
    hintBg: 'bg-[#002868]/25',
    hintBorder: 'border-[#0b4aa6]/30',
    hintIcon: 'text-[#6fb7ff]',
    hintKicker: 'text-[#9bd2ff]',
  },
  'linking-word': {
    detailBorderLeft: 'border-l-cyan-500',
    detailBorder: 'border-cyan-500/30',
    hintBg: 'bg-cyan-950/40',
    hintBorder: 'border-cyan-500/30',
    hintIcon: 'text-cyan-400',
    hintKicker: 'text-cyan-300',
  },
  contraction: {
    detailBorderLeft: 'border-l-teal-400',
    detailBorder: 'border-teal-400/30',
    hintBg: 'bg-teal-950/35',
    hintBorder: 'border-teal-400/30',
    hintIcon: 'text-teal-300',
    hintKicker: 'text-teal-200',
  },
  text: {
    detailBorderLeft: 'border-l-slate-500',
    detailBorder: 'border-slate-500/30',
    hintBg: 'bg-slate-900/50',
    hintBorder: 'border-slate-500/30',
    hintIcon: 'text-slate-400',
    hintKicker: 'text-slate-300',
  },
  'reading-text': {
    detailBorderLeft: 'border-l-[#1E293B]',
    detailBorder: 'border-slate-700/30',
    hintBg: 'bg-[#0f172a]/60',
    hintBorder: 'border-slate-700/30',
    hintIcon: 'text-slate-400',
    hintKicker: 'text-slate-300',
  },
  'tongue-twister': {
    detailBorderLeft: 'border-l-fuchsia-500',
    detailBorder: 'border-fuchsia-500/30',
    hintBg: 'bg-fuchsia-950/40',
    hintBorder: 'border-fuchsia-500/30',
    hintIcon: 'text-fuchsia-400',
    hintKicker: 'text-fuchsia-300',
  },
};

const DEFAULT_DETAIL_THEME: TopicDetailTheme = {
  detailBorderLeft: 'border-l-purple-500',
  detailBorder: 'border-purple-500/30',
  hintBg: 'bg-purple-950/40',
  hintBorder: 'border-purple-500/30',
  hintIcon: 'text-purple-400',
  hintKicker: 'text-purple-300',
};

const Page: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  
  // Ref for carousel container to handle scrolling
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Touch/swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const selectedTopic = TOPICS[selectedIndex];
  const detailTheme = TOPIC_DETAIL_THEMES[selectedTopic?.id] ?? DEFAULT_DETAIL_THEME;
  
  // Check if selected topic is locked - useMemo to prevent re-renders
  const lockedTopics = useMemo(() => LOCKED_TOPIC_IDS, []);
  const isTopicLocked = lockedTopics.includes(selectedTopic.id);

  // Navigation function to open topic-specific pages
  const navigateToTopic = useCallback((topicId: string): void => {
    const route = TOPIC_ROUTES[topicId];
    if (route) {
      router.push(route);
    }
  }, [router]);

  const handleNav = useCallback((direction: 'left' | 'right') => {
    setSelectedIndex(prev => {
      let newIndex = prev;
      
      // Circular navigation - wrap around from end to start and vice versa
      if (direction === 'left') {
        newIndex = prev === 0 ? TOPICS.length - 1 : prev - 1;
      } else {
        newIndex = prev === TOPICS.length - 1 ? 0 : prev + 1;
      }
      
      // Skip locked topics during navigation with circular logic
      const newTopic = TOPICS[newIndex];
      if (lockedTopics.includes(newTopic.id)) {
        // Try next available topic in circular manner
        let attempts = 0;
        const maxAttempts = TOPICS.length;
        
        while (attempts < maxAttempts) {
          if (direction === 'left') {
            newIndex = newIndex === 0 ? TOPICS.length - 1 : newIndex - 1;
          } else {
            newIndex = newIndex === TOPICS.length - 1 ? 0 : newIndex + 1;
          }
          
          if (!lockedTopics.includes(TOPICS[newIndex].id)) {
            return newIndex;
          }
          
          attempts++;
        }
        
        // If all topics are locked (shouldn't happen), stay at current
        return prev;
      }
      
      return newIndex;
    });
  }, [lockedTopics]);

  // Calculate circular offset for carousel positioning (like game-links)
  const getCircularOffset = useCallback((index: number, selectedIndex: number, total: number) => {
    let offset = index - selectedIndex;
    const half = Math.floor(total / 2);
    if (offset > half) offset -= total;
    if (offset < -half) offset += total;
    return offset;
  }, []);

  // Handle touch/swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const swipeThreshold = 50; // minimum distance for swipe
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left, go to next (right)
        handleNav('right');
      } else {
        // Swiped right, go to previous (left)
        handleNav('left');
      }
    }

    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [handleNav]);

  const handleStartLearning = useCallback(() => {
    // Check if topic is locked before navigation.
    if (!isTopicLocked) {
      navigateToTopic(selectedTopic.id);
    } else {
      // Optional: Show feedback for locked topics
      console.log(`Topic "${selectedTopic.title}" is locked`);
    }
  }, [isTopicLocked, selectedTopic.id, selectedTopic.title, navigateToTopic]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleNav('left');
      if (e.key === 'ArrowRight') handleNav('right');
      if (e.key === 'Enter') {
        // Prevent Enter key on locked topics.
        if (!isTopicLocked) {
          handleStartLearning();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNav, selectedTopic, isTopicLocked, handleStartLearning]);

  return (
    <div className="pronunciation-layout">
      <Background topic={selectedTopic} />
      
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <BackButton to="/skill" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      {/* Main Layout Grid */}
      <div className="relative min-h-full flex flex-col pt-4 md:pt-8 pb-6 md:pb-12">
        
        {/* Upper Content Area */}
        <div className="flex-shrink-0 flex flex-col px-3 sm:px-6 md:px-12 lg:px-24 justify-center max-w-4xl z-10 py-3 sm:py-4">
          
          <div className="h-6 sm:h-7 md:h-8 mb-2 sm:mb-3 md:mb-4 mt-1 md:mt-0" />

          <h1
            className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-lg mb-2 sm:mb-3 md:mb-4 leading-tight animate-slide-in"
            data-tour="pronunciation-title"
          >
            {selectedTopic.title}
          </h1>

          <div
            className={`glass-panel p-2.5 sm:p-4 md:p-5 rounded-xl max-w-full md:max-w-2xl border border-transparent border-l-4 ${detailTheme.detailBorderLeft} ${detailTheme.detailBorder} mb-3 sm:mb-4 md:mb-6 animate-fade-in-up`}
          >
             <p className="text-sm md:text-base text-slate-200 font-light leading-relaxed">
               {selectedTopic.description}
             </p>
          </div>

          {/* Learning Instructions Area */}
          <div
            className={`mt-2 sm:mt-3 md:mt-4 p-2.5 sm:p-4 ${detailTheme.hintBg} border ${detailTheme.hintBorder} rounded-lg max-w-full md:max-w-xl`}
          >
                <div className="flex items-start gap-2 sm:gap-3">
                    <Info className={`${detailTheme.hintIcon} flex-shrink-0 mt-0.5 sm:mt-1`} size={16} />
                    <div>
                        <h4 className={`font-display text-xs md:text-sm ${detailTheme.hintKicker} uppercase tracking-widest mb-1 font-medium`}>How to Start</h4>
                        <p className="text-sm md:text-base text-white/90 leading-relaxed">
                          {isTopicLocked 
                            ? `Modul ${selectedTopic.title} saat ini terkunci. Silakan selesaikan modul yang tersedia terlebih dahulu.`
                            : `Klik ikon CPU di bawah untuk membuka halaman latihan ${selectedTopic.title.toLowerCase()}`
                          }
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Navigation Arrows (Visible on mobile/tablet mainly) */}
        <button onClick={() => handleNav('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 md:p-4 hover:bg-white/10 rounded-full transition md:hidden text-white/50 hover:text-white">
            <ChevronLeft size={28} />
        </button>
        <button onClick={() => handleNav('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 md:p-4 hover:bg-white/10 rounded-full transition md:hidden text-white/50 hover:text-white">
            <ChevronRight size={28} />
        </button>

        {/* Bottom Carousel */}
        <div className="flex-shrink-0 relative z-20">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3 sm:mb-4 md:mb-8"></div>
            
            <div className="mx-auto w-full max-w-[1400px]">
              <div
                  ref={carouselRef}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="relative flex items-center justify-center gap-2 sm:gap-3 md:gap-6 px-3 sm:px-8 md:px-12 lg:px-16 pb-3 sm:pb-6 md:pb-8 lg:pb-12 h-[200px] sm:h-[220px] md:h-[240px] touch-pan-y"
                  data-tour="pronunciation-carousel"
              >
                  {TOPICS.map((topic, index) => {
                      const offset = getCircularOffset(index, selectedIndex, TOPICS.length);
                      const depth = Math.abs(offset);
                      const isActive = index === selectedIndex;
                      
                      return (
                          <TopicCard 
                              key={topic.id}
                              topic={topic}
                              isActive={isActive}
                              onClick={() => {
                                  setSelectedIndex(index);
                              }}
                              style={{
                                  '--offset': String(offset),
                                  '--depth': String(depth),
                                  '--scale': isActive ? '1' : String(Math.max(0.75, 1 - depth * 0.15)),
                                  '--z': String(isActive ? 40 : 20 - depth),
                                  '--op': isActive ? '1' : String(Math.max(0.4, 1 - depth * 0.25)),
                              } as React.CSSProperties}
                          />
                      );
                  })}
              </div>
            </div>
            
            <div className="absolute bottom-1 md:bottom-4 left-0 right-0 text-center text-xs md:text-sm text-slate-500 font-mono hidden sm:block">
                USE <span className="text-white bg-slate-800 px-1 rounded mx-1">&lt;-</span> <span className="text-white bg-slate-800 px-1 rounded mx-1">-&gt;</span> TO NAVIGATE • <span className="text-white bg-slate-800 px-1 rounded mx-1">ENTER</span> TO ENGAGE
            </div>
        </div>

        {/* Start Learning Button (below selected topic grid) */}
        <div className="mt-3 sm:mt-4 md:mt-6 flex justify-center">
            <button
              onClick={handleStartLearning}
              disabled={isTopicLocked}
              data-tour="pronunciation-execute-button"
              className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${selectedTopic.color} text-white rounded-lg font-semibold text-sm transition-all transform hover:scale-105 inline-flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.35)] overflow-hidden ${
                isTopicLocked 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'animate-[pulse_1s_ease-in-out_infinite]'
              }`}
           >
              <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-white/70" />
            </button>
        </div>
      </div>
      
      {/* Decorative overlaid elements - hidden on small screens to reduce clutter */}
      <div className="fixed bottom-12 right-12 w-32 h-32 border-r-2 border-b-2 border-cyan-500/30 rounded-br-3xl pointer-events-none hidden md:block"></div>

    </div>
  );
};

export default Page;
