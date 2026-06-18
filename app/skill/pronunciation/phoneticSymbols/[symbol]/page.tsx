 'use client'

const highlightLetterStyle: React.CSSProperties = {
  color: '#fb923c',
  fontWeight: 900,
  textShadow: '0 0 8px rgba(251,146,60,0.95), 0 0 16px rgba(251,146,60,0.6)',
};

import React, { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { Play, Lightbulb, Database, Copy, ChevronDown } from 'lucide-react';
import '../styles/detail.css';
import BackButton from '../../../components/BackButton';
import Sidebar from '../../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../../components/buttonSavedProgress';
import { IpaVisibilityToggle, ControlCenter, PlayStopButton } from '@/app/components';
import {
  isSpeechSynthesisSupported,
  speakTextWithPause,
  stopSpeech,
  waitForVoices,
} from '@/lib/tts/speech';
import { useSymbolPlayback } from './hooks/useSymbolPlayback';
import { useSymbolProgress } from './hooks/useSymbolProgress';
import { useClipboardCopy } from './hooks/useClipboardCopy';
import { useCommonLetters } from './hooks/useCommonLetters';
import { SymbolWordGrid } from './components/SymbolWordGrid';
import { BritishNotePanel } from './components/BritishNotePanel';
import { SymbolVideoSection } from './components/SymbolVideoSection';
import { SymbolTipsPanel } from './components/SymbolTipsPanel';
import { CommonLettersSection } from './components/CommonLettersSection';
import { SymbolPromptSection } from './components/SymbolPromptSection';
import { SymbolHelpModal } from './components/SymbolHelpModal';
import type { WordExample } from '../data/wordExamples/wordExamples';
import {
  getCategoryDisplayName,
  getPronunciationTips,
  getSymbolDescription,
  getVideoIdBySymbol,
  getWordExamples,
} from '../data';
import { getAllCommonLetters, type CommonLetter } from '../data/commonLetters/CommonLetters';
import { WORD_HIGHLIGHT_OVERRIDES } from '../data/wordHighlights';
import {
  isIndexBasedOverride as hhIsIndexBasedOverride,
  renderIndexBasedWord as hhRenderIndexBasedWord,
  renderHighlightedWord as hhRenderHighlightedWord,
  renderWord as hhRenderWord,
  renderBritishNoteWord as hhRenderBritishNoteWord,
  renderIpa as hhRenderIpa,
} from './helpers/highlightHelpers';
import type { BritishSymbolNote } from './components/BritishNotePanel';
import { BRITISH_NOTE_COUNTERPARTS } from './data/symbolLookups';
import {
  toTourToken,
  getBaseGroup,
  getSymbolNavGroups,
  formatIpaSymbolForPrompt,
  buildAccentEvaluationPrompt,
  getDefaultSymbolDetailData,
  getSymbolDetailData,
  type SymbolDetailData,
  type SymbolDetailSectionState,
} from './utils';

const RecordingControlsButton = dynamic(() => import('../../../components/RecordingControlsButton'), {
  ssr: false,
});

const ALL_COMMON_LETTERS = getAllCommonLetters();
const COMMON_LETTER_SYMBOL_ALIASES: Record<string, string[]> = {
  e: ['ɛ'],
  'ɛ': ['e'],
  'er': ['eə', 'ɛr'],
  'eə': ['er', 'ɛr'],
  'ɛr': ['er', 'eə'],
  'ɪr': ['ɪə', 'iə'],
  'ɪə': ['ɪr', 'iə'],
  'iə': ['ɪr', 'ɪə'],
  'ʊr': ['ʊə'],
  'ʊə': ['ʊr'],
  'əʊ': ['oʊ'],
  'oʊ': ['əʊ'],
  'tʃ': ['ʧ'],
  'ʧ': ['tʃ'],
  'dʒ': ['ʤ'],
  'ʤ': ['dʒ'],
  y: ['j'],
  j: ['y'],
};

const BRITISH_NOTES_BY_SYMBOL: Record<string, BritishSymbolNote> = {};



const BETWEEN_PLAY_ALL_WORDS_MS = 220;

const SymbolDetailPage: React.FC = () => {
  const { symbol } = useParams<{
    symbol: string;
  }>();
  const router = useRouter();
  
  // Decode URL-encoded symbol
  const decodedSymbol = symbol ? decodeURIComponent(symbol) : '';
  const normalizedSymbol = decodedSymbol.trim().toLowerCase();
  const shouldRedirectToSummary =
    normalizedSymbol === 'summary of phonetic symbols' ||
    normalizedSymbol === 'summary-of-phonetic-symbols';
  
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isPlayingAllBritishNotes, setIsPlayingAllBritishNotes] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showIpa, setShowIpa] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);
  const {
    commonLetters,
    commonLettersLoading,
    commonLettersError,
    showCommonLettersPopup,
    openCommonLettersModal,
    closeCommonLettersModal,
  } = useCommonLetters({ initialCommonLetters: ALL_COMMON_LETTERS });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const symbolData = useMemo(() => getSymbolDetailData(decodedSymbol), [decodedSymbol]);
  const symbolNavGroups = useMemo(() => getSymbolNavGroups(symbolData.category), [symbolData.category]);
  const britishNote = useMemo(
    () => BRITISH_NOTES_BY_SYMBOL[decodedSymbol] ?? null,
    [decodedSymbol]
  );
  const promptFocusSymbol = useMemo(() => formatIpaSymbolForPrompt(decodedSymbol), [decodedSymbol]);
  const accentEvaluationPrompt = useMemo(
    () => buildAccentEvaluationPrompt(promptFocusSymbol),
    [promptFocusSymbol],
  );
  const {
    isProgressSaved,
    isPracticeOpen,
    isTipsOpen,
    isVideoOpen,
    shouldAutoplayVideo,
    isPromptOpen,
    isCommonLettersOpen,
    setIsPracticeOpen,
    setIsTipsOpen,
    setIsVideoOpen,
    setShouldAutoplayVideo,
    setIsPromptOpen,
    setIsCommonLettersOpen,
    handleSaveProgress,
    handleUnsaveProgress,
  } = useSymbolProgress({ decodedSymbol });

  const {
    isPromptCopied,
    isWordExamplesCopied,
    isMissionCopied,
    handleCopyMission,
    handleCopyPrompt,
    handleCopyWordExamples,
  } = useClipboardCopy({ symbolData, accentEvaluationPrompt });

  const sectionStateStorageKey = useMemo(
    () => `phoneticSymbolSectionState:${normalizedSymbol || 'default'}`,
    [normalizedSymbol]
  );
  const videoEmbedSrc = useMemo(() => {
    if (!symbolData.videoId) return '';
    const autoplayQuery = shouldAutoplayVideo && isVideoOpen ? '&autoplay=1' : '';
    return `https://www.youtube.com/embed/${symbolData.videoId}?rel=0&modestbranding=1&controls=1&showinfo=0${autoplayQuery}`;
  }, [isVideoOpen, shouldAutoplayVideo, symbolData.videoId]);

  useEffect(() => {
    if (shouldRedirectToSummary) {
      router.replace('/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols');
      return;
    }

    if (normalizedSymbol === 'y') {
      router.replace('/skill/pronunciation/phoneticSymbols/j');
    }
  }, [router, shouldRedirectToSummary, normalizedSymbol]);

  useEffect(() => {
    setShowHighlight(true);
  }, [decodedSymbol]);

  const symbolAliasCandidates = useMemo(() => {
    const base = [decodedSymbol, ...(COMMON_LETTER_SYMBOL_ALIASES[decodedSymbol] ?? [])];
    return Array.from(new Set(base.filter(Boolean)));
  }, [decodedSymbol]);

  const isIndexBasedOverride = (patterns: string[]): boolean => hhIsIndexBasedOverride(patterns);

  const renderIndexBasedWord = (word: string, patterns: string[]) =>
    hhRenderIndexBasedWord(word, patterns, highlightLetterStyle);

  const renderHighlightedWord = (word: string, patterns: string[]) =>
    hhRenderHighlightedWord(word, patterns, decodedSymbol, highlightLetterStyle);

  const renderWord = (word: string) => hhRenderWord(word, showHighlight, decodedSymbol, highlightLetterStyle);

  const renderBritishNoteWord = (word: string) =>
    hhRenderBritishNoteWord(word, showHighlight, decodedSymbol, highlightLetterStyle);

  const renderIpa = (ipa?: string, isBritishNoteOrAlternative = false) =>
    hhRenderIpa(ipa, showHighlight, symbolAliasCandidates, decodedSymbol, highlightLetterStyle, isBritishNoteOrAlternative);

  const wordExamplesRef = useRef<HTMLDivElement>(null);
  

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
        setActiveWordIndex(0);
      }
    }
  };

  // Playback hook handles speech synthesis lifecycle and refs
  const {
    wordCardRefs,
    britishNoteItemRefs,
    stopPlayAllWords,
    handlePlayAllWords,
    handlePlayAllBritishNotes,
    handlePlayWord,
    handlePlayBritishNoteWord,
    handlePlayAmericanNoteWord,
  } = useSymbolPlayback({
    symbolData,
    britishNote,
    isPlayingAll,
    isPlayingAllBritishNotes,
    setIsPlayingAll,
    setIsPlayingAllBritishNotes,
    setActiveWord,
    setActiveWordIndex,
  });
  // Debug: Check if data is loaded correctly
  useEffect(() => {
    console.log('Original symbol:', symbol);
    console.log('Decoded symbol:', decodedSymbol);
    console.log('Symbol data:', symbolData);
    console.log('Examples count:', symbolData.examples.length);
    console.log('Tips count:', symbolData.tips.length);
  }, [symbol, decodedSymbol, symbolData]);


  

  if (shouldRedirectToSummary) {
    return null;
  }

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
                    <h2 className="text-6xl md:text-8xl font-ipa font-bold drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" data-ipa>
                        /{decodedSymbol}/
                    </h2>
                    <div className="mt-2 px-2 py-0.5 md:px-3 md:py-1 bg-purple-900/10 border border-purple-500/30 rounded text-purple-400 font-mono text-[10px] md:text-xs">
                        {symbolData.category}
                    </div>
                </div>

             </div>
          </div>
        </div>

        <SymbolWordGrid
          examples={symbolData.examples}
          symbolKey={decodedSymbol}
          uiNote={symbolData.uiNote}
          wordCardRefs={wordCardRefs}
          activeWord={activeWord}
          activeWordIndex={activeWordIndex}
          isPlayingAll={isPlayingAll}
          showIpa={showIpa}
          showHighlight={showHighlight}
          isWordExamplesCopied={isWordExamplesCopied}
          handleCopyWordExamples={handleCopyWordExamples}
          toTourToken={toTourToken}
          renderWord={renderWord}
          renderIpa={renderIpa}
          handlePlayWord={handlePlayWord}
          setActiveWord={setActiveWord}
          setActiveWordIndex={setActiveWordIndex}
        />

        {britishNote && (
          <BritishNotePanel
            britishNote={britishNote}
            activeWord={activeWord}
            britishNoteItemRefs={britishNoteItemRefs}
            showIpa={showIpa}
            showHighlight={showHighlight}
            renderBritishNoteWord={renderBritishNoteWord}
            renderIpa={renderIpa}
            handlePlayBritishNoteWord={handlePlayBritishNoteWord}
            handlePlayAmericanNoteWord={handlePlayAmericanNoteWord}
          />
        )}

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

        <SymbolTipsPanel
          isTipsOpen={isTipsOpen}
          setIsTipsOpen={setIsTipsOpen}
          tips={symbolData.tips}
        />

        <CommonLettersSection
          isOpen={isCommonLettersOpen}
          onToggle={() => setIsCommonLettersOpen(prev => !prev)}
          letters={commonLetters}
          symbolIPA={decodedSymbol}
          aliasMap={COMMON_LETTER_SYMBOL_ALIASES}
          isLoading={commonLettersLoading}
          error={commonLettersError}
          onRetry={openCommonLettersModal}
        />

        <SymbolVideoSection
          decodedSymbol={decodedSymbol}
          videoEmbedSrc={videoEmbedSrc}
          videoId={symbolData.videoId}
          isVideoOpen={isVideoOpen}
          shouldAutoplayVideo={shouldAutoplayVideo}
          setIsVideoOpen={setIsVideoOpen}
          setShouldAutoplayVideo={setShouldAutoplayVideo}
          scrollToWordExamples={scrollToWordExamples}
        />

        {/* Practice Section */}
        <div className="w-full max-w-4xl mx-auto mt-6">
          <div 
            className="symbol-detail-collapsible-panel bg-black/85 border border-white/60 hover:border-purple-500 transition-colors rounded-lg overflow-hidden shadow-[0_0_24px_rgba(168,85,247,0.15)] hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]"
            style={{ '--panel-glow-rgb': '168, 85, 247' } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => setIsPracticeOpen(prev => !prev)}
              data-tour="symbol-practice-section-toggle"
              className="w-full bg-white/5 px-4 py-2 border-b border-white/40 hover:border-purple-500 flex items-center justify-between gap-2 text-left hover:bg-white/10 transition-colors"
              aria-expanded={isPracticeOpen}
            >
              <div className="flex items-center gap-2">
                <Database className="text-white" size={16} />
                <span className="ml-2 font-display text-[10px] md:text-xs text-white tracking-wider">PRACTICE</span>
              </div>
              <span className="symbol-detail-chevron-toggle text-white">
                <ChevronDown
                  size={14}
                  className={`symbol-detail-chevron-icon ${isPracticeOpen ? 'is-open' : ''}`}
                />
              </span>
            </button>
            {isPracticeOpen && (
              <div className="p-3 md:p-5 text-[11px] md:text-sm text-gray-200 leading-relaxed">
                <p>
                  <strong>Mission:</strong>
                  <br />
                  Buka AI assistant seperti <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:text-white underline decoration-cyber-cyan/50 underline-offset-2 transition-colors">Gemini</a>, rekam ucapan untuk semua kata di Word_Examples, dan berikan prompt di bawah untuk dinilai.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyMission}
                    className="inline-flex items-center gap-1.5 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 px-3 py-1.5 text-[11px] md:text-sm font-mono text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
                    title="Salin Words dan Prompt"
                  >
                    <Copy size={14} />
                    <span>{isMissionCopied ? 'Tersalin!' : 'Salin Words & Prompt'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <SymbolPromptSection
          accentEvaluationPrompt={accentEvaluationPrompt}
          isPromptOpen={isPromptOpen}
          setIsPromptOpen={setIsPromptOpen}
          handleCopyPrompt={handleCopyPrompt}
          isPromptCopied={isPromptCopied}
        />

        {/* Symbol Navigation Grid (Separate Section, below video) */}
        {symbolNavGroups.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mt-6">
            <div className="relative border border-white/60 hover:border-purple-500 transition-colors rounded-lg bg-black/40 p-3 md:p-4">
              <div className="mb-2.5 flex flex-col items-center justify-center gap-1 text-center pt-4">
                <h4 className="font-mono text-[10px] md:text-xs tracking-wider text-white uppercase">
                  {getBaseGroup(symbolData.category)?.toUpperCase()} Symbols
                </h4>
              </div>
              <div className="space-y-3">
                {symbolNavGroups.map((group) => (
                  <div key={group.title} className="text-center">
                    {symbolNavGroups.length > 1 && (
                      <p className="mb-1.5 text-[10px] md:text-xs text-white/80 font-mono uppercase tracking-wide text-center">
                        {group.title}
                      </p>
                    )}
                    <div className="flex flex-wrap justify-center gap-2">
                      {group.symbols.map((item) => {
                        const active = item === decodedSymbol;
                        return (
                          <button
                            key={item}
                            type="button"
                            disabled={active}
                            onClick={() =>
                              router.push(`/skill/pronunciation/phoneticSymbols/${encodeURIComponent(item)}`)
                            }
                            className={`h-10 md:h-11 min-w-[42px] px-3 rounded-lg border transition-colors text-center flex items-center justify-center font-semibold tracking-wide shadow-[0_0_10px_rgba(168,85,247,0.12)] ${
                              active
                                ? 'border-purple-300 bg-purple-800/35 text-white cursor-default'
                                : 'border-purple-500/35 bg-black/45 text-purple-200 hover:bg-purple-900/30 hover:border-purple-400'
                            }`}
                            data-ipa
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Control Button */}
      
      <ControlCenter
        topControls={
          <div className="flex flex-col gap-4">
            <div className="border-b border-white/10 pb-3 mb-1">
              <IpaVisibilityToggle checked={showIpa} onChange={setShowIpa} className="w-full flex justify-between mb-3 text-[10px] sm:text-xs" />
              <IpaVisibilityToggle
                checked={showHighlight}
                onChange={setShowHighlight}
                className="w-full flex justify-between text-[10px] sm:text-xs"
                label="Highlight Letters"
                activeClass="text-orange-200"
                activeTrackClass="bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.62)]"
                activeDotClass="bg-orange-300 shadow-[0_0_6px_rgba(253,186,116,0.95)]"
              />
            </div>
          </div>
        }
        bottomControls={
          <div className="flex flex-col gap-2">
            <PlayStopButton
              isActive={isPlayingAll}
              label="WORD EXAMPLES"
              onClick={handlePlayAllWords}
              disabled={symbolData.examples.length === 0}
            />
            {britishNote && (
              <PlayStopButton
                isActive={isPlayingAllBritishNotes}
                label="CATATAN (UK VS US)"
                sectionId="britishNote"
                onClick={handlePlayAllBritishNotes}
                disabled={!britishNote || britishNote.items.length === 0}
              />
            )}
          </div>
        }
      />
      <RecordingControlsButton downloadFileName={`phonetic-${decodedSymbol}-GEUWAT-recording.mp3`} />


      <SymbolHelpModal isOpen={showHelpPopup} onClose={() => setShowHelpPopup(false)} />

    </div>
  );
};

export default SymbolDetailPage;

