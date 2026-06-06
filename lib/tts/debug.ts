// lib/tts/debug.ts
// ============================================================
// TTS Debug and Diagnostic Utilities
// ============================================================

import type { DebugInfo } from './types';
import { isSpeechSynthesisSupported, isXiaomi, isIOS, isSafari } from './device-detection';
import { waitForVoices } from './voice-loading';

/**
 * Debug function to get device and TTS info.
 * Useful for troubleshooting device-specific issues (e.g., Xiaomi).
 */
export async function getDebugInfo(): Promise<DebugInfo> {
  const isSupported = isSpeechSynthesisSupported();
  
  if (!isSupported) {
    return {
      isSupported: false,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      isXiaomi: false,
      isIOS: false,
      isSafari: false,
      voicesCount: 0,
      voices: [],
    };
  }

  await waitForVoices();
  const voices = window.speechSynthesis.getVoices();

  return {
    isSupported: true,
    userAgent: navigator.userAgent,
    isXiaomi: isXiaomi(),
    isIOS: isIOS(),
    isSafari: isSafari(),
    voicesCount: voices.length,
    voices: voices.map(v => ({
      name: v.name,
      lang: v.lang,
      default: v.default,
    })),
  };
}
