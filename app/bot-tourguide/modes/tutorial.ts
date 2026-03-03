import {
  TUTORIAL_CURRICULUM,
  type TutorialAdvanceMode,
  type TutorialFeature,
} from '../data/tutorial-curriculum';
import { TUTORIAL_CURRICULUM_MOBILE } from '../data/tutorial-curriculum-mobile';
import {
  loadTutorialProgressMap,
  saveTutorialLastFeatureId,
  saveTutorialProgressMap,
  type TutorialFeatureProgress,
} from '../engine/tutorial-session';
import { isTutorialAllowedPath } from '../tutorial/tutorial-allowed-paths';
import type { GuideModeResult, TutorialDeviceProfile } from '../types';

const NEXT_COMMANDS = new Set(['next', 'lanjut', 'next step', 'lanjut step']);
const RESTART_COMMANDS = new Set(['restart', 'mulai ulang', 'ulang']);
const CONTINUE_COMMANDS = new Set(['continue', 'resume', 'lanjut tutorial', 'lanjutkan tutorial']);
const EXIT_COMMANDS = new Set(['exit tutorial', 'keluar tutorial', 'tutup tutorial', 'x']);
const TARGET_CLICKED_COMMANDS = new Set(['tutorial target clicked', 'tutorial target-clicked']);
const TARGET_MISSED_COMMANDS = new Set(['tutorial target missed', 'tutorial target-missed']);
const TARGET_RETRY_COMMANDS = new Set(['tutorial retry target', 'tutorial retry-target']);

type MasterTutorialId = 'all' | 'all-mobile';
type MasterTutorialFeature = Omit<TutorialFeature, 'id'> & { id: MasterTutorialId };
type TutorialRuntimeContext = {
  deviceProfile: TutorialDeviceProfile;
  curriculum: ReadonlyArray<TutorialFeature>;
  masterTutorialId: MasterTutorialId;
  masterFeature: MasterTutorialFeature;
};
type TutorialScopeInfo = {
  featureId?: string;
  routePath?: string;
};

const TUTORIAL_SCOPE_ROUTE_SEPARATOR = '|route=';

const resolveDeviceProfile = (deviceProfile?: TutorialDeviceProfile): TutorialDeviceProfile =>
  deviceProfile === 'mobile' ? 'mobile' : 'desktop';

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizePath = (pathname?: string): string => {
  if (!pathname) return '';
  const cleaned = pathname.split('#')[0]?.split('?')[0]?.trim() ?? '';
  if (!cleaned) return '';
  return cleaned.length > 1 && cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
};

const isLogoutTutorialStep = (step: { id: string; title: string; explanationId: string }): boolean => {
  const text = `${step.id} ${step.title} ${step.explanationId}`.toLowerCase();
  return text.includes('logout') || text.includes('sign out') || text.includes('sign-out');
};

const buildMasterTutorialFeature = (
  curriculum: ReadonlyArray<TutorialFeature>,
  masterTutorialId: MasterTutorialId,
): MasterTutorialFeature => ({
  id: masterTutorialId,
  title: 'Tutorial Aplikasi',
  descriptionId: 'Panduan klik target dari dashboard sampai semua fitur utama.',
  aliases: ['tutorial', 'mulai tutorial', 'tour'],
  steps: curriculum.flatMap((feature) =>
    feature.steps
      .filter((step) => !isLogoutTutorialStep(step))
      .map((step) => ({
        ...step,
        id: `${feature.id}--${step.id}`,
        title: `${feature.title}: ${step.title}`,
      })),
  ),
});

const getTutorialRuntimeContext = (deviceProfile?: TutorialDeviceProfile): TutorialRuntimeContext => {
  const resolvedProfile = resolveDeviceProfile(deviceProfile);
  const isMobile = resolvedProfile === 'mobile';
  const curriculum = isMobile ? TUTORIAL_CURRICULUM_MOBILE : TUTORIAL_CURRICULUM;
  const masterTutorialId: MasterTutorialId = isMobile ? 'all-mobile' : 'all';

  return {
    deviceProfile: resolvedProfile,
    curriculum,
    masterTutorialId,
    masterFeature: buildMasterTutorialFeature(curriculum, masterTutorialId),
  };
};

const getStepFeatureId = (stepId: string): string => {
  const delimiterIndex = stepId.indexOf('--');
  if (delimiterIndex < 0) return '';
  return stepId.slice(0, delimiterIndex);
};

const encodeTutorialScope = (scope: TutorialScopeInfo): string | undefined => {
  const normalizedFeatureId = scope.featureId?.trim();
  const normalizedRoutePath = normalizePath(scope.routePath);
  if (!normalizedFeatureId && !normalizedRoutePath) return undefined;
  if (!normalizedFeatureId) return undefined;
  if (!normalizedRoutePath) return normalizedFeatureId;
  return `${normalizedFeatureId}${TUTORIAL_SCOPE_ROUTE_SEPARATOR}${normalizedRoutePath}`;
};

const decodeTutorialScope = (scopeFeatureId?: string): TutorialScopeInfo => {
  const raw = scopeFeatureId?.trim();
  if (!raw) return {};
  const separatorIndex = raw.indexOf(TUTORIAL_SCOPE_ROUTE_SEPARATOR);
  if (separatorIndex < 0) {
    return { featureId: raw };
  }

  const featureId = raw.slice(0, separatorIndex).trim();
  const routePath = raw.slice(separatorIndex + TUTORIAL_SCOPE_ROUTE_SEPARATOR.length).trim();

  return {
    featureId: featureId || undefined,
    routePath: normalizePath(routePath) || undefined,
  };
};

const resolveScopeFeatureIdByPath = (
  curriculum: ReadonlyArray<TutorialFeature>,
  pathname?: string,
): string | undefined => {
  const normalizedPath = normalizePath(pathname);
  if (!normalizedPath) return undefined;

  let bestFeatureId: string | undefined;
  let bestScore = -1;

  for (const feature of curriculum) {
    for (const step of feature.steps) {
      const route = normalizePath(step.route);
      if (!route) continue;
      const isMatch = normalizedPath === route || normalizedPath.startsWith(`${route}/`);
      if (!isMatch) continue;
      const score = route.length;
      if (score > bestScore) {
        bestScore = score;
        bestFeatureId = feature.id;
      }
    }
  }

  return bestFeatureId;
};

const findStartStepIndexByPath = (feature: MasterTutorialFeature, pathname?: string): number => {
  const normalizedPath = normalizePath(pathname);
  if (!normalizedPath) return 0;

  const steps = feature.steps;
  const exactIndex = steps.findIndex((step) => normalizePath(step.route) === normalizedPath);
  if (exactIndex >= 0) return exactIndex;

  let bestIndex = -1;
  let bestScore = -1;
  steps.forEach((step, index) => {
    const route = normalizePath(step.route);
    if (!route) return;
    if (normalizedPath === route || normalizedPath.startsWith(`${route}/`)) {
      if (route.length > bestScore) {
        bestScore = route.length;
        bestIndex = index;
      }
    }
  });

  return bestIndex >= 0 ? bestIndex : 0;
};

const resolveScopeRouteByStepIndex = (feature: MasterTutorialFeature, stepIndex: number): string | undefined => {
  const boundedIndex = Math.min(feature.steps.length - 1, Math.max(0, stepIndex));
  const route = normalizePath(feature.steps[boundedIndex]?.route);
  return route || undefined;
};

const sanitizeProgress = (
  feature: MasterTutorialFeature,
  rawProgress: TutorialFeatureProgress | undefined,
): TutorialFeatureProgress => {
  const stepCount = feature.steps.length;
  const validStepIds = new Set(feature.steps.map((step) => step.id));
  const boundedIndex = Math.min(stepCount - 1, Math.max(0, rawProgress?.currentStepIndex ?? 0));
  const completedStepIds = Array.from(
    new Set((rawProgress?.completedStepIds ?? []).filter((stepId) => validStepIds.has(stepId))),
  );

  return {
    featureId: feature.id,
    scopeFeatureId:
      typeof rawProgress?.scopeFeatureId === 'string' ? rawProgress.scopeFeatureId : undefined,
    currentStepIndex: boundedIndex,
    completedStepIds,
    isCompleted: rawProgress?.isCompleted ?? false,
    completedAt: rawProgress?.completedAt,
    updatedAt: Date.now(),
  };
};

const loadMasterProgress = (context: TutorialRuntimeContext): TutorialFeatureProgress => {
  const progressMap = loadTutorialProgressMap();
  return sanitizeProgress(context.masterFeature, progressMap[context.masterTutorialId]);
};

const saveMasterProgress = (
  context: TutorialRuntimeContext,
  progress: TutorialFeatureProgress,
): void => {
  const progressMap = loadTutorialProgressMap();
  progressMap[context.masterTutorialId] = {
    ...progress,
    featureId: context.masterTutorialId,
    updatedAt: Date.now(),
  };
  saveTutorialProgressMap(progressMap);
  saveTutorialLastFeatureId(context.masterTutorialId);
};

const buildStepResult = (
  context: TutorialRuntimeContext,
  progress: TutorialFeatureProgress,
  options?: {
    prefixMessage?: string;
    targetStatus?: 'ready' | 'missing' | 'clicked' | 'wrong-click';
  },
): GuideModeResult => {
  const feature = context.masterFeature;
  const stepCount = feature.steps.length;
  const stepIndex = Math.min(stepCount - 1, Math.max(0, progress.currentStepIndex));
  const step = feature.steps[stepIndex];
  const advanceMode: TutorialAdvanceMode = step.advanceMode
    ? step.advanceMode
    : step.targetSelector
      ? 'on_target_click'
      : 'manual';

  const lines = [
    options?.prefixMessage,
    `${feature.title} - Step ${stepIndex + 1}/${stepCount}`,
    step.title,
    step.explanationId,
  ].filter(Boolean);

  return {
    mode: 'tutorial',
    reply: lines.join(' '),
    actions: [],
    suggestions: [],
    meta: {
      source: 'tutorial',
      tutorial: {
        deviceProfile: context.deviceProfile,
        featureId: feature.id,
        featureTitle: feature.title,
        stepIndex,
        stepCount,
        stepTitle: step.title,
        stepBody: step.explanationId,
        stepHint: step.hintId,
        autoNavigatePath: step.route,
        canNext: false,
        canBack: false,
        targetSelector: step.targetSelector,
        placement: step.placement ?? 'auto',
        fallbackPlacement: step.fallbackPlacement ?? 'top-right',
        highlightPadding: step.highlightPadding ?? 10,
        advanceMode,
        targetStatus: options?.targetStatus ?? 'ready',
        isCompleted: false,
      },
    },
  };
};

const buildCompletedResult = (
  context: TutorialRuntimeContext,
  options?: { prefixMessage?: string },
): GuideModeResult => {
  const feature = context.masterFeature;
  const stepCount = feature.steps.length;

  return {
    mode: 'tutorial',
    reply: [options?.prefixMessage, 'Tutorial selesai.'].filter(Boolean).join(' '),
    actions: [],
    suggestions: [],
    meta: {
      source: 'tutorial',
      tutorial: {
        deviceProfile: context.deviceProfile,
        featureId: feature.id,
        featureTitle: feature.title,
        stepIndex: stepCount - 1,
        stepCount,
        canNext: false,
        canBack: false,
        isCompleted: true,
        completionTitle: 'Tutorial Selesai',
        completionBody: 'Tutorial selesai.',
      },
    },
  };
};

const buildExitedResult = (context: TutorialRuntimeContext): GuideModeResult => ({
  mode: 'tutorial',
  reply: '',
  actions: [],
  suggestions: [],
  meta: {
    source: 'tutorial',
    tutorial: {
      deviceProfile: context.deviceProfile,
      isCompleted: true,
    },
  },
});

const buildRouteBlockedResult = (context: TutorialRuntimeContext): GuideModeResult => ({
  mode: 'tutorial',
  reply:
    'Tutorial hanya tersedia di Dashboard, Skill, Pronunciation, Alphabet, Phonetic Symbols, dan Symbol Detail.',
  actions: [
    { kind: 'route', label: 'Buka Dashboard', path: '/dashboard' },
    { kind: 'route', label: 'Buka Skill', path: '/skill' },
    { kind: 'route', label: 'Buka Phonetic Symbols', path: '/skill/pronunciation/phoneticSymbols' },
  ],
  suggestions: ['buka dashboard', 'buka skill', 'buka phonetic symbols'],
  meta: {
    source: 'tutorial',
    tutorial: {
      deviceProfile: context.deviceProfile,
      isCompleted: true,
      completionTitle: 'Tutorial Tidak Tersedia',
      completionBody:
        'Buka salah satu halaman tutorial yang didukung, lalu jalankan tutorial kembali.',
    },
  },
});

const openMasterTutorial = (
  context: TutorialRuntimeContext,
  options?: {
    restart?: boolean;
    prefixMessage?: string;
    pathname?: string;
  },
): GuideModeResult => {
  const current = loadMasterProgress(context);
  const startIndex = findStartStepIndexByPath(context.masterFeature, options?.pathname);
  const scopeFeatureId = resolveScopeFeatureIdByPath(context.curriculum, options?.pathname);
  const scopeRoutePath = resolveScopeRouteByStepIndex(context.masterFeature, startIndex);
  const nextScopeKey = encodeTutorialScope({
    featureId: scopeFeatureId,
    routePath: scopeRoutePath,
  });

  const hasProgress =
    current.isCompleted || current.currentStepIndex > 0 || current.completedStepIds.length > 0;
  const currentScope = decodeTutorialScope(current.scopeFeatureId);
  const incomingScope = decodeTutorialScope(nextScopeKey);
  const isScopeChanged =
    Boolean(incomingScope.featureId) &&
    (incomingScope.featureId !== currentScope.featureId ||
      incomingScope.routePath !== currentScope.routePath);
  const shouldReset = options?.restart || current.isCompleted || !hasProgress || isScopeChanged;

  const nextProgress: TutorialFeatureProgress = shouldReset
    ? {
        featureId: context.masterTutorialId,
        scopeFeatureId: nextScopeKey,
        currentStepIndex: startIndex,
        completedStepIds: [],
        isCompleted: false,
        completedAt: undefined,
        updatedAt: Date.now(),
      }
    : {
        ...current,
        scopeFeatureId: nextScopeKey ?? current.scopeFeatureId,
      };

  saveMasterProgress(context, nextProgress);

  return buildStepResult(context, nextProgress, {
    prefixMessage:
      options?.prefixMessage ??
      (shouldReset ? 'Tutorial dimulai dari awal.' : 'Lanjut tutorial dari langkah terakhir.'),
    targetStatus: 'ready',
  });
};

const getActiveStepContext = (context: TutorialRuntimeContext) => {
  const progress = loadMasterProgress(context);
  const stepCount = context.masterFeature.steps.length;
  const stepIndex = Math.min(stepCount - 1, Math.max(0, progress.currentStepIndex));
  const step = context.masterFeature.steps[stepIndex];
  const advanceMode: TutorialAdvanceMode = step.advanceMode
    ? step.advanceMode
    : step.targetSelector
      ? 'on_target_click'
      : 'manual';

  return { progress, advanceMode };
};

const stepNext = (context: TutorialRuntimeContext, prefixMessage?: string): GuideModeResult => {
  const current = loadMasterProgress(context);
  if (current.isCompleted) {
    return buildCompletedResult(context, { prefixMessage: prefixMessage ?? 'Tutorial sudah selesai.' });
  }

  const stepCount = context.masterFeature.steps.length;
  const currentStepIndex = Math.min(stepCount - 1, Math.max(0, current.currentStepIndex));

  const currentStepId = context.masterFeature.steps[currentStepIndex]?.id;
  const tutorialScope = decodeTutorialScope(current.scopeFeatureId);
  const scopedFeatureId = tutorialScope.featureId;
  const scopedRoutePath = tutorialScope.routePath;
  const nextStepIndex = currentStepIndex + 1;
  const nextStepId =
    nextStepIndex < stepCount ? context.masterFeature.steps[nextStepIndex]?.id : null;
  const nextStepRoute =
    nextStepIndex < stepCount ? normalizePath(context.masterFeature.steps[nextStepIndex]?.route) : '';
  const isScopeBoundaryReached =
    Boolean(scopedFeatureId) &&
    Boolean(nextStepId) &&
    getStepFeatureId(nextStepId ?? '') !== scopedFeatureId;
  const isRouteBoundaryReached =
    Boolean(scopedRoutePath) &&
    Boolean(nextStepRoute) &&
    nextStepRoute !== scopedRoutePath;

  if (currentStepIndex >= stepCount - 1 || isScopeBoundaryReached || isRouteBoundaryReached) {
    const lastStepId = context.masterFeature.steps[currentStepIndex]?.id;
    const completedStepIds = lastStepId
      ? Array.from(new Set([...current.completedStepIds, lastStepId]))
      : current.completedStepIds;

    const completedProgress: TutorialFeatureProgress = {
      ...current,
      currentStepIndex,
      completedStepIds,
      isCompleted: true,
      completedAt: Date.now(),
      updatedAt: Date.now(),
    };

    saveMasterProgress(context, completedProgress);
    return buildCompletedResult(context, {
      prefixMessage:
        prefixMessage ??
        (isScopeBoundaryReached || isRouteBoundaryReached
          ? 'Tutorial untuk halaman ini sudah selesai.'
          : 'Langkah terakhir selesai.'),
    });
  }

  const completedStepIds = currentStepId
    ? Array.from(new Set([...current.completedStepIds, currentStepId]))
    : current.completedStepIds;

  const nextProgress: TutorialFeatureProgress = {
    featureId: context.masterTutorialId,
    scopeFeatureId: current.scopeFeatureId,
    currentStepIndex: nextStepIndex,
    completedStepIds,
    isCompleted: false,
    completedAt: current.completedAt,
    updatedAt: Date.now(),
  };

  saveMasterProgress(context, nextProgress);
  return buildStepResult(context, nextProgress, { prefixMessage, targetStatus: 'ready' });
};

const handleTargetClicked = (context: TutorialRuntimeContext): GuideModeResult => {
  const { advanceMode, progress } = getActiveStepContext(context);

  if (progress.isCompleted) {
    return buildCompletedResult(context, { prefixMessage: 'Tutorial sudah selesai.' });
  }

  if (advanceMode !== 'on_target_click') {
    return buildStepResult(context, progress, {
      prefixMessage: 'Langkah ini berjalan otomatis. Tunggu sebentar untuk lanjut.',
      targetStatus: 'ready',
    });
  }

  return stepNext(context, 'Mantap, target sudah diklik.');
};

const handleTargetMissed = (context: TutorialRuntimeContext): GuideModeResult => {
  const { progress, advanceMode } = getActiveStepContext(context);

  if (progress.isCompleted) {
    return buildCompletedResult(context, { prefixMessage: 'Tutorial sudah selesai.' });
  }

  if (advanceMode !== 'on_target_click') {
    return buildStepResult(context, progress, {
      prefixMessage: 'Langkah ini tidak butuh klik target.',
      targetStatus: 'ready',
    });
  }

  return buildStepResult(context, progress, {
    prefixMessage: 'Klik belum tepat. Klik area yang bercahaya.',
    targetStatus: 'wrong-click',
  });
};

const handleTargetRetry = (context: TutorialRuntimeContext): GuideModeResult => {
  const { progress } = getActiveStepContext(context);

  if (progress.isCompleted) {
    return buildCompletedResult(context, { prefixMessage: 'Tutorial sudah selesai.' });
  }

  return buildStepResult(context, progress, {
    prefixMessage: 'Mendeteksi target ulang. Cari area biru yang disorot.',
    targetStatus: 'ready',
  });
};

const isCommand = (normalizedQuery: string, commands: Set<string>): boolean =>
  commands.has(normalizedQuery);

export const resolveTutorialMode = (
  query: string,
  options?: { pathname?: string; deviceProfile?: TutorialDeviceProfile },
): GuideModeResult => {
  const context = getTutorialRuntimeContext(options?.deviceProfile);
  const normalized = normalizeText(query);
  const pathname = normalizePath(options?.pathname);
  if (!isTutorialAllowedPath(pathname)) {
    return buildRouteBlockedResult(context);
  }

  if (isCommand(normalized, EXIT_COMMANDS)) {
    return buildExitedResult(context);
  }

  if (isCommand(normalized, NEXT_COMMANDS)) {
    return stepNext(context, 'Lanjut ke langkah berikutnya.');
  }

  if (isCommand(normalized, TARGET_CLICKED_COMMANDS)) {
    return handleTargetClicked(context);
  }

  if (isCommand(normalized, TARGET_MISSED_COMMANDS)) {
    return handleTargetMissed(context);
  }

  if (isCommand(normalized, TARGET_RETRY_COMMANDS)) {
    return handleTargetRetry(context);
  }

  if (isCommand(normalized, RESTART_COMMANDS)) {
    return openMasterTutorial(context, {
      restart: true,
      pathname,
      prefixMessage: 'Tutorial diulang dari langkah awal halaman ini.',
    });
  }

  if (!normalized || isCommand(normalized, CONTINUE_COMMANDS)) {
    return openMasterTutorial(context, { pathname });
  }

  const { progress } = getActiveStepContext(context);
  if (progress.isCompleted) {
    return openMasterTutorial(context, {
      restart: true,
      pathname,
      prefixMessage: 'Tutorial sebelumnya sudah selesai. Dimulai ulang dari halaman ini.',
    });
  }

  return buildStepResult(context, progress, {
    prefixMessage: 'Tutorial sedang berjalan. Klik area yang disorot untuk lanjut.',
    targetStatus: 'ready',
  });
};
