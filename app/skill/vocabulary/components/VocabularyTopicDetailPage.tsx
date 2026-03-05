'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, Copy } from 'lucide-react';
import BackButton from '../../components/BackButton';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
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

type DetailPlayMode = 'words' | 'word-example' | null;

const RecordingControlsButton = dynamic(() => import('../../components/RecordingControlsButton'), {
  ssr: false,
});

const VOCABULARY_PROGRESS_KEY = 'vocabularyProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const VOCABULARY_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Bertindaklah sebagai evaluator bahasa Inggris level dasar (A1-A2). Nilai performa saya berdasarkan 3 aspek: 1) Pelafalan benar/tidaknya: apakah kata diucapkan jelas dan sesuai kata target. 2) Kecocokan bentuk kata: apakah bentuk kata sudah tepat (verb form, singular/plural, article, preposition dasar). 3) Ketepatan makna: apakah kalimat yang saya buat sesuai arti kata target dan konteksnya masuk akal. Aturan penilaian: - Gunakan status: 🟢 Sangat bagus / 🔵 Bagus / 🟡 Perlu sedikit perbaikan / 🔴 Perlu perbaikan. - Fokus pada koreksi praktis, jangan teori panjang. - Jika ada kesalahan, berikan versi perbaikan kalimat yang natural dan sederhana. Format output (wajib tabel): - Kolom 1: Kata target - Kolom 2: Kalimat saya - Kolom 3: Pelafalan - Kolom 4: Kecocokan bentuk kata - Kolom 5: Ketepatan makna - Kolom 6: Saran perbaikan singkat.";

const WORDS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);
  const playTokenRef = useRef(0);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const visibleWords = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return topicWords;

    return topicWords.filter((item) => {
      const exampleTranslation = getVocabularyExampleTranslation(item.exampleEn) ?? '';
      const haystack = `${item.word} ${item.meaningId} ${item.exampleEn} ${exampleTranslation}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [search, topicWords]);

  const totalPages = useMemo(() => {
    if (!visibleWords.length) return 1;
    return Math.ceil(visibleWords.length / WORDS_PER_PAGE);
  }, [visibleWords.length]);

  const effectivePage = Math.min(currentPage, totalPages);

  const pagedWords = useMemo(() => {
    const start = (effectivePage - 1) * WORDS_PER_PAGE;
    const end = start + WORDS_PER_PAGE;
    return visibleWords.slice(start, end);
  }, [effectivePage, visibleWords]);

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
    if (!playingItemId) return;
    const target = cardRefs.current[playingItemId];
    if (!target) return;
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, [playingItemId]);

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
          <span className="vocab-word-chip">{item.word}</span>
        </h2>
        {showIpa ? <p className="vocab-ipa">{wordIpa}</p> : null}
        {showTranslation ? <p className="vocab-meaning">{item.meaningId}</p> : null}
        <p className="vocab-example">{item.exampleEn}</p>
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
        <header className="vocab-header vocab-topic-detail-header">
          <p className="vocab-topic-detail-kicker">Topic</p>
          <h1 className="vocab-title">{topic.title}</h1>
          <p className="vocab-topic-detail-subtitle">{topic.subtitle}</p>
          <p className="vocab-topic-detail-description">{topic.description}</p>

          <div className="vocab-kpis">
            <p className="vocab-kpi">
              Total kata topik: <strong>{topicWords.length}</strong>
            </p>
            <p className="vocab-kpi">
              Ditampilkan: <strong>{visibleWords.length}</strong>
            </p>
          </div>

          <div className="vocab-topic-detail-actions">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="primary"
              topicName={topic.title}
            />
            <button
              type="button"
              className="vocab-action-btn"
              onClick={() => setIsPracticeModalOpen(true)}
            >
              Practice
            </button>
            <button
              type="button"
              className="vocab-action-btn"
              onClick={() => setShowIpa((prev) => !prev)}
            >
              {showIpa ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
            </button>
            <button
              type="button"
              className="vocab-action-btn"
              onClick={() => setShowTranslation((prev) => !prev)}
            >
              {showTranslation ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan'}
            </button>
            <button
              type="button"
              className="vocab-action-btn"
              onClick={() => void playAllWords()}
              disabled={!pagedWords.length || isPlayAllRunning}
            >
              Play All Words
            </button>
            <button
              type="button"
              className="vocab-action-btn"
              onClick={() => void playAllWordThenExample()}
              disabled={!pagedWords.length || isPlayAllRunning}
            >
              Play All Word -&gt; Example
            </button>
            <button type="button" className="vocab-action-btn vocab-action-stop" onClick={stopPlayback}>
              Stop
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
              <p id="vocab-evaluation-prompt-body" className="vocab-prompt-body">
                &quot;{VOCABULARY_EVALUATION_PROMPT}&quot;
              </p>
            ) : null}
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
              }}
              className="vocab-search-input"
              placeholder="Cari word, arti Indonesia, atau example..."
            />
          </label>
        </section>

        <p className="vocab-visible-note">
          Showing <strong>{pagedWords.length}</strong> of <strong>{visibleWords.length}</strong> words in this topic.
          {' '}Halaman <strong>{effectivePage}</strong>/<strong>{totalPages}</strong>.
        </p>

        {visibleWords.length === 0 ? (
          <div className="vocab-empty">Tidak ada vocabulary yang cocok dengan kata kunci saat ini.</div>
        ) : (
          <>
            <section className="vocab-grid" aria-label={`Vocabulary list for ${topic.title}`}>
              {pagedWords.map((item) => renderWordCard(item))}
            </section>

            <nav className="vocab-pagination" aria-label="Vocabulary pagination">
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
      <RecordingControlsButton downloadFileName={`vocabulary-${topic.topicId}-GEUWAT-recording.wav`} />
    </main>
  );
}
