export const SPEAKING_DETAIL_OPEN_SECTION_KEY = 'spk_detail_open_section_v1';

export type SpeakingDetailOpenSectionMap = Record<string, string | null>;

function normalizeSectionMap(raw: unknown): SpeakingDetailOpenSectionMap {
  if (!raw || typeof raw !== 'object') return {};

  const entries = Object.entries(raw as Record<string, unknown>).filter(
    (entry): entry is [string, string | null] =>
      typeof entry[0] === 'string' &&
      (typeof entry[1] === 'string' || entry[1] === null),
  );

  return Object.fromEntries(entries);
}

export function readSpeakingDetailOpenSectionMap(): SpeakingDetailOpenSectionMap {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SPEAKING_DETAIL_OPEN_SECTION_KEY);
    if (!raw) return {};
    return normalizeSectionMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function writeSpeakingDetailOpenSectionMap(
  nextMap: SpeakingDetailOpenSectionMap,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SPEAKING_DETAIL_OPEN_SECTION_KEY, JSON.stringify(nextMap));
}

export function readSpeakingDetailOpenSection(
  goalId: string,
  validSectionIds: readonly string[],
): string | null {
  const sectionMap = readSpeakingDetailOpenSectionMap();
  const sectionId = sectionMap[goalId] ?? null;
  if (!sectionId) return null;
  return validSectionIds.includes(sectionId) ? sectionId : null;
}

export function writeSpeakingDetailOpenSection(goalId: string, sectionId: string | null): void {
  const prev = readSpeakingDetailOpenSectionMap();
  const next: SpeakingDetailOpenSectionMap = { ...prev, [goalId]: sectionId };
  writeSpeakingDetailOpenSectionMap(next);
}
