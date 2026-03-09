'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  ALPHABET_DATA,
  INDONESIAN_ALPHABET_NOTES,
  QUICK_SPELLING_WORDS,
} from './constants';
import { LetterCard } from './LetterCard';
import { ChevronRight, Copy, Play, Square } from 'lucide-react';
import './alphabet.css';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import {
  isSpeechSynthesisSupported,
  speakText,
  stopSpeech,
  waitForVoices,
} from '@/lib/tts/speech';

const RecordingControlsButton = dynamic(() => import('../../components/RecordingControlsButton'), {
  ssr: false,
});

type AlphabetProgressTabKey = 'alphabet' | 'alphabet_quick_spelling' | 'alphabet_notes';

const ALPHABET_PROGRESS_KEYS: readonly AlphabetProgressTabKey[] = [
  'alphabet',
  'alphabet_quick_spelling',
  'alphabet_notes',
];

const PRACTICE_COUNTRIES = [
  { name: 'United Kingdom', ipa: '/juˈnaɪ.tɪd ˈkɪŋ.dəm/' },
  { name: 'United States', ipa: '/juˈnaɪ.tɪd steɪts/' },
  { name: 'Canada', ipa: '/ˈkæn.ə.də/' },
  { name: 'Australia', ipa: '/ɔːˈstreɪl.jə/' },
  { name: 'New Zealand', ipa: '/nuː ˈziː.lənd/' },
] as const;

const LETTER_IPA_BY_LETTER = Object.fromEntries(
  ALPHABET_DATA.map((item) => [item.letter, item.ipa.replace(/^\/|\/$/g, '')]),
) as Record<string, string>;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const ALPHABET_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan semua kata yang saya ucapkan dalam rekaman ini. 2. Analisis setiap kata tersebut dengan fokus pada American Accent (General American). Nilai dan beri umpan balik pada pengucapan nama huruf alfabet (A-Z), kejelasan spelling, serta akurasi bunyi vokal dan konsonan. 3. Format Output: Sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Huruf/kata yang diucapkan. - Kolom 2: Status Kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan Balik spesifik yang menjelaskan secara singkat apa yang perlu diperbaiki.";

const AlphabetPage: React.FC = () => {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isPlayingPracticeAll, setIsPlayingPracticeAll] = useState(false);
  const [currentPlayingLetter, setCurrentPlayingLetter] = useState<string | null>(null);
  const [currentPlayingPracticeCountry, setCurrentPlayingPracticeCountry] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedProgressByTab, setSavedProgressByTab] = useState<Record<AlphabetProgressTabKey, boolean>>({
    alphabet: false,
    alphabet_quick_spelling: false,
    alphabet_notes: false,
  });
  const [isClient, setIsClient] = useState(false);
  const [isQuickSpellingOpen, setIsQuickSpellingOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [showPracticeIpa, setShowPracticeIpa] = useState(true);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingStatus, setSpellingStatus] = useState<'idle' | 'correct' | 'wrong' | 'empty'>('idle');
  
  const isPlayingRef = useRef(false);
  const isPlayingPracticeRef = useRef(false);
  const promptCopyTimeoutRef = useRef<number | null>(null);

  // Handle hydration
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      const nextSavedState: Record<AlphabetProgressTabKey, boolean> = {
        alphabet: currentProgress.alphabet != null,
        alphabet_quick_spelling: currentProgress.alphabet_quick_spelling != null,
        alphabet_notes: currentProgress.alphabet_notes != null,
      };
      // Use setTimeout to avoid cascading renders
      setTimeout(() => {
        setIsClient(true);
        setSavedProgressByTab(nextSavedState);
      }, 0);
    }
  }, []);

  useEffect(() => {
    void waitForVoices();
    return () => {
      isPlayingRef.current = false;
      isPlayingPracticeRef.current = false;
      stopSpeech();
    };
  }, []);

  const stopAlphabetPlayAll = () => {
    isPlayingRef.current = false;
    setIsPlayingAll(false);
    setCurrentPlayingLetter(null);
  };

  const stopPracticeCountriesPlayAll = () => {
    isPlayingPracticeRef.current = false;
    setIsPlayingPracticeAll(false);
    setCurrentPlayingPracticeCountry(null);
  };

  const speakEnglishText = async (
    text: string,
    rate = 0.82,
    cancelBeforeSpeak = true,
    retryIfVoiceNotReady = false,
  ) => {
    if (!isSpeechSynthesisSupported()) return false;
    await waitForVoices();
    const voicesBeforeSpeak = window.speechSynthesis.getVoices().length;
    await speakText(text, {
      preferredEnglish: 'en-US',
      rate,
      pitch: 1,
      volume: 1,
      cancelBeforeSpeak,
    });

    if (retryIfVoiceNotReady && voicesBeforeSpeak === 0) {
      await wait(140);
      await waitForVoices();
      await speakText(text, {
        preferredEnglish: 'en-US',
        rate,
        pitch: 1,
        volume: 1,
        cancelBeforeSpeak,
      });
    }

    return true;
  };

  const handlePlayLetter = async (letter: string) => {
    if (isPlayingPracticeRef.current) {
      stopPracticeCountriesPlayAll();
    }
    if (isPlayingRef.current) return;
    
    try {
      setCurrentPlayingLetter(letter);
      const didSpeak = await speakEnglishText(letter, 0.8, true, true);
      if (!didSpeak) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCurrentPlayingLetter(null);
    } catch (error) {
      console.error("Failed to play audio", error);
      setCurrentPlayingLetter(null);
    }
  };

  const handlePlayAll = async () => {
    if (isPlayingRef.current) {
      stopAlphabetPlayAll();
      stopSpeech();
      return;
    }

    if (isPlayingPracticeRef.current) {
      stopPracticeCountriesPlayAll();
      stopSpeech();
    }

    isPlayingRef.current = true;
    setIsPlayingAll(true);

    for (const item of ALPHABET_DATA) {
      if (!isPlayingRef.current) break;

      setCurrentPlayingLetter(item.letter);
      try {
        const didSpeak = await speakEnglishText(item.letter, 0.8, false, false);
        if (!didSpeak) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (isPlayingRef.current) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    stopAlphabetPlayAll();
  };

  const speakTextWithVoice = (text: string, rate = 0.82) =>
    new Promise<void>((resolve) => {
      if (!isSpeechSynthesisSupported()) {
        resolve();
        return;
      }
      void speakText(text, {
        preferredEnglish: 'en-US',
        rate,
        pitch: 1,
        volume: 1,
        cancelBeforeSpeak: false,
      }).then(() => resolve());
    });

  const speakCountryThenSpelling = async (
    country: string,
    shouldContinue?: () => boolean,
  ) => {
    await speakTextWithVoice(country, 0.82);
    if (shouldContinue && !shouldContinue()) return;
    await wait(240);

    const letters = country.toUpperCase().match(/[A-Z]/g) ?? [];
    for (let index = 0; index < letters.length; index += 1) {
      if (shouldContinue && !shouldContinue()) break;
      await speakTextWithVoice(letters[index], 0.78);
      if (index < letters.length - 1) {
        await wait(260);
      }
    }
  };

  const handlePlayPracticeCountry = async (country: string) => {
    try {
      if (isPlayingRef.current) {
        stopAlphabetPlayAll();
      }
      if (isPlayingPracticeRef.current) {
        stopPracticeCountriesPlayAll();
      }

      setCurrentPlayingPracticeCountry(country);

      if (isSpeechSynthesisSupported()) {
        stopSpeech();
        await speakCountryThenSpelling(country);
        setCurrentPlayingPracticeCountry(null);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setCurrentPlayingPracticeCountry(null);
      }
    } catch (error) {
      console.error('Failed to play country audio', error);
      setCurrentPlayingPracticeCountry(null);
    }
  };

  const handlePlayAllPracticeCountries = async () => {
    if (isPlayingPracticeRef.current) {
      stopPracticeCountriesPlayAll();
      stopSpeech();
      return;
    }

    if (isPlayingRef.current) {
      stopAlphabetPlayAll();
      stopSpeech();
    }

    isPlayingPracticeRef.current = true;
    setIsPlayingPracticeAll(true);
    setCurrentPlayingLetter(null);

    for (const countryEntry of PRACTICE_COUNTRIES) {
      const country = countryEntry.name;
      if (!isPlayingPracticeRef.current) break;

      setCurrentPlayingPracticeCountry(country);
      try {
        if ('speechSynthesis' in window) {
          await speakCountryThenSpelling(country, () => isPlayingPracticeRef.current);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }

        if (isPlayingPracticeRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 280));
        }
      } catch (error) {
        console.error(error);
      }
    }

    stopPracticeCountriesPlayAll();
  };

  const updateSavedTabFlag = (tabKey: AlphabetProgressTabKey, isSaved: boolean) => {
    setSavedProgressByTab((prev) => ({ ...prev, [tabKey]: isSaved }));
  };

  const handleSaveProgress = async (tabKey: AlphabetProgressTabKey, percentage: number) => {
    updateSavedTabFlag(tabKey, true);
    
    // Save to localStorage for persistence (client-side only)
    if (isClient && typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      currentProgress[tabKey] = percentage;
      localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));
      
      // Also update overall pronunciation progress
      const allProgress = Object.values(currentProgress) as number[];
      const averageProgress = allProgress.length > 0 
        ? Math.round(allProgress.reduce((acc: number, curr: number) => acc + curr, 0) / allProgress.length)
        : 0;
      
      const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
      dashboardProgress.pronunciation = averageProgress;
      localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
      
      console.log(`Alphabet progress saved (${tabKey}): ${percentage}%`);
    }
  };

  const handleUnsaveProgress = async (tabKey: AlphabetProgressTabKey) => {
    updateSavedTabFlag(tabKey, false);
    
    // Remove from localStorage (client-side only)
    if (isClient && typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      delete currentProgress[tabKey];

      const hasNoAlphabetTabProgress = ALPHABET_PROGRESS_KEYS.every((key) => currentProgress[key] == null);
      if (hasNoAlphabetTabProgress) {
        delete currentProgress.alphabet;
      }

      localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));

      // Recalculate pronunciation average after unsave.
      const allProgress = Object.values(currentProgress) as number[];
      const averageProgress = allProgress.length > 0
        ? Math.round(allProgress.reduce((acc: number, curr: number) => acc + curr, 0) / allProgress.length)
        : 0;
      const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
      dashboardProgress.pronunciation = averageProgress;
      localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
      
      console.log(`Alphabet progress removed (${tabKey})`);
    }
  };

  const normalizeSpelling = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, '');
  const getSpellingIpa = (value: string) => {
    const letters = value.toUpperCase().match(/[A-Z]/g) ?? [];
    const tokens = letters.map((letter) => LETTER_IPA_BY_LETTER[letter]).filter(Boolean);
    return tokens.length ? `/${tokens.join(' ')}/` : '-';
  };
  const extractLetterSequence = (value: string) => {
    const letters = value.match(/[A-Za-z]/g);
    return letters ? letters.join('').toUpperCase() : '';
  };
  const isExactSpellingMatch = (input: string, targetWord: string) => {
    const inputLetters = extractLetterSequence(input);
    const targetLetters = normalizeSpelling(targetWord);
    return (
      inputLetters.length > 0 &&
      inputLetters.length === targetLetters.length &&
      inputLetters === targetLetters
    );
  };
  const findMatchedSpellingWord = (input: string) =>
    QUICK_SPELLING_WORDS.find((word) => isExactSpellingMatch(input, word)) ?? null;

  const speakWordAndSpelling = async (word: string) => {
    if (!isSpeechSynthesisSupported()) {
      return;
    }

    const normalizedWord = normalizeSpelling(word);
    if (!normalizedWord) {
      return;
    }

    const speakWord = (text: string) =>
      new Promise<void>((resolve) => {
        void speakText(text, {
          preferredEnglish: 'en-US',
          rate: 0.82,
          pitch: 1,
          volume: 1,
          cancelBeforeSpeak: false,
        }).then(() => resolve());
      });

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    if (isPlayingRef.current) {
      stopAlphabetPlayAll();
    }

    if (isPlayingPracticeRef.current) {
      stopPracticeCountriesPlayAll();
    }

    stopSpeech();
    await speakWord(normalizedWord);
    await wait(250);

    const letters = normalizedWord.split('');
    for (let index = 0; index < letters.length; index += 1) {
      await speakWord(letters[index]);
      if (index < letters.length - 1) {
        await wait(320);
      }
    }
  };

  const handleCheckSpelling = () => {
    const cleanedInput = extractLetterSequence(spellingInput);

    if (!cleanedInput) {
      setSpellingStatus('empty');
      return;
    }

    const matchedWord = findMatchedSpellingWord(spellingInput);
    if (matchedWord) {
      setSpellingStatus('correct');
      void speakWordAndSpelling(matchedWord);
      return;
    }

    setSpellingStatus('wrong');
  };

  const spellingFeedback =
    spellingStatus === 'correct'
      ? 'Benar! Ejaan huruf kamu sudah tepat.'
      : spellingStatus === 'wrong'
        ? 'Belum tepat. Pastikan ejaan kamu cocok dengan salah satu kata di daftar chip.'
        : spellingStatus === 'empty'
          ? 'Ketik ejaan huruf dulu sebelum cek jawaban.'
          : 'Ketik ejaan kata dengan huruf per huruf.';

  const handleCopyPrompt = async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(ALPHABET_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy alphabet prompt:', error);
      setIsPromptCopied(false);
    }
  };

  useEffect(
    () => () => {
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
    },
    [],
  );

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
            data-tour="alphabet-play-all"
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
            isSaved={savedProgressByTab.alphabet}
            onSave={(percentage) => handleSaveProgress('alphabet', percentage)}
            onUnsave={() => handleUnsaveProgress('alphabet')}
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

        <section
          className={`alphabet-quick-spelling-panel ${isQuickSpellingOpen ? '' : 'collapsed'}`}
          aria-labelledby="alphabet-quick-spelling-title"
        >
          <button
            type="button"
            id="alphabet-quick-spelling-title"
            className="alphabet-section-toggle"
            aria-expanded={isQuickSpellingOpen}
            aria-controls="alphabet-quick-spelling-content"
            onClick={() => setIsQuickSpellingOpen((prev) => !prev)}
          >
            <span className="alphabet-quick-spelling-title">Latihan Quick Spelling</span>
            <span className="alphabet-section-toggle-icon-wrap" aria-hidden="true">
              <ChevronRight
                className={`alphabet-section-toggle-icon ${isQuickSpellingOpen ? 'open' : ''}`}
              />
            </span>
          </button>

          {isQuickSpellingOpen && (
            <div id="alphabet-quick-spelling-content" className="alphabet-section-content">
              <p className="alphabet-quick-spelling-hint">
                Tulis ejaan kata langsung dari input teks. Kamu bisa pakai format <strong>C-A-T</strong> atau <strong>CAT</strong>.
              </p>

              <div className="alphabet-quick-spelling-word-wrap">
                <span className="alphabet-quick-spelling-word-label">Daftar kata:</span>
                <div className="alphabet-quick-spelling-chip-list">
                  {QUICK_SPELLING_WORDS.map((word) => (
                    <span key={word} className="alphabet-quick-spelling-word-chip">
                      <span className="alphabet-quick-spelling-word">{word}</span>
                    </span>
                  ))}
                </div>
              </div>

              <label htmlFor="alphabet-quick-spelling-input" className="alphabet-quick-spelling-input-label">
                Ejaan huruf
              </label>
              <input
                id="alphabet-quick-spelling-input"
                type="text"
                className="alphabet-quick-spelling-input"
                value={spellingInput}
                placeholder="Contoh: C-A-T"
                onChange={(event) => setSpellingInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleCheckSpelling();
                  }
                }}
              />

              <div className="alphabet-quick-spelling-actions">
                <button
                  type="button"
                  className="alphabet-quick-spelling-btn alphabet-quick-spelling-btn-primary"
                  onClick={handleCheckSpelling}
                >
                  Cek Ejaan
                </button>
              </div>

              <p
                className={`alphabet-quick-spelling-feedback alphabet-quick-spelling-feedback-${spellingStatus}`}
                role="status"
              >
                {spellingFeedback}
              </p>
            </div>
          )}
        </section>

        <section
          className={`alphabet-notes-panel ${isNotesOpen ? '' : 'collapsed'}`}
          aria-labelledby="alphabet-notes-title"
        >
          <button
            type="button"
            id="alphabet-notes-title"
            className="alphabet-section-toggle"
            aria-expanded={isNotesOpen}
            aria-controls="alphabet-notes-content"
            onClick={() => setIsNotesOpen((prev) => !prev)}
          >
            <span className="alphabet-notes-title">Catatan untuk Penutur Indonesia</span>
            <span className="alphabet-section-toggle-icon-wrap" aria-hidden="true">
              <ChevronRight
                className={`alphabet-section-toggle-icon ${isNotesOpen ? 'open' : ''}`}
              />
            </span>
          </button>

          {isNotesOpen && (
            <div id="alphabet-notes-content" className="alphabet-section-content">
              <div className="alphabet-notes-card-grid">
                {INDONESIAN_ALPHABET_NOTES.map((note, index) => (
                  <article key={note} className="alphabet-note-card">
                    <span className="alphabet-note-card-index">{index + 1}</span>
                    <p>{note}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <section
          className={`alphabet-notes-panel ${isPracticeOpen ? '' : 'collapsed'}`}
          aria-labelledby="alphabet-practice-title"
        >
          <button
            type="button"
            id="alphabet-practice-title"
            className="alphabet-section-toggle"
            aria-expanded={isPracticeOpen}
            aria-controls="alphabet-practice-content"
            onClick={() => setIsPracticeOpen((prev) => !prev)}
          >
            <span className="alphabet-notes-title">Practice</span>
            <span className="alphabet-section-toggle-icon-wrap" aria-hidden="true">
              <ChevronRight
                className={`alphabet-section-toggle-icon ${isPracticeOpen ? 'open' : ''}`}
              />
            </span>
          </button>

          {isPracticeOpen && (
            <div id="alphabet-practice-content" className="alphabet-section-content">
              <div className="alphabet-practice-task">
                <div className="alphabet-practice-task-header">
                  <p className="alphabet-practice-task-title">Mission:</p>
                  <div className="alphabet-practice-task-actions">
                    <button
                      type="button"
                      onClick={() => setShowPracticeIpa((prev) => !prev)}
                      className={`alphabet-practice-toggle-btn ${showPracticeIpa ? 'active' : ''}`}
                      aria-pressed={showPracticeIpa}
                    >
                      {showPracticeIpa ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                    </button>
                    <button
                      type="button"
                      onClick={handlePlayAllPracticeCountries}
                      className={`alphabet-practice-playall-btn ${isPlayingPracticeAll ? 'playing' : ''}`}
                    >
                      {isPlayingPracticeAll ? (
                        <>
                          <Square size={14} />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} />
                          <span>Play All</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="alphabet-practice-task-text">
                  Eja semua huruf alfabet A-Z, lalu eja 5 nama negara berikut:
                </p>
                <ul className="alphabet-practice-country-list">
                  {PRACTICE_COUNTRIES.map((countryEntry) => (
                    <li
                      key={countryEntry.name}
                      className={`alphabet-practice-country-item ${
                        currentPlayingPracticeCountry === countryEntry.name ? 'is-playing' : ''
                      }`}
                      >
                      <div className="alphabet-practice-country-main">
                        <span>- {countryEntry.name}</span>
                        {showPracticeIpa && (
                          <>
                            <span className="alphabet-practice-country-ipa">IPA kata: {countryEntry.ipa}</span>
                            <span className="alphabet-practice-country-ipa">
                              IPA spelling: {getSpellingIpa(countryEntry.name)}
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        className="alphabet-practice-country-play"
                        onClick={() => void handlePlayPracticeCountry(countryEntry.name)}
                        aria-label={`Putar ${countryEntry.name}`}
                      >
                        <Play size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </section>

        <section
          className={`alphabet-notes-panel ${isPromptOpen ? '' : 'collapsed'}`}
          aria-labelledby="alphabet-prompt-title"
        >
          <button
            type="button"
            id="alphabet-prompt-title"
            className="alphabet-section-toggle"
            aria-expanded={isPromptOpen}
            aria-controls="alphabet-prompt-content"
            onClick={() => setIsPromptOpen((prev) => !prev)}
          >
            <span className="alphabet-notes-title">Prompt</span>
            <span className="alphabet-section-toggle-icon-wrap" aria-hidden="true">
              <ChevronRight
                className={`alphabet-section-toggle-icon ${isPromptOpen ? 'open' : ''}`}
              />
            </span>
          </button>

          {isPromptOpen && (
            <div id="alphabet-prompt-content" className="alphabet-section-content">
              <div className="alphabet-prompt-card">
                <div className="alphabet-prompt-header">
                  <p className="alphabet-practice-task-title">Prompt Penilaian Alphabet</p>
                  <button
                    type="button"
                    onClick={() => void handleCopyPrompt()}
                    className="alphabet-prompt-copy-btn"
                    aria-label="Salin prompt"
                    title="Salin prompt"
                  >
                    <Copy size={13} />
                    <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
                  </button>
                </div>
                <p className="alphabet-prompt-quote">
                  &quot;{ALPHABET_EVALUATION_PROMPT}&quot;
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <RecordingControlsButton
        className="alphabet-recording-anchor"
        downloadFileName="alphabet-GEUWAT-recording.wav"
      />
    </div>
  );
};

export default AlphabetPage;
