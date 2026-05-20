// lib/tts/speech.ts
// ============================================================
// TTS Engine — Cross-OS/Browser Safe
// Supports: Letter, Word, Phrase, Sentence, -s/es, -d/ed,
//           American T, Linking, Contraction, Stressing, Intonation
// Priority: American English (en-US) > British English (en-GB) > any English
// Free: Web Speech API only (no paid API)
// ============================================================

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type PreferredEnglishLang = 'en-US' | 'en-GB';

/**
 * Content type determines rate, preprocessing, and SSML hints.
 * - 'letter'      : single character, slowest rate
 * - 'word'        : single word, slow rate
 * - 'suffix'      : -s/es, -d/ed endings, slow + clear
 * - 'americanT'   : American T (flap/tap), slow + clear
 * - 'linking'     : linking words between two words, slightly slow
 * - 'contraction' : e.g. "don't", "I'm", normal-slow
 * - 'phrase'      : short phrase, normal-slow
 * - 'sentence'    : full sentence, normal rate
 * - 'stressing'   : word with stress emphasis, slow
 * - 'intonation'  : sentence with intonation pattern, slightly slow
 */
export type ContentType =
  | 'letter'
  | 'word'
  | 'suffix'
  | 'americanT'
  | 'linking'
  | 'contraction'
  | 'phrase'
  | 'sentence'
  | 'stressing'
  | 'intonation';

export type SpeakOptions = {
  lang?: string;
  preferEnglish?: boolean;
  preferredEnglish?: PreferredEnglishLang;
  contentType?: ContentType;
  rate?: number;       // overrides contentType default rate if provided
  pitch?: number;
  volume?: number;
  cancelBeforeSpeak?: boolean;
};

// ─────────────────────────────────────────────
// RATE TABLE PER CONTENT TYPE
// ─────────────────────────────────────────────

/**
 * Default speech rate per content type.
 * Range: 0.1 (slowest) – 10 (fastest). Normal = 1.
 * These values are tuned for English learner clarity.
 */
const CONTENT_TYPE_RATE: Record<ContentType, number> = {
  letter:      0.7,   // slowest — single character must be heard clearly
  suffix:      0.75,  // -s/es -d/ed — needs to be distinct
  americanT:   0.75,  // flap T — slow so learner hears the difference
  stressing:   0.78,  // stress pattern — slightly slow for clarity
  word:        0.82,  // single word
  linking:     0.82,  // linking sound between words
  contraction: 0.85,  // don't / I'm / they've
  phrase:      0.88,  // short phrase
  intonation:  0.9,   // intonation pattern — close to natural
  sentence:    0.95,  // full sentence — near natural speed
};

// ─────────────────────────────────────────────
// VOICE NAME LISTS (priority order)
// ─────────────────────────────────────────────

/**
 * American English voices — ordered by quality.
 * Natural/Online voices > Desktop > Generic.
 */
const HIGH_QUALITY_EN_US_VOICE_NAMES = [
  // Windows / Edge (highest quality online natural voices)
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft Ana Online (Natural) - English (United States)',
  'Microsoft Emma Online (Natural) - English (United States)',
  'Microsoft Brian Online (Natural) - English (United States)',
  // Windows desktop voices
  'Microsoft Zira Desktop - English (United States)',
  'Microsoft David Desktop - English (United States)',
  'Microsoft Zira Desktop',
  'Microsoft David Desktop',
  // Chrome / Android
  'Google US English',
  'Google US English Male',
  // macOS / iOS
  'Samantha',
  'Alex',
  'Nicky',
  'Ava',
  'Allison',
  'Susan',
  'Tom',
] as const;

/**
 * British English voices — ordered by quality.
 */
const HIGH_QUALITY_EN_GB_VOICE_NAMES = [
  // Windows / Edge online natural
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  'Microsoft Ryan Online (Natural) - English (United Kingdom)',
  'Microsoft Libby Online (Natural) - English (United Kingdom)',
  'Microsoft Mia Online (Natural) - English (United Kingdom)',
  // Windows desktop
  'Microsoft Hazel Desktop - English (Great Britain)',
  'Microsoft George Desktop - English (Great Britain)',
  // Chrome / Android
  'Google UK English Female',
  'Google UK English Male',
  // macOS
  'Daniel',
  'Kate',
  'Serena',
] as const;

// ─────────────────────────────────────────────
// INTERNAL STATE
// ─────────────────────────────────────────────

let waitingVoicesPromise: Promise<void> | null = null;

// Detects iOS/Safari which needs special cancel handling
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    (navigator.vendor?.includes('Apple') ?? false)
  );
}

// ─────────────────────────────────────────────
// TEXT PREPROCESSING PER CONTENT TYPE
// ─────────────────────────────────────────────

/**
 * Preprocesses text before passing to TTS based on content type.
 * Adds spacing or punctuation tricks to help the engine pronounce correctly.
 */
export function preprocessTextForSpeech(text: string, contentType: ContentType): string {
  const t = text.trim();
  if (!t) return t;

  switch (contentType) {
    case 'letter':
      // Single letter: uppercase to prevent "eh" pronunciation on some engines
      // Add space after to prevent blending
      return t.toUpperCase();

    case 'suffix':
      // -s/es -d/ed: speak as a word, add slight pause before via comma trick
      // "walks" → say the full word slowly; for raw suffix like "-ed", wrap it
      if (t.startsWith('-')) {
        // Raw suffix like "-s", "-es", "-ed" — strip dash and say it
        return t.replace(/^-+/, '');
      }
      return t;

    case 'americanT':
      // American T (flap): no preprocessing needed — rate handles it
      // The TTS engine naturally produces flap T at slower rates on en-US voices
      return t;

    case 'linking':
      // Linking words: e.g. "an apple" — TTS handles naturally
      // Add punctuation pause if it's two separate items shown with underscore
      return t.replace(/_/g, ' ');

    case 'contraction':
      // Contractions: ensure apostrophe is standard (not curly)
      return t.replace(/[\u2018\u2019]/g, "'");

    case 'stressing':
      // Stressing: word with stress — spoken slowly, engine handles
      return t;

    case 'intonation':
      // Intonation: keep punctuation intact — it guides TTS pitch
      return t;

    case 'phrase':
    case 'sentence':
      // Ensure sentence ends with punctuation for natural intonation
      if (!/[.!?]$/.test(t)) return t + '.';
      return t;

    case 'word':
    default:
      return t;
  }
}

// ─────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// VOICE PICKER
// ─────────────────────────────────────────────

function pickByExactNames(
  voices: SpeechSynthesisVoice[],
  names: readonly string[],
): SpeechSynthesisVoice | null {
  for (const name of names) {
    const matched = voices.find((v) => v.name === name);
    if (matched) return matched;
  }
  return null;
}

function pickByNameIncludes(
  voices: SpeechSynthesisVoice[],
  names: readonly string[],
): SpeechSynthesisVoice | null {
  for (const name of names) {
    const matched = voices.find((v) => v.name.includes(name));
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
    (v) => normalizeLang(v.lang) === normalizedPreferred,
  );
  const englishVoices = voices.filter((v) =>
    normalizeLang(v.lang).startsWith('en'),
  );

  const nameList =
    preferred === 'en-US'
      ? HIGH_QUALITY_EN_US_VOICE_NAMES
      : HIGH_QUALITY_EN_GB_VOICE_NAMES;

  // 1. Exact name match in preferred lang pool
  const exactPreferred = pickByExactNames(preferredVoices, nameList);
  if (exactPreferred) return exactPreferred;

  // 2. Partial name match in preferred lang pool
  const includesPreferred = pickByNameIncludes(preferredVoices, nameList);
  if (includesPreferred) return includesPreferred;

  // 3. Any Microsoft Natural Online voice in preferred lang
  const naturalPreferred = preferredVoices.find(
    (v) => v.name.includes('Microsoft') && v.name.includes('Online (Natural)'),
  );
  if (naturalPreferred) return naturalPreferred;

  // 4. Any Google voice in preferred lang
  const googlePreferred = preferredVoices.find((v) => v.name.includes('Google'));
  if (googlePreferred) return googlePreferred;

  // 5. First voice in preferred lang
  if (preferredVoices.length > 0) return preferredVoices[0]!;

  // ── Fallback: search across all English voices ──

  // 6. Exact name match in all English voices
  const exactEnglish = pickByExactNames(englishVoices, nameList);
  if (exactEnglish) return exactEnglish;

  // 7. Partial name match in all English voices
  const includesEnglish = pickByNameIncludes(englishVoices, nameList);
  if (includesEnglish) return includesEnglish;

  // 8. Any Microsoft Natural Online in all English
  const naturalEnglish = englishVoices.find(
    (v) => v.name.includes('Microsoft') && v.name.includes('Online (Natural)'),
  );
  if (naturalEnglish) return naturalEnglish;

  // 9. Any Google English
  const googleEnglish = englishVoices.find((v) => v.name.includes('Google'));
  if (googleEnglish) return googleEnglish;

  // 10. First English voice available
  return englishVoices[0] ?? null;
}

// ─────────────────────────────────────────────
// PUBLIC: SUPPORT CHECK
// ─────────────────────────────────────────────

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance !== 'undefined' &&
    'speechSynthesis' in window
  );
}

// ─────────────────────────────────────────────
// PUBLIC: VOICE LOADING
// ─────────────────────────────────────────────

/**
 * Waits until voices are loaded from the browser.
 *
 * Cross-browser behaviour:
 * - Chrome/Edge: async — fires `voiceschanged` event, getVoices() starts empty
 * - Firefox: sync — getVoices() already populated on first call
 * - Safari/iOS: `voiceschanged` may never fire — we poll + timeout as fallback
 *
 * Increased timeout to 3000ms + retry polling every 300ms for slow devices.
 */
export function waitForVoices(timeoutMs = 3000): Promise<void> {
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

    // Polling fallback for Safari/iOS where voiceschanged may not fire
    pollInterval = setInterval(() => {
      synth.getVoices(); // trigger lazy load
      if (synth.getVoices().length > 0) finish();
    }, 300);

    // Hard timeout — resolve even if no voices found (handles unsupported devices)
    window.setTimeout(finish, timeoutMs);
  });

  return waitingVoicesPromise;
}

// ─────────────────────────────────────────────
// PUBLIC: VOICE PICKERS
// ─────────────────────────────────────────────

export function pickVoiceByLang(
  voices: SpeechSynthesisVoice[],
  lang: string,
): SpeechSynthesisVoice | null {
  if (!voices.length || !lang.trim()) return null;

  const normalizedTarget = normalizeLang(lang);
  const exact = voices.find((v) => normalizeLang(v.lang) === normalizedTarget);
  if (exact) return exact;

  const targetPrefix = getLangPrefix(lang);
  if (!targetPrefix) return null;
  return voices.find((v) => getLangPrefix(v.lang) === targetPrefix) ?? null;
}

export function pickPreferredEnglishVoice(
  voices: SpeechSynthesisVoice[],
  preferred: PreferredEnglishLang = 'en-US',
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  const voice = pickEnglishVoiceFromCandidates(voices, preferred);
  if (!voice) {
    console.warn(`[TTS] No ${preferred} voice found, no English voice available.`);
  }
  return voice;
}

// ─────────────────────────────────────────────
// PUBLIC: CREATE UTTERANCE
// ─────────────────────────────────────────────

export function createUtterance(
  text: string,
  options?: SpeakOptions,
): SpeechSynthesisUtterance | null {
  if (!isSpeechSynthesisSupported()) return null;
  if (!isNonEmptyText(text)) return null;

  // Preprocess text based on content type
  const contentType = options?.contentType ?? 'word';
  const processedText = preprocessTextForSpeech(text, contentType);

  const utterance = new SpeechSynthesisUtterance(processedText);

  const targetLang =
    options?.lang && options.lang.trim() ? options.lang : 'en-US';
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

  // Rate: explicit option wins, else use content-type default
  utterance.rate =
    options?.rate !== undefined
      ? options.rate
      : CONTENT_TYPE_RATE[contentType];

  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = options?.volume ?? 1;

  return utterance;
}

// ─────────────────────────────────────────────
// INTERNAL: SAFE CANCEL
// ─────────────────────────────────────────────

/**
 * Cancels speech and waits for a safe delay before the next speak call.
 *
 * Safari/iOS: cancel() is asynchronous internally — speaking immediately
 * after cancel causes the new utterance to be silently dropped.
 * Delay: 80ms on iOS/Safari, 20ms on others (still catches Chrome edge cases).
 */
async function safeCancelAndWait(): Promise<void> {
  window.speechSynthesis.cancel();
  const delayMs = isIOS() || isSafari() ? 120 : 20;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

// ─────────────────────────────────────────────
// PUBLIC: SPEAK
// ─────────────────────────────────────────────

/**
 * Main speak function.
 *
 * Features:
 * - Always cancels before speaking (prevents queue buildup on Android/iOS)
 * - Safe cancel delay for Safari/iOS
 * - Per-utterance timeout (15s) prevents stuck playback
 * - Error logging without breaking the caller
 * - Cross-browser voice loading handled via waitForVoices()
 */
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

  // Always cancel before speak — prevents queue buildup on Android / rapid clicks
  // cancelBeforeSpeak: false is intentionally NOT supported to avoid OS-level bugs
  const shouldCancel = options?.cancelBeforeSpeak ?? true;
  if (shouldCancel) {
    await safeCancelAndWait();
  }

  // Per-utterance timeout — 15s covers even the slowest multi-word utterances.
  // If the engine hangs (Android WebView, Samsung Internet), we resolve without cancel
  // to avoid cutting off utterances that are still playing.
  const MAX_UTTERANCE_MS = 15_000;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isResolved = false;

  await Promise.race([
    new Promise<void>((resolve) => {
      utterance.onend = () => {
        if (isResolved) return;
        isResolved = true;
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
      synth.speak(utterance);
    }),
    new Promise<void>((resolve) => {
      timeoutId = setTimeout(() => {
        if (isResolved) return;
        isResolved = true;
        console.warn('[TTS] Utterance timed out after', MAX_UTTERANCE_MS, 'ms — resolving without cancel to avoid cutting off speech.');
        // ✅ PERBAIKAN: Tidak cancel di sini, biarkan utterance selesai natural
        // Hanya resolve promise agar caller bisa lanjut
        resolve();
      }, MAX_UTTERANCE_MS);
    }),
  ]);
}

// ─────────────────────────────────────────────
// PUBLIC: STOP
// ─────────────────────────────────────────────

export function stopSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}

// ─────────────────────────────────────────────
// PUBLIC: CONVENIENCE SPEAK FUNCTIONS PER TYPE
// These are ready-to-use wrappers for each content type.
// Pass preferredEnglish: 'en-GB' for British variant.
// ─────────────────────────────────────────────

export async function speakLetter(
  letter: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(letter, { contentType: 'letter', preferredEnglish });
}

export async function speakWord(
  word: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(word, { contentType: 'word', preferredEnglish });
}

export async function speakSuffix(
  suffix: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(suffix, { contentType: 'suffix', preferredEnglish });
}

export async function speakAmericanT(
  word: string,
): Promise<void> {
  // American T always uses en-US
  await speakText(word, { contentType: 'americanT', preferredEnglish: 'en-US' });
}

export async function speakLinking(
  text: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(text, { contentType: 'linking', preferredEnglish });
}

export async function speakContraction(
  text: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(text, { contentType: 'contraction', preferredEnglish });
}

export async function speakPhrase(
  phrase: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(phrase, { contentType: 'phrase', preferredEnglish });
}

export async function speakSentence(
  sentence: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(sentence, { contentType: 'sentence', preferredEnglish });
}

export async function speakStressing(
  text: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(text, { contentType: 'stressing', preferredEnglish });
}

export async function speakIntonation(
  text: string,
  preferredEnglish: PreferredEnglishLang = 'en-US',
): Promise<void> {
  await speakText(text, { contentType: 'intonation', preferredEnglish });
}