import guideIndexJson from './generated/guide-index.json';
import type {
  GuideIndex,
  GuideIndexedRoute,
  GuideScope,
  GuideSimulationEntry,
  GuideSimulationTopic,
  GuideQaEntry,
} from './types';

const GUIDE_INDEX = guideIndexJson as GuideIndex;

export const GUIDE_ROUTE_MAP: GuideIndexedRoute[] = GUIDE_INDEX.routes;
export const GUIDE_SIMULATION_MAP: GuideSimulationEntry[] = GUIDE_INDEX.simulations;
export const GUIDE_QA_MAP: GuideQaEntry[] = GUIDE_INDEX.qaEntries;

export const QUICK_ACTION_PATHS: string[] = [
  '/dashboard',
  '/skill',
  '/skill/pronunciation',
  '/skill/grammar',
  '/skill/grammar/grammar-resource',
  '/skill/game-links',
];

export const scopeFromPathname = (pathname?: string): GuideScope => {
  if (!pathname) return 'general';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith('/skill/game-links')) return 'game-links';
  if (pathname.startsWith('/skill/pronunciation')) return 'pronunciation';
  if (pathname.startsWith('/skill/grammar/grammar-resource')) return 'grammar-resource';
  if (pathname.startsWith('/skill/grammar')) return 'grammar';
  if (pathname.startsWith('/skill')) return 'skill';
  return 'general';
};

export const getGuideRoutesByScope = (scope: GuideScope): GuideIndexedRoute[] =>
  GUIDE_ROUTE_MAP.filter((item) => item.scope === scope);

export const getQuickActionRoutes = (): GuideIndexedRoute[] =>
  QUICK_ACTION_PATHS.map((path) => GUIDE_ROUTE_MAP.find((item) => item.path === path)).filter(
    (item): item is GuideIndexedRoute => Boolean(item),
  );

export const getSimulationByTopic = (
  topicId: GuideSimulationTopic,
): GuideSimulationEntry | undefined => GUIDE_SIMULATION_MAP.find((entry) => entry.topicId === topicId);

export const getRouteByPath = (path: string): GuideIndexedRoute | undefined =>
  GUIDE_ROUTE_MAP.find((route) => route.path === path);
