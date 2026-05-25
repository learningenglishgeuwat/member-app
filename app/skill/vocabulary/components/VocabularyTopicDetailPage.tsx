'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Check, Copy, Play, Square } from 'lucide-react';
import BackButton from '../../components/BackButton';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import { IpaVisibilityToggle, ControlCenter, PlayStopButton } from '@/app/components';
import type { VocabularyItem, VocabularyTopicMeta } from '../topic/data/types';
import {
  getVocabularyExampleIpa,
  getVocabularyExampleTranslation,
} from '../topic/data/example-meta';
import {
  primeVocabularyVoice,
  speakVocabularyText,
  stopVocabularySpeech,
} from '../tts';
import VocabularyPracticeMissionModal from './VocabularyPracticeMissionModal';
import VocabularyWordCarousel from './VocabularyWordCarousel';
import { useKpiValueColumn } from './useKpiValueColumn';
import { useHaptic } from '@/lib/haptic/useHaptic';
import '../topic/shared/vocabulary.css';

type DetailPlayMode = 'words' | 'word-example' | null;

const RecordingControlsButton = dynamic(() => import('../../components/RecordingControlsButton'), {
  ssr: false,
});

const VOCABULARY_PROGRESS_KEY = 'vocabularyProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const VOCABULARY_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Bertindaklah sebagai evaluator bahasa Inggris level dasar (A1-A2). Nilai performa saya berdasarkan 3 aspek: 1) Pelafalan benar/tidaknya: apakah kata diucapkan jelas dan sesuai kata target. 2) Kecocokan bentuk kata: apakah bentuk kata sudah tepat (verb form, singular/plural, article, preposition dasar). 3) Ketepatan makna: apakah kalimat yang saya buat sesuai arti kata target dan konteksnya masuk akal. Aturan penilaian: - Gunakan status: 🟢 Sangat bagus / 🔵 Bagus / 🟡 Perlu sedikit perbaikan / 🔴 Perlu perbaikan. - Fokus pada koreksi praktis, jangan teori panjang. - Jika ada kesalahan, berikan versi perbaikan kalimat yang natural dan sederhana. Format output (wajib tabel): - Kolom 1: Kata target - Kolom 2: Kalimat saya - Kolom 3: Pelafalan - Kolom 4: Kecocokan bentuk kata - Kolom 5: Ketepatan makna - Kolom 6: Saran perbaikan singkat.";

const WORDS_PER_PAGE = 10;
const VOCAB_LAST_TOPIC_ID_KEY = 'vocab:lastTopicId';
const VOCAB_LAST_WORD_ID_PREFIX = 'vocab:lastWordId:';

const COLOR_CARD_CLASS_BY_WORD: Record<string, string> = {
  red: 'vocab-color-card--red',
  blue: 'vocab-color-card--blue',
  green: 'vocab-color-card--green',
  yellow: 'vocab-color-card--yellow',
  black: 'vocab-color-card--black',
  white: 'vocab-color-card--white',
  brown: 'vocab-color-card--brown',
  gray: 'vocab-color-card--gray',
  orange: 'vocab-color-card--orange',
  pink: 'vocab-color-card--pink',
  purple: 'vocab-color-card--purple',
  gold: 'vocab-color-card--gold',
  silver: 'vocab-color-card--silver',
  navy: 'vocab-color-card--navy',
  beige: 'vocab-color-card--beige',
  maroon: 'vocab-color-card--maroon',
  turquoise: 'vocab-color-card--turquoise',
  violet: 'vocab-color-card--violet',
  cream: 'vocab-color-card--cream',
  olive: 'vocab-color-card--olive',
};

const CARDINAL_UNDER_TWENTY: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const CARDINAL_TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const CARDINAL_SCALES: Record<string, number> = {
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
  trillion: 1000000000000,
};

function getColorCardClass(word: string): string {
  return COLOR_CARD_CLASS_BY_WORD[word.trim().toLowerCase()] ?? 'vocab-color-card--default';
}

function parseCardinalWordToNumber(word: string): number | null {
  const normalized = word
    .trim()
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ');

  if (!normalized) return null;

  const tokens = normalized.split(' ');
  let total = 0;
  let current = 0;

  for (const token of tokens) {
    if (token in CARDINAL_UNDER_TWENTY) {
      current += CARDINAL_UNDER_TWENTY[token];
      continue;
    }

    if (token in CARDINAL_TENS) {
      current += CARDINAL_TENS[token];
      continue;
    }

    if (token === 'hundred') {
      if (current === 0) current = 1;
      current *= 100;
      continue;
    }

    if (token in CARDINAL_SCALES) {
      if (current === 0) current = 1;
      total += current * CARDINAL_SCALES[token];
      current = 0;
      continue;
    }

    return null;
  }

  return total + current;
}

function getBodyPartIconPath(iconKey?: string): string | null {
  const safe = (iconKey ?? 'head').trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(safe)) {
    return null;
  }
  return `/icons/body-parts/${safe}.svg`;
}

function decodeEscapedUnicode(value: string): string {
  if (!value.includes('\\u')) return value;
  return value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildHighlightRegex(phrase: string): RegExp | null {
  const trimmed = phrase.trim();
  if (!trimmed) return null;

  const escaped = escapeRegExp(trimmed);
  const firstChar = trimmed[0] ?? '';
  const lastChar = trimmed[trimmed.length - 1] ?? '';
  const startsWithWord = /[A-Za-z0-9_]/.test(firstChar);
  const endsWithWord = /[A-Za-z0-9_]/.test(lastChar);
  const pattern = `${startsWithWord ? '\\b' : ''}${escaped}${endsWithWord ? '\\b' : ''}`;

  try {
    return new RegExp(pattern, 'gi');
  } catch {
    try {
      return new RegExp(escaped, 'gi');
    } catch {
      return null;
    }
  }
}

function renderHighlightedText(text: string, phrase: string): ReactNode {
  const regex = buildHighlightRegex(phrase);
  if (!regex) return text;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let matchKey = 0;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const matched = match[0] ?? '';
    if (!matched) break;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <span key={`hl-${matchKey}-${start}`} className="vocab-highlight">
        {text.slice(start, start + matched.length)}
      </span>,
    );

    lastIndex = start + matched.length;
    matchKey += 1;

    // Avoid zero-length match infinite loops (paranoia).
    if (regex.lastIndex === start) {
      regex.lastIndex += 1;
    }
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : text;
}

function readVocabularyProgress(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(VOCABULARY_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const next: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'number' && Number.isFinite(value)) {
        next[key] = value;
      }
    }
    return next;
  } catch {
    return {};
  }
}

function calcVocabularyAverage(progress: Record<string, number>): number {
  const values = Object.values(progress).filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0,
  );
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

type VocabularyTopicDetailPageProps = {
  topic: VocabularyTopicMeta;
  topicWords: VocabularyItem[];
  isColorTopic?: boolean;
  showBodyPartIcon?: boolean;
  showCardinalNumber?: boolean;
};

export default function VocabularyTopicDetailPage({
  topic,
  topicWords,
  isColorTopic = false,
  showBodyPartIcon = false,
  showCardinalNumber = false,
}: VocabularyTopicDetailPageProps) {
  const kpiRef = useRef<HTMLDListElement | null>(null);
  const { triggerHaptic } = useHaptic();
  const [search, setSearch] = useState('');
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [progressRevision, setProgressRevision] = useState(0);
  const [showIpa, setShowIpa] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const [isPlayAllRunning, setIsPlayAllRunning] = useState(false);
  const [playMode, setPlayMode] = useState<DetailPlayMode>(null);

  useKpiValueColumn(kpiRef);

  const initialIsMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const initialStoredWordId = (() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(`${VOCAB_LAST_WORD_ID_PREFIX}${topic.topicId}`);
    } catch {
      return null;
    }
  })();
  const initialStoredWordIndex = initialStoredWordId
    ? topicWords.findIndex((item) => item.id === initialStoredWordId)
    : -1;
  const initialPage =
    initialStoredWordIndex >= 0 && !initialIsMobile
      ? Math.floor(initialStoredWordIndex / WORDS_PER_PAGE) + 1
      : 1;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isMobile, setIsMobile] = useState(initialIsMobile);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [restoredWordId] = useState<string | null>(
    initialStoredWordIndex >= 0 ? initialStoredWordId : null,
  );
  const playTokenRef = useRef(0);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 767px)');
    const update = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(VOCAB_LAST_TOPIC_ID_KEY, topic.topicId);
    } catch {
      // ignore storage errors
    }
  }, [topic.topicId]);

  const visibleWords = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return topicWords;

    if (/^\d+$/.test(normalized)) {
      const requestedIndex = Number(normalized);
      if (!Number.isFinite(requestedIndex) || requestedIndex <= 0) return [];
      const target = topicWords[requestedIndex - 1];
      return target ? [target] : [];
    }

    return topicWords.filter((item) => {
      const exampleTranslation = getVocabularyExampleTranslation(item.exampleEn) ?? '';
      const haystack = `${item.word} ${item.meaningId} ${item.exampleEn} ${exampleTranslation}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [search, topicWords]);

  const totalPages = useMemo(() => {
    if (!visibleWords.length) return 1;
    const perPage = isMobile ? Math.max(1, visibleWords.length) : WORDS_PER_PAGE;
    return Math.ceil(visibleWords.length / perPage);
  }, [isMobile, visibleWords.length]);

  const effectivePage = Math.min(currentPage, totalPages);

  const pagedWords = useMemo(() => {
    const perPage = isMobile ? Math.max(1, visibleWords.length) : WORDS_PER_PAGE;
    const start = (effectivePage - 1) * perPage;
    const end = start + perPage;
    return visibleWords.slice(start, end);
  }, [effectivePage, isMobile, visibleWords]);

  const practiceExample = useMemo(() => {
    const firstItem = topicWords[0];
    if (!firstItem) {
      return {
        word: '-',
        sentence: '-',
        meaning: '-',
      };
    }
    return {
      word: firstItem.word,
      sentence: firstItem.exampleEn,
      meaning: firstItem.meaningId,
    };
  }, [topicWords]);

  const isProgressSaved = useMemo(() => {
    const currentRevision = progressRevision;
    void currentRevision;
    const vocabularyProgress = readVocabularyProgress();
    const progressValue = vocabularyProgress[topic.topicId];
    return typeof progressValue === 'number' && Number.isFinite(progressValue) && progressValue > 0;
  }, [progressRevision, topic.topicId]);

  const stopPlayback = useCallback(() => {
    playTokenRef.current += 1;
    stopVocabularySpeech();
    setPlayingItemId(null);
    setIsPlayAllRunning(false);
    setPlayMode(null);
  }, []);

  const goToPage = useCallback(
    (nextPage: number) => {
      const safePage = Math.min(totalPages, Math.max(1, nextPage));
      if (safePage === effectivePage) return;
      stopPlayback();
      setCurrentPage(safePage);
      setCarouselIndex(0);
    },
    [effectivePage, stopPlayback, totalPages],
  );

  const playSingle = useCallback(async (item: VocabularyItem, kind: 'word' | 'example') => {
    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    stopVocabularySpeech();
    setIsPlayAllRunning(false);
    setPlayMode(null);
    setPlayingItemId(item.id);

    await speakVocabularyText(kind === 'word' ? item.word : item.exampleEn);

    if (playTokenRef.current === token) {
      setPlayingItemId(null);
    }
  }, []);

  const playAllWords = useCallback(async () => {
    if (!pagedWords.length) return;

    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    stopVocabularySpeech();
    setIsPlayAllRunning(true);
    setPlayMode('words');

    for (const item of pagedWords) {
      if (playTokenRef.current !== token) break;
      setPlayingItemId(item.id);
      await speakVocabularyText(item.word);
    }

    if (playTokenRef.current === token) {
      setPlayingItemId(null);
      setIsPlayAllRunning(false);
      setPlayMode(null);
    }
  }, [pagedWords]);

  const playAllWordThenExample = useCallback(async () => {
    if (!pagedWords.length) return;

    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    stopVocabularySpeech();
    setIsPlayAllRunning(true);
    setPlayMode('word-example');

    for (const item of pagedWords) {
      if (playTokenRef.current !== token) break;
      setPlayingItemId(item.id);
      await speakVocabularyText(item.word);
      if (playTokenRef.current !== token) break;
      await speakVocabularyText(item.exampleEn);
    }

    if (playTokenRef.current === token) {
      setPlayingItemId(null);
      setIsPlayAllRunning(false);
      setPlayMode(null);
    }
  }, [pagedWords]);

  const handleSaveProgress = useCallback(
    async (percentage: number) => {
      if (typeof window === 'undefined') return;

      const vocabularyProgress = readVocabularyProgress();
      vocabularyProgress[topic.topicId] = percentage;
      window.localStorage.setItem(VOCABULARY_PROGRESS_KEY, JSON.stringify(vocabularyProgress));

      const dashboardProgress = (() => {
        try {
          const raw = window.localStorage.getItem(DASHBOARD_PROGRESS_KEY);
          return raw ? (JSON.parse(raw) as Record<string, number>) : {};
        } catch {
          return {} as Record<string, number>;
        }
      })();
      dashboardProgress.vocabulary = calcVocabularyAverage(vocabularyProgress);
      window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
      setProgressRevision((prev) => prev + 1);
    },
    [topic.topicId],
  );

  const handleUnsaveProgress = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const vocabularyProgress = readVocabularyProgress();
    delete vocabularyProgress[topic.topicId];
    window.localStorage.setItem(VOCABULARY_PROGRESS_KEY, JSON.stringify(vocabularyProgress));

    const dashboardProgress = (() => {
      try {
        const raw = window.localStorage.getItem(DASHBOARD_PROGRESS_KEY);
        return raw ? (JSON.parse(raw) as Record<string, number>) : {};
      } catch {
        return {} as Record<string, number>;
      }
    })();
    dashboardProgress.vocabulary = calcVocabularyAverage(vocabularyProgress);
    window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
    setProgressRevision((prev) => prev + 1);
  }, [topic.topicId]);

  const handleCopyPrompt = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setIsPromptCopied(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(VOCABULARY_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1400);
    } catch {
      setIsPromptCopied(false);
    }
  }, []);

  useEffect(() => {
    void primeVocabularyVoice();
    return () => {
      stopVocabularySpeech();
    };
  }, []);

  useEffect(() => {
    if (!playingItemId || isMobile) return;
    const target = cardRefs.current[playingItemId];
    if (!target) return;
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, [isMobile, playingItemId]);

  const renderWordCard = (item: VocabularyItem) => {
    const exampleIpa = getVocabularyExampleIpa(item.exampleEn);
    const exampleTranslation = getVocabularyExampleTranslation(item.exampleEn);
    const bodyPartIconPath = getBodyPartIconPath(item.icon);
    const cardinalNumberValue = showCardinalNumber ? parseCardinalWordToNumber(item.word) : null;
    const wordIpa = decodeEscapedUnicode(item.ipa);

    return (
      <article
        key={item.id}
        ref={(node) => {
          cardRefs.current[item.id] = node;
        }}
        className={`vocab-card ${playingItemId === item.id ? 'is-speaking' : ''} ${
          isColorTopic ? `vocab-color-card ${getColorCardClass(item.word)}` : ''
        }`}
      >
        {showBodyPartIcon ? (
          <div className="vocab-card-top">
            <span className="vocab-body-icon" title="Parts of the Body icon" aria-hidden="true">
              {bodyPartIconPath ? (
                <Image src={bodyPartIconPath} alt="" width={16} height={16} className="vocab-body-icon-image" />
              ) : (
                <span className="vocab-body-icon-fallback">{item.icon ?? 'body'}</span>
              )}
            </span>
          </div>
        ) : null}
        {showCardinalNumber && cardinalNumberValue !== null ? (
          <p className="vocab-cardinal-number">{cardinalNumberValue.toLocaleString('en-US')}</p>
        ) : null}
        <h2 className="vocab-word">
          <span className="vocab-word-chip">
            <span className="vocab-highlight">{item.word}</span>
          </span>
        </h2>
        {showIpa ? <p className="vocab-ipa">{wordIpa}</p> : null}
        {showTranslation ? <p className="vocab-meaning">{item.meaningId}</p> : null}
        <span className="vocab-example-divider" aria-hidden="true" />
        <p className="vocab-example">{renderHighlightedText(item.exampleEn, item.word)}</p>
        {showIpa && exampleIpa ? <p className="vocab-example-ipa">{exampleIpa}</p> : null}
        {showTranslation && exampleTranslation ? (
          <p className="vocab-example-translation">{exampleTranslation}</p>
        ) : null}
        <div className="vocab-card-actions">
          <button
            type="button"
            className="vocab-play-btn"
            onClick={() => void playSingle(item, 'word')}
          >
            Play Word
          </button>
          <button
            type="button"
            className="vocab-play-btn"
            onClick={() => void playSingle(item, 'example')}
          >
            Play Example
          </button>
        </div>
      </article>
    );
  };

  return (
    <main className={`vocab-page ${isColorTopic ? 'vocab-page-color-topic' : ''}`}>
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/vocabulary" />
      </div>

      <div className="vocab-shell vocab-topic-detail-shell">
        <header className="vocab-header vocab-header--center vocab-topic-detail-header">
          <p className="vocab-topic-detail-kicker">Topic</p>
          <h1 className="vocab-title">{topic.title}</h1>
          <p className="vocab-topic-detail-subtitle">{topic.subtitle}</p>
          <p className="vocab-topic-detail-description">{topic.description}</p>

          <dl ref={kpiRef} className="vocab-kpi-table" aria-label="Topic summary">
            <dt>Total kata topik</dt>
            <dd>
              <span className="vocab-kpi-value">{topicWords.length}</span>
            </dd>
            <dt>Ditampilkan</dt>
            <dd>
              <span className="vocab-kpi-value">{visibleWords.length}</span>
            </dd>
          </dl>

          <div className="vocab-topic-detail-actions">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="outline"
              className="vocab-control-saved-progress"
              topicName={topic.title}
            />
            
            
            <button
              type="button"
              className="vocab-action-btn vocab-action-btn--primary vocab-control-btn vocab-control-btn--full"
              onClick={() => setIsPracticeModalOpen(true)}
            >
              Practice
            </button>
            
            
            
          </div>

          <section className="vocab-prompt-card" aria-label="Prompt penilaian vocabulary">
            <div className="vocab-prompt-head">
              <button
                type="button"
                className="vocab-prompt-toggle"
                onClick={() => setIsPromptOpen((prev) => !prev)}
                aria-expanded={isPromptOpen}
                aria-controls="vocab-evaluation-prompt-body"
              >
                <h2 className="vocab-prompt-title">Prompt</h2>
                <span
                  className={`vocab-prompt-toggle-icon ${isPromptOpen ? 'is-open' : ''}`}
                  aria-hidden="true"
                ></span>
              </button>

              {isPromptOpen ? (
                <button
                  type="button"
                  className={`vocab-prompt-copy ${isPromptCopied ? 'is-copied' : ''}`}
                  onClick={() => void handleCopyPrompt()}
                  aria-label="Salin prompt"
                >
                  {isPromptCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isPromptCopied ? 'Tersalin' : 'Salin'}</span>
                </button>
              ) : null}
            </div>

            {isPromptOpen ? (
              <div className="vocab-prompt-body-card">
                <p id="vocab-evaluation-prompt-body" className="vocab-prompt-body">
                  &quot;{VOCABULARY_EVALUATION_PROMPT}&quot;
                </p>
              </div>
            ) : (
              <div className="vocab-prompt-body-card">
                <p className="vocab-prompt-placeholder">
                  Buka Prompt untuk melihat format penilaian dan contoh feedback.
                </p>
              </div>
            )}
          </section>

          {isPlayAllRunning ? (
            <p className="vocab-playing-note">
              Sedang memutar mode:{' '}
              <strong>{playMode === 'words' ? 'Words only' : 'Word -> Example'}</strong>
            </p>
          ) : null}
        </header>

        <section className="vocab-tools" aria-label="Topic vocabulary tools">
          <label className="vocab-search-wrap">
            <span>Search in this topic</span>
            <input
              type="text"
              value={search}
              onChange={(event) => {
                stopPlayback();
                setSearch(event.target.value);
                setCurrentPage(1);
                setCarouselIndex(0);
              }}
              className="vocab-search-input"
              placeholder="Cari word, arti Indonesia, atau example..."
            />
          </label>
        </section>

        <p className="vocab-visible-note">
          {isMobile ? (
            <>
              Showing <strong>{Math.min(visibleWords.length, carouselIndex + 1)}</strong> of{' '}
              <strong>{visibleWords.length}</strong> words in this topic.
            </>
          ) : (
            <>
              Showing <strong>{pagedWords.length}</strong> of <strong>{visibleWords.length}</strong> words in this topic.
              {' '}Halaman <strong>{effectivePage}</strong>/<strong>{totalPages}</strong>.
            </>
          )}
        </p>

        {visibleWords.length === 0 ? (
          <div className="vocab-empty">Tidak ada vocabulary yang cocok dengan kata kunci saat ini.</div>
        ) : (
          <>
            <VocabularyWordCarousel
              ariaLabel={`Vocabulary carousel for ${topic.title}`}
              hint="Swipe untuk pindah kata, atau tap tombol untuk play / detail."
              initialItemId={restoredWordId}
              activeItemId={playingItemId}
              onIndexChange={(index) => {
                setCarouselIndex(index);
                const currentItemId = pagedWords[index]?.id;
                if (!currentItemId) return;
                try {
                  window.localStorage.setItem(
                    `${VOCAB_LAST_WORD_ID_PREFIX}${topic.topicId}`,
                    currentItemId,
                  );
                } catch {
                  // ignore storage errors
                }
              }}
              items={pagedWords.map((item) => ({ id: item.id, node: renderWordCard(item) }))}
            />

            <section className="vocab-grid vocab-grid--desktop" aria-label={`Vocabulary list for ${topic.title}`}>
              {pagedWords.map((item) => renderWordCard(item))}
            </section>

            <nav className="vocab-pagination vocab-pagination--desktop" aria-label="Vocabulary pagination">
              <button
                type="button"
                className="vocab-action-btn"
                onClick={() => goToPage(effectivePage - 1)}
                disabled={effectivePage <= 1}
              >
                Previous
              </button>
              <span className="vocab-pagination-status">
                Page {effectivePage} of {totalPages}
              </span>
              <button
                type="button"
                className="vocab-action-btn"
                onClick={() => goToPage(effectivePage + 1)}
                disabled={effectivePage >= totalPages}
              >
                Next
              </button>
            </nav>
          </>
        )}
      </div>

      <VocabularyPracticeMissionModal
        open={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        missionText="Pilih 5 kata lalu buat kalimatnya."
        exampleWord={practiceExample.word}
        exampleSentence={practiceExample.sentence}
        exampleMeaning={practiceExample.meaning}
      />
      
      <ControlCenter>
        <div className="flex flex-col gap-3 sm:gap-6">
          <div className="flex flex-col gap-1.5 sm:gap-2">
             <span className="font-mono text-[9px] sm:text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block uppercase">VISIBILITY</span>
             <IpaVisibilityToggle checked={showTranslation} onChange={setShowTranslation} className="w-full flex justify-between mb-1 sm:mb-2 text-[10px] sm:text-xs" label="Translation" />
             <IpaVisibilityToggle checked={showIpa} onChange={setShowIpa} className="w-full flex justify-between text-[10px] sm:text-xs" />
          </div>
          
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block mb-1 sm:mb-2 uppercase">AUDIO CONTROLS</span>
            <PlayStopButton
              isActive={!!(isPlayAllRunning && playMode === 'words')}
              label="WORDS"
              onClick={() => {
                if (isPlayAllRunning && playMode === 'words') {
                  stopPlayback();
                  return;
                }
                if (playingItemId) {
                  // stop current single playback, then immediately start play-all
                  stopPlayback();
                  void playAllWords();
                  return;
                }
                void playAllWords();
              }}
              disabled={!pagedWords.length || (isPlayAllRunning && playMode !== 'words' && !playingItemId)}
              size="sm"
            />
            <PlayStopButton
              isActive={!!(isPlayAllRunning && playMode === 'word-example')}
              label="W -> EX"
              onClick={() => {
                if (isPlayAllRunning && playMode === 'word-example') {
                  stopPlayback();
                  return;
                }
                if (playingItemId) {
                  stopPlayback();
                  void playAllWordThenExample();
                  return;
                }
                void playAllWordThenExample();
              }}
              disabled={!pagedWords.length || (isPlayAllRunning && playMode !== 'word-example' && !playingItemId)}
              size="sm"
            />
          </div>
        </div>
      </ControlCenter>
      <RecordingControlsButton downloadFileName={`vocabulary-${topic.topicId}-GEUWAT-recording.wav`} />
    </main>
  );
}
