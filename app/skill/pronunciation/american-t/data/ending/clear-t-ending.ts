import type { ClearTExample, SentenceNoteItem } from '../types';

type SentenceDrillFocusWord = string;

type ClearTEndingSentenceDrillExample = {
  id: string;
  text: string;
  ipa: string;
  focusWords: ReadonlyArray<SentenceDrillFocusWord>;
  ipaHighlightSymbols?: ReadonlyArray<string>;
};

export const CLEAR_T_ENDING_EXAMPLES: ReadonlyArray<ClearTExample> = [
  {
    text: 'cat',
    ipa: '/kæt/',
    note: 'Jika kata berhenti di akhir kalimat, /t/ bisa dibuat jelas dengan letupan ringan.',
  },
  {
    text: 'right',
    ipa: '/raɪt/',
    note: 'Jangan menahan terlalu lama; cukup tutup lalu lepas cepat.',
  },
  {
    text: 'seat',
    ipa: '/siːt/',
    note: 'Akhiran /t/ membantu kata terdengar lebih tegas dan jelas.',
  },
  {
    text: 'wait',
    ipa: '/weɪt/',
    note: 'Cocok untuk latihan kontras released /t/ vs unreleased /t̚/.',
  },
  {
    text: 'cut',
    ipa: '/kʌt/',
    note: 'Gunakan pelepasan kecil saat kata diucapkan sendiri.',
  },
  {
    text: 'about it',
    ipa: '/əˈbaʊt ɪt/',
    note: 'Saat kata berikutnya dimulai vokal, /t/ akhir dapat terdengar lebih jelas.',
  },
];

export const CLEAR_T_ENDING_SENTENCES: ReadonlyArray<SentenceNoteItem> = [
  {
    text: 'Say that word again: cat.',
    ipa: '/seɪ ðæt wɚd əˈɡɛn kæt/',
    note: 'Fokus pada letupan kecil /t/ di akhir.',
  },
  {
    text: 'Please wait a minute.',
    ipa: '/pliz weɪt ə ˈmɪnɪt/',
    note: 'Latih released /t/ pada wait sebelum lanjut kata berikutnya.',
  },
  {
    text: 'He was right about it.',
    ipa: '/hi wəz raɪt əˈbaʊt ɪt/',
    note: 'Kontraskan right (akhir kata) dan about it (sebelum vokal).',
  },
  {
    text: 'Take a seat and relax.',
    ipa: '/teɪk ə sit ænd rɪˈlæks/',
    note: 'Pastikan /t/ pada seat tetap terdengar.',
  },
  {
    text: 'Cut it and put it on the plate.',
    ipa: '/kʌt ɪt ænd pʊt ɪt ɑn ðə pleɪt/',
    note: 'Gunakan /t/ akhir jelas pada cut sebelum vokal.',
  },
];

export const CLEAR_T_ENDING_NOTES: ReadonlyArray<string> = [
  'Released /t/ di akhir kata sering muncul saat kata berdiri sendiri atau diberi penekanan.',
  'Jika kata berikutnya diawali konsonan, /t/ sering berubah menjadi unreleased /t̚/.',
  'Tujuan latihan: bisa memilih kapan /t/ dilepas jelas, kapan ditahan halus.',
];

export const CLEAR_T_ENDING_SENTENCE_DRILL_EXAMPLES_15: ReadonlyArray<ClearTEndingSentenceDrillExample> = [
  {
    id: 'ending-set-01',
    text: 'Say it once more: cat.',
    ipa: '/seɪ ɪt wʌns mɔr kæt/',
    focusWords: ['cat'],
  },
  {
    id: 'ending-set-02',
    text: 'Please wait outside for a bit.',
    ipa: '/pliz weɪt aʊtˈsaɪd fɔr ə bɪt/',
    focusWords: ['wait', 'bit'],
  },
  {
    id: 'ending-set-03',
    text: 'I got it right this time.',
    ipa: '/aɪ ɡɑt ɪt raɪt ðɪs taɪm/',
    focusWords: ['got', 'right'],
  },
  {
    id: 'ending-set-04',
    text: 'Put it on the hot plate.',
    ipa: '/pʊt ɪt ɑn ðə hɑt pleɪt/',
    focusWords: ['Put', 'hot', 'plate'],
  },
  {
    id: 'ending-set-05',
    text: 'We met at the west gate.',
    ipa: '/wi mɛt æt ðə wɛst ɡeɪt/',
    focusWords: ['met', 'west', 'gate'],
  },
  {
    id: 'ending-set-06',
    text: 'Do not cut the fruit yet.',
    ipa: '/du nɑt kʌt ðə frut jɛt/',
    focusWords: ['not', 'cut', 'yet'],
  },
  {
    id: 'ending-set-07',
    text: 'Take that note and write it.',
    ipa: '/teɪk ðæt noʊt ænd raɪt ɪt/',
    focusWords: ['that', 'note', 'write'],
  },
  {
    id: 'ending-set-08',
    text: 'She bought it and kept it.',
    ipa: '/ʃi bɔt ɪt ænd kɛpt ɪt/',
    focusWords: ['bought', 'kept'],
  },
  {
    id: 'ending-set-09',
    text: 'I set it on the desk.',
    ipa: '/aɪ sɛt ɪt ɑn ðə dɛsk/',
    focusWords: ['set'],
  },
  {
    id: 'ending-set-10',
    text: 'He left at nine.',
    ipa: '/hi lɛft æt naɪn/',
    focusWords: ['left'],
  },
  {
    id: 'ending-set-11',
    text: 'Read that part, not this part.',
    ipa: '/rid ðæt pɑrt nɑt ðɪs pɑrt/',
    focusWords: ['that', 'part', 'not'],
  },
  {
    id: 'ending-set-12',
    text: 'Hold that thought and act.',
    ipa: '/hoʊld ðæt θɔt ænd ækt/',
    focusWords: ['that', 'thought', 'act'],
  },
  {
    id: 'ending-set-13',
    text: 'They sent it back.',
    ipa: '/ðeɪ sɛnt ɪt bæk/',
    focusWords: ['sent'],
  },
  {
    id: 'ending-set-14',
    text: 'I forgot it, but I found it.',
    ipa: '/aɪ fɚɡɑt ɪt bʌt aɪ faʊnd ɪt/',
    focusWords: ['forgot', 'but'],
  },
  {
    id: 'ending-set-15',
    text: 'Sit up straight and wait.',
    ipa: '/sɪt ʌp streɪt ænd weɪt/',
    focusWords: ['Sit', 'straight', 'wait'],
  },
];

