// lib/tts/voice-selection.ts
// ============================================================
// Voice Selection and Management
// ============================================================

import type { PreferredEnglishLang } from './types';

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
// INTERNAL HELPERS
// ─────────────────────────────────────────────

function normalizeLang(lang: string): string {
  return lang.trim().toLowerCase().replace('_', '-');
}

function getLangPrefix(lang: string): string {
  const [prefix] = normalizeLang(lang).split('-');
  return prefix ?? '';
}

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
// PUBLIC API
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
