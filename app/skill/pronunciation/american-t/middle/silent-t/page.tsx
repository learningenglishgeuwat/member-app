'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import AmericanTLessonScaffold from '../../components/AmericanTLessonScaffold';
import ButtonSavedProgress from '../../../../components/buttonSavedProgress';
import {
  SILENT_T_EXAMPLES,
  SILENT_T_SENTENCES,
  SILENT_T_SENTENCE_DRILL_EXAMPLES_15,
  SILENT_T_SPEECH_MAP,
  SILENT_T_WORD_BANK_IPA,
  SILENT_T_WORD_BANK,
} from '../../data/middle/silent-t';
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

type IpaSectionId = 'examples' | 'word-bank' | 'sentences' | 'sentence-drills-examples';
type JumpSectionId = 'wordBank' | 'sentence-drills-examples';

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const SILENT_T_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kata dan kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi pola silent /t/ pada speech kasual, perbedaan careful speech vs natural speech, dan kejelasan kata meski /t/ direduksi. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata/kalimat yang diucapkan (pola silent /t/). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian silent /t/ mana yang perlu diperbaiki.";

const SILENT_T_COMMON_MISTAKES: ReadonlyArray<string> = [
  'Menghilangkan /t/ di semua kata tanpa melihat konteks percakapan.',
  'Mengucapkan terlalu redup sampai kata terdengar tidak jelas.',
  'Tidak membedakan gaya formal dan casual saat latihan.',
];

const SILENT_T_CONCEPT_PATTERNS: ReadonlyArray<string> = [
  'Pola inti: /nt/ di tengah kata sering jadi lebih ringan dalam ucapan kasual.',
  'Contoh umum: internet, winter, center, interview.',
  'Target bunyi: tetap jelas dipahami, meski /t/ tidak terdengar penuh.',
];

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

function formatIpaForDisplay(ipa: string): string {
  const trimmed = ipa.trim();
  if (!trimmed) return '';
  const core = trimmed.replace(/^\/+|\/+$/g, '');
  return `/${core}/`;
}

function deriveBeforeIpaFromSilent(silentIpa: string): string {
  const trimmed = silentIpa.trim();
  if (!trimmed) return '';

  // Approximate careful-speech IPA by restoring /t/ in common silent-/t/ patterns.
  let core = trimmed.replace(/^\/+|\/+$/g, '');
  core = core
    .replace(/nɚ/g, 'ntɚ')
    .replace(/nɪd/g, 'ntɪd')
    .replace(/nɪŋ/g, 'ntɪŋ')
    .replace(/niz/g, 'ntiz')
    .replace(/ni/g, 'nti');

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

function getSilentTSpeechText(text: string) {
  const normalized = text.trim().toLowerCase();
  return SILENT_T_SPEECH_MAP[normalized] ?? text;
}

function getSilentTSpeechTextForSentence(text: string) {
  return text.replace(/[A-Za-z']+/g, (rawWord) => {
    const mapped = SILENT_T_SPEECH_MAP[rawWord.toLowerCase()];
    if (!mapped) return rawWord;
    const first = rawWord.charAt(0);
    if (first === first.toUpperCase()) {
      return `${mapped.charAt(0).toUpperCase()}${mapped.slice(1)}`;
    }
    return mapped;
  });
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

export default function SilentTMiddlePage() {
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
  const [isPlayingWordBankAll, setIsPlayingWordBankAll] = useState(false);
  const [isPlayingSentencesAll, setIsPlayingSentencesAll] = useState(false);
  const [isPlayingSentenceDrillsAll, setIsPlayingSentenceDrillsAll] = useState(false);
  const [activeTtsCardKey, setActiveTtsCardKey] = useState<string | null>(null);
  const [showIpaBySection, setShowIpaBySection] = useState<Record<IpaSectionId, boolean>>({
    examples: false,
    'word-bank': false,
    sentences: false,
    'sentence-drills-examples': false,
  });
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
    wordBankPlayAllTokenRef.current += 1;
    sentencesPlayAllTokenRef.current += 1;
    sentenceDrillsPlayAllTokenRef.current += 1;
    singlePlayTokenRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingExamplesAll(false);
    setIsPlayingWordBankAll(false);
    setIsPlayingSentencesAll(false);
    setIsPlayingSentenceDrillsAll(false);
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

  const playAllExamples = async () => {
    if (isPlayingExamplesAll) return;

    stopAllPlayAll();
    const token = examplesPlayAllTokenRef.current + 1;
    examplesPlayAllTokenRef.current = token;
    setIsPlayingExamplesAll(true);

    for (const [index, item] of SILENT_T_EXAMPLES.entries()) {
      if (examplesPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`examples-${item.word}`);
      scrollItemIntoView(examplesItemRefs.current[index] ?? null);
      await sleep(120);
      if (examplesPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(getSilentTSpeechText(item.word));
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

    for (const [index, word] of SILENT_T_WORD_BANK.entries()) {
      if (wordBankPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`word-bank-${word}`);
      scrollItemIntoView(wordBankItemRefs.current[index] ?? null);
      await sleep(120);
      if (wordBankPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(getSilentTSpeechText(word));
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

    for (const [index, item] of SILENT_T_SENTENCES.entries()) {
      if (sentencesPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`sentences-${item.text}`);
      scrollItemIntoView(sentencesItemRefs.current[index] ?? null);
      await sleep(120);
      if (sentencesPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(getSilentTSpeechTextForSentence(item.text));
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

    for (const [index, item] of SILENT_T_SENTENCE_DRILL_EXAMPLES_15.entries()) {
      if (sentenceDrillsPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`sentence-drills-examples-${item.id}`);
      scrollItemIntoView(sentenceDrillItemRefs.current[index] ?? null);
      await sleep(120);
      if (sentenceDrillsPlayAllTokenRef.current !== token) break;
      await speakWordForPlayAll(getSilentTSpeechTextForSentence(item.text));
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
      await navigator.clipboard.writeText(SILENT_T_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy silent t prompt:', error);
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
      title="Silent /t/ (Casual Speech)"
      subtitle="Pola /t/ tengah yang sering melemah dalam percakapan American English."
      backTo="/skill/pronunciation/american-t"
      headerActions={
        <ButtonSavedProgress
          isSaved={isProgressSaved}
          onSave={handleSaveProgress}
          onUnsave={handleUnsaveProgress}
          size="small"
          variant="primary"
          topicName="Silent /t/"
        />
      }
      sections={[
        {
          id: 'concept',
          title: 'Concept',
          content: (
            <div className="at-topic-concept">
              <p className="fs-topic-text">
                Dalam gaya bicara kasual, beberapa kata berpola <strong>/nt/</strong> bisa
                terdengar seolah /t/-nya hilang. Ini bukan perubahan ejaan, tetapi variasi
                pelafalan dalam aliran bicara cepat.
              </p>
              <div className="at-silent-note">
                <p>
                  Fokus latihan: pahami kapan bunyi /t/ melemah, lalu tetap jaga kata agar jelas
                  bagi pendengar.
                </p>
              </div>
              <ul className="fs-topic-list">
                {SILENT_T_CONCEPT_PATTERNS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          id: 'examples',
          title: 'Silent /t/ Examples',
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
                {SILENT_T_EXAMPLES.map((item, index) => (
                  <article
                    key={item.word}
                    className={`at-example-card ${activeTtsCardKey === `examples-${item.word}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      examplesItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-example-head">
                      <h3>{item.word}</h3>
                      <button
                        type="button"
                        className="fs-topic-mini-btn at-play-chip-btn"
                        aria-label={`Putar ${item.word}`}
                        title="Putar"
                        onClick={() =>
                          void playSingleCardTts(
                            getSilentTSpeechText(item.word),
                            `examples-${item.word}`,
                          )
                        }
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpaBySection.examples ? (
                      <>
                        <p className="at-ipa">{formatIpaForDisplay(item.ipa)}</p>
                        {item.spoken ? (
                          <p className="at-ipa">Natural speech: {formatIpaForDisplay(item.spoken)}</p>
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
          title: 'Silent /t/ (List of Examples) (50)',
          content: (
            <div className="at-silent-bank-wrap">
              <p className="fs-topic-text">
                Gunakan bank ini untuk latihan listening dan pronunciation dengan pola silent /t/
                kasual.
              </p>
              <div className="at-word-chip-toolbar at-word-chip-toolbar--split">
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => toggleIpaBySection('word-bank')}
                >
                  {showIpaBySection['word-bank'] ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="fs-topic-mini-btn"
                  onClick={() => {
                    if (isPlayingWordBankAll) {
                      stopAllPlayAll();
                      return;
                    }
                    void playAllWordBank();
                  }}
                >
                  {isPlayingWordBankAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              <div className="at-silent-bank-grid">
                {SILENT_T_WORD_BANK.map((word, index) => (
                  <article
                    key={word}
                    className={`at-silent-bank-card ${activeTtsCardKey === `word-bank-${word}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      wordBankItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-silent-bank-head">
                      <span className="at-silent-bank-word">{word}</span>
                      {!showIpaBySection['word-bank'] ? (
                        <button
                          type="button"
                          className="fs-topic-mini-btn at-play-chip-btn"
                          aria-label={`Putar ${word}`}
                          title="Putar"
                          onClick={() =>
                            void playSingleCardTts(getSilentTSpeechText(word), `word-bank-${word}`)
                          }
                        >
                          <span className="at-play-chip-icon" aria-hidden="true" />
                          <span className="at-visually-hidden">Putar</span>
                        </button>
                      ) : null}
                    </div>
                    {showIpaBySection['word-bank'] ? (() => {
                      const afterRaw = SILENT_T_WORD_BANK_IPA[word.toLowerCase()] ?? '';
                      const afterDisplay = afterRaw ? formatIpaForDisplay(afterRaw) : '-';
                      const beforeDisplay = afterRaw ? deriveBeforeIpaFromSilent(afterRaw) : '-';

                      return (
                        <>
                          <div className="at-silent-bank-ipa-line">
                            <p className="at-ipa at-silent-bank-ipa-row at-silent-bank-ipa-text">
                              Before: {beforeDisplay}
                            </p>
                            <button
                              type="button"
                              className="fs-topic-mini-btn at-play-chip-btn at-play-chip-btn--before"
                              aria-label={`Putar before ${word}`}
                              title="Putar Before"
                              onClick={() => void playSingleCardTts(word, `word-bank-${word}`)}
                            >
                              <span className="at-play-chip-icon" aria-hidden="true" />
                              <span className="at-visually-hidden">Putar Before</span>
                            </button>
                          </div>
                          <div className="at-silent-bank-ipa-line">
                            <p className="at-ipa at-silent-bank-ipa-row at-silent-bank-ipa-text">
                              After: {afterDisplay}
                            </p>
                            <button
                              type="button"
                              className="fs-topic-mini-btn at-play-chip-btn at-play-chip-btn--after"
                              aria-label={`Putar after ${word}`}
                              title="Putar After"
                              onClick={() =>
                                void playSingleCardTts(getSilentTSpeechText(word), `word-bank-${word}`)
                              }
                            >
                              <span className="at-play-chip-icon" aria-hidden="true" />
                              <span className="at-visually-hidden">Putar After</span>
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
                {SILENT_T_SENTENCES.map((item, index) => (
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
                        onClick={() =>
                          void playSingleCardTts(
                            getSilentTSpeechTextForSentence(item.text),
                            `sentences-${item.text}`,
                          )
                        }
                      >
                        <span className="at-play-chip-icon" aria-hidden="true" />
                        <span className="at-visually-hidden">Putar</span>
                      </button>
                    </div>
                    {showIpaBySection.sentences ? (
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
              <div className="at-sentence-drill-note" role="note" aria-label="Catatan latihan silent t">
                <p>
                  Fokuskan pola <strong>silent /t/</strong> pada kata yang di-highlight. Mulai dari
                  per kalimat dengan tombol <strong>Putar</strong>, lalu pakai <strong>Play All</strong>
                  untuk melatih flow.
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
              {SILENT_T_SENTENCE_DRILL_EXAMPLES_15.map((item, index) => (
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
                        void playSingleCardTts(
                          getSilentTSpeechTextForSentence(item.text),
                          `sentence-drills-examples-${item.id}`,
                        )
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
          id: 'mistakes',
          title: 'Common Mistakes',
          content: (
            <div className="at-example-grid">
              <article className="at-example-card at-common-mistakes-card">
                <ul className="fs-topic-list at-common-mistakes-list">
                  {SILENT_T_COMMON_MISTAKES.map((item) => (
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
                onClick={() => jumpToSection('wordBank')}
              >
                Silent /t/ (List of Examples) (50)
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
                <p className="at-prompt-title">Prompt Penilaian Silent /t/</p>
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
              <p className="at-prompt-quote">
                &quot;{SILENT_T_EVALUATION_PROMPT}&quot;
              </p>
            </div>
          ),
        },
      ]}
      />
      <RecordingControlsButton
        className="at-recording-anchor"
        downloadFileName="american-t-silent-middle-GEUWAT-recording.wav"
      />
    </>
  );
}

