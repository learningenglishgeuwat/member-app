export type ApplicationScene = {
  id: string;
  title: string;
  description: string;
  beforeWord: string;
  afterWord: string;
  beforeIpa: string;
  afterIpa: string;
  resultSound: string;
  beforeWordTail: string;
  beforeIpaTail: string;
  highlightWordSuffix: string;
  highlightIpaTail: string;
  ruleHint: string;
  codeLine: string;
};

export const MICRO_STEP_DURATION_MS = 1600;
export const TOTAL_STEPS_PER_SCENE = 4;

// One sample per rule: /s/, /z/, /ɪz/
export const S_ES_APPLICATION_SCENES: ApplicationScene[] = [
  {
    id: 'rule-a',
    title: 'Rule A: Voiceless -> /s/',
    description: 'Jika bunyi terakhir voiceless non-sibilant, akhiran dibaca /s/.',
    beforeWord: 'book',
    afterWord: 'books',
    beforeIpa: '/b\u028Ak/',
    afterIpa: '/b\u028Aks/',
    resultSound: '/s/',
    beforeWordTail: 'k',
    beforeIpaTail: 'k',
    highlightWordSuffix: 's',
    highlightIpaTail: 's',
    ruleHint: '/k/ adalah voiceless non-sibilant.',
    codeLine: 'if (lastSound in voicelessNonSibilant) ending = "/s/";',
  },
  {
    id: 'rule-b',
    title: 'Rule B: Voiced/Vowel -> /z/',
    description: 'Jika bunyi terakhir voiced non-sibilant atau vowel, akhiran dibaca /z/.',
    beforeWord: 'key',
    afterWord: 'keys',
    beforeIpa: '/ki\u02D0/',
    afterIpa: '/ki\u02D0z/',
    resultSound: '/z/',
    beforeWordTail: 'y',
    beforeIpaTail: 'i\u02D0',
    highlightWordSuffix: 's',
    highlightIpaTail: 'z',
    ruleHint: 'Vokal panjang /i\u02D0/ membuat ending berbunyi /z/.',
    codeLine: 'else if (lastSound in voicedOrVowel) ending = "/z/";',
  },
  {
    id: 'rule-c',
    title: 'Rule C: Sibilant + -es -> /\u026Az/',
    description: 'Jika kata dasar berakhir sibilant, gunakan -es dan bunyinya /\u026Az/.',
    beforeWord: 'watch',
    afterWord: 'watches',
    beforeIpa: '/w\u0252t\u0283/',
    afterIpa: '/w\u0252t\u0283\u026Az/',
    resultSound: '/\u026Az/',
    beforeWordTail: 'ch',
    beforeIpaTail: 't\u0283',
    highlightWordSuffix: 'es',
    highlightIpaTail: '\u026Az',
    ruleHint: '/t\u0283/ termasuk kelompok sibilant.',
    codeLine: 'else if (lastSound in sibilant) ending = "/\u026Az/"; // add -es',
  },
];
