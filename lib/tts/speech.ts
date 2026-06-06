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
  rate?: number;       // base rate (overrides contentType default). Will be multiplied by global speed.
  pitch?: number;
  volume?: number;
  cancelBeforeSpeak?: boolean;
};

// ─────────────────────────────────────────────
// GLOBAL SPEED STATE (LocalStorage)
// ─────────────────────────────────────────────

export function getGlobalPlaybackSpeed(): number {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('tts_global_speed');
    if (val && !isNaN(Number(val))) return Number(val);
  }
  return 1;
}

export function setGlobalPlaybackSpeed(speed: number) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tts_global_speed', speed.toString());
  }
}

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
 * Includes Android/Xiaomi specific voices.
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
  // Chrome / Android / Xiaomi
  'Google US English',
  'Google US English Male',
  'Google US English Female',
  'en-US-language',
  'en-us-x-iob-network',
  'en-us-x-iob-local',
  'en-us-x-iom-network',
  'en-us-x-iom-local',
  'en-us-x-iol-network',
  'en-us-x-iol-local',
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
// PUBLIC: SUPPORT CHECK & DEBUG
// ─────────────────────────────────────────────

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance !== 'undefined' &&
    'speechSynthesis' in window
  );
}

/**
 * Debug function to get device and TTS info.
 * Useful for troubleshooting device-specific issues (e.g., Xiaomi).
 */
export async function getDebugInfo(): Promise<{
  isSupported: boolean;
  userAgent: string;
  isXiaomi: boolean;
  isIOS: boolean;
  isSafari: boolean;
  voicesCount: number;
  voices: { name: string; lang: string; default: boolean }[];
}> {
  const isSupported = isSpeechSynthesisSupported();
  
  if (!isSupported) {
    return {
      isSupported: false,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      isXiaomi: false,
      isIOS: false,
      isSafari: false,
      voicesCount: 0,
      voices: [],
    };
  }

  await waitForVoices();
  const voices = window.speechSynthesis.getVoices();

  return {
    isSupported: true,
    userAgent: navigator.userAgent,
    isXiaomi: isXiaomi(),
    isIOS: isIOS(),
    isSafari: isSafari(),
    voicesCount: voices.length,
    voices: voices.map(v => ({
      name: v.name,
      lang: v.lang,
      default: v.default,
    })),
  };
}

// ─────────────────────────────────────────────
// TTS INITIALIZATION STATE
// ─────────────────────────────────────────────

let ttsInitialized = false;

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

  // Rate: base rate (explicit or content-type default) * global speed multiplier
  const globalSpeed = getGlobalPlaybackSpeed();
  const baseRate = options?.rate !== undefined ? options.rate : CONTENT_TYPE_RATE[contentType];
  utterance.rate = baseRate * globalSpeed;

  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = options?.volume ?? 1;

  return utterance;
}

// ─────────────────────────────────────────────
// INTERNAL: SAFE CANCEL
// ─────────────────────────────────────────────

/**
 * Detects Xiaomi devices based on user agent
 */
function isXiaomi(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /xiaomi|mi\s|redmi|poco/i.test(navigator.userAgent);
}

/**
 * Force resume speech synthesis (required on some Xiaomi devices).
 * MIUI browser sometimes pauses speechSynthesis internally.
 */
function forceResumeSpeech(): void {
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

/**
 * Cancels speech and waits for a safe delay before the next speak call.
 *
 * Safari/iOS: cancel() is asynchronous internally — speaking immediately
 * after cancel causes the new utterance to be silently dropped.
 * Xiaomi/MIUI: Similar async cancel behavior — needs longer delay.
 * Delay: 150ms on iOS/Safari/Xiaomi, 20ms on others (still catches Chrome edge cases).
 */
async function safeCancelAndWait(): Promise<void> {
  window.speechSynthesis.cancel();
  const delayMs = isIOS() || isSafari() || isXiaomi() ? 150 : 20;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

// ─────────────────────────────────────────────
// PUBLIC: SPEAK
// ─────────────────────────────────────────────

/**
 * Main speak function.
 *
 * Features:
 * - Auto-initialization for Android/Xiaomi devices
 * - Always cancels before speaking (prevents queue buildup on Android/iOS)
 * - Safe cancel delay for Safari/iOS/Xiaomi
 * - Per-utterance timeout (20s) prevents stuck playback
 * - Retry mechanism for Xiaomi devices that fail on first attempt
 * - Error logging without breaking the caller
 * - Cross-browser voice loading handled via waitForVoices()
 */
export async function speakText(
  text: string,
  options?: SpeakOptions,
): Promise<void> {
  if (!isSpeechSynthesisSupported()) return;
  if (!isNonEmptyText(text)) return;

  // Auto-initialize TTS for Xiaomi/Android devices
  if (!ttsInitialized && isXiaomi()) {
    console.log('[TTS] Auto-initializing for Xiaomi device...');
    await initializeTTS();
  }

  await waitForVoices();

  const utterance = createUtterance(text, options);
  if (!utterance) return;

  const synth = window.speechSynthesis;

  // Force resume for Xiaomi devices (MIUI sometimes pauses speech internally)
  if (isXiaomi()) {
    forceResumeSpeech();
  }

  // Always cancel before speak — prevents queue buildup on Android / rapid clicks
  // cancelBeforeSpeak: false is intentionally NOT supported to avoid OS-level bugs
  const shouldCancel = options?.cancelBeforeSpeak ?? true;
  if (shouldCancel) {
    await safeCancelAndWait();
  }

  // Per-utterance timeout — 20s covers even the slowest multi-word utterances on slower devices (Xiaomi).
  // If the engine hangs (Android WebView, Samsung Internet, MIUI), we resolve without cancel
  // to avoid cutting off utterances that are still playing.
  const MAX_UTTERANCE_MS = 20_000;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isResolved = false;
  let didSpeak = false;

  const attemptSpeak = () => {
    return new Promise<void>((resolve) => {
      utterance.onend = () => {
        if (isResolved) return;
        isResolved = true;
        didSpeak = true;
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
      
      // Add onstart handler to detect if speech actually started
      utterance.onstart = () => {
        didSpeak = true;
        console.log('[TTS] Speech started:', text.substring(0, 30));
      };
      
      synth.speak(utterance);
    });
  };

  await Promise.race([
    attemptSpeak(),
    new Promise<void>((resolve) => {
      timeoutId = setTimeout(() => {
        if (isResolved) return;
        isResolved = true;
        console.warn('[TTS] Utterance timed out after', MAX_UTTERANCE_MS, 'ms — resolving without cancel to avoid cutting off speech.');
        resolve();
      }, MAX_UTTERANCE_MS);
    }),
  ]);

  // Retry once for Xiaomi devices if speech didn't start
  if (!didSpeak && isXiaomi()) {
    console.log('[TTS] Speech did not start on Xiaomi, retrying after delay...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Reset flags for retry
    isResolved = false;
    didSpeak = false;
    timeoutId = null;
    
    // Create new utterance for retry
    const retryUtterance = createUtterance(text, options);
    if (retryUtterance) {
      await Promise.race([
        new Promise<void>((resolve) => {
          retryUtterance.onend = () => {
            if (isResolved) return;
            isResolved = true;
            if (timeoutId) clearTimeout(timeoutId);
            resolve();
          };
          retryUtterance.onerror = (event) => {
            if (isResolved) return;
            isResolved = true;
            if (timeoutId) clearTimeout(timeoutId);
            if (event.error !== 'interrupted' && event.error !== 'canceled') {
              console.error('[TTS] Retry error:', event.error);
            }
            resolve();
          };
          retryUtterance.onstart = () => {
            console.log('[TTS] Retry speech started successfully');
          };
          synth.speak(retryUtterance);
        }),
        new Promise<void>((resolve) => {
          timeoutId = setTimeout(() => {
            if (isResolved) return;
            isResolved = true;
            console.warn('[TTS] Retry also timed out');
            resolve();
          }, MAX_UTTERANCE_MS);
        }),
      ]);
    }
  }
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