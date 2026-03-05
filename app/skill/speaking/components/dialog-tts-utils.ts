import {
  createUtterance,
  isSpeechSynthesisSupported as isGlobalSpeechSynthesisSupported,
  pickPreferredEnglishVoice,
  stopSpeech,
} from '@/lib/tts/speech';

const SPEAKER_LINE_PATTERN = /^(Partner|You)\s*:\s*(.*)$/i;
const HIGH_QUALITY_US_MALE_VOICE_NAMES = [
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft David Desktop',
  'Google US English Male',
  'Alex',
] as const;

const MALE_VOICE_HINTS = [
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

function getPreferredEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices.length) return null;
  return pickPreferredEnglishVoice(voices, 'en-US');
}

function getPreferredMaleEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices.length) return null;

  const usVoices = voices.filter((voice) => voice.lang.toLowerCase() === 'en-us');
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));

  const exactMaleUs = pickByExactNames(usVoices, HIGH_QUALITY_US_MALE_VOICE_NAMES);
  if (exactMaleUs) return exactMaleUs;

  const likelyMaleUs = usVoices.find((voice) =>
    MALE_VOICE_HINTS.some((pattern) => pattern.test(voice.name)),
  );
  if (likelyMaleUs) return likelyMaleUs;

  const neutralNonFemaleUs = usVoices.find(
    (voice) => !FEMALE_VOICE_HINTS.some((pattern) => pattern.test(voice.name)),
  );
  if (neutralNonFemaleUs) return neutralNonFemaleUs;

  const likelyMaleEnglish = englishVoices.find((voice) =>
    MALE_VOICE_HINTS.some((pattern) => pattern.test(voice.name)),
  );
  if (likelyMaleEnglish) return likelyMaleEnglish;

  const neutralNonFemaleEnglish = englishVoices.find(
    (voice) => !FEMALE_VOICE_HINTS.some((pattern) => pattern.test(voice.name)),
  );
  if (neutralNonFemaleEnglish) return neutralNonFemaleEnglish;

  return null;
}

function getPreferredVoiceForSpeaker(speaker: DialogSpeaker): SpeechSynthesisVoice | null {
  if (speaker === 'partner') {
    return getPreferredMaleEnglishVoice() ?? getPreferredEnglishVoice();
  }
  return getPreferredEnglishVoice();
}

export function isSpeechSynthesisSupported(): boolean {
  return isGlobalSpeechSynthesisSupported();
}

export function stopSpeechSynthesisPlayback(): void {
  stopSpeech();
}

export function createDialogUtterance(
  text: string,
  speaker: DialogSpeaker,
): SpeechSynthesisUtterance {
  const normalizedText = normalizeSpellingForTts(text);
  const utterance =
    createUtterance(normalizedText, {
      lang: 'en-US',
      rate: 0.85,
      pitch: speaker === 'partner' ? 0.92 : 1,
      volume: 1,
      cancelBeforeSpeak: false,
    }) ??
    (() => {
      if (typeof window !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined') {
        const fallback = new window.SpeechSynthesisUtterance(normalizedText);
        fallback.lang = 'en-US';
        fallback.rate = 0.85;
        fallback.pitch = speaker === 'partner' ? 0.92 : 1;
        fallback.volume = 1;
        return fallback;
      }
      throw new Error('Speech synthesis is not supported in this environment.');
    })();

  const voice = getPreferredVoiceForSpeaker(speaker);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
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
