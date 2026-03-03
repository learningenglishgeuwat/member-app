export type GuideNormalizationRule = {
  pattern: RegExp;
  replacement: string;
  kind: 'synonym' | 'typo';
};

export const GUIDE_STOPWORDS = new Set([
  'apa',
  'itu',
  'jelaskan',
  'tentang',
  'yang',
  'dan',
  'dengan',
  'untuk',
  'tolong',
  'dong',
  'ya',
  'di',
  'ke',
  'the',
  'a',
  'an',
  'and',
  'to',
  'in',
  'on',
  'of',
  'is',
  'are',
]);

export const GUIDE_FOLLOW_UP_PHRASES = [
  'yang tadi',
  'lanjut',
  'lanjutkan',
  'contoh lain',
  'jelasin lagi',
  'jelaskan lagi',
  'yang itu',
];

export const GUIDE_INTENT_PATTERNS: Record<string, RegExp[]> = {
  word_explanation: [
    /\bapa arti\b/,
    /\bartinya\b/,
    /\barti kata\b/,
    /\bmeaning of\b/,
    /\bwhat does\b/,
    /\bjelasin kata\b/,
    /\bjelaskan kata\b/,
    /\bkata\b.*\bitu apa\b/,
  ],
  comparison: [/\bbeda\b/, /\bperbedaan\b/, /\bversus\b/, /\bvs\b/, /\bcompare\b/],
  how_to: [/\bcara\b/, /\bbagaimana\b/, /\bgimana\b/, /\bhow to\b/, /\bstep\b/],
  example_request: [/\bcontoh\b/, /\bexample\b/, /\bkalimat\b/, /\bsample\b/],
  direct_answer: [/\bapa itu\b/, /\bdefinisi\b/, /\bjelaskan\b/, /\bwhat is\b/, /\bitu apa\b/],
};

export const GUIDE_NORMALIZATION_RULES: GuideNormalizationRule[] = [
  { pattern: /\bkata kerja\b/g, replacement: 'verb', kind: 'synonym' },
  { pattern: /\bkata benda\b/g, replacement: 'noun', kind: 'synonym' },
  { pattern: /\bkata sifat\b/g, replacement: 'adjective', kind: 'synonym' },
  { pattern: /\bkata keterangan\b/g, replacement: 'adverb', kind: 'synonym' },
  { pattern: /\bkata ganti\b/g, replacement: 'pronoun', kind: 'synonym' },
  { pattern: /\bkata hubung\b/g, replacement: 'conjunction', kind: 'synonym' },
  { pattern: /\bpelafalan\b/g, replacement: 'pronunciation', kind: 'synonym' },
  { pattern: /\bfonetik\b/g, replacement: 'phonetic', kind: 'synonym' },
  { pattern: /\bintonasi\b/g, replacement: 'intonation', kind: 'synonym' },
  { pattern: /\baksen\b/g, replacement: 'accent', kind: 'synonym' },
  { pattern: /\bglotal\b/g, replacement: 'glottal', kind: 'typo' },
  { pattern: /\bunrelease\b/g, replacement: 'unreleased', kind: 'typo' },
  { pattern: /\bstressing\b/g, replacement: 'stress', kind: 'synonym' },
  { pattern: /\bgramar\b/g, replacement: 'grammar', kind: 'typo' },
  { pattern: /\bpronounciation\b/g, replacement: 'pronunciation', kind: 'typo' },
  { pattern: /\bpronnunciation\b/g, replacement: 'pronunciation', kind: 'typo' },
  { pattern: /\bcountabel\b/g, replacement: 'countable', kind: 'typo' },
  { pattern: /\buncountabel\b/g, replacement: 'uncountable', kind: 'typo' },
  { pattern: /\bfinalsound\b/g, replacement: 'final sound', kind: 'typo' },
  { pattern: /\bamrican\b/g, replacement: 'american', kind: 'typo' },
  { pattern: /\bamercan\b/g, replacement: 'american', kind: 'typo' },
  { pattern: /\bamerrican\b/g, replacement: 'american', kind: 'typo' },
  { pattern: /\bamerikan\b/g, replacement: 'american', kind: 'typo' },
];
