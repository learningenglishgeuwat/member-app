'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHaptic } from '@/lib/haptic/useHaptic';
import { useAudio } from '@/lib/audio/useAudio';
import './styles/portal.css';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import { primeBestEnglishVoice, speakWithBestEnglishVoice } from '../final-sound-new/tts-utils';
import { getSymbolSpeechProfile, hasSymbolSpeechProfile } from './data/symbolSpeechMap';
import { getCommonLetterByIPA } from './data/commonLetters/CommonLetters';
import { ACUAN_SUARA_GROUPS } from './data/acuanSuaraData';

interface PhoneticSymbol {
  symbol: string;
  category: 'vowel' | 'consonant' | 'diphthong';
  subcategory?: 'lax' | 'tense' | 'voiced' | 'voiceless';
}

const phoneticSymbols: PhoneticSymbol[] = [
  // Vowels - Lax (Urutan: ʌ, ɪ, ʊ, ɛ, ə, ɚ)
  { symbol: '\u028c', category: 'vowel', subcategory: 'lax' }, 
  { symbol: '\u026a', category: 'vowel', subcategory: 'lax' }, 
  { symbol: '\u028a', category: 'vowel', subcategory: 'lax' }, 
  { symbol: '\u025b', category: 'vowel', subcategory: 'lax' }, 
  { symbol: '\u0259', category: 'vowel', subcategory: 'lax' }, 
  { symbol: '\u025a', category: 'vowel', subcategory: 'lax' }, 

  // Vowels - Tense (Urutan: ɑ, i, u, æ, ɔ)
  { symbol: '\u0251', category: 'vowel', subcategory: 'tense' }, 
  { symbol: 'i', category: 'vowel', subcategory: 'tense' },
  { symbol: 'u', category: 'vowel', subcategory: 'tense' },
  { symbol: '\u00e6', category: 'vowel', subcategory: 'tense' }, 
  { symbol: '\u0254', category: 'vowel', subcategory: 'tense' }, 

  // Diphthongs (Urutan: aɪ, eɪ, ɔɪ, ɪr, ɛr, ʊr, oʊ, aʊ)
  { symbol: 'a\u026a', category: 'diphthong' }, 
  { symbol: 'e\u026a', category: 'diphthong' }, 
  { symbol: '\u0254\u026a', category: 'diphthong' }, 
  { symbol: '\u026ar', category: 'diphthong' }, 
  { symbol: '\u025br', category: 'diphthong' }, // Standardisasi ke unicode escape
  { symbol: '\u028ar', category: 'diphthong' }, 
  { symbol: 'o\u028a', category: 'diphthong' }, 
  { symbol: 'a\u028a', category: 'diphthong' },

  // Consonants - Voiceless (Urutan: p, t, k, f, θ, s, ʃ, ʧ, h)
  { symbol: 'p', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 't', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 'k', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 'f', category: 'consonant', subcategory: 'voiceless' },
  { symbol: '\u03b8', category: 'consonant', subcategory: 'voiceless' }, 
  { symbol: 's', category: 'consonant', subcategory: 'voiceless' },
  { symbol: '\u0283', category: 'consonant', subcategory: 'voiceless' }, 
  { symbol: '\u02a7', category: 'consonant', subcategory: 'voiceless' }, 
  { symbol: 'h', category: 'consonant', subcategory: 'voiceless' },

  // Consonants - Voiced (Urutan: b, d, g, v, ð, z, ʒ, ʤ, l, m, n, ŋ, r, w, j)
  { symbol: 'b', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'd', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'g', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'v', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u00f0', category: 'consonant', subcategory: 'voiced' }, 
  { symbol: 'z', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u0292', category: 'consonant', subcategory: 'voiced' }, 
  { symbol: '\u02a4', category: 'consonant', subcategory: 'voiced' }, 
  { symbol: 'l', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'm', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'n', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u014b', category: 'consonant', subcategory: 'voiced' }, 
  { symbol: 'r', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'w', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'j', category: 'consonant', subcategory: 'voiced' },
];

const PhoneticPortal: React.FC = () => {
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [spinningCard, setSpinningCard] = useState<string | null>(null);
  const [isSymbolTableOpen, setIsSymbolTableOpen] = useState(false);
  const [isAcuanSuaraOpen, setIsAcuanSuaraOpen] = useState(false);
  const [activeSpeakingSymbol, setActiveSpeakingSymbol] = useState<string | null>(null);
  const [isPlayingAllSymbols, setIsPlayingAllSymbols] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const symbolSpeakResetRef = useRef<number | null>(null);
  const playAllSymbolTimeoutRef = useRef<number | null>(null);
  const playAllSymbolSessionRef = useRef(0);
  const prefetchedPathsRef = useRef<Set<string>>(new Set());
  const router = useRouter();
  const { triggerHaptic } = useHaptic();
  const { triggerTap } = useAudio();

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
        // Ignore prefetch failures
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
    triggerHaptic('tap');
    triggerTap();
    if (activePortal === portalId) {
      setActivePortal(null);
      return;
    }
    setActivePortal(portalId);
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

  const openIntroModal = useCallback(() => {
    setIsIntroModalOpen(true);
  }, []);

  const closeIntroModal = useCallback(() => {
    setIsIntroModalOpen(false);
  }, []);

  const openAcuanSuara = useCallback(() => {
    setIsAcuanSuaraOpen(true);
  }, []);

  const closeAcuanSuara = useCallback(() => {
    setIsAcuanSuaraOpen(false);
  }, []);

  const getExampleWordForSymbol = useCallback((symbol: string): string | null => {
    const ipaSymbol = `/${symbol}/`;
    const commonLetter = getCommonLetterByIPA(ipaSymbol);
    
    if (!commonLetter || !commonLetter.examples || commonLetter.examples.length === 0) {
      return null;
    }

    const allWords: string[] = [];
    for (const example of commonLetter.examples) {
      const parts = example.split('->');
      if (parts.length === 2) {
        const words = parts[1].split(',').map(w => w.trim());
        allWords.push(...words);
      }
    }

    if (allWords.length === 0) return null;

    const oneSyllableWords = allWords.filter(word => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      return cleanWord.length <= 5 && !word.includes(' ');
    });

    if (oneSyllableWords.length > 0) {
      return oneSyllableWords[0];
    }

    const sortedByLength = [...allWords].sort((a, b) => {
      const aLen = a.replace(/[^a-zA-Z]/g, '').length;
      const bLen = b.replace(/[^a-zA-Z]/g, '').length;
      return aLen - bLen;
    });

    return sortedByLength[0] || allWords[0];
  }, []);

  const speakSymbol = useCallback(
    async (symbol: string) => {
      stopCurrentSymbolSpeech();
      setActiveSpeakingSymbol(symbol);
      
      const exampleWord = getExampleWordForSymbol(symbol);
      
      await primeBestEnglishVoice();
      
      if (exampleWord) {
        await speakWithBestEnglishVoice(exampleWord, {
          rate: 0.85,
          pitch: 1.0,
          volume: 1.0,
        });
      } else {
        const symbolSpeechProfile = getSymbolSpeechProfile(symbol);
        await speakWithBestEnglishVoice(symbolSpeechProfile.prompt, {
          rate: symbolSpeechProfile.rate,
          pitch: symbolSpeechProfile.pitch,
          volume: symbolSpeechProfile.volume,
        });
      }

      symbolSpeakResetRef.current = window.setTimeout(() => {
        setActiveSpeakingSymbol((current) => (current === symbol ? null : current));
        symbolSpeakResetRef.current = null;
      }, 1300);
    },
    [stopCurrentSymbolSpeech, getExampleWordForSymbol],
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
      setActiveSpeakingSymbol(symbol);
      
      const exampleWord = getExampleWordForSymbol(symbol);
      
      if (exampleWord) {
        await speakWithBestEnglishVoice(exampleWord, {
          rate: 0.85,
          pitch: 1.0,
          volume: 1.0,
        });
      } else {
        const symbolSpeechProfile = getSymbolSpeechProfile(symbol);
        await speakWithBestEnglishVoice(symbolSpeechProfile.prompt, {
          rate: symbolSpeechProfile.rate,
          pitch: symbolSpeechProfile.pitch,
          volume: symbolSpeechProfile.volume,
        });
      }

      currentIndex += 1;
      const baseDelayMs = 1200;
      const nextDelayMs = Math.max(900, baseDelayMs);

      playAllSymbolTimeoutRef.current = window.setTimeout(() => {
        void playNext();
      }, nextDelayMs);
    };

    void playNext();
  }, [symbolPlayAllQueue, stopCurrentSymbolSpeech, getExampleWordForSymbol]);

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
    if (!isIntroModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeIntroModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [isIntroModalOpen, closeIntroModal]);

  useEffect(() => {
    return () => {
      stopCurrentSymbolSpeech();
    };
  }, [stopCurrentSymbolSpeech]);

  const handleSymbolClick = (symbol: PhoneticSymbol) => {
    triggerHaptic('tap');
    const path = getSymbolDetailPath(symbol.symbol);
    prefetchPath(path);
    router.push(path);
  };

  const handleMinimalPairsClick = () => {
    triggerHaptic('tap');
    const path = '/skill/pronunciation/phoneticSymbols/MinimalPairs';
    prefetchPath(path);
    router.push(path);
  };

  const handleSummaryClick = () => {
    triggerHaptic('tap');
    const path = '/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols';
    prefetchPath(path);
    router.push(path);
  };

  const handleAmEVsBrEClick = () => {
    const path = '/skill/pronunciation/phoneticSymbols/ame-vs-bre';
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
              <p className="card-description">Jelajahi bunyi vokal</p>
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
              <p className="card-description">Jelajahi bunyi diftong</p>
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
              <p className="card-description">Jelajahi bunyi konsonan</p>
            </div>
          </div>
        </div>

        <div className="intro-card-wrap">
          <button
            type="button"
            onClick={openIntroModal}
            className="intro-card-btn"
            aria-label="Mengenal Phonetic Symbol"
          >
            MENGENAL PHONETIC SYMBOL
          </button>
        </div>

        <div className="symbol-table-trigger-wrap">
          <button
            type="button"
            onClick={openSymbolTable}
            className="symbol-table-trigger-btn"
            aria-label="Open Phonetic Symbol Chart"
          >
            TABEL SIMBOL FONETIK
          </button>
        </div>

        <div className="common-mistakes-wrap">
          <button
            type="button"
            onClick={handleMinimalPairsClick}
            className="common-mistakes-btn"
          >
            KESALAHAN UMUM
          </button>
          <button
            type="button"
            onClick={handleSummaryClick}
            className="common-mistakes-btn"
          >
            RANGKUMAN
          </button>
          <button
            type="button"
            onClick={handleAmEVsBrEClick}
            className="common-mistakes-btn"
          >
            AmE VS BrE
          </button>
        </div>

        <div className="acuan-suara-wrap">
          <button
            type="button"
            onClick={openAcuanSuara}
            className="acuan-suara-btn"
            aria-label="Open Sound Reference Guide"
          >
            ACUAN SUARA
          </button>
        </div>

        {isIntroModalOpen && (
          <div
            className="symbol-table-modal-overlay"
            onClick={closeIntroModal}
            role="presentation"
          >
            <section
              className="intro-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Mengenal Phonetic Symbol"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="symbol-table-modal-header">
                <h3 className="symbol-table-modal-title">Apa itu Simbol Fonetik?</h3>
                <button
                  type="button"
                  className="symbol-table-modal-close"
                  onClick={closeIntroModal}
                  aria-label="Close intro modal"
                >
                  ×
                </button>
              </header>
              <div className="intro-modal-content">
                <div className="intro-section">
                  <p className="intro-subtitle">Mari kita pahami fungsinya secara ilmiah agar kamu bisa belajar mandiri ke depannya.</p>
                  
                  <p className="intro-text">
                    <strong>Simbol Fonetik</strong> adalah sistem karakter standar internasional dikenal sebagai <em>International Phonetic Alphabet</em> atau <strong>(IPA)</strong> yang digunakan untuk mendefinisikan dan memetakan setiap bunyi spesifik dalam bahasa manusia secara akurat.
                  </p>
                  
                  <p className="intro-text">
                    Sederhananya, jika alfabet biasa (A-Z) digunakan untuk <strong>menulis</strong>, maka <strong>Phonetic Symbol</strong> adalah alfabet khusus yang digunakan untuk <strong>mengucapkan</strong>.
                  </p>
                </div>

                <div className="intro-section">
                  <h4 className="intro-heading">Mengapa Kamu Wajib Menguasai Sistem Ini?</h4>
                  
                  <p className="intro-text">
                    Dalam bahasa Inggris, tulisan sering kali menipu. Satu huruf yang sama bisa menghasilkan bunyi yang sangat berbeda.
                  </p>
                  
                  <div className="intro-examples">
                    <div className="intro-example-item">
                      <span className="example-word">Cat</span>
                      <span className="example-arrow">→</span>
                      <span className="example-desc">huruf 'A' berbunyi /æ/ (suara 'a' lebar/tipis)</span>
                    </div>
                    <div className="intro-example-item">
                      <span className="example-word">Car</span>
                      <span className="example-arrow">→</span>
                      <span className="example-desc">huruf 'A' berbunyi /ɑr/ (suara 'a' dalam/panjang)</span>
                    </div>
                    <div className="intro-example-item">
                      <span className="example-word">Name</span>
                      <span className="example-arrow">→</span>
                      <span className="example-desc">huruf 'A' berbunyi /eɪ/ (suara ganda/meluncur)</span>
                    </div>
                  </div>
                </div>

                <div className="intro-section">
                  <h4 className="intro-heading">Goal Utama Kita</h4>
                  
                  <p className="intro-text">
                    <strong>Melatihmu agar bisa mandiri.</strong> Begitu kamu menguasai simbol-simbol ini, kamu bisa mandiri setiap kali menemukan kosakata baru. Cukup buka kamus digital/fisik, lihat simbol fonetik di samping katanya, dan kamu bisa langsung mengucapkannya dengan <strong>100% akurat!</strong>
                  </p>
                </div>

                <div className="intro-section">
                  <h4 className="intro-heading">Strategi Latihan: Tebakan Awal vs Validasi Kamus</h4>
                  
                  <p className="intro-text">
                    Untuk membantumu belajar lebih cepat, di dalam setiap materi kita akan menggunakan dua pilar:
                  </p>
                  
                  <div className="intro-strategy">
                    <div className="strategy-item">
                      <div className="strategy-title">Common Letter (Tebakan Awal)</div>
                      <div className="strategy-desc">
                        Kita akan mempelajari pola huruf umum yang biasanya menghasilkan bunyi tertentu. Ini modal utamamu untuk "menebak" cara baca sebuah kata baru secara intuitif.
                      </div>
                    </div>
                    
                    <div className="strategy-item">
                      <div className="strategy-title">Phonetic Symbol (Validasi Pasti)</div>
                      <div className="strategy-desc">
                        Simbol fonetik di kamus adalah hakim garisnya. Ini yang akan memvalidasi apakah tebakan awalmu berdasarkan pola huruf tadi sudah benar atau merupakan pengecualian.
                      </div>
                    </div>
                  </div>
                  
                  <div className="intro-formula">
                    <div className="formula-line">
                      <span className="formula-term">Common Letter (Pola Huruf)</span>
                      <span className="formula-arrow">→</span>
                      <span className="formula-result">Tebakan Intuitif</span>
                    </div>
                    <div className="formula-line">
                      <span className="formula-term">Phonetic Symbol (Kamus)</span>
                      <span className="formula-arrow">→</span>
                      <span className="formula-result">Akurasi Mutlak (Mandiri)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

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
                <h3 className="symbol-table-modal-title">TABEL SIMBOL FONETIK</h3>
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
          <div
            className="symbol-panel-overlay"
            onClick={() => setActivePortal(null)}
            role="presentation"
          >
          <div className="symbol-panel" onClick={(e) => e.stopPropagation()}>
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
                      >
                        {symbol.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {isAcuanSuaraOpen && (
          <div
            className="symbol-table-modal-overlay"
            onClick={closeAcuanSuara}
            role="presentation"
          >
            <section
              className="symbol-table-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Acuan Suara - Sound Reference"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="symbol-table-modal-header">
                <h3 className="symbol-table-modal-title">ACUAN SUARA</h3>
                <button
                  type="button"
                  className="symbol-table-modal-close"
                  onClick={closeAcuanSuara}
                  aria-label="Close sound reference modal"
                >
                  ×
                </button>
              </header>
              <div className="acuan-suara-modal-content">
                {ACUAN_SUARA_GROUPS.map((group, groupIndex) => (
                  <div key={groupIndex} className="acuan-suara-table-group">
                    <h4 className="acuan-suara-group-title">{group.title}</h4>
                    <p className="acuan-suara-group-subtitle">{group.subtitle}</p>
                    <table className="acuan-suara-table">
                      <thead>
                        <tr>
                          <th>Simbol Fonetik</th>
                          <th>Acuan Suara</th>
                          <th>Contoh Kata</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item, itemIndex) => (
                          <tr key={itemIndex}>
                            <td className="acuan-suara-symbol">{item.symbol}</td>
                            <td>{item.acuanSuara}</td>
                            <td>{item.contohKata}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default PhoneticPortal;