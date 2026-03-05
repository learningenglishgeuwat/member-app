import {
  createUtterance,
  isSpeechSynthesisSupported as isGlobalSpeechSynthesisSupported,
  pickPreferredEnglishVoice,
  stopSpeech,
  waitForVoices,
} from '@/lib/tts/speech';

const SPEAKER_LINE_PATTERN = /^(Partner|You)\s*:\s*(.*)$/i;
const HIGH_QUALITY_UK_MALE_VOICE_NAMES = [
  'Google UK English Male',
  'Microsoft Ryan Online (Natural) - English (United Kingdom)',
  'Microsoft George Online (Natural) - English (United Kingdom)',
  'Daniel',
  'Thomas',
] as const;

const MALE_VOICE_HINTS = [
  /google uk english male/i,
  /microsoft ryan/i,
  /microsoft george/i,
  /thomas/i,
  /uk male/i,
  /british male/i,
  /english united kingdom.*male/i,
  /great britain.*male/i,
  /google us english male/i,
  /microsoft guy/i,
  /microsoft david/i,
  /alex/i,
  /daniel/i,
  /aaron/i,
  /evan/i,
  /fred/i,
  /ralph/i,
  /guy/i,
  /male/i,
  /man/i,
  /david/i,
];
const FEMALE_VOICE_HINTS = [
  /samantha/i,
  /zira/i,
  /victoria/i,
  /karen/i,
  /aria/i,
  /female/i,
  /woman/i,
];
const UK_LANG_HINTS = [/united kingdom/i, /great britain/i, /british/i, /\buk\b/i];
const SPELLING_PATTERN = /\b([A-Za-z](?:\s*-\s*[A-Za-z]){1,})\b/g;

export type DialogSpeaker = 'partner' | 'you' | 'unknown';

export type ParsedDialogLine = {
  speaker: DialogSpeaker;
  label: 'Partner' | 'You' | '';
  content: string;
  raw: string;
};

function pickByExactNames(
  voices: SpeechSynthesisVoice[],
  names: readonly string[],
): SpeechSynthesisVoice | null {
  for (const name of names) {
    const match = voices.find((voice) => voice.name === name);
    if (match) return match;
  }
  return null;
}

function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isGlobalSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
}

function normalizeSpellingForTts(text: string): string {
  return text.replace(SPELLING_PATTERN, (match) => {
    const letters = match
      .split('-')
      .map((part) => part.trim())
      .filter(Boolean);
    if (letters.length < 2) return match;
    return letters.join(', ');
  });
}

function getPreferredEnglishVoice(preferred: 'en-US' | 'en-GB' = 'en-US'): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices.length) return null;
  return pickPreferredEnglishVoice(voices, preferred);
}

function isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  return FEMALE_VOICE_HINTS.some((pattern) => pattern.test(voice.name));
}

function isUkVoice(voice: SpeechSynthesisVoice): boolean {
  const normalizedLang = voice.lang.toLowerCase();
  return normalizedLang === 'en-gb' || UK_LANG_HINTS.some((pattern) => pattern.test(voice.name));
}

function getPreferredMaleUkEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices.length) return null;

  const ukVoices = voices.filter((voice) => isUkVoice(voice));
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));

  const exactMaleUk = pickByExactNames(ukVoices, HIGH_QUALITY_UK_MALE_VOICE_NAMES);
  if (exactMaleUk) return exactMaleUk;

  const likelyMaleUk = ukVoices.find((voice) =>
    MALE_VOICE_HINTS.some((pattern) => pattern.test(voice.name)) && !isFemaleVoice(voice),
  );
  if (likelyMaleUk) return likelyMaleUk;

  const neutralNonFemaleUk = ukVoices.find(
    (voice) => !isFemaleVoice(voice),
  );
  if (neutralNonFemaleUk) return neutralNonFemaleUk;

  const likelyMaleEnglish = englishVoices.find((voice) =>
    MALE_VOICE_HINTS.some((pattern) => pattern.test(voice.name)) && !isFemaleVoice(voice),
  );
  if (likelyMaleEnglish) return likelyMaleEnglish;

  const neutralNonFemaleEnglish = englishVoices.find(
    (voice) => !isFemaleVoice(voice),
  );
  if (neutralNonFemaleEnglish) return neutralNonFemaleEnglish;

  return null;
}

function getPreferredVoiceForSpeaker(speaker: DialogSpeaker): SpeechSynthesisVoice | null {
  if (speaker === 'partner') {
    return getPreferredMaleUkEnglishVoice() ?? getPreferredEnglishVoice('en-GB') ?? getPreferredEnglishVoice('en-US');
  }
  return getPreferredEnglishVoice('en-US');
}

export function isSpeechSynthesisSupported(): boolean {
  return isGlobalSpeechSynthesisSupported();
}

export function stopSpeechSynthesisPlayback(): void {
  stopSpeech();
}

export async function prepareDialogVoices(): Promise<void> {
  await waitForVoices(3000);
}

export function createDialogUtterance(
  text: string,
  speaker: DialogSpeaker,
): SpeechSynthesisUtterance {
  const normalizedText = normalizeSpellingForTts(text);
  const preferredEnglish = speaker === 'partner' ? 'en-GB' : 'en-US';
  const safeLang = 'en-US';
  let voice = getPreferredVoiceForSpeaker(speaker);

  // Harden against device fallback to non-English voices.
  if (!voice || !voice.lang.toLowerCase().startsWith('en')) {
    voice = getPreferredEnglishVoice('en-US');
  }

  const resolvedLang = voice?.lang?.toLowerCase().startsWith('en')
    ? voice.lang
    : safeLang;

  const utterance =
    createUtterance(normalizedText, {
      lang: resolvedLang,
      preferredEnglish,
      rate: speaker === 'partner' ? 0.95 : 0.9,
      pitch: speaker === 'partner' ? 0.92 : 1,
      volume: 1,
      cancelBeforeSpeak: false,
    }) ??
    (() => {
      if (typeof window !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined') {
        const fallback = new window.SpeechSynthesisUtterance(normalizedText);
        fallback.lang = resolvedLang;
        fallback.rate = speaker === 'partner' ? 0.95 : 0.9;
        fallback.pitch = speaker === 'partner' ? 0.92 : 1;
        fallback.volume = 1;
        return fallback;
      }
      throw new Error('Speech synthesis is not supported in this environment.');
    })();

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = resolvedLang;
  }

  return utterance;
}

export function parseDialogLine(line: string): ParsedDialogLine {
  const raw = line;
  const trimmed = line.trim();
  const match = trimmed.match(SPEAKER_LINE_PATTERN);

  if (!match) {
    return {
      speaker: 'unknown',
      label: '',
      content: trimmed,
      raw,
    };
  }

  const speaker = match[1].toLowerCase() === 'partner' ? 'partner' : 'you';
  return {
    speaker,
    label: speaker === 'partner' ? 'Partner' : 'You',
    content: match[2].trim(),
    raw,
  };
}
