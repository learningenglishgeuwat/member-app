'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ALPHABET_DATA } from './constants';
import { LetterCard } from './LetterCard';
import { Play, Square } from 'lucide-react'; 
import './alphabet.css';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import RecordingControlsButton from '../../components/RecordingControlsButton';

const AlphabetPage: React.FC = () => {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayingLetter, setCurrentPlayingLetter] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const isPlayingRef = useRef(false);

  // Handle hydration
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      const hasAlphabetProgress = !!currentProgress['alphabet'];
      // Use setTimeout to avoid cascading renders
      setTimeout(() => {
        setIsClient(true);
        setIsProgressSaved(hasAlphabetProgress);
      }, 0);
    }
  }, []);

  // Preload voices to ensure they are available when needed
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Cleanup
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const getPreferredVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.name === 'Google US English') || 
      voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
      voices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')) || // macOS high quality
      voices.find(v => v.lang === 'en-US' && v.name.includes('Zira')) || // Windows high quality
      voices.find(v => v.lang === 'en-US'); // Fallback
  };

  const handlePlayLetter = async (letter: string) => {
    if (isPlayingRef.current) return;
    
    try {
      setCurrentPlayingLetter(letter);
      // Simulate audio playback with text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Use preferred voice for better pronunciation
        const preferredVoice = getPreferredVoice();
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        speechSynthesis.cancel(); // Stop any previous speech
        speechSynthesis.speak(utterance);
        
        utterance.onend = () => {
          setCurrentPlayingLetter(null);
        };
      } else {
        // Fallback: simulate with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentPlayingLetter(null);
      }
    } catch (error) {
      console.error("Failed to play audio", error);
      setCurrentPlayingLetter(null);
    }
  };

  const handlePlayAll = async () => {
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setIsPlayingAll(false);
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setCurrentPlayingLetter(null);
      return;
    }

    isPlayingRef.current = true;
    setIsPlayingAll(true);
    
    for (const item of ALPHABET_DATA) {
      if (!isPlayingRef.current) break;

      setCurrentPlayingLetter(item.letter);
      try {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(item.letter);
          utterance.rate = 0.8;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          
          // Use preferred voice for better pronunciation
          const preferredVoice = getPreferredVoice();
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
          
          speechSynthesis.speak(utterance);
          
          await new Promise<void>((resolve) => {
            utterance.onend = () => resolve();
          });
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (isPlayingRef.current) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    isPlayingRef.current = false;
    setIsPlayingAll(false);
    setCurrentPlayingLetter(null);
  };

  const handleSaveProgress = async (percentage: number) => {
    setIsProgressSaved(true);
    
    // Save to localStorage for persistence (client-side only)
    if (isClient && typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      currentProgress['alphabet'] = percentage;
      localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));
      
      // Also update overall pronunciation progress
      const allProgress = Object.values(currentProgress) as number[];
      const averageProgress = allProgress.length > 0 
        ? Math.round(allProgress.reduce((acc: number, curr: number) => acc + curr, 0) / allProgress.length)
        : 0;
      
      const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
      dashboardProgress.pronunciation = averageProgress;
      localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
      
      console.log(`Alphabet progress saved: ${percentage}%`);
    }
  };

  const handleUnsaveProgress = async () => {
    setIsProgressSaved(false);
    
    // Remove from localStorage (client-side only)
    if (isClient && typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      delete currentProgress['alphabet'];
      localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));
      
      console.log('Alphabet progress removed');
    }
  };

  return (
    <div className="pronunciation-layout alphabet-container">
      {/* Back Button */}
      <div className="back-button-fixed">
        <BackButton to="/skill/pronunciation" />
      </div>

    
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl relative z-10">
        
        {/* Title Section */}
        <div className="alphabet-main-title text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4">
            <span className="highlight">English</span> Alphabet
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
            Master the fundamentals of English pronunciation with interactive alphabet learning
          </p>
        </div>
        
        {/* Play All Button */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <button 
            onClick={handlePlayAll}
            className={`alphabet-play-all-btn flex items-center gap-3 md:gap-4 ${
              isPlayingAll ? 'playing' : ''
            }`}
          >
            {isPlayingAll ? (
              <>
                <Square className="w-5 h-5 md:w-6 md:h-6" />
                <span>Stop All</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 md:w-6 md:h-6" />
                <span>Play All</span>
              </>
            )}
          </button>
        </div>

        {/* Save Progress Button */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <ButtonSavedProgress
            isSaved={isProgressSaved}
            onSave={handleSaveProgress}
            onUnsave={handleUnsaveProgress}
            size="small"
            variant="primary"
            topicName="English Alphabet"
          />
        </div>

        {/* Alphabet Grid */}
        <div className="alphabet-grid">
          {ALPHABET_DATA.map((item) => (
            <LetterCard
              key={item.letter}
              letter={item.letter}
              ipa={item.ipa}
              isPlaying={currentPlayingLetter === item.letter}
              onPlay={() => handlePlayLetter(item.letter)}
            />
          ))}
        </div>
      </main>

      <RecordingControlsButton
        className="recording-controls-button"
        downloadFileName="alphabet-GEUWAT-recording.wav"
      />
    </div>
  );
};

export default AlphabetPage;
