// lib/tts/types.ts
// ============================================================
// TTS Type Definitions
// ============================================================

export type PreferredEnglishLang = 'en-US' | 'en-GB';

/**
 * Content type determines rate, preprocessing, and SSML hints.
 * - 'letter'      : single character, slowest rate
 * - 'word'        : single word, slow rate
 * - 'suffix'      : -s/es, -d/ed endings, slow + clear
 * - 'americanT'   : American T (flap/tap), slow + clear
 * - 'linking'     : linking words between two words, slightly slow
 * - 'contraction' : e.g. "don't", "I'm", normal-slow
 * - 'phrase'      : short phrase, normal-slow
 * - 'sentence'    : full sentence, normal rate
 * - 'stressing'   : word with stress emphasis, slow
 * - 'intonation'  : sentence with intonation pattern, slightly slow
 */
export type ContentType =
  | 'letter'
  | 'word'
  | 'suffix'
  | 'americanT'
  | 'linking'
  | 'contraction'
  | 'phrase'
  | 'sentence'
  | 'stressing'
  | 'intonation';

export type SpeakOptions = {
  lang?: string;
  preferEnglish?: boolean;
  preferredEnglish?: PreferredEnglishLang;
  contentType?: ContentType;
  rate?: number;       // base rate (overrides contentType default). Will be multiplied by global speed.
  pitch?: number;
  volume?: number;
  cancelBeforeSpeak?: boolean;
};

export type DebugInfo = {
  isSupported: boolean;
  userAgent: string;
  isXiaomi: boolean;
  isIOS: boolean;
  isSafari: boolean;
  voicesCount: number;
  voices: { name: string; lang: string; default: boolean }[];
};
