export interface SymbolSpeechProfile {
  prompt: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

const DEFAULT_SYMBOL_SPEECH_PROFILE: SymbolSpeechProfile = {
  prompt: '',
  rate: 0.72,
  pitch: 1,
  volume: 1,
};

export const SYMBOL_SPEECH_MAP: Record<string, SymbolSpeechProfile> = {
  // Vowel - lax
  '\u028c': { prompt: 'uh', rate: 0.58, pitch: 1.02 },
  '\u026a': { prompt: 'e', rate: 0.72 },
  '\u028a': { prompt: 'oo', rate: 0.98 },
  '\u025b': { prompt: 'eh', rate: 0.98 },
  '\u0259': { prompt: 'uh', rate: 0.94, pitch: 0.96, volume: 0.94 },
  '\u025a': { prompt: 'er', rate: 0.68 },

  // Vowel - tense
  '\u0251': { prompt: 'ah', rate: 0.7 },
  i: { prompt: 'ee', rate: 0.72 },
  u: { prompt: 'oo', rate: 0.42 },
  '\u00e6': { prompt: 'ae', rate: 0.72 },
  '\u0254': { prompt: 'aw', rate: 0.7 },

  // Consonant - voiceless
  p: { prompt: 'puh', rate: 0.68 },
  t: { prompt: 'tuh', rate: 0.68 },
  k: { prompt: 'kuh', rate: 0.68 },
  f: { prompt: 'fuh', rate: 0.65 },
  '\u03b8': { prompt: 'thuh', rate: 0.66 },
  s: { prompt: 'suh', rate: 0.64 },
  '\u0283': { prompt: 'shuh', rate: 0.64 },
  '\u02a7': { prompt: 'chuh', rate: 0.68 },
  h: { prompt: 'huu', rate: 0.64 },

  // Consonant - voiced
  b: { prompt: 'buh', rate: 0.68 },
  d: { prompt: 'duh', rate: 0.68 },
  g: { prompt: 'guh', rate: 0.68 },
  v: { prompt: 'vuh', rate: 0.65 },
  '\u00f0': { prompt: 'the', rate: 0.66 },
  z: { prompt: 'zoo', rate: 0.64 },
  '\u0292': { prompt: 'thus', rate: 0.64 },
  '\u02a4': { prompt: 'j', rate: 0.68 },
  l: { prompt: 'loo', rate: 0.64 },
  m: { prompt: 'moo', rate: 0.64 },
  n: { prompt: 'new', rate: 0.64 },
  '\u014b': { prompt: 'ng', rate: 0.66 },
  r: { prompt: 'roo', rate: 0.64 },
  w: { prompt: 'wuh', rate: 0.68 },
  y: { prompt: 'yuh', rate: 0.68 },

  // Diphthong
  'a\u026a': { prompt: 'I', rate: 0.66 },
  'e\u026a': { prompt: 'a', rate: 0.66 },
  '\u0254\u026a': { prompt: 'oi', rate: 0.66 },
  '\u026a\u0259': { prompt: 'e-uh', rate: 0.66 },
  'e\u0259': { prompt: 'eh-uh', rate: 0.66 },
  '\u028a\u0259': { prompt: 'oo-uh', rate: 0.66 },
  'o\u028a': { prompt: 'nou', rate: 0.66 },
  'a\u028a': { prompt: 'now', rate: 0.66 },
};

export function hasSymbolSpeechProfile(symbol: string): boolean {
  return Boolean(SYMBOL_SPEECH_MAP[symbol]);
}

export function getSymbolSpeechProfile(symbol: string): SymbolSpeechProfile {
  const mapped = SYMBOL_SPEECH_MAP[symbol];
  if (mapped) {
    return {
      ...DEFAULT_SYMBOL_SPEECH_PROFILE,
      ...mapped,
    };
  }

  return {
    ...DEFAULT_SYMBOL_SPEECH_PROFILE,
    prompt: symbol,
    rate: 0.62,
    pitch: 1,
    volume: 1,
  };
}
