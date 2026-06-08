'use client'

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  ALPHABET_DATA,
  INDONESIAN_ALPHABET_NOTES,
  QUICK_SPELLING_WORDS,
} from './constants';
import { LetterCard } from './LetterCard';
import { ChevronRight, Copy, Play, Volume2 } from 'lucide-react';
import './alphabet.css';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import { IpaVisibilityToggle, ControlCenter, PlayStopButton } from '@/app/components';
import { useHaptic } from '@/lib/haptic/useHaptic';
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
  const { triggerHaptic } = useHaptic();
  const [savedProgressByTab, setSavedProgressByTab] = useState<Record<AlphabetProgressTabKey, boolean>>({
    alphabet: false,
    alphabet_quick_spelling: false,
    alphabet_notes: false,
  });
  const [isClient, setIsClient] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isQuickSpellingOpen, setIsQuickSpellingOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [showIpa, setShowIpa] = useState(true);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingStatus, setSpellingStatus] = useState<'idle' | 'correct' | 'wrong' | 'empty'>('idle');
  
  const isPlayingRef = useRef(false);
  const isPlayingPracticeRef = useRef(false);
  const practiceSectionRef = useRef<HTMLElement | null>(null);
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
    
    // Stop play all if active, but continue to play the clicked letter
    if (isPlayingRef.current) {
      stopAlphabetPlayAll();
      stopSpeech();
    }
    
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
    triggerHaptic('tap');
    
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
    triggerHaptic('tap');
    
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

  const scrollToPracticeSection = () => {
    if (practiceSectionRef.current) {
      practiceSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openPracticeSection = () => {
    setIsPracticeOpen(true);
    window.setTimeout(() => {
      scrollToPracticeSection();
    }, 50);
  };

  const handlePlayAllPracticeCountries = async () => {
    triggerHaptic('tap');
    
    if (isPlayingPracticeRef.current) {
      stopPracticeCountriesPlayAll();
      stopSpeech();
      return;
    }

    openPracticeSection();

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
    triggerHaptic('tap');
    
    const cleanedInput = extractLetterSequence(spellingInput);

    if (!cleanedInput) {
      setSpellingStatus('empty');
      return;
    }

    const matchedWord = findMatchedSpellingWord(spellingInput);
    if (matchedWord) {
      triggerHaptic('success');
      setSpellingStatus('correct');
      void speakWordAndSpelling(matchedWord);
      return;
    }

    triggerHaptic('error');
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
      triggerHaptic('success');
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy alphabet prompt:', error);
      triggerHaptic('error');
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

  useEffect(() => {
    if (currentPlayingPracticeCountry) {
      const activeItem = document.getElementById(`practice-country-${currentPlayingPracticeCountry.replace(/\s+/g, '-')}`);
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentPlayingPracticeCountry]);

  return (
    <div className="pronunciation-layout pronunciation-theme pronunciation-theme--alphabet alphabet-container">
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
            Kuasai dasar-dasar pengucapan bahasa Inggris dengan pembelajaran alfabet interaktif
          </p>
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
        <div id="alphabet-grid-section" className="alphabet-grid">
          {ALPHABET_DATA.map((item) => (
            <LetterCard
              key={item.letter}
              letter={item.letter}
              ipa={item.ipa}
              isPlaying={currentPlayingLetter === item.letter}
              onPlay={() => handlePlayLetter(item.letter)}
              showIpa={showIpa}
            />
          ))}
        </div>

        <section
          className={`alphabet-notes-panel ${isIntroOpen ? '' : 'collapsed'}`}
          aria-labelledby="alphabet-intro-title"
        >
          <button
            type="button"
            id="alphabet-intro-title"
            className="alphabet-section-toggle"
            aria-expanded={isIntroOpen}
            aria-controls="alphabet-intro-content"
            onClick={() => setIsIntroOpen((prev) => !prev)}
          >
            <span className="alphabet-notes-title">Mengenal Alphabet</span>
            <span className="alphabet-section-toggle-icon-wrap" aria-hidden="true">
              <ChevronRight
                className={`alphabet-section-toggle-icon ${isIntroOpen ? 'open' : ''}`}
              />
            </span>
          </button>

          {isIntroOpen && (
            <div id="alphabet-intro-content" className="alphabet-section-content">
              <div className="alphabet-intro-text">
                <p>
                  Alfabet adalah kumpulan 26 huruf standar (dari A sampai Z) yang kita gunakan untuk menulis kata-kata.
                </p>
                <p>
                  Namun uniknya, dalam bahasa Inggris, satu huruf bisa memiliki cara ucap yang berbeda-beda tergantung katanya. 
                  Oleh karena itu, di halaman ini kita kuasai dulu bentuk dan nama asli hurufnya. Ini akan menjadi fondasi 
                  penting sebelum kita belajar Simbol Fonetik atau IPA (International Phonetic Alphabet) di tahap berikutnya 
                  yaitu Phoentic Symbol yang menjadi panduan pasti cara mengucapkan setiap suara dengan benar.
                </p>
              </div>
            </div>
          )}
        </section>

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
            <span className="alphabet-quick-spelling-title">Latihan Mengeja</span>
            <span className="alphabet-section-toggle-icon-wrap" aria-hidden="true">
              <ChevronRight
                className={`alphabet-section-toggle-icon ${isQuickSpellingOpen ? 'open' : ''}`}
              />
            </span>
          </button>

          {isQuickSpellingOpen && (
            <div id="alphabet-quick-spelling-content" className="alphabet-section-content">
              <p className="alphabet-quick-spelling-hint">
                Ketik ejaan kata dari contoh tersedia. Kamu bisa pakai format <strong>C-A-T</strong> atau <strong>CAT</strong>.
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
          ref={practiceSectionRef}
          className={`alphabet-notes-panel ${isPracticeOpen ? '' : 'collapsed'}`}
          aria-labelledby="alphabet-practice-title"
          id="alphabet-practice-section"
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
                </div>
                <p className="alphabet-practice-task-text">
                  Ikuti instruksi di panel recording untuk mengeja semua huruf alfabet A-Z, lalu lanjutkan dengan mengeja 5 nama negara berikut:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {PRACTICE_COUNTRIES.map((countryEntry) => {
                  const isPlaying = currentPlayingPracticeCountry === countryEntry.name;
                  return (
                    <div
                      key={countryEntry.name}
                      id={`practice-country-${countryEntry.name.replace(/\s+/g, '-')}`}
                      className={`bg-[#101414] border rounded-lg p-6 transition-all duration-300 group flex flex-col gap-4 relative overflow-hidden ${
                        isPlaying
                          ? 'border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                          : 'border-white/15 hover:border-cyan-300/70'
                      }`}
                    >
                      {isPlaying && <div className="absolute inset-0 bg-cyan-300/5 pointer-events-none" />}
                      
                      <div className="flex justify-between items-start relative z-10 gap-4">
                        <div className="min-w-0">
                          <div className="font-sans text-2xl font-bold text-white break-words">
                            {countryEntry.name}
                          </div>
                        </div>

                        <button
                          onClick={() => void handlePlayPracticeCountry(countryEntry.name)}
                          className={`transition-transform shrink-0 ${
                            isPlaying 
                              ? 'text-cyan-200 scale-110' 
                              : 'text-white/40 group-hover:text-cyan-200 hover:scale-110'
                          }`}
                          aria-label={`Play ${countryEntry.name}`}
                          title={`Play ${countryEntry.name}`}
                        >
                          <Volume2 className={`w-8 h-8 ${isPlaying ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {showIpa && (
                        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 relative z-10 w-full overflow-hidden">
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-xs text-white/40 uppercase tracking-widest">IPA kata</span>
                            <div className="bg-black/30 border border-white/15 rounded px-3 py-2">
                              <span className="font-sans text-base text-cyan-200">
                                {countryEntry.ipa}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-xs text-white/40 uppercase tracking-widest">IPA spelling</span>
                            <div className="bg-white/5 rounded shadow-inner border border-white/10 px-3 py-2">
                              <span className="font-sans text-base text-cyan-200">
                                {getSpellingIpa(countryEntry.name)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {isPlaying && (
                        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-100 to-cyan-300 animate-pulse w-full" />
                      )}
                    </div>
                  );
                })}
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
      <ControlCenter
        topControls={
          <div>
            <IpaVisibilityToggle
              checked={showIpa}
              onChange={setShowIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
            />
          </div>
        }
        bottomControls={
          <div className="flex flex-col gap-2">
            <PlayStopButton
              isActive={isPlayingAll}
              label="ALPHABET"
              sectionId="alphabet-grid-section"
              onClick={handlePlayAll}
              data-tour="alphabet-play-all"
            />
            <PlayStopButton
              isActive={isPlayingPracticeAll}
              label="PRACTICE"
              sectionId="alphabet-practice-section"
              onClick={handlePlayAllPracticeCountries}
            />
          </div>
        }
      />

      <RecordingControlsButton
        className="alphabet-recording-anchor"
        downloadFileName="alphabet-GEUWAT-recording.mp3"
      />
    </div>
  );
};

export default AlphabetPage;
