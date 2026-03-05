'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALPHABET_DATA } from '../../alphabet/constants';
import {
  primeBestEnglishVoice,
  speakWithBestEnglishVoice,
} from '../../final-sound-new/tts-utils';
import '../../../vocabulary/flashcard/body-parts/flashcard.css';

type FlashcardMode = 'ordered' | 'shuffle';

type AlphabetFlashcardItem = {
  id: string;
  letter: string;
  ipa: string;
  exampleWord: string;
};

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

export default function AlphabetFlashcardPage() {
  const router = useRouter();

  const cards = useMemo<AlphabetFlashcardItem[]>(
    () =>
      ALPHABET_DATA.map((item, index) => ({
        id: `alphabet-symbol-${index}-${item.letter}`,
        letter: item.letter,
        ipa: sanitizeIpa(item.ipa),
        exampleWord: item.example.trim(),
      })),
    [],
  );

  const cardIds = useMemo(() => cards.map((item) => item.id), [cards]);
  const cardMap = useMemo<Record<string, AlphabetFlashcardItem>>(
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
    const normalizedRate = rate && Number.isFinite(rate) ? rate : 0.82;
    const factor = 0.82 / normalizedRate;
    return Math.max(860, Math.round(1100 * factor));
  };

  const speakLetter = useCallback(
    async (letter: string, options?: { keepPlayAllState?: boolean }) => {
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

      await primeBestEnglishVoice();
      await speakWithBestEnglishVoice(letter, {
        rate: 0.82,
        pitch: 1,
        volume: 1,
      });

      if (speakingResetRef.current) {
        window.clearTimeout(speakingResetRef.current);
      }
      speakingResetRef.current = window.setTimeout(() => {
        if (speechSessionRef.current === speechSession && !shouldKeepPlayAll && !isPlayAllActive) {
          setIsSpeaking(false);
        }
        speakingResetRef.current = null;
      }, estimateSpeechDelay(0.82));
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
      await speakLetter(item.letter, { keepPlayAllState: true });

      if (speechSessionRef.current !== session) return;

      cursor += 1;
      playAllTimeoutRef.current = window.setTimeout(() => {
        void playNext();
      }, estimateSpeechDelay(0.82));
    };

    void playNext();
  }, [activeIndex, cardMap, isPlayAllActive, orderIds, speakLetter, stopSpeech]);

  const handleClose = useCallback(() => {
    stopSpeech();

    if (typeof window !== 'undefined') {
      const sameOriginReferrer = document.referrer.startsWith(window.location.origin);
      if (sameOriginReferrer && window.history.length > 1) {
        router.back();
        return;
      }
    }

    router.push('/skill/pronunciation/alphabet');
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
          <p>Flashcard Alphabet belum tersedia.</p>
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
            <strong>Alphabet</strong> | Kartu <strong>{activeIndex + 1}</strong> /{' '}
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

        <section className="vf-deck" aria-label="Flashcard deck Alphabet">
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
            aria-label={isFlipped ? 'Balik ke sisi huruf' : 'Balik ke sisi contoh kata'}
          >
            <span className={`vf-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
              <span className="vf-card-face vf-card-face--front">
                <span className="vf-face-kicker">Letter</span>
                <span className="vf-face-main">{currentCard.letter}</span>
                <span className="vf-face-ipa">{currentCard.ipa}</span>
                <button
                  type="button"
                  className={`vf-vocab-chip vf-vocab-chip--icon-only ${isSpeaking ? 'is-speaking' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    void speakLetter(currentCard.letter);
                  }}
                  aria-label={`Putar bunyi huruf ${currentCard.letter}`}
                  title="Putar huruf"
                >
                  <span className="vf-vocab-chip-icon" aria-hidden="true" />
                </button>
                <span className="vf-face-note">Tap kartu untuk lihat 1 contoh kata</span>
              </span>

              <span className="vf-card-face vf-card-face--back">
                <span className="vf-face-kicker">Example Word</span>
                <span className="vf-face-main">{currentCard.exampleWord}</span>
                <span className="vf-face-note">Contoh kata dari huruf ini</span>
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
