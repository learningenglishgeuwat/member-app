'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TOPICS } from './constants';
import './pronunciation.css';
import '../../styles/scrollbar.css';
import Background from './components/Background';
import TopicCard from './components/TopicCard';
import BackButton from '../components/BackButton';
import Sidebar from '../components/skillSidebar/SkillSidebar';
import { Info, ChevronLeft, ChevronRight, Cpu } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  
  // Ref for carousel container to handle scrolling
  const carouselRef = useRef<HTMLDivElement>(null);

  const selectedTopic = TOPICS[selectedIndex];
  
  // Check if selected topic is locked - useMemo to prevent re-renders
  const lockedTopics = useMemo(() => ['stressing', 'final-sound', 'american-t', 'connected'], []);
  const isTopicLocked = lockedTopics.includes(selectedTopic.id);

  // Navigation function to open topic-specific pages
  const navigateToTopic = useCallback((topicId: string): void => {
    // Map topic IDs to their corresponding pages
    const topicRoutes: Record<string, string> = {
      'alphabet': '/skill/pronunciation/alphabet',
      'phonetic': '/skill/pronunciation/phoneticSymbols',
      'stressing': '/skill/pronunciation/stressing',
      'final-sound': '/skill/pronunciation/final-sound',
      'american-t': '/skill/pronunciation/american-t',
      'connected': '/skill/pronunciation/connected-speech'
    };
    
    const route = topicRoutes[topicId];
    if (route) {
      router.push(route);
    }
  }, [router]);

  const handleNav = useCallback((direction: 'left' | 'right') => {
    setSelectedIndex(prev => {
      let newIndex = prev;
      
      if (direction === 'left') {
        newIndex = prev === 0 ? prev : prev - 1;
      } else {
        newIndex = prev === TOPICS.length - 1 ? prev : prev + 1;
      }
      
      // 🔥 CRITICAL FIX: Skip locked topics during navigation
      const newTopic = TOPICS[newIndex];
      if (lockedTopics.includes(newTopic.id)) {
        // Try next available topic
        if (direction === 'left') {
          // Find previous unlocked topic
          for (let i = newIndex - 1; i >= 0; i--) {
            if (!lockedTopics.includes(TOPICS[i].id)) {
              return i;
            }
          }
        } else {
          // Find next unlocked topic
          for (let i = newIndex + 1; i < TOPICS.length; i++) {
            if (!lockedTopics.includes(TOPICS[i].id)) {
              return i;
            }
          }
        }
        // If no unlocked topic found, stay at current
        return prev;
      }
      
      return newIndex;
    });
  }, [lockedTopics]);

  // Scroll active item into view
  useEffect(() => {
    if (carouselRef.current) {
        // Adjust scroll centering based on assumed card widths + gaps
        // Mobile active card ~224px (w-56)
        // Desktop active card ~256px (w-64)
        const nodes = carouselRef.current.children;
        if (nodes[selectedIndex]) {
            (nodes[selectedIndex] as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }
  }, [selectedIndex]);

  const handleStartLearning = useCallback(() => {
    // 🔥 CRITICAL FIX: Check if topic is locked before navigation
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
        // 🔥 CRITICAL FIX: Prevent Enter key on locked topics
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

          <h1 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-lg mb-2 sm:mb-3 md:mb-4 leading-none animate-slide-in">
            {selectedTopic.title}
          </h1>

          <div className="glass-panel p-2.5 sm:p-4 md:p-5 rounded-xl max-w-full md:max-w-2xl border-l-4 border-fuchsia-500 mb-3 sm:mb-4 md:mb-6 animate-fade-in-up">
             <p className="text-[11px] sm:text-sm md:text-base text-slate-200 font-light leading-relaxed">
               {selectedTopic.description}
             </p>
          </div>

          {/* Learning Instructions Area */}
          <div className="mt-2 sm:mt-3 md:mt-4 p-2.5 sm:p-4 bg-fuchsia-900/40 border border-fuchsia-500/30 rounded-lg max-w-full md:max-w-xl">
                <div className="flex items-start gap-2 sm:gap-3">
                    <Info className="text-fuchsia-400 flex-shrink-0 mt-0.5 sm:mt-1" size={16} />
                    <div>
                        <h4 className="font-display text-[8px] sm:text-[10px] md:text-xs text-fuchsia-300 uppercase tracking-widest mb-1">GEUWAT Protocol</h4>
                        <p className="text-[11px] sm:text-sm md:text-base text-white/90">
                          {isTopicLocked 
                            ? `${selectedTopic.title} module is currently locked. Please complete available modules first.`
                            : `Activate ${selectedTopic.title.toLowerCase()} training module to begin GEUWAT enhancement sequence`
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
            
            <div 
                ref={carouselRef}
                className="flex items-center justify-start gap-2 sm:gap-3 md:gap-6 px-3 sm:px-8 md:px-12 lg:px-16 overflow-x-auto no-scrollbar-mobile md:custom-scrollbar pb-3 sm:pb-6 md:pb-8 lg:pb-12 snap-x snap-mandatory"
                style={{ scrollBehavior: 'smooth', scrollPaddingLeft: '50vw', scrollPaddingRight: '50vw' }}
            >
                {TOPICS.map((topic, index) => (
                    <TopicCard 
                        key={topic.id}
                        topic={topic}
                        isActive={index === selectedIndex}
                        onClick={() => {
                            setSelectedIndex(index);
                        }}
                    />
                ))}
            </div>
            
            <div className="absolute bottom-1 md:bottom-4 left-0 right-0 text-center text-[10px] md:text-xs text-slate-500 font-mono hidden sm:block">
                USE <span className="text-white bg-slate-800 px-1 rounded mx-1">←</span> <span className="text-white bg-slate-800 px-1 rounded mx-1">→</span> TO NAVIGATE • <span className="text-white bg-slate-800 px-1 rounded mx-1">ENTER</span> TO ENGAGE
            </div>
        </div>

        {/* Start Learning Button (below selected topic grid) */}
        <div className="mt-3 sm:mt-4 md:mt-6 flex justify-center">
            <button 
              onClick={handleStartLearning}
              disabled={isTopicLocked}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${selectedTopic.color} text-white rounded-lg font-semibold text-xs sm:text-sm transition-all transform hover:scale-105 inline-flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.35)] overflow-hidden ${
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
      <div className="fixed top-24 left-8 w-2 h-24 bg-gradient-to-b from-fuchsia-500 to-transparent pointer-events-none hidden md:block"></div>

    </div>
  );
};

export default Page;
