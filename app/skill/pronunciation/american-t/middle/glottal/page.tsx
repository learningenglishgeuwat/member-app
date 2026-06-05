'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import AmericanTLessonScaffold from '../../components/AmericanTLessonScaffold';
import {
  renderAmericanTIpaSymbolHighlight,
  renderGeneralIpaWithTHighlight,
  renderSentenceWithHighlights,
} from '../../components/AmericanTHelpers';
import ButtonSavedProgress from '../../../../components/buttonSavedProgress';
import { IpaVisibilityToggle, HighlightVisibilityToggle, ControlCenter, PlayStopButton } from '@/app/components';
import {
  GLOTTAL_SENTENCES,
  GLOTTAL_SENTENCE_DRILL_EXAMPLES_15,
  GLOTTAL_STOP_EXAMPLES,
  GLOTTAL_WORD_BANK_IPA,
  GLOTTAL_WORD_BANK,
} from '../../data/middle/glottal';
import {
  speakWithBestEnglishVoice,
} from '../../../final-sound-new/tts-utils';
import {
  createUtterance,
  isSpeechSynthesisSupported,
  speakText,
  stopSpeech,
  waitForVoices,
} from '@/lib/tts/speech';

const RecordingControlsButton = dynamic(
  () => import('../../../../components/RecordingControlsButton'),
  {
    ssr: false,
  },
);

type IpaSectionId = 'examples' | 'word-bank' | 'sentences' | 'sentence-drills-examples';
type JumpSectionId = 'wordBank' | 'sentence-drills-examples';
type GlottalNarrator = 'guy';
type GlottalPlaybackVariant = 'before' | 'after';

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const AMERICAN_T_GLOTTAL_STOP_PROGRESS_ID = 'americanTGlottalStop';
const GLOTTAL_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kata dan kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi glottal stop /ʔ/ pada konteks yang sesuai, perbedaan sebelum-sesudah glottal, dan kelancaran transisi bunyi sesudah jeda glotis. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata/kalimat yang diucapkan (pola glottal stop). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian glottal mana yang perlu diperbaiki.";

const GLOTTAL_COMMON_MISTAKES: ReadonlyArray<string> = [
  'Membaca semua /t/ sebagai glottal stop, padahal tidak semua konteks begitu.',
  'Menjadikan glottal terlalu panjang sehingga kata terdengar patah.',
  'Tidak menjaga transisi ke bunyi setelah glottal.',
];

const GLOTTAL_CONCEPT_PATTERNS: ReadonlyArray<string> = [
  'Pola inti: /t/ sebelum /n/ lemah, misalnya button, kitten, written.',
  'Pola tambahan: /t/ sebelum konsonan tertentu di tengah kata bisa terdengar stop singkat.',
  'Target bunyi: jeda glotis cepat, bukan /t/ letup panjang.',
];

const GLOTTAL_MIDDLE_NOTES: ReadonlyArray<string> = [
  'Fokus utama middle glottal di halaman ini: pola /t/ sebelum /n/ lemah (contoh: button, kitten, written).',
  'Kata seperti textbook tetap bisa terdengar stop di tengah kata, tetapi konteksnya /t/ sebelum konsonan (t+b), bukan pola /t/ + vowel + n.',
  'Prioritaskan dulu latihan pola /t/ + vowel + n sebagai pola inti, lalu pakai kata lain sebagai variasi listening.',
  'Final T adalah posisi akhir kata. Di posisi akhir, /t/ bisa released, unreleased, atau glottal tergantung konteks.',
];

function formatIpaForDisplay(ipa: string): string {
  const trimmed = ipa.trim();
  if (!trimmed) return '';
  const core = trimmed.replace(/^\/+|\/+$/g, '');
  return `/${core}/`;
}

function deriveBeforeIpaFromGlottal(glottalIpa: string): string {
  const trimmed = glottalIpa.trim();
  if (!trimmed) return '';
  const core = trimmed
    .replace(/^\/+|\/+$/g, '')
    .replace(/[\u0294]/g, 't')
    .replace(/Ê”/g, 't');
  return `/${core}/`;
}


function renderGlottalTTextHighlight(text: string) {
  const lower = text.toLowerCase();
  let glottalTIdx = -1;
  let glottalTLength = 1;

  // Rule 1: t immediately or shortly before n (button, kitten, tighten, threaten, straighten…)
  // Pattern: t + zero-or-more vowels + n
  const tnMatch = lower.match(/t[aeiou]*n/);
  if (tnMatch && tnMatch.index !== undefined) {
    glottalTIdx = tnMatch.index;
  }

  // Rule 2: no tn-pattern → scan right-to-left for last non-final t before a consonant
  // Covers: outfit, outback, hotdog, textbook, notepad, etc.
  if (glottalTIdx === -1) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    const consonants = new Set([...'bcdfghjklmnpqrstvwxyz']);
    for (let i = lower.length - 2; i >= 0; i--) {
      if (lower[i] !== 't') continue;
      const next = lower[i + 1];
      if (consonants.has(next)) {
        glottalTIdx = i;
        break;
      }
      // t + vowel + consonant (e.g. notepad: t-e-p)
      if (vowels.has(next) && i + 2 < lower.length && consonants.has(lower[i + 2])) {
        glottalTIdx = i;
        break;
      }
    }
  }

  if (glottalTIdx === -1) return <span>{text}</span>;

  // Expand to include adjacent 't's if there are multiple adjacent (like 'tt' in button/kitten)
  while (glottalTIdx > 0 && lower[glottalTIdx - 1] === 't') {
    glottalTIdx--;
    glottalTLength++;
  }
  while (glottalTIdx + glottalTLength < lower.length && lower[glottalTIdx + glottalTLength] === 't') {
    glottalTLength++;
  }

  const before = text.slice(0, glottalTIdx);
  const glottalT = text.slice(glottalTIdx, glottalTIdx + glottalTLength);
  const after = text.slice(glottalTIdx + glottalTLength);

  return (
    <>
      <span>{before}</span>
      <span className="at-text-t">{glottalT}</span>
      <span>{after}</span>
    </>
  );
}



function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function pickGlottalNarratorVoice(voices: SpeechSynthesisVoice[], narrator: GlottalNarrator) {
  const patterns = narrator === 'guy' ? [/guy/i, /davis/i, /david/i, /google us english/i] : [];
  const usVoices = voices.filter((voice) => voice.lang.toLowerCase() === 'en-us');
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));

  for (const pattern of patterns) {
    const inUs = usVoices.find((voice) => pattern.test(voice.name));
    if (inUs) return inUs;
  }

  for (const pattern of patterns) {
    const inEnglish = englishVoices.find((voice) => pattern.test(voice.name));
    if (inEnglish) return inEnglish;
  }

  return null;
}

const FIXED_GLOTTAL_NARRATOR: GlottalNarrator = 'guy';

async function speakWordForPlayAll(text: string): Promise<void> {
  await speakWithBestEnglishVoice(text, {
    rate: 0.82,
    pitch: 1,
    volume: 1,
  });
}

async function speakReleasedTWord(text: string): Promise<void> {
  await speakText(text, {
    lang: 'en-GB',
    rate: 0.74,
    pitch: 1,
    volume: 1,
    cancelBeforeSpeak: true,
  });
}

async function speakGlottalWithAlternateVoice(text: string) {
  if (!text.trim()) return;

  const speechRate = 0.82;

  if (!isSpeechSynthesisSupported()) {
    await speakWithBestEnglishVoice(text, { rate: speechRate, pitch: 1, volume: 1 });
    return;
  }

  const synth = window.speechSynthesis;
  await waitForVoices();
  const voices = synth.getVoices();
  const narratorVoice = pickGlottalNarratorVoice(voices, FIXED_GLOTTAL_NARRATOR);

  if (!narratorVoice) {
    await speakWordForPlayAll(text);
    return;
  }

  await new Promise<void>((resolve) => {
    stopSpeech();
    const utterance = createUtterance(text, {
      lang: narratorVoice.lang || 'en-US',
      rate: speechRate,
      pitch: 1,
      volume: 1,
      cancelBeforeSpeak: false,
    });
    if (!utterance) {
      resolve();
      return;
    }
    utterance.voice = narratorVoice;
    utterance.lang = narratorVoice.lang || 'en-US';
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    synth.speak(utterance);
  });
}

export default function GlottalPage() {
  const [isProgressSaved, setIsProgressSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const currentProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      const savedAssessments = JSON.parse(
        window.localStorage.getItem('savedAssessments') || '{}',
      ) as Record<string, { percentage?: unknown }>;
      const assessmentKey = 'Glottal Stop /ʔ/'.toLowerCase().replace(/\s+/g, '_');
      const savedAssessmentPercent = savedAssessments[assessmentKey]?.percentage;
      const hasSavedAssessment =
        typeof savedAssessmentPercent === 'number' &&
        Number.isFinite(savedAssessmentPercent) &&
        savedAssessmentPercent > 0;

      return (
        (typeof currentProgress[AMERICAN_T_GLOTTAL_STOP_PROGRESS_ID] === 'number' &&
          currentProgress[AMERICAN_T_GLOTTAL_STOP_PROGRESS_ID] > 0) ||
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
      pronunciationProgress[AMERICAN_T_GLOTTAL_STOP_PROGRESS_ID] = percentage;
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
    delete pronunciationProgress[AMERICAN_T_GLOTTAL_STOP_PROGRESS_ID];
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
    variant: GlottalPlaybackVariant = 'after',
  ) => {
    stopAllPlayAll();
    const token = singlePlayTokenRef.current + 1;
    singlePlayTokenRef.current = token;
    setActiveTtsCardKey(activeCardKey);
    if (variant === 'before') {
      await speakReleasedTWord(text);
    } else {
      await speakGlottalWithAlternateVoice(text);
    }
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

    for (const [index, item] of GLOTTAL_STOP_EXAMPLES.entries()) {
      if (examplesPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`examples-${item.word}`);
      scrollItemIntoView(examplesItemRefs.current[index] ?? null);
      await sleep(120);
      if (examplesPlayAllTokenRef.current !== token) break;
      await speakGlottalWithAlternateVoice(item.word);
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

    for (const [index, word] of GLOTTAL_WORD_BANK.entries()) {
      if (wordBankPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`word-bank-${word}`);
      scrollItemIntoView(wordBankItemRefs.current[index] ?? null);
      await sleep(120);
      if (wordBankPlayAllTokenRef.current !== token) break;
      await speakGlottalWithAlternateVoice(word);
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

    for (const [index, item] of GLOTTAL_SENTENCES.entries()) {
      if (sentencesPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`sentences-${item.text}`);
      scrollItemIntoView(sentencesItemRefs.current[index] ?? null);
      await sleep(120);
      if (sentencesPlayAllTokenRef.current !== token) break;
      await speakGlottalWithAlternateVoice(item.text);
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

    for (const [index, item] of GLOTTAL_SENTENCE_DRILL_EXAMPLES_15.entries()) {
      if (sentenceDrillsPlayAllTokenRef.current !== token) break;
      setActiveTtsCardKey(`sentence-drills-examples-${item.id}`);
      scrollItemIntoView(sentenceDrillItemRefs.current[index] ?? null);
      await sleep(120);
      if (sentenceDrillsPlayAllTokenRef.current !== token) break;
      await speakGlottalWithAlternateVoice(item.text);
      if (sentenceDrillsPlayAllTokenRef.current !== token) break;
      await sleep(220);
    }

    if (sentenceDrillsPlayAllTokenRef.current === token) {
      setIsPlayingSentenceDrillsAll(false);
      setActiveTtsCardKey(null);
    }
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
      await navigator.clipboard.writeText(GLOTTAL_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy glottal prompt:', error);
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
      title="Glottal Stop /ʔ/"
      subtitle="Pola jeda glotis pada beberapa kata American English."
      backTo="/skill/pronunciation/american-t"
      pageClassName={isHighlightEnabled ? undefined : 'at-highlight-off'}
      headerActions={
        <ButtonSavedProgress
          isSaved={isProgressSaved}
          onSave={handleSaveProgress}
          onUnsave={handleUnsaveProgress}
          size="small"
          variant="primary"
          topicName="Glottal Stop /ʔ/"
        />
      }
      sections={[
        {
          id: 'concept',
          title: 'Concept',
          content: (
            <div className="at-topic-concept">
              <p className="fs-topic-text">
                Simbol <strong>/ʔ/</strong> adalah <strong>glottal stop</strong>, yaitu penutupan
                aliran udara singkat di glotis. Ini bukan bunyi /t/ letup penuh.
              </p>
              <div className="at-glottal-note">
                <p>
                  Catatan: di halaman ini section glottal memakai profil speaker tetap agar
                  karakter bunyinya konsisten saat latihan.
                </p>
              </div>
              <ul className="fs-topic-list">
                {GLOTTAL_CONCEPT_PATTERNS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          id: 'middle-glottal-notes',
          title: 'Catatan Middle Glottal',
          content: (
            <div className="at-glottal-note" role="note" aria-label="Catatan pola middle glottal">
              <ul className="fs-topic-list">
                {GLOTTAL_MIDDLE_NOTES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          id: 'examples',
          title: 'Glottal Examples',
          content: (
            <div className="at-word-chip-wrap">
              
              <div className="at-example-grid">
                {GLOTTAL_STOP_EXAMPLES.map((item, index) => (
                  <article
                    key={item.word}
                    className={`at-example-card ${activeTtsCardKey === `examples-${item.word}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      examplesItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-example-head">
                      <h3>{renderGlottalTTextHighlight(item.word)}</h3>
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
                          <span className="at-ipa-label">General IPA: </span>
                          {renderGeneralIpaWithTHighlight(formatIpaForDisplay(item.ipa))}
                        </p>
                        {item.spoken ? (
                          <p className="at-ipa">
                            <span className="at-ipa-label">Natural speech: </span>
                            {renderAmericanTIpaSymbolHighlight(formatIpaForDisplay(item.spoken), ['ʔ'])}
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
          title: 'Glottal Word Bank (44)',
          content: (
            <div className="at-glottal-bank-wrap">
              <p className="fs-topic-text">
                Daftar latihan untuk pola glottal pada American casual speech.
              </p>
              
              <div className="at-glottal-bank-grid">
                {GLOTTAL_WORD_BANK.map((word, index) => (
                  <article
                    key={word}
                    className={`at-glottal-bank-card ${activeTtsCardKey === `word-bank-${word}` ? 'is-speaking' : ''}`}
                    ref={(node) => {
                      wordBankItemRefs.current[index] = node;
                    }}
                  >
                    <div className="at-glottal-bank-head">
                      <span className="at-glottal-bank-word">{renderGlottalTTextHighlight(word)}</span>
                      {!showIpa ? (
                        <button
                          type="button"
                          className="fs-topic-mini-btn at-play-chip-btn"
                          aria-label={`Putar ${word}`}
                          title="Putar"
                          onClick={() => void playSingleCardTts(word, `word-bank-${word}`, 'after')}
                        >
                          <span className="at-play-chip-icon" aria-hidden="true" />
                          <span className="at-visually-hidden">Putar</span>
                        </button>
                      ) : null}
                    </div>
                    {showIpa ? (() => {
                      const afterRaw = GLOTTAL_WORD_BANK_IPA[word.toLowerCase()] ?? '';
                      const afterDisplay = afterRaw ? formatIpaForDisplay(afterRaw) : '-';
                      const beforeDisplay = afterRaw ? deriveBeforeIpaFromGlottal(afterRaw) : '-';

                      return (
                        <>
                          <div className="at-glottal-bank-ipa-line">
                            <p className="at-ipa at-glottal-bank-ipa-row at-glottal-bank-ipa-text">
                              <span className="at-ipa-label">Before: </span>
                              {renderGeneralIpaWithTHighlight(beforeDisplay)}
                            </p>
                            <button
                              type="button"
                              className="fs-topic-mini-btn at-play-chip-btn at-play-chip-btn--before"
                              aria-label={`Putar before ${word}`}
                              title="Putar Before"
                              onClick={() => void playSingleCardTts(word, `word-bank-${word}`, 'before')}
                            >
                              <span className="at-play-chip-icon" aria-hidden="true" />
                              <span className="at-visually-hidden">Putar Before</span>
                            </button>
                          </div>
                          <div className="at-glottal-bank-ipa-line">
                            <p className="at-ipa at-glottal-bank-ipa-row at-glottal-bank-ipa-text">
                              <span className="at-ipa-label">After: </span>
                              {renderAmericanTIpaSymbolHighlight(afterDisplay, ['ʔ'])}
                            </p>
                            <button
                              type="button"
                              className="fs-topic-mini-btn at-play-chip-btn at-play-chip-btn--after"
                              aria-label={`Putar after ${word}`}
                              title="Putar After"
                              onClick={() => void playSingleCardTts(word, `word-bank-${word}`, 'after')}
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
              
              <div className="at-sentence-list">
                {GLOTTAL_SENTENCES.map((item, index) => (
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
                        {renderAmericanTIpaSymbolHighlight(formatIpaForDisplay(item.ipa), item.ipaHighlightSymbols ?? ['ʔ'])}
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
              <div className="at-sentence-drill-note" role="note" aria-label="Catatan latihan glottal stop">
                <p>
                  Fokus pada kata yang di-highlight untuk melatih jeda glotis <strong>/ʔ/</strong>.
                  Latih per kalimat dengan <strong>Putar</strong>, lalu gunakan <strong>Play All</strong>
                  untuk ritme beruntun.
                </p>
              </div>
              
              {GLOTTAL_SENTENCE_DRILL_EXAMPLES_15.map((item, index) => (
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
                      {renderAmericanTIpaSymbolHighlight(formatIpaForDisplay(item.ipa), item.ipaHighlightSymbols ?? ['ʔ'])}
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
                  {GLOTTAL_COMMON_MISTAKES.map((item) => (
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
                Glottal Word Bank (44)
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
                <p className="at-prompt-title">Prompt Penilaian Glottal Stop /ʔ/</p>
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
                  &quot;{GLOTTAL_EVALUATION_PROMPT}&quot;
                </p>
              </div>
            </div>
          ),
        },
      ]}
      />
      
      <ControlCenter
        topControls={
          <div className="flex flex-col gap-4">
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
        }
        bottomControls={
          <div className="flex flex-col gap-2">
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
        }
      />
      <RecordingControlsButton
        className="at-recording-anchor"
        downloadFileName="american-t-glottal-middle-GEUWAT-recording.wav"
      />
    </>
  );
}

