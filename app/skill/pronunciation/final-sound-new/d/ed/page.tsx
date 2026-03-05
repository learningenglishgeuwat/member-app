'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import BackButton from '../../../../components/BackButton';
import Sidebar from '../../../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../../../components/buttonSavedProgress';
import '../../final-sound-topic.css';
import './d-ed.css';
import { primeBestEnglishVoice, speakWithBestEnglishVoice } from '../../tts-utils';
import { isSpeechSynthesisSupported, speakText, stopSpeech } from '@/lib/tts/speech';

const RecordingControlsButton = dynamic(
  () => import('../../../../components/RecordingControlsButton'),
  {
    ssr: false,
  },
);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const PAST_ENDING_RULES = [
  {
    ending: '/t/',
    trigger: 'Setelah bunyi voiceless (kecuali /t/).',
    examples: [
      { word: 'worked', ipa: '/w\u025C\u02D0rkt/' },
      { word: 'washed', ipa: '/w\u0252\u0283t/' },
      { word: 'stopped', ipa: '/st\u0252pt/' },
    ],
  },
  {
    ending: '/d/',
    trigger: 'Setelah bunyi voiced (kecuali /d/).',
    examples: [
      { word: 'played', ipa: '/ple\u026Ad/' },
      { word: 'cleaned', ipa: '/kli\u02D0nd/' },
      { word: 'called', ipa: '/k\u0254\u02D0ld/' },
    ],
  },
  {
    ending: '/\u026Ad/',
    trigger: 'Setelah bunyi /t/ atau /d/.',
    examples: [
      { word: 'wanted', ipa: '/\u02C8w\u0252nt\u026Ad/' },
      { word: 'needed', ipa: '/\u02C8ni\u02D0d\u026Ad/' },
      { word: 'decided', ipa: '/d\u026A\u02C8sa\u026Ad\u026Ad/' },
    ],
  },
] as const;

const PAST_ENDING_EXAMPLES_FLAT = PAST_ENDING_RULES.flatMap((rule) =>
  rule.examples.map((example) => ({
    key: `${rule.ending}-${example.word}`,
    word: example.word,
  })),
);

const FINAL_SOUND_ED_TABLE = [
  {
    form: '-d/-ed',
    sound: '/t/',
    useAfter: 'Voiceless sound (kecuali /t/): /p/, /k/, /f/, /s/, /\u0283/, /t\u0283/, /\u03B8/',
    before: 'work (/w\u025C\u02D0rk/), wash (/w\u0252\u0283/), stop (/st\u0252p/)',
    after: 'worked (/w\u025C\u02D0rkt/), washed (/w\u0252\u0283t/), stopped (/st\u0252pt/)',
  },
  {
    form: '-d/-ed',
    sound: '/d/',
    useAfter:
      'Voiced sound (kecuali /d/): /b/, /\u0261/, /v/, /z/, /\u0292/, /d\u0292/, /\u00F0/, /m/, /n/, /\u014B/, /l/, /r/, /w/, /j/; atau setelah bunyi vokal',
    before: 'play (/ple\u026A/), clean (/kli\u02D0n/), call (/k\u0254\u02D0l/)',
    after: 'played (/ple\u026Ad/), cleaned (/kli\u02D0nd/), called (/k\u0254\u02D0ld/)',
  },
  {
    form: '-d/-ed',
    sound: '/\u026Ad/',
    useAfter: 'Setelah bunyi /t/ atau /d/',
    before: 'want (/w\u0252nt/), need (/ni\u02D0d/), decide (/d\u026Asa\u026Ad/)',
    after: 'wanted (/w\u0252nt\u026Ad/), needed (/ni\u02D0d\u026Ad/), decided (/d\u026Asa\u026Ad\u026Ad/)',
  },
] as const;

const D_ED_BEFORE_AFTER_WORD_BANK = [
  { before: 'work', after: 'worked', sound: '/t/' },
  { before: 'wash', after: 'washed', sound: '/t/' },
  { before: 'stop', after: 'stopped', sound: '/t/' },
  { before: 'laugh', after: 'laughed', sound: '/t/' },
  { before: 'miss', after: 'missed', sound: '/t/' },
  { before: 'watch', after: 'watched', sound: '/t/' },
  { before: 'kiss', after: 'kissed', sound: '/t/' },
  { before: 'dance', after: 'danced', sound: '/t/' },
  { before: 'pass', after: 'passed', sound: '/t/' },
  { before: 'talk', after: 'talked', sound: '/t/' },
  { before: 'walk', after: 'walked', sound: '/t/' },
  { before: 'jump', after: 'jumped', sound: '/t/' },
  { before: 'help', after: 'helped', sound: '/t/' },
  { before: 'push', after: 'pushed', sound: '/t/' },
  { before: 'cough', after: 'coughed', sound: '/t/' },

  { before: 'play', after: 'played', sound: '/d/' },
  { before: 'clean', after: 'cleaned', sound: '/d/' },
  { before: 'call', after: 'called', sound: '/d/' },
  { before: 'open', after: 'opened', sound: '/d/' },
  { before: 'answer', after: 'answered', sound: '/d/' },
  { before: 'live', after: 'lived', sound: '/d/' },
  { before: 'rain', after: 'rained', sound: '/d/' },
  { before: 'snow', after: 'snowed', sound: '/d/' },
  { before: 'enjoy', after: 'enjoyed', sound: '/d/' },
  { before: 'plan', after: 'planned', sound: '/d/' },
  { before: 'allow', after: 'allowed', sound: '/d/' },
  { before: 'love', after: 'loved', sound: '/d/' },
  { before: 'move', after: 'moved', sound: '/d/' },
  { before: 'close', after: 'closed', sound: '/d/' },
  { before: 'carry', after: 'carried', sound: '/d/' },

  { before: 'want', after: 'wanted', sound: '/ɪd/' },
  { before: 'need', after: 'needed', sound: '/ɪd/' },
  { before: 'decide', after: 'decided', sound: '/ɪd/' },
  { before: 'visit', after: 'visited', sound: '/ɪd/' },
  { before: 'wait', after: 'waited', sound: '/ɪd/' },
  { before: 'start', after: 'started', sound: '/ɪd/' },
  { before: 'end', after: 'ended', sound: '/ɪd/' },
  { before: 'paint', after: 'painted', sound: '/ɪd/' },
  { before: 'invite', after: 'invited', sound: '/ɪd/' },
  { before: 'collect', after: 'collected', sound: '/ɪd/' },
  { before: 'repeat', after: 'repeated', sound: '/ɪd/' },
  { before: 'count', after: 'counted', sound: '/ɪd/' },
  { before: 'add', after: 'added', sound: '/ɪd/' },
  { before: 'edit', after: 'edited', sound: '/ɪd/' },
  { before: 'guard', after: 'guarded', sound: '/ɪd/' },
] as const;

const COMMON_MISTAKES = [
  'Membaca semua akhiran -ed sebagai /ed/ dalam semua kata.',
  'Menghilangkan bunyi akhir pada past tense saat bicara cepat.',
  'Tidak membedakan /t/ vs /d/ sehingga worked dan played terdengar sama.',
  'Membaca wanted/needed terlalu cepat sehingga bunyi /\u026Ad/ hilang.',
] as const;

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const D_ED_COMMON_MISTAKES_OPEN_KEY = 'final-sound-d-ed-common-mistakes-open-v1';
const D_ED_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kata atau kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi final sound D/ED: /t/, /d/, dan /ɪd/, serta kejelasan bunyi akhir pada bentuk past tense. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata/frasa yang diucapkan (khusus ending -d/-ed). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bunyi akhir mana yang perlu diperbaiki.";

function renderUseAfter(value: string) {
  const parts = value
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) return value;

  return (
    <div className="fs-topic-table-use-after">
      {parts.map((part) => (
        <p key={part}>{part}</p>
      ))}
    </div>
  );
}

type ParsedTableExampleItem = {
  word: string;
  ipa: string | null;
  rawLabel: string;
};

function parseTableExampleItems(value: string): ParsedTableExampleItem[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const word = item.split(' (')[0]?.trim() ?? item;
      const ipaMatch = item.match(/\((\/[^)]+\/)\)/);
      return {
        word,
        ipa: ipaMatch?.[1] ?? null,
        rawLabel: item,
      };
    });
}

function renderTableExamples(
  value: string,
  onSpeak: (word: string) => void,
  options?: { showIpa?: boolean },
) {
  const items = parseTableExampleItems(value);
  const showIpa = options?.showIpa ?? true;

  return (
    <ul className="fs-topic-table-example-list fs-topic-table-example-list--chip">
      {items.map((item) => (
        <li key={item.rawLabel} className="fs-topic-table-example-row fs-topic-table-example-row--chip">
          <span>
            <span className="fs-topic-table-example-word">{item.word}</span>
            {showIpa && item.ipa ? <span className="fs-topic-table-example-ipa"> {item.ipa}</span> : null}
          </span>
          <button
            type="button"
            className="fs-topic-mini-btn fs-topic-play-chip-btn"
            aria-label={`Putar ${item.word}`}
            title="Putar"
            onClick={() => onSpeak(item.word)}
          >
            <span className="fs-topic-play-chip-icon" aria-hidden="true" />
            <span className="fs-topic-visually-hidden">Putar</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function FinalSoundDEdPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const currentProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      return typeof currentProgress.finalSound === 'number' && currentProgress.finalSound > 0;
    } catch {
      return false;
    }
  });
  const [isPlayingWordBankAll, setIsPlayingWordBankAll] = useState(false);
  const [isPlayingPastEndingsAll, setIsPlayingPastEndingsAll] = useState(false);
  const [isPlayingRulesTableAll, setIsPlayingRulesTableAll] = useState(false);
  const [showPastEndingsIpa, setShowPastEndingsIpa] = useState(true);
  const [showWordBankIpa, setShowWordBankIpa] = useState(true);
  const [showRulesTableIpa, setShowRulesTableIpa] = useState(true);
  const [activeWordBankRowKey, setActiveWordBankRowKey] = useState<string | null>(null);
  const [activePastEndingKey, setActivePastEndingKey] = useState<string | null>(null);
  const [activeRulesTableRowKey, setActiveRulesTableRowKey] = useState<string | null>(null);
  const playAllRunIdRef = useRef(0);
  const pastEndingsPlayAllRunIdRef = useRef(0);
  const rulesTablePlayAllRunIdRef = useRef(0);
  const singlePlayRunIdRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const wordBankRowRefs = useRef<Array<HTMLTableRowElement | null>>([]);
  const pastEndingItemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const wordBankSectionRef = useRef<HTMLElement | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [openSections, setOpenSections] = useState(() => {
    const initialState = {
      concept: false,
      wordBank: false,
      pastEndings: false,
      rulesTable: false,
      commonMistakes: false,
      practice: false,
      prompt: false,
    };
    if (typeof window === 'undefined') return initialState;
    try {
      const saved = window.localStorage.getItem(D_ED_COMMON_MISTAKES_OPEN_KEY);
      if (saved === '1' || saved === '0') {
        return { ...initialState, commonMistakes: saved === '1' };
      }
    } catch {
      // ignore corrupted cache and keep default collapsed state
    }
    return initialState;
  });

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
      pronunciationProgress.finalSound = percentage;
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
    delete pronunciationProgress.finalSound;
    window.localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(pronunciationProgress));

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    dashboardProgress.pronunciation = calcPronunciationAverage(pronunciationProgress);
    window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
  }, [calcPronunciationAverage]);

  const toggleSection = (
    section:
      | 'concept'
      | 'wordBank'
      | 'pastEndings'
      | 'rulesTable'
      | 'commonMistakes'
      | 'practice'
      | 'prompt',
  ) => {
    if (
      (section === 'wordBank' && openSections.wordBank) ||
      (section === 'pastEndings' && openSections.pastEndings) ||
      (section === 'rulesTable' && openSections.rulesTable)
    ) {
      stopWordBankPlayAll();
    }
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleScrollToWordBankSection = useCallback(() => {
    setOpenSections((prev) => (prev.wordBank ? prev : { ...prev, wordBank: true }));

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const scrollToTarget = () => {
      const target = wordBankSectionRef.current;
      if (!target) return false;
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
      return true;
    };

    if (scrollToTarget()) return;

    let attempt = 0;
    const timer = window.setInterval(() => {
      attempt += 1;
      if (scrollToTarget() || attempt >= 12) {
        window.clearInterval(timer);
      }
    }, 120);
  }, []);

  const handleCopyPrompt = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(D_ED_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy final sound d/ed prompt:', error);
      setIsPromptCopied(false);
    }
  }, []);

  const stopWordBankPlayAll = useCallback(() => {
    playAllRunIdRef.current += 1;
    pastEndingsPlayAllRunIdRef.current += 1;
    rulesTablePlayAllRunIdRef.current += 1;
    singlePlayRunIdRef.current += 1;
    setIsPlayingWordBankAll(false);
    setIsPlayingPastEndingsAll(false);
    setIsPlayingRulesTableAll(false);
    setActiveWordBankRowKey(null);
    setActivePastEndingKey(null);
    setActiveRulesTableRowKey(null);

    stopSpeech();
  }, []);

  const speakQueuedText = useCallback(
    (text: string, runId: number, runRef: { current: number }) =>
      new Promise<void>((resolve) => {
        if (!isSpeechSynthesisSupported() || !text.trim()) {
          resolve();
          return;
        }

        if (runId !== runRef.current) {
          resolve();
          return;
        }

        void speakText(text, {
          preferredEnglish: 'en-US',
          rate: 0.82,
          pitch: 1,
          volume: 1,
          cancelBeforeSpeak: false,
        }).then(() => resolve());
      }),
    [],
  );

  const playWordBankSingle = useCallback(
    async (text: string, rowKey?: string) => {
      stopWordBankPlayAll();
      const runId = singlePlayRunIdRef.current + 1;
      singlePlayRunIdRef.current = runId;
      if (rowKey) {
        setActiveWordBankRowKey(rowKey);
      }
      await speakQueuedText(text, runId, singlePlayRunIdRef);
      if (singlePlayRunIdRef.current === runId) {
        setActiveWordBankRowKey(null);
      }
    },
    [speakQueuedText, stopWordBankPlayAll],
  );

  const handleWordBankPlayAll = useCallback(async () => {
    if (isPlayingWordBankAll) {
      stopWordBankPlayAll();
      return;
    }

    if (!isSpeechSynthesisSupported()) return;

    const runId = playAllRunIdRef.current + 1;
    playAllRunIdRef.current = runId;
    setIsPlayingWordBankAll(true);
    stopSpeech();

    for (const [rowIndex, item] of D_ED_BEFORE_AFTER_WORD_BANK.entries()) {
      if (runId !== playAllRunIdRef.current) break;
      setActiveWordBankRowKey(`${item.before}-${item.after}`);
      const rowTarget = wordBankRowRefs.current[rowIndex] ?? null;
      rowTarget?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      await sleep(120);
      if (runId !== playAllRunIdRef.current) break;
      await speakQueuedText(item.before, runId, playAllRunIdRef);
      if (runId !== playAllRunIdRef.current) break;
      await sleep(120);
      if (runId !== playAllRunIdRef.current) break;
      await speakQueuedText(item.after, runId, playAllRunIdRef);
      if (runId !== playAllRunIdRef.current) break;
      await sleep(160);
    }

    if (runId === playAllRunIdRef.current) {
      setIsPlayingWordBankAll(false);
      setActiveWordBankRowKey(null);
    }
  }, [isPlayingWordBankAll, speakQueuedText, stopWordBankPlayAll]);

  const playPastEndingSingle = useCallback(
    async (text: string, exampleKey: string) => {
      stopWordBankPlayAll();
      const runId = singlePlayRunIdRef.current + 1;
      singlePlayRunIdRef.current = runId;
      setActivePastEndingKey(exampleKey);
      await speakQueuedText(text, runId, singlePlayRunIdRef);
      if (singlePlayRunIdRef.current === runId) {
        setActivePastEndingKey(null);
      }
    },
    [speakQueuedText, stopWordBankPlayAll],
  );

  const handlePastEndingsPlayAll = useCallback(async () => {
    if (isPlayingPastEndingsAll) {
      stopWordBankPlayAll();
      return;
    }

    if (!isSpeechSynthesisSupported()) return;

    const runId = pastEndingsPlayAllRunIdRef.current + 1;
    pastEndingsPlayAllRunIdRef.current = runId;
    setIsPlayingPastEndingsAll(true);
    stopSpeech();

    for (const [index, item] of PAST_ENDING_EXAMPLES_FLAT.entries()) {
      if (runId !== pastEndingsPlayAllRunIdRef.current) break;
      setActivePastEndingKey(item.key);
      const target = pastEndingItemRefs.current[index] ?? null;
      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      await sleep(120);
      if (runId !== pastEndingsPlayAllRunIdRef.current) break;
      await speakQueuedText(item.word, runId, pastEndingsPlayAllRunIdRef);
      if (runId !== pastEndingsPlayAllRunIdRef.current) break;
      await sleep(140);
    }

    if (runId === pastEndingsPlayAllRunIdRef.current) {
      setIsPlayingPastEndingsAll(false);
      setActivePastEndingKey(null);
    }
  }, [isPlayingPastEndingsAll, speakQueuedText, stopWordBankPlayAll]);

  const handleRulesTablePlayAll = useCallback(async () => {
    if (isPlayingRulesTableAll) {
      stopWordBankPlayAll();
      return;
    }

    if (!isSpeechSynthesisSupported()) return;

    const runId = rulesTablePlayAllRunIdRef.current + 1;
    rulesTablePlayAllRunIdRef.current = runId;
    setIsPlayingRulesTableAll(true);
    stopSpeech();

    for (const row of FINAL_SOUND_ED_TABLE) {
      if (runId !== rulesTablePlayAllRunIdRef.current) break;
      const rowKey = `${row.form}-${row.sound}`;
      setActiveRulesTableRowKey(rowKey);
      const target = document.querySelector<HTMLTableRowElement>(
        `[data-rules-table-row-key="${rowKey}"]`,
      );
      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      await sleep(120);
      if (runId !== rulesTablePlayAllRunIdRef.current) break;

      const beforeItems = parseTableExampleItems(row.before);
      const afterItems = parseTableExampleItems(row.after);
      const pairCount = Math.max(beforeItems.length, afterItems.length);
      for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
        if (runId !== rulesTablePlayAllRunIdRef.current) break;
        const beforeItem = beforeItems[pairIndex];
        if (beforeItem) {
          await speakQueuedText(beforeItem.word, runId, rulesTablePlayAllRunIdRef);
          if (runId !== rulesTablePlayAllRunIdRef.current) break;
          await sleep(120);
        }

        const afterItem = afterItems[pairIndex];
        if (!afterItem) continue;
        await speakQueuedText(afterItem.word, runId, rulesTablePlayAllRunIdRef);
        if (runId !== rulesTablePlayAllRunIdRef.current) break;
        await sleep(120);
      }
    }

    if (runId === rulesTablePlayAllRunIdRef.current) {
      setIsPlayingRulesTableAll(false);
      setActiveRulesTableRowKey(null);
    }
  }, [isPlayingRulesTableAll, speakQueuedText, stopWordBankPlayAll]);

  useEffect(() => {
    void primeBestEnglishVoice();
  }, []);

  useEffect(
    () => () => {
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        D_ED_COMMON_MISTAKES_OPEN_KEY,
        openSections.commonMistakes ? '1' : '0',
      );
    } catch {
      // ignore storage write failures
    }
  }, [openSections.commonMistakes]);

  useEffect(() => () => stopWordBankPlayAll(), [stopWordBankPlayAll]);

  return (
    <div className="pronunciation-layout fs-topic-page d-ed-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation/final-sound-new" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="fs-topic-shell">
        <header className="fs-topic-header">
          <h1 className="fs-topic-title">D/ED Final Sound</h1>
          <p className="fs-topic-subtitle">
            Fokus pada aturan pengucapan akhiran -ed pada regular verbs di bentuk past tense.
          </p>
          <div className="d-ed-progress-actions">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="primary"
              topicName="Final Sound D/ED"
            />
          </div>
        </header>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('concept')}
              aria-expanded={openSections.concept}
            >
              <span>Concept</span>
              <span className={`fs-topic-section-icon ${openSections.concept ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.concept ? (
            <p className="fs-topic-text">
              Bunyi akhir pada akhiran <strong>-ed</strong> bergantung pada bunyi terakhir kata
              dasar, bukan dibaca sama untuk semua kata.
            </p>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('pastEndings')}
              aria-expanded={openSections.pastEndings}
            >
              <span>Past Endings (-ed)</span>
              <span className={`fs-topic-section-icon ${openSections.pastEndings ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.pastEndings ? (
            <div>
              <div className="d-ed-word-bank-controls d-ed-word-bank-controls--split">
                <button
                  type="button"
                  className="d-ed-word-bank-play-all-btn"
                  onClick={() => setShowPastEndingsIpa((prev) => !prev)}
                >
                  {showPastEndingsIpa ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="d-ed-word-bank-play-all-btn"
                  onClick={() => void handlePastEndingsPlayAll()}
                  aria-label={isPlayingPastEndingsAll ? 'Stop play all past endings' : 'Play all past endings'}
                >
                  {isPlayingPastEndingsAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              <div className="fs-topic-grid">
              {PAST_ENDING_RULES.map((rule) => (
                <article key={rule.ending} className="fs-topic-card">
                  <h3 className="fs-topic-card-title">Dibaca {rule.ending}</h3>
                  <p className="fs-topic-card-note">{rule.trigger}</p>
                  <ul className="fs-topic-example-list">
                    {rule.examples.map((example) => (
                      <li
                        key={example.word}
                        className={activePastEndingKey === `${rule.ending}-${example.word}` ? 'is-speaking' : ''}
                        ref={(node) => {
                          const flatIndex = PAST_ENDING_EXAMPLES_FLAT.findIndex(
                            (item) => item.key === `${rule.ending}-${example.word}`,
                          );
                          if (flatIndex >= 0) {
                            pastEndingItemRefs.current[flatIndex] = node;
                          }
                        }}
                      >
                        <div className="fs-topic-table-example-row">
                          <span>
                            {example.word}
                            {showPastEndingsIpa ? ` ${example.ipa}` : ''}
                          </span>
                          <button
                            type="button"
                            className="fs-topic-mini-btn fs-topic-play-chip-btn"
                            aria-label={`Putar ${example.word}`}
                            title="Putar"
                            onClick={() => void playPastEndingSingle(example.word, `${rule.ending}-${example.word}`)}
                          >
                            <span className="fs-topic-play-chip-icon" aria-hidden="true" />
                            <span className="fs-topic-visually-hidden">Putar</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('rulesTable')}
              aria-expanded={openSections.rulesTable}
            >
              <span>Final Sound Rules for -ed (Table)</span>
              <span className={`fs-topic-section-icon ${openSections.rulesTable ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.rulesTable ? (
            <div>
              <div className="d-ed-word-bank-controls d-ed-word-bank-controls--split">
                <button
                  type="button"
                  className="d-ed-word-bank-play-all-btn"
                  onClick={() => setShowRulesTableIpa((prev) => !prev)}
                >
                  {showRulesTableIpa ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="d-ed-word-bank-play-all-btn"
                  onClick={() => void handleRulesTablePlayAll()}
                  aria-label={isPlayingRulesTableAll ? 'Stop play all final sound rules table' : 'Play all final sound rules table'}
                >
                  {isPlayingRulesTableAll ? 'Stop' : 'Play All'}
                </button>
              </div>
              <div className="fs-topic-rules-table-wrap geuwat-table-scroll">
                <table className="fs-topic-rules-table geuwat-table-responsive">
                  <thead>
                    <tr>
                      <th>Form</th>
                      <th>Sound</th>
                      <th>Use After</th>
                      <th>Before (IPA)</th>
                      <th>After (IPA)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINAL_SOUND_ED_TABLE.map((row) => (
                      <tr
                        key={`${row.form}-${row.sound}`}
                        data-rules-table-row-key={`${row.form}-${row.sound}`}
                        className={activeRulesTableRowKey === `${row.form}-${row.sound}` ? 'is-speaking' : ''}
                      >
                        <td>{row.form}</td>
                        <td>{row.sound}</td>
                        <td>{renderUseAfter(row.useAfter)}</td>
                        <td>
                          {renderTableExamples(row.before, (word) => void speakWithBestEnglishVoice(word), {
                            showIpa: showRulesTableIpa,
                          })}
                        </td>
                        <td>
                          {renderTableExamples(row.after, (word) => void speakWithBestEnglishVoice(word), {
                            showIpa: showRulesTableIpa,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <section className="fs-topic-block" ref={wordBankSectionRef}>
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('wordBank')}
              aria-expanded={openSections.wordBank}
            >
              <span>Before &amp; After Word Bank (45)</span>
              <span className={`fs-topic-section-icon ${openSections.wordBank ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.wordBank ? (
            <div>
              <div className="d-ed-word-bank-controls d-ed-word-bank-controls--split">
                <button
                  type="button"
                  className="d-ed-word-bank-play-all-btn"
                  onClick={() => setShowWordBankIpa((prev) => !prev)}
                >
                  {showWordBankIpa ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
                </button>
                <button
                  type="button"
                  className="d-ed-word-bank-play-all-btn"
                  onClick={() => void handleWordBankPlayAll()}
                  aria-label={
                    isPlayingWordBankAll
                      ? 'Stop play all before and after words'
                      : 'Play all before and after words'
                  }
                >
                  {isPlayingWordBankAll ? 'Stop' : 'Play All'}
                </button>
              </div>

              <div className="fs-topic-rules-table-wrap geuwat-table-scroll">
                <table className="fs-topic-rules-table fs-topic-before-after-table geuwat-table-responsive">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Before</th>
                      <th>After</th>
                      {showWordBankIpa ? <th>IPA</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {D_ED_BEFORE_AFTER_WORD_BANK.map((item, index) => (
                      <tr
                        key={`${item.before}-${item.after}`}
                        className={activeWordBankRowKey === `${item.before}-${item.after}` ? 'is-speaking' : ''}
                        ref={(node) => {
                          wordBankRowRefs.current[index] = node;
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <div className="fs-topic-table-example-row">
                            <span>
                              <span className="fs-topic-table-example-word">{item.before}</span>
                              {showWordBankIpa ? (
                                <span className="fs-topic-table-example-ipa"> {item.sound}</span>
                              ) : null}
                            </span>
                            <button
                              type="button"
                              className="fs-topic-mini-btn fs-topic-play-chip-btn"
                              aria-label={`Putar ${item.before}`}
                              title="Putar"
                              onClick={() => void playWordBankSingle(item.before, `${item.before}-${item.after}`)}
                            >
                              <span className="fs-topic-play-chip-icon" aria-hidden="true" />
                              <span className="fs-topic-visually-hidden">Putar</span>
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="fs-topic-table-example-row">
                            <span>
                              <span className="fs-topic-table-example-word">{item.after}</span>
                              {showWordBankIpa ? (
                                <span className="fs-topic-table-example-ipa"> {item.sound}</span>
                              ) : null}
                            </span>
                            <button
                              type="button"
                              className="fs-topic-mini-btn fs-topic-play-chip-btn"
                              aria-label={`Putar ${item.after}`}
                              title="Putar"
                              onClick={() => void playWordBankSingle(item.after, `${item.before}-${item.after}`)}
                            >
                              <span className="fs-topic-play-chip-icon" aria-hidden="true" />
                              <span className="fs-topic-visually-hidden">Putar</span>
                            </button>
                          </div>
                        </td>
                        {showWordBankIpa ? (
                          <td>
                            <span className="fs-topic-table-example-ipa">{item.sound}</span>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('commonMistakes')}
              aria-expanded={openSections.commonMistakes}
            >
              <span>Common Mistakes</span>
              <span className={`fs-topic-section-icon ${openSections.commonMistakes ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.commonMistakes ? (
            <article className="fs-topic-card d-ed-common-mistakes-card">
              <ul className="d-ed-common-mistakes-list">
                {COMMON_MISTAKES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('practice')}
              aria-expanded={openSections.practice}
            >
              <span>Practice</span>
              <span className={`fs-topic-section-icon ${openSections.practice ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.practice ? (
            <p className="fs-topic-text d-ed-practice-mission">
              <strong>Mission:</strong> Bacakan contoh di section{' '}
              <button
                type="button"
                className="d-ed-inline-jump-btn"
                onClick={handleScrollToWordBankSection}
              >
                Before &amp; After Word Bank (45)
              </button>
              .
            </p>
          ) : null}
        </section>

        <section className="fs-topic-block">
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('prompt')}
              aria-expanded={openSections.prompt}
            >
              <span>Prompt</span>
              <span className={`fs-topic-section-icon ${openSections.prompt ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.prompt ? (
            <div className="d-ed-prompt-card">
              <div className="d-ed-prompt-header">
                <p className="d-ed-prompt-title">Prompt Penilaian Final Sound D/ED</p>
                <button
                  type="button"
                  onClick={() => void handleCopyPrompt()}
                  className="d-ed-prompt-copy-btn"
                  aria-label="Salin prompt"
                  title="Salin prompt"
                >
                  <Copy size={13} />
                  <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
                </button>
              </div>
              <p className="d-ed-prompt-quote">
                &quot;{D_ED_EVALUATION_PROMPT}&quot;
              </p>
            </div>
          ) : null}
        </section>
      </main>

      <RecordingControlsButton
        className="d-ed-recording-anchor"
        downloadFileName="final-sound-d-ed-GEUWAT-recording.wav"
      />
    </div>
  );
}
