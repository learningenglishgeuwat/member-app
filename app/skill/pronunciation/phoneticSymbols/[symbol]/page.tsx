'use client'

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Play, Pause, Lightbulb, Database, HelpCircle, Book } from 'lucide-react';
import '../styles/detail.css';
import '../../../../styles/scrollbar.css';
import BackButton from '../../../components/BackButton';
import Sidebar from '../../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../../components/buttonSavedProgress';
import type { WordExample } from '../data/wordExamples/wordExamples';
import type { CommonLetter } from '../data/commonLetters/CommonLetters';

const RecordingControlsButton = dynamic(() => import('../../../components/RecordingControlsButton'), {
  ssr: false,
});
const CommonLettersModal = dynamic(() => import('./components/CommonLettersModal'), {
  ssr: false,
});


const SymbolDetailPage: React.FC = () => {
  const { symbol } = useParams<{
    symbol: string;
  }>();
  
  // Decode URL-encoded symbol
  const decodedSymbol = symbol ? decodeURIComponent(symbol) : '';
  
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [symbolLoading, setSymbolLoading] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showCommonLettersPopup, setShowCommonLettersPopup] = useState(false);
  const [commonLetters, setCommonLetters] = useState<CommonLetter[] | null>(null);
  const [commonLettersLoading, setCommonLettersLoading] = useState(false);
  const [commonLettersError, setCommonLettersError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState(false); // Start with false to match server
  const [isClient, setIsClient] = useState(false);
  const [symbolData, setSymbolData] = useState<{
    description: string;
    category: string;
    examples: WordExample[];
    tips: string[];
    videoId?: string;
  }>({
    description: 'International Phonetic Alphabet Symbol',
    category: 'Unknown',
    examples: [],
    tips: [],
    videoId: undefined,
  });

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      setIsProgressSaved(!!savedProgress[`phoneticSymbols_${decodedSymbol}`]);
    }
  }, [decodedSymbol]);
  
  const wordCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wordExamplesRef = useRef<HTMLDivElement>(null);
  const playSessionRef = useRef(0);
  const playNextTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    let active = true;
    if (!decodedSymbol) {
      setSymbolData({
        description: 'International Phonetic Alphabet Symbol',
        category: 'Unknown',
        examples: [],
        tips: [],
        videoId: undefined,
      });
      return () => {
        active = false;
      };
    }

    setSymbolLoading(true);
    (async () => {
      try {
        const [wordExamplesModule, descriptionModule, tipsModule, videoModule] = await Promise.all([
          import('../data/wordExamples/wordExamples'),
          import('../data/symbolDescriptions'),
          import('../data/pronunciationTips/PronunciationTips'),
          import('../data/videoIds'),
        ]);

        if (!active) return;

        setSymbolData({
          description: descriptionModule.getSymbolDescription(decodedSymbol),
          category: descriptionModule.getCategoryDisplayName(decodedSymbol),
          examples: wordExamplesModule.getWordExamples(decodedSymbol),
          tips: tipsModule.getPronunciationTips(decodedSymbol),
          videoId: videoModule.getVideoIdBySymbol(decodedSymbol),
        });
      } catch (error) {
        console.error('Failed to load symbol data:', error);
        if (!active) return;
        setSymbolData({
          description: 'International Phonetic Alphabet Symbol',
          category: 'Unknown',
          examples: [],
          tips: [],
          videoId: undefined,
        });
      } finally {
        if (active) setSymbolLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [decodedSymbol]);

  // Manual scroll to word examples
  const scrollToWordExamples = () => {
    if (wordExamplesRef.current) {
      wordExamplesRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Set active word to first example to ensure first card is highlighted
      if (symbolData.examples.length > 0) {
        setActiveWord(symbolData.examples[0].word);
      }
    }
  };

  // Preload voices to ensure they are available when needed
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Cleanup
    return () => {
      playSessionRef.current += 1;
      if (playNextTimeoutRef.current) {
        window.clearTimeout(playNextTimeoutRef.current);
        playNextTimeoutRef.current = null;
      }
      setIsPlayingAll(false);
      setActiveWord(null);
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

  // Debug: Check if data is loaded correctly
  useEffect(() => {
    console.log('Original symbol:', symbol);
    console.log('Decoded symbol:', decodedSymbol);
    console.log('Symbol data:', symbolData);
    console.log('Examples count:', symbolData.examples.length);
    console.log('Tips count:', symbolData.tips.length);
  }, [symbol, decodedSymbol, symbolData]);


  const stopPlayAllWords = () => {
    playSessionRef.current += 1;
    if (playNextTimeoutRef.current) {
      window.clearTimeout(playNextTimeoutRef.current);
      playNextTimeoutRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlayingAll(false);
    setActiveWord(null);
  };

  const handlePlayAllWords = () => {
    if (!('speechSynthesis' in window) || symbolLoading || symbolData.examples.length === 0) return;

    if (isPlayingAll) {
      stopPlayAllWords();
      return;
    }

    stopPlayAllWords();
    const currentSession = playSessionRef.current;
    const preferredVoice = getPreferredVoice();
    let currentIndex = 0;
    setIsPlayingAll(true);
      
    const playNextWord = () => {
      if (currentSession !== playSessionRef.current) return;

      if (currentIndex >= symbolData.examples.length) {
        setIsPlayingAll(false);
        setActiveWord(null);
        return;
      }

      const example = symbolData.examples[currentIndex];
      setActiveWord(example.word);

      if (wordCardRefs.current[currentIndex]) {
        wordCardRefs.current[currentIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }

      const utterance = new SpeechSynthesisUtterance(example.word);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        if (currentSession !== playSessionRef.current) return;
        setActiveWord(example.word);
      };

      utterance.onend = () => {
        if (currentSession !== playSessionRef.current) return;
        currentIndex++;
        playNextTimeoutRef.current = window.setTimeout(playNextWord, 300);
      };

      utterance.onerror = () => {
        if (currentSession !== playSessionRef.current) return;
        currentIndex++;
        playNextTimeoutRef.current = window.setTimeout(playNextWord, 300);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNextWord();
  };

  const handlePlayWord = (word: string) => {
    if ('speechSynthesis' in window) {
      stopPlayAllWords();
      window.speechSynthesis.cancel();
      setActiveWord(word);
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8; // Slightly slower for better pronunciation clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';
      
      const preferredVoice = getPreferredVoice();
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => {
        setActiveWord(word);
      };
      
      utterance.onend = () => {
        setActiveWord(null);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleSaveProgress = async (percentage: number) => {
    setIsProgressSaved(true);
    
    // Save to localStorage for persistence with symbol-specific key (client-side only)
    if (isClient && typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      currentProgress[`phoneticSymbols_${decodedSymbol}`] = percentage;
      localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));
      
      // Calculate average progress for all phonetic symbols
      const phoneticSymbolKeys = Object.keys(currentProgress).filter(key => key.startsWith('phoneticSymbols_'));
      const phoneticSymbolProgress = phoneticSymbolKeys.map(key => currentProgress[key]);
      const averagePhoneticProgress = phoneticSymbolProgress.length > 0 
        ? Math.round(phoneticSymbolProgress.reduce((acc: number, curr: number) => acc + curr, 0) / phoneticSymbolProgress.length)
        : 0;
      
      // Update overall pronunciation progress including all categories
      const allProgress = Object.values(currentProgress) as number[];
      const overallAverageProgress = allProgress.length > 0 
        ? Math.round(allProgress.reduce((acc: number, curr: number) => acc + curr, 0) / allProgress.length)
        : 0;
      
      // Save to dashboard progress
      const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
      dashboardProgress.pronunciation = overallAverageProgress;
      dashboardProgress.phoneticSymbols = averagePhoneticProgress; // Specific for phonetic symbols category
      localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
      
      console.log(`Symbol /${decodedSymbol}/ progress saved: ${percentage}%`);
      console.log(`Phonetic Symbols average progress: ${averagePhoneticProgress}%`);
      console.log(`Overall pronunciation average: ${overallAverageProgress}%`);
    }
  };

  const handleUnsaveProgress = async () => {
    setIsProgressSaved(false);
    
    // Remove from localStorage
    if (isClient && typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      delete currentProgress[`phoneticSymbols_${decodedSymbol}`];
      localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));
      
      // Recalculate averages
      const phoneticSymbolKeys = Object.keys(currentProgress).filter(key => key.startsWith('phoneticSymbols_'));
      const phoneticSymbolProgress = phoneticSymbolKeys.map(key => currentProgress[key]);
      const averagePhoneticProgress = phoneticSymbolProgress.length > 0 
        ? Math.round(phoneticSymbolProgress.reduce((acc: number, curr: number) => acc + curr, 0) / phoneticSymbolProgress.length)
        : 0;
      
      const allProgress = Object.values(currentProgress) as number[];
      const overallAverageProgress = allProgress.length > 0 
        ? Math.round(allProgress.reduce((acc: number, curr: number) => acc + curr, 0) / allProgress.length)
        : 0;
      
      // Update dashboard progress
      const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
      dashboardProgress.pronunciation = overallAverageProgress;
      dashboardProgress.phoneticSymbols = averagePhoneticProgress;
      localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
      
      console.log(`Symbol /${decodedSymbol}/ progress removed`);
    }
  };

  const openCommonLettersModal = async () => {
    setShowCommonLettersPopup(true);

    if (commonLetters || commonLettersLoading) {
      return;
    }

    setCommonLettersLoading(true);
    setCommonLettersError(null);
    try {
      const commonLettersModule = await import('../data/commonLetters/CommonLetters');
      setCommonLetters(commonLettersModule.getAllCommonLetters());
    } catch (error) {
      console.error('Failed to load common letters:', error);
      setCommonLettersError('Gagal memuat data common letters. Silakan coba lagi.');
    } finally {
      setCommonLettersLoading(false);
    }
  };

  return (
    // Responsive container: handles safe areas and dynamic viewport heights
    <div className="pronunciation-layout symbol-detail-container supports-[height:100dvh]:h-[100dvh] font-sans flex flex-col overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cyber-grid z-0 opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent z-20 shadow-[0_0_20px_#be29ec]"></div>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-30">
        <BackButton to="/skill/pronunciation/phoneticSymbols" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        theme="cyber"
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      {/* Main Interface - Responsive Padding & Layout */}
      <main className="symbol-detail-main relative z-10 flex-1 flex flex-col items-center pt-40 pb-24 md:pt-36 md:pb-32 overflow-y-auto w-full px-3 sm:px-4 scrollbar-hide">
        
        {/* HERO: The Reactor Core - Responsive Sizing */}
          <div className="relative mt-6 md:mt-8 lg:mt-6 mb-6 md:mb-10 group flex-shrink-0">
          
          {/* Outer Rotating Ring */}
          <div className="absolute inset-[-14px] sm:inset-[-18px] md:inset-[-24px] lg:inset-[-32px] border border-cyber-cyan/20 rounded-full border-dashed animate-spin-slow pointer-events-none"></div>
          
          {/* Inner Hex/Circle Core - Scaled for Mobile/Desktop */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 flex items-center justify-center">
             {/* Glow Background */}
             <div className="absolute inset-0 bg-cyber-cyan/5 rounded-full blur-3xl animate-pulse"></div>
             
             {/* Main Container */}
             <div className="relative w-full h-full bg-cyber-slate/40 backdrop-blur-sm border border-cyber-cyan/50 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(190,41,236,0.2)]">
                
                {/* HUD Lines */}
                <div className="absolute top-0 bottom-0 w-px bg-cyber-cyan/20"></div>
                <div className="absolute left-0 right-0 h-px bg-cyber-cyan/20"></div>

                <div className="z-10 text-center">
                    <p className="font-mono text-purple-400/60 text-[10px] md:text-xs tracking-widest mb-1 md:mb-2">TARGET_PHONEME</p>
                    <h2 className="text-6xl md:text-8xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ fontFamily: 'Lucida Sans Unicode, Arial Unicode MS, Times New Roman, serif' }}>
                        /{decodedSymbol}/
                    </h2>
                    <div className="mt-2 px-2 py-0.5 md:px-3 md:py-1 bg-purple-900/10 border border-purple-500/30 rounded text-purple-400 font-mono text-[10px] md:text-xs">
                        {symbolData.category}
                    </div>
                </div>

                {/* Interactive Trigger (Main Action Button) */}
                <button 
                  onClick={handlePlayAllWords}
                  disabled={symbolLoading || symbolData.examples.length === 0}
                  className="absolute -bottom-5 md:-bottom-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(190,41,236,0.4)] z-20 group-hover:scale-110 bg-cyber-cyan text-black hover:bg-white"
                  title={isPlayingAll ? "Stop All Words" : "Play All Words"}
                >
                    {isPlayingAll ? <Pause className="md:w-5 md:h-5 fill-current" /> : <Play className="md:w-5 md:h-5 fill-current" />}
                </button>
             </div>
          </div>
        </div>

        {/* Word Grid Module */}
        <div ref={wordExamplesRef} className="w-full scroll-mt-24 mt-12 md:mt-14">
          <div className="word-examples-section w-full max-w-6xl mx-auto p-2 md:p-4 z-10 relative">
            <div className="word-examples-header flex items-center justify-between mb-3 md:mb-5 border-b border-purple-500/30 pb-2">
              <div className="flex items-center gap-2">
                <Database className="text-purple-400" size={16} />
                <h3 className="text-xs md:text-lg font-display font-bold text-purple-400 tracking-widest uppercase">
                  Word_Examples
                </h3>
              </div>
              <button
                onClick={() => {
                  // Scroll to video section
                  const videoSection = document.querySelector('[data-video-section]');
                  if (videoSection) {
                    videoSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }
                }}
                className="px-2.5 py-1 bg-purple-900/10 border border-purple-500/30 rounded text-purple-400 font-mono text-[10px] hover:bg-purple-900/20 transition-colors flex items-center gap-1"
              >
                <Play size={12} />
                <span>Go to Video</span>
              </button>
            </div>
            
            {/* Word Examples Grid - controlled by CSS */}
            <div className="word-grid w-full">
              {symbolData.examples.map((example: WordExample, index: number) => {
                const isActive = example.word === activeWord;
                
                return (
                  <button
                    key={index}
                    ref={el => { wordCardRefs.current[index] = el; }}
                    onClick={() => handlePlayWord(example.word)}
                    onMouseEnter={() => setActiveWord(example.word)}
                    onMouseLeave={() => setActiveWord(null)}
                    className={`word-card relative group p-3 md:p-4 rounded-lg border transition-all duration-300 overflow-hidden w-full ${
                      isActive 
                        ? 'bg-purple-900/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-105 z-10' 
                        : 'bg-black/40 border-purple-500/30 hover:bg-purple-900/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-102'
                    } backdrop-blur-sm`}
                  >
                    {/* Grid Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="w-full h-full" style={{
                        backgroundImage: `
                          linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '8px 8px'
                      }}></div>
                    </div>
                    
                    {/* Corner Markers */}
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 z-10 ${
                      isActive 
                        ? 'border-purple-400 opacity-100' 
                        : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                    }`}></div>
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 z-10 ${
                      isActive 
                        ? 'border-purple-400 opacity-100' 
                        : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                    }`}></div>
                    <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 transition-all duration-300 z-10 ${
                      isActive 
                        ? 'border-purple-400 opacity-100' 
                        : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                    }`}></div>

                    <div className="flex flex-col items-center justify-center h-full z-10 relative px-1">
                      <span className={`font-sans font-bold text-base md:text-lg tracking-wide transition-colors truncate w-full text-center ${isActive ? 'text-purple-400' : 'text-white group-hover:text-purple-400'}`}>
                        {example.word}
                      </span>
                      <span className={`text-[10px] md:text-xs font-mono mt-0.5 md:mt-1 truncate w-full text-center ${isActive ? 'text-white/80' : 'text-purple-400/60'}`} style={{ fontFamily: 'Lucida Sans Unicode, Arial Unicode MS, Times New Roman, serif' }}>
                        [{example.ipa}]
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Progress Section */}
        <div className="w-full max-w-4xl mx-auto mt-6 mb-6">
          <div className="flex flex-col items-center gap-4">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="primary"
              topicName={`Phonetic Symbol /${decodedSymbol}/`}
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section w-full max-w-4xl mx-auto mt-6 mb-10">
          <div className="bg-black/80 border border-cyber-pink/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.15)]">
                    
            {/* Terminal Header */}
            <div className="bg-cyber-pink/10 px-4 py-2 flex justify-between items-center border-b border-cyber-pink/30">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-cyber-pink" size={16} />
                <span className="ml-2 font-mono text-[10px] md:text-xs text-cyber-pink tracking-wider">PRONUNCIATION_TIPS</span>
              </div>
              <button
                onClick={openCommonLettersModal}
                className="text-cyber-pink hover:text-cyber-pink/80 transition-colors cursor-pointer"
                title="Lihat huruf umum dan simbol IPA"
              >
                <Book size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-3 md:p-5 font-mono text-[11px] md:text-sm text-gray-300 min-h-[130px]">
              <div className="whitespace-pre-line leading-relaxed">
                {symbolData.tips.map((tip: string, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <span className="text-green-400 block">{index + 1}.</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
              <span className="inline-block w-2 h-4 bg-cyber-pink animate-pulse mt-2 align-middle"></span>
            </div>
          </div>
        </div>

        {/* YouTube Video Section */}
        {symbolData.videoId && (
          <div data-video-section className="w-full max-w-4xl mx-auto mt-6">
            <div className="bg-black/90 border border-purple-500/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                      
              {/* Terminal Header */}
              <div className="bg-purple-900/20 px-4 py-2 flex justify-between items-center border-b border-purple-500/30">
                <div className="flex items-center gap-2">
                  <Play className="text-purple-400" size={16} />
                  <span className="ml-2 font-mono text-[10px] md:text-xs text-purple-400 tracking-wider">VIDEO_TUTORIAL</span>
                  <span className="text-xs text-white/60">Symbol: /{decodedSymbol}/</span>
                </div>
              </div>

              {/* Video Content */}
              <div className="p-3 md:p-5">
                <div className="relative w-full" style={{ paddingBottom: '35%' }}>
                  <iframe
                    key={symbolData.videoId || 'no-video'}
                    className="absolute top-0 left-0 w-full h-full rounded-lg border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    src={`https://www.youtube.com/embed/${symbolData.videoId}?rel=0&modestbranding=1&controls=1&showinfo=0`}
                    title={`Pronunciation tutorial for /${decodedSymbol}/`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-center mt-3">
                  <button
                    onClick={scrollToWordExamples}
                    className="px-3 py-2 bg-purple-900/10 border border-purple-500/30 rounded text-purple-400 font-mono text-[11px] hover:bg-purple-900/20 transition-colors flex items-center gap-2"
                  >
                    <Database size={14} />
                    <span>Go to Word Examples</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Control Button */}
      <RecordingControlsButton downloadFileName={`phonetic-${decodedSymbol}-GEUWAT-recording.wav`} />


      {/* Help Popup Modal */}
      {showHelpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHelpPopup(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#0a0f1c] border border-cyber-cyan/40 rounded-2xl p-4 sm:p-6 max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto w-full shadow-[0_0_50px_rgba(190,41,236,0.3)] mx-4 sm:mx-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowHelpPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200"
              title="Tutup popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header */}
            <div className="flex items-center mb-4">
              <HelpCircle className="text-cyber-pink mr-3" size={24} />
              <h3 className="text-xl font-bold text-white">Instruksi Perekaman</h3>
            </div>
            
            {/* Instructions */}
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <span className="text-cyber-cyan font-bold mr-3">1.</span>
                <p>Klik tombol <span className="text-cyber-pink font-semibold">REC_ON</span> untuk memulai perekaman</p>
              </div>
              <div className="flex items-start">
                <span className="text-cyber-cyan font-bold mr-3">2.</span>
                <p>Bicara dengan jelas ke mikrofon</p>
              </div>
              <div className="flex items-start">
                <span className="text-cyber-cyan font-bold mr-3">3.</span>
                <p>Klik tombol <span className="text-red-400 font-semibold">STOP</span> saat selesai</p>
              </div>
              <div className="flex items-start">
                <span className="text-cyber-cyan font-bold mr-3">4.</span>
                <p>Klik tombol <span className="text-cyber-cyan font-semibold">PLAY</span> untuk mendengarkan rekaman</p>
              </div>
              <div className="flex items-start">
                <span className="text-cyber-cyan font-bold mr-3">5.</span>
                <p>Klik tombol <span className="text-cyber-pink font-semibold">DOWNLOAD</span> untuk menyimpan audio</p>
              </div>
              <div className="flex items-start">
                <span className="text-cyber-cyan font-bold mr-3">6.</span>
                <p>Setelah selesai, unduh file audio dan simpan di pc/android Anda.</p>
              </div>
              <div className="flex items-start">
                <span className="text-cyber-cyan font-bold mr-3">7.</span>
                <p>Isi <span className="text-cyber-pink font-semibold">saved progress</span> berdasarkan hasil penilaian dari AI assistant</p>
              </div>
              <div className="mt-4 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
                <p className="text-sm text-cyber-cyan mb-2">
                  <strong>Langkah Selanjutnya:</strong> Buka halaman <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-cyber-pink hover:text-cyber-pink/80 underline transition-colors">https://gemini.google.com/app</a> atau AI assistant lainnya
                </p>
                <p className="text-sm text-cyber-cyan mb-2">
                  Upload rekaman audio Anda
                </p>
                <p className="text-sm text-cyber-cyan">
                  <strong>Gunakan prompt berikut:</strong>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('"Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan semua kata yang saya ucapkan dalam rekaman ini. 2. Analisis setiap kata tersebut dengan fokus pada American Accent (General American). Nilai dan beri umpan balik pada pengucapan vokal dan konsonan. 3. Format Output: Sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata yang diucapkan. - Kolom 2: Status Kualitatif (\'🟢 Sangat bagus 🔵Bagus\', \'🟠 Perlu Sedikit Perbaikan\', atau \'🔴 Perlu Perbaikan\'). - Kolom 3: Umpan Balik spesifik yang menjelaskan secara singkat apa yang perlu diperbaiki."');
                      // Show toast notification
                      if (typeof window !== 'undefined') {
                        const toast = document.createElement('div');
                        toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-gray-900 to-black border border-cyan-400/30 text-cyan-300 px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.8),0_0_50px_rgba(190,41,236,0.4)] z-[60] transition-all duration-300 transform translate-x-full backdrop-blur-sm';
                        toast.innerHTML = '<span class="flex items-center"><span class="mr-2 text-cyan-400">📋</span> Prompt berhasil disalin!</span>';
                        document.body.appendChild(toast);
                        
                        // Animate in
                        setTimeout(() => {
                          toast.classList.remove('translate-x-full');
                        }, 100);
                        
                        // Remove after 3 seconds
                        setTimeout(() => {
                          toast.classList.add('translate-x-full');
                          setTimeout(() => {
                            if (document.body.contains(toast)) {
                              document.body.removeChild(toast);
                            }
                          }, 300);
                        }, 3000);
                      }
                    }}
                    className="ml-2 p-1 bg-cyber-pink/20 hover:bg-cyber-pink/30 rounded transition-colors group"
                    title="Salin prompt"
                  >
                    <svg className="w-4 h-4 text-cyber-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2zm-2-6h12v8H6V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3H9v6h6V3z" />
                    </svg>
                  </button>
                </p>
                <div className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-300 font-mono max-h-32 overflow-y-auto relative">
                  &quot;Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 
                  1. Transkripsikan semua kata yang saya ucapkan dalam rekaman ini.
                  2. Analisis setiap kata tersebut dengan fokus pada American Accent (General American). Nilai dan beri umpan balik pada pengucapan vokal dan konsonan.
                  3. Format Output: Sajikan hasil analisis dalam bentuk tabel dengan tiga kolom:
                     - Kolom 1: Kata yang diucapkan.
                     - Kolom 2: Status Kualitatif (&apos;🟢 Sangat bagus 🔵Bagus&apos;, &apos;🟠 Perlu Sedikit Perbaikan&apos;, atau &apos;🔴 Perlu Perbaikan&apos;).
                     - Kolom 3: Umpan Balik spesifik yang menjelaskan secara singkat apa yang perlu diperbaiki.&quot;
                </div>
              </div>
            </div>
            
            {/* Tips */}
            <div className="mt-4 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
              <p className="text-sm text-cyber-cyan">
                <strong>Tip:</strong> Pastikan mikrofon Anda bekerja dengan baik dan berbicara dengan volume yang cukup.
              </p>
            </div>
          </div>
        </div>
      )}

      <CommonLettersModal
        isOpen={showCommonLettersPopup}
        onClose={() => setShowCommonLettersPopup(false)}
        letters={commonLetters}
        isLoading={commonLettersLoading}
        error={commonLettersError}
        onRetry={openCommonLettersModal}
      />

    </div>
  );
};

export default SymbolDetailPage;
