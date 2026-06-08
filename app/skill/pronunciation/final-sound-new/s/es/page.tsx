'use client';

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy, Play } from 'lucide-react';
import {
  ControlCenter,
  HighlightVisibilityToggle,
  IpaVisibilityToggle,
  PlayStopButton,
} from '@/app/components';
import BackButton from '../../../../components/BackButton';
import Sidebar from '../../../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../../../components/buttonSavedProgress';
import '../../final-sound-topic.css';
import './s-es.css';
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

type ParsedTableExampleItem = {
  word: string;
  ipa: string | null;
  rawLabel: string;
};

type HighlightMode = 'base' | 'withEnding';

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

const S_ES_USAGE_RULES = [
  {
    ending: '/s/',
    trigger: 'Setelah bunyi voiceless non-sibilant (contoh: /p/, /k/, /t/, /f/).',
    examples: [
      { label: 'Plural', wordBefore: 'cat', ipaBefore: '/kæt/', word: 'cats', ipa: '/kæts/' },
      { label: 'Third-person singular', wordBefore: 'work', ipaBefore: '/wɚːrk/', word: 'works', ipa: '/wɚːrks/' },
      { label: 'Possessive', wordBefore: 'Kate', ipaBefore: '/keɪt/', word: "Kate's", ipa: '/keɪts/' },
    ],
  },
  {
    ending: '/z/',
    trigger: 'Setelah bunyi voiced non-sibilant dan vokal.',
    examples: [
      { label: 'Plural', wordBefore: 'dog', ipaBefore: '/dɔɡ/', word: 'dogs', ipa: '/dɔɡz/' },
      { label: 'Third-person singular', wordBefore: 'run', ipaBefore: '/rʌn/', word: 'runs', ipa: '/rʌnz/' },
      { label: 'Possessive', wordBefore: 'Bob', ipaBefore: '/bɑb/', word: "Bob's", ipa: '/bɑbz/' },
    ],
  },
  {
    ending: '/ɪz/',
    trigger: 'Setelah sibilant: /s/, /z/, /ʃ/, /ʒ/, /tʃ/, /dʒ/.',
    examples: [
      { label: 'Plural', wordBefore: 'bus', ipaBefore: '/bʌs/', word: 'buses', ipa: '/ˈbʌsɪz/' },
      { label: 'Third-person singular', wordBefore: 'wash', ipaBefore: '/wɑʃ/', word: 'washes', ipa: '/ˈwɑʃɪz/' },
      { label: 'Possessive', wordBefore: 'Rose', ipaBefore: '/roʊz/', word: "Rose's", ipa: '/ˈroʊzɪz/' },
    ],
  },
] as const;

const S_ES_PLURAL_RULE_EXAMPLES = S_ES_USAGE_RULES.flatMap((rule) =>
  rule.examples.map((example) => ({
    key: `${rule.ending}-${example.label}`,
    wordBefore: example.wordBefore,
    word: example.word,
  })),
);

const FINAL_SOUND_S_ES_TABLE = [
  {
    form: '-s',
    sound: '/s/',
    useAfter: 'Voiceless non-sibilant: /p/, /t/, /k/, /f/, /\u03B8/',
    before: 'cat (/k\u00E6t/), book (/b\u028Ak/), cup (/k\u028Cp/)',
    after: 'cats (/k\u00E6ts/), books (/b\u028Aks/), cups (/k\u028Cps/)',
  },
  {
    form: '-s',
    sound: '/z/',
    useAfter:
      'Voiced non-sibilant: /b/, /d/, /\u0261/, /v/, /\u00F0/, /m/, /n/, /\u014B/, /l/, /r/, /w/, /j/; atau setelah vokal',
    before: 'dog (/d\u0254\u0261/), bag (/b\u00E6\u0261/), key (/ki\u02D0/)',
    after: 'dogs (/d\u0254\u0261z/), bags (/b\u00E6\u0261z/), keys (/ki\u02D0z/)',
  },
  {
    form: '-es',
    sound: '/\u026Az/',
    useAfter: 'Sibilant: /s/, /z/, /\u0283/, /\u0292/, /t\u0283/, /d\u0292/',
    before: 'bus (/b\u028Cs/), watch (/w\u0252t\u0283/), bridge (/br\u026Ad\u0292/)',
    after:
      'buses (/b\u028Cs\u026Az/), watches (/w\u0252t\u0283\u026Az/), bridges (/br\u026Ad\u0292\u026Az/)',
  },
] as const;

const S_ES_BEFORE_AFTER_WORD_BANK = [
  { before: 'cat', after: 'cats', sound: '/s/' },
  { before: 'book', after: 'books', sound: '/s/' },
  { before: 'cup', after: 'cups', sound: '/s/' },
  { before: 'map', after: 'maps', sound: '/s/' },
  { before: 'hat', after: 'hats', sound: '/s/' },
  { before: 'cliff', after: 'cliffs', sound: '/s/' },
  { before: 'park', after: 'parks', sound: '/s/' },
  { before: 'ship', after: 'ships', sound: '/s/' },
  { before: 'week', after: 'weeks', sound: '/s/' },
  { before: 'laugh', after: 'laughs', sound: '/s/' },
  { before: 'desk', after: 'desks', sound: '/s/' },
  { before: 'roof', after: 'roofs', sound: '/s/' },
  { before: 'chef', after: 'chefs', sound: '/s/' },
  { before: 'clock', after: 'clocks', sound: '/s/' },
  { before: 'lamp', after: 'lamps', sound: '/s/' },

  { before: 'dog', after: 'dogs', sound: '/z/' },
  { before: 'bag', after: 'bags', sound: '/z/' },
  { before: 'key', after: 'keys', sound: '/z/' },
  { before: 'boy', after: 'boys', sound: '/z/' },
  { before: 'day', after: 'days', sound: '/z/' },
  { before: 'pen', after: 'pens', sound: '/z/' },
  { before: 'room', after: 'rooms', sound: '/z/' },
  { before: 'car', after: 'cars', sound: '/z/' },
  { before: 'phone', after: 'phones', sound: '/z/' },
  { before: 'game', after: 'games', sound: '/z/' },
  { before: 'girl', after: 'girls', sound: '/z/' },
  { before: 'table', after: 'tables', sound: '/z/' },
  { before: 'glove', after: 'gloves', sound: '/z/' },
  { before: 'door', after: 'doors', sound: '/z/' },
  { before: 'tree', after: 'trees', sound: '/z/' },

  { before: 'bus', after: 'buses', sound: '/\u026Az/' },
  { before: 'class', after: 'classes', sound: '/\u026Az/' },
  { before: 'watch', after: 'watches', sound: '/\u026Az/' },
  { before: 'dish', after: 'dishes', sound: '/\u026Az/' },
  { before: 'judge', after: 'judges', sound: '/\u026Az/' },
  { before: 'quiz', after: 'quizzes', sound: '/\u026Az/' },
  { before: 'box', after: 'boxes', sound: '/\u026Az/' },
  { before: 'bridge', after: 'bridges', sound: '/\u026Az/' },
  { before: 'rose', after: 'roses', sound: '/\u026Az/' },
  { before: 'face', after: 'faces', sound: '/\u026Az/' },
  { before: 'buzz', after: 'buzzes', sound: '/\u026Az/' },
  { before: 'wish', after: 'wishes', sound: '/\u026Az/' },
  { before: 'badge', after: 'badges', sound: '/\u026Az/' },
  { before: 'church', after: 'churches', sound: '/\u026Az/' },
  { before: 'garage', after: 'garages', sound: '/\u026Az/' },
] as const;

const S_ES_WORD_BANK_IPA: Record<string, { before: string; after: string }> = {
  'cat|cats': { before: '/k\u00E6t/', after: '/k\u00E6ts/' },
  'book|books': { before: '/b\u028Ak/', after: '/b\u028Aks/' },
  'cup|cups': { before: '/k\u028Cp/', after: '/k\u028Cps/' },
  'map|maps': { before: '/m\u00E6p/', after: '/m\u00E6ps/' },
  'hat|hats': { before: '/h\u00E6t/', after: '/h\u00E6ts/' },
  'cliff|cliffs': { before: '/kl\u026Af/', after: '/kl\u026Afs/' },
  'park|parks': { before: '/p\u0251rk/', after: '/p\u0251rks/' },
  'ship|ships': { before: '/\u0283\u026Ap/', after: '/\u0283\u026Aps/' },
  'week|weeks': { before: '/wi\u02D0k/', after: '/wi\u02D0ks/' },
  'laugh|laughs': { before: '/l\u00E6f/', after: '/l\u00E6fs/' },
  'desk|desks': { before: '/d\u025Bsk/', after: '/d\u025Bsks/' },
  'roof|roofs': { before: '/ru\u02D0f/', after: '/ru\u02D0fs/' },
  'chef|chefs': { before: '/\u0283\u025Bf/', after: '/\u0283\u025Bfs/' },
  'clock|clocks': { before: '/kl\u0251k/', after: '/kl\u0251ks/' },
  'lamp|lamps': { before: '/l\u00E6mp/', after: '/l\u00E6mps/' },
  'dog|dogs': { before: '/d\u0254\u0261/', after: '/d\u0254\u0261z/' },
  'bag|bags': { before: '/b\u00E6\u0261/', after: '/b\u00E6\u0261z/' },
  'key|keys': { before: '/ki\u02D0/', after: '/ki\u02D0z/' },
  'boy|boys': { before: '/b\u0254\u026A/', after: '/b\u0254\u026Az/' },
  'day|days': { before: '/de\u026A/', after: '/de\u026Az/' },
  'pen|pens': { before: '/p\u025Bn/', after: '/p\u025Bnz/' },
  'room|rooms': { before: '/ru\u02D0m/', after: '/ru\u02D0mz/' },
  'car|cars': { before: '/k\u0251r/', after: '/k\u0251rz/' },
  'phone|phones': { before: '/fo\u028An/', after: '/fo\u028Anz/' },
  'game|games': { before: '/\u0261e\u026Am/', after: '/\u0261e\u026Amz/' },
  'girl|girls': { before: '/\u0261\u025Drl/', after: '/\u0261\u025Drlz/' },
  'table|tables': { before: '/\u02C8te\u026Ab\u0259l/', after: '/\u02C8te\u026Ab\u0259lz/' },
  'glove|gloves': { before: '/\u0261l\u028Cv/', after: '/\u0261l\u028Cvz/' },
  'door|doors': { before: '/d\u0254r/', after: '/d\u0254rz/' },
  'tree|trees': { before: '/tri\u02D0/', after: '/tri\u02D0z/' },
  'bus|buses': { before: '/b\u028Cs/', after: '/\u02C8b\u028Cs\u026Az/' },
  'class|classes': { before: '/kl\u00E6s/', after: '/\u02C8kl\u00E6s\u026Az/' },
  'watch|watches': { before: '/w\u0251t\u0283/', after: '/\u02C8w\u0251t\u0283\u026Az/' },
  'dish|dishes': { before: '/d\u026A\u0283/', after: '/\u02C8d\u026A\u0283\u026Az/' },
  'judge|judges': { before: '/d\u0292\u028Cd\u0292/', after: '/\u02C8d\u0292\u028Cd\u0292\u026Az/' },
  'quiz|quizzes': { before: '/kw\u026Az/', after: '/\u02C8kw\u026Az\u026Az/' },
  'box|boxes': { before: '/b\u0251ks/', after: '/\u02C8b\u0251ks\u026Az/' },
  'bridge|bridges': { before: '/br\u026Ad\u0292/', after: '/\u02C8br\u026Ad\u0292\u026Az/' },
  'rose|roses': { before: '/ro\u028Az/', after: '/\u02C8ro\u028Az\u026Az/' },
  'face|faces': { before: '/fe\u026As/', after: '/\u02C8fe\u026As\u026Az/' },
  'buzz|buzzes': { before: '/b\u028Cz/', after: '/\u02C8b\u028Cz\u026Az/' },
  'wish|wishes': { before: '/w\u026A\u0283/', after: '/\u02C8w\u026A\u0283\u026Az/' },
  'badge|badges': { before: '/b\u00E6d\u0292/', after: '/\u02C8b\u00E6d\u0292\u026Az/' },
  'church|churches': { before: '/t\u0283\u025Drt\u0283/', after: '/\u02C8t\u0283\u025Drt\u0283\u026Az/' },
  'garage|garages': { before: '/\u0261\u0259\u02C8r\u0251\u0292/', after: '/\u0261\u0259\u02C8r\u0251\u0292\u026Az/' },
};

const COMMON_MISTAKES = [
  'Membaca semua akhiran -s sebagai /s/ tanpa melihat bunyi sebelumnya.',
  'Mengabaikan bunyi /\u026Az/ pada kata sibilant seperti buses, watches, bridges.',
  'Tidak membedakan plural noun dan third-person singular verb (contoh: dogs vs runs).',
  'Hanya melihat huruf akhir, bukan bunyi akhir kata dasar.',
] as const;

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const FINAL_SOUND_S_ES_PROGRESS_ID = 'finalSoundSEs';
const S_ES_COMMON_MISTAKES_OPEN_KEY = 'final-sound-s-es-common-mistakes-open-v1';
const S_ES_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kata atau kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama akurasi final sound S/ES: /s/, /z/, dan /ɪz/, serta kejelasan transisi bunyi akhir kata. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata/frasa yang diucapkan (khusus ending -s/-es). - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bunyi akhir mana yang perlu diperbaiki.";

const S_ES_BASE_LETTER_PATTERNS = ['tch', 'dge', 'ng', 'sh', 'ch', 'ss', 'ce', 'ge', 'x'];
const S_ES_BASE_IPA_SYMBOLS = [
  't\u0283',
  'd\u0292',
  '\u0283',
  '\u0292',
  '\u03b8',
  '\u00f0',
  '\u014b',
  '\u0261',
  'g',
  'p',
  'b',
  't',
  'd',
  'k',
  'f',
  'v',
  's',
  'z',
  'm',
  'n',
  'l',
  'r',
  'w',
  'j',
  'i\u02d0',
  'u\u02d0',
  '\u0254\u026a',
  'a\u026a',
  'e\u026a',
  'o\u028a',
  'a\u028a',
  '\u00e6',
  '\u0251',
  '\u0254',
  '\u028c',
  '\u025b',
  '\u026a',
  '\u028a',
  '\u0259',
  'i',
  'u',
].sort((a, b) => b.length - a.length);

function getSEsEndingLength(word: string): number {
  const lower = word.toLowerCase();
  if (lower.endsWith("'s")) return 2;
  if (!lower.endsWith('s')) return 0;

  if (lower.endsWith('es')) {
    const base = lower.slice(0, -2);
    if (/(s|z|x|ch|sh)$/.test(base)) return 2;
  }

  return 1;
}

function getBaseFinalLetterRange(base: string) {
  if (!base) return { start: 0, end: 0 };

  const lower = base.toLowerCase();
  const matchedPattern = S_ES_BASE_LETTER_PATTERNS.find((pattern) => lower.endsWith(pattern));

  if (matchedPattern) {
    return { start: base.length - matchedPattern.length, end: base.length };
  }

  if (lower.endsWith('e') && base.length > 1 && !lower.endsWith('ee')) {
    return { start: base.length - 2, end: base.length - 1 };
  }

  return { start: base.length - 1, end: base.length };
}

function renderSEsWordHighlight(word: string, mode: HighlightMode, keyPrefix: string): ReactNode {
  const endingLength = mode === 'withEnding' ? getSEsEndingLength(word) : 0;
  const splitIndex = Math.max(0, word.length - endingLength);
  const base = word.slice(0, splitIndex);
  const ending = word.slice(splitIndex);
  const baseFinalRange = getBaseFinalLetterRange(base);

  return (
    <>
      {base.slice(0, baseFinalRange.start)}
      {baseFinalRange.end > baseFinalRange.start ? (
        <span className="s-es-hl-base-final" key={`${keyPrefix}-base-final`}>
          {base.slice(baseFinalRange.start, baseFinalRange.end)}
        </span>
      ) : null}
      {base.slice(baseFinalRange.end)}
      {ending ? (
        <span className="s-es-hl-target" key={`${keyPrefix}-target`}>
          {ending}
        </span>
      ) : null}
    </>
  );
}

function splitIpaToken(value: string) {
  const match = value.match(/^([\/()[\]{}.,;:!?'"`]*)(.*?)([\/()[\]{}.,;:!?'"`]*)$/);

  return {
    leading: match?.[1] ?? '',
    core: match?.[2] ?? value,
    trailing: match?.[3] ?? '',
  };
}

function getSEsIpaEndingLength(core: string): number {
  const normalized = core.toLowerCase();
  if (normalized.endsWith('\u026az') || normalized.endsWith('iz')) return 2;
  if (normalized.endsWith('s') || normalized.endsWith('z')) return 1;
  return 0;
}

function getBaseFinalIpaSymbol(baseCore: string): string {
  const normalized = baseCore.replace(/[ˈˌ]/g, '').toLowerCase();
  return S_ES_BASE_IPA_SYMBOLS.find((symbol) => normalized.endsWith(symbol)) ?? '';
}

function getBaseFinalIpaIndex(baseCore: string, baseFinal: string): number {
  if (!baseFinal) return baseCore.length;

  const normalizedTarget = baseFinal.toLowerCase();
  for (let index = baseCore.length - 1; index >= 0; index -= 1) {
    const normalizedSlice = baseCore.slice(index).replace(/[ˈˌ]/g, '').toLowerCase();
    if (normalizedSlice === normalizedTarget) return index;
  }

  return Math.max(0, baseCore.length - baseFinal.length);
}

function renderSEsIpaHighlight(ipa: string, mode: HighlightMode, keyPrefix: string): ReactNode {
  const { leading, core, trailing } = splitIpaToken(ipa);
  const endingLength = mode === 'withEnding' ? getSEsIpaEndingLength(core) : 0;
  const splitIndex = Math.max(0, core.length - endingLength);
  const baseCore = core.slice(0, splitIndex);
  const ending = core.slice(splitIndex);
  const baseFinal = getBaseFinalIpaSymbol(baseCore);
  const baseFinalIndex = getBaseFinalIpaIndex(baseCore, baseFinal);

  return (
    <>
      {leading}
      {baseCore.slice(0, baseFinalIndex)}
      {baseFinal ? (
        <span className="s-es-hl-base-final" key={`${keyPrefix}-ipa-base-final`}>
          {baseCore.slice(baseFinalIndex)}
        </span>
      ) : null}
      {ending ? (
        <span className="s-es-hl-target" key={`${keyPrefix}-ipa-target`}>
          {ending}
        </span>
      ) : null}
      {trailing}
    </>
  );
}

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

function renderTableExamples(
  value: string,
  onSpeak: (word: string) => void,
  options?: { showIpa?: boolean; highlightMode?: HighlightMode },
) {
  const items = parseTableExampleItems(value);
  const showIpa = options?.showIpa ?? true;
  const highlightMode = options?.highlightMode ?? 'base';

  return (
    <ul className="fs-topic-table-example-list fs-topic-table-example-list--chip">
      {items.map((item) => (
        <li key={item.rawLabel} className="fs-topic-table-example-row fs-topic-table-example-row--chip">
          <span>
            <span className="fs-topic-table-example-word">
              {renderSEsWordHighlight(item.word, highlightMode, `table-${item.rawLabel}-word`)}
            </span>
            {showIpa && item.ipa ? (
              <span className="fs-topic-table-example-ipa">
                {' '}
                {renderSEsIpaHighlight(item.ipa, highlightMode, `table-${item.rawLabel}-ipa`)}
              </span>
            ) : null}
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

export default function FinalSoundSEsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const currentProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      const savedAssessments = JSON.parse(
        window.localStorage.getItem('savedAssessments') || '{}',
      ) as Record<string, { percentage?: unknown }>;
      const assessmentKey = 'Final Sound S/ES'.toLowerCase().replace(/\s+/g, '_');
      const savedAssessmentPercent = savedAssessments[assessmentKey]?.percentage;
      const hasSavedAssessment =
        typeof savedAssessmentPercent === 'number' &&
        Number.isFinite(savedAssessmentPercent) &&
        savedAssessmentPercent > 0;

      return (
        (typeof currentProgress[FINAL_SOUND_S_ES_PROGRESS_ID] === 'number' &&
          currentProgress[FINAL_SOUND_S_ES_PROGRESS_ID] > 0) ||
        hasSavedAssessment
      );
    } catch {
      return false;
    }
  });
  const [isPlayingWordBankAll, setIsPlayingWordBankAll] = useState(false);
  const [isPlayingPluralAll, setIsPlayingPluralAll] = useState(false);
  const [isPlayingRulesTableAll, setIsPlayingRulesTableAll] = useState(false);
  const [showIpa, setShowIpa] = useState(true);
  const [showOrangeHighlight, setShowOrangeHighlight] = useState(true);
  const [showMagentaHighlight, setShowMagentaHighlight] = useState(true);
  const [activeWordBankRowKey, setActiveWordBankRowKey] = useState<string | null>(null);
  const [activePluralExampleKey, setActivePluralExampleKey] = useState<string | null>(null);
  const [activeRulesTableRowKey, setActiveRulesTableRowKey] = useState<string | null>(null);
  const playAllRunIdRef = useRef(0);
  const pluralPlayAllRunIdRef = useRef(0);
  const rulesTablePlayAllRunIdRef = useRef(0);
  const singlePlayRunIdRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const wordBankRowRefs = useRef<Array<HTMLTableRowElement | null>>([]);
  const pluralExampleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wordBankSectionRef = useRef<HTMLElement | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [openSections, setOpenSections] = useState(() => {
    const initialState = {
      concept: false,
      pluralEndings: false,
      rulesTable: false,
      wordBank: false,
      commonMistakes: false,
      practice: false,
      prompt: false,
    };
    if (typeof window === 'undefined') return initialState;
    try {
      const saved = window.localStorage.getItem(S_ES_COMMON_MISTAKES_OPEN_KEY);
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
      delete pronunciationProgress.finalSound;
      pronunciationProgress[FINAL_SOUND_S_ES_PROGRESS_ID] = percentage;
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
    delete pronunciationProgress[FINAL_SOUND_S_ES_PROGRESS_ID];
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
      | 'pluralEndings'
      | 'rulesTable'
      | 'wordBank'
      | 'commonMistakes'
      | 'practice'
      | 'prompt',
  ) => {
    if (
      (section === 'wordBank' && openSections.wordBank) ||
      (section === 'pluralEndings' && openSections.pluralEndings) ||
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
      await navigator.clipboard.writeText(S_ES_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy final sound s/es prompt:', error);
      setIsPromptCopied(false);
    }
  }, []);

  const stopWordBankPlayAll = useCallback(() => {
    playAllRunIdRef.current += 1;
    pluralPlayAllRunIdRef.current += 1;
    rulesTablePlayAllRunIdRef.current += 1;
    singlePlayRunIdRef.current += 1;
    setIsPlayingWordBankAll(false);
    setIsPlayingPluralAll(false);
    setIsPlayingRulesTableAll(false);
    setActiveWordBankRowKey(null);
    setActivePluralExampleKey(null);
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

  const toWordBankTtsText = useCallback((text: string) => {
    const normalized = text.trim().toLowerCase();
    if (normalized === 'live') return 'to live';
    return text;
  }, []);

  const playWordBankSingle = useCallback(
    async (text: string, rowKey?: string) => {
      stopWordBankPlayAll();
      const runId = singlePlayRunIdRef.current + 1;
      singlePlayRunIdRef.current = runId;
      if (rowKey) {
        setActiveWordBankRowKey(rowKey);
      }
      await speakQueuedText(toWordBankTtsText(text), runId, singlePlayRunIdRef);
      if (singlePlayRunIdRef.current === runId) {
        setActiveWordBankRowKey(null);
      }
    },
    [speakQueuedText, stopWordBankPlayAll, toWordBankTtsText],
  );

  const handleWordBankPlayAll = useCallback(async () => {
    if (isPlayingWordBankAll) {
      stopWordBankPlayAll();
      return;
    }

    if (!isSpeechSynthesisSupported()) return;

    // Open section first if it's collapsed
    setOpenSections((prev) => {
      if (!prev.wordBank) {
        return { ...prev, wordBank: true };
      }
      return prev;
    });
    // Wait for DOM to update before starting playback
    await sleep(80);

    const runId = playAllRunIdRef.current + 1;
    playAllRunIdRef.current = runId;
    setIsPlayingWordBankAll(true);
    stopSpeech();

    for (const [rowIndex, item] of S_ES_BEFORE_AFTER_WORD_BANK.entries()) {
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
      await speakQueuedText(toWordBankTtsText(item.before), runId, playAllRunIdRef);
      if (runId !== playAllRunIdRef.current) break;
      await sleep(120);
      if (runId !== playAllRunIdRef.current) break;
      await speakQueuedText(toWordBankTtsText(item.after), runId, playAllRunIdRef);
      if (runId !== playAllRunIdRef.current) break;
      await sleep(160);
    }

    if (runId === playAllRunIdRef.current) {
      setIsPlayingWordBankAll(false);
      setActiveWordBankRowKey(null);
    }
  }, [isPlayingWordBankAll, speakQueuedText, stopWordBankPlayAll, toWordBankTtsText]);

  const handlePluralRulesPlayAll = useCallback(async () => {
    if (isPlayingPluralAll) {
      stopWordBankPlayAll();
      return;
    }

    if (!isSpeechSynthesisSupported()) return;

    // Open section first if it's collapsed
    setOpenSections((prev) => {
      if (!prev.pluralEndings) {
        return { ...prev, pluralEndings: true };
      }
      return prev;
    });
    // Wait for DOM to update before starting playback
    await sleep(80);

    const runId = pluralPlayAllRunIdRef.current + 1;
    pluralPlayAllRunIdRef.current = runId;
    setIsPlayingPluralAll(true);
    stopSpeech();

    for (const [index, item] of S_ES_PLURAL_RULE_EXAMPLES.entries()) {
      if (runId !== pluralPlayAllRunIdRef.current) break;
      setActivePluralExampleKey(item.key);
      const target = pluralExampleRefs.current[index] ?? null;
      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      await sleep(120);
      if (runId !== pluralPlayAllRunIdRef.current) break;
      await speakQueuedText(item.wordBefore, runId, pluralPlayAllRunIdRef);
      if (runId !== pluralPlayAllRunIdRef.current) break;
      await sleep(120);
      if (runId !== pluralPlayAllRunIdRef.current) break;
      await speakQueuedText(item.word, runId, pluralPlayAllRunIdRef);
      if (runId !== pluralPlayAllRunIdRef.current) break;
      await sleep(150);
    }

    if (runId === pluralPlayAllRunIdRef.current) {
      setIsPlayingPluralAll(false);
      setActivePluralExampleKey(null);
    }
  }, [isPlayingPluralAll, speakQueuedText, stopWordBankPlayAll]);

  const handleRulesTablePlayAll = useCallback(async () => {
    if (isPlayingRulesTableAll) {
      stopWordBankPlayAll();
      return;
    }

    if (!isSpeechSynthesisSupported()) return;

    // Open section first if it's collapsed
    setOpenSections((prev) => {
      if (!prev.rulesTable) {
        return { ...prev, rulesTable: true };
      }
      return prev;
    });
    // Wait for DOM to update before starting playback
    await sleep(80);

    const runId = rulesTablePlayAllRunIdRef.current + 1;
    rulesTablePlayAllRunIdRef.current = runId;
    setIsPlayingRulesTableAll(true);
    stopSpeech();

    for (const row of FINAL_SOUND_S_ES_TABLE) {
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
        S_ES_COMMON_MISTAKES_OPEN_KEY,
        openSections.commonMistakes ? '1' : '0',
      );
    } catch {
      // ignore storage write failures
    }
  }, [openSections.commonMistakes]);

  useEffect(() => () => stopWordBankPlayAll(), [stopWordBankPlayAll]);

  return (
    <div className="pronunciation-layout pronunciation-theme pronunciation-theme--final-sound fs-topic-page s-es-page">
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
          <h1 className="fs-topic-title">S/ES Final Sound</h1>
          <p className="fs-topic-subtitle">
            Fokus pada aturan pengucapan akhiran -s/-es untuk plural noun, third-person singular,
            dan possessive.
          </p>
          <div className="s-es-progress-actions">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="primary"
              topicName="Final Sound S/ES"
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
              Bunyi akhir pada akhiran <strong>-s/-es</strong> bergantung pada bunyi terakhir kata
              dasarnya, bukan huruf akhirnya.
            </p>
          ) : null}
        </section>

        <section
          id="pluralEndings"
          className={`fs-topic-block ${showOrangeHighlight ? '' : 's-es-target-highlight-off'} ${
            showMagentaHighlight ? '' : 's-es-base-highlight-off'
          }`}
        >
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('pluralEndings')}
              aria-expanded={openSections.pluralEndings}
            >
              <span>Rules for Plural Endings (-s), Third-Person Singular, and Possessive</span>
              <span className={`fs-topic-section-icon ${openSections.pluralEndings ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.pluralEndings ? (
            <div>
              <div className="fs-topic-grid">
              {S_ES_USAGE_RULES.map((rule) => (
                <article key={rule.ending} className="fs-topic-card">
                  <h3 className="fs-topic-card-title">Dibaca {rule.ending}</h3>
                  <p className="fs-topic-card-note">{rule.trigger}</p>
                  <div className="flex flex-col gap-3 mt-3">
                    {rule.examples.map((example) => (
                      <div
                        key={`${rule.ending}-${example.label}`}
                        className={`bg-[#101414] border rounded-lg p-4 transition-all duration-300 flex flex-col gap-3 relative overflow-hidden ${
                          activePluralExampleKey === `${rule.ending}-${example.label}` 
                            ? 'border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]' 
                            : 'border-white/15 hover:border-cyan-300/70'
                        }`}
                        ref={(node) => {
                          const flatIndex = S_ES_PLURAL_RULE_EXAMPLES.findIndex(
                            (item) => item.key === `${rule.ending}-${example.label}`,
                          );
                          if (flatIndex >= 0) {
                            pluralExampleRefs.current[flatIndex] = node;
                          }
                        }}
                      >
                        <div className="font-sans font-bold text-white uppercase text-xs tracking-wider opacity-80 border-b border-white/10 pb-2 mb-1">
                          {example.label}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-white/55">
                            <span className="font-mono text-[10px] uppercase tracking-wider opacity-80 whitespace-nowrap min-w-[45px]">
                              Before
                            </span>
                            <div className="flex items-center gap-1 bg-black/30 border border-white/15 rounded pl-2.5 pr-1 py-1">
                              <span className="font-sans text-sm mr-1 text-white">
                                {renderSEsWordHighlight(
                                  example.wordBefore,
                                  'base',
                                  `plural-${example.wordBefore}-before-word`,
                                )}
                                {showIpa ? (
                                  <span className="font-ipa text-xs opacity-70 ml-1">
                                    {renderSEsIpaHighlight(
                                      example.ipaBefore,
                                      'base',
                                      `plural-${example.wordBefore}-before-ipa`,
                                    )}
                                  </span>
                                ) : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => void speakWithBestEnglishVoice(example.wordBefore)}
                                className="p-1 rounded transition-colors text-white/40 hover:text-white hover:bg-white/5 flex items-center justify-center"
                                aria-label={`Putar ${example.wordBefore}`}
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-white/80">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-white/90 whitespace-nowrap min-w-[45px]">
                              After
                            </span>
                            <div className="flex items-center gap-1 bg-white/5 rounded shadow-inner border border-white/10 pl-3 pr-1 py-1.5">
                              <span className="font-sans text-lg mr-2 font-bold text-white">
                                {renderSEsWordHighlight(
                                  example.word,
                                  'withEnding',
                                  `plural-${example.word}-after-word`,
                                )}
                                {showIpa ? (
                                  <span className="font-ipa text-sm opacity-70 ml-1">
                                    {renderSEsIpaHighlight(
                                      example.ipa,
                                      'withEnding',
                                      `plural-${example.word}-after-ipa`,
                                    )}
                                  </span>
                                ) : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => void speakWithBestEnglishVoice(example.word)}
                                className="p-1.5 rounded transition-colors text-white/40 hover:text-white hover:bg-white/5 flex items-center justify-center"
                                aria-label={`Putar ${example.word}`}
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
              </div>
            </div>
          ) : null}
        </section>

        <section
          id="rulesTable"
          className={`fs-topic-block ${showOrangeHighlight ? '' : 's-es-target-highlight-off'} ${
            showMagentaHighlight ? '' : 's-es-base-highlight-off'
          }`}
        >
          <h2 className="fs-topic-block-title">
            <button
              type="button"
              className="fs-topic-section-button"
              onClick={() => toggleSection('rulesTable')}
              aria-expanded={openSections.rulesTable}
            >
              <span>Final Sound Rules for -s/-es (Table)</span>
              <span className={`fs-topic-section-icon ${openSections.rulesTable ? 'is-open' : ''}`} aria-hidden="true"></span>
            </button>
          </h2>
          {openSections.rulesTable ? (
            <>
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
                    {FINAL_SOUND_S_ES_TABLE.map((row) => (
                      <tr
                        key={`${row.form}-${row.sound}`}
                        data-rules-table-row-key={`${row.form}-${row.sound}`}
                        className={activeRulesTableRowKey === `${row.form}-${row.sound}` ? 'is-speaking' : ''}
                      >
                        <td>{row.form}</td>
                        <td>{row.sound}</td>
                        <td>{renderUseAfter(row.useAfter)}</td>
                        <td>
                          {renderTableExamples(
                            row.before,
                            (word) => void speakWithBestEnglishVoice(word),
                            { showIpa: showIpa },
                          )}
                        </td>
                        <td>
                          {renderTableExamples(
                            row.after,
                            (word) => void speakWithBestEnglishVoice(word),
                            { showIpa: showIpa, highlightMode: 'withEnding' },
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="fs-topic-table-note">
                <p className="fs-topic-table-note-title">Catatan:</p>
                <ul className="fs-topic-table-note-list">
                  <li>
                    /h/ hampir tidak muncul sebagai bunyi akhir dalam English. Untuk kata
                    berakhiran huruf <strong>h</strong>, lihat bunyi akhirnya (contoh:{' '}
                    <em>laugh</em> /f/, <em>stomach</em> /k/).
                  </li>
                </ul>
              </div>
            </>
          ) : null}
        </section>

        <section
          id="wordBank"
          className={`fs-topic-block ${showOrangeHighlight ? '' : 's-es-target-highlight-off'} ${
            showMagentaHighlight ? '' : 's-es-base-highlight-off'
          }`}
          ref={wordBankSectionRef}
        >
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
              <div className="fs-topic-rules-table-wrap geuwat-table-scroll">
                <table className="fs-topic-rules-table fs-topic-before-after-table geuwat-table-responsive">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Before</th>
                      <th>After</th>
                      {showIpa ? <th>Sound</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {S_ES_BEFORE_AFTER_WORD_BANK.map((item, index) => {
                      const ipaPair = S_ES_WORD_BANK_IPA[`${item.before}|${item.after}`];
                      return (
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
                                <span className="fs-topic-table-example-word">
                                  {renderSEsWordHighlight(
                                    item.before,
                                    'base',
                                    `word-bank-${item.before}-before-word`,
                                  )}
                                </span>
                                {showIpa ? (
                                  <span className="fs-topic-table-example-ipa">
                                    {' '}
                                    {renderSEsIpaHighlight(
                                      ipaPair?.before ?? item.sound,
                                      'base',
                                      `word-bank-${item.before}-before-ipa`,
                                    )}
                                  </span>
                                ) : null}
                              </span>
                              <button
                                type="button"
                                className="fs-topic-mini-btn fs-topic-play-chip-btn"
                                aria-label={`Putar ${item.before}`}
                                title="Putar"
                                onClick={() =>
                                  void playWordBankSingle(item.before, `${item.before}-${item.after}`)
                                }
                              >
                                <span className="fs-topic-play-chip-icon" aria-hidden="true" />
                                <span className="fs-topic-visually-hidden">Putar</span>
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className="fs-topic-table-example-row">
                              <span>
                                <span className="fs-topic-table-example-word">
                                  {renderSEsWordHighlight(
                                    item.after,
                                    'withEnding',
                                    `word-bank-${item.after}-after-word`,
                                  )}
                                </span>
                                {showIpa ? (
                                  <span className="fs-topic-table-example-ipa">
                                    {' '}
                                    {renderSEsIpaHighlight(
                                      ipaPair?.after ?? item.sound,
                                      'withEnding',
                                      `word-bank-${item.after}-after-ipa`,
                                    )}
                                  </span>
                                ) : null}
                              </span>
                              <button
                                type="button"
                                className="fs-topic-mini-btn fs-topic-play-chip-btn"
                                aria-label={`Putar ${item.after}`}
                                title="Putar"
                                onClick={() =>
                                  void playWordBankSingle(item.after, `${item.before}-${item.after}`)
                                }
                              >
                                <span className="fs-topic-play-chip-icon" aria-hidden="true" />
                                <span className="fs-topic-visually-hidden">Putar</span>
                              </button>
                            </div>
                          </td>
                          {showIpa ? (
                            <td>
                              <span className="fs-topic-table-example-ipa">
                                <span className="s-es-hl-target">{item.sound}</span>
                              </span>
                            </td>
                          ) : null}
                        </tr>
                      );
                    })}
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
            <article className="fs-topic-card s-es-common-mistakes-card">
              <ul className="s-es-common-mistakes-list">
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
            <p className="fs-topic-text s-es-practice-mission">
              <strong>Mission:</strong> Bacakan contoh di section{' '}
              <button
                type="button"
                className="s-es-inline-jump-btn"
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
            <div className="s-es-prompt-card">
              <div className="s-es-prompt-header">
                <p className="s-es-prompt-title">Prompt Penilaian Final Sound S/ES</p>
                <button
                  type="button"
                  onClick={() => void handleCopyPrompt()}
                  className="s-es-prompt-copy-btn"
                  aria-label="Salin prompt"
                  title="Salin prompt"
                >
                  <Copy size={13} />
                  <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
                </button>
              </div>
              <div className="s-es-prompt-quote-card">
                <p className="s-es-prompt-quote">
                  &quot;{S_ES_EVALUATION_PROMPT}&quot;
                </p>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <ControlCenter
        topControls={
          <div className="flex flex-col gap-4">
            <IpaVisibilityToggle
              checked={showIpa}
              onChange={setShowIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
            />
            <HighlightVisibilityToggle
              checked={showOrangeHighlight}
              onChange={setShowOrangeHighlight}
              color="orange"
              label="Ending S/ES"
            />
            <HighlightVisibilityToggle
              checked={showMagentaHighlight}
              onChange={setShowMagentaHighlight}
              color="magenta"
              label="Base Final Sound"
            />
          </div>
        }
        bottomControls={
          <div className="flex flex-col gap-2">
            <PlayStopButton
              isActive={isPlayingPluralAll}
              label="PLURAL RULES"
              sectionId="pluralEndings"
              onClick={() => void handlePluralRulesPlayAll()}
            />
            <PlayStopButton
              isActive={isPlayingRulesTableAll}
              label="RULES TABLE"
              sectionId="rulesTable"
              onClick={() => void handleRulesTablePlayAll()}
            />
            <PlayStopButton
              isActive={isPlayingWordBankAll}
              label="WORD BANK"
              sectionId="wordBank"
              onClick={() => void handleWordBankPlayAll()}
            />
          </div>
        }
      />

      <RecordingControlsButton
        className="s-es-recording-anchor"
        downloadFileName="final-sound-s-es-GEUWAT-recording.mp3"
      />
    </div>
  );
}
