// lib/tts/rate-config.ts
// ============================================================
// Speech Rate Configuration per Content Type
// ============================================================

import type { ContentType } from './types';

/**
 * Default speech rate per content type.
 * Range: 0.1 (slowest) – 10 (fastest). Normal = 1.
 * These values are tuned for English learner clarity.
 */
export const CONTENT_TYPE_RATE: Record<ContentType, number> = {
  letter:      0.7,   // slowest — single character must be heard clearly
  suffix:      0.75,  // -s/es -d/ed — needs to be distinct
  americanT:   0.75,  // flap T — slow so learner hears the difference
  stressing:   0.78,  // stress pattern — slightly slow for clarity
  word:        0.82,  // single word
  linking:     0.82,  // linking sound between words
  contraction: 0.85,  // don't / I'm / they've
  phrase:      0.88,  // short phrase
  intonation:  0.9,   // intonation pattern — close to natural
  sentence:    0.95,  // full sentence — near natural speed
};

/**
 * Global speed state (LocalStorage)
 */
export function getGlobalPlaybackSpeed(): number {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('tts_global_speed');
    if (val && !isNaN(Number(val))) return Number(val);
  }
  return 1;
}

export function setGlobalPlaybackSpeed(speed: number) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tts_global_speed', speed.toString());
  }
}
