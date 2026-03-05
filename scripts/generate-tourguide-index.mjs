import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const APP_DIR = path.join(ROOT_DIR, 'app');
const OUTPUT_FILE = path.join(APP_DIR, 'bot-tourguide', 'generated', 'guide-index.json');
const SPEAKING_DETAIL_ALLOWLIST_FILE = path.join(
  APP_DIR,
  'skill',
  'speaking',
  'data',
  'details',
  'authored-routes.json',
);

const PUBLIC_ROUTES = new Set([
  '/login',
  '/device-pairing',
  '/device-approve',
  '/forgot-password',
  '/reset-password',
]);

const PRIVATE_PREFIXES = ['/dashboard', '/skill'];
const GUIDE_SCOPES = new Set([
  'dashboard',
  'skill',
  'pronunciation',
  'grammar',
  'grammar-resource',
  'game-links',
  'general',
]);

const normalizeText = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value) => normalizeText(value).split(' ').filter(Boolean);

const pathToId = (routePath) =>
  routePath
    .replace(/^\/+/, '')
    .replace(/\/+$/g, '')
    .replace(/\//g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'route-root';

const humanizeWord = (value) => {
  const raw = value.replace(/[-_]+/g, ' ').trim();
  if (!raw) return 'Home';

  const normalized = raw.toLowerCase();
  if (normalized === 'clear t') return 'Released T';
  if (normalized === 'clear t ending') return 'Released T Ending';

  return raw
    .split(' ')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
};

const inferScope = (routePath) => {
  if (routePath.startsWith('/dashboard')) return 'dashboard';
  if (routePath.startsWith('/skill/game-links')) return 'game-links';
  if (routePath.startsWith('/skill/pronunciation')) return 'pronunciation';
  if (routePath.startsWith('/skill/grammar/grammar-resource')) return 'grammar-resource';
  if (routePath.startsWith('/skill/grammar')) return 'grammar';
  if (routePath.startsWith('/skill')) return 'skill';
  return 'general';
};

const isPrivateRoute = (routePath) => {
  if (PUBLIC_ROUTES.has(routePath)) return false;
  return PRIVATE_PREFIXES.some((prefix) => routePath === prefix || routePath.startsWith(`${prefix}/`));
};

const dedupe = (items) => Array.from(new Set(items));

const makeKeywords = (input) => {
  const source = [input.label, input.path, ...(input.keywords || [])];
  return dedupe(source.flatMap((entry) => tokenize(entry)));
};

const normalizeRoutePath = (value) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/g, '') || '/';
};

const routeFromPagePath = (absoluteFilePath) => {
  const relativePath = path.relative(APP_DIR, absoluteFilePath);
  const withoutPage = relativePath.replace(new RegExp(`\\${path.sep}page\\.tsx$`), '');
  const segments = withoutPage
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))
    .filter((segment) => !segment.startsWith('@'));

  if (segments.some((segment) => segment.includes('['))) {
    return null;
  }

  const routePath = `/${segments.join('/')}`.replace(/\/+/g, '/').replace(/\/+$/g, '') || '/';
  if (!isPrivateRoute(routePath)) {
    return null;
  }

  return routePath;
};

const routeLabelFromPath = (routePath) => {
  const segments = routePath.split('/').filter(Boolean);
  if (!segments.length) return 'Home';
  return humanizeWord(segments[segments.length - 1] || '');
};

const isSpeakingDetailRoute = (routePath) =>
  /^\/skill\/speaking\/(?:phase-\d{2}-g\d{2}|cefr-a1-[1-3]-g\d{2})$/.test(routePath);

const walkDir = async (dirPath, matcher, buffer = []) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath, matcher, buffer);
      continue;
    }

    if (matcher(entry.name, fullPath)) {
      buffer.push(fullPath);
    }
  }

  return buffer;
};

const readJson = async (jsonPath) => {
  const raw = await fs.readFile(jsonPath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Invalid JSON at ${jsonPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

const loadSpeakingDetailAllowlist = async () => {
  try {
    const parsed = await readJson(SPEAKING_DETAIL_ALLOWLIST_FILE);
    if (!Array.isArray(parsed)) {
      throw new Error('speaking detail allowlist must be an array');
    }

    return new Set(parsed.map((entry) => normalizeRoutePath(entry)).filter(Boolean));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

const assertStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === 'string');

const parseManifest = async (manifestPath) => {
  const manifest = await readJson(manifestPath);
  if (!manifest || typeof manifest !== 'object') {
    throw new Error(`Manifest must be an object: ${manifestPath}`);
  }

  const route = normalizeRoutePath(manifest.route);
  if (!route || !isPrivateRoute(route)) {
    throw new Error(`Manifest route must be a private route: ${manifestPath}`);
  }

  const scope = manifest.scope;
  if (scope && !GUIDE_SCOPES.has(scope)) {
    throw new Error(`Manifest scope is invalid in ${manifestPath}`);
  }

  if (manifest.keywords && !assertStringArray(manifest.keywords)) {
    throw new Error(`Manifest keywords must be string[]: ${manifestPath}`);
  }

  if (manifest.simulation) {
    const simulation = manifest.simulation;
    if (typeof simulation !== 'object') {
      throw new Error(`Manifest simulation must be object: ${manifestPath}`);
    }

    const requiredSimulationFields = ['topicId', 'title', 'componentKey'];
    for (const field of requiredSimulationFields) {
      if (typeof simulation[field] !== 'string' || !simulation[field].trim()) {
        throw new Error(`Manifest simulation.${field} is required: ${manifestPath}`);
      }
    }

    if (!assertStringArray(simulation.commandTriggers) || simulation.commandTriggers.length === 0) {
      throw new Error(`Manifest simulation.commandTriggers must be non-empty string[]: ${manifestPath}`);
    }
  }

  if (manifest.qa) {
    if (!Array.isArray(manifest.qa)) {
      throw new Error(`Manifest qa must be array: ${manifestPath}`);
    }

    for (const qaEntry of manifest.qa) {
      if (!qaEntry || typeof qaEntry !== 'object') {
        throw new Error(`Manifest qa entry must be object: ${manifestPath}`);
      }

      const requiredQaFields = ['topicId', 'title', 'route', 'shortAnswer'];
      for (const field of requiredQaFields) {
        if (typeof qaEntry[field] !== 'string' || !qaEntry[field].trim()) {
          throw new Error(`Manifest qa.${field} is required: ${manifestPath}`);
        }
      }

      if (!assertStringArray(qaEntry.keywords) || qaEntry.keywords.length === 0) {
        throw new Error(`Manifest qa.keywords must be non-empty string[]: ${manifestPath}`);
      }

      if (!Array.isArray(qaEntry.sourceSections)) {
        throw new Error(`Manifest qa.sourceSections must be array: ${manifestPath}`);
      }

      for (const section of qaEntry.sourceSections) {
        if (!section || typeof section !== 'object' || typeof section.label !== 'string') {
          throw new Error(`Manifest qa.sourceSections.label is required: ${manifestPath}`);
        }
      }
    }
  }

  return manifest;
};

const buildRouteScanEntries = async (speakingDetailAllowlist) => {
  const pageFiles = await walkDir(APP_DIR, (name) => name === 'page.tsx');

  const routeEntries = pageFiles
    .map((pageFile) => {
      const routePath = routeFromPagePath(pageFile);
      if (!routePath) return null;
      if (isSpeakingDetailRoute(routePath) && speakingDetailAllowlist && !speakingDetailAllowlist.has(routePath)) {
        return null;
      }

      const label = routeLabelFromPath(routePath);
      const base = {
        id: pathToId(routePath),
        label,
        path: routePath,
        scope: inferScope(routePath),
        keywords: [],
        source: 'route-scan',
      };

      return {
        ...base,
        keywords: makeKeywords({ ...base, keywords: [] }),
      };
    })
    .filter(Boolean);

  routeEntries.sort((a, b) => a.path.localeCompare(b.path));
  return routeEntries;
};

const applyManifestMerges = async (routeEntries) => {
  const routeMap = new Map(routeEntries.map((entry) => [entry.path, entry]));
  const simulations = [];
  const qaEntries = [];

  const manifestFiles = await walkDir(APP_DIR, (name) => name === 'bot.manifest.json');

  for (const manifestFile of manifestFiles) {
    const manifest = await parseManifest(manifestFile);
    const routePath = normalizeRoutePath(manifest.route);
    const existing = routeMap.get(routePath);

    const label =
      typeof manifest.label === 'string' && manifest.label.trim()
        ? manifest.label.trim()
        : existing?.label || routeLabelFromPath(routePath);

    const merged = {
      id: pathToId(routePath),
      label,
      path: routePath,
      scope:
        manifest.scope && GUIDE_SCOPES.has(manifest.scope)
          ? manifest.scope
          : existing?.scope || inferScope(routePath),
      keywords: makeKeywords({
        label,
        path: routePath,
        keywords: [
          ...(existing?.keywords || []),
          ...((manifest.keywords || []).filter((item) => typeof item === 'string')),
        ],
      }),
      source: 'manifest',
    };

    routeMap.set(routePath, merged);

    if (manifest.simulation) {
      simulations.push({
        topicId: manifest.simulation.topicId.trim(),
        title: manifest.simulation.title.trim(),
        commandTriggers: dedupe(
          manifest.simulation.commandTriggers.map((trigger) => normalizeText(trigger)).filter(Boolean),
        ),
        componentKey: manifest.simulation.componentKey.trim(),
        route: normalizeRoutePath(manifest.simulation.route || routePath),
      });
    }

    if (Array.isArray(manifest.qa)) {
      for (const qaEntry of manifest.qa) {
        qaEntries.push({
          topicId: qaEntry.topicId.trim(),
          title: qaEntry.title.trim(),
          route: normalizeRoutePath(qaEntry.route),
          keywords: dedupe(qaEntry.keywords.map((keyword) => normalizeText(keyword)).filter(Boolean)),
          shortAnswer: qaEntry.shortAnswer.trim(),
          sourceSections: qaEntry.sourceSections.map((section) => ({
            label: section.label.trim(),
            anchor:
              typeof section.anchor === 'string' && section.anchor.trim() ? section.anchor.trim() : undefined,
            route:
              typeof section.route === 'string' && section.route.trim()
                ? normalizeRoutePath(section.route)
                : undefined,
          })),
        });
      }
    }
  }

  const finalRoutes = Array.from(routeMap.values()).sort((a, b) => a.path.localeCompare(b.path));

  const dedupedSimulations = Array.from(
    simulations.reduce((acc, simulation) => {
      if (!simulation.commandTriggers.length) return acc;
      acc.set(simulation.topicId, simulation);
      return acc;
    }, new Map()),
  ).map((entry) => entry[1]);

  const dedupedQaEntries = Array.from(
    qaEntries.reduce((acc, entry) => {
      const key = `${entry.topicId}::${entry.shortAnswer}`;
      if (!acc.has(key)) {
        acc.set(key, entry);
      }
      return acc;
    }, new Map()),
  ).map((entry) => entry[1]);

  return {
    routes: finalRoutes,
    simulations: dedupedSimulations,
    qaEntries: dedupedQaEntries,
  };
};

const run = async () => {
  const speakingDetailAllowlist = await loadSpeakingDetailAllowlist();
  const routeScanEntries = await buildRouteScanEntries(speakingDetailAllowlist);
  const merged = await applyManifestMerges(routeScanEntries);

  const payload = {
    generatedAt: new Date().toISOString(),
    routes: merged.routes,
    simulations: merged.simulations,
    qaEntries: merged.qaEntries,
  };

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(
    `[tourguide-index] routes=${payload.routes.length} simulations=${payload.simulations.length} qa=${payload.qaEntries.length}`,
  );
};

run().catch((error) => {
  console.error(`[tourguide-index] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
