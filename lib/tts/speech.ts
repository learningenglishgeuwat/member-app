// lib/tts/speech.ts
// ============================================================
// TTS Engine — Backward Compatibility Re-export
// This file maintains backward compatibility with existing imports.
// All functionality has been refactored into modular files.
// ============================================================

// Types
export type {
  PreferredEnglishLang,
  ContentType,
  SpeakOptions,
  DebugInfo,
} from './types';

// Device Detection
export {
  isIOS,
  isSafari,
  isXiaomi,
  isSpeechSynthesisSupported,
} from './device-detection';

// Rate Configuration
export {
  CONTENT_TYPE_RATE,
  getGlobalPlaybackSpeed,
  setGlobalPlaybackSpeed,
} from './rate-config';

// Text Preprocessing
export {
  preprocessTextForSpeech,
} from './preprocessing';

// Voice Selection
export {
  pickVoiceByLang,
  pickPreferredEnglishVoice,
} from './voice-selection';

// Voice Loading & Initialization
export {
  waitForVoices,
  initializeTTS,
  isTTSInitialized,
  forceResumeSpeech,
} from './voice-loading';

// Utterance Creation
export {
  createUtterance,
  stopSpeech,
} from './utterance';

// Main Speech Functions
export {
  speakText,
  speakTextWithPause,
  speakLetter,
  speakWord,
  speakSuffix,
  speakAmericanT,
  speakLinking,
  speakContraction,
  speakPhrase,
  speakSentence,
  speakStressing,
  speakIntonation,
} from './speak';

// Debug Utilities
export {
  getDebugInfo,
} from './debug';
