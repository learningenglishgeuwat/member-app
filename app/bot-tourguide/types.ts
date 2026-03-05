export type GuideScope =
  | 'dashboard'
  | 'skill'
  | 'pronunciation'
  | 'grammar'
  | 'grammar-resource'
  | 'game-links'
  | 'general';

export type GuideMode =
  | 'navigation'
  | 'simulation'
  | 'flashcard'
  | 'qa'
  | 'tutorial'
  | 'speaking-practice'
  | 'learning-path';

export type TutorialCoachPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';

export type TutorialCoachFallbackPlacement =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'center';

export type TutorialAdvanceMode = 'on_target_click' | 'manual';
export type TutorialTargetStatus = 'ready' | 'missing' | 'clicked' | 'wrong-click';
export type TutorialDeviceProfile = 'mobile' | 'desktop';

export type GuideAnswerIntent =
  | 'word_explanation'
  | 'direct_answer'
  | 'comparison'
  | 'how_to'
  | 'example_request'
  | 'clarification'
  | 'fallback';

export type WordKnowledgeSourceType =
  | 'vocabulary'
  | 'qa-term'
  | 'route-term'
  | 'pronunciation-term'
  | 'grammar-term';

export type GuideRouteSource = 'route-scan' | 'manifest';

export type GuideIndexedRoute = {
  id: string;
  label: string;
  path: string;
  scope: GuideScope;
  keywords: string[];
  source: GuideRouteSource;
};

export type GuideSimulationTopic = string;

export type GuideSimulationEntry = {
  topicId: GuideSimulationTopic;
  title: string;
  commandTriggers: string[];
  componentKey: string;
  route: string;
};

export type GuideDashboardViewId =
  | 'dashboard'
  | 'notifications'
  | 'progress'
  | 'achievements'
  | 'tutorial'
  | 'settings'
  | 'device-approve'
  | 'help-support';

export type GuideQaSourceSection = {
  label: string;
  anchor?: string;
  route?: string;
};

export type GuideQaEntry = {
  topicId: string;
  title: string;
  route: string;
  keywords: string[];
  shortAnswer: string;
  sourceSections: GuideQaSourceSection[];
};

export type GuideIndex = {
  generatedAt: string;
  routes: GuideIndexedRoute[];
  simulations: GuideSimulationEntry[];
  qaEntries: GuideQaEntry[];
};

export type GuideAction =
  | {
      kind: 'route';
      label: string;
      path: string;
    }
  | {
      kind: 'simulation';
      label: string;
      simulationTopic: GuideSimulationTopic;
    }
  | {
      kind: 'dashboard-view';
      label: string;
      viewId: GuideDashboardViewId;
    }
  | {
      kind: 'logout';
      label: string;
    };

export type GuideSourceLink = {
  label: string;
  path: string;
};

export type GuideConfirmation =
  | {
      kind: 'typo';
      correctedQuery: string;
    }
  | {
      kind: 'candidate';
      correctedQuery: string;
    }
  | {
      kind: 'logout';
    };

export type ParsedQuery = {
  raw: string;
  normalized: string;
  correctedQuery?: string;
  hasTypoCorrection: boolean;
  tokens: string[];
  entities: string[];
  intent: GuideAnswerIntent;
  confidence: number;
  needsClarification: boolean;
  isFollowUp: boolean;
};

export type ConversationState = {
  lastIntent?: GuideAnswerIntent;
  lastTopicId?: string;
  lastEntity?: string;
  lastMode?: GuideMode;
  lastAnswerType?: GuideAnswerIntent;
  lastExplainedTerm?: string;
  lastExplainedSourceType?: WordKnowledgeSourceType;
  updatedAt: number;
};

export type ClarificationPrompt = {
  question: string;
  options: string[];
};

export type ComposedReply = {
  text: string;
  suggestions?: string[];
  action?: GuideAction;
  toneVariantId: string;
  answerType: GuideAnswerIntent;
};

export type GuideResultMeta = {
  source:
    | 'qa-ai-like'
    | 'legacy'
    | 'tutorial'
    | 'speaking-practice'
    | 'navigation'
    | 'learning-path';
  confidence?: number;
  intent?: GuideAnswerIntent;
  answerType?: GuideAnswerIntent;
  wordSourceType?: WordKnowledgeSourceType;
  matchedTerm?: string;
  learningPath?: {
    roadmapType: 'overview' | 'pronunciation' | 'speaking' | 'vocabulary';
    itemCount: number;
    totalDays: number;
    totalGoals?: number;
    totalWords?: number;
  };
  navigation?: {
    shouldAutoNavigate: boolean;
    confidenceBand: 'strong' | 'ambiguous' | 'weak';
    topScore: number;
    secondScore: number;
    matchedType: 'dashboard-view' | 'hub-route' | 'fallback-route' | 'logout' | 'none';
  };
  speakingPractice?: {
    tick?: number;
    state?: 'idle' | 'running' | 'completed';
    goalId: string;
    goalTitle: string;
    route: string;
    scenarioTitle: string;
    scenarioMission?: string;
    scenarioIndex: number;
    scenarioCount: number;
    turnIndex: number;
    turnCount: number;
    speaker: 'Partner' | 'You';
    line: string;
    lineIpa?: string;
    lineTranslation?: string;
    isRunning: boolean;
    isCompleted?: boolean;
    availablePhases?: Array<{ id: string; title: string }>;
    availableGoals?: Array<{ id: string; title: string }>;
    availableScenarios?: Array<{ index: number; title: string }>;
    selectedPhaseId?: string;
    selectedGoalId?: string;
    selectedScenarioIndex?: number;
  };
  tutorial?: {
    deviceProfile?: TutorialDeviceProfile;
    featureId?: string;
    featureTitle?: string;
    stepIndex?: number;
    stepCount?: number;
    stepTitle?: string;
    stepBody?: string;
    stepHint?: string;
    autoNavigatePath?: string;
    canNext?: boolean;
    canBack?: boolean;
    targetSelector?: string;
    placement?: TutorialCoachPlacement;
    fallbackPlacement?: TutorialCoachFallbackPlacement;
    highlightPadding?: number;
    advanceMode?: TutorialAdvanceMode;
    targetStatus?: TutorialTargetStatus;
    isCompleted?: boolean;
    completionTitle?: string;
    completionBody?: string;
  };
};

export type WordKnowledgeEntry = {
  id: string;
  sourceType: WordKnowledgeSourceType;
  term: string;
  normalizedTerm: string;
  aliases: string[];
  definitionId?: string;
  coachingTipId?: string;
  topicId?: string;
  topicTitle?: string;
  meaningId?: string;
  ipa?: string;
  exampleEn?: string;
  exampleTranslation?: string;
  shortAnswer?: string;
  route?: string;
};

export type WordMatchResult = {
  isWordIntent: boolean;
  queryTerm: string;
  entry: WordKnowledgeEntry | null;
  confidence: number;
  candidates: WordKnowledgeEntry[];
};

export type GuideModeResult = {
  mode: GuideMode;
  reply: string;
  actions: GuideAction[];
  suggestions: string[];
  sources?: GuideSourceLink[];
  confirmation?: GuideConfirmation;
  clarification?: ClarificationPrompt;
  meta?: GuideResultMeta;
};
