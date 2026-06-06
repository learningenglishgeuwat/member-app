// lib/tts/utterance.ts
// ============================================================
// Utterance Creation and Management
// ============================================================

import type { SpeakOptions } from './types';
import { isSpeechSynthesisSupported } from './device-detection';
import { preprocessTextForSpeech } from './preprocessing';
import { CONTENT_TYPE_RATE, getGlobalPlaybackSpeed } from './rate-config';
import { pickVoiceByLang, pickPreferredEnglishVoice } from './voice-selection';

function isNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Creates a SpeechSynthesisUtterance configured with the given options.
 * Handles voice selection, preprocessing, and rate calculation.
 */
export function createUtterance(
  text: string,
  options?: SpeakOptions,
): SpeechSynthesisUtterance | null {
  if (!isSpeechSynthesisSupported()) return null;
  if (!isNonEmptyText(text)) return null;

  // Preprocess text based on content type
  const contentType = options?.contentType ?? 'word';
  const processedText = preprocessTextForSpeech(text, contentType);

  const utterance = new SpeechSynthesisUtterance(processedText);

  const targetLang =
    options?.lang && options.lang.trim() ? options.lang : 'en-US';
  const preferEnglish = options?.preferEnglish ?? true;
  const preferredEnglish = options?.preferredEnglish ?? 'en-US';
  const voices = window.speechSynthesis.getVoices();

  let selectedVoice: SpeechSynthesisVoice | null = null;
  if (options?.lang) {
    selectedVoice = pickVoiceByLang(voices, options.lang);
  } else if (preferEnglish) {
    selectedVoice =
      pickPreferredEnglishVoice(voices, preferredEnglish) ??
      pickVoiceByLang(voices, targetLang);
  } else {
    selectedVoice = pickVoiceByLang(voices, targetLang);
  }

  utterance.lang = targetLang;
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  }

  // Rate: base rate (explicit or content-type default) * global speed multiplier
  const globalSpeed = getGlobalPlaybackSpeed();
  const baseRate = options?.rate !== undefined ? options.rate : CONTENT_TYPE_RATE[contentType];
  utterance.rate = baseRate * globalSpeed;

  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = options?.volume ?? 1;

  return utterance;
}

/**
 * Stops all ongoing speech synthesis
 */
export function stopSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}
