// lib/tts/voice-loading.ts
// ============================================================
// Voice Loading and Initialization
// ============================================================

import { isSpeechSynthesisSupported, isXiaomi } from './device-detection';

let waitingVoicesPromise: Promise<void> | null = null;
let ttsInitialized = false;

/**
 * Waits until voices are loaded from the browser.
 *
 * Cross-browser behaviour:
 * - Chrome/Edge: async — fires `voiceschanged` event, getVoices() starts empty
 * - Firefox: sync — getVoices() already populated on first call
 * - Safari/iOS: `voiceschanged` may never fire — we poll + timeout as fallback
 * - Xiaomi/MIUI: May have delayed voice loading — increased timeout and aggressive polling
 *
 * Increased timeout to 5000ms + retry polling every 150ms for slow devices (Xiaomi).
 */
export function waitForVoices(timeoutMs = 5000): Promise<void> {
  if (!isSpeechSynthesisSupported()) return Promise.resolve();

  const synth = window.speechSynthesis;

  // Trigger Chrome's async load immediately
  synth.getVoices();

  // Firefox / already loaded
  if (synth.getVoices().length > 0) return Promise.resolve();

  // Return shared promise to avoid duplicate listeners
  if (waitingVoicesPromise) return waitingVoicesPromise;

  waitingVoicesPromise = new Promise((resolve) => {
    let settled = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const finish = () => {
      if (settled) return;
      settled = true;
      synth.removeEventListener('voiceschanged', onVoicesChanged);
      if (pollInterval) clearInterval(pollInterval);
      waitingVoicesPromise = null;
      resolve();
    };

    const onVoicesChanged = () => {
      if (synth.getVoices().length > 0) finish();
    };

    synth.addEventListener('voiceschanged', onVoicesChanged);

    // Polling fallback for Safari/iOS/Xiaomi where voiceschanged may not fire or be delayed
    // More aggressive polling (150ms) for slower devices like Xiaomi
    pollInterval = setInterval(() => {
      synth.getVoices(); // trigger lazy load
      if (synth.getVoices().length > 0) finish();
    }, 150);

    // Hard timeout — resolve even if no voices found (handles unsupported devices)
    window.setTimeout(finish, timeoutMs);
  });

  return waitingVoicesPromise;
}

/**
 * Initialize TTS with a dummy utterance.
 * Required on some Android devices (Xiaomi, Samsung) to "wake up" the TTS engine.
 * Must be called from a user gesture (click, touch).
 */
export async function initializeTTS(): Promise<boolean> {
  if (!isSpeechSynthesisSupported()) return false;
  if (ttsInitialized) return true;

  try {
    await waitForVoices(5000);
    
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    
    console.log('[TTS Init] Voices available:', voices.length);
    
    if (voices.length === 0) {
      console.warn('[TTS Init] No voices available after waiting');
      return false;
    }

    // Create a silent dummy utterance to initialize the engine
    const dummyUtterance = new SpeechSynthesisUtterance('');
    dummyUtterance.volume = 0; // Silent
    
    return new Promise((resolve) => {
      let resolved = false;
      
      const finish = (success: boolean) => {
        if (resolved) return;
        resolved = true;
        ttsInitialized = success;
        synth.cancel(); // Clean up
        console.log('[TTS Init]', success ? 'Success' : 'Failed');
        resolve(success);
      };

      dummyUtterance.onend = () => finish(true);
      dummyUtterance.onerror = () => finish(false);
      
      // Timeout after 2 seconds
      setTimeout(() => finish(true), 2000); // Consider it success even if no callback
      
      synth.speak(dummyUtterance);
    });
  } catch (error) {
    console.error('[TTS Init] Error:', error);
    return false;
  }
}

/**
 * Check if TTS has been initialized
 */
export function isTTSInitialized(): boolean {
  return ttsInitialized;
}

/**
 * Force resume speech synthesis (required on some Xiaomi devices).
 * MIUI browser sometimes pauses speechSynthesis internally.
 */
export function forceResumeSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  const synth = window.speechSynthesis;
  
  // Force resume if paused
  if (synth.paused) {
    console.log('[TTS] Speech was paused, resuming...');
    synth.resume();
  }
  
  // Some Xiaomi devices need this to "wake up" the engine
  if (isXiaomi() && !synth.speaking && !synth.pending) {
    // Trigger getVoices to wake up the engine
    synth.getVoices();
  }
}
