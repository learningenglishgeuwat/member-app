import type { WordExample } from '../types';

type SentenceDrillFocusWord = string;

type GlottalSentenceDrillItem = {
  text: string;
  ipa: string;
  note: string;
  focusWords: ReadonlyArray<SentenceDrillFocusWord>;
};

type GlottalSentenceDrillExample = {
  id: string;
  text: string;
  ipa: string;
  focusWords: ReadonlyArray<SentenceDrillFocusWord>;
};

export const GLOTTAL_STOP_EXAMPLES: ReadonlyArray<WordExample> = [
  {
    word: 'button',
    ipa: '/ˈbʌtən/',
    spoken: '/ˈbʌʔn̩/',
    note: 'Pada banyak aksen American casual, T sebelum /n/ bisa menjadi glottal stop /ʔ/.',
  },
  {
    word: 'mitten',
    ipa: '/ˈmɪtən/',
    spoken: '/ˈmɪʔn̩/',
    note: 'Tutup aliran udara singkat di glotis, lalu lanjut ke /n/.',
  },
  {
    word: 'kitten',
    ipa: '/ˈkɪtən/',
    spoken: '/ˈkɪʔn̩/',
    note: 'Bunyi /ʔ/ terdengar seperti jeda kecil, bukan /t/ letup.',
  },
  {
    word: 'written',
    ipa: '/ˈrɪtən/',
    spoken: '/ˈrɪʔn̩/',
    note: 'Pola ini sering muncul di percakapan cepat American English.',
  },
  {
    word: 'curtain',
    ipa: '/ˈkɝtən/',
    spoken: '/ˈkɝʔn̩/',
    note: 'Contoh tambahan untuk pola T + n pada ritme santai.',
  },
];

export const GLOTTAL_WORD_BANK: ReadonlyArray<string> = [
  'button',
  'kitten',
  'written',
  'curtain',
  'certain',
  'mitten',
  'cotton',
  'rotten',
  'bitten',
  'eaten',
  'beaten',
  'gotten',
  'forgotten',
  'satin',
  'britain',
  'mutton',
  'tighten',
  'brighten',
  'frighten',
  'lighten',
  'whiten',
  'sweeten',
  'flatten',
  'threaten',
  'straighten',
  'smitten',
  'fatten',
  'gluten',
  'manhattan',
  'newton',
  'buttons',
  'kittens',
  'mittens',
  'curtains',
  'outfit',
  'outcome',
  'outback',
  'outpost',
  'outburst',
  'hotdog',
  'notepad',
  'footnote',
  'catnip',
  'textbook',
];

export const GLOTTAL_WORD_BANK_IPA: Readonly<Record<string, string>> = {
  button: '/ˈbʌʔn̩/',
  kitten: '/ˈkɪʔn̩/',
  written: '/ˈrɪʔn̩/',
  curtain: '/ˈkɝʔn̩/',
  certain: '/ˈsɝʔn̩/',
  mitten: '/ˈmɪʔn̩/',
  cotton: '/ˈkɑʔn̩/',
  rotten: '/ˈrɑʔn̩/',
  bitten: '/ˈbɪʔn̩/',
  eaten: '/ˈiʔn̩/',
  beaten: '/ˈbiʔn̩/',
  gotten: '/ˈɡɑʔn̩/',
  forgotten: '/fɚˈɡɑʔn̩/',
  satin: '/ˈsæʔn̩/',
  britain: '/ˈbrɪʔn̩/',
  mutton: '/ˈmʌʔn̩/',
  tighten: '/ˈtaɪʔn̩/',
  brighten: '/ˈbraɪʔn̩/',
  frighten: '/ˈfraɪʔn̩/',
  lighten: '/ˈlaɪʔn̩/',
  whiten: '/ˈwaɪʔn̩/',
  sweeten: '/ˈswiʔn̩/',
  flatten: '/ˈflæʔn̩/',
  threaten: '/ˈθrɛʔn̩/',
  straighten: '/ˈstreɪʔn̩/',
  smitten: '/ˈsmɪʔn̩/',
  fatten: '/ˈfæʔn̩/',
  gluten: '/ˈɡluʔn̩/',
  manhattan: '/mænˈhæʔn̩/',
  newton: '/ˈnuʔn̩/',
  buttons: '/ˈbʌʔn̩z/',
  kittens: '/ˈkɪʔn̩z/',
  mittens: '/ˈmɪʔn̩z/',
  curtains: '/ˈkɝʔn̩z/',
  outfit: '/ˈaʊʔfɪt/',
  outcome: '/ˈaʊʔkʌm/',
  outback: '/ˈaʊʔbæk/',
  outpost: '/ˈaʊʔpoʊst/',
  outburst: '/ˈaʊʔbɝst/',
  hotdog: '/ˈhɑʔdɔɡ/',
  notepad: '/ˈnoʊʔpæd/',
  footnote: '/ˈfʊʔnoʊt/',
  catnip: '/ˈkæʔnɪp/',
  textbook: '/ˈtɛksʔbʊk/',
};

export const GLOTTAL_SENTENCES: ReadonlyArray<GlottalSentenceDrillItem> = [
  {
    text: 'Please button your coat now.',
    ipa: '/pliz bʌʔn jʊr koʊt naʊ/',
    note: 'Fokus glottal pada button di tempo natural.',
    focusWords: ['button'],
  },
  {
    text: 'The kitten is sleeping there.',
    ipa: '/ðə kɪʔn ɪz slipɪŋ ðɛr/',
    note: 'Gunakan jeda glotis singkat pada kitten.',
    focusWords: ['kitten'],
  },
  {
    text: 'I have written this already.',
    ipa: '/aɪ hæv rɪʔn ðɪs ɔlrɛdi/',
    note: 'Latih transisi glottal ke n pada written.',
    focusWords: ['written'],
  },
  {
    text: 'Close the curtain slowly.',
    ipa: '/kloʊz ðə kɝʔn sloʊli/',
    note: 'Perhatikan glottal ringan di tengah curtain.',
    focusWords: ['curtain'],
  },
  {
    text: 'This cotton shirt is soft.',
    ipa: '/ðɪs kɑʔn ʃɝt ɪz sɔft/',
    note: 'Latih pola glottal pada cotton.',
    focusWords: ['cotton'],
  },
  {
    text: 'He has forgotten his wallet.',
    ipa: '/hi hæz fərɡɑʔn hɪz wɑlɪt/',
    note: 'Glottal muncul pada forgotten dalam casual speech.',
    focusWords: ['forgotten'],
  },
];

export const GLOTTAL_SENTENCE_DRILL_EXAMPLES_15: ReadonlyArray<GlottalSentenceDrillExample> = [
  {
    id: 'glottal-set-01',
    text: 'Button your jacket before you go.',
    ipa: '/bʌʔn jʊr dʒækɪt bɪfɔr ju ɡoʊ/',
    focusWords: ['Button'],
  },
  {
    id: 'glottal-set-02',
    text: 'That kitten is under the table.',
    ipa: '/ðæt kɪʔn ɪz ʌndɚ ðə teɪbəl/',
    focusWords: ['kitten'],
  },
  {
    id: 'glottal-set-03',
    text: 'I have written the note already.',
    ipa: '/aɪ hæv rɪʔn ðə noʊt ɔlrɛdi/',
    focusWords: ['written'],
  },
  {
    id: 'glottal-set-04',
    text: 'Please open the curtain a little.',
    ipa: '/pliz oʊpən ðə kɝʔn ə lɪɾəl/',
    focusWords: ['curtain'],
  },
  {
    id: 'glottal-set-05',
    text: 'This cotton bag is very light.',
    ipa: '/ðɪs kɑʔn bæɡ ɪz vɛri laɪt/',
    focusWords: ['cotton'],
  },
  {
    id: 'glottal-set-06',
    text: 'The milk is rotten, do not drink it.',
    ipa: '/ðə mɪlk ɪz rɑʔn du nɑt drɪŋk ɪt/',
    focusWords: ['rotten'],
  },
  {
    id: 'glottal-set-07',
    text: 'He has bitten his lip again.',
    ipa: '/hi hæz bɪʔn hɪz lɪp əɡɛn/',
    focusWords: ['bitten'],
  },
  {
    id: 'glottal-set-08',
    text: 'They have gotten much better now.',
    ipa: '/ðeɪ hæv ɡɑʔn mʌtʃ bɛɾɚ naʊ/',
    focusWords: ['gotten'],
  },
  {
    id: 'glottal-set-09',
    text: 'I have forgotten the room number.',
    ipa: '/aɪ hæv fərɡɑʔn ðə rum nʌmbɚ/',
    focusWords: ['forgotten'],
  },
  {
    id: 'glottal-set-10',
    text: 'Let us brighten this corner first.',
    ipa: '/lɛt ʌs braɪʔn ðɪs kɔrnɚ fɝst/',
    focusWords: ['brighten'],
  },
  {
    id: 'glottal-set-11',
    text: 'Can you tighten this screw?',
    ipa: '/kæn ju taɪʔn ðɪs skru/',
    focusWords: ['tighten'],
  },
  {
    id: 'glottal-set-12',
    text: 'Do not frighten the little cat.',
    ipa: '/du nɑt fraɪʔn ðə lɪɾəl kæt/',
    focusWords: ['frighten'],
  },
  {
    id: 'glottal-set-13',
    text: 'Please flatten the paper gently.',
    ipa: '/pliz flæʔn ðə peɪpɚ dʒɛntli/',
    focusWords: ['flatten'],
  },
  {
    id: 'glottal-set-14',
    text: 'They will straighten the line.',
    ipa: '/ðeɪ wɪl streɪʔn ðə laɪn/',
    focusWords: ['straighten'],
  },
  {
    id: 'glottal-set-15',
    text: 'The curtains are closed now.',
    ipa: '/ðə kɝʔnz ɑr kloʊzd naʊ/',
    focusWords: ['curtains'],
  },
];
