'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import AmericanTLessonScaffold from '../../components/AmericanTLessonScaffold';
import {
  renderAmericanTTextHighlight,
  renderGeneralIpaWithTHighlight,
  renderSentenceWithHighlights,
} from '../../components/AmericanTHelpers';
import ButtonSavedProgress from '../../../../components/buttonSavedProgress';
import { IpaVisibilityToggle, HighlightVisibilityToggle, ControlCenter, PlayStopButton } from '@/app/components';
import {
  FLAP_T_EXAMPLES,
  FLAP_T_SENTENCES,
  FLAP_T_SENTENCE_DRILL_EXAMPLES_15,
  FLAP_T_WORD_BANK_IPA,
  FLAP_T_WORD_BANK,
} from '../../data/middle/flap';
import {
  primeBestEnglishVoice,
  speakWithBestEnglishVoice,
} from '../../../final-sound-new/tts-utils';
import { speakText, stopSpeech } from '@/lib/tts/speech';

const RecordingControlsButton = dynamic(
  () => import('../../../../components/RecordingControlsButton'),
  {
    ssr: false,
  },
);

type IpaSectionId = 'examples' | 'word-bank' | 'sentences' | 'sentence-drills-examples';
type FlapPlaybackVariant = 'released' | 'flap';

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const AMERICAN_T_FLAP_PROGRESS_ID = 'americanTFlap';
const FLAP_T_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kata dan kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi flap T /ɾ/ di tengah kata, perbedaan bunyi released /t/ vs flap /ɾ/, serta kelancaran transisi antarvokal. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata/kalimat yang diucapkan (pola flap T). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian flap T mana yang perlu diperbaiki.";

const FLAP_T_COMMON_MISTAKES: ReadonlyArray<string> = [
  'Membaca flap T seperti /t/ keras sehingga terdengar terlalu kaku.',
  'Mengubah flap menjadi /r/ penuh, padahal bunyinya lebih singkat.',
  'Menahan bunyi terlalu lama sehingga ritme kalimat menjadi lambat.',
];

const FLAP_T_CONCEPT_PATTERNS: ReadonlyArray<string> = [
  'Pola inti: vokal + /t/ + vokal tak-stress (water, city, later).',
  'Pola umum: bunyi sebelum /t/ sonoran atau vokal, lalu lanjut ke suku kata lemah.',
  'Target bunyi: terdengar seperti d cepat (flap), bukan t letup keras.',
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

function renderFlapIpaForLearnerHighlight(ipa: string) {
  const chunks = formatIpaForDisplay(ipa).split(/(ɾ)/g);

  return chunks.map((chunk, idx) => {
    if (chunk === 'ɾ') {
      return (
        <span key={`${ipa}-flap-${idx}`} className="at-ipa-t">
          d
        </span>
      );
    }

    return <span key={`${ipa}-plain-${idx}`}>{chunk}</span>;
  });
}

function deriveGeneralIpaFromNatural(naturalIpa: string): string {
  const trimmed = naturalIpa.trim();
  if (!trimmed) return '';
  const core = trimmed.replace(/^\/+|\/+$/g, '').replace(/ɾ/g, 't');
  return `/${core}/`;
}

async function speakWordForPlayAll(text: string): Promise<void> {
  await speakWithBestEnglishVoice(text, {
    rate: 0.82,
    pitch: 1,
    volume: 1,
  });
}

async function speakWordByVariant(text: string, variant: FlapPlaybackVariant): Promise<void> {
  await speakText(text, {
    lang: variant === 'released' ? 'en-GB' : 'en-US',
    rate: variant === 'released' ? 0.74 : 0.82,
    pitch: 1,
    volume: 1,
    cancelBeforeSpeak: true,
  });
}

export default function FlapTPage() {
  const [isProgressSaved, setIsProgressSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const currentProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      const savedAssessments = JSON.parse(
        window.localStorage.getItem('savedAssessments') || '{}',
      ) as Record<string, { percentage?: unknown }>;
      const assessmentKey = 'Flap T /ɾ/'.toLowerCase().replace(/\s+/g, '_');
      const savedAssessmentPercent = savedAssessments[assessmentKey]?.percentage;
      const hasSavedAssessment =
        typeof savedAssessmentPercent === 'number' &&
        Number.isFinite(savedAssessmentPercent) &&
        savedAssessmentPercent > 0;

      return (
        (typeof currentProgress[AMERICAN_T_FLAP_PROGRESS_ID] === 'number' &&
          currentProgress[AMERICAN_T_FLAP_PROGRESS_ID] > 0) ||
        hasSavedAssessment
      );
    } catch {
      return false;
    }
  });
  const [isPlayingExamplesAll, setIsPlayingExamplesAll] = useState(false);
  const [isPlayingWordBankAll, setIsPlayingWordBankAll] = useState(false);
  const [isPlayingSentencesAll, setIsPlayingSentencesAll] = useState(false);
  const [isPlayingSentenceDrillsAll, setIsPlayingSentenceDrillsAll] = useState(false);
  const [activeTtsCardKey, setActiveTtsCardKey] = useState<string | null>(null);
  const [showIpa, setShowIpa] = useState(true);
  const [isHighlightEnabled, setIsHighlightEnabled] = useState(true);
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  const examplesPlayAllTokenRef = useRef(0);
  const wordBankPlayAllTokenRef = useRef(0);
  const sentencesPlayAllTokenRef = useRef(0);
  const sentenceDrillsPlayAllTokenRef = useRef(0);
  const singlePlayTokenRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const examplesItemRefs = useRef<Array<HTMLElement | null>>([]);
  const wordBankItemRefs = useRef<Array<HTMLElement | null>>([]);
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
      delete pronunciationProgress.americanT;
      pronunciationProgress[AMERICAN_T_FLAP_PROGRESS_ID] = percentage;
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
    delete pronunciationProgress[AMERICAN_T_FLAP_PROGRESS_ID];
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
    wordBankPlayAllTokenRef.current += 1;
    sentencesPlayAllTokenRef.current += 1;
    sentenceDrillsPlayAllTokenRef.current += 1;
    singlePlayTokenRef.current += 1;
    stopSpeech();
    setIsPlayingExamplesAll(false);
    setIsPlayingWordBankAll(false);
    setIsPlayingSentencesAll(false);
    setIsPlayingSentenceDrillsAll(false);
    setActiveTtsCardKey(null);
  }, []);

  const playSingleCardTts = async (
    text: string,
    activeCardKey: string,
    variant: FlapPlaybackVariant = 'flap',
  ) => {
    stopAllPlayAll();
    const token = singlePlayTokenRef.current + 1;
    singlePlayTokenRef.current = token;
    setActiveTtsCardKey(activeCardKey);
    await speakWordByVariant(text, variant);
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

    for (const [index, item] of FLAP_T_EXAMPLES.entries()) {
      if (examplesPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`examples-${item.word}`);
      scrollItemIntoView(examplesItemRefs.current[index] ?? null);
      await sleep(120);
      if (examplesPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(item.word);
      if (examplesPlayAllTokenRef.current !== token) break;
      await sleep(140);
    }

    if (examplesPlayAllTokenRef.current === token) {
      setIsPlayingExamplesAll(false);
      setActiveTtsCardKey(null);
    }
  };

  const playAllWordBank = async () => {
    if (isPlayingWordBankAll) return;

    stopAllPlayAll();
    const token = wordBankPlayAllTokenRef.current + 1;
    wordBankPlayAllTokenRef.current = token;
    setIsPlayingWordBankAll(true);

    for (const [index, word] of FLAP_T_WORD_BANK.entries()) {
      if (wordBankPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`word-bank-${word}`);
      scrollItemIntoView(wordBankItemRefs.current[index] ?? null);
      await sleep(120);
      if (wordBankPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(word);
      if (wordBankPlayAllTokenRef.current !== token) break;
      await sleep(140);
    }

    if (wordBankPlayAllTokenRef.current === token) {
      setIsPlayingWordBankAll(false);
      setActiveTtsCardKey(null);
    }
  };

  const playAllSentences = async () => {
    if (isPlayingSentencesAll) return;

    stopAllPlayAll();
    const token = sentencesPlayAllTokenRef.current + 1;
    sentencesPlayAllTokenRef.current = token;
    setIsPlayingSentencesAll(true);

    for (const [index, item] of FLAP_T_SENTENCES.entries()) {
      if (sentencesPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`sentences-${item.text}`);
      scrollItemIntoView(sentencesItemRefs.current[index] ?? null);
      await sleep(120);
      if (sentencesPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(item.text);
      if (sentencesPlayAllTokenRef.current !== token) break;
      await sleep(180);
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

    for (const [index, item] of FLAP_T_SENTENCE_DRILL_EXAMPLES_15.entries()) {
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


  const jumpToSection = useCallback((sectionId: 'wordBank' | 'sentence-drills-examples') => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('at-lesson-jump-to-section', {
        detail: { sectionId },
      }),
    );
  }, []);

  useEffect(() => {
    void primeBestEnglishVoice();
  }, []);

  const handleCopyPrompt = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(FLAP_T_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy flap t prompt:', error);
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
      title="Flap T /d/"
      subtitle="Pola American T saat /t/ berubah menjadi bunyi flap cepat di tengah kata."
      backTo="/skill/pronunciation/american-t"
      pageClassName={isHighlightEnabled ? undefined : 'at-highlight-off'}
      headerActions={
        <ButtonSavedProgress
          isSaved={isProgressSaved}
          onSave={handleSaveProgress}
          onUnsave={handleUnsaveProgress}
          size="small"
          variant="primary"
          topicName="Flap T /d/"
        />
      }
      sections={[
        {
          id: 'concept',
          title: 'Concept',
          content: (
            <div className="at-topic-concept">
              <p className="fs-topic-text">
                Pada banyak kata American English, <strong>/t/</strong> di posisi tengah bisa
                menjadi <strong>flap /ɾ/</strong> ketika berada di antara bunyi vokal/sonoran dan
                suku kata berikutnya tidak menerima stress utama.
              </p>
              <div className="at-flap-note">
                <p>
                  Catatan penting: <strong>/ɾ/ bukan /r/ Inggris (/ɹ/)</strong>. Untuk pemula,
                  bunyinya bisa dibayangkan sebagai <strong>soft /d/</strong> yang sangat cepat.
                </p>
              </div>
              <ul className="fs-topic-list">
                {FLAP_T_CONCEPT_PATTERNS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          id: 'examples',
          title: 'Flap T Examples',
          content: (
            <div className="at-word-chip-wrap">
              <div className="mb-4 flex items-center justify-between border-b border-purple-500/30 pb-2">
                <span className="font-sans text-[10px] md:text-xs text-purple-400 tracking-wider">Flap T Examples</span>
              </div>
              <div className="at-example-grid">
                {FLAP_T_EXAMPLES.map((item, index) => (
                  <article
                    key={item.word}
                    className={`at-example-card ${activeTtsCardKey === `examples-${item.word}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      examplesItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-example-head">
                      <h3>{renderAmericanTTextHighlight(item.word)}</h3>
                      <button
                        type="button"
                        className="fs-topic-mini-btn at-play-chip-btn"
                        aria-label={`Putar ${item.word}`}
                        title="Putar"
                        onClick={() => void playSingleCardTts(item.word, `examples-${item.word}`)}
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpa ? (
                      <>
                        <p className="at-ipa">
                          <span className="at-ipa-label">BrE (released /t/): </span>
                          {renderGeneralIpaWithTHighlight(formatIpaForDisplay(item.ipa))}
                        </p>
                        {item.spoken ? (
                          <p className="at-ipa">
                            <span className="at-ipa-label">AmE (flap /d/): </span>
                            {renderFlapIpaForLearnerHighlight(item.spoken)}
                          </p>
                        ) : null}
                      </>
                    ) : null}
                    <p className="at-note">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          ),
        },
        {
          id: 'wordBank',
          title: 'Flap T (List of Examples) (46)',
          content: (
            <div className="at-flap-bank-wrap">
              <p className="fs-topic-text">
                Daftar ini fokus pada pola <strong>/t/ menjadi flap</strong> dalam American English.
              </p>
              <div className="at-flap-note" role="note" aria-label="Catatan model pelafalan before dan after">
                <p>
                  Catatan model suara: <strong>BrE</strong> memakai model <strong>British</strong>{' '}
                  (released T), sedangkan <strong>AmE</strong> memakai model <strong>American</strong>{' '}
                  (flap T).
                </p>
              </div>
              <div className="mb-4 mt-4 flex items-center justify-between border-b border-purple-500/30 pb-2">
                <span className="font-sans text-[10px] md:text-xs text-purple-400 tracking-wider">Flap T (List of Examples)</span>
              </div>
              <div className="at-flap-bank-grid">
                {FLAP_T_WORD_BANK.map((word, index) => (
                  <article
                    key={word}
                    className={`at-flap-bank-card ${activeTtsCardKey === `word-bank-${word}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      wordBankItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-flap-bank-head">
                      <span className="at-flap-bank-word">{renderAmericanTTextHighlight(word)}</span>
                    </div>
                    {showIpa ? (() => {
                      const naturalIpa = FLAP_T_WORD_BANK_IPA[word.toLowerCase()] ?? '';
                      const naturalSpeechDisplay = naturalIpa
                        ? renderFlapIpaForLearnerHighlight(naturalIpa)
                        : '-';
                      const generalIpaDisplay = naturalIpa
                        ? deriveGeneralIpaFromNatural(naturalIpa)
                        : '-';

                      return (
                        <>
                          <div className="at-flap-bank-ipa-row">
                            <p className="at-ipa at-flap-bank-ipa-text">
                              <span className="at-ipa-label">BrE (released /t/): </span>
                              {generalIpaDisplay === '-'
                                ? '-'
                                : renderGeneralIpaWithTHighlight(generalIpaDisplay)}
                            </p>
                            <button
                              type="button"
                              className="fs-topic-mini-btn at-play-chip-btn at-play-chip-btn--before"
                              aria-label={`Putar BrE ${word}`}
                              title="Putar BrE"
                              onClick={() => void playSingleCardTts(word, `word-bank-${word}`, 'released')}
                            >
                              <span className="at-play-chip-icon" aria-hidden="true" />
                              <span className="at-visually-hidden">Putar BrE</span>
                            </button>
                          </div>
                          <div className="at-flap-bank-ipa-row">
                            <p className="at-ipa at-flap-bank-ipa-text">
                              <span className="at-ipa-label">AmE (flap /d/): </span>
                              {naturalSpeechDisplay}
                            </p>
                            <button
                              type="button"
                              className="fs-topic-mini-btn at-play-chip-btn at-play-chip-btn--after"
                              aria-label={`Putar AmE ${word}`}
                              title="Putar AmE"
                              onClick={() => void playSingleCardTts(word, `word-bank-${word}`, 'flap')}
                            >
                              <span className="at-play-chip-icon" aria-hidden="true" />
                              <span className="at-visually-hidden">Putar AmE</span>
                            </button>
                          </div>
                        </>
                      );
                    })() : null}
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
              
              <div className="at-sentence-list">
                {FLAP_T_SENTENCES.map((item, index) => (
                  <article
                    key={item.text}
                    className={`at-sentence-card ${activeTtsCardKey === `sentences-${item.text}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      sentencesItemRefs.current[index] = node;
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
                        onClick={() => void playSingleCardTts(item.text, `sentences-${item.text}`)}
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpa ? (
                      <p className="at-ipa">
                        {renderFlapIpaForLearnerHighlight(item.ipa)}
                      </p>
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
              
              {FLAP_T_SENTENCE_DRILL_EXAMPLES_15.map((item, index) => (
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
                  {showIpa ? (
                    <p className="at-ipa">
                      {renderFlapIpaForLearnerHighlight(item.ipa)}
                    </p>
                  ) : null}
                </article>
              ))}
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
                  {FLAP_T_COMMON_MISTAKES.map((item) => (
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
              <strong>Mission:</strong>
              <br />
              Bacakan 10 contoh kata di{' '}
              <button
                type="button"
                className="at-inline-jump-btn"
                onClick={() => jumpToSection('wordBank')}
              >
                Flap T (List of Examples) (46)
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
                <p className="at-prompt-title">Prompt Penilaian Flap T /d/</p>
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
                  &quot;{FLAP_T_EVALUATION_PROMPT}&quot;
                </p>
              </div>
            </div>
          ),
        },
      ]}
      />
      
      <ControlCenter>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block uppercase">Actions</span>
            <IpaVisibilityToggle
              checked={showIpa}
              onChange={setShowIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
            />
            <HighlightVisibilityToggle
              checked={isHighlightEnabled}
              onChange={setIsHighlightEnabled}
              color="orange"
              label="Highlight American T"
            />
          </div>

          <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
            <PlayStopButton
            isActive={isPlayingExamplesAll}
            label="EXAMPLES"
            sectionId="examples"
            onClick={() => isPlayingExamplesAll ? stopAllPlayAll() : playAllExamples()}
            />
            <PlayStopButton
            isActive={isPlayingWordBankAll}
            label="50 WORDS"
            sectionId="wordBank"
            onClick={() => isPlayingWordBankAll ? stopAllPlayAll() : playAllWordBank()}
            />
            <PlayStopButton
            isActive={isPlayingSentencesAll}
            label="SENTENCES"
            sectionId="sentences"
            onClick={() => isPlayingSentencesAll ? stopAllPlayAll() : playAllSentences()}
            />
            <PlayStopButton
            isActive={isPlayingSentenceDrillsAll}
            label="DRILLS"
            sectionId="sentence-drills-examples"
            onClick={() => isPlayingSentenceDrillsAll ? stopAllPlayAll() : playAllSentenceDrillsExamples()}
            />
          </div>
        </div>
      </ControlCenter>
      <RecordingControlsButton
        className="at-recording-anchor"
        downloadFileName="american-t-flap-middle-GEUWAT-recording.wav"
      />
    </>
  );
}


