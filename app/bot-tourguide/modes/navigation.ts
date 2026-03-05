import {
  GUIDE_ROUTE_MAP,
  getGuideRoutesByScope,
  getQuickActionRoutes,
  scopeFromPathname,
} from '../routeMap';
import { normalizeGuideText, parseGuideQuery } from '../engine/nlu';
import {
  DASHBOARD_VIEW_TARGETS,
  GRAMMAR_ROUTE_TARGETS,
  HUB_ROUTE_TARGETS,
  LOGOUT_TRIGGERS,
  PRONUNCIATION_ROUTE_TARGETS,
  SPEAKING_PHASE_TARGETS,
  SPEAKING_ROUTE_TARGETS,
  VOCABULARY_ROUTE_TARGETS,
  applyNavigationTypoRules,
} from './navigation-targets';
import type { GuideAction, GuideIndexedRoute, GuideModeResult } from '../types';

const OPEN_HINTS = [
  'buka',
  'open',
  'ke',
  'go',
  'goto',
  'lihat',
  'tampilkan',
  'masuk',
  'navigate',
];

const NOISE_WORDS = new Set([
  'dan',
  'yang',
  'untuk',
  'dengan',
  'pada',
  'di',
  'ke',
  'to',
  'and',
  'for',
  'the',
  'a',
  'an',
  'of',
  'in',
  'on',
  'at',
]);

const STRONG_SCORE_THRESHOLD = 85;
const AMBIGUOUS_SCORE_THRESHOLD = 55;
const AMBIGUOUS_GAP = 18;

const PRONUNCIATION_CONTEXT_TOKENS = [
  'pronunciation',
  'pelafalan',
  'phonetic',
  'ipa',
  'alphabet',
  'stressing',
  'stress',
  'intonation',
  'final sound',
  'american t',
  'flap',
  'glottal',
  'silent t',
  's/es',
  'd/ed',
  'text pronunciation',
];

const SPEAKING_CONTEXT_TOKENS = [
  'speaking',
  'cefr',
  'phase',
  'goal',
  'survival response',
  'identity and daily needs',
  'simple transaction and direction',
];

const VOCABULARY_CONTEXT_TOKENS = [
  'vocabulary',
  'vocab',
  'kosakata',
  'topic vocabulary',
  'topik vocabulary',
];

const GRAMMAR_CONTEXT_TOKENS = [
  'grammar',
  'tenses',
  'tense',
  'article',
  'articles',
  'pronoun',
  'pronouns',
  'preposition',
  'prepositions',
  'passive',
  'conditionals',
  'conditional',
  'grammar resource',
  'writing grammar',
  'speaking grammar',
];

const GRAMMAR_GENERIC_QUERY_TOKENS = new Set([
  'grammar',
  'resource',
  'resources',
  'materi',
  'referensi',
  'reference',
]);

const toTokens = (text: string): string[] =>
  normalizeGuideText(text)
    .split(' ')
    .filter((token) => token.length > 1 && !NOISE_WORDS.has(token));

const routeToAction = (route: GuideIndexedRoute): GuideAction => ({
  kind: 'route',
  label: route.label,
  path: route.path,
});

const targetToRouteAction = (target: { label: string; path: string }): GuideAction => ({
  kind: 'route',
  label: target.label,
  path: target.path,
});

const dedupeRouteActions = (actions: GuideAction[]): GuideAction[] => {
  const seen = new Set<string>();
  return actions.filter((action) => {
    const key =
      action.kind === 'route'
        ? `route:${action.path}`
        : action.kind === 'dashboard-view'
          ? `dashboard-view:${action.viewId}`
          : action.kind === 'logout'
            ? 'logout'
            : `simulation:${action.simulationTopic}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const scoreRoute = (query: string, queryTokens: string[], route: GuideIndexedRoute): number => {
  const queryNorm = normalizeGuideText(query);
  const labelNorm = normalizeGuideText(route.label);
  const pathNorm = normalizeGuideText(route.path);
  const keywordNorms = route.keywords.map((keyword) => normalizeGuideText(keyword));

  let score = 0;

  if (queryNorm === labelNorm || queryNorm === pathNorm) score += 120;
  if (keywordNorms.some((keyword) => keyword === queryNorm)) score += 110;

  if (labelNorm.includes(queryNorm)) score += 70;
  if (pathNorm.includes(queryNorm)) score += 55;

  keywordNorms.forEach((keyword) => {
    if (!keyword) return;
    if (queryNorm.includes(keyword)) score += 45;
    if (keyword.includes(queryNorm)) score += 30;
  });

  const keywordTokens = new Set(keywordNorms.flatMap((keyword) => toTokens(keyword)));
  const overlap = queryTokens.reduce(
    (total, token) => (keywordTokens.has(token) ? total + 1 : total),
    0,
  );
  score += overlap * 10;

  return score;
};

const getScopedFallbackActions = (pathname?: string): GuideAction[] => {
  if (pathname?.startsWith('/skill/speaking')) {
    return dedupeRouteActions(
      [SPEAKING_ROUTE_TARGETS[0], ...SPEAKING_PHASE_TARGETS]
        .filter(Boolean)
        .slice(0, 5)
      .map(targetToRouteAction),
    );
  }

  if (pathname?.startsWith('/skill/vocabulary')) {
    return dedupeRouteActions(
      VOCABULARY_ROUTE_TARGETS.slice(0, 6).map(targetToRouteAction),
    );
  }

  if (pathname?.startsWith('/skill/grammar')) {
    return dedupeRouteActions(
      GRAMMAR_ROUTE_TARGETS.slice(0, 6).map(targetToRouteAction),
    );
  }

  const currentScope = scopeFromPathname(pathname);

  if (currentScope === 'dashboard') {
    return DASHBOARD_VIEW_TARGETS.filter((target) => target.viewId !== 'dashboard')
      .slice(0, 5)
      .map((target) => ({
        kind: 'dashboard-view' as const,
        label: target.label,
        viewId: target.viewId,
      }));
  }

  if (currentScope === 'pronunciation') {
    return dedupeRouteActions(getGuideRoutesByScope('pronunciation').slice(0, 6).map(routeToAction));
  }

  if (currentScope === 'grammar' || currentScope === 'grammar-resource') {
    const preferredRoutes = GUIDE_ROUTE_MAP.filter(
      (route) =>
        route.path === '/skill/grammar' ||
        route.path === '/skill/grammar/grammar-resource' ||
        route.path.startsWith('/skill/grammar/grammar-resource/resource/'),
    ).slice(0, 6);

    return dedupeRouteActions(preferredRoutes.map(routeToAction));
  }

  return getQuickActionRoutes().map(routeToAction);
};

const stripOpenHints = (query: string): string => {
  const normalized = normalizeGuideText(query);
  const tokens = normalized.split(' ').filter(Boolean);
  const trimmedTokens = tokens.filter((token, index) => !(index < 2 && OPEN_HINTS.includes(token)));
  return trimmedTokens.join(' ').trim();
};

const getNavigationSuggestions = (pathname?: string): string[] => {
  if (pathname?.startsWith('/skill/speaking')) {
    return [
      'buka survival response',
      'buka identity and daily needs',
      'buka simple transaction and direction',
      'buka speaking roadmap',
    ];
  }

  if (pathname?.startsWith('/skill/vocabulary')) {
    return [
      'buka personal information vocabulary',
      'buka family vocabulary',
      'buka time date vocabulary',
      'buka shopping vocabulary',
    ];
  }

  if (pathname?.startsWith('/skill/grammar')) {
    return [
      'buka grammar resource',
      'buka grammar for speaking',
      'buka grammar for writing',
      'buka present simple grammar',
    ];
  }

  const currentScope = scopeFromPathname(pathname);
  if (currentScope === 'dashboard') {
    return ['buka notifications', 'buka progress', 'buka achievements', 'buka pronunciation'];
  }
  if (currentScope === 'pronunciation') {
    return [
      'buka alphabet',
      'buka phonetic symbols',
      'buka final sound s/es',
      'buka flap t',
      'buka pronunciation text',
    ];
  }

  return [
    'buka speaking',
    'roadmap speaking',
    'buka phase a1.1',
    'buka goal meminta maaf lalu memperbaiki kesalahan',
  ];
};

const getConfidenceBand = (
  topScore: number,
  secondScore: number,
): 'strong' | 'ambiguous' | 'weak' => {
  if (topScore >= STRONG_SCORE_THRESHOLD && topScore - secondScore >= AMBIGUOUS_GAP) {
    return 'strong';
  }
  if (topScore >= AMBIGUOUS_SCORE_THRESHOLD) {
    return 'ambiguous';
  }
  return 'weak';
};

type TriggerScore = {
  score: number;
  exact: boolean;
  phraseInclude: boolean;
  overlap: number;
  triggerTokenCount: number;
};

const compareTriggerScore = (a: TriggerScore, b: TriggerScore): number => {
  if (b.score !== a.score) return b.score - a.score;
  if (a.exact !== b.exact) return a.exact ? -1 : 1;
  if (a.phraseInclude !== b.phraseInclude) return a.phraseInclude ? -1 : 1;
  if (b.overlap !== a.overlap) return b.overlap - a.overlap;
  if (b.triggerTokenCount !== a.triggerTokenCount) return b.triggerTokenCount - a.triggerTokenCount;
  return 0;
};

const scoreByTriggers = (
  queryNorm: string,
  queryTokens: string[],
  triggers: string[],
): TriggerScore => {
  let best: TriggerScore = {
    score: 0,
    exact: false,
    phraseInclude: false,
    overlap: 0,
    triggerTokenCount: 0,
  };

  for (const trigger of triggers) {
    const triggerNorm = normalizeGuideText(trigger);
    if (!triggerNorm) continue;

    const exact = queryNorm === triggerNorm;
    const queryIncludesTrigger = queryNorm.includes(triggerNorm);
    const triggerIncludesQuery = triggerNorm.includes(queryNorm);
    let score = 0;
    if (exact) score += 130;
    if (queryIncludesTrigger) score += 90;
    if (triggerIncludesQuery) score += 65;

    const triggerTokens = new Set(toTokens(triggerNorm));
    const overlap = queryTokens.reduce(
      (total, token) => (triggerTokens.has(token) ? total + 1 : total),
      0,
    );
    score += overlap * 14;

    const candidate: TriggerScore = {
      score,
      exact,
      phraseInclude: queryIncludesTrigger || triggerIncludesQuery,
      overlap,
      triggerTokenCount: triggerTokens.size,
    };

    if (compareTriggerScore(best, candidate) > 0) {
      best = candidate;
    }
  }

  return best;
};

type NavigationCandidate = {
  action: GuideAction;
  score: number;
  matchedType: 'dashboard-view' | 'hub-route';
  exact: boolean;
  phraseInclude: boolean;
  overlap: number;
  specificity: number;
};

const getActionSpecificity = (action: GuideAction): number => {
  if (action.kind !== 'route') return 0;
  return action.path.split('/').filter(Boolean).length;
};

const compareNavigationCandidate = (a: NavigationCandidate, b: NavigationCandidate): number => {
  if (b.score !== a.score) return b.score - a.score;
  if (a.exact !== b.exact) return a.exact ? -1 : 1;
  if (a.phraseInclude !== b.phraseInclude) return a.phraseInclude ? -1 : 1;
  if (b.overlap !== a.overlap) return b.overlap - a.overlap;
  if (b.specificity !== a.specificity) return b.specificity - a.specificity;
  if (a.matchedType !== b.matchedType) {
    return a.matchedType === 'dashboard-view' ? -1 : 1;
  }
  return 0;
};

const isPronunciationContext = (queryNorm: string, pathname?: string): boolean => {
  if (scopeFromPathname(pathname) === 'pronunciation') return true;
  return PRONUNCIATION_CONTEXT_TOKENS.some((token) => queryNorm.includes(token));
};

const isVocabularyPath = (pathname?: string): boolean =>
  Boolean(pathname?.startsWith('/skill/vocabulary'));

const isVocabularyContext = (queryNorm: string, pathname?: string): boolean => {
  if (isVocabularyPath(pathname)) return true;
  return VOCABULARY_CONTEXT_TOKENS.some((token) => queryNorm.includes(token));
};

const isGrammarPath = (pathname?: string): boolean =>
  Boolean(pathname?.startsWith('/skill/grammar'));

const isGrammarContext = (queryNorm: string, pathname?: string): boolean => {
  if (isGrammarPath(pathname)) return true;
  return GRAMMAR_CONTEXT_TOKENS.some((token) => queryNorm.includes(token));
};

const isSpeakingPath = (pathname?: string): boolean => Boolean(pathname?.startsWith('/skill/speaking'));

const detectSpeakingPhaseFromQuery = (
  queryNorm: string,
): 'cefr-a1-1' | 'cefr-a1-2' | 'cefr-a1-3' | null => {
  if (
    queryNorm.includes('cefr-a1-1') ||
    /\ba1[.\s-]?1\b/.test(queryNorm) ||
    queryNorm.includes('survival response') ||
    queryNorm.includes('respons survival')
  ) {
    return 'cefr-a1-1';
  }

  if (
    queryNorm.includes('cefr-a1-2') ||
    /\ba1[.\s-]?2\b/.test(queryNorm) ||
    queryNorm.includes('identity and daily needs') ||
    queryNorm.includes('identitas kebutuhan harian')
  ) {
    return 'cefr-a1-2';
  }

  if (
    queryNorm.includes('cefr-a1-3') ||
    /\ba1[.\s-]?3\b/.test(queryNorm) ||
    queryNorm.includes('simple transaction and direction') ||
    queryNorm.includes('transaksi sederhana arah')
  ) {
    return 'cefr-a1-3';
  }

  return null;
};

const hasSpeakingContext = (
  queryNorm: string,
  pathname?: string,
  detectedPhase?: 'cefr-a1-1' | 'cefr-a1-2' | 'cefr-a1-3' | null,
): boolean => {
  if (isSpeakingPath(pathname)) return true;
  if (detectedPhase) return true;
  return SPEAKING_CONTEXT_TOKENS.some((token) => queryNorm.includes(token));
};

const scoreDashboardAndHubTargets = (queryNorm: string, pathname?: string): NavigationCandidate[] => {
  const queryTokens = toTokens(queryNorm);
  const inVocabularyPath = isVocabularyPath(pathname);
  const hasVocabularyIntent = VOCABULARY_CONTEXT_TOKENS.some((token) => queryNorm.includes(token));
  const dashboardCandidates: NavigationCandidate[] = DASHBOARD_VIEW_TARGETS.map((target) => {
    const action: GuideAction = {
      kind: 'dashboard-view',
      label: target.label,
      viewId: target.viewId,
    };
    const triggerScore = scoreByTriggers(queryNorm, queryTokens, target.triggers);
    let score = triggerScore.score;

    // In vocabulary scope, "home" should prefer vocabulary topic instead of dashboard home alias.
    if (
      (inVocabularyPath || hasVocabularyIntent) &&
      target.viewId === 'dashboard' &&
      queryNorm.includes('home') &&
      !queryNorm.includes('dashboard') &&
      !queryNorm.includes('start journey') &&
      !queryNorm.includes('beranda')
    ) {
      score = 0;
    }

    return {
      action,
      score,
      matchedType: 'dashboard-view',
      exact: triggerScore.exact,
      phraseInclude: triggerScore.phraseInclude,
      overlap: triggerScore.overlap,
      specificity: getActionSpecificity(action),
    };
  });

  const hubCandidates: NavigationCandidate[] = HUB_ROUTE_TARGETS.map((target) => {
    const action: GuideAction = {
      kind: 'route',
      label: target.label,
      path: target.path,
    };
    const triggerScore = scoreByTriggers(queryNorm, queryTokens, target.triggers);
    return {
      action,
      score: triggerScore.score,
      matchedType: 'hub-route',
      exact: triggerScore.exact,
      phraseInclude: triggerScore.phraseInclude,
      overlap: triggerScore.overlap,
      specificity: getActionSpecificity(action),
    };
  });

  return [...dashboardCandidates, ...hubCandidates]
    .filter((candidate) => candidate.score > 0)
    .sort(compareNavigationCandidate);
};

const scorePronunciationTargets = (queryNorm: string, pathname?: string): NavigationCandidate[] => {
  const queryTokens = toTokens(queryNorm);
  const allowGenericTrigger = isPronunciationContext(queryNorm, pathname);

  const pronunciationCandidates: NavigationCandidate[] = PRONUNCIATION_ROUTE_TARGETS.filter(
    (target) => !target.isGenericTrigger || allowGenericTrigger,
  ).map((target) => {
    const action: GuideAction = {
      kind: 'route',
      label: target.label,
      path: target.path,
    };
    const triggerScore = scoreByTriggers(queryNorm, queryTokens, target.triggers);
    return {
      action,
      score: triggerScore.score,
      matchedType: 'hub-route',
      exact: triggerScore.exact,
      phraseInclude: triggerScore.phraseInclude,
      overlap: triggerScore.overlap,
      specificity: getActionSpecificity(action),
    };
  });

  return pronunciationCandidates
    .filter((candidate) => candidate.score > 0)
    .sort(compareNavigationCandidate);
};

const scoreSpeakingTargets = (queryNorm: string, pathname?: string): NavigationCandidate[] => {
  const queryTokens = toTokens(queryNorm);
  const detectedPhase = detectSpeakingPhaseFromQuery(queryNorm);
  const speakingContext = hasSpeakingContext(queryNorm, pathname, detectedPhase);
  const hasGrammarSpeakingMix = queryNorm.includes('grammar') && queryNorm.includes('speaking');
  const shortGoalCode = (queryNorm.match(/\bg\d{2}\b/i)?.[0] ?? '').toLowerCase();
  const hasShortGoalCode = Boolean(shortGoalCode);
  const hasFullGoalId = /\bcefr-a1-[123]-g\d{2}\b/.test(queryNorm);

  const speakingCandidates: NavigationCandidate[] = SPEAKING_ROUTE_TARGETS.filter((target) => {
    if (target.targetType !== 'goal') return true;

    if (detectedPhase && target.phaseId !== detectedPhase) {
      return false;
    }

    if (hasShortGoalCode && !hasFullGoalId && !speakingContext) {
      return false;
    }

    if (hasShortGoalCode && !hasFullGoalId && target.shortCode && target.shortCode !== shortGoalCode) {
      return false;
    }

    return true;
  }).map((target) => {
    const action: GuideAction = targetToRouteAction(target);
    const triggerScore = scoreByTriggers(queryNorm, queryTokens, target.triggers);
    let score = triggerScore.score;

    if (hasGrammarSpeakingMix && target.targetType === 'hub' && target.isGenericTrigger) {
      score -= 90;
    } else if (hasGrammarSpeakingMix && target.targetType !== 'goal') {
      score -= 36;
    }

    return {
      action,
      score: Math.max(0, score),
      matchedType: 'hub-route' as const,
      exact: triggerScore.exact,
      phraseInclude: triggerScore.phraseInclude,
      overlap: triggerScore.overlap,
      specificity: getActionSpecificity(action),
    };
  });

  return speakingCandidates
    .filter((candidate) => candidate.score > 0)
    .sort(compareNavigationCandidate);
};

const scoreVocabularyTargets = (queryNorm: string, pathname?: string): NavigationCandidate[] => {
  const queryTokens = toTokens(queryNorm);
  const allowGenericTrigger = isVocabularyContext(queryNorm, pathname);
  if (!allowGenericTrigger) return [];

  const vocabularyCandidates: NavigationCandidate[] = VOCABULARY_ROUTE_TARGETS.map((target) => {
    const action: GuideAction = targetToRouteAction(target);
    const triggerScore = scoreByTriggers(queryNorm, queryTokens, target.triggers);
    const genericScore =
      allowGenericTrigger && target.genericTriggers?.length
        ? scoreByTriggers(queryNorm, queryTokens, target.genericTriggers)
        : { score: 0, exact: false, phraseInclude: false, overlap: 0, triggerTokenCount: 0 };
    const best = compareTriggerScore(triggerScore, genericScore) <= 0 ? triggerScore : genericScore;

    return {
      action,
      score: best.score,
      matchedType: 'hub-route',
      exact: best.exact,
      phraseInclude: best.phraseInclude,
      overlap: best.overlap,
      specificity: getActionSpecificity(action),
    };
  });

  return vocabularyCandidates
    .filter((candidate) => candidate.score > 0)
    .sort(compareNavigationCandidate);
};

const scoreGrammarTargets = (queryNorm: string, pathname?: string): NavigationCandidate[] => {
  const queryTokens = toTokens(queryNorm);
  const allowGrammar = isGrammarContext(queryNorm, pathname);
  if (!allowGrammar) return [];
  const isGenericGrammarQuery =
    queryTokens.length > 0 &&
    queryTokens.every((token) => GRAMMAR_GENERIC_QUERY_TOKENS.has(token));
  const nonGenericGrammarTokens = queryTokens.filter(
    (token) => !GRAMMAR_GENERIC_QUERY_TOKENS.has(token),
  );

  const curatedCandidates: NavigationCandidate[] = GRAMMAR_ROUTE_TARGETS.map((target) => {
    const action: GuideAction = targetToRouteAction(target);
    const triggerScore = scoreByTriggers(queryNorm, queryTokens, target.triggers);
    const genericScore =
      allowGrammar && target.genericTriggers?.length
        ? scoreByTriggers(queryNorm, queryTokens, target.genericTriggers)
        : { score: 0, exact: false, phraseInclude: false, overlap: 0, triggerTokenCount: 0 };
    const best = compareTriggerScore(triggerScore, genericScore) <= 0 ? triggerScore : genericScore;
    let score = best.score;

    if (target.path === '/skill/grammar' && queryNorm === 'grammar') {
      score += 45;
    }
    if (target.path === '/skill/grammar/grammar-for-speaking' && queryNorm.includes('grammar')) {
      score += 24;
    }
    if (target.path === '/skill/grammar/grammar-for-writing' && queryNorm.includes('grammar')) {
      score += 24;
    }
    if (
      target.path === '/skill/grammar/analisis-grammar-for-speaking' &&
      (queryNorm.includes('analisis') || queryNorm.includes('analysis'))
    ) {
      score += 24;
    }
    if (target.path === '/skill/grammar' && nonGenericGrammarTokens.length > 0 && queryNorm !== 'grammar') {
      score = Math.max(0, score - 48);
    }
    if (
      target.path === '/skill/grammar/grammar-resource' &&
      nonGenericGrammarTokens.length > 0 &&
      !queryNorm.includes('grammar resource') &&
      !queryNorm.includes('resource grammar')
    ) {
      score = Math.max(0, score - 24);
    }

    return {
      action,
      score,
      matchedType: 'hub-route',
      exact: best.exact,
      phraseInclude: best.phraseInclude,
      overlap: best.overlap,
      specificity: getActionSpecificity(action),
    };
  });

  const deepResourceCandidates: NavigationCandidate[] = isGenericGrammarQuery
    ? []
    : GUIDE_ROUTE_MAP.filter((route) =>
      route.path.startsWith('/skill/grammar/grammar-resource/resource/'),
    ).map((route) => {
      const action = routeToAction(route);
      let score = Math.max(0, scoreRoute(queryNorm, queryTokens, route) - 12);
      const labelNorm = normalizeGuideText(route.label);
      const pathNorm = normalizeGuideText(route.path);
      const exact = queryNorm === labelNorm || queryNorm === pathNorm;
    const phraseInclude =
      queryNorm.includes(labelNorm) ||
      labelNorm.includes(queryNorm) ||
      queryNorm.includes(pathNorm) ||
      pathNorm.includes(queryNorm);
    const keywordTokens = new Set(route.keywords.flatMap((keyword) => toTokens(keyword)));
      const overlap = queryTokens.reduce(
        (total, token) => (keywordTokens.has(token) ? total + 1 : total),
        0,
      );

      // Keep top result stable for high-signal phrases.
      if (queryNorm.includes('present simple') && !route.path.includes('present-simple-habits-and-facts')) {
        score = Math.max(0, score - 40);
      }
      if (queryNorm.includes('conditionals') && !route.path.includes('conditionals-type-0-1-2-3')) {
        score = Math.max(0, score - 28);
      }

      return {
        action,
        score,
        matchedType: 'hub-route' as const,
        exact,
        phraseInclude,
        overlap,
        specificity: getActionSpecificity(action),
      };
    });

  return [...curatedCandidates, ...deepResourceCandidates]
    .filter((candidate) => candidate.score > 0)
    .sort(compareNavigationCandidate);
};

const buildCuratedResult = (
  candidates: NavigationCandidate[],
  pathname?: string,
): GuideModeResult | null => {
  const topScore = candidates[0]?.score ?? 0;
  if (topScore < AMBIGUOUS_SCORE_THRESHOLD) return null;

  const secondScore = candidates[1]?.score ?? 0;
  const band = getConfidenceBand(topScore, secondScore);

  if (band === 'strong') {
    const best = candidates[0];
    return {
      mode: 'navigation',
      reply:
        best.action.kind === 'dashboard-view'
          ? `Siap, aku buka Dashboard - ${best.action.label}.`
          : `Siap, aku arahkan ke ${best.action.label}.`,
      actions: [best.action],
      suggestions: getNavigationSuggestions(pathname),
      meta: buildNavigationMeta(topScore, secondScore, best.matchedType, true),
    };
  }

  return {
    mode: 'navigation',
    reply: 'Aku menemukan beberapa tujuan yang mirip. Pilih salah satu:',
    actions: dedupeRouteActions(candidates.slice(0, 3).map((candidate) => candidate.action)),
    suggestions: getNavigationSuggestions(pathname),
    meta: buildNavigationMeta(
      topScore,
      secondScore,
      candidates[0]?.matchedType ?? 'none',
      false,
    ),
  };
};

const scoreCuratedPrimary = (queryNorm: string, pathname?: string): NavigationCandidate[] =>
  scoreDashboardAndHubTargets(queryNorm, pathname);

const buildNavigationMeta = (
  topScore: number,
  secondScore: number,
  matchedType: 'dashboard-view' | 'hub-route' | 'fallback-route' | 'logout' | 'none',
  shouldAutoNavigate: boolean,
) => ({
  source: 'navigation' as const,
  navigation: {
    shouldAutoNavigate,
    confidenceBand: getConfidenceBand(topScore, secondScore),
    topScore,
    secondScore,
    matchedType,
  },
});

const isLogoutIntent = (queryNorm: string): boolean =>
  LOGOUT_TRIGGERS.some((trigger) => {
    const normalizedTrigger = normalizeGuideText(trigger);
    return queryNorm === normalizedTrigger || queryNorm.includes(normalizedTrigger);
  });

const buildTypoConfirmationResult = (
  correctedQuery: string,
  pathname?: string,
): GuideModeResult => ({
  mode: 'navigation',
  reply: `Aku mendeteksi typo. Maksudmu: "${correctedQuery}"?`,
  actions: getScopedFallbackActions(pathname).slice(0, 5),
  suggestions: [correctedQuery, ...getNavigationSuggestions(pathname)].slice(0, 5),
  confirmation: {
    kind: 'typo',
    correctedQuery,
  },
  meta: buildNavigationMeta(0, 0, 'none', false),
});

const buildLogoutConfirmationResult = (pathname?: string): GuideModeResult => ({
  mode: 'navigation',
  reply: 'Kamu mau logout sekarang? Jawab Yes atau No.',
  actions: [
    {
      kind: 'logout',
      label: 'Logout sekarang',
    },
  ],
  suggestions: getNavigationSuggestions(pathname),
  confirmation: {
    kind: 'logout',
  },
  meta: buildNavigationMeta(100, 0, 'logout', false),
});

export const resolveNavigationMode = (
  query: string,
  options?: { pathname?: string },
): GuideModeResult => {
  const pathname = options?.pathname;
  const rawNormalized = normalizeGuideText(query);

  if (!rawNormalized) {
    return {
      mode: 'navigation',
      reply:
        'Mode Navigasi aktif. Tulis tujuan halaman, misalnya "buka pronunciation" atau "ke grammar resource".',
      actions: getScopedFallbackActions(pathname).slice(0, 5),
      suggestions: getNavigationSuggestions(pathname),
      meta: buildNavigationMeta(0, 0, 'none', false),
    };
  }

  const parsed = parseGuideQuery(query);
  const parsedNormalized = normalizeGuideText(parsed.normalized || query);
  const normalizedWithHints = stripOpenHints(parsedNormalized) || parsedNormalized;
  const queryNorm = stripOpenHints(rawNormalized) || rawNormalized;
  const nluCorrectedQuery = parsed.correctedQuery
    ? stripOpenHints(normalizeGuideText(parsed.correctedQuery)) || normalizeGuideText(parsed.correctedQuery)
    : '';
  const customCorrectedQuery = applyNavigationTypoRules(normalizedWithHints);

  if (parsed.hasTypoCorrection && nluCorrectedQuery && nluCorrectedQuery !== queryNorm) {
    return buildTypoConfirmationResult(nluCorrectedQuery, pathname);
  }

  if (customCorrectedQuery !== normalizedWithHints) {
    return buildTypoConfirmationResult(customCorrectedQuery, pathname);
  }

  if (isLogoutIntent(normalizedWithHints)) {
    return buildLogoutConfirmationResult(pathname);
  }

  const primaryCandidates = scoreCuratedPrimary(normalizedWithHints, pathname);
  const primaryResult = buildCuratedResult(primaryCandidates, pathname);
  if (primaryResult) {
    return primaryResult;
  }

  const speakingCandidates = scoreSpeakingTargets(normalizedWithHints, pathname);
  const speakingResult = buildCuratedResult(speakingCandidates, pathname);
  if (speakingResult) {
    return speakingResult;
  }

  const vocabularyCandidates = scoreVocabularyTargets(normalizedWithHints, pathname);
  const vocabularyResult = buildCuratedResult(vocabularyCandidates, pathname);
  if (vocabularyResult) {
    return vocabularyResult;
  }

  const grammarCandidates = scoreGrammarTargets(normalizedWithHints, pathname);
  const grammarResult = buildCuratedResult(grammarCandidates, pathname);
  if (grammarResult) {
    return grammarResult;
  }

  const pronunciationCandidates = scorePronunciationTargets(normalizedWithHints, pathname);
  const pronunciationResult = buildCuratedResult(pronunciationCandidates, pathname);
  if (pronunciationResult) {
    return pronunciationResult;
  }

  const allowVocabularyTopicFallback = isVocabularyContext(normalizedWithHints, pathname);
  const allowGrammarFallback = isGrammarContext(normalizedWithHints, pathname);
  const scoredRoutes = GUIDE_ROUTE_MAP.filter(
    (route) =>
      (allowVocabularyTopicFallback ||
        !route.path.startsWith('/skill/vocabulary/topic/pages/')) &&
      (allowGrammarFallback || !route.path.startsWith('/skill/grammar/')),
  ).map((route) => ({
    route: routeToAction(route),
    score: scoreRoute(normalizedWithHints, toTokens(normalizedWithHints), route),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scoredRoutes.length === 0) {
    return {
      mode: 'navigation',
      reply:
        'Aku belum menemukan route yang cocok. Coba pakai kata kunci halaman yang lebih spesifik.',
      actions: getScopedFallbackActions(pathname).slice(0, 5),
      suggestions: getNavigationSuggestions(pathname),
      meta: buildNavigationMeta(0, 0, 'none', false),
    };
  }

  const topRouteScore = scoredRoutes[0]?.score ?? 0;
  const secondRouteScore = scoredRoutes[1]?.score ?? 0;
  const actions = dedupeRouteActions(scoredRoutes.slice(0, 3).map((entry) => entry.route));

  return {
    mode: 'navigation',
    reply: 'Aku menemukan beberapa halaman yang paling dekat. Pilih salah satu:',
    actions,
    suggestions: getNavigationSuggestions(pathname),
    meta: buildNavigationMeta(topRouteScore, secondRouteScore, 'fallback-route', false),
  };
};
