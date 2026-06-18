export const COMMON_LETTER_SYMBOL_ALIASES: Record<string, string[]> = {
  e: ['ɛ'],
  'ɛ': ['e'],
  'er': ['ɛr'],
  'ɛr': ['er', 'ɛr'],
  'ɪr': ['ɪr'],
  'ʊr': ['ʊr'],
  'əʊ': ['oʊ'],
  'oʊ': ['əʊ'],
  'tʃ': ['ʧ'],
  'ʧ': ['tʃ'],
  'dʒ': ['ʤ'],
  'ʤ': ['dʒ'],
  y: ['j'],
  j: ['y'],
};

export const BRITISH_NOTE_COUNTERPARTS: Record<string, string[]> = {
  'ɔ': ['ɑ'],
  'ɑ': ['ɔ'],
  'ɚ': ['ə'],
  'ə': ['ɚ'],
  'ɒ': ['ɑ', 'ɔ'],
};

// ====================================================================
// --- ARRAYS SIMBOL (URUTAN 100% LINIER SESUAI TABEL MASTER) ---
// ====================================================================

export const VOWEL_LAX_SYMBOLS = ['ʌ', 'ɪ', 'ʊ', 'ɛ', 'ə', 'ɚ'] as const;

export const VOWEL_TENSE_SYMBOLS = ['ɑ', 'i', 'u', 'æ', 'ɔ'] as const;

export const DIPHTHONG_SYMBOLS = ['aɪ', 'eɪ', 'ɔɪ', 'ɪr', 'ɛr', 'ʊr', 'oʊ', 'aʊ'] as const;

export const CONSONANT_VOICELESS_SYMBOLS = ['p', 't', 'k', 'f', 'θ', 's', 'ʃ', 'ʧ', 'h'] as const;

export const CONSONANT_VOICED_SYMBOLS = [
  'b', 'd', 'g', 'v', 'ð', 'z', 'ʒ', 'ʤ', 'l', 'm', 'n', 'ŋ', 'r', 'w', 'j',
] as const;

// ====================================================================
// --- CATATAN AKSEN BRITISH (URUTAN KEY MENGIKUTI TABEL MASTER) ---
// ====================================================================

export const BRITISH_NOTES_BY_SYMBOL: Record<string, {
  description: string;
  items: Array<{ word: string; britishIpa: string; americanIpa: string }>;
}> = {};