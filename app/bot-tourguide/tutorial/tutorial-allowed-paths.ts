const PHONETIC_SYMBOLS_ROOT = '/skill/pronunciation/phoneticsymbols';

const TUTORIAL_ALLOWED_EXACT_PATHS = new Set([
  '/dashboard',
  '/skill',
  '/skill/pronunciation',
  '/skill/pronunciation/alphabet',
  PHONETIC_SYMBOLS_ROOT,
]);

const PHONETIC_SYMBOLS_EXCLUDED_SUBROUTES = new Set([
  'minimalpairs',
  'summary-of-phonetic-symbols',
  'tongue-twister',
]);

const normalizePath = (pathname?: string): string => {
  if (!pathname) return '';
  const cleaned = pathname.split('#')[0]?.split('?')[0]?.trim() ?? '';
  if (!cleaned) return '';
  const normalized = cleaned.length > 1 && cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
  return normalized.toLowerCase();
};

const isPhoneticSymbolDetailPath = (pathname: string): boolean => {
  const prefix = `${PHONETIC_SYMBOLS_ROOT}/`;
  if (!pathname.startsWith(prefix)) return false;
  const slug = pathname.slice(prefix.length);
  if (!slug || slug.includes('/')) return false;
  return !PHONETIC_SYMBOLS_EXCLUDED_SUBROUTES.has(slug);
};

export const isTutorialAllowedPath = (pathname?: string): boolean => {
  const normalizedPath = normalizePath(pathname);
  if (!normalizedPath) return false;
  if (TUTORIAL_ALLOWED_EXACT_PATHS.has(normalizedPath)) return true;
  return isPhoneticSymbolDetailPath(normalizedPath);
};
