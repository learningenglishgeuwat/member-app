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
  // ==========================================
  // 1. VOWEL - LAX
  // ==========================================
  'ʌ': { prompt: 'uh', rate: 0.58, pitch: 1.02 },
  'ɪ': { prompt: 'e', rate: 0.72 },
  'ʊ': { prompt: 'oo', rate: 0.98 },
  'ɛ': { prompt: 'eh', rate: 0.98 },
  'ə': { prompt: 'uh', rate: 0.94, pitch: 0.96, volume: 0.94 },
  'ɚ': { prompt: 'er', rate: 0.68 },

  // ==========================================
  // 2. VOWEL - TENSE
  // ==========================================
  'ɑ': { prompt: 'ah', rate: 0.7 },
  'i': { prompt: 'ee', rate: 0.72 },
  'u': { prompt: 'oo', rate: 0.42 },
  'æ': { prompt: 'ae', rate: 0.72 },
  'ɔ': { prompt: 'aw', rate: 0.7 },

  // ==========================================
  // 3. DIPHTHONG
  // ==========================================
  'aɪ': { prompt: 'I', rate: 0.66 },
  'eɪ': { prompt: 'a', rate: 0.66 },
  'ɔɪ': { prompt: 'oi', rate: 0.66 },
  'ɪr': { prompt: 'eer', rate: 0.66 },
  'ɛr': { prompt: 'air', rate: 0.66 },
  'ʊr': { prompt: 'oor', rate: 0.66 },
  'oʊ': { prompt: 'nou', rate: 0.66 },
  'aʊ': { prompt: 'now', rate: 0.66 },

  // ==========================================
  // 4. CONSONANT - VOICELESS
  // ==========================================
  'p': { prompt: 'puh', rate: 0.68 },
  't': { prompt: 'tuh', rate: 0.68 },
  'k': { prompt: 'kuh', rate: 0.68 },
  'f': { prompt: 'fuh', rate: 0.65 },
  'θ': { prompt: 'thuh', rate: 0.66 },
  's': { prompt: 'suh', rate: 0.64 },
  'ʃ': { prompt: 'shuh', rate: 0.64 },
  'ʧ': { prompt: 'chuh', rate: 0.68 },
  'h': { prompt: 'huu', rate: 0.64 },

  // ==========================================
  // 5. CONSONANT - VOICED
  // ==========================================
  'b': { prompt: 'buh', rate: 0.68 },
  'd': { prompt: 'duh', rate: 0.68 },
  'g': { prompt: 'guh', rate: 0.68 },
  'v': { prompt: 'vuh', rate: 0.65 },
  'ð': { prompt: 'the', rate: 0.66 },
  'z': { prompt: 'zoo', rate: 0.64 },
  'ʒ': { prompt: 'thus', rate: 0.64 },
  'ʤ': { prompt: 'j', rate: 0.68 },
  'l': { prompt: 'loo', rate: 0.64 },
  'm': { prompt: 'moo', rate: 0.64 },
  'n': { prompt: 'new', rate: 0.64 },
  'ŋ': { prompt: 'ng', rate: 0.66 },
  'r': { prompt: 'roo', rate: 0.64 },
  'w': { prompt: 'wuh', rate: 0.68 },
  'j': { prompt: 'yuh', rate: 0.68 },
};

/**
 * Menormalisasi input simbol ke master key tunggal yang valid
 */
function normalizeSymbolKey(symbol: string): string {
  const s = symbol.trim();
  if (s === 'dʒ') return 'ʤ';
  if (s === 'tʃ') return 'ʧ';
  if (s === 'y') return 'j';
  if (s === 'eə' || s === 'er') return 'ɛr';
  if (s === 'ɪə' || s === 'iə') return 'ɪr';
  if (s === 'ʊə') return 'ʊr';
  return s;
}

export function hasSymbolSpeechProfile(symbol: string): boolean {
  const normalizedKey = normalizeSymbolKey(symbol);
  return Boolean(SYMBOL_SPEECH_MAP[normalizedKey]);
}

export function getSymbolSpeechProfile(symbol: string): SymbolSpeechProfile {
  const normalizedKey = normalizeSymbolKey(symbol);
  const mapped = SYMBOL_SPEECH_MAP[normalizedKey];
  
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