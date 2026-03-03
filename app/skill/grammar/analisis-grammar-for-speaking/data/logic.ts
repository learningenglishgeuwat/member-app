import type {
  GapReport,
  GoalReadiness,
  GrammarTopicCatalogItem,
  SpeakingGoal,
  TopicGapSeverity,
  TopicRubricScore,
} from '../../data/grammarTypes';

const SCORE_MAX = 12;

const severityByScore = (score: number | null): TopicGapSeverity => {
  if (score === null) {
    return 'unassessed';
  }
  if (score >= 10) {
    return 'good';
  }
  if (score >= 7) {
    return 'needs-improvement';
  }
  return 'critical-gap';
};

const scoreTotal = (rubric: TopicRubricScore): number =>
  rubric.concept_clarity +
  rubric.speaking_examples +
  rubric.interaction_patterns +
  rubric.common_mistakes +
  rubric.drills_or_tasks +
  rubric.usage_in_real_context;

const toSeverityRank = (severity: TopicGapSeverity): number => {
  switch (severity) {
    case 'critical-gap':
      return 0;
    case 'unassessed':
      return 1;
    case 'needs-improvement':
      return 2;
    case 'good':
      return 3;
    default:
      return 4;
  }
};

export const computeGoalReadiness = (
  goal: SpeakingGoal,
  rubricMap: Record<string, TopicRubricScore>,
  catalogMap: Record<string, GrammarTopicCatalogItem>,
): GoalReadiness => {
  const required = goal.requiredTopicIds ?? [];
  if (required.length === 0) {
    return {
      goalId: goal.goalId,
      readinessPercent: 0,
      scoredTopics: 0,
      unassessedTopics: 0,
      missingTopics: [],
      hasDataGap: true,
    };
  }

  let scoredTopics = 0;
  let unassessedTopics = 0;
  const missingTopics: string[] = [];

  let readinessAccumulator = 0;

  required.forEach((topicId) => {
    if (!catalogMap[topicId]) {
      missingTopics.push(topicId);
      return;
    }

    const rubric = rubricMap[topicId];
    if (!rubric) {
      unassessedTopics += 1;
      return;
    }

    scoredTopics += 1;
    readinessAccumulator += (scoreTotal(rubric) / SCORE_MAX) * 100;
  });

  const readinessPercent =
    required.length > 0 ? Math.round(readinessAccumulator / required.length) : 0;

  return {
    goalId: goal.goalId,
    readinessPercent,
    scoredTopics,
    unassessedTopics,
    missingTopics,
    hasDataGap: goal.requiredTopicIds.length === 0 || missingTopics.length > 0,
  };
};

export const getUnusedResourceTopics = (
  goals: SpeakingGoal[],
  topicCatalog: GrammarTopicCatalogItem[],
): GrammarTopicCatalogItem[] => {
  const catalogMap = topicCatalog.reduce<Record<string, GrammarTopicCatalogItem>>((acc, topic) => {
    acc[topic.topicId] = topic;
    return acc;
  }, {});

  const usedTopicIds = new Set<string>();
  goals.forEach((goal) => {
    goal.requiredTopicIds.forEach((topicId) => {
      if (catalogMap[topicId]) {
        usedTopicIds.add(topicId);
      }
    });
  });

  return topicCatalog.filter((topic) => !usedTopicIds.has(topic.topicId));
};

export const sortPriorityGaps = (
  rows: GapReport['auditedTopics'],
): GapReport['priorityGaps'] =>
  rows
    .filter((row) => row.severity !== 'good')
    .sort((a, b) => {
      const severityDelta = toSeverityRank(a.severity) - toSeverityRank(b.severity);
      if (severityDelta !== 0) {
        return severityDelta;
      }

      const scoreA = a.scoreTotal === null ? -1 : a.scoreTotal;
      const scoreB = b.scoreTotal === null ? -1 : b.scoreTotal;
      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }

      return a.topicLabel.localeCompare(b.topicLabel);
    });

export const buildGapReport = (
  goals: SpeakingGoal[],
  topicCatalog: GrammarTopicCatalogItem[],
  rubricMap: Record<string, TopicRubricScore>,
): GapReport => {
  const catalogMap = topicCatalog.reduce<Record<string, GrammarTopicCatalogItem>>((acc, topic) => {
    acc[topic.topicId] = topic;
    return acc;
  }, {});

  const usedTopicIds = new Set<string>();
  const goalsWithDataGap: string[] = [];

  goals.forEach((goal) => {
    if (!goal.requiredTopicIds.length) {
      goalsWithDataGap.push(goal.goalId);
      return;
    }

    const hasInvalidTopic = goal.requiredTopicIds.some((topicId) => !catalogMap[topicId]);
    if (hasInvalidTopic) {
      goalsWithDataGap.push(goal.goalId);
    }

    goal.requiredTopicIds.forEach((topicId) => {
      if (catalogMap[topicId]) {
        usedTopicIds.add(topicId);
      }
    });
  });

  const auditedTopics = Array.from(usedTopicIds)
    .map((topicId) => {
      const catalogItem = catalogMap[topicId];
      const rubric = rubricMap[topicId] ?? null;
      const total = rubric ? scoreTotal(rubric) : null;
      const severity = severityByScore(total);

      return {
        topicId,
        topicLabel: catalogItem.topicLabel,
        href: catalogItem.href,
        scoreTotal: total,
        severity,
        rubric,
        notes: rubric?.notes ?? 'Belum dinilai dengan rubrik ketat.',
      };
    })
    .sort((a, b) => a.topicLabel.localeCompare(b.topicLabel));

  const severityDistribution: Record<TopicGapSeverity, number> = {
    good: 0,
    'needs-improvement': 0,
    'critical-gap': 0,
    unassessed: 0,
  };

  auditedTopics.forEach((topic) => {
    severityDistribution[topic.severity] += 1;
  });

  const criticalGaps = auditedTopics.filter((topic) => topic.severity === 'critical-gap');
  const priorityGaps = sortPriorityGaps(auditedTopics);
  const unusedResourceTopics = getUnusedResourceTopics(goals, topicCatalog);

  return {
    totalGoals: goals.length,
    totalUsedTopics: usedTopicIds.size,
    severityDistribution,
    auditedTopics,
    criticalGaps,
    priorityGaps,
    unusedResourceTopics,
    goalsWithDataGap,
  };
};
