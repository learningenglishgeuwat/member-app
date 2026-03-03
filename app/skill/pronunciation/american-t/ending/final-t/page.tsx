'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import AmericanTLessonScaffold from '../../components/AmericanTLessonScaffold';
import ButtonSavedProgress from '../../../../components/buttonSavedProgress';
import {
  extractFocusPhrase,
  renderGeneralIpaWithTHighlight,
  renderSentenceWithFocusHighlight,
} from '../../components/AmericanTHelpers';
import {
  COMMON_MISTAKES,
  FINAL_T_BEFORE_CONSONANT,
  FINAL_T_SENTENCE_BANK,
  SENTENCE_DRILLS,
} from '../../data/ending/final-t';
import {
  primeBestEnglishVoice,
  speakWithBestEnglishVoice,
} from '../../../final-sound-new/tts-utils';

const RecordingControlsButton = dynamic(
  () => import('../../../../components/RecordingControlsButton'),
  {
    ssr: false,
  },
);

type IpaSectionId = 'phraseExamples' | 'sentenceBank' | 'drills';
type JumpSectionId = 'phraseExamples' | 'sentenceBank';

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const FINAL_T_BEFORE_CONSONANT_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kata, frasa, dan kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi final /t/ sebelum konsonan (released vs unreleased), kontrol penutupan bunyi, dan ritme sambung antar-kata. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata/frasa/kalimat yang diucapkan (pola final /t/ sebelum konsonan). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian final /t/ mana yang perlu diperbaiki.";

function pickPreferredVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  return (
    voices.find((voice) => voice.name === 'Google US English') ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Google')) ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Samantha')) ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Zira')) ||
    voices.find((voice) => voice.lang === 'en-US') ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) ||
    null
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const FINAL_T_DRILL_HIGHLIGHTS: Readonly<Record<string, ReadonlyArray<string>>> = {
  'I left my bag at school today.': ['at school'],
  'Please stop and eat your hot dog slowly.': ['hot dog'],
  'This result is not bad for a first try.': ['not bad'],
  'We need to start right now, no delay.': ['right now'],
  'Take a breath, then get ready to speak.': ['get ready'],
};

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

function formatIpaForDisplay(ipa: string): string {
  const trimmed = ipa.trim();
  if (!trimmed) return '';
  const core = trimmed.replace(/^\/+|\/+$/g, '');
  return `/${core}/`;
}

async function speakWordForPlayAll(text: string): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    await speakWithBestEnglishVoice(text);
    return;
  }

  await primeBestEnglishVoice();
  const synth = window.speechSynthesis;
  const preferredVoice = pickPreferredVoice(synth.getVoices());

  await new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    }
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    synth.speak(utterance);
  });
}

export default function FinalTEndingPage() {
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
  const [isPlayingPhraseAll, setIsPlayingPhraseAll] = useState(false);
  const [isPlayingSentenceBankAll, setIsPlayingSentenceBankAll] = useState(false);
  const [isPlayingDrillsAll, setIsPlayingDrillsAll] = useState(false);
  const [activeTtsCardKey, setActiveTtsCardKey] = useState<string | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [showIpaBySection, setShowIpaBySection] = useState<Record<IpaSectionId, boolean>>({
    phraseExamples: false,
    sentenceBank: false,
    drills: false,
  });

  const phrasePlayAllTokenRef = useRef(0);
  const sentenceBankPlayAllTokenRef = useRef(0);
  const drillsPlayAllTokenRef = useRef(0);
  const singlePlayTokenRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const phraseItemRefs = useRef<Array<HTMLElement | null>>([]);
  const sentenceBankItemRefs = useRef<Array<HTMLElement | null>>([]);
  const drillsItemRefs = useRef<Array<HTMLElement | null>>([]);

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
    phrasePlayAllTokenRef.current += 1;
    sentenceBankPlayAllTokenRef.current += 1;
    drillsPlayAllTokenRef.current += 1;
    singlePlayTokenRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingPhraseAll(false);
    setIsPlayingSentenceBankAll(false);
    setIsPlayingDrillsAll(false);
    setActiveTtsCardKey(null);
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

  const playAllPhraseExamples = async () => {
    if (isPlayingPhraseAll) return;

    stopAllPlayAll();
    const token = phrasePlayAllTokenRef.current + 1;
    phrasePlayAllTokenRef.current = token;
    setIsPlayingPhraseAll(true);

    for (const [index, item] of FINAL_T_BEFORE_CONSONANT.entries()) {
      if (phrasePlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`phrase-${item.phrase}`);
      scrollItemIntoView(phraseItemRefs.current[index] ?? null);
      await sleep(120);
      if (phrasePlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(item.phrase);
      if (phrasePlayAllTokenRef.current !== token) break;
      await sleep(160);
    }

    if (phrasePlayAllTokenRef.current === token) {
      setIsPlayingPhraseAll(false);
      setActiveTtsCardKey(null);
    }
  };

  const playAllSentenceBank = async () => {
    if (isPlayingSentenceBankAll) return;

    stopAllPlayAll();
    const token = sentenceBankPlayAllTokenRef.current + 1;
    sentenceBankPlayAllTokenRef.current = token;
    setIsPlayingSentenceBankAll(true);

    for (const [index, item] of FINAL_T_SENTENCE_BANK.entries()) {
      if (sentenceBankPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`sentence-bank-${item.text}`);
      scrollItemIntoView(sentenceBankItemRefs.current[index] ?? null);
      await sleep(120);
      if (sentenceBankPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(item.text);
      if (sentenceBankPlayAllTokenRef.current !== token) break;
      await sleep(220);
    }

    if (sentenceBankPlayAllTokenRef.current === token) {
      setIsPlayingSentenceBankAll(false);
      setActiveTtsCardKey(null);
    }
  };

  const playAllDrills = async () => {
    if (isPlayingDrillsAll) return;

    stopAllPlayAll();
    const token = drillsPlayAllTokenRef.current + 1;
    drillsPlayAllTokenRef.current = token;
    setIsPlayingDrillsAll(true);

    for (const [index, item] of SENTENCE_DRILLS.entries()) {
      if (drillsPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`drill-${item.text}`);
      scrollItemIntoView(drillsItemRefs.current[index] ?? null);
      await sleep(120);
      if (drillsPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(item.text);
      if (drillsPlayAllTokenRef.current !== token) break;
      await sleep(220);
    }

    if (drillsPlayAllTokenRef.current === token) {
      setIsPlayingDrillsAll(false);
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
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(FINAL_T_BEFORE_CONSONANT_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
        promptCopyTimeoutRef.current = null;
      }, 1800);
    } catch {
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

  useEffect(() => {
    return () => {
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <AmericanTLessonScaffold
      title="Final T Before Consonant"
      subtitle="Latihan final /t/ saat bertemu konsonan berikutnya."
      backTo="/skill/pronunciation/american-t"
      headerActions={
        <ButtonSavedProgress
          isSaved={isProgressSaved}
          onSave={handleSaveProgress}
          onUnsave={handleUnsaveProgress}
          size="small"
          variant="primary"
          topicName="Final T Before Consonant"
        />
      }
      sections={[
        {
          id: 'concept',
          title: 'Concept',
          content: (
            <div className="at-topic-concept">
              <p className="fs-topic-text">
                Saat <strong>/t/ di akhir kata</strong> bertemu kata berikutnya yang diawali
                konsonan, bunyi /t/ sering menjadi <strong>unreleased /t̚/</strong>. Artinya
                penutupan tetap ada, tetapi tanpa letupan penuh.
              </p>
            </div>
          ),
        },
        {
          id: 'phraseExamples',
          title: 'Phrase Examples',
          content: (
            <div className="at-word-chip-wrap">
              <div className="at-word-chip-toolbar at-word-chip-toolbar--split">
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => toggleIpaBySection('phraseExamples')}
                >
                  {showIpaBySection.phraseExamples ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => {
                    if (isPlayingPhraseAll) {
                      stopAllPlayAll();
                      return;
                    }
                    void playAllPhraseExamples();
                  }}
                >
                  {isPlayingPhraseAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              <div className="at-example-grid">
                {FINAL_T_BEFORE_CONSONANT.map((item, index) => (
                  <article
                    key={item.phrase}
                    className={`at-example-card ${activeTtsCardKey === `phrase-${item.phrase}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      phraseItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-example-head">
                      <h3>{item.phrase}</h3>
                      <button
                        type="button"
                        className="fs-topic-mini-btn at-play-chip-btn"
                        aria-label={`Putar ${item.phrase}`}
                        title="Putar"
                        onClick={() => void playSingleCardTts(item.phrase, `phrase-${item.phrase}`)}
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpaBySection.phraseExamples ? (
                      <>
                        <p className="at-ipa">
                          General IPA: {renderGeneralIpaWithTHighlight(formatIpaForDisplay(item.ipa))}
                        </p>
                        <p className="at-ipa">Bunyi santai: {formatIpaForDisplay(item.spoken)}</p>
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
          id: 'sentenceBank',
          title: 'Final T Sentence Bank (30)',
          content: (
            <div className="at-word-chip-wrap">
              <div className="at-word-chip-toolbar at-word-chip-toolbar--split">
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => toggleIpaBySection('sentenceBank')}
                >
                  {showIpaBySection.sentenceBank ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => {
                    if (isPlayingSentenceBankAll) {
                      stopAllPlayAll();
                      return;
                    }
                    void playAllSentenceBank();
                  }}
                >
                  {isPlayingSentenceBankAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              <div className="at-sentence-list">
                {FINAL_T_SENTENCE_BANK.map((item, index) => (
                  <article
                    key={item.text}
                    className={`at-sentence-card ${activeTtsCardKey === `sentence-bank-${item.text}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      sentenceBankItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-example-head">
                      <p className="at-sentence-text-chip">
                        {renderSentenceWithFocusHighlight(item.text, extractFocusPhrase(item.note))}
                      </p>
                      <button
                        type="button"
                        className="fs-topic-mini-btn at-play-chip-btn"
                        aria-label={`Putar kalimat: ${item.text}`}
                        title="Putar"
                        onClick={() =>
                          void playSingleCardTts(item.text, `sentence-bank-${item.text}`)
                        }
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpaBySection.sentenceBank && item.ipa ? (
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
          id: 'drills',
          title: 'Sentence Drills',
          content: (
            <div className="at-word-chip-wrap">
              <div className="at-word-chip-toolbar at-word-chip-toolbar--split">
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => toggleIpaBySection('drills')}
                >
                  {showIpaBySection.drills ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => {
                    if (isPlayingDrillsAll) {
                      stopAllPlayAll();
                      return;
                    }
                    void playAllDrills();
                  }}
                >
                  {isPlayingDrillsAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              <div className="at-sentence-list">
                {SENTENCE_DRILLS.map((item, index) => (
                  <article
                    key={item.text}
                    className={`at-sentence-card ${activeTtsCardKey === `drill-${item.text}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      drillsItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-example-head">
                      <p className="at-sentence-text-chip">
                        {renderSentenceWithHighlights(
                          item.text,
                          FINAL_T_DRILL_HIGHLIGHTS[item.text] ?? [],
                        )}
                      </p>
                      <button
                        type="button"
                        className="fs-topic-mini-btn at-play-chip-btn"
                        aria-label={`Putar kalimat: ${item.text}`}
                        title="Putar"
                        onClick={() => void playSingleCardTts(item.text, `drill-${item.text}`)}
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpaBySection.drills && item.ipa ? (
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
          id: 'mistakes',
          title: 'Common Mistakes',
          content: (
            <div className="at-example-grid">
              <article className="at-example-card at-common-mistakes-card">
                <ul className="fs-topic-list at-common-mistakes-list">
                  {COMMON_MISTAKES.map((item) => (
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
              <strong>Mission:</strong> Bacakan 5 contoh phrase di{' '}
              <button
                type="button"
                className="at-inline-jump-btn"
                onClick={() => jumpToSection('phraseExamples')}
              >
                Phrase Examples
              </button>{' '}
              dan 5 kalimat di{' '}
              <button
                type="button"
                className="at-inline-jump-btn"
                onClick={() => jumpToSection('sentenceBank')}
              >
                Final T Sentence Bank (30)
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
                <p className="at-prompt-title">Prompt Penilaian Final T Before Consonant</p>
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
                  &quot;{FINAL_T_BEFORE_CONSONANT_EVALUATION_PROMPT}&quot;
                </p>
              </div>
            </div>
          ),
        },
      ]}
      />
      <RecordingControlsButton
        className="at-recording-anchor"
        downloadFileName="american-t-final-before-consonant-GEUWAT-recording.wav"
      />
    </>
  );
}

