export const SPEAKING_GOAL_COMPLETION_KEY = 'spk_goal_completed_v2';
export const SPEAKING_GOAL_COMPLETION_LEGACY_KEY = 'spk_goal_completed_v1';
export const SPEAKING_GOAL_COMPLETION_LEGACY_ARCHIVE_KEY =
  'spk_goal_completed_legacy_v1_archive';
export const SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX = 'practice-with-geuwat:';

export type SpeakingGoalCompletionMap = Record<string, boolean>;

function normalizeMap(raw: unknown): SpeakingGoalCompletionMap {
  if (!raw || typeof raw !== 'object') return {};

  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).filter(
      (entry): entry is [string, boolean] => typeof entry[1] === 'boolean',
    ),
  );
}

export function readSpeakingGoalCompletionMap(): SpeakingGoalCompletionMap {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const activeRaw = window.localStorage.getItem(SPEAKING_GOAL_COMPLETION_KEY);
    if (activeRaw) {
      return normalizeMap(JSON.parse(activeRaw));
    }

    const legacyRaw = window.localStorage.getItem(SPEAKING_GOAL_COMPLETION_LEGACY_KEY);
    if (legacyRaw) {
      // Archive legacy progress for traceability, then start fresh for CEFR ids.
      window.localStorage.setItem(SPEAKING_GOAL_COMPLETION_LEGACY_ARCHIVE_KEY, legacyRaw);
      window.localStorage.removeItem(SPEAKING_GOAL_COMPLETION_LEGACY_KEY);
    }

    return {};
  } catch {
    return {};
  }
}

export function writeSpeakingGoalCompletionMap(nextMap: SpeakingGoalCompletionMap) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SPEAKING_GOAL_COMPLETION_KEY, JSON.stringify(nextMap));
}
