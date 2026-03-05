'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { VocabularyItem, VocabularyTopicId } from '../../topic/data/types';
import {
  primeVocabularyVoice,
  speakVocabularyText,
  stopVocabularySpeech,
} from '../../tts';
import '../body-parts/flashcard.css';

type FlashcardMode = 'ordered' | 'shuffle';

type FlashcardItem = {
  id: string;
  meaning: string;
  word: string;
  ipa: string;
};

type FlashcardSession = {
  mode: FlashcardMode;
  orderIds: string[];
  currentIndex: number;
  updatedAt: number;
};

type VocabularyFlashcardViewerProps = {
  topicId: VocabularyTopicId;
  topicTitle: string;
  words: VocabularyItem[];
};

const LEGACY_BODY_PARTS_SESSION_KEY = 'vocab_flashcard_body_parts_session_v1';
const SESSION_KEY_PREFIX = 'vocab_flashcard_session_v2:';
const LAST_TOPIC_KEY = 'vocab_flashcard_last_topic_v1';

const getSessionStorageKey = (topicId: VocabularyTopicId): string => `${SESSION_KEY_PREFIX}${topicId}`;

const shuffleArray = (items: string[]): string[] => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const isValidOrderIds = (orderIds: unknown, validIds: string[]): orderIds is string[] => {
  if (!Array.isArray(orderIds)) return false;
  if (orderIds.length !== validIds.length) return false;

  const validSet = new Set(validIds);
  const orderSet = new Set(orderIds);

  if (orderSet.size !== validIds.length) return false;
  return orderIds.every((id) => typeof id === 'string' && validSet.has(id));
};

const parseSession = (
  raw: string,
  validIds: string[],
): FlashcardSession | null => {
  try {
    const parsed = JSON.parse(raw) as Partial<FlashcardSession>;
    const mode = parsed.mode;
    const orderIds = parsed.orderIds;
    const currentIndex = parsed.currentIndex;

    if (mode !== 'ordered' && mode !== 'shuffle') return null;
    if (!isValidOrderIds(orderIds, validIds)) return null;
    if (typeof currentIndex !== 'number' || !Number.isInteger(currentIndex)) return null;
    if (currentIndex < 0 || currentIndex >= orderIds.length) return null;

    return {
      mode,
      orderIds,
      currentIndex,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
};

const readSavedSession = (
  topicId: VocabularyTopicId,
  validIds: string[],
): FlashcardSession | null => {
  if (typeof window === 'undefined') return null;

  const nextKey = getSessionStorageKey(topicId);
  const nextRaw = window.localStorage.getItem(nextKey);
  if (nextRaw) {
    return parseSession(nextRaw, validIds);
  }

  if (topicId !== 'body-parts') return null;

  const legacyRaw = window.localStorage.getItem(LEGACY_BODY_PARTS_SESSION_KEY);
  if (!legacyRaw) return null;
  const legacySession = parseSession(legacyRaw, validIds);
  if (!legacySession) return null;

  window.localStorage.setItem(nextKey, JSON.stringify(legacySession));
  return legacySession;
};

const saveSession = (
  topicId: VocabularyTopicId,
  session: FlashcardSession,
): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getSessionStorageKey(topicId), JSON.stringify(session));
  window.localStorage.setItem(LAST_TOPIC_KEY, topicId);
};

export default function VocabularyFlashcardViewer({
  topicId,
  topicTitle,
  words,
}: VocabularyFlashcardViewerProps) {
  const router = useRouter();

  const flashcardItems = useMemo<FlashcardItem[]>(
    () =>
      words.map((item) => ({
        id: item.id,
        meaning: item.meaningId,
        word: item.word,
        ipa: item.ipa,
      })),
    [words],
  );

  const flashcardIds = useMemo(() => flashcardItems.map((item) => item.id), [flashcardItems]);
  const flashcardItemMap = useMemo<Record<string, FlashcardItem>>(
    () => Object.fromEntries(flashcardItems.map((item) => [item.id, item])),
    [flashcardItems],
  );

  const [mode, setMode] = useState<FlashcardMode>('ordered');
  const [orderIds, setOrderIds] = useState<string[]>(flashcardIds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [resumePromptOpen, setResumePromptOpen] = useState(false);
  const [pendingSession, setPendingSession] = useState<FlashcardSession | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlayAllActive, setIsPlayAllActive] = useState(false);
  const speechTokenRef = useRef(0);

  const maxIndex = Math.max(0, orderIds.length - 1);
  const activeIndex = Math.min(currentIndex, maxIndex);
  const activeId = orderIds[activeIndex];

  const currentCard = useMemo(() => {
    if (!activeId) return null;
    return flashcardItemMap[activeId] ?? null;
  }, [activeId, flashcardItemMap]);

  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < maxIndex;

  const stopCardSpeech = useCallback(() => {
    speechTokenRef.current += 1;
    stopVocabularySpeech();
    setIsSpeaking(false);
    setIsPlayAllActive(false);
  }, []);

  const startNewSession = useCallback((nextMode: FlashcardMode) => {
    const nextOrder = nextMode === 'ordered' ? [...flashcardIds] : shuffleArray(flashcardIds);
    stopCardSpeech();
    setMode(nextMode);
    setOrderIds(nextOrder);
    setCurrentIndex(0);
  }, [flashcardIds, stopCardSpeech]);

  const handleModeChange = useCallback(
    (nextMode: FlashcardMode) => {
      if (nextMode === mode) return;
      startNewSession(nextMode);
    },
    [mode, startNewSession],
  );

  const handleResetDeck = useCallback(() => {
    stopCardSpeech();
    const nextOrder = mode === 'ordered' ? [...flashcardIds] : shuffleArray(flashcardIds);
    setOrderIds(nextOrder);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcardIds, mode, stopCardSpeech]);

  const goPrevious = useCallback(() => {
    stopCardSpeech();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, [stopCardSpeech]);

  const goNext = useCallback(() => {
    stopCardSpeech();
    setCurrentIndex((prev) => Math.min(prev + 1, Math.max(orderIds.length - 1, 0)));
  }, [orderIds.length, stopCardSpeech]);

  const handleResumeContinue = useCallback(() => {
    if (!pendingSession) {
      setResumePromptOpen(false);
      return;
    }

    stopCardSpeech();
    setMode(pendingSession.mode);
    setOrderIds([...pendingSession.orderIds]);
    setCurrentIndex(pendingSession.currentIndex);
    setResumePromptOpen(false);
    setPendingSession(null);
  }, [pendingSession, stopCardSpeech]);

  const handleResumeRestart = useCallback(() => {
    startNewSession('ordered');
    setResumePromptOpen(false);
    setPendingSession(null);
  }, [startNewSession]);

  const handleClose = useCallback(() => {
    stopCardSpeech();

    if (typeof window !== 'undefined') {
      const sameOriginReferrer = document.referrer.startsWith(window.location.origin);
      if (sameOriginReferrer && window.history.length > 1) {
        router.back();
        return;
      }
    }

    router.push('/skill/vocabulary');
  }, [router, stopCardSpeech]);

  useEffect(() => {
    void primeVocabularyVoice();

    return () => {
      stopCardSpeech();
    };
  }, [stopCardSpeech]);

  useEffect(() => {
    const savedSession = readSavedSession(topicId, flashcardIds);

    queueMicrotask(() => {
      if (savedSession) {
        setPendingSession(savedSession);
        setResumePromptOpen(true);
      }
      setIsSessionReady(true);
    });
  }, [flashcardIds, topicId]);

  useEffect(() => {
    if (!isSessionReady || resumePromptOpen || !flashcardIds.length) return;

    saveSession(topicId, {
      mode,
      orderIds,
      currentIndex: activeIndex,
      updatedAt: Date.now(),
    });
  }, [activeIndex, flashcardIds.length, isSessionReady, mode, orderIds, resumePromptOpen, topicId]);

  useEffect(() => {
    if (!isSessionReady || resumePromptOpen) return;

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
  }, [canGoNext, canGoPrevious, goNext, goPrevious, isSessionReady, resumePromptOpen]);

  const handlePlayCurrentWord = useCallback(async () => {
    if (!currentCard) return;

    const token = speechTokenRef.current + 1;
    speechTokenRef.current = token;
    stopVocabularySpeech();
    setIsPlayAllActive(false);
    setIsSpeaking(true);
    await speakVocabularyText(currentCard.word);
    if (speechTokenRef.current === token) {
      setIsSpeaking(false);
    }
  }, [currentCard]);

  const handleTogglePlayAll = useCallback(async () => {
    if (isPlayAllActive) {
      stopCardSpeech();
      return;
    }

    if (!orderIds.length) return;

    const token = speechTokenRef.current + 1;
    speechTokenRef.current = token;
    stopVocabularySpeech();
    setIsPlayAllActive(true);
    setIsSpeaking(true);

    for (let index = activeIndex; index < orderIds.length; index += 1) {
      if (speechTokenRef.current !== token) break;

      const itemId = orderIds[index];
      const item = itemId ? flashcardItemMap[itemId] : null;
      if (!item) continue;

      setCurrentIndex(index);
      await speakVocabularyText(item.word);

      if (speechTokenRef.current !== token) break;

      if (index < orderIds.length - 1) {
        await new Promise<void>((resolve) => {
          window.setTimeout(() => resolve(), 130);
        });
      }
    }

    if (speechTokenRef.current === token) {
      setIsSpeaking(false);
      setIsPlayAllActive(false);
    }
  }, [activeIndex, flashcardItemMap, isPlayAllActive, orderIds, stopCardSpeech]);

  if (!currentCard) {
    return (
      <main className="vf-page">
        <div className="vf-empty">
          <p>Flashcard {topicTitle} belum tersedia.</p>
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
            <strong>{topicTitle}</strong> | Kartu <strong>{activeIndex + 1}</strong> /{' '}
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

        <section className="vf-deck" aria-label={`Flashcard deck ${topicTitle}`}>
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
            aria-label={isFlipped ? 'Balik ke sisi Indonesia' : 'Balik ke sisi English dan IPA'}
          >
            <span className={`vf-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
              <span className="vf-card-face vf-card-face--front">
                <span className="vf-face-kicker">Indonesia</span>
                <span className="vf-face-main">{currentCard.meaning}</span>
                <button
                  type="button"
                  className={`vf-vocab-chip vf-vocab-chip--icon-only ${isSpeaking ? 'is-speaking' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    void handlePlayCurrentWord();
                  }}
                  aria-label="Putar pengucapan kata English"
                  title="Putar"
                >
                  <span className="vf-vocab-chip-icon" aria-hidden="true" />
                </button>
                <span className="vf-face-note">Tap kartu untuk lihat English + IPA</span>
              </span>

              <span className="vf-card-face vf-card-face--back">
                <span className="vf-face-kicker">English</span>
                <button
                  type="button"
                  className={`vf-vocab-chip vf-vocab-chip--word ${isSpeaking ? 'is-speaking' : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    void handlePlayCurrentWord();
                  }}
                  aria-label={`Putar pengucapan ${currentCard.word}`}
                  title="Putar"
                >
                  <span>{currentCard.word}</span>
                </button>
                <span className="vf-face-ipa">{currentCard.ipa}</span>
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

      {isSessionReady && resumePromptOpen ? (
        <div className="vf-modal-overlay" role="dialog" aria-modal="true" aria-label="Sesi flashcard sebelumnya">
          <section className="vf-modal">
            <h2 className="vf-modal-title">Sesi sebelumnya ditemukan</h2>
            <p className="vf-modal-text">Mau lanjut dari kartu terakhir atau mulai ulang dari awal?</p>
            <div className="vf-modal-actions">
              <button type="button" className="vf-modal-btn" onClick={handleResumeContinue}>
                Lanjut
              </button>
              <button type="button" className="vf-modal-btn vf-modal-btn--ghost" onClick={handleResumeRestart}>
                Mulai Ulang
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
