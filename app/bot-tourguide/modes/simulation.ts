import { GUIDE_SIMULATION_MAP } from '../routeMap';
import type { GuideAction, GuideModeResult, GuideSimulationEntry } from '../types';

const getDefaultSimulationSuggestion = () =>
  GUIDE_SIMULATION_MAP[0]?.commandTriggers?.[0] ?? 'simulasi final sound s/es';

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toTokens = (text: string): string[] => normalizeText(text).split(' ').filter(Boolean);

const simulationToAction = (entry: GuideSimulationEntry): GuideAction => ({
  kind: 'simulation',
  label: entry.title,
  simulationTopic: entry.topicId,
});

const scoreSimulation = (query: string, entry: GuideSimulationEntry): number => {
  const queryNorm = normalizeText(query);
  const tokens = new Set(toTokens(queryNorm));

  let score = 0;
  const triggerNorms = entry.commandTriggers.map((trigger) => normalizeText(trigger));
  const titleNorm = normalizeText(entry.title);
  const topicNorm = normalizeText(entry.topicId);

  if (triggerNorms.some((trigger) => trigger === queryNorm)) score += 200;
  if (queryNorm === titleNorm || queryNorm === topicNorm) score += 150;

  if (titleNorm.includes(queryNorm) || queryNorm.includes(titleNorm)) score += 80;
  if (topicNorm.includes(queryNorm) || queryNorm.includes(topicNorm)) score += 60;

  triggerNorms.forEach((trigger) => {
    if (trigger.includes(queryNorm)) score += 90;
    if (queryNorm.includes(trigger)) score += 70;
    toTokens(trigger).forEach((token) => {
      if (tokens.has(token)) score += 12;
    });
  });

  return score;
};

const buildSimulationListReply = (): GuideModeResult => {
  if (!GUIDE_SIMULATION_MAP.length) {
    return {
      mode: 'simulation',
      reply: 'Belum ada simulasi yang terdaftar saat ini.',
      actions: [],
      suggestions: [getDefaultSimulationSuggestion()],
    };
  }

  return {
    mode: 'simulation',
    reply: 'Mode Simulasi aktif. Pilih simulasi yang tersedia atau tulis command simulasi.',
    actions: GUIDE_SIMULATION_MAP.map(simulationToAction),
    suggestions: GUIDE_SIMULATION_MAP.flatMap((entry) => entry.commandTriggers).slice(0, 5),
  };
};

export const resolveSimulationMode = (query: string): GuideModeResult => {
  const normalized = normalizeText(query);
  if (!normalized) return buildSimulationListReply();

  if (!GUIDE_SIMULATION_MAP.length) {
    return {
      mode: 'simulation',
      reply: 'Belum ada simulasi yang tersedia saat ini.',
      actions: [],
      suggestions: [getDefaultSimulationSuggestion()],
    };
  }

  const scoredEntries = GUIDE_SIMULATION_MAP.map((entry) => ({
    entry,
    score: scoreSimulation(normalized, entry),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scoredEntries.length) {
    return {
      mode: 'simulation',
      reply: 'Topik simulasi itu belum tersedia. Ini daftar simulasi yang saat ini bisa dibuka:',
      actions: GUIDE_SIMULATION_MAP.map(simulationToAction),
      suggestions: GUIDE_SIMULATION_MAP.flatMap((entry) => entry.commandTriggers).slice(0, 5),
    };
  }

  const best = scoredEntries[0]?.entry;
  if (!best) return buildSimulationListReply();

  return {
    mode: 'simulation',
    reply: `Siap. Buka simulasi: ${best.title}.`,
    actions: [simulationToAction(best)],
    suggestions: best.commandTriggers.length
      ? best.commandTriggers
      : [getDefaultSimulationSuggestion()],
  };
};
