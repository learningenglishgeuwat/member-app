export type TutorialFeatureProgress = {
  featureId: string;
  scopeFeatureId?: string;
  currentStepIndex: number;
  completedStepIds: string[];
  isCompleted: boolean;
  completedAt?: number;
  updatedAt: number;
};

const TUTORIAL_PROGRESS_KEY = 'tourguide_tutorial_progress_v1';
const TUTORIAL_LAST_FEATURE_KEY = 'tourguide_tutorial_last_feature_v1';
const TUTORIAL_OVERLAY_KEY = 'tourguide_tutorial_overlay_v1';
const TUTORIAL_PROGRESS_VERSION_KEY = 'tourguide_tutorial_progress_version_v1';
const TUTORIAL_PROGRESS_VERSION = 'dashboard-sequence-v3';

const isTutorialFeatureProgress = (value: unknown): value is TutorialFeatureProgress => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<TutorialFeatureProgress>;
  return (
    typeof item.featureId === 'string' &&
    (typeof item.scopeFeatureId === 'string' || typeof item.scopeFeatureId === 'undefined') &&
    typeof item.currentStepIndex === 'number' &&
    Array.isArray(item.completedStepIds) &&
    (typeof item.isCompleted === 'boolean' || typeof item.isCompleted === 'undefined') &&
    (typeof item.completedAt === 'number' || typeof item.completedAt === 'undefined') &&
    typeof item.updatedAt === 'number'
  );
};

export const loadTutorialProgressMap = (): Record<string, TutorialFeatureProgress> => {
  if (typeof window === 'undefined') return {};

  try {
    const storedVersion = window.localStorage.getItem(TUTORIAL_PROGRESS_VERSION_KEY);
    if (storedVersion !== TUTORIAL_PROGRESS_VERSION) {
      window.localStorage.removeItem(TUTORIAL_PROGRESS_KEY);
      window.localStorage.removeItem(TUTORIAL_LAST_FEATURE_KEY);
      window.localStorage.setItem(TUTORIAL_PROGRESS_VERSION_KEY, TUTORIAL_PROGRESS_VERSION);
      return {};
    }

    const raw = window.localStorage.getItem(TUTORIAL_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};

    const result: Record<string, TutorialFeatureProgress> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!isTutorialFeatureProgress(value)) continue;
      result[key] = {
        featureId: value.featureId,
        scopeFeatureId: typeof value.scopeFeatureId === 'string' ? value.scopeFeatureId : undefined,
        currentStepIndex: value.currentStepIndex,
        completedStepIds: Array.from(
          new Set(value.completedStepIds.filter((item) => typeof item === 'string')),
        ),
        isCompleted: value.isCompleted ?? false,
        completedAt: typeof value.completedAt === 'number' ? value.completedAt : undefined,
        updatedAt: value.updatedAt,
      };
    }
    return result;
  } catch {
    return {};
  }
};

export const saveTutorialProgressMap = (map: Record<string, TutorialFeatureProgress>): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(TUTORIAL_PROGRESS_VERSION_KEY, TUTORIAL_PROGRESS_VERSION);
    window.localStorage.setItem(TUTORIAL_PROGRESS_KEY, JSON.stringify(map));
  } catch {
    // ignore storage write failure
  }
};

export const loadTutorialLastFeatureId = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(TUTORIAL_LAST_FEATURE_KEY);
    if (!raw) return null;
    return raw.trim() || null;
  } catch {
    return null;
  }
};

export const saveTutorialLastFeatureId = (featureId: string): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(TUTORIAL_LAST_FEATURE_KEY, featureId);
  } catch {
    // ignore storage write failure
  }
};

export const loadTutorialOverlayPreference = (): 'open' | 'closed' => {
  if (typeof window === 'undefined') return 'open';

  try {
    const raw = window.localStorage.getItem(TUTORIAL_OVERLAY_KEY);
    return raw === 'closed' ? 'closed' : 'open';
  } catch {
    return 'open';
  }
};

export const saveTutorialOverlayPreference = (state: 'open' | 'closed'): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(TUTORIAL_OVERLAY_KEY, state);
  } catch {
    // ignore storage write failure
  }
};
