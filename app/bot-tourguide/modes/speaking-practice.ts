import { SPEAKING_GOALS } from '../../skill/speaking/data/goals';
import { getSpeakingGoalDetail } from '../../skill/speaking/data/details';
import { getSpeakingIpaByText } from '../../skill/speaking/data/ipa-map';
import { parseDialogLine } from '../../skill/speaking/components/dialog-tts-utils';
import type { GuideAction, GuideModeResult } from '../types';

type PracticeSpeaker = 'Partner' | 'You';

type PracticeTurn = {
  speaker: PracticeSpeaker;
  line: string;
  ipa?: string;
  translation?: string;
};

type PracticeScenario = {
  title: string;
  mission: string;
  turns: PracticeTurn[];
};

type PracticeSession = {
  goalId: string;
  scenarioIndex: number;
  turnIndex: number;
  isRunning: boolean;
  isCompleted: boolean;
};

type PracticeSelection = {
  phaseId: string;
  goalId: string;
  scenarioIndex: number;
};

type PracticeSnapshot = {
  state: 'idle' | 'running' | 'completed';
  goalId: string;
  goalTitle: string;
  route: string;
  scenarioTitle: string;
  scenarioMission: string;
  scenarioIndex: number;
  scenarioCount: number;
  turnIndex: number;
  turnCount: number;
  speaker: PracticeSpeaker;
  line: string;
  lineIpa?: string;
  lineTranslation?: string;
  isRunning: boolean;
  isCompleted: boolean;
  availablePhases: Array<{ id: string; title: string }>;
  availableGoals: Array<{ id: string; title: string }>;
  availableScenarios: Array<{ index: number; title: string }>;
  selectedPhaseId: string;
  selectedGoalId: string;
  selectedScenarioIndex: number;
};

const START_COMMANDS = new Set(['start', 'mulai', 'mulai practice', 'start practice', 'latihan']);
const NEXT_COMMANDS = new Set(['next', 'lanjut', 'turn berikutnya']);
const PREV_COMMANDS = new Set(['prev', 'back', 'sebelumnya', 'turn sebelumnya']);
const REPEAT_COMMANDS = new Set(['ulang', 'repeat']);
const STOP_COMMANDS = new Set(['stop', 'selesai', 'end', 'exit', 'keluar']);

let activeSession: PracticeSession | null = null;
let selectionState: PracticeSelection | null = null;
let speakingPracticeTick = 0;

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\-\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const clampIndex = (value: number, max: number): number => {
  if (max <= 0) return 0;
  if (value < 0) return 0;
  if (value >= max) return max - 1;
  return value;
};

const getGoalRoute = (goalId: string): string => `/skill/speaking/cefr-a1/${goalId}`;

const getGoalIdFromPathname = (pathname?: string): string | null => {
  if (!pathname) return null;
  const match = pathname.match(/\/skill\/speaking\/cefr-a1\/([a-z0-9\-]+)/i);
  if (!match) return null;
  const candidate = match[1];
  return SPEAKING_GOALS.some((goal) => goal.id === candidate) ? candidate : null;
};

const getDefaultGoalId = (pathname?: string): string =>
  getGoalIdFromPathname(pathname) ?? SPEAKING_GOALS[0]?.id ?? 'cefr-a1-1-g01';

const getPhaseIdByGoalId = (goalId: string): string =>
  SPEAKING_GOALS.find((goal) => goal.id === goalId)?.phaseId ?? SPEAKING_GOALS[0]?.phaseId ?? 'cefr-a1-1';

const isValidGoalId = (goalId: string): boolean =>
  SPEAKING_GOALS.some((goal) => goal.id === goalId);

const isValidPhaseId = (phaseId: string): boolean =>
  SPEAKING_GOALS.some((goal) => goal.phaseId === phaseId);

const getDefaultPhaseId = (pathname?: string): string => getPhaseIdByGoalId(getDefaultGoalId(pathname));

const normalizeParsedSpeaker = (
  parsedSpeaker: ReturnType<typeof parseDialogLine>['speaker'],
  fallbackSpeaker: PracticeSpeaker,
): PracticeSpeaker => {
  if (parsedSpeaker === 'partner') return 'Partner';
  if (parsedSpeaker === 'you') return 'You';
  return fallbackSpeaker;
};

const getScenariosByGoalId = (goalId: string): PracticeScenario[] => {
  const detail = getSpeakingGoalDetail(goalId);
  if (!detail) return [];

  const scripted = detail.roleplayScenarios.map((scenario, index): PracticeScenario => {
    const raw = detail.roleplayExamples?.[index] ?? '';
    const rawTranslation = detail.roleplayExamplesId?.[index] ?? '';
    const parsedTranslations = rawTranslation
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    let fallbackSpeaker: PracticeSpeaker = 'Partner';

    const parsedTurns = raw
      .split('\n')
      .map((line, lineIndex): PracticeTurn | null => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        const parsed = parseDialogLine(trimmed);
        const speaker = normalizeParsedSpeaker(parsed.speaker, fallbackSpeaker);
        fallbackSpeaker = speaker === 'Partner' ? 'You' : 'Partner';
        const normalizedLine = parsed.content || trimmed;
        const ipa = getSpeakingIpaByText(normalizedLine) ?? undefined;
        const translation = parsedTranslations[lineIndex];

        const turn: PracticeTurn = {
          speaker,
          line: normalizedLine,
        };
        if (ipa) {
          turn.ipa = ipa;
        }
        if (translation) {
          turn.translation = translation;
        }

        return turn;
      })
      .filter((turn): turn is PracticeTurn => turn !== null);

    const fallbackTurns: PracticeTurn[] =
      detail.dialogScripts?.[index]?.turns.map((turn): PracticeTurn => ({
        speaker: turn.speaker === 'You' ? 'You' : 'Partner',
        line: turn.line,
        ipa: getSpeakingIpaByText(turn.line) ?? undefined,
      })) ?? [];

    const turns = parsedTurns.length ? parsedTurns : fallbackTurns;

    return {
      title: scenario.title,
      mission: scenario.mission,
      turns: turns.length
        ? turns
        : [
            {
              speaker: 'Partner',
              line: 'Dialog untuk scenario ini belum tersedia.',
            } satisfies PracticeTurn,
          ],
    };
  });

  return scripted.filter((scenario) => scenario.turns.length > 0);
};

const getPhaseOptions = (): Array<{ id: string; title: string }> => {
  const phaseMap = new Map<string, string>();
  for (const goal of SPEAKING_GOALS) {
    if (!phaseMap.has(goal.phaseId)) {
      phaseMap.set(goal.phaseId, goal.phaseTitle);
    }
  }
  return Array.from(phaseMap.entries()).map(([id, title]) => ({ id, title }));
};

const getGoalsByPhaseId = (phaseId: string) =>
  SPEAKING_GOALS.filter((goal) => goal.phaseId === phaseId);

const getGoalOptions = (phaseId: string): Array<{ id: string; title: string }> =>
  getGoalsByPhaseId(phaseId).map((goal) => ({ id: goal.id, title: goal.goal }));

const sanitizeSelection = (
  selection: PracticeSelection,
  pathname?: string,
): PracticeSelection => {
  const safePhaseId = isValidPhaseId(selection.phaseId) ? selection.phaseId : getDefaultPhaseId(pathname);
  const goalsInPhase = getGoalsByPhaseId(safePhaseId);
  const fallbackGoalId = goalsInPhase[0]?.id ?? getDefaultGoalId(pathname);
  const goalBelongsToPhase = goalsInPhase.some((goal) => goal.id === selection.goalId);
  const safeGoalId =
    isValidGoalId(selection.goalId) && goalBelongsToPhase
      ? selection.goalId
      : fallbackGoalId;
  const scenarios = getScenariosByGoalId(safeGoalId);
  const safeScenarioIndex = clampIndex(selection.scenarioIndex, scenarios.length || 1);

  return {
    phaseId: safePhaseId,
    goalId: safeGoalId,
    scenarioIndex: safeScenarioIndex,
  };
};

const ensureSelection = (pathname?: string): PracticeSelection => {
  if (!selectionState) {
    const defaultGoalId = getDefaultGoalId(pathname);
    selectionState = {
      phaseId: getPhaseIdByGoalId(defaultGoalId),
      goalId: defaultGoalId,
      scenarioIndex: 0,
    };
  }

  selectionState = sanitizeSelection(selectionState, pathname);
  return selectionState;
};

const createIdleSessionFromSelection = (selection: PracticeSelection): PracticeSession => ({
  goalId: selection.goalId,
  scenarioIndex: selection.scenarioIndex,
  turnIndex: 0,
  isRunning: false,
  isCompleted: false,
});

const getSnapshot = (session: PracticeSession | null, pathname?: string): PracticeSnapshot => {
  const selection = ensureSelection(pathname);
  const effectiveSession = session ?? createIdleSessionFromSelection(selection);
  const safeGoalId = isValidGoalId(effectiveSession.goalId)
    ? effectiveSession.goalId
    : getDefaultGoalId(pathname);
  const safePhaseId = getPhaseIdByGoalId(safeGoalId);

  const scenarios = getScenariosByGoalId(safeGoalId);
  const safeScenarioIndex = clampIndex(
    effectiveSession.scenarioIndex,
    scenarios.length || 1,
  );

  const scenario = scenarios[safeScenarioIndex] ?? {
    title: 'Scenario 1',
    mission: 'Practice belum tersedia untuk goal ini.',
    turns: [{ speaker: 'Partner' as const, line: 'Practice belum tersedia.' }],
  };

  const safeTurnIndex = clampIndex(effectiveSession.turnIndex, scenario.turns.length || 1);
  const turn = scenario.turns[safeTurnIndex] ?? {
    speaker: 'Partner' as const,
    line: 'Practice belum tersedia.',
  };

  const goalTitle =
    SPEAKING_GOALS.find((goal) => goal.id === safeGoalId)?.goal ?? 'Speaking Goal';

  const state: PracticeSnapshot['state'] = effectiveSession.isCompleted
    ? 'completed'
    : effectiveSession.isRunning
      ? 'running'
      : 'idle';

  return {
    state,
    goalId: safeGoalId,
    goalTitle,
    route: getGoalRoute(safeGoalId),
    scenarioTitle: scenario.title,
    scenarioMission: scenario.mission,
    scenarioIndex: safeScenarioIndex,
    scenarioCount: Math.max(1, scenarios.length),
    turnIndex: safeTurnIndex,
    turnCount: Math.max(1, scenario.turns.length),
    speaker: turn.speaker,
    line: turn.line,
    lineIpa: turn.ipa,
    lineTranslation: turn.translation,
    isRunning: effectiveSession.isRunning,
    isCompleted: effectiveSession.isCompleted,
    availablePhases: getPhaseOptions(),
    availableGoals: getGoalOptions(safePhaseId),
    availableScenarios: (scenarios.length
      ? scenarios
      : [{ title: 'Scenario 1', mission: '', turns: [] }]
    ).map((item, index) => ({
      index,
      title: item.title || `Scenario ${index + 1}`,
    })),
    selectedPhaseId: safePhaseId,
    selectedGoalId: safeGoalId,
    selectedScenarioIndex: safeScenarioIndex,
  };
};

const isCommand = (query: string, commands: Set<string>): boolean => {
  const normalized = normalizeText(query);
  if (!normalized) return false;
  if (commands.has(normalized)) return true;
  return Array.from(commands).some((command) => normalized.startsWith(`${command} `));
};

const moveNextTurn = (session: PracticeSession): PracticeSession => {
  const scenarios = getScenariosByGoalId(session.goalId);
  if (!scenarios.length) {
    return { ...session, isRunning: false, isCompleted: true };
  }

  const safeScenarioIndex = clampIndex(session.scenarioIndex, scenarios.length);
  const turns = scenarios[safeScenarioIndex]?.turns ?? [];
  const safeTurnIndex = clampIndex(session.turnIndex, turns.length || 1);

  if (safeTurnIndex + 1 < turns.length) {
    return {
      ...session,
      scenarioIndex: safeScenarioIndex,
      turnIndex: safeTurnIndex + 1,
      isRunning: true,
      isCompleted: false,
    };
  }

  if (safeScenarioIndex + 1 < scenarios.length) {
    return {
      ...session,
      scenarioIndex: safeScenarioIndex + 1,
      turnIndex: 0,
      isRunning: true,
      isCompleted: false,
    };
  }

  return {
    ...session,
    scenarioIndex: safeScenarioIndex,
    turnIndex: safeTurnIndex,
    isRunning: false,
    isCompleted: true,
  };
};

const movePrevTurn = (session: PracticeSession): PracticeSession => {
  const scenarios = getScenariosByGoalId(session.goalId);
  if (!scenarios.length) return session;

  const safeScenarioIndex = clampIndex(session.scenarioIndex, scenarios.length);
  const turns = scenarios[safeScenarioIndex]?.turns ?? [];
  const safeTurnIndex = clampIndex(session.turnIndex, turns.length || 1);

  if (safeTurnIndex > 0) {
    return {
      ...session,
      scenarioIndex: safeScenarioIndex,
      turnIndex: safeTurnIndex - 1,
      isRunning: true,
      isCompleted: false,
    };
  }

  if (safeScenarioIndex > 0) {
    const prevScenarioIndex = safeScenarioIndex - 1;
    const prevTurns = scenarios[prevScenarioIndex]?.turns ?? [];
    return {
      ...session,
      scenarioIndex: prevScenarioIndex,
      turnIndex: Math.max(0, prevTurns.length - 1),
      isRunning: true,
      isCompleted: false,
    };
  }

  return {
    ...session,
    scenarioIndex: 0,
    turnIndex: 0,
    isRunning: true,
    isCompleted: false,
  };
};

const getSuggestionsForSession = (session: PracticeSession | null): string[] => {
  if (!session) {
    return ['start', 'set scenario 1', 'buka speaking'];
  }

  if (session.isCompleted) {
    return ['start', 'set scenario 1', 'stop'];
  }

  return ['stop', 'ulang', 'next', 'prev'];
};

const buildAction = (snapshot: PracticeSnapshot): GuideAction[] => [
  {
    kind: 'route',
    label: `Buka Goal: ${snapshot.goalId}`,
    path: snapshot.route,
  },
];

const buildResult = (
  reply: string,
  options?: { session?: PracticeSession | null; pathname?: string },
): GuideModeResult => {
  speakingPracticeTick += 1;
  const snapshot = getSnapshot(options?.session ?? activeSession, options?.pathname);

  return {
    mode: 'speaking-practice',
    reply,
    actions: buildAction(snapshot),
    suggestions: getSuggestionsForSession(options?.session ?? activeSession ?? null),
    meta: {
      source: 'speaking-practice',
      speakingPractice: {
        tick: speakingPracticeTick,
        state: snapshot.state,
        goalId: snapshot.goalId,
        goalTitle: snapshot.goalTitle,
        route: snapshot.route,
        scenarioTitle: snapshot.scenarioTitle,
        scenarioMission: snapshot.scenarioMission,
        scenarioIndex: snapshot.scenarioIndex,
        scenarioCount: snapshot.scenarioCount,
        turnIndex: snapshot.turnIndex,
        turnCount: snapshot.turnCount,
        speaker: snapshot.speaker,
        line: snapshot.line,
        lineIpa: snapshot.lineIpa,
        lineTranslation: snapshot.lineTranslation,
        isRunning: snapshot.isRunning,
        isCompleted: snapshot.isCompleted,
        availablePhases: snapshot.availablePhases,
        availableGoals: snapshot.availableGoals,
        availableScenarios: snapshot.availableScenarios,
        selectedPhaseId: snapshot.selectedPhaseId,
        selectedGoalId: snapshot.selectedGoalId,
        selectedScenarioIndex: snapshot.selectedScenarioIndex,
      },
    },
  };
};

export const resetSpeakingPracticeSession = (): void => {
  activeSession = null;
  selectionState = null;
};

const introReply = 'Pilih goal dan scenario, lalu klik Start Practice.';

export const resolveSpeakingPracticeMode = (
  query: string,
  options?: { pathname?: string },
): GuideModeResult => {
  const normalized = normalizeText(query);

  if (!normalized) {
    if (activeSession?.isRunning) {
      return buildResult('Practice sedang berjalan. Ikuti turn pada card.', {
        session: activeSession,
        pathname: options?.pathname,
      });
    }

    if (activeSession?.isCompleted) {
      return buildResult('Practice selesai. Pilih scenario lalu Start untuk ulang.', {
        session: activeSession,
        pathname: options?.pathname,
      });
    }

    return buildResult(introReply, { pathname: options?.pathname });
  }

  if (isCommand(normalized, STOP_COMMANDS)) {
    activeSession = null;
    return buildResult('Practice dihentikan.', { pathname: options?.pathname });
  }

  const setGoalMatch = normalized.match(/^set goal\s+([a-z0-9\-]+)/i);
  if (setGoalMatch) {
    const nextGoalId = setGoalMatch[1];
    if (!isValidGoalId(nextGoalId)) {
      return buildResult('Goal tidak ditemukan. Pilih goal dari dropdown.', {
        pathname: options?.pathname,
      });
    }

    selectionState = {
      phaseId: getPhaseIdByGoalId(nextGoalId),
      goalId: nextGoalId,
      scenarioIndex: 0,
    };
    activeSession = null;
    return buildResult('Goal dipilih. Pilih scenario lalu klik Start Practice.', {
      pathname: options?.pathname,
    });
  }

  const setPhaseMatch = normalized.match(/^set phase\s+([a-z0-9\-]+)/i);
  if (setPhaseMatch) {
    const nextPhaseId = setPhaseMatch[1];
    if (!isValidPhaseId(nextPhaseId)) {
      return buildResult('Phase tidak ditemukan. Pilih phase dari dropdown.', {
        pathname: options?.pathname,
      });
    }

    const goalsInPhase = getGoalsByPhaseId(nextPhaseId);
    const nextGoalId = goalsInPhase[0]?.id ?? getDefaultGoalId(options?.pathname);
    selectionState = {
      phaseId: nextPhaseId,
      goalId: nextGoalId,
      scenarioIndex: 0,
    };
    activeSession = null;
    return buildResult('Phase dipilih. Pilih goal dan scenario lalu klik Start Practice.', {
      pathname: options?.pathname,
    });
  }

  const directGoalMatch = SPEAKING_GOALS.find((goal) => goal.id === normalized);
  if (directGoalMatch) {
    selectionState = {
      phaseId: directGoalMatch.phaseId,
      goalId: directGoalMatch.id,
      scenarioIndex: 0,
    };
    activeSession = null;
    return buildResult('Goal dipilih. Pilih scenario lalu klik Start Practice.', {
      pathname: options?.pathname,
    });
  }

  const setScenarioMatch = normalized.match(/^set scenario\s+(\d+)/i);
  if (setScenarioMatch) {
    const selection = ensureSelection(options?.pathname);
    const scenarios = getScenariosByGoalId(selection.goalId);
    const requested = Number(setScenarioMatch[1]);
    const safeScenarioIndex = clampIndex(requested - 1, scenarios.length || 1);

    selectionState = {
      phaseId: selection.phaseId,
      goalId: selection.goalId,
      scenarioIndex: safeScenarioIndex,
    };
    activeSession = null;

    return buildResult('Scenario dipilih. Klik Start Practice untuk mulai.', {
      pathname: options?.pathname,
    });
  }

  if (isCommand(normalized, START_COMMANDS)) {
    const selection = ensureSelection(options?.pathname);
    const scenarioOverrideMatch = normalized.match(/(?:scenario|skenario)\s*(\d+)/i);
    const scenarioIndex = scenarioOverrideMatch
      ? clampIndex(Number(scenarioOverrideMatch[1]) - 1, getScenariosByGoalId(selection.goalId).length || 1)
      : selection.scenarioIndex;

    selectionState = {
      phaseId: selection.phaseId,
      goalId: selection.goalId,
      scenarioIndex,
    };

    activeSession = {
      goalId: selection.goalId,
      scenarioIndex,
      turnIndex: 0,
      isRunning: true,
      isCompleted: false,
    };

    return buildResult('Practice dimulai. Ikuti giliran Partner lalu You.', {
      session: activeSession,
      pathname: options?.pathname,
    });
  }

  if (!activeSession) {
    return buildResult('Practice belum dimulai. Pilih goal/scenario lalu klik Start.', {
      pathname: options?.pathname,
    });
  }

  if (isCommand(normalized, NEXT_COMMANDS)) {
    activeSession = moveNextTurn(activeSession);
    if (activeSession.isCompleted) {
      return buildResult('Practice selesai untuk goal ini.', {
        session: activeSession,
        pathname: options?.pathname,
      });
    }
    return buildResult('Lanjut ke turn berikutnya.', {
      session: activeSession,
      pathname: options?.pathname,
    });
  }

  if (isCommand(normalized, PREV_COMMANDS)) {
    activeSession = movePrevTurn(activeSession);
    return buildResult('Mundur ke turn sebelumnya.', {
      session: activeSession,
      pathname: options?.pathname,
    });
  }

  if (isCommand(normalized, REPEAT_COMMANDS)) {
    activeSession = {
      ...activeSession,
      isRunning: true,
      isCompleted: false,
    };
    return buildResult('Ulang turn aktif.', {
      session: activeSession,
      pathname: options?.pathname,
    });
  }

  return buildResult('Perintah belum dikenali. Gunakan Start, Stop, atau Ulang Turn.', {
    session: activeSession,
    pathname: options?.pathname,
  });
};
