export type PreferredEnglishLang = 'en-US' | 'en-GB';

export type SpeakOptions = {
  lang?: string;
  preferEnglish?: boolean;
  preferredEnglish?: PreferredEnglishLang;
  rate?: number;
  pitch?: number;
  volume?: number;
  cancelBeforeSpeak?: boolean;
};

const HIGH_QUALITY_EN_US_VOICE_NAMES = [
  'Google US English',
  'Google US English Male',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft Zira Online (Natural) - English (United States)',
  'Microsoft David Desktop',
  'Microsoft Zira Desktop',
  'Samantha',
  'Alex',
] as const;

const HIGH_QUALITY_EN_GB_VOICE_NAMES = [
  'Google UK English Female',
  'Google UK English Male',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  'Microsoft Ryan Online (Natural) - English (United Kingdom)',
  'Microsoft Hazel Desktop - English (Great Britain)',
] as const;

let waitingVoicesPromise: Promise<void> | null = null;

function normalizeLang(lang: string): string {
  return lang.trim().toLowerCase().replace('_', '-');
}

function getLangPrefix(lang: string): string {
  const [prefix] = normalizeLang(lang).split('-');
  return prefix ?? '';
}

function isNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
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

function pickEnglishVoiceFromCandidates(
  voices: SpeechSynthesisVoice[],
  preferred: PreferredEnglishLang,
): SpeechSynthesisVoice | null {
  const normalizedPreferred = normalizeLang(preferred);
  const preferredVoices = voices.filter(
    (voice) => normalizeLang(voice.lang) === normalizedPreferred,
  );
  const englishVoices = voices.filter((voice) =>
    normalizeLang(voice.lang).startsWith('en'),
  );

  const exactPreferred =
    preferred === 'en-US'
      ? pickByExactNames(preferredVoices, HIGH_QUALITY_EN_US_VOICE_NAMES)
      : pickByExactNames(preferredVoices, HIGH_QUALITY_EN_GB_VOICE_NAMES);
  if (exactPreferred) return exactPreferred;

  const naturalPreferred = preferredVoices.find(
    (voice) =>
      voice.name.includes('Microsoft') &&
      voice.name.includes('Online (Natural)'),
  );
  if (naturalPreferred) return naturalPreferred;

  const googlePreferred = preferredVoices.find((voice) =>
    voice.name.includes('Google'),
  );
  if (googlePreferred) return googlePreferred;

  if (preferredVoices.length > 0) {
    return preferredVoices[0];
  }

  const exactEnglishFallback =
    preferred === 'en-US'
      ? pickByExactNames(englishVoices, HIGH_QUALITY_EN_US_VOICE_NAMES)
      : pickByExactNames(englishVoices, HIGH_QUALITY_EN_GB_VOICE_NAMES);
  if (exactEnglishFallback) return exactEnglishFallback;

  const naturalEnglish = englishVoices.find(
    (voice) =>
      voice.name.includes('Microsoft') &&
      voice.name.includes('Online (Natural)'),
  );
  if (naturalEnglish) return naturalEnglish;

  const googleEnglish = englishVoices.find((voice) =>
    voice.name.includes('Google'),
  );
  if (googleEnglish) return googleEnglish;

  return englishVoices[0] ?? null;
}

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance !== 'undefined' &&
    'speechSynthesis' in window
  );
}

export function waitForVoices(timeoutMs = 1500): Promise<void> {
  if (!isSpeechSynthesisSupported()) {
    return Promise.resolve();
  }

  const synth = window.speechSynthesis;
  if (synth.getVoices().length > 0) {
    return Promise.resolve();
  }
  if (waitingVoicesPromise) {
    return waitingVoicesPromise;
  }

  waitingVoicesPromise = new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      synth.removeEventListener('voiceschanged', onVoicesChanged);
      waitingVoicesPromise = null;
      resolve();
    };

    const onVoicesChanged = () => {
      if (synth.getVoices().length > 0) {
        finish();
      }
    };

    synth.addEventListener('voiceschanged', onVoicesChanged);
    synth.getVoices();
    window.setTimeout(finish, timeoutMs);
  });

  return waitingVoicesPromise;
}

export function pickVoiceByLang(
  voices: SpeechSynthesisVoice[],
  lang: string,
): SpeechSynthesisVoice | null {
  if (!voices.length || !lang.trim()) return null;

  const normalizedTarget = normalizeLang(lang);
  const exact = voices.find(
    (voice) => normalizeLang(voice.lang) === normalizedTarget,
  );
  if (exact) return exact;

  const targetPrefix = getLangPrefix(lang);
  if (!targetPrefix) return null;
  return (
    voices.find(
      (voice) => getLangPrefix(voice.lang) === targetPrefix,
    ) ?? null
  );
}

export function pickPreferredEnglishVoice(
  voices: SpeechSynthesisVoice[],
  preferred: PreferredEnglishLang = 'en-US',
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  return pickEnglishVoiceFromCandidates(voices, preferred);
}

export function createUtterance(
  text: string,
  options?: SpeakOptions,
): SpeechSynthesisUtterance | null {
  if (!isSpeechSynthesisSupported()) return null;
  if (!isNonEmptyText(text)) return null;

  const utterance = new SpeechSynthesisUtterance(text);
  const targetLang =
    options?.lang && options.lang.trim()
      ? options.lang
      : 'en-US';
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

  utterance.rate = options?.rate ?? 1;
  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = options?.volume ?? 1;

  return utterance;
}

export async function speakText(
  text: string,
  options?: SpeakOptions,
): Promise<void> {
  if (!isSpeechSynthesisSupported()) return;
  if (!isNonEmptyText(text)) return;

  await waitForVoices();
  const utterance = createUtterance(text, options);
  if (!utterance) return;

  const synth = window.speechSynthesis;
  if (options?.cancelBeforeSpeak ?? true) {
    synth.cancel();
  }

  await new Promise<void>((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    synth.speak(utterance);
  });
}

export function stopSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}

