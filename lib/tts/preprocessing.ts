// lib/tts/preprocessing.ts
// ============================================================
// Text Preprocessing for Speech Synthesis
// ============================================================

import type { ContentType } from './types';

/**
 * Preprocesses text before passing to TTS based on content type.
 * Adds spacing or punctuation tricks to help the engine pronounce correctly.
 */
export function preprocessTextForSpeech(text: string, contentType: ContentType): string {
  const t = text.trim();
  if (!t) return t;

  switch (contentType) {
    case 'letter':
      // Single letter: uppercase to prevent "eh" pronunciation on some engines
      // Add space after to prevent blending
      return t.toUpperCase();

    case 'suffix':
      // -s/es -d/ed: speak as a word, add slight pause before via comma trick
      // "walks" → say the full word slowly; for raw suffix like "-ed", wrap it
      if (t.startsWith('-')) {
        // Raw suffix like "-s", "-es", "-ed" — strip dash and say it
        return t.replace(/^-+/, '');
      }
      return t;

    case 'americanT':
      // American T (flap): no preprocessing needed — rate handles it
      // The TTS engine naturally produces flap T at slower rates on en-US voices
      return t;

    case 'linking':
      // Linking words: e.g. "an apple" — TTS handles naturally
      // Add punctuation pause if it's two separate items shown with underscore
      return t.replace(/_/g, ' ');

    case 'contraction':
      // Contractions: ensure apostrophe is standard (not curly)
      return t.replace(/[\u2018\u2019]/g, "'");

    case 'stressing':
      // Stressing: word with stress — spoken slowly, engine handles
      return t;

    case 'intonation':
      // Intonation: keep punctuation intact — it guides TTS pitch
      return t;

    case 'phrase':
    case 'sentence':
      // Ensure sentence ends with punctuation for natural intonation
      if (!/[.!?]$/.test(t)) return t + '.';
      return t;

    case 'word':
    default:
      return t;
  }
}
