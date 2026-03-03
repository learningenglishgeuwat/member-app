'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import './styles/portal.css';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import { primeBestEnglishVoice, speakWithBestEnglishVoice } from '../final-sound-new/tts-utils';
import { getSymbolSpeechProfile, hasSymbolSpeechProfile } from './data/symbolSpeechMap';

interface PhoneticSymbol {
  symbol: string;
  category: 'vowel' | 'consonant' | 'diphthong';
  subcategory?: 'lax' | 'tense' | 'voiced' | 'voiceless';
}

const phoneticSymbols: PhoneticSymbol[] = [
  // Vowels - Lax
  { symbol: '\u028c', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u026a', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u028a', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u025b', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u0259', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u025a', category: 'vowel', subcategory: 'lax' }, // ?

  // Vowels - Tense
  { symbol: '\u0251', category: 'vowel', subcategory: 'tense' }, // ?
  { symbol: 'i', category: 'vowel', subcategory: 'tense' },
  { symbol: 'u', category: 'vowel', subcategory: 'tense' },
  { symbol: '\u00e6', category: 'vowel', subcategory: 'tense' }, // æ
  { symbol: '\u0254', category: 'vowel', subcategory: 'tense' }, // ?

  // Consonants - Voiceless
  { symbol: 'p', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 't', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 'k', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 'f', category: 'consonant', subcategory: 'voiceless' },
  { symbol: '\u03b8', category: 'consonant', subcategory: 'voiceless' }, // ?
  { symbol: 's', category: 'consonant', subcategory: 'voiceless' },
  { symbol: '\u0283', category: 'consonant', subcategory: 'voiceless' }, // ?
  { symbol: '\u02a7', category: 'consonant', subcategory: 'voiceless' }, // ?
  { symbol: 'h', category: 'consonant', subcategory: 'voiceless' },

  // Consonants - Voiced
  { symbol: 'b', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'd', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'g', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'v', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u00f0', category: 'consonant', subcategory: 'voiced' }, // ð
  { symbol: 'z', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u0292', category: 'consonant', subcategory: 'voiced' }, // ?
  { symbol: '\u02a4', category: 'consonant', subcategory: 'voiced' }, // ?
  { symbol: 'l', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'm', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'n', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u014b', category: 'consonant', subcategory: 'voiced' }, // ?
  { symbol: 'r', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'w', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'y', category: 'consonant', subcategory: 'voiced' },

  // Diphthongs
  { symbol: 'a\u026a', category: 'diphthong' }, // a?
  { symbol: 'e\u026a', category: 'diphthong' }, // e?
  { symbol: '\u0254\u026a', category: 'diphthong' }, // ??
  { symbol: '\u026a\u0259', category: 'diphthong' }, // ??
  { symbol: 'e\u0259', category: 'diphthong' }, // e?
  { symbol: '\u028a\u0259', category: 'diphthong' }, // ??
  { symbol: 'o\u028a', category: 'diphthong' }, // o?
  { symbol: 'a\u028a', category: 'diphthong' }, // a?
];

const PhoneticPortal: React.FC = () => {
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [spinningCard, setSpinningCard] = useState<string | null>(null);
  const [isSymbolTableOpen, setIsSymbolTableOpen] = useState(false);
  const [activeSpeakingSymbol, setActiveSpeakingSymbol] = useState<string | null>(null);
  const [isPlayingAllSymbols, setIsPlayingAllSymbols] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const symbolSpeakResetRef = useRef<number | null>(null);
  const playAllSymbolTimeoutRef = useRef<number | null>(null);
  const playAllSymbolSessionRef = useRef(0);
  // Dedupe prefetch per lifecycle halaman agar hover/focus tidak spam request path yang sama.
  const prefetchedPathsRef = useRef<Set<string>>(new Set());
  const router = useRouter();
  const getSymbolDetailPath = useCallback(
    (symbol: string) => `/skill/pronunciation/phoneticSymbols/${encodeURIComponent(symbol)}`,
    [],
  );

  const prefetchPath = useCallback(
    (path: string) => {
      const normalizedPath = path.trim();
      if (!normalizedPath) return;
      if (typeof navigator !== 'undefined' && !navigator.onLine) return;
      if (prefetchedPathsRef.current.has(normalizedPath)) return;

      prefetchedPathsRef.current.add(normalizedPath);
      void Promise.resolve(router.prefetch(normalizedPath)).catch(() => {
        // Ignore prefetch failures to avoid blocking navigation flow.
      });
    },
    [router],
  );

  const symbolTableGroups = useMemo(
    () => [
      {
        id: 'vowel-lax',
        title: 'Vowel (Lax)',
        symbols: phoneticSymbols.filter((item) => item.category === 'vowel' && item.subcategory === 'lax'),
      },
      {
        id: 'vowel-tense',
        title: 'Vowel (Tense)',
        symbols: phoneticSymbols.filter((item) => item.category === 'vowel' && item.subcategory === 'tense'),
      },
      {
        id: 'diphthong',
        title: 'Diphthong',
        symbols: phoneticSymbols.filter((item) => item.category === 'diphthong'),
      },
      {
        id: 'consonant-voiceless',
        title: 'Consonant (Voiceless)',
        symbols: phoneticSymbols.filter(
          (item) => item.category === 'consonant' && item.subcategory === 'voiceless',
        ),
      },
      {
        id: 'consonant-voiced',
        title: 'Consonant (Voiced)',
        symbols: phoneticSymbols.filter((item) => item.category === 'consonant' && item.subcategory === 'voiced'),
      },
    ],
    [],
  );

  const symbolPlayAllQueue = useMemo(
    () => symbolTableGroups.flatMap((group) => group.symbols.map((item) => item.symbol)),
    [symbolTableGroups],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const uniqueSymbols = Array.from(new Set(phoneticSymbols.map((item) => item.symbol)));
    const missingProfiles = uniqueSymbols.filter((symbol) => !hasSymbolSpeechProfile(symbol));

    if (missingProfiles.length > 0) {
      console.warn('[PhoneticPortal] Missing symbol speech profiles:', missingProfiles);
    }
  }, []);

  const togglePortal = (portalId: string) => {
    if (activePortal === portalId) {
      setActivePortal(null);
      setSpinningCard(null);
      return;
    }

    setSpinningCard(portalId);
    window.setTimeout(() => {
      setActivePortal(portalId);
      setSpinningCard(null);
    }, 3000);
  };

  const stopCurrentSymbolSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    playAllSymbolSessionRef.current += 1;
    setIsPlayingAllSymbols(false);

    if (symbolSpeakResetRef.current) {
      window.clearTimeout(symbolSpeakResetRef.current);
      symbolSpeakResetRef.current = null;
    }

    if (playAllSymbolTimeoutRef.current) {
      window.clearTimeout(playAllSymbolTimeoutRef.current);
      playAllSymbolTimeoutRef.current = null;
    }

    setActiveSpeakingSymbol(null);
  }, []);

  const openSymbolTable = useCallback(() => {
    setIsSymbolTableOpen(true);
  }, []);

  const closeSymbolTable = useCallback(() => {
    setIsSymbolTableOpen(false);
    stopCurrentSymbolSpeech();
  }, [stopCurrentSymbolSpeech]);

  const speakSymbol = useCallback(
    async (symbol: string) => {
      stopCurrentSymbolSpeech();
      setActiveSpeakingSymbol(symbol);
      const symbolSpeechProfile = getSymbolSpeechProfile(symbol);
      await primeBestEnglishVoice();
      await speakWithBestEnglishVoice(symbolSpeechProfile.prompt, {
        rate: symbolSpeechProfile.rate,
        pitch: symbolSpeechProfile.pitch,
        volume: symbolSpeechProfile.volume,
      });

      symbolSpeakResetRef.current = window.setTimeout(() => {
        setActiveSpeakingSymbol((current) => (current === symbol ? null : current));
        symbolSpeakResetRef.current = null;
      }, 1300);
    },
    [stopCurrentSymbolSpeech],
  );

  const playAllSymbols = useCallback(async () => {
    if (!symbolPlayAllQueue.length) return;

    stopCurrentSymbolSpeech();
    await primeBestEnglishVoice();

    const playbackSession = playAllSymbolSessionRef.current + 1;
    playAllSymbolSessionRef.current = playbackSession;
    setIsPlayingAllSymbols(true);

    let currentIndex = 0;

    const playNext = async () => {
      if (playAllSymbolSessionRef.current !== playbackSession) return;

      if (currentIndex >= symbolPlayAllQueue.length) {
        setIsPlayingAllSymbols(false);
        setActiveSpeakingSymbol(null);
        playAllSymbolTimeoutRef.current = null;
        return;
      }

      const symbol = symbolPlayAllQueue[currentIndex];
      const symbolSpeechProfile = getSymbolSpeechProfile(symbol);
      setActiveSpeakingSymbol(symbol);

      await speakWithBestEnglishVoice(symbolSpeechProfile.prompt, {
        rate: symbolSpeechProfile.rate,
        pitch: symbolSpeechProfile.pitch,
        volume: symbolSpeechProfile.volume,
      });

      currentIndex += 1;
      const baseDelayMs = 1200;
      const rateFactor = symbolSpeechProfile.rate ? 0.72 / symbolSpeechProfile.rate : 1;
      const nextDelayMs = Math.max(900, Math.round(baseDelayMs * rateFactor));

      playAllSymbolTimeoutRef.current = window.setTimeout(() => {
        void playNext();
      }, nextDelayMs);
    };

    void playNext();
  }, [symbolPlayAllQueue, stopCurrentSymbolSpeech]);

  const togglePlayAllSymbols = useCallback(() => {
    if (isPlayingAllSymbols) {
      stopCurrentSymbolSpeech();
      return;
    }

    void playAllSymbols();
  }, [isPlayingAllSymbols, playAllSymbols, stopCurrentSymbolSpeech]);

  useEffect(() => {
    if (!isSymbolTableOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSymbolTable();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSymbolTableOpen, closeSymbolTable]);

  useEffect(() => {
    return () => {
      stopCurrentSymbolSpeech();
    };
  }, [stopCurrentSymbolSpeech]);

  const handleSymbolClick = (symbol: PhoneticSymbol) => {
    const path = getSymbolDetailPath(symbol.symbol);
    prefetchPath(path);
    router.push(path);
  };

  const handleMinimalPairsClick = () => {
    const path = '/skill/pronunciation/phoneticSymbols/MinimalPairs';
    prefetchPath(path);
    router.push(path);
  };

  const handleSummaryClick = () => {
    const path = '/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols';
    prefetchPath(path);
    router.push(path);
  };

  const handleTongueTwisterClick = () => {
    const path = '/skill/pronunciation/phoneticSymbols/tongue-twister';
    prefetchPath(path);
    router.push(path);
  };

  const getSymbolsByCategory = (category: string, subcategory?: string) =>
    phoneticSymbols.filter((symbol) => symbol.category === category && (!subcategory || symbol.subcategory === subcategory));

  return (
    <div className="pronunciation-layout futuristic-portal-container">
      <div className="cyber-grid" />
      <div className="cyber-particles" />
      <div className="glow-overlay" />

      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="futuristic-portal-main">
        <div className="portal-title">
          <h1 className="title-text">PHONETIC PORTAL</h1>
          <div className="title-underline" />
        </div>

        <div className="portal-grid">
          <div
            className={`portal-card ${activePortal === 'vowel' ? 'active' : ''}`}
            onClick={() => togglePortal('vowel')}
            data-tour="phonetic-portal-vowel"
          >
            <div className="card-content">
              <div className="card-icon">
                <div className={`icon-circle ${spinningCard === 'vowel' ? 'spinning' : ''}`}>
                  <span className="icon-text">V</span>
                </div>
              </div>
              <h2 className="card-title">VOWELS</h2>
              <p className="card-description">Explore vowel sounds</p>
            </div>
          </div>

          <div className={`portal-card ${activePortal === 'diphthong' ? 'active' : ''}`} onClick={() => togglePortal('diphthong')}>
            <div className="card-content">
              <div className="card-icon">
                <div className={`icon-circle ${spinningCard === 'diphthong' ? 'spinning' : ''}`}>
                  <span className="icon-text">D</span>
                </div>
              </div>
              <h2 className="card-title">DIPHTHONGS</h2>
              <p className="card-description">Explore diphthong sounds</p>
            </div>
          </div>

          <div className={`portal-card ${activePortal === 'consonant' ? 'active' : ''}`} onClick={() => togglePortal('consonant')}>
            <div className="card-content">
              <div className="card-icon">
                <div className={`icon-circle ${spinningCard === 'consonant' ? 'spinning' : ''}`}>
                  <span className="icon-text">C</span>
                </div>
              </div>
              <h2 className="card-title">CONSONANTS</h2>
              <p className="card-description">Explore consonant sounds</p>
            </div>
          </div>
        </div>

        <div className="symbol-table-trigger-wrap">
          <button
            type="button"
            onClick={openSymbolTable}
            className="symbol-table-trigger-btn"
            aria-label="Open Phonetic Symbol Chart"
          >
            PHONETIC SYMBOL CHART
          </button>
        </div>

        <div className="common-mistakes-wrap">
          <button
            type="button"
            onClick={handleMinimalPairsClick}
            onMouseEnter={() => prefetchPath('/skill/pronunciation/phoneticSymbols/MinimalPairs')}
            onFocus={() => prefetchPath('/skill/pronunciation/phoneticSymbols/MinimalPairs')}
            className="common-mistakes-btn"
          >
            COMMON MISTAKES
          </button>
          <button
            type="button"
            onClick={handleTongueTwisterClick}
            onMouseEnter={() => prefetchPath('/skill/pronunciation/phoneticSymbols/tongue-twister')}
            onFocus={() => prefetchPath('/skill/pronunciation/phoneticSymbols/tongue-twister')}
            className="common-mistakes-btn"
          >
            TONGUE TWISTER
          </button>
          <button
            type="button"
            onClick={handleSummaryClick}
            onMouseEnter={() => prefetchPath('/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols')}
            onFocus={() => prefetchPath('/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols')}
            className="common-mistakes-btn"
          >
            SUMMARY
          </button>
        </div>

        {isSymbolTableOpen && (
          <div
            className="symbol-table-modal-overlay"
            onClick={closeSymbolTable}
            role="presentation"
          >
            <section
              className="symbol-table-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Phonetic Symbol Chart"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="symbol-table-modal-header">
                <h3 className="symbol-table-modal-title">PHONETIC SYMBOL CHART</h3>
                <button
                  type="button"
                  className="symbol-table-modal-close"
                  onClick={closeSymbolTable}
                  aria-label="Close symbol table modal"
                >
                  ×
                </button>
              </header>
              <div className="symbol-table-modal-content">
                <div className="symbol-table-modal-note-row">
                  <button
                    type="button"
                    onClick={togglePlayAllSymbols}
                    className={`symbol-table-play-all-btn ${isPlayingAllSymbols ? 'is-active' : ''}`}
                    aria-label={isPlayingAllSymbols ? 'Stop play all symbols' : 'Play all symbols'}
                  >
                    {isPlayingAllSymbols ? 'STOP' : 'PLAY ALL'}
                  </button>
                </div>

                {symbolTableGroups.map((group) => (
                  <div key={group.id} className="symbol-table-group">
                    <h4 className="symbol-table-group-title">{group.title}</h4>
                    <div className="symbol-table-grid">
                      {group.symbols.map((symbolItem) => (
                        <button
                          key={`${group.id}-${symbolItem.symbol}`}
                          type="button"
                          className={`symbol-table-symbol-btn ${
                            activeSpeakingSymbol === symbolItem.symbol ? 'is-speaking' : ''
                          }`}
                          onClick={() => void speakSymbol(symbolItem.symbol)}
                          aria-label={`Play symbol ${symbolItem.symbol}`}
                        >
                          {symbolItem.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activePortal && (
          <div className="symbol-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                {activePortal === 'vowel' && 'VOWEL SYMBOLS'}
                {activePortal === 'consonant' && 'CONSONANT SYMBOLS'}
                {activePortal === 'diphthong' && 'DIPHTHONG SYMBOLS'}
              </h3>
              <button className="close-panel" onClick={() => setActivePortal(null)}>
                ×
              </button>
            </div>

            <div className="symbol-content">
              {activePortal === 'vowel' && (
                <>
                  <div className="symbol-group">
                    <h4 className="group-title">Lax Vowels</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('vowel', 'lax').map((symbol) => (
                        <button
                          key={symbol.symbol}
                          className="symbol-btn"
                          onClick={() => handleSymbolClick(symbol)}
                          onMouseEnter={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                          onFocus={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                          data-tour={symbol.symbol === '\u028c' ? 'phonetic-symbol-uh' : undefined}
                        >
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="symbol-group">
                    <h4 className="group-title">Tense Vowels</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('vowel', 'tense').map((symbol) => (
                        <button
                          key={symbol.symbol}
                          className="symbol-btn"
                          onClick={() => handleSymbolClick(symbol)}
                          onMouseEnter={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                          onFocus={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                        >
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePortal === 'consonant' && (
                <>
                  <div className="symbol-group">
                    <h4 className="group-title">Voiceless</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('consonant', 'voiceless').map((symbol) => (
                        <button
                          key={symbol.symbol}
                          className="symbol-btn"
                          onClick={() => handleSymbolClick(symbol)}
                          onMouseEnter={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                          onFocus={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                        >
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="symbol-group">
                    <h4 className="group-title">Voiced</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('consonant', 'voiced').map((symbol) => (
                        <button
                          key={symbol.symbol}
                          className="symbol-btn"
                          onClick={() => handleSymbolClick(symbol)}
                          onMouseEnter={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                          onFocus={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                        >
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePortal === 'diphthong' && (
                <div className="symbol-group">
                  <h4 className="group-title">Diphthongs</h4>
                  <div className="symbol-grid">
                    {getSymbolsByCategory('diphthong').map((symbol) => (
                      <button
                        key={symbol.symbol}
                        className="symbol-btn"
                        onClick={() => handleSymbolClick(symbol)}
                        onMouseEnter={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                        onFocus={() => prefetchPath(getSymbolDetailPath(symbol.symbol))}
                      >
                        {symbol.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PhoneticPortal;
