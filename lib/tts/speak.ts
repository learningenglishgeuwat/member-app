// lib/tts/speak.ts
// ============================================================
// Main Speech Synthesis Functions
// ============================================================

import type { SpeakOptions, PreferredEnglishLang, ContentType } from './types';
import { isSpeechSynthesisSupported, isIOS, isSafari, isXiaomi } from './device-detection';
import { createUtterance } from './utterance';
import { waitForVoices, initializeTTS, isTTSInitialized, forceResumeSpeech } from './voice-loading';

function isNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Cancels speech and waits for a safe delay before the next speak call.
 *
 * Safari/iOS: cancel() is asynchronous internally — speaking immediately
 * after cancel causes the new utterance to be silently dropped.
 * Xiaomi/MIUI: Similar async cancel behavior — needs longer delay.
 * Delay: 150ms on iOS/Safari/Xiaomi, 20ms on others (still catches Chrome edge cases).
 */
async function safeCancelAndWait(): Promise<void> {
  window.speechSynthesis.cancel();
  const delayMs = isIOS() || isSafari() || isXiaomi() ? 150 : 20;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

/**
 * Main speak function.
 *
 * Features:
 * - Auto-initialization for Android/Xiaomi devices
 * - Always cancels before speaking (prevents queue buildup on Android/iOS)
 * - Safe cancel delay for Safari/iOS/Xiaomi
 * - Per-utterance timeout (20s) prevents stuck playback
 * - Retry mechanism for Xiaomi devices that fail on first attempt
 * - Error logging without breaking the caller
 * - Cross-browser voice loading handled via waitForVoices()
 */
export async function speakText(
  text: string,
  options?: SpeakOptions,
): Promise<void> {
  if (!isSpeechSynthesisSupported()) return;
  if (!isNonEmptyText(text)) return;

  // Auto-initialize TTS for Xiaomi/Android devices
  if (!isTTSInitialized() && isXiaomi()) {
    console.log('[TTS] Auto-initializing for Xiaomi device...');
    await initializeTTS();
  }

  await waitForVoices();

  const utterance = createUtterance(text, options);
  if (!utterance) return;

  const synth = window.speechSynthesis;

  // Force resume for Xiaomi devices (MIUI sometimes pauses speech internally)
  if (isXiaomi()) {
    forceResumeSpeech();
  }

  // Always cancel before speak — prevents queue buildup on Android / rapid clicks
  // cancelBeforeSpeak: false is intentionally NOT supported to avoid OS-level bugs
  const shouldCancel = options?.cancelBeforeSpeak ?? true;
  if (shouldCancel) {
    await safeCancelAndWait();
  }

  // Per-utterance timeout — 20s covers even the slowest multi-word utterances on slower devices (Xiaomi).
  // If the engine hangs (Android WebView, Samsung Internet, MIUI), we resolve without cancel
  // to avoid cutting off utterances that are still playing.
  const MAX_UTTERANCE_MS = 20_000;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isResolved = false;
  let didSpeak = false;

  const attemptSpeak = () => {
    return new Promise<void>((resolve) => {
      utterance.onend = () => {
        if (isResolved) return;
        isResolved = true;
        didSpeak = true;
        if (timeoutId) clearTimeout(timeoutId);
        resolve();
      };
      utterance.onerror = (event) => {
        if (isResolved) return;
        isResolved = true;
        if (timeoutId) clearTimeout(timeoutId);
        // 'interrupted' is not a real error — it means cancel() was called
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.error('[TTS] SpeechSynthesisErrorEvent:', event.error, '| text:', text);
        }
        resolve();
      };
      
      // Add onstart handler to detect if speech actually started
      utterance.onstart = () => {
        didSpeak = true;
        console.log('[TTS] Speech started:', text.substring(0, 30));
      };
      
      synth.speak(utterance);
    });
  };

  await Promise.race([
    attemptSpeak(),
    new Promise<void>((resolve) => {
      timeoutId = setTimeout(() => {
        if (isResolved) return;
        isResolved = true;
        console.warn('[TTS] Utterance timed out after', MAX_UTTERANCE_MS, 'ms — resolving without cancel to avoid cutting off speech.');
        resolve();
      }, MAX_UTTERANCE_MS);
    }),
  ]);

  // Retry once for Xiaomi devices if speech didn't start
  if (!didSpeak && isXiaomi()) {
    console.log('[TTS] Speech did not start on Xiaomi, retrying after delay...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Reset flags for retry
    isResolved = false;
    didSpeak = false;
    timeoutId = null;
    
    // Create new utterance for retry
    const retryUtterance = createUtterance(text, options);
    if (retryUtterance) {
      await Promise.race([
        new Promise<void>((resolve) => {
          retryUtterance.onend = () => {
            if (isResolved) return;
            isResolved = true;
            if (timeoutId) clearTimeout(timeoutId);
            resolve();
          };
          retryUtterance.onerror = (event) => {
            if (isResolved) return;
            isResolved = true;
            if (timeoutId) clearTimeout(timeoutId);
            if (event.error !== 'interrupted' && event.error !== 'canceled') {
              console.error('[TTS] Retry error:', event.error);
            }
            resolve();
          };
          retryUtterance.onstart = () => {
            console.log('[TTS] Retry speech started successfully');
          };
          synth.speak(retryUtterance);
        }),
        new Promise<void>((resolve) => {
          timeoutId = setTimeout(() => {
            if (isResolved) return;
            isResolved = true;
            console.warn('[TTS] Retry also timed out');
            resolve();
          }, MAX_UTTERANCE_MS);
        }),
      ]);
    }
  }
}

function addWordPauseForSpeech(text: string): string {
  const normalizedText = text.trim().replace(/\s+/g, ' ');
  if (!normalizedText.includes(' ')) return normalizedText;
  return normalizedText.split(' ').join(', ');
}

export async function speakTextWithPause(
  text: string,
  options?: SpeakOptions,
): Promise<void> {
  if (!isSpeechSynthesisSupported()) return;
  if (!isNonEmptyText(text)) return;

  const speechText = addWordPauseForSpeech(text);
  await speakText(speechText, {
    ...options,
    cancelBeforeSpeak: options?.cancelBeforeSpeak ?? false,
  });
}

// ─────────────────────────────────────────────
// CONVENIENCE SPEAK FUNCTIONS PER TYPE
// ─────────────────────────────────────────────

/**
 * Factory function to create type-specific speak functions.
 * Reduces code duplication for similar wrapper functions.
 */
const createSpeaker = (
  contentType: ContentType,
  defaultPreferredEnglish: PreferredEnglishLang = 'en-US'
) => 
  async (text: string, preferredEnglish: PreferredEnglishLang = defaultPreferredEnglish): Promise<void> => {
    await speakText(text, { contentType, preferredEnglish });
  };

export const speakLetter = createSpeaker('letter');
export const speakWord = createSpeaker('word');
export const speakSuffix = createSpeaker('suffix');
export const speakAmericanT = createSpeaker('americanT', 'en-US'); // American T always uses en-US
export const speakLinking = createSpeaker('linking');
export const speakContraction = createSpeaker('contraction');
export const speakPhrase = createSpeaker('phrase');
export const speakSentence = createSpeaker('sentence');
export const speakStressing = createSpeaker('stressing');
export const speakIntonation = createSpeaker('intonation');
