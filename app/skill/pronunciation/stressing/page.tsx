'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import { speakText, stopSpeech, waitForVoices } from '@/lib/tts/speech';
import './stressing.css';

const RecordingControlsButton = dynamic(() => import('../../components/RecordingControlsButton'), {
  ssr: false,
});

const WORD_STRESS_EXAMPLES = [
  {
    word: 'TAble',
    plain: 'table',
    ipa: '/ˈteɪ.bəl/',
    type: 'Kata Benda',
    note: 'Dua suku kata, umumnya kata benda diberi tekanan di suku kata pertama.',
  },
  {
    word: 'aBOVE',
    plain: 'above',
    ipa: '/əˈbʌv/',
    type: 'Kata Depan',
    note: 'Dua suku kata, banyak kata depan dan kata fungsi diberi tekanan di suku kata kedua.',
  },
  {
    word: 'PHOtograph',
    plain: 'photograph',
    ipa: '/ˈfoʊ.t̬ə.ɡræf/',
    type: 'Kata Benda',
    note: 'Tekanan utama berada di awal kata.',
  },
  {
    word: 'phoTOGraphy',
    plain: 'photography',
    ipa: '/fəˈtɑː.ɡrə.fi/',
    type: 'Kata Benda',
    note: 'Saat bentuk kata berubah, posisi tekanan bisa berpindah.',
  },
  {
    word: 'REcord',
    plain: 'The record is on the table.',
    ipa: '/ˈrek.ərd/',
    type: 'Kata Benda',
    note: 'Kontras kata benda-kata kerja: kata benda biasanya ditekan di awal.',
  },
  {
    word: 'reCORD',
    plain: 'I need to record this lesson now.',
    ipa: '/rɪˈkɔːrd/',
    type: 'Kata Kerja',
    note: 'Pada banyak pasangan kata benda-kata kerja, kata kerja ditekan di suku kata kedua.',
  },
] as const;

const IPA_STRESS_MARKS = [
  { mark: 'ˈ', label: 'Tekanan Utama', note: 'Suku kata yang paling kuat.' },
  { mark: 'ˌ', label: 'Tekanan Sekunder', note: 'Tekanan tambahan yang lebih lemah dari tekanan utama.' },
  {
    mark: 'ə',
    label: 'Schwa',
    note: 'Vokal lemah pada suku kata yang tidak ditekan.',
  },
] as const;

const SYLLABLE_EXAMPLES = [
  {
    word: 'TAble',
    plain: 'table',
    split: 'TA-ble',
    ipa: '/ˈteɪ.bəl/',
    count: 2,
    note: 'Satu puncak tekanan utama di suku kata pertama.',
  },
  {
    word: 'imPORtant',
    plain: 'important',
    split: 'im-POR-tant',
    ipa: '/ɪmˈpɔːr.tənt/',
    count: 3,
    note: 'Suku kata tengah menerima tekanan utama.',
  },
  {
    word: 'phoTOGraphy',
    plain: 'photography',
    split: 'pho-TO-gra-phy',
    ipa: '/fəˈtɑː.ɡrə.fi/',
    count: 4,
    note: 'Untuk kata panjang, hitung ketukan dulu, lalu tentukan tekanan utama.',
  },
  {
    word: 'communiCAtion',
    plain: 'communication',
    split: 'com-mu-ni-CA-tion',
    ipa: '/kəˌmjuː.nəˈkeɪ.ʃən/',
    count: 5,
    note: 'Ada tekanan sekunder (ˌ) dan tekanan utama (ˈ).',
  },
] as const;

const QUICK_RULES = [
  {
    title: 'Kata Benda/Kata Sifat 2 Suku Kata',
    note: 'Umumnya ditekan di suku kata pertama.',
    examples: [
      { text: 'TAble', ipa: '/ˈteɪ.bəl/' },
      { text: 'HAPpy', ipa: '/ˈhæ.pi/' },
    ],
  },
  {
    title: 'Kata Kerja 2 Suku Kata',
    note: 'Umumnya ditekan di suku kata kedua.',
    examples: [
      { text: 'reLAX', ipa: '/rɪˈlæks/' },
      { text: 'deCIDE', ipa: '/dɪˈsaɪd/' },
    ],
  },
  {
    title: 'Pergeseran Tekanan dalam Keluarga Kata',
    note: 'Perubahan bentuk kata bisa menggeser posisi tekanan.',
    examples: [
      { text: 'PHOtograph -> phoTOGraphy', ipa: '/ˈfoʊ.t̬ə.ɡræf/ -> /fəˈtɑː.ɡrə.fi/' },
      { text: 'eCONomy -> ecoNOMic', ipa: '/ɪˈkɑː.nə.mi/ -> /ˌiː.kəˈnɑː.mɪk/' },
    ],
  },
] as const;

const STRESS_POSITION_BANK = [
  {
    title: 'Stress di Syllable Pertama',
    items: [
      'TAble /ˈteɪ.bəl/',
      'HAPpy /ˈhæ.pi/',
      'DOCtor /ˈdɑːk.tər/',
      'WINdow /ˈwɪn.doʊ/',
      'MUsic /ˈmjuː.zɪk/',
      'MOney /ˈmʌ.ni/',
      'BEAUtiful /ˈbjuː.t̬ə.fəl/',
      'FAmily /ˈfæ.mə.li/',
      'ANimal /ˈæ.nə.məl/',
      'CIty /ˈsɪ.ti/',
    ],
  },
  {
    title: 'Stress di Syllable Kedua',
    items: [
      'aBOVE /əˈbʌv/',
      'hoTEL /hoʊˈtel/',
      'beGIN /bɪˈɡɪn/',
      'reLAX /rɪˈlæks/',
      'arRIVE /əˈraɪv/',
      'deCIDE /dɪˈsaɪd/',
      'toDAY /təˈdeɪ/',
      'exPLAIN /ɪkˈspleɪn/',
      'forGET /fərˈɡet/',
      'beLIEVE /bɪˈliːv/',
    ],
  },
  {
    title: 'Stress di Syllable Ketiga',
    items: [
      'engiNEER /ˌen.dʒəˈnɪr/',
      'volunTEER /ˌvɑː.lənˈtɪr/',
      'refuGEE /ˌref.juˈdʒiː/',
      'underSTAND /ˌʌn.dərˈstænd/',
      'interRUPT /ˌɪn.tərˈrʌpt/',
      'overLOOK /ˌoʊ.vərˈlʊk/',
      'afterNOON /ˌæf.tərˈnuːn/',
      'guaranTEE /ˌɡer.ənˈtiː/',
      'enterTAIN /ˌen.tərˈteɪn/',
      'compreHEND /ˌkɑːm.prɪˈhend/',
    ],
  },
  {
    title: 'Stress di Syllable Keempat',
    items: [
      'communiCAtion /kəˌmjuː.nəˈkeɪ.ʃən/',
      'determiNAtion /dɪˌtɝː.məˈneɪ.ʃən/',
      'appreCIAtion /əˌpriː.ʃiˈeɪ.ʃən/',
      'organiZAtion /ˌɔːr.ɡə.nəˈzeɪ.ʃən/',
      'clarifiCAtion /ˌkler.ə.fəˈkeɪ.ʃən/',
      'modifiCAtion /ˌmɑː.də.fəˈkeɪ.ʃən/',
      'verifiCAtion /ˌver.ə.fəˈkeɪ.ʃən/',
      'notifiCAtion /ˌnoʊ.t̬ə.fəˈkeɪ.ʃən/',
      'justifiCAtion /ˌdʒʌ.stə.fəˈkeɪ.ʃən/',
      'classifiCAtion /ˌklæ.sə.fəˈkeɪ.ʃən/',
    ],
  },
] as const;

const SENTENCE_STRESS_EXAMPLES = [
  {
    tokens: [
      { text: 'I', weak: true },
      { text: 'WANTED', stressed: true },
      { text: 'a', weak: true },
      { text: 'RED', stressed: true },
      { text: 'pen,', stressed: true },
      { text: 'not', weak: true },
      { text: 'a', weak: true },
      { text: 'BLUE', stressed: true },
      { text: 'one.', stressed: true },
    ],
    tts: 'I wanted a red pen, not a blue one.',
    note: 'Kata yang ditekankan mengubah fokus makna.',
  },
  {
    tokens: [
      { text: 'She', weak: true },
      { text: 'CAN', stressed: true },
      { text: 'swim,', stressed: true },
      { text: 'but', weak: true },
      { text: 'she', weak: true },
      { text: 'CANNOT', stressed: true },
      { text: 'dive.', stressed: true },
    ],
    tts: 'She can swim, but she cannot dive.',
    note: 'Stress dipakai untuk kontras informasi.',
  },
  {
    tokens: [
      { text: 'I', weak: true },
      { text: 'did', weak: true },
      { text: 'NOT', stressed: true },
      { text: 'say', stressed: true },
      { text: 'he', weak: true },
      { text: 'stole', stressed: true },
      { text: 'the', weak: true },
      { text: 'money.', stressed: true },
    ],
    tts: 'I did not say he stole the money.',
    note: 'Memindahkan tekanan bisa mengubah interpretasi kalimat.',
  },
] as const;

const CONTENT_FUNCTION_EXAMPLES = [
  {
    title: 'Content Words (Usually Stressed)',
    note: 'Biasanya mencakup noun, main verb, adjective, adverb.',
    points: [
      'Membawa makna inti kalimat',
      'Menerima tekanan yang lebih kuat',
      'Biasanya terdengar lebih jelas dan lebih panjang',
    ],
    tokens: [
      { text: 'The', weak: true },
      { text: 'NEW', stressed: true },
      { text: 'PROJECT', stressed: true },
      { text: 'NEEDS', stressed: true },
      { text: 'CLEAR', stressed: true },
      { text: 'GOALS.', stressed: true },
    ],
    plain: 'The new project needs clear goals.',
  },
  {
    title: 'Function Words (Usually Weak)',
    note: 'Biasanya article, pronoun, preposition, auxiliary, conjunction.',
    points: [
      'Mendukung struktur tata bahasa',
      'Sering direduksi dalam connected speech',
      'Cenderung pendek dan lemah dalam ritme kalimat',
    ],
    tokens: [
      { text: 'I', weak: true },
      { text: 'can', weak: true },
      { text: 'DO', stressed: true },
      { text: 'it', weak: true },
      { text: 'in', weak: true },
      { text: 'a', weak: true },
      { text: 'MINUTE.', stressed: true },
    ],
    plain: 'I can do it in a minute.',
  },
  {
    title: 'When Function Words Become Stressed',
    note: 'Function words bisa ditekankan saat memberi kontras/penegasan.',
    points: [
      'Kontras: CAN vs CANNOT',
      'Koreksi: did vs did NOT',
      'Perpindahan fokus dalam percakapan',
    ],
    tokens: [
      { text: 'She', weak: true },
      { text: 'CAN', stressed: true },
      { text: 'swim,', stressed: true },
      { text: 'but', weak: true },
      { text: 'she', weak: true },
      { text: 'CANNOT', stressed: true },
      { text: 'dive.', stressed: true },
    ],
    plain: 'She can swim, but she cannot dive.',
  },
] as const;

const NOUN_VERB_STRESS_CONTRAST = [
  {
    base: 'record',
    noun: 'REcord',
    nounIpa: '/ˈrek.ərd/',
    nounPlain: 'The record is on the table.',
    nounId: 'Rekaman itu ada di atas meja.',
    verb: 'reCORD',
    verbIpa: '/rɪˈkɔːrd/',
    verbPlain: 'I need to record this lesson now.',
    verbId: 'Saya perlu merekam pelajaran ini sekarang.',
    note: 'Ejaan sama, fungsi berbeda, posisi tekanan ikut berubah.',
  },
  {
    base: 'present',
    noun: 'PREsent',
    nounIpa: '/ˈprez.ənt/',
    nounPlain: 'This is a birthday present.',
    nounId: 'Ini hadiah ulang tahun.',
    verb: 'preSENT',
    verbIpa: '/prɪˈzent/',
    verbPlain: 'They will present the final report today.',
    verbId: 'Mereka akan mempresentasikan laporan akhir hari ini.',
    note: 'Kontras noun-verb paling umum di level menengah.',
  },
  {
    base: 'increase',
    noun: 'INcrease',
    nounIpa: '/ˈɪn.kriːs/',
    nounPlain: 'There was an increase in sales.',
    nounId: 'Ada peningkatan penjualan.',
    verb: 'inCREASE',
    verbIpa: '/ɪnˈkriːs/',
    verbPlain: 'Sales can increase next month.',
    verbId: 'Penjualan bisa meningkat bulan depan.',
    note: 'Noun cenderung tekanan awal, verb cenderung tekanan akhir.',
  },
  {
    base: 'import',
    noun: 'IMport',
    nounIpa: '/ˈɪm.pɔːrt/',
    nounPlain: 'Rice is a major import here.',
    nounId: 'Beras adalah komoditas impor utama di sini.',
    verb: 'imPORT',
    verbIpa: '/ɪmˈpɔːrt/',
    verbPlain: 'They import rice from abroad.',
    verbId: 'Mereka mengimpor beras dari luar negeri.',
    note: 'Pergeseran stress mengubah kelas kata sekaligus makna gramatikal.',
  },
] as const;

const SELF_CHECK_STEPS = [
  'Hitung jumlah suku kata terlebih dahulu.',
  'Tandai satu tekanan utama pada setiap kata.',
  'Buat function words lebih ringan, kecuali saat perlu kontras.',
  'Rekam suara Anda lalu bandingkan dengan audio di kamus.',
  'Ulangi kata yang sulit dalam kalimat pendek, bukan hanya kata lepas.',
] as const;

const COMMON_MISTAKES = [
  {
    wrong: 'Meletakkan tekanan sama rata pada semua suku kata.',
    correct: 'Pilih satu suku kata utama yang paling kuat.',
  },
  {
    wrong: 'Menghafal tekanan tanpa mengecek pola kata saat bentuknya berubah.',
    correct: 'Latih pasangan bentuk kata: PHOtograph -> phoTOGraphy.',
  },
  {
    wrong: 'Tidak memberi tekanan pada kata inti saat berbicara.',
    correct: 'Tekankan kata benda, kata kerja utama, kata sifat, dan kata keterangan penting.',
  },
] as const;

const PRACTICE_WORD_STRESS_SET = [
  {
    word: 'TAble',
    plain: 'table',
    ipa: '/ˈteɪ.bəl/',
    position: 'Stress suku kata pertama',
  },
  {
    word: 'hoTEL',
    plain: 'hotel',
    ipa: '/hoʊˈtel/',
    position: 'Stress suku kata kedua',
  },
  {
    word: 'engiNEER',
    plain: 'engineer',
    ipa: '/ˌen.dʒəˈnɪr/',
    position: 'Stress suku kata ketiga',
  },
  {
    word: 'commuNIcation',
    plain: 'communication',
    ipa: '/kəˌmjuː.nəˈkeɪ.ʃən/',
    position: 'Stress suku kata keempat',
  },
] as const;

const PRACTICE_SENTENCE_SET = [
  {
    sentence: 'I BOOKED a hoTEL near the STAtion.',
    plain: 'I booked a hotel near the station.',
    ipa: '/aɪ bʊkt ə hoʊˈtel nɪr ðə ˈsteɪ.ʃən/',
  },
  {
    sentence: 'The engiNEER will reCORD the DAta.',
    plain: 'The engineer will record the data.',
    ipa: '/ði ˌen.dʒəˈnɪr wɪl rɪˈkɔrd ðə ˈdeɪ.tə/',
  },
  {
    sentence: 'CommuNIcation SKILLS are imPORtant toDAY.',
    plain: 'Communication skills are important today.',
    ipa: '/kəˌmjuː.nəˈkeɪ.ʃən skɪlz ɑr ɪmˈpɔr.tənt təˈdeɪ/',
  },
] as const;

const STRESSING_EVALUATION_PROMPT =
  "Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan kata dan kalimat yang saya ucapkan dalam rekaman ini. 2. Analisis pengucapan dengan fokus pada American Accent (General American), terutama word stress, sentence stress, ritme, serta kejelasan content words vs function words. 3. Format output: sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata/kalimat yang diucapkan. - Kolom 2: Status kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟡 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan'). - Kolom 3: Umpan balik spesifik yang menjelaskan bagian stress mana yang perlu diperbaiki.";

type SectionKey =
  | 'konsep'
  | 'dasarSukuKata'
  | 'tekananKata'
  | 'kontrasNounVerb'
  | 'tandaIpa'
  | 'aturanCepat'
  | 'bankKata'
  | 'kataKontenFungsi'
  | 'tekananKalimat'
  | 'alurCek'
  | 'kesalahanUmum'
  | 'catatanPenting'
  | 'practice'
  | 'prompt';

type AudioPlaySectionKey =
  | 'dasarSukuKata'
  | 'aturanCepat'
  | 'tekananKata'
  | 'kontrasNounVerb'
  | 'bankKata'
  | 'tekananKalimat'
  | 'kataKontenFungsi'
  | 'practice';

type IpaToggleSectionKey =
  | 'dasarSukuKata'
  | 'aturanCepat'
  | 'tekananKata'
  | 'kontrasNounVerb'
  | 'bankKata'
  | 'practice';

type PlaybackEntry = {
  itemKey: string;
  text: string;
};

const INITIAL_IPA_TOGGLE_STATE: Record<IpaToggleSectionKey, boolean> = {
  dasarSukuKata: false,
  aturanCepat: false,
  tekananKata: false,
  kontrasNounVerb: false,
  bankKata: false,
  practice: false,
};

const INITIAL_SECTION_STATE: Record<SectionKey, boolean> = {
  konsep: false,
  dasarSukuKata: false,
  tekananKata: false,
  kontrasNounVerb: false,
  tandaIpa: false,
  aturanCepat: false,
  bankKata: false,
  kataKontenFungsi: false,
  tekananKalimat: false,
  alurCek: false,
  kesalahanUmum: false,
  catatanPenting: false,
  practice: false,
  prompt: false,
};

const STRESSING_SECTION_STATE_KEY = 'stressing-open-sections-v1';
const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';

function renderStressHighlight(text: string) {
  const chunks: Array<{ text: string; highlighted: boolean }> = [];

  for (let index = 0; index < text.length; index += 1) {
    const ch = text[index];
    const prevChar = text[index - 1] ?? '';
    const nextChar = text[index + 1] ?? '';
    const isUppercase = /[A-Z]/.test(ch);
    const isSentenceCaseCapital =
      isUppercase &&
      (index === 0 || /[\s([{'"“‘]/.test(prevChar)) &&
      /[a-z]/.test(nextChar);
    const isStandalonePronounI =
      isUppercase &&
      ch === 'I' &&
      (index === 0 || /[\s([{'"“‘]/.test(prevChar)) &&
      !/[A-Za-z]/.test(nextChar);
    const highlighted = isUppercase && !isSentenceCaseCapital && !isStandalonePronounI;
    const normalized = highlighted ? ch.toLowerCase() : ch;
    const last = chunks[chunks.length - 1];

    if (last && last.highlighted === highlighted) {
      last.text += normalized;
    } else {
      chunks.push({ text: normalized, highlighted });
    }
  }

  return chunks.map((chunk, idx) =>
    chunk.highlighted ? (
      <span key={`${text}-${idx}`} className="stress-inline-highlight">
        {chunk.text}
      </span>
    ) : (
      <span key={`${text}-${idx}`}>{chunk.text}</span>
    ),
  );
}

function normalizeStressText(text: string) {
  return text.replace(/[A-Z]/g, (char) => char.toLowerCase()).replace(/\s*->\s*/g, ' to ');
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getSectionPlaybackEntries(sectionKey: AudioPlaySectionKey): PlaybackEntry[] {
  switch (sectionKey) {
    case 'dasarSukuKata':
      return SYLLABLE_EXAMPLES.map((item, index) => ({
        itemKey: `dasarSukuKata-${index}`,
        text: item.plain,
      }));
    case 'aturanCepat':
      return QUICK_RULES.flatMap((rule, ruleIndex) =>
        rule.examples.map((example, exampleIndex) => ({
          itemKey: `aturanCepat-${ruleIndex}-${exampleIndex}`,
          text: normalizeStressText(example.text),
        })),
      );
    case 'tekananKata':
      return WORD_STRESS_EXAMPLES.map((item, index) => ({
        itemKey: `tekananKata-${index}`,
        text: item.plain,
      }));
    case 'kontrasNounVerb':
      return NOUN_VERB_STRESS_CONTRAST.flatMap((item) => [
        {
          itemKey: `kontrasNounVerb-${item.base}-noun`,
          text: item.nounPlain,
        },
        {
          itemKey: `kontrasNounVerb-${item.base}-verb`,
          text: item.verbPlain,
        },
      ]);
    case 'bankKata':
      return STRESS_POSITION_BANK.flatMap((group, groupIndex) =>
        group.items.map((item, itemIndex) => {
          const [word] = item.split(' ');
          return {
            itemKey: `bankKata-${groupIndex}-${itemIndex}`,
            text: normalizeStressText(word),
          };
        }),
      );
    case 'tekananKalimat':
      return SENTENCE_STRESS_EXAMPLES.map((item, index) => ({
        itemKey: `tekananKalimat-${index}`,
        text: item.tts,
      }));
    case 'kataKontenFungsi':
      return CONTENT_FUNCTION_EXAMPLES.map((item, index) => ({
        itemKey: `kataKontenFungsi-${index}`,
        text: item.plain,
      }));
    case 'practice':
      return [
        ...PRACTICE_WORD_STRESS_SET.map((item, index) => ({
          itemKey: `practice-word-${index}`,
          text: item.plain,
        })),
        ...PRACTICE_SENTENCE_SET.map((item, index) => ({
          itemKey: `practice-sentence-${index}`,
          text: item.plain,
        })),
      ];
    default:
      return [];
  }
}

export default function StressingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    INITIAL_SECTION_STATE,
  );
  const [sectionStateReady, setSectionStateReady] = useState(false);
  const [showIpaBySection, setShowIpaBySection] = useState<Record<IpaToggleSectionKey, boolean>>(
    INITIAL_IPA_TOGGLE_STATE,
  );
  const [showContrastTranslation, setShowContrastTranslation] = useState(false);
  const [activePlayAllSection, setActivePlayAllSection] = useState<AudioPlaySectionKey | null>(
    null,
  );
  const [activeTtsItemKey, setActiveTtsItemKey] = useState<string | null>(null);
  const [isProgressSaved, setIsProgressSaved] = useState(false);
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const playAllTokenRef = useRef(0);
  const singlePlayTokenRef = useRef(0);
  const promptCopyTimeoutRef = useRef<number | null>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

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
      pronunciationProgress.stressing = percentage;
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
    delete pronunciationProgress.stressing;
    window.localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(pronunciationProgress));

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    dashboardProgress.pronunciation = calcPronunciationAverage(pronunciationProgress);
    window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
  }, [calcPronunciationAverage]);

  const setItemRef = useCallback((itemKey: string, node: HTMLElement | null) => {
    itemRefs.current[itemKey] = node;
  }, []);

  const scrollItemIntoView = useCallback((itemKey: string) => {
    const target = itemRefs.current[itemKey];
    if (!target) return;
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, []);

  const speakTextForQueue = useCallback((text: string): Promise<void> => {
    return speakText(text, {
      preferredEnglish: 'en-US',
      rate: 0.82,
      pitch: 1,
      volume: 1,
      cancelBeforeSpeak: false,
    });
  }, []);

  const stopAllTts = useCallback(() => {
    playAllTokenRef.current += 1;
    singlePlayTokenRef.current += 1;
    stopSpeech();
    setActivePlayAllSection(null);
    setActiveTtsItemKey(null);
  }, []);

  const playSingle = useCallback(
    async (text: string, itemKey: string) => {
      stopAllTts();
      const token = singlePlayTokenRef.current + 1;
      singlePlayTokenRef.current = token;
      setActiveTtsItemKey(itemKey);
      scrollItemIntoView(itemKey);
      await wait(80);
      if (singlePlayTokenRef.current !== token) return;
      await speakTextForQueue(text);
      if (singlePlayTokenRef.current === token) {
        setActiveTtsItemKey(null);
      }
    },
    [scrollItemIntoView, speakTextForQueue, stopAllTts],
  );

  const playAllBySection = useCallback(
    async (sectionKey: AudioPlaySectionKey) => {
      if (activePlayAllSection === sectionKey) {
        stopAllTts();
        return;
      }

      stopAllTts();
      const token = playAllTokenRef.current + 1;
      playAllTokenRef.current = token;
      setActivePlayAllSection(sectionKey);

      const entries = getSectionPlaybackEntries(sectionKey);

      for (const entry of entries) {
        if (playAllTokenRef.current !== token) break;
        setActiveTtsItemKey(entry.itemKey);
        scrollItemIntoView(entry.itemKey);
        await wait(120);
        if (playAllTokenRef.current !== token) break;
        await speakTextForQueue(entry.text);
        if (playAllTokenRef.current !== token) break;
        await wait(140);
      }

      if (playAllTokenRef.current === token) {
        setActivePlayAllSection(null);
        setActiveTtsItemKey(null);
      }
    },
    [activePlayAllSection, scrollItemIntoView, speakTextForQueue, stopAllTts],
  );

  function toggleSection(key: SectionKey) {
    const isClosingCurrentSection = activePlayAllSection === key && openSections[key];
    const isMovingToDifferentSection = Boolean(activePlayAllSection && activePlayAllSection !== key);

    if (isClosingCurrentSection || isMovingToDifferentSection) {
      stopAllTts();
    }

    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleIpaBySection(sectionKey: IpaToggleSectionKey) {
    setShowIpaBySection((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  }

  function toggleContrastTranslation() {
    setShowContrastTranslation((prev) => !prev);
  }

  const handleCopyPrompt = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(STRESSING_EVALUATION_PROMPT);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy stressing prompt:', error);
      setIsPromptCopied(false);
    }
  }, []);

  function renderAudioToolbar(
    sectionKey: AudioPlaySectionKey,
    ipaSectionKey?: IpaToggleSectionKey,
    translationToggle?: {
      show: boolean;
      onToggle: () => void;
      showLabel: string;
      hideLabel: string;
    },
  ) {
    const isPlaying = activePlayAllSection === sectionKey;
    const showIpa = ipaSectionKey ? showIpaBySection[ipaSectionKey] : false;
    return (
      <div className="stress-toolbar stress-toolbar--split">
        {ipaSectionKey || translationToggle ? (
          <div className="stress-toolbar-left">
            {ipaSectionKey ? (
              <button
                type="button"
                className={`stress-ipa-toggle-btn ${showIpa ? 'is-active' : ''}`}
                onClick={() => toggleIpaBySection(ipaSectionKey)}
                aria-pressed={showIpa}
              >
                {showIpa ? 'Sembunyikan IPA' : 'Tampilkan IPA'}
              </button>
            ) : null}
            {translationToggle ? (
              <button
                type="button"
                className={`stress-ipa-toggle-btn ${translationToggle.show ? 'is-active' : ''}`}
                onClick={translationToggle.onToggle}
                aria-pressed={translationToggle.show}
              >
                {translationToggle.show ? translationToggle.hideLabel : translationToggle.showLabel}
              </button>
            ) : null}
          </div>
        ) : (
          <span aria-hidden="true" />
        )}
        <button
          type="button"
          className="stress-playall-btn"
          onClick={() => void playAllBySection(sectionKey)}
        >
          {isPlaying ? 'Stop' : 'Play All'}
        </button>
      </div>
    );
  }

  function renderSectionHeader(key: SectionKey, title: string) {
    const isOpen = openSections[key];
    return (
      <h2 className="stress-block-title">
        <button
          type="button"
          className="stress-section-toggle"
          onClick={() => toggleSection(key)}
          aria-expanded={isOpen}
        >
          <span>{title}</span>
          <span
            className={`stress-section-indicator ${isOpen ? 'is-open' : ''}`}
            aria-hidden="true"
          />
        </button>
      </h2>
    );
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = window.localStorage.getItem(STRESSING_SECTION_STATE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Record<SectionKey, unknown>>;
        setOpenSections((prev) => {
          const next = { ...prev };
          for (const key of Object.keys(prev) as SectionKey[]) {
            if (typeof parsed[key] === 'boolean') {
              next[key] = parsed[key] as boolean;
            }
          }
          return next;
        });
      }
    } catch {
      // Ignore invalid storage payload and keep default closed state.
    } finally {
      setSectionStateReady(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const currentProgress = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      setIsProgressSaved(typeof currentProgress.stressing === 'number' && currentProgress.stressing > 0);
    } catch {
      setIsProgressSaved(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionStateReady) return;

    try {
      window.localStorage.setItem(STRESSING_SECTION_STATE_KEY, JSON.stringify(openSections));
    } catch {
      // Ignore storage write failures.
    }
  }, [openSections, sectionStateReady]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    void waitForVoices();

    return () => {
      stopAllTts();
    };
  }, [stopAllTts]);

  useEffect(
    () => () => {
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
    },
    [],
  );

  return (
    <div className="pronunciation-layout stress-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="stress-shell">
        <header className="stress-header">
          <h1 className="stress-title">Stressing</h1>
          <p className="stress-subtitle">
            Latihan tekanan kata dan tekanan kalimat agar ritme ucapan lebih alami.
          </p>
          <div className="stress-progress-actions">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="primary"
              topicName="Stressing"
            />
          </div>
        </header>

        <section className="stress-block">
          {renderSectionHeader('konsep', 'Concept')}
          {openSections.konsep && (
            <p className="stress-text">
              Bahasa Inggris adalah bahasa bertempo tekanan (stress-timed). Artinya, beberapa suku
              kata atau kata diucapkan lebih kuat dibanding yang lain. Tekanan yang tepat membuat
              ucapan lebih jelas dan terdengar alami.
            </p>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('dasarSukuKata', 'Syllable Basics and Beat')}
          {openSections.dasarSukuKata && (
            <>
              <p className="stress-text">
                <strong>Suku kata (syllable)</strong> adalah satu unit bunyi atau ketukan saat kata
                diucapkan. Sebelum belajar tekanan, kenali dulu jumlah suku kata dan
                pemenggalannya.
              </p>
              {renderAudioToolbar('dasarSukuKata', 'dasarSukuKata')}
              <div className="stress-syllable-grid">
                {SYLLABLE_EXAMPLES.map((item, index) => {
                  const itemKey = `dasarSukuKata-${index}`;
                  const isSpeaking = activeTtsItemKey === itemKey;
                  return (
                    <article
                      key={item.word + item.split}
                      className={`stress-syllable-card ${isSpeaking ? 'is-speaking' : ''}`}
                      ref={(node) => setItemRef(itemKey, node)}
                    >
                    <div className="stress-card-top">
                      <div className="stress-word-wrap">
                        <h3 className="stress-word">
                          <span className="stress-example-chip">
                            {renderStressHighlight(item.word)}
                          </span>
                        </h3>
                        {showIpaBySection.dasarSukuKata ? (
                          <p className="stress-ipa">{item.ipa}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="stress-play-chip-btn"
                        onClick={() => void playSingle(item.plain, itemKey)}
                        aria-label={`Putar ${item.plain}`}
                        title="Putar"
                      >
                        <span className="stress-play-chip-icon" aria-hidden="true" />
                        <span className="stress-visually-hidden">Putar</span>
                      </button>
                    </div>
                    <p className="stress-syllable-meta">
                      Pemisahan: {renderStressHighlight(item.split)}
                    </p>
                    <p className="stress-syllable-meta">Jumlah suku kata: {item.count}</p>
                    <p className="stress-card-note">{item.note}</p>
                    </article>
                  );
                })}
              </div>
              <ul className="stress-bullets">
                <li>- Cara cepat menghitung: dengarkan jumlah ketukan saat kata diucapkan.</li>
                <li>- Tepuk tangan per ketukan untuk membantu identifikasi suku kata.</li>
                <li>- Setelah jumlah suku kata jelas, tentukan suku kata yang mendapat tekanan.</li>
              </ul>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('tandaIpa', 'IPA Stress Symbols')}
          {openSections.tandaIpa && (
            <div className="stress-mark-grid">
              {IPA_STRESS_MARKS.map((item) => (
                <article key={item.mark + item.label} className="stress-mark-card">
                  <div className="stress-mark">{item.mark}</div>
                  <div>
                    <p className="stress-mark-label">{item.label}</p>
                    <p className="stress-mark-note">{item.note}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('aturanCepat', 'Word Stress Rules')}
          {openSections.aturanCepat && (
            <>
              {renderAudioToolbar('aturanCepat', 'aturanCepat')}
              <div className="stress-rule-grid">
                {QUICK_RULES.map((item, ruleIndex) => (
                  <article
                    key={item.title}
                    className={`stress-rule-card ${
                      activeTtsItemKey?.startsWith(`aturanCepat-${ruleIndex}-`) ? 'is-speaking' : ''
                    }`}
                  >
                  <h3 className="stress-rule-title">{item.title}</h3>
                  <p className="stress-rule-note">{item.note}</p>
                  <div className="stress-rule-examples">
                    {item.examples.map((example, exampleIndex) => {
                      const itemKey = `aturanCepat-${ruleIndex}-${exampleIndex}`;
                      const isSpeaking = activeTtsItemKey === itemKey;
                      return (
                        <div
                          key={`${item.title}-${example.text}`}
                          className={`stress-rule-example-item ${isSpeaking ? 'is-speaking' : ''}`}
                          ref={(node) => setItemRef(itemKey, node)}
                        >
                          <div className="stress-rule-example-text">
                            <span className="stress-example-chip">
                              {renderStressHighlight(example.text)}
                            </span>
                            {showIpaBySection.aturanCepat ? (
                              <p className="stress-ipa stress-ipa--inline">{example.ipa}</p>
                            ) : null}
                          </div>
                        <button
                          type="button"
                          className="stress-play-chip-btn"
                          onClick={() => void playSingle(normalizeStressText(example.text), itemKey)}
                          aria-label={`Putar ${normalizeStressText(example.text)}`}
                          title="Putar"
                        >
                          <span className="stress-play-chip-icon" aria-hidden="true" />
                          <span className="stress-visually-hidden">Putar</span>
                        </button>
                        </div>
                      );
                    })}
                  </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('tekananKata', 'Word Stress Examples')}
          {openSections.tekananKata && (
            <>
              {renderAudioToolbar('tekananKata', 'tekananKata')}
              <p className="stress-text">
                Fokuskan latihan pada posisi tekanan utama. Perhatikan juga kontras kata benda-kata
                kerja seperti <strong>REcord</strong> vs <strong>reCORD</strong>.
              </p>
              <div className="stress-grid">
                {WORD_STRESS_EXAMPLES.map((item, index) => {
                  const itemKey = `tekananKata-${index}`;
                  const isSpeaking = activeTtsItemKey === itemKey;
                  return (
                    <article
                      key={item.word}
                      className={`stress-card ${isSpeaking ? 'is-speaking' : ''}`}
                      ref={(node) => setItemRef(itemKey, node)}
                    >
                    <div className="stress-card-top">
                      <div className="stress-word-wrap">
                        <h3 className="stress-word">
                          <span className="stress-example-chip">
                            {renderStressHighlight(item.word)}
                          </span>
                        </h3>
                        {showIpaBySection.tekananKata ? (
                          <p className="stress-ipa">{item.ipa}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="stress-play-chip-btn"
                        onClick={() => void playSingle(item.plain, itemKey)}
                        aria-label={`Putar ${item.plain}`}
                        title="Putar"
                      >
                        <span className="stress-play-chip-icon" aria-hidden="true" />
                        <span className="stress-visually-hidden">Putar</span>
                      </button>
                    </div>
                    <p className="stress-card-type">{item.type}</p>
                    <p className="stress-card-note">{item.note}</p>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('kontrasNounVerb', 'Noun-Verb Stress Contrast')}
          {openSections.kontrasNounVerb && (
            <>
              {renderAudioToolbar('kontrasNounVerb', 'kontrasNounVerb', {
                show: showContrastTranslation,
                onToggle: toggleContrastTranslation,
                showLabel: 'Tampilkan Terjemah',
                hideLabel: 'Sembunyikan Terjemah',
              })}
              <p className="stress-text">
                Pada beberapa kata 2 suku kata, <strong>noun</strong> sering ditekan di awal,
                sedangkan <strong>verb</strong> di suku kata berikutnya.
              </p>
              <div className="stress-rule-grid">
                {NOUN_VERB_STRESS_CONTRAST.map((item) => (
                  <article
                    key={item.base}
                    className={`stress-rule-card ${
                      activeTtsItemKey?.startsWith(`kontrasNounVerb-${item.base}-`) ? 'is-speaking' : ''
                    }`}
                  >
                    <h3 className="stress-rule-title">{item.base.toUpperCase()}</h3>
                    <p className="stress-rule-note">{item.note}</p>
                    <div className="stress-rule-examples">
                      <div
                        className={`stress-rule-example-item ${
                          activeTtsItemKey === `kontrasNounVerb-${item.base}-noun` ? 'is-speaking' : ''
                        }`}
                        ref={(node) => setItemRef(`kontrasNounVerb-${item.base}-noun`, node)}
                      >
                        <div className="stress-rule-example-text">
                          <span className="stress-example-chip-row">
                            <span className="stress-example-chip-label">Noun:</span>
                            <span className="stress-example-chip">
                              {renderStressHighlight(item.noun)}
                            </span>
                          </span>
                          {showIpaBySection.kontrasNounVerb ? (
                            <p className="stress-ipa stress-ipa--inline">{item.nounIpa}</p>
                          ) : null}
                          <p className="stress-rule-example-sentence">{item.nounPlain}</p>
                          {showContrastTranslation ? (
                            <p className="stress-rule-example-translation">{item.nounId}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="stress-play-chip-btn"
                          onClick={() =>
                            void playSingle(item.nounPlain, `kontrasNounVerb-${item.base}-noun`)
                          }
                          aria-label={`Putar contoh noun ${item.base}`}
                          title="Putar"
                        >
                          <span className="stress-play-chip-icon" aria-hidden="true" />
                          <span className="stress-visually-hidden">Putar</span>
                        </button>
                      </div>
                      <div
                        className={`stress-rule-example-item ${
                          activeTtsItemKey === `kontrasNounVerb-${item.base}-verb` ? 'is-speaking' : ''
                        }`}
                        ref={(node) => setItemRef(`kontrasNounVerb-${item.base}-verb`, node)}
                      >
                        <div className="stress-rule-example-text">
                          <span className="stress-example-chip-row">
                            <span className="stress-example-chip-label">Verb:</span>
                            <span className="stress-example-chip">
                              {renderStressHighlight(item.verb)}
                            </span>
                          </span>
                          {showIpaBySection.kontrasNounVerb ? (
                            <p className="stress-ipa stress-ipa--inline">{item.verbIpa}</p>
                          ) : null}
                          <p className="stress-rule-example-sentence">{item.verbPlain}</p>
                          {showContrastTranslation ? (
                            <p className="stress-rule-example-translation">{item.verbId}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="stress-play-chip-btn"
                          onClick={() =>
                            void playSingle(item.verbPlain, `kontrasNounVerb-${item.base}-verb`)
                          }
                          aria-label={`Putar contoh verb ${item.base}`}
                          title="Putar"
                        >
                          <span className="stress-play-chip-icon" aria-hidden="true" />
                          <span className="stress-visually-hidden">Putar</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('bankKata', 'Practice Bank by Stress Position')}
          {openSections.bankKata && (
            <>
              {renderAudioToolbar('bankKata', 'bankKata')}
              <p className="stress-text">
                Berikut bank kata untuk latihan membedakan posisi tekanan utama pada suku kata
                pertama, kedua, ketiga, dan keempat.
              </p>
              <div className="stress-bank-grid">
                {STRESS_POSITION_BANK.map((group, groupIndex) => (
                  <article
                    key={group.title}
                    className={`stress-bank-card ${
                      activeTtsItemKey?.startsWith(`bankKata-${groupIndex}-`) ? 'is-speaking' : ''
                    }`}
                  >
                    <h3 className="stress-bank-title">{group.title}</h3>
                    <ul className="stress-bank-list">
                      {group.items.map((item, itemIndex) => {
                        const itemKey = `bankKata-${groupIndex}-${itemIndex}`;
                        const isSpeaking = activeTtsItemKey === itemKey;
                        const [word, ...ipaParts] = item.split(' ');
                        const ipaText = ipaParts.join(' ');
                        return (
                          <li key={`${group.title}-${item}`}>
                            <div
                              className={`stress-bank-item-row ${isSpeaking ? 'is-speaking' : ''}`}
                              ref={(node) => setItemRef(itemKey, node)}
                            >
                              <div className="stress-bank-item-main">
                                <span className="stress-bank-item-word stress-example-chip">
                                  {renderStressHighlight(word)}
                                </span>
                                {showIpaBySection.bankKata && ipaText ? (
                                  <p className="stress-ipa stress-ipa--inline">{ipaText}</p>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                className="stress-play-chip-btn"
                                onClick={() => void playSingle(normalizeStressText(word), itemKey)}
                                aria-label={`Putar ${normalizeStressText(word)}`}
                                title="Putar"
                              >
                                <span className="stress-play-chip-icon" aria-hidden="true" />
                                <span className="stress-visually-hidden">Putar</span>
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('tekananKalimat', 'Sentence Stress and Meaning Focus')}
          {openSections.tekananKalimat && (
            <>
              {renderAudioToolbar('tekananKalimat')}
              <div className="stress-list-wrap">
                {SENTENCE_STRESS_EXAMPLES.map((item, index) => {
                  const itemKey = `tekananKalimat-${index}`;
                  const isSpeaking = activeTtsItemKey === itemKey;
                  return (
                    <article
                      key={item.tts}
                      className={`stress-list-item ${isSpeaking ? 'is-speaking' : ''}`}
                      ref={(node) => setItemRef(itemKey, node)}
                    >
                      <div className="stress-list-item-main">
                        <p className="stress-sentence">
                          {item.tokens.map((token, idx) => (
                            <span
                              key={`${item.tts}-${idx}-${token.text}`}
                              className={`stress-token ${
                                'stressed' in token && token.stressed
                                  ? 'stress-token-strong'
                                  : 'weak' in token && token.weak
                                    ? 'stress-token-weak'
                                    : ''
                              }`}
                            >
                              {token.text}
                            </span>
                          ))}
                        </p>
                        <p className="stress-note">{item.note}</p>
                      </div>
                      <div className="stress-list-item-play-row">
                        <button
                          type="button"
                          className="stress-play-chip-btn"
                          onClick={() => void playSingle(item.tts, itemKey)}
                          aria-label={`Putar ${item.tts}`}
                          title="Putar"
                        >
                          <span className="stress-play-chip-icon" aria-hidden="true" />
                          <span className="stress-visually-hidden">Putar</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('kataKontenFungsi', 'Content vs Function Words')}
          {openSections.kataKontenFungsi && (
            <>
              {renderAudioToolbar('kataKontenFungsi')}
              <div className="stress-rule-grid">
                {CONTENT_FUNCTION_EXAMPLES.map((item, index) => {
                  const itemKey = `kataKontenFungsi-${index}`;
                  const isSpeaking = activeTtsItemKey === itemKey;
                  return (
                    <article
                      key={item.title}
                      className={`stress-rule-card ${isSpeaking ? 'is-speaking' : ''}`}
                      ref={(node) => setItemRef(itemKey, node)}
                    >
                  <h3 className="stress-rule-title">{item.title}</h3>
                  <p className="stress-rule-note">{item.note}</p>
                  <ul className="stress-bullets">
                    {item.points.map((point) => (
                      <li key={`${item.title}-${point}`}>- {point}</li>
                    ))}
                  </ul>
                  <div className="stress-rule-examples">
                    <div className={`stress-rule-example-item ${isSpeaking ? 'is-speaking' : ''}`}>
                      <p className="stress-sentence">
                        {item.tokens.map((token, idx) => (
                          <span
                            key={`${item.title}-${idx}-${token.text}`}
                            className={`stress-token ${
                              'stressed' in token && token.stressed
                                ? 'stress-token-strong'
                                : 'weak' in token && token.weak
                                  ? 'stress-token-weak'
                                  : ''
                            }`}
                          >
                            {token.text}
                          </span>
                        ))}
                      </p>
                      <button
                        type="button"
                        className="stress-play-chip-btn"
                        onClick={() => void playSingle(item.plain, itemKey)}
                        aria-label={`Putar ${item.plain}`}
                        title="Putar"
                      >
                        <span className="stress-play-chip-icon" aria-hidden="true" />
                        <span className="stress-visually-hidden">Putar</span>
                      </button>
                    </div>
                  </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('alurCek', 'Self-Check Workflow')}
          {openSections.alurCek && (
            <>
              <p className="stress-text">
                Gunakan alur ini setiap selesai latihan supaya perbaikan pronunciation lebih konsisten.
              </p>
              <ul className="stress-bullets">
                {SELF_CHECK_STEPS.map((step) => (
                  <li key={step}>- {step}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('kesalahanUmum', 'Common Mistakes and Fixes')}
          {openSections.kesalahanUmum && (
            <div className="stress-fix-grid">
              {COMMON_MISTAKES.map((item) => (
                <article key={item.wrong} className="stress-fix-card">
                  <p className="stress-fix-wrong">Salah: {item.wrong}</p>
                  <p className="stress-fix-correct">Benar: {item.correct}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('catatanPenting', 'Practice Tips')}
          {openSections.catatanPenting && (
            <ul className="stress-bullets">
              <li>- Latih satu kata berkali-kali sambil tepuk ritme suku kata.</li>
              <li>- Bandingkan pronunciation di kamus (IPA + audio) dengan ucapan sendiri.</li>
              <li>
                - Fokus kata inti saat tekanan kalimat (kata benda, kata kerja utama, kata sifat,
                kata keterangan).
              </li>
              <li>- Jangan terlalu menekan semua kata sekaligus.</li>
              <li>- Aturan cepat membantu, tetapi tetap cek pengecualian di kamus.</li>
            </ul>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('practice', 'Practice')}
          {openSections.practice && (
            <>
              {renderAudioToolbar('practice', 'practice')}
              <p className="stress-text">
                <strong>Mission:</strong>
                <br />
                Bacakan: 4 kata dengan posisi stress berbeda (pertama sampai keempat) dan 3 kalimat latihan.
              </p>

              <div className="stress-rule-grid">
                <article
                  className={`stress-rule-card ${
                    activeTtsItemKey?.startsWith('practice-word-') ? 'is-speaking' : ''
                  }`}
                >
                  <h3 className="stress-rule-title">4 Kata (Posisi Stress Berbeda)</h3>
                  <div className="stress-rule-examples">
                    {PRACTICE_WORD_STRESS_SET.map((item, index) => {
                      const itemKey = `practice-word-${index}`;
                      const isSpeaking = activeTtsItemKey === itemKey;
                      return (
                        <div
                          key={item.word}
                          className={`stress-rule-example-item ${isSpeaking ? 'is-speaking' : ''}`}
                          ref={(node) => setItemRef(itemKey, node)}
                        >
                          <div className="stress-rule-example-text">
                            <span className="stress-example-chip">
                              {renderStressHighlight(item.word)}
                            </span>
                            {showIpaBySection.practice ? (
                              <p className="stress-ipa stress-ipa--inline">{item.ipa}</p>
                            ) : null}
                            <p className="stress-rule-example-sentence">{item.position}</p>
                          </div>
                          <button
                            type="button"
                            className="stress-play-chip-btn"
                            onClick={() => void playSingle(item.plain, itemKey)}
                            aria-label={`Putar ${item.plain}`}
                            title="Putar"
                          >
                            <span className="stress-play-chip-icon" aria-hidden="true" />
                            <span className="stress-visually-hidden">Putar</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article
                  className={`stress-rule-card ${
                    activeTtsItemKey?.startsWith('practice-sentence-') ? 'is-speaking' : ''
                  }`}
                >
                  <h3 className="stress-rule-title">3 Kalimat Latihan</h3>
                  <div className="stress-rule-examples">
                    {PRACTICE_SENTENCE_SET.map((item, index) => {
                      const itemKey = `practice-sentence-${index}`;
                      const isSpeaking = activeTtsItemKey === itemKey;
                      return (
                        <div
                          key={item.sentence}
                          className={`stress-rule-example-item ${isSpeaking ? 'is-speaking' : ''}`}
                          ref={(node) => setItemRef(itemKey, node)}
                        >
                          <div className="stress-rule-example-text">
                            <p className="stress-sentence">{renderStressHighlight(item.sentence)}</p>
                            {showIpaBySection.practice ? (
                              <p className="stress-ipa stress-ipa--inline">{item.ipa}</p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            className="stress-play-chip-btn"
                            onClick={() => void playSingle(item.plain, itemKey)}
                            aria-label={`Putar ${item.plain}`}
                            title="Putar"
                          >
                            <span className="stress-play-chip-icon" aria-hidden="true" />
                            <span className="stress-visually-hidden">Putar</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>
            </>
          )}
        </section>

        <section className="stress-block">
          {renderSectionHeader('prompt', 'Prompt')}
          {openSections.prompt && (
            <div className="stress-prompt-card">
              <div className="stress-prompt-header">
                <p className="stress-prompt-title">Prompt Penilaian Stressing</p>
                <button
                  type="button"
                  onClick={() => void handleCopyPrompt()}
                  className="stress-prompt-copy-btn"
                  aria-label="Salin prompt"
                  title="Salin prompt"
                >
                  <Copy size={13} />
                  <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
                </button>
              </div>
              <p className="stress-prompt-quote">
                &quot;{STRESSING_EVALUATION_PROMPT}&quot;
              </p>
            </div>
          )}
        </section>
      </main>

      <RecordingControlsButton
        className="stress-recording-anchor"
        downloadFileName="stressing-GEUWAT-recording.wav"
      />
    </div>
  );
}
