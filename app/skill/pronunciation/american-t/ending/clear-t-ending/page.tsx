'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import AmericanTLessonScaffold from '../../components/AmericanTLessonScaffold';
import ButtonSavedProgress from '../../../../components/buttonSavedProgress';
import {
  CLEAR_T_ENDING_EXAMPLES,
  CLEAR_T_ENDING_NOTES,
  CLEAR_T_ENDING_SENTENCE_DRILL_EXAMPLES_15,
  CLEAR_T_ENDING_SENTENCES,
} from '../../data/ending/clear-t-ending';
import {
  primeBestEnglishVoice,
  speakWithBestEnglishVoice,
} from '../../../final-sound-new/tts-utils';
import { stopSpeech } from '@/lib/tts/speech';

const RecordingControlsButton = dynamic(
  () => import('../../../../components/RecordingControlsButton'),
  {
    ssr: false,
  },
);

type IpaSectionId = 'examples' | 'sentences' | 'sentence-drills-examples';
type JumpSectionId = 'examples' | 'sentence-drills-examples';

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const RELEASED_T_ENDING_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kata dan kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama kejelasan released /t/ di akhir kata, akurasi pelepasan bunyi final /t/ sesuai konteks, dan kestabilan ritme kalimat. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata/kalimat yang diucapkan (pola final released /t/). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian final /t/ mana yang perlu diperbaiki.";

const RELEASED_T_ENDING_COMMON_MISTAKES: ReadonlyArray<string> = [
  'Semua final /t/ dipaksa dilepas keras meski konteksnya tidak perlu.',
  'Tidak ada pelepasan sama sekali saat kata perlu ditegaskan.',
  'Durasi final /t/ terlalu panjang sehingga terdengar kaku.',
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function formatIpaForDisplay(ipa: string): string {
  const trimmed = ipa.trim();
  if (!trimmed) return '';
  const core = trimmed.replace(/^\/+|\/+$/g, '');
  return `/${core}/`;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderSentenceWithHighlights(text: string, focusWords: ReadonlyArray<string>) {
  if (!focusWords.length) return text;

  const uniqueWords = Array.from(new Set(focusWords.map((word) => word.trim()).filter(Boolean)));
  if (!uniqueWords.length) return text;

  const pattern = uniqueWords
    .sort((a, b) => b.length - a.length)
    .map((word) => escapeRegex(word))
    .join('|');

  const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const matched = uniqueWords.some((word) => word.toLowerCase() === part.toLowerCase());
    if (matched) {
      return (
        <mark key={`${text}-match-${index}`} className="at-final-t-highlight">
          {part}
        </mark>
      );
    }
    return <span key={`${text}-plain-${index}`}>{part}</span>;
  });
}

async function speakWordForPlayAll(text: string): Promise<void> {
  await speakWithBestEnglishVoice(text, {
    rate: 0.82,
    pitch: 1,
    volume: 1,
  });
}

export default function ClearTEndingPage() {
  const [isProgressSaved, setIsProgressSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const currentProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      return typeof currentProgress.americanT === 'number' && currentProgress.americanT > 0;
    } catch {
      return false;
    }
  });
  const [isPlayingExamplesAll, setIsPlayingExamplesAll] = useState(false);
  const [isPlayingSentencesAll, setIsPlayingSentencesAll] = useState(false);
  const [isPlayingSentenceDrillsAll, setIsPlayingSentenceDrillsAll] = useState(false);
  const [activeTtsCardKey, setActiveTtsCardKey] = useState<string | null>(null);
  const [showIpaBySection, setShowIpaBySection] = useState<Record<IpaSectionId, boolean>>({
    examples: false,
    sentences: false,
    'sentence-drills-examples': false,
  });
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  const examplesPlayAllTokenRef = useRef(0);
  const sentencesPlayAllTokenRef = useRef(0);
  const sentenceDrillsPlayAllTokenRef = useRef(0);
  const singlePlayTokenRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const examplesItemRefs = useRef<Array<HTMLElement | null>>([]);
  const sentencesItemRefs = useRef<Array<HTMLElement | null>>([]);
  const sentenceDrillItemRefs = useRef<Array<HTMLElement | null>>([]);

  const calcPronunciationAverage = useCallback((progress: Record<string, number>) => {
    const validValues = Object.values(progress).filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0,
    );

    if (validValues.length === 0) return 0;
    return Math.round(validValues.reduce((sum, value) => sum + value, 0) / validValues.length);
  }, []);

  const handleSaveProgress = useCallback(
    async (percentage: number) => {
      if (typeof window === 'undefined') return;

      setIsProgressSaved(true);
      const pronunciationProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      pronunciationProgress.americanT = percentage;
      window.localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(pronunciationProgress));

      const dashboardProgress = JSON.parse(
        window.localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      dashboardProgress.pronunciation = calcPronunciationAverage(pronunciationProgress);
      window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
    },
    [calcPronunciationAverage],
  );

  const handleUnsaveProgress = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsProgressSaved(false);
    const pronunciationProgress = JSON.parse(
      window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    delete pronunciationProgress.americanT;
    window.localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(pronunciationProgress));

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    dashboardProgress.pronunciation = calcPronunciationAverage(pronunciationProgress);
    window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
  }, [calcPronunciationAverage]);

  const scrollItemIntoView = (target: HTMLElement | null) => {
    if (!target) return;
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  };

  const stopAllPlayAll = useCallback(() => {
    examplesPlayAllTokenRef.current += 1;
    sentencesPlayAllTokenRef.current += 1;
    sentenceDrillsPlayAllTokenRef.current += 1;
    singlePlayTokenRef.current += 1;
    stopSpeech();
    setIsPlayingExamplesAll(false);
    setIsPlayingSentencesAll(false);
    setIsPlayingSentenceDrillsAll(false);
    setActiveTtsCardKey(null);
  }, []);

  useEffect(() => {
    void primeBestEnglishVoice();
  }, []);

  const playSingleCardTts = async (text: string, activeCardKey: string) => {
    stopAllPlayAll();
    const token = singlePlayTokenRef.current + 1;
    singlePlayTokenRef.current = token;
    setActiveTtsCardKey(activeCardKey);
    await speakWordForPlayAll(text);
    if (singlePlayTokenRef.current === token) {
      setActiveTtsCardKey(null);
    }
  };

  const playAllExamples = async () => {
    if (isPlayingExamplesAll) return;

    stopAllPlayAll();
    const token = examplesPlayAllTokenRef.current + 1;
    examplesPlayAllTokenRef.current = token;
    setIsPlayingExamplesAll(true);

    for (const [index, item] of CLEAR_T_ENDING_EXAMPLES.entries()) {
      if (examplesPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`examples-${item.text}`);
      scrollItemIntoView(examplesItemRefs.current[index] ?? null);
      await sleep(120);
      if (examplesPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(item.ttsText ?? item.text);
      if (examplesPlayAllTokenRef.current !== token) break;
      await sleep(140);
    }

    if (examplesPlayAllTokenRef.current === token) {
      setIsPlayingExamplesAll(false);
      setActiveTtsCardKey(null);
    }
  };

  const playAllSentences = async () => {
    if (isPlayingSentencesAll) return;

    stopAllPlayAll();
    const token = sentencesPlayAllTokenRef.current + 1;
    sentencesPlayAllTokenRef.current = token;
    setIsPlayingSentencesAll(true);

    for (const [index, item] of CLEAR_T_ENDING_SENTENCES.entries()) {
      if (sentencesPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`sentences-${item.text}`);
      scrollItemIntoView(sentencesItemRefs.current[index] ?? null);
      await sleep(120);
      if (sentencesPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(item.text);
      if (sentencesPlayAllTokenRef.current !== token) break;
      await sleep(200);
    }

    if (sentencesPlayAllTokenRef.current === token) {
      setIsPlayingSentencesAll(false);
      setActiveTtsCardKey(null);
    }
  };

  const playAllSentenceDrillsExamples = async () => {
    if (isPlayingSentenceDrillsAll) return;

    stopAllPlayAll();
    const token = sentenceDrillsPlayAllTokenRef.current + 1;
    sentenceDrillsPlayAllTokenRef.current = token;
    setIsPlayingSentenceDrillsAll(true);

    for (const [index, item] of CLEAR_T_ENDING_SENTENCE_DRILL_EXAMPLES_15.entries()) {
      if (sentenceDrillsPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`sentence-drills-examples-${item.id}`);
      scrollItemIntoView(sentenceDrillItemRefs.current[index] ?? null);
      await sleep(120);
      if (sentenceDrillsPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(item.text);
      if (sentenceDrillsPlayAllTokenRef.current !== token) break;
      await sleep(220);
    }

    if (sentenceDrillsPlayAllTokenRef.current === token) {
      setIsPlayingSentenceDrillsAll(false);
      setActiveTtsCardKey(null);
    }
  };

  const toggleIpaBySection = (sectionId: IpaSectionId) => {
    setShowIpaBySection((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const jumpToSection = useCallback((sectionId: JumpSectionId) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('at-lesson-jump-to-section', {
        detail: { sectionId },
      }),
    );
  }, []);

  const handleCopyPrompt = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(RELEASED_T_ENDING_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy released /t/ ending prompt:', error);
      setIsPromptCopied(false);
    }
  }, []);

  useEffect(() => {
    const handleLessonSectionClosed = () => {
      stopAllPlayAll();
    };

    window.addEventListener('at-lesson-section-closed', handleLessonSectionClosed);
    return () => {
      window.removeEventListener('at-lesson-section-closed', handleLessonSectionClosed);
      stopAllPlayAll();
    };
  }, [stopAllPlayAll]);

  useEffect(
    () => () => {
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
    },
    [],
  );

  return (
    <>
      <AmericanTLessonScaffold
      title="Released /t/ Ending"
      subtitle="Latihan /t/ yang tetap jelas saat berada di akhir kata atau sebelum vokal."
      backTo="/skill/pronunciation/american-t"
      headerActions={
        <ButtonSavedProgress
          isSaved={isProgressSaved}
          onSave={handleSaveProgress}
          onUnsave={handleUnsaveProgress}
          size="small"
          variant="primary"
          topicName="Released /t/ Ending"
        />
      }
      sections={[
        {
          id: 'concept',
          title: 'Concept',
          content: (
            <div className="at-topic-concept">
              <p className="fs-topic-text">
                Tidak semua final /t/ harus dilemahkan. Pada konteks tertentu, terutama saat kata
                berdiri sendiri atau diberi penekanan, final /t/ tetap bisa terdengar jelas.
              </p>
              <p className="fs-topic-text">
                Di sini kita melatih <strong>release yang singkat</strong>: cukup jelas untuk
                pendengar, tetapi tetap natural.
              </p>
            </div>
          ),
        },
        {
          id: 'examples',
          title: 'Word/Phrase Examples',
          content: (
            <div className="at-word-chip-wrap">
              <div className="at-word-chip-toolbar at-word-chip-toolbar--split">
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => toggleIpaBySection('examples')}
                >
                  {showIpaBySection.examples ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => {
                    if (isPlayingExamplesAll) {
                      stopAllPlayAll();
                      return;
                    }
                    void playAllExamples();
                  }}
                >
                  {isPlayingExamplesAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              <div className="at-example-grid">
                {CLEAR_T_ENDING_EXAMPLES.map((item, index) => (
                  <article
                    key={item.text}
                    className={`at-example-card ${activeTtsCardKey === `examples-${item.text}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      examplesItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-example-head">
                      <h3>{item.text}</h3>
                      <button
                        type="button"
                        className="fs-topic-mini-btn at-play-chip-btn"
                        aria-label={`Putar ${item.text}`}
                        title="Putar"
                        onClick={() =>
                          void playSingleCardTts(
                            item.ttsText ?? item.text,
                            `examples-${item.text}`,
                          )
                        }
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpaBySection.examples ? (
                      <p className="at-ipa">{formatIpaForDisplay(item.ipa)}</p>
                    ) : null}
                    <p className="at-note">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          ),
        },
        {
          id: 'sentences',
          title: 'Sentence Drills',
          content: (
            <div className="at-word-chip-wrap">
              <div className="at-word-chip-toolbar at-word-chip-toolbar--split">
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => toggleIpaBySection('sentences')}
                >
                  {showIpaBySection.sentences ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => {
                    if (isPlayingSentencesAll) {
                      stopAllPlayAll();
                      return;
                    }
                    void playAllSentences();
                  }}
                >
                  {isPlayingSentencesAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              <div className="at-sentence-list">
                {CLEAR_T_ENDING_SENTENCES.map((item, index) => (
                  <article
                    key={item.text}
                    className={`at-sentence-card ${activeTtsCardKey === `sentences-${item.text}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      sentencesItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-example-head">
                      <p>{item.text}</p>
                      <button
                        type="button"
                        className="fs-topic-mini-btn at-play-chip-btn"
                        aria-label={`Putar kalimat: ${item.text}`}
                        title="Putar"
                        onClick={() => void playSingleCardTts(item.text, `sentences-${item.text}`)}
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpaBySection.sentences && item.ipa ? (
                      <p className="at-ipa">{formatIpaForDisplay(item.ipa)}</p>
                    ) : null}
                    <p className="at-note">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          ),
        },
        {
          id: 'sentence-drills-examples',
          title: 'Sentence Drill Examples (15)',
          content: (
            <div className="at-word-chip-wrap">
              <div
                className="at-sentence-drill-note"
                role="note"
                aria-label="Catatan latihan sentence drills examples"
              >
                <p>
                  Fokuskan bunyi <strong>released /t/ ending</strong> pada kata yang di-highlight.
                  Latih per kalimat dengan <strong>Putar</strong> dulu, lalu pakai{' '}
                  <strong>Play All</strong> untuk ritme.
                </p>
              </div>
              <div className="at-word-chip-toolbar at-word-chip-toolbar--split">
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => toggleIpaBySection('sentence-drills-examples')}
                >
                  {showIpaBySection['sentence-drills-examples'] ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => {
                    if (isPlayingSentenceDrillsAll) {
                      stopAllPlayAll();
                      return;
                    }
                    void playAllSentenceDrillsExamples();
                  }}
                >
                  {isPlayingSentenceDrillsAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              {CLEAR_T_ENDING_SENTENCE_DRILL_EXAMPLES_15.map((item, index) => (
                <article
                  key={item.id}
                  className={`at-sentence-card at-sentence-card--drill ${activeTtsCardKey === `sentence-drills-examples-${item.id}` ? 'is-speaking' : ''}`}
                  ref={(node) => {
                    sentenceDrillItemRefs.current[index] = node;
                  }}
                >
                  <div className="at-example-head">
                    <p className="at-sentence-text-chip">
                      {renderSentenceWithHighlights(item.text, item.focusWords)}
                    </p>
                    <button
                      type="button"
                      className="fs-topic-mini-btn at-play-chip-btn"
                      aria-label={`Putar kalimat: ${item.text}`}
                      title="Putar"
                      onClick={() =>
                        void playSingleCardTts(item.text, `sentence-drills-examples-${item.id}`)
                      }
                    >
                      <span className="at-play-chip-icon" aria-hidden="true" />
                      <span className="at-visually-hidden">Putar</span>
                    </button>
                  </div>
                  {showIpaBySection['sentence-drills-examples'] ? (
                    <p className="at-ipa">{formatIpaForDisplay(item.ipa)}</p>
                  ) : null}
                </article>
              ))}
            </div>
          ),
        },
        {
          id: 'notes',
          title: 'Catatan',
          content: (
            <div className="at-example-grid">
              <article className="at-example-card at-common-mistakes-card">
                <ul className="fs-topic-list at-common-mistakes-list">
                  {CLEAR_T_ENDING_NOTES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          ),
        },
        {
          id: 'mistakes',
          title: 'Common Mistakes',
          content: (
            <div className="at-example-grid">
              <article className="at-example-card at-common-mistakes-card">
                <ul className="fs-topic-list at-common-mistakes-list">
                  {RELEASED_T_ENDING_COMMON_MISTAKES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          ),
        },
        {
          id: 'checklist',
          title: 'Practice',
          content: (
            <p className="fs-topic-text at-practice-mission">
              <strong>Mission:</strong> Bacakan 10 contoh kata di{' '}
              <button
                type="button"
                className="at-inline-jump-btn"
                onClick={() => jumpToSection('examples')}
              >
                Word/Phrase Examples
              </button>{' '}
              dan 5 kalimat di{' '}
              <button
                type="button"
                className="at-inline-jump-btn"
                onClick={() => jumpToSection('sentence-drills-examples')}
              >
                Sentence Drill Examples (15)
              </button>
              .
            </p>
          ),
        },
        {
          id: 'prompt',
          title: 'Prompt',
          content: (
            <div className="at-prompt-card">
              <div className="at-prompt-header">
                <p className="at-prompt-title">Prompt Penilaian Released /t/ Ending</p>
                <button
                  type="button"
                  onClick={() => void handleCopyPrompt()}
                  className="at-prompt-copy-btn"
                  aria-label="Salin prompt"
                  title="Salin prompt"
                >
                  <Copy size={13} />
                  <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
                </button>
              </div>
              <div className="at-prompt-quote-card">
                <p className="at-prompt-quote">
                  &quot;{RELEASED_T_ENDING_EVALUATION_PROMPT}&quot;
                </p>
              </div>
            </div>
          ),
        },
      ]}
      />
      <RecordingControlsButton
        className="at-recording-anchor"
        downloadFileName="american-t-released-ending-GEUWAT-recording.wav"
      />
    </>
  );
}

