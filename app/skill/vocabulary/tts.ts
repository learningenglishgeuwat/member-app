import {
  pickPreferredEnglishVoice,
  speakText,
  stopSpeech,
  waitForVoices,
} from '@/lib/tts/speech';

type VocabularySpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
};

export async function primeVocabularyVoice() {
  await waitForVoices();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    pickPreferredEnglishVoice(window.speechSynthesis.getVoices(), 'en-US');
  }
}

export function stopVocabularySpeech() {
  stopSpeech();
}

export async function speakVocabularyText(
  text: string,
  options?: VocabularySpeakOptions,
) {
  await speakText(text, {
    preferredEnglish: 'en-US',
    rate: options?.rate ?? 0.84,
    pitch: options?.pitch ?? 1,
    volume: options?.volume ?? 1,
    cancelBeforeSpeak: true,
  });
}

