export type GrammarTopicCatalogItem = {
  groupId: string;
  groupTitle: string;
  topicId: string;
  topicLabel: string;
  href: string;
  keywords: string[];
};

export type GrammarTopicGroup = {
  groupId: string;
  groupTitle: string;
  topics: GrammarTopicCatalogItem[];
};

export type SpeakingGoalDifficulty = 'basic' | 'intermediate' | 'upper-intermediate';

export type SpeakingGoal = {
  goalId: string;
  title: string;
  communicativeFunction: string;
  difficulty: SpeakingGoalDifficulty;
  requiredTopicIds: string[];
  whyThisMatters: string;
  sampleTask: string;
};

export type RubricDimensionKey =
  | 'concept_clarity'
  | 'speaking_examples'
  | 'interaction_patterns'
  | 'common_mistakes'
  | 'drills_or_tasks'
  | 'usage_in_real_context';

export type TopicGapSeverity = 'good' | 'needs-improvement' | 'critical-gap' | 'unassessed';

export type TopicRubricScore = {
  topicId: string;
  concept_clarity: 0 | 1 | 2;
  speaking_examples: 0 | 1 | 2;
  interaction_patterns: 0 | 1 | 2;
  common_mistakes: 0 | 1 | 2;
  drills_or_tasks: 0 | 1 | 2;
  usage_in_real_context: 0 | 1 | 2;
  notes?: string;
};

export type GoalReadiness = {
  goalId: string;
  readinessPercent: number;
  scoredTopics: number;
  unassessedTopics: number;
  missingTopics: string[];
  hasDataGap: boolean;
};

export type AuditedTopicRow = {
  topicId: string;
  topicLabel: string;
  href: string;
  scoreTotal: number | null;
  severity: TopicGapSeverity;
  rubric: TopicRubricScore | null;
  notes: string;
};

export type GapReport = {
  totalGoals: number;
  totalUsedTopics: number;
  severityDistribution: Record<TopicGapSeverity, number>;
  auditedTopics: AuditedTopicRow[];
  criticalGaps: AuditedTopicRow[];
  priorityGaps: AuditedTopicRow[];
  unusedResourceTopics: GrammarTopicCatalogItem[];
  goalsWithDataGap: string[];
};
