import type { WordExample } from '../types';

type SentenceDrillItem = {
  text: string;
  ipa: string;
  note: string;
  focusWords: ReadonlyArray<string>;
};

type SentenceDrillExample = {
  id: string;
  text: string;
  ipa: string;
  focusWords: ReadonlyArray<string>;
};

export const FLAP_T_EXAMPLES: ReadonlyArray<WordExample> = [
  {
    word: 'water',
    ipa: '/ˈwɔtər/',
    spoken: '/ˈwɔɾɚ/',
    note: 'Flap T umum terjadi ketika /t/ berada di antara bunyi sonoran/vokal dan suku kata berikutnya tidak diberi stress utama.',
  },
  {
    word: 'city',
    ipa: '/ˈsɪti/',
    spoken: '/ˈsɪɾi/',
    note: 'Suku kata kedua tidak ditekan kuat, jadi bunyi T menjadi cepat dan ringan.',
  },
  {
    word: 'better',
    ipa: '/ˈbetər/',
    spoken: '/ˈbeɾɚ/',
    note: 'Pola paling umum untuk American T saat berbicara santai.',
  },
  {
    word: 'meeting',
    ipa: '/ˈmitɪŋ/',
    spoken: '/ˈmiɾɪŋ/',
    note: 'Bunyi /ɾ/ terdengar seperti D cepat, tetapi durasinya sangat singkat.',
  },
  {
    word: 'later',
    ipa: '/ˈleɪtər/',
    spoken: '/ˈleɪɾɚ/',
    note: 'Latih transisi vokal ke /ɾ/ supaya aliran bunyi tetap halus.',
  },
];

export const FLAP_T_WORD_BANK: ReadonlyArray<string> = [
  'water',
  'city',
  'better',
  'meeting',
  'later',
  'butter',
  'letter',
  'matter',
  'metal',
  'total',
  'motor',
  'native',
  'notice',
  'waiting',
  'eating',
  'writing',
  'fighting',
  'voting',
  'coating',
  'rating',
  'dating',
  'seating',
  'heater',
  'meter',
  'computer',
  'quality',
  'beauty',
  'duty',
  'pretty',
  'party',
  'forty',
  'dirty',
  'thirty',
  'eighty',
  'notable',
  'vital',
  'pity',
  'data',
  'creator',
  'editor',
  'potato',
  'tomato',
  'critical',
  'capital',
  'atom',
  'writer',
];

export const FLAP_T_WORD_BANK_IPA: Readonly<Record<string, string>> = {
  water: '/ˈwɔɾɚ/',
  city: '/ˈsɪɾi/',
  better: '/ˈbɛɾɚ/',
  meeting: '/ˈmiɾɪŋ/',
  later: '/ˈleɪɾɚ/',
  butter: '/ˈbʌɾɚ/',
  letter: '/ˈlɛɾɚ/',
  matter: '/ˈmæɾɚ/',
  metal: '/ˈmɛɾəl/',
  total: '/ˈtoʊɾəl/',
  motor: '/ˈmoʊɾɚ/',
  native: '/ˈneɪɾɪv/',
  notice: '/ˈnoʊɾɪs/',
  waiting: '/ˈweɪɾɪŋ/',
  eating: '/ˈiɾɪŋ/',
  writing: '/ˈraɪɾɪŋ/',
  fighting: '/ˈfaɪɾɪŋ/',
  voting: '/ˈvoʊɾɪŋ/',
  coating: '/ˈkoʊɾɪŋ/',
  rating: '/ˈreɪɾɪŋ/',
  dating: '/ˈdeɪɾɪŋ/',
  seating: '/ˈsiɾɪŋ/',
  heater: '/ˈhiɾɚ/',
  meter: '/ˈmiɾɚ/',
  computer: '/kəmˈpjuɾɚ/',
  quality: '/ˈkwɑləɾi/',
  beauty: '/ˈbjuɾi/',
  duty: '/ˈduɾi/',
  pretty: '/ˈprɪɾi/',
  party: '/ˈpɑɹɾi/',
  forty: '/ˈfɔɹɾi/',
  dirty: '/ˈdɝɾi/',
  thirty: '/ˈθɝɾi/',
  eighty: '/ˈeɪɾi/',
  notable: '/ˈnoʊɾəbəl/',
  vital: '/ˈvaɪɾəl/',
  pity: '/ˈpɪɾi/',
  data: '/ˈdeɪɾə/',
  creator: '/kriˈeɪɾɚ/',
  editor: '/ˈɛɾɪɾɚ/',
  potato: '/pəˈteɪɾoʊ/',
  tomato: '/təˈmeɪɾoʊ/',
  critical: '/ˈkrɪɾɪkəl/',
  capital: '/ˈkæpɪɾəl/',
  atom: '/ˈæɾəm/',
  writer: '/ˈraɪɾɚ/',
};

export const FLAP_T_SENTENCES: ReadonlyArray<SentenceDrillItem> = [
  {
    text: 'I drink water after class.',
    ipa: '/aɪ drɪŋk ˈwɔɾɚ ˈæftɚ klæs/',
    note: 'Fokus flap di water agar terdengar natural.',
    focusWords: ['water'],
  },
  {
    text: 'Your city is getting better.',
    ipa: '/jʊr ˈsɪɾi ɪz ˈɡɛɾɪŋ ˈbɛɾɚ/',
    note: 'Latih beberapa flap dalam satu kalimat.',
    focusWords: ['city', 'getting', 'better'],
  },
  {
    text: 'She wrote a better title.',
    ipa: '/ʃi roʊt ə ˈbɛɾɚ ˈtaɪɾəl/',
    note: 'Pertahankan ritme cepat pada better dan title.',
    focusWords: ['better', 'title'],
  },
  {
    text: 'We are meeting later tonight.',
    ipa: '/wi ɑr ˈmiɾɪŋ ˈleɪɾɚ təˈnaɪt/',
    note: 'Flap muncul jelas di meeting dan later.',
    focusWords: ['meeting', 'later'],
  },
  {
    text: 'The writer edited the data.',
    ipa: '/ðə ˈraɪɾɚ ˈɛɾɪɾəd ðə ˈdeɪɾə/',
    note: 'Jaga aliran cepat tanpa mengeras jadi /t/ penuh.',
    focusWords: ['writer', 'edited', 'data'],
  },
  {
    text: 'Put it on the table later.',
    ipa: '/pʊɾ ɪt ɑn ðə ˈteɪbəl ˈleɪɾɚ/',
    note: 'Flap pada put it dan later membantu bunyi conversational.',
    focusWords: ['Put it', 'table', 'later'],
  },
];

export const FLAP_T_SENTENCE_DRILL_EXAMPLES_15: ReadonlyArray<SentenceDrillExample> = [
  {
    id: 'flap-set-01',
    text: 'I need a bottle of water.',
    ipa: '/aɪ nid ə ˈbɑɾəl əv ˈwɔɾɚ/',
    focusWords: ['bottle', 'water'],
  },
  {
    id: 'flap-set-02',
    text: 'This city is getting better.',
    ipa: '/ðɪs ˈsɪɾi ɪz ˈɡɛɾɪŋ ˈbɛɾɚ/',
    focusWords: ['city', 'getting', 'better'],
  },
  {
    id: 'flap-set-03',
    text: 'I will meet you later.',
    ipa: '/aɪ wɪl mit ju ˈleɪɾɚ/',
    focusWords: ['later'],
  },
  {
    id: 'flap-set-04',
    text: 'He wrote a pretty letter.',
    ipa: '/hi roʊt ə ˈprɪɾi ˈlɛɾɚ/',
    focusWords: ['pretty', 'letter'],
  },
  {
    id: 'flap-set-05',
    text: 'The meeting starts at eight.',
    ipa: '/ðə ˈmiɾɪŋ stɑrts ət eɪt/',
    focusWords: ['meeting'],
  },
  {
    id: 'flap-set-06',
    text: 'Put the data on the table.',
    ipa: '/pʊɾ ðə ˈdeɪɾə ɑn ðə ˈteɪbəl/',
    focusWords: ['Put', 'data'],
  },
  {
    id: 'flap-set-07',
    text: 'My computer is a little slow.',
    ipa: '/maɪ kəmˈpjuɾɚ ɪz ə ˈlɪɾəl sloʊ/',
    focusWords: ['computer', 'little'],
  },
  {
    id: 'flap-set-08',
    text: 'The editor fixed the title.',
    ipa: '/ði ˈɛɾɪɾɚ fɪkst ðə ˈtaɪɾəl/',
    focusWords: ['editor', 'title'],
  },
  {
    id: 'flap-set-09',
    text: 'That was a better idea.',
    ipa: '/ðæt wəz ə ˈbɛɾɚ aɪˈdiə/',
    focusWords: ['better'],
  },
  {
    id: 'flap-set-10',
    text: 'I am writing a note later.',
    ipa: '/aɪ əm ˈraɪɾɪŋ ə noʊt ˈleɪɾɚ/',
    focusWords: ['writing', 'later'],
  },
  {
    id: 'flap-set-11',
    text: 'The waiter brought water quickly.',
    ipa: '/ðə ˈweɪɾɚ brɔt ˈwɔɾɚ ˈkwɪkli/',
    focusWords: ['waiter', 'water'],
  },
  {
    id: 'flap-set-12',
    text: 'Her party starts a little later.',
    ipa: '/hɚ ˈpɑrɾi stɑrts ə ˈlɪɾəl ˈleɪɾɚ/',
    focusWords: ['party', 'little', 'later'],
  },
  {
    id: 'flap-set-13',
    text: 'The motor is making a noise.',
    ipa: '/ðə ˈmoʊɾɚ ɪz ˈmeɪkɪŋ ə nɔɪz/',
    focusWords: ['motor'],
  },
  {
    id: 'flap-set-14',
    text: 'Can you notice the pattern?',
    ipa: '/kæn ju ˈnoʊɾəs ðə ˈpæɾɚn/',
    focusWords: ['notice', 'pattern'],
  },
  {
    id: 'flap-set-15',
    text: 'The writer will edit it later.',
    ipa: '/ðə ˈraɪɾɚ wɪl ˈɛɾɪt ɪt ˈleɪɾɚ/',
    focusWords: ['writer', 'edit', 'later'],
  },
];
