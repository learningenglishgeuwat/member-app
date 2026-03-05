export const SPEAKING_SHOW_TRANSLATION_KEY = 'spk_show_id_translation_v1';

export function readSpeakingShowTranslation(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    const raw = window.localStorage.getItem(SPEAKING_SHOW_TRANSLATION_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    return parsed === true;
  } catch {
    return true;
  }
}

export function writeSpeakingShowTranslation(next: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SPEAKING_SHOW_TRANSLATION_KEY, JSON.stringify(Boolean(next)));
}
