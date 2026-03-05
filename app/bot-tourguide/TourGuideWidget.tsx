'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/contexts/MemberAuthContext';
import { VOCABULARY_TOPICS } from '@/app/skill/vocabulary/topic/data/topics';
import {
  BOT_AI_STYLE_V1,
  DEFAULT_SUGGESTION_PROMPTS,
  getInitialGuideResult,
  resolveGuideIntent,
} from './intent';
import {
  saveTutorialOverlayPreference,
} from './engine/tutorial-session';
import { resetSpeakingPracticeSession } from './modes/speaking-practice';
import { GUIDE_SIMULATION_MAP, getSimulationByTopic } from './routeMap';
import { isTutorialAllowedPath } from './tutorial/tutorial-allowed-paths';
import TutorialCoachOverlay from './tutorial/TutorialCoachOverlay';
import SpeakingPracticeOverlay from './speaking-practice/SpeakingPracticeOverlay';
import LearningPathOverlay from './learning-path/LearningPathOverlay';
import type {
  GuideAction,
  GuideAnswerIntent,
  GuideMode,
  GuideModeResult,
  GuideSimulationTopic,
  TutorialDeviceProfile,
} from './types';
import './tourGuide.css';

type TourGuideWidgetProps = {
  currentPath: string;
};

const COLLAPSED_STORAGE_KEY = 'tourguide_collapsed';
const MODE_STORAGE_KEY = 'tourguide_mode';
const DASHBOARD_VIEW_STORAGE_KEY = 'dashboardCurrentView';
const ALPHABET_PAGE_PATH = '/skill/pronunciation/alphabet';
const PHONETIC_SYMBOLS_ROOT_PATH = '/skill/pronunciation/phoneticsymbols';
const PHONETIC_SYMBOLS_EXCLUDED_SUBROUTES = new Set([
  'minimalpairs',
  'summary-of-phonetic-symbols',
  'tongue-twister',
]);

const MODE_LABELS: Record<GuideMode, string> = {
  navigation: 'Navigasi',
  simulation: 'Simulasi',
  flashcard: 'Flashcard',
  qa: 'Tanya Materi',
  tutorial: 'Tutorial',
  'speaking-practice': 'Speaking Practice',
  'learning-path': 'Learning Path',
};

const MODES: GuideMode[] = [
  'navigation',
  'tutorial',
  'learning-path',
  'simulation',
  'flashcard',
  'qa',
  'speaking-practice',
];

const QA_ANSWER_TYPE_CHIP_LABEL: Record<GuideAnswerIntent, string> = {
  word_explanation: 'Istilah',
  direct_answer: 'Inti Jawaban',
  comparison: 'Perbandingan',
  how_to: 'Langkah',
  example_request: 'Contoh',
  clarification: 'Perlu Klarifikasi',
  fallback: 'Perjelas Kata Kunci',
};

const NAVIGATION_BAND_CHIP_LABEL: Record<'strong' | 'ambiguous' | 'weak', string> = {
  strong: 'Siap Navigasi',
  ambiguous: 'Pilih Tujuan',
  weak: 'Perjelas Tujuan',
};

const renderSimulationLoading = () => (
  <div className="tg-sim-empty">
    <p>Memuat simulasi...</p>
  </div>
);

const LazySEsSimulationOverlayPlayer = dynamic(
  () => import('./simulation/SEsSimulationOverlayPlayer'),
  {
    ssr: false,
    loading: renderSimulationLoading,
  },
);

const LazyDEdSimulationOverlayPlayer = dynamic(
  () => import('./simulation/DEdSimulationOverlayPlayer'),
  {
    ssr: false,
    loading: renderSimulationLoading,
  },
);

const getSimulationTitle = (topic: GuideSimulationTopic | null): string => {
  if (!topic) return 'Simulasi';
  return getSimulationByTopic(topic)?.title ?? 'Simulasi';
};

const isGuideMode = (value: string | null): value is GuideMode =>
  value === 'navigation' ||
  value === 'simulation' ||
  value === 'flashcard' ||
  value === 'qa' ||
  value === 'tutorial' ||
  value === 'speaking-practice' ||
  value === 'learning-path';

const parseYesNoAnswer = (input: string): boolean | null => {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  const yesSet = new Set(['yes', 'y', 'iya', 'ya', 'betul', 'benar', 'oke', 'ok', 'setuju']);
  const noSet = new Set(['no', 'n', 'tidak', 'nggak', 'enggak', 'ga', 'gak', 'nope']);

  if (yesSet.has(normalized)) return true;
  if (noSet.has(normalized)) return false;
  return null;
};

const resolveTutorialDeviceProfile = (): TutorialDeviceProfile => {
  if (typeof window === 'undefined') return 'desktop';
  return window.innerWidth <= 390 ? 'mobile' : 'desktop';
};

const FLASHCARD_DEFAULT_ROUTE = '/skill/vocabulary/flashcard';
const FLASHCARD_ALPHABET_ROUTE = '/skill/pronunciation/flashcard/alphabet';
const FLASHCARD_PHONETIC_SYMBOLS_ROUTE = '/skill/pronunciation/flashcard/phonetic-symbols';

type FlashcardQuickOption = {
  label: string;
  path: string;
};

const FLASHCARD_QUICK_OPTIONS: FlashcardQuickOption[] = [
  { label: 'Vocabulary Flashcard (Topik Terakhir)', path: FLASHCARD_DEFAULT_ROUTE },
  { label: 'Flashcard Alphabet', path: FLASHCARD_ALPHABET_ROUTE },
  { label: 'Flashcard Phonetic Symbols', path: FLASHCARD_PHONETIC_SYMBOLS_ROUTE },
  ...VOCABULARY_TOPICS.map((topic) => ({
    label: `Vocabulary: ${topic.title}`,
    path: `${FLASHCARD_DEFAULT_ROUTE}/${topic.topicId}`,
  })),
];

const SIMULATION_DEFAULT_TOPIC: GuideSimulationTopic =
  GUIDE_SIMULATION_MAP[0]?.topicId ?? 'final-sound-s-es';

type SimulationQuickOption = {
  label: string;
  topicId: GuideSimulationTopic;
};

const SIMULATION_QUICK_OPTIONS: SimulationQuickOption[] = GUIDE_SIMULATION_MAP.map((entry) => ({
  label: entry.title,
  topicId: entry.topicId,
}));

const normalizePathname = (value: string): string => {
  const cleaned = value.split('#')[0]?.split('?')[0]?.trim() ?? '';
  if (!cleaned) return '';
  return cleaned.length > 1 && cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
};

const isPhoneticSymbolDetailRoute = (pathname: string): boolean => {
  const normalizedPath = normalizePathname(pathname).toLowerCase();
  const detailPrefix = `${PHONETIC_SYMBOLS_ROOT_PATH}/`;
  if (!normalizedPath.startsWith(detailPrefix)) return false;

  const slug = normalizedPath.slice(detailPrefix.length);
  if (!slug || slug.includes('/')) return false;
  return !PHONETIC_SYMBOLS_EXCLUDED_SUBROUTES.has(slug);
};

const isTutorialRouteAligned = (stepPath: string | undefined, pathname: string): boolean => {
  if (!stepPath) return true;
  const normalizedStep = normalizePathname(stepPath);
  const normalizedPathname = normalizePathname(pathname);
  if (!normalizedStep || !normalizedPathname) return false;
  return (
    normalizedPathname === normalizedStep ||
    normalizedPathname.startsWith(`${normalizedStep}/`)
  );
};

const isRouteTargetAligned = (
  targetPath: string,
  pathname: string,
  searchParams: URLSearchParams,
): boolean => {
  const targetUrl = new URL(targetPath, 'http://local');
  const targetPathname = normalizePathname(targetUrl.pathname);
  const currentPathname = normalizePathname(pathname);
  if (targetPathname !== currentPathname) return false;

  const entries = Array.from(targetUrl.searchParams.entries());
  if (entries.length === 0) return true;

  return entries.every(([key, value]) => searchParams.get(key) === value);
};

const getSimulationPlayer = (topic: GuideSimulationTopic | null) => {
  if (!topic) return null;
  if (topic === 'final-sound-s-es') {
    return <LazySEsSimulationOverlayPlayer />;
  }
  if (topic === 'final-sound-d-ed') {
    return <LazyDEdSimulationOverlayPlayer />;
  }

  return (
    <div className="tg-sim-empty">
      <p>Player simulasi untuk topik ini belum tersedia.</p>
    </div>
  );
};

export default function TourGuideWidget({ currentPath }: TourGuideWidgetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut } = useAuth();
  const hasRestoredStateRef = useRef(false);
  const lastTutorialNavigationRef = useRef('');
  const lastNavigationAutoKeyRef = useRef('');
  const pendingNavigationPathRef = useRef<string | null>(null);
  const lastPathRef = useRef(currentPath);
  const tutorialTransitionTimerRef = useRef<number | null>(null);
  const tutorialPendingPathRef = useRef<string | null>(null);
  const navigationPulseTimerRef = useRef<number | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [mode, setMode] = useState<GuideMode>('navigation');
  const [pendingMode, setPendingMode] = useState<GuideMode>('navigation');
  const [isTutorialPageTransition, setIsTutorialPageTransition] = useState(false);
  const [isTutorialRoutePending, setIsTutorialRoutePending] = useState(false);
  const [query, setQuery] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState({ query: '', id: 0 });
  const [activeSimulation, setActiveSimulation] = useState<GuideSimulationTopic | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNavigationPulse, setIsNavigationPulse] = useState(false);
  const [tutorialDeviceProfile, setTutorialDeviceProfile] = useState<TutorialDeviceProfile | null>(
    null,
  );
  const [displayResult, setDisplayResult] = useState<GuideModeResult>(() =>
    getInitialGuideResult('navigation', { pathname: currentPath }),
  );
  const [typedReply, setTypedReply] = useState(displayResult.reply);
  const [selectedFlashcardPath, setSelectedFlashcardPath] = useState<string>(FLASHCARD_DEFAULT_ROUTE);
  const [selectedSimulationTopic, setSelectedSimulationTopic] =
    useState<GuideSimulationTopic>(SIMULATION_DEFAULT_TOPIC);

  const startTutorialTransition = useCallback((durationMs = 320) => {
    setIsTutorialPageTransition(true);
    if (tutorialTransitionTimerRef.current !== null) {
      window.clearTimeout(tutorialTransitionTimerRef.current);
    }
    tutorialTransitionTimerRef.current = window.setTimeout(() => {
      setIsTutorialPageTransition(false);
      tutorialTransitionTimerRef.current = null;
    }, durationMs);
  }, []);

  const triggerNavigationPulse = useCallback((durationMs = 900) => {
    setIsNavigationPulse(true);
    if (navigationPulseTimerRef.current !== null) {
      window.clearTimeout(navigationPulseTimerRef.current);
    }
    navigationPulseTimerRef.current = window.setTimeout(() => {
      setIsNavigationPulse(false);
      navigationPulseTimerRef.current = null;
    }, durationMs);
  }, []);

  const isTutorialModeAllowed = useMemo(() => isTutorialAllowedPath(currentPath), [currentPath]);
  const availableModes = useMemo(
    () => (isTutorialModeAllowed ? MODES : MODES.filter((item) => item !== 'tutorial')),
    [isTutorialModeAllowed],
  );
  const modeTitle = useMemo(() => MODE_LABELS[mode], [mode]);
  const activeTutorialDeviceProfile =
    mode === 'tutorial' ? tutorialDeviceProfile ?? resolveTutorialDeviceProfile() : undefined;
  const result = useMemo(
    () =>
      submittedRequest.query.trim().length
        ? resolveGuideIntent(submittedRequest.query, {
            mode,
            pathname: currentPath,
            deviceProfile: activeTutorialDeviceProfile,
          })
        : getInitialGuideResult(mode, {
            pathname: currentPath,
            deviceProfile: activeTutorialDeviceProfile,
          }),
    [activeTutorialDeviceProfile, currentPath, mode, submittedRequest],
  );

  const closeSimulationOverlay = useCallback(() => {
    setActiveSimulation(null);
  }, []);

  const executeLogout = useCallback(async () => {
    setActiveSimulation(null);
    setIsNavigating(false);
    pendingNavigationPathRef.current = null;
    setCollapsed(true);
    setMode('navigation');
    setQuery('');
    setSubmittedRequest({ query: '', id: 0 });
    lastNavigationAutoKeyRef.current = '';

    try {
      await signOut();
    } catch (error) {
      console.error('TourGuide logout error:', error);
    } finally {
      router.replace('/login');
    }
  }, [router, signOut]);

  const openDashboardView = useCallback(
    (viewId: string) => {
      try {
        window.localStorage.setItem(DASHBOARD_VIEW_STORAGE_KEY, viewId);
        window.dispatchEvent(
          new CustomEvent('geuwat:dashboard-view', {
            detail: { viewId },
          }),
        );
      } catch (error) {
        console.error('TourGuide dashboard view sync error:', error);
      }

      if (normalizePathname(currentPath) !== '/dashboard') {
        router.push('/dashboard');
      }

      setActiveSimulation(null);
      setIsNavigating(false);
      pendingNavigationPathRef.current = null;
      setCollapsed(true);
    },
    [currentPath, router],
  );

  useEffect(() => {
    const storedCollapsed = window.localStorage.getItem(COLLAPSED_STORAGE_KEY);
    const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
    const isStoredTutorialMode = storedMode === 'tutorial';

    queueMicrotask(() => {
      if (storedCollapsed === '0' && !isStoredTutorialMode) {
        setCollapsed(false);
      }
      if (isGuideMode(storedMode) && storedMode !== 'tutorial') {
        setMode(storedMode);
      }
      if (isStoredTutorialMode) {
        setMode('navigation');
        setCollapsed(true);
        saveTutorialOverlayPreference('closed');
        window.localStorage.setItem(MODE_STORAGE_KEY, 'navigation');
        window.localStorage.setItem(COLLAPSED_STORAGE_KEY, '1');
      }
      hasRestoredStateRef.current = true;
    });
  }, []);

  useEffect(() => {
    if (!hasRestoredStateRef.current) return;
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    if (!hasRestoredStateRef.current) return;
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'tutorial' && tutorialDeviceProfile !== null) {
      setTutorialDeviceProfile(null);
    }
  }, [mode, tutorialDeviceProfile]);

  useEffect(() => {
    if (!SIMULATION_QUICK_OPTIONS.length) return;
    const hasSelectedTopic = SIMULATION_QUICK_OPTIONS.some(
      (option) => option.topicId === selectedSimulationTopic,
    );
    if (hasSelectedTopic) return;
    setSelectedSimulationTopic(SIMULATION_QUICK_OPTIONS[0].topicId);
  }, [selectedSimulationTopic]);

  useEffect(() => {
    setPendingMode(mode);
  }, [mode]);

  useEffect(() => {
    if (pendingMode !== 'tutorial') return;
    if (isTutorialModeAllowed) return;
    setPendingMode('navigation');
  }, [isTutorialModeAllowed, pendingMode]);

  useEffect(() => {
    if (mode !== 'tutorial') return;
    if (isTutorialModeAllowed) return;

    tutorialPendingPathRef.current = null;
    lastTutorialNavigationRef.current = '';
    setIsTutorialPageTransition(false);
    setIsTutorialRoutePending(false);
    setMode('navigation');
    setPendingMode('navigation');
    setQuery('');
    setSubmittedRequest({ query: '', id: 0 });
  }, [isTutorialModeAllowed, mode]);

  useEffect(() => {
    if (!hasRestoredStateRef.current) return;
    if (mode !== 'tutorial') return;
    saveTutorialOverlayPreference(collapsed ? 'closed' : 'open');
  }, [collapsed, mode]);

  useEffect(() => {
    return () => {
      if (tutorialTransitionTimerRef.current !== null) {
        window.clearTimeout(tutorialTransitionTimerRef.current);
      }
      if (navigationPulseTimerRef.current !== null) {
        window.clearTimeout(navigationPulseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mode !== 'tutorial') {
      queueMicrotask(() => {
        setIsTutorialPageTransition(false);
        setIsTutorialRoutePending(false);
      });
      tutorialPendingPathRef.current = null;
      lastPathRef.current = currentPath;
      return;
    }

    const previousPath = normalizePathname(lastPathRef.current).toLowerCase();
    const nextPath = normalizePathname(currentPath).toLowerCase();
    const isEnteringAlphabetFromAnotherRoute =
      previousPath !== nextPath && nextPath === ALPHABET_PAGE_PATH;
    const isEnteringPhoneticDetailFromAnotherRoute =
      previousPath !== nextPath &&
      !isPhoneticSymbolDetailRoute(previousPath) &&
      isPhoneticSymbolDetailRoute(nextPath);

    if (isEnteringAlphabetFromAnotherRoute || isEnteringPhoneticDetailFromAnotherRoute) {
      lastPathRef.current = currentPath;
      tutorialPendingPathRef.current = null;
      lastTutorialNavigationRef.current = '';
      queueMicrotask(() => {
        setIsTutorialPageTransition(false);
        setIsTutorialRoutePending(false);
        setCollapsed(true);
        setMode('navigation');
        setPendingMode('navigation');
        setQuery('');
        setSubmittedRequest({ query: '', id: 0 });
      });
      return;
    }

    if (lastPathRef.current === currentPath) {
      return;
    }

    lastPathRef.current = currentPath;
    const pendingPath = tutorialPendingPathRef.current;
    if (pendingPath) {
      const isArrivedAtPendingPath = isTutorialRouteAligned(pendingPath, currentPath);
      if (isArrivedAtPendingPath) {
        tutorialPendingPathRef.current = null;
        queueMicrotask(() => {
          setIsTutorialRoutePending(false);
          startTutorialTransition(420);
        });
        return;
      }
    }

    queueMicrotask(() => {
      startTutorialTransition(320);
    });
  }, [currentPath, mode, startTutorialTransition]);

  useEffect(() => {
    const shouldAnimateThinking =
      BOT_AI_STYLE_V1 && result.mode === 'qa' && submittedRequest.query.trim().length > 0;
    let bootstrapTimeout: number | undefined;

    if (!shouldAnimateThinking) {
      bootstrapTimeout = window.setTimeout(() => {
        setIsThinking(false);
        setDisplayResult(result);
      }, 0);
      return () => {
        if (bootstrapTimeout) {
          window.clearTimeout(bootstrapTimeout);
        }
      };
    }

    bootstrapTimeout = window.setTimeout(() => {
      setIsThinking(true);
    }, 0);

    const delay = 300 + Math.floor(Math.random() * 501);
    const timeout = window.setTimeout(() => {
      setDisplayResult(result);
      setIsThinking(false);
    }, delay);

    return () => {
      if (bootstrapTimeout) {
        window.clearTimeout(bootstrapTimeout);
      }
      window.clearTimeout(timeout);
    };
  }, [result, submittedRequest.query]);

  useEffect(() => {
    let bootstrapTimeout: number | undefined;

    if (isThinking) {
      bootstrapTimeout = window.setTimeout(() => {
        setTypedReply('');
      }, 0);
      return () => {
        if (bootstrapTimeout) {
          window.clearTimeout(bootstrapTimeout);
        }
      };
    }

    const fullText = displayResult.reply;
    const shouldType =
      BOT_AI_STYLE_V1 && displayResult.mode === 'qa' && submittedRequest.query.trim().length > 0;
    if (!shouldType) {
      bootstrapTimeout = window.setTimeout(() => {
        setTypedReply(fullText);
      }, 0);
      return () => {
        if (bootstrapTimeout) {
          window.clearTimeout(bootstrapTimeout);
        }
      };
    }

    bootstrapTimeout = window.setTimeout(() => {
      setTypedReply('');
    }, 0);

    let index = 0;
    const interval = window.setInterval(() => {
      index = Math.min(fullText.length, index + 3);
      setTypedReply(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(interval);
      }
    }, 14);

    return () => {
      if (bootstrapTimeout) {
        window.clearTimeout(bootstrapTimeout);
      }
      window.clearInterval(interval);
    };
  }, [displayResult, isThinking, submittedRequest.query]);

  useEffect(() => {
    if (!activeSimulation) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeSimulation]);

  useEffect(() => {
    if (!activeSimulation) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSimulationOverlay();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSimulation, closeSimulationOverlay]);

  useEffect(() => {
    if (!isNavigating) return;
    const pendingPath = pendingNavigationPathRef.current;
    if (!pendingPath) {
      setIsNavigating(false);
      return;
    }

    const currentSearchParams = new URLSearchParams(searchParams.toString());
    if (!isRouteTargetAligned(pendingPath, currentPath, currentSearchParams)) {
      return;
    }

    pendingNavigationPathRef.current = null;
    setIsNavigating(false);
    setCollapsed(true);
  }, [currentPath, isNavigating, searchParams]);

  useEffect(() => {
    if (mode !== 'tutorial') {
      lastTutorialNavigationRef.current = '';
      return;
    }
    if (collapsed) return;
    if (isThinking) return;

    const tutorialMeta = displayResult.meta?.tutorial;
    const targetPath = tutorialMeta?.autoNavigatePath;
    if (!targetPath || isTutorialRouteAligned(targetPath, currentPath)) return;

    const navKey = `${tutorialMeta?.featureId ?? 'unknown'}:${tutorialMeta?.stepIndex ?? -1}:${targetPath}`;
    if (lastTutorialNavigationRef.current === navKey) return;

    lastTutorialNavigationRef.current = navKey;
    tutorialPendingPathRef.current = normalizePathname(targetPath);
    queueMicrotask(() => {
      setIsTutorialRoutePending(true);
      startTutorialTransition(320);
    });
    router.push(targetPath);
  }, [collapsed, currentPath, displayResult, isThinking, mode, router, startTutorialTransition]);

  useEffect(() => {
    const normalizedPath = normalizePathname(currentPath);
    if (!normalizedPath) return;

    const hasExactOption = FLASHCARD_QUICK_OPTIONS.some((option) => option.path === normalizedPath);
    if (hasExactOption) {
      setSelectedFlashcardPath(normalizedPath);
      return;
    }

    if (normalizedPath.startsWith(`${FLASHCARD_DEFAULT_ROUTE}/`)) {
      setSelectedFlashcardPath(normalizedPath);
    }
  }, [currentPath]);

  const runQuery = useCallback((input: string) => {
    setSubmittedRequest((prev) => ({ query: input, id: prev.id + 1 }));
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const confirmationAnswer = parseYesNoAnswer(query);
    if (displayResult.confirmation && confirmationAnswer !== null) {
      void handleConfirmation(confirmationAnswer);
      return;
    }

    if (mode === 'navigation' && query.trim().length > 0) {
      triggerNavigationPulse();
    }
    runQuery(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    runQuery(suggestion);
  };

  const handleClarificationOptionClick = (option: string) => {
    setQuery(option);
    runQuery(option);
  };

  const handleActionClick = useCallback(
    (action: GuideAction) => {
      if (action.kind === 'simulation') {
        setActiveSimulation(action.simulationTopic);
        return;
      }

      if (action.kind === 'dashboard-view') {
        openDashboardView(action.viewId);
        return;
      }

      if (action.kind === 'logout') {
        void executeLogout();
        return;
      }

      setActiveSimulation(null);
      const currentSearchParams = new URLSearchParams(searchParams.toString());
      if (isRouteTargetAligned(action.path, currentPath, currentSearchParams)) {
        pendingNavigationPathRef.current = null;
        setIsNavigating(false);
        return;
      }
      pendingNavigationPathRef.current = action.path;
      setIsNavigating(true);
      void router.prefetch(action.path);
      router.push(action.path);
    },
    [currentPath, executeLogout, openDashboardView, router, searchParams],
  );

  const handleFlashcardDropdownOpen = useCallback(() => {
    handleActionClick({ kind: 'route', label: 'Buka Flashcard', path: selectedFlashcardPath });
  }, [handleActionClick, selectedFlashcardPath]);

  const handleSimulationDropdownOpen = useCallback(() => {
    handleActionClick({
      kind: 'simulation',
      label: `Buka Simulasi: ${getSimulationTitle(selectedSimulationTopic)}`,
      simulationTopic: selectedSimulationTopic,
    });
  }, [handleActionClick, selectedSimulationTopic]);

  useEffect(() => {
    if (mode !== 'navigation') {
      lastNavigationAutoKeyRef.current = '';
      return;
    }
    if (collapsed) return;
    if (isThinking) return;
    if (!submittedRequest.query.trim().length) return;
    if (displayResult.confirmation) return;

    const navigationMeta = displayResult.meta?.navigation;
    if (!navigationMeta?.shouldAutoNavigate) return;

    const targetAction = displayResult.actions[0];
    if (!targetAction) return;

    const actionKey =
      targetAction.kind === 'route'
        ? `route:${targetAction.path}`
        : targetAction.kind === 'dashboard-view'
          ? `dashboard-view:${targetAction.viewId}`
          : targetAction.kind === 'logout'
            ? 'logout'
            : `simulation:${targetAction.simulationTopic}`;
    const autoKey = `${submittedRequest.id}:${actionKey}`;
    if (lastNavigationAutoKeyRef.current === autoKey) return;

    lastNavigationAutoKeyRef.current = autoKey;
    handleActionClick(targetAction);
  }, [collapsed, displayResult, handleActionClick, isThinking, mode, submittedRequest.id, submittedRequest.query]);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeSimulationOverlay();
    }
  };

  const handleModeChange = (nextMode: GuideMode) => {
    if (nextMode === 'tutorial' && !isTutorialModeAllowed) {
      setTutorialDeviceProfile(null);
      setMode('navigation');
      setPendingMode('navigation');
      setQuery('');
      setSubmittedRequest({ query: '', id: 0 });
      return;
    }

    if (mode === 'speaking-practice' && nextMode !== 'speaking-practice') {
      resetSpeakingPracticeSession();
    }
    lastNavigationAutoKeyRef.current = '';
    pendingNavigationPathRef.current = null;
    setIsNavigating(false);

    if (nextMode === 'tutorial') {
      const lockedTutorialProfile = resolveTutorialDeviceProfile();
      setTutorialDeviceProfile(lockedTutorialProfile);
      setMode(nextMode);
      setCollapsed(false);
      setQuery('restart');
      runQuery('restart');
      return;
    }

    setTutorialDeviceProfile(null);

    if (nextMode === 'speaking-practice') {
      resetSpeakingPracticeSession();
      setMode(nextMode);
      setCollapsed(false);
      setQuery('');
      setSubmittedRequest({ query: '', id: 0 });
      return;
    }

    if (nextMode === 'learning-path') {
      setMode(nextMode);
      setCollapsed(false);
      setQuery('');
      setSubmittedRequest({ query: '', id: 0 });
      return;
    }

    setMode(nextMode);
    setQuery('');
    setSubmittedRequest({ query: '', id: 0 });
  };

  const handleTutorialCommand = (command: string) => {
    const normalized = command.trim().toLowerCase();
    if (
      normalized === 'exit tutorial' ||
      normalized === 'keluar tutorial' ||
      normalized === 'tutup tutorial' ||
      normalized === 'x'
    ) {
      tutorialPendingPathRef.current = null;
      lastNavigationAutoKeyRef.current = '';
      setCollapsed(true);
      setMode('navigation');
      setIsTutorialRoutePending(false);
      setQuery('');
      setSubmittedRequest({ query: '', id: 0 });
      return;
    }

    if (normalized === 'tutorial:target-clicked' || normalized === 'tutorial target clicked') {
      startTutorialTransition(360);
    }

    setQuery(command);
    runQuery(command);
  };

  const handleSpeakingPracticeCommand = useCallback((command: string) => {
    const normalized = command.trim().toLowerCase();
    if (
      normalized === 'exit speaking practice' ||
      normalized === 'keluar speaking practice' ||
      normalized === 'tutup speaking practice' ||
      normalized === 'x'
    ) {
      resetSpeakingPracticeSession();
      lastNavigationAutoKeyRef.current = '';
      setCollapsed(true);
      setMode('navigation');
      setQuery('');
      setSubmittedRequest({ query: '', id: 0 });
      return;
    }

    setQuery(command);
    runQuery(command);
  }, [runQuery]);

  const handleConfirmation = useCallback(
    async (accepted: boolean) => {
      const confirmation = displayResult.confirmation;
      if (!confirmation) return;

      if (confirmation.kind === 'logout') {
        if (accepted) {
          await executeLogout();
          return;
        }

        setQuery('');
        setSubmittedRequest({ query: '', id: 0 });
        return;
      }

      if (accepted) {
        const correctedQuery = confirmation.correctedQuery;
        setQuery(correctedQuery);
        runQuery(correctedQuery);
        return;
      }

      setQuery('');
      setSubmittedRequest({ query: '', id: 0 });
    },
    [displayResult.confirmation, executeLogout, runQuery],
  );

  const activeResult = displayResult;
  const isAvatarNavigating = isNavigating || isNavigationPulse;
  const activeChips = !isThinking
    ? [
        activeResult.mode === 'qa' && activeResult.meta?.answerType
          ? {
              key: `qa-${activeResult.meta.answerType}`,
              label: QA_ANSWER_TYPE_CHIP_LABEL[activeResult.meta.answerType],
              tone: 'qa' as const,
            }
          : null,
        activeResult.mode === 'navigation' && activeResult.meta?.navigation?.confidenceBand
          ? {
              key: `nav-${activeResult.meta.navigation.confidenceBand}`,
              label: NAVIGATION_BAND_CHIP_LABEL[activeResult.meta.navigation.confidenceBand],
              tone: `nav-${activeResult.meta.navigation.confidenceBand}` as const,
            }
          : null,
      ].filter((chip): chip is { key: string; label: string; tone: 'qa' | 'nav-strong' | 'nav-ambiguous' | 'nav-weak' } =>
        Boolean(chip),
      )
    : [];
  const tutorialRouteAligned = isTutorialRouteAligned(
    activeResult.meta?.tutorial?.autoNavigatePath,
    currentPath,
  );
  const activeReply = isNavigating
    ? 'Membuka halaman tujuan...'
    : isThinking
      ? 'GEUWAT sedang menyusun jawaban...'
      : typedReply || activeResult.reply;
  const activeSuggestions = isThinking
    ? DEFAULT_SUGGESTION_PROMPTS
    : activeResult.suggestions.length
      ? activeResult.suggestions
      : DEFAULT_SUGGESTION_PROMPTS;
  const hasInteractiveActions = !isThinking && activeResult.actions.length > 0;
  const hasInteractiveSources = !isThinking && Boolean(activeResult.sources?.length);
  const hasPendingModeChange = pendingMode !== mode;
  const shouldShowSuggestions =
    !isThinking &&
    !activeResult.confirmation &&
    !activeResult.clarification &&
    !hasInteractiveActions &&
    !hasInteractiveSources;
  const visibleSuggestions = shouldShowSuggestions ? activeSuggestions.slice(0, 3) : [];
  useEffect(() => {
    if (mode !== 'tutorial') return;
    if (collapsed) return;
    if (isTutorialPageTransition) return;
    if (isThinking) return;

    const tutorialMeta = displayResult.meta?.tutorial;
    if (!tutorialMeta || tutorialMeta.isCompleted) return;
    if (tutorialMeta.advanceMode !== 'manual') return;

    const timeout = window.setTimeout(() => {
      runQuery('next');
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [collapsed, displayResult, isThinking, isTutorialPageTransition, mode, runQuery]);

  useEffect(() => {
    if (mode !== 'tutorial') return;
    if (collapsed) return;
    if (isTutorialPageTransition) return;
    if (isThinking) return;

    const tutorialMeta = displayResult.meta?.tutorial;
    if (!tutorialMeta?.isCompleted) return;

    const timeout = window.setTimeout(() => {
      lastNavigationAutoKeyRef.current = '';
      setCollapsed(true);
      setMode('navigation');
      setQuery('');
      setSubmittedRequest({ query: '', id: 0 });
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [collapsed, displayResult, isThinking, isTutorialPageTransition, mode]);

  const isBotActive = !collapsed;

  return (
    <>
      {collapsed ? (
        <button
          type="button"
          aria-label="Buka Tour Guide"
          className={`tg-avatar-button ${isAvatarNavigating ? 'is-navigating' : ''}`}
          onClick={() => setCollapsed(false)}
        >
          <Image
            src="/Kepala1.png"
            alt="Tour Guide"
            width={48}
            height={48}
            className="tg-avatar-image tg-avatar-image--idle"
            priority
          />
        </button>
      ) : mode === 'tutorial' && isTutorialModeAllowed ? (
        isTutorialPageTransition || isTutorialRoutePending || !tutorialRouteAligned ? null : (
          <TutorialCoachOverlay
            activeResult={activeResult}
            onRunCommand={handleTutorialCommand}
          />
        )
      ) : mode === 'speaking-practice' ? (
        <SpeakingPracticeOverlay
          activeResult={activeResult}
          onRunCommand={handleSpeakingPracticeCommand}
          onClose={() => {
            resetSpeakingPracticeSession();
            lastNavigationAutoKeyRef.current = '';
            setCollapsed(true);
            setMode('navigation');
            setQuery('');
            setSubmittedRequest({ query: '', id: 0 });
          }}
        />
      ) : mode === 'learning-path' ? (
        <LearningPathOverlay
          activeResult={activeResult}
          onClose={() => {
            lastNavigationAutoKeyRef.current = '';
            setCollapsed(true);
            setMode('navigation');
            setQuery('');
            setSubmittedRequest({ query: '', id: 0 });
          }}
        />
      ) : (
        <aside className="tg-panel" role="dialog" aria-label="Tour Guide Widget">
          <header className="tg-panel-header">
            <button
              type="button"
              aria-label="Collapse Tour Guide"
              className={`tg-panel-avatar-button ${isBotActive ? 'is-active' : ''} ${isAvatarNavigating ? 'is-navigating' : ''}`}
              onClick={() => setCollapsed(true)}
            >
              <Image
                src="/Kepala1.png"
                alt="Tour Guide"
                width={40}
                height={40}
                className={`tg-avatar-image ${isBotActive ? 'tg-avatar-image--active' : 'tg-avatar-image--idle'}`}
              />
            </button>
            <div className="tg-panel-title-wrap">
              <h3 className="tg-panel-title">GEUWAT</h3>
              <p className="tg-panel-subtitle">Mode: {modeTitle}</p>
            </div>
            <button type="button" className="tg-hide-button" onClick={() => setCollapsed(true)}>
              Hide
            </button>
          </header>

          <div className="tg-mode-switcher" aria-label="Mode Tour Guide">
            <label className="tg-mode-select-wrap">
              <span className="tg-mode-select-label">Mode</span>
              <select
                id="tg-mode-select"
                name="tgMode"
                className="tg-mode-select"
                value={pendingMode}
                onChange={(event) => setPendingMode(event.target.value as GuideMode)}
              >
                {availableModes.map((item) => (
                  <option key={item} value={item}>
                    {MODE_LABELS[item]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={`tg-mode-switch-button ${hasPendingModeChange ? 'is-pending' : ''}`}
              onClick={() => handleModeChange(pendingMode)}
              disabled={!hasPendingModeChange}
            >
              Switch
            </button>
          </div>

          {mode === 'flashcard' ? (
            <div className="tg-flashcard-picker" aria-label="Pilih target flashcard">
              <label className="tg-flashcard-picker-wrap">
                <span className="tg-mode-select-label">Flashcard</span>
                <select
                  id="tg-flashcard-select"
                  name="tgFlashcardPath"
                  className="tg-flashcard-select"
                  value={selectedFlashcardPath}
                  onChange={(event) => setSelectedFlashcardPath(event.target.value)}
                >
                  {FLASHCARD_QUICK_OPTIONS.map((option) => (
                    <option key={option.path} value={option.path}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="tg-flashcard-open-button"
                onClick={handleFlashcardDropdownOpen}
              >
                Buka
              </button>
            </div>
          ) : mode === 'simulation' ? (
            <div className="tg-flashcard-picker" aria-label="Pilih simulasi">
              <label className="tg-flashcard-picker-wrap">
                <span className="tg-mode-select-label">Simulasi</span>
                <select
                  id="tg-simulation-select"
                  name="tgSimulationTopic"
                  className="tg-flashcard-select"
                  value={selectedSimulationTopic}
                  onChange={(event) =>
                    setSelectedSimulationTopic(event.target.value as GuideSimulationTopic)
                  }
                  disabled={!SIMULATION_QUICK_OPTIONS.length}
                >
                  {SIMULATION_QUICK_OPTIONS.map((option) => (
                    <option key={option.topicId} value={option.topicId}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="tg-flashcard-open-button"
                onClick={handleSimulationDropdownOpen}
                disabled={!SIMULATION_QUICK_OPTIONS.length}
              >
                Buka
              </button>
            </div>
          ) : null}

          <form className="tg-form" onSubmit={handleSubmit}>
            <input
              id="tg-query-input"
              name="tgQuery"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                mode === 'navigation'
                  ? 'Contoh: "buka pronunciation"'
                  : mode === 'simulation'
                    ? 'Contoh: "simulasi final sound s/es" atau "simulasi final sound d/ed"'
                    : mode === 'flashcard'
                      ? 'Contoh: "flashcard kitchen"'
                      : 'Contoh: "apa itu american t?"'
              }
              className="tg-input"
            />
            <button type="submit" className="tg-send-button">
              Kirim
            </button>
          </form>

          <div className={`tg-reply ${isThinking ? 'is-thinking' : ''}`}>{activeReply}</div>

          {activeChips.length ? (
            <div className="tg-meta-chip-wrap" aria-label="Kategori jawaban bot">
              <p className="tg-section-label">Kategori jawaban</p>
              {activeChips.map((chip) => (
                <span key={chip.key} className={`tg-meta-chip tg-meta-chip--${chip.tone}`}>
                  {chip.label}
                </span>
              ))}
            </div>
          ) : null}

          {!isThinking && activeResult.confirmation ? (
            <div className="tg-confirm-chip-wrap" aria-label="Guide confirmation">
              <p className="tg-section-label">Konfirmasi</p>
              <button
                type="button"
                className="tg-confirm-chip"
                onClick={() => void handleConfirmation(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className="tg-confirm-chip"
                onClick={() => void handleConfirmation(false)}
              >
                No
              </button>
            </div>
          ) : null}

          {!isThinking && activeResult.clarification ? (
            <div className="tg-clarify-wrap">
              <p className="tg-clarify-title">{activeResult.clarification.question}</p>
              <p className="tg-section-label tg-section-label--inside">Pilih satu opsi</p>
              <div className="tg-clarify-chip-wrap">
                {activeResult.clarification.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="tg-clarify-chip"
                    onClick={() => handleClarificationOptionClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {!isThinking && activeResult.sources?.length ? (
            <div className="tg-source-list">
              <p className="tg-source-title">Buka sumber materi:</p>
              {activeResult.sources.map((source) => (
                <button
                  key={`${source.path}-${source.label}`}
                  type="button"
                  className="tg-source-button"
                  onClick={() =>
                    handleActionClick({ kind: 'route', label: source.label, path: source.path })
                  }
                >
                  {source.label}
                </button>
              ))}
            </div>
          ) : null}

          <div className="tg-action-list">
            {hasInteractiveActions ? <p className="tg-source-title">Aksi cepat:</p> : null}
            {(isThinking ? [] : activeResult.actions).map((action) => (
              <button
                key={
                  action.kind === 'route'
                    ? `${action.kind}-${action.path}`
                    : action.kind === 'dashboard-view'
                      ? `${action.kind}-${action.viewId}`
                      : action.kind === 'logout'
                        ? action.kind
                        : `${action.kind}-${action.simulationTopic}`
                }
                type="button"
                className="tg-action-button"
                onClick={() => handleActionClick(action)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="tg-suggestion-wrap">
            {visibleSuggestions.length ? (
              <p className="tg-source-title">Contoh pertanyaan:</p>
            ) : null}
            {visibleSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="tg-suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </aside>
      )}

      {activeSimulation ? (
        <div
          className="tg-sim-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={getSimulationTitle(activeSimulation)}
          onClick={handleOverlayClick}
        >
          <section className="tg-sim-shell">
            <header className="tg-sim-header">
              <h3 className="tg-sim-title">{getSimulationTitle(activeSimulation)}</h3>
              <button
                type="button"
                className="tg-sim-close"
                onClick={closeSimulationOverlay}
                aria-label="Close simulation"
              >
                Close
              </button>
            </header>
            <div className="tg-sim-content">{getSimulationPlayer(activeSimulation)}</div>
          </section>
        </div>
      ) : null}
    </>
  );
}
