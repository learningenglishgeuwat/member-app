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

// One sample per rule: /t/, /d/, /ɪd/
export const D_ED_APPLICATION_SCENES: ApplicationScene[] = [
  {
    id: 'rule-a',
    title: 'Rule A: Voiceless -> /t/',
    description: 'Jika bunyi terakhir voiceless (kecuali /t/), akhiran -ed dibaca /t/.',
    beforeWord: 'work',
    afterWord: 'worked',
    beforeIpa: '/w\u025C\u02D0rk/',
    afterIpa: '/w\u025C\u02D0rkt/',
    resultSound: '/t/',
    beforeWordTail: 'k',
    beforeIpaTail: 'k',
    highlightWordSuffix: 'ed',
    highlightIpaTail: 't',
    ruleHint: '/k/ adalah voiceless, jadi ending berubah ke /t/.',
    codeLine: 'if (lastSound in voicelessExceptT) ending = "/t/";',
  },
  {
    id: 'rule-b',
    title: 'Rule B: Voiced/Vowel -> /d/',
    description: 'Jika bunyi terakhir voiced (kecuali /d/) atau vokal, akhiran -ed dibaca /d/.',
    beforeWord: 'play',
    afterWord: 'played',
    beforeIpa: '/ple\u026A/',
    afterIpa: '/ple\u026Ad/',
    resultSound: '/d/',
    beforeWordTail: 'y',
    beforeIpaTail: 'e\u026A',
    highlightWordSuffix: 'ed',
    highlightIpaTail: 'd',
    ruleHint: 'Berakhir vokal /e\u026A/, jadi ending berbunyi /d/.',
    codeLine: 'else if (lastSound in voicedOrVowelExceptD) ending = "/d/";',
  },
  {
    id: 'rule-c',
    title: 'Rule C: /t/ or /d/ -> /\u026Ad/',
    description: 'Jika kata dasar berakhir bunyi /t/ atau /d/, akhiran -ed dibaca /\u026Ad/.',
    beforeWord: 'need',
    afterWord: 'needed',
    beforeIpa: '/ni\u02D0d/',
    afterIpa: '/ni\u02D0d\u026Ad/',
    resultSound: '/\u026Ad/',
    beforeWordTail: 'd',
    beforeIpaTail: 'd',
    highlightWordSuffix: 'ed',
    highlightIpaTail: '\u026Ad',
    ruleHint: 'Bunyi akhir /d/ memicu tambahan suku kata /\u026Ad/.',
    codeLine: 'else if (lastSound in ["/t/", "/d/"]) ending = "/\u026Ad/";',
  },
];
