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
      { wordBefore: 'work', ipaBefore: '/w\u025C\u02D0rk/', word: 'worked', ipa: '/w\u025C\u02D0rkt/' },
      { wordBefore: 'wash', ipaBefore: '/w\u0252\u0283/', word: 'washed', ipa: '/w\u0252\u0283t/' },
      { wordBefore: 'stop', ipaBefore: '/st\u0252p/', word: 'stopped', ipa: '/st\u0252pt/' },
    ],
  },
  {
    ending: '/d/',
    trigger: 'Setelah bunyi voiced (kecuali /d/).',
    examples: [
      { wordBefore: 'play', ipaBefore: '/ple\u026A/', word: 'played', ipa: '/ple\u026Ad/' },
      { wordBefore: 'clean', ipaBefore: '/kli\u02D0n/', word: 'cleaned', ipa: '/kli\u02D0nd/' },
      { wordBefore: 'call', ipaBefore: '/k\u0254\u02D0l/', word: 'called', ipa: '/k\u0254\u02D0ld/' },
    ],
  },
  {
    ending: '/\u026Ad/',
    trigger: 'Setelah bunyi /t/ atau /d/.',
    examples: [
      { wordBefore: 'want', ipaBefore: '/w\u0252nt/', word: 'wanted', ipa: '/\u02C8w\u0252nt\u026Ad/' },
      { wordBefore: 'need', ipaBefore: '/ni\u02D0d/', word: 'needed', ipa: '/\u02C8ni\u02D0d\u026Ad/' },
      { wordBefore: 'decide', ipaBefore: '/d\u026A\u02C8sa\u026Ad/', word: 'decided', ipa: '/d\u026A\u02C8sa\u026Ad\u026Ad/' },
    ],
  },
] as const;

const PAST_ENDING_EXAMPLES_FLAT = PAST_ENDING_RULES.flatMap((rule) =>
  rule.examples.map((example) => ({
    key: `${rule.ending}-${example.word}`,
    wordBefore: example.wordBefore,
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

const D_ED_WORD_BANK_IPA: Record<string, { before: string; after: string }> = {
  'work|worked': { before: '/w\u025C\u02D0rk/', after: '/w\u025C\u02D0rkt/' },
  'wash|washed': { before: '/w\u0252\u0283/', after: '/w\u0252\u0283t/' },
  'stop|stopped': { before: '/st\u0252p/', after: '/st\u0252pt/' },
  'laugh|laughed': { before: '/l\u00E6f/', after: '/l\u00E6ft/' },
  'miss|missed': { before: '/m\u026As/', after: '/m\u026Ast/' },
  'watch|watched': { before: '/w\u0251t\u0283/', after: '/w\u0251t\u0283t/' },
  'kiss|kissed': { before: '/k\u026As/', after: '/k\u026Ast/' },
  'dance|danced': { before: '/d\u00E6ns/', after: '/d\u00E6nst/' },
  'pass|passed': { before: '/p\u00E6s/', after: '/p\u00E6st/' },
  'talk|talked': { before: '/t\u0254k/', after: '/t\u0254kt/' },
  'walk|walked': { before: '/w\u0254k/', after: '/w\u0254kt/' },
  'jump|jumped': { before: '/d\u0292\u028Cp/', after: '/d\u0292\u028Cmpt/' },
  'help|helped': { before: '/h\u025Blp/', after: '/h\u025Blpt/' },
  'push|pushed': { before: '/p\u028A\u0283/', after: '/p\u028A\u0283t/' },
  'cough|coughed': { before: '/k\u0254f/', after: '/k\u0254ft/' },

  'play|played': { before: '/ple\u026A/', after: '/ple\u026Ad/' },
  'clean|cleaned': { before: '/kli\u02D0n/', after: '/kli\u02D0nd/' },
  'call|called': { before: '/k\u0254l/', after: '/k\u0254ld/' },
  'open|opened': { before: '/\u02C8o\u028Ap\u0259n/', after: '/\u02C8o\u028Ap\u0259nd/' },
  'answer|answered': { before: '/\u02C8\u00E6ns\u0259r/', after: '/\u02C8\u00E6ns\u0259rd/' },
  'live|lived': { before: '/l\u026Av/', after: '/l\u026Avd/' },
  'rain|rained': { before: '/re\u026An/', after: '/re\u026And/' },
  'snow|snowed': { before: '/sno\u028A/', after: '/sno\u028Ad/' },
  'enjoy|enjoyed': { before: '/\u026An\u02C8d\u0292\u0254\u026A/', after: '/\u026An\u02C8d\u0292\u0254\u026Ad/' },
  'plan|planned': { before: '/pl\u00E6n/', after: '/pl\u00E6nd/' },
  'allow|allowed': { before: '/\u0259\u02C8la\u028A/', after: '/\u0259\u02C8la\u028Ad/' },
  'love|loved': { before: '/l\u028Cv/', after: '/l\u028Cvd/' },
  'move|moved': { before: '/mu\u02D0v/', after: '/mu\u02D0vd/' },
  'close|closed': { before: '/klo\u028Az/', after: '/klo\u028Azd/' },
  'carry|carried': { before: '/\u02C8k\u00E6ri/', after: '/\u02C8k\u00E6rid/' },

  'want|wanted': { before: '/w\u0252nt/', after: '/\u02C8w\u0252nt\u026Ad/' },
  'need|needed': { before: '/ni\u02D0d/', after: '/\u02C8ni\u02D0d\u026Ad/' },
  'decide|decided': { before: '/d\u026A\u02C8sa\u026Ad/', after: '/d\u026A\u02C8sa\u026Ad\u026Ad/' },
  'visit|visited': { before: '/\u02C8v\u026Az\u026At/', after: '/\u02C8v\u026Az\u026At\u026Ad/' },
  'wait|waited': { before: '/we\u026At/', after: '/\u02C8we\u026At\u026Ad/' },
  'start|started': { before: '/st\u0251rt/', after: '/\u02C8st\u0251rt\u026Ad/' },
  'end|ended': { before: '/\u025Bnd/', after: '/\u02C8\u025Bnd\u026Ad/' },
  'paint|painted': { before: '/pe\u026Ant/', after: '/\u02C8pe\u026Ant\u026Ad/' },
  'invite|invited': { before: '/\u026An\u02C8va\u026At/', after: '/\u026An\u02C8va\u026At\u026Ad/' },
  'collect|collected': { before: '/k\u0259\u02C8l\u025Bkt/', after: '/k\u0259\u02C8l\u025Bkt\u026Ad/' },
  'repeat|repeated': { before: '/r\u026A\u02C8pi\u02D0t/', after: '/r\u026A\u02C8pi\u02D0t\u026Ad/' },
  'count|counted': { before: '/ka\u028Ant/', after: '/\u02C8ka\u028Ant\u026Ad/' },
  'add|added': { before: '/\u00E6d/', after: '/\u02C8\u00E6d\u026Ad/' },
  'edit|edited': { before: '/\u02C8\u025Bd\u026At/', after: '/\u02C8\u025Bd\u026At\u026Ad/' },
  'guard|guarded': { before: '/\u0261\u0251rd/', after: '/\u02C8\u0261\u0251rd\u026Ad/' },
};

const COMMON_MISTAKES = [
  'Membaca semua akhiran -ed sebagai /ed/ dalam semua kata.',
  'Menghilangkan bunyi akhir pada past tense saat bicara cepat.',
  'Tidak membedakan /t/ vs /d/ sehingga worked dan played terdengar sama.',
  'Membaca wanted/needed terlalu cepat sehingga bunyi /\u026Ad/ hilang.',
] as const;

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const FINAL_SOUND_D_ED_PROGRESS_ID = 'finalSoundDEd';
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

const D_ED_BASE_LETTER_PATTERNS = ['tch', 'dge', 'sh', 'ch', 'ck', 'gh', 'ph', 'ss', 'ce', 'ge'];
const D_ED_BASE_IPA_SYMBOLS = [
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

function getDEdEndingLength(word: string): number {
  const lower = word.toLowerCase();
  if (lower.endsWith('ed')) return 2;
  if (lower.endsWith('d')) return 1;
  return 0;
}

function getBaseFinalLetterRange(base: string) {
  if (!base) return { start: 0, end: 0 };

  const lower = base.toLowerCase();
  const matchedPattern = D_ED_BASE_LETTER_PATTERNS.find((pattern) => lower.endsWith(pattern));

  if (matchedPattern) {
    return { start: base.length - matchedPattern.length, end: base.length };
  }

  if (lower.endsWith('e') && base.length > 1 && !lower.endsWith('ee')) {
    return { start: base.length - 2, end: base.length - 1 };
  }

  return { start: base.length - 1, end: base.length };
}

function renderDEdWordHighlight(word: string, mode: HighlightMode, keyPrefix: string): ReactNode {
  const endingLength = mode === 'withEnding' ? getDEdEndingLength(word) : 0;
  const splitIndex = Math.max(0, word.length - endingLength);
  const base = word.slice(0, splitIndex);
  const ending = word.slice(splitIndex);
  const baseFinalRange = getBaseFinalLetterRange(base);

  return (
    <>
      {base.slice(0, baseFinalRange.start)}
      {baseFinalRange.end > baseFinalRange.start ? (
        <span className="d-ed-hl-base-final" key={`${keyPrefix}-base-final`}>
          {base.slice(baseFinalRange.start, baseFinalRange.end)}
        </span>
      ) : null}
      {base.slice(baseFinalRange.end)}
      {ending ? (
        <span className="d-ed-hl-target" key={`${keyPrefix}-target`}>
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

function getDEdIpaEndingLength(core: string): number {
  const normalized = core.toLowerCase();
  if (normalized.endsWith('\u026ad') || normalized.endsWith('id')) return 2;
  if (normalized.endsWith('t') || normalized.endsWith('d')) return 1;
  return 0;
}

function getBaseFinalIpaSymbol(baseCore: string): string {
  const normalized = baseCore.replace(/[ˈˌ]/g, '').toLowerCase();
  return D_ED_BASE_IPA_SYMBOLS.find((symbol) => normalized.endsWith(symbol)) ?? '';
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

function renderDEdIpaHighlight(ipa: string, mode: HighlightMode, keyPrefix: string): ReactNode {
  const { leading, core, trailing } = splitIpaToken(ipa);
  const endingLength = mode === 'withEnding' ? getDEdIpaEndingLength(core) : 0;
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
        <span className="d-ed-hl-base-final" key={`${keyPrefix}-ipa-base-final`}>
          {baseCore.slice(baseFinalIndex)}
        </span>
      ) : null}
      {ending ? (
        <span className="d-ed-hl-target" key={`${keyPrefix}-ipa-target`}>
          {ending}
        </span>
      ) : null}
      {trailing}
    </>
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
              {renderDEdWordHighlight(item.word, highlightMode, `table-${item.rawLabel}-word`)}
            </span>
            {showIpa && item.ipa ? (
              <span className="fs-topic-table-example-ipa">
                {' '}
                {renderDEdIpaHighlight(item.ipa, highlightMode, `table-${item.rawLabel}-ipa`)}
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

export default function FinalSoundDEdPage() {
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
      const assessmentKey = 'Final Sound D/ED'.toLowerCase().replace(/\s+/g, '_');
      const savedAssessmentPercent = savedAssessments[assessmentKey]?.percentage;
      const hasSavedAssessment =
        typeof savedAssessmentPercent === 'number' &&
        Number.isFinite(savedAssessmentPercent) &&
        savedAssessmentPercent > 0;

      return (
        (typeof currentProgress[FINAL_SOUND_D_ED_PROGRESS_ID] === 'number' &&
          currentProgress[FINAL_SOUND_D_ED_PROGRESS_ID] > 0) ||
        hasSavedAssessment
      );
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
  const [showPastEndingsOrangeHighlight, setShowPastEndingsOrangeHighlight] = useState(true);
  const [showPastEndingsMagentaHighlight, setShowPastEndingsMagentaHighlight] = useState(true);
  const [showRulesTableOrangeHighlight, setShowRulesTableOrangeHighlight] = useState(true);
  const [showRulesTableMagentaHighlight, setShowRulesTableMagentaHighlight] = useState(true);
  const [showWordBankOrangeHighlight, setShowWordBankOrangeHighlight] = useState(true);
  const [showWordBankMagentaHighlight, setShowWordBankMagentaHighlight] = useState(true);
  const [activeWordBankRowKey, setActiveWordBankRowKey] = useState<string | null>(null);
  const [activePastEndingKey, setActivePastEndingKey] = useState<string | null>(null);
  const [activeRulesTableRowKey, setActiveRulesTableRowKey] = useState<string | null>(null);
  const playAllRunIdRef = useRef(0);
  const pastEndingsPlayAllRunIdRef = useRef(0);
  const rulesTablePlayAllRunIdRef = useRef(0);
  const singlePlayRunIdRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const wordBankRowRefs = useRef<Array<HTMLTableRowElement | null>>([]);
  const pastEndingItemRefs = useRef<Array<HTMLDivElement | null>>([]);
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
      delete pronunciationProgress.finalSound;
      pronunciationProgress[FINAL_SOUND_D_ED_PROGRESS_ID] = percentage;
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
    delete pronunciationProgress[FINAL_SOUND_D_ED_PROGRESS_ID];
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

    setOpenSections((prev) => {
      if (!prev.wordBank) {
        return { ...prev, wordBank: true };
      }
      return prev;
    });
    await sleep(80);

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
      await speakQueuedText(toWordBankTtsText(item.before), runId, playAllRunIdRef);
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
  }, [isPlayingWordBankAll, speakQueuedText, stopWordBankPlayAll, toWordBankTtsText]);

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

    setOpenSections((prev) => {
      if (!prev.pastEndings) {
        return { ...prev, pastEndings: true };
      }
      return prev;
    });
    await sleep(80);

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
      await speakQueuedText(item.wordBefore, runId, pastEndingsPlayAllRunIdRef);
      if (runId !== pastEndingsPlayAllRunIdRef.current) break;
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

    setOpenSections((prev) => {
      if (!prev.rulesTable) {
        return { ...prev, rulesTable: true };
      }
      return prev;
    });
    await sleep(80);

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
    <div className="pronunciation-layout pronunciation-theme pronunciation-theme--final-sound fs-topic-page d-ed-page">
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

        <section
          id="pastEndings"
          className={`fs-topic-block ${showPastEndingsOrangeHighlight ? '' : 'd-ed-target-highlight-off'} ${
            showPastEndingsMagentaHighlight ? '' : 'd-ed-base-highlight-off'
          }`}
        >
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
                  <div className="flex flex-col gap-3 mt-3">
                    {rule.examples.map((example) => (
                      <div
                        key={example.word}
                        className={`bg-[#101414] border rounded-lg p-4 transition-all duration-300 flex flex-col gap-3 relative overflow-hidden ${
                          activePastEndingKey === `${rule.ending}-${example.word}`
                            ? 'border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                            : 'border-white/15 hover:border-cyan-300/70'
                        }`}
                        ref={(node) => {
                          const flatIndex = PAST_ENDING_EXAMPLES_FLAT.findIndex(
                            (item) => item.key === `${rule.ending}-${example.word}`,
                          );
                          if (flatIndex >= 0) {
                            pastEndingItemRefs.current[flatIndex] = node;
                          }
                        }}
                      >
                        <div className="font-sans font-bold text-white uppercase text-xs tracking-wider opacity-80 border-b border-white/10 pb-2 mb-1">
                          {rule.ending} ending
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-white/55">
                            <span className="font-mono text-[10px] uppercase tracking-wider opacity-80 whitespace-nowrap min-w-[45px]">
                              Before
                            </span>
                            <div className="flex items-center gap-1 bg-black/30 border border-white/15 rounded pl-2.5 pr-1 py-1">
                              <span className="font-sans text-sm mr-1 text-cyan-200">
                                {renderDEdWordHighlight(
                                  example.wordBefore,
                                  'base',
                                  `past-${example.wordBefore}-before-word`,
                                )}
                                {showPastEndingsIpa ? (
                                  <span className="font-mono text-xs opacity-70 ml-1">
                                    {renderDEdIpaHighlight(
                                      example.ipaBefore,
                                      'base',
                                      `past-${example.wordBefore}-before-ipa`,
                                    )}
                                  </span>
                                ) : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => void playPastEndingSingle(example.wordBefore, `${rule.ending}-${example.word}`)}
                                className="p-1 rounded transition-colors text-white/40 hover:text-cyan-200 hover:bg-white/5 flex items-center justify-center"
                                aria-label={`Putar ${example.wordBefore}`}
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-white/80">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-100 whitespace-nowrap min-w-[45px]">
                              After
                            </span>
                            <div className="flex items-center gap-1 bg-white/5 rounded shadow-inner border border-white/10 pl-3 pr-1 py-1.5">
                              <span className="font-sans text-lg mr-2 text-cyan-200 font-bold">
                                {renderDEdWordHighlight(
                                  example.word,
                                  'withEnding',
                                  `past-${example.word}-after-word`,
                                )}
                                {showPastEndingsIpa ? (
                                  <span className="font-mono text-sm opacity-70 ml-1">
                                    {renderDEdIpaHighlight(
                                      example.ipa,
                                      'withEnding',
                                      `past-${example.word}-after-ipa`,
                                    )}
                                  </span>
                                ) : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => void playPastEndingSingle(example.word, `${rule.ending}-${example.word}`)}
                                className="p-1.5 rounded transition-colors text-white/40 hover:text-cyan-200 hover:bg-white/5 flex items-center justify-center"
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
          className={`fs-topic-block ${showRulesTableOrangeHighlight ? '' : 'd-ed-target-highlight-off'} ${
            showRulesTableMagentaHighlight ? '' : 'd-ed-base-highlight-off'
          }`}
        >
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
                            highlightMode: 'withEnding',
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

        <section
          id="wordBank"
          className={`fs-topic-block ${showWordBankOrangeHighlight ? '' : 'd-ed-target-highlight-off'} ${
            showWordBankMagentaHighlight ? '' : 'd-ed-base-highlight-off'
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
                      {showWordBankIpa ? <th>Sound</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {D_ED_BEFORE_AFTER_WORD_BANK.map((item, index) => {
                      const ipaPair = D_ED_WORD_BANK_IPA[`${item.before}|${item.after}`];
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
                                  {renderDEdWordHighlight(
                                    item.before,
                                    'base',
                                    `word-bank-${item.before}-before-word`,
                                  )}
                                </span>
                                {showWordBankIpa ? (
                                  <span className="fs-topic-table-example-ipa">
                                    {' '}
                                    {renderDEdIpaHighlight(
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
                                <span className="fs-topic-table-example-word">
                                  {renderDEdWordHighlight(
                                    item.after,
                                    'withEnding',
                                    `word-bank-${item.after}-after-word`,
                                  )}
                                </span>
                                {showWordBankIpa ? (
                                  <span className="fs-topic-table-example-ipa">
                                    {' '}
                                    {renderDEdIpaHighlight(
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
                                onClick={() => void playWordBankSingle(item.after, `${item.before}-${item.after}`)}
                              >
                                <span className="fs-topic-play-chip-icon" aria-hidden="true" />
                                <span className="fs-topic-visually-hidden">Putar</span>
                              </button>
                            </div>
                          </td>
                          {showWordBankIpa ? (
                            <td>
                              <span className="fs-topic-table-example-ipa">
                                <span className="d-ed-hl-target">{item.sound}</span>
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

      <ControlCenter>
        <div className="flex flex-col gap-6">
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block mb-1.5 sm:mb-2 uppercase">
              Past Endings
            </span>
            <PlayStopButton
              isActive={isPlayingPastEndingsAll}
              label="PAST ENDINGS"
              sectionId="pastEndings"
              onClick={() => void handlePastEndingsPlayAll()}
              size="sm"
              className="mb-2 sm:mb-3"
            />
            <IpaVisibilityToggle
              checked={showPastEndingsIpa}
              onChange={setShowPastEndingsIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
              label="Past Endings IPA"
            />
            <HighlightVisibilityToggle
              checked={showPastEndingsOrangeHighlight}
              onChange={setShowPastEndingsOrangeHighlight}
              color="orange"
              label="Ending D/ED"
            />
            <HighlightVisibilityToggle
              checked={showPastEndingsMagentaHighlight}
              onChange={setShowPastEndingsMagentaHighlight}
              color="magenta"
              label="Base Final Sound"
            />
          </div>

          <div>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block mb-1.5 sm:mb-2 uppercase">
              Rules Table
            </span>
            <PlayStopButton
              isActive={isPlayingRulesTableAll}
              label="RULES TABLE"
              sectionId="rulesTable"
              onClick={() => void handleRulesTablePlayAll()}
              size="sm"
              className="mb-2 sm:mb-3"
            />
            <IpaVisibilityToggle
              checked={showRulesTableIpa}
              onChange={setShowRulesTableIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
              label="Rules Table IPA"
            />
            <HighlightVisibilityToggle
              checked={showRulesTableOrangeHighlight}
              onChange={setShowRulesTableOrangeHighlight}
              color="orange"
              label="Ending D/ED"
            />
            <HighlightVisibilityToggle
              checked={showRulesTableMagentaHighlight}
              onChange={setShowRulesTableMagentaHighlight}
              color="magenta"
              label="Base Final Sound"
            />
          </div>

          <div>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block mb-1.5 sm:mb-2 uppercase">
              Word Bank
            </span>
            <PlayStopButton
              isActive={isPlayingWordBankAll}
              label="WORD BANK"
              sectionId="wordBank"
              onClick={() => void handleWordBankPlayAll()}
              size="sm"
              className="mb-2 sm:mb-3"
            />
            <IpaVisibilityToggle
              checked={showWordBankIpa}
              onChange={setShowWordBankIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
              label="Word Bank IPA"
            />
            <HighlightVisibilityToggle
              checked={showWordBankOrangeHighlight}
              onChange={setShowWordBankOrangeHighlight}
              color="orange"
              label="Ending D/ED"
            />
            <HighlightVisibilityToggle
              checked={showWordBankMagentaHighlight}
              onChange={setShowWordBankMagentaHighlight}
              color="magenta"
              label="Base Final Sound"
            />
          </div>
        </div>
      </ControlCenter>

      <RecordingControlsButton
        className="d-ed-recording-anchor"
        downloadFileName="final-sound-d-ed-GEUWAT-recording.wav"
      />
    </div>
  );
}
