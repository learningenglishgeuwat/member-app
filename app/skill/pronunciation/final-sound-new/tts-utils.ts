import {
  pickPreferredEnglishVoice,
  speakText,
  waitForVoices,
} from '@/lib/tts/speech';

export async function primeBestEnglishVoice() {
  await waitForVoices();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    pickPreferredEnglishVoice(window.speechSynthesis.getVoices(), 'en-US');
  }
}

export async function speakWithBestEnglishVoice(
  text: string,
  options?: { rate?: number; pitch?: number; volume?: number },
) {
  await speakText(text, {
    preferredEnglish: 'en-US',
    rate: options?.rate ?? 0.82,
    pitch: options?.pitch ?? 1,
    volume: options?.volume ?? 1,
    cancelBeforeSpeak: true,
  });
}

