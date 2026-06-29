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
  preferredEnglish?: 'en-US' | 'en-GB';
};

const getPreferredEnglish = (): 'en-US' | 'en-GB' => {
  if (typeof window === 'undefined') return 'en-US';
  try {
    const stored = window.localStorage.getItem('geuwat:audio-accent');
    if (stored === 'en-US' || stored === 'en-GB') return stored;
  } catch {
    // ignore
  }
  return 'en-US';
};

export async function primeVocabularyVoice() {
  await waitForVoices();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    pickPreferredEnglishVoice(window.speechSynthesis.getVoices(), getPreferredEnglish());
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
    preferredEnglish: options?.preferredEnglish ?? getPreferredEnglish(),
    rate: options?.rate ?? 0.84,
    pitch: options?.pitch ?? 1,
    volume: options?.volume ?? 1,
    cancelBeforeSpeak: true,
  });
}

