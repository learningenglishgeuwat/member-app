type VocabularySpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
};

let waitingVoicesPromise: Promise<void> | null = null;

const HIGH_QUALITY_US_VOICE_NAMES = [
  'Google US English',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft Zira Online (Natural) - English (United States)',
  'Microsoft David Desktop',
  'Microsoft Zira Desktop',
  'Samantha',
  'Alex',
] as const;

function normalizeVoiceLang(lang: string): string {
  return lang.trim().toLowerCase().replace('_', '-');
}

function isUsEnglishVoice(voice: SpeechSynthesisVoice): boolean {
  return normalizeVoiceLang(voice.lang) === 'en-us';
}

function isEnglishVoice(voice: SpeechSynthesisVoice): boolean {
  return normalizeVoiceLang(voice.lang).startsWith('en');
}

function pickByExactNames(
  voices: SpeechSynthesisVoice[],
  names: readonly string[],
): SpeechSynthesisVoice | null {
  for (const name of names) {
    const matched = voices.find((voice) => voice.name === name);
    if (matched) return matched;
  }
  return null;
}

function getPreferredEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const usVoices = voices.filter(isUsEnglishVoice);
  const englishVoices = voices.filter(isEnglishVoice);

  const exactHighQualityUs = pickByExactNames(usVoices, HIGH_QUALITY_US_VOICE_NAMES);
  if (exactHighQualityUs) return exactHighQualityUs;

  const naturalUs = usVoices.find(
    (voice) => voice.name.includes('Microsoft') && voice.name.includes('Online (Natural)'),
  );
  if (naturalUs) return naturalUs;

  const googleUs = usVoices.find((voice) => voice.name.includes('Google'));
  if (googleUs) return googleUs;

  const appleUs = usVoices.find(
    (voice) => voice.name.includes('Samantha') || voice.name.includes('Alex'),
  );
  if (appleUs) return appleUs;

  if (usVoices.length > 0) return usVoices[0];

  const exactHighQualityEnglish = pickByExactNames(englishVoices, HIGH_QUALITY_US_VOICE_NAMES);
  if (exactHighQualityEnglish) return exactHighQualityEnglish;

  return (
    englishVoices.find(
      (voice) => voice.name.includes('Microsoft') && voice.name.includes('Online (Natural)'),
    ) ||
    englishVoices.find((voice) => voice.name.includes('Google')) ||
    englishVoices.find(
      (voice) => voice.name.includes('Samantha') || voice.name.includes('Alex') || voice.name.includes('Zira'),
    ) ||
    englishVoices[0] ||
    null
  );
}

function waitForVoices(timeoutMs = 1500): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve();
  }

  const synth = window.speechSynthesis;
  if (synth.getVoices().length > 0) return Promise.resolve();
  if (waitingVoicesPromise) return waitingVoicesPromise;

  waitingVoicesPromise = new Promise((resolve) => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      synth.removeEventListener('voiceschanged', onVoicesChanged);
      waitingVoicesPromise = null;
      resolve();
    };

    const onVoicesChanged = () => {
      if (synth.getVoices().length > 0) finish();
    };

    synth.addEventListener('voiceschanged', onVoicesChanged);
    synth.getVoices();
    window.setTimeout(finish, timeoutMs);
  });

  return waitingVoicesPromise;
}

export async function primeVocabularyVoice() {
  await waitForVoices();
  getPreferredEnglishVoice();
}

export function stopVocabularySpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}

export async function speakVocabularyText(
  text: string,
  options?: VocabularySpeakOptions,
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text.trim()) return;

  await waitForVoices();

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';

  const voice = getPreferredEnglishVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  utterance.rate = options?.rate ?? 0.84;
  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = options?.volume ?? 1;

  await new Promise<void>((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    synth.speak(utterance);
  });
}
