'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getSymbolSpeechProfile,
} from '../../phoneticSymbols/data/symbolSpeechMap';
import { getWordExamples } from '../../phoneticSymbols/data/wordExamples/wordExamples';
import {
  primeBestEnglishVoice,
  speakWithBestEnglishVoice,
} from '../../final-sound-new/tts-utils';
import '../../../vocabulary/flashcard/body-parts/flashcard.css';

type FlashcardMode = 'ordered' | 'shuffle';

type PhoneticFlashcardItem = {
  id: string;
  symbol: string;
  exampleWord: string;
  exampleIpa: string;
};

const PHONETIC_SYMBOLS_ORDER = [
  '\u028c',
  '\u026a',
  '\u028a',
  '\u025b',
  '\u0259',
  '\u025a',
  '\u0251',
  'i',
  'u',
  '\u00e6',
  '\u0254',
  'p',
  't',
  'k',
  'f',
  '\u03b8',
  's',
  '\u0283',
  '\u02a7',
  'h',
  'b',
  'd',
  'g',
  'v',
  '\u00f0',
  'z',
  '\u0292',
  '\u02a4',
  'l',
  'm',
  'n',
  '\u014b',
  'r',
  'w',
  'y',
  'a\u026a',
  'e\u026a',
  '\u0254\u026a',
  '\u026a\u0259',
  'e\u0259',
  '\u028a\u0259',
  'o\u028a',
  'a\u028a',
] as const;

const shuffleArray = (items: string[]): string[] => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const sanitizeIpa = (rawIpa: string): string => {
  const trimmed = rawIpa.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/')) return trimmed;
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`;
};

const toTitleCase = (value: string): string => {
  if (!value.trim()) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function PhoneticSymbolsFlashcardPage() {
  const router = useRouter();

  const cards = useMemo<PhoneticFlashcardItem[]>(
    () =>
      PHONETIC_SYMBOLS_ORDER.map((symbol, index) => {
        const examples = getWordExamples(symbol);
        const firstExample = examples[0];
        const speechProfile = getSymbolSpeechProfile(symbol);
        const fallbackWord = speechProfile.prompt || 'example';

        return {
          id: `phonetic-symbol-${index}-${symbol}`,
          symbol,
          exampleWord: toTitleCase(firstExample?.word?.trim() || fallbackWord),
          exampleIpa: sanitizeIpa(firstExample?.ipa || ''),
        };
      }),
    [],
  );

  const cardIds = useMemo(() => cards.map((item) => item.id), [cards]);
  const cardMap = useMemo<Record<string, PhoneticFlashcardItem>>(
    () => Object.fromEntries(cards.map((item) => [item.id, item])),
    [cards],
  );

  const [mode, setMode] = useState<FlashcardMode>('ordered');
  const [orderIds, setOrderIds] = useState<string[]>(cardIds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlayAllActive, setIsPlayAllActive] = useState(false);
  const speechSessionRef = useRef(0);
  const playAllTimeoutRef = useRef<number | null>(null);
  const speakingResetRef = useRef<number | null>(null);

  const maxIndex = Math.max(0, orderIds.length - 1);
  const activeIndex = Math.min(currentIndex, maxIndex);
  const activeId = orderIds[activeIndex];
  const currentCard = activeId ? cardMap[activeId] : null;
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < maxIndex;

  const stopSpeech = useCallback(() => {
    speechSessionRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (playAllTimeoutRef.current) {
      window.clearTimeout(playAllTimeoutRef.current);
      playAllTimeoutRef.current = null;
    }
    if (speakingResetRef.current) {
      window.clearTimeout(speakingResetRef.current);
      speakingResetRef.current = null;
    }
    setIsPlayAllActive(false);
    setIsSpeaking(false);
  }, []);

  const estimateSpeechDelay = (rate?: number): number => {
    const normalizedRate = rate && Number.isFinite(rate) ? rate : 0.72;
    const factor = 0.72 / normalizedRate;
    return Math.max(900, Math.round(1200 * factor));
  };

  const speakSymbol = useCallback(
    async (symbol: string, options?: { keepPlayAllState?: boolean }) => {
      const shouldKeepPlayAll = options?.keepPlayAllState ?? false;
      const speechSession = shouldKeepPlayAll
        ? speechSessionRef.current
        : speechSessionRef.current + 1;
      if (!shouldKeepPlayAll) {
        speechSessionRef.current = speechSession;
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (!shouldKeepPlayAll) {
        setIsPlayAllActive(false);
      }
      setIsSpeaking(true);

      const profile = getSymbolSpeechProfile(symbol);
      await primeBestEnglishVoice();
      await speakWithBestEnglishVoice(profile.prompt, {
        rate: profile.rate,
        pitch: profile.pitch,
        volume: profile.volume,
      });

      if (speakingResetRef.current) {
        window.clearTimeout(speakingResetRef.current);
      }
      speakingResetRef.current = window.setTimeout(() => {
        if (speechSessionRef.current === speechSession && !shouldKeepPlayAll && !isPlayAllActive) {
          setIsSpeaking(false);
        }
        speakingResetRef.current = null;
      }, estimateSpeechDelay(profile.rate));
    },
    [isPlayAllActive],
  );

  const goPrevious = useCallback(() => {
    stopSpeech();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setIsFlipped(false);
  }, [stopSpeech]);

  const goNext = useCallback(() => {
    stopSpeech();
    setCurrentIndex((prev) => Math.min(prev + 1, Math.max(orderIds.length - 1, 0)));
    setIsFlipped(false);
  }, [orderIds.length, stopSpeech]);

  const handleModeChange = useCallback(
    (nextMode: FlashcardMode) => {
      if (nextMode === mode) return;
      stopSpeech();
      const nextOrder = nextMode === 'ordered' ? [...cardIds] : shuffleArray(cardIds);
      setMode(nextMode);
      setOrderIds(nextOrder);
      setCurrentIndex(0);
      setIsFlipped(false);
    },
    [cardIds, mode, stopSpeech],
  );

  const handleResetDeck = useCallback(() => {
    stopSpeech();
    const nextOrder = mode === 'ordered' ? [...cardIds] : shuffleArray(cardIds);
    setOrderIds(nextOrder);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cardIds, mode, stopSpeech]);

  const handleTogglePlayAll = useCallback(async () => {
    if (isPlayAllActive) {
      stopSpeech();
      return;
    }

    if (!orderIds.length) return;

    stopSpeech();
    await primeBestEnglishVoice();

    const session = speechSessionRef.current + 1;
    speechSessionRef.current = session;
    setIsPlayAllActive(true);
    setIsSpeaking(true);

    let cursor = activeIndex;

    const playNext = async () => {
      if (speechSessionRef.current !== session) return;

      if (cursor >= orderIds.length) {
        setIsPlayAllActive(false);
        setIsSpeaking(false);
        playAllTimeoutRef.current = null;
        return;
      }

      const itemId = orderIds[cursor];
      const item = itemId ? cardMap[itemId] : null;
      if (!item) {
        cursor += 1;
        void playNext();
        return;
      }

      setCurrentIndex(cursor);
      setIsFlipped(false);
      await speakSymbol(item.symbol, { keepPlayAllState: true });

      if (speechSessionRef.current !== session) return;

      cursor += 1;
      const profile = getSymbolSpeechProfile(item.symbol);
      playAllTimeoutRef.current = window.setTimeout(() => {
        void playNext();
      }, estimateSpeechDelay(profile.rate));
    };

    void playNext();
  }, [activeIndex, cardMap, isPlayAllActive, orderIds, speakSymbol, stopSpeech]);

  const handleClose = useCallback(() => {
    stopSpeech();

    if (typeof window !== 'undefined') {
      const sameOriginReferrer = document.referrer.startsWith(window.location.origin);
      if (sameOriginReferrer && window.history.length > 1) {
        router.back();
        return;
      }
    }

    router.push('/skill/pronunciation/phoneticSymbols');
  }, [router, stopSpeech]);

  useEffect(() => {
    void primeBestEnglishVoice();
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && canGoPrevious) {
        event.preventDefault();
        goPrevious();
        return;
      }

      if (event.key === 'ArrowRight' && canGoNext) {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canGoNext, canGoPrevious, goNext, goPrevious]);

  if (!currentCard) {
    return (
      <main className="vf-page">
        <div className="vf-empty">
          <p>Flashcard Phonetic Symbols belum tersedia.</p>
          <button type="button" className="vf-close-link" onClick={handleClose}>
            Close
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="vf-page">
      <div className="vf-shell">
        <header className="vf-topbar">
          <div className="vf-mode-toggle" role="group" aria-label="Pilih mode urutan kartu">
            <button
              type="button"
              className={`vf-mode-btn ${mode === 'ordered' ? 'is-active' : ''}`}
              onClick={() => handleModeChange('ordered')}
            >
              Urut
            </button>
            <button
              type="button"
              className={`vf-mode-btn ${mode === 'shuffle' ? 'is-active' : ''}`}
              onClick={() => handleModeChange('shuffle')}
            >
              Acak
            </button>
            <button
              type="button"
              className="vf-mode-btn vf-mode-btn--reset"
              onClick={handleResetDeck}
            >
              Reset
            </button>
          </div>

          <p className="vf-progress">
            <strong>Phonetic Symbols</strong> | Kartu <strong>{activeIndex + 1}</strong> /{' '}
            <strong>{orderIds.length}</strong>
          </p>

          <div className="vf-topbar-actions">
            <button
              type="button"
              className="vf-playall-btn"
              onClick={() => void handleTogglePlayAll()}
            >
              {isPlayAllActive ? 'Stop' : 'Play All'}
            </button>
            <button type="button" className="vf-close-link" onClick={handleClose}>
              Close
            </button>
          </div>
        </header>

        <section className="vf-deck" aria-label="Flashcard deck Phonetic Symbols">
          <button
            type="button"
            className="vf-nav-btn"
            onClick={goPrevious}
            disabled={!canGoPrevious}
            aria-label="Previous card"
          >
            Previous
          </button>

          <div
            className="vf-card-button"
            onClick={() => setIsFlipped((prev) => !prev)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setIsFlipped((prev) => !prev);
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={isFlipped}
            aria-label={isFlipped ? 'Balik ke sisi simbol' : 'Balik ke sisi contoh kata'}
          >
            <span className={`vf-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
              <span className="vf-card-face vf-card-face--front">
                <span className="vf-face-kicker">Symbol</span>
                <span
                  className="vf-face-main"
                  style={{ fontFamily: 'Lucida Sans Unicode, Arial Unicode MS, Times New Roman, serif' }}
                >
                  {currentCard.symbol}
                </span>
                <button
                  type="button"
                  className={`vf-vocab-chip vf-vocab-chip--icon-only ${isSpeaking ? 'is-speaking' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    void speakSymbol(currentCard.symbol);
                  }}
                  aria-label={`Putar bunyi simbol ${currentCard.symbol}`}
                  title="Putar simbol"
                >
                  <span className="vf-vocab-chip-icon" aria-hidden="true" />
                </button>
                <span className="vf-face-note">Tap kartu untuk lihat 1 contoh kata</span>
              </span>

              <span className="vf-card-face vf-card-face--back">
                <span className="vf-face-kicker">Example Word</span>
                <span className="vf-face-main">{currentCard.exampleWord}</span>
                {currentCard.exampleIpa ? (
                  <span className="vf-face-ipa">{currentCard.exampleIpa}</span>
                ) : null}
              </span>
            </span>
          </div>

          <button
            type="button"
            className="vf-nav-btn"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Next card"
          >
            Next
          </button>
        </section>
      </div>
    </main>
  );
}
